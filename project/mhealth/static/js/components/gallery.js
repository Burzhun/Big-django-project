$(document).ready(function() {
    if (typeof galleriesNumber !== 'undefined') {
        galleriesNumber.forEach(function (item) {
            $(".slides-" + item).slick({
                asNavFor: '.slide-captions-' + item,
                infinite: false,
                speed: 200,
                arrows: false
            })

            $(".slide-captions-" + item).slick({
                asNavFor: '.slides-' + item,
                infinite: false,
                speed: 200,
                fade: true,
                appendArrows: $('.slide-pagination-' + item),
                prevArrow: '<div class="slide-pagination__button"><</div>',
                nextArrow: '<div class="slide-pagination__button">></div>'
            })
        });
    }
});