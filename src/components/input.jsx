import React, { Component } from "react";
import styled from "styled-components";
import Pin from "../assets/pin.png";
import Search from "../assets/search.png";
import Suggestions from "./suggestions";

const Input = styled.div`
  box-sizing: border-box;

  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 10px auto;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;

  transition: all 0.15s ease-in;

  &:hover {
    box-shadow: 0px 0px 7px 2px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 25px;
    height: 25px;
  }
  @media only screen and (max-width: 720px) {
    padding: 8px 12px;
    img {
      width: 17px;
      height: 17px;
    }
  }
`;

const I = styled.input`
  flex: 1;
  margin: 5px 10px;
  font-size: 20px;
  border: none;
  outline: none;
  @media only screen and (max-width: 720px) {
    margin: 3px 7px;
    font-size: 17px;
  }
`;

class Inp extends Component {
  state = { focus: false };

  focusSearchBox = () => {
    this.searchBox.focus();
  };

  render() {
    const { search, onSearchChange, cities, onSearchClick } = this.props;
    const { focus } = this.state;
    return (
      <div style={{ position: "relative" }}>
        <Input onClick={this.focusSearchBox}>
          <img src={Pin} alt="" srcset="" />
          <I
            type="text"
            value={search}
            ref={(search) => (this.searchBox = search)}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <img src={Search} alt="" srcset="" />
        </Input>
        <Suggestions
          cities={cities}
          search={search}
          onSearchClick={onSearchClick}
        />
      </div>
    );
  }
}

export default Inp;
