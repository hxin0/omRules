const { schemaSimpleton, schemaSimpletonData } = require('../common/schema');
const { locators, ruleNames, soAbbr } = require('../common/locators');
const actions = require('../common/actions');

describe('simpleton rules', function () {

    var setEnv = {};
    const waitRetry = {
        delay: 1000,
        maxTries: 10
    }
    var setData = [];

    before('read file first', async function () {
        ({ setEnv, setData } = await actions.readDataSheets(setEnv, setData, schemaSimpletonData, 'simpleton'));
    });

    it('should add simpeton rules for the trading partner', () => {
        waitRetry.delay = setEnv.delaySecond? setEnv.delaySecond * 1000 : waitRetry.delay;
        waitRetry.maxTries = setEnv.maxTries? setEnv.maxTries : waitRetry.maxTries;
        actions.timelineAddContext(waitRetry);

        browser.url(setEnv.url);
        browser.pause(waitRetry.delay);
        // login page
        actions.clickLoginButtonWhileExisting(setEnv);

        browser.pause(waitRetry.delay);

        var i;
        var createdRule = {};
        var skipClickNewRuleButton = false;

        for (i = 0; i < setData.length; i++) {
            console.log(`Start settings.xlsx/simpleton on row ${i+1}: ${setData[i].tradingPartner}`);
            console.log(Date().toLocaleString());
            if (setData[i].corpAcct != undefined) { // customer rule
                // start a new rule
                console.log('Customer rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(waitRetry);

                createdRule.rule = ruleNames.customerRule;
                createdRule.tradingPartner = setData[i].tradingPartner;

                actions.createRule(ruleNames.customerRule, waitRetry);
                // configure new rule page -- TP

                actions.waitForResultantWithRetry(ruleNames.customerRule, 1, waitRetry);

                browser.pause(waitRetry.delay);
                actions.setAttributeTradingPartner(setData[i].tradingPartner, waitRetry);

                if (setData[i].scac != undefined) {
                    // Add scac
                    createdRule.scsc = setData[i].scac;
                    actions.setAttributeScac(setData[i].scac, 2, waitRetry);
                }

                createdRule.corpAcct = setData[i].corpAcct;

                actions.setResultant(setData[i].corpAcct, waitRetry);
                browser.pause(waitRetry.delay);
                $(locators.saveButton).click();

                console.log('simpleton ' + ruleNames.customerRule + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(waitRetry.delay);
                createdRule = {};
            }

            if (setData[i].code != undefined) { // billing party rule
                // start a new rule
                console.log('Billing Party rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(waitRetry.delay);

                createdRule.rule = ruleNames.billingParty;
                createdRule.tradingPartner = setData[i].tradingPartner;

                actions.createRule(ruleNames.billingParty, waitRetry);
                // configure new rule page -- TP

                actions.waitForResultantWithRetry(ruleNames.billingParty, 1, waitRetry);

                browser.pause(waitRetry.delay);
                actions.setAttributeTradingPartner(setData[i].tradingPartner, waitRetry);

                if (setData[i].scac != undefined) {
                    // Add scac
                    createdRule.scsc = setData[i].scac;
                    actions.setAttributeScac(setData[i].scac, 2, waitRetry);
                }

                createdRule.billtoCode = setData[i].code;
                actions.setResultant(setData[i].code, waitRetry);
                browser.pause(waitRetry.delay);
                $(locators.saveButton).click();

                console.log('simpleton ' + ruleNames.billingParty + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(waitRetry.delay);
                createdRule = {};
            }

            if (setData[i].businessUnit != undefined) { // business unit rule
                // start a new rule
                console.log('Business Unit rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(waitRetry.delay);

                createdRule.rule = ruleNames.businessUnit;
                createdRule.tradingPartner = setData[i].tradingPartner;

                actions.createRule(ruleNames.businessUnit, waitRetry);
                // configure new rule page -- TP

                actions.waitForResultantWithRetry(ruleNames.businessUnit, 2, waitRetry);

                browser.pause(waitRetry.delay);
                actions.setAttributeTradingPartner(setData[i].tradingPartner, waitRetry);

                if (setData[i].scac != undefined) {
                    // Add scac
                    createdRule.scsc = setData[i].scac;
                    actions.setAttributeScac(setData[i].scac, 2, waitRetry);
                }

                createdRule.businessUnit = setData[i].businessUnit.substring(0,3);

                actions.setResultant2(setData[i].businessUnit.substring(0,3), waitRetry);
                browser.pause(waitRetry.delay);
                $(locators.saveButton).click();

                console.log('simpleton ' + ruleNames.businessUnit + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(waitRetry.delay);
                createdRule = {};
            }

            if (setData[i].serviceOffering != undefined) { // service offering rule
                // start a new rule
                console.log('Service Offering rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(waitRetry.delay);

                createdRule.rule = ruleNames.serviceOffering;
                createdRule.tradingPartner = setData[i].tradingPartner;

                actions.createRule(ruleNames.serviceOffering, waitRetry);
                // configure new rule page -- TP

                actions.waitForResultantWithRetry(ruleNames.serviceOffering, 2, waitRetry);

                browser.pause(waitRetry.delay);
                actions.setAttributeTradingPartner(setData[i].tradingPartner, waitRetry);

                if (setData[i].scac != undefined) {
                    // Add scac
                    createdRule.scsc = setData[i].scac;
                    actions.setAttributeScac(setData[i].scac, 2, waitRetry);
                }

                createdRule.serviceOffering = setData[i].serviceOffering;

                var so = setData[i].serviceOffering
                let soSource = so.toUpperCase();
                if (soAbbr[soSource]) 
                    so = soAbbr[soSource];
                actions.setResultant2(so, waitRetry);

                browser.pause(waitRetry.delay);
                $(locators.saveButton).click();

                console.log('simpleton ' + ruleNames.serviceOffering + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(waitRetry.delay);
                createdRule = {};
            }

            if ((setData[i].fleet != undefined) && (setData[i].fleet.toUpperCase() != 'NA') && (setData[i].fleet.toUpperCase != 'N/A')) { 
                // start a new rule
                console.log('Fleet Code rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(waitRetry.delay);

                createdRule.rule = ruleNames.fleetCode;
                createdRule.tradingPartner = setData[i].tradingPartner;

                actions.createRule(ruleNames.fleetCode, waitRetry);
                // configure new rule page -- TP

                actions.waitForResultantWithRetry(ruleNames.fleetCode, 1, waitRetry);

                browser.pause(waitRetry.delay);
                actions.setAttributeTradingPartner(setData[i].tradingPartner, waitRetry);

                if (setData[i].scac != undefined) {
                    // Add scac
                    createdRule.scsc = setData[i].scac;
                    actions.setAttributeScac(setData[i].scac, 2, waitRetry);
                }

                createdRule.fleet = setData[i].fleet;

                actions.setResultant(setData[i].fleet, waitRetry);
                browser.pause(waitRetry.delay);
                $(locators.saveButton).click();

                console.log('simpleton ' + ruleNames.fleetCode + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(waitRetry.delay);
                createdRule = {};
            }

            if (setData[i].convertRejected != undefined) { // convert rejected tender rule
                // start a new rule
                console.log('Convert Rejected Tender rule');
                if (!skipClickNewRuleButton) actions.clickNewRuleButton(waitRetry);

                createdRule.rule = ruleNames.convertRejected;
                createdRule.tradingPartner = setData[i].tradingPartner;

                actions.createRule(ruleNames.convertRejected, waitRetry);
                // configure new rule page -- TP

                browser.pause(waitRetry.delay);
                actions.setAttributeTradingPartner(setData[i].tradingPartner, waitRetry);

                createdRule.convertRejected = setData[i].convertRejected;

                // actions.setResultant(setData[i].corpAcct, waitRetry);
                browser.pause(waitRetry.delay);
                $(locators.saveButton).click();

                console.log('simpleton ' + ruleNames.convertRejected + ' rule is saved.');
                console.log(createdRule);
                actions.waitForLoadingDotsDisappearIfAny(waitRetry.delay);
                createdRule = {};
            }
        }
        console.log(Date().toLocaleString());
    });
});
