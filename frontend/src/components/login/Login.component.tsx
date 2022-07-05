import { Formik, Field, Form, FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import "./Login.styles.scss";
import ErrorMessage from "../errorMessage/ErrorMessage.component";
import { useLogin } from "./LoginHooks";
import SubmissionButton from "../submissionButton/SubmissionButton.component";
interface Values {
  username: string;
  password: string;
}

function Login() {
  const { handleLogin, errorMessage } = useLogin();
  const navigate = useNavigate();

  return (
    <div className=" container mx-auto">
      <h1 className="text-center">Login</h1>
      <div className="text-center">{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}</div>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        // validationSchema={loginValidation}
        // validateOnChange={false}
        // validateOnBlur={true}
        onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => handleLogin(values)}
      >
        {({ errors, touched }) => (
          <Form className="login-container mx-auto">
            <label htmlFor="username">Username</label>
            <Field id="username" name="username" placeholder="John" className="basic" />
            <span className="text-center error">{errors.username}</span>

            <label htmlFor="password">Password</label>
            <Field type="password" id="password" name="password" placeholder="*********" className="basic" />
            <span className="text-center error">{errors.password}</span>

            <SubmissionButton value="Login" />
          </Form>
        )}
      </Formik>
      <p className="text-center">
        Don't have an account ?{" "}
        <span>
          <button className="signup-form-button" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </span>
      </p>
      <p className="text-center">
        Forgot your password ?{" "}
        <span>
          <button className="signup-form-button" onClick={() => navigate("/recovery")}>
            Reset Password
          </button>
        </span>
      </p>
      <p className="text-center">
        {/* Back to HomePage{" "} */}
        <span>
          <button className="signup-form-button" onClick={() => navigate("/")}>
            Back to HomePage{" "}
          </button>
        </span>
      </p>
    </div>
  );
}

export default Login;
