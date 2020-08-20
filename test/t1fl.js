const { schemaTierData } = require('../common/schema');
const { locators, consts, ruleNames } = require('../common/locators');
const actions = require('../common/actions');

describe('tier 1 default fleet code rules', function () {
    const xlsxRead = require('read-excel-file/node');
    const fs = require('fs');

    var input = {};
    var delaySecond = 1000;
    var login = {};
    var tExcel = [];
    var missingLocationsFile = require('../testdata/missingLocations.json');
    var ml = {};
    ml.dateTime = new Date();
    var k, ele, eleExists;
    ml.missingLocations = [];

    before('read file first', async function () {
        ({ login, input } = await actions.readDataSheets(login, input));

        ml.file = input.fileName;
        ml.sheet = input.t1fl;
        var fileFullName = 'testdata/' + input.fileName + '.xlsx';
        // browser.debug();
        await xlsxRead(fileFullName, { schema: schemaTierData, sheet: input.t1fl }).then(({ rows }) => {
            tExcel = rows.filter(row=>!(row.skip))
        });
        if ((tExcel.length == 0) || (tExcel[0].shipper == undefined)) {
            console.log('Tier 1 ' + ruleNames.fleetCode + ' rule has no data - skipping')
            this.skip();
        }
        tExcel.sort((a, b) => (a.scac > b.scac) 
        ? 1 : (a.scac === b.scac) ? ((a.code > b.code) 
        ? 1 : (a.code === b.code) ? ((a.shipper > b.shipper) 
        ? 1 : -1) : -1 ) : -1); // sort by scac then code then shipper
    });

    it('should add t1 fleet code rule for the trading partner', () => {
        delaySecond = input.delaySecond * 1000;
        browser.url(input.url);
        browser.pause(delaySecond);
        // login page
        actions.clickLoginButtonWhileExisting(login);
        browser.pause(delaySecond);

        var i;
        var ruleCode = "";
        var scacCode = "";
        var selectedShp = [];
        var createdRule = {};
        var skipClickNewRuleButton = false;
        for (i = 0; i < tExcel.length; i++) {
            if ((tExcel[i].code != ruleCode) || (tExcel[i].scac != scacCode)) {
                // start a new rule
                console.log('Creating Tier 1 ' + ruleNames.fleetCode + ' rule.');
                ruleCode = tExcel[i].code;
                scacCode = tExcel[i].scac;
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(delaySecond);

                actions.createRule(ruleNames.fleetCode, delaySecond);
                // configure new rule page -- TP
                browser.waitForExist(locators.resultantActionValue, delaySecond * 30);
                browser.pause(delaySecond/2);
                actions.setAttributeTradingPartner(input.tradingPartner, delaySecond);
                actions.setAttribute2(consts.pickupSiteCode, delaySecond);
            }
            browser.waitForExist(locators.attributeValue2, delaySecond);
            browser.click(locators.attributeValue2);
            browser.setValue(locators.attributeValue2, tExcel[i].shipper + ' '); // Shipper code
            browser.pause(delaySecond);
            if (browser.isExisting(locators.firstAttributeDropdownValue)) {
                // browser.pause(delaySecond);
                eleExists = false;
                if (browser.getText(locators.firstAttributeDropdownValue) == tExcel[i].shipper) {
                    eleExists = true;
                    browser.click(locators.firstAttributeDropdownValue); // existing but not clickable if fitst dropdown item is blank
                    selectedShp.push(tExcel[i].shipper);
                } else {
                    for (k=0; k<$$(locators.siteCodeDropdownArray).length; k++) {
                        ele = locators.siteCodeDropdownItem1Half + k + locators.siteCodeDropdownItem2Half;
                        if (browser.getText(ele) == tExcel[i].shipper) {
                            browser.click(ele);
                            eleExists = true;
                            selectedShp.push(tExcel[i].shipper);
                            break;
                        }
                    }
                }
                if (!eleExists) {
                    ml.missingLocations.push(tExcel[i].shipper);
                    console.log(ml);
                }
                // browser.pause(delaySecond);
            }

            // Save if billto code or scac on next row changes, or reached to the end
            if ((i==tExcel.length -1) || (tExcel[i+1].code != ruleCode) || (tExcel[i+1].scac != scacCode)) {
                if (selectedShp.length == 0) {
                    // check if shipper field is blank? cancel : continue
                    browser.click(locators.cancelButton);
                    browser.waitForExist(locators.cancelYesButton, delaySecond);
                    browser.pause(delaySecond);
                    browser.click(locators.cancelYesButton);
                    skipClickNewRuleButton = true;
                    browser.pause(delaySecond);
                } else {
                    if (tExcel[i].scac != undefined) {
                        // Add scac
                        actions.setAttributeScac(tExcel[i].scac, delaySecond);
                    }
                    actions.setResultant(ruleCode, delaySecond);
                    browser.pause(delaySecond);
                    browser.click(locators.saveButton);
                    actions.waitForLoadingDotsDisappearIfAny(delaySecond * 30);

                    createdRule.fleetCode = ruleCode;
                    if (tExcel[i].scac != undefined) createdRule.scac = scacCode; // tExcel[i].scac);
                    createdRule.shipperCode = selectedShp;
                    console.log('Tier 1 ' + ruleNames.fleetCode + ' rule is saved.');
                    console.log(createdRule);
                    selectedShp.length = 0;
                    createdRule = {};
                    skipClickNewRuleButton = false;
                    browser.pause(delaySecond);
                }
            }
        }

        if (ml.missingLocations.length > 0) {
            ml.dateTime = new Date();
            missingLocationsFile.push(ml);
            fs.writeFile("./testdata/missingLocations.json", JSON.stringify(missingLocationsFile, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("missing location codes have been written back.");
            });              
        }
    });
});