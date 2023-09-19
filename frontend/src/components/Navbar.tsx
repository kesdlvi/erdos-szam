import React from "react";
import './Navbar.css'

const Navbar = () => {

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <a className = "emoji-logo" href="/">🖖 👑</a>
            </div>
            <ul className='navbar-list'>
               
                <li className='navbar-item'><a href='#about-section'>About</a></li>
                <li className='navbar-item'><a href='./request'>Request</a></li>
                <li className='navbar-item'><a href='#contact'>Contact</a></li>
            </ul>
        </nav>
    )
}

export default Navbar; 