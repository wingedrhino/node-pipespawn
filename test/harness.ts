import { logger, RhinoLogger } from 'rhinologger'

export async function beforeAll (): Promise<void> {
  logger.setLevel(RhinoLogger.DEBUG)
  logger.log(RhinoLogger.INFO, 'Begin: Pipespawn Tests', null)
}

export async function afterAll (): Promise<void> {
  logger.log(RhinoLogger.INFO, 'End: Pipespawn Tests', null)
}