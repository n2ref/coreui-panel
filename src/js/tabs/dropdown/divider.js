import Utils from '../../utils';
import Tpl   from "../../tpl";

let Divider = {

    _id: null,
    _panel: null,
    _dropdown: null,
    _options: {
        id: null,
        type: 'divider'
    },


    /**
     * Инициализация таба
     * @param {object} panel
     * @param {object} dropdown
     * @param {object} options
     * @private
     */
    _init: function (panel, dropdown, options) {

        this._options  = $.extend(true, {}, this._options, options);
        this._panel    = panel;
        this._dropdown = dropdown;
        this._id       = this._options.hasOwnProperty('id') && typeof this._options.id == 'string' && this._options.id
            ? this._options.id
            : Utils.hashCode();
    },


    /**
     * Получение идентификатора таба
     * @returns {string}
     */
    getId: function () {
        return this._id;
    },


    /**
     * Рендер содержимого
     * @return {*}
     */
    render: function () {

        return Tpl['tabs/tab-dropdown-divider.html'];
    }
}


export default Divider;