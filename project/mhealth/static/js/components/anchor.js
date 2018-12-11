$(document).ready(function () {
    var queryParameters = {}, queryString = location.search.substring(1),
        re = /([^&=]+)=([^&]*)/g, m;

    while (m = re.exec(queryString)) {
        queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    var currentPage = window.location.pathname;
    var urlPaths = currentPage.split('/');

    var currentSlide = 0;
    if (urlPaths.indexOf('slide') != -1) {
        currentSlide = parseInt(urlPaths[urlPaths.length - 2]);
        currentPage = urlPaths.slice(0, urlPaths.indexOf('slide')).join('/');
    } else if (urlPaths.length < 4) {

        if (queryParameters['page'] != undefined) {
            currentSlide = parseInt(queryParameters['page']);
            currentPage = urlPaths.join('/');
        }

    }

    $('.slide-anchor').each(function (i, element) {
        if (i === currentSlide && i != 0) {
            var scrollTo = $(element).offset().top;
            window.scrollTo(0, scrollTo+20);
        }
        if (i === 0) {
            $(element).attr('href', '');
        }
        else {
            if (urlPaths.length < 4) {
                var newHref = queryParameters;
                newHref['page'] = i;
                $(element).attr('href', '?' + $.param(newHref));
            } else {
                $(element).attr('href', 'slide/' + i.toString() + '/');
            }
        }
    });
    $(document).scroll(function () {
        var anchorElement = {
            distance: -1,
            slide: '',
        };
        $('.slide-anchor').each(function (i, e) {
            var top = window.pageYOffset;

            var distance = top - $(e).offset().top;
            var href = $(e).attr('href');
            if (currentPage[currentPage.length - 1] != '/' && href[href.length - 1] != '/' && urlPaths.length >= 4) {
                currentPage += '/';
            }
            var slide = currentPage + href;
            if (urlPaths.length >= 4){
                slide += window.location.search;
            }
            if (distance > 0 && (anchorElement.distance === -1 || anchorElement.distance > distance)) {//distance < 50 && distance > -50 && currentSlide != slide) {
                anchorElement.slide = slide;
                anchorElement.distance = distance;
            }
        });
        if (anchorElement.distance > 0 && currentSlide != anchorElement.slide) {
            ReloadEmulator.changeUrl(anchorElement.slide, true);
            currentSlide = anchorElement.slide;
        }
    });
});