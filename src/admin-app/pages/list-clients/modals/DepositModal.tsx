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

const DepositModal = (props: any) => {
  const depositValidationSchema = Yup.object().shape({
    narration: Yup.string(),

    amount:
      props.depositUser?.role === "admin"
        ? Yup.number()
            .required("Amount is required")
            .transform((value) => (isNaN(value) ? 0 : +value))
            .min(1, "Amount is required")
        : Yup.number()
            .required("Amount is required")
            .transform((value) => (isNaN(value) ? 0 : +value))
            .min(1, "Amount is required")
            .max(
              props.depositUser?.parentBalance?.balance,
              `Max ${props.depositUser?.parentBalance?.balance} limit`
            ),
  });

  const [loader, setLoader] = React.useState<boolean>(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<{
    amount: string;
    narration: string;
    transactionPassword: string;
  }>({
    resolver: yupResolver(depositValidationSchema),
    defaultValues: {
      transactionPassword: "123456",
    },
  });

  React.useEffect(() => {
    setValue("transactionPassword", "123456");
  }, [setValue]);

  const amount = Number(watch("amount") || 0);

  const parentBalance = Number(
    props.depositUser?.parentBalance?.balance || 0
  );

  const userBalance = Number(
    props.depositUser?.balance?.balance || 0
  );

  const parentAfterBalance = parentBalance - amount;
  const userAfterBalance = userBalance + amount;

  const closeDepositModal = () => {
    props.closeModal("d");
    reset();
  };

  const onSubmit = handleSubmit((data) => {
    setLoader(false);

    const formData = {
      ...data,

      userId: props.depositUser?._id,

      parentUserId:
        props.depositUser?.role === "admin"
          ? props.depositUser?._id
          : props.depositUser?.parentId,

      balanceUpdateType: "D",
    };

    UserService.updateDepositBalance(formData)
      .then((res: AxiosResponse) => {
        props.closeModal("d", res.data.data);

        toast.success("Deposit Balance Updated Successfully");

        setLoader(true);

        reset();
      })
      .catch((error) => {
        setLoader(true);

        toast.error(
          error?.response?.data?.message || "Something went wrong"
        );
      });
  });

  return (
    <>
      <style>
        {`

        /* ===============================
           OVERLAY
        =============================== */

        .deposit-premium-overlay {
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


        /* ===============================
           MODAL
        =============================== */

        .deposit-premium-modal {
          width: 100%;
          max-width: 520px;

          outline: none;
        }

        .deposit-premium-card {
          width: 100%;

          background: #ffffff;

          border-radius: 16px;

          overflow: hidden;

          box-shadow:
            0 25px 70px rgba(0,0,0,.30),
            0 5px 20px rgba(0,0,0,.12);

          animation: depositPremiumOpen .18s ease-out;
        }

        @keyframes depositPremiumOpen {

          from {
            opacity: 0;
            transform: translateY(12px) scale(.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

        }


        /* ===============================
           HEADER
        =============================== */

        .deposit-premium-header {
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

        .deposit-header-left {
          display: flex;
          align-items: center;

          gap: 12px;
        }

        .deposit-header-icon {
          width: 43px;
          height: 43px;

          border-radius: 11px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: rgba(255,255,255,.12);

          border: 1px solid rgba(255,255,255,.12);

          color: #ffffff;

          font-size: 18px;
        }

        .deposit-header-text h4 {
          margin: 0;
          padding: 0;

          color: #ffffff;

          font-size: 18px;
          font-weight: 700;
        }

        .deposit-header-text span {
          display: block;

          margin-top: 3px;

          color: rgba(255,255,255,.68);

          font-size: 11px;
        }

        .deposit-header-close {
          width: 35px;
          height: 35px;

          border: 0;

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

        .deposit-header-close:hover {
          background: rgba(255,255,255,.20);
        }


        /* ===============================
           BODY
        =============================== */

        .deposit-premium-body {
          padding: 20px;

          background: #f5f7fa;
        }


        /* ===============================
           BALANCE CARDS
        =============================== */

        .deposit-balance-wrapper {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 12px;

          margin-bottom: 20px;
        }

        .deposit-balance-card {
          position: relative;

          padding: 15px;

          background: #ffffff;

          border: 1px solid #e1e7ed;

          border-radius: 12px;

          box-shadow:
            0 4px 12px rgba(12,35,60,.05);

          overflow: hidden;
        }

        .deposit-balance-card.parent {
          border-top: 3px solid #e5a50a;
        }

        .deposit-balance-card.user {
          border-top: 3px solid #10a37f;
        }

        .deposit-balance-type {
          margin-bottom: 5px;

          color: #88939f;

          font-size: 10px;
          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: .5px;
        }

        .deposit-username {
          color: #1a2938;

          font-size: 13px;
          font-weight: 700;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;
        }

        .deposit-main-balance {
          margin-top: 8px;

          color: #052a51;

          font-size: 21px;
          font-weight: 800;
        }

        .deposit-balance-divider {
          margin: 10px 0 8px;

          border-top: 1px dashed #d8dfe6;
        }

        .deposit-after-row {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 5px;

          color: #8a949f;

          font-size: 10px;
        }

        .deposit-after-row strong {
          color: #344454;

          font-size: 12px;
          font-weight: 700;
        }

        .deposit-after-row strong.parent {
          color: #d39200;
        }

        .deposit-after-row strong.user {
          color: #079471;
        }


        /* ===============================
           FORM
        =============================== */

        .deposit-field {
          margin-bottom: 16px;
        }

        .deposit-field:last-child {
          margin-bottom: 0;
        }

        .deposit-field-label {
          display: flex;

          align-items: center;
          justify-content: space-between;

          margin-bottom: 7px;

          color: #3d4b59;

          font-size: 12px;
          font-weight: 700;
        }

        .deposit-field-label span {
          color: #98a1aa;

          font-size: 10px;
          font-weight: 500;
        }


        /* ===============================
           AMOUNT INPUT
        =============================== */

        .deposit-amount-container {
          position: relative;
        }

        .deposit-currency {
          position: absolute;

          left: 15px;
          top: 50%;

          transform: translateY(-50%);

          color: #052a51;

          font-size: 20px;
          font-weight: 800;

          pointer-events: none;
        }

        .deposit-amount-input {
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

        .deposit-amount-input::placeholder {
          color: #b5bdc5;
        }

        .deposit-amount-input:focus {
          border-color: #0a568a;

          box-shadow:
            0 0 0 3px rgba(5,74,120,.09);
        }

        .deposit-amount-input::-webkit-outer-spin-button,
        .deposit-amount-input::-webkit-inner-spin-button {
          -webkit-appearance: none;

          margin: 0;
        }

        .deposit-amount-input[type=number] {
          -moz-appearance: textfield;
        }


        /* ===============================
           REMARK
        =============================== */

        .deposit-remark-input {
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

        .deposit-remark-input::placeholder {
          color: #a6afb8;
        }

        .deposit-remark-input:focus {
          border-color: #0a568a;

          box-shadow:
            0 0 0 3px rgba(5,74,120,.09);
        }


        /* ===============================
           ERROR
        =============================== */

        .deposit-error {
          display: block;

          margin-top: 5px;

          color: #dc3545;

          font-size: 11px;
          font-weight: 600;
        }


        /* ===============================
           FOOTER
        =============================== */

        .deposit-premium-footer {
          padding: 14px 20px;

          display: flex;

          align-items: center;
          justify-content: flex-end;

          gap: 10px;

          background: #ffffff;

          border-top: 1px solid #e4e9ee;
        }

        .deposit-back-button {
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

        .deposit-back-button:hover {
          background: #e7eaed;
        }

        .deposit-submit-button {
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
              #087d63,
              #10a37f
            ) !important;

          color: #ffffff !important;

          font-size: 12px !important;
          font-weight: 700 !important;

          box-shadow:
            0 5px 14px rgba(16,163,127,.25);

          cursor: pointer;

          transition: .2s ease !important;
        }

        .deposit-submit-button:hover {
          transform: translateY(-1px);

          box-shadow:
            0 7px 18px rgba(16,163,127,.32);
        }


        /* ===============================
           MOBILE
        =============================== */

        @media (max-width: 575px) {

          .deposit-premium-overlay {
            padding: 10px;
          }

          .deposit-premium-modal {
            max-width: 100%;
          }

          .deposit-premium-header {
            min-height: 66px;

            padding: 13px 15px;
          }

          .deposit-header-icon {
            width: 38px;
            height: 38px;

            border-radius: 9px;
          }

          .deposit-header-text h4 {
            font-size: 16px;
          }

          .deposit-premium-body {
            padding: 14px;
          }

          .deposit-balance-wrapper {
            gap: 8px;
          }

          .deposit-balance-card {
            padding: 12px 10px;
          }

          .deposit-main-balance {
            font-size: 16px;
          }

          .deposit-username {
            font-size: 11px;
          }

          .deposit-after-row {
            display: block;
          }

          .deposit-after-row strong {
            display: block;

            margin-top: 3px;
          }

          .deposit-premium-footer {
            padding: 12px 14px;
          }

          .deposit-back-button,
          .deposit-submit-button {
            flex: 1;

            min-width: 0;
          }

        }

        `}
      </style>

      <Modal
        isOpen={props.showDialog}
        onRequestClose={closeDepositModal}
        contentLabel="Deposit"
        className="deposit-premium-modal"
        overlayClassName="deposit-premium-overlay"
        shouldCloseOnOverlayClick={true}
      >
        <div className="deposit-premium-card">

          {/* HEADER */}

          <div className="deposit-premium-header">

            <div className="deposit-header-left">

              <div className="deposit-header-icon">
                <i className="fas fa-coins" />
              </div>

              <div className="deposit-header-text">

                <h4>Deposit Chips</h4>

                <span>
                  Transfer balance to user account
                </span>

              </div>

            </div>

            <button
              type="button"
              className="deposit-header-close"
              onClick={closeDepositModal}
            >
              ×
            </button>

          </div>


          <form
            id="DepositForm"
            method="post"
            autoComplete="off"
            onSubmit={onSubmit}
          >

            <div className="deposit-premium-body">

              {/* BALANCE CARDS */}

              <div className="deposit-balance-wrapper">

                {/* PARENT */}

                <div className="deposit-balance-card parent">

                  <div className="deposit-balance-type">
                    Parent Account
                  </div>

                  <div className="deposit-username">
                    {props.depositUser?.parent?.username || "Parent"}
                  </div>

                  <div className="deposit-main-balance">
                    ₹ {parentBalance.toFixed(2)}
                  </div>

                  <div className="deposit-balance-divider" />

                  <div className="deposit-after-row">

                    <span>
                      After Deposit
                    </span>

                    <strong className="parent">
                      ₹ {parentAfterBalance.toFixed(2)}
                    </strong>

                  </div>

                </div>


                {/* USER */}

                <div className="deposit-balance-card user">

                  <div className="deposit-balance-type">
                    User Account
                  </div>

                  <div className="deposit-username">
                    {props.depositUser?.username || "User"}
                  </div>

                  <div className="deposit-main-balance">
                    ₹ {userBalance.toFixed(2)}
                  </div>

                  <div className="deposit-balance-divider" />

                  <div className="deposit-after-row">

                    <span>
                      After Deposit
                    </span>

                    <strong className="user">
                      ₹ {userAfterBalance.toFixed(2)}
                    </strong>

                  </div>

                </div>

              </div>


              {/* AMOUNT */}

              <div className="deposit-field">

                <div className="deposit-field-label">

                  <label htmlFor="deposite-amount">
                    Deposit Amount
                  </label>

                  {props.depositUser?.role !== "admin" && (
                    <span>
                      Available: ₹ {parentBalance.toFixed(2)}
                    </span>
                  )}

                </div>

                <div className="deposit-amount-container">

                  <span className="deposit-currency">
                    ₹
                  </span>

                  <input
                    type="number"
                    id="deposite-amount"
                    className="deposit-amount-input"
                    placeholder="0.00"
                    {...register("amount")}
                    min={0}
                    step="0.01"
                  />

                </div>

                {errors?.amount && (
                  <span className="deposit-error">
                    {errors.amount.message}
                  </span>
                )}

              </div>


              {/* REMARK */}

              <div className="deposit-field">

                <div className="deposit-field-label">

                  <label htmlFor="deposit-remark">
                    Remark
                  </label>

                  <span>
                    Optional
                  </span>

                </div>

                <textarea
                  id="deposit-remark"
                  className="deposit-remark-input"
                  placeholder="Enter deposit remark..."
                  {...register("narration")}
                />

                {errors?.narration && (
                  <span className="deposit-error">
                    {errors.narration.message}
                  </span>
                )}

              </div>

            </div>


            {/* FOOTER */}

            <div className="deposit-premium-footer">

              <input
                type="hidden"
                name="uid"
                id="uid"
              />

              <button
                type="button"
                className="deposit-back-button"
                onClick={closeDepositModal}
              >

                <i className="fas fa-arrow-left" />

                Back

              </button>


              {loader ? (

                <SubmitButton
                  type="submit"
                  className="deposit-submit-button"
                >

                  Deposit

                  <i className="fas fa-arrow-right" />

                </SubmitButton>

              ) : (

                <button
                  type="button"
                  className="deposit-submit-button"
                  disabled
                >

                  <i className="fas fa-spinner fa-spin" />

                  Processing...

                </button>

              )}

            </div>

          </form>

        </div>
      </Modal>
    </>
  );
};

export default DepositModal;