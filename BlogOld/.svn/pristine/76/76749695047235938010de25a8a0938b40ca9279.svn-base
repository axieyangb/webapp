
var articleList = [];
var pagingSize = 10;
var lock = false;

var loadingBlockHtml = '<div id= "loadingBlock" class="text-center">' +
    ' <img class="imgLoading" src="/Content/img/loading2.gif" />' +
    '<span>Loading...</span>' +
    '</div >';

$(document).ready(function() {
    loadArticlesPost();
    loadPhotosPost();
    loadCommentsPost();
    loadRecentPublishArticles();
    $('[data-toggle="tooltip"]').tooltip();
    infiniteScollBar();
});

function loadArticlesPost() {
    var userId = $('#userId').val();
    $.ajax({
        url: '/User/GetPostArticles',
        data: { userId: userId }
    }).done(function (res) {
        increaseNum($('#articles'), parseInt(res));
    });
}


function loadPhotosPost() {
    var userId = $('#userId').val();
    $.ajax({
        url: '/User/GetPostPhotos',
        data: { userId: userId }
    }).done(function (res) {
        increaseNum($('#photos'), parseInt(res));
    });
}


function loadCommentsPost() {
    var userId = $('#userId').val();
    $.ajax({
        url: '/User/GetComments',
        data: { userId: userId }
    }).done(function (res) {
        increaseNum($('#replies'), parseInt(res));
    });
}


function infiniteScollBar() {
    $(window).unbind('scroll');
    $(window).scroll(function () {
        if ($(document).height() - $(window).height() <= $(window).scrollTop() + 10 && !lock) {
            lock = true;
            articlesShowMore();
        }
    });
}

function articlesShowMore() {
    loadRecentPublishArticles();
}


function loadRecentPublishArticles() {
    var userId = $('#userId').val();
    $('#articleList').append(loadingBlockHtml);
    $.ajax({
        url: '/User/GetMostRecentArticles',
        data: {
            userId: userId,
            skipNum: articleList.length,
            takeNum: pagingSize
        }
    }).done(function (res) {
        var pulledArticles = JSON.parse(res);
        var domStr = "";
        for (var i = 0; i < pulledArticles.length; i++) {
            articleList.push(pulledArticles[i]);
            domStr += generateArticleDom(pulledArticles[i]);
        }
        $('#articleList').append(domStr);
        lock = false;
        $('#loadingBlock').remove();
    });
}

function animatedScoll() {
    $('body,html').animate({
        scrollTop: 0                       // Scroll to top of body
    }, 500);
}



function generateArticleDom(article) {
    var lang = $('#lang').val();
    var ret = "";
    ret += "<div class=\"post-preview\">" +
        "<a href=\"\\"+lang+"\\Article\\Index\\" +
        article.ArticleId +
        "\">" +
        "<h2 class=\"post-title\">" +
        article.Title +
        "</h2>" +
        "<h3 class=\"post-subtitle\">" +
        article.SubTitle +
        "</h3>" +
        "</a>" +
        "<p class=\"post-meta\">Posted by <a href=\"\\" + lang + "\\User\\Index\\" +
        article.AuthorId +
        "\" target=\"_blank\">" +
        article.AuthorName +
        "</a> <span class=\"postdate\"> " +
        time_ago(article.PostDate) +
        "</span></p></div>" +
        "<hr>";
    return ret;
}


function increaseNum(e, num) {

    $(e).prop('Counter', 0).animate({
        Counter: num
    }, {
        duration: 1000,
        easing: 'swing',
        step: function (now) {
            $(this).text(Math.ceil(now));
        }
    });
}
