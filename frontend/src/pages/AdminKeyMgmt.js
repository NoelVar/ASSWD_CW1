import { useEffect, useState } from "react"

const AdminKeyMgmt = () => {

    const [allKeys, setAllKeys] = useState(null)
    const [message, setMessage] = useState(null)
    const [selected, setSelected] = useState(null)
    const [email, setEmail] = useState(null)

    const popUpGenerator = (passedInData) => {
        setMessage(passedInData)
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    const token = localStorage.getItem('token')

    useEffect(() => {
        const getAllKeys = async () => {
            
            const response = await fetch('https://asswd-backend.onrender.com/api/get-all-keys', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setAllKeys(data)
                console.log(data)
            }
        }

        getAllKeys()
    }, [])

    const handleDelete = async (e) => {
        e.preventDefault()
        if (!selected) {
            popUpGenerator("Please select an API key!")
            return 
        }
        if (!email) {
            popUpGenerator("Couldnt select user!")
            return
        }

        try {
            const response = await fetch('https://asswd-backend.onrender.com/api/delete-key', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: selected, email })
            })
            const data = await response.json()

            if (!response.ok) {
                popUpGenerator(data.message)
                return
            }
            if (response.ok) {
                popUpGenerator("The selected API key has been deleted from the user!")
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
            <h1>Admin Key Management</h1>
            {message && 
                <p className="message-popup">{message}</p>
            }
            <table className="all-keys-table">
            {allKeys
                ?
                 allKeys.map((user) => (
                    user.apikeys.map((key) => (
                        <tr>
                            <th>{user.username}</th>
                            <td>
                                <input 
                                    type="radio" 
                                    name="radio"
                                    onClick={(e) => setSelected(key._id) + setEmail(user.email)}
                                />
                                <label>{key.key}</label>
                            </td>
                            <td style={key.status == 'active' ? {color:"green"} : {color:'red'}}>{key.status}</td>
                        </tr>
                    ))
                 ))
                : <p>Couldn't get User</p>
             
            }
            </table>
            <div className="admin-actions">
                <button className="deactivate-btn" onClick={handleDelete}>Delete Key</button>
            </div>
        </div>
    )
}

export default AdminKeyMgmt