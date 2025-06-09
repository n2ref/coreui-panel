import AbstractTab  from "../tab";
import DropdownItem from "./dropdown/item";


class HelperTabDropdown extends AbstractTab {

    _items = [];


    /**
     * @param {string} title
     */
    constructor(title) {
        super();

        this.setTitle(title);
    }


    /**
     * Add item to the dropdown list
     * @param {string} title
     * @param {string|null} id
     * @return {DropdownItem}
     */
    addItem(title, id = null) {

        const item = new DropdownItem(id, title);
        this._items.push(item);
        return item;
    }


    /**
     * Add divider to the dropdown
     * @return {void}
     */
    addDivider() {
        this._items.push({
            type: 'divider'
        });
    }


    /**
     * Get dropdown items
     * @return {Array}
     */
    getItems() {
        return this._items;
    }


    /**
     * Установка активности для таба
     * @param {string} tabId
     */
    setActiveItem(tabId) {

        this._items.map(function (item) {
            if (item.getId() === tabId) {
                item.setActive(true);
            }
        });
    }


    /**
     * Convert dropdown to object
     * @return {Object}
     */
    toObject() {

        const result = super.toObject();
        result.type  = 'dropdown';


        result.items = this._items.map(item => {
            return typeof item.toObject === 'function'
                ? item.toObject()
                : item;
        });

        return result;
    }
}


export default HelperTabDropdown;