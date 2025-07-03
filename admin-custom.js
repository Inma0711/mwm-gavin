// Personalización: Ocultar bloque "Total visits" en el dashboard de YITH Affiliates
(function() {
    function removeVisitsBlock() {
        document.querySelectorAll('.woocommerce-summary__item-container').forEach(function(li) {
            var label = li.querySelector('.woocommerce-summary__item-label');
            if (label && label.textContent.trim().toLowerCase() === 'total visits') {
                li.remove();
            }
        });
    }
    document.addEventListener('DOMContentLoaded', removeVisitsBlock);
    var target = document.querySelector('#yith_wcaf_panel_dashboard, #yith_wcaf_dashboard_root, .woocommerce-summary');
    if (target) {
        var observer = new MutationObserver(function() {
            removeVisitsBlock();
        });
        observer.observe(target, { childList: true, subtree: true });
    }
})();

// Personalización: Cambios de textos en la tabla de métodos de pago
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('td.payment_method.column-payment_method').forEach(function(td) {
            // Cambios en inglés primero
            td.innerHTML = td.innerHTML.replace('Direct bank/wire transfer', 'Direct bank transfer');
            td.innerHTML = td.innerHTML.replace('Account name:', 'Beneficiary:');
            td.innerHTML = td.innerHTML.replace('IBAN:', 'BSB (Australia only):');
            td.innerHTML = td.innerHTML.replace('Swift code:', 'Account number (NZ & AUS):');
            td.innerHTML = td.innerHTML.replace('VAT number *', 'GST number (if applicable)');
            // Cambios en español después
            td.innerHTML = td.innerHTML.replace('Transferencia de banco/cable directo', 'Transferencia bancaria directa');
            td.innerHTML = td.innerHTML.replace('Nombre de la cuenta:', 'Beneficiario:');
            td.innerHTML = td.innerHTML.replace('IBAN:', 'BSB (solo Australia):');
            td.innerHTML = td.innerHTML.replace('Código Swift:', 'Número de cuenta (NZ y AUS):');
            td.innerHTML = td.innerHTML.replace('Número de IVA *', 'Número GST (si procede)');
        });
    });
})();

// Personalización: Cambios de textos en los labels de la tabla de datos bancarios del afiliado
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var table = document.getElementById('fieldset-affiliate_bacs_info');
        if (table) {
            table.querySelectorAll('label').forEach(function(label) {
                // Cambios en inglés primero
                if (label.textContent.trim() === 'Direct bank/wire transfer') label.textContent = 'Direct bank transfer';
                if (label.textContent.trim() === 'Account name') label.textContent = 'Beneficiary';
                if (label.textContent.trim() === 'IBAN') label.textContent = 'BSB (Australia only)';
                if (label.textContent.trim() === 'Swift code') label.textContent = 'Account number (NZ & AUS)';
                if (label.textContent.trim() === 'VAT number *') label.textContent = 'GST number (if applicable)';
                // Cambios en español después
                if (label.textContent.trim() === 'Transferencia de banco/cable directo') label.textContent = 'Transferencia bancaria directa';
                if (label.textContent.trim() === 'Nombre de la cuenta') label.textContent = 'Beneficiario';
                if (label.textContent.trim() === 'IBAN') label.textContent = 'BSB (solo Australia)';
                if (label.textContent.trim() === 'Código Swift') label.textContent = 'Número de cuenta (NZ y AUS)';
                if (label.textContent.trim() === 'Número de IVA *') label.textContent = 'Número GST (si procede)';
            });
        }
    });
})();

// Personalización: Cambiar el texto del h3 según idioma
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        function cambiarH3PorIdioma() {
            var h3s = document.querySelectorAll('h3');
            h3s.forEach(function(h3) {
                if (h3.textContent.trim() === 'Affiliate Direct bank/wire transfer info') {
                    var lang = document.documentElement.lang || '';
                    if (lang.startsWith('es')) {
                        h3.textContent = 'Transferencia bancaria directa';
                    } else {
                        h3.textContent = 'Direct bank transfer';
                    }
                }
            });
        }
        cambiarH3PorIdioma();
        var observer = new MutationObserver(function() {
            cambiarH3PorIdioma();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
