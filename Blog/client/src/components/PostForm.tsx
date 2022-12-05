import Box from "@mui/material/Box"
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import { useState } from "react";
import { useRouter } from "next/router";
import { postFormData } from "../interfaces/types";
import { useFormStyles } from "../styles/formStyles";

interface PostFormProps{
  initialValues? : postFormData;
  onSubmit : (data:FormData) => void;
}

const defaultProps : postFormData = {
    title : "",
    imageUrl : "",
    imageLabel : "",
    text : ""
}

export default function PostForm(props : PostFormProps){
  const classes = useFormStyles()
  const router = useRouter()
  const { initialValues=defaultProps, onSubmit } = props;

  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(initialValues.imageUrl);

  function handleImageUpload(event : any) {
    const { target: t } = event;
    if(t.files != null && t.files[0] != null){
      const img = t.files[0];
      setImage(img);
      setImageUrl(URL.createObjectURL(img));
    }
  }

  function handleOnSubmit(event : any) {
    event.preventDefault();
    const { target: t } = event;

    if(imageUrl){
      const form = new FormData();
      form.append("title", t.title.value);
      form.append("creationTime", new Date().toLocaleString());
      form.append("text", t.text.value);
      form.append("image", image ? image : "");
      form.append("imageLabel", "");
      onSubmit(form);
    }
    else{
      alert("You forgot to add an image");
    }
  }

  return(
    <div className={classes.paper}>
      <Box component="form" className={classes.form} onSubmit={handleOnSubmit}>
        <TextField
          id="title"
          name="Title"
          label="Title"
          defaultValue={initialValues.title }
          autoComplete="title"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          autoFocus
          />
        {imageUrl && (
          <Box mt={3}>
            <img src={imageUrl} alt={image? image.name : initialValues.imageLabel} height="200px" />
          </Box> )}
        <input
          accept="image/*"
          type="file"
          onChange={handleImageUpload}
          />
        <TextField
          id="text"
          name="Text"
          label="Text"
          defaultValue={initialValues.text}
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
      </Box>
    </div>
  )
}