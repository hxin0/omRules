describe('test framework', function() {
    it('should run test', function() {
        var tradingPartner = 'BESTTRA';
        var url = 'https://order-tst.nonprod.jbhunt.com/order/automationrules';
        browser.url(url);
        browser.pause(2000);
        while (browser.isExisting('[value="Log In"]')) {
            browser.pause(30000);
            // browser.click('input[value="Log In"]');
        }

        browser.waitForExist('[id="searchMenuItems"]', 5000);
        browser.click('[id="searchMenuItems"]');
        browser.click('[id="ui-select-choices-id-1"]');
        browser.setValue('[id="searchRuleName"]', tradingPartner);
        browser.pause(1000);
        browser.click('='.concat(tradingPartner));
        browser.pause(2000);
        while (browser.isExisting('[id="span-3dots"')) {
            browser.click('[id="span-3dots"');
            browser.pause(1000);
            browser.click('[id="inactivaterule"]');
            browser.pause(2000);
            browser.click('[data-auto-id="btn-yes"]');
            browser.pause(2000);
        }
        browser.pause(5000);
    });
});
