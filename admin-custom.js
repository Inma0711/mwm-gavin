// Personalización: Ocultar bloque "Total visits" en el dashboard de YITH Affiliates

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