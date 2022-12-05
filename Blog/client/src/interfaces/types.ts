import { UserRole } from "./enums"


export type featuredUser = {
  username : string,
  avatarSource: string,
  avatarLabel: string,
}

export type featuredPost = {
  id : string,
  title : string,
  creationTime : Date,
  text : string,
  imageSource: string,
  imageLabel: string,
}

export type authUser = {
  id : string
  role : UserRole
  username : string
  loggedIn : boolean
}

export type postFormData = {
  title : string
  imageUrl : string
  imageLabel : string
  text : string
}