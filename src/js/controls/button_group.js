
import 'ejs/ejs.min';
import Tpl      from '../tpl';
import Utils    from '../utils';
import Elements from "../elements";

let PanelControlButtonGroup = {

    _id: null,
    _panel: null,
    _options: {
        id: null,
        type: 'buttonGroup',
        content: null,
        onClick: null,
        attr: null
    },
    _link: {
        attr: {
            class: 'btn btn-secondary'
        }
    },
    _button: {
        attr: {
            class: 'btn btn-secondary'
        }
    },
    _dropdown: {
        attr: {
            class: 'btn btn-secondary dropdown-toggle'
        }
    },


    /**
     * Инициализация
     * @param {object} panel
     * @param {object}                options
     */
    init: function (panel, options) {

        this._panel   = panel;
        this._options = $.extend({}, this._options, options);
        this._id      = this._options.hasOwnProperty('id') && typeof this._options.id === 'string' && this._options.id
            ? this._options.id
            : Utils.hashCode();


        if (Array.isArray(this._options.buttons)) {
            this._options.buttons.map(function (button) {
                if (Utils.isObject(button) && typeof button.type === 'string') {

                    button.id = Utils.hashCode();

                    if (button.type === 'dropdown' && Array.isArray(button.items)) {
                        $.each(button.items, function (key, item) {
                            if (Utils.isObject(item) && typeof item.type === 'string') {

                                item.id = item.hasOwnProperty('id') && typeof item.id === 'string' && item.id
                                    ? item.id
                                    : Utils.hashCode();
                            }
                        });
                    }
                }
            });
        }
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Инициализация событий связанных с элементом управления
     */
    initEvents: function () {

        let that    = this;
        let options = this.getOptions();

        if (Array.isArray(options.buttons)) {

            let control = Elements.getControl(this._panel.getId(), this._id);

            options.buttons.map(function (button) {
                if (Utils.isObject(button) && typeof button.type === 'string') {

                    if (button.type === 'button') {
                        if (button.hasOwnProperty('onClick') &&
                            ['string', 'function'].indexOf(typeof button.onClick) >= 0
                        ) {

                            $('button#btn-' + button.id, control)
                                .click(function (event) {
                                    let prop = {
                                        event: event,
                                        panel: that._panel,
                                    }
                                    if (typeof button.onClick === 'function') {
                                        button.onClick(prop);

                                    } else if (typeof button.onClick === 'string') {
                                        (new Function(button.onClick))(prop);
                                    }
                                });
                        }

                    } else if (button.type === 'dropdown' && Array.isArray(button.items)) {
                        button.items.map(function (item) {
                            if (Utils.isObject(item) && typeof item.type === 'string') {

                                if (item.hasOwnProperty('onClick') &&
                                    ['string', 'function'].indexOf(typeof item.onClick) >= 0
                                ) {

                                    $('button#btn-dropdown-' + item.id, control)
                                        .click(function (event) {
                                            let prop = {
                                                event: event,
                                                panel: that._panel,
                                            }
                                            if (typeof item.onClick === 'function') {
                                                item.onClick(prop);

                                            } else if (typeof item.onClick === 'string') {
                                                (new Function(item.onClick))(prop);
                                            }
                                        });
                                }
                            }
                        });
                    }
                }
            });
        }
    },


    /**
     * Получение ID элемента управления
     * @returns {string}
     */
    getId: function () {
        return this._id;
    },


    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render: function() {

        let options = this.getOptions();
        let buttons = [];
        let that    = this;

        if (Array.isArray(options.buttons)) {

            options.buttons.map(function (button) {
                if (Utils.isObject(button) && typeof button.type === 'string') {

                    if (button.type === 'link') {
                        if (button.hasOwnProperty('link') &&
                            button.hasOwnProperty('content') &&
                            typeof button.link === 'string' &&
                            typeof button.content === 'string'
                        ) {
                            let attributes = [];

                            if ( ! Utils.isObject(button.attr)) {
                                button.attr = {};
                            }

                            if (button.attr.hasOwnProperty('href')) {
                                delete button.attr.href;
                            }

                            if ( ! button.attr.hasOwnProperty('class')) {
                                button.attr.class = that._link.attr.class;
                            }

                            $.each(button.attr, function (name, value) {
                                attributes.push(name + '="' + value + '"');
                            });

                            buttons.push({
                                type: 'link',
                                link: button.link,
                                content: button.content,
                                attr: attributes
                            });
                        }

                    } else if (button.type === 'button') {
                        if (button.hasOwnProperty('content') &&
                            button.hasOwnProperty('onClick') &&
                            typeof button.content === 'string' &&
                            ['string', 'function'].indexOf(typeof button.onClick) >= 0
                        ) {
                            let attributes = [];

                            if ( ! Utils.isObject(button.attr)) {
                                button.attr = {};
                            }

                            if (button.attr.hasOwnProperty('type')) {
                                delete button.attr.type;
                            }

                            if (button.attr.hasOwnProperty('id')) {
                                delete button.attr.id;
                            }

                            if ( ! button.attr.hasOwnProperty('class')) {
                                button.attr.class = that._button.attr.class;
                            }

                            for(const [name, value] of Object.entries(button.attr)) {
                                attributes.push(name + '="' + value + '"');
                            }

                            buttons.push({
                                type: 'button',
                                link: button.link,
                                id: button.id,
                                content: button.content,
                                attr: attributes
                            });
                        }


                    } else if (button.type === 'dropdown') {

                        if (Array.isArray(button.items)) {
                            let attributes = [];
                            let items      = [];

                            button.items.map(function (item) {
                                if (Utils.isObject(item) && typeof item.type === 'string') {

                                    if (item.type === 'link') {
                                        if (item.hasOwnProperty('link') &&
                                            item.hasOwnProperty('content') &&
                                            typeof item.link === 'string' &&
                                            typeof item.content === 'string'
                                        ) {
                                            items.push({
                                                type: 'link',
                                                link: item.link,
                                                content: item.content,
                                            });
                                        }

                                    } else if (item.type === 'button') {
                                        if (item.hasOwnProperty('content') &&
                                            item.hasOwnProperty('onClick') &&
                                            typeof item.content === 'string' &&
                                            ['string', 'function'].indexOf(typeof item.onClick) >= 0
                                        ) {
                                            items.push({
                                                type: 'button',
                                                id: item.id,
                                                content: item.content,
                                            });
                                        }


                                    } else if (item.type === 'divider') {
                                        items.push({
                                            type: 'divider',
                                        });
                                    }
                                }
                            });


                            if ( ! Utils.isObject(button.attr)) {
                                button.attr = {};
                            }

                            if (button.attr.hasOwnProperty('type')) {
                                delete button.attr.type;
                            }

                            if (button.attr.hasOwnProperty('id')) {
                                delete button.attr.id;
                            }

                            if ( ! button.attr.hasOwnProperty('class')) {
                                button.attr.class = that.dropdown.attr.class;
                            }

                            for(const [name, value] of Object.entries(button.attr)) {
                                attributes.push(name + '="' + value + '"');
                            }

                            buttons.push({
                                type: 'dropdown',
                                content: button.content,
                                position: button.hasOwnProperty('position') && typeof button.position === 'string' ? button.position : 'end',
                                attr: attributes,
                                items: items
                            });
                        }
                    }
                }
            });
        }


        return ejs.render(Tpl['controls/button_group.html'], {
            buttons: buttons,
        });
    }
}

export default PanelControlButtonGroup;