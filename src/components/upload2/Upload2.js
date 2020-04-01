import React, { Component } from "react";
import { getData, setToken } from "../actions/index";
import { connect } from "react-redux";
import ls from "local-storage";
import { baseUrl } from "../../shared/baseUrl";
import { Button } from 'react-bootstrap'
import Items from "../Items"
import Modal from "react-bootstrap/Modal";

class Upload2 extends Component {
  state = {
	delimiter: "",
    description: "",
    token: "",
    fileMeta: [],
	isStructured: "No",
	stemming: "Yes",
	lemmatization: "Yes",
    modalShow: false,
    modalTopic: "File upload status",
    modalContent: ""
  };

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

  uploadFile = () => {
    const { description, isStructured, stemming, lemmatization } = this.state;
    const files = this.uploadInput.files;
    const data = new FormData();
	if (files.length == 0)  {
		alert("Please upload atleast 1 file.")
	} else {
			for (var i=0; i<files.length; i++) {
				var key = "file"+i;
				data.append(key, files[i]);
			}
		data.append("isStructured", isStructured);
		data.append("description", description);
		data.append("stemming", stemming);
		data.append("lemmatization", lemmatization);
		// this.props.getData(uploadTest);
		// this.props.changeDisplay();
		console.log(files);
		fetch(`${baseUrl}/upload`, {
		  method: "POST",
		  body: data
		})
		  .then(response => response.json())
		  .then(data => {
			
			this.setState({ modalContent: data.message });
			this.setState({ modalShow: true });

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
		document.getElementById("uploadUnstructured").style.backgroundColor = "#3b5998";	

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
            marginTop: "10px",
          }}
        >
		<div style={{}}>
            <h3>
              <u>Upload 1 or more Unstructured Files</u>
            </h3>
			<p><i>File types supported - TXT, DOCX</i></p>
			<Button onClick={() => this.getData("upload-unstructured-info")}>
                  What happens when I upload?
            </Button>
            <input
              style={{ marginLeft: "20px", marginBottom: "20px" }}
              type="file"
              ref={ref => {
                this.uploadInput = ref;
              }}
			  multiple
            />

			<p>Perform word stemming?
			&nbsp;&nbsp;&nbsp;
            <select
              onChange={e => this.setState({ stemming: e.target.value })}
            >
              <option>Yes</option>
              <option>No</option>
            </select>
			&nbsp;&nbsp;&nbsp;
			<Button onClick={() => this.getData("stemming-info")}>
                  Help!
            </Button>
			</p>

			<p>Perform word lemmatization?
			&nbsp;&nbsp;&nbsp;
            <select
              onChange={e => this.setState({ lemmatization: e.target.value })}
            >
              <option>Yes</option>
              <option>No</option>
            </select>
			&nbsp;&nbsp;&nbsp;
			<Button onClick={() => this.getData("lemmatization-info")}>
                  Help!
            </Button>
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
            <Button
              type="button"
              onClick={() => this.uploadFile()}
            >Submit Files</Button>
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
            <Modal.Body>{this.state.modalContent}</Modal.Body>
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
  Upload2
);
