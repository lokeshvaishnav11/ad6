import React from "react";
import Modal from "react-modal";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { useAppSelector } from "../../../../redux/hooks";
import ISport from "../../../../models/ISport";
import { selectSportList } from "../../../../redux/actions/sports/sportSlice";
import userService from "../../../../services/user.service";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import SubmitButton from "../../../../components/SubmitButton";
import { RoleType } from "../../../../models/User";

const GeneralSettingsModal = (props: any) => {
  const sportListState = useAppSelector<{ sports: ISport[] }>(
    selectSportList
  );

  const depositValidationSchema = Yup.object().shape({
    // transactionPassword: Yup.string().required(
    //   "Transaction Password is required"
    // ),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      userId: "",
      userSetting: props?.depositUser?.userSetting
        ? props?.depositUser?.userSetting
        : props?.depositUser?.parent?.userSetting,
      transactionPassword: "123456",
    },
    resolver: yupResolver(depositValidationSchema),
  });

  React.useEffect(() => {
    setValue("transactionPassword", "123456");
  }, [setValue]);

  React.useEffect(() => {
    const userSettings = props?.depositUser?.userSetting;
    const parentSettings = props?.depositUser?.parent?.userSetting;

    const settings = userSettings || parentSettings;

    if (settings && Object.keys(settings).length > 0) {
      setValue("userId", props?.depositUser?._id);

      Object.keys(settings).forEach((key) => {
        setValue(
          `userSetting.${key}.minBet`,
          settings[key]?.minBet
        );

        setValue(
          `userSetting.${key}.maxBet`,
          settings[key]?.maxBet
        );

        setValue(
          `userSetting.${key}.delay`,
          settings[key]?.delay
        );
      });
    }
  }, [props.depositUser, setValue]);

  const closeModal = () => {
    props.closeModal("gs");
    reset();
  };

  const onSubmit = handleSubmit((data: any) => {
    const userSettingsObject: any = {};

    if (Array.isArray(data.userSetting)) {
      data.userSetting.forEach(
        (userSettings: any, index: number) => {
          if (userSettings !== null && userSettings !== undefined) {
            userSettingsObject[index] = userSettings;
          }
        }
      );
    } else if (data.userSetting) {
      Object.keys(data.userSetting).forEach((key) => {
        if (
          data.userSetting[key] !== null &&
          data.userSetting[key] !== undefined
        ) {
          userSettingsObject[key] = data.userSetting[key];
        }
      });
    }

    data.userSetting = userSettingsObject;

    userService
      .saveGeneralSetting(data)
      .then((res: AxiosResponse) => {
        closeModal();
        toast.success(res.data.message);
      })
      .catch((err: any) => {
        console.error(err);

        toast.error(
          err?.response?.data?.message ||
            "Something went wrong"
        );
      });
  });

  const getSettingTitle = (sports: any) => {
    if (sports.name === "Cricket") {
      return "Casino";
    }

    if (sports.name === "Soccer") {
      return "Match";
    }

    if (sports.name === "Tennis") {
      return "Fancy";
    }

    return sports.name;
  };

  const getSettingIcon = (sports: any) => {
    if (sports.name === "Cricket") {
      return "fas fa-dice";
    }

    if (sports.name === "Soccer") {
      return "fas fa-futbol";
    }

    if (sports.name === "Tennis") {
      return "fas fa-chart-line";
    }

    return "fas fa-cog";
  };

  const getParentSetting = (sportId: number) => {
    return props?.depositUser?.parent?.userSetting?.[
      sportId
    ];
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "44px",
    border: "1px solid #dfe3e8",
    borderRadius: "8px",
    padding: "0 12px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#222",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "6px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#68707d",
  };

  return (
    <>
      <Modal
        isOpen={props.showDialog}
        onRequestClose={closeModal}
        contentLabel="General Settings"
        className="modal-dialog"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.60)",
            zIndex: 9999,

            // Important for small screens
            overflowY: "auto",

            padding: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },

          content: {
            position: "relative",
            inset: "auto",

            width: "100%",
            maxWidth: "1050px",

            maxHeight: "95vh",

            padding: 0,
            margin: 0,

            border: "none",
            borderRadius: "16px",

            background: "transparent",
            overflow: "visible",
          },
        }}
      >
        <div
          className="modal-content"
          style={{
            width: "100%",
            maxHeight: "92vh",

            border: "none",
            borderRadius: "16px",

            overflow: "hidden",

            background: "#fff",

            boxShadow:
              "0px 20px 60px rgba(0, 0, 0, 0.30)",

            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ================= HEADER ================= */}

          <div
            className="modal-header"
            style={{
              flex: "0 0 auto",

              border: "none",
              padding: "18px 22px",

              background:
                "linear-gradient(135deg, #1f2937 0%, #111827 100%)",

              color: "#fff",

              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h4
                className="modal-title"
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                General Settings
              </h4>

              <div
                style={{
                  marginTop: "3px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                Manage betting limits and delay
              </div>
            </div>

            <button
              type="button"
              onClick={closeModal}
              style={{
                width: "36px",
                height: "36px",

                padding: 0,

                border: "none",
                borderRadius: "50%",

                background:
                  "rgba(255,255,255,0.12)",

                color: "#fff",

                fontSize: "23px",

                cursor: "pointer",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>

          {/* ================= FORM ================= */}

          <form
            id="DepositForm"
            method="post"
            autoComplete="off"
            onSubmit={onSubmit}
            style={{
              flex: "1 1 auto",

              display: "flex",
              flexDirection: "column",

              minHeight: 0,

              overflow: "hidden",
            }}
          >
            {/* ================= SCROLLABLE BODY ================= */}

            <div
              className="modal-body"
              style={{
                flex: "1 1 auto",

                minHeight: 0,

                padding: "22px",

                background: "#f6f7f9",

                // MAIN SCROLL
                overflowY: "auto",
                overflowX: "hidden",

                WebkitOverflowScrolling: "touch",
              }}
            >
              <div className="row">
                {sportListState.sports?.map(
                  (sports: any) => {
                    const { _id, sportId } = sports;

                    // Only Casino / Match / Fancy
                    if (
                      sportId !== 1 &&
                      sportId !== 2 &&
                      sportId !== 4
                    ) {
                      return null;
                    }

                    const title =
                      getSettingTitle(sports);

                    const icon =
                      getSettingIcon(sports);

                    const parentSetting =
                      getParentSetting(sportId);

                    return (
                      <div
                        className="col-lg-4 col-md-4 col-sm-12 mb-3"
                        key={_id}
                      >
                        <div
                          style={{
                            height: "100%",

                            padding: "17px",

                            background: "#fff",

                            border:
                              "1px solid #e6e8ec",

                            borderRadius: "14px",

                            boxShadow:
                              "0 4px 15px rgba(0,0,0,0.04)",
                          }}
                        >
                          {/* CARD HEADER */}

                          <div
                            style={{
                              display: "flex",

                              alignItems: "center",

                              justifyContent:
                                "space-between",

                              paddingBottom: "13px",

                              marginBottom: "16px",

                              borderBottom:
                                "1px solid #eeeeee",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",

                                alignItems: "center",

                                gap: "9px",
                              }}
                            >
                              {/* ICON */}

                              <div
                                style={{
                                  width: "38px",

                                  height: "38px",

                                  flexShrink: 0,

                                  borderRadius: "10px",

                                  background:
                                    "#f1f3f5",

                                  display: "flex",

                                  alignItems:
                                    "center",

                                  justifyContent:
                                    "center",

                                  color: "#222",
                                }}
                              >
                                <i
                                  className={icon}
                                  style={{
                                    fontSize:
                                      "15px",
                                  }}
                                />
                              </div>

                              {/* TITLE */}

                              <div>
                                <div
                                  style={{
                                    fontSize:
                                      "16px",

                                    fontWeight:
                                      700,

                                    color:
                                      "#171717",
                                  }}
                                >
                                  {title}
                                </div>

                                <div
                                  style={{
                                    fontSize:
                                      "10px",

                                    color:
                                      "#9ca3af",

                                    marginTop:
                                      "1px",
                                  }}
                                >
                                  Betting Settings
                                </div>
                              </div>
                            </div>

                            <span
                              style={{
                                padding:
                                  "5px 9px",

                                borderRadius:
                                  "20px",

                                background:
                                  "#f0f1f3",

                                color:
                                  "#606773",

                                fontSize:
                                  "9px",

                                fontWeight:
                                  800,

                                letterSpacing:
                                  ".3px",
                              }}
                            >
                              SETTINGS
                            </span>
                          </div>

                          {/* ================= MIN BET ================= */}

                          <div
                            style={{
                              marginBottom:
                                "14px",
                            }}
                          >
                            <label
                              htmlFor={`minBet.${sportId}`}
                              style={
                                labelStyle
                              }
                            >
                              Min Bet
                            </label>

                            <input
                              id={`minBet.${sportId}`}
                              className={`minBet.${sportId}`}
                              {...register(
                                `userSetting.${sportId}.minBet`
                              )}
                              placeholder="0"
                              max={
                                props
                                  ?.depositUser
                                  ?.role !==
                                RoleType.admin
                                  ? parentSetting?.minBet
                                  : undefined
                              }
                              min={0}
                              type="number"
                              style={
                                inputStyle
                              }
                            />

                            <span className="error" />
                          </div>

                          {/* ================= MAX BET ================= */}

                          <div
                            style={{
                              marginBottom:
                                "14px",
                            }}
                          >
                            <label
                              htmlFor={`maxBet.${sportId}`}
                              style={
                                labelStyle
                              }
                            >
                              Max Bet
                            </label>

                            <input
                              id={`maxBet.${sportId}`}
                              className={`maxBet.${sportId}`}
                              {...register(
                                `userSetting.${sportId}.maxBet`
                              )}
                              placeholder="0"
                              max={
                                props
                                  ?.depositUser
                                  ?.role !==
                                RoleType.admin
                                  ? parentSetting?.maxBet
                                  : undefined
                              }
                              min={0}
                              type="number"
                              style={
                                inputStyle
                              }
                            />

                            <span className="error" />
                          </div>

                          {/* ================= DELAY ================= */}

                          <div>
                            <label
                              htmlFor={`delay.${sportId}`}
                              style={
                                labelStyle
                              }
                            >
                              Delay
                            </label>

                            <div
                              style={{
                                position:
                                  "relative",
                              }}
                            >
                              <input
                                id={`delay.${sportId}`}
                                className={`delay.${sportId}`}
                                {...register(
                                  `userSetting.${sportId}.delay`
                                )}
                                placeholder="0"
                                max={
                                  props
                                    ?.depositUser
                                    ?.role !==
                                  RoleType.admin
                                    ? parentSetting?.delay
                                    : undefined
                                }
                                min={0}
                                type="number"
                                style={{
                                  ...inputStyle,

                                  paddingRight:
                                    "52px",
                                }}
                              />

                              <span
                                style={{
                                  position:
                                    "absolute",

                                  right: "12px",

                                  top: "50%",

                                  transform:
                                    "translateY(-50%)",

                                  color:
                                    "#9ca3af",

                                  fontSize:
                                    "10px",

                                  fontWeight:
                                    800,

                                  pointerEvents:
                                    "none",
                                }}
                              >
                                SEC
                              </span>
                            </div>

                            <span className="error" />
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* ================= FIXED FOOTER ================= */}

            <div
              className="modal-footer"
              style={{
                flex: "0 0 auto",

                padding: "14px 20px",

                borderTop:
                  "1px solid #e5e7eb",

                background: "#fff",

                display: "flex",

                justifyContent:
                  "flex-end",

                alignItems: "center",

                gap: "10px",

                boxShadow:
                  "0 -4px 15px rgba(0,0,0,0.04)",
              }}
            >
              <input
                type="hidden"
                name="uid"
                id="uid"
              />

              {/* BACK BUTTON */}

              <button
                type="button"
                onClick={closeModal}
                style={{
                  minWidth: "100px",

                  height: "42px",

                  padding: "0 18px",

                  border:
                    "1px solid #d5d8dd",

                  borderRadius: "8px",

                  background: "#fff",

                  color: "#444",

                  fontSize: "13px",

                  fontWeight: 700,

                  cursor: "pointer",
                }}
              >
                <i
                  className="fas fa-undo"
                  style={{
                    marginRight: "7px",
                  }}
                />

                Back
              </button>

              {/* SUBMIT BUTTON */}

              <SubmitButton
                type="submit"
                className="btn btn-submit"
                style={{
                  minWidth: "110px",

                  height: "42px",

                  borderRadius: "8px",

                  fontSize: "13px",

                  fontWeight: 700,
                }}
              >
                Submit

                <i
                  className="fas fa-sign-in-alt"
                  style={{
                    marginLeft: "7px",
                  }}
                />
              </SubmitButton>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default GeneralSettingsModal;