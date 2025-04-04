import { useState } from 'react'
import {Link, useNavigate} from 'react-router'
import { useAuthContext } from '../hooks/useAuthContext'

const Login = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState(null)
    const { dispatch } = useAuthContext()

    const loginAttempt = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('https://asswd-backend.onrender.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()
            
            if (!response.ok) {
                setError(data.message)
                return
            }

            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('id', data.user.id)
            localStorage.setItem('email', data.user.email)
            localStorage.setItem('token', data.user.token)
            dispatch({type: 'LOGIN', payload: data.user})
            setError(null)
            setMessage("Login was successful!")
            console.log(data.message)
            setTimeout(() => {
                navigate('/countries')
            }, 2000)
            // Handle successful login (e.g., save token, redirect)
            
        } catch (error) {
            console.error('Login error:', error)
        }
    }

    return (
        <div className="form-container">
            <form className="auth-form">
                <div className="single-input">
                    <label>Email Address:</label>
                    <input 
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address..."
                    />
                </div>
                <div className="single-input">
                    <label>Password:</label>
                    <input 
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password..."
                    />
                </div>
                {error && <div className='auth-error'>{error}</div>}
                {message && <div className='auth-message'>{message}</div>}
                <button onClick={loginAttempt}>Login</button>
                <p>Doesn't have an account yet? Register <Link to='/register'>HERE</Link></p>
            </form>
        </div>
    )
}

export default Login