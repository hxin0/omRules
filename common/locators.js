const locators = {
    username: '[id="username"]',
    password: '[id="password"]',
    loginNextButton: 'input[name="login"][value="Next"]',
    loginButton: 'input[value="Log In"]',
    searchMenuDropdown: '[id="searchMenuItems"]',
    searchMenu1TradingPartner: '[id="ui-select-choices-id-1"]',
    // configureNewRuleButton: 'button[="Configure New Rule"]',
    configureNewRuleButton: '[data-auto-id="btn-configureNewRule"]',
    searchRuleName: '[id="searchRuleName"]',
    span3Dots: '[id="span-3dots"]',
    inactivateMenu: '[id="inactivaterule"]',
    yesButton: '[data-auto-id="btn-yes"]',
    cancelYesButton: '[data-auto-id="btn-Yes"]',
    ruleNameDropdownValue: '[class="dropdown-menu ng-star-inserted"]',
    ruleNameRow: '[class="datatable-row-center datatable-row-group ng-star-inserted"]',
    selectAttributeDropdown: 'span=Select Attribute',
    // selectAttributeDropdown: '[id="orderRuleCriteria"] > div > div[class="ui-select-match ng-star-inserted"] > span',
    attributeDropdown: '[class="ui-select-placeholder text-muted ng-star-inserted"]',
    inputAttribute: 'input[class="form-control ui-select-search ng-star-inserted"]',
    dropdownItem: 'a[class="dropdown-item"]',
    selectOperatorDropdown: 'span=Select Operator',
    operatorEquals: 'span=Equals',
    operatorEquals2: 'div[id="ui-select-choices-id-0"] > span',
    attributeValue: '[id="orderRuleCriteriaValue"] > div > input',
    attributeValue2: '[id="orderRuleCriteriaValue"]:nth-child(1) > div > input',
    attributeValue3: '[id="orderRuleCriteriaValue"] > div > input:not([style])',
    orderRuleCriteriaValue2: '[id="orderRuleCriteriaValue2"]',
    addAttributeButton: 'button[id="btnAddAttr"]',
    firstAttributeDropdownValue: '[id="select-item-template-id-0"] > span',
    resultantActionLabel: 'h4=Resultant Action',
    resultantActionValue: 'input[id="orderParameterNumberValue"]',
    resultantActionValueDropdownItem: 'app-typeahead-container[class="dropdown open"] > ul > li > a',
    resultantActionValue2: '#orderParameterCharValue2 > div > div.ui-select-match.ng-star-inserted > span',
    resultantActionValue2Input: '#orderParameterCharValue2 > div > input',
    resultantActionValue2DropdownItem: '#ui-select-choices-id-0',
    saveButton: '[id="btnSave"]',
    cancelButton: '[id="btnCancel"]',
    siteCodeDropdownArray: 'div[id^="select-item-template-id-"]',
    siteCodeDropdownItem1Half: 'div[id="select-item-template-id-',
    siteCodeDropdownItem2Half: '"] > span',
    loadingDots: 'div[data-auto-id="loading-dots"]',
    rulesNotFound: 'div[class="empty-row ng-star-inserted"]',
    datatablePager: 'datatable-pager[class="datatable-pager"]',
    arrayCreatedBy: 'datatable-body-cell > div > span:not([data-auto-id])',
    array3dots: '#span-3dots',
};

const consts = {
    ucrTradingPartner: 'UCR Trading Partner',
    pickupSiteCode: 'Pickup Site Code',
    deliverySiteCode: 'Delivery Site Code',
    ucrScac: 'UCR SCAC',
    delaySecond: 3
};

const ruleNames = {
    billingParty: 'Default Billing Party For Trading Partner',
    businessUnit: 'Default Business Unit',
    serviceOffering: 'Default Service Offering',
    fleetCode: 'Default Fleet Code',
    customerRule: 'Default Customer For Trading Partner'
};

const soAbbr = {
    BROKERAGE: 'Brokerage',
    ICS: 'Brokerage',
    BROK: 'Brokerage',
    BRO: 'Brokerage',
    BR: 'Brokerage',

    INTERMODAL: 'Intermodal',
    JBI: 'Intermodal',
    IM: 'Intermodal',
    INT: 'Intermodal',
    IN: 'Intermodal',

    DEDICATED: 'Dedicated',
    DCS: 'Dedicated',
    DEDI: 'Dedicated',
    DED: 'Dedicated',
    DE: 'Dedicated',

    'OVER THE ROAD': 'Over the Road',
    JBT: 'Over the Road',
    OTR: 'Over the Road',
    OV: 'Over the Road',
    OR: 'Over the Road',

    REFRIGERATED: 'Refrigerated',
    REEFER: 'Refrigerated',
    REEF: 'Refrigerated',
    REF: 'Refrigerated',
    RE: 'Refrigerated'
};

module.exports = { locators, consts, ruleNames, soAbbr };

