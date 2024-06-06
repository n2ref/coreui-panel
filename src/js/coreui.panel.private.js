
import 'ejs/ejs.min';
import coreuiPanelUtils       from './coreui.panel.utils';
import coreuiPanelTpl         from "./coreui.panel.templates";
import coreuiPanelTab         from "./tabs/coreui.panel.tab";
import coreuiPanelTabDropdown from "./tabs/coreui.panel.tab-dropdown";

let coreuiPanelPrivate = {


    /**
     * @param panel
     * @param name
     * @param context
     * @param params
     */
    trigger: function(panel, name, context, params) {

        params = params || [];

        if (panel._events.hasOwnProperty(name) && panel._events[name].length > 0) {
            for (var i = 0; i < panel._events[name].length; i++) {
                let callback = panel._events[name][i].callback;

                context = panel._events[name][i].context || context;

                callback.apply(context, params);

                if (panel._events[name][i].singleExec) {
                    panel._events[name].splice(i, 1);
                    i--;
                }
            }
        }
    },


    /**
     * Инициализация контролов и фильтров
     * @param {object} panelWrapper
     * @param {object} panel
     * @param {Array}  controls
     * @private
     */
    initControls: function (panelWrapper, panel, controls) {

        let that = this;

        $.each(controls, function (key, control) {

            if (coreuiPanelUtils.isObject(control) && typeof control.type === 'string') {

                if (panelWrapper.controls.hasOwnProperty(control.type)) {
                    let instance = $.extend(true, {}, panelWrapper.controls[control.type]);
                    instance.init(panel, control);

                    panel._controls.push(instance);
                }
            }
        });
    },


    /**
     * Инициализация контролов и фильтров
     * @param {Object} panel
     * @param {Array}  tabItems
     * @private
     */
    initTabs: function (panel, tabItems) {

        $.each(tabItems, function (key, tabItem) {
            if (coreuiPanelUtils.isObject(tabItem)) {

                let instance = null;
                let tabType  = tabItem.hasOwnProperty('type') && typeof tabItem.type === 'string'
                    ? tabItem.type
                    : 'tab';

                if (tabType === 'tab') {
                    instance = $.extend(true, {}, coreuiPanelTab);

                } else if (tabType === 'dropdown') {
                    instance = $.extend(true, {}, coreuiPanelTabDropdown);
                }


                if (instance) {
                    instance._init(panel, tabItem);
                    panel._tabs.push(instance);

                    panel.on('panel_show', function () {
                        instance.initEvents();
                    });
                }
            }
        });
    },


    /**
     * Сборка табов
     * @param {object} panel
     * @param {object} tabs
     */
    renderTabs: function (panel, tabs) {

        let classes      = [];
        let tabsContents = [];

        if (tabs.hasOwnProperty('position') && typeof tabs.position === 'string') {
            switch (tabs.position) {
                case 'top-center':     classes.push('justify-content-center'); break;
                case 'top-right':      classes.push('justify-content-end'); break;
                case 'left':           classes.push('left-tabs'); break;
                case 'right':          classes.push('right-tabs'); break;
            }
        }

        if (tabs.hasOwnProperty('type') &&
            typeof tabs.type === 'string' &&
            ['tabs', 'pills'].indexOf(tabs.type) >= 0
        ) {
            classes.push('gap-1');
        }


        $.each(panel._tabs, function (key, tab) {
            tabsContents.push(tab.render());
        });


        return ejs.render(coreuiPanelTpl['tabs.html'], {
            classes: classes.join(' '),
            type: tabs.hasOwnProperty('type') && typeof tabs.type === 'string' ? tabs.type : '',
            fill: tabs.hasOwnProperty('fill') && typeof tabs.fill === 'string' ? tabs.fill : '',
            tabsContents: tabsContents,
        });
    },


    /**
     * Сборка элемента управления
     * @param {object} panel
     * @param {object} control
     * @private
     * @returns {HTMLElement|jQuery}
     */
    renderControl: function (panel, control) {

        if (coreuiPanelUtils.isObject(control)) {
            let controlElement = $(
                ejs.render(coreuiPanelTpl['panel-control.html'], {
                    id: control.getId()
                })
            );

            controlElement.append(control.render());

            if (control.hasOwnProperty('initEvents') && typeof control.initEvents === 'function') {
                panel.on('panel_show', function () {
                    control.initEvents()
                });
            }

            return controlElement;
        }
    },


    /**
     * Сборка содержимого
     * @param {object} panel
     * @param {*} content
     * @return {string}
     */
    renderContents: function(panel, content) {

        let result = [];

        if (typeof content === 'string') {
            result.push(content);

        } else if (content instanceof Object) {
            if ( ! Array.isArray(content)) {
                content = [ content ];
            }

            for (let i = 0; i < content.length; i++) {
                if (typeof content[i] === 'string') {
                    result.push(content[i]);

                } else {
                    if ( ! Array.isArray(content[i]) &&
                        content[i].hasOwnProperty('component') &&
                        typeof content[i].component === 'string' &&
                        content[i].component.substring(0, 6) === 'coreui'
                    ) {
                        let name = content[i].component.split('.')[1];

                        if (CoreUI.hasOwnProperty(name) &&
                            coreuiPanelUtils.isObject(CoreUI[name])
                        ) {
                            let instance = CoreUI[name].create(content[i]);
                            result.push(instance.render());

                            panel.one('content_show', instance.initEvents, instance);
                        }

                    } else {
                        result.push(JSON.stringify(content[i]));
                    }
                }
            }
        }

        return result;
    },


    /**
     * Создание метки
     * @param {object} badge
     * @return {null}
     * @private
     */
    renderBadge: function (badge) {

        if ( ! coreuiPanelUtils.isObject(badge) ||
             ! badge.hasOwnProperty('text') ||
            ['string', 'number'].indexOf(typeof badge.text) < 0
        ) {
            return '';
        }


        let attr = [];
        let type = badge.hasOwnProperty('type') && typeof badge.type === 'string'
            ? badge.type
            : 'danger';

        let classes = badge.text.toString().length > 0
            ? 'rounded-pill bg-' + type
            : 'rounded-circle p-2 border bg-' + type;

        if (badge.hasOwnProperty('attr') && coreuiPanelUtils.isObject(badge.attr)) {
            if (badge.attr.hasOwnProperty('class') && typeof badge.attr.class === 'string') {
                classes += ' ' + badge.attr.class;
                delete badge.attr.class;
            }

            $.each(badge.attr, function (name, value) {
                if (typeof name === 'string' && ['string', 'number'].indexOf(typeof value) >= 0) {
                    attr.push(name + '="' + value + '"');
                }
            });
        }

        return ejs.render(coreuiPanelTpl['badge.html'], {
            badge: {
                text:    badge.text,
                classes: classes ? ' ' + classes : '',
                attr:    attr.length > 0 ? ' ' + attr.join(' ') : '',
            },
        });
    }
}


export default coreuiPanelPrivate;