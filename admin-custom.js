// Ocultar pestañas "Commissions" y "Visits" en el panel de afiliados (solo frontend)
(function() {
    // Utilidad para obtener idioma
    function getLang() {
        return (document.documentElement.lang || 'en').toLowerCase();
    }

    // Ocultar pestañas
    function ocultarPestanas() {
        var commissionsTab = document.querySelector('.yith-wcaf-dashboard-navigation-item.commissions');
        if (commissionsTab) commissionsTab.style.display = 'none';
        var visitsTab = document.querySelector('.yith-wcaf-dashboard-navigation-item.clicks');
        if (visitsTab) visitsTab.style.display = 'none';
    }

    // Cambiar títulos y labels
    function cambiarTextos() {
        // Título transferencia bancaria
        var h3 = document.querySelector('.additional-info .settings-box h3');
        if (h3) {
            var txt = h3.textContent.trim();
            if (['Transferencia de banco/cable directo', 'Transferencia directa', 'Direct bank/wire transfer'].includes(txt)) {
                h3.textContent = getLang().startsWith('es') ? 'Transferencia bancaria directa' : 'Direct bank transfer';
            }
        }

        // Beneficiario
        document.querySelectorAll('.additional-info .settings-box label').forEach(function(label) {
            var txt = label.textContent.trim().toLowerCase();
            if (
                ((getLang().startsWith('es') && txt.includes('cuenta')) ||
                (!getLang().startsWith('es') && txt.includes('account'))) &&
                !label.closest('#gateway_bacs_bacs_swift_field')
            ) {
                label.textContent = getLang().startsWith('es') ? 'Beneficiario' : 'Beneficiary';
            }
        });

        // IBAN
        document.querySelectorAll('#gateway_bacs_bacs_iban_field label').forEach(function(label) {
            for (var i = 0; i < label.childNodes.length; i++) {
                var node = label.childNodes[i];
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().toUpperCase() === 'IBAN') {
                    node.textContent = getLang().startsWith('es') ? 'BSB (solo Australia) ' : 'BSB (Australia only) ';
                }
            }
        });

        // Swift code
        document.querySelectorAll('#gateway_bacs_bacs_swift_field label').forEach(function(label) {
            for (var i = 0; i < label.childNodes.length; i++) {
                var node = label.childNodes[i];
                var txt = node.textContent.trim().toLowerCase();
                if (node.nodeType === Node.TEXT_NODE && (txt === 'código swift' || txt === 'swift code')) {
                    node.textContent = getLang().startsWith('es') ? 'Número de cuenta (NZ y AUS) ' : 'Account number (NZ & AUS) ';
                }
            }
        });

        // Título generador de enlaces
        var dashboardTitle = document.querySelector('.yith-wcaf-link-generator .dashboard-title h3');
        if (dashboardTitle) {
            var txt = dashboardTitle.textContent.trim().toLowerCase();
            if (txt !== 'my affiliates' && (txt === 'generador de enlaces' || txt === 'link generator')) {
                dashboardTitle.textContent = 'My affiliates';
            }
        }

        // Cambiar texto del enlace de navegación "Settings" a "My affiliates"
        var settingsNav = document.querySelector('.yith-wcaf-dashboard-navigation-item.settings a');
        if (settingsNav) {
            var txt = settingsNav.textContent.trim().toLowerCase();
            if (txt === 'settings') {
                settingsNav.textContent = 'My affiliates';
            }
        }
    }

    // Ejecutar al cargar
    document.addEventListener('DOMContentLoaded', function() {
        ocultarPestanas();
        cambiarTextos();
    });

    // Observer único para todo
    var observer = new MutationObserver(function() {
        ocultarPestanas();
        cambiarTextos();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();