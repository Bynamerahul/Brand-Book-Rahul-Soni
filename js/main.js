document.addEventListener('DOMContentLoaded', () => {
    // 1. GLOBAL CUSTOM INTERACTIVE CURSOR & AURA FOLLOWER
    const cursor = document.getElementById('global-custom-cursor');
    const aura = document.getElementById('global-cursor-aura');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let auraX = mouseX;
    let auraY = mouseY;

    if (cursor && aura) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        function animateAura() {
            auraX += (mouseX - auraX) * 0.15;
            auraY += (mouseY - auraY) * 0.15;
            aura.style.left = `${auraX}px`;
            aura.style.top = `${auraY}px`;
            requestAnimationFrame(animateAura);
        }
        animateAura();

        const interactiveSelectors = 'a, button, .eco-card, .p12-box, .p13-card, .p14-card, .p15-col, .profile-card, .mindset-card, .leadership-card, .strength-category, .skill-tag, .hero-feature-card, .value-statement';
        
        document.querySelectorAll(interactiveSelectors).forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering-interactive'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering-interactive'));
        });
    }

    // 2. UNIVERSAL CARD 3D TILT EFFECT ACROSS ALL PAGES
    const tiltableCards = document.querySelectorAll('.eco-card, .p12-box, .p13-card, .p14-card, .p15-col, .profile-card, .mindset-card, .leadership-card, .strength-category, .hero-feature-card');

    tiltableCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = (y / rect.height) * -8;
            const rotateY = (x / rect.width) * 8;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });

    // 3. BUTTER-SMOOTH SCROLL REVEAL OBSERVER ACROSS ALL PAGES
    const observerOptions = {
        root: document.querySelector('.brand-book-container'),
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // HELPER: CANVAS INIT FACTORY
    function initCanvasEngine(pageId, canvasId, drawFn) {
        const pageEl = document.getElementById(pageId);
        const canvas = document.getElementById(canvasId);
        if (!pageEl || !canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = pageEl.clientWidth;
        let height = canvas.height = pageEl.clientHeight;

        let localMouse = { x: width / 2, y: height / 2, active: false };

        pageEl.addEventListener('mousemove', (e) => {
            const rect = pageEl.getBoundingClientRect();
            localMouse.x = e.clientX - rect.left;
            localMouse.y = e.clientY - rect.top;
            localMouse.active = true;
        });

        pageEl.addEventListener('mouseleave', () => {
            localMouse.active = false;
        });

        window.addEventListener('resize', () => {
            width = canvas.width = pageEl.clientWidth;
            height = canvas.height = pageEl.clientHeight;
        });

        drawFn(ctx, width, height, localMouse);
    }

    // =========================================================================
    // 15 UNIQUE INTERACTIVE CURSOR-REACTIVE CANVAS ANIMATIONS
    // =========================================================================

    // PAGE 1: Emerald Cosmic Speed Beams & Star Warp
    initCanvasEngine('page-1', 'cover-hero-canvas', (ctx, getWidth, getHeight, mouse) => {
        const particles = Array.from({ length: 45 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vy: -Math.random() * 0.8 - 0.2,
            vx: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 2 + 1,
            alpha: Math.random() * 0.4 + 0.1
        }));

        function loop() {
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            ctx.clearRect(0, 0, w, h);

            for (let p of particles) {
                p.y += p.vy;
                p.x += p.vx;
                if (p.y < 0) p.y = h;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;

                let drawX = p.x;
                let drawY = p.y;

                if (mouse.active) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p.x - dx * 0.15, p.y - dy * 0.15);
                        ctx.strokeStyle = `rgba(0, 176, 122, ${0.4 * (1 - dist / 200)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                ctx.beginPath();
                ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 176, 122, ${p.alpha})`;
                ctx.fill();
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    // PAGE 2: Elastic Geometric Mesh Nodes
    initCanvasEngine('page-2', 'canvas-page-2', (ctx, getWidth, getHeight, mouse) => {
        const nodes = Array.from({ length: 30 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            baseX: 0,
            baseY: 0,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 3 + 2
        }));

        function loop() {
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;

                if (mouse.active) {
                    const dx = mouse.x - n.x;
                    const dy = mouse.y - n.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 180) {
                        n.x += dx * 0.03;
                        n.y += dy * 0.03;
                    }
                }

                ctx.beginPath();
                ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 85, 255, 0.4)';
                ctx.fill();

                for (let j = i + 1; j < nodes.length; j++) {
                    const n2 = nodes[j];
                    const dx = n.x - n2.x;
                    const dy = n.y - n2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.strokeStyle = `rgba(0, 176, 122, ${0.25 * (1 - dist / 130)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    // PAGE 3: Pulsing Laser Circuit Tracks
    initCanvasEngine('page-3', 'canvas-page-3', (ctx, getWidth, getHeight, mouse) => {
        const pulses = Array.from({ length: 18 }, () => ({
            y: Math.random() * window.innerHeight,
            x: Math.random() * window.innerWidth,
            speed: Math.random() * 3 + 1,
            length: Math.random() * 60 + 30
        }));

        function loop() {
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            ctx.clearRect(0, 0, w, h);

            for (let p of pulses) {
                let speedMult = 1;
                if (mouse.active) {
                    const dy = Math.abs(mouse.y - p.y);
                    if (dy < 60) speedMult = 2.5;
                }

                p.x += p.speed * speedMult;
                if (p.x > w + p.length) p.x = -p.length;

                const grad = ctx.createLinearGradient(p.x - p.length, p.y, p.x, p.y);
                grad.addColorStop(0, 'rgba(0, 176, 122, 0)');
                grad.addColorStop(1, 'rgba(0, 176, 122, 0.7)');

                ctx.beginPath();
                ctx.moveTo(p.x - p.length, p.y);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    // PAGE 4: 3D Kinetic Geometry Concentric Rings
    initCanvasEngine('page-4', 'canvas-page-4', (ctx, getWidth, getHeight, mouse) => {
        let angle = 0;
        function loop() {
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            ctx.clearRect(0, 0, w, h);

            angle += 0.008;
            const centerX = w / 2 + (mouse.active ? (mouse.x - w / 2) * 0.05 : 0);
            const centerY = h / 2 + (mouse.active ? (mouse.y - h / 2) * 0.05 : 0);

            for (let r = 50; r <= 220; r += 35) {
                ctx.beginPath();
                ctx.ellipse(centerX, centerY, r, r * 0.5, angle * (r / 50), 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0, 85, 255, ${0.18 + (r / 220) * 0.15})`;
                ctx.lineWidth = 1.2;
                ctx.stroke();
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    // PAGE 5: Dual Plasma Sine Wave Field
    initCanvasEngine('page-5', 'canvas-page-5', (ctx, getWidth, getHeight, mouse) => {
        let step = 0;
        function loop() {
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            ctx.clearRect(0, 0, w, h);

            step += 0.02;
            const mouseOffsetY = mouse.active ? (mouse.y - h / 2) * 0.2 : 0;

            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                for (let x = 0; x <= w; x += 10) {
                    const y = h / 2 + Math.sin(x * 0.008 + step + i) * (40 + i * 15) + mouseOffsetY;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.strokeStyle = i % 2 === 0 ? 'rgba(0, 176, 122, 0.25)' : 'rgba(0, 85, 255, 0.25)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    // PAGE 6: Interactive Hexagonal Honeycomb Ripple Grid
    initCanvasEngine('page-6', 'canvas-page-6', (ctx, getWidth, getHeight, mouse) => {
        const hexRadius = 35;
        function drawHex(x, y, radius, alpha) {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const a = (Math.PI / 3) * i;
                const hx = x + radius * Math.cos(a);
                const hy = y + radius * Math.sin(a);
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.strokeStyle = `rgba(0, 176, 122, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        function loop() {
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            ctx.clearRect(0, 0, w, h);

            const dx = hexRadius * 1.732;
            const dy = hexRadius * 1.5;

            for (let y = 0; y < h + hexRadius; y += dy) {
                for (let x = 0; x < w + hexRadius; x += dx) {
                    const shiftX = (Math.floor(y / dy) % 2) * (dx / 2);
                    const posX = x + shiftX;
                    let alpha = 0.06;

                    if (mouse.active) {
                        const dist = Math.sqrt((mouse.x - posX) ** 2 + (mouse.y - y) ** 2);
                        if (dist < 180) {
                            alpha = 0.45 * (1 - dist / 180);
                        }
                    }
                    drawHex(posX, y, hexRadius, alpha);
                }
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    // PAGE 7: Holographic 3D Data Point Undulating Matrix Wave
    initCanvasEngine('page-7', 'canvas-page-7', (ctx, getWidth, getHeight, mouse) => {
        let time = 0;
        function loop() {
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            ctx.clearRect(0, 0, w, h);

            time += 0.03;
            const cols = 22;
            const rows = 14;

            for (let c = 0; c < cols; c++) {
                for (let r = 0; r < rows; r++) {
                    const px = (w / cols) * (c + 0.5);
                    const py = (h / rows) * (r + 0.5);
                    const wave = Math.sin(c * 0.3 + time) * Math.cos(r * 0.3 + time) * 12;

                    let radius = 2;
                    let alpha = 0.2;

                    if (mouse.active) {
                        const dist = Math.sqrt((mouse.x - px) ** 2 + (mouse.y - py) ** 2);
                        if (dist < 150) {
                            radius = 4 * (1 - dist / 150) + 2;
                            alpha = 0.6 * (1 - dist / 150) + 0.2;
                        }
                    }

                    ctx.beginPath();
                    ctx.arc(px, py + wave, radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 85, 255, ${alpha})`;
                    ctx.fill();
                }
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    // PAGE 8: Constellation Star Magnetic Orb
    initCanvasEngine('page-8', 'canvas-page-8', (ctx, getWidth, getHeight, mouse) => {
        const stars = Array.from({ length: 35 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6
        }));

        function loop() {
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            ctx.clearRect(0, 0, w, h);

            for (let s of stars) {
                s.x += s.vx;
                s.y += s.vy;
                if (s.x < 0 || s.x > w) s.vx *= -1;
                if (s.y < 0 || s.y > h) s.vy *= -1;

                ctx.beginPath();
                ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 107, 53, 0.5)';
                ctx.fill();

                if (mouse.active) {
                    const dist = Math.sqrt((mouse.x - s.x) ** 2 + (mouse.y - s.y) ** 2);
                    if (dist < 180) {
                        ctx.beginPath();
                        ctx.moveTo(s.x, s.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(255, 107, 53, ${0.4 * (1 - dist / 180)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    // PAGE 9: Electric Lightning Energy Tendrils
    initCanvasEngine('page-9', 'canvas-page-9', (ctx, getWidth, getHeight, mouse) => {
        function drawLightning(x1, y1, x2, y2) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            let cx = x1;
            let cy = y1;
            const steps = 6;
            for (let i = 1; i <= steps; i++) {
                const targetX = x1 + (x2 - x1) * (i / steps);
                const targetY = y1 + (y2 - y1) * (i / steps);
                cx = targetX + (Math.random() - 0.5) * 20;
                cy = targetY + (Math.random() - 0.5) * 20;
                ctx.lineTo(cx, cy);
            }
            ctx.strokeStyle = 'rgba(0, 176, 122, 0.35)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }

        function loop() {
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            ctx.clearRect(0, 0, w, h);

            if (mouse.active && Math.random() < 0.25) {
                const corners = [
                    { x: 0, y: 0 },
                    { x: w, y: 0 },
                    { x: 0, y: h },
                    { x: w, y: h }
                ];
                const corner = corners[Math.floor(Math.random() * corners.length)];
                drawLightning(corner.x, corner.y, mouse.x, mouse.y);
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    // PAGE 10: Spotlight & Particle Net (Existing)
    const page10 = document.getElementById('page-10');
    const spotlight = document.getElementById('spotlight-page10');
    const canvas10 = document.getElementById('cursor-canvas-page10');

    if (page10 && canvas10 && spotlight) {
        const ctx10 = canvas10.getContext('2d');
        let width = canvas10.width = page10.clientWidth;
        let height = canvas10.height = page10.clientHeight;

        window.addEventListener('resize', () => {
            width = canvas10.width = page10.clientWidth;
            height = canvas10.height = page10.clientHeight;
            initParticles();
        });

        let mouse10 = { x: width / 2, y: height / 2, active: false };

        page10.addEventListener('mousemove', (e) => {
            const rect = page10.getBoundingClientRect();
            mouse10.x = e.clientX - rect.left;
            mouse10.y = e.clientY - rect.top;
            mouse10.active = true;

            spotlight.style.left = `${mouse10.x}px`;
            spotlight.style.top = `${mouse10.y}px`;
        });

        page10.addEventListener('mouseleave', () => { mouse10.active = false; });

        let particles = [];
        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.2;
                this.vy = (Math.random() - 0.5) * 1.2;
                this.radius = Math.random() * 2 + 1;
                this.alpha = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                if (mouse10.active) {
                    const dx = mouse10.x - this.x;
                    const dy = mouse10.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 180) {
                        this.x += dx * 0.02;
                        this.y += dy * 0.02;
                    }
                }
            }
            draw() {
                ctx10.beginPath();
                ctx10.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx10.fillStyle = `rgba(0, 176, 122, ${this.alpha})`;
                ctx10.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < 45; i++) particles.push(new Particle());
        }
        initParticles();

        function animate() {
            ctx10.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx10.beginPath();
                        ctx10.moveTo(particles[i].x, particles[i].y);
                        ctx10.lineTo(particles[j].x, particles[j].y);
                        ctx10.strokeStyle = `rgba(0, 85, 255, ${0.25 * (1 - dist / 120)})`;
                        ctx10.lineWidth = 0.8;
                        ctx10.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    // PAGE 11: Financial Data Equalizer Wave Bars
    initCanvasEngine('page-11', 'canvas-page-11', (ctx, getWidth, getHeight, mouse) => {
        let step = 0;
        function loop() {
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            ctx.clearRect(0, 0, w, h);

            step += 0.05;
            const barCount = 36;
            const barWidth = w / barCount;

            for (let i = 0; i < barCount; i++) {
                const x = i * barWidth;
                let hVal = (Math.sin(i * 0.4 + step) * 0.5 + 0.5) * 60 + 20;

                if (mouse.active) {
                    const dist = Math.abs(mouse.x - x);
                    if (dist < 140) {
                        hVal += (1 - dist / 140) * 80;
                    }
                }

                ctx.fillStyle = 'rgba(0, 176, 122, 0.2)';
                ctx.fillRect(x + 2, h - hVal, barWidth - 4, hVal);
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    // PAGE 12: Global Supply Chain Satellite Arcs
    initCanvasEngine('page-12', 'canvas-page-12', (ctx, getWidth, getHeight, mouse) => {
        const sats = Array.from({ length: 12 }, () => ({
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * 120 + 80,
            speed: Math.random() * 0.02 + 0.005
        }));

        function loop() {
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            ctx.clearRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h / 2;

            for (let s of sats) {
                s.angle += s.speed;
                const sx = cx + Math.cos(s.angle) * s.radius;
                const sy = cy + Math.sin(s.angle) * (s.radius * 0.5);

                ctx.beginPath();
                ctx.arc(sx, sy, 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 85, 255, 0.6)';
                ctx.fill();

                if (mouse.active) {
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = 'rgba(0, 85, 255, 0.15)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    // PAGE 13: AI Neural Synapse Impulse Firing
    initCanvasEngine('page-13', 'canvas-page-13', (ctx, getWidth, getHeight, mouse) => {
        const synapses = Array.from({ length: 25 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            pulse: 0
        }));

        function loop() {
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            ctx.clearRect(0, 0, w, h);

            for (let s of synapses) {
                if (mouse.active) {
                    const dist = Math.sqrt((mouse.x - s.x) ** 2 + (mouse.y - s.y) ** 2);
                    if (dist < 130 && Math.random() < 0.1) {
                        s.pulse = 1;
                    }
                }

                if (s.pulse > 0) {
                    s.pulse -= 0.03;
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, 12 * s.pulse, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(0, 176, 122, ${s.pulse})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fill();
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    // PAGE 14: Matrix Digital Rain Code Streams
    initCanvasEngine('page-14', 'canvas-page-14', (ctx, getWidth, getHeight, mouse) => {
        const columns = Math.floor(window.innerWidth / 30);
        const drops = Array.from({ length: columns }, () => Math.random() * -50);

        function loop() {
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            ctx.clearRect(0, 0, w, h);

            ctx.font = '12px monospace';

            for (let i = 0; i < drops.length; i++) {
                const x = i * 30;
                const y = drops[i] * 18;

                let alpha = 0.2;
                if (mouse.active) {
                    const dist = Math.abs(mouse.x - x);
                    if (dist < 120) alpha = 0.7;
                }

                ctx.fillStyle = `rgba(0, 176, 122, ${alpha})`;
                const text = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
                ctx.fillText(text, x, y);

                if (y > h && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    // PAGE 15: Supernova Stardust Core Burst
    initCanvasEngine('page-15', 'canvas-page-15', (ctx, getWidth, getHeight, mouse) => {
        const particles = Array.from({ length: 40 }, () => ({
            angle: Math.random() * Math.PI * 2,
            dist: Math.random() * 100,
            speed: Math.random() * 0.5 + 0.2
        }));

        function loop() {
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            ctx.clearRect(0, 0, w, h);

            const cx = mouse.active ? mouse.x : w / 2;
            const cy = mouse.active ? mouse.y : h / 2;

            for (let p of particles) {
                p.dist += p.speed;
                if (p.dist > 180) p.dist = 0;

                const px = cx + Math.cos(p.angle) * p.dist;
                const py = cy + Math.sin(p.angle) * p.dist;

                ctx.beginPath();
                ctx.arc(px, py, 1.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 176, 122, ${1 - p.dist / 180})`;
                ctx.fill();
            }
            requestAnimationFrame(loop);
        }
        loop();
    });
});
