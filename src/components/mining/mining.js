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

// const editorConfiguration = {
//   plugins: [ Essentials, Bold, Italic, Paragraph ],
//   toolbar: [ ]
// };
class Mining extends Component {
  constructor(props) {
    super(props);
    this.state = {
      evalutionModel: [],
      evalutionModelValue: "",
      model: [],
      selectedModel: "",
      columns: [],
      checker: [],
      images: [],
      n_estimator: 100,
      max_depth: 2,
      modalShow: false,
      modalTopic: "RF",
      modalContent: "Explanation of Random Forest",
      n_clusters: 2,
	  n_topics: 0
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
        { id: "LR", name: "Linear Regression" },
        { id: "RF", name: "Random Forest" },
        { id: "SVM", name: "Support Vector Machine" },
        { id: "KNN", name: "K-Nearest Neighbor" },
        { id: "MP", name: "Multilayer Perceptron" },
        { id: "HC", name: "Hierarchical Clustering" }
      ]
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

  submitData() {
    console.log("Data Submit");
    console.log("selected model", this.state.selectedModel);
    const valuation = this.state.evalutionModelValue;
    console.log("valuation", valuation);
    const fileKey = ls.get("token") || "testkey";
    const required_columns = [];
    const images = [];
    this.state.columns.forEach((column, index) => {
      if (this.state.checker[index] == true) {
        required_columns.push(column);
      }
    });
	if (this.state.selectedModel == "") {
		alert("Please choose a model first among the options");
	} else if (this.state.selectedModel == "RF") {
      console.log("n esti", this.state.n_estimator);
      console.log("depth", this.state.max_depth);
      const data = new FormData();
      data.append("fileKey", fileKey);
      data.append("valuation", valuation);
      data.append("n_estimator", this.state.n_estimator);
      data.append("max_depth", this.state.max_depth);
      data.append("columns", required_columns);
      data.append("valuationType", this.state.valuationType);
      data.append("target_col", this.state.target);
      const url = `${baseUrl}/random-forest`;
      fetch(url, {
        method: "POST",
        body: data
      })
        .then(response => response.json())
        .then(data => {
          console.log("getting data", data);
          if (data.imgFeat) images.push(data.imgFeat);
          if (data.imgROC) images.push(data.imgROC);
          images.push(data.imgConf);
          if (data.report) this.setState({ report: data.report });
          if (data.rmse_scores)
            this.setState({ rmse_scores: data.rmse_scores });
          if (data.mean) this.setState({ mean: data.mean });
          if (data.std) this.setState({ std: data.std });
          if (data.imgErr) images.push(data.imgErr);
          console.log("images we have", images);
        })
        .then(() => {
          this.setState({ images });
        })
        .catch(err => console.log(err));
    } else if (this.state.selectedModel == "LR") {
      const data = new FormData();
      data.append("fileKey", fileKey);
      data.append("valuation", valuation);
      data.append("columns", required_columns);
      data.append("valuationType", this.state.valuationType);
      data.append("target_col", this.state.target);
      const url = `${baseUrl}/linear-regression`;
      fetch(url, {
        method: "POST",
        body: data
      })
        .then(response => response.json())
        .then(data => {
          console.log("getting data", data);
          if (data.imgFeat) images.push(data.imgFeat);
          if (data.imgROC) images.push(data.linearFit);
          if (data.report) this.setState({ report: data.report });
          if (data.rmse_score) this.setState({ rmse_scores: data.rmse_score });
          if (data.mean) this.setState({ mean: data.mean });
          if (data.std) this.setState({ std: data.std });
          if (data.mse) this.setState({ mse: data.mse });
          if (data.r2s) this.setState({ r2s: data.r2s });
        })
        .then(() => {
          this.setState({ images });
        })

        .catch(err => console.log(err));
    } else if (this.state.selectedModel == "HC") {
      const data = new FormData();
      data.append("fileKey", fileKey);
      data.append("columns", required_columns);
      data.append("n_clusters", this.state.n_clusters);
      const url = `${baseUrl}/hierarchical`;
      fetch(url, {
        method: "POST",
        body: data
      })
        .then(response => response.json())
        .then(data => {
          console.log("getting data", data);
          if (data.cluster) images.push(data.cluster);
          if (data.dendrogram) images.push(data.dendrogram);
        })
        .then(() => {
          this.setState({ images });
        })
        .catch(err => console.log(err));
    }
    // console.log("images we have", images);
    this.setState({ images });
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
  renderElement() {
    console.log("vadfsdf", this.state.selectedModel);

    if (this.state.selectedModel === "LR") {
      return (
        <div>
          <Container>
            <Row>
              <Col>Select target variable:</Col>
            </Row>
            {this.state.column_dropdown}
          </Container>
        </div>
      );
    }

    if (this.state.selectedModel === "RF") {
      return (
        <Container style={{ marginTop: "15px" }}>
          <Row>
            <Col>Enter the value for n_estimator parameter</Col>
            <Col>
              <input
                type="text"
                onChange={e => this.setState({ n_estimator: e.target.value })}
              />
            </Col>
          </Row>
          <Row>
            <Col>Enter the value for max depth parameter</Col>
            <Col>
              <input
                type="text"
                onChange={e => this.setState({ max_depth: e.target.value })}
              />
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>Select target variable:</Col>
          </Row>
          {this.state.column_dropdown}
        </Container>
      );
    }

    if (this.state.selectedModel === "SVM") {
      return <div></div>;
    }

    if (this.state.selectedModel === "KNN") {
      return <div></div>;
    }

    if (this.state.selectedModel === "MP") {
      return <div></div>;
    }

    if (this.state.selectedModel === "HC") {
      console.log("inside HC");
      return (
        <Container style={{ marginTop: "15px" }}>
          <Row>
            <Col>Enter the number of clusters you want</Col>
            <Col>
              <input
                type="text"
                onChange={e => this.setState({ n_clusters: e.target.value })}
              />
            </Col>
          </Row>
          <Row>
            <Col>Select column 1:</Col>
          </Row>
          <Row>{this.state.column_dropdown}</Row>
          <Row>
            <Col>Select column 2:</Col>
          </Row>
          <Row>{this.state.column_dropdown}</Row>

          {/* <Row>
            <Col>Select target Variable</Col>
            <Col>
              <select onChange={e => this.setTargetValue(e)}>
                <option>--Select--</option>
                {this.state.columns.map((item, key) => (
                  <option key={key}>{item}</option>
                ))}
              </select>
            </Col>
            <Col></Col>
          </Row> */}
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
              <select onChange={this.selectEvalutionModel}>
                {evalutionModelList}
              </select>
              <br />
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
            </Col>
          </Row>
        </Container>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        {this.state.report ? (
          <div>
            <h3> Report </h3>
            <JsonToTable
              style={{ marginLeft: "15%", height: "200px" }}
              json={this.state.report}
            />
          </div>
        ) : null}
        {this.state.mean ? (
          <div>
            <label>
              <h3>Mean</h3>
            </label>{" "}
            <h3>{this.state.mean}</h3>
          </div>
        ) : null}
        {this.state.std ? (
          <div>
            <label>
              <h3>standard deviation</h3>
            </label>{" "}
            <h3>{this.state.std}</h3>
          </div>
        ) : null}
        {this.state.r2s ? (
          <div>
            <label>
              <h3>R2 score</h3>
            </label>{" "}
            <h3>{this.state.r2s}</h3>
          </div>
        ) : null}
        {this.state.mse ? (
          <div>
            <label>
              <h3>Mean Squared Error</h3>
            </label>
            {this.state.mse}
          </div>
        ) : null}

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

export default Mining;
