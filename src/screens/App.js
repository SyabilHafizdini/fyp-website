import React, {useState} from 'react';
import { BrowserRouter, Router, Route, Link, NavLink } from "react-router-dom";
import { CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, BarChart } from 'recharts';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import WebFont from 'webfontloader';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import './App.css';
import LoginPage from './Login';
import ReadingsPage from './Readings';


WebFont.load({
  google: {
    families: ['Roboto:300,400,700']
  }
});


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});


class Home extends React.Component {
  
  constructor() {
    super();
    // initialize our state 
    this.state = {
      data: [],
      graphData: [],
      lastEntry: {},
      dateToShow: "14/06/19",
      intervalIsSet: false,
      page: 0,
      rowsPerPage: 5,
      isLoggedIn: true
    };
  }

    // when component mounts, first thing it does is fetch all existing data in our db

  handleLoggedInStatus = (isLoggedIn) => {
    this.setState({isLoggedIn});
  }

  getIsLoggedIn = () => {
    return this.state.isLoggedIn;
  }

  render() {
    const TopBar = (
      <div className="appBar"> 
        <AppBar position="static" color="white" className="appBar">
          <Toolbar>
            <div className="productLogo">
            <Button edge="start" color="inherit" component={Link} to="/">
                <Typography variant="h6" color="inherit">
                  TempHumid
                </Typography>
              </Button>
            </div>
            <Button color="inherit" component={Link} to="/Home">Home</Button>
            <Button color="inherit" component={Link} to="/Readings">Readings</Button>
            <Button color="inherit" component={Link} to="/Login" style={{marginLeft: "83%"}}>{this.state.isLoggedIn ? "Logout" : "Login"} </Button>
          </Toolbar>
        </AppBar>

        <Route exact path="/Home" render = {(routeProps) => (<HomeContent {...this.state}/>)} />
        <Route exact path="/Login" render = {(routeProps) => (<LoginPage handleLoggedInStatus= {this.handleLoggedInStatus} getIsLoggedIn = {this.getIsLoggedIn} />)} />
        <Route exact path="/Readings" render = {(routeProps) => (<ReadingsPage {...this.state} />)} />
      </div>
    );

    return (
      <div className="background">
        { TopBar }
      </div>
    );
  }
}

class HomeContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {...this.props};
  }

  componentDidMount() {
    document.title = "our FYP website";
    setInterval(this.getDataFromDate, 1000);
    setInterval(this.getDatesFromDb, 1000);
  }

  // our first get method that uses our backend api to 
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("http://192.168.1.109:3000/api/readings")
      .then(data => data.json())
      .then(res => {
        this.setState({ data: res , lastEntry: res[0], graphData: res.slice(0, 5)});
      }).catch(function() {
        console.log("error");
      });
  };

  getDatesFromDb = () => {
    fetch("http://192.168.1.109:3000/api/dates")
      .then(date => date.json())
      .then(res => {
        this.setState({ dates: res});
      }).catch(function() {
        console.log("error");
      });
  }

  getDataFromDate = () => {
    fetch(`http://192.168.1.109:3000/api/readings?date=${this.state.dateToShow}`)
      .then(date => date.json())
      .then(res => {
        this.setState({ data: res , lastEntry: res[0], graphData: res.slice(0, 5)});
      }).catch(function() {
        console.log("error");
      });    
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };



  render() {
    const { data } = this.state;
    const { dates } = this.state;
    const { graphData } = this.state;
    const {rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const {lastEntry} = this.state;

    const displayTable = (
      <Paper className={styles.root}>
        <div className={styles.tableWrapper}>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Temperature</TableCell>
                <TableCell align="right">Humidity</TableCell>
              </TableRow>
           </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                <TableRow key={row.datetime.split(' ')[1]}>
                  <TableCell component="th" scope="row">
                    {row.datetime.split(' ')[1]}
                  </TableCell>
                  <TableCell align="right">{row.datetime.split(' ')[0]}</TableCell>                  
                  <TableCell align="right">{row.temperature}°C</TableCell>
                  <TableCell align="right">{row.humidity}%</TableCell>
               
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={3}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    native: true,
                  }}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page',
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page',
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );

    const TemperatureChart = (
      <BarChart
        width={450}
        height={200}
        data={graphData}
        margin={{
          top: 30, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="datetime" tickFormatter={(tickItem) => tickItem.split(' ')[1]} />
        <YAxis interval={0}/>
        <Tooltip />
        <Legend />
        <Bar dataKey="temperature" fill="#8884d8" />
        <Bar dataKey="humidity" fill="#82ca9d" />
      </BarChart>      
    );

    const showDateData = (date) => {
      this.setState({dateToShow: date});
    }


    if (this.state.isLoggedIn === false) {
      return(
        <div className="background">
          <div className="LogInError">
            <h1>Please log in</h1>      
          </div>
        </div>
      );
    } else {
      return(
        <div className="background">
          <div className="GraphCard">
              <Card style={{width: 410}}>
                <CardContent style={{marginLeft: -50, marginRight: -25, marginTop: -25, marginBottom: -10}}>
                  <Typography variant="h5" color="inherit" className="GraphCardTitle">
                    RaspberryPi1
                </Typography>
                {TemperatureChart}
                </CardContent>
              </Card>
            </div>
            <div style={{ marginLeft: "7%", marginRight: "7%", marginBottom: "7%"}}>
              {displayTable}
            </div>
          </div>
      );
    }
  }
}

export default Home;