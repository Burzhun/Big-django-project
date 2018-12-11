var getUserInfo = function () {
    var request = $.ajax({
        url: "/accounts/base/",
        method: "GET",
    }).done(function (data) {

        if (data.error == true) {
            return false;
        }
        $('#login_btn').attr('href', data.url).removeClass('login_btn_open_popup');


    }).fail(function () {

    });

};

$(document).ready(function () {
    getUserInfo();
    $('.datepicker').datepicker({
        format: 'dd.mm.yyyy',
    });
})

$(function() {
    var user_bar =  $('#user_bar');
    if (!!user_bar.data('page') == false )
        return false;

    var url = "/accounts/user_bar/"+user_bar.data('page')+'/';
    if (!!user_bar.data('revision') && user_bar.data('revision').length>0) {
        url += '?revision_id='+user_bar.data('revision');
    }
    var request = $.ajax({
      url: url,
      method: "GET",
    }).done(function(data) {
        if (data.replace('\n', '').length==0){
            return false;
        }
        data = data.replace('<script src="/static/wagtailadmin/js/userbar.js"></script>', '');
        $('body').append($(data));

        var userbar = document.querySelector('[data-wagtail-userbar]');
        var trigger = userbar.querySelector('[data-wagtail-userbar-trigger]');
        var list = userbar.querySelector('.wagtail-userbar-items');
        var className = 'is-active';
        var hasTouch = 'ontouchstart' in window;
        var clickEvent = 'click';

        if (hasTouch) {
            userbar.classList.add('touch');

            // Bind to touchend event, preventDefault to prevent DELAY and CLICK
            // in accordance with: https://hacks.mozilla.org/2013/04/detecting-touch-its-the-why-not-the-how/
            trigger.addEventListener('touchend', function preventSimulatedClick(e) {
                e.preventDefault();
                toggleUserbar(e);
            });

        } else {
            userbar.classList.add('no-touch');
        }

        trigger.addEventListener(clickEvent, toggleUserbar, false);

        // make sure userbar is hidden when navigating back
        window.addEventListener('pageshow', hideUserbar, false);

        function showUserbar(e) {
            userbar.classList.add(className);
            list.addEventListener(clickEvent, sandboxClick, false);
            window.addEventListener(clickEvent, clickOutside, false);
        }

        function hideUserbar(e) {
            userbar.classList.remove(className);
            list.addEventListener(clickEvent, sandboxClick, false);
            window.removeEventListener(clickEvent, clickOutside, false);
        }

        function toggleUserbar(e) {
            e.stopPropagation();
            if (userbar.classList.contains(className)) {
                hideUserbar();
            } else {
                showUserbar();
            }
        }

        function sandboxClick(e) {
            e.stopPropagation();
        }

        function clickOutside(e) {
            hideUserbar();
        }
    });

});

// код для обновления аватара через ajax
$(document).ready(function () {
    $('#avatar_edit_link').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        $('#avatar_edit_input').click();
    });
    $('#avatar_edit_input').change(function (e) {
        files = e.target.files;
        if (files.length == 0)
            return;
        var data = new FormData();
        $.each(files, function (key, value) {
            if (value.size > 1048576) {
                $.colorbox({
                    html: "<h2>Слишком большой файл</h2><p>Размер изображения не должен превышать 1Мб.</p>",
                    close: "x"
                });
                return;
            }
            data.append('avatar', value);
        });
        $.ajax({
            url: '/accounts/avatar_update/',
            type: 'POST',
            data: data,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.status !== 'ok')
                    return;
                var image = $('#user-avatar-img');
                image.fadeOut('fast', function () {
                    image.attr('src', data.url);
                    image.fadeIn('fast');
                });
            }
        });
    });
});
