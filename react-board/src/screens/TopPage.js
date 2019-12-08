import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import Grid from "@material-ui/core/Grid";
import Board from "./../components/Board";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import SaveIcon from "@material-ui/icons/Save";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import DetailPage from "./DetailPage";
import DeleteIcon from "@material-ui/icons/Delete";

import * as firebase from "firebase/app";
import { firebaseConfig } from "./../firebaseConfig";

firebase.initializeApp(firebaseConfig);

require("firebase/firestore");
let db = firebase.firestore();

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
  paper: {
    padding: theme.spacing(3, 2)
  },
  inlineFlex: {
    display: "inline-flex"
  },
  createBoard: {
    padding: "10px"
  },
  board: {
    padding: "10px"
  },
  delete: {
    position: "absolute",
    right: "20px",
    bottom: "20px"
  }
}));

function TopPage() {
  const history = useHistory();
  const classes = useStyles();
  const [newTitle, setnewTitle] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    if (!loaded) {
      retrieveAndSetBoard();
      setLoaded(true);
    }
  });

  const handleClickSave = title => {
    if (title != "") {
      saveBoard(title);
      setnewTitle("");
    }
  };

  const saveBoard = title => {
    const tmpBoard = {
      Type: "Board",
      Title: title,
      LastmodifiedDateTime: Date.now()
    };
    db.collection("Board")
      .add(tmpBoard)
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        retrieveAndSetBoard();
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  };

  const retrieveAndSetBoard = () => {
    let tmpBoards = [];
    db.collection("Board")
      .orderBy("LastmodifiedDateTime")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const tmpBoard = {
            Title: doc.data().Title,
            Id: doc.id
          };
          tmpBoards.push(tmpBoard);
        });
        setBoards(tmpBoards);
      });
  };

  const handleDragStart = (e, id) => {
    let dataTransfer = e.dataTransfer;
    dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDrop = e => {
    e.preventDefault();
    db.collection("Board")
      .doc(e.dataTransfer.getData("text/plain"))
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
        retrieveAndSetBoard();
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error deleting document: ", error);
      });
    db.collection("BoardDetail")
      .where("Board", "==", e.dataTransfer.getData("text/plain"))
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log("Document successfully deleted!");
          doc.ref.delete();
        });
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error deleting document: ", error);
      });
    db.collection("BoardDetailContent")
      .where("Board", "==", e.dataTransfer.getData("text/plain"))
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log("Document successfully deleted!");
          doc.ref.delete();
        });
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error deleting document: ", error);
      });
  };

  return (
    <div className={classes.root}>
      <Fab color="primary" aria-label="add" onClick={() => history.push("/")}>
        <EmojiObjectsIcon />
      </Fab>
      <Grid container spacing={1}>
        <div className={classes.createBoard}>
          <Paper className={classes.paper}>
            <div className={classes.inlineFlex}>
              <TextField
                label="Title"
                onChange={e => setnewTitle(e.target.value)}
                value={newTitle}
              />
              <Fab
                color="primary"
                aria-label="add"
                onClick={e => handleClickSave(newTitle)}
              >
                <SaveIcon />
              </Fab>
            </div>
          </Paper>
        </div>
        {boards.map(board => (
          <div
            onClick={() => history.push("/DetailPage/" + board.Id)}
            className={classes.board}
            draggable="true"
            onDragStart={e => handleDragStart(e, board.Id)}
          >
            <Board title={board.Title} key={board.Id} />
          </div>
        ))}
      </Grid>
      <div onDragOver={e => handleDragOver(e)} onDrop={e => handleDrop(e)}>
        <DeleteIcon style={{ fontSize: 100 }} className={classes.delete} />
      </div>
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
          <Route path="/DetailPage/:Id" exact>
            <DetailPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
