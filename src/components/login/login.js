import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import { baseUrl } from "../../shared/baseUrl";
import ls from "local-storage";

class Login extends Component {
	state = {
		username: "",
		password: ""
	};

	// function to login to the app
	login = (username, password) => {
		console.log("username", username);
		if (username=="") {
			alert("Please enter username!")
		} else if (password == "") {
			alert("Please enter password!")
		} else {
			const url = `${baseUrl}/login`;
			const data = new FormData();
			data.append("username", username);
			data.append("password", password);
			fetch(url, {
			  method: "POST",
			  body: data
			})
		  .then(response => response.json())
		  .then(data => {
			if (data.message=="wrong username") {
				alert("Username does not exist!")
			} else if (data.message=="wrong password") {
				alert("Wrong password!")
			} else {
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
			<h3><u>Sign-in</u></h3>
			<br/>
			<p>Username</p>
			<p>
			<input
            type="text"
            value={this.state.username}
            onChange={e => this.setState({ username: e.target.value })}
          />
		  </p>
			<p>Password</p>
			<p>
			<input
            type="password"
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
          />
		  </p>

		  		  <br/>

		  <Button onClick={() => this.login(this.state.username, this.state.password)}>
					  Login
		</Button>
		</div>
		</div>
		</React.Fragment>
    );
  }
}

export default Login;
