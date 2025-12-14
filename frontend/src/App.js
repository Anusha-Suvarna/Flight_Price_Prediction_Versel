import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, CircularProgress, Container, Paper } from '@material-ui/core';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { orange, red } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: orange[500],
    },
    secondary: {
      main: red[500],
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(5),
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
    borderRadius: theme.spacing(2),
    boxShadow: '0 0 20px rgba(255, 165, 0, 0.3)',
    border: '1px solid rgba(255, 165, 0, 0.5)',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(255, 165, 0, 0.8)',
    marginBottom: theme.spacing(3),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  input: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: orange[500],
        borderWidth: 2,
      },
      '&:hover fieldset': {
        borderColor: orange[300],
        boxShadow: '0 0 10px rgba(255, 165, 0, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: orange[200],
        boxShadow: '0 0 15px rgba(255, 165, 0, 0.8)',
      },
    },
    '& .MuiInputLabel-root': {
      color: orange[300],
    },
    '& .MuiInputBase-input': {
      color: 'white',
    },
  },
  button: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    fontSize: '1.2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #ff6b35 30%, #f7931e 90%)',
    border: 0,
    borderRadius: theme.spacing(1),
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(45deg, #f7931e 30%, #ff6b35 90%)',
      boxShadow: '0 6px 10px 2px rgba(255, 105, 135, .4)',
      transform: 'translateY(-2px)',
    },
  },
  result: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
    background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
    color: 'white',
    borderRadius: theme.spacing(2),
    boxShadow: '0 0 20px rgba(76, 175, 80, 0.5)',
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  error: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
    background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
    color: 'white',
    borderRadius: theme.spacing(2),
    boxShadow: '0 0 20px rgba(244, 67, 54, 0.5)',
    textAlign: 'center',
    fontSize: '1.2rem',
  },
}));

function App() {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    journey_date: '',
    dep_time: '',
    arr_time: '',
    duration: '',
    stops: '',
    airline: '',
    source: '',
    destination: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setPrediction(data.prediction);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" style={{ background: '#121212', minHeight: '100vh', paddingTop: '20px' }}>
        <Paper className={classes.root}>
          <Typography variant="h4" component="h1" className={classes.title}>
            FLIGHT PRICE PREDICTOR
          </Typography>
          <Typography variant="body1" gutterBottom style={{ color: 'orange', textAlign: 'center' }}>
            Enter flight details to predict ticket prices with AI precision.
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              label="Journey Date"
              type="date"
              name="journey_date"
              value={formData.journey_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              className={classes.input}
              required
            />
            <TextField
              label="Departure Time"
              type="time"
              name="dep_time"
              value={formData.dep_time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              className={classes.input}
              required
            />
            <TextField
              label="Arrival Time"
              type="time"
              name="arr_time"
              value={formData.arr_time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              className={classes.input}
              required
            />
            <TextField
              label="Duration (hours:minutes or minutes)"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 2:30 or 150"
              className={classes.input}
              required
            />
            <FormControl required className={classes.input}>
              <InputLabel>Total Stops</InputLabel>
              <Select name="stops" value={formData.stops} onChange={handleChange}>
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2+</MenuItem>
              </Select>
            </FormControl>
            <FormControl required className={classes.input}>
              <InputLabel>Airline</InputLabel>
              <Select name="airline" value={formData.airline} onChange={handleChange}>
                <MenuItem value="Jet Airways">Jet Airways</MenuItem>
                <MenuItem value="IndiGo">IndiGo</MenuItem>
                <MenuItem value="Air India">Air India</MenuItem>
                <MenuItem value="Multiple carriers">Multiple carriers</MenuItem>
                <MenuItem value="SpiceJet">SpiceJet</MenuItem>
                <MenuItem value="Vistara">Vistara</MenuItem>
                <MenuItem value="GoAir">GoAir</MenuItem>
                <MenuItem value="Multiple carriers Premium economy">Multiple carriers Premium economy</MenuItem>
                <MenuItem value="Jet Airways Business">Jet Airways Business</MenuItem>
                <MenuItem value="Vistara Premium economy">Vistara Premium economy</MenuItem>
                <MenuItem value="Trujet">Trujet</MenuItem>
              </Select>
            </FormControl>
            <FormControl required className={classes.input}>
              <InputLabel>Source City</InputLabel>
              <Select name="source" value={formData.source} onChange={handleChange}>
                <MenuItem value="Delhi">Delhi</MenuItem>
                <MenuItem value="Kolkata">Kolkata</MenuItem>
                <MenuItem value="Mumbai">Mumbai</MenuItem>
                <MenuItem value="Chennai">Chennai</MenuItem>
              </Select>
            </FormControl>
            <FormControl required className={classes.input}>
              <InputLabel>Destination City</InputLabel>
              <Select name="destination" value={formData.destination} onChange={handleChange}>
                <MenuItem value="Delhi">Delhi</MenuItem>
                <MenuItem value="Cochin">Cochin</MenuItem>
                <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                <MenuItem value="Kolkata">Kolkata</MenuItem>
                <MenuItem value="New_Delhi">New Delhi</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" className={classes.button} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'PREDICT PRICE'}
            </Button>
          </form>
          {prediction && (
            <Paper className={classes.result}>
              <Typography variant="h6">Predicted Price: ₹{prediction}</Typography>
            </Paper>
          )}
          {error && (
            <Paper className={classes.error}>
              <Typography variant="h6">Error: {error}</Typography>
            </Paper>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
