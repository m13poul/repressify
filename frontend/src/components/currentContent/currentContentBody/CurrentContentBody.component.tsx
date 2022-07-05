import React from "react";
import { GrCirclePlay } from "react-icons/gr";

function CurrentContentBody({ content, numberOfCols, play }: { content: any; numberOfCols: any; play: any }) {
  return (
    <div className={`gridContent grid-cols-${numberOfCols}`}>
      {content?.data?.items?.map((feed: any, idx: number) => (
        <article key={idx} className="relative">
          <a href={feed.link} target="_blank" rel="noopener noreferrer" className="title custom-link">
            {feed.title}
          </a>
          <p className="content-snippet">{feed.contentSnippet}</p>
          {feed?.enclosure ? (
            <div>
              <GrCirclePlay onClick={() => play(feed.enclosure.url, feed.title, content.data.title)} style={{ height: 50, width: 50 }} />
            </div>
          ) : null}
          <div className="small gray absolute">
            <p>by: {feed.creator}</p>
            <p className="border-buttom">{feed.pubDate}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default CurrentContentBody;
