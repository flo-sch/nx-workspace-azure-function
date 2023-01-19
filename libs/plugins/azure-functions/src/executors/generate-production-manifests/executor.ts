import {copyFileSync} from 'node:fs';
import path from 'node:path';
import {
  ExecutorContext,
  logger,
  readJsonFile,
  writeJsonFile,
} from '@nrwl/devkit';

import {listAzureFunctions} from '../../projects';
import {BuildExecutorSchema} from './schema';

export interface ExecutorResult {
  success: boolean;
  manifest: string;
}

export default async function execute(
  _options: BuildExecutorSchema,
  context: ExecutorContext,
): Promise<ExecutorResult> {
  const applications: string[] = listAzureFunctions(context);

  logger.debug(`Generating azure functions manifests`);

  // Parse all built project's generated "package.json" (from webpack)
  const productionDependencies = applications.reduce<Set<string>>(
    (dependencies, application) => {
      const projectConfiguration = context.workspace.projects[application];
      let projectDependencies: Array<string> = [];

      try {
        const manifestPath = path.resolve(
          projectConfiguration.targets.build?.options?.outputPath,
          'package.json',
        );
        const projectManifest = readJsonFile(manifestPath);
        projectDependencies = Object.keys(projectManifest.dependencies);
      } catch (error) {
        logger.warn(
          `Unable to retrieve dependencies of project "${application}": ${error.message}`,
        );
      }

      projectDependencies.forEach((dependency) => {
        dependencies.add(dependency);
      });

      return dependencies;
    },
    new Set<string>(),
  );

  logger.debug(
    `Identified ${productionDependencies.size} among ${applications.length} projects`,
  );

  let success = true;
  const rootManifestPath = path.resolve(context.root, 'package.json');
  const generatedManifestPath = path.resolve(context.root, 'dist/package.json');

  try {
    // Get locked versions from root package.json
    const rootManifest = readJsonFile(rootManifestPath);
    const versionedDependencies = Array.from(productionDependencies)
      .sort()
      .reduce((dependencies, dependencyName) => {
        dependencies[dependencyName] =
          rootManifest.dependencies[dependencyName];
        return dependencies;
      }, {});

    const manifestContent = {
      name: 'azure-function-app-manifest',
      private: true,
      dependencies: versionedDependencies,
    };
    writeJsonFile(generatedManifestPath, manifestContent, {
      spaces: 2,
    });
    logger.info(`Successfully generated ${generatedManifestPath}`);

    copyFileSync(
      path.resolve(context.root, 'yarn.lock'),
      path.resolve(context.root, 'dist/yarn.lock'),
    );
    logger.info(`Successfully copied lock file`);
  } catch (error) {
    success = false;
    logger.error(error);
  }

  return {
    success,
    manifest: generatedManifestPath,
  };
}
