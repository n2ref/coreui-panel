import Utils       from '../utils';
import Private     from '../private';
import Tpl         from "../tpl";
import Elements    from "../elements";
import TabAbstract from "../abstract/tab";


/**
 *
 */
class Tab extends TabAbstract {


    /**
     * Инициализация таба
     * @param {Panel}  panel
     * @param {Object} options
     * @private
     */
    constructor(panel, options) {

        let optionsDefault = {
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
        };

        super(panel, $.extend(true, optionsDefault, options));
    }


    /**
     * Получение опций таба
     * @return {object}
     */
    getOptions() {

        return $.extend(true, {}, this._options);
    }


    /**
     * Установка активного таба
     */
    setActive() {

        let tabTabElement = Elements.getTabContainer(this._panel.getId(), this.getId());

        if (tabTabElement[0]) {
            let tabTabsElement = Elements.getTabsContainer(this._panel.getId());
            tabTabsElement.find('.nav-link').removeClass('active');
            tabTabsElement.find('.nav-link.dropdown-toggle').removeClass('active');
            tabTabsElement.find('.nav-link.dropdown-toggle .dropdown-item').removeClass('active');

            tabTabElement.find('> a').addClass('active');

            Private.trigger(this._panel, 'tab_click', this._panel, [{tab : this}]);
        }
    }


    /**
     * Установка количества
     * @param {number|null} count
     */
    setCount(count) {

        let tabCountElement = Elements.getTabCount(this._panel.getId(), this.getId());

        if (['string', 'number'].indexOf(typeof count) < 0 || count.toString().length === 0) {
            tabCountElement.remove();

        } else {
            if (tabCountElement[0]) {
                tabCountElement.text(' (' + count + ')');

            } else {
                let tabTitleElement = Elements.getTabTitle(this._panel.getId(), this.getId());
                tabTitleElement.after('<span class="coreui-panel__tab-count"> (' + count + ')>');
            }
        }
    }


    /**
     *
     */
    initEvents() {

        let that    = this;
        let options = this.getOptions();

        this._panel.on('panel_show', function () {

            let tabsContainerElement = Elements.getTabContainer(that._panel.getId(), that.getId())

            $('.nav-link', tabsContainerElement).click(function (event) {
                Private.trigger(that._panel, 'tab_click', that, [{ tab : that, event : event  }]);

                if (options.url && options.url !== '#') {
                    location.href = options.url;

                } else {
                    return false;
                }
            });



            let count = options.hasOwnProperty('count') &&
                        ['string', 'number'].indexOf(typeof options._count) >= 0 &&
                        options._count.toString().length > 0
                ? options._count
                : null;

            let urlCount = options.hasOwnProperty('urlCount') && typeof options.urlCount == 'string' && options.urlCount
                ? options.urlCount
                : null;

            if (count === null && urlCount) {
                that.setCount('<div class="spinner-border spinner-border-sm text-secondary"></div>');

                fetch(urlCount)
                    .then(function (response) {
                        return response.json();

                    }).then(function (response) {

                        if (Utils.isObject(response) &&
                            response.hasOwnProperty('count') &&
                            ['string', 'number'].indexOf(typeof response.count) >= 0 &&
                            response.count.toString().length > 0
                        ) {
                            that.setCount(response.count);

                        } else {
                            that.setCount(null);
                        }

                    }).catch(function () {
                        that.setCount(null);
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

            fetch(urlBadge)
                .then(function (response) {
                    return response.json()

                }).then(function (response) {
                    if (Utils.isObject(response) &&
                        response.hasOwnProperty('badge') &&
                        Utils.isObject(response.badge)
                    ) {
                        that.setBadge(response.badge);
                    }

                }).catch(function () {
                    that.setBadge(null);
                });
        }
    }


    /**
     * Рендер содержимого
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
            ? Private.renderBadge(options.badge)
            : null;


        return ejs.render(Tpl['tabs/tab.html'], {
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


export default Tab;