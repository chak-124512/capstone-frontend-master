import React, { Component } from "react";
import { getData, setToken } from "../actions/index";
import { connect } from "react-redux";
import { uploadTest } from "./testData";
import { fileMetaData } from "./fileMeta";
import ls from "local-storage";
import { baseUrl } from "../../shared/baseUrl";
import { Button } from 'react-bootstrap'
import Items from "../Items"

class Upload extends Component {
  state = {
	delimiter: "",
    description: "",
    token: "",
    fileMeta: []
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

  uploadFile = () => {
    const { delimiter, description, hasHeader, miningType } = this.state;
    const file = this.uploadInput.files[0];
    const data = new FormData();
    data.append("file", file);
	data.append("delimiter", delimiter);
    data.append("description", description);
	data.append("hasHeader", hasHeader);
    data.append("miningType", miningType);
    // this.props.getData(uploadTest);
    // this.props.changeDisplay();
    console.log(file);
    fetch(`${baseUrl}/upload`, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => {
        const { filename: token } = data;
        // alert(JSON.stringify(data));
        this.setState({ token });
        ls.set("token", token);
      })
      // .then(() => this.getFileButton.click())
      .catch(err => console.log(err));
  };

  async getFileFromToken() {
    const { token } = this.state;
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
              <u>Upload a File</u>
            </h3>
            <input
              style={{ marginLeft: "20px", marginBottom: "20px" }}
              type="file"
              ref={ref => {
                this.uploadInput = ref;
              }}
            />
          </div>

		  <div>
            File has labeled columns?
          
			<select
              onChange={e => this.setState({ hasHeader: e.target.value })}
            >
              <option>Yes</option>
              <option>No</option>
            </select>

		  </div>

		  <br/>
		    <div>
            Delimiter(Optional):
          
			<input
			  type="text"
              value={this.state.delimiter}
			  size="2"
              onChange={e => this.setState({ delimiter: e.target.value })}
            />

		  </div>

          <br />
          <div>
            <textarea
              value={this.state.description}
              cols="30"
              rows="5"
              resize="false"
              onChange={e => this.setState({ description: e.target.value })}
            ></textarea>
            <br />
            <select
              onChange={e => this.setState({ miningType: e.target.value })}
            >
              <option>Clustering</option>
              <option>Classification</option>
              <option>Regression</option>
            </select>
            <br />
          </div>
          <br />
          <div>
            <Button
              type="button"
              onClick={() => this.uploadFile()}
            >Submit</Button>
          </div>

          <hr />
          <h3>
            <u>Retrieve File</u>
          </h3>
          
          <input
            type="text"
            placeholder="Enter A token"
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
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, { getData, setToken }, null, { forwardRef: true })(
  Upload
);
