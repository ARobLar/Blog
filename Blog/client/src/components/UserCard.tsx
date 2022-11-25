import Box from "@mui/material/Box";
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles"
import { useRouter } from "next/router";
import { featuredUser } from "../interfaces/types";
import theme from "../theme";


const useStyles = makeStyles({
  card: {
    maxWidth: "100%",
    alignItems: 'center'
  },
  media: {
    height: '110px',
    width: '110px',
    borderRadius: '50%',
    [theme.breakpoints.down("sm")]: {
			height: '80px',
      width: '80px',
		}
  },
  cardActions: {
    display: "flex",
    margin: "0 10px",
    justifyContent: "space-between"
  },
 })

interface UserCardProps{
  user : featuredUser;
}

export default function UserCard(props : UserCardProps) {
  const classes = useStyles();
  const router = useRouter();
  const { user } = props;

  return(
    <Card className={classes.card}>
      <CardActionArea onClick={() => (router.push(`/${user.username}`))}>
        <CardMedia
        className={classes.media}
        image={user.avatarSource}
        title={user.avatarLabel}
        />
        <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {user.username}
        </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}