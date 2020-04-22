import React, { Component } from "react";
import { getData, setToken } from "../actions/index";
import { connect } from "react-redux";
import { uploadTest } from "./testData";
import { fileMetaData } from "./fileMeta";
import ls from "local-storage";
import { baseUrl } from "../../shared/baseUrl";
import { Button } from 'react-bootstrap'
import Items from "../Items"
import Modal from "react-bootstrap/Modal";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

class Upload extends Component {
  state = {
	delimiter: "",
    description: "",
    token: "",
    fileMeta: [],
	isStructured: "Yes",
	miningType: "Clustering",
    modalShow: false,
    modalTopic: "File upload status",
    modalContent: ""

  };

   // this is the react default function that gets called when the component gets mounted - page loads
  componentDidMount() {
    this.props.updateStateRef(this);
    const url = `${baseUrl}/sample-files`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({ fileMeta: data });
      })
      // .then(() => this.getFileButton.click())
      .catch(err => console.log(err));
  };

     // function thats gets called for help buttons
     getHelp = (topic) => {
    console.log("button clicked");
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
		  if (topic=="upload-structured-info") {
		  	  topic = "Uploading structured data";
		  }
        this.setState({ modalTopic: topic });
        this.setState({ modalShow: true });
      });
  };

  uploadFile = () => {
    const { delimiter, description, isStructured, miningType } = this.state;
    const files = this.uploadInput.files;
    const data = new FormData();
	if (files.length == 0)  {
		alert("Please upload a file.")
	} else {
		const file = files[0];
		data.append("file", file);
		data.append("delimiter", delimiter);
		data.append("isStructured", isStructured);
		data.append("description", description);
		data.append("miningType", miningType);
		// this.props.getData(uploadTest);
		// this.props.changeDisplay();
		console.log(files);
		fetch(`${baseUrl}/upload`, {
		  method: "POST",
		  body: data
		})
		  .then(response => response.json())
		  .then(data => {
			alert(data.message);

			const { filename: token } = data;
			// alert(JSON.stringify(data));
			this.setState({ token });
			ls.set("token", token);
		  })
		  // .then(() => this.getFileButton.click())
		  .catch(err => console.log(err));
	  }
  };

  async getFileFromToken() {
    const { token } = this.state;
	if (token=="") {
		alert("Please make sure files have been uploaded!")
	} else {
		const url = `${baseUrl}/file-data`;

		const data = new FormData();
		data.append("fileKey", token);

		ls.set("token", token);
		//Fetching Row Data
		const request = await fetch(url, {
		  method: "POST",
		  body: data
		});
		const rowData = await request.json();

		//Fetching columns
		const request2 = await fetch(`${baseUrl}/stats`, {
		  method: "POST",
		  body: data
		});

		const newData = await request2.json();
		const cols = newData.columns;
		// console.log(cols);

		this.props.getData(rowData, cols);
	
		// change button color of Upload File button since app navigates to Display Data page
		document.getElementById("csvUpload").style.backgroundColor = "#3b5998";	

		// change button color of Display Content button since app navigates to Display Data page
		document.getElementById("displayContent").style.backgroundColor = "#61ddff";	


		this.props.changeDisplay();
	}
  }

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            align: "center",
            marginLeft: "20%",
            marginTop: "10px"
          }}
        >
            <h3>
              <u>Upload a Structured File</u>
            </h3>

			<div class="box2">
				<p><b><i>File upload and upload options:</i></b></p>
				<p><font color="red"><b>File types supported - CSV, stuctured TXT with a delimiter</b></font></p>
				<p>
				<input
				  type="file"
				  ref={ref => {
					this.uploadInput = ref;
				  }}
				/>
				<Button onClick={() => this.getHelp("upload-structured-info")}>
					  Help!
				</Button>
				</p>
				<p>
				Delimiter(Optional):
				<input
				  type="text"
				  value={this.state.delimiter}
				  size="2"
				  onChange={e => this.setState({ delimiter: e.target.value })}
				/>
			  </p>
			  </div>				

          <br />
          <div>
			<p>Enter Description(Optional):</p>
            <textarea
              value={this.state.description}
              cols="30"
              rows="5"
              resize="false"
              onChange={e => this.setState({ description: e.target.value })}
            ></textarea>
			</div>
            
			<br />
			<div>
			<p>Choose Data Mining Type:</p>
            <select
              onChange={e => this.setState({ miningType: e.target.value })}
            >
              <option>Clustering</option>
              <option>Classification</option>
              <option>Regression</option>
            </select>
			</div>

          <br />
          <div>
            <Button
              type="button"
              onClick={() => this.uploadFile()}
            >Submit File</Button>
          </div>

          <hr />
          <h3>
            <u>Retrieve File</u>
          </h3>
          
          <input
            type="text"
            placeholder="Enter a token"
            value={this.state.token}
            onChange={e => this.setState({ token: e.target.value })}
          />
          <br />
          <br />

          <Button
            type="button"
            ref={e => (this.getFileButton = e)}
            onClick={() => this.getFileFromToken()}
          >Get File </Button>

          <br />
          <br />
          <table border="1px solid black" cellPadding="15px">
            <tr>
              <th>File Name</th>
              <th>description</th>
            </tr>
            {this.state.fileMeta.map((item, key) => (
              <tr>
                <td>
                  <span
                    style={{
                      color: "blue",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                    onClick={e => {
                      this.setState({ token: item.token });
                      ls.set("token", item.token);
                    }}
                  >
                    {item.filename}
                  </span>
                </td>
                <td>
                  <span>{item.description}</span>
                </td>
              </tr>
            ))}
          </table>

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
            {/* {renderHTML(this.state.modalContent)} */}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={e => this.setState({ modalShow: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, { getData, setToken }, null, { forwardRef: true })(
  Upload
);
