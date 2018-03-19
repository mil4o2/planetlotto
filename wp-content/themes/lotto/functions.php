<?php

define('STYLESHEET_DIRECTORY_URI', get_stylesheet_directory_uri());

function lotto_scripts() {
    wp_enqueue_style( 'bebas-font', STYLESHEET_DIRECTORY_URI . '/fonts/Bebas/styles.css' );
    wp_enqueue_style( 'avenir-next-font', STYLESHEET_DIRECTORY_URI . '/fonts/AvenirNext/styles.css' );
    //wp_enqueue_script( 'scripts', STYLESHEET_DIRECTORY_URI . '/js/scripts.js', array('jquery'), '', true );
}
add_action( 'wp_enqueue_scripts', 'lotto_scripts' );

?>