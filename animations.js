// animations.js

// --- Shooting Stars Animation ---
(function () {
  const canvas = document.getElementById('shootingStarsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;

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
    minSpeed: 15,
    maxSpeed: 35,
    minDelay: 1000,
    maxDelay: 3000,
    colors: [
      { star: '#9E00FF', trail: '#2EB9DF' }, // neon purple
      { star: '#FF0099', trail: '#FFB800' }, // pink
      { star: '#00FF9E', trail: '#00B8FF' }  // teal
    ],
    width: 15,
    height: 1.5
  };

  function getRandomStartPoint() {
    const side = Math.floor(Math.random() * 4);
    const offset = Math.random() * Math.max(width, height);
    switch (side) {
      case 0: return { x: offset, y: 0, angle: 45 };
      case 1: return { x: width, y: offset, angle: 135 };
      case 2: return { x: offset, y: height, angle: 225 };
      case 3: return { x: 0, y: offset, angle: 315 };
    }
    return { x: 0, y: 0, angle: 45 };
  }

  function spawnStar() {
    const { x, y, angle } = getRandomStartPoint();
    const colorTheme = config.colors[Math.floor(Math.random() * config.colors.length)];
    stars.push({
      x, y, angle,
      speed: Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed,
      distance: 0,
      scale: 1,
      color: colorTheme.star,
      trail: colorTheme.trail
    });
    const delay = Math.random() * (config.maxDelay - config.minDelay) + config.minDelay;
    setTimeout(spawnStar, delay);
  }

  // Spawn initial set
  for (let i = 0; i < 3; i++) {
    setTimeout(spawnStar, i * 800);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = stars.length - 1; i >= 0; i--) {
      const s = stars[i];

      const newX = s.x + s.speed * Math.cos((s.angle * Math.PI) / 180);
      const newY = s.y + s.speed * Math.sin((s.angle * Math.PI) / 180);
      s.distance += s.speed;
      s.scale = 1 + s.distance / 100;
      s.x = newX;
      s.y = newY;

      // Despawn
      if (s.x < -100 || s.x > width + 100 || s.y < -100 || s.y > height + 100) {
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
  const bgImg = document.getElementById('railAmbientImg');

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
    bgImg.src = activeItem.imageSrc;
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

      const xOffset = offset * window.innerWidth < 768 ? 260 : 320;
      const zOffset = -dist * 180;
      const scale = isCenter ? 1 : 0.85;
      const rotateY = offset * -15;
      const opacity = isCenter ? 1 : Math.max(0.1, 1 - dist * 0.5);
      const blur = isCenter ? 0 : dist * 6;
      const brightness = isCenter ? 1 : 0.5;

      const card = document.createElement('div');
      card.className = "rail-card " + (!isCenter ? 'clickable' : '');
      card.style.transform = "translateX(" + (offset * 280) + "px) translateZ(" + zOffset + "px) scale(" + scale + ") rotateY(" + rotateY + "deg)";
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

// --- Ethereal Shadows Background (Career) ---
(function () {
  const filterElement = document.getElementById('etherealColorMatrix');
  if (!filterElement) return;

  // We want to animate the hueRotation from 0 to 360 in a loop.
  // The React component animated at a duration mapped from speed (approx 50s - 1000ms based on 1-100 scale).
  // Let's use a standard 4000ms cycle for a nice smooth shift.
  let start = null;
  const duration = 8000; // ms per 360 rotation

  function animateEthereal(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;

    // Calculate current angle (0-360) loops automatically
    const angle = ((progress % duration) / duration) * 360;
    filterElement.setAttribute("values", angle.toString());

    requestAnimationFrame(animateEthereal);
  }

  requestAnimationFrame(animateEthereal);
})();

// --- Dotted Surface Background (Connect) ---
(function () {
  const container = document.getElementById('dottedSurfaceBg');
  if (!container || typeof THREE === 'undefined') return;

  const SEPARATION = 150;
  const AMOUNTX = 40;
  const AMOUNTY = 60;

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x09090b, 2000, 10000);

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    1,
    10000
  );
  camera.position.set(0, 355, 1220);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(scene.fog.color, 0);

  container.appendChild(renderer.domElement);

  // Create particles
  const positions = [];
  const colors = [];

  const geometry = new THREE.BufferGeometry();

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
      const y = 0; // Animated below
      const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

      positions.push(x, y, z);

      // Since our theme is dark, use light gray/white dots
      colors.push(0.8, 0.8, 0.8);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 6,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let count = 0;

  function animate() {
    requestAnimationFrame(animate);

    const positionAttribute = geometry.attributes.position;
    const posArray = positionAttribute.array;

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const index = i * 3;
        // Animate Y position with sine waves
        posArray[index + 1] =
          Math.sin((ix + count) * 0.3) * 50 +
          Math.sin((iy + count) * 0.5) * 50;
        i++;
      }
    }
    positionAttribute.needsUpdate = true;
    renderer.render(scene, camera);
    count += 0.1;
  }

  function handleResize() {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  window.addEventListener('resize', handleResize);
  animate();
})();
