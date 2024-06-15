import React, { useState, useEffect } from 'react';
import { Grid, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useRouter } from 'next/router';
import { db } from '../../src/config/firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Layout from '../../components/common/layout/layout';
import SnackBar from '../../components/common/snackbar/snackbar';

const EditMenuPage = () => {
 const router = useRouter();
 const [openAlert, setOpenAlert] = useState(false);
 const { id } = router.query;
 const [menuItem, setMenuItem] = useState({ 
  name: '',
 category: '',
 price: '',
 stock: '',
 cost: '',
 options: '' }); // Ensure options are initialized

 const [errors, setErrors] = useState({
  name: '',
  category: '',
  price: '',
  stock: '',
  cost: '',
});

useEffect(() => {
  if (id) {
    const ref = doc(db, "menu", id);
    getDoc(ref)
      .then((doc) => {
        setMenuItem(doc.data());
      })
      .catch((error) => {
        console.log(error);
      });
  }
}, [id]);

 const handleSave = () => {

  let isValid = true;

  if (!menuItem.name) {
    setErrors((prevErrors) => ({...prevErrors, name: 'Name is required' }));
    isValid = false;
  }

  if (!menuItem.category) {
    setErrors((prevErrors) => ({...prevErrors, category: 'Category is required' }));
    isValid = false;
  }

  if (!menuItem.price) {
    setErrors((prevErrors) => ({...prevErrors, price: 'Price is required' }));
    isValid = false;
  }

  if (!menuItem.stock) {
    setErrors((prevErrors) => ({...prevErrors, stock: 'Stock is required' }));
    isValid = false;
  }

  if (!menuItem.cost) {
    setErrors((prevErrors) => ({...prevErrors, cost: 'Cost is required' }));
    isValid = false;
  }

  if (!menuItem.options) {
    setErrors((prevErrors) => ({...prevErrors, options: 'Options is required' }));
    isValid = false;
  }

  if (!isValid) return;

  if (id) {
   const ref = doc(db, "menu", id);
   updateDoc(ref, {
     category: menuItem.category,
     cost: menuItem.cost,
     name: menuItem.name,
     options: menuItem.options,
     price: menuItem.price,
     stock: menuItem.stock,
   })
    .then(() => {
      setErrors({
        name: '',
        description: '',
        price: '',
        stock: '',
        cost: '',
        category: ''
      });
      setOpenAlert(true);
     })
    .catch((error) => {
       console.log(error);
     });
  }
 };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMenuItem((prevMenuItem) => ({...prevMenuItem, [name]: value }));
    setErrors((prevErrors) => ({...prevErrors, [name]: '' }));
  };

 
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const backToMenu = () => {
    router.push('/menu');
  }

 return (
  <Layout>
  <SnackBar  
      open={openAlert}  
      onClose={handleCloseAlert} 
      message={"update menu item successfully!"}
      severity={"success"}
    />
   <Grid container spacing={2}>
    <Grid item xs={12}>
      <Button variant="contained" color="primary" onClick={backToMenu}>
        Back
      </Button>
    </Grid>
     <Grid item xs={12}>
       <TextField
          label="Name"
          name="name"
          value={menuItem.name}
          onChange={handleInputChange}
          error={errors.name ? true : false}
          helperText={errors.name}
          fullWidth
          required
       />
     </Grid>
     <Grid item xs={12}>
       <TextField
         label="Category"
         name="category"
         value={menuItem.category}
         onChange={handleInputChange}
         error={errors.category ? true : false}
         helperText={errors.category}
         fullWidth
         required
       />
     </Grid>
     <Grid item xs={12}>
       <TextField
         label="Price"
         name="price"
         value={menuItem.price}
         onChange={handleInputChange}
         error={errors.price ? true : false}
         helperText={errors.price}
         inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
         fullWidth
         required
       />
     </Grid>
     <Grid item xs={12}>
       <TextField
         label="Stock"
         name="stock"
         value={menuItem.stock}
         onChange={handleInputChange}
         error={errors.stock ? true : false}
         helperText={errors.stock}
         inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
         fullWidth
         required
       />
     </Grid>
     <Grid item xs={12}>
       <TextField
         label="Cost"
         name="cost"
         value={menuItem.cost}
         onChange={handleInputChange}
         error={errors.cost ? true : false}
         helperText={errors.cost}
         inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
         fullWidth
         required
       />
     </Grid>
     <Grid item xs={12}>
       <FormControl fullWidth>
         <InputLabel id="options-label">Options</InputLabel>
         <Select
           labelId="options-label"
           id="options"
           name="options"
           value={menuItem.options}
           onChange={handleInputChange}
           fullWidth
           required
         >
           <MenuItem value="small">Small</MenuItem>
           <MenuItem value="medium">Medium</MenuItem>
           <MenuItem value="large">Large</MenuItem>
         </Select>
       </FormControl>
     </Grid>
     <Grid item xs={12}>
       <Button variant="contained" color="primary" onClick={handleSave}>
         Save Changes
       </Button>
     </Grid>
   </Grid>
  </Layout>
 );
};

export default EditMenuPage;
