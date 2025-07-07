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


