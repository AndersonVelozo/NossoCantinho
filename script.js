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

// ====== PRÓXIMO MÊSVERSÁRIO ======

function updateCountdown() {
  const now = new Date();

  // hoje à meia-noite (só a data, sem hora)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // mês e dia do aniversário (data do relacionamento)
  const mes = relacionamento.getMonth(); // 0–11
  const dia = relacionamento.getDate(); // 1–31

  // aniversário deste ano
  let nextAnniv = new Date(today.getFullYear(), mes, dia);

  // se já passou neste ano, vai para o próximo ano
  if (today > nextAnniv) {
    nextAnniv = new Date(today.getFullYear() + 1, mes, dia);
  }

  const diffMs = nextAnniv - today;
  const dias = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const el = document.getElementById("countdown");
  if (!el) return;

  // hoje = 0 dias, depois começa a contar pro próximo
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

  // cria os pontinhos
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
          // se o navegador bloquear, o botão fica para o usuário apertar
          markPlaying(false);
        });
    }
  };

  // tenta tocar assim que configurar
  tryAutoPlay();

  // botão manual
  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      markPlaying(true);
    } else {
      audio.pause();
      markPlaying(false);
    }
  });

  // primeira interação na tela também tenta tocar
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

// ====== INIT ======
window.addEventListener("load", () => {
  updateTimeTogether();
  updateCountdown();
  startAutoGallery();
  setupMusic();

  setInterval(() => {
    updateTimeTogether();
    updateCountdown();
  }, 1000);
});
