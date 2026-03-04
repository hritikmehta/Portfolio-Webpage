const DEFAULT_CONTENT = {
  profile: {
    siteUrl: "https://portfolio-webpage-rose-zeta.vercel.app/",
    email: "hritikmehta.77@gmail.com"
  },
  seo: {
    title: "Hritik Mehta | Product Engineer Portfolio",
    description: "Portfolio of Hritik Mehta - product-minded engineer focused on modern frontend systems, performance, and design-led development.",
    ogImage: "assets/library/activity-1.jpg",
    twitterCard: "summary_large_image"
  },
  hero: {
    title: "Building Systems With Taste",
    lead: "Product-minded engineer crafting clean interfaces, robust web systems, and calm digital experiences.",
    typingWords: ["Open to collaborate"]
  },
  career: {
    resumeUrl: "https://tinyurl.com/Hritik-CV1",
    entries: []
  },
  builds: [],
  library: {
    activities: [],
    recommendations: [],
    resources: []
  },
  connect: {
    email: "hritikmehta.77@gmail.com",
    formEndpoint: "",
    formAccessKey: "",
    socials: [
      { label: "GitHub", href: "https://github.com/hritikmehta" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/hritik-mehta77/" },
      { label: "X", href: "https://x.com/HritikMehta_" },
      { label: "Medium", href: "https://medium.com/@hritik999" }
    ]
  }
};

function isExternalUrl(value) {
  return /^https?:\/\//i.test(value || "");
}

function shouldReduceMotion() {
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  return reduced || saveData;
}

function mergeDeep(base, override) {
  const out = { ...base };
  Object.keys(override || {}).forEach((key) => {
    const baseVal = out[key];
    const overrideVal = override[key];

    if (
      baseVal &&
      overrideVal &&
      typeof baseVal === "object" &&
      typeof overrideVal === "object" &&
      !Array.isArray(baseVal) &&
      !Array.isArray(overrideVal)
    ) {
      out[key] = mergeDeep(baseVal, overrideVal);
      return;
    }

    out[key] = overrideVal;
  });
  return out;
}

async function loadSiteContent() {
  try {
    const res = await fetch("content/site-content.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load content JSON");
    const json = await res.json();
    return mergeDeep(DEFAULT_CONTENT, json);
  } catch (error) {
    console.warn("Using default content because content/site-content.json failed to load", error);
    return DEFAULT_CONTENT;
  }
}

function applySeo(content) {
  const seo = content.seo || {};
  const profile = content.profile || {};

  if (seo.title) document.title = seo.title;

  const description = seo.description || profile.description;
  const siteUrl = profile.siteUrl;
  const ogImage = seo.ogImage;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta && description) descriptionMeta.setAttribute("content", description);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical && siteUrl) canonical.setAttribute("href", siteUrl);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && seo.title) ogTitle.setAttribute("content", seo.title);

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription && description) ogDescription.setAttribute("content", description);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl && siteUrl) ogUrl.setAttribute("content", siteUrl);

  const ogImageMeta = document.querySelector('meta[property="og:image"]');
  if (ogImageMeta && ogImage) ogImageMeta.setAttribute("content", ogImage);

  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle && seo.title) twitterTitle.setAttribute("content", seo.title);

  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription && description) twitterDescription.setAttribute("content", description);

  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage && ogImage) twitterImage.setAttribute("content", ogImage);

  const twitterCard = document.querySelector('meta[name="twitter:card"]');
  if (twitterCard && seo.twitterCard) twitterCard.setAttribute("content", seo.twitterCard);
}

function renderHero(content) {
  const hero = content.hero || {};
  const titleEl = document.getElementById("heroTitle");
  const leadEl = document.getElementById("heroLead");

  if (titleEl && hero.title) titleEl.textContent = hero.title;
  if (leadEl && hero.lead) leadEl.textContent = hero.lead;
}

let twitterScriptRequested = false;

function ensureTwitterWidgets() {
  if (window.twttr && window.twttr.widgets) return;
  if (twitterScriptRequested) return;
  twitterScriptRequested = true;

  const script = document.createElement("script");
  script.src = "https://platform.twitter.com/widgets.js";
  script.async = true;
  script.charset = "utf-8";
  document.head.appendChild(script);
}

function appendStretchLink(card, href, titleText) {
  if (!href) return;

  const link = document.createElement("a");
  link.className = "card-stretch-link";
  link.href = href;
  link.setAttribute("aria-label", `Open ${titleText || "resource"}`);

  if (isExternalUrl(href)) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  card.appendChild(link);
}

function createGalleryCard(item, options = {}) {
  const { hideDescription = false } = options;

  if (item.embedType === "twitter" && item.href) {
    const card = document.createElement("article");
    card.className = "gallery-card embed-card embed-card-tweet";

    const frameWrap = document.createElement("div");
    frameWrap.className = "embed-frame-wrap tweet-frame-wrap";

    const blockquote = document.createElement("blockquote");
    blockquote.className = "twitter-tweet";
    blockquote.setAttribute("data-theme", "dark");
    blockquote.setAttribute("data-dnt", "true");

    const anchor = document.createElement("a");
    anchor.href = item.href;
    anchor.textContent = item.href;
    blockquote.appendChild(anchor);

    frameWrap.appendChild(blockquote);

    const meta = document.createElement("div");
    meta.className = "embed-meta";

    const metaTop = document.createElement("div");
    metaTop.className = "embed-meta-top";

    const title = document.createElement("h4");
    title.textContent = item.title || "X Post";
    metaTop.appendChild(title);

    meta.appendChild(metaTop);
    if (item.description && !hideDescription) {
      const desc = document.createElement("p");
      desc.textContent = item.description;
      meta.appendChild(desc);
    }

    card.appendChild(frameWrap);
    card.appendChild(meta);
    appendStretchLink(card, item.href, item.title || "X Post");

    ensureTwitterWidgets();
    const loadTweet = () => {
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load(card);
      }
    };
    setTimeout(loadTweet, 0);
    setTimeout(loadTweet, 500);

    return card;
  }

  if (item.embedUrl) {
    const card = document.createElement("article");
    card.className = "gallery-card embed-card";

    const frameWrap = document.createElement("div");
    frameWrap.className = "embed-frame-wrap";

    const frame = document.createElement("iframe");
    frame.src = item.embedUrl;
    frame.title = item.title || "Embedded social post";
    frame.loading = "lazy";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.setAttribute("allow", "clipboard-write; encrypted-media; picture-in-picture; web-share");

    const meta = document.createElement("div");
    meta.className = "embed-meta";

    const metaTop = document.createElement("div");
    metaTop.className = "embed-meta-top";

    const title = document.createElement("h4");
    title.textContent = item.title || "Social Post";

    metaTop.appendChild(title);

    if (item.mark) {
      const mark = document.createElement("span");
      mark.className = "resource-mark";
      mark.textContent = item.mark;
      metaTop.appendChild(mark);
    }

    frameWrap.appendChild(frame);
    meta.appendChild(metaTop);
    if (item.description && !hideDescription) {
      const desc = document.createElement("p");
      desc.textContent = item.description;
      meta.appendChild(desc);
    }
    card.appendChild(frameWrap);
    card.appendChild(meta);
    appendStretchLink(card, item.href || item.embedUrl, item.title || "resource");

    return card;
  }

  const href = item.href || "https://example.com";
  const anchor = document.createElement("a");
  anchor.className = "gallery-card";
  anchor.href = href;

  if (isExternalUrl(href)) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }

  const img = document.createElement("img");
  img.src = item.imageSrc || "assets/library/activity-1.jpg";
  img.alt = item.imageAlt || item.title || "Library item";
  img.loading = "lazy";
  img.decoding = "async";
  img.width = 1080;
  img.height = 1350;

  const overlay = document.createElement("div");
  overlay.className = "gallery-overlay";

  const title = document.createElement("h4");
  title.textContent = item.title || "Untitled";

  if (item.mark) {
    const mark = document.createElement("span");
    mark.className = "resource-mark";
    mark.textContent = item.mark;
    overlay.appendChild(mark);
  }

  overlay.appendChild(title);
  if (!hideDescription) {
    const desc = document.createElement("p");
    desc.textContent = item.description || "";
    overlay.appendChild(desc);
  }
  anchor.appendChild(img);
  anchor.appendChild(overlay);

  return anchor;
}

function renderLibrary(content) {
  const activitiesGrid = document.getElementById("libraryActivitiesGrid");
  const recommendationsGrid = document.getElementById("libraryRecommendationsGrid");
  const resourcesGrid = document.getElementById("libraryResourcesGrid");

  const library = content.library || {};
  const sections = [
    { el: activitiesGrid, items: library.activities || [], options: { hideDescription: true } },
    { el: recommendationsGrid, items: library.recommendations || [], options: { hideDescription: false } },
    { el: resourcesGrid, items: library.resources || [], options: { hideDescription: false } }
  ];

  sections.forEach(({ el, items, options }) => {
    if (!el) return;
    el.innerHTML = "";
    items.forEach((item) => {
      el.appendChild(createGalleryCard(item, options));
    });
  });
}

function renderConnect(content) {
  const connect = content.connect || {};

  const email = connect.email || content.profile?.email || DEFAULT_CONTENT.connect.email;
  const emailLink = document.getElementById("contactEmailLink");
  const fallbackLink = document.getElementById("connectFallbackEmail");
  const socialsRoot = document.getElementById("platformLinks");
  const form = document.getElementById("connectForm");
  const accessKeyInput = document.getElementById("contactAccessKey");

  if (emailLink) {
    emailLink.href = `mailto:${email}`;
    emailLink.textContent = email;
  }

  if (fallbackLink) {
    fallbackLink.href = `mailto:${email}`;
  }

  if (socialsRoot && Array.isArray(connect.socials)) {
    socialsRoot.innerHTML = "";
    connect.socials.forEach((social) => {
      const anchor = document.createElement("a");
      anchor.href = social.href;
      anchor.textContent = social.label;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      socialsRoot.appendChild(anchor);
    });
  }

  if (form) {
    form.action = connect.formEndpoint || "";
    form.method = "POST";
  }

  if (accessKeyInput && connect.formAccessKey) {
    accessKeyInput.value = connect.formAccessKey;
  }
}

function renderCareerMeta(content) {
  const career = content.career || {};
  const resumeCta = document.getElementById("careerResumeCta");

  if (resumeCta && career.resumeUrl) {
    resumeCta.href = career.resumeUrl;
  }

  const buttons = document.querySelectorAll(".career-orbit-button");
  const entries = career.entries || [];

  buttons.forEach((btn, index) => {
    const label = btn.querySelector(".orbit-label");
    if (label && entries[index]?.period) {
      label.textContent = entries[index].period;
    }
  });
}

function initMobileNav() {
  const toggle = document.getElementById("mobileMenuToggle");
  const mobileNav = document.getElementById("mobileNav");
  if (!toggle || !mobileNav) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      mobileNav.hidden = false;
    } else {
      mobileNav.hidden = true;
    }
  }

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!expanded);
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) setOpen(false);
  });
}

function initShootingStars(reduceMotion) {
  const canvas = document.getElementById("shootingStarsCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width;
  let height;

  function setSize() {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;
  }

  setSize();
  window.addEventListener("resize", setSize);

  if (reduceMotion) {
    ctx.clearRect(0, 0, width, height);
    return;
  }

  const stars = [];

  const config = {
    minSpeed: 20,
    maxSpeed: 45,
    minDelay: 900,
    maxDelay: 2600,
    colors: [
      { star: "#9E00FF", trail: "#2EB9DF" },
      { star: "#FF0099", trail: "#FFB800" },
      { star: "#00FF9E", trail: "#00B8FF" }
    ],
    width: 20,
    height: 2
  };

  function getRandomStartPoint() {
    const side = Math.floor(Math.random() * 4);
    const offset = Math.random() * Math.max(width, height);
    switch (side) {
      case 0:
        return { x: offset, y: 0, angle: 45 };
      case 1:
        return { x: width, y: offset, angle: 135 };
      case 2:
        return { x: offset, y: height, angle: 225 };
      case 3:
        return { x: 0, y: offset, angle: 315 };
      default:
        return { x: 0, y: 0, angle: 45 };
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
      color: colorTheme.star
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
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(1, s.color);

      ctx.fillStyle = grad;
      ctx.fillRect(0, -config.height / 2, config.width * s.scale, config.height);
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

function initFocusRail(items) {
  const dragContainer = document.getElementById("railStageDrag");
  const uiMeta = document.getElementById("railMeta");
  const uiTitle = document.getElementById("railTitle");
  const uiDesc = document.getElementById("railDesc");
  const uiCount = document.getElementById("railCount");
  const uiExplore = document.getElementById("railExplore");
  const btnPrev = document.getElementById("railPrev");
  const btnNext = document.getElementById("railNext");

  if (!dragContainer || !uiMeta || !uiTitle || !uiDesc || !uiCount || !uiExplore || !btnPrev || !btnNext) return;
  if (!Array.isArray(items) || !items.length) return;

  let activeIndex = 0;
  const count = items.length;

  function wrap(min, max, value) {
    const range = max - min;
    return ((((value - min) % range) + range) % range) + min;
  }

  function render() {
    dragContainer.innerHTML = "";

    const activeItem = items[wrap(0, count, activeIndex)];
    uiMeta.textContent = activeItem.meta || "";
    uiTitle.textContent = activeItem.title || "";
    uiDesc.textContent = activeItem.description || "";
    uiCount.textContent = `${wrap(0, count, activeIndex) + 1} / ${count}`;

    if (activeItem.href) {
      uiExplore.href = activeItem.href;
      uiExplore.style.display = "inline-flex";
      if (isExternalUrl(activeItem.href)) {
        uiExplore.target = "_blank";
        uiExplore.rel = "noopener noreferrer";
      } else {
        uiExplore.removeAttribute("target");
        uiExplore.removeAttribute("rel");
      }
    } else {
      uiExplore.style.display = "none";
    }

    const visibleOffsets = [-2, -1, 0, 1, 2];
    visibleOffsets.forEach((offset) => {
      const absIndex = activeIndex + offset;
      const dataIndex = wrap(0, count, absIndex);
      const item = items[dataIndex];

      const isCenter = offset === 0;
      const dist = Math.abs(offset);

      const xOffset = window.innerWidth < 520 ? 180 : window.innerWidth < 768 ? 230 : 320;
      const zOffset = -dist * 180;
      const scale = isCenter ? 1 : 0.85;
      const rotateY = offset * -15;
      const opacity = isCenter ? 1 : Math.max(0.1, 1 - dist * 0.5);
      const blur = isCenter ? 0 : dist * 6;
      const brightness = isCenter ? 1 : 0.5;

      const card = document.createElement("div");
      card.className = `rail-card ${!isCenter ? "clickable" : ""}`;
      card.style.transform = `translateX(${offset * xOffset}px) translateZ(${zOffset}px) scale(${scale}) rotateY(${rotateY}deg)`;
      card.style.opacity = String(opacity);
      card.style.filter = `blur(${blur}px) brightness(${brightness})`;
      card.style.zIndex = isCenter ? "20" : "10";

      if (!isCenter) {
        card.addEventListener("click", () => {
          activeIndex += offset;
          render();
        });
      }

      const img = document.createElement("img");
      img.src = item.imageSrc;
      img.alt = item.imageAlt || item.title || "Build preview";
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 900;
      img.height = 1200;

      const overlay = document.createElement("div");
      overlay.className = "rail-card-overlay";

      const blend = document.createElement("div");
      blend.className = "rail-card-blend";

      card.appendChild(img);
      card.appendChild(overlay);
      card.appendChild(blend);
      dragContainer.appendChild(card);
    });
  }

  render();

  btnPrev.addEventListener("click", () => {
    activeIndex--;
    render();
  });

  btnNext.addEventListener("click", () => {
    activeIndex++;
    render();
  });

  let isDragging = false;
  let startX = 0;

  dragContainer.addEventListener("pointerdown", (event) => {
    isDragging = true;
    startX = event.clientX;
    dragContainer.style.cursor = "grabbing";
  });

  window.addEventListener("pointerup", (event) => {
    if (!isDragging) return;
    isDragging = false;
    dragContainer.style.cursor = "grab";
    const diff = event.clientX - startX;

    if (diff > 50) {
      activeIndex--;
      render();
    } else if (diff < -50) {
      activeIndex++;
      render();
    }
  });

  window.addEventListener("resize", render);
}

function initHeroTyping(words) {
  const el = document.getElementById("heroTypingAnimation");
  if (!el) return;

  const list = Array.isArray(words) && words.length ? words : ["Open to collaborate"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeSpeed = 92;
  const deleteSpeed = 56;
  const holdDelay = 1100;

  function tick() {
    const currentWord = list[wordIndex];

    if (!isDeleting) {
      charIndex = Math.min(currentWord.length, charIndex + 1);
    } else {
      charIndex = Math.max(0, charIndex - 1);
    }

    el.textContent = currentWord.slice(0, charIndex);

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      delay = holdDelay;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % list.length;
      delay = 260;
    }

    setTimeout(tick, delay);
  }

  tick();
}

function initDottedSurfaceBackground(reduceMotion) {
  const container =
    document.querySelector(".dotted-surface-bg-fixed") ||
    document.querySelector(".dotted-surface-bg");

  if (!container || typeof THREE === "undefined") return;

  const SEPARATION = 150;
  const AMOUNTX = 40;
  const AMOUNTY = 60;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x09090b, 2000, 10000);

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(60, width / Math.max(height, 1), 0.1, 10000);
  camera.position.set(0, 355, 1220);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
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

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 6,
    vertexColors: true,
    transparent: true,
    opacity: 0.78,
    sizeAttenuation: true
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let count = 0;

  function drawWave() {
    const positionAttribute = geometry.attributes.position;
    const posArray = positionAttribute.array;

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const index = i * 3;
        posArray[index + 1] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
        i++;
      }
    }

    positionAttribute.needsUpdate = true;
    renderer.render(scene, camera);
  }

  function animate() {
    drawWave();
    count += 0.05;
    requestAnimationFrame(animate);
  }

  function handleResize() {
    const nextWidth = container.clientWidth || window.innerWidth;
    const nextHeight = container.clientHeight || window.innerHeight;
    camera.aspect = nextWidth / Math.max(nextHeight, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(nextWidth, nextHeight);
  }

  window.addEventListener("resize", handleResize);

  if (reduceMotion) {
    drawWave();
    return;
  }

  animate();
}

function initCareer(career) {
  const section = document.getElementById("career");
  if (!section) return;

  const buttons = section.querySelectorAll(".career-orbit-button");
  const periodEl = document.getElementById("careerInfoPeriod");
  const orgEl = document.getElementById("careerInfoOrg");
  const roleEl = document.getElementById("careerInfoRole");
  const highlightsEl = document.getElementById("careerInfoHighlights");
  const carouselRoot = document.getElementById("careerCarousel");
  const carouselImageEl = document.getElementById("careerCarouselImage");
  const carouselPrevBtn = document.getElementById("careerCarouselPrev");
  const carouselNextBtn = document.getElementById("careerCarouselNext");
  const carouselDotsEl = document.getElementById("careerCarouselDots");

  if (!buttons.length || !periodEl || !orgEl || !roleEl || !highlightsEl || !carouselImageEl) return;

  const entries = Array.isArray(career.entries) && career.entries.length ? career.entries : [];
  if (!entries.length) return;

  let activeCareerIndex = Math.min(1, entries.length - 1);
  let activeMediaIndex = 0;
  let carouselIntervalId = null;

  function getActiveImages() {
    const images = entries[activeCareerIndex]?.images;
    return Array.isArray(images) ? images : [];
  }

  function renderCarouselDots() {
    if (!carouselDotsEl) return;

    const images = getActiveImages();
    carouselDotsEl.innerHTML = "";

    images.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `career-carousel-dot${index === activeMediaIndex ? " is-active" : ""}`;
      dot.setAttribute("aria-label", `Go to image ${index + 1}`);
      dot.addEventListener("click", () => setMediaIndex(index));
      carouselDotsEl.appendChild(dot);
    });
  }

  function setMediaIndex(index) {
    const images = getActiveImages();
    if (!images.length) return;

    const total = images.length;
    activeMediaIndex = ((index % total) + total) % total;

    carouselImageEl.src = images[activeMediaIndex];
    carouselImageEl.alt = `${entries[activeCareerIndex].org} - career highlight image ${activeMediaIndex + 1}`;
    carouselImageEl.loading = "lazy";
    carouselImageEl.decoding = "async";

    if (carouselDotsEl) {
      const dots = carouselDotsEl.querySelectorAll(".career-carousel-dot");
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === activeMediaIndex));
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
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");

      const label = btn.querySelector(".orbit-label");
      if (label && entries[i]?.period) {
        label.textContent = entries[i].period;
      }
    });

    periodEl.textContent = entry.period;
    orgEl.textContent = entry.org;
    roleEl.textContent = entry.role;

    highlightsEl.innerHTML = "";
    (entry.highlights || []).forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      highlightsEl.appendChild(li);
    });

    renderCarouselDots();
    setMediaIndex(0);
    restartCarouselAutoPlay();
  }

  if (carouselPrevBtn) {
    carouselPrevBtn.addEventListener("click", () => {
      shiftMedia(-1);
      restartCarouselAutoPlay();
    });
  }

  if (carouselNextBtn) {
    carouselNextBtn.addEventListener("click", () => {
      shiftMedia(1);
      restartCarouselAutoPlay();
    });
  }

  if (carouselRoot) {
    carouselRoot.addEventListener("mouseenter", () => {
      if (carouselIntervalId) window.clearInterval(carouselIntervalId);
    });

    carouselRoot.addEventListener("mouseleave", () => {
      restartCarouselAutoPlay();
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.getAttribute("data-index") || 0);
      render(index);
    });
  });

  render(activeCareerIndex);

  const resumeCta = document.getElementById("careerResumeCta");
  if (resumeCta) {
    let doneTimer = null;
    resumeCta.addEventListener("click", () => {
      resumeCta.classList.remove("is-done");
      void resumeCta.offsetWidth;
      resumeCta.classList.add("is-done");

      if (doneTimer) window.clearTimeout(doneTimer);
      doneTimer = window.setTimeout(() => {
        resumeCta.classList.remove("is-done");
      }, 900);
    });
  }
}

function initContactForm(content) {
  const connect = content.connect || {};
  const form = document.getElementById("connectForm");
  const submitBtn = document.getElementById("connectSubmit");
  const statusEl = document.getElementById("connectStatus");
  if (!form || !submitBtn || !statusEl) return;

  const endpoint = connect.formEndpoint || "";
  const accessKey = connect.formAccessKey || "";

  function setStatus(text, type) {
    statusEl.textContent = text;
    statusEl.classList.remove("is-success", "is-error");
    if (type) statusEl.classList.add(type);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    if (!endpoint) {
      setStatus("Form endpoint is not configured yet. Please use the fallback email link.", "is-error");
      return;
    }

    if (/web3forms\.com/.test(endpoint) && (!accessKey || accessKey.includes("REPLACE"))) {
      setStatus("Form access key is missing. Add your Web3Forms key in content/site-content.json.", "is-error");
      return;
    }

    submitBtn.disabled = true;
    setStatus("Sending message...", "");

    try {
      const formData = new FormData(form);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || "Submission failed");
      }

      form.reset();
      setStatus("Message sent successfully. Thanks for reaching out.", "is-success");
    } catch (error) {
      setStatus("Message could not be sent right now. Please use the fallback email link.", "is-error");
    } finally {
      submitBtn.disabled = false;
    }
  });
}

function initNavScrollspy() {
  const main = document.querySelector("main");
  const sectionNodes = document.querySelectorAll("main .section[id]");
  const navLinks = document.querySelectorAll('.top-nav a[href^="#"], .mobile-nav a[href^="#"]');

  if (!main || !sectionNodes.length || !navLinks.length) return;

  function setActive(sectionId) {
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-active", isMatch);
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
      threshold: [0.35, 0.55, 0.75]
    }
  );

  sectionNodes.forEach((section) => observer.observe(section));

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("href")?.slice(1);
      if (targetId) setActive(targetId);
    });
  });

  setActive("hero");
}

(async function initApp() {
  const content = await loadSiteContent();
  const reduceMotion = shouldReduceMotion();

  applySeo(content);
  renderHero(content);
  renderLibrary(content);
  renderConnect(content);
  renderCareerMeta(content);

  initMobileNav();
  initShootingStars(reduceMotion);
  initFocusRail(content.builds || []);
  initHeroTyping(content.hero?.typingWords || []);
  initDottedSurfaceBackground(reduceMotion);
  initCareer(content.career || {});
  initContactForm(content);
  initNavScrollspy();
})();
