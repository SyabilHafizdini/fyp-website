import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedin: this.props.getIsLoggedIn(),
            username: "",
            password: "",
            showError: false,
        };
    }

    onClickLogIn = () => {
        if (this.state.isLoggedin) {
            this.setState({isLoggedin: false})
            this.props.handleLoggedInStatus(false);
            console.log("Logged out!")
        } else {
            this.validateUser();
        }
    }
    validateUser = () => {
        fetch(`http://192.168.1.109:3000/data/user/?username=${this.state.username}&password=${this.state.password}`)
          .then(user => user.json())
          .then(res => {
            if (res.length === 0) {
                this.props.handleLoggedInStatus(false);
                this.setState({isLoggedin: false, showError: true});  
                console.log("User not found")
              } else {
                this.props.handleLoggedInStatus(true);
                this.setState({isLoggedin: true, showError: false});  
                console.log("Logged in!");
              }   
        }).catch(function() {
            console.log("error");
          });    
      }


    render() {

        const handleUsernameChange = username => event => {
            this.setState({username: event.target.value});
          };

          const handlePasswordChange = password => event => {
            this.setState({password: event.target.value});
          };

        return(
            <div className="LogInCardDiv">
                <Card style={{width: 410, marginLeft: "40%", marginTop: "4%"}}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                        Login
                        </Typography>
                        <TextField
                            id="outlined-uncontrolled"
                            label="Username"
                            margin="normal"
                            error= {this.state.showError? true : false}
                            onChange={handleUsernameChange('username')}
                            variant="outlined"
                        />
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            error= {this.state.showError? true : false}
                            margin="normal"
                            onChange={handlePasswordChange('password')}
                            variant="outlined"
                        />
                    </CardContent>
                    <CardActions>
                        <Button style={{marginLeft: "2%"}}variant="outlined" size="large" color="primary" onClick={() => this.onClickLogIn()}>{this.state.isLoggedin ? "Log out" : "Login" }</Button>
                    </CardActions>
                </Card>
                <div className="LogInError">
                </div>
            </div>
        );
    }
}

export default LoginPage;
