jQuery(function ($) {


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


        var bmr,
            tee,
            ttl,
            protein,
            fat,
            catbohudtat,
            k,
            n,
            select_mission = Number($('.w__calculator__select-mission').val()),
            select_actives = Number($('.w__calculator__select-actives').val()),
            age = $('.w__input-age').val(),
            growth = $('.w__input-growth').val(),
            weight = $('.w__input-weight').val();


        bmr = 66.5 + (13.75 * weight) + (5.003 * growth) - (6.755 * age);

console.log(select_mission);
        switch (select_mission) {
            case 1:
                n = 300;
                $('.w__calculator__result__text span').text('набора массы');
                break;
            case 2:
                n = 0;
                $('.w__calculator__result__text span').text('поддержания формы');
                break;
            case 3:
                n = -300;
                $('.w__calculator__result__text span').text('похудения');
                break;
            default:
                alert('Не выбрана цель');
        }
console.log(n);
        switch (select_actives) {
            case 1:
                k = 1.2;
                break;
            case 2:
                k = 1.375;
                break;
            case 3:
                k = 1.55;
                break;
            case 4:
                k = 1.725;
                break;
            case 5:
                k = 1.9;
                break;
            case 6:
                k = 2;
                break;
            default:
                alert('Не выбрана цель');
        }

        tee = bmr * k;
        ttl = tee + n;
        protein = weight * 2.2;
        fat = weight * 1;
        catbohudtat = (ttl - fat*9 - protein * 4) / 4;

        $('.w__calculator__calories .w__calculator__result__count span').text(ttl.toFixed(0));
        $('.w__calculator__proteins .w__calculator__result__count span').text(protein.toFixed(0));
        $('.w__calculator__fats .w__calculator__result__count span').text(fat.toFixed(0));
        $('.w__calculator__carbohydrates .w__calculator__result__count span').text(catbohudtat.toFixed(0));

        return false;
    });

})