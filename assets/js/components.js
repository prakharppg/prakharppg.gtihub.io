(function () {
  const data = window.siteData || {};

  function getCurrentPage() {
    return document.body?.dataset?.page || 'home';
  }

  function initMount(mount, template) {
    if (!mount) return;
    mount.innerHTML = template;
    if (window.Alpine) window.Alpine.initTree(mount);
  }

  function navTemplate() {
    return `
      <nav class="navbar navbar-expand-lg fixed-top" x-data="siteComponents.navbar()">
        <div class="container">
          <a class="navbar-brand" href="index.html">
            <img :src="company.logo" :alt="company.legalName" width="256" height="154" decoding="async" fetchpriority="high" @error="$el.style.display='none'; $el.nextElementSibling.style.display='block';">
            <span style="display:none; font-weight:700; color:var(--primary-blue);" x-text="company.shortName"></span>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="fa fa-bars"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <template x-for="link in navLinks" :key="link.page">
                <li class="nav-item">
                  <a class="nav-link" :class="{ active: isActive(link.page) }" :href="link.href" x-text="link.label"></a>
                </li>
              </template>
            </ul>
            <a href="contact.html" class="btn btn-primary ms-lg-3 animate__animated animate__pulse animate__infinite">Get Started</a>
          </div>
        </div>
      </nav>`;
  }

  function footerTemplate() {
    return `
      <footer class="text-white" x-data="siteComponents.footer()">
        <div class="container">
          <div class="row">
            <div class="col-lg-3 mb-4">
              <h4 class="text-gold" x-text="company.legalName"></h4>
              <p>India's premier influencer marketing and talent management agency. Elevating brands through the power of stars.</p>
              <div class="social-links mt-3">
                <template x-for="social in socialLinks" :key="social.label">
                  <a :href="social.href" class="text-white me-3 fs-5" :aria-label="social.label" target="_blank" rel="noopener noreferrer"><i :class="social.icon"></i></a>
                </template>
              </div>
            </div>
            <div class="col-lg-2 mb-4">
              <h5>Quick Links</h5>
              <ul class="list-unstyled mt-3">
                <template x-for="link in navLinks" :key="link.page">
                  <li class="mb-2"><a :href="link.href" x-text="link.label"></a></li>
                </template>
              </ul>
            </div>
            <div class="col-lg-2 mb-4">
              <h5>Services</h5>
              <ul class="list-unstyled mt-3">
                <template x-for="service in serviceLinks" :key="service.label">
                  <li class="mb-2"><a :href="service.href" x-text="service.label"></a></li>
                </template>
              </ul>
            </div>
            <div class="col-lg-2 mb-4">
              <h5>Legal Docs</h5>
              <ul class="list-unstyled mt-3">
                <template x-for="doc in legalDocs" :key="doc.label">
                  <li class="mb-2"><a :href="doc.href" target="_blank" rel="noopener noreferrer" x-text="doc.label"></a></li>
                </template>
              </ul>
            </div>
            <div class="col-lg-3 mb-4">
              <h5>Contact Us</h5>
              <ul class="list-unstyled mt-3">
                <li class="mb-2"><i class="fas fa-map-marker-alt text-gold me-2"></i> <span x-text="company.location"></span></li>
                <li class="mb-2"><i class="fas fa-phone text-gold me-2"></i> <span x-text="company.phone"></span></li>
                <li class="mb-2"><i class="fas fa-envelope text-gold me-2"></i> <span x-text="company.email"></span></li>
                <li class="mb-2"><i class="fas fa-user-tie text-gold me-2"></i> <span x-text="company.directors.join(', ')"></span></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <p class="mb-0">&copy; <span x-text="year"></span> <span x-text="company.legalName"></span>. All Rights Reserved.</p>
          </div>
        </div>
      </footer>`;
  }

  function brandGridTemplate() {
    return `
      <div class="row g-4 justify-content-center brand-showcase-grid" x-data="siteComponents.brandGrid()">
        <template x-for="brand in brands" :key="brand.name">
          <div class="col-6 col-md-4 col-lg-3">
            <div class="brand-showcase-card h-100">
              <div class="brand-item w-100 m-0 border-0 shadow-none">
                <img loading="lazy" decoding="async" :src="brand.image" :alt="brand.name">
              </div>
            </div>
          </div>
        </template>
      </div>`;
  }

  function brandMarqueeTemplate(source) {
    return `
      <div class="marquee-wrapper" x-data="siteComponents.brandMarquee('${source}')">
        <div class="marquee-track">
          <template x-for="(brand, index) in duplicatedBrands" :key="source + '-' + index">
            <div class="brand-item">
              <img loading="lazy" decoding="async" :src="brand.image" :alt="brand.name">
            </div>
          </template>
        </div>
      </div>`;
  }

  function starPowerCarouselTemplate() {
    return `
      <div id="starPowerCarousel" class="carousel slide" data-bs-ride="carousel" x-data="siteComponents.starPower()">
        <div class="carousel-inner">
          <template x-for="(slide, slideIndex) in slides" :key="'slide-' + slideIndex">
            <div class="carousel-item" :class="{ active: slideIndex === 0 }">
              <div class="row justify-content-center">
                <template x-for="person in slide" :key="person.name">
                  <div class="col-md-4 mb-4">
                    <div class="talent-card">
                      <img loading="lazy" decoding="async" :src="person.image" class="talent-img" :alt="person.name">
                      <div class="talent-info">
                        <h5 x-text="person.name"></h5>
                        <p x-text="person.role"></p>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#starPowerCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon rounded-circle bg-blue p-3" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#starPowerCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon rounded-circle bg-blue p-3" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>`;
  }

  function faqTemplate() {
    return `
      <div class="accordion" id="faqAccordion" x-data="siteComponents.faq()">
        <template x-for="(item, index) in faqItems" :key="index">
          <div class="accordion-item border-0 shadow-sm mb-3">
            <h2 class="accordion-header" :id="'heading-' + index">
              <button class="accordion-button fw-bold text-blue" :class="{ collapsed: index !== 0 }" type="button"
                data-bs-toggle="collapse" :data-bs-target="'#collapse-' + index" :aria-expanded="index === 0 ? 'true' : 'false'"
                :aria-controls="'collapse-' + index" x-text="item.question"></button>
            </h2>
            <div class="accordion-collapse collapse" :class="{ show: index === 0 }" :id="'collapse-' + index"
              :aria-labelledby="'heading-' + index" data-bs-parent="#faqAccordion">
              <div class="accordion-body text-muted" x-text="item.answer"></div>
            </div>
          </div>
        </template>
      </div>`;
  }

  function portfolioFeaturedTemplate() {
    return `
      <div class="row g-4" x-data="siteComponents.portfolioFeatured()">
        <template x-for="(item, index) in items" :key="item.title + '-' + index">
          <div class="col-md-4 col-sm-6" data-aos="fade-up" :data-aos-delay="item.delay || 0">
            <div class="portfolio-card-modern">
              <img loading="lazy" decoding="async" :src="item.image" :alt="item.alt">
              <div class="portfolio-overlay-modern">
                <h5 x-text="item.title"></h5>
                <p x-text="item.category"></p>
                <a href="#" class="btn-icon-circle" aria-label="View portfolio item"><i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
        </template>
      </div>`;
  }

  function portfolioVideosTemplate() {
    return `
      <div class="masonry-grid" x-data="siteComponents.portfolioVideos()">
        <template x-for="item in items" :key="item.src">
          <div class="masonry-item" data-aos="fade-up" :data-aos-delay="item.delay || 0">
            <div class="video-card-modern">
              <video controls preload="none" playsinline class="w-100" loading="lazy">
                <source :src="item.src" type="video/mp4">
                Your browser does not support the video tag.
              </video>
              <div class="video-info">
                <h5 class="mb-0 text-white" x-text="item.title"></h5>
              </div>
            </div>
          </div>
        </template>
      </div>`;
  }

  function servicesMediaTemplate() {
    return `
      <div class="row" x-data="siteComponents.servicesMedia()">
        <template x-for="card in items" :key="card.title">
          <div class="col-md-4 mb-4" data-aos="fade-up" :data-aos-delay="card.delay || 0">
            <div class="card h-100 border-0 shadow-sm hover-effect">
              <div class="card-body p-4">
                <div class="text-center mb-3">
                  <span class="d-inline-block p-3 rounded-circle bg-light text-blue"><i :class="card.icon + ' fa-2x'"></i></span>
                </div>
                <h4 class="text-center" x-text="card.title"></h4>
                <ul class="list-unstyled mt-3 small">
                  <template x-for="point in card.items" :key="point">
                    <li><i class="fas fa-angle-right text-gold me-2"></i><span x-text="point"></span></li>
                  </template>
                </ul>
              </div>
            </div>
          </div>
        </template>
      </div>`;
  }

  function aboutTimelineTemplate() {
    return `
      <div class="timeline position-relative" x-data="siteComponents.aboutTimeline()">
        <template x-for="(item, index) in items" :key="item.year + '-' + index">
          <div class="row g-0 mb-5 fade-in-up" data-aos="fade-up">
            <div class="col-md-5" :class="item.align === 'left' ? 'text-md-end p-4 border rounded bg-white shadow-sm position-relative' : ''">
              <template x-if="item.align === 'left'">
                <div>
                  <h4 class="text-blue" x-text="item.year"></h4>
                  <h5 class="fw-bold" x-text="item.title"></h5>
                  <p x-text="item.description"></p>
                </div>
              </template>
            </div>
            <div class="col-md-2 d-none d-md-flex justify-content-center align-items-center position-relative">
              <div :class="item.accent === 'gold' ? 'bg-gold' : 'bg-blue'" class="rounded-circle d-flex justify-content-center align-items-center"
                style="width: 40px; height: 40px; z-index: 2; border: 4px solid white;"></div>
              <div class="position-absolute bg-secondary"
                :style="'width: 2px; height: ' + item.lineHeight + '; top: 0; left: 50%; transform: translateX(-50%); z-index: 1;'"></div>
            </div>
            <div class="col-md-5" :class="item.align === 'right' ? 'p-4 border rounded bg-white shadow-sm' : ''">
              <template x-if="item.align === 'right'">
                <div>
                  <h4 class="text-blue" x-text="item.year"></h4>
                  <h5 class="fw-bold" x-text="item.title"></h5>
                  <p x-text="item.description"></p>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>`;
  }

  function contactInfoTemplate() {
    return `
      <div x-data="siteComponents.contactInfo()">
        <template x-for="item in items" :key="item.title">
          <div class="d-flex mb-4">
            <div class="flex-shrink-0">
              <span :class="item.icon + ' fa-2x text-gold'"></span>
            </div>
            <div class="ms-3">
              <h5 class="fw-bold" x-text="item.title"></h5>
              <template x-if="item.value">
                <p class="text-muted mb-0" x-text="item.value"></p>
              </template>
              <template x-if="item.values">
                <div>
                  <template x-for="(value, index) in item.values" :key="value + '-' + index">
                    <p class="text-muted" :class="index === item.values.length - 1 ? 'mb-0' : 'mb-1'" x-text="value"></p>
                  </template>
                </div>
              </template>
            </div>
          </div>
        </template>

        <div class="mt-5">
          <h5 class="fw-bold mb-3">Follow Us</h5>
          <template x-for="social in socialLinks" :key="social.label">
            <a :href="social.href" class="btn btn-outline-primary btn-sm me-2 rounded-circle" :aria-label="social.label" target="_blank" rel="noopener noreferrer"><i :class="social.icon"></i></a>
          </template>
        </div>
      </div>`;
  }

  function teamGridTemplate() {
    return `
      <div class="row g-4" x-data="siteComponents.teamMembers()">
        <template x-for="member in items" :key="member.name">
          <div class="col-lg-4 col-md-6" data-aos="fade-up">
            <article class="team-card-modern h-100">
              <div class="team-card-image-wrap">
                <img loading="lazy" decoding="async" :src="member.image" class="team-card-image" :alt="member.name">
              </div>
              <div class="team-card-content">
                <span class="team-card-badge" x-text="member.role"></span>
                <h5 class="mb-2" x-text="member.name"></h5>
                <p class="mb-0 text-muted">Meet the people leading brand strategy, creative execution, and production delivery.</p>
              </div>
            </article>
          </div>
        </template>
      </div>`;
  }

  function testimonialsTemplate() {
    return `
      <div class="row g-4" x-data="siteComponents.testimonials()">
        <template x-for="item in items" :key="item.company">
          <div class="col-lg-4 col-md-6" data-aos="fade-up">
            <article class="testimonial-card-modern h-100">
              <div class="testimonial-quote-icon"><i class="fas fa-quote-left"></i></div>
              <p class="testimonial-copy">&ldquo;<span x-text="item.quote"></span>&rdquo;</p>
              <div class="testimonial-meta mt-auto">
                <h5 class="fw-bold mb-1" x-text="item.designation"></h5>
                <span class="testimonial-company" x-text="item.company"></span>
              </div>
            </article>
          </div>
        </template>
      </div>`;
  }

  window.siteComponents = {
    navbar() {
      return {
        company: data.company,
        navLinks: data.navLinks || [],
        currentPage: getCurrentPage(),
        isActive(page) {
          return this.currentPage === page;
        }
      };
    },
    footer() {
      return {
        company: data.company,
        navLinks: data.navLinks || [],
        serviceLinks: data.serviceLinks || [],
        legalDocs: data.legalDocs || [],
        socialLinks: data.socialLinks || [],
        year: new Date().getFullYear()
      };
    },
    brandGrid() {
      return { brands: data.brands || [] };
    },
    brandMarquee() {
      const brands = data.brands || [];
      return { duplicatedBrands: [...brands, ...brands] };
    },
    starPower() {
      const people = data.starPower || [];
      const slides = [];
      for (let i = 0; i < people.length; i += 3) {
        slides.push(people.slice(i, i + 3));
      }
      return { slides };
    },
    faq() {
      return { faqItems: data.faqItems || [] };
    },
    portfolioFeatured() {
      return { items: data.portfolioFeatured || [] };
    },
    portfolioVideos() {
      return { items: data.portfolioVideos || [] };
    },
    servicesMedia() {
      return { items: data.servicesMediaCards || [] };
    },
    aboutTimeline() {
      return { items: data.aboutTimeline || [] };
    },
    contactInfo() {
      return {
        items: data.contactInfoItems || [],
        socialLinks: data.contactSocialLinks || []
      };
    },
    teamMembers() {
      return { items: data.teamMembers || [] };
    },
    testimonials() {
      return { items: data.testimonials || [] };
    }
  };

  window.renderSiteComponents = function renderSiteComponents() {
    initMount(document.getElementById('site-navbar'), navTemplate());
    initMount(document.getElementById('site-footer'), footerTemplate());
    initMount(document.getElementById('home-brand-marquee'), brandGridTemplate());
    initMount(document.getElementById('portfolio-brand-marquee'), brandMarqueeTemplate('portfolio'));
    initMount(document.getElementById('star-power-carousel'), starPowerCarouselTemplate());
    initMount(document.getElementById('faq-accordion'), faqTemplate());
    initMount(document.getElementById('portfolio-featured-grid'), portfolioFeaturedTemplate());
    initMount(document.getElementById('portfolio-video-grid'), portfolioVideosTemplate());
    initMount(document.getElementById('services-media-grid'), servicesMediaTemplate());
    initMount(document.getElementById('about-timeline'), aboutTimelineTemplate());
    initMount(document.getElementById('contact-info-details'), contactInfoTemplate());
    initMount(document.getElementById('team-grid'), teamGridTemplate());
    initMount(document.getElementById('testimonials-carousel'), testimonialsTemplate());
  };
})();
