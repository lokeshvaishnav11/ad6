// import React, { MouseEvent } from "react";
// import mobileSubheader from "../_layout/elements/mobile-subheader";
// import { isMobile } from "react-device-detect";
// import ICasinoMatch from "../../../models/ICasinoMatch";
// import casinoService from "../../../services/casino.service";
// import { AxiosResponse } from "axios";
// import { toast } from "react-toastify";

// const CasinoList = () => {
//   const [casinoList, setCasinoList] = React.useState<ICasinoMatch[]>([]);

//   React.useEffect(() => {
//     casinoService
//       .getCasinoList()
//       .then((res: AxiosResponse<{ data: ICasinoMatch[] }>) => {
//         setCasinoList(res.data.data);
//       });
//   }, []);

//   const onChecked = (
//     e: MouseEvent<HTMLInputElement>,
//     item: ICasinoMatch,
//     index: number
//   ) => {
//     const items = [...casinoList];
//     items[index] = { ...item, isDisable: !item.isDisable };
//     setCasinoList(items);
//     casinoService
//       .disableCasino(`${item.match_id}`)
//       .then((res: AxiosResponse<{ data: ICasinoMatch[]; message: any }>) => {
//         // //console.log(res,"fdfddf")
//         toast.success("Game Updated");
//         setTimeout(() => {
//           window.location.reload();
//         }, 1000);
//         //
//       });
//   };

//   //console.log(casinoList, "transaction data");
//   const allowedMatchIds = [
//     24, 36, 11, 9, 27, 26, 13, 40, 25, 37, 39, 29, 17, 18, 44,244,114,274,404,254
//   ];

//   const TransactionData = casinoList.length ? (
//     casinoList
//       .filter((item: any) => allowedMatchIds.includes(item.match_id))
//       .map((item: ICasinoMatch, index: number) => {
//         return (
//           <tr key={index}>
//             <td className="text-center">{item.title}</td>
//             <td className="text-center wnwrap">{item.slug}</td>
//             <td className={`text-center wnwrap`}>
//               <input
//                 type={"checkbox"}
//                 checked={item.isDisable}
//                 onClick={(e) => onChecked(e, item, index)}
//               />
//             </td>
//           </tr>
//         );
//       })
//   ) : (
//     <tr>
//       <td colSpan={8} style={{ textAlign: "center" }}>
//         No Result Found
//       </td>
//     </tr>
//   );
//   return (
//     <>
//       {mobileSubheader.subheaderdesktopadmin("Casino List")}
//       <div className="container-fluid">
//         <div className="row">
//           <div
//             className={
//               !isMobile ? "col-md-12 mt-1" : "col-md-12 padding-custom"
//             }
//           >
//             <div className="">
//               <div className="card-body">
//                 <div className="table-responsive">
//                   <table id="customers1">
//                     <thead>
//                       <tr>
//                         <th className="text-center bg2 text-white wnwrap">
//                           Name
//                         </th>
//                         <th className="text-center bg2 text-white wnwrap">
//                           Slug
//                         </th>
//                         <th className="text-center bg2 text-white wnwrap">
//                           Action
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>{TransactionData}</tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
// export default CasinoList;


import React, { MouseEvent } from "react";
import mobileSubheader from "../_layout/elements/mobile-subheader";
import { isMobile } from "react-device-detect";
import ICasinoMatch from "../../../models/ICasinoMatch";
import casinoService from "../../../services/casino.service";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import "./casino-list.css";

const CasinoList = () => {
  const [casinoList, setCasinoList] = React.useState<ICasinoMatch[]>([]);
  const [updatingId, setUpdatingId] = React.useState<number | null>(null);

  React.useEffect(() => {
    casinoService
      .getCasinoList()
      .then((res: AxiosResponse<{ data: ICasinoMatch[] }>) => {
        setCasinoList(res.data.data);
      });
  }, []);

  const onChecked = (
    e: MouseEvent<HTMLInputElement>,
    item: ICasinoMatch,
    index: number
  ) => {
    const items = [...casinoList];

    items[index] = {
      ...item,
      isDisable: !item.isDisable,
    };

    setCasinoList(items);

    setUpdatingId(Number(item.match_id));

    casinoService
      .disableCasino(`${item.match_id}`)
      .then(
        (
          res: AxiosResponse<{
            data: ICasinoMatch[];
            message: any;
          }>
        ) => {
          toast.success("Game Updated");

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      )
      .catch((e) => {
        toast.error(
          e?.response?.data?.message ||
            e?.message ||
            "Something went wrong"
        );

        setCasinoList((prev) =>
          prev.map((casino) =>
            casino.match_id === item.match_id
              ? {
                  ...casino,
                  isDisable: item.isDisable,
                }
              : casino
          )
        );
      })
      .finally(() => {
        setUpdatingId(null);
      });
  };

  const allowedMatchIds = [
    24,
    36,
    11,
    9,
    27,
    26,
    13,
    40,
    25,
    37,
    39,
    29,
    17,
    18,
    44,
    244,
    114,
    274,
    404,
    254,
  ];

  const filteredCasinoList = casinoList.filter((item: any) =>
    allowedMatchIds.includes(item.match_id)
  );

  const enabledCount = filteredCasinoList.filter(
    (item) => !item.isDisable
  ).length;

  const disabledCount = filteredCasinoList.filter(
    (item) => item.isDisable
  ).length;

  const TransactionData = filteredCasinoList.length ? (
    filteredCasinoList.map((item: ICasinoMatch) => {
      const originalIndex = casinoList.findIndex(
        (casino) => casino.match_id === item.match_id
      );

      const isUpdating =
        updatingId === Number(item.match_id);

      return (
        <tr
          key={item.match_id}
          className={`casino-row ${
            item.isDisable ? "casino-disabled-row" : ""
          }`}
        >
          <td data-label="Game">
            <div className="casino-game-info">
              <div className="casino-game-icon">
                {item.title?.charAt(0)?.toUpperCase() || "G"}
              </div>

              <div className="casino-game-text">
                <span className="casino-game-name">
                  {item.title}
                </span>

                <span className="casino-game-id">
                  Game ID #{item.match_id}
                </span>
              </div>
            </div>
          </td>

          <td data-label="Slug">
            <span className="casino-slug">
              {item.slug}
            </span>
          </td>

          <td data-label="Status">
            <div className="casino-action">
              <label
                className={`casino-switch ${
                  isUpdating ? "casino-switch-loading" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.isDisable}
                  disabled={isUpdating}
                  onClick={(e) =>
                    onChecked(
                      e,
                      item,
                      originalIndex
                    )
                  }
                  readOnly
                />

                <span className="casino-switch-slider">
                  <span className="casino-switch-circle" />
                </span>
              </label>

              <span
                className={`casino-status-badge ${
                  item.isDisable
                    ? "casino-status-disabled"
                    : "casino-status-active"
                }`}
              >
                <span className="casino-status-dot" />

                {isUpdating
                  ? "Updating..."
                  : item.isDisable
                  ? "Disabled"
                  : "Active"}
              </span>
            </div>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={3}>
        <div className="casino-empty-state">
          <div className="casino-empty-icon">
            ◇
          </div>

          <h3>No Casino Games Found</h3>

          <p>
            There are currently no available games.
          </p>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      {mobileSubheader.subheaderdesktopadmin(
        "Casino List"
      )}

      <div className="casino-admin-page">
        <div
          className={
            !isMobile
              ? "casino-admin-container"
              : "casino-admin-container casino-mobile-container"
          }
        >
          <div className="casino-page-header">
            <div>
              <span className="casino-page-label">
                Casino Management
              </span>

              <h2>Casino Games</h2>

              <p>
                Manage game availability from one
                place.
              </p>
            </div>

            <div className="casino-stats">
              <div className="casino-stat-card">
                <span>Total Games</span>

                <strong>
                  {filteredCasinoList.length}
                </strong>
              </div>

              <div className="casino-stat-card casino-active-stat">
                <span>Active</span>

                <strong>{enabledCount}</strong>
              </div>

              <div className="casino-stat-card casino-disabled-stat">
                <span>Disabled</span>

                <strong>{disabledCount}</strong>
              </div>
            </div>
          </div>

          <div className="casino-toolbar">
            <div className="casino-toolbar-left">
              <div className="casino-live-dot" />

              <span>
                Available Casino Games
              </span>
            </div>

            <div className="casino-toolbar-count">
              {filteredCasinoList.length} Games
            </div>
          </div>

          <div className="casino-table-card">
            <div className="casino-table-responsive">
              <table className="casino-modern-table">
                <thead>
                  <tr>
                    <th>Game</th>
                    <th>Slug</th>
                    <th className="casino-status-heading">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {TransactionData}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CasinoList;