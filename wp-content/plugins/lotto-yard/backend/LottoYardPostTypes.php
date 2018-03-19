<?php
namespace Lotto_Yard;

class LottoYardPostTypes
{
    function __construct()
    {
        add_action('init', array($this, 'lotto_testimonials'));
        // add_action('init', array($this, 'lotto_news'));
        add_action('init', array($this, 'lotto_latest_winners'));
        // add_action('init', array($this, 'lotto_promotions'));
    }

    public function lotto_testimonials()
    {
        $labels = array(
            'name' => _x('Testimonials', 'ly'),
            'singular_name' => _x('Testimonial', 'ly'),
            'menu_name' => _x('Testimonials', 'ly'),
            'name_admin_bar' => _x('Testimonial', 'ly'),
            'add_new' => _x('Add New', 'ly'),
            'add_new_item' => __('Add New Testimonial', 'ly'),
            'new_item' => __('New Testimonial', 'ly'),
            'edit_item' => __('Edit Testimonial', 'ly'),
            'view_item' => __('View Testimonial', 'ly'),
            'all_items' => __('All Testimonials', 'ly'),
            'search_items' => __('Search Testimonials', 'ly'),
            'parent_item_colon' => __('Parent Testimonials:', 'ly'),
            'not_found' => __('No testimonials found.'),
            'not_found_in_trash' => __('No testimonials found in Trash.', 'ly')
        );
        
        $args = array(
            'labels' => $labels,
            'description' => __('Description.'),
            'public' => false,
            'publicly_queryable' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'query_var' => true,
            //'rewrite' => array( 'slug' => 'testimonial' ),
            'capability_type' => 'post',
            'has_archive' => true,
            'hierarchical' => false,
            'menu_position' => null,
            'supports' => array('title')
        );
        
        register_post_type('testimonials', $args);
    }
    
    public function lotto_latest_winners()
    {
        $labels = array(
            'name' => _x('Winners', 'ly'),
            'singular_name' => _x('Winner', 'ly'),
            'menu_name' => _x('Winners', 'ly'),
            'name_admin_bar' => _x('Winners', 'ly'),
            'add_new' => _x('Add New Winner', 'ly'),
            'add_new_item' => __('Add New Winner', 'ly'),
            'new_item' => __('New Winners', 'ly'),
            'edit_item' => __('Edit Winners', 'ly'),
            'view_item' => __('View Winners', 'ly'),
            'all_items' => __('All Winners', 'ly'),
            'search_items' => __('Search Winners', 'ly'),
            'parent_item_colon' => __('Parent Winners:', 'ly'),
            'not_found' => __('No Winners found.'),
            'not_found_in_trash' => __('No Winners found in Trash.', 'ly')
        );
        
        $args = array(
            'labels' => $labels,
            'description' => __('Description.'),
            'public' => false,
            'publicly_queryable' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'query_var' => true,
            'capability_type' => 'post',
            'has_archive' => true,
            'hierarchical' => false,
            'menu_position' => null,
            'supports' => array('title')
        );
        
        register_post_type('latestWinners', $args);
    }
    
    public function lotto_news()
    {
        $labels = array(
            'name' => _x('News', 'ly'),
            'singular_name' => _x('News', 'ly'),
            'menu_name' => _x('News', 'ly'),
            'name_admin_bar' => _x('News', 'ly'),
            'add_new' => _x('Add News', 'ly'),
            'add_new_item' => __('Add News', 'ly'),
            'new_item' => __('New News', 'ly'),
            'edit_item' => __('Edit News', 'ly'),
            'view_item' => __('View News', 'ly'),
            'all_items' => __('All News', 'ly'),
            'search_items' => __('Search News', 'ly'),
            'parent_item_colon' => __('Parent News:', 'ly'),
            'not_found' => __('No News found.'),
            'not_found_in_trash' => __('No News found in Trash.', 'ly')
        );
        
        $args = array(
            'labels' => $labels,
            'description' => __('Description.'),
            'public' => true,
            'publicly_queryable' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'query_var' => true,
            'rewrite' => array( 'slug' => 'news' ),
            'capability_type' => 'post',
            'has_archive' => true,
            'hierarchical' => false,
            'menu_position' => null,
            'supports' => array('title', 'editor')
        );
        
        register_post_type('news', $args);
    }
    
    public function lotto_promotions()
    {
        $labels = array(
            'name' => _x('Promotions', 'ly'),
            'singular_name' => _x('Promotion', 'ly'),
            'menu_name' => _x('Promotions', 'ly'),
            'name_admin_bar' => _x('Promotions', 'ly'),
            'add_new' => _x('Add Promotion', 'ly'),
            'add_new_item' => __('Add Promotion', 'ly'),
            'new_item' => __('New Promotion', 'ly'),
            'edit_item' => __('Edit Promotions', 'ly'),
            'view_item' => __('View Promotions', 'ly'),
            'all_items' => __('All Promotions', 'ly'),
            'search_items' => __('Search Promotions', 'ly'),
            'parent_item_colon' => __('Parent Promotions:', 'ly'),
            'not_found' => __('No Promotions found.'),
            'not_found_in_trash' => __('No Promotions found in Trash.', 'ly')
        );
        
        $args = array(
            'labels' => $labels,
            'description' => __('Description.'),
            'public' => true,
            'publicly_queryable' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'query_var' => true,
            'rewrite' => array( 'slug' => 'promotions' ),
            'capability_type' => 'post',
            'has_archive' => true,
            'hierarchical' => false,
            'menu_position' => null,
            'supports' => array('title', 'editor')
        );
        
        register_post_type('promotions', $args);
    }
}