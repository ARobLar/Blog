import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import TextField from '@mui/material/TextField';
import theme from "../../../../src/theme";
import Box from "@mui/material/Box";
import { useGetPostQuery, useUpdatePostMutation } from "../../../../src/api/apiSlice";
import { hostBaseUrl } from "../../../../src/CONSTANTS";

const useStyles = makeStyles({
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "50%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

export default function HandlePost() {
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;
  const [updatePost] = useUpdatePostMutation();
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {data: post, isFetching, isSuccess } = useGetPostQuery(id as string);
  
  function handleImageUpload(event) {
    const t = event.target;
    if(t.files != null && t.files[0] != null){
      const img = t.files[0];
      setImage(img);
      setImageUrl(URL.createObjectURL(img));
    }
  }

  async function handleOnSubmit(event) {
    event.preventDefault();
    const t = event.target;

    const form = new FormData();
    form.append("title", t.title.value);
    form.append("creationTime", new Date().toLocaleString());
    form.append("text", t.text.value);
    form.append("image", image ? image : "");
    form.append("imageLabel", "");

    let success = false;
    success = await updatePost({post : form, id: id as string}).unwrap();

    if(success) {
      router.back();
    }
  }
  
  if(isFetching){
    return <div>Loading..</div>
  }
  if(isSuccess){
    if(post == null){
      return(
        <h1>Invalid post identifier</h1>
        )
    }
    return (
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleOnSubmit}>
          <TextField
            id="title"
            name="Title"
            label="Title"
            defaultValue={post.title}
            autoComplete="title"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            autoFocus
            />
          {imageUrl ? (
            <Box mt={3}>
              <img src={imageUrl} alt={"postImage"} height="200px" />
            </Box>) : (            
            <Box mt={3}>
              <img src={`${hostBaseUrl}/${post.imageSource}`} alt={post.imageLabel} height="200px" />
            </Box>)}
          <input
            accept="image/*"
            type="file"
            onChange={handleImageUpload}
            />
          <TextField
            id="text"
            name="Text"
            label="Text"
            defaultValue={post.text}
            autoComplete="text"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            autoFocus
            multiline
            rows={10}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            >
            Post
          </Button>
          <Button onClick={ () => {router.back()} }>Cancel</Button>
        </form>
      </div>
    );
  }
}