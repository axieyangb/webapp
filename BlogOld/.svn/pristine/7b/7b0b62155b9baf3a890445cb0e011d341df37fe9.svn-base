$(document).ready(function () {
    $('.side-nav > #Profile >a').css("color", "#fff");
});
function submitForm() {
    $.ajax({
        type: "POST",
        url: $('#editForm').attr('action'),
        data: $("#editForm").serialize(), // serializes the form's elements.
        success: function (data) {
            if (data === 'True') {
                $('#resultBody')
                    .html('<p class="text-success"> You have successfully changed your profile !</p>');

            } else {
                $('#resultBody')
                    .html('<p class="text-danger">Inner Excepton happens !</p>');
            }
            $('#profileChangeModal').modal();
        }
    });
}

function selectFile(e) {
   
    var files = e.files;
    if (files.length > 0) {
        var file = files[0];
        var fileSize = (file.size / 1024 / 1024).toFixed(2) + " MB";
        var fileNameLen = file.name.length;
        var fileName = file.name;
        if (fileNameLen >20) {
            fileName = fileName.slice(0, 20) + "...";
        }
        
        if (file.type == "image/jpeg" || file.type == "image/png") {
            if (file.size / 1024 / 1024 >= 5) {
                $('#fileSelectedInfo').attr('class', 'alert alert-danger');
                $('#fileSelectedInfo').html('file size is too large: ' + fileSize);
                return;
            }
            $('#fileSelectedInfo').html("File Name :"+ fileName+" ("+file.type+") ");
            $('#fileSelectedInfo').attr('class','alert alert-success');
            $('#fileSelectedInfo')
                .append(
                    '<button class="btn btn-primary" id="uploadImgBtn" onclick="uploadImg()"> Upload</button>');

        } else {
            $('#fileSelectedInfo').attr('class', 'alert alert-danger');
            $('#fileSelectedInfo').html('Unsupport file type: ' +file.type);
        }
       
        $('#fileSelectedInfo').show();
           
    }
}

function uploadImg() {
    var ajax = new XMLHttpRequest();
    var formdata = new FormData();
    var file = $('#imageFile')[0].files[0];
    formdata.append(file.name,file);
    ajax.open("POST", "/DashBoard/ProfileImageUpload");
    ajax.addEventListener("load", completeHandler);
    ajax.send(formdata);
    $('#fileSelectedInfo').html('Uploading...');
}


function completeHandler(event) {
    var res = event.currentTarget.response;
    if (res != null) {
        $('#fileSelectedInfo').html('Upload Success');
        $('#profileImg').attr('src', res);
    }
}