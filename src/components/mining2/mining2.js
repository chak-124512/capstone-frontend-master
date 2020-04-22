import React, { Component } from "react";
import ls from "local-storage";
import { baseUrl } from "../../shared/baseUrl";
import { Container, Row, Col } from "react-bootstrap";
import { JsonToTable } from "react-json-to-table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import renderHTML from "react-render-html";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Iframe from "react-iframe"


// const editorConfiguration = {
//   plugins: [ Essentials, Bold, Italic, Paragraph ],
//   toolbar: [ ]
// };
class Mining2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      evalutionModel: [],
      evalutionModelValue: "",
      model: [],
      selectedModel: "",
      images: [],
      modalShow: false,
      modalTopic: "TM",
      modalContent: "Result HTML of Topic Modeling",
	  n_topics: 0,
	  columns: [],
      checker: []
    };

    this.selectEvalutionModel = this.selectEvalutionModel.bind(this);
    this.selectModel = this.selectModel.bind(this);
  }

  componentDidMount() {
    this.setState({
      evalutionModel: [
        { id: "", name: "Select Evaluation Model" },
        { id: "TTS", name: "Train-test split" },
        { id: "CV", name: "Cross Validation" },
        { id: "NO", name: "None(for clustring)" }
      ],
      model: [
	    { id: "", name: "Select Model" },
		{ id: "TM", name: "Topic Modeling" },
		{ id: "WE", name: "Word Embedding" }
      ],
	  index:0
    });
	 var checker = [];
    this.getColumns().then(() => {
      this.state.columns.forEach((element, index) => {
        checker.push(false);
      });
      this.setState({ checker: checker });
	     this.setState({
        column_dropdown: (
          <Col>
            <select onChange={e => this.setTargetValue(e)}>
              <option>--Select--</option>
              {this.state.columns.map((item, key) => (
                <option key={key}>{item}</option>
              ))}
            </select>
          </Col>
        )
      });
	  });
  }

  updateCheck = (e, index) => {
    console.log("e", index);
    const { checker } = this.state;
    checker[index] = !checker[index];
    this.setState({ checker: checker });
    console.log("checker", this.state.checker);
  };

  selectEvalutionModel = e => {
    this.setState({ valuationType: e.target.value });
    console.log(e.target.value, "eeeee");
  };

  selectModel = e => {
    console.log(e.target.value, "eeeee");
    this.setState({ selectedModel: e.target.value });
  };

  setTargetValue = e => {
    console.log("selected target variable", e.target.value);
    this.setState({ target: e.target.value });
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
    var result = columns.columns;
	result = result.slice(1,result.length);
	this.setState({ columns: result });
	if (result.length>0) {
			document.getElementById("allCols").style.display = "";
		}
  }

  submitData() {
    console.log("Data Submit");
    console.log("selected model", this.state.selectedModel);
    const valuation = this.state.evalutionModelValue;
    console.log("valuation", valuation);
    const fileKey = ls.get("token") || this.state.evalutionModelValue || "testkey";
    const images = [];
	const statics_url = `${baseUrl}/static/`;


 
    if (this.state.selectedModel == "") {
		alert("Please choose a model first among the options");
	} else if (this.state.selectedModel == "TM") {
		const data = new FormData();
      data.append("fileKey", fileKey);
      data.append("n_topics", this.state.n_topics);
      const url = `${baseUrl}/topic-modeling`;
      fetch(url, {
        method: "POST",
        body: data
      })
        .then(response => response.json())
        .then(data => {
			if (data["description"]!="topics.html") {
				alert(data["description"])
			} else {
				alert("Please reload the new window once it appears to get the new result.")
				window.open(statics_url+ data["description"]);
			}
        
      });
	} else if (this.state.selectedModel == "WE") {
		const data = new FormData();
      data.append("fileKey", fileKey);

      const url = `${baseUrl}/word-embedding`;
      fetch(url, {
        method: "POST",
        body: data
      })
        .then(response => response.json())
        .then(data => {
			console.log("getting data", data);
			if (data.saved_file) images.push(data.saved_file);
        
      })
	  .then(() => {
          this.setState({ images });
        })
	}
  }
  getModelInfo = () => {
    console.log("button clicked");
	if (this.state.selectedModel == "") {
		alert("Please choose a model first among the options");
	} else {
		const topic = this.state.selectedModel;
		const url = `${baseUrl}/get-help`;
		const statics_url = `${baseUrl}/static/`;
		const data = new FormData();
		data.append("topic", topic);
		const model_obj = this.state.model.find(o => o.id == topic);
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
			this.setState({ modalTopic: model_obj.name });
			this.setState({ modalShow: true });
		  });
	  }
  };

  reload = () => {
    this.setState({
      index: this.state.index+1
    });
  };
  renderElement() {
    console.log("vadfsdf", this.state.selectedModel);

	if (this.state.selectedModel === "TM") {
      console.log("inside TM");
      return (
        <Container style={{ marginTop: "15px" }}>
          <Row>
            <Col>Enter the number of topics you want to get:</Col>
            <Col>
              <input
                type="text"
                onChange={e => this.setState({ n_topics: e.target.value })}
              />
            </Col>
          </Row>
        </Container>
      );
    }
  }

  render() {
    const { evalutionModel, model } = this.state;
	const { columns: cols } = this.state;

    let evalutionModelList =
      evalutionModel.length > 0 &&
      evalutionModel.map((item, i) => {
        return (
          <option key={i} value={item.id}>
            {item.name}
          </option>
        );
      }, this);

    let modelList =
      model.length > 0 &&
      model.map((item, i) => {
        return (
          <option key={i} value={item.id}>
            {item.name}
          </option>
        );
      }, this);

    return (
      <React.Fragment>
        <div style={{ marginLeft: 232, marginTop: 10 }}>
          <h2>Data Mining Options</h2>
        </div>
        <Container style={{ marginTop: 20 }}>
          <Row>
            <Col>
              <input
                style={{ marginTop: 10 }}
                type="text"
                placeholder="Enter A token"
                value={this.state.evalutionModelValue}
                onChange={e =>
                  this.setState({ evalutionModelValue: e.target.value })
                }
              />
            </Col>

			<Col></Col>

		
            <Col>
              <select onChange={this.selectModel}>{modelList}</select>
              {this.renderElement()}
            </Col>

			<Col style={{ marginLeft: 90 }}>
              <input
                type="button"
                value="Generate Model"
                onClick={() => this.submitData()}
              />
            </Col>

				<Col>
              <button
                class="btn btn-info"
                type="button"
                value="Help!"
                onClick={() => this.getModelInfo()}
              >
              Get Info about chosen model
              </button>
            </Col>

			<Col>
						<div id="allCols" class="column-box2" style={{display:"none"}}>

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
              ))}

			  </div>
            </Col>

          </Row>
        </Container>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
       

        {this.state.images
          ? this.state.images.map((url, index) => (
              <div>
                <img src={`${baseUrl}/static/` + url}></img>
              </div>
            ))
          : null}

        <Modal
          show={this.state.modalShow}
          onHide={e => this.setState({ modalShow: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modalTopic}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CKEditor
              editor={ClassicEditor}
              data={this.state.modalContent}
              disabled={true}
              config={{ toolbar: [] }}
            />
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

export default Mining2;