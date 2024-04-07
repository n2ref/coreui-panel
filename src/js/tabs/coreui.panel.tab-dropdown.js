import coreuiPanelUtils              from '../coreui.panel.utils';
import coreuiPanelPrivate            from '../coreui.panel.private';
import coreuiPanelTpl                from "../coreui.panel.templates";
import coreuiPanelElements           from "../coreui.panel.elements";
import coreuiPanelTabDropdownItem    from "./coreui.panel.tab-dropdown-item";
import coreuiPanelTabDropdownDivider from "./coreui.panel.tab-dropdown-divider";

let coreuiPanelTabDropdown = {

    _id: null,
    _panel: null,
    _items: [],
    _options: {
        id: null,
        type: 'dropdown',
        title: '',
        active: false,
        disabled: false,
        items: [],
    },


    /**
     * Инициализация таба
     * @param {object} panel
     * @param {object} options
     * @private
     */
    _init: function (panel, options) {

        this._options = $.extend(true, {}, this._options, options);
        this._panel   = panel;
        this._id      = this._options.hasOwnProperty('id') && typeof this._options.id == 'string' && this._options.id
            ? this._options.id
            : coreuiPanelUtils.hashCode();


        let that = this;

        if (this._options.hasOwnProperty('items') &&
            Array.isArray(this._options.items) &&
            this._options.items.length > 0
        ) {
            $.each(this._options.items, function (key, item) {
                let tabType = item.hasOwnProperty('type') && typeof item.type === 'string'
                    ? item.type
                    : 'item';

                let instance = null;

                switch (tabType) {
                    case 'item':
                    default:        instance = $.extend(true, {}, coreuiPanelTabDropdownItem);    break;
                    case 'divider': instance = $.extend(true, {}, coreuiPanelTabDropdownDivider); break;
                }

                if (instance) {
                    instance._init(panel, that, item);
                    that._items.push(instance);
                }
            });
        }
    },


    /**
     * Получение идентификатора таба
     * @returns {string}
     */
    getId: function () {
        return this._id;
    },


    /**
     * Инициализация событий
     */
    initEvents: function () {

        let that = this;

        this._panel.on('panel_show', function () {

            let tabsContainerElement = coreuiPanelElements.getTabContainer(that._panel.getId(), that.getId())

            $('.dropdown-item', tabsContainerElement).click(function (event) {
                let tabId = $(this).data('tab-id') || '';
                let tab   = that.getItem(tabId);

                if (tab) {
                    coreuiPanelPrivate.trigger(that._panel, 'tab_click', tab, [tab, event]);

                    let options = tab.getOptions();

                    if (options.url === '#') {
                        return false;
                    }
                }
            });
        });
    },


    /**
     * Получение опций таба
     * @return {object}
     */
    getOptions: function () {

        return $.extend(true, {}, this._options);
    },


    /**
     * Получение опций таба
     * @property {string} itemId
     * @return {object}
     */
    getItem: function (itemId) {

        let result = null;

        $.each(this._items, function (key, item) {

            if (item.hasOwnProperty('getId') &&
                typeof item.getId === 'function' &&
                item.getId() == itemId
            ) {
                result = item;
                return false;
            }
        });

        return result;
    },


    /**
     * Установка названия
     * @param {string} title
     */
    setTitle: function (title) {

        if (['string', 'number'].indexOf(typeof title) < 0 || title.toString().length === 0) {
            return;
        }

        let tabTitleElement = coreuiPanelElements.getTabTitle(this._panel.getId(), this.getId());
        tabTitleElement.text(title);
    },


    /**
     * Установка количества
     * @param {number} count
     */
    setCount: function (count) {

        let tabCountElement = coreuiPanelElements.getTabCount(this._panel.getId(), this.getId());

        if (['string', 'number'].indexOf(typeof count) < 0 || count.toString().length === 0) {
            tabCountElement.remove();

        } else {
            if (tabCountElement[0]) {
                tabCountElement.text('(' + count + ')');

            } else {
                let tabTitleElement = coreuiPanelElements.getTabTitle(this._panel.getId(), this.getId());
                tabTitleElement.after('(' + count + ')');
            }
        }
    },


    /**
     * Установка метки
     * @param {object} badge
     */
    setBadge: function (badge) {

        let badgeRender = coreuiPanelPrivate.renderBadge(badge);

        if (badgeRender) {
            let tabBadgeElement = coreuiPanelElements.getTabBadge(this._panel.getId(), this.getId());

            if (tabBadgeElement[0]) {
                tabBadgeElement.replaceWith(badgeRender);

            } else {
                let tabTitleElement = coreuiPanelElements.getTabTitle(this._panel.getId(), this.getId());
                tabTitleElement.after(badgeRender);
            }
        }
    },


    /**
     * Рендер содержимого
     * @return {string}
     */
    render: function () {

        let options = this.getOptions();

        let title = options.hasOwnProperty('title') && typeof options.title == 'string' && options.title
            ? options.title
            : '';

        let active   = options.hasOwnProperty('active') && typeof options.active == 'boolean' && options.active;
        let disabled = options.hasOwnProperty('disabled') && typeof options.disabled == 'boolean'
            ? options.disabled
            : false;

        let count = options.hasOwnProperty('count') &&
                    ['string', 'number'].indexOf(typeof options.count) >= 0 &&
                    options.count.toString().length > 0
            ? options.count
            : null;

        let badge = options.hasOwnProperty('badge')
            ? coreuiPanelPrivate.renderBadge(options.badge)
            : null;

        let itemsContents = [];

        $.each(this._items, function (key, item) {
            itemsContents.push(item.render());
        });


        return ejs.render(coreuiPanelTpl['tabs/tab-dropdown.html'], {
            tab: {
                id: this.getId(),
                title: title,
                active: active,
                disabled: disabled,
                count: count,
                badge: badge,
                itemsContents: itemsContents,
            },
        });
    }
}


export default coreuiPanelTabDropdown;