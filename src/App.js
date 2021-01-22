import axios from "axios";
import React, { Component } from "react";
import Days from "./components/Days";
import Input from "./components/input";
import Prediction from "./components/prediction";

const cities = [
  { city: "mumbai", country: "in", displayName: "Mumbai, Maharashtra" },
  { city: "delhi", country: "in", displayName: "Delhi, New Delhi" },
  { city: "dehradun", country: "in", displayName: "Dehradun, Uttrakhand" },
  { city: "ahmedabad", country: "in", displayName: "Ahmedabad, Gujarat" },
  { city: "indore", country: "in", displayName: "Indore, MP" },
  { city: "amritsar", country: "in", displayName: "Amritsar, Punjab" },
  { city: "lahore", country: "pk", displayName: "Lahore, Pakistan" },
  { city: "karachi", country: "pk", displayName: "Karachi, Pakistan" },
  { city: "kabul", country: "af", displayName: "Kabul, Afghanistan" },
  { city: "tehran", country: "ir", displayName: "Tehran, Iran" },
  { city: "istanbul", country: "tr", displayName: "Istanbul, Turkey" },
];

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

  changeCurrent = (current) => {
    this.setState({ current });
  };

  get12Hours = (timestamp) => {
    const h = new Date(timestamp * 1000).getHours();
    if (h < 12) return `${h} AM`;
    else if (h === 12) return `12 PM`;
    else return `${h % 12} PM`;
  };

  setHours = (data) => {
    const { current, hourly, lat, lon } = data;
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

    // if (today.length < 24) {
    //   let len = today.length;
    //   while (len < 24) {
    //     today.unshift(25.0);
    //     len += 1;
    //   }
    // }

    // if (next.length < 24) {
    //   let len = next.length;
    //   while (len < 24) {
    //     next.push(25.0);
    //     len += 1;
    //   }
    // }

    this.setState({ days: { today, tomorrow, next } });
  };

  setDays = (data) => {
    const { current, daily, lat, lon } = data;

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

  componentDidMount() {
    const setPosition = (position) => {
      const { latitude, longitude } = position.coords;
      this.setState({ lat: latitude, lng: longitude }, async () => {
        const { lat, lng } = this.state;
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=2931c7a76e100f0f4f9ca58f62c24737`
        );
        const { data } = response;
        const { name, main, sys, weather, clouds } = data;
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

  onSearchClick = (el) => {
    console.log(el.city);
    this.setState({ search: el.displayName }, async () => {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${el.city}&units=metric&appid=2931c7a76e100f0f4f9ca58f62c24737`
      );
      const { data } = response;
      console.log(data);
      const { name, main, sys, weather, coord } = data;
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
    // console.log(weather);
    let data = [];
    if (current === 0) data = days.today;
    else if (current === 1) data = days.tomorrow;
    else data = days.next;
    // console.log(data);

    const label = data.dt.slice(0, 16);
    // console.log(label);

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
