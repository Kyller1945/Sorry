(() => {
  const stages = [...document.querySelectorAll('.stage')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showStage(stageId) {
    const target = document.getElementById(stageId);

    if (!target) {
      return;
    }

    stages.forEach((stage) => {
      const isTarget = stage === target;
      stage.hidden = !isTarget;
      stage.setAttribute('aria-hidden', String(!isTarget));
      stage.classList.toggle('is-active', isTarget);
    });

    document.body.dataset.stage = stageId;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });

    const heading = target.querySelector('h1, h2');
    heading?.focus({ preventScroll: true });
  }

  document.querySelectorAll('[data-show]').forEach((button) => {
    button.addEventListener('click', () => showStage(button.dataset.show));
  });
})();
