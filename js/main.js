'use strict';

// Coordonnées affichées dans la section contact
const CONFIG = {
  email: 'contact@travel-agency.com',
  phone: '01 23 45 67 89',
};

// Force le retour en haut de page lors d'un rechargement
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// Catalogue des destinations et des circuits
const TYPES = { plage: 'Plage', culture: 'Culture', ville: 'Ville', aventure: 'Aventure' };

const DESTINATIONS = [
  { id: 'santorin',  name: 'Santorin',  country: 'Grèce',        img: 'images/santorin.avif',   types: ['culture', 'plage'],  days: 7,  price: 1290, desc: 'Villages blancs, dômes bleus et couchers de soleil sur la caldeira.' },
  { id: 'bali',      name: 'Bali',      country: 'Indonésie',    img: 'images/bali.jpeg',       types: ['plage', 'aventure'], days: 10, price: 1890, desc: 'Rizières en terrasses, temples, volcans et plages tropicales.' },
  { id: 'marrakech', name: 'Marrakech', country: 'Maroc',        img: 'images/marrakech.webp',  types: ['culture', 'ville'],  days: 5,  price: 690,  desc: 'Souks colorés, riads secrets et jardins au pied de l\'Atlas.' },
  { id: 'lisbonne',  name: 'Lisbonne',  country: 'Portugal',     img: 'images/lisbonne.png',    types: ['ville', 'culture'],  days: 5,  price: 590,  desc: 'Tramways jaunes, azulejos et terrasses face au Tage.' },
  { id: 'tokyo',     name: 'Tokyo',     country: 'Japon',        img: 'images/tokyo.jpg',       types: ['ville', 'culture'],  days: 12, price: 2390, desc: 'Néons, sanctuaires, gastronomie : la tradition et le futur côte à côte.' },
  { id: 'maldives',  name: 'Maldives',  country: 'Océan Indien', img: 'images/maldives.jpg',    types: ['plage'],             days: 8,  price: 2790, desc: 'Lagons turquoise, bungalows sur pilotis et fonds marins éblouissants.' },
  { id: 'islande',   name: 'Islande',   country: 'Islande',      img: 'images/islande.jpg',    types: ['aventure'],          days: 8,  price: 2190, desc: 'Glaciers, cascades, geysers et aurores boréales selon la saison.' },
  { id: 'toscane',   name: 'Toscane',   country: 'Italie',       img: 'images/toscane.jpeg',     types: ['culture'],           days: 6,  price: 990,  desc: 'Collines dorées, villages médiévaux, vignobles et cuisine généreuse.' },
];

const CIRCUITS = {
  famille: {
    title: 'Partez en famille',
    img: 'images/circuit-famille.png',
    desc: 'Des séjours pensés pour que petits et grands y trouvent leur compte : rythme adapté, hébergements confortables et activités pour tous les âges.',
    list: ['Hébergements adaptés aux familles', 'Activités pour tous les âges', 'Rythme modulable selon les enfants', 'Assistance pendant tout le séjour'],
    meta: 'Sur mesure · dès 2 voyageurs',
    dest: 'Circuit famille',
  },
  evasion: {
    title: 'Envie de s\'évader',
    img: 'images/circuit-evasion.jpg',
    desc: 'Une parenthèse pour décrocher : plages calmes, nature, bien-être et moments à deux ou entre amis, loin du quotidien.',
    list: ['Lieux préservés et authentiques', 'Temps libre et détente', 'Expériences locales sélectionnées', 'Programme entièrement personnalisable'],
    meta: 'Sur mesure · à deux ou entre amis',
    dest: 'Circuit évasion',
  },
};

// Petits raccourcis DOM et formatage
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => {
  const el = document.createElement('div');
  el.textContent = String(s);
  return el.innerHTML;
};
const euro = (n) => n.toLocaleString('fr-FR') + ' €';

// Active les animations JS dès que le script est chargé
document.documentElement.classList.remove('no-js');

// Header fixe, bouton retour en haut et menu burger mobile
const header = $('#header');
const toTop = $('#to-top');
function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 40);
  toTop.hidden = window.scrollY < 700;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const burger = $('#burger');
const setMenu = (open) => {
  document.body.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
};
burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
$$('#nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Met en surbrillance le lien du menu correspondant à la section affichée
const spyLinks = $$('[data-spy]');
const sections = spyLinks.map((l) => document.getElementById(l.dataset.spy)).filter(Boolean);
const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) spyLinks.forEach((l) => l.classList.toggle('active', l.dataset.spy === en.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach((s) => spy.observe(s));

// Révèle les blocs au fur et à mesure du défilement
const reveal = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      reveal.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach((el) => reveal.observe(el));

const mailLink = $('#c-mail');
mailLink.textContent = CONFIG.email;
mailLink.href = 'mailto:' + CONFIG.email;

const telLink = $('#c-tel');
telLink.textContent = CONFIG.phone;
telLink.href = 'tel:' + CONFIG.phone.replace(/[^\d+]/g, '');

// Remplit les deux listes déroulantes (recherche rapide + formulaire) et bloque les dates passées
const qDest = $('#q-dest');
const fDest = $('#f-dest');
DESTINATIONS.forEach((d) => {
  qDest.insertAdjacentHTML('beforeend', `<option value="${d.id}">${esc(d.name)} — ${esc(d.country)}</option>`);
  fDest.insertAdjacentHTML('beforeend', `<option value="${esc(d.name)}">${esc(d.name)} — ${esc(d.country)}</option>`);
});
Object.values(CIRCUITS).forEach((c) => fDest.insertAdjacentHTML('beforeend', `<option value="${esc(c.dest)}">${esc(c.dest)}</option>`));

const today = new Date().toISOString().slice(0, 10);
['q-date', 'f-date'].forEach((id) => { $('#' + id).min = today; });

// Filtrage et affichage des destinations
const state = { type: 'all', only: '' };

function drawFilters() {
  const all = [['all', 'Toutes'], ...Object.entries(TYPES)];
  $('#filters').innerHTML = all.map(([k, label]) =>
    `<button class="chip${state.type === k ? ' active' : ''}" data-type="${k}" aria-pressed="${state.type === k}">${label}</button>`
  ).join('');
}

function drawDestinations() {
  let list = DESTINATIONS;
  if (state.only) list = list.filter((d) => d.id === state.only);
  else if (state.type !== 'all') list = list.filter((d) => d.types.includes(state.type));

  $('#dest-count').innerHTML = state.only
    ? `Résultat pour <strong>${esc(DESTINATIONS.find((d) => d.id === state.only).name)}</strong> · <button class="chip" id="clear-only" style="padding:4px 14px">Tout voir</button>`
    : `${list.length} destination${list.length > 1 ? 's' : ''}`;

  $('#dest-grid').innerHTML = list.length ? list.map((d, i) => `
    <article class="dest" style="animation-delay:${i * 0.05}s">
      <div class="dest-art">
        <img src="${esc(d.img)}" alt="${esc(d.name)}, ${esc(d.country)}" width="640" height="440" loading="lazy">
        <span class="dest-tag">${esc(TYPES[d.types[0]])}</span>
      </div>
      <div class="dest-body">
        <h3>${esc(d.name)}</h3>
        <p class="dest-country">${esc(d.country)}</p>
        <p class="dest-desc">${esc(d.desc)}</p>
        <div class="dest-meta">
          <span class="dur">${d.days} jours</span>
          <span class="price">à partir de<b>${euro(d.price)}</b></span>
        </div>
        <button class="btn btn-orange" data-quote="${esc(d.name)}">Demander un devis</button>
      </div>
    </article>`).join('')
    : `<div class="empty"><h3>Rien ici pour le moment</h3><p>Essayez un autre filtre.</p></div>`;
}

$('#filters').addEventListener('click', (e) => {
  const c = e.target.closest('[data-type]');
  if (!c) return;
  state.type = c.dataset.type;
  state.only = '';
  drawFilters();
  drawDestinations();
});

$('#dest-count').addEventListener('click', (e) => {
  if (e.target.closest('#clear-only')) {
    state.only = '';
    drawFilters();
    drawDestinations();
  }
});

$('#dest-grid').addEventListener('click', (e) => {
  const q = e.target.closest('[data-quote]');
  if (q) prefillContact({ dest: q.dataset.quote });
});

// Recherche rapide depuis le hero : filtre la grille et garde la date/voyageurs en mémoire
let quick = { date: '', pax: 2 };
$('#quick').addEventListener('submit', (e) => {
  e.preventDefault();
  state.only = qDest.value;
  state.type = 'all';
  quick = { date: $('#q-date').value, pax: $('#q-pax').value || 2 };
  drawFilters();
  drawDestinations();
  document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
});

// Modale de détail pour les circuits
const modal = $('#modal');
let currentCircuit = null;
$$('[data-circuit]').forEach((btn) => btn.addEventListener('click', () => {
  const c = CIRCUITS[btn.dataset.circuit];
  currentCircuit = c;
  $('#modal-img').src = c.img;
  $('#modal-title').textContent = c.title;
  $('#modal-desc').textContent = c.desc;
  $('#modal-list').innerHTML = c.list.map((t) => `<li>${esc(t)}</li>`).join('');
  $('#modal-meta').textContent = c.meta;
  if (typeof modal.showModal === 'function') modal.showModal();
  else modal.setAttribute('open', '');
}));

const closeModal = () => (modal.close ? modal.close() : modal.removeAttribute('open'));
$('#modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
$('#modal-cta').addEventListener('click', () => {
  closeModal();
  prefillContact({ dest: currentCircuit.dest });
});

// Formulaire de contact : pré-remplissage et validation côté client
const form = $('#contact-form');
const nameI = $('#f-name');
const emailI = $('#f-email');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function prefillContact({ dest } = {}) {
  if (dest) fDest.value = [...fDest.options].some((o) => o.value === dest) ? dest : '';
  if (quick.date && !$('#f-date').value) $('#f-date').value = quick.date;
  if (quick.pax) $('#f-pax').value = quick.pax;
  $('#form-success').hidden = true;
  $('#form-body').hidden = false;
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => nameI.focus({ preventScroll: true }), 600);
}

const setInvalid = (input, bad) => {
  input.closest('.field').classList.toggle('invalid', bad);
  return bad;
};

nameI.addEventListener('input', () => setInvalid(nameI, false));
emailI.addEventListener('input', () => setInvalid(emailI, false));
$('#f-consent').addEventListener('change', () => $('#consent-err').classList.remove('show'));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const bad = [
    setInvalid(nameI, nameI.value.trim().length < 2),
    setInvalid(emailI, !EMAIL_RE.test(emailI.value.trim())),
  ].some(Boolean);
  const noConsent = !$('#f-consent').checked;
  $('#consent-err').classList.toggle('show', noConsent);

  if (bad || noConsent) {
    (bad ? (nameI.value.trim().length < 2 ? nameI : emailI) : $('#f-consent')).focus();
    return;
  }
  if ($('#f-hp').value) return; // Bloque les soumissions automatisées

  const prenom = nameI.value.trim().split(' ')[0] || 'à vous';
  $('#success-msg').textContent =
    `Merci ${prenom} ! Votre demande a bien été prise en compte. ` +
    `Un conseiller Travel Agency vous contactera sous 48 h pour construire votre voyage sur mesure.`;

  $('#form-body').hidden = true;
  $('#form-success').hidden = false;
  form.reset();
  $('#f-pax').value = 2;
});

$('#form-again').addEventListener('click', () => {
  $('#form-success').hidden = true;
  $('#form-body').hidden = false;
  nameI.focus();
});

// Premier rendu au chargement
drawFilters();
drawDestinations();