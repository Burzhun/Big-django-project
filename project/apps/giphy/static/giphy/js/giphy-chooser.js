function createGiphyChooser(id) {
    var chooserElement = $('#' + id + '-chooser');
    var chosen = chooserElement.closest('.giphy-chooser').find('.chosen');
    var input = $('#' + id);
    // var editLink = chooserElement.find('.edit-link');

    $('.action-choose', chooserElement).click(function() {
        ModalWorkflow({
            url: window.chooserUrls.giphyChooser,
            responses: {
                giphyChosen: function(giphyData) {
                    input.val(giphyData.embed_url);
                    chosen.find('iframe').remove();
                    chosen.append($('<iframe src="'+giphyData.embed_url+'"  frameBorder="0"></iframe>'));
                    chooserElement.removeClass('blank');

                }
            }
        });
    });

    $('.action-clear', chooserElement).click(function() {
        input.val('');
        chooserElement.addClass('blank');
    });
}