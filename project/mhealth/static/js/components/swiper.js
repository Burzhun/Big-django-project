$(function () {
    $('#top_news_swipper').swiper({
        mode: 'horizontal',
        loop: false,
        slidesPerView: 'auto'
    });
    $('#promotion_slider').swiper({
        mode: 'horizontal',
        loop: false,
        slidesPerView: 'auto'
    });
    $('.main_announce_list.swiper-container').each(function() {
        $(this).swiper({
            mode: 'horizontal',
            loop: false,
            slidesPerView: 'auto'
        });
    });
})