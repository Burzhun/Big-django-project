$(function () {
    $('body').on('click', "#search_btn", function () {
        console.log('click');
        $('#search_pane').slideToggle('fast');
        $(this).toggleClass('active');
        $('#head-search-suggest-target').focus();
        return false;
    });
    $('#search_close').on('click', function () {
        $('#search_btn').click();
        return false;
    });
});
