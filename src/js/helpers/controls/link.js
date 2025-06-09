
class HelperControlLink {

    _id      = '';
    _href    = '';
    _content = '';
    _onclick = '';
    _attr    = {};


    /**
     * @param {string}      content
     * @param {string}      href
     * @param {string|null} id
     */
    constructor(content, href, id = null) {

        this.setContent(content);
        this.setHref(href);
        this.setId(id || String(Math.floor(Math.random() * 4294967296)));
    }


    /**
     * Set link content
     * @param {string} content
     * @return {HelperControlLink}
     */
    setContent(content) {
        this._content = content;
        return this;
    }


    /**
     * Get link content
     * @return {string}
     */
    getContent() {
        return this._content;
    }


    /**
     * Set href URL
     * @param {string} href
     * @return {HelperControlLink}
     */
    setHref(href) {
        this._href = href;
        return this;
    }


    /**
     * Get href URL
     * @return {string}
     */
    getHref() {
        return this._href;
    }


    /**
     * Set onClick handler
     * @param {function} onclick
     * @return {HelperControlLink}
     */
    setOnClick(onclick) {
        this._onclick = onclick;
        return this;
    }


    /**
     * Get onClick handler
     * @return {function}
     */
    getOnClick() {
        return this._onclick;
    }


    /**
     * Set control ID
     * @param {string} id
     */
    setId(id) {
        this._id = id;
        return this;
    }


    /**
     * Get control ID
     * @return {string}
     */
    getId() {
        return this._id;
    }


    /**
     * Set multiple attributes
     * @param {Object} attr
     */
    setAttr(attr) {
        for (const [name, value] of Object.entries(attr)) {
            this._attr[name] = value;
        }
        return this;
    }


    /**
     * Get attribute value
     * @param {string} name
     * @return {string|null}
     */
    getAttr(name) {
        return this._attr[name] || null;
    }


    /**
     * Convert to plain object
     * @return {Object}
     */
    toObject() {

        return {
            id: this.getId(),
            type: 'link',
            content: this.getContent(),
            href: this.getHref(),
            onClick: this.getOnClick(),
            attr: this._attr
        };
    }
}

export default HelperControlLink;