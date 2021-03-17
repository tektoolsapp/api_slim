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

    var skillsSelected = [];

    $('#employee_update_form input:checkbox:checked').each(function () {
        console.log("CB:" + $(this).val());
        skillsSelected.push($(this).val());
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

    console.log("TRADE: ", $("#trade_type").val());

    if ($("#trade_type").val() == '') {
        errCount++;
        errMsgArray.push({
            "id": 'trade_type',
            "msg": 'A Trade Type must be selected'
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

        var employeeForm = $($("#employee_update_form")[0].elements).not(".skill").serialize();

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

$("#sidebar-left").on('click', '#sidebar-left-add-skill', function (e) {

    e.preventDefault();

    updateSkill("");

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

function updateEmployee(empId) {

    $("#sidebar-left").html("");

    var employeeForm = '<div style="width:100%;padding:10px;border:0px solid blue;">';

    employeeForm += '<button id="sidebar-left-view-employees" class="w3-button w3-darkblue w3-mobile w3-right w3-medium">Employees</button>';

    employeeForm += '<div style="margin-top:60px;">';

    employeeForm += '<form id="employee_update_form">';

    employeeForm += '<input type="hidden" id="emp_id" name="emp_id" value="">';
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
    employeeForm += '<label style="font-weight:bold;">Birth date<span class="required-label"<span>*</span></label>';
    employeeForm += '<input name="birth_date" id="birth_date" class="w3-input w3-border datepicker-year input-display" type="text">';
    employeeForm += '<div id="birth_date_error" class="noerror" ></div>';
    employeeForm += '</div>';
    
    employeeForm += '<div id="emp_pin_display" class="w3-half" style="padding:15px 10px 10px 10px;">';
    employeeForm += '<label style="font-weight:bold;">PIN</label>';
    employeeForm += '<input name="emp_pin" id="emp_pin" class="w3-input w3-border input-display" type="text">';
    employeeForm += '</div>';

    employeeForm += '</div>';

    employeeForm += '<div class="w3-row" style="margin:10px 0 0 0;">';
    
    employeeForm += '<div class="w3-half" style="padding:10px 10px 10px 10px;">';
    employeeForm += '<label>Trade Type<span class="required-label"<span>*</span></label>';
    employeeForm += '<select name="trade_type" id="trade_type" class="w3-select w3-border input-display"></select>';
    employeeForm += '<div id="trade_type_error" class="noerror" ></div>';
    employeeForm += '</div>';

    employeeForm += '</div>';
    
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

                if (key == 'emp_skills' && employee[key].length > 0) {

                    var empSkillsArray = JSON.parse(employee[key]);

                    for (var s = 0; s < empSkillsArray.length; s++) {

                        var skillCode = empSkillsArray[s];
                        var skillId = 'skill_' + skillCode;

                        $("#" + skillId).prop("checked", true);
                    }

                    $("#" + key).val(employee[key]);
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

$("body").on('click', '#fcm-send', function (e) {

    e.preventDefault();

    alert(" SEND");

    /* $.ajax({
        url: '/fcm/send',
        type: "POST",
        //data: {
          //  "form": notificationForm
        //},
        success: function (response) {
            console.log(response);

            //alert(successMsg);
            //viewEmployees();
        }
    }); */

    var title = "My Title";
    var body = "Message body";

    $.ajax({
        type: 'POST',
        url: "https://fcm.googleapis.com/fcm/send",
        headers: {
            Authorization: 'key=AAAAYvL6Qlo:APA91bFpdngfedK164jvGmhxD9a0oU3yGADshblqNIWkd_OB0VqsYo7-Kf32H5jmG7Td8rEx4ZwfLoY1sULR2GUcclfBEsBM07YBUP1qa1Uonm6s6e3d78HROtSPf_I2XI72Wvse8UMi'
        },
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "to": "fM_sOUjDokv_gSN4M2DjQl:APA91bHvUnRMbJpJRGeQQbewQtb2HTRRse6Gz_IdwoQkMQXpQ6csDk-yX7Nvn6dmpnhhhyhW-EoAT3dQbBShvefHHgiYoUknGgdgWMDbteZ_g34KcNPCt5tYLxHbVVzdVcdlrpaWffe3",
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

    e.preventDefault();

    $("#notifications_form").find("div.error").removeClass('error').addClass("noerror");
    $("#notifications_form").find("input.required").removeClass('required');

    /* var myInputs = $('#employee_update_form :input');

    var values = {};
    myInputs.each(function() {
        values[this.name] = $(this).val();
    }); */

    //console.log("VALUES: ", values);

    var values = {};
    $.each($('#notification_form').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    console.log("VALUES: ", values);

    var errCount = 0;
    var errMsgArray = [];

    /* var skillsSelected = [];

    $('#notifications_form input:checkbox:checked').each(function () {
        console.log("CB:" + $(this).val());
        skillsSelected.push($(this).val());
    }); */

    //console.log("SK: ", $("#skill_811025").prop('checked'));

    //var skillsArray = JSON.stringify(skillsSelected);

    /* console.log("SS: " + skillsSelected);
    console.log("SKILLS: " + skillsArray);

    $("#emp_skills").val(skillsArray); */

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

        //var notificationsForm = $($("#notifications_form")[0].elements).not(".skill").serialize();

        //console.log("EMP FORM: ", employeeForm);

        //var empId = $("#emp_id").val();

        /* if (empId.length > 0) {
            var updateUrl = '/employee/' + empId;
            var successMsg = "Employee was successfully updated";
        } else {
            var updateUrl = '/employee';
            var successMsg = "Employee was successfully added";
        } */

        var notificationForm = $("#notification_form").serialize();

        $.ajax({
            url: '/fcm/add',
            type: "POST",
            data: {
                "form": notificationForm
            },
            success: function (response) {
                console.log(response);

                //alert(successMsg);
                //viewEmployees();
            }
        });
    }

});

$("#sidebar-left").on('click', '#cancel-notification-send', function (e) {

    e.preventDefault();

    viewSkills();
});

function viewNotifications() {

    //var sbContUrl = "/notifications";

    //console.log("URL:", sbContUrl);

    $("#sidebar-left").html("");

    /* var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    $("#sidebar-left").append(spinHtml); */
    ///
    $("#sidebar-left").html("");

    var notificationForm = '<div style="width:100%;padding:10px;border:0px solid blue;">';
    
    notificationForm += '<h4 style="margin:10px 0 0 10px;">Send a Message</h4>';

    notificationForm += '<form id="notification_form">';

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

    notificationForm += '<div class="w3-center" style="margin-top:10px;">';
    notificationForm += '<button id="send-notification" class="w3-button w3-darkblue w3-mobile w3-medium">Send Message</button>';
    notificationForm += '</div>';

    notificationForm += '</div>';

    $("#sidebar-left").append(notificationForm);

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
        }
    });
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
        type: "get"
    }).done(function (response) {

        console.log("EMPL: ", response);

        var employees = response;

        var employeeDisplay = '<div style="width:100%;padding:10px;border:0px solid blue;">';

        employeeDisplay += '<div class="w3-bar" style="margin-bottom:10px;">';

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
            var firstName = employees[e]['birth_date'];
            var lastName = employees[e]['last_name'];
            var tradeType = employees[e]['trade_type'];

            employeeDisplay += '<li class="w3-bar">';
            employeeDisplay += '<div id="edit_employee_' + empId + '" class="w3-button w3-medium w3-darkblue w3-right">Edit</div>';
            employeeDisplay += '<img src="assets/img_avatar2.png" class="w3-circle w3-hide-small w3-left" style="width:85px;padding:0px;">';
            employeeDisplay += '<div class="w3-left">';
            employeeDisplay += '<span class="w3-large" style="padding-left:10px;">' + firstName + " " + lastName + '</span><br>';
            employeeDisplay += '<span style="padding-left:10px;">' + tradeType + '</span>';
            employeeDisplay += '</div>';
            employeeDisplay += '</li>'

        }

        employeeDisplay += '</ul>';
        employeeDisplay += '</div>';

        $("#sidebar-left").html("");
        $("#sidebar-left").append(employeeDisplay);

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

$("#sidebar-left").on('click', '#sidebar-left-add-skill', function (e) {

    e.preventDefault();

    updateSkill("");

});

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
    } else {
        viewCustomers();
    }
}

$("[id^=toggle-sidebar]").click(function (e) {

    e.preventDefault();

    var thisId = $(this).prop('id');
    var sidebarContent = thisId.split('-').pop();
    var currentSidebar = localStorage.getItem('left-side-bar-content');
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