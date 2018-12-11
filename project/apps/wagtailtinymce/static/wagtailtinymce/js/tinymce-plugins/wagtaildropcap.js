(function () {
    'use strict';
    (function ($) {
        tinymce.PluginManager.add('dropcap', function (editor) {
            'use strict';

            function setDropCap() {
                var selection = editor.selection;
                let content = selection.getContent();
                if (content.length > 1) {
                    alert('Выберите только одну букву');
                    return;
                }
                var elem = $('<span class="red-letter">'+content+'</span>');
                selection.setNode(elem);
                console.log(content);
            };

            editor.addButton('dropcap', {
                text: 'Буквица',
                onclick: setDropCap
            });

        });
    })(jQuery);
}).call(this);