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

        // Cambiar texto del enlace de navegación "Link generator" a "My affiliates"
        var linkGeneratorNav = document.querySelector('.yith-wcaf-dashboard-navigation-item.generate-link a');
        if (linkGeneratorNav) {
            var txt = linkGeneratorNav.textContent.trim().toLowerCase();
            if (txt === 'link generator') {
                linkGeneratorNav.textContent = 'My affiliates';
            }
        }
    }

function limpiarPanelAfiliado() {
    var mainContainer = document.querySelector('.yith-wcaf.yith-wcaf-link-generator.woocommerce');
    if (mainContainer) {
        var affiliateInfo = mainContainer.querySelector('.affiliate-info');
        if (affiliateInfo) {
            var h4 = affiliateInfo.querySelector('h4');
            if (h4) {
                // Solo deja el h4 (con el ID de afiliado)
                var nuevoDiv = document.createElement('div');
                nuevoDiv.className = 'affiliate-info';
                nuevoDiv.appendChild(h4.cloneNode(true));
                // Si tienes un título, lo mantenemos
                var dashboardTitle = mainContainer.querySelector('.dashboard-title');
                mainContainer.innerHTML = '';
                if (dashboardTitle) mainContainer.appendChild(dashboardTitle.cloneNode(true));
                mainContainer.appendChild(nuevoDiv);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    ocultarPestanas();
    cambiarTextos();
    limpiarPanelAfiliado();
});

var observer = new MutationObserver(function() {
    observer.disconnect(); // Detén el observer antes de modificar el DOM
    ocultarPestanas();
    cambiarTextos();
    limpiarPanelAfiliado();
    observer.observe(document.body, { childList: true, subtree: true }); // Reactívalo después
});
observer.observe(document.body, { childList: true, subtree: true });
})();