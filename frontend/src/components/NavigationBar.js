import { createRoutesFromChildren, Link } from "react-router-dom"
import Logout from "./Logout"
import { useAuthContext } from "../hooks/useAuthContext"

const NavigationBar = ({ role }) => {
    console.log("RECIEVED " + role)
    const { user } = useAuthContext()

    return (
        <div className="navigation-bar">
            <ul>
                <div className="nav-left-side">
                    <li>
                        <Link to='/' className="logo">CountryCatalogue</Link>
                    </li>
                </div>
                <div className="nav-right-side">
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    {user &&
                        <li>
                            <Link to='/countries'>Countries</Link>
                        </li>
                    }
                    {user &&
                        <li>
                            <Link to='/api'>API keys</Link>
                        </li>
                    }
                    {user && role && role === 'admin' &&
                        <li>
                            <Link to='/manage-keys'>Manage keys</Link>
                        </li>
                    }
                    {user &&
                        <li>
                            <Logout />
                        </li>
                    }
                    {!user &&
                        <li>
                            <Link to='/login'>Login</Link>
                        </li>
                    }
                </div>
            </ul>
        </div>
    )
}

export default NavigationBar