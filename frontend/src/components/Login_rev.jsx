import React, { useState } from "react"
import "./Login.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Login_rev = ({ setLoginUser }) => {

    const navigate = useNavigate()



    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const login = () => {
        axios.post("http://localhost:7500/login_rev", user)
            .then(res => {
                // alert(res.data.message)
                setLoginUser(res.data.user)
                if (res.data.message === "Login Successful") {
                    navigate("/reviewer")
                } else if (res.data.message === "Password didn't match") {
                    const paraElement = document.getElementById("par");
                    if (paraElement) {
                        paraElement.textContent = "Password didn't match";
                    }
                    navigate("/login_rev")
                } else if (res.data.message === "Reviewer not registered") {
                    // Display message in paragraph with id "para"
                    const paraElement = document.getElementById("para");
                    if (paraElement) {
                        paraElement.textContent = "Reviewer not registered.";
                    }
                    navigate("/login_rev");
                }
            })
    }

    return (
        <div className="login container">
            <h1>Login</h1>
            <input type="text" name="email" value={user.email} onChange={handleChange} placeholder="Enter your Email"></input>
            <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Enter your Password" ></input>
            <div className="button" onClick={login}>Login</div>
            <p id="para"></p>
            <p id="par"></p>
        </div>
    )
}

export default Login_rev