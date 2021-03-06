// Generated by CoffeeScript 1.6.2
(function() {
    (function($) {
        return $.widget('IKS.hallonewline', {
            options: {
                editable: null,
                uuid: '',
            },
            populateToolbar: function(toolbar) {
                var buttonElement, buttonset;

                buttonset = jQuery('<span class="' + this.widgetName + '"></span>');
                buttonElement = jQuery('<span></span>');
                buttonElement.hallobutton({
                    uuid: this.options.uuid,
                    editable: this.options.editable,
                    label: 'New line',
                    command: null,
                    icon: 'icon-redirect',
                });
                buttonElement.on('click', function() {
                    var insertionPoint, lastSelection;

                    lastSelection = widget.options.editable.getSelection();
                    insertionPoint = $(lastSelection.endContainer).parentsUntil('.richtext').last();
                    br = document.createElement('br');
                    lastSelection.insertNode(br);
                    return widget.options.editable.element.trigger('change');
                });
                buttonset.append(buttonElement);
                buttonset.hallobuttonset();
                return toolbar.append(buttonset);
            }
        });
    })(jQuery);

}).call(this);