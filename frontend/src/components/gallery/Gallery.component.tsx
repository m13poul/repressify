import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ClientSideContext } from "../../contexts/clientContext";
import "./Gallery.styles.scss";
type feed = {
  plainTitle: string;
  image?: string;
  category: string;
  url: string;
};

function Gallery() {
  const [data, dispatch] = useContext(ClientSideContext);
  return (
    <div className="pinned">
      <div className="text-center tracking">{data.favourites.length ? <h2>Favourites</h2> : null}</div>
      <div className="favourites-grid text-center">
        {data.favourites.map((feed: feed, idx: number) => (
          <div key={idx}>
            <Link key={idx + 100} to={`feed/${feed.category}?${feed.url}`}>
              {feed?.image ? (
                <img src={feed.image} alt="ico" className="feed-icon" />
              ) : (
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQp-UGGYE2OagnipTOveoQ4qf2m8Q6PKaeoA&usqp=CAU" alt="ico" className="feed-icon" />
              )}
              <p>{feed.plainTitle}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
