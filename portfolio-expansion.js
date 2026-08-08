(function () {
  var revealItems = document.querySelectorAll('[data-system-reveal]');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  var projectSelect = document.getElementById('intake-project');
  document.querySelectorAll('.pkg-cta').forEach(function (link) {
    link.addEventListener('click', function () {
      if (!projectSelect) return;
      var packageCard = link.closest('.pkg-card');
      var packageName = packageCard && packageCard.querySelector('.pkg-name');
      if (packageName) projectSelect.value = packageName.textContent.trim();
    });
  });

  var form = document.getElementById('intake-form');
  if (!form) return;

  var submitButton = form.querySelector('button[type="submit"]');
  var successPanel = document.getElementById('intake-success');
  var errorPanel = document.getElementById('intake-error');
  var defaultButtonText = submitButton.textContent;

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    successPanel.hidden = true;
    errorPanel.hidden = true;
    submitButton.disabled = true;
    submitButton.textContent = '>_ TRANSMITTING...';

    try {
      var response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('Form submission failed');

      form.reset();
      successPanel.hidden = false;
      successPanel.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    } catch (error) {
      errorPanel.hidden = false;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = defaultButtonText;
    }
  });
})();
