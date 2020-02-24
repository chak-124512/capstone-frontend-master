import React, { Component } from "react";
import ls from "local-storage";
import ReactTable from "react-table";
import "react-table/react-table.css";
import renderIf from "render-if";
import { JsonToTable } from "react-json-to-table";
import { baseUrl } from "../../shared/baseUrl";
import Modal from "react-bootstrap/Modal";
import { Container, Row, Col, Button } from "react-bootstrap";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

class InputForm extends Component {
  state = {
    columns: [],
    checker: [],
    chartType: "histogram",
    images: [],
    displayCorrelation: false,
    correlationRows: [],
    correlationCols: [],
    modalShow: false
  };

  componentDidMount() {
    var checker = [];
    this.getColumns().then(() => {
      this.state.columns.forEach((element, index) => {
        checker.push(false);
      });
      this.setState({ checker: checker });
    });
  }

  updateCheck = (e, index) => {
    console.log("e", index);
    const { checker } = this.state;
    checker[index] = !checker[index];
    this.setState({ checker: checker });
    console.log("checker", this.state.checker);
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

  getCharts = () => {
    const data = new FormData();
    const fileKey = ls.get("token") || "testkey";
    console.log(fileKey);
    this.setState({ images: [] });
    data.append("fileKey", fileKey);
    data.append("visType", this.state.chartType);
    const required_columns = [];
    this.state.columns.forEach((column, index) => {
      if (this.state.checker[index] == true) {
        required_columns.push(column);
      }
    });
    data.append("columns", required_columns);
    console.log("stats columns", this.state.columns);
    console.log("our columns", required_columns);
    console.log("sending data", data);
    const url = `${baseUrl}/visualization`;
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => {
        console.log("getting data", data);
        this.setState({ images: data["images"] });
        if (this.state.chartType == "Correlation") {
          console.log("rows we have", data["correlation"]["rows"]);
          this.setState({ correlationRows: data["correlation"]["rows"] });
          const statCols = data["correlation"]["columns"]
            .map(e => {
              return { Header: e, accessor: e };
            })
            .then(statCols =>
              this.setState({
                correlationCols: statCols
              })
            );
        }
      })
      .catch(err => console.log(err));
    if (this.state.chartType == "Correlation") {
      this.setState({ displayCorrelation: true });
    } else {
      this.setState({ displayCorrelation: false });
    }
  };

  getHelp = () => {
    console.log("button clicked");
    const topic = this.state.chartType;
    console.log("selected topic", topic);
    const url = `${baseUrl}/get-help`;
    const statics_url = `${baseUrl}/static/`;
    const data = new FormData();
    data.append("topic", topic);
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => {
        fetch(statics_url + data["description"])
          .then(res => {
            return res.text();
          })
          .then(html_data => {
            console.log("html data", html_data);
            this.setState({ modalContent: html_data });
          });
        this.setState({ modalTopic: this.state.chartType });
        this.setState({ modalShow: true });
      });
  };

  render() {
    const { columns: cols } = this.state;
    return (
      <React.Fragment>
        <Row style={{ paddingLeft: 10, paddingTop: 10 }}>
          {cols.map((item, key) => (
            <Col key={key} md="3">
              <Row>
                <Col>
                  <label>{item}</label>
                </Col>
                <Col>
                  <input
                    type="checkbox"
                    value={item}
                    onChange={e => {
                      this.updateCheck(e, key);
                    }}
                  />
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
        <Row style={{ paddingLeft: 10, paddingTop: 20 }}>
          <Col>
            <select
              onChange={e => this.setState({ chartType: e.target.value })}
            >
              <option>Histogram</option>
              <option>Correlation</option>
              <option>Box Plot</option>
              <option>Apply PCA</option>
            </select>
          </Col>
          <Col>
            <Button onClick={() => this.getCharts()}>Generate</Button>
          </Col>
          <Col>
            <Button onClick={() => this.getHelp()}>Help!</Button>
          </Col>
        </Row>
        <br />
        <br />
        <Row>
          {this.state.images.map((url, index) => (
            <Col md="6" style={{ paddingLeft: 30, paddingTop: 20 }}>
              <div key={index}>
                <img
                  style={{ width: 550, height: 550 }}
                  src={`${baseUrl}/static/` + url}
                />{" "}
                <br />
                <br />
              </div>
            </Col>
          ))}
        </Row>
        <Row>
          {this.state.chartType == "Correlation" ? (
            <h4 style={{ textAlign: "center", padding: "-5px" }}>
              Correlation
            </h4>
          ) : null}
          {renderIf(this.state.displayCorrelation == true)(
            <JsonToTable
              style={{ marginLeft: "15%", height: "200px" }}
              json={this.state.correlationRows}
            />
          )}{" "}
        </Row>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Modal
          show={this.state.modalShow}
          onHide={e => this.setState({ modalShow: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.chartType}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CKEditor
              editor={ClassicEditor}
              data={this.state.modalContent}
              disabled={true}
              config={{ toolbar: [] }}
            />
            {/* {renderHTML(this.state.modalContent)} */}
          </Modal.Body>
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
      </React.Fragment>
    );
  }
}

export default InputForm;
