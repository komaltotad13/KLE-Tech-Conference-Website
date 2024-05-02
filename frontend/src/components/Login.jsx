import React, { useState, useEffect } from "react"
import "./Login.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Login = ({ setLoginUser }) => {

    const navigate = useNavigate()



    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const [userEmail, setUserEmail] = useState(user.email); // New state to store email

    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    useEffect(() => {
        setUserEmail(user.email);
    }, [user.email]);

    useEffect(() => {
        console.log("User Email1:", userEmail);
    }, [userEmail]);

    const login = () => {
        // axios.get("https://wt-project-backend.vercel.app/login").
        axios.post("https://wt-project-backend.vercel.app/login", user)
            .then(res => {
                console.log("User Object1:", user); // Log the entire user object
                setLoginUser(res.data.user);
                setUser({
                    email: "",
                    password: ""
                });
                console.log("User Object2:", user); // Log the entire user object
                if (res.data.status === "ok") {
                    // alert(res.data.message);
                    navigate("/authorConsole");
                } else if (res.data.status === "notOK") {
                    setUserEmail(user.email);
                    // alert(res.data.message);
                    // navigate("/submission", { state: { userEmail } });
                    navigate("/submission");
                } else if (res.data.status === "PWerror") {
                    const paraElement = document.getElementById("pari");
                    if (paraElement) {
                        paraElement.textContent = "Password didn't match";
                    }
                    // alert(res.data.message);
                    navigate("/login")

                } else {
                    const paraElement = document.getElementById("para");
                    if (paraElement) {
                        paraElement.textContent = "Author not registered.";
                    }
                    // alert(res.data.message);
                    navigate("/login")
                }
            })
            .catch(error => {
                console.error("Error during login:", error);
                // Handle error if needed
            });
    }

    return (
        <div className="login container">
            <h1>Login</h1>
            <input type="text" name="email" value={user.email} onChange={handleChange} placeholder="Enter your Email"></input>
            <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Enter your Password" ></input>
            <div className="button" id="login-btn1" onClick={login}>Login</div>
            <div>or</div>
            <div className="button" onClick={() => navigate("/register")}>Register</div>
            <p id="para"></p>
            <p id="pari"></p>
        </div>
    )
}

export default Login