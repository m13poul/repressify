import { useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useGetContentQuery } from "../../hooks/useQueryCustomHooks";
import { ClientSideContext } from "../../contexts/clientContext";
import { useWindowSize } from "usehooks-ts";

export const useCurrentContent = () => {
  const location = useLocation();
  const category = location.pathname.split("/")[2];
  const url = location.search.substring(1);
  const { data: content, isFetching, refetch, isError, status, error } = useGetContentQuery(url);

  const refetcher = async (url: string, refetch: any) => {
    const { data } = await axios.get(`${import.meta.env.VITE_ALL_ORIGINS}/get?url=${url}`);
    const feed = new window.DOMParser().parseFromString(data.contents, "text/xml");
    const feedTitle = feed.querySelector("title")?.textContent;
    const feedItems = feed.querySelectorAll("item");
    const feedItemsArray = [...feedItems].map((feed) => ({
      title: feed.querySelector("title")?.innerHTML,
    }));
    feedTitle ? refetch() : console.log("something went wrong");
  };

  useEffect(() => {
    refetcher(url, refetch);
  }, [url]);

  return { category, url, content, isError, error };
};

export const useCols = () => {
  const [numberOfCols, setNumberOfCols] = useState(localStorage.getItem("numberOfCols") ? parseInt(JSON.parse(localStorage.getItem("numberOfCols") || "{}")) : 2);
  const handleCols = (newNumberofCols: number) => {
    setNumberOfCols(newNumberofCols);
    localStorage.setItem("numberOfCols", newNumberofCols.toString());
  };
  return { numberOfCols, handleCols };
};

export const usePodcast = () => {
  const [nextUrl, dispatch] = useContext(ClientSideContext);

  const play = (url: string, title: string, podcastName: string) => {
    dispatch({ type: "PLAY_PODCAST", payload: { url, title, podcastName } });
  };
  return { play };
};

export const useResponsiveCols = (handleCols: (numberOfCols: number) => void) => {
  const { width } = useWindowSize();
  const [cols, setCols] = useState([1, 2, 3, 4]);
  useEffect(() => {
    const currentNumberOfCols = Number(localStorage.getItem("numberOfCols"));
    // console.log("current number", currentNumberOfCols);
    if (width > 1280) {
      setCols([1, 2, 3, 4]);
    } else if (width > 1024 && width < 1280) {
      setCols([1, 2, 3]);
      if (!cols.includes(currentNumberOfCols)) {
        handleCols(3);
      }
    } else if (width > 640 && width < 1024) {
      setCols([1, 2]);
      if (!cols.includes(currentNumberOfCols)) {
        handleCols(2);
      }
    } else if (width < 640) {
      setCols([1]);
      if (!cols.includes(currentNumberOfCols)) {
        handleCols(1);
      }
      // handleCols(1);
    }
  }, [width]);
  return { cols };
};
