/* Website Creation showcase — injected before the Certificates block on the homepage */
(function () {
  var projects = [
    {
      code: 'WEB_01',
      name: 'Trade Anchor AI',
      type: 'SaaS website · AI platform for the trades',
      url: 'https://tradeanchor.ai/',
      label: 'tradeanchor.ai'
    },
    {
      code: 'WEB_02',
      name: 'Albin Law Group',
      type: 'Law firm website',
      url: 'https://www.albinlawgroup.com/',
      label: 'albinlawgroup.com'
    },
    {
      code: 'WEB_03',
      name: 'VH Law',
      type: 'Law firm website',
      url: 'https://www.vhlawinc.com/',
      label: 'vhlawinc.com'
    },
    {
      code: 'WEB_04',
      name: "EnRICHed Women's Social Club",
      type: 'Community website & membership funnel',
      url: 'https://enrichedwomenssocialclub.netlify.app/',
      label: 'enrichedwomenssocialclub.netlify.app'
    },
    {
      code: 'SOC_01',
      name: 'Trade Anchor AI — Facebook',
      type: 'Facebook page · short-form Reels & community',
      url: 'https://www.facebook.com/profile.php?id=61593412442171',
      label: 'facebook.com · Trade Anchor AI',
      image: '/showcase/1795631923256_image.png'
    }
  ];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function shot(p) {
    if (p.image) return p.image;
    return 'https://s0.wp.com/mshots/v1/' + encodeURIComponent(p.url) + '?w=1280&h=800';
  }

  function card(p) {
    return '<a class="lvws-card" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(p.name + ' — open live site in a new tab') + '">' +
      '<div class="lvws-browser" aria-hidden="true"><span class="lvws-dot"></span><span class="lvws-dot"></span><span class="lvws-dot"></span><span class="lvws-url">' + esc(p.label) + '</span></div>' +
      '<div class="lvws-shot"><img src="' + esc(shot(p)) + '" alt="' + esc('Screenshot of ' + p.name) + '" loading="lazy" decoding="async" width="1280" height="800"><span class="lvws-fallback">' + esc(p.name) + '</span></div>' +
      '<div class="lvws-meta"><span class="lvws-code">' + esc(p.code) + '</span><h3 class="lvws-name">' + esc(p.name) + '</h3><p class="lvws-type">' + esc(p.type) + '</p><span class="lvws-cta">&gt;_ VISIT LIVE SITE ↗</span></div>' +
      '</a>';
  }

  function build() {
    var anchor = document.getElementById('certificates');
    if (!anchor || document.getElementById('website-creation')) return;

    var section = document.createElement('div');
    section.className = 'lvws';
    section.id = 'website-creation';
    section.setAttribute('aria-labelledby', 'website-creation-title');
    section.innerHTML =
      '<div class="lvws-eyebrow">&gt; FILE_09 // WEBSITE CREATION</div>' +
      '<div class="lvws-head"><div>' +
        '<h2 class="lvws-title" id="website-creation-title">Website <span>Creation</span></h2>' +
        '<p class="lvws-sub">Live websites, funnels and brand pages I’ve built and supported. Click any project to open the live site.</p>' +
      '</div><div class="lvws-nav">' +
        '<button type="button" class="lvws-btn" data-dir="-1" aria-label="Previous project">←</button>' +
        '<button type="button" class="lvws-btn" data-dir="1" aria-label="Next project">→</button>' +
      '</div></div>' +
      '<div class="lvws-track" tabindex="0" role="region" aria-label="Website projects, scroll horizontally">' + projects.map(card).join('') + '</div>' +
      '<div class="lvws-count" aria-live="polite"></div>';

    anchor.parentNode.insertBefore(section, anchor);

    var track = section.querySelector('.lvws-track');
    var prev = section.querySelector('[data-dir="-1"]');
    var next = section.querySelector('[data-dir="1"]');
    var count = section.querySelector('.lvws-count');
    var cards = track.querySelectorAll('.lvws-card');

    section.querySelectorAll('.lvws-shot img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.style.display = 'none';
        img.parentNode.classList.add('is-broken');
      });
    });

    function step() {
      var c = cards[0];
      return c ? c.getBoundingClientRect().width + 16 : track.clientWidth;
    }

    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
      var i = max <= 0 ? 1 : track.scrollLeft >= max ? cards.length : Math.min(cards.length, Math.round(track.scrollLeft / step()) + 1);
      count.textContent = String(i).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0');
    }

    [prev, next].forEach(function (btn) {
      btn.addEventListener('click', function () {
        track.scrollBy({ left: step() * Number(btn.getAttribute('data-dir')), behavior: 'smooth' });
      });
    });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
    });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    var css = document.querySelector('link[href="/website-showcase.css"]');
    if (css) css.addEventListener('load', update);
    setTimeout(update, 800);
    update();
  }

  function addCss() {
    if (document.querySelector('link[href="/website-showcase.css"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/website-showcase.css';
    document.head.appendChild(link);
  }

  addCss();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
