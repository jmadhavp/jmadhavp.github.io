/**
 * Common utility functions for Financial Calculators
 */

const formatters = {
    USD: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }),
    GBP: new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }),
    percent: new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }),
    number: new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })
};

function formatCurrency(amount, region = 'US') {
    return region === 'UK' ? formatters.GBP.format(amount) : formatters.USD.format(amount);
}

function formatPercent(value) {
    return formatters.percent.format(value / 100);
}

function updateElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

const translations = {
    en: {
        home: "Home",
        calculators: "Calculators",
        about: "About",
        getStarted: "Get Started",
        legal: "Legal",
        privacy: "Privacy Policy",
        disclaimer: "Disclaimer",
        contact: "Contact",
        region: "Region",
        allTools: "All Tools",
        tryNow: "Try Now",
        readGuide: "Read Guide",
        mortgageTitle: "Mortgage Calculator",
        loanTitle: "Loan Repayment",
        creditCardTitle: "Credit Card Interest",
        inflationTitle: "Inflation Calculator",
        rentBuyTitle: "Rent vs Buy",
        salaryTitle: "Salary to Hourly",
        debtGuideTitle: "Debt Management Guide"
    },
    es: {
        home: "Inicio",
        calculators: "Calculadoras",
        about: "Acerca de",
        getStarted: "Empezar",
        legal: "Legal",
        privacy: "Política de Privacidad",
        disclaimer: "Descargo de Responsabilidad",
        contact: "Contacto",
        region: "Región",
        allTools: "Todas las Herramientas",
        tryNow: "Probar Ahora",
        readGuide: "Leer Guía",
        mortgageTitle: "Calculadora de Hipotecas",
        loanTitle: "Reembolso de Préstamo",
        creditCardTitle: "Interés de Tarjeta",
        inflationTitle: "Calculadora de Inflación",
        rentBuyTitle: "Alquilar vs Comprar",
        salaryTitle: "Salario a Hora",
        debtGuideTitle: "Guía de Deuda"
    },
    fr: {
        home: "Accueil",
        calculators: "Calculatrices",
        about: "À propos",
        getStarted: "Commencer",
        legal: "Mentions Légales",
        privacy: "Politique de Confidentialité",
        disclaimer: "Avis de non-responsabilité",
        contact: "Contact",
        region: "Région",
        allTools: "Tous les Outils",
        tryNow: "Essayer",
        readGuide: "Lire le Guide",
        mortgageTitle: "Prêt Hypothécaire",
        loanTitle: "Remboursement de Prêt",
        creditCardTitle: "Intérêts de Carte",
        inflationTitle: "Calculateur d'Inflation",
        rentBuyTitle: "Louer vs Acheter",
        salaryTitle: "Salaire à Horaire",
        debtGuideTitle: "Guide d'Endettement"
    },
    de: {
        home: "Startseite",
        calculators: "Rechner",
        about: "Über uns",
        getStarted: "Loslegen",
        legal: "Rechtliches",
        privacy: "Datenschutz",
        disclaimer: "Haftungsausschluss",
        contact: "Kontakt",
        region: "Region",
        allTools: "Alle Rechner",
        tryNow: "Jetzt testen",
        readGuide: "Leitfaden lesen",
        mortgageTitle: "Hypothekenrechner",
        loanTitle: "Darlehensrückzahlung",
        creditCardTitle: "Kreditkartenzinsen",
        inflationTitle: "Inflationsrechner",
        rentBuyTitle: "Mieten vs Kaufen",
        salaryTitle: "Gehalt zu Stundenlohn",
        debtGuideTitle: "Schulden-Leitfaden"
    },
    jp: {
        home: "ホーム",
        calculators: "計算機",
        about: "アバウト",
        getStarted: "開始する",
        legal: "法務",
        privacy: "プライバシーポリシー",
        disclaimer: "免責事項",
        contact: "お問い合わせ",
        region: "地域",
        allTools: "すべてのツール",
        tryNow: "今すぐ試す",
        readGuide: "ガイドを読む",
        mortgageTitle: "住宅ローン計算機",
        loanTitle: "ローン返済",
        creditCardTitle: "クレジットカード利息",
        inflationTitle: "インフレ計算機",
        rentBuyTitle: "賃貸 vs 購入",
        salaryTitle: "給与・時給換算",
        debtGuideTitle: "債務管理ガイド"
    }
};

function switchLanguage(lang) {
    if (!translations[lang]) return;
    
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
    
    // Save preference
    localStorage.setItem('preferredLang', lang);
}

// Mobile Menu Toggle (Simplified)
document.addEventListener('DOMContentLoaded', () => {
    // Language Switcher Logic
    const langSwitchers = document.querySelectorAll('.lang-switcher span');
    langSwitchers.forEach(span => {
        span.addEventListener('click', () => {
            const lang = span.getAttribute('data-lang');
            if (lang) switchLanguage(lang);
        });
    });

    // Load preferred language
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang) switchLanguage(savedLang);

    // FAQ Toggle Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const answer = q.nextElementSibling;
            const isOpen = answer.style.display === 'block';
            
            // Close all others
            document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
            
            if (!isOpen) {
                answer.style.display = 'block';
            }
        });
    });

    // Region Switcher logic (if applicable on page)
    const regionBtns = document.querySelectorAll('.region-btn');
    regionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            regionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const region = btn.dataset.region;
            if (window.onRegionChange) {
                window.onRegionChange(region);
            }
        });
    });
});

// Helper for complex calculations
const financial = {
    pmt: (rate, nper, pv) => {
        if (rate === 0) return pv / nper;
        const pvif = Math.pow(1 + rate, nper);
        return (rate * pv * pvif) / (pvif - 1);
    }
};
