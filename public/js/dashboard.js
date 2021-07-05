/* function notifyMe() {
    
    console.log("NOTIFYING");
    
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
  
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      
      console.log("SENDING MESSAGE");
      
      var notification = new Notification("Hi there!");
    }
  
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        
        console.log("SENT");

        if (permission === "granted") {
          var notification = new Notification("Hi there!");
        }
      });
    }

} */

function setMessages(numMessages){
    
    console.log("SETTING:");

    if(parseInt(numMessages) > 0){
        console.log("SHOWING COUNT: ",numMessages);
        $("#messages-badge").addClass("badge");
        $("#messages-badge").html(numMessages);
    } else {
        console.log("SHOWING NONE");
        $("#messages-badge").removeClass("badge");
        $("#messages-badge").html("");
    }
}

$("#dashboard").on('click','[id^=dashboard-action]', function (e) {

    e.preventDefault();

    var thisId = $(this).prop('id');
    console.log("DASHBOARD ACTION", thisId);

    dashboardAction(thisId);
});

function dashboardAction(thisId){
    
    var dashboardContent = thisId.split('-').pop();
    console.log("DBC", dashboardContent);

    var dashboardCheckArray = dashboardContent.split('_');
    console.log("DBC ARR: ", dashboardCheckArray);

    var dashboardCheck = dashboardCheckArray[0];
    console.log("DBC CHECK: ", dashboardCheck);

    if(dashboardCheck == 'messageDelete'){

        var param = dashboardCheckArray[1];
        console.log("DELETE PARAM: ", param);
        var messageTo = dashboardCheckArray[2];
    
        $.ajax({
            url: 'message/update',
            type: "POST",
            data: {
                "message_to" : messageTo,
                "message_id" : param,
                "message_status" : "X"
            },
        }).done(function (response) {
    
            console.log("UPDATE DETAILS: ", response);
            //UPDATE NAV MESSAGE BADGE
            var numMessages = response.num_messages;
            setMessages(numMessages);
            //REMOVE THE MESSAGE
            $("#message-" + param).remove();
            
        }).fail(function (jqXHR, textStatus) {
            console.log("ERR: ", jqXHR);
        });

    } else if(dashboardCheck == 'messageRead'){
        
        var param = dashboardCheckArray[1];
        console.log("READ PARAM: ", param);
        var messageTo = dashboardCheckArray[2];

        console.log("MTR: ", messageTo);

        $.ajax({
            url: 'message/update',
            type: "POST",
            data: {
                "message_id" : param,
                "message_to" : messageTo,
                "message_status" : "R"
            },
        
        }).done(function (response) {
    
            console.log("UPDATE DETAILS: ", response);
            //UPDATE NAV MESSAGE BADGE
            var numMessages = response.num_messages;
            setMessages(numMessages);
            //UPDATE THE DISPLAY
            console.log("REMOVE CLASS");
            console.log("message-" + param);
            
            $("#message-" + param).removeClass('message-new');
            $("#message-" + param).addClass('message');

            $("#dashboard-action-messageRead_" + param + "_" + messageTo).remove();
            $("#dashboard-action-messageUnread_" + param + "_" + messageTo).remove();
            
            //APPEND AFTER
            var readId ="dashboard-action-messageDelete_" + param + "_" + messageTo;
            var readLink = '<a id="dashboard-action-messageUnread_' + param + "_" + messageTo + '" href="#" class="w3-bar-item w3-button">Mark as Un-Read</a>'

            $("#" + readId).after(readLink);
            
            $("#row_" + param + "_P").prop("id", "row_" + param + "_R");

            
        }).fail(function (jqXHR, textStatus) {
            console.log("ERR: ", jqXHR);
        });

    } else if(dashboardCheck == 'messageUnread'){
        
        var param = dashboardCheckArray[1];
        console.log("UNREAD PARAM: ", param);
        var messageTo = dashboardCheckArray[2];

        console.log("MTU: ", messageTo);

        $.ajax({
            url: 'message/update',
            type: "POST",
            data: {
                "message_to" : messageTo,
                "message_id" : param,
                "message_status" : "P"
            },
        }).done(function (response) {
    
            console.log("UPDATE DETAILS: ", response);
            //UPDATE NAV MESSAGE BADGE
            var numMessages = response.num_messages;
            setMessages(numMessages);
            //REMOVE THE MESSAGE
            console.log("ADD CLASS");
            console.log("message-" + param);
            
            $("#message-" + param).removeClass('message');
            $("#message-" + param).addClass('message-new');
            
            $("#dashboard-action-messageRead_" + param + "_" + messageTo).remove();
            $("#dashboard-action-messageUnread_" + param + "_" + messageTo).remove();

            var readId ="dashboard-action-messageDelete_" + param + "_" + messageTo;
            var readLink = '<a id="dashboard-action-messageRead_' + param + "_" + messageTo + '" href="#" class="w3-bar-item w3-button">Mark as Read</a>'

            $("#" + readId).after(readLink);
            
            $("#row_" + param + "_R").prop("id", "row_" + param + "_P");

        }).fail(function (jqXHR, textStatus) {
            console.log("ERR: ", jqXHR);
        });
       
    } else if(dashboardCheck == 'messageReply'){
        var param = dashboardCheckArray[1];
        console.log("REPLY PARAM: ", param);
    }

}

$("#dashboard").on('click','[id^=row_]', function (e) {
    
    //CLICKER
    
    e.preventDefault();
    var $clicker = $(this);

    console.log("CLICKER: ", $clicker);

    var clickedId = $(this).prop("id");
    var splitArray = clickedId.split("_");
    var rowId = splitArray[1];
    var msgTo = splitArray[2];
    var msgStatus = splitArray[3];

    //localStorage.setItem('last-req-row', rowId);

    //HIGHLIGHT ROW
    //$(".req-row").removeClass('highlight-row');
    //$("#req_row_" + rowId).addClass('highlight-row');

    //console.log("CLICKER:", $clicker[0]['attributes']);
    var pos = $clicker.position();
    var dropdownTop = + pos.top;

    console.log("DD: ", dropdownTop);
    //alert("DD: " + dropdownTop);

    if(parseInt(dropdownTop) > 500){
        var posStyle = 'width:100px;bottom:0px;right:100%;';
    } else {
        var posStyle = 'width:100px;top:0;right:100%;';
    }

    console.log("ROW ID: ",rowId);
    console.log("MESSAGE TO: ", msgTo);
    console.log("MESSAGE STATUS: ", msgStatus);

    $("[id^=row_]").html('<button class="w3-button w3-small w3-transparent w3-padding-small menu-button w3-hover"><i class="fas fa-ellipsis-h"></i>');
    $(".menu-button").html('<i class="fas fa-ellipsis-h"></i>');

    var actionButton = '<div style="z-index:10000" class="w3-dropdown-hover">';
    actionButton += '<button class="w3-button w3-small w3-padding-small w3-hover"><i class="fas fa-ellipsis-h"></i></button>';
    actionButton += '<div class="w3-dropdown-content w3-bar-block w3-border" style="' + posStyle +';">';
    actionButton += '<a id="dashboard-action-messageDelete_' + rowId + '_' + msgTo + '" href="#" class="w3-bar-item w3-button">Delete</a>';
    if(msgStatus == 'P'){
        actionButton += '<a id="dashboard-action-messageRead_' + rowId + '_' + msgTo + '" href="#" class="w3-bar-item w3-button">Mark as Read</a>';
    } else if(msgStatus == 'R'){
        actionButton += '<a id="dashboard-action-messageUnread_' + rowId + '_' + msgTo + '" href="#" class="w3-bar-item w3-button">Mark as Un-Read</a>';
    }
    actionButton += '<a id="dashboard-action-messageReply_' + rowId + '" href="#" class="w3-bar-item w3-button">Reply</a>';
    actionButton += '</div>';

    $("#row_" + rowId + '_' + msgTo + '_' + msgStatus).html(actionButton);

});

getDashboard();

function getDashboard(){
    
    $("#dashboard-header").html("");

    var workSpaceHeader = '<h1 class="w3-xlarge w3-left"><b>Dashboard</b></h1>';
    //workSpaceHeader += '<button id="send-test-message" class="w3-bar-item w3-button w3-darkblue w3-mobile w3-right w3-medium" style="margin-bottom:10px;">Send Message</button>';

    $("#work-space-header").append(workSpaceHeader);
    
    $("#dashboard").html("");

    var dashboardLayout = '';
    
    dashboardLayout += '<div class="flex-grid" style="border:0px solid green;">';
    dashboardLayout += '<div id="col-1" style="padding-right:25px;">';    
    dashboardLayout += '<div style="margin:0 0 25px 0;width:100%;">';
    
    dashboardLayout += '<h4>Messages</h4>';
    dashboardLayout += '<ul id="dashboard-messages" class="w3-ul"></ul>';    
    dashboardLayout += '</div>';
    dashboardLayout += '</div>';

    dashboardLayout += '<div id="col-2" style="margin-top:0px;padding-top:10px;border:0px solid red;">';
    dashboardLayout += '<h4 style="margin:0 0 25px 10px;">Requests for May 2021</h3>';
    dashboardLayout += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    dashboardLayout += '<canvas id="myChart"></canvas>';
    dashboardLayout += '</div>';
    dashboardLayout += '<div class="w3-half" style="padding:0 10px 10px 0;">';
    dashboardLayout += '<canvas id="myDoughnut"></canvas>';
    dashboardLayout += '</div>';
    //dashboardLayout += '<div class="w3-third" style="padding:0 10px 10px 0;">';
    //dashboardLayout += '<canvas id="myNewChart"></canvas>';
    //dashboardLayout += '</div>';
    
    dashboardLayout += '</div>';

    $("#dashboard").append(dashboardLayout);

    //GET INTERNAL MESSAGES

    var user = $("#current-user").val();
    
    $.ajax({
        url: "/messages/" + user,
        type: "get",
        async: false,
    }).done(function (response) {

        var messagesObj = response;

        var numMessages = messagesObj.num_messages;
        //var el = document.querySelector('#message-count');
	    //el.setAttribute('data-count', numMessages);

        setMessages(numMessages);

        var messages = messagesObj.data;
        //console.log("MESSAGES: ", messages);

        var dashboardMessages = '';

        for (var m = 0; m < messages.length; m++) {

            var messageId = messages[m]['message_id'];
            var messageTo = messages[m]['message_to'];
            var messageSent = messages[m]['message_sent'];
            var messageFrom = messages[m]['message_from'];
            var messageTitle = messages[m]['message_title'];
            var messageBody = messages[m]['message_body'];
            var messageStatus = messages[m]['message_status'];

            if(messageStatus == 'P'){
                var statusDisplayClass = 'message-new';
            } else if(messageStatus == 'R'){
                var statusDisplayClass = 'message';
            }

            dashboardMessages += '<li id="message-' + messageId + '" class="' + statusDisplayClass + '">';
            dashboardMessages += '<div id="row_' + messageId + '_' + messageTo + '_' + messageStatus + '" class="w3-right" style="text-align:center;">';
            dashboardMessages += '<button class="w3-button w3-small w3-transparent w3-padding-small menu-button"><i class="fas fa-ellipsis-h"></i></button>';
            dashboardMessages += '</div>';
            dashboardMessages += '<div style="width:80%">';
            dashboardMessages += '<span class="w3-large" style="padding-left:0px;">';
            dashboardMessages += '<span class="message-header-date">' + messageSent + '</span>';
            dashboardMessages += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="message-header-from">' + messageFrom + '</span><br>';
            dashboardMessages += '<span class="message-title">' + messageTitle + ' - ' + messageStatus + '</span><br>';
            dashboardMessages += '<span class="message-body">' + messageBody + '</span><br>';
            dashboardMessages += '</div>';
            dashboardMessages += '</li>'
        }

        //console.log("DASHBOARD MESSAGES: ",dashboardMessages);

        $("#dashboard-messages").html("");
        $("#dashboard-messages").append(dashboardMessages);

    }).fail(function (jqXHR, textStatus) {
        console.log("ERR: ", jqXHR);
    });

    /* var ctx = document.getElementById("myNewChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            onClick:function(event, array){
                var element = this.getElementAtEvent(event);
                if (element.length > 0) {
                    var series= element[0]._model.datasetLabel;
                    var label = element[0]._model.label;
                    var value = this.data.datasets[element[0]._datasetIndex].data[element[0]._index];
                }

                console.log("VALUE: ", value);
                console.log("LABEL: ", label);
                console.log("SERIES: ", series);

            }
        }
    }); */

    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
        // The data for our dataset
        data: {
            labels: [
                'New',
                'Commenced',
                'Scheduled',
                'Completed',
                'Invoiced'
            ],
            datasets: [{
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(38, 166, 91, 1)',
                    'rgba(191, 85, 236, 1)',
                ],
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20]
            }]
        },
        // Configuration options go here
        options: {
            legend: {
                display: false
            },
            onClick:function(event, array){
                var element = this.getElementAtEvent(event);
                if (element.length > 0) {
                    var series= element[0]._model.datasetLabel;
                    var label = element[0]._model.label;
                    var value = this.data.datasets[element[0]._datasetIndex].data[element[0]._index];
                }

                console.log("VALUE: ", value);
                console.log("LABEL: ", label);
                console.log("SERIES: ", series);
                alert("CLICKED CHART: " + value);

            },
            title: {
                display: true,
                text: 'Request Status',
                position: 'bottom'
            }
        }
    });


    var cty = document.getElementById('myDoughnut').getContext('2d');

    var myDoughnutChart = new Chart(cty, {
        type: 'doughnut',
        data: data = {
            datasets: [{
                data: [10, 20, 30, 12, 18, 22],
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(38, 166, 91, 1)',
                    'rgba(191, 85, 236, 1)',
                    'rgba(242, 120, 75, 1)'
                ]
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'HD Fitters',
                'HV Electricians',
                'Auto Electricians',
                'LV Mechanics',
                'Boilermakers',
                'Trades Assistants'
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Trade Types',
                position: 'bottom'
            }
        }
    });

    async function getPermission(){

        let granted = false;
    
        if (Notification.permission === 'granted') {
            granted = true;
        } else if (Notification.permission !== 'denied') {
            console.log("TEST GET PERMISSION");
            let permission = await Notification.requestPermission();
            granted = permission === 'granted' ? true : false;
        }

        console.log("TEST GRANTED: ", granted);

    }

    /*
    async function showMessage(){

        console.log("SHOWING");

        // create a new notification
        const notification = new Notification('JavaScript Notification API', {
            body: 'This is a JavaScript Notification API demo',
            icon: './assets/js.png'
        });

        // close the notification after 10 seconds
        setTimeout(() => {
            notification.close();
        }, 10 * 1000);

        // navigate to a URL when clicked
        notification.addEventListener('click', () => {

            window.open('https://www.javascripttutorial.net/web-apis/javascript-notification/', '_blank');
        });

    }
    */

    /*
    $("body").on('click', '#test-messages', function (e) {

        e.preventDefault();
    
        //alert("TEST MESSAGE");
        getPermission();
        
    
    });
    */

    /*
    $("body").on('click', '#send-message', function (e) {

        e.preventDefault();
    
        //alert("TEST MESSAGE");
        //showMessage();
        
    });
    */

    /*
    (async () => {
        // create and show the notification
        const showNotification = () => {
            
            console.log("SHOWING");

            // create a new notification
            const notification = new Notification('JavaScript Notification API', {
                body: 'This is a JavaScript Notification API demo',
                icon: './assets/js.png'
            });
    
            // close the notification after 10 seconds
            setTimeout(() => {
                notification.close();
            }, 10 * 1000);
    
            // navigate to a URL when clicked
            notification.addEventListener('click', () => {
    
                window.open('https://www.javascripttutorial.net/web-apis/javascript-notification/', '_blank');
            });
        }
    
        // show an error message
        const showError = () => {
            const error = document.querySelector('.error');
            error.style.display = 'block';
            error.textContent = 'You blocked the notifications';
        }
    
        // check notification permission
        let granted = false;
    
        if (Notification.permission === 'granted') {
            granted = true;
        } else if (Notification.permission !== 'denied') {
            console.log("GET PERMISSION");
            let permission = await Notification.requestPermission();
            granted = permission === 'granted' ? true : false;
        }

        console.log("GRANTED: ", granted);
    
        // show notification or error
        //granted ? showNotification() : showError();
    
    })();

    */

}