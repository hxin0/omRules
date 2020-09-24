const schemaInactivateRules = {
    "tradingPartner": {
        prop: 'tradingPartner',
        type: String
    },
    "createdBy": {
        prop: 'createdBy',
        type: String
    },
    "selectorTotal": {
        prop: 'selectorTotal',
        type: String
    },
    "selectorNum": {
        prop: 'selectorNum',
        type: String
    },
    "SKIP": {
        prop: 'skip',
        type: Boolean
    }
};

const schemaTier = {
    "tradingPartner": {
        prop: 'tradingPartner',
        type: String
    },
    "corporateAccount": {
        prop: 'corporateAccount',
        type: String
    },
    "fileName": {
        prop: 'fileName',
        type: String
    },
    "t1bt": {
        prop: 't1bt',
        type: String
    },
    "t2bt": {
        prop: 't2bt',
        type: String
    },
    "t1bu": {
        prop: 't1bu',
        type: String
    },
    "t2bu": {
        prop: 't2bu',
        type: String
    },
    "t1so": {
        prop: 't1so',
        type: String
    },
    "t2so": {
        prop: 't2so',
        type: String
    },
    "t1fl": {
        prop: 't1fl',
        type: String
    },
    "t2fl": {
        prop: 't2fl',
        type: String
    },
    "t1cu": {
        prop: 't1cu',
        type: String
    },
    "t2cu": {
        prop: 't2cu',
        type: String
    },
    "SKIP": {
        prop: 'skip',
        type: Boolean
    }
};

// const schemaSimpleton = { // delete? no longer applied?
//     "fileName": {
//         prop: 'fileName',
//         type: String
//     },
//     "tabName": {
//         prop: 'tabName',
//         type: String
//     }
// };

const schemaTierData = {
    "PARENT(Bill To, Fleet, Service Offering)": {
        prop: 'code',
        type: String
    },
    "SHIPPER": {
        prop: 'shipper',
        type: String
    },
    "RECEIVER": {
        prop: 'receiver',
        type: String
    },
    "SCAC": {
        prop: 'scac',
        type: String
    },
    "SKIP": {
        prop: 'skip',
        type: Boolean
    }
};

const schemaSettings = {
    "url" : {
        prop: 'url',
        type: String
    },
    "delaySecond": {
        prop: 'delaySecond',
        type: Number
    },
    "username": {
        prop: 'username',
        type: String
    },
    "password": {
        prop: 'password',
        type: String
    },
    "SKIP": {
        prop: 'skip',
        type: Boolean
    },
    "newLoginPage": {
        prop: 'newLoginPage',
        type: Boolean
    }
}

const schemaSimpletonData = {
    "Trading Partner": {
        prop: 'tradingPartner',
        type: String
    },
    "SCAC": {
        prop: 'scac',
        type: String
    },
    "BTC": {
        prop: 'code',
        type: String
    },
    "Corp Acct": {
        prop: 'corpAcct',
        type: String
    },
    "BU": {
        prop: 'businessUnit',
        type: String
    },
    "SO": {
        prop: 'serviceOffering',
        type: String
    },
    "Fleet": {
        prop: 'fleet',
        type: String
    },
    "SKIP": {
        prop: 'skip',
        type: Boolean
    }
}

const schemaMissingCode = {
    "missingCodeFileName": {
        prop: 'missingCodeFileName',
        type: String
    },
    "ruleDataFileName": {
        prop: 'ruleDataFileName',
        type: String
    },
    "newFileName": {
        prop: 'newRulesDataFileName',
        type: String
    },
    "t1bt": {
        prop: 't1bt',
        type: String
    },
    "t2bt": {
        prop: 't2bt',
        type: String
    },
    "t1bu": {
        prop: 't1bu',
        type: String
    },
    "t2bu": {
        prop: 't2bu',
        type: String
    },
    "t1so": {
        prop: 't1so',
        type: String
    },
    "t2so": {
        prop: 't2so',
        type: String
    },
    "t1fl": {
        prop: 't1fl',
        type: String
    },
    "t2fl": {
        prop: 't2fl',
        type: String
    },
    "SKIP": {
        prop: 'skip',
        type: Boolean
    }
}

const schemaMissingCodeData = {
    "Old Code": {
      prop: "oldLocationCode",
      type: String,
    },
    "CODE": {
      prop: "newLocationCode",
      type: String,
    },
    "SKIP": {
        prop: 'skip',
        type: Boolean
    }
  };

module.exports = {
  schemaSettings,
  schemaInactivateRules,
  schemaTier,
  schemaTierData,
//   schemaSimpleton, // delete?
  schemaSimpletonData,
  schemaMissingCode,
  schemaMissingCodeData,
};