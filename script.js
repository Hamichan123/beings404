/* ============================================
   Beings — Main Script
   ============================================ */

/* ── Paste your deployed Apps Script Web App URL here ── */
const SHEET_URL = "https://script.google.com/macros/s/AKfycbxGA0t8vQYk7AcZDfpSZvsPprMiAqkvvEx25wwvqt1VnYH3EEwRHrZ9CA1dTIwA3qvMJQ/exec";

const GALLERY_IMAGES = [
  "img/img1 (1).png",
  "img/img1 (2).png",
  "img/img1 (3).png",
  "img/img1 (4).png",
  "img/img1 (5).png",
  "img/img1 (6).png"
];

/* ---------- Validation ---------- */

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isXUrl(str) {
  try {
    const url = new URL(str);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      (url.hostname === "x.com" || url.hostname === "www.x.com" ||
       url.hostname === "twitter.com" || url.hostname === "www.twitter.com")
    );
  } catch {
    return false;
  }
}

function isValidEvmAddress(str) {
  return /^0x[a-fA-F0-9]{40}$/.test(str.trim());
}

/* ---------- Scroll Reveal ---------- */

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  document.querySelectorAll(".reveal-stagger").forEach((container) => {
    container.querySelectorAll(":scope > *").forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.1}s`;
      observer.observe(el);
    });
  });
}

/* ---------- Page Transitions ---------- */

function initPageTransitions() {
  const overlay = document.getElementById("pageTransition");
  if (!overlay) return;

  document.querySelectorAll("[data-navigate]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      overlay.classList.add("active");
      setTimeout(() => {
        window.location.href = href;
      }, 450);
    });
  });
}

/* ---------- Gallery & Lightbox ---------- */

function initGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  let currentIndex = 0;

  GALLERY_IMAGES.forEach((src, i) => {
    const item = document.createElement("div");
    item.className = "gallery-item reveal";
    item.style.transitionDelay = `${i * 0.08}s`;
    item.innerHTML = `
      <img src="${src}" alt="Beings artwork ${i + 1}" loading="lazy">
      <div class="gallery-overlay"><span>View full size</span></div>
    `;
    item.addEventListener("click", () => openLightbox(i));
    grid.appendChild(item);
  });

  initScrollReveal();

  const lightbox   = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn   = document.getElementById("lightboxClose");
  const prevBtn    = document.getElementById("lightboxPrev");
  const nextBtn    = document.getElementById("lightboxNext");

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = GALLERY_IMAGES[currentIndex];
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    lightboxImg.src = GALLERY_IMAGES[currentIndex];
  }

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => navigate(-1));
  nextBtn.addEventListener("click", () => navigate(1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape")      closeLightbox();
    if (e.key === "ArrowLeft")   navigate(-1);
    if (e.key === "ArrowRight")  navigate(1);
  });
}

/* ---------- Confetti ---------- */

function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.id = "confettiCanvas";
  document.body.appendChild(canvas);
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx    = canvas.getContext("2d");
  const colors = ["#9D5BE0", "#45C8F0", "#BBE986", "#F0407A", "#46B8A6", "#282B5C", "#FFD166"];
  const shapes = ["rect", "circle", "triangle"];

  const particles = Array.from({ length: 140 }, () => ({
    x:        Math.random() * canvas.width,
    y:        -20 - Math.random() * 60,
    vx:       (Math.random() - 0.5) * 7,
    vy:       Math.random() * 3.5 + 1.5,
    size:     Math.random() * 10 + 5,
    color:    colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.22,
    shape:    shapes[Math.floor(Math.random() * shapes.length)],
  }));

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const alpha = Math.max(0, 1 - frame / 160);

    particles.forEach((p) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.12;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle  = p.color;
      ctx.globalAlpha = alpha;

      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -p.size / 2);
        ctx.lineTo(p.size / 2, p.size / 2);
        ctx.lineTo(-p.size / 2, p.size / 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    });

    frame++;
    if (frame < 210) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }
  animate();
}

/* ---------- Chat Bot ---------- */

function initChatBot() {
  const chatWrapper = document.getElementById("chatWrapper");
  if (!chatWrapper) return;

  const botAvatarImg     = document.getElementById("botAvatarImg");
  const chatMessages     = document.getElementById("chatMessages");
  const chatPhaseBadge   = document.getElementById("chatPhase");
  const chatProgressFill = document.getElementById("chatProgressFill");
  const chatInput        = document.getElementById("chatInput");
  const chatSend         = document.getElementById("chatSend");

  const avatarSrc = "img/img1 (1).png";
  botAvatarImg.src = avatarSrc;
  const submission = { commentLink: "", walletAddress: "" };

  /* Auto-start immediately */
  startConversation();

  /* ── Phase / progress helpers ── */
  function setPhase(n) {
    if (n > 4) {
      chatPhaseBadge.textContent = "Complete! 🎉";
      chatPhaseBadge.classList.add("complete");
      chatProgressFill.style.width = "100%";
    } else {
      chatPhaseBadge.textContent = `Phase ${n} / 4`;
      chatPhaseBadge.classList.remove("complete");
      chatProgressFill.style.width = `${(n / 4) * 100}%`;
    }
  }

  /* ── Input mode ── */
  function enableInput(mode /* "comment" | "wallet" */) {
    chatInput.dataset.mode   = mode;
    chatInput.disabled       = false;
    chatSend.disabled        = false;
    chatInput.value          = "";
    chatInput.className      = "chat-text-input";
    chatInput.placeholder    = mode === "comment"
      ? "Paste your comment link here…"
      : "Paste your 0x… wallet address…";
    setTimeout(() => chatInput.focus(), 120);
  }

  function disableInput(placeholder = "Waiting for your selection…") {
    chatInput.disabled    = true;
    chatSend.disabled     = true;
    chatInput.placeholder = placeholder;
    chatInput.dataset.mode = "";
  }

  /* ── Scroll to bottom ── */
  function scrollDown() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /* ── Escape HTML ── */
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* ── Add user bubble ── */
  function addUserBubble(text) {
    const el = document.createElement("div");
    el.className = "chat-msg user";
    el.innerHTML = `<div class="msg-bubble">${esc(text)}</div>`;
    chatMessages.appendChild(el);
    scrollDown();
  }

  /* ── Add bot message (returns Promise that resolves after the bubble appears) ── */
  function botSay(html, typingMs = 950) {
    return new Promise((resolve) => {
      /* typing indicator */
      const typing = document.createElement("div");
      typing.className = "chat-msg bot";
      typing.innerHTML = `
        <img src="${avatarSrc}" class="msg-avatar" alt="Bot">
        <div class="msg-bubble typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>`;
      chatMessages.appendChild(typing);
      scrollDown();

      setTimeout(() => {
        typing.remove();
        const el = document.createElement("div");
        el.className = "chat-msg bot";
        el.innerHTML = `
          <img src="${avatarSrc}" class="msg-avatar" alt="Bot">
          <div class="msg-bubble">${html}</div>`;
        chatMessages.appendChild(el);
        scrollDown();
        resolve(el);
      }, typingMs);
    });
  }

  /* ── Add quick-reply buttons ── */
  function addQuickReplies(buttons) {
    const wrap = document.createElement("div");
    wrap.className = "quick-replies";
    buttons.forEach((btn, i) => {
      const el = document.createElement("button");
      el.className = `quick-reply-btn ${btn.cls || ""}`;
      el.textContent = btn.label;
      el.style.animationDelay = `${i * 0.07}s`;
      el.addEventListener("click", () => {
        /* remove ALL pending quick-reply rows */
        document.querySelectorAll(".quick-replies").forEach((qr) => qr.remove());
        btn.onClick(el);
      });
      wrap.appendChild(el);
    });
    chatMessages.appendChild(wrap);
    scrollDown();
    return wrap;
  }

  /* ── Copy-to-clipboard button ── */
  function addCopyRow(text, label) {
    const wrap = document.createElement("div");
    wrap.className = "quick-replies";
    wrap.style.marginTop = "2px";
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = label;
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = "Copied ✓";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = label;
          btn.classList.remove("copied");
        }, 1800);
      });
    });
    wrap.appendChild(btn);
    chatMessages.appendChild(wrap);
    scrollDown();
  }

  /* ─────────────────────────────────
     CONVERSATION FLOW
     ───────────────────────────────── */

  async function startConversation() {
    disableInput();
    setPhase(0);

    await botSay(
      "gm! 👋 Welcome to the <strong>Beings</strong> waitlist.<br>I'll walk you through 4 quick steps. Ready?",
      800
    );

    addQuickReplies([
      { label: "Let's go →", cls: "accent", onClick: () => phase1() }
    ]);
  }

  /* ── Phase 1: Follow ── */
  async function phase1() {
    setPhase(1);
    await botSay("Step 1 — follow us on X so you don't miss the drop 🐦");

    addQuickReplies([
      {
        label: "Follow @404_Beings on X",
        cls: "link",
        onClick: () => {
          window.open("https://x.com/404_Beings", "_blank", "noopener,noreferrer");
          setTimeout(() => {
            addQuickReplies([
              { label: "Done ✅", cls: "done", onClick: () => phase2() }
            ]);
          }, 700);
        }
      }
    ]);
    addCopyRow("@404_Beings", "Copy @404_Beings");
  }

  /* ── Phase 2: Like & Retweet ── */
  async function phase2() {
    addUserBubble("Done ✅");
    setPhase(2);

    const TWEET_URL = "https://x.com/404_Beings/status/2066177370612994274";
    await botSay("Nice! Step 2 — like <strong>AND</strong> retweet our announcement 🔁❤️");

    addQuickReplies([
      {
        label: "View Tweet",
        cls: "link",
        onClick: () => {
          window.open(TWEET_URL, "_blank", "noopener,noreferrer");
          setTimeout(() => {
            addQuickReplies([
              { label: "I liked & retweeted ✅", cls: "done", onClick: () => phase3() }
            ]);
          }, 700);
        }
      }
    ]);
    addCopyRow(TWEET_URL, "Copy tweet link");
  }

  /* ── Phase 3: Comment link ── */
  async function phase3() {
    addUserBubble("I liked & retweeted ✅");
    setPhase(3);
    await botSay(
      "Step 3 — leave a comment on that tweet, then paste the link to <strong>YOUR</strong> comment below 👇"
    );
    enableInput("comment");
  }

  /* ── Phase 4: EVM wallet ── */
  async function phase4(commentLink) {
    submission.commentLink = commentLink;
    addUserBubble(commentLink);
    disableInput();

    await botSay("Got it! 🔗 Almost there…", 700);

    setPhase(4);
    await botSay(
      "Last one — paste your EVM wallet address (<code style='background:rgba(40,43,92,0.07);padding:1px 5px;border-radius:4px;font-size:0.85em;'>0x…</code>) so we can reach you 👛",
      800
    );
    enableInput("wallet");
  }

  /* ── Completion ── */
  async function complete(walletAddress) {
    submission.walletAddress = walletAddress;
    addUserBubble(walletAddress);
    disableInput("You're in! 🎉");

    /* persist locally */
    const record = {
      commentLink:   submission.commentLink,
      walletAddress: submission.walletAddress,
      timestamp:     new Date().toISOString()
    };
    console.log("Beings Waitlist Submission:", record);
    try {
      const prev = JSON.parse(localStorage.getItem("beingsWaitlist") || "[]");
      prev.push(record);
      localStorage.setItem("beingsWaitlist", JSON.stringify(prev));
    } catch (_) { /* storage unavailable */ }

    /* send to Google Sheet */
    if (SHEET_URL && SHEET_URL !== "YOUR_APPS_SCRIPT_WEB_APP_URL") {
      fetch(SHEET_URL, {
        method:  "POST",
        mode:    "no-cors",          /* Apps Script requires no-cors */
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(record)
      }).catch((err) => console.warn("Sheet sync failed:", err));
    }

    setPhase(5); /* triggers "Complete! 🎉" label */

    await botSay(
      "🎉 <strong>You're in!</strong> Welcome to the Beings.<br>We'll be in touch — stay early.",
      900
    );

    /* confetti */
    launchConfetti();

    /* summary card */
    setTimeout(() => {
      const card = document.createElement("div");
      card.className = "completion-card";
      card.innerHTML = `
        <h3>✅ Application Complete</h3>
        <div class="completion-step">
          <span class="step-check">✓</span>Followed @404_Beings on X
        </div>
        <div class="completion-step">
          <span class="step-check">✓</span>Liked &amp; retweeted the announcement
        </div>
        <div class="completion-step">
          <span class="step-check">✓</span>Comment link submitted
        </div>
        <div class="completion-step">
          <span class="step-check">✓</span>EVM wallet address submitted
        </div>`;
      chatMessages.appendChild(card);
      scrollDown();
    }, 500);
  }

  /* ── Send handler ── */
  function handleSend() {
    const val  = chatInput.value.trim();
    const mode = chatInput.dataset.mode;
    if (!val || chatInput.disabled) return;

    if (mode === "comment") {
      if (isXUrl(val)) {
        chatInput.classList.remove("invalid");
        chatInput.classList.add("valid");
        disableInput();
        phase4(val);
      } else {
        chatInput.classList.add("invalid");
        chatInput.classList.remove("valid");
        botSay(
          "Hmm, that doesn't look like a valid X/Twitter link. " +
          "Please paste the full URL to your comment (e.g. <em>https://x.com/…</em>) 🔍",
          600
        );
      }
      return;
    }

    if (mode === "wallet") {
      if (isValidEvmAddress(val)) {
        chatInput.classList.remove("invalid");
        chatInput.classList.add("valid");
        disableInput();
        complete(val);
      } else {
        chatInput.classList.add("invalid");
        chatInput.classList.remove("valid");
        botSay(
          "That doesn't look right. An EVM address starts with <code style='background:rgba(40,43,92,0.07);padding:1px 5px;border-radius:4px;font-size:0.85em;'>0x</code> " +
          "and is exactly 42 characters. Give it another try! 👀",
          600
        );
      }
    }
  }

  chatSend.addEventListener("click", handleSend);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !chatInput.disabled) handleSend();
  });
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", () => {
  initPageTransitions();
  initGallery();
  initChatBot();
  if (!document.getElementById("galleryGrid")) {
    initScrollReveal();
  }
});
