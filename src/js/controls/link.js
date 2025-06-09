
import 'ejs/ejs.min';
import Tpl      from '../tpl';
import Utils    from '../utils';
import Elements from "../elements";

let PanelControlLink = {

    _id: null,
    _panel: null,
    _options: {
        id: null,
        type: 'link',
        href: null,
        content: null,
        onClick: null,
        attr: null
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
            : Utils.hashCode();
    },


    /**
     * Инициализация событий связанных с элементом управления
     */
    initEvents: function () {

        let that = this;

        if (typeof this._options.onClick === 'function' || typeof this._options.onClick === 'string') {

            let control = Elements.getControl(this._panel.getId(), this.getId());
            $('a', control)
                .click(function (event) {
                    let prop = {
                        event: event,
                        panel: that._panel
                    }
                    if (typeof that._options.onClick === 'function') {
                        return that._options.onClick(prop);

                    } else if (typeof that._options.onClick === 'string') {
                        return (new Function(that._options.onClick))(prop);
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

        let attributes = [];

        if (typeof this._options.attr === 'object') {
            for (const [name, value] of Object.entries(this._options.attr)) {
                attributes.push(name + '="' + value + '"');
            }
        }

        return ejs.render(Tpl['controls/link.html'], {
            href: this._options.href,
            content: this._options.content,
            attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
        });
    }
}

export default PanelControlLink;