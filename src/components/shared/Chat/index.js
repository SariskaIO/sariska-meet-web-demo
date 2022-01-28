import React, {useEffect, useRef, useState} from "react";
import {
    Avatar,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    makeStyles,
    Typography
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import SendIcon from "@material-ui/icons/Send";
import {color} from "../../../assets/styles/_color";
import { formatAMPM } from "../../../utils";		


const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "90%",
        right: "2px",
        justifyContent: "space-between",
        margin: theme.spacing(3, 0, 0, 0),
    },
    form: {
        textAlign: 'center',
        "& fieldset": {
            border: 'none'
        }
    },
    margin: {
        width: '100%',
        margin: theme.spacing(1, 0),
        "& label": {
            fontSize: '0.8rem',
            color: color.secondary,
        },
        "& .MuiFormLabel-root.Mui-focused": {
            color: color.secondary
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: `${color.secondary} !important`
        },
        "& .MuiOutlinedInput-root.Mui-focused": {
            "& svg": {
                color: color.secondary
            }
        }
    },
    input: {
        background: color.lightgray,
        borderRadius: "30px",
        "& svg": {
            color: color.secondaryLight
        }
    },
    chatList: {
        overflow: "auto",
        height: "100%",
        boxSizing: 'border-box',
        "& .MuiAvatar-root": {
            width: '30px',
            height: '30px',
            fontSize: '0.8rem'
        },
        "& span": {
            fontSize: '0.875rem'
        },
        "& p": {
            fontSize: "0.75rem"
        }
    },
    listItem: {
        alignItems: 'flex-start'
    },
    listItemText: {
        paddingRight: '5px',
        wordBreak: 'break-word',
        marginTop: 0
    },
    time: {
        whiteSpace: 'nowrap'
    }
}));

const ChatPanel = ({setUnread}) => {
    const classes = useStyles();
    const conference = useSelector((state) => state.conference);
    const messages = useSelector((state) => state.message);
    const [currentMessage, setCurrentMessage] = useState("");
    const avatarColors = useSelector(state=>state.color);
    const refEl = useRef(null);


    const handleChange = (event) => {
        setCurrentMessage(event.target.value);
    };

    const scrollRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(()=> {
            scrollRef.current.scrollIntoView({behavior: 'smooth'})
        }, 0);
    }

    const handleClickSubmit = (e) => {
        e.preventDefault();
        conference.sendMessage(currentMessage);
        setCurrentMessage("");
    }

    const handleMouseDown = (event) => {
        event.preventDefault();
    };

    useEffect(()=>{
        const handler  = (e)=>{
            if (refEl?.current?.contains(e.target)) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
        document.addEventListener('dblclick', handler, true);
        return ()=>{
            document.removeEventListener('dblclick', handler);
        }
    },[])

    useEffect(() => {
        scrollToBottom();
    }, [messages.length])

    return (
        <Box ref={refEl} className={classes.root}>
            <List className={classes.chatList}>
                {messages.map((newMessage, index) => (
                    <ListItem key={index} className={classes.listItem}>
                        <ListItemAvatar>
                            <Avatar src={ newMessage?.user?.avatar ? newMessage?.user?.avatar : null } style={{background: avatarColors[newMessage?.user?.id], marginTop: '5px'}} >{newMessage?.user?.name?.toUpperCase()?.slice(0, 1)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={newMessage?.user?.name}
                            secondary={newMessage?.text}
                            className={classes.listItemText}
                        />
                        <Typography variant = "caption" className={classes.time}>{formatAMPM(newMessage?.time)}</Typography>
                    </ListItem>
                ))}
                <ListItem ref={scrollRef} style={{height: '18px'}}></ListItem>
            </List>
            <form onSubmit={handleClickSubmit} className={classes.form}>
                <FormControl
                    className={clsx(classes.margin, classes.textField)}
                    variant="outlined"
                >
                    <InputLabel htmlFor="outlined-adornment-submit">
                        Type Here
                    </InputLabel>
                    <OutlinedInput
                        autoComplete='off'
                        id="outlined-adornment-submit"
                        value={currentMessage}
                        onChange={handleChange}
                        className={classes.input}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="handle submit"
                                    onClick={handleClickSubmit}
                                    onMouseDown={handleMouseDown}
                                    edge="end"
                                >
                                    <SendIcon/>
                                </IconButton>
                            </InputAdornment>
                        }
                        labelWidth={70}
                    />
                </FormControl>
            </form>
        </Box>
    );
};

export default ChatPanel;
