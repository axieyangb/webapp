$(document).ready(function () {
    //FANCYBOX
    getPictureList();
    
    $(window).scroll(function () {
        // Vertical end reached?
        if ($(document).height() - $(window).height() <= $(window).scrollTop() + 10) {
            $('button[onclick="cancelDownload(this)"]').click();
            showMore(12);
        }
    });

    // ===== Scroll to Top ==== 
    $(window).scroll(function () {
        if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
            $('#return-to-top').fadeIn(200);    // Fade in the arrow
        } else {
            $('#return-to-top').fadeOut(200);   // Else fade out the arrow
        }
    });
    $('#return-to-top').click(function () {      // When arrow is clicked
        $('body,html').animate({
            scrollTop: 0                       // Scroll to top of body
        }, 500);
    });



});
$(document).bind("fullscreenerror", function () {
    alert("Browser rejected fullscreen change");
});

function removeOverlay(e) {
    $(e).removeClass('overlay-fullscreen');
    $('#fullscreenImgSection').hide();
}

function initializeFancyBox(e) {
    $(e).children(".fancybox").unbind("fancybox");
    $(e).children(".fancybox").fancybox({
        prevEffect: 'none',
        nextEffect: 'none',

        afterShow: function () {
            $('<a class="fullscreentoggle"></a>')
                .appendTo(this.inner)
                .click(function () {
                    var src = $(this).prev().attr('src');
                    $('#fullscreenImgSection').addClass('overlay-fullscreen');
                    $('#fullscreenImgSection').attr('onclick', 'removeOverlay(this)');
                    $('#fullscreenImgSection').show();
                    var styleStr = "background-image:url(\"" + src + "\");";
                    if ($(window).width() > $(window).height()) {
                        styleStr += "background-size:auto 100%;";
                    }
                    else {
                        styleStr += "background-size:100% auto;";
                    }
                    $('.Gallery').hide();

                    $('#fullscreenImgSection').attr('style', styleStr);
                });
        },
        afterClose: function () {
            $(document).fullScreen(false);
            $('.Gallery').show();
        },
        helpers: {
            title: { type: 'inside' }
            //,
            //thumbs: {
            //    width: 50,
            //    height: 50,
            //    source: function (current) {
            //        return $(current.element).data('thumbnail');
            //    }
            //}
        }
    });
}


function getPictureList() {
    $.ajax({
        method: 'get',
        url: '/Gallery/GetImgList'
    }).done(function (res) {
        pictures = JSON.parse(res);
        $('#total').text(pictures.length);
        addToDom();
    });
}

function setPageSize(s){
    size=s;
}


function addToDom() {
    var retStr = "";
    for (; lastLoaded < size; lastLoaded++) {
        var pic = pictures[lastLoaded];
        retStr += domForOnePic(pic);
    }
    $('.gallery').append(retStr);
    $('#showing').text(lastLoaded);
    initializeFancyBox($(".onePic"));
}

function domForOnePic(pic) {
    var lang = $('#lang');
        var oneStr = "<div class='col-sm-4 col-xs-6 col-md-3 col-lg-3 onePic' data-pictureId='" + pic.PictureId + "'> " +
                    "    <a class='thumbnail fancybox' style='margin-bottom:0px;' rel='ligthbox' href='" + pic.Url + "' data-thumbnail='/Content/Users/" + pic.UserId + '/thumbtail/' + pic.FileName + "' title='"+pic.Description+"'>" +
                     "       <img class='img-responsive fancybox-thumb' rel='fancybox-thumb' alt='" + pic.Description + "' src='/Content/Users/" + pic.UserId + "/thumbtail/" + pic.FileName + "'/>" +
                      "    </a>" +
                     "<div class='row thumbnail'>" +
                   "<div class='briefInfo col-xs-12'>" +
                     " <span class='pull-left'>" +
                      "        <small class='cursor-pointer rateSeg' onclick='showRateModal(this)' data-pictureId='" + pic.PictureId + "'><span class='glyphicon glyphicon-glyphicon glyphicon-star'></span>&nbsp;<span>" + parseFloat(pic.Rate).toFixed(1) + "</span>/5.0 </small>&nbsp;&nbsp;" +
                      "        <small class='cursor-pointer' onclick='thumbUp(this)' data-pictureId='" + pic.PictureId + "'><span class='glyphicon glyphicon-thumbs-up'></span>&nbsp;<span>" + pic.Like + "</span></small>" +
                     "</span>" + 
                    "        <span class='pull-right'>" +
                     "           <small class='text-muted'><span class='glyphicon glyphicon-time'></span>&nbsp;" + pic.CaptureTime + "</small>" +
                     "   &nbsp;&nbsp;<span class='glyphicon glyphicon-chevron-down cursor-pointer text-info' onclick='openDetail(this)' ></span>" +
                     "       </span>  " +
                   "</div>" +
                     "<div class='detailInfo col-xs-12 row' style='display:none'> " +
                                            "<div class='metaInfo col-xs-12 row' > " +
                                             "<h3 class='col-xs-12 text-center'>Picture Description</h3>" +
                                              "<span class='col-xs-12 text-center text-info'>" +(pic.Description === "" ? "This guy is too lazy to leave any description" : pic.Description )+ "</span>" +
                                            "</div>"+
                       "<div class='metaInfo col-xs-12 row' > " +
                             "<h3 class='col-xs-12 text-center'>Picture Meta Data</h3>" +
                              "<span class='col-xs-6 text-right'> Capture Time  :</span> <span class='col-xs-6 text-left'>&nbsp;" + pic.CaptureTime + "</span>" +
                             "<span class='col-xs-6 text-right'> Image Height  :</span> <span class='col-xs-6 text-left'>&nbsp;" + (pic.ImageHeight == null ? "Unknown" : pic.ImageHeight) + "</span>" +
                             "<span class='col-xs-6 text-right'> Image Width  :</span> <span class='col-xs-6 text-left'>&nbsp;" +(pic.ImageWidth == null ? "Unknown" :  pic.ImageWidth) + "</span>" +
                              "<span class='col-xs-6 text-right'> Content Type :</span> <span class='col-xs-6 text-left'>&nbsp;" +(pic.ContentType== null ? "Unknown" :   pic.ContentType) + "</span>" +
                              "<span class='col-xs-6 text-right'>Camera Model  :</span> <span class='col-xs-6 text-left'>&nbsp;" + (pic.CameraModel== null ? "Unknown" : pic.CameraModel) + "</span>" +
                              "<span class='col-xs-6 text-right'>Exposure  :</span> <span class='col-xs-6 text-left'>&nbsp;" + (pic.Exposure== null ? "Unknown" :pic.Exposure)  + "</span>" +
                              "<span class='col-xs-6 text-right'>Aperture  :</span> <span class='col-xs-6 text-left'>&nbsp;" + (pic.Aperture== null ? "Unknown" : pic.Aperture) + "</span>" +
                              "<span class='col-xs-6 text-right'>Iso  :</span> <span class='col-xs-6 text-left'>&nbsp;" + (pic.Iso== null ? "Unknown" :pic.Iso)  + "</span>" +
                              "<span class='col-xs-6 text-right'>Focus Length  :</span> <span class='col-xs-6 text-left'>&nbsp;" + (pic.FocusLength== null ? "Unknown" :pic.FocusLength)  + "</span>" +
                              "<span class='col-xs-6 text-right'>White Balance Mode  :</span> <span class='col-xs-6 text-left'>&nbsp;" + (pic.WhiteBalanceMode== null ? "Unknown" : pic.WhiteBalanceMode) + "</span>" +
                               "<span class='col-xs-6 text-right'>Lens Model  :</span> <span class='col-xs-6 text-left'>&nbsp;" +(pic.LensModel== null ? "Unknown" :pic.LensModel)  + "</span>" +
                               "<span class='col-xs-6 text-right'>Software  :</span> <span class='col-xs-6 text-left'>&nbsp;" + (pic.Software== null ? "Unknown" : pic.Software) + "</span>" +
                       "</div>" +
                       "<div class='authorInfo col-xs-12 row' > " +
                          "<h3 class='col-xs-12 text-center'>Publish Information</h3>" +
                       "<span class='col-xs-6 col-md-3 col-sm-6 text-right'><b> Author:</b></span><span class=' col-xs-6 col-md-3 col-sm-6 text-left'><a class='btn-link' href='/" + lang + "/User/Index/" + pic.UserId + "'>&nbsp;" + pic.AuthorName + "</a></span>" +
                       "<span class='col-xs-6 col-md-3 col-sm-6 text-right'><b>Most Recent Publish Date:</b></span><span class='col-xs-6 col-md-3 col-sm-6 text-left'>&nbsp;" + pic.RecentBePublicDate + "</span>" +
                       "</div>"+
                   "</div>" +
                   "</div>" +
                   " </div>";
    return oneStr;
}

function showMore(num) {
    var newSize;
    if (num == -1) {
        newSize = pictures.length;
    }
    else {
        newSize = Math.min(pictures.length, size + num);
    }
    if (newSize > size) {
        size = newSize;
        addToDom();
    }
}
var pictures = [];
var size = 12;
var lastLoaded = 0;


function sortBy(e) {
    var flag = parseInt($(e).attr('data-flag'));
    $('#sortBy').children().removeClass('btn-primary');
    $(e).addClass('btn-primary');
    if(flag ==0){
        function compareAsc(a, b) {
            if (a.CaptureTime > b.CaptureTime) {
                return 1;
            }
            else if (a.CaptureTime < b.CaptureTime) {
                return -1;
            }
            else {
                return 0;
            }
        }
        pictures.sort(compareAsc);

    }
    else if (flag == 1) {
        function compareDesc(a, b) {
            if (a.CaptureTime > b.CaptureTime) {
                return -1;
            }
            else if (a.CaptureTime < b.CaptureTime) {
                return 1;
            }
            else {
                return 0;
            }
        }
        pictures.sort(compareDesc);
    }
    else if (flag === 2) {
        function compareRateDesc(a, b) {
            if ( parseFloat(a.Rate) > parseFloat(b.Rate)) {
                return -1;
            }
            else if (parseFloat(a.Rate) < parseFloat(b.Rate)) {
                return 1;
            }
            else {
                return 0;
            }
        }
        pictures.sort(compareRateDesc);
    }
    else if (flag === 3) {
        function compareRateAsc(a, b) {
            if (parseFloat(a.Rate) > parseFloat(b.Rate)) {
                return 1;
            }
            else if (parseFloat(a.Rate) < parseFloat(b.Rate)) {
                return -1;
            }
            else {
                return 0;
            }
        }
        pictures.sort(compareRateAsc);
    }
    lastLoaded = 0;
    size = 12;
    $('.gallery').html('');
    addToDom();
}


function openDetail(e) {
    $(e).parent().parent().parent().parent().attr('class', 'animated rubberBand onePic');
    $(e).parent().parent().parent().parent().addClass('col-xs-12');
    $(e).removeClass('glyphicon-chevron-down');
    $(e).addClass('glyphicon-chevron-up');
    $(e).attr('onclick', 'closeDetail(this)');
    $(e).parent().parent().next().show();
}

function closeDetail(e) {
    $(e).parent().parent().parent().parent().attr('class', 'animated fadeInUp');
    $(e).parent().parent().parent().parent().addClass('col-sm-4 col-xs-6 col-md-3 col-lg-3 onePic');
   
    $(e).removeClass('glyphicon-chevron-up');
    $(e).addClass('glyphicon-chevron-down');
    $(e).attr('onclick', 'openDetail(this)');

    $(e).parent().parent().next().hide();
}



function thumbUp(e) {
    var pictureId = $(e).attr('data-pictureId');
    $.ajax({
        method: 'get',
        data: {
            pictureId:pictureId
        },
        url: '/Gallery/ThumbUp'
    }).done(function (res) {
        if (res === "-1") {
            alert("You already voted.");
        } else {
            $(e).attr('class', 'text-danger');
            $(e).removeAttr('onclick');
            $($(e).children()[1]).text(res);

        }
    });
}

function showRateModal(e) {
    var pictureId = $(e).attr('data-pictureId');
    $('#rateBody').html(getRatingHtml());
    $('#ratingFieldSet').attr('data-pictureId', pictureId);
    $('#rateModal').modal();
}

function getRatingHtml() {
    var ret =     "         <fieldset class='rating' id='ratingFieldSet' data-pictureId=''> "+
                   "   <input type='radio' id='star5' name='rating' value='5' onclick='rate(this)' /><label class='full' for='star5' title='Awesome - 5 stars'></label> "+
                   "   <input type='radio' id='star4half' name='rating' value='4.5'  onclick='rate(this)'/><label class='half' for='star4half' title='Pretty good - 4.5 stars'></label> "+
                   "    <input type='radio' id='star4' name='rating' value='4'  onclick='rate(this)'/><label class='full' for='star4' title='Pretty good - 4 stars'></label> "+
                   "    <input type='radio' id='star3half' name='rating' value='3.5' onclick='rate(this)' /><label class='half' for='star3half' title='Meh - 3.5 stars'></label> "+
                   "     <input type='radio' id='star3' name='rating' value='3' onclick='rate(this)'/><label class='full' for='star3' title='Meh - 3 stars'></label> "+
                   "    <input type='radio' id='star2half' name='rating' value='2.5' onclick='rate(this)'/><label class='half' for='star2half' title='Kinda bad - 2.5 stars'></label> "+
                   "    <input type='radio' id='star2' name='rating' value='2' onclick='rate(this)'/><label class='full' for='star2' title='Kinda bad - 2 stars'></label> "+
                   "    <input type='radio' id='star1half' name='rating' value='1.5' onclick='rate(this)'/><label class='half' for='star1half' title='Meh - 1.5 stars'></label> "+
                   "     <input type='radio' id='star1' name='rating' value='1' onclick='rate(this)'/><label class='full' for='star1' title='Sucks big time - 1 star'></label> "+
                 "     <input type='radio' id='starhalf' name='rating' value='0.5' onclick='rate(this)'/><label class='half' for='starhalf' title='Sucks big time - 0.5 stars'></label> "+
                 "     </fieldset> " +
        "";
    return ret;
}

function rate(e) {
    var pictureId = $(e).parent().attr('data-pictureId');
    var rateVal = e.value;
    var token = $("#Token").val();
    $.ajax({
        method: 'get',
        data: {
            pictureId: pictureId,
            rate: rateVal,
            token:token
        },
        url: 'Gallery/Rate'
    }).done(function (res) {
        if (res === "-1") {
            $('#rateBody').html("<span class='text-danger'>Sorry, You already Rated!</span>");
        }
          else if (res === "-2") {
              $('#rateBody').html("<span class='text-danger'>Please tell me you are not a robot!(recaptcha verify)</span>");
        }
        else {
            $('#rateBody').html("<span class='text-success'>Thank you for your rating!</span>");
            var tmp = $('.rateSeg[data-pictureId="' + pictureId + '"]');
            tmp.attr('class', 'text-danger');
            tmp.removeAttr('onclick');
            $(tmp.children()[1]).text(res);
        }
    });
}

var downloadList = [];
var downloadSelectNum = 0;
function download(e) {
    $(e).attr('class', 'btn btn-sm  btn-raised btn-primary');
    $(e).attr('onclick', 'cancelDownload(this)');
    $(e).children().attr('class', 'glyphicon glyphicon-remove');
    $("#downloadOption").show();
    $(".onePic").each(function () {
        var pictureId = $(this).attr('data-pictureId');
        $(this).prepend('<label class="text-info cursor-pointer downloadSegment small"><input type="checkbox" class="downloadChecks" data-pictureId="' + pictureId + '"/> &nbsp;Select to Download</label>');
    });
    $(".downloadChecks").unbind('change');
    $(".downloadChecks").change(function() {
        var pictureId = $(this).attr('data-pictureId');
        if ($(this).is(":checked")) {
            downloadList.push(pictureId);
            $(this).parent().removeClass('text-info');
            $(this).parent().addClass('text-success');
        } else {
            var index = downloadList.indexOf(pictureId);
            if (index > -1) {
                downloadList.splice(index, 1);
                $(this).parent().removeClass('text-success');
                $(this).parent().addClass('text-info');
            }
        }
        detectDownload();
    });
}

function cancelDownload(e) {
    downloadList = [];
    detectDownload();
    $("#downloadOption").hide();
    $(e).attr('class', 'btn btn-sm btn-raised btn-default');
    $(e).children().attr('class', 'glyphicon glyphicon-save');
    $(e).attr('onclick', 'download(this)');
    $('.downloadSegment').remove();
}

function selectAll(e) {
    var flag = $(e).attr('data-flag');
    if (flag === "0") {
        downloadList = [];
        $(e).text('Undo');
        $(".downloadChecks").each(function () {
            var pictureId = $(this).attr('data-pictureId');
            $(this).parent().removeClass('text-info');
            $(this).parent().addClass('text-success');
            $(this).prop("checked", true);
            downloadList.push(pictureId);
        });
        $(e).attr('data-flag', "1");
    } else {
        $(e).text('All');
        $("input").prop("checked", false);
        downloadSelectNum = 0;
        downloadList = [];
        $(".downloadChecks").parent().removeClass('text-success');
        $(".downloadChecks").parent().addClass('text-info');
        $(e).attr('data-flag', "0");
    }
    detectDownload();
}

function detectDownload() {
    $('#downloadSelectNum').text(downloadList.length);
    if (downloadList.length > 0) {
        $('#downloadBtn').attr('onclick', '$("#downloadForm").submit()');
        $('#downloadBtn').removeClass('disabled');
        $('input[name="pictureStr"]').val(downloadList);


    } else {
        
        
        $('#downloadBtn').addClass('disabled');
        $('#downloadBtn').removeAttr('onclick');
    }
}


function showTopModal() {

    getDailyMostPopular();
    getWeeklyMostPopular();
    $('#topModal').modal();
}

function getDailyMostPopular() {
    getHotestByDays(1, $('#dailyHotestPic'));
}

function getWeeklyMostPopular() {
    getHotestByDays(7, $('#weeklyHotestPic'));
}

function getHotestByDays(days, e) {
    $.ajax({
        method: 'get',
        data: {
            days: days
        },
        url: 'Gallery/GetHottestPictureByDays'
    }).done(function (res) {
        if (res === "") {
            $(e).html("<span class='text-warning'>This place is still empty right now</span>");
        } else {
            var obj = JSON.parse(res);
            $(e).html(domForOnePic(obj));
            $(e).children().attr('class', 'col-xs-12');
            $(e).find('span.glyphicon-chevron-down').remove();
            initializeFancyBox($(e).children('.onePic'));
        }
       
    });
}