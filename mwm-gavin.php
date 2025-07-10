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

// Enqueue scripts
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_script(
        'mwm-gavin-dashboard-custom',
        plugin_dir_url(__FILE__) . 'dashboard-custom.js',
        array('jquery'),
        '1.0',
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

/*
function mwm_gavin_get_subaffiliates() {
    wp_send_json_success([
        ['name' => 'Prueba', 'token' => '1234']
    ]);
}
*/

// Función para obtener el ID de afiliado del usuario
function mwm_gavin_get_affiliate_id($user_id) {
    // Usar filtros para obtener el ID de afiliado
    if (function_exists('YITH_WCAF_Affiliate')) {
        $affiliate = YITH_WCAF_Affiliate()->get_affiliate_by_user_id($user_id);
        return $affiliate ? $affiliate->get_id() : false;
    }
    
    // Fallback: buscar en la base de datos
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
        wp_send_json_success('NO USER');
    }
    $affiliate_id = mwm_gavin_get_affiliate_id($current_user->ID);
    wp_send_json_success('AFFILIATE ID: ' . $affiliate_id);
}

