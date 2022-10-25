import { logger, RhinoLogger } from 'rhinologger';
export async function beforeAll() {
    logger.setLevel(RhinoLogger.DEBUG);
    logger.log(RhinoLogger.INFO, 'Begin: Pipespawn Tests', null);
}
export async function afterAll() {
    logger.log(RhinoLogger.INFO, 'End: Pipespawn Tests', null);
}
//# sourceMappingURL=harness.js.map