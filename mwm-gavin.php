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

// Aquí puedes empezar a añadir tus funciones personalizadas 

// Eliminar la pestaña "Visits" del panel de YITH WooCommerce Affiliates Premium
add_filter('yith_wcaf_affiliates_settings', function($options) {
    if (isset($options['affiliates']['affiliates_options']['sub-tabs']['affiliates-clicks'])) {
        unset($options['affiliates']['affiliates_options']['sub-tabs']['affiliates-clicks']);
    }
    return $options;
}, 20); 