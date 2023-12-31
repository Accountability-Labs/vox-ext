import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Rating from '@mui/material/Rating';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { styled } from '@mui/material/styles';
import { useState } from "react";
import { apiRequest, fmtTime, normalize } from "~util";
import { api } from "~constants";

const customIcons: {
    [index: string]: {
        icon: React.ReactElement;
        label: string;
    };
} = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon color="error" />,
        label: 'Not helpful',
    },
    2: {
        icon: <SentimentSatisfiedIcon color="warning" />,
        label: 'Somewhat helpful',
    },
    3: {
        icon: <SentimentVerySatisfiedIcon color="success" />,
        label: 'Very helpful',
    },
};

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));

function IconContainer(props: any) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

export function Notification({ severity, text }) {
    return (
        severity !== "" ?
            <Box m={2}>
                <Alert severity={severity}>{text}</Alert>
            </Box>
            :
            <> </>
    )
}

export function PostNote() {
    const [notification, setNotification] = useState({ severity: "", text: "" })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            apiRequest(api.postNote, { url: normalize(tabs[0].url), note: e.target[0].value })
                .then((response) => {
                    if ("error" in response) {
                        setNotification({ severity: "error", text: response.error })
                    } else {
                        setNotification({ severity: "success", text: "Note posted successfully!" })
                    }
                });
        });
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField multiline margin="normal" fullWidth id="outlined-basic" label="Add context for fellow readers..." variant="outlined" />
            <Button type="submit" fullWidth variant="contained">Submit</Button>
            <Notification severity={notification.severity} text={notification.text} />
        </Box>
    )
}

export function ShowNotes({ notes }) {
    return (
        notes.hasOwnProperty("length") && notes.length === 0 ?
            <Notification severity="info" text="Nobody has posted a note for this page." />
            :
            notes.length > 0 && notes.map((note) => (
                <Note
                    note_id={note.id}
                    vote={note.vote}
                    text={note.note}
                    createdBy={note.user_name}
                    createdAt={note.created_at}
                    updatedAt={note.updated_at.Time}
                />
            ))
    )
}

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    maxWidth: 400,
    color: theme.palette.text.primary,
}));

export function Note({ note_id, text, vote, updatedAt, createdAt, createdBy }) {
    const [notification, setNotification] = useState({ severity: "", text: "" })

    return (

        <StyledPaper
            sx={{
                my: 1,
                mx: 'auto',
                p: 2,
            }}
        >
            <Grid container columns={2}>
                <Grid item xs={1} md={1} sm={1}>
                    <Typography fontWeight="light" fontSize="1em">{fmtTime(createdAt)}</Typography>
                </Grid>
                <Grid item xs={1} md={1} sm={1}>
                    <Typography fontWeight="light" fontSize="1em">{createdBy}</Typography>
                </Grid>
                <Grid item xs={2} md={2} sm={2}>
                    <Typography variant="body2">{text}</Typography>
                </Grid>
                <Grid item xs={2} md={2} sm={2}>
                    <StyledRating
                        max={3}
                        name="highlight-selected-only"
                        defaultValue={vote.Valid ? vote.Int32 : null}
                        onChange={(event, vote) => {
                            apiRequest(api.postVote, { note_id: note_id, vote: vote })
                                .then((response) => {
                                    if ("error" in response) {
                                        setNotification({ severity: "error", text: response.error })
                                    } else {
                                        setNotification({ severity: "success", text: "Vote submitted successfully!" })
                                    }
                                });
                        }}
                        IconContainerComponent={IconContainer}
                        getLabelText={(value: number) => customIcons[value].label}
                        highlightSelectedOnly
                    />
                    <Notification severity={notification.severity} text={notification.text} />
                </Grid>
            </Grid>
        </StyledPaper>

    )
}