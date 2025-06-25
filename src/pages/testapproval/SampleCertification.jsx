import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, Nav, FormGroup, FormLabel, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
    callService, crudMaster, updateStore, getSampleCertTypeChange, getSampleCertRegSubTypeChange, filterColumnData, validateEsignCredential,
    getTestResultData, getActiveSample, generateCertificateAction, sentCertificateAction, correctionCertificateAction, xmlExportAction, getWholeFilterStatus, validateXMLEsignCredential,
    getApprovalVersionSampleCertification, onClickReportSample,validateEsignforSampCerGen, viewAttachment,viewReportForSample
} from '../../actions'
import { getControlMap, showEsign,rearrangeDateFormat,convertDateValuetoString }
    from '../../components/CommonScript';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, injectIntl } from 'react-intl';
import { faFileCode, faSync } from '@fortawesome/free-solid-svg-icons';
import rsapi, { fileViewUrl } from '../../rsapi';

import SampleCertificationFilter from './SampleCertificationFilter';
import { ReadOnlyText, ContentPanel, OutlineTransactionStatus, DecisionStatus } from '../../components/App.styles';
import { constructOptionList } from '../../components/CommonScript';
import { ReactComponent as Certified } from '../../assets/image/generate-certificate.svg';
import { ReactComponent as CertificateSend } from '../../assets/image/certificate-Send.svg';
import { ReactComponent as CertificateCorrectionicon } from '../../assets/image/certificate-correction.svg';
import CustomTab from '../../components/custom-tabs/custom-tabs.component';
import ApprovalHistory from './ApprovalHistory';
import PrintHistory from './PrintHistory';
import SentMailHistory from './SentMailHistory';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import Results from './Results';
import { transactionStatus, designProperties, reportTypeEnum, reportCOAType, RegistrationSubType } from '../../components/Enumeration';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import TransactionListMaster from '../../components/TransactionListMaster';
import SplitterLayout from "react-splitter-layout";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ListWrapper } from '../../components/client-group.styles';
import { ProductList } from '../product/product.styled';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { process } from '@progress/kendo-data-query';
import CerGenTabs from '../batch/certificategeneration/CerGenTabs';
import DocViewer from '../../components/doc-viewer/doc-viewer.component';
//import { Tooltip } from '@progress/kendo-react-tooltip';
// import ReactTooltip from 'react-tooltip';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';



const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class SampleCertification extends Component {
    constructor(props) {
        super(props);
        const appHistoryDataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
        const resultsDataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
        const printHistoryDataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
        const sentMailHistory = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
        const dataStateReportHistory = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
        this.searchSampleRef = React.createRef();
        this.state = {
            openModal: false,
            masterStatus: "",
            controlMap: new Map(),
            error: "",
            selectedRecord: {},
            selectedFilter: {},
            userRoleControlRights: [],
            appHistoryDataState,
            resultsDataState,
            printHistoryDataState,
            dataStateReportHistory,
            sentMailHistory,
            skip: 0,
            take: this.props.Login.settings ? this.props.Login.settings[3] : 25
        }
        this.extractedReportHistoryColumnList = [
            {  "idsName": "IDS_VERSION", "dataField": "nversioncode", "width": "150px" },
            {  "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "150px" },
            {  "idsName": "IDS_REPORTDATE", "dataField": "sgeneratedtime", "width": "250px" },
            {  "idsName": "IDS_USERNAME", "dataField": "susername", "width": "250px" },
            {   "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "150px" },       
            { "idsName": "IDS_REPORTCOMMENTS", "dataField": "sreportcomments", "width": "250px" },
           
        ]
        this.searchRef = React.createRef();
        this.searchFieldList = ["scomponentname","sarno","sproductname","ssamplecertificateversioncode","sversion",
		"smanufname","sspecname","nrmsno","dtransactiondate","smanuflotno"]
    }

    // onSampleTypeChange = (event, fieldName, labelname) => {
    //     if (event !== null) {
    //         let Map = {};
    //         Map["nsampletypecode"] = parseInt(event.value);
    //         Map['userinfo'] = this.props.Login.userInfo;
    //         this.props.getSampleCertTypeChange(Map, this.props.Login.masterData, event, labelname);
    //     }
    // }

    onRegSubTypeChange = (comboData, fieldName) => {
        const regSubTypeValue = this.state.regSubTypeValue || {};
        // regSubTypeValue[fieldName] = comboData;
        // this.setState({ regSubTypeValue });
        if (comboData.value !== this.state.regSubTypeValue.nregsubtypecode.value) {
            let inputParamData = {};
            let inputData = {
                // nflag: 4,
                FromDate: this.props.Login.masterData.FromDate,
                ToDate: this.props.Login.masterData.ToDate,
                nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RegistrationTypeValue.nregtypecode,
                nregsubtypecode: comboData.value,
                userinfo: this.props.Login.userInfo,
            }
            inputParamData = {
                inputData,
                masterData: {
                    ...this.props.Login.masterData,
                    //RegistrationSubTypeValue: comboData.item,
                    operation: "onChange"
                }
            }
            this.props.getApprovalVersionSampleCertification(inputParamData)
        }
        //this.props.getApprovalVersion(inputParamData)
        //this.props.getSampleCertRegSubTypeChange(Map, this.props.Login.masterData, event, labelname);
        regSubTypeValue[fieldName] = comboData;
        this.setState({ regSubTypeValue });

    }

    onFilterChange = (comboData, fieldName) => {

        const FilterStatusValue = this.state.FilterStatusValue || {};
        FilterStatusValue[fieldName] = comboData;
        this.setState({ FilterStatusValue });

    }

    onFilterComboChange = (comboData, fieldName) => {
        if (comboData.value !== this.props.Login.masterData.ApprovalVersionValue.napproveconfversioncode) {

            const ApprovalVersionValue = comboData;
            this.setState({ ApprovalVersionValue });

            // let masterData = { ...this.props.Login.masterData, ApprovalVersionValue: comboData.item  }
            // const updateInfo = {
            //     typeName: DEFAULT_RETURN,
            //     data: { masterData }
            // }
            // this.props.updateStore(updateInfo);
        }



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

    validateEsign = () => {
        const operation = this.props.Login.screenData.inputParam.operation;

        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        if (this.props.Login.screenData.inputParam.methodUrl === "regenerateCertificate"){
            this.props.validateXMLEsignCredential(inputParam, "openModal"); 
        }
        else if (operation === "xml")
        {
            this.props.validateXMLEsignCredential(inputParam, "openModal");
        } 
        else if (operation === "generate") {
            this.props.validateEsignforSampCerGen(inputParam, "openModal");
        }
        else {
            this.props.validateEsignCredential(inputParam, "openModal");
        }
    }


    onRegTypeChange = (event, fieldName, labelname) => {
        if (event !== null) {
            let Map = {};
            Map["nregtypecode"] = parseInt(event.value);
            Map['userinfo'] = this.props.Login.userInfo;
            this.props.getSampleCertRegSubTypeChange(Map, this.props.Login.masterData, event, labelname);
        }
    }


    handleExpandChange = (row, dataState) => {

        const viewParam = {
            TransactionSampleResults: this.props.Login.masterData.TransactionSampleResults,
            userInfo: this.props.Login.userInfo,
            primaryKeyField: "ntransactiontestcode",
            npreregno: "npreregno",
            masterData: this.props.Login.masterData
        };
        this.props.getTestResultData({
            ...viewParam, dataState,
            primaryKeyValue: row["dataItem"][viewParam.primaryKeyField], viewRow: row["dataItem"]
        });
    }

    generateCertificate = (operation, masterData, genCertificateId) => {

        const ntransactionstatus = masterData.SelectedRegistration.ntransactionstatus

        if (ntransactionstatus === transactionStatus.CERTIFIED || ntransactionstatus === transactionStatus.SENT) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYCERTIFIEDORSENT" }));
        } else {
            let postParam = {
                inputListName: "Registration", selectedObject: "SelectedRegistration",
                primaryKeyField: "npreregno",
                unchangeList: ["FromDate", "ToDate"], isSingleGet: true
            };
            const inputParam = {
                methodUrl: "CertificationStatus",
                classUrl: "samplecertification",
                postParam: postParam,
                operation: "generate",
                userInfo: this.props.Login.userInfo,
                ncontrolcode: genCertificateId,
                inputData: {
                    "userinfo": this.props.Login.userInfo,
                    methodUrl: "generateCertificationStatus",
                    npreregno: masterData.SelectedRegistration.npreregno,
                    ntransactionstatus: transactionStatus.CERTIFIED,
                    registration: masterData.SelectedRegistration,
                    nversioncode: 0,
                    ncontrolcode: genCertificateId,
                    operation: "generate",
                    masterData: this.props.Login.masterData

                }
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, genCertificateId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "IDS_SAMPLECERTIFICATIONGENERATION", operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.generateCertificateAction(inputParam["inputData"])
            }

        }

    }

    correctionCertificate = (operation, masterData, certificateCorrectionId) => {

        const ntransactionstatus = masterData.SelectedRegistration.ntransactionstatus
        if (ntransactionstatus === transactionStatus.CERTIFIED || ntransactionstatus === transactionStatus.SENT) {
            const inputParam = {
                methodUrl: "Certificate",
                classUrl: "samplecertification",
                operation: "correction",
                userinfo: this.props.Login.userInfo,
                inputData: {
                    "userinfo": this.props.Login.userInfo,
                    methodUrl: "generateCertificationStatus",
                    npreregno: masterData.SelectedRegistration.npreregno,
                    ntransactionstatus: transactionStatus.CERTIFIED,
                    registration: masterData.SelectedRegistration,
                    napprovalversioncode: String(masterData.SelectedRegistration.napprovalversioncode),
                    fromDate: masterData.FromDate,
                    toDate: masterData.ToDate,
                    nregtypecode: masterData.SelectedRegistration.nregtypecode,
                    nregsubtypecode: masterData.SelectedRegistration.nregsubtypecode

                }
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, certificateCorrectionId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "IDS_SAMPLECERTIFICATIONGENERATION", operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.correctionCertificateAction(inputParam["inputData"], operation, this.props.Login.masterData, certificateCorrectionId)
            }


        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTCERTIFIEDRECORD" }));
        }

    }

    xmlExport = (operation, masterData, XmlReportID) => {
        const ntransactionstatus = masterData.SelectedRegistration.ntransactionstatus

        if (masterData.SelectedRegistration.ndecisionstatus === transactionStatus.PASS) {
            if (ntransactionstatus === transactionStatus.CERTIFIED || ntransactionstatus === transactionStatus.SENT) {
                let inputData = {
                    methodUrl: "xmlExport",
                    npreregno: masterData.SelectedRegistration.npreregno,
                    userinfo: this.props.Login.userInfo,
                    ntransactionstatus: transactionStatus.CERTIFIED,
                    ncontrolcode: XmlReportID,
                    registration: masterData.SelectedRegistration
                }
                const inputParam = {
                    methodUrl: "Export",
                    classUrl: "samplecertification",
                    operation: "xml",
                    userInfo: this.props.Login.userInfo,
                    inputData

                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, XmlReportID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData },
                            openModal: true, screenName: "IDS_SAMPLECERTIFICATIONGENERATION", operation
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.xmlExportAction(inputParam["inputData"], this.props.Login.masterData,inputData)
                }

            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTCERTIFIEDRECORD" }));
            }
        } else {
            // toast.warn(this.props.intl.formatMessage({ id: "IDS_DECISIONSTATUSFAILED" }));
            toast.warn(this.props.intl.formatMessage({ id: "IDS_CANEXPORTXMLFORPASS" }));
        }

    }


    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let showReport = this.props.Login.showReport;
        if (this.props.Login.loadEsign) {
            loadEsign = false;
            selectedRecord.agree = false;
            openModal = false;

        } else {
            selectedRecord = {};
            showReport=false;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord,showReport }
        }
        this.props.updateStore(updateInfo);
    }

    checkConfirmation = (masterData, sendCertificateId) => {
        const ntransactionstatus = masterData.SelectedRegistration.ntransactionstatus;

        if (ntransactionstatus === transactionStatus.CERTIFIED || ntransactionstatus === transactionStatus.SENT) {
            return rsapi.post("samplecertification/getSentCertifiedStatus", {
                "npreregno": this.props.Login.masterData.SelectedRegistration.npreregno,
                "userinfo": this.props.Login.userInfo
            }).then(response => {
                if (response.status === 202) {
                    toast.warn(response.data);
                }
                else {
                    this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                        this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                        response.data,
                        this.props.intl.formatMessage({ id: "IDS_OK" }),
                        this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                        // () => this.onClickSentesign(inputParam),
                        () => this.sendCertificate("send", masterData, sendCertificateId),
                        false,
                        undefined);
                }

            }).catch(error => {
                if (error.response.status === 500) {
                    toast.error(this.props.intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(this.props.intl.formatMessage({ id: error.response }));
                }
            })
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTCERTIFIEDRECORDTOSEND" }));
        }
        // if (ntransactionstatus === transactionStatus.CERTIFIED) {
        //     this.sendCertificate("send", masterData, sendCertificateId);
        // } else if (ntransactionstatus === transactionStatus.SENT) {
        //     this.confirmMessage.confirm("confirmation", "Confiramtion!", this.props.intl.formatMessage({ id: "IDS_CERTIFICATERESEND" }),
        //         "OK", "Cancel", () => this.sendCertificate("send", masterData, sendCertificateId));
        // } else {
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTCERTIFIEDRECORD" }));
        // }
    }

    sendCertificate = (operation, masterData, sendCertificateId) => {
        let postParam = {
            inputListName: "Registration", selectedObject: "SelectedRegistration",
            primaryKeyField: "npreregno",
            unchangeList: ["FromDate", "ToDate"], isSingleGet: true
        };
        const inputParam = {
            methodUrl: "Certification",
            classUrl: "samplecertification",
            operation: "send",
            userInfo: this.props.Login.userInfo,
            postParam: postParam,
            inputData: {
                methodUrl: "sendCertification",
                npreregno: masterData.SelectedRegistration.npreregno,
                nregtypecode: masterData.SelectedRegistration.nregtypecode,
                nregsubtypecode: masterData.SelectedRegistration.nregsubtypecode,
                userinfo: this.props.Login.userInfo,
                ntransactionstatus: transactionStatus.CERTIFIED,
                registration: masterData.SelectedRegistration,
                ncontrolcode: sendCertificateId
            },
        }


        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, sendCertificateId)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "IDS_SAMPLECERTIFICATIONGENERATION", operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {

            this.props.sentCertificateAction(inputParam["inputData"], operation, this.props.Login.masterData)
        }
    }

    // handleFilterDateChange = (dateName, dateValue) => {
    //     const { selectedFilter } = this.state;
    //     if (dateValue === null) {
    //         dateValue = new Date();
    //     }
    //     selectedFilter[dateName] = dateValue;
    //     this.setState({ selectedFilter });
    // }

    handleDateChange = (dateName, dateValue) => {
        if (dateValue === null) {
            dateValue = new Date();
        }
        let FromDate = this.props.Login.masterData.RealFromDate || new Date()
        let ToDate = this.props.Login.masterData.RealToDate || new Date()
        let obj = {}
        if (dateName === 'fromDate') {
            obj = convertDateValuetoString(dateValue, ToDate,this.props.Login.userInfo)
            FromDate = obj.fromDate
            ToDate = obj.toDate
        } else {
            obj = convertDateValuetoString(FromDate, dateValue,this.props.Login.userInfo)
            FromDate = obj.fromDate
            ToDate = obj.toDate

        }
        // let RealFromDate =obj.breadCrumbFrom;
        // let RealToDate=obj.breadCrumbto;
        // this.setState({RealFromDate, RealToDate});
    
        let inputParam = {
            inputData: {
                nflag: 2,
                nregtypecode: this.state.RegTypeValue.nregtypecode.value,
                nregsubtypecode: this.state.regSubTypeValue.nregsubtypecode.value,
                userinfo: this.props.Login.userInfo,
                FromDate: String(FromDate),
                ToDate: String(ToDate)
            },
            masterData: this.props.Login.masterData

        }
        this.props.getApprovalVersionSampleCertification(inputParam)
    }

    onFilterSubmit = () => {
       
    //let SampleTypeValue = this.state.SampleTypeValue?this.state.SampleTypeValue.nsampletypecode:""
    
        let RealSampleTypeValue = this.state.SampleTypeValue ? this.state.SampleTypeValue.nsampletypecode.item.ssampletypename : ""
        let RealRegTypeValue = this.state.RegTypeValue ? this.state.RegTypeValue.nregtypecode.item.sregtypename : ""
        let RealRegSubTypeValue = this.state.regSubTypeValue ? this.state.regSubTypeValue.nregsubtypecode.item.sregsubtypename : ""
        let RealFilterValue = this.state.FilterStatusValue && this.state.FilterStatusValue.ntransactionstatus? this.state.FilterStatusValue.ntransactionstatus.item : ""
        let RealApprovalVersion = this.state.ApprovalVersionValue ? this.state.ApprovalVersionValue.item.sversionname : ""
        let obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.RealFromDate,
            this.state.selectedFilter.todate || this.props.Login.masterData.RealToDate,this.props.Login.userInfo)
        // let RealFromDate = obj.fromDate || this.props.Login.masterData.RealFromDate
        // let RealToDate = obj.toDate || this.props.Login.masterData.RealToDate
        let RealFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate);
        let RealToDate = rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.toDate);
        if(RealRegSubTypeValue !== "" && RealFilterValue !== "" && RealApprovalVersion !== ""){
        let inputData = {
            nsampletypecode: this.state.SampleTypeValue.nsampletypecode.value,
            nregtypecode: this.state.RegTypeValue.nregtypecode.value,
            nregsubtypecode: this.state.regSubTypeValue.nregsubtypecode.value,
            nfilterstatus: this.state.FilterStatusValue.ntransactionstatus.value,
            napprovalversioncode: this.state.ApprovalVersionValue.value ? String(this.state.ApprovalVersionValue.value) : '-1',
            userinfo: this.props.Login.userInfo,
            approvalVersionValue: this.state.ApprovalVersionValue.item  

        }
        inputData['FromDate'] = obj.fromDate;
        inputData['ToDate'] = obj.toDate;
        this.setState({
            RealSampleTypeValue, RealRegTypeValue, RealRegSubTypeValue,
            RealFilterValue, RealFromDate, RealToDate
        });

        let masterData = {
            ...this.props.Login.masterData,
            RealSampleTypeValue, RealRegTypeValue, RealRegSubTypeValue,
            RealFilterValue, RealFromDate, RealToDate, RealApprovalVersion
        }
        this.props.getWholeFilterStatus(masterData, inputData, "FilterSubmit", this.searchRef);
         } else {
                 toast.warn(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
          }

    }

    // covertDatetoString(startDateValue, endDateValue) {
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

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        if (props.Login.showConfirmAlert !== state.showConfirmAlert) {
            return {
                showConfirmAlert: props.Login.showConfirmAlert
            }
        }

        return null;
    }

    reloadData = () => {
        let SampleTypeValue = this.state.SampleTypeValue?this.state.SampleTypeValue.nsampletypecode:""
        if(SampleTypeValue !==""){
        let inputData = {
            nsampletypecode: this.state.SampleTypeValue.nsampletypecode.value,
            nregtypecode: this.state.RegTypeValue.nregtypecode.value,
            nregsubtypecode: this.props.Login.masterData.RegistrationSubTypeValue ? this.props.Login.masterData.RegistrationSubTypeValue.nregsubtypecode :
                this.state.regSubTypeValue ? this.state.regSubTypeValue.nregsubtypecode.value : "",
            nfilterstatus: this.props.Login.masterData.RealFilterValue ? this.props.Login.masterData.RealFilterValue.napprovalstatuscode :
                this.state.FilterStatusValue ? this.state.FilterStatusValue.ntransactionstatus.value : "",
            userinfo: this.props.Login.userInfo,
            napprovalversioncode: this.state.ApprovalVersionValue.value ? String(this.state.ApprovalVersionValue.value) : '-1'
        }
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
             && inputData.napprovalversioncode !== "-1" && inputData.nfilterstatus !== undefined)
            {
                let obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.RealFromDate,
                    this.state.selectedFilter.todate || this.props.Login.masterData.RealToDate,this.props.Login.userInfo)
                inputData['FromDate'] = obj.fromDate;
                inputData['ToDate'] = obj.toDate;
                this.props.getWholeFilterStatus(this.props.Login.masterData, inputData, "FilterSubmit", this.searchRef);
            }
            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
            }
        }else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
        }

    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }

    // dataStateChange = (event) => {
    //     this.setState({
    //         dataResult: process(this.props.Login.masterData.approvalHistory, event.dataState),
    //         dataState: event.dataState
    //     });
    // }

    tabDetail = () => {
        const tabMap = new Map();
        tabMap.set("IDS_APPROVALHISTORY",
            <ApprovalHistory
                approvalHistory={this.props.Login.masterData.approvalHistory}
                dataResult={process(this.props.Login.masterData.approvalHistory || [], this.state.appHistoryDataState)}
                dataState={this.state.appHistoryDataState}
                controlMap={this.state.controlMap}
                userInfo={this.props.Login.userInfo}
                userRoleControlRights={this.state.userRoleControlRights}
                dataStateChange={(event) => this.setState({ appHistoryDataState: event.dataState })}
                screenName="IDS_APPROVALHISTORY"
            />
        );
        tabMap.set("IDS_CERTIFIEDREPORT", <CerGenTabs
            userRoleControlRights={this.state.userRoleControlRights}
            controlMap={this.state.controlMap}
            inputParam={this.props.Login.inputParam}
            userInfo={this.props.Login.userInfo}
            masterData={this.props.Login.masterData}
            primaryList={"ReportHistory"}
            dataResult={process(this.props.Login.masterData["ReportHistory"]||[], this.state.dataStateReportHistory)}
            dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_BATCHREPORTHISTORY") ? this.state.dataStateReportHistory : { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }}
            dataStateChange={(event) => this.setState({ dataStateReportHistory: event.dataState })}
            columnList={this.extractedReportHistoryColumnList}
            methodUrl={"Certificate"}
            isActionRequired={true}
            selectedId={0}
            expandField=""
            viewDownloadFile= {(inputParam)=>this.viewAttachment(inputParam)}
            downloadParam = {{classUrl:"samplecertification",operation:"download",methodUrl:"Report"}}
            hasControlWithOutRights={true}
            viewReportFile={this.props.viewReportForSample}
            showDocViewer={true}
            isreportview={true}
        />)
        tabMap.set("IDS_PRINTHISTORY",
            <PrintHistory
                printHistory={this.props.Login.masterData.printHistory}
                dataResult={process(this.props.Login.masterData.printHistory || [], this.state.printHistoryDataState)}
                dataState={this.state.printHistoryDataState}
                controlMap={this.state.controlMap}
                dataStateChange={(event) => this.setState({ printHistoryDataState: event.dataState })}
                userRoleControlRights={this.state.userRoleControlRights}
                userInfo={this.props.Login.userInfo}
                inputParam={this.props.Login.inputParam}
                screenName="IDS_PRINTHISTORY"
            />);


        tabMap.set("IDS_RESULTS",
            <Results
                TransactionSampleTests={this.props.Login.masterData.TransactionSampleTests}
                dataResult={process(this.props.Login.masterData.TransactionSampleTests || [], this.state.resultsDataState)}
                dataState={(this.props.Login.screenName === "" || this.props.Login.screenName === "IDS_RESULTS") ? this.state.resultsDataState : { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }}
                controlMap={this.state.controlMap}
                dataStateChange={(event) => this.setState({ resultsDataState: event.dataState })}
                userRoleControlRights={this.state.userRoleControlRights}
                userInfo={this.props.Login.userInfo}
                inputParam={this.props.Login.inputParam}
                handleExpandChange={this.handleExpandChange}
                screenName="IDS_RESULTS"
                childList={this.props.Login.masterData.sampleTestResults}
                childMappingField={"ntransactiontestcode"}
                hasChild={true}
            // childList ={props.childList || new Map()}
            />);


        tabMap.set("IDS_MAILSTATUS",
            <SentMailHistory
                printHistory={this.props.Login.masterData.emailSentHistory}
                dataResult={process(this.props.Login.masterData.emailSentHistory || [], this.state.sentMailHistory)}
                dataState={this.state.sentMailHistory}
                controlMap={this.state.controlMap}
                dataStateChange={(event) => this.setState({ sentMailHistory: event.dataState })}
                userRoleControlRights={this.state.userRoleControlRights}
                userInfo={this.props.Login.userInfo}
                inputParam={this.props.Login.inputParam}
                screenName="IDS_MAILSTATUS"
            />);

        return tabMap;

    }

    viewAttachment=(inputParam)=>{
        inputParam.inputData = {...inputParam.inputData,ncontrolcode:inputParam.ncontrolCode}
        this.props.viewAttachment(inputParam);
    }
    
    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
        // setTimeout(() => { this._scrollBarRef.updateScroll() })
    };

    showConfirmAlert = (selectedRecord, flag, ReportId) => {
        this.confirmMessage.confirm(
            "regenerate",//name
            this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),//tittle
            this.props.intl.formatMessage({ id: "IDS_REGENERATECONFIRMATION" }),//message
            this.props.intl.formatMessage({ id: "IDS_OK" }),//do Label
            this.props.intl.formatMessage({ id: "IDS_CANCEL" }),//Do not label
            () => this.onClickReport(selectedRecord, flag, ReportId),
            undefined,
            () => this.closeConfirmAlert());
    }

    closeConfirmAlert = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showConfirmAlert: false }
        }
        this.props.updateStore(updateInfo);
    }

    onClickReport = (selectedRecord, flag, ReportId) => {
        const reportParam = {
            classUrl: "samplecertification",
            methodUrl: "regenerateCertificate",
            screenName: "SampleCertification",
            operation: "update",
            primaryKeyField: "npreregno",
            inputParam: this.props.Login.inputParam,
            userInfo: this.props.Login.userInfo,
            ncontrolCode: ReportId,
            inputData: {
                sprimarykeyname: 'npreregno',
                nprimarykey: selectedRecord.npreregno,
                npreregno: selectedRecord.npreregno,
                nregtypecode: selectedRecord.nregtypecode,
                nregsubtypecode: selectedRecord.nregsubtypecode,
                nsectioncode: transactionStatus.NA,
                // ncertificatetypecode:selectedRecord.ndecisionstatuscode===transactionStatus.PASS&&flag===1?selectedRecord.ncertificatetypecode:-1,
                ndecisionstatus: selectedRecord.ndecisionstatuscode,
                ncontrolcode: ReportId,
                nreporttypecode: reportTypeEnum.SAMPLE,
                ncoareporttypecode: reportCOAType.SAMPLECERTIFICATE,
                userinfo: this.props.Login.userInfo,
                nflag: flag,
                isRegenerate:true
            }
        };
       // this.props.onClickReportSample(reportParam)
       
       if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ReportId)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam:reportParam, masterData:this.props.Login.masterData },
                    openModal: true, screenName: "IDS_SAMPLECERTIFICATIONGENERATION", operation:reportParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.onClickReportSample(reportParam)
        }
    }

    render() {

        const { SelectedRegistration, searchedData, Registration } = this.props.Login.masterData;
        const getSample = {
            screenName: "IDS_SAMPLECERTIFICATIONGENERATION", operation: "get", masterData: this.props.Login.masterData,
            userInfo: this.props.Login.userInfo, methodUrl: "SampleCertification", keyName: "samplecertification"
        };
       
        this.fromDate = (this.state.selectedFilter["fromdate"] && this.state.selectedFilter["fromdate"]) || rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.RealFromDate);
        this.toDate = (this.state.selectedFilter["todate"] && this.state.selectedFilter["todate"]) || rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.RealToDate);
        

        // const { SampleCertification } = this.props.Login.masterData;
        const genCertificateId = this.state.controlMap.has("GenerateCertificate") && this.state.controlMap.get("GenerateCertificate").ncontrolcode;
        const sendCertificateId = this.state.controlMap.has("SendCertificate") && this.state.controlMap.get("SendCertificate").ncontrolcode;
        const certificateCorrectionId = this.state.controlMap.has("CertificateCorrection") && this.state.controlMap.get("CertificateCorrection").ncontrolcode;
        const ReportId = this.state.controlMap.has("Re-GenerateCetrificate") && this.state.controlMap.get("Re-GenerateCetrificate").ncontrolcode
        const XmlReportID = this.state.controlMap.has("XmlReport") && this.state.controlMap.get("XmlReport").ncontrolcode;
        this.confirmMessage = new ConfirmMessage();
        let obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.RealFromDate,
            this.state.selectedFilter.todate || this.props.Login.masterData.RealToDate,this.props.Login.userInfo)

       // let breadCrumbFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.RealFromDate)
        //let breadCrumbToDate=rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.RealToDate)
    
        this.breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": obj.breadCrumbFrom || this.state.RealFromDate
            }, {
                "label": "IDS_TO",
                "value": obj.breadCrumbto || this.state.RealToDate
            },
            {
                "label": "IDS_SAMPLETYPE",
                //"value": this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.ssampletypename
                "value": this.state.RealSampleTypeValue
            }, {
                "label": "IDS_REGTYPE",
                "value": this.state.RealRegTypeValue
            }, {
                "label": "IDS_REGSUBTYPE",
                "value": this.state.RealRegSubTypeValue,
            }, {
                "label": "IDS_FILTERSTATUS",
                "value": this.state.RealFilterValue?this.state.RealFilterValue.stransdisplaystatus:"-"
            },

            {
                "label": "IDS_CONFIGVERSION",
                "value": this.state.RealApprovalVersion
            }
        ]


        const filterParam = {
            inputListName: "Registration", selectedObject: "SelectedRegistration", primaryKeyField: "npreregno",
            fetchUrl: "samplecertification/getSampleCertificationById", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: this.searchFieldList
        };


        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">

                    {this.breadCrumbData && this.breadCrumbData.length > 0 ?
                        <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} /> : ""
                    }
                    <Row noGutters={true}>
                        <Col md={12} className="parent-port-height sticky_head_parent" ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={30}
                              primaryMinSize={40} secondaryMinSize={20}>
                                <TransactionListMaster
                                    masterList={searchedData || Registration || []}
                                    selectedMaster={[SelectedRegistration]}
                                    primaryKeyField="npreregno"
                                    getMasterDetail={(SampleCertification) => this.props.getActiveSample(SampleCertification, this.props.Login.userInfo, this.props.Login.masterData)}
                                    inputParam={getSample}
                                    additionalParam={[]}
                                    mainField="ssamplecertificateversioncode"
                                    mainFieldLabel={this.props.intl.formatMessage({ id: "IDS_CERTIFICATENUMBER" })}
                                    listName="IDS_SAMPLE"
                                    showStatusLink={false}
                                    subFieldsLabel={true}
                                    subFields={
                                        [
                                            { [designProperties.LABEL]: "IDS_ARNO", [designProperties.VALUE]: "sarno" },
                                            { [designProperties.LABEL]: "IDS_MANUFACTURERLOTNO", [designProperties.VALUE]: "smanuflotno" },
                                            { [designProperties.LABEL]: "IDS_COMPONENT", [designProperties.VALUE]: "scomponentname" },
                                            // { [designProperties.LABEL]: "IDS_STATUS", [designProperties.VALUE]: "stransdisplaystatus", [designProperties.COLOUR]: "transstatuscolor" }
                                        ]
                                    }
                                    // moreField="sarno"
                                    //needValidation={false}
                                    needFilter={true}
                                    filterColumnData={this.props.filterColumnData}
                                    searchListName="searchedData"
                                    searchRef={this.searchRef}
                                    filterParam={filterParam}
                                    handlePageChange={this.handlePageChange}
                                    onFilterSubmit={this.onFilterSubmit}
                                    skip={this.state.skip}
                                    take={this.state.take}

                                    commonActions={
                                        <ProductList className="d-flex product-category float-right icon-group-wrap">
                                            {/* <ReactTooltip place="bottom" /> */}
                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                                onClick={() => this.reloadData()} >
                                                <RefreshIcon className='custom_icons'/>
                                            </Button>
                                        </ProductList>
                                    }
                                    filterComponent={[
                                        {
                                            "IDS_SAMPLECERTIFICATEGENERATION": <SampleCertificationFilter
                                                formatMessage={this.props.intl.formatMessage}
                                                Product={this.props.Login.masterData.MAHProduct || []}
                                                SampleType={this.state.SampleType || []}
                                                RegistrationType={this.state.RegistrationType || []}
                                                RegistrationSubType={this.state.RegistrationSubType || []}
                                                FilterStatus={this.state.FilterList || []}
                                                ApprovalVersion={this.state.ApprovalValue || []}
                                                ApprovalVersionValue={this.state.ApprovalVersionValue || []}
                                                userInfo={this.props.Login.userInfo || {}}
                                                SampleTypeValue={this.state.SampleTypeValue || {}}
                                                RegTypeValue={this.state.RegTypeValue || {}}
                                                regSubTypeValue={this.state.regSubTypeValue || {}}
                                                FilterStatusValue={this.state.FilterStatusValue || {}}
                                                // FilterStatusValue={this.props.Login.masterData.FilterStatus || {}}
                                                FromDate={this.fromDate}
                                                ToDate={this.toDate}
                                                onSampleTypeChange={this.onSampleTypeChange}
                                                onRegTypeChange={this.onRegTypeChange}
                                                onRegSubTypeChange={this.onRegSubTypeChange}
                                                handleFilterDateChange={this.handleFilterDateChange}
                                                handleDateChange={this.handleDateChange}
                                                onFilterComboChange={this.onFilterComboChange}
                                                onFilterChange={this.onFilterChange}

                                            />
                                        }
                                    ]}
                                />
                                <SplitterLayout vertical borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={400}
                                    customClassName="fixed_list_height">
                                    <PerfectScrollbar>

                                        <div className="card_group">
                                            <ContentPanel className="panel-main-content">
                                                <Card className="border-0">
                                                    {this.props.Login.masterData.SelectedRegistration ?
                                                        <>
                                                            <Card.Header>
                                                                {/* <ReactTooltip place="bottom" /> */}
                                                                <Card.Title className="product-title-main">
                                                                    {this.props.Login.masterData.SelectedRegistration.sarno}
                                                                </Card.Title>

                                                                <Card.Subtitle>
                                                                    <div className="d-flex product-category">
                                                                        <h2 className="product-title-sub flex-grow-1">
                                                                            <OutlineTransactionStatus
                                                                                transcolor={this.props.Login.masterData.SelectedRegistration.scolorhexcode}>
                                                                                {this.props.Login.masterData.SelectedRegistration.stransdisplaystatus}
                                                                            </OutlineTransactionStatus>
                                                                            {/* <DecisionStatus
                                                                                decisioncolor={this.props.Login.masterData.SelectedRegistration.sdecisioncolor}>
                                                                                {this.props.Login.masterData.SelectedRegistration.sdecisionstatus}
                                                                            </DecisionStatus> */}

                                                                            {/* <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                                                {this.props.Login.masterData.SelectedRegistration.sdecisionstatus}
                                                                            </span> */}
                                                                        </h2>
                                                                        <div className="d-flex product-category justify-content-end icon-group-wrap">
                                                                            {/* certificate Generation */}
                                                                            {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                                            <Nav.Link
                                                                                name="generateCertificate"
                                                                                hidden={this.state.userRoleControlRights.indexOf(genCertificateId) === -1}
                                                                                className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                ///onClick = {()=>this.props.(editParam)}
                                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_GENERATECERTIFICATE" })}
                                                                                onClick={(e) => this.generateCertificate("generate", this.props.Login.masterData, genCertificateId)}
                                                                            >
                                                                                <Certified className="custom_icons" width="20" height="20" name="Certified" />
                                                                            </Nav.Link>
                                                                            {/* Certificate Correction */}
                                                                            <Nav.Link name="correctionCertificate" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                hidden={this.state.userRoleControlRights.indexOf(certificateCorrectionId) === -1}
                                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_RECERTIFICATECORRECTION" })}
                                                                                onClick={(e) => this.correctionCertificate("CorrectionCertificate", this.props.Login.masterData, certificateCorrectionId)}
                                                                            >
                                                                                <CertificateCorrectionicon className="custom_icons" width="20" height="20"
                                                                                    name="Correction"
                                                                                />
                                                                            </Nav.Link>
                                                                            {/* Send Certificate */}
                                                                            <Nav.Link name="sendCertificate"
                                                                                hidden={this.state.userRoleControlRights.indexOf(sendCertificateId) === -1}
                                                                                className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_SENDCERTIFICATE" })}
                                                                                onClick={(e) => this.checkConfirmation(this.props.Login.masterData, sendCertificateId)}
                                                                            >
                                                                                <CertificateSend className="custom_icons" width="20" height="20"
                                                                                    name="Sent"
                                                                                />
                                                                            </Nav.Link>
                                                                            {/* Certificate XML */}
                                                                            <Nav.Link name="xmlExport" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                hidden={this.state.userRoleControlRights.indexOf(XmlReportID) === -1}
                                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_XMLEXPORT" })}
                                                                                onClick={(e) => this.xmlExport("Export", this.props.Login.masterData, XmlReportID)}
                                                                            >
                                                                                <FontAwesomeIcon icon={faFileCode} />
                                                                            </Nav.Link>

                                                                            <Nav.Link name="Report"
                                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_REGENREATEREPORT" })} hidden={this.state.userRoleControlRights.indexOf(ReportId) === -1}
                                                                                className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                onClick={() => this.showConfirmAlert(this.props.Login.masterData.SelectedRegistration, 1, ReportId)}
                                                                            >
                                                                                {/* <CertificateSend className="custom_icons" width="20" height="20"
                                                                                        name="ReportView"
                                                                                        /> */}
                                                                                <CertificateSend className="custom_icons" width="20" height="20"
                                                                                    name="Sent"
                                                                                />
                                                                            </Nav.Link>
                                                                            {/* </Tooltip> */}
                                                                        </div>
                                                                    </div>
                                                                </Card.Subtitle>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                <Row>
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_ARNO" message="Arno" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.sarno}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_COMPONENTNAME" message="Componentname" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.scomponentname}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_GENERICPRODUCT" message="Generic Product" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.sproductname}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_CERTIFICATENUMBER" message="Certificate No." /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.ssamplecertificateversioncode}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_VERSION" message="Version" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.sversion}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_MANUFACTURENAME" message="Manufacturename" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.smanufname}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_SPECIFICATIONSTUDYPLAN" message="Specificationname" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.sspecname}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>


                                                                    {this.props.Login.masterData.RegistrationSubTypeValue.nregsubtypecode !== RegistrationSubType.EXTERNAL_POOL ?
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel><FormattedMessage id="IDS_RMSNO" message="Rmsno" /></FormLabel>
                                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.nrmsno}</ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        : ""
                                                                    }


                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_REGISTRATIONDATE" message="RegistrationDate" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.dtransactiondate}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_MANUFLOTNO" message="Manuf Lot No." /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.smanuflotno}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_DECISIONSTATUS" message="Decisionstatus" /></FormLabel>
                                                                            <DecisionStatus style={{ marginLeft: "0rem" }}
                                                                                decisioncolor={this.props.Login.masterData.SelectedRegistration.sdecisioncolor}>
                                                                                {this.props.Login.masterData.SelectedRegistration.sdecisionstatus}
                                                                            </DecisionStatus>
                                                                            {/* <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.sdecisionstatus}</ReadOnlyText> */}
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <div className="horizontal-line"></div>

                                                                <Row>
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_USERNAME" message="User Name" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.CertificateHistoryView && this.props.Login.masterData.CertificateHistoryView[0] ? this.props.Login.masterData.CertificateHistoryView[0].username : "-"}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_USERROLE" message="User Role" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.CertificateHistoryView && this.props.Login.masterData.CertificateHistoryView[0] ? this.props.Login.masterData.CertificateHistoryView[0].suserrolename : "-"}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_CERTIFIEDDATE" message="Certified Date" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.CertificateHistoryView && this.props.Login.masterData.CertificateHistoryView[0] ? this.props.Login.masterData.CertificateHistoryView[0].scertificatedate : "-"}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={12}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_CERTIFICATECOMMENTS" message="Certificate Comments" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {
                                                                                    this.props.Login.masterData.CertificateHistoryView && this.props.Login.masterData.CertificateHistoryView[0] ?
                                                                                        this.props.Login.masterData.CertificateHistoryView[0].scomments === "" || this.props.Login.masterData.CertificateHistoryView[0].scomments === null ?
                                                                                            "-" : this.props.Login.masterData.CertificateHistoryView[0].scomments
                                                                                        : "-"
                                                                                }
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <CustomTab tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />

                                                            </Card.Body>
                                                        </>

                                                        : ""}
                                                </Card>
                                            </ContentPanel>
                                        </div>
                                    </PerfectScrollbar>
                                </SplitterLayout>
                            </SplitterLayout >
                        </Col>
                    </Row>
                </ListWrapper>

                {this.props.Login.showReport ?
                    <DocViewer file={fileViewUrl() + this.props.Login.ViewUrl} 
                    showReport = {this.props.Login.showReport}
                    closeModal = {this.closeModal}
                    type={"pdf"}>
                    </DocViewer>  
                    :""
                }

                {this.props.Login.openModal ?
                    <SlideOutModal
                        show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        esign={this.props.Login.loadEsign}
                        onSaveClick={this.onSaveClick}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        showSaveContinue={this.state.showSaveContinue}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : ""}
                    /> : ""}
                {/* End of Modal Sideout for GoodsIn Creation */}
            </>

        );

    }

    componentDidUpdate(previousProps) {

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const SampleMap = constructOptionList(this.props.Login.masterData.SampleType || [], "nsampletypecode",
                "ssampletypename", undefined, undefined, true);
            const SampleType = SampleMap.get("OptionList");
            const SampleTypeValue = { nsampletypecode: SampleType.length > 0 ? SampleType[0] : "" };

            const RegMap = constructOptionList(this.props.Login.masterData.RegistrationType || [], "nregtypecode",
                "sregtypename", undefined, undefined, true);
            const RegistrationType = RegMap.get("OptionList");
            const RegTypeValue = { nregtypecode: RegistrationType.length > 0 ? RegistrationType[0] : "" };

            const RegSubMap = constructOptionList(this.props.Login.masterData.RegistrationSubType || [], "nregsubtypecode",
                "sregsubtypename", 'nsorter', "ascending", false);
            const RegistrationSubType = RegSubMap.get("OptionList");
            //const regSubTypeValue = {nregsubtypecode: RegistrationSubType.length> 0? RegistrationSubType[2]: ""};

            const FilterStatus = constructOptionList(this.props.Login.masterData.FilterStatus || [], "napprovalstatuscode",
                "stransdisplaystatus", undefined, undefined, true);
            const FilterList = FilterStatus.get("OptionList")

            const ConfigVersionList = constructOptionList(this.props.Login.masterData.ApprovalVersion || [],
                "napprovalconfigversioncode", "sversionname", 'descending', 'ntransactionstatus', false);
            const ApprovalValue = ConfigVersionList.get("OptionList");
            // const ApprovalVersionValue = ApprovalValue.length > 0 ? ApprovalValue[0] : "" 

            // const Transcolor=  this.props.Login.masterData?this.props.Login.masterData["SelectedRegistration"]["stransdisplaystatus"]
            // :""
            // let  Transdisplaystatus={};
            // if(this.props.Login.masterData.SelectedRegistration.stransdisplaystatus===transactionStatus.CERTIFIED){
            //     Transdisplaystatus = this.props.Login.masterData["SelectedRegistration"]["stransdisplaystatus"]
            // }
            let FilterStatusValue = {};
            let regSubTypeValue = {};
            let ApprovalVersionValue = {};
            if (this.props.Login.masterData.operation === "FilterSubmit" || this.props.Login.masterData.operation === "onChange") {
                //FilterStatusValue = this.props.Login.masterData.FilterStatusValue //this.state.FilterStatusValue
                FilterStatusValue = { ntransactionstatus: { "label": this.props.Login.masterData.FilterStatusValue.stransdisplaystatus, "value": this.props.Login.masterData.FilterStatusValue.napprovalstatuscode ,
                "item":this.props.Login.masterData.FilterStatusValue}};
                regSubTypeValue = this.state.regSubTypeValue
                ApprovalVersionValue = this.props.Login.masterData.ApprovalVersionValue ?
                    {
                        label: this.props.Login.masterData.ApprovalVersionValue.sversionname,
                        value: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
                        item: this.props.Login.masterData.ApprovalVersionValue
                    }
                    : this.state.ApprovalVersionValue
            }
            else {
                FilterStatusValue = { ntransactionstatus: FilterList.length > 0 ? FilterList[0] : "" };
                regSubTypeValue = {
                    nregsubtypecode: RegistrationSubType.length > 0 ?
                        {
                            label: this.props.Login.masterData.RegistrationSubTypeValue.sregsubtypename,
                            value: this.props.Login.masterData.RegistrationSubTypeValue.nregsubtypecode,
                            item: this.props.Login.masterData.ApprovalVersionValue
                        }
                        : ""
                };
                ApprovalVersionValue = ApprovalValue.length > 0 ? ApprovalValue[0] : ""
            }
            let RealFilterValue = {};
            let RealRegSubTypeValue = {};
            let RealFromDate = {};
            let RealToDate = {};
            let RealApprovalVersion = {};
            if (this.props.Login.masterData.RealFilterValue !== previousProps.Login.masterData) {

                RealFilterValue = this.props.Login.masterData.RealFilterValue ? this.props.Login.masterData.RealFilterValue :
                    this.props.Login.masterData.FilterStatusValue ? this.props.Login.masterData.FilterStatusValue :""
                       

            }

            if (this.props.Login.masterData.RealRegSubTypeValue !== previousProps.Login.masterData) {

                RealRegSubTypeValue = this.props.Login.masterData.RealRegSubTypeValue ? this.props.Login.masterData.RealRegSubTypeValue :
                    this.props.Login.masterData.RegistrationSubTypeValue ? this.props.Login.masterData.RegistrationSubTypeValue.sregsubtypename :""
                        // this.props.intl.formatMessage({ id: "IDS_PLASMAPOOL" })

            }


            if (this.props.Login.masterData.RealFromDate !== previousProps.Login.masterData) {

                RealFromDate = this.props.Login.masterData.RealFromDate ? this.props.Login.masterData.RealFromDate :
                    this.props.Login.masterData.RealFromDate ? this.props.Login.masterData.RealFromDate : ""

            }


            if (this.props.Login.masterData.RealToDate !== previousProps.Login.masterData) {

                RealToDate = this.props.Login.masterData.RealToDate ? this.props.Login.masterData.RealToDate :
                    this.props.Login.masterData.RealToDate ? this.props.Login.masterData.RealToDate : ""

            }

            if (this.props.Login.masterData.ApprovalVersionValue !== previousProps.Login.masterData) {

                RealApprovalVersion = this.props.Login.masterData.RealApprovalVersion ? this.props.Login.masterData.RealApprovalVersion :
                    this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.sversionname :
                        " - "

            }


            // const RealFromDate = this.props.Login.masterData.RealFromDate ? this.props.Login.masterData.RealFromDate:""
            // const RealToDate = this.props.Login.masterData.RealToDate ? this.props.Login.masterData.RealToDate:""
            const RealSampleTypeValue = this.props.Login.masterData.SampleTypeValue ? this.props.Login.masterData.SampleTypeValue.ssampletypename : ""
            const RealRegTypeValue = this.props.Login.masterData.RegistrationTypeValue ? this.props.Login.masterData.RegistrationTypeValue.sregtypename : ""
          
          
        
            let {appHistoryDataState,
                resultsDataState,printHistoryDataState,sentMailHistory } = this.state;
            if (this.props.dataState === undefined) {
                if (this.props.screenName === "IDS_APPROVALHISTORY") {
                    appHistoryDataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
                }  else if (this.props.screenName === "IDS_MAILSTATUS") {
                    sentMailHistory = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
                } else if (this.props.screenName === "IDS_PRINTHISTORY") {
                    printHistoryDataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
                }       
                else if (this.props.screenName === "IDS_RESULTS") {
                    resultsDataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
                }          
                else {
                     appHistoryDataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
                     resultsDataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
                     printHistoryDataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
                     sentMailHistory = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
                }
            };
          
            this.setState({
                appHistoryDataState,resultsDataState,printHistoryDataState,sentMailHistory,SampleType, RegistrationType, RegistrationSubType, FilterList, SampleTypeValue, RegTypeValue, RealSampleTypeValue,
                regSubTypeValue, FilterStatusValue, RealRegTypeValue, RealRegSubTypeValue, RealFilterValue,
                RealFromDate, RealToDate, ApprovalValue, RealApprovalVersion, ApprovalVersionValue
            });

        }
        // if (this.props.Login.masterData.RealFilterValue !== previousProps.Login.masterData)  {

        //     const RealFilterValue = this.props.Login.masterData.RealFilterValue ? this.props.Login.masterData.RealFilterValue:""

        //     this.setState({RealFilterValue});
        //  }
        //else{
        //     const RealFilterValue = this.props.Login.masterData.RealFilterValue ? this.props.Login.masterData.RealFilterValue:""

        //     //this.setState({RealFilterValue});
        // }this.state.regSubTypeValue




        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            this.setState({ userRoleControlRights, controlMap });
        }
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential, updateStore, getSampleCertTypeChange, filterColumnData,viewAttachment,
    getSampleCertRegSubTypeChange, getTestResultData, getActiveSample, generateCertificateAction, sentCertificateAction,viewReportForSample,
    correctionCertificateAction, xmlExportAction, getWholeFilterStatus, validateXMLEsignCredential, getApprovalVersionSampleCertification, onClickReportSample,validateEsignforSampCerGen

}
)(injectIntl(SampleCertification));