import React, { Component } from "react";
import { sampleData, sampleRowData } from "./displaytest2";
import ls from "local-storage";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { baseUrl } from "../../shared/baseUrl";

class PreProcessing2 extends Component {
  state = {
	stop_words: "",
    modalShow: false,
    modalTopic: "Stop words",
    modalContent: "Explanation of Stop Words"
  };

  handleClose = () => {
    this.setState({ modalShow: false });
  };

   removeStopWords = () => {
    const data = new FormData();
	const { stop_words } = this.state;
    const fileKey = ls.get("token");
	if (fileKey == "") {
		alert("Please upload atleast 1 unstructured file!")
	} else {
		data.append("fileKey", fileKey);
		data.append("stop_words", stop_words);
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
            >Remove Stop Words</Button>
			<p></p>
			 <input
                  type="button"
                  value="Get info about Stop Words"
                  onClick={() => this.getData("stop-words")}
                />
          </div>
		  	
			<br />

			<p> <b> Optional </b> - Enter stop words below to remove. Separate words by a comma. <b>Example: a,an,then.</b> </p>
			<textarea
              value={this.state.stop_words}
              cols="30"
              rows="5"
              resize="false"
              onChange={e => this.setState({ stop_words: e.target.value })}
            ></textarea>
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
