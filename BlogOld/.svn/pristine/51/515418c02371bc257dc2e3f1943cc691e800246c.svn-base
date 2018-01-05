var STATUS = {
    Stop: 0,
    Playing: 1,
    Pause: 2
}


var PLAY_MODE = {
    Loop: 0,
    Repeat: 1,
    Random: 2
}
//============reference===================

var lyric = [];
var lyricIndex = 0;
var currentPlayingMusic = null;
var audio = null;
var audioSource = null;
var volumeNum = 50;

var interval = null;

var status = STATUS.Stop;
var playMode = PLAY_MODE.Loop;

function playHook() {
    if (audio == null) {
        audio = document.getElementById("current_player");
        audioSource = document.getElementById("audioSource");
    }

    interval = setInterval(checkConditions, 1000);
}


function checkConditions() {
    //trigger by user. when push the stop button
    if (status == STATUS.Stop) {
        currentPlayingMusic = null;
        audioSource.src = '';
        audio.pause();
        audio.currentTime = 0;
        return;
    }

    if (window.playingList.length > 0) {
        if (currentPlayingMusic == null) {
            currentPlayingMusic = window.playingList[0];
            loadMusic();
        }
    } else {
        return;
    }

    //trigger by audio
    if (audio.ended) {
        fetchNextSong(1);
    }
    //not ended but paused
    else if (audio.paused) {
        //resume by user
        if (status == STATUS.Playing) {
            audio.play();
        }
        //keep paused
        else if (status == STATUS.Pause) {
            return;
        }
    }
    // is playing
    else if (!audio.ended && !audio.paused) {
        //paused by user
        if (status == STATUS.Pause) {
            audio.pause();
            return;
        } else {
            //interval fetch status
            fetchAudioInfo();
            return;
        }
    }
}


function fetchAudioInfo() {
    if (audio == null || audio.duration == NaN || isNaN(audio.duration)) {
        return;
    }
    var currentTimeStr = secondsToTime(audio.currentTime);
    $('#currentPlayingTime').text(currentTimeStr);
    setLyricStyle(audio.currentTime);
    var buffer = audio.buffered.end(0) / audio.duration;
    var cur = audio.currentTime / audio.duration;
    buffer = Math.max(0, buffer - cur);
    var left = Math.max(0, 1 - buffer - cur);
    $('#primary-progress').attr('style', 'flex:' + cur);
    $('#secondary-progress').attr('style', 'flex:' + buffer);
    $('#left-progress').attr('style', 'flex:' + left);
}

function fetchNextSong(offset) {
    if (playMode == PLAY_MODE.Loop) {
        for (var i = 0; i < playingList.length; i++) {
            if (playingList[i].MusicExternalId == currentPlayingMusic.MusicExternalId) {
                var index = (i + offset + playingList.length) % playingList.length;
                currentPlayingMusic = playingList[index];
                loadMusic();
                return;
            }
        }
    }
    else if (playMode == PLAY_MODE.Random) {
        var randIdx = Math.floor(Math.random() * playingList.length);
        if (playingList[randIdx].MusicExternalId == currentPlayingMusic.MusicExternalId) {
            randIdx = Math.random() * playingList.length;
        }
        currentPlayingMusic = playingList[randIdx];
        loadMusic();
        return;
    }
    else if (playMode == PLAY_MODE.Repeat) {
        loadMusic();
        return; 
    }
}


function setLyricStyle(currentTime) {
    if (lyric == null || lyric.length == 0) {
        return;
    }
    while (currentTime >= lyric[0]) {
        lyric.splice(0, 1);
            $("#lyricContent").find(".mark").removeClass("mark");
            var curLine = $("#lyricContent p")[lyricIndex++];
            $(curLine).addClass("mark");
            var top = $(curLine).offset().top;
            var offset = top - 300;
            $("#lyricContent").scrollTop($("#lyricContent").scrollTop()+offset);
        }
}

function loadMusic() {
    audio.onloadedmetadata = function () {
        $('#totalPlayingTime').text(secondsToTime(audio.duration));
    };
    audioSource.src = currentPlayingMusic.Url;
    audio.load();
    //append meta data
    var imgSrc = currentPlayingMusic.ImgUrl === '' ? 'http://placehold.it/90X90' : currentPlayingMusic.ImgUrl;
    $('#imageCover').attr('src', imgSrc);
    $('#music-name').html(currentPlayingMusic.MusicName);
    $('#music-artist-album').html(currentPlayingMusic.Artist + " - " + currentPlayingMusic.Album);
    //refresh the current playing list
    renderPlayingList();
    //refresh the lyric panel
    updateLyricPanel();
}


function nextSong() {
    fetchNextSong(1);
}
function prevSong() {
    fetchNextSong(-1);
}

function setVolume() {
    audio.volume = volumeNum / 100;
}

secondsToTime = function (secs) {
    var hours = Math.floor(secs / 3600), minutes = Math.floor(secs % 3600 / 60), seconds = Math.ceil(secs % 3600 % 60);
    return (hours == 0 ? '' : hours > 0 && hours.toString().length < 2 ? '0' + hours + ':' : hours + ':') + (minutes.toString().length < 2 ? '0' + minutes : minutes) + ':' + (seconds.toString().length < 2 ? '0' + seconds : seconds);
}