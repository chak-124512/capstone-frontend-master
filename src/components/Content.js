import React, { Component } from "react";
import renderIf from "render-if";
import Upload from "./upload";
import Upload2 from "./upload2";
import Display from "./display";
import PreProcessing from "./display/PreProcessing";
import Visualization from "./visualization";
import Tranformation from "./tranformation";
import Mining from "./mining";
import Workflow from "./workflow";
import CodeBox from "./codebox";
import Help from "./help";


class Content extends Component {
  state = {
    uploadRef: null
  };
  triggerDataUpdate = () => {
    const data = {
      file: {}
    };

    const { uploadRef: ref } = this.state;
    ref.getFileFromToken();
  };

  render() {
    const { display } = this.props;
    console.log("dis", display);
    const renderCsvUpload = renderIf(display === "csvUpload");
	const renderUploadUnstructured = renderIf(display === "uploadUnstructured");
    const renderDisplay = renderIf(display === "displayContent");
    const renderPreProcessing = renderIf(display === "preProcessing");
    const renderVisualization = renderIf(display === "visualization");
    const renderTranformation = renderIf(display === "transformation");
    const renderMining = renderIf(display === "mining");
	const renderWorkflow = renderIf(display === "workflow");
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
          />
        )}
        {renderDisplay(
          <Display
            ref={e => (this.displayRef = e)}
            updateData={() => this.triggerDataUpdate()}
          />
        )}
        {renderPreProcessing(<PreProcessing />)}
        {renderVisualization(<Visualization />)}
        {renderTranformation(<Tranformation />)}
        {renderMining(<Mining />)}
		{renderWorkflow(<Workflow />)}
        {renderCodeBox(<CodeBox />)}
		{renderHelp(<Help />)}
      </React.Fragment>
    );
  }
}

export default Content;
