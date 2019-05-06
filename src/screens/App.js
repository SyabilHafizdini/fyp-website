import React from 'react';
import { CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, BarChart } from 'recharts';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import WebFont from 'webfontloader';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import './App.css';
import { nominalTypeHack } from 'prop-types';

WebFont.load({
  google: {
    families: ['Roboto:300,400,700']
  }
});


const styles = {
  appBar: {
    boxShadow: "none",
  },

};

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
    fetch("http://192.168.1.189:3000/data")
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
        width={450}
        height={200}
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

    const TopBar = (
      <div className="appBar"> 
        <AppBar position="absolute" color="white" className="appBar">
          <Toolbar>
            <div className="productLogo">
              <Typography variant="h6" color="#942121">
                Temp Humid
              </Typography>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
    return (
      <div className="background">
        { TopBar }
        <div className="GraphCard">
          <Card>
            <CardContent style={{marginLeft: -50, marginRight: -25, marginTop: -25, marginBottom: -10}}>
              <Typography variant="h8" color="#942121" className="GraphCardTitle">
                RaspberryPi1
            </Typography>
            {renderTemperatureChart}
            </CardContent>
          </Card>
          <Card>
            <CardContent style={{ marginLeft: -50, marginRight: -25, marginTop: -25, marginBottom: -10 }}>
              <Typography variant="h8" color="#942121" className="GraphCardTitle">
                RaspberryPi1
            </Typography>
              {renderTemperatureChart}
            </CardContent>
          </Card>
        </div>
        <h1>Total number of data: {data.length}</h1>
        <h1>Last entry: {lastEntry.temperature}°C </h1>
        <div className="entriesList">
          {data.length <= 0
            ? "NO DB ENTRIES YET"
            : data.map(dat => (
              <Card>
                <CardContent>
                  <Typography variant="h8" color="#942121" className="GraphCardTitle">
                    ID: {dat._id} <br />
                    Temperature: {dat.temperature}°C <br />
                    Humidity: {dat.humidity}% <br />
                    Time: {dat.time} <br />
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    );
  }
}
export default App;
