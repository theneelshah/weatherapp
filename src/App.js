import axios from "axios";
import React, { Component } from "react";
import cities from "./assets/cities";
import Days from "./components/Days";
import Input from "./components/input";
import Prediction from "./components/prediction";

class App extends Component {
  state = {
    search: "",
    lat: 0,
    lng: 0,
    data: {
      weather: {},
      sun: { sunrise: "", sunset: "" },
      main: { pressure: "", humidity: "", temp: "" },
    },
    days: {
      today: { dt: [], temp: [] },
      tomorrow: { dt: [], temp: [] },
      next: { dt: [], temp: [] },
    },
    current: 0,
    dayWise: [],
    humidity: [],
    pressure: [],
    sun: [],
    temp: [],
    icon: [],
  };

  getDayName = (dayNum) => {
    var days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
    var dayName = days[dayNum];
    return dayName;
  };

  // to change current day
  changeCurrent = (current) => {
    this.setState({ current });
  };

  get12Hours = (timestamp) => {
    const h = new Date(timestamp * 1000).getHours();
    if (h < 12) return `${h} AM`;
    else if (h === 12) return `12 PM`;
    else return `${h % 12} PM`;
  };

  // assign particular day the 48 hours (today, tomorrow, next days)
  setHours = (data) => {
    const { hourly } = data;
    let today = { dt: [], temp: [] },
      tomorrow = { dt: [], temp: [] },
      next = { dt: [], temp: [] };
    let c = new Date(hourly[0].dt * 1000).getDay();

    for (let i = 0; i < hourly.length; i += 1) {
      const d = new Date(hourly[i].dt * 1000);
      const day = d.getDay();
      if (c === day) {
        today.temp.push(Math.round(hourly[i].temp));
        today.dt.push(this.get12Hours(hourly[i].dt));
      } else if (day === (c + 1) % 7) {
        tomorrow.temp.push(Math.round(hourly[i].temp));
        tomorrow.dt.push(this.get12Hours(hourly[i].dt));
      } else {
        next.temp.push(Math.round(hourly[i].temp));
        next.dt.push(this.get12Hours(hourly[i].dt));
      }
    }

    this.setState({ days: { today, tomorrow, next } });
  };

  // set the data for each days
  setDays = (data) => {
    const { daily } = data;

    const dayWise = [];

    let humidity = [],
      pressure = [],
      temperature = [],
      icon = [],
      sun = [];

    for (let i = 0; i < 7; i += 1) {
      humidity.push(daily[i].humidity);
      pressure.push(daily[i].pressure);
      temperature.push(daily[i].temp.day);
      icon.push(daily[i].weather[0].icon);
      sun.push({ sunrise: daily[i].sunrise, sunset: daily[i].sunset });

      const { dt, temp, weather } = daily[i];
      const dayNum = new Date(dt * 1000).getDay();
      const dayName = this.getDayName(dayNum);

      const t = {
        day: dayName,
        temp: { min: temp.min, max: temp.max },
        weather: weather[0],
      };
      dayWise.push(t);
    }
    this.setState({
      dayWise,
      humidity,
      pressure,
      temp: temperature,
      icon,
      sun,
    });
  };

  // get weather based on current lat and lnf
  componentDidMount() {
    const setPosition = (position) => {
      const { latitude, longitude } = position.coords;
      this.setState({ lat: latitude, lng: longitude }, async () => {
        const { lat, lng } = this.state;
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=2931c7a76e100f0f4f9ca58f62c24737`
        );
        const { data } = response;
        const { name, main, sys, weather } = data;
        this.setState(
          {
            search: name,
            data: {
              weather: weather[0],
              sun: {
                sunrise: sys.sunrise,
                sunset: sys.sunset,
              },
              main: {
                pressure: main.pressure,
                humidity: main.humidity,
                temp: main.temp,
              },
            },
          },
          async () => {
            const { lat, lng } = this.state;

            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&exclude=minutely&appid=2931c7a76e100f0f4f9ca58f62c24737`
            );
            const { data } = response;
            this.setHours(data);
            this.setDays(data);
          }
        );
      });
    };

    navigator.geolocation.getCurrentPosition(setPosition);
  }

  onChange = (search) => {
    this.setState({ search });
  };

  // get weather  based on searched city
  onSearchClick = (el) => {
    console.log(el.city);
    this.setState({ search: el.displayName }, async () => {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${el.city}&units=metric&appid=2931c7a76e100f0f4f9ca58f62c24737`
      );
      const { data } = response;
      console.log(data);
      const { main, sys, weather, coord } = data;
      const { lat, lon } = coord;
      this.setState(
        {
          lat,
          lng: lon,
          data: {
            weather: weather[0],
            sun: {
              sunrise: sys.sunrise,
              sunset: sys.sunset,
            },
            main: {
              pressure: main.pressure,
              humidity: main.humidity,
              temp: main.temp,
            },
          },
        },
        async () => {
          const { lat, lng } = this.state;

          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&exclude=minutely&appid=2931c7a76e100f0f4f9ca58f62c24737`
          );
          const { data } = response;
          this.setHours(data);
          this.setDays(data);
        }
      );
    });
  };

  render() {
    const {
      search,
      days,
      current,
      dayWise,
      humidity,
      pressure,
      temp,
      icon,
      sun,
    } = this.state;
    const mainIcon = this.state.data.weather.icon;

    let data = [];
    if (current === 0) data = days.today;
    else if (current === 1) data = days.tomorrow;
    else data = days.next;
    const label = data.dt.slice(0, 24);

    return (
      <div className="App">
        <Input
          search={search}
          onSearchChange={this.onChange}
          cities={cities}
          onSearchClick={this.onSearchClick}
        />

        <Days
          days={dayWise}
          currentSelected={current}
          changeCurrent={this.changeCurrent}
        />

        <Prediction
          mainIcon={mainIcon}
          sun={sun}
          temp={temp}
          icon={icon}
          humidity={humidity}
          pressure={pressure}
          days={days}
          current={current}
          data={data}
          label={label}
        />
      </div>
    );
  }
}

export default App;
