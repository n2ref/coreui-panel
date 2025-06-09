import Utils    from '../../utils';
import Private  from '../../private';
import Tpl      from "../../tpl";
import Elements from "../../elements";

let item = {

    _id: null,
    _panel: null,
    _dropdown: null,
    _options: {
        id: null,
        type: 'item',
        active: false,
        disabled: false,
        url: '',
        urlContent: null,
        urlWindow: '',
        title: '',
        count: null,
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
        this._id       = this._options.hasOwnProperty('id') && ['string', 'number'].indexOf(typeof this._options.id) >= 0 && this._options.id
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
     * Получение опций таба
     * @return {object}
     */
    getOptions: function () {

        return $.extend(true, {}, this._options);
    },


    /**
     * Установка активного таба
     */
    setActive: function () {

        let tabItemElement = Elements.getTabItemContainer(this._panel.getId(), this.getId());

        if (tabItemElement[0]) {
            let tabTabsElement = Elements.getTabsContainer(this._panel.getId());
            tabTabsElement.find('.nav-link').removeClass('active');
            tabTabsElement.find('.nav-link.dropdown-toggle').removeClass('active');
            tabTabsElement.find('.nav-link.dropdown-toggle .dropdown-item').removeClass('active');

            let tabElement = Elements.getTabContainer(this._panel.getId(), this._dropdown.getId());
            tabElement.find('> a').addClass('active');

            tabItemElement.find('> a').addClass('active');

            Private.trigger(this._panel, 'tab_click', this._panel, [this]);
        }
    },


    /**
     * Установка названия
     * @param {string} title
     */
    setTitle: function (title) {

        if (['string', 'number'].indexOf(typeof title) < 0 || title.toString().length === 0) {
            return;
        }

        let tabTitleElement = Elements.getTabItemTitle(this._panel.getId(), this.getId());
        tabTitleElement.text(title);
    },


    /**
     * Установка количества
     * @param {number} count
     */
    setCount: function (count) {

        let tabCountElement = Elements.getTabItemCount(this._panel.getId(), this.getId());

        if (['string', 'number'].indexOf(typeof count) < 0 || count.toString().length === 0) {
            tabCountElement.remove();

        } else {
            if (tabCountElement[0]) {
                tabCountElement.text('(' + count + ')');

            } else {
                let tabTitleElement = Elements.getTabItemTitle(this._panel.getId(), this.getId());
                tabTitleElement.after('(' + count + ')');
            }
        }
    },


    /**
     * Рендер содержимого
     * @return {*}
     */
    render: function () {

        let options = this.getOptions();

        options.title = options.hasOwnProperty('title') && typeof options.title == 'string' && options.title
            ? options.title
            : '';

        options.active   = options.hasOwnProperty('active') && typeof options.active == 'boolean' && options.active;
        options.disabled = options.hasOwnProperty('disabled') && typeof options.disabled == 'boolean'
            ? options.disabled
            : false;

        let url = '';

        if (options.hasOwnProperty('url') && typeof options._url == 'string' && options._url) {
            url = options._url;

        } else if (options.hasOwnProperty('urlWindow') && typeof options._urlWindow == 'string' && options._urlWindow) {
            url = options._urlWindow;

        } else {
            url = '#';
        }


        const title = options.hasOwnProperty('title') && typeof options.title == 'string' && options.title
            ? options.title
            : '';

        const active   = options.hasOwnProperty('active') && typeof options.active == 'boolean' && options.active;
        const disabled = options.hasOwnProperty('disabled') && typeof options.disabled == 'boolean'
            ? options.disabled
            : false;

        let count = options.hasOwnProperty('count') &&
                    ['string', 'number'].indexOf(typeof options._count) >= 0 &&
                    options._count.toString().length > 0
            ? options._count
            : null;

        return ejs.render(Tpl['tabs/tab-dropdown-item.html'], {
            item: {
                id: this.getId(),
                type: 'item',
                active: active,
                disabled: disabled,
                url: url,
                title: title,
                count: count
            },
        });
    }
}


export default item;