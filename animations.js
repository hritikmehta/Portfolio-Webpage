// animations.js

// --- Shooting Stars Animation (Hero only) ---
(function () {
  const canvas = document.getElementById('shootingStarsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width;
  let height;

  function setSize() {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;
  }

  setSize();
  window.addEventListener('resize', setSize);

  const stars = [];

  const config = {
    minSpeed: 20,
    maxSpeed: 45,
    minDelay: 900,
    maxDelay: 2600,
    colors: [
      { star: '#9E00FF', trail: '#2EB9DF' },
      { star: '#FF0099', trail: '#FFB800' },
      { star: '#00FF9E', trail: '#00B8FF' }
    ],
    width: 20,
    height: 2
  };

  function getRandomStartPoint() {
    const side = Math.floor(Math.random() * 4);
    const offset = Math.random() * Math.max(width, height);
    switch (side) {
      case 0: return { x: offset, y: 0, angle: 45 };
      case 1: return { x: width, y: offset, angle: 135 };
      case 2: return { x: offset, y: height, angle: 225 };
      case 3: return { x: 0, y: offset, angle: 315 };
      default: return { x: 0, y: 0, angle: 45 };
    }
  }

  function spawnStar() {
    const { x, y, angle } = getRandomStartPoint();
    const colorTheme = config.colors[Math.floor(Math.random() * config.colors.length)];
    stars.push({
      x,
      y,
      angle,
      speed: Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed,
      distance: 0,
      scale: 1,
      color: colorTheme.star,
      trail: colorTheme.trail
    });
    const delay = Math.random() * (config.maxDelay - config.minDelay) + config.minDelay;
    setTimeout(spawnStar, delay);
  }

  for (let i = 0; i < 3; i++) {
    setTimeout(spawnStar, i * 700);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = stars.length - 1; i >= 0; i--) {
      const s = stars[i];
      s.x += s.speed * Math.cos((s.angle * Math.PI) / 180);
      s.y += s.speed * Math.sin((s.angle * Math.PI) / 180);
      s.distance += s.speed;
      s.scale = 1 + s.distance / 100;

      if (s.x < -120 || s.x > width + 120 || s.y < -120 || s.y > height + 120) {
        stars.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate((s.angle * Math.PI) / 180);

      const grad = ctx.createLinearGradient(0, 0, config.width * s.scale, 0);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(1, s.color);

      ctx.fillStyle = grad;
      ctx.fillRect(0, -config.height / 2, config.width * s.scale, config.height);
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }

  draw();
})();

// --- Focus Rail Animation ---
(function () {
  const items = [
    {
      id: 1,
      title: "Neon Tokyo",
      description: "Experience the vibrant nightlife and illuminated streets of Shinjuku.",
      meta: "Urban • Travel",
      imageSrc: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop",
      href: "#",
    },
    {
      id: 2,
      title: "Nordic Silence",
      description: "Minimalist architecture meeting the raw beauty of the Icelandic coast.",
      meta: "Design • Nature",
      imageSrc: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1000&auto=format&fit=crop",
      href: "#",
    },
    {
      id: 3,
      title: "Sahara Echoes",
      description: "Wandering through the timeless dunes under an endless golden sun.",
      meta: "Adventure • Heat",
      imageSrc: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000&auto=format&fit=crop",
      href: "#",
    },
    {
      id: 4,
      title: "Cyber Future",
      description: "A glimpse into a technological singularity where AI meets humanity.",
      meta: "Tech • AI",
      imageSrc: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
      href: "#",
    },
    {
      id: 5,
      title: "Deep Ocean",
      description: "The crushing pressure and alien beauty of the Mariana Trench.",
      meta: "Science • Deep",
      imageSrc: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1000&auto=format&fit=crop",
      href: "#",
    }
  ];

  let activeIndex = 0;
  const count = items.length;

  const dragContainer = document.getElementById('railStageDrag');
  const uiMeta = document.getElementById('railMeta');
  const uiTitle = document.getElementById('railTitle');
  const uiDesc = document.getElementById('railDesc');
  const uiCount = document.getElementById('railCount');
  const uiExplore = document.getElementById('railExplore');
  const btnPrev = document.getElementById('railPrev');
  const btnNext = document.getElementById('railNext');

  function wrap(min, max, v) {
    const range = max - min;
    return ((((v - min) % range) + range) % range) + min;
  }

  function render() {
    dragContainer.innerHTML = '';

    // update info
    const activeItem = items[wrap(0, count, activeIndex)];
    uiMeta.textContent = activeItem.meta;
    uiTitle.textContent = activeItem.title;
    uiDesc.textContent = activeItem.description;
    uiCount.textContent = wrap(0, count, activeIndex) + 1 + " / " + count;
    if (activeItem.href) {
      uiExplore.href = activeItem.href;
      uiExplore.style.display = 'inline-flex';
    } else {
      uiExplore.style.display = 'none';
    }

    // render cards
    const visibleOffsets = [-2, -1, 0, 1, 2];
    visibleOffsets.forEach(offset => {
      const absIndex = activeIndex + offset;
      const dataIndex = wrap(0, count, absIndex);
      const item = items[dataIndex];

      const isCenter = offset === 0;
      const dist = Math.abs(offset);

      const xOffset = window.innerWidth < 768 ? 260 : 320;
      const zOffset = -dist * 180;
      const scale = isCenter ? 1 : 0.85;
      const rotateY = offset * -15;
      const opacity = isCenter ? 1 : Math.max(0.1, 1 - dist * 0.5);
      const blur = isCenter ? 0 : dist * 6;
      const brightness = isCenter ? 1 : 0.5;

      const card = document.createElement('div');
      card.className = "rail-card " + (!isCenter ? 'clickable' : '');
      card.style.transform = "translateX(" + (offset * xOffset) + "px) translateZ(" + zOffset + "px) scale(" + scale + ") rotateY(" + rotateY + "deg)";
      card.style.opacity = opacity;
      card.style.filter = "blur(" + blur + "px) brightness(" + brightness + ")";
      card.style.zIndex = isCenter ? "20" : "10";

      if (!isCenter) {
        card.addEventListener('click', () => {
          activeIndex += offset;
          render();
        });
      }

      card.innerHTML = "<img src='" + item.imageSrc + "' alt=''><div class='rail-card-overlay'></div><div class='rail-card-blend'></div>";
      dragContainer.appendChild(card);
    });
  }

  if (dragContainer) {
    render();

    btnPrev.addEventListener('click', () => {
      activeIndex--;
      render();
    });

    btnNext.addEventListener('click', () => {
      activeIndex++;
      render();
    });

    // Optional drag scroll
    let isDragging = false;
    let startX = 0;

    dragContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      dragContainer.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      dragContainer.style.cursor = 'grab';
      const diff = e.clientX - startX;
      if (diff > 50) {
        activeIndex--;
        render();
      } else if (diff < -50) {
        activeIndex++;
        render();
      }
    });

    window.addEventListener('resize', render);
  }
})();

// --- Hero Typing Animation ---
(function () {
  const el = document.getElementById('heroTypingAnimation');
  if (!el) return;

  const words = ["Open to collaborate", "+5:30 UTC"];
  let wordIndex = 0;
  let charIndex = words[0].length;
  let isDeleting = false;

  const typeSpeed = 85;
  const deleteSpeed = 55;
  const holdDelay = 1400;

  function tick() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      charIndex = Math.max(0, charIndex - 1);
    } else {
      charIndex = Math.min(currentWord.length, charIndex + 1);
    }

    el.textContent = currentWord.slice(0, charIndex);

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      delay = holdDelay;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 260;
    }

    setTimeout(tick, delay);
  }

  tick();
})();

// --- Dotted Surface Background (all non-hero sections) ---
(function () {
  const containers = document.querySelectorAll('.dotted-surface-bg');
  if (!containers.length || typeof THREE === 'undefined') return;

  const instances = [];
  const SEPARATION = 150;
  const AMOUNTX = 40;
  const AMOUNTY = 60;

  containers.forEach((container) => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x09090b, 2000, 10000);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(60, width / Math.max(height, 1), 0.1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(scene.fog.color, 0);

    container.appendChild(renderer.domElement);

    const positions = [];
    const colors = [];
    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const y = 0;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        positions.push(x, y, z);
        colors.push(0.82, 0.82, 0.82);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 6,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    instances.push({
      container,
      scene,
      camera,
      renderer,
      geometry,
      count: Math.random() * 10
    });
  });

  function animate() {
    instances.forEach((inst) => {
      const positionAttribute = inst.geometry.attributes.position;
      const posArray = positionAttribute.array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3;
          posArray[index + 1] =
            Math.sin((ix + inst.count) * 0.3) * 50 +
            Math.sin((iy + inst.count) * 0.5) * 50;
          i++;
        }
      }

      positionAttribute.needsUpdate = true;
      inst.renderer.render(inst.scene, inst.camera);
      inst.count += 0.1;
    });

    requestAnimationFrame(animate);
  }

  function handleResize() {
    instances.forEach((inst) => {
      const width = inst.container.clientWidth || window.innerWidth;
      const height = inst.container.clientHeight || window.innerHeight;
      inst.camera.aspect = width / Math.max(height, 1);
      inst.camera.updateProjectionMatrix();
      inst.renderer.setSize(width, height);
    });
  }

  window.addEventListener('resize', handleResize);
  animate();
})();

// --- Career Orbit Selector ---
(function () {
  const section = document.getElementById('career');
  if (!section) return;

  const buttons = section.querySelectorAll('.career-orbit-button');
  const periodEl = document.getElementById('careerInfoPeriod');
  const orgEl = document.getElementById('careerInfoOrg');
  const roleEl = document.getElementById('careerInfoRole');
  const highlightsEl = document.getElementById('careerInfoHighlights');
  const carouselRoot = document.getElementById('careerCarousel');
  const carouselImageEl = document.getElementById('careerCarouselImage');
  const carouselPrevBtn = document.getElementById('careerCarouselPrev');
  const carouselNextBtn = document.getElementById('careerCarouselNext');
  const carouselDotsEl = document.getElementById('careerCarouselDots');
  if (!buttons.length || !periodEl || !orgEl || !roleEl || !highlightsEl) return;

  let activeCareerIndex = 1;
  let activeMediaIndex = 0;
  let carouselIntervalId = null;

  const entries = [
    {
      period: '2018 — 2023',
      org: 'IIT Kharagpur',
      role: 'Research and product-thinking foundation',
      highlights: [
        'Core member in E-Cell initiatives and student leadership.',
        'Worked on undergraduate research with structured experimentation.',
        'Built strong engineering fundamentals and collaboration habits.'
      ],
      images: [
        'assets/career/2018-2023/01.svg',
        'assets/career/2018-2023/02.svg',
        'assets/career/2018-2023/03.svg',
        'assets/career/2018-2023/04.svg'
      ]
    },
    {
      period: '2023 — Present',
      org: 'Housing.com',
      role: 'Associate Product Engineer • Assistant Manager (Engineering)',
      highlights: [
        'Scaling product surfaces with reliable frontend architecture.',
        'Driving design-system consistency across teams.',
        'Owning delivery from prototyping to production rollout.'
      ],
      images: [
        'assets/career/2023-present/01.svg',
        'assets/career/2023-present/02.svg',
        'assets/career/2023-present/03.svg',
        'assets/career/2023-present/04.svg'
      ]
    },
    {
      period: 'Next',
      org: 'Mission in Progress',
      role: 'Design-led systems and product ownership',
      highlights: [
        'Targeting roles where design and engineering are tightly integrated.',
        'Building systems that stay clean at scale.',
        'Growing cross-functional leadership with strong product judgment.'
      ],
      images: [
        'assets/career/next/01.svg',
        'assets/career/next/02.svg',
        'assets/career/next/03.svg',
        'assets/career/next/04.svg'
      ]
    }
  ];

  function getActiveImages() {
    const images = entries[activeCareerIndex]?.images;
    return Array.isArray(images) ? images : [];
  }

  function renderCarouselDots() {
    if (!carouselDotsEl) return;
    const images = getActiveImages();
    carouselDotsEl.innerHTML = '';
    images.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'career-carousel-dot' + (index === activeMediaIndex ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Go to image ' + (index + 1));
      dot.addEventListener('click', () => setMediaIndex(index));
      carouselDotsEl.appendChild(dot);
    });
  }

  function setMediaIndex(index) {
    if (!carouselImageEl) return;
    const images = getActiveImages();
    if (!images.length) return;
    const total = images.length;
    activeMediaIndex = ((index % total) + total) % total;
    carouselImageEl.src = images[activeMediaIndex];
    carouselImageEl.alt = entries[activeCareerIndex].org + ' - career highlight image ' + (activeMediaIndex + 1);

    if (carouselDotsEl) {
      const dots = carouselDotsEl.querySelectorAll('.career-carousel-dot');
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === activeMediaIndex));
    }
  }

  function shiftMedia(step) {
    setMediaIndex(activeMediaIndex + step);
  }

  function restartCarouselAutoPlay() {
    if (carouselIntervalId) window.clearInterval(carouselIntervalId);
    const images = getActiveImages();
    if (images.length <= 1) return;
    carouselIntervalId = window.setInterval(() => {
      shiftMedia(1);
    }, 5000);
  }

  function render(index) {
    const safeIndex = Math.max(0, Math.min(entries.length - 1, index));
    const entry = entries[safeIndex];
    activeCareerIndex = safeIndex;
    activeMediaIndex = 0;

    buttons.forEach((btn, i) => {
      const active = i === safeIndex;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    periodEl.textContent = entry.period;
    orgEl.textContent = entry.org;
    roleEl.textContent = entry.role;
    highlightsEl.innerHTML = '';
    entry.highlights.forEach((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      highlightsEl.appendChild(li);
    });

    if (carouselImageEl) {
      renderCarouselDots();
      setMediaIndex(0);
    }
    restartCarouselAutoPlay();
  }

  if (carouselPrevBtn) {
    carouselPrevBtn.addEventListener('click', () => {
      shiftMedia(-1);
      restartCarouselAutoPlay();
    });
  }

  if (carouselNextBtn) {
    carouselNextBtn.addEventListener('click', () => {
      shiftMedia(1);
      restartCarouselAutoPlay();
    });
  }

  if (carouselRoot) {
    carouselRoot.addEventListener('mouseenter', () => {
      if (carouselIntervalId) window.clearInterval(carouselIntervalId);
    });
    carouselRoot.addEventListener('mouseleave', () => {
      restartCarouselAutoPlay();
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = Number(btn.getAttribute('data-index') || 0);
      render(index);
    });
  });

  render(1);

  const resumeCta = document.getElementById('careerResumeCta');
  if (resumeCta) {
    let doneTimer = null;
    resumeCta.addEventListener('click', (event) => {
      if (resumeCta.getAttribute('href') === '#') {
        event.preventDefault();
      }
      resumeCta.classList.remove('is-done');
      void resumeCta.offsetWidth;
      resumeCta.classList.add('is-done');
      if (doneTimer) window.clearTimeout(doneTimer);
      doneTimer = window.setTimeout(() => {
        resumeCta.classList.remove('is-done');
      }, 900);
    });
  }
})();

// --- Nav Scrollspy ---
(function () {
  const main = document.querySelector('main');
  const sectionNodes = document.querySelectorAll('main .section[id]');
  const navLinks = document.querySelectorAll('.top-nav a[href^="#"]');
  if (!main || !sectionNodes.length || !navLinks.length) return;

  function setActive(sectionId) {
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute('href') === '#' + sectionId;
      link.classList.toggle('is-active', isMatch);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      let bestId = null;
      let bestRatio = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
          bestRatio = entry.intersectionRatio;
          bestId = entry.target.id;
        }
      });

      if (bestId) setActive(bestId);
    },
    {
      root: main,
      threshold: [0.35, 0.55, 0.75],
    }
  );

  sectionNodes.forEach((section) => observer.observe(section));

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('href')?.slice(1);
      if (targetId) setActive(targetId);
    });
  });

  setActive('hero');
})();
