const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- mobile nav ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- active nav link on scroll ----------
const navAnchors = document.querySelectorAll('[data-nav]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navAnchors.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    });
  },
  { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
);

document.querySelectorAll('main section[id]').forEach((section) => {
  sectionObserver.observe(section);
});

// ---------- scroll reveal ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ---------- flywheel → project filter ----------
// Which stage a project belongs to lives in index.html, as data-stage on each
// article.project. This only reads it; adding a project to a stage needs no JS change.
const projects = [...document.querySelectorAll('.project[data-stage]')];
const filterBar = document.getElementById('projectFilter');
const filterStatus = document.getElementById('filterStatus');
const filterBtns = [...document.querySelectorAll('.filter-btn')];
const stageLinks = [...document.querySelectorAll('.fw-link[data-stage]')];

const stageName = (stage) => stage.charAt(0).toUpperCase() + stage.slice(1);
const countFor = (stage) =>
  stage === 'all' ? projects.length : projects.filter((p) => p.dataset.stage === stage).length;

let activeStage = 'all';

function applyFilter(stage) {
  activeStage = stage;
  projects.forEach((p) => {
    p.hidden = stage !== 'all' && p.dataset.stage !== stage;
  });
  filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === stage)));
  stageLinks.forEach((l) => l.classList.toggle('is-active', l.dataset.stage === stage));

  const n = countFor(stage);
  filterStatus.textContent =
    stage === 'all'
      ? `Showing all ${n} projects`
      : `Showing ${n} ${stageName(stage)} project${n === 1 ? '' : 's'}`;
}

if (filterBar && projects.length) {
  filterBtns.forEach((btn) => {
    const count = btn.querySelector('.filter-count');
    if (count) count.textContent = countFor(btn.dataset.filter);
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  // A segment filters to its stage and brings the results into view; clicking the
  // stage that is already active goes back to all projects.
  stageLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const stage = link.dataset.stage === activeStage ? 'all' : link.dataset.stage;
      applyFilter(stage);
      filterBar.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
      // Keyboard users land on the matching filter button, one Tab from the cards.
      filterBtns.find((b) => b.dataset.filter === stage)?.focus({ preventScroll: true });
    });
  });

  applyFilter('all');
}
