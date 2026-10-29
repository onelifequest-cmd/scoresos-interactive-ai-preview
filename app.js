(function () {
  'use strict';

  /* ============================================================
     HERO_VIDEO — ONE CONFIG SPOT for the real film.
     Teammate drops MP4 + WebM + poster into:
       /workspace/projects/scoresos-homepage/hero-video/
     For this static preview (and Render), copy into ./media/ then
     change the three paths below (or set useReal after copying as
     media/hero.mp4, media/hero.webm, media/hero-poster.jpg).
     ============================================================ */
  var HERO_VIDEO = {
    // Placeholder (ships with this preview):
    webm: 'media/hero.webm',
    mp4: 'media/hero.mp4',
    poster: 'media/hero-poster-real.jpg'
    // Real film example (after copy into media/):
    // webm: 'media/hero.webm',
    // mp4: 'media/hero.mp4',
    // poster: 'media/hero-poster.jpg'
  };

  function applyHeroVideo() {
    var video = document.getElementById('heroVideo');
    var posterImg = document.getElementById('heroPoster');
    if (!video) return;
    var sources = video.querySelectorAll('source');
    // Prefer WebM first, then MP4 — match <source> order in index.html
    if (sources[0]) sources[0].src = HERO_VIDEO.webm;
    if (sources[1]) sources[1].src = HERO_VIDEO.mp4;
    video.setAttribute('poster', HERO_VIDEO.poster);
    if (posterImg) posterImg.src = HERO_VIDEO.poster;
    try { video.load(); } catch (e) {}
  }
  applyHeroVideo();


  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var saveData = !!(conn && conn.saveData);
  if (saveData) document.body.classList.add('save-data');
  if (reduceMotion) document.body.classList.add('reduce-fx');

  /* ---------- Mobile menu ---------- */
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('primaryNav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ---------- Video autoplay ---------- */
  var video = document.getElementById('heroVideo');
  if (video && !saveData && !reduceMotion) {
    var play = function () {
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    };
    if (video.readyState >= 2) play();
    else video.addEventListener('loadeddata', play, { once: true });
  }

  /* ---------- AI mesh (canvas particles + links) ---------- */
  var canvas = document.getElementById('aiMesh');
  if (canvas && !reduceMotion && !saveData) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = [];
    var mouse = { x: -9999, y: -9999 };
    var NODE_COUNT = 42;
    var LINK_DIST = 140;
    var raf = 0;

    function resize() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initNodes() {
      nodes = [];
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      var count = w < 600 ? 24 : NODE_COUNT;
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1.2 + Math.random() * 1.8
        });
      }
    }

    function tick() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        var dx = mouse.x - n.x;
        var dy = mouse.y - n.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160 && dist > 1) {
          n.vx += dx * 0.00008;
          n.vy += dy * 0.00008;
        }
      }

      // Links
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var dx2 = nodes[a].x - nodes[b].x;
          var dy2 = nodes[a].y - nodes[b].y;
          var d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (d2 < LINK_DIST) {
            var alpha = (1 - d2 / LINK_DIST) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(244,217,107,' + alpha + ')';
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.stroke();
          }
        }
      }

      // Cursor glow
      if (mouse.x > 0) {
        var grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
        grad.addColorStop(0, 'rgba(244,217,107,0.18)');
        grad.addColorStop(1, 'rgba(244,217,107,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(mouse.x - 120, mouse.y - 120, 240, 240);
      }

      // Nodes
      for (var k = 0; k < nodes.length; k++) {
        var p = nodes[k];
        ctx.beginPath();
        ctx.fillStyle = 'rgba(232,244,237,0.75)';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    resize();
    initNodes();
    tick();

    window.addEventListener('resize', function () {
      resize();
      initNodes();
    });

    var stage = document.getElementById('hero');
    if (stage) {
      stage.addEventListener('pointermove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      }, { passive: true });
      stage.addEventListener('pointerleave', function () {
        mouse.x = -9999;
        mouse.y = -9999;
      });
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!reduceMotion) {
        raf = requestAnimationFrame(tick);
      }
    });
  }

  /* ---------- Ask Maxine (scripted demo) ---------- */
  var SAMPLE_PROMPTS = [
    'Import my client from SmartCredit',
    'Draft round 2 letters',
    'Which clients are overdue?'
  ];

  var RESPONSES = {
    'Import my client from SmartCredit':
      'On it. I\'ll pull the SmartCredit report for that client, map tradelines into the Dispute Queue, and flag any empty-body or credential errors before we start Round 1.\n\n(Demo only — no real import runs from this preview.)',
    'Draft round 2 letters':
      'Drafting Round 2 now. I\'ll reuse Round 1 outcomes, skip items already deleted, and queue letters for Experian, Equifax, and TransUnion with your agency letterhead.\n\n(Demo only — Maxine is not connected here.)',
    'Which clients are overdue?':
      'Three sample clients show overdue follow-ups: Maya (Round 2 due yesterday), Jordan (docs missing 4 days), and Sam (print queue stuck).\n\nOpen the Dispute Queue → Work Next to clear them. (Demo data.)'
  };

  var DEFAULT_RESPONSE =
    'Got it. In Score OS I would route that into the right queue — SmartCredit import, letter draft, or Work Next — and show you the next action.\n\n(Demo only. Type or tap a sample prompt to see a scripted reply.)';

  var askInput = document.getElementById('askInput');
  var askForm = document.getElementById('askForm');
  var askResponse = document.getElementById('askResponse');
  var askResponseBody = document.getElementById('askResponseBody');
  var promptIndex = 0;
  var typingTimer = null;
  var streamTimer = null;
  var placeholderTimer = null;

  function typePlaceholder() {
    if (!askInput || document.activeElement === askInput || askInput.value) return;
    var text = SAMPLE_PROMPTS[promptIndex % SAMPLE_PROMPTS.length];
    var i = 0;
    askInput.placeholder = '';
    clearInterval(placeholderTimer);
    placeholderTimer = setInterval(function () {
      if (document.activeElement === askInput || askInput.value) {
        clearInterval(placeholderTimer);
        return;
      }
      i++;
      askInput.placeholder = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(placeholderTimer);
        setTimeout(function () {
          promptIndex++;
          if (!askInput.value && document.activeElement !== askInput) typePlaceholder();
        }, 2200);
      }
    }, reduceMotion ? 0 : 45);
  }

  if (askInput) {
    askInput.addEventListener('focus', function () {
      clearInterval(placeholderTimer);
      askInput.placeholder = 'Ask Maxine anything…';
    });
    askInput.addEventListener('blur', function () {
      if (!askInput.value) {
        setTimeout(typePlaceholder, 400);
      }
    });
    if (!reduceMotion) typePlaceholder();
    else askInput.placeholder = SAMPLE_PROMPTS[0];
  }

  function streamText(text) {
    clearInterval(streamTimer);
    askResponse.hidden = false;
    askResponseBody.innerHTML = '';
    var i = 0;
    if (reduceMotion) {
      askResponseBody.textContent = text;
      return;
    }
    streamTimer = setInterval(function () {
      i++;
      askResponseBody.textContent = text.slice(0, i);
      if (i < text.length) {
        var blink = document.createElement('span');
        blink.className = 'cursor-blink';
        blink.setAttribute('aria-hidden', 'true');
        askResponseBody.appendChild(blink);
      }
      if (i >= text.length) clearInterval(streamTimer);
    }, 14);
  }

  function runAsk(query) {
    var q = (query || '').trim();
    if (!q) return;
    if (askInput) askInput.value = q;
    var key = Object.keys(RESPONSES).find(function (k) {
      return k.toLowerCase() === q.toLowerCase();
    });
    var reply = key ? RESPONSES[key] : DEFAULT_RESPONSE;
    streamText(reply);
  }

  if (askForm) {
    askForm.addEventListener('submit', function (e) {
      e.preventDefault();
      runAsk(askInput ? askInput.value : '');
    });
  }

  document.querySelectorAll('.chip[data-prompt]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      runAsk(chip.getAttribute('data-prompt'));
    });
  });

  /* ---------- Score simulator ---------- */
  // Baseline 580 → ~720 at 8 items (~17.5 pts each, curved a bit)
  var SCORE_STEPS = [580, 598, 615, 635, 655, 678, 695, 710, 722];
  var slider = document.getElementById('negItems');
  var dialFill = document.getElementById('dialFill');
  var dialScore = document.getElementById('dialScore');
  var dialDelta = document.getElementById('dialDelta');
  var negValue = document.getElementById('negValue');
  var bullets = document.querySelectorAll('#simBullets li');

  function scoreToArc(score) {
    // Map 300–850-ish sample range onto dial; we use 500–750 for visual punch
    var min = 500, max = 750;
    var t = Math.max(0, Math.min(1, (score - min) / (max - min)));
    return Math.round(t * 100);
  }

  function colorForScore(score) {
    if (score < 620) return '#D4AF37';
    if (score < 680) return '#F4D96B';
    return '#7dcea0';
  }

  function updateSim(val) {
    var n = parseInt(val, 10) || 0;
    var score = SCORE_STEPS[n] || SCORE_STEPS[0];
    var arc = scoreToArc(score);
    if (dialFill) {
      dialFill.style.strokeDasharray = arc + ' 100';
      dialFill.style.stroke = colorForScore(score);
    }
    if (dialScore) dialScore.textContent = String(score);
    if (dialDelta) {
      var delta = score - SCORE_STEPS[0];
      dialDelta.textContent = (delta >= 0 ? '+' : '') + delta + ' pts from baseline';
    }
    if (negValue) negValue.textContent = String(n);
    if (slider) {
      slider.setAttribute('aria-valuenow', String(n));
    }
    bullets.forEach(function (li) {
      var at = parseInt(li.getAttribute('data-at'), 10);
      li.classList.toggle('on', at <= n);
    });
  }

  if (slider) {
    updateSim(slider.value);
    slider.addEventListener('input', function () {
      updateSim(slider.value);
    });
  }

  /* ---------- Demo ticker ---------- */
  var EVENTS = [
    'Round 2 letters queued for 12 clients',
    'Item deleted — Experian · sample client',
    'SmartCredit import finished · 3 tradelines mapped',
    'Maxine drafted Metro 2 dispute language',
    'Print queue cleared · Agency North',
    'Overdue follow-up nudged · Outsourcer team',
    'Grace logged a funding call note',
    'Work Next claimed next dispute packet'
  ];

  var track = document.getElementById('tickerTrack');
  if (track) {
    var html = EVENTS.concat(EVENTS).map(function (e) {
      return '<span>' + e + '</span>';
    }).join('');
    track.innerHTML = html;
  }
})();
