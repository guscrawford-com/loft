import {
    readdir, copyFile,
    lstat, mkdir, exists
} from 'fs';
import { join } from 'path';
import { DEBUG, LtkArray } from '../loft';
import { Logger } from './loft-toolkit';
const VERBOSE_PREFIX = ' ⎯';
export class CopyOperation {
    private ignoring:string[] = [];
    constructor(private from:string, private verbosePrefix?:string, private structureOnly?:boolean, private dryCopy?:boolean, private logger?:Logger) { }
    get structure() {
        this.structureOnly = true;
        return this;
    }
    get dry() {
        this.dryCopy = true;
        return this;
    }
    ignore(...globs:string[]) {
        Array.prototype.push.apply(this.ignoring, globs);
        return this;
    }
    public async to(dest) {
        var operation = this;
        if(!operation.verbosePrefix) operation.verbosePrefix = VERBOSE_PREFIX;
        return new Promise<any>(function(resolve, reject){
            lstat(operation.from, function (err, info) {
                var thisPathStack = operation.from.split(/\/|\\/g), thisDir = thisPathStack.pop();
                if(!info) return reject(new Error(`Loft can\'t locate: ${operation.from}`))
                if (err) return reject(err);
                if (info.isDirectory()) {
                    if (thisDir === '.git'||thisDir === 'node_modules') {
                        (operation.logger || console).debug(`├ ${operation.verbosePrefix}ℹ️  Skipping .git and node_module at ${operation.from}`);
                        return resolve(true);
                    }
                    if (DEBUG==="*"||DEBUG==="copy"||operation.dryCopy) (operation.logger || console).debug(`├${operation.verbosePrefix}📂  ${operation.dryCopy?'Would be copying':'Copying'} to ${dest}`);
                    exists(dest, function (targetExists) {
                        if(targetExists) throw(new Error(`Loft doesn\'t overwrite directories (${dest} isn't empty)`));
                        if (!operation.dryCopy) mkdir(dest, function (err) {
                            cycleDir();
                        }); // mkdir
                        else {
                            cycleDir();
                        }
                        function cycleDir() {
                            return readdir(operation.from,"utf8", function (err, list) {
                                if(err) reject(err);
                                //(operation.logger || console).log(list);
                                var operations = [];
                                list.forEach(
                                    (item)=> operations.push(
                                        new CopyOperation(
                                                join(operation.from,item),
                                                operation.verbosePrefix + VERBOSE_PREFIX,
                                                operation.structureOnly,
                                                operation.dryCopy
                                        )/*.ignore(
                                                operation.ignoring.filter(pat=>pat.split(/\/|\\/g))
                                            )*/.to(
                                                join(dest,item)
                                            )
                                    )
                                );
                                Promise.all(operations).then(done=>resolve(true));
                            });
                        }
                    })
                }
                else {
                    if (DEBUG==="*"||DEBUG==="copy"||operation.dryCopy) (operation.logger || console).debug(`├${VERBOSE_PREFIX}${operation.verbosePrefix}📄  ${dest} ${operation.structureOnly?'ready for scaffolding...':(operation.dryCopy?'would copy...':'copying...')}`);
                    if (!operation.structureOnly && !operation.dryCopy)
                        copyFile(operation.from, dest, function(err){
                            if (err) reject(err);
                            resolve(true)
                        });
                    else resolve(true);
                }
            });


        });
    };
}
