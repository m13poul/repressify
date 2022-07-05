import React, { FC, memo } from "react";
import UtilButton from "../UtilButton/UtilButton.component";
import "./VerificationModal.styles.scss";

interface Props {
  deleteFeeds: any;
  mutateTitles: any;
  setShowVerification: any;
  executeFunction: any;
}

const VerificationModal: FC<Props> = ({ deleteFeeds, mutateTitles, setShowVerification, executeFunction }) => {
  return (
    <div>
      <>
        <div>Are you sure ?</div>
        <UtilButton
          actionToDo={() => {
            executeFunction(mutateTitles);
            setShowVerification(false);
          }}
          color="utilButton-green"
        >
          Yes
        </UtilButton>
        <UtilButton actionToDo={() => setShowVerification(false)} color="utilButton-red">
          No
        </UtilButton>
      </>
    </div>
  );
};
const MemoizedVerification = memo(VerificationModal);
export default MemoizedVerification;
