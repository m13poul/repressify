import "./SourcesView.scss";
import { useGetTitles, useRemoveFeeds } from "../../hooks/useQueryCustomHooks";
import { useContext, FC } from "react";
import { ClientSideContext } from "../../contexts/clientContext";
import ErrorMessage from "../errorMessage/ErrorMessage.component";
import { useHandleDeletion, useSignOut, romanize, exportData } from "./SourcesView.helpersAndHooks";
import UtilButtonsFlex from "../utilButtonsFlex/UtilButtonsFlex.component";
import TitlesAndCategories from "../titlesAndCategories/TItlesAndCategories.component";
import MemoizedVerification from "../VerificationModal/VerificationModal.component";

const SourcesView: FC = () => {
  const [user, dispatch] = useContext(ClientSideContext);
  const { data: feds } = useGetTitles();
  const { signout } = useSignOut();
  const { mutate: mutateTitles, data: removeResponse } = useRemoveFeeds();
  const { addToDeleteCue, deleteFeeds, deleteResText, deleteAtLeastOneWarning } = useHandleDeletion(feds, removeResponse);
  return (
    <div>
      <div className=" text-color sticky top-0">
        <div className="sourcesView">
          <div className="category-header">Feeds & Podcasts</div>
          <TitlesAndCategories feds={feds} romanize={romanize} addToDeleteCue={addToDeleteCue} />
        </div>
        <div>
          {deleteResText ? <ErrorMessage>{deleteResText}</ErrorMessage> : null}
          <UtilButtonsFlex
            deleteFeeds={deleteFeeds}
            mutateTitles={mutateTitles}
            exportData={exportData}
            signout={signout}
            dispatch={dispatch}
            feds={feds}
            deleteAtLeastOneWarning={deleteAtLeastOneWarning}
          />
        </div>
      </div>
    </div>
  );
};

export default SourcesView;
