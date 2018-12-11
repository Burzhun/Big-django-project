if (typeof rubricEvents == 'undefined') {
    var articleRubricEvents = [];
}
function updateRubricEvents() {
    $('#id_rubric').on('change', function () {
        self = this;
        let span = $(this).siblings('span');
        span.addClass('pending');
        setTimeout(function () {
            articleRubricEvents.forEach(function (f) {
                f(self);
            });
            span.removeClass('pending');
        }, 800);
    });
}
function addArticleRubricEvent(event) {
    articleRubricEvents.push(event);
    updateRubricEvents();
}

