import { FC, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { MdDelete, MdDriveFileRenameOutline, MdOutlineDriveFileMove } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { Menu, MenuItem, MenuButton, SubMenu, FocusableItem } from "@szhsin/react-menu";
import { useAddToPinned, useIsEditable, useDeleteOne, useMoveFeed } from "./TitlesAndCategoriesHooks";
import { categories } from "../../categoriesList";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { ClientSideContext } from "../../contexts/clientContext";
import ErrorMessage from "../errorMessage/ErrorMessage.component";

interface Props {
  feds: any;
  romanize: any;
  addToDeleteCue: any;
}

const TitlesAndCategories: FC<Props> = ({ feds, romanize, addToDeleteCue }) => {
  const { addToPinned } = useAddToPinned();
  const { isEditable, setIsEditable, onBlur, onChange } = useIsEditable();
  const { deleteOne } = useDeleteOne();
  const { moveFeed } = useMoveFeed();
  const [filter, setFilter] = useState("");
  // const [link, setlink] = useState("feed/${category[0]}?${list.url}");
  const ref = useRef(null);
  let favouritesArray: string[] = [];
  const [data, dispatch] = useContext(ClientSideContext);
  if (data.favourites.length) {
    data.favourites.map((feed: any) => favouritesArray.push(feed.url));
  }
  return (
    <div>
      {feds
        ? Object.entries(feds).map((category: any, idx: number) => (
            <div key={idx} className="wrap-collapsible dontshowinput">
              <input id={`collapsible${idx}`} className="toggle" type="checkbox" />
              {category[1].length ? (
                <label htmlFor={`collapsible${idx}`} className="lbl-toggle">
                  <span className="">
                    {category[0]} ({category[1].length}){/* <BsThreeDots /> */}
                  </span>
                </label>
              ) : null}
              <div className="collapsible-content">
                <div className="" ref={ref}>
                  {category[1]?.map((list: any, idx: number) => (
                    <div key={idx + 100} className="content-inner-flex border-buttom">
                      <Link to={isEditable ? "" : `feed/${category[0]}?${list.url}`} onClick={isEditable ? (e) => e.preventDefault() : () => void 0}>
                        <div
                          onClick={() => {
                            scroll({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <div className="title-flex">
                            {/* {romanize(idx + 1)} */}
                            <div
                              contentEditable={isEditable}
                              id={list?.plainTitle}
                              onBlur={(e) => onBlur(e, category[0], list.url, list.title, list.plainTitle, list)}
                              onInput={(e) => onChange(e, list.url)}
                              suppressContentEditableWarning={true}
                              className={isEditable ? "source-title-nohover isEditable" : "source-title"}
                            >
                              <p>{list?.plainTitle}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <input
                        value={list.uuid}
                        type="checkbox"
                        id={`${list?.title}${idx}`}
                        className="input-end"
                        onClick={(e) => addToDeleteCue(e, category[0], list.url, list.enUrl, list.uuid, list.plainTitle)}
                      />
                      <Menu
                        menuButton={
                          <MenuButton>
                            <BsThreeDots />
                          </MenuButton>
                        }
                        // className="aboveAll"
                        transition
                        // boundingBoxRef={ref}
                        // boundingBoxPadding="0 16 0 0"
                        portal
                        direction="left"
                        viewScroll="close"
                      >
                        <MenuItem
                          onClick={() => {
                            setIsEditable(!isEditable);
                          }}
                        >
                          <button style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <MdDriveFileRenameOutline />
                            Rename
                          </button>
                        </MenuItem>
                        <MenuItem onClick={() => deleteOne(category[0], list)}>
                          <button style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <MdDelete />
                            Delete
                          </button>
                        </MenuItem>
                        <MenuItem onClick={() => addToPinned(list, category[0])}>
                          <button style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {favouritesArray.includes(list.url) ? <AiFillStar /> : <AiOutlineStar />} Pin
                          </button>
                        </MenuItem>
                        <SubMenu
                          label={
                            <button style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <MdOutlineDriveFileMove />
                              Move
                            </button>
                          }
                          onMenuChange={(e) => e.open && setFilter("")}
                          direction="right"
                        >
                          <FocusableItem>
                            {({ ref }) => <input ref={ref} type="text" placeholder="Type to filter" value={filter} onChange={(e) => setFilter(e.target.value)} />}
                          </FocusableItem>
                          {categories
                            .filter((category) => category.toUpperCase().includes(filter.trim().toUpperCase()))
                            .filter((categoryname) => categoryname !== category[0])
                            .map((categoryName) => (
                              <MenuItem key={categoryName} onClick={() => moveFeed(categoryName, list, category[0])}>
                                {categoryName}
                              </MenuItem>
                            ))}
                        </SubMenu>
                      </Menu>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        : null}
      {data.NetworkErrors ? <ErrorMessage>{data.NetworkErrors}</ErrorMessage> : null}
    </div>
  );
};

export default TitlesAndCategories;
