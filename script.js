/**
 * Save the Date - Muhammed Jawhar & Aliya Naseer
 * Royal Golden Particles, Fullscreen Video Autoplay with Sound,
 * Countdown, Calendar, Directions & Sharing Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Always reset scroll to the first section upon page load / refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });

  // Elements
  const video = document.getElementById('weddingVideo');
  const videoSection = document.getElementById('fullscreenVideoSection');
  const smallMuteBtn = document.getElementById('smallMuteBtn');
  const smallMuteIcon = document.getElementById('smallMuteIcon');
  const toast = document.getElementById('toast');
  const entranceOverlay = document.getElementById('entranceOverlay');
  const entranceSealBtn = document.getElementById('entranceSealBtn');
  const coverOpenBtn = document.getElementById('coverOpenBtn');

  // -------------------------------------------------------------------------
  // 0. CREATIVE ROYAL ENTRANCE UNVEIL (Wax Seal Tap & Parting Velvet Gates)
  // -------------------------------------------------------------------------
  let isUnveiled = false;
  const burstParticles = [];

  // Web Audio API Synthesized Royal Crystalline Chime
  function playRoyalChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      // Major harmonic chord progression (E5, G#5, B5, E6)
      const notes = [659.25, 830.61, 987.77, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 1.25);
      });
    } catch (e) {
      // Audio playback silently ignored if blocked by system policy
    }
  }

  function triggerStardustBurst(originX, originY) {
    const burstCount = 75;
    const burstColors = ['#ffffff', '#fff8db', '#fce8a6', '#d4af37', '#e5c158', '#aa771c'];
    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8.5 + 2.5;
      burstParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 1.5,
        gravity: 0.12,
        friction: 0.96,
        radius: Math.random() * 2.8 + 1.2,
        color: burstColors[Math.floor(Math.random() * burstColors.length)],
        alpha: 1,
        decay: Math.random() * 0.016 + 0.01
      });
    }
  }

  function unveilInvitation(clickEvent) {
    if (isUnveiled || !entranceOverlay) return;
    isUnveiled = true;

    // Immediately guarantee scroll is locked at the very top of the page
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Trigger golden stardust burst at interaction point
    let clickX = window.innerWidth / 2;
    let clickY = window.innerHeight / 2;
    if (clickEvent && clickEvent.clientX) {
      clickX = clickEvent.clientX;
      clickY = clickEvent.clientY;
    } else if (entranceSealBtn) {
      const rect = entranceSealBtn.getBoundingClientRect();
      clickX = rect.left + rect.width / 2;
      clickY = rect.top + 52;
    }
    triggerStardustBurst(clickX, clickY);

    // Play royal chime & ensure background music is playing
    playRoyalChime();
    startMusicPlayback();

    // Keep video paused until user clicks Watch Invitation Film or scrolls into it
    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    // Trigger visual gate parting
    entranceOverlay.classList.add('unveiling');
    document.body.classList.add('unveiled-ready');

    setTimeout(() => {
      entranceOverlay.classList.add('unveiled');
      document.body.style.overflow = 'auto';

      // Always bring viewport cleanly to the first section (top hero)
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const heroSec = document.querySelector('.cinematic-hero-section');
      if (heroSec) {
        heroSec.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    }, 1150);
  }

  if (entranceSealBtn) {
    entranceSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      unveilInvitation(e);
    });
  }

  if (coverOpenBtn) {
    coverOpenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      unveilInvitation(e);
    });
  }

  if (entranceOverlay) {
    entranceOverlay.addEventListener('click', (e) => {
      unveilInvitation(e);
    });
  }

  // Also auto-unveil if user scrolls/swipes
  window.addEventListener('wheel', () => {
    if (!isUnveiled) unveilInvitation();
  }, { once: true, passive: true });

  window.addEventListener('touchmove', () => {
    if (!isUnveiled) unveilInvitation();
  }, { once: true, passive: true });

  // -------------------------------------------------------------------------
  // 1. FLOATING GOLDEN STARDUST PARTICLES CANVAS
  // -------------------------------------------------------------------------
  const canvas = document.getElementById('particlesCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particlesCount = Math.min(Math.floor(window.innerWidth / 12), 45);
    const particles = [];
    const colors = ['#fff2c6', '#dfb75c', '#faecd0', '#d4af37'];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 0.4 + 0.15,
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        decay: Math.random() * 0.008 + 0.002
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // 1. Ambient floating particles
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.alpha += p.decay;

        if (p.alpha > 0.85 || p.alpha < 0.15) {
          p.decay = -p.decay;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 2. High-speed golden stardust burst particles
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const bp = burstParticles[i];
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.vy += bp.gravity;
        bp.vx *= bp.friction;
        bp.vy *= bp.friction;
        bp.alpha -= bp.decay;

        if (bp.alpha <= 0) {
          burstParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.radius, 0, Math.PI * 2);
        ctx.fillStyle = bp.color;
        ctx.globalAlpha = Math.max(0, bp.alpha);
        ctx.shadowBlur = 12;
        ctx.shadowColor = bp.color;
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // -------------------------------------------------------------------------
  // 2. BACKGROUND MUSIC & FLOATING MUTE CONTROLS
  // -------------------------------------------------------------------------
  const bgAudio = document.getElementById('bgAudio');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicToggleIcon = document.getElementById('musicToggleIcon');
  let isMusicPlaying = false;

  function updateMusicButtonUI(playing) {
    if (!musicToggleBtn || !musicToggleIcon) return;
    if (playing) {
      musicToggleBtn.classList.add('playing');
      musicToggleBtn.classList.remove('muted');
      musicToggleIcon.className = 'fa-solid fa-volume-high';
      musicToggleBtn.title = 'Sound is playing. Click to mute.';
      musicToggleBtn.setAttribute('aria-label', 'Mute background music');
    } else {
      musicToggleBtn.classList.remove('playing');
      musicToggleBtn.classList.add('muted');
      musicToggleIcon.className = 'fa-solid fa-volume-xmark';
      musicToggleBtn.title = 'Sound is muted. Click to play.';
      musicToggleBtn.setAttribute('aria-label', 'Play background music');
    }
  }

  function startMusicPlayback() {
    if (!bgAudio) return;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isMusicPlaying = true;
          updateMusicButtonUI(true);
        })
        .catch(() => {
          // Autoplay policy prevented playback; will retry on first user interaction
          isMusicPlaying = false;
          updateMusicButtonUI(false);
        });
    }
  }

  // Attempt playback from the very beginning
  startMusicPlayback();

  // Also bind to any early user interaction (tap, scroll, key) to guarantee music starts
  function handleInitialUserGesture() {
    if (bgAudio && bgAudio.paused && !bgAudio.muted) {
      startMusicPlayback();
    }
  }

  ['click', 'touchstart', 'touchend', 'scroll', 'wheel', 'keydown'].forEach((evt) => {
    window.addEventListener(evt, handleInitialUserGesture, { once: true, passive: true });
  });

  // Toggle button click listener
  if (musicToggleBtn && bgAudio) {
    musicToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (bgAudio.paused || bgAudio.muted) {
        bgAudio.muted = false;
        bgAudio.play().then(() => {
          isMusicPlaying = true;
          updateMusicButtonUI(true);
          showToast('Music Playing 🎵');
        }).catch(() => {
          showToast('Audio playback blocked');
        });
      } else {
        bgAudio.pause();
        isMusicPlaying = false;
        updateMusicButtonUI(false);
        showToast('Music Muted 🔇');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 3. COUNTDOWN TIMER (19th December 2026, 11:00 AM IST)
  // -------------------------------------------------------------------------
  const weddingDate = new Date('2026-12-19T11:00:00+05:30').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // -------------------------------------------------------------------------
  // 4. ADD TO CALENDAR (Google Calendar + iCal .ics download)
  // -------------------------------------------------------------------------
  const addToCalBtn = document.getElementById('addToCalBtn');
  const calendarDropdown = document.getElementById('calendarDropdown');
  const googleCalLink = document.getElementById('googleCalLink');
  const appleCalLink = document.getElementById('appleCalLink');

  if (addToCalBtn && calendarDropdown) {
    addToCalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      calendarDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      calendarDropdown.classList.remove('show');
    });
  }

  if (googleCalLink) {
    const gCalUrl = new URL('https://calendar.google.com/calendar/render');
    gCalUrl.searchParams.set('action', 'TEMPLATE');
    gCalUrl.searchParams.set('text', 'Wedding: Muhammed Jawhar C K & Aliya Naseer');
    gCalUrl.searchParams.set('dates', '20261219T053000Z/20261219T100000Z');
    gCalUrl.searchParams.set(
      'details',
      'We cordially invite your esteemed presence with family to celebrate the marriage of Aliya Naseer (D/o Mr. Naseer K P & Mrs. Thahira M K) with Muhammed Jawhar C K (S/o Mr. C H Abdul Rahman & Mrs. Khairunnusa C K).\n\nSchedule (10 Rajab 1448 AH):\n• Sacred Nikah Ceremony: 11:00 AM\n• Wedding Reception & Lunch: 12:00 Noon – 03:30 PM\n\nVenue: CR Auditorium, Kannur Mattannur Road, Eachur, Kerala - 670591\nGoogle Maps: https://maps.app.goo.gl/CRkSaL3tnx6ujpxF8?g_st=ic'
    );
    gCalUrl.searchParams.set('location', 'CR Auditorium, Kannur Mattannur Road, Eachur, Kerala 670591');
    googleCalLink.href = gCalUrl.toString();
  }

  if (appleCalLink) {
    appleCalLink.addEventListener('click', (e) => {
      e.preventDefault();
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Save The Date//Muhammed Jawhar C K & Aliya Naseer//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:wedding-jawhar-aliya-20261219@wedding',
        'DTSTAMP:20261116T000000Z',
        'DTSTART:20261219T053000Z',
        'DTEND:20261219T100000Z',
        'SUMMARY:Wedding of Muhammed Jawhar C K & Aliya Naseer',
        'DESCRIPTION:Sacred Nikah Ceremony at 11:00 AM followed by Wedding Reception & Lunch (12:00 Noon – 03:30 PM).\\nAliya Naseer (D/o Mr. Naseer K P & Mrs. Thahira M K) & Muhammed Jawhar C K (S/o Mr. C H Abdul Rahman & Mrs. Khairunnusa C K).\\nVenue: CR Auditorium\\, Kannur Mattannur Road\\, Eachur\\, Kerala - 670591.\\nMaps: https://maps.app.goo.gl/CRkSaL3tnx6ujpxF8?g_st=ic',
        'LOCATION:CR Auditorium\\, Kannur Mattannur Road\\, Eachur\\, Kerala - 670591',
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Jawhar_and_Aliya_Wedding.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Calendar event downloaded 📅');
    });
  }

  const scrollGuideBtn = document.getElementById('scrollGuideBtn');
  const detailsSection = document.getElementById('detailsSection');
  if (scrollGuideBtn) {
    scrollGuideBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (video && videoSection) {
        video.muted = false;
        const p = video.play();
        if (p !== undefined) {
          p.catch(() => {
            video.muted = true;
            video.play().catch(() => {});
          });
        }
        updateMuteButtonUI();
        videoSection.scrollIntoView({ behavior: 'smooth' });
      } else if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // -------------------------------------------------------------------------
  // 5. SHARING (Web Share API with Clipboard Fallback)
  // -------------------------------------------------------------------------
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Save the Date | Muhammed Jawhar C K & Aliya Naseer',
        text: 'Save the Date! Muhammed Jawhar C K & Aliya Naseer are getting married on Saturday, 19th December 2026 (10 Rajab 1448) at CR Auditorium, Eachur.',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          if (err.name !== 'AbortError') {
            copyToClipboard(window.location.href, 'Invite link copied to clipboard!');
          }
        }
      } else {
        copyToClipboard(window.location.href, 'Invite link copied to clipboard!');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6. COPY ADDRESS
  // -------------------------------------------------------------------------
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = 'CR Auditorium, Kannur Mattannur Road, Eachur, Kerala - 670591';
      copyToClipboard(address, 'Address copied to clipboard!');
    });
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopyText(text, successMsg);
      });
    } else {
      fallbackCopyText(text, successMsg);
    }
  }

  function fallbackCopyText(text, successMsg) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (e) {
      showToast('Could not copy link');
    }
    document.body.removeChild(textArea);
  }

  // -------------------------------------------------------------------------
  // 7. TOAST HELPER
  // -------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
});

// ---------------------------------------------------------------------------
// 8. LIGHTBOX MODAL
// ---------------------------------------------------------------------------
function openLightbox(imgSrc) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightbox && lightboxImg) {
    lightboxImg.src = imgSrc;
    lightbox.classList.add('active');
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}
