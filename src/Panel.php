<?php
namespace CoreUI;
use CoreUI\Panel\classes\ComboTab;
use CoreUI\Utils\Mtpl;

require_once 'classes/ComboTab.php';


/**
 * Class Panel
 * @package Combine
 */
class Panel {

    protected $active_tab = '';
    protected $title      = '';
    protected $content    = '';
    protected $resource   = '';
    protected $tabs       = array();

    protected static $added_script = false;


    /**
     * Panel constructor.
     * @param string $resource
     */
    public function __construct($resource) {

        $this->resource = $resource;

        if (isset($_GET[$this->resource])) {
            $this->active_tab = $_GET[$this->resource];
        }
    }


    /**
     * @param string $title
     */
    public function setTitle($title) {
        $this->title = $title;
    }


    /**
     * Добавление таба
     *
     * @param string $title
     * @param string $id
     * @param string $url
     * @param bool   $disabled
     */
    public function addTab($title, $id, $url, $disabled = false) {
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
    public function setContent($content) {
        $this->content = $content;
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
     * Создание и возврат контейнера
     * @return string
     */
    public function render() {

        if ( ! self::$added_script) {
            self::$added_script = true;
            $container_dir = substr(__DIR__, strlen($_SERVER['DOCUMENT_ROOT']));

            $scripts  = "<link rel=\"stylesheet\"  type=\"text/css\" href=\"{$container_dir}/html/css/styles.css\"/>";
            $scripts .= "<script src=\"{$container_dir}/html/js/panel.js\"></script>";

        } else {
            $scripts = '';
        }


        $result = $this->make();
        return $scripts . $result;
    }


    /**
     * Создание контейнера
     * @return string
     */
    protected function make() {

        $tpl = new Mtpl(__DIR__ . '/html/template.html');

        $tpl->assign('[ID]',      $this->resource);
        $tpl->assign('[CONTENT]', $this->content);

        if ( ! empty($this->title)) {
            $tpl->title->assign('[TITLE]', $this->title);
        }

        if ( ! empty($this->tabs)) {
            foreach ($this->tabs as $tab) {
                if ($tab instanceof ComboTab) {
                    $elements = $tab->getElements();
                    if ( ! empty($elements)) {
                        $combo_tab_class = '';
                        foreach ($elements as $element) {
                            if ($element['type'] == $tab::ELEMENT_BREAK) {
                                $tpl->tabs->elements->combo_tab->combo_elements->touchBlock('break');

                            } else {
                                $url = $element['url'] . '&' . $this->resource . '=' . $element['id'];
                                if ($element['disabled']) {
                                    $class = 'disabled';
                                    $url   = 'javascript:void(0);';
                                } elseif ($this->active_tab == $element['id']) {
                                    $class = 'active';
                                    $combo_tab_class = 'active';
                                } else {
                                    $class = '';
                                }

                                $tpl->tabs->elements->combo_tab->combo_elements->element->assign('[CLASS]', $class);
                                $tpl->tabs->elements->combo_tab->combo_elements->element->assign('[TITLE]', $element['title']);
                                $tpl->tabs->elements->combo_tab->combo_elements->element->assign('[URL]',   $url);
                            }
                            $tpl->tabs->elements->combo_tab->combo_elements->reassign();
                        }

                        $tpl->tabs->elements->combo_tab->assign('[TITLE]', $tab->getTitle());
                        $tpl->tabs->elements->combo_tab->assign('[CLASS]', $combo_tab_class);
                    }
                } else {
                    $url = $tab['url'] . '&' . $this->resource . '=' . $tab['id'];
                    if ($tab['disabled']) {
                        $class = 'disabled';
                        $url   = 'javascript:void(0);';
                    } elseif ($this->active_tab == $tab['id']) {
                        $class = 'active';
                    } else {
                        $class = '';
                    }

                    $tpl->tabs->elements->tab->assign('[CLASS]', $class);
                    $tpl->tabs->elements->tab->assign('[TITLE]', $tab['title']);
                    $tpl->tabs->elements->tab->assign('[URL]',   $url);
                }

                $tpl->tabs->elements->reassign();
            }
        }

        return $tpl->render();
    }
} 