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

/**************************************************
 * Personalización: Ocultar pestaña "Visits" en el panel de YITH Affiliates
 * Descripción: Elimina la pestaña de visitas del menú de afiliados en el admin.
 * Proyecto: Belush / Gavin
 **************************************************/
add_filter('yith_wcaf_affiliates_settings', function($options) {
    if (isset($options['affiliates']['affiliates_options']['sub-tabs']['affiliates-clicks'])) {
        unset($options['affiliates']['affiliates_options']['sub-tabs']['affiliates-clicks']);
    }
    return $options;
}, 20);

/**************************************************
 * Cargar JS personalizado solo en el admin
 **************************************************/
add_action('admin_enqueue_scripts', function() {
    wp_enqueue_script(
        'mwm-gavin-admin-custom',
        plugin_dir_url(__FILE__) . 'admin-custom.js',
        array(),
        '1.0',
        true
    );
});
