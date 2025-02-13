
import PanelInstance from './panel.instance';


let Panel = {

    lang: {},
    controls: {},

    _instances: {},
    _settings: {
        lang: 'en',
    },


    /**
     * @param {object} options
     * @returns {PanelInstance}
     */
    create: function (options) {

        if ( ! options.hasOwnProperty('lang')) {
            options.lang = this.getSetting('lang');
        }

        let langList     = this.lang.hasOwnProperty(options.lang) ? this.lang[options.lang] : {};
        options.langList = options.hasOwnProperty('langList') && coreuiTabsUtils.isObject(options.langList)
            ? $.extend(true, {}, langList, options.langList)
            : langList;

        let instance = new PanelInstance(this, options instanceof Object ? options : {});

        let panelId = instance.getId();
        this._instances[panelId] = instance;

        return instance;
    },


    /**
     * @param {string} id
     * @returns {PanelInstance|null}
     */
    get: function (id) {

        if ( ! this._instances.hasOwnProperty(id)) {
            return null;
        }

        if ( ! $('#coreui-panel-' + id)[0]) {
            delete this._instances[id];
            return null;
        }

        return this._instances[id];
    },


    /**
     * Установка настроек
     * @param {object} settings
     */
    setSettings: function(settings) {

        this._settings = $.extend(true, {}, this._settings, settings);
    },


    /**
     * Получение значения настройки
     * @param {string} name
     */
    getSetting: function(name) {

        let value = null;

        if (this._settings.hasOwnProperty(name)) {
            value = this._settings[name];
        }

        return value;
    }
}

export default Panel;