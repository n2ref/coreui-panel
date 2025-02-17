
import 'ejs/ejs.min';
import panelTpl      from '../panel.tpl';
import panelUtils    from '../panel.utils';
import panelElements from "../panel.elements";

let PanelControlDropdown = {

    _id: null,
    _panel: null,
    _options: {
        id: null,
        type: 'dropdown',
        content: null,
        items: null,
        attr: {
            class: 'btn btn-primary dropdown-toggle',
        }
    },


    /**
     * Инициализация
     * @param {object} panel
     * @param {object} options
     */
    init: function (panel, options) {

        this._options = $.extend({}, this._options, options);
        this._panel   = panel;
        this._id      = this._options.hasOwnProperty('id') && typeof this._options.id === 'string' && this._options.id
            ? this._options.id
            : panelUtils.hashCode();

        if (Array.isArray(this._options.items)) {
            $.each(this._options.items, function (key, item) {
                if (panelUtils.isObject(item) && typeof item.type === 'string') {

                    item.id = item.hasOwnProperty('id') && typeof item.id === 'string' && item.id
                        ? item.id
                        : panelUtils.hashCode();
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

        if (Array.isArray(options.items)) {
            $.each(options.items, function (key, item) {
                if (panelUtils.isObject(item) && typeof item.type === 'string') {

                    if (item.type === 'button') {
                        if (item.hasOwnProperty('content') &&
                            item.hasOwnProperty('onClick') &&
                            ['string', 'function'].indexOf(typeof item.onClick) >= 0 &&
                            typeof item.content === 'string'
                        ) {

                            let control = panelElements.getControl(that._panel.getId(), that.getId());

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

        let options    = this.getOptions();
        let items      = [];
        let attributes = [];


        if (Array.isArray(options.items)) {
            $.each(options.items, function (key, item) {
                if (panelUtils.isObject(item) && typeof item.type === 'string') {

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
        }

        if (panelUtils.isObject(options.attr)) {
            if (options.attr.hasOwnProperty('type')) {
                delete options.attr.type;
            }
            if (options.attr.hasOwnProperty('id')) {
                delete options.attr.id;
            }
            if (options.attr.hasOwnProperty('data-bs-toggle')) {
                delete options.attr['data-bs-toggle'];
            }

            $.each(options.attr, function (name, value) {
                attributes.push(name + '="' + value + '"');
            });
        }

        return ejs.render(panelTpl['controls/dropdown.html'], {
            content: options.content,
            position: options.hasOwnProperty('position') && typeof options.position === 'string' ? options.position : 'end',
            attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
            items: items,
        });
    }
}

export default PanelControlDropdown;