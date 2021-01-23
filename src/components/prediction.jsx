import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { BeatLoader } from "react-spinners";
import styled from "styled-components";

Chart.plugins.unregister(ChartDataLabels);

const Card = styled.div`
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.2);

  .time {
    display: flex;
    justify-content: space-between;

    div {
      p:nth-of-type(1) {
        font-size: 20px;
        font-weight: 600;
      }
      p:nth-of-type(2) {
        font-size: 17px;
      }
    }

    p {
      margin: 0;
    }
  }

  @media only screen and (max-width: 720px) {
    .time {
      div {
        p:nth-of-type(1) {
          font-size: 15px;
        }
        p:nth-of-type(2) {
          font-size: 13px;
        }
      }

      p {
        margin: 0;
      }
    }
  }
`;

const Current = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  .temp {
    font-size: 55px;
    font-weight: bold;
  }
  .icon {
    margin: 0 20px;
    img {
      width: 100px;
      height: 100px;
    }
  }
  @media only screen and (max-width: 720px) {
    .temp {
      font-size: 30px;
    }
    .icon {
      img {
        width: 70px;
        height: 70px;
      }
    }
  }
`;

const Other = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  .single {
    background: #e3e3e3;
    border-radius: 5px;
    padding: 3% 20% 3% 3%;
    p {
      margin: 0;
    }
    p:nth-of-type(1) {
      font-size: 20px;
      font-weight: 800;
    }
    p:nth-of-type(2) {
      font-size: 17px;
      font-weight: 500;
    }
  }
  @media only screen and (max-width: 720px) {
    .single {
      p:nth-of-type(1) {
        font-size: 15px;
      }
      p:nth-of-type(2) {
        font-size: 12px;
      }
    }
  }
`;

export default class Prediction extends Component {
  state = { windowWidth: window.innerWidth };

  get12Hours = (timestamp) => {
    const h = new Date(timestamp * 1000).getHours();
    const m = new Date(timestamp * 1000).getMinutes();
    if (h < 12) return `${h}:${m} AM`;
    else if (h === 12) return `12 PM`;
    else return `${h % 12}:${m} PM`;
  };

  componentDidMount() {
    window.addEventListener("resize", (e) => {
      this.setState({ windowWidth: window.innerWidth });
    });
  }

  render() {
    const {
      humidity,
      pressure,
      current,
      temp,
      icon,
      mainIcon,
      sun,
    } = this.props;
    const { data, label } = this.props;

    // setting values
    let sunRiseTime, sunSetTime, sunrise, sunset;
    if (sun.length > 0) {
      sunrise = sun[current].sunrise;
      sunset = sun[current].sunset;
      sunRiseTime = this.get12Hours(sunrise);
      sunSetTime = this.get12Hours(sunset);
    }
    const labels = ["6AM", `${sunRiseTime}`, "1PM", `${sunSetTime}`, "8PM"];
    const dataSun = [-2, 0, 10, 0, -2];

    // making graphs responsive for mobile
    const { windowWidth } = this.state;
    const height = windowWidth < 1200 ? (windowWidth < 720 ? 225 : 200) : 125;
    const fontSize = windowWidth < 720 ? 10 : 15;
    const padding = windowWidth < 720 ? 1 : 30;
    const sunHeight = windowWidth < 720 ? 140 : 70;

    return (
      <Card>
        <Current>
          <div className="temp">
            {temp[current] ? (
              `${Math.round(temp[current])}°C`
            ) : (
              <BeatLoader color="#8f8f8f" />
            )}
          </div>

          <div className="icon">
            {mainIcon && current === 0 ? (
              <img
                src={`https://openweathermap.org/img/wn/${mainIcon}@2x.png`}
                alt="weather-icon"
              />
            ) : (
              <img
                src={`https://openweathermap.org/img/wn/${icon[current]}@2x.png`}
                alt="weather-icon"
              />
            )}
          </div>
        </Current>

        <Line
          height={height}
          width={400}
          id="canvas"
          plugins={[ChartDataLabels]}
          data={{
            labels: label,
            datasets: [
              {
                label: "",
                data: data.temp,
                backgroundColor: "rgba(0, 140, 255, 0.2)",
                borderWidth: 2,
                borderColor: "#2196f3",
                borderCapStyle: "round",
                pointBackgroundColor: "white",
                pointHitRadius: 2,
              },
            ],
          }}
          options={{
            scales: {
              xAxes: [
                {
                  gridLines: {
                    color: "#e3e3e3",
                  },
                  ticks: {
                    fontSize: fontSize,
                    padding: padding,
                  },
                },
              ],
              yAxes: [
                {
                  display: false,
                  gridLines: {
                    display: false,
                    color: "#ffffff",
                  },
                },
              ],
            },
            plugins: {
              datalabels: {
                backgroundColor: "#2196f3",
                borderColor: "#2196f3",
                borderRadius: 100,
                borderWidth: 3,
                color: "white",
                font: {
                  size: fontSize + 2,
                  weight: "bold",
                },
                padding: 0,
                anchor: "end",
                textAlign: "center",
              },
            },
          }}
        />

        <Other>
          <div className="single">
            <p>Pressure</p>
            <p>{pressure[current]} hpa</p>
          </div>
          <div className="single">
            <p>Humidity</p>
            <p>{humidity[current]}%</p>
          </div>
        </Other>

        {sun && (
          <div>
            <div className="time">
              <div>
                <p>Sunrise</p>
                <p>{sunRiseTime || <BeatLoader color="#8f8f8f" size={10} />}</p>
              </div>

              <div>
                <p>Sunset</p>
                <p>{sunSetTime || <BeatLoader color="#8f8f8f" size={10} />}</p>
              </div>
            </div>

            <Line
              plugins={[]}
              height={sunHeight}
              data={{
                labels: labels,
                datasets: [
                  {
                    label: "",
                    data: dataSun,
                    backgroundColor: "rgba(255, 243, 37, 0.2)",
                    // fill: false,
                    borderColor: "yellow",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                tooltips: { enabled: false },
                hover: { mode: null },
                scales: {
                  xAxes: [
                    {
                      gridLines: {
                        display: false,
                        color: "#ffffff",
                      },
                    },
                  ],
                  yAxes: [
                    {
                      display: false,

                      gridLines: {
                        display: false,
                        color: "#ffffff",
                      },
                    },
                  ],
                },
              }}
            />
          </div>
        )}
      </Card>
    );
  }
}
