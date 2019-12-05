import React, { useState, useEffect } from "react";
import { makeStyles, emphasize } from "@material-ui/core/styles";
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
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";

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
    color: "rgb(0, 0, 0)",
    display: "flex"
  },
  boardList: {
    paddingTop: "10px",
    width: "fit-content"
  },
  paper: {
    padding: theme.spacing(3, 2)
  },
  detailList: {
    display: "flex"
  },
  detailLists: {
    display: "flex"
  },
  newInput: {
    paddingTop: "10px",
    paddingBottom: "6px",
    paddingRight: "10px",
    paddingLeft: "10px"
  },
  delete: {
    position: "absolute",
    right: "20px",
    bottom: "20px"
  }
}));

export default function DetailPage() {
  const [docId, setdocId] = useState("");
  const [title, set_title] = useState("");
  const [newFlag, setNewFlag] = useState(false);
  const [boardDetails, setBoardDetails] = useState([]);
  const [boardDetailContents, setBoardDetailContents] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  let { Id } = useParams();

  let db = firebase.firestore();
  useEffect(() => {
    if (!loaded) {
      retrieveAndSetBoardDetails();
      retrieveAndSetBoardDetailContent();
      db.collection("Board")
        .doc(Id)
        .get()
        .then(querySnapshot => {
          setdocId(querySnapshot.id);
          set_title(querySnapshot.data().Title);
        });
      setLoaded(true);
    }
  });

  const handlePressEnter = e => {
    let tmpBoardDetail = {
      Type: "BoardDetail",
      Board: Id,
      Value: e.target.value
    };
    if (e.keyCode == "13") {
      saveBoardDetail(tmpBoardDetail);
      retrieveAndSetBoardDetails();
    }
  };

  const handlePressEnterInBoard = e => {
    let tmpBoardDetailContent = {
      Type: "BoardDetailContent",
      Board: Id,
      BoardDetail: e.target.id,
      Value: e.target.value
    };
    if (e.keyCode == "13") {
      saveBoardDetailContent(tmpBoardDetailContent);
      retrieveAndSetBoardDetailContent();
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

  const saveBoardDetailContent = tmpBoardDetailContent => {
    setNewFlag(false);
    db.collection("BoardDetailContent")
      .add(tmpBoardDetailContent)
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
        querySnapshot.forEach(doc => {
          const tmpBoardDetail = {
            Board: doc.data().Board,
            Type: doc.data().Type,
            Value: doc.data().Value,
            Id: doc.id
          };
          tmpBoardDetails.push(tmpBoardDetail);
        });
        setBoardDetails(tmpBoardDetails);
      });
  };

  const retrieveAndSetBoardDetailContent = () => {
    let tmpBoardDetailContents = [];
    db.collection("BoardDetailContent")
      .where("Board", "==", Id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const tmpBoardDetailContent = {
            Board: doc.data().Board,
            BoardDetail: doc.data().BoardDetail,
            Type: doc.data().Type,
            Value: doc.data().Value,
            Id: doc.id
          };
          tmpBoardDetailContents.push(tmpBoardDetailContent);
        });
        setBoardDetailContents(tmpBoardDetailContents);
      });
  };

  const handleDragStart = (e, id) => {
    let dataTransfer = e.dataTransfer;
    dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDrop = (e, id) => {
    console.log(e.dataTransfer.getData("text/plain"));
    e.preventDefault();
    db.collection("BoardDetailContent")
      .doc(e.dataTransfer.getData("text/plain"))
      .update({
        BoardDetail: id
      })
      .then(function() {
        console.log("Document successfully updated!");
        retrieveAndSetBoardDetailContent();
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  };

  const handleDropToDelete = e => {
    e.preventDefault();
    db.collection("BoardDetailContent")
      .doc(e.dataTransfer.getData("text/plain"))
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
        retrieveAndSetBoardDetailContent();
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error deleting document: ", error);
      });
    db.collection("BoardDetail")
      .doc(e.dataTransfer.getData("text/plain"))
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
        retrieveAndSetBoardDetails();
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {title != "" && (
            <div>
              <div className={classes.board}>
                <Board title={title} />
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
                  <Paper className={classes.newInput}>
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
        </Grid>
        {Number(boardDetails.length) != 0 &&
          boardDetails.map(boardDetail => (
            <Grid item xs={2}>
              <div
              //draggable="true"
              //onDragStart={e => handleDragStart(e, boardDetail.Id)}
              >
                <div
                  onDragOver={e => handleDragOver(e)}
                  onDrop={e => handleDrop(e, boardDetail.Id)}
                >
                  <Paper className={classes.paper}>
                    <p>{boardDetail.Value}</p>

                    <TextField
                      id={boardDetail.Id}
                      label="New"
                      variant="outlined"
                      onKeyDown={e => handlePressEnterInBoard(e)}
                    />
                    {boardDetailContents.map(boardDetailContent => (
                      <div>
                        {boardDetail.Id == boardDetailContent.BoardDetail && (
                          <div
                            draggable="true"
                            onDragStart={e =>
                              handleDragStart(e, boardDetailContent.Id)
                            }
                          >
                            <Paper>
                              <Board title={boardDetailContent.Value} />
                            </Paper>
                          </div>
                        )}
                      </div>
                    ))}
                  </Paper>
                </div>
              </div>
            </Grid>
          ))}
      </Grid>
      <div
        onDragOver={e => handleDragOver(e)}
        onDrop={e => handleDropToDelete(e)}
      >
        <DeleteIcon style={{ fontSize: 100 }} className={classes.delete} />
      </div>
    </div>
  );
}
