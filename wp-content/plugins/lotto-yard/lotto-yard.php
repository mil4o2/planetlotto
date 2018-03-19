<?php
    /*
        Plugin Name: Lottery Platform Functionality
        Description: A plugin added Classes for Lotto Yard API, All logic for Single Page Application
        Version: 2.5.0
        Author: Lotto Yard WP Team
        Author URI: http://www.lottoyard.com/
    */

    // File Security Check
    if(!defined('ABSPATH')) { exit; }

    if (!defined('LOTTO_YARD')) {
        define('LOTTO_YARD', 'lotto-yard');
    }

    if (!defined('DS')) {
        define('DS', DIRECTORY_SEPARATOR);
    }

    if (!defined('LOTTO_PLUGIN_ROOT')) {
        define('LOTTO_PLUGIN_ROOT', __DIR__.DS);
    }

    define('WP_POST_REVISIONS', false);

    include_once(LOTTO_PLUGIN_ROOT.'backend'.DS.'Helpers'.DS.'plugin-updates'.DS.'plugin-update-checker.php');
    include_once(LOTTO_PLUGIN_ROOT.'backend'.DS.'Helpers'.DS.'vendor'.DS.'autoload.php');
    include_once(LOTTO_PLUGIN_ROOT.'backend'.DS.'Helpers'.DS.'functions.php');
    include_once(LOTTO_PLUGIN_ROOT.'backend'.DS.'Helpers'.DS.'common.php');

    //$gi = geoip_open(LOTTO_PLUGIN_ROOT.'backend'.DS.'Helpers'.DS.'vendor'.DS.'geoip'.DS.'geoip'.DS.'src'.DS.'GeoIP.dat', GEOIP_STANDARD);
    //define('COUNTRY_CODE', geoip_country_code_by_addr($gi, IS_LOCALHOST ? '84.21.203.106' : $_SERVER['REMOTE_ADDR']));
    //get direct from maxmind
    
    if (!defined('IS_LOCALHOST')) {
        define('IS_LOCALHOST', in_array($_SERVER['REMOTE_ADDR'], array('127.0.0.1', "::1")));
    }

    if (!defined('TOKEN')) {
        define('TOKEN', get_field('access_token', 'option'));
        // define('TOKEN', 'PlamenToken89');
    }

    if (!defined('BASE_API_URL')) {
        define('BASE_API_URL', get_field('base_api_url', 'option'));
        // define('BASE_API_URL', 'http://localhost:51000/');
    }

    if (!defined('BRAND_ID')) {
        define('BRAND_ID', get_field('brand_id', 'option'));
        // define('BRAND_ID', '16384');
    }

    if (!defined('LOTTO_PLUGIN_ROOT_URI')) {
        define('LOTTO_PLUGIN_ROOT_URI', plugin_dir_url(__FILE__));
    }

    include_once(LOTTO_PLUGIN_ROOT.'backend'.DS.'LottoYardAutoloader.php');
    
    /**
     * Update Plugin Checker
     */
    $MyUpdateChecker = PucFactory::buildUpdateChecker(
        'http://pluginsprod.lottoyard.com/wp-update-server/?action=get_metadata&slug=' . LOTTO_YARD, //Metadata URL.
        __FILE__, //Full path to the main plugin file.
        LOTTO_YARD //Plugin slug. Usually it's the same as the name of the directory.
    );

    //add_filter('plugin_action_links', 'lotto_disable_plugin_deactivation', 10, 4);
    function lotto_disable_plugin_deactivation($actions, $plugin_file, $plugin_data, $context)
    {
        // Remove edit link for all
        if (array_key_exists('edit', $actions)) {
            unset($actions['edit']);
        }
        // Remove deactivate link for crucial plugins
        if (array_key_exists('deactivate', $actions) && in_array($plugin_file, array(
                'lotto-yard'.DS.'lotto-yard.php',
            ))
        ) {
            unset($actions['deactivate']);
        }
        return $actions;
    }