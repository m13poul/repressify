import React from "react";
import Header from "../components/Header.component";
import { Routes, Route } from "react-router-dom";
import About from "./About";
import Contact from "../components/contact/Contact.component";
import "./Home.styles.scss";

function Home() {
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
          <p className="subtitle-page"></p>
          <button className="signup-button">Start Now</button>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default Home;
