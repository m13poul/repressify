import { useQuery, useMutation, useQueryClient } from "react-query";
import { useContext } from "react";
import { ClientSideContext } from "../contexts/clientContext";
import axios from "axios";

const getTitles = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API}/getCategoriesAndTitles`, { withCredentials: true });
  return data;
};

const addNewFeed = (data: object) => {
  return axios.post(
    `${import.meta.env.VITE_BACKEND_API}/exp`,
    {
      ...data,
    },
    {
      withCredentials: true,
    }
  );
};

const removeFeeds = (data: any) => {
  return axios.post(`${import.meta.env.VITE_BACKEND_API}/deleteFeeds`, { ...data }, { withCredentials: true });
};

export function useGetTitles() {
  return useQuery("somekey", () => getTitles());
}

export function useAddFeed() {
  const queryClient = useQueryClient();
  return useMutation(addNewFeed, {
    onSuccess: () => {
      queryClient.invalidateQueries("somekey");
    },
  });
}

export function useRemoveFeeds() {
  const [data, dispatch] = useContext(ClientSideContext);

  const queryClient = useQueryClient();
  return useMutation(removeFeeds, {
    onSuccess: (data: any) => {
      for (const title of data.data.titles) {
        if (localStorage.getItem(`${title}`) || "[]") {
          localStorage.removeItem(`${title}`);
          const favourites = JSON.parse(localStorage.getItem("favourites") || "[]");
          const newFavourites = favourites.filter((feed: any) => feed.plainTitle !== title);
          localStorage.setItem("favourites", JSON.stringify(newFavourites));
          dispatch({ type: "SET_FAVOURITES", payload: newFavourites });
        }
      }
      queryClient.invalidateQueries("somekey");
    },
    // onError: (error) => {
    //   console.log(error);
    // },
  });
}
const deleteOne = (data: object) => {
  return axios.post(`${import.meta.env.VITE_BACKEND_API}/deleteOne`, data, { withCredentials: true });
};

export function useDeleteOneFeed() {
  const [data, dispatch] = useContext(ClientSideContext);
  const queryClient = useQueryClient();
  return useMutation(deleteOne, {
    onSuccess: (data: any) => {
      if (localStorage.getItem(`${data.data.initial.plainTitle}`) || "[]") {
        localStorage.removeItem(`${data.data.initial.plainTitle}`);
        const favourites = JSON.parse(localStorage.getItem("favourites") || "[]");
        const newFavourites = favourites.filter((feed: any) => feed.plainTitle !== data.data.initial.plainTitle);
        localStorage.setItem("favourites", JSON.stringify(newFavourites));
        dispatch({ type: "SET_FAVOURITES", payload: newFavourites });
      }
      queryClient.invalidateQueries("somekey");
    },
  });
}
const getContent = (url: string) => {
  return axios.post(`${import.meta.env.VITE_BACKEND_API}/parseUrl`, { url }, { withCredentials: true });
};

export function useGetContentQuery(url: string) {
  return useQuery(`contentFor${url}`, () => getContent(url), { enabled: false });
}

const renameFeed = (data: any) => {
  return axios.post(`${import.meta.env.VITE_BACKEND_API}/renameTitle`, { ...data }, { withCredentials: true });
};

export function useRenameFeed(url: string, newTitle: string, allData: any) {
  const [data, dispatch] = useContext(ClientSideContext);
  const queryClient = useQueryClient();
  return useMutation(renameFeed, {
    onSuccess: () => {
      queryClient.invalidateQueries("somekey");
      localStorage.setItem("favourites", JSON.stringify(data.favourites));
    },
    onError: (err: any) => {
      console.log(err);
      dispatch({ type: "SET_NETWORK_ERROR_MESSAGE", payload: `${err.message} - Please try again later` });
      setTimeout(() => {
        dispatch({ type: "SET_NETWORK_ERROR_MESSAGE", payload: "" });
      }, 2000);
    },
  });
}

const moveOne = (data: any) => {
  return axios.post(`${import.meta.env.VITE_BACKEND_API}/moveFeed`, data, { withCredentials: true });
};

export function useMoveOne() {
  const queryClient = useQueryClient();
  return useMutation(moveOne, {
    onSuccess: () => {
      queryClient.invalidateQueries("somekey");
    },
  });
}

// const getPaginatedContent = (category: string, url: string, page: number) => {
//   return axios.get(`http://localhost:3002/getPaginatedData?category=${category}&url=${url}&page=${page}`, { withCredentials: true });
// };

// export function useGetPaginatedContent(
//   category: string,
//   url: string,
//   page: number
// ) {
//   console.log("parameters", category, url, page);
//   return useQuery(
//     `PaginatedFor${url}`,
//     () => getPaginatedContent(category, url, page),
//     { enabled: false }
//   );
// }
