/**
 * CHIRANJIT PAL - PORTFOLIO INTERACTION ENGINE
 * Features: Typewriter, Custom Cursor, ScrollSpy, Intersection Observer Reveals,
 * Progress Bar Animation, Interactive Filter, Scroll-to-Top Ring, Form Handler.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Theme Engine (Seamless Dark / Light Mode Switch)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'fa-solid fa-moon';
        themeToggleBtn?.setAttribute('title', 'Switch to Dark Theme');
        themeToggleBtn?.setAttribute('aria-label', 'Switch to Dark Theme');
      } else {
        themeIcon.className = 'fa-solid fa-sun';
        themeToggleBtn?.setAttribute('title', 'Switch to Light Theme');
        themeToggleBtn?.setAttribute('aria-label', 'Switch to Light Theme');
      }
    }
    localStorage.setItem('portfolio-theme', theme);
  }

  // Initialize theme on page load
  applyTheme(savedTheme);

  themeToggleBtn?.addEventListener('click', () => {
    themeToggleBtn.classList.add('rotating');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    setTimeout(() => {
      themeToggleBtn.classList.remove('rotating');
    }, 550);
  });

  // 1. Dynamic Year Update
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // 2. Animated Typing Effect
  const typingTextEl = document.getElementById('typingText');
  const roles = [
    'Web Developer',
    'Web Designer',
    'Full-Stack Enthusiast',
    'PHP & MySQL Developer',
    'Frontend Specialist'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeEffect() {
    if (!typingTextEl) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 105;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2200; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 450; // Pause before typing next word
    }

    setTimeout(typeEffect, typeSpeed);
  }

  setTimeout(typeEffect, 600);

  // 3. Custom Cursor Mechanics
  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');

  if (cursorDot && cursorOutline && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let outlineX = -100;
    let outlineY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth lerp animation for cursor outline
    function animateOutline() {
      const ease = 0.18;
      outlineX += (mouseX - outlineX) * ease;
      outlineY += (mouseY - outlineY) * ease;

      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;

      requestAnimationFrame(animateOutline);
    }
    requestAnimationFrame(animateOutline);

    // Interactive Hover States
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-card, .mini-prod-card, .filter-btn');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorOutline.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
    });
  }

  // 4. Header Scroll State
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 5. Mobile Navigation Menu Toggle & Backdrop
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navBackdrop = document.getElementById('navBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMobileNav() {
    navToggle?.classList.add('open');
    navMenu?.classList.add('open');
    navBackdrop?.classList.add('open');
    navToggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  function closeMobileNav() {
    navToggle?.classList.remove('open');
    navMenu?.classList.remove('open');
    navBackdrop?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close menu when clicking backdrop
    navBackdrop?.addEventListener('click', closeMobileNav);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('open')) {
        closeMobileNav();
      }
    });

    // Auto-close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && navMenu.classList.contains('open')) {
        closeMobileNav();
      }
    });
  }

  // 6. Active Section ScrollSpy (Syncs Top Navbar & Mobile Bottom Dock)
  const sections = document.querySelectorAll('section[id]');
  const mobileDockLinks = document.querySelectorAll('.mobile-dock-item');

  function updateScrollSpy() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const currentNavLink = document.querySelector(`.nav-menu a[href*="#${sectionId}"]`);
      const currentDockLink = document.querySelector(`.mobile-bottom-dock a[href*="#${sectionId}"]`);

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => link.classList.remove('active'));
        currentNavLink?.classList.add('active');

        if (currentDockLink) {
          mobileDockLinks.forEach((dockLink) => dockLink.classList.remove('active'));
          currentDockLink.classList.add('active');
        }
      }
    });
  }
  window.addEventListener('scroll', updateScrollSpy);
  updateScrollSpy();

  // 7. Scroll Reveal Observer (Eager trigger to prevent blank voids)
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px 60px 0px'
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // 8. Animated Skill Progress Bars
  const skillsSection = document.getElementById('skills');
  const progressFills = document.querySelectorAll('.progress-bar-fill');
  let animatedSkills = false;

  if (skillsSection && progressFills.length > 0) {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedSkills) {
            animatedSkills = true;
            progressFills.forEach((fill) => {
              const targetProgress = fill.getAttribute('data-progress');
              if (targetProgress) {
                fill.style.width = targetProgress;
              }
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    skillsObserver.observe(skillsSection);
  }

  // 9. Skills Filter Functionality
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCategoryCards = document.querySelectorAll('.skill-category-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      skillCategoryCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 10. Subtle 3D Card Hover Tilt Effect
  const tiltCards = document.querySelectorAll('.project-card, .code-card');
  if (window.matchMedia('(pointer: fine)').matches) {
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  // 11. Scroll-to-Top Button with Circular SVG Progress
  const scrollTopBtn = document.getElementById('scrollTop');
  const circle = document.querySelector('.progress-ring-circle');

  if (scrollTopBtn && circle) {
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    function setProgress(percent) {
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;

      if (scrollTop > 350) {
        scrollTopBtn.classList.add('visible');
        setProgress(scrollPercent);
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 12. Interactive Contact Form with Validation & Feedback
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const subject = document.getElementById('subject')?.value.trim() || 'Portfolio Contact Inquiry';
      const message = document.getElementById('message')?.value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Button loading state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Opening Mail App...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

      // Construct mailto link
      const mailtoUri = `mailto:chiranjitpal212@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(
        `Hello Chiranjit,\n\n${message}\n\n---\nSender Details:\nName: ${name}\nEmail: ${email}`
      )}`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;

        showStatus(`Opening your email client to send message to chiranjitpal212@gmail.com...`, 'success');

        // Launch mail client directly
        window.location.href = mailtoUri;

        setTimeout(() => {
          contactForm.reset();
        }, 1200);
      }, 600);
    });
  }

  function showStatus(text, type) {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';

    setTimeout(() => {
      formStatus.style.display = 'none';
    }, 7000);
  }

  // 13. Resume Modal & Print / Download Engine
  const resumeModal = document.getElementById('resumeModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');
  const downloadResumeBtn = document.getElementById('downloadResumeBtn');
  const openResumeBtns = document.querySelectorAll('.open-resume-btn, .resume-btn');

  function openModal() {
    if (!resumeModal) return;
    resumeModal.classList.add('active');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openResumeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeModalBtn?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal?.classList.contains('active')) {
      closeModal();
    }
  });

  printResumeBtn?.addEventListener('click', () => {
    window.print();
  });

  downloadResumeBtn?.addEventListener('click', () => {
    window.print();
  });
});
