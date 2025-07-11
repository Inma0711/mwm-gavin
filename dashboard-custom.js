// Ocultar pestañas "Commissions" y "Visits" en el panel de afiliados (solo frontend)
function getLang() {
    return (document.documentElement.lang || 'en').toLowerCase();
}

// Ocultar pestañas "Commissions" y "Visits" en el panel de afiliados (solo frontend)
function ocultarPestanas() {
    var commissionsTab = document.querySelector('.yith-wcaf-dashboard-navigation-item.commissions');
    if (commissionsTab) commissionsTab.classList.add('hidden');
    var visitsTab = document.querySelector('.yith-wcaf-dashboard-navigation-item.clicks');
    if (visitsTab) visitsTab.classList.add('hidden');
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

// Si necesitas limpiar el panel de afiliado, puedes dejar esta función
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

// Ejecuta las funciones utilitarias al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    ocultarPestanas();
    cambiarTextos();
    limpiarPanelAfiliado();
});

// --- BLOQUE LIMPIO DE LA TABLA DE AFILIADOS ---
(function() {
    function isMyAffiliatesSection() {
        // Detecta si estamos en la URL /affiliate-dashboard/generate-link/
        return window.location.pathname.endsWith('/affiliate-dashboard/generate-link/');
    }

    function crearTablaAfiliados(afiliados) {
        // Busca el contenedor principal del dashboard
        var container = document.querySelector('.yith-wcaf-link-generator.woocommerce');
        if (!container) return;

        // Elimina tablas previas
        var old = document.getElementById('mwm-gavin-affiliates-table');
        if (old) old.remove();

        // Crea el contenedor y la tabla
        var tableContainer = document.createElement('div');
        tableContainer.id = 'mwm-gavin-affiliates-table';

        var title = document.createElement('h3');
        title.textContent = 'Todos los afiliados';
        tableContainer.appendChild(title);

        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        ['Nombre', 'ID de afiliado'].forEach(function(headerText) {
            var th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        if (afiliados.length === 0) {
            var noDataRow = document.createElement('tr');
            var noDataCell = document.createElement('td');
            noDataCell.colSpan = 2;
            noDataCell.textContent = 'No hay afiliados.';
            noDataCell.className = 'no-data';
            noDataRow.appendChild(noDataCell);
            tbody.appendChild(noDataRow);
        } else {
            afiliados.forEach(function(af) {
                var row = document.createElement('tr');
                var nameCell = document.createElement('td');
                nameCell.textContent = af.name || 'N/A';
                row.appendChild(nameCell);
                var idCell = document.createElement('td');
                idCell.textContent = af.token || 'N/A';
                row.appendChild(idCell);
                tbody.appendChild(row);
            });
        }
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        container.appendChild(tableContainer);
    }

    function cargarAfiliados() {
        if (typeof mwm_gavin_ajax === 'undefined') return;
        jQuery.ajax({
            url: mwm_gavin_ajax.ajax_url,
            type: 'POST',
            data: {
                action: 'get_subaffiliates',
                nonce: mwm_gavin_ajax.nonce
            },
            success: function(response) {
                if (response.success) {
                    crearTablaAfiliados(response.data);
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        if (isMyAffiliatesSection()) {
            cargarAfiliados();
        }
    });
})();