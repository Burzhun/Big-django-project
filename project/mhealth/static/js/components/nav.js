$(window).on('load', function () {
    /** Fixed Navigation position */
        // fix sub nav on scroll
    var win = $(window);
    var nav = $('.subnav');

    var navTop = nav.length && (nav.offset().top);
    var isFixed = 0;

    // fix right adv banner block on scroll
    var block_float = $('#inc_block_float');

    var block_right = $('.slidesection');

    var float_block = $('.float-block', block_right);
    var fixed_block = $('.fixed-block', block_right);

    var float_block_top = block_right.length > 0 ? float_block.offset().top : 0;
    var fixed_block_top = fixed_block.length > 0 ? fixed_block.offset().top : 0;
    var fixed_block_height = fixed_block.length > 0 ? fixed_block.outerHeight(true) : 0;
    var block_main = float_block.parents('.container').children('.mainsection');


    var float_block_length = 1;
    var main = $('.main');
    var floatBlockIsFixed = false;

    function winResize() {
        navTop = main.offset().top + main.outerHeight();

        // Recalc Adv block fixes positions
        // float_block_top = block_right.length > 0 ? float_block.offset().top : 0;
        /**
         Get height for Advertise column
         Recalculate on window resize
         */

        /* сумма высот всех блоков внутри $block_right */
        var rightColumnChildrenHeight = block_right.children().outerHeight(true);

        if (block_float.width() == block_main.width()) {
            var fullHeight = block_main.parent().outerHeight(true);
        } else {
            var fullHeight = block_main.outerHeight(true);
        }
        // console.log(rightColumnChildrenHeight, fullHeight);
        fullHeight = Math.max(rightColumnChildrenHeight, fullHeight);
        block_right.height(fullHeight);
        block_main.parent().css('min-height', fullHeight + 'px');

        var i, scrollTop = win.scrollTop();

        /* скролл навигации */
        var rightScrollIsOff = true;
        if (rightScrollIsOff) {
            if (scrollTop >= navTop && !isFixed) {
                isFixed = 1;
                nav.addClass('subnav-fixed');
                $('.layout').css('margin-top', nav.height());

            } else if (scrollTop <= navTop && isFixed) {
                isFixed = 0;
                nav.removeClass('subnav-fixed');
                $('.layout').css('margin-top', '0px');
            }

            /** Advertise block moving */

            var advHeight = float_block.outerHeight(true);
            var contentBannerHeight = $('.in-content-banner').outerHeight(true);
            var advDelta = scrollTop + nav.height() * isFixed + 20 - float_block_top;
            var maxDelta = fullHeight - fixed_block_height;
            if (contentBannerHeight) {
                maxDelta -= contentBannerHeight;
            }
            if (advDelta > 0) {
                if (advDelta + advHeight > maxDelta) {
                    floatBlockIsFixed = false;
                    float_block.removeClass('fixed').addClass('fixbottom');
                } else {
                    floatBlockIsFixed = true;
                    float_block.removeClass('fixbottom').addClass('fixed');
                }
            } else {

                floatBlockIsFixed = false;
                float_block.removeClass('fixed').removeClass('fixbottom');

            }


            $('.float-block').each(function (i, item) {
                var tmpDelta = scrollTop + nav.height() * isFixed + 20;
                var tmpTop = $(item).offset().top;
                var tmpHeight = $(item).outerHeight(true);
                if (tmpDelta >= tmpTop && tmpDelta <= tmpTop + tmpHeight && $(item).data('counter') != float_block.data('counter')) {
                    float_block.removeClass('fixed');
                    float_block = $(item);

                    block_main = float_block.parents('.container').children('.mainsection');
                    fixed_block = float_block.parent().children('.fixed-block');
                    block_right = float_block.parents('.slidesection');

                    if (float_block.hasClass('fixbottom')) {
                        float_block.removeClass('fixbottom');
                        float_block_top = block_right.length > 0 ? float_block.offset().top : 0;
                        float_block.addClass('fixbottom');
                    } else {
                        float_block_top = block_right.length > 0 ? float_block.offset().top : 0;
                    }
                    fixed_block_height = fixed_block.length > 0 ? fixed_block.outerHeight(true) : 0;
                    float_block_length = $('.float-block').length;


                }
            });


        }

    }

    window.winResize = winResize;
    window.processScroll = winResize;

    // Основное меню - "прибиваем вверх" при скролле
    win.on('scroll', processScroll);
    win.on('resize', winResize);
    win.on('orientationchange', winResize);

});