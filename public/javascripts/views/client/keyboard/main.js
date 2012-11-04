define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/client/keyboard/main.html'
],
    function ($, _, Backbone, html) {
        var View = Backbone.View.extend({
            events:{
                'click .navItem':"onNavigateTo",
                'click #hideKeyboard':"onHideKeyboard",
                'click #inputDone':"onInputDone",
                'click .char':"onCharPress",
                'click .clearContents':"onClearContents",
                'click .deleteChar':"onDeleteChar",
                'click #keySpace':"onSpaceChar"
            },

            initialize:function () {
                this.$el.html(html);

                // add chars row 1
                var $row = this.$el.find('#keyBoardRow1');
                this.addCharToRow($row, 'Q');
                this.addCharToRow($row, 'W');
                this.addCharToRow($row, 'E');
                this.addCharToRow($row, 'R');
                this.addCharToRow($row, 'T');
                this.addCharToRow($row, 'Y');
                this.addCharToRow($row, 'U');
                this.addCharToRow($row, 'I');
                this.addCharToRow($row, 'O');
                this.addCharToRow($row, 'P');

                // row2
                $row = this.$el.find('#keyBoardRow2');
                this.addCharToRow($row, 'A');
                this.addCharToRow($row, 'S');
                this.addCharToRow($row, 'D');
                this.addCharToRow($row, 'F');
                this.addCharToRow($row, 'G');
                this.addCharToRow($row, 'H');
                this.addCharToRow($row, 'J');
                this.addCharToRow($row, 'K');
                this.addCharToRow($row, 'L');

                // row3
                $row = this.$el.find('#keyBoardRow3');
                jQuery('<div/>').addClass('btnKeyLarge clickable clearContents pull-left').html('LIMPIAR').appendTo($row);
                this.addCharToRow($row, 'Z');
                this.addCharToRow($row, 'X');
                this.addCharToRow($row, 'C');
                this.addCharToRow($row, 'V');
                this.addCharToRow($row, 'B');
                this.addCharToRow($row, 'N');
                this.addCharToRow($row, 'M');
                jQuery('<div/>').addClass('btnKeyLarge clickable deleteChar pull-left').html('BORRAR').appendTo($row);

            },

            render:function () {
                return this;
            },

            onHideKeyboard:function(){
                this.$el.parent().hide();
            },

            onCharPress:function(el){
                var $element = $(el.target);
                var text = this.$focusedElement.val();
                text += $element.text();
                this.$focusedElement.val(text);
            },

            onSpaceChar:function(el){
                var text = this.$focusedElement.val();
                text += ' ';
                this.$focusedElement.val(text);
            },

            onClearContents:function(el){
                this.$focusedElement.val('');
            },

            onDeleteChar:function(el){
                var text = this.$focusedElement.val();
                if (text.length > 0) {
                    text = text.substring(0, text.length-1);
                    this.$focusedElement.val(text);
                }
            },

            onInputDone : function(){
                var $form = this.$focusedElement.closest('form');
                if ($form) {
                    $form.submit();
                }
                this.$el.parent().hide();

                // TODO: submit form
            },

            getKeyboardSate:function(){
                return this.keyboardState;
            },

            setFocusedElement:function($el){
                this.$focusedElement = $el;
            },

            addCharToRow:function($row, char) {
                jQuery('<div/>').addClass('char clickable').html(char).appendTo($row);
            }

        });

        return View;
    }
);