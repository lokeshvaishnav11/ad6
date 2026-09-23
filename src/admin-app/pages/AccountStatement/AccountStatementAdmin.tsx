// import moment from "moment";
// import React, { MouseEvent } from "react";
// import ReactPaginate from "react-paginate";
// import { toast } from "react-toastify";
// import accountService from "../../../services/account.service";
// import { betDateFormat, dateFormat } from "../../../utils/helper";
// import { isMobile } from "react-device-detect";
// import mobileSubheader from "../_layout/elements/mobile-subheader";
// import userService from "../../../services/user.service";
// import CustomAutoComplete from "../../components/CustomAutoComplete";
// import { AccoutStatement } from "../../../models/AccountStatement";
// import betService from "../../../services/bet.service";
// import { AxiosResponse } from "axios";
// import ReactModal from "react-modal";
// import BetListComponent from "../UnsetteleBetHistory/bet-list.component";
// import { useAppSelector } from "../../../redux/hooks";
// import { selectLoader } from "../../../redux/actions/common/commonSlice";

// import "./CommissionTable.css";
// import { useParams } from "react-router-dom";

// const AccountStatementAdmin = () => {
//   const loadingState = useAppSelector(selectLoader);

//   const myuser = useParams().name;

//   const [accountStmt, setAccountStmt] = React.useState<any>({});
//   const [parseAccountStmt, setparseAccountStmt] = React.useState<any>([]);

//   const [tabledata, setTabledata] = React.useState<any>([]);

//   const [closeBalance, setCloseBalance] = React.useState(0);
//   const [currentItems, setCurrentItems] = React.useState<any>([]);
//   const [itemOffset, setItemOffset] = React.useState<any>(0);
//   const [itemsPerPage] = React.useState<any>(50);
//   const [pageCount, setPageCount] = React.useState<any>(0);

//   const [isOpen, setIsOpen] = React.useState(false);
//   const [betHistory, setBetHistory] = React.useState<any>({});
//   const [selectedStmt, setSelectedStmt] = React.useState<AccoutStatement>(
//     {} as AccoutStatement
//   );
//   const [openBalance, setOpenBalance] = React.useState(0);

//   const [filterdata, setfilterdata] = React.useState<any>({
//     startDate: "",
//     endDate: "",
//     reportType: "All",
//     userId: "",
//   });
//   const [page, setPage] = React.useState(1);
//   const [pageBet, setPageBet] = React.useState(1);

//   React.useEffect(() => {
//     const endOffset = itemOffset + itemsPerPage;
//     setCurrentItems(parseAccountStmt.slice(itemOffset, endOffset));
//     setPageCount(Math.ceil(parseAccountStmt.length / itemsPerPage));
//   }, [itemOffset, itemsPerPage, parseAccountStmt]);

//   React.useEffect(() => {
//     betService.lenadena().then((res: AxiosResponse<any>) => {
//       setTabledata(res.data.data);
//       //console.log(res, "res for lena dena jai hind !");
//     });
//   }, []);

//   type TableItem = {
//     Username: string;
//     money: number; // The money value for Casino/Sports
//     // Add other properties if needed
//   };

//   const handlePageClick = (event: any) => {
//     const newOffset = (event.selected * itemsPerPage) % parseAccountStmt.length;
//     setItemOffset(newOffset);
//     setPage(event.selected);
//   };

//   const dataformat = (response: any, closingbalance: any) => {
//     const aryNewFormat: any = [];

//     response &&
//       response.map((stmt: any, index: number) => {
//         closingbalance = closingbalance + stmt.amount;
//         aryNewFormat.push({
//           _id: stmt._id,
//           // eslint-disable-next-line camelcase
//           sr_no: index + 1,
//           date: moment(stmt.createdAt).format(dateFormat),
//           credit: stmt.amount,
//           debit: stmt.amount,
//           closing: closingbalance.toFixed(2),
//           narration: stmt.narration,
//           type: stmt.type,
//           stmt: stmt,
//         });
//       });
//     return aryNewFormat;
//   };

//   React.useEffect(() => {
//     const filterObj = filterdata;
//     filterObj.startDate = moment().subtract(70, "days").format("YYYY-MM-DD");
//     filterObj.endDate = moment().format("YYYY-MM-DD");
//     setfilterdata(filterObj);
//   }, []);

//   const getAccountStmt = (page: number) => {
//     accountService
//       .getAccountList(page, filterdata)
//       .then((res) => {
//         if (res?.data?.data) setAccountStmt(res?.data?.data?.items || []);
//         if (res?.data?.data?.items && page == 0)
//           setOpenBalance(res?.data?.data?.openingBalance || 0);
//         setparseAccountStmt(
//           dataformat(
//             res?.data?.data?.items || [],
//             res?.data?.data?.openingBalance || 0
//           )
//         );
//         setPage(page);
//       })
//       .catch((e) => {
//         console.log(e);
//         // const error = e.response.data.message
//         toast.error("error");
//       });
//   };

//   const handleformchange = (event: any) => {
//     const filterObj = filterdata;
//     filterObj[event.target.name] = event.target.value;
//     setfilterdata(filterObj);
//   };

//   const submitAccountStatement = () => {
//     getAccountStmt(1);
//   };

//   const handleSubmitform = (event: any) => {
//     event.preventDefault();
//     submitAccountStatement();
//   };

//   const onSuggestionsFetchRequested = ({ value }: any) => {
//     return userService.getUserListSuggestion({ username: value });
//   };

//   // React.useEffect(()=>{
//   //   submitAccountStatement();
//   // },[myuser])

//   React.useEffect(() => {
//     if (myuser) {
//       setfilterdata({ ...filterdata, userId: myuser });
//     }
//   }, [myuser]);

//   React.useEffect(() => {
//     if (filterdata.userId) {
//       submitAccountStatement(); // only after userId is set
//     }
//   }, [filterdata.userId]);

//   // const onSelectUser = () => {

//   //   // console.log(user._id,"user id")

//   //   setfilterdata({ ...filterdata, userId: myuser });
//   // };

//   const handlePageClickBets = (event: any) => {
//     getBetsData(selectedStmt, event.selected + 1);
//   };

//   React.useEffect(() => {
//     if (isOpen) getBetsData(selectedStmt, pageBet);
//   }, [selectedStmt, pageBet, isOpen]);

//   const getBetsData = (stmt: AccoutStatement, pageNumber: number) => {
//     const betIds: any = stmt?.allBets?.map(({ betId }: any) => betId);

//     if (betIds && betIds.length > 0) {
//       betService
//         .getBetListByIds(betIds, pageNumber)
//         .then((res: AxiosResponse) => {
//           setIsOpen(true);
//           setBetHistory(res.data.data);
//           setPageBet(pageNumber);
//         });
//     }
//   };

//   const getBets = (
//     e: MouseEvent<HTMLTableCellElement>,
//     stmt: AccoutStatement
//   ) => {
//     e.preventDefault();
//     setBetHistory({});
//     setSelectedStmt(stmt);
//     setPageBet(1);
//     setIsOpen(true);
//   };

//   const getAcHtml = () => {
//     let closingbalance: number = page == 1 ? openBalance : closeBalance;
//     const achtml =
//       currentItems &&
//       currentItems.map((stmt: any, index: number) => {
//         closingbalance = closingbalance + stmt.amount;
//         return (
//           <tr key={`${stmt._id}${index}`}>
//             <td>{stmt.sr_no}</td>
//             <td className="wnwrap">{stmt.date}</td>
//             <td className="green wnwrap">
//               {stmt.credit >= 0 && stmt.credit.toFixed(2)}
//             </td>
//             <td className="red wnwrap">
//               {stmt.credit < 0 && stmt.credit.toFixed(2)}
//             </td>
//             <td className="green wnwrap">{stmt.closing}</td>
//             <td>{stmt.stmt.txnBy}</td>
//             <td
//               onClick={(e: MouseEvent<HTMLTableCellElement>) =>
//                 getBets(e, stmt.stmt)
//               }
//             >
//               <span className={stmt.type == "pnl" ? "label-buttonccc" : ""}>
//                 {stmt.narration}
//               </span>
//             </td>
//           </tr>
//         );
//       });
//     return achtml;
//   };

//   const calculateTotal = (casino: number, sports: number) => {
//     return casino + sports;
//   };

//   return (
//     <>
//       {mobileSubheader.subheaderdesktopadmin("Account Statements")}
//       <div className="container-fluid">
//         <div className="row">
//           <div
//             className={
//               !isMobile ? "col-md-12 mt-1" : "col-md-12 padding-custom"
//             }
//           >
//             <div className="card-body p15 bg-gray mb-20">
//               <form
//                 className="ng-pristine ng-valid ng-touched mb-0"
//                 method="post"
//                 onSubmit={handleSubmitform}
//               >
//                 {/* <div className='row row5'> oldd */}
//                 <div className="row row2">
//                   <div className="col-6 col-lg-2 mbc-5 d-none">
//                     <label className="label">User</label>
//                     <CustomAutoComplete
//                       onSuggestionsFetchRequested={onSuggestionsFetchRequested}
//                       // onSelectUser={onSelectUser}
//                     />
//                   </div>
//                   <div className="col-6 col-lg-2 mbc-5 d-none">
//                     <div className="form-group mb-0">
//                       <label className="label">Start Date</label>
//                       <div className="mx-datepicker">
//                         <div className="mx-input-wrapper">
//                           <input
//                             name="startDate"
//                             type="date"
//                             autoComplete="off"
//                             onChange={handleformchange}
//                             defaultValue={filterdata.startDate}
//                             placeholder="Select Date"
//                             className="mx-input ng-pristine ng-valid ng-touched"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-6 col-lg-2 mbc-5 d-none">
//                     <div className="form-group mb-0">
//                       <label className="label">End Date</label>
//                       <div className="mx-datepicker">
//                         <div className="mx-input-wrapper">
//                           <input
//                             name="endDate"
//                             type="date"
//                             autoComplete="off"
//                             defaultValue={filterdata.endDate}
//                             onChange={handleformchange}
//                             placeholder="Select Date"
//                             className="mx-input ng-untouched ng-pristine ng-valid"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-12 col-lg-2 mbc-5">
//                     <div className="form-group mb-0">
//                       <label className="label">Type</label>
//                       <select
//                         name="reportType"
//                         onChange={handleformchange}
//                         className="custom-select ng-untouched ng-pristine ng-valid"
//                       >
//                         <option value="ALL">All </option>
//                         <option value="chip">Deposit/Withdraw </option>
//                         <option value="game">Game Report </option>
//                       </select>
//                     </div>
//                   </div>
//                   <div className="col-12 col-lg-1 mbc-5">
//                     <label className="label">&nbsp;</label>
//                     <button type="submit" className="btn btn-primary btn-block">
//                       Submit
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//             <div className="card-body">
//               <div className="table-responsive">
//                 <table className="text-center" id="customers1">
//                   <thead>
//                     <tr>
//                       <th
//                         className="text-black"
//                         style={{
//                           width: "10%",
//                           background: "darkgoldenrod",
//                           textAlign: "center",
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         Sr No.
//                       </th>
//                       <th
//                         className="text-black"
//                         style={{
//                           width: "20%",
//                           background: "darkgoldenrod",
//                           textAlign: "center",
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         Date{" "}
//                       </th>
//                       <th
//                         className="text-black"
//                         style={{
//                           width: "10%",
//                           background: "darkgoldenrod",
//                           textAlign: "center",
//                         }}
//                       >
//                         Credit{" "}
//                       </th>
//                       <th
//                         className="text-black"
//                         style={{
//                           width: "10%",
//                           background: "darkgoldenrod",
//                           textAlign: "center",
//                         }}
//                       >
//                         Debit
//                       </th>
//                       <th
//                         className="text-black"
//                         style={{
//                           width: "10%",
//                           background: "darkgoldenrod",
//                           textAlign: "center",
//                         }}
//                       >
//                         Balance
//                       </th>
//                       <th
//                         className="text-black"
//                         style={{
//                           width: "10%",
//                           background: "darkgoldenrod",
//                           textAlign: "center",
//                         }}
//                       >
//                         From
//                       </th>
//                       <th
//                         className="text-black"
//                         style={{
//                           width: "45%",
//                           background: "darkgoldenrod",
//                           textAlign: "center",
//                         }}
//                       >
//                         Remark
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {parseAccountStmt.length <= 0 ||
//                       (parseAccountStmt.length > 0 &&
//                         parseAccountStmt.length <= 0 && (
//                           <tr>
//                             <td colSpan={8} className="text-center">
//                               No Result Found
//                             </td>
//                           </tr>
//                         ))}
//                     {parseAccountStmt.length > 0 &&
//                       parseAccountStmt.length > 0 &&
//                       page == 0 && (
//                         <tr key={parseAccountStmt[0]._id}>
//                           <td>-</td>
//                           <td className="wnwrap">
//                             {moment(parseAccountStmt[0].createdAt).format(
//                               betDateFormat
//                             )}
//                           </td>
//                           <td>-</td>
//                           <td>-</td>
//                           <td className="wnwrap">{openBalance}</td>
//                           <td className="wnwrap">Opening Balance</td>
//                         </tr>
//                       )}

//                     {getAcHtml()}
//                   </tbody>
//                 </table>
//               </div>
//               <ReactPaginate
//                 breakLabel="..."
//                 nextLabel="Next"
//                 onPageChange={handlePageClick}
//                 pageRangeDisplayed={5}
//                 pageCount={pageCount}
//                 containerClassName={"pagination"}
//                 activeClassName={"active"}
//                 previousLabel={"Prev"}
//                 breakClassName={"break-me"}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//       <ReactModal
//         isOpen={isOpen}
//         onAfterClose={() => setIsOpen(false)}
//         onRequestClose={(e: any) => {
//           setIsOpen(false);
//         }}
//         contentLabel="Set Max Bet Limit"
//         className={"col-md-12"}
//         ariaHideApp={false}
//       >
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5>Bets</h5>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="close float-right"
//             >
//               <i className="fa fa-times-circle"></i>
//             </button>
//           </div>
//           <div className="modal-body">
//             {!loadingState && (
//               <BetListComponent
//                 bethistory={betHistory}
//                 handlePageClick={handlePageClickBets}
//                 page={page}
//                 isTrash={false}
//               />
//             )}
//           </div>
//         </div>
//       </ReactModal>
//     </>
//   );
// };
// export default AccountStatementAdmin;


import moment from "moment";
import React, { MouseEvent } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import accountService from "../../../services/account.service";
import { dateFormat } from "../../../utils/helper";
import mobileSubheader from "../_layout/elements/mobile-subheader";
import { AccoutStatement } from "../../../models/AccountStatement";
import betService from "../../../services/bet.service";
import { AxiosResponse } from "axios";
import ReactModal from "react-modal";
import BetListComponent from "../UnsetteleBetHistory/bet-list.component";
import { useAppSelector } from "../../../redux/hooks";
import { selectLoader } from "../../../redux/actions/common/commonSlice";
import { useParams } from "react-router-dom";

import "./CommissionTable.css";

const AccountStatementAdmin = () => {
  const loadingState = useAppSelector(selectLoader);
  const myuser = useParams().name;

  const [currentItems, setCurrentItems] = React.useState<any>([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [itemsPerPage] = React.useState<any>(50);

  const [isOpen, setIsOpen] = React.useState(false);
  const [betHistory, setBetHistory] = React.useState<any>({});

  const [selectedStmt, setSelectedStmt] =
    React.useState<AccoutStatement>({} as AccoutStatement);

  const [openBalance, setOpenBalance] = React.useState(0);
  const [page, setPage] = React.useState(1);

  const [filterdata, setfilterdata] = React.useState<any>({
    startDate: "",
    endDate: "",
    reportType: "All",
    userId: "",
  });

  // ==========================================
  // FORMAT DATA
  // ==========================================

  const dataformat = (
    response: any,
    baseBalance: number,
    startIndex: number
  ) => {
    let closingbalance = baseBalance;

    return response.map((stmt: any, index: number) => {
      closingbalance = closingbalance + stmt.amount;

      return {
        _id: stmt._id,
        sr_no: startIndex + index + 1,
        date: moment(stmt.createdAt).format(dateFormat),
        credit: stmt.amount,
        debit: stmt.amount,
        closing: closingbalance.toFixed(2),
        narration: stmt.narration,
        type: stmt.type,
        stmt: stmt,
      };
    });
  };

  // ==========================================
  // INITIAL DATE
  // ==========================================

  React.useEffect(() => {
    const filterObj = filterdata;

    filterObj.startDate = moment()
      .subtract(70, "days")
      .format("YYYY-MM-DD");

    filterObj.endDate = moment().format("YYYY-MM-DD");

    setfilterdata({ ...filterObj });
  }, []);

  // ==========================================
  // ACCOUNT STATEMENT API
  // ==========================================

  const getAccountStmt = async (pageNumber: number) => {
    try {
      const res = await accountService.getAccountList(
        pageNumber,
        filterdata
      );

      const items = res?.data?.data?.items || [];
      const opening = res?.data?.data?.openingBalance || 0;
      const total = res?.data?.data?.total || 0;

      let baseBalance = opening;

      // Previous pages balance
      if (pageNumber > 1) {
        let prevSum = 0;

        for (let i = 1; i < pageNumber; i++) {
          const prevRes =
            await accountService.getAccountList(i, filterdata);

          const prevItems =
            prevRes?.data?.data?.items || [];

          prevSum += prevItems.reduce(
            (acc: number, curr: any) =>
              acc + curr.amount,
            0
          );
        }

        baseBalance = opening + prevSum;
      }

      setCurrentItems(
        dataformat(
          items,
          baseBalance,
          (pageNumber - 1) * itemsPerPage
        )
      );

      setOpenBalance(opening);

      setPage(pageNumber);

      setPageCount(
        Math.ceil(total / itemsPerPage)
      );
    } catch {
      toast.error("error");
    }
  };

  // ==========================================
  // FILTER SUBMIT
  // ==========================================

  const submitAccountStatement = () => {
    getAccountStmt(1);
  };

  const handleSubmitform = (event: any) => {
    event.preventDefault();

    submitAccountStatement();
  };

  // ==========================================
  // PAGINATION
  // ==========================================

  const handlePageClick = (event: any) => {
    const selectedPage =
      event.selected + 1;

    getAccountStmt(selectedPage);
  };

  // ==========================================
  // FILTER CHANGE
  // ==========================================

  const handleformchange = (event: any) => {
    const filterObj = filterdata;

    filterObj[event.target.name] =
      event.target.value;

    setfilterdata({ ...filterObj });
  };

  React.useEffect(() => {
    if (myuser) {
      setfilterdata({
        ...filterdata,
        userId: myuser,
      });
    }
  }, [myuser]);

  React.useEffect(() => {
    if (filterdata.userId) {
      submitAccountStatement();
    }
  }, [filterdata.userId]);

  // ==========================================
  // BET MODAL
  // ==========================================

  const handlePageClickBets = (event: any) => {
    getBetsData(
      selectedStmt,
      event.selected + 1
    );
  };

  React.useEffect(() => {
    if (isOpen) {
      getBetsData(selectedStmt, 1);
    }
  }, [selectedStmt]);

  const getBetsData = (
    stmt: AccoutStatement,
    pageNumber: number
  ) => {
    const betIds: any =
      stmt?.allBets?.map(
        ({ betId }: any) => betId
      );

    if (betIds && betIds.length > 0) {
      betService
        .getBetListByIds(
          betIds,
          pageNumber
        )
        .then((res: AxiosResponse) => {
          setIsOpen(true);

          setBetHistory(
            res.data.data
          );
        });
    }
  };

  const getBets = (
    e: MouseEvent<HTMLTableCellElement>,
    stmt: AccoutStatement
  ) => {
    e.preventDefault();

    setSelectedStmt(stmt);

    setIsOpen(true);
  };

  // ==========================================
  // NUMBER FORMAT
  // ==========================================

  const formatAmount = (value: any) => {
    const number = Number(value || 0);

    return number.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // ==========================================
  // TABLE ROWS
  // ==========================================

  const getAcHtml = () => {
    return currentItems.map(
      (stmt: any, index: number) => {
        const isCredit =
          Number(stmt.credit) >= 0;

        return (
          <tr
            key={`${stmt._id}${index}`}
            className="premium-statement-row"
          >
            {/* SR NO */}

            <td>
              <span className="statement-sr">
                {stmt.sr_no}
              </span>
            </td>

            {/* DATE */}

            <td className="wnwrap">
              <div className="statement-date">
                <i className="far fa-calendar-alt" />

                <span>
                  {stmt.date}
                </span>
              </div>
            </td>

            {/* CREDIT */}

            <td>
              {isCredit ? (
                <span className="statement-money statement-credit">
                  +{formatAmount(stmt.credit)}
                </span>
              ) : (
                <span className="statement-empty">
                  —
                </span>
              )}
            </td>

            {/* DEBIT */}

            <td>
              {!isCredit ? (
                <span className="statement-money statement-debit">
                  {formatAmount(stmt.credit)}
                </span>
              ) : (
                <span className="statement-empty">
                  —
                </span>
              )}
            </td>

            {/* BALANCE */}

            <td>
              <span className="statement-balance">
                {formatAmount(stmt.closing)}
              </span>
            </td>

            {/* FROM */}

            <td>
              <span className="statement-from">
                <i className="far fa-user" />

                {stmt.stmt.txnBy || "—"}
              </span>
            </td>

            {/* REMARK */}

            <td
              onClick={(e) =>
                getBets(e, stmt.stmt)
              }
              className={
                stmt.type === "pnl"
                  ? "statement-remark-clickable"
                  : ""
              }
            >
              {stmt.type === "pnl" ? (
                <span className="statement-pnl-button">
                  {stmt.narration}

                  <i className="fas fa-chevron-right" />
                </span>
              ) : (
                <span className="statement-remark">
                  {stmt.narration || "—"}
                </span>
              )}
            </td>
          </tr>
        );
      }
    );
  };

  return (
    <>
      <style>
        {`

        /* ======================================
           PAGE
        ====================================== */

        .premium-statement-page {
          padding: 15px;
        }


        /* ======================================
           FILTER CARD
        ====================================== */

        .statement-filter-card {
          background: #ffffff;

          border: 1px solid #e1e7ed;

          border-radius: 13px;

          margin-bottom: 15px;

          box-shadow:
            0 3px 12px rgba(13,38,65,.06);

          overflow: hidden;
        }

        .statement-filter-header {
          min-height: 50px;

          padding: 10px 15px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          background:
            linear-gradient(
              135deg,
              #031d38,
              #052a51,
              #084a78
            );

          color: #ffffff;
        }

        .statement-filter-title {
          display: flex;
          align-items: center;

          gap: 9px;

          font-size: 14px;
          font-weight: 700;
        }

        .statement-filter-title-icon {
          width: 31px;
          height: 31px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background:
            rgba(255,255,255,.12);
        }

        .statement-filter-user {
          font-size: 11px;

          color:
            rgba(255,255,255,.72);
        }

        .statement-filter-body {
          padding: 15px;
        }

        .statement-filter-row {
          display: flex;
          align-items: flex-end;

          gap: 10px;

          flex-wrap: wrap;
        }

        .statement-filter-group {
          width: 230px;
        }

        .statement-filter-group label {
          display: block;

          margin-bottom: 6px;

          color: #475565;

          font-size: 11px;
          font-weight: 700;
        }

        .statement-select {
          width: 100%;
          height: 40px;

          padding: 0 35px 0 12px;

          border: 1px solid #d6dde4;

          border-radius: 8px;

          background: #ffffff;

          color: #263646;

          font-size: 12px;
          font-weight: 600;

          outline: none;

          cursor: pointer;
        }

        .statement-select:focus {
          border-color: #0a568a;

          box-shadow:
            0 0 0 3px
            rgba(5,74,120,.08);
        }

        .statement-submit {
          height: 40px;

          min-width: 105px;

          padding: 0 18px;

          border: 0;

          border-radius: 8px;

          background:
            linear-gradient(
              135deg,
              #052a51,
              #096197
            );

          color: #ffffff;

          font-size: 12px;
          font-weight: 700;

          box-shadow:
            0 4px 10px
            rgba(5,42,81,.20);

          cursor: pointer;

          transition: .2s;
        }

        .statement-submit:hover {
          transform:
            translateY(-1px);
        }


        /* ======================================
           TABLE CARD
        ====================================== */

        .statement-table-card {
          background: #ffffff;

          border:
            1px solid #e1e7ed;

          border-radius: 13px;

          box-shadow:
            0 4px 15px
            rgba(13,38,65,.06);

          overflow: hidden;
        }

        .statement-table-header {
          min-height: 52px;

          padding: 10px 15px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;

          border-bottom:
            1px solid #e6ebef;

          background: #ffffff;
        }

        .statement-table-title {
          display: flex;
          align-items: center;

          gap: 9px;

          color: #172b3d;

          font-size: 14px;
          font-weight: 800;
        }

        .statement-table-title-icon {
          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background: #eaf2f8;

          color: #075182;
        }

        .statement-opening-balance {
          display: flex;
          align-items: center;

          gap: 7px;

          padding: 7px 11px;

          border-radius: 8px;

          background: #f2f5f7;

          color: #697581;

          font-size: 10px;
          font-weight: 600;
        }

        .statement-opening-balance strong {
          color: #052a51;

          font-size: 12px;
          font-weight: 800;
        }


        /* ======================================
           TABLE
        ====================================== */

        .statement-table-scroll {
          width: 100%;

          overflow-x: auto;

          -webkit-overflow-scrolling:
            touch;
        }

        .premium-statement-table {
          width: 100%;

          min-width: 850px;

          margin: 0;

          border-collapse:
            collapse;

          background: #ffffff;
        }

        .premium-statement-table thead {
          background:
            linear-gradient(
              180deg,
              #f3f6f8,
              #edf1f4
            );
        }

        .premium-statement-table th {
          padding: 11px 12px;

          border-bottom:
            1px solid #dce3e8;

          color: #586573;

          font-size: 10px;
          font-weight: 800;

          text-align: center;

          text-transform:
            uppercase;

          letter-spacing: .3px;

          white-space: nowrap;
        }

        .premium-statement-table td {
          padding: 10px 12px;

          border-bottom:
            1px solid #edf0f2;

          color: #364655;

          font-size: 11px;

          text-align: center;

          vertical-align: middle;
        }

        .premium-statement-row {
          transition:
            background .15s ease;
        }

        .premium-statement-row:hover {
          background: #f8fafb;
        }

        .premium-statement-row:last-child td {
          border-bottom: 0;
        }


        /* ======================================
           SR
        ====================================== */

        .statement-sr {
          min-width: 28px;
          height: 28px;

          padding: 0 7px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          background: #edf2f6;

          border-radius: 7px;

          color: #435363;

          font-size: 10px;
          font-weight: 800;
        }


        /* ======================================
           DATE
        ====================================== */

        .statement-date {
          display: inline-flex;
          align-items: center;

          gap: 6px;

          white-space: nowrap;

          color: #526170;

          font-size: 11px;
        }

        .statement-date i {
          color: #8794a0;
        }


        /* ======================================
           MONEY
        ====================================== */

        .statement-money {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-width: 90px;

          padding: 6px 9px;

          border-radius: 7px;

          font-size: 11px;
          font-weight: 800;

          white-space: nowrap;
        }

        .statement-credit {
          background: #e8f8f1;

          color: #07865f;
        }

        .statement-debit {
          background: #fff0f1;

          color: #d74350;
        }

        .statement-empty {
          color: #b6bec6;
        }


        /* ======================================
           BALANCE
        ====================================== */

        .statement-balance {
          display: inline-block;

          padding: 6px 10px;

          border-radius: 7px;

          background: #eaf2f8;

          color: #075182;

          font-size: 11px;
          font-weight: 800;

          white-space: nowrap;
        }


        /* ======================================
           FROM
        ====================================== */

        .statement-from {
          display: inline-flex;
          align-items: center;

          gap: 5px;

          color: #53616e;

          font-size: 11px;
          font-weight: 600;

          white-space: nowrap;
        }

        .statement-from i {
          color: #8995a0;
        }


        /* ======================================
           REMARK
        ====================================== */

        .statement-remark {
          color: #566472;

          font-size: 11px;
        }

        .statement-remark-clickable {
          cursor: pointer;
        }

        .statement-pnl-button {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;

          max-width: 300px;

          padding: 7px 10px;

          border-radius: 7px;

          background: #eef3f7;

          color: #075182;

          font-size: 10px;
          font-weight: 700;

          transition: .15s;
        }

        .statement-pnl-button:hover {
          background: #dfeaf2;
        }

        .statement-pnl-button i {
          font-size: 8px;
        }


        /* ======================================
           EMPTY
        ====================================== */

        .statement-empty-state {
          padding: 50px 15px !important;

          text-align: center !important;
        }

        .statement-empty-icon {
          width: 48px;
          height: 48px;

          margin: 0 auto 10px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #edf2f6;

          color: #8a96a1;

          font-size: 18px;
        }

        .statement-empty-state strong {
          display: block;

          color: #4a5866;

          font-size: 12px;
        }

        .statement-empty-state span {
          display: block;

          margin-top: 3px;

          color: #9aa3ac;

          font-size: 10px;
        }


        /* ======================================
           PAGINATION
        ====================================== */

        .statement-pagination-area {
          padding: 14px 15px;

          display: flex;
          align-items: center;
          justify-content: flex-end;

          border-top:
            1px solid #edf0f2;

          background: #ffffff;
        }

        .statement-pagination-area .pagination {
          margin: 0;

          display: flex;

          gap: 5px;

          padding: 0;

          list-style: none;
        }

        .statement-pagination-area .pagination li a {
          min-width: 32px;
          height: 32px;

          padding: 0 9px;

          display: flex;
          align-items: center;
          justify-content: center;

          border:
            1px solid #dce2e7;

          border-radius: 7px;

          background: #ffffff;

          color: #4d5c69;

          font-size: 10px;
          font-weight: 700;

          cursor: pointer;

          text-decoration: none;

          transition: .15s;
        }

        .statement-pagination-area .pagination li a:hover {
          border-color: #0a568a;

          color: #075182;
        }

        .statement-pagination-area .pagination li.active a {
          border-color: #052a51;

          background:
            linear-gradient(
              135deg,
              #052a51,
              #096197
            );

          color: #ffffff;
        }

        .statement-pagination-area .pagination li.disabled a {
          opacity: .45;

          cursor: default;
        }


        /* ======================================
           BET MODAL
        ====================================== */

        .statement-bet-overlay {
          position: fixed;
          inset: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 15px;

          background:
            rgba(4,14,28,.75);

          backdrop-filter: blur(5px);

          z-index: 99999;
        }

        .statement-bet-modal {
          width: 100%;
          max-width: 1100px;

          max-height: 90vh;

          outline: none;
        }

        .statement-bet-card {
          width: 100%;

          max-height: 90vh;

          display: flex;
          flex-direction: column;

          border-radius: 14px;

          overflow: hidden;

          background: #ffffff;

          box-shadow:
            0 25px 70px
            rgba(0,0,0,.32);
        }

        .statement-bet-header {
          min-height: 58px;

          padding: 12px 16px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          background:
            linear-gradient(
              135deg,
              #031d38,
              #052a51,
              #084a78
            );

          color: white;
        }

        .statement-bet-title {
          display: flex;
          align-items: center;

          gap: 9px;

          font-size: 14px;
          font-weight: 700;
        }

        .statement-bet-close {
          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;

          border-radius: 8px;

          background:
            rgba(255,255,255,.11);

          color: white;

          cursor: pointer;
        }

        .statement-bet-close:hover {
          background:
            rgba(255,255,255,.20);
        }

        .statement-bet-body {
          padding: 15px;

          overflow: auto;

          background: #f5f7fa;
        }


        /* ======================================
           MOBILE
        ====================================== */

        @media (max-width: 767px) {

          .premium-statement-page {
            padding: 8px;
          }

          .statement-filter-header {
            min-height: 46px;

            padding: 9px 11px;
          }

          .statement-filter-body {
            padding: 11px;
          }

          .statement-filter-row {
            display: grid;

            grid-template-columns:
              1fr 90px;

            gap: 8px;
          }

          .statement-filter-group {
            width: auto;
          }

          .statement-submit {
            width: 100%;

            min-width: 0;
          }

          .statement-table-header {
            padding: 9px 11px;
          }

          .statement-table-title {
            font-size: 12px;
          }

          .statement-opening-balance {
            padding: 6px 8px;
          }

          .statement-opening-balance span {
            display: none;
          }

          .premium-statement-table th {
            padding: 9px 8px;

            font-size: 9px;
          }

          .premium-statement-table td {
            padding: 8px;

            font-size: 10px;
          }

          .statement-pagination-area {
            padding: 10px;

            justify-content: center;
          }

          .statement-pagination-area .pagination {
            flex-wrap: wrap;

            justify-content: center;
          }

          .statement-pagination-area .pagination li a {
            min-width: 29px;
            height: 29px;

            font-size: 9px;
          }

          .statement-bet-overlay {
            padding: 8px;
          }

          .statement-bet-modal {
            max-height: 95vh;
          }

          .statement-bet-card {
            max-height: 95vh;

            border-radius: 11px;
          }

        }

        `}
      </style>

      {mobileSubheader.subheaderdesktopadmin(
        "Account Statements"
      )}

      <div className="container-fluid premium-statement-page">

        {/* =====================================
            FILTER
        ===================================== */}

        <div className="statement-filter-card">

          <div className="statement-filter-header">

            <div className="statement-filter-title">

              <div className="statement-filter-title-icon">
                <i className="fas fa-filter" />
              </div>

              <span>
                Account Statement
              </span>

            </div>

            {filterdata.userId && (
              <div className="statement-filter-user">
                <i className="far fa-user" />
                &nbsp;
                {filterdata.userId}
              </div>
            )}

          </div>

          <div className="statement-filter-body">

            <form onSubmit={handleSubmitform}>

              <div className="statement-filter-row">

                <div className="statement-filter-group">

                  <label htmlFor="reportType">
                    Report Type
                  </label>

                  <select
                    id="reportType"
                    name="reportType"
                    value={filterdata.reportType}
                    onChange={handleformchange}
                    className="statement-select"
                  >
                    <option value="ALL">
                      All Transactions
                    </option>

                    <option value="chip">
                      Deposit / Withdraw
                    </option>

                    <option value="game">
                      Game Report
                    </option>

                  </select>

                </div>

                <button
                  type="submit"
                  className="statement-submit"
                >
                  <i className="fas fa-search" />
                  &nbsp;&nbsp;
                  Submit
                </button>

              </div>

            </form>

          </div>

        </div>


        {/* =====================================
            TABLE CARD
        ===================================== */}

        <div className="statement-table-card">

          <div className="statement-table-header">

            <div className="statement-table-title">

              <div className="statement-table-title-icon">
                <i className="fas fa-list-alt" />
              </div>

              Transaction History

            </div>

            <div className="statement-opening-balance">

              <span>
                Opening Balance
              </span>

              <strong>
                {formatAmount(openBalance)}
              </strong>

            </div>

          </div>


          {/* TABLE */}

          <div className="statement-table-scroll">

            <table className="premium-statement-table">

              <thead>

                <tr>

                  <th>
                    Sr No.
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Credit
                  </th>

                  <th>
                    Debit
                  </th>

                  <th>
                    Balance
                  </th>

                  <th>
                    From
                  </th>

                  <th>
                    Remark
                  </th>

                </tr>

              </thead>

              <tbody>

                {currentItems.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="statement-empty-state"
                    >

                      <div className="statement-empty-icon">
                        <i className="fas fa-receipt" />
                      </div>

                      <strong>
                        No Result Found
                      </strong>

                      <span>
                        No transactions available for this filter.
                      </span>

                    </td>

                  </tr>

                ) : (
                  getAcHtml()
                )}

              </tbody>

            </table>

          </div>


          {/* =====================================
              PAGINATION
          ===================================== */}

          {pageCount > 0 && (

            <div className="statement-pagination-area">

              <ReactPaginate
                breakLabel="..."
                nextLabel="Next"
                previousLabel="Prev"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                containerClassName="pagination"
                activeClassName="active"
                forcePage={Math.max(page - 1, 0)}
              />

            </div>

          )}

        </div>

      </div>


      {/* =====================================
          BET DETAILS MODAL
      ===================================== */}

      <ReactModal
        isOpen={isOpen}
        onRequestClose={() =>
          setIsOpen(false)
        }
        className="statement-bet-modal"
        overlayClassName="statement-bet-overlay"
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
      >

        <div className="statement-bet-card">

          <div className="statement-bet-header">

            <div className="statement-bet-title">

              <i className="fas fa-history" />

              Bet Details

            </div>

            <button
              type="button"
              onClick={() =>
                setIsOpen(false)
              }
              className="statement-bet-close"
            >
              <i className="fa fa-times" />
            </button>

          </div>

          <div className="statement-bet-body">

            {!loadingState && (

              <BetListComponent
                bethistory={betHistory}
                handlePageClick={
                  handlePageClickBets
                }
                page={page}
                isTrash={false}
              />

            )}

          </div>

        </div>

      </ReactModal>

    </>
  );
};

export default AccountStatementAdmin;