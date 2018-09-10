/*
1. Search by the criteria
2. Get list of loads that are Available
3. Change Appointment Date/Time to current date/time

{
    "searchBy": {
        "searchOptions": "CREATE USERID",
        "searchValue": "JISQHX3",
        "pickupApptRange": 0, //how many days before pickupApptDate2 if it's bigger than 31, then re-calculate pickupApptDate2 as 31 days after pickupApptDate1
        "pickupApptDate2": "" //mm/dd/yyyy, empty string will be converted to yesterday's date
    },
    "newAppt": {
        "status2Change": [
            "Available",
            "Dispatched"
        ],
        "newApptDate": "", //mm/dd/yyyy, empty string will be converted to today's date
        "newApptTime": {
            "stop1Time1": "06:00",
            "stop1Time2": "18:00",
            "stop99Time1": "09:00",
            "stop99Time2": "23:00"
        }
    },
    "loads": []
}
*/

describe('change loads appointment date and time', function() {
    //parameter date is Date type
    function formatDate(date) {
        return ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2) + date.getFullYear();
    }

    //date is string, days is number
    function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }

    function fileTimestamp(date) {
        return formatDate(date) + ('0' + (date.getHours())).slice(-2) + ('0' + (date.getMinutes())).slice(-2) + ('0' + (date.getSeconds())).slice(-2);
    }
 
    var filename = "../testdata/eomAppt";
    var eomAppt = require('../testdata/eomAppt');
    var loadsList = [];
   
    it('search loads', function() {

        var dat = new Date();
        var pickupApptDate2 = eomAppt.searchBy.pickupApptDate2;
        if (pickupApptDate2=="") {
            pickupApptDate2 = formatDate(addDays(dat, -1));
        }
        var pickupApptDate1 = formatDate(addDays(dat, -1-eomAppt.searchBy.pickupApptRange));
        if (eomAppt.searchBy.pickupApptRange > 31) {
            pickupApptDate2 = formatDate(addDays(addDays(dat, -1-eomAppt.searchBy.pickupApptRange), 31));
        }       

        browser.url('http://eom.jbhunt.com/eom/search/eomSearch.face?JEBPQV=PEVSF9R&GFQPTRVE=9&Qrh9vp%2BgTnIawIsmpjJGcQ%3D%3D=duMyr8l2vvA%3D&THHPTZ=9&YWMPTLUB=9&GFQDYEV=9325804455');
        browser.pause(2000);
        //browser.debug();
        if (browser.isExisting('[value="Login"]')) {
            browser.setValue('[id="j_username"]', 'jisqhx3');
            browser.setValue('[id="j_password"]', 'wokbotqa');
            browser.click('[value="Login"]');
        }
        browser.waitForExist('[id="eomSearchMain:baseSearchList"]', 5000);
        browser.pause(1000);
        browser.selectByValue('[id="eomSearchMain:baseSearchList"]', eomAppt.searchBy.searchOptions);
        browser.setValue('[id="eomSearchMain:baseSearchVal"]', eomAppt.searchBy.searchValue);
        browser.setValue('[id="eomSearchMain:basePickupBeginCalendarDate"]', pickupApptDate1);
        browser.setValue('[id="eomSearchMain:basePickupEndCalendarDate"]', pickupApptDate2);
        browser.click('[id="eomSearchMain:advOrderSearch"]');
        //browser.debug();
        browser.waitForExist('[id*=":optxtDispatchStatus"]');
        //browser.pause(5000);
        browser.windowHandleMaximize();

        browser.pause(5000);

        browser.waitForExist('[id^="frmOrderListing:lOrderListing:"][id$=":optxtDispatchStatus"]', 15000);
        //browser.debug();
        loadsStatus = browser.getText('[id^="frmOrderListing:lOrderListing:"][id$=":optxtDispatchStatus"]');
        loadsNumber = browser.getText('[id*=":optxtOrderNumberActionFocusLink"]');
        browser.pause(2000);
        browser.waitForExist('[id^="frmOrderListing:lOrderListing:"][id$=":optxtPkpDtTime"]', 25000);
        loadsdt = browser.getText('[id^="frmOrderListing:lOrderListing:"][id$=":optxtPkpDtTime"]');
        loadsdt2 = browser.getText('[id^="frmOrderListing:lOrderListing:"][id$=":optxtPkpDtTime2"]');
        loadsdt3 = browser.getText('[id^="frmOrderListing:lOrderListing:"][id$=":optxtPkpDtTime3"]');  
        //browser.debug();
        //console.log(loads);
        changeLoadCount = 0;
        for (i = 0; i < loadsStatus.length; i++) {
            loadsList.push({loadNumber:loadsNumber[i], status:loadsStatus[i], dt:loadsdt[i], dt2:loadsdt2[i], dt3:loadsdt3[i]});
            if (eomAppt.newAppt.status2Change.includes(loadsStatus[i])) {
                changeLoadCount++;
            }
        }
        console.log(pickupApptDate1 + " " + pickupApptDate2);
        //console.log(loadsValue);
        //browser.debug();

        
        //rename the json file with timestamp before overwrite:
        
        var fs = require("fs");
        var backupFilename = "./testdatabackup/eomAppt." + fileTimestamp(fs.statSync("./testdata/eomAppt.json").birthtime) + ".json";
        fs.rename("./testdata/eomAppt.json", backupFilename, (err) => {
			if (err) {
                console.error(err);
                return;
			};
			console.log("json file has been renamed to " + backupFilename);
		});
        eomAppt.loads = loadsList;
        eomAppt.loadCount = loadsList.length;
        eomAppt.changeLoadCount = changeLoadCount;
        //overwrite the json file
        fs.writeFile("./testdata/eomAppt.json", JSON.stringify(eomAppt, null, 4), (err) => {
			if (err) {
                console.error(err);
                return;
			};
			console.log("Search Result has been written back.");
		});
    });
    
    it('should change appt date and time for all the matching loads in first page', function() {
        //click appt icon for each load that the status equal to status2Change and update appt date and time
        console.log(loadsList);
        var id = "";
        var changedLoads = [];
        var dat = new Date();
        var newApptDate = eomAppt.newAppt.newApptDate;
        var my_frame = "";

        if (newApptDate == "") {
            newApptDate = formatDate(dat);
        } else if (typeof(newApptDate) == "number") {
            newApptDate = formatDate(addDays(dat, newApptDate));
        }

        //browser.windowHandleMaximize(); //otherwise will get unclickable error
        browser.pause(1000);
        for (i = 0; i < loadsList.length; i++) {
            if (eomAppt.newAppt.status2Change.includes(loadsList[i].status)) {
                console.log(loadsList[i].loadNumber);
                changedLoads.push(loadsList[i].loadNumber);
                
                id = "frmOrderListing:lOrderListing:" + i.toString() + ":gimgApptMaintActionFocusLink";
                browser.waitForEnabled('[id="' + id + '"]', 5000);
                browser.click('[id="' + id + '"]');
                //browser.debug();
                //switch to iframe
                browser.waitForExist('iframe[id="TB_iframeContent"]');
                my_frame = $('iframe[id="TB_iframeContent"]').value;

                browser.frame(my_frame);
                
                //Change Date/Time for Stop 1 then loop to Stop 2 (hopefully 99)
                //The script does not differentiate load types, neither of stop numbers (yet)

               for (j=0; j < 2; j++) {
                    browser.pause(2000);
                    browser.waitForEnabled('[id="frmOrderApptMaint:lOrderStopsDetails:' + j.toString() + ':cmdLnkStopNumberActionFocusLink"]', 25000);
                    if (browser.getText('[id="frmOrderApptMaint:lOrderStopsDetails:' + j.toString() + ':optxtStopStatus"]') == "D") { continue; }

                    browser.click('[id="frmOrderApptMaint:lOrderStopsDetails:' + j.toString() + ':cmdLnkStopNumberActionFocusLink"]');
                    browser.waitForExist('td*=Appointment changes have been updated successfully', 25000, true);
                    browser.waitForEnabled('[id="frmOrderApptMaint:lnfcBeginCalendarDate"]', 60000); //has to be this long or maybe even longer, not sure otherwise what causes the element could not be located error
                    browser.click('[id="frmOrderApptMaint:lnfcBeginCalendarDate"]');
                    browser.pause(1000);
                    browser.setValue('[id="frmOrderApptMaint:lnfcBeginCalendarDate"]', newApptDate);

                    //browser.pause(1000);
                    browser.waitForEnabled('[id="frmOrderApptMaint:itxtBegCalendarTime"]', 5000);

                    if (j==0) {
                        browser.setValue('[id="frmOrderApptMaint:itxtBegCalendarTime"]', eomAppt.newAppt.newApptTime.stop1Time1);
                        browser.setValue('[id="frmOrderApptMaint:itxtEndCalendarTime"]', eomAppt.newAppt.newApptTime.stop1Time2);
                    } else {
                        browser.setValue('[id="frmOrderApptMaint:itxtBegCalendarTime"]', eomAppt.newAppt.newApptTime.stop99Time1);
                        browser.setValue('[id="frmOrderApptMaint:itxtEndCalendarTime"]', eomAppt.newAppt.newApptTime.stop99Time2);
                    }
                    browser.pause(1000);
                    browser.waitForEnabled('select[id="frmOrderApptMaint:somGrpResp"]', 5000);
                    //browser.debug();
                    var selectBox = $('select[id="frmOrderApptMaint:somGrpResp"]');
                    selectBox.selectByValue('JB HUNT');

                    browser.pause(1000);
                    browser.waitForEnabled('select[id="frmOrderApptMaint:somRsnCode"]', 5000);
                    //browser.debug();
                    var selectBox = $('select[id="frmOrderApptMaint:somRsnCode"]');
                    selectBox.selectByValue('12');
                    //browser.debug();
                    browser.pause(1000);
                    browser.waitForEnabled('[id="frmOrderApptMaint:itxtContact"]', 5000);
                    browser.setValue('[id="frmOrderApptMaint:itxtContact"]', 'TEST');
                    browser.setValue('[id="frmOrderApptMaint:itaCommentText"]', 'TEST');
                    browser.pause(1000);
                    browser.click('[id="frmOrderApptMaint:cbtnSave1"]');
                    //no rate warning
                    for (k=0; k<5; k++) {
                        browser.pause(1000);
                        //browser.debug();
                        if (browser.isExisting('td*=Appointment changes have been updated successfully')) {
                            break;
                        } else if (browser.isExisting('[id="frmOrderApptMaint:cbtnOkNoRateMsg"]')) {
                            browser.click('[id="frmOrderApptMaint:cbtnOkNoRateMsg"]');
                            browser.pause(2000);
                            continue;   
                        }
                    }
                    browser.waitForExist('td*=Appointment changes have been updated successfully');
                    //browser.pause(6000);
                    if (j==0) {
                        eomAppt.loads[i].new1Dt = browser.getValue('[id="frmOrderApptMaint:lnfcBeginCalendarDate"]');
                        eomAppt.loads[i].new1Dt2 = browser.getValue('[id="frmOrderApptMaint:itxtBegCalendarTime"]');
                        eomAppt.loads[i].new1Dt3 = browser.getValue('[id="frmOrderApptMaint:itxtEndCalendarTime"]');                       
                    } else {
                        eomAppt.loads[i].new2Dt = browser.getValue('[id="frmOrderApptMaint:lnfcBeginCalendarDate"]');
                        eomAppt.loads[i].new2Dt2 = browser.getValue('[id="frmOrderApptMaint:itxtBegCalendarTime"]');
                        eomAppt.loads[i].new2Dt3 = browser.getValue('[id="frmOrderApptMaint:itxtEndCalendarTime"]');                         
                    }
                }
                browser.frameParent();
                browser.pause(1000);
                browser.waitForEnabled('[id="TB_closeWindowButton"]', 5000);
                browser.click('[id="TB_closeWindowButton"]');
                browser.pause(5000);
            }
       
            //browser.debug();
            eomAppt.changedLoads = changedLoads;
            var fs = require("fs");
            fs.writeFile("./testdata/eomAppt.json", JSON.stringify(eomAppt, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
                //console.log("Appointment changes have been written back.");
            });
        } 
    })
});