import React, { Component } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { baseUrl } from "../../shared/baseUrl";
import renderHTML from "react-render-html";
import ls from "local-storage";
import { Container, Row, Col } from "react-bootstrap";

class CodeBox extends Component {
  state = {
    user_code: "",
    file_code: "",
    modalShow: false,
    modalTopic: "Your output",
    modalContent: "Wait..."
  };

  componentWillMount() {
    // getting code
    const data = new FormData();
    const fileKey = ls.get("token") || "testkey";
    console.log("filekey in codebox", fileKey);
    data.append("fileKey", fileKey);
    const url = `${baseUrl}/get-code`;
    fetch(url, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => {
        console.log("incoming code", data.code);
        this.setState({
          // file_code: "print('happy coding')\nprint('happy coding2') "
          file_code: data.code
        });
      })
      .catch(err => console.log(err));
  }
  updateCode1 = newCode => {
    this.setState({ user_code: newCode });
  };

  submitCode = () => {
    const code = this.state.user_code;
    console.log("new value", code);
    const data = new FormData();
    data.append("code", code);
    const code_url = `${baseUrl}/codebox`;
    fetch(code_url, {
      method: "post",
      body: data
    })
      .then(response => response.json())
      .then(data => {
        let output = data.output;
        console.log("output", output);
        output = output.replace(/(?:\r\n|\r|\n)/g, "<br>");
        this.setState({ modalContent: output });
        this.setState({ modalShow: true });
      })
      .catch(err => alert(err));
  };

  render() {
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col xs="6" sm="6">
              <label>
                <h4>Your Code</h4>
              </label>
              <AceEditor
                mode="python"
                theme="github"
                onChange={this.updateCode1}
                name="capstone"
                value={this.state.user_code}
                editorProps={{ $blockScrolling: true }}
              />
            </Col>
            <Col xs="6" sm="6">
              <label>
                <h4>Server Code</h4>
              </label>
              <AceEditor
                mode="python"
                theme="github"
                name="capstone"
                value={this.state.file_code}
                editorProps={{ $blockScrolling: true }}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col style={{ marginLeft: 100 }}>
              <input
                type="button"
                onClick={this.submitCode}
                value="submit"
              ></input>
            </Col>
          </Row>
        </Container>

        <Modal
          show={this.state.modalShow}
          onHide={e => this.setState({ modalShow: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modalTopic}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{renderHTML(this.state.modalContent)}</Modal.Body>
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

        {/* </Container> */}
      </React.Fragment>
    );
  }
}

export default CodeBox;
