import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ClientSideContext } from "../../contexts/clientContext";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [user, dispatch] = useContext(ClientSideContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    localStorage.getItem("user") ? navigate("/") : null;
  }, []);
  const handleLogin = async (values: any) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/login`, { username: values.username, password: values.password }, { withCredentials: true });
      if (res.status === 200) {
        dispatch({
          type: "SET_CURRENT_USER",
          payload: res.data.user,
        });
        localStorage.setItem("user", "true");
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      setErrorMessage(error.response.data);
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  };

  return { handleLogin, errorMessage };
};
