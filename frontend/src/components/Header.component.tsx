import logo from "./logo.svg";
import { FC } from "react";
import "../App.styles.scss";
import "./Header.styles.scss";
import { Link } from "react-router-dom";

const Header: FC = () => {
  const user = localStorage.getItem("user");
  return (
    <div>
      <div className="container mx-auto">
        <header className="">
          <div className="header-container">
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              <h1 className="projectTitle">{`</Re-Pressify>`}</h1>
              <p className="subtitle">Minimal Newsreader & Podcast Listener</p>
            </Link>
            {!user ? (
              <Link to="/login">
                <button>Login</button>
              </Link>
            ) : null}
            <Link to="about">
              <button>About</button>
            </Link>
            <Link to="contact">
              <button>Contact</button>
            </Link>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;
