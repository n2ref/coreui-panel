import Private         from '../private';
import Tpl             from "../tpl";
import Elements        from "../elements";
import TabAbstract     from "../abstract/tab";
import DropdownItem    from "./dropdown/item";
import DropdownDivider from "./dropdown/divider";


/**
 *
 */
class TabDropdown extends TabAbstract {

    _items = [];


    /**
     * Инициализация таба
     * @param {Panel}  panel
     * @param {object} options
     * @private
     */
    constructor(panel, options) {

        let defaultOptions = {
            id: null,
            type: 'dropdown',
            title: '',
            active: false,
            disabled: false,
            items: [],
        };

        super(panel, $.extend(true, {}, defaultOptions, options));


        let that = this;

        if (this._options.hasOwnProperty('items') &&
            Array.isArray(this._options.items) &&
            this._options.items.length > 0
        ) {
            this._options.items.map(function (item) {
                let tabType = item.hasOwnProperty('type') && typeof item.type === 'string'
                    ? item.type
                    : 'item';

                let instance = null;

                switch (tabType) {
                    case 'item':
                    default:        instance = new DropdownItem(panel, that, item);    break;
                    case 'divider': instance = new DropdownDivider(panel, that, item); break;
                }

                if (instance) {
                    that._items.push(instance);
                }
            });
        }
    }


    /**
     * Инициализация событий
     */
    initEvents() {

        let that = this;

        this._panel.on('panel_show', function () {

            let tabsContainerElement = Elements.getTabContainer(that._panel.getId(), that.getId())

            $('.dropdown-item', tabsContainerElement).click(function (event) {
                let tabId = $(this).data('tab-id') || '';
                let tab   = that.getItem(tabId);

                if (tab) {
                    Private.trigger(that._panel, 'tab_click', tab, [{tab : tab, event : event}]);

                    let options = tab.getOptions();

                    if (options._url && options._url !== '#') {
                        location.href = options._url;

                    } else {
                        return false;
                    }
                }
            });
        });
    }


    /**
     * Получение опций таба
     * @property {string} itemId
     * @return {object}
     */
    getItem(itemId) {

        let result = null;

        for (const item of this._items) {

            if (item.getId &&
                typeof item.getId === 'function' &&
                item.getId() == itemId
            ) {
                result = item;
                break;
            }
        }

        return result;
    }


    /**
     * Установка количества
     * @param {number} count
     */
    setCount(count) {

        let tabCountElement = Elements.getTabCount(this._panel.getId(), this.getId());

        if (['string', 'number'].indexOf(typeof count) < 0 || count.toString().length === 0) {
            tabCountElement.remove();

        } else {
            if (tabCountElement[0]) {
                tabCountElement.text('(' + count + ')');

            } else {
                let tabTitleElement = Elements.getTabTitle(this._panel.getId(), this.getId());
                tabTitleElement.after('(' + count + ')');
            }
        }
    }


    /**
     * Рендер содержимого
     * @return {string}
     */
    render() {

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
            ? Private.renderBadge(options.badge)
            : null;

        let itemsContents = [];

        this._items.map(function (item) {
            itemsContents.push(item.render());
        });


        return ejs.render(Tpl['tabs/tab-dropdown.html'], {
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


export default TabDropdown;