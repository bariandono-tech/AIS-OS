document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. CALCULATOR LOGIC (TER PPh 21 - PMK 168/2023)
    // ==========================================================================
    const btnCalculate = document.getElementById('btn-calculate');
    const inputGrossSalary = document.getElementById('gross-salary');
    const selectPtkpStatus = document.getElementById('ptkp-status');
    const resultBox = document.getElementById('calc-result-box');
    const resultKategori = document.getElementById('result-kategori');
    const resultPtkp = document.getElementById('result-ptkp');
    const resultTarif = document.getElementById('result-tarif');
    const resultPph = document.getElementById('result-pph');

    // Categorization rules based on PTKP
    const getTerCategory = (ptkp) => {
        const catA = ['TK/0', 'TK/1', 'K/0'];
        const catB = ['TK/2', 'TK/3', 'K/1', 'K/2'];
        const catC = ['K/3'];

        if (catA.includes(ptkp)) return 'A';
        if (catB.includes(ptkp)) return 'B';
        if (catC.includes(ptkp)) return 'C';
        return 'A';
    };

    // TER Rate Tables (based on PMK 168/2023)
    const getTerRate = (category, salary) => {
        if (category === 'A') {
            if (salary <= 5400000) return 0;
            if (salary <= 5650000) return 0.0025;
            if (salary <= 5950000) return 0.005;
            if (salary <= 6300000) return 0.0075;
            if (salary <= 6750000) return 0.01;
            if (salary <= 7500000) return 0.0125;
            if (salary <= 8500000) return 0.015;
            if (salary <= 9650000) return 0.0175;
            if (salary <= 10050000) return 0.02;
            if (salary <= 10350000) return 0.0225;
            if (salary <= 10700000) return 0.025;
            if (salary <= 11050000) return 0.03;
            if (salary <= 11600000) return 0.035;
            if (salary <= 12500000) return 0.04;
            if (salary <= 13750000) return 0.05;
            if (salary <= 15100000) return 0.06;
            if (salary <= 16950000) return 0.07;
            if (salary <= 19100000) return 0.08;
            if (salary <= 21100000) return 0.09;
            if (salary <= 23300000) return 0.10;
            if (salary <= 25300000) return 0.11;
            if (salary <= 29000000) return 0.12;
            if (salary <= 34300000) return 0.13;
            if (salary <= 40000000) return 0.14;
            if (salary <= 46200000) return 0.15;
            if (salary <= 53500000) return 0.16;
            if (salary <= 66200000) return 0.17;
            if (salary <= 84400000) return 0.18;
            if (salary <= 112200000) return 0.19;
            if (salary <= 158100000) return 0.20;
            if (salary <= 224400000) return 0.21;
            if (salary <= 321900000) return 0.22;
            if (salary <= 439700000) return 0.23;
            if (salary <= 595400000) return 0.24;
            if (salary <= 809700000) return 0.25;
            if (salary <= 1033800000) return 0.26;
            if (salary <= 1400000000) return 0.30;
            return 0.34;
        } else if (category === 'B') {
            if (salary <= 6200000) return 0;
            if (salary <= 6500000) return 0.0025;
            if (salary <= 6850000) return 0.005;
            if (salary <= 7300000) return 0.0075;
            if (salary <= 7800000) return 0.01;
            if (salary <= 8550000) return 0.0125;
            if (salary <= 9650000) return 0.015;
            if (salary <= 10050000) return 0.0175;
            if (salary <= 10450000) return 0.02;
            if (salary <= 10900000) return 0.0225;
            if (salary <= 11200000) return 0.025;
            if (salary <= 11850000) return 0.03;
            if (salary <= 12600000) return 0.035;
            if (salary <= 13600000) return 0.04;
            if (salary <= 14950000) return 0.05;
            if (salary <= 16400000) return 0.06;
            if (salary <= 18450000) return 0.07;
            if (salary <= 20800000) return 0.08;
            if (salary <= 23000000) return 0.09;
            if (salary <= 25200000) return 0.10;
            if (salary <= 27400000) return 0.11;
            if (salary <= 31400000) return 0.12;
            if (salary <= 37000000) return 0.13;
            if (salary <= 43100000) return 0.14;
            if (salary <= 49800000) return 0.15;
            if (salary <= 57700000) return 0.16;
            if (salary <= 71400000) return 0.17;
            if (salary <= 91000000) return 0.18;
            if (salary <= 121000000) return 0.19;
            if (salary <= 170500000) return 0.20;
            if (salary <= 242000000) return 0.21;
            if (salary <= 347100000) return 0.22;
            if (salary <= 474000000) return 0.23;
            if (salary <= 641900000) return 0.24;
            if (salary <= 872700000) return 0.25;
            if (salary <= 1114300000) return 0.26;
            if (salary <= 1510000000) return 0.30;
            return 0.34;
        } else if (category === 'C') {
            if (salary <= 6600000) return 0;
            if (salary <= 6950000) return 0.0025;
            if (salary <= 7350000) return 0.005;
            if (salary <= 7800000) return 0.0075;
            if (salary <= 8350000) return 0.01;
            if (salary <= 9050000) return 0.0125;
            if (salary <= 10050000) return 0.015;
            if (salary <= 10550000) return 0.0175;
            if (salary <= 10950000) return 0.02;
            if (salary <= 11350000) return 0.0225;
            if (salary <= 11800000) return 0.025;
            if (salary <= 12500000) return 0.03;
            if (salary <= 13350000) return 0.035;
            if (salary <= 14450000) return 0.04;
            if (salary <= 15900000) return 0.05;
            if (salary <= 17450000) return 0.06;
            if (salary <= 19600000) return 0.07;
            if (salary <= 22100000) return 0.08;
            if (salary <= 24400000) return 0.09;
            if (salary <= 26800000) return 0.10;
            if (salary <= 29100000) return 0.11;
            if (salary <= 33400000) return 0.12;
            if (salary <= 39300000) return 0.13;
            if (salary <= 45800000) return 0.14;
            if (salary <= 52900000) return 0.15;
            if (salary <= 61300000) return 0.16;
            if (salary <= 75900000) return 0.17;
            if (salary <= 96700000) return 0.18;
            if (salary <= 128600000) return 0.19;
            if (salary <= 181200000) return 0.20;
            if (salary <= 257100000) return 0.21;
            if (salary <= 368800000) return 0.22;
            if (salary <= 503600000) return 0.23;
            if (salary <= 682000000) return 0.24;
            if (salary <= 927200000) return 0.25;
            if (salary <= 1183900000) return 0.26;
            if (salary <= 1600000000) return 0.30;
            return 0.34;
        }
        return 0;
    };

    // Currency Formatter
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

    // Calculate Action
    if (btnCalculate) {
        btnCalculate.addEventListener('click', () => {
            const salaryVal = parseFloat(inputGrossSalary.value);
            const ptkpVal = selectPtkpStatus.value;

            if (isNaN(salaryVal) || salaryVal < 0) {
                alert('Silakan masukkan jumlah gaji bruto bulanan yang valid.');
                return;
            }

            if (!ptkpVal) {
                alert('Silakan pilih status PTKP Anda.');
                return;
            }

            const category = getTerCategory(ptkpVal);
            const rate = getTerRate(category, salaryVal);
            const taxPaid = Math.floor(salaryVal * rate);

            // Populate DOM Results
            resultKategori.textContent = `Kategori ${category}`;
            resultPtkp.textContent = ptkpVal;
            resultTarif.textContent = `${(rate * 100).toFixed(2)}%`;
            resultPph.textContent = formatRupiah(taxPaid);

            // Show Box
            resultBox.classList.remove('hidden');
        });
    }

    // ==========================================================================
    // 2. CHECKOUT MODAL & WHATSAPP REDIRECT
    // ==========================================================================
    const checkoutModal = document.getElementById('checkout-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const userEmailInput = document.getElementById('user-email');
    
    // Trigger buttons
    const btnBuyProduct = document.getElementById('btn-buy-product');
    const btnNavCta = document.getElementById('btn-nav-cta');
    const heroPrimaryCta = document.getElementById('hero-primary-cta');

    // Show modal function
    const openModal = (e) => {
        if (e) e.preventDefault();
        checkoutModal.classList.add('active');
    };

    // Close modal function
    const closeModal = () => {
        checkoutModal.classList.remove('active');
        checkoutForm.reset();
    };

    // Attach listeners to buy CTAs
    if (btnBuyProduct) btnBuyProduct.addEventListener('click', openModal);
    if (btnNavCta) btnNavCta.addEventListener('click', openModal);
    if (heroPrimaryCta) heroPrimaryCta.addEventListener('click', openModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                closeModal();
            }
        });
    }

    // Submit checkout form -> WA Redirect (No auto-download)
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = userEmailInput.value.trim();

            if (!email) {
                alert('Silakan masukkan email pemesan yang valid.');
                return;
            }

            // Construct WA message
            const adminPhone = '6285161424785'; // Placeholder phone number
            const baseMessage = 'Halo Kak, saya mau beli *Mastery Kit Pajak Dasar 101* seharga *Rp 29.000*. Bagaimana langkah pembayarannya?';
            const emailText = `\n\nDetail Akun:\nEmail Pemesan: ${email}`;
            const fullMessage = baseMessage + emailText;
            
            const waUrl = `https://api.whatsapp.com/send?phone=${adminPhone}&text=${encodeURIComponent(fullMessage)}`;

            // Close modal & open WA
            closeModal();
            window.open(waUrl, '_blank');
        });
    }
});
