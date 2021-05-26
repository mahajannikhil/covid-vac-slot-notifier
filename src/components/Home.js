import axios from 'axios'
import React from 'react'
import moment from 'moment'
import get from 'lodash/get'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { LinearProgress, List, ListItem, ListItemText, MenuItem, Select } from '@material-ui/core'
import notificationSound from '../assets/notification.ogg';

function Home () {
  const [dateInput, setDateInput] = React.useState(null)
  const [pincode, setPincode] = React.useState(null)
  const [doseNo, setDoseNo] = React.useState(null)
  const [slots, setSlots] = React.useState(null)
  const [searchFreq, setSearchFreq] = React.useState(1)
  const [startedLooking, setStartedLooking] = React.useState(false)
  const doseMap = {
    1: 'available_capacity_dose1',
    2: 'available_capacity_dose2'
  }
  const startLooking = () => {
    const pin = pincode || '452010'
    const date = dateInput || moment(new Date()).format('DD-MM-YYYY')
    axios
      .get(
        `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pin}&date=${date}`
      )
      .then(function (response) {
        console.log(response)
        const centers = get(response, 'data.centers', [])
        const slots = [];
        centers.forEach(({ sessions, address }) => {
          sessions.forEach(({ available_capacity, ...rest }) => {
            if (available_capacity > 0 && rest[doseMap[doseNo]] > 0) {
              console.log(
                'available_capacity --- ',
                available_capacity,
                address
              )
              const slotArea = `${rest[doseMap[doseNo]]} Slot available for dose_${doseNo} at:- ${address}`
              slots.push(slotArea);
            }
          })
        })
        const audio = new Audio(notificationSound);
        slots.length && audio.play().then(() => {
          setSlots(slots);
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
  }

  const useStyles = makeStyles(theme => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1)
    },
    submit: {
      margin: theme.spacing(3, 0, 2)
    }
  }))

  const classes = useStyles()
  const searchFreqOptions = new Array(60)
  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form}>
          <TextField
            variant='outlined'
            margin='normal'
            fullWidth
            id='pincode'
            label='pincode'
            name='pincode'
            autoFocus
            onChange={e => {
              setPincode(e.target.value)
            }}
          />
          <TextField
            variant='outlined'
            margin='normal'
            fullWidth
            id='dose_no'
            label='dose no'
            name='dose_no'
            autoFocus
            onChange={e => {
              setDoseNo(e.target.value)
            }}
          />
          <TextField
            variant='outlined'
            margin='normal'
            fullWidth
            name='date'
            label='date'
            id='date'
            onChange={e => {
              setDateInput(e.target.value)
            }}
            defaultValue={moment(new Date()).format('DD-MM-YYYY')}
          />
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={searchFreq}
            onChange={e => {
              setSearchFreq(e.target.value)
            }}
            fullWidth
            placeholder='Select Search Frequency (minutes)'
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
            variant='contained'
            color='primary'
            onClick={() => {
              startLooking()
              setStartedLooking(true)
              setInterval(() => {
                startLooking()
              }, parseInt(searchFreq, 10) * 60000)
            }}
            className={classes.submit}
          >
            {startedLooking ? 'looking...' : 'Start looking'}
          </Button>
          {startedLooking && <LinearProgress />}
        </form>
        {slots ? slots.map((s) => {
          return <List>
            <ListItem>
              <ListItemText>
                {s}
              </ListItemText>
            </ListItem>
          </List>
        }) : null}
      </div>
    </Container>
  )
}

export default Home
