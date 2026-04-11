// 1. Inicializar Ícones
lucide.createIcons();

// 2. Smooth Scrolling (Lenis)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    touchMultiplier: 2,
})
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
                offset: -20, // pequeno offset para não colar no topo
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    });
});

// 3. Animações de Entrada (GSAP)
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

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
        filter: "blur(10px)",
        duration: 1.5,
        ease: "power2.out",
        delay: 0.3
    });

    gsap.from("#photo-frame", {
        scale: 0.9,
        y: 20,
        duration: 1.5,
        ease: "expo.out",
        delay: 0.5
    });

    // --- ScrollTrigger: Revealing da Seção Sobre Mim ---
    gsap.from(".about-visual", {
        scrollTrigger: {
            trigger: "#sobre",
            start: "top 75%",
            once: true
        },
        x: -50,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
    });

    gsap.from(".about-content > *", {
        scrollTrigger: {
            trigger: "#sobre",
            start: "top 80%",
            once: true
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out"
    });

    // --- Projetos Section Animations ---
    gsap.from("#projetos > div:not(.absolute)", {
        scrollTrigger: {
            trigger: "#projetos",
            start: "top 80%",
            once: true
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power2.out"
    });

    // --- Footer Animations ---
    gsap.from("footer .footer-content > *", {
        scrollTrigger: {
            trigger: "footer",
            start: "top 80%",
            once: true
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out"
    });

    // 4. Interações de Mouse (Tilt & Parallax)
    const mainContainer = document.querySelector('main');
    const parallaxEls = document.querySelectorAll('.parallax-el');
    const tiltContainer = document.getElementById('tilt-container');

    if (mainContainer && tiltContainer) {
        mainContainer.addEventListener('mousemove', (e) => {
            const rect = mainContainer.getBoundingClientRect();
            const xAxis = (rect.width / 2 - (e.clientX - rect.left));
            const yAxis = (rect.height / 2 - (e.clientY - rect.top));

            // Efeito Parallax nos Badges
            parallaxEls.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed'));
                gsap.to(el, {
                    x: xAxis * speed,
                    y: yAxis * speed,
                    duration: 1,
                    ease: "power2.out"
                });
            });

            // Tilt sutil na imagem principal
            gsap.to(tiltContainer, {
                rotationY: (xAxis / rect.width) * 10,
                rotationX: -(yAxis / rect.height) * 10,
                duration: 1.5,
                ease: "power2.out",
                transformPerspective: 1000
            });
        });

        // Resetar posição quando o mouse sai
        mainContainer.addEventListener('mouseleave', () => {
            parallaxEls.forEach(el => {
                gsap.to(el, { x: 0, y: 0, duration: 1.5, ease: "power2.out" });
            });
            gsap.to(tiltContainer, {
                rotationY: 0,
                rotationX: 0,
                duration: 1.5,
                ease: "power2.out"
            });
        });
    }
});
