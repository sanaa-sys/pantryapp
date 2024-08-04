import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase'; // Use the correct import
import { Box, Button, Modal, Typography, Stack, TextField } from '@mui/material';
import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    deleteDoc,
    getDoc,
} from 'firebase/firestore'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function PantryForm() {
    const [open, setOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [items, setItems] = useState([]);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [updateItemName, setUpdateItemName] = useState('');
    const [updateQuantity, setUpdateQuantity] = useState(0);
    const [currentItem, setCurrentItem] = useState(null); // To store the current item being updated
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleUpdateOpen = (item) => {
        setCurrentItem(item);
        setUpdateItemName(item.name);
        setUpdateQuantity(item.quantity);
        setUpdateOpen(true);
    };
    const handleUpdateClose = () => setUpdateOpen(false);

    const removeItem = async (itemName) => {
        try {
            const itemRef = doc(collection(db, "pantry"), itemName);
            const itemSnap = await getDoc(itemRef);
            if (itemSnap.exists()) {
                const { quantity } = itemSnap.data();
                if (quantity === 1) {
                    await deleteDoc(itemRef);
                } else {
                    await setDoc(itemRef, { quantity: quantity - 1 });
                }
            }
            await fetchItems();
        } catch (error) {
            console.error("Error removing item: ", error);
        }
    };

    const addItem = async (itemName) => {
        try {
            const itemRef = doc(collection(db, "pantry"), itemName);
            const itemSnap = await getDoc(itemRef);
            if (itemSnap.exists()) {
                const { quantity } = itemSnap.data();
                await setDoc(itemRef, { quantity: quantity + 1 });
            } else {
                await setDoc(itemRef, { quantity: 1 });
            }
            await fetchItems();
        } catch (error) {
            console.error("Error adding item: ", error);
        }
    };

    const updateItem = async () => {
        try {
            if (currentItem.name !== updateItemName) {
                // Name has changed, create new doc and delete old doc
                const newItemRef = doc(collection(db, "pantry"), updateItemName);
                await setDoc(newItemRef, { quantity: parseInt(updateQuantity, 10) });
                const oldItemRef = doc(collection(db, "pantry"), currentItem.name);
                await deleteDoc(oldItemRef);
            } else {
                // Name has not changed, just update quantity
                const itemRef = doc(collection(db, "pantry"), currentItem.name);
                await setDoc(itemRef, { quantity: parseInt(updateQuantity, 10) }, { merge: true });
            }
            await fetchItems();
            handleUpdateClose();
        } catch (error) {
            console.error("Error updating item: ", error);
        }
    

    };
    const fetchItems = async () => {
        try {
            const itemsCollection = collection(db, 'pantry');
            const docs = await getDocs(itemsCollection);
            const itemsList = [];
            docs.forEach((doc) => {
                itemsList.push({ name: doc.id, ...doc.data() });
            });
            setItems(itemsList);
        } catch (error) {
            console.error("Error fetching items: ", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <Box
            width="100vw"
            height="100vh"
            display={'flex'}
            justifyContent={'center'}
            flexDirection={'column'}
            alignItems={'center'}
            gap={2}
        >
            <Typography variant="h3">Pantry App</Typography>
            <Typography variant="h6" gap={2}>By Ayesha Ali</Typography>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Item
                    </Typography>
                    <Stack width="100%" direction={'row'} spacing={2}>
                        <TextField
                            id="outlined-basic"
                            label="Item"
                            variant="outlined"
                            fullWidth
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            onClick={() => {
                                addItem(itemName);
                                setItemName('');
                                handleClose();
                            }}
                        >
                            Add
                        </Button>
                    </Stack>
                </Box>
            </Modal>
            <Button variant="contained" onClick={handleOpen}>
                Add New Item
            </Button>
            <Box border={'1px solid #333'}>
                <Box
                    width="850px"
                    height="100px"
                    bgcolor={'#ADD8E6'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <Typography variant={'h2'} color={'#333'} textAlign={'center'} >
                        Inventory Items
                    </Typography>
                </Box>
                <TextField
                    id="outlined-search"
                    label="Search Item"
                    fullWidth
                    type="search"
             
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Stack spacing={2} padding={2}>
                    {filteredItems.map((item) => (
                        <Box
                            key={item.name}
                            width="800px"
                            height="50px"
                            bgcolor={'#f0f0f0'}
                            display={'flex'}
                            overflow={'auto'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            border={'1px solid #ddd'}
                            
                        >
                            <Typography variant={'body1'} sx={{ marginLeft: 2 }}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Typography>
                            <Typography variant={'h6'} color={'#333'} textAlign={'center'} sx={{ marginLeft: 40, position: 'absolute' }}>
                                Quantity: {item.quantity}
                            </Typography>
                            <Button
                                sx={{ marginLeft: 70, position: 'absolute' }}
                                variant="outlined"
                                onClick={() => handleUpdateOpen(item)}
                            >
                                Update
                            </Button>
                            <Button variant="outlined" sx={{ marginRight: 2 }} color="primary" onClick={() => removeItem(item.name)}>Remove</Button>
                        </Box>
                    ))}
                </Stack>
            </Box>
            <Modal
                open={updateOpen}
                onClose={handleUpdateClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Update Item
                    </Typography>
                    <Stack width="100%" direction={'column'} spacing={2}>
                        <TextField
                            id="outlined-basic"
                            label="Item"
                            variant="outlined"
                            fullWidth
                            value={updateItemName}
                            onChange={(e) => setUpdateItemName(e.target.value)}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Quantity"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={updateQuantity}
                            onChange={(e) => setUpdateQuantity(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            onClick={updateItem}
                        >
                            Update Item
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </Box>
    );
}
