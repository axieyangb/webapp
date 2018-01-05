var SearchType =
{
    Title: 1,
    SubTitle: 2,
    Author: 3,
    TagName: 4,
    Year: 5,
    Month: 6,
    Day: 7,
    Content: 8,
    None: 0
}

var SearchTypeStr = ["None", "Title", "SubTitle", "Author", "TagName", "Year", "Month", "Day", "Content"];
var OrderType =
{
    PostTimeAsc: 1,
    PostTimeDesc: 2,
    TitleNameAsc: 3,
    TitleNameDesc: 4,
    AuthorAsc: 5,
    AuthorDesc: 6,
    None: 0
}
var OrderTypeStr = ["None", "PostTime Asc", "PostTime Desc", "TitleName Asc", "TitleName Desc", "AuthorName Asc", "AuthorName Desc"];

var FilterTypeStr = ["None", "Tag Name", "Author Name", "Month"];

var FilterType =
{
    TagId: 1,
    AuthorId: 2,
    Month: 3,
    None: 0
}

var loadingBlockHtml = '<div id= "loadingBlock" class="text-center">' +
                    ' <img class="imgLoading" src="/Content/img/loading2.gif" />' +
                    '<span>Loading...</span>' +
                    '</div >';

var categoryType = {
    Tag: 0,
    Month: 1,
    Author: 2
}
var categoryList = [null, null, null];
var categoryTitleStr = ["Most Popular Topics", "Monthly Article Posts", "Author List"];
var currentCategoryOffset = 0;
var lock = false;
var articleList = [];
var articleShowingNum = 10;
//Default order 
var orderType = OrderType.None;
//Default search
var searchType = null;
var searchContent = null;

var filterType = null;
var filterContent = null;


var showingNum = 10;
var lang = null;

function moveCategory(offset) {
    if (filterType == FilterType.TagId && currentCategoryOffset == categoryType.Tag ||
        filterType == FilterType.Month && currentCategoryOffset == categoryType.Month ||
        filterType == FilterType.AuthorId && currentCategoryOffset == categoryType.Author
    ) {
        filterType = null;
        filterContent = null;
        resetAndSearch();
    }
    currentCategoryOffset = (currentCategoryOffset + categoryList.length + offset) % categoryList.length;
    showingNum = 10;
    fetchCateogry();
}
function fetchCateogry() {
    if (categoryList[currentCategoryOffset] != null) {
        listDomGenerate(categoryList[currentCategoryOffset]);
    } else {
        if (currentCategoryOffset == categoryType.Tag) {
            $.ajax({
                url: '/' + lang + '/Home/GetTagList'
            }).done(function (res) {
                categoryList[currentCategoryOffset] = JSON.parse(res);
                listDomGenerate(categoryList[currentCategoryOffset]);
            });
        }
        else if (currentCategoryOffset == categoryType.Month) {
            $.ajax({
                url: '/' + lang + '/Home/GetMonthList'
            }).done(function (res) {
                categoryList[currentCategoryOffset] = JSON.parse(res);
                listDomGenerate(categoryList[currentCategoryOffset]);
            });
        }
        else if (currentCategoryOffset == categoryType.Author) {
            $.ajax({
                url: '/' + lang + '/Home/GetAuthorList'
            }).done(function (res) {
                categoryList[currentCategoryOffset] = JSON.parse(res);
                listDomGenerate(categoryList[currentCategoryOffset]);
            });
        }
    }

    $('.categoryName').html(categoryTitleStr[currentCategoryOffset]);
}

function listDomGenerate(list) {
    var htmlStr = '';
    for (var i = 0; list != null && i < list.length && i < showingNum ; i++) {
        htmlStr += oneItemDomGenerate(list[i]);
    }
    $('#categoryItemList').html(htmlStr);
    if (list != null && list.length > showingNum) {
        $('#categoryItemList')
            .append('<span class="list-group-item"><button  onclick="expendAllItems()" class="btn-link">Show More...</button></span>');
    }
}
function oneItemDomGenerate(item) {
    var html = '';
    if (currentCategoryOffset === categoryType.Tag) {
        html = '<span class="list-group-item">' +
            '<a class="btn btn-sm btn-link pull-left" data-tagId="' +
            item.TagId +
            '" data-content="' +
            item.TagContent +
            '" onclick="filterByTagId(this)">' +
            item.TagContent +
            '</a><span class="badge pull-right">' +
            item.TagCount +
            '</span>' +
            '</span>';
    }
    else if (currentCategoryOffset === categoryType.Month) {
        html = '<span class="list-group-item">' +
            '<a class="btn btn-sm btn-link pull-left" data-month="' +
            item.Month +
            '" data-year="' +
            item.Year +
            '" onclick="filterByMonth(this)">' +
            item.Year + "-" + (item.Month < 10 ? "0" + item.Month : item.Month) +
            '</a><span class="badge pull-right">' +
            item.Count +
            '</span>' +
            '</span>';
    }
    else if (currentCategoryOffset === categoryType.Author) {
        html = '<span class="list-group-item">' +
            '<a class="btn btn-sm btn-link pull-left" data-authorid="' +
            item.AuthorId +
            '" data-authorName="' + item.AuthorName + '" onclick="filterByAuthorId(this)">' +
            item.AuthorName +
            '</a><span class="badge pull-right">' +
            item.Count +
            '</span>' +
            '</span>';
    }
    return html;
}


function expendAllItems() {
    showingNum = categoryList[currentCategoryOffset].length;
    listDomGenerate(categoryList[currentCategoryOffset]);
}



function fetchArticleList() {
    lock = true;
    var search;
    $('#articlesList').append(loadingBlockHtml);
    if (searchType != null && searchContent != null) {
        search = {
            'Type': searchType,
            'Content': searchContent
        }
    } else {
        search = null;
    }
    var filter;
    if (filterType != null && filterContent != null) {
        filter = {
            'Type': filterType,
            'Content': filterContent
        }
    } else {
        filter = null;
    }

    $.ajax({
        method: 'Post',
        url: '/' + lang + '/Home/GetArticleList',
        data: JSON.stringify({
            orderType: orderType,
            filterType: filter,
            searchType: search,
            scope: {
                'Start': articleList.length,
                'End': articleShowingNum
            }
        }),
        contentType: "application/json; charset=utf-8"
    }).done(function (res) {
        var tempList = JSON.parse(res);
        $('#loadingBlock').remove();
        addFilterLabel();
        if (tempList.length === 0) {
            $(window).unbind('scroll');

            if (articleList.length == 0) {
                $('#articlesList').html('<div class="panel panel-default" style="margin-top:35px;"><div class="panel-body"><h4 class="text-danger"><span class="glyphicon glyphicon-alert"></span>&nbsp;No matched articles found</h4></div></div>');
            }
            return;
        }
        for (var i = 0; i < tempList.length; i++) {
            articleList.push(tempList[i]);
        }
        articleListDomGenerate();
        infiniteScollBar();
        lock = false;
    });
}



function articleListDomGenerate() {
    var htmlStr = '';
    for (var i = 0; articleList != null && i < articleList.length && i < articleShowingNum; i++) {
        var article = articleList[i];
        htmlStr += oneArticleDomGenerate(article);
    }
    $('#articlesList').html(htmlStr);
    $('.screenshot').each(function () {
        $(this).unbind('popover');
        var articleId = $(this).attr('data-atricleid');
        var src = "/Content/img/screenCaptures/en_Article_Index_" + articleId + ".jpg";
        $(this).popover({
            trigger: 'hover',
            container: 'body',
            html: true,
            content: '<img width="355.6" height="200" src ="' + src + '"/>',
            placement:'bottom'
    });
    });
}
function oneArticleDomGenerate(article) {
    var tags = '';
    article = highlight(article);
    if (article.Tags != null) {
        for (var i = 0; i < article.Tags.length; i++) {
            var oneTag = article.Tags[i];
            tags += '<a class="cursor-pointer" onclick="showTagCategory(' + oneTag.Key + ')" target="_blank" title="' + oneTag.Value + ' tag"> ' +
                ' <span class="label label-default" > ' +
                '<span class="glyphicon glyphicon-tags"></span> &nbsp;' + oneTag.Value + ' ' +
                  '</span> ' +
                   '</a > ';
        }
    }
    var html = ' <div class="post-preview"> ' +
        ' <a href="/' + lang + '/Article/Index/' + article.ArticleId + '" target="_blank">' +
        ' <h2 class="post-title">' +
        article.Title +
        ' </h2>' +
        ' <h3 class="post-subtitle">' +
        article.SubTitle +
        ' </h3>' +
        ' </a>' +
        ' <p class="post-meta">Posted by <a class="btn-link" href="/' + lang + '/User/Index/' + article.AuthorId + '" target="_blank">' + article.AuthorName + '</a> <span class="postdate">' + time_ago(article.PostDate) + '</span>' +
        '&nbsp;&nbsp;<span class="screenshot text-muted cursor-pointer fa fa-camera-retro" aria-hidden="true" data-atricleid="' + article.ArticleId + '"></span></p>' +
        '<span id="tagsForArticle">' + tags + '</span>' +
    '</div > ';
    return html;
}


function highlight(article) {
    if (searchType == null || searchType == SearchType.None || searchContent == null) return article;
    var newArticle = $.extend({}, article);
    if (searchType == SearchType.Author) {
        var startIdxForAuthor = newArticle.AuthorName.toLowerCase().indexOf(searchContent.toLowerCase());
        if (startIdxForAuthor < 0) return article;
        var endIdxForAuthor = startIdxForAuthor + searchContent.length;
        newArticle.AuthorName = article.AuthorName.substring(0, startIdxForAuthor) +
            "<mark>" +
            article.AuthorName.substring(startIdxForAuthor, endIdxForAuthor) +
            "</mark>" +
            article.AuthorName.substring(endIdxForAuthor);
    }
    else if (searchType == SearchType.SubTitle) {
        var startIdx = newArticle.SubTitle.toLowerCase().indexOf(searchContent.toLowerCase());
        if (startIdx < 0) return article;
        var endIdx = startIdx + searchContent.length;
        newArticle.SubTitle = article.SubTitle.substring(0, startIdx) +
            "<mark>" +
            article.SubTitle.substring(startIdx, endIdx) +
            "</mark>" +
            article.SubTitle.substring(endIdx);
    }
    else if (searchType == SearchType.Title) {
        var startIdxForTitle = newArticle.Title.toLowerCase().indexOf(searchContent.toLowerCase());
        if (startIdxForTitle < 0) return article;
        var endIdxForTitle = startIdxForTitle + searchContent.length;
        newArticle.Title = article.Title.substring(0, startIdxForTitle) +
            "<mark>" +
            article.Title.substring(startIdxForTitle, endIdxForTitle) +
            "</mark>" +
            article.Title.substring(endIdxForTitle);
    }
    return newArticle;
}

function addFilterLabel() {
    var filterTags = '';
    if (orderType != null && orderType != OrderType.None) {
        filterTags += '<span class="tag tag-dismiss label label-primary"> ' +
            ' <span> Sorted By: ' +
            OrderTypeStr[orderType] +
            '</span > ' +
            '<a onclick="removeOrderOption(this)"><i class="glyphicon remove glyphicon-remove-sign glyphicon-white"></i></a></span>';
    }
    if (searchType != null && searchType != SearchType.None) {
        var tagNameSearch =searchContent==null ? "":searchContent;
        filterTags += '&nbsp;&nbsp;&nbsp;<span class="tag tag-dismiss label label-primary"> ' +
            ' <span> Search By: ' +
            SearchTypeStr[searchType] +
            ' ( ' +
            tagNameSearch +
            ' )</span > ' +
            '<a onclick="removeSearchOption(this)"><i class="glyphicon remove glyphicon-remove-sign glyphicon-white"></i></a></span>';


    }
    if (filterType != null && filterType != FilterType.None) {
        var tagNameFilter;
        if (filterType == FilterType.TagId) {
            tagNameFilter = $('a[data-tagid="' + filterContent + '"]').text();
        }
         else if (filterType == FilterType.AuthorId) {
             tagNameFilter = $('a[data-authorid="' + filterContent + '"]').attr('data-authorname');
        }
        else {
             tagNameFilter = filterContent == null ? "" : filterContent;
        }
        filterTags += '&nbsp;&nbsp;&nbsp;<span class="tag tag-dismiss label label-primary"> ' +
            ' <span> Filter By: ' +
            FilterTypeStr[filterType] +
            ' ( ' +
            tagNameFilter +
            ' )</span > ' +
            '<a onclick="removeFilterOption(this)"><i class="glyphicon remove glyphicon-remove-sign glyphicon-white"></i></a></span>';
    }
    $('#filterTags').html(filterTags);
}


function removeSearchOption(e) {
    $(e).parent().remove();
    searchType = null;
    searchContent = null;
    resetAndSearch();

}

function removeFilterOption(e) {
    $(e).parent().remove();
    if (filterType == FilterType.TagId) {
        $('.tagSelected').children('a').attr('onclick', 'filterByTagId(this)');
        $('.tagSelected').removeClass('tagSelected');
    }
    else if (filterType == FilterType.AuthorId) {
        $('.tagSelected').children('a').attr('onclick', 'filterByAuthorId(this)');
        $('.tagSelected').removeClass('tagSelected');
    }
    else if (filterType == FilterType.Month) {
        $('.tagSelected').children('a').attr('onclick', 'filterByMonth(this)');
        $('.tagSelected').removeClass('tagSelected');
    }
    filterType = null;
    filterContent = null;
    resetAndSearch();
}

function removeOrderOption(e) {
    $(e).parent().remove();
    orderType = OrderType.None;
    resetAndSearch();

}

function articlesShowMore(moreNum) {
    articleShowingNum += moreNum;
    fetchArticleList();
}

function infiniteScollBar() {
    $(window).unbind('scroll');
    $(window).scroll(function () {
        if ($(document).height() - $(window).height() <= $(window).scrollTop() + 10 && !lock) {
            articlesShowMore(12);
        }
    });

}

function animatedScoll() {
    $('body,html').animate({
        scrollTop: 0                       // Scroll to top of body
    }, 500);
}

function filterByTagId(e) {
    var tagId = $(e).attr('data-tagid');
    $('.tagSelected').children('a').attr('onclick', 'filterByTagId(this)');
    $('.tagSelected').removeClass('tagSelected');
    $(e).parent().addClass('tagSelected');
    $(e).attr('onclick', 'cancelFilterByTagId(this)');
    filterType = FilterType.TagId;
    filterContent = tagId;
    resetAndSearch();
}


function filterByMonth(target) {
    filterType = FilterType.Month;
    filterContent = $(target).attr('data-year') + "-" + $(target).attr('data-month');
    $('.tagSelected').removeClass('tagSelected');
    $(target).parent().addClass('tagSelected');
    $(target).attr('onclick', 'cancelFilterByMonth(this)');
    resetAndSearch();
}

//function searchByAuthor(target) {
//    searchType = SearchType.Author;
//    searchContent = $(target).attr('data-authorName');
//    $('.tagSelected').removeClass('tagSelected');
//    $(target).parent().addClass('tagSelected');
//    $(target).attr('onclick', 'cancelSearchByAuthor(this)');
//    resetAndSearch();
//}


function filterByAuthorId(target) {
    filterType = FilterType.AuthorId;
    filterContent = $(target).attr('data-authorid');
    $('.tagSelected').removeClass('tagSelected');
    $(target).parent().addClass('tagSelected');
    $(target).attr('onclick', 'cancelFilterByAuthorId(this)');
    resetAndSearch();
}


function showTagCategory(tagkey) {
    currentCategoryOffset = categoryType.Tag;
    fetchCateogry();
    expendAllItems();
    $('a[data-tagId="' + tagkey + '"]').click();
}

function cancelFilterByAuthorId(target) {
    $(target).parent().removeClass('tagSelected');
    $(target).attr('onclick', 'filterByAuthorId(this)');
    filterType = null;
    filterContent = null;
    resetAndSearch();
}

function cancelFilterByMonth(target) {
    $(target).parent().removeClass('tagSelected');
    $(target).attr('onclick', 'filterByMonth(this)');
    filterType = null;
    filterContent = null;
    resetAndSearch();
}

function cancelFilterByTagId(e) {
    $(e).parent().removeClass('tagSelected');
    $(e).attr('onclick', 'filterByTagId(this)');
    filterType = null;
    filterContent = null;
    resetAndSearch();
}

function searchSelector(e) {
    var type = parseInt($(e).attr('data-value'));
    if (type == SearchType.Year) {
        $('#searchInput').attr('type', 'number');
        $('#searchInput').val(new Date().toYearInputValue());
    }
    else if (type == SearchType.Month) {
        $('#searchInput').attr('type', 'month');
        $('#searchInput').val(new Date().toMonthInputValue());
    }
    else if (type == SearchType.Day) {
        $('#searchInput').attr('type', 'date');
        $('#searchInput').val(new Date().toDateInputValue());
    } else {
        $('#searchInput').attr('type', 'text');
        $('#searchInput').val('');
    }

    $('#searchCategory').html($(e).html());
    $('#searchCategory').attr('data-value', type);
    $('#searchInput').removeAttr('disabled');
    $('#goSearch').removeAttr('disabled');
}


function enterKeySearch(event) {
    if (event.keyCode == 13) {
        searchRun();
    }
}
function searchRun() {
    searchContent = null;
    var type = $('#searchCategory').attr('data-value');
    searchType = parseInt(type);
    var keyword = $('#searchInput').val();
    if (keyword != '') {
        searchContent = keyword;
    }
    resetAndSearch();
}

function resetAndSearch() {
    articleList = [];
    articleShowingNum = 10;
    $('#articlesList').html('');
    fetchArticleList();
}


function orderBy(e) {
    var val = parseInt($(e).attr('data-value'));
    if (val == OrderType.PostTimeDesc) {
        $(e).attr('data-value', OrderType.PostTimeAsc);
        $(e).html('<span class="glyphicon glyphicon-sort-by-attributes"></span>&nbsp;Post Time');
    }
    else if (val == OrderType.PostTimeAsc) {
        $(e).attr('data-value', OrderType.PostTimeDesc);
        $(e).html('<span class="glyphicon glyphicon-sort-by-attributes-alt"></span>&nbsp;Post Time');
    }
    else if (val == OrderType.TitleNameDesc) {
        $(e).attr('data-value', OrderType.TitleNameAsc);
        $(e).html(' <span class="glyphicon glyphicon-sort-by-alphabet"></span>&nbsp;Title');
    }
    else if (val == OrderType.TitleNameAsc) {
        $(e).attr('data-value', OrderType.TitleNameDesc);
        $(e).html('<span class="glyphicon glyphicon-sort-by-alphabet-alt"></span>&nbsp;Title');
    }
    orderType = val;
    resetAndSearch();
}
$(document).ready(function () {
    lang = $('#lang').val();
    fetchCateogry();
    fetchArticleList();

});



//helper

Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});


Date.prototype.toMonthInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 7);
});

Date.prototype.toYearInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 4);
});

