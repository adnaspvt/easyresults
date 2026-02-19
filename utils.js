// utils.js - Shared Application Logic

// --- 1. UTILITY FUNCTIONS ---
const $ = id => document.getElementById(id);

const showLoader = (show) => {
    const loader = $('global-loader');
    if (loader) loader.classList.toggle('hidden', !show);
};

function showToast(msg, type='success') {
    const el = document.createElement('div');
    el.className = `px-5 py-4 rounded-xl shadow-2xl border backdrop-blur-md text-sm font-bold flex items-center gap-3 fade-in ${type==='success'?'bg-emerald-500/10 border-emerald-500/30 text-emerald-400':'bg-red-500/10 border-red-500/30 text-red-400'}`;
    el.innerHTML = `<i class="fas ${type==='success'?'fa-check-circle':'fa-exclamation-circle'} text-lg"></i> ${msg}`;
    const container = $('toast-container');
    if(container) {
        container.appendChild(el);
        setTimeout(() => el.remove(), 4000);
    }
}

// --- 2. THEMES & BRANDING ---
const THEMES = {
    'deep_space': { bg: '#020617', glass: 'rgba(15, 23, 42, 0.85)', text: '#f8fafc', muted: '#94a3b8' },
    'minimal_light': { bg: '#f8fafc', glass: 'rgba(255, 255, 255, 0.85)', text: '#0f172a', muted: '#64748b' },
    'midnight_blue': { bg: '#0b1121', glass: 'rgba(30, 41, 59, 0.85)', text: '#f0f9ff', muted: '#94a3b8' },
    'emerald_city': { bg: '#022c22', glass: 'rgba(6, 78, 59, 0.85)', text: '#ecfdf5', muted: '#6ee7b7' },
    'crimson_fury': { bg: '#450a0a', glass: 'rgba(127, 29, 29, 0.85)', text: '#fff1f2', muted: '#fda4af' },
    'royal_purple': { bg: '#2e1065', glass: 'rgba(76, 29, 149, 0.85)', text: '#faf5ff', muted: '#c4b5fd' },
    'classic_academia': { bg: '#27272a', glass: 'rgba(63, 63, 70, 0.85)', text: '#fafafa', muted: '#a1a1aa' },
    'modern_teal': { bg: '#134e4a', glass: 'rgba(17, 94, 89, 0.85)', text: '#f0fdfa', muted: '#99f6e4' },
    'solar_flare': { bg: '#431407', glass: 'rgba(124, 45, 18, 0.85)', text: '#fff7ed', muted: '#fdba74' },
    'oceanic_depth': { bg: '#0c4a6e', glass: 'rgba(12, 74, 110, 0.85)', text: '#f0f9ff', muted: '#bae6fd' },
    'slate_minimal': { bg: '#0f172a', glass: 'rgba(51, 65, 85, 0.85)', text: '#f8fafc', muted: '#cbd5e1' }
};

function applyTheme(inst) {
    const color = inst.themeColor || '#6366f1';
    const themeKey = inst.theme || 'deep_space';
    const t = THEMES[themeKey] || THEMES['deep_space'];
    
    const root = document.documentElement;
    const adjustColor = (hex, amt) => '#' + hex.replace(/^#/, '').replace(/../g, c => ('0'+Math.min(255, Math.max(0, parseInt(c, 16) + amt)).toString(16)).substr(-2));
    
    root.style.setProperty('--primary', color);
    root.style.setProperty('--primary-dark', adjustColor(color, -20));
    root.style.setProperty('--primary-glow', color + '40');
    root.style.setProperty('--bg-dark', t.bg);
    root.style.setProperty('--bg-panel', t.glass);
    root.style.setProperty('--text-main', t.text);
    root.style.setProperty('--text-muted', t.muted);

    if (t.bg === '#f8fafc' || t.bg === '#ffffff') {
        root.style.setProperty('--border', 'rgba(0, 0, 0, 0.1)');
        root.style.setProperty('--bg-input', 'rgba(0, 0, 0, 0.05)');
    } else {
        root.style.setProperty('--border', 'rgba(255, 255, 255, 0.08)');
        root.style.setProperty('--bg-input', 'rgba(30, 41, 59, 0.6)');
    }
}

// --- 3. GRADING & MATH FUNCTIONS ---
const DEFAULT_SCALES = {
    standard: [{g:'A+',m:90},{g:'A',m:80},{g:'B',m:70},{g:'C',m:60},{g:'D',m:50},{g:'F',m:0}],
    gpa: [{g:'A',m:90},{g:'B',m:80},{g:'C',m:70},{g:'D',m:60},{g:'F',m:0}],
    o_level: [{g:'O',m:90},{g:'A+',m:80},{g:'A',m:70},{g:'B',m:60},{g:'C',m:50},{g:'F',m:0}]
};

function getGrade(pct, customScale) {
    pct = Number(pct);
    if(!customScale || customScale.length === 0) return '-';
    const sorted = [...customScale].sort((a, b) => b.m - a.m);
    for(let i=0; i<sorted.length; i++) {
        if(pct >= sorted[i].m) return sorted[i].g;
    }
    return sorted[sorted.length-1].g;
}

function getGradeLegend(customScale) {
    if(!customScale || customScale.length === 0) return '';
    const sorted = [...customScale].sort((a, b) => b.m - a.m);
    return sorted.map((row, i) => {
        if (sorted.length === 1) return `${row.g} (All)`;
        if(i === 0) return `${row.g} (${row.m}-100%)`;
        if(i === sorted.length - 1) return `${row.g} (<${sorted[i-1].m}%)`;
        return `${row.g} (${row.m}-${sorted[i-1].m - 1}%)`;
    }).join(' | ');
}

function numToWords(n) {
    const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
    if ((n = n.toString()).length > 9) return 'Overflow';
    let n_ = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n_) return; 
    let str = '';
    str += (n_[1] != 0) ? (a[Number(n_[1])] || b[n_[1][0]] + ' ' + a[n_[1][1]]) + 'Crore ' : '';
    str += (n_[2] != 0) ? (a[Number(n_[2])] || b[n_[2][0]] + ' ' + a[n_[2][1]]) + 'Lakh ' : '';
    str += (n_[3] != 0) ? (a[Number(n_[3])] || b[n_[3][0]] + ' ' + a[n_[3][1]]) + 'Thousand ' : '';
    str += (n_[4] != 0) ? (a[Number(n_[4])] || b[n_[4][0]] + ' ' + a[n_[4][1]]) + 'Hundred ' : '';
    str += (n_[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n_[5])] || b[n_[5][0]] + ' ' + a[n_[5][1]]) : '';
    return str.trim() ? str.trim() + " Only" : "Zero Only";
}

// --- 4. IMAGE FORMATTER ---
function formatImageUrl(url) {
    if (!url) return "";
    url = url.trim();

    // 1. Force Imgur page links into direct image links
    const imgurRegex = /^https?:\/\/imgur\.com\/([a-zA-Z0-9]+)$/;
    const imgurMatch = url.match(imgurRegex);
    if (imgurMatch && imgurMatch[1]) {
        return `https://i.imgur.com/${imgurMatch[1]}.png`;
    }

    // 2. Intercept Google Drive links and pass them through a CORS Proxy
    const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(driveRegex);
    if (match && match[1]) {
        const directDriveLink = `https://drive.google.com/uc?export=view&id=${match[1]}`;
        // Wrap the Drive link in a free proxy to bypass security blocks
        return `https://corsproxy.io/?${encodeURIComponent(directDriveLink)}`;
    }

    return url;
}