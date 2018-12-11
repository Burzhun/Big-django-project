
$('#show_more_answer_btn').click(function () {
    var page = parseInt($(this).data('page'));
    var request = $.ajax({
        url: '',
        method: "POST",
        data: {page: ++page}
    }).done(function (data) {
        if ($(data).length < 5) {
            $('#show_more_answer_btn').remove();
        }
        $('.expert_question_block').find('ul').append(data);

    }).fail(function () {

    });
    $(this).data('page', page);
});


$(function () {
    $('#go-ask').click(function () {
        document.getElementsByClassName('expert_ask_form')[0].scrollIntoView();
        return false;
    });
    if (window.location.hash == '#form') {
        document.getElementsByClassName('expert_ask_form')[0].scrollIntoView();
    }
});