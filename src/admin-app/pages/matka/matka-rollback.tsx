import React from "react";
import accountService from "../../../services/account.service";
import betService from "../../../services/bet.service";
import "./matka-result-rollback.css";

export default function MatkaResultRollback() {
  const [date, setDate] = React.useState("");
  const [selectedMatchId, setSelectedMatchId] = React.useState("");
  const [result, setResult] = React.useState("");
  const [rows, setRows] = React.useState<any>([]);
  const [matkaList, setMatkaList] = React.useState<any>([]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [rollbackId, setRollbackId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMatkaList = async () => {
      try {
        const res = await accountService.matkagamelistRollBack();

        console.log(
          res?.data?.data.reverse().slice(0, 12),
          "ffff"
        );

        setMatkaList(res?.data?.data?.slice(0, 12));
      } catch (err) {
        console.error("Matka list error:", err);
      }
    };

    fetchMatkaList();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const selectedGame = matkaList.find(
      (m: any) => m.roundid === selectedMatchId
    );

    if (!selectedGame) {
      alert("Invalid round selected");
      return;
    }

    const payload = {
      roundid: selectedGame.roundid,
      gamename: selectedGame.gamename,
      result,
    };

    try {
      setIsSubmitting(true);

      const res = await betService.matkaresult(payload);

      setRows((prev: any) => [...prev, payload]);
      setResult("");
    } catch (err) {
      console.error("Result submit error:", err);
      alert("Result submit failed");
    } finally {
      setIsSubmitting(false);
      window.location.reload();
    }
  };

  const handleRollback = async (roundid: string) => {
    try {
      setRollbackId(roundid);

      await betService.matkaresultRollback(roundid);

      alert("Rollback successful");
    } catch (err) {
      console.error("Rollback error:", err);
      alert("Rollback failed");
    } finally {
      setRollbackId(null);
      window.location.reload();
    }
  };

  const selectedGame = matkaList.find(
    (item: any) => item.roundid === selectedMatchId
  );

  return (
    <div className="mrr-page">
      <div className="mrr-container">
        <div className="mrr-header">
          <div>
            <span className="mrr-eyebrow">
              Result Management
            </span>

            <h2>Matka Result Control</h2>

            <p>
              Update results and rollback previous rounds from one place.
            </p>
          </div>

          <div className="mrr-stats">
            <div className="mrr-stat-card">
              <span>Rounds</span>
              <strong>{matkaList.length}</strong>
            </div>

            <div className="mrr-stat-card mrr-result-stat">
              <span>Selected</span>
              <strong>{selectedMatchId ? "1" : "0"}</strong>
            </div>
          </div>
        </div>

        <div className="mrr-form-card">
          <div className="mrr-card-header">
            <div>
              <h3>Update Result</h3>
              <p>Select a market and enter its new result.</p>
            </div>

            <span className="mrr-status-pill">
              Live Control
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mrr-form">
            <div className="mrr-form-grid">
              <div className="mrr-field">
                <label>Market / Round</label>

                <div className="mrr-input-shell">
                  <select
                    value={selectedMatchId}
                    onChange={(e) =>
                      setSelectedMatchId(e.target.value)
                    }
                    required
                  >
                    <option value="">
                      Select Market
                    </option>

                    {matkaList.map((item: any) => (
                      <option
                        key={item.roundid}
                        value={item.roundid}
                      >
                        {item.roundid}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mrr-field">
                <label>Game</label>

                <div className="mrr-readonly-box">
                  {selectedGame?.gamename || "Select a market first"}
                </div>
              </div>

              <div className="mrr-field">
                <label>Result</label>

                <div className="mrr-input-shell">
                  <input
                    type="number"
                    value={result}
                    onChange={(e) => {
                      if (e.target.value.length <= 2) {
                        setResult(e.target.value);
                      }
                    }}
                    placeholder="Enter Result"
                    required
                  />
                </div>

                <span className="mrr-field-note">
                  Maximum 2 digits
                </span>
              </div>

              <div className="mrr-submit-wrap">
                <button
                  type="submit"
                  className="mrr-update-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Updating..."
                    : "Update Result"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="mrr-table-card">
          <div className="mrr-table-header">
            <div>
              <h3>Recent Matka Rounds</h3>
              <p>
                Latest available rounds and their current results.
              </p>
            </div>

            <div className="mrr-record-count">
              {matkaList.length} Records
            </div>
          </div>

          <div className="mrr-table-responsive">
            <table className="mrr-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Game</th>
                  <th>Result</th>
                  <th>Round ID</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {matkaList.length > 0 ? (
                  matkaList.map((row: any, idx: number) => {
                    const isRollingBack =
                      rollbackId === row.roundid;

                    return (
                      <tr key={row.roundid || idx}>
                        <td data-label="SR">
                          <span className="mrr-sr">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </td>

                        <td data-label="Game">
                          <div className="mrr-game-cell">
                            <div className="mrr-game-icon">
                              {row.gamename
                                ?.charAt(0)
                                ?.toUpperCase() || "M"}
                            </div>

                            <div>
                              <span className="mrr-game-name">
                                {row.gamename}
                              </span>

                              <span className="mrr-game-sub">
                                Matka Game
                              </span>
                            </div>
                          </div>
                        </td>

                        <td data-label="Result">
                          <span
                            className={
                              row.result
                                ? "mrr-result-badge mrr-result-available"
                                : "mrr-result-badge mrr-result-empty"
                            }
                          >
                            {row.result || "Pending"}
                          </span>
                        </td>

                        <td data-label="Round ID">
                          <span className="mrr-round-id">
                            {row.roundid}
                          </span>
                        </td>

                        <td data-label="Rollback">
                          <button
                            type="button"
                            className="mrr-rollback-btn"
                            disabled={isRollingBack}
                            onClick={() =>
                              handleRollback(row.roundid)
                            }
                          >
                            <span className="mrr-rollback-icon">
                              ↶
                            </span>

                            {isRollingBack
                              ? "Rolling Back..."
                              : "Rollback"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <div className="mrr-empty-state">
                        <div className="mrr-empty-icon">
                          ◌
                        </div>

                        <h3>No Results Found</h3>

                        <p>
                          No matka result records are available.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}