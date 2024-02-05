import './App.css';
import { deleteImage, getImagesData, uploadImage } from './server/images';
import { useEffect, useState } from 'react';

function App() {
  // const URL = "https://ori-photos-storage.s3.amazonaws.com/";
  const URL = 'http://localhost:3030/get-image'

  const [images, setImages] = useState([]);
  
  useEffect(() => {
    getImagesData()
      .then(newImages => {
        setImages(newImages)
      })
  }, [])

  const onSubmitForm = (event) => {
    event.preventDefault();
    const image = event.target.children[0].files[0];
    const formData = new FormData();
    formData.append("image", image);
    
    uploadImage(formData)
      .then(res => {
        console.log(res);
        return getImagesData()
      })
      .then(newImages => {
        setImages(newImages)
      })
  }

  const onClickDelete = (id, key) => {
    deleteImage(id, key)
      .then(() => {
        return getImagesData();
      })
      .then(newImages => {
        setImages(newImages);
      })
  }

  return (
    <div className="App">
      <h1>Image App</h1>
      <form onSubmit={onSubmitForm}>
        <input type='file' name='image'/>
       <button type='submit'>Submit</button>
      </form>   
      {
        images.map(image => (
          <div key={image._id}>
            <h3>{image.originalName}</h3>
            <img src={URL + `?key=${image.key}&name=${image.originalName}`} alt={image.originalName}/>
            <button onClick={() => {onClickDelete(image._id, image.key)}}>Delete {image.originalName}</button>
            <hr/>
          </div>
        ))
      } 
    </div>
  );
}

export default App;
