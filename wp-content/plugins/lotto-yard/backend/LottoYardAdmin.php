<?php

namespace Lotto_Yard;

class LottoYardAdmin
{   
    /*
	*  __construct
	*
	*  A dummy constructor to ensure adding actions for scripts and styles in admin area
	*
	*  @type	function
	*
	*  @param	N/A
	*  @return	N/A
	*/
    function __construct()
    {
        add_action('wp_enqueue_scripts', array( $this, 'lotto_admin_enqueue'));
        add_action('admin_enqueue_scripts', array( $this, 'lotto_admin_enqueue'));
        add_action('wp_ajax_del_transients', array( $this, 'lotto_del_transients'));
        add_action('admin_bar_menu', array( $this, 'lotto_admin_bar_btn'), 50);

        add_filter('acf/load_field/name=id',  array( $this, 'lotto_acf_field_choices'));
        // add_filter('acf/load_field/name=payment_methods_per_country', array( $this, 'lotto_acf_payments_per_country'));
        add_filter('acf/load_field/name=payment_methods_default', array( $this, 'lotto_acf_default_payments'));
        add_action('acf/save_post', array( $this, 'lotto_acf_save_post'), 1);
    }

    /*
	*  lotto_admin_enqueue
	*
	*  registers the scripts and styles if user is a logged
	*
	*  @type	function
	*
	*  @param	N/A
	*  @return	N/A
	*/
    function lotto_admin_enqueue()
    {
        if (is_user_logged_in()) {
            wp_enqueue_script('lotto-admin-js', plugin_dir_url(__FILE__) . 'Helpers/src/js/lotto-admin.js', array('jquery'), date('Y-m-d'), true);
            wp_register_style('lotto-admin', plugin_dir_url(__FILE__) . 'Helpers/src/css/lotto-admin.css', false, '2.0.0');
            wp_enqueue_style('lotto-admin');
        }
    }


    function lotto_admin_bar_btn($wp_admin_bar)
    {
        $args = array(
            'id' => 'button-for-transients',
            'title' => 'Delete Transients and Local Storage',
            'href' => '#',
            'meta' => array(
                'class' => 'button-for-transients'
            )
        );
        $wp_admin_bar->add_node($args);
    }

    function lotto_del_transients()
    {
        global $wpdb;
        $wpdb->get_results("DELETE FROM `".$wpdb->prefix . "options` WHERE `option_name` LIKE ('_transient_ly%')", OBJECT);

        die();
    }

    function lotto_acf_field_choices($field)
    {
        // if(count($field['choices']) > 1) return $field;
        
        $proxy = new LottoYardProxy();
        $system_constants = $proxy->ly_remote_post('globalinfo/get-system-constants', false);

        if(!empty($system_constants)) {
            $lotteries = array();
            foreach ($system_constants->LotteryTypes as $key => $value) {
                $lotteries[$value->Id]= $value->Name;
            }
            $field['choices'] = $lotteries;
        }

        return $field;
    }

    function lotto_acf_payments_per_country($field)
    {
        // if(count($field['sub_fields'][0]['choices']) > 1) return $field;  // TODO fix

        $proxy = new LottoYardProxy();
        $processors = $proxy->ly_remote_post('countryprocessor/get-country-processors', false);
        $countries = $proxy->ly_remote_post('countryprocessor/get-all-countries', false);

        if(!empty($processors)) {
            $_processors = array();
            foreach ($processors->Processors as $key => $value) {
                $_processors[$value->Id."|".$value->Name."|".$value->Status] = $value->Name.' - '.$value->Status;
            }
            $field['sub_fields'][2]['sub_fields'][0]['choices'] = $_processors;
        } else {
            $field['sub_fields'][2]['sub_fields'][0]['choices'] = '';
        }

        if(!empty($countries)) {
            $_countries = array();
            foreach ($countries as $key => $value) {
                $_countries[$value->CountryCode]= $value->Name;
            }
            $field['sub_fields'][0]['choices'] = $_countries;
        } else {
            $field['sub_fields'][0]['choices'] = '';
        }

        return $field;
    }

    function lotto_acf_default_payments($field)
    {   
        //if(count($field['sub_fields'][0]['choices']) > 1) return $field; //TODO fix

        $proxy = new LottoYardProxy();
        $processors = $proxy->ly_remote_post('countryprocessor/get-country-processors', false);
        if(!empty($processors)) {
            $_processors = array();
            foreach ($processors->Processors as $key => $value) {
                $_processors[$value->Id."|".$value->Name."|".$value->Status] = $value->Name.' - '.$value->Status;
            }
            $field['sub_fields'][0]['choices'] = $_processors;
        }


        return $field;
    }

    function lotto_acf_save_post( $post_id ) {
        if( !empty($_POST['acf']['field_57591cc9c5a8b']) && !empty($_POST['acf']['field_57591ce3c5a8c'])) {
            global $wpdb;
            $wpdb->get_results("DELETE FROM `".$wpdb->prefix . "options` WHERE `option_name` LIKE ('_transient_ly%')", OBJECT);
        }
    }
}
