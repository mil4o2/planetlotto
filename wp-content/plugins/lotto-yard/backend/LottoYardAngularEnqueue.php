<?php
namespace Lotto_Yard;

class LottoYardAngularEnqueue
{
    public $proxy;

     /*
	*  __construct
	*
	*  A dummy constructor to ensure adding actions for scripts and styles in themes
	*
	*  @type	function
	*
	*  @param	N/A
	*  @return	N/A
	*/
    function __construct()
    {
        $this->proxy = new LottoYardProxy();

        add_action( 'wp_enqueue_scripts', array( $this, 'lotto_angular_scripts' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'lotto_angular_styles' ) );
    }

    /*
	*  lotto_angular_styles
	*
	*  Registers the styles
	*
	*  @type	function
	*
	*  @param	N/A
	*  @return	N/A
	*/
    function lotto_angular_styles()
    {
        crb_enqueue_style('ly-plugin-css', LOTTO_PLUGIN_ROOT_URI . 'frontend/build/ly.plugin.build.css');
    }

    /*
	*  lotto_angular_scripts
	*
	*  Registers the scripts and localizes a registered script with data for a JavaScript variable.
	*
	*  @type	function
	*
	*  @param	N/A
	*  @return	N/A
	*/
    function lotto_angular_scripts()
    {
        $this->lotto_remove_actions();

        wp_deregister_script(
            array(
                'prototype',
                'wp-embed',
                // 'jquery'
            )
        );

        crb_enqueue_script('ly-plugin-js', LOTTO_PLUGIN_ROOT_URI.'frontend/build/ly.dev.plugin.build.js', array(), true);
        crb_enqueue_script('ly-theme-js', LOTTO_PLUGIN_ROOT_URI.'frontend/build/ly.objects.js', array(), false);

        include_once(LOTTO_PLUGIN_ROOT.'frontend'.DS.'translations.php');

        wp_localize_script(
            'ly-plugin-js',
            'LY_Settings',
            $this->lotto_config_object()
        );
    }

    /*
	*  lotto_remove_actions
	*
	*  This function removes all function attached to a specified hooks.
	*
	*  @type	function
	*
	*  @param	N/A
	*  @return	N/A
	*/
    public function lotto_remove_actions()
    {
        remove_action('wp_head', 'print_emoji_detection_script', 7);
        remove_action('wp_print_styles', 'print_emoji_styles');
        // remove_action('wp_head', 'feed_links_extra', 3);
        // remove_action('wp_head', 'feed_links', 2);
        remove_action('wp_head', 'rsd_link');
        remove_action('wp_head', 'wlwmanifest_link');
        remove_action('wp_head', 'index_rel_link');
        remove_action('wp_head', 'parent_post_rel_link', 10, 0);
        remove_action('wp_head', 'start_post_rel_link', 10, 0);
        remove_action('wp_head', 'adjacent_posts_rel_link', 10, 0);
        remove_action('wp_head', 'wp_generator');
    }

    /*
	*  lotto_config_object
	*
	*  Create array with data for a JavaScript variable
	*
	*  @type	function
	*
	*  @param	N/A
	*  @return	[](array)
	*/
    public function lotto_config_object()
    {
        return array(
            'devMode' => IS_LOCALHOST == '1' ? 'true' : 'false',

            'ipAddress' => $_SERVER['REMOTE_ADDR'],

            'maintenanceMode' => get_field('maintenance_mode', 'option'),

            'adminAjaxUrl' => $this->lotto_get_admin_url(),

            'wpRestUrl' => rest_url(),

            // 'lyRestUrl' => BASE_API_URL,

            'siteUrl' => get_site_url(),

            'homeUrl' => home_url(),

            'selectPageSlug' => get_field('select_page', 'option')->post_name,

            'blogPageSlug' => get_post(get_option('page_for_posts'))->post_name,

            'categoryBlogSlug' => get_option('category_base'),

            'tagBlogSlug' => get_option('tag_base'),

            'thankYouPageSlug' => get_field('thank_you_page', 'option')->post_name,

            'myAccountPageSlug' => get_field('my_account_page', 'option')->post_name,

            'promotionsPageSlug' => get_field('promotions_page', 'option')->post_name,

            'cartPage' => get_field('cart_page', 'option')->post_name,

            'billingPage' => get_field('billing_page', 'option')->post_name,

            'partialPath' => LOTTO_PLUGIN_ROOT_URI . 'frontend/src/pages/',

            'langPath' => get_template_directory_uri() . '/languages/',

            'pageTemplates' => $this->lotto_get_templates(),

            'affiliateId' => empty($_SESSION['bta']) ? 0 : $_SESSION['bta'], //TODO remove

            'siteCurrentLang' => defined('CURRENT_LANGUAGE_CODE') ? CURRENT_LANGUAGE_CODE : 'en',

            'siteLanguages' => $this->lotto_get_site_langs(),

            'siteCurrency' => $this->lotto_get_currency(),

            'lotteriesInfo' => get_field('lotteriesInfo', 'option'),

            'products' => $this->lotto_get_products(),

            'processActionTypes' => $this->lotto_process_action_types(),

            'paymentSystems' => $this->lotto_get_payments(),
        );
    }

    /*
	*  lotto_get_products
	*
	*  Get products data from LottoYard RestAPI
	*  use method globalinfo/get-products-by-brand

	*  @type	function
	*
	*  @param	N/A
	*  @return	$products_by_brand->products (array)
	*/
    public function lotto_get_products()
    {
        $products_by_brand = $this->proxy->ly_remote_post('globalinfo/get-products-by-brand', true); //get from LottoYard RestAPI, save in transient

        return $products_by_brand->products;
    }

    /*
	*  lotto_process_action_types
	*
	*  Get system constants from LottoYard RestAPI. Return just process data from system object
	*  use method globalinfo/get-system-constants

	*  @type	function
	*
	*  @param	N/A
	*  @return	$process_action_types (array)
	*/
    public function lotto_process_action_types()
    {
        $system_constants = $this->proxy->ly_remote_post('globalinfo/get-system-constants', true); //get from LottoYard RestAPI, save in transient

        $process_action_types = array();
        if(!empty($system_constants->ProcessActionTypes)) {
            foreach ($system_constants->ProcessActionTypes as $k => $v) {
                $process_action_types[$v->Name] = $v->Id;
            }
        }

        return $process_action_types;
    }

    /*
	*  lotto_get_templates
	*
	*  Retrun all pages with their template path

	*  @type	function
	*
	*  @param	N/A
	*  @return	$page_templates (array)
	*/
    public function lotto_get_templates()
    {
        $pages = get_field('pages', 'option');

        $page_templates = array();
        foreach ($pages as $k => $page) {
            if(isset($page['page']->post_name)) {
                $index = $page['page']->post_name;
                $page_templates[$index] = $page['page_template'];
            }
        }

        return $page_templates;
    }

    /*
	*  lotto_get_templates
	*
	*  Retrun site currency, get from LottoYard RestAPI.
    *  Default value is '$'
    *  use method globalinfo/get-brand-currency

	*  @type	function
	*
	*  @param	N/A
	*  @return	$_currency (string)
	*/
    public function lotto_get_currency()
    {
        $currency = $this->proxy->ly_remote_post('globalinfo/get-brand-currency', true); //get from LottoYard RestAPI, save in transient

        if(!empty($currency->Currency)) {
            $_currency = $currency->Currency;
            if($currency->CurrencyIso3 == 'AUD') {
               $_currency = $currency->CurrencyIso3 . $currency->Currency;
            }
        } else {
            $_currency = '$';
        }

        return $_currency;
    }

    /*
	*  lotto_get_site_langs
	*  If use qtranslate and site is multilanguages this function will return available languages.
    *

	*  @type	function
	*
	*  @param	N/A
	*  @return	$site_langs (array)
	*/
    public function lotto_get_site_langs()
    {
        $site_langs = array();
        if (function_exists('qtrans_getSortedLanguages')) {
            $langs = qtrans_getSortedLanguages();
            foreach ($langs as $key => $lang) {
                if ($lang == CURRENT_LANGUAGE_CODE) continue;
                $site_langs[$lang] = qtrans_getLanguageName($lang);
            }
        }

        return $site_langs;
    }

    /*
	*  lotto_get_admin_url
	*  Retrieve the url to the admin area for a given site.

	*  @type	function
	*
	*  @param	N/A
	*  @return	$admin_url (string)
	*/
    public function lotto_get_admin_url()
    {
        $admin_url = get_admin_url() . 'admin-ajax.php';
        if (function_exists('qtrans_getLanguage')) {
            define('CURRENT_LANGUAGE_CODE', qtrans_getLanguage());
            $admin_url .= '?lang=' . CURRENT_LANGUAGE_CODE;
        }

        return $admin_url;
    }

    /*
	*  lotto_get_payments
	*  Specific function return available payments, we use ACF to manage

	*  @type	function
	*
	*  @param	N/A
	*  @return	$_payments (array)
	*/
    public function lotto_get_payments()
      {
        $all_payments = array();

        $payment_methods_default = get_field('payment_methods_default', 'option'); //get from wp database (ACF)
        if(!empty($payment_methods_default)) {
            $_payments = array();
            foreach ($payment_methods_default as $k => $v) {
                if(!empty($v['payment_d'])) {
                    $payment = explode("|", $v['payment_d']);
                    if($payment[2] == 'Active') {
                        $_payments[$k] = ['name'=>$payment[1], 'id'=>$payment[0], 'label'=>$v['label_d']];
                    }
                }
            }
            $all_payments['default'] = $_payments;
        }


        $payment_methods_per_country = get_field('payment_methods_per_country', 'option');  //get from wp database (ACF)
        if(!empty($payment_methods_per_country)) {
            $_payments = array();
            foreach ($payment_methods_per_country as $k => $v) {
                    if(!empty($v['payments'])) {
                        foreach ($v['payments'] as $k1 => $v1) {
                            $payment = explode("|", $v1['payment']);
                            if($payment[2] == 'Active') {
                                $_payments[$k1] = ['name'=>$payment[1], 'id'=>$payment[0], 'label'=>$v1['label']];
                            }
                        }
                    }
                $all_payments[$v['country']] = $_payments;
            }
        }

        return $all_payments;
    }
}
