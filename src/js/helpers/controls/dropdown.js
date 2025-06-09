
import DropdownLink    from './dropdown/link';
import DropdownButton  from './dropdown/button';
import DropdownDivider from './dropdown/divider';


/**
 *
 */
class HelperControlDropdown {

    static POSITION_START = 'start';
    static POSITION_END   = 'end';

    _id       = '';
    _content  = '';
    _position = 'end';
    _items    = [];
    _itemIndex = 1;
    _attr     = {
        'class': "btn btn-secondary"
    };


    /**
     @param {string}      content
     @param {string|null} id
     */
    constructor(content, id = null) {

        this.setContent(content);
        this.setId(id || Math.floor(Math.random() * 4294967296).toString());
    }


    /**
     * Установка содержимого кнопки
     * @param {string} content
     * @return {HelperControlDropdown}
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
     * Установка позиции раскрывающегося списка
     * @param {string} position
     * @return {HelperControlDropdown}
     */
    setPosition(position) {
        this._position = position;
        return this;
    }


    /**
     * Получение позиции раскрывающегося списка
     * @return {string}
     */
    getPosition() {
        return this._position;
    }


    /**
     * Установка ID контрола
     * @param {string} id
     * @return {HelperControlDropdown}
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
     * Добавление ссылки
     * @param {string} content
     * @param {string} link
     * @param {string|null} id
     * @return {DropdownLink}
     */
    addItemLink(content, link, id = null) {
        if (!id) {
            id = `item${this._itemIndex}`;
        }

        const item = new DropdownLink(id);
        item.setContent(content);
        item.setLink(link);

        this._items.push(item);
        this._itemIndex++;

        return item;
    }


    /**
     * Добавление кнопки
     * @param {string} content
     * @param {string|null} id
     * @return {DropdownButton}
     */
    addItemButton(content, id = null) {

        if ( ! id) {
            id = `item${this._itemIndex}`;
        }

        const item = new DropdownButton(id);
        item.setContent(content);

        this._items.push(item);
        this._itemIndex++;

        return item;
    }


    /**
     * Добавление разделителя
     * @return {DropdownDivider}
     */
    addItemDivider() {
        const item = new DropdownDivider();

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
            id: this.getId(),
            type: 'dropdown',
            content: this.getContent(),
            position: this.getPosition(),
            attr: this._attr,
            items: items
        };
    }
}

export default HelperControlDropdown;