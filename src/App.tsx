import { useEffect, useRef, useState } from 'react'
import { portfolio } from './portfolio-data'

const NavMark = () => (
  <a className="mark" href="#top" aria-label="Amin Aziz home">
    <span className="mark-dot" />
    <span>AMIN AZIZ</span>
  </a>
)

function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = canvas.getContext('2d')
    if (!context) return
    let frame = 0
    let pointer = { x: 0.5, y: 0.5 }
    const motion = window.matchMedia('(pointer: fine)')

    const render = (time: number) => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.round(rect.width * ratio)
      const height = Math.round(rect.height * ratio)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, rect.width, rect.height)
      const t = time * 0.00012
      const blooms = [
        [rect.width * (0.18 + Math.sin(t) * 0.035), rect.height * (0.28 + Math.cos(t * 0.75) * 0.05), 220, '115, 197, 228', 0.3],
        [rect.width * (0.74 + Math.cos(t * 0.62) * 0.045), rect.height * (0.3 + Math.sin(t * 0.88) * 0.055), 260, '156, 214, 235', 0.24],
        [rect.width * (0.52 + Math.sin(t * 0.45) * 0.055), rect.height * (0.76 + Math.cos(t * 0.68) * 0.04), 240, '204, 231, 242', 0.35],
      ]
      blooms.forEach(([x, y, radius, color, opacity]) => {
        const adjustedX = Number(x) + (pointer.x - 0.5) * 16
        const adjustedY = Number(y) + (pointer.y - 0.5) * 12
        const gradient = context.createRadialGradient(adjustedX, adjustedY, 0, adjustedX, adjustedY, Number(radius))
        gradient.addColorStop(0, `rgba(${color}, ${opacity})`)
        gradient.addColorStop(0.52, `rgba(${color}, ${Number(opacity) * 0.34})`)
        gradient.addColorStop(1, `rgba(${color}, 0)`)
        context.fillStyle = gradient
        context.beginPath()
        context.arc(adjustedX, adjustedY, Number(radius), 0, Math.PI * 2)
        context.fill()
      })
      frame = requestAnimationFrame(render)
    }
    const handlePointer = (event: PointerEvent) => {
      if (!motion.matches) return
      pointer = { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight }
    }
    window.addEventListener('pointermove', handlePointer, { passive: true })
    frame = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handlePointer)
    }
  }, [])

  return <canvas ref={canvasRef} className="atmosphere" aria-hidden="true" />
}

function GlassCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const precisePointer = window.matchMedia('(pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const supported = precisePointer.matches && !reduced.matches
    setEnabled(supported)
    if (!supported) return
    const cursor = cursorRef.current
    if (!cursor) return
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let animation = 0
    const update = () => {
      currentX += (targetX - currentX) * 0.17
      currentY += (targetY - currentY) * 0.17
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      animation = requestAnimationFrame(update)
    }
    const handleMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      cursor.dataset.visible = 'true'
      const target = event.target as Element
      cursor.dataset.active = String(Boolean(target.closest('a, button, .capability-card, .journey-card')))
    }
    const handleLeave = () => { cursor.dataset.visible = 'false' }
    window.addEventListener('pointermove', handleMove, { passive: true })
    document.addEventListener('mouseleave', handleLeave)
    animation = requestAnimationFrame(update)
    return () => {
      cancelAnimationFrame(animation)
      window.removeEventListener('pointermove', handleMove)
      document.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return <div ref={cursorRef} className="glass-cursor" data-enabled={enabled} data-visible="false" data-active="false" aria-hidden="true" />
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span className={diagonal ? 'arrow diagonal' : 'arrow'} aria-hidden="true">↗</span>
}

function App() {
  const profileSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: portfolio.name,
    jobTitle: portfolio.role,
    email: portfolio.email,
    address: { '@type': 'PostalAddress', addressLocality: 'Cyberjaya', addressRegion: 'Selangor', addressCountry: 'MY' },
  }

  return (
    <div id="top" className="site-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />
      <Atmosphere />
      <GlassCursor />
      <a className="skip-link" href="#capabilities">Skip to content</a>
      <header className="site-header">
        <NavMark />
        <nav aria-label="Main navigation">
          <a href="#capabilities">Capabilities</a>
          <a href="#journey">Journey</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero section-wrap" aria-labelledby="hero-title">
          <div className="hero-kicker"><span className="live-dot" /> Business analyst · Cyberjaya · Malaysia</div>
          <div className="hero-layout">
            <div>
              <h1 id="hero-title">Clarifying business needs so teams can deliver the <em>right</em> solutions.</h1>
            </div>
            <div className="hero-side">
              <p>{portfolio.summary}</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#capabilities">Explore capabilities <Arrow /></a>
                <a className="button button-secondary" href={`mailto:${portfolio.email}`}>Get in touch <Arrow /></a>
              </div>
            </div>
          </div>
          <div className="hero-foot">
            <span>Scroll to see how I work</span>
            <span className="scroll-line" aria-hidden="true" />
            <span>01 / 05</span>
          </div>
        </section>

        <section id="capabilities" className="section-wrap section-space" aria-labelledby="capabilities-title">
          <div className="section-heading">
            <p className="eyebrow">How I help</p>
            <h2 id="capabilities-title">Clear thinking at every point of delivery.</h2>
            <p className="section-intro">From the first conversation to validation, I make the work around a solution easier to see, discuss and act on.</p>
          </div>
          <div className="capability-grid">
            {portfolio.capabilities.map((capability) => (
              <article className="capability-card" key={capability.label}>
                <div className="card-top"><span>{capability.label}</span><Arrow diagonal /></div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
                <ul aria-label={`${capability.title} skills`}>
                  {capability.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="journey" className="section-wrap section-space journey-section" aria-labelledby="journey-title">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">Career journey</p><h2 id="journey-title">A practical bridge between business and technology.</h2></div>
            <p className="section-intro">Each role has sharpened the same instinct: understand what people need, make the path visible and support delivery with care.</p>
          </div>
          <ol className="journey-list">
            {portfolio.journey.map((role) => (
              <li className="journey-card" key={`${role.company}-${role.title}`}>
                <p className="journey-period">{role.period}</p>
                <div className="journey-main"><p className="journey-company">{role.company}</p><h3>{role.title}</h3></div>
                <div className="journey-detail"><p>{role.description}</p><div>{role.focus.map((item) => <span key={item}>{item}</span>)}</div></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section-wrap section-space methods-section" aria-labelledby="methods-title">
          <div className="section-heading"><p className="eyebrow">Tools & methods</p><h2 id="methods-title">The details that keep work moving.</h2></div>
          <div className="methods-grid">
            {portfolio.methods.map((method, index) => (
              <article className="method" key={method.title}>
                <span className="method-number">0{index + 1}</span>
                <h3>{method.title}</h3>
                <ul>{method.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="section-wrap section-space about-section" aria-labelledby="about-title">
          <div className="about-index"><span>04</span><span className="index-line" /></div>
          <div><p className="eyebrow">About Amin</p><h2 id="about-title">The best analysis brings people closer to the decision.</h2></div>
          <p className="about-copy">{portfolio.about}</p>
        </section>

        <section id="contact" className="contact section-wrap" aria-labelledby="contact-title">
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title">Have a role or problem worth exploring?</h2>
          <a className="contact-email" href={`mailto:${portfolio.email}`}>{portfolio.email} <Arrow /></a>
          <div className="contact-meta"><span>{portfolio.location}</span><span>Available for Business Analyst, Project Management, Product or tech-hybrid opportunities</span></div>
        </section>
      </main>

      <footer className="site-footer section-wrap"><span>© {new Date().getFullYear()} AMIN AZIZ</span><a href="#top">BACK TO TOP ↑</a></footer>
    </div>
  )
}

export default App
