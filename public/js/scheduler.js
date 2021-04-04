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

$("#sidebar-right").on('click', '#check-availability-old', function (e) {

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

        viewCriteria();
    
    } else if (action == 'templates') {

        viewTemplates();
    
    } else if (action == 'delete') {
        
        deleteShifts();

    } else {

        var sbCont = "<div>Other</div>";
        $("#sidebar-right").append(sbCont);
    }

}

$("#sidebar-right").on('click', '[id^=next_swing-]', function (e) {

    e.preventDefault(); 
    
    var thisId = $(this).prop('id');
    var tempId = thisId.split('-').pop();

    var nextId = parseInt(tempId) + 1;

    nextSwing(tempId, nextId);

});

$("#sidebar-right").on('click', '[id^=remove_swing-]', function (e) {

    e.preventDefault();
    
    //var nextTempVal = $("[id^=next_swing-]").prop("id");;    
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

function nextSwing(tempId, nextId) {

    var followingId = parseInt(nextId) + 1;

    //console.log("TEMPID: ", tempId);
    //console.log("NEXTID: ", nextId);
    //console.log("FOLLID: ", followingId);

    var thisRequestId = $("#swing_request-1").val(); 
    var thisRequestRef = $("#swing_reference-1").val(); 
    var thisSwingEmps = $("#swing_emps-1").val();

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

    if($checkErrors > 0){
        
        document.getElementById("add-swing-error-modal").style.display = "block";
        $("#swing-error-display").html($checkErrorsMsg);
    
    } else {
    
        var nextTemplate = '<div>';

        var nextTemplate = '<input type="hidden" id="swing_request-' + nextId + '" name="swing_request-' + nextId + '" value="' + thisRequestId + '">';
        nextTemplate += '<input type="hidden" id="swing_reference-' + nextId + '" name="swing_reference-' + nextId + '" value="' + thisRequestRef + '">';
        nextTemplate += '<input type="hidden" id="swing_emps-' + nextId + '" name="swing_emps-' + nextId + '" value="' + thisSwingEmps + '">';

        nextTemplate += '<div id="swing-' + nextId + '" style="margin-top:20px;padding:0 10px 10px 10px;border:1px solid #CCC;box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19);">';
        
        nextTemplate += '<h3>Swing ' + nextId + ':</h3>';
        
        nextTemplate += '<div class="w3-row">';

        nextTemplate += '<div class="w3-half" style="padding:0 10px 10px 0;">';
        nextTemplate += '<label>Swing Type<span class="required-label">*</span></label>';
        nextTemplate += '<select name="swing_type-' + nextId + '" id="swing_type-' + nextId + '" class="w3-select w3-border input-display">';
        nextTemplate += '<option value="NA">Select an Swing Type</option>';
        nextTemplate += '<option value="On">On</option>';
        nextTemplate += '<option value="Off">Off</option>';
        nextTemplate += '</select>';
        nextTemplate += '<div id="swing_type-' + nextId + '_error" class="noerror" ></div>';
        nextTemplate += '</div>';

        nextTemplate += '<div class="w3-half" style="padding:0 10px 10px 0;">';
        nextTemplate += '<label>Start Day<span class="required-label">*</span></label>';
        nextTemplate += '<input name="swing_start_date-' + nextId + '" id="swing_start_date-' + nextId + '" class="w3-input w3-border datepicker input-display" type="text" readonly="readonly">';
        nextTemplate += '<div id="swing_start_date-' + nextId + '_error" class="noerror" ></div>';
        nextTemplate += '</div>';

        nextTemplate += '</div>';

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

    }
}

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
    
    //MY LOAD
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
                                
                            empName = employees[e]['first_name'] + ' ' + employees[e]['last_name'];            
                            swingEmployees += '<option value="' + empId + '" ' + selected + '>' + empName + '</option>';
                        }
                
                        $("#swing_emps-1").html("");
                        $("#swing_emps-1").append(swingEmployees);
                
                        $("#swing_emps-1").multiSelect({
                            afterSelect: function(values){
                
                                console.log("AFTER SELECT X");
                                
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

$("#sidebar-right").on('click', '#reload-swing-template', function (e) {

    var lastTemplateStored = localStorage.getItem('scheduler-template-last-stored');

    console.log("LAST SAVED: ");
    console.log(lastTemplateStored);

    if(lastTemplateStored != null) {
        
        var lastTemplateStoredArray = JSON.parse(lastTemplateStored);
        console.log(lastTemplateStoredArray);
        var setTemplateEmployees = lastTemplateStoredArray[0]['swing_emps'];

        currEmpsArray = setTemplateEmployees;

        console.log(currEmpsArray);

        localStorage.setItem('scheduler-templates-employees',JSON.stringify(currEmpsArray));

        //}

        //var setTemplateEmployees = lastTemplateStored[0]['swing-emps'];

        //if(setTemplateEmployees == null){
            //var currEmpsArray = JSON.parse(setTemplateEmployees);
        //} else {
            //currEmpsArray = [];
        //}

        //var lastTemplateStored = localStorage.getItem('scheduler-template-last-stored');

        //if(lastTemplateStored != null) {
        
        //var lastTemplateStoredArray = JSON.parse(lastTemplateStored);
        //console.log(lastTemplateStoredArray);

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
                    $("#day_shift-" + nextId).prop("checked", true);
                    $("#night_shift-" + + nextId).prop("checked", false);
                } else {
                    $("#day_shift").prop("checked", false);
                    $("#night_shift").prop("checked", true);
                }
                var swingRecurrence = lastTemplateStoredArray[s]['swing_recurrence']; 
                $("#swing_recurrence-" + nextId).val(swingRecurrence);
            }
        
        } 

    } else {
        alert("nothing to reload"); 
    }

});

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

$("#sidebar-right").on('click', '#reset-template-swings', function (e) {
    //alert("RESET TEMPLATES"); 
    setTemplates();
});

$("body").on('click', '#cancel-swing-delete', function (e) {
    document.getElementById("delete-swing-batch-modal").style.display = "none";
});    

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
                    console.log("MY TEMPLATE: ", templateArray);

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
                    console.log("MY TEMPLATE: ", templateArray);

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

$("#sidebar-right").on('click', '#save-swing-template', function (e) {

    //alert("SAVING");
    
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

        if($("#swing_recurrence-" + c).val().length < 1) {
            errCount++;
            errMsgArray.push({
                "id": "swing_recurrence-" + c,
                "msg": 'A Recurring Number of days must be provided'
            });
        }
    }
    
    if(errCount > 0){

        //console.log("ERRORS: ", errMsgArray);

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
            url: 'scheduler/template',
            type: "POST",
            data: {
                "form": requestForm
            },
            success: function (response) {
                //console.log(response);
                var status = response.status;
                var templateArray = response.template_array;
                console.log("MY TEMPLATE: ", templateArray);

                localStorage.setItem('scheduler-template-last-stored',templateArray);

                var resetEmps = [];
                localStorage.setItem('scheduler-templates-employees', JSON.stringify(resetEmps));

                window.location.assign('/scheduler');
            }
        });
    }
});    

$("#sidebar-right").on('change', '#swing_request-1', function (e) {
    
    e.preventDefault();

    var thisId = $(this).prop('id');
    var tempId = thisId.split('-').pop();
    var reqId = $(this).val();

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
            }
        });
    } else {
        $("#swing_reference-" + tempId).val("");
    }
});

function setTemplates(swingTemplates){

    $("#sidebar-right").html("");

    var tempId = 1;
    
    //INITIALISE LOCAL STORAGE OF EMPS

    var setTemplateEmployees = localStorage.getItem('scheduler-templates-employees');

    //if(setTemplateEmployees != null){
        //var currEmpsArray = JSON.parse(setTemplateEmployees);
    //} else {
        currEmpsArray = [];
    //}

    console.log("SET TEMP EMPS: ", currEmpsArray);
    
    localStorage.setItem('scheduler-templates-employees',JSON.stringify(currEmpsArray));

    var swingTemplates = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    swingTemplates += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Swing Templates</div>';
    swingTemplates += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    swingTemplates += '</div>';

    swingTemplates += '<div id="outer-templates-container" style="margin:0 15px 0 15px;border:0px solid red;">';

    swingTemplates += '<div class="w3-center" style="margin-top:15px;">';
    swingTemplates += '<button id="reload-swing-template" class="w3-button w3-padding-medium w3-darkblue w3-margin-bottom" style="margin-top:10px;">Reload Last Used Swing Details</button>';
    swingTemplates += '<button id="load-swing-template" class="w3-button w3-padding-medium w3-darkblue w3-margin-bottom" style="margin:10px 0 0 10px;">Load a Swing Template</button>';

    swingTemplates += '</div>';

    swingTemplates += '<div style="margin-top:5px;margin-bottom:10px;font-size:12px;">Required Field<span class="required-label">*</span></div>';
    
    swingTemplates += '<form name="scheduler-template-form" id="scheduler-template-form">';

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
    swingTemplates += '<div id="swing_emps_error-' + tempId +'" class="noerror" ></div>';
    swingTemplates += '</div>';//DISPLAY
    swingTemplates += '</div>';//ROW

    swingTemplates += '<div id="swing-templates-container" style="border:0px solid brown">';
    
    swingTemplates += '<div id="swing-' + tempId + '" style="margin-top:10px;padding:0 10px 10px 10px;border:1px solid #CCC; box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19);">';
    
    swingTemplates += '<h3>Swing ' + tempId + ':</h3>';
    
    swingTemplates += '<div class="w3-row">';

    swingTemplates += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    swingTemplates += '<label>Swing Type<span class="required-label">*</span></label>';
    swingTemplates += '<select name="swing_type-' + tempId + '" id="swing_type-' + tempId + '" class="w3-select w3-border input-display">';
    swingTemplates += '<option value="NA">Select an Swing Type</option>';
    swingTemplates += '<option value="On">On</option>';
    swingTemplates += '<option value="Off">Off</option>';
    swingTemplates += '</select>';
    swingTemplates += '<div id="swing_type-' + tempId + '_error" class="noerror" ></div>';
    swingTemplates += '</div>';

    swingTemplates += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    swingTemplates += '<label>Start Day<span class="required-label">*</span></label>';
    swingTemplates += '<input name="swing_start_date-' + tempId + '" id="swing_start_date-' + tempId + '" class="w3-input w3-border datepicker input-display" type="text" readonly="readonly">';
    swingTemplates += '<div id="swing_start_date-' + tempId + '_error" class="noerror" ></div>';
    swingTemplates += '</div>';

    swingTemplates += '</div>';

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
    swingTemplates += '<button id="save-swing-template" class="w3-button w3-padding-medium w3-darkblue w3-margin-bottom" style="margin:0 0 0 10px;">Create Shifts</button>';

    swingTemplates += '</div>';

    swingTemplates += '</div>';

    swingTemplates += '</div>';//CONTAINER

    $("#sidebar-right").html("");

    $("#sidebar-right").append(swingTemplates);

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
            reqId = requests[r]['ws_id'];            
            swingRequests += '<option value="' + reqId + '">' + reqId + '</option>';
        }

        $("#swing_request-" + tempId).html("");
        $("#swing_request-" + tempId).append(swingRequests);
    });

    $.ajax({
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

        $("#swing_emps-1").multiSelect({
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
        });
    });
}

function viewTemplates() {

    setTemplates();

}

//SWING TEMPLATES

/* $("body").on('click','#scheduler-swing-templates', function (e) {

    e.preventDefault();

    displaySchedulerAvailability();

}); */

$("body").on('click','#scheduler-swing-templates', function (e) {

    e.preventDefault();

    var thisId = $(this).prop('id');

    console.log("TID", thisId);

    var sidebarContent = thisId.split('-').pop();

    console.log("SBCTEMP", sidebarContent);

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

//AVAILABILITY

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

function displaySchedulerAvailability(){

    //SET LOCAL
    localStorage.setItem('display-scheduler-availability', 'Y');
    var availDisplay = localStorage.getItem('display-scheduler-availability');

    console.log("AVAIL DISPLAY: ", availDisplay);

    var scheduler = $("#scheduler").data("kendoScheduler");
    var view = scheduler.view();
    var elements = view.content.find("td");

    for (var i = 0; i < elements.length; i++) {
        var slot = scheduler.slotByElement($(elements[i]));

        //console.log("SLOT", slot);

        var ocurrences = scheduler.occurrencesInRange(slot.startDate, slot.endDate);

        //console.log("OCC: ", i);
        //console.log("OCC: ", ocurrences);

        var resources = scheduler.resourcesBySlot(slot);

        //console.log("RES: ", resources);

        //var myUser = 2;

        var myUsers = [1,2,4];

        var thisUser = resources.userId[0];

        //if(inArray(thisUser, myUsers)){

            if (ocurrences.length < 1) {

                //$(slot.element).css({background: "red"});
                $(slot.element).addClass("available");

            } else {

                //console.log("OBJECT: ", ocurrences[0].userId[0]);
                //console.log("RES USER: ", resources.userId[0]);

                var filtered = ocurrences.filter(function(elem){
                    return (elem.userId[0] == thisUser)
                });

                console.log(filtered);

                if(filtered[0]) {
                    var checkUser = filtered[0].userId[0];
                } else {
                    var checkUser = ocurrences[0].userId[0];
                }
                var resUser = resources.userId[0];

                if (checkUser != resUser) {

                    //$(slot.element).css({background: "red"}); //apply CSS styles
                    $(slot.element).addClass("available");

                }
            }

        //}
    }

}

function removeSchedulerAvailability(){

    //SET LOCAL
    localStorage.setItem('display-scheduler-availability', 'N');
    var availDisplay = localStorage.getItem('display-scheduler-availability');

    console.log("AVAIL DISPLAY: ", availDisplay);

    var scheduler = $("#scheduler").data("kendoScheduler");
    var view = scheduler.view();
    var elements = view.content.find("td");

    for (var i = 0; i < elements.length; i++) {
        var slot = scheduler.slotByElement($(elements[i]));
        //$(slot.element).css({background: "#FFFFFF"}); //apply CSS styles
        $(slot.element).removeClass("available");
    }

}

$("body").on('click','#remove-scheduler-availability', function (e) {

    e.preventDefault();

    $("#filter-scheduler-availability").css({"display" : "block"});
    $("#remove-scheduler-availability").css({"display" : "none"});

    removeSchedulerAvailability();
});


$("body").on('click','#filter-scheduler-availability', function (e) {

    e.preventDefault();

    $("#filter-scheduler-availability").css({"display" : "none"});
    $("#remove-scheduler-availability").css({"display" : "block"});

    displaySchedulerAvailability();
});

$("body").on('click','#filter-scheduler-criteria', function (e) {

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

$("#sidebar-right").on('click', '#cancel-delete-shifts', function (e) {

    e.preventDefault();

    $("#sidebar-right").css({"width": "0px"});
    localStorage.removeItem('right-sidebar-content');
});

function bookingsDeletion(deleteActionType){

    console.log("DEL ACTION: ", deleteActionType);
    
    if(deleteActionType == 'request'){
        var deletionForm = $("#delete-form-req").serialize();
    } else if(deleteActionType == 'batch'){
        var deletionForm = $("#delete-form-batch").serialize();
    } else if(deleteActionType == 'shift'){
        var deletionForm = $("#delete-form-shift").serialize();
    }
    
    console.log("DEL FORM: ", deletionForm);

    $.ajax({
        url: '/bookings/delete',
        type: "POST",
        data: {
            "delete_type": deleteActionType, 
            "form": deletionForm
        },
        success: function (response) {
            console.log(response);
            window.location.assign('/scheduler');
        }
    });
}

$("body").on('click', '[id^=continue-delete-]', function (e) {
    
    var thisId = $(this).prop('id');

    console.log("TDID", thisId);

    var deleteType = thisId.split('-').pop();

    console.log("DEL TYPE: ", deleteType);

    if(deleteType == 'req'){
        var deleteTypeId = $("#delete_req_id").val();
        var deleteTypeDesc = 'Request ID#';
        //var url = '/bookings/request/' + deleteTypeId;
        //var continueBtn = 'continue-delete-request';
    } else if(deleteType == 'batch'){
        var deleteTypeId = $("#delete_batch_id").val();
        var deleteTypeDesc = 'Batch ID#';
        //var url = '/bookings/batch/' + deleteTypeId;
        //var continueBtn = 'continue-delete-batch';
    } else if(deleteType == 'shift'){
        var deleteTypeId = $("#delete_shift_id").val();
        var deleteTypeDesc = 'Shift ID#';
        //var url = '/bookings/shift/' + deleteTypeId;
        //var continueBtn = 'continue-delete-shift';
    }
    
    var r = confirm("Are you sure you want to delete Shifts connected to " + deleteTypeDesc + ":" + deleteTypeId + "?");
    if (r == true) {
    
        //var thisId = $(this).prop('id');
        var deleteActionType = thisId.split('-').pop();
        console.log("DAT: ", deleteType);

        bookingsDeletion(deleteType);
    }
});

$("#sidebar-right").on('click', '[id^=delete-shifts-action-]', function (e) {

    e.preventDefault();

    var thisId = $(this).prop('id');

    console.log("TDID", thisId);

    var deleteType = thisId.split('-').pop();

    console.log("DEL TYPE: ", deleteType);

    if(deleteType == 'req'){
        var deleteTypeId = $("#delete_req_id").val();
        var deleteTypeDesc = 'Request ID#';
        var url = '/bookings/request/' + deleteTypeId;
        var continueBtn = 'continue-delete-request';
    } else if(deleteType == 'batch'){
        var deleteTypeId = $("#delete_batch_id").val();
        var deleteTypeDesc = 'Batch ID#';
        var url = '/bookings/batch/' + deleteTypeId;
        var continueBtn = 'continue-delete-batch';
    } else if(deleteType == 'shift'){
        var deleteTypeId = $("#delete_shift_id").val();
        var deleteTypeDesc = 'Shift ID#';
        var url = '/bookings/shift/' + deleteTypeId;
        var continueBtn = 'continue-delete-shift';
    }

    if(deleteTypeId.length < 1){
        alert("No " + deleteTypeDesc + " was selected for deletion.")
    } else {

        $.ajax({
            url: url,
            async: false,
            type: "GET",
            success: function (response) {
                console.log("DELETE TYPE: ", response);

                if(response.length > 0){
                
                    if(deleteType == 'req'){
                        var deleteDetails = JSON.stringify(response);    

                    } else {
                        var deleteDetails = response;
                    }

                    $('[id^=continue-delete-]').css({"display" : "none"});
        
                    if(deleteTypeId.length > 0){
                        $("#" + continueBtn).css({"display" : "inline-block"});
                    }

                } else {
                    var deleteDetails = '<p class="error">Nothing to Delete</p>';
                }

                $("#batch-deletion-details").html(deleteDetails);

                
            }
        });

        document.getElementById("delete-swing-batch-modal").style.display = "block";
        
        
        
    }

});

$("#sidebar-right").on('click', '#delete_type_req', function (e) {

    $("#delete-required-fields").css({"display" : "block"});
    $("#delete-form-req").css({"display" : "block"});
    $("#delete-form-batch").css({"display" : "none"});
    $("#delete-form-shift").css({"display" : "none"});
    $("#delete-form-emp").css({"display" : "none"});
   
    $("#delete-shifts-action-req").css({"display" : "inline-block"});
    $("#delete-shifts-action-batch").css({"display" : "none"});
    $("#delete-shifts-action-shift").css({"display" : "none"});
    $("#delete-shifts-action-emp").css({"display" : "none"});
});

$("#sidebar-right").on('click', '#delete_type_batch', function (e) {
    
    $("#delete-required-fields").css({"display" : "block"});
    $("#delete-form-req").css({"display" : "none"});
    $("#delete-form-batch").css({"display" : "block"});
    $("#delete-form-shift").css({"display" : "none"});
    $("#delete-form-emp").css({"display" : "none"});

    $("#delete-shifts-action-req").css({"display" : "none"});
    $("#delete-shifts-action-batch").css({"display" : "inline-block"});
    $("#delete-shifts-action-shift").css({"display" : "none"});
    $("#delete-shifts-action-emp").css({"display" : "none"});
});

$("#sidebar-right").on('click', '#delete_type_shift', function (e) {
    
    $("#delete-required-fields").css({"display" : "block"});
    $("#delete-form-req").css({"display" : "none"});
    $("#delete-form-batch").css({"display" : "none"});
    $("#delete-form-shift").css({"display" : "block"});
    $("#delete-form-emp").css({"display" : "none"});

    $("#delete-shifts-action-req").css({"display" : "none"});
    $("#delete-shifts-action-batch").css({"display" : "none"});
    $("#delete-shifts-action-shift").css({"display" : "inline-block"});
    $("#delete-shifts-action-emp").css({"display" : "none"});
});

function deleteShifts(){
    
    //DELETE SHIFTS
    
    $("#sidebar-right").html("");

    var deleteShiftsForm = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    deleteShiftsForm += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Delete Shifts</div>';
    deleteShiftsForm += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    deleteShiftsForm += '</div>';

    deleteShiftsForm += '<div class="w3-container" style="margin:0 0 15px 0;border:0px solid green;">';
    deleteShiftsForm += '<h5>Delete By:</h5>';

    deleteShiftsForm += '<div class="w3-row">';

    deleteShiftsForm += '<input id="delete_type_req" name="delete_type" class="w3-radio input-display" type="radio" value="req">';
    deleteShiftsForm += '<label style="margin-left:5px;font-weight:normal;">Request</label>';
    deleteShiftsForm += '<input id="delete_type_batch" name="delete_type" class="w3-radio" type="radio" value="batch" style="margin-left:10px;">';
    deleteShiftsForm += '<label style="margin-left:5px;font-weight:normal;">Batch</label>';
    deleteShiftsForm += '<input id="delete_type_shift" name="delete_type" class="w3-radio" type="radio" value="shift" style="margin-left:10px;">';
    deleteShiftsForm += '<label style="margin-left:5px;font-weight:normal;">Shift</label>';
    deleteShiftsForm += '<input id="delete_type_emp" name="delete_type" class="w3-radio" type="radio" value="emp" style="margin-left:10px;">';
    deleteShiftsForm += '<label style="margin-left:5px;font-weight:normal;">Employee</label>';

    deleteShiftsForm += '</div>'; //ROW
    deleteShiftsForm += '</div>';//CONTAINER

    deleteShiftsForm += '<div id="delete-required-fields"  class="w3-container" style="display:none;margin-top:0px;border:0px solid red;">';
    deleteShiftsForm += '<div style="margin-top:5px;margin-bottom:15px;font-size:12px;">Required Field<span class="required-label">*</span></div>';
    
    deleteShiftsForm += '<form id="delete-form-req" style="display:none">';
    deleteShiftsForm += '<div class="w3-row">';
    deleteShiftsForm += '<div class="w3-half" style="padding:5px 10px 10px 0;">';
    deleteShiftsForm += '<label style="font-weight:bold;">Request ID#<span class="required-label">*</span></label>';
    deleteShiftsForm += '<input name="delete_req_id" id="delete_req_id" class="w3-input w3-border input-display" type="text">';
    deleteShiftsForm += '</div>';
    deleteShiftsForm += '</div>';
    deleteShiftsForm += '</form>';

    deleteShiftsForm += '<form id="delete-form-batch" style="display:none">';
    deleteShiftsForm += '<div class="w3-row">';
    deleteShiftsForm += '<div class="w3-half" style="padding:5px 10px 10px 0;">';
    deleteShiftsForm += '<label style="font-weight:bold;">Batch ID#<span class="required-label">*</span></label>';
    deleteShiftsForm += '<input name="delete_batch_id" id="delete_batch_id" class="w3-input w3-border input-display" type="text">';
    deleteShiftsForm += '</div>';
    deleteShiftsForm += '</div>';
    deleteShiftsForm += '</form>';

    deleteShiftsForm += '<form id="delete-form-shift" style="display:none">';
    deleteShiftsForm += '<div class="w3-row">';
    deleteShiftsForm += '<div class="w3-half" style="padding:5px 10px 10px 0;">';
    deleteShiftsForm += '<label style="font-weight:bold;">Shift ID#<span class="required-label">*</span></label>';
    deleteShiftsForm += '<input name="delete_shift_id" id="delete_shift_id" class="w3-input w3-border input-display" type="text">';
    deleteShiftsForm += '</div>';
    deleteShiftsForm += '</div>';
    deleteShiftsForm += '</form>';

    deleteShiftsForm += '<form id="delete-form-emp" style="display:none">';
    deleteShiftsForm += '<div class="w3-row">';
    deleteShiftsForm += '<div class="w3-half" style="padding:5px 10px 10px 0;">';
    deleteShiftsForm += '<label style="font-weight:bold;">Employee<span class="required-label">*</span></label>';
    deleteShiftsForm += '<input name="delete_emp_id" id="delete_emp_id" class="w3-input w3-border input-display" type="text">';
    deleteShiftsForm += '</div>';
    deleteShiftsForm += '</div>';
    deleteShiftsForm += '</form>';

    deleteShiftsForm += '<div class="w3-center" style="margin-top:10px;">';
    deleteShiftsForm += '<button id="cancel-delete-shifts" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    deleteShiftsForm += '<button id="delete-shifts-action-req" style="display:none;" class="w3-button w3-darkblue w3-mobile w3-medium">Delete Shifts</button>';
    deleteShiftsForm += '<button id="delete-shifts-action-batch" style="display:none;" class="w3-button w3-darkblue w3-mobile w3-medium">Delete Shifts</button>';
    deleteShiftsForm += '<button id="delete-shifts-action-shift" style="display:none;" class="w3-button w3-darkblue w3-mobile w3-medium">Delete Shifts</button>';
    deleteShiftsForm += '<button id="delete-shifts-action-emp" style="display:none;" class="w3-button w3-darkblue w3-mobile w3-medium">Delete Shifts</button>';
    deleteShiftsForm += '</div>';

    deleteShiftsForm += '</div>';//close container

    $("#sidebar-right").append(deleteShiftsForm);

}

$("body").on('click','#scheduler-delete_shifts', function (e) {

    e.preventDefault();

    var thisId = $(this).prop('id');

    //alert("DELETE SHIFTS");

    //alert("clicked");

    //editShifts(request, booking);
    ////
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

    ////
});

//$("#sidebar-right").on('click','#scheduler-edit-bookings', function (e) {

    /* var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var request = paramsArr[2];
    var booking = paramsArr[3]; */

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

    

//});

function viewCriteria() {

    var criteriaSelection = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    criteriaSelection += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Filter Scheduler</div>';
    criteriaSelection += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    criteriaSelection += '</div>';

    criteriaSelection += '<form id="scheduler-filter-form">';

    criteriaSelection += '<div style="margin:0 15px 0 15px;border:0px solid red;">';

    $("#sidebar-right").html("");

    var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    $("#sidebar-right").append(spinHtml);

    $.ajax({
        url: '/trades',
        async: false,
        type: "GET",
        success: function (response) {

            console.log("RESP: ", response);

            var trades = response;

            criteriaSelection += '<h4 style="margin:10px 0 5px 0;">By Trades:</h4>';

            var count = 1;

            for (var s = 0; s < trades.length; s++) {

                var tradeDesc = trades[s]['trade_desc'];
                var tradeCode = trades[s]['trade_code'];

                if(count == 1 ){
                    criteriaSelection += '<div class="w3-row filter-row">';
                }

                criteriaSelection += '<div class="w3-third" style="padding:0 10px 10px 0;">';
                criteriaSelection += '<input id="trade_' + tradeCode + '" name="trade_' + tradeCode + '" class="w3-check" type="checkbox" value="trade_' + tradeCode + '">';
                criteriaSelection += '<label style="margin-left:5px;font-weight:normal;">' + tradeDesc + '</label>';
                criteriaSelection += '</div>';

                if(count % 3 === 0){
                    criteriaSelection += '</div>';
                    criteriaSelection += '<div class="w3-row filter-row">';
                }

                count++;
            }

            criteriaSelection += '</div>';

        }

    });

    $.ajax({
        url: '/skills',
        async: false,
        type: "GET",
        success: function (response) {

            console.log("RESP: ", response);

            var skills = response;

            criteriaSelection += '<h4 style="margin:10px 0 5px 0;">By Qualifications:</h4>';

            var count = 1;

            for (var s = 0; s < skills.length; s++) {

                var skillDesc = skills[s]['skill_desc'];
                var skillCode = skills[s]['skill_code'];

                if(count == 1 ){
                    criteriaSelection += '<div class="w3-row filter-row">';
                }

                criteriaSelection += '<div class="w3-third" style="padding:0 10px 10px 0;">';
                criteriaSelection += '<input id="skill_' + skillCode + '" name="skill_' + skillCode + '" class="w3-check" type="checkbox" value="skill_' + skillCode + '">';
                criteriaSelection += '<label style="margin-left:5px;font-weight:normal;">' + skillDesc + '</label>';
                criteriaSelection += '</div>';

                if(count % 3 === 0){
                    criteriaSelection += '</div>';
                    criteriaSelection += '<div class="w3-row filter-row">';
                }

                count++;
            }

            criteriaSelection += '</div>';
            
        }

    });

    criteriaSelection += '<div class="w3-center" style="margin-top:15px;">';
    criteriaSelection += '<button id="update-scheduler-filter" class="w3-button w3-padding-large w3-darkblue w3-margin-bottom" style="margin-top:15px;">Filter</button>';
    criteriaSelection += '</div>';

    criteriaSelection += '</form>';

    $("#sidebar-right").html("");

    $("#sidebar-right").append(criteriaSelection);

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

    localStorage.setItem('scheduler-resources', JSON.stringify(resourcesArray[0]));

    window.location.assign('/scheduler');

}

function viewShifts(reqShifts) {

    document.getElementById("request-swing-details-modal").style.display = "block";

    //GET THE SWING DETAILS
    var modalSwings = "";
    
    modalSwings += '<div id="request-swings-modal-container" style="margin:10px 0 20px 0;">';
    modalSwings += '<table id="workspace-shifts-table" class="w3-striped w3-bordered w3-hoverable" style="table-layout:auto;width:100%;border-collapse:collapse;">';
    modalSwings += '<thead>';
    modalSwings += '<tr class="w3-darkblue">';
    modalSwings += '<th>Employee</th>';
    modalSwings += '<th>Trade Type</th>';
    modalSwings += '<th>Start</th>';
    modalSwings += '<th>Finish</th>';
    modalSwings += '<th>Day/Night</th>';
    modalSwings += '<th>On/Off</th>';
    modalSwings += '<th>Action</th>';
    modalSwings += '</thead>';
    modalSwings += '<tbody>';

    for (var r = 0; r < reqShifts.length; r++) {

        var shiftId = reqShifts[r]['shift'];
        var shiftEmp = reqShifts[r]['emp'];
        var shiftTrades = reqShifts[r]['trades'];
        var shiftStart = reqShifts[r]['start'];
        var shiftEnd = reqShifts[r]['end'];
        var shiftTime = reqShifts[r]['time'];
        var shiftType = reqShifts[r]['type'];

        modalSwings += '<tr>';
        modalSwings += '<td>' + shiftEmp + '</td>';
        modalSwings += '<td>' + shiftTrades + '</td>';
        modalSwings += '<td>' + shiftStart + '</td>';
        modalSwings += '<td>' + shiftEnd + '</td>';
        modalSwings += '<td>' + shiftTime + '</td>';
        modalSwings += '<td>' + shiftType + '</td>';
        modalSwings += '<td id="shift_row_'+ shiftId + '"><button class="w3-button w3-small w3-transparent w3-padding-small menu-button"><i class="fas fa-ellipsis-h"></i></button></td>';
        modalSwings += '</tr>';
    }

    modalSwings += '</tbody>';
    modalSwings += '</table>';
    modalSwings += '</div>';

    $("#request-swings-modal-display").html("");    
    $("#request-swings-modal-display").append(modalSwings);

}

$("body").on('click','[id^=shift_row_]', function (e) {

    e.preventDefault();
    var $clicker = $(this);
    var pos = $clicker.position();
    var dropdownTop = + pos.top;

    //alert("SHIFT MENU CLICKED");

    if(parseInt(dropdownTop) > 638){
        var posStyle = 'width:200px;bottom:100%;right:0px;';
    } else {
        var posStyle = 'width:200px;top:0;right:100%;';
    }

    var splitId = $(this).prop("id");
    var splitArray = splitId.split("_");
    var rowId = splitArray[2];

    $("[id^=shift_row_]").html('<button class="w3-button w3-small w3-transparent w3-padding-small menu-button w3-hover"><i class="fas fa-ellipsis-h"></i>');
    $(".menu-button").html('<i class="fas fa-ellipsis-h"></i>');

    var shiftActionButton = '<div class="w3-dropdown-hover">';
    shiftActionButton += '<button class="w3-button w3-small w3-padding-small w3-hover"><i class="fas fa-ellipsis-h"></i></button>';
    shiftActionButton += '<div class="w3-dropdown-content w3-bar-block w3-border" style="' + posStyle +';">';
    shiftActionButton += '<a id="workspace-shift-action-edit_' + rowId + '" href="#" class="w3-bar-item w3-button">Edit</a>';
    shiftActionButton += '<a id="workspace-shift-action-schedule_' + rowId + '" href="#" class="w3-bar-item w3-button">Schedule</a>';    
    shiftActionButton += '</div>';

    $("#shift_row_" + rowId).html(shiftActionButton);

});

$("body").on('click','#update-current-swing', function (e) {

    e.preventDefault();

    //alert("UPDATE CURRENT SWING");

    var param = 1;

    $.ajax({
        url: '/shifts/request/' + param,
        type: "GET"
    }).done(function (response) {

        console.log("SHIFT DETAILS: ", response);
        var shifts = response;
        viewShifts(shifts);
        
    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    });

});

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

    var schedulerResources = JSON.parse(localStorage.getItem('scheduler-resources'));

    console.log("SREC: ", schedulerResources);

});

function checkforConflict(bookingId, userId, start, end){

    var conflicts;

    $.ajax({
        url: '/bookings/conflict',
        async: false,
        type: "GET",
        data: {
            "booking_id": bookingId,
            "user_id": userId,
            "start": start,
            "end": end
        },
        success: function (response) {

            conflicts = response;

            //if(response.ws_quote_pdfs.length > 0) {
            //rioPdfs = JSON.parse(rioPdfs);
            //}

            //console.log(conflicts);
        }
    });

    return conflicts;

}

function firstOfNextMonth(startDate) {
    var d = startDate;
    d.setMonth(d.getMonth()+1, 1);
    return d;
}

function firstOfPrevMonth(startDate) {
    var d = startDate;
    d.setMonth(d.getMonth()-1, 1);
    return d;
}

function schedulerNavigate(e){

    //console.log(e.action);

    var action = e.action;
    var view = e.sender.view();

    if(action == 'next') {
        var nextDate = firstOfNextMonth(view.startDate());
        //console.log("NEXT DATE: ", nextDate);
        localStorage.setItem('scheduler-date', nextDate);
    } else if(action == 'previous') {
        var prevDate = firstOfPrevMonth(view.startDate());
        //console.log("PREV DATE: ", prevDate);
        localStorage.setItem('scheduler-date', prevDate);
    }

    //var scheduler = $("#scheduler").data("kendoScheduler");
    //scheduler.refresh();

    var availDisplay = localStorage.getItem('display-scheduler-availability');

    if(availDisplay == 'Y') {
        setTimeout(function () {
            displaySchedulerAvailability();
        }, 1);
    }
}

var schedulerResources = JSON.parse(localStorage.getItem('scheduler-resources'));

//var schedulerResources = {};

console.log("SCRES: ", schedulerResources);
console.log("LSDATE: ", localStorage.getItem('scheduler-date'));

var schedulerDate = localStorage.getItem('scheduler-date');

//SET THE CURRENT VIEW

//FORM HERE
var currentSchedulerView = localStorage.getItem('current-scheduler-view');

if(currentSchedulerView == 'Custom'){
    var customView = true; 
    var monthView = false;
    
    var customDays = localStorage.getItem('custom-scheduler-days');
    if(customDays != null){
        $("#custom-scheduler-days").val(customDays);
    }
    
    var customStart = localStorage.getItem('custom-scheduler-start');
    if(customStart != null){
        var customStartDateArray = customStart.split("-");
        var customStartDate = customStartDateArray[2] + "-" + customStartDateArray[1]+ "-" + customStartDateArray[0];
        $("#custom-scheduler-start").val(customStartDate);
    }

    if($("#custom-scheduler-days").val().length > 0 && $("#custom-scheduler-start").val().length){
        var rebuildView = true;
    }

} else {
    var customView = false; 
    var monthView = true; 
}

console.log("CURRENT SCHEDULER VIEW: ", currentSchedulerView);

console.log("USE CUSTOM DATE: ", useCustomDate);

var useCustomDate = false;

$("#set-custom-scheduler-days").on( "click", function() {

    var errorCount = 0;
    var errorMsg = '';
    
    if($("#custom-scheduler-days").val().length < 1){
        errorCount++;
        errorMsg += 'NO DAYS';
    }

    if($("#custom-scheduler-start").val().length < 1){
        errorCount++;
        errorMsg += 'NO START';
    }
    
    console.log("ERROR COUNT: ", errorCount);
    
    if(errorCount < 1){
    
        //alert("TRIGGERED");

        useCustomDate = true;
        localStorage.setItem('custom-scheduler-use',useCustomDate);
        
        var customDays = $("#custom-scheduler-days").val();
        localStorage.setItem('custom-scheduler-days',customDays);
        var startDateRaw = $("#custom-scheduler-start").val();
        var startDateArray = startDateRaw.split("-");
        var startDate = startDateArray[2]+ "-" + startDateArray[1]+ "-" + startDateArray[0];
        var date = startDate;

        localStorage.setItem('custom-scheduler-start',date);

        console.log("CUSTOM START DATE: ", date);
    
        var scheduler = $("#scheduler").data("kendoScheduler");

        scheduler.date(new Date(date));

        scheduler.setOptions({
        numberOfDays: parseInt(customDays)
        });
        // Reload the view.
        scheduler.view(scheduler.view().name);

    } else {
        alert(errorMsg);
    }
});

console.log("THE START DATE: ", date);

if(!useCustomDate){

    if(schedulerDate){
        console.log("DATE SET");
        //var today = localStorage.getItem('scheduler-date');
        var today = new Date(localStorage.getItem('scheduler-date'));
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    } else {
        console.log("XXXDATE NOT SET");
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    }
} else {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
}

console.log("--DATE: ", date);

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

var thisHost = getCookie('host');
var defUrl = getCookie('defUrl');

console.log("DEFURL", defUrl);

var useCustomDate = false;

//var MyCustomTimelistView = kendo.ui.TimelineMonthView.extend({
var Custom = kendo.ui.TimelineMonthView.extend({
    options: {
      name: "Timeline Custom",
      title: "Timeline Custom",
      selectedDateFormat: "{0:D} - {1:D}",
      selectedShortDateFormat: "{0:d} - {1:d}",
      majorTick: 1440,
      numberOfDays: 30
    },
    //name: "MyCustomTimelistView",
    name: "Timeline Custom",
    calculateDateRange: function() {
      // Create the required number of days.
      var start = this.options.date,
        // start = kendo.date.dayOfWeek(selectedDate, this.calendarInfo().firstDay, -1),
        idx, length,
        dates = [];

      for (idx = 0, length = this.options.numberOfDays; idx < length; idx++) {
        dates.push(start);
        start = kendo.date.nextDay(start);
      }

      this._render(dates);
    },
    previousDate: function() {
      var date = new Date(this.startDate());
      date.setDate(date.getDate() - this.options.numberOfDays);

      return date
    }
  });
  
$("#scheduler").kendoScheduler({
    //date: date,
    //startTime: new Date("2020/12/21 06:00 AM"),
    eventHeight: 100,
    columnWidth: 60,
    majorTick: 60,
    views: [
        "timeline",
        "timelineWeek",
        //"timelineWorkWeek",
        {
            type: "Custom",
            title: "Custom",
            //type: "Timeline Custom",
            selected: customView,
            majorTick: 1440,
            dateHeaderTemplate: "<span class='k-link k-nav-day'>#=kendo.toString(date, 'ddd dd/M')#</span>",
        },            
        {
            type: "timelineMonth",
            selected: monthView,
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

        //console.log(e.event);

        var bookingId = e.event.bookingId;
        var userId = e.event.userId[0];
        var start  = kendo.toString(e.event.start, "yyyyMMddTHHmmssZ");
        var end  = kendo.toString(e.event.end, "yyyyMMddTHHmmssZ");

        console.log("BKG: ", bookingId);
        console.log("USER: ", userId);
        console.log("START: ", start);
        console.log("END: ", end);

        var conflicts = checkforConflict(
            bookingId,
            userId,
            start,
            end
        );
        
        console.log("CONFLICTS: ",conflicts);

        if(conflicts.length > 0){
            error_count++;
            document.getElementById("scheduler-error").style.display = "block";
        }

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
    navigate: function(e) {
    // $(".console").append("<p><strong>Navigated from:</strong></p>");
        schedulerNavigate(e);
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

            var startdate = e.event.start;
            console.log("START: ", startdate);
            startdate.setHours(6);

            console.log("SET START DATE: ",startdate);

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

            console.log("SET END DATE: ",enddate);


            e.event.set("end", enddate);
        }

    },
    //timezone: "Etc/UTC",
    dataBinding: function (e) {
        var view = this.view();

        console.log("THIS VIEW: ", view.title);
        
        //Timeline Custom

        if (view.title == 'Custom') {
            
            localStorage.setItem('current-scheduler-view',view.title);
            
            document.getElementById("custom-view-dates").style.display = "block";
            
            console.log("VIEWING HERE");
            //var view = 'timelineMonth', 
            console.log("VIEW:", view.title);
            //view.times.hide();
            //view.times.hide();
            view.timesHeader.hide();
            $(".k-scheduler-header-wrap > table > tbody > tr:eq(1)").hide();
        }
        
        else if (view.title == 'Timeline Month') {
            
            localStorage.setItem('current-scheduler-view',view.title);
            localStorage.removeItem('custom-scheduler-use');
            localStorage.removeItem('custom-scheduler-days');
            $("#custom-scheduler-days").val("");
            localStorage.removeItem('custom-scheduler-start');
            $("#custom-scheduler-start").val("");
            
            document.getElementById("custom-view-dates").style.display = "none";
            //var view = 'timelineMonth', 
            console.log("VIEW:", view.title);
            //view.times.hide();
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
            if(availDisplay == 'Y') {
                removeSchedulerAvailability();
                setTimeout(function () {
                    displaySchedulerAvailability();
                }, 100);
            } else {
                removeSchedulerAvailability();
            }
        },
        transport: {
            read: {
                //url: "http://rr.ttsite.com.au/bookings",
                url: defUrl + "/bookings",
                dataType: "json"
            },
            update: {
                //url: "http://rr.ttsite.com.au/booking/update",
                url: defUrl + "/booking/update",
                dataType: "json",
                contentType: "application/json",
                type: "POST"
            },
            create: {
                //url: "http://rr.ttsite.com.au/booking/add",
                url: defUrl + "/booking/add",
                dataType: "json",
                contentType: "application/json",
                type: "POST"
            },
            destroy: {
                //url: "http://rr.ttsite.com.au/booking/delete",
                url: defUrl + "/booking/delete",
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
                    bookingType: {from: "BookingType"},
                    requestDesc: {from: "RequestDesc", type: "text", validation: {required: true}},
                    requestId: {from: "RequestId", type: "number", validation: {required: true}},
                    title: {from: "Title", defaultValue: "No title", validation: {required: true}},
                    start: {type: "date", from: "Start"},
                    startDay: {from: "StartDay"},
                    end: {type: "date", from: "End"},
                    endDay: {from: "EndDay"},
                    amPm: {from: "AmPm"},
                    startTimezone: {from: "StartTimezone"},
                    endTimezone: {from: "EndTimezone"},
                    description: {from: "Description"},
                    tradeTypes: {from: "TradeTypes"},
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

if(rebuildView){    

    //alert("TRIGGERED BOTTOM");

    useCustomDate = true;
    localStorage.setItem('custom-scheduler-use',useCustomDate);
    
    var customDays = $("#custom-scheduler-days").val();
    localStorage.setItem('custom-scheduler-days',customDays);
    var startDateRaw = $("#custom-scheduler-start").val();
    var startDateArray = startDateRaw.split("-");
    var startDate = startDateArray[2]+ "-" + startDateArray[1]+ "-" + startDateArray[0];
    var date = startDate;

    localStorage.setItem('custom-scheduler-start',date);

    console.log("CUSTOM START DATE: ", date);
 
    var scheduler = $("#scheduler").data("kendoScheduler");

    scheduler.date(new Date(date));

    scheduler.setOptions({
      numberOfDays: parseInt(customDays)
    });
    // Reload the view.
    scheduler.view(scheduler.view().name);

    rebuildView = false;
}


$("#scheduler").kendoTooltip({
    filter: ".k-event:not(.k-event-drag-hint) > div, .k-task",
    position: "top",
    width: 250,
    border: {
        width: 20,
        color: "green"
      },
    content: kendo.template($('#template').html())
});

var availDisplay = localStorage.getItem('display-scheduler-availability');

if(availDisplay == 'Y') {
    removeSchedulerAvailability();
    setTimeout(function () {
        displaySchedulerAvailability();
    }, 100);
} else {
    removeSchedulerAvailability();
}