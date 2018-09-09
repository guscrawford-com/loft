![Loft](https://bytebucket.org/team-gus/loft-interface/raw/9d8c4111b5438307cce8458865262688258bb496/loft-logo.png)

# Write less code, manage workspace clutter

Loft is a tool you can use anywhere to take a snapshot of code and re-scaffold to another folder.

You can copy work from anywhere, annotate the file with variables and re-generate your code ad-hoc for a new purpose.

> [Install](#Install) | [Create a Scaffold](#create-a-scaffold) | [Use a Scaffold](#use-a-scaffold)

### loft

**noun**
1. a room or space directly under the roof of a house or other building, which maybe used for accomodations or storage.
2. kick, hit, or throw (a ball or missile, *or code*) high up.
   - *"he lofted the code out of his badly trashed home-directory*"

## When and why?

- You have a lot of boiler-plate code outside of, or no longer manageable by another tooling framework.
- You have local code that you don't want to publicize or gist, don't want to lose, but want out of your home directory.
- You want to copy a working project as a more general seed.
- You're doing something replicable, it's at a stage where it may be ready to be re-used separately, and you want to be able to extract and re-test it in isolation.

## Why not...

- [Yeoman](http://yeoman.io/) Yeoman is a mature, extensible scaffolder with a deep library of seed generators; Yeoman is my-man (punny), **but** I don't always need a code-generator nor am I "bound within it's guiderails" (have a team project where I can integrate a yeoman generator) in many cases.
    - Loft like Yeoman, is *language agnostic*.
    - Yeoman is *opiniated* by it's own concession, while Loft is **not opinionated**; it's focus is to further ignore workflow, frameworks, environment, etc. and just template files.
    - There is no presumption about the existing tooling in the framework or modification outside it's internal scaffolding activity.

## Install

`yarn global add @guscrawford.com/loft-interface`

## Create a Scaffold

Copy work anywhere to a folder in your home directory (`$HOME|$USERPROFILE/.loft/scaffolds`)


`loft [<new> scaffold <my-snippet-name>] [path-to-snippet]`

*example:*

`loft new scaffold my-code ./src`

- default `path-to-snippet` is current directory if unspecified
- `<createable=scaffold`> or "`scaffold`" argument above is required to *rename* a scaffold/snippet

## Use a Scaffold

Copy work from your scaffolds into anywhere you're working.

`loft <new> [workspace] my-snippet <target-directory>`

*example:*

`loft new my-code my-cloned-code`

### Annotate your Code with Variables & Replace Them

You can prep (or edit already stored code `$HOME|$USERPROFILE/.loft/scaffolds`) your code with commented annoations in any script language that has a way to comment, or write innocuous text that the scaffolding engine can pick up.  (There are plans to add some kind of `loft.config.json` file so that one could externally scope variable replacements in a JSON file with rigid structure requirement, but for now you'd have to essentially add properties if you're not using JSON with comments).

*example:*

Presuming I already have a scaffold named `any-command` with this file in it commented as so:

```
//@loft:XXX
export class AnyXXXCommand extends LoftCommand{
    constructor (args) {
        super(args);
    }
    //@loft:xxx
    name = "xxx";
    async loadScaffolds() {
        await LoftToolkit.ensure(LOFT_PATH);
        return new Promise(
            function (res, rej){
                ...
            }
        );
    }
}
```

Running: `loft new any-command help-command XXX Help file:xxx help`

Will rename files matching the `file:` arguments to their supplied parameter, and replace file contents matching the `@loft:` variable prefix against the paramater pairs supplied in the `XXX` example.

*example output:*

```
//@loft:XXX
export class AnyHelpCommand extends LoftCommand{
    constructor (args) {
        super(args);
    }
    //@loft:xxx
    name = "help";
    async loadScaffolds() {
        await LoftToolkit.ensure(LOFT_PATH);
        return new Promise(
            function (res, rej){
                ...
            }
        );
    }
}
```

### Complete Annotation List

`@loft:<variable>` - defines or 'scopes' a *variable* in the code for replacing; could be part of a variable, the whole thing, it currently can be any non-whitespace character to leave things open for further pattern matching, but for now is reccomended you use a variable name that will not break your code from running, un-annotated.

Scoping is good on a per-file basis.  Matching filenames is currently at a whole-project scope and has no variable syntax beyond specifying a simple pattern to match on the command line with the `file:` prefixed argument.

`@deloft:<variable>` - removes or 'descopes' a *variable* in the code from any further replacing;

[![NPM](https://res-5.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/v1397185970/7ce9936f6f2c2b2b7769c9371ff76caf.png)](https://www.npmjs.com/package/@guscrawford.com/loft-interface)