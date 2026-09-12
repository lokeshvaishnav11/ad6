// import moment from 'moment'
// import ReactPaginate from 'react-paginate'
// import IBet from '../../../models/IBet'
// import User, { RoleType } from '../../../models/User'
// import { selectUserData } from '../../../redux/actions/login/loginSlice'
// import { useAppSelector } from '../../../redux/hooks'
// import { CONSTANTS } from '../../../utils/constants'
// import { betDateFormat } from '../../../utils/helper'

// interface BetListProps {
//   bethistory: any
//   page: number
//   onTrash?: (e: any, bet: IBet) => void
//   handlePageClick: (event: any) => void
//   isTrash?: boolean
//   handleSelectAll?: () => void
//   selectAll?: boolean
//   handleSelectItem?: (bet: IBet) => void
// }

// const getsportsname = (sportsId: any) => {
//   return sportsId != ''
//     ? CONSTANTS.SPORT_NAME.filter((Item: any) => Item.id == sportsId)[0]?.name || 'Casino'
//     : ''
// }
// const BetListComponent = ({
//   bethistory,
//   onTrash,
//   handlePageClick,
//   isTrash,
//   handleSelectAll,
//   selectAll,
//   handleSelectItem,
// }: BetListProps) => {
//   const userState = useAppSelector<{ user: User }>(selectUserData)

//   const trrepeat = (Item: IBet, index: number) => {
//     const classdata = Item.isBack ? 'back' : 'lay'
//     return (
//       <tr key={index} className={classdata}>
//         {handleSelectAll && (
//           <td>
//             <input
//               type={'checkbox'}
//               checked={Item.selected || false}
//               onChange={() => handleSelectItem?.(Item)}
//             />
//           </td>
//         )}
//         {userState?.user?.role !== RoleType.user && (
//           <td className='text-center wnwrap'>{Item.parentNameStr}</td>
//         )}
//         <td className='text-center wnwrap'>{Item.userName}</td>
//         <td className='text-center wnwrap'>{Item.matchName}</td>
//         <td className='text-center wnwrap'>
//           {Item.selectionName} /{' '}
//           {Item.marketName === 'Fancy' && Item.gtype !== 'fancy1' ? Item.volume : Item.odds}{' '}
//         </td>
//         <td className='text-center wnwrap'>{getsportsname(Item.sportId)}</td>
//         <td className='text-center wnwrap'>{Item.marketName}</td>
//         <td className='text-center wnwrap'>{Item.odds}</td>
//         <td className='text-center wnwrap'>{Item.stack}</td>
//         <td className='text-center wnwrap'>{Item.status=='completed'?Item?.profitLoss?.toFixed(2):Item.pnl?.toFixed(2)}</td>
//         <td className='text-center wnwrap'>
//           {Item.createdAt &&
//             moment.utc(Item?.betClickTime).format(
//               betDateFormat
//             )}
//         </td>
//         {isTrash && (
//           <td className='text-center wnwrap'>
//             {Item.status == 'pending' && userState?.user?.role === RoleType.admin && (
//               <a onClick={(e) => onTrash && onTrash(e, Item)} href='#'>
//                 <i className='fa fa-trash' />
//               </a>
//             )}
//           </td>
//         )}
//       </tr>
//     )
//   }

//   const TransactionData =
//     bethistory && bethistory.docs && bethistory.docs.length ? (
//       bethistory.docs.map((item: IBet, index: number) => {
//         return trrepeat(item, index)
//       })
//     ) : (
//       <tr>
//         <td colSpan={11} style={{ textAlign: 'center' }}>
//           No Result Found
//         </td>
//       </tr>
//     )

//   return (
//     <>
//       <div className='table-responsive'>
//         <table id='customers1'>
//           <thead>
//             <tr>
//               {handleSelectAll && (
//                 <th className='text-center bg2 text-white '>
//                   <input
//                     type={'checkbox'}
//                     checked={selectAll || false}
//                     onChange={handleSelectAll}
//                   />
//                 </th>
//               )}
//               {userState?.user?.role !== RoleType.user && (
//                 <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
//                   Parent 
//                 </th>
//               )}
//               <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
//                 User Name
//               </th>
//               <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
//                 Event Name
//               </th>
//               <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
//                 Nation
//               </th>
//               <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
//                 Game Name
//               </th>
//               <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
//                 Bet On
//               </th>
//               <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
//                 Rate{' '}
//               </th>
//               <th className='text-center bg2 text-white '>Amount</th>
//               <th className='text-center bg2 text-white '>P/L</th>
//               <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
//                 Place Date
//               </th>
//               {isTrash && (
//                 <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
//                   Action
//                 </th>
//               )}
//             </tr>
//           </thead>
//           <tbody>{TransactionData}</tbody>
//         </table>
//       </div>
//       <ReactPaginate
//         breakLabel='...'
//         nextLabel='>>'
//         onPageChange={handlePageClick}
//         pageRangeDisplayed={5}
//         pageCount={bethistory.totalPages || 0}
//         containerClassName={'pagination'}
//         activeClassName={'active'}
//         previousLabel={'<<'}
//         breakClassName={'break-me'}
//       />
//     </>
//   )
// }

// export default BetListComponent

import moment from "moment";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import IBet from "../../../models/IBet";
import User, { RoleType } from "../../../models/User";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { useAppSelector } from "../../../redux/hooks";
import { CONSTANTS } from "../../../utils/constants";
import { betDateFormat } from "../../../utils/helper";
import ReactModal from "react-modal";
import betService from "../../../services/bet.service";
import "./bet-list-modern.css";

interface BetListProps {
  bethistory: any;
  page: number;
  onTrash?: (e: any, bet: IBet) => void;
  handlePageClick: (event: any) => void;
  isTrash?: boolean;
  handleSelectAll?: () => void;
  selectAll?: boolean;
  handleSelectItem?: (bet: IBet) => void;
}

const getsportsname = (sportsId: any) => {
  return sportsId != ""
    ? CONSTANTS.SPORT_NAME.filter(
        (Item: any) => Item.id == sportsId
      )[0]?.name || "Casino"
    : "";
};

const BetListComponent = ({
  bethistory,
  onTrash,
  handlePageClick,
  isTrash,
  handleSelectAll,
  selectAll,
  handleSelectItem,
}: BetListProps) => {
  const userState =
    useAppSelector<{ user: User }>(selectUserData);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedBet, setSelectedBet] =
    useState<IBet | null>(null);

  const [isBack, setIsBack] =
    useState(true);

  const [odds, setOdds] =
    useState("");

  const [isUpdating, setIsUpdating] =
    useState(false);

  const openEditModal = (bet: IBet) => {
    setSelectedBet(bet);
    setIsBack(bet.isBack);
    setOdds(
      bet.odds?.toString() || ""
    );
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateBet =
    async () => {
      try {
        if (!selectedBet) return;

        setIsUpdating(true);

        await betService.updateBet({
          betId: selectedBet._id,
          isBack,
          odds: Number(odds),
        });

        setIsModalOpen(false);

        alert(
          "Bet Updated Successfully"
        );
      } catch (err) {
        alert("Error updating bet");
      } finally {
        setIsUpdating(false);
      }
    };

  const trrepeat = (
    Item: IBet,
    index: number
  ) => {
    const classdata =
      Item.isBack
        ? "bl-row-back"
        : "bl-row-lay";

    const profitLoss =
      Item.status === "completed"
        ? Item?.profitLoss?.toFixed(2)
        : Item.pnl?.toFixed(2);

    const isProfit =
      Number(profitLoss) >= 0;

    return (
      <tr
        key={Item._id || index}
        className={`bl-row ${classdata}`}
      >
        {handleSelectAll && (
          <td
            data-label="Select"
            className="bl-check-cell"
          >
            <label className="bl-checkbox-wrap">
              <input
                type="checkbox"
                checked={
                  Item.selected ||
                  false
                }
                onChange={() =>
                  handleSelectItem?.(
                    Item
                  )
                }
              />

              <span className="bl-checkbox-ui" />
            </label>
          </td>
        )}

        {userState?.user?.role !==
          RoleType.user && (
          <td data-label="Parent">
            <span className="bl-parent-text">
              {
                Item.parentNameStr
              }
            </span>
          </td>
        )}

        <td data-label="User Name">
          <div className="bl-user-cell">
            <div className="bl-user-avatar">
              {Item.userName
                ?.charAt(0)
                ?.toUpperCase() ||
                "U"}
            </div>

            <span className="bl-user-name">
              {Item.userName}
            </span>
          </div>
        </td>

        <td data-label="Event Name">
          <div className="bl-event-cell">
            <span className="bl-event-name">
              {Item.matchName}
            </span>

            <span className="bl-event-id">
              Bet #{Item._id}
            </span>
          </div>
        </td>

        <td data-label="Nation">
          <div className="bl-selection-cell">
            <span className="bl-selection-name">
              {Item.selectionName}
            </span>

            <span className="bl-selection-value">
              {Item.marketName ===
                "Fancy" &&
              Item.gtype !==
                "fancy1"
                ? Item.volume
                : Item.odds}
            </span>
          </div>
        </td>

        <td data-label="Game Name">
          <span className="bl-game-pill">
            {getsportsname(
              Item.sportId
            )}
          </span>
        </td>

        <td data-label="Bet On">
          <span
            className={`bl-bet-type ${
              Item.isBack
                ? "bl-back-type"
                : "bl-lay-type"
            }`}
          >
            {
              Item.marketName
            }
          </span>
        </td>

        <td data-label="Rate">
          <span className="bl-rate">
            {Item.odds}
          </span>
        </td>

        <td data-label="Amount">
          <span className="bl-amount">
            ₹{Item.stack}
          </span>
        </td>

        <td data-label="P/L">
          <span
            className={`bl-pl ${
              isProfit
                ? "bl-profit"
                : "bl-loss"
            }`}
          >
            {profitLoss}
          </span>
        </td>

        <td data-label="Place Date">
          <div className="bl-date-cell">
            <span className="bl-date-icon">
              ◷
            </span>

            <span>
              {Item.createdAt &&
                moment
                  .utc(
                    Item.betClickTime
                  )
                  .format(
                    betDateFormat
                  )}
            </span>
          </div>
        </td>

        {isTrash && (
          <td
            data-label="Action"
            className="bl-action-cell"
          >
            {Item.status ===
              "pending" &&
              userState?.user
                ?.role ===
                RoleType.admin && (
                <a
                  href="#"
                  className="bl-delete-btn"
                  onClick={(e) =>
                    onTrash &&
                    onTrash(
                      e,
                      Item
                    )
                  }
                >
                  <span>
                    🗑
                  </span>

                  Delete
                </a>
              )}
          </td>
        )}

        {/* {isTrash && (
          <td
            data-label="Edit"
            className="bl-action-cell"
          >
            {Item.status ===
              "pending" &&
              userState?.user
                ?.role ===
                RoleType.admin && (
                <button
                  type="button"
                  className="bl-edit-btn"
                  onClick={() =>
                    openEditModal(
                      Item
                    )
                  }
                >
                  <span>
                    ✎
                  </span>

                  Edit Bet
                </button>
              )}
          </td>
        )} */}
      </tr>
    );
  };

  const TransactionData =
    bethistory?.docs?.length ? (
      bethistory.docs.map(
        (
          item: IBet,
          index: number
        ) =>
          trrepeat(
            item,
            index
          )
      )
    ) : (
      <tr>
        <td
          colSpan={13}
          className="bl-empty-cell"
        >
          <div className="bl-empty-state">
            <div className="bl-empty-icon">
              ◌
            </div>

            <h3>
              No Bets Found
            </h3>

            <p>
              No bet records are
              available for the
              selected filters.
            </p>
          </div>
        </td>
      </tr>
    );

  return (
    <>
      <div className="bl-table-card">
        <div className="bl-table-topbar">
          <div>
            <h3>
              Bet Transactions
            </h3>

            <p>
              Review bet details,
              amount, rate and P/L.
            </p>
          </div>

          <div className="bl-record-badge">
            {bethistory?.docs
              ?.length || 0}{" "}
            Records
          </div>
        </div>

        <div className="bl-table-responsive">
          <table className="bl-table">
            <thead>
              <tr>
                {handleSelectAll && (
                  <th className="bl-check-head">
                    <label className="bl-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={
                          selectAll ||
                          false
                        }
                        onChange={
                          handleSelectAll
                        }
                      />

                      <span className="bl-checkbox-ui" />
                    </label>
                  </th>
                )}

                {userState?.user
                  ?.role !==
                  RoleType.user && (
                  <th>
                    Parent
                  </th>
                )}

                <th>
                  User
                </th>

                <th>
                  Event
                </th>

                <th>
                  Nation
                </th>

                <th>
                  Game
                </th>

                <th>
                  Market
                </th>

                <th>
                  Rate
                </th>

                <th>
                  Amount
                </th>

                <th>
                  P/L
                </th>

                <th>
                  Place Date
                </th>

                {isTrash && (
                  <th>
                    Delete
                  </th>
                )}

                {isTrash && (
                  <th>
                    Manage
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {TransactionData}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bl-pagination-wrap">
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={
            handlePageClick
          }
          pageRangeDisplayed={
            5
          }
          pageCount={
            bethistory.totalPages ||
            0
          }
          containerClassName="bl-pagination"
          activeClassName="bl-page-active"
          previousLabel="Previous"
          pageClassName="bl-page-item"
          nextClassName="bl-page-nav"
          previousClassName="bl-page-nav"
          breakClassName="bl-page-break"
        />
      </div>

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={
          closeEditModal
        }
        ariaHideApp={false}
        className="bl-modal"
        overlayClassName="bl-modal-overlay"
      >
        <div className="bl-modal-header">
          <div>
            <span className="bl-modal-label">
              Bet Management
            </span>

            <h3>
              Update Bet
            </h3>

            <p>
              Change bet side and
              odds.
            </p>
          </div>

          <button
            type="button"
            className="bl-modal-close"
            onClick={
              closeEditModal
            }
          >
            ×
          </button>
        </div>

        {selectedBet && (
          <div className="bl-selected-summary">
            <div className="bl-summary-icon">
              {selectedBet
                .userName
                ?.charAt(0)
                ?.toUpperCase() ||
                "B"}
            </div>

            <div>
              <strong>
                {
                  selectedBet.matchName
                }
              </strong>

              <span>
                {
                  selectedBet.selectionName
                }
              </span>
            </div>
          </div>
        )}

        <div className="bl-modal-body">
          <div className="bl-modal-field">
            <label>
              Bet Side
            </label>

            <div className="bl-side-selector">
              <button
                type="button"
                className={`bl-side-btn bl-side-back ${
                  isBack
                    ? "bl-side-selected"
                    : ""
                }`}
                onClick={() =>
                  setIsBack(
                    true
                  )
                }
              >
                Back
              </button>

              <button
                type="button"
                className={`bl-side-btn bl-side-lay ${
                  !isBack
                    ? "bl-side-selected"
                    : ""
                }`}
                onClick={() =>
                  setIsBack(
                    false
                  )
                }
              >
                Lay
              </button>
            </div>
          </div>

          <div className="bl-modal-field">
            <label>
              Odds
            </label>

            <div className="bl-odds-input-wrap">
              <span>
                ×
              </span>

              <input
                type="number"
                value={odds}
                onChange={(e) =>
                  setOdds(
                    e.target.value
                  )
                }
                placeholder="Enter odds"
              />
            </div>
          </div>
        </div>

        <div className="bl-modal-footer">
          <button
            type="button"
            className="bl-modal-cancel"
            onClick={
              closeEditModal
            }
          >
            Cancel
          </button>

          <button
            type="button"
            className="bl-modal-update"
            onClick={
              handleUpdateBet
            }
            disabled={
              isUpdating
            }
          >
            {isUpdating
              ? "Updating..."
              : "Update Bet"}
          </button>
        </div>
      </ReactModal>
    </>
  );
};

export default BetListComponent;