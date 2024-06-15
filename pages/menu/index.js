import React, { useState, useEffect } from 'react';
import { Grid, Button, TextField } from '@material-ui/core';
import { DataGrid,useGridApiRef  } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { db } from '../../src/config/firebase';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { collection, getDocs, doc, deleteDoc, query, limit, orderBy, startAfter } from "firebase/firestore";
import SnackBar from '../../components/common/snackbar/snackbar';
import Layout from '../../components/common/layout/layout';
import { useRouter } from "next/router";


const MenuPage = () => {
  const router = useRouter();
  const apiRef = useGridApiRef();
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(1); // added page state

  const getMenus = async () => {
    try {
      const col = collection(db, "menu");
      let q = query(col, orderBy("name"), limit(pageSize));
      if (lastVisible) {
        q = query(col, orderBy("name"), startAfter(lastVisible), limit(pageSize));
      }
      const snapshot = await getDocs(q);
      const newMenuItems = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      });
      setMenuItems(prevMenuItems => [...prevMenuItems,...newMenuItems]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.size === pageSize);
      setRowCount(snapshot.size);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!menuItems.length) {
      setLoading(true);
      getMenus();
    }
  }, [menuItems]);

  const handleDelete = async (id) => {
    try {
      const ref = doc(db, "menu", id);
      await deleteDoc(ref);
      setOpenAlert(true);
      await getMenus(); // Call getMenus again to refresh the list
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (id) => {
    router.push(`/menu/${id}`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMenuItems = menuItems?.filter((item) => {
    return (
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const handlePageChange = (params) => {
    setPage(params.page);
    setLastVisible(null);
    setLoading(true);
    getMenus();
  };
  
  const handlePageSizeChange = (params) => {
    apiRef.current.setPageSize(params.pageSize);
    setPage(1); // reset page to 1 when page size changes
    setLastVisible(null);
    setLoading(true);
    getMenus();
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'cost', headerName: 'Cost', width: 100 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'stock', headerName: 'Stock', width: 100 },
    { field: 'options', headerName: 'Options', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div>
          <Button variant="contained" color="success" startIcon={<EditIcon />} onClick={() => handleEdit(params.row.id)}>Edit</Button>
          <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={() => handleDelete(params.row.id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Typography component="h1" variant="h5">
        UTAK MENU
      </Typography>
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Button variant="contained" color="primary"  startIcon={<AddIcon />} onClick={() => router.push('/menu/add')}>
            Add New Menu Item
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={handleSearch}
          fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            rows={filteredMenuItems}
            columns={columns}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            page={page}
            rowCount={rowCount}
            loading={loading}
            pageSizeOptions={[10, 20, 30]}
            initialState={{ pagination: { paginationModel: { pageSize: 10}} }}
            apiRef={apiRef}
            autoHeight
          />
        </Grid>
        <SnackBar  
          open={openAlert}  
          onClose={handleCloseAlert} 
          message={"Menu item deleted successfully!"}
          severity={"success"}
        />
      </Grid>
    </Layout>
  );
};

export default MenuPage;