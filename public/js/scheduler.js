/*
(function (window) {
    var myBrilliantThingy;
    // assemble myBrilliantThingy
    myBrilliantThingy = "bla";

    console.log(myBrilliantThingy);

    localStorage.setItem('scheduler_filter', myBrilliantThingy)

    window.myBrilliantThingy = myBrilliantThingy;
}(window));
*/

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

$(document).on('focus',"#check_to_date", function(){

    $(this).datepicker({

        beforeShow: function (input, inst) {
            setTimeout(function () {
                inst.dpDiv.outerWidth($(input).outerWidth());
            }, 0);
        },

        dateFormat: 'dd-mm-yy',
        closeText: "X",
        showButtonPanel: true,
        beforeShowDay: function(date){
            return [(date >= ($("#check_from_date").datepicker("getDate")
            || new Date()))];
        }

    });

});

$(document).on('focus',"#check_from_date", function(){

     $(this).datepicker({

         dateFormat: 'dd-mm-yy',
         closeText: "X",
         showButtonPanel: true,
         beforeShowDay: function(date){
             return [(date <= ($("#check_to_date").datepicker("getDate")
             || new Date()))];
         }

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

$("#sidebar-right").on('click', '#cancel-check-availability', function (e) {

    e.preventDefault();

    $("#sidebar-right").css({"width": "0px"});
    localStorage.removeItem('right-sidebar-content');
});

$("#sidebar-right").on('click', '#check-availability', function (e) {

    e.preventDefault();

    $("#customer_update_form").find("div.error").removeClass('error').addClass("noerror");
    $("#customer_update_form").find("input.required").removeClass('required');

    var errCount = 0;
    var errMsgArray = [];

    if ($("#check_from_date").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'check_from_date',
            "msg": 'A From Date must be selected'
        });
    }

    if ($("#check_to_date").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'check_to_date',
            "msg": 'A To Date must be selected'
        });
    }

    if (errCount > 0) {

        console.log("AVAIL ERRORS: ", errMsgArray);

        for (var e = 0; e < errMsgArray.length; e++) {

            var errorId = errMsgArray[e]['id'];
            var errorMsg = errMsgArray[e]['msg'];

            $("#" + errorId).addClass('required');
            $("#" + errorId + "_error").removeClass('noerror');
            $("#" + errorId + "_error").addClass('error');
            $("#" + errorId + "_error").html(errorMsg);

        }

    } else {

        console.log("CHECKING!");

        var availabilityForm = $("#check-availability-form").serialize();


        $.ajax({
            url: '/bookings/availability',
            type: "GET",
            data: {
                "form": availabilityForm
            },
            success: function (response) {
                console.log(response);
            }
        });

    }
});

function setSidebarRightContent(currentRightSidebar){

    $("#sidebar-right").html("");

    var thisId = currentRightSidebar;
    var sidebarContent = thisId.split('_');

    console.log("SBCA: ", sidebarContent);

    var action = sidebarContent[0];
    var param = sidebarContent[1];

    console.log("ACTION: ", action);

    if (action == 'availability') {

        checkAvailability(param)

    } else if (action == 'criteria') {

        viewCriteria()
        //doFilter();

    } else {

        var sbCont = "<div>Other</div>";
        $("#sidebar-right").append(sbCont);
    }

}

$("body").on('click','[id^=filter-scheduler]', function (e) {

    e.preventDefault();

    var thisId = $(this).prop('id');

    console.log("TID", thisId);

    var sidebarContent = thisId.split('-').pop();

    console.log("SBC", sidebarContent);

    var currentRightSidebar = localStorage.getItem('right-sidebar-content');
    var isClose = document.getElementById("sidebar-right").style.width === "500px";

    if (!isClose) {

        $("#sidebar-right").css({"width": "500px"});
        setSidebarRightContent(sidebarContent)

    } else {

        if (currentRightSidebar != sidebarRightContent) {
            setSidebarContent(sidebarContent)
        } else {
            $("#sidebar-right").css({"width": "0px"});
            localStorage.removeItem('right-sidebar-content');
        }

    }

    localStorage.setItem('right-sidebar-content', sidebarContent);

});

$("#sidebar-right").on('click', '#update-scheduler-filter', function (e) {

    e.preventDefault();

    var filterForm = $("#scheduler-filter-form").serialize();

    console.log("FF: ", filterForm);

    if(filterForm.length > 0) {

        $.ajax({
            url: 'scheduler/filter',
            type: "GET",
            data: {
                "form": filterForm
            },
            success: function (response) {
                console.log(response);

                var resources = response;
                console.log("FILTER: ", resources.length);

                if (resources.length > 0) {
                    setResources(resources);
                } else {
                    alert("No Matches Found")
                }
            }
        });

    } else {
        alert("No Filter Criteria selected");
    }
});

function viewCriteria() {

    var criteriaSelection = '<form id="scheduler-filter-form">';

    $.ajax({
        url: '/skills',
        type: "GET",
        success: function (response) {

            console.log("RESP: ", response);

            var skills = response;

            $("#sidebar-right").html("");

            criteriaSelection += '<div class="w3-bar w3-darkblue" style="width:100%;">';
            criteriaSelection += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Filter Scheduler</div>';
            criteriaSelection += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
            criteriaSelection += '</div>';

            criteriaSelection += '<div style="margin:35px 15px 15px 15px;">';

            var count = 1;

            for (var s = 0; s < skills.length; s++) {

                var skillDesc = skills[s]['skill_desc'];
                var skillCode = skills[s]['skill_code'];

                if(count == 1 ){
                    criteriaSelection += '<div class="w3-row filter-row">';
                }

                criteriaSelection += '<div class="w3-third" style="padding:0 10px 10px 0;">';
                criteriaSelection += '<input id="skill_' + skillCode + '" name="skill_' + skillCode + '" class="w3-check" type="checkbox" value="' + skillCode + '">';
                criteriaSelection += '<label style="margin-left:5px;font-weight:normal;">' + skillDesc + '</label>';
                criteriaSelection += '</div>';

                if(count % 3 === 0){
                    criteriaSelection += '</div>';
                    criteriaSelection += '<div class="w3-row filter-row">';
                }

                count++;
            }

            criteriaSelection += '</div>';

            criteriaSelection += '<div class="w3-center" style="margin-top:15px;">';
            criteriaSelection += '<button id="update-scheduler-filter" class="w3-button w3-padding-large w3-darkblue w3-margin-bottom" style="margin-top:15px;">Filter</button>';
            criteriaSelection += '</div>';

            criteriaSelection += '</form>';

            $("#sidebar-right").append(criteriaSelection);

        }

    });

}

function checkAvailability(param) {

    $("#sidebar-right").html("");

    var checkAvailability = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    checkAvailability += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Check Availability</div>';
    checkAvailability += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    checkAvailability += '</div>';

    checkAvailability += '<div class="w3-container" style="margin-top:0px;">';
    checkAvailability += '<div style="margin-top:5px;margin-bottom:15px;font-size:12px;">Required Field<span class="required-label">*</span></div>';
    checkAvailability += '<form id="check-availability-form">';

    //checkAvailability += '<input type="hidden" id="ws_id" name="ws_id" value="">';

    checkAvailability += '<div class="w3-row">';

    checkAvailability += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    checkAvailability += '<label>From Date<span class="required-label">*</span></label>';
    checkAvailability += '<input name="check_from_date" id="check_from_date" class="w3-input w3-border input-display" type="text" readonly="readonly">';
    checkAvailability += '<div id="check_from_date_error" class="noerror" ></div>';
    checkAvailability += '</div>';

    checkAvailability += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    checkAvailability += '<label>To Date<span class="required-label">*</span></label>';
    checkAvailability += '<input name="check_to_date" id="check_to_date" class="w3-input w3-border input-display" type="text" readonly="readonly">';
    checkAvailability += '<div id="check_to_date_error" class="noerror" ></div>';
    checkAvailability += '</div>';

    checkAvailability += '</div>';

    checkAvailability += '</form>';

    checkAvailability += '<div class="w3-center" style="margin-top:10px;">';
    checkAvailability += '<button id="cancel-check-availability" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    checkAvailability += '<button id="check-availability" class="w3-button w3-darkblue w3-mobile w3-medium">Check</button>';
    checkAvailability += '</div>';

    checkAvailability += '</div>';

    $("#sidebar-right").append(checkAvailability);

}

function doFilter(){

    $("#sidebar-right").html("");

    var editRequest = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    editRequest += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Edit Request</div>';
    editRequest += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    editRequest += '</div>';

    editRequest += '<div class="w3-container" style="margin-top:0px;">';
    editRequest += '<div style="margin-top:5px;margin-bottom:15px;font-size:12px;">Required Field<span class="required-label">*</span></div>';
    editRequest += '<form id="update-request-form">';

    editRequest += '<input type="hidden" id="ws_id" name="ws_id" value="">';

    editRequest += '<div class="w3-row">';

    editRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    editRequest += '<label style="font-weight:bold;">Work Order Reference #<span class="required-label"<span>*</span></label>';
    editRequest += '<input name="ws_work_order" id="ws_work_order" class="w3-input w3-border input-display" type="text">';
    editRequest += '<div id="ws_work_order_error" class="noerror" ></div>';
    editRequest += '</div>';

    editRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    editRequest += '<label>Order Date<span class="required-label">*</span></label>';
    editRequest += '<input name="ws_work_order_date" id="ws_work_order_date" class="w3-input w3-border datepicker input-display" type="text" readonly="readonly">';
    editRequest += '<div id="ws_work_order_date_error" class="noerror" ></div>';
    editRequest += '</div>';

    editRequest += '</div>';

    editRequest += '<div class="w3-row">';

    editRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    editRequest += '<label>Order Time<span class="required-label">&nbsp;</span></label>';
    editRequest += '<input name="ws_work_order_time" id="ws_work_order_time" class="w3-input w3-border timepicker input-display" type="text" readonly="readonly">';
    editRequest += '</div>';

    editRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    editRequest += '<label>Priority<span class="required-label">*</span></label>';
    editRequest += '<select name="ws_priority" id="ws_priority" class="w3-select w3-border input-display"></select>';
    editRequest += '<div id="ws_priority_error" class="noerror" ></div>';
    editRequest += '</div>';

    editRequest += '</div>';

    editRequest += '<div class="w3-row">';

    editRequest += '<div class="fp2">Load FilePond 2</div>';
    editRequest += '<div class="pond2"></div>';

    editRequest += '</div>';

    editRequest += '</form>';

    editRequest += '<div class="w3-center" style="margin-top:10px;">';
    editRequest += '<button id="cancel-request-update" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    editRequest += '<button id="save-request-update" class="w3-button w3-darkblue w3-mobile w3-medium">Save</button>';
    editRequest += '</div>';

    editRequest += '</div>';

    $("#sidebar-right").append(editRequest);

}

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

    localStorage.setItem('scheduler_resources', JSON.stringify(resourcesArray[0]));

    window.location.assign('/scheduler');

}

$("body").on('click','#set-scheduler-resources', function (e) {

    e.preventDefault();

    $.ajax({
        url: 'scheduler/filter',
        type: "GET",
        data: {
            "form": 'all'
        },
        success: function (response) {

            console.log("RESP: ", response);

            var resources = response;
            setResources(resources);

        }
    });

    var schedulerResources = JSON.parse(localStorage.getItem('scheduler_resources'));

    console.log("SREC: ", schedulerResources);

});

var schedulerResources = JSON.parse(localStorage.getItem('scheduler_resources'));

//var schedulerResources = {};

console.log("SCRES: ", schedulerResources);

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

console.log("DATE: ", date);

$("#scheduler").kendoScheduler({
    date: date,
    //startTime: new Date("2020/12/21 06:00 AM"),
    eventHeight: 100,
    columnWidth: 60,
    majorTick: 60,
    views: [
        "timeline",
        "timelineWeek",
        "timelineWorkWeek",
        {
            type: "timelineMonth",
            selected: true,
            //STARTTIME SET IN EDIT
            majorTick: 1440,
            dateHeaderTemplate: "<span class='k-link k-nav-day'>#=kendo.toString(date, 'ddd dd/M')#</span>",
        }
    ],
    //footer: false,
    messages: {
        event: "Request",
        editor: {
            editorTitle: "Schedule Booking"
        },
        deleteWindowTitle: "Delete Booking"
    },
    editable: {
        template: $("#customEditorTemplate").html(),
        confirmation: "Are you sure you want to delete this Booking?",
    },
    save: function(e) {

        var error_count = 0;

        console.log("EVENT: ",e.event.tranId);

        var tran = e.event.tranId;

        if(tran < 1) {

            var event = e.event;
            var recurrenceRule = event.recurrenceRule;

            if (recurrenceRule.substr(0, 7) !== "DTSTART") {

                var DTSTART = "DTSTART=" + kendo.toString(event.start, "yyyyMMddTHHmmssZ");
                event.recurrenceRule = DTSTART + ";" + recurrenceRule;
            }

            console.log("RRX:", event.recurrenceRule);

        }

        var reqDesc = e.event.requestDesc;

        if(reqDesc == '' || reqDesc == null ){

            console.log("REQ DESC ERRORS");

            error_count ++;
            $("#req_desc_errors").css({"display" : "block", "color" : "red", "font-weight" : "bold"});
            $("#req_desc_errors").html("A Request must be selected.");

        } else {
            $("#req_desc_errors").css({"display" : "none"});
            $("#req_desc_errors").html("");
        }

        console.log("ERRORS: " + error_count);

        if(error_count > 0) {
            e.preventDefault();
        }

    },
    edit: function(e) {

        var tran = e.event.tranId;

        if(tran < 1) {
            $("#recurrence_panel").css({"display" : "block"});
        } else {
            $("#recurrence_panel").css({"display" : "none"});
        }

        if(e.event.isNew && tran < 1){

            console.log("SET END");

            var startdate = e.event.start;
            console.log("START: ", startdate);
            startdate.setHours(6);
            e.event.set("start", startdate);

            var startDay = startdate.getDate();
            var startMonth = startdate.getMonth();

            startMonth = parseInt(startMonth) + 1;

            if(startMonth < 10){
                var startMonthStr = "0" + startMonth;
            }

            var startHours = startdate.getHours();
            if(startHours < 10){
                var startHoursStr = "0" + startHours;
            }

            var startYear = startdate.getFullYear();

            var startDateTime = startDay + "/" + startMonthStr + "/" + startYear + ' ' + startHoursStr + ":00";

            console.log("START DATETIME: ", startDateTime);

            $("#dateTimePickerStart").val(startDateTime);

            ///

            var startdate = e.event.start;
            console.log("START: ", startdate);
            startdate.setHours(6);
            e.event.set("start", startdate);

            var startDay = startdate.getDate();
            var startMonth = startdate.getMonth();

            startMonth = parseInt(startMonth) + 1;

            if(startMonth < 10){
                var startMonthStr = "0" + startMonth;
            }

            var endHoursStr = "18";

            var startYear = startdate.getFullYear();

            var endDateTime = startDay + "/" + startMonthStr + "/" + startYear + ' ' + endHoursStr + ":00";

            console.log("END DATETIME: ", endDateTime);

            $("#dateTimePickerEnd").val(endDateTime);

             var enddate = e.event.end;
             enddate.setHours(18);
             enddate.setDate(startDay);
             e.event.set("end", enddate);
        }

    },
    //timezone: "Etc/UTC",
    dataBinding: function (e) {
        var view = this.view();
        if (view.title == 'Timeline Month') {
            //var view = 'timelineMonth',
            console.log("VIEW:", view.title);
            //view.times.hide();
            view.timesHeader.hide();
            $(".k-scheduler-header-wrap > table > tbody > tr:eq(1)").hide();
        }
    },
    eventTemplate: $("#booking-template").html(),
    dataSource: {
        batch: true,
        sync: function () {
            this.read();
        },
        transport: {
            read: {
                url: "http://tt.local/bookings",
                dataType: "json"
            },
            update: {
                url: "http://tt.local/booking/update",
                dataType: "json",
                contentType: "application/json",
                type: "POST"
            },
            create: {
                url: "http://tt.local/booking/add",
                dataType: "json",
                contentType: "application/json",
                type: "POST"
            },
            destroy: {
                url: "http://tt.local/booking/delete",
                dataType: "json",
                contentType: "application/json",
                type: "POST"
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    //return { models: kendo.stringify(options.models) };
                    return kendo.stringify(options);
                }
            }
        },
        schema: {
            model: {
                id: "tranId",
                fields: {
                    tranId: {from: "TranId", type: "number"},
                    bookingId: {from: "BookingId", type: "number"},
                    batchId: {from: "BatchId", type: "number"},
                    shiftId: {from: "ShiftId", type: "number"},
                    requestDesc: {from: "RequestDesc", type: "text", validation: {required: true}},
                    requestId: {from: "RequestId", type: "number", validation: {required: true}},
                    title: {from: "Title", defaultValue: "No title", validation: {required: true}},
                    start: {type: "date", from: "Start"},
                    startDay: {from: "StartDay"},
                    end: {type: "date", from: "End"},
                    endDay: {from: "EndDay"},
                    startTimezone: {from: "StartTimezone"},
                    endTimezone: {from: "EndTimezone"},
                    description: {from: "Description"},
                    recurrenceId: {from: "RecurrenceID"},
                    recurrenceRule: {from: "RecurrenceRule"},
                    recurrenceException: {from: "RecurrenceException"},
                    userId: { from: "UserId"},
                    isAllDay: { type: "boolean", from: "IsAllDay" },
                    bookingStatus: { from: "BookingStatus"}
                }
            }
        }
    },
    group: {
        resources: ["UserId"],
        orientation: "vertical"
    },
    resources: [
        schedulerResources
    ]
});

