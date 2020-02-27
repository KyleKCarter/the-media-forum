import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NavBar = (props) => {

    const logout = () => {
        axios.get('/auth/logout')
            .then(() => props.history.push('/'))
    }

    return (
        <body>
            <h1>Welcome</h1>
            <ul>
                <Link to='/categories'><li>Categories</li></Link>
                <Link to='/login'><li>Login</li></Link>
                <button onClick={logout}>Logout</button>
            </ul>
        </body>
    )
}

export default NavBar