
import Panel from './panel';
import Utils from './utils';


let Controller = {

    lang: {},
    controls: {},

    _instances: {},
    _settings: {
        lang: 'en',
    },


    /**
     * @param {object} options
     * @returns {Panel}
     */
    create: function (options) {

        options = Utils.isObject(options) ? options : {};

        let instance = new Panel(options);

        let panelId = instance.getId();
        this._instances[panelId] = instance;

        return instance;
    },


    /**
     * @param {string} id
     * @returns {Panel|null}
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

export default Controller;