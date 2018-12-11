$(document).ready(function () {
    var article = $('article');

    if (article.length != 0) {
        $.post({
            url: 'comments/'
        }).done(function (r) {
            $('.layout').append(r);
            bindCommentActions();
        });
    }
});

function bindCommentActions() {
    /* форма ответа, скачущая по дереву комментариев */
    var getCommentsBlock = function ($element) {
        return $element.closest('.comments');
    };

    var getReplyFormContainer = function ($element) {
        return $('.reply-form-container', getCommentsBlock($element));
    };

    var getReplyForm = function ($element) {
        return $('.b-cmtForm', getCommentsBlock($element));
    };

    /* клик на "Ответить" - форму кидаем к комментарию, на который отвечаем */
    var replyLinkClick = function (e) {
        e.stopPropagation();
        e.preventDefault();

        var clickedItem = $(this);
        var replyFormContainer = getReplyFormContainer(clickedItem);
        var replyForm = getReplyForm(clickedItem);

        replyFormContainer.hide();

        var comment = $(this).closest('.holder');

        replyForm.addClass('reply').find('input[type="submit"]').val('Ответить');
        replyForm.find('input[name="parent"]').attr('value', comment.attr('id').substring(1));

        comment.after(replyForm);

        return false;
    };

    $(document).delegate('.comments a.reply', 'click', replyLinkClick);
    $(document).delegate('.comments a.m-reply', 'click', replyLinkClick);

    /* клик на Отмена - возврат формы на место */
    var placeCommentsFormBack = function (e) {
        e.stopPropagation();
        e.preventDefault();

        var clickedItem = $(this);
        var replyFormContainer = getReplyFormContainer(clickedItem);
        var replyForm = getReplyForm(clickedItem);

        replyForm.removeClass('reply').find('input[type="submit"]').val('Комментировать');
        replyForm.find('input[name="parent"]').attr('value', 0);

        replyFormContainer.show().append(replyForm);

        return false;
    };

    $(document).delegate('.comments a.link-cancel', 'click', placeCommentsFormBack);

    var placeCommunityCommentsFormBack = function (e) {
        e.stopPropagation();
        e.preventDefault();

        var clickedItem = $(this);
        var replyFormContainer = getReplyFormContainer(clickedItem);
        var replyForm = getReplyForm(clickedItem);

        replyForm.find('input[name="parent"]').attr('value', 0);

        replyFormContainer.show().append(replyForm);

        return false;
    };

    $(document).delegate('.comments a.link-cancel-community', 'click', placeCommunityCommentsFormBack);


    /* действия на отправку комментария */
    var commentFormSubmit = function (e) {
        var thatForm = $(this);

        var stopFormSubmit = false;

        thatForm.find('input[type="submit"]').val('Отправляется...').attr('disabled', 'disabled');

        var vkPublishFlag = thatForm.find('.VKontakte_publish');
        if (vkPublishFlag.prop('checked') === true) {
            /* get text */
            var textarea = thatForm.find('textarea[name="comment"]');
            if (textarea.length > 0) {
                var comment = textarea.val().trim();
                if (comment.length > 0) {
                    /* glue to template if available */
                    var templateEl = thatForm.find('.wall_publish_notify');
                    if (templateEl.length > 0) {
                        var template = templateEl.val();
                        comment = template.replace('#TEXT#', comment);
                    }

                    /* get relative url */
                    var url = '';
                    var urlEl = thatForm.find('.wall_publish_url');
                    if (urlEl.length > 0) {
                        url = urlEl.val();
                    }

                    /* send to wall */
                    if (typeof window['initVK'] == 'function') {
                        /* stop form submit while VK initialization and user interactions */
                        e.stopPropagation();
                        e.preventDefault();
                        stopFormSubmit = true;

                        /* this calls async VK initialization, so we submit form from callback */
                        initVK(function () {
                            VK.Api.call('wall.post',
                                {
                                    message: comment,
                                    attachments: 'http://www.mhealth.ru' + url + '?utm_source=VKontakte&utm_medium=Social&utm_campaign=ShareComment'
                                },
                                function (r) {
                                    $(document).undelegate('.comments .b-cmtForm form', 'submit');
                                    thatForm.submit();
                                    $(document).delegate('.comments .b-cmtForm form', 'submit', commentFormSubmit);
                                }
                            );
                        });
                    }
                }
            }
        }
        else {
            $(document).undelegate('.comments .b-cmtForm form', 'submit');
            thatForm.submit();
            $(document).delegate('.comments .b-cmtForm form', 'submit', commentFormSubmit);
        }

        if (stopFormSubmit) {
            e.preventDefault();
            e.stopPropagation();
        }
        return !stopFormSubmit;
    };

    $(document).delegate('.comments .b-cmtForm form', 'submit', commentFormSubmit);

    /* скролл к комментарию по якорю в урле */
    $(document).ready(function () {
        var match = window.location.hash.match(/#comment_(\d+)/);
        if (match) {
            /* надо найти элемент с таким id и при необходимости его показать */
            scrollToComment(match[1]);
        }
        if (window.location.hash == '#disallow-comment') {
            var form = $('.reply-form-container');
            $.scrollTo(form, 1000, {offset: -60});
            form.find('.errortext').html('Твой комментарий не соответствует правилам ресурса и был заблокирован.');
        }
    });

    function scrollToComment(commentId) {
        var commentToScroll = $('#c' + commentId);
        if (commentToScroll.length > 0) {

            document.getElementById("c" + commentId).scrollIntoView();
        }
    }

    /* нажатие на кнопку "Показать еще" */
    var showAllComments = function (e) {
        e.stopPropagation();
        e.preventDefault();

        var commentsContainer = $(this).parents('.comments').find('.b-comments');
        if (commentsContainer.length > 0) {
            /* саму кнопку убираем, она больше не нужна */
            $(this).closest('.show_more').remove();
            /* первый уровень показываем */
            $('.b-cmtItem-0:not(visible)').show(400, function () {
                if (typeof updateInfScrollItems == 'function') {
                    updateInfScrollItems();
                }
            });
        }

        return false;
    };
    $(document).delegate('.comments .show_more a', 'click', showAllComments);

    /* нажатие на кнопку "Еще N" */
    function expandCommentsBranch(parentComment) {
        $('.b-cmtItem:not(visible)', parentComment).show(400, function () {
            if (typeof updateInfScrollItems == 'function') {
                updateInfScrollItems();
            }
        });

        /* контрол меняем */
        $('a.down', parentComment)
            .hide()
            .parent()
            .find('a.up')
            .show();
    }

    $(document).delegate('.comments .b-comments a.down', 'click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        /* показываем все что скрыто */
        expandCommentsBranch($(this).closest('.b-cmtItem'));

        return false;
    });

    /* нажатие на кнопку "Скрыть" */
    function collapseCommentsBranch(parentComment) {
        $('.b-cmtItem:visible', parentComment).hide(400, function () {
            if (typeof updateInfScrollItems == 'function') {
                updateInfScrollItems();
            }
        });

        /* контрол меняем */
        $('a.up', parentComment)
            .hide()
            .parent()
            .find('a.down')
            .show();
    }

    $(document).delegate('.comments .b-comments a.up', 'click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        /* скрываем дочерние комменты */
        collapseCommentsBranch($(this).closest('.b-cmtItem'));

        return false;
    });

    var openCommentsSection = function () {
        $(this).parents('.container:first').siblings('.comments_wrapper').slideToggle(400, function () {
            if (typeof updateInfScrollItems == 'function') {
                updateInfScrollItems();
            }
        });
        $(this).toggleClass('opened');

        return false;
    };

    $(document).delegate('.comments_header .open_comments', 'click', openCommentsSection);

    /* скролл к блоку комментариев */
    $(document).delegate('.text-lead > .comment_tip', 'click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        var parentBlock = $(this).parents('.page:first');
        $.scrollTo($('.comments', parentBlock),
            1000,
            {
                offset: -100,
                onAfter: function () {
                    var expandCommentsElement = $('.comments_header .open_comments', parentBlock);
                    if (!expandCommentsElement.hasClass('opened')) {
                        expandCommentsElement.click();
                    }
                }
            }
        );

        return false;
    });


}

var deleteComment = function (id) {
    if (confirm('Удалить комментарий?')) {
        var request = $.ajax({
            url: "delete_comment/",
            method: "POST",
            data: {comment_id: id},
        });

        request.fail(function () {
            alert('Ошибка');
        });

        request.done(function () {
            $('#c' + id).parent().remove();
            return false;
        });

    }

}

