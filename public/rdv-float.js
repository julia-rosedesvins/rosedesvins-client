(function () {
  var script = document.currentScript;
  if (!script) return;

  var userId = script.getAttribute('data-user');
  var serviceId = script.getAttribute('data-service');
  var color = script.getAttribute('data-color') || '#3A7B59';
  if (!userId || !serviceId) return;

  var origin;
  try {
    origin = new URL(script.src).origin;
  } catch (e) {
    origin = window.location.origin;
  }

  var rootId = 'rdv-float-root';
  if (document.getElementById(rootId)) return;

  var iframeSrc = origin + '/if/booking-widget/' + encodeURIComponent(userId) + '/' + encodeURIComponent(serviceId) + '/reservation';
  var isOpen = false;

  var root = document.createElement('div');
  root.id = rootId;
  root.setAttribute('data-rdv-float', '1');

  var style = document.createElement('style');
  style.textContent =
    '#' + rootId + '{all:initial;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;}' +
    '#' + rootId + ' *{box-sizing:border-box;}' +
    '#' + rootId + ' .rdv-btn{position:fixed;right:24px;bottom:24px;z-index:2147483000;display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border:0;border-radius:999px;background:' + color + ';color:#fff;font-size:15px;font-weight:600;line-height:1;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.22);}' +
    '#' + rootId + ' .rdv-btn:hover{filter:brightness(0.92);}' +
    '#' + rootId + ' .rdv-backdrop{position:fixed;inset:0;z-index:2147482998;background:rgba(15,23,42,.35);opacity:0;pointer-events:none;transition:opacity .18s ease;}' +
    '#' + rootId + ' .rdv-backdrop.rdv-open{opacity:1;pointer-events:auto;}' +
    '#' + rootId + ' .rdv-panel{position:fixed;right:24px;bottom:88px;z-index:2147482999;width:400px;max-width:calc(100vw - 24px);height:min(80vh,720px);background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,.28);transform:translateY(12px);opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease;}' +
    '#' + rootId + ' .rdv-panel.rdv-open{opacity:1;transform:none;pointer-events:auto;}' +
    '#' + rootId + ' .rdv-header{display:flex;align-items:center;justify-content:flex-end;height:40px;padding:0 8px;background:' + color + ';}' +
    '#' + rootId + ' .rdv-close{width:28px;height:28px;border:0;border-radius:50%;background:rgba(255,255,255,.18);color:#fff;font-size:18px;line-height:1;cursor:pointer;}' +
    '#' + rootId + ' .rdv-close:hover{background:rgba(255,255,255,.3);}' +
    '#' + rootId + ' .rdv-frame{width:100%;height:calc(100% - 40px);border:0;display:block;background:#fff;}' +
    '@media (max-width:640px){#' + rootId + ' .rdv-panel{right:0;bottom:0;width:100vw;max-width:100vw;height:100vh;height:100dvh;border-radius:0;}#' + rootId + ' .rdv-btn{right:16px;bottom:16px;}}';

  var backdrop = document.createElement('div');
  backdrop.className = 'rdv-backdrop';

  var panel = document.createElement('div');
  panel.className = 'rdv-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Réservation');

  var header = document.createElement('div');
  header.className = 'rdv-header';

  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'rdv-close';
  closeBtn.setAttribute('aria-label', 'Fermer');
  closeBtn.textContent = '×';

  var iframe = document.createElement('iframe');
  iframe.className = 'rdv-frame';
  iframe.title = 'Réservation';
  iframe.setAttribute('allowfullscreen', '');

  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'rdv-btn';
  button.setAttribute('aria-label', 'Réserver');
  button.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
    '<span>Réserver</span>';

  function setOpen(next) {
    isOpen = next;
    backdrop.classList.toggle('rdv-open', isOpen);
    panel.classList.toggle('rdv-open', isOpen);
    if (isOpen && !iframe.src) {
      iframe.src = iframeSrc;
    }
  }

  button.addEventListener('click', function () {
    setOpen(!isOpen);
  });
  closeBtn.addEventListener('click', function () {
    setOpen(false);
  });
  backdrop.addEventListener('click', function () {
    setOpen(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen) setOpen(false);
  });

  header.appendChild(closeBtn);
  panel.appendChild(header);
  panel.appendChild(iframe);
  root.appendChild(style);
  root.appendChild(backdrop);
  root.appendChild(panel);
  root.appendChild(button);

  var mount = function () {
    document.body.appendChild(root);
  };
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
