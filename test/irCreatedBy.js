// const { schemaTieraLogin } = require('../common/schema');
const { locators } = require('../common/locators');
const actions = require('../common/actions');
const { schemaInactivateRules } = require('../common/schema');

describe('inactivate rules', function () {

    var input = {};
    var delaySecond = 1000;
    var count = 0;

    before('read excel file first', async function () {
        (input = await actions.readDataSheets(input, schemaInactivateRules, 'ir'));
    })

    it('should inactivate all rules for a trading partner', function () {
        delaySecond = input.delaySecond * 1000;

        browser.url(input.url);
        browser.pause(delaySecond);

        actions.clickLoginButtonWhileExisting(input);

        browser.pause(delaySecond);
        actions.searchTradingPartner(input);
        browser.pause(delaySecond);
        actions.waitForLoadingDotsDisappearIfAny(delaySecond * 30);
        browser.pause(delaySecond);

        if ($(locators.rulesNotFound).isVisible()) {
            console.log('No Rules Found... Skip');
            this.skip();
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
        var doAll = true;
        var createdBy, arrayCreatedBy;
        var sTotal, sNum;
        if (input.createdBy != undefined) {
            doAll = false;
            arrayCreatedBy = input.createdBy.toUpperCase().split(" ").join("").split(",");
            sTotal = input.selectorTotal;
            sNum = input.selectorNum - 1;
        } else {
            sTotal = 1;
            sNum = 0;
        }
        while (($$(locators.array3dots)[i] != undefined) && ($$(locators.array3dots)[i].isExisting())) {
            browser.pause(delaySecond);
            $$(locators.array3dots)[i].waitForEnabled(delaySecond * 2);
            // browser.pause(delaySecond);
            // check createBy colume, if == input.createdBy then try to delete, otherwise skip to the next row
            createdBy = $$(locators.arrayCreatedBy)[i * sTotal + sNum].getText();
            console.log(createdBy);

            if ((doAll) || (arrayCreatedBy.includes(createdBy.toUpperCase()))) {
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
                browser.pause(delaySecond);
                actions.waitForLoadingDotsDisappearIfAny(delaySecond * 30);
            } else {
                // skip to the next row
                i++;
                console.log('skip a rule by ' + createdBy);
            }
        }
        console.log(count + ' rules have been inactivated')
    });
});
