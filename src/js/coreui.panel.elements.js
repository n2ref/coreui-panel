
let coreuiPanelElements = {

    /**
     * получение контейнера панели
     * @param panelId
     * @return {*|jQuery|HTMLElement}
     */
    getPanel: function (panelId) {

        return $('#coreui-panel-' + panelId);
    },


    /**
     * Получение контейнера с табов
     * @param panelId
     * @return {*|jQuery|HTMLElement}
     */
    getTabsContainer: function (panelId) {

        return $('#coreui-panel-' + panelId + ' .coreui-panel-tabs');
    },


    /**
     * Получение контейнера таба
     * @param panelId
     * @param tabId
     * @return {*|jQuery|HTMLElement}
     */
    getTabContainer: function (panelId, tabId) {

        return $('#coreui-panel-' + panelId + ' .coreui-panel__tab-' + tabId);
    },


    /**
     * Получение контейнера с количеством таба
     * @param panelId
     * @param tabId
     * @return {*|jQuery|HTMLElement}
     */
    getTabCount: function (panelId, tabId) {

        return $('#coreui-panel-' + panelId + ' .coreui-panel__tab-' + tabId + ' .coreui-panel__tab-count');
    },


    /**
     * Получение контейнера с текстом таба
     * @param panelId
     * @param tabId
     * @return {*|jQuery|HTMLElement}
     */
    getTabTitle: function (panelId, tabId) {

        return $('#coreui-panel-' + panelId + ' .coreui-panel__tab-' + tabId + ' .coreui-panel__tab-title');
    },


    /**
     * Получение контейнера с меткой таба
     * @param panelId
     * @param tabId
     * @return {*|jQuery|HTMLElement}
     */
    getTabBadge: function (panelId, tabId) {

        return $('#coreui-panel-' + panelId + ' .coreui-panel__tab-' + tabId + ' .coreui-panel__tab-badge');
    },


    /**
     * Получение контейнера таба
     * @param panelId
     * @param tabId
     * @return {*|jQuery|HTMLElement}
     */
    getTabItemContainer: function (panelId, tabId) {

        return $('#coreui-panel-' + panelId + ' .coreui-panel__tab-item-' + tabId);
    },


    /**
     * Получение контейнера с текстом таба
     * @param panelId
     * @param tabId
     * @return {*|jQuery|HTMLElement}
     */
    getTabItemTitle: function (panelId, tabId) {

        return $('#coreui-panel-' + panelId + ' .coreui-panel__tab-' + tabId + ' .coreui-panel__tab-item-title');
    },


    /**
     * Получение контейнера с количеством таба
     * @param panelId
     * @param tabId
     * @return {*|jQuery|HTMLElement}
     */
    getTabItemCount: function (panelId, tabId) {

        return $('#coreui-panel-' + panelId + ' .coreui-panel__tab-' + tabId + ' .coreui-panel__tab-item-count');
    },


    /**
     *
     * @param panelId
     * @return {*|jQuery|HTMLElement}
     */
    getContent: function (panelId) {

        return $('#coreui-panel-' + panelId + ' .coreui-panel-content');
    },


    /**
     *
     * @param panelId
     * @param controlId
     * @return {*|jQuery|HTMLElement}
     */
    getControl: function (panelId, controlId) {

        return $('#coreui-panel-' + panelId + ' #coreui-panel-control-' + controlId);
    },


    /**
     * Получение блокировки панели
     * @param {string} panelId
     * @return {jQuery}
     */
    getLock: function (panelId) {

        return $('#coreui-panel-' + panelId + ' > .coreui-panel-lock');
    }
}

export default coreuiPanelElements;