import React, { Component } from "react";
import ls from "local-storage";
import { Button } from 'react-bootstrap';

class Items extends Component {
  state = {
	currentDisplay : "uploadUnstructured"
  };

  componentDidMount() {
	// if user is logged in, then username is saved in local storage 
	const username = ls.get("username") || "";
	if (username != "") {
		document.getElementById("login").style.display = "none";
		document.getElementById("register").style.display = "none";
		document.getElementById("logout").style.display = "";
		document.getElementById("welcome").innerHTML = "Welcome "+ username;
		document.getElementById("welcome").style.display = "";
		document.getElementById("workflow").style.display = "";

	}
  }

  changeButtonColorAndChangeDisplay = (id) => {
	var backgroundColor = document.getElementById(this.state.currentDisplay).style.backgroundColor;
	// check if button color and display was changed outside this method - currentDisplay would not have changed
	if (backgroundColor == "rgb(59, 89, 152)") {
		document.getElementById("displayContent").style.backgroundColor = "#3b5998";
		document.getElementById("displayUnstructured").style.backgroundColor = "#3b5998";
	} else {
	  	document.getElementById(this.state.currentDisplay).style.backgroundColor = "#3b5998";
	}
	document.getElementById(id).style.backgroundColor = "#61ddff";
	// change the currentDisplay 
	this.setState({ currentDisplay : id });
	this.props.changeDisplay(id);
  };

  logout = () => {
  // logout- clear username and saved tokens from local storage
	ls.remove("username");
	window.location.reload(false);

  }


  showButtons = () => {
	const username = ls.get("username") || "";
	if (document.getElementById("csvUpload").style.display == "none") {
		// change from unstructured file view to stuctured file view

		// toggle upload tabs
		document.getElementById("csvUpload").style.display = "";
		document.getElementById("uploadUnstructured").style.display = "none";

		// toggle display tabs
		document.getElementById("displayContent").style.display = "";
		document.getElementById("displayUnstructured").style.display = "none";

		// transformation tab only needed for structured data
		document.getElementById("transformation").style.display = "";

		// visualization tab only needed for structured data
		document.getElementById("visualization").style.display = "";

		// toggle preprocessing tabs
		document.getElementById("preProcessing").style.display = "";
		document.getElementById("preProcessingUnstructured").style.display = "none";

		// toggle data modelling operations tab
		document.getElementById("mining").style.display = "";
		document.getElementById("miningUnstructured").style.display = "none";

		// toggle workflow tabs only if user is logged in
		if (username != "") {
			document.getElementById("workflow3").style.display = "";
			document.getElementById("workflow").style.display = "none";
		}

		// change from tabs that won't be visible in unstructured file view
		if (this.state.currentDisplay=="uploadUnstructured") {
			this.changeButtonColorAndChangeDisplay("csvUpload");
		} else if (this.state.currentDisplay=="displayUnstructured") {
			this.changeButtonColorAndChangeDisplay("displayContent");
		} else if (this.state.currentDisplay=="preProcessingUnstructured") {
			this.changeButtonColorAndChangeDisplay("preProcessing");
		} else if (this.state.currentDisplay=="miningUnstructured") {
			this.changeButtonColorAndChangeDisplay("mining");
		} else if (this.state.currentDisplay=="workflow" || this.state.currentDisplay=="workflow2") {
			this.changeButtonColorAndChangeDisplay("workflow3");
		}
	} else {
		// change from structured file view to unstuctured file view
		
		// toggle upload tabs
		document.getElementById("csvUpload").style.display = "none";
		document.getElementById("uploadUnstructured").style.display = "";

		// toggle display tabs
		document.getElementById("displayContent").style.display = "none";
		document.getElementById("displayUnstructured").style.display = "";

		// visualization tab only needed for structured data
		document.getElementById("visualization").style.display = "none";

		// transformation tab only needed for structured data
		document.getElementById("transformation").style.display = "none";

		// toggle preprocessing tabs
		document.getElementById("preProcessing").style.display = "none";
		document.getElementById("preProcessingUnstructured").style.display = "";

		// toggle data modelling operations tab
		document.getElementById("mining").style.display = "none";
		document.getElementById("miningUnstructured").style.display = "";

		// toggle workflow tabs only if user is logged in
		if (username != "") {
			document.getElementById("workflow3").style.display = "none";
			document.getElementById("workflow").style.display = "";
		}

		// change from tabs that won't be visible in structured file view
		if (this.state.currentDisplay=="csvUpload" || this.state.currentDisplay=="transformation" ||
		this.state.currentDisplay=="visualization") {
			this.changeButtonColorAndChangeDisplay("uploadUnstructured");
		} else if (this.state.currentDisplay=="displayContent") {
			this.changeButtonColorAndChangeDisplay("displayUnstructured");
		} else if (this.state.currentDisplay=="preProcessing") {
			this.changeButtonColorAndChangeDisplay("preProcessingUnstructured");
		} else if (this.state.currentDisplay=="mining") {
			this.changeButtonColorAndChangeDisplay("miningUnstructured");
		} else if (this.state.currentDisplay=="mining") {
			this.changeButtonColorAndChangeDisplay("miningUnstructured");
		} else if (this.state.currentDisplay=="workflow3" || this.state.currentDisplay=="workflow4") {
			this.changeButtonColorAndChangeDisplay("workflow");
		}
	}
  };

  render() {
    return (
      <div
        style={{
          width: "15vw",
          height: "1000vh",
          // backgroundColor: "#0078FF",
          borderRight: "1px solid black",
          float: "left",
          paddingTop: "10px",
          color: "white",
        }}
      >

	  <div id="login"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("login")}
        >
          Login
        </div>

		
	  <div id="register"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("register")}
        >
          Register
        </div>

	<div id="welcome" style={{margin: "10px", fontSize:"20px", color: "blue", display:"none"}} ></div>

	  <p style={{margin: "10px", fontSize:"20px", color: "black"}} > File structured? 
		<label class="switch">
			<input type="checkbox" id="togBtn" onChange={this.showButtons} />
				<div class="slider round">
					<span class="on">YES</span>
					<span class="off">NO</span>
				</div>
			</label>
		</p>

		<div id="uploadUnstructured"
          style={{
            backgroundColor: "#61ddff",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("uploadUnstructured")}
        >
          Upload Unstructured Files
        </div>

		<div id="csvUpload"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            paddingTop: "5px",
            paddingBottom: "5px",
			display: "none"

          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("csvUpload")}
        >
          Upload Structured File
        </div>

		  <div id="displayUnstructured"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("displayUnstructured")}
        >
          Display Upload Result
        </div>

        <div id="displayContent"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px",
			display: "none"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("displayContent")}
        >
          Display Data
        </div>

        <div id="preProcessingUnstructured"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("preProcessingUnstructured")}
        >
          Preprocessing Unstructured Data
        </div>

		<div id="preProcessing"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px",
			display: "none"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("preProcessing")}
        >
          Preprocessing Structured Data
        </div>


        <div id="visualization"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px",
			display: "none"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("visualization")}
        >
          Data Visualization
        </div>

        <div id="transformation"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px",
			display: "none"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("transformation")}
        >
          Data Tranformation
        </div>

		<div id="miningUnstructured"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("miningUnstructured")}
        >
          Data Modelling - Unstructured
        </div>

        <div id="mining"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px",
			display: "none"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("mining")}
        >
          Data Modelling - Structured
        </div>

		 <div id="workflow"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px",
			display: "none"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("workflow")}
        >
          Create Workflow Unstructured
        </div>

		<div id="workflow3"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px",
			display: "none"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("workflow3")}
        >
          Create Workflow Structured
        </div>

        <div id="codebox"
          style={{
            backgroundColor: "#3b5998",
            width: "100%",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
          onClick={e => this.changeButtonColorAndChangeDisplay("codebox")}
        >
          Your Code Box
        </div>

		<div id="logout" style={{margin: "30px", display: "none"}}>
		  <Button onClick={() => this.logout()}>
					  Logout
		</Button>
		</div>

      </div>
    );
  }
}

export default Items;
