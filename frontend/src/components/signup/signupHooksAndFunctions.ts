import axios from "axios";
import { useContext, useState } from "react";
import { ClientSideContext } from "../../contexts/clientContext";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export const useSignUp = () => {
  const [user, dispatch] = useContext(ClientSideContext);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const signUpUser = async (values: any) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/signup`, { username: values.username, password: values.password }, { withCredentials: true });
      // res.status === 200 ? navigate("/") : null;
      console.log("this one", res);
      if (res.status === 201) {
        dispatch({
          type: "SET_CURRENT_USER",
          payload: res.data.user,
        });
        dispatch({ type: "SET_RECOVERY", payload: res.data.recovery });
        localStorage.setItem("user", "true");
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      setErrorMessage(error.response.data);
    }
  };
  return { signUpUser, errorMessage };
};

export const signUpValidation = Yup.object({
  username: Yup.string().test("username", "Username already in use", function (value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        axios
          .get(`${import.meta.env.VITE_BACKEND_API}/user/available?username=${value}`)
          .then((res) => {
            console.log(res);
            resolve(true);
          })
          .catch((error) => {
            // console.log(error);
            resolve(false);
          });
      }, 500);
    });
  }),
  password: Yup.string()
    .required("")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  confirmPassword: Yup.string().when("password", {
    is: (val: string) => (val && val.length > 0 ? true : false),
    then: Yup.string().oneOf([Yup.ref("password")], "Passwords must match"),
  }),
});
