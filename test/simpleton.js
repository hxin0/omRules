const { schemaSimpleton, schemaSimpletonData } = require('../common/schema');
const { locators, ruleNames, soAbbr } = require('../common/locators');
const actions = require('../common/actions');

describe('simpleton rules', function () {

    var setEnv = {};
    var delaySecond = 1000;
    var setData = [];

    before('read file first', async function () {
        ({ setEnv, setData } = await actions.readDataSheets(setEnv, setData, schemaSimpletonData, 'simpleton'));
    });

    it('should add simpeton rules for the trading partner', () => {
        delaySecond = setEnv.delaySecond * 1000;
        browser.url(setEnv.url);
        browser.pause(delaySecond);
        // login page
        actions.clickLoginButtonWhileExisting(setEnv);

        browser.pause(delaySecond);

        var i;
        var createdRule = {};
        var skipClickNewRuleButton = false;

        for (i = 0; i < setData.length; i++) {
            console.log(`Start settings.xlsx/simpleton on row ${i+1}: ${setData[i].tradingPartner}`);
            console.log(Date().toLocaleString());
            if (setData[i].corpAcct != undefined) { // customer rule
                // start a new rule
                console.log('Customer rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(delaySecond);

                createdRule.rule = ruleNames.customerRule;
                createdRule.tradingPartner = setData[i].tradingPartner;

                actions.createRule(ruleNames.customerRule, delaySecond);
                // configure new rule page -- TP

                actions.waitForResultantWithRetry(ruleNames.customerRule, 1, 2, delaySecond);

                browser.pause(delaySecond/2);
                actions.setAttributeTradingPartner(setData[i].tradingPartner, delaySecond);

                if (setData[i].scac != undefined) {
                    // Add scac
                    createdRule.scsc = setData[i].scac;
                    actions.setAttributeScac(setData[i].scac, delaySecond);
                }

                createdRule.corpAcct = setData[i].corpAcct;

                actions.setResultant(setData[i].corpAcct, delaySecond);
                browser.pause(delaySecond/2);
                $(locators.saveButton).click();

                console.log('simpleton ' + ruleNames.customerRule + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(delaySecond);
                createdRule = {};
            }

            if (setData[i].code != undefined) { // billing party rule
                // start a new rule
                console.log('Billing Party rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(delaySecond);

                createdRule.rule = ruleNames.billingParty;
                createdRule.tradingPartner = setData[i].tradingPartner;

                actions.createRule(ruleNames.billingParty, delaySecond);
                // configure new rule page -- TP

                actions.waitForResultantWithRetry(ruleNames.billingParty, 1, 2, delaySecond);

                browser.pause(delaySecond/2);
                actions.setAttributeTradingPartner(setData[i].tradingPartner, delaySecond);

                if (setData[i].scac != undefined) {
                    // Add scac
                    createdRule.scsc = setData[i].scac;
                    actions.setAttributeScac(setData[i].scac, delaySecond);
                }

                createdRule.billtoCode = setData[i].code;
                actions.setResultant(setData[i].code, delaySecond);
                browser.pause(delaySecond/2);
                $(locators.saveButton).click();

                console.log('simpleton ' + ruleNames.billingParty + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(delaySecond);
                createdRule = {};
            }

            if (setData[i].businessUnit != undefined) { // business unit rule
                // start a new rule
                console.log('Business Unit rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(delaySecond);

                createdRule.rule = ruleNames.businessUnit;
                createdRule.tradingPartner = setData[i].tradingPartner;

                actions.createRule(ruleNames.businessUnit, delaySecond);
                // configure new rule page -- TP

                actions.waitForResultantWithRetry(ruleNames.businessUnit, 2, 2, delaySecond);

                browser.pause(delaySecond/2);
                actions.setAttributeTradingPartner(setData[i].tradingPartner, delaySecond);

                if (setData[i].scac != undefined) {
                    // Add scac
                    createdRule.scsc = setData[i].scac;
                    actions.setAttributeScac(setData[i].scac, delaySecond);
                }

                createdRule.businessUnit = setData[i].businessUnit.substring(0,3);

                actions.setResultant2(setData[i].businessUnit.substring(0,3), delaySecond);
                browser.pause(delaySecond/2);
                $(locators.saveButton).click();

                console.log('simpleton ' + ruleNames.businessUnit + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(delaySecond);
                createdRule = {};
            }

            if (setData[i].serviceOffering != undefined) { // service offering rule
                // start a new rule
                console.log('Service Offering rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(delaySecond);

                createdRule.rule = ruleNames.serviceOffering;
                createdRule.tradingPartner = setData[i].tradingPartner;

                actions.createRule(ruleNames.serviceOffering, delaySecond);
                // configure new rule page -- TP

                actions.waitForResultantWithRetry(ruleNames.serviceOffering, 2, 2, delaySecond);

                browser.pause(delaySecond/2);
                actions.setAttributeTradingPartner(setData[i].tradingPartner, delaySecond);

                if (setData[i].scac != undefined) {
                    // Add scac
                    createdRule.scsc = setData[i].scac;
                    actions.setAttributeScac(setData[i].scac, delaySecond);
                }

                createdRule.serviceOffering = setData[i].serviceOffering;

                var so = setData[i].serviceOffering
                let soSource = so.toUpperCase();
                if (soAbbr[soSource]) 
                    so = soAbbr[soSource];
                actions.setResultant2(so, delaySecond);

                browser.pause(delaySecond/2);
                $(locators.saveButton).click();

                console.log('simpleton ' + ruleNames.serviceOffering + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(delaySecond);
                createdRule = {};
            }

            if ((setData[i].fleet != undefined) && (setData[i].fleet.toUpperCase() != 'NA') && (setData[i].fleet.toUpperCase != 'N/A')) { 
                // start a new rule
                console.log('Fleet Code rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(delaySecond);

                createdRule.rule = ruleNames.fleetCode;
                createdRule.tradingPartner = setData[i].tradingPartner;

                actions.createRule(ruleNames.fleetCode, delaySecond);
                // configure new rule page -- TP

                actions.waitForResultantWithRetry(ruleNames.fleetCode, 1, 2, delaySecond);

                browser.pause(delaySecond/2);
                actions.setAttributeTradingPartner(setData[i].tradingPartner, delaySecond);

                if (setData[i].scac != undefined) {
                    // Add scac
                    createdRule.scsc = setData[i].scac;
                    actions.setAttributeScac(setData[i].scac, delaySecond);
                }

                createdRule.fleet = setData[i].fleet;

                actions.setResultant(setData[i].fleet, delaySecond);
                browser.pause(delaySecond/2);
                $(locators.saveButton).click();

                console.log('simpleton ' + ruleNames.fleetCode + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(delaySecond);
                createdRule = {};
            }
        }
        console.log(Date().toLocaleString());
    });
});
