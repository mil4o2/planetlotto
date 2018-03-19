<?php

// File Security Check
if(!defined('ABSPATH')) { exit; }

if (function_exists('dump')) {
    /**
    * Do not allow WordPress to process emojis when symfony's VarDumper is included due
    * to incompitability between both libraries.
    */
    remove_action('wp_head', 'print_emoji_detection_script', 7);
}

if (!function_exists('dump')) :
    /**
* This will be used only when symfony's var-dumper package is not loaded.
*/
function dump()
{
    $args = func_get_args();
    echo "\n<pre>\n";
    if (is_scalar($args[0])) {
        call_user_func_array('var_dump', $args);
    } else {
        foreach ($args as $arg) {
            print_r($arg);
        }
    }
    
    echo "\n</pre>";
}
endif;

if (!function_exists('dd')) :
    /**
* dump-and-die(dd): helper function that dumps the arguments and terminates the script execution.
*/
function dd()
{
    $args = func_get_args();
    
    call_user_func_array('dump', $args);
    exit;
}
endif;

/**
* Removes leading protocol from a URL address
*
* @param string $url URL (http://example.com)
* @return string The URL without protocol(//example.com)
*/
function crb_strip_url_protocol($url)
{
    return preg_replace('~^https?:~i', '', $url);
}

/**
* Checks whether a URL address is from the current site
*
* @param string $src [required] The URL address that will be checked.
* @param string $home_url [required] The URL address to the homepage of the site.
* @return bool
*/
function crb_is_external_url($src, $home_url)
{
    $separator = '~';
    $regex_quoted_home_url = preg_quote($home_url, $separator);
    $internal_url_reg = $separator . '^' . $regex_quoted_home_url . $separator . 'i';
    
    return !preg_match($internal_url_reg, $src);
}

/**
* Generates a version for the given file.
*
* Checks if the given file actually exists and returns its
* last modified time. Otherwise, returns false.
*
* @see crb_strip_url_protocol()
* @see crb_is_external_url()
*
* @param string [required] $src The URL to the file, which version should be returned.
* @return int|bool The last modified time of the given file or false.
*/
function crb_generate_file_version($src)
{
    # Normalize both URLs in order to avoid problems with http, https
    # and protocol-less cases
    $src = crb_strip_url_protocol($src);
    $home_url = crb_strip_url_protocol(home_url('/'));
    
    # Default version
    $version = false;
    
    if (!crb_is_external_url($src, $home_url)) {
        # Generate the absolute path to the file
        $file_path = str_replace(
        array($home_url, '/'),
        array(ABSPATH, DIRECTORY_SEPARATOR),
        $src
        );
        
        # Check if the given file really exists
        if (file_exists($file_path)) {
            # Use the last modified time of the file as a version
            $version = filemtime($file_path);
        }
    }
    
    # Return version
    return $version;
}

/**
* Enqueues a single JS file
*
* @see crb_generate_file_version()
*
* @param string $handle [required] Name used as a handle for the JS file
* @param string $src    [required] The URL to the JS file, which should be enqueued
* @param array  $dependencies [optional] An array of files' handle names that this file depends on
* @param bool $in_footer [optional] Whether to enqueue in footer or not. Defaults to false
*/
function crb_enqueue_script($handle, $src, $dependencies=array(), $in_footer=false)
{
    wp_enqueue_script($handle, $src, $dependencies, crb_generate_file_version($src), $in_footer);
}

/**
* Enqueues a single CSS file
*
* @see crb_generate_file_version()
*
* @param string $handle [required] Name used as a handle for the CSS file
* @param string $src    [required] The URL to the CSS file, which should be enqueued
* @param array  $dependencies [optional] An array of files' handle names that this file depends on
* @param string $media  [optional] String specifying the media for which this stylesheet has been defined. Defaults to all.
*/
function crb_enqueue_style($handle, $src, $dependencies=array(), $media='all')
{
    wp_enqueue_style($handle, $src, $dependencies, crb_generate_file_version($src), $media);
}

