//MESSAGES

function messageUpdate(to, type, title, body){

    console.log("UPDATING MESSAGE");
    
    var formDetails = {};
    
    var sender = $("#current-user").val();
    formDetails.message_from = sender;
    formDetails.message_to = to;
    formDetails.message_type = type;
    formDetails.message_title = title;
    formDetails.message_body = body;
    formDetails.message_shift = 0;

    $.ajax({
        url: '/fcm/notify',
        type: "POST",
        data: {
            "form": formDetails
        },
        success: function (response) {
            console.log(response);
            console.log("MESSAGE UPDATED");
        }
    });
    
}

$("body").on('click','#send-user-message', function (e) {
    
    console.log("SENDING USER MESSAGE");
    
    $("#notification_form").find("div.error").removeClass('error').addClass("noerror");
    $("#notification_form").find("input.required").removeClass('required');
    $("#notification_form").find("textarea.required").removeClass('required');
    $("#notification_form").find("select.required").removeClass('required');
    
    var errCount = 0;
    var errMsgArray = [];

    if ($("#emp_fcm_token").val().length < 1 && $("#message_to").val() != 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'emp_fcm',
            "msg": 'The selected Recipient is not yet registered to receive messages. Check that the Recipient has previously logged in to their PC.'
        });
    }
    
    if ($("#message_to").val() == 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'message_to',
            "msg": 'A Message Recipient must be selected'
        });
    }
    
    if ($("#message_title").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'message_title',
            "msg": 'A Message Title must be entered'
        });
    }

    if ($("#message_body").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'message_body',
            "msg": 'Some Message Content must be entered'
        });
    }

    if (errCount > 0) {

        console.log("ERRORS: ", errMsgArray);

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

        $("#notification-progress").html(spinHtml);
        
        var apiKey = 'AAAAYvL6Qlo:APA91bFpdngfedK164jvGmhxD9a0oU3yGADshblqNIWkd_OB0VqsYo7-Kf32H5jmG7Td8rEx4ZwfLoY1sULR2GUcclfBEsBM07YBUP1qa1Uonm6s6e3d78HROtSPf_I2XI72Wvse8UMi';
        var token = $("#emp_fcm_token").val();
        var messageTo = $("#message_to").val();
        var messageTitle = $("#message_title").val();
        var messageBody = $("#message_body").val();

        $.ajax({
            type: 'POST',
            url: "https://fcm.googleapis.com/fcm/send",
            headers: {
                Authorization : 'Bearer ' + apiKey 
            },
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                /* "to": token,
                "priority": "high",
                "data": {
                    "click_action": "https://mob.readyresourcesapp.com.au",
                    "id" : 1,
                    "status" : "bla",
                    "screen" : "shift_messages"
                },
                "notification": {
                    "title": "MY TITLE",
                    "body": "My body"
                } */
                
                /* "data": {
                    "notification": {
                        "title": "FCM Message",
                        "body": "This is an FCM Message",
                        "icon": "/assets/js.png",
                    }
                },
                "to": token
                } */

                "to" : token,
                "notification": {
                "title": messageTitle,
                "body": messageBody
                },
                "webpush": {
                "headers": {
                    "Urgency": "high"
                },
                    "notification": {
                        "body": "This is a message from FCM to web",
                        "requireInteraction": "true",
                        "badge": "/badge-icon.png"
                    }
                    }
                }
            
            ),
            success: function(responseData) {
                
                $("#notification-progress").html("");
                
                console.log("SUCCESS", responseData);

                if(responseData.success == 1){
                    alert("Notification successfully sent!");
                    //UPDATE USER MESSAGES HERE
                    messageUpdate(messageTo, 'U', messageTitle, messageBody);
                } else {
                    alert("Notification could not be sent, please try again.");
                }  
                
                $("#sidebar-left").css({"width": "0px"});
            },
            error: function(jqXhr, textStatus, errorThrown) {
                console.log("Status: " + textStatus + "\nError: " + errorThrown);
            }
        });
    }

});

$("#nav-2-button").click(function (e) {

    e.preventDefault();

    var isRightCol = document.getElementById("my-right-column").style.visibility === "visible";

    if (!isRightCol) {
        $("#my-right-column").css({"visibility": "visible", "width": "250px", "padding": "15px"});
    } else {
        $("#my-right-column").css({"visibility": "hidden", "width": "0px", "padding": "0px"});
    }

});

$("#sidebar-left").on('click', '#scheduler-filter-all', function (e) {

    e.preventDefault();

    $.ajax({
        url: '/scheduler/filter/all',
        type: "GET",

        success: function (response) {
            console.log(response);

            //alert("Employee was successfully added");
            //viewEmployees();
        }
    });

});

$("#sidebar-left").on('click', '#sidebar-left-view-users', function (e) {

    e.preventDefault();
    viewUsers();
});

$("#sidebar-left").on('click', '#sidebar-left-view-trades', function (e) {

    e.preventDefault();
    viewTrades();
});

$("#sidebar-left").on('click', '#sidebar-left-view-skills', function (e) {

    e.preventDefault();
    viewSkills();
});

$("#sidebar-left").on('click', '#sidebar-left-view-employees', function (e) {

    e.preventDefault();

    viewEmployees();
});

$("#sidebar-left").on('click', '#cancel-employee-update', function (e) {

    e.preventDefault();
    viewEmployees();

});

$("#sidebar-left").on('click', '#save-employee-update', function (e) {

    e.preventDefault();

    $("#employee_update_form").find("div.error").removeClass('error').addClass("noerror");
    $("#employee_update_form").find("input.required").removeClass('required');

    /* var myInputs = $('#employee_update_form :input');

    var values = {};
    myInputs.each(function() {
        values[this.name] = $(this).val();
    }); */

    //console.log("VALUES: ", values);

    var values = {};
    $.each($('#employee_update_form').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    console.log("VALUES: ", values);

    var errCount = 0;
    var errMsgArray = [];

    var tradesSelected = [];

    $('#employee_update_form input:checkbox:checked').each(function () {
        if($(this).hasClass('trade')) {
            console.log("TRS:" + $(this).val());
            tradesSelected.push($(this).val());
        }      
    });

    var tradesArray = JSON.stringify(tradesSelected);

    console.log("TS: " + tradesSelected);
    console.log("TRADES: " + tradesArray);

    $("#emp_trades").val(tradesArray);

    var skillsSelected = [];

    $('#employee_update_form input:checkbox:checked').each(function () {
        if($(this).hasClass('skill')) {
            console.log("CB:" + $(this).val());
            skillsSelected.push($(this).val());
        }
    });

    console.log("SK: ", $("#skill_811025").prop('checked'));

    var skillsArray = JSON.stringify(skillsSelected);

    console.log("SS: " + skillsSelected);
    console.log("SKILLS: " + skillsArray);

    $("#emp_skills").val(skillsArray);

    if ($("#first_name").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'first_name',
            "msg": 'A First Name must be entered'
        });
    }

    if ($("#last_name").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'last_name',
            "msg": 'A Last Name must be entered'
        });
    }

    if ($("#birth_date").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'birth_date',
            "msg": 'A Birth Date must be entered'
        });
    }

    //console.log("TRADE: ", $("#trade_type").val());

    /* if ($("#trade_type").val() == '') {
        errCount++;
        errMsgArray.push({
            "id": 'trade_type',
            "msg": 'A Trade Type must be selected'
        });
    } */

    if (tradesSelected.length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'trades_array',
            "msg": 'At least One Trade must be checked'
        });
    }
    
    if (skillsSelected.length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'skills_array',
            "msg": 'At least One Skill must be checked'
        });
    }

    if (errCount > 0) {

        console.log("ERRORS: ", errMsgArray);

        for (var e = 0; e < errMsgArray.length; e++) {

            var errorId = errMsgArray[e]['id'];
            var errorMsg = errMsgArray[e]['msg'];

            $("#" + errorId).addClass('required');
            $("#" + errorId + "_error").removeClass('noerror');
            $("#" + errorId + "_error").addClass('error');
            $("#" + errorId + "_error").html(errorMsg);

        }

    } else {

        var employeeForm = $($("#employee_update_form")[0].elements).not(".skill").not(".trade").serialize();

        //console.log("EMP FORM: ", employeeForm);

        var empId = $("#emp_id").val();

        if (empId.length > 0) {
            var updateUrl = '/employee/' + empId;
            var successMsg = "Employee was successfully updated";
        } else {
            var updateUrl = '/employee';
            var successMsg = "Employee was successfully added";
        }

        $.ajax({
            url: updateUrl,
            type: "POST",
            data: {
                "form": employeeForm
            },
            success: function (response) {
                //console.log(response);

                alert(successMsg);
                viewEmployees();
            }
        });
    }

});

$("#sidebar-left").on('click', '#cancel-trade-update', function (e) {

    e.preventDefault();

    viewTrades();
});

$("#sidebar-left").on('click', '#save-trade-update', function (e) {

    e.preventDefault();

    $("#trade_update_form").find("div.error").removeClass('error').addClass("noerror");
    $("#trade_update_form").find("input.required").removeClass('required');

    var errCount = 0;
    var errMsgArray = [];

    if ($("#trade_desc").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'trade_desc',
            "msg": 'Trade Description can\'t be empty'
        });
    }

    if ($("#trade_color").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'trade_color',
            "msg": 'A Trade Colour must be selected'
        });
    }

    if ($("#lt_rate").val().length < 1) {
        
        errCount++;
        errMsgArray.push({
            "id": 'lt_rate',
            "msg": 'A Long Term Rate must be entered'
        });
   
    } else {
        
        var ltRate = $("#lt_rate").val();
        
        if(!isFinite(ltRate)) {
            errCount++;
            errMsgArray.push({
                "id": 'lt_rate',
                "msg": 'A Long Term Rate must be entered as a number with a max of 2 dec places'
            });
        }
    }

    if ($("#st_rate").val().length < 1) {
        
        errCount++;
        errMsgArray.push({
            "id": 'st_rate',
            "msg": 'A Short Term Rate must be entered'
        });
    
    } else {
        
        var stRate = $("#st_rate").val();
        
        if(!isFinite(stRate)) {
            errCount++;
            errMsgArray.push({
                "id": 'st_rate',
                "msg": 'A Short Term Rate must be entered as a number with a max of 2 dec places'
            });
        }
    }

    if ($("#fs_rate").val().length < 1) {
        
        errCount++;
        errMsgArray.push({
            "id": 'fs_rate',
            "msg": 'A Field Services Rate must be entered'
        });
    
    } else {
        
        var fsRate = $("#fs_rate").val();
        
        if(!isFinite(fsRate)) {
            errCount++;
            errMsgArray.push({
                "id": 'fs_rate',
                "msg": 'A Field Services Rate must be entered as a number with a max of 2 dec places'
            });
        }
    }

    if (errCount > 0) {

        console.log("ERRORS: ", errMsgArray);

        for (var e = 0; e < errMsgArray.length; e++) {

            var errorId = errMsgArray[e]['id'];
            var errorMsg = errMsgArray[e]['msg'];

            $("#" + errorId).addClass('required');
            $("#" + errorId + "_error").removeClass('noerror');
            $("#" + errorId + "_error").addClass('error');
            $("#" + errorId + "_error").html(errorMsg);

        }

    } else {

        var tradeId = $("#trade_id").val();

        if (tradeId.length > 0) {
            var updateUrl = '/trade/' + tradeId;
            var successMsg = "Trade was successfully updated";
        } else {
            var updateUrl = '/trade';
            var successMsg = "Trade was successfully added";
            var rdm = Math.floor((Math.random() * 1000000) + 1);
            $("#trade_code").val(rdm);
        }

        var tradeForm = $("#trade_update_form").serialize();

        $.ajax({
            url: updateUrl,
            type: "POST",
            data: {
                "form": tradeForm
            },
            success: function (response) {
                //console.log(response);

                alert(successMsg);
                viewTrades();
            }
        });
    }

});

$("#sidebar-left").on('click', '#cancel-skill-update', function (e) {

    e.preventDefault();

    viewSkills();
});

$("#sidebar-left").on('click', '#save-skill-update', function (e) {

    e.preventDefault();

    $("#skill_update_form").find("div.error").removeClass('error').addClass("noerror");
    $("#skill_update_form").find("input.required").removeClass('required');

    var errCount = 0;
    var errMsgArray = [];

    if ($("#skill_desc").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'skills_desc',
            "msg": 'Skill Description can\'t be empty'
        });
    }

    if (errCount > 0) {

        console.log("ERRORS: ", errMsgArray);

        for (var e = 0; e < errMsgArray.length; e++) {

            var errorId = errMsgArray[e]['id'];
            var errorMsg = errMsgArray[e]['msg'];

            $("#" + errorId).addClass('required');
            $("#" + errorId + "_error").removeClass('noerror');
            $("#" + errorId + "_error").addClass('error');
            $("#" + errorId + "_error").html(errorMsg);

        }

    } else {

        //console.log("EMP FORM: ", employeeForm);

        var skillId = $("#skill_id").val();

        if (skillId.length > 0) {
            var updateUrl = '/skill/' + skillId;
            var successMsg = "Skill was successfully updated";
        } else {
            var updateUrl = '/skill';
            var successMsg = "Skill was successfully added";
            var rdm = Math.floor((Math.random() * 1000000) + 1);
            $("#skill_code").val(rdm);
        }

        var skillForm = $("#skill_update_form").serialize();

        $.ajax({
            url: updateUrl,
            type: "POST",
            data: {
                "form": skillForm
            },
            success: function (response) {
                //console.log(response);

                alert(successMsg);
                viewSkills();
            }
        });
    }

});

function saveEmpColor(thisColor) {
    
    thisColor = "#" + thisColor;
    console.log("COLOR: ",thisColor);

    $("#trade_color").css({
        "background-color" : thisColor,
        "color" : thisColor
    });
}

function updateTrade(tradeId) {

    $("#sidebar-left").html("");

    var tradeForm = '<div style="width:100%;padding:10px;border:0px solid blue;">';

    tradeForm += '<button id="sidebar-left-view-employees" class="w3-button w3-darkblue w3-mobile w3-right w3-medium">Employees</button>';
    tradeForm += '<button id="sidebar-left-view-trades" class="w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin-right:10px;">Trades</button>';

    tradeForm += '<div style="margin-top:60px;">';

    tradeForm += '<form id="trade_update_form">';

    tradeForm += '<input type="hidden" id="trade_id" name="trade_id" value="">';
    tradeForm += '<input type="hidden" id="trade_code" name="trade_code" value="">';

    tradeForm += '<div class="w3-row">'
    tradeForm += '<div id="trade_desc_display" style="padding:10px 10px 10px 10px;">';
    tradeForm += '<label style="font-weight:bold;">Trade Description<span class="required-label"<span>*</span></label>';
    tradeForm += '<input name="trade_desc" id="trade_desc" class="w3-input w3-border input-display" type="text">';
    tradeForm += '<div id="trade_desc_error" class="noerror" ></div>';
    tradeForm += '</div>';

    tradeForm += '</div>';

    tradeForm += '<div class="w3-row">'
    tradeForm += '<div id="trade_color_display" style="padding:10px 10px 10px 10px;">';
    tradeForm += '<label style="font-weight:bold;">Trade Color<span class="required-label"<span>*</span></label>';
    tradeForm += '<input name="trade_color" id="trade_color" class="w3-input w3-border input-display" style="color:#EFEFEF;" type="text">';
    tradeForm += '<div id="trade_color_error" class="noerror" ></div>';
    tradeForm += '</div>';

    tradeForm += '</div>';

    tradeForm += '<h6 style="margin-bottom:0px;margin-left:10px;font-weight:bold;">Rates:</h6>';
    
    tradeForm += '<div class="w3-row" style="border:0px solid yellow;">';
    
    tradeForm += '<div id="lt_rate_display" class="w3-third" style="padding:10px 10px 10px 10px;">';
    tradeForm += '<label style="font-weight:bold;">Long Term<span class="required-label"<span>*</span></label>';
    tradeForm += '<input name="lt_rate" id="lt_rate" class="w3-input w3-border input-display" type="number" step=".01">';
    tradeForm += '<div id="lt_rate_error" class="noerror" ></div>';
    tradeForm += '</div>';
    
    tradeForm += '<div id="st_rate_display" class="w3-third" style="padding:10px 10px 10px 10px;">';
    tradeForm += '<label style="font-weight:bold;">Short Term<span class="required-label"<span>*</span></label>';
    tradeForm += '<input name="st_rate" id="st_rate" class="w3-input w3-border input-display" type="text">';
    tradeForm += '<div id="st_rate_error" class="noerror" ></div>';
    tradeForm += '</div>';

    tradeForm += '<div id="fs_rate_display" class="w3-third" style="padding:10px 10px 10px 10px;">';
    tradeForm += '<label style="font-weight:bold;">Field Services<span class="required-label"<span>*</span></label>';
    tradeForm += '<input name="fs_rate" id="fs_rate" class="w3-input w3-border input-display" type="text">';
    tradeForm += '<div id="fs_rate_error" class="noerror" ></div>';
    tradeForm += '</div>';

    tradeForm += '</div>';

    tradeForm += '<div class="w3-row" style="border:0px solid green;">';
    
    tradeForm += '<div class="w3-half" style="padding:10px 10px 10px 10px;">';
    tradeForm += '<label>Type<span class="required-label"<span>*</span></label>';
    tradeForm += '<select name="trade_type" id="trade_type" class="w3-select w3-border input-display">';
    tradeForm += '<option value="R">Regular</option>';
    tradeForm += '<option value="I">Internal</option>';
    tradeForm += '</select>';
    tradeForm += '</div>';

    tradeForm += '<div class="w3-half" style="padding:10px 10px 10px 10px;">';
    tradeForm += '<label>Status<span class="required-label"<span>*</span></label>';
    tradeForm += '<select name="trade_status" id="trade_status" class="w3-select w3-border input-display">';
    tradeForm += '<option value="A">Active</option>';
    tradeForm += '<option value="X">Inactive</option>';
    tradeForm += '</select>';
    tradeForm += '</div>';
    
    tradeForm += '</div>';
    
    tradeForm += '</div>';
    
    tradeForm += '</form>';

    tradeForm += '</div>';

    tradeForm += '<div class="w3-center" style="margin-top:10px;">';
    tradeForm += '<button id="cancel-trade-update" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    tradeForm += '<button id="save-trade-update" class="w3-button w3-darkblue w3-mobile w3-medium">Save</button>';

    tradeForm += '</div>';

    tradeForm += '</div>';

    $("#sidebar-left").append(tradeForm);
    
    $('#trade_color').colorpicker({
        title: "SELECT A COLOUR",
        inline: false,
        /* position: {
            my: 'bottom',
            at: 'right',
            of: 'element'
        }, */
        //modal: true,
        parts:  ['header',
        'preview',
        'swatches', 'footer'
        ],
        alpha: false,
        ok: function(event, color) {	
            saveEmpColor(color.formatted);
        },
    });

    if (tradeId.length > 0) {

        $.ajax({
            url: '/trade/' + tradeId,
            type: "GET",
            success: function (response) {

                var trade = response;

                for (var key in trade) {

                    if(key == 'trade_color'){
                        $("#" + key).val(trade[key]);
                        $("#" + key).css({
                            "background-color" : trade[key],
                            "color" : trade[key]
                        })
                    } else {                   
                        $("#" + key).val(trade[key]);
                    }

                }
            }
        });
    }
}

$("#sidebar-left").on('click', '#sidebar-left-add-skill', function (e) {

    e.preventDefault();

    updateSkill("");

});

function updateSkill(skillId) {

    $("#sidebar-left").html("");

    var skillForm = '<div style="width:100%;padding:10px;border:0px solid blue;">';

    skillForm += '<button id="sidebar-left-view-employees" class="w3-button w3-darkblue w3-mobile w3-right w3-medium">Employees</button>';
    skillForm += '<button id="sidebar-left-view-skills" class="w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin-right:10px;">Skills</button>';

    skillForm += '<div style="margin-top:60px;">';

    skillForm += '<form id="skill_update_form">';

    skillForm += '<input type="hidden" id="skill_id" name="skill_id" value="">';
    skillForm += '<input type="hidden" id="skill_code" name="skill_code" value="">';

    skillForm += '<div class="w3-row">'
    skillForm += '<div id="skill_desc_display" style="padding:10px 10px 10px 10px;">';
    skillForm += '<label style="font-weight:bold;">Skill Description<span class="required-label"<span>*</span></label>';
    skillForm += '<input name="skill_desc" id="skill_desc" class="w3-input w3-border input-display" type="text">';
    skillForm += '<div id="skill_desc_error" class="noerror" ></div>';
    skillForm += '</div>';

    skillForm += '</div>';

    skillForm += '</form>';

    skillForm += '</div>';

    skillForm += '<div class="w3-center" style="margin-top:10px;">';
    skillForm += '<button id="cancel-skill-update" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    skillForm += '<button id="save-skill-update" class="w3-button w3-darkblue w3-mobile w3-medium">Save</button>';

    skillForm += '</div>';

    skillForm += '</div>';

    $("#sidebar-left").append(skillForm);

    if (skillId.length > 0) {

        $.ajax({
            url: '/skill/' + skillId,
            type: "GET",
            success: function (response) {

                //console.log("EMP: ", response);

                var skill = response;

                for (var key in skill) {

                    $("#" + key).val(skill[key]);

                }
            }
        });
    }
}

$("#sidebar-left").on('click', '#sidebar-left-add-trade', function (e) {

    e.preventDefault();

    updateTrade("");

});

$("#sidebar-left").on('click', '[id^=edit_trade_]', function (e) {

    e.preventDefault();

    var splitId = $(this).prop("id");
    var splitArray = splitId.split("_");
    var tradeId = splitArray[2]

    console.log("TRADEID:", tradeId);

    updateTrade(tradeId);

});

$("#sidebar-left").on('click', '[id^=edit_skill_]', function (e) {

    e.preventDefault();

    var splitId = $(this).prop("id");
    var splitArray = splitId.split("_");
    var skillId = splitArray[2]

    console.log("SKILLID:", skillId);

    updateSkill(skillId);

});

$(document).on('focus',".datepicker-year", function(){
    $(this).datepicker({
        changeYear: true,
        yearRange: "1950:2021",
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

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function updateEmployee(empId) {

    $("#sidebar-left").html("");

    var employeeForm = '<div style="width:100%;padding:10px;border:0px solid blue;">';

    employeeForm += '<button id="sidebar-left-view-employees" class="w3-button w3-darkblue w3-mobile w3-right w3-medium">Employees</button>';

    employeeForm += '<div style="margin-top:60px;">';

    //SHOW DRIVERS LICENCE
    
    employeeForm += '<div id="emp-drivers-licence" class="w3-container"></div>';

    //employeeForm += '<img style="max-width: 100%" src="/drivers_licences/dl_000001.png">';


    //employeeForm += '</div>';
    
    
    
    employeeForm += '<form id="employee_update_form">';

    employeeForm += '<input type="hidden" id="emp_id" name="emp_id" value="">';
    employeeForm += '<input type="hidden" id="emp_type" name="emp_type" value="">';
    employeeForm += '<input type="hidden" id="color" name="color" value="">';

    employeeForm += '<div class="w3-row">';

    employeeForm += '<div id="first_name_display" class="w3-half" style="padding:10px 10px 10px 10px;">';
    employeeForm += '<label style="font-weight:bold;">First Name<span class="required-label"<span>*</span></label>';
    employeeForm += '<input name="first_name" id="first_name" class="w3-input w3-border input-display" type="text">';
    employeeForm += '<div id="first_name_error" class="noerror" ></div>';
    employeeForm += '</div>';

    employeeForm += '<div id="middle_names_display" class="w3-half" style="padding:15px 10px 10px 10px;">';
    employeeForm += '<label style="font-weight:bold;">Middle Names</label>';
    employeeForm += '<input name="middle_names" id="middle_names" class="w3-input w3-border input-display" type="text">';
    employeeForm += '</div>';

    employeeForm += '</div>';

    employeeForm += '<div class="w3-row">';
    
    employeeForm += '<div id="last_name_display" class="w3-half" style="padding:10px 10px 10px 10px;">';
    employeeForm += '<label style="font-weight:bold;">Last Name<span class="required-label"<span>*</span></label>';
    employeeForm += '<input name="last_name" id="last_name" class="w3-input w3-border input-display" type="text">';
    employeeForm += '<div id="last_name_error" class="noerror" ></div>';
    employeeForm += '</div>';

    employeeForm += '<div id="preferred_name_display" class="w3-half" style="padding:15px 10px 10px 10px;">';
    employeeForm += '<label style="font-weight:bold;">Preferred Name</label>';
    employeeForm += '<input name="preferred_name" id="preferred_name" class="w3-input w3-border input-display" type="text">';
    employeeForm += '<div id="preferred_name_error" class="noerror" ></div>';
    employeeForm += '</div>';

    employeeForm += '</div>';

    ////

    employeeForm += '<div class="w3-row">';

        employeeForm += '<div id="emp_title_display" class="w3-half" style="padding:15px 10px 10px 10px;">';
            employeeForm += '<label style="font-weight:bold;">Title</label>';
            employeeForm += '<select name="emp_title" id="emp_title" class="w3-select w3-border input-display">';
            employeeForm += '<option value="NA">Select a Title</option>';
            employeeForm += '<option value="Mr">Mr</option>';
            employeeForm += '<option value="Mrs">Mrs</option>';
            employeeForm += '<option value="Ms">Ms</option>';
            employeeForm += '<option value="Miss">Miss</option>';
            employeeForm += '</select>';
            employeeForm += '<div id="emp_title_error" class="noerror" ></div>';
        employeeForm += '</div>';

        employeeForm += '<div id="gender_display" class="w3-half" style="padding:10px 0 10px 0px;">';
            employeeForm += '<label style="margin:0 0 0 10px;">Gender<span class="required-label"<span>*</span></label>';

            employeeForm += '<div style="margin:0 0 0 10px;">';
            employeeForm += '<input id="emp_gender_male" name="emp_gender" class="w3-radio input-display" type="radio" value="M">';
            employeeForm += '<label style="margin-left:5px;font-weight:normal;">Male</label>';
            employeeForm += '<input id="emp_gender_female" name="emp_gender" class="w3-radio" type="radio" value="F" style="margin-left:10px;">';
            employeeForm += '<label style="margin-left:5px;font-weight:normal;">Female</label>';
        employeeForm += '</div>';

    employeeForm += '</div>';

    employeeForm += '<div class="w3-row" style="margin:10px 0 0 0;">';
    
    employeeForm += '<div id="birth_date_display" class="w3-half" style="padding:10px 10px 10px 10px;">';
    employeeForm += '<label style="font-weight:bold;">Birth Date<span class="required-label"<span>*</span></label>';
    employeeForm += '<input name="birth_date" id="birth_date" class="w3-input w3-border datepicker-year input-display" type="text">';
    employeeForm += '<div id="birth_date_error" class="noerror" ></div>';
    employeeForm += '</div>';
    
    employeeForm += '<div id="emp_pin_display" class="w3-half" style="padding:15px 10px 10px 10px;">';
    employeeForm += '<label style="font-weight:bold;">PIN</label>';
    employeeForm += '<input name="emp_pin" id="emp_pin" class="w3-input w3-border input-display" type="text">';
    employeeForm += '</div>';

    employeeForm += '</div>';

    employeeForm += '<div class="w3-row" style="margin:10px 0 0 0;">';
    
    employeeForm += '<div id="emp_email_display" class="w3-twothird" style="padding:10px 10px 10px 10px;">';
    employeeForm += '<label style="font-weight:bold;">Email<span class="required-label"<span>*</span></label>';
    employeeForm += '<input name="emp_email" id="emp_email" class="w3-input w3-border datepicker-year input-display" type="text">';
    employeeForm += '<div id="emp_email_error" class="noerror" ></div>';
    employeeForm += '</div>';
    
    employeeForm += '<div id="emp_mobile_display" class="w3-third" style="padding:15px 10px 10px 10px;">';
    employeeForm += '<label style="font-weight:bold;">Mobile Phone<span class="required-label"<span>*</span></label>';
    employeeForm += '<input name="emp_mobile" id="emp_mobile" class="w3-input w3-border input-display" type="text">';
    employeeForm += '<div id="emp_mobile_error" class="noerror" ></div>';
    employeeForm += '</div>';

    employeeForm += '</div>';

    /* employeeForm += '<div class="w3-row" style="margin:10px 0 0 0;">';
    
    employeeForm += '<div class="w3-half" style="padding:10px 10px 10px 10px;">';
    employeeForm += '<label>Trade Type<span class="required-label"<span>*</span></label>';
    employeeForm += '<select name="trade_type" id="trade_type" class="w3-select w3-border input-display"></select>';
    employeeForm += '<div id="trade_type_error" class="noerror" ></div>';
    employeeForm += '</div>';

    employeeForm += '</div>'; */

    employeeForm += '<div class="w3-row" style="margin:10px 0 0 0;">';

    employeeForm += '<div style="padding:10px 10px 10px 10px;">';
    employeeForm += '<label>Trade Type(s)<span class="required-label"<span>*</span></label>';
    employeeForm += '<div id="trades_array_error" class="noerror"></div>';
    //employeeForm += '<select name="trade_type" id="trade_type" class="w3-select w3-border input-display"></select>';
    //employeeForm += '<div id="trade_type_error" class="noerror" ></div>';
    
    $.ajax({
        url: '/trades',
        async: false,
        type: "GET",
        success: function (response) {

            console.log("RESP: ", response);

            var trades = response;
            var count = 1;

            for (var s = 0; s < trades.length; s++) {

                var tradeDesc = trades[s]['trade_desc'];
                var tradeCode = trades[s]['trade_code'];

                if(count == 1 ){
                    employeeForm += '<div class="w3-row filter-row">';
                }

                employeeForm += '<div class="w3-third" style="padding:0 10px 10px 0;">';
                employeeForm += '<input id="trade_' + tradeCode + '" name="trade_' + tradeCode + '" class="w3-check trade" type="checkbox" value="' + tradeCode + '">';
                employeeForm += '<label style="margin-left:5px;font-weight:normal;">' + tradeDesc + '</label>';
                employeeForm += '</div>';

                if(count % 3 === 0){
                    employeeForm += '</div>';
                    employeeForm += '<div class="w3-row filter-row">';
                }

                count++;
            }

            employeeForm += '</div>';

        }

    });
    
    employeeForm += '</div>';

    employeeForm += '</div>';

    employeeForm += '<input type="hidden" id="emp_trades" name="emp_trades" value="">';
    
    employeeForm += '<div class="w3-row">';

    employeeForm += '<div id="emp_sap_display" class="w3-half" style="padding:10px 10px 10px 10px;">';
    employeeForm += '<label style="font-weight:bold;">SAP Number</label>';
    employeeForm += '<input name="emp_sap" id="emp_sap" class="w3-input w3-border input-display" type="text">';
    employeeForm += '</div>';

    employeeForm += '<div id="rehire_display" class="w3-half" style="padding:10px 0 10px 0px;">';
    employeeForm += '<label style="margin:0 0 0 10px;">RIO Re-Hire<span class="required-label"<span>*</span></label>';

    employeeForm += '<div style="margin:0 0 0 10px;">';
    employeeForm += '<input id="emp_rehire_yes" name="emp_rehire" class="w3-radio input-display" type="radio" value="Y">';
    employeeForm += '<label style="margin-left:5px;font-weight:normal;">Yes</label>';
    employeeForm += '<input id="emp_rehire_no" name="emp_rehire" class="w3-radio" type="radio" value="N" style="margin-left:10px;">';
    employeeForm += '<label style="margin-left:5px;font-weight:normal;">No</label>';
    employeeForm += '</div>';

    employeeForm += '</div>';
    employeeForm += '</div>';

    employeeForm += '<div style="clear:both;"></div>';

    //SKILLS
    employeeForm += '<label style="padding-left:10px;">Qualifications:</label>';

    employeeForm += '<div id="skills_array_error" class="noerror"></div>';

    employeeForm += '<div id="skills-selection" style="padding-left:10px;" class="w3-row filter-row">';

    employeeForm += '</div>';

    employeeForm += '<input type="hidden" id="emp_skills" name="emp_skills" value="">';

    employeeForm += '<label style="padding-left:10px";>Experience:</label>';

    employeeForm += '</form>';

    employeeForm += '</div>';

    employeeForm += '<div class="w3-center" style="margin-top:10px;">';
    employeeForm += '<button id="cancel-employee-update" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    employeeForm += '<button id="save-employee-update" class="w3-button w3-darkblue w3-mobile w3-medium">Save</button>';
    employeeForm += '</div>';

    employeeForm += '</div>';


    $("#sidebar-left").append(employeeForm);

    $("#emp_gender_male").prop("checked", true);
    $("#emp_rehire_no").prop("checked", true);


    if(empId.length < 1) {
        empId = 'all';
    }
    $.ajax({
        url: '/employee/' + empId,
        type: "GET",
        success: function (response) {

            var employee = response.employee;
            console.log("EMP: ", employee);

            var trades = response.trades;

            $("#trade_type").html("");

            var tradeTypeOptions = '<option value="">Select a Trade</option>';

            for (var t = 0; t < trades.length; t++) {

                var tradeDesc = trades[t]['trade_desc'];
                var tradeCode = trades[t]['trade_code'];

                tradeTypeOptions += '<option value="' + tradeCode + '">' + tradeDesc + '</option>';
            }

            $("#trade_type").append(tradeTypeOptions);

            /////

            var skills = response.skills;
            //console.log("SKILLS: ", skills);

            //SKILLS

            var skillCount = 1;

            for (var s = 0; s < skills.length; s++) {

                //console.log("LOOP: " + s);

                var skillDesc = skills[s]['skill_desc'];
                var skillCode = skills[s]['skill_code'];

                if(skillCount == 1 ){
                    var employeeSkillsSelection = '<div class="w3-row filter-row">';
                }

                employeeSkillsSelection += '<div class="w3-half" style="padding:0 10px 10px 0px;">';
                employeeSkillsSelection += '<input id="skill_' + skillCode + '" name="skill_' + skillCode + '" class="w3-check skill" type="checkbox" value="' + skillCode + '">';
                employeeSkillsSelection += '<label style="margin-left:5px;font-weight:normal;">' + skillDesc + '</label>';
                employeeSkillsSelection += '</div>';

                if(skillCount % 2 === 0){
                    employeeSkillsSelection += '</div>';
                    employeeSkillsSelection += '<div class="w3-row filter-row">';
                }

                skillCount++;

            }

            //console.log("ES: ", employeeSkillsSelection);

            $("#skills-selection").html("");
            $("#skills-selection").append(employeeSkillsSelection);

            for (var key in employee) {

                if (key == 'emp_trades' && employee[key].length > 0) {

                    var empTradesArray = JSON.parse(employee[key]);

                    for (var t = 0; t < empTradesArray.length; t++) {

                        var tradeCode = empTradesArray[t];
                        var tradeId = 'trade_' + tradeCode;

                        $("#" + tradeId).prop("checked", true);
                    }
 
                } else if(key == 'emp_skills' && employee[key] !== null) {

                    var empSkillsArray = JSON.parse(employee[key]);

                    for (var s = 0; s < empSkillsArray.length; s++) {

                        var skillCode = empSkillsArray[s];
                        var skillId = 'skill_' + skillCode;

                        $("#" + skillId).prop("checked", true);
                    }

                } else if (key == 'emp_gender') {
                    var thisGender = employee[key];
                    if(thisGender == 'M'){
                        $("#emp_gender_male").prop("checked", true);
                        $("#emp_gender_female").prop("checked", false);
                    } else {
                        $("#emp_gender_male").prop("checked", false);
                        $("#emp_gender_female").prop("checked", true);
                    }

                } else if (key == 'emp_rehire') {
                    var thisGender = employee[key];
                    if(thisGender == 'Y'){
                        $("#emp_rehire_yes").prop("checked", true);
                        $("#emp_rehire_no").prop("checked", false);
                    } else {
                        $("#emp_rehire_yes").prop("checked", false);
                        $("#emp_rehire_no").prop("checked", true);
                    }

                } else {
                    $("#" + key).val(employee[key]);
                }
            }

            $("#emp-drivers-licence").html("");
            
            var paddedEmpId = pad(empId, 6);

            var imageUrl = '/drivers_licences/dl_' + paddedEmpId;

            if (typeof(imageUrl) != "undefined") {

                console.log("IMAGE URL: ", imageUrl);
                            
                $.get(imageUrl)
                .done(function() { 
                    var empDriversLicenceImg = '<img style="max-width: 100%" src="' + imageUrl + '.png"></img>';
                    $("#emp-drivers-licence").append(empDriversLicenceImg);    
                }).fail(function() { 
                    var empDriversLicenceImg = '<div class ="error">No Drivers Licence Provided</div>';
                    $("#emp-drivers-licence").append(empDriversLicenceImg);    
                });

            } else {
                var empDriversLicenceImg = '<div class ="error">No Drivers Licence Provided</div>';
                $("#emp-drivers-licence").append(empDriversLicenceImg);
            }
        
        }
    });

}

$("#sidebar-left").on('click', '#sidebar-left-add-employee', function (e) {

    e.preventDefault();

    updateEmployee("");

});

$("#sidebar-left").on('click', '[id^=edit_employee_]', function (e) {

    e.preventDefault();

    var splitId = $(this).prop("id");
    var splitArray = splitId.split("_");
    var empId = splitArray[2]

    console.log("EMPID:", empId);

    updateEmployee(empId);

});

//FIULE UPLOAD

$("body").on("click", "#upload_file", function(event){
    
   //var form = $('#upload_form');
   
   //var data = new FormData(form[0]);

   //console.log("DATA: ", data);

   let files = new FormData(); // you can consider this as 'data bag'
       // url = 'yourUrl';

    var chkFiles = $('#filename')[0].files[0];
    
    console.log("CHECK FILES: ", chkFiles);
    

    files.append('fileName', $('#filename')[0].files[0]);

    //console.log("FILES: ", files.values);

    for (let [key, value] of files) {
        console.log(`${key}: ${value}`)
      }

      $.ajax({
        url: '/files/upload',
        type: "POST",
        data: files,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response);

            //alert(successMsg);
            //viewEmployees();
        }
    });



});

$("body").on('click', '#upload_fileXXX', function (e) {
    
    e.preventDefault();

    var form = $('#upload_form')[0];
    
    var data = new FormData(form);

    //Form data
    var form_data = $('#upload_form').serializeArray();
    $.each(form_data, function (key, input) {
        data.append(input.name, input.value);
    });

    //File data
    var file_data = $('input[name="filename"]')[0].files;
    for (var i = 0; i < file_data.length; i++) {
        data.append("my_images[]", file_data[i]);
    }

    //Custom data
    data.append('key', 'value');

    console.log("DATA: ", data)

    /* $.ajax({
        url: '/files/upload',
        type: "POST",
        data: {
            "form": uploadForm
        },
        success: function (response) {
            console.log(response);

            //alert(successMsg);
            //viewEmployees();
        }
    }); */

});

///NOTIFICATIONS

function sendEmpMessage(fcmPayload){

    console.log("SEND PAYLOAD: ", fcmPayload);
    
    var apiKey = 'key=' + fcmPayload['fcm_api_key'];
    console.log("API KEY: ", apiKey);
    var messageTo = fcmPayload['fcm_token']
    console.log("MSG TO: ", messageTo);
    var title = fcmPayload['msg_title'];
    var body = fcmPayload['msg_body'];

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
                "screen" : "new_messages"
            },
            "notification": {
                "title": title,
                "body": body
            }
        }),
        success: function(responseData) {
            
            console.log("SUCCESS", responseData);          

            $("#notification-progress").html("");
                
            console.log("SUCCESS", responseData);

            if(responseData.success == 1){
                alert("Notification successfully sent!");
                //UPDATE EMP MESSAGES HERE
                var sender = $("#current-user").val();
                messageUpdate(sender, 'U', title, body);
        
            } else {
                alert("Notification could not be sent, please try again.");
            }

            $("#sidebar-left").css({"width": "0px"});
            
        },
        error: function(jqXhr, textStatus, errorThrown) {
            console.log("Status: " + textStatus + "\nError: " + errorThrown);
            $("#notification-progress").html("");
        }
    });

}

$("body").on('click', '#fcm-send', function (e) {

    e.preventDefault();

    alert("SEND");

    var apiKey = 'key=AAAAYvL6Qlo:APA91bFpdngfedK164jvGmhxD9a0oU3yGADshblqNIWkd_OB0VqsYo7-Kf32H5jmG7Td8rEx4ZwfLoY1sULR2GUcclfBEsBM07YBUP1qa1Uonm6s6e3d78HROtSPf_I2XI72Wvse8UMi';
    var messageTo = 'fM_sOUjDokv_gSN4M2DjQl:APA91bHvUnRMbJpJRGeQQbewQtb2HTRRse6Gz_IdwoQkMQXpQ6csDk-yX7Nvn6dmpnhhhyhW-EoAT3dQbBShvefHHgiYoUknGgdgWMDbteZ_g34KcNPCt5tYLxHbVVzdVcdlrpaWffe3';
    var title = "My Title";
    var body = "Message body";

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
                "id" : 1,
                "status" : "bla"
            },
            "notification": {
                "title": title,
                "body": body
            }
        }),
        success: function(responseData) {
            console.log("Success");
        },
        error: function(jqXhr, textStatus, errorThrown) {
            /*alert("Fail");*/   // alerting "Fail" isn't useful in case of an error...
            console.log("Status: " + textStatus + "\nError: " + errorThrown);
        }
    });

});

$("#sidebar-left").on('click', '#send-notification', function (e) {

    console.log("SENDING EMPLOYEE MESSAGE");

    e.preventDefault();
    
    $("#notification_form").find("div.error").removeClass('error').addClass("noerror");
    $("#notification_form").find("input.required").removeClass('required');
    $("#notification_form").find("textarea.required").removeClass('required');
    $("#notification_form").find("select.required").removeClass('required');

    var values = {};
    $.each($('#notification_form').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    console.log("VALUES: ", values);

    //BUILD THE FCM PAYLOAD

    var fcmPayload = {};
    
    fcmPayload['fcm_api_key'] = 'AAAAYvL6Qlo:APA91bFpdngfedK164jvGmhxD9a0oU3yGADshblqNIWkd_OB0VqsYo7-Kf32H5jmG7Td8rEx4ZwfLoY1sULR2GUcclfBEsBM07YBUP1qa1Uonm6s6e3d78HROtSPf_I2XI72Wvse8UMi';
    fcmPayload['fcm_token'] = values['emp_fcm_token'];
    fcmPayload['msg_title'] = values['message_title'];
    fcmPayload['msg_body'] = values['message_body'];

    console.log("FCM: ", fcmPayload);

    var errCount = 0;
    var errMsgArray = [];

    if ($("#emp_fcm_token").val().length < 1 && $("#message_to").val() != 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'emp_fcm',
            "msg": 'The selected Recipient is not yet registered to receive messages. Check that the Recipient has previously logged in to their PC.'
        });
    }
    
    if ($("#message_to").val() == 'N') {
        errCount++;
        errMsgArray.push({
            "id": 'message_to',
            "msg": 'A Message Recipient must be selected'
        });
    }
    
    if ($("#message_title").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'message_title',
            "msg": 'A Message Title must be entered'
        });
    }

    if ($("#message_body").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'message_body',
            "msg": 'Some Message Content must be entered'
        });
    }

    if (errCount > 0) {

        console.log("ERRORS: ", errMsgArray);

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

        $("#notification-progress").html(spinHtml);

        sendEmpMessage(fcmPayload);

        /*
        var notificationForm = $("#notification_form").serialize();

        var values = {};
        $.each($('#notification_form').serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });

        console.log("VALUES: ", values);

        $.ajax({
            url: '/fcm/add',
            type: "POST",
            data: {
                "form": notificationForm
            },
            success: function (response) {
                console.log(response);

                sendMessage(fcmPayload);

                //var to = $("#message_to").val();
                //var title = $("#message_title").val();
                //var body = $("#message_body").val();
            }
        });
        */
    }

});

$("#sidebar-left").on('change', '#message_to', function (e) {

    e.preventDefault();

    //GET RECIPIENT TYPE

    if($("#message-type-employee").prop("checked") == true){
        var recipientType = 'E'
    } else {
        var recipientType = 'U'
    }

    console.log("REC TYPE: ", recipientType);

    var empId = $(this).val();

    console.log("EMP ID: ", empId)

    //alert("GET EMP DETS");

    if(recipientType == 'E'){

        $.ajax({
            url: '/employee/' + empId,
            type: "GET",
            async: false,
            success: function (response) {

                console.log("EMPLOYEE", response);
                
                var employee = response;

                var fcmToken = employee.employee['emp_fcm_token'];
                
                console.log("FCM TOKEN: ", fcmToken);

                $("#emp_fcm_token").val(fcmToken);

            }
        });

    } else {
        
        $.ajax({
            url: '/users/' + empId,
            type: "GET",
            async: false,
            success: function (response) {

                console.log("USER", response);
                
                var user = response;

                var fcmToken = user['fcm_token'];
                
                console.log("USER FCM TOKEN: ", fcmToken);

                $("#emp_fcm_token").val(fcmToken);

            }
        });
    }

});

$("#sidebar-left").on('click', '#cancel-notification-send', function (e) {

    e.preventDefault();

    viewSkills();
});

$("#sidebar-left").on('click', '#message-type-employee', function (e) {
    
    $("#notification_form").find("div.error").removeClass('error').addClass("noerror");
    $("#notification_form").find("input.required").removeClass('required');
    $("#notification_form").find("textarea.required").removeClass('required');
    $("#notification_form").find("select.required").removeClass('required');

    $.ajax({
        url: '/employees',
        type: "GET",
        async: false,
        success: function (response) {

            console.log("EMPLOYEES", response);

            var users = response;

            $("#message_to").html("");

            var messageToOptions = '<option value="N">Select a Recipient</option>';

            for (var u = 0; u < users.length; u++) {

                var userId = users[u]['emp_id'];
                var userName = users[u]['first_name'] + " " + users[u]['last_name'];

                messageToOptions += '<option value="' + userId + '">' + userName + '</option>';
            }

            console.log("TO: ", messageToOptions);

            $("#message_to").append(messageToOptions);

            $("#send-user-message").css({"display" : "none"});
            $("#send-notification").css({"display" : "inline-block"});
        }
    });

});

$("#sidebar-left").on('click', '#message-type-user', function (e) {

    $("#notification_form").find("div.error").removeClass('error').addClass("noerror");
    $("#notification_form").find("input.required").removeClass('required');
    $("#notification_form").find("textarea.required").removeClass('required');
    $("#notification_form").find("select.required").removeClass('required');
    
    $.ajax({
        url: '/users',
        type: "GET",
        async: false,
        success: function (response) {

            console.log("USERS", response);

            var users = response;

            $("#message_to").html("");

            var messageToOptions = '<option value="N">Select a Recipient</option>';

            for (var u = 0; u < users.length; u++) {

                var userId = users[u]['id'];
                var userName = users[u]['first_name'] + " " + users[u]['last_name'];

                messageToOptions += '<option value="' + userId + '">' + userName + '</option>';
            }

            console.log("TO: ", messageToOptions);

            $("#message_to").append(messageToOptions);

            $("#send-user-message").css({"display" : "inline-block"});
            $("#send-notification").css({"display" : "none"});
        }
    });

});

$('input[name="name_of_your_radiobutton"]:checked').val();

function viewNotifications() {

    $("#sidebar-left").html("");

    var notificationForm = '<div style="width:100%;padding:10px;border:0px solid blue;">';
    
    notificationForm += '<h4 style="margin:10px 0 0 10px;">Send a Message</h4>';

    notificationForm += '<form id="notification_form">';

    notificationForm += '<div style="margin:10px; 0 0 10px;">';
    notificationForm += '<input id="message-type-user" name="message_type" class="w3-radio input-display" type="radio" value="U">';
    notificationForm += '<label style="margin-left:5px;font-weight:normal;">Internal</label>';
    notificationForm += '<input id="message-type-employee" name="message_type" class="w3-radio" type="radio" value="E" style="margin-left:10px;">';
    notificationForm += '<label style="margin-left:5px;font-weight:normal;">Employee</label>';
    notificationForm += '</div>';
    
    notificationForm += '<input type="hidden" id="emp_fcm_token" name="emp_fcm_token" value="">';
    notificationForm += '<div style="margin-left:10px;" id="emp_fcm_error" class="noerror" ></div>';

    notificationForm += '<input type="hidden" id="message_shift" name="message_shift" value="6">';
    
    notificationForm += '<div class="w3-row">';
    notificationForm += '<div id="message_to_display" style="padding:10px 10px 10px 10px;">';
    notificationForm += '<label style="font-weight:bold;">To<span class="required-label"<span>*</span></label>';
    notificationForm += '<select name="message_to" id="message_to" class="w3-select w3-border input-display"></select>';
    notificationForm += '<div id="message_to_error" class="noerror" ></div>';
    notificationForm += '</div>';
    notificationForm += '</div>';
    
    notificationForm += '<div class="w3-row">';
    notificationForm += '<div id="message_title_display" style="padding:15px 10px 10px 10px;">';
    notificationForm += '<label style="font-weight:bold;">Message Title<span class="required-label"<span>*</span></label>';
    notificationForm += '<input name="message_title" id="message_title" class="w3-input w3-border input-display" type="text">';
    notificationForm += '<div id="message_title_error" class="noerror" ></div>';
    notificationForm += '</div>';
    notificationForm += '</div>';

    notificationForm += '<div class="w3-row">';
    notificationForm += '<div id="message_body_display" style="padding:15px 10px 10px 10px;">';
    notificationForm += '<label style="font-weight:bold;">Message Content<span class="required-label"<span>*</span></label>';
    notificationForm += '<textarea class="w3-input w3-border input-display" rows="5" name="message_body" id="message_body"></textarea>';
    notificationForm += '<div id="message_body_error" class="noerror" ></div>';
    notificationForm += '</div>';
    notificationForm += '</div>';

    notificationForm += '</form>';

    notificationForm += '</div>';

    notificationForm += '<div style="clear:both;"></div>';

    notificationForm += '<div id="notification-progress"></div>';

    //NEW SPINNER
    
    notificationForm += '<div class="w3-center" style="margin-top:10px;">';
    notificationForm += '<button id="send-notification" class="w3-button w3-darkblue w3-mobile w3-medium">Send Emp Message</button>';
    notificationForm += '<button id="send-user-message" class="w3-button w3-darkblue w3-mobile w3-medium">Send User Message</button>';

    notificationForm += '</div>';

    notificationForm += '</div>';

    $("#sidebar-left").append(notificationForm);

    $("#message-type-employee").prop("checked", true);

    //var recipientType = $("#message-type-employee").val();

    //console.log("REC TYPE: ",recipientType);

    $.ajax({
        url: '/employees',
        type: "GET",
        async: false,
        success: function (response) {

            console.log("EMPLOYEES", response);

            var users = response;

            $("#message_to").html("");

            var messageToOptions = '<option value="N">Select a Recipient</option>';

            for (var u = 0; u < users.length; u++) {

                var userId = users[u]['emp_id'];
                var userName = users[u]['first_name'] + " " + users[u]['last_name'];

                messageToOptions += '<option value="' + userId + '">' + userName + '</option>';
            }

            console.log("TO: ", messageToOptions);

            $("#message_to").append(messageToOptions);

            $("#send-user-message").css({"display" : "none"});
            $("#send-notification").css({"display" : "inline-block"});
        }
    });

}

//SETTINGS HERE

$("#sidebar-left").on('click', '#cancel-user-update', function (e) {

    e.preventDefault();

    viewUsers();
});

$("#sidebar-left").on('click', '#sidebar-left-add-user', function (e) {

    e.preventDefault();

    updateUser("");

});

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    //console.log(re.test(email))
    
    return re.test(email);
  }

function checkUserName(userId, userName){

    var checkData = '';

    if(userId.length < 1){
        userId = 0;
    }
    
    $.ajax({
        url: '/user/' + userId + "/" + userName,
        type: "GET",
        async: false,
        success: function (response) {
            checkData = response;
            console.log("CHECK USER" , checkData);
        }
    });

    return checkData;

}

$("#sidebar-left").on('click', '#save-user-update', function (e) {

    e.preventDefault();

    $("#user_update_form").find("div.error").removeClass('error').addClass("noerror");
    $("#user_update_form").find("input.required").removeClass('required');

    var errCount = 0;
    var errMsgArray = [];

    var thisEmail = $("#email").val();

    if ($("#first_name").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'first_name',
            "msg": 'A User First Name must be entered'
        });
    }

    if ($("#last_name").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'last_name',
            "msg": 'A User Last Name must be entered'
        });
    }

    if ($("#email").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'email',
            "msg": 'A User Email Address must be entered'
        });
    } else if (!validateEmail(thisEmail)) {

        errCount++;
        errMsgArray.push({
            "id": 'email',
            "msg": 'A valid Email must be entered'
        });
    }

    if ($("#username").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'username',
            "msg": 'A Username must be entered'
        });
    
    } else {
        
        //CHECK THAT USERNAME IS UNIQUE

        console.log("CHECKING USERNAME______");

        var userId = $("#id").val();
        var username = $("#username").val()
        var existingUsername = checkUserName(userId,username);

        console.log("EXISTING: ", existingUsername);
        
        if (existingUsername > 0) {
            errCount++;
            errMsgArray.push({
                "id": 'username',
                "msg": 'Username entered already exists. Enter a different Username'
            });
        }
    }

    if ($("#id").val().length < 1) {
        
        if ($("#password").val().length < 1) {
            errCount++;
            errMsgArray.push({
                "id": 'password',
                "msg": 'A Password must be entered'
            });
        }

    }    

    if (errCount > 0) {

        console.log("ERRORS: ", errMsgArray);

        for (var e = 0; e < errMsgArray.length; e++) {

            var errorId = errMsgArray[e]['id'];
            var errorMsg = errMsgArray[e]['msg'];

            $("#" + errorId).addClass('required');
            $("#" + errorId + "_error").removeClass('noerror');
            $("#" + errorId + "_error").addClass('error');
            $("#" + errorId + "_error").html(errorMsg);

        }

    } else {

        var userId = $("#id").val();

        if (userId.length > 0) {
            var updateUrl = '/auth/update/' + userId;
            var successMsg = "User was successfully updated";
        } else {
            var updateUrl = '/auth/register';
            var successMsg = "User was successfully added";
            //var rdm = Math.floor((Math.random() * 1000000) + 1);
            //$("#skill_code").val(rdm);
        }

        var userForm = $("#user_update_form").serialize();

        $.ajax({
            url: updateUrl,
            type: "POST",
            data: {
                "form": userForm
            },
            success: function (response) {
                //console.log(response);

                alert(successMsg);
                viewUsers();
            }
        });
    }

});

function updateUser(userId) {

    $("#sidebar-left").html("");

    var userForm = '<div style="width:100%;padding:10px;border:0px solid blue;">';

    userForm += '<button id="sidebar-left-view-users" class="w3-button w3-darkblue w3-mobile w3-right w3-medium">Users</button>';

    userForm += '<div style="margin-top:60px;">';

    userForm += '<form id="user_update_form">';

    userForm += '<input type="hidden" id="id" name="id" value="">';

    userForm += '<div class="w3-row">';

    userForm += '<div id="first_name_display" class="w3-half" style="padding:10px 10px 10px 10px;">';
    userForm += '<label style="font-weight:bold;">First Name<span class="required-label"<span>*</span></label>';
    userForm += '<input name="first_name" id="first_name" class="w3-input w3-border input-display" type="text">';
    userForm += '<div id="first_name_error" class="noerror" ></div>';
    userForm += '</div>';

    userForm += '<div id="last_name_display" class="w3-half" style="padding:10px 10px 10px 10px;">';
    userForm += '<label style="font-weight:bold;">Last Name<span class="required-label"<span>*</span></label>';
    userForm += '<input name="last_name" id="last_name" class="w3-input w3-border input-display" type="text">';
    userForm += '<div id="last_name_error" class="noerror" ></div>';
    userForm += '</div>';

    userForm += '</div>';

    userForm += '<div class="w3-row">';
    
    userForm += '<div id="email_display" style="padding:10px 10px 10px 10px;">';
    userForm += '<label style="font-weight:bold;">Email<span class="required-label"<span>*</span></label>';
    userForm += '<input name="email" id="email" class="w3-input w3-border input-display" type="text">';
    userForm += '<div id="email_error" class="noerror" ></div>';
    userForm += '</div>';

    userForm += '</div>';

    userForm += '<div class="w3-row">';

    userForm += '<div id="username_display" class="w3-half" style="padding:15px 10px 10px 10px;">';
    userForm += '<label style="font-weight:bold;">Username<span class="required-label"<span>*</span></label>';
    userForm += '<input name="username" id="username" class="w3-input w3-border input-display" type="text">';
    userForm += '<div id="username_error" class="noerror" ></div>';
    userForm += '</div>';

    userForm += '<div id="password_display" style="padding:15px 10px 10px 10px;">';
    
    userForm += '<div class="w3-half" style="border:0px solid yellow;">';//cont
    userForm += '<label style="font-weight:bold;">Password<span class="required-label"<span>*</span></label>';
    userForm += '<input name="password" id="password" class="w3-input w3-border input-display" type="password" placeholder="********" onfocus="this.placeholder = \'\'" onblur="this.placeholder = \'********\'">';
    userForm += '</div>'
    userForm += '<div style="float:left;width:20px;margin:38px 0 0 -25px;border:0px solid green;">';
    userForm += '<i style="cursor:pointer;" id="togglePassword" class="far fa-eye"></i>';
    userForm += '</div>'

    userForm += '<div id="password_error" class="noerror"></div>';
    
    userForm += '</div>'
    
    userForm += '</div>';//row

    userForm += '</form>';

    userForm += '</div>';

    userForm += '<div class="w3-center" style="margin-top:10px;">';
    userForm += '<button id="cancel-user-update" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    userForm += '<button id="save-user-update" class="w3-button w3-darkblue w3-mobile w3-medium">Save</button>';
    userForm += '</div>';

    userForm += '</div>';

    $("#sidebar-left").append(userForm);

    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    if(userId.length > 0){
    
        $.ajax({
            url: '/users/' + userId,
            type: "GET",
            success: function (response) {

                var user = response; 
                console.log("USER: ", user); 
                for (var key in user) {
                    if(key != 'password'){
                        $("#" + key).val(user[key]);
                    }
                }
            }
        });

    }

    togglePassword.addEventListener('click', function (e) {
        // toggle the type attribute
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash');
    });

}


$("#sidebar-left").on('click', '[id^=edit_user_]', function (e) {

    e.preventDefault();

    var splitId = $(this).prop("id");
    var splitArray = splitId.split("_");
    var userId = splitArray[2]

    console.log("USERID:", userId);

    updateUser(userId);

});

function viewUsers() {

    var sbContUrl = "/users";

    console.log("URL:", sbContUrl);

    $("#sidebar-left").html("");

    var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    $("#sidebar-left").append(spinHtml);

    $.ajax({
        url: sbContUrl,
        type: "get"
    }).done(function (response) {

        console.log("USERS: ", response);

        var users = response;

        var userDisplay = '<div style="width:100%;padding:10px;border:0px solid blue;">';

        userDisplay += '<div class="w3-bar" style="margin-bottom:10px;">';

        userDisplay += '<div class="w3-right">';
        userDisplay += '<button id="sidebar-left-add-user" class="w3-button w3-darkblue w3-medium" style="margin-right:0px;">+</button>';
        userDisplay += '</div>';

        //userDisplay += '<div class="w3-right">';
        //userDisplay += '<button id="sidebar-left-view-employees" class="w3-button w3-darkblue w3-medium" style="margin-right:10px;">Employees</button>';
        //userDisplay += '</div>';

        userDisplay += '</div>';

        userDisplay += '<h4 style="margin:0 0 15px 0;">Users</h4>';

        if (users.length > 0) {

            userDisplay += '<ul class="w3-ul w3-card-4 w3-hoverable">';

            for (var u = 0; u < users.length; u++) {

                var userId = users[u]['id'];
                var firstName = users[u]['first_name'];
                var lastName = users[u]['last_name'];
                
                userDisplay += '<li class="w3-bar">';
                userDisplay += '<div id="edit_user_' + userId + '" class="w3-button w3-medium w3-darkblue w3-right">Edit</div>';
                userDisplay += '<img src="assets/img_avatar2.png" class="w3-circle w3-hide-small w3-left" style="width:85px;padding:0px;">';
                userDisplay += '<div class="w3-left">';
                userDisplay += '<span class="w3-large" style="padding-left:10px;"><span style="font-weight:bold;">' + lastName + '</span>, ' + firstName + '</span><br>';
                userDisplay += '</div>';
                userDisplay += '</li>'

            }

            userDisplay += '</ul>';
            userDisplay += '</div>';

            $("#sidebar-left").html("");
            $("#sidebar-left").append(userDisplay);
        } else {
            userDisplay += '<div style="margin:15px 0 0 15px;font-weight:bold;color:red;">No Skills Found</div>';
        }

        $("#sidebar-left").html("");
        $("#sidebar-left").append(userDisplay);
        

    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    });

}

function viewSettings() {

    //var sbContUrl = "/setings";

    //console.log("URL:", sbContUrl);

    $("#sidebar-left").html("");

    var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    $("#sidebar-left").append(spinHtml);

    var settingsDisplay = '<div style="width:100%;padding:10px;border:0px solid blue;">';

    settingsDisplay += '<div class="w3-bar" style="margin-bottom:10px;">';

    //settingsDisplay += '<div class="w3-right">';
    //settingsDisplay += '<button id="sidebar-left-add-employee" class="w3-button w3-darkblue w3-medium" style="margin-right:0px;">+</button>';
    //  settingsDisplay += '</div>';

    settingsDisplay += '<div class="w3-right">';
    settingsDisplay += '<button id="sidebar-left-view-users" class="w3-button w3-darkblue w3-medium" style="margin-right:10px;">Users</button>';
    settingsDisplay += '</div>';

    settingsDisplay += '</div>';

    $("#sidebar-left").html("");
    $("#sidebar-left").append(settingsDisplay);

    //VIEW SETTINGS
  
}

function employeeDisplay(employees){
    
    console.log("EMPL: ", employees);

    var employeeDisplay = '<div style="width:100%;padding:10px;border:0px solid blue;">';

    employeeDisplay += '<div class="w3-bar" style="margin-bottom:10px;">';

    employeeDisplay += '<div class="w3-left">';
    employeeDisplay += '<input name="employee-search" id="employee-search" class="w3-input w3-border input-display" style="width:250px;outline:none;" type="text" placeholder="Search Employees...">';
    employeeDisplay += '</div>';
    
    employeeDisplay += '<div class="w3-right">';
    employeeDisplay += '<button id="sidebar-left-add-employee" class="w3-button w3-darkblue w3-medium" style="margin-right:0px;">+</button>';
    employeeDisplay += '</div>';

    employeeDisplay += '<div class="w3-right">';
    employeeDisplay += '<button id="sidebar-left-view-skills" class="w3-button w3-darkblue w3-medium" style="margin-right:10px;">Skills</button>';
    employeeDisplay += '</div>';

    employeeDisplay += '</div>';

    employeeDisplay += '<h4 style="margin:0 0 15px 0;">Employees</h4>';

    employeeDisplay += '<ul class="w3-ul w3-card-4 w3-hoverable">';

    for (var e = 0; e < employees.length; e++) {

        var empId = employees[e]['emp_id'];
        var firstName = employees[e]['first_name'];
        var lastName = employees[e]['last_name'];
        var tradeType = employees[e]['emp_trade_description'];

        //var tradeTypeObject = JSON.parse(tradeType);
        //console.log("TT: ", tradeTypeObject);   

        employeeDisplay += '<li class="w3-bar">';
        employeeDisplay += '<div id="edit_employee_' + empId + '" class="w3-button w3-medium w3-darkblue w3-right">Edit</div>';
        employeeDisplay += '<img src="assets/img_avatar2.png" class="w3-circle w3-hide-small w3-left" style="width:85px;padding:0px;">';
        employeeDisplay += '<div class="w3-left" style="width:250px;">';
        employeeDisplay += '<span class="w3-large" style="padding-left:10px;"><span style="font-weight:bold;">' + lastName + ', ' + firstName + '</span><br>';
        employeeDisplay += '<span style="display:inline-block;word-wrap:break-word;text-indent:0px;padding-left:10px;font-style:italic;">(' + tradeType + ')</span>';
        employeeDisplay += '</div>';
        employeeDisplay += '</li>'

    }

    employeeDisplay += '</ul>';
    employeeDisplay += '</div>';

    $("#sidebar-left").html("");
    $("#sidebar-left").append(employeeDisplay);

}

function getEmployeeByName(employeeName){

    $.ajax({
        url: 'empdets/' + employeeName,
        type: "GET"
    }).done(function (response) {

        var employees = response;

        employeeDisplay(employees);

    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    });

}

$('#employee-search').attr('autocomplete','on');

$('body').on('click', '#employee-search', function() {

    $(this).autocomplete({
        source: function(request, response) {
            $.ajax({
                url: 'employees/auto/' + request.term,
                type: "GET",
                dataType: "json",
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
            //console.log("UI: ", ui.item.value);
            getEmployeeByName(ui.item.value);
        }
    });
});

/* function selectByJob(job){

    var entity = $("#entity").val();
    var the_url = "job_details_mb.php?source=access&entity=" + entity + "&job_num=" +job;

    window.location.replace(the_url);
} */

function employeeDisplay(employees){
    
    console.log("EMPL: ", employees);

    var employeeDisplay = '<div style="width:100%;padding:10px;border:0px solid blue;">';

    employeeDisplay += '<div class="w3-bar" style="margin-bottom:10px;">';

    employeeDisplay += '<div class="w3-left">';
    employeeDisplay += '<input name="employee-search" id="employee-search" class="w3-input w3-border input-display" style="width:245px;outline:none;" type="text" placeholder="Search by Last Name...">';
    employeeDisplay += '</div>';
    
    employeeDisplay += '<div class="w3-right">';
    employeeDisplay += '<button id="sidebar-left-add-employee" class="w3-button w3-darkblue w3-medium" style="margin-right:0px;">+</button>';
    employeeDisplay += '</div>';

    employeeDisplay += '<div class="w3-right">';
    employeeDisplay += '<button id="sidebar-left-view-skills" class="w3-button w3-darkblue w3-medium" style="margin-right:10px;">Skills</button>';
    employeeDisplay += '</div>';

    employeeDisplay += '<div class="w3-right">';
    employeeDisplay += '<button id="sidebar-left-view-trades" class="w3-button w3-darkblue w3-medium" style="margin-right:10px;">Trades</button>';
    employeeDisplay += '</div>';

    employeeDisplay += '</div>';

    employeeDisplay += '<h4 style="margin:0 0 15px 0;">Employees</h4>';

    employeeDisplay += '<ul class="w3-ul w3-card-4 w3-hoverable">';

    for (var e = 0; e < employees.length; e++) {

        var empId = employees[e]['emp_id'];
        var firstName = employees[e]['first_name'];
        var lastName = employees[e]['last_name'];
        var tradeType = employees[e]['emp_trade_description'];

        //var tradeTypeObject = JSON.parse(tradeType);
        //console.log("TT: ", tradeTypeObject);   

        employeeDisplay += '<li class="w3-bar">';
        employeeDisplay += '<div id="edit_employee_' + empId + '" class="w3-button w3-medium w3-darkblue w3-right">Edit</div>';
        employeeDisplay += '<img src="assets/img_avatar2.png" class="w3-circle w3-hide-small w3-left" style="width:85px;padding:0px;">';
        employeeDisplay += '<div class="w3-left" style="width:250px;">';
        employeeDisplay += '<span class="w3-large" style="padding-left:10px;"><span style="font-weight:bold;">' + lastName + ', ' + firstName + '</span><br>';
        employeeDisplay += '<span style="display:inline-block;word-wrap:break-word;text-indent:0px;padding-left:10px;font-style:italic;">(' + tradeType + ')</span>';
        employeeDisplay += '</div>';
        employeeDisplay += '</li>'

    }

    employeeDisplay += '</ul>';
    employeeDisplay += '</div>';

    $("#sidebar-left").html("");
    $("#sidebar-left").append(employeeDisplay);

}

function viewEmployees() {

    var sbContUrl = "/employees";

    console.log("URL:", sbContUrl);

    $("#sidebar-left").html("");

    var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    $("#sidebar-left").append(spinHtml);

    $.ajax({
        url: sbContUrl,
        type: "GET"
    }).done(function (response) {

        var employees = response;

        employeeDisplay(employees);

    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    });

}

function viewTrades() {

    var sbContUrl = "/trades";

    console.log("URL:", sbContUrl);

    $("#sidebar-left").html("");

    var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    $("#sidebar-left").append(spinHtml);

    $.ajax({
        url: sbContUrl,
        type: "get"
    }).done(function (response) {

        console.log("TRADES: ", response);

        var trades = response;

        var tradeDisplay = '<div style="width:100%;padding:10px;border:0px solid blue;">';

        tradeDisplay += '<div class="w3-bar" style="margin-bottom:10px;">';

        tradeDisplay += '<div class="w3-right">';
        tradeDisplay += '<button id="sidebar-left-add-trade" class="w3-button w3-darkblue w3-medium" style="margin-right:0px;">+</button>';
        tradeDisplay += '</div>';

        tradeDisplay += '<div class="w3-right">';
        tradeDisplay += '<button id="sidebar-left-view-employees" class="w3-button w3-darkblue w3-medium" style="margin-right:10px;">Employees</button>';
        tradeDisplay += '</div>';

        tradeDisplay += '</div>';

        tradeDisplay += '<h4 style="margin:0 0 15px 0;">Trades</h4>';

        if (trades.length > 0) {

            tradeDisplay += '<ul class="w3-ul w3-card-4 w3-hoverable">';

            for (var s = 0; s < trades.length; s++) {

                var tradeId = trades[s]['trade_id'];
                var tradeDesc = trades[s]['trade_desc'];
                var tradeCode = trades[s]['trade_code'];
                var tradeStatus = trades[s]['trade_status'];

                if(tradeStatus == 'X'){
                    var tradeBg = 'lightpink';
                } else {
                    var tradeBg = '#FFFFFF';
                }

                tradeDisplay += '<li class="w3-bar" style="background-color:' + tradeBg + '">';
                tradeDisplay += '<div id="edit_trade_' + tradeId + '" class="w3-button w3-medium w3-darkblue w3-right">Edit</div>';
                tradeDisplay += '<div class="w3-left">';
                tradeDisplay += '<span class="w3-large">' + tradeDesc + '</span><br>';
                //tradeDisplay += '<span>' + tradeCode + '</span>';
                tradeDisplay += '</div>';
                tradeDisplay += '</li>'

            }

            tradeDisplay += '</ul>';
            tradeDisplay += '</div>';
        } else {
            tradeDisplay += '<div style="margin:15px 0 0 15px;font-weight:bold;color:red;">No Trades Found</div>';
        }

        $("#sidebar-left").html("");
        $("#sidebar-left").append(tradeDisplay);

    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    });

}

function viewSkills() {

    var sbContUrl = "/skills";

    console.log("URL:", sbContUrl);

    $("#sidebar-left").html("");

    var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    $("#sidebar-left").append(spinHtml);

    $.ajax({
        url: sbContUrl,
        type: "get"
    }).done(function (response) {

        console.log("SKILLS: ", response);

        var skills = response;

        var skillDisplay = '<div style="width:100%;padding:10px;border:0px solid blue;">';

        skillDisplay += '<div class="w3-bar" style="margin-bottom:10px;">';

        skillDisplay += '<div class="w3-right">';
        skillDisplay += '<button id="sidebar-left-add-skill" class="w3-button w3-darkblue w3-medium" style="margin-right:0px;">+</button>';
        skillDisplay += '</div>';

        skillDisplay += '<div class="w3-right">';
        skillDisplay += '<button id="sidebar-left-view-employees" class="w3-button w3-darkblue w3-medium" style="margin-right:10px;">Employees</button>';
        skillDisplay += '</div>';

        skillDisplay += '</div>';

        skillDisplay += '<h4 style="margin:0 0 15px 0;">Skills</h4>';

        if (skills.length > 0) {

            skillDisplay += '<ul class="w3-ul w3-card-4 w3-hoverable">';

            for (var s = 0; s < skills.length; s++) {

                var skillId = skills[s]['skill_id'];
                var skillDesc = skills[s]['skill_desc'];
                var skillCode = skills[s]['skill_code'];

                skillDisplay += '<li class="w3-bar">';
                skillDisplay += '<div id="edit_skill_' + skillId + '" class="w3-button w3-medium w3-darkblue w3-right">Edit</div>';
                skillDisplay += '<div class="w3-left">';
                skillDisplay += '<span class="w3-large">' + skillDesc + '</span><br>';
                skillDisplay += '<span>' + skillCode + '</span>';
                skillDisplay += '</div>';
                skillDisplay += '</li>'

            }

            skillDisplay += '</ul>';
            skillDisplay += '</div>';
        } else {
            skillDisplay += '<div style="margin:15px 0 0 15px;font-weight:bold;color:red;">No Skills Found</div>';
        }

        $("#sidebar-left").html("");
        $("#sidebar-left").append(skillDisplay);

    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    });

}

//CUSTOMERS

$("#sidebar-left").on('click', '#sidebar-left-view-customers', function (e) {

    e.preventDefault();

    viewCustomers();
});

$("#sidebar-left").on('click', '[id^=save-customer-site-update]', function (e) {

    e.preventDefault();

    var splitId = $(this).prop("id");

    console.log("SITE SPLIT: ",splitId);

    var splitArray = splitId.split("-");
    var custId = splitArray[5];

    console.log("CUST SITE: ", custId);

    e.preventDefault();

    $("#customer_site_update_form").find("div.error").removeClass('error').addClass("noerror");
    $("#customer_site_update_form").find("input.required").removeClass('required');

    var errCount = 0;
    var errMsgArray = [];

    if ($("#site_desc").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'site_desc',
            "msg": 'Site Description can\'t be empty'
        });
    }

    if ($("#site_short_desc").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'site_short_desc',
            "msg": 'Short Description can\'t be empty'
        });
    }

    if (errCount > 0) {

        console.log("SITE ERRORS: ", errMsgArray);

        for (var e = 0; e < errMsgArray.length; e++) {

            var errorId = errMsgArray[e]['id'];
            var errorMsg = errMsgArray[e]['msg'];

            $("#" + errorId).addClass('required');
            $("#" + errorId + "_error").removeClass('noerror');
            $("#" + errorId + "_error").addClass('error');
            $("#" + errorId + "_error").html(errorMsg);

        }

    } else {

        //console.log("EMP FORM: ", employeeForm);

        var siteId = $("#site_id").val();

        if (siteId.length > 0) {
            var updateUrl = '/customer/site/' + custId;
            var successMsg = "Customer Site was successfully updated";
            //var custId = $("#cust_id").val();
        } else {
            var updateUrl = '/customer/site/add';
            var successMsg = "Customer Site was successfully added";
            var rdm = Math.floor((Math.random() * 1000000) + 1);
            $("#site_code").val(rdm);
        }

        var customerSiteForm = $("#customer_site_update_form").serialize();

        $.ajax({
            url: updateUrl,
            type: "POST",
            data: {
                "form": customerSiteForm
            },
            success: function (response) {
                console.log(response);

                alert(successMsg);
                viewCustomerSites(custId);
            }
        });
    }

});

function updateCustomerSite(siteId, custId) {

    $("#sidebar-left").html("");

    var customerSiteForm = '<div style="width:100%;padding:10px;border:0px solid blue;">';

    customerSiteForm += '<button id="sidebar-left-view-customer-' + custId + '" class="w3-button w3-darkblue w3-mobile w3-right w3-medium">Customer</button>';
    
    customerSiteForm += '<div style="margin-top:60px;">';

    if(siteId.length > 0){
        customerSiteForm += '<h4 style="margin:0 0 0 10px;">Edit Customer Site</h4>';
    } else {
        customerSiteForm += '<h4 style="margin:0 0 0 10px;">Add Customer Site</h4>';
    }

    customerSiteForm += '<form id="customer_site_update_form">';

    customerSiteForm += '<input type="hidden" id="site_id" name="site_id" value="">';
    customerSiteForm += '<input type="hidden" id="site_code" name="site_code" value="">';
    customerSiteForm += '<input type="hidden" id="site_customer" name="site_customer" value="' + custId + '">';

    customerSiteForm += '<div class="w3-row">'

    customerSiteForm += '<div id="site_desc_display" class="w3-half" style="padding:10px 10px 10px 10px;">';
    customerSiteForm += '<label style="font-weight:bold;">Site Description<span class="required-label"<span>*</span></label>';
    customerSiteForm += '<input name="site_desc" id="site_desc" class="w3-input w3-border input-display" type="text">';
    customerSiteForm += '<div id="site_desc_error" class="noerror" ></div>';
    customerSiteForm += '</div>';

    customerSiteForm += '<div id="site_short_desc_display" class="w3-third" style="padding:10px 10px 10px 10px;">';
    customerSiteForm += '<label style="font-weight:bold;">Short Description<span class="required-label"<span>*</span></label>';
    customerSiteForm += '<input name="site_short_desc" id="site_short_desc" class="w3-input w3-border input-display" type="text">';
    customerSiteForm += '<div id="site_short_desc_error" class="noerror" ></div>';
    customerSiteForm += '</div>';

    customerSiteForm += '</div>';

    customerSiteForm += '</form>';

    customerSiteForm += '</div>';

    customerSiteForm += '<div class="w3-center" style="margin-top:10px;">';
    customerSiteForm += '<button id="cancel-customer-site-update-' + custId + '" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    customerSiteForm += '<button id="save-customer-site-update-' + siteId + '-' + custId + '" class="w3-button w3-darkblue w3-mobile w3-medium">Save</button>';

    customerSiteForm += '</div>';

    customerSiteForm += '</div>';

    $("#sidebar-left").append(customerSiteForm);


    if (siteId.length > 0) {

        $.ajax({
            url: '/customer/site/edit/' + siteId,
            type: "GET",
            success: function (response) {

                console.log("FETCH SITE: ", response);

                var site = response;

                for (var key in site) {

                    $("#" + key).val(site[key]);

                }
            }
        });
    }

}

$("#sidebar-left").on('click', '[id^=cancel-customer-site-update]', function (e) {

    e.preventDefault();

    var splitId = $(this).prop("id");
    var splitArray = splitId.split("-");
    var custId = splitArray[4];

    viewCustomerSites(custId);
});

$("#sidebar-left").on('click', '[id^=sidebar-left-add-site]', function (e) {

    e.preventDefault();

    var splitId = $(this).prop("id");
    var splitArray = splitId.split("-");
    var custId = splitArray[4];
    var siteId = '';

    updateCustomerSite(siteId, custId);

});

$("#sidebar-left").on('click', '[id^=customer-site-edit]', function (e) {

    e.preventDefault();

    var splitId = $(this).prop("id");
    var splitArray = splitId.split("-");
    var siteId = splitArray[3];
    var custId = splitArray[4];

    updateCustomerSite(siteId, custId);

});

$("#sidebar-left").on('click', '[id^=sidebar-left-view-customer]', function (e) {

    e.preventDefault();

    var splitId = $(this).prop("id");
    var splitArray = splitId.split("-");
    var custId = splitArray[4]

    updateCustomer(custId);

});

function viewCustomerSites(custId) {

    console.log("SITES HERE");

    var sbContUrl = "/customer/sites/" + custId;

    console.log("URL:", sbContUrl);

    $("#sidebar-left").html("");

    var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    $("#sidebar-left").append(spinHtml);

     $.ajax({
         url: sbContUrl,
         type: "get"
     }).done(function (response) {

         console.log("SITES: ", response);

         var sites = response;

         var customerSitesDisplay = '<div style="width:100%;padding:10px;border:0px solid blue;">';

         customerSitesDisplay += '<div class="w3-bar" style="margin-bottom:10px;">';

         customerSitesDisplay += '<div class="w3-right">';
         customerSitesDisplay += '<button id="sidebar-left-add-site-' + custId + '" class="w3-button w3-darkblue w3-medium" style="margin-right:0px;">+</button>';
         customerSitesDisplay += '</div>';

         customerSitesDisplay += '<div class="w3-right">';
         customerSitesDisplay += '<button id="sidebar-left-view-customer-' + custId + '" class="w3-button w3-darkblue w3-medium" style="margin-right:10px;">Customer</button>';
         customerSitesDisplay += '</div>';

         customerSitesDisplay += '</div>';

         customerSitesDisplay += '<h4 style="margin:0 0 15px 0;">Customer Sites</h4>';

         if(sites.length > 0) {

             customerSitesDisplay += '<ul class="w3-ul w3-card-4 w3-hoverable">';

             for (var s = 0; s < sites.length; s++) {

                 var siteDesc = sites[s]['site_desc'];
                 var siteShortDesc = sites[s]['site_short_desc'];
                 var siteCode = sites[s]['site_code'];

                 customerSitesDisplay += '<li class="w3-bar">';
                 customerSitesDisplay += '<div id="customer-site-edit-' + siteCode + '-' + custId + '" class="w3-button w3-medium w3-darkblue w3-right">Edit</div>';
                 customerSitesDisplay += '<div class="w3-left">';
                 customerSitesDisplay += '<span class="w3-large">' + siteDesc + '</span><br>';
                 customerSitesDisplay += '<span>' + siteShortDesc + '</span>';
                 customerSitesDisplay += '</div>';
                 customerSitesDisplay += '</li>'
             }

             customerSitesDisplay += '</ul>';
             customerSitesDisplay += '</div>';

         } else {
            customerSitesDisplay += '<div style="margin:15px 0 0 15px;font-weight:bold;color:red;">No Customer Sites Found</div>';
         }

         $("#sidebar-left").html("");
         $("#sidebar-left").append(customerSitesDisplay);

     }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
     });

}

$("#sidebar-left").on('click', '[id^=customer_sites]', function (e) {

    e.preventDefault();

    var splitId = $(this).prop("id");
    var splitArray = splitId.split("_");
    var custId = splitArray[2]

    console.log("CUSTIDXX:", custId);

    viewCustomerSites(custId);

});

$("#sidebar-left").on('click', '#sidebar-left-add-customer', function (e) {

    e.preventDefault();

    updateCustomer("");

});

$("#sidebar-left").on('click', '[id^=edit_customer_]', function (e) {

    e.preventDefault();

    var splitId = $(this).prop("id");
    var splitArray = splitId.split("_");
    var custId = splitArray[2]

    console.log("CUSTID:", custId);

    updateCustomer(custId);

});

$("#sidebar-left").on('click', '#cancel-customer-update', function (e) {

    e.preventDefault();

    viewCustomers();
});

$("#sidebar-left").on('click', '#save-customer-update', function (e) {

    e.preventDefault();

    $("#customer_update_form").find("div.error").removeClass('error').addClass("noerror");
    $("#customer_update_form").find("input.required").removeClass('required');

    var errCount = 0;
    var errMsgArray = [];

    if ($("#cust_name").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'cust_name',
            "msg": 'Customer Name can\'t be empty'
        });
    }

    if ($("#cust_type").val().length < 1) {
        errCount++;
        errMsgArray.push({
            "id": 'cust_type',
            "msg": 'Customer Type can\'t be empty'
        });
    }

    if (errCount > 0) {

        console.log("CUST ERRORS: ", errMsgArray);

        for (var e = 0; e < errMsgArray.length; e++) {

            var errorId = errMsgArray[e]['id'];
            var errorMsg = errMsgArray[e]['msg'];

            $("#" + errorId).addClass('required');
            $("#" + errorId + "_error").removeClass('noerror');
            $("#" + errorId + "_error").addClass('error');
            $("#" + errorId + "_error").html(errorMsg);

        }

    } else {

        //console.log("EMP FORM: ", employeeForm);

        var custId = $("#cust_id").val();

        if (custId.length > 0) {
            var updateUrl = '/customer/' + custId;
            var successMsg = "Customer was successfully updated";
            var custId = $("#cust_id").val();
        } else {
            var updateUrl = '/customer';
            var successMsg = "Customer was successfully added";
            var rdm = Math.floor((Math.random() * 1000000) + 1);
            $("#cust_id").val(rdm);
        }

        var customerForm = $("#customer_update_form").serialize();

        $.ajax({
            url: updateUrl,
            type: "POST",
            data: {
                "form": customerForm
            },
            success: function (response) {
                //console.log(response);

                alert(successMsg);
                viewCustomers();
            }
        });
    }

});

function updateCustomer(custId) {

    $("#sidebar-left").html("");

    var customerForm = '<div style="width:100%;padding:10px;border:0px solid blue;">';

    customerForm += '<button id="sidebar-left-view-customers" class="w3-button w3-darkblue w3-mobile w3-right w3-medium">Customers</button>';

    if(custId.length > 0){
        customerForm += '<div id="customer_sites_' + custId + '" class="w3-button w3-medium w3-darkblue w3-right" style="margin-right:10px;">Sites</div>';

    }

    customerForm += '<div style="margin-top:60px;">';

    if(custId.length > 0) {
        customerForm += '<h4 style="margin:0 0 0 10px;">Edit Customer</h4>';
    } else{
        customerForm += '<h4 style="margin:0 0 0 10px;">Add Customer</h4>';
    }

    customerForm += '<form id="customer_update_form">';

    customerForm += '<input type="hidden" id="cust_id" name="cust_id" value="">';

    customerForm += '<div class="w3-row">'

    customerForm += '<div id="cust_name_display" class="w3-half" style="padding:10px 10px 10px 10px;">';
    customerForm += '<label style="font-weight:bold;">Customer Name<span class="required-label"<span>*</span></label>';
    customerForm += '<input name="cust_name" id="cust_name" class="w3-input w3-border input-display" type="text">';
    customerForm += '<div id="cust_name_error" class="noerror" ></div>';
    customerForm += '</div>';

    customerForm += '<div id="cust_type_display" class="w3-half" style="padding:10px 10px 10px 10px;">';
    customerForm += '<label style="font-weight:bold;">Customer Type<span class="required-label"<span>*</span></label>';
    customerForm += '<input name="cust_type" id="cust_type" class="w3-input w3-border input-display" type="text">';
    customerForm += '<div id="cust_type_error" class="noerror" ></div>';
    customerForm += '</div>';

    customerForm += '</div>';

    customerForm += '</form>';

    customerForm += '</div>';

    customerForm += '<div class="w3-center" style="margin-top:10px;">';
    customerForm += '<button id="cancel-customer-update" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    customerForm += '<button id="save-customer-update" class="w3-button w3-darkblue w3-mobile w3-medium">Save</button>';

    customerForm += '</div>';

    customerForm += '</div>';

    $("#sidebar-left").append(customerForm);

    if (custId.length > 0) {

        $.ajax({
            url: '/customer/' + custId,
            type: "GET",
            success: function (response) {

                //console.log("EMP: ", response);

                var customer = response;

                for (var key in customer) {

                    $("#" + key).val(customer[key]);

                }
            }
        });
    }
}

/* $("#sidebar-left").on('click', '#sidebar-left-add-skill', function (e) {

    e.preventDefault();

    updateSkill("");

});
 */
$("#sidebar-left").on('click', '[id^=edit_skill_]', function (e) {

    e.preventDefault();

    var splitId = $(this).prop("id");
    var splitArray = splitId.split("_");
    var skillId = splitArray[2]

    console.log("SKILLID:", skillId);

    updateSkill(skillId);

});

function viewCustomers() {

    var sbContUrl = "/customers";

    console.log("URL:", sbContUrl);

    $("#sidebar-left").html("");

    var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    $("#sidebar-left").append(spinHtml);

    $.ajax({
        url: sbContUrl,
        type: "get"
    }).done(function (response) {

        console.log("CUST: ", response);

        var customers = response;

        var customerDisplay = '<div style="width:100%;padding:10px;border:0px solid blue;">';

        customerDisplay += '<div class="w3-bar" style="margin-bottom:10px;">';

        customerDisplay += '<div class="w3-right">';
        customerDisplay += '<button id="sidebar-left-add-customer" class="w3-button w3-darkblue w3-medium">+</button>';
        customerDisplay += '</div>';

        customerDisplay += '</div>';

        customerDisplay += '<h4 style="margin:0 0 15px 0;">Customers</h4>';

        if (customers.length > 0) {

            customerDisplay += '<ul class="w3-ul w3-card-4 w3-hoverable">';

            for (var c = 0; c < customers.length; c++) {

                var custId = customers[c]['cust_id'];
                var custName = customers[c]['cust_name'];
                var custType = customers[c]['cust_type'];

                customerDisplay += '<li class="w3-bar">';
                //customerDisplay += '<div id="customer_sites_' + custId + '" class="w3-button w3-medium w3-darkblue w3-right">Sites</div>';

                customerDisplay += '<div id="edit_customer_' + custId + '" class="w3-button w3-medium w3-darkblue w3-right" style="margin-right:10px;">Edit</div>';
                //customerDisplay += '<img src="assets/img_avatar2.png" class="w3-circle w3-hide-small w3-left" style="width:85px;padding:0px;">';
                customerDisplay += '<div class="w3-left">';
                customerDisplay += '<span class="w3-large" style="padding-left:10px;">' + custName + '</span><br>';
                customerDisplay += '<span style="padding-left:10px;">' + custType + '</span>';
                customerDisplay += '</div>';
                customerDisplay += '</li>'

            }

            customerDisplay += '</ul>';
            customerDisplay += '</div>';

        } else {
            customerDisplay += '<div style="margin:15px 0 0 15px;font-weight:bold;color:red;">No Customers Found</div>';
        }

        $("#sidebar-left").html("");
        $("#sidebar-left").append(customerDisplay);

    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    });
}

function setSidebarContent(currentSidebar) {

    $("#sidebar-left").html("");

    /* if (currentSidebar == 1) {
        var sbCont = "<div>Workspace</div>";
        $("#sidebar-left").append(sbCont); */

    if (currentSidebar == 1) {    
        viewNotifications();
    } else if (currentSidebar == 2) {
        viewEmployees();
    } else if (currentSidebar == 3) {
        viewCustomers();    
    } else if (currentSidebar == 4) {
        viewSettings();    
    } 
}

$("[id^=toggle-sidebar]").click(function (e) {

    e.preventDefault();

    var thisId = $(this).prop('id');
    var sidebarContent = thisId.split('-').pop();
    var currentSidebar = localStorage.getItem('left-side-bar-content');
    console.log("CSB___",currentSidebar);
    var isClose = document.getElementById("sidebar-left").style.width === "500px";

    if (!isClose) {

        $("#sidebar-left").css({"width": "500px"});
        setSidebarContent(sidebarContent)

    } else {

        if (currentSidebar != sidebarContent) {
            setSidebarContent(sidebarContent)
        } else {
            $("#sidebar-left").css({"width": "0px"});
            localStorage.removeItem('left-side-bar-content');
        }

    }

    $("[id^=toggle-sidebar]").each(function (idx) {
        $("div").removeClass('w3-white');
    });

    $("#" + thisId).addClass("w3-white");

    localStorage.setItem('left-side-bar-content', sidebarContent);

});

$("#sidebar-right").on('click', '#sidebar-right-close', function (e) {

    e.preventDefault();

    $("#sidebar-right").html("");
    $("#sidebar-right").css({"width": "0px"});

});