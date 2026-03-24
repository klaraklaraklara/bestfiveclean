// ===== CITY SWITCHER =====
function switchCity(city, btn) {
  document.querySelectorAll('.city-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + city).classList.add('active');
  btn.classList.add('active');
}

// ===== MODAL =====
function openModal(plan, price, desc) {
  document.getElementById('modal-title').textContent = plan;
  document.getElementById('modal-plan').textContent = desc;
  document.getElementById('modal-price').textContent = price;
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

function submitModal() {
  const name = document.getElementById('m-name').value;
  const phone = document.getElementById('m-phone').value;
  const email = document.getElementById('m-email').value;
  if (!name || !phone || !email) { alert('Vyplňte prosím jméno, telefon a e-mail.'); return; }
  closeModal();
  alert('✅ Děkujeme! Vaše objednávka předplatného byla odeslána. Ozveme se do 24 hodin.');
}

// ===== ZPĚTNÁ VAZBA =====
let fbRating = 0;
let happyNum = 95;

function openFeedback() {
  fbRating = 0;
  document.getElementById('fbComment').value = '';
  document.getElementById('fbCommentWrap').style.display = 'none';
  document.getElementById('fbSubmitBtn').style.display = 'none';
  document.getElementById('fbSuccess').style.display = 'none';
  document.getElementById('fbRatingText').textContent = '';
  document.querySelectorAll('.fb-star').forEach(s => { s.style.opacity = '0.3'; s.style.color = 'var(--gray)'; });
  const el = document.getElementById('feedbackOverlay');
  el.style.display = 'flex';
}

function closeFeedback() {
  document.getElementById('feedbackOverlay').style.display = 'none';
}

function rateStar(val) {
  fbRating = val;
  const labels = ['', 'Mohlo být lepší 😕', 'Průměrné 😐', 'Dobré 🙂', 'Velmi dobré 😊', 'Skvělé! Děkujeme! 🌸'];
  document.getElementById('fbRatingText').textContent = labels[val];
  document.querySelectorAll('.fb-star').forEach(s => {
    const v = parseInt(s.dataset.val);
    s.style.opacity = v <= val ? '1' : '0.25';
    s.style.color = v <= val ? '#ff4d8d' : 'var(--gray)';
    s.style.transform = v === val ? 'scale(1.2)' : 'scale(1)';
  });
  document.getElementById('fbCommentWrap').style.display = 'block';
  document.getElementById('fbSubmitBtn').style.display = 'block';
}

function submitFeedback() {
  if (fbRating >= 4) {
    happyNum++;
    document.getElementById('happyCount').textContent = happyNum + '+';
  }
  document.getElementById('fbSubmitBtn').style.display = 'none';
  document.getElementById('fbCommentWrap').style.display = 'none';
  document.getElementById('fbRatingText').textContent = '';
  document.getElementById('starsRow').style.display = 'none';
  document.querySelector('#feedbackOverlay h3').style.display = 'none';
  document.querySelector('#feedbackOverlay p').style.display = 'none';
  document.getElementById('fbSuccess').style.display = 'block';
  setTimeout(() => closeFeedback(), 2500);
}

// ===== VOUCHER =====
const VOUCHER_PRICES = {
  auto_rok:          { praha:8550, brno:7200, jihlava:4050, label:'Tepování auta (5 sedaček) — Roční předplatné' },
  auto_pol:          { praha:4500, brno:3825, jihlava:2250, label:'Tepování auta (5 sedaček) — Pololetní předplatné' },
  pohovka_mala_rok:  { praha:10450, brno:8800, jihlava:4950, label:'Tepování pohovky malá — Roční předplatné' },
  pohovka_mala_pol:  { praha:5500, brno:4675, jihlava:2750, label:'Tepování pohovky malá — Pololetní předplatné' },
  pohovka_stredni_rok:{ praha:12540, brno:10560, jihlava:5940, label:'Tepování pohovky střední — Roční předplatné' },
  pohovka_velka_rok: { praha:15048, brno:12672, jihlava:7128, label:'Tepování pohovky velká — Roční předplatné' },
  koberec_rok:       { praha:8075, brno:6800, jihlava:3825, label:'Tepování koberce do 20m² — Roční předplatné' },
  matrace_m2_rok:    { praha:9500, brno:8000, jihlava:4500, label:'Tepování matrace do 2 ks — Roční předplatné' },
  ozon_auto:         { praha:2500, brno:1000, jihlava:1000, label:'Dezinfekce ozonem — Auto / klimatizace' },
  ozon_m50:          { praha:3300, brno:2000, jihlava:1800, label:'Dezinfekce ozonem — Do 50 m²' },
  ozon_m100:         { praha:4300, brno:3000, jihlava:2800, label:'Dezinfekce ozonem — Do 100 m²' },
};

function genVoucherCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'BFC-';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

let currentVoucherCode = genVoucherCode();

function updateVoucher() {
  drawVoucherCanvas(currentVoucherCode);
}

function getVoucherData() {
  const type = document.getElementById('voucherType').value;
  const city = document.getElementById('voucherCity').value;
  const to   = document.getElementById('voucherTo').value || '—';
  const from = document.getElementById('voucherFrom').value || '—';
  const msg  = document.getElementById('voucherMsg').value || '';
  const priceData = VOUCHER_PRICES[type];
  const price = priceData ? priceData[city] : 0;
  const label = priceData ? priceData.label : '';
  const cityLabel = { praha:'Praha a okolí', brno:'Brno a okolí', jihlava:'Jihlava a okolí' }[city];
  const now = new Date();
  const validTo = new Date(now); validTo.setFullYear(validTo.getFullYear() + 1);
  const fmtDate = d => d.toLocaleDateString('cs-CZ');
  return { type, city, cityLabel, to, from, msg, price, label, validTo: fmtDate(validTo), issued: fmtDate(now) };
}

function drawVoucherCanvas(code) {
  const canvas = document.getElementById('voucherCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 600, H = 340;
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, W, H);

  // Pink gradient left bar
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#ff4d8d');
  grad.addColorStop(1, '#c4005c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 6, H);

  // Subtle pink glow top right
  const glow = ctx.createRadialGradient(W, 0, 0, W, 0, 280);
  glow.addColorStop(0, 'rgba(255,77,141,0.12)');
  glow.addColorStop(1, 'rgba(255,77,141,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  const d = getVoucherData();

  // Logo
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillStyle = '#ff4d8d';
  ctx.fillText('Bestfive', 30, 45);
  ctx.font = '300 22px Georgia, serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(' Clean', 30 + ctx.measureText('Bestfive').width - 2, 45);

  // VOUCHER label
  ctx.font = 'bold 11px Arial';
  ctx.fillStyle = 'rgba(255,77,141,0.7)';
  ctx.letterSpacing = '3px';
  ctx.fillText('DÁRKOVÝ VOUCHER', 30, 68);

  // Divider
  ctx.strokeStyle = 'rgba(255,77,141,0.2)';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(30, 78); ctx.lineTo(W - 30, 78); ctx.stroke();

  // Service label
  ctx.font = 'bold 15px Arial';
  ctx.fillStyle = '#ffffff';
  const maxW = 340;
  const words = d.label.split(' ');
  let line = '', y = 105;
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line.trim(), 30, y); y += 20; line = word + ' ';
    } else line = test;
  }
  ctx.fillText(line.trim(), 30, y);

  // City
  ctx.font = '13px Arial';
  ctx.fillStyle = '#ff4d8d';
  ctx.fillText(d.cityLabel, 30, y + 22);

  // Price
  ctx.font = 'bold 32px Georgia, serif';
  ctx.fillStyle = '#ff4d8d';
  ctx.fillText(d.price.toLocaleString('cs-CZ') + ' Kč', 30, y + 60);

  // To/From
  ctx.font = '12px Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText('Pro: ' + d.to, 30, y + 82);
  ctx.fillText('Od: ' + d.from, 30, y + 98);

  if (d.msg) {
    ctx.font = 'italic 11px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillText('"' + d.msg.slice(0, 55) + (d.msg.length > 55 ? '…' : '') + '"', 30, y + 114);
  }

  // Validity
  ctx.font = '11px Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText('Platí do: ' + d.validTo, 30, H - 20);

  // QR placeholder (right side)
  const qrX = W - 130, qrY = 90, qrS = 110;
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(qrX, qrY, qrS, qrS, 8) : ctx.rect(qrX, qrY, qrS, qrS);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,77,141,0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.font = '10px Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.textAlign = 'center';
  ctx.fillText('QR kód', qrX + qrS/2, qrY + qrS/2 - 6);
  ctx.fillText('generován při', qrX + qrS/2, qrY + qrS/2 + 8);
  ctx.fillText('stažení', qrX + qrS/2, qrY + qrS/2 + 22);
  ctx.textAlign = 'left';

  // Code
  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = 'rgba(255,77,141,0.7)';
  ctx.textAlign = 'center';
  ctx.fillText(code, qrX + qrS/2, qrY + qrS + 18);
  ctx.textAlign = 'left';
}

function generateVoucher() {
  currentVoucherCode = genVoucherCode();
  const d = getVoucherData();

  // Load QR library and generate
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
  script.onload = () => {
    const qrDiv = document.createElement('div');
    qrDiv.style.display = 'none';
    document.body.appendChild(qrDiv);

    const verifyUrl = `https://bestfiveclean.cz/verify?code=${currentVoucherCode}`;
    new QRCode(qrDiv, { text: verifyUrl, width: 200, height: 200, colorDark: '#ff4d8d', colorLight: '#0a0a0a' });

    setTimeout(() => {
      const qrCanvas = qrDiv.querySelector('canvas');
      renderAndDownload(d, qrCanvas);
      document.body.removeChild(qrDiv);
    }, 300);
  };
  document.head.appendChild(script);
}

function renderAndDownload(d, qrCanvas) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200; canvas.height = 680;
  const ctx = canvas.getContext('2d');
  const W = 1200, H = 680;

  // Background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, W, H);

  // Pink left bar
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#ff4d8d');
  grad.addColorStop(1, '#c4005c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 12, H);

  // Glow
  const glow = ctx.createRadialGradient(W, 0, 0, W, 0, 560);
  glow.addColorStop(0, 'rgba(255,77,141,0.1)');
  glow.addColorStop(1, 'rgba(255,77,141,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Logo
  ctx.font = 'bold 44px Georgia, serif';
  ctx.fillStyle = '#ff4d8d';
  ctx.fillText('Bestfive', 60, 90);
  ctx.font = '300 44px Georgia, serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(' Clean', 60 + ctx.measureText('Bestfive').width - 2, 90);

  // VOUCHER
  ctx.font = 'bold 13px Arial';
  ctx.fillStyle = 'rgba(255,77,141,0.7)';
  ctx.fillText('DÁRKOVÝ VOUCHER', 60, 122);

  ctx.strokeStyle = 'rgba(255,77,141,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(60, 140); ctx.lineTo(W - 60, 140); ctx.stroke();

  // Service
  ctx.font = 'bold 28px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(d.label, 60, 190);

  ctx.font = '20px Arial';
  ctx.fillStyle = '#ff4d8d';
  ctx.fillText(d.cityLabel, 60, 222);

  // Price
  ctx.font = 'bold 56px Georgia, serif';
  ctx.fillStyle = '#ff4d8d';
  ctx.fillText(d.price.toLocaleString('cs-CZ') + ' Kč', 60, 300);

  // To/From/Msg
  ctx.font = '20px Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText('Pro: ' + d.to, 60, 350);
  ctx.fillText('Od: ' + d.from, 60, 378);
  if (d.msg) {
    ctx.font = 'italic 18px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('"' + d.msg.slice(0, 80) + (d.msg.length > 80 ? '…' : '') + '"', 60, 410);
  }

  // Validity & issued
  ctx.font = '16px Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText('Vydáno: ' + d.issued + '  |  Platí do: ' + d.validTo, 60, H - 40);

  // QR code
  if (qrCanvas) {
    const qrSize = 220;
    const qrX = W - qrSize - 80;
    const qrY = (H - qrSize) / 2 - 20;
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = 'rgba(255,77,141,0.8)';
    ctx.textAlign = 'center';
    ctx.fillText(currentVoucherCode, qrX + qrSize/2, qrY + qrSize + 24);
    ctx.textAlign = 'left';
  }

  // Download as PNG (PDF-like)
  const link = document.createElement('a');
  link.download = `Bestfive-Clean-Voucher-${currentVoucherCode}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  // Also update preview
  drawVoucherCanvas(currentVoucherCode);
  alert('✅ Voucher stažen! Kód: ' + currentVoucherCode + '\n\nPošlete tento obrázek dárku — QR kód odkazuje na ověřovací stránku.\nPo použití kontaktujte zákazníka nebo označte kód jako použitý.');
}

// Init voucher preview
setTimeout(() => drawVoucherCanvas(currentVoucherCode), 500);

// ===== TOOLTIP =====
function toggleTooltip() {
  const t = document.getElementById('spzTooltip');
  t.style.display = t.style.display === 'none' ? 'block' : 'none';
}
document.addEventListener('click', function(e) {
  if (!document.getElementById('spzTooltipWrap').contains(e.target)) {
    document.getElementById('spzTooltip').style.display = 'none';
  }
});

// ===== SEGMENT SWITCHER =====
function switchSegment(seg, btn) {
  document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-domacnost').style.display = seg === 'domacnost' ? '' : 'none';
  document.getElementById('panel-firmy').style.display = seg === 'firmy' ? '' : 'none';
}

// ===== CENÍK =====
const PRICES = {
  auto: {
    variants: [
      { label: '5 sedaček', key: 's4' },
      { label: '6 a více sedaček', key: 's6' }
    ],
    features: ['2× čištění sedaček, koberečků a kufru', 'Čistíme u vás doma nebo u nás — dle vašich potřeb', 'Jednou za půl roku', 'Včetně dopravy', 'Dezinfekce ozonem zdarma', 'Platíte až po 1. čištění'],
    data: {
      s4: { praha: {rok:8550,pol:4500,jed:4775}, brno: {rok:7200,pol:3825,jed:4100}, jihlava: {rok:4050,pol:2250,jed:2525} },
      s6: { praha: {rok:9405,pol:4950,jed:5203}, brno: {rok:7920,pol:4208,jed:4460}, jihlava: {rok:4455,pol:2475,jed:2728} }
    }
  },
  pohovka: {
    variants: [
      { label: 'Malá pohovka', key: 'mala' },
      { label: 'Velká pohovka', key: 'velka' },
      { label: 'Střední pohovka', key: 'stredni' }
    ],
    features: ['2× hloubkové čištění pohovky', 'Jednou za půl roku', 'Včetně dopravy', 'Dezinfekce ozonem zdarma', 'Platíte až po 1. čištění'],
    data: {
      mala:    { praha: {rok:10450,pol:5500,jed:5725}, brno: {rok:8800,pol:4675,jed:4900}, jihlava: {rok:4950,pol:2750,jed:2975} },
      stredni: { praha: {rok:12540,pol:6600,jed:6770}, brno: {rok:10560,pol:5610,jed:5780}, jihlava: {rok:5940,pol:3300,jed:3470} },
      velka:   { praha: {rok:15048,pol:7920,jed:8024}, brno: {rok:12672,pol:6732,jed:6836}, jihlava: {rok:7128,pol:3960,jed:3964} }
    }
  },
  koberec: {
    variants: [
      { label: 'Do 20 m²', key: 'do20' }
    ],
    features: ['2× tepování koberce', 'Jednou za půl roku', 'Včetně dopravy', 'Dezinfekce ozonem zdarma', 'Nad 20 m² — zavolejte, domluvíme se', 'Platíte až po 1. čištění'],
    data: {
      do20: { praha: {rok:8075,pol:4250,jed:4538}, brno: {rok:6800,pol:3613,jed:3900}, jihlava: {rok:3825,pol:2125,jed:2413} }
    }
  },
  matrace: {
    variants: [
      { label: 'Do 2 matrací', key: 'm2' },
      { label: 'Do 4 matrací', key: 'm4' },
      { label: 'Do 6 matrací', key: 'm6' }
    ],
    features: ['2× čištění matrace', 'Jednou za půl roku', 'Včetně dopravy', 'Likvidace roztočů a bakterií', 'Dezinfekce ozonem zdarma', 'Platíte až po 1. čištění'],
    data: {
      m2: { praha: {rok:9500,pol:5000,jed:5250}, brno: {rok:8000,pol:4250,jed:4500}, jihlava: {rok:4500,pol:2500,jed:2750} },
      m4: { praha: {rok:13300,pol:7000,jed:7150}, brno: {rok:11200,pol:5950,jed:6100}, jihlava: {rok:6300,pol:3500,jed:3650} },
      m6: { praha: {rok:18620,pol:9800,jed:9810}, brno: {rok:15680,pol:8330,jed:8340}, jihlava: {rok:8820,pol:4900,jed:4910} }
    }
  },
  ozon: {
    variants: [
      { label: 'Auto / klimatizace', key: 'auto' },
      { label: 'Do 50 m²', key: 'm50' },
      { label: 'Do 80 m²', key: 'm80' },
      { label: 'Do 100 m²', key: 'm100' },
      { label: 'Nad 100 m²', key: 'velke' }
    ],
    features: ['Dezinfekce ozonem', '1× ročně', 'Eliminace bakterií, plísní a zápachu', 'Ekologicky — bez chemie', 'Včetně dopravy'],
    data: {
      auto:  { praha: {rok:2500,pol:2500}, brno: {rok:1000,pol:1000}, jihlava: {rok:1000,pol:1000} },
      m50:   { praha: {rok:3300,pol:3300}, brno: {rok:2000,pol:2000}, jihlava: {rok:1800,pol:1800} },
      m80:   { praha: {rok:3800,pol:3800}, brno: {rok:2500,pol:2500}, jihlava: {rok:2300,pol:2300} },
      m100:  { praha: {rok:4300,pol:4300}, brno: {rok:3000,pol:3000}, jihlava: {rok:2800,pol:2800} },
      velke: { praha: {rok:0,pol:0}, brno: {rok:0,pol:0}, jihlava: {rok:0,pol:0} }
    }
  }
};

const PROMO_SOLD = 48;
const PROMO_TOTAL = 100;
let pSold = PROMO_SOLD;

let pCity = 'praha', pType = 'auto', pVariant = 's4', pBilling = 'rok', pMix = 1;

function updateCounter() {
  const left = PROMO_TOTAL - pSold;
  const pct = (pSold / PROMO_TOTAL) * 100;
  document.getElementById('counterNum').textContent = pSold;
  document.getElementById('counterLeft').textContent = left;
  document.getElementById('counterBar').style.width = pct + '%';
}

function selectCity(city, btn) {
  pCity = city;
  document.querySelectorAll('#cityTabs .price-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderBilling();
}

function selectType(type, btn) {
  pType = type;
  document.querySelectorAll('#typeTabs .price-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderVariants();
  renderBilling();
}

function selectVariant(variant, btn) {
  pVariant = variant;
  document.querySelectorAll('#variantTabs .price-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderBilling();
}

function setMix(n) {
  pMix = n;
  document.querySelectorAll('.mix-item').forEach(m => m.classList.remove('active'));
  if (n > 1) document.getElementById('mix' + n).classList.add('active');
  renderBilling();
}

const SOFA_SVG = {
  mala: `<svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="18" width="64" height="22" rx="8" fill="#ff4d8d" opacity="0.8"/><rect x="2" y="14" width="14" height="26" rx="6" fill="#c4005c"/><rect x="64" y="14" width="14" height="26" rx="6" fill="#c4005c"/><rect x="8" y="38" width="10" height="8" rx="2" fill="#8b0040"/><rect x="62" y="38" width="10" height="8" rx="2" fill="#8b0040"/><rect x="12" y="8" width="56" height="14" rx="6" fill="#ff80b0"/></svg>`,
  stredni: `<svg width="110" height="50" viewBox="0 0 110 50" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="18" width="94" height="22" rx="8" fill="#ff4d8d" opacity="0.8"/><rect x="2" y="14" width="14" height="26" rx="6" fill="#c4005c"/><rect x="94" y="14" width="14" height="26" rx="6" fill="#c4005c"/><rect x="8" y="38" width="10" height="8" rx="2" fill="#8b0040"/><rect x="92" y="38" width="10" height="8" rx="2" fill="#8b0040"/><rect x="12" y="8" width="86" height="14" rx="6" fill="#ff80b0"/></svg>`,
  velka: `<svg width="140" height="55" viewBox="0 0 140 55" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="20" width="60" height="22" rx="7" fill="#ff4d8d" opacity="0.8"/><rect x="72" y="20" width="60" height="22" rx="7" fill="#ff4d8d" opacity="0.8"/><rect x="2" y="14" width="12" height="28" rx="6" fill="#c4005c"/><rect x="66" y="14" width="12" height="28" rx="6" fill="#c4005c"/><rect x="126" y="14" width="12" height="28" rx="6" fill="#c4005c"/><rect x="8" y="40" width="10" height="10" rx="2" fill="#8b0040"/><rect x="122" y="40" width="10" height="10" rx="2" fill="#8b0040"/><rect x="12" y="8" width="116" height="14" rx="6" fill="#ff80b0"/><text x="38" y="35" font-size="8" fill="white" opacity="0.6" text-anchor="middle">U</text><text x="102" y="35" font-size="8" fill="white" opacity="0.6" text-anchor="middle">tvar</text></svg>`,
};

function renderVariants() {
  const cfg = PRICES[pType];
  const tabs = document.getElementById('variantTabs');
  const title = document.getElementById('variantTitle');
  if (cfg.variants.length <= 1) {
    document.getElementById('variantStep').style.display = 'none';
    pVariant = cfg.variants[0].key;
    return;
  }
  document.getElementById('variantStep').style.display = 'flex';
  pVariant = cfg.variants[0].key;
  const typeLabels = { auto: 'Vyberte počet sedaček', pohovka: 'Vyberte velikost pohovky', matrace: 'Vyberte počet matrací', koberec: 'Vyberte plochu' };
  title.textContent = typeLabels[pType] || 'Vyberte variantu';
  tabs.innerHTML = cfg.variants.map((v, i) =>
    `<button class="price-tab ${i===0?'active':''}" onclick="selectVariant('${v.key}',this)">${v.label}</button>`
  ).join('');

  // Pohovka illustrations
  const ilEl = document.getElementById('sofaIllustrations');
  if (pType === 'pohovka' && ilEl) {
    ilEl.style.display = 'flex';
    ilEl.innerHTML = [
      { key:'mala', label:'Malá' },
      { key:'stredni', label:'Střední' },
      { key:'velka', label:'Velká (do U)' }
    ].map(s => `
      <div onclick="selectVariant('${s.key}', document.querySelector('[onclick*=\\'${s.key}\\']'))"
        style="cursor:pointer;text-align:center;padding:0.6rem 0.8rem;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:all 0.2s"
        onmouseover="this.style.borderColor='rgba(255,77,141,0.4)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'">
        ${SOFA_SVG[s.key]}
        <div style="font-size:0.72rem;color:var(--gray);margin-top:0.3rem">${s.label}</div>
      </div>`
    ).join('');
  } else if (ilEl) {
    ilEl.style.display = 'none';
  }
}

function fmt(n) { return Math.round(n).toLocaleString('cs-CZ') + ' Kč'; }

function renderBilling() {
  const cfg = PRICES[pType];
  const d = cfg.data[pVariant]?.[pCity] || cfg.data[cfg.variants[0].key][pCity];
  const isPromo = pSold < PROMO_TOTAL;
  const promoDisc = isPromo ? 0.75 : 1;
  const mixDisc = pMix === 2 ? 0.85 : pMix === 3 ? 0.70 : pMix >= 4 ? 0.55 : 1;
  const totalDisc = promoDisc * mixDisc;

  const billings = pType === 'ozon'
    ? [{ key: 'rok', label: 'Jednorázově / ročně', price: d.rok, unit: 'Kč', save: 'Jednorázová platba' }]
    : [
        { key: 'rok', label: 'Roční předplatné', price: d.rok, unit: 'Kč / rok', save: 'Nejlepší cena — platíte jednou ročně' },
        { key: 'pol', label: 'Pololetní předplatné', price: d.pol, unit: 'Kč / půl roku', save: `celkem ${fmt(d.pol * 2)} / rok` },
        { key: 'jed', label: 'Jednorázové čištění', price: d.jed, unit: 'Kč', save: '1× čištění, ozon zdarma' },
      ];

  document.getElementById('billingCards').innerHTML = billings.map(b => {
    const promoPrice = Math.round(b.price * 0.75);
    const mixPrice = Math.round(b.price * (pMix===2?0.85:pMix===3?0.70:pMix>=4?0.55:1));
    const finalPrice = Math.round(b.price * totalDisc);
    const annualFull = b.key === 'pol' ? b.price * 2 : b.price;
    const annualFinal = b.key === 'pol' ? finalPrice * 2 : finalPrice;
    return `<div class="billing-card ${pBilling===b.key?'active':''}" onclick="selectBilling('${b.key}',this)">
      <div class="bc-type">${b.label}</div>
      ${isPromo || pMix > 1 ? `
        <div style="text-decoration:line-through;color:var(--gray);font-size:0.85rem;line-height:1.2">${fmt(b.price)}</div>
        <div class="bc-price" style="color:var(--pink);line-height:1.1">${fmt(finalPrice)}</div>
        <div class="bc-unit" style="display:flex;align-items:center;gap:6px">${b.unit}
          ${isPromo ? `<span style="background:rgba(255,77,141,0.2);color:var(--pink);font-size:0.65rem;padding:2px 7px;border-radius:50px;font-weight:700">-25%</span>` : ''}
          ${pMix>1 ? `<span style="background:rgba(74,222,128,0.15);color:#4ade80;font-size:0.65rem;padding:2px 7px;border-radius:50px;font-weight:700">mix -${pMix===2?15:pMix===3?30:45}%</span>` : ''}
        </div>
        <div class="bc-annual">celkem ${fmt(annualFinal)} / rok</div>
        <div class="bc-save">ušetříte ${fmt(annualFull - annualFinal)} / rok</div>
      ` : `
        <div class="bc-price">${fmt(b.price)}</div>
        <div class="bc-unit">${b.unit}</div>
        <div class="bc-annual">${b.save}</div>
      `}
    </div>`;
  }).join('');

  renderResult(d, totalDisc);
}

function selectBilling(billing, btn) {
  pBilling = billing;
  document.querySelectorAll('.billing-card').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const cfg = PRICES[pType];
  const d = cfg.data[pVariant]?.[pCity] || cfg.data[cfg.variants[0].key][pCity];
  const promoDisc = pSold < PROMO_TOTAL ? 0.75 : 1;
  const mixDisc = pMix === 2 ? 0.85 : pMix === 3 ? 0.70 : pMix >= 4 ? 0.55 : 1;
  renderResult(d, promoDisc * mixDisc);
}

function renderResult(d, totalDisc) {
  const cfg = PRICES[pType];
  const variantLabel = cfg.variants.find(v => v.key === pVariant)?.label || '';
  const cityLabel = { praha: 'Praha a okolí', brno: 'Brno a okolí', jihlava: 'Jihlava a okolí' }[pCity];
  const typeLabel = { auto: 'Tepování auta', pohovka: 'Tepování pohovky', koberec: 'Tepování koberce', matrace: 'Tepování matrace', ozon: 'Dezinfekce ozonem' }[pType];
  const billingLabel = { rok: 'ročně', pol: 'pololetně', jed: 'jednorázově' }[pBilling];
  const basePrice = d[pBilling] || d.rok;
  const finalPrice = Math.round(basePrice * totalDisc);

  const jedFeatures = {
    auto: ['1× čištění sedaček, koberečků a kufru', 'Čistíme u vás doma nebo u nás', 'Dezinfekce ozonem zdarma', 'Včetně dopravy', 'Platba online nebo hotově'],
    pohovka: ['1× hloubkové čištění pohovky', 'Dezinfekce ozonem zdarma', 'Včetně dopravy', 'Platba online nebo hotově'],
    koberec: ['1× tepování koberce', 'Dezinfekce ozonem zdarma', 'Nad 20 m² — zavolejte', 'Včetně dopravy', 'Platba online nebo hotově'],
    matrace: ['1× čištění matrace', 'Likvidace roztočů a bakterií', 'Dezinfekce ozonem zdarma', 'Včetně dopravy', 'Platba online nebo hotově'],
  };
  const displayFeatures = pBilling === 'jed' && jedFeatures[pType] ? jedFeatures[pType] : cfg.features;

  document.getElementById('resultPlan').textContent = `${typeLabel} — ${variantLabel} — ${cityLabel}`;
  const ul = document.getElementById('resultFeatures');

  if (pType === 'ozon' && pVariant === 'velke') {
    ul.innerHTML = '<li>Napište nám nebo zavolejte pro individuální nabídku</li>';
    document.getElementById('resultOrig').textContent = '';
    document.getElementById('resultPrice').textContent = 'Individuální';
    document.getElementById('resultSub').textContent = 'Pro prostory nad 100 m² připravíme nabídku na míru';
    document.getElementById('resultDisclaimer').style.display = 'none';
    return;
  }

  ul.innerHTML = displayFeatures.map(f => `<li>${f}</li>`).join('');

  if (totalDisc < 1) {
    document.getElementById('resultOrig').textContent = fmt(basePrice);
  } else {
    document.getElementById('resultOrig').textContent = '';
  }
  document.getElementById('resultPrice').textContent = fmt(finalPrice);

  let subText = `Platba ${billingLabel}`;
  if (pSold < PROMO_TOTAL) subText += ` · sleva 25 % (prvních 100 zákazníků)`;
  if (pMix > 1) subText += ` · sleva za kombinaci ${pMix === 2 ? '15' : pMix === 3 ? '30' : '45'} %`;
  document.getElementById('resultSub').textContent = subText;

  const disc = document.getElementById('resultDisclaimer');
  if (pType === 'auto') {
    disc.style.display = 'block';
  } else {
    disc.style.display = 'none';
  }
}

function orderCurrent() {
  pSold = Math.min(pSold + 1, PROMO_TOTAL);
  updateCounter();
  document.getElementById('objednavka').scrollIntoView({ behavior: 'smooth' });
}

// Init pricing
updateCounter();
renderVariants();
renderBilling();

// ===== KALKULAČKA =====
let kSvcMult = 1.0;
let kActiveCity = 'jih';

function kSetSvc(type, btn) {
  document.querySelectorAll('#k_svcType .kc-svc').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  kSvcMult = {pohovka:1.0,auto:1.1,koberec:0.85,matrace:0.9,ozon:0.75}[type];
  kcalc();
}

function kShowCity(city, btn) {
  kActiveCity = city;
  document.querySelectorAll('.kc-ctab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['jih','brno','pra'].forEach(c => {
    document.getElementById('kcc_'+c).style.display = c===city ? '' : 'none';
  });
}

function kfmt(n) { return Math.round(n).toLocaleString('cs-CZ') + ' Kč'; }
function kr50(v) { return Math.round(v / 50) * 50; }

function kCostCards(city, transport, mA, cA, chem, labor, ovhd, total, price) {
  return `<div class="kc-result-grid">
    <div class="kc-card"><div class="kc-clabel">Doprava (tam+zpět)</div><div class="kc-cval">${kfmt(transport)}</div></div>
    <div class="kc-card"><div class="kc-clabel">Amortizace stroje</div><div class="kc-cval">${kfmt(mA)}</div></div>
    <div class="kc-card"><div class="kc-clabel">Amortizace auta</div><div class="kc-cval">${kfmt(cA)}</div></div>
    <div class="kc-card"><div class="kc-clabel">Prostředky</div><div class="kc-cval">${kfmt(chem)}</div></div>
    <div class="kc-card"><div class="kc-clabel">Práce</div><div class="kc-cval">${kfmt(labor)}</div></div>
    <div class="kc-card"><div class="kc-clabel">Režie</div><div class="kc-cval">${kfmt(ovhd)}</div></div>
    <div class="kc-card pink"><div class="kc-clabel">Náklad celkem</div><div class="kc-cval">${kfmt(total)}</div><div class="kc-csub">s marží: ${kfmt(price)} / čištění</div></div>
  </div>
  <table class="kc-table">
    <thead><tr><th>Typ předplatného</th><th>Běžná cena</th><th>Prvních 100 zákazníků</th><th>Úspora zákazníka</th></tr></thead>
    <tbody id="ktbody_${city}"></tbody>
  </table>`;
}

function kTableRows(price, disc) {
  const cleanings = 3;
  const annual = price * cleanings;
  const quarterly = annual / 4 * 1.05;
  const monthly = annual / 12 * 1.10;
  const a=kr50(annual), q=kr50(quarterly), m=kr50(monthly);
  const ad=kr50(annual*(1-disc)), qd=kr50(quarterly*(1-disc)), md=kr50(monthly*(1-disc));
  const pct = Math.round(disc*100);
  return { rows: `
    <tr><td class="kpink">Roční platba</td><td>${kfmt(a)}</td><td>${kfmt(ad)} <span class="kc-badge">-${pct}%</span></td><td class="kgreen">ušetří ${kfmt(a-ad)}</td></tr>
    <tr><td class="kpink">Čtvrtletní platba</td><td>${kfmt(q)} / čtvrt.</td><td>${kfmt(qd)} / čtvrt. <span class="kc-badge">-${pct}%</span></td><td class="kgreen">ušetří ${kfmt((q-qd)*4)} / rok</td></tr>
    <tr><td class="kpink">Měsíční platba</td><td>${kfmt(m)} / měs.</td><td>${kfmt(md)} / měs. <span class="kc-badge">-${pct}%</span></td><td class="kgreen">ušetří ${kfmt((m-md)*12)} / rok</td></tr>
  `, annual: a };
}

function kcalc() {
  const machine = +document.getElementById('k_machine').value;
  const mlife   = +document.getElementById('k_mlife').value;
  const service = +document.getElementById('k_service').value;
  const car     = +document.getElementById('k_car').value;
  const clife   = +document.getElementById('k_clife').value;
  const oldcar  = +document.getElementById('k_oldcar').value;
  const fuel    = +document.getElementById('k_fuel').value;
  const chem    = +document.getElementById('k_chem').value;
  const wage    = +document.getElementById('k_wage').value;
  const time    = +document.getElementById('k_time').value;
  const overhead= +document.getElementById('k_overhead').value;
  const cust    = +document.getElementById('k_cust').value;
  const margin  = +document.getElementById('k_margin').value / 100;
  const disc    = +document.getElementById('k_disc').value / 100;
  const kmJih   = +document.getElementById('k_km_jih').value;
  const kmBrno  = +document.getElementById('k_km_brno').value;
  const kmPra   = +document.getElementById('k_km_pra').value;

  // Update display values
  document.getElementById('kv_km_jih').textContent = kmJih + ' km';
  document.getElementById('kv_km_brno').textContent = kmBrno + ' km';
  document.getElementById('kv_km_pra').textContent = kmPra + ' km';
  document.getElementById('kv_jih_total').textContent = (kmJih*2) + ' km';
  document.getElementById('kv_brno_total').textContent = (kmBrno*2) + ' km';
  document.getElementById('kv_pra_total').textContent = (kmPra*2) + ' km';
  document.getElementById('kv_machine').textContent = Math.round(machine).toLocaleString('cs-CZ') + ' Kč';
  document.getElementById('kv_mlife').textContent = mlife + ' let';
  document.getElementById('kv_service').textContent = Math.round(service).toLocaleString('cs-CZ') + ' Kč';
  document.getElementById('kv_car').textContent = Math.round(car).toLocaleString('cs-CZ') + ' Kč';
  document.getElementById('kv_clife').textContent = clife + ' let';
  document.getElementById('kv_oldcar').textContent = Math.round(oldcar).toLocaleString('cs-CZ') + ' Kč';
  document.getElementById('kv_fuel').textContent = fuel.toFixed(1).replace('.',',') + ' Kč';
  document.getElementById('kv_chem').textContent = Math.round(chem).toLocaleString('cs-CZ') + ' Kč';
  document.getElementById('kv_wage').textContent = Math.round(wage).toLocaleString('cs-CZ') + ' Kč';
  document.getElementById('kv_time').textContent = time + ' hod';
  document.getElementById('kv_overhead').textContent = Math.round(overhead).toLocaleString('cs-CZ') + ' Kč';
  document.getElementById('kv_cust').textContent = Math.round(cust) + ' zákazníků';
  document.getElementById('kv_margin').textContent = Math.round(margin*100) + ' %';
  document.getElementById('kv_disc').textContent = Math.round(disc*100) + ' %';

  const cleanings = 3;
  const mA  = machine / mlife / (cust * cleanings || 1);
  const cA  = (car - oldcar) / clife / (cust * cleanings || 1);
  const svc = service / (cust * cleanings || 1);
  const labor = wage * time;
  const ovhd = (overhead * 12) / (cust * cleanings || 1);

  function cityData(km) {
    const transport = km * 2 * fuel;
    const total = (transport + mA + cA + svc + chem + labor + ovhd) * kSvcMult;
    const price = total / (1 - margin);
    return { transport, total, price };
  }

  const jih  = cityData(kmJih);
  const brno = cityData(kmBrno);
  const pra  = cityData(kmPra);

  // Render cost cards + tables
  document.getElementById('kcc_jih').innerHTML  = kCostCards('jih',  jih.transport,  mA, cA, chem, labor, ovhd, jih.total,  jih.price);
  document.getElementById('kcc_brno').innerHTML = kCostCards('brno', brno.transport, mA, cA, chem, labor, ovhd, brno.total, brno.price);
  document.getElementById('kcc_pra').innerHTML  = kCostCards('pra',  pra.transport,  mA, cA, chem, labor, ovhd, pra.total,  pra.price);

  const jihR  = kTableRows(jih.price,  disc);
  const brnoR = kTableRows(brno.price, disc);
  const praR  = kTableRows(pra.price,  disc);
  const tbJih = document.querySelector('#kcc_jih #ktbody_jih');
  const tbBrno = document.querySelector('#kcc_brno #ktbody_brno');
  const tbPra = document.querySelector('#kcc_pra #ktbody_pra');
  if(tbJih) tbJih.innerHTML = jihR.rows;
  if(tbBrno) tbBrno.innerHTML = brnoR.rows;
  if(tbPra) tbPra.innerHTML = praR.rows;

  // Reapply city visibility
  ['jih','brno','pra'].forEach(c => {
    document.getElementById('kcc_'+c).style.display = c===kActiveCity ? '' : 'none';
  });

  document.getElementById('k_discNote').innerHTML =
    `💡 Sleva <strong style="color:var(--pink)">${Math.round(disc*100)} %</strong> platí pro prvních 100 zákazníků napříč všemi městy. ` +
    `Aktuálně: <strong style="color:var(--white)">${Math.round(cust)} zákazníků</strong> — ` +
    (cust <= 100 ? 'promo stále aktivní, všichni zákazníci mají slevu.' : 'promo naplněno, noví zákazníci platí plnou cenu.');

  document.getElementById('k_amortNote').innerHTML =
    `🚗 Doprava na čištění: Jihlava ${kfmt(jih.transport)}, Brno ${kfmt(brno.transport)}, Praha ${kfmt(pra.transport)}. ` +
    `Amortizace stroje ${kfmt(mA)} + auta ${kfmt(cA)} je rozložena na všechny zákazníky — čím více zákazníků, tím nižší náklad na čištění.`;
}

kcalc();

// ===== SPLASH =====
const spMessages = [
  "Ahoj! Vítám vás na stránkách <strong style='color:#ff4d8d'>Bestfive Clean</strong>. 👋",
  "Níže si vyberte <strong style='color:#ff4d8d'>předplatné</strong> nebo <strong style='color:#ff4d8d'>jednorázovou objednávku</strong> — máme plány pro auto, pohovku, koberec i matraci. 🛋️🚗",
  "Platit můžete <strong style='color:#ff4d8d'>hotově i kartou</strong>, jak vám to lépe vyhovuje. 💳💵",
  "A kdybyste si nevěděli rady, určitě neváhejte <strong style='color:#ff4d8d'>zavolat</strong> — rádi poradíme! 📞",
];

function splashSkip() { spShowAll(); }
function splashEnter() {
  document.getElementById('splash').classList.add('hiding');
  setTimeout(() => document.getElementById('splash').style.display='none', 650);
}

function spShowSecond() {
  const el = document.getElementById('spText');
  const btns = document.getElementById('spBtns');
  document.getElementById('spFace').classList.add('speaking');
  document.getElementById('spWave').classList.remove('hidden');
  el.innerHTML = `
    <span style="display:block;margin-bottom:0.6rem">Vyberte si <strong style="color:var(--pink)">předplatné</strong> nebo <strong style="color:var(--pink)">jednorázovou objednávku</strong>. 🧹</span>
    <span style="display:block;margin-bottom:0.6rem">Pokud si vyberete předplatné, platíte až po prvním čištění. Zvolíte si sami — ročně nebo pololetně. Přijedeme 2× ročně. 💳</span>
    <span style="display:block">Měsíc před plánovaným čištěním vám přijde na <strong style="color:var(--pink)">e-mail i SMS</strong> odkaz na kalendář, kde si vyberete den i čas. 📅</span>
  `;
  btns.innerHTML = `<button class="sp-btn sp-btn-primary" onclick="splashEnter()">Vstoupit na web →</button>`;
  setTimeout(() => {
    document.getElementById('spFace').classList.remove('speaking');
    document.getElementById('spWave').classList.add('hidden');
  }, 2000);
}

function spShowAll() {
  const el = document.getElementById('spText');
  const dots = document.getElementById('spDots');
  const face = document.getElementById('spFace');
  const wave = document.getElementById('spWave');
  dots.style.display = 'none';
  el.style.display = 'inline';
  el.innerHTML = '';
  face.classList.add('speaking');
  wave.classList.remove('hidden');

  // Build full text with all messages
  const fullHtml = spMessages.map(m => `<span style="display:block;margin-bottom:0.6rem">${m}</span>`).join('');
  // Type out plain text but preserve HTML
  let i = 0;
  const chars = fullHtml;
  function typeNext() {
    if (i < chars.length) {
      // Skip through HTML tags instantly
      if (chars[i] === '<') {
        const end = chars.indexOf('>', i);
        el.innerHTML = chars.slice(0, end + 1);
        i = end + 1;
      } else {
        i++;
        el.innerHTML = chars.slice(0, i);
      }
      setTimeout(typeNext, i < chars.length && chars[i] !== '<' ? 18 : 0);
    } else {
      face.classList.remove('speaking');
      wave.classList.add('hidden');
      document.getElementById('spBtns').innerHTML =
        `<button class="sp-btn sp-btn-primary" onclick="spShowSecond()">Vstoupit na web →</button>`;
    }
  }
  typeNext();
}
document.getElementById('spDotNav').innerHTML = '';
setTimeout(() => spShowAll(), 500);

// ===== FORM SUBMIT =====
function submitForm() {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const city = document.getElementById('city').value;
  const service = document.getElementById('service').value;
  if (!name || !phone || !email || !city || !service) {
    alert('Vyplňte prosím alespoň jméno, telefon, e-mail, město a co chcete vyčistit.'); return;
  }
  document.getElementById('form-content').style.display = 'none';
  document.getElementById('success').style.display = 'block';
}
