
//import * as Handlebars from 'handlebars';
import { LoftToolkit, Logger } from '../../common/loft-toolkit';
import { join } from 'path';
import { readdir, PathLike } from 'fs';
import { AnyCreateCommand, LOFT_PATH, Loft, LoftArguments, DEBUG } from './any-create-command';
export const SCAFFOLDS_PATH = join(LOFT_PATH, 'scaffolds');
export const SCAFFOLDS = {};
export class SimpleHash {
    [key:string]:string|SimpleHash;
}
export class ScaffoldWith {
    $files: SimpleHash;
}
export class Workspace extends AnyCreateCommand {
    constructor (
        private scaffoldName:string,
        private targetDest:string,
        private data:SimpleHash&ScaffoldWith,
        private dry:boolean,
        private logger: Logger
    ) {
        super();
    }
    async execute() {
        this.logger.info(`├ - - -  📂 workspace`);
        await this.loadScaffolds();
        if (!this.scaffoldName) throw new Error(`Loft can't find '${this.scaffoldName}' in ${SCAFFOLDS_PATH}`)
        var copyFrom = join(SCAFFOLDS_PATH,this.scaffoldName),
            copyTo = this.targetDest;
            this.logger.info(`├⎯📂  Copying ${copyFrom} into ${copyTo}`);
        var copy = await new LoftToolkit.copy(copyFrom, null, true, this.dry, this.logger).to(copyTo);

        this.logger.info(`├⎯🔄  Scaffolding code with data...`);
        if (DEBUG==="*"||DEBUG==="data") this.logger.info(this.data);
        var scaffold = await new LoftToolkit.scaffold(copyFrom, copyTo, null, this.logger).with(this.data);
    }
}