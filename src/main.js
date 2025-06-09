
import Controller from "./js/controller";

import PanelControlLink        from "./js/controls/link";
import PanelControlButton      from "./js/controls/button";
import PanelControlDropdown    from "./js/controls/dropdown";
import PanelControlButtonGroup from "./js/controls/button_group";
import PanelControlCustom      from "./js/controls/custom";

import langEn from "./js/lang/en";
import langRu from "./js/lang/ru";

Controller.controls.link        = PanelControlLink;
Controller.controls.button      = PanelControlButton;
Controller.controls.dropdown    = PanelControlDropdown;
Controller.controls.buttonGroup = PanelControlButtonGroup;
Controller.controls.custom      = PanelControlCustom;

Controller.lang.en = langEn;
Controller.lang.ru = langRu;


export default Controller;