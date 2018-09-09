import {LtkArray} from './loft';
export class LoftCommand {
    public name:string; // The unique name of the command
    public icon:string = "⌨️"; // Fun!
    constructor() {
    }
    async execute() {
        
    }
}
export class LoftArguments {
    constructor() { }
    positional:LtkArray<string> = process.argv.slice(2) as any;
}