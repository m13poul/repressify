import { useState, useEffect, useContext } from "react";
import { FC } from "react";
import "./App.styles.scss";
import { Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Header from "./components/Header.component";
import SourcesView from "./components/sourcesView/SourcesView.component copy";
import AddFeed from "./components/addFeed/AddFeed.component";
import CurrentContent from "./components/currentContent/CurrentContent.component";
import Contact from "./components/contact/Contact.component";
import Credit from "./components/credit/Credit.component";
import Spinner from "./components/loadingSpinner/Spinner.component";
import FormSuccess from "./components/formSuccess/FormSuccess.component";
import AudioPlayer from "./components/audioPlayer/AudioPlayer.component";
import Player from "./components/Player/Player.component";
import Gallery from "./components/gallery/Gallery.component";
import { ClientSideContext } from "./contexts/clientContext";
import PasswordRecovery from "./components/passwordRecovery/passwordRecovery.component";

const App: FC = () => {
  // const [data, dispatch] = useContext(ClientSideContext);
  // console.log(data.favourites);
  return (
    <div className="">
      <div className="container mx-auto">
        <Header />
        <div className="grid">
          <div className="border-right">
            <Routes>
              <Route
                path="*"
                element={
                  <>
                    {/* <AddFeed /> */}
                    <div className="sticky top-0">
                      <SourcesView />
                    </div>
                  </>
                }
              ></Route>
            </Routes>
          </div>
          <div className="grid-cols-3">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <AddFeed />
                    <PasswordRecovery />
                    <Gallery />
                  </>
                }
              ></Route>
              <Route path="/feed">
                <Route
                  path="*"
                  element={
                    <>
                      <CurrentContent />
                      <Credit />
                    </>
                  }
                ></Route>
              </Route>
              {/* <Route path="/" element={<Spinner />}></Route> */}
              <Route path="about" element={<About />}></Route>
              <Route path="contact" element={<Contact />}></Route>
              <Route path="contact/success" element={<FormSuccess />}></Route>
            </Routes>
          </div>
        </div>
        <div className="footer">
          <Player />
        </div>
        <div className="footer">{/* <AudioPlayer />{" "} */}</div>
      </div>
    </div>
  );
};

export default App;
