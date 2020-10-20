const { schemaSettings, schemaTier } = require("../common/schema");
const { locators, consts } = require("../common/locators");
const _ = require("lodash/core");
const fs = require("fs");
const { lookupService } = require("dns");

exports.clickLoginButtonWhileExisting = function (login) {
  if (login.newLoginPage) {
    while (browser.isExisting(locators.loginNextButton)) {
      if (login.username != undefined)
        browser.setValue(locators.username, login.username);
      else {
        browser.pause(consts.delaySecond * 5000);
      }
      browser.click(locators.loginNextButton);
    }
    browser.pause(consts.delaySecond);
    while (browser.isExisting(locators.loginButton)) {
      if (login.password != undefined)
        browser.setValue(locators.password, login.password);
      else {
        browser.pause(consts.delaySecond * 5000);
      }
      if (login.username != undefined && login.password != undefined)
        browser.click(locators.loginButton);
    }
  } else {
    while (browser.isExisting(locators.loginButton)) {
      if (login.username != undefined)
        browser.setValue(locators.username, login.username);
      if (login.password != undefined)
        browser.setValue(locators.password, login.password);
      if (login.username != undefined && login.password != undefined)
        browser.click(locators.loginButton);
      else {
        browser.pause(consts.delaySecond * 30);
      }
    }
  }
};

exports.searchTradingPartner = function (setEnv, input) {
  const delaySecond = setEnv.delaySecond * 1000;
  // browser.waitForExist(locators.searchMenuDropdown, delaySecond);
  // browser.click(locators.searchMenuDropdown);
  this.waitForExistThenClick(locators.searchMenuDropdown, delaySecond);
  browser.click(locators.searchMenu1TradingPartner);
  browser.setValue(locators.searchRuleName, input.tradingPartner);
  browser.pause(delaySecond);
  browser.waitForExist("=".concat(input.tradingPartner), delaySecond);
  browser.click("=".concat(input.tradingPartner));
};

exports.clickNewRuleButton = function (delaySecond) {
  // $(locators.configureNewRuleButton).waitForExist(delaySecond);
  this.waitForExistWithRetry(locators.configureNewRuleButton, delaySecond);

  $(locators.searchMenuDropdown).waitForExist(delaySecond);
  $(locators.configureNewRuleButton).click();
};

exports.waitForLoadingDotsDisappearIfAny = function (delaySecond) {
  if ($(locators.loadingDots).isVisible()) {
    $(locators.loadingDots).waitForVisible(delaySecond * 60, true);
  }
  browser.pause(delaySecond);
};

exports.createRule = function (ruleName, delaySecond) {
  browser.pause(delaySecond / 2);
  browser.waitForExist(locators.searchRuleName, delaySecond);
  browser.pause(delaySecond / 2);
  browser.setValue(locators.searchRuleName, ruleName);
  browser.waitForExist(locators.ruleNameDropdownValue, delaySecond);
  browser.pause(delaySecond / 2);
  // browser.click(locators.ruleNameDropdownValue);
  while (browser.isVisible(locators.ruleNameDropdownValue)) {
    this.clickWithRetry(locators.ruleNameDropdownValue);
    browser.pause(delaySecond);
  }

  this.waitForLoadingDotsDisappearIfAny(delaySecond);
  // browser.pause(delaySecond);
  browser.waitForExist(locators.ruleNameRow, delaySecond);
  while (true) {
    // console.log($(locators.ruleNameColumn).getText().toUpperCase());
    if ($(locators.ruleNameColumn).getText().toUpperCase() == ruleName.toUpperCase()) {
      break;
    }
    browser.pause(delaySecond);
  }

  // try again if the error occurs:
  // Element is not clickable at point, Other element would receive the click
  let countTries = 0;
  let maxTries = 3;
  while (true) {
    try {
      // browser.click(locators.ruleNameRow);
      browser.click(locators.ruleNameColumn);      
      break;
    } catch (e) {
      console.log(
        `"Element is not clickable" exception was thrown, retry ${countTries + 1}`
      );
      console.log(e);
      browser.scroll(locators.ruleNameColumn);
      if (countTries++ >= maxTries) throw e;
    }
  }
};

exports.setAttributeTradingPartner = function (tradingPartner, delaySecond) {
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
  browser.setValue(locators.attributeValue, tradingPartner + " "); // Trading Partner
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
  // browser.waitForExist(locators.resultantActionValueDropdownItem, delaySecond);
  // browser.click(locators.resultantActionValueDropdownItem);
  this.waitForExistThenClick(locators.resultantActionValueDropdownItem, delaySecond);
};

exports.setResultant2 = function (code, delaySecond) {
  browser.waitForExist(locators.resultantActionValue2, delaySecond);
  browser.click(locators.resultantActionValue2);
  browser.setValue(locators.resultantActionValue2Input, code);
  browser.pause(delaySecond);
  // browser.waitForExist(locators.resultantActionValue2DropdownItem, delaySecond);
  // browser.click(locators.resultantActionValue2DropdownItem);
  this.waitForExistThenClick(locators.resultantActionValue2DropdownItem, delaySecond);
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

exports.waitForResultantWithRetry = function (ruleName, resultantType, maxTries, delaySecond) {
  let countTries = 0;
  // if it goes to a wrong rule name page, retry
  while (browser.getText(locators.textRuleName).toUpperCase() != ruleName.toUpperCase()) {
    // go back
    browser.click(locators.goBack);
    this.createRule(ruleName, delaySecond);
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
        browser.waitForExist(locators.resultantActionValue, delaySecond * 10);
      } else {
        browser.waitForExist(locators.resultantActionValue2, delaySecond * 10);
      }
      break;
    } catch (e) {
      if (backTries < maxTries) {
        if (countTries++ >= maxTries) {
          //then navigate back and try maxTries times
          console.log(
            `resultant action fields not appear, retry ${backTries + 1}`
          );
          browser.click(locators.goBack);
          this.createRule(ruleName, delaySecond);
          backTries++;
          countTries = 0;
        }
      } else {
        throw e;
      }
    }
  }
}

exports.waitForExistThenClick = function (element, delaySecond) {
  this.waitForExistWithRetry(element, delaySecond);
  this.clickWithRetry(element);
}

exports.waitForExistWithRetry = function (element, delaySecond) {
  let countTries = 0;
  let maxTries = 3;
  while (true) {
    try {
      $(element).waitForExist(delaySecond);
      break;
    } catch (e) {
      if (countTries++ >= maxTries) throw e;
      console.log(`"Element ${element} is not existing" after ${delaySecond} second. Retry ${countTries}`);
    }
  }
}

exports.clickWithRetry = function (element) {
  let countTries = 0;
  let maxTries = 2;
  while (true) {
    try {
      $(element).click();
      break;
    } catch (e) {
      if (countTries++ >= maxTries) throw e;
      console.log(`"Element ${element} is not clickable". Retry ${countTries + 1}`);
      $(element).scroll();
    }
  }
}

exports.tier1 = function tier1(
  input,
  tExcel,
  ruleName,
  resultantType,
  ml,
  delaySecond
) {
  var i;
  var ruleCode = "";
  var scacCode = "";
  var selectedShp = [];
  var createdRule = {};
  var skipClickNewRuleButton = false;
  for (i = 0; i < tExcel.length; i++) {
    if (tExcel[i].code != ruleCode || tExcel[i].scac != scacCode) {
      // start a new rule
      console.log("Creating Tier 1 " + ruleName + " rule.");
      ruleCode = tExcel[i].code;
      scacCode = tExcel[i].scac;
      if (!skipClickNewRuleButton) this.clickNewRuleButton(delaySecond);

      this.createRule(ruleName, delaySecond);
      // configure new rule page -- TP

      // if resultant action section not loaded, try to wait ${maxTries} times
      // if still not existing, navigate back and try again
      // if tried back 3 times, still not existing, throw error
      this.waitForResultantWithRetry(ruleName, resultantType, 2, delaySecond);
      browser.pause(delaySecond / 2);
      this.setAttributeTradingPartner(input.tradingPartner, delaySecond);

      this.setAttribute2(consts.pickupSiteCode, delaySecond);
    }
    browser.waitForExist(locators.attributeValue2, delaySecond);
    browser.click(locators.attributeValue2);
    browser.setValue(locators.attributeValue2, tExcel[i].shipper + " "); // Shipper code
    // browser.pause(delaySecond);
    this.waitForLoadingDotsDisappearIfAny(delaySecond);
    this.waitForExistWithRetry(locators.firstAttributeDropdownValue, delaySecond);
    if (browser.isExisting(locators.firstAttributeDropdownValue)) {
      // browser.pause(delaySecond);
      let eleExists = false;
      if (
        browser.getText(locators.firstAttributeDropdownValue) ==
        tExcel[i].shipper
      ) {
        eleExists = true;
        // browser.click(locators.firstAttributeDropdownValue); // existing but not clickable if fitst dropdown item is blank
        this.clickWithRetry(locators.firstAttributeDropdownValue);
        selectedShp.push(tExcel[i].shipper);
      } else {
        for (let k = 0; k < $$(locators.siteCodeDropdownArray).length; k++) {
          let ele =
            locators.siteCodeDropdownItem1Half +
            k +
            locators.siteCodeDropdownItem2Half;
          if (browser.getText(ele) == tExcel[i].shipper) {
            browser.click(ele);
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
      // browser.pause(delaySecond);
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
        browser.click(locators.cancelButton);
        browser.waitForExist(locators.cancelYesButton, delaySecond);
        browser.pause(delaySecond);
        browser.click(locators.cancelYesButton);
        skipClickNewRuleButton = true;
        browser.pause(delaySecond);
      } else {
        if (tExcel[i].scac != undefined) {
          // Add scac
          this.setAttributeScac(tExcel[i].scac, delaySecond);
        }
        missingLocationsFileUpdate(ml);
        resultantType === 1
          ? this.setResultant(ruleCode, delaySecond)
          : this.setResultant2(ruleCode, delaySecond);
        browser.pause(delaySecond / 2);
        browser.click(locators.saveButton);
        this.waitForLoadingDotsDisappearIfAny(delaySecond);

        createdRule.parentCode = ruleCode;
        if (tExcel[i].scac != undefined) createdRule.scac = scacCode; // tExcel[i].scac);
        createdRule.shipperCode = selectedShp;
        console.log("Tier 1 " + ruleName + " rule is saved:");
        console.log(Date().toLocaleString());
        console.log(createdRule);
        selectedShp.length = 0;
        createdRule = {};
        skipClickNewRuleButton = false;
        browser.pause(delaySecond);
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
  delaySecond
) {
  var i;
  var ruleCode = "";
  var shpCode = "";
  var scacCode = "";
  var selectedShp = [];
  var selectedRec = [];
  var createdRule = {};
  var skipClickNewRuleButton = false;

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

      if (!skipClickNewRuleButton) this.clickNewRuleButton(delaySecond);

      this.createRule(ruleName, delaySecond);
      // configure new rule page -- TP

      this.waitForResultantWithRetry(ruleName, resultantType, 2, delaySecond);

      this.setAttributeTradingPartner(input.tradingPartner, delaySecond);

      this.setAttribute2(consts.pickupSiteCode, delaySecond);

      browser.waitForExist(locators.attributeValue2, delaySecond);
      browser.click(locators.attributeValue2);
      browser.setValue(locators.attributeValue2, tExcel[i].shipper + " "); // Shipper code
      // browser.pause(delaySecond);
      this.waitForLoadingDotsDisappearIfAny(delaySecond);
      this.waitForExistWithRetry(locators.firstAttributeDropdownValue, delaySecond);
      if (browser.isExisting(locators.firstAttributeDropdownValue)) {
        // browser.pause(delaySecond);
        let eleExists = false;
        if (
          browser.getText(locators.firstAttributeDropdownValue) ==
          tExcel[i].shipper
        ) {
          eleExists = true;
          // browser.click(locators.firstAttributeDropdownValue); // existing but not clickable if fitst dropdown item is blank
          this.clickWithRetry(locators.firstAttributeDropdownValue);
          selectedShp.push(tExcel[i].shipper);
        } else {
          for (let k = 0; k < $$(locators.siteCodeDropdownArray).length; k++) {
            let ele =
              locators.siteCodeDropdownItem1Half +
              k +
              locators.siteCodeDropdownItem2Half;
            if (browser.getText(ele) == tExcel[i].shipper) {
              browser.click(ele);
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
        // browser.pause(delaySecond);
      }
      // configure new rule page - receiver
      if (selectedShp.length > 0) {
        this.setAttribute2(consts.deliverySiteCode, delaySecond);
      }
    }

    if (selectedShp.length > 0) {
      var receiverField = $$(locators.attributeValue)[2];
      receiverField.waitForExist(delaySecond);
      receiverField.click();
      receiverField.setValue(tExcel[i].receiver + " ");
      // browser.pause(delaySecond);
      this.waitForLoadingDotsDisappearIfAny(delaySecond);
      this.waitForExistWithRetry(locators.firstAttributeDropdownValue, delaySecond);
      if (browser.isExisting(locators.firstAttributeDropdownValue)) {
        // browser.pause(delaySecond);
        let eleExists = false;
        if (
          browser.getText(locators.firstAttributeDropdownValue) ==
          tExcel[i].receiver
        ) {
          eleExists = true;
          // browser.click(locators.firstAttributeDropdownValue); // existing but not clickable if fitst dropdown item is blank
          this.clickWithRetry(locators.firstAttributeDropdownValue);
          selectedRec.push(tExcel[i].receiver);
        } else {
          for (let k = 0; k < $$(locators.siteCodeDropdownArray).length; k++) {
            let ele =
              locators.siteCodeDropdownItem1Half +
              k +
              locators.siteCodeDropdownItem2Half;
            if (browser.getText(ele) == tExcel[i].receiver) {
              browser.click(ele);
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
        // browser.pause(delaySecond);
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
        browser.click(locators.cancelButton);
        browser.waitForExist(locators.cancelYesButton, delaySecond);
        browser.pause(delaySecond);
        browser.click(locators.cancelYesButton);
        skipClickNewRuleButton = true;
        browser.pause(delaySecond);
      } else {
        if (tExcel[i].scac != undefined) {
          // Add scac
          this.setAttributeScac(tExcel[i].scac, delaySecond);
        }
        missingLocationsFileUpdate(ml);
        resultantType === 1
          ? this.setResultant(ruleCode, delaySecond)
          : this.setResultant2(ruleCode, delaySecond);
        browser.pause(delaySecond / 2);
        browser.click(locators.saveButton);
        browser.pause(delaySecond);
        createdRule.parentCode = ruleCode;
        if (tExcel[i].scac != undefined) createdRule.scac = scacCode; // tExcel[i].scac);
        createdRule.shipperCode = selectedShp;
        createdRule.receiverCode = selectedRec;
        this.waitForLoadingDotsDisappearIfAny(delaySecond);
        console.log("Tier 2 " + ruleName + " rule is saved:");
        console.log(Date().toLocaleString());
        console.log(createdRule);
        selectedShp.length = 0;
        selectedRec.length = 0;
        createdRule = {};
        skipClickNewRuleButton = false;
        browser.waitForVisible(locators.saveButton, delaySecond * 10, true);
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
