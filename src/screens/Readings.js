import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, BarChart } from 'recharts';
import WebFont from 'webfontloader';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';

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

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
            isLoggedIn: this.props.isLoggedIn,
            height: 0,
            width: 0,
            day: null,
            month: null,
            year: null,
            monthsList: [],
            daysList: [],
            yearsList: [19],
            dateFormed: null,
            graphData: [],
            averageTemp: null,
            averageHum: null,

        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        setInterval(this.getMonthsFromYear, 1000);
        setInterval(this.getDataFromDate, 1000);
        setInterval(this.getDaysFromMonth, 1000);
        setInterval(this.getAverageFromDate, 1000);
        setInterval(this.checkIfCanFormDate, 1);
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }      

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    checkIfCanFormDate = () => {
        const { day, month, year } = this.state;
        if (day && month && year) {
            var date = day+"/"+month+"/"+year;
            if (date !== this.state.dateFormed) {
                this.setState({dateFormed: date});                
            }
        } else {
            this.setState({dateFormed: null});
        }
    }

    getMonthsFromYear = () => {
        var year = this.state.year;
        if (year !== null) {
            fetch(`http://192.168.1.109:3000/api/dates/months?year=${year}`)
            .then(date => date.json())
            .then(res => {
                this.setState({ monthsList: res});
            }).catch(function() {
                console.log("error");
            });
        }
    }    

    getDaysFromMonth = () => {
        var month = this.state.month;
        if (month !== null) {
            fetch(`http://192.168.1.109:3000/api/dates/days?month=${month}`)
            .then(date => date.json())
            .then(res => {
                this.setState({ daysList: res});
            }).catch(function() {
                console.log("error");
            });
        }
    }

    getAverageFromDate = () => {
        const { dateFormed } = this.state;

        if ( dateFormed !== null) {
            fetch(`http://192.168.1.109:3000/api/calculations/average?date=${this.state.dateFormed}`)
            .then(date => date.json())
            .then(res => {
                this.setState({ averageTemp: res.averageTemp, averageHum: res.averageHum});
            }).catch(function() {
                console.log("error");
            });  
        }
    }

    getDataFromDate = () => {
        fetch(`http://192.168.1.109:3000/api/readings?date=${this.state.dateFormed}`)
        .then(date => date.json())
        .then(res => {
            this.setState({ graphData: res});
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
        const { width, day, month, year, dateFormed} = this.state;
        const { monthsList, daysList, yearsList } = this.state;
        const { graphData } = this.state;
        const {rowsPerPage, page } = this.state;
        const { averageTemp, averageHum } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, graphData.length - page * rowsPerPage);

        const displayStats = (
            <Paper className={styles.root} style={{width: 410, height: 160}}>
                <div className={styles.tableWrapper}>
                    <Typography variant="h6" color="inherit" className="GraphCardTitle">
                        Average:
                    </Typography>                
                    <Typography variant="h6" color="inherit" className="GraphCardTitle">
                        {averageTemp}°C
                    </Typography>
                    <Typography variant="h6" color="inherit" className="GraphCardTitle">
                        {averageHum}%
                    </Typography>                    
                </div>                              
            </Paper>
        );

        const displayTable = (
        <Paper className={styles.root}>
            <div className={styles.tableWrapper}>
            <Table className={styles.table}>
                <TableHead>
                <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Temperature</TableCell>
                    <TableCell align="right">Humidity</TableCell>
                </TableRow>
            </TableHead>
                <TableBody>
                {graphData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
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
                    colSpan={4}
                    count={graphData.length}
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
            height={300}
            data={graphData}
            margin={{
            top: 30, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis dataKey="datetime" tickFormatter={(tickItem) => tickItem.split(' ')[1]} tick={false} />
            <YAxis interval={0}/>
            <Tooltip />
            <Legend />
            <Bar dataKey="temperature" fill="#8884d8" />
            <Bar dataKey="humidity" fill="#82ca9d" />
        </BarChart>      
        );        

        var handleTimeElementClick = (timePeriod, timeElement) => {
            // Apparently timePeriod = "year" =/= "year" in setState().
            switch(timePeriod){
                case("year"):
                    this.setState({
                        year: timeElement,
                        month: null,
                        day: null,
                        monthsList: [],
                        daysList: [],
                        averageTemp: null,
                        averageHum: null,
                        });
                    window.scrollTo(0, window.innerHeight);                    
                    break;
                case("month"):
                    this.setState({
                        month: timeElement,
                        day: null,
                        averageTemp: null,
                        averageHum: null
                    });
                    setTimeout(() => {window.scrollTo(0, window.innerHeight)}, 500);
                    break;
                case("day"):
                    this.setState({
                        day: timeElement,                    
                        });
                    window.scrollTo(0, -window.innerHeight);
                    break;
                default:
            }
        }



        const DisplayYears = (
            yearsList.map(year => 
                <CardContent>
                    <Button fullWidth="true" variant="outlined" size="large" color="default" onClick={() => handleTimeElementClick("year", year)}>20{year}</Button>
                </CardContent>
            )
        );        

        const DisplayMonths = (
            monthsList.map(month => 
                <CardContent>
                    <Button fullWidth="true" variant="outlined" size="large" color="default" onClick={() => handleTimeElementClick("month", month.months)}>{month.months}</Button>
                </CardContent>
            )
        );

        const DisplayDays = (
            daysList.map(day => 
                <CardContent>
                    <Button fullWidth="true" variant="outlined" size="large" color="default" onClick={() => handleTimeElementClick("day", day.days)}>{day.days}</Button>
                </CardContent>
            )
        );        

        const DisplayChart = (
            <div className="GraphCard">
                <Card style={{width: 410}}>
                    <CardContent style={{marginLeft: -50, marginRight: -25, marginTop: -25}}>
                    <Typography variant="h5" color="inherit" className="GraphCardTitle">
                        {this.state.dateFormed? "RaspberryPi1" : "Please form date"}
                    </Typography>
                    {TemperatureChart}
                    </CardContent>
                </Card>
                {displayTable}    
                {displayStats}            
            </div>                    
        )

        return(
            <div className="background">
                {DisplayChart}
                <div className="GraphCardHeader">
                    <h1 style={{paddingRight: '13%'}}>Day: <br /> {day}</h1>
                    <h1 style= {{paddingRight: '12%'}}>Month: <br /> {month}</h1>
                    <h1>Year: <br /> 20{year} </h1>
                       
                </div>
                <div className="GraphCard">
                    <Card style={{width: .5 * width - .25 * width}}>
                        <CardContent>
                            {DisplayDays}
                        </CardContent>
                    </Card>
                    <Card style={{width: .5 * width - .25 * width}}>
                        <CardContent>
                            {DisplayMonths}
                        </CardContent>
                    </Card>
                    <Card style={{width: .5 * width - .25 * width}}>
                        <CardContent>
                            {DisplayYears}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
}

export default LoginPage;