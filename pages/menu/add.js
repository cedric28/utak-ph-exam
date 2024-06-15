import React, { useState } from 'react';
import { Grid, Button, TextField, Select, MenuItem, InputLabel } from '@material-ui/core';
import { useRouter } from "next/router";
import { db } from '../../src/config/firebase';
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import Layout from '../../components/common/layout/layout';
import SnackBar from '../../components/common/snackbar/snackbar';

const AddMenuPage = () => {
  const router = useRouter();
  const [openAlert, setOpenAlert] = useState(false);
  const [menuItem, setMenuItem] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    cost: '',
    options: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    cost: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setMenuItem((prevMenuItem) => ({...prevMenuItem, [name]: value }));
    setErrors((prevErrors) => ({...prevErrors, [name]: '' }));
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
  
    if (name === 'price' || name === 'stock' || name === 'cost') {
      if (!/^[0-9\.]+$/.test(value)) {
        event.preventDefault();
        return;
      }
    }
  
    setMenuItem((prevMenuItem) => ({ ...prevMenuItem, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSave = async () => {
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

    const col = collection(db, "menu");

    const q = query(col, where("category", "==", menuItem.category), where("name", "==", menuItem.name));
    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: 'Name already exists',
        category: 'Category already exists',
      }));
      return;
    }

    addDoc(col, {
      category: menuItem.category,
      cost: menuItem.cost,
      name: menuItem.name,
      options: menuItem.options,
      price: menuItem.price,
      stock: menuItem.stock,
    })
    .then(() => {
      // Clear all fields
      setMenuItem({
        name: '',
        description: '',
        price: '',
        stock: '',
        cost: '',
        category: ''
      });

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
  const isDisabled = errors.name || errors.category || errors.price || errors.stock || errors.cost || errors.options;
  return (
    <Layout>
      <SnackBar  
          open={openAlert}  
          onClose={handleCloseAlert} 
          message={"added new menu item successfully!"}
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
            onInput={handleInput}
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
            onInput={handleInput}
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
            onInput={handleInput}
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
            onInput={handleInput}
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
            onInput={handleInput}
            error={errors.cost ? true : false}
            helperText={errors.cost}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
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
          {errors.options && <div style={{ color: 'ed' }}>{errors.options}</div>}
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={isDisabled}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AddMenuPage;