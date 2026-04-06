(function () {
  const consentKey = 'sefem_cookie_consent_v1';

  function initCookieBanner() {
    const banner = document.querySelector('[data-cookie-banner]');
    if (!banner) return;

    const existing = localStorage.getItem(consentKey);
    if (!existing) {
      banner.classList.add('visible');
    } else if (existing === 'accepted') {
      enableAnalyticsPlaceholder();
    }

    const acceptBtn = banner.querySelector('[data-cookie-accept]');
    const rejectBtn = banner.querySelector('[data-cookie-reject]');

    acceptBtn?.addEventListener('click', function () {
      localStorage.setItem(consentKey, 'accepted');
      banner.classList.remove('visible');
      enableAnalyticsPlaceholder();
    });

    rejectBtn?.addEventListener('click', function () {
      localStorage.setItem(consentKey, 'rejected');
      banner.classList.remove('visible');
    });
  }

  function enableAnalyticsPlaceholder() {
    if (window.__sefemAnalyticsLoaded) return;
    window.__sefemAnalyticsLoaded = true;
    console.info('Analytics consentito. Inserire qui il codice GA4 reale.');
  }

  function initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    const messageBox = document.querySelector('[data-form-message]');
    const mail = 'contatti@sefem.pro';

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      messageBox.className = 'form-message';
      messageBox.textContent = '';

      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const company = form.querySelector('#company').value.trim();
      const text = form.querySelector('#message').value.trim();

      if (!name || !email || !text) {
        messageBox.classList.add('error');
        messageBox.textContent = 'Compila almeno nome, email e messaggio.';
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        messageBox.classList.add('error');
        messageBox.textContent = 'Inserisci un indirizzo email valido.';
        return;
      }

      const subject = encodeURIComponent('Richiesta da sefem.pro');
      const body = encodeURIComponent(
        'Nome: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Azienda: ' + (company || '-') + '\n\n' +
        'Messaggio:\n' + text
      );

      window.location.href = 'mailto:' + mail + '?subject=' + subject + '&body=' + body;

      messageBox.classList.add('success');
      messageBox.textContent =
        'Il modulo è pronto. In questa versione statica il messaggio viene aperto nel tuo client email. Per invio automatico server-side serve un endpoint o un servizio esterno.';
      form.reset();
    });
  }

  initCookieBanner();
  initContactForm();
})();