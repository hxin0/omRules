const { schemaTierData } = require('../common/schema');
const { ruleNames } = require('../common/locators');
const actions = require('../common/actions');

describe('tier 1 default fleet code rules', function () {
    const xlsxRead = require('read-excel-file/node');

    var input = {};
    var setEnv = {};
    var setData = [];
    const waitRetry = {
        delay: 1000,
        maxTries: 10
    }
    var tExcel = [];
    var ml = {};

    before('read file first', async function () {
        ({ setEnv, setData } = await actions.readDataSheets(setEnv, setData));
        input = setData[0];
        ml.tradingPartner = input.tradingPartner;
        ml.missingLocations = [];
        ml.file = input.fileName;
        ml.sheet = input.t1fl;

        var fileFullName = 'testdata/' + input.fileName + '.xlsx';

        await xlsxRead(fileFullName, { schema: schemaTierData, sheet: input.t1fl }).then(({ rows }) => {
            tExcel = rows.filter(row=>!(row.skip))
        });
        if ((tExcel.length == 0) || (tExcel[0].shipper == undefined)) {
            console.log('Tier 1 ' + ruleNames.fleeetCode + ' rule has no data - skipped')
            this.skip();
        }
        tExcel.sort((a, b) => (a.scac > b.scac) 
        ? 1 : (a.scac === b.scac) ? ((a.code > b.code) 
        ? 1 : (a.code === b.code) ? ((a.shipper > b.shipper) 
        ? 1 : -1) : -1 ) : -1); // sort by scac then code then shipper
    });

    it('should add t1 fleet code rule for the trading partner', () => {
        const resultantType = 1;
        waitRetry.delay = setEnv.delaySecond? setEnv.delaySecond * 1000 : waitRetry.delay;
        waitRetry.maxTries = setEnv.maxTries? setEnv.maxTries : waitRetry.maxTries;
        actions.timelineAddContext(waitRetry);
        browser.url(setEnv.url);
        browser.pause(waitRetry.delay);
        // login page
        actions.clickLoginButtonWhileExisting(setEnv);
        browser.pause(waitRetry.delay);

        actions.tier1(input, tExcel, ruleNames.fleetCode, resultantType, ml, waitRetry);
    });
});