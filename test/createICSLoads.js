// var chai = require('chai');
// expect = chai.expect;
describe('Carrier360Mobile Test Data', function() {
    var load = '';
    var loadCount = 1;
    
    function formatDate(date) {
        return ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2) + date.getFullYear();
    }

    function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
    
    it.skip('to skip eom load creation, using ~~LS66225~~ instead', function() {
		//browser.url('http://my.jbhunt.com/');
        //var mainTab = browser.getCurrentTabId();
		//browser.click('=Show More Apps');
        //browser.waitForExist('=Enterprise Order Management');
        //browser.click('=Enterprise Order Management');
        load = 'LS67074';
        console.log('load : ############## ' + load + ' ##############');
    });
    
	it('should be able to book one or multiple exact ICS loads from eom', function() {
        loadCount = 1; //for multiple loads
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
        
        if (loadCount == 1) {
            browser.click('input[id="eomOrderDetail:createOrder"]');              
            //get load number
            var loadMessage = browser.getText('table label[id="eomOrderDetail:orderLabel"]');
            load = loadMessage.split(' ')[1];
            console.log('load : ############## ' + load + ' ##############');
        } else {
            console.log('multiple load count: ' + loadCount);
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
                load = loadsMessage[i].split(' ')[2];
                console.log('load-' + (i+1) + ': ############## ' + load + ' ##############');
            }
        }
        //browser.debug();
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
        
        browser.waitForExist('[id="form:projects"]');
        browser.setValue('[id="form:projects"]','1770');
        browser.setValue('[id="form:carriers"]','DEH2');
        browser.click('button=Create Preplan');
        //browser.pause(2000);
        //If stop tender warning coming up
        if (browser.waitForExist('[class="lnfCancelButton iceCmdLnk"]', 5000)) {
            browser.click('[class="lnfCancelButton iceCmdLnk"]');
        }

        //browser.debug();

    });
 
    it('should tender the load', function() {
        browser.waitForEnabled('[id*="form:segments:0:j_id"][class="iceGphImg"]', 50000);
        browser.pause(2000);
        browser.click('[id*="form:segments:0:j_id"][class="iceGphImg"]');
        //browser.debug();
        browser.waitForEnabled('button=Tender Control', 50000);
        browser.click('button=Tender Control');
        //browser.debug();
        browser.waitForExist('[id="form:NCONRT_0"]', 50000);
        browser.pause(2000);
        browser.setValue('[id="form:NCONFN_0"]', 'ICS');
        browser.setValue('[id="form:NCONLN_0"]', 'Carrier');
        browser.setValue('[id="form:NCONPH_0"]', '4791234567');
        browser.selectByValue('[id="form:j_id320"]', 'DRIVER');
        browser.setValue('[id="form:NCONFN_1"]', 'ICS');
        browser.setValue('[id="form:NCONLN_1"]', 'Driver');
        browser.setValue('[id="form:NCONPH_1"]', '4791234568');
        browser.click('button=Create Tender');
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
