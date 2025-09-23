import React from "react";

import { Alert, Snackbar } from "@mui/material";

const Toastify = ({ alertState, setAlertState }) => {
    const setMaxError = (message) => {
        if (message?.length > 200) {
            return message?.slice(0, 200) + "...";
        }

        return message;
    };
    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={alertState.open}
            autoHideDuration={3000}
            key={"top" + "center"}
            onClose={() => setAlertState({ ...alertState, open: false })}
            sx={{ maxWidth: "600px" }}
        >
            <Alert
                onClose={() => setAlertState({ ...alertState, open: false })}
                severity={alertState.severity}
                sx={{ maxWidth: "600px" }}
            >
                {setMaxError(alertState.message)}
            </Alert>
        </Snackbar>
    );
};

export default Toastify;
