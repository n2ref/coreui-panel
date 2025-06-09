
/**
 *
 */
class DropdownItem {

    _id         = '';
    _title      = '';
    _url        = null;
    _urlContent = null;
    _urlCount   = null;
    _urlWindow  = null;
    _count      = null;
    _disabled   = false;
    _active     = false;


    /**
     * @param {string} id
     * @param {string} title
     */
    constructor(id, title) {

        if (id) {
            this._id = id;
        } else {
            this._id = String(Math.abs(Math.floor(Math.random() * 4294967295)));
        }

        this._title = title;
    }


    /**
     * Set item ID
     * @param {string} id
     */
    setId(id) {
        this._id = id;
    }


    /**
     * Get item ID
     * @return {string}
     */
    getId() {
        return this._id;
    }


    /**
     * Set item title
     * @param {string} title
     * @return {DropdownItem}
     */
    setTitle(title) {
        this._title = title;
        return this;
    }


    /**
     * Get item title
     * @return {string}
     */
    getTitle() {
        return this._title;
    }


    /**
     * Set item count
     * @param {string|null} count
     * @return {DropdownItem}
     */
    setCount(count = null) {
        this._count = count;
        return this;
    }


    /**
     * Get item count
     * @return {string|null}
     */
    getCount() {
        return this._count;
    }


    /**
     * Set item URL
     * @param {string|null} url
     * @return {DropdownItem}
     */
    setUrl(url = null) {
        this._url = url;
        return this;
    }


    /**
     * Get item URL
     * @return {string|null}
     */
    getUrl() {
        return this._url;
    }


    /**
     * Set content URL
     * @param {string|null} url
     * @return {DropdownItem}
     */
    setUrlContent(url = null) {
        this._urlContent = url;
        return this;
    }


    /**
     * Get content URL
     * @return {string|null}
     */
    getUrlContent() {
        return this._urlContent;
    }


    /**
     * Set count URL
     * @param {string|null} url
     * @return {DropdownItem}
     */
    setUrlCount(url = null) {
        this._urlCount = url;
        return this;
    }


    /**
     * Get count URL
     * @return {string|null}
     */
    getUrlCount() {
        return this._urlCount;
    }


    /**
     * Set window URL
     * @param {string|null} url
     * @return {DropdownItem}
     */
    setUrlWindow(url = null) {
        this._urlWindow = url;
        return this;
    }


    /**
     * Get window URL
     * @return {string|null}
     */
    getUrlWindow() {
        return this._urlWindow;
    }


    /**
     * Set disabled state
     * @param {boolean} isDisabled
     * @return {DropdownItem}
     */
    setDisabled(isDisabled = true) {
        this._disabled = isDisabled;
        return this;
    }


    /**
     * Set active state
     * @param {boolean} isActive
     * @return {DropdownItem}
     */
    setActive(isActive = true) {
        this._active = isActive;
        return this;
    }


    /**
     * Check if item is active
     * @return {boolean}
     */
    isActive() {
        return this._active;
    }


    /**
     * Convert item to plain object
     * @return {Object}
     */
    toObject() {

        const result = {
            id: this.getId(),
            type: 'tab',
            title: this.getTitle(),
            disabled: this._disabled,
            active: this._active
        };

        const url = this.getUrl();
        if (url !== null) {
            result.url = url;
        }

        const count = this.getCount();
        if (count !== null) {
            result.count = count;
        }

        const urlContent = this.getUrlContent();
        if (urlContent !== null) {
            result.urlContent = urlContent;
        }

        const urlCount = this.getUrlCount();
        if (urlCount !== null) {
            result.urlCount = urlCount;
        }

        const urlWindow = this.getUrlWindow();
        if (urlWindow !== null) {
            result.urlWindow = urlWindow;
        }

        return result;
    }
}

export default DropdownItem;