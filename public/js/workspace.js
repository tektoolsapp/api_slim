function showSnackbar(snackbarDiv, location) {
    // Get the snackbar DIV
    var x = document.getElementById(snackbarDiv);

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){
        x.className = x.className.replace("show", ""); 
        window.location.assign(location);
    }, 3000);
} 

$("body").on('click','[id^=workspace_page_]', function (e) {

    e.preventDefault();

    var pageDisplay = $(this).prop("id");
    var splitPage = pageDisplay.split("_");
    var pageNum = splitPage[2]

    console.log("REQ PAGE", pageNum);

    getWorkspace('requests', pageNum);

});

/* $.fn.filepond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginFileMetadata
); */

/* $("#sidebar-right").on('click', '.fp2', function (e) {

    //e.preventDefault();

    $('.pond2').append(`<input type="file" class="filepond" name="filepond[]" multiple data-allow-image-edit="false" data-max-file-size="3MB">`);

    loadFilePond();
}); */

// Turn input element into a pond
/* function loadFilePond() {

    $('body input.filepond:not(.filepond--browser)').each(function(){

        $($(this)).filepond({
            acceptedFileTypes: ['image/png', 'application/pdf'],
            allowMultiple: true,
            maxFiles: 2,
            fileMetadataObject: {
                'hello': 'world'
            },
            server:{

                process:(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {

                // fieldName is the name of the input field
                // file is the actual file object to send
                const formData = new FormData();

            console.log("FILE: ",file);

            console.log("METADATA: ",metadata);

            formData.append(fieldName, file, file.name);

            var reqId = $("#ws_id").val();
            
            formData.append("req", reqId);

            console.log("FD: ",formData);

            const request = new XMLHttpRequest();
            request.open('POST', '/filepond/process');

            // Should call the progress method to update the progress to 100% before calling load
            // Setting computable to false switches the loading indicator to infinite mode
            request.upload.onprogress = (e) => {
                progress(e.lengthComputable, e.loaded, e.total);
            };

            // Should call the load method when done and pass the returned server file id
            // this server file id is then used later on when reverting or restoring a file
            // so your server knows which file to return without exposing that info to the client

            request.onload = function () {
                if (request.status >= 200 && request.status < 300) {
                    // the load method accepts either a string (id) or an object
                    load(request.responseText);
                } else {
                    // Can call the error method if something is wrong, should exit after
                    error('oh no');
                }
            };

            request.send(formData);
            },
                revert: 'filepond/revert',
            },

            onaddfile: (err, item) => {
                console.log('file added event', err, item);
            }
        });
    });

} */



function resetMenu(){

    $("[id^=row_]").html('<button class="w3-button w3-small w3-transparent w3-padding-small menu-button"><i class="fas fa-ellipsis-h"></i>');
    $(".menu-button").html('<i class="fas fa-ellipsis-h"></i>');
}

$("#workspace").on('mouseleave','.w3-dropdown-content', function (e) {

    resetMenu();

});

$("#workspace").on('click','[id^=test-dropdown-button-]', function (e) {

    e.preventDefault();

    var splitId = $(this).prop("id");
    var splitArray = splitId.split("-");
    var rowId = splitArray[3];

    alert("clicked: " + rowId);

});

$("#workspace").on('click','[id^=row_]', function (e) {

    //CLICKER
    
    e.preventDefault();
    var $clicker = $(this);

    var clickedId = $(this).prop("id");
    var splitArray = clickedId.split("_");
    var rowId = splitArray[1];

    console.log("ROW ID: ", rowId);

    localStorage.setItem('last-req-row', rowId);

    //HIGHLIGHT ROW
    $(".req-row").removeClass('highlight-row');
    $("#req_row_" + rowId).addClass('highlight-row');

    //console.log("CLICKER:", $clicker[0]['attributes']);
    var pos = $clicker.position();
    var dropdownTop = + pos.top;

    console.log("DD: ", dropdownTop);
    //alert("DD: " + dropdownTop);

    if(parseInt(dropdownTop) > 500){
        var posStyle = 'width:200px;bottom:0px;right:100%;';
    } else {
        var posStyle = 'width:200px;top:0;right:100%;';
    }

    var splitId = $(this).prop("id");
    var splitArray = splitId.split("_");
    var rowId = splitArray[1];

    $("[id^=row_]").html('<button class="w3-button w3-small w3-transparent w3-padding-small menu-button w3-hover"><i class="fas fa-ellipsis-h"></i>');
    $(".menu-button").html('<i class="fas fa-ellipsis-h"></i>');

    var actionButton = '<div class="w3-dropdown-hover">';
    actionButton += '<button class="w3-button w3-small w3-padding-small w3-hover"><i class="fas fa-ellipsis-h"></i></button>';
    actionButton += '<div class="w3-dropdown-content w3-bar-block w3-border" style="' + posStyle +';">';
    actionButton += '<a id="workspace-action-edit_' + rowId + '" href="#" class="w3-bar-item w3-button">Edit</a>';
    actionButton += '<a id="workspace-action-updateSwings_' + rowId + '" href="#" class="w3-bar-item w3-button">Update Swings</a>';
    actionButton += '<a id="workspace-action-swings_' + rowId + '" href="#" class="w3-bar-item w3-button">View Swings</a>';
    //actionButton += '<a id="workspace-action-view_' + rowId + '"href="#" class="w3-bar-item w3-button">View Request Shifts</a>';
    actionButton += '<a id="workspace-action-pdf_' + rowId + '" href="#" class="w3-bar-item w3-button">Rio PDFs</a>';
    actionButton += '<a id="workspace-action-quote_' + rowId + '" href="#" class="w3-bar-item w3-button">Quote</a>';
    actionButton += '<a id="workspace-action-email_' + rowId + '" href="#" class="w3-bar-item w3-button">Email Confirmation</a>';
    actionButton += '</div>';

    $("#row_" + rowId).html(actionButton);

});

$("body").on('click','[id^=workspace-action]', function (e) {

    e.preventDefault();

    var thisId = $(this).prop('id');

    console.log("TID Y", thisId);

    sidebarAction(thisId)

});

$("#workspace").on('click','[id^=workspace-action]', function (e) {

    e.preventDefault();

    var thisId = $(this).prop('id');

    console.log("TID X", thisId);

    sidebarAction(thisId);
});

$("body").on('click','[id^=workspace-shift-action]', function (e) {

    e.preventDefault();

    var thisId = $(this).prop('id');

    console.log("TID Z", thisId);

    sidebarShiftAction(thisId);
});

$("body").on('click','[id^=shift_row_]', function (e) {

    e.preventDefault();
    var $clicker = $(this);
    var pos = $clicker.position();
    var dropdownTop = + pos.top;

    var clickedId = $(this).prop("id");
    var splitArray = clickedId.split("_");
    var rowId = splitArray[3];
    
    console.log("ROW ID: ", rowId);

    localStorage.setItem('last-shift-row', rowId);

    //HIGHLIGHT ROW
    $(".req-shift-row").removeClass('highlight-row');
    $("#req_shift_row_" + rowId).addClass('highlight-row');

    //SHIFT ROW

    console.log("DROPDOWN TOP: ",dropdownTop); 

    //alert("SHIFT MENU CLICKED");

    if(parseInt(dropdownTop) > 400){
        var posStyle = 'width:200px;bottom:100%;right:0px;';
    } else {
        var posStyle = 'width:200px;top:0;right:100%;';
    }

    var splitId = $(this).prop("id");
    var splitArray = splitId.split("_");
    var randomShift = splitArray[2];
    var rowId = splitArray[3];

    $("[id^=shift_row_]").html('<button class="w3-button w3-small w3-transparent w3-padding-small menu-button w3-hover"><i class="fas fa-ellipsis-h"></i>');
    $(".menu-button").html('<i class="fas fa-ellipsis-h"></i>');

    var shiftActionButton = '<div class="w3-dropdown-hover">';
    shiftActionButton += '<button class="w3-button w3-small w3-padding-small w3-hover"><i class="fas fa-ellipsis-h"></i></button>';
    shiftActionButton += '<div class="w3-dropdown-content w3-bar-block w3-border" style="' + posStyle +';">';
    shiftActionButton += '<a id="workspace-shift-action-edit_' + rowId + '" href="#" class="w3-bar-item w3-button">Edit</a>';
    shiftActionButton += '<a id="workspace-shift-action-schedule_' + rowId + '" href="#" class="w3-bar-item w3-button">View in Scheduler</a>'; 
    shiftActionButton += '<a id="workspace-shift-action-availability_' + rowId + '" href="#" class="w3-bar-item w3-button">Check Availability</a>';    
    shiftActionButton += '<a id="workspace-shift-action-uploadTravel_' + rowId + '" href="#" class="w3-bar-item w3-button">Travel Docs</a>';    
    shiftActionButton += '<a id="workspace-shift-action-notify_' + rowId + '" href="#" class="w3-bar-item w3-button">Notify Employee</a>';    
    shiftActionButton += '</div>';

    $("#shift_row_" + randomShift + '_' + rowId).html(shiftActionButton);

});

function viewShifts(reqId, reqShifts, shiftId) {

    document.getElementById("request-swing-details-modal").style.display = "block";

    $("#request-swing-details-title").html("Swings for Request #" + reqId);

    var reqDets = getReqDets(reqId);

    console.log("VIEW SHIFTS REQ DETS: ", reqDets);

    var reqSite = reqDets.ws_site_desc;
    var reqStart = reqDets.ws_start_date;
    var reqEnd = reqDets.ws_end_date;
    var reqTrades = reqDets.ws_trades_desc;
    var reqComments = reqDets.ws_comments;

    //GET THE SWING DETAILS
    var modalSwings = "";
    
    modalSwings += '<div id="request-swings-modal-container" style="margin:10px 0 20px 0;">';
    
    modalSwings += '<h5>Request Details:</h5>';

    modalSwings += '<div style="float:left;width:35%;">';

    modalSwings += '<div><span style="font-weight:bold;">Site:</span> ' + reqSite + '</div>';
    modalSwings += '<div style="width:170px;float:left;"><span style="font-weight:bold;">Start Date:</span> ' + reqStart + '</div>';
    modalSwings += '<div style="width:170px;float:left;margin-left:15px;"><span style="font-weight:bold;">End Date:</span> ' + reqEnd + '</div>';
    modalSwings += '<div style="clear:both;"></div>';
    
    modalSwings += '</div>';

    modalSwings += '<div style="float:left;width:60%;margin-left:15px;">';
    
    modalSwings += '<div><span style="font-weight:bold;">Trades Required:</span> ' + reqTrades  + '</span></div>';
    modalSwings += '<div><span style="font-weight:bold;">Request Comments:</span> ' + reqComments + '</span></div>';

    modalSwings += '</div>';

    modalSwings += '<div style="clear:both;"></div>';

    modalSwings += '<div id="shifts-table-container" style="margin-top:15px;overflow-y:auto;height:466px;border:0px solid red;">';

    modalSwings += '<table id="workspace-shifts-table" class="w3-striped w3-bordered w3-hoverable" style="table-layout:auto;width:100%;border-collapse:collapse;">';
    modalSwings += '<thead>';
    modalSwings += '<tr class="w3-darkblue">';
    modalSwings += '<th>Employee</th>';
    modalSwings += '<th>Swing Id</th>';
    modalSwings += '<th>Trade Type</th>';
    modalSwings += '<th>Start</th>';
    modalSwings += '<th>Finish</th>';
    modalSwings += '<th>Day/Night</th>';
    modalSwings += '<th>On/Off</th>';
    modalSwings += '<th>Emp. Notified</th>';
    modalSwings += '<th>Msg. Delivered</th>';
    modalSwings += '<th>Emp. Confirmed</th>';
    modalSwings += '<th>Travel Docs</th>';
    modalSwings += '<th>Action</th>';
    modalSwings += '</thead>';
    modalSwings += '<tbody>';

    if(reqShifts.length > 0){
    
        for (var r = 0; r < reqShifts.length; r++) {

            var shiftId = reqShifts[r]['shift'];
            var shiftEmpId = reqShifts[r]['emp_id'];
            var shiftEmp = reqShifts[r]['emp'];
            var shiftTrades = reqShifts[r]['trade_type'];
            var shiftStart = reqShifts[r]['start'];
            var shiftEnd = reqShifts[r]['end'];
            var shiftTime = reqShifts[r]['time'];
            var shiftType = reqShifts[r]['type'];
            var shiftEmpNotified = reqShifts[r]['notified'];
            var shiftMessageDelivered = reqShifts[r]['delivered'];
            var shiftConfirmed = reqShifts[r]['confirmed'];

            if(shiftEmpNotified == 'Y'){
                var shiftNotified = 'checked="checked"'
            } else {
                var shiftNotified = '';
            }

            if(shiftMessageDelivered == 'Y'){
                var shiftDelivered = 'checked="checked"'
            } else {
                var shiftDelivered = '';
            }

            if(shiftConfirmed == 'Y'){
                var shiftConfirmedStatus = 'checked="checked"'
            } else {
                var shiftConfirmedStatus = '';
            }

            var randShift = Math.floor(Math.random() * 1000000);


            //SET SWING ROW

            var storedShift = localStorage.getItem('last-shift-row');

            console.log("STORED SHIFT: ", storedShift);

            console.log("SHIFT ID: ", shiftId);
            
            if(shiftId == storedShift){
                var hl_class = 'highlight-row';
            } else {
                var hl_class = ''
            }

            modalSwings += '<tr id="req_shift_row_' + shiftId + '" class="req-shift-row ' + hl_class + '">';
            modalSwings += '<td>' + shiftEmp + '</td>';
            modalSwings += '<td>' + shiftId + '</td>';
            modalSwings += '<td>' + shiftTrades + '</td>';
            modalSwings += '<td>' + shiftStart + '</td>';
            modalSwings += '<td>' + shiftEnd + '</td>';
            modalSwings += '<td>' + shiftTime + '</td>';
            modalSwings += '<td>' + shiftType + '</td>';
            modalSwings += '<td><input id="shift_emp_notified_' + shiftEmpId + '_' + shiftId + '" type="checkbox" ' + shiftNotified + ' class="w3-check" readonly style="top:2px;"></td>';
            modalSwings += '<td><input id="shift_emp_delivered_' + shiftEmpId + '_' + shiftId + '" type="checkbox" ' + shiftDelivered + ' class="w3-check" readonly style="top:2px;"></td>';
            modalSwings += '<td><input id="shift_emp_confirmed_' + shiftId + '" type="checkbox" class="w3-check" ' + shiftConfirmedStatus + 'class="w3-check" style="top:2px;"></td>';
            modalSwings += '<td><input id="shift_travel_docs_' + shiftId + '" type="checkbox" class="w3-check" class="w3-check" style="top:2px;"></td>';

            modalSwings += '<td id="shift_row_' + randShift + '_'+ shiftId + '"><button class="w3-button w3-small w3-transparent w3-padding-small menu-button"><i class="fas fa-ellipsis-h"></i></button></td>';
            modalSwings += '</tr>';
        }

        modalSwings += '</tbody>';
        modalSwings += '</table>';
        modalSwings += '</div>';
        modalSwings += '</div>';

    } else {
    
        modalSwings += '</tbody>';
        modalSwings += '</table>';
        modalSwings += '</div>';
        modalSwings += '<div class="error" style="height:80px;padding-top:30px;">There are currently No Swings for this Request</div>';
        modalSwings += '</div>';
        
    }

    $("#request-swings-modal-display").html("");    
    $("#request-swings-modal-display").append(modalSwings);

}

//SET SCHEDULER RESOURCES

function setResources(resources){

    var resourceItem = {};
    var resourceArray = [];

    for (var r = 0; r < resources.length; r++) {

        var text = resources[r]['first_name'] + " " + resources[r]['last_name'];
        var value = resources[r]['emp_id'];
        var color = resources[r]['color'];

        resourceItem.text = text;
        resourceItem.value = value;
        resourceItem.color = color;

        resourceArray.push(resourceItem);

        resourceItem = {};
    }

    var resource = {}, resourcesArray = [];
    resource.field = 'userId';
    resource.name = 'UserId';
    resource.dataSource = resourceArray;
    resource.multiple = true;
    resource.title = 'UserId';

    resourcesArray.push(resource);

    console.log("MYARR: ", resourcesArray);

    localStorage.setItem('scheduler-resources', JSON.stringify(resourcesArray[0]));

    window.location.assign('/scheduler');

}

$("body").on('click','#availability-add-schedule', function (e) {

    //var selectedId = $(".shift-selection:checked ").prop("id");

    var selectedId = $('input[name=schedule_shifts]:checked').prop("id");

    var splitArray = selectedId.split("_");
    var shiftId = splitArray[2];
    var empId = splitArray[3];
    var reqId = localStorage.getItem('current-request');

    //alert("SCHEDULE SHIFT: " + selectedId);

    $.ajax({
        url: '/booking/reschedule',
        type: "POST",
        data: {
            "UserId" : empId,
            "ShiftId": shiftId,
            "RequestId": reqId,
        },
        success: function (response) {
            
            console.log("SCEDULE RESP: ", response);
            
            //RELOAD REQUEST SWING DETAILS WITH UPDATED SWING CHECKED

            document.getElementById('swing-availability-modal').style.display='none';

            //RESCHEDULE HERE
            
            //var request = 1;
            //var reqId = localStorage.getItem('current-request');
            
            $.ajax({
                url: '/shifts/request/' + reqId,
                type: "GET"
            }).done(function (response) {
        
                console.log("SHIFT DETAILS: ", response);
                var shifts = response;
                viewShifts(reqId, shifts);

                $("#update_shift_" + shiftId).prop("checked", true);
                
            }).fail(function (jqXHR, textStatus) {
                console.log("ERR: ", jqXHR);
            });

        }
    });

});


/* function setSidebarRightContent(currentRightSidebar){

    $("#sidebar-right").html("");

    var thisId = currentRightSidebar;
    var sidebarContent = thisId.split('_');

    console.log("SBCA: ", sidebarContent);

    var action = sidebarContent[0];
    var param = sidebarContent[1];

    console.log("PAR: ", param);

    if (action == 'add') {

        updateRequest('add', 'na');

    } else if (action == 'edit') {

        console.log("PARAM1:", param);

        updateRequest('update', param);
    
    } else if (action == 'updateSwings') {

        //alert("SHIFTS PARAM1:", param);

        localStorage.setItem('current-request',param);
        actionUpdateSwings(param);   

    } else if (action == 'email') {

        console.log("PARAME:", param);

        actionEmail(param);

    } else if (action == 'pdf') {

        console.log("PARAM2:", param);

        actionPdf(param);

    } else if (action == 'view') {

        console.log("PARAMV:", param);

        actionView(param);

    } else if (action == 'quote') {

        console.log("PARAM:", param);

        actionQuote(param);

    } else {

        var sbCont = "<div>Other</div>";
        $("#sidebar-right").append(sbCont);
    }

} */

function sidebarAction(thisId){

    var sidebarContent = thisId.split('-').pop();

    console.log("SBA", sidebarContent);

    var sidebarCheckArray = sidebarContent.split('_');

    console.log("SBA ARR: ", sidebarCheckArray);

    var sideBarCheck = sidebarCheckArray[0];

    console.log("SBA CHECK: ", sideBarCheck);

    if(sideBarCheck == 'swings'){

        var param = sidebarCheckArray[1];

        console.log("REQUEST PARAM: ", param);

        localStorage.setItem('current-request',param);
    
        $.ajax({
            url: '/shifts/request/' + param,
            type: "GET"
        }).done(function (response) {
    
            console.log("SHIFT DETAILS: ", response);
            var shifts = response;
            viewShifts(param, shifts);
            
        }).fail(function (jqXHR, textStatus) {
            console.log("ERR: ", jqXHR);
        });


    } else {

        var sideBarContent = sidebarCheckArray[1];

        var isClose = document.getElementById("sidebar-right").style.width === "500px";

        if (!isClose) {

            $("#sidebar-right").css({"width": "500px"});
            setSidebarRightContent(sidebarContent)

        } else {

            if (currentRightSidebar != sidebarRightContent) {
                setSidebarContent(sidebarContent)
            } else {
                $("#sidebar-right").css({"width": "0px"});
                //localStorage.removeItem('right-sidebar-content');
            }

        }

    }

}

function setSidebarRightContent(currentRightSidebar){

    $("#sidebar-right").html("");

    var thisId = currentRightSidebar;
    var sidebarContent = thisId.split('_');

    console.log("SBCA: ", sidebarContent);

    var action = sidebarContent[0];
    var param = sidebarContent[1];

    console.log("PAR: ", param);

    if (action == 'add') {

        updateRequest('add', 'na');

    } else if (action == 'edit') {

        console.log("PARAM1:", param);

        updateRequest('update', param);
    
    } else if (action == 'updateSwings') {

        //alert("SHIFTS PARAM1:", param);

        localStorage.setItem('current-request',param);
        actionUpdateSwings(param);   
    
    } else if (action == 'email') {

        console.log("PARAME:", param);

        actionEmailRequest(param);

    } else if (action == 'pdf') {

        console.log("PARAM2:", param);

        actionPdf(param);

    } else if (action == 'view') {

        console.log("PARAMV:", param);

        actionView(param);

    } else if (action == 'quote') {

        console.log("PARAM:", param);

        actionQuote(param);

    } else {

        var sbCont = "<div>Other</div>";
        $("#sidebar-right").append(sbCont);
    }

}

function calculateCustomDays(date1, date2){
     
    date1 = date1.split('-');
    date2 = date2.split('-');

    date1 = new Date(date1[2], date1[1], date1[0]);
    date2 = new Date(date2[2], date2[1], date2[0]);

    date1_unixtime = parseInt(date1.getTime() / 1000);
    date2_unixtime = parseInt(date2.getTime() / 1000);

    var timeDifference = date2_unixtime - date1_unixtime;
    var timeDifferenceInHours = timeDifference / 60 / 60;
    var timeDifferenceInDays = timeDifferenceInHours  / 24;

    timeDifferenceInDays = parseInt(timeDifferenceInDays) + 1;

    $("#custom-scheduler-days").val(timeDifferenceInDays);
    localStorage.setItem('custom-scheduler-days',timeDifferenceInDays);

}

$("#sidebar-right").on('click', '[id^=delete-swing-update]', function (e) {

    e.preventDefault();

    var deleteId = $(this).prop("id");
    var deleteSplit = deleteId.split("-");
    var reqId = deleteSplit[3];
    var swingId = deleteSplit[4];
    
    console.log("DELETE SWING ID: ", swingId);

    var r = confirm("Are you sure you want to delete the Selected Swing? Once Deleted, it cannot be recovered.");
        if (r == true) {
            
            $.ajax({
                url: 'swing/delete/' + swingId,
                type: "POST",
                success: function (response) {
                    console.log("DELETE RESP:", response);

                    alert("Swing has been successfully deleted.")
                    swingDisplay(reqId, swingId);
                    
                    //DELETION    
                }
            });
        }   
});    

$("#sidebar-right").on('click', '#save-swing-update', function (e) {

    console.log("SAVE SWING UPDATE");
    
    e.preventDefault();

    $("#edit-swing-form").find("div.error").removeClass('error').addClass("noerror");
    $("#edit-swing-form").find("input.required").removeClass('required');
    $("#edit-swing-form").find("select.required").removeClass('required');

    var errCount = 0;
    var errMsgArray = [];

    if($("#swing_request-edit").val() == 'NA') {        
        errCount++;
        errMsgArray.push({
            "id": "swing_request-edit",
            "msg": 'A Request must be selected'
        });
    }
    
    if($("#swing_emps-edit").val() === null) {           
        errCount++;
        errMsgArray.push({
            "id": "swing_emps-edit",
            "msg": 'An Employee must be selected'
        });
    }

    if($("[id^=swing_type-edit").val() == 'NA') {                  
        errCount++;
        errMsgArray.push({
            "id": "swing_type-edit",
            "msg": 'A Swing Type must be selected'
        });
    }

    if($("#swing_start_date-edit").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": "swing_start_date-edit",
            "msg": 'A Start Day must be selected'
        });
    }

    if($("#swing_trade_type-edit").val() == 'NA') {
        errCount++;
        errMsgArray.push({
            "id": "swing_trade_type-edit",
            "msg": 'A Swing Trade Type must be selected'
        });
    }

    if($("#swing_recurrence-edit").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": "swing_recurrence-edit",
            "msg": 'A Recurring Number of days must be provided'
        });
    }
    
    var storedTradesErrors = localStorage.getItem('swing-trade-type-errors');
    var storedTradesErrorsObj = JSON.parse(storedTradesErrors);

    console.log(storedTradesErrorsObj);

    if(storedTradesErrorsObj != null){

        var thisSwing = storedTradesErrorsObj.tempId;
        var thisMessage = storedTradesErrorsObj.message;
        
        errCount++;
        errMsgArray.push({
            "id": "swing_trade_type-edit",
            "msg": thisMessage
        });
    }

    //CHECK FOR SAME SWING TYPES

    var numEmps = $("#swing_emps-edit").val();

    console.log("NUM EMPS: ",numEmps);
    
    if($("#swing_emps-edit").val() !== null && $("#swing_emps-edit").val() !== "undefined"){
        
        var checkNumEmps = $("#swing_emps-edit").val().length;
        console.log("CHECK NUM EMPS: ", checkNumEmps);
    
        if(checkNumEmps > 1){
            errCount++;
            errMsgArray.push({
                "id": "swing_emps-edit",
                "msg": "Only 1 Employee can be selected"
            });

        }

    } else {
        var checkNumEmps = 'NA';
    }

    //errCount = 1;

    console.log("ERROR COUNT: ", errCount);
    
    if(errCount > 0){

        for (var e = 0; e < errMsgArray.length; e++) {

            var errorId = errMsgArray[e]['id'];
            var errorMsg = errMsgArray[e]['msg'];

            if(errorId == 'swing_emps-edit'){
                $("#swing_emps_error-edit").removeClass('noerror');
                $("#swing_emps_error-edit").addClass('error');
            } else {    
                $("#" + errorId).addClass('required');
                $("#" + errorId + "_error").removeClass('noerror');
                $("#" + errorId + "_error").addClass('error');
            }
            
            if(errorId == 'swing_emps-edit'){
                $("#swing_emps_error-edit").html(errorMsg);    
            } else {
                $("#" + errorId + "_error").html(errorMsg);
            }
        }

        alert("There are errors that require correcting");

    } else {
            
        var requestForm = $("#edit-swing-form").serialize();

        $.ajax({
            url: 'scheduler/swing',
            type: "POST",
            data: {
                "form": requestForm
            },
            success: function (response) {
                console.log("UPDATE SWING RESP", response);
                var status = response.status;
                var templateArray = response.template_array;
                templateArray = JSON.parse(templateArray);
                templateArray = templateArray[0];
                
                console.log("UPDATE SWING: ", templateArray);

                var reqId = templateArray['swing_request'];
                var swingId = templateArray['swing_id'];

                alert("Swing was Successfully Updated!")
                swingDisplay(reqId, swingId);

                //alert("SETTING");
                //localStorage.setItem('scheduler-template-last-stored',templateArray);

                //var resetEmps = [];
                //localStorage.setItem('scheduler-templates-employees', JSON.stringify(resetEmps));
                
                //window.location.assign('/workspace');

            }
        });
    }
});

function editSwingDetails(swingId){
    
    $("#sidebar-right").html("");

    var tempId = 'edit';
    
    //INITIALISE LOCAL STORAGE OF EMPS
    //currEmpsArray = [];
    //localStorage.setItem('scheduler-templates-employees',JSON.stringify(currEmpsArray));

    var editSwingForm = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    editSwingForm += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Edit Swing Details - Swing #' + swingId + '</div>';
    editSwingForm += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    editSwingForm += '</div>';

    editSwingForm += '<div id="outer-templates-container" style="margin:0 15px 0 15px;border:0px solid red;">';

    editSwingForm += '<div class="w3-row">';
    editSwingForm += '<div class="w3-quarter" style="margin-top:5px;margin-bottom:10px;font-size:12px;border:0px solid;">Required Field<span class="required-label">*</span></div>';
    
    editSwingForm += '<div class="w3-three-quarter w3-right" style="margin-top:5px;margin-bottom:10px;border:0px solid;">';
    editSwingForm += '<label class="form-switch">Conflict Management&nbsp;&nbsp;';
    editSwingForm += '<input id="swing-conflict-management" style="margin-left:10px;" type="checkbox">';
    editSwingForm += '<i></i></label>';
    editSwingForm += '</div>';
    
    editSwingForm += '</div>';
    
    editSwingForm += '<form name="edit-swing-form" id="edit-swing-form">';

    editSwingForm += '<input type="hidden" id="swing_id-' + tempId + '" name="swing_id-' + tempId + '" value="">';
    editSwingForm += '<input type="hidden" id="swing_trades-' + tempId + '" name="swing_trades-' + tempId + '" value="">';

    editSwingForm += '<div class="w3-row">';

    editSwingForm += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    editSwingForm += '<label>Request<span class="required-label">*</span></label>';
    editSwingForm += '<select name="swing_request-' + tempId + '" id="swing_request-' + tempId + '" class="w3-select w3-border input-display" style="pointer-events:none;"></select>';
    editSwingForm += '<div id="swing_request-' + tempId + '_error" class="noerror" ></div>';
    editSwingForm += '</div>';

    editSwingForm += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    editSwingForm += '<label>Reference<span class="required-label">*</span></label>';
    editSwingForm += '<input name="swing_reference-' + tempId + '" id="swing_reference-' + tempId + '" class="w3-input w3-border input-display" type="text" style="background-color:lightgrey" readonly="readonly">';
    editSwingForm += '<div id="swing_reference-' + tempId + '_error" class="noerror" ></div>';
    editSwingForm += '</div>';

    editSwingForm += '</div>';

    editSwingForm += '<div class="w3-row">';

    editSwingForm += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    editSwingForm += '<label style="font-weight:bold;">Employee(s)<span class="required-label"<span>*</span></label>';
    editSwingForm += '<select id="swing_emps-' + tempId + '" name="swing_emps-' + tempId + '[]" multiple="multiple" style="margin-top:10px;"></select>';
    editSwingForm += '<div id="swing_emps_error-' + tempId +'" class="noerror" style="margin-top:10px;"></div>';
    editSwingForm += '</div>';//DISPLAY
    editSwingForm += '</div>';//ROW

    editSwingForm += '<div id="swing-templates-container" style="border:0px solid brown">';
    
    editSwingForm += '<div id="swing-' + tempId + '" style="margin-top:10px;padding:0 10px 10px 10px;border:1px solid #CCC; box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19);">';
    
    //editSwingForm += '<h3>Swing ' + tempId + ':</h3>';
    
    editSwingForm += '<div class="w3-row">';

    editSwingForm += '<div class="w3-half" style="margin-top:10px;padding:0 10px 10px 0;">';
    editSwingForm += '<label>Swing Type<span class="required-label">*</span></label>';
    editSwingForm += '<select name="swing_type-' + tempId + '" id="swing_type-' + tempId + '" class="w3-select w3-border input-display">';
    editSwingForm += '<option value="NA">Select a Swing Type</option>';
    editSwingForm += '<option value="On">On</option>';
    editSwingForm += '<option value="Off">Off</option>';
    editSwingForm += '</select>';
    editSwingForm += '<div id="swing_type-' + tempId + '_error" class="noerror" ></div>';
    editSwingForm += '</div>';

    editSwingForm += '<div class="w3-half" style="margin-top:10px;padding:0 10px 10px 0;">';
    editSwingForm += '<label>Start Day<span class="required-label">*</span></label>';
    editSwingForm += '<input name="swing_start_date-' + tempId + '" id="swing_start_date-' + tempId + '" class="w3-input w3-border datepicker input-display start-day" type="text" readonly="readonly">';
    editSwingForm += '<div id="swing_start_date-' + tempId + '_error" class="noerror" ></div>';
    editSwingForm += '</div>';

    editSwingForm += '</div>';

    editSwingForm += '<div class="w3-row">';

    editSwingForm += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    editSwingForm += '<label>Trade Type<span class="required-label">*</span></label>';
    editSwingForm += '<select name="swing_trade_type-' + tempId + '" id="swing_trade_type-' + tempId + '" class="w3-select w3-border input-display trade-types">';
    editSwingForm += '</select>';
    editSwingForm += '<div id="swing_trade_type-' + tempId + '_error" class="noerror" ></div>';
    editSwingForm += '</div>';

    editSwingForm += '</div>';

    editSwingForm += '<div class="w3-row">';

    editSwingForm += '<div id="swing_type_display" class="w3-half" style="padding:10px 0 10px 0px;">';

    editSwingForm += '<label style="margin:0;">Swing Time<span class="required-label"<span>*</span></label>';
    editSwingForm += '<div style="margin:0;">';
    editSwingForm += '<input id="day_shift-' + tempId + '" name="shift_time-' + tempId + '" class="w3-radio input-display" type="radio" value="D">';
    editSwingForm += '<label style="margin-left:5px;font-weight:normal;">Day</label>';
    editSwingForm += '<input id="night_shift-' + tempId + '" name="shift_time-' + tempId + '" class="w3-radio" type="radio" value="N" style="margin-left:10px;">';
    editSwingForm += '<label style="margin-left:5px;font-weight:normal;">Night</label>';
    editSwingForm += '</div>';
    editSwingForm += '</div>';//ITEM

    editSwingForm += '<div class="w3-quarter" style="padding:0 10px 10px 0;">';
    editSwingForm += '<label>Recur (Days)<span class="required-label">*</span></label>';
    editSwingForm += '<input name="swing_recurrence-' + tempId + '" id="swing_recurrence-' + tempId + '" class="w3-input w3-border input-display" type="text">';
    editSwingForm += '<div id="swing_recurrence-' + tempId + '_error" class="noerror" ></div>';
    editSwingForm += '</div>';//ITEM

    editSwingForm += '</div>';//ROW

    editSwingForm += '</div>';//SWING ID CONTAINER

    editSwingForm += '</div>';//SWING TEMPLATES CONTAINER

    editSwingForm += '</form>';

    editSwingForm += '<div id="template-actions">';

    var reqId = localStorage.getItem('current-request');
    
    editSwingForm += '<div class="w3-center" style="margin-top:25px;">';
    editSwingForm += '<button id="cancel-save-swing-update-' + reqId + '-' + swingId + '" class="w3-button w3-padding-medium w3-darkblue w3-margin-bottom" style="margin:0 0 0 10px;">Cancel</button>';
    editSwingForm += '<button id="delete-swing-update-' + reqId + '-' + swingId + '" class="w3-button w3-padding-medium w3-darkblue w3-margin-bottom" style="margin:0 0 0 10px;">Delete Swing</button>';
    editSwingForm += '<button id="save-swing-update" class="w3-button w3-padding-medium w3-darkblue w3-margin-bottom" style="margin:0 0 0 10px;">Update Swing</button>';

    editSwingForm += '</div>';

    editSwingForm += '</div>';

    editSwingForm += '</div>';//CONTAINER

    $("#sidebar-right").html("");

    $("#sidebar-right").append(editSwingForm);

    $("#day_shift-" + tempId).prop('checked',true);
    $("#night_shift-" + tempId).prop('checked',false);

    $("#swing-conflict-management").prop('checked',false);

    //var reqId = 10;

    $.ajax({
        url: '/requests',
        type: "get",
    }).done(function (response) {
        console.log("REQUESTS: ", response);
        var requests = response.requests;
        var swingRequests = '<option value="NA">Select a Request</option>';

        for (var r = 0; r < requests.length; r++) {
            thisReqId = requests[r]['ws_id'];
            
            console.log("THIS REQ ID______",thisReqId);
            console.log("REQ ID______",reqId);
            
            if(reqId == thisReqId){
                var selectedReq = 'selected="selected"';
            } else {
                var selectedReq = '';
            }
            swingRequests += '<option value="' + thisReqId + '" ' +  selectedReq + '>' + thisReqId + '</option>';
        }

        console.log("SET REQUESTS_____", swingRequests);

        $("#swing_request-" + tempId).html("");
        $("#swing_request-" + tempId).append(swingRequests);

        setEditSwingDetails(reqId, tempId, swingId, swingRequests);
        
    });
    
}

function sidebarShiftAction(thisId){

    var sidebarContent = thisId.split('-').pop();

    console.log("SBS", sidebarContent);

    var sidebarCheckArray = sidebarContent.split('_');

    console.log("SBS ARR: ", sidebarCheckArray);

    var sideBarCheck = sidebarCheckArray[0];

    console.log("SBS CHECK: ", sideBarCheck);

    if(sideBarCheck == 'edit'){    
        
        var param = sidebarCheckArray[1];
        console.log("EDIT SHIFT: ", param);

        document.getElementById("request-swing-details-modal").style.display = "none";

        var isClose = document.getElementById("sidebar-right").style.width === "500px";
        
        if (!isClose) {
            $("#sidebar-right").css({"width": "500px"});
            actionQuote(param);
    
        } else {
            $("#sidebar-right").css({"width": "0px"});
        }

        editSwingDetails(param);
        
        //updateRequest('update', param);

        //CLOSE MODAL
        //request-swing-details-modal

        //open side bar right

    } else if(sideBarCheck == 'schedule'){
        
        var param = sidebarCheckArray[1];
        //console.log("SCHEDULE! ", param);

        var shiftDets = getShiftDets(param);
        //console.log("THE SHIFT DETS: ", shiftDets);

        var reqId = shiftDets.req;
        var reqDets = getReqDets(reqId);
        console.log("THE REQ DETS: ", reqDets);

        //MODIFIED
        
        var modifiedTradesArray = {};
        
        var tradesArray = reqDets.ws_trades_array;

        for (var t = 0; t < tradesArray.length; t++) {
            thisTrade = tradesArray[t]['type']
            modifiedTradesArray[t] = thisTrade

        }

        console.log("MODIFED TRADES ARRAY:", modifiedTradesArray);

        var filterForm = {            
            'trades': modifiedTradesArray 
        };
            
        $.ajax({
            url: '/workspace/filter',
            type: "GET",
            data: filterForm,
            success: function (response) {
                console.log(response);

                var resources = response;
                //console.log("WORKSPACE FILTER: ", resources.length);

                var rawStartDate = reqDets.ws_start_date;
                
                var customStartDateArray = rawStartDate.split("-");
                var customStartDate = customStartDateArray[2] + "-" + customStartDateArray[1]+ "-" + customStartDateArray[0];
                //console.log("CSD: ", customStartDate);

                var rawEndDate = reqDets.ws_end_date;

                localStorage.setItem('custom-scheduler-start',customStartDate);
                localStorage.setItem('custom-scheduler-end',rawEndDate);
                localStorage.setItem('current-scheduler-view', 'Custom');
                //SET CUSTOM DAYS
                calculateCustomDays(rawStartDate, rawEndDate);

                if (resources.length > 0) {
                    setResources(resources);
                    //alert("SET RESOURCES")
                } else {
                    alert("No Matches Found")
                }
            }
        });
        
    } else if(sideBarCheck == 'availability'){
        
        var param = sidebarCheckArray[1];
        console.log("CHECK PARAM! ", param);

        $("#swing-availability-modal-display").html("");


        var spinHtml = '<div class="busy-indicator">';
        spinHtml += '<div>';
        spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
        spinHtml += '</div>';
        spinHtml += '</div>';

        $("#swing-availability-modal-display").append(spinHtml);

        document.getElementById("swing-availability-modal").style.display = "block";

        $.ajax({
            url: '/bookings/availability',
            type: "GET",
            data: {
                "shift": param
            },
            success: function (response) {
                console.log(response);

                var availability = response;
                console.log("WORKSPACE AVAILABILITY: ", availability);
                
                //BUILD THE DISPLAY
                
                var swingAvailability = "";
                
                swingAvailability += '<div id="swing-availability-modal-container" style="margin:10px 0 20px 0;">';
                swingAvailability += '<table id="workspace-shifts-table" class="w3-striped w3-bordered w3-hoverable" style="table-layout:auto;width:100%;border-collapse:collapse;">';
                swingAvailability += '<thead>';
                swingAvailability += '<tr class="w3-darkblue">';
                swingAvailability += '<th>&nbsp;</th>';
                swingAvailability += '<th>Employee</th>';
                swingAvailability += '<th>Trades</th>';
                swingAvailability += '<th>% Available</th>';
                swingAvailability += '<th>Action</th>';
                swingAvailability += '</thead>';
                swingAvailability += '<tbody>';

                console.log("AVAIL LENGTH: ", availability.length);

                for (var a = 0; a < availability.length; a++) {
                
                    var swingEmployeeId = availability[a]['emp'];    
                    var swingEmployeeName = availability[a]['name'];
                    var swingEmployeeTrades = availability[a]['trades'];
                    var swingAvailDisplay = availability[a]['available'];
                    //var swingRatio = availability[a]['ratio'];

                    swingAvailability += '<tr>';
                    swingAvailability += '<td><input class="shift-selection" id="schedule_shift_' + param + '_' + swingEmployeeId + '" style="top:1px;" name="schedule_shifts" class="w3-radio" type="radio" value="Y"></td>';
                    swingAvailability += '<td>' + swingEmployeeName + '</td>';
                    swingAvailability += '<td>' + swingEmployeeTrades + '</td>';
                    swingAvailability += '<td>' + swingAvailDisplay + '</td>';
                    swingAvailability += '<td>Action</td>';
                    swingAvailability += '<tr>';

                }
                
                swingAvailability += '</tbody>';
                swingAvailability += '<table>';

                $("#swing-availability-modal-display").html("");

                $("#swing-availability-modal-display").append(swingAvailability);

                //SHOW THE MODAL
                //document.getElementById("swing-availability-modal").style.display = "block";

            }
        });

    } else if(sideBarCheck == 'uploadTravel'){ 
    
        console.log("UPLOAD TRAVEL");

        var param = sidebarCheckArray[1];
        console.log("CHECK PARAM! ", param);
        
        document.getElementById("request-swing-details-modal").style.display = "none";

        //var reqId = 1;
        //var bookingId = 1;

        var isClose = document.getElementById("sidebar-right").style.width === "500px";

        if (!isClose) {

            $("#sidebar-right").css({"width": "500px"});
            //param = swing
            uploadTravel(param);

        } else {

            if (currentRightSidebar != sidebarRightContent) {
                setSidebarContent(sidebarContent)
            } else {
                $("#sidebar-right").css({"width": "0px"});
                //localStorage.removeItem('right-sidebar-content');
            }

        }
    
    } else if(sideBarCheck == 'notify'){  

        $("#show-spinner-modal-display").html("");
        
        var spinHtml = '<div class="busy-indicator" style="height:100px;">';
        spinHtml += '<div style="margin-top:20px;">';
        spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
        spinHtml += '</div>';
        spinHtml += '</div>';

        $("#show-spinner-modal-display").append(spinHtml);
        
        document.getElementById("show-spinner-modal").style.display = "block";
        
        var param = sidebarCheckArray[1];
        
        //alert("NOTIFY: " + param);

        var shiftId = param;

        //VIEW NOTIFY

        var shiftDets = getShiftDets(shiftId);
        var shiftStartDate = shiftDets['start_format'];
        var shiftAmPm = shiftDets['ampm'];

        console.log("SHIFT DETS: ", shiftDets);

        var reqId = shiftDets['req'];
        var reqDets = getReqDets(reqId);
        var shiftSite = reqDets['ws_site_desc'];

        console.log("REQ DETS: ", reqDets);

        var empId = shiftDets.emp;
    
        var empDets = getEmpDets(empId);
        
        console.log("EMP DETS: ", empDets);

        var msgToken = empDets.employee.emp_fcm_token;

        console.log("TOKEN: ",msgToken);

        var messageTitle = 'NEW SWING NOTIFICATION';
        var messageBody = 'You have been scheduled to a new Swing starting ' + shiftStartDate + ' ' + shiftAmPm + ' at ' + shiftSite + ' - Click Arrow for Details';

        sendNotification(reqId, shiftId, empId, msgToken, messageTitle, messageBody);
    } 
        
}

function updateMessageDelivery(msgResult, ShiftId){

    var updateData = '';
    
    $.ajax({
        url: '/bkg/update',
        type: "POST",
        data: {
            'MessageDelivered' : msgResult,
            'ShiftId' :ShiftId 
        },
        async: false,
        success: function (response) {
            console.log("UPDATE RES" , response);
            updateData = response;
        }
    });

    return updateData;

}

function getReqDets(reqId){

    var reqData = '';
    
    $.ajax({
        url: '/request/' + reqId,
        type: "GET",
        async: false,
        success: function (response) {
            //console.log("REQ DETS" , response);
            reqData = response;
        }
    });

    return reqData;

}

function getShiftDets(shift){

    var shiftData = '';
    
    $.ajax({
        url: '/bkgs/shift/' + shift,
        type: "GET",
        async: false,
        success: function (response) {
            //console.log("SHIFT DETS" , response);
            shiftData = response;
        }
    });

    return shiftData;

}

function getEmpDets(recipient){

    var empData = '';
    
    $.ajax({
        url: '/employee/' + recipient,
        type: "GET",
        async: false,
        success: function (response) {
            console.log("SHIFT DETS" , response);
            empData = response;
        }
    });

    return empData;

}

function sendNotification(reqId, shiftId, empId, msgToken, messageTitle, messageBody){

    //BUILD THE FCM PAYLOAD

    var fcmPayload = {};
    
    fcmPayload['fcm_api_key'] = 'AAAAYvL6Qlo:APA91bFpdngfedK164jvGmhxD9a0oU3yGADshblqNIWkd_OB0VqsYo7-Kf32H5jmG7Td8rEx4ZwfLoY1sULR2GUcclfBEsBM07YBUP1qa1Uonm6s6e3d78HROtSPf_I2XI72Wvse8UMi';
    fcmPayload['fcm_token'] = msgToken;
    fcmPayload['msg_title'] = messageTitle;
    fcmPayload['msg_body'] = messageBody;
    fcmPayload['msg_shift'] = shiftId;

    //console.log("FCM: ", fcmPayload);

    var formDetails = {};

    formDetails.emp_fcm_token = msgToken;
    formDetails.message_shift = shiftId;
    formDetails.message_to = empId;
    formDetails.message_title = messageTitle;
    formDetails.message_body = messageBody;
    formDetails.message_type = 'S';

    var sender = $("#current-user").val();

    formDetails.message_from = sender;

    $.ajax({
        url: '/fcm/notify',
        type: "POST",
        data: {
            "form": formDetails
        },
        success: function (response) {
            console.log(response);

            sendMessage(fcmPayload, empId, reqId);
        }
    });
}

function sendMessage(fcmPayload, empId, reqId){

    //console.log("SEND PAYLOAD: ", fcmPayload);
    
    var apiKey = 'key=' + fcmPayload['fcm_api_key'];
    console.log("API KEY: ", apiKey);
    var messageTo = fcmPayload['fcm_token']
    console.log("MSG TO: ", messageTo);
    var title = fcmPayload['msg_title'];
    var body = fcmPayload['msg_body'];
    var shiftId = fcmPayload['msg_shift'];

    if(messageTo == null){
        alert("Notification could not be sent. Check that Employee has initialised the Mobile App by logging in.");
        var msgUpdate = updateMessageDelivery('N', shiftId);
        console.log("MESSAGE UPDATE: ", msgUpdate);

        document.getElementById("show-spinner-modal").style.display = "none";

    } else {

        $.ajax({
            type: 'POST',
            url: "https://fcm.googleapis.com/fcm/send",
            headers: {
                Authorization: apiKey
            },
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                "to": messageTo,
                "priority": "high",
                "data": {
                    "click_action": "FLUTTER_NOTIFICATION_CLICK",
                    "id" : 1,
                    "status" : "bla",
                    "screen" : "shift_messages"
                },
                "notification": {
                    "title": title,
                    "body": body
                }
            }),
            success: function(responseData) {
                console.log("SUCCESS", responseData);

                if(responseData.success == 1){
                    
                    alert("Notification successfully sent!");

                    var msgUpdate = updateMessageDelivery('Y', shiftId);

                    console.log("MESSAGE UPDATE: ", msgUpdate);

                    document.getElementById("show-spinner-modal").style.display = "none";

                    //UPDATE THE DELIVERY
                    //CHECK NOTIFIED
                    //'shift_row_EMPID_SHIFT'

                    var propUpdate = "shift_emp_nofified_" + empId + "_" + shiftId;
                    console.log("PROP UPDATE: ", propUpdate);

                    //shift_emp_nofified_1_19
                    //shift_emp_notified_1_19

                    $("#shift_emp_nofified_" + empId + "_" + shiftId).prop("readonly", false);
                    $("#shift_emp_nofified_" + empId + "_" + shiftId).prop("checked", true);
                    $("#shift_emp_nofified_" + empId + "_" + shiftId).prop("readonly", true);

                } else {
                    alert("Notification could not be sent, please try again.");
                    var msgUpdate = updateMessageDelivery('N', shiftId);

                    console.log("MESSAGE UPDATE: ", msgUpdate);
                    document.getElementById("show-spinner-modal").style.display = "none";
                }   

            },
            error: function(jqXhr, textStatus, errorThrown) {
                console.log("Status: " + textStatus + "\nError: " + errorThrown);
            }
        });

    }

}

/* function setSidebarRightContent(currentRightSidebar){

    $("#sidebar-right").html("");

    var thisId = currentRightSidebar;
    var sidebarContent = thisId.split('_');

    console.log("SBCA: ", sidebarContent);

    var action = sidebarContent[0];
    var param = sidebarContent[1];

    console.log("PAR: ", param);

    if (action == 'add') {

        updateRequest('add', 'na');

    } else if (action == 'edit') {

        console.log("PARAM1:", param);

        updateRequest('update', param);
    
    } else if (action == 'updateSwings') {

        //alert("SHIFTS PARAM1:", param);

        localStorage.setItem('current-request',param);
        
        actionUpdateSwings(param);   

    } else if (action == 'email') {

        console.log("PARAME:", param);

        actionEmail(param);

    } else if (action == 'pdf') {

        console.log("PARAM2:", param);

        actionPdf(param);

    } else if (action == 'view') {

        console.log("PARAMV:", param);

        actionView(param);

    } else if (action == 'quote') {

        console.log("PARAM:", param);

        actionQuote(param);

    } else {

        var sbCont = "<div>Other</div>";
        $("#sidebar-right").append(sbCont);
    }

} */


$("body").on('click','#cancel-swing-availability', function (e) {
    
    e.preventDefault();

    document.getElementById('swing-availability-modal').style.display='none';
});

$("#sidebar-right").on('click','.cancel-request-update', function (e) {

    e.preventDefault();

    $("#sidebar-right").css({"width": "0px"});
});

$("#sidebar-right").on('click','#cancel-pdf-generate', function (e) {

    e.preventDefault();

    var param = $("#action_request").val();

    actionPdf(param);

});

$("#sidebar-right").on('click','[id^=cancel-upload-travel]', function (e) {

    //CANCEL TRAVEL
    
    e.preventDefault();
    
    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var shift = paramsArr[3];

    var param = localStorage.getItem('current-request');

    console.log("CANCEL REQ: ", param);

    //var param = $("#request").val();

    $.ajax({
        url: '/shifts/request/' + param,
        type: "GET"
    }).done(function (response) {

        console.log("SHIFT DETAILS: ", response);
        var shifts = response;
        
        $("#sidebar-right").css({"width": "0px"});

        viewShifts(param, shifts);
        
    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    });

});


$("#sidebar-right").on('click','#cancel-pdf-view', function (e) {

    e.preventDefault();

    var param = $("#request").val();

    actionPdf(param);

});

////
$("#sidebar-right").on('click','[id^=cancel-view-travel-pdfs]', function (e) {

    //CANCEL TRAVEL
    
    e.preventDefault();
    
    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("_");
    var swing = paramsArr[1];

    //var param = localStorage.getItem('current-request');

    console.log("CANCEL VIEW TRAVEL: ", swing);

    getWorkspace('requests',1);
    
    //var param = $("#request").val();
    uploadTravel(swing);

    //FIXING TRAVEL
    
});

$("#sidebar-right").on('change','[id^=ws_trade_rate]', function (e) {
    var paramDets = $(this).attr('id');
    console.log("PD: ", paramDets);
    var paramsArr = paramDets.split("_");
    console.log(paramsArr);
    var itemId = paramsArr[3];
    //alert("CHANGED: " + itemId);
    
    var tradeTypeSelected = $("#ws_trade_type_" + itemId).val();
    var tradeRateSelected = $("#ws_trade_rate_" + itemId).val();
    
    if(tradeRateSelected != 'N' && tradeTypeSelected != 'N'){
        $("#ws_trade_num_" + itemId).prop("disabled", false);
        $("#ws_trade_num_" + itemId).removeClass('input-disabled');
        $("#ws_trade_num_" + itemId).addClass('input-display');
    } else {
        $("#ws_trade_num_" + itemId).prop("disabled", true);
        $("#ws_trade_num_" + itemId).addClass('input-disabled');
        $("#ws_trade_num_" + itemId).removeClass('input-display');
        $("#ws_trade_num_" + itemId).val("");
    }

});    

$("#sidebar-right").on('click','#save-request-update', function (e) {

    e.preventDefault();

    $("#update-request-form").find("div.error").removeClass('error').addClass("noerror");
    $("#update-request-form").find("input.required").removeClass('required');
    $("#update-request-form").find("select.required").removeClass('required');

    var errCount = 0;
    var errMsgArray = [];
    
    if($("#ws_date").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'ws_date',
            "msg": 'A Request Date must be provided'
        });
    }

    if($("#ws_start_date").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'ws_start_date',
            "msg": 'A Request Start Date must be provided'
        });
    }

    if($("#ws_end_date").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'ws_end_date',
            "msg": 'A Request End Date must be provided'
        });
    }

    if($("#ws_cust_contact").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'ws_cust_contact',
            "msg": 'A Requester Name must be provided'
        });
    }

    if($("#ws_cust_contact_email").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'ws_cust_contact_email',
            "msg": 'A Requester Email must be provided'
        });
    }

    if($("#ws_cust_contact_phone").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'ws_cust_contact_phone',
            "msg": 'A Requester Phone Num must be provided'
        });
    }

    if($("#ws_customer_name").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'ws_customer_name',
            "msg": 'A Customer Name must be provided'
        });
    }

    if($("#ws_site_dept").val() == 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'ws_site_dept',
            "msg": 'A Site/Dept must be selected'
        });
    }

    var tradeType1 = parseInt($('#ws_trade_type_1').find(":selected").val());
    var tradeType2 = parseInt($('#ws_trade_type_2').find(":selected").val());
    var tradeType3 = parseInt($('#ws_trade_type_3').find(":selected").val());
    var tradeType4 = parseInt($('#ws_trade_type_4').find(":selected").val());
    var tradeType5 = parseInt($('#ws_trade_type_5').find(":selected").val());
    var tradeType6 = parseInt($('#ws_trade_type_6').find(":selected").val());

    if($("#ws_trade_type_1").val() == 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'ws_trade_type_1',
            "msg": 'At least one Trade Type must be selected'
        });
    }

    if($("#ws_trade_type_1").val() != 'N') {

        console.log("ERR 1");

        var tradeType1Sel = parseInt($("#ws_trade_type_1").val());

        if (tradeType1Sel == tradeType2 || 
            tradeType1Sel == tradeType3 || 
            tradeType1Sel == tradeType4 || 
            tradeType1Sel == tradeType5 || 
            tradeType1Sel == tradeType6) 
          {

            console.log("COUNT ERROR 1");

            errCount++;
            errMsgArray.push({
                "id": 'ws_trade_type_1',
                "msg": 'Trade Type has already been selected'
            });
        }

    }

    if($("#ws_trade_rate_1").val() == 'N' && $("#ws_trade_type_1").val() != 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'ws_trade_rate_1',
            "msg": 'At Trade Rate must be selected for Trade Type 1'
        });
    }

    if($("#ws_trade_num_1").val().length == 0 && $("#ws_trade_type_1").val() != 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'ws_trade_num_1',
            "msg": 'A Number of the Trade Type 1 must be entered.'
        });
    }

    //console.log("TRADE TYPE 1: ", tradeType1);
    //console.log("TRADE TYPE 2: ", parseInt($("#ws_trade_type_2").val()));

    if($("#ws_trade_type_2").val() != 'N') {

        console.log("ERR 2");

        var tradeType2Sel = parseInt($("#ws_trade_type_2").val());

        if (tradeType2Sel == tradeType1 || 
            tradeType2Sel == tradeType3 || 
            tradeType2Sel == tradeType4 || 
            tradeType2Sel == tradeType5 || 
            tradeType2Sel == tradeType6) 
          {

            console.log("COUNT ERROR 2");

            errCount++;
            errMsgArray.push({
                "id": 'ws_trade_type_2',
                "msg": 'Trade Type has already been selected'
            });
        }
    }

    if($("#ws_trade_rate_2").val() == 'N' && $("#ws_trade_type_2").val() != 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'ws_trade_rate_2',
            "msg": 'At Trade Rate must be selected for Trade Type 2'
        });
    }

    if($("#ws_trade_num_2").val().length == 0 && $("#ws_trade_type_2").val() != 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'ws_trade_num_2',
            "msg": 'A Number of the Trade Type 2 must be entered.'
        });
    }

    if($("#ws_trade_type_3").val() != 'N') {

        console.log("ERR 3");

        var tradeType3Sel = parseInt($("#ws_trade_type_3").val());

        if (tradeType3Sel == tradeType1 || 
            tradeType3Sel == tradeType2 || 
            tradeType3Sel == tradeType4 || 
            tradeType3Sel == tradeType5 || 
            tradeType3Sel == tradeType6) 
          {

            console.log("COUNT ERROR 3");

            errCount++;
            errMsgArray.push({
                "id": 'ws_trade_type_3',
                "msg": 'Trade Type has already been selected'
            });
        }

    }

    if($("#ws_trade_rate_3").val() == 'N' && $("#ws_trade_type_3").val() != 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'ws_trade_rate_3',
            "msg": 'At Trade Rate must be selected for Trade Type 3'
        });
    }

    if($("#ws_trade_num_3").val().length == 0 && $("#ws_trade_type_3").val() != 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'ws_trade_num_3',
            "msg": 'A Number of the Trade Type 3 must be entered.'
        });
    }

    if($("#ws_trade_type_4").val() != 'N') {

        console.log("ERR 4");

        var tradeType4Sel = parseInt($("#ws_trade_type_4").val());

        if (tradeType4Sel == tradeType1 || 
            tradeType4Sel == tradeType2 || 
            tradeType4Sel == tradeType3 || 
            tradeType4Sel == tradeType5 || 
            tradeType4Sel == tradeType6) 
          {

            console.log("COUNT ERROR 4");

            errCount++;
            errMsgArray.push({
                "id": 'ws_trade_type_4',
                "msg": 'Trade Type has already been selected'
            });
        }

    }

    if($("#ws_trade_rate_4").val() == 'N' && $("#ws_trade_type_4").val() != 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'ws_trade_rate_4',
            "msg": 'At Trade Rate must be selected for Trade Type 4'
        });
    }

    if($("#ws_trade_num_4").val().length == 0 && $("#ws_trade_type_4").val() != 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'ws_trade_num_4',
            "msg": 'A Number of the Trade Type 4 must be entered.'
        });
    }

    if($("#ws_trade_type_5").val() != 'N') {

        console.log("ERR 5");

        var tradeType5Sel = parseInt($("#ws_trade_type_5").val());

        if (tradeType5Sel == tradeType1 || 
            tradeType5Sel == tradeType2 || 
            tradeType5Sel == tradeType3 || 
            tradeType5Sel == tradeType4 || 
            tradeType5Sel == tradeType6) 
          {
            console.log("COUNT ERROR 5");

            errCount++;
            errMsgArray.push({
                "id": 'ws_trade_type_5',
                "msg": 'Trade Type has already been selected'
            });
        }

    }

    if($("#ws_trade_rate_5").val() == 'N' && $("#ws_trade_type_5").val() != 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'ws_trade_rate_5',
            "msg": 'At Trade Rate must be selected for Trade Type 5'
        });
    }

    if($("#ws_trade_num_5").val().length == 0 && $("#ws_trade_type_5").val() != 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'ws_trade_num_5',
            "msg": 'A Number of the Trade Type 5 must be entered.'
        });
    }

    if($("#ws_trade_type_6").val() != 'N') {

        console.log("ERR 6");

        var tradeType6Sel = parseInt($("#ws_trade_type_6").val());

        if (tradeType6Sel == tradeType1 || 
            tradeType6Sel == tradeType2 || 
            tradeType6Sel == tradeType3 || 
            tradeType6Sel == tradeType4 || 
            tradeType6Sel == tradeType5) 
          {

            console.log("COUNT ERROR 6");

            errCount++;
            errMsgArray.push({
                "id": 'ws_trade_type_6',
                "msg": 'Trade Type has already been selected'
            });
        }

    }

    if($("#ws_trade_rate_6").val() == 'N' && $("#ws_trade_type_6").val() != 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'ws_trade_rate_6',
            "msg": 'At Trade Rate must be selected for Trade Type 6'
        });
    }

    if($("#ws_trade_num_6").val().length == 0 && $("#ws_trade_type_6").val() != 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'ws_trade_num_6',
            "msg": 'A Number of the Trade Type 6 must be entered.'
        });
    }

    if($("#ws_comments").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'ws_comments',
            "msg": 'Comments must be provided'
        });
    }

    if($("#ws_mobiliser").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'ws_mobiliser',
            "msg": 'A Mobiliser Name must be provided'
        });
    }

    if(errCount > 0){

        console.log("ERRORS: ", errMsgArray);

        for (var e = 0; e < errMsgArray.length; e++) {

            var errorId = errMsgArray[e]['id'];
            var errorMsg = errMsgArray[e]['msg'];

            $("#" + errorId).addClass('required');
            $("#" + errorId + "_error").removeClass('noerror');
            $("#" + errorId + "_error").addClass('error');
            $("#" + errorId + "_error").html(errorMsg);

        }

        alert("There are errors to be corrected before Request can be updated.")

    } else {
        
         var wsId = $("#ws_id").val();

         if(wsId.length > 0) {
             var updateUrl = '/request/' + wsId;
             var successMsg = "Request was successfully updated";
         } else {
             var updateUrl = '/request';
             var successMsg = "Request was successfully added";
         }

         var requestForm = $("#update-request-form").serialize();

         $.ajax({
             url: updateUrl,
             type: "POST",
             data: {
             "form": requestForm
             },
             success: function (response) {
                 //console.log(response);
                 alert(successMsg);
                 $("#sidebar-right").css({"width": "0px"});
                 localStorage.removeItem('right-sidebar-content');
                 getWorkspace('requests',1);
             }
         });
    }
});

$("#sidebar-left").on('click','#sidebar-left-add-skill', function (e) {

    e.preventDefault();

    updateSkill("");

});


$(document).on('focus',".timepicker", function(){
    $(this).timepicker({
        showPeriod: true,
        showPeriodLabels: true,
        showCloseButton: true,
        closeButtonText: 'x',
        amPmText: ['AM', 'PM'],
        showLeadingZero: true
    });
});

$(document).on('focus',".datepicker", function(){
    $(this).datepicker({
        dateFormat: 'dd-mm-yy',
        autoclose: true,
        showButtonPanel: true,
        closeText: "x",
        onSelect: function(dateText, inst) {
            var this_id = $(this).prop("id");
            $(this).prop("readonly", false);
            $(this).prop('value', dateText);
        },
        onClose: function(dateText, inst) {
            $(this).prop("readonly", true);
        },
        beforeShow: function(input, inst) {
            $(this).prop("readonly", true);
        }
    });
});

$(document).on('focus',"#ws_start_date", function() {

    $(this).datepicker({
        dateFormat: 'dd-mm-yy',
        closeText: "X",
        showButtonPanel: true,
        /* beforeShowDay: function (date) {
            return [(date <= ($("#ws_end_date").datepicker("getDate")
            || new Date()))];
        } */
    });

});

$(document).on('focus',"#ws_end_date", function() {

    $(this).datepicker({

        dateFormat: 'dd-mm-yy',
        closeText: "X",
        showButtonPanel: true,
        beforeShowDay: function(date) {
            return [(date >= ($("#ws_start_date").datepicker("getDate")
            || new Date()))];
        }
    });
});

function getCustomerByName(cust){

    $.ajax({
        url: '/customer/name',
        type: "GET",
        async: false,
        data: {
            "name" : cust
        },
        success: function (response) {
            console.log("RESP: ", response.cust_id);
            var custId = response.cust_id;
            $("#ws_customer").val(custId);

            $.ajax({
                url: '/customer/sites/' + custId,
                type: "GET",
                success: function (response) {
                    var sites = response;
                    console.log("SITES: ", sites);

                    $("#ws_site_dept").html("");

                    var siteOptions = '<option value="N">Select a Site</option>';

                    for (var s = 0; s < sites.length; s++) {

                        var siteDesc = sites[s]['site_desc'];
                        var siteCode = sites[s]['site_code'];

                        siteOptions += '<option value="' + siteCode + '">' + siteDesc + '</option>';
                    }

                    $("#ws_site_dept_display").css({"display" : "block"});

                    $("#ws_site_dept").append(siteOptions);

                    $("#ws_site_dept").val("N");
                }
            });
        }
    });

    //ADDED TODAY
}

$('#ws_customer_name').attr('autocomplete','on');

$('body').on('click', '#ws_customer_name', function() {

    $(this).autocomplete({
        source: function(request, response) {
            $.ajax({
                url: 'customers/auto',
                dataType: "json",
                data: {
                    term : request.term
                },
                success: function(data) {
                    response(data);
                }
            });
        },
        minLength: 3,
        delay: 10,
        search: function(){
            $(this).addClass('ui-autocomplete-loading');
        },
        open: function(){$(this).removeClass('ui-autocomplete-loading');},
        select: function(event, ui) {
            console.log("UI: ", ui.item.value);
            getCustomerByName(ui.item.value)
        }
    });
});

function on_error(e) {
    console.log("ERROR: ", e);  // eslint-disable-line no-console
    //var div = document.createElement('div');
    //div.appendChild(document.createTextNode(e.message));
    //document.querySelector('.error').appendChild(div);
}

function arrayBufferToBase64( buffer ) {
    var binary = '';
    //var bytes = new Uint8Array( buffer );
    var len = buffer.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( buffer[ i ] );
    }
    return window.btoa( binary );
}

function on_file(request,pdfType, filename, buf, emp, firstDepDate, siteCode, fields) {

    console.log("REQ: ", request);
    console.log("TYPE: ", pdfType);
    console.log("FIELDS2: ", fields);
    console.log("FN: ", filename);
    console.log("BUFF: ", buf);
    console.log("EMPLOYEE: ", emp);
    console.log("DEP DATE: ", firstDepDate);
    console.log("SITE CODE: ", siteCode);

    var pdf_buf = buf; // load PDF into an ArrayBuffer, for example via XHR (see demo)

    /*
    var fields = {
        'TravellerRow1': ['Allan Hyde'],
        'SAP Row1': ['123456'],
        'EmailRow1': ['allan.hyde@livepages.com.au'],
        'MobileRow1': ['0408702047'],
        'LeaderRow1': ['Leader Name'],
        'Flight Row1': ['AM'],
        'AirportOriginRow1': ['Perth'],
        'AirportDestinationRow1': ['Brockman 2'],
        'Departure dateRow1': ['20-01-2021'],
        'Departure timeRow1': ['06:00AM'],

        'AirportOriginRow2': [' '],
        'AirportDestinationRow2': [' '],
        'AirportOriginRow3': [' '],
        'AirportDestinationRow3': [' '],
        'AirportOriginRow4': [' '],
        'AirportDestinationRow4': [' '],
    };
    */

    var out_buf = pdfform().transform(pdf_buf, fields);

    console.log("OUPUT; ", out_buf);

    var blob = new Blob([out_buf], {type: 'application/pdf'});

    console.log("BLOB: ", blob);

    var base64 = arrayBufferToBase64(out_buf);

    console.log("B64: ", base64);

    $.ajax({
        url: '/pdf/save',
        type: "POST",
        data: {
            "req" : request,
            "type" : pdfType,
            "emp" : emp,
            "first_dep" : firstDepDate,
            "site_code" : siteCode,
            "file" : base64
        },
        async: false,
        success: function (response) {

            console.log("COMPLETED: ", response);

        }
    });
}

function createBlob(request,pdfType,url, emp, firstDepDate, siteCode, fields){

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function() {
        if (this.status == 200) {
            on_file(request,pdfType, url.split(/\//).pop(), this.response, emp, firstDepDate, siteCode, fields);
        } else {
            on_error('failed to load URL (code: ' + this.status + ')');
        }
    };

    xhr.send();
}

function transformPdf(request,pdfType, emp, firstDepDate, siteCode, fields){

    if (window.location.protocol === 'https:') {
        var url = "https://mob.readyresourcesapp.com.au/pdfs/" + pdfType + ".pdf";
    } else {
        var url = "http://rr.ttsite.com.au/pdfs/" + pdfType + ".pdf";
    }    
    
    createBlob(request, pdfType, url, emp, firstDepDate, siteCode, fields);
}

function getFields(req, pdfType){

    $.ajax({
        url: '/pdf/fields/' + req + "/" + pdfType,
        type: "GET",
        async: false,
        success: function (response) {

            //console.log("FETCH FIELDS: ",response);

            var fields = response;

            console.log("FIELDS: ", fields);

            var fieldsJson = JSON.stringify(fields);

            if(pdfType == 'CHF') {
                localStorage.setItem('pdf-chf-fields-array', fieldsJson);
            } else if(pdfType == 'SEF') {
                localStorage.setItem('pdf-sef-fields-array', fieldsJson);
            }

        }
    });

}

function getEmps(req) {
    $.ajax({
        url: '/request/' + req,
        type: "GET",
        async: false,
        success: function (response) {
            console.log("GET EMPS SET: ", response);
            localStorage.setItem('pdf-chf-emp-array', response.ws_pdf_chf);
            localStorage.setItem('pdf-sef_count', response.ws_count_sef_pdfs);
        }
    });
}

function onChange(e) {
    console.log("Change event :: value is " + e.value);
    localStorage.setItem('rio-pdf-item-count-test', e.value);
}

function onComplete(e) {
    document.getElementById("order-update-success").style.display = "none";
    console.log("Complete event :: value is " + e.value);
    var thisReq = localStorage.getItem('rio-pdf-request');

    actionPdf(thisReq);
    resetProgressBar()
}

function resetProgressBar(){
    $("#progressBar").html("");
}

function createRioPdfs(param) {

    //CREATE RIO

    var reqId = parseInt(localStorage.getItem('current-request'));

    //var param = reqId;

    console.log("CREATE RIO REQ_____________", param);
    
    localStorage.setItem('rio-pdf-request', param);

    //GET SITECODE

    var reqDets = getReqDets(param);
    //console.log("REQ DETS: ", reqDets);

    var siteCode = reqDets['ws_site_short_desc'];

    console.log("SITE CODE: ", siteCode);

    //GET THE EMPLOYEE ARRAY FROM THE REQUEST

    var pdfsSelected = [];
    pdfsSelected.push("CHF");
    pdfsSelected.push("SEF");

    /* $('#pdf-selection-form input:checkbox:checked').each(function () {
        pdfsSelected.push($(this).val());
    }); */

    console.log("PDF SELECTED: ",pdfsSelected);

    getEmps(param); //GET EMPS BY PDF TYPE
    var chfEmpJson = localStorage.getItem('pdf-chf-emp-array');

    var chfEmps = JSON.parse(chfEmpJson);
    console.log("CHF EMPS: ", chfEmps);
    console.log("CHF EMP LENGTH", chfEmps.length);

    var numChfItems = 0;

    for (var o = 0; o < chfEmps.length; o++) {

        var innerChfEmps = chfEmps[o];

        for (var i = 0; i < innerChfEmps.length; i++) {
            numChfItems++
        }
    }

    var numSefItems = localStorage.getItem('pdf-sef_count');

    var numItems = parseInt(numChfItems) + parseInt(numSefItems);

    console.log("NUM ITEMS: ",numItems);

    //var numItems = parseInt(pdfsSelected.length) * parseInt(chfEmps.length);

    $("#progressBar").kendoProgressBar({
        min: 0,
        max: numItems,
        type: "percent",
        change: onChange,
        complete: onComplete
    });

    //if(pdfsSelected.length > 0) {

        document.getElementById("order-update-success").style.display = "block";

        var pb = $("#progressBar").data("kendoProgressBar");
        pb.value(0);

        console.log("PB INIT: ", pb.value());

        for (var p = 0; p < pdfsSelected.length; p++) {

            console.log("TPDF: ", pdfsSelected[p]);
            console.log("LOOP: ", p);

            var pdf = pdfsSelected[p];

            //getEmps(param);

            //var chfEmpJson = localStorage.getItem('pdf-chf-emp-array');
            var chfEmps = JSON.parse(chfEmpJson);

            console.log("CHF EMPS: ", chfEmps);

            //console.log("REQ DETS: ", chfEmps[0]);

            getFields(param, pdf);

            if(pdf == 'CHF') {
                var formFieldsJson = localStorage.getItem('pdf-chf-fields-array');
            } else if(pdf == 'SEF') {
                var formFieldsJson = localStorage.getItem('pdf-sef-fields-array');
            }

            var formFields = JSON.parse(formFieldsJson);

            console.log("GET FIELDS: ", formFields);
            console.log("REQ PDF: ", pdf);
            console.log("RUN LOOP");

            for (var y = 0; y < chfEmps.length; y++) {

                var innerEmpArray = chfEmps[y];

                //INNER EMP ARRAY DETERMINES THE NUMBER OF PDFS TO BE GENERATED (NUM FIELDS)
                //MULTI PDFS ONLY APPLY TO SEF PDFS WHEN MORE THAN 4 SHIFTS

                console.log("INNER EMP: ", innerEmpArray);

                for (var i = 0; i < innerEmpArray.length; i++) {

                    var thisEmp = innerEmpArray[i];

                    for (var f = 0; f < formFields[thisEmp].length; f++) {

                        console.log("PB VAL BEFORE: ", pb.value());

                        pb.value(parseInt(pb.value()) + 1);
                        console.log("PB VAL AFTER: ", pb.value());

                        var thisField = formFields[thisEmp][f];

                        console.log("THIS", f);
                        console.log("THIS FIELD", thisField);

                        //IF PDF = SEF
                        //GET THE FIRST DEPARTURE DATE AND SITE FROM FORM FIELDS

                        if(pdf == 'SEF'){
                            firstDepDate = thisField['Departure dateRow1'][0];
                            console.log("DEP DATE 1: ", firstDepDate);
                            console.log("SITE CODE: ", siteCode);
                        } else {
                            firstDepDate = 'NA';
                        }
                        
                        transformPdf(param, pdf, thisEmp, firstDepDate, siteCode, thisField);

                    }
                }
            }
        }

    /* } else {
        alert("No PDF was selected to generate!");
    } */
}

$("#sidebar-right").on('click','[id^=create-pdf]', function (e) {

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[2];

    localStorage.setItem('rio-pdf-request', param);

    //GET SITECODE

    var reqDets = getReqDets(param);
    //console.log("REQ DETS: ", reqDets);

    var siteCode = reqDets['ws_site_short_desc'];

    console.log("SITE CODE: ", siteCode);

    //GET THE EMPLOYEE ARRAY FROM THE REQUEST

    var pdfsSelected = [];

    $('#pdf-selection-form input:checkbox:checked').each(function () {
        pdfsSelected.push($(this).val());
    });

    console.log("PDF SELECTED: ",pdfsSelected);

    getEmps(param); //GET EMPS BY PDF TYPE
    var chfEmpJson = localStorage.getItem('pdf-chf-emp-array');

    var chfEmps = JSON.parse(chfEmpJson);
    console.log("CHF EMPS: ", chfEmps);
    console.log("CHF EMP LENGTH", chfEmps.length);

    var numChfItems = 0;

    for (var o = 0; o < chfEmps.length; o++) {

        var innerChfEmps = chfEmps[o];

        for (var i = 0; i < innerChfEmps.length; i++) {
            numChfItems++
        }
    }

    var numSefItems = localStorage.getItem('pdf-sef_count');

    var numItems = parseInt(numChfItems) + parseInt(numSefItems);

    console.log("NUM ITEMS: ",numItems);

    //var numItems = parseInt(pdfsSelected.length) * parseInt(chfEmps.length);

    $("#progressBar").kendoProgressBar({
        min: 0,
        max: numItems,
        type: "percent",
        change: onChange,
        complete: onComplete
    });

    if(pdfsSelected.length > 0) {

        document.getElementById("order-update-success").style.display = "block";

        var pb = $("#progressBar").data("kendoProgressBar");
        pb.value(0);

        console.log("PB INIT: ", pb.value());

        for (var p = 0; p < pdfsSelected.length; p++) {

            console.log("TPDF: ", pdfsSelected[p]);
            console.log("LOOP: ", p);

            var pdf = pdfsSelected[p];

            //getEmps(param);

            //var chfEmpJson = localStorage.getItem('pdf-chf-emp-array');
            var chfEmps = JSON.parse(chfEmpJson);

            console.log("CHF EMPS: ", chfEmps);

            //console.log("REQ DETS: ", chfEmps[0]);

            getFields(param, pdf);

            if(pdf == 'CHF') {
                var formFieldsJson = localStorage.getItem('pdf-chf-fields-array');
            } else if(pdf == 'SEF') {
                var formFieldsJson = localStorage.getItem('pdf-sef-fields-array');
            }

            var formFields = JSON.parse(formFieldsJson);

            console.log("GET FIELDS: ", formFields);
            console.log("REQ PDF: ", pdf);
            console.log("RUN LOOP");

            for (var y = 0; y < chfEmps.length; y++) {

                var innerEmpArray = chfEmps[y];

                //INNER EMP ARRAY DETERMINES THE NUMBER OF PDFS TO BE GENERATED (NUM FIELDS)
                //MULTI PDFS ONLY APPLY TO SEF PDFS WHEN MORE THAN 4 SHIFTS

                console.log("INNER EMP: ", innerEmpArray);

                for (var i = 0; i < innerEmpArray.length; i++) {

                    var thisEmp = innerEmpArray[i];

                    for (var f = 0; f < formFields[thisEmp].length; f++) {

                        console.log("PB VAL BEFORE: ", pb.value());

                        pb.value(parseInt(pb.value()) + 1);
                        console.log("PB VAL AFTER: ", pb.value());

                        var thisField = formFields[thisEmp][f];

                        console.log("THIS", f);
                        console.log("THIS FIELD", thisField);

                        //IF PDF = SEF
                        //GET THE FIRST DEPARTURE DATE AND SITE FROM FORM FIELDS

                        if(pdf == 'SEF'){
                            firstDepDate = thisField['Departure dateRow1'][0];
                            console.log("DEP DATE 1: ", firstDepDate);
                            console.log("SITE CODE: ", siteCode);
                        } else {
                            firstDepDate = 'NA';
                        }
                        
                        transformPdf(param, pdf, thisEmp, firstDepDate, siteCode, thisField);

                    }
                }
            }
        }

    } else {
        alert("No PDF was selected to generate!");
    }
});

function actionPdf(param) {

    $("#sidebar-right").html("");

    var actionPdf = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    actionPdf += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Rio PDFs</div>';
    actionPdf += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    actionPdf += '</div>';
    actionPdf += '<div class="w3-center" style="margin-top:10px;">';
    actionPdf += '<button class="cancel-request-update w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    actionPdf += '<button id="generate-pdf-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Generate</button>';
    actionPdf += '<button id="view-pdf-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium">View</button>';
    actionPdf += '</div>';
    actionPdf += '</div>';

    $("#sidebar-right").append(actionPdf);
}

$("#sidebar-right").on('click','[id^=view-selected-pdf]', function (e) {

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[3];

    var clickedPdf = $('input[name="view-pdfs"]:checked').val();
    var pdfToView = "pdfs/completed/" + param + "_" + clickedPdf + ".pdf";

    window.open(pdfToView, "PopupWindow", "width=740,height=700,scrollbars=yes,resizable=yes");

});

$("#sidebar-right").on('click','[id^=generate-pdf]', function (e) {

    //SPLIT PARAM

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[2];

    $("#sidebar-right").html("");

    var createPdf = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    createPdf += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Rio PDFs</div>';
    createPdf += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    createPdf += '</div>';

    createPdf += '<form id="pdf-selection-form">';

    createPdf += '<div class="w3-row">';
    createPdf += '<div class="w3-third" style="padding:15px 10px 10px 15px;">';
    createPdf += '<input id="chf" name="chf" class="w3-check" type="checkbox" value="CHF">';
    createPdf += '<label style="margin-left:10px;font-weight:normal;">CHF</label>';
    createPdf += '</div>';

    createPdf += '<div class="w3-third" style="padding:15px 10px 10px 15px;">';
    createPdf += '<input id="sef" name="sef" class="w3-check" type="checkbox" value="SEF">';
    createPdf += '<label style="margin-left:10px;font-weight:normal;">SEF</label>';
    createPdf += '</div>';
    createPdf += '</div>';

    createPdf += '</form>';

    createPdf += '<div class="w3-center" style="margin-top:10px;">';
    createPdf += '<button id="cancel-pdf-generate" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    createPdf += '<button id="create-pdf-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Generate Selected PDF\'s</button>';

    createPdf += '</div>';

    createPdf += '</div>';

    $("#sidebar-right").append(createPdf);

});

$("#sidebar-right").on('click','[id^=view-rio-pdf]', function (e) {

    e.preventDefault();

    var paramDets = $(this).attr('id');

    console.log("PD: ", paramDets);

    var paramsArr = paramDets.split("~");
    var param = paramsArr[1];

    console.log("PDF TO VIEW: ", param);

    var pdfToView = "pdfs/completed/" + param + "#toolbar=0&navpanes=0&scrollbar=0";

    $("#workspace").html("");

    var viewQuote = '<div style="clear:both;"></div>';
    viewQuote += '<div style="margin-bottom:35px;border:0px solid green;">';
    viewQuote += '<div style="width:980px;margin: 0 0 0 80px;border:0px solid blue;">';

    viewQuote += '<embed id="pdf-quote-view"';
    viewQuote += ' src=""';
    viewQuote += ' type="application/pdf"';
    viewQuote += ' frameBorder="1"';
    viewQuote += ' scrolling="auto"';
    viewQuote += ' height="980px"';
    viewQuote += ' width="980px;"';
    viewQuote += '></embed>';

    viewQuote += '</div>';

    $("#workspace").append(viewQuote);

    $("#pdf-quote-view").prop("src",pdfToView)
    ;

    $("#work-space-header").html("");

    var workSpaceQuotePreviewHeader = '<h1 class="w3-xlarge w3-left"><b>Request Rio PDF</b></h1>';
    workSpaceQuotePreviewHeader += '<button id="workspace-view-requests" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin:0 0 10px 10px;">View Requests</button>';
    workSpaceQuotePreviewHeader += '<button id="workspace-view-rio-pdfs" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin-bottom:10px;">View Rio PDFs</button>';

    $("#work-space-header").append(workSpaceQuotePreviewHeader);

});

$("body").on('click','[id^=view-current-tdocs]', function (e) {

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("_");
    var param = paramsArr[1];

    var swing = localStorage.getItem('current-swing');

    var isClose = document.getElementById("sidebar-right").style.width === "500px";

    if (!isClose) {

        $("#sidebar-right").css({"width": "500px"});
        viewTravelDocs(swing);

    } else {
        $("#sidebar-right").css({"width": "0px"});
    }

});

$("#sidebar-right").on('click','[id^=view-tdoc-pdfs]', function (e) {

    //VIEW TRAVEL PDF
    
    e.preventDefault();

    var paramDets = $(this).attr('id');

    console.log("TD: ", paramDets);

    var paramsArr = paramDets.split("~");
    var param = paramsArr[1];

    console.log("DOC PDF TO VIEW: ", param);

    var docToView = "travel_docs/" + param + "#toolbar=0&navpanes=0&scrollbar=0";

    $("#workspace").html("");

    var viewDoc = '<div style="clear:both;"></div>';
    viewDoc += '<div style="margin-bottom:35px;border:0px solid green;">';
    viewDoc += '<div style="width:980px;margin: 0 0 0 80px;border:0px solid blue;">';

    viewDoc += '<embed id="pdf-quote-view"';
    viewDoc += ' src=""';
    viewDoc += ' type="application/pdf"';
    viewDoc += ' frameBorder="1"';
    viewDoc += ' scrolling="auto"';
    viewDoc += ' height="980px"';
    viewDoc += ' width="980px;"';
    viewDoc += '></embed>';

    viewDoc += '</div>';

    $("#workspace").append(viewDoc);

    $("#pdf-quote-view").prop("src",docToView);

    $("#work-space-header").html("");

    var workSpaceQuotePreviewHeader = '<h1 class="w3-xlarge w3-left"><b>Travel Document</b></h1>';
    workSpaceQuotePreviewHeader += '<button id="workspace-view-requests" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin:0 0 10px 10px;">View Requests</button>';
    workSpaceQuotePreviewHeader += '<button id="view-current-tdocs_' + param + '" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin-bottom:10px;">View Travel Docs</button>';

    $("#work-space-header").append(workSpaceQuotePreviewHeader);

});

$("body").on('click','#workspace-view-rio-pdfs', function (e) {

    var reqId = parseInt(localStorage.getItem('current-request'));

    var isClose = document.getElementById("sidebar-right").style.width === "500px";

    if (!isClose) {

        $("#sidebar-right").css({"width": "500px"});
        viewRioPdfs(reqId);

    } else {
        $("#sidebar-right").css({"width": "0px"});
    }

});

function viewRioPdfs(param){
    
    $("#sidebar-right").html("");
    
    var viewPdf = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    viewPdf += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Rio PDFs</div>';
    viewPdf += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    viewPdf += '</div>';

    viewPdf += '<div id="request-rio-pdfs" style="margin:15px 0 0 15px;"></div>'

    /*
    viewPdf += '<form id="pdf-selection-form">';

    viewPdf += '<input id="view_request" name="view_request" type="hidden" value="' + param + '">';

    viewPdf += '<div class="w3-row">';
    viewPdf += '<div class="w3-third" style="padding:15px 10px 10px 15px;">';
    viewPdf += '<input id="view-chf" name="view-pdfs" class="w3-radio" type="radio" value="chf">';
    viewPdf += '<label style="margin-left:10px;font-weight:normal;">CHF</label>';
    viewPdf += '</div>';

    viewPdf += '<div class="w3-third" style="padding:15px 10px 10px 15px;">';
    viewPdf += '<input id="view-sef" name="view-pdfs" class="w3-radio" type="radio" value="sef">';
    viewPdf += '<label style="margin-left:10px;font-weight:normal;">SEF</label>';
    viewPdf += '</div>';
    viewPdf += '</div>';

    viewPdf += '</form>';

    */
    
    //viewPdf += '<div class="w3-center" style="margin-top:10px;">';
    //viewPdf += '<button id="cancel-pdf-view" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    //viewPdf += '<button id="view-selected-pdf-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium">View Selected PDF</button>';
    //viewPdf += '</div>';

    viewPdf += '</div>';

    $("#sidebar-right").append(viewPdf);

    //$("#view-chf").prop("checked", true);

    var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    $("#request-rio-pdfs").append(spinHtml);

    //FETCH THE PDFS

    $.ajax({
        url: '/request/' + param,
        type: "GET",
        success: function (response) {

            var rioPdfs = response.ws_quote_pdfs;

            if(response.ws_quote_pdfs.length > 0) {
                rioPdfs = JSON.parse(rioPdfs);
            }

            console.log(rioPdfs);

            var pdfsDisplay = '<div style="width:100%;padding:10px;border:0px solid blue;">';
            pdfsDisplay += '<h4 style="margin:0 0 15px 0;">Click to View:</h4>';
            pdfsDisplay += '<ul class="w3-ul w3-card-4 w3-hoverable">';

            if (rioPdfs.length > 0) {

                for (var p = 0; p < rioPdfs.length; p++) {

                    var thisPdf = rioPdfs[p];

                    pdfsDisplay += '<li class="w3-bar">';
                    pdfsDisplay += '<div><a id="view-rio-pdf~' + thisPdf + '" href="">' + thisPdf + '</a></div>';
                    pdfsDisplay += '</li>'

                }
                pdfsDisplay += '</ul>';
                pdfsDisplay += '</div>';

            } else {
                pdfsDisplay += '<div style="margin:15px 0 0 15px;font-weight:bold;color:red;">No Pdfs Found</div>';
            }

            $("#request-rio-pdfs").html("");
            $("#request-rio-pdfs").append(pdfsDisplay);
        }
    });

}

$("#sidebar-right").on('click','[id^=view-pdf]', function (e) {

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[2];

    viewRioPdfs(param);

});

//EMAIL

$("#sidebar-right").on('click','[id^=preview-quote-email]', function (e) {

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[3];

    var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    //PREVIEW EMAIL

    $("#sidebar-right").css({"width": "0px"});

    $("#workspace").html("");

    //var previewQuote = '<div style="clear:both;"></div>';

    //previewQuote += '<div id="quote-email-preview-display"></div>';

    ////
    var previewQuote = '<div style="clear:both;"></div>';
    //QUOTE CONTAINER
    previewQuote += '<div class="page-container hidden-on-narrow" style="margin-bottom:35px;border:0px solid green;">';
    previewQuote += '<div class="pdf-page size-a4" style="border:0px solid blue;">';

    //INNER PAGE PDF CONTENT
    previewQuote += '<div id="inner-page" style="border:1px solid transparent;">';
    //previewQuote += '<div id="quote-email-preview-display"></div>';

    previewQuote += '</div>';
    previewQuote += '</div>';

    previewQuote += '</div>';

    ////

    $("#workspace").append(prepareQuote);

    //GET REQUEST DETAILS

    /* var requestDets = function () {
        var result = $.ajax({
            type: "get",
            url: 'request/' + param,
            async: false,
            success: function (response) {
                //console.log("GET REQ: ",response);
            }
        }) .responseText ;
        return  result;
    } */

    $("#workspace").append(previewQuote);

    $("#work-space-header").html("");

    var workSpaceQuotePrepareHeader = '<h1 class="w3-xlarge w3-left"><b>Preview Quote Email</b></h1>';
    workSpaceQuotePrepareHeader += '<button id="workspace-view-requests" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin:0 0 10px 10px;">View Requests</button>';
    workSpaceQuotePrepareHeader += '<button id="cancel-quote-action-' + param + '" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin:0 0 10px 10px;">Back to Quotes</button>';

    $("#work-space-header").append(workSpaceQuotePrepareHeader);

    $.ajax({
        url: '/quote/preview/' + param,
        type: "GET",
        success: function (response) {
            console.log(response);
            //$("#email-quote-send-container").html("");
            //alert("Email was successfully sent.");
            $("#inner-page").append(response);
        }
    });

});

$("#sidebar-right").on('click','[id^=send-quote-email]', function (e) {

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");

    var errCount = 0;
    var errMsgArray = [];

    if ($("#quote_email_to").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'quote_email_to',
            "msg": 'An Email To Recipient must be provided.'
        });
    }
    
    if ($("#quote_email_cc").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'quote_email_cc',
            "msg": 'An Email To CC must be provided.'
        });
    }
    
    /* if ($("#quote_email_content").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'quote_email_content',
            "msg": 'Some Email Content must be provided'
        });
    } */

    if (errCount > 0) {

        console.log("EMAIL QUOTE ERRORS: ", errMsgArray);

        for (var e = 0; e < errMsgArray.length; e++) {

            var errorId = errMsgArray[e]['id'];
            var errorMsg = errMsgArray[e]['msg'];

            $("#" + errorId).addClass('required');
            $("#" + errorId + "_error").removeClass('noerror');
            $("#" + errorId + "_error").addClass('error');
            $("#" + errorId + "_error").html(errorMsg);

        }

    } else {
    
        var spinHtml = '<div class="busy-indicator-notifications">';
        spinHtml += '<div>';
        spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
        spinHtml += '</div>';
        spinHtml += '</div>';

        $("#email-quote-send-container").html(spinHtml);

        var quoteForm = $("#email-quote-form").serialize();

        console.log("QUOTE FORM: ", quoteForm);

        $.ajax({
            url: '/email/send',
            type: "POST",
            data: {
                "form": quoteForm
            },
            success: function (response) {
                console.log(response);
                
                if(response != "OK"){
                    $("#email-quote-send-container").html("");
                    alert("Quote Email could not be sent. Please try again.");
                } else {
                    $("#email-quote-send-container").html("");
                    alert("Quote Email was successfully sent.");
                    $("#sidebar-right").css({"width": "0px"});
                }
            }
        });
    }

});

$("#sidebar-right").on('click','[id^=send-quote-confirmation-email]', function (e) {
    
    e.preventDefault();
    
    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[4];

    //EMAIL ERRORS
    
    var errCount = 0;
    var errMsgArray = [];

    if ($("#confirm_email_to").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'confirm_email_to',
            "msg": 'An Email To Recipient must be provided.'
        });
    }
    
    if ($("#confirm_email_cc").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'confirm_email_cc',
            "msg": 'An Email To CC must be provided.'
        });
    }
    
    if ($("#confirm_email_content").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'confirm_email_content',
            "msg": 'Some Email Content must be provided'
        });
    }

    if (errCount > 0) {

        console.log("EMAIL CONFIRM ERRORS: ", errMsgArray);

        for (var e = 0; e < errMsgArray.length; e++) {

            var errorId = errMsgArray[e]['id'];
            var errorMsg = errMsgArray[e]['msg'];

            $("#" + errorId).addClass('required');
            $("#" + errorId + "_error").removeClass('noerror');
            $("#" + errorId + "_error").addClass('error');
            $("#" + errorId + "_error").html(errorMsg);

        }

    } else {
    
        var spinHtml = '<div class="busy-indicator-notifications">';
        spinHtml += '<div>';
        spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
        spinHtml += '</div>';
        spinHtml += '</div>';

        $("#email-confirm-send-container").html(spinHtml);

        var confirmForm = $("#email-confirmation-form").serialize();

        $.ajax({
            url: '/email/confirm',
            type: "POST",
            data: {
                "form": confirmForm
            },
            success: function (response) {
                console.log(response);
                $("#email-confirm-send-container").html("");
                alert("Confirmation Email was successfully sent.");
                $("#sidebar-right").css({"width": "0px"});
            }
        });
    }

});

//EDIT BOOKINGS

$("#sidebar-right").on('click','[id^=cancel-edit-booking]', function (e) {

    e.preventDefault();

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[3];

    actionView(param);

});


//$('body').on('click', '#ws_customer_name', function() {

/* $("#sidebar-right").on('click','#submit-upload-travel', function (e) {
    
    e.preventDefault();
    
    alert("CLICKED");

    //$("#travel-doc-form").submit();
    $("#travel-doc-form")[0].submit();
}); */

$("#sidebar-right").on('click','[id^=delete-travel-pdfs]', function (e) {

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("_");
    var param = paramsArr[1];

    console.log("DELETE PARAM :",param);

    $.ajax({
        url: '/travel/delete/' + param,
        type: "POST",
        async: false,
        success: function (response) {

            console.log("DELETED: ", response);

            $("#display_travel_pdf_" + param).css({"display": "none"});

            alert("Document was Successfully deleted");

            //pond.removeFiles();

        }
    });

});

function viewTravelDocs(swing){

    $("#sidebar-right").html("");
    
    var viewTravelPdf = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    viewTravelPdf += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Travel Docs - Swing #' + swing + '</div>';
    viewTravelPdf += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    viewTravelPdf += '</div>';

    viewTravelPdf += '<div class="w3-center" style="margin-top:10px;">';
    viewTravelPdf += '<button id="cancel-view-travel-pdfs_' + swing + '" class="w3-button w3-darkblue w3-mobile w3-medium w3-right" style="margin-right:10px;">Cancel</button>';
    viewTravelPdf += '</div>';
    
    viewTravelPdf += '<div id="travel-doc-pdfs" style="margin:45px 0 0 15px;"></div>'

    viewTravelPdf += '</div>';

    $("#sidebar-right").append(viewTravelPdf);

    var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    $("#travel-doc-pdfs").append(spinHtml);

    $.ajax({
        url: '/travel/' + swing,
        type: "GET",
        success: function (response) {

            console.log("TRAVEL: ", response);
            
            var travelDocs = response;

            var docsDisplay = '<div style="width:100%;padding:10px;border:0px solid blue;">';
            docsDisplay += '<ul class="w3-ul w3-card-4 w3-hoverable">';

            if (travelDocs.length > 0) {

                for (var d = 0; d < travelDocs.length; d++) {

                    var thisDocId = travelDocs[d]['td_id'];
                    var thisDocIFileName = travelDocs[d]['td_filename'];

                    docsDisplay += '<li id="display_travel_pdf_' + thisDocId + '" class="w3-bar">';
                    docsDisplay += '<div>' + thisDocIFileName + '</div>';
                    docsDisplay += '<div class="w3-center">';
                    docsDisplay += '<button id="view-tdoc-pdfs~' + thisDocIFileName + '" class="w3-button w3-darkblue w3-mobile w3-small w3-padding-small" style="margin-right:10px;">View</button>';
                    docsDisplay += '<button id="delete-travel-pdfs_' + thisDocId + '" class="w3-button w3-darkblue w3-mobile w3-small w3-padding-small">Delete</button>';
                    docsDisplay += '<div>';
                    docsDisplay += '</li>'

                }
                docsDisplay += '</ul>';
                docsDisplay += '</div>';

            } else {
                docsDisplay += '<div style="margin:15px 0 0 15px;font-weight:bold;color:red;">No Travel Docs Found Found</div>';
            }

            $("#travel-doc-pdfs").html("");
            $("#travel-doc-pdfs").append(docsDisplay);
        }
    }); 

}

$("#sidebar-right").on('click','[id^=view-travel-pdfs]', function (e) {

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("_");
    var param = paramsArr[1];

    console.log("VIEW PARAM :",param);

    var swing = param;

    viewTravelDocs(swing);

});

function uploadTravel(swing){

    //SET SWING

    localStorage.setItem('current-swing',swing);
    
    $("#sidebar-right").html("");

    var uploadTravelForm = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    uploadTravelForm += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Manage Travel Documents - Swing #' + swing + '</div>';
    uploadTravelForm += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    uploadTravelForm += '</div>';
    uploadTravelForm += '<div class="w3-center" style="margin-top:10px;">';
    uploadTravelForm += '<button id="cancel-upload-travel-' + swing + '" class="w3-button w3-darkblue w3-mobile w3-medium w3-right" style="margin-right:10px;">Cancel</button>';
    uploadTravelForm += '<button id="view-travel-pdfs_' + swing + '" class="w3-button w3-darkblue w3-mobile w3-medium w3-right" style="margin-right:10px;">View</button>';
    uploadTravelForm += '</div>';
    uploadTravelForm += '</div>';

    uploadTravelForm += '<div class="w3-container" style="margin-top:100px;">';

    uploadTravelForm += '<form id="travel-doc-form" action="/filepond/process" method="post" enctype="multipart/form-data">';
    uploadTravelForm += '<input type="hidden" id="swing-id" name="swing-id" value="' + swing + '">';
    
    uploadTravelForm += '<div class="w3-row">';
    uploadTravelForm += '<div style="padding:5px 10px 10px 0;">';
    uploadTravelForm += '<input class="w3-input w3-border input-display" type="file" name="filepond[]" multiple>';
    uploadTravelForm += '</div>';

    uploadTravelForm += '</div>';

    /* uploadTravelForm += '<div class="w3-center" style="margin-top:10px;">';
    uploadTravelForm += '<button type="submit" class="w3-button w3-darkblue w3-mobile w3-medium w3-center" style="margin-right:10px;">Submit</button>';
    uploadTravelForm += '</div>'; */

    uploadTravelForm += '</form>';
    uploadTravelForm += '</div>';//close container

    uploadTravelForm += '<div class="error" style="margin:10px 0 0 15px;" id="upload-message-display"></div>';

    $("#sidebar-right").append(uploadTravelForm);

    var updateMsg = '';

    FilePond.registerPlugin(
        //FilePondPluginFileValidateSize,
        //FilePondPluginImageExifOrientation,
        //FilePondPluginImageCrop,
        //FilePondPluginImageResize,
        FilePondPluginImagePreview,
        //FilePondPluginImageTransform,
        FilePondPluginFileValidateType,
        FilePondPluginFileMetadata
    );
    
    FilePond.setOptions({
    
        acceptedFileTypes: ['image/png', 'application/pdf'],
        allowMultiple: true,
        maxFiles: 2,
        instantUpload: true,
        
        // maximum allowed file size
        //maxFileSize: '5MB',
    
        // crop the image to a 1:1 ratio
        //imageCropAspectRatio: '1:1',
    
        // resize the image
        //imageResizeTargetWidth: 200,
    
        // upload to this server end point
        server: {

            process:(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {

            // fieldName is the name of the input field
            // file is the actual file object to send
            const formData = new FormData();

            console.log("FILE: ",file);

            //console.log("METADATA: ",metadata);

            formData.append(fieldName, file, file.name);

            var swingId = $("#swing-id").val();
            
            formData.append("swing_id", swingId);

            //console.log("FD: ",formData);

            const request = new XMLHttpRequest();
            request.open('POST', '/filepond/process');

            // Should call the progress method to update the progress to 100% before calling load
            // Setting computable to false switches the loading indicator to infinite mode
            request.upload.onprogress = (e) => {
                progress(e.lengthComputable, e.loaded, e.total);
            };

            // Should call the load method when done and pass the returned server file id
            // this server file id is then used later on when reverting or restoring a file
            // so your server knows which file to return without exposing that info to the client

            request.onload = function () {
                if (request.status >= 200 && request.status < 300) {
                    // the load method accepts either a string (id) or an object
                    load(request.responseText);

                    var fileName = request.responseText;

                    //alert("Upload Sucessful!");

                    updateMsg += '<p>Uploaded Successfully</p>';
                    
                    pond.removeFiles();

                    //SAVE TRAVEL DOC FILE

                    $.ajax({
                        url: '/travel/save',
                        type: "POST",
                        data: {
                            "td_swing" : swingId,
                            "td_filename" : fileName
                        },
                        async: false,
                        success: function (response) {
                
                            console.log("SAVED: ", updateMsg);
                            $("#upload-message-display").html(updateMsg);

                            //pond.removeFiles();
                
                        }
                    });

                } else {
                    // Can call the error method if something is wrong, should exit after
                    error('oh no');
                }
            };

            request.send(formData);
            },
                revert: 'filepond/revert',
            },

            onaddfile: (err, item) => {
                console.log('file added event', err, item);
            }
        });
       
        // Turn a file input into a file pond
        var pond = FilePond.create(document.querySelector('input[type="file"]'));

}    

function editBooking(request, bookingId){

    $("#sidebar-right").html("");

    var editBookingForm = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    editBookingForm += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Edit Booking</div>';
    editBookingForm += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    editBookingForm += '</div>';
    editBookingForm += '<div class="w3-center" style="margin-top:10px;">';
    editBookingForm += '<button id="cancel-edit-booking-' + request + '" class="w3-button w3-darkblue w3-mobile w3-medium w3-right" style="margin-right:10px;">Cancel</button>';
    //editBookingForm += '<button id="view-request-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium">View</button>';
    editBookingForm += '</div>';
    editBookingForm += '</div>';
    //editBookingForm += '<div style="margin-top:60px;" id="bookings-display">' + booking + '</div>';

    editBookingForm += '<div class="w3-container" style="margin-top:0px;">';
    editBookingForm += '<div style="margin-top:5px;margin-bottom:15px;font-size:12px;">Required Field<span class="required-label">*</span></div>';
    editBookingForm += '<form id="update-request-form">';

    //editBookingForm += '<input type="hidden" id="ws_id" name="ws_id" value="">';
    //editBookingForm += '<input type="hidden" id="ws_type" name="ws_type" value="request">';
    //editBookingForm += '<input type="hidden" id="ws_customer" name="ws_customer" value="">';

    editBookingForm += '<div class="w3-row">';

    editBookingForm += '<div class="w3-half" style="padding:5px 10px 10px 0;">';
    editBookingForm += '<label style="font-weight:bold;">Booking ID#</label>';
    editBookingForm += '<input name="BookingId" id="BookingId" class="w3-input w3-border input-display" type="text" disabled="disabled" style="background-color:lightgrey">';
    editBookingForm += '</div>';

    editBookingForm += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    editBookingForm += '<label>Shift ID#<span class="required-label">*</span></label>';
    editBookingForm += '<input name="ShiftId" id="ShiftId" class="w3-input w3-border input-display" type="text" readonly="readonly">';
    editBookingForm += '<div id="ShiftId_error" class="noerror" ></div>';
    editBookingForm += '</div>';

    editBookingForm += '</div>';

    editBookingForm += '</form>';

    editBookingForm += '</div>';//close container

    $("#sidebar-right").append(editBookingForm);

    //GET THE BOOKING DETAILS

    $.ajax({
        url: '/booking/' + bookingId,
        type: "GET",
        success: function (response) {

            var booking = response;

            console.log("BOOKING: ", booking);

            for (var key in booking) {

                if (key == 'ws_customer') {

                    //console.log("get cust name");
                    //var custId = request['ws_customer'];

                } else {

                    //var check = key + " - " + request[key];

                    //console.log("KEY: ", check);

                    $("#" + key).val(booking[key]);
                }
            }

        }

    });

}

$("#sidebar-right").on('click','[id^=edit-booking]', function (e) {

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var request = paramsArr[2];
    var booking = paramsArr[3];

    //alert("EDIT BKG: " + param);

    /*
    $.ajax({
        url: '/email/send',
        type: "POST",
        success: function (response) {
            console.log(response);
        }
    });
    */

    editBooking(request, booking);

});

function progress(pb, itemCount) {

    alert("Item Count: ", itemCount);
    pb.value(pb.value() + 1)
    
}

$("body").on('click','.travel', function (e) {

    document.getElementById("order-update-success").style.display = "block";

});

$("body").on('click','#startProgress', function (e) {

    if (!$(this).hasClass("k-state-disabled")) {
        $(this).addClass("k-state-disabled");
        progress();
    }
});

//QUOTE

$("body").on('click','[id^=workspace-view-requests]', function (e) {

    viewRequests();

});

function viewRequests(){

    alert("VIEW REQ");
    
    $("#work-space-header").html("");

    var workSpaceHeader = '<h1 class="w3-xlarge w3-left"><b>Requests</b></h1>';
    workSpaceHeader += '<button id="workspace-action-add" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin-bottom:10px;">Add Request</button>';

    workSpaceHeader += '<div style="clear:both;"></div>';
    
    
    $("#work-space-header").append(workSpaceHeader);

    getWorkspace('requests',1);

}

function isNumber(value) {
    if ((undefined === value) || (null === value)) {
        return false;
    }
    if (typeof value == 'number') {
        return true;
    }
    return !isNaN(value - 0);
}

$("#sidebar-right").on('click','[id^=delete-quote-extra]', function (e) {

    e.preventDefault();
    
    var paramDets = $(this).attr('id');

    console.log("PD: ", paramDets);
    var paramsArr = paramDets.split("_");
    var remIndex = paramsArr[1];
    var reqId = paramsArr[2];

    console.log("RI: ", remIndex);

    $("#extra-row-" + remIndex).remove();

    var extraDets = function () {
        var result = $.ajax({
            type: "get",
            url: 'request/' + reqId,
            async: false,
            success: function (response) {
                //console.log("GET REQ: ",response);
            }
        }) .responseText ;
        return  result;
    }

    var extraDetails = extraDets();
    extraDetails = JSON.parse(extraDetails);

    console.log("EXTRA DETS: ", extraDetails);

    var currentExtrasArray = extraDetails.ws_quote_extras;

    if(currentExtrasArray !== null && currentExtrasArray.length > 0){
        currentExtrasArray = JSON.parse(currentExtrasArray);
    }

    console.log("CEXT: ", currentExtrasArray);

    if(currentExtrasArray !== null && currentExtrasArray.length > 0){
        extrasArray = currentExtrasArray;
    
    } else {
        var extrasArray = '';
    }
    
    var currentExtrasArrayLength = extrasArray.length;

    console.log("CURR EXTRAS LENGTH: ", currentExtrasArrayLength);
    
    var currentExtrasTotal = $("#current-extras-total").val();

    console.log("CURR EXTRAS TOTAL: ", currentExtrasTotal);
    
    var deletedValue = extrasArray[remIndex]['value'];

    console.log("DEL VALUE: ", deletedValue);

    var newExtrasTotal = parseFloat(currentExtrasTotal) - parseFloat(deletedValue);

    newExtrasTotal = newExtrasTotal.toFixed(2);

    if(currentExtrasArrayLength == 1){
        //HIDE THE TOTAL
        $("#quote-extras-heading").css({"display": "none"});
        $("#quote-extras-total-display").css({"display": "none"});
    } else {
        $("#current-extras-total").val(newExtrasTotal);
    } 
    
    extrasArray.splice(remIndex, 1);

    console.log("AFTER CLEAN: ", extrasArray);
    
    if(currentExtrasArrayLength == 1){
        var postingExtras = null;
    } else {
        console.log("CEXT AFT: ", extrasArray);
        var postingExtras = JSON.stringify(extrasArray);
    }  

    $("#ws_quote_extras").val(postingExtras);

    //POST THE EXTRAS ARRAY

    var requestForm = $("#update-extras-form").serialize();

    console.log("REQ FORM: ", requestForm);

    var updateUrl = '/request/' + reqId;

    $.ajax({
        url: updateUrl,
        type: "POST",
        data: {
            "form": requestForm
        },
        success: function (response) {
            console.log("EXTRAS DELETION POSTED:", response);             
        }
    });

    //RELOAD THE EXTRAS

    var thisExtrasTotal = 0;
    var quoteExtrasDisplay = '<h5 id="quote-extras-heading" style="padding:0 10px 0 0;">Current Extras:</h5>';
    
    for (var x = 0; x < extrasArray.length; x++) {
    
        var thisExtraDesc = extrasArray[x]['description'];
        //console.log("ED: ", thisExtraDesc);
        var thisExtraValue = extrasArray[x]['value'];
        //console.log("EV: ", thisExtraValue);

        thisExtrasTotal = parseFloat(thisExtrasTotal) + parseFloat(thisExtraValue);

        quoteExtrasDisplay += '<div id="extra-row-' + x + '" class="w3-row">';

        quoteExtrasDisplay += '<div class="w3-half" style="padding:0 10px 10px 0;">';
        quoteExtrasDisplay += '<input name="extra_description_c" class="w3-input w3-border input-display" type="text" readonly="readonly" disabled style="background-color:lightgrey" value="' + thisExtraDesc + '">';
        quoteExtrasDisplay += '</div>';
        
        quoteExtrasDisplay += '<div class="w3-third" style="padding:0 10px 10px 0;">';
        quoteExtrasDisplay += '<input name="extra_value_c" class="w3-input w3-border input-display" type="text" readonly="readonly" disabled style="text-align:right;background-color:lightgrey" value="' + parseFloat(thisExtraValue).toFixed(2) + '">';
        quoteExtrasDisplay += '</div>';

        quoteExtrasDisplay += '<div style="float:left;width:50px;padding:0 0 10px 0;border:0px solid green;">';
        quoteExtrasDisplay += '<button id="delete-quote-extra_' + x + "_" + reqId + '" class="w3-button w3-darkblue w3-circle w3-mobile w3-medium w3-left" style="margin-top:2px;">-</button>';
        quoteExtrasDisplay += '</div>';

        quoteExtrasDisplay += '</div>';

    }

    if(extrasArray.length > 0){
    
        quoteExtrasDisplay += '<div id="quote-extras-total-display" class="w3-row" style="border:0px solid red;">';

        quoteExtrasDisplay += '<div class="w3-half" style="padding:0 10px 10px 0;">';
        quoteExtrasDisplay += '<input name="extra_description_c" class="w3-input w3-border input-display" type="text" readonly="readonly" disabled style="background-color:darkgrey;color:#FFFFFF;" value="TOTAL EXTRAS">';
        quoteExtrasDisplay += '</div>';
        
        quoteExtrasDisplay += '<div class="w3-third" style="padding:0 10px 10px 0;">';
        quoteExtrasDisplay += '<input id="current-extras-total" name="current-extras-total" class="w3-input w3-border input-display" type="text" readonly="readonly" disabled style="text-align:right;background-color:darkgrey;color:#FFFFFF;" value="' + parseFloat(thisExtrasTotal).toFixed(2) + '">';
        quoteExtrasDisplay += '</div>';

        quoteExtrasDisplay += '</div>';
    } 

    $("#quote-extras-display").html("");
    $("#quote-extras-display").append(quoteExtrasDisplay);

    if(extrasArray.length < 1){
        $("#quote-extras-heading").css({"display" : "none"});
    }
    
    e.stopPropagation();

});

$("#sidebar-right").on('click','[id^=add-quote-extra]', function (e) {

    e.preventDefault();

    $("#update-extras-form").find("div.error").removeClass('error').addClass("noerror");
    $("#update-extras-form").find("input.required").removeClass('required');
    $("#update-extras-form").find("select.required").removeClass('required');

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("_");
    var param = paramsArr[1];

    var errCount = 0;
    var errMsgArray = [];

    if($("#extra_description").val().length < 1) {        
        errCount++;
        errMsgArray.push({
            "id": "extra_description",
            "msg": 'An Extra Description must be provided'
        });
    }

    if($("#extra_value").val().length < 1) {        
        errCount++;
        errMsgArray.push({
            "id": "extra_value",
            "msg": 'An Extra $ Value must be provided'
        });
    } else {
        
        console.log("CHECK NUM: ", isNumber($("#extra_value").val()));

        var checkForNumber = isNumber($("#extra_value").val());

        if(!checkForNumber){
            errMsgArray.push({
                "id": "extra_value",
                "msg": 'An Extra $ Value must be an number (2 decimal places rec.)'
            });

        }
    }

    if(errCount < 1){

        var extrasPosted = {}
        
        extrasPosted.description = $("#extra_description").val();
        extrasPosted.value = parseFloat($("#extra_value").val()).toFixed(2);

        console.log("EXTRAS POSTED: ", extrasPosted);

        var extraDets = function () {
            var result = $.ajax({
                type: "get",
                url: 'request/' + param,
                async: false,
                success: function (response) {
                    //console.log("GET REQ: ",response);
                }
            }) .responseText ;
            return  result;
        }
    
        var extraDetails = extraDets();
        extraDetails = JSON.parse(extraDetails);

        console.log("EXTRA DETS: ", extraDetails);

        var currentExtrasArray = extraDetails.ws_quote_extras;

        if(currentExtrasArray !== null && currentExtrasArray.length > 0){
            currentExtrasArray = JSON.parse(currentExtrasArray);
        }

        console.log("CEXT: ", currentExtrasArray);

        if(currentExtrasArray !== null && currentExtrasArray.length > 0){
            extrasArray = currentExtrasArray;
        
        } else {
            var extrasArray = [];
        }

        extrasArray.push(extrasPosted);

        console.log("EXTRA POSTING: ", extrasArray);
        
        var postingExtras = JSON.stringify(extrasArray);

        //DISPLAY THE CURRENT EXTRAS

        var thisExtrasTotal = 0;
        var quoteExtrasDisplay = '<h5 id="quote-extras-heading" style="padding:0 10px 0 0;">Current Extras:</h5>';
        
        for (var x = 0; x < extrasArray.length; x++) {
        
            var thisExtraDesc = extrasArray[x]['description'];
            //console.log("ED: ", thisExtraDesc);
            var thisExtraValue = extrasArray[x]['value'];
            //console.log("EV: ", thisExtraValue);

            thisExtrasTotal = parseFloat(thisExtrasTotal) + parseFloat(thisExtraValue);

            quoteExtrasDisplay += '<div id="extra-row-' + x + '" class="w3-row">';

            quoteExtrasDisplay += '<div class="w3-half" style="padding:0 10px 10px 0;">';
            quoteExtrasDisplay += '<input name="extra_description_c" class="w3-input w3-border input-display" type="text" readonly="readonly" disabled style="background-color:lightgrey" value="' + thisExtraDesc + '">';
            quoteExtrasDisplay += '</div>';
            
            quoteExtrasDisplay += '<div class="w3-third" style="padding:0 10px 10px 0;">';
            quoteExtrasDisplay += '<input name="extra_value_c" class="w3-input w3-border input-display" type="text" readonly="readonly" disabled style="text-align:right;background-color:lightgrey" value="' + parseFloat(thisExtraValue).toFixed(2) + '">';
            quoteExtrasDisplay += '</div>';

            quoteExtrasDisplay += '<div style="float:left;width:50px;padding:0 0 10px 0;border:0px solid green;">';
            quoteExtrasDisplay += '<button id="delete-quote-extra_' + x + "_" + param + '" class="w3-button w3-darkblue w3-circle w3-mobile w3-medium w3-left" style="margin-top:2px;">-</button>';
            quoteExtrasDisplay += '</div>';

            quoteExtrasDisplay += '</div>';

        }

        quoteExtrasDisplay += '<div id="quote-extras-total-display" class="w3-row" style="border:0px solid red;">';

        quoteExtrasDisplay += '<div class="w3-half" style="padding:0 10px 10px 0;">';
        quoteExtrasDisplay += '<input name="extra_description_c" class="w3-input w3-border input-display" type="text" readonly="readonly" disabled style="background-color:darkgrey;color:#FFFFFF;" value="TOTAL EXTRAS">';
        quoteExtrasDisplay += '</div>';
        
        quoteExtrasDisplay += '<div class="w3-third" style="padding:0 10px 10px 0;">';
        quoteExtrasDisplay += '<input id="current-extras-total" name="current-extras-total" class="w3-input w3-border input-display" type="text" readonly="readonly" disabled style="text-align:right;background-color:darkgrey;color:#FFFFFF;" value="' + parseFloat(thisExtrasTotal).toFixed(2) + '">';
        quoteExtrasDisplay += '</div>';

        quoteExtrasDisplay += '</div>';

        $("#quote-extras-display").html("");
        $("#quote-extras-display").append(quoteExtrasDisplay);

        $("input[type='text'][name='extra_description_c']").each(function(){
            $(this).prop("disabled", true);
        });

        $("input[type='text'][name='extra_value_c']").each(function(){
            $(this).prop("disabled", true);
        });

        $("#ws_quote_extras").val(postingExtras);

        //POST THE EXTRAS ARRAY

        var requestForm = $("#update-extras-form").serialize();

        console.log("REQ FORM: ", requestForm);

        var updateUrl = '/request/' + param;

        $.ajax({
            url: updateUrl,
            type: "POST",
            data: {
            "form": requestForm
            },
            success: function (response) {
                console.log("EXTRAS POSTED:", response);
                //$("#extra_description").val("");
                //$("#extra_value").val("");                 
            }
        });

        $("#extra_description").val("");
        $("#extra_value").val("");   

    } else {
        
        console.log("ERRORS: ", errMsgArray);

        for (var e = 0; e < errMsgArray.length; e++) {

            var errorId = errMsgArray[e]['id'];
            var errorMsg = errMsgArray[e]['msg'];

            $("#" + errorId).addClass('required');
            $("#" + errorId + "_error").removeClass('noerror');
            $("#" + errorId + "_error").addClass('error');
            $("#" + errorId + "_error").html(errorMsg);

        }

    }

});

function prepareQuote(param){

    $("#sidebar-right").css({"width": "0px"});

    $("#workspace").html("");

    var prepareQuote = '<div style="clear:both;"></div>';

    //prepareQuote += '<div>PREPARE: ' + param + '</div>';

    $("#workspace").append(prepareQuote);

    $("#work-space-header").html("");

    var workSpaceQuotePrepareHeader = '<h1 class="w3-xlarge w3-left"><b>Request Quote - # ' + param + '</b></h1>';
    workSpaceQuotePrepareHeader += '<button id="workspace-view-requests" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin:0 0 10px 10px;">View Requests</button>';
    workSpaceQuotePrepareHeader += '<button id="cancel-quote-action-' + param + '" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin:0 0 10px 10px;">Back to Quotes</button>';
    workSpaceQuotePrepareHeader += '<button id="quote-view-pdf-' + param + '" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin:0 0 10px 10px;">View Quote PDF</button>';
    workSpaceQuotePrepareHeader += '<button id="quote-preview-pdf-' + param + '" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin:0 0 10px 10px;">Preview Quote PDF</button>';

    $("#work-space-header").append(workSpaceQuotePrepareHeader);

}

function emailQuote(reqId){

    console.log("QUOTE FORM REQ: ", reqId);
    
    $("#sidebar-right").html("");

    var quoteEmailForm = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    quoteEmailForm += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Email Quote - Request ID # ' + reqId + '</div>';
    quoteEmailForm += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    quoteEmailForm += '</div>';
    quoteEmailForm += '<div class="w3-center" style="margin-top:10px;">';
    quoteEmailForm += '<button id="cancel-email-quote-' + reqId + '" class="w3-button w3-darkblue w3-mobile w3-medium w3-right" style="margin-right:10px;">Cancel</button>';
    quoteEmailForm += '</div>';
    quoteEmailForm += '</div>';

    quoteEmailForm += '<div class="w3-container" style="margin-top:0px;border:0px solid red;">';
    quoteEmailForm += '<div style="margin-top:5px;margin-bottom:15px;font-size:12px;">Required Field<span class="required-label">*</span></div>';
    
    quoteEmailForm += '<form id="email-quote-form" style="border:0px solid;">';

    quoteEmailForm += '<input type="hidden" id="quote_email_req" name="quote_email_req" value="' + reqId + '">';

    quoteEmailForm += '<div class="w3-row">';

    quoteEmailForm += '<div style="padding:0 10px 10px 0;">';
    quoteEmailForm += '<label>Email To<span class="required-label">*</span></label>';
    quoteEmailForm += '<input name="quote_email_to" id="quote_email_to" class="w3-input w3-border input-display" type="text">';
    quoteEmailForm += '<div id="quote_email_to_error" class="noerror" ></div>';
    quoteEmailForm += '</div>';

    quoteEmailForm += '</div>';
    quoteEmailForm += '<div class="w3-row">';

    quoteEmailForm += '<div style="padding:0 10px 10px 0;">';
    quoteEmailForm += '<label>Email CC<span class="required-label">*</span></label>';
    quoteEmailForm += '<input name="quote_email_cc" id="quote_email_cc" class="w3-input w3-border input-display" type="text">';
    quoteEmailForm += '<div id="quote_email_cc_error" class="noerror" ></div>';
    quoteEmailForm += '</div>';

    quoteEmailForm += '</div>';

    /* quoteEmailForm += '<div class="w3-row">';
    
    quoteEmailForm += '<div style="padding:0 10px 10px 0;">';
    quoteEmailForm += '<label>Email Content<span class="required-label">*</span></label>';
    quoteEmailForm += '<textarea name="confirm_email_content" id="confirm_email_content" class="w3-input w3-border input-display" rows="8" placeholder="Enter any comments here"></textarea>';
    quoteEmailForm += '<div id="confirm_email_content_error" class="noerror" ></div>';
    quoteEmailForm += '</div>';

    quoteEmailForm += '</div>'; */
  
    quoteEmailForm += '</form>';

    quoteEmailForm += '<div id="email-quote-send-container"></div>';

    quoteEmailForm += '<div class="w3-center" style="margin-top:10px;">';
 
    quoteEmailForm += '<button id="preview-quote-email-' + reqId + '" class="w3-button w3-darkblue w3-mobile w3-medium">Preview Email</button>';
    quoteEmailForm += '<button id="send-quote-email-' + reqId + '" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-left:10px;">Send Email</button>';

    quoteEmailForm += '</div>';

    quoteEmailForm += '</div>';//close container

    quoteEmailForm += '<div id="email-quote-send-container" ></div>';

    $("#sidebar-right").append(quoteEmailForm);

}

function quoteExtras(reqId){

    $("#sidebar-right").html("");

    var quoteExtrasForm = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    quoteExtrasForm += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Quote Extras - Request ID # ' + reqId + '</div>';
    quoteExtrasForm += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    quoteExtrasForm += '</div>';
    quoteExtrasForm += '<div class="w3-center" style="margin-top:10px;">';
    quoteExtrasForm += '<button id="cancel-quote-extras-' + reqId + '" class="w3-button w3-darkblue w3-mobile w3-medium w3-right" style="margin-right:10px;">Cancel</button>';
    quoteExtrasForm += '</div>';
    quoteExtrasForm += '</div>';

    quoteExtrasForm += '<div class="w3-container" style="margin-top:0px;border:0px solid red;">';
    quoteExtrasForm += '<div style="margin-top:5px;margin-bottom:15px;font-size:12px;">Required Field<span class="required-label">*</span></div>';
    
    quoteExtrasForm += '<form id="update-extras-form" style="border:0px solid;">';

    quoteExtrasForm += '<input type="hidden" id="ws_id" name="ws_id" value="' + reqId + '">';
    quoteExtrasForm += '<input type="hidden" id="ws_quote_extras" name="ws_quote_extras" value="">';

    quoteExtrasForm += '<div class="w3-row" style="border:0px solid red;">';
    quoteExtrasForm += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    quoteExtrasForm += '<label style="font-weight:bold;">Extra Description<span class="required-label">*</span></label>';
    quoteExtrasForm += '<input name="extra_description" id="extra_description" class="w3-input w3-border input-display" type="text">';
    quoteExtrasForm += '<div id="extra_description_error" class="noerror" ></div>';
    quoteExtrasForm += '</div>';    
    quoteExtrasForm += '<div class="w3-third" style="padding:0 10px 10px 0;">';
    quoteExtrasForm += '<label>Value ($)<span class="required-label">*</span></label>';
    quoteExtrasForm += '<input name="extra_value" id="extra_value" class="w3-input w3-border input-display" type="text">';
    quoteExtrasForm += '<div id="extra_value_error" class="noerror"></div>';
    quoteExtrasForm += '</div>';

    quoteExtrasForm += '<div style="float:left;width:50px;padding:0 0 10px 0;border:0px solid green;">';
    quoteExtrasForm += '<button id="add-quote-extra_' + reqId + '" class="w3-button w3-darkblue w3-circle w3-mobile w3-medium w3-left" style="margin-top:27px;">+</button>';
    quoteExtrasForm += '</div>';
    quoteExtrasForm += '</div>';
    quoteExtrasForm += '</div>';

    quoteExtrasForm += '</form>';

    quoteExtrasForm += '<div id="quote-extras-display" class="w3-container" style="margin:30px 0 0 0;border:0px solid red;"></div>';

    quoteExtrasForm += '</div>';//close container

    $("#sidebar-right").append(quoteExtrasForm);

    //GET THE CURRENT EXTRAS

    var extraDets = function () {
        var result = $.ajax({
            type: "get",
            url: 'request/' + reqId,
            async: false,
            success: function (response) {
                //console.log("GET REQ: ",response);
            }
        }) .responseText ;
        return  result;
    }

    var extraDetails = extraDets();
    extraDetails = JSON.parse(extraDetails);

    console.log("EXTRA DETS: ", extraDetails);

    var currentExtrasArray = extraDetails.ws_quote_extras;

    if(currentExtrasArray !== null && currentExtrasArray.length > 0){
        currentExtrasArray = JSON.parse(currentExtrasArray);
    }

    console.log("CEXT: ", currentExtrasArray);

    if(currentExtrasArray !== null && currentExtrasArray.length > 0){
        
        extrasArray = currentExtrasArray;

        //DISPLAY THE CURRENT EXTRAS

        var thisExtrasTotal = 0;
        var quoteExtrasInitDisplay = '<h5 id="quote-extras-heading" style="padding:0 10px 0 0;">Current Extras:</h5>';
        
        for (var x = 0; x < extrasArray.length; x++) {
        
            var thisExtraDesc = extrasArray[x]['description'];
            console.log("ED: ", thisExtraDesc);
            var thisExtraValue = extrasArray[x]['value'];
            console.log("EV: ", thisExtraValue);

            thisExtrasTotal = parseFloat(thisExtrasTotal) + parseFloat(thisExtraValue);

            quoteExtrasInitDisplay += '<div id="extra-row-' + x + '" class="w3-row">';

            quoteExtrasInitDisplay += '<div class="w3-half" style="padding:0 10px 10px 0;">';
            quoteExtrasInitDisplay += '<input name="extra_description_c" class="w3-input w3-border input-display" type="text" readonly="readonly" disabled style="background-color:lightgrey" value="' + thisExtraDesc + '">';
            quoteExtrasInitDisplay += '</div>';
            
            quoteExtrasInitDisplay += '<div class="w3-third" style="padding:0 10px 10px 0;">';
            quoteExtrasInitDisplay += '<input name="extra_value_c" class="w3-input w3-border input-display" type="text" readonly="readonly" disabled style="text-align:right;background-color:lightgrey" value="' + parseFloat(thisExtraValue).toFixed(2) + '">';
            quoteExtrasInitDisplay += '</div>';

            quoteExtrasInitDisplay += '<div style="float:left;width:50px;padding:0 0 10px 0;border:0px solid green;">';
            quoteExtrasInitDisplay += '<button id="delete-quote-extra_' + x + "_" + reqId + '" class="w3-button w3-darkblue w3-circle w3-mobile w3-medium w3-left" style="margin-top:2px;">-</button>';
            quoteExtrasInitDisplay += '</div>';

            quoteExtrasInitDisplay += '</div>';

        }

        quoteExtrasInitDisplay += '<div id="quote-extras-total-display" class="w3-row" style="border:0px solid red;">';

        quoteExtrasInitDisplay += '<div class="w3-half" style="padding:0 10px 10px 0;">';
        quoteExtrasInitDisplay += '<input name="extra_description_c" class="w3-input w3-border input-display" type="text" readonly="readonly" disabled style="background-color:darkgrey;color:#FFFFFF;" value="TOTAL EXTRAS">';
        quoteExtrasInitDisplay += '</div>';
        
        quoteExtrasInitDisplay += '<div class="w3-third" style="padding:0 10px 10px 0;">';
        quoteExtrasInitDisplay += '<input id="current-extras-total" name="current-extras-total" class="w3-input w3-border input-display" type="text" readonly="readonly" disabled style="text-align:right;background-color:darkgrey;color:#FFFFFF;" value="' + parseFloat(thisExtrasTotal).toFixed(2) + '">';
        quoteExtrasInitDisplay += '</div>';

        quoteExtrasInitDisplay += '</div>';

        $("#quote-extras-display").html("");
        $("#quote-extras-display").append(quoteExtrasInitDisplay);
    
    }

}

$("body").on('click','[id^=cancel-quote-action]', function (e) {

    e.preventDefault();

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[3];

    var isClose = document.getElementById("sidebar-right").style.width === "500px";

    if (!isClose) {
        $("#sidebar-right").css({"width": "500px"});
        actionQuote(param);

    } else {
        $("#sidebar-right").css({"width": "0px"});
    }

});

$("#sidebar-right").on('click','[id^=cancel-quote-extras]', function (e) {

    e.preventDefault();

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[3];

    actionQuote(param);

});

$("#sidebar-right").on('click','[id^=cancel-email-quote]', function (e) {

    e.preventDefault();

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[3];

    actionQuote(param);

});

$("#sidebar-right").on('click','[id^=quote-extras]', function (e) {

    e.preventDefault();

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[2];

    var reqId = param;

    console.log("QUOTE REQ: ", reqId);

    quoteExtras(reqId);

});

$("#sidebar-right").on('click','[id^=prepare-quote]', function (e) {

    e.preventDefault();

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[2];

    prepareQuote(param);

});

$("#sidebar-right").on('click','[id^=email-quote-doc]', function (e) {

    e.preventDefault();

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[3];

    //viewQuotePdf(param);
    //EMAILING QUOTE

    var reqId = param;

    console.log("EMAIL QUOTE REQ: ", reqId);

    emailQuote(reqId);

});

$("#sidebar-right").on('click','[id^=view-quote]', function (e) {

    e.preventDefault();

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[2];

    viewQuotePdf(param);

});

$("body").on('click','[id^=quote-generate-pdf]', function (e) {

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[3];

    generate('#inner-page', param);

    createRioPdfs(param);

});

function viewQuotePdf(param){

    console.log("VIEW: ", param);

    var rdm = Math.floor((Math.random() * 1000000) + 1);
    var pdfToView = "pdfs/quotes/quote_" + param + ".pdf?" + rdm + "#toolbar=0&navpanes=0&scrollbar=0";

    //window.open(pdfToView, "PopupWindow", "width=900,height=750,scrollbars=yes,resizable=yes");

    $("#sidebar-right").css({"width": "0px"});

    $("#workspace").html("");

    var viewQuote = '<div style="clear:both;"></div>';
    //QUOTE CONTAINER
    viewQuote += '<div style="margin-bottom:35px;border:0px solid green;">';
    viewQuote += '<div style="width:980px;margin: 0 auto;border:0px solid blue;">';

    viewQuote += '<embed id="pdf-quote-view"';
    viewQuote += ' src=""';
    viewQuote += ' type="application/pdf"';
    viewQuote += ' frameBorder="1"';
    viewQuote += ' scrolling="auto"';
    viewQuote += ' height="980px"';
    viewQuote += ' width="980px;"';
    viewQuote += '></embed>';

    viewQuote += '</div>';

    $("#workspace").append(viewQuote);

    $("#pdf-quote-view").prop("src",pdfToView);

    $("#work-space-header").html("");

    var workSpaceQuotePreviewHeader = '<h1 class="w3-xlarge w3-left"><b>Request Quote</b></h1>';
    workSpaceQuotePreviewHeader += '<button id="workspace-view-requests" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin:0 0 10px 10px;">View Requests</button>';
    workSpaceQuotePreviewHeader += '<button id="cancel-quote-action-' + param + '" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin:0 0 10px 10px;">Back to Quotes</button>';

    $("#work-space-header").append(workSpaceQuotePreviewHeader);

}

$("body").on('click','[id^=quote-view-pdf]', function (e) {

    e.preventDefault();

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[3];

    viewQuotePdf(param)

});

$("body").on('click','[id^=quote-preview-pdf]', function (e) {

    e.preventDefault();

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[3];

    console.log("PREVIEW: ", param);

    $("#sidebar-right").css({"width": "0px"});

    $("#workspace").html("");

    //GET REQUEST DETAILS

    var requestDets = function () {
        var result = $.ajax({
            type: "get",
            url: 'request/' + param,
            async: false,
            success: function (response) {
                //console.log("GET REQ: ",response);
            }
        }) .responseText ;
        return  result;
    }

    var requestDetails = requestDets();

    requestDetails = JSON.parse(requestDetails);
    console.log("GET REQ: ", requestDetails);

    var quoteCustomerName = requestDetails.ws_customer_name;
    var quoteDate = requestDetails.ws_quote_date;
    var quoteRef = requestDetails.ws_ref;
    var quoteSiteDesc = requestDetails.ws_site_desc;
    var quoteSiteShortDesc = requestDetails.ws_site_short_desc;
    var quoteRefTxt = "RR" + quoteRef + '-' + quoteSiteShortDesc;

    console.log("Q DATE: ", quoteDate);

    var previewQuote = '<div style="clear:both;"></div>';
    //QUOTE CONTAINER
    previewQuote += '<div class="page-container hidden-on-narrow" style="margin-bottom:35px;border:0px solid green;">';
    previewQuote += '<div class="pdf-page size-a4" style="border:0px solid blue;">';

    //INNER PAGE PDF CONTENT
    previewQuote += '<div id="inner-page" style="border:1px solid transparent;">';

        //BRANDING
        /*
        previewQuote += '<div class="details">';
        previewQuote += '<span class="company-logo">';
        previewQuote += '<img src="assets/ready_resources_logo_74.png" /> Ready Resources';
        previewQuote += '</span>';
        previewQuote += '<span class="quote-title">FORMAL QUOTATION</span>';
        previewQuote += '</div>';
        */

    previewQuote += '<div class="details">';
    previewQuote += '<div class="quote-title">FORMAL QUOTATION</div>';
    previewQuote += '<div>';
    previewQuote += '<span class="company-logo">';
    previewQuote += '<img src="assets/ready_resources_logo_74.png" /> Ready Resources';
    previewQuote += '</span>';
    previewQuote += '<span class="quote-address">Level 1, 125 St Georges Tce, Perth WA 6000<br>PO Box 62 Cloverdale, WA 6985<br>ABN: 99166302914</span>';
    previewQuote += '</div>';
    previewQuote += '</div>';

        //QUOTE BODY
        previewQuote += '<div class="pdf-body">';

            //QUOTE DETAILS
            previewQuote += '<div id="quote-heading">';

                previewQuote += '<div class="quote-border">';

                    previewQuote += '<div class="pdf-container">';
                    previewQuote += '<div class="details-item" style="width:120px;">CLIENT:</div>';
                    previewQuote += '<div class="details-item" style="width:330px;">' + quoteCustomerName + '</div>';
                    previewQuote += '<div class="details-item" style="width:80px;">DATE:</div>';
                    previewQuote += '<div class="details-item" style="width:110px;">' + quoteDate + '</div>';
                    previewQuote += '<div style="clear:both;"></div>';
                    previewQuote += '</div>';

                    previewQuote += '<div class="pdf-container">';
                    previewQuote += '<div class="details-item" style="width:120px;">SITE/DEPT:</div>';
                    previewQuote += '<div class="details-item" style="width:330px;">' + quoteSiteDesc + '</div>';
                    previewQuote += '<div class="details-item" style="width:80px;">QUOTE#:</div>';
                    previewQuote += '<div class="details-item" style="width:110px;">' + quoteRefTxt + '</div>';
                    previewQuote += '<div style="clear:both;"></div>';
                    previewQuote += '</div>';

                previewQuote += '</div>';

                previewQuote += '<div class="quote-border">';

                    previewQuote += '<div id="quote-notice" class="pdf-container-notice-display" style="font-size:12px;">';
                    previewQuote += '<div class="details-notice-item">PLEASE FORWARD PR NUMBER TO CONFIRM THIS QUOTE</div>';
                    previewQuote += '</div>';

                previewQuote += '</div>';

                previewQuote += '<div class="quote-border">';

                    previewQuote += '<div class="pdf-container">';
                    previewQuote += '<div class="details-item" style="width:160px;">Quote Prepared By:</div>';
                    previewQuote += '<div class="details-item" style="width:290px;">Sarah/Yazan</div>';
                    previewQuote += '<div class="details-item" style="width:80px;">Mobile:</div>';
                    previewQuote += '<div class="details-item" style="width:110px;">0474 587 149</div>';
                    previewQuote += '<div style="clear:both;"></div>';
                    previewQuote += '</div>';

                    previewQuote += '<div class="pdf-container">';
                    previewQuote += '<div class="details-item" style="width:160px;">Email:</div>';
                    previewQuote += '<div class="details-item" style="width:290px;">admin@readyresources.com</div>';
                    previewQuote += '<div class="details-item" style="width:80px;">Office:</div>';
                    previewQuote += '<div class="details-item" style="width:110px;">1300 353 936</div>';
                    previewQuote += '<div style="clear:both;"></div>';
                    previewQuote += '</div>';

                    previewQuote += '<div class="pdf-container">';
                    previewQuote += '<div class="details-item" style="width:70px;">NOTES:</div>';
                    previewQuote += '<div class="details-item" style="width:310px;">Some notes added</div>';
                    previewQuote += '<div class="details-item" style="width:150px;">Outline Agreement:</div>';
                    previewQuote += '<div class="details-item" style="width:110px;">3700002509</div>';
                    previewQuote += '<div style="clear:both;"></div>';
                    previewQuote += '</div>';

                previewQuote += '</div>';

            previewQuote += '</div>';//END QUOTE HEADING

            previewQuote += '<div id="quote-row-headings">';

                //HEADINGS
                previewQuote += '<div class="quote-border-heading">';

                    previewQuote += '<div id="quote-headings" class="pdf-container-headings-display">';
                    previewQuote += '<div class="header-item" style="width:50px;">ITEM</div>';
                    previewQuote += '<div class="header-item" style="width:50px;">QTY</div>';
                    previewQuote += '<div class="header-item" style="width:300px;">Description</div>';
                    previewQuote += '<div class="header-item" style="width:80px;">Unit Price</div>';
                    previewQuote += '<div class="header-item" style="width:50px;">UOM</div>';
                    previewQuote += '<div id="quote-heading-right" class="header-item-right-display">Ext. Price $</div>';
                    previewQuote += '<div style="clear:both;"></div>';
                    previewQuote += '</div>';

                previewQuote += '</div>';

            previewQuote += '</div>';//END QUOTE ROW HEADING

            previewQuote += '<div id="quote-rows"></div>';

            //QUOTE ADDED
            previewQuote += '<div id="quote-extras"></div>';
    
            previewQuote += '</div>';//END QUOTE ROWS
    
            //QUOTE SUMMARY/TOTAL
            previewQuote += '<div id="quote-summary-total">';

                previewQuote += '<div id="quote-terms-container" class="quote-terms-container-display">';

                    previewQuote += '<div id="quote-terms" class="quote-terms-display">';
                    previewQuote += '<span style="font-weight:bold;">Terms & Conditions:</span><br>';
                    previewQuote += '* Any travel time applicable to this quote will be calculated at invoice.<br>';
                    previewQuote += '* Variations to quote to be approved by principal and supplier.<br>';
                    previewQuote += '* Please contact Ready Resources if there are queries regarding this quote.';
                    previewQuote += '</div>';

                previewQuote += '</div>';

                previewQuote += '<div id="quote-totals-container" class="quote-totals-container-display">';

                    previewQuote += '<div class="sub-total-desc-box-display">Sub-Total</div>';
                    previewQuote += '<div id="quote-sub-total"  class="sub-total-box-display"></div>';
                    previewQuote += '<div style="clear:both;"></div>';

                    previewQuote += '<div class="sub-total-desc-box-display">GST</div>';
                    previewQuote += '<div id="quote-gst"  class="sub-total-box-display"></div>';
                    previewQuote += '<div style="clear:both;"></div>';

                    previewQuote += '<div class="sub-total-desc-box-display">TOTAL</div>';
                    previewQuote += '<div id="quote-total"  class="total-box-display"></div>';
                    previewQuote += '<div style="clear:both;"></div>';

                previewQuote += '</div>';

                previewQuote += '<div style="clear:both;"></div>';

            previewQuote += '</div>';

        //CLOSE QUOTE BODY
        previewQuote += '</div>';

        //CLOSE QUOTE CONTAINER

        previewQuote += '<div style="clear:both;"></div>';

    previewQuote += '</div>';//CLOSE INNER PAGE
    previewQuote += '</div>';
    previewQuote += '</div>';

    $("#workspace").append(previewQuote);

    //ADD ANY QUOTE EXTRAS

    console.log("QUOTE REQ:", param);

    $.ajax({
        url: "/request/" + param,
        type: "GET",
        async: false,
    }).done(function (response) {

        console.log("QE RESP: ", response);
        
        requestDetails = response;
        
        console.log("REQUEST RESPONSE: ", requestDetails);

        if(requestDetails.ws_quote_extras !== null) {

           var requestQuoteExtras = requestDetails.ws_quote_extras;
           
            if(requestQuoteExtras.length > 0){
                var extras = JSON.parse(requestDetails.ws_quote_extras);
            } else {
                var extras = {};
            }

            localStorage.setItem('quote-extras-length',extras.length);

            console.log("QEXX: ", extras);

            if (extras.length > 0) {

                console.log("QEX: ",extras.length);

                var quoteExtras = '';
                var numExtras = extras.length;
                var extrasSubTotal = 0

                for (var e = 0; e < numExtras; e++) {

                    var itemExtraDesc = extras[e]['description'];
                    var itemExtraRate = extras[e]['value'];
                    itemExtraRate = parseFloat(itemExtraRate).toFixed(2);

                    extrasSubTotal = parseFloat(extrasSubTotal) + parseFloat(itemExtraRate);
                    
                    if(e == 0) {

                        quoteExtras += '<div class="quote-border-row emp-block">';
                        quoteExtras += '<div class="pdf-container">';
                        quoteExtras += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                        quoteExtras += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                        quoteExtras += '<div class="row-item align-left" style="width:300px;"><span style="font-weight:bold;">Extras:</span></div>';
                        quoteExtras += '<div class="row-item" style="width:80px;">&nbsp;</div>';
                        quoteExtras += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                        quoteExtras += '<div class="row-item-right-display" style="width:90px;">&nbsp;</div>';
                        quoteExtras += '<div style="clear:both;"></div>';
                        quoteExtras += '</div>';
                        quoteExtras += '</div>';

                        if(extras.length == 1){
                            quoteExtras += '<div class="quote-border-bottom emp-block">';
                        } else {
                            quoteExtras += '<div class="quote-border-row emp-block">';
                        }
                        
                        quoteExtras += '<div class="pdf-container">';
                        quoteExtras += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                        quoteExtras += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                        quoteExtras += '<div class="row-item align-left" style="width:300px;">' + itemExtraDesc + '</div>';
                        quoteExtras += '<div class="row-item" style="width:80px;">&nbsp</div>';
                        quoteExtras += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                        quoteExtras += '<div class="row-item-right-display" style="width:90px;">' + itemExtraRate + '</div>';
                        quoteExtras += '<div style="clear:both;"></div>';
                        quoteExtras += '</div>';
                        quoteExtras += '</div>';

                    } else if(e == parseInt(numExtras) -1) {    

                        quoteExtras += '<div class="quote-border-bottom emp-block">';
                        quoteExtras += '<div class="pdf-container">';
                        quoteExtras += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                        quoteExtras += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                        quoteExtras += '<div class="row-item align-left" style="width:300px;">' + itemExtraDesc + '</div>';
                        quoteExtras += '<div class="row-item" style="width:80px;">&nbsp</div>';
                        quoteExtras += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                        quoteExtras += '<div class="row-item-right-display" style="width:90px;">' + itemExtraRate + '</div>';
                        quoteExtras += '<div style="clear:both;"></div>';
                        quoteExtras += '</div>';
                        quoteExtras += '</div>';

                    } else {

                        quoteExtras += '<div class="quote-border-row emp-block">';
                        quoteExtras += '<div class="pdf-container">';
                        quoteExtras += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                        quoteExtras += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                        quoteExtras += '<div class="row-item align-left" style="width:300px;">' + itemExtraDesc + '</div>';
                        quoteExtras += '<div class="row-item" style="width:80px;">&nbsp</div>';
                        quoteExtras += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                        quoteExtras += '<div class="row-item-right-display" style="width:90px;">' + itemExtraRate + '</div>';
                        quoteExtras += '<div style="clear:both;"></div>';
                        quoteExtras += '</div>';
                        quoteExtras += '</div>';

                    }
                }

                console.log("EXTRAS DISP: ", quoteExtras);
                console.log("EST: ", extrasSubTotal);

                localStorage.setItem('quote-extras-subtotal',extrasSubTotal);

                $("#quote-extras").append(quoteExtras);

            }

        } else {
            localStorage.setItem('quote-extras-subtotal',0);
        }

    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    });
    
    //ADD THE QUOTE SWINGS

    $.ajax({
        url: "/newbookings/quote/" + param,
        type: "GET",
        async: false,
    }).done(function (response) {

        console.log("BOOKINGS: ", response);

        var bookings = response;

        if (bookings.length > 0) {

            console.log("QB: ",bookings.length);

            var quoteBookings = '';
            var numBookings = bookings.length;
            var quoteSubTotal = 0
            var quoteItem = 0;

            for (var b = 0; b < numBookings; b++) {

                var itemRateCode = bookings[b]['rate_code'];
                var itemDesc = bookings[b]['trade_type'];
                var itemDescTxt = itemDesc + '-MEM-' + itemRateCode;   
                var shiftDetails = bookings[b]['shifts'];
                
                var shiftDisplay = '';

                for (var s = 0; s < shiftDetails.length; s++) {

                    var empName = shiftDetails[s]['emp_name'];
                    var empSwings = shiftDetails[s]['emp_shifts'];

                    console.log("EMP SWINGS: ", empSwings);
 
                    shiftDisplay += '<div class="pdf-container" style="border:0px solid orange;">';
                    shiftDisplay += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                    shiftDisplay += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                    shiftDisplay += '<div class="row-item align-left" style="width:300px;"><em>' + empName + ': </em></div>';
                    shiftDisplay += '<div class="row-item" style="width:80px;">&nbsp;</div>';
                    shiftDisplay += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                    shiftDisplay += '<div class="row-item-right-display" style="width:90px;">&nbsp;</div>';
                    shiftDisplay += '<div style="clear:both;"></div>';
                    shiftDisplay += '</div>';

                    for (var w = 0; w < empSwings.length; w++) {

                        quoteItem = quoteItem + 1;

                        var shiftHours = empSwings[w]['shift_hours'];
                        var shiftRate = empSwings[w]['shift_rate'];
                        shiftRate = parseFloat(shiftRate).toFixed(2);
                        var shiftExt = shiftHours * shiftRate;
                        shiftExtensionDisp = shiftExt.toFixed(2);

                        quoteSubTotal = quoteSubTotal + shiftExt;    

                        console.log("EMP SWING: ", empSwings[w]['start_day']);
                        
                        shiftDisplay += '<div class="pdf-container" style="border:0px solid purple;">';
                        shiftDisplay += '<div class="row-item" style="width:50px;">'+ quoteItem + '</div>';
                        shiftDisplay += '<div class="row-item" style="width:50px;">' + shiftHours + '</div>';
                        shiftDisplay += '<div class="row-item align-left" style="width:300px;">'   
                        shiftDisplay += '&nbsp;&nbsp;' + empSwings[w]['start_day'] + ' - ' + empSwings[w]['end_day'] + '<br>';
                        shiftDisplay += '&nbsp;&nbsp;# Day Shifts: ' + empSwings[w]['day_shifts'];
                        shiftDisplay += '&nbsp;&nbsp;# Night Shifts: ' + empSwings[w]['night_shifts'];
                        shiftDisplay += '<br>';
                        shiftDisplay += '</div>';
                        shiftDisplay += '<div class="row-item" style="width:80px;">' + shiftRate + '</div>';
                        shiftDisplay += '<div class="row-item" style="width:50px;">Hour</div>';
                        shiftDisplay += '<div class="row-item-right-display" style="width:90px;">' + shiftExtensionDisp + '</div>';
                        shiftDisplay += '<div style="clear:both;"></div>';
                        shiftDisplay += '</div>';
                    
                    }
                }

                if(b == parseInt(numBookings) -1) {

                    quoteBookings += '<div class="quote-border-bottom emp-block">';
                    quoteBookings += '<div class="pdf-container" style="border:0px solid blue;">';
                    quoteBookings += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                    quoteBookings += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                    quoteBookings += '<div class="row-item align-left" style="width:300px;"><span style="font-weight:bold;">' + itemDescTxt + '</span></div>';
                    quoteBookings += '<div class="row-item" style="width:80px;">&nbsp;</div>';
                    quoteBookings += '<div class="row-item" style="width:50px;">&nbsp</div>';
                    quoteBookings += '<div class="row-item-right-display" style="width:90px;">&nbsp;</div>';
                    quoteBookings += '<div style="clear:both;"></div>';
                    quoteBookings += '<div style="clear:both;"></div>';
                    quoteBookings += '</div>';
                    quoteBookings += shiftDisplay;
                    quoteBookings += '</div>';

                } else {

                    quoteBookings += '<div class="quote-border-row emp-block" style="border:1px solid green;">';
                    quoteBookings += '<div class="pdf-container" style="border:1px solid blue;">';
                    quoteBookings += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                    quoteBookings += '<div class="row-item" style="width:50px;">&nbsp;</div>';
                    quoteBookings += '<div class="row-item align-left" style="width:300px;"><span style="font-weight:bold;">' + itemDescTxt + '</span></div>';
                    quoteBookings += '<div class="row-item" style="width:80px;">&nbsp;</div>';
                    quoteBookings += '<div class="row-item" style="width:50px;">&nbsp</div>';
                    quoteBookings += '<div class="row-item-right-display" style="width:90px;">&nbsp;</div>';
                    quoteBookings += '<div style="clear:both;"></div>';
                    quoteBookings += '<div style="clear:both;"></div>';
                    quoteBookings += '</div>';
                    quoteBookings += shiftDisplay;
                    quoteBookings += '</div>';

                }
            }

            $("#quote-rows").append(quoteBookings);

            $("#quote-sub-total").html("");
            $("#quote-gst").html("");
            $("#quote-total").html("");

            var addExtrasSubTotal = localStorage.getItem('quote-extras-subtotal');

            if(parseFloat(addExtrasSubTotal) > 0){
                quoteSubTotal = parseFloat(quoteSubTotal) + parseFloat(addExtrasSubTotal);
            }

            quoteSubTotal = quoteSubTotal.toFixed(2);
            $("#quote-sub-total").append(quoteSubTotal);

            var quoteGst = quoteSubTotal * 10 /100;
            quoteGst = quoteGst.toFixed(2);
            $("#quote-gst").append(quoteGst);

            var quoteTotal = parseFloat(quoteSubTotal) + parseFloat(quoteGst);
            quoteTotal = quoteTotal.toFixed(2);
            $("#quote-total").append(quoteTotal);

        }

    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    });

    //createRioPdfs(param);

    $("#work-space-header").html("");

    var workSpaceQuotePreviewHeader = '<h1 class="w3-xlarge w3-left"><b>Request Quote</b></h1>';
    workSpaceQuotePreviewHeader += '<button id="workspace-view-requests" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin:0 0 10px 10px;">View Requests</button>';
    workSpaceQuotePreviewHeader += '<button id="cancel-quote-action-' + param + '" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin:0 0 10px 10px;">Back to Quotes</button>';
    workSpaceQuotePreviewHeader += '<button id="quote-generate-pdf-' + param + '" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin-bottom:10px;">Generate Quote PDF</button>';

    $("#work-space-header").append(workSpaceQuotePreviewHeader);

});

function actionView(param) {

    $("#sidebar-right").html("");

    var requestBookings = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    requestBookings += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">View Request Shifts</div>';
    requestBookings += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    requestBookings += '</div>';
    requestBookings += '<div class="w3-center" style="margin-top:10px;">';
    //requestBookings += '<button class="cancel-request-update w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    //requestBookings += '<button id="view-request-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium">View</button>';
    requestBookings += '</div>';
    requestBookings += '</div>';
    requestBookings += '<div id="bookings-display"></div>';

    $("#sidebar-right").append(requestBookings);

    var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    $("#bookings-display").append(spinHtml);

    $.ajax({
        url: '/bookings/request/' + param,
        type: "GET"
    }).done(function (response) {

        console.log("BOOKINGS: ", response);
        var bookings = response;

        var bookingsDisplay = '<div style="width:100%;padding:10px;border:0px solid blue;">';

        bookingsDisplay += '<h4 style="margin:0 0 15px 0;">Request Shifts</h4>';

        if (bookings.length > 0) {

            var count = 0;

            for (var b = 0; b < bookings.length; b++) {

                count++;

                var len = bookings.length;

                var currentTradeType = bookings[b]['trade_type'];
                var previousTradeType = bookings[(b+len-1)%len]['trade_type'];
                var nextTradeType = bookings[(b+1)%len]['trade_type'];
                var nextBooking = bookings[(b+1)%len];

                var tranId = bookings[b]['TranId'];
                var tradeType = bookings[b]['trade_type'];
                var empName = bookings[b]['emp_name'];
                var startDate = bookings[b]['start_date'];
                var startTime = bookings[b]['start_time'];
                var endDate = bookings[b]['end_date'];
                var endTime = bookings[b]['end_time'];
                var bookingId = bookings[b]['BookingId'];
                var batchId = bookings[b]['BatchId'];
                var shiftId = bookings[b]['ShiftId'];
                var userId = bookings[b]['UserId'];

                if(b == 0) {
                    bookingsDisplay += '<h4>' + tradeType + '</h4>';
                    bookingsDisplay += '<ul class="w3-ul w3-card-4 w3-hoverable">';
                }

                bookingsDisplay += '<li class="w3-bar">';
                //bookingsDisplay += '<div class="travel w3-button w3-medium w3-darkblue w3-right">Travel</div>';
                bookingsDisplay += '<div id="edit-booking-' + param + '-' + bookingId + '" class="w3-button w3-medium w3-darkblue w3-right" style="margin-right:10px;">Edit</div>';

                bookingsDisplay += '<div class="w3-left"><input type="checkbox" class="w3-check"></div>';
                bookingsDisplay += '<div class="w3-left">';
                bookingsDisplay += '<span class="w3-large" style="padding-left:10px;">' + empName + '<br>';
                bookingsDisplay += '&nbsp;&nbsp;(' + startDate +  ' - ' + endDate + ')<br>';
                bookingsDisplay += '<span style="padding-left:10px;">Booking ID:' + bookingId + '</span><br>';
                bookingsDisplay += '<span style="padding-left:10px;">Batch ID:' + batchId + '</span><br>';
                bookingsDisplay += '<span style="padding-left:10px;">Shift ID:' + shiftId + '</span>';
                bookingsDisplay += '</div>';
                bookingsDisplay += '</li>'

                //console.log("CURR: ",currentTradeType);
                //console.log("NEXT: ",nextTradeType);
                //console.log(b);
                //console.log(count);

                if((count < len) && currentTradeType != nextTradeType){
                    bookingsDisplay += '</ul>';
                    bookingsDisplay += '<h4>' + nextTradeType + '</h4>';
                    bookingsDisplay += '<ul class="w3-ul w3-card-4 w3-hoverable">';
                }

            }

            bookingsDisplay += '</ul>';
            bookingsDisplay += '</div>';

        } else {
            bookingsDisplay += '<div style="margin:15px 0 0 15px;font-weight:bold;color:red;">No Shifts Found</div>';
        }

        $("#bookings-display").html("");
        $("#bookings-display").append(bookingsDisplay);

    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    });
}

function actionQuote(param) {

    $("#sidebar-right").html("");

    var actionQuote = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    actionQuote += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Rio Quote - Request # ' + param + '</div>';
    actionQuote += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    actionQuote += '</div>';
    actionQuote += '<div class="w3-center" style="margin-top:10px;">';
    actionQuote += '<button id="quote-extras-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Extras</button>';
    actionQuote += '<button id="prepare-quote-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Prepare</button>';
    actionQuote += '<button id="view-quote-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">View</button>';
    actionQuote += '<button id="email-quote-doc-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Email</button>';
    actionQuote += '<button class="cancel-request-update w3-button w3-darkblue w3-mobile w3-medium">Cancel</button>';
    actionQuote += '</div>';
    actionQuote += '</div>';

    $("#sidebar-right").append(actionQuote);
}

/////////SWINGS ADDED

//SAVE SWING
$("#sidebar-right").on('click', '#cancel-save-swing-template', function (e) {
    //CANCEL SWING
    e.preventDefault();

    $("#sidebar-right").html("");
    $("#sidebar-right").css({"width": "0px"});
});    

//SAVING SWINGS

$("#sidebar-right").on('click', '#save-swing-template', function (e) {

    //alert("SAVING");
    console.log("SAVING SWINGS");
    
    e.preventDefault();

    $("#scheduler-template-form").find("div.error").removeClass('error').addClass("noerror");
    $("#scheduler-template-form").find("input.required").removeClass('required');
    $("#scheduler-template-form").find("select.required").removeClass('required');

    var errCount = 0;
    var errMsgArray = [];

    if($("#swing_request-1").val() == 'NA') {        
        errCount++;
        errMsgArray.push({
            "id": "swing_request-1",
            "msg": 'A Request must be selected'
        });
    }
    
    if($("#swing_emps-1").val() === null) {           
        errCount++;
        errMsgArray.push({
            "id": "swing_emps-1",
            "msg": 'At least 1 Employee must be selected'
        });
    }

    $("#template-actions").find("button").each(function(){
        if(this.id != 'save-swing-template' 
            && this.id != 'save-as-swing-template'
            && this.id != 'cancel-save-swing-template' 
            && this.id != 'auto-date-template' 
            && this.id != 'reset-template-swings'
        ){    
            var thisCheckId = $(this).prop('id');
            checkFields = thisCheckId.split('-').pop();
        }
    });
    
    checkFields = parseInt(checkFields) + 1;
    
    for (var c = 1; c < checkFields; c++) {
    
        if($("[id^=swing_type-" + c).val() == 'NA') {                  
            errCount++;
            errMsgArray.push({
                "id": "swing_type-" + c,
                "msg": 'A Swing Type must be selected'
            });
        }

        if($("#swing_start_date-" + c).val().length < 1) {
            errCount++;
            errMsgArray.push({
                "id": "swing_start_date-" + c,
                "msg": 'A Start Day must be selected'
            });
        }

        if($("#swing_trade_type-" + c).val() == 'NA') {
            errCount++;
            errMsgArray.push({
                "id": "swing_trade_type-" + c,
                "msg": 'A Swing Trade Type must be selected'
            });
        }

        if($("#swing_recurrence-" + c).val().length < 1) {
            errCount++;
            errMsgArray.push({
                "id": "swing_recurrence-" + c,
                "msg": 'A Recurring Number of days must be provided'
            });
        }
    }
    
    //CHECK START DATES

    //var startDateCheck = $("#swing_start_date-1").val();
    //var baseDateArray = startDateCheck.split("-");
    //var baseDateFormat = new Date( baseDateArray[2], baseDateArray[1] - 1, baseDateArray[0]);
    //var baseDatedateStr = baseDateFormat.getTime();

    var startDayCounter = 0;
    
    $('#scheduler-template-form .start-day').each(function(){
        startDayCounter++;
    });

    console.log("START DAY COUNTER______ ", startDayCounter);

    startDayCounter = parseInt(startDayCounter) + 1;

    for (var s = 2; s < startDayCounter ; s++) {

        var prevStartDate = $("#swing_start_date-" + (s-1)).val();
        console.log("PREV START DATE______ ", prevStartDate);

        var baseDateArray = prevStartDate.split("-");
        var baseDateFormat = new Date( baseDateArray[2], baseDateArray[1] - 1, baseDateArray[0]);
        var baseDateStr = baseDateFormat.getTime();
        console.log("BASE DATE STR:____",baseDateStr);

        var thisStartDate = $("#swing_start_date-" + s).val();
        console.log("THIS START DATE______ ", thisStartDate);
        
        var nextDateArray = thisStartDate.split("-");
        var nextDateFormat = new Date( nextDateArray[2], nextDateArray[1] - 1, nextDateArray[0]);
        var nextDateStr = nextDateFormat.getTime();

        console.log("NEXT DATE STR:____",nextDateStr);

        var rawDateDiff = parseInt(nextDateStr) - parseInt(baseDateStr);
        console.log("RAW DIFF:_____", rawDateDiff);

        var prevRecurrDays = $("#swing_recurrence-" + (s-1)).val();
        var timeAddition = parseInt(prevRecurrDays) * 24 * 60 * 60 * 1000;
        console.log("TADD___", timeAddition);

        var nextSwingDateStr = parseInt(baseDateStr) + parseInt(timeAddition);
        var checkNextDate = new Date(nextSwingDateStr);

        var dateDiff = parseInt(nextDateStr) - parseInt(nextSwingDateStr);
        var dateDiffDays = dateDiff / (24 * 60 * 60 * 1000);

        console.log("BASE DATE DIFF: ", dateDiff);
        console.log("BASE DATE DIFF DAYS: ", dateDiffDays);

        var curr_date = checkNextDate.getDate();
        var curr_month = checkNextDate.getMonth() + 1;
        var curr_year = checkNextDate.getFullYear();

        var swingDateFormat = curr_date + "-" + curr_month + "-" + curr_year;

        console.log("CHECK NEXT START DATE:_______", swingDateFormat);

        //CHECK IF THIS START DATE IS NOT LESS THAN THE PREVIOUS START DATE + PREVIOUS RECURR DAYS

        if(dateDiff < 0){

            errCount++;
            errMsgArray.push({
                "id": "swing_start_date-" + s,
                "msg": 'Start Date must be later than the previous Start Date plus the Recur Days'
            });

        }

    }  

    //CHECK STORED TRADE TYPES

    var storedTradesErrors = localStorage.getItem('swing-trade-type-errors');
    var storedTradesErrorsObj = JSON.parse(storedTradesErrors);

    console.log(storedTradesErrorsObj);

    if(storedTradesErrorsObj != null){

        var thisSwing = storedTradesErrorsObj.tempId;
        var thisMessage = storedTradesErrorsObj.message;
        
        errCount++;
        errMsgArray.push({
            "id": "swing_trade_type-" + thisSwing,
            "msg": thisMessage
        });
    }

    //CHECK FOR SAME SWING TYPES
    
    if($("#swing_emps-1").val() !== null && $("#swing_emps-1").val() !== "undefined"){
        var checkNumEmps = $("#swing_emps-1").val();
    } else {
        var checkNumEmps = 'NA';
    }

    console.log("NUM EMPS:_______ ", checkNumEmps);
    console.log("NUM EMPS LENGTH:_______ ", checkNumEmps.length);

    //GET NUMBER OF EMPS

    if(checkNumEmps.length > 1){

        var checkTypeValue = $("#swing_trade_type-1").val();

        $('#scheduler-template-form .trade-types').each(function(){
                        
            var thisFilter = $(this).prop('id');
            //console.log("FILTER: ", thisFilter);
            var thischeckType = $("#" + thisFilter).val();

            var thisId = thisFilter.split('-').pop();

            if(thischeckType != checkTypeValue){
                
                errCount++;
                errMsgArray.push({
                    "id": "swing_trade_type-" + thisId,
                    "msg": 'For multiple Employees, only one Trade Type can be applied to all Swings'
                });

            }

        });

    }

    //errCount = 1;

    console.log("ERROR COUNT: ", errCount);
    
    if(errCount > 0){

        for (var e = 0; e < errMsgArray.length; e++) {

            var errorId = errMsgArray[e]['id'];
            var errorMsg = errMsgArray[e]['msg'];

            if(errorId == 'swing_emps-1'){
                $("#swing_emps_error-1").removeClass('noerror');
                $("#swing_emps_error-1").addClass('error');
            } else {    
                $("#" + errorId).addClass('required');
                $("#" + errorId + "_error").removeClass('noerror');
                $("#" + errorId + "_error").addClass('error');
            }
            
            if(errorId == 'swing_emps-1'){
                $("#swing_emps_error-1").html(errorMsg);    
            } else {
                $("#" + errorId + "_error").html(errorMsg);
            }
        }

        alert("There are errors that require correcting");

    } else {
    
        //alert("HEREXX");
        
        var requestForm = $("#scheduler-template-form").serialize();

        $.ajax({
            url: 'scheduler/template',
            type: "POST",
            data: {
                "form": requestForm
            },
            success: function (response) {
                console.log("CRRESP", response);
                var status = response.status;
                var templateArray = response.template_array;
                console.log("KKMY TEMPLATE: ", templateArray);
                //alert("SETTING");
                localStorage.setItem('scheduler-template-last-stored',templateArray);

                var resetEmps = [];
                localStorage.setItem('scheduler-templates-employees', JSON.stringify(resetEmps));
                
                $("#ws-snackbar").html("Swings were Successfully Updated")
                
                showSnackbar("ws-snackbar", '/workspace');
                
                //alert("Swings were Successfully Updated")

                //window.location.assign('/workspace');
            }
        });
    }
});

//REMOVE SWING

$("#sidebar-right").on('click', '[id^=remove_swing-]', function (e) {

    e.preventDefault();
    
    var thisId = $(this).prop('id');
    var tempId = thisId.split('-').pop();

    console.log("REMOVE: ", tempId);

    $("#swing-" + tempId).remove();
    $("#swing_request-" + tempId).remove();
    $("#swing_reference-" + tempId).remove();
    $("#swing_emps-" + tempId).remove();

    var selIndex = 2;

    $('#add-next-2').children().each(function() {

        var targetId = $(this).prop("id");
        var res = targetId.substring(0, 6);

        console.log("SEL INDEX:", selIndex);

        if(res == 'swing-') {    

            console.log("NEW TEMP ID: ", selIndex);
            
            var thisSwingTempId = this.id;

            $("#" + this.id).prop("id", "swing-" + selIndex);

            var thisTempIdPrefixArray = thisSwingTempId.split("-");
            var thisTempId = thisTempIdPrefixArray[1];

            $("#swing_request-" + thisTempId).prop("id", "swing_request-" + selIndex);
            $("#swing_request-" + selIndex).prop("name", "swing_request-" + selIndex);
            $("#swing_reference-" + thisTempId).prop("id", "swing_reference-" + selIndex);
            $("#swing_reference-" + selIndex).prop("name", "swing_reference-" + selIndex);
            $("#swing_emps-" + thisTempId).prop("id", "swing_emps-" + selIndex);
            $("#swing_emps-" + selIndex).prop("name", "swing_emps-" + selIndex);
            
            $(this).find("h3").each(function(){
                $(this).html("Swing " + selIndex); 
            });    
            
            $(this).find("input").each(function(){
                
                //console.log(this.id); 
                var thisId = this.id;
                var thisIdPrefixArray = thisId.split("-");
                var thisIdPrefix = thisIdPrefixArray[0];
                var thisIdIndex = thisIdPrefixArray[1];
                var thisNewPrefix = thisIdPrefix + "-" + selIndex; 

                $(this).prop("id", thisNewPrefix);
                
                if(thisIdPrefix == 'day_shift' || thisIdPrefix == 'night_shift'){
                    var shiftTimePrefix = "shift_time-" + selIndex;
                    $(this).prop("name", shiftTimePrefix);    
                } else {
                    $(this).prop("name", thisNewPrefix);
                }
                
                var thisError = thisIdPrefix + "-" + thisIdIndex + "_error";
                var thisNewError = thisIdPrefix + "-" + selIndex + "_error";
                
                $("#" + thisError).prop("id", thisNewError);

            });

            $(this).find("select").each(function(){
                
                //console.log(this.id); 
                var thisSelectId = this.id;
                var thisSelectIdPrefixArray = thisSelectId.split("-");
                var thisSelectIdPrefix = thisSelectIdPrefixArray[0];
                var thisSelectIdIndex = thisSelectIdPrefixArray[1];
                var thisNewSelectPrefix = thisSelectIdPrefix + "-" + selIndex; 

                $(this).prop("id", thisNewSelectPrefix);
                $(this).prop("name", thisNewSelectPrefix);

                var thisSelectError = thisSelectIdPrefix + "-" + thisSelectIdIndex + "_error";
                var thisSelectNewError = thisSelectIdPrefix + "-" + selIndex + "_error";
                
                $("#" + thisSelectError).prop("id", thisSelectNewError);
            });

            $(this).find("button").each(function(){
                
                //console.log(this.id); 
                $("#" + this.id).prop("id", "remove_swing-" + selIndex);
            }); 

            selIndex++;
        }
        //console.log("FINAL SEL INDEX: ",selIndex);
    });

    $("#template-actions").find("button").each(function(){
              
        //console.log(this.id); 
        var inputs = $("#add-next-2").find($("input") );  
        var numInputs = inputs.length;
        console.log("INPUTS: ",numInputs);

        var adjSelIndex = parseInt(selIndex) - 1;

        if(this.id != 'save-swing-template' 
            && this.id != 'save-as-swing-template'
            && this.id != 'cancel-save-swing-template' 
            && this.id != 'auto-date-template' 
            && this.id != 'reset-template-swings'
        ){    
            if(numInputs > 0){
                $("#" + this.id).prop("id", "next_swing-" + adjSelIndex);
            } else {
                $("#" + this.id).prop("id", "next_swing-1");
            }    
        }
    }); 
});

//NEXT SWING
$("#sidebar-right").on('click', '[id^=next_swing-]', function (e) {

    //NEXT SWING
    
    e.preventDefault(); 
    
    var thisId = $(this).prop('id');
    var tempId = thisId.split('-').pop();

    var nextId = parseInt(tempId) + 1;

    nextSwing(tempId, nextId);

});

function nextSwing(tempId, nextId) {

    var followingId = parseInt(nextId) + 1;

    //console.log("TEMPID: ", tempId);
    //console.log("NEXTID: ", nextId);
    //console.log("FOLLID: ", followingId);

    var thisRequestId = $("#swing_request-1").val(); 
    var thisRequestRef = $("#swing_reference-1").val();
    var thisRequestTrades = $("#swing_trades-1").val();  
    var thisSwingEmps = $("#swing_emps-1").val();
    var thisSwingTrade = $("#swing_trade_type-1").val();

    console.log("THIS SWING EMPS: " + thisSwingEmps);

    //SHOULD BE THE VALUE OF THE LOCAL STORAGE

    $checkErrors = 0;
    $checkErrorsMsg = '';
    
    if(thisRequestId == 'NA'){
        $checkErrors++;
        $checkErrorsMsg += '<p class="error">A request must be selected before adding Another Swing.</p>'
    }

    if(thisSwingEmps === null){
        $checkErrors++;
        $checkErrorsMsg += '<p class="error">At least 1 Employee be selected before adding Another Swing.</p>'
    }

    if(thisSwingTrade === null){
        $checkErrors++;
        $checkErrorsMsg += '<p class="error">A Swing Trade Type must be selected before adding Another Swing.</p>'
    }

    if($checkErrors > 0){
        
        document.getElementById("add-swing-error-modal").style.display = "block";
        $("#swing-error-display").html($checkErrorsMsg);
    
    } else {
    
        var nextTemplate = '<div>';

        var nextTemplate = '<input type="hidden" id="swing_request-' + nextId + '" name="swing_request-' + nextId + '" value="' + thisRequestId + '">';
        nextTemplate += '<input type="hidden" id="swing_reference-' + nextId + '" name="swing_reference-' + nextId + '" value="' + thisRequestRef + '">';
        //ADDED 0504
        nextTemplate += '<input type="hidden" id="swing_trades-' + nextId + '" name="swing_trades-' + nextId + '" value="' + thisRequestTrades + '">';


        nextTemplate += '<input type="hidden" id="swing_emps-' + nextId + '" name="swing_emps-' + nextId + '" value="' + thisSwingEmps + '">';

        nextTemplate += '<div id="swing-' + nextId + '" style="margin-top:20px;padding:0 10px 10px 10px;border:1px solid #CCC;box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19);">';
        
        nextTemplate += '<h3>Swing ' + nextId + ':</h3>';
        
        nextTemplate += '<div class="w3-row">';

        nextTemplate += '<div class="w3-half" style="padding:0 10px 10px 0;">';
        nextTemplate += '<label>Swing Type<span class="required-label">*</span></label>';
        nextTemplate += '<select name="swing_type-' + nextId + '" id="swing_type-' + nextId + '" class="w3-select w3-border input-display">';
        nextTemplate += '<option value="NA">Select a Swing Type</option>';
        nextTemplate += '<option value="On">On</option>';
        nextTemplate += '<option value="Off">Off</option>';
        nextTemplate += '</select>';
        nextTemplate += '<div id="swing_type-' + nextId + '_error" class="noerror" ></div>';
        nextTemplate += '</div>';

        nextTemplate += '<div class="w3-half" style="padding:0 10px 10px 0;">';
        nextTemplate += '<label>Start Day<span class="required-label">*</span></label>';
        nextTemplate += '<input name="swing_start_date-' + nextId + '" id="swing_start_date-' + nextId + '" class="w3-input w3-border datepicker input-display start-day" type="text" readonly="readonly">';
        nextTemplate += '<div id="swing_start_date-' + nextId + '_error" class="noerror" ></div>';
        nextTemplate += '</div>';

        nextTemplate += '</div>';

        //SWING TRADE ADDED

        nextTemplate+= '<div class="w3-row">';

        nextTemplate+= '<div class="w3-half" style="padding:0 10px 10px 0;">';
        nextTemplate+= '<label>Trade Type<span class="required-label">*</span></label>';
        nextTemplate+= '<select name="swing_trade_type-' + nextId + '" id="swing_trade_type-' + nextId + '" class="w3-select w3-border input-display trade-types">';
        nextTemplate+= '</select>';
        nextTemplate+= '<div id="swing_trade_type-' + nextId + '_error" class="noerror" ></div>';
        nextTemplate+= '</div>';

        nextTemplate+= '</div>';

        nextTemplate += '<div class="w3-row">';

        nextTemplate += '<div id="swing_type_display" class="w3-half" style="padding:10px 0 10px 0px;">';

        nextTemplate += '<label style="margin:0;">Swing Time<span class="required-label"<span>*</span></label>';
        nextTemplate += '<div style="margin:0;">';
        nextTemplate += '<input id="day_shift-' + nextId + '" name="shift_time-' + nextId + '" class="w3-radio input-display" type="radio" value="D">';
        nextTemplate += '<label style="margin-left:5px;font-weight:normal;">Day</label>';
        nextTemplate += '<input id="night_shift-' + nextId + '" name="shift_time-' + nextId + '" class="w3-radio" type="radio" value="N" style="margin-left:10px;">';
        nextTemplate += '<label style="margin-left:5px;font-weight:normal;">Night</label>';
        nextTemplate += '</div>';
        nextTemplate += '</div>';//ITEM

        nextTemplate += '<div class="w3-quarter" style="padding:0 10px 10px 0;">';
        nextTemplate += '<label>Recur (Days)<span class="required-label">*</span></label>';
        nextTemplate += '<input name="swing_recurrence-' + nextId + '" id="swing_recurrence-' + nextId + '" class="w3-input w3-border input-display" type="text">';
        nextTemplate += '<div id="swing_recurrence-' + nextId + '_error" class="noerror" ></div>';
        nextTemplate += '</div>';//ITEM

        nextTemplate += '</div>';//ROW

        nextTemplate += '<div class="w3-center" style="margin-top:5px;">';
        nextTemplate += '<button id="remove_swing-' + nextId + '" class="w3-button w3-padding-medium w3-pink w3-margin-bottom" style="margin-top:15px;">Remove this Swing</button>';
        nextTemplate += '</div>';

        nextTemplate += '</div>';

        nextTemplate += '</div>';

        $("#add-next-2").append(nextTemplate);

        $("#day_shift-" + nextId).prop('checked',true);
        $("#night_shift-" + nextId).prop('checked',false);

        //SET NEXT SWING ID PROPERTY
        $("#next_swing-" + tempId).prop("id", "next_swing-" + nextId);

        //SET THE NEXT START DATE DEFAULT

        var prevTempId = parseInt(nextId) - 1;

        console.log("PREV TEMPID______", prevTempId);

        var prevStartDate = $("#swing_start_date-" + prevTempId).val();
        var prevRecurDate = $("#swing_recurrence-" + prevTempId).val();

        if(prevStartDate.length > 0 && prevRecurDate.length > 0){

            var shiftDateArray = prevStartDate.split("-");
            var shiftDateFormat = new Date( shiftDateArray[2], shiftDateArray[1] - 1, shiftDateArray[0]);
            var initShiftdateStr = shiftDateFormat.getTime();
            var timeAddition = parseInt(prevRecurDate) * 24 * 60 * 60 * 1000;
            var nextSwingDateStr = initShiftdateStr + timeAddition;

            var checkNextDate = new Date(nextSwingDateStr);
            var curr_date = checkNextDate.getDate();
            var curr_month = checkNextDate.getMonth() + 1;
            var curr_year = checkNextDate.getFullYear();

            var swingDateFormat = curr_date + "-" + curr_month + "-" + curr_year;

            //SET THE NEW DATE
            $("#swing_start_date-" + nextId).val(swingDateFormat);

        }

        if(thisRequestId != 'NA'){
            
            console.log("SETTING:");
            
            setNextRequestDetails(thisRequestId, nextId);
        }   

    }
}

//CHECK SWING TRADE TYPE

function getTradesCheck(tempId, prevTrade, empsSelected, tradeId){

    
    
    var checkData = '';
    
    $.ajax({
        url: '/emps/check',
        type: "POST",
        data: {
            "swing_id": tempId,
            "emps" : empsSelected,
            "prev_trade" : prevTrade,
            "trade" : tradeId
        },
        async: false,
        success: function (response) {
            //console.log("REQ DETS" , response);
            checkData = response;
        }
    });

    return checkData;

}

function checkSwingTrade(tempId, prevTrade, empsSelected, tradeId){
    
    //CHECK TRADES
    console.log("CHANGED: ",tempId);
    console.log("EMPS: ",empsSelected);
    console.log("TRADE: ",tradeId);

    var checkedTrades = getTradesCheck(tempId, prevTrade, empsSelected, tradeId);
    //console.log("CHECKED TRADES: ", checkedTrades);

    return checkedTrades;
    
}

$("#sidebar-right").on('change', '[id^=swing_trade_type]', function (e) {
    
    e.preventDefault();

    var thisId = $(this).prop('id');
    var tempId = thisId.split('-').pop();
    var tradeId = $(this).val();

    if(tradeId != 'NA'){
        
        if(tempId == 'edit'){
            var empsSelected = JSON.stringify($("#swing_emps-edit").val());
        } else {
            var empsSelected = JSON.stringify($("#swing_emps-1").val());
        }

        console.log("CHANGED: ",tempId);
        console.log("TRADE: ",tradeId);
        
        //GET THE PREV SWING TRADE SELECTED

        if(tempId == 1){
            var prevTrade = 0;
        } else {
            var prevTradeId = parseInt(tempId) - 1;
            var prevTrade = $("#swing_trade_type-" + prevTradeId).val()
        }

        var checkedTrades = checkSwingTrade(tempId, prevTrade, empsSelected, tradeId);

        console.log("CHECK TRADES____", checkedTrades);

        //LOOP THROUGH 
        checkErrors = checkedTrades['check_errors'];
        checkedTradesVal = checkedTrades['check_value'];
        checkedErrorType = checkedTrades['error_type'];

        var errorMsg = '';
        var empErrString = ''
        
        if(checkedErrorType == 'E'){
        
            console.log("CHK ERR: ", checkErrors);
            checkErrorsObj = JSON.parse(checkErrors);

            console.log("CHK ERR OBJ: ", checkErrorsObj);
            
            for (var e = 0; e < checkErrorsObj.length; e++) {
                emp_error = checkErrorsObj[e];
                if(e == parseInt(checkErrorsObj.length) -1){
                    empErrString += emp_error;
                } else {
                    empErrString += emp_error + ', ';
                }
            }    

            if(checkErrorsObj.length > 1){
                errorMsg += empErrString + " do not have the Trade selected";
            } else {
                errorMsg += empErrString + " does not have the Trade selected";
            }
            
        } else if(checkedErrorType == 'M'){
            errorMsg += "For multiple Employees, only one Trade Type can be applied to all Swings";
        }    

        var checkErrorsStored = {};

        checkErrorsStored.tempId = tempId;
        checkErrorsStored.message = errorMsg;

        console.log("ERRORS STORED: ", checkErrorsStored);

        localStorage.setItem('swing-trade-type-errors', JSON.stringify(checkErrorsStored));

        if(checkedErrorType == 0){
            localStorage.removeItem('swing-trade-type-errors');
        }

        //var errorMsg = "Selected Employees do not have the Trade selected";

        //SET ERRORS IN STORAGE"swing_trade_type-" + tempId

        var errId = "swing_trade_type-" + tempId;

        console.log("ERR ID: ", errId);

        if(!checkedTradesVal){
            $("#swing_trade_type-" + tempId).addClass('required');
            $("#swing_trade_type-" + tempId + "_error").removeClass('noerror');
            $("#swing_trade_type-" + tempId + "_error").addClass('error');
            $("#swing_trade_type-" + tempId + "_error").html(errorMsg);
        } else {
            $("#swing_trade_type-" + tempId).removeClass('required');
            $("#swing_trade_type-" + tempId + "_error").addClass('noerror');
            $("#swing_trade_type-" + tempId + "_error").removeClass('error');
            $("#swing_trade_type-" + tempId + "_error").html("");
        }
    }

});

//LOAD SWINGS TEMPLATE

$("#sidebar-right").on('click', '#load-swing-template', function (e) {

    //GET THE TEMPLATES

    $.ajax({
        url: 'scheduler/templates',
        type: "GET",
        success: function (response) {
            console.log(response);
            var templates = response;
            var displayTemplates = '<ul class="w3-ul w3-card-4 w3-hoverable">';
            
            for (var t = 0; t < templates.length; t++) {

                var templateDesc = templates[t]['template_desc'];
                var templateId = templates[t]['template_id'];

                displayTemplates += '<li class="w3-bar">';
                displayTemplates += '<div id="loading-swing-template-' + templateId + '" class="w3-button w3-medium w3-darkblue w3-right">Load</div>';
                displayTemplates += '<div class="w3-left">';
                displayTemplates += '<span class="w3-large">' + templateDesc + '</span><br>';
                displayTemplates += '</div>';
                displayTemplates += '</li>'
            }

            displayTemplates += '</ul>';
            displayTemplates += '</div>';  

            $("#scheduler-templates-display").html(displayTemplates);
        
        }
    });
    
    document.getElementById("load-scheduler-template-modal").style.display = "block";
    
});

$("body").on('click', '[id^=loading-swing-template]', function (e) {
    
    var thisId = $(this).prop('id');
    var templateId = thisId.split('-').pop();
    console.log("LOADINGX: ", templateId);

    $.ajax({
        url: 'scheduler/template/' + templateId,
        type: "GET",
        success: function (response) {
            
            console.log("RESP TEMP: ", response);

            var template = response[0];
            console.log("LOAD TEMP: ", template);
            
            var lastTemplateStored = template['template_json']; 
            console.log("LOAD JSON: ", lastTemplateStored);
                            
            var lastTemplateStoredArray = JSON.parse(lastTemplateStored);
            console.log(lastTemplateStoredArray);
            var setTemplateEmployees = lastTemplateStoredArray[0]['swing_emps'];

            currEmpsArray = setTemplateEmployees;

            console.log(currEmpsArray);

            localStorage.setItem('scheduler-templates-employees',JSON.stringify(currEmpsArray));

            $("#add-next-2").html("");

            for (var s = 0; s < lastTemplateStoredArray.length; s++) {
                
                if(s == 0){
                    var swingRequest = lastTemplateStoredArray[s]['swing_request']; 
                    $("#swing_request-1").val(swingRequest);
                    var swingReference = lastTemplateStoredArray[s]['swing_reference']; 
                    $("#swing_reference-1").val(swingReference);
                    var swingEmps = lastTemplateStoredArray[s]['swing_emps']; 
                    $("#swing_emps-1").val(swingEmps);
                    swingType = lastTemplateStoredArray[s]['swing_type']; 
                    $("#swing_type-1").val(swingType);
                    var swingStartDate = lastTemplateStoredArray[s]['swing_start_date']; 
                    $("#swing_start_date-1").val(swingStartDate);
                    var shiftTime = lastTemplateStoredArray[s]['shift_time'];
                    if(shiftTime == 'D') {
                        $("#day_shift").prop("checked", true);
                        $("#night_shift").prop("checked", false);
                    } else {
                        $("#day_shift").prop("checked", false);
                        $("#night_shift").prop("checked", true);
                    }
                    var swingRecurrence = lastTemplateStoredArray[s]['swing_recurrence']; 
                    $("#swing_recurrence-1").val(swingRecurrence);
                
                    $.ajax({
                        url: '/employees',
                        type: "get",
                    }).done(function (response) {
                        
                        console.log("EMPLOYEES X: ", response);
                        
                        var employees = response;
                        var swingEmployees = "";
                
                        for (var e = 0; e < employees.length; e++) {
                            
                            console.log("LOOP SELECT: ");
                            
                            empId = employees[e]['emp_id'];

                            console.log("EMP: ", e);
                                                    
                            if(currEmpsArray.includes(empId) == true){
                                var selected = 'selected';
                            } else {
                                var selected = '';
                            }   
                                
                            empName = employees[e]['emp_trade_initials'] + ' ' + employees[e]['first_name'] + ' ' + employees[e]['last_name'];            
                            swingEmployees += '<option value="' + empId + '" ' + selected + '>' + empName + '</option>';
                        }
                
                        $("#swing_emps-1").html("");
                        $("#swing_emps-1").append(swingEmployees);
                
                        $("#swing_emps-1").multiSelect({
                            afterSelect: function(values){
                
                                console.log("AFTER SELECT X");
                                
                                $('#scheduler-template-form .trade-types').each(function(){
                    
                                    var thisFilter = $(this).prop('id');
                                    //console.log("FILTER: ", thisFilter);
                                    $("#" + thisFilter).val("NA");
                
                                    localStorage.removeItem('swing-trade-type-errors');
                
                                    var thisId = thisFilter.split('-').pop();
                
                                    $("#swing_trade_type-" + thisId).removeClass('required');
                                    $("#swing_trade_type-" + thisId + "_error").addClass('noerror');
                                    $("#swing_trade_type-" + thisId + "_error").removeClass('error');
                                    $("#swing_trade_type-" + thisId + "_error").html("");
                                
                                });
                                
                                var thisSelectedValue = values[0];
                                var currSchedTemplateEmps = localStorage.getItem('scheduler-templates-employees');
                
                                if(currSchedTemplateEmps == null){
                                    var tempEmps = [];
                                    tempEmps.push(thisSelectedValue);   
                
                                } else {
                                    var tempEmps = JSON.parse(currSchedTemplateEmps); 
                                    if(tempEmps.includes(thisSelectedValue) == false){
                                        tempEmps.push(thisSelectedValue);
                                        tempEmps.sort() 
                                    }                
                                }
                
                                var storeEmps = JSON.stringify(tempEmps);
                                localStorage.setItem('scheduler-templates-employees',storeEmps);

                                $('#scheduler-template-form .trade-types').each(function(){
                    
                                    var thisFilter = $(this).prop('id');
                                    //console.log("FILTER: ", thisFilter);
                                    $("#" + thisFilter).val("NA");
                
                                    localStorage.removeItem('swing-trade-type-errors');

                                    var thisId = thisFilter.split('-').pop();

                                    $("#swing_trade_type-" + thisId).removeClass('required');
                                    $("#swing_trade_type-" + thisId + "_error").addClass('noerror');
                                    $("#swing_trade_type-" + thisId + "_error").removeClass('error');
                                    $("#swing_trade_type-" + thisId + "_error").html("");
                                
                                });
                
                                //PUSH TO CURRENT SWINGS
                                $("#template-actions").find("button").each(function(){
                                    if(this.id != 'save-swing-template' 
                                        && this.id != 'save-as-swing-template'
                                        && this.id != 'cancel-save-swing-template' 
                                        && this.id != 'auto-date-template' 
                                        && this.id != 'reset-template-swings'
                                    ){    
                                        var thisCheckId = $(this).prop('id');
                                        checkFields = thisCheckId.split('-').pop();
                                    }
                                });

                                console.log("CHECKFIELDS X: ", checkFields);
                
                                for (var c = 0; c < checkFields; c++) {
                                    var thisEmpSwing = parseInt(c) + 1;
                                    $("#swing_emps-" + thisEmpSwing).val(tempEmps);        
                                }    
                
                            },
                            afterDeselect: function(values){
                
                                console.log("AFTER DE-SELECT X");
                                
                                $('#scheduler-template-form .trade-types').each(function(){
                    
                                    var thisFilter = $(this).prop('id');
                                    //console.log("FILTER: ", thisFilter);
                                    $("#" + thisFilter).val("NA");
                
                                    localStorage.removeItem('swing-trade-type-errors');
                
                                    var thisId = thisFilter.split('-').pop();
                
                                    $("#swing_trade_type-" + thisId).removeClass('required');
                                    $("#swing_trade_type-" + thisId + "_error").addClass('noerror');
                                    $("#swing_trade_type-" + thisId + "_error").removeClass('error');
                                    $("#swing_trade_type-" + thisId + "_error").html("");
                                
                                });
                                
                                var thisDeselectedValue = values[0];
                
                                function removeTempEmp(array, item){
                                    for(var i in array){
                                        if(array[i]==item){
                                            array.splice(i,1);
                                            break;
                                        }
                                    }
                                }
                
                                var currSchedTemplateEmps = localStorage.getItem('scheduler-templates-employees');
                                var tempEmps = JSON.parse(currSchedTemplateEmps);

                                $('#scheduler-template-form .trade-types').each(function(){
                    
                                    var thisFilter = $(this).prop('id');
                                    //console.log("FILTER: ", thisFilter);
                                    $("#" + thisFilter).val("NA");
                
                                    localStorage.removeItem('swing-trade-type-errors');

                                    var thisId = thisFilter.split('-').pop();

                                    $("#swing_trade_type-" + thisId).removeClass('required');
                                    $("#swing_trade_type-" + thisId + "_error").addClass('noerror');
                                    $("#swing_trade_type-" + thisId + "_error").removeClass('error');
                                    $("#swing_trade_type-" + thisId + "_error").html("");
                                
                                });
                
                                removeTempEmp(tempEmps, thisDeselectedValue);
                                
                                var storeEmps = JSON.stringify(tempEmps);
                                localStorage.setItem('scheduler-templates-employees',storeEmps);
                
                                //PUSH TO CURRENT SWINGS
                                $("#template-actions").find("button").each(function(){
                                    if(this.id != 'save-swing-template' 
                                        && this.id != 'save-as-swing-template'
                                        && this.id != 'cancel-save-swing-template' 
                                        && this.id != 'auto-date-template' 
                                        && this.id != 'reset-template-swings'
                                    ){    
                                        var thisCheckId = $(this).prop('id');
                                        checkFields = thisCheckId.split('-').pop();
                                    }
                                });
                
                                for (var c = 0; c < checkFields; c++) {
                                    var thisEmpSwing = parseInt(c) + 1;
                                    $("#swing_emps-" + thisEmpSwing).val(tempEmps);        
                                }
                
                            }
                        });

                    });

                } else {

                    var nextId = parseInt(s) + 1;

                    nextSwing(s, nextId);

                    var swingRequest = lastTemplateStoredArray[s]['swing_request']; 
                    $("#swing_request-" + nextId).val(swingRequest);
                    var swingReference = lastTemplateStoredArray[s]['swing_reference']; 
                    $("#swing_reference-" + nextId).val(swingReference);
                    
                    var swingEmps = lastTemplateStoredArray[s]['swing_emps']; 
                    $("#swing_emps-" + nextId).val(swingEmps);
                    
                    swingType = lastTemplateStoredArray[s]['swing_type']; 
                    $("#swing_type-" + nextId).val(swingType);
                    var swingStartDate = lastTemplateStoredArray[s]['swing_start_date']; 
                    $("#swing_start_date-" + nextId).val(swingStartDate);
                    var shiftTime = lastTemplateStoredArray[s]['shift_time'];
                    if(shiftTime == 'D') {
                        $("#day_shift").prop("checked", true);
                        $("#night_shift").prop("checked", false);
                    } else {
                        $("#day_shift").prop("checked", false);
                        $("#night_shift").prop("checked", true);
                    }
                    var swingRecurrence = lastTemplateStoredArray[s]['swing_recurrence']; 
                    $("#swing_recurrence-" + nextId).val(swingRecurrence);
                }
            
            } 

            document.getElementById("load-scheduler-template-modal").style.display = "none";

        }
    });

});

//RELOAD LAST

$("#sidebar-right").on('click', '#reload-swing-template', function (e) {

    var lastTemplateStored = localStorage.getItem('scheduler-template-last-stored');

    console.log("LAST SAVED: ");
    console.log(lastTemplateStored);

    if(lastTemplateStored != null) {
        
        var lastTemplateStoredArray = JSON.parse(lastTemplateStored);
        console.log("EMP ARRAY: ", lastTemplateStoredArray);
        var setTemplateEmployees = lastTemplateStoredArray[0]['swing_emps'];

        currEmpsArray = setTemplateEmployees;

        console.log(currEmpsArray);

        localStorage.setItem('scheduler-templates-employees',JSON.stringify(currEmpsArray));

        $("#add-next-2").html("");

        for (var s = 0; s < lastTemplateStoredArray.length; s++) {
            
            if(s == 0){
                var swingRequest = lastTemplateStoredArray[s]['swing_request']; 
                $("#swing_request-1").val(swingRequest);
                var swingReference = lastTemplateStoredArray[s]['swing_reference']; 
                $("#swing_reference-1").val(swingReference);
                var swingEmps = lastTemplateStoredArray[s]['swing_emps']; 
                $("#swing_emps-1").val(swingEmps);
                swingType = lastTemplateStoredArray[s]['swing_type']; 
                $("#swing_type-1").val(swingType);
                var swingStartDate = lastTemplateStoredArray[s]['swing_start_date']; 
                $("#swing_start_date-1").val(swingStartDate);
                var shiftTime = lastTemplateStoredArray[s]['shift_time'];
                if(shiftTime == 'D') {
                    $("#day_shift-1").prop("checked", true);
                    $("#night_shift-1").prop("checked", false);
                } else {
                    $("#day_shift-1").prop("checked", false);
                    $("#night_shift-1").prop("checked", true);
                }
                var swingRecurrence = lastTemplateStoredArray[s]['swing_recurrence']; 
                $("#swing_recurrence-1").val(swingRecurrence);
            
                $.ajax({
                    url: '/employees',
                    type: "get",
                }).done(function (response) {
                    
                    console.log("EMPLOYEES X: ", response);
                    
                    var employees = response;
                    var swingEmployees = "";
            
                    for (var e = 0; e < employees.length; e++) {
                        
                        console.log("LOOP SELECT: ");
                        
                        empId = employees[e]['emp_id'];

                        console.log("EMP: ", e);
                        
                        //if(typeof currSchedTemplateEmps != "undefined"){
                        
                            if(currEmpsArray.includes(empId) == true){
                                var selected = 'selected';
                            } else {
                                var selected = '';
                            }  

                        empName = employees[e]['first_name'] + ' ' + employees[e]['last_name'];            
                        swingEmployees += '<option value="' + empId + '" ' + selected + '>' + empName + '</option>';
                    }
            
                    $("#swing_emps-1").html("");
                    $("#swing_emps-1").append(swingEmployees);
            
                    $("#swing_emps-1").multiSelect({
                        afterSelect: function(values){
            
                            console.log("AFTER SELECT X");
                            
                            $('#scheduler-template-form .trade-types').each(function(){
                    
                                var thisFilter = $(this).prop('id');
                                //console.log("FILTER: ", thisFilter);
                                $("#" + thisFilter).val("NA");
            
                                localStorage.removeItem('swing-trade-type-errors');
            
                                var thisId = thisFilter.split('-').pop();
            
                                $("#swing_trade_type-" + thisId).removeClass('required');
                                $("#swing_trade_type-" + thisId + "_error").addClass('noerror');
                                $("#swing_trade_type-" + thisId + "_error").removeClass('error');
                                $("#swing_trade_type-" + thisId + "_error").html("");
                            
                            });
                            
                            var thisSelectedValue = values[0];
                            var currSchedTemplateEmps = localStorage.getItem('scheduler-templates-employees');

                            //var currSchedTemplateEmps = currEmpsArray;
            
                            if(currSchedTemplateEmps == null){
                                var tempEmps = [];
                                tempEmps.push(thisSelectedValue);   
            
                            } else {
                                var tempEmps = JSON.parse(currSchedTemplateEmps); 
                                if(tempEmps.includes(thisSelectedValue) == false){
                                    tempEmps.push(thisSelectedValue);
                                    tempEmps.sort() 
                                }                
                            }
            
                            var storeEmps = JSON.stringify(tempEmps);
                            localStorage.setItem('scheduler-templates-employees',storeEmps);
            
                            //PUSH TO CURRENT SWINGS
                            $("#template-actions").find("button").each(function(){
                                if(this.id != 'save-swing-template' 
                                    && this.id != 'save-as-swing-template'
                                    && this.id != 'cancel-save-swing-template' 
                                    && this.id != 'auto-date-template' 
                                    && this.id != 'reset-template-swings'
                                ){    
                                    var thisCheckId = $(this).prop('id');
                                    checkFields = thisCheckId.split('-').pop();
                                }
                            });

                            console.log("CHECKFIELDS X: ", checkFields);
            
                            for (var c = 0; c < checkFields; c++) {
                                var thisEmpSwing = parseInt(c) + 1;
                                $("#swing_emps-" + thisEmpSwing).val(tempEmps);        
                            }    
            
                        },
                        afterDeselect: function(values){
            
                            console.log("AFTER DE-SELECT X");
                            
                            $('#scheduler-template-form .trade-types').each(function(){
                    
                                var thisFilter = $(this).prop('id');
                                //console.log("FILTER: ", thisFilter);
                                $("#" + thisFilter).val("NA");
            
                                localStorage.removeItem('swing-trade-type-errors');
            
                                var thisId = thisFilter.split('-').pop();
            
                                $("#swing_trade_type-" + thisId).removeClass('required');
                                $("#swing_trade_type-" + thisId + "_error").addClass('noerror');
                                $("#swing_trade_type-" + thisId + "_error").removeClass('error');
                                $("#swing_trade_type-" + thisId + "_error").html("");
                            
                            });
                            
                            var thisDeselectedValue = values[0];
            
                            function removeTempEmp(array, item){
                                for(var i in array){
                                    if(array[i]==item){
                                        array.splice(i,1);
                                        break;
                                    }
                                }
                            }
            
                            var currSchedTemplateEmps = localStorage.getItem('scheduler-templates-employees');
                            var tempEmps = JSON.parse(currSchedTemplateEmps); 
            
                            removeTempEmp(tempEmps, thisDeselectedValue);
                            
                            var storeEmps = JSON.stringify(tempEmps);
                            localStorage.setItem('scheduler-templates-employees',storeEmps);
            
                            //PUSH TO CURRENT SWINGS
                            $("#template-actions").find("button").each(function(){
                                if(this.id != 'save-swing-template' 
                                    && this.id != 'save-as-swing-template'
                                    && this.id != 'cancel-save-swing-template'
                                    && this.id != 'auto-date-template' 
                                    && this.id != 'reset-template-swings'
                                ){    
                                    var thisCheckId = $(this).prop('id');
                                    checkFields = thisCheckId.split('-').pop();
                                }
                            });
            
                            for (var c = 0; c < checkFields; c++) {
                                var thisEmpSwing = parseInt(c) + 1;
                                $("#swing_emps-" + thisEmpSwing).val(tempEmps);        
                            }
            
                        }
                    });

                    $("#swing_emps-1").multiSelect('refresh');
                    /* if(tempId == 'edit'){
                        $("#swing_emps-edit").multiSelect('refresh');
                    } else {
                        $("#swing_emps-1").multiSelect('refresh');
                    } */

                });

            } else {

                var nextId = parseInt(s) + 1;

                nextSwing(s, nextId);

                var swingRequest = lastTemplateStoredArray[s]['swing_request']; 
                $("#swing_request-" + nextId).val(swingRequest);
                var swingReference = lastTemplateStoredArray[s]['swing_reference']; 
                $("#swing_reference-" + nextId).val(swingReference);
                
                var swingEmps = lastTemplateStoredArray[0]['swing_emps']; 
                $("#swing_emps-" + nextId).val(swingEmps);
                
                swingType = lastTemplateStoredArray[s]['swing_type']; 
                $("#swing_type-" + nextId).val(swingType);
                var swingStartDate = lastTemplateStoredArray[s]['swing_start_date']; 
                $("#swing_start_date-" + nextId).val(swingStartDate);
                var shiftTime = lastTemplateStoredArray[s]['shift_time'];
                
                console.log("THIS SHIFT TIME_____", shiftTime);
                
                if(shiftTime == 'D') {
                    $("#day_shift-" + nextId).prop("checked", true);
                    $("#night_shift-" + + nextId).prop("checked", false);
                } else {
                    $("#day_shift-" + nextId).prop("checked", false);
                    $("#night_shift-" + nextId).prop("checked", true);
                }
                var swingRecurrence = lastTemplateStoredArray[s]['swing_recurrence']; 
                $("#swing_recurrence-" + nextId).val(swingRecurrence);
            }
        
        } 

    } else {
        alert("nothing to reload"); 
    }

});

//RESET SWING TEMPLATES

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function getSwingEmployees(tempId, tradeTypes, currSchedTemplateEmps){
    
    /* if(tempId){
        empTempId = 
    } */

    var currEmpsArray = currSchedTemplateEmps;

    console.log("THIS TEMP ID_____: ", tempId);
    
    var result = '';
    
    $.ajax({
        url: '/employees/' + tradeTypes,
        type: "GET",
        async: false,
    }).done(function (response) {
        console.log("EMPLOYEES: ", response);
        var employees = response;
        var swingEmployees = "";

        for (var e = 0; e < employees.length; e++) {
            empId = employees[e]['emp_id'];
            
            if(typeof currSchedTemplateEmps != "undefined"){
            
                if(currEmpsArray.includes(empId) == true){
                    var selected = 'selected';
                } else {
                    var selected = '';
                }    
            
            } else {
                var selected = '';
            }

            empName = employees[e]['emp_trade_initials'] + ' ' + employees[e]['first_name'] + ' ' + employees[e]['last_name'];            
            swingEmployees += '<option value="' + empId + '" ' + selected + '>' + empName + '</option>';

            
        }

        console.log("SWING EMPLOYEES: ", swingEmployees);

        result = swingEmployees;

        $("#swing_emps-" + tempId).html("");
        $("#swing_emps-" + tempId).append(swingEmployees);

        //$("#swing_emps-1").multiSelect('refresh');
        
        $("#swing_emps-" + tempId).multiSelect({
            
            afterSelect: function(values){
    
                console.log("AFTER SELECT Y");
                
                //RESET ALL TRADE TYPES TO FIRST OPTION

                if(tempId == 'edit'){
                    var thisForm = 'edit-swing-form';
                } else {
                    var thisForm = 'scheduler-template-form';
                }

                $('#' + thisForm + ' .trade-types').each(function(){
                    
                    var thisFilter = $(this).prop('id');
                    //console.log("FILTER: ", thisFilter);
                    $("#" + thisFilter).val("NA");

                    localStorage.removeItem('swing-trade-type-errors');

                    //HIDING

                    var thisId = thisFilter.split('-').pop();

                    $("#swing_trade_type-" + thisId).removeClass('required');
                    $("#swing_trade_type-" + thisId + "_error").addClass('noerror');
                    $("#swing_trade_type-" + thisId + "_error").removeClass('error');
                    $("#swing_trade_type-" + thisId + "_error").html("");
                
                });
                
                var thisSelectedValue = values[0];
                
                var currSchedTemplateEmps = localStorage.getItem('scheduler-templates-employees');
    
                console.log("LOCAL STORAGE INIT Y: ", currSchedTemplateEmps);
    
                //MY HERE    
    
                if(localStorage.getItem('scheduler-templates-employees') == null){
                
                    //if(typeof currSchedTemplateEmps === "undefined" || currSchedTemplateEmps === null){
    
                    console.log("UNDEFINED NULL");
                    
                    //if(currSchedTemplateEmps == null){
                        var tempEmps = [];
                        tempEmps.push(thisSelectedValue);
                        
                        console.log("NEW TEMP EMPS Y: ", tempEmps);
    
                } else {
                    
                    console.log("DEFINED NOT NULL");
                    
                    var tempEmps = JSON.parse(currSchedTemplateEmps); 
                    if(tempEmps.includes(thisSelectedValue) == false){
                        tempEmps.push(thisSelectedValue);
                        tempEmps.sort() 
                    } 
                    
                    console.log("EXIST TEMP EMPS Y: ", tempEmps);
                }
    
                var storeEmps = JSON.stringify(tempEmps);
                console.log("STORE EMPS: ");
                console.log(storeEmps);
    
                localStorage.setItem('scheduler-templates-employees',storeEmps);
                
                console.log("LOCAL STORAGE: ", localStorage.getItem('scheduler-templates-employees'));
    
                //PUSH TO CURRENT SWINGS
                $("#template-actions").find("button").each(function(){
                    if(this.id != 'save-swing-template' 
                        && this.id != 'save-as-swing-template'
                        && this.id != 'cancel-save-swing-template' 
                        && this.id != 'auto-date-template' 
                        && this.id != 'reset-template-swings'
                    ){    
                        var thisCheckId = $(this).prop('id');
                        checkFields = thisCheckId.split('-').pop();
                    }
                });
    
                console.log("CHECKFIELDS Y: ", checkFields);
    
                if(tempId == 'edit'){
                    
                    console.log("TEMP EMPS: ", tempEmps);
                    
                    $("#swing_emps-edit").val(tempEmps);
                
                } else {
                
                    for (var c = 0; c < checkFields; c++) {
                        var thisEmpSwing = parseInt(c) + 1;
                        $("#swing_emps-" + thisEmpSwing).val(tempEmps);        
                    }  
                
                }  
    
            },
            afterDeselect: function(values){
    
                console.log("AFTER DE-SELECT Y");

                if(tempId == 'edit'){
                    var thisForm = 'edit-swing-form';
                } else {
                    var thisForm = 'scheduler-template-form';
                }
                
                $('#' + thisForm + ' .trade-types').each(function(){
                    
                    var thisFilter = $(this).prop('id');
                    //console.log("FILTER: ", thisFilter);
                    $("#" + thisFilter).val("NA");

                    localStorage.removeItem('swing-trade-type-errors');

                    var thisId = thisFilter.split('-').pop();

                    $("#swing_trade_type-" + thisId).removeClass('required');
                    $("#swing_trade_type-" + thisId + "_error").addClass('noerror');
                    $("#swing_trade_type-" + thisId + "_error").removeClass('error');
                    $("#swing_trade_type-" + thisId + "_error").html("");
                
                });
                
                var thisDeselectedValue = values[0];
    
                function removeTempEmp(array, item){
                    for(var i in array){
                        if(array[i]==item){
                            array.splice(i,1);
                            break;
                        }
                    }
                }
    
                var currSchedTemplateEmps = localStorage.getItem('scheduler-templates-employees');
                var tempEmps = JSON.parse(currSchedTemplateEmps); 
    
                console.log("LOCAL STORAGE REMOVE: ", tempEmps);
    
                removeTempEmp(tempEmps, thisDeselectedValue);
                
                var storeEmps = JSON.stringify(tempEmps);
                localStorage.setItem('scheduler-templates-employees',storeEmps);
    
                console.log("LOCAL STORAGE AFTER REMOVE: ", tempEmps);
    
                //PUSH TO CURRENT SWINGS
                $("#template-actions").find("button").each(function(){
                    if(this.id != 'save-swing-template' 
                        && this.id != 'save-as-swing-template'
                        && this.id != 'cancel-save-swing-template' 
                        && this.id != 'auto-date-template' 
                        && this.id != 'reset-template-swings'
                    ){    
                        var thisCheckId = $(this).prop('id');
                        checkFields = thisCheckId.split('-').pop();
                    }
                });
    
                if(tempId == 'edit'){
                    
                    console.log("TEMP EMPS: ", tempEmps);
                    
                    $("#swing_emps-edit").val(tempEmps);
                } else {
                
                    for (var c = 0; c < checkFields; c++) {
                        var thisEmpSwing = parseInt(c) + 1;
                        $("#swing_emps-" + thisEmpSwing).val(tempEmps);        
                    }
                }
    
            }
        });

        if(tempId == 'edit'){
            $("#swing_emps-edit").multiSelect('refresh');
        } else {
            $("#swing_emps-1").multiSelect('refresh');
        }
    
    });

    return result;
}

function resetTemplates(reqId){

    $("#add-next-2").html("");
    setTemplates(reqId);

}

function setTemplates(reqId){
    
    $("#sidebar-right").html("");

    var tempId = 1;
    
    //INITIALISE LOCAL STORAGE OF EMPS

    //var setTemplateEmployees = localStorage.getItem('scheduler-templates-employees');
    currEmpsArray = [];
    
    localStorage.setItem('scheduler-templates-employees',JSON.stringify(currEmpsArray));

    var swingTemplates = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    swingTemplates += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Update Swings</div>';
    swingTemplates += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    swingTemplates += '</div>';

    swingTemplates += '<div id="outer-templates-container" style="margin:0 15px 0 15px;border:0px solid red;">';

    swingTemplates += '<div class="w3-center" style="margin-top:15px;">';
    swingTemplates += '<button id="reload-swing-template" class="w3-button w3-padding-medium w3-darkblue w3-margin-bottom" style="margin-top:10px;">Reload Last Used Swing Details</button>';
    swingTemplates += '<button id="load-swing-template" class="w3-button w3-padding-medium w3-darkblue w3-margin-bottom" style="margin:10px 0 0 10px;">Load a Swing Template</button>';

    swingTemplates += '</div>';

    //swingTemplates += '<div style="margin-top:5px;margin-bottom:10px;font-size:12px;">Required Field<span class="required-label">*</span></div>';
    
    swingTemplates += '<div class="w3-row">';
    swingTemplates += '<div class="w3-quarter" style="margin-top:5px;margin-bottom:10px;font-size:12px;border:0px solid;">Required Field<span class="required-label">*</span></div>';
    
    swingTemplates += '<div class="w3-three-quarter w3-right" style="margin-top:5px;margin-bottom:10px;border:0px solid;">';
    swingTemplates += '<label class="form-switch">Conflict Management&nbsp;&nbsp;';
    swingTemplates += '<input id="swing-template-conflict-management" style="margin-left:10px;" type="checkbox">';
    swingTemplates += '<i></i></label>';
    swingTemplates += '</div>';
    
    swingTemplates += '</div>';
    
    swingTemplates += '<form name="scheduler-template-form" id="scheduler-template-form">';

    //ADDED 0504
    swingTemplates += '<input type="hidden" id="swing_trades-' + tempId + '" name="swing_trades-' + tempId + '" value="">';

    swingTemplates += '<div class="w3-row">';

    swingTemplates += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    swingTemplates += '<label>Request<span class="required-label">*</span></label>';
    swingTemplates += '<select name="swing_request-' + tempId + '" id="swing_request-' + tempId + '" class="w3-select w3-border input-display"></select>';
    swingTemplates += '<div id="swing_request-' + tempId + '_error" class="noerror" ></div>';
    swingTemplates += '</div>';

    swingTemplates += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    swingTemplates += '<label>Reference<span class="required-label">*</span></label>';
    swingTemplates += '<input name="swing_reference-' + tempId + '" id="swing_reference-' + tempId + '" class="w3-input w3-border input-display" type="text" style="background-color:lightgrey" readonly="readonly">';
    swingTemplates += '<div id="swing_reference-' + tempId + '_error" class="noerror" ></div>';
    swingTemplates += '</div>';

    swingTemplates += '</div>';

    swingTemplates += '<div class="w3-row">';

    swingTemplates += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    swingTemplates += '<label style="font-weight:bold;">Employee(s)<span class="required-label"<span>*</span></label>';
    swingTemplates += '<select id="swing_emps-' + tempId + '" name="swing_emps-' + tempId + '[]" multiple="multiple" style="margin-top:10px;"></select>';
    swingTemplates += '<div id="swing_emps_error-' + tempId +'" class="noerror" style="margin-top:10px;"></div>';
    swingTemplates += '</div>';//DISPLAY
    swingTemplates += '</div>';//ROW

    swingTemplates += '<div id="swing-templates-container" style="border:0px solid brown">';
    
    swingTemplates += '<div id="swing-' + tempId + '" style="margin-top:10px;padding:0 10px 10px 10px;border:1px solid #CCC; box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19);">';
    
    swingTemplates += '<h3>Swing ' + tempId + ':</h3>';
    
    swingTemplates += '<div class="w3-row">';

    swingTemplates += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    swingTemplates += '<label>Swing Type<span class="required-label">*</span></label>';
    swingTemplates += '<select name="swing_type-' + tempId + '" id="swing_type-' + tempId + '" class="w3-select w3-border input-display">';
    swingTemplates += '<option value="NA">Select a Swing Type</option>';
    swingTemplates += '<option value="On">On</option>';
    swingTemplates += '<option value="Off">Off</option>';
    swingTemplates += '</select>';
    swingTemplates += '<div id="swing_type-' + tempId + '_error" class="noerror" ></div>';
    swingTemplates += '</div>';

    swingTemplates += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    swingTemplates += '<label>Start Day<span class="required-label">*</span></label>';
    swingTemplates += '<input name="swing_start_date-' + tempId + '" id="swing_start_date-' + tempId + '" class="w3-input w3-border datepicker input-display start-day" type="text" readonly="readonly">';
    swingTemplates += '<div id="swing_start_date-' + tempId + '_error" class="noerror" ></div>';
    swingTemplates += '</div>';

    swingTemplates += '</div>';

    //added
    swingTemplates += '<div class="w3-row">';

    swingTemplates += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    swingTemplates += '<label>Trade Type<span class="required-label">*</span></label>';
    swingTemplates += '<select name="swing_trade_type-' + tempId + '" id="swing_trade_type-' + tempId + '" class="w3-select w3-border input-display trade-types">';
    swingTemplates += '</select>';
    swingTemplates += '<div id="swing_trade_type-' + tempId + '_error" class="noerror" ></div>';
    swingTemplates += '</div>';

    swingTemplates += '</div>';

    //

    swingTemplates += '<div class="w3-row">';

    swingTemplates += '<div id="swing_type_display" class="w3-half" style="padding:10px 0 10px 0px;">';

    swingTemplates += '<label style="margin:0;">Swing Time<span class="required-label"<span>*</span></label>';
    swingTemplates += '<div style="margin:0;">';
    swingTemplates += '<input id="day_shift-' + tempId + '" name="shift_time-' + tempId + '" class="w3-radio input-display" type="radio" value="D">';
    swingTemplates += '<label style="margin-left:5px;font-weight:normal;">Day</label>';
    swingTemplates += '<input id="night_shift-' + tempId + '" name="shift_time-' + tempId + '" class="w3-radio" type="radio" value="N" style="margin-left:10px;">';
    swingTemplates += '<label style="margin-left:5px;font-weight:normal;">Night</label>';
    swingTemplates += '</div>';
    swingTemplates += '</div>';//ITEM

    swingTemplates += '<div class="w3-quarter" style="padding:0 10px 10px 0;">';
    swingTemplates += '<label>Recur (Days)<span class="required-label">*</span></label>';
    swingTemplates += '<input name="swing_recurrence-' + tempId + '" id="swing_recurrence-' + tempId + '" class="w3-input w3-border input-display" type="text">';
    swingTemplates += '<div id="swing_recurrence-' + tempId + '_error" class="noerror" ></div>';
    swingTemplates += '</div>';//ITEM

    swingTemplates += '</div>';//ROW

    swingTemplates += '</div>';//SWING ID CONTAINER

    swingTemplates += '<div id="add-next-2"></div>';//ADD NEXT HERE

    swingTemplates += '</div>';//SWING TEMPLATES CONTAINER

    swingTemplates += '</form>';

    swingTemplates += '<div id="template-actions">';
    
    swingTemplates += '<div class="w3-center" style="margin-top:15px;">';
    swingTemplates += '<button id="next_swing-' + tempId + '" class="w3-button w3-padding-medium w3-pink w3-margin-bottom" style="margin-top:10px;">Add Another Swing</button>';
    swingTemplates += '</div>';

    swingTemplates += '<div class="w3-center" style="margin-top:15px;">';
    swingTemplates += '<button id="auto-date-template" class="w3-button w3-padding-medium w3-darkblue w3-margin-bottom" style="margin:0 0 0 0;">Auto Date</button>';
    swingTemplates += '<button id="reset-template-swings" class="w3-button w3-padding-medium w3-darkblue w3-margin-bottom" style="margin:0 0 0 10px;">Reset Shifts</button>';
    swingTemplates += '<button id="save-as-swing-template" class="w3-button w3-padding-medium w3-darkblue w3-margin-bottom" style="margin:0 0 0 10px;">Save as Template</button>';
    swingTemplates += '<button id="cancel-save-swing-template" class="w3-button w3-padding-medium w3-darkblue w3-margin-bottom" style="margin:0 0 0 10px;">Cancel</button>';
    swingTemplates += '<button id="save-swing-template" class="w3-button w3-padding-medium w3-pink w3-margin-bottom" style="margin:0 0 0 10px;">Create Swings</button>';

    swingTemplates += '</div>';

    swingTemplates += '</div>';

    swingTemplates += '</div>';//CONTAINER

    $("#sidebar-right").html("");

    $("#sidebar-right").append(swingTemplates);

    $("#swing-template-conflict-management").prop('checked',false);

    $("#day_shift-" + tempId).prop('checked',true);
    $("#night_shift-" + tempId).prop('checked',false);

    $.ajax({
        url: '/requests',
        type: "get",
    }).done(function (response) {
        console.log("REQUESTS: ", response);
        var requests = response.requests;
        var swingRequests = '<option value="NA">Select a Request</option>';

        for (var r = 0; r < requests.length; r++) {
            thisReqId = requests[r]['ws_id'];
            
            console.log("THIS REQ ID______",thisReqId);
            console.log("REQ ID______",reqId);
            
            if(reqId == thisReqId){
                var selectedReq = 'selected="selected"';
            } else {
                var selectedReq = '';
            }
            swingRequests += '<option value="' + thisReqId + '" ' +  selectedReq + '>' + thisReqId + '</option>';
        }

        console.log("SET REQUESTS_____", swingRequests);

        $("#swing_request-" + tempId).html("");
        $("#swing_request-" + tempId).append(swingRequests);

        setRequestDetails(reqId, tempId, swingRequests);
        
    });

    //FETCH EMPLOYEES BY TRADE TYPE

    console.log("SET REQ ID_____", reqId);

    //$("#swing_request-" + tempId).val(reqId);
    
    //setRequestDetails(reqId, tempId, swingRequests);

    //var swingEmpsSelected = getSwingEmployees(tempId, 'all');

    //$("#swing_emps-" + tempId).html("");
    //$("#swing_emps-" + tempId).append(swingEmpsSelected);

    // SELECTED: ", swingEmpsSelected);

    
    /* $.ajax({
        url: '/employees',
        type: "get",
    }).done(function (response) {
        console.log("EMPLOYEES: ", response);
        var employees = response;
        var swingEmployees = "";

        for (var e = 0; e < employees.length; e++) {
            empId = employees[e]['emp_id'];
            
            if(typeof currSchedTemplateEmps != "undefined"){
            
                if(currEmpsArray.includes(empId) == true){
                    var selected = 'selected';
                } else {
                    var selected = '';
                }    
            
            } else {
                var selected = '';
            }

            empName = employees[e]['first_name'] + ' ' + employees[e]['last_name'];            
            swingEmployees += '<option value="' + empId + '" ' + selected + '>' + empName + '</option>';
        }

        $("#swing_emps-" + tempId).html("");
        $("#swing_emps-" + tempId).append(swingEmployees);

    */    

    /* $("#swing_emps-1").multiSelect({
        afterSelect: function(values){

            console.log("AFTER SELECT Y");
            
            var thisSelectedValue = values[0];
            
            var currSchedTemplateEmps = localStorage.getItem('scheduler-templates-employees');

            console.log("LOCAL STORAGE INIT Y: ", currSchedTemplateEmps);

            //MY HERE    

            if(localStorage.getItem('scheduler-templates-employees') == null){
            
                //if(typeof currSchedTemplateEmps === "undefined" || currSchedTemplateEmps === null){

                console.log("UNDEFINED NULL");
                
                //if(currSchedTemplateEmps == null){
                    var tempEmps = [];
                    tempEmps.push(thisSelectedValue);
                    
                    console.log("NEW TEMP EMPS Y: ", tempEmps);

            } else {
                
                console.log("DEFINED NOT NULL");
                
                var tempEmps = JSON.parse(currSchedTemplateEmps); 
                if(tempEmps.includes(thisSelectedValue) == false){
                    tempEmps.push(thisSelectedValue);
                    tempEmps.sort() 
                } 
                
                console.log("EXIST TEMP EMPS Y: ", tempEmps);
            }

            var storeEmps = JSON.stringify(tempEmps);
            console.log("STORE EMPS: ");
            console.log(storeEmps);

            localStorage.setItem('scheduler-templates-employees',storeEmps);
            
            console.log("LOCAL STORAGE: ", localStorage.getItem('scheduler-templates-employees'));

            //PUSH TO CURRENT SWINGS
            $("#template-actions").find("button").each(function(){
                if(this.id != 'save-swing-template' 
                    && this.id != 'save-as-swing-template'
                    && this.id != 'cancel-save-swing-template' 
                    && this.id != 'auto-date-template' 
                    && this.id != 'reset-template-swings'
                ){    
                    var thisCheckId = $(this).prop('id');
                    checkFields = thisCheckId.split('-').pop();
                }
            });

            console.log("CHECKFIELDS Y: ", checkFields);

            for (var c = 0; c < checkFields; c++) {
                var thisEmpSwing = parseInt(c) + 1;
                $("#swing_emps-" + thisEmpSwing).val(tempEmps);        
            }    

        },
        afterDeselect: function(values){

            console.log("AFTER DE-SELECT Y");
            
            var thisDeselectedValue = values[0];

            function removeTempEmp(array, item){
                for(var i in array){
                    if(array[i]==item){
                        array.splice(i,1);
                        break;
                    }
                }
            }

            var currSchedTemplateEmps = localStorage.getItem('scheduler-templates-employees');
            var tempEmps = JSON.parse(currSchedTemplateEmps); 

            console.log("LOCAL STORAGE REMOVE: ", tempEmps);

            removeTempEmp(tempEmps, thisDeselectedValue);
            
            var storeEmps = JSON.stringify(tempEmps);
            localStorage.setItem('scheduler-templates-employees',storeEmps);

            console.log("LOCAL STORAGE AFTER REMOVE: ", tempEmps);

            //PUSH TO CURRENT SWINGS
            $("#template-actions").find("button").each(function(){
                if(this.id != 'save-swing-template' 
                    && this.id != 'save-as-swing-template'
                    && this.id != 'cancel-save-swing-template' 
                    && this.id != 'auto-date-template' 
                    && this.id != 'reset-template-swings'
                ){    
                    var thisCheckId = $(this).prop('id');
                    checkFields = thisCheckId.split('-').pop();
                }
            });

            for (var c = 0; c < checkFields; c++) {
                var thisEmpSwing = parseInt(c) + 1;
                $("#swing_emps-" + thisEmpSwing).val(tempEmps);        
            }

        }
    }); */
}

$("#sidebar-right").on('click', '#reset-template-swings', function (e) {
        
    var reqId = parseInt(localStorage.getItem('current-request'));

    //console.log("RESET REQ: ", reqId);

    paddedReq = pad(reqId, 6);
    
    resetTemplates(paddedReq);
});


//AUTO DATE
function getSwingDates(tempId){

    console.log("LOOP: ", tempId);

    var shiftDate = $("#swing_start_date-" + tempId).val();
    console.log("SHIFT DATE: ", shiftDate);
    var shiftRecur = $("#swing_recurrence-" + tempId).val();

    var errCount = 0;
    var errMsg = '';
    
    if(shiftDate.length < 1){
        errCount++;
        errMsg += '<p class="error">No Start Date provided for Swing ' + tempId + '.</p>';
    }

    if(shiftRecur.length < 1){
        errCount++;
        errMsg += '<p class="error">No Recur Days provided for Swing ' + tempId + '.</p>';
    }
    
    if(errCount < 1){

        var shiftDateArray = shiftDate.split("-");
        var shiftDateFormat = new Date( shiftDateArray[2], shiftDateArray[1] - 1, shiftDateArray[0]);
        var initShiftdateStr = shiftDateFormat.getTime();
        var timeAddition = parseInt(shiftRecur) * 24 * 60 * 60 * 1000;
        var nextSwingDateStr = initShiftdateStr + timeAddition;

        var checkNextDate = new Date(nextSwingDateStr);
        var curr_date = checkNextDate.getDate();
        var curr_month = checkNextDate.getMonth() + 1;
        var curr_year = checkNextDate.getFullYear();

        var swingDateFormat = curr_date + "-" + curr_month + "-" + curr_year;

        //var checkDateFormat = checkNextDate.toLocaleDateString("en-UK");
        //console.log("CHECK DATE: ", swingDateFormat);

        return swingDateFormat;

    } else {
        document.getElementById("auto-date-error-modal").style.display = "block";
        $("#auto-date-display").html(errMsg);
    }
}

$("#sidebar-right").on('click', '#auto-date-template', function (e) {
    
    $("#template-actions").find("button").each(function(){
        
        console.log("RUNNING");
        
        if(this.id != 'save-swing-template' 
            && this.id != 'save-as-swing-template'
            && this.id != 'cancel-save-swing-template' 
            && this.id != 'auto-date-template' 
            && this.id != 'reset-template-swings'
        ){
            var thisCheckId = $(this).prop('id');
            checkFields = thisCheckId.split('-').pop();
        }
    });

    console.log("AUTO CHECKFIELDS: ", checkFields);

    if(checkFields > 1){
    
        for (var c = 0; c < checkFields; c++) {
            var tempId = c + 1;
            var nextId = tempId + 1;
            var nextSwingDate = getSwingDates(tempId);

            console.log("SET DATE :", nextId);
            console.log(nextSwingDate);

            $("#swing_start_date-" + nextId).val(nextSwingDate);
        }
    
    } else {
        
        var errCountVoid = 0;
        var errMsgVoid = '';
        
        var thisSwingStartDate = $("#swing_start_date-1").val();
        var thisSwingRecur = $("#swing_recurrence-1").val();
        
        if(thisSwingStartDate.length < 1 || thisSwingRecur.length < 1){
        
            if(thisSwingStartDate.length < 1){
                errCountVoid++;
                errMsgVoid += '<p class="error">No Start Date provided for Swing 1.</p>';
            }
        
            if(thisSwingRecur.length < 1){                
                errCountVoid++;
                errMsgVoid += '<p class="error">No Recur Days provided for Swing 1.</p>';
            }

            if(errCountVoid > 0){
                var autoDateErrorsMsg = errMsgVoid;
                document.getElementById("auto-date-error-modal").style.display = "block";
                $("#auto-date-display").html(autoDateErrorsMsg);

            }

        } else {
            var autoDateErrorsMsg = '<p class="error">No Dates to update.</p>';
            document.getElementById("auto-date-error-modal").style.display = "block";
            $("#auto-date-display").html(autoDateErrorsMsg);
        }
    }
});

//SET REQUEST DETAILS

function setNextRequestDetails(reqId, tempId){

    console.log("XXREQ ID: ", reqId)

    $.ajax({
        url: '/request/scheduler/' + reqId,
        type: "get",
    }).done(function (response) {
        console.log("REQ: ", response);

        var request = response;
        
        //reqRef = request['ws_ref'];
        //reqSiteShort = request['ws_site_dept'];
        //reqRefDesc = "RR" + reqRef + "-" + reqSiteShort;

        //$("#swing_request-" + tempId).html("");
        //$("#swing_request-" + tempId).append(swingRequests);

        //var paddedReq = pad(reqId, 6);

        //console.log("PADDED REQ: ", paddedReq);
        
        //$("#swing_request-" + tempId).val(paddedReq);

        //XXTRADES HERE
        
        //$("#swing_reference-" + tempId).val("");
        //ADDED 0504
        reqTrades = request['ws_trade_types'];
        //$("#swing_trades-" + tempId).val(reqTrades);

        console.log("NEXT REQ TRADES: ", reqTrades);
        reqTradesSelection = request['ws_trade_types_selection'];
        console.log("REQ TRADES SELECTION: ", reqTradesSelection);

        //ADD THE TRADES TO THE SELECT
        
        $("#swing_trade_type-" + tempId).html('');
        var tradeTypeOptions = '<option value="NA">Select Swing Trade Type</option>';

        for (var r = 0; r < reqTradesSelection.length; r++) {
            var thisTradeCode = reqTradesSelection[r]['code'];
            var thisTradeDesc = reqTradesSelection[r]['desc'];
            tradeTypeOptions += '<option value="' + thisTradeCode + '">' + thisTradeDesc + '</option>';
        }

        
        console.log("TRADE SELECTION: ", tradeTypeOptions);
        
        $("#swing_trade_type-" + tempId).append(tradeTypeOptions);
    
        //getSwingEmployees(1, reqTrades);

        //PUSH TO CURRENT SWINGS (FROM 2)
        /* $("#template-actions").find("button").each(function(){
            if(this.id != 'save-swing-template' 
                && this.id != 'save-as-swing-template'
                && this.id != 'cancel-save-swing-template' 
                && this.id != 'auto-date-template' 
                && this.id != 'reset-template-swings'
            ){    
                console.log("THIS ID: ", $(this).prop('id'));
                
                var thisCheckId = $(this).prop('id');
                checkFields = thisCheckId.split('-').pop();
            }
        }); */

        /* console.log("CHECKFIELDS: ", checkFields);

        for (var c = 0; c < checkFields; c++) {
            var thisEmpSwing = parseInt(c) + 1;                
            $("#swing_request-" + thisEmpSwing).val(reqId); 
            $("#swing_reference-" + thisEmpSwing).val(reqRefDesc);
            $("#swing_trades-" + thisEmpSwing).val(reqTrades);  
        } */
    });

}

function getSwingBookings(swingId){

    var swingData = '';
    
    $.ajax({
        url: '/bkgs/shift/' + swingId,
        type: "GET",
        async: false,
        success: function (response) {
            console.log("SWING DETS" , response);
            swingData = response;
        }
    });

    return swingData;

}

function setEditSwingDetails(reqId, tempId, swingId, swingRequests){

    console.log("SET EDIT SWINGS REQ ID: ", reqId)

    $.ajax({
        url: '/request/scheduler/' + reqId,
        type: "get",
    }).done(function (response) {
        console.log("REQ: ", response);

        var request = response;
        reqRef = request['ws_ref'];
        reqSiteShort = request['ws_site_dept'];
        reqRefDesc = "RR" + reqRef + "-" + reqSiteShort;

        $("#swing_reference-" + tempId).val("");
        
        reqTrades = request['ws_trade_types'];
        $("#swing_trades-" + tempId).val(reqTrades);

        console.log("REQ TRADES: ", reqTrades);
        reqTradesSelection = request['ws_trade_types_selection'];
        console.log("REQ TRADES SELECTION: ", reqTradesSelection);

        //ADD THE TRADES TO THE SELECT
        
        $("#swing_trade_type-" + tempId).html('');
        var tradeTypeOptions = '<option value="NA">Select Swing Trade Type</option>';

        for (var r = 0; r < reqTradesSelection.length; r++) {
            var thisTradeCode = reqTradesSelection[r]['code'];
            var thisTradeDesc = reqTradesSelection[r]['desc'];
            tradeTypeOptions += '<option value="' + thisTradeCode + '">' + thisTradeDesc + '</option>';
        }

        $("#swing_trade_type-" + tempId).append(tradeTypeOptions);
    
        var swingDets = getSwingBookings(swingId);

        console.log("SWING DETS:_______",swingDets);

        var swingEmp = swingDets['emp'];

        var swingEmpArray = [];

        swingEmpArray.push(swingEmp);

        console.log("EMP ARRAY: ",swingEmpArray);

        //localStorage.setItem('scheduler-templates-employees', swingEmpArray);
        localStorage.setItem('scheduler-templates-employees',JSON.stringify(swingEmpArray));

        getSwingEmployees('edit', reqTrades, swingEmpArray);

        var swingType = swingDets['type'];
        var startDateStr = swingDets['start_date'];
        var swingTradeType = swingDets['trade'];
        var swingTime = swingDets['ampm'];
        var swingRecurDays = swingDets['days'];
        
        var thisEmpSwing = 'edit';  
        
        if(swingTime == 'AM'){
            $("#day_shift-" + thisEmpSwing).prop('checked',true);
            $("#night_shift-" + thisEmpSwing).prop('checked',false);
        } else {
            $("#day_shift-" + thisEmpSwing).prop('checked',false);
            $("#night_shift-" + thisEmpSwing).prop('checked',true);
        }
        
        $("#swing_id-" + thisEmpSwing).val(swingId);
        $("#swing_reference-" + thisEmpSwing).val(reqRefDesc);
        $("#swing_emp-" + thisEmpSwing).val(swingEmpArray);
        $("#swing_type-" + thisEmpSwing).val(swingType);
        $("#swing_start_date-" + thisEmpSwing).val(startDateStr);
        $("#swing_trade_type-" + thisEmpSwing).val(swingTradeType);
        $("#swing_recurrence-" + thisEmpSwing).val(swingRecurDays);  
    
    });
}

function setRequestDetails(reqId, tempId){

    //SET NEXT
    
    console.log("XXREQ ID: ", reqId)

    $.ajax({
        url: '/request/scheduler/' + reqId,
        type: "get",
    }).done(function (response) {
        console.log("REQ: ", response);

        var request = response;
        reqRef = request['ws_ref'];
        reqSiteShort = request['ws_site_dept'];
        reqRefDesc = "RR" + reqRef + "-" + reqSiteShort;

        //$("#swing_request-" + tempId).html("");
        //$("#swing_request-" + tempId).append(swingRequests);

        //var paddedReq = pad(reqId, 6);

        //console.log("PADDED REQ: ", paddedReq);
        
        //$("#swing_request-" + tempId).val(paddedReq);

        //XXTRADES HERE
        
        $("#swing_reference-" + tempId).val("");
        //ADDED 0504
        reqTrades = request['ws_trade_types'];
        $("#swing_trades-" + tempId).val(reqTrades);

        console.log("REQ TRADES: ", reqTrades);
        reqTradesSelection = request['ws_trade_types_selection'];
        console.log("REQ TRADES SELECTION: ", reqTradesSelection);

        //ADD THE TRADES TO THE SELECT
        
        $("#swing_trade_type-" + tempId).html('');
        var tradeTypeOptions = '<option value="NA">Select Swing Trade Type</option>';

        for (var r = 0; r < reqTradesSelection.length; r++) {
            var thisTradeCode = reqTradesSelection[r]['code'];
            var thisTradeDesc = reqTradesSelection[r]['desc'];
            tradeTypeOptions += '<option value="' + thisTradeCode + '">' + thisTradeDesc + '</option>';
        }

        $("#swing_trade_type-" + tempId).append(tradeTypeOptions);
    
        getSwingEmployees(1, reqTrades);

        //PUSH TO CURRENT SWINGS (FROM 2)
        $("#template-actions").find("button").each(function(){
            if(this.id != 'save-swing-template' 
                && this.id != 'save-as-swing-template'
                && this.id != 'cancel-save-swing-template' 
                && this.id != 'auto-date-template' 
                && this.id != 'reset-template-swings'
            ){    
                console.log("THIS ID: ", $(this).prop('id'));
                
                var thisCheckId = $(this).prop('id');
                checkFields = thisCheckId.split('-').pop();
            }
        });

        console.log("CHECKFIELDS: ", checkFields);

        for (var c = 0; c < checkFields; c++) {
            var thisEmpSwing = parseInt(c) + 1;                
            $("#swing_request-" + thisEmpSwing).val(reqId); 
            $("#swing_reference-" + thisEmpSwing).val(reqRefDesc);
            $("#swing_trades-" + thisEmpSwing).val(reqTrades);  
        }
    });
}

//SAVE SWINGS AS A TEMPLATE

$("body").on('click', '#save-bookings-template', function (e) {
    
    var saveErrCount = 0;
    var saveErrMsg = '';

    var updateExisting = $("#select-template-update").val();
    console.log("UPEX: ", updateExisting);

    var updateDesc = $("#template_desc").val();

    if(updateExisting == 'NA' && updateDesc.length < 1 ){
        saveErrCount++;
        saveErrMsg += '<p>Either Select an Existing Template to Update OR Add a New Template Name.</p>';
    }

    if(saveErrCount < 1){
    
        if(updateExisting != 'NA'){
            var saveUrl = 'scheduler/booking/template';
            var updateTemplateDesc = 'NA';
        } else {
            var saveUrl = 'scheduler/bookings/template';
            var updateTemplateDesc = updateDesc;
        } 
        
        console.log("SAVE URL: ",saveUrl);
        console.log("TEMP ID: ", updateExisting);

        e.preventDefault();

        $("#scheduler-template-form").find("div.error").removeClass('error').addClass("noerror");
        $("#scheduler-template-form").find("input.required").removeClass('required');
        $("#scheduler-template-form").find("select.required").removeClass('required');

        var errCount = 0;
        var errMsgArray = [];

        if($("#swing_request-1").val() == 'NA') {        
            errCount++;
            errMsgArray.push({
                "id": "swing_request-1",
                "msg": 'A Request must be selected'
            });
        }
        
        if($("#swing_emps-1").val() === null) {           
            errCount++;
            errMsgArray.push({
                "id": "swing_emps-1",
                "msg": '3At least 1 Employee must be selected'
            });
        }

        $("#template-actions").find("button").each(function(){
            if(this.id != 'save-swing-template' 
                && this.id != 'save-as-swing-template'
                && this.id != 'cancel-save-swing-template' 
                && this.id != 'auto-date-template' 
                && this.id != 'reset-template-swings'
            ){    
                var thisCheckId = $(this).prop('id');
                checkFields = thisCheckId.split('-').pop();
            }
        });
        
        checkFields = parseInt(checkFields) + 1;
        
        for (var c = 1; c < checkFields; c++) {
        
            if($("[id^=swing_type-" + c).val() == 'NA') {                  
                errCount++;
                errMsgArray.push({
                    "id": "swing_type-" + c,
                    "msg": 'A Swing Type must be selected'
                });
            }

            if($("#swing_start_date-" + c).val().length < 1) {
                errCount++;
                errMsgArray.push({
                    "id": "swing_start_date-" + c,
                    "msg": 'A Start Day must be selected'
                });
            }

            if($("#swing_recurrence-" + c).val().length < 1) {
                errCount++;
                errMsgArray.push({
                    "id": "swing_recurrence-" + c,
                    "msg": 'A Recurring Number of days must be provided'
                });
            }
        }
        
        if(errCount > 0){

            console.log("ERRORS: ", errMsgArray);

            for (var e = 0; e < errMsgArray.length; e++) {

                var errorId = errMsgArray[e]['id'];
                var errorMsg = errMsgArray[e]['msg'];

                if(errorId == 'swing_emps-1'){
                    $("#swing_emps_error-1").removeClass('noerror');
                    $("#swing_emps_error-1").addClass('error');
                } else {    
                    $("#" + errorId).addClass('required');
                    $("#" + errorId + "_error").removeClass('noerror');
                    $("#" + errorId + "_error").addClass('error');
                }
                
                if(errorId == 'swing_emps-1'){
                    $("#swing_emps_error-1").html(errorMsg);    
                } else {
                    $("#" + errorId + "_error").html(errorMsg);
                }
            }

        } else {
                
            var requestForm = $("#scheduler-template-form").serialize();

            $.ajax({
                url: saveUrl,
                type: "POST",
                data: {
                    "template_id": updateExisting,
                    "template_name": updateTemplateDesc, 
                    "form": requestForm
                },
                success: function (response) {
                    //console.log(response);
                    var status = response.status;
                    var templateArray = response.template_array;
                    console.log("JJMY TEMPLATE: ", templateArray);

                    document.getElementById("save-scheduler-template-modal").style.display = "none";

                }
            });
        }

    } else {
        $("#save-template-errors").html(saveErrMsg);
        $("#save-template-errors").removeClass("noerror");
        $("#save-template-errors").addClass("error");
    }
});

//SET REQUEST DETAILS
$("#sidebar-right").on('change', '#swing_request-1', function (e) {
    
    e.preventDefault();

    var thisId = $(this).prop('id');
    var tempId = thisId.split('-').pop();
    var reqId = $(this).val();

    console.log("REQ ID: ", reqId)

    if($("#" + thisId).val() != 'NA') {

        $.ajax({
            url: '/request/scheduler/' + reqId,
            type: "get",
        }).done(function (response) {
            console.log("REQ: ", response);

            var request = response;
            reqRef = request['ws_ref'];
            reqSiteShort = request['ws_site_dept'];
            reqRefDesc = "RR" + reqRef + "-" + reqSiteShort;

            $("#swing_reference-" + tempId).val(reqRefDesc);
            //ADDED 0504
            reqTrades = request['ws_trade_types'];
            $("#swing_trades-" + tempId).val(reqTrades);

            reqTradesSelection = request['ws_trade_types_selection'];
            console.log("REQ TRADES SELECTION: ", reqTradesSelection);

            getSwingEmployees(1, reqTrades, reqTradesSelection);

            //PUSH TO CURRENT SWINGS (FROM 2)
            $("#template-actions").find("button").each(function(){
                if(this.id != 'save-swing-template' 
                    && this.id != 'save-as-swing-template'
                    && this.id != 'cancel-save-swing-template' 
                    && this.id != 'auto-date-template' 
                    && this.id != 'reset-template-swings'
                ){    
                    console.log("THIS ID: ", $(this).prop('id'));
                    
                    var thisCheckId = $(this).prop('id');
                    checkFields = thisCheckId.split('-').pop();
                }
            });

            console.log("CHECKFIELDS: ", checkFields);

            for (var c = 0; c < checkFields; c++) {
                var thisEmpSwing = parseInt(c) + 1;                
                alert("SET THE REQUEST");
                $("#swing_request-" + thisEmpSwing).val(reqId); 
                $("#swing_reference-" + thisEmpSwing).val(reqRefDesc);
                $("#swing_trades-" + thisEmpSwing).val(reqTrades);  
            }
        });
    } else {
        
        alert("No Request was selected");

        $("#swing_reference-" + tempId).val("");
    }
});

//SAVE SWINGS AS A TEMPLATE

$("body").on('click', '#save-bookings-template', function (e) {
    
    var saveErrCount = 0;
    var saveErrMsg = '';

    var updateExisting = $("#select-template-update").val();
    console.log("UPEX: ", updateExisting);

    var updateDesc = $("#template_desc").val();

    if(updateExisting == 'NA' && updateDesc.length < 1 ){
        saveErrCount++;
        saveErrMsg += '<p>Either Select an Existing Template to Update OR Add a New Template Name.</p>';
    }

    if(saveErrCount < 1){
    
        if(updateExisting != 'NA'){
            var saveUrl = 'scheduler/booking/template';
            var updateTemplateDesc = 'NA';
        } else {
            var saveUrl = 'scheduler/bookings/template';
            var updateTemplateDesc = updateDesc;
        } 
        
        console.log("SAVE URL: ",saveUrl);
        console.log("TEMP ID: ", updateExisting);

        e.preventDefault();

        $("#scheduler-template-form").find("div.error").removeClass('error').addClass("noerror");
        $("#scheduler-template-form").find("input.required").removeClass('required');
        $("#scheduler-template-form").find("select.required").removeClass('required');

        var errCount = 0;
        var errMsgArray = [];

        if($("#swing_request-1").val() == 'NA') {        
            errCount++;
            errMsgArray.push({
                "id": "swing_request-1",
                "msg": 'A Request must be selected'
            });
        }
        
        if($("#swing_emps-1").val() === null) {           
            errCount++;
            errMsgArray.push({
                "id": "swing_emps-1",
                "msg": '4At least 1 Employee must be selected'
            });
        }

        $("#template-actions").find("button").each(function(){
            if(this.id != 'save-swing-template' 
                && this.id != 'save-as-swing-template'
                && this.id != 'cancel-save-swing-template' 
                && this.id != 'auto-date-template' 
                && this.id != 'reset-template-swings'
            ){    
                var thisCheckId = $(this).prop('id');
                checkFields = thisCheckId.split('-').pop();
            }
        });
        
        checkFields = parseInt(checkFields) + 1;
        
        for (var c = 1; c < checkFields; c++) {
        
            if($("[id^=swing_type-" + c).val() == 'NA') {                  
                errCount++;
                errMsgArray.push({
                    "id": "swing_type-" + c,
                    "msg": 'A Swing Type must be selected'
                });
            }

            if($("#swing_start_date-" + c).val().length < 1) {
                errCount++;
                errMsgArray.push({
                    "id": "swing_start_date-" + c,
                    "msg": 'A Start Day must be selected'
                });
            }

            if($("#swing_recurrence-" + c).val().length < 1) {
                errCount++;
                errMsgArray.push({
                    "id": "swing_recurrence-" + c,
                    "msg": 'A Recurring Number of days must be provided'
                });
            }
        }
        
        if(errCount > 0){

            console.log("ERRORS: ", errMsgArray);

            for (var e = 0; e < errMsgArray.length; e++) {

                var errorId = errMsgArray[e]['id'];
                var errorMsg = errMsgArray[e]['msg'];

                if(errorId == 'swing_emps-1'){
                    $("#swing_emps_error-1").removeClass('noerror');
                    $("#swing_emps_error-1").addClass('error');
                } else {    
                    $("#" + errorId).addClass('required');
                    $("#" + errorId + "_error").removeClass('noerror');
                    $("#" + errorId + "_error").addClass('error');
                }
                
                if(errorId == 'swing_emps-1'){
                    $("#swing_emps_error-1").html(errorMsg);    
                } else {
                    $("#" + errorId + "_error").html(errorMsg);
                }
            }

        } else {
                
            var requestForm = $("#scheduler-template-form").serialize();

            $.ajax({
                url: saveUrl,
                type: "POST",
                data: {
                    "template_id": updateExisting,
                    "template_name": updateTemplateDesc, 
                    "form": requestForm
                },
                success: function (response) {
                    //console.log(response);
                    var status = response.status;
                    var templateArray = response.template_array;
                    console.log("YYMY TEMPLATE: ", templateArray);

                    document.getElementById("save-scheduler-template-modal").style.display = "none";

                }
            });
        }

    } else {
        $("#save-template-errors").html(saveErrMsg);
        $("#save-template-errors").removeClass("noerror");
        $("#save-template-errors").addClass("error");
    }
});

//DELETE BOOKING TEMPLATE
$("body").on('click', '#delete-bookings-template', function (e) {

    var deleteExisting = $("#select-template-update").val();

    var deleteErrCount = 0;
    var deleteErrMsg = '';

    if(deleteExisting == 'NA'){
        deleteErrCount++;
        deleteErrMsg += '<p>No Existing Template was Selected for Deletion.</p>';
    }

    if(deleteErrCount < 1){

        var r = confirm("Are you sure you want to delete the Selected Template?");
        if (r == true) {
        
            $.ajax({
                url: 'scheduler/booking/template/delete',
                type: "POST",
                data: {
                    "template_id": deleteExisting,
                },
                success: function (response) {
                    //console.log(response);
                    var status = response.status;
                    var templateArray = response.template_array;
                    console.log("XXMY TEMPLATE: ", templateArray);

                    document.getElementById("save-scheduler-template-modal").style.display = "none";

                }
            });
        }

    } else {
        $("#save-template-errors").html(deleteErrMsg);
        $("#save-template-errors").removeClass("noerror");
        $("#save-template-errors").addClass("error");
    }    
});

$("#sidebar-right").on('click', '#save-as-swing-template', function (e) {

    $("#save-template-errors").html("");
    $("#save-template-errors").removeClass("error");
    $("#save-template-errors").addClass("noerror");
    
    $.ajax({
        url: 'scheduler/templates',
        type: "GET",
        success: function (response) {
            console.log(response);
            var templates = response;
            
            var displayTemplates = '<form id="save-template-form">';
            
            displayTemplates += '<select id="select-template-update" name="select-template-update" style="margin-top:15px;" class="w3-select w3-border input-display">';

            displayTemplates += '<option value="NA">Update an Existing Template</option>';
        
            for (var t = 0; t < templates.length; t++) {
                var templateDesc = templates[t]['template_desc'];
                var templateId = templates[t]['template_id'];

                displayTemplates += '<option value="' + templateId + '">' + templateDesc + '</option>';
            }

            displayTemplates += '<h5>Update an Existing Template:</h5>';
            displayTemplates += '</select>';

            displayTemplates += '<div id="template-desc" style="padding:15px 10px 10px 0;">';
            displayTemplates += '<label style="font-weight:bold;">Or Create a New Template:</label>';
            displayTemplates += '<input name="template_desc" id="template_desc" class="w3-input w3-border input-display" type="text" placeholder="Add a New Temnplate Name...">';
            displayTemplates += '</div>';

            displayTemplates += '</form>';

            $("#scheduler-templates-select-display").html(displayTemplates);
        
        }
    });
    
    document.getElementById("save-scheduler-template-modal").style.display = "block";

});

$("#sidebar-right").on('click', '#cancel-save-swing-template', function (e) {
    //CANCEL SWING
    e.preventDefault();

    $("#sidebar-right").html("");
    $("#sidebar-right").css({"width": "0px"});
});  

function swingDisplay(reqId, swingId){
    
    $("#sidebar-right").html("");
    $("#sidebar-right").css({"width": "0px"});

    localStorage.setItem('current-request',reqId);

    $.ajax({
        url: '/shifts/request/' + reqId,
        type: "GET"
    }).done(function (response) {

        console.log("SHIFT DETAILS: ", response);
        var shifts = response;
        viewShifts(reqId, shifts, swingId);
        
    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    });

}

$("body").on('click', '#cancel-swings-display', function (e) {

    e.preventDefault();

    document.getElementById('request-swing-details-modal').style.display='none';

});

$("#sidebar-right").on('click', '[id^=cancel-save-swing-update]', function (e) {
    
    //CANCEL SWING
    
    e.preventDefault();

    var cancelId = $(this).prop("id");
    console.log("CANCEL ID: ", cancelId);
    //cancel_save_swing_update-000010-9
    var cancelSplit = cancelId.split("-");
    var reqId = cancelSplit[4];
    console.log("CANCEL REQ ID: ", reqId);
    var swingId = cancelSplit[5];

    swingDisplay(reqId, swingId)

    /* $("#sidebar-right").html("");
    $("#sidebar-right").css({"width": "0px"});

    localStorage.setItem('current-request',reqId);

    $.ajax({
        url: '/shifts/request/' + reqId,
        type: "GET"
    }).done(function (response) {

        console.log("SHIFT DETAILS: ", response);
        var shifts = response;
        viewShifts(reqId, shifts, swingId);
        
    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    }); */

});    

function actionUpdateSwings(param) {

    localStorage.setItem('current-request',param);
    setTemplates(param);
}

/* function actionSwings(param) {

    $("#workspace").html("");

    $("#work-space-header").html("");

    var workSpaceHeader = '<h1 class="w3-xlarge w3-left"><b>XXSwings - Request #' + param + '</b></h1>';
    workSpaceHeader += '<button id="workspace-view-requests" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin-bottom:10px;">View Requests</button>';

    $("#work-space-header").append(workSpaceHeader);
    
    var actionSwings = '<div style="clear:both;"></div>';
    
    actionSwings += '<div id="work-order-table-container" style="margin:0 0 20px 0;">';
    actionSwings += '<table id="workspace-table" class="w3-striped w3-bordered w3-hoverable" style="table-layout:auto;width:100%;border-collapse:collapse;">';
    actionSwings += '<thead>';
    actionSwings += '<tr class="w3-darkblue">';
    actionSwings += '<th>Site Requester</th>';
    actionSwings += '<th>Requester Phone</th>';
    actionSwings += '<th>Shift Type</th>';
    actionSwings += '<th>Firstname</th>';
    actionSwings += '<th>Surname</th>';
    actionSwings += '<th>Position</th>';
    actionSwings += '<th>Arrival</th>';
    actionSwings += '<th>Departure</th>';
    actionSwings += '<th>Notified Employee</th>';
    actionSwings += '<th>Dates on Quote</th>';
    actionSwings += '<th>Quote #</th>';
    actionSwings += '<th>D&A</th>';
    actionSwings += '<th>Rio Inductions</th>';
    actionSwings += '<th>RITM Logged Ticket</th>';
    actionSwings += '<th>RITM Confirmation</th>';
    actionSwings += '<th>Action</th>';
    actionSwings += '</tr>';
    actionSwings += '</thead>';
    //actionSwings += '<tbody>';
    actionSwings += '</table>'; */


    /* //GET SOME SWINGS

    var empId = 1;

    var swingDets = function () {
        var result = $.ajax({
            type: "get",
            url: '/bookings/' + param + "/" + empId,
            async: false,
            success: function (response) {
                //console.log("GET REQ EMP: ",response);
            }
        }) .responseText ;
        return  result;
    }

    //console.log("SWING DETS: ", JSON.strigify(swingDets));
    var reqEmpDetails = swingDets();

    reqEmpDetails = JSON.parse(reqEmpDetails);
    console.log("GET REQ EMP: ", reqEmpDetails);

    var empDets = function () {
        var result = $.ajax({
            type: "get",
            url: '/api/employee/' + empId,
            async: false,
            success: function (response) {
                //console.log("GET REQ EMP: ",response);
            }
        }) .responseText ;
        return  result;
    }

    //console.log("SWING DETS: ", JSON.strigify(swingDets));
    var empDetails = empDets();

    empDetails = JSON.parse(empDetails);
    console.log("GET EMP DETS: ", empDetails);

    actionSwings += '</div>'; */

    ////$("#workspace").append(actionSwings);
//}

function actionEmailRequest(param) {

    $("#sidebar-right").html("");

    //CONFIRM HERE

    var actionEmail = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    actionEmail += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Email Request Confirmation</div>';
    actionEmail += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    actionEmail += '</div>';

    //EMAIL HERE

    actionEmail += '<div class="w3-container" style="margin-top:10px;">';
    actionEmail += '<div style="margin-top:5px;margin-bottom:15px;font-size:12px;">Required Field<span class="required-label">*</span></div>';
    
    actionEmail += '<form id="email-confirmation-form">';

    actionEmail += '<input type="hidden" id="confirm_email_req" name="confirm_email_req" value="' + param + '">';

    actionEmail += '<div class="w3-row">';

    actionEmail += '<div style="padding:0 10px 10px 0;">';
    actionEmail += '<label>Email To<span class="required-label">*</span></label>';
    actionEmail += '<input name="confirm_email_to" id="confirm_email_to" class="w3-input w3-border input-display" type="text">';
    actionEmail += '<div id="confirm_email_to_error" class="noerror" ></div>';
    actionEmail += '</div>';

    actionEmail += '</div>';
    actionEmail += '<div class="w3-row">';

    actionEmail += '<div style="padding:0 10px 10px 0;">';
    actionEmail += '<label>Email CC<span class="required-label">*</span></label>';
    actionEmail += '<input name="confirm_email_cc" id="confirm_email_cc" class="w3-input w3-border input-display" type="text">';
    actionEmail += '<div id="confirm_email_cc_error" class="noerror" ></div>';
    actionEmail += '</div>';

    actionEmail += '</div>';

    actionEmail += '<div class="w3-row">';
    
    actionEmail += '<div style="padding:0 10px 10px 0;">';
    actionEmail += '<label>Email Content<span class="required-label">*</span></label>';
    actionEmail += '<textarea name="confirm_email_content" id="confirm_email_content" class="w3-input w3-border input-display" rows="8" placeholder="Enter any comments here"></textarea>';
    actionEmail += '<div id="confirm_email_content_error" class="noerror" ></div>';
    actionEmail += '</div>';

    actionEmail += '</div>';
    
    actionEmail += '<div id="email-confirm-send-container"></div>';
    
    actionEmail += '<div class="w3-center" style="margin-top:10px;">';

    actionEmail += '<button class="cancel-request-update w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    actionEmail += '<button id="send-quote-confirmation-email-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium">Send</button>';
    actionEmail += '</div>';

    actionEmail += '</div>';

    $("#sidebar-right").append(actionEmail);

    var confirmEmailContent = 'Thank you for emailing your request, we are currently working on allocating personnel to your request and will get back to you with availability of our personnel.';

    $("#confirm_email_content").val(confirmEmailContent);
}


function updateRequest(mode, param){

    console.log("MODE: ", mode);

    console.log("PARAM2: ", param);

    if(mode == 'add'){
        var headerTxt = 'Add';
        var siteDeptDisplay = 'none';
    } else {
        var headerTxt = 'Edit';
        var siteDeptDisplay = 'block';
    }

    $("#sidebar-right").html("");

    var updateRequest = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    updateRequest += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">' + headerTxt + ' Request</div>';
    updateRequest += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    updateRequest += '</div>';

    updateRequest += '<div class="w3-container" style="margin-top:0px;">';
    updateRequest += '<div style="margin-top:5px;margin-bottom:15px;font-size:12px;">Required Field<span class="required-label">*</span></div>';
    updateRequest += '<form id="update-request-form">';

    updateRequest += '<input type="hidden" id="ws_id" name="ws_id" value="">';
    updateRequest += '<input type="hidden" id="ws_type" name="ws_type" value="request">';
    updateRequest += '<input type="hidden" id="ws_customer" name="ws_customer" value="">';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-half" style="padding:5px 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Customer Ref #</label>';
    updateRequest += '<input name="ws_ref" id="ws_ref" class="w3-input w3-border input-display" type="text" style="background-color:lightgrey">';
    updateRequest += '</div>';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label>Request Date<span class="required-label">*</span></label>';
    updateRequest += '<input name="ws_date" id="ws_date" class="w3-input w3-border datepicker input-display" type="text" readonly="readonly">';
    updateRequest += '<div id="ws_date_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Start Date<span class="required-label"<span>*</span></label>';
    updateRequest += '<input name="ws_start_date" id="ws_start_date" class="w3-input w3-border input-display" type="text">';
    updateRequest += '<div id="ws_start_date_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">End Date<span class="required-label"<span>*</span></label>';
    updateRequest += '<input name="ws_end_date" id="ws_end_date" class="w3-input w3-border input-display" type="text">';
    updateRequest += '<div id="ws_end_date_error" class="noerror" ></div>';
    updateRequest += '</div>';
    
    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Customer<span class="required-label"<span>*</span></label>';
    updateRequest += '<input name="ws_customer_name" id="ws_customer_name" class="w3-input w3-border input-display" type="text">';
    updateRequest += '<div id="ws_customer_name_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '<div id="ws_site_dept_display" class="w3-half" style="padding:0 10px 10px 0;display:' + siteDeptDisplay + ';">';
    updateRequest += '<label style="font-weight:bold;">Site/Department<span class="required-label"<span>*</span></label>';
    updateRequest += '<select name="ws_site_dept" id="ws_site_dept" class="w3-select w3-border input-display"></select>';
    updateRequest += '<div id="ws_site_dept_error" class="noerror" ></div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Requester Name<span class="required-label"<span>*</span></label>';
    updateRequest += '<input name="ws_cust_contact" id="ws_cust_contact" class="w3-input w3-border input-display" type="text">';
    updateRequest += '<div id="ws_cust_contact_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Requester Email<span class="required-label"<span>*</span></label>';
    updateRequest += '<input name="ws_cust_contact_email" id="ws_cust_contact_email" class="w3-input w3-border input-display" type="text">';
    updateRequest += '<div id="ws_cust_contact_email_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Requester Phone<span class="required-label"<span>*</span></label>';
    updateRequest += '<input name="ws_cust_contact_phone" id="ws_cust_contact_phone" class="w3-input w3-border input-display" type="text">';
    updateRequest += '<div id="ws_cust_contact_phone_error" class="noerror" ></div>';
    updateRequest += '</div>';
    
    updateRequest += '</div>';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Type 1<span class="required-label"<span>*</span></label>';
    updateRequest += '<select name="ws_trade_type_1" id="ws_trade_type_1" class="trade_type w3-select w3-border input-display"></select>';
    updateRequest += '<div id="ws_trade_type_1_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '<div class="w3-quarter" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Rate 1<span class="required-label"<span>*</span></label>';
    updateRequest += '<select name="ws_trade_rate_1" id="ws_trade_rate_1" class="w3-select w3-border input-display">';
    updateRequest += '<option value="N">Select a Rate</option>';
    updateRequest += '<option value="ST">Short Term</option>';
    updateRequest += '<option value="FS">Field Service</option>';
    updateRequest += '<option value="LT">Long Term</option>';
    updateRequest += '</select>';
    updateRequest += '<div id="ws_trade_rate_1_error" class="noerror" ></div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-quarter" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Number<span class="required-label"<span>*</span></label>';
    updateRequest += '<input name="ws_trade_num_1" id="ws_trade_num_1" class="w3-input w3-border input-disabled" type="text" disabled >';
    updateRequest += '<div id="ws_trade_num_1_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Type 2</label>';
    updateRequest += '<select name="ws_trade_type_2" id="ws_trade_type_2" class="trade_type w3-select w3-border input-display"></select>';
    updateRequest += '<div id="ws_trade_type_2_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '<div class="w3-quarter" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Rate 2</label>';
    updateRequest += '<select name="ws_trade_rate_2" id="ws_trade_rate_2" class="w3-select w3-border input-display">';
    updateRequest += '<option value="N">Select a Rate</option>';
    updateRequest += '<option value="ST">Short Term</option>';
    updateRequest += '<option value="FS">Field Service</option>';
    updateRequest += '<option value="LT">Long Term</option>';
    updateRequest += '</select>';
    updateRequest += '<div id="ws_trade_rate_2_error" class="noerror" ></div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-quarter" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Number</label>';
    updateRequest += '<input name="ws_trade_num_2" id="ws_trade_num_2" class="w3-input w3-border input-disabled" type="text" disabled >';
    updateRequest += '<div id="ws_trade_num_2_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Type 3</label>';
    updateRequest += '<select name="ws_trade_type_3" id="ws_trade_type_3" class="trade_type w3-select w3-border input-display"></select>';
    updateRequest += '<div id="ws_trade_type_3_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '<div class="w3-quarter" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Rate 3</label>';
    updateRequest += '<select name="ws_trade_rate_3" id="ws_trade_rate_3" class="w3-select w3-border input-display">';
    updateRequest += '<option value="N">Select a Rate</option>';
    updateRequest += '<option value="ST">Short Term</option>';
    updateRequest += '<option value="FS">Field Service</option>';
    updateRequest += '<option value="LT">Long Term</option>';
    updateRequest += '</select>';
    updateRequest += '<div id="ws_trade_rate_3_error" class="noerror" ></div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-quarter" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Number</label>';
    updateRequest += '<input name="ws_trade_num_3" id="ws_trade_num_3" class="w3-input w3-border input-disabled" type="text" disabled >';
    updateRequest += '<div id="ws_trade_num_3_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Type 4</label>';
    updateRequest += '<select name="ws_trade_type_4" id="ws_trade_type_4" class="trade_type w3-select w3-border input-display"></select>';
    updateRequest += '<div id="ws_trade_type_4_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '<div class="w3-quarter" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Rate 4</label>';
    updateRequest += '<select name="ws_trade_rate_4" id="ws_trade_rate_4" class="w3-select w3-border input-display">';
    updateRequest += '<option value="N">Select a Rate</option>';
    updateRequest += '<option value="ST">Short Term</option>';
    updateRequest += '<option value="FS">Field Service</option>';
    updateRequest += '<option value="LT">Long Term</option>';
    updateRequest += '</select>';
    updateRequest += '<div id="ws_trade_rate_4_error" class="noerror" ></div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-quarter" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Number</label>';
    updateRequest += '<input name="ws_trade_num_4" id="ws_trade_num_4" class="w3-input w3-border input-disabled" type="text" disabled >';
    updateRequest += '<div id="ws_trade_num_4_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Type 5</label>';
    updateRequest += '<select name="ws_trade_type_5" id="ws_trade_type_5" class="trade_type w3-select w3-border input-display"></select>';
    updateRequest += '<div id="ws_trade_type_5_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '<div class="w3-quarter" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Rate 5</label>';
    updateRequest += '<select name="ws_trade_rate_5" id="ws_trade_rate_5" class="w3-select w3-border input-display">';
    updateRequest += '<option value="N">Select a Rate</option>';
    updateRequest += '<option value="ST">Short Term</option>';
    updateRequest += '<option value="FS">Field Service</option>';
    updateRequest += '<option value="LT">Long Term</option>';
    updateRequest += '</select>';
    updateRequest += '<div id="ws_trade_rate_5_error" class="noerror" ></div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-quarter" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Number</label>';
    updateRequest += '<input name="ws_trade_num_5" id="ws_trade_num_5" class="w3-input w3-border input-disabled" type="text" disabled >';
    updateRequest += '<div id="ws_trade_num_5_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Type 6</label>';
    updateRequest += '<select name="ws_trade_type_6" id="ws_trade_type_6" class="trade_type w3-select w3-border input-display"></select>';
    updateRequest += '<div id="ws_trade_type_6_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '<div class="w3-quarter" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Rate 6</label>';
    updateRequest += '<select name="ws_trade_rate_6" id="ws_trade_rate_6" class="w3-select w3-border input-display">';
    updateRequest += '<option value="N">Select a Rate</option>';
    updateRequest += '<option value="ST">Short Term</option>';
    updateRequest += '<option value="FS">Field Service</option>';
    updateRequest += '<option value="LT">Long Term</option>';
    updateRequest += '</select>';
    updateRequest += '<div id="ws_trade_rate_6_error" class="noerror" ></div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-quarter" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Number</label>';
    updateRequest += '<input name="ws_trade_num_6" id="ws_trade_num_6" class="w3-input w3-border input-disabled" type="text" disabled >';
    updateRequest += '<div id="ws_trade_num_6_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label>Quote Date</label>';
    updateRequest += '<input name="ws_quote_date" id="ws_quote_date" class="w3-input w3-border datepicker input-display" type="text" readonly="readonly">';
    updateRequest += '</div>';

    updateRequest += '</div>';

    /* updateRequest += '<div class="w3-row">';

    updateRequest += '<div id="rec_flights_display" class="w3-half" style="padding:10px 0 10px 0px;">';
    updateRequest += '<label style="margin:0;">Received Flights:</label>';

    updateRequest += '<div style="margin:0">';
    updateRequest += '<input id="rec_flights_yes" name="ws_rec_flights" class="w3-radio input-display" type="radio" value="Y">';
    updateRequest += '<label style="margin-left:5px;font-weight:normal;">Yes</label>';
    updateRequest += '<input id="rec_flights_no" name="ws_rec_flights" class="w3-radio" type="radio" value="N" style="margin-left:10px;">';
    updateRequest += '<label style="margin-left:5px;font-weight:normal;">No</label>';
    updateRequest += '</div>';

    updateRequest += '</div>';

    updateRequest += '<div id="flights_sent_display" class="w3-half" style="padding:10px 0 10px 0px;">';
    updateRequest += '<label style="margin:0;">Flights Sent:</label>';

    updateRequest += '<div style="margin:0">';
    updateRequest += '<input id="flights_sent_yes" name="ws_flights_sent" class="w3-radio input-display" type="radio" value="Y">';
    updateRequest += '<label style="margin-left:5px;font-weight:normal;">Yes</label>';
    updateRequest += '<input id="flights_sent_no" name="ws_flights_sent" class="w3-radio" type="radio" value="N" style="margin-left:10px;">';
    updateRequest += '<label style="margin-left:5px;font-weight:normal;">No</label>';
    updateRequest += '</div>';

    updateRequest += '</div>';

    updateRequest += '</div>';
 */
    updateRequest += '<div class="w3-row">';
    updateRequest += '<div style="padding:0 10px 10px 0;">';
    updateRequest += '<label>Comments<span class="required-label">*</span></label>';
    updateRequest += '<textarea name="ws_comments" id="ws_comments" class="w3-input w3-border input-display" rows="8" placeholder="Enter any comments here"></textarea>';
    updateRequest += '<div id="ws_comments_error" class="noerror" ></div>';
    updateRequest += '</div>';
    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Mobiliser Assigned<span class="required-label"<span>*</span></label>';
    updateRequest += '<input name="ws_mobiliser" id="ws_mobiliser" class="w3-input w3-border input-display" type="text">';
    updateRequest += '<div id="ws_mobiliser_error" class="noerror" ></div>';
    updateRequest += '</div>';
    
    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-row">';
    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label>Status</label>';
    updateRequest += '<select name="ws_status" id="ws_status" class="w3-select w3-border input-display">';
    updateRequest += '<option value="N" selected>Select Request Status</option>';
    updateRequest += '<option value="E">New</option>';
    updateRequest += '<option value="Q">Quoted</option>';
    //updateRequest += '<option value="M">Scheduled</option>';
    //updateRequest += '<option value="M">Commenced</option>';
    //updateRequest += '<option value="N">Paused</option>';
    //updateRequest += '<option value="I">Invoiced</option>';
    updateRequest += '<option value="M">Missed Engagement</option>';
    //updateRequest += '<option value="X">Cancelled</option>';
    updateRequest += '</select>';
    updateRequest += '</div>';
    updateRequest += '</div>';

    //updateRequest += '<div class="fp2">Load FilePond 2</div>';
    //updateRequest += '<div class="pond2"></div>';

    updateRequest += '</div>';

    updateRequest += '</form>';

    updateRequest += '<div class="w3-center" style="margin:10px 0 30px 0;">';
    updateRequest += '<button type="button" class="cancel-request-update w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    updateRequest += '<button type="button" id="save-request-update" class="w3-button w3-darkblue w3-mobile w3-medium">Save</button>';
    updateRequest += '</div>';

    updateRequest += '</div>';

    $("#sidebar-right").append(updateRequest);

    //document.getElementById("ws_ref").focus();
    $("#sidebar-right").animate({ scrollTop: 0 }, "fast");

    $("#rec_flights_no").prop("checked", true);
    $("#flights_sent_no").prop("checked", true);

    //ADD TRADE TYPES

    $.ajax({
        url: '/employee/000001',
        type: "GET",
        success: function (response) {

            var employee = response.employee;
            console.log("EMP TRADES: ", employee);

            var trades = response.trades;

            $(".trade_type").html("");

            var tradeTypeOptions = '<option value="N">Select a Trade</option>';

            for (var t = 0; t < trades.length; t++) {

                var tradeDesc = trades[t]['trade_desc'];
                var tradeCode = trades[t]['trade_code'];

                tradeTypeOptions += '<option value="' + tradeCode + '">' + tradeDesc + '</option>';
            }

            $(".trade_type").append(tradeTypeOptions);
        }
    });

    if(mode == 'add'){
        $("#ws_status").val('E');
    } else {

        console.log("PARAM3: ", param);

        var wsId = param;

        $.ajax({
            url: '/request/' + wsId,
            type: "GET",
            success: function (response) {

                var request = response;

                console.log("REQ: ", request);

                for (var key in request) {
                                        
                    if(key.substr(0,12) == 'ws_trade_num') {

                        console.log("NUM KEY: ", key);
                        
                        var keyValue = request[key];

                        console.log("NUM KEY VAL: ", keyValue);

                        console.log("KV: ", keyValue);
                        if(keyValue > 0) {
                            $("#" + key).prop("disabled", false);
                            $("#" + key).removeClass('input-disabled');
                            $("#" + key).addClass('input-display');
                            $("#" + key).val(keyValue);   
                        } else {
                            $("#" + key).prop("disabled", true);
                            $("#" + key).val("");  
                        }
                    
                    } else if(key == 'ws_customer'){

                        console.log("get cust name");
                        var custId = request['ws_customer'];

                        $.ajax({
                            url: '/customer/' + custId,
                            type: "GET",
                            success: function (response) {
                                //console.log(response);
                                var custName = response.cust_name;

                                $("#ws_customer_name").val(custName);

                                $.ajax({
                                    url: '/customer/sites/' + custId,
                                    type: "GET",
                                    success: function (response) {
                                        var sites = response;
                                        console.log("SITES: ", sites);

                                        $("#ws_site_dept").html("");

                                        var siteOptions = '<option value="N">Select a Site</option>';

                                        for (var s = 0; s < sites.length; s++) {

                                            var siteDesc = sites[s]['site_desc'];
                                            var siteCode = sites[s]['site_code'];

                                            siteOptions += '<option value="' + siteCode + '">' + siteDesc + '</option>';
                                        }

                                        $("#ws_site_dept").append(siteOptions);
                                        $("#ws_site_dept").val(request['ws_site_dept']);
                                    }
                                });

                            }
                        });

                        $("#" + key).val(request[key]);

                    } else {

                       var check = key + " - " + request[key];

                        //console.log("KEY: ", check);

                        $("#" + key).val(request[key]);
                    }
                }
            }
        });

    }
}

function viewWorkspace(wsRequests, totalRecords, page){

    var minwidth1 = '78px';
    var minwidth2 = '78px';
    var minwidth3 = '93px';
    var minwidth4 = '124px';
    var minwidth5 = '109px';
    var minwidth6 = '124px';
    var minwidth7 = '124px';
    var minwidth8 = '140px';
    var minwidth9 = '109px';
    var minwidth10 = '109px';
    var minwidth11 = '109px';
    var minwidth12 = '78px';
    var minwidth13 = '78px';
    var minwidth14 = '155px';
    var minwidth15 = '62px';
    var minwidth16 = '47px';

    var wsTable = '<div id="table-wrapper">'; 
    wsTable += '<table id="request-view" class="w3-striped w3-bordered w3-hoverable">'; 
    
    /*
    wsTable += '<table id="new-ws-table">'; 
    wsTable += '<thead>'; 
    wsTable += '<tr>';
    wsTable += '<th style="min-width:200px;">Table Header 1</th>';
    wsTable += '<th style="min-width:150px;">Table Header 2</th>';
    wsTable += '<th style="min-width:150px;">Table Header 3</th>';
    wsTable += '<th style="min-width:150px;">Table Header 4</th>';
    wsTable += '<th style="min-width:150px;">Table Header 5</th>';
    wsTable += '<th style="min-width:150px;">Table Header 6</th>';
    wsTable += '<th style="min-width:150px;">Table Header 7</th>';
    wsTable += '<th style="min-width:150px;">Table Header 8</th>';
    wsTable += '<th style="min-width:150px;">Table Header 9</th>';
    wsTable += '<th style="min-width:150px;">Table Header 10</th>';
    wsTable += '<th style="min-width:150px;">Table Header 11</th>';
    wsTable += '<th style="min-width:150px;">Table Header 12</th>';
    wsTable += '<th style="min-width:150px;">Table Header 13</th>';
    wsTable += '</tr>';
    wsTable += '</thead>';
    wsTable += '<tbody>'; */

    wsTable += '<thead>';
    wsTable += '<tr class="w3-darkblue">';
    wsTable += '<th style="min-width:' + minwidth1 + ';">Id #</th>';
    wsTable += '<th style="min-width:' + minwidth2 + ';">Req #</th>';
    wsTable += '<th style="min-width:' + minwidth3 + ';">Req. Date</th>';
    wsTable += '<th style="min-width:' + minwidth4 + ';">Requester</th>';
    wsTable += '<th style="min-width:' + minwidth5 + ';">Phone</th>';
    wsTable += '<th style="min-width:' + minwidth6 + ';">Site</th>';
    wsTable += '<th style="min-width:' + minwidth7 + ';">Mobiliser</th>';
    wsTable += '<th style="min-width:' + minwidth8 + ';">Trades Req.</th>';
    wsTable += '<th style="min-width:' + minwidth9 + ';">Start Date</th>';
    wsTable += '<th style="min-width:' + minwidth10 + ';">End Date</th>';
    wsTable += '<th style="min-width:' + minwidth11 + ';">Swings Scheduled</th>';
    wsTable += '<th style="min-width:' + minwidth12 + ';">Emp(s) Notified</th>';
    wsTable += '<th style="min-width:' + minwidth13 + ';">Emp(s) Conf.</th>';
    wsTable += '<th style="min-width:' + minwidth14 + ';">Comments</th>';
    wsTable += '<th style="min-width:' + minwidth15 + ';">Status</th>';
    wsTable += '<th style="min-width:' + minwidth16 + ';">Action</th>';
    wsTable += '</tr>';
    wsTable += '</thead>';
    wsTable += '<tbody>';

    /* var wsTable = '<div id="table-wrapper">'; 
    wsTable += '<table id="new-ws-table">'; 
    wsTable += '<thead>'; 
    wsTable += '<tr>';
    wsTable += '<th>Table Header 1</th>';
    wsTable += '<th>Table Header 2</th>';
    wsTable += '<th>Table Header 3</th>';
    wsTable += '<th>Table Header 4</th>';
    wsTable += '<th>Table Header 5</th>';
    wsTable += '<th>Table Header 6</th>';
    wsTable += '<th>Table Header 7</th>';
    wsTable += '<th>Table Header 8</th>';
    wsTable += '<th>Table Header 9</th>';
    wsTable += '<th>Table Header 10</th>';
    wsTable += '<th>Table Header 11</th>';
    wsTable += '<th>Table Header 12</th>';
    wsTable += '<th>Table Header 13</th>';
    wsTable += '</tr>';
    wsTable += '</thead>';
    wsTable += '<tbody>'; */
    
    //for (var w = 0; w < 13; w++) {

        //' + minwidth + '
        
        /*
        wsTable += '<tr>';
        wsTable += '<td style="min-width:' + minwidth1 + ';">Data1111111111111111111111111 ' + w + '</td>';
        wsTable += '<td style="min-width:' + minwidth2 + ';">Data2 ' + w + '</td>';
        wsTable += '<td style="min-width:' + minwidth3 + ';">Data3 ' + w + '</td>';
        wsTable += '<td style="min-width:' + minwidth4 + ';">Data4 ' + w + '</td>';
        wsTable += '<td style="min-width:' + minwidth5 + ';">Data5 ' + w + '</td>';
        wsTable += '<td style="min-width:' + minwidth6 + ';">Data6 ' + w + '</td>';
        wsTable += '<td style="min-width:' + minwidth7 + ';">Data7 ' + w + '</td>';
        wsTable += '<td style="min-width:' + minwidth8 + ';">Data8 ' + w + '</td>';
        wsTable += '<td style="min-width:' + minwidth9 + ';">Data9 ' + w + '</td>';
        wsTable += '<td style="min-width:' + minwidth10 + ';">Data10 ' + w + '</td>';
        wsTable += '<td style="min-width:' + minwidth11 + ';">Data11 ' + w + '</td>';
        wsTable += '<td style="min-width:' + minwidth12 + ';">Data12 ' + w + '</td>';
        wsTable += '<td style="min-width:' + minwidth13 + ';">Data13 ' + w + '</td>';
        wsTable += '<td style="min-width:' + minwidth14 + ';">Data14 ' + w + '</td>';
        wsTable += '<td style="min-width:' + minwidth15 + ';">Data15 ' + w + '</td>';
        wsTable += '<td style="min-width:' + minwidth16 + ';">Data16 ' + w + '</td>';
        wsTable += '</tr>';
        */

        /*
        wsTable += '<tr>';
        wsTable += '<td>Data1111111111111111111111111</td>';
        wsTable += '<td>Data2</td>';
        wsTable += '<td>Data3</td>';
        wsTable += '<td>Data4</td>';
        wsTable += '<td>Data5</td>';
        wsTable += '<td>Data6</td>';
        wsTable += '<td>Data7</td>';
        wsTable += '<td>Data8</td>';
        wsTable += '<td>Data9</td>';
        wsTable += '<td>Data10</td>';
        wsTable += '<td>Data11</td>';
        wsTable += '<td>Data12</td>';
        wsTable += '<td>Data13</td>';
        wsTable += '</tr>';

        */

    //}
    
    //wsTable += '</tbody>';
    //wsTable += '</table>';

   // wsTable += '</div>';
    
    /*
    var wsTable = '<div id="work-order-table-container" style="width:900px;height:900px;margin:0 0 20px 0;border:2px solid brown;overflow-y:scroll;">';
    //wsTable += '</div>';    
    //wsTable += '<table id="workspace-table" class="w3-striped w3-bordered w3-hoverable" style="table-layout:auto;border-collapse:collapse;">';
    
    
    wsTable += '<table id="workspace-table" class="w3-striped w3-bordered w3-hoverable" style="border-collapse:collapse;">';
    wsTable += '<thead>';
    wsTable += '<tr class="w3-darkblue">';
    wsTable += '<th>Id #</th>';
    wsTable += '<th>Req #</th>';
    wsTable += '<th>Req. Date</th>';
    wsTable += '<th>Requester</th>';
    wsTable += '<th>Phone</th>';
    wsTable += '<th>Site</th>';
    wsTable += '<th>Mobiliser</th>';
    wsTable += '<th>Trades Req.</th>';
    wsTable += '<th>Start Date</th>';
    wsTable += '<th>End Date</th>';
    wsTable += '<th>Swings Scheduled</th>';
    wsTable += '<th>Emp(s) Notified</th>';
    wsTable += '<th>Emp(s) Conf.</th>';
    wsTable += '<th>Comments</th>';
    wsTable += '<th>Status</th>';
    wsTable += '<th>Action</th>';
    wsTable += '</tr>';
    wsTable += '</thead>';
    wsTable += '<tbody style="overflow-y: auto;">';

    */
    
    for (var w = 0; w < wsRequests.length; w++) {

        var wsId = wsRequests[w]['ws_id'];
        var wsRef = wsRequests[w]['ws_ref'];
        var wsDate = wsRequests[w]['ws_date'];
        var wsRequester = wsRequests[w]['ws_cust_contact'];
        var wsRequesterPhone = wsRequests[w]['ws_cust_contact_phone'];
        var wsSiteDept = wsRequests[w]['ws_site_dept'];
        var wsMobiliser = wsRequests[w]['ws_mobiliser'];
        var wsTrades = wsRequests[w]['ws_trade_types'];
        var wsStartDate = wsRequests[w]['ws_start_date'];
        var wsEndDate = wsRequests[w]['ws_end_date'];
        var wsComments = wsRequests[w]['ws_comments'];
        var wsStatus = wsRequests[w]['ws_status'];
        var wsNumSwings = wsRequests[w]['ws_num_swings'];
        if(wsNumSwings == null || wsNumSwings.length == 0){
            wsNumSwings = 0;
        }
        var wsNumScheduled = wsRequests[w]['ws_num_scheduled'];
        if(wsNumScheduled == null || wsNumScheduled.length == 0){
            wsNumScheduled = 0;
        }
        
        var requestCums = wsRequests[w]['request_cums'];
        var wsNumNotified = requestCums['num_notified'];
        var wsNumDelivered = requestCums['num_delivered'];
        var wsNumConfirmed = requestCums['num_confirmed'];
        
        if(wsNumNotified == null || wsNumNotified.length == 0){
            wsNumNotified = 0;
        }
        if(wsNumDelivered == null || wsNumDelivered.length == 0){
            wsNumNotified = 0;
        }
        if(wsNumConfirmed == null || wsNumConfirmed.length == 0){
            wsNumConfirmed = 0;
        }

        if(wsStatus == 'E') {
            var wsBgCol = 'w3-orange';
            var wsStatusText = 'New'
        } else if(wsStatus == 'Q'){
            var wsBgCol = 'w3-green';
            var wsStatusText = 'Quoted'
        } else if(wsStatus == 'M'){
            var wsBgCol = 'w3-red';
            var wsStatusText = 'Cancelled'
        } else {
            var wsBgCol = '';
        }

        if(wsNumSwings > 0){
            if(wsNumSwings == wsNumScheduled){
                var scheduledBgClass = 'ws-complete';
            } else {
                var scheduledBgClass = 'ws-partial';
            }
        } else {
            var scheduledBgClass = 'ws-non-sched';
        }

        if(wsNumSwings > 0){
            if(wsNumSwings == wsNumNotified){
                if(wsNumDelivered != wsNumNotified){
                    var notifiedBgClass = 'ws-complete-nondel';
                } else {
                    var notifiedBgClass = 'ws-complete';
                }
            } else {
                if(wsNumDelivered != wsNumNotified){
                    var notifiedBgClass = 'ws-partial-nondel';
                } else {
                    var notifiedBgClass = 'ws-partial';
                }
            }
        } else {
            var notifiedBgClass = 'ws-none';
        }

        if(wsNumSwings > 0){
            if(wsNumSwings == wsNumConfirmed){
                var confirmedBgClass = 'ws-complete';
            } else {
                var confirmedBgClass = 'ws-partial';
            }
        } else {
            var confirmedBgClass = 'ws-none';
        }

        var storedRow = localStorage.getItem('last-req-row');
        
        if(wsId == storedRow){
            var hl_class = 'highlight-row';
        } else {
            var hl_class = ''
        }
        
        wsTable += '<tr id="req_row_' + wsId + '" class="req-row ' + hl_class + '">';
        wsTable += '<td style="min-width:' + minwidth1 + ';">' + wsId + '</td>';
        wsTable += '<td style="min-width:' + minwidth2 + ';">RR' + wsRef + '</td>';
        wsTable += '<td style="min-width:' + minwidth3 + ';">' + wsDate + '</td>';
        wsTable += '<td style="min-width:' + minwidth4 + ';">' + wsRequester + '</td>';
        wsTable += '<td style="min-width:' + minwidth5 + ';">' + wsRequesterPhone + '</td>';
        wsTable += '<td style="min-width:' + minwidth6 + ';">' + wsSiteDept + '</td>';
        wsTable += '<td style="min-width:' + minwidth7 + ';">' + wsMobiliser + '</td>';
        wsTable += '<td style="min-width:' + minwidth8 + ';">' + wsTrades + '</td>';
        wsTable += '<td style="min-width:' + minwidth9 + ';">' + wsStartDate + '</td>';
        wsTable += '<td style="min-width:' + minwidth10 + ';">' + wsEndDate + '</td>';
        wsTable += '<td class="' + scheduledBgClass + '" style="min-width:' + minwidth11 + ';text-align:center;">' + wsNumSwings + '/' + wsNumScheduled + '</td>';
        wsTable += '<td class="' + notifiedBgClass + '" style="min-width:' + minwidth12 + ';text-align:center;">' + wsNumNotified + '/' + wsNumSwings + '</td>';
        wsTable += '<td class="' + confirmedBgClass + '" style="min-width:' + minwidth13 + ';text-align:center;">' + wsNumConfirmed + '/' + wsNumSwings + '</td>';
        wsTable += '<td style="min-width:' + minwidth14 + ';">' + wsComments + '</td>';
        wsTable += '<td style="min-width:' + minwidth15 + ';text-align:center;" class="' + wsBgCol +'">' + wsStatusText + '</td>';
        wsTable += '<td style="min-width:' + minwidth16 + ';text-align:center;" id="row_'+ wsId + '"><button class="w3-button w3-small w3-transparent w3-padding-small menu-button"><i class="fas fa-ellipsis-h"></i></button></td>';
        wsTable += '</tr>';
    }

    wsTable += '</tbody>';
    wsTable += '</table>';
    wsTable += '</div>';

    //PAGINATION
    var limit = 100;
    var pageNum = page;
    var totalPage = Math.ceil(totalRecords / limit);

    var output = '';

    output += '<div id="pagination" class="w3-center" style="margin-bottom:20px;">';
    output += '<div class="w3-bar w3-border">';

    if(pageNum > 1) {

        var prevPage = parseInt(pageNum) - 1;
        var prevLink = '<a id="workspace_page_' + prevPage + '" href="" class="w3-bar w3-button">&laquo;</a>';
        output += prevLink;

    }

    for (var i=1; i <= totalPage ; i++) {

        if (i == pageNum) {
            var active = "w3-darkblue";
        } else {
            var active = "";
        }

        output += '<a id="workspace_page_' + i + '" href="" class="w3-button ' + active + '">' + i + '</a>';

    }

    if(pageNum < totalPage) {

        var nextPage = parseInt(pageNum) + 1;
        var nextLink = '<a id="workspace_page_' + nextPage + '" href="" class="w3-bar w3-button">&raquo;</a>';
        output += nextLink;
    }

    output += '</div>';
    output += '</div>';

    if(totalRecords > 100) {
        wsTable += output;
    }

    
    
    
    
    $("#workspace").html("");

    $("#workspace").append(wsTable);

}

getWorkspace('requests',1);

function getWorkspace(type, page){

    var sbContUrl = "/" + type;

    console.log("URL:", sbContUrl);

    $("#workspace").html("");

    var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    $("#workspace").append(spinHtml);

    $.ajax({
        url: sbContUrl,
        type: "get",
        data: {
            "page": page
        }
    }).done(function (response) {

        var wsRequests = response.requests;

        console.log("REQS: ", wsRequests);

        var totalRecords = response.total_requests;

        viewWorkspace(wsRequests, totalRecords, page);

    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    });

}