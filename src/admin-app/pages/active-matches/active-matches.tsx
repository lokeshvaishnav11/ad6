// import { AxiosResponse } from "axios";
// import moment from "moment";
// import React, { MouseEvent } from "react";
// import ReactPaginate from "react-paginate";
// import { useParams } from "react-router-dom";
// import IMatch from "../../../models/IMatch";
// import { CustomLink } from "../../../pages/_layout/elements/custom-link";
// import matchService from "../../../services/match.service";
// import { dateFormat } from "../../../utils/helper";
// import BetMaxLimitModal from "./bet-max-limit-modal";
// import mobileSubheader from "../_layout/elements/mobile-subheader";

// const ActiveMatches = () => {
//   const [matches, setMaches] = React.useState<any>({});
//   const [isOpen, setIsOpen] = React.useState(false);
//   const [selectedMatch, setSelectedMatch] = React.useState<any>({});
//   const [page, setPage] = React.useState(1);
//   const { sportId, matchType } = useParams();
//   const [searchByMatch, setSearchByMatch] = React.useState("");

//   React.useEffect(() => {
//     activeMatches(1);
//     setPage(1);
//   }, [sportId, matchType]);

//   const activeMatches = (currentPage: number) => {
//     const type = matchType === undefined ? "0" : matchType;
//     matchService
//       .getActiveMatches(sportId!, type, searchByMatch, currentPage)
//       .then((res: AxiosResponse) => {
//         setMaches(res.data.data);
//         setPage(currentPage);
//       });
//   };

//   const handlePageClick = (event: any) => {
//     activeMatches(event.selected + 1);
//   };

//   const changeStatus = (e: any, match: IMatch) => {
//     e.preventDefault();
//     //const con = confirm('Are you sure you want to change match status')
//     const con = true;
//     if (con) {
//       // /change-status-matchs
//       matchService.changeStatusMatch(match.matchId).then((res) => {
//         const allMatchs: any = [...matches.docs];
//         const index = allMatchs.findIndex(
//           (m: IMatch) => m.matchId === match.matchId
//         );
//         allMatchs[index].active = !match.active;
//         setMaches({ ...matches, docs: allMatchs });
//       });
//     }
//   };

//   const deleteMatch = (e: any, match: IMatch) => {
//     e.preventDefault();
//     //const con = confirm('Are you sure you want to delete this match')
//     const con = true;
//     if (con) {
//       matchService.deleteMatch(match.matchId).then((res) => {
//         const allMatchs: any = [...matches.docs];
//         const allM = allMatchs.filter(
//           (m: IMatch) => m.matchId !== match.matchId
//         );
//         setMaches({ ...matches, docs: allM });
//       });
//     }
//   };

//   const rollbackResult = (e: MouseEvent<HTMLAnchorElement>, match: IMatch) => {
//     e.preventDefault();
//     matchService.rollbackResultMarket(match.matchId).then(() => {
//       activeMatches(page);
//     });
//   };

//   const openMaxBetPopup = (
//     e: MouseEvent<HTMLAnchorElement | undefined>,
//     match?: IMatch,
//     closed?: boolean
//   ) => {
//     e.preventDefault();
//     if (match) setSelectedMatch(match);
//     setIsOpen(!isOpen);

//     if (closed) {
//       const allMatches = [...matches.docs];
//       const index = allMatches.findIndex((m: IMatch) => m._id === match?._id);
//       allMatches[index] = match;
//       setMaches({ docs: allMatches });
//     }
//   };

//   const listMenu = () => {
//     const menus = [
//       { type: "", label: "Current Match" },
//       { type: "1", label: "Completed Match" },
//       { type: "2", label: "Deleted Match" },
//     ];
//     const type = matchType === undefined ? "" : matchType;
//     return menus.map((menu) => (
//       <li
//         key={menu.type}
//         onClick={() => {
//           //console.log('cliedddd')
//           setPage(1);
//         }}
//         className="nav-item"
//       >
//         <CustomLink
//           to={`/active-matches/${sportId}/${menu.type}`}
//           className={`nav-link ${type === menu.type ? "active" : ""}`}
//         >
//           <span style={{ textTransform: "uppercase" }}>{menu.label}</span>
//         </CustomLink>
//       </li>
//     ));
//   };

//   const onSearchSubmit = () => {
//     activeMatches(1);
//     setPage(1);
//   };

//   return (
//     <>
//       {mobileSubheader.subheaderdesktopadmin("Match List")}
//       <div className="container-fluid">
//         <div className="row justify-content-md-center">
//           <div className="col-md-4 p-2">
//             <label>&nbsp;</label>
//             <ul
//               role="tablist"
//               className="nav nav-tabs fancy-group"
//               aria-label="Tabs"
//             >
//               {listMenu()}
//             </ul>
//           </div>
//           <div className="form-group col-md-4">
//             <label htmlFor="SearchByMatch">Search By Match</label>
//             <input
//               type="text"
//               className="form-control"
//               id="SearchByMatch"
//               placeholder="Search By Match"
//               onChange={(e) => setSearchByMatch(e.target.value)}
//             />
//           </div>
//           <div className="col-md-2">
//             <label>&nbsp;</label>
//             <button
//               className="btn btn-primary btn-block"
//               onClick={onSearchSubmit}
//             >
//               Search
//             </button>
//           </div>
//           <div className="col-md-12 main-container overflow-auto">
//             <table className="table table-bordered">
//               <thead>
//                 <tr>
//                   <th>In Play</th>
//                   <th>Game</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                   <th>Bet Limit</th>
//                   <th>Manage Fancy</th>
//                    <th>Combine Fancy</th>
//                   <th>Rollback</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.keys(matches).length > 0 &&
//                   matches.docs.map((match: IMatch) => (
//                     <tr key={match.matchId}>
//                       <td>
//                         <i
//                           className={`fas fa-circle ${
//                             match.active ? "text-success" : "text-danger"
//                           } fa-lg mr-2`}
//                         ></i>
//                       </td>
//                       <td>
//                         <CustomLink to={`/active-markets/${match.matchId}`}>
//                           {match.name}{" "}
//                         </CustomLink>
//                         <span>
//                           {moment(match.matchDateTime).format(dateFormat)}
//                         </span>
//                       </td>
//                       <td>{match.active ? "Active" : "In-Active"}</td>
//                       <td>
//                         <div>
//                           <a href="#" onClick={(e) => changeStatus(e, match)}>
//                             Click To {match.active ? "In-Active" : "Active"}
//                           </a>
//                           <br />
//                           <a href="#" onClick={(e) => deleteMatch(e, match)}>
//                             Click To {match.isDelete ? "Undo" : "Delete"}
//                           </a>
//                         </div>
//                       </td>
//                       <td>
//                         <a
//                           href="#"
//                           onClick={(e: any) => openMaxBetPopup(e, match)}
//                         >
//                           Maximum Bet Limit
//                         </a>
//                       </td>
//                       <td>
//                         <CustomLink to={`/active-fancies/${match.matchId}`}>
//                           Manage Fancy
//                         </CustomLink>
//                       </td>

//                        <td>
//                         <CustomLink to={`/active-fancies/two/${match.matchId}`}>
//                           Combine Result
//                         </CustomLink>
//                       </td>

//                       <td>
//                         {match.result && (
//                           <a
//                             href="#"
//                             onClick={(e: any) => rollbackResult(e, match)}
//                           >
//                             Rollback Result
//                           </a>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//           <ReactPaginate
//             breakLabel="..."
//             nextLabel=">>"
//             forcePage={page - 1}
//             onPageChange={handlePageClick}
//             pageRangeDisplayed={5}
//             pageCount={matches.totalPages}
//             containerClassName={"pagination"}
//             activeClassName={"active"}
//             previousLabel={"<<"}
//             breakClassName={"break-me"}
//           />

//           <BetMaxLimitModal
//             showDialog={isOpen}
//             selectedMatch={selectedMatch}
//             closeModal={(e: any, savedMatch: any) => {
//               openMaxBetPopup(e, savedMatch, true);
//             }}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default ActiveMatches;




import { AxiosResponse } from "axios";
import moment from "moment";
import React, { MouseEvent } from "react";
import ReactPaginate from "react-paginate";
import { useParams } from "react-router-dom";
import IMatch from "../../../models/IMatch";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";
import matchService from "../../../services/match.service";
import { dateFormat } from "../../../utils/helper";
import BetMaxLimitModal from "./bet-max-limit-modal";
import mobileSubheader from "../_layout/elements/mobile-subheader";
import "./active-match.css";

const ActiveMatches = () => {
  const [matches, setMaches] = React.useState<any>({});
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedMatch, setSelectedMatch] = React.useState<any>({});
  const [page, setPage] = React.useState(1);

  const { sportId, matchType } = useParams();

  const [searchByMatch, setSearchByMatch] = React.useState("");

  React.useEffect(() => {
    activeMatches(1);
    setPage(1);
  }, [sportId, matchType]);

  const activeMatches = (currentPage: number) => {
    const type = matchType === undefined ? "0" : matchType;

    matchService
      .getActiveMatches(
        sportId!,
        type,
        searchByMatch,
        currentPage
      )
      .then((res: AxiosResponse) => {
        setMaches(res.data.data);
        setPage(currentPage);
      });
  };

  const handlePageClick = (event: any) => {
    activeMatches(event.selected + 1);
  };

  const changeStatus = (
    e: any,
    match: IMatch
  ) => {
    e.preventDefault();

    const con = true;

    if (con) {
      matchService
        .changeStatusMatch(match.matchId)
        .then((res) => {
          const allMatchs: any = [
            ...matches.docs,
          ];

          const index =
            allMatchs.findIndex(
              (m: IMatch) =>
                m.matchId === match.matchId
            );

          allMatchs[index].active =
            !match.active;

          setMaches({
            ...matches,
            docs: allMatchs,
          });
        });
    }
  };

  const deleteMatch = (
    e: any,
    match: IMatch
  ) => {
    e.preventDefault();

    const con = true;

    if (con) {
      matchService
        .deleteMatch(match.matchId)
        .then((res) => {
          const allMatchs: any = [
            ...matches.docs,
          ];

          const allM =
            allMatchs.filter(
              (m: IMatch) =>
                m.matchId !== match.matchId
            );

          setMaches({
            ...matches,
            docs: allM,
          });
        });
    }
  };

  const rollbackResult = (
    e: MouseEvent<HTMLAnchorElement>,
    match: IMatch
  ) => {
    e.preventDefault();

    matchService
      .rollbackResultMarket(match.matchId)
      .then(() => {
        activeMatches(page);
      });
  };

  const openMaxBetPopup = (
    e: MouseEvent<
      HTMLAnchorElement | undefined
    >,
    match?: IMatch,
    closed?: boolean
  ) => {
    e.preventDefault();

    if (match) {
      setSelectedMatch(match);
    }

    setIsOpen(!isOpen);

    if (closed) {
      const allMatches = [
        ...matches.docs,
      ];

      const index =
        allMatches.findIndex(
          (m: IMatch) =>
            m._id === match?._id
        );

      allMatches[index] = match;

      setMaches({
        docs: allMatches,
      });
    }
  };

  const listMenu = () => {
    const menus = [
      {
        type: "",
        label: "Current Match",
      },
      {
        type: "1",
        label: "Completed Match",
      },
      {
        type: "2",
        label: "Deleted Match",
      },
    ];

    const type =
      matchType === undefined
        ? ""
        : matchType;

    return menus.map((menu) => (
      <li
        key={menu.type}
        onClick={() => {
          setPage(1);
        }}
        className="am-tab-item"
      >
        <CustomLink
          to={`/active-matches/${sportId}/${menu.type}`}
          className={`am-tab-link ${
            type === menu.type
              ? "am-tab-active"
              : ""
          }`}
        >
          {menu.label}
        </CustomLink>
      </li>
    ));
  };

  const onSearchSubmit = () => {
    activeMatches(1);
    setPage(1);
  };

  const matchDocs =
    matches?.docs || [];

  const activeCount =
    matchDocs.filter(
      (match: IMatch) =>
        match.active
    ).length;

  const inactiveCount =
    matchDocs.filter(
      (match: IMatch) =>
        !match.active
    ).length;

  return (
    <>
      {mobileSubheader.subheaderdesktopadmin(
        "Match List"
      )}

      <div className="am-page">
        <div className="am-container">
          <div className="am-header">
            <div>
              <span className="am-eyebrow">
                Sports Management
              </span>

              <h2>
                Match Control Center
              </h2>

              <p>
                Search, manage and control
                active matches from a single
                dashboard.
              </p>
            </div>

            <div className="am-stats">
              <div className="am-stat-card">
                <span>
                  Visible Matches
                </span>

                <strong>
                  {matchDocs.length}
                </strong>
              </div>

              <div className="am-stat-card am-active-card">
                <span>
                  Active
                </span>

                <strong>
                  {activeCount}
                </strong>
              </div>

              <div className="am-stat-card am-inactive-card">
                <span>
                  Inactive
                </span>

                <strong>
                  {inactiveCount}
                </strong>
              </div>
            </div>
          </div>

          <div className="am-control-panel">
            <div className="am-tabs-wrap">
              <ul className="am-tabs">
                {listMenu()}
              </ul>
            </div>

            <div className="am-search-box">
              <div className="am-search-input-wrap">
                <span className="am-search-icon">
                  ⌕
                </span>

                <input
                  type="text"
                  value={
                    searchByMatch
                  }
                  placeholder="Search match name..."
                  onChange={(e) =>
                    setSearchByMatch(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      onSearchSubmit();
                    }
                  }}
                />

                {searchByMatch && (
                  <button
                    type="button"
                    className="am-clear-search"
                    onClick={() =>
                      setSearchByMatch("")
                    }
                  >
                    ×
                  </button>
                )}
              </div>

              <button
                type="button"
                className="am-search-btn"
                onClick={
                  onSearchSubmit
                }
              >
                Search Match
              </button>
            </div>
          </div>

          <div className="am-table-card">
            <div className="am-table-header">
              <div>
                <h3>
                  Match Overview
                </h3>

                <span>
                  Page {page}
                </span>
              </div>

              <div className="am-list-indicator">
                <span className="am-pulse-dot" />
                Live Match List
              </div>
            </div>

            <div className="am-table-scroll">
              <table className="am-table">
                <thead>
                  <tr>
                    <th>
                      Live
                    </th>

                    <th>
                      Match Details
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                    <th>
                      Bet Limit
                    </th>

                    <th>
                      Fancy
                    </th>

                    <th>
                      Combine
                    </th>

                    <th>
                      Rollback
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {Object.keys(
                    matches
                  ).length > 0 &&
                  matchDocs.length >
                    0 ? (
                    matchDocs.map(
                      (
                        match: IMatch
                      ) => (
                        <tr
                          key={
                            match.matchId
                          }
                          className={
                            match.active
                              ? "am-row-active"
                              : "am-row-inactive"
                          }
                        >
                          <td
                            data-label="Live"
                          >
                            <div className="am-live-cell">
                              <span
                                className={`am-live-status ${
                                  match.active
                                    ? "am-live-on"
                                    : "am-live-off"
                                }`}
                              >
                                <span />
                              </span>
                            </div>
                          </td>

                          <td
                            data-label="Match"
                          >
                            <div className="am-match-info">
                              <div className="am-match-avatar">
                                {match.name
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase() ||
                                  "M"}
                              </div>

                              <div className="am-match-text">
                                <CustomLink
                                  to={`/active-markets/${match.matchId}`}
                                  className="am-match-name"
                                >
                                  {
                                    match.name
                                  }
                                </CustomLink>

                                <div className="am-match-meta">
                                  <span>
                                    ID #
                                    {
                                      match.matchId
                                    }
                                  </span>

                                  <span className="am-meta-divider">
                                    •
                                  </span>

                                  <span>
                                    {moment(
                                      match.matchDateTime
                                    ).format(
                                      dateFormat
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td
                            data-label="Status"
                          >
                            <span
                              className={`am-status-pill ${
                                match.active
                                  ? "am-status-active"
                                  : "am-status-inactive"
                              }`}
                            >
                              <span className="am-status-dot" />

                              {match.active
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          <td
                            data-label="Actions"
                          >
                            <div className="am-action-group">
                              <a
                                href="#"
                                className={`am-action-btn ${
                                  match.active
                                    ? "am-action-disable"
                                    : "am-action-enable"
                                }`}
                                onClick={(
                                  e
                                ) =>
                                  changeStatus(
                                    e,
                                    match
                                  )
                                }
                              >
                                {match.active
                                  ? "Disable"
                                  : "Enable"}
                              </a>

                              <a
                                href="#"
                                className="am-action-btn am-action-delete"
                                onClick={(
                                  e
                                ) =>
                                  deleteMatch(
                                    e,
                                    match
                                  )
                                }
                              >
                                {match.isDelete
                                  ? "Undo"
                                  : "Delete"}
                              </a>
                            </div>
                          </td>

                          <td
                            data-label="Bet Limit"
                          >
                            <a
                              href="#"
                              className="am-feature-btn"
                              onClick={(
                                e: any
                              ) =>
                                openMaxBetPopup(
                                  e,
                                  match
                                )
                              }
                            >
                              <span className="am-feature-icon">
                                ₹
                              </span>

                              Bet Limit
                            </a>
                          </td>

                          <td
                            data-label="Fancy"
                          >
                            <CustomLink
                              to={`/active-fancies/${match.matchId}`}
                              className="am-feature-btn am-fancy-btn"
                            >
                              <span className="am-feature-icon">
                                F
                              </span>

                              Manage
                            </CustomLink>
                          </td>

                          <td
                            data-label="Combine"
                          >
                            <CustomLink
                              to={`/active-fancies/two/${match.matchId}`}
                              className="am-feature-btn am-combine-btn"
                            >
                              <span className="am-feature-icon">
                                C
                              </span>

                              Result
                            </CustomLink>
                          </td>

                          <td
                            data-label="Rollback"
                          >
                            {match.result ? (
                              <a
                                href="#"
                                className="am-feature-btn am-rollback-btn"
                                onClick={(
                                  e: any
                                ) =>
                                  rollbackResult(
                                    e,
                                    match
                                  )
                                }
                              >
                                ↶ Rollback
                              </a>
                            ) : (
                              <span className="am-no-result">
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan={8}>
                        <div className="am-empty">
                          <div className="am-empty-icon">
                            ◌
                          </div>

                          <h3>
                            No Matches
                            Found
                          </h3>

                          <p>
                            Try another
                            search or match
                            category.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {matches?.totalPages >
            0 && (
            <div className="am-pagination-wrap">
              <ReactPaginate
                breakLabel="..."
                nextLabel="Next"
                previousLabel="Previous"
                forcePage={
                  page - 1
                }
                onPageChange={
                  handlePageClick
                }
                pageRangeDisplayed={
                  5
                }
                pageCount={
                  matches.totalPages
                }
                containerClassName="am-pagination"
                activeClassName="am-page-active"
                pageClassName="am-page-item"
                previousClassName="am-page-nav"
                nextClassName="am-page-nav"
                breakClassName="am-page-break"
              />
            </div>
          )}

          <BetMaxLimitModal
            showDialog={isOpen}
            selectedMatch={
              selectedMatch
            }
            closeModal={(
              e: any,
              savedMatch: any
            ) => {
              openMaxBetPopup(
                e,
                savedMatch,
                true
              );
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ActiveMatches;