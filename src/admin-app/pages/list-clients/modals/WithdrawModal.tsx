import React from "react";
import Modal from "react-modal";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserService from "../../../../services/user.service";
import { AxiosResponse } from "axios";
import SubmitButton from "../../../../components/SubmitButton";

const WithdrawModal = (props: any) => {
  const withdrawValidationSchema = Yup.object().shape({
    narration: Yup.string().trim(),

    amount: Yup.number()
      .required("Amount is required")
      .transform((value) => (isNaN(value) ? 0 : +value))
      .min(1, "Amount is required")
      .max(
        props.userDetails?.balance?.balance,
        `Max ${props.userDetails?.balance?.balance} limit`
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<{
    amount: string;
    narration: string;
    transactionPassword: string;
  }>({
    resolver: yupResolver(withdrawValidationSchema),
    defaultValues: {
      transactionPassword: "123456",
    },
  });

  React.useEffect(() => {
    setValue("transactionPassword", "123456");
  }, [setValue]);

  const amount = Number(watch("amount") || 0);

  const parentBalance = Number(
    props.userDetails?.parentBalance?.balance || 0
  );

  const userBalance = Number(
    props.userDetails?.balance?.balance || 0
  );

  const parentAfterBalance = parentBalance + amount;
  const userAfterBalance = userBalance - amount;

  const closeWithdrawModal = () => {
    props.closeModal("w");
    reset();
  };

  const onSubmit = handleSubmit((data) => {
    const formData = {
      ...data,

      userId: props.userDetails?._id,

      parentUserId:
        props.userDetails?.role === "admin"
          ? props.userDetails?._id
          : props.userDetails?.parentId,

      balanceUpdateType: "W",
    };

    UserService.updateDepositBalance(formData).then(
      (res: AxiosResponse) => {
        props.closeModal("w", res.data.data);

        toast.success("Balance Withdrawal Successfully");

        reset();
      }
    );
  });

  return (
    <>
      <style>
        {`

        /* ================================
           MODAL OVERLAY
        ================================= */

        .withdraw-premium-overlay {
          position: fixed;
          inset: 0;

          background: rgba(4, 14, 28, 0.72);

          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 15px;

          z-index: 99999;
        }


        /* ================================
           MAIN MODAL
        ================================= */

        .withdraw-premium-modal {
          width: 100%;
          max-width: 520px;

          outline: none;
        }

        .withdraw-premium-card {
          width: 100%;

          background: #ffffff;

          border-radius: 16px;

          overflow: hidden;

          box-shadow:
            0 25px 70px rgba(0,0,0,0.30),
            0 5px 20px rgba(0,0,0,0.12);

          animation: withdrawModalAnimation .18s ease-out;
        }

        @keyframes withdrawModalAnimation {
          from {
            opacity: 0;
            transform: translateY(12px) scale(.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }


        /* ================================
           HEADER
        ================================= */

        .withdraw-premium-header {
          min-height: 75px;

          padding: 16px 20px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          background:
            linear-gradient(
              135deg,
              #031d38 0%,
              #052a51 48%,
              #084a78 100%
            );

          color: #ffffff;
        }

        .withdraw-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .withdraw-header-icon {
          width: 43px;
          height: 43px;

          border-radius: 11px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: rgba(255,255,255,.12);

          border: 1px solid rgba(255,255,255,.12);

          font-size: 18px;
        }

        .withdraw-header-text h4 {
          padding: 0;
          margin: 0;

          color: white;

          font-size: 18px;
          font-weight: 700;
        }

        .withdraw-header-text span {
          display: block;

          margin-top: 3px;

          font-size: 11px;

          color: rgba(255,255,255,.68);
        }

        .withdraw-header-close {
          width: 35px;
          height: 35px;

          border: 0;
          outline: none;

          border-radius: 9px;

          background: rgba(255,255,255,.10);

          color: #ffffff;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 23px;

          cursor: pointer;

          transition: .2s ease;
        }

        .withdraw-header-close:hover {
          background: rgba(255,255,255,.20);
        }


        /* ================================
           BODY
        ================================= */

        .withdraw-premium-body {
          padding: 20px;

          background: #f5f7fa;
        }


        /* ================================
           BALANCE AREA
        ================================= */

        .withdraw-balance-wrapper {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 12px;

          margin-bottom: 20px;
        }

        .withdraw-balance-card {
          position: relative;

          padding: 15px;

          background: #ffffff;

          border: 1px solid #e1e7ed;

          border-radius: 12px;

          overflow: hidden;

          box-shadow: 0 4px 12px rgba(12, 35, 60, .05);
        }

        .withdraw-balance-card.parent {
          border-top: 3px solid #10a37f;
        }

        .withdraw-balance-card.user {
          border-top: 3px solid #e84c5b;
        }

        .withdraw-balance-type {
          margin-bottom: 5px;

          color: #88939f;

          font-size: 10px;
          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: .5px;
        }

        .withdraw-username {
          color: #1a2938;

          font-size: 13px;
          font-weight: 700;

          overflow: hidden;

          white-space: nowrap;

          text-overflow: ellipsis;
        }

        .withdraw-main-balance {
          margin-top: 8px;

          color: #052a51;

          font-size: 21px;
          font-weight: 800;
        }

        .withdraw-balance-divider {
          margin: 10px 0 8px;

          border-top: 1px dashed #d8dfe6;
        }

        .withdraw-after-row {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 5px;

          color: #8a949f;

          font-size: 10px;
        }

        .withdraw-after-row strong {
          color: #344454;

          font-size: 12px;
          font-weight: 700;
        }

        .withdraw-after-row strong.parent {
          color: #079471;
        }

        .withdraw-after-row strong.user {
          color: #d53d4c;
        }


        /* ================================
           FORM
        ================================= */

        .withdraw-field {
          margin-bottom: 16px;
        }

        .withdraw-field:last-child {
          margin-bottom: 0;
        }

        .withdraw-field-label {
          display: flex;

          align-items: center;
          justify-content: space-between;

          margin-bottom: 7px;

          color: #3d4b59;

          font-size: 12px;
          font-weight: 700;
        }

        .withdraw-field-label span {
          color: #98a1aa;

          font-size: 10px;
          font-weight: 500;
        }


        /* ================================
           AMOUNT INPUT
        ================================= */

        .withdraw-amount-container {
          position: relative;
        }

        .withdraw-currency {
          position: absolute;

          left: 15px;
          top: 50%;

          transform: translateY(-50%);

          color: #052a51;

          font-size: 20px;
          font-weight: 800;

          pointer-events: none;
        }

        .withdraw-amount-input {
          width: 100%;
          height: 52px;

          padding: 0 15px 0 42px;

          background: #ffffff;

          border: 1px solid #d6dde4;

          border-radius: 10px;

          outline: none;

          color: #132435;

          font-size: 20px;
          font-weight: 800;

          transition: all .2s ease;
        }

        .withdraw-amount-input::placeholder {
          color: #b5bdc5;
        }

        .withdraw-amount-input:focus {
          border-color: #0a568a;

          box-shadow:
            0 0 0 3px rgba(5, 74, 120, .09);
        }


        /* REMOVE NUMBER ARROWS */

        .withdraw-amount-input::-webkit-outer-spin-button,
        .withdraw-amount-input::-webkit-inner-spin-button {
          -webkit-appearance: none;

          margin: 0;
        }

        .withdraw-amount-input[type=number] {
          -moz-appearance: textfield;
        }


        /* ================================
           REMARK
        ================================= */

        .withdraw-remark-input {
          width: 100%;

          min-height: 85px;

          padding: 12px 14px;

          resize: vertical;

          background: #ffffff;

          border: 1px solid #d6dde4;

          border-radius: 10px;

          outline: none;

          color: #263646;

          font-size: 13px;

          transition: all .2s ease;
        }

        .withdraw-remark-input::placeholder {
          color: #a6afb8;
        }

        .withdraw-remark-input:focus {
          border-color: #0a568a;

          box-shadow:
            0 0 0 3px rgba(5, 74, 120, .09);
        }


        /* ================================
           ERROR
        ================================= */

        .withdraw-error {
          display: block;

          margin-top: 5px;

          color: #dc3545;

          font-size: 11px;
          font-weight: 600;
        }


        /* ================================
           FOOTER
        ================================= */

        .withdraw-premium-footer {
          padding: 14px 20px;

          display: flex;

          align-items: center;
          justify-content: flex-end;

          gap: 10px;

          background: #ffffff;

          border-top: 1px solid #e4e9ee;
        }

        .withdraw-back-button {
          height: 42px;

          min-width: 100px;

          padding: 0 18px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 7px;

          background: #f1f3f5;

          border: 1px solid #d8dee4;

          border-radius: 9px;

          color: #465564;

          font-size: 12px;
          font-weight: 700;

          cursor: pointer;

          transition: .2s ease;
        }

        .withdraw-back-button:hover {
          background: #e7eaed;
        }

        .withdraw-submit-button {
          height: 42px !important;

          min-width: 135px;

          padding: 0 20px !important;

          display: inline-flex !important;

          align-items: center !important;
          justify-content: center !important;

          gap: 8px;

          border: 0 !important;

          border-radius: 9px !important;

          background:
            linear-gradient(
              135deg,
              #052a51,
              #096197
            ) !important;

          color: #ffffff !important;

          font-size: 12px !important;
          font-weight: 700 !important;

          box-shadow:
            0 5px 14px rgba(5, 42, 81, .22);

          transition: .2s ease !important;
        }

        .withdraw-submit-button:hover {
          transform: translateY(-1px);

          box-shadow:
            0 7px 18px rgba(5, 42, 81, .28);
        }


        /* ================================
           MOBILE
        ================================= */

        @media (max-width: 575px) {

          .withdraw-premium-overlay {
            padding: 10px;
          }

          .withdraw-premium-modal {
            max-width: 100%;
          }

          .withdraw-premium-header {
            min-height: 66px;

            padding: 13px 15px;
          }

          .withdraw-header-icon {
            width: 38px;
            height: 38px;

            border-radius: 9px;
          }

          .withdraw-header-text h4 {
            font-size: 16px;
          }

          .withdraw-premium-body {
            padding: 14px;
          }

          .withdraw-balance-wrapper {
            gap: 8px;
          }

          .withdraw-balance-card {
            padding: 12px 10px;
          }

          .withdraw-main-balance {
            font-size: 16px;
          }

          .withdraw-username {
            font-size: 11px;
          }

          .withdraw-after-row {
            display: block;
          }

          .withdraw-after-row strong {
            display: block;

            margin-top: 3px;
          }

          .withdraw-premium-footer {
            padding: 12px 14px;
          }

          .withdraw-back-button,
          .withdraw-submit-button {
            flex: 1;

            min-width: 0;
          }

        }

        `}
      </style>

      <Modal
        isOpen={props.showDialog}
        onRequestClose={closeWithdrawModal}
        contentLabel="Withdraw"
        className="withdraw-premium-modal"
        overlayClassName="withdraw-premium-overlay"
        shouldCloseOnOverlayClick={true}
      >
        <div className="withdraw-premium-card">

          {/* HEADER */}

          <div className="withdraw-premium-header">

            <div className="withdraw-header-left">

              <div className="withdraw-header-icon">
                <i className="fas fa-wallet" />
              </div>

              <div className="withdraw-header-text">
                <h4>Withdraw Chips</h4>

                <span>
                  Transfer balance from user account
                </span>
              </div>

            </div>

            <button
              type="button"
              className="withdraw-header-close"
              onClick={closeWithdrawModal}
            >
              ×
            </button>

          </div>


          <form
            id="WithdrawForm"
            method="post"
            autoComplete="off"
            onSubmit={onSubmit}
          >

            <div className="withdraw-premium-body">

              {/* BALANCE CARDS */}

              <div className="withdraw-balance-wrapper">

                {/* PARENT */}

                <div className="withdraw-balance-card parent">

                  <div className="withdraw-balance-type">
                    Parent Account
                  </div>

                  <div className="withdraw-username">
                    {props.userDetails?.parent?.username || "Parent"}
                  </div>

                  <div className="withdraw-main-balance">
                    ₹ {parentBalance.toFixed(2)}
                  </div>

                  <div className="withdraw-balance-divider" />

                  <div className="withdraw-after-row">

                    <span>After Withdraw</span>

                    <strong className="parent">
                      ₹ {parentAfterBalance.toFixed(2)}
                    </strong>

                  </div>

                </div>


                {/* USER */}

                <div className="withdraw-balance-card user">

                  <div className="withdraw-balance-type">
                    User Account
                  </div>

                  <div className="withdraw-username">
                    {props.userDetails?.username || "User"}
                  </div>

                  <div className="withdraw-main-balance">
                    ₹ {userBalance.toFixed(2)}
                  </div>

                  <div className="withdraw-balance-divider" />

                  <div className="withdraw-after-row">

                    <span>After Withdraw</span>

                    <strong className="user">
                      ₹ {userAfterBalance.toFixed(2)}
                    </strong>

                  </div>

                </div>

              </div>


              {/* AMOUNT */}

              <div className="withdraw-field">

                <div className="withdraw-field-label">

                  <label htmlFor="withdraw-amount">
                    Withdraw Amount
                  </label>

                  <span>
                    Available: ₹ {userBalance.toFixed(2)}
                  </span>

                </div>

                <div className="withdraw-amount-container">

                  <span className="withdraw-currency">
                    ₹
                  </span>

                  <input
                    type="number"
                    id="withdraw-amount"
                    className="withdraw-amount-input"
                    placeholder="0.00"
                    {...register("amount")}
                    min={0}
                    step="0.01"
                  />

                </div>

                {errors?.amount && (
                  <span className="withdraw-error">
                    {errors.amount.message}
                  </span>
                )}

              </div>


              {/* REMARK */}

              <div className="withdraw-field">

                <div className="withdraw-field-label">
                  <label htmlFor="withdraw-remark">
                    Remark
                  </label>

                  <span>Optional</span>
                </div>

                <textarea
                  id="withdraw-remark"
                  className="withdraw-remark-input"
                  placeholder="Enter withdrawal remark..."
                  {...register("narration")}
                />

                {errors?.narration && (
                  <span className="withdraw-error">
                    {errors.narration.message}
                  </span>
                )}

              </div>

            </div>


            {/* FOOTER */}

            <div className="withdraw-premium-footer">

              <input
                type="hidden"
                name="uid"
                id="withdraw-uid"
              />

              <button
                type="button"
                className="withdraw-back-button"
                onClick={closeWithdrawModal}
              >
                <i className="fas fa-arrow-left" />

                Back
              </button>


              <SubmitButton
                type="submit"
                className="withdraw-submit-button"
              >
                Withdraw

                <i className="fas fa-arrow-right" />
              </SubmitButton>

            </div>

          </form>

        </div>
      </Modal>
    </>
  );
};

export default WithdrawModal;