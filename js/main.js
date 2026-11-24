/* Selim Şahin — portfolyo betiği
   1) Tema anahtarı  2) Proje kartları  3) Dönen unvan
   4) E-posta        5) CV düğmesi       6) Kaydırınca belirme */

(function () {
  'use strict';

  var kok = document.documentElement;
  var hareketAz = window.matchMedia('(prefers-reduced-motion: reduce)');
  var sistemKoyu = window.matchMedia('(prefers-color-scheme: dark)');

  /* ---------- 1) Tema: Açık / Koyu / Sistem ---------- */
  function temaOku() {
    try { return localStorage.getItem('tema') || 'sistem'; } catch (e) { return 'sistem'; }
  }
  function temaUygula(tercih) {
    var koyu = tercih === 'koyu' || (tercih === 'sistem' && sistemKoyu.matches);
    kok.setAttribute('data-theme', koyu ? 'dark' : 'light');
    kok.setAttribute('data-tema-tercih', tercih);
    document.querySelectorAll('.tema-anahtari button').forEach(function (b) {
      var secili = b.dataset.tema === tercih;
      b.setAttribute('aria-checked', String(secili));
      b.tabIndex = secili ? 0 : -1; // radyo grubu: Tab ile bir kez girilir, oklarla gezilir
    });
  }
  function temaSec(tercih) {
    try { localStorage.setItem('tema', tercih); } catch (e) { /* gizli sekme vb. */ }
    temaUygula(tercih);
  }

  var temaDugmeleri = Array.prototype.slice.call(document.querySelectorAll('.tema-anahtari button'));
  temaDugmeleri.forEach(function (b, i) {
    b.addEventListener('click', function () { temaSec(b.dataset.tema); });
    b.addEventListener('keydown', function (e) {
      var yon = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!yon) return;
      e.preventDefault();
      var sonraki = temaDugmeleri[(i + yon + temaDugmeleri.length) % temaDugmeleri.length];
      temaSec(sonraki.dataset.tema);
      sonraki.focus();
    });
  });
  // Sistem teması değişirse (ör. akşam otomatik koyuya geçiş) ve tercih "sistem"se takip et
  sistemKoyu.addEventListener('change', function () {
    if (temaOku() === 'sistem') temaUygula('sistem');
  });
  temaUygula(temaOku());

  /* ---------- 2) Proje kartları: data/projeler.json'dan ---------- */
  function el(etiket, sinif, metin) {
    var d = document.createElement(etiket);
    if (sinif) d.className = sinif;
    if (metin != null) d.textContent = metin;
    return d;
  }
  function dugme(href, metin, sinif, ariaEtiket) {
    var a = el('a', 'buton ' + sinif, metin);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', ariaEtiket);
    return a;
  }

  function yerTutucu(p) {
    var y = el('div', 'kart-yer-tutucu');
    y.setAttribute('role', 'img');
    y.setAttribute('aria-label', p.baslik + ' için görsel yer tutucu');
    var ikon = el('span', 'ikon', p.yerTutucu || '✦');
    ikon.setAttribute('aria-hidden', 'true');
    var ad = el('span', 'ad', p.baslik);
    ad.setAttribute('aria-hidden', 'true');
    y.append(ikon, ad);
    return y;
  }

  function kartYap(p) {
    var li = el('li');
    var kart = el('article', 'kart');

    if (p.gorsel) {
      var img = el('img', 'kart-gorsel');
      img.src = p.gorsel;
      img.alt = p.gorselAlt || p.baslik + ' ekran görüntüsü';
      img.width = 800; img.height = 500;
      img.loading = 'lazy';
      img.decoding = 'async';
      // Görsel yoksa ya da yüklenemezse yer tutucuya geç
      img.addEventListener('error', function () { img.replaceWith(yerTutucu(p)); });
      kart.append(img);
    } else {
      kart.append(yerTutucu(p));
    }

    var govde = el('div', 'kart-govde');
    var ust = el('div', 'kart-ust');
    ust.append(el('h3', null, p.baslik));
    if (p.durum) ust.append(el('span', 'rozet', p.durum));
    govde.append(ust, el('p', null, p.aciklama));

    if (p.etiketler && p.etiketler.length) {
      var ul = el('ul', 'etiketler');
      ul.setAttribute('aria-label', 'Kullanılan teknolojiler');
      p.etiketler.forEach(function (t) { ul.append(el('li', null, t)); });
      govde.append(ul);
    }
    if (p.not) {
      var not = el('p', 'kart-not');
      var i = el('span', null, 'ⓘ');
      i.setAttribute('aria-hidden', 'true');
      not.append(i, document.createTextNode(p.not));
      govde.append(not);
    }

    var butonlar = el('div', 'kart-butonlar');
    if (p.canli) butonlar.append(dugme(p.canli, '▶ Oyna', 'buton-ana', p.baslik + ' — oyna (yeni sekmede açılır)'));
    if (p.repo) butonlar.append(dugme(p.repo, 'Kod', 'buton-ikincil', p.baslik + ' — kaynak kodu GitHub\'da (yeni sekmede açılır)'));
    if (butonlar.children.length) govde.append(butonlar);

    kart.append(govde);
    li.append(kart);
    return li;
  }

  var liste = document.getElementById('proje-listesi');
  fetch('data/projeler.json')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (projeler) {
      projeler.forEach(function (p) { liste.append(kartYap(p)); });
    })
    .catch(function () {
      var li = el('li');
      li.innerHTML = 'Projeler yüklenemedi. Hepsini <a href="https://github.com/Selim-Sahin">GitHub profilimde</a> görebilirsiniz.';
      liste.append(li);
    });

  /* ---------- 3) Sırayla değişen unvan ---------- */
  var unvanlar = [
    'Bilgisayar Mühendisliği Öğrencisi',
    'Oyun Geliştirici',
    'C ve Python ile proje geliştiriyorum'
  ];
  var unvanEl = document.querySelector('.unvan-donen');
  var unvanSira = 0, unvanZamanlayici = null;
  function unvanDondur() {
    unvanEl.classList.add('cikiyor');
    setTimeout(function () {
      unvanSira = (unvanSira + 1) % unvanlar.length;
      unvanEl.textContent = unvanlar[unvanSira];
      unvanEl.classList.remove('cikiyor');
    }, 350);
  }
  function unvanAyarla() {
    clearInterval(unvanZamanlayici);
    if (hareketAz.matches) {
      // Hareket istemeyenler için dönmez; hepsi tek satırda durur
      unvanEl.textContent = 'Bilgisayar Mühendisliği Öğrencisi · Oyun Geliştirici';
    } else {
      unvanEl.textContent = unvanlar[unvanSira];
      unvanZamanlayici = setInterval(unvanDondur, 3000);
    }
  }
  if (unvanEl) { unvanAyarla(); hareketAz.addEventListener('change', unvanAyarla); }

  /* ---------- 4) E-posta: botlar HTML'de hazır adres bulamasın diye burada birleşir ---------- */
  document.querySelectorAll('a.eposta').forEach(function (a) {
    var adres = a.dataset.k + '@' + a.dataset.a;
    a.href = 'mailto:' + adres;
    a.querySelector('.eposta-metin').textContent = adres;
  });

  /* ---------- 5) CV: PDF yoksa düğmeler "yakında"ya döner ---------- */
  var cvDugmeleri = document.querySelectorAll('.cv-indir');
  function cvYok() {
    cvDugmeleri.forEach(function (a) {
      if (a.closest('.cv-eylem')) { a.hidden = true; return; } // CV bölümünde not gösterilir
      a.removeAttribute('href');
      a.removeAttribute('download');
      a.setAttribute('aria-disabled', 'true');
      a.textContent = 'CV yakında';
    });
    var not = document.querySelector('.cv-yakinda');
    if (not) not.hidden = false;
  }
  if (cvDugmeleri.length) {
    fetch(cvDugmeleri[0].getAttribute('href'), { method: 'HEAD' })
      .then(function (r) { if (!r.ok) cvYok(); })
      .catch(cvYok);
  }

  /* ---------- 6) Kaydırınca yumuşakça belirme ---------- */
  var bolumler = document.querySelectorAll('.belir');
  if (!('IntersectionObserver' in window)) {
    bolumler.forEach(function (b) { b.classList.add('gorundu'); });
  } else {
    var gozcu = new IntersectionObserver(function (girdiler) {
      girdiler.forEach(function (g) {
        if (g.isIntersecting) { g.target.classList.add('gorundu'); gozcu.unobserve(g.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    bolumler.forEach(function (b) { gozcu.observe(b); });
  }

  var yil = document.getElementById('yil');
  if (yil) yil.textContent = new Date().getFullYear();
})();
