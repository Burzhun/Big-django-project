var processRatingClick = function (e) {
    e.preventDefault();
    e.stopPropagation();

    var starsParent = $(this).closest('.rating');
    var starsBlock = $('.b-stars, .s-stars', starsParent);
    var successBlock = $('.b-rating-success', starsParent);
    var failBlock = $('.b-rating-fail', starsParent);
    var starsFillBlock = $('.b-stars-fill, .s-stars-fill', starsParent);

    var emptyClick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    function lockRatingClicks() {
        $('.b-stars a:not(.login_btn_open_popup), .s-stars a:not(.login_btn_open_popup)', starsParent).unbind('click').bind('click', emptyClick);
    }

    function unlockRatingClicks() {
        $('.b-stars a:not(.login_btn_open_popup), .s-stars a:not(.login_btn_open_popup)', starsParent).unbind('click').bind('click', processRatingClick);
    }

    lockRatingClicks();

    $.getJSON('save_rating/', {
        id: $(this).data('object'),
        val: $(this).attr('rel'),
    }, function (data, textStatus, jqXHR) {
        function success() {
            starsBlock.slideToggle(200, function () {
                successBlock.slideToggle(200).delay(4000).slideToggle(200, function () {
                    starsBlock.slideToggle(200);
                });
            });
        }

        function fail(text) {
            starsBlock.slideToggle(200, function () {
                failBlock.html(text).slideToggle(200).delay(4000).slideToggle(200, function () {
                    starsBlock.slideToggle(200);
                });
            });
        }

        if (data.error) {
            fail(data.error);
            unlockRatingClicks();

            return;
        }

        if (data.id && data.rating) {
            starsFillBlock.css({
                'width': data.rating + '%'
            });

            success();
        }

        unlockRatingClicks();
    });

    return false;
};

$(document).delegate('.rating .b-stars a:not(.login_btn_open_popup), .rating .s-stars a:not(.login_btn_open_popup)', 'click', processRatingClick);