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

// Enqueue scripts and styles
add_action('wp_enqueue_scripts', function() {
    // Enqueue CSS
    wp_enqueue_style(
        'mwm-gavin-dashboard-custom',
        plugin_dir_url(__FILE__) . 'dashboard-custom.css',
        array(),
        '1.0.0'
    );
    
    // Enqueue JavaScript
    wp_enqueue_script(
        'mwm-gavin-dashboard-custom',
        plugin_dir_url(__FILE__) . 'dashboard-custom.js',
        array('jquery'),
        '1.0.0',
        true
    );
    
    // Localizar script con variables necesarias
    wp_localize_script('mwm-gavin-dashboard-custom', 'mwm_gavin_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('mwm_gavin_nonce')
    ));
});

add_action('wp_ajax_get_subaffiliates', 'mwm_gavin_get_current_affiliate');
add_action('wp_ajax_nopriv_get_subaffiliates', 'mwm_gavin_get_current_affiliate');



// Función para obtener el ID de afiliado del usuario
function mwm_gavin_get_affiliate_id($user_id) {
    // Solo consulta la base de datos directamente
    global $wpdb;
    $table_name = $wpdb->prefix . 'yith_wcaf_affiliates';
    $affiliate_id = $wpdb->get_var($wpdb->prepare(
        "SELECT id FROM $table_name WHERE user_id = %d",
        $user_id
    ));
    return $affiliate_id;
}

function mwm_gavin_get_current_affiliate() {
    $current_user = wp_get_current_user();
    if ( ! $current_user || 0 == $current_user->ID ) {
        wp_send_json_success([]);
    }
    $affiliate_id = mwm_gavin_get_affiliate_id($current_user->ID);
    if ( ! $affiliate_id ) {
        wp_send_json_success([]);
    }
    $nombre = trim($current_user->first_name . ' ' . $current_user->last_name);
    if (!$nombre) $nombre = $current_user->display_name;
    wp_send_json_success(array(
        array(
            'name'  => $nombre,
            'token' => $affiliate_id,
        )
    ));
}



