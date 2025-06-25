import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { intl } from '../../components/App';
import { MediaHeader, MediaLabel } from '../../components/App.styles';
import { ListWrapper } from '../../components/client-group.styles';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import TestPopOver from './TestPopOver';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {
    // getPredefinedData,
    updateStore
} from '../../actions';
import { connect } from 'react-redux';
//const ResultEntryInstrumentForm = (this.props) => {
class ResultEntryTaskForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            selectedRecordTaskForm: this.props.selectedRecordTaskForm 
        }

    } 
       componentDidUpdate(previousProps ) { 
        if(this.props.selectedRecordTaskForm!==previousProps.selectedRecordTaskForm ){ 
            this.setState({ selectedRecordTaskForm:this.props.selectedRecordTaskForm });
        } 
    }
    componentWillUnmount() { 
          const updateInfo = {
              typeName: DEFAULT_RETURN, 
              data: { isTaskInitialRender: false  } 
          }
          this.props.updateStore(updateInfo);
      }
    onInputChange = (Data, name) => {
        const selectedRecordTaskForm = this.state.selectedRecordTaskForm || [];
        selectedRecordTaskForm[name] = Data.target.value;
        //Sync child Data with parent Component
        this.props.onInputChange(Data, name)
        this.setState({ selectedRecordTaskForm });
    }
    onNumericChange = (numericData, numericName) => {
        const selectedRecordTaskForm = this.state.selectedRecordTaskForm || [];
        if (numericData) {
            if (numericName !== "scomments") {
                selectedRecordTaskForm[numericName] = numericData;
            } else {
                selectedRecordTaskForm[numericName] = numericData.target.value;
            }
        }
        else {
            selectedRecordTaskForm[numericName] = "";
        }
        //Sync child Data with parent Component
        this.props.onNumericChange(numericData, numericName)

        this.setState({ selectedRecordTaskForm });
    }
    render() {
        let stestsynonyms =this.state.selectedRecordTaskForm.stestsynonym ? this.state.selectedRecordTaskForm.stestsynonym.split(",") : []
      //   this.props.selectedRecord.stestsynonym ? this.props.selectedRecord.stestsynonym.split(",") : []

        let message = `${stestsynonyms.length} ${this.props.intl.formatMessage({ id: "IDS_TESTS" })} ${this.props.intl.formatMessage({ id: "IDS_SELECTED" })}`

        return (
            <>

                {Object.values(this.state.selectedRecordTaskForm).length > 0 ?
                    <div>
                        <Row className="mb-4">
                            <Col md={12}>
                                <MediaHeader className={`labelfont`}>
                                    {stestsynonyms.length === 1 ?
                                        `${this.props.intl.formatMessage({ id: "IDS_TEST" })}: ${stestsynonyms[0]}` :
                                        // <span 
                                        //     onMouseOver={event => tooltip && tooltip.handleMouseOver(event)}
                                        //     onMouseOut={event => tooltip && tooltip.handleMouseOut(event)} //title={()=>tittleContent(stestsynonyms)}
                                        //     title={stestsynonyms}>
                                        //     {stestsynonyms.length}{" "}
                                        //     {this.props.intl.formatMessage({id:"IDS_TESTS"})}{" "}
                                        //     {this.props.intl.formatMessage({id:"IDS_SELECTED"})}
                                        // </span>
                                        <TestPopOver stringList={stestsynonyms} message={message}></TestPopOver>

                                    }
                                </MediaHeader>
                            </Col>
                        </Row>
                    </div>
                    : ""}

                <Row>

                    <Col md={8}>
                        <FormNumericInput
                            name="numeric"
                            type="number"
                            // placeholder={intl.formatMessage({ id: "IDS_PREANALYSISTIME" })}
                            isMandatory={false}
                            label={this.props.intl.formatMessage({ id: "IDS_PREANALYSISTIME" })}
                            value={Object.values(this.state.selectedRecordTaskForm).length > 0 ? this.state.selectedRecordTaskForm.spreanalysistime : ""}
                            strict={true}
                            maxLength={6}
                            noStyle={true}
                            required={true}
                            className="form-control"
                            onChange={(event) => this.onNumericChange(event, "spreanalysistime")}
                        />
                    </Col>
                    <Col md={2}>
                        {/* {this.this.props.selectedResultGrade.length > 0 ? */}
                        <ListWrapper><MediaLabel className="labelfont" >
                            {this.props.intl.formatMessage({ id: "IDS_MINUTES" })}</MediaLabel></ListWrapper>
                        {/* : ""} */}
                    </Col>

                    <Col md={8}>
                        <FormNumericInput
                            name="numeric"
                            type="number"
                            isMandatory={false}
                            // placeholder={intl.formatMessage({ id: "IDS_PREPARATIONTIME" })}
                            label={this.props.intl.formatMessage({ id: "IDS_PREPARATIONTIME" })}
                            value={Object.values(this.state.selectedRecordTaskForm).length > 0 ? this.state.selectedRecordTaskForm.spreparationtime : ""}
                            strict={true}
                            maxLength={6}
                            noStyle={true}
                            className="form-control"
                            onChange={(event) => this.onNumericChange(event, "spreparationtime")}
                        />
                    </Col>
                    <Col md={2}>
                        {/* {this.this.props.selectedResultGrade.length > 0 ? */}
                        <ListWrapper><MediaLabel className="labelfont" >
                            {this.props.intl.formatMessage({ id: "IDS_MINUTES" })}</MediaLabel></ListWrapper>
                        {/* : ""} */}
                    </Col>

                    <Col md={8}>
                        <FormNumericInput
                            name="numeric"
                            type="number"
                            isMandatory={false}
                            // placeholder={intl.formatMessage({ id: "IDS_ANALYSISTIME" })}
                            label={this.props.intl.formatMessage({ id: "IDS_ANALYSISTIME" })}
                            value={Object.values(this.state.selectedRecordTaskForm).length > 0 ? this.state.selectedRecordTaskForm.sanalysistime : ""}
                            strict={true}
                            maxLength={6}
                            noStyle={true}
                            className="form-control"
                            onChange={(event) => this.onNumericChange(event, "sanalysistime")}
                        />
                    </Col>
                    <Col md={2}>
                        {/* {this.this.props.selectedResultGrade.length > 0 ? */}
                        <ListWrapper><MediaLabel className="labelfont" >
                            {this.props.intl.formatMessage({ id: "IDS_MINUTES" })}</MediaLabel></ListWrapper>
                        {/* : ""} */}
                    </Col>
                    <Col md={8}>
                        <FormNumericInput
                            name="numeric"
                            type="number"
                            isMandatory={false}
                            // placeholder={intl.formatMessage({ id: "IDS_MISCTIME" })}
                            label={this.props.intl.formatMessage({ id: "IDS_MISCTIME" })}
                            value={Object.values(this.state.selectedRecordTaskForm).length > 0 ? this.state.selectedRecordTaskForm.smisctime : ""}
                            strict={true}
                            maxLength={6}
                            noStyle={true}
                            className="form-control"
                            onChange={(event) => this.onNumericChange(event, "smisctime")}
                        />
                    </Col>
                    <Col md={2}>
                        {/* {this.this.props.selectedResultGrade.length > 0 ? */}
                        <ListWrapper><MediaLabel className="labelfont" >
                            {this.props.intl.formatMessage({ id: "IDS_MINUTES" })}</MediaLabel></ListWrapper>
                        {/* : ""} */}
                    </Col>
                    <Col md={8}>
                        <FormTextarea
                            name={"Task Procedure"}
                            placeholder={intl.formatMessage({ id: "IDS_TASKPROCEDURE" })}
                            label={intl.formatMessage({ id: "IDS_TASKPROCEDURE" })}
                            type="text"
                            // defaultValue={Object.values(this.state.selectedRecordTaskForm).length > 0 &&
                            //     this.state.selectedRecordTaskForm!==undefined ? this.state.selectedRecordTaskForm.staskprocedure : ""}
                                value={Object.values(this.state.selectedRecordTaskForm).length > 0 &&
                                    this.state.selectedRecordTaskForm.staskprocedure!==undefined ? this.state.selectedRecordTaskForm.staskprocedure : ""}
                                isMandatory={false} 
                            required={false}
                            maxLength={1000}
                            onChange={(event) => this.onInputChange(event, "staskprocedure")}
                        />
                    </Col>
                    <Col md={8}>
                        <FormTextarea
                            name={"Result"}
                            placeholder={intl.formatMessage({ id: "IDS_COMMENTS" })}
                            label={intl.formatMessage({ id: "IDS_COMMENTS" })}
                            type="text"
                            // defaultValue={Object.values(this.state.selectedRecordTaskForm).length > 0 &&
                            //     this.state.selectedRecordTaskForm!==undefined ? this.state.selectedRecordTaskForm.scomments : ""}
                                value={Object.values(this.state.selectedRecordTaskForm).length > 0 &&
                                    this.state.selectedRecordTaskForm.scomments!==undefined ? this.state.selectedRecordTaskForm.scomments : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={100}
                            onChange={(event) => this.onInputChange(event, "scomments")}
                        />
                    </Col>

                </Row>
            </>
        )
    }
}
// export default injectIntl(ResultEntryTaskForm);

export default connect(null, {
    updateStore 

})(injectIntl(ResultEntryTaskForm));
