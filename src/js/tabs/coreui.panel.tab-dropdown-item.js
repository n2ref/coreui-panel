import coreuiPanelUtils    from '../coreui.panel.utils';
import coreuiPanelPrivate  from '../coreui.panel.private';
import coreuiPanelTpl      from "../coreui.panel.templates";
import coreuiPanelElements from "../coreui.panel.elements";

let coreuiPanelTabDropdownItem = {

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
            : coreuiPanelUtils.hashCode();
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

        let tabItemElement = coreuiPanelElements.getTabItemContainer(this._panel.getId(), this.getId());

        if (tabItemElement[0]) {
            let tabTabsElement = coreuiPanelElements.getTabsContainer(this._panel.getId());
            tabTabsElement.find('.nav-link').removeClass('active');
            tabTabsElement.find('.nav-link.dropdown-toggle').removeClass('active');
            tabTabsElement.find('.nav-link.dropdown-toggle .dropdown-item').removeClass('active');

            let tabElement = coreuiPanelElements.getTabContainer(this._panel.getId(), this._dropdown.getId());
            tabElement.find('> a').addClass('active');

            tabItemElement.find('> a').addClass('active');

            coreuiPanelPrivate.trigger(this._panel, 'tab_click', this._panel, [this]);
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

        let tabTitleElement = coreuiPanelElements.getTabItemTitle(this._panel.getId(), this.getId());
        tabTitleElement.text(title);
    },


    /**
     * Установка количества
     * @param {number} count
     */
    setCount: function (count) {

        let tabCountElement = coreuiPanelElements.getTabItemCount(this._panel.getId(), this.getId());

        if (['string', 'number'].indexOf(typeof count) < 0 || count.toString().length === 0) {
            tabCountElement.remove();

        } else {
            if (tabCountElement[0]) {
                tabCountElement.text('(' + count + ')');

            } else {
                let tabTitleElement = coreuiPanelElements.getTabItemTitle(this._panel.getId(), this.getId());
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


        let url = options.hasOwnProperty('url') && typeof options.url == 'string' && options.url
            ? options.url
            : '#';

        const title = options.hasOwnProperty('title') && typeof options.title == 'string' && options.title
            ? options.title
            : '';

        const active   = options.hasOwnProperty('active') && typeof options.active == 'boolean' && options.active;
        const disabled = options.hasOwnProperty('disabled') && typeof options.disabled == 'boolean'
            ? options.disabled
            : false;

        let count = options.hasOwnProperty('count') &&
                    ['string', 'number'].indexOf(typeof options.count) >= 0 &&
                    options.count.toString().length > 0
            ? options.count
            : null;

        return ejs.render(coreuiPanelTpl['tabs/tab-dropdown-item.html'], {
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


export default coreuiPanelTabDropdownItem;