// Design Philosophies Array
const philosophies = [
    "Design is less about what you see and more about how you feel.",
    "Every space should reflect the story of the people who live in it.",
    "Beauty and function must walk hand in hand.",
    "We believe a home should be a sanctuary, not just a show-piece.",
    "Clean lines. Warm materials. Calm mind.",
    "Timeless design over trendy décor.",
    "Good design honours context, culture and character.",
    "Materials matter: we choose things you'll love for years, not seasons.",
    "Light, texture and space: the three pillars of living beautifully.",
    "Minimal clutter, maximum comfort.",
    "Form follows function — and function invites emotion.",
    "Your space should breathe — not overwhelming you, but embracing you.",
    "Luxury is not about excess; it's about intentionality.",
    "Design that supports how you live — not how you think you should live.",
    "Neutral doesn't mean boring; it means open to possibility.",
    "We elevate the quiet moments in interiors — the pause, the reflection, the comfort.",
    "Design with purpose, not just aesthetics.",
    "A thoughtful space invites connection, creativity and calm.",
    "Honest materials. Honest design.",
    "Spaces should age gracefully, not seem dated next year.",
    "Your home should tell you the story you will love to live in.",
    "We design not for the house, but for how the house makes you feel.",
    "Every object, colour and texture should work for you—not against you.",
    "Style evolves; principles endure.",
    "Modern comfort rooted in timeless elements.",
    "We believe in spaces that are lived in, not just looked at.",
    "A home that looks good, and feels good, and works.",
    "Design is the silent partner in your daily life.",
    "Simplicity brings clarity. Clarity brings calm.",
    "We craft spaces that invite you to stay, relax, and be yourself.",
    "Quality is the foundation of lasting design.",
    "We design with respect for the environment, the materials, the people.",
    "Functionality without sacrifice of elegance.",
    "Let your interiors echo your values.",
    "Bold accents with a soft base – contrast done right.",
    "Design isn't just what we do; it's how we live.",
    "Balance, proportion, rhythm: the music of design.",
    "We frame your life with spaces that are calm, coherent, and connected.",
    "Design for tomorrow, but live in the today.",
    "Every surface, colour and detail has a role to play.",
    "We believe in the power of well-designed everyday spaces.",
    "Your environment shapes you — let's shape it thoughtfully.",
    "Authenticity in materials, honesty in design.",
    "Spaces that invite life, not freeze it.",
    "The difference between a house and a home is design with heart.",
    "We design rooms, but we create moments.",
    "Let your space work as hard as you do—to support you.",
    "Design that makes you pause, smile, and feel at ease.",
    "Luxury isn't loud; it's subtle, smart and soulful.",
    "Our promise: design you'll return to, day after day."
];

// Get random philosophy
function getRandomPhilosophy() {
    const randomIndex = Math.floor(Math.random() * philosophies.length);
    return philosophies[randomIndex];
}

// Initialize loader
function initLoader() {
    // Create loader HTML
    const loaderHTML = `
        <div class="loader-wrapper" id="loader">
            <div class="loader-decoration">
                <div class="decoration-line"></div>
                <div class="decoration-line"></div>
                <div class="decoration-circle"></div>
                <div class="decoration-circle"></div>
            </div>
            <div class="loader-content">
                <div class="loader-logo">EC INTERIORS</div>
                <div class="philosophy-text" id="philosophyText">
                    ""<span class="cursor">|</span>
                </div>
                <div class="loader-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <div class="loader-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="loader-subtitle">Loading Experience</div>
                </div>
            </div>
        </div>
    `;

    // Insert loader at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);
    
    // Note: Loader will be removed automatically after typewriter animation completes
}

// Show loader on page navigation (for SPAs or page reloads)
function showLoaderOnNavigation() {
    // Show loader when clicking internal links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.href.startsWith(window.location.origin)) {
            // Don't show loader for anchor links on same page
            if (link.getAttribute('href').startsWith('#')) {
                return;
            }
            
            // Show loader for actual page navigation
            const loaderExists = document.getElementById('loader');
            if (!loaderExists) {
                initLoader();
            }
        }
    });

    // Show loader on browser back/forward
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            // Page was loaded from cache
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.remove('fade-out');
            }
        }
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initLoader();
        showLoaderOnNavigation();
    });
} else {
    initLoader();
    showLoaderOnNavigation();
}

// Typewriter effect for philosophy text
let currentPhilosophy = '';
let currentIndex = 0;
let isTyping = true;
let typewriterTimeout;
let cycleComplete = false;

function typeWriter() {
    const philosophyElement = document.getElementById('philosophyText');
    if (!philosophyElement) return;

    const cursor = '<span class="cursor">|</span>';

    if (isTyping) {
        // Typing forward
        if (currentIndex < currentPhilosophy.length) {
            philosophyElement.innerHTML = '"' + currentPhilosophy.substring(0, currentIndex + 1) + '"' + cursor;
            currentIndex++;
            typewriterTimeout = setTimeout(typeWriter, 50); // Typing speed
        } else {
            // Finished typing, wait before backspacing
            isTyping = false;
            typewriterTimeout = setTimeout(typeWriter, 3000); // Wait 3 seconds before backspacing
        }
    } else {
        // Backspacing
        if (currentIndex > 0) {
            currentIndex--;
            philosophyElement.innerHTML = '"' + currentPhilosophy.substring(0, currentIndex) + '"' + cursor;
            typewriterTimeout = setTimeout(typeWriter, 30); // Backspace speed (faster)
        } else {
            // Finished backspacing - mark cycle as complete
            cycleComplete = true;
            philosophyElement.innerHTML = '""' + cursor;
            
            // Trigger loader fade out after cycle completes
            setTimeout(() => {
                const loader = document.getElementById('loader');
                if (loader) {
                    loader.classList.add('fade-out');
                    // Notify app that loader finished (videos can start)
                    window.dispatchEvent(new Event('loader-finished'));
                    setTimeout(() => {
                        loader.remove();
                    }, 800);
                }
            }, 500);
        }
    }
}

// Start typewriter effect
function startTypewriter() {
    const philosophyElement = document.getElementById('philosophyText');
    if (philosophyElement) {
        // Get first (and only) philosophy
        currentPhilosophy = getRandomPhilosophy();
        currentIndex = 0;
        isTyping = true;
        cycleComplete = false;
        // Start typing after a short delay
        setTimeout(typeWriter, 800);
    }
}

// Initialize typewriter when loader is ready
setTimeout(startTypewriter, 1000);
