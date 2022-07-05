import { useAudio } from "react-use";
import { GrPlayFill, GrPauseFill, GrBackTen, GrForwardTen } from "react-icons/gr";
import { GoMute, GoUnmute } from "react-icons/go";
import { IoMdCloseCircle } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import { ClientSideContext } from "../../contexts/clientContext";
import { calculateTime } from "./PlayerHelpers";
import "../audioPlayer/AudioPlayer.styles.scss";

function Player() {
  const [urlToBePlayed, dispatch] = useContext(ClientSideContext);
  const [hide, setHide] = useState("");
  const [lastVolumeValue, setLastVolumeValue] = useState(0);
  const [audio, state, controls, ref] = useAudio({
    src: `${urlToBePlayed.currentPodcast}`,
    autoPlay: true,
  });
  useEffect(() => {
    urlToBePlayed.currentPodcast == "" ? setHide("hideClass") : setHide("");
  }, [urlToBePlayed.currentPodcast]);

  return (
    <div className={hide}>
      <div style={{ display: "" }} className={`bg-red-900 text-wheat flex justify-between px-8 items-center podcast-container mx-auto py-1 font-eb_garamond $`}>
        {audio}
        <div>{/* <pre>{JSON.stringify(state, null, 2)}</pre> */}</div>
        <div>
          Now Playing: <br />
          {urlToBePlayed.podcastTitle} <br /> {urlToBePlayed.currentTitle}
        </div>
        <div className="grid grid-cols-1 content-center items-center justify-items-center">
          <div className="flex items-center gap-x-12">
            <GrBackTen className="w-6 h-6 p-1 bg-white rounded-full" onClick={() => controls.seek(state.time - 10)} />
            {state.playing ? (
              <div>
                <button className="bg-white rounded-full p-4 my-2" onClick={controls.pause}>
                  <GrPauseFill />
                </button>
              </div>
            ) : (
              <div>
                <button className="bg-white p-4 my-2 mask mask-circle" onClick={controls.play}>
                  <GrPlayFill />
                </button>
              </div>
            )}
            <GrForwardTen className="w-6 h-6 p-1 bg-white rounded-full" onClick={() => controls.seek(state.time + 10)} />
          </div>
          <div className="flex  gap-x-4">
            <p>{calculateTime(state.time)}</p>
            <input
              type="range"
              min="0"
              max={state.duration}
              step="any"
              // defaultValue="0"
              value={Math.trunc(state.time)}
              className="w-full"
              onChange={(e) => controls.seek(parseFloat(e.target.value))}
            />
            <p className="whitespace-nowrap">{calculateTime(state.duration)}</p>
          </div>
        </div>
        {state.volume ? (
          <GoUnmute
            onClick={() => {
              setLastVolumeValue(state.volume);
              controls.volume(0);
            }}
          />
        ) : (
          <GoMute onClick={() => controls.volume(lastVolumeValue)} />
        )}
        <input
          className=""
          type="range"
          min="0"
          max="1"
          step="any"
          id="player"
          // defaultValue="100"
          value={state.volume}
          onChange={(e) => {
            controls.volume(parseFloat(e.target.value));
          }}
        />
        <button onClick={() => dispatch({ type: "CLEAR_PODCAST" })}>
          <IoMdCloseCircle />
        </button>
      </div>
    </div>
  );
}

export default Player;
