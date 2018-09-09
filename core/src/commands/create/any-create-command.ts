import { Loft, LoftCommand, LoftArguments, DEBUG, LOFT_PATH } from '../../loft';
import { LoftToolkit, Logger } from '../../common/loft-toolkit';
import { join } from 'path';
import { readdir } from 'fs';
//console.log(LOFT_PATH);
export const SCAFFOLDS_PATH = join(LOFT_PATH, 'scaffolds');
export const SCAFFOLDS = {};
export class AnyCreateCommand extends LoftCommand{
    constructor () {
        super();
    }
    name = "new";
    icon = "✨";
    async loadScaffolds() {
        await LoftToolkit.ensure(LOFT_PATH);
        return LoftToolkit.ensure(SCAFFOLDS_PATH);
    }
}
export {
    Loft, LoftCommand, LoftArguments, DEBUG, LOFT_PATH, LoftToolkit, Logger
}