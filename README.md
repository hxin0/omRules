# Version v1.8
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
    - missingCodes.js relace codes with new ones  
  - none
    - irjson.js: inactivate all rules (json version)

# What's new
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
(or copy the following to a folder e.g. C:\...\rules>):
  - package.json
  - wdio.conf.js
  - common/*
  - test/*
  - testdata/*

## Install dependencies
C:\...\rules>npm install

# Settings
## settings.xlsx
1. ir:  
    - url: rules page url  
    - tradingPartner: inactivate rules for the trading partner  
    - createdBy: user ids if any  
      comma as delimiter  
      UI should have created by column selected  
      inactivate all if blank  
    - delaySecond: delay how many seconds according to page elements load time 
2. tier:  
    - url: rules page url  
    - tradingPartner: create tiered rules for the trading partner 
    - fileName: rules data file  
    - t1bt: tier 1 datasheet name in the excel data file  
    - t2bt: tier 2 datasheet name in the excel data file  
    - ...  
    - simpleton: simpleton datasheet name in the excel data file
    - delaySecond: delay seconds according to page elements load time  
3. simpleton:
    - url: rules page url  
    - fileName: the simpleton data file  
    - tabName: data file tab name
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
C:\...\rules>npm test

## missingCodes.js
### specify in settings.xlsx missingCode tab
### run:
C:\...\rules>node test\missingCodes.js

# Issues
- Element still not existing after xxxx ms  
  try to increase delaySecond in settings
- OM doesn't load resultant action section  
  try again. nothing else we can do about it