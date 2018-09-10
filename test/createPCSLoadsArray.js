// var chai = require('chai');
// expect = chai.expect;

//put multiple created loads into an json object and write to a file under ../testdata/ICSLoads.conf.json
//the file also has an array of carrier's SCAC codes for the loads to be tendered to
//skeletonRowNumber: 0 based
// the json file should look like this:
/*
{
	"loadCount": 1,
	"loads": [
        {"loadNumber":"LS67202"},
        {"loadNumber":"LS67203"},
        {"loadNumber":"LS67204"}
	],
	"carrier": [
		"DEH2",
		"DEH2",
		"001F"
	]
}

After tender, "load" can be in this format, see which format makes more sense.
{
    "loads": [
        {
            "loadNumber": "LS68403",
            "status": "Tendered",
            "carrier": "DEH2"
        },
        {
            "loadNumber": "LS68404",
            "status": "Available"
        }
    ]
}
*/
describe('CarrierMobile Test Data Creation', function() {
    // var load = '';
    // var loadCount = 1;
    var testObject = require('../testdata/PCSLoads.conf');
    //var loadCount = testObject.loadCount;
    var loadsList = [];
    
    function formatDate(date) {
        return ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2) + date.getFullYear();
    }

    function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }

    function fileTimestamp(date) {
        return formatDate(date) + ('0' + (date.getHours())).slice(-2) + ('0' + (date.getMinutes())).slice(-2) + ('0' + (date.getSeconds())).slice(-2);
    }
     
    it.skip('to skip eom load creation, using ~~LS66225~~ instead', function() {

        load = 'LS97471';
        console.log('load : ############## ' + load + ' ##############');
        loadsList.push({loadNumber:load});
        testObject.loads = loadsList;
        var fs = require("fs");
        fs.writeFile("./testdata/PCSLoads.conf.json", JSON.stringify(testObject, null, 4), (err) => {
            if (err) {
                console.error(err);
                return;
            };
        });
    });
    
	it('should be able to book one or multiple exact PCS loads from eom', function() {

        browser.url('http://eom.jbhunt.com/eom/search/eomSearch.face?JEBPQV=PEVSF9R&GFQPTRVE=9&Qrh9vp%2BgTnIawIsmpjJGcQ%3D%3D=duMyr8l2vvA%3D&THHPTZ=9&YWMPTLUB=9&GFQDYEV=9325804455');
        //check HJBT JBVAN checkbox is checked, otherwise, check it
        if (!browser.isSelected('input[value="HJBT JBVAN"][type="checkbox"]')) {
            browser.click('input[value="HJBT JBVAN"][type="checkbox"]');
        }
        browser.setValue('input[id="eomSearchMain:billto"]', testObject.billTo);
        browser.click('input[id="eomSearchMain:advNext"]');

        //click book order icon on the first skeleton
        browser.waitForExist('img[id="frmSkeletonListing:lSkeletonListing:' + testObject.skeletonRowNumber.toString() + ':cmdBtnBookFromSklActionFocusLink"]');
        browser.click('img[id="frmSkeletonListing:lSkeletonListing:' + testObject.skeletonRowNumber.toString() + ':cmdBtnBookFromSklActionFocusLink"]');
        if (testObject.loadCount>1) {
            browser.setValue('input[id="frmPickupDate:inpNumberOfCopies"]', testObject.loadCount); //for multiple loads
            browser.keys('\uE004');
            browser.selectByValue('select[id="frmPickupDate:somBookMultipleTypes"]', 'EXACT');
        }
        browser.click('input[id="frmPickupDate:btnNext"]');
        //browser.debug();
        //If no rate was found, click OK button to continue, otherwise there will be an exception, catch and ignore
        try {
            if (browser.waitForVisible('[id="frmRateCheck:noRateReason"]', 50000)) {
                //browser.debug();
                browser.selectByValue('[id="frmRateCheck:noRateReason"]', '264');
                browser.pause(1000);
                browser.click('input[id="frmRateCheck:olnkRsnCodeForNoRate"]');
            }
        } catch (e) {
            if (e) {
                console.log("noRateReason not appear");
            }
        }
        //browser.pause(5000);

        browser.waitForVisible('label[id="frmRateCheck:olblStatusMsg"]', 500000, true);
        browser.pause(3000);
        //switch to iframe, it works!
        browser.waitForExist('iframe[id="TB_iframeContent"]',500000);
        var my_frame = $('iframe[id="TB_iframeContent"]').value;
        console.log('frame: ' + my_frame);
        browser.frame(my_frame);

        // console.log('frame: ' + browser.frame(my_frame.value));
        // browser.frame(my_frame.value);
        //console.log('debug: get to the iframe');

        browser.waitForExist('table[id="eomOrderFleetDec:sifterMainContent"] table[id="eomOrderFleetDec:DayOneRec"] a[id="eomOrderFleetDec:DayOneRec:0:recFleetId"]');
        //click the TRUCK link
        for (i=0; i<5; i++) {
            if (browser.getText('table[id="eomOrderFleetDec:sifterMainContent"] table[id="eomOrderFleetDec:DayOneRec"] a[id="eomOrderFleetDec:DayOneRec:' + i.toString() + ':recFleetId"]') == "TRUCK") {
                console.log(browser.getText('table[id="eomOrderFleetDec:sifterMainContent"] table[id="eomOrderFleetDec:DayOneRec"] a[id="eomOrderFleetDec:DayOneRec:' + i.toString() + ':recFleetId"]'));
                browser.click('table[id="eomOrderFleetDec:sifterMainContent"] table[id="eomOrderFleetDec:DayOneRec"] a[id="eomOrderFleetDec:DayOneRec:' + i.toString() + ':recFleetId"]');
                break;
            }       
        }

        //browser.debug();

        //get scheduled appointment date from stop 1 to set stop 99
        browser.selectByValue('[id="eomOrderDetail:stopsList:1:trailerActionVal"]', 'N');
        var dat = new Date();

        browser.waitForEnabled('input[id="eomOrderDetail:stopsList:1:schedBegCalendarDate"]', 5000);
        browser.setValue('input[id="eomOrderDetail:stopsList:0:schedBegCalendarTime"]', testObject.appt.apptTime.stop1Time1);
        browser.setValue('input[id="eomOrderDetail:stopsList:0:schedEndCalendarTime"]', testObject.appt.apptTime.stop1Time2);
        browser.setValue('input[id="eomOrderDetail:stopsList:1:schedBegCalendarDate"]', formatDate(addDays(dat, testObject.appt.apptDate)));
        browser.setValue('input[id="eomOrderDetail:stopsList:1:schedBegCalendarTime"]', testObject.appt.apptTime.stop99Time1);
        browser.setValue('input[id="eomOrderDetail:stopsList:1:schedEndCalendarTime"]', testObject.appt.apptTime.stop99Time2);

        browser.pause(3000);
        
        if (testObject.loadCount == 1) {
            browser.click('input[id="eomOrderDetail:createOrder"]');              
            //get load number
            var loadMessage = browser.getText('table label[id="eomOrderDetail:precisionLabel"]');
            load = loadMessage.split(' ')[2];
            console.log('load : ############## ' + load + ' ##############');

            loadsList.push({loadNumber:load, status:"Available"});
            testObject.loads = loadsList;
        } else {
            console.log('multiple load count: ' + testObject.loadCount);
            browser.click('input[id="eomOrderDetail:lnfscCrtMultOrders"]'); //for multiple loads
            console.log('debug: alert: ' + browser.alertText()); //for multiple loads
            browser.alertAccept();
            
            if (browser.isVisible('[value="Continue"]')) {
                browser.click('[value="Continue"]');                
            }
            browser.pause(3000);
            //get load numbers //for multiple loads
            //- first switch to the frame
            browser.waitForExist('iframe[id="TB_iframeContent"]', 50000);
            var my_frame = $('iframe[id="TB_iframeContent"]').value;
            console.log('frame: ' + my_frame);
            browser.frame(my_frame);
            //- second get text
            var loadsMessage = browser.getText('table[id="eomOfferMail:dtBMProgressData"] td[class="progressViewDataClass centerColumnClass"] label[class="labelCell"]');
            for (i = 0; i < loadsMessage.length; i++) {
                load = loadsMessage[i].split(' ')[2];
                console.log('load-' + (i+1) + ': ############## ' + load + ' ##############');
                loadsList.push({loadNumber:load, status:"Available"});
            }
            testObject.loads = loadsList;
        }
        //browser.debug();

        //rename the json file with timestamp before overwrite:
        
        var fs = require("fs");
        var backupFilename = "./testdatabackup/PCSLoads.conf." + fileTimestamp(fs.statSync("./testdata/PCSLoads.conf.json").birthtime) + ".json";
        fs.rename("./testdata/PCSLoads.conf.json", backupFilename, (err) => {
			if (err) {
                console.error(err);
                return;
			};
			console.log("json file has been renamed to " + backupFilename);
        });
                
        var fs = require("fs");
        fs.writeFile("./testdata/PCSLoads.conf.json", JSON.stringify(testObject, null, 4), (err) => {
            if (err) {
                console.error(err);
                return;
            };
        });
	});
    
    it('should preplan and tender the loads', function(){
        browser.url('http://fm.jbhunt.com/FreightManager2/common/index.iface?null&JEBPQV=PEVSF9R&GFQPTRVE=9&Qrh9vp%2BgTnIawIsmpjJGcQ%3D%3D=duMyr8l2vvA%3D&THHPTZ=9&YWMPTLUB=9&GFQDYEV=9325804455');
        projectCode = testObject.projectCode;      
        for (i=0; i<Object.keys(testObject.loads).length; i++) {
 
            //find the load in FM2
            load = loadsList[i].loadNumber;
            if (Object.keys(testObject.carrier).length > i) {
                carrier = testObject.carrier[i];                
            } else if (Object.keys(testObject.carrier).length =0) {
                carrier = {
                    "tractor": "882055",
                    "projectCode": "Z2B7",
                    "scac": "PA01"
                };
            } else {
                carrier = testObject.carrier[0]
            }
            loadsList[i].carrier = carrier.scac;
            console.log('load#: ' + load + ' tractor: ' + carrier.tractor + ' projectCode: ' + carrier.projectCode + ' scac: ' + carrier.scac);
            browser.waitForExist('=Planning');
            browser.click('=Planning');
            browser.click('=Order Segment');
            browser.waitForExist('input[id="form:orderNumber"]');
            browser.setValue('input[id="form:orderNumber"]', load);
            browser.click('[class="lnfButton iceCmdBtn"]');
            console.log('preplan!!!');
            browser.pause(3000);
            browser.click('input[id="form:j_id1298:_2"]');
            browser.waitForEnabled('input[id="form:tractorUi"]');
            browser.setValue('input[id="form:tractorUi"]', carrier.tractor);

            browser.click('button=Create Preplan');
            browser.pause(2000); //handling preplanning to tractor, then autorate to projectCode/carrier @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            if (browser.isVisible('button=Continue')) {
                browser.click('button=Continue');
                browser.pause(1500);
                console.log('first while - change to if - do not use while as [all webdriverio commands are async since they have to send (mutliple) requests to the selenium server]');
            }
            //browser.debug();
            browser.waitForExist('span[class="iceMsgsInfo"]', 30000);
            browser.getText('span[class="iceMsgsInfo"]').includes('Tractor Preplan Successful');
            assert(browser.getText('span[class="iceMsgsInfo"]').includes('Tractor Preplan Successful'));
            //browser.click('button=Exit');

            //if need to refresh
            if (browser.isExisting('[class="iceMsgsError"]')) {
                if (browser.getText('[class="iceMsgsError"]') == "Error Preplanning ORDER DATA HAS CHANGED - PLEASE REFRESH DATA") {
                    browser.click('button=Refresh');
                    browser.pause(3000);
                    browser.click('button=Create Preplan');
                    browser.pause(3000);
                }
            }
            //If stop tender warning coming up
            browser.pause(2000);
            if (browser.isExisting('[class="lnfCancelButton iceCmdLnk"]')) {
                browser.click('[class="lnfCancelButton iceCmdLnk"]');
            }
            browser.pause(2000);
            //need to refresh error could come up after tender warning
            if (browser.isExisting('[class="iceMsgsError"]')) {
                if (browser.getText('[class="iceMsgsError"]') == "Error Preplanning ORDER DATA HAS CHANGED - PLEASE REFRESH DATA") {
                    browser.click('button=Refresh');
                    browser.pause(3000);
                    browser.click('button=Create Preplan');
                    browser.pause(3000);
                }
            }

            //enter project code/scac here
            browser.waitForExist('[id="form:projects"]');
            browser.setValue('[id="form:projects"]', carrier.projectCode);
            browser.setValue('[id="form:carriers"]', carrier.scac);
            browser.click('button=Auto Rate / Preplan');

            browser.pause(3000); //lnfAcceptButton iceCmdLnk
            if (browser.waitForExist('[class="lnfAcceptButton iceCmdLnk"]')) {
                browser.click('[class="lnfAcceptButton iceCmdLnk"]');
            };
            browser.pause(3000); //lnfCancelButton iceCmdLnk
            if (browser.waitForExist('[class="lnfCancelButton iceCmdLnk"]')) {
                browser.click('[class="lnfCancelButton iceCmdLnk"]');
            };
            //browser.debug();
            loadsList[i].status = "Preplanned";
            //tender the load
            browser.pause(5000);
            browser.waitForEnabled('a[id^="form:segments:0:j_id"][class="iceCmdLnk"]', 50000);
            browser.pause(5000);
            browser.click('a[id^="form:segments:0:j_id"][class="iceCmdLnk"]');
            //browser.debug();
            browser.waitForEnabled('button=Tender Control', 50000);
            browser.click('button=Tender Control');
            //browser.debug();
            //browser.waitForExist('[id="form:NCONRT_0"]', 50000);
            browser.pause(2000);
/*             browser.setValue('[id="form:NCONFN_0"]', testObject.tender.carrier.fName);
            browser.setValue('[id="form:NCONLN_0"]', testObject.tender.carrier.lName);
            browser.setValue('[id="form:NCONPH_0"]', testObject.tender.carrier.pNumber); */
            //browser.selectByValue('[id="form:j_id320"]', 'DRIVER');
            browser.setValue('[id="form:CONFN_1"]', testObject.tender.driver.fName);
            browser.setValue('[id="form:CONLN_1"]', testObject.tender.driver.lName);
            //browser.setValue('[id="form:CONPH_1"]', testObject.tender.driver.pNumber);
            browser.click('button=Create Tender');          
            loadsList[i].status = "Tendered";
/*             //Dispatch the load - not working for needing manual approval carriers
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
            console.log('msg: ' + browser.getText('td[class="iceDatTblCol2"]*=DISPATCHED ON')); */
            testObject.loads = loadsList;
            var fs = require("fs");
            fs.writeFile("./testdata/PCSLoads.conf.json", JSON.stringify(testObject, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
                //console.log("Appointment changes have been written back.");
            });
        }        
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
