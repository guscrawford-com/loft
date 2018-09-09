import {
    LoftCommand, Loft, LoftArguments, DEBUG,
    SCAFFOLDS_PATH, SCAFFOLDS,
    AnyCreateCommand, LoftToolkit, Logger
} from './any-create-command';
import { join } from 'path';
export class Scaffold extends AnyCreateCommand {
    constructor (private scaffoldName:string, private scaffoldSource:string, private dry: boolean, private logger:Logger) {
        super();
        //console.log(this.dry)
    }

    async execute() {
        //process.send()
        var relativeTo = process.cwd(), scaffoldSource = join(relativeTo, this.scaffoldSource),
        scaffoldName = this.scaffoldName.split(/\/|\\/).pop();
        await this.loadScaffolds();
        var copyTo = join(SCAFFOLDS_PATH, scaffoldName);
        this.logger.info(`├ 👟 🗂  creating scaffold: "${scaffoldName}"`);
        //this.logger.info(`├ ⎯ 📂  Copying ${scaffoldSource} into ${copyTo}`);
        try {
            var copy = await new LoftToolkit.copy(scaffoldSource, null, false, this.dry, this.logger).to(copyTo).catch(e=>this.logger.error(`❌  Failed to create scaffold: ${scaffoldName}\n${e}`));
        } catch(e) { this.logger.error(`❌  Failed to create scaffold: ${scaffoldName}\n${e}`);}
    }
}