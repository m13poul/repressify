import React from "react";
import { useState, useEffect, useRef } from "react";
import { GrPlayFill, GrPauseFill, GrBackTen, GrForwardTen } from "react-icons/gr";
import { useContext } from "react";
import { ClientSideContext } from "../../contexts/clientContext";
import "./AudioPlayer.styles.scss";

function AudioPlayer() {
  const [urlToBePlayed, dispatch] = useContext(ClientSideContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTrack, setCurrentTrack] = useState("");
  const audioPlayer = useRef<any>();
  const refProgressBar = useRef<any>();
  const animationRef = useRef<any>();
  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    refProgressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);
  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${returnedMinutes}:${returnedSeconds}`;
  };
  const changeRange = () => {
    audioPlayer.current.currentTime = refProgressBar.current.value;
    changePlayerCurrentTime();
  };
  const whilePlaying = () => {
    refProgressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };
  const changePlayerCurrentTime = () => {
    setCurrentTime(refProgressBar.current.value);
  };
  const handleStart = () => {
    audioPlayer.current.pause();
    setIsPlaying(!isPlaying);
    animationRef.current = requestAnimationFrame(whilePlaying);
  };
  const handleStop = () => {
    audioPlayer.current.play();
    setIsPlaying(!isPlaying);
    animationRef.current = requestAnimationFrame(whilePlaying);
  };
  const backByAmount = (sec: number) => {
    refProgressBar.current.value = refProgressBar.current.value - sec;
    changeRange();
  };
  const forByAmount = (sec: number) => {
    refProgressBar.current.value = refProgressBar.current.value - -sec;
    changeRange();
  };
  const handleVol = (value: string) => {
    audioPlayer.current.volume = value;
  };
  // console.log("assign this", urlToBePlayed.currentPodcast);
  useEffect(() => {
    setCurrentTrack(urlToBePlayed.currentPodcast);
    audioPlayer.current.load();

    // audioPlayer.current.stop();
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    refProgressBar.current.max = seconds;
    // audioPlayer.current.load();

    // audioPlayer.current.play();
  }, [urlToBePlayed]);
  const testSource = "https://dcs.megaphone.fm/ADV5170372742.mp3?key=25be807bd2ad9cc8b7ee2cc39398ab7b";
  // console.log(urlToBePlayed.currentPodcast == false);
  return (
    <>
      <div className="">
        <audio id="player" ref={audioPlayer} className="bg-red-900 h-32">
          <source src={currentTrack} />
          Your browser does not support the audio element.
        </audio>
      </div>
      <div style={{ display: "" }} className=" bg-red-900 text-white flex justify-between px-8 items-center podcast-container mx-auto py-1 font-eb_garamond">
        <div>Now Playing: </div>
        <div className="grid grid-cols-1 content-center items-center justify-items-center">
          <div className="flex items-center gap-x-12">
            <GrBackTen className="w-6 h-6 p-1 bg-white rounded-full" onClick={() => backByAmount(10)} />
            {isPlaying ? (
              <div>
                <button className="bg-white rounded-full p-4 my-2" onClick={handleStart}>
                  <GrPauseFill />
                </button>
              </div>
            ) : (
              <div>
                <button className="bg-white p-4 my-2 mask mask-circle" onClick={handleStop}>
                  <GrPlayFill />
                </button>
              </div>
            )}
            <GrForwardTen className="w-6 h-6 p-1 bg-white rounded-full" onClick={() => forByAmount(10)} />
          </div>
          <div className="flex  gap-x-4">
            <p>{calculateTime(currentTime)}</p>
            <input type="range" min="0" defaultValue="0" ref={refProgressBar} className="w-full" onChange={changeRange} />
            <p className="whitespace-nowrap">{duration && !isNaN(duration) && calculateTime(duration)}</p>
          </div>
        </div>

        <input
          className=""
          type="range"
          min="0"
          max="1"
          step="any"
          id="player"
          defaultValue="100"
          // onClick={(e) => document.getElementById('player').volume = e.target.value}
          onChange={(e) => handleVol(e.target.value)}
        />
      </div>
    </>
  );
}

export default AudioPlayer;
