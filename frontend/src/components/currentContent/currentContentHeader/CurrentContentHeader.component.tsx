import { useEffect, useState } from "react";
import { BiColumns } from "react-icons/bi";
import { useWindowSize } from "usehooks-ts";
import { useResponsiveCols } from "../CurrentContentHooks";
import "../CurrentContent.styles.scss";

function CurrentContentHeader({ content, handleCols }: { content: any; handleCols: any }) {
  const { cols } = useResponsiveCols(handleCols);
  return (
    <>
      {content ? (
        <div className="currentTitle sticky top-0 z-index-1 " id="title-header">
          <h1 className="current-feed-header">
            {content?.data?.image ? <img src={content.data.image.url} alt="" /> : null}
            {content?.data.title}

            <span className="numberOfItems"> ({content?.data?.items?.length})</span>
          </h1>
          <div className="dropdown">
            <span>
              <BiColumns />
            </span>
            <div className="dropdown-content">
              <div>Select Number Of Columns</div>
              <div className="just-test">
                {cols.map((numberOfCols: number) => (
                  <div key={numberOfCols} onClick={() => handleCols(numberOfCols)} className="select-cols-button">
                    {numberOfCols}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default CurrentContentHeader;
