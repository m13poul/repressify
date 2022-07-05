import React from "react";
import Header from "../components/Header.component";
import { Routes, Route } from "react-router-dom";
import About from "./About";
import Contact from "../components/contact/Contact.component";
import "./Home.styles.scss";
import img from "../../../../../Pictures/Screenshots/Screenshot from 2022-06-08 22-04-39.png";

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
          <p className="subtitle-page">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga ipsa
            quaerat obcaecati sequi impedit quam, facere placeat illum
            perspiciatis pariatur voluptatem rem totam quibusdam voluptatibus
            numquam cupiditate vel unde eaque.
          </p>
          <button className="signup-button">Start Now</button>
        </div>
        <div></div>
      </div>
      <div>
        <img src={img} alt="" className="homepage-img" />
      </div>
    </div>
  );
}

export default Home;
