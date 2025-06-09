

class HelperControlCustom {

    _id = '';
    _content = '';


    /**
     * @param {string}      content
     * @param {string|null} id
     */
    constructor(content, id = null) {

        this.setContent(content);
        this.setId(id || String(Math.floor(Math.random() * 4294967296)));
    }


    /**
     * Set control ID
     * @param {string} id
     */
    setId(id) {
        this._id = id;
    }


    /**
     * Get control ID
     * @return {string}
     */
    getId() {
        return this._id;
    }


    /**
     * Set control content
     * @param {string} content
     * @return {HelperControlCustom} Returns self for method chaining
     */
    setContent(content) {
        this._content = content;
        return this;
    }


    /**
     * Get control content
     * @return {string}
     */
    getContent() {
        return this._content;
    }


    /**
     * Convert to plain object
     * @return {Object}
     */
    toObject() {

        return {
            id: this.getId(),
            type: 'custom',
            content: this.getContent()
        };
    }
}

export default HelperControlCustom;