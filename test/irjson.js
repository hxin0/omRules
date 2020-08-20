const { locators } = require('../common/locators');
const actions = require('../common/actions');

describe('inactivate rules json version', async () => {

    var input = require('../testdata/settings.json');
    var login = {};
    const fs = require('fs');

    const delaySecond = input.delaySecond * 1000;
    var count = 0;

    it('should run test', () => {
        // var tradingPartner = 'BESTTRA';
        // var url = 'https://order-tst.nonprod.jbhunt.com/order/automationrules';
        fs.access('testdata/loginTest.json', (err) => {
            if (err) {
                login = require('../testdata/login.json')
            } else {
                login = require('../testdata/loginTest.json')
            }
        })

        browser.url(input.url);
        browser.pause(delaySecond);
        actions.clickLoginButtonWhileExisting(login);

        browser.pause(delaySecond);
        actions.searchTradingPartner(input);
        browser.pause(delaySecond);
        actions.waitForLoadingDotsDisappearIfAny(delaySecond * 30);
        browser.pause(delaySecond);
      
        if ($(locators.rulesNotFound).isVisible()) {
            console.log('No Rules Found... Skip');
            this.skip();
        }

        var ele = 'datatable-pager[class="datatable-pager"]';
        try {
            $(ele).waitForExist(delaySecond * 30);
        } catch (err) {
            console.log('Time out');
            throw 'Time out';
        }

        var i = 0;
        while (($$(locators.span3Dots)[i] != undefined) && ($$(locators.span3Dots)[i].isExisting())) {
            browser.pause(delaySecond);
            $$(locators.span3Dots)[i].waitForEnabled(delaySecond * 2);
            // browser.pause(delaySecond);
            $$(locators.span3Dots)[i].click();
            browser.pause(delaySecond);
            browser.click(locators.inactivateMenu);
            browser.pause(delaySecond);
            console.log(i);
            console.log($$('#span-3dots').length);
            try {
                browser.click(locators.yesButton);
            } catch (err) {
                if (i < $$('#span-3dots').length) {
                    i++;
                    console.log(i + ' rules cannot be inactivated.');
                    continue;
                } else {
                    console.log('No more rules can be inactivated.');
                    throw i + ' rules can not be inactivated.'
                }
            }

            count++;
            browser.pause(delaySecond);
            actions.waitForLoadingDotsDisappearIfAny(delaySecond * 30);
        }
        console.log(count + ' rules have been inactivated')
    });
});
