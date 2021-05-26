import axios from 'axios';
import React from 'react';
import moment from 'moment'
import get from 'lodash/get';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import './App.css';
import {LinearProgress, MenuItem, Select} from '@material-ui/core';

function App() {

  const [dateInput, setDateInput] = React.useState(null);
  const [pincode, setPincode] = React.useState(null);
  const [searchFreq, setSearchFreq] = React.useState(1);
  const [startedLooking, setStartedLooking] = React.useState(false);

  const startLooking = () => {
    const pin = pincode || '452010';
    const date = dateInput || moment(new Date()).format('DD-MM-YYYY');
    axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pin}&date=${date}`)
    .then(function (response) {
      console.log(response);
      const centers = get(response, 'data.centers', []);
      centers.forEach(({sessions, address}) => {
        sessions.forEach(({available_capacity}) => {
          if(available_capacity) {
            window.alert('Slot available at', address)
          }
        })
      })
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  /*  const sendMessage = () => {
      const accountSid = 'AC62bb6f5572fe0074c7a52c0ee50d55ad';
      const authToken = 'efe124de74f8399f4014cffc2b6561e4';


      const client = require('twilio')(accountSid, authToken);

      client.messages
      .create({
        from: 'whatsapp:+918823887578',
        body: 'Hello there!',
        to: 'whatsapp:+919399291719'
      })
      .then(message => console.log(message.sid));
    }*/

  const classes = useStyles();
  const searchFreqOptions = new Array(60);
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="pincode"
            label="pincode"
            name="pincode"
            autoFocus
            onChange={(e) => {
              setPincode(e.target.value)
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="date"
            label="date"
            id="date"
            onChange={(e) => {
              setDateInput(e.target.value)
            }}
            defaultValue={moment(new Date()).format('DD-MM-YYYY')}
          />
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={searchFreq}
            onChange={(e) => {
              setSearchFreq(e.target.value)
            }}
            fullWidth
            placeholder="Select Search Frequency (minutes)"
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={35}>35</MenuItem>
            <MenuItem value={40}>40</MenuItem>

          </Select>
          Search Frequency (minutes)
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              startLooking();
              setStartedLooking(true);
              setInterval(() => {
                startLooking();
              }, parseInt(searchFreq, 10) * 60000)
            }}
            className={classes.submit}
          >
            Start looking
          </Button>
          { startedLooking && <LinearProgress />}
        </form>
      </div>
    </Container>
  );
}

export default App;
