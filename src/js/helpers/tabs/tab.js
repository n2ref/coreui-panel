import AbstractTab from "../tab";


class HelperTab extends AbstractTab {

    BADGE_TYPE_DANGER    = 'danger';
    BADGE_TYPE_PRIMARY   = 'primary';
    BADGE_TYPE_SECONDARY = 'secondary';
    BADGE_TYPE_SUCCESS   = 'success';
    BADGE_TYPE_WARNING   = 'warning';
    BADGE_TYPE_INFO      = 'info';
    BADGE_TYPE_LIGHT     = 'light';
    BADGE_TYPE_DARK      = 'dark';

    _url        = null;
    _urlContent = null;
    _urlCount   = null;
    _urlBadge   = null;
    _urlWindow  = null;
    _count      = null;
    _badge      = null;

    /**
     * @param {string} id
     */
    constructor(id) {
        super();

        this.setId(id)
    }


    /**
     * Установка количества для таба
     * @param {string|null} count
     * @return {this}
     */
    setCount(count = null) {
        this._count = count;
        return this;
    }


    /**
     * Получение количества для таба
     * @return {string|null}
     */
    getCount() {
        return this._count;
    }


    /**
     * Установка метки для таба
     * @param {string|null} text
     * @param {string} type
     * @param {array} attr
     * @return {this}
     */
    setBadge(text = null, type = this.BADGE_TYPE_DANGER, attr = []) {

        if (text === null) {
            this._badge = null;

        } else {
            this._badge = {
                text,
                type,
                attr
            };
        }
        return this;
    }


    /**
     * Установка метки для таба в виде точки
     * @param {string} type
     * @param {array} attr
     * @return {this}
     */
    setBadgeDot(type = this.BADGE_TYPE_DANGER, attr = []) {

        this._badge = {
            text: '',
            type,
            attr
        };
        return this;
    }


    /**
     * Получение метки для таба
     * @return {object|null}
     */
    getBadge() {
        return this._badge;
    }


    /**
     * Установка url таба
     * @param {string|null} url
     * @return {this}
     */
    setUrl(url = null) {
        this._url = url;
        return this;
    }


    /**
     * Установка url таба
     * @return {string|null}
     */
    getUrl() {
        return this._url;
    }


    /**
     * Получение метки для таба
     * @param {string|null} url
     * @return {this}
     */
    setUrlContent(url = null) {
        this._urlContent = url;
        return this;
    }


    /**
     * Получение url таба для загрузки содержимого
     * @return {string|null}
     */
    getUrlContent() {
        return this._urlContent;
    }


    /**
     * Установка url количества таба
     * @param {string|null} url
     * @return {this}
     */
    setUrlCount(url = null) {
        this._urlCount = url;
        return this;
    }


    /**
     * Получение url количества таба
     * @return {string|null}
     */
    getUrlCount() {
        return this._urlCount;
    }


    /**
     * Установка url метки таба
     * @param {string|null} url
     * @return {this}
     */
    setUrlBadge(url = null) {
        this._urlBadge = url;
        return this;
    }


    /**
     * Получение url метки таба
     * @return {string|null}
     */
    getUrlBadge() {
        return this._urlBadge;
    }


    /**
     * Установка url для окна браузера
     * @param {string|null} url
     * @return {this}
     */
    setUrlWindow(url = null) {
        this._urlWindow = url;
        return this;
    }


    /**
     * Получение url для окна браузера
     * @return {string|null}
     */
    getUrlWindow() {
        return this._urlWindow;
    }


    /**
     * Convert tab to object
     * @return {object}
     */
    toObject() {

        const result = super.toObject();


        const url = this.getUrl();
        if (url !== null) {
            result.url = url;
        }

        const urlContent = this.getUrlContent();
        if (urlContent !== null) {
            result.urlContent = urlContent;
        }

        const urlWindow = this.getUrlWindow();
        if (urlWindow !== null) {
            result.urlWindow = urlWindow;
        }

        const count = this.getCount();
        if (count !== null) {
            result.count = count;
        }

        const badge = this.getBadge();
        if (badge !== null) {
            result.badge = badge;
        }

        const urlCount = this.getUrlCount();
        if (urlCount !== null) {
            result.urlCount = urlCount;
        }

        const urlBadge = this.getUrlBadge();
        if (urlBadge !== null) {
            result.urlBadge = urlBadge;
        }

        return result;
    }
}


export default HelperTab;