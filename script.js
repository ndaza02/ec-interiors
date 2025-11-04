// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Randomize hero video (Option A) and freeze at end
function initHeroVideoRandomizer() {
    const videoEl = document.querySelector('.hero-video');
    if (!videoEl) return;

    // Respect reduced motion: show poster only
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        videoEl.pause();
        videoEl.removeAttribute('autoplay');
        return;
    }

    // Available videos (add/remove as needed)
    const videos = [
        { mp4: 'assets/video/envato_video_gen_Nov_04_2025_11_40_49.mp4' },
        { mp4: 'assets/video/modern-living-room-with-yellow-armchairs-and-cloud-2025-10-16-08-12-42-utc.mp4' },
        { mp4: 'assets/video/spacious-empty-room-with-natural-light-2025-10-16-07-46-16-utc.mp4' },
        { mp4: 'assets/video/modern-minimalist-bedroom-design-2025-10-17-00-05-17-utc.mp4' },
        { mp4: 'assets/video/modern-interior-design-furniture-assembly-takes-a-2025-10-17-00-47-00-utc.mp4' },
        { mp4: 'assets/video/hero.mp4' },
        // MOV as a fallback entry if supported by the browser
        { mp4: 'assets/video/3d-loop-satisfying-furniture-animation-2025-10-17-00-19-09-utc.mov' },
    ];

    const pick = videos[Math.floor(Math.random() * videos.length)];

    // Remove existing <source> children and set new source
    while (videoEl.firstChild) videoEl.removeChild(videoEl.firstChild);
    const source = document.createElement('source');
    source.src = pick.mp4;
    source.type = 'video/mp4';
    videoEl.appendChild(source);

    if (pick.poster) videoEl.setAttribute('poster', pick.poster);

    // Ensure we don't loop so it freezes on last frame
    videoEl.removeAttribute('loop');
    // Defer autoplay until loader is gone
    videoEl.removeAttribute('autoplay');
    videoEl.autoplay = false;
    videoEl.pause();
    videoEl.load();

    // Play only after the loading screen fades away
    const playWhenReady = () => {
        const tryPlay = () => {
            const playPromise = videoEl.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.catch(() => {/* ignore autoplay block errors */});
            }
        };
        if (videoEl.readyState >= 2) {
            tryPlay();
        } else {
            videoEl.addEventListener('canplay', tryPlay, { once: true });
        }
    };

    // Custom event from loader.js once it fully fades out
    window.addEventListener('loader-finished', playWhenReady, { once: true });
    // Safety fallback in case loader is disabled or removed early
    setTimeout(playWhenReady, 12000);
}

document.addEventListener('DOMContentLoaded', initHeroVideoRandomizer);

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Mobile dropdown toggle
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
        if (window.innerWidth <= 968) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hero Section Animation
gsap.from('.hero-content', {
    opacity: 0,
    y: 80,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.3
});

// Hero title animation - word by word
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const words = heroTitle.textContent.split(' ');
    heroTitle.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
    
    gsap.from('.hero-title .word', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.5
    });
}

// Hero subtitle animation
gsap.from('.hero-subtitle', {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: 'power3.out',
    delay: 1.2
});

// Hero button animation
gsap.from('.hero .cta-button', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power3.out',
    delay: 1.5
});

// About Section Animation
gsap.from('.about-content', {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out'
});

// Product Cards Animation
const productCards = document.querySelectorAll('.product-card');

productCards.forEach((card, index) => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: index * 0.1
    });

    // Animate product image on hover
    const productImage = card.querySelector('.product-image');
    const imagePlaceholder = card.querySelector('.image-placeholder');
    
    card.addEventListener('mouseenter', () => {
        gsap.to(imagePlaceholder, {
            scale: 1.05,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(imagePlaceholder, {
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
});

// Product Info Parallax Effect
productCards.forEach(card => {
    const productInfo = card.querySelector('.product-info');
    const productImage = card.querySelector('.product-image');
    
    gsap.to(productInfo, {
        scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: -30,
        ease: 'none'
    });
    
    gsap.to(productImage, {
        scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: 30,
        ease: 'none'
    });
});

// Contact Section Animation
gsap.from('.contact-info', {
    scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    opacity: 0,
    x: -50,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.contact-form', {
    scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    opacity: 0,
    x: 50,
    duration: 1,
    ease: 'power3.out'
});

// Form inputs animation
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
formInputs.forEach((input, index) => {
    gsap.from(input, {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.1 * index,
        ease: 'power2.out'
    });
});

// Footer Animation
gsap.from('.footer-section', {
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
});

// Button Hover Effects
const buttons = document.querySelectorAll('.cta-button, .link-button, .secondary-button');

buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Animate button
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        gsap.to(submitButton, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                submitButton.textContent = 'Message Sent!';
                submitButton.style.background = '#4CAF50';
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.style.background = '';
                    contactForm.reset();
                }, 3000);
            }
        });
    });
}

// Note: No parallax on hero video to preserve natural aspect and avoid layout shifts

// Section titles animation
const sectionTitles = document.querySelectorAll('.section-title');
sectionTitles.forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
    });
});

// Image reveal animation
const imageReveal = () => {
    const images = document.querySelectorAll('.image-placeholder');
    
    images.forEach(image => {
        gsap.from(image, {
            scrollTrigger: {
                trigger: image,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            clipPath: 'inset(0 100% 0 0)',
            duration: 1.2,
            ease: 'power3.out'
        });
    });
};

// Call image reveal after a short delay
setTimeout(imageReveal, 500);

// Cursor effect (optional - creates a custom cursor trail)
const createCursorEffect = () => {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    const animateCursor = () => {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    };
    
    animateCursor();
};

// Uncomment to enable custom cursor
// createCursorEffect();

// Loading animation
window.addEventListener('load', () => {
    gsap.to('body', {
        opacity: 1,
        duration: 0.5
    });
});

// Add initial opacity to body
document.body.style.opacity = 0;

// Refresh ScrollTrigger on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

console.log('Interio - Interior Design Website Loaded Successfully! 🎨');
