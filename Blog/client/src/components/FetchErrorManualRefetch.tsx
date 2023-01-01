import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { useRouter } from "next/router"

type FetchUsersErrorProps = {
  refetch : any,
  children : string
}

export default function FetchErrorManualRefetch(props : FetchUsersErrorProps){
  const router = useRouter()

  return(
    <Box component="div">
      <Box component="h3">
        props.children
      </Box>
      <Button onClick={() => router.back()} variant="text" sx={{ display: 'inline'}}>
        Go back
      </Button>
      <Button onClick={() => props.refetch()} variant="text">
        Try again
      </Button>
    </Box>
  )
}