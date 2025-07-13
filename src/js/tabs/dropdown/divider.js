import Utils from '../../utils';
import Tpl   from "../../tpl";

class DropdownDivider {

    _id = null;
    _panel = null;
    _dropdown = null;
    _options = {
        id: null,
        type: 'divider'
    };


    /**
     * Инициализация таба
     * @param {Panel}       panel
     * @param {TabDropdown} dropdown
     * @param {Object}      options
     * @private
     */
    constructor(panel, dropdown, options) {

        this._options  = $.extend(true, {}, this._options, options);
        this._panel    = panel;
        this._dropdown = dropdown;
        this._id       = this._options.hasOwnProperty('id') && typeof this._options.id == 'string' && this._options.id
            ? this._options.id
            : Utils.hashCode();
    }


    /**
     * Получение идентификатора таба
     * @returns {string}
     */
    getId() {
        return this._id;
    }


    /**
     * Рендер содержимого
     * @return {*}
     */
    render() {

        return Tpl['tabs/tab-dropdown-divider.html'];
    }
}


export default DropdownDivider;