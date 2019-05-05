import React from 'react';
import { ComposedChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, BarChart } from 'recharts';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    // initialize our state 
    this.state = {
      data: [],
      graphData: [],
      lastEntry: {},
      intervalIsSet: false,
    };
  }


  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has 
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // our first get method that uses our backend api to 
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("http://192.168.1.138:3000/data")
      .then(data => data.json())
      .then(res => {
        this.setState({ data: res , lastEntry: res[0], graphData: res.splice(0, 5)});
      }).catch(function() {
        console.log("error");
      });
  };

  render() {
    const { data } = this.state;
    const { graphData } = this.state;
    const {lastEntry} = this.state;
    const renderTemperatureChart = (
      <BarChart
        width={500}
        height={300}
        data={graphData}
        margin={{
          top: 30, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="time" />
        <YAxis interval={0}/>
        <Tooltip />
        <Legend />
        <Bar dataKey="temperature" fill="#8884d8" />
        <Bar dataKey="humidity" fill="#82ca9d" />
      </BarChart>      
    );
    return (
      <div>
        {renderTemperatureChart}
        <h1>Total number of data: {data.length}</h1>
        <h1>Last entry: {lastEntry.temperature}°C </h1>
        <ul>
          {data.length <= 0
            ? "NO DB ENTRIES YET"
            : data.map(dat => (
              <li style={{ padding: "10px" }} key={data.message}>
                <span style={{ color: "gray" }}> id: </span> 
                {dat._id} <br />
                <span style={{ color: "gray" }}> Temperature: </span>
                {dat.temperature}°C <br /> 
                <span style={{ color: "gray" }}> Humidity: </span>
                {dat.humidity}%
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
export default App;
