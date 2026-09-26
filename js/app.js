(function () {
  const cfg = window.STORY;
  const chapters = [...document.querySelectorAll(".chapter")];
  const nav = document.getElementById("chapters");
  let page = 0;
  let unlocked = false;

  chapters.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Chapter " + (i + 1));
    if (i === 0) b.classList.add("on");
    b.addEventListener("click", () => {
      if (i > 0 && !unlocked) return;
      go(i);
    });
    nav.appendChild(b);
  });

  function go(i) {
    page = i;
    chapters.forEach((c, n) => c.classList.toggle("is-on", n === i));
    [...nav.children].forEach((b, n) => b.classList.toggle("on", n === i));
    if (i === 1) maybeOpenLetter();
  }

  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dir = Number(btn.getAttribute("data-go"));
      go(Math.max(0, Math.min(chapters.length - 1, page + dir)));
    });
  });

  const form = document.getElementById("lockForm");
  const lockBody = document.getElementById("lockBody");
  const hint = document.getElementById("hint");
  const curtain = document.getElementById("curtain");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = pad(document.getElementById("dd").value);
    const m = pad(document.getElementById("mm").value);
    const y = document.getElementById("yyyy").value.trim();
    const ok = d === cfg.secret.d && m === cfg.secret.m && y === cfg.secret.y;
    if (!ok) {
      lockBody.classList.remove("wrong");
      void lockBody.offsetWidth;
      lockBody.classList.add("wrong");
      hint.textContent = "ye din nahi hai… socho, jo sirf tum jaante ho";
      return;
    }
    unlocked = true;
    curtain.classList.remove("hidden");
    setTimeout(() => {
      curtain.classList.add("hidden");
      go(1);
    }, 1600);
  });

  function pad(v) {
    v = String(v).trim();
    return v.length === 1 ? "0" + v : v;
  }

  const wax = document.getElementById("wax");
  const envelope = document.getElementById("envelope");
  const scroll = document.getElementById("scroll");
  const ink = document.getElementById("ink");
  const letterNav = document.getElementById("letterNav");
  let letterOpened = false;

  function maybeOpenLetter() {}

  wax.addEventListener("click", () => {
    if (letterOpened) return;
    letterOpened = true;
    envelope.classList.add("open");
    setTimeout(() => {
      envelope.classList.add("hidden");
      scroll.classList.remove("hidden");
      letterNav.classList.remove("hidden");
      typeLetter();
    }, 700);
  });

  function typeLetter() {
    ink.innerHTML = "";
    cfg.letter.forEach((line, i) => {
      const p = document.createElement("p");
      ink.appendChild(p);
      setTimeout(() => typeInto(p, line), i * 2200);
    });
  }

  function typeInto(el, text) {
    let n = 0;
    const t = setInterval(() => {
      el.textContent = text.slice(0, ++n);
      if (n >= text.length) clearInterval(t);
    }, 18);
  }

  const shots = [...document.querySelectorAll(".shot")];
  const sprockets = document.getElementById("sprockets");
  let shot = 0;
  shots.forEach((_, i) => {
    const b = document.createElement("button");
    if (i === 0) b.classList.add("on");
    b.addEventListener("click", () => showShot(i));
    sprockets.appendChild(b);
  });
  function showShot(i) {
    shot = (i + shots.length) % shots.length;
    shots.forEach((s, n) => s.classList.toggle("is-show", n === shot));
    [...sprockets.children].forEach((b, n) => b.classList.toggle("on", n === shot));
  }
  document.getElementById("prevShot").onclick = () => showShot(shot - 1);
  document.getElementById("nextShot").onclick = () => showShot(shot + 1);

  const deny = document.getElementById("deny");
  const allow = document.getElementById("allow");
  const askLine = document.getElementById("askLine");
  const askBox = document.getElementById("askBox");
  const afterglow = document.getElementById("afterglow");
  const lines = [
    "ek baar soch lo…",
    "sach mein nahi?",
    "dil toota sa lagega",
    "bas haan bol do na"
  ];
  let nopes = 0;

  deny.addEventListener("click", (e) => {
    nopes += 1;
    askLine.textContent = lines[(nopes - 1) % lines.length];
    const area = deny.parentElement.getBoundingClientRect();
    const maxX = Math.max(20, area.width - deny.offsetWidth - 8);
    const maxY = 40;
    deny.style.position = "relative";
    deny.style.left = Math.floor(Math.random() * maxX - maxX / 2) + "px";
    deny.style.top = Math.floor(Math.random() * maxY - 10) + "px";
    if (nopes > 5) deny.style.transform = "scale(" + Math.max(0.4, 1 - nopes * 0.08) + ")";
    e.stopPropagation();
  });

  allow.addEventListener("click", () => {
    askBox.classList.add("hidden");
    afterglow.classList.remove("hidden");
    confetti();
  });

  document.getElementById("again").addEventListener("click", () => {
    letterOpened = false;
    nopes = 0;
    deny.style.left = deny.style.top = deny.style.transform = "";
    envelope.classList.remove("hidden", "open");
    scroll.classList.add("hidden");
    letterNav.classList.add("hidden");
    ink.innerHTML = "";
    askBox.classList.remove("hidden");
    afterglow.classList.add("hidden");
    go(0);
  });

  function confetti() {
    for (let i = 0; i < 36; i++) {
      const s = document.createElement("i");
      s.textContent = ["✦", "✧", "·"][i % 3];
      Object.assign(s.style, {
        position: "fixed",
        left: Math.random() * 100 + "vw",
        top: "-10px",
        zIndex: 50,
        color: i % 2 ? "#e0b25a" : "#f3ead8",
        fontStyle: "normal",
        pointerEvents: "none",
        animation: "rise 2.4s ease forwards",
        transform: "translateY(" + (60 + Math.random() * 80) + "vh)"
      });
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 2500);
    }
  }

  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  let stars = [];
  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random()
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      s.a += 0.01;
      ctx.globalAlpha = 0.35 + Math.abs(Math.sin(s.a)) * 0.65;
      ctx.fillStyle = "#f7edd4";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  addEventListener("resize", resize);
  resize();
  draw();

  ["dd", "mm"].forEach((id) => {
    document.getElementById(id).addEventListener("input", (e) => {
      if (e.target.value.length === 2) {
        const next = id === "dd" ? "mm" : "yyyy";
        document.getElementById(next).focus();
      }
    });
  });
})();
