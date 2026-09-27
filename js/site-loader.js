(() => {
  const loader = document.querySelector('[data-site-loader]');
  if (!loader) return;

  const startedAt = performance.now();
  let finished = false;

  function finishLoading() {
    if (finished) return;
    finished = true;

    const delay = Math.max(0, 500 - (performance.now() - startedAt));
    window.setTimeout(() => {
      loader.classList.add('is-hidden');
      window.setTimeout(() => loader.remove(), 300);
    }, delay);
  }

  if (document.readyState === 'complete') {
    finishLoading();
  } else {
    window.addEventListener('load', finishLoading, { once: true });
  }

  window.setTimeout(finishLoading, 8000);
})();