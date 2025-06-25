import React from 'react'
import { Row, Col, Nav, Button, Modal, Card } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { ListWrapper } from '../../components/client-group.styles';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import DropZone from '../../components/dropzone/dropzone.component';
import '../../components/list-master/list-master.styles';
import { attachmentType, parameterType, transactionStatus } from '../../components/Enumeration';
import './result.css';
import '../../assets/styles/tree.css';
import { MediaHeader, MediaLabel, MediaSubHeader } from '../../components/App.styles';
import FormInput from '../../components/form-input/form-input.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faEye, faInfo, faInfoCircle, faSave } from '@fortawesome/free-solid-svg-icons';
import TestPopOver from './TestPopOver';
import { numberConversion, numericGrade } from './ResultEntryValidation';
import { constructOptionList, deleteAttachmentDropZone, rearrangeDateFormat } from '../../components/CommonScript';
import { connect } from 'react-redux';
import ResultEntryPredefinedComments from './ResultEntryPredefinedComments';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import ModalShow from '../../components/ModalShow';
import DataGrid from '../../components/data-grid/data-grid.component';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import {
    // getPredefinedData,
    updateStore
} from '../../actions';
import rsapi from '../../rsapi';
import Preloader from '../../components/preloader/preloader.component';

import { withRouter } from 'react-router-dom';
import { initRequest } from '../../actions/LoginAction';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { intl } from '../../components/App';
// const mapStatetoProps = (state) => {
//     return {
//         Login: state.Login
//     }
// }
// const mapDispatchToProps = dispatch => ({ 
//     dispatch                // ← Add this
//  })
class ResultEntryParameterForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            parameterResults: [...this.props.ResultParameter],
            selectedResultGrade: this.props.selectedResultGrade//,
            ,controlMap: [...this.props.controlMap],
            userRoleControlRights: [...this.props.userRoleControlRights]
            //loading:false
        }


    }


    // componentDidUpdate(previousProps) {
    //     let bool = false;
    //     let { currentAlertResultCode, currentntestgrouptestpredefcode,selectedRecord,showAlert } = this.state
    //     if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
    //         bool = true;
    //         selectedRecord = this.props.Login.selectedRecord;
    //     }
    //     if (this.props.Login.showAlert !== previousProps.Login.showAlert) {
    //         bool = true;
    //         showAlert = this.props.Login.showAlert;
    //     }

    //     if (this.props.Login.currentAlertResultCode !== previousProps.Login.currentAlertResultCode) {
    //         bool = true;
    //         currentAlertResultCode = this.props.Login.currentAlertResultCode;
    //     }
    //     if (this.props.Login.currentntestgrouptestpredefcode !== previousProps.Login.currentntestgrouptestpredefcode) {
    //         bool = true;
    //         currentntestgrouptestpredefcode = this.props.Login.currentntestgrouptestpredefcode;
    //     }
    //     if (bool) {
    //         this.setState({ currentntestgrouptestpredefcode, currentAlertResultCode,selectedRecord,showAlert })
    //     }
    // }
    //For Subcode Result Start
    onComboChange = (comboData, comboName) => {
        const selectedRecord = this.state.selectedRecord || [];
        let currentAlertResultCode = this.state.currentAlertResultCode || 0;
        if (comboData) {
            selectedRecord[comboName] = comboData;
        } else {
            selectedRecord[comboName] = []
        }
        this.setState({ selectedRecord });
    }
    onInputChange = (Data, name) => {
        const selectedRecord = this.state.selectedRecord || [];
        let currentAlertResultCode = this.state.currentAlertResultCode || 0;
        if (Data) {
            selectedRecord[name] = Data.target.value;
        }
        else {
            selectedRecord[name] = [];
        }
        this.setState({ selectedRecord });
    }
    closeModalShow = () => {
        let showAlertGrid = this.props.Login.showAlertGrid;
        let selectedRecord = this.props.Login.selectedRecord;
        selectedRecord['ntestgrouptestpredefsubcode'] && delete selectedRecord['ntestgrouptestpredefsubcode']
        showAlertGrid = false;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showAlertGrid, selectedRecord }
        }
        this.props.updateStore(updateInfo);
    }
    onModalSave = () => {
        const selectedRecord = this.state.selectedRecord || [];
        let currentAlertResultCode = this.state.currentAlertResultCode || 0;
        let parameterResults = this.state.parameterResults
        let currentntestgrouptestpredefcode = this.state.currentntestgrouptestpredefcode || 0;
        let bool = parameterResults.some(x => x['ntransactionresultcode'] === currentAlertResultCode)
        if (bool) {
            parameterResults.map(Parameter => {
                if (Parameter['ntransactionresultcode'] === currentAlertResultCode) {
                    Parameter['additionalInfoUidata'] = { ntestgrouptestpredefsubcode: selectedRecord['ntestgrouptestpredefsubcode'] }
                    if (selectedRecord['ntestgrouptestpredefsubcode']) {
                        if (typeof selectedRecord['ntestgrouptestpredefsubcode'] === 'string') {
                            Parameter['additionalInfo'] = selectedRecord['ntestgrouptestpredefsubcode']
                        } else {
                            Parameter['additionalInfo'] = ""
                            Parameter['additionalInfo'] = selectedRecord['ntestgrouptestpredefsubcode'].map(x => x.label + ",").join('\n')
                            Parameter['additionalInfo'] = Parameter['additionalInfo'].substring(0,
                                Parameter['additionalInfo'].length - 1)
                        }
                    } else {
                        Parameter['additionalInfo'] = ""
                        Parameter['additionalInfoUidata'] && delete Parameter['additionalInfoUidata']
                    }
                    Parameter['ntestgrouptestpredefcode'] = currentntestgrouptestpredefcode
                }
            }
            );
        }
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: { parameterResults:parameterResults,selectedRecord: selectedRecord, showAlert: false }
        // }
        // this.props.updateStore(updateInfo);

        //Sync With Parent Component
        this.props.onResultInputChange(parameterResults);
        this.setState({ parameterResults: parameterResults, selectedRecord: selectedRecord, showAlert: false })
    }

    //For Subcode Result End


    onGradeEvent = (ResultParameter, index, parameter) => {
        if (ResultParameter.length > 0 && ResultParameter[index] !== undefined && ResultParameter[index].sresult !== null) {
            let selectedRecord = this.state.selectedRecord || [];
            let selectedResultGrade = this.state.selectedResultGrade || [];
            if (parameter.nparametertypecode === parameterType.NUMERIC) {
                selectedResultGrade[index] = {
                    ngradecode: ResultParameter[index].sresult !== "" ?
                        numericGrade(parameter, numberConversion(parseFloat(ResultParameter[index].sresult), parseInt(parameter.nroundingdigits))) : -1
                };
            }
            if (parameter.nparametertypecode === parameterType.PREDEFINED) {
                if (ResultParameter[index].sresult !== null) {
                    selectedResultGrade[index] = { ngradecode: ResultParameter[index].ngradecode };
                }
                else {
                    selectedResultGrade[index] = { ngradecode: 0 };
                }
            }
            if (parameter.nparametertypecode === parameterType.CHARACTER) {
                if (ResultParameter[index].sresult !== null && ResultParameter[index].sresult.trim() !== "") {
                    //selectedResultGrade[index] = { ngradecode: ResultParameter[index].ngradecode };
                    selectedResultGrade[index] = { ngradecode: 4 };
                }
                else {
                    selectedResultGrade[index] = { ngradecode: -1 };
                }
            }
            selectedRecord.selectedResultGrade = selectedResultGrade;
            //    if (ResultParameter.length > 0 && ResultParameter[index] !== undefined && ResultParameter[index].ngradecode !== selectedResultGrade[index].ngradecode) {

            this.setState({
                selectedRecord
            });
            // }
        }
    }
    deleteAttachmentParameterFile = (event, file, fieldName, index) => {
        let ResultParameter = this.state.parameterResults[index];
        let parameterResults = this.state.parameterResults;
        ResultParameter[fieldName] = deleteAttachmentDropZone(ResultParameter[fieldName],
            file)
        parameterResults[index]['editable'] = true;
        this.setState({
            parameterResults: parameterResults
        });

    }
    onResultInputChange = (event, index, parameter) => {
        let selectedRecord = this.state.selectedRecord || [];
        let ResultParameter = this.state.parameterResults ? [...this.state.parameterResults] : [];
        let sresult = "";
        let sfinal = "";
        let sresultpredefinedname = "";
        let salertmessage = "";
        let sresultcomment = "";
        let value = -1;
        let acceptedFile = [];
        let ncalculatedresult;
        let currentAlertResultCode = 0;
        let currentntestgrouptestpredefcode = 0;
        let inputData = {}
        //  if ((event[0] && event[0].name!==ResultParameter[index]['sresult']) || (event.target && event.target.value !== ResultParameter[index]['sresult']) ||
        //     (event.item && event.item.ntransactionresultcode ===
        //        ResultParameter[index].ntransactionresultcode && ResultParameter[index]['sresult'] !== event.item && event.item.spredefinedname)) {
        if (parameter.nparametertypecode === parameterType.NUMERIC) {
            if (/^-?\d*?\.?\d*?$/.test(event.target.value) || event.target.value === "") {
                sresult = event.target.value;
                ncalculatedresult = 4
            } else {
                sresult = ResultParameter[index]['sresult'] === null ? "" : ResultParameter[index]['sresult'];
                ncalculatedresult = ResultParameter[index]['ncalculatedresult'];
            }
        }
        if (parameter.nparametertypecode === parameterType.PREDEFINED) {
            currentAlertResultCode = event.item.ntransactionresultcode;
            currentntestgrouptestpredefcode = event.item.ntestgrouptestpredefcode;
            if (event != null) {
                sresult = event.item.spredefinedname;
                sresultpredefinedname = event.item.sresultpredefinedname;
                sfinal = event.item.spredefinedsynonym
                value = event.item.ngradecode;
                salertmessage = event.item.salertmessage ? event.item.salertmessage : "";
                sresultcomment = event.item.spredefinedcomments ? event.item.spredefinedcomments : "";
                ncalculatedresult = 4;
            }
            else {
                sresult = "";
                sfinal = "";
                sresultpredefinedname = "";
                value = -1;
                ncalculatedresult = 4
            }
            inputData = {
                'ntestgrouptestpredefcode': event.item.ntestgrouptestpredefcode,
                'salertmessage': salertmessage,
                'nneedresultentryalert': event.item.nneedresultentryalert,
                'nneedsubcodedresult': event.item.nneedsubcodedresult
            }
            if (event.item.nneedresultentryalert === transactionStatus.NO &&
                event.item.nneedsubcodedresult === transactionStatus.NO) {
                if (ResultParameter[index]['additionalInfo']) {
                    ResultParameter[index]['additionalInfo'] = ""
                }
                if (ResultParameter[index]['additionalInfoUidata']) {
                    ResultParameter[index]['additionalInfoUidata'] = ""
                }
            }

        }
        if (parameter.nparametertypecode === parameterType.CHARACTER) {
            sresult = event.target.value;
            if (event.target.value.trim() === "")
                ncalculatedresult = -1;
            else
                ncalculatedresult = 4;
        }
        if (parameter.nparametertypecode === parameterType.ATTACHMENT) {
            sresult = event[0] && event[0].name;
            sfinal = event;
            ncalculatedresult = 4
        }
        ResultParameter[index]['sresult'] = sresult
        ResultParameter[index]['sfinal'] = sfinal
        ResultParameter[index]['sresultpredefinedname'] = sresultpredefinedname
        ResultParameter[index]['sresultcomment'] = sresultcomment
        ResultParameter[index]['salertmessage'] = salertmessage
        ResultParameter[index]['acceptedFile'] = acceptedFile
        ResultParameter[index]['editable'] = true
        ResultParameter[index]['ngradecode'] = value
        ResultParameter[index]['ncalculatedresult'] = ncalculatedresult
        ResultParameter[index]['dummty'] = 'dummty'
        selectedRecord.ResultParameter = ResultParameter
        let parameterResults = ResultParameter
        if (parameter.nparametertypecode === parameterType.PREDEFINED && (event.item.nneedresultentryalert === transactionStatus.YES ||
            event.item.nneedsubcodedresult === transactionStatus.YES)
        ) {
            // this.props.
            this.getPredefinedData(inputData, selectedRecord, currentAlertResultCode, this.props.Login.masterData, currentntestgrouptestpredefcode)
        } else {
            if (selectedRecord["ntestgrouptestpredefsubcode"]) {
                delete selectedRecord["ntestgrouptestpredefsubcode"]
            }
        }
        //Sync child Data With Parent Component
        this.props.onResultInputChange(parameterResults);
        this.setState({
            parameterResults: parameterResults,
            currentAlertResultCode,
            currentntestgrouptestpredefcode,
            selectedRecord
        });
        //}
    }

    onInputOnChange = (event, optional) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === "checkbox") {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        } else if (event.target.type === 'radio') {
            selectedRecord[event.target.name] = optional;
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    };

    getPredefinedData(inputData, selectedRecord, currentAlertResultCode, masterData, currentntestgrouptestpredefcode) {
        //  return function (dispatch) {
        //   this.setState({loading:true})
        let inputParamData = {
            ntestgrouptestpredefcode: inputData.ntestgrouptestpredefcode,
        }
        //dispatch(initRequest(true));
        rsapi.post("resultentrybysample/getPredefinedData", inputParamData)
            .then(response => {
                let showMultiSelectCombo = false;
                let ResultParameter = selectedRecord['ResultParameter']
                let onlyAlertMsgAvailable = false;
                let testgrouptestpredefsubresult = response.data['testgrouptestpredefsubresult']
                if (inputData['nneedsubcodedresult'] === transactionStatus.YES) {
                    showMultiSelectCombo = true
                    masterData['testgrouptestpredefsubresultOptions'] = testgrouptestpredefsubresult
                }
                else {
                    onlyAlertMsgAvailable = true;
                }
                for (const Parameter of ResultParameter) {
                    if (Parameter.additionalInfoUidata || Parameter.additionalInfoUidata === "") {
                        let additionalInfoUidata = typeof Parameter.additionalInfoUidata === 'string' ? Parameter.additionalInfoUidata === "" ? "" : JSON.parse(Parameter.additionalInfoUidata) :
                            Parameter.additionalInfoUidata
                        if (Parameter['ntransactionresultcode'] === currentAlertResultCode &&
                            Parameter['ntestgrouptestpredefcode'] === inputData['ntestgrouptestpredefcode']) {
                            if (Parameter.additionalInfoUidata) {
                                selectedRecord["ntestgrouptestpredefsubcode"] = additionalInfoUidata['ntestgrouptestpredefsubcode']
                                break;
                            }
                        } else {
                            if (selectedRecord["ntestgrouptestpredefsubcode"]) {
                                delete selectedRecord["ntestgrouptestpredefsubcode"]
                            }
                        }
                    }

                };
                masterData['salertmessage'] = inputData.salertmessage

                this.setState({
                    masterData,
                    showAlert: inputData.nneedresultentryalert === transactionStatus.NO ? false : true,
                    showAlertForPredefined: true,
                    showMultiSelectCombo,
                    onlyAlertMsgAvailable,
                    additionalInfoView: false,
                    selectedRecord,
                    currentAlertResultCode,
                    currentntestgrouptestpredefcode//,
                    //  loading:false
                });

                // dispatch({
                //     type: DEFAULT_RETURN,
                //     payload: { 
                //         loading: false,
                //        masterData, 
                //         showAlert: inputData.nneedresultentryalert===transactionStatus.NO?false:true,
                //          showAlertForPredefined: true,
                //          showMultiSelectCombo,
                //          onlyAlertMsgAvailable,
                //          additionalInfoView:false,
                //          selectedRecord,
                //          currentAlertResultCode,
                //          currentntestgrouptestpredefcode
                //     }
                // })
            })
        // .catch(error => {
        //     dispatch({
        //         type: DEFAULT_RETURN,
        //         payload: {
        //             loading: false
        //         }
        //     })
        //     if (error.response.status === 500) {
        //         toast.error(error.message);
        //     } else {
        //         toast.warn(error.response.data);
        //     }
        // })
        //    }

    }

    // componentDidUpdate(previousProps, prevState, snapshot) {
    //     let parameterResults=[];
    //     if(this.state.parameterResults!==prevState.parameterResults){
    //        // parameterResults=this.props.parameterResults;
    //         //this.setState({parameterResults})
    //         this.props.dispatch({ type: DEFAULT_RETURN });
    //     } 
    // }

    renderSwitch = (parameter, index, result, screenName) => {
        const selectedResultGrade = this.state.selectedResultGrade;//this.props.selectedResultGrade;
        const gradeValues = this.props.gradeValues;
        const gradeCode = selectedResultGrade ? selectedResultGrade.length > 0 ?
            selectedResultGrade[index] ? selectedResultGrade[index]['ngradecode'] : undefined : "" : "";
        let isAdditionalInfoRequired = this.state.parameterResults[index].hasOwnProperty('additionalInfo') &&
            this.state.parameterResults[index]['additionalInfo'] !== "" && this.state.parameterResults[index]['additionalInfo'] !== null ? true : false
        //  parameter.jsondata['value'] ? JSON.parse(parameter.jsondata['value']).hasOwnProperty('additionalInfo') &&
        //     JSON.parse(parameter.jsondata['value'])['additionalInfo'] !== "" ? true : false :
        //     parameter.jsondata.hasOwnProperty('additionalInfo') &&
        //         parameter.jsondata['additionalInfo'] !== "" ? true : false

        switch (parameter.nparametertypecode) {

            case 1: {
                return (
                    <>
                        <div className='row w-100'>
                            <Col md={6}>
                                <FormInput
                                    name={this.state.parameterResults[index].ntransactionresultcode}
                                    type="text"
                                    required={false}
                                    isMandatory={false}
                                    // value={this.props.parameterResults.length > 0 ?
                                    //     this.props.parameterResults[index] ? (this.props.parameterResults[index]['sresult'] !== null ? this.props.parameterResults[index]['sresult'] : "") : "" : ""}
                                    value={this.state.parameterResults.length > 0 ?
                                        this.state.parameterResults[index] ? (this.state.parameterResults[index]['sresult'] !== null ? this.state.parameterResults[index]['sresult'] : "") : "" : ""}
                                    // placeholder={parameter.sparametersynonym}
                                    //label={parameter.sparametersynonym}
                                    // onChange={(event) => this.props.onResultInputChange(event, index, parameter)}
                                    onChange={(event) => this.onResultInputChange(event, index, parameter)}
                                    onBlur={() => this.onGradeEvent(this.state.parameterResults, index, parameter)}
                                    // onBlur={() => this.props.onGradeEvent(this.props.parameterResults, index, parameter)}
                                    maxLength={9}
                                    onKeyUp={(event) => this.props.onKeyPress(event, index, this.props.paremterResultcode)}
                                />
                            </Col>
                            {parameter.ntestgrouptestformulacode > 0 ?
                                <Col md={2} className="d-flex product-category justify-content-end icon-group-wrap">
                                    <Nav.Link title="Calculate Formula" className="btn btn-circle outline-grey ml-2" role="button" id={screenName + -+index}
                                        onClick={(event) => this.props.getFormula(parameter, this.props.Login.userInfo, this.props.Login.masterData, index, event)}>
                                        <FontAwesomeIcon title="Calculate Formula" icon={faCalculator} />
                                    </Nav.Link>
                                </Col>
                                : ""}
                            <Col md={4}>
                                {/* {this.props.selectedResultGrade.length > 0 ? */}
                                <ListWrapper><MediaLabel className="labelfont" style={{ color: gradeValues[gradeCode][0]['scolorhexcode'] }}>
                                    {gradeCode === undefined ? "" : gradeValues[gradeCode][0]['sgradename']}</MediaLabel></ListWrapper>
                                {/* : ""} */}
                            </Col>
                        </div>
                    </>
                );
            }
            case 2: {
                return (
                    <>
                        <Col md={isAdditionalInfoRequired ? 8 : 10} className="pl-0" >
                            <FormSelectSearch
                                name={this.state.parameterResults[index] && this.state.parameterResults[index].ntransactionresultcode}
                                as={"select"}
                                //formLabel={parameter.sparametersynonym}

                                defaultValue={{
                                    "value": this.state.parameterResults[index] &&
                                        this.state.parameterResults[index].sresultpredefinedname, "label":
                                        this.state.parameterResults[index] && this.state.parameterResults[index]
                                            .sresultpredefinedname
                                }}

                                //  defaultValue={{ "value": parameter.sresultpredefinedname, "label": parameter.sresultpredefinedname }}


                                //  defaultValue={parameter.sresult && (parameter.sresult!=null || parameter.sresult !== "") ?  { "value": parameter.ngradecode, "label": parameter.sresult } :
                                //  this.props.predefinedValues ? constructOptionList(this.props.predefinedValues[parameter.ntransactionresultcode]||[],'ngradecode',
                                // 'spredefinedname' , undefined, undefined, undefined).get("DefaultValue"):""}

                                options={this.props.predefinedValues ? this.props.predefinedValues[parameter.ntransactionresultcode] : ""}
                                optionId={"ntestgrouptestpredefcode"}
                                optionValue={"spredefinedname"}
                                isMulti={false}
                                isDisabled={false}
                                matchFrom={'start'}
                                isSearchable={true}
                                isClearable={parameter.nresultmandatory === transactionStatus.YES ? false : true}
                                isMandatory={false}
                                onKeyUp={(event) => this.props.onKeyPress(event, index, this.props.paremterResultcode)}
                                // onChange={(event) => this.props.onResultInputChange(event, index, parameter)}
                                // onBlur={() => this.props.onGradeEvent(this.props.parameterResults, index, parameter)}
                                onChange={(event) => { this.onResultInputChange(event, index, parameter); this.onGradeEvent(this.state.parameterResults, index, parameter) }}
                            //onChange={(event) => this.onResultInputChange(event, index, parameter)}
                            //onBlur={() => this.onGradeEvent(this.state.parameterResults, index, parameter)}

                            />
                        </Col>
                        <Col md={2} className="pt-2">
                            {/* {this.props.selectedResultGrade.length > 0 ? */}
                            <ListWrapper><MediaLabel className="labelfont" style={{ color: gradeValues[gradeCode][0]['scolorhexcode'] }}>
                                {gradeCode === undefined ? "" : gradeValues[gradeCode][0]['sgradename']}</MediaLabel></ListWrapper>
                            {/* : ""} */}
                        </Col>
                        {isAdditionalInfoRequired &&

                            <Col md={2} className="pt-2">
                                {/* <Button className="btn btn-circle outline-grey ml-2" variant="link"
                                     //   hidden={this.props.userRoleControlRights.indexOf(this.props.viewId) === -1}
                                        title={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                                        data-tip={  parameter.jsondata['value'] ?
                                        JSON.parse(parameter.jsondata['value'])['additionalInfo'] :
                                        parameter.jsondata['additionalInfo']}
                                        data-for="tooltip_list_wrap"
                                         onClick={() => this.props.viewAdditionalInfo(parameter.ntransactionresultcode)}
                                        >
                                        <FontAwesomeIcon icon={faEye}/>
                                     </Button>     */}
                                {/* <Modal.Title id="password" className="header-primary flex-grow-1">
                                      <FormattedMessage id='IDS_ADDITIONALINFOREQURIED' defaultMessage='Cancel' />
                                      </Modal.Title> */}

                                <TestPopOver intl={this.props.intl} needIcon={true} needPopoverTitleContent={true} placement="left" stringList={
                                    // parameter.jsondata['value'] ?
                                    //      [JSON.parse(parameter.jsondata['value'])['additionalInfo']] :
                                    //              [parameter.jsondata['additionalInfo']] 
                                    this.state.parameterResults[index].hasOwnProperty('additionalInfo') &&
                                    this.state.parameterResults[index]['additionalInfo'] !== "" &&
                                    [this.state.parameterResults[index]['additionalInfo']]} ></TestPopOver>
                                {/* <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        // data-for="tooltip-common-wrap"
                                        //  data-place={action.dataplace && action.dataplace ? action.dataplace : ""}
                                         data-tip={ parameter.jsondata['value'] ?
                                         JSON.parse(parameter.jsondata['value'])['additionalInfo'] :
                                                 parameter.jsondata['additionalInfo'] }
                                        data-html={true}
                                        //   hidden={this.props.userRoleControlRights.indexOf(this.props.viewId) === -1}
                                        onClick={() => this.props.viewAdditionalInfo(parameter.ntransactionresultcode)}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                    </Nav.Link>  */}

                            </Col>
                        }

                    </>
                );
            }
            case 3: {
                return (
                    <>
                        <Col md={10} className="pl-0">
                            <FormTextarea
                                name={parameter.ntransactionresultcode}
                                //label={parameter.sparametersynonym}
                                //placeholder={parameter.sparametersynonym}
                                type="text"
                                //     defaultValue={parameter.sresult}
                                defaultValue={this.state.parameterResults[index] && this.state.parameterResults[index]['sresult']}

                                isMandatory={false}
                                required={false}
                                maxLength={255}
                                onChange={(event) => this.onResultInputChange(event, index, parameter)}
                                onBlur={() => this.onGradeEvent(this.state.parameterResults, index, parameter)}
                            />
                        </Col>
                        <Col md={2}>
                            {/* {this.props.selectedResultGrade.length > 0 ? */}
                            <ListWrapper><MediaLabel className="labelfont" style={{ color: gradeValues[gradeCode][0]['scolorhexcode'] }}>
                                {gradeCode === undefined ? "" : gradeValues[gradeCode][0]['sgradename']}</MediaLabel></ListWrapper>
                            {/* : ""} */}
                        </Col>
                    </>
                );
            }
            case 4: {
                return (
                    <Col md={12} className="pl-0">
                        <DropZone
                            maxFiles={1}
                            isMandatory={false}
                            //label={parameter.sparametersynonym}
                            accept=".pdf"
                            minSize={0}
                            maxSize={20}
                            multiple={false}
                            // editFiles={parameter.sfinal != null ? parameter : ""}
                            editFiles={this.state.parameterResults[index].sfinal != null ? this.state.parameterResults[index] : ""}
                            needdelete={this.props.needdelete ? true : false}
                            attachmentTypeCode={attachmentType.FTP}
                            fileSizeName="nfilesize"
                            fileName="sfinal"
                            index={index}
                            // deleteAttachment={this.props.deleteAttachmentParamFile}
                            // onDrop={(event) => this.props.onResultInputChange(event, index, parameter)}
                            deleteAttachment={this.deleteAttachmentParameterFile}
                            onDrop={(event) => this.onResultInputChange(event, index, parameter)}
                        //disabled={disabled}
                        />
                    </Col>
                )
            }

            default:
                return ("");
        }
    }
    // static getDerivedStateFromProps(props, state) {
    //     if( props.Login.showAlert !==  state.showAlert){
    //         //Change in props
    //         return{
    //             showAlert: props.Login.showAlert
    //         };
    //     } 
    //     return null; // No change to state
    // }
    componentWillUnmount() {

        //  let parameterResults = this.state.parameterResults
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            //  data: { parameterResults: undefined  }
            data: {
                isParameterInitialRender: false//,parameterResults:[] ,selectedRecord :{}
            }


        }
        this.props.updateStore(updateInfo);
    }
    onSaveSubCodedResult = (saveType, formRef) => {

        let selectedsubcode = this.state.selectedsubcode || [];
        // ALPD-5683    Added condition to check undefined by Vishakh (09-04-2025)
        let ssampleid=this.state.selectedRecord && this.state.selectedRecord["ssampleid"] && this.state.selectedRecord["ssampleid"].trim();
        if(ssampleid!=="" && ssampleid!==undefined){
        if(selectedsubcode && selectedsubcode.length===0)
        { selectedsubcode.push({ "ssampleid": this.state.selectedRecord["ssampleid"] });}
        const isFound = selectedsubcode.some(element => {
            if (element.ssampleid === ssampleid) {
              return true;
            }
          });
          if(!isFound){
            selectedsubcode.push({ "ssampleid": this.state.selectedRecord["ssampleid"] });
          
        }
        this.props.onSampleAdd(selectedsubcode);
        this.setState({ selectedsubcode, selectedRecord:undefined });
    }
        
    }




     handleKeypress = e => {
        //it triggers by pressing the enter key
      if (e.keyCode === 13) {
        this.onSaveSubCodedResult(this.props.Login.masterData, this.props.Login.userInfo)
      }
    };

    deleteSubCodedResult = (index, subCodedResult, index1) => {
        const selectedsubcode = this.state.selectedsubcode;
        selectedsubcode.splice(index1.dataIndex, 1);
        this.props.onSampleAdd(selectedsubcode);
        this.setState({ selectedsubcode });
    }

    // shouldComponentUpdate (nextProps,nextState) {
    //     // Rendering the component only if
    //     // passed props value is changed
    //     console.log('nextProps',nextProps);
    //     if ((nextProps.Login.parameterResults !==this.props.Login.parameterResults)) {
    //       return false;
    //     }else if(nextState.parameterResults!==this.state.parameterResults){
    //         return true;
    //     } else {
    //       return false;
    //     }
    //   }
    // shouldComponentUpdate (nextProps) { 
    //     if ((nextProps.Login.parameterResults !==this.props.Login.parameterResults)&&
    //     nextProps.Login.isParameterInitialRender===false) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   }

    // componentDidUpdate (prevProps, prevState) {
    //   //  console.log('Deleted User successfully'); 
    //     let parameterResults = this.state.parameterResults
    //     if(this.state.parameterResults!==prevState.parameterResults){
    //         const updateInfo = {
    //             typeName: DEFAULT_RETURN,
    //             data: { parameterResults: parameterResults,isParameterInitialRender:false }
    //         }
    //         this.props.updateStore(updateInfo);
    //     }

    //   }

    // this.props.onSaveClick = (childData) =>{
    //     this.setState({name: childData})
    // }

    // updateStoreResultEntryForm = (updateInfo)  => { 
    //     return function (dispatch) {
    //         console.log('updateInfoXXXXX')
    //         dispatch({
    //             type: updateInfo.typeName,
    //             payload: {
    //                 ...updateInfo.data,
    //                 masterStatus: "",
    //                 errorCode: undefined
    //             }
    //         }); 
    //     } 
    // }

    render() {

        //  console.log("Grand Child Result Entry Form");
        return (
            <>



                {/* <Preloader loading={this.state.loading} /> */}

                {/* { this.props.index===0&&
                <Button  className="btn-user btn-primary-blue" onClick={() => this.props.onSaveClick(this.state)}>

                    <FontAwesomeIcon icon={faSave} /> { }
                    <FormattedMessage id='IDS_SAVEFILTER' defaultMessage='Save Filter' />
                </Button> 
                
                }     */}
                {//this.props.index===0&&
                    this.state.showAlert &&
                    <ModalShow
                        modalShow={this.state.showAlert}
                        modalTitle={this.props.intl.formatMessage({ id: "IDS_ADDITIONALINFOREQURIED" })}
                        closeModal={this.closeModalShow}
                        onSaveClick={this.onModalSave}
                        removeCancel={this.state.showAlertForPredefined || this.state.additionalInfoView ? true : false}
                        needSubmit={this.state.showAlertForPredefined || this.state.additionalInfoView ? true : false}
                        needSave={this.state.showAlertForPredefined || this.state.additionalInfoView ? "" : true}
                        selectedRecord={this.state.selectedRecord || {}}
                        size={this.state.showAlertForPredefined || this.state.additionalInfoView ? "" : 'lg'}
                        showAlertMsg={this.state.showAlertForPredefined ? true : false}
                        modalBody={
                            <ResultEntryPredefinedComments
                                onlyAlertMsgAvailable={this.state.onlyAlertMsgAvailable}
                                salertmessage={this.state.masterData['salertmessage']}
                                showMultiSelectCombo={this.state.showMultiSelectCombo}
                                testgrouptestpredefsubresultOptions={this.state.masterData.testgrouptestpredefsubresultOptions || []}
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputChange={this.onInputChange}
                                onComboChange={this.onComboChange}
                            />
                        }
                    />}

                <Row   >
                    {/* {this.props.parameterResults.map((parameterResult, index) => {
                    return (   */}
                    <>

                        {/* {this.props.parameterResults && this.props.parameterResults.stestsynonym ?
                            <MediaHeader className={`labelfont`} style={{ color: "#007bff" }}>
                                
                                {this.props.parameterResults.stestsynonym ?
                                    <span className={`labelfont`} //style={{ color: "#505f79" }}
                                        style={{ color: "#007bff", paddingLeft: '0.2rem' }}>

                                        { }{ } {this.props.parameterResults.stestsynonym}
                                        
                                    </span>
                                    : ""}
                            </MediaHeader>
                            : ""
                        } */}

                        <Col md={12} className="pl-0 mt-2">
                            <MediaHeader className={`labelfont`} style={{ color: "#505f79" }}
                            // style={{ color: "#97a0af" }}
                            >
                                {/* <FontAwesomeIcon icon={faAngleRight} className="DeleteIconColor" /> */}
                                {/* <FontAwesomeIcon icon={faAngleRight} className="DeleteIconColor" />
                                    <FontAwesomeIcon icon={faAngleRight} className="DeleteIconColor" /> */}
                                { }{ } {this.props.parameterResults.sparametersynonym}{ }{ }{this.props.parameterResults.nresultmandatory === transactionStatus.NO ? "(optional)" : ""}
                            </MediaHeader>
                        </Col>
                        <>
                        {this.renderSwitch(this.props.parameterResults, this.props.index, this.props.parameterResults.ntransactionresultcode, this.props.Login.screenName)}
                        </>
                        {this.props.parameterResults.row_num === this.props.ResultParameter.length ?
                            <>
                                {/* <Col md={10} className="pl-0"> */}
                               <>
                                
                                    <Col md={8}>
                                        <FormInput
                                            label={this.props.intl.formatMessage({ id: this.props.Login.genericLabel && this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] })}
                                            name="ssampleid"
                                            type="text"
                                            onChange={(event) => this.onInputOnChange(event)}
                                            onKeyUp={this.handleKeypress}
                                            placeholder={this.props.intl.formatMessage({ id: this.props.Login.genericLabel && this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] })}
                                            value={this.state.selectedRecord ? this.state.selectedRecord["ssampleid"] : ""}
                                            isMandatory={false}
                                            required={true}
                                            maxLength={100}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <Nav.Link
                                            // data-for="tooltip-common-wrap"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_ENTERSAMPLEID" })} className="btn btn-circle outline-grey ml-2" role="button" onClick={() => this.onSaveSubCodedResult(this.props.Login.masterData, this.props.Login.userInfo)}    >
                                            <FontAwesomeIcon icon={faAddressBook} />
                                        </Nav.Link>
                                    </Col>
                                  
                                    </>

                                <DataGrid
                                    key="ssampleid"
                                    primaryKeyField="ssampleid"
                                    dataResult={this.state.selectedsubcode || []}
                                    dataState={{}}
                                    // dataState={this.state.sectionDataState}
                                    // dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
                                    data={[]}
                                    extractedColumnList={[{ "idsName": this.props.Login.genericLabel && this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], "dataField": "ssampleid", "width": "200px" }]}
                                    controlMap={this.props.controlMap}
                                    userRoleControlRights={this.props.userRoleControlRights}
                                    pageable={false}
                                    scrollable={'scrollable'}
                                    gridHeight={'335px'}
                                    isActionRequired={true}
                                    methodUrl="SampleID"
                                    hideColumnFilter={true}
                                    actionIcons={[{
                                        title: this.props.intl.formatMessage({ id: "IDS_DELETESAMPLE" }),
                                        controlname: "faTrashAlt",
                                        objectName: "ExceptionLogs",
                                        hidden: false,
                                        onClick: (item, key, nn) => this.deleteSubCodedResult(item, key, nn)

                                    }]}
                                //userRoleControlRights={this.props.userRoleControlRights}

                                >
                                </DataGrid>

                                {/* </Col> */}
                            </>
                            :
                            ""}
                    </>
                    {/* )
            })
            } */}
                </Row ></>

        )

    }
}

// export default  
// connect(mapStatetoProps, mapDispatchToProps, {
//    updateStore//,getPredefinedData
// } )
// //connect()
//     (injectIntl(ResultEntryForm)) ;

export default connect(null, {
    updateStore

})(injectIntl(ResultEntryParameterForm));