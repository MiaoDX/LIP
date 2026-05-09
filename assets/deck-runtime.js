(function () {
  function clampIndex(index, total) {
    if (index < 0) return 0;
    if (index >= total) return total - 1;
    return index;
  }

  function formatCounter(index, total) {
    return String(index + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
  }

  function createDeckRuntime(options) {
    const settings = Object.assign({
      slideSelector: '.slide',
      progressSelector: '#progress',
      counterSelector: '#counter',
      notesToggleSelector: '#notesToggle',
      notesClass: 'show-notes',
      notesLabel: 'NOTES',
      notesActiveLabel: 'NOTES ON',
      styleToggleSelector: null,
      styleStorageKey: 'deck-style',
      defaultStyle: null,
      styles: [],
      activeClass: 'active',
      updateHash: true,
      clickZones: true,
    }, options || {});

    const slides = Array.from(document.querySelectorAll(settings.slideSelector));
    const total = slides.length;
    const progress = document.querySelector(settings.progressSelector);
    const counter = document.querySelector(settings.counterSelector);
    const notesToggle = document.querySelector(settings.notesToggleSelector);
    let current = Math.max(0, slides.findIndex((slide) => slide.classList.contains(settings.activeClass)));

    if (!total) return null;
    if (current < 0) current = 0;

    function show(index) {
      const next = clampIndex(index, total);
      slides[current].classList.remove(settings.activeClass);
      current = next;
      slides[current].classList.add(settings.activeClass);

      if (progress) progress.style.width = ((current + 1) / total * 100) + '%';
      if (counter) counter.textContent = formatCounter(current, total);

      if (settings.updateHash && location.hash !== '#' + (current + 1)) {
        try {
          history.replaceState(null, '', '#' + (current + 1));
        } catch (error) {
          // about:srcdoc and some local preview contexts can reject history writes.
        }
      }
    }

    function next() {
      show(current + 1);
    }

    function previous() {
      show(current - 1);
    }

    function syncFromHash() {
      const hashIndex = parseInt((location.hash || '#1').slice(1), 10);
      if (!Number.isNaN(hashIndex) && hashIndex >= 1 && hashIndex <= total) show(hashIndex - 1);
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') {
        event.preventDefault();
        next();
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        previous();
      } else if (event.key === 'Home') {
        event.preventDefault();
        show(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        show(total - 1);
      }
    });

    if (settings.clickZones) {
      document.addEventListener('click', (event) => {
        if (event.target.closest('a, button, input, select, textarea')) return;
        const x = event.clientX / window.innerWidth;
        if (x < 0.3) previous();
        else if (x > 0.7) next();
      });
    }

    if (settings.updateHash) {
      syncFromHash();
      window.addEventListener('hashchange', syncFromHash);
    }

    if (notesToggle) {
      notesToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isActive = document.body.classList.toggle(settings.notesClass);
        notesToggle.textContent = isActive ? settings.notesActiveLabel : settings.notesLabel;
        notesToggle.setAttribute('aria-pressed', String(isActive));
      });
    }

    if (settings.styleToggleSelector && settings.styles.length) {
      const styleToggle = document.querySelector(settings.styleToggleSelector);
      const defaultStyle = settings.defaultStyle || settings.styles[0];

      function readStyle() {
        try {
          const stored = localStorage.getItem(settings.styleStorageKey);
          return settings.styles.includes(stored) ? stored : defaultStyle;
        } catch (error) {
          return defaultStyle;
        }
      }

      function applyStyle(style) {
        document.body.dataset.style = style;
        document.querySelectorAll(settings.styleToggleSelector + ' button[data-style]').forEach((button) => {
          button.classList.toggle('active', button.dataset.style === style);
        });
        try {
          localStorage.setItem(settings.styleStorageKey, style);
        } catch (error) {
          // Ignore private-mode or local-file storage failures.
        }
      }

      applyStyle(readStyle());

      if (styleToggle) {
        styleToggle.addEventListener('click', (event) => {
          const button = event.target.closest('button[data-style]');
          if (!button) return;
          event.stopPropagation();
          applyStyle(button.dataset.style);
        });
      }
    }

    show(current);
    return { show, next, previous, total, get current() { return current; } };
  }

  window.createDeckRuntime = createDeckRuntime;
})();
