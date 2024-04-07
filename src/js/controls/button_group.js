
import '../../../node_modules/ejs/ejs.min';
import coreuiPanel         from "../coreui.panel";
import coreuiPanelTpl      from '../coreui.panel.templates';
import coreuiPanelUtils    from '../coreui.panel.utils';
import coreuiPanelElements from "../coreui.panel.elements";

coreuiPanel.controls.button_group = {

    _id: null,
    _panel: null,
    _options: {
        id: null,
        type: 'button_group',
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
            class: 'btn btn-secondary'
        }
    },


    /**
     * Инициализация
     * @param {object} panel
     * @param {object}                options
     */
    init: function (panel, options) {

        this._options = $.extend({}, this._options, options);
        this._panel   = panel;
        this._id      = this._options.hasOwnProperty('id') && typeof this._options.id === 'string' && this._options.id
            ? this._options.id
            : coreuiPanelUtils.hashCode();


        if (Array.isArray(this._options.buttons)) {
            $.each(this._options.buttons, function (key, button) {
                if (coreuiPanelUtils.isObject(button) && typeof button.type === 'string') {

                    button.id = coreuiPanelUtils.hashCode();

                    if (button.type === 'dropdown' && Array.isArray(button.items)) {
                        $.each(button.items, function (key, item) {
                            if (coreuiPanelUtils.isObject(item) && typeof item.type === 'string') {

                                item.id = coreuiPanelUtils.hashCode();
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

            let control = coreuiPanelElements.getControl(this._panel.getId(), this._id);

            $.each(options.buttons, function (key, button) {
                if (coreuiPanelUtils.isObject(button) && typeof button.type === 'string') {

                    if (button.type === 'button') {
                        if (button.hasOwnProperty('content') &&
                            button.hasOwnProperty('onClick') &&
                            ['string', 'function'].indexOf(typeof button.onClick) >= 0 &&
                            typeof button.content === 'string'
                        ) {

                            $('button#btn-' + button.id, control)
                                .click(function (event) {
                                    if (typeof button.onClick === 'function') {
                                        button.onClick(event, that._panel);

                                    } else if (typeof button.onClick === 'string') {
                                        (new Function(button.onClick))();
                                    }
                                });
                        }

                    } else if (button.type === 'dropdown' && Array.isArray(button.items)) {
                        $.each(button.items, function (key, item) {
                            if (coreuiPanelUtils.isObject(item) && typeof item.type === 'string') {

                                if (item.hasOwnProperty('content') &&
                                    item.hasOwnProperty('onClick') &&
                                    ['string', 'function'].indexOf(typeof item.onClick) >= 0 &&
                                    typeof item.content === 'string'
                                ) {

                                    $('button#btn-dropdown-' + item.id, control)
                                        .click(function (event) {
                                            if (typeof item.onClick === 'function') {
                                                item.onClick(event, that._panel);

                                            } else if (typeof item.onClick === 'string') {
                                                (new Function(item.onClick))();
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
            $.each(options.buttons, function (key, button) {
                if (coreuiPanelUtils.isObject(button) && typeof button.type === 'string') {

                    if (button.type === 'link') {
                        if (button.hasOwnProperty('link') &&
                            button.hasOwnProperty('content') &&
                            typeof button.link === 'string' &&
                            typeof button.content === 'string'
                        ) {
                            let attributes = [];

                            if (coreuiPanelUtils.isObject(button.attr)) {
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

                            if (coreuiPanelUtils.isObject(button.attr)) {
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

                            $.each(button.attr, function (name, value) {
                                attributes.push(name + '="' + value + '"');
                            });

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

                            $.each(button.items, function (key, item) {
                                if (coreuiPanelUtils.isObject(item) && typeof item.type === 'string') {

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


                            if (coreuiPanelUtils.isObject(button.attr)) {
                                button.attr = {};
                            }

                            if (button.attr.hasOwnProperty('type')) {
                                delete button.attr.type;
                            }

                            if (button.attr.hasOwnProperty('id')) {
                                delete button.attr.id;
                            }

                            if ( ! button.attr.hasOwnProperty('class')) {
                                button.attr.class = that._dropdown.attr.class;
                            }

                            if (button.attr.hasOwnProperty('class') &&
                                ['string', 'number'].indexOf(typeof button.attr.class) >= 0
                            ) {
                                button.attr.class += ' dropdown-toggle';
                            }


                            $.each(button.attr, function (name, value) {
                                attributes.push(name + '="' + value + '"');
                            });

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


        return ejs.render(coreuiPanelTpl['controls/button_group.html'], {
            buttons: buttons,
        });
    }
}