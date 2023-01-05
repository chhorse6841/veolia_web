import { Avatar, makeStyles, Popover, Typography } from "@material-ui/core";
import { Button } from "aws-amplify-react";
import NoContainer from "@material-ui/icons/HighlightOffOutlined";
import Broken from "@material-ui/icons/BrokenImage";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/config";
import { SUBPROBLEM_IDS } from "../utils/jira";
import "./Subtask.css";

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const Subtask = ({ subtask = null }) => {
  const [task, setTask] = useState();

  const loadTask = (url) => {
    fetch(url)
      .then((succes) => succes.json())
      .then((success) => {
        console.log(JSON.parse(success));
        setTask(JSON.parse(success));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (subtask) {
      const url = `${BASE_URL}/getticketdetails/${subtask.key}`;
      loadTask(url);
    } else {
      setTask(null);
    }
  }, [subtask]);

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="div-subtask">
      <div className="div-subtask-key">
        {subtask.key + " : " + subtask.fields?.summary}
      </div>
      <div className="div-subtask-options">
        <div>
          <Avatar
            className="subtask-avatar"
            src={task?.reporter?.avatarUrls["32x32"]}
          />
        </div>
        <div className="div-subtask-status">{subtask.fields?.status?.name}</div>
        <div>
          {task?.subProblems?.some(
            (item) => item.id === SUBPROBLEM_IDS.containerNotAvailable
          ) ? (
            <Typography
              aria-owns={open ? "container-not-popover" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <NoContainer />
            </Typography>
          ) : (
            <></>
          )}
        </div>
        <div>
          {task?.subProblems?.some(
            (item) => item.id === SUBPROBLEM_IDS.containerDamaged
          ) ? (
            <Typography
              aria-owns={open ? "container-damaged-popover" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Broken />
            </Typography>
          ) : (
            <></>
          )}
        </div>
        <Popover
          id="container-damaged-popover"
          className={classes.popover}
          classes={{
            paper: classes.paper,
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          Container damaged.
        </Popover>

        <Popover
          id="container-not-popover"
          className={classes.popover}
          classes={{
            paper: classes.paper,
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          Container not available.
        </Popover>
      </div>
    </div>
  );
};

export default Subtask;
