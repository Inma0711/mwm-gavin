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

    // Función para crear la tabla de subafiliados
    function crearTablaSubafiliados() {
        var mainContainer = document.querySelector('.yith-wcaf.yith-wcaf-link-generator.woocommerce');
        if (!mainContainer) return;

        // Verificar si la tabla ya existe
        if (mainContainer.querySelector('.subaffiliates-table-container')) return;

        // Crear contenedor para la tabla
        var tableContainer = document.createElement('div');
        tableContainer.className = 'subaffiliates-table-container';
        tableContainer.style.cssText = 'margin-top: 30px; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';

        // Crear título
        var title = document.createElement('h3');
        title.textContent = getLang().startsWith('es') ? 'Afiliado/s asociado/s' : 'Associated Affiliate(s)';
        title.style.cssText = 'margin-bottom: 20px; color: #333; font-size: 18px; font-weight: 600;';
        tableContainer.appendChild(title);

        // Crear tabla
        var table = document.createElement('table');
        table.style.cssText = 'width: 100%; border-collapse: collapse; margin-top: 10px;';
        
        // Crear encabezado
        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        headerRow.style.cssText = 'background-color: #f8f9fa; border-bottom: 2px solid #dee2e6;';
        
        var headers = [
            getLang().startsWith('es') ? 'Nombre' : 'Name',
            getLang().startsWith('es') ? 'ID de afiliado' : 'Affiliate ID'
        ];
        
        headers.forEach(function(headerText) {
            var th = document.createElement('th');
            th.textContent = headerText;
            th.style.cssText = 'padding: 12px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #dee2e6;';
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Crear cuerpo de la tabla
        var tbody = document.createElement('tbody');
        tbody.id = 'subaffiliates-tbody';
        
        // Añadir fila de carga
        var loadingRow = document.createElement('tr');
        var loadingCell = document.createElement('td');
        loadingCell.colSpan = 2;
        loadingCell.textContent = getLang().startsWith('es') ? 'Cargando...' : 'Loading...';
        loadingCell.style.cssText = 'padding: 20px; text-align: center; color: #6c757d; font-style: italic;';
        loadingRow.appendChild(loadingCell);
        tbody.appendChild(loadingRow);
        
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        
        // Añadir la tabla al contenedor principal
        mainContainer.appendChild(tableContainer);
        
        // Cargar datos de subafiliados
        cargarSubafiliados();
    }

    // Función para cargar datos de subafiliados
    function cargarSubafiliados() {
        if (typeof mwm_gavin_ajax === 'undefined') {
            console.error('mwm_gavin_ajax no está definido');
            return;
        }

        jQuery.ajax({
            url: mwm_gavin_ajax.ajax_url,
            type: 'POST',
            data: {
                action: 'get_subaffiliates',
                nonce: mwm_gavin_ajax.nonce
            },
            success: function(response) {
                var tbody = document.getElementById('subaffiliates-tbody');
                if (!tbody) return;
                
                tbody.innerHTML = '';
                
                if (response.success && response.data.length > 0) {
                    response.data.forEach(function(subaffiliate) {
                        var row = document.createElement('tr');
                        row.style.cssText = 'border-bottom: 1px solid #dee2e6;';
                        
                        // Celda del nombre
                        var nameCell = document.createElement('td');
                        nameCell.textContent = subaffiliate.name || subaffiliate.display_name || 'N/A';
                        nameCell.style.cssText = 'padding: 12px; color: #333;';
                        row.appendChild(nameCell);
                        
                        // Celda del ID de afiliado
                        var idCell = document.createElement('td');
                        idCell.textContent = subaffiliate.affiliate_id;
                        idCell.style.cssText = 'padding: 12px; color: #333; font-weight: 500;';
                        row.appendChild(idCell);
                        
                        tbody.appendChild(row);
                    });
                } else {
                    // Mostrar mensaje de no hay subafiliados
                    var noDataRow = document.createElement('tr');
                    var noDataCell = document.createElement('td');
                    noDataCell.colSpan = 2;
                    noDataCell.textContent = getLang().startsWith('es') ? 'No hay afiliados asociados' : 'No associated affiliates';
                    noDataCell.style.cssText = 'padding: 20px; text-align: center; color: #6c757d; font-style: italic;';
                    noDataRow.appendChild(noDataCell);
                    tbody.appendChild(noDataRow);
                }
            },
            error: function(xhr, status, error) {
                var tbody = document.getElementById('subaffiliates-tbody');
                if (tbody) {
                    tbody.innerHTML = '';
                    var errorRow = document.createElement('tr');
                    var errorCell = document.createElement('td');
                    errorCell.colSpan = 2;
                    errorCell.textContent = getLang().startsWith('es') ? 'Error al cargar los datos' : 'Error loading data';
                    errorCell.style.cssText = 'padding: 20px; text-align: center; color: #dc3545; font-style: italic;';
                    errorRow.appendChild(errorCell);
                    tbody.appendChild(errorRow);
                }
                console.error('Error cargando subafiliados:', error);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        ocultarPestanas();
        cambiarTextos();
        limpiarPanelAfiliado();
        crearTablaSubafiliados();
    });

    var observer = new MutationObserver(function() {
        observer.disconnect(); // Detén el observer antes de modificar el DOM
        ocultarPestanas();
        cambiarTextos();
        limpiarPanelAfiliado();
        crearTablaSubafiliados();
        observer.observe(document.body, { childList: true, subtree: true }); // Reactívalo después
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();