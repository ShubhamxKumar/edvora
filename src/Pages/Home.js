import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import styles from "../styles/Home.module.css";
import axios from "axios";
import Loading from "../Components/Loading";
import RideTab from "../Components/RideTab";
import sort from "../static/sort.png";

function Home() {
  const user = {
    station_code: 40,
    name: "Dhruv Singh",
  };

  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rides, setRides] = useState([]);
  const [upcoming_rides, setUpComing] = useState([]);
  const [past_rides, setPastRides] = useState([]);
  const [selected_tab, setSelectedTab] = useState("NEAR");
  const [filter_state, setFilterState] = useState("");
  const [filter_city, setFilterCity] = useState("");
  const [show_filter, setShowFilter] = useState(false);

  const getStates = (rides) => {
    let res = [];
    for (let i = 0; i < rides.length; i++) {
      let index = res.findIndex((obj) => {
        return obj.state === rides[i].state;
      });
      if (index !== -1) {
        res[index].cities.push(rides[i].city);
      } else {
        res.push({ state: rides[i].state, cities: [rides[i].city] });
      }
    }
    console.log(res);
    setStates(res);
  };

  const getNearest = (list, el) => {
    let dis = Number.POSITIVE_INFINITY;
    for (let i = 0; i < list.length; i++) {
      const temp_dis = Math.abs(list[i] - el);
      if (dis > temp_dis) {
        dis = temp_dis;
      }
    }
    return dis;
  };

  const getRides = async () => {
    try {
      setLoading(true);
      let res = await axios.get("https://assessment.api.vweb.app/rides");
      res.data.sort((a, b) => {
        let res_a = getNearest(a.station_path, user.station_code);
        let res_b = getNearest(b.station_path, user.station_code);
        a.distance = res_a;
        b.distance = res_b;

        return res_a - res_b;
      });
      let past_rides = [],
        upcoming_rides = [];
      const current_time = Date.now();
      for (let i = 0; i < res.data.length; i++) {
        const date = new Date(res.data[i].date.toString());
        if (current_time <= date.getTime()) {
          upcoming_rides.push(res.data[i]);
        } else {
          past_rides.push(res.data[i]);
        }
      }
      setRides(res.data);
      setUpComing(upcoming_rides);
      setPastRides(past_rides);
      getStates(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getFilteredState = (tab, filter_state, filter_city) => {
    const r1 = new RegExp(filter_state, "gi");
    const r2 = new RegExp(filter_city, "gi");
    let result = [];
    if (tab === "NEAR") {
      for (let i = 0; i < rides.length; i++) {
        if (rides[i].state.match(r1) && rides[i].city.match(r2)) {
          result.push(rides[i]);
        }
      }
    } else if (tab === "FUTURE") {
      for (let i = 0; i < upcoming_rides.length; i++) {
        if (
          upcoming_rides[i].state.match(r1) &&
          upcoming_rides[i].city.match(r2)
        ) {
          result.push(upcoming_rides[i]);
        }
      }
    } else if (tab === "PAST") {
      for (let i = 0; i < past_rides.length; i++) {
        if (past_rides[i].state.match(r1) && past_rides[i].city.match(r2)) {
          result.push(past_rides[i]);
        }
      }
    }
    return result;
  };

  const getCities = (filter_state) => {
    let res = [];
    if (filter_state.trim() === "") {
      states.forEach((state) => {
        state.cities.forEach((city) => {
          res.push(city);
        });
      });
      return res;
    }
    const state = states.find((state) => {
      return state.state === filter_state;
    });
    if (state) {
      res = state.cities.map((city) => {
        return city;
      });
    }
    return res;
  };

  useEffect(() => {
    getRides();
    //eslint-disable-next-line
  }, []);
  return (
    <Fragment>
      <Navbar />
      <div className={styles.home_main}>
        {loading ? (
          <Loading />
        ) : (
          <Fragment>
            <div className={styles.tabbar_main}>
              <div>
                <button
                  className={
                    selected_tab === "NEAR"
                      ? styles.tab_btn + " " + styles.tab_selected
                      : styles.tab_btn
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTab("NEAR");
                  }}
                >
                  {" "}
                  Nearest Rides ({rides.length}){" "}
                </button>
                <button
                  className={
                    selected_tab === "FUTURE"
                      ? styles.tab_btn + " " + styles.tab_selected
                      : styles.tab_btn
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTab("FUTURE");
                  }}
                >
                  {" "}
                  Upcoming Rides ({upcoming_rides.length}){" "}
                </button>
                <button
                  className={
                    selected_tab === "PAST"
                      ? styles.tab_btn + " " + styles.tab_selected
                      : styles.tab_btn
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTab("PAST");
                  }}
                >
                  {" "}
                  Past Rides ({past_rides.length}){" "}
                </button>
              </div>
              <div className={styles.filter_btn_box}>
                {" "}
                <button
                  className={styles.tab_btn + " " + styles.filter_btn}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowFilter(!show_filter);
                  }}
                >
                  {" "}
                  <img src={sort} alt="sort" />
                  &nbsp; Filter{" "}
                </button>
                <div
                  className={styles.filter_box}
                  style={{ display: `${show_filter ? "flex" : "none"}` }}
                >
                  <select
                    value={filter_state}
                    className={styles.select}
                    onChange={(e) => {
                      setFilterState(e.target.value);
                    }}
                  >
                    <option value=""> State </option>
                    {states.map((state) => {
                      return (
                        <option value={state.state}> {state.state} </option>
                      );
                    })}
                    <option value=""> NONE </option>
                  </select>
                  <select
                    className={styles.select}
                    onChange={(e) => {
                      setFilterCity(e.target.value);
                    }}
                    value={filter_city}
                  >
                    <option value=""> City </option>
                    {getCities(filter_state).map((city) => {
                      return <option value={city}> {city} </option>;
                    })}
                    <option value={""}> NONE </option>
                  </select>
                </div>
              </div>
            </div>
            {getFilteredState(selected_tab, filter_state, filter_city).map(
              (obj) => {
                return <RideTab ride={obj} />;
              }
            )}
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

export default Home;
