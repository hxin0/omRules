const { schemaTierData } = require('../common/schema');
const { ruleNames } = require('../common/locators');
const actions = require('../common/actions');

describe('tier 2 default billing party rules', function () {
    const xlsxRead = require('read-excel-file/node');

    var input = {};
    var setEnv = {};
    var setData = [];
    var delaySecond = 1000;
    var tExcel = [];
    var ml = {};

    before('read file first', async function () {
        ({ setEnv, setData } = await actions.readDataSheets(setEnv, setData));
        input = setData[0];
        ml.tradingPartner = input.tradingPartner;
        ml.missingLocations = [];
        ml.file = input.fileName;
        ml.sheet = input.t2bt;
        var fileFullName = 'testdata/' + input.fileName + '.xlsx';

        await xlsxRead(fileFullName, { schema: schemaTierData, sheet: input.t2bt }).then(({ rows }) => {
            tExcel = rows.filter(row=>!(row.skip))
        });
        if ((tExcel.length == 0) || (tExcel[0].shipper == undefined)) {
            console.log('Tier 2 ' + ruleNames.billingParty + ' rule has no data - skipped')
            this.skip();
        }

        tExcel.sort((a, b) => (a.scac > b.scac) 
        ? 1 : (a.scac === b.scac) ? ((a.code > b.code) 
        ? 1 : (a.code === b.code) ? ((a.shipper > b.shipper) 
        ? 1 : (a.shipper === b.shipper) ? ((a.receiver > b.receiver)
        ? 1 : -1) : -1 ) : -1) : -1 ); // sort by scac then code then shipper then receiver

    });

    it('should add t2 btc for the trading partner', () => {
        const resultantType = 1;
        delaySecond = setEnv.delaySecond * 1000;
        $(setEnv.url).url();
        browser.pause(delaySecond);
        // login page
        actions.clickLoginButtonWhileExisting(setEnv);
        browser.pause(delaySecond);

        actions.tier2(input, tExcel, ruleNames.billingParty, resultantType, ml, delaySecond);
    });
});