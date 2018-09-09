## [0.0.1] - 2018-08-22

###  Adds
  - `loft ls` list your lofts
  - `loft new scaffold relative/path/to/src` will now create loft-folder named src instead of a copy of the structure named relative given the example

----

## [0.0.0-beta-3-rev3] - 2018-08-22

###  Adds
  - Uses [Caporal](https://www.npmjs.com/package/caporal) ✅
  - Core logic moved to a new core package
  
----

## [0.0.0-beta-3-rev2] - 2018-08-21

### Adds
  - Clearer logging
  - Useful shorthands
    - `loft <directory-at-pwd>` *short for* `loft new scaffold <scaffold-named-after-src> <target-directory>`

### Changes
  - Missing data replacements result in the line not being updated at all

----

## [0.0.0-beta-3] - 2018-08-20

### Changed
  - Does not copy `.git` or `node_modules` directories anymore
  - Removes concept of synonyms, there is no more "create" despite the named command in source, it maps to new

### Breaks
  - Old parameters for passing data on the command-line:
    - **was** `--data:<variable> <replace-value>` *now* `<variable> <replace-value>`
    - **was** `--file:<variable> <replace-value>` *now* `file:<variable> <replace-value>`

### Adds
  - For developers, a flow for building your local interface binary to your profile's global yarn directory
  - Adds an annotation list explaining descope

----

## [0.0.0-beta-2] - 2018-08-20

### Added
  - Added a help command (scaffolded with `loft` 😅 )
  - Expanded the README

----
  
## [0.0.0-beta-1] - 2018-08-20

### Added
- Better logging
    - Better debug logging `export LOFT_DEBUG=[*|scope|scaffold]`
- Fixed replacements not executing

----

## [0.0.0-alpha-rev-9] - 2018-08-19

### Added
- The README
- This changelog
- Skips .git and node_modules

### Changed
- Changed the cli convention for passing data parameters
- Changed from `--propertyName replaceValue` to `--data:propertyName replaceValue`

----

## [0.0.0-alpha-rev-8e] - 2018-08-19
### Added
- The README
- This changelog
- Skips .git and node_modules

### Changed
- Changed the cli convention for passing data parameters
- Changed from `--propertyName replaceValue` to `--data:propertyName replaceValue`

----

## [0.0.0-alpha-rev-8d] - 2018-08-19
### Added
- Globless filename scaffolding
- `--file:filePattern replaceValue`


### Changed
- Changed the cli convention for passing data parameters
- Changed from `--propertyName replaceValue` to `--data:propertyName replaceValue`
