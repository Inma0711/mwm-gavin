<?php
/*
Plugin Name: MWM Gavin
Description: Funcionalidades personalizadas para el proyecto Gavin/Belush.
Version: 1.0.0
Author: MOWOMO
*/

// Evitar acceso directo
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


add_action('wp_enqueue_scripts', function() {
    wp_enqueue_script(
        'mwm-gavin-dashboard-custom',
        plugin_dir_url(__FILE__) . 'dashboard-custom.js',
        array(),
        '1.0',
        true
    );
});


