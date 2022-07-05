import { FC } from "react";
import { Formik, Field, Form } from "formik";
import axios from "axios";
import * as Yup from "yup";
import "./Contact.styles.scss";
import { useNavigate } from "react-router-dom";
import SubmissionButton from "../submissionButton/SubmissionButton.component";

const FormValidate = Yup.object().shape({
  email: Yup.string().required("Required"),
  fname: Yup.string().required("Required"),
  subject: Yup.string().required("Required"),
  textarea: Yup.string().required("Required"),
});

const Contact: FC = () => {
  const navigate = useNavigate();
  const sendForm = async (values: object) => {
    console.log(values);
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/contact`, {
      ...values,
    });
    console.log(res);
    res.status === 200 ? navigate("/contact/success") : null;
  };
  return (
    <div className="">
      <div className="form-header">
        <h1>Contact</h1>
        <hr />
        <div>For all inquiries, please use the form below</div>
      </div>
      <div className="form-container">
        <Formik initialValues={{ fname: "", email: "", subject: "", textarea: "" }} onSubmit={(values) => sendForm(values)} validationSchema={FormValidate}>
          {({ errors, touched }) => (
            <Form>
              <div className="required-notification">
                <label htmlFor="subject">I contacting you because...</label>
                {errors.subject && touched.subject ? <div className="red">{errors.subject}</div> : null}
              </div>
              <Field as="select" name="subject" id="subject" className="basic">
                <option></option>
                <option id="hi" value="hi">
                  I just wanted to say hi!
                </option>
                <option id="idea" value="idea">
                  I have an idea!
                </option>
                <option id="question" value="question">
                  I have a question!
                </option>
                <option id="bug" value="bug">
                  I found a bug!
                </option>
                <option id="proposal" value="proposal">
                  I have bussiness proposal!
                </option>
                <option id="else" value="else">
                  There is something else...
                </option>
              </Field>

              <div className="required-notification">
                <label htmlFor="fname">Name or Nickname</label>
                {errors.fname && touched.fname ? <div className="red">{errors.fname}</div> : null}
              </div>
              <Field name="fname" id="fname" placeholder="Your name..." className="basic" />

              <div className="required-notification">
                <label htmlFor="email">E-mail</label>
                {errors.email && touched.email ? <div className="red">{errors.email}</div> : null}
              </div>
              <Field name="email" id="email" placeholder="Email" className="basic" />

              <div className="required-notification">
                <label htmlFor="textarea">Let's talk!</label>
                {errors.textarea && touched.textarea ? <div className="red">{errors.textarea}</div> : null}
              </div>
              <Field as="textarea" name="textarea" id="textarea" className="basic" placeholder="Say It..."></Field>

              {/* <input type="submit" value="Submit" className="submit" /> */}
              <SubmissionButton value="Submit" />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Contact;
