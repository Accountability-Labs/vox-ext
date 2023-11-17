import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { apiRequest } from '~util';
import { ApiKey, api } from "~constants";
import { Storage } from "@plasmohq/storage"
import { Notification } from '~notes';
import { useState } from "react";

const defaultTheme = createTheme();
const storage = new Storage()

function RegistrationForm() {
    const [notification, setNotification] = useState({ severity: "", text: "" })

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        apiRequest(api.postUser, Object.fromEntries(data)).then(async (jsonResp) => {
            await storage.set(ApiKey, jsonResp[ApiKey]);
            console.info(await storage.get(ApiKey));
            setNotification({ severity: "success", text: "Successfully registered!" });
        }).catch((err) => {
            setNotification({ severity: "error", text: err });
        });
    };

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="user-name"
                            name="user_name"
                            required
                            fullWidth
                            id="user_name"
                            label="Username"
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}>
                    Sign Up
                </Button>
            </Box>
            <Notification severity="info" text={< Typography > Once registered, visit <Link href="https://www.nytimes.com/2017/08/15/us/politics/trump-charlottesville-white-nationalists.html">this link</Link> to see the extension in action.</Typography >} />
            <Notification severity={notification.severity} text={notification.text} />
        </Box>
    )
}

function RegistrationPage() {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <RegistrationForm />
            </Container>
        </ThemeProvider>
    );
}

export default RegistrationPage;