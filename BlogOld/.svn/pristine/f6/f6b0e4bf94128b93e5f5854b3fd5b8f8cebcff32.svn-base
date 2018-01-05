$(document).ready(function () {

    if ($(document).height() < $(window).height()) {
        $('.overlay').height($(window).height());
    } else {
        $('.overlay').height($(document).height());
    }
    $(window)
        .resize(function () {
            if ($(document).height() < $(window).height()) {
                $('.overlay').height($(window).height());
            } else {
                $('.overlay').height($(document).height());
            }
        });
    $('input[name="onoff"]')
        .change(function () {
            $('.overlay').fadeOut(300);
            $('.row').delay(300).fadeIn(200);
            initialize();
        });
});

function initialize() {
    $.each($('.text-wrap-ellipsis,.text-ellipsis'), function (index, value) {
        var scrollHeight = this.scrollHeight;
        var innerHeight = $(this).innerHeight();
        var scrollWidth = this.scrollWidth;
        var innerWidth = $(this).innerWidth();
        if (scrollHeight > innerHeight || scrollWidth > innerWidth) {
            $(this).addClass('pointer-cusor');
            $(this).popover({
                placement: 'top',
                content: $(this).html(),
                html: true,
                trigger: 'hover'
            });

        }
    });

}

function showMoreImgs(projectName) {
    var imgSection = "";
    var imgUrls = [];
    if (projectName === "AdminPortal") {
        imgUrls.push("../../Content/img/projectImgs/AdminPortal/Project_Adminportal_MemberSearch.png");
        imgUrls.push("../../Content/img/projectImgs/AdminPortal/Project_Adminportal_MemberDetail.png");
        imgUrls.push("../../Content/img/projectImgs/AdminPortal/Project_Adminportal_EDIFileMonitor.png");
    }
    else if (projectName === "ProviderSearch") {
        imgUrls.push("../../Content/img/projectImgs/ProviderSearch/Project_ProviderSearch_SearchResult.png");
        imgUrls.push("../../Content/img/projectImgs/ProviderSearch/Project_ProviderSearch_SearchFilter.png");
    }
    else if (projectName === "JobSearch") {
        imgUrls.push("../../Content/img/projectImgs/JobSearch/Project_JobSearch_Filter.png");
        imgUrls.push("../../Content/img/projectImgs/JobSearch/Project_JobSearch_Login.png");
        imgUrls.push("../../Content/img/projectImgs/JobSearch/Project_JobSearch_Filter.png");
        
    }
    for (var i = 0; i < imgUrls.length; i++) {
        imgSection += ImageSectionHtml(imgUrls[i]);
    }

    $("#moreProjectImages").html('<div class="row">' + imgSection +
        '</div>');
    $("#showProjectDetail").modal();
}

function showTechnicalDetail(projectName) {
    var details = '<h3>Constructing...</h3>';
    if (projectName === "ProviderSearch") {

    } else if (projectName === "AdminPortal") {

    } else if (projectName === "JobSearch")
    {

    }
    $('#moreProjectImages').html(details);
    $('#showProjectDetail').modal();
}

function ImageSectionHtml(url) {
    return '<div class="col-xs-12">' +
        '<div class="thumbnail">' +
        '<img src="' + url + '" />' +
        '</div>' +
        '</div>';
}

function showLargerImage(e) {
    var url = $(e).attr('src');
    $('#moreLargerImageBody').html(ImageSectionHtml(url));
    $("#moreLargerImage").modal();
}



