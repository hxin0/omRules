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
            console.log(`Start settings.xlsx/ir: row ${j + 1}: ${setData[j].tradingPartner}`);
            console.log(Date().toLocaleString());
            actions.searchTradingPartner(setEnv, setData[j]);
            actions.waitForLoadingDotsDisappearIfAny(delaySecond);

            var ele = locators.datatablePager;
            var countTries = 0;
            var maxTries = 2;
            while (true) {
                try {
                    $(ele).waitForExist(delaySecond * 2);
                    break;
                } catch (err) {
                    if (countTries++ >= maxTries) break;
                }
            }

            if ($(locators.rulesNotFound).isDisplayed()) {
                console.log('No Rules Found... Skip');
                continue;
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
                countTries = 0;
                maxTries = 50;

                while (true) {
                    try {
                        $$(locators.array3dots)[i].waitForExist(delaySecond * 2);
                        break;
                    } catch (e) {
                        if (countTries++ >= maxTries) {
                            console.log('3dots array error, retry');
                        } else {
                            throw e;
                        }
                    }
                }

                // check createBy colume, if == setData.createdBy then try to delete, otherwise skip to the next row
                createdBy = $$(locators.arrayCreatedBy)[i * sTotal + sNum].getText();
                console.log(createdBy);

                if ((doAll) || (arrayCreatedBy.includes(createdBy.toUpperCase()))) {

                    countTries =0;
                    while (true) {
                        try {
                            $$(locators.array3dots)[i].click();
                            break;
                        } catch (e) {
                            console.log('span-3dots is not clickable. Retry...');
                            console.log(e);
                            $$(locators.array3dots)[i].scrollIntoView();
                            if (countTries++ >= maxTries) throw e;
                        }
                    }       
                    browser.pause(delaySecond);
                    $(locators.inactivateMenu).click();
                    browser.pause(delaySecond);
                    console.log(`${i+1} of ${$$(locators.array3dots).length}`);
                    // if can inactivate, "i" will stay, otherwise i++
                    try {
                        $(locators.yesButton).click();
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
                browser.pause(delaySecond);
            }
            console.log(count + ' rules have been inactivated')
        }
        console.log(Date().toLocaleString());
    });
});
