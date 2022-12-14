

export type signInDto = {
  username : string
  password : string
  rememberMe : boolean
}

export type userDto = {
  id : string
  role : string
  email : string
  username : string
}

export type signUpUserDto = {
  role : string
  email : string
  username : string
  password : string
}

export type postOutDto = {
  title : string,
  creationTime : Date,
  text : string,
  imageLabel : string,
  image : File
}