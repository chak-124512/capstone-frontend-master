import React, { Component } from "react";
import { sampleData, sampleRowData } from "./displaytest2";
import ls from "local-storage";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { baseUrl } from "../../shared/baseUrl";
import { Container, Row, Col, Button } from "react-bootstrap";

class PreProcessing2 extends Component {
  state = {
	columns: [],
    checker: [],
    modalShow: false,
    modalTopic: "Stop words",
    modalContent: "Explanation of Stop Words"
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
    const fileKey = ls.get("token");
    if (fileKey == null) {
		alert("Please upload atleast 1 unstructured file so that the data can be pre-processed!")
	} else {
		data.append("fileKey", fileKey);
		const url = `${baseUrl}/stats`;
		const response = await fetch(url, {
		  method: "POST",
		  body: data
		});
		const columns = await response.json();
		var result = columns.columns;
		result = result.slice(1,result.length);
		this.setState({ columns: result });
	}
  }

  handleClose = () => {
    this.setState({ modalShow: false });
  };

   removeStopWords = () => {
    const data = new FormData();
    const fileKey = ls.get("token");
	if (fileKey == "") {
		alert("Please upload atleast 1 unstructured file!")
	} else {
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
		const url = `${baseUrl}/remove-stop-words`;
		fetch(url, {
		  method: "POST",
		  body: data
		})
		  .then(response => response.json())
		  .then(data => alert(data.message));
	}
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
      const { columns: cols } = this.state;

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
            </span>
          </div>
          <br />
          <br />

          <div>
            <h3>
              <u>Cleaning Process</u>
            </h3>
			<br />
          <div>
            <Button
              type="button"
              onClick={() => this.removeStopWords()}
            >Remove Selected Words from the table</Button>
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			<input
                  type="button"
                  value="Help!"
                  onClick={() => this.getData("remove-words")}
                />
			
          </div>
		  	
			<br />

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
			<br />
            
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

export default PreProcessing2;
