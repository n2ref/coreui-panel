import coreuiPanelUtils    from '../coreui.panel.utils';
import coreuiPanelPrivate  from '../coreui.panel.private';
import coreuiPanelTpl      from "../coreui.panel.templates";
import coreuiPanelElements from "../coreui.panel.elements";

let coreuiPanelTab = {

    _id: null,
    _panel: null,
    _options: {
        id: null,
        type: 'tab',
        title: '',
        url: null,
        urlContent: null,
        urlCount: null,
        urlBadge: null,
        urlWindow: null,
        count: null,
        badge: null,
        active: false,
        disabled: false,
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

        let tabTabElement = coreuiPanelElements.getTabContainer(this._panel.getId(), this.getId());

        if (tabTabElement[0]) {
            let tabTabsElement = coreuiPanelElements.getTabsContainer(this._panel.getId());
            tabTabsElement.find('.nav-link').removeClass('active');
            tabTabsElement.find('.nav-link.dropdown-toggle').removeClass('active');
            tabTabsElement.find('.nav-link.dropdown-toggle .dropdown-item').removeClass('active');

            tabTabElement.find('> a').addClass('active');

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

        let tabTitleElement = coreuiPanelElements.getTabTitle(this._panel.getId(), this.getId());
        tabTitleElement.text(title);
    },


    /**
     * Установка количества
     * @param {number|null} count
     */
    setCount: function (count) {

        let tabCountElement = coreuiPanelElements.getTabCount(this._panel.getId(), this.getId());

        if (['string', 'number'].indexOf(typeof count) < 0 || count.toString().length === 0) {
            tabCountElement.remove();

        } else {
            if (tabCountElement[0]) {
                tabCountElement.text(' (' + count + ')');

            } else {
                let tabTitleElement = coreuiPanelElements.getTabTitle(this._panel.getId(), this.getId());
                tabTitleElement.after('<span class="coreui-panel__tab-count"> (' + count + ')>');
            }
        }
    },


    /**
     * Установка количества
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
     *
     */
    initEvents: function () {

        let that    = this;
        let options = this.getOptions();

        this._panel.on('panel_show', function () {

            let tabsContainerElement = coreuiPanelElements.getTabContainer(that._panel.getId(), that.getId())

            $('.nav-link', tabsContainerElement).click(function (event) {
                coreuiPanelPrivate.trigger(that._panel, 'tab_click', that, [that, event]);

                if (options.url && options.url !== '#') {
                    location.href = options.url;

                } else {
                    return false;
                }
            });



            let count = options.hasOwnProperty('count') &&
                        ['string', 'number'].indexOf(typeof options.count) >= 0 &&
                        options.count.toString().length > 0
                ? options.count
                : null;

            let urlCount = options.hasOwnProperty('urlCount') && typeof options.urlCount == 'string' && options.urlCount
                ? options.urlCount
                : null;

            if (count === null && urlCount) {
                that.setCount('<div class="spinner-border spinner-border-sm text-secondary"></div>');

                $.ajax({
                    url: urlCount,
                    method: 'get',
                    success: function (result) {

                        try {
                            let response = typeof result === 'string'
                                ? JSON.parse(result)
                                : result;

                            if (coreuiPanelUtils.isObject(response) &&
                                response.hasOwnProperty('count') &&
                                ['string', 'number'].indexOf(typeof response.count) >= 0 &&
                                response.count.toString().length > 0
                            ) {
                                that.setCount(response.count);

                            } else {
                                that.setCount(null);
                            }

                        } catch (e) {
                            that.setCount(null);
                        }
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        that.setCount(null);
                    }
                });
            }
        });





        let badge = options.hasOwnProperty('badge') &&
                    ['string', 'number'].indexOf(typeof options.badge) >= 0 &&
                    options.badge.toString().length > 0
            ? options.badge
            : null;

        let urlBadge = options.hasOwnProperty('urlBadge') && typeof options.urlBadge == 'string' && options.urlBadge
            ? options.urlBadge
            : null;

        if (badge === null && urlBadge) {
            $.ajax({
                url: urlBadge,
                method: 'get',
                success: function (result) {

                    try {
                        let response = typeof result === 'string'
                            ? JSON.parse(result)
                            : result;

                        if (coreuiPanelUtils.isObject(response) &&
                            response.hasOwnProperty('badge') &&
                            coreuiPanelUtils.isObject(response.badge)
                        ) {
                            that.setBadge(response.badge);
                        }

                    } catch (e) {
                        // ignore
                    }
                }
            });
        }
    },


    /**
     * Рендер содержимого
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

        let url = '';

        if (options.hasOwnProperty('url') && typeof options.url == 'string' && options.url) {
            url = options.url;

        } else if (options.hasOwnProperty('urlWindow') && typeof options.urlWindow == 'string' && options.urlWindow) {
            url = options.urlWindow;

        } else {
            url = '#';
        }

        let count = options.hasOwnProperty('count') &&
                        ['string', 'number'].indexOf(typeof options.count) >= 0 &&
                        options.count.toString().length > 0
            ? options.count
            : null;

        let badge = options.hasOwnProperty('badge')
            ? coreuiPanelPrivate.renderBadge(options.badge)
            : null;


        return ejs.render(coreuiPanelTpl['tabs/tab.html'], {
            tab: {
                id:       this.getId(),
                title:    title,
                active:   active,
                disabled: disabled,
                url:      url,
                count:    count,
                badge:    badge,
            },
        });
    }
}


export default coreuiPanelTab;