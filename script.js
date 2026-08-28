(() => {
  const stages = [...document.querySelectorAll('.stage')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const music = document.querySelector('#background-music');
  const musicControl = document.querySelector('.music-control');
  const musicVolume = 0.16;
  const fadeDuration = 3000;
  let fadeFrame;

  function setMusicState(isPlaying) {
    document.body.classList.toggle('is-music-playing', isPlaying);
    musicControl?.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
    musicControl?.setAttribute('aria-pressed', String(isPlaying));
    musicControl?.setAttribute('title', isPlaying ? 'Pause music' : 'Play music');
  }

  async function playMusic({ fade = false } = {}) {
    if (!music) {
      return;
    }

    window.cancelAnimationFrame(fadeFrame);
    music.volume = fade && !reduceMotion ? 0 : musicVolume;

    try {
      await music.play();
      setMusicState(true);

      if (!fade || reduceMotion) {
        return;
      }

      const startedAt = performance.now();
      const raiseVolume = (now) => {
        if (music.paused) {
          return;
        }

        const progress = Math.min((now - startedAt) / fadeDuration, 1);
        music.volume = musicVolume * progress;

        if (progress < 1) {
          fadeFrame = window.requestAnimationFrame(raiseVolume);
        }
      };

      fadeFrame = window.requestAnimationFrame(raiseVolume);
    } catch {
      setMusicState(false);
    }
  }

  function pauseMusic() {
    window.cancelAnimationFrame(fadeFrame);
    music?.pause();
    setMusicState(false);
  }

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
    button.addEventListener('click', () => {
      showStage(button.dataset.show);

      if (button.dataset.show === 'letter' && music?.paused) {
        playMusic({ fade: true });
      }
    });
  });

  musicControl?.addEventListener('click', () => {
    if (music?.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });
})();
