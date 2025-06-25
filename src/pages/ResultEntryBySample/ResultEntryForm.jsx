import React from 'react'
import { Row, Col, Nav, Button, Modal, Card } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { ListWrapper } from '../../components/client-group.styles';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import DropZone from '../../components/dropzone/dropzone.component';
import '../../components/list-master/list-master.styles';
import { attachmentType, parameterType, transactionStatus, formCode } from '../../components/Enumeration';
import './result.css';
import '../../assets/styles/tree.css';
import { MediaHeader, MediaLabel, MediaSubHeader } from '../../components/App.styles';
import FormInput from '../../components/form-input/form-input.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faEye, faInfo, faInfoCircle, faSave } from '@fortawesome/free-solid-svg-icons';
import TestPopOver from './TestPopOver';
import { numberConversion, numericGrade } from './ResultEntryValidation';
import { Lims_JSON_stringify, constructOptionList, deleteAttachmentDropZone, rearrangeDateFormat, replaceBackSlash } from '../../components/CommonScript';
import { connect } from 'react-redux';
import ResultEntryPredefinedComments from './ResultEntryPredefinedComments';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import ModalShow from '../../components/ModalShow';
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
class ResultEntryForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            parameterResults: [...this.props.ResultParameter],
            selectedResultGrade: this.props.selectedResultGrade//,
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
    //ALPD-4320 Aravindh For EnterKeypress
    onKeyPress = (event, index, paremterResultcode) => {
        if (event.keyCode === 13) {
            //for (let i = 0; i < event.target.form.elements.length; i++) {
                // if (parseInt(event.target.form.elements[i].id) === paremterResultcode[index + 1]) {
                //     event.target.form.elements[i].focus();
                //     //break;
                // }
            //}
            if(paremterResultcode[index+1]!==undefined && paremterResultcode[index+1]!==null){
            document.getElementById(index+1).focus();}
            event.preventDefault();
        }
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
                            Parameter['additionalInfo'] = replaceBackSlash(Parameter['additionalInfo'].substring(0,
                                Parameter['additionalInfo'].length - 1))
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
                        numericGrade(parameter, parameter.nroundingdigits != 0 ? numberConversion(parseFloat(ResultParameter[index].sresult), parseInt(parameter.nroundingdigits)) : parseFloat(ResultParameter[index].sresult) ) : -1
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
    onResultInputChange = (event, index, parameter,comboName) => {
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

               // if(event !== null){
                    if (/^-?\d*?\.?\d*?$/.test(event.target && event.target.value) || event.target && event.target.value === "") {
                        sresult = event.target.value;
                        ncalculatedresult = 4
                    }else{
                        if(event && event.item !=null){
                            if(comboName === "unitcode"){
                                ResultParameter[index]['unitcode'] = event;
                                sresult = ResultParameter[index]['sresult'];
                                ncalculatedresult = 4;
                            }else if(comboName === "resultaccuracycode"){
                                ResultParameter[index]['resultaccuracycode'] = event;
                                sresult = ResultParameter[index]['sresult'];
                                ncalculatedresult = 4;
                            }              
                       }else{
                        sresult = ResultParameter[index]['sresult'] === null ? "" : ResultParameter[index]['sresult'];
                        ncalculatedresult = ResultParameter[index]['ncalculatedresult'];
                       }
                    }
                // }else{
                //     if(comboName === "nresultaccuracycode"){    
                //         delete ResultParameter[index]['nresultaccuracycode'] ;                
                //         sresult = ResultParameter[index]['sresult'];
                //         ncalculatedresult = 4;
                //    }
                // }         
            
        }
         if (parameter.nparametertypecode === parameterType.PREDEFINED) {
			//ALPD-3941--Vignesh R(06-09-2024)
            if (event != null) {
            currentAlertResultCode = event.item.ntransactionresultcode;
            currentntestgrouptestpredefcode = event.item.ntestgrouptestpredefcode;
                sresult = event.item.spredefinedname;
                sresultpredefinedname = event.item.sresultpredefinedname;
                sfinal = event.item.spredefinedsynonym;
                value = event.item.ngradecode;
                // salertmessage = event.item.salertmessage ? Lims_JSON_stringify(event.item.salertmessage,false) : "";
                salertmessage = event.item.salertmessage ? event.item.salertmessage: "";
                sresultcomment = event.item.spredefinedcomments && event.item.spredefinedcomments !== "null" ?  event.item.spredefinedcomments : "";
                ncalculatedresult = 4;
				//ALPD-3941--Vignesh R(06-09-2024)
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
            else {
                sresult = "";
                sfinal = "";
                sresultpredefinedname = "";
                value = -1;
                ncalculatedresult = 4
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

        // if(sresult !==null && sresult !=""){
        //     ResultParameter[index]['editable'] = true;
        // }

        if(sresult !==null){
            ResultParameter[index]['editable'] = true;
        }

        ResultParameter[index]['sresult'] = sresult;
        ResultParameter[index]['sfinal'] = sfinal;
        ResultParameter[index]['sresultpredefinedname'] = sresultpredefinedname;
        ResultParameter[index]['sresultcomment'] = sresultcomment;
        ResultParameter[index]['salertmessage'] = salertmessage;
        ResultParameter[index]['acceptedFile'] = acceptedFile;        
        ResultParameter[index]['ngradecode'] = value;
        ResultParameter[index]['ncalculatedresult'] = ncalculatedresult;
        ResultParameter[index]['dummty'] = 'dummty';
        selectedRecord.ResultParameter = ResultParameter;
        let parameterResults = ResultParameter;

        
 if (event != null) {
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
        let addtionalInfoTestPopOver = this.state.parameterResults[index].hasOwnProperty('additionalInfo') &&
            this.state.parameterResults[index]['additionalInfo']!=="" && this.state.parameterResults[index]['additionalInfo'];
        switch (parameter.nparametertypecode) {
            case 1: {
                return (
                    <>
                        <div className='row w-100'>
                            <Col md={this.props.Login.userInfo.nformcode === formCode.RESULTENTRY ?2:6}>
                                <FormInput
                                    //name={this.state.parameterResults[index].ntransactionresultcode}
                                    name={index}
                                    //id={index}
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
                                    //onKeyUp={(event) => this.props.onKeyPress(event, index, this.props.paremterResultcode)}
                                    onKeyUp={(event) => this.onKeyPress(event, index, this.props.paremterResultcode)}
                                />
                            
                            </Col>
                            <Col md={this.props.Login.userInfo.nformcode === formCode.RESULTENTRY ?2:4} className='d-flex'>
                                {/* {this.props.selectedResultGrade.length > 0 ? */}
                                {/* ALPD-5781   Added validation for gradeCode for not showing alert issue by Vishakh */}
                                <ListWrapper><MediaLabel className="labelfont" style={{ color: gradeCode === undefined ? "" : gradeValues[gradeCode][0]['scolorhexcode'] }}>
                                    {gradeCode === undefined ? "" : gradeValues[gradeCode][0]['sgradename']}</MediaLabel></ListWrapper>
                                {/* : ""} */}
                                {parameter.ntestgrouptestformulacode > 0 && parameter.nispredefinedformula ===transactionStatus.NO ? 
                                   <Col className="d-flex product-category justify-content-end icon-group-wrap">
                                       <Nav.Link title="Calculate Formula" className="btn btn-circle outline-grey ml-2 p-2" role="button" id={screenName + -+index}
                                           onClick={(event) => this.props.getFormula(parameter, this.props.Login.userInfo, this.props.Login.masterData, index, event)}>
                                           <FontAwesomeIcon title="Calculate Formula" icon={faCalculator} />
                                       </Nav.Link>
                                   </Col>
                                    : ""} 
                            </Col>

                            <Col md={this.props.Login.userInfo.nformcode === formCode.RESULTENTRY ?3:6}>
                                <FormSelectSearch
                                   name={"nresultaccuracycode"}
                                   formLabel={ this.props.intl.formatMessage({ id:"IDS_RESULTACCURACY"})}                                
                                   placeholder={ this.props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                              
                                   options={ this.props.ResultAccuracy}
                                   value={ this.state.parameterResults[index]['resultaccuracycode'] || ""}

                                   //value = { this.props.selectedRecord && this.props.selectedRecord["nresultaccuracycode"] || ""}
                                   isMandatory={false}
                                   //isClearable={true}
                                   isMulti={false}
                                   isSearchable={true}                               
                                   isDisabled={false}
                                   closeMenuOnSelect={true}
                                   defaultValue={ this.state.parameterResults[index]['resultaccuracycode']}

                                   //defaultValue={this.props.selectedRecord && this.props.selectedRecord["nresultaccuracycode"]}
                                   onChange={(event) => this.onResultInputChange(event, index, parameter,'resultaccuracycode')}
                                   />
                            </Col>

                             <Col md={this.props.Login.userInfo.nformcode === formCode.RESULTENTRY ?3:6}>
                                <FormSelectSearch
                                   name={"nunitcode"}
                                   formLabel={ this.props.intl.formatMessage({ id:"IDS_UNIT"})}                                
                                   placeholder={ this.props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                              
                                   options={ this.props.Unit}
                                   value = { this.state.parameterResults[index]['unitcode'] || ""}
                                   isMandatory={false}
                                   isMulti={false}
                                   isSearchable={true}                               
                                   isDisabled={false}
                                   closeMenuOnSelect={true}
                                   defaultValue={ this.state.parameterResults[index]['unitcode']}
                                   onChange={(event) => this.onResultInputChange(event, index, parameter,'unitcode')} 
                                />
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
                               // name={this.state.parameterResults[index] && this.state.parameterResults[index].ntransactionresultcode}
                               name={index}
                               as={"select"}
                                id={index}
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
                                //onKeyUp={(event) => this.props.onKeyPress(event, index, this.props.paremterResultcode)}
                                onKeyUp={(event) => this.onKeyPress(event, index, this.props.paremterResultcode)}
                                // onChange={(event) => this.props.onResultInputChange(event, index, parameter)}
                                // onBlur={() => this.props.onGradeEvent(this.props.parameterResults, index, parameter)}
                                onChange={(event) => { this.onResultInputChange(event, index, parameter); this.onGradeEvent(this.state.parameterResults, index, parameter) }}
                                //onChange={(event) => this.onResultInputChange(event, index, parameter)}
                                //onBlur={() => this.onGradeEvent(this.state.parameterResults, index, parameter)}
 
                            />
                        </Col>
                        <Col md={2} className="pt-2">
                            {/* {this.props.selectedResultGrade.length > 0 ? */}
                            {/* ALPD-5781   Added validation for gradeCode for not showing alert issue by Vishakh */}
                            <ListWrapper><MediaLabel className="labelfont" style={{ color: gradeCode === undefined ? "" : gradeValues[gradeCode][0]['scolorhexcode'] }}>
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
                                    // this.state.parameterResults[index].hasOwnProperty('additionalInfo') &&
                                    // this.state.parameterResults[index]['additionalInfo']!==""&&
                                    // [this.state.parameterResults[index]['additionalInfo']]}
                                    addtionalInfoTestPopOver && [addtionalInfoTestPopOver.replaceAll(/\\+n/g, '\n')]} 
                                    ></TestPopOver>
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
                            name={index}
                               // name={parameter.ntransactionresultcode}
                                //label={parameter.sparametersynonym}
                                //placeholder={parameter.sparametersynonym}
                                type="text"
                                //     defaultValue={parameter.sresult}
                                defaultValue={this.state.parameterResults[index] && this.state.parameterResults[index]['sresult']}
                                onKeyUp={(event) => this.onKeyPress(event, index, this.props.paremterResultcode)}
                                isMandatory={false}
                                required={false}
                                maxLength={255}
                                onChange={(event) => this.onResultInputChange(event, index, parameter)}
                                onBlur={() => this.onGradeEvent(this.state.parameterResults, index, parameter)}
                            />
                        </Col>
                        <Col md={2}>
                            {/* {this.props.selectedResultGrade.length > 0 ? */}
                            {/* ALPD-5781   Added validation for gradeCode for not showing alert issue by Vishakh */}
                            <ListWrapper><MediaLabel className="labelfont" style={{ color: gradeCode === undefined ? "" : gradeValues[gradeCode][0]['scolorhexcode'] }}>
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
                            needdelete={this.props.needdelete?true:false}
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
            data: { isParameterInitialRender: false//,parameterResults:[] ,selectedRecord :{}
         }

            
        }
        this.props.updateStore(updateInfo);
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

                <Row  className='result-entry-form-slide' >
                    {/* {this.props.parameterResults.map((parameterResult, index) => {
                    return (   */}
                    <>

                        {this.props.needSubSample && this.props.parameterResults.ssamplearno ?
                            <MediaHeader className={`labelfont`} style={{ color: "#007bff" }}>
                                {/* ALPD-5781   Added validation for arno and samplearno not showing alert issue by Vishakh */}
                                {this.props.parameterResults.row_num === 1 && this.props.parameterResults.ssamplearno}
                                {this.props.parameterResults.stestsynonym ?
                                    <span className={`labelfont`} //style={{ color: "#505f79" }}
                                        style={{ color: "#97a0af", paddingLeft: '0.2rem' }}>
                                        {/* <FontAwesomeIcon icon={faAngleRight} className="DeleteIconColor" /> */}
                                        {/* <FontAwesomeIcon icon={faAngleRight} className="DeleteIconColor" /> */}
                                        { }{ } {this.props.parameterResults.row_num === 1 && this.props.parameterResults.stestsynonym}
                                        {/* {this.props.parameterResults.sretestrepeatcount} */}
                                    </span>
                                    : ""}
                            </MediaHeader>
                            : this.props.parameterResults.sarno ?
                                <MediaHeader className={`labelfont`} style={{ color: "#007bff" }}>
                                    {/* ALPD-5781   Added validation for arno and samplearno not showing alert issue by Vishakh */}
                                    {this.props.parameterResults.row_num === 1 && this.props.parameterResults.sarno}
                                    {this.props.parameterResults.stestsynonym ?
                                        <span className={`labelfont`} //style={{ color: "#505f79" }}
                                            style={{ color: "#97a0af", paddingLeft: '0.2rem' }}>
                                            {/* <FontAwesomeIcon icon={faAngleRight} className="DeleteIconColor" /> */}
                                            {/* <FontAwesomeIcon icon={faAngleRight} className="DeleteIconColor" /> */}
                                            { }{ } {this.props.parameterResults.row_num === 1 && this.props.parameterResults.stestsynonym}
                                            {/* {this.props.parameterResults.sretestrepeatcount} */}
                                        </span>
                                        : ""}
                                </MediaHeader>
                                : ""
                        }
                        {
                           (this.props.formFields &&  this.props.formFields.length>0) ?
                            this.props.formFields.map((item,index)=>
                             <>
                             <MediaHeader className={`labelfont`} style={{ color: "#007bff" ,paddingLeft: '0.3rem'}}>
                             {item + " : "}
                             </MediaHeader>
                             <MediaHeader className={`labelfont`} style={{ color: "##97a0af" ,paddingLeft: '0.3rem'}}>
                             { this.props.parameterResults.hasOwnProperty(item)? this.props.parameterResults[item]||'-':'-' } 
                             {index===(this.props.formFields.length-1)?"":" | "}
                             </MediaHeader>
                             </>
                             )
                             :""
                        }

                        <Col md={12} className="pl-0 mt-2">
                            <MediaHeader className={`labelfont`} style={{ color: "#505f79" }}
                            >
                                {/* <FontAwesomeIcon icon={faAngleRight} className="DeleteIconColor" /> */}
                                { }{ } {this.props.parameterResults.sparametersynonym}{ }{ }{this.props.parameterResults.nresultmandatory === transactionStatus.NO ? "(optional)" : ""}
                            </MediaHeader>
                        </Col>
                        <div className='row w-100' style={{ color: "#505f79", fontSize: "0.8rem" }}>
                        <Col md={this.props.parameterResults && (this.props.parameterResults.nparametertypecode === parameterType.CHARACTER || this.props.parameterResults.nparametertypecode === parameterType.PREDEFINED) ? 12 : this.props.Login.userInfo && this.props.Login.userInfo.nformcode === formCode.RESULTENTRY ? 6 : 4} style={{wordWrap: 'break-word'}}>
                            {this.props.parameterResults && this.props.parameterResults.nparametertypecode !== parameterType.ATTACHMENT && this.props.intl.formatMessage({ id:"IDS_DEFAULTRESULT"})+ " : "+ (this.props.parameterResults.sresultvalue != null ? this.props.parameterResults.sresultvalue : "-")}
                        </Col>
                        {this.props.parameterResults && this.props.parameterResults.nparametertypecode === parameterType.NUMERIC && 
                        <Col md={this.props.Login.userInfo && this.props.Login.userInfo.nformcode === formCode.RESULTENTRY ? 6 : 10}>
                            <span className="pr-4">{this.props.intl.formatMessage({ id:"IDS_MINB"})+ " : "+ (this.props.parameterResults.sminb != null ? this.props.parameterResults.sminb : "-")}</span>
                            <span className="pr-4">{this.props.intl.formatMessage({ id:"IDS_MINA"})+ " : "+ (this.props.parameterResults.smina != null ? this.props.parameterResults.smina : "-")}</span>
                            <span className="pr-4">{this.props.intl.formatMessage({ id:"IDS_MAXA"})+ " : "+ (this.props.parameterResults.smaxa != null ? this.props.parameterResults.smaxa : "-")}</span>
                            <span className="pr-4">{this.props.intl.formatMessage({ id:"IDS_MAXB"})+ " : "+ (this.props.parameterResults.smaxb != null ? this.props.parameterResults.smaxb : "-")}</span>
                        </Col>}
                        </div>
                        {this.props.parameterResults && this.props.parameterResults.nparametertypecode !== parameterType.ATTACHMENT && <hr style={{  border: 'none', height: '0.5px', backgroundColor: '#EEEAEA', width: '100%' }} />}
                        <br/><br/>
                        {this.renderSwitch(this.props.parameterResults, this.props.index, this.props.parameterResults.ntransactionresultcode, this.props.Login.screenName)}
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
    
    })(injectIntl(ResultEntryForm));