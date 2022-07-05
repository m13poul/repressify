import axios from "axios";
import { ClientSideContext } from "../../contexts/clientContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

interface Values {
  username: string;
  password: string;
  recovery: string;
  confirmPassword: string;
}

export const usePasswordRecovery = () => {
  const [data, dispatch] = useContext(ClientSideContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const passwordRecovery = async (values: Values) => {
    console.log(values);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/recovery`, values, { withCredentials: true });
      console.log(res);
      if (res.status === 200) {
        console.log("done");
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
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  };

  return { passwordRecovery, errorMessage };
};

export const recoveryValidation = Yup.object({
  password: Yup.string()
    .required("")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  confirmPassword: Yup.string().when("password", {
    is: (val: string) => (val && val.length > 0 ? true : false),
    then: Yup.string().oneOf([Yup.ref("password")], "Passwords must match"),
  }),
});
