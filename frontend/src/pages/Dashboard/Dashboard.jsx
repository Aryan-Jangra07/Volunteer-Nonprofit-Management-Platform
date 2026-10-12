import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useOpportunities } from '../../context/OpportunityContext'
import OpportunityCard from '../../components/OpportunityCard'
import { getDashboardStatsApi } from '../../services/api'
import './Dashboard.css'

function Dashboard() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth()
  const { opportunities, loading: oppsLoading } = useOpportunities()

  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [statsError, setStatsError] = useState(null)

  const isCoordinator = user?.role === 'COORDINATOR'

  useEffect(() => {
    if (!token) return
    setStatsLoading(true)
    setStatsError(null)
    getDashboardStatsApi(token)
      .then((res) => setStats(res?.data?.stats || null))
      .catch((err) => setStatsError(err.message || 'Failed to load live statistics'))
      .finally(() => setStatsLoading(false))
  }, [token])

  if (authLoading) {
    return (
      <main className="dashboard-page">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading dashboard...</p>
        </div>
      </main>
    )
  }

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />

  const s = stats || {}
  const summaryCards = isCoordinator
    ? [
        { icon: '🏢', label: 'Organizations', value: s.organizations_count ?? 0, caption: 'Organizations you manage' },
        { icon: '📋', label: 'Active Opportunities', value: s.active_opportunities ?? 0, caption: 'Published live opportunities' },
        { icon: '👥', label: 'Volunteers Registered', value: s.total_volunteers_registered ?? 0, caption: 'Total sign-ups across your opportunities' },
      ]
    : [
        { icon: '📅', label: 'Upcoming Opportunities', value: s.upcoming_count ?? 0, caption: 'Scheduled events & commitments' },
        { icon: '✅', label: 'Completed Opportunities', value: s.completed_count ?? 0, caption: 'Past events attended' },
        { icon: '⏱️', label: 'Volunteer Hours', value: `${s.total_hours ?? 0} hrs`, caption: 'Total verified contribution time' },
      ]

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <section className="dashboard-welcome">
          <h1>Welcome back, {user.full_name || 'Volunteer'} 👋</h1>
          <p>
            {isCoordinator
              ? 'Here is an overview of your organizations and volunteer engagement.'
              : 'Here is an overview of your volunteering activities and community engagement.'}
          </p>
        </section>

        {statsError && <div className="alert-error" style={{ marginBottom: '0.5rem' }}>{statsError}</div>}

        <section className="dashboard-summary">
          {summaryCards.map(({ icon, label, value, caption }) => (
            <div key={label} className="summary-card">
              <div className="summary-card-header">
                <span className="summary-icon">{icon}</span>
                <h3>{label}</h3>
              </div>
              <div className="summary-value">
                {statsLoading ? <span className="loading-spinner" style={{ width: 20, height: 20 }} /> : value}
              </div>
              <p className="summary-caption">{caption}</p>
            </div>
          ))}
        </section>

        <section className="dashboard-actions-card">
          <h2>Quick Actions</h2>
          <p>
            {isCoordinator
              ? 'Manage your organizations or post new volunteer opportunities.'
              : 'Find new ways to contribute or manage your profile details.'}
          </p>
          <div className="dashboard-actions-btns">
            <Link to={isCoordinator ? '/manage-opportunities' : '/opportunities'} className="btn btn-primary">
              {isCoordinator ? 'Manage Opportunities' : 'Browse Opportunities'}
            </Link>
            {!isCoordinator && <Link to="/my-signups" className="btn btn-secondary">My Signups</Link>}
            {!isCoordinator && <Link to="/my-hours" className="btn btn-secondary">My Hours</Link>}
            {isCoordinator && <Link to="/coordinator-hours" className="btn btn-secondary">Hours Management</Link>}
            <Link to={isCoordinator ? '/organizations' : '/profile'} className="btn btn-outline">
              {isCoordinator ? 'My Organizations' : 'View Profile'}
            </Link>
          </div>
        </section>

        <section className="dashboard-featured">
          <div className="dashboard-featured-header">
            <div>
              <h2>Featured Opportunities</h2>
              <p>Discover upcoming ways to make a difference.</p>
            </div>
            <Link to="/opportunities" className="btn btn-secondary">View All Opportunities →</Link>
          </div>
          {oppsLoading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p>Loading opportunities...</p>
            </div>
          ) : (
            <div className="dashboard-opportunities-grid">
              {opportunities.slice(0, 3).map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default Dashboard
