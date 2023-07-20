import "./HistoryCard.css";

function HistoryCard({ city, region, lastUpdated, onClick }) {
  return (
    <div className="card-container" onClick={onClick}>
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
