import React from 'react';
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
import './App.css';

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

class App extends React.Component {
  constructor() {
    super();
    // initialize our state 
    this.state = {
      data: [],
      graphData: [],
      lastEntry: {},
      intervalIsSet: false,
      page: 0,
      rowsPerPage: 5,
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

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };

  

  render() {
    const { data } = this.state;
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
                <TableRow key={row.time}>
                  <TableCell component="th" scope="row">
                    {row.time}
                  </TableCell>
                  <TableCell align="right">{row.date}</TableCell>                  
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
              <Typography variant="h6" color="inherit">
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
          <Card style={{width: 410}}>
            <CardContent style={{marginLeft: -50, marginRight: -25, marginTop: -25, marginBottom: -10}}>
              <Typography variant="h5" color="inherit" className="GraphCardTitle">
                RaspberryPi1
            </Typography>
            {renderTemperatureChart}
            </CardContent>
          </Card>
          <Card style={{ width: 410}}>
            <CardContent>
              <Typography variant="h2" color="inherit" className="GraphCardTitle">
              [Last Entry]
              </Typography>
              <Typography variant="h8" color="inherit" className="GraphCardTitle">
                Time: {lastEntry.time}
              </Typography>
              <Typography variant="h8" color="inherit" className="GraphCardTitle">
                Date: {lastEntry.date}
              </Typography>               
              <Typography variant="h8" color="inherit" className="GraphCardTitle">
                Temperature: {lastEntry.temperature}°C
              </Typography>
              <Typography variant="h8" color="inherit" className="GraphCardTitle">
                Humidity: {lastEntry.humidity}%
              </Typography>             
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
export default App;