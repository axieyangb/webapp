var replyTable;
var articleTable;
var codeTable;
var calendarTable;
var lang = 'en';
$(document).ready(function () {
    $('.side-nav > #Index>a').css("color", "#fff");

    getComments();
    getArticles();
    getCodes();
    getCalendarSessions();
});
function DeleteComment(e) {
    var id = e.getAttribute('data-commentId');
    if (id != null) {
        $.ajax({
            url: '/' + lang + '/Dashboard/CommentDelete',
            data: {
                commentId: id
            }, type: 'POST'
        }).done(function (msg) {
            if (msg === "True") {
                getComments();
                $('#ConfirmClose').click();
            }
        });
    }
}

function DeleteArticle(e) {
    var id = e.getAttribute('data-articleId');
    if (id != null) {
        $.ajax({
            url: '/' + lang + '/Dashboard/ArticleDelete',
            data: {
                articleId: id
            }, type: 'POST'
        }).done(function (msg) {
            if (msg === "True") {
                getArticles();
                $('#ConfirmClose').click();
            }
        });
    }
}
function CodeDelete(target) {
    var id = $(target).attr('data-codeid');
    if (id != null) {
        $.ajax({
            url: '/' + lang + '/CodingPad/DeleteCode?codeId=' + id
        }).done(function () {
            getCodes();
            $('#ConfirmClose').click();
        });
    }
}


function showDetailModal(caller) {
    $('#replyDetail').focus();
    var content = $(caller).attr('data-content');
    var node = caller.parentElement;
    for (var i = 0; i < 6; i++) {
        node = node.previousElementSibling;
    }
    var title = node.childNodes[1].getAttribute('data-title');
    $('#replyDetailTitle').html(title);
    $('#replyDetailBody').html(content);

    $("img.emojiPic").each(function () {
        var src = $(this).attr('src');
        $(this).popover({
            html: true,
            trigger: 'hover',
            content: '<img  src="' + src + '"  style="width:250px;height:250px;" />',
            container: 'body',
            placement: 'buttom'
        }).click(function (e) {
            e.preventDefault();
        });
    });

    $('[data-toggle="popover"]').unbind('popover');
    $('#replyDetail').modal();
}

function showConfirmModal(target) {
    $('#confirm').focus();
    var actionCode = $(target).attr("data-actionCode");
    if (actionCode != null)
        actionCode = parseInt(actionCode);
    //delete
    if (actionCode === 1) {
        var commentId = $(target).attr('data-commentId');
        $("#confirmTitle").html("Delete");
        $("#confirmBody").html("Do you want to delete this comment");
        $("#actionButton").attr('class', 'btn btn-danger');
        $("#actionButton").attr('data-commentId', commentId);
        $("#actionButton").html('Delete');
        $("#actionButton").attr('onClick', 'DeleteComment(this)');
    }
    else if (actionCode === 2) {
        var articleId = $(target).attr('data-articleId');
        $("#confirmTitle").html("Delete");
        $("#confirmBody").html("Do you want to delete this article");
        $("#actionButton").attr('class', 'btn btn-danger');
        $("#actionButton").attr('data-articleId', articleId);
        $("#actionButton").html('Delete');
        $("#actionButton").attr('onClick', 'DeleteArticle(this)');
    }

    else if (actionCode === 3) {
        var codeId = $(target).attr('data-codeId');
        $("#confirmTitle").html("Delete");
        $("#confirmBody").html("Do you want to delete this code");
        $("#actionButton").attr('class', 'btn btn-danger');
        $("#actionButton").attr('data-codeId', codeId);
        $("#actionButton").html('Delete');
        $("#actionButton").attr('onClick', 'CodeDelete(this)');
    }
    else if (actionCode === 4) {
        var sessionId = $(target).attr('data-sessionId');
        $("#confirmTitle").html("Delete");
        $("#confirmBody").html("Do you want to delete this session");
        $("#actionButton").attr('class', 'btn btn-danger');
        $("#actionButton").attr('data-sessionId', sessionId);
        $("#actionButton").html('Delete');
        $("#actionButton").attr('onClick', 'CalendarDelete(this)');
    }
    $('#confirm').modal();
}



function getComments() {
    $.ajax({
        url: '/' + lang + '/Dashboard/GetComments'
    }).done(function (res) {
        var comments = JSON.parse(res);
        $('#replyTable').prev().hide();

        if (replyTable == null) {
            replyTable = $("#replyTable").DataTable({
                scrollX: true,
                responsive: true,
                order:[4,'desc']
            });
        } else {
            replyTable.clear();
        }
        $('#commentsNum').text(comments.length);
        for (var i = 0; i < comments.length; i++) {
            var comment = comments[i];
            replyTable.row.add([
                "<a href='/" +
                lang +
                "/Article/Index/" +
                comment.ArticleId +
                "'  target='_blank' data-title='" +
                comment.Title +
                "'>" +
                comment.Title +
                "<a>",
                comment.CommentName,
                comment.Email,
                comment.Country,
                new Date(comment.CreateDate).toLocaleDateString(lang),
                comment.ReplyName,
                "<a class='btn btn-link' data-content='" +
                comment.Content +
                "' onclick='showDetailModal(this)'>Detail</a>",
                "<button class='btn  btn-sm btn-default' data-actionCode='1' data-commentId='" +
                comment.CommentId +
                "' onclick='showConfirmModal(this)'>Delete</button>"
            ]);
        }
        replyTable.draw();
        $('#replyTable  >tbody').show();
    });
}

function getArticles() {
    $.ajax({
        url: '/' + lang + '/Dashboard/GetArticles'
    }).done(function (res) {
        var articles = JSON.parse(res);
        $('#articleTable').prev().hide();
        if (articleTable == null) {
            articleTable = $("#articleTable").DataTable({
                scrollX: true,
                responsive: true,
                order:[1,'desc']
            });
        } else {
            articleTable.clear();
        }
        $('#articlesNum').text(articles.length);
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            articleTable.row.add([
                "<a href='/" +
                lang +
                "/Article/Index/" +
                article.ArticleId +
                "' target='_blank'>" +
                article.Title +
                "</a>",
                new Date(article.PostDate).toLocaleDateString(lang),
                article.ModifyDate == null ? "" : new Date(article.ModifyDate).toLocaleDateString(lang),
                "<button class='btn  btn-sm btn-default' data-actionCode='2' data-articleId='" +
                article.ArticleId +
                "' onclick='showConfirmModal(this)'>Delete</button>"
            ]);
        }
        articleTable.draw();
        $('#articleTable  >tbody').show();
    });
}


function getCodes() {
    $.ajax({
        url: '/' + lang + '/Dashboard/GetCodes'
    }).done(function (res) {
        var codes = JSON.parse(res);
        $('#codeTable').prev().hide();
        if (codeTable == null) {
            codeTable = $("#codeTable").DataTable({
                scrollX: true,
                responsive: true,
                order:[3,'desc']
            });
        } else {
            codeTable.clear();
        }


        $('#codesNum').text(codes.length);
        for (var i = 0; i < codes.length; i++) {
            var code = codes[i];
            codeTable.row.add([
                "<a href='/" +
                lang +
                "/CodingPad/Index/" +
                code.CodeID +
                "' target='_blank'>" +
                code.CodeTitle +
                "</a>",
                code.CodeLanguage,
               (code.Shared == 1 ? "<span class='text-success cursor-pointer' data-codeId='" + code.CodeID + "' onclick='shareCode(this,-1)'><span class='glyphicon glyphicon-link'></span>&nbsp;&nbsp;shared</span>"
               : "<span class='text-muted cursor-pointer'  data-codeId='" + code.CodeID + "' onclick='shareCode(this,1)'><span class='glyphicon glyphicon-link'></span>&nbsp;&nbsp;unshared</span>"),
                code.LastEditDate == null ? "" : new Date(code.LastEditDate).toLocaleDateString(lang),
                "<button class='btn btn-default  btn-sm' data-actionCode='3' data-codeId='" +
                code.CodeID +
                "' onclick='showConfirmModal(this)'>Delete</button>"
            ]);
        }
        codeTable.draw();

        $('#codeTable >tbody').show();

    });
}


function shareCode(target, flag) {
    var codeId = $(target).attr('data-codeid');
    $.ajax({
        url: '/' + lang + '/CodingPad/ShareCode',
        data: {
            codeId: codeId,
            flag: flag
        }
    }).
done(function () {
            getCodes();
        });

}

function getCalendarSessions() {
    $.ajax({
        method:'post',
        url: '/' + lang + '/Calendar/GetSessions'
    }).done(function (res) {
        $('#calendarTable').prev().hide();

        var calendars = JSON.parse(res);
        $('#calendarNum').text(calendars.length);
        if (calendarTable == null) {
            calendarTable = $("#calendarTable").DataTable({
                scrollX: true,
                responsive: true,
                order: [3, 'desc']
            });
        } else {
            calendarTable.clear();
        }

        for (var i = 0; i < calendars.length; i++) {
            var calendar = calendars[i];
            var permissionStr;
            var actionStr = '';
            var editorStr = '';
            if (calendar.IsCreator) {
                permissionStr = '<span calss="label label-primary">Owner</span>';
                actionStr = "<button class='btn btn-sm btn-default' data-actionCode='4' data-sessionId='" +
                    calendar.SessionId +
                    "'  onclick='showConfirmModal(this)'>Delete</button>";

                editorStr =
                    "&nbsp;&nbsp;<span class='cursor-pointer glyphicon glyphicon-wrench' aria-hidden='true' onclick='showDetailOfCalendar(this)' data-name='" + calendar.Name + "' data-invitors='" + JSON.stringify(calendar.Invitors) + "'></span>";
            } else {
                permissionStr = '<span calss="label label-info">Invited</span>';
            }
            calendarTable.row.add([
                "<a data-sessionId='" +
                calendar.SessionId +
                "' href='/" +
                lang +
                "/Calendar/Index/" +
                calendar.SessionGuid.Value +
                "' target='_blank'>" +
                calendar.Name +
                "</a>"+editorStr,
                
                calendar.CalendarsNum,
                calendar.EventNum,
                new Date(calendar.CreateDate).toLocaleDateString(lang),
                permissionStr,
                actionStr
            ]);
        }
        $('#calendarTable > tbody').show();
        calendarTable.draw();
    });
}


function CalendarDelete(target) {
    var sessionId = $(target).attr('data-sessionId');
    $.ajax({
        method: 'post',
        url: '/' + lang + '/Calendar/DeleteSession',
        data: {
            sessionId:sessionId
        }
    }).done(function(res) {
       if (res.startsWith("Error")) {
           alert(res);
           return;
       }
        $('#confirm').modal('toggle');
        getCalendarSessions();
    });
}



function createSession() {
    $('#manipulateCalendar').modal();
}


function createCalendar() {
    var calendarName = $('#calendarName').val();
    var oneSession = {};
    oneSession.Name = calendarName;
    $.ajax({
    method:'post',
        url: '/' + lang + '/Calendar/CreateSession',
        data: JSON.stringify(oneSession),
        contentType: 'application/json; charset=UTF-8'
    }).done(function(res) {
        if (res == 'True') {
            $('#manipulateCalendar').modal('toggle');
            getCalendarSessions();
            return;
        }
        alert('Error happens');
    });
}


function showDetailOfCalendar(target) {
    var sessionId = $(target).prev().attr('data-sessionid');
    var calendarname = $(target).attr('data-name');
    var invitors = JSON.parse($(target).attr('data-invitors'));
    var listHtml = '';
    for (var i = 0; i < invitors.length; i++) {
        var invitor = invitors[i];
        listHtml += '<li class="list-group-item" data-userid ="' + invitor.UserId + '">' + invitor.Name + '<span class="glyphicon glyphicon-minus text-danger pull-right cursor-pointer" onclick="deleteCurrentInvitor(this)"></span></li>';
    }
    $('#invitorList').html(listHtml);
    $('.newInvitor').remove();
    $('#currentCalendarName').val(calendarname);
    $('#calendarDetailBox').attr('data-sessionid', sessionId);
    $('.updateFeedback').remove();
    $('#calendarDetailBox').modal();
}

function addNewInvitor() {
    $('.newInvitor').remove();
    var newLine = '<li class="list-group-item newInvitor" ><span class="input-group"><input  class="form-control" placeholder="Registered user name or nick name"/><span class="btn btn-xs btn-primary input-group-addon" onclick="searchUserByName(this)">Search</span></span><div id="matchedUserList"></div></li>';
    $('#invitorList').append(newLine);
}

function searchUserByName(target) {
    var name = $(target).prev().val();
    $.ajax({
        url: '/' + lang + '/Dashboard/SearchMemberByName',
        data: { 
            userName: name
        }
    }).done(function(res) {
        var matchedUsers = JSON.parse(res);
        var userListHtml='';
        for (var i = 0; i < matchedUsers.length; i++) {
            var user = matchedUsers[i];
            userListHtml += '<span class="list-group-item" > <b>User Name:</b>' + user.UserName + ' &nbsp;&nbsp;<b> NickName :</b>' + user.NickName + '' +
                '<span class="btn btn-xs btn-primary pull-right" data-userid="' + user.UserId + '" data-name="'+user.UserName+'" onclick="addInvitor(this)" ><span class="glyphicon glyphicon-plus"></span></span></span>';

        }
        $('#matchedUserList').html(userListHtml);
    });
}


function addInvitor(target) {
    var userId = $(target).attr('data-userid');
    var username = $(target).attr('data-name');
    var sessionId = $('#calendarDetailBox').attr('data-sessionid');
    $.ajax({
        url: '/' + lang + '/Calendar/AddInvitor',
        data: {
            userId: userId,
            sessionId: sessionId
        }
    }).done(function(res) {
        $('#matchedUserList').empty();
        if (res == 'True') {
            $('.newInvitor').before('<li class="list-group-item" data-userid ="' +
                userId +
                '">' +
                username +
                '<span class="glyphicon glyphicon-minus text-danger pull-right cursor-pointer"  onclick="deleteCurrentInvitor(this)"></span></li>');
            $('.newInvitor').find('input').val('');
            getCalendarSessions();

        } else {
            $('#matchedUserList').html('<span class="alert alert-danger list-group-item">Error happens</span>');
        }
    });
}


function deleteCurrentInvitor(target)
{
   var userId= $(target).parent().attr('data-userid');
   var sessionId = $('#calendarDetailBox').attr('data-sessionid');
    $.ajax({
        url: '/' + lang + '/Calendar/DeleteInvitor',
        data: {
            userId: userId,
            sessionId: sessionId
        }
    }).done(function(res) {
        if (res == 'True') {
            $('li[data-userid="' + userId + '"]').remove();
            getCalendarSessions();
        }
        else {
            alert('Inner error happens');
        }
    });
}


function updateSessionName() {
    var sessionName = $('#currentCalendarName').val();
    var sessionId = $('#calendarDetailBox').attr('data-sessionid');
    $.ajax({
        url: '/' + lang + '/Calendar/ChangeSessionName',
        data: {
            sessionName: sessionName,
            sessionId: sessionId
        }
    }).done(function (res) {
        if (res == 'True') {
            getCalendarSessions();
            $('#currentCalendarName')
                .after('<div class="bg-sucess updateFeedback">You have successfully update the Calendar name</div>');
        }
        else {
            alert('Inner error happens');
        }
    });
}