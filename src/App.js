import "./App.css";
import React, { useState, useEffect, PureComponent } from "react";

/*weather icons*/
import { WiDaySunny, WiCelsius, WiRaindrop } from "weather-icons-react";

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
  const city = "guelph";
  const days = 3;

  useEffect(() => {
    //define weather API endpoint URL
    const apiURL = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}`;

    //make API call using fetch
    // fetch(apiURL)
    //   .then((response) => response.json())
    //   .then((data) => setData(data))
    //   .then(console.log(data))
    //   .catch((error) => console.log("Error fetching data: " + error));
  }, []);

  //data for the hourly weather chart
  const hourlyData = [
    {
      hour: "1",
      temp: 4,
    },
    {
      hour: "2",
      temp: 6,
    },
    {
      hour: "3",
      temp: 8,
    },
    {
      hour: "4",
      temp: 9,
    },
    {
      hour: "5",
      temp: 14,
    },
    {
      hour: "6",
      temp: 18,
    },
    {
      hour: "7",
      temp: 22,
    },
    {
      hour: "8",
      temp: 21,
    },
    {
      hour: "9",
      temp: 15,
    },
    {
      hour: "10",
      temp: 12,
    },
    {
      hour: "11",
      temp: 9,
    },
    {
      hour: "12",
      temp: 4,
    },
  ];

  /*percipitation data for radial bar chart*/
  const percipitationData = [
    {
      name: "percipitation",
      amount: 75,
      fill: "#010",
    },
    {
      name: "snow",
      amount: 25,
      fill: "#82ca9d",
    },
  ];

  return (
    <div className="App">
      <div className="menu">Menu</div>
      <div className="data-container">
        <div className="today-forecast-container">
          <div className="inner-container">
            <div className="current-forecast-container">
              <div className="main-title-container">
                <p className="main-title">Guelph, Ontario</p>
                <p className="minor-data">last updated: 2023-07-18 22:15</p>
              </div>
              <div className="weather-container">
                <div className="actual-weather-container">
                  <WiDaySunny size={24} color="#000"></WiDaySunny>
                  <p>24</p>
                  <WiCelsius size={24} color="#000"></WiCelsius>
                </div>
                <div className="feels-like-container">
                  <p>FEELS LIKE</p>
                  <p>18</p>
                  <WiCelsius></WiCelsius>
                </div>
              </div>
              <div className="weather-type-container">
                <p>SUNNY</p>
              </div>
            </div>
            <div className="hourly-forecast-container">
              <ResponsiveContainer>
                <LineChart
                  width={500}
                  height={300}
                  data={hourlyData}
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
                    <p className="main-amount-title">9</p>
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
                    <WiRaindrop></WiRaindrop>
                    <p className="title">Humidity</p>
                  </div>
                  <div className="percipitation-amount-container">
                    <p className="main-amount-title">9</p>
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
          </div>
          <div className="row bottom-row">
            <div className="wind-data-container">
              <div className="inner-container">
                <div className="data-text-container">
                  <div className="title-container">
                    <WiRaindrop></WiRaindrop>
                    <p className="title">Wind</p>
                  </div>
                  <div className="percipitation-amount-container">
                    <p className="main-amount-title">9</p>
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
            <div className="other-data-container">
              <div className="inner-container">
                <div className="data-text-container">
                  <div className="title-container">
                    <WiRaindrop></WiRaindrop>
                    <p className="title">Other Indexes</p>
                  </div>
                  <div className="percipitation-amount-container">
                    <p className="main-amount-title">9</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
