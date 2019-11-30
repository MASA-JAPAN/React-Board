import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import Grid from "@material-ui/core/Grid";
import Board from "./../components/Board";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import SaveButton from "./../components/SaveButton";
import SaveIcon from "@material-ui/icons/Save";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useLocation,
  useParams
} from "react-router-dom";
import DetailPage from "./DetailPage";

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

function TopPage() {
  const history = useHistory();
  const classes = useStyles();
  const [boards, setboards] = useState([]);
  const [newTitle, setnewTitle] = useState("");
  const [countId, setcountId] = useState(1);

  const handleClickSave = title => {
    const tmpBoards = [...boards, { Id: countId, Title: title }];
    console.log("b");
    if (title != "") {
      setboards(tmpBoards);
      setcountId(countId + 1);
      console.log(tmpBoards);
    }
  };

  return (
    <div className={classes.root}>
      <Fab color="primary" aria-label="add" onClick={() => history.push("/")}>
        <EmojiObjectsIcon />
      </Fab>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>
          <Paper className={classes.root2}>
            <div className={classes.div}>
              <TextField
                label="Title"
                onChange={e => setnewTitle(e.target.value)}
              />
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => handleClickSave(newTitle)}
              >
                <SaveIcon />
              </Fab>
            </div>
          </Paper>
          {boards.map(board => (
            <div onClick={() => history.push("/DetailPage/")}>
              <Board title={board.Title} key={board.Id} />
            </div>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}

export default function TopPageRouter() {
  const classes = useStyles();
  return (
    <Router>
      <div className={classes.root}>
        <Switch>
          <Route path="/" exact>
            <TopPage />
          </Route>
          <Route path="/DetailPage" exact>
            <DetailPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
