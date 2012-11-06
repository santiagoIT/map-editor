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
                'click #keySpace':"onSpaceChar",
                'click #swapKeyboard':"onSwapKeyboard"
            },
            lettersShown: true,

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
                this.addCharToRow($row, '.');

                // row3
                $row = this.$el.find('#keyBoardRow3');
               // jQuery('<div/>').addClass('btnKeyLarge clickable clearContents pull-left').html('LIMPIAR').appendTo($row);
                this.addCharToRow($row, ',');
                this.addCharToRow($row, 'Z');
                this.addCharToRow($row, 'X');
                this.addCharToRow($row, 'C');
                this.addCharToRow($row, 'V');
                this.addCharToRow($row, 'B');
                this.addCharToRow($row, 'N');
                this.addCharToRow($row, 'M');
                this.addCharToRow($row, '?');
                this.addCharToRow($row, '!');
               // jQuery('<div/>').addClass('btnKeyLarge clickable deleteChar pull-left').html('BORRAR').appendTo($row);

                // row4
                $row = this.$el.find('#keyBoardRow4');
                this.addCharToRow($row, '1');
                this.addCharToRow($row, '2');
                this.addCharToRow($row, '3');
                this.addCharToRow($row, '4');
                this.addCharToRow($row, '5');
                this.addCharToRow($row, '6');
                this.addCharToRow($row, '7');
                this.addCharToRow($row, '8');
                this.addCharToRow($row, '9');
                this.addCharToRow($row, '0');

                // row5
                $row = this.$el.find('#keyBoardRow5');
                this.addCharToRow($row, '!');
                this.addCharToRow($row, '@');
                this.addCharToRow($row, '#');
                this.addCharToRow($row, '$');
                this.addCharToRow($row, '%');
                this.addCharToRow($row, '&');
                this.addCharToRow($row, '*');
                this.addCharToRow($row, '(');
                this.addCharToRow($row, ')');
                this.addCharToRow($row, '=');

                // row6
                $row = this.$el.find('#keyBoardRow6');
                this.addCharToRow($row, '+');
                this.addCharToRow($row, '-');
                this.addCharToRow($row, '/');
                this.addCharToRow($row, '=');
                this.addCharToRow($row, ':');
                this.addCharToRow($row, ';');
                this.addCharToRow($row, '?');
                this.addCharToRow($row, '<');
                this.addCharToRow($row, '>');
                this.addCharToRow($row, '.');
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
            },

            onSwapKeyboard:function(){
                $('.keyboardSwap').toggle();
                this.lettersShown = !this.lettersShown;
                var text = 'ABC...';
                if (this.lettersShown){
                    text = '123/@?.'
                }
                this.$el.find('#swapKeyboard').html(text);
                return false;
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