import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
const useStyles = (theme) => ({
  container: {
    margin: "auto",
    marginTop: "2rem",
    maxWidth: 1200,
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
  buttonsTop: {
    position: "relative",
    top: "1.5rem",
  },
  TableRow: {
    cursor: "pointer",
    "&:hover": {
      cursor: "pointer",
    },
  },
});

class IssuesGrid extends React.Component {
  state = {
    key: "",
    status: "Done",
    addressNB: "",
    address: "",
    zipCode: "",
    location: "",
    resolutionDateBegin: "",
    resolutionDateEnd: "",
    installationAddress:"",
  };

  constructor(props) {
    super(props);
    this.filter = {
      key: "",
      status: "Done",
      addressNB: "",
      address: "",
      zipCode: "",
      location: "",
      resolutionDateBegin: "",
      resolutionDateEnd: "",
      installationAddress:"",
    };

    this.state = {
      ...this.state,
      detailView: false,
      nextIssue: "",
      prevIssue: "",
      customer: "",
      salesorder:"",
      order:"",
      index:Number
    };

    this.props.i18n.changeLanguage(this.props.language);

    console.log(this.props.getIssues(this.filter))
  }

  filterImmediate(key, e) {
    if (e.keyCode === 13) {
      this.setFilterValue(key, e)
    }
  }

  setFilterValue(key, e) {
    this.filter[key] = e.target.value;
    this.setState({ ...this.state, [key]: e.target.value });
    console.log(key, e.target.value, e);
  }

  setDateValue(key, value) {
   
    this.filter[key] = value;
    this.setState({ ...this.state, [key]: value });
  }

  more = () => {
    if (
      this.filter.startAt + this.props.issues.maxResults <
      this.props.issues.total
    )
      this.filter.startAt = this.filter.startAt + this.props.issues.maxResults;
    console.log(this.filter);
    this.props.getfilterMore(this.filter);
  };

  paginateNext = () => {
    if (
      this.filter.startAt <
      this.props.issues.total
    ){
      this.filter.startAt = this.filter.startAt + this.props.issues.maxResults;
      this.props.getfilterMore(this.filter);}
  }

  paginatePrev = () => {
    if (
      this.filter.startAt <
      this.props.issues.total && this.filter.startAt - this.props.issues.maxResults >=0
    ){
      this.filter.startAt = this.filter.startAt - this.props.issues.maxResults;
      this.props.getfilterMore(this.filter);
    }
  }



  getDetails = (key) => {
    //this.props.getIssueDetails(key)
    var win = window.open(`/issue/details/${key}`, "blank");
    localStorage.setItem("issues", JSON.stringify(this.props.issues.issues));
    win.focus();
    // this.props.history.push(`/issue/details/${key}`);
  };

  handledetailModalClose = () => {
    this.setState({ ...this.state, detailView: false });
  };

  resetFilter = () => {
    
    this.filter = {
      key: "",
      status: "Done",
      addressNB: "",
      address: "",
      zipCode: "",
      location: "",
      resolutionDateBegin: "",
      resolutionDateEnd: "",
      installationAddress:"",
    };
    this.setState({
      ...this.state,
      key: "",
      status: "Done",
      addressNB: "",
      address: "",
      zipCode: "",
      location: "",
      resolutionDateBegin: "",
      resolutionDateEnd: "",
      installationAddress:"",
    });
    this.props.getIssues(this.filter);
  };

  prevIssue = () => {
    const { issues } = this.props.issues;
    const currentIssueKey = this.props.details.detail.key;
    const prevIndex = issues.findIndex((ele) => ele.key == currentIssueKey) - 1;
    if (prevIndex > -1) {
      const issue = issues.get(prevIndex);
      return this.getDetails(issue["key"]);
    }
    return;
  };

  nextIssue = () => {
    const { issues } = this.props.issues;
    const currentIssueKey = this.props.details.detail.key;
    const nextIndex = issues.findIndex((ele) => ele.key == currentIssueKey) + 1;
    if (nextIndex < issues.size) {
      const issue = issues.get(nextIndex);
      return this.getDetails(issue["key"]);
    }
    return;
  };

  filterNoValues = (value) => {
    if (!value || !value.startsWith) {
      return "";
    }
    return value.startsWith("{{this.fields") || value.startsWith("nul")
      ? ""
      : value;
  };

  convertToDateObject = (valueString) => {
    return new Date(valueString.replace(/([\+-])(\d{2})(\d{2})$/gi, "$1$2:$3"));
  };
  customerReference=(value)=>{
    console.log(this.props)
    if(value){
    if(value.startsWith("{{")){
      value = ""
    }
  }
    return value
  }

  parseDate = (d) => {
    if (!d) {
      return "";
    }

    // const resolutiondateObject = this.convertToDateObject(d);
    // const month = d.split('-') // month < 10 ? '0' + month : month
    // const day = resolutiondateObject.getDay(); // day < 10 ? '0' + day : day
    // const string = `${resolutiondateObject.getFullYear()}-${month[1]}-${
    //   day < 10 ? "0" + day : day}`;
    // return string.startsWith("Na") ? "" : string;
    return d.split('T')[0];
  };
   sortTable(event,n) {
     this.setState({index:n})
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myTable");
    switching = true;
    dir = "asc"; 
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 0; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch= true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount ++;      
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
      this.setState({order:dir})
    }
  }
  render() {
    const { classes, t } = this.props;
    const { issues, maxResults, total, startAt, loading } = this.props.issues;
    const { isAdmin } = this.props;
    
    if (!this.props.authentication.user)
      return (
        <Container maxWidth="xl" className={classes.container} align="center">
          <CircularProgress />
        </Container>
      );
 

    if (loading || this.props.details.loading)
      return (
        <Container maxWidth="xl" className={classes.container} align="center">
          <CircularProgress />
        </Container>
      );
      var message
      if(this.props.i18n.language === 'en'){
        message = "Nothing TO Show"
      }else if(this.props.i18n.language === 'fr'){
        message =  "Rien à afficher"
      }else if(this.props.i18n.language === 'nl'){
        message =  "Geen resultaten gevonden, gelieve ruimere selectiecriteria te gebruiken"
      }
    return (
      <Container maxWidth="xl" className={classes.container}>
        <Box display="flex" flexDirection="row" justifyContent="left">
          <Box p={1}>
            <div className="color8d">{t("Search")}</div>
          </Box>
        </Box>

        <Box display="flex" flexDirection="row" justifyContent="left">
          {isAdmin === "1" ? (
           <>
             <Box p={1}>
             <React.Fragment>
             <div className="boldlabels">{t("SO nr")}:</div>
             <TextField
               InputLabelProps={{ shrink: true }}
               margin="dense"
               id="key"
               value={this.state.salesorder}
               onKeyDown={(e) => this.filterImmediate("salesorder", e)}
               onChange={(e) => this.setFilterValue("salesorder", e)}
               type="text"
               variant="outlined"
             />
           </React.Fragment>
         </Box>
         
         <Box p={1}>
              <React.Fragment>
                <div className="boldlabels">{t("Customer")}:</div>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  className={classes.textFieldDense}
                  margin="dense"
                  id="key"
                  value={this.state.customer}
                  onKeyDown={(e) => this.filterImmediate("customer", e)}
                  onChange={(e) => this.setFilterValue("customer", e)}
                  type="text"
                  variant="outlined"
                />
              </React.Fragment>
            </Box>
         </>
         
          ) : (
            ""
          )}

          <Box p={1}>
            <React.Fragment>
              <div className="licensePlateCSS">{t("Service address nb")}:</div>

              <TextField
                InputLabelProps={{ shrink: true }}
                margin="dense"
                value={this.state.addressNB}
                onKeyDown={(e) => this.filterImmediate("addressNB", e)}
                onChange={(e) => this.setFilterValue("addressNB", e)}
                id="key"
                type="text"
                fullWidth
                variant="outlined"
              />
            </React.Fragment>
          </Box>

          <Box p={1}>
            <React.Fragment>
              <div className="boldlabels marginbottomselect">
                {t("Status")}:
              </div>

              <Select
                labelId="demo-simple-select-label"
                displayEmpty={true}
                value={this.state.status}
                onChange={(e) => this.setFilterValue("status", e)}
                id="demo-simple-select"
                variant="outlined"
                defaultValue={"Done"}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="To Do">{t(`To Do`)}</MenuItem>
                <MenuItem value="In Progress">{t(`In Progress`)}</MenuItem>
                <MenuItem value="Done">{t(`Done`)}</MenuItem>
                <MenuItem value="Problem">{t(`Problem`)}</MenuItem>
              </Select>
            </React.Fragment>
          </Box>

          <Box p={1}>
            <React.Fragment>
              <div className="boldlabels">{t("Service address")}:</div>

              <TextField
                InputLabelProps={{ shrink: true }}
                margin="dense"
                value={this.state.address}
                onKeyDown={(e) => this.filterImmediate("address", e)}
                onChange={(e) => this.setFilterValue("address", e)}
                id="key"
                type="text"
                fullWidth
                variant="outlined"
              />
            </React.Fragment>
          </Box>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Box p={1}>
              <React.Fragment>
                <div className="boldlabels">{t("From")}:</div>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="yyyy-MM-dd"
                  className="custom-date-picker"
                  margin="normal"
                  placeholder="YYYY-MM-DD"
                  InputLabelProps={{ shrink: true }}
                  value={this.state.resolutionDateBegin || null}
                  onChange={(e, value) =>
                    this.setDateValue("resolutionDateBegin", value)
                  }
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </React.Fragment>
            </Box>
            <Box p={1}>
              <React.Fragment>
                <div className="boldlabels">{t("To")}:</div>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="yyyy-MM-dd"
                  className="custom-date-picker"
                  margin="normal"
                  placeholder="YYYY-MM-DD"
                  InputLabelProps={{ shrink: true }}
                  value={this.state.resolutionDateEnd || null}
                  onChange={(e, value) =>
                    this.setDateValue("resolutionDateEnd", value)
                  }
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </React.Fragment>
            </Box>{" "}
          </MuiPickersUtilsProvider>
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="left"
          alignItems="center">
          <Box p={1}>
            <React.Fragment>
              <div className="boldlabels">{t("Zip Code")}:</div>

              <TextField
                InputLabelProps={{ shrink: true }}
                margin="dense"
                value={this.state.zipCode}
                onKeyDown={(e) => this.filterImmediate("zipCode", e)}
                onChange={(e) => this.setFilterValue("zipCode", e)}
                id="key"
                type="text"
                fullWidth
                variant="outlined"
              />
            </React.Fragment>
          </Box>
          <Box p={1}>
            <React.Fragment>
              <div className="boldlabels">{t("Location")}:</div>

              <TextField
                InputLabelProps={{ shrink: true }}
                margin="dense"
                value={this.state.location}
                onKeyDown={(e) => this.filterImmediate("location", e)}
                onChange={(e) => this.setFilterValue("location", e)}
                id="key"
                type="text"
                fullWidth
                variant="outlined"
              />
            </React.Fragment>
          </Box>
          <Box p={1}>
            <React.Fragment>
              <div className="boldlabels">{t("Installation address")}:</div>

              <TextField
                InputLabelProps={{ shrink: true }}
                margin="dense"
                value={this.state.installationAddress}
                onKeyDown={(e) => this.filterImmediate("installationAddress", e)}
                onChange={(e) => this.setFilterValue("installationAddress", e)}
                id="key"
                type="text"
                fullWidth
                variant="outlined"
              />
            </React.Fragment>
          </Box>
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={11} align="left" className={classes.buttonsTop}>
            <Button
              variant="contained"
              align="left"
              className="redButton"
              onClick={() => this.props.getIssues(this.filter)}
            >
              {t(`Search`)}
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              variant="contained"
              align="left"
              onClick={this.resetFilter}
              className="blackButton"
            >
              {t(`Reset filter`)}
            </Button>
          </Grid>
        </Grid>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="left"
          alignItems="center"
          marginTop={10}
        >
          <Box p={1}>
            <div className="color8d">{t("Result")}</div>
          </Box>
          <Box p={1}>
            <div className="color8d2">
              {this.props.issues.total} {t("Results Found")}
            </div>
          </Box>
         
        </Box>
        <table id="myTable" className="gridTable ctl-hdr-wid">
          <thead>
            <td>
              <div className="boldlabels-table" onClick={(e)=>this.sortTable(this.props,2)}style={{fontSize:" 11px !important;"}}>
                {t("Key")}
              </div>
              {this.state.index === 2 ? [(this.state.order === "asc"? <i  className="arrowASCs"></i>:<i  className="arrowDescs" ></i>)]:
                ""
                }
            </td>

            <td>
              <div className="boldlabels-table" onClick={(e)=>this.sortTable(e,3)}>{t('Service Address Number')}</div>
              {this.state.index === 3 ? [(this.state.order === "asc"? <i  className="arrowASCss"></i>:<i  className="arrowDescss" ></i>)]:
                   ""
                   }
            </td>
            <td>
              <div className="boldlabels-table" onClick={(e)=>this.sortTable(this.props,2)}style={{fontSize:" 11px !important;"}}>
                {t("Service Address")}
              </div>
              {this.state.index === 2 ? [(this.state.order === "asc"? <i  className="arrowASCs"></i>:<i  className="arrowDescs" ></i>)]:
                ""
                }
            </td>
            <td>
              <div className="boldlabels-table" onClick={(e)=>this.sortTable(this.props,2)}style={{fontSize:" 11px !important;"}}>
                {t("Zip Code")}
              </div>
              {this.state.index === 2 ? [(this.state.order === "asc"? <i  className="arrowASCs"></i>:<i  className="arrowDescs" ></i>)]:
                ""
                }
            </td>
            <td>
              <div className="boldlabels-table" onClick={(e)=>this.sortTable(e,8)}>{t("ResolutionDate")}</div>
              {this.state.index === 8 ? [(this.state.order === "asc"? <i className="arrowASC"></i>:<i className="arrowDesc" ></i>)]:
                   ""
                   }
            </td>
            <td>
              <div className="boldlabels-table" onClick={(e)=>this.sortTable(e,4)}>{t("Status")}</div>
              {this.state.index === 4 ? [(this.state.order === "asc"? <i className="arrowASC"></i>:<i className="arrowDesc" ></i>)]:
                   ""
                   }
            </td>
            <td></td>
          </thead>
          {issues.size < 1
            ?<tr><td  colspan="7"><h3 style={{color:"red"}}>{message}</h3></td></tr>
            : issues.map((row, index, fullArray) => {
                var colorConst = index % 2 == 0 ? "greyrow" : "";
                return (
                  <tr key={row.id} className={colorConst}>
                    <td>{this.filterNoValues(row.key) ?? " "}</td>
                    <td>{this.filterNoValues(row.addressNB) ?? " "}</td>
                    <td>{this.filterNoValues(row.address) ?? " "}</td>
                    <td>{row.zipCode || ""}</td>
                    <td>{this.parseDate(row.resolutiondate) ?? ""}</td>
                    <td>
                      {row.status == "To Do" ? (
                        <FiberManualRecordIcon className="todostatus"></FiberManualRecordIcon>
                      ) : (
                        ""
                      )}
                      {row.status == "In Progress" ? (
                        <FiberManualRecordIcon className="progressstatus"></FiberManualRecordIcon>
                      ) : (
                        ""
                      )}
                       {row.status == "Problem" ? (
                        <FiberManualRecordIcon className="problemstatus"></FiberManualRecordIcon>
                      ) : (
                        ""
                      )}
                      {row.status == "Done" ? (
                        <FiberManualRecordIcon className="donestatus"></FiberManualRecordIcon>
                      ) : (
                        ""
                      )}
                    </td>
                    <td>
                      <OpenInNewIcon
                        className="clickableRow"
                        onClick={(e) => {
                          this.getDetails(row.key);
                        }}
                      ></OpenInNewIcon>
                    </td>
                  </tr>
                );
              })}
        </table>
        <Box display="flex" flexDirection="row" justifyContent="center">

          <Box p={1}  alignItems="center">
            <Button variant="contained" align="left" className="redButton" onClick={() => this.paginatePrev()}>
                {t(`Previous Page`)}
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button variant="contained" align="left" className="redButton" onClick={() => this.paginateNext()}>
                {t(`Next Page`)}
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }
}

export default withStyles(useStyles)(IssuesGrid);
