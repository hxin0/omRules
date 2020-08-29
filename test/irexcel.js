// const { schemaTier } = require('../common/schema');
const { locators } = require('../common/locators');
const actions = require('../common/actions');
const { schemaInactivateRules } = require('../common/schema');

describe('inactivate rules', function () {

    var setEnv = {};
    var setData = [];
    var delaySecond = 1000;
    var count = 0;

    before('read excel file first', async function () {
        ({ setEnv, setData } = await actions.readDataSheets(setEnv, setData, schemaInactivateRules, 'ir'));
    })

    it('should inactivate all rules for a trading partner', function () {
        delaySecond = setEnv.delaySecond * 1000;

        browser.url(setEnv.url);
        browser.pause(delaySecond);

        actions.clickLoginButtonWhileExisting(setEnv);

        browser.pause(delaySecond);

        for (let j=0; j < setData.length; j++) {
            console.log(`${j + 2}: ${setData[j].tradingPartner}`);
            actions.searchTradingPartner(setEnv, setData[j]);
            actions.waitForLoadingDotsDisappearIfAny(delaySecond);

            if ($(locators.rulesNotFound).isVisible()) {
                console.log('No Rules Found... Skip');
                // this.skip();
                continue;
            }

            // browser.debug(); // see if there is rules, if No Rules Found. is visible
            var ele = locators.datatablePager;
            try {
                $(ele).waitForExist(delaySecond * 30);
            } catch (err) {
                console.log('Time out');
                throw 'Time out';
            }

            var i = 0;
            while (($$(locators.array3dots)[i] != undefined) && ($$(locators.array3dots)[i].isExisting())) {
                browser.pause(delaySecond);
                $$(locators.array3dots)[i].waitForEnabled(delaySecond * 2);
                // browser.pause(delaySecond);
                $$(locators.array3dots)[i].click();
                browser.pause(delaySecond);
                browser.click(locators.inactivateMenu);
                browser.pause(delaySecond);
                console.log(i);
                console.log($$(locators.array3dots).length);
                try {
                    browser.click(locators.yesButton);
                } catch (err) {
                    if (i < $$(locators.array3dots).length) {
                        i++;
                        console.log(i + ' rules cannot be inactivated.');
                        continue;
                    } else {
                        console.log('No more rules can be inactivated.');
                        throw i + ' rules can not be inactivated.'
                    }
                }

                count++;
                actions.waitForLoadingDotsDisappearIfAny(delaySecond);
            }
            console.log(count + ' rules have been inactivated')
        }
    });
});
