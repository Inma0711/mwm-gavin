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

// Eliminar el bloque "Total visits" del dashboard de YITH Affiliates directamente con JavaScript
add_action('admin_footer', function() {
    ?>
    <script>
    (function() {
        function removeVisitsBlock() {
            document.querySelectorAll('.woocommerce-summary__item-container').forEach(function(li) {
                var label = li.querySelector('.woocommerce-summary__item-label');
                if (label && label.textContent.trim().toLowerCase() === 'total visits') {
                    li.remove();
                }
            });
        }
        // Ejecuta al cargar
        document.addEventListener('DOMContentLoaded', removeVisitsBlock);
        // Observa cambios en el dashboard por si React vuelve a renderizar
        var target = document.querySelector('#yith_wcaf_panel_dashboard, #yith_wcaf_dashboard_root, .woocommerce-summary');
        if (target) {
            var observer = new MutationObserver(function() {
                removeVisitsBlock();
            });
            observer.observe(target, { childList: true, subtree: true });
        }
    })();
    </script>
    <?php
});