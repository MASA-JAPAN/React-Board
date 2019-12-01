import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Board from "./../components/Board";
import BoardList from "./../components/BoardList";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useParams
} from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

import * as firebase from "firebase/app";
import { firebaseConfig } from "./../firebaseConfig";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    },
    flexGrow: 1
  },
  board: {
    width: "fit-content",
    color: "rgb(0, 0, 0)"
  },
  boardList: {
    paddingTop: "10px",
    width: "fit-content"
  },
  paper: {
    padding: theme.spacing(3, 2)
  }
}));

export default function DetailPage() {
  const [docId, setdocId] = useState("");
  const [title, set_title] = useState("");
  const [newFlag, setNewFlag] = useState(false);
  const [boardDetails, setBoardDetails] = useState([]);
  const classes = useStyles();
  const history = useHistory();
  let { Id } = useParams();
  console.log(Id);

  useEffect(() => {
    retrieveAndSetBoardDetails();
  });

  let db = firebase.firestore();

  db.collection("Board")
    .doc(Id)
    .get()
    .then(querySnapshot => {
      console.log("a");
      setdocId(querySnapshot.id);
      set_title(querySnapshot.data().Title);
    });

  const handlePressEnter = e => {
    let tmpBoardDetail = {
      Type: "BoardDetail",
      Board: Id,
      Value: e.target.value
    };
    console.log(e.keyCode);
    if (e.keyCode == "13") {
      saveBoardDetail(tmpBoardDetail);
      retrieveAndSetBoardDetails();
    }
  };

  const saveBoardDetail = tmpBoardDetail => {
    setNewFlag(false);
    db.collection("BoardDetail")
      .add(tmpBoardDetail)
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  };

  const retrieveAndSetBoardDetails = () => {
    let tmpBoardDetails = [];
    db.collection("BoardDetail")
      .where("Board", "==", Id)
      .get()
      .then(querySnapshot => {
        console.log("querySnapshot:" + querySnapshot);
        querySnapshot.forEach(doc => {
          const tmpBoardDetail = {
            Board: doc.data().Board,
            Type: doc.data().Type,
            Value: doc.data().Value
          };
          console.log("boardDetails:" + boardDetails.length);
          tmpBoardDetails.push(tmpBoardDetail);
        });
        setBoardDetails(tmpBoardDetails);
        console.log(tmpBoardDetails);
      });
  };

  return (
    <div className={classes.root}>
      <Fab color="primary" aria-label="add" onClick={() => history.push("/")}>
        <EmojiObjectsIcon />
      </Fab>
      {title != "" && (
        <div>
          <div className={classes.board}>
            <Board title={title} />
          </div>
          {Number(boardDetails.length) != 0 &&
            boardDetails.map(boardDetail => (
              <div>
                <Paper className={classes.paper}>{boardDetail.Value}</Paper>
              </div>
            ))}
          <div className={classes.boardList}>
            {!newFlag && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => setNewFlag(true)}
              >
                New
              </Button>
            )}
            {newFlag && (
              <Paper className={classes.paper}>
                <TextField
                  id="outlined-basic"
                  label="New"
                  variant="outlined"
                  onKeyDown={e => handlePressEnter(e)}
                />
              </Paper>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
