// 1. Registro de Plugins (No topo para evitar erros de referência)
gsap.registerPlugin(ScrollTrigger);
lucide.createIcons();

// 2. Smooth Scrolling (Lenis) Otimizado
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
})

// Sincronização Lenis + ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 3. Handlers de Navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            lenis.scrollTo(targetElement, {
                offset: -20,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    });
});

// 4. Animações de Entrada (GSAP)
document.addEventListener("DOMContentLoaded", () => {
    // Forçar aceleração de hardware
    gsap.set(".hero-content > *, #photo-frame, .about-visual, .about-content > *, .project-cards > *", { 
        force3D: true, 
        backfaceVisibility: "hidden" 
    });

    // --- Hero Animations ---
    gsap.from(".hero-content > *", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.1
    });

    gsap.from(".hero-visual", {
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.3
    });

    gsap.from("#photo-frame", {
        scale: 0.95,
        y: 20,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
        delay: 0.5
    });

    // --- About Section ---
    gsap.from(".about-visual", {
        scrollTrigger: {
            trigger: "#sobre",
            start: "top 90%",
            once: true
        },
        x: -30,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    });

    gsap.from(".about-content > *", {
        scrollTrigger: {
            trigger: "#sobre",
            start: "top 90%",
            once: true
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out"
    });

    // --- Projects Section (Fix: Usando seletor direto e trigger robusto) ---
    const cards = document.querySelectorAll('.project-cards > a');
    if (cards.length > 0) {
        gsap.from(cards, {
            scrollTrigger: {
                trigger: ".project-cards",
                start: "top 95%",
                once: true,
            },
            y: 50,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "power2.out",
            clearProps: "all" // Garante que o GSAP não deixe estilos presos após rodar
        });
    }

    // --- Footer ---
    gsap.from("footer .footer-content > *", {
        scrollTrigger: {
            trigger: "footer",
            start: "top 95%",
            once: true
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out"
    });

    // 5. Mouse Interaction
    const mainContainer = document.querySelector('main');
    const tiltCard = document.getElementById('tilt-container');
    const parallaxIcons = document.querySelectorAll('.parallax-el');

    if (mainContainer && tiltCard) {
        mainContainer.addEventListener('mousemove', (e) => {
            const rect = mainContainer.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) / rect.width * 2 - 1;
            const mouseY = (e.clientY - rect.top) / rect.height * 2 - 1;

            gsap.to(tiltCard, {
                rotationY: mouseX * 8,
                rotationX: -mouseY * 8,
                duration: 1.2,
                ease: "power2.out",
                overwrite: "auto"
            });

            parallaxIcons.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed')) * 50; 
                gsap.to(el, {
                    x: -mouseX * speed,
                    y: -mouseY * speed,
                    duration: 1.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });
        });

        mainContainer.addEventListener('mouseleave', () => {
            gsap.to(tiltCard, { rotationY: 0, rotationX: 0, duration: 2, ease: "elastic.out(1, 0.3)" });
            parallaxIcons.forEach(el => gsap.to(el, { x: 0, y: 0, duration: 2, ease: "power2.out" }));
        });
    }

    // Refresh final para Sincronizar tudo
    ScrollTrigger.refresh();
});
