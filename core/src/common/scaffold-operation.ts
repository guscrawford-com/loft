import {
    readdir, copyFile,
    lstat, mkdir, exists,
    createReadStream, createWriteStream,
    open, close
} from 'fs';
import { join } from 'path';
import * as LineReader from 'readline';
import { DEBUG } from '../loft';
import { Logger } from '../common/loft-toolkit';
const scopeInExpression = /@loft\:\s*(\S|[$])+/g, stripScopeDirective = /@(de)?loft\:\s*/g;
const scopeOutExpression = /@deloft\:\s*(\S|[$])+/g;
/**
 * @class ScaffoldOperation
 * @description Encapsulates utilities around transforming target files as they're copied
 */
export class ScaffoldOperation {
    /**
     * @param scaffold {string} Path of the source folder being copied
     * @param target  {string} Destination root of the files being transformed
     * @param verbosePrefix {string} *internal* can be used to prefix debug log output
     */
    constructor(private scaffold:string, private target:string, private verbosePrefix?:string, private logger?:Logger) { }
    /**
     * 
     * @param data {object} A hash of values to replace in-scope variable names with
     */
    public async with(data) {
        var operation = this;
        if(!operation.verbosePrefix) operation.verbosePrefix = '';
        return new Promise<any>(function(resolve, reject){
            lstat(operation.scaffold, function (err, info) {
                var thisDir = operation.scaffold.split(/\/|\\/g).pop();
                if(!info) return reject(new Error(`Loft can\'t locate: ${operation.scaffold}`))
                if (err) return reject(err);
                if (info.isDirectory()) {
                    if (thisDir === '.git'||thisDir === 'node_modules') {
                        (operation.logger || console).info(`⎮ ${operation.verbosePrefix}ℹ️  Skipping .git and node_module at ${operation.scaffold}`);
                        return resolve(true);
                    }
                    if (DEBUG==="*"||DEBUG==="scaffold") (operation.logger || console).info(`⎮ ${operation.verbosePrefix}📂  Scaffolding in ${operation.scaffold}`);

                    exists(operation.scaffold, function (targetExists) {
                        readdir(operation.scaffold,"utf8", function (err, list) {
                            if(err) reject(err);
                            var operations = [];
                            list.forEach(
                                (item)=> operations.push(
                                    new ScaffoldOperation(
                                            join(operation.scaffold,item),
                                            join(operation.target, item),
                                            operation.verbosePrefix + '  '
                                        ).with(
                                            data
                                        )
                                )
                            );
                            Promise.all(operations).then(done=>resolve(true)).catch(err=>reject(err));
                        });
                    });
                }
                else {
                    if(DEBUG) (operation.logger || console).info(`⎮ ${operation.verbosePrefix}📄  Scaffolding ${operation.target}...`);
                    // [1] At a file level track commented @loft:x and @deloft:x commands to bring variable replacements in and out of scope
                    var lineNo = 0, loftVariablesScope = {};
                    var transformFilenameScope = Object.keys(data.$files).find(pat=>operation.target.match(new RegExp(pat))!==null),
                        transformedFilename = transformFilenameScope?operation.target.replace(new RegExp(transformFilenameScope),data.$files[transformFilenameScope]):operation.target;
                    if((DEBUG==="*"||DEBUG==="scaffold")&&(transformFilenameScope||data.$files[transformFilenameScope]||(operation.target!==transformedFilename))) {
                        (operation.logger || console).debug(data)
                        (operation.logger || console).debug(`├⚙️ 🔄 Filename match: ${transformFilenameScope} becoms ${data.$files[transformFilenameScope]}`)
                        (operation.logger || console).debug(`├⚙️ 🔄 Filename change: ${operation.target} to ${transformedFilename}`)
                    }
                    const
                        lineReader = LineReader.createInterface({ input: createReadStream(operation.scaffold) }),
                        lineWriter = createWriteStream(transformedFilename);
                    lineReader.on(
                        'line',
                        function (line:string) {
                            var scaffoldedLine = line, scopeChanges, loftVariables, inScopeVariables, replaced = false;
                    // [2] Read line-by-line and check for @de/loft directives
                            try {
                                if (!lineNo && DEBUG) (operation.logger || console).info(`📑 ${operation.scaffold.split('|').pop()}`);    // Working file...
                                if (DEBUG==="*"||DEBUG==="scaffold") (operation.logger || console).info(`${lineNo}: ${line}`);    // Debug line numbers...
                    //      [2.1] Detect alterations to scope, turn the variables on or off on the loftVariablesScope hash
                                scopeChanges = {
                                    in:line.match(scopeInExpression),
                                    out:line.match(scopeOutExpression)
                                };
                                scopeChanges.in&&scopeChanges.in.forEach(add=>
                                    loftVariablesScope[add.replace(stripScopeDirective,'')]=true
                                );
                                scopeChanges.out&&scopeChanges.out.forEach(rem=>
                                    loftVariablesScope[rem.replace(stripScopeDirective,'')]=false
                                );
                                loftVariables = Object.keys(loftVariablesScope), inScopeVariables = loftVariables.filter(v=>loftVariablesScope[v]);
                                loftVariables.forEach(replacement=>{
                                    if (loftVariablesScope[replacement]&&!(scopeChanges.in||scopeChanges.out)) {
                                        scaffoldedLine=scaffoldedLine.replace(new RegExp(replacement, 'g'), data[replacement]);
                                        replaced = scaffoldedLine !== line;
                                    }
                                    if (DEBUG==="*"||DEBUG==="scope") {
                                        if(replaced && scopeChanges.in||scopeChanges.out)
                                            (operation.logger || console).debug(`├⚙️ Scope change: ${JSON.stringify(scopeChanges)}`)
                                        if(replaced && inScopeVariables.length)
                                            (operation.logger || console).debug(`├⚙️ Scope variables: ${JSON.stringify(loftVariablesScope)}`);
                                        if(replaced && inScopeVariables.length)
                                            (operation.logger || console).debug(`├⚙️ 🔄 ${replacement} 🔜  ${loftVariablesScope[replacement]}`);
                                    }

                                    //if (replaced) (operation.logger || console).info(`🔥 ${scaffoldedLine}`);
                                    if (replaced && typeof data[replacement] === "undefined") {
                                        scaffoldedLine = line;
                                        (operation.logger || console).warn(`⚠️  A file in your scaffold '${operation.scaffold}' referenced an undefined loft variable '${replacement}' (line not replaced)`);
                                    }
                                    else if (replaced && !loftVariablesScope[replacement]) {
                                        scaffoldedLine = line;
                                        (operation.logger || console).info(`⚠️  Descoped loft variable '${loftVariablesScope[replacement]}' referenced (no replacement was made)...`);
                                    }
                                }); // each variable ever scoped in this doc
                                lineWriter.write(`${scaffoldedLine}\n`);
                                if(replaced) (operation.logger || console).info(`♻️ ${scaffoldedLine}`);
                                lineNo ++;
                            }
                            catch(ex) {
                                (operation.logger || console).error(ex);
                            }
                        }   // lineReader.on('line', ()=>)
                    );  //    lineReader.on('line',...)
                    lineReader.on('close', function() {
                        lineNo = 0, loftVariablesScope = {};
                        resolve(true);
                    });
                }
            });
        });
    };
}