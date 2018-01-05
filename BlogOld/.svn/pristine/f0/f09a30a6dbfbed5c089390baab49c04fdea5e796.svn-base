var sessionInfo = null;
var isLogged;
var DISPLAY_MODE = {
    Year: 1,
    Month: 2,
    Week: 3,
    Day: 4
}
var MONTH_NAME = [
    "January", "February", "Match", "April",
    "May", "June", "July", "August", "September", "October", "November", "December"
];

var WEEK_NAME = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];
var lang;

var HOLIDAY_REGION_NAME = ["China", "United States", "All"];
var EVENTS_DATA = null;
var holidayRegionCode = 1;
var mode = 2;
var month = 9;
var day = 21;
var year = 2017;
var ONLY_VIEW = -1;
$(document).ready(function () {
    isLogged = $('#isLogged').val()==='true';
    month = new Date().getMonth() + 1;
    day = new Date().getDate();
    year = new Date().getFullYear();
    lang = $('#lang').val();
    sessionInfo = JSON.parse($('#sessionInfo').val());
    getEvents();
    bindSelectColor();
    bindAddingCalendars();
    bindLocationSelector();
    getCalendars();
    //$(document).keydown(function(e) {
    //    switch (e.which) {
    //        case 37: // left
    //            addMonth(-1);
    //        break;

    //        case 38: // up
    //            addYear(-1);
    //        break;

    //        case 39: // right
    //            addMonth(1);
    //        break;

    //        case 40: // down
    //            addYear(1);
    //        break;

    //    default: return; // exit this handler for other keys
    //    }
    //    e.preventDefault(); // prevent the default action (scroll / move caret)
    //});
});

$(window).resize(function() {
    resizeBlock();
});
function resizeBlock() {
    var width = ($('#calendarBody').width()-30)/7;
    $('.dayBlock').css('width', width + 'px');
    $('.dayBlock').css('height', width + 'px');
    $('.month-header > span').css('width', width + 'px');
    var headerWidth = $('.calendar-header').parent().width();
    if (710 > headerWidth) {
        $('.calendar-header').css('display', 'initial');
    } else {
        $('.calendar-header').css('display', 'flex');
    }
}

function getCalendars() {
    $.ajax({
        url: '/' + lang + '/Calendar/GetUsersBySessionId',
        data: {
            sessionId: sessionInfo.SessionId
        }
    }).done(function (res) {
        sessionInfo.Users = JSON.parse(res);
        var listhtml = '';
        for (var i = 0; i < sessionInfo.Users.length; i++) {
            var info = JSON.stringify(sessionInfo.Users[i]);
            var editBtn = '';
            if (isLogged) {
                 editBtn = '<span class="fa fa-cog" aria-hidden="true" onclick="showEditingUserBox(this)"></span>';
            }
            listhtml += '<div class="list-group-item" data-user="' +
                escapeHtml(info) +
                '"><span class="cursor-pointer" data-userId="'+ sessionInfo.Users[i].UserId+'" onclick="viewSelfOnly(this)">' +
                sessionInfo.Users[i].UserName +
                '</span><span class="pull-right ">' + editBtn + '</span>' +
                '</div>';
        }
        $('#calendarsBody').html(listhtml);
    });

}
function viewSelfOnly(target) {
    var userId = parseInt($(target).attr('data-userId'));
    $('.select-view').removeClass('select-view');
    if (ONLY_VIEW === userId) {
        $(target).parent().removeClass('select-view');
        ONLY_VIEW = -1;
    } else {
        ONLY_VIEW = userId;
        $(target).parent().addClass('select-view');
    }
    getEvents();
}

function bindLocationSelector() {
    var mapViewHtml =
        '<div class="panel" style="padding:20px;">' +
        '        <div class="form-group" style="display:inline-flex;width:100%;">' +
        '        <label class="control-label">Location Name</label>' +
        '        <input class="form-control " id="locationInput">' +
        '        <span class="btn btn-xs btn-raised" onclick="changeLocation(this)">View On Map</span>' +
        '        </div>' +
        '        </div > ' +
        '<div class="panel">' +
        '        <iframe class="googleMapIframe" ' +
        '    width="600"' +
        '    height="450"' +
        '   frameborder="0" style="border:0"' +
        '    src="//www.google.com/maps/embed/v1/place?key=AIzaSyDhb9ModxzJDhlueEy0M9bMRNEQ-sIkULM' +
        '        &q=United + States">' +
        '        </iframe > ' +
        '        </div > ' +
        ' <span class="btn btn-xs btn-default pull-right btn-raised" onclick= "$(\'.locationSelector > span\').popover(\'toggle\')" >Close</span >' +
        ' <span class="btn btn-xs btn-primary pull-right btn-raised" onclick= "saveLocation(this)" >Pick Location</span >';

    $('.locationSelector > span').popover({
        trigger: 'click',
        content: mapViewHtml,
        html: true
    });

    $('.locationSelector > span').on('show.bs.popover',
        function () {
            $('.googleMapIframe').remove();
        });
    $('.locationSelector > span').on('shown.bs.popover',
        function () {
            $(this).html('<span class="glyphicon glyphicon-minus"></span>');
            getLocation();
        });
    $('.locationSelector > span').on('hidden.bs.popover',
        function () {
            $(this).html('<span class="glyphicon glyphicon-plus"></span>');
        });

}
function bindAddingCalendars() {
    var userAddingHtml = '<div id="calendarsInSession">' +
        '</div>';
    $('.eventCalendar > span').popover({
        trigger: 'click',
        content: userAddingHtml,
        html: true
    });

    $('.eventCalendar > span').on('shown.bs.popover',
        function () {
            var rawHtml = '';
            var selectedUsers = [];
            $('#eventUsers').children().each(function () {
                selectedUsers.push(parseInt($(this).attr('data-userid')));
            });

            for (var i = 0; i < sessionInfo.Users.length; i++) {
                var user = sessionInfo.Users[i];
                var checkedStr = '';
                if (selectedUsers.indexOf(user.UserId) >= 0) {
                    checkedStr = 'checked="checked"';
                }
                rawHtml += '<div class="list-group-item" style="width:200px;color:black"><input type="checkbox" data-userId="' + user.UserId + '"  data-userName="' + user.UserName + '" ' + checkedStr + ' />&nbsp;&nbsp;<span>' +
                    user.UserName +
                    '</span></div>';
            }
            $('#calendarsInSession').html(rawHtml);
            $(this).html('<span class="glyphicon glyphicon-minus"></span>');
        });

    $('.eventCalendar > span').on('hide.bs.popover',
        function () {
            $(this).html('<span class="glyphicon glyphicon-plus"></span>');
            $('#eventUsers').empty();
            $('#calendarsInSession').find("input:checked").each(function () {
                var userId = $(this).attr('data-userId');
                var userName = $(this).attr('data-userName');
                $('#eventUsers').append('<span data-userId="' + userId + '">' + userName + '</span>&nbsp;&nbsp;');
            });
        });
}

function drawTable() {
    if (mode == DISPLAY_MODE.Month) {
        drawTable_MonthMode();
    }
    else if (mode == DISPLAY_MODE.Month) {
        drawTable_YearMode();
    }
    else if (mode == DISPLAY_MODE.Week) {
        drawTable_WeekMode();
    }
    else if (mode == DISPLAY_MODE.Year) {
        drawTable_DayMode();
    } else {
        //error happends
        return;
    }
}


function drawTable_MonthMode() {
    var getHeader = function (header) {
        var rawHeaderHtml = "<div class='month-header'>";
        rawHeaderHtml += "<span><b>Sunday</b></span>";
        rawHeaderHtml += "<span><b>Monday</b></span>";
        rawHeaderHtml += "<span><b>Tuesday</b></span>";
        rawHeaderHtml += "<span><b>Wednesday</b></span>";
        rawHeaderHtml += "<span><b>Thursday</b></span>";
        rawHeaderHtml += "<span><b>Friday</b></span>";
        rawHeaderHtml += "<span><b>Saturday</b></span>";
        rawHeaderHtml += "</div>";
        header.html(rawHeaderHtml);
    }
    var getInfo = function (info) {
        var infoHtml = '<b id="month-info">' + MONTH_NAME[month - 1] + '</b>' +
            '<b id="year-info">' + year + '</b>';
        info.html(infoHtml);
    }
    var getBody = function (body) {
        var rawHtmlBody = '';
        var days = getDaysInMonth();
        var offset = getOffsetOfFirstDayInMonth();
        for (var i = 0; i < 6; i++) {
            if ((i - 1) * 7 - 5 >= days) break;
            rawHtmlBody += "<div class='weekLineBlock'>";
            for (var j = 0; j < 7; j++) {
                var k = i * 7 + j;
                if (k < offset || k >= days + offset) {
                    rawHtmlBody += "<div class='dayBlock'></div>";
                } else {
                    var addEventBtnHtml = '';
                    var day = (k - offset + 1);
                    if (new Date() <= new Date(year, month - 1, day + 1) && isLogged) {
                        addEventBtnHtml = "<span class='date-addEvent pull-right text-muted' data-year='" +
                            year +
                            "' data-month='" +
                            month +
                            "' data-day='" +
                            day +
                            "' onclick='addEvent(this)'><span class='glyphicon glyphicon-plus'></span></span>";
                    }
                    rawHtmlBody += "<div class='dayBlock' date-value='" + year + "-" + month + "-" + (k - offset + 1) + "'>" +
                        "<span class='date-number'>" + day + "</span>" +
                      addEventBtnHtml +
                        "<span class='date-events'>" + getEventsHtml(year, month, day) + "</span>" +
                        "</div>";
                }
            }
            rawHtmlBody += "</div>";
        }
        body.html(rawHtmlBody);
        resizeBlock();
    }
    var header = $('#calendarBody >div.cal-header');
    getHeader(header);
    var body = $('#calendarBody >div.cal-body');
    getBody(body);
    var info = $('.current-info');
    getInfo(info);
    markToday();
    bindHoverOnShowEventDetail();

}


function drawTable_YearMode() {

}


function drawTable_WeekMode() {

}


function drawTable_DayMode() {

}



function getEventsHtml(year, month, day) {
    var eventHtml = '';
    var events = getEventDetail(year, month, day);
    if (events != null) {
        for (var i = 0; i < events.length; i++) {
            var actionStr = '';
            if (isLogged) {
                actionStr = 'onclick="editEventDetail(this)"';
            }
            eventHtml += '<span class="label cusor-pointer eventBlock" data-eventId="' + events[i].EventId + '" style="background-color:' + events[i].Color + '" ' + actionStr + '>' + events[i].EventName + '</span><br />';
        }
    }
    return eventHtml;
}

function markToday() {
    var now = new Date();
    var todayYear = now.getFullYear();
    var todayMonth = now.getMonth() + 1;
    year = parseInt(year);
    month = parseInt(month);
    if (todayYear === year && month === todayMonth) {
        var todayDate = now.getDate();
        var dateStr = $('div[date-value="' + todayYear + '-' + todayMonth + '-' + todayDate + '"] >span.date-number');
        dateStr.html('<span class="badge">' + todayDate + '</span>');
    }
}


function addMonth(num) {
    if (month + num > 12) {
        year++;
    }
    else if (month + num < 1) {
        year--;
    }
    month = (month + num + 11) % 12 + 1;
    getEvents();
}

function addYear(num) {
    year += num;
    getEvents();
}

function goToToday() {
    var now = new Date();
    year = now.getFullYear();
    month = now.getMonth() + 1;
    getEvents();
}
//Helper


function getDaysInMonth() {
    var date = new Date(this.year, this.month, 0);
    return date.monthDays();
}


function getDaysInPrevMonth() {
    var date;
    if (this.month == 1) {
        date = new Date(this.year - 1, 11, 0);
    } else {
        date = new Date(this.year, this.month, 0);
    }
    return date.monthDays();
}

function getOffsetOfFirstDayInMonth() {
    var date = new Date(this.year, this.month - 1, 1);
    return date.getDay();
}

Date.prototype.monthDays = function () {
    var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    return d.getDate();
}

function getEvents() {
    $.ajax({
        method: 'post',
        url: '/' + lang + '/Calendar/GetEvents',
        data: {
            country: HOLIDAY_REGION_NAME[holidayRegionCode],
            month: month,
            year: year,
            sessionId: sessionInfo.SessionId,
            onlyViewUserId:ONLY_VIEW
        }
    }).done(function (res) {
        var events = JSON.parse(res);
        EVENTS_DATA = events;
        drawTable();
    });
}

function changeRegion(target) {
    holidayRegionCode = parseInt($(target).val());
    getEvents();
}


function getEventDetail(year, month, day) {
    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);
    var events = [];
    for (var i = 0; i < EVENTS_DATA.length; i++) {
        var record = EVENTS_DATA[i];
        if (record.Year === year && record.Month === month && record.Day === day) {
            events.push(record);
        }
    }

    return events;
}

function pad2(num) {
    return num < 10 ? "0" + num : "" + num;
}

function addEvent(target) {

    year = $(target).attr('data-year');
    month = $(target).attr('data-month');
    day = $(target).attr('data-day');
    timeRangeHtmlGenerate(0);
    $('.googleMapIframe').remove();
    //$('#dayForEvent').val(year + '-' + pad2(month) + '-' + pad2(day));
    //$('#dayForEvent').attr('disabled', 'disabled');
    presetEventBox(0, null);
    $('#addingEventBox').modal();
}




function timeRangeHtmlGenerate(repeatTime) {
    var dateStr = year + '-' + pad2(month) + '-' + pad2(day);
    var timeRangeHtml;
    if (repeatTime == 7) {
        var curIdx = new Date(dateStr).getDay();
        var weekOptionHtml = '';
        for (var i = 0; i < 7; i++) {
            var selectHtml = '';
            if (i === curIdx + 1) {
                selectHtml = 'selected="selected"';
            }
            weekOptionHtml += '<option value="' + i + '" ' + selectHtml + '>' + WEEK_NAME[i] + '</option>';
        }
        timeRangeHtml = '<div class="form-group startDayForEvent">' +
            '   <label class="control-label">Start Day of Week</label>' +
            '  <select class="form-control">' +
            weekOptionHtml +
            '</select>' +
            '  </div>' +
            '  <span class="form-group startTimeForEvent">' +
            '  <label class="control-label">Start Time</label>' +
            '  <input class="form-control " type="time"  value="00:00"/>' +
            '  </span>' +
            ' <div>To</div>' +
            ' <div class="form-group endDayForEvent">' +
            ' <label class="control-label">End Day of Week</label>' +
            '  <select class="form-control">' +
            weekOptionHtml +
            '</select>' +
            ' </div>' +
            ' <span class="form-group endTimeForEvent">' +
            '<label class="control-label">End Time</label>' +
            '<input class="form-control " type="time" value="23:59"/>' +
            '</span>';
    } else if (repeatTime == 1) {
        timeRangeHtml =
            '  <span class="form-group startTimeForEvent">' +
            '  <label class="control-label">Start Time</label>' +
            '  <input class="form-control " type="time"   value="00:00"/>' +
            '  </span>' +
            ' <div>To</div>' +
            ' <span class="form-group endTimeForEvent">' +
            '<label class="control-label">End Time</label>' +
            '<input class="form-control " type="time" value="23:59"/>' +
            '</span>';
    } else if (repeatTime == -1) {

        timeRangeHtml = '<div class="form-group startDayForEvent">' +
            '   <label class="control-label">Start Date Number</label>' +
            '  <input type="int" min="1" max="31" class="form-control" value="' + day + '"/>' +
            '  </div>' +
            '  <span class="form-group startTimeForEvent">' +
            '  <label class="control-label">Start Time</label>' +
            '  <input class="form-control " type="time"   value="00:00"/>' +
            '  </span>' +
            ' <div>To</div>' +
            ' <div class="form-group endDayForEvent">' +
            ' <label class="control-label">End Date Number</label>' +
            ' <input type="int"  min="1" max="31"  class="form-control" value="' + day + '"/>' +
            ' </div>' +
            ' <span class="form-group endTimeForEvent">' +
            '<label class="control-label">End Time</label>' +
            '<input class="form-control " type="time" value="23:59"/>' +
            '</span>';
    }
    else {
        timeRangeHtml = '<div class="form-group startDayForEvent">' +
            '   <label class="control-label">Start Day</label>' +
            '  <input type="date" class="form-control" value="' + dateStr + '"/>' +
            '  </div>' +
            '  <span class="form-group startTimeForEvent">' +
            '  <label class="control-label">Start Time</label>' +
            '  <input class="form-control " type="time" value="00:00"/>' +
            '  </span>' +
            ' <div>To</div>' +
            ' <div class="form-group endDayForEvent">' +
            ' <label class="control-label">End Day</label>' +
            ' <input type="date" class="form-control"  value="' + dateStr + '"/>' +
            ' </div>' +
            ' <span class="form-group endTimeForEvent">' +
            '<label class="control-label">End Time</label>' +
            '<input class="form-control " type="time" value="23:59"/>' +
            '</span>';
    }
    $('.timeRangeSelector').html(timeRangeHtml);
}

function changeTimeScope(target) {
    var repeatTime = parseInt($(target).val());
    timeRangeHtmlGenerate(repeatTime);
}

function bindSelectColor() {
    $('div.color-panel > div').click(function () {

        if ($(this).html() != '') {
            $(this).html('');
            $('div.colorPicker >label').css('color', '#bdbdbd');
            return;
        }
        $('.color-selected').remove();
        $(this).html('<span class="fa fa-check color-selected" aria-hidden="true"></span>');
        $('div.colorPicker >label').css('color', '#009688');
    });
}

function checkNotification(target) {
    var node = $(target).parent();
    if ($(target).prop("checked")) {
        node.next().removeAttr('disabled');
        node.next().next().removeAttr('disabled');
    } else {
        node.next().attr('disabled', 'disabled');
        node.next().next().attr('disabled', 'disabled');
    }

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        return;
    }
}

function changeLocation(target) {
    var location = $(target).prev().val();
    $('.googleMapIframe').attr('data-location', location);
    $('.googleMapIframe').attr('src',
        '//www.google.com/maps/embed/v1/place?key=AIzaSyDhb9ModxzJDhlueEy0M9bMRNEQ-sIkULM&' +
        'q=' + encodeURIComponent(location));

}
function showPosition(position) {
    var positionStr = position.coords.latitude + ',' + position.coords.longitude;
    $('#locationInput').val(positionStr);
    $('.googleMapIframe').attr('data-location', positionStr);
    $('.googleMapIframe').attr('src',
        '//www.google.com/maps/embed/v1/place?key=AIzaSyDhb9ModxzJDhlueEy0M9bMRNEQ-sIkULM&' +
        'q=' + positionStr);
}


function saveLocation(target) {
    $('.locationSelector > span').popover('toggle');
    $('.locationSelector').append($('.googleMapIframe'));
}


var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}


function showAddingUserBox() {
    $('#createUserBtn').attr('data-sessionId', sessionInfo.SessionId);
    presetModelForUserManipulation(0, null);
    $('#addingUserBox').modal();
}

function showEditingUserBox(target) {
    var user = JSON.parse($(target).parent().parent().attr('data-user'));
    presetModelForUserManipulation(1, user);
    $('#addingUserBox').modal();
}

function presetModelForUserManipulation(flag, user) {
    var modalSection = $('#addingUserBox');
    if (flag == 1) {
        modalSection.find('h5.modal-title').html('Editing User');
        $('.userNameAddingUser >input').val(user.UserName);
        $('.userNameAddingUser').removeClass('is-empty');
        $('.emailAddingUser >input').val(user.Email);
        $('.emailAddingUser').removeClass('is-empty');
        $('.cellPhoneAddingUser >input').val(user.CellPhone);
        $('.cellPhoneAddingUser').removeClass('is-empty');
        $('.carrierAddingUser >select').val(user.PhoneCarrier);
        $('.carrierAddingUser').removeClass('is-empty');
        $('#emailActive').prop('checked', user.ReceiveEmailActive);
        $('#messageActive').prop('checked', user.ReceiveMessageActive);
        $('#manipulateUserBtn').attr('onclick', 'updateUser(this)');
        $('#manipulateUserBtn').html('Update');
        $('#manipulateUserBtn').attr('data-userId', user.UserId);
        $('#deleteUserBtn').attr('data-userId', user.UserId);
        $('#deleteUserBtn').show();
    } else {
        modalSection.find('h5.modal-title').html('Adding User');
        $('.userNameAddingUser >input').val('');
        $('.userNameAddingUser').addClass('is-empty');
        $('.emailAddingUser >input').val('');
        $('.emailAddingUser').addClass('is-empty');
        $('.cellPhoneAddingUser >input').val('');
        $('.cellPhoneAddingUser').addClass('is-empty');
        $('.carrierAddingUser >select').val('');
        $('.carrierAddingUser').addClass('is-empty');
        $('#emailActive').prop('checked', true);
        $('#messageActive').prop('checked', true);
        $('#manipulateUserBtn').attr('onclick', 'createUser(this)');
        $('#manipulateUserBtn').html('Create');
        $('#deleteUserBtn').hide();
    }

}

function updateUser(target) {
    var user = collectUserData();
    if (userValidation(user)) {
        return;
    }
    user.UserId = $(target).attr('data-userId');
    $.ajax({
        method: 'post',
        url: '/' + lang + '/Calendar/UpdateUser',
        data: JSON.stringify(user),
        contentType: 'application/json; charset=UTF-8'
    }).done(function (res) {
        if (res == 'True') {
            $('#addingUserBox').modal('toggle');
            getCalendars();
        } else {
            alert("Error Happens");
        }
    });
}
function createUser(target) {
    var user = collectUserData();
    if (userValidation(user)) {
        return;
    }
    $.ajax({
        method: 'post',
        url: '/' + lang + '/Calendar/AddUser',
        data: JSON.stringify(user),
        contentType: 'application/json; charset=UTF-8'
    }).done(function (res) {
        if (res == 'True') {
            $('#addingUserBox').modal('toggle');
            getCalendars();
        } else {
            alert("Error Happens");
        }

    });
}
function deleteUser(target) {
    var userId = $(target).attr('data-userId');
    $.ajax({
        method: 'post',
        url: '/' + lang + '/Calendar/DeleteUser',
        data: {
            userId: userId
        }
    }).done(function (res) {
        if (res == 'True') {
            $('#addingUserBox').modal('toggle');
            getCalendars();
        } else {
            alert("Error Happens");
        }

    });
}

function collectUserData() {
    var user = {}
    user.SessionId = sessionInfo.SessionId;
    user.UserName = $('.userNameAddingUser > input').val();
    user.Email = $('.emailAddingUser > input').val();
    user.CellPhone = $('.cellPhoneAddingUser > input').val();
    user.PhoneCarrier = $('.carrierAddingUser > select').val();
    user.ReceiveEmailActive = $('#emailActive').prop("checked");
    user.ReceiveMessageActive = $('#messageActive').prop("checked");
    return user;
}
function userValidation(user) {
    var hasError = false;

    if (user.UserName == '') {
        $('.userNameAddingUser').addClass('has-error');
        hasError = true;
    } else {
        $('.userNameAddingUser').removeClass('has-error');
    }

    if (user.Email == '') {
        $('.emailAddingUser').addClass('has-error');
        hasError = true;
    } else {
        $('.emailAddingUser').removeClass('has-error');
    }

    if (user.CellPhone == '' || isNaN(parseFloat(user.CellPhone)) || user.CellPhone.length != 10) {
        $('.cellPhoneAddingUser').addClass('has-error');
        hasError = true;
    } else {
        $('.cellPhoneAddingUser').removeClass('has-error');
    }

    if (user.PhoneCarrier == '') {
        $('.carrierAddingUser').addClass('has-error');
        hasError = true;
    } else {
        $('.carrierAddingUser').removeClass('has-error');
    }
    return hasError;
}


function addEventButton() {
    var eventObj = collectEventData();
    if (validation(eventObj)) {
        return;
    }

    $.ajax({
        method: 'post',
        url: '/' + lang + '/Calendar/SaveEvent',
        data: JSON.stringify(eventObj),
        contentType: 'application/json; charset=UTF-8'
    }).done(function (res) {
       if (res == 'True') {
           $('#addingEventBox').modal('toggle');
           getEvents();
       } else {
           alert('Error Happens');
       }
    });
}


function collectEventData() {
    var eventObj = {}
    eventObj.SessionId = sessionInfo.SessionId;
    eventObj.EventName = $('.eventName >input').val();
    eventObj.Repeat = parseInt($('#repeatTime').val());
    if (eventObj.Repeat == 0) {
        var dateStartTokens = $('.startDayForEvent >input').val().split("-");
        eventObj.StartYear = parseInt(dateStartTokens[0]);
        eventObj.StartMonth = parseInt(dateStartTokens[1]);
        eventObj.StartDay = parseInt(dateStartTokens[2]);
        eventObj.StartDayOfWeek = -1;

        var dateEndTokens = $('.endDayForEvent > input').val().split("-");
        eventObj.EndYear = parseInt(dateEndTokens[0]);
        eventObj.EndMonth = parseInt(dateEndTokens[1]);
        eventObj.EndDay = parseInt(dateEndTokens[2]);
        eventObj.EndDayOfWeek = -1;

    }
    else if (eventObj.Repeat == -1) {
        eventObj.StartDay = parseInt($('.startDayForEvent >input').val());
        eventObj.StartMonth = month;
        eventObj.StartYear = year;
        eventObj.StartDayOfWeek = -1;

        eventObj.EndDay = parseInt($('.endDayForEvent >input').val());
        eventObj.EndMonth = -1;
        eventObj.EndYear = -1;
        eventObj.EndDayOfWeek = -1;
    }
    else if (eventObj.Repeat == 1) {
        eventObj.StartDay = day;
        eventObj.StartMonth = month;
        eventObj.StartYear = year;
        eventObj.StartDayOfWeek = -1;

        eventObj.EndDay = -1;
        eventObj.EndMonth = -1;
        eventObj.EndYear = -1;
        eventObj.EndDayOfWeek = -1;
    }
    else if (eventObj.Repeat == 7) {
        eventObj.StartDay = day;
        eventObj.StartMonth = month;
        eventObj.StartYear = year;
        eventObj.StartDayOfWeek = parseInt($('.startDayForEvent >select').val());

        eventObj.EndDay = -1;
        eventObj.EndMonth = -1;
        eventObj.EndYear = -1;
        eventObj.EndDayOfWeek = parseInt($('.endDayForEvent >select').val());
    }


    var startTimeTokens = $('.startTimeForEvent > input').val().split(":");
    eventObj.StartHour = parseInt(startTimeTokens[0]);
    eventObj.StartMinute = parseInt(startTimeTokens[1]);



    var endTimeTokens = $('.endTimeForEvent > input').val().split(":");
    eventObj.EndHour = parseInt(endTimeTokens[0]);
    eventObj.EndMinute = parseInt(endTimeTokens[1]);
    eventObj.Description = $('.eventDescription >textarea').val();
    eventObj.Location = $('.googleMapIframe').attr('data-location');
    if ($('.color-selected') != null) {
        eventObj.Color = $('.color-selected').parent().attr('data-color');
    }
    eventObj.EmailNotificationActive = $('#emailNotification').find('input[type="checkbox"]').prop("checked");
    if (eventObj.EmailNotificationActive) {
        var type = $('#emailNotification > select').val();
        if (type == 'minutes') {
            eventObj.EmailNotificationBeforeMinute = $('#emailNotification').find('input[type="number"]').val();
        } else {
            eventObj.EmailNotificationBeforeHour = $('#emailNotification').find('input[type="number"]').val();
        }
    }
    eventObj.MessageNotificationActive = $('#messageNotificaiton').find('input[type="checkbox"]').prop("checked");
    if (eventObj.MessageNotificationActive) {
        var type = $('#messageNotificaiton > select').val();
        if (type == 'minutes') {
            eventObj.MessageNotificationBeforeMinute = $('#messageNotificaiton').find('input[type="number"]').val();
        } else {
            eventObj.MessageNotificationBeforeHour = $('#messageNotificaiton').find('input[type="number"]').val();
        }
    }
    eventObj.EventUsers = [];
    $('#eventUsers >span').each(function () {
        var userId = parseInt($(this).attr('data-userid'));
        var eventUser = {};
        eventUser.UserId = userId;
        eventObj.EventUsers.push(eventUser);
    });
    return eventObj;
}
function validation(data) {
    var isValid = true;
    if (data.EventName == null || data.EventName == '') {
        $('.eventName').addClass('has-error');
        isValid = false;
    } else {
        $('.eventName').removeClass('has-error');
    }

    if (data.EventUsers.length == 0) {
        $('.eventCalendar').addClass('has-error');
        isValid = false;
    } else {
        $('.eventCalendar').removeClass('has-error');
    }

    if (data.Description == null || data.Description == '') {
        $('.eventDescription').addClass('has-error');
        isValid = false;
    } else {
        $('.eventDescription').removeClass('has-error');
    }

    if (event.Color == null) {
        $('.colorPicker').addClass('has-error');
        isValid = false;
    } else {
        $('.colorPicker').removeClass('has-error');
    }
    return isValid;

}


function editEventDetail(target) {
    var eventDetail=$(target).attr('data-eventDetail');
    var eventId = parseInt($(target).attr('data-eventid'));
    if (eventDetail != null) {
        eventDetail = JSON.parse(eventDetail);
        presetEventBox(1, eventDetail);
        $('#addingEventBox').modal();
    } else {
        $.ajax({
            method: 'post',
            url: '/' + lang + '/Calendar/GetEventDetail',
            data: {
                eventId: eventId
            }
        }).done(function (res) {
            eventDetail = JSON.parse(res);
            presetEventBox(1, eventDetail);
            $('#addingEventBox').modal();
        });
    }
 

}

function presetEventBox(flag, eventDetail) {
    if (flag == 1) {
        $('#addingEventBox').find('.modal-title').html('Editing Event');
        $('.eventName').removeClass('is-empty');
        $('.eventName >input').val(eventDetail.EventName);
        $('#manipulateEventBtn').attr('onclick', 'updateEventButton(this)');
        $('#manipulateEventBtn').attr('data-eventId', eventDetail.EventId);
        $('#manipulateEventBtn').text('Update');
        $('#deleteEventBtn').show();
        $('#deleteEventBtn').attr('data-eventId', eventDetail.EventId);
        $('#repeatTime').val(eventDetail.Repeat);

        var eventCalendarsHtml = '';
        for (var i = 0; i < eventDetail.EventUsers.length; i++) {
            var user = eventDetail.EventUsers[i].User;
            if (eventDetail.EventUsers[i].Active == 0) continue;
            eventCalendarsHtml += '<span data-userid="' + user.UserId + '">' + user.UserName + '</span>&nbsp;&nbsp;';
        }
        $('#eventUsers').html(eventCalendarsHtml);
        timeRangeHtmlGenerate(eventDetail.Repeat);
        $('.startTimeForEvent >input').val(pad2(eventDetail.StartHour) + ":" + pad2(eventDetail.StartMinute));
        $('.endTimeForEvent >input').val(pad2(eventDetail.EndHour) + ":" + pad2(eventDetail.EndMinute));

        if (eventDetail.Repeat == 0) {
            $('.startDayForEvent >input').val(eventDetail.StartYear +
                "-" +
                pad2(eventDetail.StartMonth) +
                "-" +
                pad2(eventDetail.StartDay));
            $('.endDayForEvent >input').val(eventDetail.EndYear +
                "-" +
                pad2(eventDetail.EndMonth) +
                "-" +
                pad2(eventDetail.EndDay));
        }
        else if (eventDetail.Repeat == 7) {
            $('.startDayForEvent > select').val(eventDetail.StartDayOfWeek);
            $('.endDayForEvent > select').val(eventDetail.EndDayOfWeek);
        }
        else if (eventDetail.Repeat == -1) {
            $('.startDayForEvent > input').val(eventDetail.StartDay);
            $('.endDayForEvent > input').val(eventDetail.EndDay);
        }
        $('.eventDescription').removeClass('is-empty');
        $('.eventDescription> textarea').val(eventDetail.Description);
        $('.googleMapIframe').remove();
        $('.locationSelector')
            .append(
                '<iframe class="googleMapIframe" width="600" height="450" frameborder="0" style="border:0"' +
                ' src="//www.google.com/maps/embed/v1/place?key=AIzaSyDhb9ModxzJDhlueEy0M9bMRNEQ-sIkULM&amp;' +
            'q=' + encodeURI(eventDetail.Location) + '" data-location="' + escapeHtml(eventDetail.Location) + '">        </iframe>');
        $('.color-selected').remove();
        $('.color-panel>div[data-color="' + eventDetail.Color + '"]')
            .append('<span class="fa fa-check color-selected" aria-hidden="true"></span>');
        $('#emailNotification').find('input[type="checkbox"]').prop('checked', eventDetail.EmailNotificationActive);
        if (eventDetail.EmailNotificationActive) {
            $('#emailNotification').find('input[type="number"]').removeAttr('disabled');
            $('#emailNotification').find('select').removeAttr('disabled');
            if (eventDetail.EmailNotificationBeforeMinute != null) {
                $('#emailNotification').find('input[type="number"]').val(eventDetail.EmailNotificationBeforeMinute);
                $('#emailNotification').find('select').val('minutes');
            } else {
                $('#emailNotification').find('input[type="number"]').val(eventDetail.EmailNotificationBeforeHour);
                $('#emailNotification').find('select').val('hours');
            }
        }
        if (eventDetail.MessageNotificationActive) {
            $('#messageNotificaiton').find('input[type="number"]').removeAttr('disabled');
            $('#messageNotificaiton').find('select').removeAttr('disabled');
            if (eventDetail.MessageNotificationBeforeMinute != null) {
                $('#messageNotificaiton').find('input[type="number"]').val(eventDetail.MessageNotificationBeforeMinute);
                $('#messageNotificaiton').find('select').val('minutes');
            } else {
                $('#messageNotificaiton').find('input[type="number"]').val(eventDetail.MessageNotificationBeforeHour);
                $('#messageNotificaiton').find('select').val('hours');
            }
        }
        $('#messageNotificaiton').find('input[type="checkbox"]').prop('checked', eventDetail.MessageNotificationActive);
        if (eventDetail.MessageNotificationActive) {
            $('#messageNotificaiton').find('input[type="number"]').removeAttr('disabled');
            $('#messageNotificaiton').find('select').removeAttr('disabled');
        }
    } else {
        $('#addingEventBox').find('.modal-title').html('Adding Event');
        $('.eventName').addClass('is-empty');
        $('.eventName >input').val('');
        $('.eventDescription').addClass('is-empty');
        $('.eventDescription >textarea').val('');
        $('#eventUsers').html('');
        $('#manipulateEventBtn').attr('onclick', 'addEventButton()');
        $('#manipulateEventBtn').text('Create');
        $('#repeatTime').removeAttr('selected');
        $('.color-selected').remove();
        $('#repeatTime').val(0);
        $('#emailNotification').find('input[type="checkbox"]').prop('checked', false);
        $('#emailNotification').find('input[type="number"]').attr('disabled', 'disabled');
        $('#emailNotification').find('select').attr('disabled', 'disabled');
        $('#messageNotificaiton').find('input[type="checkbox"]').prop('checked', false);
        $('#messageNotificaiton').find('input[type="number"]').attr('disabled', 'disabled');
        $('#messageNotificaiton').find('select').attr('disabled', 'disabled');
        $('#emailNotification').find('input[type="number"]').val(30);
        $('#emailNotification').find('select').val('minutes');
        $('#messageNotificaiton').find('input[type="number"]').val(30);
        $('#messageNotificaiton').find('select').val('minutes');
        // $('#startDayForEvent').find('option').removeAttr('selected');
        //$('#endDayForEvent').find('option').removeAttr('selected');
        $('#deleteEventBtn').hide();
    }
}


function bindHoverOnShowEventDetail() {
    var detailTemplate = '<div id="eventDetailSection">Loading...' +
        '</div>';
    $('.eventBlock').unbind('popover');
    $('.eventBlock').popover({
        trigger: 'hover',
        content: detailTemplate,
        container: 'body',
        //  placement:'top',
        html: true
    });

    $('.eventBlock').on('shown.bs.popover',
        function () {
            var eventId = parseInt($(this).attr('data-eventid'));
            if (eventId == 0) {
                $('#eventDetailSection').html('<b>This is a national holiday</b>');
            } else {
                fetchEventDetail(eventId,this);
            }
        });
}

function fetchEventDetail(eventId, target) {
    var eventDetail =  $(target).attr('data-eventDetail');
    if (eventDetail != null) {
        eventDetail = JSON.parse(eventDetail);
        showEventDetailHtml(eventDetail);
    } else {
        $.ajax({
            method: 'post',
            url: '/' + lang + '/Calendar/GetEventDetail',
            data: {
                eventId: eventId
            }
        }).done(function (res) {
            eventDetail = JSON.parse(res);
            $(target).attr('data-eventDetail', res);
            showEventDetailHtml(eventDetail);
        });
    }
   

}

function showEventDetailHtml(eventDetail) {
    var repeatStr = '';
    var startTimeStr = pad2(eventDetail.StartHour) + ":" + pad2(eventDetail.StartMinute);
    var endTimeStr = pad2(eventDetail.EndHour) + ":" + pad2(eventDetail.EndMinute);
    var startDateStr = eventDetail.StartYear + "-" + pad2(eventDetail.StartMonth) + "-" + pad2(eventDetail.StartDay);
    var timeRange = '';
    if (eventDetail.Repeat == 7) {
        repeatStr = '[ Weekly ]';
        timeRange = WEEK_NAME[eventDetail.StartDayOfWeek] +
            " " +
            startTimeStr +
            " to " +
            WEEK_NAME[eventDetail.EndDayOfWeek] +
            " " +
            endTimeStr;
    }
    else if (eventDetail.Repeat == 1) {
        repeatStr = '[ Daily ]';
        timeRange =
            startTimeStr +
            " to " +
            endTimeStr;
    }
    else if (eventDetail.Repeat == -1) {
        repeatStr = '[ Monthly ]';
        timeRange = 'Monthly ' + pad2(eventDetail.StartDay) + "th" +
            " " +
            startTimeStr +
            " to " +
            'Monthly ' + pad2(eventDetail.EndDay) + "th" +
            " " +
            endTimeStr;
    } else {
        var endDateStr = eventDetail.EndYear + "-" + pad2(eventDetail.EndMonth) + "-" + pad2(eventDetail.EndDay);
        timeRange = startDateStr +
            " " +
            startTimeStr +
            " to " +
            endDateStr +
            " " +
            endTimeStr;
        repeatStr = '[ One Time ]';
    }

    var detailHtml = '';
    detailHtml += '<h4><b>' + eventDetail.EventName + '&nbsp;&nbsp;<sub>' + repeatStr + '</sub></b></h4>';
    detailHtml += '<p><b>Range: </b>' + timeRange + '</p>';
    detailHtml += '<p><b>Create Date: </b>' + startDateStr + '</p>';
    detailHtml += '<hr />';
    if (eventDetail.Description != null || eventDetail.Description != '') {
        detailHtml += '<p>' + escapeHtml(eventDetail.Description) + '</p><hr />';
    }
    

    if (eventDetail.EventUsers != null || eventDetail.EventUsers !='') {
        detailHtml += '<p><b>Participants: </b>';
        for (var i = 0; i < eventDetail.EventUsers.length; i++) {
            if (eventDetail.EventUsers[i].Active == 0) continue;
            var user = eventDetail.EventUsers[i].User;

            if (i == eventDetail.EventUsers.length - 1) {
                detailHtml += '<span>' + user.UserName + '</span>';
            } else {
                detailHtml += '<span>' + user.UserName + ', </span>';
            }
        }
        detailHtml += '</p>';
    }

    if (eventDetail.Location != null && (eventDetail.Location != '') &&  (eventDetail.Location != 'null')) {
        detailHtml += '<p><b>Location :</b> ' + eventDetail.Location + '</p>' +
            '        <iframe class="googleMapIframe" ' +
            '    width="320"' +
            '    height="250"' +
            '   frameborder="0" style="border:0"' +
            '    src="//www.google.com/maps/embed/v1/place?key=AIzaSyDhb9ModxzJDhlueEy0M9bMRNEQ-sIkULM' +
            '        &q=' +
            encodeURI(eventDetail.Location) +
            '" /><hr />';
    }
  
    if (eventDetail.MessageNotificationActive) {
        var aheadMessage = '';
        if (eventDetail.MessageNotificationBeforeMinute != null) {
            aheadMessage = eventDetail.MessageNotificationBeforeMinute + ' minutes ahead';
        } else {
            aheadMessage = eventDetail.MessageNotificationBeforeHour + ' hours ahead';
        }
        detailHtml +=
            '<p><b>Message Notification :</b> &nbsp;<span class="fa fa-toggle-on text-success" aria-hidden="true"></span>&nbsp;On <span>[ ' +
            aheadMessage +
            ' ]</span></p>';
    } else {
        detailHtml += '<p><b>Message Notification :</b>&nbsp;<span class="fa fa-toggle-off text-danger" aria-hidden="true"></span>&nbsp;Off</p>';
    }

    if (eventDetail.EmailNotificationActive) {
        var aheadEmail = '';
        if (eventDetail.EmailNotificationBeforeMinute != null) {
            aheadEmail = eventDetail.EmailNotificationBeforeMinute + ' minutes ahead';
        } else {
            aheadEmail = eventDetail.EmailNotificationBeforeHour + ' hours ahead';
        }
        detailHtml +=
            '<p><b>Email Notification :</b> &nbsp;<span class="fa fa-toggle-on text-success" aria-hidden="true"></span>&nbsp;On <span>[ ' +
            aheadEmail +
            ' ]</span></p>';
    } else {
        detailHtml += '<p><b>Email Notification :</b>&nbsp;<span class="fa fa-toggle-off text-danger" aria-hidden="true"></span>&nbsp;Off</p>';
    }

    $('#eventDetailSection').html(detailHtml);
}


function updateEventButton(target) {
    var eventId = $(target).attr('data-eventid');
    var eventObj = collectEventData();
    if (validation(eventObj)) {
        return;
    }
    eventObj.EventId = eventId;
    $.ajax({
        method: 'post',
        url: '/' + lang + '/Calendar/EditEvent',
        data: JSON.stringify(eventObj),
        contentType: 'application/json; charset=UTF-8'
    }).done(function (res) {
        if (res == 'True') {
            $('#addingEventBox').modal('toggle');
            getEvents();
        } else {
            alert('Error Happens');
        }
    });
}


function deleteEventButton(target) {
    var eventId = $(target).attr('data-eventid');
    $.ajax({
        method: 'post',
        url: '/' + lang + '/Calendar/DeleteEvent',
        data: {
            eventId:eventId 
        }
    }).done(function (res) {
        if (res == 'True') {
            $('#addingEventBox').modal('toggle');
            getEvents();
        } else {
            alert('Error Happens');
        }
    });
}