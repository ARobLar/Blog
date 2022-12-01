import theme from "../theme";
import { makeStyles } from '@mui/styles';

export const useHeadlineStyles = makeStyles({
  header: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(255, 255, 255, 1)), url('https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80')`,
    height: "25vw",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#000",
    fontSize: "10vw",
    margin: "0px -8px",
  },
  container: {
    paddingTop: theme.spacing(3)
  },
  title: {
    fontWeight: 800,
    fontSize: "5vw",
    paddingBottom: theme.spacing(3)
  },

})

export const useCardStyles = makeStyles({
  card: {
    maxWidth: "100%",
    alignItems: 'center',
  },
  media: {
    borderRadius: '20%',
    margin: "5%",
    height: "20vw",
  },
  actions: {
    margin: "0 5px",
    padding: "0 5px",
    justifyContent: "space-between",
    [theme.breakpoints.only("xs")]: {
      padding: "0 0"
    },
  },
  icon: {
    fontSize: "3vw"
  },
  content: {
    [theme.breakpoints.only("xs")]: {
      paddingLeft: "5%"
    },
  },
  title: {
    fontSize: "1.5vw",
    margin: "0",
    fontWeight: 600,
    [theme.breakpoints.only("xs")]: {
      fontSize: "1.2vw"
    },
  },
  date: {
    fontSize: "1.5vw",
    margin: "0",
    color: "grey",
  },
  text: {
    fontSize: "1.5vw",
    margin: "0",
    [theme.breakpoints.only("xs")]: {
      fontSize: "1.2vw"
    },
  },
})