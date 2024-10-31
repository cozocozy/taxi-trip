import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const LocationDialog = ({ open, onClose }) => {
    const [isPickup, setIsPickup] = useState(true);

    const handlePickupClick = () => {
        onClose('pickup');
        setIsPickup(false); // Show Dropoff option next
    };

    const handleDropoffClick = () => {
        onClose('dropoff');
        setIsPickup(true); // Show Pickup option next
    };

    return (
        <Dialog open={open} onClose={() => onClose(null)}>
            <DialogTitle />
            <DialogContent>
                <p>Would you like to mark this location?</p>
            </DialogContent>
            <DialogActions>
                {isPickup ? (
                    <button onClick={handlePickupClick}  className="bg-indigo-500 px-4 py-2 rounded-md text-white shadow-md text-sm">
                        Pick Up
                    </button>
                ) : (
                    <button onClick={handleDropoffClick} className="bg-indigo-500 px-4 py-2 rounded-md text-white shadow-md text-sm" >
                        Drop Off
                    </button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default LocationDialog;
