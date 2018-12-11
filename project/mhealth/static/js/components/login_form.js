var showLoginForm = function (e) {
    e.stopPropagation();
    e.preventDefault();

    if (typeof window['initFB'] == 'function') {
        initFB();
    }
    if (typeof window['initVK'] == 'function') {
        initVK();
    }
    if (typeof window['initTW'] == 'function') {
        initTW();
    }
    $.colorbox({
        href:    "#login_box",
        inline:  true,
        close:   "&times;",
        fadeOut: 200
    });
    return false;
};


$(document).delegate('.login_btn_open_popup', 'click', showLoginForm);
