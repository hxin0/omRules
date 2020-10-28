const { schemaSettings, schemaTier } = require("../common/schema");
const { locators, consts } = require("../common/locators");
const _ = require("lodash/core");
const fs = require("fs");

exports.clickLoginButtonWhileExisting = function (login) {
  if (login.newLoginPage) {
    $(locators.loginNextButton).waitForExist({timeout: consts.delaySecond * 1000 *10 });
    if (login.username != undefined) {
      $(locators.username).setValue(login.username);
      $(locators.loginNextButton).click();
    } else {
      $(locators.loginNextButton).waitForExist({timeout: consts.delaySecond * 1000 * 30, reverse: true});
    }
    $(locators.loginButton).waitForExist({timeout: consts.delaySecond * 1000 * 10 });
    if (login.password != undefined) {
      $(locators.password).setValue(login.password);
      $(locators.loginButton).click();
    } else {
      $(locators.loginButton).waitForExist({timeout: consts.delaySecond * 1000 * 30, reverse: true});
    }
  } else {
    while ($(locators.loginButton).isExisting()) {
      if (login.username != undefined)
         $(locators.username).setValue(login.username);
      if (login.password != undefined)
        $(locators.password).setValue(login.password);
      if (login.username != undefined && login.password != undefined)
        $(locators.loginButton).click();
      else {
        browser.pause(consts.delaySecond * 30);
      }
    }
  }
};

exports.searchTradingPartner = function (setEnv, input) {
  const delaySecond = setEnv.delaySecond * 1000;
  // $(locators.searchMenuDropdown).waitForExist({ timeout: delaySecond });
  // $(locators.searchMenuDropdown).click();
  this.waitForExistThenClick(locators.searchMenuDropdown, delaySecond);
  $(locators.searchMenu1TradingPartner).click();
  $(locators.searchRuleName).setValue(input.tradingPartner);
  browser.pause(delaySecond);
  $("=".concat(input.tradingPartner)).waitForExist({ timeout: delaySecond });
  $("=".concat(input.tradingPartner)).click();
};

exports.clickNewRuleButton = function (delaySecond) {
  // $(locators.configureNewRuleButton).waitForExist({ timeout: delaySecond });
  this.waitForExistWithRetry(locators.configureNewRuleButton, delaySecond);

  $(locators.searchMenuDropdown).waitForExist({ timeout: delaySecond });
  $(locators.configureNewRuleButton).click();
};

exports.waitForLoadingDotsDisappearIfAny = function (delaySecond) {
  if ($(locators.loadingDots).isDisplayed()) {
    $(locators.loadingDots).waitForDisplayed({ timeout: delaySecond * 60 , reverse: true });
  }
  browser.pause(delaySecond);
};

exports.createRule = function (ruleName, delaySecond) {
  browser.pause(delaySecond / 2);
  $(locators.searchRuleName).waitForExist({ timeout: delaySecond });
  browser.pause(delaySecond / 2);
  $(locators.searchRuleName).setValue(ruleName);
  $(locators.ruleNameDropdownValue).waitForExist({ timeout: delaySecond });
  browser.pause(delaySecond / 2);
  // $(locators.ruleNameDropdownValue).click();
  while ($(locators.ruleNameDropdownValue).isDisplayed()) {
    this.clickWithRetry(locators.ruleNameDropdownValue);
    browser.pause(delaySecond);
  }

  this.waitForLoadingDotsDisappearIfAny(delaySecond);
  // browser.pause(delaySecond);
  $(locators.ruleNameRow).waitForExist({ timeout: delaySecond });
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
      // $(locators.ruleNameRow).click();
      $(locators.ruleNameColumn).click();      
      break;
    } catch (e) {
      console.log(
        `"Element is not clickable" exception was thrown, retry ${countTries + 1}`
      );
      console.log(e);
      $(locators.ruleNameColumn).scrollIntoView();
      if (countTries++ >= maxTries) throw e;
    }
  }
};

exports.setAttributeTradingPartner = function (tradingPartner, delaySecond) {
  $(locators.selectAttributeDropdown).waitForExist({ timeout: delaySecond });

  $(locators.selectAttributeDropdown).click();
  browser.pause(delaySecond);
  $(locators.inputAttribute).waitForExist({ timeout: delaySecond });
  $(locators.inputAttribute).setValue(consts.ucrTradingPartner); // UCR Trading Partner
  browser.pause(delaySecond);

  $(locators.dropdownItem).waitForExist({ timeout: delaySecond });
  $(locators.dropdownItem).click();

  $(locators.selectOperatorDropdown).waitForExist({ timeout: delaySecond });
  $(locators.selectOperatorDropdown).click();
  $(locators.operatorEquals).click(); // Equals

  $(locators.attributeValue).waitForExist({ timeout: delaySecond });
  $(locators.attributeValue).click();
  $(locators.attributeValue).setValue(tradingPartner + " "); // Trading Partner
  browser.pause(delaySecond);
  $(locators.firstAttributeDropdownValue).waitForExist({ timeout: delaySecond });
  $(locators.firstAttributeDropdownValue).click();
};

exports.setAttribute2 = function (attribute, delaySecond) {
  $(locators.addAttributeButton).click();
  $(locators.selectAttributeDropdown).waitForExist({ timeout: delaySecond });

  $(locators.selectAttributeDropdown).click();

  $(locators.inputAttribute).setValue(attribute); // UCR SCAC
  browser.pause(delaySecond);
  $(locators.dropdownItem).waitForExist({ timeout: delaySecond });
  // browser.pause(delaySecond);
  $(locators.dropdownItem).click();

  $(locators.selectOperatorDropdown).waitForExist({ timeout: delaySecond });
  $(locators.selectOperatorDropdown).click();
  $(locators.operatorEquals2).click(); // Equals
};

exports.setAttributeScac = function (scac, delaySecond) {
  this.setAttribute2(consts.ucrScac, delaySecond);

  $(locators.orderRuleCriteriaValue2).waitForExist({ timeout: delaySecond });
  $(locators.orderRuleCriteriaValue2).click();
  $(locators.orderRuleCriteriaValue2).setValue(scac);
};

exports.setResultant = function (code, delaySecond) {
  $(locators.resultantActionValue).waitForExist({ timeout: delaySecond });
  $(locators.resultantActionValue).click();
  $(locators.resultantActionValue).setValue(code);
  browser.pause(delaySecond);
  // $(locators.resultantActionValueDropdownItem).waitForExist({ timeout: delaySecond });
  // $(locators.resultantActionValueDropdownItem).click();
  this.waitForExistThenClick(locators.resultantActionValueDropdownItem, delaySecond);
};

exports.setResultant2 = function (code, delaySecond) {
  $(locators.resultantActionValue2).waitForExist({ timeout: delaySecond });
  $(locators.resultantActionValue2).click();
  $(locators.resultantActionValue2Input).setValue(code);
  browser.pause(delaySecond);
  // $(locators.resultantActionValue2DropdownItem).waitForExist({ timeout: delaySecond });
  // $(locators.resultantActionValue).click(2DropdownItem);
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
  while ($(locators.textRuleName).getText().toUpperCase() != ruleName.toUpperCase()) {
    // go back
    $(locators.goBack).click();
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
        $(locators.resultantActionValue).waitForExist({ timeout: delaySecond * 10 });
      } else {
        $(locators.resultantActionValue2).waitForExist({ timeout: delaySecond * 10 });
      }
      break;
    } catch (e) {
      if (backTries < maxTries) {
        if (countTries++ >= maxTries) {
          //then navigate back and try maxTries times
          console.log(
            `resultant action fields not appear, retry ${backTries + 1}`
          );
          $(locators.goBack).click();
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
      $(element).waitForExist({ timeout: delaySecond });
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
      $(element).scrollIntoView();
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
    $(locators.attributeValue2).waitForExist({ timeout: delaySecond });
    $(locators.attributeValue2).click();
    $(locators.attributeValue2).setValue(tExcel[i].shipper + " "); // Shipper code
    // browser.pause(delaySecond);
    this.waitForLoadingDotsDisappearIfAny(delaySecond);
    this.waitForExistWithRetry(locators.firstAttributeDropdownValue, delaySecond);
    if ($(locators.firstAttributeDropdownValue).isExisting()) {
      // browser.pause(delaySecond);
      let eleExists = false;
      if (
        $(locators.firstAttributeDropdownValue).getText() ==
        tExcel[i].shipper
      ) {
        eleExists = true;
        // $(locators.firstAttributeDropdownValue).click(); // existing but not clickable if fitst dropdown item is blank
        this.clickWithRetry(locators.firstAttributeDropdownValue);
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
        $(locators.cancelButton).click();
        $(locators.cancelYesButton).waitForExist({ timeout: delaySecond });
        browser.pause(delaySecond);
        $(locators.cancelYesButton).click();
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
        $(locators.saveButton).click();
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
        // browser.pause(delaySecond);
        $(locators.saveButton).waitForDisplayed({timeout: delaySecond * 10, reverse: true});
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

      $(locators.attributeValue2).waitForExist({ timeout: delaySecond });
      $(locators.attributeValue2).click();
      $(locators.attributeValue2).setValue(tExcel[i].shipper + " "); // Shipper code
      // browser.pause(delaySecond);
      this.waitForLoadingDotsDisappearIfAny(delaySecond);
      this.waitForExistWithRetry(locators.firstAttributeDropdownValue, delaySecond);
      if ($(locators.firstAttributeDropdownValue).isExisting()) {
        // browser.pause(delaySecond);
        let eleExists = false;
        if (
          $(locators.firstAttributeDropdownValue).getText() ==
          tExcel[i].shipper
        ) {
          eleExists = true;
          // $(locators.firstAttributeDropdownValue).click(); // existing but not clickable if fitst dropdown item is blank
          this.clickWithRetry(locators.firstAttributeDropdownValue);
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
        // browser.pause(delaySecond);
      }
      // configure new rule page - receiver
      if (selectedShp.length > 0) {
        this.setAttribute2(consts.deliverySiteCode, delaySecond);
      }
    }

    if (selectedShp.length > 0) {
      var receiverField = $$(locators.attributeValue)[2];
      receiverField.waitForExist({ timeout: delaySecond });
      receiverField.click();
      receiverField.setValue(tExcel[i].receiver + " ");
      // browser.pause(delaySecond);
      this.waitForLoadingDotsDisappearIfAny(delaySecond);
      this.waitForExistWithRetry(locators.firstAttributeDropdownValue, delaySecond);
      if ($(locators.firstAttributeDropdownValue).isExisting()) {
        // browser.pause(delaySecond);
        let eleExists = false;
        if (
          $(locators.firstAttributeDropdownValue).getText() ==
          tExcel[i].receiver
        ) {
          eleExists = true;
          // $(locators.firstAttributeDropdownValue).click(); // existing but not clickable if fitst dropdown item is blank
          this.clickWithRetry(locators.firstAttributeDropdownValue);
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
        $(locators.cancelButton).click();
        $(locators.cancelYesButton).waitForExist({ timeout: delaySecond });
        browser.pause(delaySecond);
        $(locators.cancelYesButton).click();
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
        $(locators.saveButton).click();
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
        $(locators.saveButton).waitForDisplayed({timeout: delaySecond * 10, reverse: true});
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
