/**
 *
 */
class DropdownLink {

    _id = '';
    _content = '';
    _link = '';


    /**
     * @param id
     */
    constructor(id = null) {

        this.setId(id || Math.floor(Math.random() * 4294967296).toString());
    }


    /**
     * Установка ID контрола
     * @param {string} id
     * @return {DropdownLink}
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
     * Установка содержимого ссылки
     * @param {string} content
     * @return {DropdownLink}
     */
    setContent(content) {
        this._content = content;
        return this;
    }


    /**
     * Получение содержимого ссылки
     * @return {string}
     */
    getContent() {
        return this._content;
    }


    /**
     * Установка ссылки
     * @param {string} link
     * @return {DropdownLink}
     */
    setLink(link) {
        this._link = link;
        return this;
    }


    /**
     * Получение ссылки
     * @return {string}
     */
    getLink() {
        return this._link;
    }


    /**
     * Преобразование в объект
     * @return {Object}
     */
    toObject() {
        return {
            id: this.getId(),
            type: 'link',
            content: this.getContent(),
            link: this.getLink()
        };
    }
}

export default DropdownLink;