import React, { Component } from "react";
import { BeatLoader } from "react-spinners";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  overflow: auto;
  margin: 25px 0;
  .holder {
    display: flex;
    justify-content: space-between;
    padding: 2px;
  }
  @media only screen and (max-width: 991px) {
    .holder {
      width: 125%;
    }
  }
  @media only screen and (max-width: 720px) {
    .holder {
      width: 150%;
    }
  }
`;

const Day = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* width: 100%; */
  text-align: center;
  padding: 20px;
  border: 3px solid transparent;

  cursor: pointer;
  .day {
    font-size: 25px;
    font-weight: bold;
  }
  .max,
  .min {
    font-size: 20px;
  }
  .max {
    font-weight: bold;
  }
  div {
    display: flex;
    justify-content: space-around;
  }
  p {
    margin: 0;
  }
  img {
    width: 75%;
    height: auto;
  }
  .desc {
    text-transform: capitalize;
    text-align: center;
  }
  &.current {
    border: 3px solid blue;
    background: #fffeed;
  }

  &:hover {
    background: #fcfcfc;
  }

  @media only screen and (max-width: 991px) {
    .day {
      font-size: 20px;
    }
    .max,
    .min {
      font-size: 15px;
    }
  }

  @media only screen and (max-width: 720px) {
    padding: 10px;

    .day {
      font-size: 17px;
    }
    .max,
    .min {
      font-size: 12px;
    }
    img {
      width: 75%;
      height: auto;
    }
  }
`;

export default class Days extends Component {
  render() {
    const { days, currentSelected, changeCurrent } = this.props;

    return (
      <Wrapper>
        <div className="holder">
          {days.length > 0 ? (
            days.map((el, id) => {
              return (
                <Day
                  key={id}
                  className={id === currentSelected ? "current" : ""}
                  onClick={(e) => changeCurrent(id)}
                >
                  <p className="day">{el.day}</p>
                  <div>
                    <p className="max">{Math.round(el.temp.max)}°</p>
                    <p className="min">{Math.round(el.temp.min)}°</p>
                  </div>
                  <img
                    src={`https://openweathermap.org/img/wn/${el.weather.icon}@2x.png`}
                    alt=""
                  />
                  <p className="desc">{el.weather.description}</p>
                </Day>
              );
            })
          ) : (
            <div
              style={{
                height: "150px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BeatLoader />
            </div>
          )}
        </div>
      </Wrapper>
    );
  }
}
