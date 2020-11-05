const { locators } = require('../common/locators');
const actions = require('../common/actions');
const { schemaInactivateRules } = require('../common/schema');

describe('inactivate rules', function () {

    var setEnv = {};
    var setData = [];
    const waitRetry = {
        delay: 1000,
        maxTries: 10
    };
    var count = 0;

    before('read excel file first', async function () {
        ({ setEnv, setData } = await actions.readDataSheets(setEnv, setData, schemaInactivateRules, 'ir'));
    })

    it('should inactivate rules by user for a trading partner', function () {
        waitRetry.delay = setEnv.delaySecond? setEnv.delaySecond * 1000 : waitRetry.delay;
        waitRetry.maxTries = setEnv.maxTries? setEnv.maxTries : waitRetry.maxTries;
        let noMore = false;
        actions.timelineAddContext(waitRetry);

        browser.url(setEnv.url);
        browser.pause(waitRetry.delay);

        actions.clickLoginButtonWhileExisting(setEnv);

        browser.pause(waitRetry.delay);
        // loop start
        for (let j = 0; j < setData.length; j++) {
            console.log(`Start settings.xlsx/ir: row ${j + 1}: ${setData[j].tradingPartner}`);
            console.log(Date().toLocaleString());
            actions.searchTradingPartner(setEnv, setData[j]);
            actions.waitForLoadingDotsDisappearIfAny(waitRetry.delay);

            var ele = locators.datatablePager;
            var countTries = 0;
            waitRetry.maxTries = 5;
            while (true) {
                try {
                    $(ele).waitForExist({ timeout: waitRetry.delay * (countTries + 1) });
                    break;
                } catch (err) {
                    if (countTries++ >= waitRetry.maxTries) break;
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
            waitRetry.maxTries = setEnv.maxTries;

            while ($$(locators.array3dots)[i] != undefined) {
                noMore = false;
                countTries = 0;
                while (true) {
                    try {
                        $$(locators.array3dots)[i].waitForExist({ timeout: waitRetry.delay * (countTries +1) });
                        break;
                    } catch (e) {
                        if (countTries++ >= waitRetry.maxTries) {
                            console.log(`3dots array error, retry ${countTries + 1}`);
                        } else {
                            if ($(locators.rulesNotFound).isDisplayed()) {
                                console.log('No Rules Found... Skip');
                                noMore = true;
                                break;
                            }
                            throw e;
                        }
                    }
                }
                if (noMore) break;
                // check createBy colume, if == setData.createdBy then try to delete, otherwise skip to the next row
                if ($$(locators.arrayCreatedBy)[i * sTotal + sNum] != undefined) {
                    createdBy = $$(locators.arrayCreatedBy)[i * sTotal + sNum].getText();
                    console.log(createdBy);
                } else createdBy = "";

                if ((doAll) || (arrayCreatedBy.includes(createdBy.toUpperCase()))) {

                    countTries =0;
                    while (true) {
                        try {
                            $$(locators.array3dots)[i].click();
                            break;
                        } catch (e) {
                            if ($(locators.rulesNotFound).isDisplayed()) {
                                console.log('No Rules Found... Skip');
                                noMore = true;
                                break;
                            }
                            console.log(`span-3dots is not clickable. Retry ${countTries + 1}`);
                            console.log(e);
                            if ($$(locators.array3dots)[i] != undefined)
                                $$(locators.array3dots)[i].scrollIntoView();
                            if (countTries++ >= waitRetry.maxTries) throw e;
                        }
                    }   
                    if (noMore) break;    
                    browser.pause(waitRetry.delay);
                    actions.waitForExistWithRetry(locators.inactivateMenu, waitRetry);

                    $(locators.inactivateMenu).click();
                    browser.pause(waitRetry.delay);
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
                    actions.waitForLoadingDotsDisappearIfAny(waitRetry.delay);
                } else {
                    // skip to the next row
                    i++;
                    console.log(`skip a rule on row ${i} by ${createdBy}`);
                }
                browser.pause(waitRetry.delay);
            }
            console.log(count + ' rules have been inactivated')
        }
        console.log(Date().toLocaleString());
    });
});
