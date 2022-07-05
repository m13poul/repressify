import { createContext, useReducer } from "react";

const INITIAL_STATE: any = {
  currentUser: "",
  currentPodcast: "",
  currentTitle: "",
  podcastTitle: "",
  favourites: localStorage.getItem("favourites") ? JSON.parse(localStorage.getItem("favourites") || "") : [],
  onlyTitles: [],
  NetworkErrors: "",
  recovery: "",
  deleteAccountVerification: "",
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "PLAY_PODCAST": {
      return {
        ...state,
        currentPodcast: action.payload.url,
        currentTitle: action.payload.title,
        podcastTitle: action.payload.podcastName,
      };
    }
    case "CLEAR_PODCAST": {
      return {
        ...state,
        currentPodcast: "",
        currentTitle: "",
        podcastTitle: "",
      };
    }
    case "SET_CURRENT_USER": {
      return {
        ...state,
        currentUser: action.payload,
      };
    }
    case "SET_FAVOURITES": {
      // localStorage.setItem("favourites", JSON.stringify(action.payload));
      return {
        ...state,
        favourites: action.payload,
      };
    }
    case "SET_TITLES": {
      return {
        ...state,
        onlyTitles: action.payload,
      };
    }
    case "SET_NETWORK_ERROR_MESSAGE": {
      return {
        ...state,
        NetworkErrors: action.payload,
      };
    }
    case "SET_RECOVERY": {
      return {
        ...state,
        recovery: action.payload,
      };
    }
    case "SET_DELETE_ACCOUNT": {
      return {
        ...state,
        deleteAccountVerification: action.payload,
      };
    }
    default:
      return state;
  }
};

export const ClientSideContext = createContext<any>(null);

export const ClientSideProvider = ({ children }: { children: any }) => {
  const value = useReducer(reducer, INITIAL_STATE);
  return <ClientSideContext.Provider value={value}>{children}</ClientSideContext.Provider>;
};
