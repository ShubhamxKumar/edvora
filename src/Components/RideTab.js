import React from "react";
import styles from "../styles/Ridetab.module.css";
import map from "../static/map.png";

function RideTab({ ride }) {
  return (
    <div className={styles.tab_main}>
      <img src={map} alt="map" />
      <span className={styles.ride_details}>
        <div>
          {" "}
          Ride Id : <p> {ride.id} </p>
        </div>
        <div>
          Origin Station : <p>{ride.origin_station_code}</p>
        </div>{" "}
        <div>
          station_path : [<p>{ride.station_path.toString()}]</p>
        </div>{" "}
        <div>
          Date : <p>{ride.date}</p>
        </div>{" "}
        <div>
          Distance : <p>{ride.distance}</p>
        </div>
      </span>
      <span className={styles.ride_location}>
        <button className={styles.location_card} disabled={true}>
          {" "}
          {ride.city}{" "}
        </button>
        <button className={styles.location_card} disabled={true}>
          {" "}
          {ride.state}{" "}
        </button>
      </span>
    </div>
  );
}

export default RideTab;
