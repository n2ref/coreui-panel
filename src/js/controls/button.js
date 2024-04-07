
import '../../../node_modules/ejs/ejs.min';
import coreuiPanel         from "../coreui.panel";
import coreuiPanelTpl      from '../coreui.panel.templates';
import coreuiPanelUtils    from '../coreui.panel.utils';
import coreuiPanelElements from "../coreui.panel.elements";

coreuiPanel.controls.button = {

    _id: null,
    _panel: null,
    _options: {
        id: null,
        type: 'button',
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
            : coreuiPanelUtils.hashCode();
    },


    /**
     * Инициализация событий связанных с элементом управления
     */
    initEvents: function () {

        let that = this;

        if (typeof this._options.onClick === 'function' || typeof this._options.onClick === 'string') {

            let control = coreuiPanelElements.getControl(this._panel.getId(), this.getId());
            $('button', control)
                .click(function (event) {
                    if (typeof that._options.onClick === 'function') {
                        that._options.onClick(event, that._panel);

                    } else if (typeof that._options.onClick === 'string') {
                        (new Function(that._options.onClick))();
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

        if (coreuiPanelUtils.isObject(this._options.attr)) {
            $.each(this._options.attr, function (name, value) {
                attributes.push(name + '="' + value + '"');
            });
        }


        return ejs.render(coreuiPanelTpl['controls/button.html'], {
            content: this._options.content,
            attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
        });
    }
}