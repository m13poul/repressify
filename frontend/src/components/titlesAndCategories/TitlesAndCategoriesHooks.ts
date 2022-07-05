import { useEffect, useState, useContext } from "react";
import { useRenameFeed, useDeleteOneFeed, useMoveOne } from "../../hooks/useQueryCustomHooks";
import { ClientSideContext } from "../../contexts/clientContext";

export const useAddToPinned = () => {
  const [data, dispatch] = useContext(ClientSideContext);
  const addToPinned = (feed: any, category: string) => {
    const feed2BePinned = { ...feed, category };
    let newArray = [...data.favourites, feed2BePinned];
    const exists = data.favourites.some((favFeed: any) => favFeed.url == feed.url);
    if (exists) {
      newArray = newArray.filter((favFeed) => favFeed.url !== feed.url);
    }
    localStorage.setItem("favourites", JSON.stringify(newArray));

    dispatch({ type: "SET_FAVOURITES", payload: newArray });
  };
  return { addToPinned };
};

export const useIsEditable = () => {
  const [data, dispatch] = useContext(ClientSideContext);
  const [oldTitle, setOldTitle] = useState("");
  const [newTitle, setNewTitle] = useState<any>("");
  const [urlToBeRenamed, setUrlToBeRenamed] = useState("");
  const [allData, setAllData] = useState<any>("");
  const { data: renameFeedRes, mutate: renameFeed } = useRenameFeed(urlToBeRenamed, newTitle, allData);
  const [isEditable, setIsEditable] = useState(false);

  const onChange = (e: any, url: string) => {
    const dataCopy = data.favourites;
    const position = data.favourites.findIndex((feed: any) => feed.url == url);
    if (position !== -1) {
      dataCopy[position].plainTitle = e.target.textContent;
      dispatch({ type: "SET_FAVOURITES", payload: dataCopy });
    }
  };

  const onBlur = async (e: React.FocusEvent<HTMLParagraphElement, Element>, category: string, url: string, oldEncryptedTitle: object, oldPlainTitle: string, list: any) => {
    setAllData(list);
    setOldTitle(oldPlainTitle);
    const newTitle = e.target.textContent;
    setNewTitle(newTitle);
    const initialTitle = e.target.id;
    setIsEditable(false);
    setUrlToBeRenamed(url);
    const data = { newTitle, category, url, initialTitle, oldEncryptedTitle };
    renameFeed(data);
  };
  return { isEditable, setIsEditable, onBlur, onChange };
};

export const useDeleteOne = () => {
  const { data: deleteOneRes, mutateAsync: deleteOneFeed } = useDeleteOneFeed();
  const deleteOne = async (category: string, list: object) => {
    const data = { category, ...list };
    await deleteOneFeed(data);
  };
  return { deleteOne };
};

export const useMoveFeed = () => {
  const { data: moveRes, mutateAsync: moveOneFeed } = useMoveOne();
  const moveFeed = async (newCategory: string, list: object, category: string) => {
    const data = { newCategory, list, category };
    await moveOneFeed(data);
  };
  return { moveFeed };
};
