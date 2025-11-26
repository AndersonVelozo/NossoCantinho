// ====== CONFIGURE SUA DATA AQUI ======
const relacionamento = new Date("2023-11-19");

// ====== TEMPO JUNTOS ======
function updateTimeTogether() {
  const now = new Date();
  const diff = now - relacionamento;

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diff / (1000 * 60)) % 60);
  const segundos = Math.floor((diff / 1000) % 60);

  const el = document.getElementById("timeTogether");
  if (!el) return;

  el.innerText = `${dias} dias, ${horas}h ${minutos}m ${segundos}s`;
}

// ====== PRÓXIMO ANIVERSÁRIO ======
function updateCountdown() {
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const mes = relacionamento.getMonth();
  const dia = relacionamento.getDate();

  let nextAnniv = new Date(today.getFullYear(), mes, dia);

  if (today > nextAnniv) {
    nextAnniv = new Date(today.getFullYear() + 1, mes, dia);
  }

  const diffMs = nextAnniv - today;
  const dias = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const el = document.getElementById("countdown");
  if (!el) return;

  el.innerText = `${dias} dias`;
}

// ====== CARROSSEL AUTOMÁTICO + PONTINHOS ======
function startAutoGallery() {
  const gallery = document.querySelector(".gallery");
  const dotsContainer = document.getElementById("galleryDots");
  if (!gallery || !dotsContainer) return;

  const imgs = gallery.querySelectorAll("img");
  if (imgs.length <= 1) return;

  let index = 0;
  const intervalMs = 10000;
  const dots = [];

  imgs.forEach((_, i) => {
    const dot = document.createElement("button");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      index = i;
      scrollToImage(index);
      updateDots();
    });
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  function updateDots() {
    dots.forEach((d, i) => {
      d.classList.toggle("active", i === index);
    });
  }

  function scrollToImage(i) {
    const target = imgs[i];
    gallery.scrollTo({
      left: target.offsetLeft - gallery.offsetLeft,
      behavior: "smooth",
    });
  }

  setInterval(() => {
    index = (index + 1) % imgs.length;
    scrollToImage(index);
    updateDots();
  }, intervalMs);
}

// ====== MÚSICA DE FUNDO ======
function setupMusic() {
  const audio = document.getElementById("bgMusic");
  const btn = document.getElementById("musicButton");
  if (!audio || !btn) return;

  function markPlaying(isPlaying) {
    if (isPlaying) {
      btn.classList.add("playing");
      btn.textContent = "🎵 Tocando nossa música";
    } else {
      btn.classList.remove("playing");
      btn.textContent = "🎵 Nossa música";
    }
  }

  const tryAutoPlay = () => {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          markPlaying(true);
        })
        .catch(() => {
          markPlaying(false);
        });
    }
  };

  tryAutoPlay();

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      markPlaying(true);
    } else {
      audio.pause();
      markPlaying(false);
    }
  });

  document.addEventListener(
    "click",
    () => {
      if (audio.paused) {
        audio
          .play()
          .then(() => markPlaying(true))
          .catch(() => {});
      }
    },
    { once: true }
  );
}

// ====== TELA INICIAL (ABRIR CANTINHO) ======
function initIntro() {
  const overlay = document.getElementById("introOverlay");
  const card = document.getElementById("loveCard");
  const btn = document.getElementById("startButton");

  if (!overlay || !card || !btn) return;

  const open = () => {
    // mostra o card
    card.style.display = "block";
    requestAnimationFrame(() => {
      card.classList.remove("love-card--hidden");
    });

    // esconde o overlay
    overlay.classList.add("intro-overlay--hidden");
    setTimeout(() => {
      overlay.style.display = "none";
    }, 600);

    // inicia lógica depois de abrir
    updateTimeTogether();
    updateCountdown();
    startAutoGallery();
    setupMusic();

    setInterval(() => {
      updateTimeTogether();
      updateCountdown();
    }, 1000);
  };

  btn.addEventListener("click", open);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) open();
  });
}

// ====== CORAÇÕES CAINDO ======
function startHearts() {
  const container = document.getElementById("heartsContainer");
  if (!container) return;

  function createHeart() {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = "💗";

    const size = 14 + Math.random() * 10;
    const left = Math.random() * 100;
    const duration = 6 + Math.random() * 4;

    heart.style.left = `${left}%`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.opacity = 0.35 + Math.random() * 0.4;

    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, (duration + 1) * 1000);
  }

  for (let i = 0; i < 12; i++) createHeart();
  setInterval(createHeart, 1500);
}

// ====== INIT ======
window.addEventListener("load", () => {
  initIntro(); // primeiro a tela "Abra para ver nosso cantinho 💖"
  startHearts(); // corações já caindo no fundo
});
