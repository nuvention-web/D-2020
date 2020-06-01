import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { db, firebase } from "../Firebase";
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
// import { firebase } from "../Firebase.js";
// import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    color: "#80858a",
  },
  header: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 28,
    },
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
  stats: {
    textAlign: "center",
    marginTop: "30px",
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
  const [subCollections, setSubCollections] = useState();
  // patient id
  const { id } = useParams();

  // getSubCollection function from firebase cloud functions
  const getSubCollections = firebase
    .functions()
    .httpsCallable("getSubCollections");

  useEffect(() => {
    getSubCollections({
      docPath: `/patients/${id}/exercises/weekEx`,
    })
      .then((result) => {
        let collections = result.data.collections;
        console.log("These are subcollections: ", collections);
        setSubCollections(collections);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof id !== "undefined") {
        // Dictionary with key = exercise name, value = [{date: ..., pain:...}]
        var tempHistoryData = {};
        if (subCollections) {
          subCollections.map((collection) => {
            db.collection("patients")
              .doc(id)
              .collection("exercises")
              .doc("weekEx")
              .collection(collection)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  const entry = {};
                  // console.log("doc.data()", data);
                  const created = new Date(collection);
                  created.setDate(created.getDate() + data.day - 1);
                  entry.time = created.getTime();
                  // entry.time = new Date(data.date).toLocaleString();
                  // console.log("entry w time", entry);
                  entry.pain = data.painLevel;

                  // If key does not exist yet
                  if (tempHistoryData[data.name] === undefined) {
                    tempHistoryData[data.name] = [entry];
                  }
                  // Append to existing array
                  else {
                    tempHistoryData[data.name].push(entry);
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
          );
        }
      }
    };
    fetchData();
  }, [id, subCollections]);

  useEffect(() => {
    console.log('setload rerunning')
    if (typeof historyData !== "undefined" && historyData.length !== 0) {
      var total = Object.values(historyData).reduce((sum, elt) => sum + (elt.length ? elt.length : 1), 0)
      console.log('total', total)
      console.log('historydata', historyData)
      // if (total === 8) {
        setLoaded(true);
      // }
    }
  }, [historyData]);

  // To count how many of assigned exercises have pain values
  const countComplete = (d1) => {
    console.log("d1", d1);
    var ct = 0;
    for (let index = 0; index < d1.length; index++) {
      console.log(d1[index]);
      if (typeof d1[index].pain !== "undefined") {
        ct += 1;
      }
    }
    return ct;
  };

  const renderTable = () => {
    return (
      <div className={classes.root}>
        <Container>
          <Typography variant="h3" className={classes.header}>
            Progress Overview
          </Typography>
          <div className={classes.accentDivider}></div>

          <div>
            <ScatterChart
              className={classes.progressChart}
              width={800}
              height={500}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid />
              <XAxis
                type="number"
                domain={["auto", "auto"]}
                dataKey="time"
                name="time"
                // interval={0}
                minTickGap={2}
                tickFormatter={
                  (timeStr) =>
                    // console.log(new Date(timeStr).toLocaleString().slice(0, 9))
                    new Date(timeStr).toLocaleString().split("/",2).join("/")
                    
                }
              // label="Day"
              />
              <YAxis
                type="number"
                domain={[0, 10]}
                tickCount={10}
                interval={0}
                dataKey={"pain"}
                name="pain"
                label="Pain"
              />
              <ZAxis range={[100]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name, props) => (name === 'time') ? new Date(value).toLocaleString().slice(0, 9) : value}
              />
              <Legend />
              {console.log("map", Object.entries(historyData))}
              {Object.entries(historyData).map((d, i) => (
                <Scatter
                  name={d[0]}
                  data={d[1]}
                  fill={"#" + Math.random().toString(16).substr(-6)}
                  line
                />
              ))}
              {/* <Scatter name='A school' data={data01} fill='#8884d8' line shape="cross" /> */}
              {/* <Scatter name='B school' data={data02} fill='#82ca9d' line shape="diamond" /> */}
            </ScatterChart>
          </div>

          <div className={classes.stats}>
            <Typography variant="h4">Exercise Completion Statistics</Typography>
            ---
            {console.log('historyData', historyData)}

            {Object.entries(historyData).map((d, i) => (
              <Typography>
                {d[0]}: {countComplete(d[1])}/{d[1].length}
              </Typography>
            ))}
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
