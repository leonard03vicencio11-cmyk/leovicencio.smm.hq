/* Portfolio showcases (Social Media Work, Website Creation, CRM & Automation) — injected before the Certificates block on the homepage */
(function () {
  var sections = [
    {
      id: 'social-media-work',
      eyebrow: '&gt; FILE_09 // SOCIAL MEDIA WORK',
      titleA: 'Social Media',
      titleB: 'Work',
      sub: 'Brand pages and accounts I’ve managed. Click any project to open the live page.',
      cta: '&gt;_ VIEW PAGE ↗',
      items: [
        {
          code: 'SOC_01',
          name: 'Trade Anchor AI',
          type: 'Facebook page \u00b7 short-form Reels & community',
          stat: '2.2K followers \u00b7 top Reel 1.5M views (Nov 2026)',
          url: 'https://www.facebook.com/profile.php?id=61593412442171',
          label: 'facebook.com \u00b7 Trade Anchor AI',
          image: '/showcase/1795631923256_image.png'
        },
        {
          code: 'SOC_02',
          name: 'Golden Rentals of Dillsburg',
          type: 'Facebook page \u00b7 equipment & party rentals, Pennsylvania',
          stat: '1.5K followers (Nov 2026)',
          url: '#works',
          internal: true,
          cta: '&gt;_ VIEW CASE STUDY \u2193',
          label: 'facebook.com \u00b7 Golden Rentals of Dillsburg',
          image: '/showcase/1795633289874_image.png'
        },
        {
          code: 'SOC_03',
          name: 'All Reasons Moving & Storage',
          type: 'Facebook page \u00b7 moving & storage, San Jose CA',
          stat: '1K followers (Nov 2026)',
          url: '#works',
          internal: true,
          cta: '&gt;_ VIEW CASE STUDY \u2193',
          label: 'facebook.com \u00b7 All Reasons Moving & Storage',
          image: '/showcase/1795633311483_image.png'
        },
        {
          code: 'SOC_04',
          name: 'Peace of Mind Pest Control',
          type: 'Facebook page \u00b7 pest control, Modesto CA',
          stat: '968 followers (Nov 2026)',
          url: '#works',
          internal: true,
          cta: '&gt;_ VIEW CASE STUDY \u2193',
          label: 'facebook.com \u00b7 Peace of Mind Pest Control',
          image: '/showcase/1795633346601_image.png'
        }
      ]
    },
    {
      id: 'website-creation',
      eyebrow: '&gt; FILE_10 // WEBSITE CREATION',
      titleA: 'Website',
      titleB: 'Creation',
      sub: 'Live websites and funnels I’ve built and supported. Click any project to open the live site.',
      cta: '&gt;_ VISIT LIVE SITE ↗',
      items: [
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
        }
      ]
    },
    {
      id: 'automation-systems',
      eyebrow: '&gt; FILE_11 // CRM, AUTOMATION & BUSINESS SYSTEMS',
      titleA: 'CRM &amp;',
      titleB: 'Automation',
      sub: 'Workflows I\u2019ve designed and built in n8n and GoHighLevel. Click any project to view it full size.',
      cta: '&gt;_ VIEW FULL IMAGE \u2197',
      items: [
        {
          code: 'AUTO_01',
          name: 'Lead Enrichment Pipeline',
          type: 'n8n \u00b7 Apollo.io leads, LinkedIn profiles, Mail.so validation, AI summaries, master database',
          url: '/showcase/1795633380860_image.png',
          label: 'n8n \u00b7 Lead enrichment pipeline',
          image: '/showcase/1795633380860_image.png',
          fit: true
        },
        {
          code: 'AUTO_02',
          name: 'n8n Workflow Automation',
          type: 'n8n \u00b7 AI agents for personal assistant, research, Zoom, calendar and email',
          url: '/showcase/1795633388449_image.png',
          label: 'n8n \u00b7 PA_EA Workflows',
          image: '/showcase/1795633388449_image.png',
          fit: true
        },
        {
          code: 'AUTO_03',
          name: 'Employee Onboarding & Offboarding',
          type: 'n8n \u00b7 Google account + Slack provisioning, access removal, roster logging',
          url: '/showcase/1795633393306_image.png',
          label: 'n8n \u00b7 Onboarding/Offboarding',
          image: '/showcase/1795633393306_image.png',
          fit: true
        },
        {
          code: 'AUTO_04',
          name: 'GHL Booking Appointment Workflow',
          type: 'GoHighLevel \u00b7 lead scoring, tailored email + SMS sequences, pre-appointment reminders',
          url: '/showcase/1795633399523_image.png',
          label: 'GoHighLevel \u00b7 Booked Appointment Workflow',
          image: '/showcase/1795633399523_image.png',
          fit: true
        }
      ]
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

  function card(p, cta) {
    var attrs = p.internal ? '' : ' target="_blank" rel="noopener noreferrer"';
    return '<a class="lvws-card" href="' + esc(p.url) + '"' + attrs + ' aria-label="' + esc(p.name + (p.internal ? ' — view case study' : ' — opens in a new tab')) + '">' +
      '<div class="lvws-browser" aria-hidden="true"><span class="lvws-dot"></span><span class="lvws-dot"></span><span class="lvws-dot"></span><span class="lvws-url">' + esc(p.label) + '</span></div>' +
      '<div class="lvws-shot"><img src="' + esc(shot(p)) + '" alt="' + esc('Screenshot of ' + p.name) + '" loading="lazy" decoding="async" width="1280" height="800"' + (p.fit ? ' style="object-fit:contain;object-position:center"' : '') + '><span class="lvws-fallback">' + esc(p.name) + '</span></div>' +
      '<div class="lvws-meta"><span class="lvws-code">' + esc(p.code) + '</span><h3 class="lvws-name">' + esc(p.name) + '</h3><p class="lvws-type">' + esc(p.type) + '</p>' +
      (p.stat ? '<p class="lvws-type">' + esc(p.stat) + '</p>' : '') +
      '<span class="lvws-cta">' + (p.cta || cta) + '</span></div>' +
      '</a>';
  }

  function buildSection(cfg, anchor) {
    if (document.getElementById(cfg.id)) return;
    var multi = cfg.items.length > 1;

    var section = document.createElement('div');
    section.className = 'lvws';
    section.id = cfg.id;
    section.setAttribute('aria-labelledby', cfg.id + '-title');
    section.innerHTML =
      '<div class="lvws-eyebrow">' + cfg.eyebrow + '</div>' +
      '<div class="lvws-head"><div>' +
        '<h2 class="lvws-title" id="' + cfg.id + '-title">' + cfg.titleA + ' <span>' + cfg.titleB + '</span></h2>' +
        '<p class="lvws-sub">' + cfg.sub + '</p>' +
      '</div>' +
      (multi ? '<div class="lvws-nav">' +
        '<button type="button" class="lvws-btn" data-dir="-1" aria-label="Previous project">←</button>' +
        '<button type="button" class="lvws-btn" data-dir="1" aria-label="Next project">→</button>' +
      '</div>' : '') +
      '</div>' +
      '<div class="lvws-track" tabindex="0" role="region" aria-label="' + esc((cfg.titleA + ' ' + cfg.titleB).replace('&amp;', '&')) + ' projects">' +
        cfg.items.map(function (p) { return card(p, cfg.cta); }).join('') +
      '</div>' +
      (multi ? '<div class="lvws-count" aria-live="polite"></div>' : '');

    anchor.parentNode.insertBefore(section, anchor);

    section.querySelectorAll('.lvws-shot img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.style.display = 'none';
        img.parentNode.classList.add('is-broken');
      });
    });

    if (!multi) return;

    var track = section.querySelector('.lvws-track');
    var prev = section.querySelector('[data-dir="-1"]');
    var next = section.querySelector('[data-dir="1"]');
    var count = section.querySelector('.lvws-count');
    var cards = track.querySelectorAll('.lvws-card');

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

  function build() {
    var anchor = document.getElementById('certificates');
    if (!anchor) return;
    sections.forEach(function (cfg) { buildSection(cfg, anchor); });
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
