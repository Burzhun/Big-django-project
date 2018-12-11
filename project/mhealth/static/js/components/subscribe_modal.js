$('.textPopupnewsletterr').on('click',function () {
    $('.popupnewsletter').fadeIn(1);
});
$('.popupnewsletter #widget-collection-close-temporary').on('click',function () {
    $('.popupnewsletter').fadeOut(1);
});
function sendEmail(form) {
    var email = $('#popupnewsletter').find("input[name=email]")[0].value
      ,project_id = $(form).find("input[name=project_id]")[0].value
      ,block_id = $(form).find("input[name=block_id]")[0].value
      ,$divSubscribeModalClose = $(".widget-collection-control").find(".widget-collection-close-temporary");

    if (s_v(email)) {
      $('.popupnewsletter').find(".text-danger").fadeOut(1);
      $(form).hide();
      $('.popupnewsletter').find(".text-success").show();
      $.post("/subscribe/", {
        email: email,
        project_id: project_id,
        block_id: block_id
      }).done(function(data) {})
    } else {
      $('.popupnewsletter').find(".text-danger").show()
    }
    function s_v(e) {
        var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(e)
    }

}
$('#popupnewsletter').on('submit', function () {
    sendEmail(this);
    return false;
});

$(document).mouseup(function (e) {
    var div = $("#widget-collection-popup");
    if (!div.is(e.target) && div.has(e.target).length === 0) {
        $('.popupnewsletter').fadeOut(1);
    }
});
