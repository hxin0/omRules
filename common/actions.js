const {
  schemaSettings,
  schemaTier,
} = require("../common/schema");
const { locators, consts } = require("../common/locators");
const _ = require("lodash/core");
const fs = require("fs");

exports.clickLoginButtonWhileExisting = function (login) {
  if (login.newLoginPage) {
    while (browser.isExisting(locators.loginNextButton)) {
      if (login.username != undefined)
        browser.setValue(locators.username, login.username);
      else {
        browser.pause(consts.delaySecond * 5000)
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
  browser.waitForExist(locators.searchMenuDropdown, delaySecond);
  browser.click(locators.searchMenuDropdown);
  browser.click(locators.searchMenu1TradingPartner);
  browser.setValue(locators.searchRuleName, input.tradingPartner);
  browser.pause(delaySecond);
  browser.waitForExist("=".concat(input.tradingPartner), delaySecond);
  browser.click("=".concat(input.tradingPartner));
};

exports.clickNewRuleButton = function (delaySecond) {
  $(locators.configureNewRuleButton).waitForExist(delaySecond);
  $(locators.searchMenuDropdown).waitForExist(delaySecond);
  $(locators.configureNewRuleButton).click();
};

exports.waitForLoadingDotsDisappearIfAny = function (delaySecond) {
  // browser.pause(delaySecond);
  if ($(locators.loadingDots).isVisible()) {
    $(locators.loadingDots).waitForVisible(delaySecond * 60, true);
  }
  // browser.pause(2000);
  browser.pause(delaySecond);
};

exports.createRule = function (ruleName, delaySecond) {
  browser.pause(delaySecond / 2);
  browser.waitForExist(locators.searchRuleName, delaySecond);
  browser.pause(delaySecond / 2);
  browser.setValue(locators.searchRuleName, ruleName);
  browser.waitForExist(locators.ruleNameDropdownValue, delaySecond);
  browser.pause(delaySecond / 2);
  browser.click(locators.ruleNameDropdownValue);
  // browser.pause(delaySecond);
  browser.waitForExist(locators.ruleNameRow, delaySecond);
  this.waitForLoadingDotsDisappearIfAny(delaySecond);
  // browser.pause(delaySecond / 2);
  // browser.click(locators.ruleNameRow);
  // try to fix Element is not clickable at point, Other element would receive the click exception
  let countTries =0;
  let maxTries = 3;
  while (true) {
      try {
        browser.click(locators.ruleNameRow);
        break;
      } catch (e) {
        console.log(e);
        browser.scroll(locators.ruleNameRow);
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
    for (let i=0; i<rows.length; i++) {
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
    setData = rows.filter(row=>!(row.skip));
  });

  if (_.size(login) > 0) {
    setEnv.username = login.username;
    setEnv.password = login.password;
  }

  return { setEnv, setData };
};

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
      if (resultantType === 1) {
        browser.waitForExist(locators.resultantActionValue, delaySecond * 30);
      } else {
        browser.waitForExist(locators.resultantActionValue2, delaySecond * 30);
      }
      browser.pause(delaySecond / 2);
      this.setAttributeTradingPartner(input.tradingPartner, delaySecond);

      this.setAttribute2(consts.pickupSiteCode, delaySecond);
    }
    browser.waitForExist(locators.attributeValue2, delaySecond);
    browser.click(locators.attributeValue2);
    browser.setValue(locators.attributeValue2, tExcel[i].shipper + " "); // Shipper code
    // browser.pause(delaySecond);
    this.waitForLoadingDotsDisappearIfAny(delaySecond);
    if (browser.isExisting(locators.firstAttributeDropdownValue)) {
      // browser.pause(delaySecond);
      let eleExists = false;
      if (
        browser.getText(locators.firstAttributeDropdownValue) ==
        tExcel[i].shipper
      ) {
        eleExists = true;
        browser.click(locators.firstAttributeDropdownValue); // existing but not clickable if fitst dropdown item is blank
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
      if (resultantType === 1) {
        browser.waitForExist(locators.resultantActionValue, delaySecond * 30);
      } else {
        browser.waitForExist(locators.resultantActionValue2, delaySecond * 30);
      }
      browser.pause(delaySecond);
      this.setAttributeTradingPartner(input.tradingPartner, delaySecond);

      this.setAttribute2(consts.pickupSiteCode, delaySecond);

      browser.waitForExist(locators.attributeValue2, delaySecond);
      browser.click(locators.attributeValue2);
      browser.setValue(locators.attributeValue2, tExcel[i].shipper + " "); // Shipper code
      // browser.pause(delaySecond);
      this.waitForLoadingDotsDisappearIfAny(delaySecond);
      if (browser.isExisting(locators.firstAttributeDropdownValue)) {
        // browser.pause(delaySecond);
        let eleExists = false;
        if (
          browser.getText(locators.firstAttributeDropdownValue) ==
          tExcel[i].shipper
        ) {
          eleExists = true;
          browser.click(locators.firstAttributeDropdownValue); // existing but not clickable if fitst dropdown item is blank
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
      if (browser.isExisting(locators.firstAttributeDropdownValue)) {
        // browser.pause(delaySecond);
        let eleExists = false;
        if (
          browser.getText(locators.firstAttributeDropdownValue) ==
          tExcel[i].receiver
        ) {
          eleExists = true;
          browser.click(locators.firstAttributeDropdownValue); // existing but not clickable if fitst dropdown item is blank
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
        this.waitForLoadingDotsDisappearIfAny(delaySecond);

        createdRule.parentCode = ruleCode;
        if (tExcel[i].scac != undefined) createdRule.scac = scacCode; // tExcel[i].scac);
        createdRule.shipperCode = selectedShp;
        createdRule.receiverCode = selectedRec;
        console.log("Tier 2 " + ruleName + " rule is saved:");
        console.log(Date().toLocaleString());
        console.log(createdRule);
        selectedShp.length = 0;
        selectedRec.length = 0;
        createdRule = {};
        skipClickNewRuleButton = false;
        browser.pause(delaySecond);
      }
    }
  }
};

function missingLocationsFileUpdate(ml) {
  if (ml.missingLocations.length > 0) {
    fs.readFile('./testdata/ml.json', function (errR, data) {
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
          console.log('*********************');
          ml.missingLocations.length = 0;
          console.log("missing location codes appended to ml.json file:");
          console.log(ml);
          console.log('*********************');
        }
      );
    })
  }
}


 // this old function has a problem that later call will overwite the previous ml object
 // the json file ends up with duplicate appending ml objects
 // for example if there are 3 objects, it will show the last object 3 times after finish running
 // leave here for later understanding of this 
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
