
import 'ejs/ejs.min';
import PanelUtils    from './utils';
import PanelPrivate  from './private';
import Tpl           from './tpl';
import PanelElements from './elements';
import Controller    from "./controller";
import Utils         from "./utils";

import HelperTab         from "./helpers/tabs/tab";
import HelperTabDropdown from "./helpers/tabs/dropdown";

import HelperControlButton      from "./helpers/controls/button";
import HelperControlButtonGroup from "./helpers/controls/buttonGroup";
import HelperControlCustom      from "./helpers/controls/custom";
import HelperControlDropdown    from "./helpers/controls/dropdown";
import HelperControlLink        from "./helpers/controls/link";


class Panel {

    _options = {
        id: '',
        lang: 'en',
        langList: {},
        title: null,
        subtitle: null,
        controls: [],
        contentFit: null,
        content: null,
        contentUrl: null,
        wrapperType: 'card',
        tabs: {
            type: 'tabs',         // pills, underline
            position: 'top-left', // top-center, top-right, left, right
            width: 200,
            fill: '', // fill, justify
            items: []
        }
    }

    _id = '';
    _tabs = [];
    _controls = [];
    _events = {};
    _controller = null;


    controls = {
        button :      function (content, id = null)       { return new HelperControlButton(content, id); },
        buttonGroup : function (id = null)                { return new HelperControlButtonGroup(id); },
        custom :      function (content, id = null)       { return new HelperControlCustom(content, id); },
        dropdown :    function (content, id = null)       { return new HelperControlDropdown(content, id); },
        link :        function (content, link, id = null) { return new HelperControlLink(content, link, id); },
    };


    /**
     *
     * @param {object} options
     */
    constructor(options) {

        this._controller = Controller;

        options = Utils.isObject(options) ? options : {};

        this._options = $.extend(true, this._options, options);


        this._id      = this._options.hasOwnProperty('id') && typeof this._options.id === 'string' && this._options.id
            ? this._options.id
            : PanelUtils.hashCode();
    }


    /**
     * Инициализация событий
     */
    initEvents() {

        let that = this;

        this.on('tab_click', function (tab, event) {

            let options    = tab.getOptions();
            let urlContent = options.hasOwnProperty('urlContent') && typeof options.urlContent == 'string' && options.urlContent
                ? options.urlContent
                : '#';

            if (urlContent && urlContent !== '#') {
                that.loadContent(urlContent);
            }


            let urlWindow = options.hasOwnProperty('urlWindow') && typeof options.urlWindow == 'string' && options.urlWindow
                ? options.urlWindow
                : null;

            if (urlWindow) {
                window.history.pushState({ path:urlWindow }, '', urlWindow);
            }
        });

        PanelPrivate.trigger(this, 'panel_show');

        if (this._options.content !== null) {
            PanelPrivate.trigger(this, 'content_show');
        }
    }


    /**
     * Получение идентификатора
     * @returns {string}
     */
    getId() {
        return this._id;
    }


    /**
     * Получение опций
     * @returns {object}
     */
    getOptions() {

        return $.extend(true, {}, this._options);
    }


    /**
     * Блокировка панели
     * @param {string} text
     */
    lock(text) {

        let container = PanelElements.getPanel(this.getId());

        if (container[0] && ! container.find('.coreui-panel-lock')[0]) {
            let html = ejs.render(Tpl['loader.html'], {
                loading: typeof text === 'string' ? text : this.getLang().loading
            });

            container.prepend(html);
        }
    }


    /**
     * Разблокировка панели
     */
    unlock() {

        PanelElements.getLock(this.getId()).hide(50, function () {
            $(this).remove()
        });
    }


    /**
     * Загрузка данных и установка их в панель
     * @param {string}      url
     * @param {string|null} urlWindow
     */
    loadContent(url, urlWindow) {

        let that = this;

        this.lock();

        if (typeof urlWindow === 'string') {
            window.history.pushState({ path:urlWindow }, '', urlWindow);
        }

        $.ajax({
            url: url,
            method: 'get',
            beforeSend: function(xhr) {
                PanelPrivate.trigger(that, 'load_start', that, [ xhr ]);
            },
            success: function (result) {
                PanelPrivate.trigger(that, 'load_success', that, [ result ]);
                that.setContent(result);
            },
            error: function(xhr, textStatus, errorThrown) {
                PanelPrivate.trigger(that, 'load_error', that, [ xhr, textStatus, errorThrown ]);
                that.setContent('');
            },
            complete: function(xhr, textStatus) {
                that.unlock();
                PanelPrivate.trigger(that, 'load_end', that, [ xhr, textStatus ]);
            },
        });
    }


    /**
     * Получение переводов текущего языка
     * @return {object}
     */
    getLang() {

        return $.extend(true, {}, this._options.langList);
    }


    /**
     * Установка заголовка
     * @param {string} title
     * @param {string} subtitle
     */
    setTitle(title, subtitle) {

        this._options.title    = title;
        this._options.subtitle = subtitle;
    }


    /**
     * Установка правила для отображения обертки в панели
     * @param {string} wrapperType
     */
    setWrapperType(wrapperType) {

        this._options.wrapperType = wrapperType
    }


    /**
     * Правило для отображения панели относительно ее содержимого
     * @param {string} contentFit
     */
    setContentFit(contentFit) {

        this._options.contentFit = contentFit
    }


    /**
     * Установка вида табов
     * @param {string} type
     */
    setTabType(type) {

        this._options.tabs.type = type
    }


    /**
     * Установка состояния табов
     * @param {string} fill
     */
    setTabFill(fill) {

        this._options.tabs.fill = fill
    }


    /**
     * Установка положения табов
     * @param {string} position
     */
    setTabPosition(position) {

        this._options.tabs.position = position
    }


    /**
     * Установка ширины табов
     * @param {string} width
     */
    setTabsWidth(width) {

        this._options.tabs.width = width
    }


    /**
     * Установка ширины табов
     * @param {string} tabId
     */
    setTabActive(tabId) {

        if (this._options.tabs &&
            this._options.tabs.items &&
            Array.isArray(this._options.tabs.items)
        ) {
            let isActive = false;

            this._options.tabs.items.map(function (tab) {

                if (isActive) {
                    return;
                }

                if (tab) {
                    if (tab.constructor) {
                        if (typeof tab.setActive === 'function') {
                            if (tab.getId() === tabId) {
                                tab.setActive(true);
                                isActive = true;
                            }

                        } else if (typeof tab.getItems === 'function') {
                            tab.getItems().map(function (item) {
                                if (item.getId() === tabId) {
                                    item.setActive(true);
                                    isActive = true;
                                }
                            });
                        }

                    } else if (PanelUtils.isObject(tab)) {
                        if (tab._id === tabId) {
                            tab.active = true;
                            isActive = true;
                        }
                    }
                }
            });
        }
    }


    /**
     * Добавление таба
     * @param {string} id
     * @param {string} title
     * @param {string} url
     * @return {HelperTab}
     */
    addTab(id, title, url) {

        let tab = new HelperTab(id);

        if (title) {
            tab.setTitle(title);
        }

        if (url) {
            tab.setUrl(url);
        }

        if ( ! this._options.tabs) {
            this._options.tabs = {};
        }
        if ( ! this._options.tabs.items) {
            this._options.tabs.items = [];
        }

        this._options.tabs.items.push(tab);

        return tab;
    }


    /**
     * Добавление таба
     * @param {string} title
     * @return HelperTabDropdown
     */
    addTabDropdown(title) {

        let dropdown = new HelperTabDropdown(title);

        if ( ! this._options.tabs) {
            this._options.tabs = {};
        }
        if ( ! this._options.tabs.items) {
            this._options.tabs.items = [];
        }

        this._options.tabs.items.push(dropdown);

        return dropdown;
    }


    /**
     * Установка элементов управления
     * @param {Array} controls
     */
    addControls(controls) {

        if ( ! Array.isArray(controls)) {
            return;
        }

        if ( ! Array.isArray(this._options.controls)) {
            this._options.controls = [];
        }


        let that = this;

        controls.map(function (control) {

            if (control && control.constructor) {
                if (control.constructor.name && typeof control.toObject === 'function') {
                    that._options.controls.push(control.toObject());
                }

            } else if (PanelUtils.isObject(control)) {
                that._options.controls.push(control);
            }
        });
    }


    /**
     * Получение объекта таба по id
     * @param tabId
     */
    getTabById(tabId) {

        let result = null;

        this._tabs.map(function (tab) {
            if (tab.hasOwnProperty('getId') &&
                typeof tab.getId === 'function' &&
                tab.getId() === tabId
            ) {
                result = tab;
            }
        });

        return result;
    }


    /**
     * Получение объекта контрола по его id
     * @param {string} id
     * @return {object}
     */
    getControlById(id) {

        let result = null;

        this._controls.map(function (control) {
            if (control.hasOwnProperty('getId') &&
                typeof control.getId === 'function' &&
                control.getId() === id
            ) {
                result = control;
            }
        });

        return result;
    }


    /**
     * Установка содержимого для контейнера
     * @param {string} url
     */
    setContentUrl(url) {

        this._options.contentUrl = url
    }


    /**
     * Размещение содержимого внутри панели
     * @param {string|object|Array} content
     */
    setContent(content) {

        let container = PanelElements.getContent(this.getId());

        if (container[0]) {
            let contents  = PanelPrivate.renderContents(this, content);

            container.html('');

            contents.map(function (content) {
                container.append(content);
            });

            PanelPrivate.trigger(this, 'content_show');

        } else {
            this._options.content = content;
        }
    }


    /**
     *
     * @param element
     * @returns {*}
     */
    render(element) {

        let that         = this;
        let tabsContent  = null;
        let tabsPosition = 'top-left';
        let tabsWidth    = '200px';
        let fitContent   = '';
        let wrapperType  = '';


        if ( ! this._options.hasOwnProperty('lang')) {
            this._options.lang = this._controller.getSetting('lang');
        }

        let langList = this._controller.lang.hasOwnProperty(this._options.lang)
            ? this._controller.lang[this._options.lang]
            : {};

        this._options.langList = this._options.hasOwnProperty('langList') && PanelUtils.isObject(this._options.langList)
            ? $.extend(true, {}, langList, this._options.langList)
            : langList;


        // Инициализация контролов
        if (this._options.hasOwnProperty('controls') &&
            Array.isArray(this._options.controls) &&
            this._options.controls.length > 0
        ) {
            PanelPrivate.initControls(this, this._options.controls);
        }

        // Инициализация табов
        if (this._options.hasOwnProperty('tabs') &&
            PanelUtils.isObject(this._options.tabs) &&
            this._options.tabs.hasOwnProperty('items') &&
            Array.isArray(this._options.tabs.items) &&
            this._options.tabs.items.length > 0
        ) {
            PanelPrivate.initTabs(this, this._options.tabs.items);
        }


        if (this._options.hasOwnProperty('tabs') &&
            PanelUtils.isObject(this._options.tabs) &&
            this._options.tabs.hasOwnProperty('items') &&
            Array.isArray(this._options.tabs.items) &&
            this._options.tabs.items.length > 0
        ) {
            tabsContent = PanelPrivate.renderTabs(this, this._options.tabs);

            tabsPosition = this._options.tabs.hasOwnProperty('position') && typeof this._options.tabs.position === 'string'
                ? this._options.tabs.position
                : 'top-left';

            if (this._options.tabs.hasOwnProperty('width') &&
                ['string', 'number'].indexOf(typeof this._options.tabs.width) &&
                this._options.tabs.width
            ) {
                let unit  = typeof this._options.tabs.width === 'number' ? 'px' : '';
                tabsWidth = this._options.tabs.width + unit;
            }
        }


        if (this._options.hasOwnProperty('contentFit') &&
            typeof this._options.contentFit === 'string'
        ) {
            switch (this._options.contentFit) {
                case 'fit': fitContent = ' coreui-panel__content-fit'; break;
                case 'min': fitContent = ' coreui-panel__content-min'; break;
                case 'max': fitContent = ' coreui-panel__content-max'; break;
            }
        }

        if (this._options.hasOwnProperty('wrapperType') &&
            typeof this._options.wrapperType === 'string'
        ) {
            if (this._options.wrapperType === 'card') {
                wrapperType = ' card shadow-sm';
            }
        }

        let panelElement = $(
            ejs.render(Tpl['container.html'], {
                issetControls: !! this._controls.length,
                id: this.getId(),
                title: this._options.title,
                subtitle: this._options.subtitle,
                fit: fitContent,
                wrapperType: wrapperType,
                tabs: {
                    content: tabsContent,
                    position: tabsPosition,
                    width: tabsWidth,
                }
            })
        );

        this._controls.map(function (control) {
            panelElement.find('.coreui-panel-controls').append(
                PanelPrivate.renderControl(that, control)
            );
        });


        if (this._options.contentUrl) {
            this.on('panel_show', function (event) {
                that.loadContent(this._options.contentUrl);
            });

        } else {
            let renderContents = PanelPrivate.renderContents(this, this._options.content);

            renderContents.map(function (content) {
                panelElement.find('.coreui-panel-content').append(content);
            });
        }

        if (element === undefined) {
            return panelElement;
        }

        // Dom element
        let domElement = null;

        if (typeof element === 'string') {
            domElement = document.getElementById(element);

        } else if (element instanceof HTMLElement) {
            domElement = element;
        }

        if (domElement) {
            $(domElement).html(panelElement);
            this.initEvents();
        }
    }


    /**
     * Регистрация функции на событие
     * @param eventName
     * @param callback
     * @param context
     */
    on(eventName, callback, context) {
        if (typeof this._events[eventName] !== 'object') {
            this._events[eventName] = [];
        }
        this._events[eventName].push({
            context : context || this,
            callback: callback,
            singleExec: false,
        });
    }


    /**
     * Регистрация функции на событие
     * @param eventName
     * @param callback
     * @param context
     */
    one(eventName, callback, context) {
        if (typeof this._events[eventName] !== 'object') {
            this._events[eventName] = [];
        }
        this._events[eventName].push({
            context : context || this,
            callback: callback,
            singleExec: true,
        });
    }
}

export default Panel;