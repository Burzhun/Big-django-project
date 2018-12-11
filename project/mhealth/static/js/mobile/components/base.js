$(document).ready(function () {
    $("body>[data-role='panel']").panel();
    $.extend($.mobile, {
        hashListeningEnabled: false,
        pushStateEnabled: false,
        ajaxEnabled: false,
        linkBindingEnabled: false
    });
    $.mobile.ajaxEnabled = false;
    $(".mobile-search_btn").click(function () {
        $(this).toggleClass("mobile-search_active");
        $("#header").toggleClass("header-mb");
        $(".mobile-search").toggleClass("mobile-search-show");
    });
});

$(function () {
    $('#experts_slider').swiper({
        pagination: '#experts_slider_pagination',
        paginationClickable: true
    });
    $('#promotion_slider').swiper({
        pagination: '#promotion_slider_pagination',
        paginationClickable: true
    });

})
$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
});