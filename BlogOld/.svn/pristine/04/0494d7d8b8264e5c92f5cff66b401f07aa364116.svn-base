
var emojiPackNum = 0;
var sessionID;
var articleID;
var commentArea;
var inlineCommentArea;
var isLogged;
var author;
var inlineComments;
var language;

function getEmoji(one) {
    $('li[role="presentation"]').removeAttr('class');
    var lang = $(one).attr('lang');
    one.parentNode.className = "active";
    emojiPackNum = one.getAttribute("data-value");
    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", completeFetchEmojiHandler, false);
    var list = document.getElementById("emojisList");
    list.innerHTML = "";
    list.innerHTML = "<img class='col-xl-12 col-lg-12 col-xl-12 col-md-12 col-sm-12' src='/Content/img/loading.gif'/>";
    var data = new FormData();
    data.append('categoaryName', one.innerHTML);
    ajax.open("POST", "/"+lang+"/Article/GetEmoji");
    ajax.responseType = "json";
    ajax.send(data);

}

function addOneEmoji(tag) {
    var emoji = $(tag).html();
    $('#CommentArticle_Content').parent().addClass("is-focused");
    CKEDITOR.instances.CommentArticle_Content.insertHtml(emoji);

   // commentArea.innerText(commentArea.innerText() + insertSymbol);
}

function completeFetchEmojiHandler(event) {
    var feedback = event.currentTarget.response;
    var list = document.getElementById("emojisList");
    list.innerHTML = "";
    for (var i = 0; i < feedback.length; i++) {
        var oneNode = "<a class=\"col-xl-1 col-lg-2 col-md-4 col-sm-4 col-xs-6 btn\"  href=\"javascript:void(0)\"  onclick=\"addOneEmoji(this)\" data-value=" + i + "> "
            + "<img class='emojiPic' src='\\" + feedback[i] + "'  style=\"width:50px;height:50px;\" /></a>";
        list.innerHTML += oneNode;
    }
    $("#emojisList").find("img").each(function () {
        var src = $(this).attr('src');
        $(this).popover({
            html: true,
            trigger: 'hover',
            placement: 'top',
            content: '<img  src="'+src+'"  style="width:250px;height:250px;" />',
            container:'body'
        });
    });
}

function updateTitle() {
    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", completeHandler, false);
    var data = new FormData();
    data.append('Title', encodeURI($('#titleModified').val()));
    data.append('SubTitle', encodeURI($('#subTitleModified').val()));
    data.append('UserID', sessionID);
    data.append('ArticleID', articleID);
    ajax.open("POST", "/Article/TitleUpdate");
    ajax.responseType = "json";
    ajax.send(data);
}

function updateArticle() {
    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", completeHandler, false);
    var data = new FormData();
    $('#articleContent').text();
    data.append('Content', encodeURI($('#articleContent').html()).replace(/\+/g, '%2B'));
    data.append('UserID', sessionID);
    data.append('ArticleID', articleID);
    ajax.open("POST", "/en/Article/ArticleUpdate");
    ajax.responseType = "json";
    ajax.send(data);
    PR.prettyPrint();
}

function completeHandler(event) {
    var feedback = event.currentTarget.response;
    if (feedback.isAccept !== null && feedback.IsAccept === 1) {
        alert("Modified Successfully");
        location.reload();
    } else {
        alert("Article Modified Failed <br>" + feedback["error"]);
    }
}

//hljs.initHighlightingOnLoad();

$(document).ready(function () {
    language = $('#lang').val();
    isLogged = $('#isLogged').val() == 'true' ? true : false;
    PR.prettyPrint();
    sessionID = $("#userId").val();
    articleID = $("#articleId").val();
    author = $("#authorId").val();
    if (sessionID != null && sessionID === author) {
        document.getElementById("ContentEditButton").style.display = "initial";
        document.getElementById("TitleEditButton").style.display = "initial";
    }
    $('#expandCommentsBtn').click(function() {
        if ($('#expandIcon').hasClass('glyphicon-chevron-down')) {
            $('#expandIcon').removeClass('glyphicon-chevron-down');
            $('#expandIcon').addClass('glyphicon-chevron-up');
        }
        else if ($('#expandIcon').hasClass('glyphicon-chevron-up')) {
            $('#expandIcon').removeClass('glyphicon-chevron-up');
            $('#expandIcon').addClass('glyphicon-chevron-down');
        }
    });


    //replay to some one
    $(".replyBtn").click(function () {
        $("#ReplyId").val($(this).attr("data-value"));
        $("#CommentTitle").html("Reply   " + $(this).attr("data-contentName") + "'s Comment:");
        $("#CommentContext").show();
        $("#CommentContext").html($(this).attr("data-content"));
    });
    //leave a message
    $("#LeaveComment").click(function () {
        $("#ReplyId").val(null);
        $("#CommentTitle").html("Leave a Comment:");
        $("#CommentContext").hide();
    });


    //$('#articleContent').find('.math-tex').each(function () {
    //    var text = this.innerHTML;
    //    this.setAttribute('data-formular1', text);
    //});
    $('#ContentEditButton').click(function () {
        var operation = this.getAttribute("data-operation");
        if (operation === "edit") {
            this.setAttribute("data-operation", "editing");
            //$('#articleContent').find(".math-tex").each(function () {
            //    var formular = this.getAttribute('data-formular1');
            //    this.innerHTML = formular;
            //    this.removeAttribute('data-formular1');
            //});
            $('#articleContent').find("pre").each(function () {
                var content = getRawCodeContent(this);
                $(this).text(content);
                $(this).removeClass('prettyprinted');
            });
            $('.runCodeLink').remove();
            if (!CKEDITOR.instances.articleContent) {
                CKEDITOR.disableAutoInline = true;
                $('#articleContent').attr('contenteditable', 'true');
                CKEDITOR.inline('articleContent', {
                    //filebrowserImageBrowseUrl: '/home/ViewImage/' + sessionID + '',
                    //filebrowserImageUploadUrl: '/home/UploadImage/' + sessionID + '',
                    startupFocus: true
                });
                PR.prettyPrint();
                this.innerHTML = "Finish Edit";
            }
            $('#articleContent').unbind('mouseup');
        }
        else {

            $('#articleContent').attr('contenteditable', 'false');
            if (CKEDITOR.instances.articleContent)
                CKEDITOR.instances.articleContent.destroy();
            updateArticle();
            this.innerHTML = "<span class=\"glyphicon glyphicon-edit\"></span>";
            this.setAttribute("data-operation", "edit");
        }
    });


    //resize event
    $(window).resize(function () {
        resizeImgAndTable();
    });

    addPopoversForImgs();
    replaceWithCKEditor();
    resizeImgAndTable();
    detectCodeSectionAndAppendRunCodeLink();
    addTagEvent();
    fetchInLineComments();
    bindHighlightSentense();
    windowScollerEvent();
});


function showAllHighlights() {
    $('span[data-inlinecommentid]').each(function () {
        showInlineCommentDetail(this);
    });
}

function getRawCodeContent(target) {
    var code = "";
    $(target).find('li').each(function () {
        code += $(this).text() + "\n";
    });

    if ($(target).find('li').length > 0) {
        return code;
    } else {
        return $(target).text();
    }
}

function shareFacebook(e) {
    var href = $(e).attr('data-url');
    FB.ui({
        method: 'share',
        display: 'popup',
        href: href
    }, function (response) { });
}


function showShareWeChatModal() {
    $('#wechatshare').modal();
    var url = "//chart.apis.google.com/chart?cht=qr&chs=104x104&chld=L|0&chl="+$('meta[property="og:url"]').attr('content');
    $('#qrcode').attr('src', url);
}

function replaceWithCKEditor() {
    $('#Comment').on('show.bs.modal',
        function () {
            if (CKEDITOR.instances.CommentArticle_Content)
                CKEDITOR.instances.CommentArticle_Content.destroy();
            commentArea = CKEDITOR.replace('CommentArticle_Content',
                {
                    customConfig: '/Scripts/ckeditor/config_abbr.js'
                });
        });


    $('#codeRun').on('hide.bs.modal',
        function () {
           location.reload();
        });
}

function addPopoversForImgs() {
    $('#emojiEntry[data-toggle="popover"]').popover({
        html: true,
        trigger: 'click',
        content: function () {
            return $("#emojiPack").html();
        }
    }).click(function (e) {
        e.preventDefault();
    });
    $("img.emojiPic").each(function () {
        var src = $(this).attr('src');
        $(this).popover({
            html: true,
            trigger: 'hover',
            content: '<img  src="' + src + '"  style="width:250px;height:250px;" />',
            container: 'body',
            placement: 'top'
        }).click(function (e) {
            e.preventDefault();
        });
    });

}
function resizeImgAndTable() {
    var winWidth = $("#articleContent").width();
    $("img").each(function () {
        if (this.naturalWidth > winWidth) {
            $(this).css("width", "");
            $(this).css("height", "");
            $(this).addClass("col-lg-12  col-md-12  col-sm-12  col-xs-12");
        }
    });
    $("table").each(function () {
        if (this.naturalWidth > winWidth) {
            $(this).css("width", "");
            $(this).css("height", "");
            $(this).addClass("col-lg-12  col-md-12  col-sm-12  col-xs-12");
        }
    });

    $("video").each(function() {
        $(this).css("width", "100%");
        $(this).css("height", "100%");
    });
    
}





var java_template_1 = function (code) {
    code = code.replace(new RegExp('\n', 'g'), "\n  ");
    return ""+
    "import java.util.*;\n" +
    "public class Main {\n" +
        "   public static void main(String args[]) {\n" +
        "       Solution solution = new Solution();\n" +
        "       //write your own test cases \n" +
        "       //like : System.out.println(solution.abc());\n" +
        "       \n" +
        "       \n" +
        "   }\n" +
        "   \n" +
        "   \n" +
        "   public static class Solution{\n\n" +
        "       " + code +
        "\n\n    }\n" +
        "}";
}

var c_sharp_template_1 = function (code) {
    code = code.replace(new RegExp('\n', 'g'), "\n  ");
    return ""+
    "using System; \n"+
        "using System.Collections.Generic;\n" +
        "public class Program\n" +
    "{\n" +
        "   static void Main()\n" +
        "   {\n" +
        "       Solution solution = new Solution();\n" +
        "       //write your own test cases \n" +
        "       //Like: Console.Write(solution.getOne());\n" +
        "       \n" +
        "   }\n" +
        "   private class Solution{\n"+
        "       " + code +
        "       \n" +
        "   }\n" +
        "}";
}
var code_templates = [java_template_1, c_sharp_template_1];

var editor = null;
var language = null;
function showRunCodeModal(target) {
    var preSegment = $(target).prev();
     language = preSegment.attr('data-pbcklang');
     $('#executeBtn').attr('data-language', language);
    var rawCode = getRawCodeContent(preSegment);
    $('#rawCode').text(rawCode);
    $.getScript("/Scripts/AceEditor/src/ace.js").done(function () {
        ace.config.set('basePath', '/Scripts/AceEditor/src');
        editor = ace.edit("codeEditor");
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/" + language);
        editor.session.setValue(rawCode);
        editor.clearSelection();
    });

    $('#currentLanguage').text(language);
    prevCodeBackUp = null;

    resize(-1);
    $('#executeBtn').text('Execute');
    $('#executeBtn').removeAttr('disabled');
    $('#templateSelector').removeAttr('disabled');
    $('#templateSelector').val(-1);
    $('#execute-result').html('');
    $('#codeRun').modal();
}

function detectCodeSectionAndAppendRunCodeLink() {
    var runningCodeHtml =
        "<a  onclick='showRunCodeModal(this)' class='btn-link runCodeLink cursor-pointer'>Execute the code</a>";
    $("#articleContent").find("pre[data-pbcklang='java']").each(function () {
        $(this).after(runningCodeHtml);
    });
    $("#articleContent").find("pre[data-pbcklang='csharp']").each(function () {
        $(this).after(runningCodeHtml);
    });
}


function executeCode(target) {
    var lang = $('#lang').val();
    $(target).text('Executing...');
    $(target).attr('disabled', 'disabled');
    var language = $(target).attr('data-language');
    $('#execute-result').html("running the program...");
    $.ajax({
        method:'post',
        url: "/"+lang+"/Article/RunCode",
        data: {
            codeEncoded: htmlEncode(editor.getValue()),
            language: language
        }
    }).done(function (res) {
        var feedback = JSON.parse(res);
        if (feedback == null) {
            alert('Error happened');
            return;
        }
        //console.log(feedback);
        $(target).text('Execute');
        $(target).removeAttr('disabled');
        var runningTime = "compiled and executed in " + feedback.executeTime+" second(s)\n";
        $('#execute-result').html(  runningTime +"########################  Result  #######################\n"+feedback.output);

    });
}

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

var prevCodeBackUp = null;

function addTemplate(target) {
    var idx = $(target).val();
    if (idx == -1) {
        if (prevCodeBackUp != null) {
            editor.setValue(prevCodeBackUp);
        }
        return;
    }
    var code;
    if (prevCodeBackUp == null) {
        code = editor.getValue();
        prevCodeBackUp = code;
    } else {
        code = prevCodeBackUp;
    }
    var appendedCode = code_templates[idx](code);
    editor.setValue(appendedCode);
    editor.clearSelection();
    $(target).attr('disabled', 'disabled');

}


function resetCode() {
    prevCodeBackUp = null;
    $('#templateSelector').removeAttr('disabled');
    $('#templateSelector').val(-1);
    $('#execute-result').html('');
    editor.setValue($('#rawCode').text());
}


function resize(flag) {
    if (flag == 1) {
        $("#codeRun").addClass('full-screen');
        $("#resizeBtn").attr('onclick', "resize(-1)");
        $("#resizeBtn").html("<span class='glyphicon glyphicon-resize-small'></span>");
    } else {
        $("#codeRun").removeClass('full-screen');
        $("#resizeBtn").attr('onclick', "resize(1)");
        $("#resizeBtn").html("<span class='glyphicon glyphicon-resize-full'></span>");
    }

}


///=======================tag system ====================
function addTagEvent() {
    $('#articleContent').mouseup(function() {
       var selection = document.getSelection();
       if (selection.anchorNode.toString().trim().length === 0) {
            return;
        }
        var range = selection.getRangeAt(0);
        if (range && !selection.isCollapsed) {
            if (selection.anchorNode.parentNode == selection.focusNode.parentNode) {
                var span = document.createElement('span');
                span.className = "range-selected";
                $('.range-selected').each(function () {
                    this.className = "range-selected-expired";
                });
                $('.comment-icon').remove();
                $('#arrowToRight').remove();
                $('.inline-comment').remove();
                range.surroundContents(span);
               var icon= $('<span class="fa fa-commenting comment-icon" style="display:block;position:absolute" onclick="showTagBox(this)"></span>');
               var offset = $('.range-selected').offset();
               offset.top -= 15;
               icon.offset(offset);
                $('body').append(icon);
                $('.range-selected-expired').each(function () {
                    this.outerHTML = this.innerHTML;
                });
                return;
            }
        }

        $('.range-selected').each(function () {
            this.outerHTML = this.innerHTML;
        });
        $('#arrowToRight').remove();
        $('.inline-comment').remove();
        $('.comment-icon').remove();
    });
}

function showTagBox(target) {
    if ($('#arrowToRight').length > 0) {
        $('#arrowToRight').remove();
        $('.inline-comment').remove();
        return;
    }
    var offset = $(target).offset();
    var rightSide = $('#articleContent').width() + $('#articleContent').offset().left;
    if (window.innerWidth - rightSide < 500) {
        rightSide = Math.max(offset.left, window.innerWidth - 500);
    }
    var len = rightSide - offset.left + 30;
    var verticalLine = $('<canvas id="arrowToRight" style="display:block;position:absolute;color:yellow" height="20" width="' + len + '"></canvas>');
    offset.left += 16;
    offset.top += 3;
    verticalLine.offset(offset);
    $('body').append(verticalLine);
    appendAttachedInputBox();
}

function appendAttachedInputBox() {
    $('.inline-comment').remove();
    var arrow = document.getElementById("arrowToRight");
    var width = arrow.width;
    var ctx = arrow.getContext('2d');
    ctx.font = "8px Georgia";
    ctx.fillText("Please Comment", width / 2, 8);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#337ab7";
    ctx.moveTo(0, 10);
    ctx.lineTo(width, 10);
    ctx.lineTo(width - 10, 5);
    ctx.moveTo(width, 10);
    ctx.lineTo(width - 10, 15);
    ctx.stroke();

    var offset = $('#arrowToRight').offset();
    var quote = $('.range-selected').text();
    offset.left += width;
    var actionStr = '';
    if (isLogged) {
        actionStr = '<span class="btn btn-sm btn-raised btn-primary" onclick="submitInLineComment(this)">Comment</span>';
    } else {
        actionStr = '<span class="text-danger">Please <a class="btn-link" href="../../Admin">log in</a> to create inline comment</span>';
    }
    var commentPanel = $('<div class="cell shadow--2dp inline-comment" >' +
        '<div><button type="button" class="close pull-right" onclick="removeCurrentCommentBox(this)">×</button><b>Inline Comment:</b></div>' +
        '<div><blockquote>' + quote + '</blockquote><textarea class="form-control"  id="inline-comment-box" rows="2"></textarea></div>' +
        '<div>' + actionStr + '</div>' +
        '</div>');
    commentPanel.css('width', window.innerWidth - offset.left - 25 + 'px');
    commentPanel.offset(offset);
    $('body').append(commentPanel);
    inlineCommentArea = CKEDITOR.replace('inline-comment-box',
        {
            customConfig: '/Scripts/ckeditor/config_abbr.js'
        });
}

function removeCurrentCommentBox(target) {
    $(target).parent().parent().remove();
    $('.comment-icon').remove();
    $('#arrowToRight').remove();
    $('.range-selected').each(function() {
        this.outerHTML = this.innerHTML;
    });

}


function submitInLineComment(target) {
    $(target).attr('disabled', 'disabled');
    $(target).text('Submitting...');
    var content = encodeURI($('#articleContent').html()).replace(/\+/g, '%2B');
    var inlineComment = encodeURI(inlineCommentArea.getData());
    $.ajax({
        method: 'post',
        url: '../LeaveInLineComment',
        data: {
            articleContent: content,
            commentContent: inlineComment,
            articleId:articleID
        }
    }).done(function (res) {
        $(target).removeAttr('disabled');
        $(target).text('Commit');
        alert(res);
        location.reload();
    });

}


function relyInlineComment(target) {
    $(target).attr('disabled', 'disabled');
    $(target).text('Submitting...');
    var replyId = $(target).attr('data-relyid');
    var inlineComment = encodeURI(inlineCommentArea.getData());
    $.ajax({
        method: 'post',
        url: '../ReplyInLineComment',
        data: {
            commentContent: inlineComment,
            articleId: articleID,
            replyId: replyId
        }
    }).done(function (res) {
        $(target).removeAttr('disabled');
        $(target).text('Reply');
        alert(res);
        location.reload();
    });
}
function fetchInLineComments() {
    $.ajax({
        method: 'get',
        url: '../GetAllInLineComments',
        data: {
            articleId: articleID
        }
    }).done(function(res) {
        inlineComments = JSON.parse(res);
        showAllHighlights();
    });
}

function bindHighlightSentense() {
    $('span[data-inlinecommentid]').click(function() {
        showInlineCommentDetail(this);
    });
}


function showInlineCommentDetail(item) {
    var commentId = $(item).attr('data-inlinecommentid');
    var detail = null;
    for (var i = 0; i < inlineComments.length; i++) {
        if (inlineComments[i].InLineCommentId == commentId) {
            detail = inlineComments[i];
            break;
        }
    }
    if (detail == null) {
        return;
    }

    if ($('.connector[data-inlinecommentid="' + commentId + '"]').length > 0) {
        $('.connector[data-inlinecommentid="' + commentId + '"]').remove();
        var target = $('.inline-comment-viewbox[data-inlinecommentid="' + commentId + '"]');
        adjustInlineViewBox(target, 0);
        target.remove();
        return;
    }
    var offset = $(item).offset();
    var rightSide = $('#articleContent').width() + $('#articleContent').offset().left;
    if (window.innerWidth - rightSide < 500) {
        rightSide = Math.max(offset.left, window.innerWidth - 500);
    }
    var len = rightSide - offset.left + 30;
    offset.left += 16;
    offset.top -= 12;
    var connector = $('<canvas class="connector" style="display:block;position:absolute;" height="20" width="' +
        len +
        '" data-inlinecommentid="' + commentId + '"></canvas>');
    connector.offset(offset);
    $('body').append(connector);
    drawConnector(connector[0].getContext('2d'), len);
    offset.left += len;
    drawPanel(detail,offset);
}

function drawConnector(ctx,width) {
    ctx.font = "8px Georgia";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ff0";
    ctx.moveTo(0, 20);
    ctx.lineTo(20, 10);
    ctx.lineTo(width, 10);
    ctx.lineTo(width - 10, 5);
    ctx.moveTo(width, 10);
    ctx.lineTo(width - 10, 15);
    ctx.stroke();
}

function drawPanel(detail, offset) {
    var commentPanel = $('<div class="cell shadow--2dp inline-comment-viewbox" data-inlinecommentid="' + detail.InLineCommentId+ '">' +
        '<div><button type="button" class="close pull-right" onclick="removeViewCommentBox(this)">×</button><b>Comments:</b></div>' +
        '<div class="body"></div>');
    var bodyHtml = appendCommentBody(detail,1);
    commentPanel.children('.body').html(bodyHtml);
    commentPanel.css('width', window.innerWidth - offset.left - 25 + 'px');
    $('body').append(commentPanel);
    commentPanel.offset(offset);
}

function removeViewCommentBox(target) {
    var block = $(target).parent().parent();
    var inlinecommentid = block.attr('data-inlinecommentid');
    block.remove();
    $('.connector[data-inlinecommentid="' + inlinecommentid + '"]').remove();
}


function appendCommentBody(detail,level) {
    var imgUrl = '//placehold.it/30';
    var createDate = new Date(detail.CreateDate);
    if (detail.ProfileImageName != null) {
        imgUrl = "/Content/users/" + detail.UserId + "/profile/" + detail.ProfileImageName;
    }
    var commentContent = $('<div/>').html(detail.Content).text();
    var replies = '';
    for (var i = 0; i < inlineComments.length; i++) {
        if (inlineComments[i].ReplyId == detail.InLineCommentId) {
            replies += appendCommentBody(inlineComments[i],level+1);
        }
    }
    var actionWording = level == 1 ? "said" : "replied";
    var mainInfo = '<div comment-id="' + detail.InLineCommentId + '" class="list-group-item inline-comment-box"><image src="' + imgUrl + '" width="30" height="30" >' +
        '<span><a class="cursor-pointer btn-link" href="/' + language + '/User/Index/' + detail.UserId + '">' + detail.UserName + '</a><small class="text-muted"> ' + actionWording + ' on ' + createDate.toLocaleDateString(lang) + ' :</small>' +
        ' <span class="pull-right glyphicon glyphicon-comment cursor-pointer btn-link" onclick="replyInlineComment(this)"></span> </span>' +
        '<div>' + commentContent + '</div>' +
        '<div class="relies">' + replies + '</div>'+
        '</div>';
    return mainInfo;

}


function replyInlineComment(target) {
    var block = $(target).parent().parent();
    var replyId = block.attr('comment-id');
    if ($(block).children('.inlineCommentReplyBox').length > 0) {
        $(target).attr('class', 'pull-right glyphicon glyphicon-comment cursor-pointer btn-link');
        $('.inlineCommentReplyBox').remove();
        $('#inline-comment-box').remove();
        return;
    }
    $('span[onclick="replyInlineComment(this)"]').attr('class',
        'pull-right glyphicon glyphicon-comment cursor-pointer btn-link');
    $(target).attr('class', 'pull-right glyphicon glyphicon-remove cursor-pointer btn-link text-danger');
    
    var actionStr;
    if (isLogged) {
        actionStr = '<span class="btn btn-sm btn-raised btn-primary" onclick="relyInlineComment(this)" data-relyid="' +
            replyId +
            '">Reply</span></div>';
    } else {
        actionStr = '<span class="text-danger">Please <a class="btn-link" href="../../Admin">log in</a> to reply</span>';
    }
    var commentPanel = $('<div class="inlineCommentReplyBox"><textarea class="form-control"  id="inline-comment-box" rows="2"></textarea><div>' + actionStr + '</div>');
    $('.inlineCommentReplyBox').remove();
    $('#inline-comment-box').remove();
    block.append(commentPanel);

    inlineCommentArea = CKEDITOR.replace('inline-comment-box',
        {
            customConfig: '/Scripts/ckeditor/config_abbr.js'
        });

}



function showAllInlineComments(target) {
    $('span[data-inlinecommentid]').each(function () {
        var commentid = $(this).attr('data-inlinecommentid');
        if ($('.inline-comment-viewbox[data-inlinecommentid="' + commentid + '"]').length > 0) {
            return;
        }
        showInlineCommentDetail(this);
    });
    $(target).children('span').attr('class', 'glyphicon glyphicon-eye-open');
    $(target).attr('onclick', 'hideAllInlineComments(this)');
}

function hideAllInlineComments(target ){
    $('span[data-inlinecommentid]').each(function () {
        var commentid = $(this).attr('data-inlinecommentid');
        if ($('.inline-comment-viewbox[data-inlinecommentid="' + commentid + '"]').length == 0) {
            return;
        }
        showInlineCommentDetail(this);
    });
    $(target).children('span').attr('class', 'glyphicon glyphicon-eye-close');
    $(target).attr('onclick', 'showAllInlineComments(this)');
}

function adjustInlineViewBox(target,prevHeight) {
    var height = $(target).outerHeight() - prevHeight;
    $(target).nextAll("div.inline-comment-viewbox").each(function() {
        var offset = $(this).offset();
        offset.top += height;
        $(this).offset(offset);
    });

}

function windowScollerEvent() {
    if (!isLogged) return false;
    var maginBlock = $('<div class="fillBlock pull-right" style="margin:10px 1px;padding: 4px 15px;"></div>');
    var editBtn = $('#ContentEditButton');
    maginBlock.width(editBtn.width());
    maginBlock.height(editBtn.height());
    var toTop = editBtn.offset().top;
    var toLeft = editBtn.offset().left;
    $(window).scroll(function () {
        if (sessionID == null || sessionID != author) {
            return;
        }
        var scroll = $(window).scrollTop();
        if (scroll >= toTop - 10) {
            editBtn.before(maginBlock);
            editBtn.attr('style', 'position:fixed;top:0;left:' + toLeft + 'px;z-index:999');
        } else {
            $('.fillBlock').remove();
             editBtn.removeAttr('style');
        }
    });
}