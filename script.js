(() => {
  const $ = id => document.getElementById(id);
  const defaults = {
    nama: "uraa sayangggg",
    pesan: "Happy birthday, sayang ❤️ semoga di umur yang baru ini, semua hal baik datang ke hidup kamu. Semoga kamu selalu diberikan kesehatan, kebahagiaan, dan kekuatan untuk melewati apa pun yang ada di depan",    
  };

  // Ambil data dari URL: ?nama=Rina&pesan=...&dari=...
  const params = new URLSearchParams(location.search);
  const data = {
    nama:  (params.get("nama")  || defaults.nama).slice(0, 30),
    pesan: (params.get("pesan") || defaults.pesan).slice(0, 300),    
  };

  function render() {
    $("name").textContent = data.nama + "!";
    $("msg").textContent  = data.pesan;    
    document.title = "Selamat ulang tahun, " + data.nama + "!";
  }
  render();

  /* ---------- Confetti ---------- */
  const cv = $("fx"), ctx = cv.getContext("2d");
  const colors = ["#d6f55a", "#7ce0c3", "#ffffff", "#ff9b7a", "#4cc27a", "#ffd23f"];
  let bits = [], raf = null;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  $("sub").textContent = "Tiup lilinnya dulu coba sayanggg";
  $("actions").hidden = true;
  function resize() {
    const d = devicePixelRatio || 1;
    cv.width = innerWidth * d; cv.height = innerHeight * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  addEventListener("resize", resize); resize();

  function burst() {
    if (reduce) return;
    const n = 140;
    for (let i = 0; i < n; i++) {
      const side = i % 2 ? 1 : -1;
      bits.push({
        x: innerWidth / 2 + side * innerWidth * 0.1,
        y: innerHeight * 0.45,
        vx: (Math.random() * 9 + 2) * side * (Math.random() > .3 ? 1 : -1),
        vy: -(Math.random() * 13 + 5),
        w: Math.random() * 9 + 5, h: Math.random() * 5 + 3,
        r: Math.random() * 6, vr: (Math.random() - .5) * .4,
        c: colors[(Math.random() * colors.length) | 0], life: 0
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    bits = bits.filter(b => b.y < innerHeight + 30 && b.life < 400);
    for (const b of bits) {
      b.vy += .28; b.vx *= .99; b.x += b.vx; b.y += b.vy; b.r += b.vr; b.life++;
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r);
      ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
    }
    raf = bits.length ? requestAnimationFrame(tick) : null;
    if (!bits.length) ctx.clearRect(0, 0, innerWidth, innerHeight);
  }

  /* ---------- Lagu dari YouTube ---------- */  
  const DEFAULT_SONG = "nAw2ooeubSQ";
  function ytId(s) {
    const m = String(s || "").match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) || String(s).match(/^([\w-]{11})$/);
    return m ? m[1] : null;
  }
  const songId = ytId(params.get("lagu")) || ytId(DEFAULT_SONG);
 
  function playSong() {
    if (!songId || $("player").firstChild) return;
    const f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + songId + "?autoplay=1&rel=0&playsinline=1";
    f.title = "Lagu ultah";
    f.allow = "autoplay; encrypted-media; picture-in-picture";
    f.allowFullscreen = true;
    $("player").appendChild(f);
    $("player").hidden = true;
  }
  function stopSong() {
    $("player").replaceChildren();
    $("player").hidden = true;
  }

  /* ---------- Interaksi */
  const stage = $("stage"), card = $("card");
  function blow() {
    stage.classList.add("out");
    $("blow").hidden = true;
    $("sub").textContent = "Semoga semua harapanmu dikabulkan dan menjadi kenyataan sayang!";
    card.classList.add("show");
    $("actions").hidden = false;
    burst(); setTimeout(burst, 350);
    playSong();
  }
  function relight() {
    stage.classList.remove("out");
    $("blow").hidden = false;
    card.classList.remove("show");
    $("actions").hidden = true;
    $("sub").textContent = "Tiup lilinnya lagi sayanggg 😆";
  }
  $("blow").addEventListener("click", blow);
  $("stage").addEventListener("click", () => { if (!stage.classList.contains("out")) blow(); });
  $("again").addEventListener("click", relight);
  

  /* ---------- ucapan*/
  const editor = $("editor");
  $("edit").addEventListener("click", () => {
    $("fName").value = data.nama === defaults.nama ? "" : data.nama;
    $("fMsg").value  = data.pesan === defaults.pesan ? "" : data.pesan;    
    editor.classList.toggle("open");
    if (editor.classList.contains("open")) $("fName").focus();
  });
  function readForm() {
    data.nama  = $("fName").value.trim()  || defaults.nama;
    data.pesan = $("fMsg").value.trim()   || defaults.pesan;    
  }
  $("apply").addEventListener("click", () => {
    readForm(); render();
    $("hint").textContent = "Ucapan diperbarui.";
  });
  $("copy").addEventListener("click", async () => {
    readForm(); render();
    const u = new URL(location.href.split("?")[0]);
    u.searchParams.set("nama", data.nama);
    u.searchParams.set("pesan", data.pesan);    
    try {
      await navigator.clipboard.writeText(u.toString());
      $("hint").textContent = "Tautan tersalin. Kirim ke yang berulang tahun.";
    } catch (e) {
      $("hint").textContent = "Salin manual: " + u.toString();
    }
  });
})();
