import React from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { categories } from "../../categoriesList";
import { useAddFeed } from "../../hooks/useQueryCustomHooks";
import { useNavigate } from "react-router-dom";
import { AiFillFileAdd } from "react-icons/ai";
import "./AddFeed.styles.scss";
import { FC } from "react";
import UtilButton from "../UtilButton/UtilButton.component";

const FormValidate = Yup.object().shape({
  feed: Yup.string()
    .matches(/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/, "Enter a valid url!")
    .required("Required"),
  category: Yup.string().required("Required"),
});

export const getTitle = async (url: string, category: string) => {
  const { status, statusText, data } = await axios.get(`http://localhost:1458/get?url=${url}`);
  const feed = new window.DOMParser().parseFromString(data.contents, "text/xml");
  const feedTitle = feed.querySelector("title")?.textContent;
  const feedImage = feed.querySelector("url")?.textContent;
  const feedItems = feed.querySelectorAll("item");
  const feedItemsArray = [...feedItems].map((feed) => ({
    title: feed.querySelector("title")?.innerHTML,
  }));
  return { feedTitle, feedItemsArray, feedImage };
};

interface Props {
  setFeedToBeAdded?: (data: object) => void;
}

const AddFeed: FC<Props> = ({ setFeedToBeAdded }) => {
  const { mutate } = useAddFeed();
  const navigate = useNavigate();
  const addFeed = async (values: any) => {
    const { feedTitle: title, feedItemsArray, feedImage } = await getTitle(values.feed, values.category);
    const url = values.feed;
    const category = values.category;
    const data = { url, category, title, feedImage };
    title
      ? // && feedItemsArray.length
        mutate(data)
      : null;
    navigate(`feed/${category}?${url}`);
  };

  return (
    <div className="add-feed">
      Add a new feed
      <div>
        <Formik
          initialValues={{ feed: "", category: "" }}
          onSubmit={(values) => {
            addFeed(values);
          }}
          // validationSchema={FormValidate}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="fields">
                <Field name="feed" id="feed" placeholder="Enter your feed" className="add-feed-input" />
                {errors.feed && touched.feed ? <div>{errors.feed}</div> : null}
                <Field as="select" name="category" id="category" type="url" className="add-feed-selector">
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="text-medium">
                <UtilButton actionToDo={() => null} color="utilButton-green" type="submit" icon={<AiFillFileAdd />} className="center-button">
                  Add Feed
                </UtilButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddFeed;
