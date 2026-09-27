(() => {
  const logoRoots = [...document.querySelectorAll('[data-animated-logo]')];
  if (!logoRoots.length || !('DecompressionStream' in window)) return;
  const animations = new Map();

  const removedLogoObserver = new MutationObserver(() => {
    animations.forEach((animation, root) => {
      if (root.isConnected) return;
      animation.destroy();
      animations.delete(root);
    });

    if (!animations.size) removedLogoObserver.disconnect();
  });
  removedLogoObserver.observe(document.body, { childList: true, subtree: true });

  function loadLottie() {
    if (window.lottie) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function loadAnimationData() {
    const response = await fetch(new URL('img/tgs/marketplace.tgs', document.baseURI));
    if (!response.ok) throw new Error('Unable to load the TGS logo.');

    const decompressed = response.body.pipeThrough(new DecompressionStream('gzip'));
    return JSON.parse(await new Response(decompressed).text());
  }

  function initializeNavigationAnimations(lottiePromise) {
    const navigationLinks = [...document.querySelectorAll('.main-nav a[data-nav-animation]')];
    if (!navigationLinks.length) return;

    lottiePromise.then(() => {
      navigationLinks.forEach(link => {
        const player = link.querySelector('.nav-animation-player');
        if (!player) return;

        const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
        let animation = null;
        let animationReady = false;
        let playAfterLoad = false;

        const play = () => {
          if (motionPreference.matches) return;
          if (!animationReady) {
            playAfterLoad = true;
            return;
          }

          playAfterLoad = false;
          link.classList.add('is-nav-animating');
          animation.goToAndPlay(0, true);
        };

        motionPreference.addEventListener('change', event => {
          if (!event.matches) return;
          playAfterLoad = false;
          animation?.goToAndStop(0, true);
          link.classList.remove('is-nav-animating');
        });
        link.addEventListener('pointerenter', event => {
          if (event.pointerType === 'mouse') play();
        });
        link.addEventListener('focus', play);
        link.addEventListener('click', play);

        fetch(new URL(link.dataset.navAnimation, document.baseURI))
          .then(response => {
            if (!response.ok) throw new Error('Unable to load navigation animation.');
            return response.json();
          })
          .then(animationData => {
            animation = window.lottie.loadAnimation({
              container: player,
              renderer: 'svg',
              loop: false,
              autoplay: false,
              animationData
            });

            animation.addEventListener('DOMLoaded', () => {
              animationReady = true;
              animation.goToAndStop(0, true);
              link.classList.add('is-nav-animation-ready');
              if (playAfterLoad) play();
            });
            animation.addEventListener('complete', () => {
              animation.goToAndStop(0, true);
              link.classList.remove('is-nav-animating');
            });
          })
          .catch(() => {});
      });
    }).catch(() => {});
  }

  function initializeContactAnimations(lottiePromise) {
    const contactLinks = [...document.querySelectorAll('.contact-link[data-contact-animation]')];
    if (!contactLinks.length) return;

    lottiePromise.then(() => {
      contactLinks.forEach(link => {
        const player = link.querySelector('.contact-animation-player');
        if (!player) return;

        const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
        let animation = null;
        let animationReady = false;
        let playAfterLoad = false;

        const play = () => {
          if (motionPreference.matches) return;
          if (!animationReady) {
            playAfterLoad = true;
            return;
          }

          playAfterLoad = false;
          link.classList.add('is-contact-animating');
          animation.goToAndPlay(0, true);
        };

        motionPreference.addEventListener('change', event => {
          if (!event.matches) return;
          playAfterLoad = false;
          animation?.goToAndStop(0, true);
          link.classList.remove('is-contact-animating');
        });
        link.addEventListener('pointerenter', event => {
          if (event.pointerType === 'mouse') play();
        });
        link.addEventListener('focus', play);
        link.addEventListener('click', play);

        fetch(new URL(link.dataset.contactAnimation, document.baseURI))
          .then(response => {
            if (!response.ok) throw new Error('Unable to load contact animation.');
            return response.json();
          })
          .then(animationData => {
            animation = window.lottie.loadAnimation({
              container: player,
              renderer: 'svg',
              loop: false,
              autoplay: false,
              animationData
            });

            animation.addEventListener('DOMLoaded', () => {
              animationReady = true;
              animation.goToAndStop(0, true);
              link.classList.add('is-contact-animation-ready');
              if (playAfterLoad) play();
            });
            animation.addEventListener('complete', () => {
              animation.goToAndStop(0, true);
              link.classList.remove('is-contact-animating');
            });
          })
          .catch(() => {});
      });
    }).catch(() => {});
  }

  const lottiePromise = loadLottie();
  initializeNavigationAnimations(lottiePromise);
  initializeContactAnimations(lottiePromise);

  let faviconCaptured = false;

  function captureFavicon(animation) {
    const favicon = document.querySelector('link[rel~="icon"]');
    const svgElement = animation.renderer?.svgElement;
    if (faviconCaptured || !favicon || !svgElement) return;

    faviconCaptured = true;
    const svgSource = new XMLSerializer().serializeToString(svgElement);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext('2d');
      if (!context) return;

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      favicon.type = 'image/png';
      favicon.href = canvas.toDataURL('image/png');
    };
    image.onerror = () => {
      faviconCaptured = false;
    };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgSource)}`;
  }

  Promise.all([lottiePromise, loadAnimationData()]).then(([, animationData]) => {
    logoRoots.forEach(root => {
      if (!root.isConnected) return;
      const fallback = root.querySelector(':scope > img');
      if (!fallback) return;

      const container = document.createElement('span');
      container.className = 'animated-logo-player';
      container.setAttribute('aria-hidden', 'true');
      root.appendChild(container);

      const animation = window.lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: JSON.parse(JSON.stringify(animationData))
      });
      animations.set(root, animation);

      animation.addEventListener('DOMLoaded', () => {
        animation.goToAndStop(0, true);
        root.classList.add('is-animated-logo-ready');
        captureFavicon(animation);
      });
      animation.addEventListener('complete', () => animation.goToAndStop(0, true));

      const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
      motionPreference.addEventListener('change', event => {
        if (event.matches) animation.goToAndStop(0, true);
      });

      const play = () => {
        if (motionPreference.matches) return;
        animation.goToAndPlay(0, true);
      };

      root.addEventListener('mouseenter', play);
      root.addEventListener('focusin', play);
      root.addEventListener('click', play);
    });
  }).catch(() => {});
})();