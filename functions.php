<?php

function theme_enqueue_styles() {
    wp_enqueue_style( 'child-style', get_stylesheet_directory_uri() . '/style.css', array( 'avada-stylesheet' ) );
}
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles' );

function avada_lang_setup() {
	$lang = get_stylesheet_directory() . '/languages';
	load_child_theme_textdomain( 'Avada', $lang );
}
add_action( 'after_setup_theme', 'avada_lang_setup' );

/* Theme functions start bellow
************************************************* */

/**
 * Theme CSS dir
 */
function themeCssUrl() {
    return get_stylesheet_directory_uri() . '/css/';
}
/**
 * Theme JS dir
 */
function themeJsUrl() {
    return get_stylesheet_directory_uri() . '/js/';
}
/**
 * Include styles
 */
add_action('wp_enqueue_scripts', 'initCSS', 99);
function initCSS() {
    echo '<link rel="stylesheet" href="' . themeCssUrl() . 'libs.min.css" type="text/css" media="all">';
    echo '<link rel="stylesheet" href="' . themeCssUrl() . 'main.min.css" type="text/css" media="all">';
}
/**
 * Include JS before </body>
 */
add_action( 'wp_footer', 'initJSscripts' );
function initJSscripts() {
    wp_deregister_script('libsJS');
    wp_register_script('libsJS', themeJsUrl() . 'libs.min.js', array(), null);
    wp_enqueue_script('libsJS');

    wp_deregister_script('main-script');
    wp_register_script('main-script', themeJsUrl() . 'main-script.js', array(), null);
    wp_enqueue_script('main-script');
}
/**
 * Remove versions for scripts and styles.
 */
add_filter( 'style_loader_src', 't5_remove_version' );
add_filter( 'script_loader_src', 't5_remove_version' );
function t5_remove_version( $url ) {
    return remove_query_arg( 'ver', $url );
}

/**
 * Remove meta name="generator" content="WordPress" from head
 * Полное отключение смайликов Emoji
 */
remove_action('wp_head', 'wp_generator');
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );

/* Omit closing PHP tag to avoid "Headers already sent" issues. */
