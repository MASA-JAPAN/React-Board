import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import OutlineTextField from "./OutlineTextField";
import Detail from "./Detail";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

export default function BoardList(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" component="h3">
        {props.title}
      </Typography>
      <OutlineTextField />
      <Detail title="aaa" />
    </Paper>
  );
}
