/**
 * ELARA ATELIER - UNISEX SALON
 * Main Website Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeaderScroll();
  initSmoothScroll();
  initVideoControls();
  initContactInquiry();
});

/* Mobile Menu Toggle */
function initNavbar() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
  }
}

/* Header Scroll Glass Effect */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* Smooth Scrolling */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* Luxury Video Reels & Auto-play Controls */
function initVideoControls() {
  const videoCards = document.querySelectorAll('.luxury-video-card');

  videoCards.forEach(card => {
    const video = card.querySelector('.reel-video');
    const soundBtn = card.querySelector('.btn-sound-toggle');
    const playBtn = card.querySelector('.btn-play-toggle');
    const soundStatus = card.querySelector('.video-sound-status');

    if (!video) return;

    // Ensure video is playing automatically
    video.muted = true; // Required for browser autoplay policies
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay was prevented, wait for interaction
        console.log('Autoplay deferred for user interaction');
      });
    }

    // Sound toggle
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        const icon = soundBtn.querySelector('i');
        if (video.muted) {
          if (icon) {
            icon.classList.remove('fa-volume-high');
            icon.classList.add('fa-volume-xmark');
          }
          if (soundStatus) soundStatus.innerText = 'MUTED';
        } else {
          if (icon) {
            icon.classList.remove('fa-volume-xmark');
            icon.classList.add('fa-volume-high');
          }
          if (soundStatus) soundStatus.innerText = 'AUDIO ON';
        }
      });
    }

    // Play/Pause toggle
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        const icon = playBtn.querySelector('i');
        if (video.paused) {
          video.play();
          if (icon) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
          }
        } else {
          video.pause();
          if (icon) {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
          }
        }
      });
    }

    // Click on video to toggle play/pause
    video.addEventListener('click', () => {
      if (playBtn) playBtn.click();
    });
  });
}

/* Contact Page - Send Inquiry directly to WhatsApp 9820358282 */
function initContactInquiry() {
  const form = document.getElementById('contact-inquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('inquiry-name');
    const phoneInput = document.getElementById('inquiry-phone');
    const subjectInput = document.getElementById('inquiry-subject');
    const messageInput = document.getElementById('inquiry-message');
    const statusDiv = document.getElementById('inquiry-status');

    const name = nameInput ? nameInput.value.trim() : 'Guest';
    const phone = phoneInput ? phoneInput.value.trim() : 'Not provided';
    const subject = subjectInput ? subjectInput.value : 'General Inquiry';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!message) {
      alert('Please enter your message.');
      return;
    }

    // Build WhatsApp message formatted cleanly
    const waText = `Hello Anand / Elara Atelier! 👋\nI have an inquiry from the website:\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Subject:* ${subject}\n*Message:* ${message}\n\nPlease reply at your earliest convenience. Thank you!`;

    const targetPhone = '919820358282';
    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waText)}`;

    // Open WhatsApp in new tab / application
    window.open(waUrl, '_blank');

    // Show visual confirmation on the page
    if (statusDiv) {
      statusDiv.innerHTML = `<i class="fa-brands fa-whatsapp" style="color: #25d366; margin-right: 6px;"></i> Opening WhatsApp to send your inquiry to <strong>9820358282</strong>!`;
      statusDiv.style.display = 'block';
    }

    // Optional: reset form fields
    setTimeout(() => {
      form.reset();
    }, 1500);
  });
}
