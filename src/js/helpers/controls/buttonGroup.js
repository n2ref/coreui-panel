import ButtonGroupButton   from "./buttonGroup/button";
import ButtonGroupDropdown from "./buttonGroup/dropdown";
import ButtonGroupLink     from "./buttonGroup/link";

/**
 *
 */
class HelperControlButtonGroup {

    _id = '';
    _buttons = [];
    _btnIndex = 1;
    _attr = {
        'class': "btn-group"
    };


    /**
     * @param {string|null} id
     */
    constructor(id = null) {

        this.setId(id || Math.floor(Math.random() * 4294967296).toString());
    }


    /**
     * Установка ID контрола
     * @param {string} id
     */
    setId(id) {
        this._id = id;
    }


    /**
     * Получение ID контрола
     * @return {string}
     */
    getId() {
        return this._id;
    }


    /**
     * Добавление ссылки
     * @param {string} content
     * @param {string} link
     * @param {string|null} id
     * @return {ButtonGroupLink}
     */
    addBtnLink(content, link, id = null) {
        if ( ! id) {
            id = `btn${this._btnIndex}`;
        }

        const item = new ButtonGroupLink(id);
        item.setContent(content);
        item.setLink(link);

        this._buttons.push(item);
        this._btnIndex++;

        return item;
    }


    /**
     * Добавление кнопки
     * @param {string} content
     * @param {string|null} id
     * @return {ButtonGroupButton}
     */
    addBtnButton(content, id = null) {

        if ( ! id) {
            id = `btn${this._btnIndex}`;
        }

        const item = new ButtonGroupButton(id);
        item.setContent(content);

        this._buttons.push(item);
        this._btnIndex++;

        return item;
    }


    /**
     * Добавление выпадающего меню
     * @param {string} content
     * @param {string|null} id
     * @return {ButtonGroupDropdown}
     */
    addBtnDropdown(content, id = null) {

        if ( ! id) {
            id = `btn${this._btnIndex}`;
        }

        const item = new ButtonGroupDropdown(id);
        item.setContent(content);

        this._buttons.push(item);
        this._btnIndex++;

        return item;
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
        const buttons = this._buttons.map(button => button.toObject());

        return {
            id: this.getId(),
            type: 'buttonGroup',
            buttons: buttons,
            attr: this._attr
        };
    }
}

export default HelperControlButtonGroup;