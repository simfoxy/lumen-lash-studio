(function(){
  "use strict";

  /* ===================== DATA (placeholder) ===================== */
  var SERVICES = [
    { id:"classic", name:"Classic Lash Set", type:"Natural & Everyday", desc:"Natural definition — one handmade extension per natural lash.", price:120, tint1:"#FBE1E1", tint2:"#F6C9CE", lash:{lashes:7, curl:0.35, fan:false, thick:false} },
    { id:"hybrid",  name:"Hybrid Lash Set",  type:"Soft & Textured",   desc:"A textured blend of classic and volume for soft, wispy density.", price:150, tint1:"#F0E4FB", tint2:"#DCC7F5", lash:{lashes:9, curl:0.55, fan:true, thick:false} },
    { id:"volume",  name:"Volume Lash Set",  type:"Full & Fluffy",     desc:"Full, fluffy density built from lightweight handmade fans.", price:180, tint1:"#FDE9D2", tint2:"#FBCE9A", lash:{lashes:11, curl:0.7, fan:true, thick:false} },
    { id:"mega",    name:"Mega Volume Set",  type:"Maximum Drama",     desc:"Maximum drama with ultra-fine, feather-light handmade fans.", price:210, tint1:"#E1F3E6", tint2:"#C3E6CC", lash:{lashes:13, curl:0.9, fan:true, thick:true} },
    { id:"lift",    name:"Lash Lift & Tint", type:"Lifted, Not Extended", desc:"Your own lashes — lifted, curled, and darkened at the root.", price:95,  tint1:"#FFF4D6", tint2:"#FCE39B", lash:{lashes:6, curl:0.25, fan:false, thick:false} },
    { id:"fill",    name:"Fill (2–3 Week)",  type:"Maintenance Visit", desc:"Maintenance to keep an existing set full, even, and fresh.", price:65,  tint1:"#E3ECFB", tint2:"#C7D9F5", lash:{lashes:8, curl:0.5, fan:true, thick:false} },
    { id:"removal", name:"Removal",          type:"Clean Reset",       desc:"Safe, gentle professional removal of existing extensions.", price:35,  tint1:"#F4EEE6", tint2:"#E3D8C8", lash:{lashes:2, curl:0.1, fan:false, thick:false} }
  ];

  /* Builds a cute little lash-fan icon (no eye) whose lash count/curl/fan
     reflect that service's real lash style. */
  function lashFanIcon(cfg){
    var strands = "";
    var n = cfg.lashes;
    for (var i = 0; i < n; i++){
      var t = n === 1 ? 0.5 : i / (n - 1);
      var x = 14 + t * 112;
      var baseY = 58;
      var curl = cfg.curl;
      var len = (16 + curl * 16) * (cfg.fan ? (0.65 + 0.55 * Math.sin(t * Math.PI)) : 1);
      var spread = (t - 0.5) * 30 * curl;
      var endX = x + spread;
      var endY = baseY - len;
      var midX = x + spread * 0.45;
      var midY = baseY - len * 0.55;
      strands += '<path class="lash-strand" style="transition-delay:' + (i * 0.025).toFixed(3) + 's" d="M' +
        x.toFixed(1) + ' ' + baseY + ' Q' + midX.toFixed(1) + ' ' + midY.toFixed(1) + ' ' + endX.toFixed(1) + ' ' + endY.toFixed(1) +
        '" stroke-width="' + (cfg.thick ? 2.6 : 1.6) + '" />';
    }
    return '<svg viewBox="0 0 140 90" class="lash-fan-icon" aria-hidden="true">' +
      '<g class="lash-strands">' + strands + '</g>' +
      '<path class="lash-root" d="M18 58C46 74 94 74 122 58" />' +
      '<circle class="lash-dot" cx="70" cy="60" r="3" />' +
      '</svg>';
  }

  var POLICIES = [
    { q:"Cancellation Window", a:"We ask for at least 48 hours notice to cancel or reschedule so the seat can be offered to someone else." },
    { q:"Late Arrival", a:"A 10-minute grace period is built into every booking. Beyond that we may need to shorten or reschedule your service to protect the next client." },
    { q:"Deposit & No-Show", a:"A $25 deposit secures every booking and is applied toward your service. No-shows and same-day cancellations forfeit the deposit." },
    { q:"Guest Policy", a:"This is a small, one-on-one studio — we're not able to accommodate plus-ones or children during your appointment." },
    { q:"Patch Test", a:"First-time clients require a patch test at least 24–48 hours before their first full set." },
    { q:"Health & Allergy Note", a:"Please let us know about any allergies, sensitive eyes, or recent eye surgery before booking so we can plan accordingly." }
  ];

  /* ===================== HELPERS ===================== */
  function el(tag, cls, html){
    var e = document.createElement(tag);
    if(cls) e.className = cls;
    if(html !== undefined) e.innerHTML = html;
    return e;
  }
  function money(n){ return "$" + n; }

  /* ===================== MOBILE MENU ===================== */
  var burger = document.getElementById("burgerBtn");
  var mobileMenu = document.getElementById("mobileMenu");
  function setMobileMenu(open){
    burger.classList.toggle("open", open);
    mobileMenu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("menu-open", open);
  }
  burger.addEventListener("click", function(){
    setMobileMenu(!mobileMenu.classList.contains("open"));
  });
  mobileMenu.querySelectorAll("a").forEach(function(a){
    a.addEventListener("click", function(){ setMobileMenu(false); });
  });

  /* ===================== CATALOG RENDER ===================== */
  var grid = document.getElementById("catalogGrid");

  SERVICES.forEach(function(s, i){
    var card = el("div", "service-card reveal");
    card.style.transitionDelay = (i % 3) * 0.08 + "s";

    var img = el("div", "card-image");
    img.style.setProperty("--tint1", s.tint1);
    img.style.setProperty("--tint2", s.tint2);
    img.innerHTML =
      '<span class="placeholder-tag">📸 Add Photo</span>' +
      '<span class="card-price-tag">'+money(s.price)+'</span>' +
      '<div class="icon-blob">'+lashFanIcon(s.lash)+'</div>';
    card.appendChild(img);

    var body = el("div", "card-body");
    body.innerHTML =
      '<h3>'+s.name+'</h3>' +
      '<span class="card-type-badge">'+s.type+'</span>' +
      '<p>'+s.desc+'</p>';

    var bookBtn = el("button", "card-book",
      'Book <span class="icon-dot"><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'
    );
    bookBtn.addEventListener("click", function(){ startBookingWithService(s); });
    body.appendChild(bookBtn);
    card.appendChild(body);
    grid.appendChild(card);
  });

  /* ===================== POLICIES RENDER ===================== */
  var policyList = document.getElementById("policyList");
  POLICIES.forEach(function(p){
    var item = el("div", "policy-item");
    item.innerHTML =
      '<button class="policy-q" aria-expanded="false">'+
        '<span class="policy-q-text">'+p.q+'</span>'+
        '<span class="policy-plus"></span>'+
      '</button>'+
      '<div class="policy-a"><div class="policy-a-inner"><p>'+p.a+'</p></div></div>';
    var btn = item.querySelector(".policy-q");
    btn.addEventListener("click", function(){
      var wasOpen = item.classList.contains("open");
      policyList.querySelectorAll(".policy-item.open").forEach(function(o){
        o.classList.remove("open");
        o.querySelector(".policy-q").setAttribute("aria-expanded","false");
      });
      if(!wasOpen){
        item.classList.add("open");
        btn.setAttribute("aria-expanded","true");
      }
    });
    policyList.appendChild(item);
  });

  /* ===================== SCROLL REVEAL =====================
     Runs after the catalog cards and policy accordion are built,
     since they add their own .reveal elements to the DOM. */
  var revealTargets = document.querySelectorAll(".reveal");
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.15, rootMargin:"0px 0px -40px 0px" });
  revealTargets.forEach(function(t){ io.observe(t); });

  /* ===================== BOOKING CHAT ENGINE ===================== */
  var thread = document.getElementById("chatThread");
  var inputArea = document.getElementById("chatInputArea");
  var toast = document.getElementById("toast");

  var chat = { name:"", service:null, date:"", time:"", phone:"", preselect:null, started:false };

  function scrollToBottom(){
    requestAnimationFrame(function(){
      thread.scrollTop = thread.scrollHeight;
    });
  }

  function addBubble(text, dir){
    var row = el("div", "bubble-row " + dir);
    var b = el("div", "bubble " + dir, text);
    row.appendChild(b);
    thread.appendChild(row);
    scrollToBottom();
    return row;
  }

  function addTimestamp(){
    var now = new Date();
    var h = now.getHours() % 12 || 12;
    var m = String(now.getMinutes()).padStart(2,"0");
    var ampm = now.getHours() >= 12 ? "PM" : "AM";
    var ts = el("div", "timestamp", "Today " + h + ":" + m + " " + ampm);
    thread.appendChild(ts);
    scrollToBottom();
  }

  function showTyping(cb, delay){
    var row = el("div", "typing-row");
    row.setAttribute("aria-hidden", "true");
    row.innerHTML = '<div class="typing-bubble"><span></span><span></span><span></span></div>';
    thread.appendChild(row);
    scrollToBottom();
    setTimeout(function(){
      row.remove();
      cb();
    }, delay || 1100);
  }

  function studioSays(text, cb){
    showTyping(function(){
      addBubble(text, "in");
      if(cb) cb();
    });
  }

  function clientSays(text){
    addBubble(text, "out");
  }

  function setInputArea(node){
    inputArea.innerHTML = "";
    inputArea.appendChild(node);
  }

  /* ---- Step 0: greeting + name ---- */
  function stepName(){
    studioSays("Hi there! I'm so glad you're here — what's your name?", function(){
      var wrap = el("div", "field-row");
      wrap.innerHTML =
        '<input type="text" id="nameInput" placeholder="Type your name" autocomplete="name" aria-label="Your name">' +
        '<button class="send-btn" id="nameSend" disabled aria-label="Send">'+sendIcon()+'</button>';
      setInputArea(wrap);
      var input = wrap.querySelector("#nameInput");
      var send = wrap.querySelector("#nameSend");
      input.addEventListener("input", function(){ send.disabled = input.value.trim().length === 0; });
      input.addEventListener("keydown", function(e){ if(e.key === "Enter" && !send.disabled) submitName(); });
      send.addEventListener("click", submitName);
      function submitName(){
        var val = input.value.trim();
        if(!val) return;
        chat.name = val;
        clientSays(val);
        inputArea.innerHTML = "";
        stepService();
      }
      input.focus();
    });
  }

  /* ---- Step 1: service (chips, or confirm preselected) ---- */
  function stepService(){
    if(chat.preselect){
      var svc = chat.preselect;
      studioSays("Lovely to meet you, "+chat.name+"! I have you down for the <strong>"+svc.name+"</strong> ("+money(svc.price)+") — sound good?", function(){
        var wrap = el("div", "chip-row");
        var yes = el("button", "chip", "Yes, that's right");
        var no = el("button", "chip", "Pick something else");
        yes.addEventListener("click", function(){
          clientSays("Yes, that's right");
          chat.service = svc;
          inputArea.innerHTML = "";
          stepDateTime();
        });
        no.addEventListener("click", function(){
          clientSays("Let me pick something else");
          chat.preselect = null;
          inputArea.innerHTML = "";
          stepService();
        });
        wrap.appendChild(yes); wrap.appendChild(no);
        setInputArea(wrap);
      });
      return;
    }

    studioSays("Which service can I book you in for?", function(){
      var wrap = el("div", "chip-row");
      SERVICES.forEach(function(s){
        var chip = el("button", "chip", s.name + " · " + money(s.price));
        chip.addEventListener("click", function(){
          clientSays(s.name);
          chat.service = s;
          inputArea.innerHTML = "";
          stepDateTime();
        });
        wrap.appendChild(chip);
      });
      setInputArea(wrap);
    });
  }

  /* ---- Step 2: date & time ---- */
  function stepDateTime(){
    studioSays("Perfect. What day and time works best for you?", function(){
      var wrap = el("div");
      var todayISO = new Date().toISOString().split("T")[0];
      wrap.innerHTML =
        '<div class="dt-row">'+
          '<input type="date" id="dateInput" min="'+todayISO+'" aria-label="Preferred date">'+
          '<input type="time" id="timeInput" aria-label="Preferred time">'+
          '<button class="send-btn" id="dtSend" disabled aria-label="Send">'+sendIcon()+'</button>'+
        '</div>';
      setInputArea(wrap);
      var dateInput = wrap.querySelector("#dateInput");
      var timeInput = wrap.querySelector("#timeInput");
      var send = wrap.querySelector("#dtSend");
      function check(){ send.disabled = !(dateInput.value && timeInput.value); }
      dateInput.addEventListener("input", check);
      timeInput.addEventListener("input", check);
      send.addEventListener("click", function(){
        chat.date = dateInput.value;
        chat.time = timeInput.value;
        clientSays(formatDate(chat.date) + " at " + formatTime(chat.time));
        inputArea.innerHTML = "";
        stepPhone();
      });
    });
  }

  function formatDate(iso){
    if(!iso) return "";
    var d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(undefined, { weekday:"short", month:"short", day:"numeric" });
  }
  function formatTime(t){
    if(!t) return "";
    var parts = t.split(":");
    var h = parseInt(parts[0],10);
    var m = parts[1];
    var ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + m + " " + ampm;
  }

  /* ---- Step 3: phone ---- */
  function stepPhone(){
    studioSays("Great choice. What's the best mobile number to text your confirmation to?", function(){
      var wrap = el("div");
      wrap.innerHTML =
        '<div class="field-row">'+
          '<input type="tel" id="phoneInput" placeholder="(555) 123-4567" autocomplete="tel" aria-label="Mobile phone number">'+
          '<button class="send-btn" id="phoneSend" disabled aria-label="Send">'+sendIcon()+'</button>'+
        '</div>'+
        '<div class="field-hint" id="phoneHint">We\'ll only use this to confirm your appointment.</div>';
      setInputArea(wrap);
      var input = wrap.querySelector("#phoneInput");
      var send = wrap.querySelector("#phoneSend");
      var hint = wrap.querySelector("#phoneHint");
      input.addEventListener("input", function(){
        var digits = input.value.replace(/\D/g,"");
        send.disabled = digits.length < 10;
      });
      input.addEventListener("keydown", function(e){ if(e.key === "Enter" && !send.disabled) submitPhone(); });
      send.addEventListener("click", submitPhone);
      function submitPhone(){
        var digits = input.value.replace(/\D/g,"");
        if(digits.length < 10){
          hint.textContent = "That number looks a little short — mind double-checking it?";
          hint.classList.add("error");
          return;
        }
        chat.phone = input.value.trim();
        clientSays(chat.phone);
        inputArea.innerHTML = "";
        stepSummary();
      }
      input.focus();
    });
  }

  /* ---- Step 4: summary + confirm ---- */
  function stepSummary(){
    studioSays("Here's what I have — take a look and confirm whenever you're ready:", function(){
      var summary = el("div", "bubble-row in");
      summary.innerHTML =
        '<div class="bubble in" style="max-width:88%;">' +
          '<strong>'+chat.service.name+'</strong> · '+money(chat.service.price)+'<br>'+
          formatDate(chat.date)+' at '+formatTime(chat.time)+'<br>'+
          chat.name+' · '+chat.phone +
        '</div>';
      thread.appendChild(summary);
      scrollToBottom();

      var wrap = el("div");
      var btn = el("button", "confirm-btn", 'Confirm Booking ' + sendIcon());
      btn.addEventListener("click", function(){
        clientSays("Confirmed — see you then! 🤍");
        inputArea.innerHTML = "";
        finishBooking();
      });
      wrap.appendChild(btn);
      setInputArea(wrap);
    });
  }

  function finishBooking(){
    studioSays("You're all set, "+chat.name+"! We can't wait to see you "+formatDate(chat.date)+" at "+formatTime(chat.time)+". A confirmation text is on its way to "+chat.phone+". 🦋✨", function(){
      addTimestamp();
      var restart = el("a", "restart-link", "Book another appointment");
      restart.href = "#booking";
      restart.addEventListener("click", function(e){
        e.preventDefault();
        resetChat();
      });
      inputArea.innerHTML = "";
      inputArea.appendChild(restart);
      showToast("Mock booking confirmed — no data was actually sent.");
    });
  }

  function sendIcon(){
    return '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(function(){ toast.classList.remove("show"); }, 3600);
  }

  function resetChat(){
    chat = { name:"", service:null, date:"", time:"", phone:"", preselect:null, started:true };
    thread.innerHTML = "";
    inputArea.innerHTML = "";
    stepName();
  }

  function beginChat(){
    if(chat.started) return;
    chat.started = true;
    stepName();
  }

  function startBookingWithService(service){
    document.getElementById("booking").scrollIntoView({ behavior:"smooth", block:"center" });
    if(!chat.started){
      chat.preselect = service;
      beginChat();
    }
  }

  /* Lazily start the chat once the booking widget scrolls into view */
  var bookingObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        beginChat();
        bookingObserver.disconnect();
      }
    });
  }, { threshold:0.3 });
  bookingObserver.observe(document.getElementById("booking"));

})();
