import {ExecutorContext} from '@nrwl/devkit';

/**
 * Function filtering out nx projects and returning the "applications" ones only (skip building)
 */
export function listAzureFunctions(context: ExecutorContext): string[] {
  const projects = Object.keys(context.workspace.projects);
  return projects.filter((projectName) =>
    ['application'].includes(
      context.workspace.projects[projectName].projectType,
    ),
  );
}
