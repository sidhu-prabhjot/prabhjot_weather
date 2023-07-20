import "./App.css";
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
            <Search size={24} stroke="#fff" />
          </div>
        </div>
        <div className="search-results-container">Results</div>
        <div className="settings-container">settings</div>
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
                  <WiCelsius size={24} color="#000"></WiCelsius>
                </div>
                <div className="feels-like-container">
                  <p>FEELS LIKE</p>
                  <p>{feelsLike}</p>
                  <WiCelsius></WiCelsius>
                </div>
              </div>
              <div className="weather-type-container">
                <p>{condition}</p>
              </div>
            </div>
            <div className="hourly-forecast-container">
              <ResponsiveContainer>
                <LineChart
                  width={500}
                  height={300}
                  data={hourlyTemp}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
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
                    <p>mm</p>
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
                    <p>kph</p>
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
                    <p>mm</p>
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
                      <p>{visibility} km</p>
                    </div>
                  </div>
                  <div className="index-container">
                    <p>Pressure</p>
                    <div className="index-indicator-container">
                      <p>{pressure} mb</p>
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
