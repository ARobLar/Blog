import React, { useState } from "react";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import TextField from '@mui/material/TextField';
import theme from "../../src/theme";
import Box from "@mui/material/Box";

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

export default function AddBlogPost() {
  const classes = useStyles();
  const router = useRouter();
  
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

  function handleOnSubmit(event) {
      event.preventDefault();
      const t = event.target;

      //const data = CreateBlogPost(image, t.title.value, t.text.value);
      const success = false;

      if(success) {
        router.back();
      }
      else {
        alert("Failed to add blog post");
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
            <img src={imageUrl} alt={image.name} height="100px" />
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