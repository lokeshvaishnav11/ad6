// import React from 'react'
// import accountService from '../../../services/account.service';
// import { AxiosResponse } from 'axios';
// import moment from 'moment';

// const CasinoDetail = () => {

//     const [casinoData, setCasinoData] = React.useState<any>([]);
//     const [openMatch, setOpenMatch] = React.useState<string | null>(null);

//     const [filteredData, setFilteredData] = React.useState<any>([]);
//     const [startDate, setStartDate] = React.useState("");
//     const [endDate, setEndDate] = React.useState("");

//     const handleFilter = () => {
//         if (!startDate || !endDate) return;

//         const start = moment(startDate).startOf("day");
//         const end = moment(endDate).endOf("day");

//         const filtered = casinoData.filter((item: any) => {
//             const betTime = moment(item.betClickTime);
//             return betTime.isBetween(start, end, undefined, "[]"); // inclusive
//         });

//         setFilteredData(filtered);
//     };

//     React.useEffect(() => {
//         accountService.marketcasino().then((res: AxiosResponse) => {
//             //console.log(res, "casinoooo data");
//             const allData = res?.data?.data?.bets?.reverse() || [];
//             setCasinoData(allData);
//             setFilteredData(allData); //

//         });

//     }, []);

//     const groupedData = filteredData.reduce((acc: any, bet: any) => {
//         const key = bet.matchName;
//         if (!acc[key]) acc[key] = [];
//         acc[key].push(bet);
//         return acc;
//     }, {});

//     const [expandedMatches, setExpandedMatches] = React.useState<{ [key: string]: boolean }>({});

//     return (
//         <div className=' body-wrap'>

//             <h2 className="ledger-title">Casino Details</h2>

//             <div style={{ fontSize: "12px" }} className="d-flex gap-2 align-items-end mb-3  flex-wrap">
//                 <div className='me-1'>
//                     <label className="form-label mb-1 ">Start Date</label>
//                     <input
//                         type="date"
//                         value={startDate}
//                         className="form-control p-1"
//                         onChange={(e) => setStartDate(e.target.value)}
//                     />
//                 </div>
//                 <div className='me-1'>
//                     <label className="form-label mb-1">End Date</label>
//                     <input
//                         type="date"
//                         value={endDate}
//                         className="form-control p-1"
//                         onChange={(e) => setEndDate(e.target.value)}
//                     />
//                 </div>
//                 <div>
//                     <button className="btn btn-primary" onClick={handleFilter}>
//                         Filter
//                     </button>
//                 </div>
//             </div>

//             <div className="card-content">
//                 <div className=" coupon-table">
//                     <div>
//                         {Object.entries(groupedData).map(([matchName, bets]: [string, any[]], i) => {
//                             // const totalPnL = bets.reduce((sum, b) => sum + b.profitLoss, 0);
//                             const totalPnL = bets.reduce((sum, b) => {
//                                 const pl = typeof b.profitLoss === "object" && b.profitLoss.$numberDecimal
//                                     ? parseFloat(b.profitLoss.$numberDecimal)
//                                     : parseFloat(b.profitLoss) || 0;
//                                 return sum + pl;
//                             }, 0);
//                             const isPositive = totalPnL >= 0;

//                             return (
//                                 <React.Fragment key={i}>
//                                     <div className='container mt-2 p-0'>
//                                         <div className='card single-match text-center my-2'>
//                                             <a
//                                                 className=""
//                                                 style={{
//                                                     cursor: "pointer",
//                                                     backgroundColor: "#F4EED0",
//                                                 }}
//                                                 onClick={() => setOpenMatch(openMatch === matchName ? null : matchName)}
//                                             >
//                                                 <h5 className="mb-2 ng-binding" style={{ backgroundColor: "darkgoldenrod" }}>{matchName}</h5>

//                                                 <div className="d-flex p-1 justify-content-between">
//                                                     <p className="">Start On</p>
//                                                     <p className="">
//                                                         {
//                                                             bets[0]?.betClickTime
//                                                                 ? moment(bets[0].betClickTime).format("MM/DD/YYYY h:mm:ss")
//                                                                 : "-"
//                                                         }
//                                                     </p>
//                                                 </div>

//                                                 <div className="d-flex p-1 justify-content-between">
//                                                     <p className="mb-0">Total PnL:</p>
//                                                     <p
//                                                         className={`mb-0 ${isPositive ? "text-danger" : "text-success"
//                                                             } fw-bold`}
//                                                     >
//                                                         {totalPnL?.toFixed(2)}
//                                                     </p>
//                                                 </div>

//                                                 {openMatch === matchName && (() => {
//                                                     // Move this to your component scope (not here inside JSX)

//                                                     const isExpanded = expandedMatches[matchName] || false;
//                                                     const displayedBets = isExpanded ? bets : bets.slice(0, 20);

//                                                     return (
//                                                         <div>
//                                                             <div className="table-responsive" style={{ overflowX: 'scroll' }}>
//                                                                 <div style={{ minWidth: '750px' }}>
//                                                                     <table className="table table-sm table-striped table-bordered mb-0 text-nowrap">
//                                                                         <thead className="table-secondary text-center fs-6">
//                                                                             <tr>
//                                                                                 <th className='text-center'>Username</th>
//                                                                                 <th>Type</th>
//                                                                                 <th>Rate</th>
//                                                                                 <th>Amount</th>
//                                                                                 <th>PnL</th>
//                                                                                 <th>Status</th>
//                                                                                 <th>Date/Time</th>
//                                                                             </tr>
//                                                                         </thead>
//                                                                         <tbody>
//                                                                             {displayedBets.map((b: any, j: number) => (
//                                                                                 <tr key={j} className="text-center align-middle fs-6">
//                                                                                     <td>{b?.userName} ({b?.parentNameStr})</td>
//                                                                                     <td>{b?.selectionName}</td>
//                                                                                     <td>{b?.odds}</td>
//                                                                                     <td>{b?.stack}</td>
//                                                                                     <td className={b?.profitLoss >= 0 ? "text-success" : "text-danger"}>
//                                                                                         {b?.profitLoss?.$numberDecimal?.toFixed(2)}
//                                                                                     </td>
//                                                                                     <td>
//                                                                                         <span className={`badge rounded-pill text-light ${b?.profitLoss?.$numberDecimal >= 0 ? "bg-success" : "bg-danger"}`}>
//                                                                                             {b?.profitLoss?.$numberDecimal >= 0 ? "Win" : "Lost"}
//                                                                                         </span>
//                                                                                     </td>
//                                                                                     <td>{moment(b?.betClickTime).format("MM/DD/YYYY h:mm:ss a")}</td>
//                                                                                 </tr>
//                                                                             ))}
//                                                                         </tbody>
//                                                                     </table>
//                                                                 </div>

//                                                                 {bets.length > 20 && (
//                                                                     <div className="text-center mt-2">
//                                                                         <button
//                                                                             className="btn btn-sm btn-primary text-light"
//                                                                             onClick={(e) => {
//                                                                                 e.stopPropagation(); // prevent closing match on button click
//                                                                                 setExpandedMatches(prev => ({
//                                                                                     ...prev,
//                                                                                     [matchName]: !isExpanded
//                                                                                 }));
//                                                                             }}
//                                                                         >
//                                                                             {isExpanded ? "View Less" : "View All"}
//                                                                         </button>
//                                                                     </div>
//                                                                 )}
//                                                             </div>

//                                                         </div>
//                                                     );
//                                                 })()}

//                                             </a>
//                                         </div>
//                                     </div>
//                                 </React.Fragment>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>

//         </div>
//     )
// }

// export default CasinoDetail

// import React from "react";
// import accountService from "../../../services/account.service";
// import { AxiosResponse } from "axios";
// import moment from "moment-timezone";
// import { useAppSelector } from "../../../redux/hooks";
// import { selectUserData } from "../../../redux/actions/login/loginSlice";

// const CasinoDetail = () => {
//   const [casinoData, setCasinoData] = React.useState<any>([]);
//   const [openMatch, setOpenMatch] = React.useState<string | null>(null);
//   const [filteredData, setFilteredData] = React.useState<any>([]);
//   const [startDate, setStartDate] = React.useState("");
//   const [endDate, setEndDate] = React.useState("");
//   const [expandedMatches, setExpandedMatches] = React.useState<{
//     [key: string]: boolean;
//   }>({});
//   const userState = useAppSelector(selectUserData);

//   // ✅ Helper function to safely parse Decimal128 or string to number
//   const toNumber = (val: any): number => {
//     if (!val) return 0;
//     if (typeof val === "object" && val.$numberDecimal)
//       return parseFloat(val.$numberDecimal);
//     if (typeof val === "string") return parseFloat(val);
//     return typeof val === "number" ? val : 0;
//   };

//   const handleFilter = () => {
//     if (!startDate || !endDate) return;

//     const start = moment(startDate).startOf("day");
//     const end = moment(endDate).endOf("day");

//     const filtered = casinoData.filter((item: any) => {
//       const betTime = moment(item.betClickTime);
//       return betTime.isBetween(start, end, undefined, "[]"); // inclusive
//     });

//     setFilteredData(filtered);
//   };

//   React.useEffect(() => {
//     // dono date selected hone par auto filter
//     if (startDate && endDate) {
//       handleFilter();
//     }
  
//     // agar date clear ho jaye to full data dikhao
//     if (!startDate && !endDate) {
//       setFilteredData(casinoData);
//     }
//   }, [startDate, endDate, casinoData]);
  

//   React.useEffect(() => {
//     accountService.marketcasino().then((res: AxiosResponse) => {
//       //console.log(res, "casinoooo data");
//       const allData = res?.data?.data?.bets?.reverse() || [];
//       setCasinoData(allData);
//       setFilteredData(allData);
//     });
//   }, []);

//   const groupedData = filteredData.reduce((acc: any, bet: any) => {
//     const key = bet.matchName;
//     if (!acc[key]) acc[key] = [];
//     acc[key].push(bet);
//     return acc;
//   }, {});

//   return (
//     <div className="body-wrap">
//       <h2 className="ledger-title text-xl mt-2">Casino Details</h2>

//       <div
       
//         className="d-flex row align-items-end mb-3 mt-3 flex-wrap"
//       >
//         <div className="me-1 col-6">
//           <label className="form-label mb-1 text-sm">Start Date</label>
//           <input
//             type="date"
//             value={startDate}
//             className="form-control p-1"
//             onChange={(e) => setStartDate(e.target.value)}
//           />
//         </div>
//         <div className="me-1 col-6">
//           <label className="form-label mb-1 text-sm">End Date</label>
//           <input
//             type="date"
//             value={endDate}
//             className="form-control p-1"
//             onChange={(e) => setEndDate(e.target.value)}
//           />
//         </div>
//         {/* <div>
//           <button className="btn btn-primary" onClick={handleFilter}>
//             Filter
//           </button>
//         </div> */}
//       </div>

//       <div className="card-content">
//         <div className="coupon-table">
//           <div>
//             {Object.entries(groupedData).map(
//               ([matchName, bets]: [string, any[]], i) => {
//                 // ✅ Safely calculate total PnL
//                 const totalPnL = bets.reduce(
//                   (sum, b) => sum + toNumber(b.profitLoss),
//                   0
//                 );
//                 const isPositive = totalPnL >= 0;

//                 return (
//                   <React.Fragment key={i}>
//                     <div className="container mt-2 p-0">
//                       <div className="card single-match text-center my-2">
//                         <a
//                           style={{
//                             cursor: "pointer",
//                             backgroundColor: "#F4EED0",
//                           }}
//                           onClick={() =>
//                             setOpenMatch(
//                               openMatch === matchName ? null : matchName
//                             )
//                           }
//                         >
//                           <h5
//                             className="mb-2 ng-binding"
//                             style={{ backgroundColor: "black" }}
//                           >
//                             {matchName}
//                           </h5>

//                           <div className="d-flex p-1 justify-content-between">
//                             <p className="">Start On</p>
//                             <p className="">
//                               {bets[0]?.betClickTime
//                                 ? moment(bets[0].betClickTime).format(
//                                     "MM/DD/YYYY h:mm:ss"
//                                   )
//                                 : "-"}
//                             </p>
//                           </div>

//                           <div className="d-flex p-1 justify-content-between">
//                             <p className="mb-0">Total PnL:</p>
//                             <p
//                               className={`mb-0 ${
//                                 isPositive ? "text-danger" : "text-success"
//                               } fw-bold`}
//                             >
//                               {totalPnL.toFixed(2)}
//                             </p>
//                           </div>

//                           {openMatch === matchName &&
//                             (() => {
//                               const isExpanded =
//                                 expandedMatches[matchName] || false;
//                               const displayedBets = isExpanded
//                                 ? bets
//                                 : bets.slice(0, 20);

//                               return (
//                                 <div>
//                                   <div
//                                     className="table-responsive"
//                                     style={{ overflowX: "scroll" }}
//                                   >
//                                     <div style={{ minWidth: "750px" }}>
//                                       <table className="table table-sm table-striped table-bordered mb-0 text-nowrap">
//                                         <thead className="table-secondary text-center fs-6">
//                                           <tr>
//                                             <th className="text-center">
//                                               Username
//                                             </th>
//                                             <th>Type</th>
//                                             <th>Rate</th>
//                                             <th>Amount</th>
//                                             <th>PnL</th>
//                                             <th>Status</th>
//                                             <th>Date/Time</th>
//                                           </tr>
//                                         </thead>
//                                         <tbody>
//                                           {displayedBets.map(
//                                             (b: any, j: number) => {
//                                               const pl = toNumber(b.profitLoss);
//                                               return (
//                                                 <tr
//                                                   key={j}
//                                                   className="text-center align-middle fs-6"
//                                                 >
//                                                   <td
//                                                     style={{ fontSize: "10px" }}
//                                                     className="p-1 pt-2 "
//                                                   >
//                                                     {" "}
//                                                     {b?.parentData
//                                                       ?.slice(
//                                                         b?.parentData.indexOf(
//                                                           userState.user
//                                                             .username
//                                                         ) + 1
//                                                       )
//                                                       .join("/")}
//                                                     /{b?.userName}
//                                                   </td>

//                                                   <td>{b?.selectionName}</td>
//                                                   <td>{b?.odds}</td>
//                                                   <td>{b?.stack}</td>
//                                                   <td
//                                                     className={
//                                                       pl >= 0
//                                                         ? "text-success"
//                                                         : "text-danger"
//                                                     }
//                                                   >
//                                                     {pl.toFixed(2)}
//                                                   </td>
//                                                   <td>
//                                                     <span
//                                                       className={`badge rounded-pill text-light ${
//                                                         pl >= 0
//                                                           ? "bg-success"
//                                                           : "bg-danger"
//                                                       }`}
//                                                     >
//                                                       {pl >= 0 ? "Win" : "Lost"}
//                                                     </span>
//                                                   </td>
//                                                   <td>
//                                                     {moment
//                                                       .utc(b?.betClickTime)
//                                                       .format(
//                                                         "MM/DD/YYYY h:mm:ss a"
//                                                       )}
//                                                   </td>
//                                                 </tr>
//                                               );
//                                             }
//                                           )}
//                                         </tbody>
//                                       </table>
//                                     </div>

//                                     {bets.length > 20 && (
//                                       <div className="text-center mt-2">
//                                         <button
//                                           className="btn btn-sm btn-primary text-light"
//                                           onClick={(e) => {
//                                             e.stopPropagation();
//                                             setExpandedMatches((prev) => ({
//                                               ...prev,
//                                               [matchName]: !isExpanded,
//                                             }));
//                                           }}
//                                         >
//                                           {isExpanded
//                                             ? "View Less"
//                                             : "View All"}
//                                         </button>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               );
//                             })()}
//                         </a>
//                       </div>
//                     </div>
//                   </React.Fragment>
//                 );
//               }
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CasinoDetail;




import React from "react";
import accountService from "../../../services/account.service";
import { AxiosResponse } from "axios";
import moment from "moment-timezone";

interface CasinoGame {
  matchId: string | null;
  title: string;

  pnl: number;

  commissionPlus: number;
  commissionMinus: number;

  netPL: number;

  count: number;

  createdAt: string;
}

interface CasinoDay {
  date: string;

  pnl: number;

  commissionPlus: number;
  commissionMinus: number;

  netPL: number;

  games: CasinoGame[];
}

interface GrandTotal {
  pnl: number;

  commissionPlus: number;
  commissionMinus: number;

  netPL: number;
}

const CasinoDetail = () => {
  const [
    rows,
    setRows
  ] = React.useState<
    CasinoDay[]
  >([]);

  const [
    grandTotal,
    setGrandTotal
  ] =
    React.useState<GrandTotal>({
      pnl: 0,

      commissionPlus: 0,

      commissionMinus: 0,

      netPL: 0,
    });

  const [
    loading,
    setLoading
  ] =
    React.useState(false);

  const [
    startDate,
    setStartDate
  ] =
    React.useState("");

  const [
    endDate,
    setEndDate
  ] =
    React.useState("");

  const [
    expandedDates,
    setExpandedDates
  ] =
    React.useState<{
      [key: string]: boolean;
    }>({});

  // ============================================================
  // NUMBER
  // ============================================================

  const toNumber = (
    value: any
  ) => {
    const number =
      Number(value || 0);

    return Number.isFinite(
      number
    )
      ? number
      : 0;
  };

  // ============================================================
  // FORMAT MONEY
  // ============================================================

  const money = (
    value: any
  ) => {
    return toNumber(
      value
    ).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits:
          2,

        maximumFractionDigits:
          2,
      }
    );
  };

  // ============================================================
  // FETCH
  // ============================================================

  const fetchCasinoPL =
    async () => {
      try {
        setLoading(true);

        const res:
          AxiosResponse<any> =
          await accountService
            .casinoProfitLoss(
              1,
              100,
              startDate,
              endDate
            );

        const data =
          res?.data?.data ||
          {};

        setRows(
          Array.isArray(
            data?.rows
          )
            ? data.rows
            : []
        );

        setGrandTotal({
          pnl:
            toNumber(
              data
                ?.grandTotal
                ?.pnl
            ),

          commissionPlus:
            toNumber(
              data
                ?.grandTotal
                ?.commissionPlus
            ),

          commissionMinus:
            toNumber(
              data
                ?.grandTotal
                ?.commissionMinus
            ),

          netPL:
            toNumber(
              data
                ?.grandTotal
                ?.netPL
            ),
        });

      } catch (error) {
        console.error(
          "Casino P/L error:",
          error
        );

      } finally {
        setLoading(
          false
        );
      }
    };

  // ============================================================
  // INITIAL
  // ============================================================

  React.useEffect(
    () => {
      fetchCasinoPL();
    },
    []
  );

  // ============================================================
  // DATE FILTER
  // ============================================================

  const handleFilter =
    () => {
      fetchCasinoPL();
    };

  const clearFilter =
    () => {
      setStartDate("");
      setEndDate("");

      setTimeout(
        () => {
          window.location.reload();
        },
        0
      );
    };

  // ============================================================
  // EXPAND DATE
  // ============================================================

  const toggleDate = (
    date: string
  ) => {
    setExpandedDates(
      (previous) => ({
        ...previous,

        [date]:
          !previous[
            date
          ],
      })
    );
  };

  // ============================================================
  // DETAILS
  // ============================================================

  const handleDetails =
    async (
      game:
        CasinoGame,

      date:
        string
    ) => {
      if (
        !game.matchId
      ) {
        return;
      }

      try {
        const res:
          AxiosResponse<any> =
          await accountService
            .casinoProfitLossDetails(
              game.matchId,
              date
            );

        console.log(
          "CASINO DETAILS =>",
          res?.data?.data
        );

        /**
         * Abhi API ready hai.
         *
         * Is response ko modal/page me
         * show kara sakte ho.
         */
      } catch (
        error
      ) {
        console.error(
          "Casino details error:",
          error
        );
      }
    };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      className="container-fluid px-2 pb-5"
      style={{
        background:
          "#f5f5f5",

        minHeight:
          "100vh",
      }}
    >
      {/* ================================================ */}
      {/* TITLE */}
      {/* ================================================ */}

      <div className="text-center pt-3">
        <h3
          style={{
            fontWeight:
              400,

            color:
              "#333",
          }}
        >
          Casino Profit Loss
        </h3>

        <button
          type="button"
          className="btn btn-secondary btn-sm mb-3"
          onClick={() => {
            const today =
              moment()
                .tz(
                  "Asia/Kolkata"
                )
                .format(
                  "YYYY-MM-DD"
                );

            setStartDate(
              today
            );

            setEndDate(
              today
            );
          }}
        >
          Today P/L
        </button>
      </div>

      {/* ================================================ */}
      {/* FILTER */}
      {/* ================================================ */}

      <div className="card mb-3">
        <div className="card-body p-2">
          <div className="row">
            <div className="col-5">
              <label className="small">
                Start Date
              </label>

              <input
                type="date"
                className="form-control form-control-sm"
                value={
                  startDate
                }
                onChange={(
                  e
                ) =>
                  setStartDate(
                    e.target
                      .value
                  )
                }
              />
            </div>

            <div className="col-5">
              <label className="small">
                End Date
              </label>

              <input
                type="date"
                className="form-control form-control-sm"
                value={
                  endDate
                }
                onChange={(
                  e
                ) =>
                  setEndDate(
                    e.target
                      .value
                  )
                }
              />
            </div>

            <div className="col-2 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-primary btn-sm w-100"
                onClick={
                  handleFilter
                }
              >
                Go
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================ */}
      {/* TABLE */}
      {/* ================================================ */}

      <div
        className="table-responsive"
        style={{
          background:
            "white",
        }}
      >
        <table
          className="table table-bordered table-striped mb-0"
          style={{
            minWidth:
              "650px",

            fontSize:
              "13px",
          }}
        >
          {/* HEADER */}

          <thead>
            <tr
              style={{
                background:
                  "#003b67",

                color:
                  "white",
              }}
            >
              <th
                className="text-center"
                style={{
                  width:
                    "34%",
                }}
              >
                Title
              </th>

              <th className="text-center">
                P&L
              </th>

              <th className="text-center">
                Comm+
              </th>

              <th className="text-center">
                Comm-
              </th>

              <th className="text-center">
                Net P&L
              </th>

              <th className="text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {/* ============================================ */}
            {/* TOTAL */}
            {/* ============================================ */}

            <tr
              style={{
                background:
                  "#050505",

                color:
                  "white",

                fontWeight:
                  600,
              }}
            >
              <td className="text-center">
                Total
              </td>

              <td className="text-center">
                {money(
                  grandTotal.pnl
                )}
              </td>

              <td className="text-center">
                {money(
                  grandTotal
                    .commissionPlus
                )}
              </td>

              <td className="text-center">
                {money(
                  grandTotal
                    .commissionMinus
                )}
              </td>

              <td className="text-center">
                {money(
                  grandTotal
                    .netPL
                )}
              </td>

              <td />
            </tr>

            {/* ============================================ */}
            {/* LOADING */}
            {/* ============================================ */}

            {loading && (
              <tr>
                <td
                  colSpan={
                    6
                  }
                  className="text-center py-4"
                >
                  Loading...
                </td>
              </tr>
            )}

            {/* ============================================ */}
            {/* DAYS */}
            {/* ============================================ */}

            {!loading &&
              rows.map(
                (
                  day
                ) => {
                  const expanded =
                    expandedDates[
                      day.date
                    ] !==
                    false;

                  return (
                    <React.Fragment
                      key={
                        day.date
                      }
                    >
                      {/* ================================= */}
                      {/* DATE TOTAL */}
                      {/* ================================= */}

                      <tr
                        style={{
                          background:
                            "#f6c900",

                          cursor:
                            "pointer",

                          fontWeight:
                            500,
                        }}
                        onClick={() =>
                          toggleDate(
                            day.date
                          )
                        }
                      >
                        <td className="text-center">
                          {moment(
                            day.date
                          ).format(
                            "DD-MMM-YYYY"
                          )}
                        </td>

                        <td className="text-center">
                          {money(
                            day.pnl
                          )}
                        </td>

                        <td className="text-center">
                          {money(
                            day
                              .commissionPlus
                          )}
                        </td>

                        <td className="text-center">
                          {money(
                            day
                              .commissionMinus
                          )}
                        </td>

                        <td className="text-center">
                          {money(
                            day.netPL
                          )}
                        </td>

                        <td className="text-center">
                          {expanded
                            ? "▲"
                            : "▼"}
                        </td>
                      </tr>

                      {/* ================================= */}
                      {/* GAME ROWS */}
                      {/* ================================= */}

                      {expanded &&
                        day.games?.map(
                          (
                            game,
                            index
                          ) => (
                            <tr
                              key={`${day.date}-${game.matchId}-${index}`}
                            >
                              <td className="text-center">
                                {moment(
                                  day.date
                                ).format(
                                  "DD-MM-YYYY"
                                )}{" "}
                                {
                                  game.title
                                }
                              </td>

                              <td className="text-center">
                                {money(
                                  game.pnl
                                )}
                              </td>

                              <td className="text-center">
                                {money(
                                  game
                                    .commissionPlus
                                )}
                              </td>

                              <td className="text-center">
                                {money(
                                  game
                                    .commissionMinus
                                )}
                              </td>

                              <td
                                className={`text-center ${
                                  toNumber(
                                    game.netPL
                                  ) >=
                                  0
                                    ? "text-success"
                                    : "text-danger"
                                }`}
                              >
                                {money(
                                  game.netPL
                                )}
                              </td>

                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  disabled={
                                    !game.matchId
                                  }
                                  onClick={() =>
                                    handleDetails(
                                      game,
                                      day.date
                                    )
                                  }
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          )
                        )}
                    </React.Fragment>
                  );
                }
              )}

            {/* EMPTY */}

            {!loading &&
              rows.length ===
                0 && (
                <tr>
                  <td
                    colSpan={
                      6
                    }
                    className="text-center py-4"
                  >
                    No casino
                    profit/loss
                    records found
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CasinoDetail;