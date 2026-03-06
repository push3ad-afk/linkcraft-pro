import { useState } from 'react';
import './App.css';

// ─── CONFIG ────────────────────────────────────────────
// Replace with your actual PayPal.me link
const PAYPAL_LINK = 'https://paypal.me/AlpSen254/9';
const PRO_PRICE = '$9';
// ───────────────────────────────────────────────────────

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'editor', 'impressum', 'privacy'
  const [showModal, setShowModal] = useState(false);
  const [proUnlocked, setProUnlocked] = useState(() => {
    return localStorage.getItem('linkcraft_pro') === 'true';
  });

  const [profile, setProfile] = useState({
    name: 'Alex Developer',
    description: 'Building tools for the future. AI Enthusiast & Frontend dev.',
    avatar: 'https://i.pravatar.cc/150?img=11',
    theme: 'light',
  });

  const [links, setLinks] = useState([
    { id: 1, title: '🌐 My Portfolio', url: 'https://example.com' },
    { id: 2, title: '🐦 Follow me on X', url: 'https://x.com' },
    { id: 3, title: '💜 Sponsor my work', url: 'https://github.com/sponsors' },
  ]);

  const [copied, setCopied] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLink = () => {
    setLinks([...links, { id: Date.now(), title: 'New Link', url: 'https://' }]);
  };

  const handleLinkChange = (id, field, value) => {
    setLinks(links.map((link) => (link.id === id ? { ...link, [field]: value } : link)));
  };

  const handleDeleteLink = (id) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const isProTheme = (theme) => theme === 'glass' || theme === 'cyberpunk';

  const handleThemeSelect = (theme) => {
    if (isProTheme(theme) && !proUnlocked) {
      setShowModal(true);
      return;
    }
    setProfile({ ...profile, theme });
  };

  const handleUnlockPro = () => {
    // Open PayPal in new tab
    window.open(PAYPAL_LINK, '_blank');
    // Trust-based unlock after payment
    localStorage.setItem('linkcraft_pro', 'true');
    setProUnlocked(true);
    setShowModal(false);
  };

  const generateExportCode = () => {
    if (isProTheme(profile.theme) && !proUnlocked) {
      setShowModal(true);
      return;
    }

    const css = `
@import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');
:root {
  --bg:#fff;--text:#1a1a1a;--sub:#666;--lbg:#f3f4f6;--lt:#1a1a1a;--lb:transparent;--ls:0 4px 6px -1px rgba(0,0,0,.1);--lh:#e5e7eb;
}
[data-theme="midnight"]{--bg:#0f172a;--text:#f8fafc;--sub:#cbd5e1;--lbg:#1e293b;--lt:#f8fafc;--lb:#334155;--ls:0 10px 15px -3px rgba(0,0,0,.5);--lh:#334155}
[data-theme="glass"]{--bg:#4158d0;background-image:linear-gradient(43deg,#4158D0 0%,#C850C0 46%,#FFCC70 100%);--text:#fff;--sub:rgba(255,255,255,.8);--lbg:rgba(255,255,255,.18);--lt:#fff;--lb:rgba(255,255,255,.3);--ls:0 8px 32px rgba(31,38,135,.37);--lh:rgba(255,255,255,.28)}
[data-theme="cyberpunk"]{--bg:#0d0221;--text:#00ffcc;--sub:#ff007f;--lbg:rgba(0,255,204,.05);--lt:#00ffcc;--lb:#00ffcc;--ls:0 0 15px rgba(0,255,204,.3);--lh:rgba(0,255,204,.12)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.c{max-width:480px;margin:0 auto;padding:48px 24px;text-align:center}
.av{width:96px;height:96px;border-radius:50%;object-fit:cover;margin-bottom:20px;border:3px solid rgba(255,255,255,.15);box-shadow:0 8px 24px rgba(0,0,0,.15)}
h1{font-family:'Clash Display',sans-serif;font-size:26px;margin-bottom:8px}
.d{color:var(--sub);margin-bottom:32px;line-height:1.6;font-size:15px}
a.l{display:block;width:100%;padding:16px 24px;margin-bottom:14px;background:var(--lbg);color:var(--lt);border:1px solid var(--lb);border-radius:12px;text-decoration:none;font-weight:600;transition:all .3s;box-shadow:var(--ls);box-sizing:border-box;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
a.l:hover{transform:translateY(-2px);filter:brightness(1.1)}
.f{margin-top:48px;font-size:11px;color:var(--sub);opacity:.5}
.f a{color:inherit}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${profile.name} | Links</title>
<style>${css}</style>
</head>
<body data-theme="${profile.theme}">
<div class="c">
<img src="${profile.avatar}" alt="${profile.name}" class="av">
<h1>${profile.name}</h1>
<p class="d">${profile.description}</p>
${links.map((l) => `<a href="${l.url}" class="l" target="_blank" rel="noopener noreferrer">${l.title}</a>`).join('\n')}
<p class="f">Built with <a href="${window.location.href}" target="_blank">LinkCraft Pro</a></p>
</div>
</body>
</html>`;

    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ═══════════ LANDING PAGE ═══════════
  if (view === 'landing') {
    return (
      <>
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-logo">LinkCraft Pro</div>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li>
              <button className="btn btn-primary btn-sm" onClick={() => setView('editor')}>
                Open Editor →
              </button>
            </li>
          </ul>
        </nav>

        {/* Hero */}
        <section className="hero">
          <div className="hero-bg-orb orb-1" />
          <div className="hero-bg-orb orb-2" />
          <div className="hero-bg-orb orb-3" />

          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge animate-fade-up">
                <span className="dot" />
                Free & Open
              </div>

              <h1 className="hero-title animate-fade-up-delay-1">
                Your Links.<br />
                <span className="gradient-text">Beautifully Crafted.</span>
              </h1>

              <p className="hero-description animate-fade-up-delay-2">
                Create a stunning, one-page link hub in seconds. No sign-up needed.
                Choose from premium themes and export pure HTML you own forever.
              </p>

              <div className="hero-cta animate-fade-up-delay-3">
                <button className="btn btn-hero" onClick={() => setView('editor')}>
                  Start Building — Free
                </button>
                <a href="#pricing" className="btn btn-outline-hero">
                  View Pricing
                </a>
              </div>

              <div className="hero-stats animate-fade-up-delay-3">
                <div className="hero-stat">
                  <div className="stat-value">100%</div>
                  <div className="stat-label">Free to start</div>
                </div>
                <div className="hero-stat">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Sign-ups needed</div>
                </div>
                <div className="hero-stat">
                  <div className="stat-value">∞</div>
                  <div className="stat-label">You own the code</div>
                </div>
              </div>
            </div>

            {/* Hero Demo Phone */}
            <div className="hero-demo animate-slide-in">
              <div className="smartphone-frame">
                <div className="smartphone-notch" />
                <div className="smartphone-screen" data-theme="glass">
                  <div className="bio-content">
                    <img src="https://i.pravatar.cc/150?img=32" alt="Demo" className="bio-avatar" />
                    <h2 className="bio-title">Sarah Chen</h2>
                    <p className="bio-description">Designer & Content Creator based in Berlin 🇩🇪</p>
                    <div className="links-container">
                      <a href="#" className="bio-link" onClick={(e) => e.preventDefault()}>🎨 Design Portfolio</a>
                      <a href="#" className="bio-link" onClick={(e) => e.preventDefault()}>📸 Instagram</a>
                      <a href="#" className="bio-link" onClick={(e) => e.preventDefault()}>🎬 YouTube Channel</a>
                      <a href="#" className="bio-link" onClick={(e) => e.preventDefault()}>☕ Buy me a coffee</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features-section" id="features">
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything you need. Nothing you don't.</h2>
          <p className="section-desc">
            No accounts, no databases, no monthly fees. Just a beautiful link page
            you can host anywhere for free.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3 className="feature-title">Instant Preview</h3>
              <p className="feature-desc">
                See your changes in real-time on a gorgeous phone mockup. What you see is what you get.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🎨</span>
              <h3 className="feature-title">Premium Themes</h3>
              <p className="feature-desc">
                From minimalist to cyberpunk — choose a vibe that matches your brand perfectly.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📦</span>
              <h3 className="feature-title">Export Pure HTML</h3>
              <p className="feature-desc">
                One click and you get a self-contained HTML file. Host it on GitHub Pages, Vercel, or anywhere.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔒</span>
              <h3 className="feature-title">No Data Collection</h3>
              <p className="feature-desc">
                We don't store anything. Your data stays in your browser. Privacy by design.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📱</span>
              <h3 className="feature-title">Mobile First</h3>
              <p className="feature-desc">
                Every theme is perfectly optimized for mobile screens where 90% of your visitors come from.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🚀</span>
              <h3 className="feature-title">Zero Hosting Cost</h3>
              <p className="feature-desc">
                A static HTML file means no server needed. Host for free on GitHub Pages or Netlify.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="pricing-section" id="pricing">
          <div className="section-label">Pricing</div>
          <h2 className="section-title">Simple. Transparent. Fair.</h2>
          <p className="section-desc">
            Start free. Unlock premium themes for a one-time payment. No subscriptions.
          </p>

          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-label">Free</div>
              <div className="pricing-price">
                <span className="currency">$</span>0
              </div>
              <p className="pricing-desc">Perfect for getting started with a clean, professional link page.</p>
              <ul className="pricing-features">
                <li><span className="check">✓</span> Unlimited links</li>
                <li><span className="check">✓</span> Minimalist theme</li>
                <li><span className="check">✓</span> Midnight theme</li>
                <li><span className="check">✓</span> HTML export</li>
                <li><span className="check">✓</span> Mobile responsive</li>
                <li><span className="lock">🔒</span> Glassmorphism theme</li>
                <li><span className="lock">🔒</span> Cyberpunk theme</li>
              </ul>
              <div className="pricing-cta">
                <button className="btn btn-secondary" onClick={() => setView('editor')}>
                  Start Free
                </button>
              </div>
            </div>

            <div className="pricing-card featured">
              <div className="pricing-label">
                Pro <span className="pricing-badge">Best Value</span>
              </div>
              <div className="pricing-price">
                <span className="currency">$</span>9
                <span className="period"> one-time</span>
              </div>
              <p className="pricing-desc">Unlock all premium themes forever. One payment, no strings attached.</p>
              <ul className="pricing-features">
                <li><span className="check">✓</span> Everything in Free</li>
                <li><span className="check">✓</span> Glassmorphism theme</li>
                <li><span className="check">✓</span> Cyberpunk theme</li>
                <li><span className="check">✓</span> Future themes included</li>
                <li><span className="check">✓</span> Priority support</li>
              </ul>
              <div className="pricing-cta">
                <button className="btn btn-primary" onClick={() => { setView('editor'); setShowModal(true); }}>
                  Unlock Pro — {PRO_PRICE}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>© 2026 LinkCraft Pro. Built with 💜 and zero hosting costs.</p>
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); setView('impressum'); }}>Impressum</a>
            <span>·</span>
            <a href="#" onClick={(e) => { e.preventDefault(); setView('privacy'); }}>Datenschutz</a>
          </div>
        </footer>

        {/* PayPal Modal */}
        {showModal && (
          <PayPalModal onClose={() => setShowModal(false)} onUnlock={handleUnlockPro} />
        )}
      </>
    );
  }

  // ═══════════ IMPRESSUM ═══════════
  if (view === 'impressum') {
    return <ImpressumPage onBack={() => setView('landing')} />;
  }

  // ═══════════ DATENSCHUTZ ═══════════
  if (view === 'privacy') {
    return <PrivacyPage onBack={() => setView('landing')} />;
  }

  // ═══════════ EDITOR VIEW ═══════════
  return (
    <div className="editor-view">
      {/* Editor Panel */}
      <div className="editor-panel">
        <div className="editor-header">
          <div className="editor-title" onClick={() => setView('landing')}>LinkCraft Pro</div>
          <button className="back-btn" onClick={() => setView('landing')}>
            ← Back
          </button>
        </div>

        {/* Profile */}
        <div className="section-card">
          <div className="section-head">Profile</div>
          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              name="name"
              className="input-field"
              value={profile.name}
              onChange={handleProfileChange}
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <input
              type="text"
              name="description"
              className="input-field"
              value={profile.description}
              onChange={handleProfileChange}
            />
          </div>
          <div className="form-group">
            <label>Avatar URL</label>
            <input
              type="text"
              name="avatar"
              className="input-field"
              value={profile.avatar}
              onChange={handleProfileChange}
            />
          </div>
        </div>

        {/* Themes */}
        <div className="section-card">
          <div className="section-head">
            Theme
            {proUnlocked && <span style={{ fontSize: '12px', color: '#22c55e' }}>✓ Pro Unlocked</span>}
          </div>
          <div className="theme-grid">
            <button
              className={`theme-btn theme-light ${profile.theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeSelect('light')}
            >
              Minimalist
            </button>
            <button
              className={`theme-btn theme-midnight ${profile.theme === 'midnight' ? 'active' : ''}`}
              onClick={() => handleThemeSelect('midnight')}
            >
              Midnight
            </button>
            <button
              className={`theme-btn theme-glass ${profile.theme === 'glass' ? 'active' : ''}`}
              onClick={() => handleThemeSelect('glass')}
            >
              {!proUnlocked && <span className="pro-badge">PRO</span>}
              Glassmorphism
            </button>
            <button
              className={`theme-btn theme-cyberpunk ${profile.theme === 'cyberpunk' ? 'active' : ''}`}
              onClick={() => handleThemeSelect('cyberpunk')}
            >
              {!proUnlocked && <span className="pro-badge">PRO</span>}
              Cyberpunk
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="section-card">
          <div className="section-head">Your Links</div>
          {links.map((link) => (
            <div key={link.id} className="link-editor-item">
              <button onClick={() => handleDeleteLink(link.id)} className="delete-btn">✕</button>
              <input
                type="text"
                className="input-field"
                value={link.title}
                placeholder="Link Title"
                onChange={(e) => handleLinkChange(link.id, 'title', e.target.value)}
              />
              <input
                type="url"
                className="input-field"
                value={link.url}
                placeholder="URL (https://...)"
                onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
              />
            </div>
          ))}
          <button onClick={handleAddLink} className="add-link-btn">+ Add New Link</button>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <button className="btn btn-primary" onClick={generateExportCode}>
            {copied ? '✓ Copied!' : '📋 Export HTML'}
          </button>
          {!proUnlocked && (
            <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
              ✨ Unlock Pro
            </button>
          )}
        </div>
      </div>

      {/* Preview Panel */}
      <div className="preview-panel">
        <div className="preview-bg-orb orb-a" />
        <div className="preview-bg-orb orb-b" />
        <div className="smartphone-frame">
          <div className="smartphone-notch" />
          <div className="smartphone-screen" data-theme={profile.theme}>
            <div className="bio-content">
              {profile.avatar && (
                <img src={profile.avatar} alt="Avatar" className="bio-avatar" />
              )}
              <h2 className="bio-title">{profile.name}</h2>
              <p className="bio-description">{profile.description}</p>
              <div className="links-container">
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bio-link"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PayPal Modal */}
      {showModal && (
        <PayPalModal onClose={() => setShowModal(false)} onUnlock={handleUnlockPro} />
      )}
    </div>
  );
}

// ═══════════ PAYPAL MODAL COMPONENT ═══════════
function PayPalModal({ onClose, onUnlock }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-icon">✨</div>
        <h3 className="modal-title">Unlock Pro Themes</h3>
        <p className="modal-desc">
          Get access to Glassmorphism, Cyberpunk, and all future premium themes
          with a single one-time payment. No subscription, no hidden fees.
        </p>
        <div className="modal-price">{PRO_PRICE}</div>
        <button className="paypal-btn" onClick={onUnlock}>
          🅿️ Pay with PayPal
        </button>
        <p className="modal-note">
          Clicking will open PayPal in a new tab. After payment, your Pro access
          is unlocked instantly. One-time payment — forever access.
        </p>
      </div>
    </div>
  );
}

// ═══════════ IMPRESSUM PAGE ═══════════
function ImpressumPage({ onBack }) {
  return (
    <div className="legal-page">
      <nav className="navbar">
        <div className="nav-logo" onClick={onBack} style={{ cursor: 'pointer' }}>LinkCraft Pro</div>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>← Zurück</button>
      </nav>
      <div className="legal-content">
        <h1>Impressum</h1>
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          Alp Sen<br />
          Scheibenstr. 8<br />
          83278 Traunstein<br />
          Deutschland
        </p>

        <h2>Kontakt</h2>
        <p>
          E-Mail: alp@linkcraft-pro.com
        </p>

        <h2>Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
          Wird nachgereicht / Kleinunternehmerregelung gem. § 19 UStG
        </p>

        <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>
          Alp Sen<br />
          Scheibenstr. 8<br />
          83278 Traunstein
        </p>

        <h2>Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer"> https://ec.europa.eu/consumers/odr/</a>.<br />
          Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </p>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <h2>Haftung für Inhalte</h2>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
          Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
          Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen.
        </p>
      </div>
    </div>
  );
}

// ═══════════ DATENSCHUTZ PAGE ═══════════
function PrivacyPage({ onBack }) {
  return (
    <div className="legal-page">
      <nav className="navbar">
        <div className="nav-logo" onClick={onBack} style={{ cursor: 'pointer' }}>LinkCraft Pro</div>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>← Zurück</button>
      </nav>
      <div className="legal-content">
        <h1>Datenschutzerklärung</h1>

        <h2>1. Datenschutz auf einen Blick</h2>
        <h3>Allgemeine Hinweise</h3>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
          personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
        </p>

        <h3>Datenerfassung auf dieser Website</h3>
        <p>
          <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
          Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber:
          Alp Sen, Scheibenstr. 8, 83278 Traunstein, Deutschland.
        </p>

        <h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>
        <h3>Datenschutz</h3>
        <p>
          Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
          Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen
          Datenschutzvorschriften sowie dieser Datenschutzerklärung.
        </p>

        <h3>Keine Datenerhebung durch die Anwendung</h3>
        <p>
          <strong>LinkCraft Pro ist eine vollständig clientseitige Anwendung.</strong> Das bedeutet:
        </p>
        <ul>
          <li>Es werden <strong>keine personenbezogenen Daten</strong> an unsere Server übermittelt.</li>
          <li>Es werden <strong>keine Cookies</strong> gesetzt.</li>
          <li>Es gibt <strong>keine Nutzerregistrierung</strong> und <strong>kein Tracking</strong>.</li>
          <li>Alle Daten, die Sie in den Editor eingeben (Name, Bio, Links), verbleiben
            ausschließlich in Ihrem Browser (localStorage) und werden zu keinem Zeitpunkt
            an Dritte übertragen.</li>
          <li>Es werden <strong>keine Analytics-Tools</strong> (Google Analytics o.ä.) eingesetzt.</li>
        </ul>

        <h2>3. Zahlungsabwicklung</h2>
        <p>
          Für den Kauf der Pro-Version wird der Nutzer zu <strong>PayPal</strong> (PayPal (Europe)
          S.à r.l. et Cie, S.C.A.) weitergeleitet. Die Zahlungsabwicklung erfolgt ausschließlich
          über PayPal. Wir erhalten dabei lediglich eine Zahlungsbestätigung. Die Datenschutz­bestimmungen
          von PayPal finden Sie unter:{' '}
          <a href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer">
            paypal.com/de/privacy
          </a>.
        </p>

        <h2>4. Hosting</h2>
        <p>
          Diese Website wird gehostet von Surge.sh / GitHub Pages. Beim Besuch der Website
          erfasst der Hosting-Anbieter automatisch in sogenannten Server-Logfiles Informationen,
          die Ihr Browser übermittelt (z.B. IP-Adresse, Browsertyp, Zeitpunkt des Zugriffs).
          Diese Daten werden nicht mit anderen Datenquellen zusammengeführt.
        </p>

        <h2>5. Ihre Rechte</h2>
        <p>
          Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten
          personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung
          sowie ein Recht auf Berichtigung oder Löschung dieser Daten. Da wir jedoch keine
          personenbezogenen Daten speichern, entfällt dies in der Praxis.
        </p>

        <p style={{ marginTop: '40px', color: 'var(--text-muted)', fontSize: '13px' }}>
          Stand: März 2026
        </p>
      </div>
    </div>
  );
}

export default App;
