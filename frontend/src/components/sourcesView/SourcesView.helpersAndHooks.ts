import { useEffect, useState, useContext } from "react";
import { ClientSideContext } from "../../contexts/clientContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function romanize(num: number) {
  let lookup: any = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 },
    roman: string = "",
    i: string;
  for (i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

export const exportData = (feeds: object) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(feeds))}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "Re-Pressify_MyFeeds.json";
  link.click();
};

export const useHandleDeletion = (feds: any, removeResponse: any) => {
  const toBeRemoved: { [index: string]: any[] } = {};
  const onlyTitles: string[] = [];
  const [data, dispatch] = useContext(ClientSideContext);
  const [deleteResText, setDeleteResText] = useState("");
  const [feedsToBeRemoved, setFeedsToBeRemoved] = useState<any>([]);
  const [deleteAtLeastOneWarning, setdeleteAtLeastOneWarning] = useState<boolean>(false);

  useEffect(() => {
    if (removeResponse) {
      setDeleteResText(`Deleted ${removeResponse.data.checker / 3} from ${removeResponse?.data?.result?.nModified} categories`);
      // console.log(removeResponse);
      setTimeout(() => {
        setDeleteResText("");
      }, 2000);
    }
  }, [removeResponse]);

  const defineCategories = (feds: any) => {
    if (feds) {
      Object.keys(feds).map((category: string) => {
        Object.defineProperty(toBeRemoved, category, {
          value: [],
          writable: true,
          enumerable: true,
        });
      });
    }
  };
  defineCategories(feds);
  const addToDeleteCue = (e: any, category: string, url: string, enUrl: object, uuid: any, plainTitle: string) => {
    dispatch({ type: "SET_TITLES", payload: onlyTitles });
    let currentfeed = { category, url, enUrl, uuid, plainTitle };
    let newArray = [...feedsToBeRemoved, JSON.stringify(currentfeed)];
    if (feedsToBeRemoved.includes(JSON.stringify(currentfeed))) {
      newArray = newArray.filter((feed) => feed !== JSON.stringify(currentfeed));
    }
    setFeedsToBeRemoved(newArray);
  };

  useEffect(() => {
    let data: object[] = [];
    const test = feedsToBeRemoved.map((feed: any) => {
      data.push(JSON.parse(feed));
    });
    data.forEach((feed: any) => {
      console.log("just this", feed);
      toBeRemoved[feed.category].push(feed.url, feed.enUrl, feed.uuid);
      onlyTitles.push(feed.plainTitle);
    });
  }, [feedsToBeRemoved]);

  const deleteFeeds = (mutate: any) => {
    const data = { toBeRemoved, onlyTitles };
    feedsToBeRemoved.length !== 0 ? mutate(data) : setdeleteAtLeastOneWarning(!deleteAtLeastOneWarning);
    setFeedsToBeRemoved([]);
    setTimeout(() => {
      setdeleteAtLeastOneWarning(false);
    }, 2000);
  };
  return { addToDeleteCue, deleteFeeds, deleteResText, deleteAtLeastOneWarning };
};

export const useSignOut = () => {
  const nagivate = useNavigate();
  const signout = async (dispatch: any) => {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/signout`, {}, { withCredentials: true });
    localStorage.removeItem("user");
    dispatch({ type: "SET_CURRENT_USER", payload: "" });
    nagivate("/", { replace: true });
  };
  return { signout };
};
