const { schemaTierData } = require('../common/schema');
const { locators, consts, ruleNames, soAbbr } = require('../common/locators');
const actions = require('../common/actions');

describe('tier 2 default service offering rules', function () {
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
        ml.sheet = input.t2so;
        var fileFullName = 'testdata/' + input.fileName + '.xlsx';

        await xlsxRead(fileFullName, { schema: schemaTierData, sheet: input.t2so }).then(({ rows }) => {
            tExcel = rows.filter(row=>!(row.skip))
        });
        if ((tExcel.length == 0) || (tExcel[0].shipper == undefined)) {
            console.log('Tier 2 ' + ruleNames.serviceOffering + ' rule has no data - skipping')
            this.skip();
        }

        tExcel.sort((a, b) => (a.scac > b.scac) 
        ? 1 : (a.scac === b.scac) ? ((a.code > b.code) 
        ? 1 : (a.code === b.code) ? ((a.shipper > b.shipper) 
        ? 1 : (a.receiver === b.receiver) ? ((a.receiver > b.receiver)
        ? 1 : -1) : -1 ) : -1) : -1 ); // sort by scac then code then shipper then receiver

    });

    it('should add t2 so for the trading partner', () => {
        delaySecond = input.delaySecond * 1000;
        browser.url(input.url);
        browser.pause(delaySecond);
        // login page
        actions.clickLoginButtonWhileExisting(login);
        browser.pause(delaySecond);

        var i;
        var ruleCode = "";
        var shpCode = "";
        var scacCode = "";
        var selectedShp = [];
        var selectedRec = [];
        var createdRule = {};
        var skipClickNewRuleButton = false;

        for (i = 0; i < tExcel.length; i++) {
            if ((tExcel[i].code != ruleCode) || (tExcel[i].shipper != shpCode) || (tExcel[i].scac != scacCode)) {
                // start a new rule
                console.log('Creating Tier 2 ' + ruleNames.serviceOffering + ' rule.');
                ruleCode = tExcel[i].code;
                shpCode = tExcel[i].shipper;
                scacCode = tExcel[i].scac;

                if (!skipClickNewRuleButton) actions.clickNewRuleButton(delaySecond);

                actions.createRule(ruleNames.serviceOffering, delaySecond);

                // configure new rule page -- TP
                browser.waitForExist(locators.resultantActionValue2, delaySecond * 30);
                browser.pause(delaySecond/2);
                actions.setAttributeTradingPartner(input.tradingPartner, delaySecond);

                actions.setAttribute2(consts.pickupSiteCode, delaySecond);

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
                // configure new rule page - receiver
                if (selectedShp.length > 0) {
                    actions.setAttribute2(consts.deliverySiteCode, delaySecond);   
                }    
            }

            if (selectedShp.length >0) {
                var receiverField = $$(locators.attributeValue)[2];
                receiverField.waitForExist(delaySecond);
                receiverField.click();
                receiverField.setValue(tExcel[i].receiver + ' ');
                browser.pause(delaySecond);
                if (browser.isExisting(locators.firstAttributeDropdownValue)) {
                    // browser.pause(delaySecond);
                    eleExists = false;
                    if (browser.getText(locators.firstAttributeDropdownValue) == tExcel[i].receiver) {
                        eleExists = true;
                        browser.click(locators.firstAttributeDropdownValue); // existing but not clickable if fitst dropdown item is blank
                        selectedRec.push(tExcel[i].receiver);
                    } else {
                        for (k=0; k<$$(locators.siteCodeDropdownArray).length; k++) {
                            ele = locators.siteCodeDropdownItem1Half + k + locators.siteCodeDropdownItem2Half;
                            if (browser.getText(ele) == tExcel[i].receiver) {
                                browser.click(ele);
                                eleExists = true;
                                selectedRec.push(tExcel[i].receiver);
                                break;
                            }
                        }
                    }
                    if (!eleExists) {
                        ml.missingLocations.push(tExcel[i].receiver);
                        console.log(ml);
                    }
                    // browser.pause(delaySecond);
                }
            }
            // Save if billto code or shipper code or scac on next row changes, or reached to the end
            if ((i==tExcel.length -1) || (tExcel[i+1].code != ruleCode) || (tExcel[i+1].shipper != shpCode) || (tExcel[i+1].scac != scacCode)) {
                if ((selectedShp.length == 0) || (selectedRec.length == 0)) {
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
                    actions.setResultant2(soAbbr[ruleCode], delaySecond);
                    browser.pause(delaySecond);
                    browser.click(locators.saveButton);
                    actions.waitForLoadingDotsDisappearIfAny(delaySecond * 30);

                    createdRule.serviceOfferingCode = ruleCode;
                    if (tExcel[i].scac != undefined) createdRule.scac = scacCode; // t1btExcel[i].scac);
                    createdRule.shipperCode = selectedShp;
                    createdRule.receiverCode = selectedRec;
                    console.log('Tier 2 ' + ruleNames.serviceOffering + ' rule is saved.');
                    console.log(createdRule);
                    selectedShp.length = 0;
                    selectedRec.length = 0;
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