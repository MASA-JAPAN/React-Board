import React from "react";
import { makeStyles, rgbToHex } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    backgroundColor: "#93ddff"
  },
  div: {
    display: "inline-flex"
  },
  checkBox: {
    position: "inherit"
  }
}));

export default function Board(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <div className={classes.div}>
        <Typography variant="h5" component="h3">
          {props.title}
        </Typography>
        <CheckIcon className={classes.checkBox} />
      </div>
    </Paper>
  );
}
