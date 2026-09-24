/* Portfolio Omar Zein — scripts communs */
(function () {
  'use strict';

  // Halo lumineux qui suit le curseur
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('pointermove', function (e) {
      document.body.style.setProperty('--mx', e.clientX + 'px');
      document.body.style.setProperty('--my', e.clientY + 'px');
    });
  }

  // Apparition progressive des éléments .reveal (une seule fois)
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Menu latéral : met en évidence la section visible
  var navLinks = document.querySelectorAll('.side-nav a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && byId[entry.target.id]) {
          navLinks.forEach(function (a) { a.classList.remove('active'); });
          byId[entry.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  // Liste des projets : filtres par catégorie + recherche
  var grid = document.querySelector('[data-projects]');
  if (grid) {
    var buttons = document.querySelectorAll('.filter-btn');
    var search = document.getElementById('project-search');
    var groups = document.querySelectorAll('[data-group]');
    var empty = document.getElementById('empty-state');
    var current = 'all';

    var normalize = function (s) {
      return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    };

    var apply = function () {
      var q = normalize(search ? search.value.trim() : '');
      var visibleTotal = 0;
      groups.forEach(function (group) {
        var visibleInGroup = 0;
        group.querySelectorAll('.project-card').forEach(function (card) {
          var matchCat = current === 'all' || card.dataset.cat === current;
          var matchText = !q || normalize(card.textContent).indexOf(q) !== -1;
          var show = matchCat && matchText;
          card.hidden = !show;
          if (show) visibleInGroup++;
        });
        group.hidden = visibleInGroup === 0;
        visibleTotal += visibleInGroup;
      });
      if (empty) empty.hidden = visibleTotal !== 0;
    };

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        current = btn.dataset.filter;
        apply();
      });
    });
    if (search) search.addEventListener('input', apply);
  }

  // Formulaire de contact : envoi sans quitter la page (repli sur l'envoi classique)
  var form = document.getElementById('contact-form');
  if (form && window.fetch && window.FormData) {
    var status = document.getElementById('form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      status.className = 'form-status';
      status.textContent = 'Envoi en cours…';
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.className = 'form-status ok';
        status.textContent = 'Merci ! Votre message a bien été envoyé, je vous réponds rapidement.';
      }).catch(function () {
        status.className = 'form-status err';
        status.textContent = "L'envoi a échoué. Vous pouvez m'écrire directement à omarzein003@yahoo.com.";
      }).finally(function () {
        button.disabled = false;
      });
    });
  }
})();
