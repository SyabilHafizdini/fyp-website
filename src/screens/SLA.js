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
            year: "19",
            monthsList: [],
            daysList: [],
            email: null,
            yearsList: [19],
            dateFormed: null,
            graphData: [],
            averageTemp: null,
            averageHum: null,
            reply: null,



        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        setInterval(this.getMonthsFromYear, 1000);
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }      

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    handleChange = (email) => event => {
        this.setState({email: event.target.value });
      };

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

    _sendEmail = () => {
        const { month, email } = this.state;
        if(month){
            fetch(`http://192.168.1.109:3000/api/email?month=${month}&email=${email}`)
            .then(this.setState({ reply: `Email sent  to: ${email}` }))
            .catch(function() {
                console.log("error");
            });
        }
    }

    render() {
        const { width, month} = this.state;
        const { monthsList } = this.state;    

        var handleTimeElementClick = (timePeriod, timeElement) => {
            // Apparently timePeriod = "year" =/= "year" in setState().
            switch(timePeriod){
                case("month"):
                    this.setState({
                        month: timeElement,
                        day: null,
                        averageTemp: null,
                        averageHum: null
                    });
                    setTimeout(() => {window.scrollTo(0, window.innerHeight)}, 500);
                    break;
                default:
            }
        }    

        const DisplayMonths = (
            monthsList.map(month => 
                <CardContent>
                    <Button fullWidth="true" variant="outlined" size="large" color="default" onClick={() => handleTimeElementClick("month", month.months)}>{month.months}</Button>
                </CardContent>
            )
        );

        return(
            <div className="background">
                <div className="GraphCardHeader">
                    <h1 style= {{paddingRight: '28%'}}>Month: <br /> {month}</h1>
                </div>
                <div className="GraphCard">
                    <Card style={{width: .5 * width - .25 * width}}>
                        <CardContent>
                            {DisplayMonths}
                        </CardContent>
                    </Card>
                    <div>
                    <TextField
                        label="E-mail"
                        value={this.state.email}
                        onChange={this.handleChange('name')}
                    />
                        <Button variant="contained" color="primary" onClick={this._sendEmail}>
                            Generate SLA
                        </Button>
                        <h3>{this.state.reply}</h3>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginPage;