$(function() {
   $('#drop_menu').on('show.bs.dropdown', function(e) {
        $(e.relatedTarget).addClass('active');
    }).on('hide.bs.dropdown', function(e) {
        $(e.relatedTarget).removeClass('active');
    });
});