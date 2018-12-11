
jQuery(function ($) {
    (function() {
        /**
         * Корректировка округления десятичных дробей.
         *
         * @param {String}  type  Тип корректировки.
         * @param {Number}  value Число.
         * @param {Integer} exp   Показатель степени (десятичный логарифм основания корректировки).
         * @returns {Number} Скорректированное значение.
         */
        function decimalAdjust(type, value, exp) {
            // Если степень не определена, либо равна нулю...
            if (typeof exp === 'undefined' || +exp === 0) {
                return Math[type](value);
            }
            value = +value;
            exp = +exp;
            // Если значение не является числом, либо степень не является целым числом...
            if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
                return NaN;
            }
            // Сдвиг разрядов
            value = value.toString().split('e');
            value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
            // Обратный сдвиг
            value = value.toString().split('e');
            return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
        }

        // Десятичное округление к ближайшему
        if (!Math.round10) {
            Math.round10 = function(value, exp) {
                return decimalAdjust('round', value, exp);
            };
        }
        // Десятичное округление вниз
        if (!Math.floor10) {
            Math.floor10 = function(value, exp) {
                return decimalAdjust('floor', value, exp);
            };
        }
        // Десятичное округление вверх
        if (!Math.ceil10) {
            Math.ceil10 = function(value, exp) {
                return decimalAdjust('ceil', value, exp);
            };
        }
    })();

if( $(window).width() < 680){
    $(document).mouseup(function (e) {

            var div = $(".w__calculator__socials ");
            if (!div.is(e.target)
                && div.has(e.target).length === 0) {
                div.fadeOut(300);



        }
    });

}
//цепляем событие на onclick кнопки
    var button = document.getElementById('button1');
    button.addEventListener('click', function () {
        //нашли наш контейнер
        var ta = document.getElementById('texx');
        //производим его выделение
        var range = document.createRange();
        range.selectNode(ta);
        window.getSelection().addRange(range);

        //пытаемся скопировать текст в буфер обмена
        try {
            document.execCommand('copy');

           $(this).text('Скопировано!');
        } catch(err) {
            console.log('Can`t copy, boss');
        }
        //очистим выделение текста, чтобы пользователь "не парился"
        window.getSelection().removeAllRanges();
    });



    $('.w__calculator__iframe').on('click',function () {

        $('.w__calculator__iframe__wrapp').fadeIn(300).css('display','flex');
    });

    $('.w__calculator__iframe__close').on('click',function () {

        $('.w__calculator__iframe__wrapp').fadeOut(300).css('display','flex');
    });
    $('.share_mobile').on('click',function () {

        $('.w__calculator__socials').fadeIn(300).css('display','flex');
    });


$('.w__calculator__restart').on('click',function () {
    $('form.w__calculator__form').removeClass('hidden');
    $('.w__calculator__result__wrapper').addClass('hidden')
    $('.w__calculator__abstract  ').addClass('hidden');
    $('.w__calculator__restart  ').addClass('hidden');
});
    $("form.w__calculator__form").submit(function (event) {

        $('.w__calculator__result__wrapper ').removeClass('hidden');
        $('.w__calculator__abstract  ').removeClass('hidden');


            $('form.w__calculator__form').addClass('hidden')
            $('.w__calculator__restart  ').removeClass('hidden');


        var rm,
            weight = Number($('.w__input-weight').val()),
            repetition = Number($('.w__input-repetition').val());


        rm = weight + ((weight*repetition)/30);
        $('.w__calculator__calories .w__calculator__result__count span').text(Math.round10(rm, -1));

        return false;
    });

})