import "./HistoryCard.css";

function HistoryCard({ city, region, lastUpdated, onClick, darkMode }) {
  return (
    <div
      aria-label="Search History Card"
      className={`card-container ${darkMode ? "dark-b" : "light-b"}`}
      onClick={onClick}
    >
      <div className="information-container">
        <p className="location">
          {city}, {region}
        </p>
        <p className="last-updated">{lastUpdated}</p>
      </div>
    </div>
  );
}

export default HistoryCard;
