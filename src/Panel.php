<?php
namespace CoreUI;
use CoreUI\Panel\classes\ComboTab;

require_once 'classes/ComboTab.php';


/**
 * Class Panel
 * @package Combine
 */
class Panel {

    protected $active_tab = '';
    protected $title      = '';
    protected $subtitle   = '';
    protected $content    = [];
    protected $actions    = '';
    protected $resource   = '';
    protected $view       = '';
    protected $tabs       = [];


    /**
     * Panel constructor.
     * @param string $resource
     * @param string $view
     */
    public function __construct($resource, $view = 'default') {

        $this->resource = $resource;
        $this->view     = $view;

        if (isset($_GET[$this->resource])) {
            $this->active_tab = $_GET[$this->resource];
        }
    }


    /**
     * Установка загаловка
     * @param string $title
     * @param string $subtitle
     */
    public function setTitle($title, $subtitle = '') {
        $this->title    = $title;
        $this->subtitle = $subtitle;
    }


    /**
     * Установка своих елементов управления
     * @param string $html
     */
    public function setActions($html = '') {
        $this->actions = $html;
    }


    /**
     * Добавление таба
     * @param string $title
     * @param string $id
     * @param string $url
     * @param bool   $disabled
     */
    public function addTab($title, $id, $url = '', $disabled = false) {
        $this->tabs[] = array(
            'title'    => $title,
            'id'       => $id,
            'url'      => $url,
            'disabled' => $disabled
        );
    }


    /**
     * Добавление комбо таба
     * @param  string   $title
     * @return ComboTab
     */
    public function addComboTab($title) {
        $combo_tab = new ComboTab($title);
        $this->tabs[] = $combo_tab;
        return $combo_tab;
    }


    /**
     * Установка содержимого для контейнера
     * @param string $content
     */
    public function addContent($content) {
        array_push($this->content, $content);
    }


    /**
     * Получение идентификатора активного таба
     * @return string
     */
    public function getActiveTab() {

        if ($this->active_tab == '' && ! empty($this->tabs)) {
            reset($this->tabs);
            $tab = current($this->tabs);

            if ($tab instanceof ComboTab) {
                $elements = $tab->getElements();
                foreach ($elements as $element) {
                    if ($element['type'] == $tab::ELEMENT_ITEM) {
                        $this->active_tab = $element['id'];
                        break;
                    }
                }
            } else {
                $this->active_tab = $tab['id'];
            }
        }

        return $this->active_tab;
    }


    /**
     * Формирует данные панели
     * @return array
     */
    public function render() {

        $result = [
            'type'     => 'panel',
            'name'     => $this->resource,
            'view'     => $this->view,
            'title'    => $this->title,
            'actions'  => $this->actions,
            'subtitle' => $this->subtitle,
        ];


        if ( ! empty($this->tabs)) {
            foreach ($this->tabs as $tab) {
                $tab_item = [];

                if ($tab instanceof ComboTab) {
                    $elements = $tab->getElements();
                    if ( ! empty($elements)) {
                        $tab_item['title']    = $tab->getTitle();
                        $tab_item['type']     = 'combotab';
                        $tab_item['elements'] = [];

                        foreach ($elements as $element) {
                            $element_item = [];

                            if ($element['type'] == $tab::ELEMENT_BREAK) {
                                $element_item['type'] = 'divider';

                            } else {
                                $element_item['id']    = $element['id'];
                                $element_item['title'] = $element['title'];
                                $element_item['type']  = 'element';

                                if ($element['disabled']) {
                                    $element_item['disabled'] = true;
                                } else {
                                    $element_item['active'] = $this->active_tab == $element['id'];
                                    $element_item['url']    = strpos($element['url'], '?') !== false
                                        ? $element['url'] . '&' . $this->resource . '=' . $element['id']
                                        : $element['url'] . '?' . $this->resource . '=' . $element['id'];

                                    if ($element_item['active']) {
                                        $tab_item['active'] = true;
                                    }
                                }
                            }

                            $tab_item['elements'][] = $element_item;
                        }
                    }

                } else {
                    $tab_item['id']    = $tab['id'];
                    $tab_item['title'] = $tab['title'];
                    $tab_item['type']  = 'tab';

                    if ($tab['disabled']) {
                        $tab_item['disabled'] = true;
                    } else {
                        $tab_item['active'] = $this->active_tab == $tab['id'];
                        $tab_item['url']    = strpos($tab['url'], '?') !== false
                            ? $tab['url'] . '&' . $this->resource . '=' . $tab['id']
                            : $tab['url'] . '?' . $this->resource . '=' . $tab['id'];
                    }
                }


                if ( ! empty($tab_item)) {
                    $result['tabs'][] = $tab_item;
                }
            }
        }

        $result['content'] = $this->content;

        return $result;
    }
} 