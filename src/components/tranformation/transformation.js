import React, { Component } from "react";
import ls from "local-storage";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { baseUrl } from "../../shared/baseUrl";
import { Row, Col } from 'react-bootstrap';
class Tranformation extends Component {
  state = {
    columns: [],
    checker: [],
    checkerChecked: false,
    modalShow: false,
    modalTopic: "Naive Bayes",
    modalContent: "Explanation of Naive Bayes"
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

  getData = topic => {
    console.log("getting data for ", topic);
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
  tranformSTD = () => {
    const data = new FormData();
    const fileKey = ls.get("token") || "testkey";
    console.log(fileKey);
    data.append("fileKey", fileKey);
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
    const url = `${baseUrl}/standard-scale`;
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => {
        console.log("we got", data);
        alert("Your data is updated succesfully!");
      })
      .catch(err => console.log(err));
  };

  render() {
    const { columns: cols } = this.state;
    return (
      <React.Fragment>

        <div style={{ marginLeft: 245, marginTop: 10 }}>
        <div>
          <h1>Data Tranformation</h1>
        </div>
        <table>
          <tr>
            <td style={{width:200}}>
              <h5>Select columns</h5>
              {cols.map((item, key) => (
                  <Row key={key}>
                  <Col sm={8}>
                    <label>{item}</label>
                  </Col>
                  <Col sm={4}>
                    <input
                      type="checkbox"
                      value={item}
                      onChange={e => {
                        this.updateCheck(e, key);
                      }}
                    />
                  </Col>
                </Row>
                // <div>
                //   <label>{item}</label>
                //   <input
                //     type="checkbox"
                //     value={item}
                //     onChange={e => {
                //       this.updateCheck(e, key);
                //     }}
                //   ></input>
                // </div>
              ))}
            </td>
            <td>
              <div class="container">
                <div class="row">
                  <div class="col-*-*">
                    <input
                      type="button"
                      class="btn btn-primary"
                      value="Standard Scaling!"
                      onClick={() => this.tranformSTD()}
                    />
                  </div>
                  <div class="col-*-*">
                    {` `}
                    {` `}
                    {` `}
                    <button
                      class="btn btn-info"
                      type="button"
                      value="Help!"
                      onClick={() => this.getData("standard-scaling")}
                    >
                      Help!
                    </button>
                  </div>
                </div>
                <br />
                <br />
                <div class="row">
                  <div class="col-*-*">
                    <input
                      type="button"
                      class="btn btn-primary"
                      value="Min-Max Scaling!"
                      onClick={() => this.tranformSTD()}
                    />
                  </div>{" "}
                  <div class="col-*-*">
                    {` `}
                    {` `}
                    {` `}
                    <button
                      class="btn btn-info"
                      type="button"
                      value="Help!"
                      onClick={() => this.getData("standard-scaling")}
                    >
                      Help!
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </table>
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

export default Tranformation;
