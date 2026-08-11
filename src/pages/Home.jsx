import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

/* ── Intersection observer hook for scroll reveals ── */
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

/* ── Mouse-following 3D tilt hook ── */
function useTilt(max = 8) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const rx = ((0.5 - y) * max).toFixed(2)
      const ry = ((x - 0.5) * max).toFixed(2)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--tilt-x', `${rx}deg`)
        el.style.setProperty('--tilt-y', `${ry}deg`)
        el.style.setProperty('--tilt-mx', `${(x * 100).toFixed(1)}%`)
        el.style.setProperty('--tilt-my', `${(y * 100).toFixed(1)}%`)
      })
    }
    const onLeave = () => {
      el.style.setProperty('--tilt-x', '0deg')
      el.style.setProperty('--tilt-y', '0deg')
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [max])
  return ref
}

/* ── Parallax scroll hook — translates element based on scrollY ── */
function useParallax(speed = 0.2) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed
        el.style.setProperty('--parallax-y', `${(-offset).toFixed(1)}px`)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [speed])
  return ref
}

/* ── Floating 3D-ish food blob shapes ── */
function FloatingShape({ style, delay = 0, parallaxRef }) {
  return (
    <div
      ref={parallaxRef}
      className="float-shape"
      style={{ animationDelay: `${delay}s`, ...style }}
    />
  )
}

/* ── Rotating badge ── */
function RotatingBadge({ text, center, size = 88 }) {
  const cx = size / 2
  const radius = Math.round(cx * 0.73)
  return (
    <div className="badge-wrap" style={{ width: size, height: size }}>
      <div className="badge-ring">
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          <defs>
            <path id="circle" d={`M ${cx},${cx} m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`} />
          </defs>
          <text fontSize="8.5" letterSpacing="2.4" fill="var(--fn-muted)">
            <textPath href="#circle">{text}</textPath>
          </text>
        </svg>
      </div>
      <div className="badge-center" style={{ width: Math.round(size * 0.38), height: Math.round(size * 0.38) }}>{center}</div>
    </div>
  )
}

/* ── Numbered section label ── */
function SectionLabel({ num, total, label }) {
  return (
    <div className="section-label">
      <span className="section-num">{String(num).padStart(2, '0')}</span>
      <span className="section-sep">OF {String(total).padStart(2, '0')}</span>
      <span className="section-name">{label}</span>
    </div>
  )
}

/* ── Marquee ticker ── */
function Marquee({ items }) {
  const repeated = [...items, ...items]
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="marquee-item">
            {item} <span className="marquee-dot">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Service card ── */
function ServiceCard({ icon, title, desc, delay }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`service-card ${visible ? 'revealed' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="service-icon">{icon}</div>
      <h3 className="service-title">{title}</h3>
      <p className="service-desc">{desc}</p>
    </div>
  )
}

/* ── Why Us card with 3D mouse-tilt ── */
function WhyCard({ icon, title, desc, index }) {
  const [revealRef, visible] = useReveal()
  const tiltRef = useTilt(6)
  const setRefs = (el) => {
    revealRef.current = el
    tiltRef.current = el
  }
  return (
    <div
      ref={setRefs}
      className={`why-card ${visible ? 'revealed' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="why-card-glow" />
      <div className="why-icon">{icon}</div>
      <h3 className="why-title">{title}</h3>
      <p className="why-desc">{desc}</p>
    </div>
  )
}

/* ── Hero visual — the Foodnomix Management Cockpit ── */
function ManagementCockpit() {
  const tiltRef = useTilt(8)
  const activities = [
    { label: 'Menu strategy', status: '3 items repriced', tone: 'menu' },
    { label: 'Zomato ad', status: 'Live · Weekend combo', tone: 'ad' },
    { label: 'Offer plan', status: 'Fortnight cycle set', tone: 'offer' },
    { label: 'Platform review', status: 'Aug 21 · Scheduled', tone: 'review' },
  ]
  return (
    <div className="cockpit-wrap">
      {/* Floating card: growth ring */}
      <div className="cockpit-ring">
        <div className="cockpit-ring-svg">
          <svg viewBox="0 0 120 120" width="120" height="120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(229, 65, 13, 0.14)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke="var(--fn-accent)" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="314"
              strokeDashoffset="72"
              transform="rotate(-90 60 60)"
              className="cockpit-ring-arc"
            />
          </svg>
        </div>
        <div className="cockpit-ring-body">
          <div className="cockpit-ring-value">+23%</div>
          <div className="cockpit-ring-label">Net margin</div>
          <div className="cockpit-ring-sub">Last fortnight</div>
        </div>
      </div>

      {/* Floating card: task/next action */}
      <div className="cockpit-task">
        <div className="cockpit-task-icon">
          <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <polyline points="4,10 8,14 16,6" />
          </svg>
        </div>
        <div>
          <div className="cockpit-task-title">Weekly report sent</div>
          <div className="cockpit-task-sub">Aug 08 · WhatsApp</div>
        </div>
      </div>

      {/* Central management hub card */}
      <div ref={tiltRef} className="cockpit-card">
        <div className="cockpit-card-glow" />

        <div className="cockpit-card-head">
          <div className="cockpit-badge">
            <span className="cockpit-badge-dot" />
            Foodnomix · Managing
          </div>
          <span className="cockpit-period">Fortnight 15</span>
        </div>

        <div className="cockpit-restaurant">
          <div className="cockpit-restaurant-name">Hyderabad House</div>
          <div className="cockpit-restaurant-meta">Mangalore · 2 outlets · Swiggy + Zomato</div>
        </div>

        <div className="cockpit-metrics">
          <div className="cockpit-metric">
            <span className="cockpit-metric-arrow">↑</span>
            <span className="cockpit-metric-value">18%</span>
            <span className="cockpit-metric-label">Orders</span>
          </div>
          <div className="cockpit-metric-sep" />
          <div className="cockpit-metric">
            <span className="cockpit-metric-arrow">↑</span>
            <span className="cockpit-metric-value">₹1.2L</span>
            <span className="cockpit-metric-label">Net payout</span>
          </div>
          <div className="cockpit-metric-sep" />
          <div className="cockpit-metric">
            <span className="cockpit-metric-star">★</span>
            <span className="cockpit-metric-value">4.7</span>
            <span className="cockpit-metric-label">Rating</span>
          </div>
        </div>

        <div className="cockpit-activity-title">Live management this fortnight</div>
        <div className="cockpit-activities">
          {activities.map((a, i) => (
            <div key={a.label} className={`cockpit-activity cockpit-activity--${a.tone}`} style={{ animationDelay: `${0.4 + i * 0.15}s` }}>
              <span className={`cockpit-activity-dot cockpit-activity-dot--${a.tone}`} />
              <div className="cockpit-activity-body">
                <span className="cockpit-activity-label">{a.label}</span>
                <span className="cockpit-activity-status">{a.status}</span>
              </div>
              <svg className="cockpit-activity-check" viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4,10 8,14 16,6" />
              </svg>
            </div>
          ))}
        </div>

        <div className="cockpit-footer">
          <span className="cockpit-footer-dot" />
          <span>Real-time management by Foodnomix</span>
        </div>
      </div>

      <div className="cockpit-underglow" />
    </div>
  )
}

/* ── About decorative mark: subtle orbit/flow accent next to the headline ── */
function AboutMark() {
  return (
    <div className="about-mark" aria-hidden="true">
      <svg viewBox="0 0 140 140" width="140" height="140" fill="none">
        {/* Outer soft ring */}
        <circle cx="70" cy="70" r="60" stroke="rgba(229, 65, 13, 0.14)" strokeWidth="1" strokeDasharray="2 5" />
        {/* Inner accent ring */}
        <circle cx="70" cy="70" r="42" stroke="rgba(229, 65, 13, 0.28)" strokeWidth="1" />
        {/* Center hub */}
        <circle cx="70" cy="70" r="7" fill="var(--fn-accent)" />
        <circle cx="70" cy="70" r="14" stroke="var(--fn-accent)" strokeWidth="1" opacity="0.35" />
        {/* Three orbit dots */}
        <circle cx="70" cy="28" r="4" fill="var(--fn-accent)" className="about-mark-dot about-mark-dot--1" />
        <circle cx="106" cy="90" r="4" fill="var(--fn-accent)" className="about-mark-dot about-mark-dot--2" />
        <circle cx="34" cy="90" r="4" fill="var(--fn-accent)" className="about-mark-dot about-mark-dot--3" />
      </svg>
    </div>
  )
}

/* ── About pillar card — compact & animated ── */
function AboutPillar({ icon, title, desc, index }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`about-pillar ${visible ? 'revealed' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="about-pillar-icon">{icon}</div>
      <h3 className="about-pillar-title">{title}</h3>
      <p className="about-pillar-desc">{desc}</p>
    </div>
  )
}

const PILLAR_ICONS = {
  support: (
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 30v-6a14 14 0 0 1 28 0v6" />
      <rect x="6" y="26" width="6" height="10" rx="2" />
      <rect x="32" y="26" width="6" height="10" rx="2" />
      <path d="M32 36c0 3-3 5-6 5" />
      <circle cx="24" cy="41" r="1.5" fill="currentColor" strokeWidth="0" />
    </svg>
  ),
  strategy: (
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="22" cy="22" r="14" />
      <circle cx="22" cy="22" r="7" />
      <circle cx="22" cy="22" r="1.5" fill="currentColor" strokeWidth="0" />
      <line x1="22" y1="4" x2="22" y2="10" />
      <line x1="22" y1="34" x2="22" y2="40" />
      <line x1="4" y1="22" x2="10" y2="22" />
      <line x1="34" y1="22" x2="40" y2="22" />
    </svg>
  ),
  payouts: (
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6,32 15,22 21,27 30,15 38,20" />
      <polyline points="30,15 38,15 38,23" />
      <line x1="6" y1="38" x2="38" y2="38" />
    </svg>
  ),
}

/* ── Stat block ── */
function Stat({ value, label }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className={`stat-block ${visible ? 'revealed' : ''}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

/* ── Process step ── */
function ProcessStep({ num, title, desc, delay }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`process-step ${visible ? 'revealed' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="process-num">{num}</div>
      <h3 className="process-title">{title}</h3>
      <p className="process-desc">{desc}</p>
    </div>
  )
}

const SVC_ICONS = [
  <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="38" x2="38" y2="38" /><rect x="6" y="26" width="7" height="12" rx="1" /><rect x="18" y="18" width="7" height="20" rx="1" /><rect x="30" y="8" width="7" height="30" rx="1" /></svg>,
  <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="8" y1="14" x2="36" y2="14" /><line x1="8" y1="22" x2="28" y2="22" /><line x1="8" y1="30" x2="20" y2="30" /><circle cx="34" cy="30" r="6" /><line x1="31" y1="30" x2="37" y2="30" /><line x1="34" y1="27" x2="34" y2="33" /></svg>,
  <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="22" cy="22" r="14" /><circle cx="22" cy="22" r="7" /><circle cx="22" cy="22" r="2" fill="currentColor" /><line x1="32" y1="12" x2="38" y2="6" /><polyline points="34,6 38,6 38,10" /></svg>,
  <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22s6-12 16-12 16 12 16 12-6 12-16 12S6 22 6 22z" /><circle cx="22" cy="22" r="5" /><circle cx="22" cy="22" r="1.5" fill="currentColor" /></svg>,
  <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="10" width="32" height="28" rx="2" /><line x1="6" y1="18" x2="38" y2="18" /><line x1="14" y1="6" x2="14" y2="14" /><line x1="30" y1="6" x2="30" y2="14" /><polyline points="14,28 19,33 30,22" /></svg>,
]

const SERVICES = [
  { title: 'Platform Management', desc: 'We actively monitor and manage your restaurant across Swiggy and Zomato: orders, revenue, commissions, ad spend, settlement data, and overall platform performance.', tag: 'PLATFORMS' },
  { title: 'Menu Strategy', desc: 'We structure your menu for conversion and profitability. Item pricing, combo creation, category optimisation, and decisions on what to promote, modify, or discontinue.', tag: 'MENU' },
  { title: 'Marketing & Advertising', desc: 'We plan and manage your platform advertising campaigns. Budget allocation, product selection, performance monitoring, and continuous optimisation to maximise return on spend.', tag: 'MARKETING' },
  { title: 'Offers & Discount Management', desc: 'Discounts are a business strategy, not a default. We plan promotions based on order value, customer behaviour, platform commission structure, and actual item profitability.', tag: 'OFFERS' },
  { title: 'Monthly Management', desc: 'We review your business every month, track improvement against targets, refine the strategy, and provide written action plans. You always know exactly where your online business stands.', tag: 'MANAGEMENT' },
]

/* ── ServiceMockup — small graphic preview per service ── */
function ServiceMockup({ index }) {
  const visuals = [
    // 0: Platform Management
    <div key={0} className="svc-mock svc-mock--platforms">
      <div className="svc-mock-title">Live platforms</div>
      <div className="svc-mock-plats">
        <div className="svc-plat-row">
          <span className="svc-plat-badge svc-plat-badge--swiggy">Swiggy</span>
          <span className="svc-plat-live"><span className="svc-plat-dot" />Active</span>
          <span className="svc-plat-metric">218 orders</span>
        </div>
        <div className="svc-plat-row">
          <span className="svc-plat-badge svc-plat-badge--zomato">Zomato</span>
          <span className="svc-plat-live"><span className="svc-plat-dot" />Active</span>
          <span className="svc-plat-metric">228 orders</span>
        </div>
      </div>
      <div className="svc-mock-foot">
        <span>Aug fortnight 2</span>
        <span className="svc-mock-foot-val">+18% vs last</span>
      </div>
    </div>,
    // 1: Menu Strategy
    <div key={1} className="svc-mock svc-mock--menu">
      <div className="svc-mock-title">Repricing plan</div>
      <div className="svc-menu-rows">
        {[
          { name: 'Butter Chicken', old: '₹320', neu: '₹340', up: true },
          { name: 'Biryani Special', old: '₹280', neu: '₹300', up: true },
          { name: 'Paneer Tikka', old: '₹240', neu: '₹240', up: null },
        ].map((it, i) => (
          <div key={i} className="svc-menu-row">
            <span className="svc-menu-name">{it.name}</span>
            <span className="svc-menu-price">
              <span className="svc-menu-old">{it.old}</span>
              <span className="svc-menu-arrow">→</span>
              <span className={`svc-menu-new ${it.up ? 'up' : ''}`}>{it.neu}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="svc-mock-foot"><span>3 items repriced</span><span className="svc-mock-foot-val">+₹18 net avg</span></div>
    </div>,
    // 2: Marketing
    <div key={2} className="svc-mock svc-mock--marketing">
      <div className="svc-mock-title">Weekend boost · Zomato</div>
      <div className="svc-camp-metrics">
        <div className="svc-camp-metric">
          <span className="svc-camp-val">4.2%</span>
          <span className="svc-camp-lbl">CTR</span>
        </div>
        <div className="svc-camp-metric">
          <span className="svc-camp-val">218</span>
          <span className="svc-camp-lbl">Orders</span>
        </div>
        <div className="svc-camp-metric">
          <span className="svc-camp-val">3.9x</span>
          <span className="svc-camp-lbl">ROAS</span>
        </div>
      </div>
      <div className="svc-camp-bar">
        <div className="svc-camp-bar-label">
          <span>Budget used</span>
          <span>62%</span>
        </div>
        <div className="svc-camp-bar-track">
          <div className="svc-camp-bar-fill" />
        </div>
      </div>
      <div className="svc-mock-foot"><span>₹8,240 spent</span><span className="svc-mock-foot-val">₹32k revenue</span></div>
    </div>,
    // 3: Offers
    <div key={3} className="svc-mock svc-mock--offers">
      <div className="svc-mock-title">Live combo offer</div>
      <div className="svc-offer">
        <div className="svc-offer-badge">SAVE 23%</div>
        <div className="svc-offer-name">Weekend Feast Combo</div>
        <div className="svc-offer-items">Butter Chicken + Biryani + Naan</div>
        <div className="svc-offer-price">
          <span className="svc-offer-old">₹520</span>
          <span className="svc-offer-new">₹399</span>
        </div>
      </div>
      <div className="svc-mock-foot"><span>Live on Swiggy</span><span className="svc-mock-foot-val">84 redemptions</span></div>
    </div>,
    // 4: Monthly Management
    <div key={4} className="svc-mock svc-mock--monthly">
      <div className="svc-mock-title">Fortnight review cycle</div>
      <div className="svc-cal">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
          <div key={d} className="svc-cal-head">{d}</div>
        ))}
        {[8,9,10,11,12,13,14].map(d => (
          <div key={d} className={`svc-cal-day ${d < 14 ? 'done' : ''} ${d === 14 ? 'today' : ''}`}>
            {d < 14 && <svg viewBox="0 0 12 12" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,6 5,9 10,3" /></svg>}
            {d === 14 && <span className="svc-cal-today-dot" />}
          </div>
        ))}
      </div>
      <div className="svc-mock-foot"><span>Next review · Aug 21</span><span className="svc-mock-foot-val">WhatsApp</span></div>
    </div>,
  ]
  return (
    <div className="svc-mock-wrap" key={index}>
      {visuals[index]}
    </div>
  )
}

/* ── Unified service slide — one full card containing everything ── */
function ServiceSlide({ index }) {
  const svc = SERVICES[index]
  return (
    <div className="svc-slide">
      <div className="svc-slide-topline" />
      <div className="svc-slide-glow" />
      <div className="svc-slide-head">
        <div className="svc-slide-icon">{SVC_ICONS[index]}</div>
        <span className="svc-slide-tag">{svc.tag}</span>
      </div>
      <div className="svc-slide-index">
        <span className="svc-slide-index-num">{String(index + 1).padStart(2, '0')}</span>
        <span className="svc-slide-index-total">/ {String(SERVICES.length).padStart(2, '0')}</span>
      </div>
      <h3 className="svc-slide-title">{svc.title}</h3>
      <p className="svc-slide-desc">{svc.desc}</p>
      <div className="svc-slide-preview">
        <ServiceMockup index={index} />
      </div>
    </div>
  )
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [activeService, setActiveService] = useState(0)
  const [outgoingService, setOutgoingService] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [heroRef, heroVisible] = useReveal(0.01)
  const servicesRef = useRef(null)
  const lastActiveRef = useRef(0)
  const shape1Ref = useParallax(0.15)
  const shape2Ref = useParallax(0.25)
  const shape3Ref = useParallax(0.1)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    setIsMobile(mq.matches)
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Auto-cycle services on mobile — pauses briefly after the user interacts
  const [svcUserPaused, setSvcUserPaused] = useState(0)
  useEffect(() => {
    if (!isMobile) return
    const interval = setInterval(() => {
      setActiveService(prev => (prev + 1) % SERVICES.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [isMobile, svcUserPaused])

  const nudgeService = (delta) => {
    setActiveService(prev => (prev + delta + SERVICES.length) % SERVICES.length)
    setSvcUserPaused(x => x + 1) // resets the auto-cycle timer
  }

  // Swipe handling for the service stage on mobile
  const svcTouch = useRef({ x: 0, y: 0, active: false })
  const onSvcTouchStart = (e) => {
    const t = e.touches[0]
    svcTouch.current = { x: t.clientX, y: t.clientY, active: true }
  }
  const onSvcTouchEnd = (e) => {
    if (!svcTouch.current.active) return
    const t = e.changedTouches[0]
    const dx = t.clientX - svcTouch.current.x
    const dy = t.clientY - svcTouch.current.y
    svcTouch.current.active = false
    // Horizontal swipe with a threshold and vertical tolerance
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      nudgeService(dx < 0 ? 1 : -1)
    }
  }

  // Track outgoing service card for slide-cover transition
  useEffect(() => {
    if (lastActiveRef.current !== activeService) {
      setOutgoingService(lastActiveRef.current)
      lastActiveRef.current = activeService
      const t = setTimeout(() => setOutgoingService(null), 750)
      return () => clearTimeout(t)
    }
  }, [activeService])

  useEffect(() => {
    const trackIds = ['services', 'process', 'why-us']
    const onScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 60)

      const mid = scrollY + window.innerHeight * 0.4
      let active = ''
      for (const id of trackIds) {
        const el = document.getElementById(id)
        if (!el) continue
        if (mid >= el.offsetTop && mid < el.offsetTop + el.offsetHeight) { active = id; break }
      }
      setActiveSection(active)

      if (!isMobile) {
        const svcsEl = servicesRef.current
        if (svcsEl) {
          const scrollable = svcsEl.offsetHeight - window.innerHeight
          const scrolled = scrollY - svcsEl.offsetTop
          if (scrolled >= 0 && scrolled <= scrollable) {
            setActiveService(Math.min(SERVICES.length - 1, Math.floor((scrolled / scrollable) * SERVICES.length)))
          }
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  // Global scroll-reveal for section labels, headlines, and about paragraphs
  useEffect(() => {
    const targets = document.querySelectorAll(
      '.section-label, .section-headline, .about-body, .stat-block'
    )
    if (!targets.length) return
    targets.forEach(el => el.classList.add('scroll-reveal'))
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -80px 0px' }
    )
    targets.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="home">

      {/* SEO — page-specific title / meta (React 19 hoists these into <head>) */}
      <title>Foodnomix | Online Business Management for Restaurants on Swiggy &amp; Zomato</title>
      <meta name="description" content="Foodnomix is the online business management partner for Indian restaurants on Swiggy and Zomato. Menu strategy, offers, marketing and settlement analysis, all handled for you." />
      <link rel="canonical" href="https://foodnomix.in/" />
      <meta property="og:title" content="Foodnomix | Online Business Management for Restaurants on Swiggy &amp; Zomato" />
      <meta property="og:description" content="Menu, offers, marketing and payouts. Fully managed for restaurants on Swiggy and Zomato." />
      <meta property="og:url" content="https://foodnomix.in/" />

      {/* ── NAV ── */}
      <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav-inner">
          <Link
            to="/"
            className="nav-logo"
            onClick={(e) => {
              e.preventDefault()
              setNavOpen(false)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            aria-label="Foodnomix — back to top"
          >
            <img src="/logos/foodnomix-logo.svg" alt="Foodnomix" className="nav-logo-img" />
          </Link>
          <div className={`nav-links ${navOpen ? 'nav-links--open' : ''}`}>
            {[['#services','Services','services'],['#process','Process','process'],['#why-us','Why Us','why-us']].map(([href, label, id]) => (
              <a key={id} href={href} className={`nav-item ${activeSection === id ? 'nav-item--active' : ''}`} onClick={() => setNavOpen(false)}>
                {label}<span className="nav-dot" />
              </a>
            ))}
            <a href="#contact" className="nav-item nav-item--contact" onClick={() => setNavOpen(false)}>
              Get in touch<span className="nav-dot" />
            </a>
            <Link to="/bytevalue" className="nav-product" onClick={() => setNavOpen(false)} aria-label="ByteValue product">
              <span className="nav-product-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect className="nav-bv-bar nav-bv-bar--1" x="3"  y="14" width="4" height="7"  rx="1" fill="#00BF8F" />
                  <rect className="nav-bv-bar nav-bv-bar--2" x="9"  y="9"  width="4" height="12" rx="1" fill="#00BF8F" />
                  <rect className="nav-bv-bar nav-bv-bar--3" x="15" y="5"  width="4" height="16" rx="1" fill="#00BF8F" />
                </svg>
              </span>
              <span className="nav-product-title">ByteValue</span>
            </Link>
          </div>
          <button
            className={`nav-hamburger ${navOpen ? 'nav-hamburger--open' : ''}`}
            onClick={() => setNavOpen(o => !o)}
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg">
          <FloatingShape parallaxRef={shape1Ref} style={{ width: 320, height: 320, top: '8%', right: '6%', background: 'radial-gradient(circle, rgba(229,65,13,0.18) 0%, transparent 70%)', borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%', animationDuration: '7s' }} delay={0} />
          <FloatingShape parallaxRef={shape2Ref} style={{ width: 200, height: 200, top: '55%', right: '20%', background: 'radial-gradient(circle, rgba(229,65,13,0.10) 0%, transparent 70%)', borderRadius: '40% 60% 30% 70% / 60% 40% 70% 30%', animationDuration: '9s' }} delay={1.5} />
          <FloatingShape parallaxRef={shape3Ref} style={{ width: 140, height: 140, top: '30%', left: '3%', background: 'radial-gradient(circle, rgba(229,65,13,0.08) 0%, transparent 70%)', borderRadius: '50%', animationDuration: '6s' }} delay={3} />
          <div className="hero-grid-lines" />
        </div>

        <div className="hero-inner">
          <div className={`hero-content ${heroVisible ? 'revealed' : ''}`}>
            <h1 className="hero-headline">
              <span className="hero-line-1">Your restaurant,</span>
              <span className="hero-line-2"><em>more profitable.</em></span>
            </h1>

            <p className="hero-sub">
              Foodnomix manages the online business of Indian restaurants on Swiggy and Zomato. Menu, pricing, offers, marketing, and platform performance. We handle it all so you can focus on your food.
            </p>

            <div className="hero-trust">
              <span className="trust-dot" />
              <span>Working with restaurants across India</span>
            </div>

            <div className="hero-actions">
              <a href="#contact" className="btn-primary">Start growing</a>
              <a href="#services" className="btn-ghost">
                See our services <span className="btn-arrow">→</span>
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <ManagementCockpit />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee items={['Online Business Management', 'Menu Strategy', 'Offer Planning', 'Swiggy Management', 'Zomato Optimisation', 'Marketing & Ads', 'Data Analysis', 'Platform Performance']} />

      {/* ── ABOUT ── */}
      <section className="about" id="about">
        <div className="container">
          <SectionLabel num={1} total={4} label="ABOUT" />
          <div className="about-grid">
            <div className="about-left">
              <AboutMark />
              <h2 className="section-headline">
                We manage.<br /><em>We execute.</em><br />You focus on food.
              </h2>
            </div>
            <div className="about-right">
              <p className="about-body">
                Foodnomix is not a traditional consulting firm. We work as an <strong>extended business partner</strong> for Indian restaurants on Swiggy and Zomato, taking active responsibility for managing and growing your online presence.
              </p>
              <p className="about-body">
                From menu strategy and offer planning to advertising and settlement analysis, we manage, execute, monitor, and optimise your online business continuously. You focus on food quality and kitchen operations. We handle everything else online.
              </p>
            </div>
          </div>

          <div className="about-pillars">
            <AboutPillar
              index={0}
              icon={PILLAR_ICONS.support}
              title="Continuous support"
              desc="Weekly check-ins, WhatsApp updates, and on-demand help whenever you need it. A real team behind your online business, not a one-time report."
            />
            <AboutPillar
              index={1}
              icon={PILLAR_ICONS.strategy}
              title="Data-led strategy"
              desc="Every decision on menu pricing, ad spend, and offer design is grounded in your actual settlement data and real platform performance."
            />
            <AboutPillar
              index={2}
              icon={PILLAR_ICONS.payouts}
              title="Improved payouts"
              desc="Tighter pricing, smarter promotions, and lower deduction leakage add up to a healthier net payout in every settlement cycle."
            />
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="services" id="services" ref={servicesRef}>
        <div className="services-sticky-outer">
          <div className="services-sticky-panel">
            <div className="services-progress-track" aria-hidden="true">
              <div
                className="services-progress-fill"
                style={{ height: `${((activeService + 1) / SERVICES.length) * 100}%` }}
              />
            </div>
            <div className="services-panel-inner">
              <div className="services-left-col">
                <SectionLabel num={2} total={4} label="SERVICES" />
                <h2 className="section-headline" style={{ marginBottom: 0 }}>
                  Your online business,<br /><em>fully managed.</em>
                </h2>
                <div className="svc-counter">
                  <span className="svc-counter-current">{String(activeService + 1).padStart(2, '0')}</span>
                  <span className="svc-counter-sep">/</span>
                  <span className="svc-counter-total">{String(SERVICES.length).padStart(2, '0')}</span>
                </div>
                <div className="svc-nav-list">
                  {SERVICES.map((s, i) => (
                    <div key={i} className={`svc-nav-item ${activeService === i ? 'active' : ''} ${i < activeService ? 'passed' : ''}`}>
                      <span className="svc-nav-num">0{i + 1}</span>
                      <span className="svc-nav-title">{s.title}</span>
                      <div className="svc-nav-bar" />
                      <svg className="svc-nav-check" viewBox="0 0 14 14" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3,7 6,10 11,4" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
              <div className="services-right-col">
                <div
                  className="svc-stage"
                  onTouchStart={isMobile ? onSvcTouchStart : undefined}
                  onTouchEnd={isMobile ? onSvcTouchEnd : undefined}
                >
                  {outgoingService !== null && outgoingService !== activeService && (
                    <div key={`out-${outgoingService}`} className="svc-slide-wrap svc-slide-wrap--exiting">
                      <ServiceSlide index={outgoingService} />
                    </div>
                  )}
                  <div key={`in-${activeService}`} className="svc-slide-wrap svc-slide-wrap--entering">
                    <ServiceSlide index={activeService} />
                  </div>
                </div>
                {isMobile && (
                  <div className="svc-mobile-nav">
                    <button
                      type="button"
                      className="svc-arrow svc-arrow--prev"
                      onClick={() => nudgeService(-1)}
                      aria-label="Previous service"
                    >
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="12,4 6,10 12,16" />
                      </svg>
                    </button>
                    <div className="svc-dots">
                      {SERVICES.map((_, i) => (
                        <button
                          key={i}
                          className={`svc-dot ${activeService === i ? 'svc-dot--active' : ''}`}
                          onClick={() => { setActiveService(i); setSvcUserPaused(x => x + 1) }}
                          aria-label={`Go to service ${i + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="svc-arrow svc-arrow--next"
                      onClick={() => nudgeService(1)}
                      aria-label="Next service"
                    >
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="8,4 14,10 8,16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="process" id="process">
        <div className="container">
          <SectionLabel num={3} total={4} label="PROCESS" />
          <h2 className="section-headline">
            Four steps.<br /><em>No surprises.</em>
          </h2>
          <div className="process-list">
            <ProcessStep num="01" title="Data Audit" desc="We pull your Swiggy and Zomato settlement reports and run them through ByteValue to map your exact cost structure." delay={0} />
            <ProcessStep num="02" title="Insight Report" desc="Within 48 hours you get a clear breakdown of where money is leaking, which items are underpriced, and where your ad spend is being wasted." delay={100} />
            <ProcessStep num="03" title="Action Plan" desc="We build a prioritised plan covering menu changes, promo calendar, listing improvements, and pricing adjustments, with expected impact for each." delay={200} />
            <ProcessStep num="04" title="Ongoing Management" desc="Every month we revisit the data, track performance against targets, refine the strategy, and deliver a written update. Continuous management, not a one-time report." delay={300} />
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="why-us" id="why-us">
        <div className="container">
          <SectionLabel num={4} total={4} label="WHY FOODNOMIX" />
          <h2 className="section-headline">
            Your online business.<br /><em>Our responsibility.</em>
          </h2>
          <div className="why-grid">
            {[
              { title: 'We Manage, Not Just Advise', desc: 'Most consultants give recommendations. We take responsibility. Foodnomix actively manages, executes, and monitors your online business every month.', icon: <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="22" height="16" rx="2"/><line x1="10" y1="23" x2="18" y2="23"/><line x1="14" y1="21" x2="14" y2="23"/></svg> },
              { title: 'Real Numbers', desc: 'ByteValue gives you the honest math behind your payout. No estimates, no averages. Your actual settlement data, itemised clearly.', icon: <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="4,20 9,13 13,17 18,9 24,12"/><circle cx="24" cy="12" r="2" fill="currentColor"/></svg> },
              { title: 'Net Per Item', desc: 'The only metric that truly matters for pricing. We calculate exactly what each dish earns you after all platform commissions, ad spend, and offer deductions.', icon: <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><line x1="6" y1="22" x2="22" y2="6"/><circle cx="8" cy="8" r="3"/><circle cx="20" cy="20" r="3"/></svg> },
              { title: 'Platform-Specific', desc: 'We work exclusively on Swiggy and Zomato. No generic business advice. Every decision is grounded in how these platforms actually operate and charge.', icon: <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h20v12H4z" rx="2"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="8" y1="16" x2="14" y2="16"/></svg> },
              { title: 'Fast Turnaround', desc: 'First report within 48 hours. No lengthy onboarding or long-term contracts required. We move at the pace your business needs.', icon: <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="14" cy="14" r="10"/><polyline points="14,8 14,14 18,17"/></svg> },
              { title: 'India-First', desc: 'Built for Indian restaurant economics, local pricing norms, and a real understanding of how Indian food categories perform on Swiggy and Zomato.', icon: <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4C10 4 7 7 7 11c0 6 7 13 7 13s7-7 7-13c0-4-3-7-7-7z"/><circle cx="14" cy="11" r="2.5"/></svg> },
            ].map(({ title, desc, icon }, i) => (
              <WhyCard key={title} icon={icon} title={title} desc={desc} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="contact-inner">
            <h2 className="contact-headline">
              Ready to see<br /><em>your real numbers?</em>
            </h2>
            <p className="contact-sub">
              Drop us a message and we'll come back within 24 hours with a plan tailored to your restaurant.
            </p>
            <form className="contact-form">
              <div className="form-row">
                <input type="text" placeholder="Restaurant name" className="form-input" />
                <input type="text" placeholder="Your name" className="form-input" />
              </div>
              <input type="email" placeholder="Email address" className="form-input" />
              <input type="tel" placeholder="WhatsApp number" className="form-input" />
              <select className="form-input form-select">
                <option value="">Platform you're on</option>
                <option>Swiggy</option>
                <option>Zomato</option>
                <option>Both Swiggy & Zomato</option>
              </select>
              <textarea className="form-input form-textarea" placeholder="Tell us briefly what you want to improve" rows={4} />
              <button type="submit" className="btn-primary btn-full">Send message</button>
            </form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <button
                type="button"
                className="footer-logo-btn"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
              >
                <img src="/logos/foodnomix-logo.svg" alt="Foodnomix" className="footer-logo-img" />
              </button>
              <p className="footer-tagline">Online business management & growth for Indian restaurants on Swiggy and Zomato.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <span className="footer-col-title">Company</span>
                <a href="#about">About</a>
                <a href="#services">Services</a>
                <a href="#process">Process</a>
                <a href="#contact">Contact</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Foodnomix. All rights reserved.</span>
            <span className="footer-credit">
              Developed by <a href="https://pandrsolutions.com" target="_blank" rel="noopener noreferrer">Pandr Solutions</a>
            </span>
          </div>
        </div>
      </footer>

    </div>
  )
}
