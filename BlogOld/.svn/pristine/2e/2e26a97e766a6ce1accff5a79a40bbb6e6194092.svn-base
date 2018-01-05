var Music = function (obj) {
    this.ListId = obj.ListId;
    this.MusicExternalId = obj.MusicExternalId;
    this.MusicName = obj.MusicName;
    this.Artist = obj.Artist;
    this.Album = obj.Album;
    this.Rate = obj.Rate;
    this.CreateDate = obj.CreateDate;
    this.Url = obj.Url;
    this.ImgUrl = obj.ImgUrl;
}

var lyric = [];
var popMuiscList = [];
var playingList = [];
var orginalFavoriateList = [];
var selectedMusicId = -1;

// favoriate list operations
function getCloneFavoriateList() {
    var cloneFavoriateList = [];
    for (var i = 0; i < orginalFavoriateList.length; i++) {
        var music = new Music(orginalFavoriateList[i]);
        cloneFavoriateList.push(music);
    }
    return cloneFavoriateList;
}
function findMusicInFavoriateListByMusicId(musicId) {
    function isListIdMatched(element) {
        return element != null && element.MusicExternalId == musicId;
    }
    return orginalFavoriateList.find(isListIdMatched);
}


function findMusicInPopularListByMusicId(musicId) {
    function isListIdMatched(element) {
        return element != null && element.MusicExternalId == musicId;
    }
    return popMuiscList.find(isListIdMatched);
}

function findMusicInSearchListByMusicId(musicId) {
    function isListIdMatched(element) {
        return element != null && element.MusicExternalId == musicId;
    }
    return searchResultList.find(isListIdMatched);
}

// playing list operations
function findMusicInPlayingListByMusicId(musicId) {
    function isListIdMatched(element) {
        return element != null && element.MusicExternalId == musicId;
    }
    return playingList.find(isListIdMatched);
}

function fetchDataFromLocalStorage() {
    var data = localStorage.getItem("playingList");
    if (data != null) {
        playingList = $.parseJSON(data);
    }
}

function updateDataIntoLocalStorage() {
    localStorage.setItem("playingList", JSON.stringify(playingList));
}





function generateFavoriateListHtml() {
    var favoriateList = getCloneFavoriateList();
    var html = '';
    for (var i = 0; i < favoriateList.length; i++) {
        var music = new Music(favoriateList[i]);
        html += '<li class="flex-box hover-pointer" data-musicId="' + music.MusicExternalId + '">';
        html += '<span class="music-checkbox"><input type="checkbox"/></span>';
        html += '<span class="music-sequence" onclick="selectCurrentFavoriateMusic(this)">' + (i + 1) + '</span>';
        html += '<span class="music-name" onclick="selectCurrentFavoriateMusic(this)">' + music.MusicName + '</span>';
        html += '<span class="artist-name" onclick="selectCurrentFavoriateMusic(this)">' + music.Artist + '</span>';
        html += '<span class="album-name" onclick="selectCurrentFavoriateMusic(this)">' + music.Album + '</span>';
        html += '<span class="music-action"><span class="fa fa-trash removeMusic"></span></span>';

        html += "</li>";
    }
    return html;
}


function selectCurrentFavoriateMusic(target) {
    var checkbox = $(target).parent().children('span:first').children('input[type="checkbox"]');
    checkbox.prop("checked", !checkbox.is(":checked"));
    var cnt = $('#favorateList').find('.music-checkbox >input:checked').length;
    if (cnt > 0) {
        $('#addToPlayingListBtn').show();
    } else {
        $('#addToPlayingListBtn').hide();
    }
}


function selectAllMusic(target) {
    if ($(target).find('input').is(":checked")) {
        $(target).find('input').prop("checked", false);
        $('#favorateList').find('.music-checkbox >input').prop("checked", false);
        $('#addToPlayingListBtn').hide();
    } else {
        $(target).find('input').prop("checked", true);
        $('#favorateList').find('.music-checkbox >input').prop("checked", true);
        $('#addToPlayingListBtn').show();
    }
}


// favorate list and playing list
function addToPlayingList() {
    $('.music-checkbox').children('input').each(function () {
        if ($(this).is(":checked")) {
            var musicId = decodeURI($(this).closest('li').attr('data-musicId'));
            $(this).closest('li').addClass('animated zoomOutRight');
            $(this).closest('li').on("animationend",
                function () {
                    $(this).hide();
                });
            var music = findMusicInFavoriateListByMusicId(musicId);
            var existedMusic = findMusicInPlayingListByMusicId(musicId);
            if (existedMusic == null) {
                playingList.push(music);
                updateDataIntoLocalStorage();
            }
        }
    });
    window.currentPlayingMusic = window.playingList[0];
    loadMusic();
    window.status = STATUS.Playing;
    $('#playBtn').removeClass("fa-play-circle");
    $('#playBtn').addClass("fa-pause-circle");
    $('#playBtn').attr('onclick', 'pausemusic(this)');
}



//playing list
function renderPlayingList() {
    var html = generatePlayingListHtml();
    $('#playingList >ul').html(html);
}


function generatePlayingListHtml() {
    var html = '';
    html += '<li class="flex-box">';
    html += '<span class="music-sequence"></span>';
    html += '<span class="music-name" ><b>Music Name</b></span>';
    html += '<span class="artist-name"><b>Artist</b></span>';
    html += '<span class="album-name"><b>Album</b></span>';
    html += '<span class="music-action"><b>Actions</b></span>';
    html += "</li>";
    for (var i = 0; i < playingList.length; i++) {
        var music = new Music(playingList[i]);
        var isCurrentPlaying = window.currentPlayingMusic != null && window.currentPlayingMusic.MusicExternalId == music.MusicExternalId;
        var isCurrentSelected = (selectedMusicId == music.MusicExternalId);
        var actionHtml;
        if (!isCurrentPlaying) {
            actionHtml = '<span class="fa fa-trash" onclick="remove(' +
                music.ListId +
                ')"></span>' +
                '<span class="fa fa-play" onclick="playCurrentMusic(' +
                music.ListId +
                ')"></span>';
        } else {
            actionHtml = '<span></span><span><img src="/Content/img/playing.gif" width="20"></span>';
        }
        html += '<li class="flex-box hover-pointer  ' + (isCurrentPlaying ? 'playing-line ' : ' ') + (isCurrentSelected ? 'selected-music' : '') + '"  data-musicId="' + music.MusicExternalId + '">';
        //html += '<span class="music-checkbox" onclick="selectCurrentMusic(this)"><input type="checkbox"/></span>';
        html += '<span class="music-sequence" onclick="selectCurrentPlayingMusic(this)">' + (i + 1) + '</span>';
        html += '<span class="music-name" onclick="selectCurrentPlayingMusic(this)">' + music.MusicName + '</span>';
        html += '<span class="artist-name" onclick="selectCurrentPlayingMusic(this)">' + music.Artist + '</span>';
        html += '<span class="album-name" onclick="selectCurrentPlayingMusic(this)">' + music.Album + '</span>';
        html += '<span class="music-action">' +
            actionHtml + '</span>';

        html += "</li>";
    }
    return html;
}


function selectCurrentPlayingMusic(target) {
    var musicId = $(target).closest('li').attr('data-musicId');
    $('.selected-music').removeClass('selected-music');
    $('#moveUpBtn').hide();
    $('#moveDownBtn').hide();
    if (selectedMusicId == musicId) {
        selectedMusicId = -1;
        return;
    }
    selectedMusicId = musicId;
    $(target).closest('li').addClass('selected-music');
    $('#moveUpBtn').show();
    $('#moveDownBtn').show();
}



function move(step) {
    for (var i = 0; i < playingList.length; i++) {
        if (playingList[i].MusicExternalId == selectedMusicId) {
            var curMusic = playingList[i];
            var replacedPos = Math.min(playingList.length - 1, Math.max(0, i + step));
            playingList.splice(i, 1);
            playingList.splice(replacedPos, 0, curMusic);
            updateDataIntoLocalStorage();
            renderPlayingList();
            return;
        }
    }

}

function remove(listId) {
    for (var i = 0; i < playingList.length; i++) {
        if (playingList[i].ListId == listId) {
            playingList.splice(i, 1);
            updateDataIntoLocalStorage();
            renderPlayingList();
            return;
        }
    }
}

function shuffle() {
    for (var i = 0; i < playingList.length; i++) {
        var randIdx = Math.floor(Math.random() * (i + 1));
        if (randIdx != i) {
            var temp = playingList[randIdx];
            playingList[randIdx] = playingList[i];
            playingList[i] = temp;
        }
    }
    renderPlayingList();
}

function playCurrentMusic(listId) {
    for (var i = 0; i < playingList.length; i++) {
        if (playingList[i].ListId == listId) {
            window.currentPlayingMusic = playingList[i];
            loadMusic();
            window.status = STATUS.Playing;
            $('#playBtn').removeClass("fa-play-circle");
            $('#playBtn').addClass("fa-pause-circle");
            $('#playBtn').attr('onclick', 'pausemusic(this)');
            return;
        }
    }
}


function deleteAll() {
    audio.pause();
    playingList = [];
    window.currentPlayingMusic = null;
    window.status = STATUS.Stop;
    renderPlayingList();
    $('#playBtn').removeClass("fa-pause-circle");
    $('#playBtn').addClass("fa-play-circle");
    $('#playBtn').attr('onclick', 'playmusic(this)');
    updateDataIntoLocalStorage();
}