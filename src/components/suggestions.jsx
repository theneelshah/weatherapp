import axios from "axios";
import React, { Component } from "react";
import { BeatLoader } from "react-spinners";
import styled from "styled-components";

const Cities = styled.div`
  box-sizing: border-box;
  position: absolute;
  z-index: 2;
  top: 100%;
  width: 100%;
  background: white;
  /* box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2); */
  border-radius: 5px;
`;

const C = styled.div`
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  cursor: pointer;
  border: 1px solid #e3e3e3;
  padding: 10px;

  &:nth-child(1) {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  &:nth-last-child(1) {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  p {
    margin: 0;
  }

  .name,
  .main-separation {
    flex: 1;
  }

  .name {
    display: flex;
    align-items: center;
    p {
      text-transform: capitalize;
      span {
        font-weight: bold;
      }
    }
  }

  .main-separation {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    div {
      text-align: center;
      .temp {
        font-size: 20px;
        font-weight: bold;
      }
      .desc {
        font-size: 15px;
        text-transform: capitalize;
      }
    }

    .icon {
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  @media only screen and (max-width: 991px) {
    padding: 10px 20px;

    .main-separation {
      div {
        text-align: right;

        .temp {
          font-size: 15px;
        }
        .desc {
          font-size: 12px;
        }
      }
      .icon {
        width: 65px;
        height: 65px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
`;
class City extends Component {
  state = { icon: "", temp: "", desc: "" };

  async componentDidMount() {
    const { el } = this.props;
    const { city } = el;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=2931c7a76e100f0f4f9ca58f62c24737`
    );
    const { temp } = response.data.main;
    const { description, icon } = response.data.weather[0];
    this.setState({ temp, desc: description, icon });
  }

  render() {
    const { el, onSearchClick, text, span } = this.props;
    const { temp, desc, icon } = this.state;
    console.log(temp);

    return (
      <C
        onClick={() => {
          onSearchClick(el);
        }}
      >
        <div className="name">
          <p>
            <span>{span}</span>
            {text}
          </p>
        </div>

        <div className="main-separation">
          <div>
            <p className="temp">
              {temp || desc ? (
                `${temp}°C`
              ) : (
                <BeatLoader color="#8f8f8f" size={7} />
              )}
            </p>
            <p className="desc">{desc}</p>
          </div>

          <div className="icon">
            {icon ? (
              <img
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt=""
              />
            ) : (
              <BeatLoader color="#8f8f8f" size={10} />
            )}
          </div>
        </div>
      </C>
    );
  }
}

export default class Suggestions extends Component {
  getCityData = () => {};

  render() {
    const { cities, search, onSearchClick } = this.props;
    return (
      <Cities>
        {cities.map((el, i) => {
          if (el.displayName.toLowerCase() === search.toLowerCase())
            return <></>;
          if (
            el.displayName.toLowerCase().startsWith(search.toLowerCase()) &&
            search !== ""
          ) {
            const span = search;
            const rest = el.displayName
              .toLowerCase()
              .replace(search.toLowerCase(), ``);

            return (
              <City
                el={el}
                i={i}
                key={i}
                onSearchClick={onSearchClick}
                span={span}
                text={rest}
              />
            );
          }
        })}
      </Cities>
    );
  }
}
