function moreIssues() {
    var showMoreBlock = $(this).parent();
    var year = $(this).data('year');
    showMoreBlock.addClass('loading').load(
        '',
        {'year': year},
        function () {
            showMoreBlock.removeClass('loading show_more');
        }
    )
    return false;
}
$(document).delegate('#show_more_issue_btn', 'click', moreIssues);