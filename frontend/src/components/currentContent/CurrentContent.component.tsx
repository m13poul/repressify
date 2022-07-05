import { useEffect, useRef } from "react";
import { FC } from "react";
import Spinner from "../loadingSpinner/Spinner.component";
import { useIntersectionObserver } from "usehooks-ts";
import { useCols, useCurrentContent, usePodcast } from "./CurrentContentHooks";
import "./CurrentContent.styles.scss";
import CurrentContentHeader from "./currentContentHeader/CurrentContentHeader.component";
import CurrentContentBody from "./currentContentBody/CurrentContentBody.component";

const CurrentContent: FC = () => {
  const { content, isError, error }: { content: any; isError: any; error: any } = useCurrentContent();
  const { numberOfCols, handleCols } = useCols();
  const { play } = usePodcast();
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;
  useEffect(() => {
    isVisible ? document.getElementById("title-header")?.classList.add("padding-1-rem") : document.getElementById("title-header")?.classList.remove("padding-1-rem");
  }, [isVisible, content]);
  return (
    <div>
      <div ref={ref} className="intersection"></div>
      {isError ? <p className="placeIt">{error.message}: Sorry for the inconvenience</p> : null}
      {!content?.data.items && !isError && <Spinner />}
      <CurrentContentHeader content={content} handleCols={handleCols} />
      <CurrentContentBody content={content} numberOfCols={numberOfCols} play={play} />
    </div>
  );
};

export default CurrentContent;
