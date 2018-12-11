function showMoreArticle(element) {
    var thatButton = $(this);
    thatButton.addClass('loading');
    $.ajax({
        type: "POST",
        url: thatButton.data('url'),
    }).done(function (data, textStatus, jqXHR) {
        thatButton.parent().append(data);
        thatButton.removeClass('loading');
        thatButton.remove();
    });

    return false;
}
$(document).delegate('#show_more_btn', 'click', showMoreArticle);

