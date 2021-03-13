$("body").on('click','[id^=workspace_page_]', function (e) {

    e.preventDefault();

    var pageDisplay = $(this).prop("id");
    var splitPage = pageDisplay.split("_");
    var pageNum = splitPage[2]

    console.log("REQ PAGE", pageNum);

    getWorkspace('requests', pageNum);

});

$.fn.filepond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType
);

/*
$("#sidebar-right").on('onchange', 'input[name=filepond]', function (e) {
    console.log("changed");

});
*/

$("#sidebar-right").on('click', '.fp2', function (e) {

    //e.preventDefault();

    $('.pond2').append(`<input type="file" class="filepond" name="filepond[]" multiple data-allow-image-edit="false" data-max-file-size="3MB">`);

    loadFilePond();
});

// Turn input element into a pond
function loadFilePond() {

    $('body input.filepond:not(.filepond--browser)').each(function(){

        $($(this)).filepond({
            acceptedFileTypes: ['image/png'],
            allowMultiple: true,
            maxFiles: 2,
            server:{

                process:(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {

                // fieldName is the name of the input field
                // file is the actual file object to send
                const formData = new FormData();

            console.log("FILE: ",file);

            formData.append(fieldName, file, file.name);

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

}

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

    e.preventDefault();
    var $clicker = $(this);
    var pos = $clicker.position();
    var dropdownTop = + pos.top;

    if(parseInt(dropdownTop) > 638){
        var posStyle = 'width:200px;bottom:100%;right:0px;';
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
    actionButton += '<a id="workspace-action-schedule_' + rowId + '" href="#" class="w3-bar-item w3-button">Update Swings</a>';
    actionButton += '<a id="workspace-action-swings_' + rowId + '" href="#" class="w3-bar-item w3-button">View Swings</a>';
    actionButton += '<a id="workspace-action-view_' + rowId + '"href="#" class="w3-bar-item w3-button">View Request Shifts</a>';
    actionButton += '<a id="workspace-action-pdf_' + rowId + '" href="#" class="w3-bar-item w3-button">Rio PDFs</a>';
    actionButton += '<a id="workspace-action-quote_' + rowId + '" href="#" class="w3-bar-item w3-button">Quote</a>';
    actionButton += '<a id="workspace-action-email_' + rowId + '" href="#" class="w3-bar-item w3-button">Email</a>';
    actionButton += '</div>';

    $("#row_" + rowId).html(actionButton);

});


$("body").on('click','[id^=workspace-action]', function (e) {

    e.preventDefault();

    var thisId = $(this).prop('id');

    console.log("TID", thisId);

    sidebarAction(thisId)

});


$("#workspace").on('click','[id^=workspace-action]', function (e) {

    e.preventDefault();

    var thisId = $(this).prop('id');

    console.log("TID", thisId);

    sidebarAction(thisId);
});

function sidebarAction(thisId){

    var sidebarContent = thisId.split('-').pop();

    console.log("SBC", sidebarContent);

    var sidebarCheckArray = sidebarContent.split('_');

    var sideBarCheck = sidebarCheckArray[0];

    if(sideBarCheck == 'swings'){

        var param = sidebarCheckArray[1];
        
        actionSwings(param);

    } else {
    
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
    
    } else if (action == 'schedule') {

        //alert("SHIFTS PARAM1:", param);

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

}


$("#sidebar-right").on('click','.cancel-request-update', function (e) {

    e.preventDefault();

    $("#sidebar-right").css({"width": "0px"});
});

$("#sidebar-right").on('click','#cancel-pdf-generate', function (e) {

    e.preventDefault();

    var param = $("#action_request").val();

    actionPdf(param);

});

$("#sidebar-right").on('click','#cancel-pdf-view', function (e) {

    e.preventDefault();

    var param = $("#request").val();

    actionPdf(param);

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

        if (tradeType1Sel == tradeType2 || tradeType1Sel == tradeType3) {

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

    //console.log("TRADE TYPE 1: ", tradeType1);
    //console.log("TRADE TYPE 2: ", parseInt($("#ws_trade_type_2").val()));

    if($("#ws_trade_type_2").val() != 'N') {

        console.log("ERR 2");

        var tradeType2Sel = parseInt($("#ws_trade_type_2").val());

        if (tradeType2Sel == tradeType1 || tradeType2Sel == tradeType3) {

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

    if($("#ws_trade_type_3").val() != 'N') {

        console.log("ERR 3");

        var tradeType3Sel = parseInt($("#ws_trade_type_3").val());

        if (tradeType3Sel == tradeType1 || tradeType3Sel == tradeType2) {

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
        beforeShowDay: function (date) {
            return [(date <= ($("#ws_end_date").datepicker("getDate")
            || new Date()))];
        }
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

function on_file(request,pdfType, filename, buf, emp, fields) {

    console.log("REQ: ", request);
    console.log("TYPE: ", pdfType);
    console.log("FIELDS2: ", fields);
    console.log("FN: ", filename);
    console.log("BUFF: ", buf);
    console.log("EMPLOYEE: ", emp);

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
            "file" : base64
        },
        async: false,
        success: function (response) {

            console.log("COMPLETED: ", response);

        }
    });
}

function createBlob(request,pdfType,url, emp, fields){

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function() {
        if (this.status == 200) {
            on_file(request,pdfType, url.split(/\//).pop(), this.response, emp, fields);
        } else {
            on_error('failed to load URL (code: ' + this.status + ')');
        }
    };

    xhr.send();
}

function transformPdf(request,pdfType, emp, fields){

    var url = "http://rr.ttsite.com.au/pdfs/" + pdfType + ".pdf";

    createBlob(request, pdfType, url, emp, fields);
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

$("#sidebar-right").on('click','[id^=create-pdf]', function (e) {

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[2];

    localStorage.setItem('rio-pdf-request', param);

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

                        transformPdf(param, pdf, thisEmp, thisField);

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

    var paramsArr = paramDets.split("-");
    var param = paramsArr[3];

    console.log("PDF TO VIEW: ", param);

    var pdfToView = "pdfs/completed/" + param + "#toolbar=0&navpanes=0&scrollbar=0";

    //window.open(pdfToView, "PopupWindow", "width=900,height=750,scrollbars=yes,resizable=yes");

    ///////

    //var rdm = Math.floor((Math.random() * 1000000) + 1);
    //var pdfToView = "pdfs/quotes/quote_" + param + ".pdf?" + rdm + "#toolbar=0&navpanes=0&scrollbar=0";

    //window.open(pdfToView, "PopupWindow", "width=900,height=750,scrollbars=yes,resizable=yes");

    //$("#sidebar-right").css({"width": "0px"});

    $("#workspace").html("");

    var viewQuote = '<div style="clear:both;"></div>';
    //QUOTE CONTAINER
    viewQuote += '<div style="margin-bottom:35px;border:0px solid green;">';
    viewQuote += '<div style="width:980px;margin: 0 0 0 180px;border:0px solid blue;">';

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
    //workSpaceQuotePreviewHeader += '<button id="quote-generate-pdf-' + param + '" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin-bottom:10px;">Generate Quote PDF</button>';

    $("#work-space-header").append(workSpaceQuotePreviewHeader);

});

$("#sidebar-right").on('click','[id^=view-pdf]', function (e) {

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[2];

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
                    pdfsDisplay += '<div><a id="view-rio-pdf-' + thisPdf + '" href="">' + thisPdf + '</a></div>';
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
});

//EMAIL

$("#sidebar-right").on('click','[id^=send-email]', function (e) {

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[2];

    var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    $("#email-send-container").append(spinHtml);

    $.ajax({
        url: '/email/send/' + param,
        type: "POST",
        success: function (response) {
            console.log(response);
            $("#email-send-container").html("");
            alert("Email was successfully sent.");
        }
    });

});

//EDIT BOOKINGS

$("#sidebar-right").on('click','[id^=cancel-edit-booking]', function (e) {

    e.preventDefault();

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[3];

    actionView(param);

});

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

    //var pb = $("#progressBar").data("kendoProgressBar");
    //pb.value(0);

    //for (var i = 0; i < numItems; i++) {
        pb.value(pb.value() + 1)
    //}
}

$("body").on('click','.travel', function (e) {

    //alert("clicked");
    //document.getElementById("img01").src = element;
    document.getElementById("order-update-success").style.display = "block";

});

$("body").on('click','#startProgress', function (e) {

    //$("#startProgress").click(function () {
    if (!$(this).hasClass("k-state-disabled")) {
        $(this).addClass("k-state-disabled");
        progress();
    }
});

//QUOTE

$("body").on('click','[id^=workspace-view-requests]', function (e) {

    /*
    $("#work-space-header").html("");

    var workSpaceHeader = '<h1 class="w3-xlarge w3-left"><b>Requests</b></h1>';
    workSpaceHeader += '<button id="workspace-action-add" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin-bottom:10px;">Add Request</button>';

    $("#work-space-header").append(workSpaceHeader);

    getWorkspace('requests',1);
    */

    viewRequests();

});

function viewRequests(){

    $("#work-space-header").html("");

    var workSpaceHeader = '<h1 class="w3-xlarge w3-left"><b>Requests</b></h1>';
    workSpaceHeader += '<button id="workspace-action-add" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin-bottom:10px;">Add Request</button>';

    $("#work-space-header").append(workSpaceHeader);

    getWorkspace('requests',1);

}

function prepareQuote(param){

    $("#sidebar-right").css({"width": "0px"});

    $("#workspace").html("");

    var prepareQuote = '<div style="clear:both;"></div>';

    prepareQuote += '<div>PREPARE: ' + param + '</div>';

    $("#workspace").append(prepareQuote);

    $("#work-space-header").html("");

    var workSpaceQuotePrepareHeader = '<h1 class="w3-xlarge w3-left"><b>Request Quote</b></h1>';
    workSpaceQuotePrepareHeader += '<button id="workspace-view-requests" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin:0 0 10px 10px;">View Requests</button>';
    workSpaceQuotePrepareHeader += '<button id="quote-view-pdf-' + param + '" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin:0 0 10px 10px;">View Quote PDF</button>';
    workSpaceQuotePrepareHeader += '<button id="quote-preview-pdf-' + param + '" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin-bottom:10px;">Preview Quote PDF</button>';

    $("#work-space-header").append(workSpaceQuotePrepareHeader);

}

$("#sidebar-right").on('click','[id^=prepare-quote]', function (e) {

    e.preventDefault();

    var paramDets = $(this).attr('id');
    var paramsArr = paramDets.split("-");
    var param = paramsArr[2];

    prepareQuote(param);

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
    //workSpaceQuotePreviewHeader += '<button id="quote-generate-pdf-' + param + '" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin-bottom:10px;">Generate Quote PDF</button>';

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

    //GET THE REQUEST SHIFTS

    $.ajax({
        url: "/newbookings/quote/" + param,
        type: "GET"
    }).done(function (response) {

        console.log("BOOKINGS: ", response);

        var bookings = response;

        if (bookings.length > 0) {

            console.log("QB: ",bookings.length);

            var quoteBookings = '';
            var numBookings = bookings.length;
            var quoteSubTotal = 0

            for (var b = 0; b < numBookings; b++) {

                var itemNum = b + 1;

                var itemRate = bookings[b]['rate'];
                var itemRateCode = bookings[b]['rate_code'];
                
                var itemQty = bookings[b]['hours'];
                var itemDesc = bookings[b]['trade_type'];
                var itemDescTxt = itemDesc + '-MEM-' + itemRateCode;   

                console.log("THE RATE: ",itemRate);
                itemRate = parseFloat(itemRate).toFixed(2);
                var itemUnits = bookings[b]['units'];
                var itemExtension = bookings[b]['extension'];
                var itemExtensionDisp = itemExtension.toFixed(2);

                quoteSubTotal = quoteSubTotal + itemExtension;

                var shiftDetails = bookings[b]['shifts'];
                //ADDED 20/1

                //console.log("SHIFT DETAILS:", shiftDetails);

                var shiftDisplay = '';

                for (var s = 0; s < shiftDetails.length; s++) {

                    var empName = shiftDetails[s]['emp_name'];
                    var empSwings = shiftDetails[s]['emp_shifts'];

                    console.log("EMP SWINGS: ", empSwings);

                    shiftDisplay += '<em>' + empName + ': </em><br>';

                    for (var w = 0; w < empSwings.length; w++) {

                        console.log("EMP SWING: ", empSwings[w]['start_day']);

                        shiftDisplay += '&nbsp;&nbsp;' + empSwings[w]['start_day'] + ' - ' + empSwings[w]['end_day'] + '<br>';
                        shiftDisplay += '&nbsp;&nbsp;# Day Shifts: ' + empSwings[w]['day_shifts'];
                        shiftDisplay += '&nbsp;&nbsp;# Night Shifts: ' + empSwings[w]['night_shifts'];
                        shiftDisplay += '<br>';

                    }
                }

                if(b == parseInt(numBookings) -1) {

                    quoteBookings += '<div class="quote-border-bottom emp-block">';
                    quoteBookings += '<div class="pdf-container">';
                    quoteBookings += '<div class="row-item" style="width:50px;">' + itemNum + '</div>';
                    quoteBookings += '<div class="row-item" style="width:50px;">' + itemQty + '</div>';
                    quoteBookings += '<div class="row-item align-left" style="width:300px;"><span style="font-weight:bold;">' + itemDescTxt + '</span><br>';
                    quoteBookings += shiftDisplay + '</div>';
                    quoteBookings += '<div class="row-item" style="width:80px;">' + itemRate + '</div>';
                    quoteBookings += '<div class="row-item" style="width:50px;">' + itemUnits + '</div>';
                    quoteBookings += '<div class="row-item-right-display" style="width:90px;">' + itemExtensionDisp + '</div>';
                    quoteBookings += '<div style="clear:both;"></div>';
                    quoteBookings += '</div>';
                    quoteBookings += '</div>';

                } else {

                    quoteBookings += '<div class="quote-border-row emp-block">';
                    quoteBookings += '<div class="pdf-container">';
                    quoteBookings += '<div class="row-item" style="width:50px;">' + itemNum + '</div>';
                    quoteBookings += '<div class="row-item" style="width:50px;">' + itemQty + '</div>';
                    quoteBookings += '<div class="row-item align-left" style="width:300px;"><span style="font-weight:bold;">' + itemDescTxt + '</span><br>';
                    quoteBookings += shiftDisplay + '</div>';
                    quoteBookings += '<div class="row-item" style="width:80px;">' + itemRate + '</div>';
                    quoteBookings += '<div class="row-item" style="width:50px;">' + itemUnits + '</div>';
                    quoteBookings += '<div class="row-item-right-display" style="width:90px;">' + itemExtensionDisp + '</div>';
                    quoteBookings += '<div style="clear:both;"></div>';
                    quoteBookings += '</div>';
                    quoteBookings += '</div>';

                }
            }

            $("#quote-rows").append(quoteBookings);

            $("#quote-sub-total").html("");
            $("#quote-gst").html("");
            $("#quote-total").html("");

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

    $("#work-space-header").html("");

    var workSpaceQuotePreviewHeader = '<h1 class="w3-xlarge w3-left"><b>Request Quote</b></h1>';
    workSpaceQuotePreviewHeader += '<button id="workspace-view-requests" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin:0 0 10px 10px;">View Requests</button>';
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
    actionQuote += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Rio Quote</div>';
    actionQuote += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    actionQuote += '</div>';
    actionQuote += '<div class="w3-center" style="margin-top:10px;">';
    actionQuote += '<button class="cancel-request-update w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    actionQuote += '<button id="prepare-quote-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Prepare</button>';
    actionQuote += '<button id="view-quote-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium">View</button>';
    actionQuote += '</div>';
    actionQuote += '</div>';

    $("#sidebar-right").append(actionQuote);
}

/////////SWINGS ADDED

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
    swingTemplates += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Update Request Swings</div>';
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

function actionUpdateSwings(param) {

    setTemplates();

}

//////

/* function actionUpdateSwings(param) {

    $("#sidebar-right").html("");

    var actionUpdateSwings = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    actionUpdateSwings += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Update Swings - Request #' + param + '</div>';
    actionUpdateSwings += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    actionUpdateSwings += '</div>';
    actionUpdateSwings += '<div class="w3-center" style="margin-top:10px;">';
    //actionUpdateSwings += '<button class="cancel-request-update w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    //actionUpdateSwings += '<button id="prepare-quote-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Prepare</button>';
    //actionUpdateSwings += '<button id="view-quote-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium">View</button>';
    actionUpdateSwings += '</div>';
    actionUpdateSwings += '</div>';

    $("#sidebar-right").append(actionUpdateSwings);
} */

function actionSwings(param) {

    //$("#sidebar-right").html("");

    $("#workspace").html("");

    /* var spinHtml = '<div class="busy-indicator">';
    spinHtml += '<div>';
    spinHtml += '<i class="fa fa-spinner fa-spin w3-xxxlarge"></i>';
    spinHtml += '</div>';
    spinHtml += '</div>';

    $("#workspace").append(spinHtml); */

    $("#work-space-header").html("");

    var workSpaceHeader = '<h1 class="w3-xlarge w3-left"><b>Swings - Request #' + param + '</b></h1>';
    workSpaceHeader += '<button id="workspace-view-requests" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin-bottom:10px;">View Requests</button>';

    $("#work-space-header").append(workSpaceHeader);
    
    
    //var actionSwings = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    //actionSwings += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Action Shifts</div>';
    //actionSwings += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    //actionSwings += '</div>';
    
    var actionSwings = '<div style="clear:both;"></div>';
    actionSwings += '<div class="w3-center" style="margin-top:10px;">SWINGS HERE';

    //GET SOME SWINGS

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

    actionSwings += '</div>';

    $("#workspace").append(actionSwings);
}


function actionEmail(param) {

    $("#sidebar-right").html("");

    var actionEmail = '<div class="w3-bar w3-darkblue" style="width:100%;">';
    actionEmail += '<div class="w3-left" style="padding:12px 0 0 15px;font-size:18px;">Email Request</div>';
    actionEmail += '<a id="sidebar-right-close" href="#" class="w3-button w3-right w3-xlarge">&times;</a>';
    actionEmail += '</div>';
    actionEmail += '<div class="w3-center" style="margin-top:10px;">';

    actionEmail += '<button class="cancel-request-update w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    actionEmail += '<button id="edit-email-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Edit</button>';
    actionEmail += '<button id="view-email-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">View</button>';
    actionEmail += '<button id="send-email-' + param + '" class="w3-button w3-darkblue w3-mobile w3-medium">Send</button>';
    actionEmail += '</div>';

    actionEmail += '<div id="email-send-container" class="w3-center" style="margin-top:60px;"></div>';

    actionEmail += '</div>';

    $("#sidebar-right").append(actionEmail);
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
    updateRequest += '<input name="ws_ref" id="ws_ref" class="w3-input w3-border input-display" type="text" disabled="disabled" style="background-color:lightgrey">';
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

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Type 1<span class="required-label"<span>*</span></label>';
    updateRequest += '<select name="ws_trade_type_1" id="ws_trade_type_1" class="trade_type w3-select w3-border input-display"></select>';
    updateRequest += '<div id="ws_trade_type_1_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '<div class="w3-third" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Rate 1<span class="required-label"<span>*</span></label>';
    updateRequest += '<select name="ws_trade_rate_1" id="ws_trade_rate_1" class="w3-select w3-border input-display">';
    updateRequest += '<option value="N">Select a Rate</option>';
    updateRequest += '<option value="ST">Short Term</option>';
    updateRequest += '<option value="FS">Field Service</option>';
    updateRequest += '<option value="LT">Long Term</option>';
    updateRequest += '</select>';
    updateRequest += '<div id="ws_trade_rate_1_error" class="noerror" ></div>';

    updateRequest += '</div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Type 2</label>';
    updateRequest += '<select name="ws_trade_type_2" id="ws_trade_type_2" class="trade_type w3-select w3-border input-display"></select>';
    updateRequest += '<div id="ws_trade_type_2_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '<div class="w3-third" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Rate 2</label>';
    updateRequest += '<select name="ws_trade_rate_2" id="ws_trade_rate_2" class="w3-select w3-border input-display">';
    updateRequest += '<option value="N">Select a Rate</option>';
    updateRequest += '<option value="ST">Short Term</option>';
    updateRequest += '<option value="FS">Field Service</option>';
    updateRequest += '<option value="LT">Long Term</option>';
    updateRequest += '</select>';
    updateRequest += '<div id="ws_trade_rate_2_error" class="noerror" ></div>';

    updateRequest += '</div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Type 3</label>';
    updateRequest += '<select name="ws_trade_type_3" id="ws_trade_type_3" class="trade_type w3-select w3-border input-display"></select>';
    updateRequest += '<div id="ws_trade_type_3_error" class="noerror" ></div>';
    updateRequest += '</div>';

    updateRequest += '<div class="w3-third" style="padding:0 10px 10px 0;">';
    updateRequest += '<label style="font-weight:bold;">Trade Rate 3</label>';
    updateRequest += '<select name="ws_trade_rate_3" id="ws_trade_rate_3" class="w3-select w3-border input-display">';
    updateRequest += '<option value="N">Select a Rate</option>';
    updateRequest += '<option value="ST">Short Term</option>';
    updateRequest += '<option value="FS">Field Service</option>';
    updateRequest += '<option value="LT">Long Term</option>';
    updateRequest += '</select>';
    updateRequest += '<div id="ws_trade_rate_3_error" class="noerror" ></div>';

    updateRequest += '</div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

    updateRequest += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    updateRequest += '<label>Quote Date</label>';
    updateRequest += '<input name="ws_quote_date" id="ws_quote_date" class="w3-input w3-border datepicker input-display" type="text" readonly="readonly">';
    updateRequest += '</div>';

    updateRequest += '</div>';

    updateRequest += '<div class="w3-row">';

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

    updateRequest += '<div class="w3-row">';
    updateRequest += '<div style="padding:0 10px 10px 0;">';
    updateRequest += '<label>Comments<span class="required-label">*</span></label>';
    updateRequest += '<textarea name="ws_comments" id="ws_comments" class="w3-input w3-border input-display" placeholder="Enter any comments here"></textarea>';
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

    updateRequest += '<div class="fp2">Load FilePond 2</div>';
    updateRequest += '<div class="pond2"></div>';

    updateRequest += '</div>';

    updateRequest += '</form>';

    updateRequest += '<div class="w3-center" style="margin-top:10px;">';
    updateRequest += '<button class="cancel-request-update w3-button w3-darkblue w3-mobile w3-medium" style="margin-right:10px;">Cancel</button>';
    updateRequest += '<button id="save-request-update" class="w3-button w3-darkblue w3-mobile w3-medium">Save</button>';
    updateRequest += '</div>';

    updateRequest += '</div>';

    $("#sidebar-right").append(updateRequest);

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

                    if(key == 'ws_customer'){

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

    var wsTable = '<div id="work-order-table-container" style="margin:0 0 20px 0;">';
    wsTable += '<table id="workspace-table" class="w3-striped w3-bordered w3-hoverable" style="table-layout:auto;width:100%;border-collapse:collapse;">';
    wsTable += '<thead>';
    wsTable += '<tr class="w3-darkblue">';
    wsTable += '<th>Id #</th>';
    wsTable += '<th>Req #</th>';
    wsTable += '<th>Req. Date</th>';
    wsTable += '<th>Requester</th>';
    wsTable += '<th>Phone</th>';
    wsTable += '<th>Site</th>';
    wsTable += '<th>Mobiliser</th>';
    wsTable += '<th>Email Resp.</th>';
    wsTable += '<th>Emp. Notified</th>';
    wsTable += '<th>Start Date</th>';
    wsTable += '<th>End Date</th>';
    wsTable += '<th>Scheduled</th>';
    wsTable += '<th>Comments</th>';
    wsTable += '<th>Status</th>';
    wsTable += '<th>Action</th>';
    wsTable += '</tr>';
    wsTable += '</thead>';
    wsTable += '<tbody>';

    for (var w = 0; w < wsRequests.length; w++) {

        var wsId = wsRequests[w]['ws_id'];
        var wsRef = wsRequests[w]['ws_ref'];
        var wsDate = wsRequests[w]['ws_date'];
        var wsRequester = wsRequests[w]['ws_cust_contact'];
        var wsRequesterPhone = wsRequests[w]['ws_cust_contact_phone'];
        var wsSiteDept = wsRequests[w]['ws_site_dept'];
        var wsMobiliser = wsRequests[w]['ws_mobiliser'];
        var wsEmailResponse = wsRequests[w]['ws_email_response'];
        var wsEmployeeNotified = wsRequests[w]['ws_employee_notified'];
        var wsStartDate = wsRequests[w]['ws_start_date'];
        var wsEndDate = wsRequests[w]['ws_end_date'];
        var wsScheduled = wsRequests[w]['ws_scheduled'];
        var wsComments = wsRequests[w]['ws_comments'];
        var wsStatus = wsRequests[w]['ws_status'];

        if(wsStatus == 'E') {
            var wsBgCol = 'w3-orange';
        } else if(wsStatus == 'Q'){
            var wsBgCol = 'w3-green';
        } else if(wsStatus == 'M'){
            var wsBgCol = 'w3-red';
        } else {
            var wsBgCol = '';
        }

        wsTable += '<tr>';
        wsTable += '<td>' + wsId + '</td>';
        wsTable += '<td>RR' + wsRef + '</td>';
        wsTable += '<td>' + wsDate + '</td>';
        wsTable += '<td>' + wsRequester + '</td>';
        wsTable += '<td>' + wsRequesterPhone + '</td>';
        wsTable += '<td>' + wsSiteDept + '</td>';
        wsTable += '<td>' + wsMobiliser + '</td>';
        wsTable += '<td><input id="" name="" class="w3-check" type="checkbox" value="" disabled style="top:3px;"></td>';
        wsTable += '<td><input id="" name="" class="w3-check" type="checkbox" value="" disabled style="top:3px;"></td>';
        wsTable += '<td>' + wsStartDate + '</td>';
        wsTable += '<td>' + wsEndDate + '</td>';
        wsTable += '<td><input id="" name="" class="w3-check" type="checkbox" value="" disabled style="top:3px;"></td>';
        wsTable += '<td>' + wsComments + '</td>';
        wsTable += '<td class="' + wsBgCol +'">' + wsStatus + '</td>';
        wsTable += '<td id="row_'+ wsId + '"><button class="w3-button w3-small w3-transparent w3-padding-small menu-button"><i class="fas fa-ellipsis-h"></i></button></td>';
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
        var totalRecords = response.total_requests;

        viewWorkspace(wsRequests, totalRecords, page);

    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    });

}