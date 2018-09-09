import { join } from 'path';

const PACKAGE = require('../package.json'), DEBUG = process.env.LOFT_DEBUG || PACKAGE.debug;
//console.info(`️\n☁️  Loft ${PACKAGE.version}`);
const LOFT_PATH = join(process.env.USERPROFILE || process.env.HOME, '.loft');
//console.log(LOFT_PATH);
export { PACKAGE, DEBUG, LOFT_PATH };
import * as commands from './commands';
export class Loft {
    constructor(public path?:string) {}
}

export { LoftToolkit, LtkArray, LtkString } from './common/loft-toolkit';
export { LoftCommand, LoftArguments} from './loft-command';
export { Workspace, Scaffold, ScaffoldWith, SCAFFOLDS, SCAFFOLDS_PATH } from './commands'