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
      const flows = [
        [[0.07, 0.22], [0.24, 0.31], [0.4, 0.2], [0.58, 0.35], [0.79, 0.23]],
        [[0.16, 0.61], [0.34, 0.53], [0.49, 0.67], [0.66, 0.56], [0.88, 0.7]],
        [[0.04, 0.84], [0.22, 0.73], [0.38, 0.84], [0.57, 0.78], [0.76, 0.89]],
      ]
      flows.forEach((flow, flowIndex) => {
        const points = flow.map(([x, y], index) => ({
          x: x * rect.width + (pointer.x - 0.5) * (18 + index * 2),
          y: y * rect.height + (pointer.y - 0.5) * (12 + flowIndex * 4),
        }))
        context.beginPath()
        points.forEach((point, index) => index === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y))
        context.strokeStyle = `rgba(49, 126, 163, ${0.1 + flowIndex * 0.018})`
        context.lineWidth = 1
        context.stroke()
        points.forEach((point, index) => {
          const pulse = 1 + Math.sin(t * 18 + index + flowIndex) * 0.18
          context.fillStyle = index === 2 ? 'rgba(210, 116, 69, .44)' : 'rgba(49, 126, 163, .34)'
          context.beginPath()
          context.arc(point.x, point.y, 2.2 * pulse, 0, Math.PI * 2)
          context.fill()
        })
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
      cursor.dataset.active = String(Boolean(target.closest('a, button, [data-magnetic], .journey-card')))
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

function MagneticTargets() {
  useEffect(() => {
    const precisePointer = window.matchMedia('(pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!precisePointer.matches || reduced.matches) return
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'))
    const cleanups = targets.map((target) => {
      const handleMove = (event: PointerEvent) => {
        const rect = target.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 5
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 5
        target.style.setProperty('--magnet-x', `${x}px`)
        target.style.setProperty('--magnet-y', `${y}px`)
      }
      const reset = () => {
        target.style.setProperty('--magnet-x', '0px')
        target.style.setProperty('--magnet-y', '0px')
      }
      target.addEventListener('pointermove', handleMove)
      target.addEventListener('pointerleave', reset)
      return () => {
        target.removeEventListener('pointermove', handleMove)
        target.removeEventListener('pointerleave', reset)
      }
    })
    return () => cleanups.forEach((cleanup) => cleanup())
  }, [])

  return null
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span className={diagonal ? 'arrow diagonal' : 'arrow'} aria-hidden="true">↗</span>
}

function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.2 8.7v10.1M5.2 5.3v.1M9.7 18.8v-5.9c0-2.4 1.5-4.2 3.8-4.2 2.4 0 3.7 1.7 3.7 4.2v5.9M9.7 13.1c0-2.7 1.5-4.4 3.9-4.4" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function EmailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.9" /><path d="m4.8 7 7.2 5.5L19.2 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

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
      <MagneticTargets />
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
            <div className="hero-side" data-reveal>
              <p>{portfolio.summary}</p>
              <div className="hero-actions">
                <a className="button button-primary" data-magnetic href="#capabilities">Explore capabilities <Arrow /></a>
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
          <div className="section-heading" data-reveal>
            <p className="eyebrow">How I help</p>
            <h2 id="capabilities-title">Clear thinking at every point of delivery.</h2>
            <p className="section-intro">From the first conversation to validation, I make the work around a solution easier to see, discuss and act on.</p>
          </div>
          <div className="capability-grid">
            {portfolio.capabilities.map((capability, index) => (
              <article className="capability-card" data-magnetic data-reveal style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties} key={capability.label}>
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
          <div className="section-heading split-heading" data-reveal>
            <div><p className="eyebrow">Career journey</p><h2 id="journey-title">A practical bridge between business and technology.</h2></div>
            <p className="section-intro">Each role has sharpened the same instinct: understand what people need, make the path visible and support delivery with care.</p>
          </div>
          <ol className="journey-list">
            {portfolio.journey.map((role, index) => (
              <li className="journey-card" data-reveal style={{ '--reveal-delay': `${index * 65}ms` } as React.CSSProperties} key={`${role.company}-${role.title}`}>
                <p className="journey-period">{role.period}</p>
                <div className="journey-main"><p className="journey-company">{role.company}</p><h3>{role.title}</h3></div>
                <div className="journey-detail"><p>{role.description}</p><div>{role.focus.map((item) => <span key={item}>{item}</span>)}</div></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section-wrap section-space methods-section" aria-labelledby="methods-title">
          <div className="section-heading" data-reveal><p className="eyebrow">Tools & methods</p><h2 id="methods-title">The details that keep work moving.</h2></div>
          <div className="methods-grid">
            {portfolio.methods.map((method, index) => (
              <article className="method" data-reveal style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties} key={method.title}>
                <span className="method-number">0{index + 1}</span>
                <h3>{method.title}</h3>
                <ul>{method.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="section-wrap section-space about-section" data-reveal aria-labelledby="about-title">
          <div className="about-index"><span>04</span><span className="index-line" /></div>
          <div><p className="eyebrow">About Amin</p><h2 id="about-title">The best analysis brings people closer to the decision.</h2></div>
          <p className="about-copy">{portfolio.about}</p>
        </section>

        <section id="contact" className="contact section-wrap" aria-labelledby="contact-title">
          <p className="eyebrow" data-reveal>Contact</p>
          <h2 id="contact-title" data-reveal>Have a role or problem worth exploring?</h2>
          <div className="contact-links">
            <a className="contact-link-card" data-magnetic data-reveal href={portfolio.linkedin} target="_blank" rel="noreferrer" aria-label="Visit Amin Aziz on LinkedIn">
              <span className="contact-link-head"><span className="contact-icon"><LinkedInIcon /></span><span className="contact-link-type">LinkedIn</span></span>
              <span className="contact-link-title">Professional profile <Arrow /></span>
            </a>
            <a className="contact-link-card" data-magnetic data-reveal style={{ '--reveal-delay': '70ms' } as React.CSSProperties} href={`mailto:${portfolio.email}`} aria-label={`Email ${portfolio.email}`}>
              <span className="contact-link-head"><span className="contact-icon"><EmailIcon /></span><span className="contact-link-type">Email</span></span>
              <span className="contact-link-title">{portfolio.email} <Arrow /></span>
            </a>
          </div>
          <div className="contact-meta"><span>{portfolio.location}</span><span>Available for Business Analyst, Project Management, Product or tech-hybrid opportunities</span></div>
        </section>
      </main>

      <footer className="site-footer section-wrap"><span>© {new Date().getFullYear()} AMIN AZIZ</span><a href="#top">BACK TO TOP ↑</a></footer>
    </div>
  )
}

export default App
