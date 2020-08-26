const { schemaSimpleton, schemaSimpletonData } = require('../common/schema');
const { locators, ruleNames, soAbbr } = require('../common/locators');
const actions = require('../common/actions');

describe('simpleton rules', function () {
    const xlsxRead = require('read-excel-file/node');

    var input = {};
    var delaySecond = 1000;
    var sExcel = [];

    before('read file first', async function () {
        (input = await actions.readDataSheets(input)); // only need login info

        var fileFullName = 'testdata/settings.xlsx';
        // browser.debug();
        await xlsxRead(fileFullName, { schema: schemaSimpletonData, sheet: 'simpleton' }).then(({ rows }) => {
            sExcel = rows.filter(row=>!(row.skip));
            console.log(sExcel);
        });
        if ((sExcel.length == 0) || ((!sExcel[0].code) && (!sExcel[0].businessUnit) && (!sExcel[0].serviceOffering) && (!sExcel[0].corpAcct) && (!sExcel[0].fleet))) {
            console.log('No data - skipped')
            this.skip();
        }
    });

    it('should add simpeton rules for the trading partner', () => {
        delaySecond = input.delaySecond * 1000;
        browser.url(input.url);
        browser.pause(delaySecond);
        // login page
        actions.clickLoginButtonWhileExisting(input);

        browser.pause(delaySecond);
        // actions.searchTradingPartner(input);
        // browser.pause(delaySecond);
        // actions.waitForLoadingDotsDisappearIfAny(delaySecond * 30);
        // browser.pause(delaySecond);

        var i;

        var createdRule = {};
        var skipClickNewRuleButton = false;
        for (i = 0; i < sExcel.length; i++) {
            if (sExcel[i].corpAcct != undefined) { // customer rule
                // start a new rule
                console.log('Customer rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(delaySecond);

                createdRule.rule = ruleNames.customerRule;
                createdRule.tradingPartner = sExcel[i].tradingPartner;

                actions.createRule(ruleNames.customerRule, delaySecond);
                // configure new rule page -- TP
                browser.waitForExist(locators.resultantActionValue, delaySecond * 30);
                browser.pause(delaySecond/2);
                actions.setAttributeTradingPartner(sExcel[i].tradingPartner, delaySecond);

                if (sExcel[i].scac != undefined) {
                    // Add scac
                    createdRule.scsc = sExcel[i].scac;
                    actions.setAttributeScac(sExcel[i].scac, delaySecond);
                }

                createdRule.corpAcct = sExcel[i].corpAcct;

                actions.setResultant(sExcel[i].corpAcct, delaySecond);
                browser.pause(delaySecond/2);
                browser.click(locators.saveButton);

                console.log('simpleton ' + ruleNames.customerRule + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(delaySecond);
                createdRule = {};
            }

            if (sExcel[i].code != undefined) { // billing party rule
                // start a new rule
                console.log('Billing Party rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(delaySecond);

                createdRule.rule = ruleNames.billingParty;
                createdRule.tradingPartner = sExcel[i].tradingPartner;

                actions.createRule(ruleNames.billingParty, delaySecond);
                // configure new rule page -- TP
                browser.waitForExist(locators.resultantActionValue, delaySecond * 30);
                browser.pause(delaySecond/2);
                actions.setAttributeTradingPartner(sExcel[i].tradingPartner, delaySecond);

                if (sExcel[i].scac != undefined) {
                    // Add scac
                    createdRule.scsc = sExcel[i].scac;
                    actions.setAttributeScac(sExcel[i].scac, delaySecond);
                }

                createdRule.billtoCode = sExcel[i].code;
                actions.setResultant(sExcel[i].code, delaySecond);
                browser.pause(delaySecond/2);
                browser.click(locators.saveButton);

                console.log('simpleton ' + ruleNames.billingParty + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(delaySecond);
                createdRule = {};
            }

            if (sExcel[i].businessUnit != undefined) { // business unit rule
                // start a new rule
                console.log('Business Unit rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(delaySecond);

                createdRule.rule = ruleNames.businessUnit;
                createdRule.tradingPartner = sExcel[i].tradingPartner;

                actions.createRule(ruleNames.businessUnit, delaySecond);
                // configure new rule page -- TP
                browser.waitForExist(locators.resultantActionValue2, delaySecond * 30);
                browser.pause(delaySecond/2);
                actions.setAttributeTradingPartner(sExcel[i].tradingPartner, delaySecond);

                if (sExcel[i].scac != undefined) {
                    // Add scac
                    createdRule.scsc = sExcel[i].scac;
                    actions.setAttributeScac(sExcel[i].scac, delaySecond);
                }

                createdRule.businessUnit = sExcel[i].businessUnit.substring(0,3);

                actions.setResultant2(sExcel[i].businessUnit.substring(0,3), delaySecond);
                browser.pause(delaySecond/2);
                browser.click(locators.saveButton);

                console.log('simpleton ' + ruleNames.businessUnit + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(delaySecond);
                createdRule = {};
            }

            if (sExcel[i].serviceOffering != undefined) { // service offering rule
                // start a new rule
                console.log('Service Offering rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(delaySecond);

                createdRule.rule = ruleNames.serviceOffering;
                createdRule.tradingPartner = sExcel[i].tradingPartner;

                actions.createRule(ruleNames.serviceOffering, delaySecond);
                // configure new rule page -- TP
                browser.waitForExist(locators.resultantActionValue2, delaySecond * 30);
                browser.pause(delaySecond/2);
                actions.setAttributeTradingPartner(sExcel[i].tradingPartner, delaySecond);

                if (sExcel[i].scac != undefined) {
                    // Add scac
                    createdRule.scsc = sExcel[i].scac;
                    actions.setAttributeScac(sExcel[i].scac, delaySecond);
                }

                createdRule.serviceOffering = sExcel[i].serviceOffering;

                let so = sExcel[i].serviceOffering.toUpperCase();
                actions.setResultant2(soAbbr[so], delaySecond);
                browser.pause(delaySecond/2);
                browser.click(locators.saveButton);

                console.log('simpleton ' + ruleNames.serviceOffering + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(delaySecond);
                createdRule = {};
            }

            if ((sExcel[i].fleet != undefined) && (sExcel[i].fleet.toUpperCase() != 'NA') && (sExcel[i].fleet.toUpperCase != 'N/A')) { 
                // start a new rule
                console.log('Fleet Code rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(delaySecond);

                createdRule.rule = ruleNames.fleetCode;
                createdRule.tradingPartner = sExcel[i].tradingPartner;

                actions.createRule(ruleNames.fleetCode, delaySecond);
                // configure new rule page -- TP
                browser.waitForExist(locators.resultantActionValue, delaySecond * 30);
                browser.pause(delaySecond/2);
                actions.setAttributeTradingPartner(sExcel[i].tradingPartner, delaySecond);

                if (sExcel[i].scac != undefined) {
                    // Add scac
                    createdRule.scsc = sExcel[i].scac;
                    actions.setAttributeScac(sExcel[i].scac, delaySecond);
                }

                createdRule.fleet = sExcel[i].fleet;

                actions.setResultant(sExcel[i].fleet, delaySecond);
                browser.pause(delaySecond/2);
                browser.click(locators.saveButton);

                console.log('simpleton ' + ruleNames.fleetCode + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(delaySecond);
                createdRule = {};
            }
        }
    });
});
