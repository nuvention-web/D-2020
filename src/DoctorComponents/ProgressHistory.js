import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { db } from "../Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../contexts/UserContext";
import { useLocation, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
// import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    color: "#80858a",
  },
  accentDivider: {
    content: "",
    display: "block",
    width: "6.25rem",
    height: ".325rem",
    marginTop: "1.5rem",
    background: "#9DB4FF",
  },
  loadingContainer: {
    textAlign: "center",
    paddingTop: "30vh",
  },
  progressChart: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 40,
  },
}));

// const data01 = [
//   { x: 10, y: 30 },
//   { x: 30, y: 200 },
//   { x: 45, y: 100 },
//   { x: 50, y: 400 },
//   { x: 70, y: 150 },
//   { x: 100, y: 250 },
// ];
// const data02 = [
//   { x: 30, y: 20 },
//   { x: 50, y: 180 },
//   { x: 75, y: 240 },
//   { x: 100, y: 100 },
//   { x: 120, y: 190 },
// ];

const ProgressHistory = (props) => {
  const classes = useStyles();
  // currUser is logged in user (therapist)
  const currUser = useContext(UserContext).user;
  const [historyData, setHistoryData] = useState();
  const [loaded, setLoaded] = useState(false);

  // patient id
  const { id } = useParams();

  useEffect(() => {
    console.log("currUser.uid", currUser.uid);
    console.log("id", id);
    if (typeof id !== "undefined") {
      // Dictionary with key = exercise name, value = [{date: ..., pain:...}]
      const tempHistoryData = {};
      var patientRef = db.collection("patients").doc(id).collection("history");

      patientRef
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const entry = {};
            console.log("doc.data()", data);
            console.log("data.date", data.date);
            entry.time = data.date.toDate().getTime();
            console.log("entry w time", entry);
            entry.pain = data.painLevel;

            // If key does not exist yet
            if (tempHistoryData[data.exercise] === undefined) {
              tempHistoryData[data.exercise] = [entry];
            }
            // Append to existing array
            else {
              tempHistoryData[data.exercise].push(entry);
            }
            // const id = doc.id;
            // exerciseArr.push({ ...data, id });
          });
        })
        .then(() => {
          console.log("tempHistoryData", tempHistoryData);
          setHistoryData(tempHistoryData);
          //   setExerciseType(exerciseArr);
        });
    }
  }, [id]);

  useEffect(() => {
    if (typeof historyData !== "undefined" && historyData.length !== 0) {
      setLoaded(true);
    }
  }, [historyData]);

  const renderTable = () => {
    return (
      <div className={classes.root}>
        <Container>
          <Typography variant="h3">Progress Overview</Typography>
          <div className={classes.accentDivider}></div>

          <div>
            <ScatterChart
              className={classes.progressChart}
              width={600}
              height={400}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid />
              {/* tickFormatter={timeStr => moment(timeStr).format('HH:mm')} */}
              <XAxis
                scale="time"
                type="number"
                domain={["dataMin", "dataMax"]}
                dataKey={"time"}
                name="time"
                tickFormatter={(timeStr) =>
                  new Date(timeStr).toString().slice(0, 15)
                }
                label="Day"
              />
              <YAxis
                type="number"
                domain={[0, 10]}
                interval="0"
                dataKey={"pain"}
                name="pain"
                label="Pain Level"
              />
              <ZAxis range={[100]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              {console.log("map", Object.entries(historyData))}
              {Object.entries(historyData).map((d, i) => (
                // console.log('d',d,'d[1',d[1],'i',i)
                <Scatter
                  name={d[0]}
                  data={d[1]}
                  fill={"#" + Math.random().toString(16).substr(-6)}
                  line
                  shape="cross"
                />
              ))}
              {/* <Scatter name='A school' data={data01} fill='#8884d8' line shape="cross" /> */}
              {/* <Scatter name='B school' data={data02} fill='#82ca9d' line shape="diamond" /> */}
            </ScatterChart>
          </div>
        </Container>
      </div>
    );
  };

  const renderLoading = () => {
    return (
      <Container className={classes.loadingContainer}>
        <CircularProgress />
      </Container>
    );
  };

  return <div>{loaded ? renderTable() : renderLoading()}</div>;
};

export default ProgressHistory;
