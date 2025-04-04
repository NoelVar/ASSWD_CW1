import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext"

const Logout = () => {

    const navigate = useNavigate()
    const { dispatch } = useAuthContext()

    const handleLogout = (e) => {
        e.preventDefault()
        localStorage.clear()
        dispatch({type: 'LOGOUT'})
        navigate('/')
    }

    return (
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
    )
}

export default Logout