$(function () {
    function setCookie(name, value, options) {
        options = options || {};

        var expires = options.expires;

        if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    }

    $('.box_form__poll').each(function (index, item) {
        let form = $(item).find('.form__poll');
        let resultElement = form.parent().find('.result__polls');
        let pollSequenceNumber = form.data('sequence_number');
        let cookie_name = getPollCookieName(pollSequenceNumber);
        let question = getCookie(cookie_name);
        let url = form.attr('action');
        if (question != null) {
            $.ajax({
                method: 'POST',
                url: url,
                data: {'sequence_number': pollSequenceNumber}
            }).done(function (r) {
                updateResults(resultElement, r, question);
                $(item).show();
                form.fadeOut(300, 'swing', function () {
                    resultElement.fadeIn(200);
                });
            });
        } else {
            $(item).show();
            $(form).show();
        }
    });


    $('.form__poll input').on('click', function () {
        let form = $(this).closest('.form__poll');
        let questionID = $(this).data('question_id');
        let pollSequenceNumber = form.data('sequence_number');
        let resultElement = form.parent().find('.result__polls');
        let url = $(this).closest('.form__poll').attr('action');
        $.ajax({
            method: 'POST',
            url: url,
            data: {'question_id': questionID, 'sequence_number': pollSequenceNumber}
        }).done(function (r) {
            updateResults(resultElement, r, questionID);
            setCookie(getPollCookieName(pollSequenceNumber), questionID);
            form.fadeOut(300, 'swing', function () {
                resultElement.fadeIn(200);
            });
        });
    });

    function getPollCookieName(pollSequenceNumber) {
        return 'poll_' + pollSequenceNumber + '_' + location.pathname.split('/').join('_')
    }

    function updateResults(resultElement, result, selectedQuestion = null) {
        let question_1 = Math.round(result['question_1'].counter * 100 / result['all_counter']);
        let question_2 = 100 - question_1;
        if (selectedQuestion) {
            resultElement.find('.' + selectedQuestion).addClass('scale__result-select');
        }
        resultElement.find('.question_1').find('.scale__result_linear').css('width', question_1 + '%');
        resultElement.find('.question_1').find('.scale__result_number').text(question_1 + '%');
        resultElement.find('.question_2').find('.scale__result_linear').css('width', question_2 + '%');
        resultElement.find('.question_2').find('.scale__result_number').text(question_2 + '%');
    }
});