import React, { Component } from "react";
import renderIf from "render-if";
import Upload from "./upload";
import Upload2 from "./upload2";
import Display from "./display";
import PreProcessing from "./display/PreProcessing";
import PreProcessing2 from "./display/PreProcessing2";
import Visualization from "./visualization";
import Tranformation from "./tranformation";
import Mining from "./mining";
import Mining2 from "./mining2";
import Workflow from "./workflow";
import Workflow2 from "./workflow2";
import Workflow3 from "./workflow3";
import Workflow4 from "./workflow4";
import CodeBox from "./codebox";
import Help from "./help";


class Content extends Component {
  state = {
    uploadRef: null,
		uNodeDataArray: [],
		uLinkDataArray: [],
		uNodeKey: 0,
		uLinkKey: 0,
		uY: 0,
		sNodeDataArray: [],
		sLinkDataArray: [],
		sNodeKey: 0,
		sLinkKey: 0,
		sY: 0
  };
  triggerDataUpdate = () => {
    const data = {
      file: {}
    };

    const { uploadRef: ref } = this.state;
    ref.getFileFromToken();
  };

  // update the state variables here that have been updated in unstructured worflow related child components
  updateUnstructuredWorkflowData = (newNodeDataArray, newLinkDataArray, newNodeKey, newLinkKey, newY) => {
	this.setState({ uNodeDataArray: newNodeDataArray });
	this.setState({ uLinkDataArray: newLinkDataArray });
	this.setState({ uNodeKey: newNodeKey });
	this.setState({ uLinkKey: newLinkKey });
	this.setState({ uY: newY });
  };

  // update the state variables here that have been updated in structured worflow related child components
  updateStructuredWorkflowData = (newNodeDataArray, newLinkDataArray, newNodeKey, newLinkKey, newY) => {
	this.setState({ sNodeDataArray: newNodeDataArray });
	this.setState({ sLinkDataArray: newLinkDataArray });
	this.setState({ sNodeKey: newNodeKey });
	this.setState({ sLinkKey: newLinkKey });
	this.setState({ sY: newY });
  };

  render() {
    const { display } = this.props;
    console.log("dis", display);
    const renderCsvUpload = renderIf(display === "csvUpload");
	const renderUploadUnstructured = renderIf(display === "uploadUnstructured");
    const renderDisplay = renderIf(display === "displayContent");
    const renderPreProcessing = renderIf(display === "preProcessing");
	const renderPreProcessingUnstructured = renderIf(display === "preProcessingUnstructured");
    const renderVisualization = renderIf(display === "visualization");
    const renderTranformation = renderIf(display === "transformation");
    const renderMining = renderIf(display === "mining");
	const renderMiningUnstructured = renderIf(display === "miningUnstructured");
	const renderWorkflow = renderIf(display === "workflow");
	const renderWorkflow2 = renderIf(display === "workflow2");
	const renderWorkflow3 = renderIf(display === "workflow3");
	const renderWorkflow4 = renderIf(display === "workflow4");
    const renderCodeBox = renderIf(display === "codebox");
	const renderHelp = renderIf(display === "help");

    return (
      <React.Fragment>
        {renderCsvUpload(
          <Upload
            changeDisplay={this.props.changeDisplay}
            updateStateRef={e => this.setState({ uploadRef: e })}
          />
        )}
		{renderUploadUnstructured(
          <Upload2
            changeDisplay={this.props.changeDisplay}
			updateStateRef={e => this.setState({ uploadRef: e })}
          />
        )}
        {renderDisplay(
          <Display
            ref={e => (this.displayRef = e)}
            updateData={() => this.triggerDataUpdate()}
          />
        )}
        {renderPreProcessing(<PreProcessing />)}
		{renderPreProcessingUnstructured(<PreProcessing2 />)}
        {renderVisualization(<Visualization />)}
        {renderTranformation(<Tranformation />)}
        {renderMining(<Mining/>)}
		{renderMiningUnstructured(<Mining2 />)}
		{renderWorkflow(
		<Workflow
			changeDisplayToWorkflow={this.props.changeDisplayToWorkflow}
			changeDisplayToWorkflow2={this.props.changeDisplayToWorkflow2}
			nodeDataArray={this.state.uNodeDataArray}
			linkDataArray={this.state.uLinkDataArray}
			nodeKey={this.state.uNodeKey}
			linkKey={this.state.uLinkKey}
			y={this.state.uY}
			onWorkflowDataChange={this.updateUnstructuredWorkflowData}
		/>)}
		{renderWorkflow2(
		<Workflow2
			changeDisplayToWorkflow={this.props.changeDisplayToWorkflow}
			changeDisplayToWorkflow2={this.props.changeDisplayToWorkflow2}
			nodeDataArray={this.state.uNodeDataArray}
			linkDataArray={this.state.uLinkDataArray}
			nodeKey={this.state.uNodeKey}
			linkKey={this.state.uLinkKey}
			y={this.state.uY}
			onWorkflowDataChange={this.updateUnstructuredWorkflowData}
		/>)}
		{renderWorkflow3(
		<Workflow3
			changeDisplayToWorkflow3={this.props.changeDisplayToWorkflow3}
			changeDisplayToWorkflow4={this.props.changeDisplayToWorkflow4}
			nodeDataArray={this.state.sNodeDataArray}
			linkDataArray={this.state.sLinkDataArray}
			nodeKey={this.state.sNodeKey}
			linkKey={this.state.sLinkKey}
			y={this.state.sY}
			onWorkflowDataChange={this.updateStructuredWorkflowData}
		/>)}
		{renderWorkflow4(
		<Workflow4
			changeDisplayToWorkflow3={this.props.changeDisplayToWorkflow3}
			changeDisplayToWorkflow4={this.props.changeDisplayToWorkflow4}
			nodeDataArray={this.state.sNodeDataArray}
			linkDataArray={this.state.sLinkDataArray}
			nodeKey={this.state.sNodeKey}
			linkKey={this.state.sLinkKey}
			y={this.state.sY}
			onWorkflowDataChange={this.updateStructuredWorkflowData}
		/>)}
        {renderCodeBox(<CodeBox />)}
		{renderHelp(<Help />)}
      </React.Fragment>
    );
  }
}

export default Content;