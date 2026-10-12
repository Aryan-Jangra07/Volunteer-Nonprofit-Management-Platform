import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import OpportunityCard from '../../components/OpportunityCard'
import { useOpportunities } from '../../context/OpportunityContext'
import { MOCK_OPPORTUNITIES } from '../Opportunities/mockOpportunities'
import { formatDate } from '../../utils/format'
import './Home.css'

function Home() {
  const { opportunities: liveOpps } = useOpportunities()
  const showcasePool = liveOpps.length >= 4 ? liveOpps : MOCK_OPPORTUNITIES
  const heroFeatured = showcasePool[0]
  const showcaseFeatured = showcasePool[1]
  const showcaseSideItems = showcasePool.slice(2, 4)

  const [activeStep, setActiveStep] = useState(0)
  const [journeyProgress, setJourneyProgress] = useState(1)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    if (prefersReducedMotion) {
      revealElements.forEach((el) => el.classList.add('reveal-visible'))
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    if (!prefersReducedMotion) {
      revealElements.forEach((el) => revealObserver.observe(el))
    }

    const stepItems = document.querySelectorAll('.editorial-step-item')
    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-step-index'))
            if (!isNaN(idx)) {
              setActiveStep(idx)
            }
          }
        })
      },
      { threshold: 0.55 }
    )
    stepItems.forEach((el) => stepObserver.observe(el))

    const journeySec = document.getElementById('journey-section')
    const handleScroll = () => {
      if (journeySec) {
        const rect = journeySec.getBoundingClientRect()
        const windowHeight = window.innerHeight
        if (rect.top < windowHeight && rect.bottom > 0) {
          const pct = Math.min(Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0), 1)
          setJourneyProgress(Math.min(Math.floor(pct * 4) + 1, 4))
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      revealElements.forEach((el) => revealObserver.unobserve(el))
      stepItems.forEach((el) => stepObserver.unobserve(el))
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <main className="home-canvas">
      <section className="hero-editorial">
        <div className="section-container hero-grid">
          <div className="hero-left">
            <div className="hero-eyebrow-pill">
              <span className="eyebrow-dot" />
              <span>MAKE TIME. MAKE AN IMPACT.</span>
            </div>

            <h1 className="hero-title">
              Your time can<br />
              <span className="hero-title-accent">change a community.</span>
            </h1>

            <p className="hero-description">
              ServeHub connects volunteers with nonprofit organizations. Discover local opportunities, register for events, and track your volunteering hours in one place.
            </p>

            <div className="hero-action-row">
              <Link to="/opportunities" className="btn btn-primary btn-large">
                Explore Opportunities <span className="btn-arrow">→</span>
              </Link>
              <Link to="/register" className="btn btn-secondary btn-large">
                Get Started
              </Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-product-showcase">
              <div className="showcase-top-bar">
                <span className="showcase-category">{heroFeatured.category || 'Community'}</span>
                <span className="showcase-date-badge">
                  {heroFeatured.date || (heroFeatured.event_date ? formatDate(heroFeatured.event_date) : 'Upcoming')}
                </span>
              </div>

              <div className="showcase-body">
                <h3 className="showcase-event-title">{heroFeatured.title}</h3>
                <p className="showcase-org-name">
                  Organized by <strong>{heroFeatured.organization_name || heroFeatured.organization || 'Partner Organization'}</strong>
                </p>

                <p className="showcase-description-text">{heroFeatured.description}</p>

                <div className="showcase-meta-grid">
                  <div className="meta-item">
                    <span className="meta-label">Location</span>
                    <span className="meta-val">{heroFeatured.location || 'TBD'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Availability</span>
                    <span className="meta-val spots-available">
                      {(heroFeatured.spots_remaining ?? heroFeatured.spots ?? '?')} spots remaining
                    </span>
                  </div>
                </div>
              </div>

              <div className="showcase-footer">
                <Link to={`/opportunities/${heroFeatured.id}`} className="showcase-cta-link">
                  View Event Details <span className="btn-arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="statement-section">
        <div className="section-container">
          <div className="statement-content reveal">
            <div className="statement-typography">
              <span className="statement-line-1">GOOD PEOPLE</span>
              <span className="statement-line-2">ARE ALREADY HERE.</span>
            </div>
            <p className="statement-subtext reveal-left">
              ServeHub makes it easier to find where your time can matter most. Connecting individuals, neighbors, and non-profits into an active network for good.
            </p>
          </div>
        </div>
      </section>

      <section id="journey-section" className="journey-section reveal">
        <div className="section-container">
          <div className="journey-header">
            <span className="section-label">THE VOLUNTEER JOURNEY</span>
            <h2>How purposeful action happens.</h2>
          </div>

          <div className="journey-timeline-desktop">
            <div className="timeline-track">
              <div
                className="timeline-progress-bar"
                style={{ width: `${((journeyProgress - 1) / 3) * 100}%` }}
              />
            </div>

            <div className="timeline-stages-grid">
              <div className={`timeline-stage-col ${journeyProgress >= 1 ? 'stage-active' : ''}`}>
                <div className="stage-node-dot" />
                <span className="stage-num">01</span>
                <h4 className="stage-title">DISCOVER</h4>
                <p className="stage-desc">Filter verified local opportunities by cause, date, or skillset.</p>
              </div>

              <div className={`timeline-stage-col ${journeyProgress >= 2 ? 'stage-active' : ''}`}>
                <div className="stage-node-dot" />
                <span className="stage-num">02</span>
                <h4 className="stage-title">CONNECT</h4>
                <p className="stage-desc">Sign up directly and connect with non-profit event coordinators.</p>
              </div>

              <div className={`timeline-stage-col ${journeyProgress >= 3 ? 'stage-active' : ''}`}>
                <div className="stage-node-dot" />
                <span className="stage-num">03</span>
                <h4 className="stage-title">PARTICIPATE</h4>
                <p className="stage-desc">Show up on site, offer your time, and support community projects.</p>
              </div>

              <div className={`timeline-stage-col ${journeyProgress >= 4 ? 'stage-active' : ''}`}>
                <div className="stage-node-dot" />
                <span className="stage-num">04</span>
                <h4 className="stage-title">IMPACT</h4>
                <p className="stage-desc">Track your volunteer hours and build a record of community impact.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="opportunities" className="editorial-showcase-section reveal">
        <div className="section-container">
          <div className="showcase-header-row">
            <div>
              <span className="section-label">CURATED CAUSES</span>
              <h2 className="showcase-section-title">Find something worth showing up for.</h2>
            </div>
            <Link to="/opportunities" className="explore-all-link">
              Explore all opportunities <span className="btn-arrow">→</span>
            </Link>
          </div>

          <div className="magazine-showcase-grid">
            <div className="magazine-hero-card reveal-left">
              <div className="featured-hero-badge">Featured Cause</div>
              <OpportunityCard opportunity={showcaseFeatured} />
            </div>

            <div className="magazine-side-stack reveal-right">
              {showcaseSideItems.map((item) => (
                <div key={item.id} className="magazine-side-item">
                  <OpportunityCard opportunity={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="community-equation-section reveal">
        <div className="section-container">
          <div className="equation-canvas">
            <div className="equation-row">
              <span className="equation-term term-left reveal-left">VOLUNTEERS</span>
              <span className="equation-operator">+</span>
              <span className="equation-term term-right reveal-right">ORGANIZATIONS</span>
            </div>
            <div className="equation-result-row">
              <span className="equation-operator">=</span>
              <span className="equation-result-highlight">IMPACT</span>
            </div>
            <p className="equation-subtext">
              Together, small personal actions transform into meaningful, lasting community change.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="editorial-works-section reveal">
        <div className="section-container">
          <div className="works-header">
            <span className="section-label">PLATFORM GUIDE</span>
            <h2>How ServeHub Works</h2>
          </div>

          <div className="editorial-works-sequence">
            <div
              className={`editorial-step-item ${activeStep === 0 ? 'step-active' : ''}`}
              data-step-index="0"
            >
              <div className="step-num-col">01</div>
              <div className="step-content-col">
                <h3>Discover an opportunity</h3>
                <p>
                  Explore causes filtered by categories like Food Security, Education, Environment, and Community Support. Find event times that align with your weekly schedule.
                </p>
              </div>
            </div>

            <div
              className={`editorial-step-item ${activeStep === 1 ? 'step-active' : ''}`}
              data-step-index="1"
            >
              <div className="step-num-col">02</div>
              <div className="step-content-col">
                <h3>Sign up and show up</h3>
                <p>
                  Register for the opportunity to confirm your spot. Check the event details, location, and time — then show up and contribute.
                </p>
              </div>
            </div>

            <div
              className={`editorial-step-item ${activeStep === 2 ? 'step-active' : ''}`}
              data-step-index="2"
            >
              <div className="step-num-col">03</div>
              <div className="step-content-col">
                <h3>Track your hours</h3>
                <p>
                  After the event, coordinators log your volunteer hours. View your history and build a personal record of community contributions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta-section reveal">
        <div className="section-container">
          <div className="editorial-cta-canvas">
            <div className="cta-accent-ring" />
            <h2 className="cta-headline">
              Ready to do something<br />that matters?
            </h2>
            <p className="cta-subtext">
              Join dedicated volunteers and non-profit leaders taking real action across communities today.
            </p>

            <div className="cta-actions-group">
              <Link to="/opportunities" className="btn btn-primary btn-large">
                Explore Opportunities <span className="btn-arrow">→</span>
              </Link>
              <Link to="/register" className="btn btn-secondary btn-large">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home

