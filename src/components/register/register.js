import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import { baseUrl } from "../../shared/baseUrl";
import ls from "local-storage";

class Register extends Component {
	state = {
		username: "",
		password: "",
		password2: ""
	};

	// function to login to the app
	register = (username, password, password2) => {
		console.log("username", username);
		if (username=="") {
			alert("Please enter username!")
		} else if (password == "") {
			alert("Please enter password!")
		} else if (password2 == "") {
			alert("Please re-enter password!")
		} else if (password != password2) {
			alert("Passwords don't match!")
		} else {
			const url = `${baseUrl}/register`;
			const data = new FormData();
			data.append("username", username);
			data.append("password", password);
			data.append("password2", password2);
			fetch(url, {
			  method: "POST",
			  body: data
			})
		  .then(response => response.json())
		  .then(data => {
			if (data.message=="duplicate") {
				alert("Username already exists. Try another one.");
			} else if (data.message=="success") {
				alert("Registration and login successful.");
				ls.set("username", username);
				window.location.reload(false);

			}
		  });
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
		<div class="box2">
			<h3><u>Register</u></h3>
			<br/>
			<p>Enter Username</p>
			<p>
			<input
            type="text"
            value={this.state.username}
            onChange={e => this.setState({ username: e.target.value })}
			  />
			  </p>

			<p>Enter Password</p>
			<p>
			<input
            type="password"
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
          />
		  </p>

		  <p>Re-enter Password</p>
			<p>
			<input
            type="password"
            value={this.state.password2}
            onChange={e => this.setState({ password2: e.target.value })}
          />
		  </p>

		  <br/>

		  <Button onClick={() => this.register(this.state.username, this.state.password, this.state.password2)}>
					  Register
		</Button>

		</div>
		
		</div>
		</React.Fragment>
    );
  }
}

export default Register;
