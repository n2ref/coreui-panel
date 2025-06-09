
/**
 *
 */
class HelperControlButton {

    _id = '';
    _content = '';
    _onclick = '';
    _attr = {
        'class': "btn btn-outline-secondary"
    };


    /**
     * @param {string}      content
     * @param {string|null} id
     */
    constructor(content, id = null) {

        this.setContent(content);
        this.setId(id || String(Math.abs(Math.floor(Math.random() * 4294967295))));
    }


    /**
     * Установка содержимого кнопки
     * @param {string} content
     * @return {HelperControlButton}
     */
    setContent(content) {
        this._content = content;
        return this;
    }


    /**
     * Получение содержимого кнопки
     * @return {string}
     */
    getContent() {
        return this._content;
    }


    /**
     * Установка js функции выполняющейся при клике
     * @param {function|string} onclick
     * @return {HelperControlButton}
     */
    setOnClick(onclick) {
        this._onclick = onclick;
        return this;
    }


    /**
     * Получение js функции выполняющейся при клике
     * @return {string}
     */
    getOnClick() {
        return this._onclick;
    }


    /**
     * Установка ID контрола
     * @param {string} id
     * @return {HelperControlButton}
     */
    setId(id) {
        this._id = id;
        return this;
    }


    /**
     * Получение ID контрола
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
     * Получение значения атрибута
     * @param {string} name
     * @return {string|null}
     */
    getAttr(name) {
        return this._attr[name] || null;
    }


    /**
     * Преобразование в объект
     * @return {Object}
     */
    toObject() {
        return {
            id: this.getId(),
            type: 'button',
            content: this.getContent(),
            onClick: this.getOnClick(),
            attr: this._attr
        };
    }
}


export default HelperControlButton;