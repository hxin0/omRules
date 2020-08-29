// const { schemaTieraLogin } = require('../common/schema');
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

    it('should inactivate rules by user for a trading partner', function () {
        delaySecond = setEnv.delaySecond * 1000;

        browser.url(setEnv.url);
        browser.pause(delaySecond);

        actions.clickLoginButtonWhileExisting(setEnv);

        browser.pause(delaySecond);
        // loop start
        for (let j = 0; j < setData.length; j++) {
            console.log(`Start ir: row ${j + 1}: ${setData[j].tradingPartner}`);
            actions.searchTradingPartner(setEnv, setData[j]);
            actions.waitForLoadingDotsDisappearIfAny(delaySecond);

            if ($(locators.rulesNotFound).isVisible()) {
                console.log('No Rules Found... Skip');
                // this.skip();
                continue;
            }

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
            if (setData[j].createdBy != undefined) {
                doAll = false;
                arrayCreatedBy = setData[j].createdBy.toUpperCase().split(" ").join("").split(",");
                sTotal = setData[j].selectorTotal;
                sNum = setData[j].selectorNum - 1;
            } else {
                sTotal = 1;
                sNum = 0;
            }
            while (($$(locators.array3dots)[i] != undefined) && ($$(locators.array3dots)[i].isExisting())) {
                browser.pause(delaySecond);
                $$(locators.array3dots)[i].waitForEnabled(delaySecond * 2);
                // browser.pause(delaySecond);
                // check createBy colume, if == setData.createdBy then try to delete, otherwise skip to the next row
                createdBy = $$(locators.arrayCreatedBy)[i * sTotal + sNum].getText();
                console.log(createdBy);

                if ((doAll) || (arrayCreatedBy.includes(createdBy.toUpperCase()))) {
                    $$(locators.array3dots)[i].click();
                    browser.pause(delaySecond);
                    browser.click(locators.inactivateMenu);
                    browser.pause(delaySecond);
                    console.log(i);
                    console.log($$(locators.array3dots).length);
                    // if can inactivate, "i" will stay, otherwise i++
                    try {
                        browser.click(locators.yesButton);
                    } catch (err) {
                        if (i < $$(locators.array3dots).length) {
                            i++;
                            console.log(`the rule on row ${i} cannot be inactivated.`);
                            continue;
                        } else {
                            console.log('No more rules can be inactivated.');
                            break;
                        }
                    }
        
                    count++;
                    actions.waitForLoadingDotsDisappearIfAny(delaySecond);
                } else {
                    // skip to the next row
                    i++;
                    console.log(`skip a rule on row ${i} by ${createdBy}`);
                }
            }
            console.log(count + ' rules have been inactivated')
        }
        // loop end
    });
});