import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './ByteValue.css'

/* Intersection observer hook for scroll reveals */
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* Floating decorative gradient blob */
function FloatingShape({ style, delay = 0 }) {
  return <div className="bv-float-shape" style={{ animationDelay: `${delay}s`, ...style }} />
}

/* Rotating text badge for hero corner */
function RotatingBadge({ text, center, size = 96 }) {
  const cx = size / 2
  const radius = Math.round(cx * 0.73)
  return (
    <div className="bv-rot-badge" style={{ width: size, height: size }}>
      <div className="bv-rot-badge-ring">
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          <defs>
            <path id="bvcircle" d={`M ${cx},${cx} m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`} />
          </defs>
          <text fontSize="8.5" letterSpacing="2.4" fill="var(--bv-muted)">
            <textPath href="#bvcircle">{text}</textPath>
          </text>
        </svg>
      </div>
      <div className="bv-rot-badge-center" style={{ width: Math.round(size * 0.42), height: Math.round(size * 0.42) }}>{center}</div>
    </div>
  )
}

/* Numbered section label */
function SectionLabel({ num, total, label }) {
  return (
    <div className="bv-section-label">
      <span className="bv-section-num">{String(num).padStart(2, '0')}</span>
      <span className="bv-section-sep">OF {String(total).padStart(2, '0')}</span>
      <span className="bv-section-name">{label}</span>
    </div>
  )
}

/* Main hero dashboard visual — layered 3D card stack */
/* Count-up hook — animates value from 0 → target on mount */
function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

function fmtRupees(n) {
  return '₹' + n.toLocaleString('en-IN')
}

/* View 1 — Payout Breakdown snapshot */
function ViewPayout() {
  const netOrderValue = useCountUp(289384, 1400)
  const platformFee = useCountUp(64138, 1400)
  const govtTaxes = useCountUp(25213, 1400)
  const adsPromo = useCountUp(36476, 1400)
  const finalPayout = useCountUp(160073, 1700)
  return (
    <div className="mp-view mp-view--payout">
      <div className="mp-view-head">
        <div>
          <div className="mp-view-title">Payout Breakdown</div>
          <div className="mp-view-sub">1 Jun – 30 Jun</div>
        </div>
        <span className="mp-tag mp-tag--zomato">Zomato</span>
      </div>

      <div className="mp-stat-grid">
        <div className="mp-stat mp-stat--net">
          <div className="mp-stat-label">NET ORDER VALUE</div>
          <div className="mp-stat-value">{fmtRupees(netOrderValue)}</div>
          <div className="mp-stat-badge mp-stat-badge--up">↑ Retained</div>
        </div>
        <div className="mp-stat mp-stat--fee">
          <div className="mp-stat-label">PLATFORM FEE</div>
          <div className="mp-stat-value">{fmtRupees(platformFee)}</div>
          <div className="mp-stat-badge mp-stat-badge--down">22.2% of rev</div>
        </div>
        <div className="mp-stat mp-stat--tax">
          <div className="mp-stat-label">GOVT. TAXES</div>
          <div className="mp-stat-value">{fmtRupees(govtTaxes)}</div>
          <div className="mp-stat-badge mp-stat-badge--tax">8.7% of rev</div>
        </div>
        <div className="mp-stat mp-stat--ads">
          <div className="mp-stat-label">ADS & PROMO</div>
          <div className="mp-stat-value">{fmtRupees(adsPromo)}</div>
          <div className="mp-stat-badge mp-stat-badge--ads">12.6% of rev</div>
        </div>
      </div>

      <div className="mp-comp">
        <div className="mp-comp-head">
          <span className="mp-comp-title">Where the money went</span>
          <span className="mp-comp-total">of ₹2,89,384</span>
        </div>
        <div className="mp-comp-bar" role="img" aria-label="Composition of gross revenue">
          <span className="mp-comp-seg mp-comp-seg--net" style={{ width: '43.2%' }} />
          <span className="mp-comp-seg mp-comp-seg--fee" style={{ width: '22.2%' }} />
          <span className="mp-comp-seg mp-comp-seg--ads" style={{ width: '12.6%' }} />
          <span className="mp-comp-seg mp-comp-seg--tax" style={{ width: '8.7%' }} />
          <span className="mp-comp-seg mp-comp-seg--other" style={{ width: '13.3%' }} />
        </div>
        <div className="mp-comp-legend">
          <span className="mp-comp-item"><i className="mp-comp-sw mp-comp-sw--net" />Net 43.2%</span>
          <span className="mp-comp-item"><i className="mp-comp-sw mp-comp-sw--fee" />Fee 22.2%</span>
          <span className="mp-comp-item"><i className="mp-comp-sw mp-comp-sw--ads" />Ads 12.6%</span>
          <span className="mp-comp-item"><i className="mp-comp-sw mp-comp-sw--tax" />Tax 8.7%</span>
        </div>
      </div>

      <div className="mp-final">
        <div className="mp-final-topline" />
        <div className="mp-final-left">
          <div className="mp-final-label">FINAL NET PAYOUT</div>
          <div className="mp-final-value">{fmtRupees(finalPayout)}</div>
          <div className="mp-final-hint">43.2% retained</div>
        </div>
        <div className="mp-donut">
          <svg viewBox="0 0 60 60" width="60" height="60">
            <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" />
            <circle
              cx="30" cy="30" r="24" fill="none" stroke="#00BF8F" strokeWidth="6"
              strokeLinecap="round" strokeDasharray="150.8"
              strokeDashoffset="85.7"
              transform="rotate(-90 30 30)"
              className="mp-donut-arc"
            />
          </svg>
          <div className="mp-donut-label">43.2%</div>
        </div>
      </div>
    </div>
  )
}

/* View 2 — Performance Overview */
function ViewPerformance() {
  const orders = useCountUp(968, 1400)
  const grossSubtotal = useCountUp(370156, 1400)
  const discounts = useCountUp(108008, 1400)
  const aov = useCountUp(305, 1400)
  return (
    <div className="mp-view mp-view--perf">
      <div className="mp-view-head">
        <div>
          <div className="mp-view-title">Performance Overview</div>
          <div className="mp-view-sub">All periods</div>
        </div>
        <span className="mp-tag mp-tag--all">Live</span>
      </div>

      <div className="mp-stat-grid">
        <div className="mp-stat mp-stat--orders">
          <div className="mp-stat-label">TOTAL ORDERS</div>
          <div className="mp-stat-value mp-stat-value--num">{orders}</div>
          <div className="mp-order-pills">
            <span className="mp-order-pill mp-order-pill--ok">950 delivered</span>
            <span className="mp-order-pill mp-order-pill--bad">18 cancelled</span>
          </div>
        </div>
        <div className="mp-stat mp-stat--gross">
          <div className="mp-stat-label">GROSS SUBTOTAL</div>
          <div className="mp-stat-value">{fmtRupees(grossSubtotal)}</div>
          <div className="mp-stat-hint">Before discounts</div>
        </div>
        <div className="mp-stat mp-stat--disc">
          <div className="mp-stat-label">TOTAL DISCOUNTS</div>
          <div className="mp-stat-value">{fmtRupees(discounts)}</div>
          <div className="mp-stat-badge mp-stat-badge--down">29.2% of sub</div>
        </div>
        <div className="mp-stat mp-stat--aov">
          <div className="mp-stat-label">AVG ORDER VALUE</div>
          <div className="mp-stat-value">{fmtRupees(aov)}</div>
          <div className="mp-stat-badge mp-stat-badge--up">↑ Healthy</div>
        </div>
      </div>

      <div className="mp-flow">
        <div className="mp-flow-title">REVENUE FLOW</div>
        {[
          { op: '=', label: 'Subtotal', val: '₹3,70,156', tone: 'neutral' },
          { op: '+', label: 'Packaging', val: '₹13,836', tone: 'add' },
          { op: '−', label: 'Discounts', val: '₹1,08,008', tone: 'sub' },
          { op: '+', label: 'Customer GST', val: '₹13,400', tone: 'add' },
          { op: '=', label: 'Customer Paid', val: '₹2,89,384', tone: 'final' },
        ].map((r, i) => (
          <div key={r.label} className={`mp-flow-row mp-flow-row--${r.tone}`} style={{ animationDelay: `${i * 90}ms` }}>
            <span className={`mp-flow-op mp-flow-op--${r.tone}`}>{r.op}</span>
            <span className="mp-flow-label">{r.label}</span>
            <span className="mp-flow-val">{r.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* View 3 — Top items ledger */
function ViewItems() {
  const totalItems = useCountUp(123, 1400)
  const items = [
    { rank: 1, name: 'Chicken Mughlai', units: 151, netUnit: '₹119', margin: '49.7%', payout: '₹17,933', tone: 'red' },
    { rank: 2, name: 'Phulka', units: 148, netUnit: '₹13', margin: '53.0%', payout: '₹1,960', tone: 'red' },
    { rank: 3, name: 'Special Chicken', units: 57, netUnit: '₹216', margin: '58.5%', payout: '₹12,297', tone: 'red' },
    { rank: 4, name: 'Hyderabadi Ch..', units: 55, netUnit: '₹110', margin: '47.9%', payout: '₹6,028', tone: 'red' },
    { rank: 5, name: 'Paneer Butter', units: 44, netUnit: '₹107', margin: '40.1%', payout: '₹4,686', tone: 'red' },
    { rank: 6, name: 'Butter Phulka', units: 44, netUnit: '₹19', margin: '54.1%', payout: '₹834', tone: 'red' },
    { rank: 7, name: 'Hyd Chicken DM', units: 29, netUnit: '₹212', margin: '79.9%', payout: '₹6,161', tone: 'green' },
  ]
  return (
    <div className="mp-view mp-view--items">
      <div className="mp-view-head">
        <div>
          <div className="mp-view-title">Item Performance</div>
          <div className="mp-view-sub">{totalItems} unique items</div>
        </div>
        <span className="mp-tag mp-tag--items">Top 7</span>
      </div>

      <div className="mp-items-table">
        <div className="mp-items-thead">
          <span className="mp-th mp-th--rank">#</span>
          <span className="mp-th mp-th--name">MENU ITEM</span>
          <span className="mp-th mp-th--units">UNITS</span>
          <span className="mp-th mp-th--payout">PAYOUT</span>
        </div>
        {items.map((it, i) => (
          <div key={it.rank} className="mp-items-row" style={{ animationDelay: `${i * 60}ms` }}>
            <span className={`mp-rank mp-rank--${it.tone}`}>{it.rank}</span>
            <div className="mp-item-namecol">
              <span className="mp-item-name">{it.name}</span>
              <span className="mp-item-net">Net {it.netUnit} · {it.margin}</span>
            </div>
            <span className="mp-item-units">{it.units}</span>
            <span className="mp-item-payout">{it.payout}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* MobilePhone — 3D iPhone-style frame with cycling report views */
function MobilePhone() {
  const [viewIdx, setViewIdx] = useState(0)
  const [tick, setTick] = useState(0)
  const views = [ViewPayout, ViewPerformance, ViewItems]

  useEffect(() => {
    const t = setInterval(() => setViewIdx(i => (i + 1) % views.length), 3800)
    return () => clearInterval(t)
  }, [])

  // "updated Xs ago" ticker
  useEffect(() => {
    const t = setInterval(() => setTick(x => (x + 1) % 60), 1000)
    return () => clearInterval(t)
  }, [])

  const ActiveView = views[viewIdx]
  const dots = ['●', '●', '●']
  const secondsAgo = (tick % 6) + 1

  return (
    <div className="mp-wrap">
      {/* Floating side card 1 */}
      <div className="mp-side-card mp-side-card--top">
        <div className="mp-side-card-label">AVG DISH NET</div>
        <div className="mp-side-card-val">₹172</div>
        <div className="mp-side-card-trend">
          <svg viewBox="0 0 20 20" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4,14 9,9 12,12 16,6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          +8.4% vs last
        </div>
      </div>

      {/* Floating side card 2 */}
      <div className="mp-side-card mp-side-card--bot">
        <div className="mp-side-card-label">SETTLEMENT</div>
        <div className="mp-side-card-val mp-side-card-val--small">On your phone</div>
        <div className="mp-side-card-trend mp-side-card-trend--live">
          <span className="mp-live-dot" />
          Any device
        </div>
      </div>

      <div className="mp-phone">
        <div className="mp-phone-notch" />
        <div className="mp-phone-inner">
          <div className="mp-screen">
            {/* iOS-style status bar */}
            <div className="mp-statusbar">
              <span className="mp-status-time">9:41</span>
              <span className="mp-status-icons">
                <svg viewBox="0 0 16 12" width="14" height="10" fill="currentColor"><path d="M0 8h2v4H0zm4-2h2v6H4zm4-2h2v8H8zm4-2h2v10h-2z" /></svg>
                <svg viewBox="0 0 20 12" width="16" height="10" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="1" width="17" height="10" rx="2" /><rect x="2" y="2.5" width="12" height="7" rx="1" fill="currentColor" /><rect x="18" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" /></svg>
              </span>
            </div>

            {/* App header */}
            <div className="mp-app-head">
              <div className="mp-app-brand">
                <span className="mp-app-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3"  y="14" width="4" height="7"  rx="1" fill="#00BF8F" />
                    <rect x="9"  y="9"  width="4" height="12" rx="1" fill="#00BF8F" />
                    <rect x="15" y="5"  width="4" height="16" rx="1" fill="#00BF8F" />
                  </svg>
                </span>
                <div>
                  <div className="mp-app-name">ByteValue</div>
                  <div className="mp-app-restaurant">Hyderabad House</div>
                </div>
              </div>
              <div className="mp-live">
                <span className="mp-live-dot" />
                LIVE
              </div>
            </div>

            {/* Cycling report content */}
            <div className="mp-content">
              <div className="mp-view-wrap" key={viewIdx}>
                <ActiveView />
              </div>
            </div>

            {/* Bottom refresh + pagination dots */}
            <div className="mp-foot">
              <div className="mp-foot-refresh">
                <span className="mp-live-dot" />
                Updated {secondsAgo}s ago
              </div>
              <div className="mp-foot-dots">
                {dots.map((_, i) => (
                  <span key={i} className={`mp-dot ${i === viewIdx ? 'active' : ''}`} />
                ))}
              </div>
            </div>

            <div className="mp-home-indicator" />
          </div>
        </div>
      </div>

      {/* Soft accent glow behind phone */}
      <div className="mp-glow" />
    </div>
  )
}

/* Detailed fee breakdown visualization */
function FeeBreakdown() {
  const [ref, visible] = useReveal(0.1)
  const bars = [
    { label: 'Platform commission', pct: 15, color: '#f87171', amount: '₹15,000' },
    { label: 'Advertising charges', pct: 6, color: '#fb923c', amount: '₹6,000' },
    { label: 'Discount & offers', pct: 5, color: '#facc15', amount: '₹5,000' },
    { label: 'Taxes & other fees', pct: 2, color: '#a78bfa', amount: '₹2,000' },
    { label: 'Net payout to you', pct: 72, color: '#00BF8F', amount: '₹72,000' },
  ]
  return (
    <div ref={ref} className={`bv-feebreak ${visible ? 'revealed' : ''}`}>
      <div className="bv-feebreak-head">
        <div>
          <div className="bv-feebreak-eyebrow">EXAMPLE · TYPICAL SETTLEMENT</div>
          <div className="bv-feebreak-title">Where every ₹1,00,000 in gross sales goes</div>
        </div>
        <div className="bv-feebreak-total">
          <div className="bv-feebreak-total-label">Net payout</div>
          <div className="bv-feebreak-total-value">₹72,000</div>
        </div>
      </div>

      <div className="bv-feebreak-bars">
        {bars.map(({ label, pct, color, amount }, i) => (
          <div key={label} className="bv-feebreak-row" style={{ transitionDelay: `${i * 100}ms` }}>
            <div className="bv-feebreak-row-head">
              <div className="bv-feebreak-row-label">
                <span className="bv-feebreak-dot" style={{ background: color }} />
                {label}
              </div>
              <div className="bv-feebreak-row-figures">
                <span className="bv-feebreak-row-amount">{amount}</span>
                <span className="bv-feebreak-row-pct" style={{ color }}>{pct}%</span>
              </div>
            </div>
            <div className="bv-feebreak-track">
              <div
                className={`bv-feebreak-fill ${visible ? 'filled' : ''}`}
                style={{
                  width: visible ? `${pct}%` : '0%',
                  background: color,
                  transitionDelay: `${i * 120 + 200}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bv-feebreak-foot">Based on typical Swiggy and Zomato deductions. Actual numbers vary by outlet, promo mix, and settlement period.</div>
    </div>
  )
}

/* Top items table with elevated card treatment */
function TopItemsTable() {
  const [ref, visible] = useReveal()
  const items = [
    { rank: 1, name: 'Butter Chicken', qty: 184, gross: '₹320', net: '₹198', margin: '62%' },
    { rank: 2, name: 'Biryani Special', qty: 162, gross: '₹280', net: '₹172', margin: '61%' },
    { rank: 3, name: 'Paneer Tikka', qty: 141, gross: '₹240', net: '₹141', margin: '59%' },
    { rank: 4, name: 'Dal Makhani', qty: 98, gross: '₹180', net: '₹104', margin: '58%' },
    { rank: 5, name: 'Naan Basket', qty: 76, gross: '₹120', net: '₹67', margin: '56%' },
  ]
  return (
    <div ref={ref} className={`bv-items-card ${visible ? 'revealed' : ''}`}>
      <div className="bv-items-card-head">
        <div>
          <div className="bv-items-card-eyebrow">TOP ITEMS · FORTNIGHT ENDING JUL 15</div>
          <div className="bv-items-card-title">Net per item ranking</div>
        </div>
        <span className="bv-items-card-platform">Swiggy</span>
      </div>
      <div className="bv-items-card-scroll">
        <table className="bv-items-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Units</th>
              <th>List price</th>
              <th>Net per item</th>
              <th>Margin</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ rank, name, qty, gross, net, margin }, i) => (
              <tr key={name} style={{ transitionDelay: `${i * 80}ms` }} className={visible ? 'row-visible' : ''}>
                <td className="bv-items-rank">{String(rank).padStart(2, '0')}</td>
                <td className="bv-items-name">{name}</td>
                <td>{qty}</td>
                <td className="bv-items-gross">{gross}</td>
                <td className="bv-items-net">{net}</td>
                <td><span className="bv-items-margin">{margin}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="bv-items-note">Net per item = list price minus proportional platform commissions, ad charges, offer deductions, and taxes, divided by units sold in the period.</p>
    </div>
  )
}

/* Feature card icons */
const FEATURE_ICONS = [
  <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 8h18l8 8v24H10V8z" /><path d="M28 8v8h8" /><line x1="17" y1="22" x2="29" y2="22" /><line x1="17" y1="28" x2="25" y2="28" /></svg>,
  <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="10" y="20" width="24" height="18" rx="3" /><path d="M15 20v-5a7 7 0 0 1 14 0v5" /><circle cx="22" cy="29" r="2" fill="currentColor" strokeWidth="0" /><line x1="22" y1="31" x2="22" y2="34" /></svg>,
  <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="10" width="32" height="28" rx="2" /><line x1="6" y1="18" x2="38" y2="18" /><line x1="14" y1="6" x2="14" y2="14" /><line x1="30" y1="6" x2="30" y2="14" /><polyline points="14,28 19,33 30,22" /></svg>,
  <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><line x1="8" y1="22" x2="36" y2="22" /><circle cx="14" cy="22" r="4" fill="currentColor" strokeWidth="0" /><circle cx="30" cy="22" r="4" fill="currentColor" strokeWidth="0" /><line x1="22" y1="10" x2="22" y2="34" strokeDasharray="3 3" /></svg>,
  <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,32 14,22 20,27 28,14 38,18" /><polyline points="30,14 38,14 38,22" /></svg>,
  <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="22" cy="22" r="16" /><line x1="22" y1="10" x2="22" y2="22" /><line x1="22" y1="22" x2="30" y2="26" /><circle cx="22" cy="22" r="2" fill="currentColor" strokeWidth="0" /></svg>,
]

const FEATURES = [
  { title: 'You just share the reports', desc: 'Send us your Swiggy and Zomato settlement files on WhatsApp or email. That is the only thing you do. We build the ByteValue report for you.' },
  { title: 'Login-protected access', desc: 'Every report sits behind a private login built for your restaurant. Only you and the people you authorise can open it. Your settlement files, sales, and item data are never shared with third parties, ever.' },
  { title: 'Complete fee breakdown', desc: 'See exactly how much revenue you generated, what the platform took as commission and ads, what went to taxes, and what actually reached your account.' },
  { title: 'Net per item, ranked', desc: 'After every deduction is distributed proportionally, we show the real net amount each dish earned. The number that changes your pricing decisions.' },
  { title: 'Read on any device', desc: 'Your ByteValue report opens cleanly on mobile, tablet, or laptop. Check your numbers on the way to the kitchen or on the couch after service.' },
  { title: 'Designed to be scanned', desc: 'A simple, quiet layout that keeps you focused on the numbers, not the interface. Every screen answers one question. No dashboards to learn.' },
]

const BENEFIT_ICONS = [
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="12" /><polyline points="16,9 16,16 21,20" /></svg>,
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="24" height="18" rx="2" /><line x1="4" y1="14" x2="28" y2="14" /><circle cx="10" cy="21" r="2" /><line x1="14" y1="21" x2="22" y2="21" /></svg>,
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="10" x2="28" y2="10" /><line x1="4" y1="16" x2="20" y2="16" /><line x1="4" y1="22" x2="14" y2="22" /><circle cx="24" cy="22" r="5" /><line x1="22" y1="22" x2="26" y2="22" /><line x1="24" y1="20" x2="24" y2="24" /></svg>,
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4,22 10,14 16,18 22,9 28,12" /><circle cx="28" cy="12" r="2.5" fill="currentColor" strokeWidth="0" /></svg>,
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4 L20 12 L28 13 L22 19 L24 28 L16 24 L8 28 L10 19 L4 13 L12 12 Z" /></svg>,
]

const BENEFITS = [
  { title: 'Zero effort', desc: 'You do not read spreadsheets, you do not run reports. Share your settlement files and your ByteValue report is ready. Focus on the kitchen, not the paperwork.' },
  { title: 'Secure, login-protected reports', desc: 'Your report opens only after logging in with your private account. Stored securely, never shared, never used to train anything. Only you and your team can see your numbers.' },
  { title: 'Any device, anytime', desc: 'Mobile, tablet, or laptop. Your ByteValue report adapts to any screen, so you can check performance from the counter or from home.' },
  { title: 'Numbers before noise', desc: 'A clean, simple layout that shows the number first and the explanation second. You spend seconds understanding what matters, not minutes decoding it.' },
  { title: 'Smarter menu decisions', desc: 'Once you see net per item, pricing and promotion decisions get obvious. Reprice underpriced dishes and cut items that only look profitable on paper.' },
]

function FeatureCard({ icon, title, desc, index }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`bv-feat-card ${visible ? 'revealed' : ''}`}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      <div className="bv-feat-card-num">{String(index + 1).padStart(2, '0')}</div>
      <div className="bv-feat-card-icon">{icon}</div>
      <h3 className="bv-feat-card-title">{title}</h3>
      <p className="bv-feat-card-desc">{desc}</p>
    </div>
  )
}

function BenefitCard({ icon, title, desc, index }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`bv-benefit-card ${visible ? 'revealed' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="bv-benefit-icon">{icon}</div>
      <h3 className="bv-benefit-title">{title}</h3>
      <p className="bv-benefit-desc">{desc}</p>
    </div>
  )
}

export default function ByteValue() {
  const [scrolled, setScrolled] = useState(false)
  const [heroRef, heroVisible] = useReveal(0.01)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="bv-page">

      {/* SEO — page-specific title / meta (React 19 hoists these into <head>) */}
      <title>ByteValue by Foodnomix | Profit Intelligence Reports for Swiggy &amp; Zomato</title>
      <meta name="description" content="ByteValue turns your Swiggy and Zomato settlement reports into a clean, readable profit report. Share your files, we build the report. Any device, private, no spreadsheets." />
      <link rel="canonical" href="https://foodnomix.in/bytevalue" />
      <meta name="theme-color" content="#EEF3FF" />
      <meta property="og:title" content="ByteValue by Foodnomix | Profit Intelligence Reports for Swiggy &amp; Zomato" />
      <meta property="og:description" content="Share your settlement reports. We generate a clean ByteValue profit report you can read on any device." />
      <meta property="og:url" content="https://foodnomix.in/bytevalue" />
      <meta property="og:image" content="https://foodnomix.in/og-bytevalue.svg" />
      <meta name="twitter:title" content="ByteValue by Foodnomix | Profit Intelligence Reports for Swiggy &amp; Zomato" />
      <meta name="twitter:description" content="Share your settlement reports. We generate a clean ByteValue profit report you can read on any device." />
      <meta name="twitter:image" content="https://foodnomix.in/og-bytevalue.svg" />

      {/* NAV */}
      <nav className={`bv-nav ${scrolled ? 'bv-nav--scrolled' : ''}`}>
        <div className="bv-nav-inner">
          <Link to="/" className="bv-back">← Foodnomix</Link>
          <div className="bv-nav-logo">
            <img src="/logos/bytevalue-logo.svg" alt="ByteValue" className="bv-nav-logo-img" />
          </div>
          <a href="#contact" className="bv-nav-cta">Get access</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="bv-hero" ref={heroRef}>
        <div className="bv-hero-bg">
          <FloatingShape style={{ width: 460, height: 460, top: '-8%', right: '-6%', background: 'radial-gradient(circle, rgba(0,191,143,0.18) 0%, transparent 70%)', borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%', animationDuration: '9s' }} delay={0} />
          <FloatingShape style={{ width: 260, height: 260, top: '52%', right: '38%', background: 'radial-gradient(circle, rgba(27,79,216,0.08) 0%, transparent 70%)', borderRadius: '40% 60% 30% 70% / 60% 40% 70% 30%', animationDuration: '11s' }} delay={2} />
          <FloatingShape style={{ width: 180, height: 180, top: '28%', left: '3%', background: 'radial-gradient(circle, rgba(0,191,143,0.10) 0%, transparent 70%)', borderRadius: '50%', animationDuration: '7s' }} delay={1} />
          <div className="bv-hero-grid" />
        </div>

        <div className="bv-hero-inner">
          <div className={`bv-hero-copy ${heroVisible ? 'revealed' : ''}`}>
            <div className="bv-hero-eyebrow">
              <span className="bv-hero-eyebrow-dot" />
              <span className="bv-hero-eyebrow-text">
                A Foodnomix product<span className="bv-hero-eyebrow-long"> · Now onboarding restaurants</span>
              </span>
            </div>
            <h1 className="bv-hero-headline">
              <span>Your restaurant data,</span>
              <em>decoded for you.</em>
            </h1>
            <p className="bv-hero-sub">
              Just share your Swiggy and Zomato settlement reports. We turn them into a clean ByteValue report you can read at a glance. No spreadsheets, no guesswork. Built for restaurant owners, not accountants.
            </p>
            <div className="bv-hero-actions">
              <a href="#contact" className="bv-btn-primary">Get access</a>
              <a href="#how" className="bv-btn-ghost">See how it works <span className="bv-btn-arrow">→</span></a>
            </div>
            <div className="bv-hero-trust">
              <div className="bv-hero-trust-item">
                <span className="bv-trust-num">Secure</span>
                <span className="bv-trust-label">login-protected report access</span>
              </div>
              <div className="bv-hero-trust-sep" />
              <div className="bv-hero-trust-item">
                <span className="bv-trust-num">100%</span>
                <span className="bv-trust-label">private, only you can view it</span>
              </div>
              <div className="bv-hero-trust-sep" />
              <div className="bv-hero-trust-item">
                <span className="bv-trust-num">Any</span>
                <span className="bv-trust-label">device, mobile or laptop</span>
              </div>
            </div>
          </div>

          <div className="bv-hero-visual">
            <MobilePhone />
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="bv-problem">
        <div className="bv-container">
          <SectionLabel num={1} total={5} label="THE PROBLEM" />
          <div className="bv-problem-grid">
            <div className="bv-problem-left">
              <h2 className="bv-section-headline">
                Dense reports.<br /><em>No clarity.</em>
              </h2>
            </div>
            <div className="bv-problem-right">
              <p className="bv-problem-body">
                Every settlement period, Swiggy and Zomato send you a payout report. But these reports are dense, confusing, and hard to act on. Between platform commissions, ad charges, offer deductions, taxes, and other fees, the number that hits your account can be 28 to 35 percent lower than your gross sales.
              </p>
              <p className="bv-problem-body">
                Most restaurant owners never work through this breakdown. They do not know which dishes are profitable after platform deductions. They cannot make informed pricing decisions. Share your settlement reports with us and we generate a clean ByteValue report that shows everything you need to know.
              </p>
              <div className="bv-callout">
                <div className="bv-callout-figure">
                  <span className="bv-callout-num">₹28–35</span>
                  <span className="bv-callout-unit">per ₹100</span>
                </div>
                <div className="bv-callout-body">
                  <span className="bv-callout-title">Average platform deduction</span>
                  <span className="bv-callout-desc">Commissions, ads, offers, and taxes combined across Swiggy & Zomato</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEE BREAKDOWN VISUAL */}
      <section className="bv-visual-section">
        <div className="bv-container">
          <FeeBreakdown />
        </div>
      </section>

      {/* FEATURES */}
      <section className="bv-features" id="features">
        <div className="bv-container">
          <SectionLabel num={2} total={5} label="FEATURES" />
          <div className="bv-features-head">
            <h2 className="bv-section-headline">
              Every number,<br /><em>explained clearly.</em>
            </h2>
            <p className="bv-features-intro">
              Everything ByteValue does, purpose-built for a restaurant owner who wants clarity, not a spreadsheet.
            </p>
          </div>
          <div className="bv-feat-grid">
            {FEATURES.map(({ title, desc }, i) => (
              <FeatureCard
                key={title}
                icon={FEATURE_ICONS[i]}
                title={title}
                desc={desc}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TOP ITEMS TABLE */}
      <section className="bv-table-section">
        <div className="bv-container">
          <SectionLabel num={3} total={5} label="NET PER ITEM" />
          <div className="bv-table-head">
            <h2 className="bv-section-headline">
              Know what each dish<br /><em>actually earns you.</em>
            </h2>
            <p className="bv-table-intro">
              This is the ranking ByteValue calculates for every settlement period. With this data, you know exactly which items to reprice, which to promote, and which to reconsider entirely.
            </p>
          </div>
          <TopItemsTable />
        </div>
      </section>

      {/* WHY BYTEVALUE */}
      <section className="bv-benefits" id="benefits">
        <div className="bv-container">
          <SectionLabel num={4} total={5} label="WHY BYTEVALUE" />
          <div className="bv-benefits-head">
            <h2 className="bv-section-headline">
              Whether you run one outlet<br /><em>or ten.</em>
            </h2>
            <p className="bv-benefits-intro">
              ByteValue gives you a complete picture of your delivery performance without opening a single spreadsheet.
            </p>
          </div>
          <div className="bv-benefits-grid">
            {BENEFITS.map(({ title, desc }, i) => (
              <BenefitCard
                key={title}
                icon={BENEFIT_ICONS[i]}
                title={title}
                desc={desc}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bv-how" id="how">
        <div className="bv-container">
          <SectionLabel num={5} total={5} label="HOW IT WORKS" />
          <h2 className="bv-section-headline bv-how-headline">
            Three steps to<br /><em>complete clarity.</em>
          </h2>
          <div className="bv-steps">
            {[
              { num: '01', title: 'Share your settlement files', desc: 'Download your Swiggy and Zomato payout reports from the partner portal and send them to us on WhatsApp or email. That is the only thing you need to do.' },
              { num: '02', title: 'We build your ByteValue report', desc: 'Our team processes every line of your settlement: gross sales, commissions, ad charges, offer deductions, taxes, and fees. Your data stays private and is never shared.' },
              { num: '03', title: 'Log in and read your report', desc: 'We create a private account for you. Log in from any device to view your ByteValue report. Only you and the people you authorise can open it, so your business numbers stay secure.' },
            ].map(({ num, title, desc }, i) => {
              const [ref, visible] = useReveal()
              return (
                <div
                  key={num}
                  ref={ref}
                  className={`bv-step ${visible ? 'revealed' : ''}`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="bv-step-num">{num}</div>
                  <div className="bv-step-connector" />
                  <div className="bv-step-body">
                    <h3 className="bv-step-title">{title}</h3>
                    <p className="bv-step-desc">{desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA / CONTACT */}
      <section className="bv-cta" id="contact">
        <div className="bv-container">
          <div className="bv-cta-inner">
            <div className="bv-cta-decor bv-cta-decor--1" />
            <div className="bv-cta-decor bv-cta-decor--2" />
            <div className="bv-cta-badge">GET ACCESS</div>
            <h2 className="bv-cta-headline">
              Know your numbers.<br /><em>Grow your restaurant.</em>
            </h2>
            <p className="bv-cta-sub">
              Leave your details and we will set up your private ByteValue account, then send your first settlement analysis inside 48 hours.
            </p>
            <form className="bv-form">
              <div className="bv-form-row">
                <input type="text" placeholder="Restaurant name" className="bv-input" />
                <input type="text" placeholder="Owner name" className="bv-input" />
              </div>
              <input type="email" placeholder="Email address" className="bv-input" />
              <input type="tel" placeholder="WhatsApp number" className="bv-input" />
              <select className="bv-input bv-select">
                <option value="">Platform you use</option>
                <option>Swiggy</option>
                <option>Zomato</option>
                <option>Both Swiggy and Zomato</option>
              </select>
              <button type="submit" className="bv-btn-primary bv-btn-full">Get access to ByteValue</button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bv-footer">
        <div className="bv-container">
          <div className="bv-footer-inner">
            <div>
              <img src="/logos/bytevalue-logo.svg" alt="ByteValue" className="bv-footer-logo-img" />
              <p className="bv-footer-tagline">A Foodnomix product for Indian restaurants on Swiggy and Zomato.</p>
            </div>
            <div className="bv-footer-nav">
              <Link to="/">← Back to Foodnomix</Link>
              <a href="#features">Features</a>
              <a href="#benefits">Why ByteValue</a>
              <a href="#how">How it works</a>
              <a href="#contact">Get access</a>
            </div>
          </div>
          <div className="bv-footer-bottom">
            <span>© 2026 Foodnomix · ByteValue. All rights reserved.</span>
            <span className="bv-footer-credit">
              Developed by <a href="https://pandrsolutions.com" target="_blank" rel="noopener noreferrer">Pandr Solutions</a>
            </span>
          </div>
        </div>
      </footer>

    </div>
  )
}
