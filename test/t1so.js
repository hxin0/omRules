const { schemaTierData } = require('../common/schema');
const { locators, consts, ruleNames, soAbbr } = require('../common/locators');
const actions = require('../common/actions');

describe('tier 1 default service offering rules', function () {
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
        ml.sheet = input.t1so;
        var fileFullName = 'testdata/' + input.fileName + '.xlsx';
        
        await xlsxRead(fileFullName, { schema: schemaTierData, sheet: input.t1so }).then(({ rows }) => {
            tExcel = rows.filter(row=>!(row.skip))
        });
        if ((tExcel.length == 0) || (tExcel[0].shipper == undefined)) {
            console.log('Tier 1 ' + ruleNames.serviceOffering + 'Rule has no data - skipped')
            this.skip();
        }
        tExcel.sort((a, b) => (a.scac > b.scac) 
        ? 1 : (a.scac === b.scac) ? ((a.code > b.code) 
        ? 1 : (a.code === b.code) ? ((a.shipper > b.shipper) 
        ? 1 : -1) : -1 ) : -1); // sort by scac then code then shipper
    });

    it('should add t1 service offering for the trading partner', () => {
        const reaultantType = 2;
        delaySecond = input.delaySecond * 1000;
        browser.url(input.url);
        browser.pause(delaySecond);
        // login page
        actions.clickLoginButtonWhileExisting(login);
        browser.pause(delaySecond);

        actions.tier1(input, tExcel, ruleNames.serviceOffering, resultantType, ml, delaySecond);
    });
});