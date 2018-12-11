function(modal) {
    modal.respond('giphyChosen', {{ gif_json|safe }});
    modal.close();
}
