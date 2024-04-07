
import '../../../node_modules/ejs/ejs.min';
import coreuiPanel         from "../coreui.panel";
import coreuiPanelTpl      from '../coreui.panel.templates';
import coreuiPanelUtils    from '../coreui.panel.utils';
import coreuiPanelElements from "../coreui.panel.elements";

coreuiPanel.controls.custom = {

    _id: null,
    _panel: null,
    _options: {
        id: null,
        type: 'custom',
        content: null
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

        if (typeof this._options.content === 'string') {
            return this._options.content;

        } else if (typeof this._options.content === 'function') {
            return this._options.content();
        }
    }
}