#!/usr/bin/env node
import * as sourceMapSupport from 'source-map-support';
sourceMapSupport.install();
import * as cli from 'caporal';
import { join } from 'path';
import { Scaffold, Workspace, SCAFFOLDS_PATH, LOFT_PATH, DEBUG } from '@guscrawford.com/loft-core';
import { readdir, lstat } from 'fs';
const WORKSPACE = 'workspace', SCAFFOLD = 'scaffold';
//console.log(process.argv)
/*if (process.argv.length===3 && process.argv[2]!=='list')*/ // loft <folder>
    // main(
    //     {
    //         target:process.argv[2],
    //         scaffold:process.argv[2],
    //         creatable:'scaffold',
    //         replacements:[]
    //     }, {}, console
    // );
/*else {*/
const PACKAGE = require('../package');
cli
.version(loftBanner())
    .argument('[scaffold]','path of directory to create a scaffold of')
    .option('--list', 'list the workspaces in  your ./loft/scaffolds')
    .option('--dry', 'do not perform any writes, preview outcome')
        .action(scaffoldShorthand)
.command('new','create a new scaffold or workspace')
    .argument('<creatable>',creatableSubjects().join(' | '))
    .argument('[scaffold]','name of scaffold folder to either create or use')
    .argument('[target]','the path to copy files')
    .argument('[replacements...]','variable / replacement pairs')
        .option('--dry',`preview only`)
        .action(main);
cli.parse(process.argv)/*;}*/

function list(args, options, logger) {
    logger.info(loftBanner());
    //console.log(LOFT_PATH)
    readdir(SCAFFOLDS_PATH, (err, info)=>{
        if (err) {
            logger.error(`❌ Failed to list ${SCAFFOLDS_PATH}: ${err}`);
            return;
        }
        logger.info(`├📂 🔍 Listing contents of ${SCAFFOLDS_PATH}`);
        info.forEach((folder)=>{
            lstat(join(SCAFFOLDS_PATH,folder), (err, info)=>{
                if (!err && info.isDirectory())
                    logger.info(`├ ⎯ 🗂 ${folder}`);
            });
        });

    });
}
function scaffoldShorthand(args, options, logger) {
    if (options.list) return list(args, options, logger);
    //console.info(args);
/*
  Guss-MacBook-Pro:i guscrawford$ loft
/Users/guscrawford/.loft
/Users/guscrawford/.loft

/Users/guscrawford/.config/yarn/global/node_modules/@guscrawford.com/loft-interface/node_modules/caporal/lib/program.js:278
    const kebabOptions = Object.keys(options).reduce(function(result, key) {
                                ^
TypeError: Cannot convert undefined or null to object
    at Function.keys (<anonymous>)
    at Program.exec (/Users/guscrawford/.config/yarn/global/node_modules/@guscrawford.com/loft-interface/node_modules/caporal/lib/program.js:278:33)
    at Command.scaffoldShorthand [as _action] (/Users/guscrawford/.config/yarn/global/node_modules/@guscrawford.com/loft-interface/src/main.ts:55:18)
    at Command._run (/Users/guscrawford/.config/yarn/global/node_modules/@guscrawford.com/loft-interface/node_modules/caporal/lib/command.js:408:40)
    at Program._run (/Users/guscrawford/.config/yarn/global/node_modules/@guscrawford.com/loft-interface/node_modules/caporal/lib/program.js:165:16)
    at Program.parse (/Users/guscrawford/.config/yarn/global/node_modules/@guscrawford.com/loft-interface/node_modules/caporal/lib/program.js:268:17)
    at Object.<anonymous> (/Users/guscrawford/.config/yarn/global/node_modules/@guscrawford.com/loft-interface/src/main.ts:33:5)
    at Module._compile (internal/modules/cjs/loader.js:689:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
    at Module.load (internal/modules/cjs/loader.js:599:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
    at Function.Module._load (internal/modules/cjs/loader.js:530:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)
    at startup (internal/bootstrap/node.js:266:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:596:3)
*/ 
    // (cli as any).exec([
    //     'new', 'scaffold',
    //     args.scaffold
    // ]);
    return main({
        creatable:'scaffold',
        scaffold:args.scaffold || process.cwd()
    }, options, logger);
}
function loftBanner() {
    return `🌩  ${PACKAGE.name} ${PACKAGE.version}`;
}
function main(args, options, logger){
    logger.info(loftBanner());
    if (DEBUG) logger.info(`├⚙️  Source mapping is on...`);
    try {
        const data = {$files:{}}, fileVarParamPrefix = 'file:';
        if (!subjectIsCreatable(args.creatable)) {
            if (args.target) args.replacements.unshift(args.target)
            args.target = args.scaffold;
            args.scaffold = args.creatable;
            // Infer the default 'loft new ...'
            args.creatable = defaultCreatable();
        }
        if (!args.target) {
            //console.log(SCAFFOLDS_PATH)
            args.target = '.';
        }
        if (args.replacements)
            for (var replacement = 0; replacement < args.replacements.length; replacement += 2) {
                if (args.replacements[replacement].startsWith(fileVarParamPrefix))
                    data.$files[
                        args.replacements[replacement].substr(fileVarParamPrefix.length)
                    ] = args.replacements[replacement+1];
                else data[args.replacements[replacement]] = args.replacements[replacement+1];
            }
        //logger.info(options.dry)
        //console.log(options.verbose)
        switch(args.creatable) {
            case WORKSPACE:
                new Workspace(args.scaffold, args.target, data, !!options.dry, logger).execute();
                break;
            case SCAFFOLD:
                new Scaffold(args.scaffold || process.cwd(), args.target, !!options.dry, logger).execute();
                break;

        }
    }
    catch (ex) {
        logger.error(`❌ Failed to ${args.creatable} ${SCAFFOLDS_PATH}: ${ex}`);
    }
}

function subjectIsCreatable(arg:string) {
    return creatableSubjects().find(cs=>cs===arg);
}
function creatableSubjects() {
    return [WORKSPACE, SCAFFOLD]
}
function defaultCreatable() { return WORKSPACE }