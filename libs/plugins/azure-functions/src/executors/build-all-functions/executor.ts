import {ExecutorContext, runExecutor, logger} from '@nrwl/devkit';

import {listAzureFunctions} from '../../projects';
import {BuildExecutorSchema} from './schema';

export interface ExecutorResult {
  success: boolean;
  functions: number;
}

/**
 * Run "build" task with specific parameters for serverless azure functions
 * @see https://nx.dev/packages/webpack/executors/webpack#options
 */
async function buildProject(projectName: string, context: ExecutorContext) {
  for await (const result of await runExecutor(
    {
      project: projectName,
      target: 'build',
      configuration: 'production',
    },
    {
      // The content of such files is not publicly accessible from the Function App endpoints anyway
      extractLicenses: false,
      // Generate package.json with the list of dependencies. This will allow the "generate-production-manifests" to merge all runtime dependencies together
      generatePackageJson: true,
      // The function name is hardcoded in each respective {functionName}/function.json file as "scriptFile"
      outputHashing: 'none',
      watch: false,
    },
    context,
  )) {
    return result.success;
  }
}

export default async function execute(
  _options: BuildExecutorSchema,
  context: ExecutorContext,
): Promise<ExecutorResult> {
  const applications: string[] = listAzureFunctions(context);

  logger.debug(
    `Running "build" target in ${
      applications.length
    } azure functions: [${applications.join(', ')}]`,
  );

  /**
   * Run "build" task with specific parameters for serverless azure functions
   * @see https://nx.dev/packages/webpack/executors/webpack#options
   */
  const results: boolean[] = [];
  for (const projectName of applications) {
    results.push(await buildProject(projectName, context));
  }

  return {
    success: results.every((result) => !!result),
    functions: results.length,
  };
}
