// выбранный элемент. Нужен будет, когда произойдет клик на кнопку "Показать"
var selectedTagHref = null;
var selectedGroupHref = null;
$('.search-select__button').prop("disabled", true);

function changeGroupFilter(el) {
    // Нужно скрыть все показанные выпадающие списки
    // и открыть соответствующий ID выбранного элемента
    el = $(el);
    let groupID = el.data('value');
    $('.custom-select-wrapper.tag').hide();
    $('.custom-select-wrapper.tag[data-value=' + groupID + ']').show();

    // Изменить заголовок на тот, что выбрали
    el.closest('.search-select__select').find('.custom-select-trigger').html(el.html());
    el.siblings().removeClass('selection');
    el.addClass('selection');
    selectedGroupHref = el.data('href');
}

function changeTagFilter(el) {
    // Изменить заголовок тега в селекте и средиректить
    el = $(el);
    el.closest('.search-select__select').find('.custom-select-trigger').html(el.html());
    el.siblings().removeClass('selection');
    el.addClass('selection');
    selectedTagHref = el.data('href');
}

$(".custom-select-trigger").on("click", function (event) {
    $('html').one('click', function () {
        $(".custom-select").removeClass("opened");
    });
    $(this).parents(".custom-select").toggleClass("opened");
    event.stopPropagation();
});

$('.custom-select-wrapper.group .custom-option').click(function () {
    // Изменилась группа тегов
    changeGroupFilter(this);
    $('.search-select__button').removeClass('disabled');
    $('.search-select__button').prop("disabled", false);
});
$('.custom-select-wrapper.tag .custom-option').click(function () {
    // Изменился тег
    changeTagFilter(this);
    $('.search-select__button').removeClass('disabled');
    $('.search-select__button').prop("disabled", false);
});

$('.search-select__button').click(function () {
    if (selectedTagHref != null) {
        window.location.href = selectedTagHref;
    } else if (selectedGroupHref != null) {
        window.location.href = selectedGroupHref;
    }
});