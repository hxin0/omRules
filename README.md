# Version v2.0

# Install

## 1. Copy files
  - Download ADO Repo: https://jbhunt.visualstudio.com/EngAndTech/_git/omRules  
  - Unzip downloaded file (omRules.zip) into a folder (code root folder)  
  - (or copy the following to a folder e.g. `C:\...\omRules>`):
    - package.json
    - wdio.conf.js
    - README.md
    - common/*
    - test/*
    - testdata/settings.xlsx

## 2. Install dependencies
`C:\...\omRules>npm install`

# Setup

## 1. data files  
1. copy Dwayne's data files (as is) into testdata folder:  
    - tiered data file - different types of rules on each datasheet  
    - missingData files - one missingData file, one rules data file 
2. adjust datasheets names in settings.xlsx if necessary 
## 2. settings.xlsx
1. settings:
    - url: rules page url (prod, test, profs, etc.) 
    - tradingPartner: inactivate rules for the trading partner  
    - delaySecond: delay seconds waiting on page elements  
    - username: your login username (not required)
    - password: your login password (not required)
    - SKIP: program will use the first 'not TRUE' row
2. tier:  
    - tradingPartner: trading partner
    - fileName: rules data file  
    - t1bt: tier 1 datasheet name in the excel data file  
    - t2bt: tier 2 datasheet name in the excel data file  
    - ...  
    - SKIP: progarm will use the first 'not TRUE' row
3. ir:  
    - tradingPartner: trading partner
    - createdBy: user ids if any  
      - can set multiple users, comma as delimiter  
      - UI should have created by column selected  
      - leave this column blank will delete rules by all users  
    - selectorTotal:total columns in the table without 'data-auto-id' attribute
    - selectorNum: order number of 'Created By' column among columns without 'data-auto-id' attribute
    - SKIP: program will run on all rows without 'TRUE'
3. simpleton:
    - tradingPartner: trading partner  
    - SCAC: SCAC code if any
    - BTC: billing party rule, leave blank if not applicable
    - CorpAcct: customer rule, leave blank if not applicable
    - BU: business unit rule, leave blank if not applicable
    - SO: service offering rule, leave blank if not applicable
    - Fleet: fleet rule, leave blank if not applicable
    - SKIP: program will run on all rows without 'TRUE'
4. missingCode:  
    - missingCodeFileName  
    - ruleDataFileName: rules data file  
    - newDataFileName  
    - rules data sheet tab names - t1bt, t2bt ... t2fl  
      leave blank if not exist  
    - SKIP: program will run on all rows without 'TRUE'
 
## 3. specify which rules to run
*  wdio.conf.js  
  specify which "tests" to run in `specs` section    
  comment or remove the lines if you don't want the tests to run  
  for example, this will run `simpleton.js`, `t1bt.js`, and `t2bt.js` simultaneously:
```javascript
  specs: [
      // './test/irby.js',
      './test/simpleton.js',
      './test/t1bt.js',
      './test/t2bt.js',
      // './test/t1bu.js',      
  ],
```

capabilities maxInstances value determines how many tests to be run simutaneously.  
This will run 5 instances with chrome capability:
```javascript
  capabilities: [{
    maxInstances: 5,
    browserName: 'chrome',
    acceptInsecureCerts: true,
  }],
```
## 4. run
run from code root folder:  

`C:\...\omRules>npm test`  
`C:\...\omRules>npm test | tee testReport` (Powershell/bash)  
`$ npm run tee` (bash only)  

## 5. mlr.js replacing missing location codes with new codes in rules datasheets
- specify in settings.xlsx missingCode tab
- run:
`C:\...\omRules>node test\mlr.js [options] `  
(`C:\...\omRules>node test\mlr -h` to see the options)

## 6. mle.js export missing location codes recorded during creation from json to excel
- run:
`C:\...\omRules>node test\mle.js [options] [file [worksheet]]`  
(`C:\...\omRules>node test\mle -h` to see the options)

# Issues
- Element still not existing after xxxx ms  
  try to increase delaySecond in settings

# What's new
## v2.0
  - upgrade webdriverio from v4 to v6
  - upgrade all tests to comply with new syntax
  - utilize timeline reporter
## v1.13.1
  - retry when elements not exist
  - retry when elements not clickable
## v1.13
  - retry when go into a wrong rule page
  - retry when resultant action section not appear
  - remove legacy js codes: ir, irjson, irexcel
## v1.12.1
  - handle not clickable at point exceptions
  - fix so acronym bug
## v1.12
  - apply service offering acronyms to tiers 
  - fine tune moving dots delay
## v1.11.1
  - bug fix, receiver sorting for tier 2 rules  
  - add more Service Offering acronyms  
## v1.11
  - handle new login page, changed schemaSettings, locators and actions, backward compatible
## v1.10.1
  - bug fix, uncomment lines for debugging
## v1.10
  - Add 'SKIP' function to all settings.xlsx worksheets
    - settings, tier: run with first "not TRUE" row
    - ir, simpleton, missingCode: run all "not True" rows
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

## modules (group by settings.xlsx sheet)
- ir  
  - irby.js: inactivate rules by users  
- tier  
  - t1bt.js: tier 1 billing party rule  
  - t2bt.js: tier 2 billing party rule  
  - t1bu.js: tier 1 business unit rule  
  - t2bu.js: tier 2 business unit rule  
  - t1so.js: tier 1 service offering rule  
  - t2so.js: tier 2 service offering rule  
  - t1fl.js: tier 1 fleet code rule  
  - t2fl.js: tier 2 fleet code rule  
  - t1cu.js: tier 1 customer rule
  - t2cu.js: tier 2 customer rule
- simpleton  
  - simpleton.js: simpleton rules  
- missingCode  
  - mlr.js relace codes with new ones  
- none
  - mle.js export missing code during rule creation to Excel