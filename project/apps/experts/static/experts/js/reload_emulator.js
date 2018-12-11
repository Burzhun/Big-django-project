// reload_emulator.js
/*
 Основной метод ReloadEmulator.changeUrl(<url>);
 меняет урл страницы без перезагрузки, при этом передёргиваются баннеры и счётчики

 конфиг для текущего сайта прописан в конце этого файла
 */

var ReloadEmulator = {
    mutex: null,
    timeout: null,
    tns_prefix: null,
    init: function (config)
    {
        this.timeout = config.timeout ? config.timeout : 1000;
        this.tns_prefix = config.tns_prefix ? config.tns_prefix : 'none';
        this.mutex = 0;
        return this;
    },
    adriverReloadBanner: function (bannerKey)
    {
        var banner = adriver.items[bannerKey];
        if (!banner)
            return;
        var $div = $(banner.p);
        $div.css('width', $div.width());
        $div.css('height', $div.height());
        $div.empty();
        banner.reload();
    },
    adriverReload: function (that)
    {
        if (!adriver)
            return;
        for (var bannerKey in adriver.items) {
            that.adriverReloadBanner(bannerKey);
        }
        that.mutex = 0;
    },
    liReload: function (prev_full_url, new_full_url)
    {
        // ищем уже имеющийся пиксель на странице
        // подменяем нужные параметры в нём
        var img = $('img[src*="//counter.yadro.ru"]');
        if (!img)
            return;
        var src = img.attr('src');
        src = src.replace(/;r[^;]*/, ';r' + escape(prev_full_url));
        src = src.replace(/;u[^;]*/, ';u' + escape(new_full_url));
        src = src.replace(/;[^;]*$/, ';' + Math.random());
        img.attr('src', src);
    },
    tnsReload: function ()
    {
        new Image().src = 'http://www.tns-counter.ru/V13a***R>' +
                document.referrer.replace(/\*/g, '%2a') + '*imedia_ru/ru/UTF-8/tmsec=' + this.tns_prefix + '_total/' +
                Math.round(Math.random() * 1000000000);
    },
    googleReload: function ()
    {
        if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname +
                    (window.location.port ? ':' + window.location.port : '');
        }
        if ((typeof ga !== 'undefined') && (typeof reloadEmulatorGaAjaxNextPage === 'undefined')) {
            ga('send', 'pageview', window.location.pathname + window.location.search);
            ga('send', 'event', 'AjaxNextPage', 'List', window.location.pathname + window.location.search);
            // console.log('work standart');
        } else if (typeof reloadEmulatorGaAjaxNextPage !== 'undefined') {
            reloadEmulatorGaAjaxNextPage();
        }
    },
    metrikaReload: function(url)
    {
        //yaCounter31537308.hit(url);
    },
    ajaxPageReload: function (prev, current)
    {
        var _this = this;
        // на грации не нужно проверять mutex, т.к. баннеры не перезагружаются
        //if ( !this.mutex ) {
        this.mutex = 1;
        // на грации не нужно
        //setTimeout( function(){ _this.adriverReload(_this) }, this.timeout );
        //setTimeout( function(){ _this.adriverReloadBanner('banner7'); _this.mutex=0 }, this.timeout );
        this.liReload(prev, current);
        this.tnsReload();
        this.googleReload();
        this.metrikaReload(current);
        //}
    },
    changeUrl: function (url, pokeCounters)
    {
        if (!url)
            return;
        if (history !== undefined) {
            var prev = document.URL;
            history.pushState({}, '', url);
            var current = document.URL;
            if (pokeCounters) {
                this.ajaxPageReload(prev, current);
            }
        }
    }
};

$(document).ready(function () {
    var config = {timeout: 1000, tns_prefix: 'whrussia'};
    ReloadEmulator.init(config);
});
