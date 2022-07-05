import { Formik, Field, Form, FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../errorMessage/ErrorMessage.component";
import SubmissionButton from "../submissionButton/SubmissionButton.component";
import { usePasswordRecovery, recoveryValidation } from "./recoveryHooks";

interface Values {
  username: string;
  password: string;
  recovery: string;
  confirmPassword: string;
}

function RecoveryComp() {
  const navigate = useNavigate();
  const { passwordRecovery, errorMessage } = usePasswordRecovery();

  return (
    <div className="container mx-auto">
      <h1 className="text-center">Password Recovery</h1>
      <div className="text-center">{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}</div>
      <Formik
        initialValues={{
          username: "",
          password: "",
          confirmPassword: "",
          recovery: "",
        }}
        validationSchema={recoveryValidation}
        validateOnChange={false}
        validateOnBlur={true}
        onSubmit={(values: Values) => passwordRecovery(values)}
      >
        {({ errors, touched }) => (
          <Form className="login-container mx-auto">
            <label htmlFor="password">Username</label>
            <Field id="username" name="username" placeholder="username" type="text" className="basic" />
            <span className="text-center error">{errors.username}</span>

            <label htmlFor="password">Recovery Key</label>
            <Field id="recovery" name="recovery" placeholder="*********" type="password" className="basic" />
            <span className="text-center error">{errors.recovery}</span>

            <label htmlFor="password">New Password</label>
            <Field id="password" name="password" placeholder="*********" type="password" className="basic" />
            <span className="text-center error">{errors.password}</span>

            <label htmlFor="password">Verify New Password</label>
            <Field id="confirmPassword" name="confirmPassword" placeholder="*********" type="password" className="basic" />
            <span className="text-center error">{errors.confirmPassword}</span>

            <SubmissionButton value="Reset Password" />
          </Form>
        )}
      </Formik>
      <p className="text-center">
        <span>
          <button className="signup-form-button" onClick={() => navigate("/")}>
            Back to HomePage{" "}
          </button>
        </span>
      </p>
    </div>
  );
}

export default RecoveryComp;
