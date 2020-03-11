import React, { Component } from "react";
import { getData, setToken } from "../actions/index";
import { connect } from "react-redux";
import ls from "local-storage";
import { baseUrl } from "../../shared/baseUrl";
import { Button } from 'react-bootstrap'
import Items from "../Items"

class Upload2 extends Component {
  state = {
	delimiter: "",
    description: "",
    token: "",
    fileMeta: [],
	isStructured: "No"
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
    const { description, isStructured, miningType } = this.state;
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
		// this.props.getData(uploadTest);
		// this.props.changeDisplay();
		console.log(files);
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
	  }
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
	document.getElementById("uploadUnstructured").style.backgroundColor = "#3b5998";	

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
              <u>Upload 1 or more Unstructured Files</u>
            </h3>
            <input
              style={{ marginLeft: "20px", marginBottom: "20px" }}
              type="file"
              ref={ref => {
                this.uploadInput = ref;
              }}
			  multiple
            />
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
  Upload2
);
