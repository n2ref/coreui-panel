
/**
 *
 */
class ButtonGroupButton {

    _id = '';
    _content = '';
    _onclick = '';
    _attr = {
        'class': 'btn btn-secondary'
    };

    /**
     * Конструктор класса
     * @param {string|null} id - Идентификатор кнопки (если не указан, будет сгенерирован автоматически)
     */
    constructor(id = null) {
        this.setId(id || Math.random().toString(36).substring(2, 11));
    }


    /**
     * Установка содержимого кнопки
     * @param {string} content - Текст кнопки
     * @return {ButtonGroupButton} Возвращает текущий экземпляр для цепочки вызовов
     */
    setContent(content) {
        this._content = content;
        return this;
    }


    /**
     * Получение содержимого кнопки
     * @return {string} Текущий текст кнопки
     */
    getContent() {
        return this._content;
    }


    /**
     * Установка обработчика клика
     * @param {string} onclick - JavaScript код для выполнения при клике
     * @return {ButtonGroupButton} Возвращает текущий экземпляр для цепочки вызовов
     */
    setOnClick(onclick) {
        this._onclick = onclick;
        return this;
    }


    /**
     * Получение обработчика клика
     * @return {string} Текущий обработчик клика
     */
    getOnClick() {
        return this._onclick;
    }


    /**
     * Установка идентификатора кнопки
     * @param {string} id - Новый идентификатор
     * @return {ButtonGroupButton} Возвращает текущий экземпляр для цепочки вызовов
     */
    setId(id) {
        this._id = id;
        return this;
    }


    /**
     * Получение идентификатора кнопки
     * @return {string} Текущий идентификатор
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
     * Преобразование кнопки в объект
     * @return {Object} Объект с данными кнопки
     */
    toObject() {
        return {
            id: this._id,
            type: 'button',
            content: this._content,
            onClick: this._onclick,
            attr: this._attr
        };
    }
}

export default ButtonGroupButton;
