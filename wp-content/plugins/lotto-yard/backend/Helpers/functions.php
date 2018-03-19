<?php

// File Security Check
if(!defined('ABSPATH')) { exit; }

add_action('template_redirect', 'remove_wpseo');
function remove_wpseo()
{
    global $wpseo_front;
    if (defined($wpseo_front)) {
        remove_action('wp_head', array($wpseo_front, 'head'), 1);
    } else {
        $wp_thing = WPSEO_Frontend::get_instance();
        remove_action('wp_head', array($wp_thing, 'head'), 1);
    }
}

add_action( 'rest_api_init', function() 
{
    register_rest_field(
        array('page', 'promotions', 'news'),
            'content',
            array(
                'get_callback'    => 'ly_add_yoast_breadcrumb_in_page_response',
                'update_callback' => null,
                'schema'          => null,
            )
        );
    }
);

function ly_add_yoast_breadcrumb_in_page_response( $object, $field_name, $request )
{
    global $wp_query;
    $old_singular_value = $wp_query->is_singular;
    $wp_query->is_singular = true;
    WPSEO_Breadcrumbs::$instance = NULL;
    
    global $post;
    $post = get_post($object['id']);
    if (function_exists('qtrans_use')) {
        $content['rendered'] = apply_filters('the_content', qtrans_use(qtrans_getLanguage(), $post->post_content, false)); 
    } else {
        $content['rendered'] = apply_filters('the_content', $post->post_content); 
    }
    $content['yoast_breadcrumb'] = yoast_breadcrumb("","",false);
    $output = $content;
    
    return $output;
}

// add conditional statements for mobile devices
function is_ipad() 
{
	$is_ipad = (bool) strpos($_SERVER['HTTP_USER_AGENT'],'iPad');
	if ($is_ipad)
		return true;
	else return false;
}
function is_iphone() 
{
	$cn_is_iphone = (bool) strpos($_SERVER['HTTP_USER_AGENT'],'iPhone');
	if ($cn_is_iphone)
		return true;
	else return false;
}
function is_ipod() 
{
	$cn_is_iphone = (bool) strpos($_SERVER['HTTP_USER_AGENT'],'iPod');
	if ($cn_is_iphone)
		return true;
	else return false;
}
function is_ios() 
{
	if (is_iphone() || is_ipad() || is_ipod())
		return true;
	else return false;
}
function is_android() 
{ // detect ALL android devices
	$is_android = (bool) strpos($_SERVER['HTTP_USER_AGENT'],'Android');
	if ($is_android)
		return true;
	else return false;
}
function is_android_mobile() 
{ // detect ALL android devices
	$is_android   = (bool) strpos($_SERVER['HTTP_USER_AGENT'],'Android');
	$is_android_m = (bool) strpos($_SERVER['HTTP_USER_AGENT'],'Mobile');
	if ($is_android && $is_android_m)
		return true;
	else return false;
}
function is_android_tablet() 
{ // detect android tablets
	if (is_android() && !is_android_mobile())
		return true;
	else return false;
}
function is_mobile_device() 
{ // detect ALL mobile devices
	if (is_android_mobile() || is_iphone() || is_ipod())
		return true;
	else return false;
}
function is_tablet() 
{ // detect ALL tablets
	if ((is_android() && !is_android_mobile()) || is_ipad())
		return true;
	else return false;
}

// add browser name to body class
add_filter('body_class','browser_body_class');
function browser_body_class($classes) 
{
	global $is_gecko, $is_IE, $is_opera, $is_safari, $is_chrome, $is_iphone;
	if(!wp_is_mobile()) {
		if($is_gecko) $classes[] = 'browser-gecko';
		elseif($is_opera) $classes[] = 'browser-opera';
		elseif($is_safari) $classes[] = 'browser-safari';
		elseif($is_chrome) $classes[] = 'browser-chrome';
        elseif($is_IE) {
            $classes[] = 'browser-ie';
            if(preg_match('/MSIE ([0-9]+)([a-zA-Z0-9.]+)/', $_SERVER['HTTP_USER_AGENT'], $browser_version))
            $classes[] = 'ie-version-'.$browser_version[1];
        }
		else $classes[] = 'browser-unknown';
	} else {
    	if(is_iphone()) $classes[] = 'browser-iphone';
        elseif(is_ipad()) $classes[] = 'browser-ipad';
        elseif(is_ipod()) $classes[] = 'browser-ipod';
        elseif(is_android()) $classes[] = 'browser-android';
        elseif(is_tablet()) $classes[] = 'device-tablet';
        elseif(is_mobile_device()) $classes[] = 'device-mobile';
        elseif(strpos($_SERVER['HTTP_USER_AGENT'], 'Kindle') !== false) $classes[] = 'browser-kindle';
        elseif(strpos($_SERVER['HTTP_USER_AGENT'], 'BlackBerry') !== false) $classes[] = 'browser-blackberry';
        elseif(strpos($_SERVER['HTTP_USER_AGENT'], 'Opera Mini') !== false) $classes[] = 'browser-opera-mini';
        elseif(strpos($_SERVER['HTTP_USER_AGENT'], 'Opera Mobi') !== false) $classes[] = 'browser-opera-mobi';
	}
	if(strpos($_SERVER['HTTP_USER_AGENT'], 'Windows') !== false) $classes[] = 'os-windows';
        elseif(is_android()) $classes[] = 'os-android';
        elseif(is_ios()) $classes[] = 'os-ios';
        elseif(strpos($_SERVER['HTTP_USER_AGENT'], 'Macintosh') !== false) $classes[] = 'os-mac';
        elseif(strpos($_SERVER['HTTP_USER_AGENT'], 'Linux') !== false) $classes[] = 'os-linux';
        elseif(strpos($_SERVER['HTTP_USER_AGENT'], 'Kindle') !== false) $classes[] = 'os-kindle';
        elseif(strpos($_SERVER['HTTP_USER_AGENT'], 'BlackBerry') !== false) $classes[] = 'os-blackberry';
	return $classes;
}

add_action('admin_menu', 'lotto_remove_menus');
function lotto_remove_menus()
{
    // remove_menu_page( 'index.php' );                  //Dashboard
    // remove_menu_page( 'jetpack' );                    //Jetpack* 
    // remove_menu_page( 'edit.php' );                   //Posts
    // remove_menu_page( 'upload.php' );                 //Media
    // remove_menu_page( 'edit.php?post_type=page' );    //Pages
    remove_menu_page( 'edit-comments.php' );          //Comments
    // remove_menu_page( 'themes.php' );                 //Appearance
    // remove_menu_page( 'plugins.php' );                //Plugins
    // remove_menu_page( 'users.php' );                  //Users
    // remove_menu_page( 'tools.php' );                  //Tools
    // remove_menu_page( 'options-general.php' );        //Settings
}