/**
 *
 */
class ButtonGroupLink {

    _id = '';
    _content = '';
    _link = '';
    _attr = {};


    /**
     * Конструктор класса
     * @param {string|null} id - Идентификатор ссылки (если не указан, будет сгенерирован автоматически)
     */
    constructor(id = null) {
        this.setId(id || Math.random().toString(36).substring(2, 9));
    }


    /**
     * Установка идентификатора ссылки
     * @param {string} id - Новый идентификатор
     * @return {ButtonGroupLink} Возвращает текущий экземпляр для цепочки вызовов
     */
    setId(id) {
        this._id = id;
        return this;
    }


    /**
     * Получение идентификатора ссылки
     * @return {string} Текущий идентификатор
     */
    getId() {
        return this._id;
    }


    /**
     * Установка содержимого ссылки
     * @param {string} content - Текст ссылки
     * @return {ButtonGroupLink} Возвращает текущий экземпляр для цепочки вызовов
     */
    setContent(content) {
        this._content = content;
        return this;
    }


    /**
     * Получение содержимого ссылки
     * @return {string} Текущий текст ссылки
     */
    getContent() {
        return this._content;
    }


    /**
     * Установка URL ссылки
     * @param {string} link - URL адрес
     * @return {ButtonGroupLink} Возвращает текущий экземпляр для цепочки вызовов
     */
    setLink(link) {
        this._link = link;
        return this;
    }


    /**
     * Получение URL ссылки
     * @return {string} Текущий URL
     */
    getLink() {
        return this._link;
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
     * Преобразование ссылки в объект
     * @return {Object} Объект с данными ссылки
     */
    toObject() {

        return {
            id: this._id,
            type: 'link',
            content: this._content,
            link: this._link,
            attr: this._attr
        };
    }
}

export default ButtonGroupLink;