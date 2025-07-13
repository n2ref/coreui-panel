import Utils    from "../utils";
import Elements from "../elements";
import Private  from "../private";


class TabAbstract {

    _id = null;
    _panel = null;

    _options = {
        id: null,
        type: 'tab',
        title: '',
        url: null,
        urlCount: null,
        urlBadge: null,
        count: null,
        badge: null,
        active: false,
        disabled: false,
    };


    /**
     * Инициализация таба
     * @param {Panel}  panel
     * @param {Object} options
     * @private
     */
    constructor(panel, options) {

        this._panel   = panel;
        this._options = $.extend(true, this._options, options);
        this._id      = this._options.hasOwnProperty('id') && typeof this._options.id == 'string' && this._options.id
            ? this._options.id
            : Utils.hashCode();
    }


    /**
     * Получение идентификатора таба
     * @returns {string|null}
     */
    getId() {
        return this._id;
    }


    /**
     * Получение типа таба
     * @returns {string}
     */
    getType() {
        return this._options.type;
    }


    /**
     * Получение опций таба
     * @return {object}
     */
    getOptions() {

        return $.extend(true, {}, this._options);
    }


    /**
     * Проверка активен ли таб
     * @return {false}
     */
    isActive() {

        return  this._options.hasOwnProperty('active') &&
            typeof this._options.active == 'boolean' &&
            this._options.active;
    }


    /**
     * Установка названия
     * @param {string} title
     */
    setTitle(title) {

        if (['string', 'number'].indexOf(typeof title) < 0 || title.toString().length === 0) {
            return;
        }

        let tabTitleElement = Elements.getTabTitle(this._panel.getId(), this.getId());
        tabTitleElement.text(title);
    }


    /**
     * Установка метки
     * @param {object} badge
     */
    setBadge(badge) {

        let badgeRender     = Private.renderBadge(badge);
        let tabBadgeElement = Elements.getTabBadge(this._panel.getId(), this.getId());

        if (badgeRender) {

            if (tabBadgeElement[0]) {
                tabBadgeElement.replaceWith(badgeRender);

            } else {
                let tabTitleElement = Elements.getTabTitle(this._panel.getId(), this.getId());
                tabTitleElement.after(badgeRender);
            }

        } else if (tabBadgeElement[0]) {
            tabBadgeElement.replaceWith(badgeRender);
        }
    }
}

export default TabAbstract;