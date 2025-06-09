

class AbstractTab {

    _id       = '';
    _title    = '';
    _disabled = false;
    _active   = false;


    /**
     * @param {string} title
     * @return {AbstractTab}
     */
    setTitle(title) {

        this._title = title;
        return this;
    }


    /**
     * Получение названия таба
     * @return {string}
     */
    getTitle() {
        return this._title;
    }


    /**
     * Установка ID таба
     * @param {string} id
     * @return AbstractTab
     */
    setId(id) {

        this._id = id;
        return this;
    }


    /**
     * Получение ID таба
     * @return {string}
     */
    getId() {
        return this._id;
    }


    /**
     * Установка запрета на переход в таб
     * @param {boolean} isDisabled
     * @return {AbstractTab}
     */
    setDisabled(isDisabled = true) {

        this._disabled = isDisabled;
        return this;
    }


    /**
     * Получение запрета на переход в таб
     * @return {boolean}
     */
    isDisabled() {
        return this._disabled;
    }


    /**
     * Установка информации активен ли таб
     * @param {boolean} isActive
     * @return {AbstractTab}
     */
    setActive(isActive = true) {

        this._active = isActive;
        return this;
    }


    /**
     * Получение информации активен ли таб
     * @return {boolean}
     */
    isActive() {
        return this._active;
    }


    /**
     * Проебразование в объект
     * @return {Object}
     */
    toObject() {

        let result = {
            id : this.getId(),
            type: 'tab',
            title: this.getTitle(),
        };


        if (this.isActive()) {
            result.active = true;
        }

        if (this.isDisabled()) {
            result.disabled = true;
        }

        return result;
    }
}

export default AbstractTab;