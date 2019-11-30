import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "./TextField";
import SaveButton from "./SaveButton";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  },
  div: {
    display: "inline-flex"
  }
}));

export default function CreateBoard(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <div className={classes.div}>
        <TextField />
        <SaveButton props={props.onClick} />
      </div>
    </Paper>
  );
}
