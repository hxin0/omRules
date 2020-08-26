# Version v1.9
## modules (group by settings.xlsx tab name)
  - ir  
    - irCreatedBy.js: inactivate rules by users  
  - tier  
    - t1bt.js: tier 1 billing party rule  
    - t2bt.js: tier 2 billing party rule  
    - t1bu.js: tier 1 business unit rule  
    - t2bu.js: tier 2 business unit rule  
    - t1so.js: tier 1 service offering rule  
    - t2so.js: tier 2 service offering rule  
    - t1fl.js: tier 1 fleet code rule  
    - t2fl.js: tier 2 fleet code rule  
  - simpleton  
    - simpleton.js: simpleton rules  
  - missingCode  
    - mcReplace.js relace codes with new ones  
  - none
    - msExport.js export missing code during rule creation to Excel
    - irjson.js: inactivate all rules (json version)

# What's new
## v1.9
  - combine login.xlsx into settings
  - refactor tiers
  - write missing codes json file before save rule in order to avoid missing codes are not recorded when program stops due to errors
## v1.8
  - changed settings.xlsx structure
  - refactored code accordingly
## v1.7
  - irCreatedBy.js is upgraded from irexcel.js to be able to inactivate rules created by certain users.  
    Specify user(s) in settings.xlsx ir tab createdBy column.  
    setup 'selectorTotal' and 'selectorNum' column:  
    - selectorTotal: rules page columns that its span element doesn't have 'data-auto-id' attribute.
    - selectorNum: the order of 'Created By' column in those no 'data-auto-id' attribute columns.
# Setup

## copy files
Unzip downloaded file into a folder
(or copy the following to a folder e.g. `C:\...\rules>`):
  - package.json
  - wdio.conf.js
  - common/*
  - test/*
  - testdata/*

## Install dependencies
`C:\...\rules>npm install`

# Settings
## settings.xlsx
1. settings:
    - url: rules page url  
    - tradingPartner: inactivate rules for the trading partner 
    - delaySecond: delay how many seconds according to page elements load time 
    - username: your login username (not required)
    - password: your login password (not required)
1. ir:  
    - createdBy: user ids if any  
      comma as delimiter  
      UI should have created by column selected  
      inactivate all if blank  
2. tier:  
    - fileName: rules data file  
    - t1bt: tier 1 datasheet name in the excel data file  
    - t2bt: tier 2 datasheet name in the excel data file  
    - ...  
3. simpleton:
    - fileName: simpleton data file  
    - tabName: simpleton data file tab name
4. missingCode:  
    - missingCodeFileName  
    - ruleDataFileName: rules data file  
    - newDataFileName  
    - rules data sheet tab names - t1bt, t2bt ... t2fl  
      leave blank if not exist  
## data files  
1. tiered data file - different types of rules on each datasheet  
2. simpleton file - create simple rules on all rows on a datasheet by tabName 
3. missingData file - one missingData file, one rules data file  
## specify which rules to run
*  wdio.conf.js  
  specify which rule to run in specs section. This will run irCreateBy.js:  

        specs: [
          './test/irCreatedBy.js',
          // './test/t1bt.js'
        ],

## run
`C:\...\rules>npm test`

## mcReplace.js
### specify in settings.xlsx missingCode tab
### run:
`C:\...\rules>node test\msReplace.js [options] `

## mcExport.js
### run
`C:\...\rules>node test\msExport.js [opotions] [file [worksheet]]`

# Issues
- Element still not existing after xxxx ms  
  try to increase delaySecond in settings
- OM doesn't load resultant action section  
  try again. nothing else we can do about it