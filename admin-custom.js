// Ocultar pestañas "Commissions" y "Visits" en el panel de afiliados (solo frontend)
(function() {
    function ocultarPestanas() {
        // Oculta la pestaña de Commissions
        var commissionsTab = document.querySelector('.yith-wcaf-dashboard-navigation-item.commissions');
        if (commissionsTab) {
            commissionsTab.style.display = 'none';
        }
        // Oculta la pestaña de Visits (clicks)
        var visitsTab = document.querySelector('.yith-wcaf-dashboard-navigation-item.clicks');
        if (visitsTab) {
            visitsTab.style.display = 'none';
        }
    }

    document.addEventListener('DOMContentLoaded', ocultarPestanas);

    // Por si el contenido se carga dinámicamente
    var observer = new MutationObserver(function() {
        ocultarPestanas();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

(function() {
    function cambiarTitulo() {
        var dashboardTitle = document.querySelector('.yith-wcaf-link-generator .dashboard-title h3');
        if (dashboardTitle) {
            var txt = dashboardTitle.textContent.trim().toLowerCase();
            if (txt !== 'my affiliates' && (txt === 'generador de enlaces' || txt === 'link generator')) {
                dashboardTitle.textContent = 'My affiliates';
            }
        }
    }

    document.addEventListener('DOMContentLoaded', cambiarTitulo);

    // Observa cambios en el DOM y fuerza el cambio siempre
    const observer = new MutationObserver(function() {
        cambiarTitulo();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

// Cambiar el título h3 de la sección de transferencia bancaria en Settings según idioma
(function() {
    function cambiarTituloTransferencia() {
        var h3 = document.querySelector('.additional-info .settings-box h3');
        if (
            h3 &&
            (
                h3.textContent.trim() === 'Transferencia de banco/cable directo' ||
                h3.textContent.trim() === 'Transferencia directa' ||
                h3.textContent.trim() === 'Direct bank/wire transfer'
            )
        ) {
            // Detectar idioma del documento
            var lang = document.documentElement.lang || 'en';
            if (lang.startsWith('es')) {
                h3.textContent = 'Transferencia bancaria directa';
            } else {
                h3.textContent = 'Direct bank transfer';
            }
        }
    }

    document.addEventListener('DOMContentLoaded', cambiarTituloTransferencia);

    // Por si el contenido se carga dinámicamente
    var observer = new MutationObserver(function() {
        cambiarTituloTransferencia();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

// Cambiar la etiqueta "Nombre de la cuenta" por "Beneficiario"/"Beneficiary" en singular según idioma
(function() {
    function cambiarLabelCuenta() {
        document.querySelectorAll('.additional-info .settings-box label').forEach(function(label) {
            var txt = label.textContent.trim().toLowerCase();
            var lang = document.documentElement.lang || 'en';
            if (lang.startsWith('es')) {
                if (txt.includes('cuenta')) {
                    label.textContent = 'Beneficiario'; 
                }
            } else {
                if (txt.includes('account')) {
                    label.textContent = 'Beneficiary'; 
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', cambiarLabelCuenta);

    var observer = new MutationObserver(function() {
        cambiarLabelCuenta();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

// Cambiar la etiqueta IBAN por "BSB (solo Australia)" o "BSB (Australia only)" según idioma, sin afectar el span opcional
(function() {
    function cambiarLabelIBAN() {
        document.querySelectorAll('#gateway_bacs_bacs_iban_field label').forEach(function(label) {
            // Busca el primer nodo de texto dentro del label
            for (var i = 0; i < label.childNodes.length; i++) {
                var node = label.childNodes[i];
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().toUpperCase() === 'IBAN') {
                    var lang = document.documentElement.lang || 'en';
                    if (lang.startsWith('es')) {
                        node.textContent = 'BSB (solo Australia) ';
                    } else {
                        node.textContent = 'BSB (Australia only) ';
                    }
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', cambiarLabelIBAN);

    var observer = new MutationObserver(function() {
        cambiarLabelIBAN();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

// Cambiar la etiqueta "Código Swift"/"Swift code" por "Número de cuenta (NZ y AUS)" o "Account number (NZ & AUS)" según idioma
(function() {
    function cambiarLabelSwift() {
        document.querySelectorAll('#gateway_bacs_bacs_swift_field label').forEach(function(label) {
            // Busca el primer nodo de texto dentro del label
            for (var i = 0; i < label.childNodes.length; i++) {
                var node = label.childNodes[i];
                var txt = node.textContent.trim().toLowerCase();
                var lang = document.documentElement.lang || 'en';
                if (
                    node.nodeType === Node.TEXT_NODE &&
                    (txt === 'código swift' || txt === 'swift code')
                ) {
                    if (lang.startsWith('es')) {
                        node.textContent = 'Número de cuenta (NZ y AUS) ';
                    } else {
                        node.textContent = 'Account number (NZ & AUS) ';
                    }
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', cambiarLabelSwift);

    var observer = new MutationObserver(function() {
        cambiarLabelSwift();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();