import React, { useState } from "react";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import TextField from '@mui/material/TextField';
import theme from "../../../src/theme";
import Box from "@mui/material/Box";
import { useAddPostMutation } from "../../../src/api/apiSlice";

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

export default function AddPost() {
  const classes = useStyles();
  const router = useRouter();
  const [addPost] = useAddPostMutation();
  
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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

      if(image == null){
        alert("You forgot to add an image");
      }
      else{

        const form = new FormData();
        form.append("title", t.title.value);
        form.append("creationTime", new Date().toLocaleString());
        form.append("text", t.text.value);
        form.append("image", image);
        form.append("imageLabel", "");
        const success = await addPost(form).unwrap();

        if(success) {
          router.back();
        }
        else {
          alert("Failed to add blog post");
        }
      }
    }

  return (
    <div className={classes.paper}>
      <form className={classes.form} onSubmit={handleOnSubmit}>
        <TextField
          id="title"
          name="Title"
          label="Title"
          autoComplete="title"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          autoFocus
        />
        {imageUrl && image && (
          <Box mt={3}>
            <img src={imageUrl} alt={image.name} height="200px" />
          </Box>
        )}
        <input
          accept="image/*"
          type="file"
          onChange={handleImageUpload}
          required
        />
        <TextField
          id="text"
          name="Text"
          label="Text"
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