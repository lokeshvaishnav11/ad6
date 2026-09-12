import React, { ChangeEvent, FormEvent } from "react";
import seriesService from "../../../services/sports.service";
import "./sports.css";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import IMatch from "../../../models/IMatch";
import { toast } from "react-toastify";

const MatchesPage = () => {
  const [matches, setMatches] = React.useState<IMatch[]>([]);

  const { sportId, competitionId } = useParams();

  const autoSelectAllMatches = () => {
    const updatedMatches = matches.map((match) => ({
      ...match,
      active: true,
    }));
    setMatches(updatedMatches);
  };

  React.useEffect(() => {
    if (sportId) {
      seriesService
        .getSeriesWithMarket(sportId!)
        .then((res: AxiosResponse<any>) => {
          const matchesList = res.data.data;

          const sortedMatches = [...matchesList].sort((a, b) => {
            const dateA: any = new Date(a.matchDateTime);
            const dateB: any = new Date(b.matchDateTime);
            return dateA - dateB;
          });

          const uniqueEvents = Array.from(
            new Map(
              sortedMatches.map((item: any) => [String(item.matchId), item])
            ).values()
          );

          const now = new Date();
          const threeDaysLater = new Date(
            now.getTime() + 3 * 24 * 60 * 60 * 1000
          );

          const filteredEvents = Array.from(
            new Map(
              uniqueEvents
                .filter((event: any) => {
                  const matchDate = new Date(event.matchDateTime);
                  return matchDate >= now && matchDate <= threeDaysLater;
                })
                .map((event: any) => [event.matchId, event])
            ).values()
          );

          setMatches(uniqueEvents);
        })
        .catch((e) => {
          toast.error(e.message);
        });
    }
  }, []);

  const handleMatch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const selectdMatches = matches.filter((ele) => ele.active);

    seriesService
      .saveMatch(selectdMatches)
      .then(() => {
        toast.success("Match Saved Successfully");
      })
      .catch((e) => {
        const error = e.response.data.message;
        toast.error(error);
      });
  };

  const selectMatch = (
    e: ChangeEvent<HTMLInputElement>,
    indx: number
  ) => {
    const items: any = [...matches];
    items[indx].active = e.target.checked ? true : false;
    setMatches(items);
  };

  function convertUTCtoIST(utcString: any) {
    const date = new Date(utcString);

    const options: any = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    return date.toLocaleString("en-IN", options);
  }

  const selectedCount = matches.filter((match) => match.active).length;

  return (
    <div className="matches-page">
      <div className="matches-shell">
        <div className="matches-header">
          <div>
            <span className="matches-eyebrow">Match Management</span>
            <h2>Available Matches</h2>
            <p>
              Select the matches you want to activate and save them.
            </p>
          </div>

          <div className="matches-header-stats">
            <div className="match-stat-card">
              <span>Total Matches</span>
              <strong>{matches.length}</strong>
            </div>

            <div className="match-stat-card active-stat">
              <span>Selected</span>
              <strong>{selectedCount}</strong>
            </div>
          </div>
        </div>

        <form onSubmit={handleMatch}>
          <div className="match-toolbar">
            <div className="toolbar-left">
              <div className="live-indicator">
                <span className="live-dot"></span>
                Match List
              </div>
            </div>

            <div className="toolbar-right">
              <button
                type="button"
                className="select-all-btn"
                onClick={autoSelectAllMatches}
              >
                Select All
              </button>

              <button
                className="save-match-btn"
                type="submit"
                disabled={selectedCount === 0}
              >
                <span className="save-icon">✓</span>
                Save Match
                {selectedCount > 0 && (
                  <span className="save-count">
                    {selectedCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="matches-table-card">
            <div className="matches-table-wrapper">
              <table className="matches-table">
                <thead>
                  <tr>
                    <th>
                      <span className="table-heading">
                        Match
                      </span>
                    </th>
                    <th>
                      <span className="table-heading">
                        Open Date
                      </span>
                    </th>
                    <th className="action-heading">
                      <span className="table-heading">
                        Status
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {matches.length > 0 ? (
                    matches.map(
                      (match: IMatch, index: number) => (
                        <tr
                          key={
                            (match as any).matchId || index
                          }
                          className={
                            match.active
                              ? "match-row selected-row"
                              : "match-row"
                          }
                        >
                          <td data-label="Match">
                            <div className="match-info">
                              <div className="match-icon">
                                ⚡
                              </div>

                              <div className="match-title-area">
                                <span className="match-title">
                                  {match.name}
                                </span>

                                <span className="match-subtitle">
                                  Match ID:{" "}
                                  {(match as any).matchId ||
                                    "N/A"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td data-label="Open Date">
                            <div className="date-box">
                              <span className="calendar-icon">
                                ◷
                              </span>

                              <span>
                                {convertUTCtoIST(
                                  match?.matchDateTime
                                )}
                              </span>
                            </div>
                          </td>

                          <td
                            data-label="Status"
                            className="action-cell"
                          >
                            <label className="match-switch">
                              <input
                                type="checkbox"
                                name={match.name}
                                onChange={(e) =>
                                  selectMatch(e, index)
                                }
                                value={match.name || ""}
                                checked={match.active}
                              />

                              <span className="switch-slider">
                                <span className="switch-circle"></span>
                              </span>
                            </label>

                            <span
                              className={
                                match.active
                                  ? "status-text active-text"
                                  : "status-text inactive-text"
                              }
                            >
                              {match.active
                                ? "Selected"
                                : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan={3}>
                        <div className="empty-state">
                          <div className="empty-icon">
                            ◌
                          </div>

                          <h3>No Matches Found</h3>

                          <p>
                            There are currently no matches
                            available for this sport.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MatchesPage;