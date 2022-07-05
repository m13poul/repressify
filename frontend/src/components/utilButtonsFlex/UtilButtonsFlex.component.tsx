import React, { FC, useEffect, useState, useContext } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage.component";
import UtilButton from "../UtilButton/UtilButton.component";
import MemoizedVerification from "../VerificationModal/VerificationModal.component";
import { MdDelete, MdLogout } from "react-icons/md";
import { FaFileExport } from "react-icons/fa";
import axios from "axios";
import { ClientSideContext } from "../../contexts/clientContext";
import "./UtilButtonsFlex.styles.scss";

interface Props {
  deleteFeeds: any;
  mutateTitles: any;
  exportData: any;
  signout: any;
  dispatch: any;
  feds: any;
  deleteAtLeastOneWarning: any;
}

const UtilButtonsFlex: FC<Props> = ({ deleteFeeds, mutateTitles, exportData, signout, dispatch, feds, deleteAtLeastOneWarning }) => {
  const [showVerification, setShowVerification] = useState(false);
  const [showSomeButtons, setShowSomeButtons] = useState(false);
  const [data, dispatchDeleteAccount] = useContext(ClientSideContext);

  useEffect(() => {
    let check = 0;
    if (feds) {
      Object.values(feds).forEach((feed: any) => {
        check = check + feed.length;
      });
      check !== 0 ? setShowSomeButtons(true) : setShowSomeButtons(false);
    }
  }, [feds]);
  const deleteAccount = async () => {
    console.log("I will delete it");
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/deleteAccount`, {}, { withCredentials: true });
    console.log(res.status, "test");
    if (res.status === 200) {
      signout(dispatch);
    }
  };
  return (
    <div>
      <div className="utilButtonsFlex">
        {showSomeButtons ? (
          <>
            <UtilButton actionToDo={() => setShowVerification(!showVerification)} color="utilButton-red" icon={<MdDelete />}>
              Delete
            </UtilButton>
            <UtilButton actionToDo={exportData} color="utilButton-green" value={feds} icon={<FaFileExport />}>
              Export Feeds
            </UtilButton>
          </>
        ) : null}
        <UtilButton actionToDo={() => signout(dispatch)} color="utilButton-black" icon={<MdLogout />}>
          Signout
        </UtilButton>
      </div>
      {showVerification ? (
        <MemoizedVerification deleteFeeds={deleteFeeds} mutateTitles={mutateTitles} setShowVerification={setShowVerification} executeFunction={deleteFeeds} />
      ) : null}
      {deleteAtLeastOneWarning ? <ErrorMessage>Choose at least one item</ErrorMessage> : null}
      <UtilButton color="utilButton-black" actionToDo={() => dispatchDeleteAccount({ type: "SET_DELETE_ACCOUNT", payload: "delete" })} icon={<MdDelete />}>
        Delete Account
      </UtilButton>
      {data.deleteAccountVerification ? (
        <div>
          Are you sure ? This is an irreversible action! <br />
          <UtilButton color="utilButton-green" actionToDo={deleteAccount}>
            Yes
          </UtilButton>
          <UtilButton color="utilButton-red" actionToDo={() => dispatchDeleteAccount({ type: "SET_DELETE_ACCOUNT", payload: "" })}>
            No
          </UtilButton>
        </div>
      ) : null}
    </div>
  );
};

export default UtilButtonsFlex;
