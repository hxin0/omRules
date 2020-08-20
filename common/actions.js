const { schemaTier, schemaTierData, schemaLogin, schemaSimpleton, schemaSimpletonData } = require('../common/schema');
const { locators, consts, ruleNames } = require('../common/locators');
var _ = require('lodash/core');

exports.clickLoginButtonWhileExisting = function (login) {
    while (browser.isExisting(locators.loginButton)) {
        if (_.size(login) > 0) {
            browser.setValue(locators.username, login.username);
            browser.setValue(locators.password, login.password);
            browser.click(locators.loginButton);
        } else {
            browser.pause(consts.delaySecond * 30);
        }
    }
};

exports.searchTradingPartner = function (input) {
    const delaySecond = input.delaySecond * 1000;
    browser.waitForExist(locators.searchMenuDropdown, delaySecond);
    browser.click(locators.searchMenuDropdown);
    browser.click(locators.searchMenu1TradingPartner);
    browser.setValue(locators.searchRuleName, input.tradingPartner);
    browser.pause(delaySecond);
    browser.waitForExist('='.concat(input.tradingPartner));
    browser.click('='.concat(input.tradingPartner));
};

exports.clickNewRuleButton = function (delaySecond) {
    // browser.waitForExist(locators.configureNewRuleButton, consts.delaySecond);
    // browser.waitForExist(locators.searchMenuDropdown, consts.delaySecond);
    // browser.click(locators.configureNewRuleButton);
    $(locators.configureNewRuleButton).waitForExist(delaySecond);
    $(locators.searchMenuDropdown).waitForExist(delaySecond);
    $(locators.configureNewRuleButton).click();
};

exports.waitForLoadingDotsDisappearIfAny = function (delaySecond) {
    if ($(locators.loadingDots).isVisible()) {
        $(locators.loadingDots).waitForVisible(delaySecond, true);
    }
};

exports.createRule = function (ruleName, delaySecond) {  
    browser.pause(delaySecond/2);
    browser.waitForExist(locators.searchRuleName, delaySecond);
    browser.pause(delaySecond/2);
    browser.setValue(locators.searchRuleName, ruleName);
    browser.waitForExist(locators.ruleNameDropdownValue, delaySecond);
    browser.pause(delaySecond/2);
    browser.click(locators.ruleNameDropdownValue);
    browser.pause(delaySecond);
    browser.waitForExist(locators.ruleNameRow, delaySecond);
    browser.pause(delaySecond);
    browser.click(locators.ruleNameRow);
};

exports.setAttributeTradingPartner = function (tradingPartner, delaySecond) {
    // browser.waitForExist(locators.resultantActionValue, delaySecond * 30);
    browser.waitForExist(locators.selectAttributeDropdown, delaySecond);

    browser.click(locators.selectAttributeDropdown);
    // browser.pause(delaySecond);
    browser.waitForExist(locators.inputAttribute, delaySecond);
    browser.setValue(locators.inputAttribute, consts.ucrTradingPartner); // UCR Trading Partner
    browser.pause(delaySecond);

    browser.waitForExist(locators.dropdownItem, delaySecond);
    browser.click(locators.dropdownItem);

    browser.waitForExist(locators.selectOperatorDropdown, delaySecond);
    browser.click(locators.selectOperatorDropdown);
    browser.click(locators.operatorEquals); // Equals

    browser.waitForExist(locators.attributeValue, delaySecond);
    browser.click(locators.attributeValue);
    browser.setValue(locators.attributeValue, tradingPartner + ' '); // Trading Partner
    browser.pause(delaySecond);
    browser.waitForExist(locators.firstAttributeDropdownValue, delaySecond);
    browser.click(locators.firstAttributeDropdownValue);
};

exports.setAttribute2 = function (attribute, delaySecond) {
    browser.click(locators.addAttributeButton);
    browser.waitForExist(locators.selectAttributeDropdown, delaySecond);

    browser.click(locators.selectAttributeDropdown);

    browser.setValue(locators.inputAttribute, attribute); // UCR SCAC
    browser.pause(delaySecond);
    browser.waitForExist(locators.dropdownItem, delaySecond);
    // browser.pause(delaySecond);
    browser.click(locators.dropdownItem);

    browser.waitForExist(locators.selectOperatorDropdown, delaySecond);
    browser.click(locators.selectOperatorDropdown);
    browser.click(locators.operatorEquals2); // Equals
};

exports.setAttributeScac = function (scac, delaySecond) {
    this.setAttribute2(consts.ucrScac, delaySecond);

    browser.waitForExist(locators.orderRuleCriteriaValue2, delaySecond);
    browser.click(locators.orderRuleCriteriaValue2);
    browser.setValue(locators.orderRuleCriteriaValue2, scac);
};

exports.setResultant = function (code, delaySecond) {
    browser.waitForExist(locators.resultantActionValue, delaySecond);
    browser.click(locators.resultantActionValue);
    browser.setValue(locators.resultantActionValue, code);
    browser.pause(delaySecond);
    browser.waitForExist(locators.resultantActionValueDropdownItem, delaySecond);
    browser.click(locators.resultantActionValueDropdownItem);
};

exports.setResultant2 = function (code, delaySecond) {
    browser.waitForExist(locators.resultantActionValue2, delaySecond);
    browser.click(locators.resultantActionValue2);
    browser.setValue(locators.resultantActionValue2Input, code);
    browser.pause(delaySecond);
    browser.waitForExist(locators.resultantActionValue2DropdownItem, delaySecond);
    browser.click(locators.resultantActionValue2DropdownItem);
};

exports.readDataSheets = async function readDataSheets(login, input, schema = schemaTier, tabName = 'tier') {
    const xlsxRead = require('read-excel-file/node');
    const fs = require('fs');
    fs.access('testdata/loginTest.xlsx', async (err) => {
        if (err) {
            await xlsxRead('testdata/login.xlsx', { schema: schemaLogin, sheet: 'login' }).then(({ rows }) => {
                login = rows[0];
            });
        }
        else {
            await xlsxRead('testdata/loginTest.xlsx', { schema: schemaLogin, sheet: 'login' }).then(({ rows }) => {
                login = rows[0];
            });
        }
    });
    await xlsxRead('testdata/settings.xlsx', { schema: schema, sheet: tabName }).then(({ rows }) => {
        input = rows[0];
    });
    return { login, input };
}
