var playingCount = 0;
$('#Global_UserAction').click(function () {
    $('#Global_LeaveMessage').attr('class', 'mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-shadow--8dp mdl-color--accent mdl-layout--small-screen-only animated fadeInUp');
    if ($('#Global_LeaveMessage').attr('status') !== "show") {
        $('#Global_UserAction').rotate({
            angle: 0,
            animateTo: 225
        });
        $('#Global_LeaveMessage').show();
        $('#Global_LeaveMessage').attr('status', 'show');
    }
    else {
        $('#Global_UserAction').rotate({
            angle: 225,
            animateTo: 0
        });
        $('#Global_LeaveMessage').attr('class', 'mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-shadow--8dp mdl-color--accent mdl-layout--small-screen-only animated fadeOutDown');
        $('#Global_LeaveMessage').attr('status', 'hide');

    }
});
$('main').click(function () {
    if ($('#Global_LeaveMessage').attr('status') === "show") {
        $('#Global_UserAction').rotate({
            angle: 225,
            animateTo: 0
        });
        $('#Global_LeaveMessage').attr('class', 'mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-shadow--8dp mdl-color--accent mdl-layout--small-screen-only animated fadeOutDown');
        $('#Global_LeaveMessage').attr('status', 'hide');
    }
});

var AddPlayingCount = function () {
    playingCount++;
    if (playingCount > 0) {
        $("#mediaIsPlaying").show();
    }
}
var MinusPlayingCount = function () {
    if (playingCount > 0)
        playingCount--;
    if (playingCount === 0) {
        $("#mediaIsPlaying").hide();
    }
}

$('#siteIcon')
    .click(function () {
        if ($.cookie("themeType") == null || $.cookie("themeType") === "1") {
            $('#lightThemeCss').attr('rel', 'stylesheet');
            $('#darkThemeCss').attr('rel', 'preload');
            $('#siteIcon >img').attr('src', '/Content/Imgs/favicon.ico');
            $.cookie("themeType", "2");
        } else {
            $('#darkThemeCss').attr('rel', 'stylesheet');
            $('#lightThemeCss').attr('rel', 'preload');
            $('#siteIcon >img').attr('src', '/Content/Imgs/faviconDark.ico');
            $.cookie("themeType", "1");
        }
    });

$(document)
    .ready(function () {
        $('#loader').addClass('animated fadeOut');
        $('#loader').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $('#loader').hide();
        });

    });
$('a[href!=""][href]').click(function () {
    if ($(this).attr('target') == undefined) {
        $('#loader').removeClass('animated fadeOut');
        $('#loader').show();
    }
})