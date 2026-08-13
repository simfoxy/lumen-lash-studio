/* ============================================================
   Noir & Lacquer — Nail Atelier
   Hero: GSAP ScrollTrigger scrub of a JPG frame sequence + Lenis smooth scroll
   Everything else: IntersectionObserver reveals + counters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Lenis smooth scroll wired into GSAP ticker ---------- */
  let lenis = null;
  if (window.Lenis && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Nav: solid on light sections, transparent on hero ---------- */
  const nav = document.getElementById('siteNav');
  const lightSections = document.querySelectorAll('.scheme-warm, .scheme-light');
  let navTick = false;
  function updateNav() {
    navTick = false;
    let onLight = false;
    lightSections.forEach(sec => {
      const r = sec.getBoundingClientRect();
      if (r.top < 84 && r.bottom > 84) onLight = true;
    });
    nav.classList.toggle('on-light', onLight);
  }
  window.addEventListener('scroll', () => {
    if (!navTick) { navTick = true; requestAnimationFrame(updateNav); }
  }, { passive: true });
  updateNav();

  /* ---------- Mobile menu ---------- */
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  burgerBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burgerBtn.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', false);
    mobileMenu.setAttribute('aria-hidden', true);
  }));

  /* ============================================================
     HERO — pinned scroll frame-sequence reveal
     ============================================================ */
  const TOTAL_FRAMES = 76;
  const FRAME_PATH = './frames/frame-';
  const FRAME_EXT = '.jpg';
  const FRAME_PADDING = 5;
  const COAT_STAGES = ['Bare', 'Base Coat', 'Color Coat', 'Hand-Painted Detail', 'Top Coat', 'Finished Set'];

  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  const heroText = document.getElementById('heroText');
  const heroCoatNum = document.querySelector('#heroCoat .hero-coat-num');
  const heroCoatStage = document.querySelector('#heroCoat .hero-coat-stage');
  const heroOuter = document.querySelector('.hero-outer');

  const frameNum = (i) => String(i).padStart(FRAME_PADDING, '0');
  const images = [];
  const seq = { frame: 0 };
  let rendered = -1;
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = `${FRAME_PATH}${frameNum(i)}${FRAME_EXT}`;
    img.onload = () => { if (images.indexOf(img) === Math.round(seq.frame)) render(); };
    images.push(img);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
    canvas.height = window.innerHeight * Math.min(window.devicePixelRatio || 1, 2);
    rendered = -1; // canvas dimension change clears the bitmap — force a redraw
    render();
  }

  function render() {
    const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(seq.frame)));
    if (idx === rendered) return;
    const img = images[idx];
    if (!img.complete || img.naturalWidth === 0) return;
    rendered = idx;

    const cw = canvas.width, ch = canvas.height;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let dw, dh, dx, dy;
    if (ir > cr) { dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0; }
    else { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2; }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);

    const stageIdx = Math.min(COAT_STAGES.length - 1, Math.floor((idx / TOTAL_FRAMES) * COAT_STAGES.length));
    heroCoatNum.textContent = `COAT ${String(stageIdx + 1).padStart(2, '0')} / ${String(COAT_STAGES.length).padStart(2, '0')}`;
    heroCoatStage.textContent = ` — ${COAT_STAGES[stageIdx]}`;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
    }

    gsap.to(seq, {
      frame: TOTAL_FRAMES - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: heroOuter,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
      onUpdate: render,
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: heroOuter,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      },
    })
      .to(heroText, { opacity: 1, duration: 0.1 }, 0.10)
      .to(heroText, { opacity: 1, duration: 0.5 }, 0.10)
      .to(heroText, { opacity: 0, duration: 0.2 }, 0.60);
  } else {
    heroText.style.opacity = 1;
  }

  /* ============================================================
     CATALOG — six services, priced, sharp-edged, full color
     ============================================================ */
  const SERVICES = [
    { id: 'classic', name: 'Classic Manicure', type: 'Natural & Precise', desc: 'Shape, cuticle work, and a single clean coat — the everyday standard done right.', price: 45, tint1: '#EBD9C9', tint2: '#D8B99C' },
    { id: 'gel', name: 'Gel Overlay', type: 'Glass-Like Shine', desc: 'A glossy, chip-resistant overlay on your natural nail — no length added.', price: 65, tint1: '#F3E7DE', tint2: '#C9C2B8' },
    { id: 'fullset', name: 'Full Set', type: 'Sculpted Length', desc: 'Acrylic or hard gel, built and shaped to the length and curve you want.', price: 95, tint1: '#7A0E1F', tint2: '#3B0812' },
    { id: 'ombre', name: 'Ombré / Chrome', type: 'Gradient or Mirror', desc: 'A seamless gradient fade or a mirror-chrome finish, buffed to a hard shine.', price: 110, tint1: '#B8BEC4', tint2: '#6B7076' },
    { id: 'art', name: 'Hand-Painted Art', type: 'Custom, Per Set', desc: 'Fine linework, florals, or a reference design — painted freehand, layer by layer.', price: 130, tint1: '#B0102A', tint2: '#5C0316' },
    { id: 'builder', name: 'Builder Gel Extensions', type: 'Strength, Natural Look', desc: 'Reinforced length that reads like your own nail — built for durability.', price: 120, tint1: '#E4D6C3', tint2: '#A69572' },
  ];

  const POLICIES = [
    { q: 'Cancellation Window', a: 'We ask for at least 48 hours notice to cancel or reschedule so the seat can be offered to someone else.' },
    { q: 'Late Arrival & Late Fee', a: 'A 10-minute grace period is built into every booking. After that, a $15 late fee applies, and arrivals past 15 minutes may need to be rescheduled to protect the next appointment.' },
    { q: 'Deposit & No-Show', a: 'A $25 deposit secures every booking and is applied toward your service. No-shows and same-day cancellations forfeit the deposit.' },
    { q: 'Repair Window', a: 'Chips or breaks within 3 days of your appointment are repaired free of charge. After that, repairs are billed at a reduced per-nail rate.' },
    { q: 'Guest Policy', a: "This is a small, appointment-only studio — we're not able to accommodate plus-ones or children during your visit." },
    { q: 'Health & Allergy Note', a: 'Please tell us about any allergies or sensitivities before booking, especially to acrylics or specific polish formulas, so we can plan accordingly.' },
  ];

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function money(n) { return '$' + n; }

  const catalogGrid = document.getElementById('catalogGrid');
  SERVICES.forEach((s, i) => {
    const card = el('div', 'catalog-card reveal');
    card.style.transitionDelay = (i % 3) * 0.1 + 's';

    const swatch = el('div', 'catalog-swatch');
    swatch.style.setProperty('--tint1', s.tint1);
    swatch.style.setProperty('--tint2', s.tint2);
    swatch.innerHTML =
      '<div class="catalog-swatch-inner"></div>' +
      '<span class="catalog-tag">Add Photo</span>' +
      '<span class="catalog-price">' + money(s.price) + '</span>' +
      '<span class="catalog-caption">' + s.desc + '</span>';
    card.appendChild(swatch);

    const body = el('div', 'catalog-body');
    body.innerHTML =
      '<h3>' + s.name + '</h3>' +
      '<span class="catalog-type">' + s.type + '</span>' +
      '<p>' + s.desc + '</p>';
    const bookBtn = el('button', 'catalog-book', 'Book this set →');
    bookBtn.addEventListener('click', () => startBookingWithService(s));
    body.appendChild(bookBtn);
    card.appendChild(body);
    catalogGrid.appendChild(card);
  });

  /* ============================================================
     POLICIES — accordion
     ============================================================ */
  const policyList = document.getElementById('policyList');
  POLICIES.forEach(p => {
    const item = el('div', 'policy-item');
    item.innerHTML =
      '<button class="policy-q" aria-expanded="false">' +
        '<span>' + p.q + '</span>' +
        '<span class="policy-icon"></span>' +
      '</button>' +
      '<div class="policy-a"><div class="policy-a-inner"><p>' + p.a + '</p></div></div>';
    const btn = item.querySelector('.policy-q');
    btn.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      policyList.querySelectorAll('.policy-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.policy-q').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
    policyList.appendChild(item);
  });

  /* ============================================================
     BOOKING CHAT ENGINE — texting the studio, not a form
     ============================================================ */
  const thread = document.getElementById('chatThread');
  const inputArea = document.getElementById('chatInputArea');
  const toast = document.getElementById('toast');

  let chat = { name: '', service: null, date: '', time: '', phone: '', preselect: null, started: false };

  function scrollToBottom() {
    requestAnimationFrame(() => { thread.scrollTop = thread.scrollHeight; });
  }
  function addBubble(text, dir) {
    const row = el('div', 'bubble-row ' + dir);
    row.appendChild(el('div', 'bubble ' + dir, text));
    thread.appendChild(row);
    scrollToBottom();
  }
  function addTimestamp() {
    const now = new Date();
    const h = now.getHours() % 12 || 12;
    const m = String(now.getMinutes()).padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    thread.appendChild(el('div', 'timestamp', 'Today ' + h + ':' + m + ' ' + ampm));
    scrollToBottom();
  }
  function showTyping(cb, delay) {
    const row = el('div', 'typing-row');
    row.setAttribute('aria-hidden', 'true');
    row.innerHTML = '<div class="typing-bubble"><span></span><span></span><span></span></div>';
    thread.appendChild(row);
    scrollToBottom();
    setTimeout(() => { row.remove(); cb(); }, delay || 900);
  }
  function studioSays(text, cb) { showTyping(() => { addBubble(text, 'in'); if (cb) cb(); }); }
  function clientSays(text) { addBubble(text, 'out'); }
  function setInputArea(node) { inputArea.innerHTML = ''; inputArea.appendChild(node); }
  function sendIcon() {
    return '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function stepName() {
    studioSays("Hi! Thanks for reaching out — what's your name?", () => {
      const wrap = el('div', 'field-row',
        '<input type="text" id="nameInput" placeholder="Type your name" autocomplete="name" aria-label="Your name">' +
        '<button class="send-btn" id="nameSend" disabled aria-label="Send">' + sendIcon() + '</button>');
      setInputArea(wrap);
      const input = wrap.querySelector('#nameInput');
      const send = wrap.querySelector('#nameSend');
      input.addEventListener('input', () => { send.disabled = input.value.trim().length === 0; });
      input.addEventListener('keydown', e => { if (e.key === 'Enter' && !send.disabled) submit(); });
      send.addEventListener('click', submit);
      function submit() {
        const val = input.value.trim();
        if (!val) return;
        chat.name = val;
        clientSays(val);
        inputArea.innerHTML = '';
        stepService();
      }
      input.focus();
    });
  }

  function stepService() {
    if (chat.preselect) {
      const svc = chat.preselect;
      studioSays('Great to meet you, ' + chat.name + '! I have you down for the <strong>' + svc.name + '</strong> (' + money(svc.price) + ') — sound good?', () => {
        const wrap = el('div', 'chip-row');
        const yes = el('button', 'chip', "Yes, that's right");
        const no = el('button', 'chip', 'Pick something else');
        yes.addEventListener('click', () => { clientSays("Yes, that's right"); chat.service = svc; inputArea.innerHTML = ''; stepDateTime(); });
        no.addEventListener('click', () => { clientSays('Let me pick something else'); chat.preselect = null; inputArea.innerHTML = ''; stepService(); });
        wrap.appendChild(yes); wrap.appendChild(no);
        setInputArea(wrap);
      });
      return;
    }
    studioSays('Which service can I book you in for?', () => {
      const wrap = el('div', 'chip-row');
      SERVICES.forEach(s => {
        const chip = el('button', 'chip', s.name + ' · ' + money(s.price));
        chip.addEventListener('click', () => { clientSays(s.name); chat.service = s; inputArea.innerHTML = ''; stepDateTime(); });
        wrap.appendChild(chip);
      });
      setInputArea(wrap);
    });
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }
  function formatTime(t) {
    if (!t) return '';
    const [hRaw, m] = t.split(':');
    let h = parseInt(hRaw, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + m + ' ' + ampm;
  }

  function stepDateTime() {
    studioSays('Perfect. What day and time works best for you?', () => {
      const todayISO = new Date().toISOString().split('T')[0];
      const wrap = el('div', '',
        '<div class="dt-row">' +
          '<input type="date" id="dateInput" min="' + todayISO + '" aria-label="Preferred date">' +
          '<input type="time" id="timeInput" aria-label="Preferred time">' +
          '<button class="send-btn" id="dtSend" disabled aria-label="Send">' + sendIcon() + '</button>' +
        '</div>');
      setInputArea(wrap);
      const dateInput = wrap.querySelector('#dateInput');
      const timeInput = wrap.querySelector('#timeInput');
      const send = wrap.querySelector('#dtSend');
      function check() { send.disabled = !(dateInput.value && timeInput.value); }
      dateInput.addEventListener('input', check);
      timeInput.addEventListener('input', check);
      send.addEventListener('click', () => {
        chat.date = dateInput.value; chat.time = timeInput.value;
        clientSays(formatDate(chat.date) + ' at ' + formatTime(chat.time));
        inputArea.innerHTML = '';
        stepPhone();
      });
    });
  }

  function stepPhone() {
    studioSays("Great. What's the best mobile number to text your confirmation to?", () => {
      const wrap = el('div', '',
        '<div class="field-row">' +
          '<input type="tel" id="phoneInput" placeholder="(555) 123-4567" autocomplete="tel" aria-label="Mobile phone number">' +
          '<button class="send-btn" id="phoneSend" disabled aria-label="Send">' + sendIcon() + '</button>' +
        '</div>' +
        '<div class="field-hint" id="phoneHint">We\'ll only use this to confirm your appointment.</div>');
      setInputArea(wrap);
      const input = wrap.querySelector('#phoneInput');
      const send = wrap.querySelector('#phoneSend');
      const hint = wrap.querySelector('#phoneHint');
      input.addEventListener('input', () => { send.disabled = input.value.replace(/\D/g, '').length < 10; });
      input.addEventListener('keydown', e => { if (e.key === 'Enter' && !send.disabled) submit(); });
      send.addEventListener('click', submit);
      function submit() {
        const digits = input.value.replace(/\D/g, '');
        if (digits.length < 10) {
          hint.textContent = 'That number looks a little short — mind double-checking it?';
          hint.classList.add('error');
          return;
        }
        chat.phone = input.value.trim();
        clientSays(chat.phone);
        inputArea.innerHTML = '';
        stepSummary();
      }
      input.focus();
    });
  }

  function stepSummary() {
    studioSays("Here's what I have — take a look and confirm whenever you're ready:", () => {
      const summary = el('div', 'bubble-row in');
      summary.innerHTML =
        '<div class="bubble in" style="max-width:88%;">' +
          '<strong>' + chat.service.name + '</strong> · ' + money(chat.service.price) + '<br>' +
          formatDate(chat.date) + ' at ' + formatTime(chat.time) + '<br>' +
          chat.name + ' · ' + chat.phone +
        '</div>';
      thread.appendChild(summary);
      scrollToBottom();
      const wrap = el('div');
      const btn = el('button', 'confirm-btn', 'Confirm Booking ' + sendIcon());
      btn.addEventListener('click', () => {
        clientSays('Confirmed — see you then!');
        inputArea.innerHTML = '';
        finishBooking();
      });
      wrap.appendChild(btn);
      setInputArea(wrap);
    });
  }

  function finishBooking() {
    studioSays("You're all set, " + chat.name + '! We can\'t wait to see you ' + formatDate(chat.date) + ' at ' + formatTime(chat.time) + '. A confirmation text is on its way to ' + chat.phone + '.', () => {
      addTimestamp();
      const restart = el('a', 'restart-link', 'Book another appointment');
      restart.href = '#booking';
      restart.addEventListener('click', e => { e.preventDefault(); resetChat(); });
      inputArea.innerHTML = '';
      inputArea.appendChild(restart);
      showToast('Mock booking confirmed — no data was actually sent.');
    });
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3600);
  }
  function resetChat() {
    chat = { name: '', service: null, date: '', time: '', phone: '', preselect: null, started: true };
    thread.innerHTML = '';
    inputArea.innerHTML = '';
    stepName();
  }
  function beginChat() {
    if (chat.started) return;
    chat.started = true;
    stepName();
  }
  function startBookingWithService(service) {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (!chat.started) { chat.preselect = service; beginChat(); }
  }

  const bookingObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { beginChat(); bookingObserver.disconnect(); }
    });
  }, { threshold: 0.3 });
  bookingObserver.observe(document.getElementById('booking'));

  /* ============================================================
     STANDARD MOTION — reveals + counters
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

});
