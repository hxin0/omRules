/*
1. Search by the criteria
2. Get list of loads that are Available
3. Change Appointment Date/Time to current date/time
*/

describe('change loads appointment date and time', function() {
    function formatDate(date) {
        return ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2) + date.getFullYear();
    }

    function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
 
    var eomAppt = require('../testdata/eomAppt')
    it('should read json and display', function() {
        //console.log(eomAppt);
    });
    
    it('search loads', function() {
        var dat = new Date();
        var pickupApptDate2 = eomAppt.searchBy.pickupApptDate2;
        if (pickupApptDate2=="") {
            pickupApptDate2 = formatDate(addDays(dat, -1));
        }
        var pickupApptDate1 = formatDate(addDays(dat, -1-eomAppt.searchBy.pickupApptRange));

        browser.url('http://eom.jbhunt.com/eom/search/eomSearch.face?JEBPQV=PEVSF9R&GFQPTRVE=9&Qrh9vp%2BgTnIawIsmpjJGcQ%3D%3D=duMyr8l2vvA%3D&THHPTZ=9&YWMPTLUB=9&GFQDYEV=9325804455');
        browser.waitForExist('[id="eomSearchMain:baseSearchList"]');
        browser.pause(5000);
        browser.selectByValue('[id="eomSearchMain:baseSearchList"]', eomAppt.searchBy.searchOptions);
        browser.setValue('[id="eomSearchMain:baseSearchVal"]', eomAppt.searchBy.searchValue);
        browser.setValue('[id="eomSearchMain:basePickupBeginCalendarDate"]', pickupApptDate1);
        browser.setValue('[id="eomSearchMain:basePickupEndCalendarDate"]', pickupApptDate2);
        browser.click('[id="eomSearchMain:advOrderSearch"]');
        
        browser.waitForExist('[id*=":optxtDispatchStatus"]');
        browser.pause(5000);
        //browser.debug();
        //loads status array: loadStatus
        //loadsStatus0 = browser.getText('[id*=":optxtDispatchStatus"]');
        loadsStatus = browser.getText('[id^="frmOrderListing:lOrderListing:"][id$=":optxtDispatchStatus"]')
        loads = browser.getText('[id*=":optxtOrderNumberActionFocusLink"]');
        loadsdt = browser.getText('[id^="frmOrderListing:lOrderListing:"][id$=":optxtPkpDtTime"]')
        loadsdt2 = browser.getText('[id^="frmOrderListing:lOrderListing:"][id$=":optxtPkpDtTime2"]')
        loadsdt3 = browser.getText('[id^="frmOrderListing:lOrderListing:"][id$=":optxtPkpDtTime3"]')       
        //browser.debug();
        //console.log(loads);
        loadsValue=[];
        changeLoadCount = 0;
        for (i = 0; i < loadsStatus.length; i++) {
            loadsValue.push({loadNumber:loads[i], status:loadsStatus[i], dt:loadsdt[i], dt2:loadsdt2[i], dt3:loadsdt3[i]});
            if (eomAppt.newAppt.status2Change.includes(loadsStatus[i])) {
                changeLoadCount++;
            }
        }
        console.log(pickupApptDate1 + " " + pickupApptDate2);
        //console.log(loadsValue);
        //browser.debug();
        eomAppt.loads = loadsValue;
        //eomAppt.loadCount = Object.keys(loadsValue).length;
        eomAppt.loadCount = loadsValue.length;
        eomAppt.changeLoadCount = changeLoadCount;
        
        //write
        var fs = require("fs");
        fs.writeFile("./testdata/eomAppt.json", JSON.stringify(eomAppt, null, 4), (err) => {
			if (err) {
                console.error(err);
                return;
			};
			console.log("File has been wriiten back with the updated object");
		});
    });
    
    it('should change appt date and time for all the available loads in first page', function() {
        //click appt icon for each 'Available' loads and update appt date and time
        console.log(loadsValue);
        var id = "";
        var dat = new Date();
        newApptDate = eomAppt.newAppt.newApptDate;
        if (newApptDate == "") {
            newApptDate = formatDate(dat);
        }
        browser.windowHandleMaximize();
        browser.pause(1000);
        for (i = 0; i < loadsValue.length; i++) {
            if (eomAppt.newAppt.status2Change.includes(loadsValue[i].status)) {
                console.log(loadsValue[i].loadNumber);
                id = "frmOrderListing:lOrderListing:" + i.toString() + ":gimgApptMaintActionFocusLink";
                browser.waitForEnabled('[id="' + id + '"]', 5000);
                browser.click('[id="' + id + '"]');
                //browser.debug();
                //switch to iframe
                browser.waitForExist('iframe[id="TB_iframeContent"]');
                var my_frame = $('iframe[id="TB_iframeContent"]').value;
                //console.log('frame: ' + my_frame);
                browser.frame(my_frame);
                
                //Change Date/Time for Stop 1
                //browser.waitForVisible('[id="frmOrderApptMaint:lOrderStopsDetails:0:cmdLnkStopNumberActionFocusLink"]');
                for (j=0; j < 2; j++) {
                    browser.pause(2000);
                    browser.waitForEnabled('[id="frmOrderApptMaint:lOrderStopsDetails:' + j.toString() + ':cmdLnkStopNumberActionFocusLink"]', 25000);
                    browser.click('[id="frmOrderApptMaint:lOrderStopsDetails:' + j.toString() + ':cmdLnkStopNumberActionFocusLink"]');
                    browser.waitForEnabled('[id="frmOrderApptMaint:lnfcBeginCalendarDate"]', 25000);
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
                    browser.pause(1000);
                }
                browser.frameParent();
                browser.pause(1000);
                browser.waitForEnabled('[id="TB_closeWindowButton"]', 5000);
                browser.click('[id="TB_closeWindowButton"]');
                browser.pause(1000);
            }
        }        
        //browser.debug();
    })
});


