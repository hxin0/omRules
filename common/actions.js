const { schemaSettings, schemaTier } = require("../common/schema");
const { locators, consts, platformName } = require("../common/locators");
const _ = require("lodash/core");
const fs = require("fs");
const TimelineReporter = require('wdio-timeline-reporter').default;

exports.clickLoginButtonWhileExisting = function (login) {
  let platform = browser.capabilities.platformName;
  if (login.newLoginPage) {
    if (platform == platformName.mac) {
      $(locators.loginNextButton).waitForExist({timeout: consts.delay * 10 });
      if (login.username != undefined) {
        $(locators.username).setValue(login.username);
        $(locators.loginNextButton).click();
      } else {
        $(locators.loginNextButton).waitForExist({timeout: consts.delay * 30, reverse: true});
      }
      $(locators.loginButton).waitForExist({timeout: consts.delay * 10 });
      if (login.password != undefined) {
        $(locators.password).setValue(login.password);
        $(locators.loginButton).click();
      } else {
        $(locators.loginButton).waitForExist({timeout: consts.delay * 30, reverse: true});
      }     
    }
  } else {
    if (platform == platformName.mac) {    
      while ($(locators.loginButton).isExisting()) {
        if (login.username != undefined)
          $(locators.username).setValue(login.username);
        if (login.password != undefined)
          $(locators.password).setValue(login.password);
        if (login.username != undefined && login.password != undefined)
          $(locators.loginButton).click();
        else {
          browser.pause(consts.delay * 30);
        }
      }
    }
  }
};

exports.searchTradingPartner = function (setEnv, input) {
  const waitRetry = {
    delay: setEnv.delaySecond * 1000,
    maxTries: setEnv.maxTries
  }
  this.waitForExistThenClick(locators.searchMenuDropdown, waitRetry);
  $(locators.searchMenu1TradingPartner).click();
  $(locators.searchRuleName).setValue(input.tradingPartner);
  this.waitForExistWithRetry("=".concat(input.tradingPartner), waitRetry);
  browser.pause(waitRetry.delay);
  $("=".concat(input.tradingPartner)).click();
};

exports.clickNewRuleButton = function (waitRetry) {
  this.waitForExistWithRetry(locators.configureNewRuleButton, waitRetry);

  $(locators.searchMenuDropdown).waitForExist({ timeout: waitRetry.delay });
  $(locators.configureNewRuleButton).click();
};

exports.waitForLoadingDotsDisappearIfAny = function (delay) {
  if ($(locators.loadingDots).isDisplayed()) {
    $(locators.loadingDots).waitForDisplayed({ timeout: delay * 60 , reverse: true });
  }
  browser.pause(delay);
};

exports.createRule = function (ruleName, { delay=1000, maxTries=10 } = {}) {
  const waitRetry = { delay, maxTries };
  browser.pause(delay / 2);
  $(locators.searchRuleName).waitForExist({ timeout: delay });
  browser.pause(delay / 2);
  $(locators.searchRuleName).setValue(ruleName);

  this.waitForExistWithRetry(locators.ruleNameDropdownValue, { delay, maxTries });
  this.verifyDropdownList(locators.ruleNameDropdownValue, locators.searchRuleName, ruleName, waitRetry);

  while ($(locators.ruleNameDropdownValue).isDisplayed()) {
    this.clickWithRetry(locators.ruleNameDropdownValue, maxTries);
    browser.pause(delay);
  }

  this.waitForLoadingDotsDisappearIfAny(delay);

  $(locators.ruleNameRow).waitForExist({ timeout: delay });
  while (true) {
    if ($(locators.ruleNameColumn).getText().toUpperCase() == ruleName.toUpperCase()) {
      break;
    }
    browser.pause(delay);
  }

  // try again if the error occurs:
  // Element is not clickable at point, Other element would receive the click
  let countTries = 0;
  while (true) {
    try {
      // $(locators.ruleNameRow).click();
      $(locators.ruleNameColumn).click();      
      break;
    } catch (e) {
      console.log(`"Element is not clickable" exception was thrown, retry ${countTries + 1}`);
      console.log(e);
      $(locators.ruleNameColumn).scrollIntoView();
      if (countTries++ >= maxTries) throw e;
    }
  }
};

exports.setAttributeTradingPartner = function (tradingPartner, { delay=1000, maxTries=10 } = {}) {
  const waitRetry = { delay, maxTries };
  this.waitForExistThenClick(locators.selectAttributeDropdown, waitRetry);
  $(locators.inputAttribute).waitForExist({ timeout: delay });
  this.waitForExistWithRetry(locators.inputAttribute, waitRetry);
  $(locators.inputAttribute).setValue(consts.ucrTradingPartner); // UCR Trading Partner

  this.waitForExistThenClick(locators.dropdownItem, waitRetry);
  this.verifyValue(locators.inputAttribute, locators.inputAttributeText, 0, consts.ucrTradingPartner, waitRetry);

  $(locators.selectOperatorDropdown).waitForExist({ timeout: delay });
  $(locators.selectOperatorDropdown).click();
  $(locators.operatorEquals).click(); // Equals

  this.waitForExistThenClick(locators.attributeValue, waitRetry);
  $(locators.attributeValue).setValue(tradingPartner + " "); // Trading Partner
  this.waitForExistThenClick(locators.firstAttributeDropdownValue, waitRetry);
};

exports.setAttributeTradingPartner2 = function (tradingPartner, { delay=1000, maxTries=10 } = {}) {
  const waitRetry = { delay, maxTries };
  this.waitForExistThenClick(locators.selectAttributeDropdown, waitRetry);
  $(locators.inputAttribute).waitForExist({ timeout: delay });
  this.waitForExistWithRetry(locators.inputAttribute, waitRetry);
  $(locators.inputAttribute).setValue(consts.ucrTradingPartner); // UCR Trading Partner

  this.waitForExistThenClick(locators.dropdownItem, waitRetry);
  this.verifyValue(locators.inputAttribute, locators.inputAttributeText, 0, consts.ucrTradingPartner, waitRetry);

  $(locators.selectOperatorDropdown).waitForExist({ timeout: delay });
  $(locators.selectOperatorDropdown).click();
  $(locators.operatorEquals).click(); // Equals

  browser.pause(delay);
  this.waitForExistThenClick(locators.orderRuleCriteriaValue2, waitRetry);
  $(locators.orderRuleCriteriaValue2).setValue(tradingPartner + " "); // Trading Partner
  this.waitForExistThenClick(locators.firstAttributeDropdownValue, waitRetry);
};

exports.setAttribute2 = function (attribute, index, { delay=1000, maxTries=10 } = {}) {
  const waitRetry = { delay, maxTries };
  $(locators.addAttributeButton).click();
  $(locators.selectAttributeDropdown).waitForExist({ timeout: delay });
  $(locators.selectAttributeDropdown).click();
  this.waitForExistWithRetry(locators.inputAttribute, waitRetry);
  $(locators.inputAttribute).setValue(attribute); // UCR SCAC

  // ckeck here, if locator.dropdownItem getText is not correct, retry setValue again
  this.waitForExistThenClick(locators.dropdownItem, waitRetry);
  this.verifyValue(locators.inputAttribute, locators.inputAttributeText, index, attribute, waitRetry);
  // or maybe check the above mentioned here?

  $(locators.selectOperatorDropdown).waitForExist({ timeout: delay });
  $(locators.selectOperatorDropdown).click();
  $(locators.operatorEquals2).click(); // Equals
};

exports.setAttributeScac = function (scac, index, { delay=1000, maxTries=10 } = {}) {
  const waitRetry = { delay, maxTries };
  this.setAttribute2(consts.ucrScac, index, waitRetry);

  $(locators.orderRuleCriteriaValue2).waitForExist({ timeout: delay });
  $(locators.orderRuleCriteriaValue2).click();
  $(locators.orderRuleCriteriaValue2).setValue(scac);
};

exports.setResultant = function (code, { delay=1000, maxTries=10 } = {}) {
  $(locators.resultantActionValue).waitForExist({ timeout: delay });
  $(locators.resultantActionValue).click();
  $(locators.resultantActionValue).setValue(code);
  browser.pause(delay);
  this.waitForExistThenClick(locators.resultantActionValueDropdownItem, { delay, maxTries });
};

exports.setResultant2 = function (code, { delay=1000, maxTries=10 } = {}) {
  $(locators.resultantActionValue2).waitForExist({ timeout: delay });
  $(locators.resultantActionValue2).click();
  $(locators.resultantActionValue2Input).setValue(code);
  browser.pause(delay);
  this.waitForExistThenClick(locators.resultantActionValue2DropdownItem, { delay, maxTries });
};

exports.readDataSheets = async function readDataSheets(
  setEnv,
  setData,
  schema = schemaTier,
  tabName = "tier"
) {
  const xlsxRead = require("read-excel-file/node");
  var login = {};
  fs.access("testdata/loginTest.xlsx", async (err) => {
    if (err) {
      return;
    } else {
      await xlsxRead("testdata/loginTest.xlsx", {
        schema: schemaSettings,
        sheet: "login",
      }).then(({ rows }) => {
        login = rows[0];
      });
    }
  });
  await xlsxRead("testdata/settings.xlsx", {
    schema: schemaSettings,
    sheet: "settings",
  }).then(({ rows }) => {
    for (let i = 0; i < rows.length; i++) {
      if (!rows[i].skip) {
        setEnv = rows[i];
        break;
      }
    }
    if (!setEnv) setEnv = rows[0]; // if all rows have SKIP, use the 1st row
  });
  await xlsxRead("testdata/settings.xlsx", {
    schema: schema,
    sheet: tabName,
  }).then(({ rows }) => {
    setData = rows.filter((row) => !row.skip);
  });

  if (_.size(login) > 0) {
    setEnv.username = login.username;
    setEnv.password = login.password;
  }

  return { setEnv, setData };
};

exports.waitForResultantWithRetry = function (ruleName, resultantType, { delay=1000, maxTries=10 } = {}) {
  let countTries = 0;
  // if it goes to a wrong rule name page, retry
  while ($(locators.textRuleName).getText().toUpperCase() != ruleName.toUpperCase()) {
    // go back
    $(locators.goBack).click();
    this.createRule(ruleName, { delay, maxTries });
    countTries++;
    if (countTries >= maxTries) break;
  }

  // if resultant section not appear, wait max maxTries times
  // if still not appear, go back to revisit the page
  // if go back maxTries times still not appear, throw error
  countTries = 0;
  let backTries = 0;
  while (true) {
    try {
      if (resultantType === 1) {
        $(locators.resultantActionValue).waitForExist({ timeout: delay * (countTries + 1) });
      } else {
        $(locators.resultantActionValue2).waitForExist({ timeout: delay * (countTries + 1) });
      }
      break;
    } catch (e) {
      if (backTries < maxTries) {
        if (countTries++ >= maxTries) {
          //then navigate back and try maxTries times
          console.log(`resultant action fields not appear, retry ${backTries + 1}`);
          $(locators.goBack).click();
          this.createRule(ruleName, { delay, maxTries });
          backTries++;
          countTries = 0;
        }
      } else {
        throw e;
      }
    }
  }
}

exports.waitForExistThenClick = function (element, { delay=1000, maxTries=10 } = {}) {
  const waitRetry = { delay, maxTries };
  this.waitForExistWithRetry(element, waitRetry);
  this.clickWithRetry(element, waitRetry);
}

exports.waitForExistWithRetry = function (element, { delay=1000, maxTries=10 } = {}) {
  let countTries = 0;
  while (true) {
    try {
      $(element).waitForExist({ timeout: delay * (countTries + 1) });
      break;
    } catch (e) {
      console.log(`"Element ${element} is not existing" after ${delay * (countTries + 1 )} milliseconds. Retry ${countTries + 1}`);
      if (countTries++ >= maxTries) {
        throw e;
      }
    }
  }
}

exports.clickWithRetry = function (element, { delay=1000, maxTries=10 } = {}) {
  let countTries = 0;
  while (true) {
    try {
      $(element).click();
      break;
    } catch (e) {
      if (countTries++ >= maxTries) throw e;
      console.log(`"Element ${element} is not clickable". Retry ${countTries}`);
      browser.pause(delay * countTries);
    }
  }
}

exports.verifyValue = function (elementSet, elementText, index, value, { delay=1000, maxTries=10 } = {}) {
  const waitRetry = { delay, maxTries };
  let text = $$(elementText)[index].getText();
  let countTries = 0;
  while (text.toUpperCase() != value.toUpperCase()) {
    $(elementSet).setValue(value);
    this.waitForExistThenClick(locators.dropdownItem, waitRetry);
    browser.pause(delay * (countTries + 1));
    text = $$(elementText)[index].getText();
    if (countTries++ > maxTries) throw `element ${elementSet} set value not equl to ${elementText}`;
  }
}

exports.verifyDropdownList = function (element, elementSet, value, { delay=1000, maxTries=10 } = {}) {
  let countTries = 1, countSet = 1;
  while (true) {
    try {
      $(element).waitForExist({ timeout: delay * countTries * countSet });
      break;
    } catch (e) {
      console.log(`Dropdown Element ${element}: ${value} is not existing after ${delay * countTries * countSet} milliseconds. Retry ${countTries + maxTries * (countSet-1)}`);
      if (countSet >= 3) {
        throw e;
      }
      if (countTries++ <= maxTries) {
        $(elementSet).setValue(value);
        browser.pause(delay * countTries * countSet);
      } else {
        countTries = 1;
        countSet++;
      }
    }
  }
}

exports.checkAfterSave = function ({ delay=1000, maxTries=10 } = {}) {
  let countTries = 1;
  const sn = {title:"", content:"", saved: true, msg:""};

  while (true) {
    if ($(locators.snTitle).isDisplayed()) {
      sn.title = $(locators.snTitle).getText();
      sn.content = $(locators.snContent).getText();
      if (sn.title = consts.snTitleSuccess) {
        sn.saved = true;
        sn.msg = 'Rule saved';
        break;
      } else if (sn.title = consts.snTitleFailure) {
        sn.saved = false;
        sn.msg = 'Rule not saved, please redo this rule';
        break;
      } else if (sn.title = consts.snTitleValidationError) {
        sn.saved = 'duplicateRule';
        sn.msg = 'Duplicate rule exists, continue...';
        break;
      }
      console.log(sn)
      break;
    }
    browser.pause(delay);
    if (countTries++ > 5) {
      console.log('no simple notification displayed')
      break;
    }
  }

  if (sn.content == consts.duplicateRuleMsg) {
    console.log('Duplicate rule exists, continue...');
    $(locators.goBack).click();
    browser.pause(delay);
    $(locators.goBack).click();
    browser.pause(delay);
    return sn;
  } else if (sn.title == "Failure") {
    return sn;
  }
  countTries = 1;
  while (true) {
    try {
      $(locators.saveButton).waitForExist({ timeout: delay * countTries, reverse: true });
      break;
    } catch (e) {
      console.log(`Save button still exists after ${delay * countTries} milliseconds. Wait ${countTries}`);
      if (countTries++ >= 2) {
        $(locators.goBack).click();
        browser.pause(delay);
        $(locators.goBack).click();
        browser.pause(delay);
        return sn;
      }
    }
  }
  return sn;
}

exports.tier1 = function tier1(
  input,
  tExcel,
  ruleName,
  resultantType,
  ml,
  { delay=1000, maxTries=50 }
) {
  var i;
  var ruleCode = "";
  var scacCode = "";
  var selectedShp = [];
  var createdRule = {};
  var skipClickNewRuleButton = false;
  var sn;
  const waitRetry = { delay, maxTries };
  for (i = 0; i < tExcel.length; i++) {
    if (tExcel[i].code != ruleCode || tExcel[i].scac != scacCode) {
      // start a new rule
      console.log("Creating Tier 1 " + ruleName + " rule.");
      ruleCode = tExcel[i].code;
      scacCode = tExcel[i].scac;
      if (!skipClickNewRuleButton) this.clickNewRuleButton(waitRetry);

      this.createRule(ruleName, waitRetry);
      // configure new rule page -- TP

      // if resultant action section not loaded, try to wait ${maxTries} times
      // if still not existing, navigate back and try again
      // if tried back 3 times, still not existing, throw error
      this.waitForResultantWithRetry(ruleName, resultantType, 2, waitRetry);
      browser.pause(delay / 2);
      this.setAttributeTradingPartner(input.tradingPartner, waitRetry);

      this.setAttribute2(consts.pickupSiteCode, 2, waitRetry);
    }
    $(locators.attributeValue2).waitForExist({ timeout: delay });
    $(locators.attributeValue2).click();
    $(locators.attributeValue2).setValue(tExcel[i].shipper + " "); // Shipper code
    // browser.pause(delay);
    this.waitForLoadingDotsDisappearIfAny(delay);
    this.verifyDropdownList(locators.firstAttributeDropdownValue, locators.attributeValue2, tExcel[i].shipper, waitRetry);
    if ($(locators.firstAttributeDropdownValue).isExisting()) {

      let eleExists = false;
      if (
        $(locators.firstAttributeDropdownValue).getText() ==
        tExcel[i].shipper
      ) {
        eleExists = true;
        // $(locators.firstAttributeDropdownValue).click(); // existing but not clickable if fitst dropdown item is blank
        this.clickWithRetry(locators.firstAttributeDropdownValue, maxTries);
        selectedShp.push(tExcel[i].shipper);
      } else {
        for (let k = 0; k < $$(locators.siteCodeDropdownArray).length; k++) {
          let ele =
            locators.siteCodeDropdownItem1Half +
            k +
            locators.siteCodeDropdownItem2Half;
          if ($(ele).getText() == tExcel[i].shipper) {
            $(ele).click();
            eleExists = true;
            selectedShp.push(tExcel[i].shipper);
            break;
          }
        }
      }
      if (!eleExists) {
        ml.missingLocations.push(tExcel[i].shipper);
        ml.parentCode = tExcel[i].code;
        console.log(`missing shipper location: ${tExcel[i].shipper}`);
      }
      // browser.pause(delay);
    }

    // Save if billto code or scac on next row changes, or reached to the end
    if (
      i == tExcel.length - 1 ||
      tExcel[i + 1].code != ruleCode ||
      tExcel[i + 1].scac != scacCode
    ) {
      if (selectedShp.length == 0) {
        // check if shipper field is blank? cancel : continue
        missingLocationsFileUpdate(ml);
        $(locators.cancelButton).click();
        $(locators.cancelYesButton).waitForExist({ timeout: delay });
        browser.pause(delay);
        $(locators.cancelYesButton).click();
        skipClickNewRuleButton = true;
        browser.pause(delay);
      } else {
        if (tExcel[i].scac != undefined) {
          // Add scac
          this.setAttributeScac(tExcel[i].scac, 4, waitRetry);
        }
        missingLocationsFileUpdate(ml);
        resultantType === 1
          ? this.setResultant(ruleCode, waitRetry)
          : this.setResultant2(ruleCode, waitRetry);
        browser.pause(delay / 2);
        $(locators.saveButton).click();
        this.waitForLoadingDotsDisappearIfAny(delay);

        createdRule.parentCode = ruleCode;
        if (tExcel[i].scac != undefined) createdRule.scac = scacCode; // tExcel[i].scac);
        createdRule.shipperCode = selectedShp;

        sn = this.checkAfterSave(waitRetry);
        console.log(`Tier 1 ${ruleName} - ${sn.msg}:`)
        console.log(createdRule);
        createdRule = {};
        selectedShp.length = 0;
        skipClickNewRuleButton = false;
      }
    }
  }
};

exports.tier2 = function tier2(
  input,
  tExcel,
  ruleName,
  resultantType,
  ml,
  { delay=1000, maxTries=50 }
) {
  var i;
  var ruleCode = "";
  var shpCode = "";
  var scacCode = "";
  var selectedShp = [];
  var selectedRec = [];
  var createdRule = {};
  var skipClickNewRuleButton = false;
  var sn;
  const waitRetry = { delay, maxTries };
  for (i = 0; i < tExcel.length; i++) {
    if (
      tExcel[i].code != ruleCode ||
      tExcel[i].shipper != shpCode ||
      tExcel[i].scac != scacCode
    ) {
      // start a new rule
      console.log("Creating Tier 2 " + ruleName + " rule.");
      ruleCode = tExcel[i].code;
      shpCode = tExcel[i].shipper;
      scacCode = tExcel[i].scac;

      if (!skipClickNewRuleButton) this.clickNewRuleButton(waitRetry);

      this.createRule(ruleName, waitRetry);
      // configure new rule page -- TP

      this.waitForResultantWithRetry(ruleName, resultantType, 2, waitRetry);

      this.setAttributeTradingPartner(input.tradingPartner, waitRetry);

      this.setAttribute2(consts.pickupSiteCode, 2, waitRetry);

      $(locators.attributeValue2).waitForExist({ timeout: delay });
      $(locators.attributeValue2).click();
      $(locators.attributeValue2).setValue(tExcel[i].shipper + " "); // Shipper code
      // browser.pause(delay);
      this.waitForLoadingDotsDisappearIfAny(delay);
      this.waitForExistWithRetry(locators.firstAttributeDropdownValue, waitRetry);
      if ($(locators.firstAttributeDropdownValue).isExisting()) {
        // browser.pause(delay);
        let eleExists = false;
        if (
          $(locators.firstAttributeDropdownValue).getText() ==
          tExcel[i].shipper
        ) {
          eleExists = true;
          // $(locators.firstAttributeDropdownValue).click(); // existing but not clickable if fitst dropdown item is blank
          this.clickWithRetry(locators.firstAttributeDropdownValue, maxTries);
          selectedShp.push(tExcel[i].shipper);
        } else {
          for (let k = 0; k < $$(locators.siteCodeDropdownArray).length; k++) {
            let ele =
              locators.siteCodeDropdownItem1Half +
              k +
              locators.siteCodeDropdownItem2Half;
            if ($(ele).getText() == tExcel[i].shipper) {
              $(ele).click();
              eleExists = true;
              selectedShp.push(tExcel[i].shipper);
              break;
            }
          }
        }
        if (!eleExists) {
          ml.missingLocations.push(tExcel[i].shipper);
          ml.parentCode = tExcel[i].code;
          console.log(`missing shipper location: ${tExcel[i].shipper}`);
        }
        // browser.pause(delay);
      }
      // configure new rule page - receiver
      if (selectedShp.length > 0) {
        this.setAttribute2(consts.deliverySiteCode, 4, waitRetry);
      }
    }

    if (selectedShp.length > 0) {
      var receiverField = $$(locators.attributeValue)[2];
      receiverField.waitForExist({ timeout: delay });
      receiverField.click();
      receiverField.setValue(tExcel[i].receiver + " ");
      // browser.pause(delay);
      this.waitForLoadingDotsDisappearIfAny(delay);
      this.waitForExistWithRetry(locators.firstAttributeDropdownValue, waitRetry);
      if ($(locators.firstAttributeDropdownValue).isExisting()) {
        // browser.pause(delay);
        let eleExists = false;
        if (
          $(locators.firstAttributeDropdownValue).getText() ==
          tExcel[i].receiver
        ) {
          eleExists = true;
          // $(locators.firstAttributeDropdownValue).click(); // existing but not clickable if fitst dropdown item is blank
          this.clickWithRetry(locators.firstAttributeDropdownValue, maxTries);
          selectedRec.push(tExcel[i].receiver);
        } else {
          for (let k = 0; k < $$(locators.siteCodeDropdownArray).length; k++) {
            let ele =
              locators.siteCodeDropdownItem1Half +
              k +
              locators.siteCodeDropdownItem2Half;
            if ($(ele).getText() == tExcel[i].receiver) {
              $(ele).click();
              eleExists = true;
              selectedRec.push(tExcel[i].receiver);
              break;
            }
          }
        }
        if (!eleExists) {
          ml.missingLocations.push(tExcel[i].receiver);
          ml.parentCode = tExcel[i].code;
          console.log(`missing receiver location: ${tExcel[i].receiver}`);
        }
        // browser.pause(delay);
      }
    }
    // Save if billto code or shipper code or scac on next row changes, or reached to the end
    if (
      i == tExcel.length - 1 ||
      tExcel[i + 1].code != ruleCode ||
      tExcel[i + 1].shipper != shpCode ||
      tExcel[i + 1].scac != scacCode
    ) {
      if (selectedShp.length == 0 || selectedRec.length == 0) {
        // check if shipper field is blank? cancel : continue
        missingLocationsFileUpdate(ml);
        $(locators.cancelButton).click();
        $(locators.cancelYesButton).waitForExist({ timeout: delay });
        browser.pause(delay);
        $(locators.cancelYesButton).click();
        skipClickNewRuleButton = true;
        browser.pause(delay);
      } else {
        if (tExcel[i].scac != undefined) {
          // Add scac
          this.setAttributeScac(tExcel[i].scac, 6, waitRetry);
        }
        missingLocationsFileUpdate(ml);
        resultantType === 1
          ? this.setResultant(ruleCode, waitRetry)
          : this.setResultant2(ruleCode, waitRetry);
        browser.pause(delay / 2);
        $(locators.saveButton).click();
        browser.pause(delay);
        createdRule.parentCode = ruleCode;
        if (tExcel[i].scac != undefined) createdRule.scac = scacCode; // tExcel[i].scac);
        createdRule.shipperCode = selectedShp;
        createdRule.receiverCode = selectedRec;

        sn = this.checkAfterSave(waitRetry);
        console.log(`Tier 2 ${ruleName} - ${sn.msg}:`)
        console.log(createdRule);
        createdRule = {};
        selectedShp.length = 0;
        selectedRec.length = 0;
        skipClickNewRuleButton = false;
      }
    }
  }
};

function missingLocationsFileUpdate(ml) {
  if (ml.missingLocations.length > 0) {
    fs.readFile("./testdata/ml.json", function (errR, data) {
      var missingLocationsFile = JSON.parse(data);
      ml.dateTime = new Date().toLocaleString();
      missingLocationsFile.push(ml);
      fs.writeFile(
        "./testdata/ml.json",
        JSON.stringify(missingLocationsFile, null, 4),
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("*********************");
          console.log("missing location codes appended to ml.json file:");
          console.log(ml);
          console.log("*********************");
          ml.missingLocations.length = 0;
        }
      );
    });
  }
}

exports.timelineAddContext = function(waitRetry) {
  TimelineReporter.addContext({
    title: 'delay',
    value: `${waitRetry.delay}`
  });
  TimelineReporter.addContext({
      title: 'maxTries',
      value: `${waitRetry.maxTries}`
  });
}
// this old function has a problem that later call will overwite the previous ml object
// the json file ends up with duplicate appending ml objects
// for example if there are 3 objects, it will show the last object 3 times after finish running
// leave here for more understanding on this later
function missingLocationsFileUpdateOld(ml) {
  let missingLocationsFile = require("../testdata/ml");
  if (ml.missingLocations.length > 0) {
    ml.dateTime = new Date().toLocaleString();
    missingLocationsFile.push(ml);
    fs.writeFile(
      "./testdata/ml.json",
      JSON.stringify(missingLocationsFile, null, 4),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("missing location codes have been written back.");
      }
    );
  }
}
