(function() {
    'use strict';
    (function ($) {
        tinymce.PluginManager.add('typograf', function (editor, url) {
            'use strict';

            var scriptLoader = new tinymce.dom.ScriptLoader(),
                tp,
                typo = function () {
                    if (tp) {
                        editor.setContent(tp.execute(editor.getContent()));
                        editor.undoManager.add();
                    }
                };

            scriptLoader.add(url + '/../vendor/typograf/typograf.min.js');

            scriptLoader.loadQueue(function () {
                Typograf.addRule({
                    name: 'common/other/removeLongDash',
                    handler: function (text) {
                        return text.replace('\u2014', '\u2013');
                    }
                });
                tp = new Typograf({
                    locale: ['ru'],
                    mode: 'name'
                });

            });

            editor.addButton('typograf', {
                text: 'Типографика',
                icon: 'blockquote',
                onclick: typo
            });

            editor.addMenuItem('typograf', {
                context: 'format',
                text: 'Типографика',
                icon: 'blockquote',
                onclick: typo
            });
        });
    })(jQuery);
}).call(this);