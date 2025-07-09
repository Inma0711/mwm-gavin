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
    wp_send_json_success([
        ['name' => 'Prueba', 'token' => '1234']
    ]);
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
    $affiliates_table = $wpdb->prefix . 'yith_wcaf_affiliates';
    $affiliate = $wpdb->get_row($wpdb->prepare("SELECT * FROM $affiliates_table WHERE id = %d", $affiliate_id));
    if ($affiliate) {
        $user = get_userdata($affiliate->user_id);
        if (!$user) {
            error_log('MWM-GAVIN: No se encontró el usuario con user_id: ' . $affiliate->user_id);
            return array();
        }
        $nombre = trim($user->first_name . ' ' . $user->last_name);
        if (!$nombre) $nombre = $user->display_name;
        error_log('MWM-GAVIN: Entrando en la función mwm_gavin_get_subaffiliates_data con affiliate_id: ' . $affiliate_id);
        return array(array(
            'name' => $nombre,
            'token' => $affiliate->token
        ));
    } else {
        error_log('MWM-GAVIN: No se encontró el afiliado con id: ' . $affiliate_id);
    }
    return array();
}

add_shortcode('mwm_gavin_affiliate_token', function() {
    if (!is_user_logged_in()) {
        return '<div style="color:#a00;font-weight:bold;">Debes iniciar sesión para ver tu información de afiliado.</div>';
    }
    global $wpdb;
    $user_id = get_current_user_id();
    $table = $wpdb->prefix . 'yith_wcaf_affiliates';
    $affiliate = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE user_id = %d", $user_id));
    if ($affiliate) {
        $user = get_userdata($user_id);
        $nombre = trim($user->first_name . ' ' . $user->last_name);
        if (!$nombre) $nombre = $user->display_name;
        return '<div style="color:#222;font-weight:bold;">
            Token (ID de afiliado): <b>' . esc_html($affiliate->token) . '</b><br>
            Nombre: <b>' . esc_html($nombre) . '</b>
        </div>';
    } else {
        return '<div style="color:#a00;font-weight:bold;">No se detectó afiliado para este usuario.</div>';
    }
});