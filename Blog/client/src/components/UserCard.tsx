import Box from "@mui/material/Box";
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles"
import { useRouter } from "next/router";
import { featuredUser } from "../interfaces/types";
import { useCardStyles } from "../styles/overviewPageStyles";

interface UserCardProps{
  user : featuredUser;
}

export default function UserCard(props : UserCardProps) {
  const classes = useCardStyles();
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
        <CardContent className={classes.content}>
          <Typography className={classes.title}>
            {user.username}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}