import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Board from "./../components/Board";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    },
    flexGrow: 1
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  root2: {
    padding: theme.spacing(3, 2)
  },
  div: {
    display: "inline-flex"
  }
}));

export default function FloatingActionButtons() {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className={classes.root}>
      <Fab color="primary" aria-label="add" onClick={() => history.push("/")}>
        <EmojiObjectsIcon />
      </Fab>
      <Board />
    </div>
  );
}
