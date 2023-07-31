import "./App.css";
import "./AppResponsive.css";
import React, { useState, useEffect } from "react";

/*weather icons*/
import {
  WiCelsius,
  WiRaindrop,
  WiHumidity,
  WiStrongWind,
  WiSmallCraftAdvisory,
  WiDirectionUp,
  WiDegrees,
  WiFahrenheit,
  WiDirectionUpRight,
  WiDirectionUpLeft,
  WiDirectionDownRight,
  WiDirectionRight,
  WiDirectionDown,
  WiDirectionLeft,
  WiDaySunny,
  WiDayCloudy,
  WiCloudy,
  WiDaySprinkle,
  WiDaySnow,
  WiDayFog,
  WiDayRain,
  WiDaySleet,
  WiDayThunderstorm,
  WiNightClear,
  WiNightCloudy,
  WiNightSprinkle,
  WiNightSnow,
  WiNightFog,
  WiNightSleet,
  WiNightThunderstorm,
  WiNightRain,
} from "weather-icons-react";

/*UI icons from feather */
import { Search, Book } from "react-feather";

/*charts from recharts*/
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

/*importing custom components*/
import HistoryCard from "./components/HistoryCard";

function App() {
  const apiKey = "611f5673b3a144d1bb2165643233107";

  //for setting if elements are visible or not
  const [searchVisible, setSearchVisible] = useState(true);

  //for storing api call data
  const [data, setData] = useState(null);
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [condition, setCondition] = useState("");
  const [temp, setTemp] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [hourlyTemp, setHourlyTemp] = useState(null);
  const [hourlyTempMet, setHourlyTempMet] = useState(null);
  const [hourlyTempImp, setHourlyTempImp] = useState(null);
  const [precipitation, setPrecipitation] = useState("");
  const [humidity, setHumidity] = useState("");
  const [visibility, setVisibility] = useState("");
  const [uv, setUV] = useState("");
  const [pressure, setPressure] = useState("");
  const [windDirection, setWindDirection] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [windDegree, setWindDegree] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");

  //for storing search bar contents
  const [searchTerm, setSearchTerm] = useState("");

  //for storing the search history
  const [searchHistory, setSearchHistory] = useState([]);
  const [index, setIndex] = useState(0);

  //unit switching between metric and imperial
  const [liquidUnit, setLiquidUnit] = useState("mm");
  const [degreesUnit, setDegreeUnit] = useState(
    <WiCelsius role="none"></WiCelsius>
  );
  const [speedUnit, setSpeedUnit] = useState("kph");
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [pressureUnit, setPressureUnit] = useState("mb");

  //dark mode toggling
  const [darkMode, setDarkMode] = useState(true);

  //icon sizing
  const [windDirectionIconSize, setWindDirectionIconSize] = useState(100);

  //error handling
  const [errMsg, setErrMsg] = useState("");

  //function to fetch from API
  const fetchWeather = (keyCity, days) => {
    //define weather API endpoint URL
    const apiURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${keyCity}&days=${days}`;

    if (keyCity != null && days != null) {
      //make API call using fetch
      fetch(apiURL)
        .then((response) => {
          if (!response.ok) {
            setErrMsg("location not found in database");
            throw new Error("Bad request");
          }
          return response.json();
        })
        .then((data) => setData(data))
        .then(setErrMsg(null))
        .catch((error) => console.log(errMsg));
    }
  };

  useEffect(() => {
    fetchWeather("guelph", 7);
  }, []);

  // Once data is available, set the state variables with destructuring
  useEffect(() => {
    if (data) {
      const {
        location: { name, region },
        current: {
          last_updated,
          condition: { text },
          temp_c,
          feelslike_c,
          humidity,
          vis_km,
          precip_mm,
          wind_dir,
          wind_kph,
          wind_degree,
          uv,
          pressure_mb,
        },
        forecast: {
          forecastday: {
            0: {
              hour,
              astro: { sunrise, sunset },
            },
          },
        },
      } = data;

      //extracting hourly temp data
      const tempData = [];
      const tempDataImp = [];
      for (let i = 0; i < 24; i++) {
        let hourShift = i + 1;
        tempData.push({
          hour: hourShift.toString(),
          temp: parseFloat(hour[i].temp_c),
        });
        tempDataImp.push({
          hour: hourShift.toString(),
          temp: parseFloat(hour[i].temp_f),
        });
      }

      setHourlyTempMet(tempData);
      setHourlyTempImp(tempDataImp);

      //update search history
      let tempSearchHistory = [...searchHistory]; // Create a new copy of the array

      //check for duplicates in search history
      const foundObject = tempSearchHistory.find((item) => {
        return item.city === name; // Add a return statement here
      });

      if (!foundObject) {
        tempSearchHistory.push({
          city: name,
          region: region,
          lastUpdated: last_updated,
          index: index,
        });
        setIndex(index + 1);
      }

      // Now update the state with the new search history
      setSearchHistory(tempSearchHistory);

      setHourlyTemp(tempData);
      setCity(name);
      setRegion(region);
      setLastUpdated(last_updated);
      setCondition(text);
      setTemp(temp_c);
      setFeelsLike(feelslike_c);
      setPrecipitation(precip_mm);
      setHumidity(humidity);
      setVisibility(vis_km);
      setWindDirection(wind_dir);
      setWindSpeed(wind_kph);
      setWindDegree(wind_degree);
      setUV(uv);
      setPressure(pressure_mb);
      setSunrise(sunrise);
      setSunset(sunset);
    }
  }, [data]);

  const changeToImperial = () => {
    setTemp(data.current.temp_f);
    setFeelsLike(data.current.feelslike_f);
    setPrecipitation(data.current.precip_in);
    setVisibility(data.current.vis_miles);
    setWindSpeed(data.current.wind_mph);
    setPressure(data.current.pressure_in);
    setSpeedUnit("mph");
    setDegreeUnit(<WiFahrenheit role="none"></WiFahrenheit>);
    setLiquidUnit("in");
    setDistanceUnit("miles");
    setPressureUnit("in");
    setHourlyTemp(hourlyTempImp);
  };

  const changeToMetric = () => {
    setTemp(data.current.temp_c);
    setFeelsLike(data.current.feelslike_c);
    setPrecipitation(data.current.precip_mm);
    setVisibility(data.current.vis_km);
    setWindSpeed(data.current.wind_kph);
    setPressure(data.current.pressure_mb);
    setSpeedUnit("kph");
    setDegreeUnit(<WiCelsius role="none"></WiCelsius>);
    setLiquidUnit("mm");
    setDistanceUnit("km");
    setPressureUnit("mb");
    setHourlyTemp(hourlyTempMet);
  };

  /*function to retrieve wind direction icons*/
  const getWindDirectionIcon = (windDirection) => {
    if (windDirection.includes("N") && windDirection.includes("E")) {
      return (
        <WiDirectionUpRight
          role="none"
          className="wind-icon"
          size={windDirectionIconSize}
        ></WiDirectionUpRight>
      );
    } else if (windDirection.includes("N") && windDirection.includes("W")) {
      return (
        <WiDirectionUpLeft
          role="none"
          className="wind-icon"
          size={windDirectionIconSize}
        ></WiDirectionUpLeft>
      );
    } else if (windDirection === "N") {
      return (
        <WiDirectionUp
          role="none"
          className="wind-icon"
          size={windDirectionIconSize}
        ></WiDirectionUp>
      );
    } else if (windDirection.includes("E") && windDirection.includes("S")) {
      return (
        <WiDirectionDownRight
          role="none"
          className="wind-icon"
          size={windDirectionIconSize}
        ></WiDirectionDownRight>
      );
    } else if (windDirection === "E") {
      return (
        <WiDirectionRight
          role="none"
          className="wind-icon"
          size={windDirectionIconSize}
        ></WiDirectionRight>
      );
    } else if (windDirection.includes("S") && windDirection.includes("W")) {
      return (
        <WiDirectionUpLeft
          role="none"
          className="wind-icon"
          size={windDirectionIconSize}
        ></WiDirectionUpLeft>
      );
    } else if (windDirection === "S") {
      return (
        <WiDirectionDown
          role="none"
          className="wind-icon"
          size={windDirectionIconSize}
        ></WiDirectionDown>
      );
    } else if (windDirection === "W") {
      return (
        <WiDirectionLeft
          role="none"
          className="wind-icon"
          size={windDirectionIconSize}
        ></WiDirectionLeft>
      );
    } else {
      return <p role="none">N/A</p>;
    }
  };

  //function to retrieve weather condition icon
  const getWeatherConditionIcon = (weatherCondition, time) => {
    weatherCondition = weatherCondition.toLowerCase();
    let hourStr = time.substring(11, 13);
    let hour = parseInt(hourStr);

    //above 19 hours is night
    if (hour > 6 && hour < 19) {
      if (weatherCondition === "sunny" || weatherCondition.includes("clear")) {
        return (
          <WiDaySunny
            role="none"
            className="condition-icon"
            size={56}
            color={darkMode ? "#fff" : "#000"}
          ></WiDaySunny>
        );
      } else if (weatherCondition.includes("thunder")) {
        return (
          <WiDayThunderstorm
            role="none"
            className="condition-icon"
            size={56}
            color={darkMode ? "#fff" : "#000"}
          ></WiDayThunderstorm>
        );
      } else if (weatherCondition === "partly cloudy") {
        return (
          <WiDayCloudy
            role="none"
            className="condition-icon"
            size={56}
            color={darkMode ? "#fff" : "#000"}
          ></WiDayCloudy>
        );
      } else if (
        weatherCondition === "cloudy" ||
        weatherCondition === "overcast"
      ) {
        return (
          <WiCloudy
            role="none"
            className="condition-icon"
            size={56}
            color={darkMode ? "#fff" : "#000"}
          ></WiCloudy>
        );
      } else if (
        weatherCondition === "Mist" ||
        weatherCondition.includes("drizzle")
      ) {
        return (
          <WiDaySprinkle
            role="none"
            className="condition-icon"
            size={56}
            color={darkMode ? "#fff" : "#000"}
          ></WiDaySprinkle>
        );
      } else if (weatherCondition.includes("rain")) {
        return (
          <WiDayRain
            role="none"
            className="condition-icon"
            size={56}
            color={darkMode ? "#fff" : "#000"}
          ></WiDayRain>
        );
      } else if (
        weatherCondition.includes("snow") ||
        weatherCondition.includes("blizzard")
      ) {
        <WiDaySnow
          role="none"
          className="condition-icon"
          size={56}
          color={darkMode ? "#fff" : "#000"}
        ></WiDaySnow>;
      } else if (weatherCondition.includes("sleet")) {
        <WiDaySleet
          role="none"
          className="condition-icon"
          size={56}
          color={darkMode ? "#fff" : "#000"}
        ></WiDaySleet>;
      } else if (
        weatherCondition.includes("fog") ||
        weatherCondition === "fog"
      ) {
        <WiDayFog
          role="none"
          className="condition-icon"
          size={56}
          color={darkMode ? "#fff" : "#000"}
        ></WiDayFog>;
      } else {
        return <p role="none">N/A</p>;
      }
    } else {
      if (weatherCondition === "clear") {
        return (
          <WiNightClear
            role="none"
            className="condition-icon"
            size={56}
            color={darkMode ? "#fff" : "#000"}
          ></WiNightClear>
        );
      } else if (weatherCondition.includes("thunder")) {
        return (
          <WiNightThunderstorm
            role="none"
            className="condition-icon"
            size={56}
            color={darkMode ? "#fff" : "#000"}
          ></WiNightThunderstorm>
        );
      } else if (weatherCondition === "partly cloudy") {
        return (
          <WiNightCloudy
            role="none"
            className="condition-icon"
            size={56}
            color={darkMode ? "#fff" : "#000"}
          ></WiNightCloudy>
        );
      } else if (
        weatherCondition === "cloudy" ||
        weatherCondition === "overcast"
      ) {
        return (
          <WiCloudy
            role="none"
            className="condition-icon"
            size={56}
            color={darkMode ? "#fff" : "#000"}
          ></WiCloudy>
        );
      } else if (
        weatherCondition === "Mist" ||
        weatherCondition.includes("drizzle")
      ) {
        return (
          <WiNightSprinkle
            role="none"
            className="condition-icon"
            size={56}
            color={darkMode ? "#fff" : "#000"}
          ></WiNightSprinkle>
        );
      } else if (weatherCondition.includes("rain")) {
        return (
          <WiNightRain
            role="none"
            className="condition-icon"
            size={56}
            color={darkMode ? "#fff" : "#000"}
          ></WiNightRain>
        );
      } else if (
        weatherCondition.includes("snow") ||
        weatherCondition.includes("blizzard")
      ) {
        <WiNightSnow
          role="none"
          className="condition-icon"
          size={56}
          color={darkMode ? "#fff" : "#000"}
        ></WiNightSnow>;
      } else if (weatherCondition.includes("sleet")) {
        <WiNightSleet
          role="none"
          className="condition-icon"
          size={56}
          color={darkMode ? "#fff" : "#000"}
        ></WiNightSleet>;
      } else if (
        weatherCondition.includes("fog") ||
        weatherCondition === "fog"
      ) {
        <WiNightFog
          role="none"
          className="condition-icon"
          size={56}
          color={darkMode ? "#fff" : "#000"}
        ></WiNightFog>;
      } else {
        return <p role="none">N/A</p>;
      }
    }

    return null;
  };

  //toggling visibility for the search history
  const toggleSearchHistory = () => {
    if (searchVisible === false) {
      setSearchVisible(true);
    } else {
      setSearchVisible(false);
    }
  };

  //toggling darkmode
  const toggleDarkMode = () => {
    if (darkMode === false) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  };

  /*percipitation data for radial bar chart*/
  let percipitationData = [
    {
      name: "percipitation",
      amount: precipitation,
      fill: "#80ed99",
    },
    {
      name: "percipitation",
      amount: 100,
      fill: "#fff",
    },
  ];

  /*humidity data for radial bar chart*/
  let humidityData = [
    {
      name: "humidity",
      amount: humidity,
      fill: "#f72585",
    },
    {
      name: "humidity",
      amount: 100,
      fill: "#fff",
    },
  ];

  return (
    <div className={`App ${darkMode ? "dark-d" : "light-d"}`}>
      <div className={`menu ${darkMode ? "dark-a" : "light-a"}`}>
        <div className="search-container">
          <div className="search-bar">
            <input
              aria-label="City Name Input Field"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="City name..."
              className="search-bar"
            />
          </div>
          <div
            tabIndex={0}
            role="button"
            aria-label="Search City Button"
            className={`search-button ${darkMode ? "dark-d" : "light-d"}`}
            onClick={() => {
              try {
                fetchWeather(searchTerm, 7);
              } catch (e) {}
            }}
          >
            <Search role="none" stroke="#fff" />
          </div>
          <div
            role="button"
            aria-label="Toggle Search History Visbility"
            className={`search-button search-history-button ${
              darkMode ? "dark-d" : "light-d"
            }`}
            onClick={() => toggleSearchHistory()}
          >
            <Book role="none" stroke="#fff" />
          </div>
        </div>
        {<p className="errorMessage">{errMsg}</p>}
        <div className="search-history-container">
          {searchVisible &&
            searchHistory.map((item, index) => (
              <HistoryCard
                key={index} // Make sure to provide a unique key for each item in the array
                city={item.city}
                region={item.region}
                lastUpdated={item.lastUpdated}
                darkMode={darkMode}
                onClick={() => {
                  fetchWeather(item.city, 7);
                  changeToMetric();
                }}
              />
            ))}
        </div>
        <div className="normal-search-history-container">
          {searchHistory.map((item, index) => (
            <HistoryCard
              key={index} // Make sure to provide a unique key for each item in the array
              city={item.city}
              region={item.region}
              lastUpdated={item.lastUpdated}
              darkMode={darkMode}
              onClick={() => {
                fetchWeather(item.city, 7);
                changeToMetric();
              }}
            />
          ))}
        </div>
        <div className="settings-container">
          <div
            tabIndex={0}
            role="button"
            aria-label="Toggle Dark Mode"
            className={`button dark-mode-button ${
              darkMode ? "dark-d" : "light-b"
            }`}
            onClick={() => toggleDarkMode()}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </div>
          <div
            tabIndex={0}
            role="button"
            aria-label="Change Unit System To Metric"
            className={`button metric-system-button ${
              darkMode ? "dark-d" : "light-b"
            }`}
            onClick={() => changeToMetric()}
          >
            M
          </div>
          <div
            tabIndex={0}
            role="button"
            aria-label="Change Unit System To Imperial"
            className={`button imperial-system-button ${
              darkMode ? "dark-d" : "light-b"
            }`}
            onClick={() => changeToImperial()}
          >
            I
          </div>
        </div>
      </div>
      <div className="data-container">
        <div className="today-forecast-container">
          <div className={`inner-container ${darkMode ? "dark-b" : "light-b"}`}>
            <div className="current-forecast-container">
              <div
                role="heading"
                aria-level="1"
                className="main-title-container"
              >
                <p
                  aria-label="contentinfo"
                  role="heading"
                  aria-level="1"
                  className="main-title"
                >
                  {city}, {region}
                </p>
                <p className="minor-data">last updated: {lastUpdated}</p>
              </div>
              <div className="weather-container">
                <div className="actual-weather-container">
                  {getWeatherConditionIcon(condition, lastUpdated)}
                  <div className="weather-text">
                    {temp}
                    {degreesUnit}
                  </div>
                  <p role="heading" aria-level="2" className="condition-text">
                    {condition}
                  </p>
                </div>

                <div className="feels-like-container">
                  <div className="feels-like-text">
                    feels like: {feelsLike}
                    {degreesUnit}
                  </div>
                </div>
              </div>
            </div>
            <div className="hourly-forecast-container">
              <div className="chart-container chart-375">
                <LineChart data={hourlyTemp} height={150} width={300}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#e4b61a"
                    activeDot={{ temp: 8 }}
                  />
                </LineChart>
              </div>
              <div className="chart-container chart-768">
                <LineChart data={hourlyTemp} height={200} width={500}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#e4b61a"
                    activeDot={{ temp: 8 }}
                  />
                </LineChart>
              </div>
              <div className="chart-container chart-1024">
                <LineChart data={hourlyTemp} height={200} width={500}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#e4b61a"
                    activeDot={{ temp: 8 }}
                  />
                </LineChart>
              </div>
              <div className="chart-container chart-1440">
                <LineChart data={hourlyTemp} height={200} width={700}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#e4b61a"
                    activeDot={{ temp: 8 }}
                  />
                </LineChart>
              </div>
              <div className="chart-container chart-2560">
                <LineChart data={hourlyTemp} height={200} width={1600}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#e4b61a"
                    activeDot={{ temp: 8 }}
                  />
                </LineChart>
              </div>
            </div>
          </div>
        </div>
        <div className="detailed-data-container">
          <div className="row top-row">
            <div className="precipitation-data-container">
              <div
                className={`inner-container ${darkMode ? "dark-b" : "light-b"}`}
              >
                <div className="data-text-container">
                  <div
                    role="heading"
                    aria-level="2"
                    className="title-container"
                  >
                    <WiRaindrop
                      role="none"
                      className="indicator-icon"
                    ></WiRaindrop>
                    <p role="heading" aria-level="2" className="title">
                      Percipitation
                    </p>
                  </div>
                  <div className="percipitation-amount-container">
                    <p className="main-amount-title">{precipitation}</p>
                    <p>{liquidUnit}</p>
                  </div>
                </div>
                <ResponsiveContainer className="radial-chart-container">
                  <RadialBarChart
                    innerRadius="80%"
                    outerRadius="50%"
                    barSize={20}
                    data={percipitationData}
                  >
                    <RadialBar
                      minAngle={15}
                      background
                      clockWise
                      dataKey="amount"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="humidity-data-container">
              <div
                className={`inner-container ${darkMode ? "dark-b" : "light-b"}`}
              >
                <div className="data-text-container">
                  <div
                    role="heading"
                    aria-level="2"
                    className="title-container"
                  >
                    <WiHumidity
                      role="none"
                      className="indicator-icon"
                    ></WiHumidity>
                    <p role="heading" aria-level="2" className="title">
                      Humidity
                    </p>
                  </div>
                  <div className="percipitation-amount-container">
                    <p className="main-amount-title">{humidity}</p>
                    <p>%</p>
                  </div>
                </div>
                <ResponsiveContainer className="radial-chart-container">
                  <RadialBarChart
                    innerRadius="80%"
                    outerRadius="50%"
                    barSize={20}
                    data={humidityData}
                  >
                    <RadialBar
                      minAngle={15}
                      background
                      clockWise
                      dataKey="amount"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="row bottom-row">
            <div className="wind-data-container">
              <div
                className={`inner-container ${darkMode ? "dark-b" : "light-b"}`}
              >
                <div className="data-text-container">
                  <div
                    role="heading"
                    aria-level="2"
                    className="title-container"
                  >
                    <WiStrongWind
                      role="none"
                      className="indicator-icon"
                    ></WiStrongWind>
                    <p role="heading" aria-level="2" className="title">
                      Wind
                    </p>
                  </div>
                  <div className="percipitation-amount-container">
                    <p className="main-amount-title">{windSpeed}</p>
                    <p>{speedUnit}</p>
                  </div>
                </div>
                <div className="wind-direction-container">
                  {getWindDirectionIcon(windDirection)}
                  <div className="text-degree-container">
                    {windDirection}, {windDegree}
                    <WiDegrees role="none" size={32}></WiDegrees>
                  </div>
                </div>
              </div>
            </div>
            <div className="other-data-container">
              <div
                className={`inner-container ${darkMode ? "dark-b" : "light-b"}`}
              >
                <div className="data-text-container">
                  <div
                    role="heading"
                    aria-level="2"
                    className="title-container"
                  >
                    <WiSmallCraftAdvisory
                      role="none"
                      className="indicator-icon"
                    ></WiSmallCraftAdvisory>
                    <p role="heading" aria-level="2" className="title">
                      Other Indexes
                    </p>
                  </div>
                  <div className="percipitation-amount-container"></div>
                </div>
                <div className="radial-chart-container">
                  <div className="index-container">
                    <p>UV</p>
                    <div className="index-indicator-container">
                      <p>{uv}</p>
                    </div>
                  </div>
                  <div className="double-index">
                    <div className="index-container">
                      <p>Visibility</p>
                      <div className="index-indicator-container">
                        <p>
                          {visibility} {distanceUnit}
                        </p>
                      </div>
                    </div>
                    <div className="index-container">
                      <p>Pressure</p>
                      <div className="index-indicator-container">
                        <p>
                          {pressure} {pressureUnit}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="double-index">
                    <div className="index-container">
                      <p>Sunrise</p>
                      <div className="index-indicator-container">
                        <p>{sunrise}</p>
                      </div>
                    </div>
                    <div className="index-container">
                      <p>Sunset</p>
                      <div className="index-indicator-container">
                        <p>{sunset}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
