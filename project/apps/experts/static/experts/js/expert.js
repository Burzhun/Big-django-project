var newurl;

$(function () {
    newurl = $('#next_page_url').val();

    $(':file').change(function () {
        var file = this.files[0];
        var name = file.name;
        var size = file.size;
        var type = file.type;
        //Your validation
        if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
            $('#file_name').val(name);
            $("#file").removeClass("has-error");
        } else {
            $('#file').addClass('has-error');
            $('#file_name').val('');
            $('#errors').html("Что-то пошло не так. Правильно заполните элементы формы.");
        }
    });

    $('#click_file_input').click(function () {
        $('#file_input_field').click();
    });


    $('#add_question_form_submit').click(function () {
        var formData = new FormData($('#add_question_form')[0]);
        var slug = $('#expert_slug').val();
        $.ajax(slug+'add_question/', {
            type: 'POST',
            data: formData,
            success: function (data) {
                var errors = "";
                $(".has-error").removeClass("has-error");
                $('.error-message').hide();
                if (data.error) {
                    $('.error-message').show();
                    $('#errors').html("Что-то пошло не так. Правильно заполните элементы формы.");
                }

                if (data.message) {
                    $(':input', '#add_question_form')
                            .not(':button, :submit, :reset, :hidden')
                            .val('')
                    $('#expert_question_modal').modal('toggle');

                }

            },
            //Options to tell jQuery not to process data or worry about content-type.
            cache: false,
            contentType: false,
            processData: false
        });
    });
});


function loadNextPage() {
    var target = $('.expert_questions_list:last');
    newurl = $('#more_questions').attr('href');
    console.log(newurl);
    $.ajax(newurl, {
        type: 'POST',
        success: function (data) {
            if (data == "") {
                return false;
            }
            var html = target.html();
            target.html(html + data);
            ReloadEmulator.changeUrl(newurl);
            newurl = newurl.replace('?page=(\d+)', function (a, b) {
                return '?page=' + (parseInt(b) + 1);
            });
            $('#more_questions').attr('href', newurl);
        },
        cache: false,
        contentType: false,
        processData: false
    });
}

function changeSection(url, name) {
    $('#section_item').html(name);
    $('#more_questions').attr('href', url + '?page=1');
    $('#next_page_url').val(url);
    $('.expert_questions_list').html("");
    loadNextPage();
    return false;
}


function changeExpert(id, slug, name) {
    $('#expert_slug').val(slug);
    $('.recipient').hide();
    $('#expert_form_icon_' + id).show();
    $('#section_item_form').html(name);
    return false;
}

function recaptchaCallback_expert(response){
    $("#add_question_form_submit").removeAttr('disabled');
}