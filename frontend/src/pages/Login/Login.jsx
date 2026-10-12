import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { loginApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import '../Auth.css'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [infoMessage] = useState(location.state?.message || '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setError('Please provide both email and password.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const response = await loginApi({ email: trimmedEmail, password })
      login(response.data.token, response.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-brand">ServeHub</Link>
          <h1>Welcome Back</h1>
          <p>Sign in to continue connecting with community causes.</p>
        </div>

        {infoMessage && <div className="alert-success">{infoMessage}</div>}
        {error && <div className="alert-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (error) setError('') }}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login
