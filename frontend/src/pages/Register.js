import { useState } from 'react'
import {Link, useNavigate} from 'react-router'
import { useAuthContext } from '../hooks/useAuthContext'

const Register = () => {

    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState(null)
    const { dispatch } = useAuthContext()

    const registerAttempt = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('https://asswd-backend.onrender.com/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, confirmPassword })
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
            setMessage("Registering was successful!")
            console.log(data.message)
            setTimeout(() => {
                navigate('/countries')
            }, 2000)
            // Handle successful login (e.g., save token, redirect)
            
        } catch (error) {
            console.error('Registering error:', error)
        }
    }

    return (
        <div className="form-container">
            <form className="auth-form">
            <div className="single-input">
                    <label>Username:</label>
                    <input 
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter new username..."
                    />
                </div>
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
                        placeholder="Enter new password..."
                    />
                </div>
                <div className="single-input">
                    <label>Confirm Password:</label>
                    <input 
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Enter password again..."
                    />
                </div>
                {error && <div className='auth-error'>{error}</div>}
                {message && <div className='auth-message'>{message}</div>}
                <button onClick={registerAttempt}>Register</button>
                <p>Already have an account? Login <Link to='/login'>HERE</Link></p>
            </form>
        </div>
    )
}

export default Register