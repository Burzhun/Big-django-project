$(function() {
    var link_attr = {
        target:'_blank',
        rel: 'noopener'
    };
    $('section[class^="block-"] a[href^="/"][data-new-link!="1"]').attr(link_attr);
    $('section[class^="block-"] a[href^="http://"][data-new-link!="1"]').attr(link_attr);
    $('section[class^="block-"] a[href^="https://"][data-new-link!="1"]').attr(link_attr);
});