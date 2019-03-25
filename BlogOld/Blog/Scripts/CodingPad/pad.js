var lang;
var codeId = null;
var editor;
var LANGUAGE = {
    JAVA: 0,
    CSHARP: 1
}
var language;

//template
var languageName = ["java", "csharp"];

var java_template = "// package whatever; // don't place package name! \n" +
    "import java.io.*; \n\n" +
    "import java.util.*; \n\n" +
    "public class Main {\n" +
    "\tpublic static void main (String[] args) throws java.lang.Exception\n" +
    "\t{\n" +
    "\t\tSystem.out.println(\"Hello Java\");\n" +
    "\t}\n" +
    "}\n" +
    "\n";

var csharp_template = "using System;\n\n" +
    "public class Test {\n" +
    "\tpublic static void Main()\n" +
    "\t{\n" +
    "\t\tConsole.WriteLine(\"Hello\");\n" +
    "\t}\n" +
    "}\n" +
    "\n";


var code_templates = [java_template, csharp_template];




$(document).ready(function () {
    language = parseInt($("#languageSelectionMenu").val());
    lang = $('#lang').val();;
    initialTheEditor();
    initializeTheSplitter();
    intervalSavingToCookie();
    resizeTheEditor();
});

function resizeTheEditor() {
    var curWidth = $("#editorPanel").width() * 0.7;
    $("#codingPanel").css("flex-basis", curWidth + "px");
}

function initialTheEditor() {
    if (editor == null) {
        editor = ace.edit("codingPanel");
        editor.setTheme("ace/theme/jerry_editor");
    }
    editor.setOptions({
        fontSize:  $("#fontSizeSelectionMenu").val() +"px"
    });

    $('#currentEditingCode').html('Editing : <b>Untitled</b>');
    var codeFromDb = $("#codeFromDb").text();
    var lastEditCode = htmlDecode(localStorage.getItem('working_copy'));

    //fetch content from database
    if (codeFromDb != null && codeFromDb != '') {
        codeId = parseInt($('#codeIdFromDb').val());
       var codeTitle =  $('#codeTitleFromDb').val();
        var dateTimeStrFromDb = $('#lastEditDateFromDb').val();
        editor.session.setValue(addHeader(codeFromDb, dateTimeStrFromDb));
        language = languageName.indexOf($("#codeLanguageFromDb").val());
        if (codeTitle != null) {
            $('#currentEditingCode').html("<span>Editing : <b>" + codeTitle + "</b></span>" +
                "<span class='btn btn-default btn-xs' style='color:white' onclick='resetHelper()'><span class='fa fa-file-o' aria-hidden='true'></span>&nbsp;New</span>");
        }  
    }
        //fetch content from local storage
    else if (lastEditCode != null && lastEditCode != "") {
        var dateTimeStr = localStorage.getItem('saving_time');

        language = localStorage.getItem('code_language');
        editor.session.setValue(addHeader(lastEditCode, dateTimeStr));
    } else {
        editor.session.setValue(code_templates[language]);
    }
    $("#languageSelectionMenu").val(language);
    editor.getSession().setMode("ace/mode/" + languageName[language]);
    editor.clearSelection();
}

function addHeader(code, timeStr) {
    var dateTime = new Date(timeStr);
    if (code.startsWith("//last edit time: ")) {
        var lines = code.split('\n');
        lines.splice(0, 1);
        code = lines.join('\n');
    }
    return "//last edit time: " + dateTime.toLocaleDateString(lang) + " " + dateTime.toLocaleTimeString(lang) + "\n" + code;
}

function initializeTheSplitter() {
    var startPos;
    $("#splitter").draggable({
        axis: 'x',
        scroll: true,
        scrollSpeed: 100,
        start: function () {
            startPos = $('#codingPanel').width();
            $('#editorPanel').attr('style', 'cursor: col-resize !important');
            $(this).css("background", "transparent");
        },
        drag: function () {
            var offsetPx = $(this).css("left");
            var offset = parseInt(offsetPx.replace("px", ""));
            $('#codingPanel').css("flex-basis", (startPos + offset));
        },
        stop: function () {
            $(this).css("background", "url('/Content/img/handle-v.png') 1px 50% no-repeat");
            $('#editorPanel').removeAttr('style');
            $(this).css('left', '0');
        }
    });
}

function changeFontSize(target) {
    var fontSize = $(target).val();
    editor.setOptions({
        fontSize: fontSize + "px"
    });
    $(target).css("font-size", fontSize + "px");
    $("#resultPanel").css("font-size", fontSize + "px");
}


function changeLanguage(target) {
    language = parseInt($(target).val());
    var prevCode = editor.getValue();
    prevCode = "\n/**\n" + prevCode + "\n */\n";
    editor.getSession().setMode("ace/mode/" + languageName[language]);
    editor.session.setValue(code_templates[language] + prevCode);
}


function runCode(target) {

    $(target).html('<span class="fa fa-cog" aria-hidden="true"></span>&nbsp;&nbsp;Wait');
    $(target).removeAttr('onclick');
    $(target).addClass('disabled');
    $("#resultPanel").text("Running the program...");
    $.ajax({
        method: 'post',
        url: "/" + lang + "/CodingPad/RunCode",
        data: {
            codeEncoded: htmlEncode(editor.getValue()),
            language: languageName[language]
        }
    }).done(function (res) {
        $(target).html('<span class="fa fa-play" aria-hidden="true"></span>&nbsp;&nbsp;Run');
        $(target).removeClass('disabled');
        $(target).attr('onclick', 'runCode(this)');
        var feedback = JSON.parse(res);
        if (feedback == null) {
            alert('Error happened');
            return;
        }

        var runningTime = "compiled and executed in " + feedback.executeTime + " second(s)\n";
        $('#resultPanel').html(runningTime + "########################  Result  #######################\n" + feedback.output);

    });
}


function htmlEncode(value) {
    return $('<div/>').text(value).html();
}
function htmlDecode(value) {
    return $('<div/>').html(value).text();
}


function intervalSavingToCookie() {
    setInterval(function () {
        var code = editor.getValue();
        if (code != code_templates[language]) {
            localStorage.setItem("working_copy", htmlEncode(code));
            localStorage.setItem("saving_time", new Date());
            localStorage.setItem("code_language", language);
            console.log("Saving to Cookie");
        }
    }, 30000);
}

function resetCode() {
    if (editor.getValue() == code_templates[language]) {
        return;
    }
    $('#cofirmBtn').attr('onclick', 'resetHelper()');
    $('#cofirmBtn').text('Rest code');
    $('#contrimContent').text("Please confirm you want to discard your current code. ");
    $("#confirmModal").modal();
}

function resetHelper() {
    localStorage.removeItem("working_copy");
    localStorage.removeItem("saving_time");
    localStorage.removeItem("code_language");
    language = parseInt($("#languageSelectionMenu").val());
    resetEditor(null, language, null, null, null);
}


function showMyCodes() {
    if ($("#isLogged").val() != 'true') {
        $('#codeHistoryContent').html("<p class='text-danger'>Please login to manage your codes</p>");
    } else {
        getMyCodes();
    }
    $('#codesHistoryBox').modal();
}


function getMyCodes() {
    $('#codeHistoryContent').html("Loading...");
    $.ajax({
        url: "/" + lang + "/CodingPad/GetMyCodes"
    }).done(function (res) {
        if (res == null) {
            alert("You have login yet !");
            return;
        }
        var codes = JSON.parse(res);
        var rawHtml = '<ul class="list-group">';
        for (var i = 0; i < codes.length; i++) {
            var code = codes[i];
            rawHtml += generateCodeHtml(code);
        }
        rawHtml += ' </ul>';
        $('#codeHistoryContent').html(rawHtml);
        loadClipboard();
    });
}

function loadClipboard() {
    $('.copyUrlBtn').popover({
        trigger: 'hover'
});
    var clipboard = new Clipboard('.copyUrlBtn');
    clipboard.on('success', function (e) {
        $('.popover-content').text( 'Copied !');
    });
    clipboard.on('error', function (e) {
        console.log(e);
    });
}

function generateCodeHtml(code) {
    var shareBtn ;
    if (code.Shared == 1) {
        shareBtn = "&nbsp;&nbsp;&nbsp;<span class='fa fa-share-alt text-success cursor-pointer' title='unshare this code' aria-hidden='true' onclick='shareCode(this,-1)'  data-codeId='" + code.CodeID + "'></span>" +
            "&nbsp;&nbsp;&nbsp;<span class='glyphicon glyphicon-copy copyUrlBtn cursor-pointer' data-clipboard-text='https://www.nowtoshare.com/" + lang + "/CodingPad/Index/" + code.ShortGuid.Value + "' data-content='Copy to Clipboard'></span>";
    } else {
        shareBtn = "&nbsp;&nbsp;&nbsp;<span class='fa fa-share-alt text-muted cursor-pointer' title='share this code' aria-hidden='true' onclick='shareCode(this,1)'  data-codeId='" + code.CodeID + "'></span>";
    }
        var date = new Date(code.LastEditDate);
    var dateStr = date.toLocaleDateString(lang) + " " + date.toLocaleTimeString(lang);
    var oneRow = "<li class='list-group-item panel' style='display: flex; align-items: center; justify-content: space-around'>"+
    "        <span>"+
    "        <b>" + code.CodeTitle + "</b>&nbsp;<span>(" + code.CodeLanguage + ")</span>" + shareBtn + "<br/>" +
    "        <small>Last Edit Time : " + dateStr + "</small>" +
    "        </span>"+
    "        <span class='btn btn-xs btn-raised btn-danger' style='margin: 0' onclick='deleteCode(this)' data-codeId='" + code.CodeID + "'>Delete Code</span>" +
    "        <span class='btn btn-xs btn-raised btn-success' style='margin: 0' data-codeTitle='"+code.CodeTitle+"' data-lastEditDate='" + code.LastEditDate + "' data-codeId='" + code.CodeID + "' data-language='" + code.CodeLanguage + "' data-codeContent='" + escapeHtml(code.CodeContent) + "' onclick='loadCode(this)'>Load Code</span>" +
    "        </li>";
    return oneRow;

}

function loadCode(target) {
    var content = htmlDecode($(target).attr('data-codeContent'));
    var language = $(target).attr('data-language');
    var codeId = $(target).attr('data-codeId');
    var lastEditDate = $(target).attr('data-lastEditDate');
    var codeTitle = $(target).attr('data-codeTitle');
    resetEditor(codeId, language, content, lastEditDate, codeTitle);
    $('#codesHistoryBox').modal('toggle');
}


function resetEditor(codeId, language,content,lastEditDate,codeTitle) {
    $('#codeIdFromDb').val(codeId);
    $('#codeLanguageFromDb').val(language);
    $('#codeFromDb').text(content);
    $('#lastEditDateFromDb').val(lastEditDate);
    $('#codeTitleFromDb').val(codeTitle);
    initialTheEditor();
}


function deleteCode(target) {
    var codeId = $(target).attr('data-codeId');
    $(target).attr('disabled', 'disabled');
    $(target).text('Deleting...');
    $.ajax({
        url: "/" + lang + "/CodingPad/DeleteCode",
        data: {
            codeId: codeId
        }
    }).done(function() {
        getMyCodes();
    });
}

function saveMyCodeModal() {
    if ($("#isLogged").val() != 'true') {
        $('#saveCodeContent').html("<p class='text-danger'>Please login to save your code</p>");
        $('.saveCodeBtn').hide();
    } else {
        $('.saveCodeBtn').show();
        $('.saveCodeBtn').removeAttr('disabled');
        var codeTitle = $('#codeTitleFromDb').val();
        if (codeTitle == null || codeTitle == "") {
            $('.saveCodeBtn[data-savemode="0"]').attr('disabled', 'disabled');
        }
        var nameOfCodeHtml = "<div class=\"form-group\" style='margin:0'>" +
            "        <label class=\"control-label\">Please name your code snippet: </label>" +
            "        <input class=\"form-control\"  value='" + (codeTitle==null ?"":codeTitle) + "' id=\"nameOfYourCode\"/>" +
            "        </div>";
        $('#saveCodeContent').html(nameOfCodeHtml);
    }

    $('#saveCodeBox').modal();
}

function saveCode(target) {
    var codeName = $("#nameOfYourCode").val();
    var saveMode = parseInt($(target).attr('data-savemode'));
    $(target).attr('disabled', 'disabled');
    $(target).text('Saving...');
    if (codeName == null || codeName == '') {
        alert('Name should not be empty');
        return;
    }
    $.ajax({
        method: 'post',
        url: "/" + lang + "/CodingPad/SavingCode",
        data: {
            title: codeName,
            codeId: codeId,
            codeEncoded: htmlEncode(editor.getValue()),
            languageName: languageName[language],
            saveMode: saveMode
}
    }).done(function (res) {
        $(target).removeAttr('disabled');
        $(target).text('Save');
        $('#saveCodeBox').modal('toggle');
        if (res.startsWith("Error")) {
            alert(res);
            return;
        }
        var savedCode = JSON.parse(res);
        savedCode.CodeContent = htmlDecode(savedCode.CodeContent);
        resetEditor(savedCode.CodeID, savedCode.CodeLanguage, savedCode.CodeContent, savedCode.LastEditDate, savedCode.CodeTitle);
    });
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


function shareCode(target, flag) {
    var codeId = $(target).attr('data-codeId');
    $.ajax({
        url: "/" + lang + "/CodingPad/ShareCode",
        data: {
            flag: flag,
            codeId: codeId
        }
    }).done(function() {
        getMyCodes();
    });
}