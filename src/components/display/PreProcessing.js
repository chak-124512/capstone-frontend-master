import React, { Component } from "react";
import { sampleData, sampleRowData } from "./displaytest2";
import ls from "local-storage";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { baseUrl } from "../../shared/baseUrl";

class PreProcessing extends Component {
  state = {
    columns: [],
    table: [],
    rangeRemove: false,
    removeMissing: false,
    removeRangeMinValue: 0,
    removeRangeMaxValue: 0,
    selectedColumn: "",
    modalShow: false,
    modalTopic: "Naive Bayes",
    modalContent: "Explanation of Naive Bayes"
  };
  componentDidMount() {
    this.getColumns();
  }

  handleClose = () => {
    this.setState({ modalShow: false });
  };

  async getColumns() {
    const data = new FormData();
    const fileKey = ls.get("token") || "testkey";
    console.log(fileKey);
    data.append("fileKey", fileKey);
    const url = `${baseUrl}/stats`;
    const response = await fetch(url, {
      method: "POST",
      body: data
    });
    const columns = await response.json();
    this.setState({ columns: columns.columns });
  }
  async statsByColumns(e) {
    const col = e.target.value;
    this.setState({ selectedColumn: col });
    const data = new FormData();
    data.append("column", col);
    data.append("fileKey", ls.get("token"));
    const url = `${baseUrl}/stats-by-column`;
    const response = await fetch(url, {
      method: "POST",
      body: data
    });
    const x = await response.json();
    const keys = Object.keys(x);
    let table = [];
    keys.forEach(key => {
      if (key == "Visualization") {
        const list = x["Visualization"].map(path => {
          const link = `${baseUrl}` + path;
          return (
            <span>
              <a href={link}>Click here</a> &nbsp;
            </span>
          );
        });
        table.push({
          key: key,
          value: list
        });
      } else {
        table.push({
          key: key,
          value: x[key]
        });
      }
    });
    this.setState({ table });
  }
  sendRemoveMissing = () => {
    const { removeMissing } = this.state;
    const url = `${baseUrl}/remove-missing`;
    const data = new FormData();
    const fileKey = ls.get("token") || "testkey";
    data.append("fileKey", ls.get("token"));
    data.append("flag", removeMissing);
    data.append("column", this.state.selectedColumn);
    fetch(url, {
      method: "post",
      body: data
    })
      .then(response => response.json())
      .then(data => alert(data.message))
      .catch(err => alert(err));
  };

  sendRemoveRange = () => {
    const { removeRangeMinValue, removeRangeMaxValue } = this.state;
    const data = new FormData();
    const fileKey = ls.get("token") || "testkey";
    data.append("min", removeRangeMinValue);
    data.append("max", removeRangeMaxValue);
    data.append("column", this.state.selectedColumn);
    data.append("fileKey", fileKey);
    const url = `${baseUrl}/remove-range`;
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => alert(data.message));
  };

  sendSpecificValue = () => {
    const { replaceSpecificValue } = this.state;
    const data = new FormData();
    const fileKey = ls.get("token") || "testkey";
    data.append("value", replaceSpecificValue);
    data.append("column", this.state.selectedColumn);
    data.append("fileKey", fileKey);
    const url = `${baseUrl}/replace-by-specific`;
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => alert(data.message));
  };
  sendNewSpecificValue = () => {
    const { replaceOldValue, replaceNewValue } = this.state;
    const data = new FormData();
    const fileKey = ls.get("token") || "testkey";
    data.append("oldValue", replaceOldValue);
    data.append("newValue", replaceNewValue);
    data.append("column", this.state.selectedColumn);
    data.append("fileKey", fileKey);
    const url = `${baseUrl}/replace-value`;
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => alert(data.message));
  };
  sendReplaceByMeanMedian = replace_url => {
    const url = `${baseUrl}` + "/" + replace_url;
    const data = new FormData();
    const fileKey = ls.get("token") || "testkey";
    data.append("columns", JSON.stringify([this.state.selectedColumn]));
    data.append("fileKey", fileKey);
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => alert(data.message));
  };

  getData = topic => {
    const url = `${baseUrl}/get-help`;
    const data = new FormData();
    data.append("topic", topic);
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ modalTopic: topic });
        this.setState({ modalContent: data.description });
        this.setState({ modalShow: true });
      });
  };

  render() {
    return (
      <React.Fragment>
        <div style={{ marginLeft: 245, marginTop: 10 }}>
          <div>
            <span
              style={{
                position: "relative",
                left: "30%",
                top: "10px"
              }}
            >
              <b>Select Column: </b>{" "}
              <select onChange={e => this.statsByColumns(e)}>
                <option>--Select--</option>
                {this.state.columns.map((item, key) => (
                  <option>{item}</option>
                ))}
              </select>
            </span>
          </div>
          <br />
          <br />

          <div>
            <table border="1px solid black">
              <tr style={{ fontWeight: "bold" }}>
                <td>key</td>
                <td>Value</td>
              </tr>
              {this.state.table.map((item, key) => (
                <tr>
                  <td>{item.key}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </table>
          </div>
          <div>
            <h3>
              <u>Cleaning Process</u>
            </h3>
            <table>
              <tr>
                <td>Remove Missing Values</td>
                <td style={{ width: 200 }}>
                  <input
                    type="checkbox"
                    onChange={() =>
                      this.setState({
                        removeMissing: !this.state.removeMissing
                      })
                    }
                  />
                </td>
                <td>
                  <Button onClick={() => this.sendRemoveMissing()}>
                    Submit
                  </Button>
                </td>
                <input
                  type="button"
                  value="Help!"
                  onClick={() => this.getData("remove-missing")}
                />
              </tr>
              <tr>
                <td>Remove Outside of Range</td>
                <td style={{ width: 200 }}>
                  <input
                    type="text"
                    placeholder={this.state.removeRangeMinValue}
                    style={{ width: "90px" }}
                    onChange={e =>
                      this.setState({ removeRangeMinValue: e.target.value })
                    }
                  />{" "}
                  &nbsp;&nbsp;&nbsp;
                  <input
                    type="text"
                    placeholder={this.state.removeRangeMaxValue}
                    style={{ width: "90px" }}
                    onChange={e =>
                      this.setState({ removeRangeMaxValue: e.target.value })
                    }
                  />
                </td>
                <td>
                  <Button onClick={() => this.sendRemoveRange()}>Submit</Button>
                </td>
                <input
                  type="button"
                  value="Help!"
                  onClick={() => this.getData("remove-range")}
                />
              </tr>
              <tr>
                <td>Replace NAN By Specific Value</td>
                <td style={{ width: 200 }}>
                  <input
                    type="text"
                    placeholder={this.state.replaceSpecificValue}
                    style={{ width: "190px" }}
                    onChange={e =>
                      this.setState({ replaceSpecificValue: e.target.value })
                    }
                  />{" "}
                </td>
                <td>
                  <Button onClick={() => this.sendSpecificValue()}>
                    Submit
                  </Button>
                </td>
                <input
                  type="button"
                  value="Help!"
                  onClick={() => this.getData("replace-nan")}
                />
              </tr>
              <tr>
                <td>Replace Specific Value</td>
                <td style={{ width: 200 }}>
                  <input
                    type="text"
                    placeholder="Old Value"
                    style={{ width: "90px" }}
                    onChange={e =>
                      this.setState({ replaceOldValue: e.target.value })
                    }
                  />{" "}
                  &nbsp;&nbsp;&nbsp;
                  <input
                    type="text"
                    placeholder="New Value"
                    style={{ width: "90px" }}
                    onChange={e =>
                      this.setState({ replaceNewValue: e.target.value })
                    }
                  />{" "}
                </td>
                <td>
                  <Button onClick={() => this.sendNewSpecificValue()}>
                    Submit
                  </Button>
                </td>
                <Button onClick={() => this.getData("remove-range")}>
                  Help!
                </Button>
              </tr>
              <tr>
                <td>Replace Missing Values by Mean</td>
                <td></td>
                <td>
                  <Button
                    onClick={() =>
                      this.sendReplaceByMeanMedian("replace-by-mean")
                    }
                  >
                    Submit
                  </Button>
                </td>
                <Button onClick={() => this.getData("remove-range")}>
                  Help!
                </Button>
              </tr>
              <tr>
                <td>Replace Missing Values by Median</td>
                <td></td>
                <td>
                  <Button
                    onClick={() =>
                      this.sendReplaceByMeanMedian("replace-by-median")
                    }
                  >
                    Submit
                  </Button>
                </td>
                <Button onClick={() => this.getData("remove-range")}>
                  Help!
                </Button>
              </tr>
            </table>
          </div>
          <Modal
            show={this.state.modalShow}
            onHide={e => this.setState({ modalShow: false })}
          >
            <Modal.Header closeButton>
              <Modal.Title>{this.state.modalTopic}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.state.modalContent}</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={e => this.setState({ modalShow: false })}
              >
                Close
              </Button>
              <Button variant="primary">Save Changes</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default PreProcessing;
