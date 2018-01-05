
var playControl = function (e) {
    var fixedCssClassName = "mdl-cell mdl-cell--5-col-smalldesktop mdl-cell--3-col-desktop mdl-cell--3-col-tablet mdl-cell--4-col-phone";
    var video = $(e).next('audio,video')[0];
    loadMedia(video);
    if (video.played.length === 0) {
        //initialize the audio player
        var seekBar = $(e).nextAll('div').children('div[class="mdl-card__actions"]').children('div').children('input');
        seekBar[0].MaterialSliderEnhance.change(0, 0);
        seekBar.change(function () {
            var time = video.duration * (seekBar[0].value / 100);
            video.currentTime = time;
        });
        seekBar.mousedown(function () {
            video.pause();
            MinusPlayingCount();
        });
        seekBar.mouseup(function () {
            if (video.paused === true) {
                var checkloading = setInterval(function (t) {
                    if (video.readyState > 0) {
                        video.play();
                        AddPlayingCount();
                        $(e).attr('class', 'customize-mdl-card__ui-video-player-playing ' + fixedCssClassName);
                        clearInterval(checkloading);
                    } else {
                        alert('loading');
                    }
                }, 500);
                video.play();
            }
        });
        video.addEventListener("timeupdate", function () {
            var value = Math.round(video.currentTime / video.duration * 100);
            var bufferedPercentage = Math.round(video.buffered.end(0) / video.duration * 100);
            seekBar[0].MaterialSliderEnhance.change(value, bufferedPercentage);
            var timeStamp = $(e)
                .nextAll('div')
                .children('div[class="mdl-card__actions"]')
                .children('span[class="playTimeDisplay"]')
                .children('.current');
            if (timeStamp[0]!=undefined)
            timeStamp[0].innerHTML = secondsFormat(video.currentTime);

        });
        video.addEventListener("ended", function () {
            video.currentTime = 0;
            video.pause();
            MinusPlayingCount();
            $(e).attr('class', 'customize-mdl-card__player ' + fixedCssClassName);
        });
        video.play();
        AddPlayingCount();
        $(e).attr('class', 'customize-mdl-card__ui-video-player-playing ' + fixedCssClassName);
    }
    else if (video.paused === true) {
        video.play();
        AddPlayingCount();
        $(e).attr('class', 'customize-mdl-card__ui-video-player-playing ' + fixedCssClassName);
    } else {
        video.pause();
        MinusPlayingCount();
        $(e).attr('class', 'customize-mdl-card__player ' + fixedCssClassName);
    }
};


var loadMedia=function (video)
{
    var getDuration = setInterval(function (t) {
        if (video.readyState > 0) {
            var timescope = $(video)
                .nextAll('div')
                .children('div[class="mdl-card__actions"]')
                .children('span[class="playTimeDisplay"]');
            timescope[0].innerHTML = '<span class="current">00:00</span>/' +
                secondsFormat(video.duration);
            clearInterval(getDuration);
        }
    },
           500);
}
var findVideoBoxAndFullScreen = function (e) {
    var video = $(e).parent().parent().prev('video')[0];
    fullScreen(video);
}


//$('.mediaContainers')
//    .each(function () {
//        var video = this;
       
//    });
$('.cover')
    .each(function () {
        var header = $(this).prevAll('header');
        var headerHeight = header.height();
        var headerWidth = header.width();
        var mediaWidth = this.naturalWidth;
        var mediaHeight = this.naturalHeight;
        $(this).width(headerWidth);
        var calHeight = mediaHeight / mediaWidth * headerWidth;
        var offset = headerHeight - calHeight;
        if (offset > 0) {
            $(this)
                .offset({
                    top: header.offset().top + offset / 2,
                    left: header.offset().left
                });
            $(this).height(calHeight);
        }
        else {
            $(this).height(headerHeight);
            $(this).offset(header.offset());
        }
    });

$(window).resize(function () {
    $('.cover').each(function () {
        var header = $(this).prevAll('header');
        var headerHeight = header.height();
        var headerWidth = header.width();
        var mediaWidth = this.naturalWidth;
        var mediaHeight = this.naturalHeight;
        $(this).width(headerWidth);
        var calHeight = mediaHeight / mediaWidth * headerWidth;
        var offset = headerHeight - calHeight;
        if (offset > 0) {
            $(this)
                .offset({
                    top: header.offset().top + offset / 2,
                    left: header.offset().left
                });
            $(this).height(calHeight);
        }
        else {
            $(this).height(headerHeight);
            $(this).offset(header.offset());
        }
    });
});

var boxes = [];
/*Javascript object*/

/*Component functions*/
function secondsFormat(seconds) {
    var min = parseInt(Math.floor(seconds / 60));
    var sec = parseInt(Math.floor(seconds % 60));
    return (padding(min) + ":" + padding(sec));
}
function padding(num) {
    var s = num + "";
    while (s.length < 2) s = "0" + s;
    return s;
}
function fullScreen(video) {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen(); // Firefox
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen(); // Chrome and Safari
    }
}
