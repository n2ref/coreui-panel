
/**
 *
 */
class ButtonGroupDropdownLink {

    _id = '';
    _content = '';
    _link = '';

    /**
     * Конструктор класса
     * @param {string|null} id - Идентификатор ссылки (если не указан, будет сгенерирован автоматически)
     */
    constructor(id = null) {

        if (id) {
            this._id = id;
        } else {
            this._id = 'link-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
        }
    }


    /**
     * Установка идентификатора ссылки
     * @param {string} id - Новый идентификатор
     */
    setId(id) {
        this._id = id;
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
     * @return {ButtonGroupDropdownLink} Возвращает текущий экземпляр для цепочки вызовов
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
     * @return {ButtonGroupDropdownLink} Возвращает текущий экземпляр для цепочки вызовов
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
     * Преобразование ссылки в объект
     * @return {Object} Объект с данными ссылки
     */
    toObject() {
        return {
            id: this._id,
            type: 'link',
            content: this._content,
            link: this._link
        };
    }
}


export default ButtonGroupDropdownLink;