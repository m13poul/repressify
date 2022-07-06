import React from "react";
import ReactDom from "react-dom";
import Header from "../components/Header.component";
import { Routes, Route } from "react-router-dom";
import About from "./About";
import Contact from "../components/contact/Contact.component";
import { useNavigate } from "react-router-dom";
import "./Home.styles.scss";

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="container mx-auto">
        <Header />
        <Routes>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
        </Routes>
        <div className="slogan-card">
          An old school minded <br /> modern RSS Reader
          <p className="subtitle-page">A Modern, yet old school minded & privacy friendly newsreader & podcast player.</p>
          <button className="signup-button" onClick={() => navigate("/login")}>
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
