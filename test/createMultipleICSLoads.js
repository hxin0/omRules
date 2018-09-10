describe('Carrier360Mobile Test Data', function() {
    var load = '';
    
    function formatDate(date) {
        return ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2) + date.getFullYear();
    }

    function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
    
    it('to skip eom load creation, using ~~LS66225~~ instead', function() {
		//browser.url('http://my.jbhunt.com/');
        //var mainTab = browser.getCurrentTabId();
		//browser.click('=Show More Apps');
        //browser.waitForExist('=Enterprise Order Management');
        //browser.click('=Enterprise Order Management');
        load = 'LS66225';
        console.log('load : ############## ' + load + ' ##############');
    });
    
	it.skip('should be able to book one or multiple exact ICS loads from eom', function() {
        var loadCount = 1; //for multiple loads
		//browser.url('http://my.jbhunt.com/');
        //var mainTab = browser.getCurrentTabId();
		//browser.click('=Show More Apps');
        //browser.waitForExist('=Enterprise Order Management');
        //browser.click('=Enterprise Order Management');
        //var eomTab = browser.getCurrentTabId();
        //console.log('2 tabs: ' + mainTab + ' | ' + eomTab);
		//assert.equal(mainTab,eomTab,"current tab id didn't change");
        //var handle = browser.getTabIds();
        //eomTab = handle[1];
        //browser.switchTab(eomTab);
        //expect(browser.getCurrentTabId()).to.equal(eomTab);
        //eom page
        browser.url('http://eom.jbhunt.com/eom/search/eomSearch.face?JEBPQV=PEVSF9R&GFQPTRVE=9&Qrh9vp%2BgTnIawIsmpjJGcQ%3D%3D=duMyr8l2vvA%3D&THHPTZ=9&YWMPTLUB=9&GFQDYEV=9325804455');
        //check HJBT JBVAN checkbox is checked, otherwise, check it
        if (!browser.isSelected('input[value="HJBT JBVAN"][type="checkbox"]')) {
            browser.click('input[value="HJBT JBVAN"][type="checkbox"]');
        }
        //console.log('checkbox HJBT JBVAN: ' + !browser.isSelected('input[value="HJBT JBVAN"][type="checkbox"]'))
        browser.selectByValue('[id="eomSearchMain:baseSearchList"]', 'PROJECT CODE');
        browser.setValue('[id="eomSearchMain:baseSearchVal"]', '1770');
        browser.click('input[id="eomSearchMain:advNext"]');
        //click book order icon on the first skeleton
        browser.waitForExist('img[id="frmSkeletonListing:lSkeletonListing:0:cmdBtnBookFromSklActionFocusLink"]');
        browser.click('img[id="frmSkeletonListing:lSkeletonListing:0:cmdBtnBookFromSklActionFocusLink"]');
        if (loadCount>1) {
            browser.setValue('input[id="frmPickupDate:inpNumberOfCopies"]', loadCount); //for multiple loads
            browser.keys('\uE004');
            browser.selectByValue('select[id="frmPickupDate:somBookMultipleTypes"]', 'EXACT');
        }
        browser.click('input[id="frmPickupDate:btnNext"]');

        //switch to iframe, it works!
        browser.waitForExist('iframe[id="TB_iframeContent"]');
        var my_frame = $('iframe[id="TB_iframeContent"]').value;
        console.log('frame: ' + my_frame);
        browser.frame(my_frame);

        // console.log('frame: ' + browser.frame(my_frame.value));
        // browser.frame(my_frame.value);
        //console.log('debug: get to the iframe');

        //click the ICS link
        browser.waitForExist('table[id="eomOrderFleetDec:sifterMainContent"] table[id="eomOrderFleetDec:DayOneRec"] a[id="eomOrderFleetDec:DayOneRec:1:recFleetId"]');
        browser.click('table[id="eomOrderFleetDec:sifterMainContent"] table[id="eomOrderFleetDec:DayOneRec"] a[id="eomOrderFleetDec:DayOneRec:1:recFleetId"]');
        console.log('ICS');
        //get scheduled appointment date from stop 1 to set stop 99
        browser.selectByValue('[id="eomOrderDetail:stopsList:1:trailerActionVal"]', 'N');
        var dat = new Date();
        
        browser.setValue('input[id="eomOrderDetail:stopsList:0:schedBegCalendarTime"]', '06:00');
        browser.setValue('input[id="eomOrderDetail:stopsList:0:schedEndCalendarTime"]', '20:00');
        browser.setValue('input[id="eomOrderDetail:stopsList:1:schedBegCalendarDate"]', formatDate(addDays(dat, 1)));
        browser.setValue('input[id="eomOrderDetail:stopsList:1:schedBegCalendarTime"]', '07:00');
        browser.setValue('input[id="eomOrderDetail:stopsList:1:schedEndCalendarTime"]', '21:00');

        browser.pause(3000);

        if (loadCount > 1) {
            browser.click('input[id="eomOrderDetail:lnfscCrtMultOrders"]'); //for multiple loads
            console.log('debug: alert: ' + browser.alertText()); //for multiple loads
            browser.alertAccept();
            
            if (browser.isVisible('[value="Continue"]')) {
                browser.click('[value="Continue"]');                
            }
            browser.pause(3000);
            //get load numbers //for multiple loads
            //- first switch to the frame
            browser.waitForExist('iframe[id="TB_iframeContent"]');
            var my_frame = $('iframe[id="TB_iframeContent"]').value;
            console.log('frame: ' + my_frame);
            browser.frame(my_frame);
            //- second get text
            var loadsMessage = browser.getText('table[id="eomOfferMail:dtBMProgressData"] td[class="progressViewDataClass centerColumnClass"] label[class="labelCell"]')
            for (i = 0; i < loadsMessage.length; i++) {
                var load = loadsMessage[i].split(' ')[2];
                console.log('load-' + (i+1) + ': ############## ' + load + ' ##############');
            }
        } else {
            browser.click('input[id="eomOrderDetail:createOrder"]');              
            //get load number
            var loadMessage = browser.getText('table label[id="eomOrderDetail:orderLabel"]');
            load = loadMessage.split(' ')[1];
            console.log('load : ############## ' + load + ' ##############');
        }
        //browser.pause(5000);
	});
    
    it('should find the last load created in FM2', function() {
        //browser.switchTab();
        browser.url('http://fm.jbhunt.com/FreightManager2/common/index.iface?null&JEBPQV=PEVSF9R&GFQPTRVE=9&Qrh9vp%2BgTnIawIsmpjJGcQ%3D%3D=duMyr8l2vvA%3D&THHPTZ=9&YWMPTLUB=9&GFQDYEV=9325804455');
        //browser.click('=Freight Manager 2');
        //console.log('Title: ' + browser.getTitle());
        //console.log('URL: ' + browser.getUrl());
        //var handle = browser.getTabIds();
        //fm2Tab = handle[2];
        //console.log(handle);
        //browser.switchTab(fm2Tab);
        //expect(browser.getCurrentTabId()).to.equal(fm2Tab);        
        //console.log('Title: ' + browser.getTitle());
        //console.log('URL: ' + browser.getUrl());
        console.log('load#: ' + load);
        browser.waitForExist('=Planning');
        browser.click('=Planning');
        browser.click('=Order Segment');
        browser.waitForExist('input[id="form:orderNumber"]');
        browser.setValue('input[id="form:orderNumber"]', load);
        browser.click('[class="lnfButton iceCmdBtn"]');
        expect(browser.isExisting('a=' + load));
        console.log(browser.getTabIds());
        //browser.waitForExist('=Status');
        //browser.debug();
    });
    
    it('should preplan the load', function() {
        console.log('preplan!!!');
        
        browser.waitForEnabled('[id="form:projects"]');
        browser.setValue('[id="form:projects"]','1770');
        browser.setValue('[id="form:carriers"]','PA01');
        browser.click('button=Create Preplan');
        //If this is the only preplan for the driver, Tractor Preplan, otherwise Multiple Preplan
        browser.waitForExist('div[class="icePnlPop"]');
        console.log('preplan...');
        browser.debug();
        if (browser.isExisting('button=Multiple Preplan List')) {

            browser.click('button=Multiple Preplan List');
            browser.pause(15000);
            browser.waitForExist('button=Select All', 5000);
            browser.click('button=Select All');
            browser.waitForExist('button=Update');
            browser.click('button=Update');

            browser.waitForExist('span[class="iceMsgsInfo"]', 30000);
            assert.equal(browser.getText('span[class="iceMsgsInfo"]'), 'Successfully updated.');
            browser.click('button=Exit');
        } else {

            browser.waitForExist('button=Tractor Preplan');
            browser.click('button=Tractor Preplan');

            //browser.waitForExist('div[class="icePnlPop"]');
            browser.pause(500);
            console.log('Op Edits ' + browser.isExisting('span=Op Edits'));
            //browser.debug();
            //console.log(browser.isVisible('button=Continue'));
            if (browser.isVisible('span=Op Edits')) {

                browser.waitForExist('button=Continue');
                //console.log('button enabled? ' + browser.isExisting('button=Continue'));
                browser.scroll(0, 10);
                browser.click('button=Continue');
                //browser.pause(5000);
                console.log('second while - change to if 1');
                //console.log(browser.waitForExist('button=Continue'));
            }
            browser.waitForVisible('span=Op Edits', 5000 , true);
            browser.pause(1500);
            //browser.debug();
            if (browser.isVisible('span=Op Edits')) {

                browser.click('button=Continue');
                //browser.pause(5000);
                console.log('second while - change to if 2');
                //console.log(browser.waitForExist('button=Continue'));
            }
            //browser.debug();
            browser.waitForExist('span[class="iceMsgsInfo"]');
            console.log('message: ' + browser.getText('span[class="iceMsgsInfo"]'));
            if (browser.getText('span[class="iceMsgsInfo"]')!='Driver Preplan Successful') {
                browser.debug();
            }
            expect(browser.getText('span[class="iceMsgsInfo"]')).to.equal('Driver Preplan Successful');
            browser.getText('span[class="iceMsgsInfo"]').should.equal('Driver Preplan Successful');
        }
        console.log('out of if block');
        //browser.debug();

    });
    
    it.skip('should dispatch the load', function() {
        //check call screen
        browser.waitForExist('a[class="iceOutLnk fmLabel50"]');
        console.log('click link');
        browser.click('a[class="iceOutLnk fmLabel50"]');
        //browser.debug();
        handle = browser.getTabIds();
        console.log('dispaching... ' + handle);
        browser.debug();
        browser.switchTab(handle[1]); //yes
        console.log(browser.getTitle());
        browser.waitForExist('span=Status');
        browser.click('span=Status');
        if (browser.isExisting('span=Dispatch *')) {
            browser.click('span=Dispatch *');
            browser.waitForExist('div[class="icePnlPop"]');
            if (browser.isExisting('button=Update')) {
                browser.click('button=Update');
                browser.pause(500);               
            }         
            if (browser.isExisting('button=Update')) {
                browser.click('button=Update');
                browser.pause(500);               
            }         
            if (browser.isExisting('button=Update')) {
                browser.click('button=Update');
                browser.pause(500);               
            }
            if (browser.isExisting('button=Update')) {
                browser.click('button=Update');
                browser.pause(500);               
            }
        }
        console.log('msg: ' + browser.getText('td[class="iceDatTblCol2"]*=DISPATCHED ON'));
    });
});
