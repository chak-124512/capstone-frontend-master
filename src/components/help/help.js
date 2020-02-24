import React, { Component } from "react";

class Help extends Component {
  linearRegressionInfo = () => {
  alert("In statistics, linear regression is a linear approach to modeling the relationship between a scalar response (or dependent variable) and one or more explanatory variables (or independent variables). The case of one explanatory variable is called simple linear regression. For more than one explanatory variable, the process is called multiple linear regression. This term is distinct from multivariate linear regression, where multiple correlated dependent variables are predicted, rather than a single scalar variable.");
	};
	 logisticRegressionInfo = () => {
  alert("In statistics, the logistic model (or logit model) is used to model the probability of a certain class or event existing such as pass/fail, win/lose, alive/dead or healthy/sick. This can be extended to model several classes of events such as determining whether an image contains a cat, dog, lion, etc. Each object being detected in the image would be assigned a probability between 0 and 1 and the sum adding to one.");
  }
	render () {
		return(<React.Fragment>
		<div>
		  <input type="text" placeholder="Search.."/>
		  </div>
		  <div>
		<img src="linear-regression.png" alt="Linear Regression" onClick={() => this.linearRegressionInfo()}/>
		<img src="logistic_regression.jpeg" alt="Logistic Regression" onClick={() => this.logisticRegressionInfo()}/>
		</div>

</React.Fragment>);
	}
}

export default Help;