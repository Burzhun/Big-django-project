(function () {
var code = (function () {
  'use strict';

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var DOMUtils = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

  var getMinWidth = function (editor) {
    return editor.getParam('code_dialog_width', 600);
  };
  var getMinHeight = function (editor) {
    return editor.getParam('code_dialog_height', Math.min(DOMUtils.DOM.getViewPort().h - 200, 500));
  };
  var $_5ajytq90jcg9ma90 = {
    getMinWidth: getMinWidth,
    getMinHeight: getMinHeight
  };

  var setContent = function (editor, html) {
    editor.focus();
    editor.undoManager.transact(function () {
      editor.setContent(html);
    });
    editor.selection.setCursorLocation();
    editor.nodeChanged();
  };
  var getContent = function (editor) {
    return editor.getContent({ source_view: true });
  };
  var $_1oufct92jcg9ma91 = {
    setContent: setContent,
    getContent: getContent
  };

  var open = function (editor) {
    var minWidth = $_5ajytq90jcg9ma90.getMinWidth(editor);
    var minHeight = $_5ajytq90jcg9ma90.getMinHeight(editor);
    var win = editor.windowManager.open({
      title: 'Source code',
      body: {
        type: 'textbox',
        name: 'code',
        multiline: true,
        minWidth: minWidth,
        minHeight: minHeight,
        spellcheck: false,
        style: 'direction: ltr; text-align: left'
      },
      onSubmit: function (e) {
        $_1oufct92jcg9ma91.setContent(editor, e.data.code);
      }
    });
    win.find('#code').value($_1oufct92jcg9ma91.getContent(editor));
  };
  var $_1wq7468zjcg9ma8z = { open: open };

  var register = function (editor) {
    editor.addCommand('mceCodeEditor', function () {
      $_1wq7468zjcg9ma8z.open(editor);
    });
  };
  var $_5zzt2d8yjcg9ma8y = { register: register };

  var register$1 = function (editor) {
    editor.addButton('code', {
      icon: 'code',
      tooltip: 'Source code',
      onclick: function () {
        $_1wq7468zjcg9ma8z.open(editor);
      }
    });
    editor.addMenuItem('code', {
      icon: 'code',
      text: 'Source code',
      onclick: function () {
        $_1wq7468zjcg9ma8z.open(editor);
      }
    });
  };
  var $_nfp7w93jcg9ma92 = { register: register$1 };

  PluginManager.add('code', function (editor) {
    $_5zzt2d8yjcg9ma8y.register(editor);
    $_nfp7w93jcg9ma92.register(editor);
    return {};
  });
  var Plugin = function () {
  };

  return Plugin;

}());
})()
