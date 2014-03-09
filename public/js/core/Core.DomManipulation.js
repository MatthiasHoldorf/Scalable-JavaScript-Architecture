/**
 The Core.DomManipulation.js provides functionality for manipulating the DOM.

 @module Client_Core.js
 @class Client_Core_Core.DomManipulation.js
 **/
Core.DomManipulation = (function($) {
    ///////////////////
    // public scope
    return {
        ready : function(context, callback) {
            $(context).ready(callback);
        },
        query : function(selector, context) {
            return $(selector, context);
        },
        getValue : function(selector) {
            return this.query(selector).val();
        },
        setValue : function(selector, value) {
            this.query(selector).val(value);
        },
        setAttr : function(el, attr, value) {
            $(el).attr(attr, value);
        },
        setHtml : function(el, html) {
            $(el).html(html);
        },
        createElement : function(el) {
            return $(document.createElement(el));
        },
        addClass : function(el, class_name) {
            $(el).addClass(class_name);
        },
        removeClass : function(el, class_name) {
            $(el).removeClass(class_name);
        },
        setBackgroundColor : function(el, color) {
            $(el).css("background", color);
        },
        fadeOut : function(el, duration) {
            $(el).fadeOut(duration);
        },
        bind : function(el, evt, callback) {
            $(el).bind(evt, callback);
        },
        unbind : function(el, evt, callback) {
            $(el).unbind(evt, callback);
        },
        delegate : function(el, delegate, evt, callback) {
            $(el).delegate(delegate, evt, callback);
        },
        undelegate : function(el, delegate, evt, callback) {
            $(el).undelegate(delegate, evt, callback);
        },
        appendToList : function(el, html) {
            $(el).append(html);
        },
        hideAppendTo : function(html, el, duration) {
            $(html).hide().appendTo(el).fadeIn(duration);
        },
        prependTo : function(html, el, color, duration) {
            if(color && duration) {
                html.prependTo(el).animate({
                    backgroundColor : color
                }, duration);
            }
            else {
                html.prependTo(el);
            }
        },
        scrollDown : function(el) {
            el.animate({
                scrollTop: el[0].scrollHeight
            }, 800);
        }
    };
}(jQuery));