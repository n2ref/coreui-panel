/**
 *
 */
class DropdownButton {

    _id = '';
    _content = '';
    _onclick = '';

    /**
      * @param id
     */
    constructor(id = null) {

        this.setId(id || Math.floor(Math.random() * 4294967296).toString());
    }


    /**
     * Установка ID контрола
     * @param {string} id
     * @return {DropdownButton}
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
     * Установка содержимого кнопки
     * @param {string} content
     * @return {DropdownButton}
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
     * Установка JavaScript-функции, выполняющейся при клике
     * @param {string} onclick
     * @return {DropdownButton}
     */
    setOnClick(onclick) {
        this._onclick = onclick;
        return this;
    }


    /**
     * Получение JavaScript-функции, выполняющейся при клике
     * @return {string}
     */
    getOnClick() {
        return this._onclick;
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
            onClick: this.getOnClick()
        };
    }
}

export default DropdownButton;