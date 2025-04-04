import { Link } from "react-router-dom"

const PageNotFound = () => {
    return (
        <div className="page-not-found">
            <h1>Error 404 - Page is not available</h1>
            <Link to='/'>Home</Link>
        </div>
    )
}

export default PageNotFound