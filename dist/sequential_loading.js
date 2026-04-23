(function() {
    function loadNextImage(index) {
        const img = document.querySelector('img[data-index="' + index + '"]');
        if (!img) return;

        img.onload = function() {
            this.classList.add('animate-fade-in');
            this.style.opacity = '1';
            setTimeout(function() { loadNextImage(index + 1); }, 100);
        };

        img.onerror = function() {
            setTimeout(function() { loadNextImage(index + 1); }, 100);
        };
        img.src = img.getAttribute('data-src');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { loadNextImage(0); });
    } else {
        loadNextImage(0);
    }
})();