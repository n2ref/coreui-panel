
import Panel from "./js/panel";

import PanelControlLink        from "./js/controls/link";
import PanelControlButton      from "./js/controls/button";
import PanelControlDropdown    from "./js/controls/dropdown";
import PanelControlButtonGroup from "./js/controls/button_group";
import PanelControlCustom      from "./js/controls/custom";

import langEn from "./js/lang/en";
import langRu from "./js/lang/ru";

Panel.controls.link         = PanelControlLink;
Panel.controls.button       = PanelControlButton;
Panel.controls.dropdown     = PanelControlDropdown;
Panel.controls.button_group = PanelControlButtonGroup;
Panel.controls.custom       = PanelControlCustom;

Panel.lang.en = langEn;
Panel.lang.ru = langRu;


export default Panel;