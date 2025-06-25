import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Nav, FormGroup, FormLabel, Card, Modal, Image, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPencilAlt, faTrashAlt, faCheckCircle, faCopy, faEye, faPlay, faPlus, faSync,
    faBolt
} from '@fortawesome/free-solid-svg-icons';
import reject from '../../assets/image/reject.svg'
import elnimage from '../../assets/image/sheet-view.svg'
import {
    callService, crudMaster, updateStore,
    getTestInstrumentComboService, getTestInstrumentCategory, getProductBasedInstrument,
    getInstrumentForInstCategory, getBatchCreationDetails, onActionFilterSubmit,
    getProductcategoryAction, createBatchmasterAction, getSamplesForGrid,
    getSelectedBatchCreationDetail, createSampleAction, deleteSampleAction,
    getActiveBatchCreationService, updateBatchcreationAction, deleteBatchCreation,
    batchInitiateAction, getBCRegistrationSubType, batchCompleteAction,
    validateEsignCredential, filterColumnData, getBatchhistoryAction, getBatchSection,
    viewInfo, getIqcSamples, getMaterialBasedOnMaterialCategory,
    getMaterialInventoryBasedOnMaterial, batchSaveIQCActions, getMaterialAvailQtyBasedOnInv,
    getBatchIqcSampleAction, getBCApprovalConfigVersion, getBCRegistrationType, getTreeByMaterial,
    getNewRegSpecification, cancelIQCSampleAction, batchCancelAction, batchInitiateDatePopup,
    batchCompleteDatePopup, getInstrumentID, getBatchViewResultAction, validateEsignforBatch,
    getBatchCreationFilter
    //,batchTAT
} from '../../actions';
import {
    transactionStatus, designProperties, reportTypeEnum, reportCOAType,
    RegistrationSubType, SampleType
} from '../../components/Enumeration';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {
    showEsign, getControlMap, getStartOfDay, getEndOfDay,
    formatInputDate, constructOptionList, rearrangeDateFormat, convertDateValuetoString, CF_encryptionData
} from '../../components/CommonScript';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { ReadOnlyText, ContentPanel, MediaLabel } from '../../components/App.styles';
import { ListWrapper } from '../../components/client-group.styles';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import Esign from '../audittrail/Esign';
import { ProductList } from '../product/product.styled';
import CustomPopover from '../../components/customPopover';
import { ReactComponent as SaveIcon } from '../../assets/image/save_icon.svg';
import BatchCreationFilter from './BatchCreationFilter';
import AddBatchCreation from './AddBatchCreation';
import AddBatchinitiate from './AddBatchinitiate';
import CustomTab from '../../components/custom-tabs/custom-tabs.component';
import SampleTab from './SampleTab';
import BatchhistoryTab from './BatchhistoryTab';
import { process } from '@progress/kendo-data-query';
import AddSample from '../batchruncreation/AddSample';
import ListMaster from '../../components/list-master/list-master.component';
import ViewInfo from './ViewInfo';
import { Affix } from 'rsuite';
import AddMaterialIqc from './AddMaterialIqc';
import BatchIqcSampleTab from './BatchIqcSampleTab';
import BatchResultTab from './BatchResultTab';
import PortalModal from '../../PortalModal';
import Iframe from 'react-iframe';
import ReactTooltip from 'react-tooltip';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import ModalShow from '../../components/ModalShow';
import FormTextarea from '../../components/form-textarea/form-textarea.component';



const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class BatchCreation extends React.Component {
    constructor(props) {
        super(props);
        const sampleState = {
            skip: 0, take: this.props.Login.settings ?
                parseInt(this.props.Login.settings[14]) : 5
        };

        const histortState = {
            skip: 0, take: this.props.Login.settings ?
                parseInt(this.props.Login.settings[14]) : 5
        };

        const iqcsampleState = {
            skip: 0, take: this.props.Login.settings ?
                parseInt(this.props.Login.settings[14]) : 5
        };

        const viewstate = {
            skip: 0, take: this.props.Login.settings ?
                parseInt(this.props.Login.settings[14]) : 5
        };

        this.state = {
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],
            userRoleControlRights: [],
            controlMap: new Map(),
            selectedFilter: {},
            sampleState,
            histortState,
            iqcsampleState,
            viewstate,
            selectedRecord: {},
            addedSamplesListSortedList:[],
            //confirmmsg:this.ConfirmMessage.bind(this),
            dataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            sidebarview: false

        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();

        this.searchFieldList = ["stestname", "sinstrumentcatname", "sinstrumentname", "sproductname", "smanufname", "stransactiondate", "username",
            "stransactionstatus", "sdecision", "sbatcharno", "stransdisplaystatus"];

        this.sampleMandatoryFields = [];
        this.copyMandatoryFields = [];
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })
    }

    static getDerivedStateFromProps(props, state) {
        // if (props.Login.masterStatus !== "") {
        //     if (props.Login.errorCode === 417 || props.Login.errorCode === 409) {
        //        if(props.Login.operation == "initiate"){
        //         toast.warn(props.Login.masterStatus);
        //         //this.state.confirmmsg.confirm("warning", "Warning!",  props.Login.masterStatus, undefined, "ok", undefined, true, undefined);
        //        }
        //     }
        // }
        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== "" && props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        if (props.Login.selectedRecord === undefined) {
            return { selectedRecord: {} }
        }
        return null;
        // if (props.Login.selectedRecord !== state.selectedRecord) {
        //     return ({ selectedRecord: { ...state.selectedRecord, ...props.Login.selectedRecord } });
        // }
    }


    // const sampleColumnList = [];

    // if (props.nneedsubsample){
    //     sampleColumnList.push({"idsName":"IDS_SAMPLEARNO","dataField":"ssamplearno", "width": "155px"} );
    // }
    // else{
    //     sampleColumnList.push({"idsName":"IDS_ARNUMBER","dataField":"sarno", "width": "155px"});
    // }

    completeMandatoryFields = [
        {
            "idsName": "IDS_BATCHCOMPLETEDATE",
            //"idsName": this.props.Login.operation === "initiate" ? "IDS_BATCHINITIATEDATE" :"IDS_BATCHCOMPLETEDATE" , 
            "dataField": "dtransactiondate", "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox"
        },
    ];

    initiateMandatoryFields = [
        {
            "idsName": "IDS_BATCHINITIATEDATE",
            //"idsName": this.props.Login.operation === "initiate" ? "IDS_BATCHINITIATEDATE" :"IDS_BATCHCOMPLETEDATE" , 
            "dataField": "dtransactiondate", "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox"
        },
    ];



    materialIqcMandatory = [

        { "idsName": "IDS_MATERIALTYPE", "dataField": "smaterialtypename", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_MATERIALCATEGORY", "dataField": "smaterialcatname", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_MATERIAL", "dataField": "smaterialname", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_MATERIALINVENTORY", "dataField": "sinventoryid", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        //{ "idsName": "IDS_AVAILABLEQUANTITY", "dataField": "savailablequatity", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_USEDQTY", "dataField": "susedquantity", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
    ]

    getSamples = (selectedbatchmaster) => {
        const addSampleID = this.state.controlMap.has("AddSamples") && this.state.controlMap.get("AddSamples").ncontrolcode
        if (selectedbatchmaster.ntransactionstatus == transactionStatus.INITIATED ||
            selectedbatchmaster.ntransactionstatus == transactionStatus.COMPLETED ||
            selectedbatchmaster.ntransactionstatus == transactionStatus.CANCELLED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTBATCH" }));
        } else {
            this.props.getSamplesForGrid(this.props.Login.masterData.SelectedBatchmaster.ntestcode, this.props.Login.masterData.SelectedBatchmaster.nbatchmastercode,
                this.props.Login.userInfo, this.props.Login.masterData,
                this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode ?
                    this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA,
                this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode ?
                    this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA, addSampleID,this.state.dataState,this.state.addedSamplesListSortedList)
        }
    }

    createBatchValidation = (addParam) => {
        if (this.props.Login.masterData.defaultRegistrationType != undefined && this.state.FilterStatusValue.item != undefined && this.state.nregsubtypecode.item != undefined &&
            this.state.ApprovalVersionValue.item != undefined
        ) {
            this.props.getBatchSection(addParam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }));
        }
    }

    getIqcSamples = (SelectedBatchmaster) => {
        if (SelectedBatchmaster.ntransactionstatus == transactionStatus.INITIATED ||
            SelectedBatchmaster.ntransactionstatus === transactionStatus.COMPLETED ||
            SelectedBatchmaster.ntransactionstatus === transactionStatus.CANCELLED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTBATCH" }));
        } else if (this.props.Login.masterData.Samples.length == 0) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLETOADDIQC" }));
        } else {
            let addcontrolcode = this.state.controlMap.has("AddBatchCreation") && this.state.controlMap.get("AddBatchCreation").ncontrolcode;
            let inputData = {};
            inputData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode ?
                this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA;
            inputData["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode ?
                this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA;
            inputData["nsampletypecode"] = this.props.Login.masterData.realSampleTypeValue ?
                this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA;
            // inputData["nregtypecode"]=this.props.Login.masterData.defaultRegistrationType ? this.props.Login.masterData.defaultRegistrationType.nregtypecode : transactionStatus.NA;
            // inputData["nregsubtypecode"]=this.state.nregsubtypecode ? this.state.nregsubtypecode.item.nregsubtypecode : transactionStatus.NA;
            inputData['naddcontrolCode'] = addcontrolcode;
            inputData['ntestgroupspecrequired'] = this.props.Login.masterData.realRegSubTypeValue && 
            this.props.Login.masterData.realRegSubTypeValue.ntestgroupspecrequired === true ? transactionStatus.YES : transactionStatus.NO;
            
            // inputData['section']={
            //         nsectioncode: SelectedBatchmaster.nsectioncode
            // };
            inputData['nsectioncode'] = SelectedBatchmaster.nsectioncode;
            inputData['userInfo'] = this.props.Login.userInfo;
            inputData['nbatchmastercode'] = SelectedBatchmaster.nbatchmastercode;
            inputData["ntestcode"] = this.props.Login.masterData.SelectedBatchmaster.ntestcode;
            this.props.getIqcSamples(inputData, this.props.Login.masterData);
        }
    }

    deleteRecord = (inputData) => {

        if (this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus == transactionStatus.INITIATED ||
            this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus === transactionStatus.COMPLETED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_BATCHALREADYINITIATEDCOMPLETED" }));
        } else {
            const postParam = {
                inputListName: "Batchmaster",
                selectedObject: "SelectedBatchmaster",
                primaryKeyField: "nbatchmastercode",
                primaryKeyValue: inputData.selectedRecord.nbatchsampleCode,
                fetchUrl: "batchcreation/getSampleTabDetails",
                isSingleGet: true,
                //task: selectedBatch.ntransactionstatus === transactionStatus.DRAFT ? "delete" : "cancel",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }
            let jsondata = inputData.selectedRecord;
            const inputParam = {
                classUrl: "batchcreation",
                methodUrl: "Sample",
                postParam,
                inputData: {
                    Sample: {
                        "sarno": inputData.selectedRecord.sarno,
                        "ssamplearno": inputData.selectedRecord.ssamplearno,
                        "stestname": inputData.selectedRecord.stestname,
                        "nbatchsamplecode": inputData.selectedRecord.nbatchsamplecode,

                    },
                    "userInfo": this.props.Login.userInfo,
                    nbatchsamplecode: inputData.selectedRecord.nbatchsamplecode,
                    masterData: {
                        ...this.props.Login.masterData,
                        "samples": []
                    },
                    nbatchmastercode: inputData.selectedRecord.nbatchmastercode,
                    userinfo: this.props.Login.userInfo,
                    ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode,
                    //nregtypecode :this.props.Login.masterData.defaultRegistrationType ? this.props.Login.masterData.defaultRegistrationType.nregtypecode : transactionStatus.NA,
                    //nregsubtypecode : this.state.nregsubtypecode ? this.state.nregsubtypecode.item.nregsubtypecode : transactionStatus.NA
                    nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA,
                    nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode ?
                        this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA,
                },
                operation: inputData.operation,
                displayName: this.props.Login.inputParam.displayName,
                dataState: this.state.dataState
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, inputData.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                        operation: inputData.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.deleteSampleAction(inputParam.inputData);
            }
        }
    }

    cancelRecord = (inputData) => {

        if (this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus == transactionStatus.INITIATED ||
            this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus === transactionStatus.COMPLETED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_BATCHALREADYINITIATEDCOMPLETED" }));
        } else {
            const postParam = {
                inputListName: "Batchmaster",
                selectedObject: "SelectedBatchmaster",
                primaryKeyField: "nbatchmastercode",
                primaryKeyValue: inputData.nbatchsampleiqccode,
                fetchUrl: "batchcreation/getBatchIqcSampleAction",
                isSingleGet: true,
                //task: selectedBatch.ntransactionstatus === transactionStatus.DRAFT ? "delete" : "cancel",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }
            const inputParam = {
                classUrl: "batchcreation",
                methodUrl: "IQCSample",
                postParam,
                inputData: {
                    iqcSample: inputData.selectedRecord,
                    nbatchsampleiqccode: inputData.selectedRecord.nbatchsampleiqccode,
                    masterData: this.props.Login.masterData,
                    nbatchmastercode: inputData.selectedRecord.nbatchmastercode,
                    nmaterialinventtranscode: inputData.selectedRecord.nmaterialinventtranscode,
                    userinfo: this.props.Login.userInfo,
                    ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode,
                    //nregtypecode :this.props.Login.masterData.defaultRegistrationType ? this.props.Login.masterData.defaultRegistrationType.nregtypecode : transactionStatus.NA,
                    //nregsubtypecode : this.state.nregsubtypecode ? this.state.nregsubtypecode.item.nregsubtypecode : transactionStatus.NA
                    nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA,
                    nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode ?
                        this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA,
                    nsampletypecode: this.props.Login.masterData.realSampleTypeValue ?
                        this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA
                },
                operation: inputData.operation,
                displayName: this.props.Login.inputParam.displayName,
                dataState: this.state.dataState
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, inputData.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: {
                            inputParam,
                            masterData: this.props.Login.masterData
                        },
                        openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                        operation: inputData.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.cancelIQCSampleAction(inputParam.inputData);
            }
        }
    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;

        if (screenName == "IDS_BATCHHISTORY") {

            let inputData = {
                masterData: this.props.Login.masterData,
                userInfo: this.props.Login.userInfo,
                nbatchmastercode: this.props.Login.masterData.SelectedBatchmaster.nbatchmastercode
            }
            this.props.getBatchhistoryAction(inputData, true);
        } else if (screenName == "IDS_BATCHIQCSAMPLE") {

            let inputData = {
                masterData: this.props.Login.masterData,
                userInfo: this.props.Login.userInfo,
                nbatchmastercode: this.props.Login.masterData.SelectedBatchmaster.nbatchmastercode
            }
            this.props.getBatchIqcSampleAction(inputData, true);
        } else if (screenName == "IDS_RESULTS") {
            let inputData = {
                masterData: this.props.Login.masterData,
                userInfo: this.props.Login.userInfo,
                nneedsubsample: this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedsubsample,
                nbatchmastercode: this.props.Login.masterData.SelectedBatchmaster.nbatchmastercode
            }
            this.props.getBatchViewResultAction(inputData, true);
        } else {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { screenName, batchactiveKey: screenName }
            }
            this.props.updateStore(updateInfo);
        }
    }

//ALPD-5137--Vignesh R(20-12-2024)---Including filter in Data selection Kendo Grid
    /*dataStateChangeBatchSample= (event) => {

    let updatedList = [];
    if (event.dataState && event.dataState.filter === null) {
      let addComponentDataListCopy = this.state.addComponentDataListCopy ||this.state.samples|| [];
      addComponentDataListCopy.forEach(x => {
        // Check if x's ntransactiontestcode exists in addComponentSortedList
        const exists = this.state.addedSamplesListSortedList.some(
          item => item.ntransactiontestcode === x.ntransactiontestcode
        );
        // If it doesn't exist, add it to updatedList
        if (!exists) {
          updatedList.push(x);
        }
      });
    }else{
      updatedList=this.state.samples||[]
    }    

    this.setState({
    dataResult: process(this.state.samples || [], event.dataState),
    dataState: event.dataState,
    samples:updatedList,addSelectAll:event.dataState && event.dataState.filter === null?
    this.valiateCheckAll(updatedList):
    this.valiateCheckAll(process(updatedList || [], event.dataState).data)
    
    });
  }
*/

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.Login.masterData.Samples, event.dataState),
            sampleState: event.dataState
        });
    }

    dataStateBatchHistoryChange = (event) => {
        this.setState({
            dataResult: process(this.props.Login.masterData.Batchhistory, event.dataState),
            histortState: event.dataState
        });
    }

    dataStateBatchIqcChangeChange = (event) => {
        this.setState({
            dataResult: process(this.props.Login.masterData.iqcsample, event.dataState),
            iqcsampleState: event.dataState
        });
    }

    dataStateViewChange = (event) => {
        this.setState({
            dataResult: process(this.props.Login.masterData.Resultview, event.dataState),
            viewstate: event.dataState
        });
    }

    gridfillingColumn(data) {
        const temparray = [];
            data && data.map((option) => {
              if (option[designProperties.VALUE] !== "dregdate") {
                temparray.push({
                  "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode],
                  "dataField": option[designProperties.VALUE], "width": "200px", "columnSize": "3"
                })
              }
            });
            if (temparray) {
              temparray.push({ "idsName": "IDS_REGISTRATIONDATE", "dataField": "dregdate", "width": "250px", "columnSize": "3" })
            }
            return temparray;

    }

    gridfillingColumnMoreItems(data) {
        
        const temparray = [];
            data && data.map((option) => {
              if (option[designProperties.VALUE] !== "dregdate") {
                temparray.push({
                  "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode],
                  "dataField": option[designProperties.VALUE], "width": "200px", "columnSize": "3"
                })
              }
            });
            if (temparray) {
              temparray.push({ "idsName": "IDS_REGISTRATIONDATE", "dataField": "dregdate", "width": "250px", "columnSize": "3" })
            }
            return temparray;
        
            }

    getApprovalVersion = (data) => {
        let inputData = [];

        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate || this.props.Login.masterData.realFromDate,
            this.props.Login.masterData.toDate || this.props.Login.masterData.realToDate, this.props.Login.userInfo);

        inputData = {
            needFilterSubmit: "false",
            nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
            fromDate: obj.fromDate,//(this.state.selectedRecord && this.state.selectedRecord["fromDate"]) || this.props.Login.masterData.fromDate,
            toDate: obj.toDate,//(this.state.selectedRecord && this.state.selectedRecord["toDate"]) || this.props.Login.masterData.toDate,
            nregtypecode: data.item.nregtypecode,
            userInfo: this.props.Login.userInfo,
            nregsubtypecode: data.item.nregsubtypecode,
            masterData: this.props.Login.masterData,
            isneedapprovalfilter: true,
            defaultRegistrationSubType: data.item,
            isneedrealFilterStatus: "false",
            // realRegTypeValue: this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue : "NA",
            // realRegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue : "NA",
            // realApproveConfigVersion: this.state.ApprovalVersionValue && this.state.ApprovalVersionValue.item || transactionStatus.NA,
            // realdefaultFilterStatus: this.props.Login.masterData.realdefaultFilterStatus ? this.props.Login.masterData.realdefaultFilterStatus : "NA",
            realRegistrationTypeList: this.props.Login.masterData.realRegistrationTypeList,
            realRegistrationSubTypeList: this.props.Login.masterData.realRegistrationSubTypeList,
            realApprovalConfigVersionList: this.props.Login.masterData.realApprovalConfigVersionList,
            realBCFilterStatusList: this.props.Login.masterData.realBCFilterStatusList,
            realRegTypeValue: this.props.Login.masterData.realRegTypeValue,
            realRegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue,
            realdefaultFilterStatus: this.props.Login.masterData.realdefaultFilterStatus,
            realApproveConfigVersion: this.props.Login.masterData.realApproveConfigVersion,
            realFromDate: this.props.Login.masterData.realFromDate,
            realToDate: this.props.Login.masterData.realToDate

        }
        this.props.getBCApprovalConfigVersion(inputData)

    }

    tabDetail = () => {
        const tabMap = new Map();
        tabMap.set("IDS_SAMPLE",
            <SampleTab
                sample={this.props.Login.masterData.Samples || []}
                dataResult={process(this.props.Login.masterData.Samples || [], this.state.sampleState)}
                dataState={this.state.sampleState}
                controlMap={this.state.controlMap}
                dataStateChange={this.dataStateChange}
                userRoleControlRights={this.state.userRoleControlRights}
                userInfo={this.props.Login.userInfo}
                deleteRecord={this.deleteRecord}
                extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem) || []}
                detailedFieldList={this.gridfillingColumnMoreItems(this.state.DynamicGridMoreItem) || []}
                methodUrl={"Samples"}
                getSamples={() => this.getSamples(this.props.Login.masterData.SelectedBatchmaster)}
                // getSamples={() => this.props.getSamplesForGrid(this.props.Login.masterData.SelectedBatchmaster.ntestcode,this.props.Login.masterData.SelectedBatchmaster.nbatchmastercode,
                //     this.props.Login.userInfo,this.props.Login.masterData,this.props.Login.masterData.defaultRegistrationType.nregtypecode,this.state.nregsubtypecode.value)}
                //inputParam={this.props.Login.inputParam}
                screenName="IDS_SAMPLE"
                nneedsubsample={this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedsubsample}
            />
        )
        tabMap.set("IDS_BATCHIQCSAMPLE",
            <BatchIqcSampleTab
                iqcsample={this.props.Login.masterData.iqcsample || []}
                dataResult={process(this.props.Login.masterData.iqcsample || [], this.state.iqcsampleState)}
                dataState={this.state.iqcsampleState}
                controlMap={this.state.controlMap}
                dataStateChange={this.dataStateBatchIqcChangeChange}
                userRoleControlRights={this.state.userRoleControlRights}
                userInfo={this.props.Login.userInfo}
                cancelRecord={this.cancelRecord}
                methodUrl={"IQCSample"}
                getIqcSamples={() => this.getIqcSamples(this.props.Login.masterData.SelectedBatchmaster)}
                screenName="IDS_BATCHIQCSAMPLE"
                nneedsubsample={this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedsubsample}
            />
        )
        //     if (this.props.Login.masterData.realdefaultFilterStatus && this.props.Login.masterData.realdefaultFilterStatus.ntransactionstatus === transactionStatus.INITIATED
        //         || this.props.Login.masterData.realdefaultFilterStatus.ntransactionstatus === transactionStatus.COMPLETED)
        if (this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus === transactionStatus.INITIATED || this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus === transactionStatus.COMPLETED) {
            tabMap.set("IDS_RESULTS",
                <BatchResultTab
                    ELNTest={this.props.Login.masterData.ELNTest || []}
                    resultview={this.props.Login.masterData.Resultview || []}
                    dataResult={process(this.props.Login.masterData.Resultview || [], this.state.viewstate)}
                    dataState={this.state.viewstate}
                    dataStateChange={this.dataStateViewChange}
                    userInfo={this.props.Login.userInfo}
                    methodUrl={"BatchViewResult"}
                    screenName="IDS_RESULTS"
                    intl={this.props.intl}
                    nneedsubsample={this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedsubsample}
                    selectedfilename={this.props.Login.masterData.SelectedBatchmaster.sbatcharno}

                />
            )
        }

        tabMap.set("IDS_BATCHHISTORY",
            <BatchhistoryTab
                batchhistory={this.props.Login.masterData.Batchhistory || []}
                dataResult={process(this.props.Login.masterData.Batchhistory || [], this.state.histortState)}
                dataState={this.state.histortState}
                dataStateChange={this.dataStateBatchHistoryChange}
                userInfo={this.props.Login.userInfo}
                methodUrl={"Batchhistory"}
                screenName="IDS_BATCHHISTORY"
                nneedsubsample={this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedsubsample}

            />
        )


        return tabMap;
    }


    onFilterComboChange = (event, fieldname) => {
        if (event !== null) {
            let inputData = [];


            if (fieldname === "fromDate") {
                let dateObj = convertDateValuetoString(event, this.props.Login.masterData.toDate, this.props.Login.userInfo)
                inputData = {
                    nflag: 2,
                    needFilterSubmit: "false",
                    fromDate: dateObj.fromDate,//this.OnDateConverstion(event, fieldname),
                    toDate: dateObj.toDate,//this.props.Login.masterData.toDate,
                    defaultRegistrationType: this.props.Login.masterData.defaultRegistrationType,
                    defaultRegistrationSubType: this.state.nregsubtypecode ? this.state.nregsubtypecode.item : transactionStatus.NA,
                    defaultSampleType: this.props.Login.masterData.defaultSampleType,
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                    nregsubtypecode: this.state.nregsubtypecode ? this.state.nregsubtypecode.item.nregsubtypecode : transactionStatus.NA,
                    ntranscode: this.state.FilterStatusValue ? this.state.FilterStatusValue.value : transactionStatus.NA,
                    //defaultRegistrationSubType: this.props.Login.masterData.defaultRegistrationSubType,
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    // realRegTypeValue: this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue : "NA",
                    // realRegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue : "NA",
                    // realApproveConfigVersion: this.state.ApprovalVersionValue && this.state.ApprovalVersionValue.item || transactionStatus.NA,
                    // realdefaultFilterStatus: this.props.Login.masterData.realdefaultFilterStatus ? this.props.Login.masterData.realdefaultFilterStatus : "NA"
                    realRegistrationTypeList: this.props.Login.masterData.realRegistrationTypeList,
                    realRegistrationSubTypeList: this.props.Login.masterData.realRegistrationSubTypeList,
                    realApprovalConfigVersionList: this.props.Login.masterData.realApprovalConfigVersionList,
                    realBCFilterStatusList: this.props.Login.masterData.realBCFilterStatusList,
                    realRegTypeValue: this.props.Login.masterData.realRegTypeValue,
                    realRegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue,
                    realdefaultFilterStatus: this.props.Login.masterData.realdefaultFilterStatus,
                    realApproveConfigVersion: this.props.Login.masterData.realApproveConfigVersion,
                    realFromDate: this.props.Login.masterData.realFromDate,
                    realToDate: this.props.Login.masterData.realToDate,
                    //ALPD-3571--Vignesh R(05-09-2024) 
                    realndesigntemplatemappingcode: this.props.Login.masterData.realndesigntemplatemappingcode,
                    napprovalversioncode: this.state.ApprovalVersionValue && this.state.ApprovalVersionValue.item.napprovalconfigversioncode || transactionStatus.NA,
                    napprovalconfigcode: this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.napprovalconfigcode || transactionStatus.NA,
                    ApprovalVersionValue: this.state.ApprovalVersionValue
                }
                this.props.getBCApprovalConfigVersion(inputData)
            }
            if (fieldname === "toDate") {

                let dateObj = convertDateValuetoString(this.props.Login.masterData.fromDate, event, this.props.Login.userInfo)

                inputData = {
                    nflag: 2,
                    needFilterSubmit: "false",
                    fromDate: dateObj.fromDate,//this.props.Login.masterData.fromDate,
                    toDate: dateObj.toDate,//this.OnDateConverstion(event, fieldname),
                    defaultRegistrationType: this.props.Login.masterData.defaultRegistrationType,
                    defaultRegistrationSubType: this.state.nregsubtypecode ? this.state.nregsubtypecode.item : transactionStatus.NA,
                    defaultSampleType: this.props.Login.masterData.defaultSampleType,
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                    nregsubtypecode: this.state.nregsubtypecode ? this.state.nregsubtypecode.item.nregsubtypecode : transactionStatus.NA,
                    ntranscode: this.state.FilterStatusValue ? this.state.FilterStatusValue.value : transactionStatus.NA,
                    //defaultRegistrationSubType: this.props.Login.masterData.defaultRegistrationSubType,
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    // realRegTypeValue: this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue : "NA",
                    // realRegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue : "NA",
                    // realApproveConfigVersion: this.state.ApprovalVersionValue && this.state.ApprovalVersionValue.item || transactionStatus.NA,
                    // realdefaultFilterStatus: this.props.Login.masterData.realdefaultFilterStatus ? this.props.Login.masterData.realdefaultFilterStatus : "NA"
                    realRegistrationTypeList: this.props.Login.masterData.realRegistrationTypeList,
                    realRegistrationSubTypeList: this.props.Login.masterData.realRegistrationSubTypeList,
                    realApprovalConfigVersionList: this.props.Login.masterData.realApprovalConfigVersionList,
                    realBCFilterStatusList: this.props.Login.masterData.realBCFilterStatusList,
                    realRegTypeValue: this.props.Login.masterData.realRegTypeValue,
                    realRegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue,
                    realdefaultFilterStatus: this.props.Login.masterData.realdefaultFilterStatus,
                    realApproveConfigVersion: this.props.Login.masterData.realApproveConfigVersion,
                    realFromDate: this.props.Login.masterData.realFromDate,
                    realToDate: this.props.Login.masterData.realToDate
                }
                this.props.getBCApprovalConfigVersion(inputData)
            }

            // let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, 
            //                  this.props.Login.masterData.toDate, this.props.Login.userInfo); 

            if (fieldname === "nsampletypecode") {

                let obj = convertDateValuetoString(this.state.selectedFilter.fromDate || this.props.Login.masterData.realFromDate,
                    this.state.selectedFilter.toDate || this.props.Login.masterData.realToDate, this.props.Login.userInfo);

                inputData = {
                    nflag: 2,
                    needFilterSubmit: "false",
                    nsampletypecode: parseInt(event.value),
                    fromDate: obj.fromDate,//(this.state.selectedRecord && this.state.selectedRecord["fromDate"]) || this.props.Login.masterData.fromDate,
                    toDate: obj.toDate,//(this.state.selectedRecord && this.state.selectedRecord["toDate"]) || this.props.Login.masterData.toDate,
                    userinfo: this.props.Login.userInfo,
                    defaultSampleType: event.item,
                    masterData: this.props.Login.masterData,
                    isneedrealFilterStatus: "false",
                    // realRegTypeValue : this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue : "NA",
                    // realRegSubTypeValue :this.props.Login.masterData.realRegSubTypeValue  ? this.props.Login.masterData.realRegSubTypeValue : "NA",
                    //  realApproveConfigVersion : this.state.ApprovalVersionValue && this.state.ApprovalVersionValue.item || transactionStatus.NA,
                    //realdefaultFilterStatus  : this.props.Login.masterData.realdefaultFilterStatus ? this.props.Login.masterData.realdefaultFilterStatus:"NA",
                    realRegistrationTypeList: this.props.Login.masterData.realRegistrationTypeList,
                    realRegistrationSubTypeList: this.props.Login.masterData.realRegistrationSubTypeList,
                    realApprovalConfigVersionList: this.props.Login.masterData.realApprovalConfigVersionList,
                    realBCFilterStatusList: this.props.Login.masterData.realBCFilterStatusList,
                    realRegTypeValue: this.props.Login.masterData.realRegTypeValue,
                    realRegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue,
                    realdefaultFilterStatus: this.props.Login.masterData.realdefaultFilterStatus,
                    realApproveConfigVersion: this.props.Login.masterData.realApproveConfigVersion
                }
                this.props.getBCRegistrationType(inputData)
            }
            else if (fieldname === "nregtypecode") {

                let obj = convertDateValuetoString(this.state.selectedFilter.fromDate || this.props.Login.masterData.realFromDate,
                    this.state.selectedFilter.toDate || this.props.Login.masterData.realToDate, this.props.Login.userInfo);


                inputData = {
                    nflag: 3,
                    needFilterSubmit: "false",
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    fromDate: obj.fromDate,//(this.state.selectedRecord && this.state.selectedRecord["fromDate"]) || this.props.Login.masterData.fromDate,
                    toDate: obj.toDate,//(this.state.selectedRecord && this.state.selectedRecord["toDate"]) || this.props.Login.masterData.toDate,
                    nregtypecode: parseInt(event.value),
                    userInfo: this.props.Login.userInfo,
                    defaultRegistrationType: event.item,
                    defaultSampleType: this.props.Login.masterData.defaultSampleType,
                    isneedrealFilterStatus: "false",
                    // realRegTypeValue : this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue : "NA",
                    // realRegSubTypeValue :this.props.Login.masterData.realRegSubTypeValue  ? this.props.Login.masterData.realRegSubTypeValue : "NA",
                    // realApproveConfigVersion : this.state.ApprovalVersionValue && this.state.ApprovalVersionValue.item || transactionStatus.NA,
                    // realdefaultFilterStatus  : this.props.Login.masterData.realdefaultFilterStatus ? this.props.Login.masterData.realdefaultFilterStatus:"NA",
                    realRegistrationTypeList: this.props.Login.masterData.realRegistrationTypeList,
                    realRegistrationSubTypeList: this.props.Login.masterData.realRegistrationSubTypeList,
                    realApprovalConfigVersionList: this.props.Login.masterData.realApprovalConfigVersionList,
                    realBCFilterStatusList: this.props.Login.masterData.realBCFilterStatusList,
                    realRegTypeValue: this.props.Login.masterData.realRegTypeValue,
                    realRegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue,
                    realdefaultFilterStatus: this.props.Login.masterData.realdefaultFilterStatus,
                    realApproveConfigVersion: this.props.Login.masterData.realApproveConfigVersion
                }
                this.props.getBCRegistrationSubType(inputData, this.props.Login.masterData)
            }
            else if (fieldname === "nregsubtypecode") {
                const nregsubtypecode = this.state;
                //this.setState({ nregsubtypecode:event });
                this.getApprovalVersion(event);

            }

            else if (fieldname === 'ndesigntemplatemappingcode') {
                let obj = convertDateValuetoString(this.props.Login.masterData.fromDate,
                    this.props.Login.masterData.toDate, this.props.Login.userInfo);

                const inputParamData = {
                    nflag: 3,
                    needFilterSubmit: "false",
                    fromdate: obj.fromDate,//this.props.Login.masterData.fromDate,
                    todate: obj.toDate,
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                    nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode),
                    napprovalversioncode: this.props.Login.masterData.ApprovalConfigVersion[0].napprovalconfigversioncode,
                    userinfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    //defaultFilterStatus: event.item,
                    defaultRegistrationSubType: this.props.Login.masterData.defaultRegistrationSubType,
                    ntranscode: String(this.props.Login.masterData.defaultFilterStatus.ntransactionstatus),
                    nneedsubsample: this.props.Login.masterData.nneedsubsample || 4,
                    // stransactionstatus: this.props.Login.masterData.defaultFilterStatus.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.defaultFilterStatus.ntransactionstatus,
                    //nsectioncode: this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") : this.props.Login.masterData.UserSectionValue.nsectioncode,
                    ndesigntemplatemappingcode: event.value,
                    DesignTemplateMappingValue: event.item,
                    isneedrealFilterStatus: "false",
                    realRegTypeValue: this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue : "NA",
                    realRegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue : "NA",
                    realApproveConfigVersion: this.state.ApprovalVersionValue && this.state.ApprovalVersionValue.item || transactionStatus.NA,
                    realdefaultFilterStatus: this.props.Login.masterData.realdefaultFilterStatus ? this.props.Login.masterData.realdefaultFilterStatus : "NA"
                }
                //this.props.getREFilterTestData(inputParamData)
                this.props.getBCFilterTemplate(inputParamData)

            }

            else if (fieldname === "version") {

                // let obj = convertDateValuetoString(this.props.Login.masterData.fromDate,
                //     this.props.Login.masterData.toDate, this.props.Login.userInfo);

                // inputData = {
                //     nflag: 4,
                //     fromdate: obj.fromDate,//this.props.Login.masterData.fromDate,
                //     todate: obj.toDate,//this.props.Login.masterData.toDate,
                //     nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                //     nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                //     nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode),
                //     napprovalversioncode: event.value,
                //     userinfo: this.props.Login.userInfo,
                //     defaultApprovalConfigVersion: event.item,
                //     masterData: this.props.Login.masterData,
                //     ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode ? this.props.Login.masterData.ndesigntemplatemappingcode : -1
                // }
                // this.props.getBCJobStatus(inputData)
                const ApprovalVersionValue = this.state;
                this.setState({ ApprovalVersionValue: event });
            }
            else if (fieldname === "jobstatus") {

                let obj = convertDateValuetoString(this.props.Login.masterData.fromDate,
                    this.props.Login.masterData.toDate, this.props.Login.userInfo);

                inputData = {
                    nflag: 5,
                    needFilterSubmit: "false",
                    fromdate: obj.fromDate,//this.props.Login.masterData.fromDate,
                    todate: obj.toDate,//this.props.Login.masterData.toDate,
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                    nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode),
                    napprovalversioncode: parseInt(this.props.Login.masterData.defaultApprovalConfigVersion.napprovalconfigversioncode),
                    njobstatuscode: event.value,
                    userinfo: this.props.Login.userInfo,
                    defaultjobstatus: event.item,
                    masterData: this.props.Login.masterData,
                    realRegTypeValue: this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue : "NA",
                    realRegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue : "NA",
                    realApproveConfigVersion: this.state.ApprovalVersionValue && this.state.ApprovalVersionValue.item || transactionStatus.NA,
                    realdefaultFilterStatus: this.props.Login.masterData.realdefaultFilterStatus ? this.props.Login.masterData.realdefaultFilterStatus : "NA"
                }
                this.props.getBCFilterStatus(inputData)
            }
            else if (fieldname === "filter") {
                const FilterStatusValue = this.state;
                this.setState({ FilterStatusValue: event });

            }
            else if (fieldname === "test") {

                const FilterStatusValue = this.state;
                this.setState({ FilterStatusValue: event });
            } else {
                const selectedRecord = this.state;
                this.setState({ selectedRecord: event });
            }
        }
    }

    handleFilterDateChange = (dateValue, dateName) => {
        const { selectedFilter } = this.state;
        if (dateValue === null) {
            dateValue = new Date();
        }
        selectedFilter[dateName] = dateValue;
        this.setState({ selectedFilter });

    }

    // headerSelectionChange = (event) => {
    //     const checked = event.syntheticEvent.target.checked;
    //     let addedComponentList = this.state.addedComponentList || [];
    //     if (checked) {
    //         const data = this.state.addComponentDataList.map(item => {
    //             if (addedComponentList.findIndex(x => x.ntransactiontestcode === item.ntransactiontestcode) === -1) {
    //                 addedComponentList.push({ ...item, selected: false });
    //                 item.selected = checked;
    //                 return item;
    //             } else {
    //                 let olditem = JSON.parse(JSON.stringify(addedComponentList[addedComponentList.findIndex(x => x.ntransactiontestcode === item.ntransactiontestcode)]))
    //                 olditem.selected = checked;
    //                 return olditem;
    //             }

    //         });


    //         this.setState({
    //             addComponentDataList: data, addedComponentList,
    //             addSelectAll: checked, deleteSelectAll: false
    //         });
    //     }
    //     else {
    //         let addedComponentData = this.state.addedComponentList || [];
    //         let deletedListdData = this.state.deletedList || [];

    //         const data = this.state.addComponentDataList.map(item => {
    //             addedComponentData = addedComponentData.filter(item1 => item1.npreregno !== item.npreregno);
    //             deletedListdData = deletedListdData.filter(item1 => item1.npreregno !== item.npreregno);
    //             item.selected = checked;
    //             return item;
    //         });

    //         // console.log("data:",data1, data2);
    //         this.setState({
    //             addComponentDataList: data, addedComponentList: addedComponentData, deletedList: deletedListdData,
    //             addSelectAll: checked, deleteSelectAll: false
    //         });
    //     }
    // }


    valiateCheckAll(data) {
        let selectAll = true;
        // let checkRepeatComponent;
        //  let addedComponentList = this.state.addedComponentList || [];
        if (data && data.length > 0) {
            data.forEach(dataItem => {
                if (dataItem.selected) {
                    if (dataItem.selected === false) {
                        selectAll = false;
                    }
                }
                else {
                    selectAll = false;
                    // checkRepeatComponent=this.state.addComponentDataList.filter(item=>item.npreregno==data.npreregno)
                    // if(checkRepeatComponent.length>0){
                    //     selectAll = true;
                    // }else{
                    //     selectAll = false;
                    // }
                }
            })
        }
        else {
            //if (gridType === "originalgrid"){
            selectAll = false;
            // }
        }
        return selectAll;
    }


    headerSelectionChange = (event) => {
        let checked = event.syntheticEvent.target.checked;
        let addedSamplesList = [];
        checked = checked == false && this.state.samples.length > 0 ? false : this.state.samples.length == 0 ? false : true
        if (checked) {
            //const data = event.dataItems.map(item => {
             //ALPD-5137--Vignesh R(20-12-2024)---Including filter in Data selection Kendo Grid
            const data = event.target.props.data.map(item => {
                if (addedSamplesList.findIndex(x => x.ntransactiontestcode === item.ntransactiontestcode) === -1) {
                    //addedSamplesList.push({ ...item, selected: false });
                    item.selected = checked;
                    let newItem = JSON.parse(JSON.stringify(item));
                    //newItem.selected = false;
                    delete newItem['selected']
                    newItem["jsondata"] = {};
                    newItem["jsonuidata"] = {};
                    newItem["jsondata"]['samplelist'] = item
                    newItem["jsonuidata"]['samplelist'] = item
                    addedSamplesList.push(newItem);
                    return item;
                } else {
                    let olditem = JSON.parse(JSON.stringify(addedSamplesList[addedSamplesList.findIndex(x => x.ntransactiontestcode === item.ntransactiontestcode)]))
                    olditem.selected = checked;
                    let newItem = JSON.parse(JSON.stringify(olditem));
                    newItem.selected = false;
                    newItem["jsondata"] = {};
                    newItem["jsonuidata"] = {};
                    newItem["jsondata"]['samplelist'] = olditem
                    newItem["jsonuidata"]['samplelist'] = olditem
                    addedSamplesList.push(newItem);
                    return olditem;

                }

            });

		    //ALPD-5137--Vignesh R(20-12-2024)---Including filter in Data selection Kendo Grid
            this.setState({
                samples: data,
                addedSamplesList: addedSamplesList,
                addComponentDataListCopy:  this.valiateCopy(this.state.addedSamplesListSortedList||[],data||[],addedSamplesList||[]),
                addSelectAll: this.valiateCheckAll(addedSamplesList),
                deleteSelectAll:this.valiateCheckAll(addedSamplesList),
                addSelectAll: checked, deleteSelectAll: false
            });
        }
        else {
            // let sampleListData = this.state.sampleList || [];
            // let deletedListdData = this.state.sampleList || [];

            let addedSamplesList = this.state.addedSamplesList || [];
            let deletedListdData = this.state.deletedList || [];

            const data = event.target.props.data.map(item => {
                addedSamplesList = addedSamplesList.filter(item1 => item1.npreregno !== item.npreregno);
                deletedListdData = deletedListdData.filter(item1 => item1.npreregno !== item.npreregno);
                item.selected = checked;
                return item;
            });

            // console.log("data:",data1, data2);
            this.setState({
                samples: data,
                addedSamplesList: addedSamplesList,
                deletedList: deletedListdData,
                addSelectAll: this.valiateCheckAll(addedSamplesList),
                deleteSelectAll: this.valiateCheckAll(addedSamplesList),
                addSelectAll: checked, deleteSelectAll: false,
                addComponentDataListCopy:  this.valiateCopy(this.state.addedSamplesListSortedList||[],data||[],addedSamplesList||[]),  

                
            });
        }

        // const data = this.state.addComponentDataList.map(item=>{
        //     if (checked){
        //         addedComponentList.push({...item, selected:false});
        //     }
        //     else{
        //         data1 = data1.filter(item1=>item1.npreregno !== item.npreregno);
        //         data2 = data2.filter(item1=>item1.npreregno !== item.npreregno);      
        //     }  
        //     item.selected = checked;
        //     return item;
        // });

    }
    /*headerSelectionChange = (event) => {
        let checked = event.syntheticEvent.target.checked;
        let sampleList = this.state.samples || [];
        let addedSamplesList = [];
        checked = checked == false && this.state.samples.length > 0 ? false : this.state.samples.length == 0 ? false : true
        if (checked) {
            //const data = event.dataItems.map(item => {
            const data = event.target.props.data.map(item => {
                if (sampleList.findIndex(x => x.ntransactiontestcode === item.ntransactiontestcode) === -1) {
                    sampleList.push({ ...item, selected: false });
                    item.selected = checked;
                    let newItem = JSON.parse(JSON.stringify(item));
                    //newItem.selected = false;
                    delete newItem['selected']
                    newItem["jsondata"] = {};
                    newItem["jsonuidata"] = {};
                    newItem["jsondata"]['samplelist'] = item
                    newItem["jsonuidata"]['samplelist'] = item
                    addedSamplesList.push(newItem);
                    return item;
                } else {
                    let olditem = JSON.parse(JSON.stringify(sampleList[sampleList.findIndex(x => x.ntransactiontestcode === item.ntransactiontestcode)]))
                    olditem.selected = checked;
                    let newItem = JSON.parse(JSON.stringify(olditem));
                    newItem.selected = false;
                    newItem["jsondata"] = {};
                    newItem["jsonuidata"] = {};
                    newItem["jsondata"]['samplelist'] = olditem
                    newItem["jsonuidata"]['samplelist'] = olditem
                    addedSamplesList.push(newItem);
                    return olditem;

                }

            });


            this.setState({
                samples: data,
                addedSamplesList: addedSamplesList,
                sampleList,
                addSelectAll: checked,
                deleteSelectAll: false
            });
        }
        else {
            // let sampleListData = this.state.sampleList || [];
            // let deletedListdData = this.state.sampleList || [];

            let sampleListData = this.state.samples || [];
            let deletedListdData = this.state.samples || [];

            const data = this.state.samples.map(item => {
                sampleListData = sampleListData.filter(item1 => item1.npreregno !== item.npreregno);
                deletedListdData = deletedListdData.filter(item1 => item1.npreregno !== item.npreregno);
                item.selected = checked;
                return item;
            });

            // console.log("data:",data1, data2);
            this.setState({
                samples: data,
                addedSamplesList: sampleListData,
                deletedList: deletedListdData,
                addSelectAll: checked,
                deleteSelectAll: false
            });
        }

        // const data = this.state.addComponentDataList.map(item=>{
        //     if (checked){
        //         addedComponentList.push({...item, selected:false});
        //     }
        //     else{
        //         data1 = data1.filter(item1=>item1.npreregno !== item.npreregno);
        //         data2 = data2.filter(item1=>item1.npreregno !== item.npreregno);      
        //     }  
        //     item.selected = checked;
        //     return item;
        // });

    }*/

    onTreeClick = (event) => {
        const inputParam = {
            methodUrl: "TestGroupSpecification",
            screenName: "IDS_REGISTRATION",
            operation: "get",
            activeKey: event.key,
            focusKey: event.key,
            keyName: "treetemplatemanipulation",
            userinfo: this.props.Login.userInfo,
            selectedNode: event.item,
            selectedRecord: this.state.selectedRecord,
            //ALPD-5873 Loadind Spec While Clicking on the Tree - Default Spec Work. Added by Abdul on 04-06-2025
            ntestgroupspecrequired: transactionStatus.YES,
            primaryKey: event.primaryKey
        };
        if (event.primaryKey !== this.state.selectedRecord["ntemplatemanipulationcode"]) {
            this.props.getNewRegSpecification(inputParam, this.props.Login.masterData);
        }
    }


  /*  selectionChange = (event) => {
        let addedSamplesList = this.state.addedSamplesList || [];
        //let addedSamplesList= [];
        let samples = this.state.samples || [];
        const samplesList = this.state.samples.map(item => {
            if (item.ntransactiontestcode === event.dataItem.ntransactiontestcode) {
                item.selected = !event.dataItem.selected;
                //  item={...item,"selected":!event.dataItem.selected};
                if (item.selected) {
                    const newItem = JSON.parse(JSON.stringify(item));
                    //newItem.selected = false;
                    delete newItem['selected']
                    newItem["jsondata"] = {};
                    newItem["jsonuidata"] = {};
                    newItem["jsondata"]['samplelist'] = item
                    newItem["jsonuidata"]['samplelist'] = item
                    addedSamplesList.push(newItem);
                }
                else {
                    // if(addedSamplesList.length === 0){
                    addedSamplesList = addedSamplesList.filter(item1 => item1.ntransactiontestcode !== item.ntransactiontestcode)
                    //   }else{
                    //     this.state.samples.map((item1,index) => { 
                    //         if(item1.ntransactiontestcode == event.dataItem.ntransactiontestcode){
                    //             if(this.state.samples.length == 1){
                    //                 addedSamplesList=[];
                    //             }else{
                    //                 const newItem = JSON.parse(JSON.stringify(item1));
                    //                 newItem.selected = false;
                    //                 newItem["jsondata"]={};
                    //                 newItem["jsonuidata"]={};
                    //                 newItem["jsondata"]['samplelist'] = item1
                    //                 newItem["jsonuidata"]['samplelist'] = item1
                    //                 //addedSamplesList.push(newItem);
                    //                 addedSamplesList = item1;
                    //             }  
                    //         }
                    //     } 
                    //   )
                }
            }
            return item;
        });
        ///samplesList = addedSamplesList;
        this.setState({
            samplesList,
            addedSamplesList,
            samples,
            initialList: addedSamplesList,
            addSelectAll: this.valiateCheckAll(samplesList),
            deleteSelectAll: this.valiateCheckAll(samplesList)
        });
    }*/


   //ALPD-5137--Vignesh R(20-12-2024)---Including filter in Data selection Kendo Grid
selectionChange = (event) => {
    let addedSamplesList = this.state.addedSamplesList || [];
    //let addedSamplesList= [];
    //let samples = this.state.samples || [];
    const samplesList = this.state.samples.map(item => {
        if (item.ntransactiontestcode === event.dataItem.ntransactiontestcode) {
           item.selected = !event.dataItem.selected;
          //  item={...item,"selected":!event.dataItem.selected};
            if (item.selected) {
                const newItem = JSON.parse(JSON.stringify(item));
                //newItem.selected = false;
                delete newItem['selected']
                //newItem["selected"]=item.selected;
                newItem["jsondata"] = {};
                newItem["jsonuidata"] = {};
                newItem["jsondata"]['samplelist'] = item
                newItem["jsonuidata"]['samplelist'] = item
                addedSamplesList.push(newItem);
            }
            else {
                addedSamplesList = addedSamplesList.filter(item1 => item1.ntransactiontestcode !== item.ntransactiontestcode)
                
            }
        }
        return item;
    });
    ///samplesList = addedSamplesList;
    this.setState({
      addSelectAll: this.valiateCheckAll(this.state.dataState && this.state.dataState.filter 
                  && this.state.dataState.filter !== null && this.state.dataState.filter!==undefined
               ? process(samplesList || [], this.state.dataState).data : samplesList),
               samples:samplesList, addedSamplesList,
            //addSelectAll: this.valiateCheckAll(addComponentDataList),
            deleteSelectAll: this.valiateCheckAll(addedSamplesList),
            addComponentDataListCopy:this.valiateCopy(this.state.addedSamplesListSortedList||[],samplesList||[],addedSamplesList||[])
    });
}

    //ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid

    childDataChange = (addedSamplesListSortedList) => {
        this.setState({
            addedSamplesListSortedList: addedSamplesListSortedList,
            isInitialRender: false
        });
    }
    handleSaveClick = (saveType) => {
        const failedControls = [];
        const startLabel = [];
        let label = "IDS_ENTER";
        let mandatoryFields = [];
        let selectedRecord = this.state.selectedRecord;
        console.log("handle save:", selectedRecord);
        mandatoryFields = [
            { "idsName": "IDS_SPECIFICATION", "dataField": "nallottedspeccode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" },
        ]
        let selectedSpec = this.props.Login.selectedSpec;

        if (selectedRecord && selectedRecord.nallottedspeccode !== "") {
            selectedSpec["nallottedspeccode"] = this.state.selectedRecord["nallottedspeccode"];
            selectedSpec["sversion"] = this.state.selectedRecord["sversion"];
            selectedSpec["ntemplatemanipulationcode"] = this.state.selectedRecord["ntemplatemanipulationcode"];
            
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadSpec: false,
                    selectedSpec,
                    //ALPD-5873 For Setting Active Key, Focus Key for Default Spec Work. Added by Abdul on 04-06-2025
                    ActiveKey:this.props.Login.SelectedActiveKey,
                    FocusKey:this.props.Login.SelectedFocusKey,
                    openModal: true,
                    openSpecModal: false
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }));
        }

    }

    
    //ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid
    shouldComponentUpdate(nextProps, nextState) {
        if ((this.props.Login.openModal || this.props.Login.openChildModal) && nextState.isInitialRender === false &&
            (nextState.addedSamplesListSortedList !== this.state.addedSamplesListSortedList)) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        let reportActionList = [];
        let batchMandatoryFields = [];
        const mandatoryFieldsFilter = [{ "mandatory": true, "idsName": "IDS_FILTERNAME", "dataField": "sfiltername", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]

        //commenting as its done in below code by rukshana
        // if (this.props.Login.operation === "update") {
        //     batchMandatoryFields.push(

        //         { idsName: "IDS_INSTRUMENTCATEGORY", dataField: "sinstrumentcatname", mandatoryLabel: "IDS_SELECT", controlType: "selectbox" },
        //         { idsName: "IDS_INSTRUMENT", dataField: "sinstrumentname", mandatoryLabel: "IDS_SELECT", controlType: "selectbox" },
        //         { idsName: "IDS_INSTRUMENTID", dataField: "sinstrumentid", mandatoryLabel: "IDS_SELECT", controlType: "selectbox" },
        //         { idsName: "IDS_PRODUCT", dataField: "sproductname", mandatoryLabel: "IDS_SELECT", controlType: "selectbox" }
        //     );

        // }
        // else {
        //     batchMandatoryFields.push(
        //         { idsName: "IDS_SECTION", dataField: "ssectionname", mandatoryLabel: "IDS_SELECT", controlType: "selectbox" },
        //         { idsName: "IDS_TEST", dataField: "stestname", mandatoryLabel: "IDS_SELECT", controlType: "selectbox" },
        //         { idsName: "IDS_INSTRUMENTCATEGORY", dataField: "sinstrumentcatname", mandatoryLabel: "IDS_SELECT", controlType: "selectbox" },
        //         { idsName: "IDS_INSTRUMENT", dataField: "sinstrumentname", mandatoryLabel: "IDS_SELECT", controlType: "selectbox" },
        //         { idsName: "IDS_INSTRUMENTID", dataField: "sinstrumentid", mandatoryLabel: "IDS_SELECT", controlType: "selectbox" },
        //         { idsName: "IDS_PRODUCT", dataField: "sproductname", mandatoryLabel: "IDS_SELECT", controlType: "selectbox" }
        //     );
        // }
        //let mandatoryFields =[];
        if (this.props.Login.operation === "create" || this.props.Login.operation === "update") {
            let { selectedRecord } = this.state;
            batchMandatoryFields.push(
                { "idsName": "IDS_SECTION", "dataField": "ssectionname", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_TEST", "dataField": "stestname", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                //{ "idsName": "IDS_INSTRUMENTCATEGORY", "dataField": "sinstrumentcatname", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
                // { "idsName": "IDS_INSTRUMENT", "dataField": "sinstrumentname", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
                // { "idsName": "IDS_INSTRUMENTID", "dataField": "sinstrumentid", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_PRODUCT", "dataField": "sproductname", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            );

            if (selectedRecord && selectedRecord.sinstrumentcatname !== undefined && selectedRecord.ninstrumentcatcode > 0) {
                batchMandatoryFields.push(
                    // { "idsName": "IDS_INSTRUMENTCATEGORY", "dataField": "sinstrumentcatname", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_INSTRUMENT", "dataField": "sinstrumentname", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_INSTRUMENTID", "dataField": "sinstrumentid", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                )
            }
        }
        const getBatch = {
            screenName: "IDS_BATCHCREATION",
            operation: "get",
            masterData: this.props.Login.masterData,
            userInfo: this.props.Login.userInfo, methodUrl: "Batchcreation", keyName: "batchcreation"
        };
        this.fromDate = (this.state.selectedFilter["fromdate"] && this.state.selectedFilter["fromdate"]) || this.props.Login.masterData && this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : undefined;
        this.toDate = (this.state.selectedFilter["todate"] && this.state.selectedFilter["todate"]) || this.props.Login.masterData && this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : undefined;
        const addId = this.state.controlMap.has("AddBatchCreation") && this.state.controlMap.get("AddBatchCreation").ncontrolcode;
        const editId = this.state.controlMap.has("EditBatchcreation") && this.state.controlMap.get("EditBatchcreation").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteBatchcreation") && this.state.controlMap.get("DeleteBatchcreation").ncontrolcode;
        const testStartId = this.state.controlMap.has("BatchInitiate") && this.state.controlMap.get("BatchInitiate").ncontrolcode;
        const completeId = this.state.controlMap.has("BatchComplete") && this.state.controlMap.get("BatchComplete").ncontrolcode;
        const cancelId = this.state.controlMap.has("CancelBatch") && this.state.controlMap.get("CancelBatch").ncontrolcode;
        const elnSheetId = this.state.controlMap.has("ELNSheet") && this.state.controlMap.get("ELNSheet").ncontrolcode;
        const filterNameId = this.state.controlMap.has("FilterName") ? this.state.controlMap.get("FilterName").ncontrolcode : -1;
        const filterDetailId = this.state.controlMap.has("FilterDetail") ? this.state.controlMap.get("FilterDetail").ncontrolcode : -1;

        const addParam = {
            screenName: "IDS_BATCHCREATION",
            primaryeyField: "nreleasebatchcode",
            primaryKeyValue: undefined,
            operation: "create",
            //inputParam: this.props.Login.inputParam,
            userInfo: this.props.Login.userInfo,
            ncontrolCode: addId,
            nneedtestinitiate: this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedtestinitiate,
            masterData: this.props.Login.masterData,
            fromdate: this.props.Login.masterData.fromDate,
            todate: this.props.Login.masterData.toDate,
            nregtypecode: this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA,
            napprovalconfigcode: this.state.ApprovalVersionValue && this.state.ApprovalVersionValue.item || transactionStatus.NA,
            ntranscode: this.props.Login.masterData.realdefaultFilterStatus ? this.props.Login.masterData.realdefaultFilterStatus.ntransactionstatus : transactionStatus.NA,
            ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode,
        };

        const viewInfoFields = [];

        viewInfoFields.push(
            { "fieldName": "sbatcharno", "label": "IDS_BATCHARNO" },
            { "fieldName": "ssectionname", "label": "IDS_SECTION" },
            { "fieldName": "stestname", "label": "IDS_TESTNAME" },
            { "fieldName": "sinstrumentcatname", "label": "IDS_INSTRUMENTCATEGORY" },
            { "fieldName": "sinstrumentid", "label": "IDS_INSTRUMENTID" },
            { "fieldName": "sinstrumentname", "label": "IDS_INSTRUMENTNAME" },
            { "fieldName": "sproductname", "label": "IDS_SAMPLETYPE" },
            { "fieldName": "stransdisplaystatus", "label": "IDS_STATUS" },
            {
                "fieldName": "username", "label":
                    this.props.Login.masterData.SelectedBatchmaster && this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus === transactionStatus.INITIATED ? "IDS_BATCHINITIATEDBY" :
                        this.props.Login.masterData.SelectedBatchmaster && this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus === transactionStatus.COMPLETED ? "IDS_BATCHCOMPLETEDBY"
                            : "IDS_BATCHCREATEDBY"
            }
        );

        if (this.props.Login.masterData.realSampleTypeValue &&
            this.props.Login.masterData.realSampleTypeValue.nsampletypecode === SampleType.PROJECTSAMPLETYPE) {
            viewInfoFields.push(
                { "fieldName": "sprojectcode", "label": "IDS_PROJECTCODE" },
            )
        }





        let stransactionstatuscode = this.props.Login.masterData.SelectedFilterStatus ? String(this.props.Login.masterData.SelectedFilterStatus.ntransactionstatus) : null;

        if (this.state.selectedRecord && this.state.selectedRecord["nfiltertransstatus"] !== undefined) {
            stransactionstatuscode = this.state.selectedRecord["nfiltertransstatus"].value === String(0) ? null : String(this.state.selectedRecord["nfiltertransstatus"].value);
        }


        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate,
            this.props.Login.userInfo);

        const editParam = {
            screenName: "IDS_BATCHCREATION",
            operation: "update",
            primaryKeyField: "nbatchmastercode",
            inputParam: this.props.Login.inputParam,
            userInfo: this.props.Login.userInfo,
            ncontrolCode: editId,
            masterData: this.props.Login.masterData,
            naddcontrolCode: addId,
            nprojectmastercode: this.props.Login.masterData.selectedTestSynonym && this.props.Login.masterData.selectedTestSynonym.nprojectmastercode,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue ?
                this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue ?
                this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode ?
                this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA
        };


        const filterParam = {
            inputListName: "Batchmaster",
            selectedObject: "SelectedBatchmaster",
            primaryKeyField: "nbatchmastercode",
            fetchUrl: "batchcreation/getActiveSelectedBatchmaster",

            fecthInputObject: {
                fromDate: obj.fromDate,
                toDate: obj.toDate,
                userInfo: this.props.Login.userInfo,
                ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode,
                napprovalconfigcode: this.state.ApprovalVersionValue ? this.state.ApprovalVersionValue.item.napprovalconfigcode : transactionStatus.NA,
                ntranscode: this.state.FilterStatusValue ? this.state.FilterStatusValue.value : transactionStatus.DRAFT,
                nsampletypecode: this.props.Login.masterData.defaultSampleType ? this.props.Login.masterData.defaultSampleType.nsampletypecode : transactionStatus.NA,
                //fromDate, toDate, 
                //stransactionstatuscode,
                //activeBCTab: this.props.Login.activeBCTab || "IDS_COMPONENT"
            },
            masterData: this.props.Login.masterData,
            //unchangeList: ["FromDate", "ToDate", "SelectedFilterStatus"],
            searchFieldList: this.searchFieldList
        }

        this.breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": obj.breadCrumbFrom
            }, {
                "label": "IDS_TO",
                "value": obj.breadCrumbto
            },
            // {
            //     "label": "IDS_SAMPLETYPE",
            //     "value": this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.ssampletypename ? this.props.Login.masterData.realSampleTypeValue.ssampletypename : "Product"
            // }, 
            {
                "label": "IDS_REGISTRATIONTYPE",
                "value": this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.sregtypename ? this.props.Login.masterData.realRegTypeValue.sregtypename : "NA"
                // "value": this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.sregtypename || "NA" :
                // this.props.Login.masterData.defaultRegistrationType ? this.props.Login.masterData.defaultRegistrationType.sregtypename || "NA" : "NA"
            },
            {
                "label": "IDS_REGISTRATIONSUBTYPE",
                "value": this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.sregsubtypename ? this.props.Login.masterData.realRegSubTypeValue.sregsubtypename : "NA"
            },
            {
                "label": "IDS_BATCHSTATUS",
                "value": this.props.Login.masterData.realdefaultFilterStatus && this.props.Login.masterData.realdefaultFilterStatus.sfilterstatus ? this.props.Login.masterData.realdefaultFilterStatus.sfilterstatus : "NA"
            }
            // {
            //     "label": "IDS_CONFIGVERSION",
            //     "value": this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.sversionname ? this.props.Login.masterData.realApproveConfigVersion.sversionname : "NA"
            // }
        ]

        return (
            <>
                {/* Start of get display*/}
                {/* <div className="client-listing-wrap mtop-4 mtop-fixed-breadcrumb"> */}
                {/* <ListWrapper className="client-listing-wrap mtop-4 screen-height-window"> */}
                {/* <ListWrapper className="client-listing-wrap toolbar-top-wrap mtop-4 screen-height-window"> */}
                {/* <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd"> */}
                {/* //</><div className="client-listing-wrap mtop-4"> */}
                
                <div className="client-listing-wrap new-breadcrumb toolbar-top-wrap mtop-4 screen-height-window">
                    <Affix top={53}>
                        <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} />
                    </Affix>
                    
                    <div className='fixed-buttons'> 
                        <Nav.Link //ALPD-4999 Add filter name and filter details button,done by Dhanushya RI
                     className="btn btn-circle outline-grey ml-2"
                      data-tip={this.props.intl.formatMessage({ id: "IDS_SAVEFILTER" })}
                                                            // data-for="tooltip-common-wrap"
                       hidden={this.state.userRoleControlRights.indexOf(filterNameId) === -1}
                        onClick={() => this.openFilterName(filterNameId)}>
                       {/* <DownloadReportbutton width='20px' height='20px' className='custom_icons' /> */}
                       <SaveIcon width='20px' height='20px' className='custom_icons' />
                     </Nav.Link>
                     {
                         this.state.userRoleControlRights.indexOf(filterDetailId) !== -1 &&
                         this.props.Login.masterData && this.props.Login.masterData.FilterName !== undefined && this.props.Login.masterData.FilterName.length > 0 ?
                                                            <CustomPopover
                                                                icon={faBolt}
                                                                nav={true}
                                                                data={this.props.Login.masterData.FilterName}
                                                                btnClasses="btn-circle btn_grey ml-2 spacesremovefromaction"
                                                                //dynamicButton={(value) => this.props.getAcceptTestTestWise(value,testGetParam,this.props.Login.masterData.MJSelectedTest,this.props.Login.userInfo)}
                                                                dynamicButton={(value) => this.clickFilterDetail(value)}
                                                                textKey="sfiltername"
                                                                iconKey="nfiltercode"
                                                            >
                                                            </CustomPopover>
                                                            : ""
                                                            }
                    </div>
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}>
                            {/* ALPD-5564 - null check for batchmaster is done by Gowtham R - RunBatch -> In Filter set To-Date as previous day and create new batch -> existing selected batch is duplicated.
                            <ListMaster
                                masterList={this.props.Login.masterData.searchedData || (this.props.Login.masterData.Batchmaster || [])}
                                selectedMaster={this.props.Login.masterData.SelectedBatchmaster} */}
                            <ListMaster
                                masterList={this.props.Login.masterData.searchedData || (this.props.Login.masterData.Batchmaster && this.props.Login.masterData.Batchmaster[0] ? this.props.Login.masterData.Batchmaster : [])}
                                selectedMaster={this.props.Login.masterData.SelectedBatchmaster || []}
                                primaryKeyField="nbatchmastercode"
                                userInfo={this.props.Login.userInfo}
                                masterData={this.props.Login.masterData}
                                //getMasterDetail={this.props.getSelectedBatchCreationDetail}
                                getMasterDetail={(batch) => this.props.getSelectedBatchCreationDetail(batch, this.props.Login.userInfo, this.props.Login.masterData)}
                                inputParam={getBatch}
                                screenName={this.props.intl.formatMessage({ id: "IDS_BATCHCREATION" })}
                                //mainField="stestname"
                                mainField="sbatcharno"
                                firstField="stestname"
                                secondField="sinstrumentname"
                                selectedListName="SelectedBatchmaster"
                                objectName="BatchCreation"
                                listName="IDS_BATCHCREATION"
                                needValidation={false}
                                hidePaging={false}
                                // subFields={
                                //     [
                                //         { [designProperties.VALUE]: "sinstrumentcatname" },
                                //         { [designProperties.VALUE]: "sinstrumentname" },
                                //         // { [designProperties.VALUE]: "smahname" },
                                //         // { [designProperties.VALUE]: "stransactionstatus", [designProperties.COLOUR]: "transstatuscolor" }
                                //     ]
                                // }
                                needFilter={true}
                                needMultiSelect={false}
                                subFieldsLabel={true}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}
                                filterColumnData={this.props.filterColumnData}
                                searchListName="searchedData"
                                searchRef={this.searchRef}
                                filterParam={filterParam}
                                isClearSearch={this.props.Login.isClearSearch}
                                // skip={this.state.skip}
                                // take={this.state.take}
                                // handlePageChange={this.handlePageChange}
                                addId={addId}
                                showFilterIcon={true}
                                userRoleControlRights={this.state.userRoleControlRights}
                                reloadData={this.reloadData}
                                openModal={() => this.createBatchValidation(addParam)}
                                callCloseFunction={true}
                                // openModal={() => this.props.getTestInstrumentComboService(addParam)}
                                commonActions={
                                    // <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}>
                                    <ProductList className="d-flex product-category float-right">
                                        {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                        <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                            data-for="tooltip-common-wrap"
                                            hidden={this.state.userRoleControlRights.indexOf(addId) === -1}
                                            onClick={() => this.props.getTestInstrumentComboService(addParam)}
                                        // onClick={() => this.createBatchValidation(addParam)}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </Button>
                                        <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                            data-for="tooltip-common-wrap"
                                        //onClick={() => this.reloadData(false)} 
                                        >
                                            <RefreshIcon className='custom_icons' />
                                        </Button>

                                    </ProductList>
                                    // </Tooltip>
                                }
                                filterComponent={[
                                    {
                                        "IDS_FILTER": <BatchCreationFilter
                                            fromDate={this.props.Login.masterData && this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()}
                                            toDate={this.props.Login.masterData && this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()}
                                            SampleType={this.state.SampleType || []}
                                            SampleTypeValue={this.props.Login.masterData.defaultSampleType || []}
                                            RegType={this.state.RegistrationType || []}
                                            RegTypeValue={this.props.Login.masterData.defaultRegistrationType || []}
                                            RegSubType={this.state.RegistrationSubType || []}
                                            RegSubTypeValue={this.state.nregsubtypecode || []}
                                            DesignTemplateMappingValue={this.props.Login.masterData.DesignTemplateMappingValue || []}
                                            FilterStatus={this.state.BCFilterStatus || []}
                                            FilterStatusValue={this.state.FilterStatusValue || []}
                                            ApprovalVersion={this.state.ApprovalConfigVersion || []}
                                            ApprovalVersionValue={this.state.ApprovalVersionValue || []}
                                            REJobStatus={this.state.REJobStatus || []}
                                            JobStatusValue={this.props.Login.masterData.defaultjobstatus || []}
                                            Test={this.state.Testvalues || []}
                                            TestValue={this.props.Login.masterData.selectedTestSynonym || []}
                                            onFilterComboChange={this.onFilterComboChange}
                                            handleDateChange={this.handleDateChange}
                                            handleFilterDateChange={this.handleFilterDateChange}
                                            userInfo={this.props.Login.userInfo}
                                            onDesignTemplateChange={this.onDesignTemplateChange}
                                            DynamicDesignMapping={this.state.stateDynamicDesign || []}
                                        />
                                    }
                                ]}
                            />
                        </Col>
                        <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
                            <div className="sidebar-view-btn-block">
                                <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                                    {!this.props.sidebarview ?
                                        <i class="fa fa-less-than"></i> :
                                        <i class="fa fa-greater-than"></i>
                                    }
                                </div>
                            </div>
                            {/* <Row> */}
                            {/* <Col md={12}> */}
                            <ContentPanel className="panel-main-content">
                                <Card className="border-0">
                                    {this.props.Login.masterData.Batchmaster && this.props.Login.masterData.Batchmaster.length > 0
                                        && this.props.Login.masterData.SelectedBatchmaster ?
                                        <>
                                            <Card.Header>
                                                <Card.Title className="product-title-main">
                                                    {this.props.Login.masterData.SelectedBatchmaster.sbatcharno}
                                                </Card.Title>
                                                <Card.Subtitle>
                                                    <div className="d-flex product-category">
                                                        <h2 className="product-title-sub flex-grow-1">
                                                            {
                                                                this.props.Login.masterData.SelectedBatchTestTAT && this.props.Login.masterData.SelectedBatchTestTAT.Deviation && this.props.intl.formatMessage({ id: "IDS_DEVIATION" }) + " : " + this.props.Login.masterData.SelectedBatchTestTAT.Deviation
                                                            }

                                                            <MediaLabel className={`btn btn-outlined ${this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus == transactionStatus.INITIATED ? "outline-initiate"
                                                                : this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus == transactionStatus.COMPLETED ? "outline-success"
                                                                    : this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus == transactionStatus.CANCELLED ? "outline-danger"
                                                                        : "outline-secondary"} btn-sm ml-3`}>
                                                                {this.props.Login.masterData.SelectedBatchmaster.stransdisplaystatus}
                                                            </MediaLabel>
                                                        </h2>
                                                        {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                        <div className="d-inline">

                                                            {/* <Nav.Link name="view" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_BATCHTAT" })}
                                                                            // hidden={this.props.userRoleControlRights.indexOf(this.props.viewVersionId) === -1}
                                                                            onClick={() => this.props.batchTAT(this.props.Login.masterData.SelectedBatchmaster.nbatchmastercode,this.props.Login.userInfo,this.props.Login.masterData)}
                                                                            >
                                                                            <FontAwesomeIcon icon={faEye} />
                                                                        </Nav.Link>      */}

                                                            <Nav.Link name="openelnsheet" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(elnSheetId) === -1}
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_OPENELNSHEET" })}
                                                            //onClick={() => this.ConfirmDelete( this.props.Login.masterData.SelectedBatchmaster,deleteId,"delete")}                                
                                                            >
                                                                <Image src={elnimage} alt="filer-icon action-icons-wrap"
                                                                    width="20" height="20" className="ActionIconColor img-normalize"
                                                                    onClick={() => this.openClosePortal(this.props.Login.masterData.SelectedBatchmaster, cancelId)}
                                                                    data-place="left"
                                                                />
                                                            </Nav.Link>

                                                            <Nav.Link name="view" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_VIEWINFO" })}
                                                                // hidden={this.props.userRoleControlRights.indexOf(this.props.viewVersionId) === -1}
                                                                onClick={() => this.props.viewInfo(this.props.Login.masterData.SelectedBatchmaster.nbatchmastercode, this.props.Login.userInfo, this.props.Login.masterData)}
                                                            >
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </Nav.Link>

                                                            <Nav.Link name="editBatchCreation"
                                                                hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                className="btn btn-circle outline-grey mr-2"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                onClick={() => this.fetchEditData(editParam)}
                                                            // onClick={() => this.props.getActiveBatchCreationService(editParam,
                                                            //     this.props.Login.masterData.SelectedBatchmaster.nbatchmastercode,this.props.Login.masterData.SelectedBatchmaster.ntestcode)}
                                                            >
                                                                <FontAwesomeIcon icon={faPencilAlt}
                                                                //  title={this.props.intl.formatMessage({ id: "IDS_EDITBATCH" })}
                                                                />
                                                            </Nav.Link>
                                                            {
                                                                // this.props.Login.masterData && this.props.Login.masterData.nneedtestinitiate == true ?
                                                                <Nav.Link name="initiateBatchCreation"                                                        //  data-for="tooltip-common-wrap" 
                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_BATCHINITIATE" })}
                                                                    hidden={this.state.userRoleControlRights.indexOf(testStartId) === -1}
                                                                    className="btn btn-circle outline-grey mr-2"
                                                                    //role="button"
                                                                    onClick={() => this.testPopUpStartActions(testStartId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faPlay}
                                                                    />
                                                                    {/* </FontIconWrap>  */}
                                                                </Nav.Link>
                                                                // :""
                                                            }

                                                            <Nav.Link name="completeBatchCreation"
                                                                hidden={this.state.userRoleControlRights.indexOf(completeId) === -1}
                                                                className="btn btn-circle outline-grey mr-2"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_COMPLETE" })}
                                                                onClick={() => this.completePopUpStartActions(completeId)}
                                                            //onClick={() => this.batchCompleteActions(this.props.Login.masterData.SelectedBatchmaster,completeId)}
                                                            // onClick={() => this.props.validateBatchComplete({
                                                            //     masterData: this.props.Login.masterData,
                                                            //     userInfo: this.props.Login.userInfo,
                                                            //     userRoleControlRights: this.props.Login.userRoleControlRights,
                                                            //     ncontrolCode: completeId,
                                                            //     nreleasebatchcode: this.props.Login.masterData.SelectedBatchCreation.nreleasebatchcode
                                                            // })}
                                                            >
                                                                <FontAwesomeIcon icon={faCheckCircle}
                                                                // title={this.props.intl.formatMessage({ id: "IDS_COMPLETEBATCH" })}
                                                                />
                                                            </Nav.Link>

                                                            <Nav.Link name="deleteBatchCreation" className="btn btn-circle outline-grey mr-2"
                                                                hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                onClick={() => this.ConfirmDelete(this.props.Login.masterData.SelectedBatchmaster, deleteId, "delete")}

                                                            >
                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                            </Nav.Link>


                                                            <Nav.Link name="deleteBatchCreation" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(cancelId) === -1}
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                            //onClick={() => this.ConfirmDelete( this.props.Login.masterData.SelectedBatchmaster,deleteId,"delete")}                                
                                                            >
                                                                <Image src={reject} alt="filer-icon action-icons-wrap"
                                                                    width="20" height="20" className="ActionIconColor img-normalize"
                                                                    onClick={() => this.cancelBatch(this.props.Login.masterData.SelectedBatchmaster, cancelId)}
                                                                    data-place="left"
                                                                />
                                                            </Nav.Link>

                                                            {reportActionList.length > 0 ?
                                                                <CustomPopover
                                                                    nav={true}
                                                                    data={reportActionList}
                                                                    Button={true}
                                                                    hideIcon={true}
                                                                    btnClasses="btn-circle btn_grey ml-2"
                                                                    textKey="value"
                                                                    dynamicButton={(value) => this.reportMethod(value)}
                                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                                />
                                                                :
                                                                ""}

                                                        </div>
                                                        {/* </Tooltip> */}
                                                    </div>

                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row className="no-gutters">
                                                    <Col md={12}>
                                                        <Card className="at-tabs">
                                                            <CustomTab
                                                                activeKey={this.props.Login.batchactiveKey ? this.props.Login.batchactiveKey : "IDS_SAMPLE"}
                                                                tabDetail={this.tabDetail()} onTabChange={this.onTabChange}
                                                            />
                                                        </Card>
                                                    </Col>
                                                </Row>
                                                {/* <CustomTab 
                                                            activeKey={this.props.Login.activeKey ? this.props.Login.activeKey : "IDS_SAMPLE"}
                                                            tabDetail={this.tabDetail()} onTabChange={this.onTabChange} /> */}
                                            </Card.Body>
                                        </>
                                        : ""
                                    }
                                </Card>
                            </ContentPanel>
                            {/* </Col> */}
                            {/* </Row> */}
                        </Col>
                    </Row>
                </div>

                <PortalModal>
                    <div>
                        <Modal
                            centered
                            scrollable
                            bsPrefix="model model_zindex"
                            show={this.props.Login.openELNSheet}
                            // show={this.state.openELNSheet}
                            onHide={this.openClosePortal}
                            dialogClassName={`${this.props.nflag && this.props.nflag === 2 ? 'alert-popup' : ''} modal-fullscreen`}
                            backdrop="static"
                            keyboard={false}
                            enforceFocus={false}
                            aria-labelledby="example-custom-modal-styling-title"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title style={{ "line-height": "1.0" }} id="example-custom-modal-styling-title">
                                    {this.props.intl.formatMessage({ id: "IDS_ELNSHEET" })}
                                </Modal.Title>
                                <ReactTooltip globalEventOff="true" />

                            </Modal.Header>
                            <Modal.Body>
                                <div className="modal-inner-content">
                                    {/* <Iframe url={this.state.enlLink} */}
                                    <Iframe
                                        // url={"http://agl69:8080/QuaLISWeb/#/login"}
                                        url={this.props.Login.masterData.enlLink}
                                        width="98%"
                                        height="1000px"
                                        id="reportviewID"
                                        className="reportview"
                                    //display="initial"
                                    /// position="relative" 
                                    />
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>
                </PortalModal>
                {/* </ListWrapper> */}

                {/* End of get display*/}

                {/* Start of Modal Sideout for User Creation */}
                {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
                {
                    this.props.Login.openModal ?
                        <SlideOutModal
                            show={this.props.Login.openModal}
                            size={this.props.Login.operation === "createSample"?"xl":"lg"}                            closeModal={this.closeModal}
                            operation={this.props.Login.operation}
                            inputParam={this.props.Login.inputParam}
                            screenName={this.props.Login.operation === "createSample" ? this.props.intl.formatMessage({ id: "IDS_SAMPLE" })
                                : this.props.Login.operation === "initiate" || this.props.Login.operation === "view" || this.props.Login.operation === "complete" ? this.props.intl.formatMessage({ id: "IDS_BATCH" })
                                    : this.props.Login.operation === "createiqcsample" ? this.props.intl.formatMessage({ id: "IDS_BATCHIQCSAMPLE" })
                                        : this.props.Login.screenName}
                            onSaveClick={this.onSaveClick}
                            esign={this.props.Login.loadEsign}
                            validateEsign={this.validateEsign}
                            masterStatus={this.props.Login.masterStatus}
                            updateStore={this.props.updateStore}
                            selectedRecord={this.state.selectedRecord || {}}
                            mandatoryFields={this.props.Login.operation === "create" || this.props.Login.operation === "update" ?
                                batchMandatoryFields
                                //  : this.props.Login.operation === "initiate"  ?
                                //    this.initiateMandatoryFields 
                                //  : this.props.Login.operation === "complete" ?
                                //    this.completeMandatoryFields
                                : this.props.Login.operation === "createiqcsample" ?
                                    this.materialIqcMandatory
                                    : []
                            }
                            showSaveContinue={this.state.showSaveContinue}
                            noSave={this.props.Login.operation === "view" ? true : false}
                            addComponent={this.props.Login.loadEsign ?
                                <Esign operation={this.props.Login.operation}
                                    onInputOnChange={this.onInputOnChange}
                                    inputParam={this.props.Login.inputParam}
                                    selectedRecord={this.state.selectedRecord || {}}
                                />
                                : this.props.Login.operation === "create" || this.props.Login.operation === "update" ?
                                    <AddBatchCreation
                                        selectedRecord={this.state.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        onComboChange={this.onComboChange}
                                        onNumericInputOnChange={this.onNumericInputOnChange}
                                        handleDateChange={this.handleDateChange}
                                        sampleType={this.props.Login.masterData.realSampleTypeValue ?
                                            this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA}
                                        Test={this.state.Testvalues || []}
                                        selectedInstrumentCategory={this.state.selectedInstCategory}
                                        InstrumentCategory={this.state.InstrumentCategory}
                                        Instrument={this.state.Instrument}
                                        selectedInstrument={this.state.selectedInstrument}
                                        productCategory={this.state.ProductCategory}
                                        selectedProductCategory={this.state.selectedProductCategory}
                                        TestValue={this.state.selectedTestSynonym || []}
                                        product={this.state.Product || []}
                                        instrumentID={this.state.InstrumentID || []}
                                        selectedProduct={this.state.selectedProduct || []}
                                        studyPlanList={this.props.Login.studyPlanList || []}
                                        manufacturerList={this.props.Login.productManufacturerList || []}
                                        maHolderList={this.props.Login.maHolderList || []}
                                        timeZoneList={this.props.Login.timeZoneList || []}
                                        selectedBacthCreation={this.props.Login.masterData.SelectedBatchmaster || {}}
                                        operation={this.props.Login.operation}
                                        inputParam={this.props.Login.inputParam}
                                        userInfo={this.props.Login.userInfo}
                                        selectedInstrumentId={this.state.selectedInstrumentId}
                                        onMultiColumnValue={this.onMultiColumnValue}
                                        onMultiColumnMAHChange={this.onMultiColumnMAHChange}
                                        batchCreationEditStatusList={this.props.Login.batchCreationEditStatusList}
                                        Section={this.state.Section}
                                        selectedSection={this.state.selectedSection}
                                        ProjectCode={this.state.ProjectCode}
                                        selectedProjectcode={this.state.selectedProjectcode}
                                    />
                                    : this.props.Login.operation === "createSample" ?
                                        <AddSample
                                         //ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid
                                         childDataChange={this.childDataChange}
                                         //dataStateChangeBatchSample={this.dataStateChangeBatchSample}
                                        // addSaveDataGrid={this.addSaveDataGrid}
                                         //handleClickDelete={this.handleClickDelete}
                                         addedSamplesListSortedList={this.state.addedSamplesListSortedList ||[]}                                            onInputOnChange={this.onInputOnChange}
                                            getProductByCategory={this.getProductByCategory}
                                            onComboChange={this.onComboChange}
                                            handleDateChange={this.handleDateChange}
                                            userInfo={this.props.Login.userInfo}
                                            productCategoryList={this.props.productCategoryList}
                                            productList={this.props.productList}
                                            componentList={this.props.componentList}
                                            getDataForAddComponent={this.getDataForAddComponent}
                                            clearComponentInput={this.props.clearComponentInput}
                                            samples={this.state.samples || []}
                                            headerSelectionChange={this.headerSelectionChange}
                                            selectionChange={this.selectionChange}
                                            addedComponentList={this.state.addedComponentList || []}
                                            addedHeaderSelectionChange={this.addedHeaderSelectionChange}
                                            addedSelectionChange={this.addedSelectionChange}
                                            //dataStateChange={this.dataStateChange} 
                                            userRoleControlRights={this.props.userRoleControlRights}
                                            controlMap={this.props.controlMap}
                                            inputParam={this.props.inputParam}
                                            screenName={this.props.screenName}
                                            addSelectAll={this.state.addSelectAll}
                                            deleteSelectAll={this.state.deleteSelectAll}
                                            onDeleteSelectedComponent={this.onDeleteSelectedComponent}
                                            componentPopupSkip={this.props.componentPopupSkip}
                                            componentPopupTake={this.props.componentPopupTake}
                                            componentPageSizes={this.props.componentPageSizes}
                                            nneedsubsample={this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedsubsample}

                                            
                                        
                                        />
                                        : this.props.Login.operation === "initiate" || this.props.Login.operation === "complete" ?
                                            <AddBatchinitiate
                                                userInfo={this.props.Login.userInfo}
                                                operation={this.props.Login.operation}
                                                handleDateChange={this.handleDateChange}
                                                selectedRecord={this.state.selectedRecord}
                                                onInputOnChange={this.onInputOnChange}
                                                currentTime={this.props.Login.currentTime || []}
                                            />
                                            : this.props.Login.operation === "view" ?
                                                <Card className='one' >
                                                    <Card.Body>
                                                        <ViewInfo
                                                            userInfo={this.props.Login.userInfo}
                                                            selectedRecordView={this.props.Login.masterData.selectedRecordView}
                                                            viewInfoFields={viewInfoFields}
                                                        />
                                                    </Card.Body>
                                                </Card>
                                                : this.props.Login.operation === "createiqcsample" ?
                                                    <AddMaterialIqc
                                                        userInfo={this.props.Login.userInfo}
                                                        operation={this.props.Login.operation}
                                                        materialCategory={this.state.MaterialCategory}
                                                        selectedMaterialType={this.state.selectedMaterialType}
                                                        selectedMaterialCategory={this.state.selectedMaterialCategory}
                                                        onComboChange={this.onComboChange}
                                                        selectedMaterial={this.state.selectedMaterial}
                                                        screenName={this.props.intl.formatMessage({ id: "IDS_SPECIFICATION" })}
                                                        handleSaveClick={this.handleSaveClick}
                                                        material={this.state.Material}
                                                        materialInventory={this.state.MaterialInventory}
                                                        AddSpec={this.AddSpec}
                                                        onInputOnChange={this.onInputOnChange}
                                                        currentTime={this.props.Login.currentTime || []}
                                                        loadSpec={this.props.Login.loadSpec}
                                                        selectedMaterialInventory={this.state.selectedMaterialInventory}
                                                        selectedInventoryUnit={this.props.Login.masterData.selectedInventoryUnit}
                                                        AgaramTree={this.props.Login.AgaramTree}
                                                        openNodes={this.props.Login.OpenNodes}
                                                        onTreeClick={this.onTreeClick}
                                                        focusKey={this.props.Login.SelectedFocusKey}
                                                        activeKey={this.props.Login.SelectedActiveKey}
                                                        Specification={this.props.Login.Specification}
                                                        selectedSpec={this.props.Login.selectedSpec}
                                                        selectedRecord={this.state.selectedRecord}
                                                        onSpecChange={this.onspecChange}
                                                        openSpecModal={this.props.Login.openSpecModal}
                                                        closeModal={this.closeModal}
                                                    /> : ""
                            }
                        />
                        : ""
                }
                         {this.props.Login.modalShow ? ( //ALPD-4999-To show the add popup to get input of filter name,done by Dhanushya RI
                    <ModalShow
                        modalShow={this.props.Login.modalShow}
                        closeModal={this.closeModalShow}
                        onSaveClick={this.onSaveModalFilterName}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        mandatoryFields={mandatoryFieldsFilter}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        modalTitle={this.props.Login.modalTitle}
                        modalBody={
                            this.props.Login.loadEsign ?
                                <Esign
                                    operation={this.props.Login.operation}
                                    onInputOnChange={this.onEsignInputOnChange}
                                    inputParam={this.props.Login.inputParam}
                                    selectedRecord={this.state.selectedRecord || {}}
                                /> 
                                :
               
                        <Col md={12}>
                        <FormTextarea
                            label={this.props.intl.formatMessage({ id: "IDS_FILTERNAME" })}
                            name={"sfiltername"}
                           // type="text"
                            onChange={this.onInputOnChange}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_FILTERNAME" })}
                            value={this.state.selectedRecord ? this.state.selectedRecord.sfiltername : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"50"}
                        />
                    </Col>         
                        }
                    />
                )
                 : (
                    ""
                )}
                {/* End of Modal Sideout for Creation */}
                {this.state.showConfirmAlert ? this.confirmAlert() : ""}
            </>
        );
    }

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };


    ConfirmDelete = (selectedBatch, deleteId, operation) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteBatchCreation(selectedBatch, deleteId, operation));
    };


    completePopUpStartActions = (completeId) => {
        // if(this.props.Login.masterData.nneedtestinitiate === true){
        if (this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus == transactionStatus.COMPLETED ||
            this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus == transactionStatus.DRAFT ||
            this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus == transactionStatus.CANCELLED
        ) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTINITIATEDBATCH" }));
        }
        //    }else 
        else if (this.props.Login.masterData.Samples.length == 0) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLEFORINITIATE" }));
        } else {
            // const updateInfo = {
            //     typeName: DEFAULT_RETURN,
            //     data: {
            //         openModal: true, 
            //         completeId : completeId,
            //         masterData: this.props.Login.masterData,
            //        // screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
            //         operation: "complete"
            //     }
            // }
            // this.props.updateStore(updateInfo);

            let inputData = {};
            inputData["openModal"] = true;
            inputData["completeId"] = completeId;
            inputData["selectedRecord"] = this.state.selectedRecord && this.state.selectedRecord["dtransactiondate"] ? "" : this.state.selectedRecord;
            inputData["userInfo"] = this.props.Login.userInfo;
            inputData["operation"] = "complete";
            this.props.batchCompleteDatePopup(inputData, this.props.Login.masterData);
        }
    }

    AddSpec = (e) => {
        if (this.state.selectedMaterial !== undefined &&
            this.state.selectedMaterialCategory !== undefined) {
                //ALPD-5873  for Default Spec Work. Added by Abdul on 04-06-2025
                 let SelectedFocusKey=this.props.Login.FocusKey;
                   let SelectedActiveKey=this.props.Login.ActiveKey;
                
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                loadSpec: true,
                                //ALPD-5873 Added by Abdul for Default Spec
                                SelectedFocusKey,SelectedActiveKey, openSpecModal:true,
                                // screenName: this.props.intl.formatMessage({ id: "IDS_SPECIFICATION" })
                            }
                        }
                        this.props.updateStore(updateInfo);
            // let inputData = {};
            // inputData["nmaterialcode"] = this.state.selectedMaterial.value;
            // inputData["nmaterialcatcode"] = this.state.selectedMaterialCategory.value;
            // inputData["ncategorybasedflow"] = this.state.selectedMaterialCategory.item.ncategorybasedflow;
            // inputData["userInfo"] = this.props.Login.userInfo;
            // inputData["ntestcode"] = this.props.Login.masterData.SelectedBatchmaster.ntestcode;
            // inputData["ntestgroupspecrequired"] = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.ntestgroupspecrequired && (this.props.Login.masterData.realRegSubTypeValue.ntestgroupspecrequired === true) ? transactionStatus.YES: transactionStatus.NO;
            // // inputData["nneedsubsample"]= this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedsubsample; 
            // // inputData["nneedmyjob"]= this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedmyjob; 
            // // inputData["nneedjoballocation"]= this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedjoballocation; 
            // // inputData["napprovalconfigcode"]=this.state.ApprovalVersionValue ? this.state.ApprovalVersionValue.item.napprovalconfigcode : transactionStatus.NA;
            // // inputData["napproveconfversioncode"]=this.state.ApprovalVersionValue ? this.state.ApprovalVersionValue.item.napprovalconfigversioncode : transactionStatus.NA;
            // // inputData["ntranscode"] = this.state.FilterStatusValue ? this.state.FilterStatusValue.value : transactionStatus.DRAFT;
            // // inputData["nneedtestinitiate"] =  this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedtestinitiate;
            // this.props.getTreeByMaterial(inputData, this.state.selectedRecord, this.props.Login.masterData);
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_FILLALLDETAILSTOADDSPEC" }));
        }
    }


    testPopUpStartActions = (testStartId) => {
        if (this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus == transactionStatus.INITIATED || this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus === transactionStatus.COMPLETED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTBATCH" }));
        } else if (this.props.Login.masterData.Samples.length == 0) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLEFORINITIATE" }));
        }
        // else if (this.props.Login.masterData.iqcsample.length==0){
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTIQCSAMPLEFORINITIATE" }));
        // }
        else {
            let inputData = {};
            inputData["openModal"] = true;
            inputData["testStartId"] = testStartId;
            inputData["selectedRecord"] = this.state.selectedRecord && this.state.selectedRecord["dtransactiondate"] ? "" : this.state.selectedRecord;
            inputData["userInfo"] = this.props.Login.userInfo;
            inputData["operation"] = "initiate";
            this.props.batchInitiateDatePopup(inputData, this.props.Login.masterData);


            //         const updateInfo = {
            //             typeName: DEFAULT_RETURN,
            //             data: {
            //                 openModal: true, 
            //                 testStartId : testStartId,
            //                 selectedRecord : this.state.selectedRecord && this.state.selectedRecord["dtransactiondate"] ? "" : this.state.selectedRecord,
            //                 masterData: this.props.Login.masterData,
            //                 operation: "initiate"
            //             }
            //         }
            // this.props.updateStore(updateInfo);
        }

    }

    testStartActions = (selectedmaster, testStartId) => {
        if (selectedmaster.ntransactionstatus == transactionStatus.INITIATED || selectedmaster.ntransactionstatus === transactionStatus.COMPLETED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_BATCHALREADYINITIATEDCOMPLETED" }));
        } else if (this.props.Login.masterData.Samples.length == 0) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLEFORINITIATE" }));
        }
        //else if (this.props.Login.masterData.iqcsample.length==0){
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTIQCSAMPLEFORINITIATE" }));
        // }
        else {
            let inputData = {};
            let jsonuidata = [];
            const masterData = this.props.Login.masterData;
            const postParam = {
                inputListName: "Batchmaster",
                selectedObject: "SelectedBatchmaster",
                primaryKeyField: "nbatchmastercode",
                primaryKeyValue: selectedmaster.nbatchmastercode,
                fetchUrl: "batchcreation/initiateBatchcreation",
                isSingleGet: true,
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }
            let obj = convertDateValuetoString(this.state.selectedFilter.fromDate || this.props.Login.masterData.realFromDate,
                this.state.selectedFilter.toDate || this.props.Login.masterData.realToDate, this.props.Login.userInfo);
            let jsondata = this.props.Login.masterData.Samples.map(item => {
                return { jsonuidata: item }
            });
            if (this.props.Login.masterData.iqcsample.length > 0) {
                let totalSample = this.props.Login.masterData.Samples.concat(this.props.Login.masterData.iqcsample);
                inputData["npreregno"] = this.props.Login.masterData.iqcsample.map(samples => samples.npreregno).join(",");
                inputData["ntransactiontestcode"] = totalSample.map(samples => samples.ntransactiontestcode).join(",");
                inputData["nneedjoballocationiqc"] = true
                inputData["isiqcdata"] = true
            } else {
                inputData["npreregno"] = this.props.Login.masterData.Samples.map(samples => samples.npreregno).join(",");
                inputData["ntransactiontestcode"] = this.props.Login.masterData.Samples.map(samples => samples.ntransactiontestcode).join(",");
                inputData["isiqcdata"] = false
                inputData["nneedjoballocationiqc"] = false
            }
            inputData["nbatchsampleCode"] = this.props.Login.masterData.Samples.map(sample => sample.nbatchsamplecode).join(",");
            inputData["muluserpreregno"] = this.props.Login.masterData.Samples.map(samples => samples.npreregno).join(",");
            inputData["mulusertransactionsamplecode"] = this.props.Login.masterData.Samples.map(samples => samples.ntransactionsamplecode).join(",");
            inputData["mulusertransactiontestcode"] = this.props.Login.masterData.Samples.map(samples => samples.ntransactiontestcode).join(",");
            inputData["fromDate"] = obj.fromDate;
            inputData["toDate"] = obj.toDate;
            inputData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA;
            inputData["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode ? this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA;
            inputData["defaultSampleType"] = this.props.Login.masterData.defaultSampleType
            inputData["nsampletypecode"] = this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode ? this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA;
            // inputData["nsampletypecode"]=this.props.Login.masterData.defaultSampleType ? this.props.Login.masterData.defaultSampleType.nsampletypecode : transactionStatus.NA;
            //inputData["nregtypecode"]=this.props.Login.masterData.defaultRegistrationType ? this.props.Login.masterData.defaultRegistrationType.nregtypecode : transactionStatus.NA;
            inputData["defaultRegistrationType"] = this.props.Login.masterData.defaultRegistrationType
            inputData["defaultRegistrationSubType"] = this.state.nregsubtypecode ? this.state.nregsubtypecode.item : transactionStatus.NA;
            //inputData["nregsubtypecode"]=this.state.nregsubtypecode ? this.state.nregsubtypecode.item.nregsubtypecode : transactionStatus.NA;
            inputData["nbatchmastercode"] = selectedmaster.nbatchmastercode;
            inputData["batchsample"] = jsondata;
            inputData["userinfo"] = this.props.Login.userInfo;
            inputData["nneedsubsample"] = this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedsubsample;
            inputData["nneedmyjob"] = this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedmyjob;
            inputData["nneedjoballocation"] = this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedjoballocation;
            inputData["napprovalversioncode"] = this.state.ApprovalVersionValue ?
                this.state.ApprovalVersionValue.item.napprovalconfigversioncode : this.props.Login.masterData.realApproveConfigVersion ?
                    this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode : transactionStatus.NA;
            //ALPD-4922   they dint pass in real data 
            inputData["napprovalconfigcode"] = this.props.Login.masterData.realApproveConfigVersion &&
                this.props.Login.masterData.realApproveConfigVersion.napprovalconfigcode ? this.props.Login.masterData.realApproveConfigVersion.napprovalconfigcode : transactionStatus.NA;
            inputData["napproveconfversioncode"] = this.props.Login.masterData.realApproveConfigVersion &&
                this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode ? this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode : transactionStatus.NA;
            inputData["ntranscode"] = transactionStatus.INITIATED || transactionStatus.DRAFT;
            inputData["nneedtestinitiate"] = this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedtestinitiate;
            inputData["Batchhistory"] = {
                dtransactiondate: formatInputDate(this.state.selectedRecord["dtransactiondate"] != undefined ?
                    this.state.selectedRecord["dtransactiondate"] : this.props.Login.currentTime, false),
                scomments: this.state.selectedRecord && this.state.selectedRecord.scomments
            };
            inputData["ntestcode"] = this.props.Login.masterData.SelectedBatchmaster.ntestcode;
            inputData["testStartId"] = testStartId;
            inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode || transactionStatus.NA;
            inputData["defaultFilterStatus"] = this.props.Login.masterData.BCFilterStatus && this.props.Login.masterData.BCFilterStatus[1];
            inputData["sample"] = this.props.Login.masterData ? this.props.Login.masterData.sample : "";
            inputData["iqcsample"] = this.props.Login.masterData ? this.props.Login.masterData.iqcsample : "";
            const inputParam = {
                postParam,
                inputData: inputData,
                classUrl: "batchcreation",
                methodUrl: "Batchcreation",
                displayName: "IDS_BATCHCREATION",
                operation: "initiate"
            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, testStartId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: {
                            inputParam,
                            masterData: {
                                ...masterData
                                // defaultFilterStatus: this.props.Login.masterData.BCFilterStatus
                                //     && this.props.Login.masterData.BCFilterStatus[1],
                                // realdefaultFilterStatus: this.props.Login.masterData.BCFilterStatus
                                //     && this.props.Login.masterData.BCFilterStatus[1],

                            }
                        },
                        openModal: true, screenName: "IDS_BATCHCREATION",
                        operation: inputParam.operation
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.batchInitiateAction(inputData, this.props.Login.masterData, this.confirmMessage);
            }
        }
    }

    batchSaveIQCActions = (selectedmaster) => {
        if (this.state.selectedRecord.savailablequatity !== "0.00") {
            if (parseFloat(this.state.selectedRecord.susedquantity) <= parseFloat(this.props.Login.masterData.inventoryTransaction.savailablequatity)) {
                if (this.props.Login.selectedSpec.nallottedspeccode !== undefined && this.props.Login.selectedSpec.nallottedspeccode !== "") {
                    let userInfo = {};
                    let inputRegistrationData = {};
                    let inputMaterialInventoryData = {};
                    let inputBatchData = {};
                    const map = {}
                    let batchCreationSampleData = {};
                    let batchCreationTestData = {};
                    let batchCreationSampleArray = [];
                    let batchCreationTestArray = [];
                    let samplecombinationuniqueArray = [];
                    let inputMaterialInventoryArrData = [];

                    batchCreationSampleData["nspecsampletypecode"] = this.props.Login.selectedSpec && this.props.Login.selectedSpec.nallottedspeccode ?
                        this.props.Login.selectedSpec.nallottedspeccode.nspecsampletypecode : transactionStatus.NA;
                    batchCreationSampleData["ncomponentcode"] = transactionStatus.NA;
                    batchCreationSampleData["slno"] = 1;
                    batchCreationSampleArray.push(batchCreationSampleData);

                    inputRegistrationData["nallottedspeccode"] = this.props.Login.selectedSpec && this.props.Login.selectedSpec.nallottedspeccode ?
                        this.props.Login.selectedSpec.nallottedspeccode.value : transactionStatus.NA;
                    inputRegistrationData["ntemplatemanipulationcode"] = this.props.Login.ntemplatemanipulationcode || transactionStatus.NA;
                    inputRegistrationData["nregsubtypeversioncode"] = this.props.Login.masterData.nregsubtypeversioncode;
                    inputRegistrationData["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode;
                    // inputRegistrationData["nsampletypecode"]=this.props.Login.masterData.defaultSampleType ? this.props.Login.masterData.defaultSampleType.nsampletypecode : transactionStatus.NA;
                    // inputRegistrationData["nregtypecode"]=this.props.Login.masterData.defaultRegistrationType ? this.props.Login.masterData.defaultRegistrationType.nregtypecode : transactionStatus.NA;
                    // inputRegistrationData["nregsubtypecode"]=this.state.nregsubtypecode ? this.state.nregsubtypecode.item.nregsubtypecode : transactionStatus.NA;

                    inputRegistrationData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue &&
                        this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA;
                    inputRegistrationData["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode ?
                        this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA;
                    inputRegistrationData["nsampletypecode"] = this.props.Login.masterData.realSampleTypeValue ?
                        this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA;

                    inputRegistrationData["nproductcatcode"] = transactionStatus.NA;
                    inputRegistrationData["nproductcode"] = transactionStatus.NA;
                    inputRegistrationData["ninstrumentcatcode"] = transactionStatus.NA;
                    inputRegistrationData["ninstrumentcode"] = transactionStatus.NA;
                    inputRegistrationData["nmaterialcatcode"] = this.state.selectedMaterialCategory ? this.state.selectedMaterialCategory.value : transactionStatus.NA;
                    inputRegistrationData["nmaterialcode"] = this.state.selectedMaterial ? this.state.selectedMaterial.value : transactionStatus.NA;

                    inputRegistrationData["jsondata"] = {
                        nmaterialcode: this.state.selectedMaterial.value,
                        nmaterialcatcode: this.state.selectedMaterialCategory.value,
                        smaterialcatname: this.state.selectedMaterialCategory.label,
                        sinventoryid: this.state.selectedMaterialInventory.item.sinventoryid,
                        nmaterialinventorycode: this.state.selectedMaterialInventory.item.nmaterialinventorycode,
                        smaterial: this.state.selectedMaterial.item.smaterialname,
                        smaterialtype: this.state.selectedMaterialType.item.smaterialtypename,
                        nmaterialtypecode: this.state.selectedMaterialType.value,
                        susedquantity: this.state.selectedRecord.susedquantity,
                        sunitname: this.props.Login.masterData.inventoryTransaction.sunitname,
                        savailablequatity: this.props.Login.masterData.inventoryTransaction.savailablequatity,
                        //materialtype:this.state.selectedMaterialType.label,
                        sremarks: this.state.selectedRecord.sremarks,
                        nsectioncode: this.props.Login.masterData.selectedInventoryUnit['nsectioncode']
                    };
                    inputRegistrationData["jsonuidata"] = {
                        nmaterialcode: this.state.selectedMaterial.value,
                        nmaterialcatcode: this.state.selectedMaterialCategory.value,
                        smaterialcatname: this.state.selectedMaterialCategory.label,
                        sinventoryid: this.state.selectedMaterialInventory.item.sinventoryid,
                        nmaterialinventorycode: this.state.selectedMaterialInventory.item.nmaterialinventorycode,
                        smaterial: this.state.selectedMaterial.item.smaterialname,
                        smaterialtype: this.state.selectedMaterialType.item.smaterialtypename,
                        nmaterialtypecode: this.state.selectedMaterialType.value,
                        susedquantity: this.state.selectedRecord.susedquantity,
                        sunitname: this.props.Login.masterData.inventoryTransaction.sunitname,
                        savailablequatity: this.props.Login.masterData.inventoryTransaction.savailablequatity,
                        //materialtype:this.state.selectedMaterialType.label,
                        sremarks: this.state.selectedRecord.sremarks,
                        nsectioncode: this.props.Login.masterData.selectedInventoryUnit['nsectioncode']

                    };

                    // inputMaterialInventoryData = {
                    //     jsondata : this.props.Login.masterData.selectedInventoryUnit['jsondata']
                    // }
                    //  inputMaterialInventoryData = {
                    //         nmaterialinventorycode : this.state.selectedMaterialInventory.item.nmaterialinventorycode,
                    //         jsondata : {
                    //             jsondata:this.props.Login.masterData.selectedInventoryUnit['jsondata'],
                    //             nqtyused: this.state.selectedRecord.susedquantity
                    //         },
                    //         jsonuidata : {
                    //             jsonuidata : this.props.Login.masterData.selectedInventoryUnit['jsonuidata'],
                    //             nqtyused: this.state.selectedRecord.susedquantity
                    //         },
                    //         nsectioncode:this.props.Login.masterData.selectedInventoryUnit['nsectioncode']
                    //  };

                    inputMaterialInventoryData["nmaterialinventorycode"] = this.state.selectedMaterialInventory.item.nmaterialinventorycode;
                    inputMaterialInventoryData["jsondata"] = {
                        ...this.props.Login.masterData.selectedInventoryUnit['jsondata'],
                        nqtyused: this.state.selectedRecord.susedquantity,
                        savailablequatity: this.state.selectedRecord.savailablequatity,
                        nsectioncode: this.props.Login.masterData.selectedInventoryUnit['nsectioncode']
                    }
                    //inputMaterialInventoryData["jsondata"] = this.state.selectedRecord.susedquantity;
                    inputMaterialInventoryData["nsectioncode"] = this.props.Login.masterData.selectedInventoryUnit['nsectioncode'];
                    inputMaterialInventoryData["jsonuidata"] = {
                        ...this.props.Login.masterData.selectedInventoryUnit['jsonuidata'],
                        nqtyused: this.state.selectedRecord.susedquantity,
                        savailablequatity: this.state.selectedRecord.savailablequatity,
                        nsectioncode: this.props.Login.masterData.selectedInventoryUnit['nsectioncode']
                    }


                    //inputMaterialInventoryArrData.push(inputMaterialInventoryData);

                    batchCreationTestData["ntestgrouptestcode"] = this.props.Login.masterData.selectedTestDetails ? this.props.Login.masterData.selectedTestDetails.ntestgrouptestcode : transactionStatus.NA;
                    //     batchCreationTestData["ntransactiontestcode"] = this.props.Login.masterData.Samples.map(sample =>sample.ntransactiontestcode).join(",") ;
                    batchCreationTestData["ntestcode"] = this.props.Login.masterData.SelectedBatchmaster.ntestcode;
                    batchCreationTestData["nsectioncode"] = this.props.Login.masterData.SelectedBatchmaster.nsectioncode;
                    batchCreationTestData["nmethodcode"] = this.props.Login.masterData.selectedTestDetails ? this.props.Login.masterData.selectedTestDetails.nmethodcode : transactionStatus.NA;
                    //   batchCreationTestData["nchecklistversioncode"]=this.state.selectedTestSynonym ? this.state.selectedTestSynonym.item.nchecklistversioncode:transactionStatus.NA;
                    batchCreationTestData["nrepeatcountno"] = 1;//--
                    //    batchCreationTestData["ntestretestno"]=0;
                    batchCreationTestData["nparametercount"] = 1; //--
                    batchCreationTestData["slno"] = 1; //--

                    batchCreationTestArray.push(batchCreationTestData);


                    map["nfilterstatus"] = transactionStatus.PREREGISTER;
                    map["nbatchmastercode"] = selectedmaster.nbatchmastercode;
                    userInfo = this.props.Login.userInfo;
                    map["nneedsubsample"] = this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedsubsample;
                    map["napproveconfversioncode"] = this.state.ApprovalVersionValue ? this.state.ApprovalVersionValue.item.napprovalconfigversioncode : transactionStatus.NA;
                    map["ntranscode"] = this.state.FilterStatusValue ? this.state.FilterStatusValue.value : transactionStatus.DRAFT;
                    map["nneedtestinitiate"] = this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedtestinitiate;
                    map["nmaterialcatcode"] = this.state.selectedMaterialCategory ? this.state.selectedMaterialCategory.value : transactionStatus.NA;
                    map["nmaterialcode"] = this.state.selectedMaterial ? this.state.selectedMaterial.value : transactionStatus.NA;
                    map["nmaterialtypecode"] = this.state.selectedMaterialType ? this.state.selectedMaterialType.value : transactionStatus.NA;

                    inputBatchData = this.props.Login.masterData.SelectedBatchmaster;

                    map['Registration'] = inputRegistrationData;
                    map['Batchsampleiqc'] = inputBatchData;
                    map['RegistrationSample'] = batchCreationSampleArray;
                    map['testgrouptest'] = batchCreationTestArray;
                    map['userInfo'] = userInfo;
                    map['samplecombinationunique'] = samplecombinationuniqueArray;
                    map['inputMaterialInventoryArrData'] = inputMaterialInventoryData;

                    const inputParam = {
                        inputData: map,
                        classUrl: "batchcreation",
                        methodUrl: "Batchcreation",
                        displayName: "IDS_BATCHIQCSAVE",
                        operation: "createiqc"
                    }

                    this.props.batchSaveIQCActions(inputParam.inputData, this.props.Login.masterData);

                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_ADDSPECIFICATIONS" }));
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_USEDQTYISGREATERTHANAVAILABLEQTY" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_NOAVAILABLEQUANTITY" }));
        }
    }

    cancelBatch = (selectedmaster, cancelId) => {
        if (selectedmaster.ntransactionstatus == transactionStatus.DRAFT || selectedmaster.ntransactionstatus == transactionStatus.COMPLETED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTBATCHINITIATEDRECORD" }));
        } else {
            let inputData = {};
            const masterData = this.props.Login.masterData;
            const postParam = {
                inputListName: "Batchmaster",
                selectedObject: "SelectedBatchmaster",
                primaryKeyField: "nbatchmastercode",
                primaryKeyValue: selectedmaster.nbatchmastercode,
                fetchUrl: "batchcreation/cancelBatch",
                isSingleGet: true,
                //task: selectedBatch.ntransactionstatus === transactionStatus.DRAFT ? "delete" : "cancel",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }
            let obj = convertDateValuetoString(this.state.selectedFilter.fromDate || this.props.Login.masterData.realFromDate,
                this.state.selectedFilter.toDate || this.props.Login.masterData.realToDate, this.props.Login.userInfo);

            let jsondata = this.props.Login.masterData.Samples.map(item => {
                return { jsonuidata: item }
            });

            inputData["fromDate"] = obj.fromDate;
            inputData["toDate"] = obj.toDate;
            inputData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue &&
                this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA;
            inputData["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode ?
                this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA;
            inputData["nsampletypecode"] = this.props.Login.masterData.realSampleTypeValue ?
                this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA;
            inputData["defaultSampleType"] = this.props.Login.masterData.defaultSampleType
            //inputData["nsampletypecode"]=this.props.Login.masterData.defaultSampleType ? this.props.Login.masterData.defaultSampleType.nsampletypecode : transactionStatus.NA;
            //inputData["nregtypecode"]=this.props.Login.masterData.defaultRegistrationType ? this.props.Login.masterData.defaultRegistrationType.nregtypecode : transactionStatus.NA;
            inputData["defaultRegistrationType"] = this.props.Login.masterData.defaultRegistrationType
            inputData["defaultRegistrationSubType"] = this.state.nregsubtypecode ? this.state.nregsubtypecode.item : transactionStatus.NA;
            // inputData["nregsubtypecode"]=this.state.nregsubtypecode ? this.state.nregsubtypecode.item.nregsubtypecode : transactionStatus.NA;
            inputData["nbatchmastercode"] = selectedmaster.nbatchmastercode;
            inputData["samples"] = jsondata;
            inputData["userinfo"] = this.props.Login.userInfo;
            inputData["sbatcharno"] = selectedmaster.sbatcharno;
            inputData["nneedsubsample"] = this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedsubsample;
            inputData["napprovalconfigcode"] = this.state.ApprovalVersionValue ?
                this.state.ApprovalVersionValue.item.napprovalconfigcode : transactionStatus.NA;
            inputData["napprovalversioncode"] = this.state.ApprovalVersionValue ?
                this.state.ApprovalVersionValue.item.napprovalconfigversioncode : transactionStatus.NA;
            inputData["ntranscode"] = transactionStatus.CANCELLED || transactionStatus.DRAFT;
            // inputData["Batchhistory"] ={
            //     dtransactiondate : formatInputDate(new Date(),true),
            //     scomments : this.state.selectedRecord && this.state.selectedRecord.scomments
            //     };
            //inputData["completeId"] = completeId;
            inputData["nneedtestinitiate"] = this.props.Login.masterData && this.props.Login.masterData.nneedtestinitiate;
            inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode ||
                transactionStatus.NA;
            inputData["defaultFilterStatus"] = this.props.Login.masterData.BCFilterStatus
                && this.props.Login.masterData.BCFilterStatus[3];
            const inputParam = {
                postParam,
                inputData: inputData,
                classUrl: "batchcreation",
                methodUrl: "Batch",
                displayName: "IDS_BATCHCREATION",
                operation: "cancel"
            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, cancelId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: {
                            inputParam,
                            masterData: {
                                ...masterData,
                                defaultFilterStatus: this.props.Login.masterData.BCFilterStatus
                                    && this.props.Login.masterData.BCFilterStatus[2],
                                realdefaultFilterStatus: this.props.Login.masterData.BCFilterStatus
                                    && this.props.Login.masterData.BCFilterStatus[2],

                            }
                        },
                        openModal: true, screenName: "IDS_BATCHCREATION",
                        operation: inputParam.operation
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.batchCancelAction(inputData, this.props.Login.masterData);
            }

        }
    }

    batchCompleteActions = (selectedmaster, completeId) => {
        if (selectedmaster.ntransactionstatus == transactionStatus.COMPLETED || selectedmaster.ntransactionstatus == transactionStatus.DRAFT) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTINITIATEDBATCH" }));
        } else {
            let inputData = {};
            const masterData = this.props.Login.masterData;
            const postParam = {
                inputListName: "Batchmaster",
                selectedObject: "SelectedBatchmaster",
                primaryKeyField: "nbatchmastercode",
                primaryKeyValue: selectedmaster.nbatchmastercode,
                fetchUrl: "batchcreation/completeBatchcreation",
                isSingleGet: true,
                //task: selectedBatch.ntransactionstatus === transactionStatus.DRAFT ? "delete" : "cancel",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }
            let obj = convertDateValuetoString(this.state.selectedFilter.fromDate || this.props.Login.masterData.realFromDate,
                this.state.selectedFilter.toDate || this.props.Login.masterData.realToDate, this.props.Login.userInfo);

            let jsondata = this.props.Login.masterData.Samples.map(item => {
                return { jsonuidata: item }
            });

            inputData["fromDate"] = obj.fromDate;
            inputData["toDate"] = obj.toDate;
            inputData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA;
            inputData["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode ?
                this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA;
            inputData["nsampletypecode"] = this.props.Login.masterData.realSampleTypeValue ?
                this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA;
            inputData["defaultSampleType"] = this.props.Login.masterData.defaultSampleType
            //inputData["nsampletypecode"]=this.props.Login.masterData.defaultSampleType ? this.props.Login.masterData.defaultSampleType.nsampletypecode : transactionStatus.NA;
            //inputData["nregtypecode"]=this.props.Login.masterData.defaultRegistrationType ? this.props.Login.masterData.defaultRegistrationType.nregtypecode : transactionStatus.NA;
            inputData["defaultRegistrationType"] = this.props.Login.masterData.defaultRegistrationType
            inputData["defaultRegistrationSubType"] = this.state.nregsubtypecode ? this.state.nregsubtypecode.item : transactionStatus.NA;
            // inputData["nregsubtypecode"]=this.state.nregsubtypecode ? this.state.nregsubtypecode.item.nregsubtypecode : transactionStatus.NA;
            inputData["nbatchmastercode"] = selectedmaster.nbatchmastercode;
            inputData["ntransactiontestcode"] = this.props.Login.masterData.Samples.map(sample => sample.ntransactiontestcode).join(",");
            inputData["samples"] = jsondata;
            inputData["userinfo"] = this.props.Login.userInfo;
            inputData["sbatcharno"] = selectedmaster.sbatcharno;
            inputData["nneedsubsample"] = this.state.nregsubtypecode && this.state.nregsubtypecode.item.nneedsubsample;
            inputData["napprovalconfigcode"] = this.props.Login.masterData.realApproveConfigVersion &&
                this.props.Login.masterData.realApproveConfigVersion.napprovalconfigcode ? this.props.Login.masterData.realApproveConfigVersion.napprovalconfigcode : transactionStatus.NA;
            inputData["napprovalversioncode"] = this.state.ApprovalVersionValue ?
                this.state.ApprovalVersionValue.item.napprovalconfigversioncode : transactionStatus.NA;
            //  inputData["ntranscode"] = transactionStatus.COMPLETED || transactionStatus.DRAFT;
            inputData["ntranscode"] = transactionStatus.COMPLETED

            inputData["Batchhistory"] = {
                dtransactiondate: formatInputDate(this.state.selectedRecord["dtransactiondate"] != undefined ?
                    this.state.selectedRecord["dtransactiondate"] : this.props.Login.currentTime, false),
                scomments: this.state.selectedRecord && this.state.selectedRecord.scomments
            };
            inputData["completeId"] = completeId;
            inputData["nneedtestinitiate"] = this.props.Login.masterData && this.props.Login.masterData.nneedtestinitiate;
            inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode ||
                transactionStatus.NA;
            inputData["defaultFilterStatus"] = this.props.Login.masterData.BCFilterStatus
                && this.props.Login.masterData.BCFilterStatus[2];
            const inputParam = {
                postParam,
                inputData: inputData,
                classUrl: "batchcreation",
                methodUrl: "Batchcreation",
                displayName: "IDS_BATCHCREATION",
                operation: "complete"
            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, completeId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: {
                            inputParam,
                            masterData: {
                                ...masterData
                                // defaultFilterStatus: this.props.Login.masterData.BCFilterStatus
                                //     && this.props.Login.masterData.BCFilterStatus[2],
                                // realdefaultFilterStatus: this.props.Login.masterData.BCFilterStatus
                                //     && this.props.Login.masterData.BCFilterStatus[2],

                            }
                        },
                        openModal: true, screenName: "IDS_BATCHCREATION",
                        operation: inputParam.operation
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.batchCompleteAction(inputData, this.props.Login.masterData);
            }

        }
    }

    // completeBatchCreation = () => {
    //     const postParam = {
    //         inputListName: "Batchmaster", selectedObject: "SelectedBatchCreation",
    //         primaryKeyField: "nreleasebatchcode",
    //         primaryKeyValue: this.props.Login.masterData.SelectedBatchCreation.nreleasebatchcode,
    //         fetchUrl: "batchcreation/getBatchCreation",
    //         fecthInputObject: this.props.Login.userInfo,
    //     }
    //     const inputParam = {
    //         classUrl: "batchcreation",
    //         methodUrl: "BatchCreation", postParam,
    //         inputData: {
    //             ncontrolcode: this.props.Login.ncontrolCode,
    //             "userinfo": this.props.Login.userInfo,
    //             nreleasebatchcode: this.props.Login.masterData.SelectedBatchCreation.nreleasebatchcode
    //         },
    //         operation: "complete", showConfirmAlert: false
    //     }
    //     //this.props.updateStore({ typeName: DEFAULT_RETURN, data: { showConfirmAlert: false } });  

    //     const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);

    //     if (esignNeeded) {
    //         const updateInfo = {
    //             typeName: DEFAULT_RETURN,
    //             data: {
    //                 loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
    //                 openModal: true, screenName: "IDS_BATCHCREATION",
    //                 operation: this.props.Login.operation,
    //             }
    //         }
    //         this.props.updateStore(updateInfo);
    //     }
    //     else {

    //         this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal", {});
    //     }

    // }

    closeAlert = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showConfirmAlert: false, loading: false }
        }
        this.props.updateStore(updateInfo);
    }


    componentDidUpdate(previousProps) {

        let { userRoleControlRights, controlMap, selectedRecord, filterData,
            addedComponentList,
            filterStatusList, dataState, sahDataState, bahDataState,
            chDataState, testCommentDataState, SampleType, RegistrationType,
            RegistrationSubType, BCFilterStatus, REJobStatus, Testvalues,
            ApprovalConfigVersion, skip, take,
            testskip, testtake, selectedFilter, InstrumentCategory, selectedInstCategory,
            ProductCategory, Instrument, selectedInstrument, selectedTestSynonym, nregsubtypecode,
            selectedProductCategory, Product, selectedProduct, samples, addSelectAll,
            deleteSelectAll, ApprovalVersionValue, FilterStatusValue, Section,
            selectedSection, sampleGridItem, subsampleGridItem, testGridItem = [],
            DynamicGridItem, samplegridmoreitem, DynamicGridMoreItem, MaterialCategory,
            selectedMaterialType, Material, selectedMaterial, selectedMaterialCategory,
            MaterialInventory, selectedMaterialInventory, Specification,
            selectedSpec, addedSamplesList, testGridArnoItems, InstrumentID,
            selectedInstrumentId, sinstrumentid, selectedProjectcode, ProjectCode } = this.state;
        let isStateChanged = false;
        let bool = false;
        addedSamplesList = [];
        // samples = [];

        if (this.props.Login.masterData.RegistrationSubType &&
            this.props.Login.masterData.RegistrationSubType !== previousProps.Login.masterData.RegistrationSubType) {
            let dataState = {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5
                //, group: [{ field: `${this.props.Login.masterData.nneedsubsample ? 'ssamplearno' : 'sarno'}` }] 
            }
            bool = true;
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            bool = true;
            isStateChanged = true;


            SampleType = constructOptionList(this.props.Login.masterData.SampleType || [], "nsampletypecode", "ssampletypename", 'nsampletypecode', 'ascending', 'nsampletypecode', false);
            RegistrationType = constructOptionList(this.props.Login.masterData.RegistrationType || [], "nregtypecode", "sregtypename", "nsorter", 'ascending', 'nregtypecode', false);
            RegistrationSubType = constructOptionList(this.props.Login.masterData.RegistrationSubType || [], "nregsubtypecode", "sregsubtypename", "nsorter", 'ascending', 'nregsubtypecode', false);
            BCFilterStatus = constructOptionList(this.props.Login.masterData.BCFilterStatus || [], "ntransactionstatus", "sfilterstatus", "nsorter", 'ascending', "ntransactionstatus", false);
            REJobStatus = constructOptionList(this.props.Login.masterData.REJobStatus || [], 'njobstatuscode', 'sidsjobstatusname', 'ascending', 'njobstatuscode', false);
            Testvalues = constructOptionList(this.props.Login.masterData.Testvalues || [], 'ntestcode', 'stestname', 'ascending', 'ntestcode', false);
            ApprovalConfigVersion = constructOptionList(this.props.Login.masterData.ApprovalConfigVersion || [], 'napprovalconfigversioncode', 'sversionname',
                'ascending', 'napprovalconfigversioncode', false);
            InstrumentCategory = constructOptionList(this.props.Login.masterData.instrumentCategory || [], 'ninstrumentcatcode', 'sinstrumentcatname',
                'ascending', 'ninstrumentcatcode', false);
            Instrument = constructOptionList(this.props.Login.masterData.instrument || [], 'ninstrumentnamecode', 'sinstrumentname',
                'ascending', 'ninstrumentcode', false);
            ProductCategory = constructOptionList(this.props.Login.masterData.productcategory || [], 'nproductcatcode', 'sproductcatname',
                'ascending', 'nproductcatcode', false);
            Product = constructOptionList(this.props.Login.masterData.product || [], 'nproductcode', 'sproductname',
                'ascending', 'nproductcode', false);
            Section = constructOptionList(this.props.Login.masterData.Section || [], 'nsectioncode', 'ssectionname',
                'ascending', 'nsectioncode', false);
            MaterialCategory = constructOptionList(this.props.Login.masterData.MaterialCategory || [], 'nmaterialcatcode', 'smaterialcatname',
                'ascending', 'nmaterialcatcode', false);
            Material = constructOptionList(this.props.Login.masterData.Material || [], 'nmaterialcode', 'smaterialname',
                'ascending', 'nmaterialcode', false);
            MaterialInventory = constructOptionList(this.props.Login.masterData.MaterialInventory || [], 'nmaterialinventtranscode', 'sinventoryid',
                'ascending', 'nmaterialinventtranscode', false);
            InstrumentID = constructOptionList(this.props.Login.masterData.instrumentID || [], 'ninstrumentcode', 'sinstrumentid',
                'ascending', 'ninstrumentcode', false);
            ProjectCode = constructOptionList(this.props.Login.masterData.ProjectCode || [], 'nprojectmastercode', 'sprojectcode',
                'ascending', 'nprojectmastercode', false);

            skip = this.props.Login.skip === undefined ? skip : this.props.Login.skip
            take = this.props.Login.take || take
            testskip = this.props.Login.testskip === undefined ? testskip : this.props.Login.testskip
            testtake = this.props.Login.testtake || testtake
            let selectFilterStatus = {
                ntransactionstatus: transactionStatus.PARTIAL,
                sfilterstatus: this.props.intl.formatMessage({ id: "IDS_PARTIAL" }),
                scolorhexcode: "#800000"
            }
            const selectedFilters = this.props.Login.masterData.BCFilterStatus || [];

            const selectedFiltersNew = JSON.parse(JSON.stringify(selectedFilters));

            const index = selectedFiltersNew.findIndex(item => item.ntransactionstatus === transactionStatus.PARTIAL)
            if (selectedFiltersNew.length > 0 && index === -1) {
                selectedFiltersNew.push(selectFilterStatus)
            }

            selectedFilter = selectedFiltersNew;
            SampleType = SampleType.get("OptionList")
            RegistrationType = RegistrationType.get("OptionList")
            RegistrationSubType = RegistrationSubType.get("OptionList")
            BCFilterStatus = BCFilterStatus.get("OptionList")
            REJobStatus = REJobStatus.get("OptionList")
            Testvalues = Testvalues.get("OptionList")
            ApprovalConfigVersion = ApprovalConfigVersion.get("OptionList")
            InstrumentCategory = InstrumentCategory.get("OptionList")
            Instrument = Instrument.get("OptionList")
            ProductCategory = ProductCategory.get("OptionList")
            Product = Product.get("OptionList")
            Section = Section.get("OptionList")
            MaterialCategory = MaterialCategory.get("OptionList")
            Material = Material.get("OptionList")
            MaterialInventory = MaterialInventory.get("OptionList")
            InstrumentID = InstrumentID.get("OptionList")
            ProjectCode = ProjectCode.get("OptionList")
            //selectedInstCategory=this.props.Login.masterData.selectedInstrumentCategory || [];

            samples = this.props.Login.masterData.samples;


            addSelectAll = false;
            deleteSelectAll = true;
            nregsubtypecode = this.props.Login.masterData.defaultRegistrationSubType ?
                {
                    label: this.props.Login.masterData.defaultRegistrationSubType.sregsubtypename,
                    value: this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode,
                    item: this.props.Login.masterData.defaultRegistrationSubType
                } : ""

            if (this.props.Login.masterData.selectedTestSynonym !== previousProps.Login.masterData.selectedTestSynonym) {
                selectedTestSynonym = this.props.Login.masterData.selectedTestSynonym ?
                    {
                        label: this.props.Login.masterData.selectedTestSynonym.stestname,
                        value: this.props.Login.masterData.selectedTestSynonym.ntestcode,
                        item: this.props.Login.masterData.selectedTestSynonym
                    } : ""
                let stestname = selectedTestSynonym.item;
                //selectedRecord = {...this.state.selectedRecord,stestname,...selectedRecord};
                selectedRecord = { ...selectedRecord, stestname };
                isStateChanged = true;
            }

            if (this.props.Login.masterData.selectedProductcategory !== previousProps.Login.masterData.selectedProductcategory) {
                selectedProductCategory = this.props.Login.masterData.selectedProductcategory ?
                    {
                        label: this.props.Login.masterData.selectedProductcategory.sproductcatname,
                        value: this.props.Login.masterData.selectedProductcategory.nproductcatcode,
                        item: this.props.Login.masterData.selectedProductcategory
                    } : ""
                isStateChanged = true;
            }

            if (this.props.Login.masterData.selectedProduct !== previousProps.Login.masterData.selectedProduct) {
                selectedProduct = this.props.Login.masterData.selectedProduct ?
                    {
                        label: this.props.Login.masterData.selectedProduct.sproductname,
                        value: this.props.Login.masterData.selectedProduct.nproductcode,
                        item: this.props.Login.masterData.selectedProduct
                    } : ""
                let sproductname = selectedProduct.item;
                selectedRecord = { ...this.state.selectedRecord, sproductname, ...selectedRecord };
                isStateChanged = true;
            }

            if (this.props.Login.masterData.selectedInstrumentCategory !== previousProps.Login.masterData.selectedInstrumentCategory) {
                selectedInstCategory = this.props.Login.masterData.selectedInstrumentCategory ?
                    {
                        label: this.props.Login.masterData.selectedInstrumentCategory.sinstrumentcatname,
                        value: this.props.Login.masterData.selectedInstrumentCategory.ninstrumentcatcode,
                        item: this.props.Login.masterData.selectedInstrumentCategory
                    } : ""
                let sinstrumentcatname = selectedInstCategory.item;
                selectedRecord = { ...selectedRecord, sinstrumentcatname };
                // selectedRecord = {...this.state.selectedRecord,sinstrumentcatname,...selectedRecord};
                isStateChanged = true;
            }

            if (this.props.Login.masterData.selectedInstrument !== previousProps.Login.masterData.selectedInstrument) {
                selectedInstrument = this.props.Login.masterData.selectedInstrument ?
                    {
                        label: this.props.Login.masterData.selectedInstrument.sinstrumentname,
                        value: this.props.Login.masterData.selectedInstrument.ninstrumentcode,
                        item: this.props.Login.masterData.selectedInstrument
                    } : ""
                let sinstrumentname = selectedInstrument.item;
                //selectedRecord = { ...this.state.selectedRecord, sinstrumentname, ...selectedRecord };
                selectedRecord = { ...selectedRecord, sinstrumentname };
                isStateChanged = true;


            }

            if (this.props.Login.masterData.selectedInstrumentId !== previousProps.Login.masterData.selectedInstrumentId) {
                selectedInstrumentId = this.props.Login.masterData.selectedInstrumentId ?
                    {
                        label: this.props.Login.masterData.selectedInstrumentId.sinstrumentid,
                        value: this.props.Login.masterData.selectedInstrumentId.ninstrumentcode,
                        item: this.props.Login.masterData.selectedInstrumentId
                    } : undefined
                let sinstrumentid = selectedInstrumentId && selectedInstrumentId.item;
                //selectedRecord = { ...this.state.selectedRecord, sinstrumentid, ...selectedRecord };
                selectedRecord = { ...selectedRecord, sinstrumentid };
                isStateChanged = true;


            }

            if (this.props.Login.masterData.ProjectCode !== previousProps.Login.masterData.ProjectCode) {
                selectedProjectcode = this.props.Login.masterData.selectedProjectedCode ?
                    {
                        label: this.props.Login.masterData.selectedProjectedCode.sprojectcode,
                        value: this.props.Login.masterData.selectedProjectedCode.nprojectmastercode,
                        item: this.props.Login.masterData.selectedProjectedCode
                    } : undefined
                let sprojectcode = selectedProjectcode && selectedProjectcode.item;
                selectedRecord = { ...this.state.selectedRecord, sprojectcode, ...selectedRecord };
                isStateChanged = true;


            }


            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.setState({ userRoleControlRights, controlMap });
                isStateChanged = true;
            }

            if (this.props.Login.selectedComponentList !== previousProps.Login.selectedComponentList) {
                addedComponentList = this.props.Login.selectedComponentList;
                isStateChanged = true;
                // this.setState({ addedComponentList });
            }


            if (this.props.Login.masterData.defaultApprovalConfigVersion !== previousProps.Login.masterData.defaultApprovalConfigVersion) {
                ApprovalVersionValue = this.props.Login.masterData.defaultApprovalConfigVersion ?
                    {
                        label: this.props.Login.masterData.defaultApprovalConfigVersion.sversionname,
                        value: this.props.Login.masterData.defaultApprovalConfigVersion.napprovalconfigversioncode,
                        item: this.props.Login.masterData.defaultApprovalConfigVersion
                    } : ""
                isStateChanged = true;
            }

            if (this.props.Login.masterData.defaultFilterStatus !== previousProps.Login.masterData.defaultFilterStatus) {
                FilterStatusValue = this.props.Login.masterData.defaultFilterStatus ?
                    {
                        label: this.props.Login.masterData.defaultFilterStatus.sfilterstatus,
                        value: this.props.Login.masterData.defaultFilterStatus.ntransactionstatus,
                        item: this.props.Login.masterData.defaultFilterStatus
                    } : ""
                isStateChanged = true;
            }

            if (this.props.Login.masterData.selectedSection !== previousProps.Login.masterData.selectedSection) {
                selectedSection = this.props.Login.masterData.selectedSection ?
                    {
                        label: this.props.Login.masterData.selectedSection.ssectionname,
                        value: this.props.Login.masterData.selectedSection.nsectioncode,
                        item: this.props.Login.masterData.selectedSection
                    } : ""
                let ssectionname = selectedSection.item;
                selectedRecord = { ...this.state.selectedRecord, ssectionname, ...selectedRecord };
                isStateChanged = true;

            }

            if (this.props.Login.masterData.selectedMaterialType !== previousProps.Login.masterData.selectedMaterialType) {
                selectedMaterialType = this.props.Login.masterData.selectedMaterialType ?
                    {
                        label: this.props.Login.masterData.selectedMaterialType.smaterialtypename,
                        value: this.props.Login.masterData.selectedMaterialType.nmaterialtypecode,
                        item: this.props.Login.masterData.selectedMaterialType
                    } : ""
                selectedRecord["smaterialtypename"] = this.props.Login.masterData.selectedMaterialType.smaterialtypename;
                isStateChanged = true;
            }

            if (this.props.Login.masterData.selectedMaterialCategory !== previousProps.Login.masterData.selectedMaterialCategory) {
                selectedMaterialCategory = this.props.Login.masterData.selectedMaterialCategory ?
                    {
                        label: this.props.Login.masterData.selectedMaterialCategory.smaterialcatname,
                        value: this.props.Login.masterData.selectedMaterialCategory.nmaterialcatcode,
                        item: this.props.Login.masterData.selectedMaterialCategory
                    } : ""
                selectedRecord["smaterialcatname"] = this.props.Login.masterData.selectedMaterialCategory.smaterialcatname;
                isStateChanged = true;

            }

            if (this.props.Login.masterData.selectedMaterial !== previousProps.Login.masterData.selectedMaterial) {
                selectedMaterial = this.props.Login.masterData.selectedMaterial ?
                    {
                        label: this.props.Login.masterData.selectedMaterial.smaterialname,
                        value: this.props.Login.masterData.selectedMaterial.nmaterialcode,
                        item: this.props.Login.masterData.selectedMaterial
                    } : ""
                selectedRecord["smaterialname"] = this.props.Login.masterData.selectedMaterial.smaterialname;
                isStateChanged = true;
            }

            if (this.props.Login.masterData.selectedMaterialInventory !== previousProps.Login.masterData.selectedMaterialInventory) {
                selectedMaterialInventory = this.props.Login.masterData.selectedMaterialInventory ?
                    {
                        label: this.props.Login.masterData.selectedMaterialInventory.sinventoryid,
                        value: this.props.Login.masterData.selectedMaterialInventory.nmaterialinventtranscode,
                        item: this.props.Login.masterData.selectedMaterialInventory
                    } : ""
                selectedRecord["sinventoryid"] = this.props.Login.masterData.selectedMaterialInventory && this.props.Login.masterData.selectedMaterialInventory.sinventoryid != null ?
                    this.props.Login.masterData.selectedMaterialInventory.sinventoryid : "";
                isStateChanged = true;
            }

            if (this.props.Login.masterData.selectedInventoryUnit !== previousProps.Login.masterData.selectedInventoryUnit) {
                //selectedRecord["selectedInventoryUnit"] =this.props.Login.selectedRecord.selectedInventoryUnit;
                selectedRecord["savailablequatity"] = this.props.Login.masterData.selectedInventoryUnit &&
                    this.props.Login.masterData.selectedInventoryUnit.savailablequatity != null ? this.props.Login.masterData.selectedInventoryUnit.savailablequatity : "";
                selectedRecord["susedquantity"] = "";
                selectedRecord["sremarks"] = "";
                isStateChanged = true;
            }

            if (this.props.Login.isselectedrecordempty) {
                selectedRecord = {};
                isStateChanged = true;
            }


            if (this.props.Login.masterData.Specification !== previousProps.Login.masterData.Specification) {
                //selectedRecord["selectedInventoryUnit"] =this.props.Login.selectedRecord.selectedInventoryUnit;
                Specification = this.props.Login.masterData.Specification &&
                    this.props.Login.masterData.Specification != null ? this.props.Login.masterData.Specification : "";
                isStateChanged = true;
            }

            if (this.props.Login.selectedSpec !== previousProps.Login.selectedSpec) {
                selectedRecord["selectedSpec"] = this.props.Login.selectedSpec &&
                    this.props.Login.selectedSpec != null ? this.props.Login.selectedSpec : "";
                isStateChanged = true;
            }

            if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
                selectedRecord = this.props.Login.selectedRecord
                isStateChanged = true;
            }
            else if (this.props.Login.selectedFilter !== previousProps.Login.selectedFilter) {
                this.setState({ selectedFilter: this.props.Login.selectedFilter });
            }

            if (this.props.Login.masterData.DynamicDesign && this.props.Login.masterData.DynamicDesign !== previousProps.Login.masterData.DynamicDesign) {
                const dynamicColumn = JSON.parse(this.props.Login.masterData.DynamicDesign.
                    jsondata.value)
                testGridArnoItems = dynamicColumn.testListFields.testlistitem ? dynamicColumn.testListFields.testlistitem : [];
                testGridItem[0] = dynamicColumn.testListFields.releasetestfields[0] ? dynamicColumn.testListFields.releasetestfields[0] : [];
                sampleGridItem = dynamicColumn.samplegriditem ? dynamicColumn.samplegriditem : [];
                subsampleGridItem = dynamicColumn.subsamplelistitem ? dynamicColumn.subsamplelistitem : [];
                samplegridmoreitem = dynamicColumn.samplegridmoreitem ? dynamicColumn.samplegridmoreitem : [];
                DynamicGridMoreItem = [...samplegridmoreitem]
                DynamicGridItem = [...sampleGridItem, ...subsampleGridItem, ...testGridArnoItems.slice(1), ...testGridItem]
                isStateChanged = true;
            }

           
        }
 //ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid

 if(this.props.Login.dataState!==previousProps.Login.dataState){
    if (this.props.Login.dataState) {
        delete (this.props.Login.dataState.filter)
        delete (this.props.Login.dataState.sort)
        this.setState({ dataState: this.props.Login.dataState });
      }
  }
//ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid

  if (this.props.Login.addedSamplesListSortedList !== previousProps.Login.addedSamplesListSortedList) {
    this.setState({ addedSamplesListSortedList: this.props.Login.addedSamplesListSortedList,isInitialRender:true });
  }

        // if(this.props.Login.selectedRecord !== previousProps.Login.selectedRecord){
        //     // let selectedRecord = {};
        //     let MaterialCategory=constructOptionList(this.props.Login.selectedRecord.MaterialCategory || [], 'nmaterialcatcode', 'smaterialcatname',
        //     'ascending', 'nmaterialcatcode', false);
        //     let Material =constructOptionList(this.props.Login.selectedRecord.Material || [], 'nmaterialcode', 'smaterialname',
        //     'ascending', 'nmaterialcode', false);
        //     let MaterialInventory=constructOptionList(this.props.Login.selectedRecord.MaterialInventory || [], 'nmaterialinventorycode', 'sinventoryid',
        //     'ascending', 'nmaterialinventorycode', false);
        //      MaterialCategory = MaterialCategory.get("OptionList")
        //      Material = Material.get("OptionList")
        //      MaterialInventory = MaterialInventory.get("OptionList")

        //      selectedRecord["MaterialCategory"]=MaterialCategory
        //      selectedRecord["Material"]=Material
        //      selectedRecord["MaterialInventory"]=MaterialInventory

        //  if(this.props.Login.selectedRecord.selectedMaterialType !== previousProps.Login.selectedRecord.selectedMaterialType) {
        //         let selectedMaterialType = this.props.Login.selectedRecord.selectedMaterialType ?
        //         {
        //             label: this.props.Login.selectedRecord.selectedMaterialType.smaterialtypename || this.props.Login.selectedRecord.selectedMaterialType.item.smaterialtypename,
        //             value: this.props.Login.selectedRecord.selectedMaterialType.nmaterialtypecode || this.props.Login.selectedRecord.selectedMaterialType.item.value,
        //             item:  this.props.Login.selectedRecord.selectedMaterialType.item ? this.props.Login.selectedRecord.selectedMaterialType.item : this.props.Login.selectedRecord.selectedMaterialType
        //         }:""
        //         selectedRecord["selectedMaterialType"]=selectedMaterialType;
        //         selectedRecord["smaterialtypename"]=this.props.Login.selectedRecord.selectedMaterialType.smaterialtypename || this.props.Login.selectedRecord.selectedMaterialType.item.smaterialtypename;
        //         isStateChanged = true;
        //     }

        //  if (this.props.Login.selectedRecord.selectedMaterialCategory !== previousProps.Login.selectedRecord.selectedMaterialCategory) {
        //         let selectedMaterialCategory = this.props.Login.selectedRecord.selectedMaterialCategory ?
        //         {
        //             label: this.props.Login.selectedRecord.selectedMaterialCategory.smaterialcatname || this.props.Login.selectedRecord.selectedMaterialCategory.item.smaterialcatname ,
        //             value: this.props.Login.selectedRecord.selectedMaterialCategory.nmaterialcatcode || this.props.Login.selectedRecord.selectedMaterialCategory.item.value ,
        //             item:  this.props.Login.selectedRecord.selectedMaterialCategory.item  ? this.props.Login.selectedRecord.selectedMaterialCategory.item  : this.props.Login.selectedRecord.selectedMaterialCategory 
        //         }:""
        //         selectedRecord["selectedMaterialCategory"]=selectedMaterialCategory;
        //         selectedRecord["smaterialcatname"]=this.props.Login.selectedRecord.selectedMaterialCategory.smaterialcatname || this.props.Login.selectedRecord.selectedMaterialCategory.item.smaterialcatname 
        //         isStateChanged = true;
        //     }

        //     if (this.props.Login.selectedRecord.selectedMaterial !== previousProps.Login.selectedRecord.selectedMaterial) {
        //          let selectedMaterial = this.props.Login.selectedRecord.selectedMaterial ?
        //         {
        //             label: this.props.Login.selectedRecord.selectedMaterial.smaterialname,
        //             value: this.props.Login.selectedRecord.selectedMaterial.nmaterialcode,
        //             item: this.props.Login.selectedRecord.selectedMaterial
        //         }:""
        //         selectedRecord["selectedMaterial"]= selectedMaterial;
        //         selectedRecord["smaterialname"]=this.props.Login.selectedRecord.selectedMaterial.smaterialname;
        //         isStateChanged = true;
        //     }

        //     if (this.props.Login.selectedRecord.selectedMaterialInventory !== previousProps.Login.selectedRecord.selectedMaterialInventory) {
        //         let selectedMaterialInventory = this.props.Login.selectedRecord.selectedMaterialInventory ?
        //         {
        //             label: this.props.Login.selectedRecord.selectedMaterialInventory.sinventoryid,
        //             value: this.props.Login.selectedRecord.selectedMaterialInventory.nmaterialinventorycode,
        //             item: this.props.Login.selectedRecord.selectedMaterialInventory
        //         }:""
        //         selectedRecord["selectedMaterialInventory"]= selectedMaterialInventory;
        //         selectedRecord["sinventoryid"]=this.props.Login.selectedRecord.selectedMaterialInventory.sinventoryid;
        //         isStateChanged = true;
        //     }


            //ALPD-5137--Vignesh R(19-01-2025)---Including filter in Data selection Kendo Grid
            let updateStateObject = {};
            if (this.props.Login.addedSamplesList !== previousProps.Login.addedSamplesList) {

            addSelectAll = false;
            deleteSelectAll = true;

            this.setState({
                addedSamplesList: this.props.Login.addedSamplesList,
                addSelectAll, deleteSelectAll
            });
            }

            //ALPD-5137--Vignesh R(19-01-2025)---Including filter in Data selection Kendo Grid
        if (this.props.Login.addedSamplesList !== previousProps.Login.addedSamplesList) {

            addSelectAll = false;
            deleteSelectAll = true;

            this.setState({
                addedSamplesList: this.props.Login.addedSamplesList,
                addSelectAll, deleteSelectAll
            });
            }

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            isStateChanged = true;
            selectedRecord = this.props.Login.selectedRecord;
            //this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }



        if (isStateChanged) {
            this.setState({
                userRoleControlRights, controlMap, selectedRecord,
                filterData, addedComponentList,
                filterStatusList, dataState, sahDataState, bahDataState, chDataState,
                testCommentDataState, SampleType, RegistrationType, RegistrationSubType,
                BCFilterStatus, REJobStatus, Testvalues, ApprovalConfigVersion, skip, take,
                testskip, testtake, selectedFilter, selectedInstCategory, InstrumentCategory,
                Instrument, selectedInstrument, selectedTestSynonym, nregsubtypecode,
                ProductCategory, selectedProductCategory, Product, selectedProduct, samples,
                addSelectAll, deleteSelectAll, ApprovalVersionValue, FilterStatusValue, Section,
                selectedSection, sampleGridItem, subsampleGridItem, testGridItem, DynamicGridItem,
                samplegridmoreitem, DynamicGridMoreItem, MaterialCategory, selectedMaterialType,
                Material, selectedMaterial, selectedMaterialCategory, MaterialInventory,
                selectedMaterialInventory, Specification, selectedSpec, addedSamplesList,
                testGridArnoItems, InstrumentID, selectedInstrumentId, sinstrumentid,
                selectedProjectcode, ProjectCode
            });
        }
    }

    //  ALPD-5719   Added componentwillunmount by Vishakh
    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, batchactiveKey: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let openSpecModal = this.props.Login.openSpecModal;

        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "cancel") {
                //    this.props.Login.operation === "complete") {
                loadEsign = false;
                openModal = false;
            }
            else {
                loadEsign = false;
            }
            selectedRecord["esigncomments"] = "";
            selectedRecord["esignpassword"] = "";
        } else if (this.props.Login.openSpecModal) {
            loadEsign = false;
            openSpecModal = false;
            //ALPD-5873  for Default Spec Work. Added by Abdul on 04-06-2025
            selectedRecord={...this.props.Login.selectedSpec};
        }
        else {
            openModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, openSpecModal, selectedId: null }
        }
        this.props.updateStore(updateInfo);

    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        let { selectedInstCategory, selectedInstrumentId, InstrumentCategory,
            selectedInstrument, Instrument, InstrumentID } = this.state;
        let inputData = {};
        if (comboData == null) {
            selectedInstCategory = undefined;
            selectedInstrumentId = undefined;
            Instrument = undefined;
            InstrumentID = undefined;
            selectedInstrument = undefined;
            selectedRecord['sinstrumentcatname'] = undefined;
            selectedRecord['sinstrumentname'] = undefined;
            selectedRecord['sinstrumentid'] = undefined;

            this.setState({
                selectedInstCategory, selectedInstrumentId, selectedInstrument,
                selectedRecord, Instrument, InstrumentID
            });
        } else {
            selectedRecord[fieldName] = comboData.item;
            if (fieldName === "sproductname") {
                let isAlertUpdate = false;
                if (this.state.selectedProduct !== undefined && this.state.selectedProduct.value !== comboData.value) {

                    if (this.props.Login.operation === "update") {
                        selectedRecord["nproductcode"] = comboData.value;
                        selectedRecord["userInfo"] = this.props.Login.userInfo;
                        selectedRecord["stestname"] = this.state.selectedRecord['stestname'];
                        selectedRecord["ntestcode"] = this.state.selectedRecord['stestname']['ntestcode'];
                        selectedRecord["nsampletypecode"] = this.props.Login.masterData.realSampleTypeValue ?
                            this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA;
                        //selectedRecord["nsampletypecode"]=this.props.Login.masterData.defaultSampleType ? this.props.Login.masterData.defaultSampleType.nsampletypecode : transactionStatus.NA;
                        selectedRecord['naddcontrolCode'] = this.props.Login.naddcontrolCode;
                        selectedRecord["nregtypecode"] = this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA;
                        selectedRecord["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.sregsubtypename ? this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA;
                        //this.setState({ selectedProduct:comboData });
                        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_WANTTOCHANGESAMPLE" }),
                            this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
                            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                            () => this.props.getProductBasedInstrument(selectedRecord, this.props.Login.masterData),
                            () => this.props.getProductBasedInstrument(selectedRecord, this.props.Login.masterData));
                    } else {
                        selectedRecord["nproductcode"] = comboData.value;
                        selectedRecord["userInfo"] = this.props.Login.userInfo;
                        selectedRecord["stestname"] = this.state.selectedRecord['stestname'];
                        selectedRecord["ntestcode"] = this.state.selectedRecord['stestname']['ntestcode'];
                        selectedRecord["nsampletypecode"] = this.props.Login.masterData.realSampleTypeValue ?
                            this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA;
                        //selectedRecord["nsampletypecode"]=this.props.Login.masterData.defaultSampleType ? this.props.Login.masterData.defaultSampleType.nsampletypecode : transactionStatus.NA;
                        selectedRecord['naddcontrolCode'] = this.props.Login.naddcontrolCode;
                        selectedRecord["nregtypecode"] = this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA;
                        selectedRecord["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.sregsubtypename ? this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA;
                        //this.setState({ selectedProduct:comboData });

                        this.props.getProductBasedInstrument(selectedRecord, this.props.Login.masterData);

                    }
                }
            } else if (fieldName === "ssectionname") {
                inputData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA;
                inputData["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode ? this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA;
                inputData['naddcontrolCode'] = this.props.Login.naddcontrolCode;
                inputData['section'] = selectedRecord.ssectionname;
                inputData['userInfo'] = this.props.Login.userInfo;
                inputData['nneedmyjob'] = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.nneedmyjob : false
                inputData['nneedjoballocation'] = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.nneedjoballocation : false
                inputData["nsampletypecode"] = this.props.Login.masterData.realSampleTypeValue ?
                    this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA;
                this.props.getTestInstrumentComboService(inputData, this.props.Login.masterData);
                // this.setState({ selectedSection:comboData });

            } else if (fieldName === "stestname") {
                if (this.props.Login.operation === "update") {
                    selectedRecord["nprevioustestcode"] = this.state.selectedTestSynonym.value
                }
                selectedRecord["ntestcode"] = comboData.value;
                selectedRecord['userInfo'] = this.props.Login.userInfo;
                selectedRecord["nsampletypecode"] = this.props.Login.masterData.realSampleTypeValue ?
                    this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA;
                //selectedRecord["nsampletypecode"]=this.props.Login.masterData.defaultSampleType ? this.props.Login.masterData.defaultSampleType.nsampletypecode : transactionStatus.NA;
                selectedRecord['naddcontrolCode'] = this.props.Login.naddcontrolCode;
                selectedRecord["nprojectmastercode"] = comboData.item.nprojectmastercode;
                selectedRecord['sinstrumentcatname'] = undefined;
                selectedRecord["nregtypecode"] = this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA;
                selectedRecord["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.sregsubtypename ? this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA;
                this.props.getTestInstrumentCategory(selectedRecord, this.props.Login.masterData);
            } else if (fieldName === "sinstrumentcatname") {
                selectedRecord["ninstrumentcatcode"] = comboData.value;
                selectedRecord["ncalibrationreq"] = comboData.item.ncalibrationreq;
                selectedRecord["ntestcode"] = this.state.selectedTestSynonym.value;
                selectedRecord['userInfo'] = this.props.Login.userInfo;
                //selectedRecord['sinstrumentid']=undefined;
                selectedRecord['sinstrumentname'] = undefined;
                this.props.getInstrumentForInstCategory(selectedRecord, this.props.Login.masterData);
                //this.props.getInstrumentID(selectedRecord,this.props.Login.masterData);
            } else if (fieldName === "smaterialcatname") {
                selectedRecord["nmaterialcatcode"] = comboData.value;
                selectedRecord["needsectionwise"] = comboData.item.needSectionwise;
                selectedRecord['userInfo'] = this.props.Login.userInfo;
                selectedRecord['nsectioncode'] = this.props.Login.masterData.SelectedBatchmaster.nsectioncode;
                selectedRecord['ntestcode'] = this.props.Login.masterData.SelectedBatchmaster.ntestcode;
                this.setState({ selectedMaterialCategory: comboData });
                this.props.getMaterialBasedOnMaterialCategory(selectedRecord, this.props.Login.masterData, this.state.selectedMaterialCategory);
            } else if (fieldName === "smaterialname") {
                selectedRecord["nmaterialcode"] = comboData.value;
                selectedRecord['userInfo'] = this.props.Login.userInfo;
                selectedRecord['needsection'] = comboData.item.needsection;
                selectedRecord['nsectioncode'] = this.props.Login.masterData.SelectedBatchmaster.nsectioncode;
                selectedRecord['ntestcode'] = this.props.Login.masterData.SelectedBatchmaster.ntestcode;
                this.setState({ selectedMaterial: comboData });
                this.props.getMaterialInventoryBasedOnMaterial(selectedRecord, this.props.Login.masterData, this.state.selectedMaterialCategory);

            } else if (fieldName === "sinventoryid") {
                selectedRecord["nmaterialcode"] = this.state.selectedMaterial.value;
                selectedRecord["materialInvCode"] = comboData.item.nmaterialinventorycode;
                selectedRecord['userInfo'] = this.props.Login.userInfo;
                selectedRecord['needsection'] = this.props.Login.masterData.selectedMaterial.needsection;
                this.setState({ selectedMaterialInventory: comboData });
                // if(this.state.selectedMaterial.item.needsection == transactionStatus.NO){
                //     selectedRecord['nsectioncode']=transactionStatus.NA;
                // }else{
                selectedRecord['nsectioncode'] = this.props.Login.masterData.SelectedBatchmaster.nsectioncode;
                //}
                this.props.getMaterialAvailQtyBasedOnInv(selectedRecord, this.props.Login.masterData, this.state.selectedMaterialCategory);
            } else if (fieldName === "sinstrumentname") {
                selectedRecord["ninstrumentnamecode"] = comboData.value;
                selectedRecord["sinstrumentname"] = comboData.label;
                selectedRecord['userInfo'] = this.props.Login.userInfo;
                //selectedRecord['sinstrumentid']=undefined;
                selectedRecord['selectedInstrument'] = comboData.item;
                selectedRecord['ninstrumentcatcode'] = comboData.item.ninstrumentcatcode;
                selectedRecord['ninstrumentcode'] = comboData.item.ninstrumentcode;
                this.props.getInstrumentID(selectedRecord, this.props.Login.masterData);
            } else if (fieldName === "sprojectcode") {
                this.setState({ selectedProjectcode: comboData });
            } else {
                this.setState({ selectedInstrumentId: comboData });
            }
            // else{
            //    // let nInstrumentCategory="",nInstrument="",nInstrumentID="";
            //     this.setState=({InstrumentCategory:{},Instrument:{},
            //         InstrumentID:})
            //   }
        }
    }

    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            else
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;

        }
        else {
            selectedRecord[event.target.name] = event.target.value;

        }
        this.setState({ selectedRecord });
    }

    onMultiColumnValue = (value, key, flag, label, keys) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (value.length > 0) {
            key.forEach(objarray => {
                selectedRecord[objarray] = value[0][objarray];
            });
            if (flag) {
                keys.map((objkey, index) => {
                    return selectedRecord[objkey] = { "label": value[0][label[index]], "value": value[0][objkey] }
                })
            }
        } else {
            key.forEach(objarray => {
                selectedRecord[objarray] = "";
            });
            keys.map((objkey, index) => {
                return selectedRecord[objkey] = ""
            })
        }
        this.props.getBatchManufacturerComboChange(selectedRecord, this.props.Login.userInfo);
    }

    onMultiColumnMAHChange = (value, key) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (value.length > 0) {
            key.forEach(objarray => {
                selectedRecord[objarray] = value[0][objarray];
            });
        }
        this.setState({ selectedRecord });
    }

    clearComponentInput = () => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord["nproductcode"] = undefined;
        selectedRecord["ncomponentcode"] = undefined;
        selectedRecord["smanuflotno"] = "";
        selectedRecord["dateprompt"] = transactionStatus.NO;
        selectedRecord["transdatefrom"] = this.props.Login.componentDefaultSearchDate;
        selectedRecord["transdateto"] = this.props.Login.componentDefaultSearchDate;
        this.setState({ selectedRecord });
    }

    openClosePortal = () => {
        if (this.props.Login.masterData.SelectedBatchmaster.ninstrumentcode !== transactionStatus.NA) {
            if (this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus == transactionStatus.INITIATED) {
                if (this.props.Login.openELNSheet === undefined || !this.props.Login.openELNSheet) {
                    if (this.props.Login.elnUserInfo !== null || this.props.Login.elnUserInfo != undefined) {
                        this.props.Login.masterData.enlLink = "";
                        let integrationSettings = this.props.Login.integrationSettings;
                        let inputParam = {
                            userInfo: this.props.Login.userInfo,
                            elnUserInfo: this.props.Login.elnUserInfo,
                            elnSite: this.props.Login.elnSite,
                            nbatchmastercode: this.props.Login.masterData.SelectedBatchmaster.sbatcharno,
                            ntestcode: this.props.Login.masterData.ntestcode
                        }
                        let link = "";

                        let detail = CF_encryptionData("-1//Sheet").EncryptData;

                        const settedId = inputParam.nbatchmastercode;
                        //console.log(settedId);
                        let encryptedbatchid = CF_encryptionData(settedId).EncryptData;
                        const userObject = {
                            usercode: inputParam.elnUserInfo.nelncode,
                            username: inputParam.elnUserInfo.selnuserid,
                            userfullname: inputParam.elnUserInfo.selnusername,
                            lsusergroup: {
                                usergroupcode: inputParam.elnUserInfo.nelnusergroupcode,
                                usergroupname: inputParam.elnUserInfo.nelnusergroupcode,
                            },
                            lssitemaster: {
                                sitecode: inputParam.elnSite.nelnsitecode
                            }
                        }
                        let encrypteduser = CF_encryptionData(userObject).EncryptData;
                        const baseURL = integrationSettings[1].slinkname

                        link = baseURL + "/vieworder" + '#{"d":"' + settedId + '","user":"' + encrypteduser + '","batchid":"' + encryptedbatchid + '"}';
                        // this.props.getELNTestValidation(test,this.props.Login.integrationSettings); 
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                openELNSheet: true,
                                masterData: {
                                    ...this.props.Login.masterData,
                                    enlLink: link,
                                    baseURL: baseURL
                                }
                            }
                        }
                        this.props.updateStore(updateInfo);
                    } else {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_ELNSHEETNOTFOUND" }));
                    }
                } else {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            openELNSheet: false,
                            masterData: {
                                ...this.props.Login.masterData,
                                enlLink: ""
                            }
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTINITIATEDBATCH" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTBATCHWITHINSTRUMENT" }));
        }
    }

    handleDateChange = (dateName, dateValue) => {
        let selectedRecord = {};
        if (dateValue === null) {
            dateValue = new Date();
        }
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    onDropImage = (attachedFiles, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = attachedFiles;
        this.setState({ selectedRecord, actionType: "new" });
    }

    saveSample = (addedSamplesListSortedList) => {
        const compList = addedSamplesListSortedList.map(x => {
            delete (x.selected);
            //return {...x, 'sregistereddate':formatInputDate(x.sregistereddate, false)}
            return x;
          }) || [];
        if (compList === undefined) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTOSUBMIT" }));
        } else if (compList.length > 0) {
            let sampleArray = [];
            compList.map(item =>
                sampleArray.push({
                    npreregno: item.npreregno,
                    ntransactionsamplecode: item.ntransactionsamplecode,
                    ntransactiontestcode: item.ntransactiontestcode,
                    nbatchmastercode: this.props.Login.masterData.SelectedBatchmaster ?
                        this.props.Login.masterData.SelectedBatchmaster.nbatchmastercode : transactionStatus.NA,
                    sarno: item.jsonuidata.samplelist.sarno,
                    ssamplearno: item.jsonuidata.samplelist.ssamplearno,
                    stestname: item.jsonuidata.samplelist.stestname,
                    jsonuidata: {
                        samplelist: item.jsonuidata.samplelist,
                    },
                    jsondata: {
                        samplelist: item.jsondata.samplelist,
                    }
                }
                )
            )

            let nbatchmastercode = this.props.Login.masterData.SelectedBatchmaster &&
                this.props.Login.masterData.SelectedBatchmaster.nbatchmastercode;
            // batchSample = {
            //     npreregno: addedsamplelist.map(sample=>sample.npreregno).join(","),
            //     ntransactionsamplecode : addedsamplelist.map(sample=>sample.ntransactionsamplecode).join(","),
            //     ntransactiontestcode : addedsamplelist.map(sample=>sample.ntransactiontestcode).join(","),
            //     npreregno : addedsamplelist.map(sample=>sample.npreregno).join(","),
            //     nbatchmastercode: this.props.Login.masterData.SelectedBatchmaster &&
            //     this.props.Login.masterData.SelectedBatchmaster.nbatchmastercode,
            //     jsonuidata :'{ "batchSample" : this.props.Login.masterData.SelectedBatchmaster}',
            //     jsondata :'{ "batchSample" : this.props.Login.masterData.SelectedBatchmaster}'
            // }
            //jsondata : 

            const inputParam = {
                inputData: {
                    batchSample: nbatchmastercode,
                    sampleArray,
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    nregtypecode: this.props.Login.masterData.defaultRegistrationType ?
                        this.props.Login.masterData.defaultRegistrationType.nregtypecode : transactionStatus.NA,
                    nregsubtypecode: this.state.nregsubtypecode ? this.state.nregsubtypecode.item.nregsubtypecode
                        : transactionStatus.NA,
                    ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode || transactionStatus.NA
                }
            }
            this.props.createSampleAction(inputParam.inputData);
        }  else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELCETONESAMPLE" }));
        }

    }

    onSaveClick = (saveType, formRef) => {

        if (this.props.Login.operation === "createSample") {
            this.saveSample(this.state.addedSamplesListSortedList)
        } else if (this.props.Login.operation === "initiate") {
            this.testStartActions(this.props.Login.masterData.SelectedBatchmaster, this.props.Login.testStartId)
        } else if (this.props.Login.operation === "complete") {
            this.batchCompleteActions(this.props.Login.masterData.SelectedBatchmaster, this.props.Login.completeId)
        } else if (this.props.Login.operation === "createiqcsample") {
            this.batchSaveIQCActions(this.props.Login.masterData.SelectedBatchmaster)
        } else {
            let inputData = {};
            let obj = convertDateValuetoString(this.state.selectedFilter.fromDate || this.props.Login.masterData.realFromDate,
                this.state.selectedFilter.toDate || this.props.Login.masterData.realToDate, this.props.Login.userInfo);
            if (this.props.Login.operation === "create") {
                inputData["fromDate"] = obj.fromDate;
                inputData["toDate"] = obj.toDate;
            }

            inputData["userinfo"] = this.props.Login.userInfo;
            inputData["nneedcombodataforFilter"] = "true"
            inputData["needFilterSubmit"] = "false"
            inputData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA;
            inputData["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode ?
                this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA;
            inputData["nsampletypecode"] = this.props.Login.masterData.realSampleTypeValue ?
                this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA;
            inputData["nprevioustestcode"] = this.state.selectedRecord && this.state.selectedRecord.nprevioustestcode != undefined ? this.state.selectedRecord.nprevioustestcode : this.state.selectedTestSynonym.value;
            inputData["ntestcode"] = this.state.selectedTestSynonym ? this.state.selectedTestSynonym.value : transactionStatus.NA;
            inputData["nsectioncode"] = this.state.selectedSection ? this.state.selectedSection.item.nsectioncode : transactionStatus.NA;
            //inputData["nsampletypecode"]=this.props.Login.masterData.defaultSampleType.nsampletypecode;
            //inputData["nregtypecode"]=this.props.Login.masterData.defaultRegistrationType.nregtypecode;
            //inputData["nregsubtypecode"]=this.state.nregsubtypecode ? this.state.nregsubtypecode.value :transactionStatus.NA;
            inputData["ninstrumentcatcode"] = this.state.selectedInstCategory ? this.state.selectedInstCategory.value : transactionStatus.NA;
            inputData["ninstrumentcode"] = this.state.selectedInstrument ? this.state.selectedInstrument.value : transactionStatus.NA;
            inputData["nproductcode"] = this.state.selectedProduct ? this.state.selectedProduct.value : transactionStatus.NA;
            inputData["ntransactionstatus"] = transactionStatus.DRAFT;
            inputData["sbatcharno"] = '-';
            // inputData["defaultSampleType"]=this.props.Login.masterData.realSampleTypeValue ? 
            // this.props.Login.masterData.realSampleTypeValue : transactionStatus.NA;
            // inputData["defaultRegistrationType"]=this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue ? 
            // this.props.Login.masterData.realRegTypeValue : transactionStatus.NA;
            // inputData["defaultRegistrationSubType"]=this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue ? 
            // this.props.Login.masterData.realRegSubTypeValue : transactionStatus.NA;
            inputData["defaultSampleType"] = this.props.Login.masterData.defaultSampleType
            inputData["defaultRegistrationType"] = this.props.Login.masterData.defaultRegistrationType
            inputData["defaultRegistrationSubType"] = this.state.nregsubtypecode ? this.state.nregsubtypecode.item : transactionStatus.NA;
            // inputData["ntranscode"] = this.state.FilterStatusValue ? this.state.FilterStatusValue.value : transactionStatus.DRAFT;
            inputData["ntranscode"] = transactionStatus.DRAFT;


            inputData["sinstrumentid"] = this.state.selectedInstrumentId ? this.state.selectedInstrumentId.label : "NA";
            // inputData["napprovalconfigcode"]=this.state.ApprovalVersionValue ? 
            // this.state.ApprovalVersionValue.item.napprovalconfigcode : transactionStatus.NA;
            // inputData["napprovalversioncode"]=this.state.ApprovalVersionValue ?
            // this.state.ApprovalVersionValue.item.napprovalconfigversioncode : transactionStatus.NA;
            inputData["napprovalversioncode"] = this.props.Login.masterData.realApproveConfigVersion &&
                this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode ? this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode : transactionStatus.NA;
            inputData["napprovalconfigcode"] = this.props.Login.masterData.realApproveConfigVersion &&
                this.props.Login.masterData.realApproveConfigVersion.napprovalconfigcode ? this.props.Login.masterData.realApproveConfigVersion.napprovalconfigcode : transactionStatus.NA;
            inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode ? this.props.Login.masterData.ndesigntemplatemappingcode : transactionStatus.NA;
            inputData["nprojectmastercode"] = this.state.selectedProjectcode ? this.state.selectedProjectcode.value : transactionStatus.NA;
            let postParam = undefined;
            postParam = {
                inputListName: "Batchmaster",
                selectedObject: "SelectedBatchmaster",
                primaryKeyField: "nbatchmastercode",
                unchangeList: ["FromDate", "ToDate"], isSingleGet: true,
                fetchUrl: "batchcreation/getActiveSelectedBatchmaster"
            };
            const inputParam = {
                classUrl: "batchcreation",
                methodUrl: "Batchcreation",
                displayName: "IDS_BATCHCREATION",
                inputData: inputData,
                postParam,
                searchRef: this.searchRef,
                operation: this.props.Login.operation,
                saveType,
                formRef,
            }
            if (this.props.Login.operation === "create") {
                this.searchRef.current.value = "";
                this.props.createBatchmasterAction(inputParam["inputData"], this.props.Login.masterData, inputParam["operation"]);
            } else {
                inputData["nbatchmastercode"] = this.props.Login.masterData.SelectedBatchmaster.nbatchmastercode;
                inputData["SelectedBatchmaster"] = this.props.Login.masterData.SelectedBatchmaster;
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.editId)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: {
                                inputParam,
                                masterData: this.props.Login.masterData
                            },
                            openModal: true,
                            screenName: "IDS_BATCHCREATION",
                            operation: inputParam.operation
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.props.updateBatchcreationAction(inputParam["inputData"], this.props.Login.masterData, inputParam["operation"]);
                }
            }
        }
        // const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        // if (esignNeeded) {
        //     const updateInfo = {
        //         typeName: DEFAULT_RETURN,
        //         data: {
        //             loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
        //             openModal: true, screenName: "IDS_BATCHCREATION",
        //             operation: this.props.Login.operation
        //         }
        //     }
        //     this.props.updateStore(updateInfo);
        // }
        // else {
        //     const selectedRecord = { ...this.state.selectedRecord, sbatchfillinglotno: "" }
        //     this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal", selectedRecord);
        // }
    }

//ALPD-5137--Vignesh R(20-12-2024)---Including filter in Data selection Kendo Grid
//comment by vignesh R
/*addSaveDataGrid = () => {

    let filterdata1=this.state.dataState ?process(this.state.addComponentDataListCopy || [], {...this.state.dataState,take:this.state.samples.length}).data:[];
            let sortListedData1 = filterdata1.filter(x => 
             this.state.addedSamplesList.some(item => item.ntransactiontestcode === x.ntransactiontestcode)
           );
           let exists=this.state.dataState && this.state.dataState.filter!==null && this.state.dataState.filter!==undefined ? sortListedData1.length>0 ? true : false :true;
            if (this.state.addedSamplesList.length > 0 && exists) {
              let addedSamplesListSortedList = [];
              let   updatedList =[];
              let ListedData =[];
              let sortListedData=[];
              if(this.state.dataState && this.state.dataState.filter!==null && this.state.dataState.filter!==undefined){
                let filterdata=process(this.state.addComponentDataListCopy  || this.state.samples ,
                      {...this.state.dataState,take:this.state.samples.length}).data||[];
                 sortListedData = filterdata.filter(x => 
                  this.state.addedSamplesList.some(item => item.ntransactiontestcode === x.ntransactiontestcode)
                );
                 updatedList = filterdata.filter(
                  (item) => !sortListedData.some(
                    (addedItem) => addedItem.ntransactiontestcode === item.ntransactiontestcode
                  )
                );
                 updatedList.map(x =>{if(x.selected){ 
                    
                    ListedData.push({...x,'jsondata':{
                        'samplelist':x
                      },'jsonuidata':{
                        'samplelist':x
                      }});
                
                
                
                }});
        
              }else{
               updatedList = this.state.samples.filter(
                (item) => !this.state.addedSamplesList.some(
                  (addedItem) => addedItem.ntransactiontestcode === item.ntransactiontestcode
                )
              );
              ListedData=[];
              sortListedData= this.state.addedSamplesList;
            }
              if (this.state.addedSamplesListSortedList.length > 0) {
                this.state.addedSamplesListSortedList.map(item => {
                    const newItem = JSON.parse(JSON.stringify(item));
                    newItem["jsondata"] = {}
                    newItem["jsonuidata"] = {}
                    newItem["selected"] = false;
                    newItem["jsondata"]['samplelist'] = {...item,selected:false}
                    newItem["jsonuidata"]['samplelist'] = {...item,selected:false}
                   addedSamplesListSortedList.push(newItem)
                })
              }
              sortListedData.map(item => {
                const newItem = JSON.parse(JSON.stringify(item));
                newItem["jsondata"] = {}
                newItem["jsonuidata"] = {}
                newItem["selected"] = false;
                newItem["jsondata"]['samplelist'] = {...item,selected:false}
                newItem["jsonuidata"]['samplelist'] = {...item,selected:false}
                addedSamplesListSortedList.push(newItem)

                })
              this.setState({
                samples: updatedList, addSelectAll: this.valiateCheckAll(updatedList)
                , addedSamplesListSortedList: addedSamplesListSortedList
                , addedSamplesList: ListedData,addComponentDataListCopy:this.valiateCopy(addedSamplesListSortedList||[],updatedList||[],ListedData||[]) 
              })
            } else {
              toast.warn(this.props.intl.formatMessage({ id: "IDS_SELCETONESAMPLE" }));
            }
      }
*/
//ALPD-5137--Vignesh R(20-12-2024)---Including filter in Data selection Kendo Grid
//comment by vignesh R
     /* valiateCopy(sortedList,addComponentDataList,addedSamplesList){
        let addedSamplesLists=addedSamplesList||this.state.addedSamplesList||[];
        let listData = this.props.Login.masterData.samples || [];
        let copyingList = listData.filter(item1 => 
          !sortedList.some(item2 => item1.ntransactiontestcode === item2.ntransactiontestcode)
        ) ||[];
        let copyingListData = copyingList.map(item => {
          const existsInAddComponentDataList = addedSamplesLists.some(
            item1 => item1.ntransactiontestcode === item.ntransactiontestcode 
          );
         
          if(existsInAddComponentDataList){
            return {...item,selected: true};
          }else{
            return {...item,selected: false};
          }
         
        });
        return copyingListData;
      }*/
   
       //ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid
//comment by vignesh R
   
/*handleClickDelete = (row) => {
        let updatedAddList=[];
        const ntransactiontestcode = row.dataItem.ntransactiontestcode;
        const updatedList = this.state.addedSamplesListSortedList.filter(
          (item) => item.ntransactiontestcode !== ntransactiontestcode
        );
    
        const exists = this.state.samples.some(
          (item) => item.ntransactiontestcode === ntransactiontestcode
        );
        if (!exists) {
           updatedAddList = this.state.samples.map(item => {
            return item
          })
           updatedAddList.push({...row.dataItem,selected:false});
        }
        //ALPD-5137--Vignesh R(20-12-2024)---Including filter in Data selection Kendo Grid

        this.setState({ samples: updatedAddList, addedSamplesListSortedList: updatedList ,
            addSelectAll: this.valiateCheckAll(updatedAddList),
            deleteSelectAll:this.valiateCheckAll(updatedAddList),
            addComponentDataListCopy:this.valiateCopy(updatedList||[],updatedAddList||[]) })
    
      }*/
    deleteBatchCreation = (selectedBatch, deleteId, operation) => {
        if (selectedBatch.ntransactionstatus === transactionStatus.COMPLETED ||
            selectedBatch.ntransactionstatus === transactionStatus.INITIATED ||
            selectedBatch.ntransactionstatus === transactionStatus.CANCELLED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_BATCHALREADYINITIATEDCOMPLETED" }));
        }
        else {
            let inputData = {};
            const masterData = this.props.Login.masterData;
            const postParam = {
                inputListName: "Batchmaster",
                selectedObject: "SelectedBatchmaster",
                primaryKeyField: "nbatchmastercode",
                primaryKeyValue: selectedBatch.nbatchmastercode,
                fetchUrl: "batchcreation/getActiveSelectedBatchmaster",
                isSingleGet: true,
                //task: selectedBatch.ntransactionstatus === transactionStatus.DRAFT ? "delete" : "cancel",
                fecthInputObject: {
                    userInfo: this.props.Login.userInfo,
                    ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode ? this.props.Login.masterData.ndesigntemplatemappingcode : transactionStatus.NA,
                    nsampletypecode: this.props.Login.masterData.defaultSampleType.nsampletypecode
                },
            }
            let obj = convertDateValuetoString(this.state.selectedFilter.fromDate || this.props.Login.masterData.realFromDate,
                this.state.selectedFilter.toDate || this.props.Login.masterData.realToDate, this.props.Login.userInfo);
            inputData["fromDate"] = obj.fromDate;
            inputData["toDate"] = obj.toDate;
            inputData["currentdate"] = formatInputDate(new Date(), true)
            inputData["userinfo"] = this.props.Login.userInfo;
            inputData["defaultSampleType"] = this.props.Login.masterData.defaultSampleType;
            inputData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA;
            inputData["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode ?
                this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA;
            inputData["nsampletypecode"] = this.props.Login.masterData.realSampleTypeValue ?
                this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA;
            //inputData["nsampletypecode"]=this.props.Login.masterData.defaultSampleType ? this.props.Login.masterData.defaultSampleType.nsampletypecode : transactionStatus.NA;
            //inputData["nregtypecode"]=this.props.Login.masterData.defaultRegistrationType ? this.props.Login.masterData.defaultRegistrationType.nregtypecode : transactionStatus.NA;
            inputData["defaultRegistrationType"] = this.props.Login.masterData.defaultRegistrationType
            inputData["defaultRegistrationSubType"] = this.state.nregsubtypecode ? this.state.nregsubtypecode.item : transactionStatus.NA;
            //inputData["nregsubtypecode"]=this.state.nregsubtypecode ? this.state.nregsubtypecode.item.nregsubtypecode : transactionStatus.NA;
            inputData["nbatchmastercode"] = selectedBatch.nbatchmastercode;
            //inputData["ntranscode"] = this.state.FilterStatusValue ? this.state.FilterStatusValue.value : transactionStatus.DRAFT;
            inputData["ntranscode"] = this.state.FilterStatusValue && this.state.FilterStatusValue.value === transactionStatus.ALL ? this.state.BCFilterStatus.filter(item1 => item1.item.ntransactionstatus !== transactionStatus.ALL).map(item1 => item1.item.ntransactionstatus).join(",") : this.state.FilterStatusValue.value;

            // inputData["napprovalversioncode"]=this.state.ApprovalVersionValue ?
            // this.state.ApprovalVersionValue.item.napprovalconfigversioncode : transactionStatus.NA;
            inputData["napprovalversioncode"] = this.props.Login.masterData.realApproveConfigVersion &&
                this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode ?
                this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode : transactionStatus.NA;
            inputData["napprovalconfigcode"] = this.props.Login.masterData.realApproveConfigVersion &&
                this.props.Login.masterData.realApproveConfigVersion.napprovalconfigcode ? this.props.Login.masterData.realApproveConfigVersion.napprovalconfigcode : transactionStatus.NA;
            inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode || transactionStatus.NA;
            inputData["selectedBatch"] = selectedBatch;
            inputData["samples"] = this.props.Login.masterData.Samples;
            const inputParam = {
                postParam,
                inputData: inputData,
                operation,
                classUrl: "batchcreation",
                methodUrl: "Batchcreation",
                displayName: "IDS_BATCHCREATION",
            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "IDS_BATCHCREATION", operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }
    }

    fetchEditData = (editParam) => {
        if (this.props.Login.masterData.SelectedBatchmaster.ntransactionstatus == transactionStatus.DRAFT) {
            this.props.getActiveBatchCreationService(editParam,
                this.props.Login.masterData.SelectedBatchmaster)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTBATCH" }));
        }
    }


    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"]
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        //ALPD-3399
        if (this.props.Login.operation == "complete" || this.props.Login.operation == "initiate") {
            this.props.validateEsignforBatch(inputParam,);
        } else {
            this.props.validateEsignCredential(inputParam, "openModal");
        }

    }
    closeFilter = () => {
        let inputValues = {
            fromDate: this.props.Login.masterData.realFromDate || new Date(),//this.state.selectedFilter["fromDate"] != undefined ?
            //rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter["fromDate"]) : this.fromDate,
            toDate: this.props.Login.masterData.realToDate || new Date(), //this.state.selectedFilter["toDate"] != undefined ?
            // rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter["toDate"]) : this.toDate,
            SampleType: this.props.Login.masterData.realSampleTypeList || [],
            SampleTypeValue: this.props.Login.masterData.realSampleTypeValue || {},
            defaultSampleType: this.props.Login.masterData.realSampleTypeValue || {},
            RegistrationType: this.props.Login.masterData.realRegistrationTypeList || [],
            RegTypeValue: this.props.Login.masterData.realRegTypeValue || {},
            defaultRegistrationType: this.props.Login.masterData.realRegTypeValue || {},
            RegistrationSubType: this.props.Login.masterData.realRegistrationSubTypeList || [],
            RegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue || {},
            BCFilterStatus: this.props.Login.masterData.realBCFilterStatusList || [],
            FilterStatusValue: this.props.Login.masterData.realdefaultFilterStatus || {},
            ApprovalConfigVersion: this.props.Login.masterData.realApprovalConfigVersionList || [],
            ApprovalVersionValue: this.props.Login.masterData.realApproveConfigVersion || {},
            defaultFilterStatus: this.props.Login.masterData.realdefaultFilterStatus || {},
            defaultApprovalConfigVersion: this.props.Login.masterData.realApproveConfigVersion || {},
            defaultRegistrationSubType: this.props.Login.masterData.realRegSubTypeValue || {},
            // ALPD-5563 - code or designTemplateMappingValue changed by Gowtham R - Run batch screen -> In Advanced Filter options, make changes and cancel filter refresh, no records found.
            ndesigntemplatemappingcode: this.props.Login.masterData.realndesigntemplatemappingcode || 
                                            this.props.Login.masterData.DesignTemplateMappingValue &&
                                            this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode || -1
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false, masterData: { ...this.props.Login.masterData, ...inputValues } },
        };
        this.props.updateStore(updateInfo);
    }
    onFilterSubmit = () => {

        if (this.props.Login.masterData.defaultRegistrationType != undefined && this.state.FilterStatusValue.item != undefined && this.state.nregsubtypecode.item != undefined &&
            this.state.ApprovalVersionValue.item != undefined
        ) {
            let inputData = {};

            let obj = convertDateValuetoString(this.state.selectedFilter.fromDate || this.props.Login.masterData.fromDate,
                this.state.selectedFilter.toDate || this.props.Login.masterData.toDate, this.props.Login.userInfo);
            inputData["fromdate"] = obj.fromDate;
            inputData["todate"] = obj.toDate;
            inputData["realFromDate"] = obj.fromDate;
            inputData["realToDate"] = obj.toDate;
            inputData["needFilterSubmit"] = "true";
            inputData["userInfo"] = this.props.Login.userInfo;
            inputData["defaultSampleType"] = this.props.Login.masterData.defaultSampleType
            inputData["nsampletypecode"] = this.props.Login.masterData.defaultSampleType ? this.props.Login.masterData.defaultSampleType.nsampletypecode : transactionStatus.NA;
            inputData["nregtypecode"] = this.props.Login.masterData.defaultRegistrationType ? this.props.Login.masterData.defaultRegistrationType.nregtypecode : transactionStatus.NA;
            inputData["defaultRegistrationType"] = this.props.Login.masterData.defaultRegistrationType
            inputData["defaultRegistrationSubType"] = this.state.nregsubtypecode ? this.state.nregsubtypecode.item : transactionStatus.NA;
            inputData["nregsubtypecode"] = this.state.nregsubtypecode ? this.state.nregsubtypecode.item.nregsubtypecode : transactionStatus.NA;
            // inputData["ntranscode"] = this.state.FilterStatusValue && this.state.FilterStatusValue.value===0 ? this.state.BCFilterStatus.map(item1=>"'"+item1.item.ntransactionstatus+"'").join(",") : this.state.FilterStatusValue.value;
            //ALPD-3399          
            inputData["ntranscode"] = this.state.FilterStatusValue && this.state.FilterStatusValue.value === transactionStatus.ALL ? this.state.BCFilterStatus.filter(item1 => item1.item.ntransactionstatus !== transactionStatus.ALL).map(item1 => item1.item.ntransactionstatus).join(",") : this.state.FilterStatusValue.value;
            inputData["fromDate"] = obj.fromDate;
            inputData["toDate"] = obj.toDate;
            inputData["napprovalconfigcode"] = this.state.ApprovalVersionValue ?
                this.state.ApprovalVersionValue.item.napprovalconfigcode : transactionStatus.NA;
            //  inputData["napprovalconfigcode"]=this.props.Login.masterData.realApproveConfigVersion && 
            //  this.props.Login.masterData.realApproveConfigVersion.napprovalconfigcode ? this.props.Login.masterData.realApproveConfigVersion.napprovalconfigcode: transactionStatus.NA;
            inputData["napprovalversioncode"] = this.state.ApprovalVersionValue ?
                this.state.ApprovalVersionValue.item.napprovalconfigversioncode : transactionStatus.NA;
            // inputData["napprovalversioncode"]=this.props.Login.masterData.realApproveConfigVersion && 
            //    this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode ? 
            //    this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode: transactionStatus.NA;
            inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode ||
                transactionStatus.NA;
            //inputData["realApproveConfigVersion"] = this.state.ApprovalVersionValue && this.state.ApprovalVersionValue.item || transactionStatus.NA;
            // inputData["realdefaultFilterStatus"] = this.state.FilterStatusValue && this.state.FilterStatusValue.item || transactionStatus.NA;

            inputData["realRegistrationTypeList"] = this.props.Login.masterData.RegistrationType;
            inputData["realRegTypeValue"] = this.props.Login.masterData.defaultRegistrationType;
            inputData["realRegistrationSubTypeList"] = this.props.Login.masterData.RegistrationSubType;
            inputData["realRegSubTypeValue"] = this.props.Login.masterData.defaultRegistrationSubType;
            inputData["realBCFilterStatusList"] = this.props.Login.masterData.BCFilterStatus;
            inputData["realdefaultFilterStatus"] = this.state.FilterStatusValue !== undefined ? this.state.FilterStatusValue 
            && this.state.FilterStatusValue.item : this.props.Login.masterData.defaultFilterStatus;
            inputData["realApprovalConfigVersionList"] = this.props.Login.masterData.ApprovalConfigVersion;
            //inputData["realApproveConfigVersion"] = this.props.Login.masterData.defaultApprovalConfigVersion;
            inputData["realApproveConfigVersion"] = this.state.ApprovalVersionValue !== undefined ? this.state.ApprovalVersionValue 
            && this.state.ApprovalVersionValue.item : this.props.Login.masterData.defaultApprovalConfigVersion;

            inputData["realndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode;
            //ALPD-4999 to insert the filter data's in filterdetail table when submit the filter,done by Dhanushya RI
            inputData["operation"] = "create";
            // ALPD-5557 - real to default changed by Gowtham R - Run batch screen -> In Advanced Filter options, config version displaying wrongly.
            inputData["sampleTypeValue"] = this.props.Login.masterData && this.props.Login.masterData.defaultSampleType;
            inputData["regTypeValue"] = this.props.Login.masterData && this.props.Login.masterData.defaultRegistrationType;
            inputData["regSubTypeValue"] = this.props.Login.masterData && this.props.Login.masterData.defaultRegistrationSubType;
            inputData["filterStatusValue"] = this.state.FilterStatusValue !== undefined ? this.state.FilterStatusValue 
                        && this.state.FilterStatusValue.item : this.props.Login.masterData.realdefaultFilterStatus;
            inputData["approvalConfigValue"] = this.state.ApprovalVersionValue !== undefined ? this.state.ApprovalVersionValue 
            && this.state.ApprovalVersionValue.item : this.props.Login.masterData.realApproveConfigVersion;
            // inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.realndesigntemplatemappingcode 
            //                                           || this.props.Login.masterData.ndesigntemplatemappingcode;
            // ALPD-5563 - real to default changed by Gowtham R - Run batch screen -> In Advanced Filter options, make changes and cancel filter refresh, no records found.
            inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode; 
            inputData["saveFilterSubmit"] = true;

            const inputParam = {
                classUrl: "batchcreation",
                methodUrl: "Batchmaster",
                displayName: "IDS_BATCHCREATION",
                inputData: inputData,
                searchRef: this.searchRef,
            }
            this.props.onActionFilterSubmit(inputParam["inputData"], this.props.Login.masterData);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }));
        }
    }
    closeModalShow = () => {
        let loadEsign = this.props.Login.loadEsign;
        let modalShow = this.props.Login.modalShow;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            loadEsign = false;
        } else {
            modalShow = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { modalShow, selectedRecord, selectedId: null, loadEsign },
        };
        this.props.updateStore(updateInfo);
    };
    //ALPD-4999 to insert the filter name in filtername table,done by Dhanushya RI

    onSaveModalFilterName = () => {
            let inputData = {};
            let obj = convertDateValuetoString(this.state.selectedFilter.fromDate || this.props.Login.masterData.fromDate,
                this.state.selectedFilter.toDate || this.props.Login.masterData.toDate, this.props.Login.userInfo);
            inputData["sfiltername"]=this.state.selectedRecord && this.state.selectedRecord.sfiltername !== null
            ? this.state.selectedRecord.sfiltername: "";
            inputData["fromdate"] = obj.fromDate;
            inputData["todate"] = obj.toDate;
            inputData["realFromDate"] = obj.fromDate;
            inputData["realToDate"] = obj.toDate;
            inputData["userInfo"] = this.props.Login.userInfo;
            inputData["nsampletypecode"] = this.props.Login.masterData.defaultSampleType ? this.props.Login.masterData.defaultSampleType.nsampletypecode : transactionStatus.NA;
            inputData["nregtypecode"] = this.props.Login.masterData.defaultRegistrationType ? this.props.Login.masterData.defaultRegistrationType.nregtypecode : transactionStatus.NA;
            inputData["nregsubtypecode"] = this.state.nregsubtypecode ? this.state.nregsubtypecode.item.nregsubtypecode : transactionStatus.NA;         
            inputData["ntranscode"] = this.state.FilterStatusValue && this.state.FilterStatusValue.value === transactionStatus.ALL ? this.state.BCFilterStatus.filter(item1 => item1.item.ntransactionstatus !== transactionStatus.ALL).map(item1 => item1.item.ntransactionstatus).join(",") : this.state.FilterStatusValue.value;
            inputData["napprovalconfigcode"] = this.state.ApprovalVersionValue ?
                this.state.ApprovalVersionValue.item.napprovalconfigcode : transactionStatus.NA;
            inputData["napprovalversioncode"] = this.state.ApprovalVersionValue ?
                this.state.ApprovalVersionValue.item.napprovalconfigversioncode : transactionStatus.NA;
            inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode ||
                transactionStatus.NA;
            inputData["sampleTypeValue"] = this.props.Login.masterData && this.props.Login.masterData.realSampleTypeValue;    
            inputData["regTypeValue"] = this.props.Login.masterData && this.props.Login.masterData.realRegTypeValue;
            inputData["regSubTypeValue"] = this.props.Login.masterData && this.props.Login.masterData.realRegSubTypeValue;
            inputData["filterStatusValue"] = this.props.Login.masterData && this.props.Login.masterData.realdefaultFilterStatus;
            inputData["approvalConfigValue"] = this.props.Login.masterData && this.props.Login.masterData.realApproveConfigVersion;
            inputData["saveFilterSubmit"] = true;
            inputData["userinfo"] = this.props.Login.userInfo;

            let masterData = this.props.Login.masterData

            if (this.props.Login.masterData.defaultSampleType != undefined && this.props.Login.masterData.defaultRegistrationType != undefined && this.state.FilterStatusValue.item != undefined && this.state.nregsubtypecode.item != undefined &&
                this.state.ApprovalVersionValue.item != undefined
            ) {
            const inputParam = {
                classUrl: "batchcreation",
                methodUrl: "FilterName",
                displayName: "IDS_BATCHCREATION",
                operation:"create",
                inputData: inputData,
                searchRef: this.searchRef,
            }
            this.props.crudMaster(inputParam, masterData, "modalShow");
         }
         else {
             toast.info(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
         }
    }
    //ALPD-4999 To open the save popup of filtername,done by Dhanushya RI
    openFilterName = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {  modalShow: true,operation:"create",modalTitle:this.props.intl.formatMessage({ id: "IDS_SAVEFILTER" })}
        }
        this.props.updateStore(updateInfo);
    }
    //ALPD-4999-To get previously saved filter details when click the filter name,,done by Dhanushya RI
    clickFilterDetail = (value) => {
        let inputData = {};
            let obj = convertDateValuetoString(this.props.Login.masterData && this.props.Login.masterData.realFromDate,
                this.props.Login.masterData && this.props.Login.masterData.realToDate, this.props.Login.userInfo);
            inputData["nfilternamecode"]=value && value.nfilternamecode? value.nfilternamecode:-1;
            inputData["fromDate"] = obj.fromDate;
            inputData["toDate"] = obj.toDate;
            inputData["realFromDate"] = obj.fromDate;
            inputData["realToDate"] = obj.toDate;
            inputData["userInfo"] = this.props.Login.userInfo;
            inputData["nsampletypecode"] = this.props.Login.masterData.realSampleTypeValue ? this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA;
            inputData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA;
            inputData["nregsubtypecode"] = this.state.nregsubtypecode ? this.state.nregsubtypecode.item.nregsubtypecode : transactionStatus.NA;         
            inputData["ntranscode"] = this.state.FilterStatusValue && this.state.FilterStatusValue.value === transactionStatus.ALL ? this.state.BCFilterStatus.filter(item1 => item1.item.ntransactionstatus !== transactionStatus.ALL).map(item1 => item1.item.ntransactionstatus).join(",") : this.state.FilterStatusValue.value;
            inputData["napprovalconfigcode"] = this.state.ApprovalVersionValue ?
                this.state.ApprovalVersionValue.item.napprovalconfigcode : transactionStatus.NA;
            inputData["napprovalversioncode"] = this.state.ApprovalVersionValue ?
                this.state.ApprovalVersionValue.item.napprovalconfigversioncode : transactionStatus.NA;
            inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode ||
                transactionStatus.NA;
            inputData["userinfo"] = this.props.Login.userInfo;
            let masterData = this.props.Login.masterData
            const inputParam = {
                classUrl: "batchcreation",
                methodUrl: "Batchmaster",
                displayName: "IDS_BATCHCREATION",
                inputData: inputData,
                searchRef: this.searchRef,
            }
            this.props.getBatchCreationFilter(inputParam["inputData"], masterData);
       
    }
    reloadData = (isFilterSubmit) => {
        this.searchRef.current.value = "";
        // let obj = this.convertDatetoString((selectedRecord && selectedRecord["fromdate"]) || this.props.Login.masterData.FromDate, (selectedRecord && selectedRecord["todate"]) || this.props.Login.masterData.ToDate)
        if (this.props.Login.masterData.realRegTypeValue !== transactionStatus.NA ||
            this.props.Login.masterData.realRegTypeValue !== null &&
            this.props.Login.masterData.realRegSubTypeValue !== transactionStatus.NA ||
            this.props.Login.masterData.realRegSubTypeValue !== null &&
            this.props.Login.masterData.realApproveConfigVersion !== transactionStatus.NA ||
            this.props.Login.masterData.realApproveConfigVersion !== null &&
            this.props.Login.masterData.defaultFilterStatus !== transactionStatus.NA ||
            this.props.Login.masterData.defaultFilterStatus !== null) {

            let inputData = {};
            let obj = convertDateValuetoString(this.state.selectedFilter.fromDate || this.props.Login.masterData.realFromDate,
                this.state.selectedFilter.toDate || this.props.Login.masterData.realToDate, this.props.Login.userInfo);
            inputData["fromDate"] = obj.fromDate;
            inputData["toDate"] = obj.toDate;
            inputData["userInfo"] = this.props.Login.userInfo;

            inputData["nsampletypecode"] = this.props.Login.masterData.realSampleTypeValue &&
                this.props.Login.masterData.realSampleTypeValue.nsampletypecode ? this.props.Login.masterData.realSampleTypeValue.nsampletypecode : transactionStatus.NA;

            inputData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode ?
                this.props.Login.masterData.realRegTypeValue.nregtypecode : transactionStatus.NA;

            inputData["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode ?
                this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode : transactionStatus.NA;

            inputData["defaultSampleType"] = this.props.Login.masterData.defaultSampleType;

            inputData["defaultRegistrationType"] = this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue : transactionStatus.NA;

            inputData["defaultRegistrationSubType"] = this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue : transactionStatus.NA;

            //inputData["ntranscode"] = this.props.Login.masterData.realdefaultFilterStatus && this.props.Login.masterData.realdefaultFilterStatus.ntransactionstatus || transactionStatus.NA;
            inputData["ntranscode"] = this.props.Login.masterData.realdefaultFilterStatus ? this.props.Login.masterData.realdefaultFilterStatus.ntransactionstatus === transactionStatus.ALL ? this.state.BCFilterStatus.filter(item1 => item1.item.ntransactionstatus !== transactionStatus.ALL).map(item1 => item1.item.ntransactionstatus).join(",") : this.props.Login.masterData.realdefaultFilterStatus.ntransactionstatus : transactionStatus.NA;

            inputData["napprovalconfigcode"] = this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.napprovalconfigcode || transactionStatus.NA;

            inputData["realApproveConfigVersion"] = this.state.ApprovalVersionValue && this.state.ApprovalVersionValue.item || transactionStatus.NA;

            inputData["napprovalversioncode"] = this.state.ApprovalVersionValue && this.state.ApprovalVersionValue.item.napprovalconfigversioncode || transactionStatus.NA;

            //inputData["defaultFilterStatus"]=this.state.FilterStatusValue && this.state.FilterStatusValue.item || transactionStatus.NA;
            inputData["defaultFilterStatus"] = this.props.Login.masterData.realdefaultFilterStatus && this.props.Login.masterData.realdefaultFilterStatus || transactionStatus.NA;
            inputData["realdefaultFilterStatus"] = this.props.Login.masterData.realdefaultFilterStatus && this.props.Login.masterData.realdefaultFilterStatus || transactionStatus.NA;
            inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode || transactionStatus.NA;
            inputData["realRegistrationTypeList"] = this.props.Login.masterData.realRegistrationTypeList;
            inputData["realRegTypeValue"] = this.props.Login.masterData.realRegTypeValue;
            inputData["realRegistrationSubTypeList"] = this.props.Login.masterData.realRegistrationSubTypeList;
            inputData["realRegSubTypeValue"] = this.props.Login.masterData.realRegSubTypeValue;
            inputData["realBCFilterStatusList"] = this.props.Login.masterData.realBCFilterStatusList;
            //inputData["realdefaultFilterStatus"] =this.state.FilterStatusValue!==undefined? this.state.FilterStatusValue && this.state.FilterStatusValue.item :this.props.Login.masterData.realdefaultFilterStatus;
            inputData["realdefaultFilterStatus"] = this.props.Login.masterData.realdefaultFilterStatus !== undefined ? this.props.Login.masterData.realdefaultFilterStatus && this.props.Login.masterData.realdefaultFilterStatus : this.props.Login.masterData.realdefaultFilterStatus;
            inputData["realApprovalConfigVersionList"] = this.props.Login.masterData.realApprovalConfigVersionList;
            inputData["realApproveConfigVersion"] = this.props.Login.masterData.realApproveConfigVersion;
            inputData["realndesigntemplatemappingcode"] = this.props.Login.masterData.realndesigntemplatemappingcode;
            const inputParam = {
                classUrl: "batchcreation",
                methodUrl: "Batchmaster",
                displayName: "IDS_BATCHCREATION",
                inputData: inputData,
                searchRef: this.searchRef,
            }

            this.props.onActionFilterSubmit(inputParam["inputData"], this.props.Login.masterData);
        } else {

            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }));
        }
    }


    // addtest=(addParam)=>{
    //     if(this.props.Login.masterData.Batchmaster == undefined ){
    //         toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" })); 
    //     }else{
    //         this.props.getTestInstrumentComboService(addParam)
    //     }
    // }

    // convertDatetoString(startDateValue, endDateValue) {
    //     const startDate = new Date(startDateValue);
    //     const endDate = new Date(endDateValue);

    //     const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
    //     const currentMonth = validateTwoDigitDate(String(endDate.getMonth() + 1));
    //     const prevDay = validateTwoDigitDate(String(startDate.getDate()));
    //     const currentDay = validateTwoDigitDate(String(endDate.getDate()));

    //     const fromDateOnly = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay
    //     const toDateOnly = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay
    //     const fromDate = fromDateOnly + "T00:00:00";
    //     const toDate = toDateOnly + "T23:59:59";
    //     return ({ fromDate, toDate, breadCrumbFrom: fromDateOnly, breadCrumbto: toDateOnly })
    // }

    onClickReport = (selectedRecord, flag, ncontrolcode) => {
        const reportParam = {
            classUrl: "certificategeneration",
            methodUrl: "reportGeneration",
            screenName: "CertificateGeneration",
            operation: "previewReport",
            primaryKeyField: "nreleasebatchcode",
            inputParam: this.props.Login.inputParam,
            userInfo: this.props.Login.userInfo,
            ncontrolCode: -1,
            inputData: {
                sprimarykeyname: 'nreleasebatchcode',
                nprimarykey: selectedRecord.nreleasebatchcode,
                nreleasebatchcode: selectedRecord.nreleasebatchcode,
                ncertificatetypecode: selectedRecord.ndecision === transactionStatus.PASS && flag === 1 ? selectedRecord.ncertificatetypecode : -1,
                ndecisionstatus: selectedRecord.ndecision,// === transactionStatus.DRAFT ? transactionStatus.PASS : selectedRecord.ndecision,
                nreporttypecode: flag === 2 ? reportTypeEnum.SCREENWISE : reportTypeEnum.BATCH,
                ncontrolcode,
                ncoareporttypecode: flag === 2 ? -1 : reportCOAType.BATCHPREVIEW,
                userinfo: this.props.Login.userInfo,
                nflag: flag,
                skipbatchvalidation: true,
            }
        };
        this.props.onClickReport(reportParam)
    }

    reportMethod = (value) => {
        if (value.method === 1) {
            this.onClickReport(this.props.Login.masterData.SelectedBatchCreation, 2, value.controlId);
        }
        else {
            this.onClickReport(this.props.Login.masterData.SelectedBatchCreation, 1, value.controlId);
        }
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, updateStore,
    getTestInstrumentComboService, getTestInstrumentCategory, getInstrumentForInstCategory,
    getProductBasedInstrument,
    getBatchCreationDetails, onActionFilterSubmit, getProductcategoryAction,
    createBatchmasterAction, getSamplesForGrid, getSelectedBatchCreationDetail,
    createSampleAction, deleteSampleAction, getActiveBatchCreationService,
    updateBatchcreationAction, deleteBatchCreation, batchInitiateAction,
    getBCRegistrationSubType, batchCompleteAction, validateEsignCredential,
    filterColumnData, getBatchhistoryAction,
    getBatchSection, viewInfo, getIqcSamples, getMaterialBasedOnMaterialCategory,
    getMaterialInventoryBasedOnMaterial, batchSaveIQCActions, getMaterialAvailQtyBasedOnInv,
    getBatchIqcSampleAction, getBCApprovalConfigVersion, getBCRegistrationType,
    getTreeByMaterial, getNewRegSpecification, cancelIQCSampleAction, batchCancelAction,
    batchInitiateDatePopup, batchCompleteDatePopup, getInstrumentID, getBatchViewResultAction, 
    validateEsignforBatch,getBatchCreationFilter
    //,batchTAT
})(injectIntl(BatchCreation));

