// 1. Inicializar Ícones
lucide.createIcons();

// 2. Smooth Scrolling (Lenis) - Calibrado para fluidez máxima
// 2. Smooth Scrolling (Lenis) - Calibrado para fluidez máxima
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false,
})

// Sincronizar Lenis com ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Handler para links internos (Smooth Scroll a ancoras)
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

// 3. Animações de Entrada (GSAP)
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Otimização: Forçar aceleração de hardware nos elementos animados
    gsap.set(".hero-content > *, #photo-frame, .about-visual, .about-content > *, .project-cards > *", { force3D: true, backfaceVisibility: "hidden" });

    // Textos e botões subindo
    gsap.from(".hero-content > *", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.1
    });

    // Imagem e bloco visual
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

    // --- ScrollTrigger: Revealing da Seção Sobre Mim ---
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

    // --- Projetos Section Animations (Ajustado para maior confiabilidade) ---
    gsap.from(".project-cards > a", {
        scrollTrigger: {
            trigger: ".project-cards",
            start: "top 90%",
            once: true,
            // markers: true, // debug (remover no final)
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power2.out"
    });

    // --- Footer Animations ---
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

    // 4. Interações de Mouse (Tilt & Parallax) OTIMIZADAS
    const mainContainer = document.querySelector('main');
    const parallaxIcons = document.querySelectorAll('.parallax-el');
    const tiltCard = document.getElementById('tilt-container');

    if (mainContainer && tiltCard) {
        let mouseX = 0;
        let mouseY = 0;

        mainContainer.addEventListener('mousemove', (e) => {
            const rect = mainContainer.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width * 2 - 1;
            mouseY = (e.clientY - rect.top) / rect.height * 2 - 1;

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

    // Refresh final para garantir que todas as posições estão corretas
    ScrollTrigger.refresh();
});
