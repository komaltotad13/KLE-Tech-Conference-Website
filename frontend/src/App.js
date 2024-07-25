import "./App.css";
// import { Routes, Switch, Route } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Login_rev from "./components/Login_rev";
import Register from "./components/Register";
import Home from "./components/Home";
import { useState } from "react";
import App1 from "./Pdf-FrontEnd/App1";
import Submission from "./components/submission";
import AuthorConsole from "./components/author-console";
import Reviewer from "./components/Reviewer";
import About from "./components/About";

function App() {
  const [user, setLoginUser] = useState({});
  return (
    // <div className="App">
    <Routes>
      <Route
        path="/"
        element={
          user && user._id ? (
            <Home setLoginUser={setLoginUser} />
          ) : (
            <Home setLoginUser={setLoginUser} />
          )
        }
      ></Route>
      <Route
        path="/login"
        element={<Login setLoginUser={setLoginUser} />}
      ></Route>
      <Route
        path="/login_rev"
        element={<Login_rev setLoginUser={setLoginUser} />}
      ></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/reviewer" element={<Reviewer />}></Route>
      <Route path="/about" element={<About />}></Route>
      <Route path="/submission" element={<Submission user={user} />}></Route>
      <Route path="/pdf" element={<App1 user={user} />}></Route>
      {/* <Route path="/upload-files" element={<App1 user={user} />}></Route> */}
      <Route
        path="/authorConsole"
        element={<AuthorConsole user={user} />}
      ></Route>
    </Routes>
    // </div>
  );
}

export default App;
