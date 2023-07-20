import "./App.css";
import "./AppResponsive.css";
import React, { useState, useEffect } from "react";

/*weather icons*/
import {
  WiDaySunny,
  WiCelsius,
  WiRaindrop,
  WiHumidity,
  WiStrongWind,
  WiSmallCraftAdvisory,
  WiDirectionUp,
  WiDegrees,
  WiFahrenheit,
} from "weather-icons-react";

/*UI icons from feather */
import { Search } from "react-feather";

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
  const apiKey = "c4a76c95b19b477ab47215455231807";

  //for storing api call data
  const [data, setData] = useState(null);
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [condition, setCondition] = useState("");
  const [temp, setTemp] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [hourlyTemp, setHourlyTemp] = useState(null);
  const [precipitation, setPrecipitation] = useState("");
  const [humidity, setHumidity] = useState("");
  const [visibility, setVisibility] = useState("");
  const [uv, setUV] = useState("");
  const [pressure, setPressure] = useState("");
  const [windDirection, setWindDirection] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [windDegree, setWindDegree] = useState("");

  //for storing search bar contents
  const [searchTerm, setSearchTerm] = useState("");

  //for storing the search history
  const [searchHistory, setSearchHistory] = useState([]);
  const [index, setIndex] = useState(0);

  //unit switching between metric and imperial
  const [liquidUnit, setLiquidUnit] = useState("mm");
  const [degreesUnit, setDegreeUnit] = useState(<WiCelsius></WiCelsius>);
  const [speedUnit, setSpeedUnit] = useState("kph");
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [pressureUnit, setPressureUnit] = useState("mb");

  //function to fetch from API
  const fetchWeather = (keyCity, days) => {
    //define weather API endpoint URL
    const apiURL = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${keyCity}&days=${days}`;

    if (keyCity != null && days != null) {
      //make API call using fetch
      fetch(apiURL)
        .then((response) => response.json())
        .then((data) => setData(data))
        .then(console.log("fetch"))
        .catch((error) => console.log("Error fetching data: " + error));
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
            0: { hour },
          },
        },
      } = data;

      //extracting hourly temp data
      const tempData = [];
      for (let i = 0; i < 24; i++) {
        let hourShift = i + 1;
        tempData.push({
          hour: hourShift.toString(),
          temp: parseFloat(hour[i].temp_c),
        });
      }

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
    }
  }, [data]);

  console.log(data);

  const changeToImperial = () => {
    setTemp(data.current.temp_f);
    setFeelsLike(data.current.feelslike_f);
    setPrecipitation(data.current.precip_in);
    setVisibility(data.current.vis_miles);
    setWindSpeed(data.current.wind_mph);
    setPressure(data.current.pressure_in);
    setSpeedUnit("mph");
    setDegreeUnit(<WiFahrenheit></WiFahrenheit>);
    setLiquidUnit("in");
    setDistanceUnit("miles");
    setPressureUnit("in");
  };

  const changeToMetric = () => {
    setTemp(data.current.temp_c);
    setFeelsLike(data.current.feelslike_c);
    setPrecipitation(data.current.precip_mm);
    setVisibility(data.current.vis_km);
    setWindSpeed(data.current.wind_kph);
    setPressure(data.current.pressure_mb);
    setSpeedUnit("kph");
    setDegreeUnit(<WiCelsius></WiCelsius>);
    setLiquidUnit("mm");
    setDistanceUnit("km");
    setPressureUnit("mb");
  };

  /*percipitation data for radial bar chart*/
  let percipitationData = [
    {
      name: "percipitation",
      amount: 75,
      fill: "#010",
    },
    {
      name: "snow",
      amount: precipitation,
      fill: "#82ca9d",
    },
  ];

  /*humidity data for radial bar chart*/
  let humidityData = [
    {
      name: "percipitation",
      amount: 75,
      fill: "#010",
    },
    {
      name: "snow",
      amount: humidity,
      fill: "#82ca9d",
    },
  ];

  return (
    <div className="App">
      <div className="menu">
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="City name..."
            />
          </div>
          <div
            className="search-button"
            onClick={() => fetchWeather(searchTerm, 7)}
          >
            <Search stroke="#fff" />
          </div>
        </div>
        <div className="search-history-container">
          {searchHistory.map((item, index) => (
            <HistoryCard
              key={index} // Make sure to provide a unique key for each item in the array
              city={item.city}
              region={item.region}
              lastUpdated={item.lastUpdated}
              onClick={() => fetchWeather(item.city, 7)}
            />
          ))}
        </div>
        <div className="settings-container">
          <div className="button dark-mode-button">Dark Mode</div>
          <div
            className="button metric-system-button"
            onClick={() => changeToMetric()}
          >
            M
          </div>
          <div
            className=" button imperial-system-button"
            onClick={() => changeToImperial()}
          >
            I
          </div>
        </div>
      </div>
      <div className="data-container">
        <div className="today-forecast-container">
          <div className="inner-container">
            <div className="current-forecast-container">
              <div className="main-title-container">
                <p className="main-title">
                  {city}, {region}
                </p>
                <p className="minor-data">last updated: {lastUpdated}</p>
              </div>
              <div className="weather-container">
                <div className="actual-weather-container">
                  <WiDaySunny size={24} color="#000"></WiDaySunny>
                  <p>{temp}</p>
                  {degreesUnit}
                </div>
                <div className="feels-like-container">
                  <p>FEELS LIKE</p>
                  <p>{feelsLike}</p>
                  {degreesUnit}
                </div>
              </div>
              <div className="weather-type-container">
                <p>{condition}</p>
              </div>
            </div>
            <div className="hourly-forecast-container">
              <ResponsiveContainer>
                <LineChart data={hourlyTemp}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#000"
                    activeDot={{ temp: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="detailed-data-container">
          <div className="row top-row">
            <div className="precipitation-data-container">
              <div className="inner-container">
                <div className="data-text-container">
                  <div className="title-container">
                    <WiRaindrop></WiRaindrop>
                    <p className="title">Percipitation</p>
                  </div>
                  <div className="percipitation-amount-container">
                    <p className="main-amount-title">{precipitation}</p>
                    <p>{liquidUnit}</p>
                  </div>
                </div>
                <ResponsiveContainer className="radial-chart-container">
                  <RadialBarChart
                    innerRadius="50%"
                    outerRadius="80%"
                    barSize={20}
                    data={percipitationData}
                  >
                    <RadialBar
                      minAngle={15}
                      label={{ position: "insideStart", fill: "#010" }}
                      background
                      clockWise
                      dataKey="amount"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="humidity-data-container">
              <div className="inner-container">
                <div className="data-text-container">
                  <div className="title-container">
                    <WiHumidity></WiHumidity>
                    <p className="title">Humidity</p>
                  </div>
                  <div className="percipitation-amount-container">
                    <p className="main-amount-title">{humidity}</p>
                    <p>%</p>
                  </div>
                </div>
                <ResponsiveContainer className="radial-chart-container">
                  <RadialBarChart
                    innerRadius="50%"
                    outerRadius="80%"
                    barSize={20}
                    data={humidityData}
                  >
                    <RadialBar
                      minAngle={15}
                      label={{ position: "insideStart", fill: "#010" }}
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
              <div className="inner-container">
                <div className="data-text-container">
                  <div className="title-container">
                    <WiStrongWind></WiStrongWind>
                    <p className="title">Wind</p>
                  </div>
                  <div className="percipitation-amount-container">
                    <p className="main-amount-title">{windSpeed}</p>
                    <p>{speedUnit}</p>
                  </div>
                </div>
                <div className="radial-chart-container">
                  <WiDirectionUp></WiDirectionUp>
                  <p>
                    {windDirection}, {windDegree}
                    <WiDegrees></WiDegrees>
                  </p>
                </div>
              </div>
            </div>
            <div className="other-data-container">
              <div className="inner-container">
                <div className="data-text-container">
                  <div className="title-container">
                    <WiSmallCraftAdvisory></WiSmallCraftAdvisory>
                    <p className="title">Other Indexes</p>
                  </div>
                  <div className="percipitation-amount-container">
                    <p className="main-amount-title">9</p>
                    <p>{liquidUnit}</p>
                  </div>
                </div>
                <div className="radial-chart-container">
                  <div className="index-container">
                    <p>UV</p>
                    <div className="index-indicator-container">
                      <p>{uv}</p>
                    </div>
                  </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
