var expireTime;
$.material.init();
jQuery(document).ready(function ($) {
    $('[data-toggle="tooltip"]').tooltip({ 'placement': 'bottom' });
    if ($("#isLogged").val() === "true") {
        expireTime = new Date(new Date().getTime() + 60000 * 30);
        $("#sessionExpireTime").show();
        var timeUpdate = setInterval(function () {
            var timeOffset = expireTime - new Date();
            var mins = parseInt(timeOffset / 1000 / 60);
            var sec = (parseInt(timeOffset / 1000)) % 60;
            if (mins <= 0 && sec <= 0) {
                $("#sessionExpireTime >a>span").html("Expired");
                clearInterval(timeUpdate);
            }
            else if (mins === 3 && sec === 0) {
                alert("Session Will be Expired in 3 Minutes !");
            }
            $("#sessionExpireTime >a>span").html(mins + " : " + sec);
        }, 1000);
        $(document).ajaxComplete(function () {
            expireTime = new Date(new Date().getTime() + 60000 * 30);
        });
    } else {
        $("#sessionExpireTime").hide();
    }
});



//
//    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" target="_blank" id="donateForm">
//<input type="hidden" name="cmd" value="_s-xclick">
//<input type="hidden" name="hosted_button_id" value="M93NWBD34T852">
//</form>
//
function submitDonateForm() {
  
    var form = $("<form action=\"https://www.paypal.com/cgi-bin/webscr\" method=\"post\" target=\"_top\" target=\"_blank\"></form>");
    form.append($("<input>", {type:"hidden",name:"cmd",value:"_s-xclick"}));
    form.append($("<input>", { type: "hidden", name: "hosted_button_id", value: "M93NWBD34T852" }));
    $(document.body).append(form);
    form.submit();
    $(document.body).remove(form);
}


window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());

gtag('config', 'UA-108379315-1');
