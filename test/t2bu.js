const { schemaTierData } = require('../common/schema');
const { ruleNames } = require('../common/locators');
const actions = require('../common/actions');

describe('tier 2 default business unit rules', function () {
    const xlsxRead = require('read-excel-file/node');

    var input = {};
    var delaySecond = 1000;
    var login = {};
    var tExcel = [];
    var ml = {};
    ml.dateTime = new Date();
    ml.missingLocations = [];

    before('read file first', async function () {
        ({ login, input } = await actions.readDataSheets(login, input));

        ml.file = input.fileName;
        ml.sheet = input.t2bu;
        var fileFullName = 'testdata/' + input.fileName + '.xlsx';
        // browser.debug();
        await xlsxRead(fileFullName, { schema: schemaTierData, sheet: input.t2bu }).then(({ rows }) => {
            tExcel = rows.filter(row=>!(row.skip))
        });
        if ((tExcel.length == 0) || (tExcel[0].shipper == undefined)) {
            console.log('Tier 2 ' + ruleNames.businessUnit + ' rule has no data - skipped')
            this.skip();
        }

        tExcel.sort((a, b) => (a.scac > b.scac) 
        ? 1 : (a.scac === b.scac) ? ((a.code > b.code) 
        ? 1 : (a.code === b.code) ? ((a.shipper > b.shipper) 
        ? 1 : (a.receiver === b.receiver) ? ((a.receiver > b.receiver)
        ? 1 : -1) : -1 ) : -1) : -1 ); // sort by scac then code then shipper then receiver

    });

    it('should add t2 bu for the trading partner', () => {
        const resultantType = 2;
        delaySecond = input.delaySecond * 1000;
        browser.url(input.url);
        browser.pause(delaySecond);
        // login page
        actions.clickLoginButtonWhileExisting(login);
        browser.pause(delaySecond);

        actions.tier2(input, tExcel, ruleNames.businessUnit, resultantType, ml, delaySecond);
    });
});