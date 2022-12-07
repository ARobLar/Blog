import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";


type AwaitApiprops = {
  children: string
}

export default function AwaitingApi(props : AwaitApiprops){

  return(
    <Box sx={{ display: 'inline', m: 1 }}>
      <CircularProgress/>
      <Box sx={{ display: 'inline', m: 1}}>
        {props.children}
      </Box>
    </Box>
  )
}