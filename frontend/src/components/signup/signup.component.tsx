import { Formik, Field, Form, FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../errorMessage/ErrorMessage.component";
import SubmissionButton from "../submissionButton/SubmissionButton.component";
import { useSignUp, signUpValidation } from "./signupHooksAndFunctions";

interface Values {
  username: string;
  password: string;
}

function Signup() {
  const { signUpUser, errorMessage } = useSignUp();
  const navigate = useNavigate();
  return (
    <div className="container mx-auto">
      <h1 className="text-center">Sign Up</h1>
      <div className="text-center">{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}</div>

      <Formik
        initialValues={{
          username: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={signUpValidation}
        validateOnChange={false}
        validateOnBlur={true}
        onSubmit={(values: Values) => signUpUser(values)}
      >
        {({ errors, touched }) => (
          <Form className="login-container mx-auto">
            <label htmlFor="username">Username</label>
            <Field id="username" name="username" placeholder="Just a username" className="basic" />
            <span className="text-center error">{errors.username}</span>

            <label htmlFor="password">Password</label>
            <Field id="password" name="password" placeholder="*********" type="password" className="basic" />
            <span className="text-center error">{errors.password}</span>

            <label htmlFor="confirmPassword">Confirm Password</label>
            <Field id="confirmPassword" name="confirmPassword" placeholder="*********" type="password" className="basic" />
            <span className="text-center error">{errors.confirmPassword}</span>
            <SubmissionButton value="Sign Up" />
          </Form>
        )}
      </Formik>
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

export default Signup;
