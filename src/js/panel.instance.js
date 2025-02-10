
import 'ejs/ejs.min';
import panelUtils    from './panel.utils';
import panelPrivate  from './panel.private';
import panelTpl      from './panel.tpl';
import panelElements from './panel.elements';


class PanelInstance {

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


    /**
     *
     * @param {object} panelWrapper
     * @param {object} options
     */
    constructor(panelWrapper, options) {

        this._options = $.extend(true, {}, this._options, options);
        this._id      = this._options.hasOwnProperty('id') && typeof this._options.id === 'string' && this._options.id
            ? this._options.id
            : panelUtils.hashCode();


        // Инициализация контролов
        if (this._options.hasOwnProperty('controls') &&
            Array.isArray(this._options.controls) &&
            this._options.controls.length > 0
        ) {
            panelPrivate.initControls(panelWrapper, this, this._options.controls);
        }

        // Инициализация табов
        if (this._options.hasOwnProperty('tabs') &&
            panelUtils.isObject(this._options.tabs) &&
            this._options.tabs.hasOwnProperty('items') &&
            Array.isArray(this._options.tabs.items) &&
            this._options.tabs.items.length > 0
        ) {
            panelPrivate.initTabs(this, this._options.tabs.items);
        }
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

        panelPrivate.trigger(this, 'panel_show');

        if (this._options.content !== null) {
            panelPrivate.trigger(this, 'content_show');
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

        let container = panelElements.getPanel(this.getId());

        if (container[0] && ! container.find('.coreui-panel-lock')[0]) {
            let html = ejs.render(panelTpl['loader.html'], {
                loading: typeof text === 'string' ? text : this.getLang().loading
            });

            container.prepend(html);
        }
    }


    /**
     * Разблокировка панели
     */
    unlock() {

        panelElements.getLock(this.getId()).hide(50, function () {
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
                panelPrivate.trigger(that, 'load_start', that, [ xhr ]);
            },
            success: function (result) {
                panelPrivate.trigger(that, 'load_success', that, [ result ]);
                that.setContent(result);
            },
            error: function(xhr, textStatus, errorThrown) {
                panelPrivate.trigger(that, 'load_error', that, [ xhr, textStatus, errorThrown ]);
                that.setContent('');
            },
            complete: function(xhr, textStatus) {
                that.unlock();
                panelPrivate.trigger(that, 'load_end', that, [ xhr, textStatus ]);
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
     * Получение объекта таба по id
     * @param tabId
     */
    getTabById(tabId) {

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
    }


    /**
     * Получение объекта контрола по его id
     * @param {string} id
     * @return {object}
     */
    getControlById(id) {

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
    }


    /**
     * Размещение содержимого внутри панели
     * @param {string|object|Array} content
     */
    setContent(content) {

        let contents  = panelPrivate.renderContents(this, content);
        let container = panelElements.getContent(this.getId());

        container.html('');

        $.each(contents, function (key, content) {
            container.append(content);
        });

        panelPrivate.trigger(this, 'content_show');
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


        if (this._options.hasOwnProperty('tabs') &&
            panelUtils.isObject(this._options.tabs) &&
            this._options.tabs.hasOwnProperty('items') &&
            Array.isArray(this._options.tabs.items) &&
            this._options.tabs.items.length > 0
        ) {
            tabsContent = panelPrivate.renderTabs(this, this._options.tabs);

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
            ejs.render(panelTpl['container.html'], {
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

        $.each(this._controls, function (key, control) {
            panelElement.find('.coreui-panel-controls').append(panelPrivate.renderControl(that, control));
        });


        if (this._options.contentUrl) {
            this.on('panel_show', function (event) {
                that.loadContent(this._options.contentUrl);
            });

        } else {
            let renderContents = panelPrivate.renderContents(this, this._options.content);

            $.each(renderContents, function (key, content) {
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

export default PanelInstance;