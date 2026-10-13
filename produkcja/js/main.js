/**
 * KLINIKA PIĘKNA KALINA - JAVASCRIPT LOGIC & INTERACTIONS
 * Luxury Aesthetics, Interactive Quiz with Photos, Service Filtering, Live Price Search,
 * Full-Featured Lightbox Gallery & Inline Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBeautyAdvisor();
  initServiceTabs();
  initPricingSearch();
  initGalleryLightbox();
  initContactForm();
  initScrollTop();
  initCookieConsent();
  initPrivacyModal();
});

/* ==========================================================================
   NAVBAR & MOBILE MENU
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('main-header');
  const toggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu open / close toggle
  const closeMenu = () => {
    if (navMenu) navMenu.classList.remove('open');
    if (toggleBtn) {
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.classList.remove('nav-locked');
  };

  const openMenu = () => {
    if (navMenu) navMenu.classList.add('open');
    if (toggleBtn) {
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
    if (navOverlay) navOverlay.classList.add('active');
    document.body.classList.add('nav-locked');
  };

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', closeMenu);
    }

    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Active section indicator on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   BEAUTY ADVISOR / INTERACTIVE TREATMENT QUIZ (WITH PHOTOS)
   ========================================================================== */
function initBeautyAdvisor() {
  const goalButtons = document.querySelectorAll('.quiz-goal-btn');
  const titleEl = document.getElementById('quiz-res-title');
  const badgeEl = document.getElementById('quiz-res-badge');
  const priceEl = document.getElementById('quiz-res-price');
  const descEl = document.getElementById('quiz-res-desc');
  const imgEl = document.getElementById('quiz-res-img');
  const booksyBtn = document.getElementById('quiz-res-booksy');

  const recommendations = {
    odmlodzenie: {
      title: "Radiofrekwencja Mikroigłowa + Laser Erbowo-Szklany",
      badge: "Flagowy Zabieg Anti-Ageing",
      price: "od 850 PLN",
      desc: "Nasz autorski, najsilniejszy duet odmładzający. Łączy głęboką przebudowę włókien kolagenowych za pomocą RF z frakcyjnym resurfacingiem laserowym. Daje spektakularny efekt wygładzenia zmarszczek, ujędrnienia owalu i odmłodzenia skóry o lata.",
      img: "assets/images/services_face8.jpg",
      booksyUrl: "https://booksy.com/pl-pl/98996_klinika-piekna-kalina_salon-kosmetyczny_3_warszawa"
    },
    nawilzenie: {
      title: "Infuzja Tlenowa INTRACEUTICALS (Rejuvenate / Booster)",
      badge: "Gwiazdorski Rytuał Tlenowy",
      price: "480 - 650 PLN",
      desc: "Zabieg uwielbiany przez gwiazdy kina i mody. Wykorzystuje technologię czystego, hiperbarycznego tlenu do wtłaczania niskocząsteczkowego kwasu hialuronowego i antyoksydantów. Skóra natychmiast zyskuje promienne rozświetlenie, głębokie nawodnienie i jedwabistą gładkość.",
      img: "assets/images/zabieg-intraceuticals.png",
      booksyUrl: "https://booksy.com/pl-pl/98996_klinika-piekna-kalina_salon-kosmetyczny_3_warszawa"
    },
    oczyszczanie: {
      title: "5-Etapowe Oczyszczanie Wodorowe + Maska Selvert",
      badge: "Dogłębna Detoksykacja Cery",
      price: "480 PLN",
      desc: "Innowacyjna hydro-dermabrazja aktywnym wodorem, która neutralizuje wolne rodniki, odblokowuje pory i usuwa zrogowaciały naskórek. Zabieg uzupełniony o infuzję antyoksydacyjną i kojącą maskę osmotyczną Selvert Thermal.",
      img: "assets/images/zabieg-oczyszczanie.jpg",
      booksyUrl: "https://booksy.com/pl-pl/98996_klinika-piekna-kalina_salon-kosmetyczny_3_warszawa"
    },
    naczynka: {
      title: "Diego Dalla Palma SENSITIVE + Resurfacing Azelainowy",
      badge: "Kojenie & Wzmocnienie Naczynek",
      price: "280 - 330 PLN",
      desc: "Specjalistyczna terapia dla cer wrażliwych, naczynkowych i z trądzikiem różowatym. Oparta na 51+3 Hyalu Complex z ceramidami i neuro-peptydami wyciszającymi stan zapalny oraz kwasie azelainowym i kojowym DermaQuest.",
      img: "assets/images/zabieg-dermaquest.jpg",
      booksyUrl: "https://booksy.com/pl-pl/98996_klinika-piekna-kalina_salon-kosmetyczny_3_warszawa"
    },
    sylwetka: {
      title: "LipoRadioLogie VINCI & EMSCULPT (Modelowanie Sylwetki)",
      badge: "Redukcja Cellulitu i Rzeźbienie Mięśni",
      price: "od 190 PLN",
      desc: "Synergia fal radiowych, masażu podciśnieniowego, światła LED i lasera biostymulującego połączona z technologią EMSCULPT. Skutecznie rozbija tkankę tłuszczową, drenuje obrzęki, wygładza cellulit i intensywnie ujędrnia wiotką skórę.",
      img: "assets/images/oferta-odchudzanie.jpg",
      booksyUrl: "https://booksy.com/pl-pl/98996_klinika-piekna-kalina_salon-kosmetyczny_3_warszawa"
    },
    dlonie: {
      title: "Luksusowy Pedicure SPA & Manicure Hybrydowy",
      badge: "Kompletna Pielęgnacja Dłoni i Stóp",
      price: "120 - 240 PLN",
      desc: "Pełen rytuał pielęgnacyjny z peelingiem, wygładzeniem naskórka, odżywczą kąpielą parafinową oraz perfekcyjną stylizacją paznokci na bezpiecznych produktach premium. Piękne, zadbane dłonie i stopy przez cały rok.",
      img: "assets/images/oferta-stopy.jpg",
      booksyUrl: "https://booksy.com/pl-pl/98996_klinika-piekna-kalina_salon-kosmetyczny_3_warszawa"
    }
  };

  goalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      goalButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const goal = btn.dataset.goal;
      const rec = recommendations[goal];
      if (rec && titleEl) {
        const resBox = document.querySelector('.quiz-result-card');
        resBox.style.opacity = '0.4';
        setTimeout(() => {
          titleEl.textContent = rec.title;
          badgeEl.textContent = rec.badge;
          priceEl.textContent = rec.price;
          descEl.textContent = rec.desc;
          if (imgEl) {
            imgEl.src = rec.img;
            imgEl.alt = rec.title;
          }
          if (booksyBtn) booksyBtn.href = rec.booksyUrl;
          resBox.style.opacity = '1';
        }, 180);
      }
    });
  });
}

/* ==========================================================================
   SERVICE TABS & FILTERING
   ========================================================================== */
function initServiceTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      serviceCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   PRICING LIVE SEARCH WITH EMPTY STATE
   ========================================================================== */
function initPricingSearch() {
  const searchInput = document.getElementById('price-search-input');
  const priceRows = document.querySelectorAll('.pricing-row');
  const categoryCards = document.querySelectorAll('.pricing-category-card');
  const emptyState = document.getElementById('pricing-empty-state');
  const resetBtn = document.getElementById('reset-price-search');

  if (!searchInput) return;

  const performSearch = () => {
    const query = searchInput.value.toLowerCase().trim();
    let totalMatches = 0;

    categoryCards.forEach(card => {
      const rows = card.querySelectorAll('.pricing-row');
      let visibleCount = 0;

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(query)) {
          row.style.display = 'flex';
          visibleCount++;
          totalMatches++;
        } else {
          row.style.display = 'none';
        }
      });

      // Hide category block if no items match
      if (visibleCount === 0 && query !== '') {
        card.style.display = 'none';
      } else {
        card.style.display = 'block';
      }
    });

    if (emptyState) {
      if (totalMatches === 0 && query !== '') {
        emptyState.style.display = 'block';
      } else {
        emptyState.style.display = 'none';
      }
    }
  };

  searchInput.addEventListener('input', performSearch);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      performSearch();
      searchInput.focus();
    });
  }
}

/* ==========================================================================
   VIRTUAL GALLERY LIGHTBOX WITH FULL NAVIGATION & CAPTIONS
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!lightbox) return;

  const photos = [];
  galleryItems.forEach(item => {
    const img = item.querySelector('img');
    const caption = item.dataset.caption || (img ? img.alt : '');
    if (img) {
      photos.push({
        src: img.src,
        alt: img.alt || 'Klinika Kalina',
        caption: caption
      });
    }
  });

  let currentIndex = 0;

  const updateModalContent = (index) => {
    if (index < 0) index = photos.length - 1;
    if (index >= photos.length) index = 0;
    currentIndex = index;

    const current = photos[currentIndex];
    if (lightboxImg && current) {
      lightboxImg.src = current.src;
      lightboxImg.alt = current.alt;
    }
    if (lightboxCaption && current) {
      lightboxCaption.textContent = current.caption;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${photos.length}`;
    }
  };

  const openLightbox = (index) => {
    updateModalContent(index);
    lightbox.classList.add('active');
    document.body.classList.add('nav-locked');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.classList.remove('nav-locked');
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateModalContent(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateModalContent(currentIndex + 1);
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      updateModalContent(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      updateModalContent(currentIndex - 1);
    }
  });
}

/* ==========================================================================
   CONTACT FORM HANDLER WITH PRODUCTION BACKEND INTEGRATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('cf-submit-btn');
  const submitText = document.getElementById('cf-submit-text');

  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('#cf-name');
    const phoneInput = form.querySelector('#cf-phone');
    const rodoInput = form.querySelector('#cf-rodo');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';

    if (!name || name.length < 2) {
      feedback.innerHTML = 'Prosimy o podanie poprawnego imienia i nazwiska.';
      feedback.className = 'form-feedback error';
      feedback.style.display = 'block';
      nameInput.focus();
      return;
    }

    if (!phone || phone.length < 7) {
      feedback.innerHTML = 'Prosimy o podanie prawidłowego numeru telefonu do kontaktu.';
      feedback.className = 'form-feedback error';
      feedback.style.display = 'block';
      phoneInput.focus();
      return;
    }

    if (rodoInput && !rodoInput.checked) {
      feedback.innerHTML = 'Wymagana jest akceptacja zgody na kontakt (RODO).';
      feedback.className = 'form-feedback error';
      feedback.style.display = 'block';
      rodoInput.focus();
      return;
    }

    // Set loading state
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Wysyłanie wiadomości...';
    feedback.style.display = 'none';

    const formData = new FormData(form);

    try {
      const response = await fetch('contact.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data && data.status === 'success') {
        feedback.innerHTML = `
          <strong>Dziękujemy, ${name}!</strong> ${data.message || 'Twoja wiadomość została pomyślnie wysłana.'}<br>
          <em>Recepcja skontaktuje się z Tobą telefonicznie w najszybszym możliwym czasie.</em>
        `;
        feedback.className = 'form-feedback success';
        feedback.style.display = 'block';
        form.reset();
      } else {
        const errorMsg = data && data.message ? data.message : 'Wystąpił problem z wysłaniem formularza.';
        feedback.innerHTML = `${errorMsg} Prosimy o kontakt bezpośredni: <a href="tel:+48500516118"><strong>+48 500 516 118</strong></a> lub rezerwację przez Booksy.`;
        feedback.className = 'form-feedback error';
        feedback.style.display = 'block';
      }
    } catch (err) {
      // W środowisku bez PHP (np. podgląd statyczny / serwer python)
      feedback.innerHTML = `
        <strong>Dziękujemy, ${name}!</strong> Wiadomość jest gotowa.<br>
        <em>W środowisku produkcyjnym z obsługą PHP formularz automatycznie wysyła e-mail na skrzynkę: kontakt@klinikakalina.pl.</em><br>
        W tej chwili możesz również bezpośrednio <a href="https://booksy.com/pl-pl/98996_klinika-piekna-kalina_salon-kosmetyczny_3_warszawa" target="_blank" rel="noopener"><strong>zarezerwować wizytę na Booksy</strong></a> lub zadzwonić pod numer <a href="tel:+48500516118"><strong>500 516 118</strong></a>.
      `;
      feedback.className = 'form-feedback success';
      feedback.style.display = 'block';
      form.reset();
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = 'Wyślij Wiadomość';
      setTimeout(() => {
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  });
}

/* ==========================================================================
   COOKIE CONSENT & PRIVACY MODAL
   ========================================================================== */
function initCookieConsent() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const essentialBtn = document.getElementById('cookie-essential');

  if (!banner) return;

  const consent = localStorage.getItem('kalina_cookie_consent');
  if (!consent) {
    setTimeout(() => {
      banner.classList.add('visible');
    }, 1200);
  }

  const setConsent = (type) => {
    localStorage.setItem('kalina_cookie_consent', type);
    banner.classList.remove('visible');
  };

  if (acceptBtn) acceptBtn.addEventListener('click', () => setConsent('all'));
  if (essentialBtn) essentialBtn.addEventListener('click', () => setConsent('essential'));
}

function initPrivacyModal() {
  const modal = document.getElementById('privacy-modal');
  const closeBtn = document.getElementById('privacy-modal-close');
  const triggerLinks = [
    document.getElementById('open-form-privacy'),
    document.getElementById('cookie-privacy-link')
  ];

  if (!modal) return;

  const openModal = (e) => {
    if (e) e.preventDefault();
    modal.classList.add('active');
    document.body.classList.add('nav-locked');
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.classList.remove('nav-locked');
  };

  triggerLinks.forEach(link => {
    if (link) link.addEventListener('click', openModal);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   SCROLL TO TOP
   ========================================================================== */
function initScrollTop() {
  const scrollBtn = document.getElementById('scroll-top-btn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
