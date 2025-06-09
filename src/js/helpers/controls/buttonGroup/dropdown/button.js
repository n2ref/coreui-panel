

/**
 *
 */
class ButtonGroupDropdownButton {

    _id      = '';
    _content = '';
    _onclick = '';

    /**
     * Конструктор класса
     * @param {string|null} id - Идентификатор кнопки (если не указан, будет сгенерирован автоматически)
     */
    constructor(id = null) {

        this.setId(id || 'btn-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
    }


    /**
     * Установка идентификатора кнопки
     * @param {string} id - Новый идентификатор
     * @return {ButtonGroupDropdownButton} Возвращает текущий экземпляр для цепочки вызовов
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
     * Установка содержимого кнопки
     * @param {string} content - Текст кнопки
     * @return {ButtonGroupDropdownButton} Возвращает текущий экземпляр для цепочки вызовов
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
     * @return {ButtonGroupDropdownButton} Возвращает текущий экземпляр для цепочки вызовов
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
     * Преобразование кнопки в объект
     * @return {Object} Объект с данными кнопки
     */
    toObject() {
        return {
            id: this._id,
            type: 'button',
            content: this._content,
            onClick: this._onclick
        };
    }
}

export default ButtonGroupDropdownButton;