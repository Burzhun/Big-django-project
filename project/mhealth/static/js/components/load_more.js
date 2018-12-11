$('body').on('click', '.w__btn__loader', function () {
    $(this).addClass('w__btn__not__border');
    $(this).find('span').addClass('w__loader__hidden');
    $(this).find('img').removeClass('w__loader__hidden');
    var self = this;
    var data = {
        'ids': ids.toString()
    }
    var request = $.ajax({
        url: "/",
        type: "POST",
        data: data
    });

    request.done(function (responce) {
        $(self).parents('.w__loader').after(responce);
        $(self).hide();
        $('.float-block').each(function (i, item) {
            $(item).data('counter', i);

        })
    });
});