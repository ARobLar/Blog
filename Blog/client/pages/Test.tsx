import Box from "@mui/material/Box";
import { useGetTestQuery } from "../src/api/apiSlice";




export default function Test() {
  const {data: boll, isFetching, isSuccess, isError, error} = useGetTestQuery(3);


  if(isFetching){
    console.log("fetching");
  }
  if(isSuccess){
    console.log("successful__1");
    console.log(boll);
    console.log("successful__2");
  }
  if(isError){
    console.log("error__1");
    console.log(error)
    console.log("error__2");
  }

  return(
    <Box>
      {boll}
    </Box>
  )
}