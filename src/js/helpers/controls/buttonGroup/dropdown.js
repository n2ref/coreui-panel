
import ButtonGroupDropdownLink    from "./dropdown/link";
import ButtonGroupDropdownButton  from "./dropdown/button";
import ButtonGroupDropdownDivider from "./dropdown/divider";


/**
 *
 */
class ButtonGroupDropdown {
    static POSITION_START = 'start';
    static POSITION_END   = 'end';


    _id = '';
    _content = '';
    _position = ButtonGroupDropdown.POSITION_END;
    _items = [];
    _itemIndex = 1;
    _attr = {
        'class': 'btn btn-secondary'
    };

    /**
     * @param {string|null} id
     */
    constructor(id = null) {

        this.setId(id || Math.random().toString(36).substring(2, 11));
    }


    /**
     * Установка содержимого кнопки выпадающего меню
     * @param {string} content
     * @return {ButtonGroupDropdown}
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
     * Установка позиции раскрытия меню
     * @param {string} position
     * @return {ButtonGroupDropdown}
     */
    setPosition(position) {
        this._position = position;
        return this;
    }


    /**
     * Получение позиции раскрытия меню
     * @return {string}
     */
    getPosition() {
        return this._position;
    }


    /**
     * Установка идентификатора
     * @param {string} id
     * @return {ButtonGroupDropdown}
     */
    setId(id) {
        this._id = id;
        return this;
    }


    /**
     * Получение идентификатора
     * @return {string}
     */
    getId() {
        return this._id;
    }


    /**
     * Добавление ссылки в выпадающее меню
     * @param {string} content
     * @param {string} link
     * @param {string|null} id
     * @return {ButtonGroupDropdownLink}
     */
    addItemLink(content, link, id = null) {

        if (!id) {
            id = `item${this._itemIndex}`;
        }

        const item = new ButtonGroupDropdownLink(id);
        item.setContent(content);
        item.setLink(link);

        this._items.push(item);
        this._itemIndex++;

        return item;
    }


    /**
     * Добавление кнопки в выпадающее меню
     * @param {string} content
     * @param {string|null} id
     * @return {ButtonGroupDropdownButton}
     */
    addItemButton(content, id = null) {
        if (!id) {
            id = `item${this._itemIndex}`;
        }

        const item = new ButtonGroupDropdownButton(id);
        item.setContent(content);

        this._items.push(item);
        this._itemIndex++;

        return item;
    }


    /**
     * Добавление разделителя в меню
     * @return {ButtonGroupDropdownDivider}
     */
    addItemDivider() {
        const item = new ButtonGroupDropdownDivider();
        this._items.push(item);
        this._itemIndex++;
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
        const items = this._items.map(item => item.toObject());

        return {
            id: this._id,
            type: 'dropdown',
            content: this._content,
            position: this._position,
            attr: this._attr,
            items: items
        };
    }
}



export default ButtonGroupDropdown;