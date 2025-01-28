import React from "react";
import Container from "@material-ui/core/Container";
import axios from "axios";
import { Alert, AlertTitle } from "@material-ui/lab";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slider from "./Slider";
import {
  instructions,
  fluvius_instructions,
  infrabel_instructions,
  PROBLEMS,
} from "../config/config.js";
import swal from "sweetalert";
import * as jiraActionCreators from "../actions/JiraActions";
import { connect } from "react-redux";
import { compose, withProps } from "recompose";

import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import "../bootstrap.min.css";
import {
  withScriptjs,
  withGoogleMap,
} from "react-google-maps";
import { Avatar, Button, Switch, TextareaAutosize } from "@material-ui/core";
import { Image } from "@material-ui/icons";
import './IssueDetails.css';
import Subtask from "./Subtask";

function mapStateToProps(state) {
  return {
    issues: state.jira,
    details: state.details,
    authentication: state.authentication,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(jiraActionCreators, dispatch);
}

const useStyles = (theme) => ({
  container: {
    marginTop: "5rem",
  },
  button: {
    marginRight: "1rem",
  },
  table: {
    marginTop: "2rem",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  textFieldDense: {
    padding: theme.spacing(0),
  },
  languageDropdown: {
    marginRight: "0rem",
    position: "relative",
    right: "0rem",
  },
  keyColumn: {
    width: "20rem",
  },
  list: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class IssueDetails extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    this.props.getIssueDetails(this.props.match.params.id);
    this.state = {
      ...this.state,

      commentForm: {
        commentBoxOpen: false,
        comment: "",
        issueId: this.props.match.params.id,
        email: this.props.authentication.user.username,
        error: 0,
        success: 0,
      },
      problems: {
        closed: false,
        customerIsOwner: false,
        wrongClient: false,
        takeContact: false,
        extraContainers: false,
        other: false,
        comment: ""
      },
      comment: "",
      show: false,
      address: "-",
      addressFromGoogle: "",
      propsss: this.props.details.detail.location,
    };
    this.getAddressFromUrl = this.getAddressFromUrl.bind(this);
    this.showLocationOnMap = this.showLocationOnMap.bind(this);
    this.handleProblems = this.handleProblems.bind(this);
  }

  getDetails = (key) => {
    this.props.getIssueDetails(key);
  };
  componentDidMount() {
    if (this.props.details.detail.location) {
      this.getGoogleMapAddressFromLocation(this.props.details.detail.location);
    }
  }
  component;
  handleClickOpen = () => {
    this.setState({
      ...this.state,
      commentForm: {
        commentBoxOpen: true,
        comment: "",
        issueId: this.props.match.params.id,
        email: this.props.authentication.user.username,

        error: 0,
        success: 0,
      },
    });
  };

  filterNoValues = (value) => {
    if (!value || !value.startsWith) {
      return "";
    }
    return value.startsWith("{{this.fields") || value.startsWith("nul")
      ? ""
      : value;
  };

  prevIssue = () => {
    const data = localStorage.getItem("issues");
    const issues = JSON.parse(data);
    const currentIssueKey = this.props.details.detail.key;
    const prevIndex =
      issues.findIndex((ele) => ele.key === currentIssueKey) - 1;
    if (prevIndex > -1) {
      const issue = issues[prevIndex];
      return this.getDetails(issue["key"]);
    }
    return;
  };

  nextIssue = () => {
    const data = localStorage.getItem("issues");
    const issues = JSON.parse(data);
    const currentIssueKey = this.props.details.detail.key;
    const nextIndex =
      issues.findIndex((ele) => ele.key === currentIssueKey) + 1;
    console.log(issues.length);
    if (nextIndex < issues.length) {
      const issue = issues[nextIndex];
      return this.getDetails(issue["key"]);
    }
    return;
  };

  handleClose = () => {
    this.setState({
      ...this.state,
      error: "",
      commentForm: {
        commentBoxOpen: false,
        comment: "",
        issueId: this.props.match.params.id,
        email: this.props.authentication.user.username,

        error: 0,
        success: 0,
      },
    });
  };

  updateComment(e) {
    this.setState({
      ...this.state,
      commentForm: { ...this.state.commentForm, comment: e.target.value },
    });
  }

  convertToDateObject = (valueString) => {
    return new Date(valueString.replace(/([\+-])(\d{2})(\d{2})$/gi, "$1$2:$3"));
  };

  parseDate = (d) => {
    if (!d) {
      return "";
    }
    d = d.split("T");

    return d[0];
  };
  parseTime = (d) => {
    if (!d) {
      return "";
    }

    const resolutiondateObject = this.convertToDateObject(d);

    const second = resolutiondateObject.getSeconds(); // second < 10 ? '0' + second : second
    const minute = resolutiondateObject.getMinutes(); // minute < 10 ? '0' + minute: minute
    const hour = resolutiondateObject.getHours(); // hour < 10 ? '0' + hour : hour

    const string = `${hour < 10 ? "0" + hour : hour}:${
      minute < 10 ? "0" + minute : minute
    }:${second < 10 ? "0" + second : second}`;

    return string.startsWith("Na") ? "" : string;
  };
  handleSubmit = async () => {
    var message = "";
    if (this.props.i18n.language === "en") {
      message = "Your message has been sent to OTM-Zenith coordinator";
    } else if (this.props.i18n.language === "fr") {
      message = "Votre message a été envoyé au coordinateur OTM-Zenith";
    } else if (this.props.i18n.language === "nl") {
      message = "Uw bericht werd verzonden naar een coördinator van OTM-Zenith";
    }
    if (message !== "") {
      swal({
        title: "Message",
        text: message,
        icon: "success",
        button: true,
        dangerMode: true,
      });
    }

    const formValues = { ...this.state.commentForm };
    if (!this.state.commentForm.comment) {
      this.setState({
        ...this.state,
        commentForm: {
          commentBoxOpen: false,
          comment: "",
          issueId: this.props.match.params.id,
          email: this.props.authentication.user.username,
          error: 1,
          success: 0,
        },
      });
      return;
    }
    this.props.addComment(formValues);
    this.setState({
      ...this.state,
      commentForm: {
        commentBoxOpen: false,
        comment: "",
        issueId: this.props.match.params.id,
        email: this.props.authentication.user.username,
        error: 0,
        success: 1,
      },
    });
  };

  parseMapUrl = (url) => {
    let parts = url.split("&");
    let center = parts.find((part) => part.includes("center"));
    try {
      let part1 = center.split("=");
      let latlong = part1[1].split(",");
      console.log(latlong);
      return { lat: parseFloat(latlong[0]), lng: parseFloat(latlong[1]) };
    } catch (err) {
      return { lat: 50.850651, lng: 4.350239 };
    }
  };

  getAddressFromUrl = (location) => {
    if (location) {
      let parts = location.split("&");
      let center = parts.find((part) => part.includes("center"));
      if (center) {
        let part1 = center.split("=");

        const parseAddress = axios.get(
          "https://revgeocode.search.hereapi.com/v1/revgeocode?at=" +
            part1[1] +
            "&lang=en-US&apiKey=H1fBoXuzcpdjQC4_t_MpuoidmzWvep54G-qOhKkw26k"
        );
        parseAddress
          .then((res) => {
            const { addressFromGoogle } = this.state;
            if (addressFromGoogle !== res.data.items[0].title) {
              this.setState({
                addressFromGoogle: res.data.items[0].title,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            const { addressFromGoogle } = this.state;
            if (
              addressFromGoogle !==
              this.props.details.detail.installationAddress
            ) {
              this.setState({
                addressFromGoogle: this.props.details.detail.installationAddress
                  ? this.props.details.detail.installationAddress
                  : "No address is set",
              });
            }
          });
        // console.log(parseAddress)
        return true;
      }
    }
    return false;
  };

  getGoogleMapAddressFromLocation = (location, flag) => {
    const { details } = this.props;
    const { addressFromGoogle } = this.state;

    if (location === null) {
      return;
    }
    if (flag && details.detail.installationAddress !== addressFromGoogle) {
      if (location) {
        const address = this.getAddressFromUrl(details.detail.location)
          ? addressFromGoogle
          : "";
        let places;
        if (address !== "") {
          places = address.split(/(\d+)/);
          let path = "";
          for (let part of places) {
            path += part;
          }
          const newWindow = window.open(
            `https://www.google.com/maps/place/${path}`
          );
          if (newWindow) newWindow.opener = null;
        }
        return true;
      }
      return false;
    } else {
      let parts = location.split(/(\d+)/);
      let path = "";
      for (let part of parts) {
        path += part;
      }
      // const newWindow = window.open(`https://www.google.com/maps/place/${parts[0]}+${parts[1]}${parts[2]}+${parts[3]}+${parts[4]}`)
      const newWindow = window.open(
        `https://www.google.com/maps/place/${path}`
      );
      console.log(newWindow);
      if (newWindow) newWindow.opener = null;
    }
  };

  getGoogleMapLocationFromUrl = () => {
    const { details } = this.props;
    if (details.detail.location === null) {
      return;
    }

    let parts = details.detail.location.split("&");
    let center = parts.find((part) => part.includes("center"));
    try {
      let part1 = center.split("=");

      const newWindow = window.open(
        "https://www.google.com/maps/search/?api=1&query=" + part1[1],
        "_blank",
        "noopener,noreferrer"
      );
      if (newWindow) newWindow.opener = null;
    } catch (err) {
      console.log(err);
    }
  };

  parseMapUrlString = (url) => {
    let parts = url.split("&");
    let center = parts.find((part) => part.includes("center"));
    try {
      let part1 = center.split("=");
      let latlong = part1[1].split(",");
      let latString = this.getLatLngString(latlong[0]);
      let lngString = this.getLatLngString(latlong[1]);

      return `${latString} N ${lngString} E`;
    } catch (err) {
      return "";
    }
  };

  getLatLngString = (latlng) => {
    try {
      var dec = Math.floor(latlng);
      var minFloat = (latlng - dec) * 60;
      var min = Math.floor(minFloat);
      var secFloat = (minFloat - min) * 60;
      var sec = Math.floor(secFloat);

      if (sec == 60) {
        min++;
        sec = 0;
      }
      if (min == 60) {
        dec++;
        min = 0;
      }

      return `${dec < 10 ? "0" + dec : dec}° ${min < 10 ? "0" + min : min}′ ${
        sec < 10 ? "0" + sec : sec
      }″`;
    } catch (err) {
      return "";
    }
  };

  showLocationOnMap() {
    if (this.props.details.detail.location !== null) {
      this.getGoogleMapAddressFromLocation(
        this.props.details.detail.location,
        true
      );
    } else {
      this.getGoogleMapAddressFromLocation(
        this.props.details.detail.installationAddress,
        false
      );
    }
  }

  handleProblems(key, value) {
    this.setState({
      ...this.state,
      problems: {
        ...this.state.problems,
        [key]: value
      }
    })
  }

  render() {
    const { classes, t } = this.props;

    if (this.props.details.loading) {
      return (
        <Container maxWidth="xl" className={classes.container} align="center">
          <CircularProgress />
        </Container>
      );
    }
    const problems = (
      <div className="div-problems-container">
        {PROBLEMS.map((item, index) => {
          const label = { inputProps: { 'aria-label': item.value } };
          return (
            <div className="div-problems-item">
              <div className="div-problems-label">{item.value}</div>
              <Switch {...label} color="primary" onChange={this.handleProblems} checked={ 
                Array.isArray(this.props.details.detail?.problems)
                && this.props.details.detail?.problems?.some(issue => issue.id === item.id)
                }/>
            </div>
          );
        })}
      </div>
    );
  
  const comments = (
    <div className="div-comments-container">
      <hr class="thin-line" width="500" align="left" />
      <div className="div-problems-comment">
        {this.props.details.detail?.comment && <h5 className="div-comment">Comments</h5>}
        {this.props.details.detail?.comment?.comments?.map(comment => {
          return <div className="div-comment-container">
            <div className="div-comment-user">
              <Avatar sizes="30px" src={comment.author?.avatarUrls['32X32']}/>
              <div className="div-comment-username">{comment.author?.displayName}</div>
            </div>
            <div className="div-comment-text">{comment.body?.content[0]?.content[0]?.text}</div>
          </div>
        })}
      </div>
    </div>
  );

    return (
      <React.Fragment>
        <section>
          <div class="b-cen">
            <div class="cen-i-top">
              <div class="cmp-cen-con cmp-pos-rel">
                <div className="ctl-hdr-top">
                  <i
                    class="fa fa-caret-left"
                    aria-hidden="true"
                    onClick={() => this.props.history.push("/customer")}
                  ></i>
                  <p onClick={() => this.props.history.push("/customer")}>
                    {t(`Back to the overview`)}
                  </p>
                </div>
                <div class="ctl-cen-inf">
                  <div class="ctl-lft-inf">
                    <div class="ctl-tab-bot">
                      <table class="ctl-tab-wid">
                        <thead class="ctl-hdr-txt">
                          <tr>
                            <th colSpan="2">{t("Vehicle data")}</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody class="ctl-td-txt">
                          <tr>
                            <td>{t(`Service address nb`)}:</td>
                            <td>
                              {this.filterNoValues(
                                this.props.details.detail.addressNB
                              ) ?? ""}
                            </td>
                          </tr>
                          <tr>
                            <td>{t(`Service address`)}:</td>
                            <td>
                              {this.filterNoValues(
                                this.props.details.detail.address
                              ) ?? ""}
                            </td>
                          </tr>
                          <tr>
                            <td>Location:</td>
                            <td>
                              {this.filterNoValues(
                                this.props.details.detail.location
                              ) ?? ""}
                            </td>
                          </tr>
                          <tr>
                            <td>Installation Address:</td>
                            <td>
                              {this.filterNoValues(
                                this.props.details.detail.installationAddress
                              ) ?? ""}
                            </td>
                          </tr>
                          <tr>
                            <td>PostCode:</td>
                            <td>
                              {this.props.details.detail.zipCode || " "}
                            </td>
                          </tr>
                          <tr>
                            <td>{t(`Status`)}:</td>
                            <td>
                              {this.props.details.detail.status == "To Do" ? (
                                <i
                                  class="fa fa-circle ctl-act-col todostatus"
                                  aria-hidden="true"
                                ></i>
                              ) : (
                                ""
                              )}
                              {this.props.details.detail.status ==
                              "In Progress" ? (
                                <i
                                  class="fa fa-circle ctl-act-col progressstatus"
                                  aria-hidden="true"
                                ></i>
                              ) : (
                                ""
                              )}
                              {this.props.details.detail.status == "Done" ? (
                                <i
                                  class="fa fa-circle ctl-act-col donestatus"
                                  aria-hidden="true"
                                ></i>
                              ) : (
                                ""
                              )}
                              {this.filterNoValues(
                                this.props.details.detail.status
                              ) ?? ""}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <hr class="thin-line" width="500" align="left" />
                      {problems}
                    </div>
                    {comments}
                    <hr class="thin-line" width="500" align="left" />
                    <div>
                      <h5 className="div-comment">{t("Containers")}</h5>
                      {this.props.details.detail?.subtasks?.length > 0 ? <React.Fragment>
                        {this.props.details.detail?.subtasks.map( task => { 
                          return (
                            <Subtask subtask={task}/>
                          )
                        })}
                      </React.Fragment> : <></>}
                    </div>
                  </div>
                  <div class="ctl-rit-inf">
                    <div class="ctl-rit-top">
                      <div class="ctl-par-hdr">
                        <p>
                          <i class="fa fa-camera" aria-hidden="true"></i>{" "}
                          {t(`Photos`)}
                        </p>
                      </div>
                    </div>
                    <div class="ctl-rit-bot">
                      <div class="cmp-dum-inf">
                        <Slider
                          images={this.props.details.detail.images}
                          id={this.props.details.detail.id}
                        />
                      </div>

                      <div
                        class="modal fade"
                        id="popModal"
                        tabIndex="-1"
                        role="dialog"
                        aria-hidden="true"
                      >
                        <div class="modal-dialog" role="document">
                          <div class="modal-content">
                            <div class="model-close">
                              <div
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close"
                              >
                                <img src="public/close.png" alt="" />
                              </div>
                            </div>
                            <div class="modal-body">
                              <div
                                id="carouselExample"
                                class="carousel slide"
                                data-ride="carousel"
                              >
                                <div class="carousel-inner">
                                  <div class="carousel-item active">
                                    <div class="ctl-pro-img">
                                      <img src="public/pic.jpg" alt="" />
                                    </div>
                                    <div class="ctl-pop-txt">
                                      <p>
                                        Klant // Nummerplaat // Merk // Model //
                                        Datum afgewerkt
                                      </p>
                                    </div>
                                    <div class="clearfix"></div>
                                  </div>
                                  <div class="carousel-item">
                                    <div class="ctl-pro-img">
                                      <img src="public/pic2.png" alt="" />
                                    </div>
                                    <div class="ctl-pop-txt">
                                      <p>
                                        Klant // Nummerplaat // Merk // Model //
                                        Datum afgewerkt
                                      </p>
                                    </div>
                                    <div class="clearfix"></div>
                                  </div>
                                  <div class="carousel-item">
                                    <div class="ctl-pro-img">
                                      <img src="public/pic3.png" alt="" />
                                    </div>
                                    <div class="ctl-pop-txt">
                                      <p>
                                        Klant // Nummerplaat // Merk // Model //
                                        Datum afgewerkt
                                      </p>
                                    </div>
                                    <div class="clearfix"></div>
                                  </div>
                                  <div class="carousel-item">
                                    <div class="ctl-pro-img">
                                      <img src="public/pic2.png" alt="" />
                                    </div>
                                    <div class="ctl-pop-txt">
                                      <p>
                                        Klant // Nummerplaat // Merk // Model //
                                        Datum afgewerkt
                                      </p>
                                    </div>
                                    <div class="clearfix"></div>
                                  </div>
                                </div>
                                <a
                                  class="carousel-control-prev"
                                  href="#carouselExample"
                                  role="button"
                                  data-slide="prev"
                                >
                                  <span
                                    class="carousel-control-prev-icon"
                                    aria-hidden="true"
                                  ></span>
                                  <span class="sr-only">Previous</span>
                                </a>
                                <a
                                  class="carousel-control-next"
                                  href="#carouselExample"
                                  role="button"
                                  data-slide="next"
                                >
                                  <span
                                    class="carousel-control-next-icon"
                                    aria-hidden="true"
                                  ></span>
                                  <span class="sr-only">Next</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {this.props.error ? (
                        <Alert severity="error">
                          <AlertTitle>Error</AlertTitle>
                          {this.props.error}
                        </Alert>
                      ) : (
                        ""
                      )}
                      <div class="cmp-inp-top"></div>
                      <div class="clearfix"></div>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <div class="clearfix"></div>
                </div>

                <div class="ctl-ico-bot">
                  <div class="ctl-ico">
                    <img
                      src="/Previous_Icon.png"
                      alt=""
                      onClick={this.prevIssue}
                    />
                  </div>
                  <div class="ctl-ico ctl-rit-ico">
                    <img src="/Next_Icon.png" alt="" onClick={this.nextIssue} />
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

const componentWithProps = connect(
  mapStateToProps,
  mapDispatchToProps
)(IssueDetails);
const composeComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=[key]=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} className="section1" />,
    containerElement: <div className="section2" />,
    mapElement: <div style={{ height: `100%` }} className="section3" />,
  }),
  withScriptjs,
  withGoogleMap
)(componentWithProps);
export default withRouter(withStyles(useStyles)(composeComponent));
