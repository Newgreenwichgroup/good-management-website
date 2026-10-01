/* ==========================================================================
   Cookie consent — The Good Management Company
   Google Analytics runs in Consent Mode with analytics storage DENIED by
   default (set in each page's <head>). Nothing is stored on the visitor's
   device until they press Accept. The choice is remembered in localStorage
   under "tgmc-consent" and can be changed from "Cookie settings" in the
   footer of every page.
   ========================================================================== */
(function () {
  var KEY = 'tgmc-consent';

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function saveChoice(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }

  // Remove any Google Analytics cookies already set (used when consent is withdrawn).
  function clearAnalyticsCookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid') {
        domains.forEach(function (d) {
          document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  function apply(value) {
    if (typeof gtag !== 'function') return;
    gtag('consent', 'update', { analytics_storage: value === 'granted' ? 'granted' : 'denied' });
    if (value !== 'granted') clearAnalyticsCookies();
  }

  var banner;

  function build() {
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<p class="cookie-banner__text">We would like to use Google Analytics cookies to understand how people use this site, so we can improve it. ' +
        'They are only set if you accept. <a href="privacy.html#cookies">Read our privacy notice</a>.</p>' +
        '<div class="cookie-banner__actions">' +
          '<button type="button" class="btn cookie-btn" data-consent="granted">Accept</button>' +
          '<button type="button" class="btn cookie-btn" data-consent="denied">Reject</button>' +
        '</div>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) return;
      var value = btn.getAttribute('data-consent');
      saveChoice(value);
      apply(value);
      hide();
    });
    document.body.appendChild(banner);
  }

  // Focus moves to the banner only when the visitor opens it themselves.
  function show(moveFocus) {
    if (!banner) build();
    banner.hidden = false;
    var first = banner.querySelector('button');
    if (moveFocus && first) first.focus({ preventScroll: true });
  }
  function hide() { if (banner) banner.hidden = true; }

  function init() {
    if (!getChoice()) show(false);
    document.addEventListener('click', function (e) {
      var link = e.target.closest('[data-cookie-settings]');
      if (!link) return;
      e.preventDefault();
      show(true);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
