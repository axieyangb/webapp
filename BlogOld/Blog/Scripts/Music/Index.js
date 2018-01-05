

var pageNum = 0;
var searchResultList = [];
$(document).ready(function () {
    initalizeMusicMenu();
    updateVolume();
    fetchDataFromLocalStorage();
    if ($("#isLogged").val() === "true") {
        getFavoriateList();
    }
    playHook();
    mouseMoveBinging();
    getPopularCategoryList();
    adjustForMobileDevice();
});

function adjustForMobileDevice() {
    var width = $(window).width();
    if (width < 768) {
        $("#backend-image").show();
        $("#backend-video").hide();
        $("#music-playingTime").hide();
        $("#music-volume").hide();
        $("#music-artist-album").hide();
        $("#music-name-margin").hide();
        $("#music-info").css({
            'flex': "1"
        });
        $("#backgroundSwitcher >button").attr("data-value", 1);
        $("#backgroundSwitcher >button").children("span").attr("class", "fa fa-video-camera");
    } else {
        $("#backend-video").show();
        $("#backend-image").hide();
        playBackendVideo();
        $("#backgroundSwitcher >button").attr("data-value", 0);
        $("#backgroundSwitcher >button").children("span").attr("class", "fa fa-picture-o");
    }
}

function playBackendVideo() {
    var video = document.getElementById("backend-video");
    video.addEventListener("canplay", function () {
        video.play();
    });
}

function switchBg(target) {
    var tag = parseInt($(target).attr("data-value"));
    if (tag == 0) {
        $("#backgroundSwitcher >button").children("span").attr("class", "fa fa-video-camera");
        $("#backend-image").show();
        $("#backend-video").hide();

    } else {
        $("#backgroundSwitcher >button").children("span").attr("class", "fa fa-picture-o");
        $("#backend-image").hide();
        $("#backend-video").show();
    }
    $(target).attr("data-value", 1 - tag);
}

function initalizeMusicMenu() {
    $("#music-menu-bar").popover({
        container: "body",
        html: true,
        placement: "left",
        content: generateMusicMenu()
    });
    $("#music-menu-bar").on("show.bs.popover",
        function() {
            $(this).html('<span class="fa fa-times"></span>');
        });
    $("#music-menu-bar").on("hide.bs.popover",
        function () {
            $(this).html('<img src="/Content/img/music-menu.svg" />');
        });
}

function generateMusicMenu() {
    var width = $(window).width();
    var coolLink = "";
    var isLogged = $("#isLogged").val() == "true";
    if (width >= 768) {
        coolLink = "cool-link";
    }
    var html = '<ul class="list-group">';
    html += ' <li class="list-group-item cursor-pointer ' + coolLink + '" onclick="showSearchMusicList()"><span><img src="/Content/img/music-search.svg"  style="width:20px;height:20px;"/></span> &nbsp;&nbsp;Search</li>';
    html += ' <li class="list-group-item cursor-pointer ' + coolLink + '" onclick="showPopluarMusicList()"><span><img src="/Content/img/music-popular.svg"  style="width:20px;height:20px;"/></span> &nbsp;&nbsp;Popular</li>';

    if (isLogged) {
        html += ' <li class="list-group-item cursor-pointer ' + coolLink + '" onclick="showFavoriateList()"><span><img src="/Content/img/music-favoriate.svg"  style="width:20px;height:20px;"/></span> &nbsp;&nbsp;Favoriate</li>';
    }
    html += ' <li class="list-group-item cursor-pointer ' + coolLink + '" onclick="showLyricPanel()"><span><img src="/Content/img/music-lyrics.svg"  style="width:20px;height:20px;"/></span> &nbsp;&nbsp;Lyric</li>';

    html += ' <li class="list-group-item cursor-pointer ' + coolLink + '" onclick="showPlayingList()"><span><img src="/Content/img/music-playing-list.svg"  style="width:20px;height:20px;"/></span> &nbsp;&nbsp;Playing</li>';

    html += "</ul>";
    return html;
}

function showPlayingList() {
    $("#music-menu-bar").click();
    renderPlayingList();
    $("#currentPlayingListPanel").show();
    $("#currentPlayingListPanel").offset({ left: ($(window).width() - $("#currentPlayingListPanel").width()) / 2, top: 75 });
}


function updateLyricPanel() {
    window.lyricIndex = 0;
    window.lyric = [];
    if (window.currentPlayingMusic == null || window.currentPlayingMusic.Lyric == null
        || window.currentPlayingMusic.Lyric == '<lyric />') {
       
        $('#lyricContent').html('No Available Lyric');
        $('#lyricSongName').html("Unknown");
    } else {
        var lyricStr = window.currentPlayingMusic.Lyric;
        var html = generateLyricHtml(lyricStr);
        $('#lyricContent').html(html);
        $('#lyricSongName').html(window.currentPlayingMusic.MusicName);
        
    }
}


function generateLyricHtml(lyricStr) {
    var xmlDoc = $.parseXML(lyricStr);
    var $xml = $(xmlDoc);
    var html = '';
    $xml.find('line').each(function () {
        var time = $(this).children("time").text();
        var content = $(this).children("content").text();
        lyric.push(parseFloat(time));
        html += "<p data-time='" + time + "'>" + content + "</p>";
    });
    return html;
}


function showLyricPanel() {
    updateLyricPanel();
    $("#lyricPanel").show();
    $("#lyricPanel").offset({
        left: ($(window).width() - $("#lyricPanel").width()) / 2,
        top: 75
    });

}


function mouseMoveBinging() {
    $("#currentPlayingListPanel").draggable({ handle: "div.panel-heading" });
    $("#lyricPanel").draggable({ handle: "div.panel-heading" });
}




function adjustVolume(e) {
    var offset = $(e).offset();
    $(e).attr("onclick", "closeVolumePopout(this)");
    var div = $('<div id="volumn-adjuster"></div>');
    var slider = $('<div id="slider"></div>');
    window.noUiSlider.create(slider[0], {
        animate: false,
        start: [50],
        connect: true,
        orientation: "vertical",
        step: 1,
        range: {
            'min': 0,
            'max': 100
        }
    });
    div.append(slider);
    div.css({
        position: "absolute",
        top: -80,
        left: offset.left - 6
    });
    $("#music-volume").append(div);
    slider[0].noUiSlider.on("update", function (values) {
        window.volumeNum = 100 - parseInt(values);
        updateVolume(window.volumeNum);
        setVolume();
    });

}

function closeVolumePopout(e) {
    $("#volumn-adjuster").remove();
    $(e).attr("onclick", "adjustVolume(this)");
}

function updateVolume() {
    var icon = $("#music-volume").children(".fa");
    if (window.volumeNum === 0) {
        icon.removeClass("fa-volume-up");
        icon.removeClass("fa-volume-down");
        icon.addClass("fa-volume-off");

    }
    else if (window.volumeNum < 50) {
        icon.removeClass("fa-volume-off");
        icon.removeClass("fa-volume-up");
        icon.addClass("fa-volume-down");

    } else {
        icon.removeClass("fa-volume-down");
        icon.removeClass("fa-volume-off");
        icon.addClass("fa-volume-up");

    }
    $("#volume-number").text(window.volumeNum);
}


//Ajax section to fetch data from the 

function getFavoriateList() {
    $.ajax({
        url: "Music/GetFavoriteList"
    }).done(function (res) {
        window.orginalFavoriateList = $.parseJSON(res);
        $("#favorateList > ul.list-group").html(window.generateFavoriateListHtml());
    });
}

function playmusic(target) {
    window.status = STATUS.Playing;
    $(target).removeClass("fa-play-circle");
    $(target).addClass("fa-pause-circle");
    $(target).attr("onclick", "pausemusic(this)");
}

function pausemusic(target) {
    window.status = STATUS.Pause;
    $(target).removeClass("fa-pause-circle");
    $(target).addClass("fa-play-circle");
    $(target).attr("onclick", "playmusic(this)");
}


function changeSequence(target) {
    var mode = parseInt($(target).attr("data-value"));
    mode = (mode + 1) % 3;
    window.playMode = mode;
    $(target).attr("data-value", mode);
    var src = "";
    if (mode == PLAY_MODE.Loop) {
        src = "/Content/img/repeat.svg";
    }
    else if (mode == PLAY_MODE.Random) {
        src = "/Content/img/shuffle.svg";

    }
    else if (mode == PLAY_MODE.Repeat) {
        src = "/Content/img/repeatonce.svg";
    }
    $("#playingSequence").children("span").children("img").attr("src", src);
}


function showSearchMusicList(target) {
    if (target == null) {
        target = $("#showSearchMusicListSideBtn")[0];
    }
    $(target).children(".fa-chevron-circle-down").removeClass("fa-rotate-90");
    $(target).children(".fa-chevron-circle-down").addClass("fa-rotate-270");
    $(target).attr("onclick", "hideSearchMusicList(this)");
    $("#searchMusicListPanel").show();
    var leftWidth = $(window).width() - $(target).width() - $("#searchMusicListPanel").width();
    $(target).offset({ left: leftWidth });
}

function hideSearchMusicList(target) {
    $(target).children(".fa-chevron-circle-down").removeClass("fa-rotate-270");
    $(target).children(".fa-chevron-circle-down").addClass("fa-rotate-90");
    $(target).attr("onclick", "showSearchMusicList(this)");
    var leftWidth = $(window).width() - $(target).width();
    $(target).offset({ left: leftWidth });
    $("#searchMusicListPanel").hide();
}

function showFavoriateList(target) {
    if (target == null) {
        target = $("#showFavoriateMusicListSideBtn")[0];
    }
    $(target).children(".fa-chevron-circle-down").removeClass("fa-rotate-270");
    $(target).children(".fa-chevron-circle-down").addClass("fa-rotate-90");

    $(target).attr("onclick", "hideFavoriateList(this)");
    $("#favorateListPanel").show();
    $(target).offset({ left: $("#favorateListPanel").width() });
}

function hideFavoriateList(target) {
    $(target).children(".fa-chevron-circle-down").removeClass("fa-rotate-90");
    $(target).children(".fa-chevron-circle-down").addClass("fa-rotate-270");
    $(target).attr("onclick", "showFavoriateList(this)");
    $(target).offset({ left: 0 });
    $("#favorateListPanel").hide();
}

function showPopluarMusicList(target) {
    if (target == null) {
        target = $("#showPopularMusicListSideBtn")[0];
    }
    $(target).children(".fa-chevron-circle-down").removeClass("fa-rotate-270");
    $(target).children(".fa-chevron-circle-down").addClass("fa-rotate-90");

    $(target).attr("onclick", "hidePopluarMusicList(this)");
    $("#popluarMusicList").show();

    $(target).offset({ left: $("#popluarMusicList").width() });
}

function hidePopluarMusicList(target) {
    $(target).children(".fa-chevron-circle-down").removeClass("fa-rotate-90");
    $(target).children(".fa-chevron-circle-down").addClass("fa-rotate-270");
    $(target).attr("onclick", "showPopluarMusicList(this)");
    $(target).offset({ left: 0 });
    $("#popluarMusicList").hide();
}


function getPopularCategoryList() {
    $.ajax({
        url: "/Music/GetCategoryList"
    }).done(function (res) {
        var categoryList = $.parseJSON(res);
        var html = "";
        for (var i = 0; i < categoryList.length; i++) {
            html += generatePopularCategoryListHtml(categoryList[i]);
        }
        $("#popularCategory").html(html);
    });
}


function generatePopularCategoryListHtml(categoryName) {
    return '<li class="list-group-item cursor-pointer" onclick="showMusicUnderCategory(\'' + categoryName + '\')">' + categoryName.replace("酷我","").replace("酷","") + "</li>";
}



function showMusicUnderCategory(categoryName) {
    $("#popularMusics").html("loading...");
    $.ajax({
        url: "/Music/GetPopularList",
        data: {
            categoryName: categoryName
        }
    }).done(function (res) {
        window.popMuiscList = $.parseJSON(res);
        var html = "";
        for (var i = 0; i < window.popMuiscList.length; i++) {
            var music = new Music(window.popMuiscList[i]);
            html += '<li class="flex-box hover-pointer" data-musicId="' + music.MusicExternalId + '" onclick="selectCurrentPopMusic(this)">';
            html += '<span class="music-checkbox"><input type="checkbox"/></span>';
            html += '<span class="music-sequence">' + (i + 1) + "</span>";
            html += "<span>" + music.MusicName + "</span>";
            html += "</li>";
        }
        $("#popularMusics").html(html);
    });
}

function selectCurrentPopMusic(target) {
    var checkbox = $(target).find(".music-checkbox >input");
    checkbox.prop("checked", !checkbox.is(":checked"));
    updatePlayPopBtnStatus();
    updatePlaySearchBtnStatus();
}

function updatePlayPopBtnStatus() {
    var cnt = $("#popularMusics").find(".music-checkbox >input:checked").length;
    if (cnt > 0) {
        $("#playPopBtn").show();
    } else {
        $("#playPopBtn").hide();
    }
}
function selectAllPop(target) {
    var isAll = $(target).find('input[type="checkbox"]').is(":checked");
    $("#popularMusics").find('input[type="checkbox"]').prop("checked", isAll);
    updatePlayPopBtnStatus();

}

function playPopMusic() {
    $("#popularMusics").find(".music-checkbox >input:checked").each(function () {
        var musicId = $(this).closest("li").attr("data-musicId");
        var music = findMusicInPopularListByMusicId(musicId);
        var existedMusic = findMusicInPlayingListByMusicId(musicId);
        if (existedMusic == null && music != null){
            playingList.push(music);
            updateDataIntoLocalStorage();
        }
    });
        window.currentPlayingMusic = window.playingList[0];
        loadMusic();
    
    window.status = STATUS.Playing;
    $("#playBtn").removeClass("fa-play-circle");
    $("#playBtn").addClass("fa-pause-circle");
    $("#playBtn").attr("onclick", "pausemusic(this)");

}


function searchMusic() {
    var keyword = $("#searchKeyWordInput").val();
    if (keyword == "") {
        return;
    }
    pageNum = 0;
    searchResultList = [];
    $("#searchMusicList > ul").html("Loading...");
    $.ajax({
        url: "/Music/SearchMusic",
        data: {
            keyword: keyword,
            pageNum: pageNum
        }
    }).done(function (res) {
        var batch = $.parseJSON(res);
        $("#searchMusicList > ul").html("");
        if (batch.length < 15) {
            $("#searchShowMoreBtn").hide();
        } else {
            $("#searchShowMoreBtn").show();
        }
        var html = "";
        html += '<li class="flex-box">';
        html += '<span class="music-checkbox"></span>';
        html += '<span class="music-name"><b>MusicName</b></span>';
        html += '<span class="artist-name"><b>Artist</b></span>';
        html += '<span class="album-name"><b>Album</b></span>';
        html += "<span><b>Rate</b></span>";
        html += "</li>";
        for (var i = 0; i < batch.length; i++) {
            searchResultList.push(batch[i]);
            html += generateOneMusic(batch[i]);
        }
        $("#searchMusicList > ul").append(html);
    });
}

function searchMore(target) {
    $(target).html("Loading...");
    $(target).removeAttr("onclick");
    var keyword = $("#searchKeyWordInput").val();
    if (keyword == "") {
        return;
    }
    pageNum++;
    $.ajax({
        url: "/Music/SearchMusic",
        data: {
            keyword: keyword,
            pageNum: pageNum
        }
    }).done(function (res) {
        $(target).html('<span class="fa fa-angle-double-down" aria-hidden="true"></span>&nbsp;More');
        $(target).attr("onclick", "searchMore(this)");
        var batch = $.parseJSON(res);
        if (batch.length < 15) {
            $("#searchShowMoreBtn").hide();
        } else {
            $("#searchShowMoreBtn").show();
        }
        var html = "";
        for (var i = 0; i < batch.length; i++) {
            searchResultList.push(batch[i]);
            html += generateOneMusic(batch[i]);
        }
        $("#searchMusicList").append(html);
    });
}

function generateOneMusic(music) {
    var html = "";
    html += '<li class="flex-box hover-pointer" data-musicId="' + music.MusicExternalId + '" onclick="selectCurrentPopMusic(this)">';
    html += '<span class="music-checkbox"><input type="checkbox"/></span>';
    html += '<span class="music-name">' + music.MusicName + "</span>";
    html += '<span class="artist-name">' + music.Artist + "</span>";
    html += '<span class="album-name">' + music.Album + "</span>";
    html += "<span>" + (music.Rate/5).toFixed(1) + "/5.0</span>";
    html += "</li>";
    return html;
}


function enterKeySearch(event) {
    if (event.keyCode == 13) {
        searchMusic();
    }
}

function selectAllSearch(target) {
    var isChecked = $(target).find('input[type="checkbox"]').is(":checked");
    $("#searchMusicList").find('input[type="checkbox"]').prop("checked", isChecked);
    updatePlaySearchBtnStatus();
}


function updatePlaySearchBtnStatus() {
    var cnt = $("#searchMusicList").find('input[type="checkbox"]:checked').length;
    if (cnt > 0) {
        $("#playSearchMusicBtn").show();
    } else {
        $("#playSearchMusicBtn").hide();
    }
}


function playSearchMusic() {
    $("#searchMusicList").find('input[type="checkbox"]:checked').each(function () {
        var musicId = $(this).closest("li").attr("data-musicId");
        var music = findMusicInSearchListByMusicId(musicId);
        var existedMusic = findMusicInPlayingListByMusicId(musicId);
        if (existedMusic == null && music!=null) {
            playingList.splice(0, 0, music);
            updateDataIntoLocalStorage();
        }
    });
        window.currentPlayingMusic = window.playingList[0];
        loadMusic();
    window.status = STATUS.Playing;
    $("#playBtn").removeClass("fa-play-circle");
    $("#playBtn").addClass("fa-pause-circle");
    $("#playBtn").attr("onclick", "pausemusic(this)");

}