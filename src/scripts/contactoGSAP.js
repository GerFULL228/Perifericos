
  document.addEventListener("DOMContentLoaded", async () => {
    // Carga GSAP solo en el cliente
    const gsap = (await import('gsap')).default;
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    console.log("GSAP version:", gsap.version); // Verifica en consola que se cargó

    // Animación de prueba simple
    gsap.from(".hero-title", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out"
    });

    // Crear partículas de fondo
    createParticles();

    // Timeline principal
    const mainTl = gsap.timeline();

    // Animaciones de entrada del hero
    mainTl
      .from(".hero-title", {
        opacity: 0,
        y: 100,
        duration: 1.1,
        ease: "back.out(1.7)"
      })
      .from(".hero-line", {
        scaleX: 0.6,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.5")
      .from(".hero-subtitle", {
        opacity: 0,
        y: 50,
        duration: 2,
        ease: "power2.inOut"
      }, "-=0.3")
      .from(".scroll-indicator", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.2");

    // Elementos flotantes
    gsap.to(".floating-element", {
      y: -20,
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.5
    });

    // Animaciones con ScrollTrigger
    gsap.from(".contact-info-panel", {
      scrollTrigger: {
        trigger: ".contact-info-panel",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      },
      x: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    gsap.from(".contact-form-panel", {
      scrollTrigger: {
        trigger: ".contact-form-panel",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      },
      x: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    // Animación de elementos de contacto
    gsap.from(".contact-item", {
      scrollTrigger: {
        trigger: ".contact-items",
        start: "top 70%",
        end: "bottom 30%",
        toggleActions: "play none none reverse"
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "back.out(1.7)"
    });

    // Animación de formulario
    gsap.from(".form-group", {
      scrollTrigger: {
        trigger: ".contact-form",
        start: "top 70%",
        end: "bottom 30%",
        toggleActions: "play none none reverse"
      },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out"
    });

    // Animación de redes sociales
    gsap.from(".social-section", {
      scrollTrigger: {
        trigger: ".social-section",
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });

    // Efectos de hover mejorados
    document.querySelectorAll(".contact-item").forEach(item => {
      const icon = item.querySelector(".icon-container");
      const tl = gsap.timeline({ paused: true });

      tl.to(icon, {
        scale: 1.3,
        rotation: 5,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(item.querySelector(".shine-effect"), {
        opacity: 1,
        duration: 0.3
      }, 0);

      item.addEventListener("mouseenter", () => tl.play());
      item.addEventListener("mouseleave", () => tl.reverse());
    });

    // Efectos de hover para iconos sociales
    document.querySelectorAll(".social-icon").forEach(icon => {
      const tl = gsap.timeline({ paused: true });

      tl.to(icon, {
        scale: 1.1,
        y: -10,
        duration: 0.3,
        ease: "back.out(1.7)"
      });

      icon.addEventListener("mouseenter", () => tl.play());
      icon.addEventListener("mouseleave", () => tl.reverse());
    });

    // Efectos de brillo para paneles
    document.querySelectorAll(".shine-effect").forEach(shine => {
      gsap.to(shine, {
        opacity: 1,
        duration: 2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 2
      });
    });

    // Animación de focus para inputs
    document.querySelectorAll(".form-input").forEach(input => {
      input.addEventListener("focus", () => {
        gsap.to(input, {
          scale: 1.06,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      input.addEventListener("blur", () => {
        gsap.to(input, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    // Mapa modal
    const mapButton = document.getElementById("map-button");
    const mapModal = document.getElementById("map-modal");
    const closeMap = document.getElementById("close-map");
    const mapContainer = document.querySelector(".map-container");

    if (mapButton && mapModal && closeMap) {
      mapButton.addEventListener("click", () => {
        const tl = gsap.timeline();
        tl.to(mapModal, {
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.3,
          ease: "power2.out"
        })
        .from(mapContainer, {
          scale: 0.8,
          y: 50,
          duration: 0.5,
          ease: "back.out(1.7)"
        }, "-=0.1");
      });

      closeMap.addEventListener("click", () => {
        const tl = gsap.timeline();
        tl.to(mapContainer, {
          scale: 0.8,
          y: 50,
          duration: 0.3,
          ease: "power2.in"
        })
        .to(mapModal, {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.3,
          ease: "power2.out"
        }, "-=0.1");
      });

      // Cerrar con ESC
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mapModal.style.pointerEvents !== "none") {
          closeMap.click();
        }
      });
    }

    // Animación del botón de envío
    const submitBtn = document.querySelector(".submit-btn");
    if (submitBtn) {
      submitBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Simulación de envío
        const originalText = submitBtn.innerHTML;

        gsap.to(submitBtn, {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.out",
          onComplete: () => {
            submitBtn.innerHTML = `
              <span class="relative z-10 flex items-center justify-center">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Enviando...
              </span>
            `;

            // Simular envío exitoso después de 2 segundos
            setTimeout(() => {
              submitBtn.innerHTML = `
                <span class="relative z-10 flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  ¡Mensaje enviado!
                </span>
              `;

              gsap.to(submitBtn, {
                backgroundColor: "#10b981",
                duration: 0.3,
                onComplete: () => {
                  // Restaurar después de 3 segundos
                  setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    gsap.to(submitBtn, {
                      backgroundColor: "",
                      scale: 1,
                      duration: 0.3
                    });
                  }, 3000);
                }
              });
            }, 2000);
          }
        });
      });
    }

    // Parallax suave para elementos de fondo
    gsap.to(".absolute.top-20", {
      y: -50,
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    gsap.to(".absolute.bottom-20", {
      y: 50,
      scrollTrigger: {
        trigger: "body",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });

    // Smooth scroll para indicador
    document.querySelector(".scroll-indicator")?.addEventListener("click", () => {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: ".contact-info-panel",
        ease: "power2.inOut"
      });
    });

    // Efectos de cursor personalizado
    document.addEventListener("mousemove", (e) => {
      const cursor = document.querySelector(".custom-cursor");
      if (!cursor) {
        const newCursor = document.createElement("div");
        newCursor.className = "custom-cursor";
        newCursor.style.cssText = `
          position: fixed;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: screen;
          transition: transform 0.1s ease;
        `;
        document.body.appendChild(newCursor);
      }

      gsap.to(".custom-cursor", {
        x: e.clientX - 10,
        y: e.clientY - 10,
        duration: 0.1,
        ease: "power2.out"
      });
    });

    // Efectos de hover para elementos interactivos
    document.querySelectorAll("a, button, input, textarea, select").forEach(el => {
      el.addEventListener("mouseenter", () => {
        gsap.to(".custom-cursor", {
          scale: 1.5,
          duration: 0.2,
          ease: "power2.out"
        });
      });

      el.addEventListener("mouseleave", () => {
        gsap.to(".custom-cursor", {
          scale: 1,
          duration: 0.2,
          ease: "power2.out"
        });
      });
    });

    // Función para crear partículas
    function createParticles() {
      const particlesContainer = document.getElementById("particles-bg");
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.cssText = `
          position: absolute;
          width: ${Math.random() * 4 + 1}px;
          height: ${Math.random() * 4 + 1}px;
          background: ${Math.random() > 0.5 ? '#8b5cf6' : '#3b82f6','#800080'};
          border-radius: 50%;
          opacity: ${Math.random() * 0.5 + 0.1};
          left: ${Math.random() * 1000}%;
          top: ${Math.random() * 100}%;
          pointer-events: none;
        `;

      

        // Animación de partículas
        gsap.to(particle, {
          y: Math.random() * 100 - 50,
          x: Math.random() * 100 - 50,
          duration: Math.random() * 10 + 5,
          ease: "none",
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 2
        });

        gsap.to(particle, {
          opacity: Math.random() * 0.8 + 0.2,
          duration: Math.random() * 3 + 1,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 2
        });
      }
    }
  });
