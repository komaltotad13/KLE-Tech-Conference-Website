import React, { useState } from "react";
import "./Navbar.css";
import { Link, Navigate } from "react-router-dom";
import kle_logo2 from "../images/kle_logo.jpg";

function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
 
  return (
    <>
      <div className="nav-container">
        <Link to="/">
          <div className="nav-logo nav-link">
            <img src={kle_logo2} alt="kle_logo" height={60} width={270} />
          </div>
        </Link>
        <Link to="/">
          <div className="nav-link">Home</div>
        </Link>
        <Link to="/">
          <div className="nav-link">About</div>
        </Link>
        
        <Link to="/">
          {" "}
          <div className="nav-link">Conferences</div>
        </Link>
        {/* <Link to="/">
          {" "}
          <div className="nav-link">Welcome</div>
        </Link>
        <Link to="/">
          {" "}
          <div className="nav-link">Partners</div>
        </Link>
        <Link to="/">
          {" "}
          <div className="nav-link">Sponsers</div>
        </Link> */}
        <Link to="/">
          {" "}
          <div className="nav-link">Contact</div>
        </Link>
        {/* <Link to="/register">
          <div className="nav-link reg-btn">Register</div>
        </Link> */}
        <div className="dropdown">
          <button className="nav-link reg-btn"  onClick={toggleDropdown}>Login</button>
          <div className={`dropdown-content ${dropdownVisible ? "show" : ""}`}>
            <Link to="/login">Author</Link>
            <Link to="/login_rev">Reviewer</Link>
          </div>
        </div>
      </div>
      <div className='nav-main-container'>
        <div className="centered-text">
          <div className="head1d"><span className="head1">KLE Technological University Research Conference 2024</span></div>
          <div className="head2d"><span className="head2">Unveiling Innovations, Exploring Frontiers</span><br /><br /><br /></div>
          <div className="head3d"><span className="head3">Join us for the KLE Technological University Research Conference 2024,<br /> where brilliant minds converge to explore groundbreaking <br />research and push the boundaries of knowledge.</span></div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
