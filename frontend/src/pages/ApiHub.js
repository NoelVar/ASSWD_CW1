import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAPIContext } from "../hooks/useAPIContext"

const ApiHub = () => {
    const {keys, dispatch} = useAPIContext()

    // const [keys, setKeys] = useState(null)
    const [message, setMessage] = useState(null)
    const [selected, setSelected] = useState(null)
    const token = localStorage.getItem('token')

    useEffect(() => {
        const getAllKeys = async () => {
            const email = localStorage.getItem('email')
            
            const response = await fetch('http://localhost:7000/api/all-user-keys', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email })
            })

            if (response.ok) {
                const data = await response.json()
                dispatch({type: 'SET_KEYS', payload: data})
            }
        }

        getAllKeys()
    }, [])

    const popUpGenerator = (passedInData) => {
        setMessage(passedInData)
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    const handleGeneration = async (e) => {
        e.preventDefault()
        const id = localStorage.getItem('id')

        try {
            const response = await fetch('http://localhost:7000/api/generate-key', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            })

            const data = await response.json()

            if (!response.ok) {
                popUpGenerator(data.message)
                return
            }
            
            if (response.ok) {
                popUpGenerator(data.message)
                dispatch({type: 'GENERATE_KEYS', payload: data.key[0]})
                setTimeout(() => {
                    window.location.reload()
                }, 3000)
            }
            
        } catch (err) {
            console.error(err.message)
            popUpGenerator(err.message)
            return
        }
    }

    const handleActivation = async (e) => {
        e.preventDefault()
        const email = localStorage.getItem('email')
        if (!selected) {
            popUpGenerator("Please select an API key!")
            return 
        }

        try {
            const response = await fetch('http://localhost:7000/api/activate-key', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id: selected, email })
            })
            const data = await response.json()

            if (!response.ok) {
                popUpGenerator(data.message)
                return
            }
            if (response.ok) {
                popUpGenerator("Selected API key has been activated!")
                setTimeout(() => {
                    window.location.reload()
                }, 3000)
            }
            
            
        } catch (err) {
            console.error(err.message)
            popUpGenerator(err.message)
            return
        }
    }
    
    const handleDeactivation = async (e) => {
        e.preventDefault()
        const email = localStorage.getItem('email')

        try {
            const response = await fetch('http://localhost:7000/api/deactivate-key', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email })
            })
            const data = await response.json()

            if (!response.ok) {
                popUpGenerator(data.message)
                return
            }  

            if (response.ok) {
                popUpGenerator(data.message)
                setTimeout(() => {
                    window.location.reload()
                }, 3000)
            }
            
        } catch (err) {
            console.error(err.message)
            popUpGenerator(err.message)
            return
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        const email = localStorage.getItem('email')
        if (!selected) {
            popUpGenerator("Please select an API key!")
            return 
        }

        try {
            const response = await fetch('http://localhost:7000/api/delete-key', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id: selected, email })
            })
            const data = await response.json()

            if (!response.ok) {
                popUpGenerator(data.message)
                return
            }
            if (response.ok) {
                popUpGenerator("Selected API key has been deleted!")
                setTimeout(() => {
                    window.location.reload()
                }, 3000)
            }
            
            
        } catch (err) {
            console.error(err.message)
            popUpGenerator(err.message)
            return
        }
    }

    return (
        <div className="api-hub">
            <h1>Api Hub</h1>
            <div className="generate-container">
                <h2>Generate new key</h2>
                <p>Generate up to 10 API keys which you can use to access the countries.</p>
                <button onClick={handleGeneration}>Generate new key</button>
                {message && 
                    <p className="message-popup">{message}</p>
                }
            </div>
            <div className="user-keys">
                <table>
                    <tr>
                        <th colSpan={2}>
                            Your current API keys
                        </th>
                    </tr>
                    {keys &&
                        keys.map((key, i) => (
                            <tr>
                                <th>API key {i+1}: </th>
                                <td style={key.status == 'active' ? {color:"white"} : {color:'gray'}}>
                                    <input 
                                        type="radio" 
                                        name="radio"
                                        onClick={(e) => setSelected(key._id)}
                                    />
                                    <label>{key.key}</label>
                                </td>
                            </tr>
                        ))
                    } 
                    {keys && keys.length===0 && 
                        <tr>
                            <td className="no-keys"><i>You dont have any api keys yet!</i></td>
                        </tr>
                    }
                </table>
                <div className="api-action-container">
                    <button onClick={handleActivation}>Activate selected key</button>
                    <button className="deactivate-btn" onClick={handleDeactivation}>Deactivate all keys</button>
                    <button className="deactivate-btn" onClick={handleDelete}>Delete Key</button>
                </div>
            </div>
            {/* <div className="api-cards">
                <div className="api-card">
                    <h2 className="card-title">Generate new key</h2>
                    <p className="card-description">
                        Generate up to 10 API keys which you can use to access the countries.
                    </p>
                    <Link to='/generate-key'>More here</Link>
                </div>
                <div className="api-card">
                    <h2 className="card-title">Activate API key</h2>
                    <p className="card-description">
                        Select the API key you would like to use and acitvate.
                    </p>
                    <Link to='/generate-key'>More here</Link>
                </div>
                <div className="api-card">
                    <h2 className="card-title">Delete API key</h2>
                    <p className="card-description">
                        Delete an API keys that are unused.
                    </p>
                    <Link to='/generate-key'>More here</Link>
                </div>
            </div> */}
        </div>
    )
}

export default ApiHub