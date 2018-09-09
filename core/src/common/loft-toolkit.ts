import {
    readdir, copyFile,
    lstat, mkdir, exists,
    createReadStream, createWriteStream,
    open, close
} from 'fs';
declare interface Logger {
    info (msg:any);
    error (msg:any);
    debug (msg:any);
    warn (msg:any);
}
export {Logger};
import { join } from 'path';
// While I don't want to totally re-invent the wheel, the platform needs to be extensible and I want a simpler api that guards against certain things
import { CopyOperation } from './copy-operation';   // new LoftToolkit.copy(fromPath)[structure].to(dest)
import { ScaffoldOperation } from './scaffold-operation'; // new LoftToolkit.copy(fromScaffoldPath).with(dataToReplace)
export type LtkArray<T> = Array<T>&{
    first(plus?:number):T;
    second():T;
    last(minus?:number):T;
    secondLast():T;
};
(Array.prototype as any).first = function(plus:number = 0) {
    return this[0+plus];
};
(Array.prototype as any).second = function() {
    return this.first(1)
};
(Array.prototype as any).last = function(minus:number = 0) {
    return this[(this['length']||0)-(minus+1)];
};
(Array.prototype as any).secondLast = function() {
    return this.last(1);
};
export type LtkString = string&{
    toPascalCase():string;
};
(String.prototype as any).toPascalCase = function() {
    return `${(this as string).charAt(0).toLocaleUpperCase()}${(this as string).substr(1).toLocaleLowerCase()}`;
};
export class LoftConsoleKit {
    static reset = () =>
        process.stdout.write('\033c')
}
/**
 * @class EnsurePathOperation
 * @description Encapsulates utilities to ensure a folder path exists
 */
class EnsurePathOperation {
    /**
     * @class EnsurePathOperation
     * @function ensure
     * @description Encapsulates utilities to ensure a folder path exists
     * @param path {string|PathLike} Verify this path exists or create it
     * @returns Returns true asyncronously or throws a root exception
     */
    static async ensure(path:string) {
        var operation = this;
        return new Promise(function(res,rej){
            exists(path, function(existing) {
                if (existing) res(true);
                else mkdir(path, function (er) {
                    if (er) rej(er);
                    res(true);
                });
            });
        });
    }
}

export class LoftToolkit {
    static console = LoftConsoleKit;
    static copy = CopyOperation;
    static scaffold = ScaffoldOperation;
    static ensure = EnsurePathOperation.ensure;
}

