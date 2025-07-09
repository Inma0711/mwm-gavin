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

// AJAX handler para obtener subafiliados
add_action('wp_ajax_get_subaffiliates', 'mwm_gavin_get_subaffiliates');
add_action('wp_ajax_nopriv_get_subaffiliates', 'mwm_gavin_get_subaffiliates');

function mwm_gavin_get_subaffiliates() {
    // Verificar nonce
    if (!wp_verify_nonce($_POST['nonce'], 'mwm_gavin_nonce')) {
        wp_die('Security check failed');
    }
    
    $current_user_id = get_current_user_id();
    if (!$current_user_id) {
        wp_send_json_error('Usuario no autenticado');
        return;
    }
    
    // Obtener el ID de afiliado del usuario actual
    $affiliate_id = mwm_gavin_get_affiliate_id($current_user_id);
    if (!$affiliate_id) {
        wp_send_json_error('Usuario no es afiliado');
        return;
    }
    
    // Obtener subafiliados usando filtros de YITH
    $subaffiliates = mwm_gavin_get_subaffiliates_data($affiliate_id);
    
    wp_send_json_success($subaffiliates);
}

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

// Función para obtener datos de subafiliados
function mwm_gavin_get_subaffiliates_data($affiliate_id) {
    global $wpdb;
    
    // Tabla de afiliados
    $affiliates_table = $wpdb->prefix . 'yith_wcaf_affiliates';
    
    // Buscar subafiliados (usuarios que tienen este afiliado como referente)
    $subaffiliates = $wpdb->get_results($wpdb->prepare(
        "SELECT a.id as affiliate_id, a.user_id, u.display_name, u.first_name, u.last_name
         FROM $affiliates_table a
         JOIN {$wpdb->users} u ON a.user_id = u.ID
         WHERE a.referrer_id = %d
         ORDER BY u.display_name ASC",
        $affiliate_id
    ));
    
    $result = array();
    foreach ($subaffiliates as $subaffiliate) {
        $result[] = array(
            'affiliate_id' => $subaffiliate->affiliate_id,
            'user_id' => $subaffiliate->user_id,
            'name' => trim($subaffiliate->first_name . ' ' . $subaffiliate->last_name),
            'display_name' => $subaffiliate->display_name
        );
    }
    
    return $result;
}


