describe('test upgrade to 5', function() {
  it('should run test', function() {
      var tradingPartner = 'BESTTRA';
      var url = 'https://order-tst.nonprod.jbhunt.com/order/automationrules';
      browser.url(url);
      browser.pause(2000);

      while ($('input[name="login"][value="Next"]').isExisting()) {
          browser.pause(40000);
          // $('input[value="Log In"]').click();
      }

      $('[id="searchMenuItems"]').waitForExist({ timeout: 5000 });
      $('[id="searchMenuItems"]').click();
      $('[id="ui-select-choices-id-1"]').click();
      $('[id="searchRuleName"]').setValue(tradingPartner);
      browser.pause(1000);
      $('='.concat(tradingPartner)).click();
      browser.pause(2000);
      while ($('[id="span-3dots"').isExisting()) {
          $('[id="span-3dots"').click();
          browser.pause(1000);
          $('[id="inactivaterule"]').click();
          browser.pause(2000);
          $('[data-auto-id="btn-yes"]').click();
          browser.pause(2000);
      }
      browser.pause(5000);
  });
});