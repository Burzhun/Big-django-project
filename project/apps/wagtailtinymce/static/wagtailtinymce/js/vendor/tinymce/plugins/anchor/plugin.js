(function () {
var anchor = (function () {
  'use strict';

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var isValidId = function (id) {
    return /^[A-Za-z][A-Za-z0-9\-:._]*$/.test(id);
  };
  var getId = function (editor) {
    var selectedNode = editor.selection.getNode();
    var isAnchor = selectedNode.tagName === 'A' && editor.dom.getAttrib(selectedNode, 'href') === '';
    return isAnchor ? selectedNode.id || selectedNode.name : '';
  };
  var insert = function (editor, id) {
    var selectedNode = editor.selection.getNode();
    var isAnchor = selectedNode.tagName === 'A' && editor.dom.getAttrib(selectedNode, 'href') === '';
    if (isAnchor) {
      selectedNode.removeAttribute('name');
      selectedNode.id = id;
    } else {
      editor.focus();
      editor.selection.collapse(true);
      editor.execCommand('mceInsertContent', false, editor.dom.createHTML('a', { id: id }));
    }
  };
  var $_e75iap7njcg9ma4g = {
    isValidId: isValidId,
    getId: getId,
    insert: insert
  };

  var insertAnchor = function (editor, newId) {
    if (!$_e75iap7njcg9ma4g.isValidId(newId)) {
      editor.windowManager.alert('Id should start with a letter, followed only by letters, numbers, dashes, dots, colons or underscores.');
      return true;
    } else {
      $_e75iap7njcg9ma4g.insert(editor, newId);
      return false;
    }
  };
  var open = function (editor) {
    var currentId = $_e75iap7njcg9ma4g.getId(editor);
    editor.windowManager.open({
      title: 'Anchor',
      body: {
        type: 'textbox',
        name: 'id',
        size: 40,
        label: 'Id',
        value: currentId
      },
      onsubmit: function (e) {
        var newId = e.data.id;
        if (insertAnchor(editor, newId)) {
          e.preventDefault();
        }
      }
    });
  };
  var $_c6n0s27mjcg9ma4e = { open: open };

  var register = function (editor) {
    editor.addCommand('mceAnchor', function () {
      $_c6n0s27mjcg9ma4e.open(editor);
    });
  };
  var $_f25qc67ljcg9ma4d = { register: register };

  var isAnchorNode = function (node) {
    return !node.attr('href') && (node.attr('id') || node.attr('name')) && !node.firstChild;
  };
  var setContentEditable = function (state) {
    return function (nodes) {
      for (var i = 0; i < nodes.length; i++) {
        if (isAnchorNode(nodes[i])) {
          nodes[i].attr('contenteditable', state);
        }
      }
    };
  };
  var setup = function (editor) {
    editor.on('PreInit', function () {
      editor.parser.addNodeFilter('a', setContentEditable('false'));
      editor.serializer.addNodeFilter('a', setContentEditable(null));
    });
  };
  var $_86vexs7ojcg9ma4i = { setup: setup };

  var register$1 = function (editor) {
    editor.addButton('anchor', {
      icon: 'anchor',
      tooltip: 'Anchor',
      cmd: 'mceAnchor',
      stateSelector: 'a:not([href])'
    });
    editor.addMenuItem('anchor', {
      icon: 'anchor',
      text: 'Anchor',
      context: 'insert',
      cmd: 'mceAnchor'
    });
  };
  var $_z3qb57pjcg9ma4k = { register: register$1 };

  PluginManager.add('anchor', function (editor) {
    $_86vexs7ojcg9ma4i.setup(editor);
    $_f25qc67ljcg9ma4d.register(editor);
    $_z3qb57pjcg9ma4k.register(editor);
  });
  var Plugin = function () {
  };

  return Plugin;

}());
})()
