
CoreUI.panel.instance = {

    _options: {
        id: '',
        title: null,
        subtitle: null,
        backUrl: null,
        controls: null,
        tabs: [],
        tabsType: 'tabs', // pills, underline
        tabsPosition: 'top-left', // top-center, top-right, left, left-sideways, right, right-sideways
        containerClasses: '',
        tabsWidth: 200,
        tabsFill: '', // fill, justify
    },
    _events: {},


    /**
     *
     * @param options
     */
    _init: function (options) {

        this._options = $.extend({}, this._options, options);
        this._events  = {};

        if ( ! this._options.id) {
            this._options.id = CoreUI.panel._hashCode();
        }

        switch (this._options.tabsPosition) {
            case 'top-left' :       this._options.containerClasses = ''; break;
            case 'top-center' :     this._options.containerClasses = 'justify-content-center'; break;
            case 'top-right' :      this._options.containerClasses = 'justify-content-end'; break;
            case 'left' :           this._options.containerClasses = 'left-tabs'; break;
            case 'left-sideways' :  this._options.containerClasses = 'left-tabs sideways-tabs'; break;
            case 'right' :          this._options.containerClasses = 'right-tabs'; break;
            case 'right-sideways' : this._options.containerClasses = 'right-tabs sideways-tabs'; break;
            default :               this._options.containerClasses = '';
        }


        if (this._options.tabsType === 'tabs' ||
            this._options.tabsType === 'pills'
        ) {
            this._options.containerClasses += ' gap-1'
        }
    },


    /**
     *
     */
    initEvents: function () {

        this._trigger('shown.coreui.panel');

        let element = $('#coreui-panel-' + this._options.id);
        let panel   = this;

        // Загрузка табов ajax
        if (this._options.tabs.length > 0) {
            this.on('click-tab.coreui.panel', function (tab, event) {

                if (tab.url && tab.url !== '#') {
                    $.ajax({
                        url: tab.url,
                        method: 'get',
                        beforeSend: function(xhr) {
                            panel._trigger('start-load-content.coreui.panel', panel, [ tab, xhr ]);
                        },
                        success: function (result) {
                            panel._trigger('success-load-content.coreui.panel', panel, [ tab, result ]);

                            let content = panel._renderContent(result);
                            panel.setContent(content);
                        },
                        error: function(xhr, textStatus, errorThrown) {
                            panel._trigger('error-load-content.coreui.panel', panel, [ tab, xhr, textStatus, errorThrown ]);
                        },
                        complete: function(xhr, textStatus) {
                            panel._trigger('end-load-content.coreui.panel', panel, [ tab, xhr, textStatus ]);
                        },
                    });
                }
            });
        }

        if (element[0]) {
            $('.nav-link:not(.dropdown-toggle)', element).click(function (event) {
                let tabId = $(this).data('tab-id') || '';
                let tab   = null;

                $.each(panel._options.tabs, function (key, tabItem) {
                    if (tabItem.hasOwnProperty('id') &&
                        tabItem.id.toString() === tabId.toString()
                    ) {
                        tab = Object.assign({}, tabItem);
                        return false;
                    }
                });

                panel._trigger('click-tab.coreui.panel', this, [ tab, event ]);

                if (tab.url === '#') {
                    return false;
                }
            })

            $('.dropdown-item', element).click(function (event) {
                let tabId = $(this).data('tab-id') || '';
                let tab   = null;

                $.each(panel._options.tabs, function (key, tabItem) {
                    if (tabItem.hasOwnProperty('type') &&
                        tabItem.hasOwnProperty('items') &&
                        tabItem.type === 'dropdown' &&
                        tabItem.items.length > 0
                    ) {
                        $.each(tabItem.items, function (key, item) {
                            if (item.hasOwnProperty('id') &&
                                item.id.toString() === tabId.toString()
                            ) {
                                tab = Object.assign({}, item);
                                return false;
                            }
                        });
                    }
                });

                panel._trigger('click-tab.coreui.panel', this, [ tab, event ]);

                if (tab.url === '#') {
                    return false;
                }
            })
        }
    },


    /**
     *
     * @returns {*}
     */
    getId: function () {
        return this._options.id;
    },


    /**
     * @param content
     * @returns {*}
     */
    setContent: function (content) {

        content = this._renderContent(content);

        $('#coreui-panel-' + this._options.id + ' .card-content').html(content);
        this._trigger('show-content.coreui.panel');
    },


    /**
     *
     * @param element
     * @returns {*}
     */
    render: function(element) {

        this._options.renderContent = this._renderContent(this._options.content);

        if (typeof this._options.tabs === 'object' && Array.isArray(this._options.tabs)) {
            let tabProps = {
                id: '',
                type: 'tab',
                title: '',
                url: '#',
                active: false,
                disabled: false,
            };
            let tabDropdownProps = {
                type: 'dropdown',
                title: '',
                active: false,
                disabled: false,
                items: [],
            };
            let tabDropdownItem = {
                id: '',
                type: 'item',
                title: '',
                url: '#',
                active: false,
                disabled: false
            };

            for (let i = 0; i < this._options.tabs.length; i++) {
                let tabType = this._options.tabs[i].hasOwnProperty('type') && typeof this._options.tabs[i].type === 'string'
                    ? this._options.tabs[i].type
                    : 'tab';

                switch (tabType) {
                    case 'tab':
                    default:
                        this._options.tabs[i] = Object.assign({}, tabProps, this._options.tabs[i]);

                        if ( ! this._options.tabs[i].id) {
                            this._options.tabs[i].id = CoreUI.panel._hashCode();
                        }
                        break;

                    case 'dropdown':
                        this._options.tabs[i] = Object.assign({}, tabDropdownProps, this._options.tabs[i]);

                        for (let j = 0; j < this._options.tabs[i].items.length; j++) {
                            let tabType = this._options.tabs[i].items[j].hasOwnProperty('type') && typeof this._options.tabs[i].items[j].type === 'string'
                                ? this._options.tabs[i].items[j].type
                                : 'item';

                            switch (tabType) {
                                case 'item':
                                default:
                                    this._options.tabs[i].items[j] = Object.assign({}, tabDropdownItem, this._options.tabs[i].items[j]);

                                    if ( ! this._options.tabs[i].items[j].id) {
                                        this._options.tabs[i].items[j].id = CoreUI.panel._hashCode();
                                    }
                                    break;

                                case 'divider':
                                    this._options.tabs[i].items[j] = { type: "divider" };
                                    break;
                            }
                        }
                        break;
                }
            }
        }

        this._options.tabsContent = CoreUI.panel.ejs.render(CoreUI.panel.tpl['tabs.html'], this._options);

        let html = CoreUI.panel.ejs.render(CoreUI.panel.tpl['container.html'], this._options);

        if (element === undefined) {
            return html;
        }

        // Dom element
        let domElement = {};

        if (typeof element === 'string') {
            domElement = document.getElementById(element);

            if ( ! domElement) {
                return '';
            }

        } else if (element instanceof HTMLElement) {
            domElement = element;
        }


        domElement.innerHTML = html;

        this.initEvents();
        this._trigger('show-content.coreui.panel');
    },


    /**
     * @param eventName
     * @param callback
     * @param context
     * @param singleExec
     */
    on: function(eventName, callback, context, singleExec) {
        if (typeof this._events[eventName] !== 'object') {
            this._events[eventName] = [];
        }
        this._events[eventName].push({
            context : context || this,
            callback: callback,
            singleExec: !! singleExec,
        });
    },


    /**
     * @param name
     * @param context
     * @param params
     * @private
     */
    _trigger: function(name, context, params) {

        params = params || [];

        if (this._events[name] instanceof Object && this._events[name].length > 0) {
            for (var i = 0; i < this._events[name].length; i++) {
                let callback = this._events[name][i].callback;

                context = context || this._events[name][i].context;

                callback.apply(context, params);

                if (this._events[name][i].singleExec) {
                    this._events[name].splice(i, 1);
                }
            }
        }
    },


    /**
     *
     * @param data
     * @returns {string}
     * @private
     */
    _renderContent: function(data) {

        let result          = [];
        let alloyComponents = [
            'coreui.table',
            'coreui.form',
            'coreui.layout',
            'coreui.panel',
            'coreui.tabs',
            'coreui.alert',
            'coreui.chart',
        ];

        if (typeof data === 'string') {
            result.push(data);

        } else if (data instanceof Object) {
            if ( ! Array.isArray(data)) {
                data = [ data ];
            }

            for (let i = 0; i < data.length; i++) {
                if (typeof data[i] === 'string') {
                    result.push(data[i]);

                } else {
                    if ( ! Array.isArray(data[i]) &&
                        data[i].hasOwnProperty('component') &&
                        alloyComponents.indexOf(data[i].component) >= 0
                    ) {
                        let name     = data[i].component.split('.')[1];
                        let instance = CoreUI[name].create(data[i]);
                        result.push(instance.render());

                        this.on('shown.coreui.panel', instance.initEvents, instance, true);

                    } else {
                        result.push(JSON.stringify(data[i]));
                    }
                }
            }
        }

        return result.join('');
    }
}