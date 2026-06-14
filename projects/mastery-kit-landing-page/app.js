/* ============================================================
   MASTERY KIT — app.js
   Interactive: Sticky Nav, FAQ Accordion, Modal, Scroll Reveal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. Sticky Header on Scroll ───────────────────────────
    const header = document.querySelector('.header');
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });


    // ─── 2. Scroll Reveal Animation ──────────────────────────
    const revealEls = document.querySelectorAll(
        '.pain-card, .folder-card, .faq-card, .accordion-item, .flowchart-step-item, .pricing-card'
    );

    // Add reveal class to each observed element
    revealEls.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger the animation delay based on sibling index
                const siblings = [...entry.target.parentElement.children];
                const delay = siblings.indexOf(entry.target) * 80;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));


    // ─── 3. FAQ / Q&A Accordion ──────────────────────────────
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items first
            accordionItems.forEach(i => {
                i.classList.remove('active');
                const c = i.querySelector('.accordion-content');
                c.style.maxHeight = null;
            });

            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });


    // ─── 4. Modal: Open & Close ───────────────────────────────
    const modal           = document.getElementById('checkout-modal');
    const btnBuy          = document.getElementById('btn-buy-product');
    const btnNavCta       = document.getElementById('btn-nav-cta');
    const btnHeroCta      = document.getElementById('hero-primary-cta');
    const btnClose        = document.getElementById('modal-close-btn');
    const qaFooterLink    = document.querySelector('.qa-footer a');

    const openModal = (e) => {
        e.preventDefault();
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
        // Reset the form after close animation
        setTimeout(resetModal, 350);
    };

    if (btnBuy)      btnBuy.addEventListener('click', openModal);
    if (btnNavCta)   btnNavCta.addEventListener('click', openModal);
    if (btnHeroCta)  btnHeroCta.addEventListener('click', openModal);
    if (qaFooterLink) qaFooterLink.addEventListener('click', openModal);
    if (btnClose)    btnClose.addEventListener('click', closeModal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('visible')) closeModal();
    });


    // ─── 5. Checkout Form: Submit & Show Success ──────────────
    const form           = document.getElementById('checkout-form');
    const successScreen  = document.getElementById('payment-success-screen');
    const emailInput     = document.getElementById('user-email');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!emailInput.value) return;

            const btn = form.querySelector('button[type="submit"]');

            // Simulate processing state
            btn.textContent = 'Memproses...';
            btn.disabled = true;

            setTimeout(() => {
                form.classList.add('hidden');
                successScreen.classList.remove('hidden');
            }, 1400);
        });
    }

    const resetModal = () => {
        if (form) {
            form.classList.remove('hidden');
            const btn = form.querySelector('button[type="submit"]');
            btn.textContent = 'Proses Download';
            btn.disabled = false;
            emailInput.value = '';
        }
        if (successScreen) successScreen.classList.add('hidden');
    };


    // ─── 6. Smooth Scroll for Nav Links ──────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Skip the CTA buttons (they open the modal)
        if (anchor.id === 'btn-nav-cta' || anchor.id === 'hero-primary-cta') return;

        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerH = header.offsetHeight;
                const targetY = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
                window.scrollTo({ top: targetY, behavior: 'smooth' });
            }
        });
    });


    // ─── 7. Flow Preview: Node Hover Highlight ────────────────
    const flowNodes = document.querySelectorAll('.flow-node');
    flowNodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            node.querySelector('.node-label')?.style.setProperty('transform', 'scale(1.02)');
        });
        node.addEventListener('mouseleave', () => {
            node.querySelector('.node-label')?.style.removeProperty('transform');
        });
    });


    // ─── 8. Pricing Card Pulse on Scroll into View ───────────
    const pricingCard = document.querySelector('.pricing-card');
    if (pricingCard) {
        const priceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    pricingCard.style.animation = 'pricing-pulse 0.6s ease forwards';
                    priceObserver.unobserve(pricingCard);
                }
            });
        }, { threshold: 0.4 });
        priceObserver.observe(pricingCard);
    }

    // Inject keyframe for pricing pulse
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pricing-pulse {
            0%   { box-shadow: 0 0 0 rgba(99,102,241,0); }
            50%  { box-shadow: 0 0 70px rgba(99,102,241,0.4); }
            100% { box-shadow: 0 0 80px rgba(99,102,241,0.15); }
        }
    `;
    document.head.appendChild(style);

});
