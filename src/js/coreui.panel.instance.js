
import 'ejs/ejs.min';
import coreuiPanelUtils    from './coreui.panel.utils';
import coreuiPanelPrivate  from './coreui.panel.private';
import coreuiPanelTpl      from './coreui.panel.templates';
import coreuiPanelElements from './coreui.panel.elements';


let panelInstance = {

    _options: {
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
    },

    _id: '',
    _tabs: [],
    _controls: [],
    _events: {},


    /**
     *
     * @param {object} panelWrapper
     * @param {object} options
     */
    _init: function (panelWrapper, options) {

        this._options = $.extend(true, {}, this._options, options);
        this._id      = this._options.hasOwnProperty('id') && typeof this._options.id === 'string' && this._options.id
            ? this._options.id
            : coreuiPanelUtils.hashCode();


        // Инициализация контролов
        if (this._options.hasOwnProperty('controls') &&
            Array.isArray(this._options.controls) &&
            this._options.controls.length > 0
        ) {
            coreuiPanelPrivate.initControls(panelWrapper, this, this._options.controls);
        }

        // Инициализация табов
        if (this._options.hasOwnProperty('tabs') &&
            coreuiPanelUtils.isObject(this._options.tabs) &&
            this._options.tabs.hasOwnProperty('items') &&
            Array.isArray(this._options.tabs.items) &&
            this._options.tabs.items.length > 0
        ) {
            coreuiPanelPrivate.initTabs(this, this._options.tabs.items);
        }
    },


    /**
     * Инициализация событий
     */
    initEvents: function () {

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

        coreuiPanelPrivate.trigger(this, 'panel_show');

        if (this._options.content !== null) {
            coreuiPanelPrivate.trigger(this, 'content_show');
        }
    },


    /**
     * Получение идентификатора
     * @returns {string}
     */
    getId: function () {
        return this._id;
    },


    /**
     * Получение опций
     * @returns {object}
     */
    getOptions: function () {

        return $.extend(true, {}, this._options);
    },


    /**
     * Блокировка панели
     * @param {string} text
     */
    lock: function (text) {

        let container = coreuiPanelElements.getPanel(this.getId());

        if (container[0] && ! container.find('.coreui-panel-lock')[0]) {
            let html = ejs.render(coreuiPanelTpl['loader.html'], {
                loading: typeof text === 'string' ? text : this.getLang().loading
            });

            container.prepend(html);
        }
    },


    /**
     * Разблокировка панели
     */
    unlock: function () {

        coreuiPanelElements.getLock(this.getId()).hide(50, function () {
            $(this).remove()
        });
    },


    /**
     * Загрузка данных и установка их в панель
     * @param url
     */
    loadContent: function (url) {

        let that = this;

        this.lock();

        $.ajax({
            url: url,
            method: 'get',
            beforeSend: function(xhr) {
                coreuiPanelPrivate.trigger(that, 'load_start', that, [ xhr ]);
            },
            success: function (result) {
                coreuiPanelPrivate.trigger(that, 'load_success', that, [ result ]);
                that.setContent(result);
            },
            error: function(xhr, textStatus, errorThrown) {
                coreuiPanelPrivate.trigger(that, 'load_error', that, [ xhr, textStatus, errorThrown ]);
                that.setContent('');
            },
            complete: function(xhr, textStatus) {
                that.unlock();
                coreuiPanelPrivate.trigger(that, 'load_end', that, [ xhr, textStatus ]);
            },
        });
    },


    /**
     * Получение переводов текущего языка
     * @return {object}
     */
    getLang: function () {

        return $.extend(true, {}, this._options.langList);
    },


    /**
     * Получение объекта таба по id
     * @param tabId
     */
    getTabById: function (tabId) {

        let result = null;

        $.each(this._tabs, function (key, tab) {
            if (tab.hasOwnProperty('getId') &&
                typeof tab.getId === 'function' &&
                tab.getId() === tabId
            ) {
                result = tab;
                return false;
            }
        });

        return result;
    },


    /**
     * Получение объекта контрола по его id
     * @param {string} id
     * @return {object}
     */
    getControlById: function (id) {

        let result = null;

        $.each(this._controls, function (key, control) {
            if (control.hasOwnProperty('getId') &&
                typeof control.getId === 'function' &&
                control.getId() === id
            ) {
                result = control;
                return false;
            }
        });

        return result;
    },


    /**
     * Размещение содержимого внутри панели
     * @param {string|object|Array} content
     */
    setContent: function (content) {

        let contents  = coreuiPanelPrivate.renderContents(this, content);
        let container = coreuiPanelElements.getContent(this.getId());

        container.html('');

        $.each(contents, function (key, content) {
            container.append(content);
        });

        coreuiPanelPrivate.trigger(this, 'content_show');
    },


    /**
     *
     * @param element
     * @returns {*}
     */
    render: function(element) {

        let that         = this;
        let tabsContent  = null;
        let tabsPosition = 'top-left';
        let tabsWidth    = '200px';
        let fitContent   = '';
        let wrapperType  = '';


        if (this._options.hasOwnProperty('tabs') &&
            coreuiPanelUtils.isObject(this._options.tabs) &&
            this._options.tabs.hasOwnProperty('items') &&
            Array.isArray(this._options.tabs.items) &&
            this._options.tabs.items.length > 0
        ) {
            tabsContent = coreuiPanelPrivate.renderTabs(this, this._options.tabs);

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
            ejs.render(coreuiPanelTpl['container.html'], {
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


        if (this._options.contentUrl) {
            this.on('panel_show', function (event) {
                that.loadContent(this._options.contentUrl);
            });

        } else {
            let renderContents = coreuiPanelPrivate.renderContents(this, this._options.content);

            $.each(renderContents, function (key, content) {
                panelElement.find('.coreui-panel-content').append(content);
            });


            $.each(this._controls, function (key, control) {
                panelElement.find('.coreui-panel-controls').append(coreuiPanelPrivate.renderControl(that, control));
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
    },


    /**
     * Регистрация функции на событие
     * @param eventName
     * @param callback
     * @param context
     */
    on: function(eventName, callback, context) {
        if (typeof this._events[eventName] !== 'object') {
            this._events[eventName] = [];
        }
        this._events[eventName].push({
            context : context || this,
            callback: callback,
            singleExec: false,
        });
    },


    /**
     * Регистрация функции на событие
     * @param eventName
     * @param callback
     * @param context
     */
    one: function(eventName, callback, context) {
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

export default panelInstance;