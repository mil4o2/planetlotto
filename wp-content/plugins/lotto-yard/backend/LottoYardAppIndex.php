<?php

namespace Lotto_Yard;

if(IS_LOCALHOST) { error_reporting(E_ALL & ~E_DEPRECATED); }

class LottoYardAppIndex
{
    public function __construct()
    {
        $angularScripts = new LottoYardAngularEnqueue();
        $postTypes = new LottoYardPostTypes();

        if (isset($_GET['path']) && !is_admin()) {
            $proxy = new LottoYardProxy();
            // $proxy->ly_proxy($_GET['path']);
            $proxy->ly_proxy(BASE_API_URL.$_GET['path']);

        }

        add_action('admin_init', array($this, 'lotto_admin'));
        add_action('after_setup_theme', array($this, 'lotto_setup'));

        add_filter('http_request_timeout', array($this, 'lotto_timeout_time'));
        add_filter('acf/rest_api/option/get_fields', array($this, 'lotto_acf_rest_api'));

        // add_action('wp_head', array($this, 'lotto_print_header_scripts'));
        // add_action('wp_footer', array($this, 'lotto_print_footer_scripts'));
    }

    public function lotto_admin()
    {
        $admin = new LottoYardAdmin();
    }

    public function lotto_timeout_time($time)
    {
        $time = 30;
        return $time;
    }

    public function lotto_setup()
    {
        add_action('init', array($this, 'lotto_register_my_session'));

        if (function_exists('acf_add_options_page')) {
            acf_add_options_page(
            array(
                'page_title' => 'APP Settings',
                'menu_title' => 'APP Settings',
            ));
        }

        load_theme_textdomain('ly', LOTTO_PLUGIN_ROOT . '/languages');

        # Theme supports
        add_theme_support('post-thumbnails');
        add_theme_support('menus');

        $menu_locations = array (
            'header_menu' => __('Header menu'),
            'footer_menu_1' => __('Footer menu 1'),
            'footer_menu_2' => __('Footer menu 2'),
            'footer_menu_3' => __('Footer menu 3'),
            'footer_menu_4' => __('Footer menu 4'),
            'footer_menu_5' => __('Footer menu 5'),
        );
        # Register Theme Menu Locations
        register_nav_menus($menu_locations);
    }

    public function lotto_register_my_session()
    {
        if (isset($_GET["bta"])) {
            session_start();
            $_SESSION["bta"] = trim($_GET["bta"]);
        }
    }

    public static function remove_elements_with_key($array, $remove_elemets)
    {
        foreach ($remove_elemets as $key => $prop_name) {
            if (array_key_exists($prop_name, $array)) {
                unset($array[$prop_name]);
            }
        }

        return $array;
    }

    public function lotto_acf_rest_api($data)
    {
        $props_to_remove = array('access_token');
        if (!empty($data['acf'])) {
            $data['acf'] = self::remove_elements_with_key($data['acf'], $props_to_remove);
        }

        $data = self::remove_elements_with_key($data, $props_to_remove);

        return $data;
    }

    public function lotto_print_header_scripts()
    {
		echo get_field('header_scripts', 'option');
	}

    public function lotto_print_footer_scripts()
    {
		echo get_field('footer_scripts', 'option');
	}
}

$app = new LottoYardAppIndex();
