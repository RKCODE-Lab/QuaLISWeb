import React from 'react';
import { Row, Col, Card, Nav, Button, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import {
    Utils as QbUtils,
} from "@react-awesome-query-builder/ui";
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
    callService, crudMaster, updateStore, validateEsignCredential,
    filterColumnData,
    getApprovedRecordsAsDraft,
    getReleasedRegistrationType, getReleasedRegistrationSubType,
    getReleasedFilterStatus, getReleasedApprovalVersion, getReleasedFilterBasedTest, getReleasedSample,
    generateReleasedReport,
    previewAndFinalReport, getRemoveApprovedSample, getDeleteApprovedSample, UpdateApprovedSample, getEditApprovedSample,
    getSectionForSectionWise, getreportcomments, fetchReportInfoReleaseById, UpdateReportComments,
    getApprovedSample, getReleasedDataDetails, getApprovedProjectByProjectType, getApprovedProjectType, getReportForPortal, getResultCorrectionData,
    fetchParameterById, updateCorrectionStatus, validateEsignforRelease, viewReportHistory, viewAttachment, versionHistory, downloadVersionReport,
    viewReleaseTestAttachment, downloadHistory, getPatientFilterExecuteData, rearrangeDateFormatforKendoDataTool, getPatientWiseSample,
    preliminaryReport, releaseReportHistory, onSaveReleaseTestAttachment, onDeleteReleaseTestAttachment, onSaveReleaseTestComment, onDeleteReleaseTestComment,
    generatereport, editReportTemplate, SaveReportTemplate, deleteSamples, filterTransactionList,
    validationforAppendSamples, getReleaseFilter, SaveReleaseComment, openReleaseComments
} from '../../actions';
import ListMaster from "../../components/list-master/list-master.component";
import {
    getControlMap, convertDateValuetoString, rearrangeDateFormat, constructOptionList, showEsign,
    Lims_JSON_stringify, create_UUID, onSaveMandatoryValidation, checkFilterIsEmptyQueryBuilder,
    removeSpaceFromFirst, sortData
} from '../../components/CommonScript';
import { SampleType, designProperties, ResultEntry, reportCOAType, transactionStatus, attachmentType } from '../../components/Enumeration';
import DataGridWithMultipleGrid from '../../components/data-grid/DataGridWithMultipleGrid';
import DataGrid from '../../components/data-grid/data-grid.component';
import { Affix } from 'rsuite';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import ReleaseFilter from './ReleaseFilter';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { ReactComponent as SaveIcon } from '../../assets/image/save_icon.svg';
import EsignStateHandle from '../audittrail/EsignStateHandle';
import { ContentPanel, ProductList } from '../product/product.styled';
import {
    faEdit, faPlus, faExpandArrowsAlt, faEye, faInfoCircle, faPencilAlt, faRecycle, faStore,
    faTrash, faFilePen, faFileCode, faDownload, faFilePdf, faHistory, faFile, faComments,
    faPaperclip, faCalculator, faSync, faSearch, faTimes,
    faBolt
} from '@fortawesome/free-solid-svg-icons';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { ReactComponent as Generate } from '../../assets/image/generate-certificate.svg'
import { ReactComponent as ReGenerate } from '../../assets/image/regenerate-icon.svg'
import { ReactComponent as ResultCorrection } from '../../assets/image/resultcorrection.svg'
import { ReactComponent as Correction } from '../../assets/image/correctionrelease.svg'
import { ReactComponent as Comment } from '../../assets/image/comment-edit-svgrepo-com.svg'
import { ReactComponent as DownloadCertificate } from '../../assets/image/Download Certificate.svg';
import { ReactComponent as PreliminaryReport } from '../../assets/image/preliminary_report.svg';
import { ReactComponent as ReportHistory } from '../../assets/image/reporthistory.svg';
import { ReactComponent as ReleaseTestAttachmentIcon } from '../../assets/image/releasetestattachment.svg';
import { ReactComponent as ReleaseTestCommentIcon } from '../../assets/image/releasetestcomment.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fileViewUrl, reportUrl } from '../../rsapi';
import DocViewer from '../../components/doc-viewer/doc-viewer.component';
import { REPORTTYPE } from "../../components/Enumeration";
import SampleInfoView from '../approval/SampleInfoView';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import ModalShow from '../../components/ModalShow';
import ResultEntryForm from '../ResultEntryBySample/ResultEntryForm';
import { numberConversion, numericGrade } from '../ResultEntryBySample/ResultEntryValidation';
import ReleaseTestAttachment from './ReleaseTestAttachment';
import ReleaseTestComment from './ReleaseTestComment';
import VersionHistGrid from './VersionHistGrid';
import FilterQueryBuilder from '../../components/FilterQueryBuilder';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import ReleaseReportHistory from './ReleaseReportHistory';
import { ReactComponent as Preview } from '../../assets/image/Preview.svg';
import { ReactComponent as TestAttachment } from '../../assets/image/Test Attachment.svg';
import AddReleaseTestAttachment from './AddReleaseTestAttachment';
import AddReleaseTestComment from './AddReleaseTestComment';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import SplitterLayout from 'react-splitter-layout';
import { ListWrapper } from '../../components/client-group.styles';
import SampleGridTab from '../registration/SampleGridTab';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { faTrashAlt, faThumbsUp, faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';//,faUserTimes, faTrash
import CustomPopover from '../../components/customPopover';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Release extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        const outsourceFileDataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        const slideOutDataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        }	// ALPD-4896, Added slideOutDataState for slideout datagrid
        const reportInfoDataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        const correctionDataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        const versionHistoryDataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        const preliminaryHistoryDataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        const testAttachmentDataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        const testCommentDataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        const sampleGridDataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        }

        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            outsourceFileDataState: outsourceFileDataState,
            slideOutDataState: slideOutDataState,   	// ALPD-4896, Added slideOutDataState for slideout datagrid
            reportInfoDataState: reportInfoDataState,
            correctionDataState: correctionDataState,
            versionHistoryDataState: versionHistoryDataState,
            preliminaryHistoryDataState: preliminaryHistoryDataState,
            childDataResult: [],
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map(),
            SampletypeList: [],
            ProjecttypeList: [],
            ProjectMasterList: [],
            SectionList: [],
            ReporttypeList: [],
            RegistrationTypeList: [],
            RegistrationSubTypeList: [],
            FilterStatusList: [],
            sampleSearchField: [],
            subsampleSearchField: [],
            testSearchField: [],
            searchedData: [],
            count: 0,
            SampleGridItem: [],
            combinedSearchField: [],
            npreregno: [],
            ntransactiontestcode: [],
            ntransactionsamplecode: [],
            stateDynamicDesign: [],
            sidebarview: false,
            testAttachmentDataState: testAttachmentDataState,
            testCommentDataState: testCommentDataState,
            sampleGridDataState: sampleGridDataState,
            splitChangeWidthPercentage: 28.6,
            skip: 0,
            take: this.props.Login.settings && parseInt(this.props.Login.settings[3])
            // ,
            // nmultiplesampleinsinglerelease: this.props.Login.masterData.realReportTypeValue && 
            //     this.props.Login.masterData.realReportTypeValue.nmultiplesampleinsinglerelease
        };
        this.searchRef = React.createRef();
        this.searchFieldList = ["sreportno", "susername", "stransdisplaystatus"];
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })
    }



    // expandNextData(y) {
    //     let change = []
    //     let x = process(this.props.Login.masterData.searchedData1 && this.props.Login.masterData.searchedData1 || this.props.Login.masterData.ReleaseSample && this.props.Login.masterData.ReleaseSample || [], y);

    //     let data = x.data.every(item => {
    //         return item.expanded === true
    //     })
    //     if (data === true) {
    //         change = true
    //     } else {
    //         change = false
    //     }
    //     this.expandFunc({ change: change })

    // }
    dataStateChange = (event) => {


        this.setState({ dataState: event.dataState, dataResult: process(this.state.data, event.dataState) })
        // this.expandNextData(event.dataState);
    }

    dataStateChangeSlideOut = (event) => {
        this.setState({ slideOutDataState: event.dataState, dataResult: process(this.state.data, event.dataState) })
    }	// ALPD-4896, Added dataStateChangeSlideOut to handle pagination inside slideout datagrid

    outsourceFileDataStateChange = (event) => {


        this.setState({ outsourceFileDataState: event.dataState, dataResult: process(this.state.data, event.dataState) })
        // this.expandNextData(event.dataState);
    }
    reportInfoDataChange = (event) => {


        this.setState({ reportInfoDataState: event.dataState, dataResult: process(this.state.data, event.dataState) })
        // this.expandNextData(event.dataState);
    }
    correctionDataStateChange = (event) => {


        this.setState({ correctionDataState: event.dataState, dataResult: process(this.state.data, event.dataState) })
        // this.expandNextData(event.dataState);
    }
    versionHistoryDataStateChange = (event) => {


        this.setState({ versionHistoryDataState: event.dataState, dataResult: process(this.state.data, event.dataState) })
        // this.expandNextData(event.dataState);
    }
    preliminaryHistoryDataStateChange = (event) => {


        this.setState({ preliminaryHistoryDataState: event.dataState, dataResult: process(this.state.data, event.dataState) })
        // this.expandNextData(event.dataState);
    }
    testAttachmentDataStateChange = (event) => {
        this.setState({ testAttachmentDataState: event.dataState, dataResult: process(this.state.data, event.dataState) })
    }
    testCommentDataStateChange = (event) => {
        this.setState({ testCommentDataState: event.dataState, dataResult: process(this.state.data, event.dataState) })
    }
    sampleGridDataStateChange = (event) => {
        this.setState({ sampleGridDataState: event.dataState, dataResult: process(this.state.data, event.dataState) })
    }

    static getDerivedStateFromProps(props, state) {
        if (props.Login.masterStatus !== "") {
            if (props.Login.errorCode === 409) {
                toast.warn(props.Login.masterStatus);
                props.Login.masterStatus = "";
            }
        }
        else if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        else if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }
    handleDateChange = (dateName, dateValue) => {
        if (dateValue === null) {
            dateValue = new Date();
        }
        let dfrom = this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()
        let dto = this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()
        let obj = {}
        if (dateName === 'fromDate') {
            obj = convertDateValuetoString(dateValue, dto, this.props.Login.userInfo)
            dfrom = obj.fromDate
            dto = obj.toDate
        } else {
            obj = convertDateValuetoString(dfrom, dateValue, this.props.Login.userInfo)
            dfrom = obj.fromDate
            dto = obj.toDate

        }
        let inputParam = {
            inputData: {
                nflag: 2,
                nregtypecode: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
                dfrom: String(dfrom),
                dto: String(dto),
                userinfo: this.props.Login.userInfo,
                realSampleTypeList: this.props.Login.masterData.realSampleTypeList || [],
                realReportTypeList: this.props.Login.masterData.realReportTypeList || [],
                realRegTypeList: this.props.Login.masterData.realRegTypeList || [],
                realRegSubTypeList: this.props.Login.masterData.realRegSubTypeList || [],
                realFilterStatusList: this.props.Login.masterData.realFilterStatusList || [],
                realApprovalVersionList: this.props.Login.masterData.realApprovalVersionList || [],
                realDesignTemplateMappingList: this.props.Login.masterData.realDesignTemplateMappingList || []
            },
            masterData: this.props.Login.masterData

        }
        this.props.getReleasedApprovalVersion(inputParam)
    }

    onFilterComboChange = (comboData, fieldName) => {

        if (comboData) {
            let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
            let inputParamData = {};
            if (fieldName === 'nsampletypecode') {
                if (comboData.value !== this.props.Login.masterData.SampleTypeValue.nsampletypecode) {
                    inputParamData = {
                        nflag: 2,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        SampleTypeValue: comboData.item,
                        realSampleTypeList: this.props.Login.masterData.realSampleTypeList || [],
                        realReportTypeList: this.props.Login.masterData.realReportTypeList || [],
                        realRegTypeList: this.props.Login.masterData.realRegTypeList || [],
                        realRegSubTypeList: this.props.Login.masterData.realRegSubTypeList || [],
                        realFilterStatusList: this.props.Login.masterData.realFilterStatusList || [],
                        realApprovalVersionList: this.props.Login.masterData.realApprovalVersionList || [],
                        realDesignTemplateMappingList: this.props.Login.masterData.realDesignTemplateMappingList || []
                    };
                    this.props.getReleasedRegistrationType(inputParamData)
                }
            }

            else if (fieldName === 'nregtypecode') {
                if (comboData.value !== this.props.Login.masterData.RegTypeValue.nregtypecode) {
                    inputParamData = {
                        nflag: 3,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                        nregtypecode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        RegTypeValue: comboData.item,
                        realSampleTypeList: this.props.Login.masterData.realSampleTypeList || [],
                        realReportTypeList: this.props.Login.masterData.realReportTypeList || [],
                        realRegTypeList: this.props.Login.masterData.realRegTypeList || [],
                        realRegSubTypeList: this.props.Login.masterData.realRegSubTypeList || [],
                        realFilterStatusList: this.props.Login.masterData.realFilterStatusList || [],
                        realApprovalVersionList: this.props.Login.masterData.realApprovalVersionList || [],
                        realDesignTemplateMappingList: this.props.Login.masterData.realDesignTemplateMappingList || []
                    }
                    this.props.getReleasedRegistrationSubType(inputParamData)
                }
            } else if (fieldName === 'nregsubtypecode') {

                if (comboData.value !== this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) {
                    let inputData = {
                        nflag: 4,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
                        nregsubtypecode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        realSampleTypeList: this.props.Login.masterData.realSampleTypeList || [],
                        realReportTypeList: this.props.Login.masterData.realReportTypeList || [],
                        realRegTypeList: this.props.Login.masterData.realRegTypeList || [],
                        realRegSubTypeList: this.props.Login.masterData.realRegSubTypeList || [],
                        realFilterStatusList: this.props.Login.masterData.realFilterStatusList || [],
                        realApprovalVersionList: this.props.Login.masterData.realApprovalVersionList || [],
                        realDesignTemplateMappingList: this.props.Login.masterData.realDesignTemplateMappingList || []
                    }
                    inputParamData = {
                        inputData,
                        masterData: {
                            ...this.props.Login.masterData,
                            RegSubTypeValue: comboData.item
                        }
                    }
                    this.props.getReleasedApprovalVersion(inputParamData)
                }
            }


            else if (fieldName === 'ndesigntemplatemappingcode') {
                // const inputParamData = {
                //     dfrom: obj.fromDate,
                //     dto: obj.toDate,
                //     nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                //     nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
                //     nregsubtypecode: this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
                //     napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
                //     userinfo: this.props.Login.userInfo,
                //     masterData: { ...this.props.Login.masterData },
                //     RegSubTypeValue: this.props.Login.masterData.RegSubTypeValue,
                //     ntransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
                //     stransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
                //     ndesigntemplatemappingcode: comboData.value,
                //     DesignTemplateMappingValue: comboData.item
                // }
                // this.props.getReleaseFilterBasedTest(inputParamData)

                let masterData = { ...this.props.Login.masterData, DesignTemplateMappingValue: comboData.item }
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { masterData }
                }
                this.props.updateStore(updateInfo);
            }
            else if (fieldName === 'napproveconfversioncode') {
                if (comboData.value !== this.props.Login.masterData.ApprovalVersionValue.napproveconfversioncode) {
                    inputParamData = {
                        nflag: 4,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
                        napprovalversioncode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: { ...this.props.Login.masterData, ApprovalVersionValue: comboData.item },
                        RegSubTypeValue: this.props.Login.masterData.RegSubTypeValue,
                        ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode ? this.props.Login.masterData.ndesigntemplatemappingcode : -1
                    }
                    this.props.getReleasedFilterStatus(inputParamData)
                }
            }
            //Don't Remove
            // else if (fieldName === 'nsectioncode') {
            //     if (comboData.value !== this.props.Login.masterData.UserSectionValue.nsectioncode) {
            //         // let masterData = { ...this.props.Login.masterData, UserSectionValue: comboData.item }
            //         inputParamData = {
            //             dfrom: obj.fromDate,
            //             dto: obj.toDate,
            //             nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
            //             nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
            //             nregsubtypecode: this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
            //             napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
            //             userinfo: this.props.Login.userInfo,
            //             masterData: { ...this.props.Login.masterData, UserSectionValue: comboData.item },
            //             RegSubTypeValue: this.props.Login.masterData.RegSubTypeValue,
            //             ntransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
            //             nsectioncode: comboData.value === -1 ? null
            //                 // this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") 
            //                 : comboData.value,
            //             stransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
            //             ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode ? this.props.Login.masterData.ndesigntemplatemappingcode : -1,
            //             DesignTemplateMappingValue: this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue
            //         }

            //         this.props.getReleasedFilterBasedTest(inputParamData);
            //     }
            // }
            // else if (fieldName === 'njobstatuscode') {
            //     if (comboData.value !== this.props.Login.masterData.JobStatusValue.njobstatuscode) {
            //         let masterData = { ...this.props.Login.masterData, JobStatusValue: comboData.item }
            //         const updateInfo = {
            //             typeName: DEFAULT_RETURN,
            //             data: { masterData }
            //         }
            //         this.props.updateStore(updateInfo);
            //     }
            // }
            else if (fieldName === 'ntestcode') {
                if (comboData.value !== this.props.Login.masterData.TestValue.ntestcode) {
                    let masterData = { ...this.props.Login.masterData, TestValue: comboData.item }
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData }
                    }
                    this.props.updateStore(updateInfo);
                }
            }
            else if (fieldName === 'ncoareporttypecode') {
                if (comboData.value !== this.props.Login.masterData.ReportTypeValue.ncoareporttypecode) {
                    let masterData = { ...this.props.Login.masterData, ReportTypeValue: comboData.item }
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData }
                    }
                    this.props.updateStore(updateInfo);
                }
            }
            // else {
            //     if (comboData.value !== this.props.Login.masterData.FilterStatusValue.ntransactionstatus) {
            //         //  let masterData = { ...this.props.Login.masterData, FilterStatusValue: comboData.item }
            //         //  const updateInfo = {
            //         //     typeName: DEFAULT_RETURN,
            //         //    data: { masterData }
            //         // }

            //         inputParamData = {
            //             dfrom: obj.fromDate,
            //             dto: obj.toDate,
            //             nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
            //             nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
            //             nregsubtypecode: this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
            //             napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
            //             userinfo: this.props.Login.userInfo,
            //             masterData: { ...this.props.Login.masterData, FilterStatusValue: comboData.item },
            //             RegSubTypeValue: this.props.Login.masterData.RegSubTypeValue,
            //             ntransactionstatus: comboData.value,
            //             stransactionstatus: comboData.value === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : comboData.value,
            //             nsectioncode: null//this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? 
            //             //this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") 
            //             //: this.props.Login.masterData.UserSectionValue.nsectioncode,
            //             , ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode ? this.props.Login.masterData.ndesigntemplatemappingcode : -1
            //             , DesignTemplateMappingValue: this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue

            //         }

            //         this.props.getReleaseFilterBasedTest(inputParamData);
            //     }
            // }
        }
    }
    closeFilter = () => {
        let inputValues = {
            fromDate: this.props.Login.masterData.realFromDate || new Date(),//this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date() ,
            toDate: this.props.Login.masterData.realToDate || new Date(),//this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date() ,
            SampleTypeValue: this.props.Login.masterData.realSampleTypeValue || {},
            ReportTypeValue: this.props.Login.masterData.realReportTypeValue || {},
            RegTypeValue: this.props.Login.masterData.realRegTypeValue || {},
            RegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue || {},
            ApprovalVersionValue: this.props.Login.masterData.realApprovalVersionValue || {},
            DesignTemplateMappingValue: this.props.Login.masterData.realDesignTemplateMappingValue || {},
            FilterStatusValue: this.props.Login.masterData.realFilterStatusValue || {},
            SampleType: this.props.Login.masterData.realSampleTypeList || [],
            ReportType: this.props.Login.masterData.realReportTypeList || [],
            RegType: this.props.Login.masterData.realRegTypeList || [],
            RegSubType: this.props.Login.masterData.realRegSubTypeList || [],
            FilterStatus: this.props.Login.masterData.realFilterStatusList || [],
            ApprovalVersion: this.props.Login.masterData.realApprovalVersionList || [],
            DesignTemplateMapping: this.props.Login.masterData.realDesignTemplateMappingList || []

        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false, masterData: { ...this.props.Login.masterData, ...inputValues } },
        };
        this.props.updateStore(updateInfo);
    }


    viewDownloadFile = (filedata) => {

        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
        const inputParam = {
            inputData: {
                // change: this.props.Login.change,
                // npreregno: this.props.Login.masterData.selectedReleaseHistory.spreregno,
                ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 0
                    && this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode,
                //ntransactionsamplecode: this.props.Login.masterData.selectedReleaseHistory.stransactionsamplecode,
                //ntransactiontestcode: this.props.Login.masterData.selectedReleaseHistory.stransactiontestcode,
                ncoareporthistorycode: filedata.inputData.ncoareporthistorycode ? filedata.inputData.ncoareporthistorycode : -1,
                npreliminaryreporthistorycode: filedata.inputData.npreliminaryreporthistorycode ? filedata.inputData.npreliminaryreporthistorycode : -1,
                //ntransactionstatus: String(transactionStatus.RELEASED),
                //nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,

                // napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
                // napproveconfversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
                // nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                // nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                dfrom: obj.fromDate,
                dto: obj.toDate,
                //nflag: 2,
                userinfo: this.props.Login.userInfo,
                //sreportcomments: "",
                //nprimarykey: this.props.Login.masterData.selectedReleaseHistory.spreregno,
                //ncoareporttypecode: this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
                //nreporttypecode: REPORTTYPE.COAREPORT,
                sprimarykeyname: "npreregno",
                action: "DownloadVersionhistory",
                doAction: "download",
                // ndesigntemplatemappingcode: (this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode) || -1,
                openModal: true,
                userInfo: this.props.Login.userInfo,
                ncontrolCode: filedata.ncontrolCode
            },
            screenName: this.props.intl.formatMessage({ id: "IDS_RELEASEHISTORY" })

        }
        this.props.downloadVersionReport(inputParam, this.props.Login.masterData, inputParam.screenName)

    }

    // downloadPreliminaryHistory = (filedata) => {

    //     let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)

    //     const inputParam = {
    //         inputData: {
    //             // change: this.props.Login.change,
    //             // npreregno: this.props.Login.masterData.selectedReleaseHistory.spreregno,
    //             ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory.ncoaparentcode,
    //             //ntransactionsamplecode: this.props.Login.masterData.selectedReleaseHistory.stransactionsamplecode,
    //             //ntransactiontestcode: this.props.Login.masterData.selectedReleaseHistory.stransactiontestcode,
    //             npreliminaryreporthistorycode:filedata.inputData.npreliminaryreporthistorycode,
    //             //ntransactionstatus: String(transactionStatus.RELEASED),
    //             //nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
    //             nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
    //             nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,

    //             // napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
    //             // napproveconfversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
    //             // nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
    //             // nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
    //             dfrom: obj.fromDate,
    //             dto: obj.toDate,
    //             //nflag: 2,
    //             userinfo: this.props.Login.userInfo,
    //             //sreportcomments: "",
    //             //nprimarykey: this.props.Login.masterData.selectedReleaseHistory.spreregno,
    //             //ncoareporttypecode: this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
    //             //nreporttypecode: REPORTTYPE.COAREPORT,
    //             sprimarykeyname: "npreregno",
    //             action: "DownloadPreliminaryHistory",
    //             doAction: "download",
    //            // ndesigntemplatemappingcode: (this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode) || -1,
    //             openModal:true,
    //             userInfo: this.props.Login.userInfo,
    //             ncontrolCode:filedata.ncontrolCode
    //         },
    //       //  screenName: this.props.intl.formatMessage({ id: "IDS_VERSIONHISTORY" })

    //     }
    //     this.props.downloadPreliminaryHistory(inputParam, this.props.Login.masterData, inputParam.screenName)

    // }


    onFilterSubmit = () => {
        this.searchRef.current.value = "";
        this.props.Login.change = false

        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
        let realFromDate = obj.fromDate;
        let realToDate = obj.toDate
        let realSampleTypeValue = this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue
        let realRegTypeValue = this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue
        let realRegSubTypeValue = this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue
        let realFilterStatusValue = this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue
        let realApprovalVersionValue = this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue
        //  let realUserSectionValue = this.props.Login.masterData.UserSectionValue && this.props.Login.masterData.UserSectionValue
        //  let realTestValue = this.props.Login.masterData.TestValue && this.props.Login.masterData.TestValue
        let realReportTypeValue = this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue
        let realDesignTemplateMappingValue = this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue
        let realSampleTypeList = this.props.Login.masterData.SampleType || [];
        let realReportTypeList = this.props.Login.masterData.ReportType || [];
        let realRegTypeList = this.props.Login.masterData.RegType || [];
        let realRegSubTypeList = this.props.Login.masterData.RegSubType || [];
        let realFilterStatusList = this.props.Login.masterData.FilterStatus || [];
        let realApprovalVersionList = this.props.Login.masterData.ApprovalVersion || [];
        let realDesignTemplateMappingList = this.props.Login.masterData.DesignTemplateMapping || [];
        let masterData = {
            ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue, realRegTypeValue,
            realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue,
            //  realUserSectionValue, realTestValue,
            realDesignTemplateMappingValue, realReportTypeList, realRegSubTypeList, realRegTypeList,
            realReportTypeValue, realSampleTypeList, realFilterStatusList, realApprovalVersionList, realDesignTemplateMappingList
        }
        let inputData = {
            npreregno: "0",
            saveFilterSubmit: true, //ALPD-4878 to insert the filter data's in filterdetail table when submit the filter,done by Dhanushya RI
            sampleTypeValue: this.props.Login.masterData && this.props.Login.masterData.SampleTypeValue,
            regTypeValue: this.props.Login.masterData && this.props.Login.masterData.RegTypeValue,
            regSubTypeValue: this.props.Login.masterData && this.props.Login.masterData.RegSubTypeValue,
            filterStatusValue: this.props.Login.masterData && this.props.Login.masterData.FilterStatusValue,
            approvalConfigValue: this.props.Login.masterData && this.props.Login.masterData.ApprovalVersionValue,
            reportTypeValue: this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue,
            designTemplateMappingValue: this.props.Login.masterData && this.props.Login.masterData.DesignTemplateMappingValue,
            nsampletypecode: (this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue.nsampletypecode) || -1,
            nregtypecode: parseInt(this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode) || -1,
            nregsubtypecode: parseInt(this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) || -1,
            ntransactionstatus: ((this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== undefined) || this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== '0') ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) + ',' + String(transactionStatus.RELEASED) : "-1",
            ncoareporttypecode: parseInt(this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue.ncoareporttypecode) || -1,
            isneedsection: parseInt(this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue.isneedsection) || transactionStatus.NO,
            napprovalconfigcode: this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigcode || -1 : null,
            napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode) : -1,
            // ntestcode: this.props.Login.masterData.TestValue ? this.props.Login.masterData.TestValue.ntestcode : -1,
            nneedsubsample: (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample) || false,
            nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
            userinfo: this.props.Login.userInfo,
            ndesigntemplatemappingcode: (this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode
                ? this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode : this.props.Login.masterData.DesignTemplateMappingValue) || -1
        }
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
            && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
            // && realFilterStatusValue.sfilterstatus !== null
            && inputData.ncoareporttypecode !== -1) {

            inputData['dfrom'] = obj.fromDate;
            inputData['dto'] = obj.toDate;
            let inputParam = {
                masterData,
                inputData
            }
            this.props.getReleasedSample(inputParam, this.state.selectedRecord, this.props.Login.selectedRecord, this.props.Login)
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }

    }
    //end- search logic
    checkFunction = (data) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                arrayfalse: data.arrayfalse,
                childfalsearray: data.childfalsearray
            }
        }
        this.props.updateStore(updateInfo);
    }
    checkFunction1 = () => {
        this.setState({
            count: 1
        })
    }
    expandFunc = (change) => {
        let count = change.count;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: { ...this.props.Login.masterData },
                change: change.change,
                isAddPopup: false,
                isEditPopup: this.props.Login.isEditPopup,
                isDeletePopup: this.props.Login.isDeletePopup,
                checkFlag: "1",
                count: count,
                expandFlag: true    //  ALPD-5570   Added expandFlag by Vishakh to handle pagination
            }
        }
        this.props.updateStore(updateInfo);
    }
    gridfillingColumn(data) {
        const temparray = data && data.map((option) => {
            return { "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode], "dataField": option[designProperties.VALUE], "width": "200px", "columnSize": "3" };
        });
        return temparray;
    }
    viewReport = () => {
        if (this.props.Login.masterData.ReportPDFFile && this.props.Login.masterData.ReportPDFFile.length > 0) {
            let showReport = true;
            this.setState({ showReport });
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_REPORTNOTGENERATED" }));
        }
    }

    handleReportNoPageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

    getApprovedSample = (inputParam, ncontrolCode) => {
        if (inputParam.masterData && inputParam.masterData.realReportTypeValue) {
            this.props.getApprovedSample(inputParam, ncontrolCode);
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }));
        }
    }

    // This methods can use for multi select delete samples if required
    // ConfirmDelete = (inputParam) => {
    //     const selectedReleaseHistory = this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory ? this.props.Login.masterData.selectedReleaseHistory : [];
    //     const resultArray = selectedReleaseHistory.length > 0 ? [...new Set(selectedReleaseHistory.map(item => item["ntransactionstatus"]))] : [] ;
    //     const reportTemplateCheck = selectedReleaseHistory.length > 0 ? [...new Set(selectedReleaseHistory.map(item => item["nreporttemplatecode"]))] : [] ;
    //     if(resultArray.length === 1){
    //             if(resultArray[0] === transactionStatus.DRAFT || resultArray[0] === transactionStatus.CORRECTION){
    //                 this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
    //                 this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
    //                 () => this.DeleteSamples("delete", controlId));
    //             } else {
    //                 toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTCORRECTEDRECORD" }));
    //             }
    //     } else if (resultArray.length === 0) {
    //         toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRECORDSTODELETECANCEL" }));
    //     } else {
    //         toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRECORDSWITHSAMESTATUS" }));
    //     } 
    // }
    // DeleteSamples = (action, controlId) => {
    //     // const selectedReleaseHistory = this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory ? this.props.Login.masterData.selectedReleaseHistory : [];
    //     // const coaParentCode = selectedReleaseHistory.length > 0 ? [...new Set(selectedReleaseHistory.map(item => item["ncoaparentcode"]))] : [] ;
    //     let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
    //     const inputParam = {
    //         inputData: {
    //             ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory ? this.props.Login.masterData.selectedReleaseHistory.map(item => item.ncoaparentcode).join(",") : "-1",
    //             userinfo: this.props.Login.userInfo,
    //             ncontrolCode: controlId,
    //             action: action,
    //             dfrom: obj.fromDate,
    //             dto: obj.toDate,
    //             napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
    //             nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
    //             nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
    //             ntransactionstatus: String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus),
    //             nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
    //             isAddPopup: false,
    //             isEditPopup: false,
    //             isneedsection: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
    //             ncoareporttypecode: this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
    //             nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
    //             ndesigntemplatemappingcode: (this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode) || -1,
    //             nreporttemplatecode: this.props.Login.masterData.selectedReleaseHistory ? this.props.Login.masterData.selectedReleaseHistory[0].nreporttemplatecode : -1,
    //             ncoaparenttranscode: this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus,
    //             npreregno: this.props.Login.masterData.selectedReleaseHistory ? this.props.Login.masterData.selectedReleaseHistory.map(item => item.spreregno).join(",") : "-1",
    //             ntransactionsamplecode: this.props.Login.masterData.selectedReleaseHistory ? this.props.Login.masterData.selectedReleaseHistory.map(item => item.stransactionsamplecode).join(",") : "-1",
    //             ntransactiontestcode: this.props.Login.masterData.selectedReleaseHistory ? this.props.Login.masterData.selectedReleaseHistory.map(item => item.stransactiontestcode).join(",") : "-1",
    //             nneedsubsample: (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample) || false
    //         }
    //     }
    //     this.props.deleteSamples(inputParam, this.props.Login.masterData)
    // }

    ConfirmDelete = (inputParam) => {
        if (inputParam.deleteSamples.ntransactionstatus === transactionStatus.DRAFT || inputParam.deleteSamples.ntransactionstatus === transactionStatus.CORRECTION) {
            this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
                this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                () => this.DeleteSamples("delete", inputParam.controlId, inputParam));

        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTCORRECTEDRECORD" }));
        }
    }

    DeleteSamples = (action, controlId, data) => {
        // ALPD-4091 (16-05-2024) Changed ApprovalVersionValue to realApprovalVersionValue
        // ALPD-4091 (16-05-2024) Changed FilterStatusValue to realFilterStatusValue
        // ALPD-4091 (16-05-2024) Changed ndesigntemplatemappingcode to realDesignTemplateMappingValue
        // ALPD-4091 (16-05-2024) Changed RegSubTypeValue to realRegSubTypeValue
        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
        const inputParam = {
            inputData: {
                ncoaparentcode: data.deleteSamples.ncoaparentcode.toString(),
                userinfo: this.props.Login.userInfo,
                ncontrolCode: controlId,
                action: action,
                dfrom: obj.fromDate,
                dto: obj.toDate,
                napprovalversioncode: (this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) || -1,
                nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus),
                nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                isAddPopup: false,
                isEditPopup: false,
                isneedsection: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
                ncoareporttypecode: this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
                nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
                nreporttemplatecode: data.deleteSamples.nreporttemplatecode,
                ncoaparenttranscode: data.deleteSamples.ntransactionstatus,
                npreregno: data.deleteSamples.spreregno,
                ntransactionsamplecode: data.deleteSamples.stransactionsamplecode,
                ntransactiontestcode: data.deleteSamples.stransactiontestcode,
                nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                url: this.props.Login.settings[24],
                nportalrequired: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nportalrequired
            },
            searchRef: this.searchRef   // ALPD-4229 (30-05-2024) Added searchRef to clear search text
        }
        this.props.deleteSamples(inputParam, this.props.Login.masterData)
    }

    render() {
        // ALPD-4229 (12-06-2024) Added sortData to sort the ReleaseHistory in all scenarios
        this.props.Login.masterData && this.props.Login.masterData.ReleaseHistory && this.props.Login.masterData.ReleaseHistory.length > 0
            && sortData(this.props.Login.masterData.ReleaseHistory, "", 'ncoaparentcode');
        const editReportParam = {
            screenName: this.props.Login.screenName, primaryKeyField: "nreportinforeleasecode", operation: "update",//selectedId:,
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: -1, masterData: this.props.Login.masterData, selectedId: this.props.Login.selectedId
        };
        this.feildsForGrid =
            [
                // { "idsName": "IDS_TEST", "dataField": "stestsynonym", "width": "200px" },  
                { "idsName": "IDS_SCREEN", "dataField": "testname", "width": "100px" },
                { "idsName": "IDS_FIELDNAME", "dataField": "sreportfieldname", "width": "100px" },
                { "idsName": "IDS_VALUE", "dataField": "sreportfieldvalue", "width": "100px" }
            ];

        this.fieldsForReleasedReportGrid =
            [
                { "idsName": "IDS_RELEASENO", "dataField": "sreleaseno", "width": "200px" },
                { "idsName": "IDS_VERSIONNO", "dataField": "nversionno", "width": "200px" },
                { "idsName": "IDS_ORDERID", "dataField": "sexternalorderid", "width": "200px" },
                { "idsName": "IDS_REPORTEDSITE", "dataField": "ssitename", "width": "200px" },
                { "idsName": "IDS_REPORTEDDATE", "dataField": "sreleasedate", "width": "200px" },
                { "idsName": "IDS_REPORTEDUSER", "dataField": "susername", "width": "200px" },
            ];

        const mandatoryFields = [{ "mandatory": true, "idsName": "IDS_DESCRIPTION", "dataField": "sreportcomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            //  { "mandatory": true, "idsName": "IDS_TECHNIQUE", "dataField": "ntechniquecode"  , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
            // { "mandatory": true, "idsName": "IDS_INTERFACETYPE", "dataField": "ninterfacetypecode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
        ];
        const mandatoryCommentsFields = [{ "mandatory": true, "idsName": "IDS_COMMENTS", "dataField": "sreleasecomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
        ];
        
        const mandatoryFieldsFilter = [{ "mandatory": true, "idsName": "IDS_FILTERNAME", "dataField": "sfiltername", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]
        
        //ATE234 ALPD-5549 Release & Report --> (Report Comments) Able save the mandatory field without having the data. Check description
        const mandatoryCommentsFieldsModalShow = [{ "mandatory": true, "idsName": "IDS_COMMENTS", "dataField": "sreportfieldvalue", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }];

        let resultCorrectionColumnList = [{ "idsName": "IDS_ARNO", "dataField": "sarno", "width": "150px" }];
        {
            this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample &&
            resultCorrectionColumnList.push(
                { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "150px" }
            )
        }
        resultCorrectionColumnList.push(
            { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "150px" },
            { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametersynonym", "width": "150px" },
            { "idsName": "IDS_FINALRESULT", "dataField": "sfinal", "width": "150px" },
            { "idsName": "IDS_RESULTFLAG", "dataField": "sgradename", "width": "150px", "fieldType": "gradeColumn" },
            //Commented  by sonia ALPD-4275 for Unit Name NA Showing
            //{ "idsName": "IDS_UNIT", "dataField": "sunitname", "width": "150px" },
            { "idsName": "IDS_RESULTACCURACY", "dataField": "sresultaccuracyname", "width": "150px" },
            { "idsName": "IDS_LOWA", "dataField": "smina", "width": "150px" },
            { "idsName": "IDS_LOWB", "dataField": "sminb", "width": "150px" },
            { "idsName": "IDS_HIGHA", "dataField": "smaxa", "width": "150px" },
            { "idsName": "IDS_HIGHB", "dataField": "smaxb", "width": "150px" },
            /* { "idsName": "IDS_MINLOD", "dataField": "sminlod", "width": "150px" },
             { "idsName": "IDS_MAXLOD", "dataField": "smaxlod", "width": "150px" },
             { "idsName": "IDS_MINLOQ", "dataField": "sminloq", "width": "150px" },
             { "idsName": "IDS_MAXLOQ", "dataField": "smaxloq", "width": "150px" }*/
        )

        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
        let filePath = "";
        if (this.props.Login.masterData.filetype && this.props.Login.masterData.filetype == "mrt") {
            filePath = reportUrl();
        } else {
            filePath = fileViewUrl() + "/SharedFolder/ReportView/" + this.state.reportFilePath;
        }
        // let userStatusCSS = "";
        // let activeIconCSS = "fa fa-check";
        // if (this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.ntransactionstatus === transactionStatus.DRAFT) {
        //     userStatusCSS = "outline-secondary";
        //     activeIconCSS = "";
        // }
        // else if (this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.ntransactionstatus === transactionStatus.RELEASED) {
        //     userStatusCSS = "outline-success";
        // }
        // else {
        //     userStatusCSS = "outline-Final";
        // }
        const filterParam = {
            inputListName: "ReleaseHistory",
            selectedObject: "selectedReleaseHistory",
            primaryKeyField: "ncoaparentcode",
            fetchUrl: "release/getReleaseHistory",
            masterData: this.props.Login.masterData,
            searchFieldList: this.searchFieldList,
            changeList: [],  // ALPD-4229 (30-05-2024) Removed changeList value to make search filter work correctly
            fecthInputObject: {
                isSearch: true, userinfo: this.props.Login.userInfo,
                nregtypecode: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                obj: convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo),
                dfrom: obj.fromDate,
                dto: obj.toDate,
                masterData: this.props.Login.masterData,
                searchFieldList: this.searchFieldList,
                nsampletypecode: (this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue.nsampletypecode) || -1,
                nregtypecode: parseInt(this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode) || -1,
                ncoareporttypecode: parseInt(this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue.ncoareporttypecode) || -1,
                isneedsection: parseInt(this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue.isneedsection) || transactionStatus.NO,
                nregsubtypecode: parseInt(this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) || -1,
                ntransactionstatus: ((this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== undefined)
                    || this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== '0') ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) : "-1",
                napprovalconfigcode: this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigcode || -1 : null,
                napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode) : null,
                //  ntestcode: this.props.Login.masterData.TestValue ? this.props.Login.masterData.TestValue.ntestcode : -1,
                nneedsubsample: (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample) || false,
                nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                ndesigntemplatemappingcode: (this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode
                    ? this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode : this.props.Login.masterData.DesignTemplateMappingValue) || -1
            }
        };

        let breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": obj.breadCrumbFrom
            }, {
                "label": "IDS_TO",
                "value": obj.breadCrumbto
            },

            {
                "label": "IDS_REGTYPE",
                "value": this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.sregtypename || "NA" :
                    this.props.Login.masterData.RegTypeValue ? this.props.Login.masterData.RegTypeValue.sregtypename || "NA" : "NA"
            }, {
                "label": "IDS_REGSUBTYPE",
                "value": this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.sregsubtypename || "NA" :
                    this.props.Login.masterData.RegSubTypeValue ?
                        this.props.Login.masterData.RegSubTypeValue.sregsubtypename : "NA"
            }, {
                "label": "IDS_REPORTTYPE",
                "value": this.props.Login.masterData.realReportTypeValue ? this.props.Login.masterData.realReportTypeValue.scoareporttypename || "NA" :
                    this.props.Login.masterData.ReportTypeValue ?
                        this.props.Login.masterData.ReportTypeValue.scoareporttypename : "NA"
            }
        ];
        const releaseId = this.props.Login.inputParam && this.state.controlMap.has("AddSamples")
            && this.state.controlMap.get('AddSamples').ncontrolcode;

        const preliminaryId =
            this.state.controlMap.has("PreliminaryReport") &&
            this.state.controlMap.get("PreliminaryReport").ncontrolcode;
        const previewId =
            this.state.controlMap.has("PreviewFinalReport") &&
            this.state.controlMap.get("PreviewFinalReport").ncontrolcode;
        const downloadId =
            this.state.controlMap.has("ReleaseReportGeneration") &&
            this.state.controlMap.get("ReleaseReportGeneration").ncontrolcode;
        const regenerateId =
            this.state.controlMap.has("RegenerateRelease") &&
            this.state.controlMap.get("RegenerateRelease").ncontrolcode;
        const viewreportId =
            this.state.controlMap.has("ViewReportRelease") &&
            this.state.controlMap.get("ViewReportRelease").ncontrolcode;
        const sendtoportalId =
            this.state.controlMap.has("SendToPortal") &&
            this.state.controlMap.get("SendToPortal").ncontrolcode;
        const editId =
            this.state.controlMap.has("AppendSamples") &&
            this.state.controlMap.get("AppendSamples").ncontrolcode;
        const deleteId =
            this.state.controlMap.has("RemoveSamples") &&
            this.state.controlMap.get("RemoveSamples").ncontrolcode;
        const patientinfoId =
            this.state.controlMap.has("PatientInfo") &&
            this.state.controlMap.get("PatientInfo").ncontrolcode;
        const ResultCorrectionId =
            this.state.controlMap.has("ResultCorrection") &&
            this.state.controlMap.get("ResultCorrection").ncontrolcode;
        const editResultId =
            this.state.controlMap.has("EditResult") &&
            this.state.controlMap.get("EditResult").ncontrolcode;
        const editcommentsId =
            this.state.controlMap.has("EditComment") &&
            this.state.controlMap.get("EditComment").ncontrolcode;
        const correctionId =
            this.state.controlMap.has("Correction") &&
            this.state.controlMap.get("Correction").ncontrolcode;
        const releaseHistoryId =
            this.state.controlMap.has("ReleaseHistory") &&
            this.state.controlMap.get("ReleaseHistory").ncontrolcode;
        const downloadVersionHist =
            this.state.controlMap.has("DownloadReleaseVersion") &&
            this.state.controlMap.get("DownloadReleaseVersion").ncontrolcode;
        const downloadReportId =
            this.state.controlMap.has("DownloadReport") &&
            this.state.controlMap.get("DownloadReport").ncontrolcode;
        const reportHistoryId =
            this.state.controlMap.has("ReportHistory") &&
            this.state.controlMap.get("ReportHistory").ncontrolcode;
        const releaseTestAttachmentId =
            this.state.controlMap.has("ReleaseTestAttachment") &&
            this.state.controlMap.get("ReleaseTestAttachment").ncontrolcode;
        const releaseTestCommentId =
            this.state.controlMap.has("ReleaseTestComment") &&
            this.state.controlMap.get("ReleaseTestComment").ncontrolcode;
        const releaseReportHistoryId =
            this.state.controlMap.has("ReleaseReportHistory") &&
            this.state.controlMap.get("ReleaseReportHistory").ncontrolcode;
        const generateid =
            this.state.controlMap.has("Generate") &&
            this.state.controlMap.get("Generate").ncontrolcode;
        const editReportTemplateId =
            this.state.controlMap.has("EditReportTemplate") &&
            this.state.controlMap.get("EditReportTemplate").ncontrolcode;

        const deleteSampleId = this.props.Login.inputParam && this.state.controlMap.has("DeleteSamples")
            && this.state.controlMap.get('DeleteSamples').ncontrolcode;

        const filterNameId = this.state.controlMap.has("FilterName") ? this.state.controlMap.get("FilterName").ncontrolcode : -1;

        const filterDetailId = this.state.controlMap.has("FilterDetail") ? this.state.controlMap.get("FilterDetail").ncontrolcode : -1;

        const releaseCommentId = this.props.Login.inputParam && this.state.controlMap.has("ReportComment")
            && this.state.controlMap.get('ReportComment').ncontrolcode;

        const editParam = {
            screenName: this.props.Login.screenName, primaryKeyField: "ntransactionresultcode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editResultId, masterData: this.props.Login.masterData
        };

        const ReleaseMasterDataParam = {
            realFromDate: obj.fromDate,
            realToDate: obj.toDate,
            realSampleTypeValue: this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue,
            realRegTypeValue: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue,
            realRegSubTypeValue: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue,
            realReportTypeValue: this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue,
            realFilterStatusValue: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue,
            realApprovalVersionValue: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue,
            //   realUserSectionValue: this.props.Login.masterData.UserSectionValue && this.props.Login.masterData.UserSectionValue,
            //   realTestValue: this.props.Login.masterData.TestValue && this.props.Login.masterData.TestValue,
            realDesignTemplateMappingValue: this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue,
            masterData: { ...this.props.Login.masterData },

            inputData: {
                obj: convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo),
                'dfrom': obj.fromDate,
                'dto': obj.toDate,
                'npreregno': (this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 0 && this.props.Login.masterData.selectedReleaseHistory[0].npreregno) || "0",
                'nsampletypecode': (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode) || -1,
                'nregtypecode': parseInt(this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
                'nregsubtypecode': parseInt(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
                'ntransactionstatus': String(transactionStatus.RELEASED) + ',' + String(this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus),
                //  'ntestcode': this.props.Login.masterData.TestValue ? this.props.Login.masterData.TestValue.ntestcode : -1,
                "napprovalconfigcode": this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
                "napprovalversioncode": this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) : null,
                'nneedsubsample': (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                'userinfo': this.props.Login.userInfo,
                'ndesigntemplatemappingcode': (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
                'ncoareporttypecode': this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
                'isneedsection': parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,

                // 'ncoahistorycode':COAHistory

            }
        };

        const ApprovedModalParam = {
            realFromDate: obj.fromDate,
            realToDate: obj.toDate,
            realSampleTypeValue: this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue,
            realRegTypeValue: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue,
            realRegSubTypeValue: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue,
            realFilterStatusValue: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue,
            realApprovalVersionValue: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue,
            realDesignTemplateMappingValue: this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode,
            masterData: { ...this.props.Login.masterData },
            realReportTypeValue: this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue,
            Login: this.props.Login,
            // selectedRecord: { ...this.props.Login.selectedRecord },
            inputData: {
                obj: convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo),
                selectedRecord: this.props.Login.selectedRecord && this.props.Login.selectedRecord || [],
                'dfrom': obj.fromDate,
                'dto': obj.toDate,
                'npreregno': "0",
                'nsampletypecode': (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode) || -1,
                'nregtypecode': parseInt(this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
                'nregsubtypecode': parseInt(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
                'ntransactionstatus': this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus ? String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) + ',' + String(transactionStatus.PARTIAL) : "-1",
                "napprovalconfigcode": this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
                "napprovalversioncode": this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) : null,
                'nneedsubsample': (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                'userinfo': this.props.Login.userInfo,
                // ALPD-4091 (16-05-2024) Changed ndesigntemplatemappingcode to realDesignTemplateMappingValue
                'ndesigntemplatemappingcode': (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
                'isAddPopup': true,
                'isPopup': true,
                'ncoareporttype': parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) || -1,
                // 'ncoareporttypecode': 1,//parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) || -1,
                'ncoareporttypecode': parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) || -1,
                // "nsectioncode" : this.props.Login.masterData.reportSectionCode ? this.props.Login.masterData.reportSectionCode : -1,
                "nsectioncode": -1,

                isneedsection: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
                screenName: this.props.intl.formatMessage({ id: "IDS_ADDSAMPLE" })


            },
            DynamicReportFilterTypeItem: this.state.DynamicReportFilterTypeItem,
            DynamicDefaultStructureItem: this.state.DynamicDefaultStructureItem,
            extractedColumnList: this.state.DynamicReportFilterTypeItem ? this.queryBuilderfillingColumns(this.state.DynamicReportFilterTypeItem) : []
        };
        const RemoveModalParam = {
            realFromDate: obj.fromDate,
            realToDate: obj.toDate,
            realSampleTypeValue: this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue,
            realRegTypeValue: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue,
            realRegSubTypeValue: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue,
            realFilterStatusValue: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue,
            realApprovalVersionValue: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue,
            realDesignTemplateMappingValue: this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode,
            masterData: { ...this.props.Login.masterData },
            realReportTypeValue: this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue,
            inputData: {
                obj: convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo),
                selectedRecord: this.props.Login.selectedRecord && this.props.Login.selectedRecord || [],
                'dfrom': obj.fromDate,
                'dto': obj.toDate,
                'npreregno': "0",
                'nsampletypecode': (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode) || -1,
                'nregtypecode': parseInt(this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
                'nregsubtypecode': parseInt(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
                'sregsubtypename': this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.sregsubtypename : "",
                'ntransactionstatus': this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus ? String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) : "-1",
                "napprovalconfigcode": this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
                "napprovalversioncode": this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) : null,
                'nneedsubsample': (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                'userinfo': this.props.Login.userInfo,
                // ALPD-4091 (16-05-2024) Changed ndesigntemplatemappingcode to realDesignTemplateMappingValue
                'ndesigntemplatemappingcode': (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
                'nneedremove': true,
                'ncoareporttypecode': parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) || -1,
                'isneedsection': parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
                'ncoaparentcode': this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 0 && this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode || -1,
                'ncoaparenttranscode': this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 0 && this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus,
                'allowAppendRemoveSamples': this.props.Login.settings && this.props.Login.settings[46] ? parseInt(this.props.Login.settings[46]) : transactionStatus.NO,
                ncontrolCode: deleteId,
                screenName: this.props.intl.formatMessage({ id: "IDS_REMOVESAMPLES" }),
                spatientid: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) === reportCOAType.PATIENTWISE ? this.props.Login.masterData.ReleasedSampleDetails && this.props.Login.masterData.ReleasedSampleDetails.length !== 0 ? this.props.Login.masterData.ReleasedSampleDetails[0].spatientid || -1 : -1 : -1,
                patientwise: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) === reportCOAType.PATIENTWISE ? true : false

            }
        };
        const EditModalParam = {
            realFromDate: obj.fromDate,
            realToDate: obj.toDate,
            realSampleTypeValue: this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue,
            realRegTypeValue: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue,
            realRegSubTypeValue: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue,
            realFilterStatusValue: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue,
            realApprovalVersionValue: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue,
            realDesignTemplateMappingValue: this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode,
            masterData: { ...this.props.Login.masterData },
            realReportTypeValue: this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue,

            inputData: {
                obj: convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo),
                selectedRecord: this.props.Login.selectedRecord && this.props.Login.selectedRecord || [],
                'dfrom': obj.fromDate,
                'dto': obj.toDate,
                'npreregno': "0",
                'nsampletypecode': (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode) || -1,
                'nregtypecode': parseInt(this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
                'nregsubtypecode': parseInt(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
                'sregsubtypename': this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.sregsubtypename : "",
                'ntransactionstatus': this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus ? String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) : "-1",
                "napprovalconfigcode": this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
                "napprovalversioncode": this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) : null,
                'nneedsubsample': (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                'userinfo': this.props.Login.userInfo,
                // ALPD-4091 (16-05-2024) Changed ndesigntemplatemappingcode to realDesignTemplateMappingValue
                'ndesigntemplatemappingcode': (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
                'nneededit': true,
                'isPopup': true,
                'ncoareporttypecode': parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) || -1,
                'isneedsection': parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
                'ncoaparentcode': this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 0 && this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode || -1,
                'ncoaparenttranscode': this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 0 && this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus,
                'allowAppendRemoveSamples': this.props.Login.settings && this.props.Login.settings[46] ? parseInt(this.props.Login.settings[46]) : transactionStatus.NO,
                ncontrolCode: editId,
                screenName: this.props.intl.formatMessage({ id: "IDS_EDITSAMPLES" }),
                nsectioncode: this.props.Login.masterData && this.props.Login.masterData.reportSectionCode || -1,
                spatientid: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) === reportCOAType.PATIENTWISE ? this.props.Login.masterData.ReleasedSampleDetails && this.props.Login.masterData.ReleasedSampleDetails.length !== 0 ? this.props.Login.masterData.ReleasedSampleDetails[0].spatientid || -1 : -1 : -1,
                patientwise: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) === reportCOAType.PATIENTWISE ? true : false,
                // nismultipleproject: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.nismultipleproject) || transactionStatus.NO,

            },
            DynamicReportFilterTypeItem: this.state.DynamicReportFilterTypeItem,
            DynamicDefaultStructureItem: this.state.DynamicDefaultStructureItem,
            extractedColumnList: this.state.DynamicReportFilterTypeItem ? this.queryBuilderfillingColumns(this.state.DynamicReportFilterTypeItem) : []
        };

        const jsonParam = {
            screenName: "IDS_RELEASE", operation: "update", primaryKeyName: "ncoaparentcode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: editId, selectedReleaseHistory: this.props.Login.masterData.selectedReleaseHistory
        };

        const ResultCorrectionParam = {
            realFromDate: obj.fromDate,
            realToDate: obj.toDate,
            realSampleTypeValue: this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue,
            realRegTypeValue: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue,
            realRegSubTypeValue: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue,
            realFilterStatusValue: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue,
            realApprovalVersionValue: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue,
            realDesignTemplateMappingValue: this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode,
            masterData: { ...this.props.Login.masterData },
            realReportTypeValue: this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue,

            inputData: {
                obj: convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo),
                selectedRecord: this.props.Login.selectedRecord && this.props.Login.selectedRecord || [],
                'dfrom': obj.fromDate,
                'dto': obj.toDate,
                'npreregno': "0",
                'nsampletypecode': (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode) || -1,
                'nregtypecode': parseInt(this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
                'nregsubtypecode': parseInt(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
                'ntransactionstatus': this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus ? String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) : "-1",
                "napprovalconfigcode": this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
                "napprovalversioncode": this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) : null,
                'nneedsubsample': (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                'userinfo': this.props.Login.userInfo,
                // ALPD-4091 (16-05-2024) Changed ndesigntemplatemappingcode to realDesignTemplateMappingValue
                'ndesigntemplatemappingcode': (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
                'nneedremove': true,
                'ncoareporttypecode': parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) || -1,
                'isneedsection': parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
                'ncoaparentcode': this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 0 && this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode || -1,
                ncontrolCode: ResultCorrectionId,
                screenName: this.props.intl.formatMessage({ id: "IDS_RESULTCORRECTION" })



            }
        };


        const reportSubFields = [{
            [designProperties.VALUE]: "susername",
            [designProperties.LABEL]: "IDS_USERNAME"
        },
        {
            [designProperties.VALUE]: "sgenerateddate",
            [designProperties.LABEL]: "IDS_GENERATEDDATE"
        },
        {
            [designProperties.VALUE]: "sversionno",
            [designProperties.LABEL]: "IDS_VERSIONNO"
        },
        {
            [designProperties.VALUE]: "sreporttemplatename",
            [designProperties.LABEL]: "IDS_REPORTTEMPLATE"
        }
        ];
        return (
            <>
                <div className="client-listing-wrap new-breadcrumb toolbar-top-wrap mtop-4 screen-height-window">
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    }
                    <div className='fixed-buttons'>
                        <Nav.Link    //ALPD-4878 Add filter name and filter details button,done by Dhanushya RI
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
                        {/* <Col md={`${!this.props.sidebarview ? '4' : "2"}`}>
                            <ListMaster
                                formatMessage={this.props.intl.formatMessage}
                                screenName={this.props.intl.formatMessage({ id: "IDS_RELEASE" })}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.ReleaseHistory}
                                getMasterDetail={(ReleaseSample) =>
                                    this.props.getReleasedDataDetails(

                                        {
                                            ...ReleaseMasterDataParam,
                                            ...ReleaseSample
                                        }
                                    )
                                }
                                selectedMaster={this.props.Login.masterData.selectedReleaseHistory}
                                primaryKeyField="ncoaparentcode"
                                mainField="sreportno"
                                firstField="susername"
                                secondField="sgenerateddate"
                                // secondField="stransdisplaystatus"
                                isIDSField="Yes"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={releaseId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={false}
                                openModal={() => this.props.getApprovedSample(ApprovedModalParam, releaseId)}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}
                                showFilterIcon={true}
                                showFilter={this.props.Login.showFilter}
                                callCloseFunction={true}
                                filterComponent={[
                                    {
                                        "Sample Filter": <ReleaseFilter
                                            SampleType={this.state.SampletypeList || []}
                                            SampleTypeValue={this.props.Login.masterData.SampleTypeValue || []}
                                            ReportType={this.state.ReporttypeList || []}
                                            ReportTypeValue={this.props.Login.masterData.ReportTypeValue || []}
                                            RegType={this.state.RegistrationTypeList || []}
                                            RegTypeValue={this.props.Login.masterData.RegTypeValue || []}
                                            RegSubType={this.state.RegistrationSubTypeList || []}
                                            RegSubTypeValue={this.props.Login.masterData.RegSubTypeValue || []}
                                            ApprovalVersion={this.state.ConfigVersionList || []}
                                            ApprovalVersionValue={this.props.Login.masterData.ApprovalVersionValue || []}
                                            DesignTemplateMapping={this.props.Login.masterData.DesignTemplateMapping}
                                            DesignTemplateMappingValue={this.props.Login.masterData.DesignTemplateMappingValue || {}}
                                            //   UserSection={this.state.UserSectionList || []}
                                            //   UserSectionValue={this.props.Login.masterData.UserSectionValue || []}
                                            //   Test={this.state.TestList || []}
                                            //  TestValue={this.props.Login.masterData.TestValue || []}
                                            FilterStatus={this.state.FilterStatusList || []}
                                            FilterStatusValue={this.props.Login.masterData.FilterStatusValue || []}
                                            fromDate={this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()}
                                            toDate={this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()}
                                            onFilterComboChange={this.onFilterComboChange}
                                            handleDateChange={this.handleDateChange}
                                            userInfo={this.props.Login.userInfo}
                                            onDesignTemplateChange={this.onDesignTemplateChange}
                                            DynamicDesignMapping={this.state.stateDynamicDesign || []}

                                        />
                                    }
                                ]}
                            />
                        </Col> */}
                        <Col md={12} className="parent-port-height">
                            <SplitterLayout
                                borderColor="#999"
                                primaryIndex={1}
                                percentage={true}
                                secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                primaryMinSize={30}
                                secondaryMinSize={20}
                            >
                                <TransactionListMasterJsonView
                                    // listMasterShowIcon={1}
                                    clickIconGroup={true}
                                    splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                    masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.ReleaseHistory || []}
                                    selectedMaster={this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 0 ? this.props.Login.masterData.selectedReleaseHistory : undefined}
                                    // selectedMaster={this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory !== undefined ? [this.props.Login.masterData.selectedReleaseHistory] : undefined}
                                    primaryKeyField="ncoaparentcode"
                                    filterColumnData={this.props.filterTransactionList}
                                    getMasterDetail={(ReleaseSample, status) =>
                                        this.props.getReleasedDataDetails(

                                            {
                                                ...ReleaseMasterDataParam,
                                                ...ReleaseSample
                                            }, status
                                        )}
                                    // getMasterDetail={this.props.getReleasedDataDetails}
                                    // inputParam={{
                                    // ...this.state.subSampleGetParam,
                                    // searchTestRef: this.searchTestRef,
                                    // searchSubSampleRef: this.searchSubSampleRef,
                                    // testskip: this.state.testskip,
                                    // subsampleskip: this.state.subsampleskip,
                                    // resultDataState: this.state.resultDataState,
                                    // activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 4 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 4 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
                                    // }}
                                    selectionList={this.props.Login.masterData && this.props.Login.masterData.transactionStatusSelectionList && this.props.Login.masterData.transactionStatusSelectionList.length > 0 ? this.props.Login.masterData.transactionStatusSelectionList : []}
                                    // hideQuickSearch={true}
                                    selectionColorField="scolorhexcode"
                                    mainField={"sreportno"}
                                    showStatusLink={true}
                                    showStatusName={true}
                                    statusFieldName="stransdisplaystatus"
                                    statusField="ntransactionstatus"
                                    selectedListName="selectedReleaseHistory"
                                    searchListName="searchedData"
                                    searchRef={this.searchRef}
                                    objectName="releaseno"
                                    listName="IDS_RELEASENO"
                                    selectionField="ntransactionstatus"
                                    selectionFieldName="stransdisplaystatus"
                                    showFilter={this.props.Login.showFilter}
                                    openFilter={this.openFilter}
                                    closeFilter={this.closeFilter}
                                    onFilterSubmit={this.onFilterSubmit}
                                    subFields={reportSubFields}
                                    moreField={[]}
                                    needMultiSelect={this.props.Login.settings && this.props.Login.settings[50] ? parseInt(this.props.Login.settings[50]) === transactionStatus.YES ? true : false : false}
                                    showStatusBlink={true}
                                    callCloseFunction={true}
                                    filterParam={filterParam}
                                    subFieldsLabel={true}
                                    handlePageChange={this.handleReportNoPageChange}
                                    skip={this.state.skip}
                                    take={this.state.take}
                                    childTabsKey={["selectedReleaseHistory", "releaseno", "ReleasedSampleDetails", "ReleasedSubSampleDetails", "ReleasedTestDetails"]}
                                    actionIcons={[
                                        {
                                            title: this.props.intl.formatMessage({ id: "IDS_EDITREPORTTEMPLATE" }),
                                            controlname: "faPencilAlt",
                                            objectName: "editReportTemplate",
                                            hidden: this.state.userRoleControlRights.indexOf(editReportTemplateId) === -1,
                                            onClick: this.editReportTemplate,
                                            inputData: {
                                                primaryKeyName: "ncoaparentcode",
                                                operation: "update",
                                                masterData: this.props.Login.masterData,
                                                userInfo: this.props.Login.userInfo
                                            },
                                        },
                                        {
                                            title: this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                            controlname: "faTrashAlt",
                                            objectName: "deleteSamples",
                                            hidden: this.state.userRoleControlRights.indexOf(deleteSampleId) === -1,
                                            onClick: this.ConfirmDelete,
                                            inputData: {
                                                primaryKeyName: "ncoaparentcode",
                                                operation: "delete",
                                                masterData: this.props.Login.masterData,
                                                userInfo: this.props.Login.userInfo,
                                                controlId: deleteSampleId
                                            },
                                        },
                                        {
                                            title: this.props.intl.formatMessage({ id: "IDS_RELEASECOMMENTS" }),
                                            controlname: "faComments",
                                            objectName: "createReleaseComment",
                                            hidden: this.state.userRoleControlRights.indexOf(releaseCommentId) === -1,
                                            onClick: this.ReleaseComments,
                                            inputData: {
                                                primaryKeyName: "ncoaparentcode",
                                                operation: "create",
                                                masterData: this.props.Login.masterData,
                                                userInfo: this.props.Login.userInfo,
                                                controlId: releaseCommentId
                                            }
                                        }
                                    ]}
                                    needFilter={true}
                                    commonActions={
                                        <ProductList className="d-flex product-category float-right icon-group-wrap">
                                            <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                hidden={this.state.userRoleControlRights.indexOf(releaseId) === -1}
                                                data-tip={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                // data-for="tooltip_list_wrap"
                                                onClick={() => this.getApprovedSample(ApprovedModalParam, releaseId)}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Button>
                                            <Button className="btn btn-circle outline-grey ml-2" variant="link"
                                                data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                                //   data-for="tooltip-common-wrap"
                                                onClick={this.reloadData} >
                                                <FontAwesomeIcon icon={faSync} style={{ "width": "0.6!important" }} />
                                            </Button>
                                        </ProductList>
                                    }
                                    filterComponent={[
                                        {
                                            "Sample Filter": <ReleaseFilter
                                                SampleType={this.state.SampletypeList || []}
                                                SampleTypeValue={this.props.Login.masterData.SampleTypeValue || []}
                                                ReportType={this.state.ReporttypeList || []}
                                                ReportTypeValue={this.props.Login.masterData.ReportTypeValue || []}
                                                RegType={this.state.RegistrationTypeList || []}
                                                RegTypeValue={this.props.Login.masterData.RegTypeValue || []}
                                                RegSubType={this.state.RegistrationSubTypeList || []}
                                                RegSubTypeValue={this.props.Login.masterData.RegSubTypeValue || []}
                                                ApprovalVersion={this.state.ConfigVersionList || []}
                                                ApprovalVersionValue={this.props.Login.masterData.ApprovalVersionValue || []}
                                                DesignTemplateMapping={this.props.Login.masterData.DesignTemplateMapping}
                                                DesignTemplateMappingValue={this.props.Login.masterData.DesignTemplateMappingValue || {}}
                                                //   UserSection={this.state.UserSectionList || []}
                                                //   UserSectionValue={this.props.Login.masterData.UserSectionValue || []}
                                                //   Test={this.state.TestList || []}
                                                //  TestValue={this.props.Login.masterData.TestValue || []}
                                                FilterStatus={this.state.FilterStatusList || []}
                                                FilterStatusValue={this.props.Login.masterData.FilterStatusValue || []}
                                                fromDate={this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()}
                                                toDate={this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()}
                                                onFilterComboChange={this.onFilterComboChange}
                                                handleDateChange={this.handleDateChange}
                                                userInfo={this.props.Login.userInfo}
                                                onDesignTemplateChange={this.onDesignTemplateChange}
                                                DynamicDesignMapping={this.state.stateDynamicDesign || []}

                                            />
                                        }
                                    ]}
                                />
                                {/* <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
                            <div className="sidebar-view-btn-block">
                                <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                                    {!this.props.sidebarview ?
                                        <i class="fa fa-less-than"></i> :
                                        <i class="fa fa-greater-than"></i>
                                    }
                                </div>
                            </div> */}
                                {/* {this.props.Login.masterData.ReleaseHistory && this.props.Login.masterData.ReleaseHistory.length > 0 && this.props.Login.masterData.selectedReleaseHistory && Object.values(this.props.Login.masterData.selectedReleaseHistory).length > 0 ? */}
                                {this.props.Login.masterData.ReleaseHistory && this.props.Login.masterData.ReleaseHistory.length > 0 && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 0 ?
                                    <ContentPanel className="panel-main-content">
                                        <Card className="border-0">
                                            <Card.Header>
                                                {/* <Card.Title className="product-title-main"> */}

                                                {/* {this.props.Login.masterData && this.props.Login.masterData.nversionno && this.props.Login.masterData.nversionno !== 0 ?
                                                    this.props.intl.formatMessage({ id: "IDS_VERSIONNUMBER" }) + " : " + this.props.Login.masterData.nversionno : ""} */}

                                                {/* {( this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.sreportno )
                                                    +  (this.props.Login.masterData.nversionno && this.props.Login.masterData.nversionno!==0 ?'-'+ this.props.Login.masterData.nversionno: "") } */}
                                                {/* </Card.Title> */}
                                                <Card.Subtitle>
                                                    {/* <div className="d-flex product-category">
                                                    <h2 className="product-title-sub flex-grow-1">
                                                        <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}> */}
                                                    {/* <i className={activeIconCSS}></i> */}
                                                    {/* {this.props.Login.masterData.selectedReleaseHistory.stransdisplaystatus}
                                                        </span> */}

                                                    {/* </h2> */}



                                                    <ProductList className="d-flex product-category float-right icon-group-wrap">



                                                        {this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nclinicaltyperequired === transactionStatus.YES &&
                                                            <Nav.Link

                                                                className="btn btn-circle outline-grey ml-2"
                                                                //   data-for="tooltip_list_wrap"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_PATIENTINFO" })} data-place="left"
                                                                hidden={this.state.userRoleControlRights.indexOf(patientinfoId) === -1}
                                                                onClick={() => this.patientInfo()}>
                                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                            </Nav.Link>
                                                        }

                                                        {/* <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_PREVIEWREPORT" })} data-place="left"
                                                            hidden={this.state.userRoleControlRights.indexOf(previewId) === -1}
                                                            onClick={() => this.previewReport(previewId)}

                                                        >
                                                            
                                                            <Preview />

                                                        </Nav.Link> */}
                                                        {/* <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.Login.genericLabel && this.props.Login.genericLabel["PreliminaryReport"] ? 
                                                                this.props.Login.genericLabel["PreliminaryReport"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode]
                                                                : this.props.intl.formatMessage({ id: "IDS_PRELIMINARYREPORT" })}
                                                            data-place="left"
                                                            // data-tip={this.props.intl.formatMessage({ id: "IDS_PRELIMINARYREPORT" })} data-place="left"
                                                            hidden={this.state.userRoleControlRights.indexOf(preliminaryId) === -1}
                                                            onClick={() => this.preliminaryReport(preliminaryId)}

                                                        >
                                                            <PreliminaryReport className="custom_icons" width="20" height="20" />

                                                        </Nav.Link> */}

                                                        {/* {((this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nprojectspecrequired === transactionStatus.YES) ||
                                                            (this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISEMULTIPLESAMPLE)) && */}
                                                        {
                                                            (this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.nisarnowiserelease
                                                                && this.props.Login.masterData.realReportTypeValue.nisarnowiserelease === transactionStatus.NO) &&
                                                            // ((this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nprojectspecrequired === transactionStatus.YES) ||
                                                            //     (this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISEMULTIPLESAMPLE) ||
                                                            //     (this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.PATIENTWISE) ||
                                                            //     (this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.MULTIPLESAMPLE)) &&
                                                            <Nav.Link
                                                                className="btn btn-circle outline-grey ml-2"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_ADDSAMPLE" })} data-place="left"
                                                                hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                //Modified by sonia on 11-06-2024 for JIRA ID:4122 Sample Count Validation
                                                                onClick={() => this.props.validationforAppendSamples(EditModalParam)}
                                                            >
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </Nav.Link>
                                                        }
                                                        {/* } */}
                                                        {/* {((this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nprojectspecrequired === transactionStatus.YES) ||
                                                            (this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISEMULTIPLESAMPLE)) && */}
                                                        {
                                                            (this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.nisarnowiserelease
                                                                && this.props.Login.masterData.realReportTypeValue.nisarnowiserelease === transactionStatus.NO) &&
                                                            // ((this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nprojectspecrequired === transactionStatus.YES) ||
                                                            //     (this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISEMULTIPLESAMPLE) ||
                                                            //     (this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.PATIENTWISE) ||
                                                            //     (this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.MULTIPLESAMPLE)) &&
                                                            <Nav.Link
                                                                className="btn btn-circle outline-grey ml-2"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_REMOVESAMPLES" })} data-place="left"
                                                                hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                onClick={() => this.props.getRemoveApprovedSample(RemoveModalParam)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </Nav.Link>
                                                        }
                                                        {/* } */}

                                                        {/* <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_GENERATEFILE" })} data-place="left"
                                                            //  data-for="tooltip-common-wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(downloadId) === -1}
                                                            onClick={() => {
                                                                this.props.Login.masterData.selectedReleaseHistory &&
                                                                    this.props.Login.masterData.selectedReleaseHistory.ntransactionstatus === transactionStatus.CORRECTION
                                                                    ? this.CorrectionComments(downloadId) : this.downloadReleasedFile(downloadId)
                                                            }}>
                                                            <Generate className="custom_icons" width="20" height="20" />
                                                        </Nav.Link> */}
                                                        {/* <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_GENERATEFILE" })} data-place="left"
                                                            //  data-for="tooltip-common-wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(downloadId) === -1}
                                                            onClick={() => { this.downloadReleasedValidation(downloadId) }}>
                                                            <Generate className="custom_icons" width="20" height="20" />
                                                        </Nav.Link> */}

                                                        {
                                                            // this.props.Login.masterData.realSampleTypeValue && (this.props.Login.masterData.realSampleTypeValue.nclinicaltyperequired === transactionStatus.YES || 
                                                            // this.props.Login.masterData.realSampleTypeValue.nsampletypecode === SampleType.PROJECTSAMPLETYPE || 
                                                            // this.props.Login.masterData.realSampleTypeValue.nsampletypecode === SampleType.PRODUCT) &&
                                                            // <Nav.Link
                                                            //     className="btn btn-circle outline-grey ml-2"
                                                            //     data-tip={this.props.intl.formatMessage({ id: "IDS_CORRECTION" })} data-place="left"
                                                            //     hidden={this.state.userRoleControlRights.indexOf(correctionId) === -1}
                                                            //     onClick={() => this.CorrectionStatus(correctionId)}
                                                            // >
                                                            //     <Correction className="custom_icons" width="20" height="20" />
                                                            // </Nav.Link>
                                                        }

                                                        {
                                                            // (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nclinicaltyperequired === transactionStatus.YES || 
                                                            // this.props.Login.masterData.realSampleTypeValue.nsampletypecode === SampleType.PROJECTSAMPLETYPE || 
                                                            // this.props.Login.masterData.realSampleTypeValue.nsampletypecode === SampleType.PRODUCT) &&
                                                            <Nav.Link
                                                                className="btn btn-circle outline-grey ml-2"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_RESULTCORRECTION" })} data-place="left"
                                                                hidden={this.state.userRoleControlRights.indexOf(ResultCorrectionId) === -1}
                                                                onClick={() => this.props.getResultCorrectionData(ResultCorrectionParam)}
                                                            >
                                                                <ResultCorrection className="custom_icons" width="20" height="20" />
                                                            </Nav.Link>
                                                        }

                                                        {/* <Nav.Link

                                                            className="btn btn-circle outline-grey mr-2"
                                                            //   data-for="tooltip_list_wrap"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_VIEWREPORT" })}
                                                            hidden={this.state.userRoleControlRights.indexOf(viewreportId) === -1}
                                                            onClick={() => this.viewReport()}>
                                                            <FontAwesomeIcon icon={faExpandArrowsAlt} />
                                                        </Nav.Link> */}
                                                        {/* {this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nportalrequired === transactionStatus.YES &&
                                                            <Nav.Link
                                                                className="btn btn-circle outline-grey ml-2"
                                                                //   data-for="tooltip_list_wrap"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_SENDTOPORTAL" })}
                                                                hidden={this.state.userRoleControlRights.indexOf(sendtoportalId) === -1}
                                                                onClick={() => this.sendToPortal(sendtoportalId)}>
                                                                <FontAwesomeIcon icon={faStore} />
                                                            </Nav.Link>
                                                        } */}

                                                        {this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE &&
                                                            this.props.Login.masterData.realSampleTypeValue.noutsourcerequired === transactionStatus.YES &&
                                                            <Nav.Link
                                                                className="btn btn-circle outline-grey ml-2"
                                                                //   data-for="tooltip_list_wrap"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_REPORTHISTORY" })} data-place="left"
                                                                hidden={this.state.userRoleControlRights.indexOf(reportHistoryId) === -1}
                                                                onClick={() => this.reportHistoryInfo()}>
                                                                <ReportHistory width='20px' height='20px' className='custon_icons' />
                                                            </Nav.Link>
                                                        }

                                                        {/* <Nav.Link
                                                                className="btn btn-circle outline-grey ml-2"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_RELEASEHISTORY" })} data-place="left"
                                                                hidden={this.state.userRoleControlRights.indexOf(releaseHistoryId) === -1}
                                                                onClick={() => this.reportHistory(releaseHistoryId)}
                                                          
                                                            >
                                                                <FontAwesomeIcon icon={faHistory} />                                                                                                                
                                                            </Nav.Link> */}

                                                        {/* <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_REGENERATEFILE" })} data-place="left"
                                                            //  data-for="tooltip-common-wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(regenerateId) === -1}
                                                            onClick={() => this.regenerateReleasedFile(regenerateId)}>
                                                            <ReGenerate className="custom_icons" width="20" height="20" />
                                                        </Nav.Link> */}

                                                        <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_RELEASEHISTORY" })} data-place="left"
                                                            hidden={this.state.userRoleControlRights.indexOf(releaseReportHistoryId) === -1}
                                                            onClick={() => this.releaseReportHistory(releaseReportHistoryId)}
                                                        >
                                                            {/* <Correction className="custom_icons" width="20" height="20" /> */}
                                                            <FontAwesomeIcon icon={faHistory} />
                                                        </Nav.Link>

                                                        {
                                                            // this.props.Login.masterData.realSampleTypeValue.nsampletypecode === SampleType.PROJECTSAMPLETYPE || 
                                                            //  this.props.Login.masterData.realSampleTypeValue.nsampletypecode === SampleType.PRODUCT ?
                                                            <Nav.Link
                                                                className="btn btn-circle outline-grey ml-2"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_REPORTCORRECTION" })} data-place="left"
                                                                //  data-for="tooltip-common-wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(editcommentsId) === -1}
                                                                onClick={() => this.reportcomments('IDS_REPORTCORRECTION')}>
                                                                <Comment className="custom_icons" width="20" height="20" />
                                                            </Nav.Link>
                                                            // : ""
                                                        }

                                                        {/* 
                                                        {this.props.Login.masterData && this.props.Login.masterData.SampleTypeValue 
                                                        && this.props.Login.masterData.SampleTypeValue.nsampletypecode === SampleType.PROJECTSAMPLETYPE
                                                        && this.props.Login.settings && (parseInt(this.props.Login.settings[29]) === transactionStatus.YES) &&  
                                                        */}
                                                        <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            //   data-for="tooltip_list_wrap"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_RELEASETESTATTACHMENT" })} data-place="left"
                                                            hidden={this.state.userRoleControlRights.indexOf(releaseTestAttachmentId) === -1}
                                                            onClick={() => this.releaseTestAttachmentData("IDS_RELEASETESTATTACHMENT")}>
                                                            {/* <FontAwesomeIcon icon={faFile} /> */}
                                                            <ReleaseTestAttachmentIcon width='20px' height='20px' className='custom_icons' />
                                                        </Nav.Link>
                                                        {/* } */}

                                                        {/* 
                                                        {this.props.Login.masterData && this.props.Login.masterData.SampleTypeValue 
                                                        && this.props.Login.masterData.SampleTypeValue.nsampletypecode === SampleType.PROJECTSAMPLETYPE
                                                        && this.props.Login.settings && (parseInt(this.props.Login.settings[29]) === transactionStatus.YES) &&  
                                                        */}
                                                        <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            //   data-for="tooltip_list_wrap"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_RELEASETESTCOMMENT" })} data-place="left"
                                                            hidden={this.state.userRoleControlRights.indexOf(releaseTestCommentId) === -1}
                                                            onClick={() => this.releaseTestAttachmentData("IDS_RELEASETESTCOMMENT")}>
                                                            {/* <FontAwesomeIcon icon={faComments} /> */}
                                                            <ReleaseTestCommentIcon width='20px' height='20px' className='custom_icons' />
                                                        </Nav.Link>
                                                        {/* } */}

                                                        {/* <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DOWNLOADFINALREPORT" })} data-place="left"
                                                            hidden={this.state.userRoleControlRights.indexOf(downloadReportId) === -1}
                                                            onClick={() => this.downloadHistory(downloadReportId)}
                                                        >
                                                            <DownloadCertificate />
                                                        </Nav.Link> */}

                                                        {/* <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id:"IDS_SYNC"})} data-place="left"
                                                            hidden={this.state.userRoleControlRights.indexOf(generateid) === -1}
                                                            onClick={() => this.generatereport(generateid)}
                                                           >   <FontAwesomeIcon icon={faSync} /> 
                                                             </Nav.Link>  */}

                                                        <CustomPopover
                                                            nav={true}
                                                            data={
                                                                <>
                                                                    <ListGroup.Item as="li" className="btn_list" hidden={this.state.userRoleControlRights.indexOf(previewId) === -1}>
                                                                        <Nav.Link
                                                                            className="add-txt-btn blue-text link_icons nav-link ml-2"
                                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_PREVIEWREPORT" })} data-place="left"
                                                                            onClick={() => this.previewReport(previewId)}>
                                                                            {/* <FontAwesomeIcon icon={faEye} /> */}
                                                                            <Preview /> {this.props.intl.formatMessage({ id: "IDS_PREVIEWREPORT" })}
                                                                        </Nav.Link>
                                                                    </ListGroup.Item>
                                                                    <ListGroup.Item as="li" className="btn_list" hidden={this.state.userRoleControlRights.indexOf(preliminaryId) === -1}>
                                                                        <Nav.Link
                                                                            className="add-txt-btn blue-text link_icons nav-link ml-2"
                                                                            data-tip={this.props.Login.genericLabel && this.props.Login.genericLabel["PreliminaryReport"] ?
                                                                                this.props.Login.genericLabel["PreliminaryReport"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode]
                                                                                : this.props.intl.formatMessage({ id: "IDS_PRELIMINARYREPORT" })}
                                                                            data-place="left"
                                                                            // data-tip={this.props.intl.formatMessage({ id: "IDS_PRELIMINARYREPORT" })} data-place="left"
                                                                            onClick={() => this.preliminaryReport(preliminaryId)}>
                                                                            <PreliminaryReport className="custom_icons" width="20" height="20" /> {this.props.Login.genericLabel && this.props.Login.genericLabel["PreliminaryReport"] ?
                                                                                this.props.Login.genericLabel["PreliminaryReport"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode]
                                                                                : this.props.intl.formatMessage({ id: "IDS_PRELIMINARYREPORT" })}
                                                                        </Nav.Link>
                                                                    </ListGroup.Item>
                                                                    <ListGroup.Item as="li" className="btn_list" hidden={this.state.userRoleControlRights.indexOf(downloadId) === -1}>
                                                                        <Nav.Link
                                                                            // className="btn btn-circle outline-grey ml-2"
                                                                            className="add-txt-btn blue-text link_icons nav-link ml-2"
                                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_GENERATEFILE" })}
                                                                            data-place="left"
                                                                            //  data-for="tooltip-common-wrap"
                                                                            onClick={() => { this.downloadReleasedValidation(downloadId) }}>
                                                                            <Generate className="custom_icons" width="20" height="20" /> {this.props.intl.formatMessage({ id: "IDS_GENERATEFILE" })}
                                                                        </Nav.Link>
                                                                    </ListGroup.Item>
                                                                    <ListGroup.Item as="li" className="btn_list" hidden={this.state.userRoleControlRights.indexOf(correctionId) === -1}>
                                                                        <Nav.Link
                                                                            className="add-txt-btn blue-text link_icons nav-link ml-2"
                                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_CORRECTION" })} data-place="left"
                                                                            onClick={() => this.CorrectionStatus(correctionId)}>
                                                                            <Correction className="custom_icons" width="20" height="20" /> {this.props.intl.formatMessage({ id: "IDS_CORRECTION" })}
                                                                        </Nav.Link>
                                                                    </ListGroup.Item>
                                                                    <ListGroup.Item as="li" className="btn_list" hidden={this.state.userRoleControlRights.indexOf(regenerateId) === -1}>
                                                                        <Nav.Link
                                                                            className="add-txt-btn blue-text link_icons nav-link ml-2"
                                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_REGENERATEFILE" })} data-place="left"
                                                                            //  data-for="tooltip-common-wrap"                                                                                    
                                                                            onClick={() => this.regenerateReleasedFile(regenerateId)}>
                                                                            <ReGenerate className="custom_icons" width="20" height="20" /> {this.props.intl.formatMessage({ id: "IDS_REGENERATEFILE" })}
                                                                        </Nav.Link>
                                                                    </ListGroup.Item>
                                                                    <ListGroup.Item as="li" className="btn_list" hidden={this.state.userRoleControlRights.indexOf(downloadReportId) === -1}>
                                                                        <Nav.Link
                                                                            className="add-txt-btn blue-text link_icons nav-link ml-2"
                                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DOWNLOADFINALREPORT" })} data-place="left"
                                                                            onClick={() => this.downloadHistory(downloadReportId)}>
                                                                            <DownloadCertificate /> {this.props.intl.formatMessage({ id: "IDS_DOWNLOADFINALREPORT" })}
                                                                            {/* <FontAwesomeIcon icon={faDownload} /> */}
                                                                        </Nav.Link>
                                                                    </ListGroup.Item>
                                                                    <ListGroup.Item as="li" className="btn_list" hidden={this.state.userRoleControlRights.indexOf(generateid) === -1}>
                                                                        <Nav.Link
                                                                            className="add-txt-btn blue-text link_icons nav-link ml-2"
                                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_PORTALSYNC" })} data-place="left"
                                                                            onClick={() => this.generatereport(generateid)}>
                                                                            <FontAwesomeIcon icon={faSync} className='mr-2' /> {this.props.intl.formatMessage({ id: "IDS_PORTALSYNC" })}
                                                                        </Nav.Link>
                                                                    </ListGroup.Item>
                                                                    {this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nportalrequired === transactionStatus.YES &&

                                                                        <ListGroup.Item as="li" className="btn_list " hidden={this.state.userRoleControlRights.indexOf(sendtoportalId) === -1}>
                                                                            <Nav.Link
                                                                                className="add-txt-btn blue-text link_icons nav-link ml-2"
                                                                                //   data-for="tooltip_list_wrap"
                                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_SENDTOPORTAL" })}
                                                                                onClick={() => this.sendToPortal(sendtoportalId)}>
                                                                                <FontAwesomeIcon icon={faStore} /> {this.props.intl.formatMessage({ id: "IDS_SENDTOPORTAL" })}
                                                                            </Nav.Link>
                                                                        </ListGroup.Item>
                                                                    }
                                                                </>
                                                            }
                                                            Button={false}
                                                            hideIcon={true}
                                                            btnClasses="btn-circle btn_grey ml-2"
                                                            textKey="value"
                                                            icon={faChevronCircleDown}
                                                            // toolTip={this.props.intl.formatMessage({ id: "IDS_CONFIGURE" })}
                                                            dynamicButton={(value) => this.actionMethod(value)}
                                                            userRoleControlRights={this.state.userRoleControlRights}
                                                        />

                                                    </ProductList>
                                                    {/* </div> */}
                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body className="form-static-wrap">
                                                {/* <Row>
                                                <Col md="4">
                                                    <FormGroup>
                                                        <FormLabel>{this.props.intl.formatMessage({ id: "IDS_REPORTNO" })}</FormLabel>
                                                        <ReadOnlyText>{this.props.Login.masterData.selectedReleaseHistory &&
                                                            this.props.Login.masterData.selectedReleaseHistory.sreportno}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>


                                            </Row> */}
                                                <DataGridWithMultipleGrid
                                                    needSubSample={this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample || false}
                                                    data={this.state.data}
                                                    dataResult={process(this.props.Login.masterData.searchedData1 && this.props.Login.masterData.searchedData1 || this.props.Login.masterData.ReleasedSampleDetails && this.props.Login.masterData.ReleasedSampleDetails || [], this.state.dataState)}
                                                    dataState={this.state.dataState}
                                                    dataStateChange={this.dataStateChange}
                                                    expandNextData={this.expandNextData}
                                                    checkFunction={this.checkFunction}
                                                    checkFunction1={this.checkFunction1}
                                                    expandFunc={this.expandFunc}
                                                    //expandData={this.expandData}
                                                    childDataResult={this.state.childDataResult}
                                                    subChildDataResult={this.state.subChildDataResult}
                                                    extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem) || []}
                                                    subChildColumnList={this.gridfillingColumn(this.state.DynamicTestGridItem) || []}
                                                    expandField="expanded"
                                                    reloadData={this.reloadData}
                                                    controlMap={this.state.controlMap}
                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                    inputParam={this.props.Login.inputParam}
                                                    userInfo={this.props.Login.userInfo}
                                                    pageable={true}
                                                    scrollable={'scrollable'}
                                                    gridHeight={'525px'}
                                                    gridTop={'10px'}
                                                    //   isActionRequired={true}
                                                    //   isToolBarRequired={true}
                                                    //  isExpandRequired={true}
                                                    //   isDownloadRequired={true}
                                                    isCheckBoxRequired={false}  // ALPD-5247    Changed from true to false by Vishakh due to checkbox hide
                                                    isCollapseRequired={true}
                                                    selectedId={this.props.Login.selectedId}
                                                    hasChild={true}
                                                    hasSubChild={true}
                                                    childList={
                                                        this.props.Login.masterData.ReleasedSubSampleDetails
                                                    }
                                                    childColumnList={this.gridfillingColumn(this.state.DynamicSubSampleGridItem) || []}
                                                    childMappingField={"npreregno"}
                                                    subChildMappingField={"ntransactionsamplecode"}
                                                    // subChildMappingField={this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample ? "ntransactionsamplecode" : "npreregno"}
                                                    subChildList={
                                                        this.props.Login.masterData.ReleasedTestDetails
                                                    }
                                                    selectedsubcild={this.props.Login.selectedsubcild}
                                                    methodUrl={"Release"}
                                                    headerSelectionChange={this.headerSelectionChange}
                                                    childHeaderSelectionChange={this.childHeaderSelectionChange}
                                                    childSelectionChange={this.childSelectionChange}
                                                    subChildSelectionChange={this.subChildSelectionChange}
                                                    subChildHeaderSelectionChange={this.subChildHeaderSelectionChange}
                                                    selectionChange={this.selectionChange}
                                                    releaseRecord={this.onSaveModalClick}
                                                // viewDownloadFile={this.viewDownloadFile}
                                                />
                                            </Card.Body>
                                        </Card>
                                    </ContentPanel>
                                    : ""
                                }
                            </SplitterLayout>
                        </Col>
                    </Row>

                </div >
                {
                    this.state.showReport ?
                        <DocViewer file={filePath}
                            showReport={this.state.showReport}
                            closeModal={this.closeDocModal}
                            type={"pdf"}>
                        </DocViewer>
                        : ""
                }
                {
                    this.props.Login.openModal &&
                    <SlideOutModal
                        show={this.props.Login.openModal || this.state.openModal}
                        size={(this.props.Login.loadEsign || this.props.Login.loadEsignStateHandle) ? "lg" : "xl"}
                        closeModal={this.closeModal}
                        inputParam={this.props.Login.inputParam}
                        mandatoryFields={
                            this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_CORRECTIONCOMMENTS" })
                                ? mandatoryFields : this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_RELEASECOMMENTS" }) ? mandatoryCommentsFields : ""}
                        screenName={this.props.Login.loadEsignStateHandle ? this.props.intl.formatMessage({ id: "IDS_ESIGN" }) : this.props.Login.isPatientDetails ?
                            this.props.intl.formatMessage({ id: "IDS_PATIENTINFO" })
                            : this.props.Login.isPatientReports ? this.props.intl.formatMessage({ id: "IDS_REPORTHISTORY" })
                                : this.props.Login.isReleaseTestAttachment ? this.props.intl.formatMessage({ id: "IDS_RELEASETESTATTACHMENT" })
                                    : this.props.Login.isReleaseTestComment ? this.props.intl.formatMessage({ id: "IDS_RELEASETESTCOMMENT" })
                                        : this.props.Login.openModalTitle == 'IDS_VERSIONHISTORY' ? this.props.intl.formatMessage({ id: "IDS_RELEASEHISTORY" })
                                            : this.props.Login.screenName}
                        onSaveClick={
                            this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_CORRECTIONCOMMENTS" }) ? this.downloadReleasedFile :
                                this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_RELEASECOMMENTS" }) ? this.onSaveReleaseComments :
                                    (this.props.Login.isAddReleaseTestAttachment || this.props.Login.isAddReleaseTestComment || this.props.Login.loadEsignStateHandle ||
                                        this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_ADDSAMPLE" })) ? this.onMandatoryCheck :
                                        this.onSaveModalClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        //noSave={this.props.Login.openModalTitle=='versionhistory' ? true : false}
                        hideSave={this.props.Login.screenName === "IDS_REPORTINFOCOMMENT" || this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_RELEASEHISTORY" }) ||
                            this.props.Login.screenName === "IDS_REPORTINFOCOMMENTS" ? true : this.props.Login.FilterQueryBuilder
                            ? true : this.props.Login.openModalTitle == 'IDS_VERSIONHISTORY'
                                ? true : ((this.props.Login.isReleaseTestAttachment || this.props.Login.isReleaseTestComment)
                                    && !this.props.Login.loadEsignStateHandle) ? true
                                    : this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_RELEASECOMMENTS" })
                                        && this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory
                                        && this.props.Login.masterData.selectedReleaseHistory.length === 1
                                        && this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus === transactionStatus.RELEASED ? true
                                        : this.props.Login.hideSave}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> :
                            this.props.Login.loadEsignStateHandle ?
                                <EsignStateHandle
                                    operation={this.props.Login.operation}
                                    inputParam={this.props.Login.inputParam}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    childDataChange={this.childDataChange}
                                />
                                : this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_RELEASEHISTORY" }) ?
                                    <ReleaseReportHistory
                                        operation={this.props.Login.operation}
                                        // designData={this.props.Login.designData || {}}
                                        inputParam={this.props.Login.inputParam}
                                        dataResult={this.props.Login.masterData}
                                        //    this.props.Login.dataResult || [] :
                                        //   this.props.Login.dataResult || {}}
                                        //onChangeToggle={this.onChangeToggle}
                                        settings={this.props.Login.settings}
                                        viewDownloadFile={this.viewDownloadFile}
                                        userInfo={this.props.Login.userInfo}
                                        controlMap={this.state.controlMap}
                                        userRoleControlRights={this.state.userRoleControlRights} />
                                    : this.props.Login.screenName === "IDS_PATIENTSEARCH" ?
                                        <FilterQueryBuilder
                                            fields={this.props.Login.fields || {}}
                                            onChange={this.onChangeAwesomeQueryBuilder}
                                            tree={this.props.Login.awesomeTree}
                                            config={this.props.Login.awesomeConfig}
                                            skip={this.props.Login.kendoSkip}
                                            take={this.props.Login.kendoTake}
                                            handlePageChange={this.handlePageChange}
                                            gridColumns={this.props.Login.gridColumns || []}
                                            filterData={this.props.Login.lstPatient}
                                            onRowClick={this.handleKendoRowClick}
                                            handleExecuteClick={this.handleExecuteClick}
                                            userInfo={this.props.Login.userInfo}
                                        />
                                        : this.props.Login.openModalTitle == 'IDS_VERSIONHISTORY' ?
                                            <VersionHistGrid
                                                versionHistory={this.props.Login.masterData.versionHistory}
                                                isExportExcelRequired={false}
                                                dataState={this.state.versionHistoryDataState}
                                                dataResult={process(this.props.Login.masterData && this.props.Login.masterData.versionHistory || [], this.state.versionHistoryDataState)}
                                                dataStateChange={this.versionHistoryDataStateChange}
                                                userInfo={this.props.Login.userInfo}
                                                controlMap={this.state.controlMap}
                                                userRoleControlRights={this.state.userRoleControlRights}
                                                viewDownloadFile={this.viewDownloadFile}
                                            />
                                            : this.props.Login.isPatientDetails ?
                                                this.props.Login.masterData.ReleasedSampleDetails && this.props.Login.masterData.ReleasedSampleDetails.length === 1 ?
                                                    <SampleInfoView
                                                        data={(this.props.Login.masterData.ReleasedSampleDetails && this.props.Login.masterData.ReleasedSampleDetails.length > 0) ?
                                                            this.props.Login.masterData.ReleasedSampleDetails[this.props.Login.masterData.ReleasedSampleDetails.length - 1] : {}}
                                                        SingleItem={this.props.Login.masterData.ReleasedSampleDetails && this.props.Login.masterData.ReleasedSampleDetails ?
                                                            this.state.SingleItem : []}
                                                        screenName="IDS_SAMPLEINFO"
                                                        userInfo={this.props.Login.userInfo}
                                                    />
                                                    :
                                                    <SampleGridTab
                                                        userInfo={this.props.Login.masterData.userInfo || {}}
                                                        GridData={this.props.Login.masterData.ReleasedSampleDetails || []}
                                                        masterData={this.props.Login.masterData}
                                                        inputParam={this.props.Login.inputParam}
                                                        dataState={this.state.sampleGridDataState}
                                                        dataStateChange={this.sampleGridDataStateChange}
                                                        extractedColumnList={this.gridfillingColumn(this.state.SingleItem) || []}
                                                        detailedFieldList={[]}
                                                        primaryKeyField={"npreregno"}
                                                        expandField="expanded"
                                                        screenName="IDS_PATIENTINFO"
                                                    />
                                                : this.props.Login.isPatientReports && this.props.Login.openModal ?
                                                    <DataGrid
                                                        // key="nreleaseoutsourceattachcode"
                                                        primaryKeyField="nreleaseoutsourceattachcode"
                                                        data={this.props.Login.masterData.PatientReports || []}
                                                        dataResult={process(this.props.Login.masterData.PatientReports && this.props.Login.masterData.PatientReports || [], this.state.outsourceFileDataState)}
                                                        dataState={this.state.outsourceFileDataState}
                                                        isExportExcelRequired={false}
                                                        controlMap={this.state.controlMap}
                                                        userRoleControlRights={this.state.userRoleControlRights}
                                                        extractedColumnList={this.fieldsForReleasedReportGrid}
                                                        selectedId={this.props.Login.selectedId}
                                                        pageable={true}
                                                        dataStateChange={this.outsourceFileDataStateChange}
                                                        scrollable={'scrollable'}
                                                        gridHeight={'630px'}
                                                        isActionRequired={true}
                                                        methodUrl={'PatientReports'}
                                                        viewDownloadFile={this.viewSelectedReport}
                                                    >
                                                    </DataGrid>
                                                    : this.props.Login.isReleaseTestAttachment && this.props.Login.openModal ?
                                                        <ReleaseTestAttachment
                                                            ReleaseTestAttachmentDetails={this.props.Login.masterData.ReleaseTestAttachmentDetails || []}
                                                            controlMap={this.state.controlMap}
                                                            userRoleControlRights={this.state.userRoleControlRights}
                                                            storeUserRoleControlRights={this.props.Login.userRoleControlRights}
                                                            userInfo={this.props.Login.userInfo}
                                                            methodUrl={'ReleaseTestAttachment'}
                                                            settings={this.props.Login.settings}
                                                            isAddRequired={true}
                                                            isRefreshRequired={false}
                                                            isImportRequired={false}
                                                            isDownloadPDFRequired={false}
                                                            isDownloadExcelRequired={false}
                                                            inputParam={this.props.Login.inputParam}
                                                            screenName={"IDS_RELEASETESTATTACHMENT"}
                                                            maxSize={20}
                                                            masterData={this.props.Login.masterData}
                                                            isDataGrid={this.props.Login.isDataGrid}
                                                            selectedRecord={this.state.selectedRecord}
                                                            operation={this.props.Login.operation}
                                                            childDataChange={this.childDataChange}
                                                            deleteRecord={this.deleteReleaseTestAttachment}
                                                            dataState={this.state.testAttachmentDataState}
                                                            dataStateChange={this.testAttachmentDataStateChange}
                                                        />
                                                        : this.props.Login.isAddReleaseTestAttachment ?
                                                            <AddReleaseTestAttachment
                                                                ReleaseTestAttachmentDetails={this.props.Login.masterData.ReleaseTestAttachmentDetails || []}
                                                                controlMap={this.state.controlMap}
                                                                userRoleControlRights={this.state.userRoleControlRights}
                                                                storeUserRoleControlRights={this.props.Login.userRoleControlRights}
                                                                userInfo={this.props.Login.userInfo}
                                                                methodUrl={'ReleaseTestAttachment'}
                                                                settings={this.props.Login.settings}
                                                                isAddRequired={true}
                                                                isRefreshRequired={false}
                                                                isImportRequired={false}
                                                                isDownloadPDFRequired={false}
                                                                isDownloadExcelRequired={false}
                                                                inputParam={this.props.Login.inputParam}
                                                                screenName={"ReleaseTestAttachment"}
                                                                maxSize={20}
                                                                masterData={this.props.Login.masterData}
                                                                isDataGrid={this.props.Login.isDataGrid}
                                                                selectedRecord={this.state.selectedRecord}
                                                                operation={this.props.Login.operation}
                                                                childDataChange={this.childDataChange}
                                                            />
                                                            : this.props.Login.isReleaseTestComment && this.props.Login.openModal ?
                                                                <ReleaseTestComment
                                                                    ReleaseTestCommentDetails={this.props.Login.masterData.ReleaseTestCommentDetails || []}
                                                                    controlMap={this.state.controlMap}
                                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                                    storeUserRoleControlRights={this.props.Login.userRoleControlRights}
                                                                    userInfo={this.props.Login.userInfo}
                                                                    methodUrl={'ReleaseTestComment'}
                                                                    settings={this.props.Login.settings}
                                                                    isAddRequired={true}
                                                                    isRefreshRequired={false}
                                                                    isImportRequired={false}
                                                                    isDownloadPDFRequired={false}
                                                                    isDownloadExcelRequired={false}
                                                                    inputParam={this.props.Login.inputParam}
                                                                    screenName={"IDS_RELEASETESTCOMMENT"}
                                                                    maxSize={20}
                                                                    masterData={this.props.Login.masterData}
                                                                    CommentSubType={this.props.Login.masterData.CommentSubType}
                                                                    SampleTestComments={this.props.Login.masterData.SampleTestComments} //ALPD-4948 Passed sampletestcomments to the releasetestcomments
                                                                    deleteRecord={this.deleteReleaseTestComment}
                                                                    dataState={this.state.testCommentDataState}
                                                                    dataStateChange={this.testCommentDataStateChange}
                                                                />
                                                                : this.props.Login.isAddReleaseTestComment ?
                                                                    <AddReleaseTestComment
                                                                        ReleaseTestCommentDetails={this.props.Login.masterData.ReleaseTestCommentDetails || []}
                                                                        controlMap={this.state.controlMap}
                                                                        userRoleControlRights={this.state.userRoleControlRights}
                                                                        storeUserRoleControlRights={this.props.Login.userRoleControlRights}
                                                                        userInfo={this.props.Login.userInfo}
                                                                        methodUrl={'ReleaseTestComment'}
                                                                        settings={this.props.Login.settings}
                                                                        isAddRequired={true}
                                                                        isRefreshRequired={false}
                                                                        isImportRequired={false}
                                                                        isDownloadPDFRequired={false}
                                                                        isDownloadExcelRequired={false}
                                                                        inputParam={this.props.Login.inputParam}
                                                                        screenName={"ReleaseTestComment"}
                                                                        maxSize={20}
                                                                        masterData={this.props.Login.masterData}
                                                                        CommentSubType={this.props.Login.masterData.CommentSubType}
                                                                        selectedRecord={this.state.selectedRecord}
                                                                        childDataChange={this.childDataChange}
                                                                        operation={this.props.Login.operation}
                                                                        SampleTestComments={this.props.Login.SampleTestComments}
                                                                    />
                                                                    : this.props.Login.screenName === "IDS_REPORTINFOCOMMENT" && this.props.Login.openModal ?
                                                                        <DataGrid
                                                                            key="reportinforeleasecode"
                                                                            primaryKeyField="nreportinforeleasecode"
                                                                            data={this.props.Login.masterData.reportinforelease || []}
                                                                            dataResult={process(this.props.Login.masterData.reportinforelease && this.props.Login.masterData.reportinforelease || [], this.state.reportInfoDataState)}
                                                                            dataState={this.state.reportInfoDataState}
                                                                            //dataResult={this.props.selectedWorklist || []}
                                                                            //expandField="expanded"
                                                                            isExportExcelRequired={false}
                                                                            //dataStateChange={(event) => this.setState({ sampleDataState: event.dataState })}
                                                                            controlMap={this.state.controlMap}
                                                                            userRoleControlRights={this.state.userRoleControlRights}
                                                                            extractedColumnList={this.feildsForGrid}
                                                                            detailedFieldList={this.props.detailedFieldList}
                                                                            editParam={editReportParam}
                                                                            selectedId={this.props.Login.selectedId}
                                                                            fetchRecord={this.props.fetchReportInfoReleaseById}
                                                                            pageable={true}
                                                                            dataStateChange={this.reportInfoDataChange}
                                                                            scrollable={'scrollable'}
                                                                            gridHeight={'630px'}
                                                                            isActionRequired={true}
                                                                            methodUrl={'ReportComment'}
                                                                        // actionIcons={[{
                                                                        //     title: this.props.intl.formatMessage({ id: "IDS_PREVIOUSRESULTVIEW" }),
                                                                        //     controlname: "faEye",
                                                                        //     objectName: "ExceptionLogs",
                                                                        //     hidden: -1 === -1,
                                                                        //    onClick: (viewSample) => this.props.viewSample(viewSample)
                                                                        // }]}
                                                                        >
                                                                        </DataGrid>
                                                                        : this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_CORRECTIONCOMMENTS" }) ?
                                                                            <Row>
                                                                                <Col md={12}>
                                                                                    <FormInput
                                                                                        label={this.props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                                                                                        name="sreportcomments"
                                                                                        type="text"
                                                                                        onChange={(event) => this.onInputOnChange(event)}
                                                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                                                                                        value={this.state.selectedRecord["sreportcomments"] ? this.state.selectedRecord["sreportcomments"] : ""}
                                                                                        isMandatory={true}
                                                                                        required={true}
                                                                                        maxLength={255}
                                                                                    />
                                                                                </Col>
                                                                            </Row>
                                                                            : this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_RELEASECOMMENTS" }) ?
                                                                                <Row>
                                                                                    <Col md={12}>
                                                                                        <FormTextarea
                                                                                            label={this.props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                                                                                            name="sreleasecomments"
                                                                                            type="text"
                                                                                            onChange={(event) => this.onInputOnChange(event)}
                                                                                            placeholder={this.props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                                                                                            value={this.state.selectedRecord["sreleasecomments"] ? this.state.selectedRecord["sreleasecomments"] : ""}
                                                                                            isMandatory={true}
                                                                                            required={true}
                                                                                            maxLength={500}
                                                                                            readOnly={this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory
                                                                                                && this.props.Login.masterData.selectedReleaseHistory.length === 1
                                                                                                && this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus === transactionStatus.RELEASED ? true : false}
                                                                                        />
                                                                                    </Col>
                                                                                </Row>
                                                                                :
                                                                                this.props.Login.FilterQueryBuilder ?
                                                                                    <>
                                                                                        <Row>
                                                                                            <FilterQueryBuilder
                                                                                                fields={this.props.Login.fields || {}}
                                                                                                onChange={this.onComboChangeAwesomeQueryBuilder}
                                                                                                tree={this.props.Login.awesomeTree}
                                                                                                config={this.props.Login.awesomeConfig}
                                                                                                skip={this.props.Login.kendoSkip}
                                                                                                take={this.props.Login.kendoTake}
                                                                                                handlePageChange={this.handlePageChange}
                                                                                                gridColumns={[]}
                                                                                                filterData={this.props.Login.lstPatient || []}
                                                                                                //onRowClick={this.handleKendoRowClick}
                                                                                                //handleExecuteClick={this.handleExecuteClick}
                                                                                                userInfo={this.props.Login.userInfo}
                                                                                                static={true}
                                                                                            />

                                                                                            <Col md={3}>
                                                                                                <Button className="btn-user btn-primary-blue" onClick={() => this.handleExecuteClicks(false)}>
                                                                                                    {/* <FontAwesomeIcon icon={faCalculator} /> { } */}
                                                                                                    <FormattedMessage id='IDS_EXECUTE' defaultMessage='Execute' />
                                                                                                </Button>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </>
                                                                                    :
                                                                                    <>


                                                                                        {
                                                                                            (
                                                                                                this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_CORRECTION" }) && this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_CORRECTIONCOMMENTS" }) &&
                                                                                                this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_REGENERATEFILE" }) && this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_GENERATEFILE" }) &&
                                                                                                this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_PREVIEWREPORT" })) &&
                                                                                            // //  this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISEMULTIPLESAMPLE ||
                                                                                            // //  (this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.PROJECTWISE) &&
                                                                                            // this.props.Login.masterData.realReportTypeValue
                                                                                            // && (this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISE ||
                                                                                            //     this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISEMULTIPLESAMPLE || this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.PROJECTWISE) &&
                                                                                            // //this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode === SampleType.PROJECTSAMPLETYPE &&
                                                                                            this.props.Login.isDeletePopup !== true &&
                                                                                            //this.props.Login.isComboCheck !== true &&
                                                                                            //this.props.Login.isEditPopup === true &&
                                                                                            this.props.Login.screenName !== "IDS_REPORTINFOCOMMENTS" &&
                                                                                            this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_RELEASEHISTORY" }) &&
                                                                                            this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE &&
                                                                                            this.props.Login.screenName !== "IDS_ADDRELEASETESTATTACHMENT" &&
                                                                                            // this.state.DynamicReportFilterTypeItem && this.state.DynamicReportFilterTypeItem.length>0 &&
                                                                                            <>
                                                                                                <Row>
                                                                                                    <Col md={3} className='pb-4'>
                                                                                                        <Button className="btn-user btn-primary-blue" onClick={() => this.openFilterQuery()}>
                                                                                                            <FontAwesomeIcon icon={faSearch} /> { }
                                                                                                            {/* <FormattedMessage id='IDS_EXECUTE' defaultMessage='Execute' /> */}
                                                                                                        </Button>
                                                                                                        {!this.props.Login.ismandatory &&
                                                                                                            <Button className="btn-user btn-primary-blue" onClick={() => this.handleExecuteClicks(true)}>
                                                                                                                <FontAwesomeIcon icon={faTimes} /> { }
                                                                                                                <FormattedMessage id='IDS_CLEARFILTER' defaultMessage='Clear Filter' />
                                                                                                            </Button>
                                                                                                        }
                                                                                                    </Col>

                                                                                                    <Col md={3} className='pb-4'>
                                                                                                        {(this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_CORRECTION" }) && this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_CORRECTIONCOMMENTS" }) &&
                                                                                                            this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_REGENERATEFILE" }) && this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_GENERATEFILE" }) &&
                                                                                                            this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_PREVIEWREPORT" })) &&
                                                                                                            this.props.Login.masterData.realReportTypeValue && this.props.Login.screenName !== "IDS_ADDRELEASETESTATTACHMENT" &&
                                                                                                            (this.props.Login.masterData.realReportTypeValue.isneedsection === transactionStatus.YES
                                                                                                                //  || this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISE ||
                                                                                                                //   this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISEMULTIPLESAMPLE
                                                                                                            ) &&
                                                                                                            this.props.Login.isDeletePopup !== true && this.props.Login.isEditPopup !== true &&
                                                                                                            this.props.Login.isComboCheck !== true &&
                                                                                                            <FormSelectSearch
                                                                                                                name={"nsectioncode"}
                                                                                                                formLabel={this.props.intl.formatMessage({ id: "IDS_SECTION" })}
                                                                                                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                                                                options={this.props.Login.sectionList}
                                                                                                                value={this.props.Login.selectedRecord ? this.props.Login.selectedRecord["nsectioncode"] !== undefined ? this.props.Login.selectedRecord["nsectioncode"] : "" : ""}
                                                                                                                defaultValue={this.props.Login.selectedRecord ? this.props.Login.selectedRecord["nsectioncode"] : ""}
                                                                                                                isMandatory={true}
                                                                                                                isMulti={false}
                                                                                                                isSearchable={true}
                                                                                                                // isDisabled={this.props.Login.isEditPopup === true ? true : false}
                                                                                                                closeMenuOnSelect={true}
                                                                                                                alphabeticalSort={true}
                                                                                                                onChange={(event) => this.onComboChange(event, 'nsectioncode', 1)}
                                                                                                            />
                                                                                                        }
                                                                                                    </Col>

                                                                                                    <Col md={3} className='pb-4'>
                                                                                                        {this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_EDITSAMPLES" }) &&
                                                                                                            this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_REMOVESAMPLES" }) && 	// ALPD-4053 (15-05-2024) Added this condition for issue in delete sample popup
                                                                                                            this.props.Login.isEditPopup !== true && this.props.Login.screenName !== "IDS_ADDRELEASETESTATTACHMENT" &&
                                                                                                            <FormSelectSearch
                                                                                                                name={"nreporttemplatecode"}
                                                                                                                formLabel={this.props.intl.formatMessage({ id: "IDS_REPORTTEMPLATE" })}
                                                                                                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                                                                options={this.props.Login.masterData.reportTemplateList || []}
                                                                                                                value={this.state.selectedRecord["nreporttemplatecode"] || ""}
                                                                                                                isMandatory={true}
                                                                                                                isMulti={false}
                                                                                                                isClearable={false}
                                                                                                                isSearchable={true}
                                                                                                                // isDisabled={props.operation === "update" && props.reportVersionStatus === transactionStatus.APPROVED}
                                                                                                                closeMenuOnSelect={true}
                                                                                                                onChange={(event) => this.onComboChange(event, "nreporttemplatecode")}
                                                                                                            />
                                                                                                        }
                                                                                                    </Col>
                                                                                                    <Col md={3} className='pb-4'></Col>
                                                                                                    <Col md={3} className='pb-4'>
                                                                                                        {this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_EDITSAMPLES" }) &&
                                                                                                            this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_REMOVESAMPLES" }) &&	// ALPD-4053 (15-05-2024) Added this condition for issue in delete sample popup
                                                                                                            (this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.nneedreleaseformattoggle
                                                                                                                && this.props.Login.masterData.realReportTypeValue.nneedreleaseformattoggle === transactionStatus.YES) && this.props.Login.screenName !== "IDS_ADDRELEASETESTATTACHMENT" &&
                                                                                                            <CustomSwitch
                                                                                                                name={'nisarnowiserelease'}
                                                                                                                type="switch"
                                                                                                                label={(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.nisarnowiserelease
                                                                                                                    && this.props.Login.masterData.realReportTypeValue.nisarnowiserelease === transactionStatus.YES) ? this.props.intl.formatMessage({ id: "IDS_ENABLEFORMULTISAMPLERELEASE" })
                                                                                                                    : this.props.intl.formatMessage({ id: "IDS_ENABLEFORSINGLESAMPLERELEASE" })}
                                                                                                                placeholder={(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.nisarnowiserelease
                                                                                                                    && this.props.Login.masterData.realReportTypeValue.nisarnowiserelease === transactionStatus.YES) ? this.props.intl.formatMessage({ id: "IDS_ENABLEFORMULTISAMPLERELEASE" })
                                                                                                                    : this.props.intl.formatMessage({ id: "IDS_ENABLEFORSINGLESAMPLERELEASE" })}
                                                                                                                isMandatory={false}
                                                                                                                required={false}
                                                                                                                onChange={(event) => this.onInputOnChange(event)}
                                                                                                                // defaultValue ={props.selectedRecord[item.controlName] === 3 ? true :false }
                                                                                                                checked={this.state.selectedRecord ? this.state.selectedRecord["nisarnowiserelease"] === 3 ? true : false : false}
                                                                                                            />
                                                                                                        }
                                                                                                    </Col>
                                                                                                </Row>
                                                                                                {/* <FilterQueryBuilder
                                                                                        fields={this.props.Login.fields || {}}
                                                                                        onChange={this.onComboChangeAwesomeQueryBuilder}
                                                                                        tree={this.props.Login.awesomeTree}
                                                                                        config={this.props.Login.awesomeConfig}
                                                                                        skip={this.props.Login.kendoSkip}
                                                                                        take={this.props.Login.kendoTake}
                                                                                        handlePageChange={this.handlePageChange}
                                                                                        gridColumns={[]}
                                                                                        filterData={this.props.Login.lstPatient || []}
                                                                                        //onRowClick={this.handleKendoRowClick}
                                                                                        //handleExecuteClick={this.handleExecuteClick}
                                                                                        userInfo={this.props.Login.userInfo}
                                                                                        static={true}
                                                                                    /> */}

                                                                                                {/* <Col md={3}>
                                                                                        <Button className="btn-user btn-primary-blue" onClick={() => this.handleExecuteClicks()}>
                                                                                            <FormattedMessage id='IDS_EXECUTE' defaultMessage='Execute' />
                                                                                        </Button>
                                                                                        </Col> */}
                                                                                            </>
                                                                                            // <Col md={4}>
                                                                                            //     <FormSelectSearch
                                                                                            //         name={"nprojecttypecode"}
                                                                                            //         formLabel={this.props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                                                                                            //         placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                                            //         options={this.props.Login.ProjectTypeList}
                                                                                            //         value={this.props.Login.selectedRecord ? this.props.Login.selectedRecord["nprojecttypecode"] : ""}
                                                                                            //         defaultValue={this.props.Login.selectedRecord ? this.props.Login.selectedRecord["nprojecttypecode"] : ""}
                                                                                            //         isMandatory={true}
                                                                                            //         isMulti={false}
                                                                                            //         isSearchable={true}
                                                                                            //         //  isDisabled={this.props.Login.isEditPopup === true ? true : false}
                                                                                            //         closeMenuOnSelect={true}
                                                                                            //         alphabeticalSort={true}
                                                                                            //         onChange={(event) => this.onComboChange(event, 'nprojecttypecode', 1)}
                                                                                            //     />
                                                                                            // </Col>
                                                                                        }
                                                                                        {/* {(this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_CORRECTION" }) && this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_CORRECTIONCOMMENTS" }) &&
                                                                                        this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_REGENERATEFILE" }) && this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_GENERATEFILE" }) &&
                                                                                        this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_PREVIEWREPORT" })) &&
                                                                                        // this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISEMULTIPLESAMPLE ||
                                                                                        // (this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.PROJECTWISE) &&
                                                                                        this.props.Login.masterData.realReportTypeValue
                                                                                        && (this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISE ||
                                                                                            this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISEMULTIPLESAMPLE || this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.PROJECTWISE) &&
                                                                                        this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode === SampleType.PROJECTSAMPLETYPE &&
                                                                                        this.props.Login.isDeletePopup !== true &&
                                                                                        this.props.Login.isComboCheck !== true &&
                                                                                        this.props.Login.isEditPopup !== true &&
                                                                                        this.props.Login.screenName !== "IDS_REPORTINFOCOMMENTS" &&
                                                                                        this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_RELEASEHISTORY" }) &&

                                                                                        // <Col md={4}>
                                                                                        //     <FormSelectSearch
                                                                                        //         name={"nprojectmastercode"}
                                                                                        //         formLabel={this.props.intl.formatMessage({ id: "IDS_PROJECTCODE" })}
                                                                                        //         placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                                        //         options={this.props.Login.projectMasterList}
                                                                                        //         value={this.props.Login.selectedRecord ? this.props.Login.selectedRecord["nprojectmastercode"] !== undefined ? this.props.Login.selectedRecord["nprojectmastercode"] : "" : ""}
                                                                                        //         defaultValue={this.props.Login.selectedRecord ? this.props.Login.selectedRecord["nprojectmastercode"] : ""}
                                                                                        //         isMandatory={true}
                                                                                        //         isMulti={false}
                                                                                        //         isSearchable={true}
                                                                                        //         // isDisabled={this.props.Login.isEditPopup === true ? true : false}
                                                                                        //         closeMenuOnSelect={true}
                                                                                        //         alphabeticalSort={true}
                                                                                        //         onChange={(event) => this.onComboChange(event, 'nprojectmastercode', 1)}
                                                                                        //     />
                                                                                        // </Col>
                                                                                    } */}
                                                                                        {/* { (this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_CORRECTION" }) && this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_CORRECTIONCOMMENTS" }) &&
                                                                                        this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_REGENERATEFILE" }) && this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_GENERATEFILE" }) &&
                                                                                        this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_PREVIEWREPORT" })) &&
                                                                                        this.props.Login.masterData.realReportTypeValue &&
                                                                                        (this.props.Login.masterData.realReportTypeValue.isneedsection === transactionStatus.YES || this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISE ||
                                                                                            this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISEMULTIPLESAMPLE) &&
                                                                                        this.props.Login.isDeletePopup !== true &&
                                                                                        this.props.Login.isComboCheck !== true && this.props.Login.isEditPopup !== true &&
                                                                                         <Col md={4}>
                                                                                             <FormSelectSearch
                                                                                                name={"nsectioncode"}
                                                                                                 formLabel={this.props.intl.formatMessage({ id: "IDS_SECTION" })}
                                                                                                 placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                                                 options={this.props.Login.sectionList}
                                                                                                value={this.props.Login.selectedRecord ? this.props.Login.selectedRecord["nsectioncode"] !== undefined ? this.props.Login.selectedRecord["nsectioncode"] : "" : ""}
                                                                                                defaultValue={this.props.Login.selectedRecord ? this.props.Login.selectedRecord["nsectioncode"] : ""}
                                                                                                isMandatory={true}
                                                                                                 isMulti={false}
                                                                                                isSearchable={true}
                                                                                                // isDisabled={this.props.Login.isEditPopup === true ? true : false}
                                                                                                 closeMenuOnSelect={true}
                                                                                                 alphabeticalSort={true}
                                                                                                 onChange={(event) => this.onComboChange(event, 'nsectioncode', 1)}
                                                                                            />
                                                                                     </Col>
                                                                                    } */}
                                                                                        <Row>


                                                                                            {this.props.Login.ReportmodalShow ? (
                                                                                                <ModalShow
                                                                                                    modalShow={this.props.Login.ReportmodalShow}
                                                                                                    closeModal={this.closeModalShow}
                                                                                                    onSaveClick={this.onSaveModalClick}
                                                                                                    validateEsign={this.validateEsign}
                                                                                                    masterStatus={this.props.Login.masterStatus}
                                                                                                    //ATE234 ALPD-5549 Release & Report --> (Report Comments) Able save the mandatory field without having the data. Check description
                                                                                                    mandatoryFields={this.props.Login.screenName === "IDS_REPORTINFOCOMMENTS"? mandatoryCommentsFieldsModalShow:""}
                                                                                                    updateStore={this.props.updateStore}
                                                                                                    selectedRecord={this.props.Login.screenName === "IDS_REPORTINFOCOMMENTS"? this.props.Login.masterData && this.props.Login.masterData.selectedComment:this.state.selectedRecord || {}}
                                                                                                    modalTitle={this.props.Login.modalTitle}
                                                                                                    modalBody={
                                                                                                        this.props.Login.loadEsign ?
                                                                                                            <Esign
                                                                                                                operation={this.props.Login.operation}
                                                                                                                onInputOnChange={this.onEsignInputOnChange}
                                                                                                                inputParam={this.props.Login.inputParam}
                                                                                                                selectedRecord={this.state.selectedRecord || {}}
                                                                                                            /> :

                                                                                                            //ALPD-4878-To show the add popup to get input of filter name,done by Dhanushya RI
                                                                                                            <Col md={12}>

                                                                                                                <FormTextarea
                                                                                                                    label={this.props.intl.formatMessage({ id: this.props.Login.masterData.selectedComment.sreportfieldname })}
                                                                                                                    name={"sreportfieldvalue"}
                                                                                                                    type="text"
                                                                                                                    onChange={this.onInputChange}
                                                                                                                    placeholder={this.props.intl.formatMessage({ id: this.props.Login.masterData.selectedComment.sreportfieldname })}
                                                                                                                    value={this.state.selectedComment ? this.state.selectedComment.sreportfieldvalue : ""}
                                                                                                                    isMandatory={true}
                                                                                                                    required={true}
                                                                                                                    maxLength={"500"}
                                                                                                                />
                                                                                                            </Col>

                                                                                                    }
                                                                                                />
                                                                                            ) : (
                                                                                                ""
                                                                                            )}

                                                                                        </Row>

                                                                                        {this.props.Login.isCorrectionNeed && this.props.Login.isCorrectionNeed ?
                                                                                            <DataGrid
                                                                                                primaryKeyField={"ntransactionresultcode"}
                                                                                                selectedId={this.props.Login.selectedId}
                                                                                                data={this.props.Login.masterData.ResultCorrection}
                                                                                                dataResult={process(this.props.Login.masterData.ResultCorrection && this.props.Login.masterData.ResultCorrection || [], this.state.correctionDataState)}
                                                                                                dataState={this.state.correctionDataState}
                                                                                                dataStateChange={this.correctionDataStateChange}
                                                                                                extractedColumnList={resultCorrectionColumnList}
                                                                                                controlMap={this.state.controlMap}
                                                                                                userRoleControlRights={this.state.userRoleControlRights}
                                                                                                inputParam={this.props.Login.inputParam}
                                                                                                methodUrl={"Result"}
                                                                                                userInfo={this.props.Login.userInfo}
                                                                                                fetchRecord={this.props.fetchParameterById}
                                                                                                deleteRecord={this.deleteRecord}
                                                                                                //  reloadData={this.reloadData}
                                                                                                //  addRecord={() => this.props.openProductCategoryModal("IDS_PRODUCTCATEGORY", addId,this.props.Login.settings)}
                                                                                                editParam={editParam}
                                                                                                //  deleteParam={deleteParam}
                                                                                                scrollable={'scrollable'}
                                                                                                gridHeight={'600px'}
                                                                                                isActionRequired={true}
                                                                                                //  isToolBarRequired={true}
                                                                                                pageable={true}
                                                                                            /> :
                                                                                            (this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_CORRECTION" }) && this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_CORRECTIONCOMMENTS" }) &&
                                                                                                this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_REGENERATEFILE" }) && this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_GENERATEFILE" }) &&
                                                                                                this.props.Login.screenName !== this.props.intl.formatMessage({ id: "IDS_PREVIEWREPORT" })) && this.props.Login.screenName !== "IDS_REPORTINFOCOMMENT" && this.props.Login.screenName !== "IDS_REPORTINFOCOMMENTS"
                                                                                                && this.props.Login.screenName !== "IDS_REPORTINFOCOMMENTS" && this.props.Login.screenName !== "IDS_ADDRELEASETESTATTACHMENT" ?
                                                                                                <DataGridWithMultipleGrid
                                                                                                    needSubSample={this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample || false}
                                                                                                    data={this.state.data}
                                                                                                    dataResult={process(this.props.Login.masterData.searchedData1 && this.props.Login.masterData.searchedData1 || this.props.Login.masterData.ReleaseSample && this.props.Login.masterData.ReleaseSample || [], this.state.slideOutDataState)}
                                                                                                    dataState={this.state.slideOutDataState}    // ALPD-4896, Added slideOutDataState for slideout datagrid
                                                                                                    dataStateChange={this.dataStateChangeSlideOut}
                                                                                                    expandNextData={this.expandNextData}
                                                                                                    checkFunction={this.checkFunction}
                                                                                                    checkFunction1={this.checkFunction1}
                                                                                                    expandFunc={this.expandFunc}
                                                                                                    childDataResult={this.state.childDataResult}
                                                                                                    subChildDataResult={this.state.subChildDataResult}
                                                                                                    extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem) || []}
                                                                                                    subChildColumnList={this.gridfillingColumn(this.state.DynamicTestGridItem) || []}
                                                                                                    expandField="expanded"
                                                                                                    handleExpandChange={this.handleExpandChange}
                                                                                                    childHandleExpandChange={this.childHandleExpandChange}
                                                                                                    isCheckBoxRequired={true}
                                                                                                    reloadData={this.reloadData}
                                                                                                    controlMap={this.state.controlMap}
                                                                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                                                                    inputParam={this.props.Login.inputParam}
                                                                                                    userInfo={this.props.Login.userInfo}
                                                                                                    pageable={true}
                                                                                                    scrollable={'scrollable'}
                                                                                                    gridHeight={'600px'}
                                                                                                    gridTop={'10px'}
                                                                                                    // isActionRequired={true}
                                                                                                    //   isToolBarRequired={true}
                                                                                                    //  isExpandRequired={true}
                                                                                                    //   isDownloadRequired={true}
                                                                                                    isCollapseRequired={true}
                                                                                                    selectedId={this.props.Login.selectedId}
                                                                                                    hasChild={true}
                                                                                                    hasSubChild={true}
                                                                                                    childList={
                                                                                                        this.props.Login.masterData.searchedData2 ||
                                                                                                        this.props.Login.masterData.ReleaseSubSample
                                                                                                    }
                                                                                                    childColumnList={this.gridfillingColumn(this.state.DynamicSubSampleGridItem) || []}
                                                                                                    childMappingField={"npreregno"}
                                                                                                    subChildMappingField={"ntransactionsamplecode"}
                                                                                                    subChildList={
                                                                                                        this.props.Login.masterData.searchedData3 ||
                                                                                                        this.props.Login.masterData.ReleaseTest
                                                                                                    }
                                                                                                    selectedsubcild={this.props.Login.selectedsubcild}
                                                                                                    methodUrl={"Release"}
                                                                                                    headerSelectionChange={this.headerSelectionChange}
                                                                                                    childHeaderSelectionChange={this.childHeaderSelectionChange}
                                                                                                    childSelectAll={this.props.Login.childSelectAll}
                                                                                                    childSelectionChange={this.childSelectionChange}
                                                                                                    subChildSelectionChange={this.subChildSelectionChange}
                                                                                                    subChildHeaderSelectionChange={this.subChildHeaderSelectionChange}
                                                                                                    subChildSelectAll={this.props.Login.subChildSelectAll}
                                                                                                    selectionChange={this.selectionChange}
                                                                                                    selectAll={this.props.Login.selectAll}
                                                                                                    releaseRecord={this.onSaveModalClick}
                                                                                                // viewDownloadFile={this.viewDownloadFile}
                                                                                                />
                                                                                                :
                                                                                                this.props.Login.screenName === "IDS_REPORTINFOCOMMENTS" && this.props.Login.openModal ?
                                                                                                    <DataGrid
                                                                                                        key="reportinforeleasecode"
                                                                                                        primaryKeyField="nreportinforeleasecode"
                                                                                                        data={this.props.Login.masterData.reportinforelease || []}
                                                                                                        dataResult={process(this.props.Login.masterData.reportinforelease && this.props.Login.masterData.reportinforelease || [], this.state.reportInfoDataState)}
                                                                                                        dataState={this.state.reportInfoDataState}
                                                                                                        //dataResult={this.props.selectedWorklist || []}
                                                                                                        //expandField="expanded"
                                                                                                        isExportExcelRequired={false}
                                                                                                        //dataStateChange={(event) => this.setState({ sampleDataState: event.dataState })}
                                                                                                        controlMap={this.state.controlMap}
                                                                                                        userRoleControlRights={this.state.userRoleControlRights}
                                                                                                        extractedColumnList={this.feildsForGrid}
                                                                                                        detailedFieldList={this.props.detailedFieldList}
                                                                                                        editParam={editParam}
                                                                                                        fetchRecord={this.props.fetchReportInfoReleaseById}
                                                                                                        pageable={true}
                                                                                                        dataStateChange={this.reportInfoDataChange}
                                                                                                        scrollable={'scrollable'}
                                                                                                        gridHeight={'630px'}
                                                                                                        isActionRequired={true}
                                                                                                        methodUrl={'ReportComment'}
                                                                                                    >
                                                                                                    </DataGrid> :
                                                                                                    //     <DataGridWithMultipleGrid
                                                                                                    //     needSubSample={this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample || false}
                                                                                                    //     data={this.state.data}
                                                                                                    //     dataResult={process(this.props.Login.masterData.searchedData1 && this.props.Login.masterData.searchedData1 || this.props.Login.masterData.ReleaseSample && this.props.Login.masterData.ReleaseSample || [], this.state.dataState)}
                                                                                                    //     dataState={this.state.dataState}
                                                                                                    //     dataStateChange={this.dataStateChange}
                                                                                                    //     expandNextData={this.expandNextData}
                                                                                                    //     checkFunction={this.checkFunction}
                                                                                                    //     checkFunction1={this.checkFunction1}
                                                                                                    //     expandFunc={this.expandFunc}
                                                                                                    //     childDataResult={this.state.childDataResult}
                                                                                                    //     subChildDataResult={this.state.subChildDataResult}
                                                                                                    //     extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem) || []}
                                                                                                    //     subChildColumnList={this.gridfillingColumn(this.state.DynamicTestGridItem) || []}

                                                                                                    //     expandField="expanded"
                                                                                                    //     handleExpandChange={this.handleExpandChange}
                                                                                                    //     childHandleExpandChange={this.childHandleExpandChange}
                                                                                                    //     isCheckBoxRequired={true}

                                                                                                    //     reloadData={this.reloadData}
                                                                                                    //     controlMap={this.state.controlMap}
                                                                                                    //     userRoleControlRights={this.state.userRoleControlRights}
                                                                                                    //     inputParam={this.props.Login.inputParam}
                                                                                                    //     userInfo={this.props.Login.userInfo}
                                                                                                    //     pageable={true}
                                                                                                    //     scrollable={'scrollable'}
                                                                                                    //     gridHeight={'600px'}
                                                                                                    //     gridTop={'10px'}
                                                                                                    //    // isActionRequired={true}
                                                                                                    //     //   isToolBarRequired={true}
                                                                                                    //     //  isExpandRequired={true}
                                                                                                    //     //   isDownloadRequired={true}
                                                                                                    //     isCollapseRequired={true}

                                                                                                    //     selectedId={this.props.Login.selectedId}
                                                                                                    //     hasChild={true}
                                                                                                    //     hasSubChild={true}
                                                                                                    //     childList={
                                                                                                    //         this.props.Login.masterData.searchedData2 ||
                                                                                                    //         this.props.Login.masterData.ReleaseSubSample
                                                                                                    //     }
                                                                                                    //     childColumnList={this.gridfillingColumn(this.state.DynamicSubSampleGridItem) || []}
                                                                                                    //     childMappingField={"npreregno"}
                                                                                                    //     subChildMappingField={"ntransactionsamplecode"}
                                                                                                    //     subChildList={
                                                                                                    //         this.props.Login.masterData.searchedData3 ||
                                                                                                    //         this.props.Login.masterData.ReleaseTest
                                                                                                    //     }
                                                                                                    //     selectedsubcild={this.props.Login.selectedsubcild}
                                                                                                    //     methodUrl={"Release"}
                                                                                                    //     headerSelectionChange={this.headerSelectionChange}
                                                                                                    //     childHeaderSelectionChange={this.childHeaderSelectionChange}
                                                                                                    //     childSelectAll={this.props.Login.childSelectAll}
                                                                                                    //     childSelectionChange={this.childSelectionChange}
                                                                                                    //     subChildSelectionChange={this.subChildSelectionChange}
                                                                                                    //     subChildHeaderSelectionChange={this.subChildHeaderSelectionChange}
                                                                                                    //     subChildSelectAll={this.props.Login.subChildSelectAll}
                                                                                                    //     selectionChange={this.selectionChange}
                                                                                                    //     selectAll={this.props.Login.selectAll}
                                                                                                    //     releaseRecord={this.onSaveModalClick}
                                                                                                    //    // viewDownloadFile={this.viewDownloadFile}
                                                                                                    // />
                                                                                                    ""
                                                                                        }

                                                                                        {/* {this.props.Login.screenName === "IDS_REPORTINFOCOMMENTS" && this.props.Login.openModal ?
                      <DataGrid 
                            key="reportinforeleasecode"
                            primaryKeyField="nreportinforeleasecode"
                            data={this.props.Login.masterData.reportinforelease || []}
                            dataResult={process(this.props.Login.masterData.reportinforelease && this.props.Login.masterData.reportinforelease || [], this.state.dataState)}
                            dataState={this.state.dataState}
                            //dataResult={this.props.selectedWorklist || []}
                            //expandField="expanded"
                            isExportExcelRequired = {false}
                            //dataStateChange={(event) => this.setState({ sampleDataState: event.dataState })}
                            controlMap={this.state.controlMap}
                            userRoleControlRights={this.state.userRoleControlRights}
                            extractedColumnList={this.feildsForGrid}
                            detailedFieldList={this.props.detailedFieldList}
                            editParam={editParam}   
                            fetchRecord={this.props.fetchReportInfoReleaseById}                         
                            pageable={true}
                            dataStateChange={this.dataStateChange}
                            scrollable={'scrollable'}
                            gridHeight={'630px'}
                             isActionRequired={true}
                            methodUrl={'ReportComment'}
                        >
                        </DataGrid>:
                    //     <DataGridWithMultipleGrid
                    //     needSubSample={this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample || false}
                    //     data={this.state.data}
                    //     dataResult={process(this.props.Login.masterData.searchedData1 && this.props.Login.masterData.searchedData1 || this.props.Login.masterData.ReleaseSample && this.props.Login.masterData.ReleaseSample || [], this.state.dataState)}
                    //     dataState={this.state.dataState}
                    //     dataStateChange={this.dataStateChange}
                    //     expandNextData={this.expandNextData}
                    //     checkFunction={this.checkFunction}
                    //     checkFunction1={this.checkFunction1}
                    //     expandFunc={this.expandFunc}
                    //     childDataResult={this.state.childDataResult}
                    //     subChildDataResult={this.state.subChildDataResult}
                    //     extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem) || []}
                    //     subChildColumnList={this.gridfillingColumn(this.state.DynamicTestGridItem) || []}

                    //     expandField="expanded"
                    //     handleExpandChange={this.handleExpandChange}
                    //     childHandleExpandChange={this.childHandleExpandChange}
                    //     isCheckBoxRequired={true}

                    //     reloadData={this.reloadData}
                    //     controlMap={this.state.controlMap}
                    //     userRoleControlRights={this.state.userRoleControlRights}
                    //     inputParam={this.props.Login.inputParam}
                    //     userInfo={this.props.Login.userInfo}
                    //     pageable={true}
                    //     scrollable={'scrollable'}
                    //     gridHeight={'600px'}
                    //     gridTop={'10px'}
                    //    // isActionRequired={true}
                    //     //   isToolBarRequired={true}
                    //     //  isExpandRequired={true}
                    //     //   isDownloadRequired={true}
                    //     isCollapseRequired={true}

                    //     selectedId={this.props.Login.selectedId}
                    //     hasChild={true}
                    //     hasSubChild={true}
                    //     childList={
                    //         this.props.Login.masterData.searchedData2 ||
                    //         this.props.Login.masterData.ReleaseSubSample
                    //     }
                    //     childColumnList={this.gridfillingColumn(this.state.DynamicSubSampleGridItem) || []}
                    //     childMappingField={"npreregno"}
                    //     subChildMappingField={"ntransactionsamplecode"}
                    //     subChildList={
                    //         this.props.Login.masterData.searchedData3 ||
                    //         this.props.Login.masterData.ReleaseTest
                    //     }
                    //     selectedsubcild={this.props.Login.selectedsubcild}
                    //     methodUrl={"Release"}
                    //     headerSelectionChange={this.headerSelectionChange}
                    //     childHeaderSelectionChange={this.childHeaderSelectionChange}
                    //     childSelectAll={this.props.Login.childSelectAll}
                    //     childSelectionChange={this.childSelectionChange}
                    //     subChildSelectionChange={this.subChildSelectionChange}
                    //     subChildHeaderSelectionChange={this.subChildHeaderSelectionChange}
                    //     subChildSelectAll={this.props.Login.subChildSelectAll}
                    //     selectionChange={this.selectionChange}
                    //     selectAll={this.props.Login.selectAll}
                    //     releaseRecord={this.onSaveModalClick}
                    //    // viewDownloadFile={this.viewDownloadFile}
                    // />
                    ""
                        } */}
                                                                                    </>
                        }
                    />
                }
                {this.props.Login.modalShow ? (
                    <ModalShow
                        modalShow={this.props.Login.modalShow}
                        closeModal={this.closeModalShow}
                        onSaveClick={this.props.Login && this.props.Login.isFilterDetail ? this.onSaveModalFilterName : this.onSaveModalResultClick}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        //ATE234 ALPD-5549 Release & Report --> (Report Comments) Able save the mandatory field without having the data. Check description
                        mandatoryFields={this.props.Login && this.props.Login.isFilterDetail ? mandatoryFieldsFilter : ""}
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
                                    //ATE234 -> ALPD-5436 Release & Report -> Edit Report Template Slide out issues.
                                /> : this.props.Login.modalTitle ===this.props.intl.formatMessage({ id: "IDS_SAVEFILTER" }) && this.props.Login && this.props.Login.isFilterDetail ?
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
                                    </Col> :
                                    this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_REPORTTEMPLATE" }) ?
                                        <FormSelectSearch
                                            name={"nreporttemplatecode"}
                                            formLabel={this.props.intl.formatMessage({ id: "IDS_REPORTTEMPLATE" })}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                            options={this.props.Login.masterData.reportTemplateList || []}
                                            value={this.state.selectedRecord["nreporttemplatecode"] || ""}
                                            isMandatory={true}
                                            isMulti={false}
                                            isClearable={false}
                                            isSearchable={true}
                                            // isDisabled={props.operation === "update" && props.reportVersionStatus === transactionStatus.APPROVED}
                                            closeMenuOnSelect={true}
                                            onChange={(event) => this.onComboChange(event, "nreporttemplatecode")}
                                        />
                                        :
                                        this.state.selectedRecord.ReleaseParameter &&
                                        this.state.selectedRecord.ReleaseParameter.map((parameterResult, index) => {
                                            return <ResultEntryForm
                                                index={index}
                                                ResultParameter={[...this.state.selectedRecord.ReleaseParameter]}
                                                predefinedValues={this.props.Login.masterData.PredefinedValues}
                                                defaultPredefinedValues={this.props.Login.masterData.PredefinedValues}
                                                gradeValues={this.props.Login.masterData.GradeValues || []}
                                                selectedNumericData={this.props.Login.masterData.selectedNumericData}
                                                selectedResultGrade={this.state.selectedRecord.selectedResultGrade || []}
                                                paremterResultcode={this.props.Login.masterData.paremterResultcode || []}
                                                parameterResults={parameterResult
                                                    || []}
                                                Login={this.props.Login}
                                                handleClose={this.handleClose}
                                                onSaveClick={this.onSaveClick}
                                                onResultInputChange={this.onResultInputChange}
                                                //onGradeEvent={this.onGradeEvent}
                                                getFormula={this.getFormula}
                                                onDropTestFile={this.onDropTestFile}
                                                onKeyPress={this.onKeyPress}
                                                //deleteAttachmentParamFile={this.deleteAttachmentParameterFile}
                                                viewAdditionalInfo={this.viewAdditionalInfo}
                                                needSubSample={this.props.Login.masterData.realRegSubTypeValue.nneedsubsample}
                                                needdelete={true}
                                                needmandatory={true}
                                                ResultAccuracy={this.props.Login.masterData.ResultAccuracy || []}
                                                Unit={this.props.Login.masterData.Unit || []}
                                                formFields={this.props.Login.masterData.formFields || []}
                                            //intl={this.props.intl}
                                            />
                                        })
                        }
                    />
                ) : (
                    ""
                )}

            </>
        );
    }
    onKeyPress = (event, index, paremterResultcode) => {
        if (event.keyCode === 13) {
            for (let i = 0; i < event.target.form.elements.length; i++) {
                if (parseInt(event.target.form.elements[i].id) === paremterResultcode[index + 1]) {
                    event.target.form.elements[i].focus();
                    break;
                }
            }
            event.preventDefault();
        }
    }
    onResultInputChange = (parameterResults) => {
        this.setState({
            parameterResults: [...parameterResults],
            isParameterInitialRender: false
            // currentAlertResultCode,
            //  currentntestgrouptestpredefcode
        });
    }
    fields = () => {

    }
    queryBuilderfillingColumns(data) {

        // const temparray1 = [
        //(this.props.Login.masterData.realReportTypeValue.isneedsection === transactionStatus.YES || this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISE ||
        //this.props.Login.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.SECTIONWISEMULTIPLESAMPLE) &&
        ////{ "idsName": "IDS_SECTION", "dataField": "s.nsectioncode", "width": "200px", "staticField": true, "filterinputtype": "combo" },
        // { "idsName": "IDS_TEST", "dataField": "rt.ntestgrouptestcode", "width": "200px", "staticField": true, "filterinputtype": "combo" }];
        const temparray2 = data && data.map((option) => {
            return {
                "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode],
                "dataField": option[designProperties.RECORDTYPE] === 'static' ? "(jsondata->>'" + option[designProperties.PRIMARYKEY] + "')::int" :
                    option[designProperties.LISTITEM] === 'combo' ?
                        "(jsondata->'" + option[designProperties.VALUE] + "'->>'" + option[designProperties.PRIMARYKEY] + "')::int" :
                        option[designProperties.LISTITEM] === 'Numeric' ?
                            "(jsondata->>'" + option[designProperties.VALUE] + "')::int" :
                            "(jsondata->>'" + option[designProperties.VALUE] + "')", "width": "200px", "filterinputtype": option[designProperties.LISTITEM]
            };
        });
        const newArray = [...temparray2]
        return newArray;
    }
    onComboChange = (comboData, fieldName) => {
        if (comboData !== null) {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }

        if (fieldName === 'nprojecttypecode') {
            const inputParamData = {

                nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
                nprojecttypecode: comboData.value,
                userinfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData,
            }
            this.props.getApprovedProjectByProjectType(inputParamData)
        }
        if (fieldName === 'nprojectmastercode') {

            let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
            //let realFromDate = obj.fromDate;
            //let realToDate = obj.toDate
            let realSampleTypeValue = this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue
            let realRegTypeValue = this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue
            let realRegSubTypeValue = this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue
            let realFilterStatusValue = this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue
            let realApprovalVersionValue = this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue
            let realUserSectionValue = this.props.Login.masterData.UserSectionValue && this.props.Login.masterData.UserSectionValue
            let realTestValue = this.props.Login.masterData.TestValue && this.props.Login.masterData.TestValue
            let realReportTypeValue = this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue
            let realDesignTemplateMappingValue = this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue
            let masterData = {
                ...this.props.Login.masterData, //realFromDate, realToDate, 
                realSampleTypeValue, realRegTypeValue,
                realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue, realUserSectionValue, realTestValue, realDesignTemplateMappingValue, realReportTypeValue
            }
            let inputData = {
                npreregno: "0",
                nsampletypecode: (this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue.nsampletypecode) || -1,
                nregtypecode: parseInt(this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode) || -1,
                nregsubtypecode: parseInt(this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) || -1,
                ncoareporttypecode: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) || -1,
                isneedsection: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
                ntransactionstatus: ((this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== undefined) || this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== '0') ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) : "-1",
                nprojectmastercode: comboData.value,
                napprovalconfigcode: this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigcode || -1 : null,
                napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode) : null,
                ntestcode: this.props.Login.masterData.TestValue ? this.props.Login.masterData.TestValue.ntestcode : -1,
                nneedsubsample: (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample) || false,
                nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                userinfo: this.props.Login.userInfo,
                // ModalStatusValue: true,
                isPopup: true,
                isAddPopup: true,
                ndesigntemplatemappingcode: (this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode
                    ? this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode : this.props.Login.masterData.DesignTemplateMappingValue) || -1
            }

            let selectedRecord = { ...this.props.Login.selectedRecord }
            if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
                && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
                && realFilterStatusValue.sfilterstatus !== null) {

                inputData['dfrom'] = obj.fromDate;
                inputData['dto'] = obj.toDate;
                let inputParam = {
                    masterData,
                    inputData,
                    selectedRecord

                }
                if (inputData.ncoareporttypecode === reportCOAType.SECTIONWISEMULTIPLESAMPLE || inputData.isneedsection === transactionStatus.YES) {
                    this.props.getSectionForSectionWise(inputParam)
                }
                else {
                    this.props.getReleasedSample(inputParam, this.state.selectedRecord, this.props.Login.selectedRecord, this.props.Login)
                }
            }
        }
        if (fieldName === 'nsectioncode') {
            let filterquery = this.props.Login && this.props.Login.filterquery || undefined;
            if (filterquery !== undefined) {
                let val = removeSpaceFromFirst(filterquery, '')
                let matchs = val && val.match(/''/g);
                filterquery = matchs !== null && matchs !== undefined && matchs && matchs.length > 1 ? val : val && val.replaceAll(/'/g, "''");
            }
            let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
            let realFromDate = obj.fromDate;
            let realToDate = obj.toDate
            let realSampleTypeValue = this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue
            let realRegTypeValue = this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue
            let realRegSubTypeValue = this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue
            let realFilterStatusValue = this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue
            let realApprovalVersionValue = this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue
            let realUserSectionValue = this.props.Login.masterData.UserSectionValue && this.props.Login.masterData.UserSectionValue
            let realTestValue = this.props.Login.masterData.TestValue && this.props.Login.masterData.TestValue
            let realReportTypeValue = this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue
            let realDesignTemplateMappingValue = this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue
            let masterData = {
                ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue, realRegTypeValue,
                realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue, realUserSectionValue, realTestValue, realDesignTemplateMappingValue, realReportTypeValue
            }
            let inputData = {
                npreregno: "0",
                nsampletypecode: (this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue.nsampletypecode) || -1,
                nregtypecode: parseInt(this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode) || -1,
                nregsubtypecode: parseInt(this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) || -1,
                ncoareporttypecode: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) || -1,
                isneedsection: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
                ntransactionstatus: ((this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== undefined) || this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== '0') ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) : "-1",
                nsectioncode: comboData.value,
                napprovalconfigcode: this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigcode || -1 : null,
                napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode) : null,
                ntestcode: this.props.Login.masterData.TestValue ? this.props.Login.masterData.TestValue.ntestcode : -1,
                nneedsubsample: (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample) || false,
                nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                userinfo: this.props.Login.userInfo,
                nprojectmastercode: this.props.Login.selectedRecord.nprojectmastercode && this.props.Login.selectedRecord.nprojectmastercode.value || -1,
                // ModalStatusValue: true,
                screenName: this.props.Login.screenName,
                filterquery: filterquery,
                isPopup: true,
                isAddPopup: true,
                isSectionCombo: true,
                ndesigntemplatemappingcode: (this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode
                    ? this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode : this.props.Login.masterData.DesignTemplateMappingValue) || -1
            }
            if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
                && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
                && realFilterStatusValue.sfilterstatus !== null) {

                inputData['dfrom'] = obj.fromDate;
                inputData['dto'] = obj.toDate;
                let inputParam = {
                    masterData,
                    inputData
                }

                this.props.getReleasedSample(inputParam, this.state.selectedRecord, this.props.Login.selectedRecord, this.props.Login)
            }
        }
    }
    handleExecuteClicks = (isClear) => {
        const filterquery = this.props.Login.filterquery;
        const filterQueryTreeStr = this.props.Login.filterQueryTreeStr;
        let isMandatory = this.checkMandatoryFilter(filterQueryTreeStr, this.props.Login.awesomeConfig);
        if (isMandatory) {
            let isFilterEmpty = checkFilterIsEmptyQueryBuilder(filterQueryTreeStr);
            if (isFilterEmpty) {
                let val = removeSpaceFromFirst(filterquery, '')
                let matchs = val && val.match(/''/g)
                // if (filterquery !== "" && filterquery !== undefined && !filterquery.includes('Invalid date')) {
                let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
                let realFromDate = obj.fromDate;
                let realToDate = obj.toDate
                let realSampleTypeValue = this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue
                let realRegTypeValue = this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue
                let realRegSubTypeValue = this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue
                let realFilterStatusValue = this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue
                let realApprovalVersionValue = this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue
                let realUserSectionValue = this.props.Login.masterData.UserSectionValue && this.props.Login.masterData.UserSectionValue
                let realTestValue = this.props.Login.masterData.TestValue && this.props.Login.masterData.TestValue
                let realReportTypeValue = this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue
                let realDesignTemplateMappingValue = this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue
                let masterData = {
                    ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue, realRegTypeValue,
                    realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue, realUserSectionValue, realTestValue, realDesignTemplateMappingValue, realReportTypeValue
                }
                // ALPD-4091 (16-05-2024) Changed SampleTypeValue to realSampleTypeValue
                // ALPD-4091 (16-05-2024) Changed RegTypeValue to realRegTypeValue
                // ALPD-4091 (16-05-2024) Changed RegSubTypeValue to realRegSubTypeValue
                // ALPD-4091 (16-05-2024) Changed FilterStatusValue to realFilterStatusValue
                // ALPD-4091 (16-05-2024) Changed ApprovalVersionValue to realApprovalVersionValue
                // ALPD-4091 (16-05-2024) Changed TestValue to realTestValue
                // ALPD-4091 (16-05-2024) Changed DesignTemplateMappingValue to realDesignTemplateMappingValue

                let inputData = {
                    npreregno: "0",
                    nsampletypecode: (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode) || -1,
                    nregtypecode: parseInt(this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
                    nregsubtypecode: parseInt(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
                    ncoareporttypecode: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) || -1,  //  ALPD-5603   Changed -1 ncoareporttypecode to selected ncoareporttypecode by Vishakh (06-04-2025)
                    isneedsection: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
                    ntransactionstatus: ((this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus !== undefined) || this.props.Login.masterData.realFilterStatusValue.ntransactionstatus !== '0') ? String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) : "-1",
                    nsectioncode: this.props.Login.masterData && this.props.Login.masterData.realReportTypeValue.isneedsection === transactionStatus.YES ? this.props.Login.isEditPopup === true ? (this.props.Login.masterData && this.props.Login.masterData.reportSectionCode) : this.props.Login.selectedRecord && this.props.Login.selectedRecord.nsectioncode ? this.props.Login.selectedRecord.nsectioncode.value : -1 : -1,
                    napprovalconfigcode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
                    napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) : null,
                    ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode : -1,
                    nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                    nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                    userinfo: this.props.Login.userInfo,
                    nprojectmastercode: this.props.Login.selectedRecord.nprojectmastercode && this.props.Login.selectedRecord.nprojectmastercode.value || -1,
                    // ModalStatusValue: true,
                    isPopup: true,
                    isAddPopup: true,
                    ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
                    filterquery: !isClear ? matchs && matchs.length > 1 ? val : val && val.replaceAll(/'/g, "''") : undefined,
                    screenName: this.props.Login.screenNameCopy,
                    isClear: isClear,
                    awesomeTree: this.props.Login.awesomeTree
                }
                if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
                    && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
                    && realFilterStatusValue.sfilterstatus !== null) {

                    inputData['dfrom'] = obj.fromDate;
                    inputData['dto'] = obj.toDate;
                    let inputParam = {
                        masterData,
                        inputData
                    }

                    this.props.getReleasedSample(inputParam, this.state.selectedRecord, this.props.Login.selectedRecord, this.props.Login)
                }
                // } else {
                //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLINFILTER" }));
                // }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PROVIDEVALUESFORINPUTS" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_CONFIGUREMANDATORYFIELDS" }));
        }
    }
    //ALPD-4878 to insert the filter name in filtername table,done by Dhanushya RI
    onSaveModalFilterName = () => {
        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
        // let realFromDate = obj.fromDate;
        // let realToDate = obj.toDate
        // let realSampleTypeValue = this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue
        // let realRegTypeValue = this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue
        // let realRegSubTypeValue = this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue
        // let realFilterStatusValue = this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue
        // let realApprovalVersionValue = this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue
        // let realReportTypeValue = this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue
        // let realDesignTemplateMappingValue = this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue
        // let realSampleTypeList = this.props.Login.masterData.SampleType || [];
        // let realReportTypeList = this.props.Login.masterData.ReportType || [];
        // let realRegTypeList = this.props.Login.masterData.RegType || [];
        // let realRegSubTypeList = this.props.Login.masterData.RegSubType || [];
        // let realFilterStatusList = this.props.Login.masterData.FilterStatus || [];
        // let realApprovalVersionList = this.props.Login.masterData.ApprovalVersion || [];
        // let realDesignTemplateMappingList = this.props.Login.masterData.DesignTemplateMapping || [];
        // let masterData = {
        //     ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue, realRegTypeValue,
        //     realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue,
        //     //  realUserSectionValue, realTestValue,
        //     realDesignTemplateMappingValue, realReportTypeList, realRegSubTypeList, realRegTypeList,
        //     realReportTypeValue, realSampleTypeList, realFilterStatusList, realApprovalVersionList, realDesignTemplateMappingList
        // }
        const masterData = this.props.Login.masterData;

        let inputData = {
            userinfo: this.props.Login.userInfo,
            dfrom: obj.fromDate,
            dto: obj.toDate,
            sfiltername: this.state.selectedRecord && this.state.selectedRecord.sfiltername !== null
                ? this.state.selectedRecord.sfiltername : "",
            sampleTypeValue: this.props.Login.masterData && this.props.Login.masterData.realSampleTypeValue,
            regTypeValue: this.props.Login.masterData && this.props.Login.masterData.realRegTypeValue,
            regSubTypeValue: this.props.Login.masterData && this.props.Login.masterData.realRegSubTypeValue,
            filterStatusValue: this.props.Login.masterData && this.props.Login.masterData.realFilterStatusValue,
            approvalConfigValue: this.props.Login.masterData && this.props.Login.masterData.realApprovalVersionValue,
            designTemplateMappingValue: this.props.Login.masterData && this.props.Login.masterData.realDesignTemplateMappingValue,
            reportTypeValue: this.props.Login.masterData && this.props.Login.masterData.realReportTypeValue,
            npreregno: "0",
            nsampletypecode: (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode) || -1,
            nregtypecode: parseInt(this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
            nregsubtypecode: parseInt(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
            ntransactionstatus: ((this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus !== undefined) || this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== '0') ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) + ',' + String(transactionStatus.RELEASED) : "-1",
            ncoareporttypecode: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) || -1,
            napprovalconfigcode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
            napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode : -1,
            userinfo: this.props.Login.userInfo,
            ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
            isneedsection: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
            needExtraKeys: true


        }

        let inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "FilterName",
            inputData: inputData,
            operation: this.props.Login.operation,
        };
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
            && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
            && inputData.ncoareporttypecode !== -1) {

            // if (showEsign(this.props.Login.userRoleControlRights,this.props.Login.userInfo.nformcode,filterNameId)) {
            //   const updateInfo = {
            //     typeName: DEFAULT_RETURN,
            //     data: {
            //       openModal:true,
            //       modalShow: false,
            //       loadEsign: true,
            //       screenData: { inputParam, masterData },
            //     },
            //   };
            //   this.props.updateStore(updateInfo);
            // } else {
            this.props.crudMaster(inputParam, masterData, "modalShow");
            // }
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }
    }
    //ALPD-4878 To open the save popup of filtername,done by Dhanushya RI
    openFilterName = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { modalShow: true, operation: "create", isFilterDetail: true, modalTitle: this.props.intl.formatMessage({ id: "IDS_SAVEFILTER" }) }
        }
        this.props.updateStore(updateInfo);
    }
    //ALPD-4878-To get previously saved filter details when click the filter name,,done by Dhanushya RI
    clickFilterDetail = (value) => {
        //  if(this.props.Login.nfilternamecode!==value.nfilternamecode){
        this.searchRef.current.value = "";
        this.props.Login.change = false
        let masterData = this.props.Login.masterData
        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)

        let inputData = {
            userinfo: this.props.Login.userInfo,
            FromDate: obj.fromDate,
            ToDate: obj.toDate,
            nfilternamecode: value && value.nfilternamecode ? value.nfilternamecode : -1,
            ncoareporttypecode: this.props.Login.masterData && this.props.Login.masterData.realReportTypeValue,
            npreregno: "0",
            sampletypecode: (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode) || -1,
            regtypecode: parseInt(this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
            regsubtypecode: parseInt(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
            coareporttypecode: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) || -1,
            approvalconfigurationcode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
            napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode) : -1,
            userinfo: this.props.Login.userInfo,
            designtemplatcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
        }
        const inputParam = {
            masterData, inputData

        }
        this.props.getReleaseFilter(inputParam);
        // }
        // else{
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDFILTERALREADYLOADED" }));  
        // }
    }
    checkMandatoryFilter = (treeData, config) => {
        let ParentItem = { ...treeData };
        let mandatoryList = [];
        let treeDateList = [];
        let isFilterEmpty = false;
        let childArray = ParentItem.children1;
        this.state.DynamicReportFilterTypeItem.map(x => {
            if (x['ismandatory']) {
                mandatoryList.push(x);
            }
            if (childArray && childArray.length > 0 && childArray !== undefined) {
                for (var i = 0; i < childArray.length; i++) {
                    let childData = childArray[i]
                    if (!childData.hasOwnProperty('children1')) {
                        if (config && config.fields[childData.properties.field]['label'] === x[designProperties.VALUE] && x['ismandatory']) {
                            isFilterEmpty = true;
                            treeDateList.push(childData.properties.field);
                        }
                    } else {
                        if (childData) {
                            ParentItem = checkFilterIsEmptyQueryBuilder(childData)
                            if (!ParentItem) {
                                return ParentItem;
                            }
                        }
                    }
                }
            }
        })
        let uniqueSet = new Set(treeDateList);
        let uniqueArray = Array.from(uniqueSet);
        if (uniqueArray.length !== mandatoryList.length) {
            isFilterEmpty = false;
        }
        if (mandatoryList.length === 0) {
            isFilterEmpty = true;
        }
        return isFilterEmpty;
    }


    openFilterQuery = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal: true, FilterQueryBuilder: true, screenName: "IDS_SAMPLEFILTER", screenNameCopy: this.props.Login.screenNameCopy
            },
        };
        this.props.updateStore(updateInfo);
    }
    closeModalShow = () => {
        let loadEsign = this.props.Login.loadEsign;
        let closeModal = true;
        let modalShow = this.props.Login.modalShow;
        let ReportmodalShow = this.props.Login.ReportmodalShow;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedComment = this.props.Login.masterData.selectedComment;
        let isFilterDetail = this.props.Login.isFilterDetail

        if (this.props.Login.loadEsign) {
            loadEsign = false;
        } else {
            isFilterDetail = false;
            modalShow = false;
            ReportmodalShow = false;
            selectedRecord = {};
            selectedComment = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { modalShow, selectedRecord, selectedId: null, loadEsign, closeModal, selectedComment, ReportmodalShow, isFilterDetail },
        };
        this.props.updateStore(updateInfo);
    };

    generatereport = (generateid) => {
        // if(this.props.Login.masterData.selectedReleaseHistory.ntransactionstatus!==transactionStatus.DRAFT){
        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)

        const inputParam = {
            inputData: {
                syncaction: "ManualSyncreport",
                userInfo: this.props.Login.userInfo
            },
            screenName: this.props.intl.formatMessage({ id: "IDS_GENERATE" })

        }
        this.props.generatereport(inputParam, this.props.Login.masterData, inputParam.screenName)
        //   }else{
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRELEASEDRECORD" }));
        //    }
    }



    downloadHistory = (downloadReportId) => {
        if (this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 1) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MULTISELECTAPPLICABLEONLYFORRELEASEACTION" }));
        } else {
            if (this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus === transactionStatus.RELEASED) {
                let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)

                const inputParam = {
                    inputData: {
                        // change: this.props.Login.change,
                        // npreregno: this.props.Login.masterData.selectedReleaseHistory.spreregno,
                        ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode,
                        //ntransactionsamplecode: this.props.Login.masterData.selectedReleaseHistory.stransactionsamplecode,
                        //ntransactiontestcode: this.props.Login.masterData.selectedReleaseHistory.stransactiontestcode,
                        //ncoareporthistorycode:filedata.inputData.ncoareporthistorycode,
                        //ntransactionstatus: String(transactionStatus.RELEASED),
                        //nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,

                        // napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
                        // napproveconfversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
                        // nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                        // nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        action: "Download",
                        doAction: "preview",
                        // ALPD-4091 (16-05-2024) Changed DesignTemplateMappingValue to realDesignTemplateMappingValue
                        ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
                        //openModal:true,
                        userInfo: this.props.Login.userInfo,
                        ncontrolCode: downloadReportId
                    },
                    screenName: this.props.intl.formatMessage({ id: "IDS_DOWNLOAD" })

                }
                this.props.downloadHistory(inputParam, this.props.Login.masterData, inputParam.screenName)
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRELEASEDRECORD" }));
            }
        }
    }


    previewReport = (previewId) => {
        if (this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 1) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MULTISELECTAPPLICABLEONLYFORRELEASEACTION" }));
        } else {
            if (this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus !== transactionStatus.RELEASED) {
                let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
                const inputParam = {
                    // ALPD-4091 (16-05-2024) Changed FilterStatusValue to realFilterStatusValue
                    // ALPD-4091 (16-05-2024) Changed ApprovalVersionValue to realApprovalVersionValue
                    // ALPD-4091 (16-05-2024) Changed ndesigntemplatemappingcode to realDesignTemplateMappingValue
                    inputData: {
                        nflag: 2,
                        change: this.props.Login.change,
                        ncontrolcode: previewId,
                        ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode,
                        npreregno: this.props.Login.masterData.selectedReleaseHistory[0].spreregno,
                        ntransactionsamplecode: this.props.Login.masterData.selectedReleaseHistory[0].stransactionsamplecode,
                        ntransactiontestcode: this.props.Login.masterData.selectedReleaseHistory[0].stransactiontestcode,
                        url: this.props.Login.settings[24],
                        nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                        ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode,
                        ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus),
                        nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                        userinfo: this.props.Login.userInfo,
                        nprimarykey: this.props.Login.masterData.selectedReleaseHistory[0].spreregno,
                        ncoareporttypecode: this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
                        isneedsection: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
                        nreporttypecode: REPORTTYPE.COAPREVIEW,
                        sprimarykeyname: "npreregno",
                        napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                        napproveconfversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                        nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                        nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        userinfo: this.props.Login.userInfo,
                        action: 'DOWNLOADFILE',
                        ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
                        doAction: "download",
                        nprojectcode: (this.props.Login.masterData.ReleasedSampleDetails[0].nprojectmastercode && this.props.Login.masterData.ReleasedSampleDetails[0].nprojectmastercode) || -1,
                        reportSectionCode: this.props.Login.masterData.reportSectionCode ? this.props.Login.masterData.reportSectionCode : -1,
                        isSMTLFlow: parseInt(this.props.Login.settings[29]),
                        generateReport: this.props.Login.settings[64] && parseInt(this.props.Login.settings[64]) === transactionStatus.YES ? true : false,

                        newTabReport: this.props.Login.settings[70] && parseInt(this.props.Login.settings[70]) === transactionStatus.YES ? true : false,  //Added by sonia on 18-08-2024 for JIRA ID:4716                         //Added by Neeraj on 17-06-2024 for JIRA ID:4291  UUID Name or Report Ref NO.
                        reportRefFileName: parseInt(this.props.Login.settings && this.props.Login.settings[63]),
                        auditAction: "preview"
                    },
                    userinfo: this.props.Login.userInfo,
                    screenName: this.props.intl.formatMessage({ id: "IDS_PREVIEWREPORT" })
                }
                const masterData = this.props.Login.masterData;
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, previewId)) {

                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            openModal: true,
                            modalShow: false,
                            loadEsign: true,
                            screenData: { inputParam, masterData },
                            screenName: inputParam.screenName,
                            ncontrolcode: previewId,
                            operation: "download"
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.previewAndFinalReport(inputParam, this.props.Login.masterData, inputParam.screenName)

                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_FINALREPORTGEN" }));
            }
        }
    }
    preliminaryReport = (preliminaryId) => {
        if (this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 1) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MULTISELECTAPPLICABLEONLYFORRELEASEACTION" }));
        } else {
            if (this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus === transactionStatus.DRAFT ||
                this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus === transactionStatus.CORRECTION) {
                let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
                const inputParam = {
                    // ALPD-4091 (16-05-2024) Changed FilterStatusValue to realFilterStatusValue
                    // ALPD-4091 (16-05-2024) Changed ApprovalVersionValue to realApprovalVersionValue
                    // ALPD-4091 (16-05-2024) Changed ndesigntemplatemappingcode to realDesignTemplateMappingValue

                    inputData: {
                        nflag: 2,
                        change: this.props.Login.change,
                        ncontrolcode: preliminaryId,
                        ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode,
                        npreregno: this.props.Login.masterData.selectedReleaseHistory[0].spreregno,
                        ntransactionsamplecode: this.props.Login.masterData.selectedReleaseHistory[0].stransactionsamplecode,
                        ntransactiontestcode: this.props.Login.masterData.selectedReleaseHistory[0].stransactiontestcode,
                        url: this.props.Login.settings[24],
                        nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                        ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode,
                        ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus),
                        nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                        userinfo: this.props.Login.userInfo,
                        nprimarykey: this.props.Login.masterData.selectedReleaseHistory[0].spreregno,
                        ncoareporttypecode: this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
                        isneedsection: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
                        nreporttypecode: REPORTTYPE.COAPRELIMINARY,
                        sprimarykeyname: "npreregno",
                        napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                        napproveconfversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                        nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                        nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        userinfo: this.props.Login.userInfo,
                        action: 'preliminary',
                        ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
                        doAction: "preliminary",
                        nprojectcode: (this.props.Login.masterData.ReleasedSampleDetails[0].nprojectmastercode && this.props.Login.masterData.ReleasedSampleDetails[0].nprojectmastercode) || -1,
                        reportSectionCode: this.props.Login.masterData.reportSectionCode ? this.props.Login.masterData.reportSectionCode : -1,
                        isPreliminaryReportNoGenerate: this.props.Login.settings && this.props.Login.settings[47] ? parseInt(this.props.Login.settings[47]) : transactionStatus.NO,
                        ncoaparenttranscode: this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus,
                        isSMTLFlow: parseInt(this.props.Login.settings[29]),
                        generateReport: this.props.Login.settings[64] && parseInt(this.props.Login.settings[64]) === transactionStatus.YES ? true : false,

                        newTabReport: this.props.Login.settings[70] && parseInt(this.props.Login.settings[70]) === transactionStatus.YES ? true : false,  //Added by sonia on 18-08-2024 for JIRA ID:4716 
                        //Added by Neeraj on 17-06-2024 for JIRA ID:4291  UUID Name or Report Ref NO.
                        reportRefFileName: parseInt(this.props.Login.settings && this.props.Login.settings[63]),
                        auditAction: "preliminary"

                    },
                    userinfo: this.props.Login.userInfo,
                    screenName: this.props.intl.formatMessage({ id: "IDS_PRELIMINARYREPORT" }),
                    searchRef: this.searchRef   // ALPD-4229 (30-05-2024) Added searchRef to clear search text
                }
                const masterData = this.props.Login.masterData;
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, preliminaryId)) {

                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            openModal: true,
                            modalShow: false,
                            loadEsign: true,
                            screenData: { inputParam, masterData },
                            screenName: inputParam.screenName,
                            ncontrolcode: preliminaryId,
                            operation: "preliminary"
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.preliminaryReport(inputParam, this.props.Login.masterData, inputParam.screenName)

                }
            } else {
                let toastAlert = this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTCORRECTEDRECORDTO" }) + " " + (this.props.Login.genericLabel && this.props.Login.genericLabel["PreliminaryReport"] ?
                    this.props.Login.genericLabel["PreliminaryReport"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode]
                    : this.props.intl.formatMessage({ id: "IDS_PRELIMINARYREPORT" }));
                toast.warn(toastAlert);
            }
        }
    }
    // previewReport = (previewId) => {

    //     let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
    //     const inputParam = {
    //         inputData: {
    //             nflag: 2,
    //             change: this.props.Login.change,
    //             ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory.ncoaparentcode,
    //             npreregno: this.props.Login.masterData.selectedReleaseHistory.spreregno,
    //             ntransactionsamplecode: this.props.Login.masterData.selectedReleaseHistory.stransactionsamplecode,
    //             ntransactiontestcode: this.props.Login.masterData.selectedReleaseHistory.stransactiontestcode,
    //             url: this.props.Login.settings[24],
    //             nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
    //             ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode,
    //             ntransactionstatus: String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus),
    //             nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
    //             nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
    //             nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
    //             userinfo: this.props.Login.userInfo,

    //             nprimarykey: this.props.Login.masterData.selectedReleaseHistory.spreregno,
    //             ncoareporttypecode: this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
    //             nreporttypecode: REPORTTYPE.COAREPORT,
    //             sprimarykeyname: "npreregno",
    //             napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
    //             napproveconfversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
    //             nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
    //             nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
    //             dfrom: obj.fromDate,
    //             dto: obj.toDate,
    //             userinfo: this.props.Login.userInfo,
    //             action: 'DOWNLOADFILE',
    //             ndesigntemplatemappingcode: (this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode) || -1,
    //             doAction: "download",

    //         },
    //         userinfo: this.props.Login.userInfo,
    //         screenName: this.props.intl.formatMessage({ id: "IDS_PREVIEWREPORT" })
    //     }
    //     const masterData = this.props.Login.masterData;
    //     if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, previewId)) {

    //         const updateInfo = {
    //             typeName: DEFAULT_RETURN,
    //             data: {
    //                 openModal: true,
    //                 modalShow: false,
    //                 loadEsign: true,
    //                 screenData: { inputParam, masterData },
    //                 screenName: inputParam.screenName,
    //             }
    //         }
    //         this.props.updateStore(updateInfo);
    //     }
    //     else {
    //         this.props.previewAndFinalReport(inputParam, this.props.Login.masterData, inputParam.screenName)
    //                     const updateInfo = {
    //                         typeName: DEFAULT_RETURN,
    //                         data: {
    //                             openModal:true,
    //                             modalShow: false,
    //                             loadEsign: true,
    //                             screenData: { inputParam, masterData },
    //                             screenName: inputParam.screenName,
    //                         }
    //                     }
    //                     this.props.updateStore(updateInfo);
    //                 }
    //                 else {
    //                     this.props.previewAndFinalReport(inputParam, this.props.Login.masterData,inputParam.screenName)

    //                     const updateInfo = {
    //                         typeName: DEFAULT_RETURN,
    //                         data: {
    //                             openModal:true,
    //                             modalShow: false,
    //                             loadEsign: true,
    //                             screenData: { inputParam, masterData },
    //                             screenName: inputParam.screenName,
    //                             ncontrolcode:previewId
    //                         }
    //                     }
    //                     this.props.updateStore(updateInfo);
    //                 }
    //                 else {
    //                     this.props.previewAndFinalReport(inputParam, this.props.Login.masterData,inputParam.screenName)

    //     }
    // }

    downloadReleasedValidation = (downloadId) => {
        // ALPD-4118 (15-05-2024) Added code for selection issue when release and edit report template
        const ncoaParentCode = this.props.Login.masterData.ncoaparentcode.split(",");
        let selectedReleaseHistory = [];
        this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory &&
            this.props.Login.masterData.selectedReleaseHistory.map(item => ncoaParentCode.includes(item.ncoaparentcode.toString()) && selectedReleaseHistory.push(item));
        // const selectedReleaseHistory = this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory ? this.props.Login.masterData.selectedReleaseHistory.filter(item => item.ncoaparentcode === this.props.Login.masterData.ncoaparentcode) : [];
        const resultArray = selectedReleaseHistory.length > 0 ? [...new Set(selectedReleaseHistory.map(item => item["ntransactionstatus"]))] : [];
        const versionCheck = selectedReleaseHistory.length > 0 ? [...new Set(selectedReleaseHistory.map(item => item["nversionno"]))] : [];
        const reportTemplateCheck = selectedReleaseHistory.length > 0 ? [...new Set(selectedReleaseHistory.map(item => item["nreporttemplatecode"]))] : [];
        if (resultArray.length === 1) {
            if (reportTemplateCheck.length === 1) {
                if (resultArray[0] === transactionStatus.CORRECTION || (resultArray[0] === transactionStatus.PRELIMINARYRELEASE && (versionCheck.length > 1 || (versionCheck.length === 1 && versionCheck[0] !== -1)))) {
                    this.CorrectionComments(downloadId, selectedReleaseHistory);
                } else {
                    this.downloadReleasedFile(downloadId);
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRECORDSWITHSAMEREPORTEMPLATE" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRECORDSWITHSAMESTATUS" }));
        }
    }

    CorrectionComments = (controlId, selectedReleaseHistory) => {
        let masterData = this.props.Login.masterData;
        masterData["selectedReleaseHistory"] = selectedReleaseHistory;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadEsign: false,
                screenData: { masterData },
                operation: this.props.Login.operation,
                openModal: true,
                screenName: this.props.intl.formatMessage({ id: "IDS_CORRECTIONCOMMENTS" }),
            }
        }
        this.props.updateStore(updateInfo);
    }

    downloadReleasedFile = () => {
        // ALPD-4118 (15-05-2024) Added code for selection issue when release and edit report template
        const ncoaParentCode = this.props.Login.masterData.ncoaparentcode.split(",");
        let selectedReleaseHistory = [];
        this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory &&
            this.props.Login.masterData.selectedReleaseHistory.map(item => ncoaParentCode.includes(item.ncoaparentcode.toString()) && selectedReleaseHistory.push(item));

        const downloadId = this.state.controlMap.has("ReleaseReportGeneration") && this.state.controlMap.get("ReleaseReportGeneration").ncontrolcode;
        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
        const inputParam = {
            // ALPD-4091 (16-05-2024) Changed FilterStatusValue to realFilterStatusValue
            // ALPD-4091 (16-05-2024) Changed ApprovalVersionValue to realApprovalVersionValue
            // ALPD-4091 (16-05-2024) Changed ndesigntemplatemappingcode to realDesignTemplateMappingValue
            inputData: {
                change: this.props.Login.change,
                ncontrolcode: downloadId,
                ncoaparentcode: selectedReleaseHistory.length > 0 ? selectedReleaseHistory.map(item => item.ncoaparentcode).sort().join(",") : "-1",
                // npreregno: this.props.Login.masterData.selectedReleaseHistory.spreregno,
                npreregno: selectedReleaseHistory.length > 0 ? selectedReleaseHistory.map(item => item.spreregno).join(",") : "-1",
                // ntransactionsamplecode: this.props.Login.masterData.selectedReleaseHistory.stransactionsamplecode,
                ntransactionsamplecode: selectedReleaseHistory.length > 0 ? selectedReleaseHistory.map(item => item.stransactionsamplecode).join(",") : "-1",
                // ntransactiontestcode: this.props.Login.masterData.selectedReleaseHistory.stransactiontestcode,
                ntransactiontestcode: selectedReleaseHistory.length > 0 ? selectedReleaseHistory.map(item => item.stransactiontestcode).join(",") : "-1",
                url: this.props.Login.settings[24],
                nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                // ntransactionsamplecode: ntransactionsamplecode,
                //ntransactiontestcode: ntransactiontestcode,
                ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode,
                // nTransStatus: ntransCode,
                // ntransactionstatus: ((this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus 
                //     !== undefined) || this.props.Login.masterData.realFilterStatusValue.ntransactionstatus !== '0')
                //      ? String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) : "-1",
                // ntransactionstatus: String(transactionStatus.RELEASED),
                ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus),
                nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                nportalrequired: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nportalrequired,
                nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                nclinicaltyperequired: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nclinicaltyperequired,
                noutsourcerequired: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.noutsourcerequired,
                napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                dfrom: obj.fromDate,
                dto: obj.toDate,
                userinfo: this.props.Login.userInfo,
                // retestcount: action.ntransactionstatus === transactionStatus.RETEST ? this.state.selectedRecord ? this.state.selectedRecord.retestcount || 1 : 1 : undefined,
                // ncontrolCode,
                nprimarykey: selectedReleaseHistory.length > 0 ? selectedReleaseHistory.map(item => item.spreregno).join(",") : "-1",
                listStatus: selectedReleaseHistory[0].ntransactionstatus,
                ncoareporttypecode: this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
                isneedsection: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
                nreporttypecode: REPORTTYPE.COAREPORT,
                sprimarykeyname: "npreregno",
                // nsectioncode: -1,
                sreportcomments: this.state.selectedRecord && this.state.selectedRecord.sreportcomments ? this.state.selectedRecord.sreportcomments : "",
                nversionno: this.props.Login.masterData.nversionno && this.props.Login.masterData.nversionno ? this.props.Login.masterData.nversionno : 0,
                action: "Generatefile",
                doAction: "generate",
                nflag: 2,
                ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
                nprojectcode: this.props.Login.masterData.ReleasedSampleDetails[0].nprojectmastercode && this.props.Login.masterData.ReleasedSampleDetails[0].nprojectmastercode,
                reportSectionCode: this.props.Login.masterData.reportSectionCode ? this.props.Login.masterData.reportSectionCode : -1,
                isSMTLFlow: parseInt(this.props.Login.settings[29]),
                ReleasedSampleDetails: this.props.Login.masterData.ReleasedSampleDetails,
                confirmMessage: this.confirmMessage,
                isPreliminaryReportNoGenerate: this.props.Login.settings && this.props.Login.settings[47] ? parseInt(this.props.Login.settings[47]) : transactionStatus.NO,
                ncoaparenttranscode: selectedReleaseHistory[0].ntransactionstatus,
                genericLabel: this.props.Login.genericLabel,
                generateReport: this.props.Login.settings[64] && parseInt(this.props.Login.settings[64]) === transactionStatus.YES ? true : false,  //Added by sonia on 18-08-2024 for JIRA ID:4716 
                newTabReport: this.props.Login.settings[70] && parseInt(this.props.Login.settings[70]) === transactionStatus.YES ? true : false, //Added by sonia on 18-08-2024 for JIRA ID:4716 
                //Added by Neeraj on 17-06-2024 for JIRA ID:4291  UUID Name or Report Ref NO.
                reportRefFileName: parseInt(this.props.Login.settings && this.props.Login.settings[63]),
                auditAction: "release"
            },
            userinfo: this.props.Login.userInfo,
            methodUrl: "ReleaseAfterCorrection",
            classUrl: "release",
            operation: "update",
            screenName: this.props.intl.formatMessage({ id: "IDS_GENERATEFILE" })

        }

        const masterData = this.props.Login.masterData;
        // if (this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.ntransactionstatus === transactionStatus.CORRECTION
        //              && this.state.selectedRecord && this.state.selectedRecord.sreportcomments==="" || this.state.selectedRecord.sreportcomments===undefined) {
        //                 toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERDESCRIPTION" }));  

        // }
        //     else{
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, downloadId)) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    ncontrolcode: downloadId,
                    openModal: true,
                    modalShow: false,
                    loadEsign: true,
                    screenData: { inputParam, masterData },
                    operation: inputParam.operation,
                    screenName: selectedReleaseHistory.length > 0 &&
                        selectedReleaseHistory[0].ntransactionstatus === transactionStatus.CORRECTION ? this.props.Login.screenName :
                        this.props.intl.formatMessage({ id: "IDS_GENERATEFILE" })
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.generateReleasedReport(inputParam.inputData, this.props.Login.masterData, inputParam.screenName)

        }
        // }
    }

    reportcomments = () => {
        if (this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 1) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MULTISELECTAPPLICABLEONLYFORRELEASEACTION" }));
        } else {
            let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
            if (this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus !== transactionStatus.RELEASED
                && this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus !== transactionStatus.PRELIMINARYRELEASE) {
                const inputParam = {
                    // ALPD-4091 (16-05-2024) Changed FilterStatusValue to realFilterStatusValue
                    // ALPD-4091 (16-05-2024) Changed ApprovalVersionValue to realApprovalVersionValue
                    // ALPD-4091 (16-05-2024) Changed ndesigntemplatemappingcode to realDesignTemplateMappingValue
                    inputData: {
                        change: this.props.Login.change,
                        ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode,
                        npreregno: this.props.Login.masterData.selectedReleaseHistory[0].spreregno,
                        ntransactionsamplecode: this.props.Login.masterData.selectedReleaseHistory[0].stransactionsamplecode,
                        ntransactiontestcode: this.props.Login.masterData.selectedReleaseHistory[0].stransactiontestcode,
                        url: this.props.Login.settings[24],
                        nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                        // ntransactionsamplecode: ntransactionsamplecode,
                        //ntransactiontestcode: ntransactiontestcode,
                        ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode,
                        // nTransStatus: ntransCode,
                        // ntransactionstatus: ((this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus 
                        //     !== undefined) || this.props.Login.masterData.realFilterStatusValue.ntransactionstatus !== '0')
                        //      ? String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) : "-1",
                        // ntransactionstatus: String(transactionStatus.RELEASED),
                        ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus),
                        nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                        nclinicaltyperequired: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nclinicaltyperequired,
                        napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                        nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                        nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        userinfo: this.props.Login.userInfo,
                        // retestcount: action.ntransactionstatus === transactionStatus.RETEST ? this.state.selectedRecord ? this.state.selectedRecord.retestcount || 1 : 1 : undefined,
                        // ncontrolCode,
                        nprimarykey: this.props.Login.masterData.selectedReleaseHistory[0].spreregno,
                        ncoareporttypecode: this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
                        isneedsection: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
                        nreporttypecode: REPORTTYPE.COAREPORT,
                        sprimarykeyname: "npreregno",
                        // nsectioncode: -1,
                        nflag: 2,
                        ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1
                    },
                    userinfo: this.props.Login.userInfo
                }
                this.props.getreportcomments(inputParam.inputData, this.props.Login.masterData)
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTCORRECTEDRECORDTOEDITREPORTCOMMENTS" }));
            }
        }
    }

    // regenerateReleasedFile = (action) => {
    regenerateReleasedFile = (regenerateId) => {
        if (this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 1) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MULTISELECTAPPLICABLEONLYFORRELEASEACTION" }));
        } else {
            let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)

            const inputParam = {
                // ALPD-4091 (16-05-2024) Changed ApprovalVersionValue to realApprovalVersionValue
                // ALPD-4091 (16-05-2024) Changed ndesigntemplatemappingcode to realDesignTemplateMappingValue
                inputData: {
                    change: this.props.Login.change,
                    npreregno: this.props.Login.masterData.selectedReleaseHistory[0].spreregno,
                    ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode,
                    ntransactionsamplecode: this.props.Login.masterData.selectedReleaseHistory[0].stransactionsamplecode,
                    ntransactiontestcode: this.props.Login.masterData.selectedReleaseHistory[0].stransactiontestcode,
                    sreportno: this.props.Login.masterData.selectedReleaseHistory[0].sreportno,
                    ReleasedSampleDetails: this.props.Login.masterData.ReleasedSampleDetails,
                    ntransactionstatus: String(transactionStatus.RELEASED),
                    nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                    noutsourcerequired: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.noutsourcerequired,
                    napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                    napproveconfversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                    nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                    nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                    dfrom: obj.fromDate,
                    dto: obj.toDate,
                    nflag: 2,
                    userinfo: this.props.Login.userInfo,
                    sreportcomments: "",
                    nprimarykey: this.props.Login.masterData.selectedReleaseHistory[0].spreregno,
                    ncoareporttypecode: this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
                    isneedsection: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
                    nreporttypecode: REPORTTYPE.COAREPORT,
                    sprimarykeyname: "npreregno",
                    action: "Regenerate",
                    doAction: "download",
                    ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
                    ncontrolcode: regenerateId,
                    nprojectcode: (this.props.Login.masterData.ReleasedSampleDetails[0].nprojectmastercode && this.props.Login.masterData.ReleasedSampleDetails[0].nprojectmastercode) || -1,
                    reportSectionCode: this.props.Login.masterData.reportSectionCode ? this.props.Login.masterData.reportSectionCode : -1,
                    ncoaparenttranscode: this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 0
                        && this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus,
                    isSMTLFlow: parseInt(this.props.Login.settings[29]),

                    generateReport: this.props.Login.settings[64] && parseInt(this.props.Login.settings[64]) === transactionStatus.YES ? true : false,

                    newTabReport: this.props.Login.settings[70] && parseInt(this.props.Login.settings[70]) === transactionStatus.YES ? true : false,  //Added by sonia on 18-08-2024 for JIRA ID:4716 
                    //Added by Neeraj on 17-06-2024 for JIRA ID:4291  UUID Name or Report Ref NO.
                    reportRefFileName: parseInt(this.props.Login.settings && this.props.Login.settings[63]),
                    auditAction: "regenerate"
                },
                userinfo: this.props.Login.userInfo,
                screenName: this.props.intl.formatMessage({ id: "IDS_REGENERATEFILE" }),
                operation: "update"
            }
            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, regenerateId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        ncontrolcode: regenerateId,
                        openModal: true,
                        modalShow: false,
                        loadEsign: true,
                        screenData: { inputParam, masterData },
                        screenName: inputParam.screenName,
                        operation: inputParam.operation,
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.previewAndFinalReport(inputParam, this.props.Login.masterData, inputParam.screenName)
            }
        }
    }

    CorrectionStatus = (correctionId) => {
        if (this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 1) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MULTISELECTAPPLICABLEONLYFORRELEASEACTION" }));
        } else {
            let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
            // const correctionId =this.state.controlMap.has("Correction") &&this.state.controlMap.get("Correction").ncontrolcode; 
            const inputParam = {
                // ALPD-4091 (16-05-2024) Changed FilterStatusValue to realFilterStatusValue
                // ALPD-4091 (16-05-2024) Changed ApprovalVersionValue to realApprovalVersionValue
                // ALPD-4091 (16-05-2024) Changed ndesigntemplatemappingcode to realDesignTemplateMappingValue
                inputData: {
                    change: this.props.Login.change,
                    ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode,
                    npreregno: this.props.Login.masterData.selectedReleaseHistory[0].spreregno,
                    ntransactionsamplecode: this.props.Login.masterData.selectedReleaseHistory[0].stransactionsamplecode,
                    ntransactiontestcode: this.props.Login.masterData.selectedReleaseHistory[0].stransactiontestcode,
                    url: this.props.Login.settings[24],
                    nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                    // ntransactionsamplecode: ntransactionsamplecode,
                    //ntransactiontestcode: ntransactiontestcode,
                    ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode,
                    // nTransStatus: ntransCode,
                    // ntransactionstatus: ((this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus 
                    //     !== undefined) || this.props.Login.masterData.realFilterStatusValue.ntransactionstatus !== '0')
                    //      ? String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) : "-1",
                    // ntransactionstatus: String(transactionStatus.RELEASED),
                    ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus),
                    nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                    nclinicaltyperequired: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nclinicaltyperequired,
                    napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                    nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                    nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                    dfrom: obj.fromDate,
                    dto: obj.toDate,
                    userinfo: this.props.Login.userInfo,
                    // retestcount: action.ntransactionstatus === transactionStatus.RETEST ? this.state.selectedRecord ? this.state.selectedRecord.retestcount || 1 : 1 : undefined,
                    // ncontrolCode,
                    nprimarykey: this.props.Login.masterData.selectedReleaseHistory[0].spreregno,
                    ncoareporttypecode: this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
                    isneedsection: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
                    nreporttypecode: REPORTTYPE.COAREPORT,
                    sprimarykeyname: "npreregno",
                    doAction: "correction",
                    nflag: 2,
                    ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
                    isPreliminaryReportNoGenerate: this.props.Login.settings && this.props.Login.settings[47] ? parseInt(this.props.Login.settings[47]) : transactionStatus.NO,
                    genericLabel: this.props.Login.genericLabel
                },
                userinfo: this.props.Login.userInfo,
                methodUrl: "CorrectionStatus",
                classUrl: "release",
                operation: "update",
                screenName: this.props.intl.formatMessage({ id: "IDS_CORRECTION" })
            }
            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, correctionId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        ncontrolcode: correctionId,
                        openModal: true,
                        modalShow: false,
                        loadEsign: true,
                        operation: "update",
                        screenData: { inputParam, masterData },
                        screenName: inputParam.screenName,
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.updateCorrectionStatus(inputParam.inputData, this.props.Login.masterData, inputParam.screenName)
            }
        }
    }
    //     CorrectionStatus = (correctionId) => {

    //         let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
    //         // const correctionId =this.state.controlMap.has("Correction") &&this.state.controlMap.get("Correction").ncontrolcode; 
    //         const inputParam = {
    //             inputData: {
    //                 change: this.props.Login.change,
    //                 ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory.ncoaparentcode,
    //                 npreregno: this.props.Login.masterData.selectedReleaseHistory.spreregno,
    //                 ntransactionsamplecode: this.props.Login.masterData.selectedReleaseHistory.stransactionsamplecode,
    //                 ntransactiontestcode: this.props.Login.masterData.selectedReleaseHistory.stransactiontestcode,
    //                 url: this.props.Login.settings[24],
    //                 nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
    //                 // ntransactionsamplecode: ntransactionsamplecode,
    //                 //ntransactiontestcode: ntransactiontestcode,

    //                 ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode,
    //                 // nTransStatus: ntransCode,
    //                 // ntransactionstatus: ((this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus 
    //                 //     !== undefined) || this.props.Login.masterData.realFilterStatusValue.ntransactionstatus !== '0')
    //                 //      ? String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) : "-1",

    //                 // ntransactionstatus: String(transactionStatus.RELEASED),
    //                 ntransactionstatus: String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus),
    //                 nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
    //                 nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
    //                 nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
    //                 nclinicaltyperequired: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nclinicaltyperequired,
    //                 napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
    //                 nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
    //                 nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
    //                 dfrom: obj.fromDate,
    //                 dto: obj.toDate,
    //                 userinfo: this.props.Login.userInfo,
    //                 // retestcount: action.ntransactionstatus === transactionStatus.RETEST ? this.state.selectedRecord ? this.state.selectedRecord.retestcount || 1 : 1 : undefined,
    //                 // ncontrolCode,
    //                 nprimarykey: this.props.Login.masterData.selectedReleaseHistory.spreregno,
    //                 ncoareporttypecode: this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
    //                 nreporttypecode: REPORTTYPE.COAREPORT,
    //                 sprimarykeyname: "npreregno",
    //                 doAction: "correction",
    //                 nflag: 2,
    //                 ndesigntemplatemappingcode: (this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode) || -1
    //             },
    //             userinfo: this.props.Login.userInfo,
    //             methodUrl: "CorrectionStatus",
    //             classUrl: "release",
    //             operation: "update",
    //             screenName: this.props.intl.formatMessage({ id: "IDS_CORRECTION" })
    //         }
    //         const masterData = this.props.Login.masterData;
    //         if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, correctionId)) {

    // <<<<<<< .mine
    //             const updateInfo = {
    //                 typeName: DEFAULT_RETURN,
    //                 data: {
    //                     ncontrolcode: correctionId,
    //                     openModal: true,
    //                     modalShow: false,
    //                     loadEsign: true,
    //                     screenData: { inputParam, masterData },
    //                     screenName: inputParam.screenName,
    //                 }
    //             }
    //             this.props.updateStore(updateInfo);
    //         }
    //         else {
    //             this.props.updateCorrectionStatus(inputParam.inputData, this.props.Login.masterData, inputParam.screenName)
    // ||||||| .r76787
    //                         const updateInfo = {
    //                             typeName: DEFAULT_RETURN,
    //                             data: {
    //                                 ncontrolcode:correctionId,
    //                                 openModal:true,
    //                                 modalShow: false,
    //                                 loadEsign: true,
    //                                 screenData: { inputParam, masterData },
    //                                 screenName: inputParam.screenName,
    //                             }
    //                         }
    //                         this.props.updateStore(updateInfo);
    //                     }
    //                     else {
    //                         this.props.updateCorrectionStatus(inputParam.inputData, this.props.Login.masterData,inputParam.screenName)
    // =======
    //                         const updateInfo = {
    //                             typeName: DEFAULT_RETURN,
    //                             data: {
    //                                 ncontrolcode:correctionId,
    //                                 openModal:true,
    //                                 modalShow: false,
    //                                 loadEsign: true,
    //                                 operation: "update",
    //                                 screenData: { inputParam, masterData },
    //                                 screenName: inputParam.screenName,
    //                             }
    //                         }
    //                         this.props.updateStore(updateInfo);
    //                     }
    //                     else {
    //                         this.props.updateCorrectionStatus(inputParam.inputData, this.props.Login.masterData,inputParam.screenName)
    // >>>>>>> .r76792

    //         }



    //     }
    onSaveModalResultClick = (saveType, data) => {
        if (this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_REPORTTEMPLATE" })) {
            //ALPD-5568 Release & report --> In specific scenario When save the empty report template 500 occurs.
            if(this.state.selectedRecord && this.state.selectedRecord.nreporttemplatecode && this.state.selectedRecord.nreporttemplatecode.value!=null)
            {
            let masterData = this.props.Login.masterData;
            let controlId = this.state.controlMap.has("EditReportTemplate") && this.state.controlMap.get("EditReportTemplate").ncontrolcode;
            let inputParam = {
                inputData: {
                    ncoaparentcode: this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 0 ?
                        this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode : -1,
                    nreporttemplatecode: this.state.selectedRecord && this.state.selectedRecord.nreporttemplatecode && this.state.selectedRecord.nreporttemplatecode.value,
                    sreporttemplatename: this.state.selectedRecord && this.state.selectedRecord.nreporttemplatecode && this.state.selectedRecord.nreporttemplatecode.label,
                    userinfo: this.props.Login.userInfo,
                    doAction: "editReportTemplate"
                },
                masterData: masterData,
                selectedRecord: this.state.selectedRecord
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, controlId)) {

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        modalShow: false,
                        openModal: true,
                        ncontrolcode: controlId,
                        screenData: { inputParam, masterData },
                        saveType
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.SaveReportTemplate(inputParam)
            }
        }
        else
        {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEMPLATE" }));
        }
        } else {
            // ALPD-4026 (18-05-2024) Removed state parameterResults value due to sent latest record. State value have old record
            let ReleaseParameter = this.props.Login.parameterResults && this.props.Login.parameterResults;
            // let selectedRecord = this.state.selectedRecord || {};
            // let selectedId = this.props.Login.selectedId || null;
            // let additionalInfo = this.state.selectedRecord.additionalInfo || [];
            const nregtypecode = parseInt(this.props.Login.masterData.realRegTypeValue.nregtypecode);
            const nregsubtypecode = parseInt(this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode);
            // ALPD-4091 (16-05-2024) Changed ndesigntemplatemappingcode to realDesignTemplateMappingValue
            const ndesigntemplatemappingcode = parseInt(this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode);
            const editResultId = this.state.controlMap.has("EditResult") && this.state.controlMap.get("EditResult").ncontrolcode;
            const classUrl = "release";
            const formData = new FormData();
            let neditable = 0;
            let releaseParameters = [];
            let inputParam = {};
            // let inputData = [];
            let i = 0;
            if (ReleaseParameter !== undefined && ReleaseParameter.length > 0 && ReleaseParameter[0].sresult !== "") {
                ReleaseParameter.map((resultData, index) => {
                    let results = {};
                    if (resultData.editable === true) {
                        neditable = 1;
                        switch (resultData.nparametertypecode) {
                            case 1:
                                results["jsondata"] = {
                                    ncalculatedresult: resultData["ncalculatedresult"],
                                    sresult: resultData.sresult,
                                    sfinal: resultData.sresult !== "" ? numberConversion(parseFloat(resultData.sresult), parseInt(resultData.nroundingdigits)) : "",
                                    //Modified by sonia on 6th Aug 2024 for JIRA ID:ALPD-4558
                                    sunitname: resultData.unitcode.label,
                                    sresultaccuracyname: resultData.resultaccuracycode.label,
                                    nresultaccuracycode: resultData.resultaccuracycode.value,
                                }
                                results["jsonstring"] = JSON.stringify(results["jsondata"]);
                                results["ncalculatedresult"] = resultData["ncalculatedresult"];
                                results["sresult"] = resultData.sresult;
                                results["sfinal"] = resultData.sresult !== "" ?
                                    numberConversion(parseFloat(resultData.sresult), parseInt(resultData.nroundingdigits)) : "";
                                results["ngradecode"] = resultData.sresult !== "" ?
                                    numericGrade(resultData, results["sfinal"]) : -1;
                                results['nenteredrole'] = this.props.Login.userInfo.nuserrole;
                                results['nenteredby'] = this.props.Login.userInfo.nusercode;
                                results['ntransactionresultcode'] = resultData.ntransactionresultcode;
                                results['ntransactiontestcode'] = resultData.ntransactiontestcode;
                                results['nparametertypecode'] = resultData.nparametertypecode;
                                results['nunitcode'] = resultData.unitcode.value;  //Modified by sonia on 6th Aug 2024 for JIRA ID:ALPD-4558


                                break;
                            case 2:
                                results["jsondata"] = {
                                    ncalculatedresult: 4,
                                    sresult: Lims_JSON_stringify(resultData.sresult, false),
                                    sfinal: Lims_JSON_stringify(resultData.sfinal, false),
                                    sresultcomment: resultData.sresultcomment === 'null' ? "-" : resultData.sresultcomment,
                                    salertmessage: resultData.salertmessage,
                                    additionalInfo: resultData['additionalInfo'],
                                    additionalInfoUidata: resultData['additionalInfoUidata'] === undefined ? "" : resultData['additionalInfoUidata'],
                                    ntestgrouptestpredefcode: resultData.ntestgrouptestpredefcode
                                }
                                results["jsonstring"] = JSON.stringify(results["jsondata"]);
                                results["sresult"] = resultData.sresult;

                                results["ncalculatedresult"] = 4;
                                results["sfinal"] = resultData.sresult;
                                results["ngradecode"] = resultData.ngradecode;
                                results['nenteredrole'] = this.props.Login.userInfo.nuserrole;
                                results['nenteredby'] = this.props.Login.userInfo.nusercode;
                                results['ntransactionresultcode'] = resultData.ntransactionresultcode;
                                results['ntransactiontestcode'] = resultData.ntransactiontestcode;
                                results['nparametertypecode'] = resultData.nparametertypecode;
                                results['nunitcode'] = resultData.nunitcode;
                                break;
                            case 3:
                                results["jsondata"] = {
                                    ncalculatedresult: 4,
                                    sresult: Lims_JSON_stringify(resultData.sresult, false),
                                    sfinal: Lims_JSON_stringify(resultData.sresult, false)
                                }
                                results["jsonstring"] = JSON.stringify(results["jsondata"]);
                                results["sresult"] = resultData.sresult;
                                results["ncalculatedresult"] = 4;
                                results["sfinal"] = resultData.sresult;
                                results["ngradecode"] = resultData.sresult.trim() === "" ? -1 : ResultEntry.RESULTSTATUS_FIO;
                                results['nenteredrole'] = this.props.Login.userInfo.nuserrole;
                                results['nenteredby'] = this.props.Login.userInfo.nusercode;
                                results['ntransactionresultcode'] = resultData.ntransactionresultcode;
                                results['ntransactiontestcode'] = resultData.ntransactiontestcode;
                                results['nparametertypecode'] = resultData.nparametertypecode;
                                results['nunitcode'] = resultData.nunitcode;
                                break;
                            case 4:
                                if (resultData.sfinal.length > 0) {
                                    const splittedFileName = resultData.sfinal ? resultData.sfinal[0] && resultData.sfinal[0].name.split('.') : "";
                                    const fileExtension = resultData.sfinal ? resultData.sfinal[0] && resultData.sfinal[0].name.split('.')[splittedFileName.length - 1] : "";
                                    const uniquefilename = create_UUID() + '.' + fileExtension;
                                    results["jsondata"] = {
                                        ssystemfilename: uniquefilename,
                                        nfilesize: resultData.sfinal[0] && resultData.sfinal[0].size,
                                        ncalculatedresult: 4,
                                        sresult: Lims_JSON_stringify(resultData.sresult, false),
                                        sfinal: Lims_JSON_stringify(resultData.sresult, false)
                                    }
                                    results["jsonstring"] = JSON.stringify(results["jsondata"]);
                                    results["ncalculatedresult"] = 4;
                                    results["sresult"] = resultData.sresult;
                                    results["sfinal"] = resultData.sresult;
                                    results["ngradecode"] = resultData.sresult.trim() === "" ? -1 : ResultEntry.RESULTSTATUS_FIO;
                                    results["nenteredrole"] = this.props.Login.userInfo.nuserrole;
                                    results["nenteredby"] = this.props.Login.userInfo.nusercode;
                                    results["ntransactionresultcode"] = resultData.ntransactionresultcode;
                                    results["ntransactiontestcode"] = resultData.ntransactiontestcode;
                                    results['nparametertypecode'] = resultData.nparametertypecode;
                                    results["ssystemfilename"] = uniquefilename;
                                    results["nfilesize"] = resultData.sfinal[0] && resultData.sfinal[0].size;
                                    results['nunitcode'] = resultData.nunitcode;
                                    formData.append("uploadedFile" + index, resultData.sfinal[0] && resultData.sfinal[0]);
                                    formData.append("uniquefilename" + index, uniquefilename);
                                    formData.append("ntransactiontestcode", resultData.ntransactiontestcode);
                                    i++;
                                }
                                else {
                                    const splittedFileName = resultData.sfinal ? resultData.sfinal[0] && resultData.sfinal[0].name.split('.') : "";
                                    const fileExtension = resultData.sfinal ? resultData.sfinal[0] && resultData.sfinal[0].name.split('.')[splittedFileName.length - 1] : "";
                                    const uniquefilename = "";
                                    results["jsondata"] = {
                                        ssystemfilename: uniquefilename,
                                        nfilesize: resultData.sfinal ? resultData.sfinal[0] && resultData.sfinal[0].size : "",
                                        ncalculatedresult: 4,
                                        sresult: "",
                                        sfinal: ""
                                    }
                                    results["jsonstring"] = JSON.stringify(results["jsondata"]);
                                    results["ncalculatedresult"] = 4;
                                    results["sresult"] = "";
                                    results["sfinal"] = "";
                                    results["ngradecode"] = -1;
                                    results["nenteredrole"] = this.props.Login.userInfo.nuserrole;
                                    results["nenteredby"] = this.props.Login.userInfo.nusercode;
                                    results["ntransactionresultcode"] = resultData.ntransactionresultcode;
                                    results["ntransactiontestcode"] = resultData.ntransactiontestcode;
                                    results['nparametertypecode'] = resultData.nparametertypecode;
                                    results["ssystemfilename"] = "";
                                    results["nfilesize"] = "";
                                    formData.append("uploadedFile" + index, "");
                                    formData.append("uniquefilename" + index, "");
                                    formData.append("ntransactiontestcode", "");
                                }
                                break;
                            default:
                                break;
                        }
                        if (Object.values(results).length > 0) {
                            releaseParameters.push(results);
                        }
                    }
                    return null;
                });

                if (neditable === 0) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        // ALPD-4026 (18-05-2024) Added modalShow as false and commented openModal: false because of not closing the result correction data grid
                        data: {
                            loading: false,
                            // openModal: false, 
                            modalShow: false, parameterResults: [], selectedRecord: {}
                        }
                    }
                    return this.props.updateStore(updateInfo);
                }

                formData.append("filecount", i);
                formData.append("nregtypecode", nregtypecode);
                formData.append("nregsubtypecode", nregsubtypecode);
                formData.append("ncoaparentcode", this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode);
                formData.append("ncontrolcode", this.props.Login.ncontrolcode);
                formData.append("ndesigntemplatemappingcode", ndesigntemplatemappingcode);
                formData.append("resultData", JSON.stringify(releaseParameters));

                inputParam = {
                    classUrl: classUrl,
                    methodUrl: "ReleaseParameter",
                    inputData: { userinfo: this.props.Login.userInfo, doAction: "editresult" },
                    formData: formData,
                    isFileupload: true,
                    operation: "update",
                    displayName: this.props.Login.inputParam.displayName, saveType//, postParam
                }

                const masterData = this.props.Login.masterData;
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, editResultId)) {

                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true,
                            modalShow: false,
                            openModal: true,
                            ncontrolcode: editResultId,
                            screenData: { inputParam, masterData }, saveType
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {

                    this.props.crudMaster(inputParam, this.props.Login.masterData, "modalShow");
                }
            }
            // else {
            //     const updateInfo = {
            //         typeName: DEFAULT_RETURN,
            //         data: { loading: false, openModal: false }
            //     }
            //     return this.props.updateStore(updateInfo);
            // }
            else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERRESULT" }));
            }
        }
    }

    onSaveModalClick = () => {
        //if(this.props.Login.masterData.selectedComment && this.props.Login.masterData.selectedComment !==0)
        if (this.props.Login.screenName === "IDS_REPORTINFOCOMMENTS") {
            this.props.UpdateReportComments(this.props.Login.userInfo, this.props.Login.masterData)
        }
        else {
            let ntransactionsamplecode = ""
            let ntransactiontestcode = ""
            let npreregno = ""
            let seletedRecord = this.state.selectedRecord;
            if (this.props.Login.masterData.ReleaseSample && this.props.Login.masterData.ReleaseSample.length !== 0) {
                if (this.state.npreregno && this.state.npreregno.length > 0) {
                    let sample = this.state.npreregno.filter((c, index) => {
                        return this.state.npreregno.indexOf(c) === index;
                    });
                    let subsample = this.state.ntransactionsamplecode.filter((c, index) => {
                        return this.state.ntransactionsamplecode.indexOf(c) === index;
                    });
                    let test = this.state.ntransactiontestcode.filter((c, index) => {
                        return this.state.ntransactiontestcode.indexOf(c) === index;
                    });

                    npreregno = sample.map(x => x).join(",")
                    ntransactionsamplecode = subsample.map(x => x).join(",")
                    ntransactiontestcode = test.map(x => x).join(",")
                    let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
                    const inputParam = {
                        // ALPD-4091 (16-05-2024) Changed FilterStatusValue to realFilterStatusValue
                        // ALPD-4091 (16-05-2024) Changed ApprovalVersionValue to realApprovalVersionValue
                        // ALPD-4091 (16-05-2024) Changed ndesigntemplatemappingcode to realDesignTemplateMappingValue
                        inputData: {
                            change: this.props.Login.change,
                            npreregno: String(npreregno),
                            ntransactionsamplecode: ntransactionsamplecode,
                            ntransactiontestcode: ntransactiontestcode,
                            // ncoaparentcode: this.props.Login.isEditPopup || this.props.Login.isDeletePopup ? this.props.Login.masterData.selectedReleaseHistory
                            //     && this.props.Login.masterData.selectedReleaseHistory.ncoaparentcode:-1,
                            ncoaparentcode: this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 0
                                ? this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode : -1,
                            ncoaparenttranscode: this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 0
                                && this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus,
                            url: this.props.Login.settings[24],
                            ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus),
                            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                            ncoareporttypecode: this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
                            isneedsection: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
                            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                            napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                            nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                            nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                            dfrom: obj.fromDate,
                            dto: obj.toDate,
                            //  isPopup:true,
                            isAddPopup: false,
                            isEditPopup: false,
                            nflag: 2,
                            userinfo: this.props.Login.userInfo,
                            ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
                            doAction: this.props.Login.operation === "save" ? "saveasdraft" : this.props.Login.operation === "delete" ? "removesample" : "appendsample",
                            isSMTLFlow: parseInt(this.props.Login.settings[29]),
                            nreporttemplatecode: this.state.selectedRecord && this.state.selectedRecord.nreporttemplatecode ? this.state.selectedRecord.nreporttemplatecode.value : -1,
                            singleSampleInRelease: this.state.selectedRecord && this.state.selectedRecord.nisarnowiserelease && this.state.selectedRecord.nisarnowiserelease === transactionStatus.YES ?
                                this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.nisarnowiserelease === transactionStatus.YES ? transactionStatus.NO : transactionStatus.YES :
                                this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.nisarnowiserelease,
                            nportalrequired: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nportalrequired,
                            nismultipleproject: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.nismultipleproject) || transactionStatus.NO,
                            nprojectspecrequired: parseInt(this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nprojectspecrequired) || transactionStatus.NO, //Added by Dhanushya RI jira id-ALPD-3862 for multiple projects under single release
                            searchRef: this.searchRef   // ALPD-4229 (12-06-2024) Added searchRef to clear searched text
                        },
                        userinfo: this.props.Login.userInfo,
                        methodUrl: "Release",
                        classUrl: "release",
                        operation: this.props.Login.operation,
                        searchRef: this.searchRef  // ALPD-4229 (30-05-2024) Added searchRef to clear search text
                    }
                    if (this.props.Login.isEditPopup) {
                        inputParam.inputData['nsectioncode'] = this.props.Login.masterData && this.props.Login.masterData.realReportTypeValue.isneedsection === transactionStatus.YES ? this.props.Login.masterData && this.props.Login.masterData.reportSectionCode : -1
                        inputParam.inputData['isEditSave'] = true;
                    }
                    const masterData = this.props.Login.masterData;
                    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {

                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                loadEsign: true,
                                screenData: { inputParam, masterData, seletedRecord },
                                operation: this.props.Login.operation,
                                screenName: this.props.Login.screenName,
                                ncontrolcode: this.props.Login.ncontrolCode
                            }
                        }
                        this.props.updateStore(updateInfo);
                    }
                    else {
                        if (this.props.Login.isDeletePopup) {
                            this.props.getDeleteApprovedSample(inputParam.inputData, this.props.Login.masterData)
                        }
                        else if (this.props.Login.isEditPopup) {

                            this.props.UpdateApprovedSample(inputParam.inputData, this.props.Login.masterData)
                        }
                        else {
                            this.props.getApprovedRecordsAsDraft(inputParam.inputData, this.props.Login.masterData, seletedRecord)
                        }
                    }
                }
                else {
                    toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTANYONESAMPLE" }));
                }
            }
            else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTANYONESAMPLE" }));
            }
        }

    }
    //     onSaveModalClick = () => {
    //         //if(this.props.Login.masterData.selectedComment && this.props.Login.masterData.selectedComment !==0)
    //         if (this.props.Login.screenName === "IDS_REPORTINFOCOMMENTS") {
    //             this.props.UpdateReportComments(this.props.Login.userInfo, this.props.Login.masterData)
    //         }
    //         else {
    //             let ntransactionsamplecode = ""
    //             let ntransactiontestcode = ""
    //             let npreregno = ""
    //             if (this.props.Login.masterData.ReleaseSample && this.props.Login.masterData.ReleaseSample.length !== 0) {
    //                 if (this.state.npreregno && this.state.npreregno.length > 0) {
    //                     let sample = this.state.npreregno.filter((c, index) => {
    //                         return this.state.npreregno.indexOf(c) === index;
    //                     });
    //                     let subsample = this.state.ntransactionsamplecode.filter((c, index) => {
    //                         return this.state.ntransactionsamplecode.indexOf(c) === index;
    //                     });
    //                     let test = this.state.ntransactiontestcode.filter((c, index) => {
    //                         return this.state.ntransactiontestcode.indexOf(c) === index;
    //                     });

    //                     npreregno = sample.map(x => x).join(",")
    //                     ntransactionsamplecode = subsample.map(x => x).join(",")
    //                     ntransactiontestcode = test.map(x => x).join(",")
    //                     let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
    //                     const inputParam = {
    //                         inputData: {
    //                             change: this.props.Login.change,
    //                             npreregno: String(npreregno),
    //                             ntransactionsamplecode: ntransactionsamplecode,
    //                             ntransactiontestcode: ntransactiontestcode,
    //                             ncoaparentcode: this.props.Login.isEditPopup || this.props.Login.isDeletePopup ? this.props.Login.masterData.selectedReleaseHistory
    //                                 && this.props.Login.masterData.selectedReleaseHistory.ncoaparentcode : -1,
    //                             url: this.props.Login.settings[24],
    //                             ntransactionstatus: String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus),
    //                             nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
    //                             ncoareporttypecode: this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
    //                             nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
    //                             nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
    //                             napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
    //                             nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
    //                             nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
    //                             dfrom: obj.fromDate,
    //                             dto: obj.toDate,
    //                             isAddPopup: false,
    //                             isEditPopup: false,
    //                             nflag: 2,
    //                             userinfo: this.props.Login.userInfo,
    //                             ndesigntemplatemappingcode: (this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode) || -1,
    //                             doAction: this.props.Login.operation === "save" ? "saveasdraft" : this.props.Login.operation === "delete" ? "removesample" : "appendsample",
    //                         },
    //                         userinfo: this.props.Login.userInfo,
    //                         methodUrl: "Release",
    //                         classUrl: "release",
    //                         operation: this.props.Login.operation
    //                     }

    //                     const masterData = this.props.Login.masterData;
    //                     if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {

    //                         const updateInfo = {
    //                             typeName: DEFAULT_RETURN,
    //                             data: {
    //                                 loadEsign: true,
    //                                 screenData: { inputParam, masterData },
    //                                 operation: this.props.Login.operation,
    //                                 screenName: this.props.Login.screenName,
    //                                 ncontrolcode:this.props.Login.ncontrolCode
    //                             }
    //                         }
    //                         this.props.updateStore(updateInfo);
    //                     }
    //                     else {
    //                         if (this.props.Login.isDeletePopup) {
    //                             this.props.getDeleteApprovedSample(inputParam.inputData, this.props.Login.masterData)
    //                         }
    //                         else if (this.props.Login.isEditPopup) {
    // <<<<<<< .mine
    //                             this.props.UpdateApprovedSample(this.props.Login.userInfo, this.props.Login.masterData, inputParam.inputData)
    // ||||||| .r76787
    //                             this.props.UpdateApprovedSample (this.props.Login.userInfo, this.props.Login.masterData, inputParam.inputData)  
    // =======
    //                             this.props.UpdateApprovedSample (inputParam.inputData, this.props.Login.masterData)  
    // >>>>>>> .r76792
    //                         }
    //                         else {
    //                             this.props.getApprovedRecordsAsDraft(inputParam.inputData, this.props.Login.masterData)
    //                         }
    //                     }

    //                 }
    //                 else {
    //                     toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTANYONESAMPLE" }));
    //                 }
    //             }
    //             else {
    //                 toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTANYONESAMPLE" }));
    //             }


    //         }

    //     }
    componentDidUpdate(previousProps) {
        let { userRoleControlRights, controlMap,
            SampleGridItem,
            selectedRecord, SampletypeList, RegistrationTypeList, ReporttypeList,
            RegistrationSubTypeList, FilterStatusList, ConfigVersionList,
            //UserSectionList, TestList,
            SingleItem, DynamicGridItem, DynamicTestGridItem, DynamicSubSampleGridItem, slideOutDataState,  // ALPD-4896, Added slideOutDataState for slideout datagrid
            stateDynamicDesign, checkedflag, dataState, selectedComment, isInitialRender, DynamicReportFilterTypeItem, DynamicDefaultStructureItem } = this.state;

        let bool = false;
        let reportFilePath = "";

        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            reportFilePath = this.props.Login.masterData.ReportPDFFile;

            bool = true;
        }
        // else {
        //     if (this.state.dataState === undefined) {
        //         dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
        //     }
        //     //  const npreregno =  [];
        //     //  const ntransactionsamplecode = this.props.Login.ntransactionsamplecode || [];
        //     //  const ntransactiontestcode = this.props.Login.ntransactiontestcode || [];
        //     bool = true;

        // }

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {

            selectedRecord = this.props.Login.selectedRecord
            bool = true;
        }
        if (this.props.Login.checkedflag !== previousProps.Login.checkedflag) {

            checkedflag = this.props.Login.checkedflag
            bool = true;
        }
        if (this.props.Login.isInitialRender !== previousProps.Login.isInitialRender) {
            isInitialRender = this.props.Login.isInitialRender;
            bool = true;
        }
        // if (this.props.Login.npreregno !== previousProps.Login.npreregno) {

        //     npreregno = this.props.Login.npreregno
        //     bool = true;
        // }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const SampletypeListMap = constructOptionList(this.props.Login.masterData.SampleType || [], "nsampletypecode", "ssampletypename", 'ascending', 'nsampletypecode', false);
            const ReporttypeListMap = constructOptionList(this.props.Login.masterData.ReportType || [], "ncoareporttypecode", "scoareporttypename", 'ascending', 'ncoareporttypecode', false);
            // const ProjecttypeListMap = constructOptionList(this.props.Login.masterData.ProjectType || [], "nprojecttypecode", "sprojecttypename", 'ascending', 'nprojecttypecode', false);
            // const ProjectMasterListMap = constructOptionList(this.props.Login.masterData.ProjectMaster || [], "nprojectmastercode", "sprojectcode", 'ascending', 'nprojectmastercode', false);           
            const RegistrationTypeListMap = constructOptionList(this.props.Login.masterData.RegType || [], "nregtypecode", "sregtypename", "nsorter", 'ascending', 'nregtypecode', false);
            const RegistrationSubTypeListMap = constructOptionList(this.props.Login.masterData.RegSubType || [], "nregsubtypecode", "sregsubtypename", "nsorter", 'ascending', 'nregsubtypecode', false);
            const FilterStatusListMap = constructOptionList(this.props.Login.masterData.FilterStatus || [], "ntransactionstatus", "sfilterstatus", undefined, undefined, true);
            const ConfigVersionListMap = constructOptionList(this.props.Login.masterData.ApprovalVersion || [], "napprovalconfigversioncode", "sversionname", 'descending', 'ntransactionstatus', false);
            const TestListMap = constructOptionList(this.props.Login.masterData.Test || [], "ntestcode", "stestsynonym", undefined, undefined, true);
            SampletypeList = SampletypeListMap.get("OptionList");
            ReporttypeList = ReporttypeListMap.get("OptionList");
            // ProjecttypeList = ProjecttypeListMap.get("OptionList");
            //ProjectMasterList = ProjectMasterListMap.get("OptionList");
            RegistrationTypeList = RegistrationTypeListMap.get("OptionList");
            RegistrationSubTypeList = RegistrationSubTypeListMap.get("OptionList");
            FilterStatusList = FilterStatusListMap.get("OptionList");
            ConfigVersionList = ConfigVersionListMap.get("OptionList");
            //  UserSectionList = UserSectionListMap.get("OptionList");
            //   TestList = TestListMap.get("OptionList");

            bool = true;
        }

        if (this.props.Login.masterData.selectedComment !== previousProps.Login.masterData.selectedComment) {
            selectedComment = this.props.Login.masterData.selectedComment;
            bool = true;
        }

        if (this.props.Login.masterData.DynamicDesign && this.props.Login.masterData.DynamicDesign !== previousProps.Login.masterData.DynamicDesign) {
            const dynamicColumn = JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata.value);
            DynamicGridItem = dynamicColumn.samplegriditem ? dynamicColumn.samplegriditem : [];
            DynamicTestGridItem = dynamicColumn.testListFields.releasetestfields ? dynamicColumn.testListFields.releasetestfields : [];
            DynamicSubSampleGridItem = dynamicColumn.subsamplelistitem ? dynamicColumn.subsamplelistitem : [];
            SingleItem = dynamicColumn.sampledisplayfields ? dynamicColumn.sampledisplayfields : [];
            DynamicReportFilterTypeItem = dynamicColumn.samplefiltertypefields ? dynamicColumn.samplefiltertypefields : [];
            DynamicDefaultStructureItem = dynamicColumn.defaultstructure ? dynamicColumn.defaultstructure : [];

            bool = true;

            let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
            selectedRecord['fromDate'] = obj.fromDate;
            selectedRecord['toDate'] = obj.toDate;

            bool = true;
        }
        if (this.props.Login.slideOutClose !== previousProps.Login.slideOutClose) {
            bool = true;
        }
        if (this.props.Login.isClear !== previousProps.Login.isClear) {
            bool = true;
        }
        if (this.props.Login.masterData.DesignTemplateMapping !== previousProps.Login.masterData.DesignTemplateMapping) {

            const DesignTemplateMappingMap = constructOptionList(this.props.Login.masterData.DesignTemplateMapping || [], "ndesigntemplatemappingcode",
                "sregtemplatename", undefined, undefined, false);

            stateDynamicDesign = DesignTemplateMappingMap.get("OptionList")
        }

        //  ALPD-5570   Added expandFlag by Vishakh to handle pagination
        if (!this.props.Login.expandFlag && this.props.Login.masterData.ReleasedSampleDetails && this.props.Login.masterData.ReleasedSampleDetails.length < (dataState.skip + dataState.take)) {
            dataState = {
                skip: 0,
                take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
            }
        }
        //  ALPD-5570   Added expandFlag by Vishakh to handle pagination
        if (!this.props.Login.expandFlag && this.props.Login.masterData.ReleaseSample && this.props.Login.masterData.ReleaseSample.length < (slideOutDataState.skip + slideOutDataState.take)) {
            slideOutDataState = {
                skip: 0,
                take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
            }
        }

        if (bool) {
            bool = false;
            let allData = {
                userRoleControlRights, controlMap,
                SampleGridItem, selectedRecord, SampletypeList, RegistrationTypeList, ReporttypeList,
                RegistrationSubTypeList, FilterStatusList, ConfigVersionList, selectedComment,
                //UserSectionList, TestList,
                SingleItem, DynamicGridItem, DynamicTestGridItem, DynamicSubSampleGridItem, stateDynamicDesign, checkedflag, isInitialRender,
                data: this.props.Login.data || this.props.Login.masterData.ReleaseSample || [],
                dataResult: process(this.props.Login.data || this.props.Login.masterData.ReleaseSample || [], slideOutDataState),   // ALPD-4896, Added slideOutDataState for slideout datagrid
                reportFilePath, DynamicReportFilterTypeItem, DynamicDefaultStructureItem, dataState, slideOutDataState
                //npreregno: this.state.npreregno || [], ntransactionsamplecode: this.state.ntransactionsamplecode || [],
                //ntransactiontestcode: this.state.ntransactiontestcode || []
            }
            // ALPD-4208 (22-05-2024) Changes done for expand function in add sample popup
            if (this.props.Login.slideOutClose && this.props.Login.slideOutClose === true
                && this.props.Login.isClear !== false

                // && (this.props.Login.isAddPopup && this.props.Login.isAddPopup === true
                // || this.props.Login.isEditPopup && this.props.Login.isEditPopup === true
                // || this.props.Login.isDeletePopup && this.props.Login.isDeletePopup === true)
            ) {
                this.setState({ ...allData, npreregno: [], ntransactionsamplecode: [], ntransactiontestcode: [] });
            }
            else {
                this.setState(allData);
            }

        }

        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

    }
    sendToPortal = () => {
        if (this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 1) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MULTISELECTAPPLICABLEONLYFORRELEASEACTION" }));
        } else {
            const inputParam = {
                inputData: { userinfo: this.props.Login.userInfo },
                url: this.props.Login.settings[24],
                isPortal: true,
                ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode,
                allPreregno: this.props.Login.masterData.selectedReleaseHistory[0].spreregno,
                nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                userinfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData
            }
            this.props.getReportForPortal(inputParam)
        }
    }

    editReportTemplate = (inputParam) => {
        if (inputParam.editReportTemplate.ntransactionstatus === transactionStatus.DRAFT || inputParam.editReportTemplate.ntransactionstatus === transactionStatus.CORRECTION) {
            let inputParamData = {
                inputData: {
                    nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                    // ALPD-4091 (16-05-2024) Changed ApprovalVersionValue to realApprovalVersionValue
                    napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                    ncoareporttypecode: this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode,
                    nsectioncode: this.props.Login.masterData.reportSectionCode ? this.props.Login.masterData.reportSectionCode : -1,
                    nreporttypecode: REPORTTYPE.COAREPORT,
                    nreporttemplatecode: inputParam.editReportTemplate.nreporttemplatecode,
                    ncoaparentcode: inputParam.editReportTemplate.ncoaparentcode,
                    ncoaparenttranscode: inputParam.editReportTemplate.ntransactionstatus,
                    userinfo: this.props.Login.userInfo,
                    ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1
                },
                ncoaparentcode: inputParam.editReportTemplate.ncoaparentcode,
                nreporttemplatecode: inputParam.editReportTemplate.nreporttemplatecode,
                userInfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData,
                selectedRecord: this.state.selectedRecord,
                // screenName: "IDS_REPORTTEMPLATE"
            }
            this.props.editReportTemplate(inputParamData)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTCORRECTEDRECORD" }));
        }
    }

    reportHistory = () => {
        if (this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 1) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MULTISELECTAPPLICABLEONLYFORRELEASEACTION" }));
        } else {
            if (this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus !== transactionStatus.DRAFT) {
                let inputParam = {
                    ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode,
                    spreregno: this.props.Login.masterData.selectedReleaseHistory[0].spreregno,
                    stransactionsamplecode: this.props.Login.masterData.selectedReleaseHistory[0].stransactionsamplecode,
                    stransactiontestcode: this.props.Login.masterData.selectedReleaseHistory[0].stransactiontestcode,
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData
                }
                this.props.versionHistory(inputParam)
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRELEASEDRECORD" }));
            }
        }
    }
    releaseReportHistory = () => {
        if (this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 1) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MULTISELECTAPPLICABLEONLYFORRELEASEACTION" }));
        } else {
            //if(this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus!==transactionStatus.DRAFT){
            let inputParam = {
                ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode,
                spreregno: this.props.Login.masterData.selectedReleaseHistory[0].spreregno,
                stransactionsamplecode: this.props.Login.masterData.selectedReleaseHistory[0].stransactionsamplecode,
                stransactiontestcode: this.props.Login.masterData.selectedReleaseHistory[0].stransactiontestcode,
                userInfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData,
                screenName: this.props.intl.formatMessage({ id: "IDS_RELEASEHISTORY" })
            }
            this.props.releaseReportHistory(inputParam)
            //    }else{
            //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRELEASEDRECORD" }));
            //    }
        }
    }

    patientInfo = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { isPatientDetails: true, openModal: true, hideSave: true, isAddPopup: false, isEditPopup: false, isDeletePopup: false }
        }
        this.props.updateStore(updateInfo);
    }

    reportHistoryInfo = () => {
        if (this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 1) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MULTISELECTAPPLICABLEONLYFORRELEASEACTION" }));
        } else {
            const inputParam = {
                inputData: {
                    userinfo: this.props.Login.userInfo,
                    ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode
                },
                masterData: this.props.Login.masterData
            }
            this.props.viewReportHistory(inputParam);
        }
    }

    releaseTestAttachmentData = (actionName) => {
        if (this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 1) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MULTISELECTAPPLICABLEONLYFORRELEASEACTION" }));
        } else {
            const inputParam = {
                inputData: {
                    userinfo: this.props.Login.userInfo,
                    ncoaparentcode: this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode,
                    actionName: actionName
                },
                masterData: this.props.Login.masterData
            }
            this.props.viewReleaseTestAttachment(inputParam);
        }
    }

    reloadData = () => {
        this.searchRef.current.value = "";
        delete this.props.Login.masterData["searchedData"]

        this.props.Login.change = false
        let { realFromDate, realToDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue,
            realFilterStatusValue, realApprovalVersionValue,
            // realUserSectionValue, realTestValue,
            realReportTypeValue } = this.props.Login.masterData
        let masterData = {
            ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue,
            // realUserSectionValue, realTestValue,
            realReportTypeValue
        }
        let inputData = {
            npreregno: "0",
            nneedsubsample: (realRegSubTypeValue && realRegSubTypeValue.nneedsubsample) || false,
            nneedtemplatebasedflow: (realRegSubTypeValue && realRegSubTypeValue.nneedtemplatebasedflow) || false,
            nsampletypecode: (realSampleTypeValue && realSampleTypeValue.nsampletypecode) || -1,
            nregtypecode: (realRegTypeValue && realRegTypeValue.nregtypecode) || -1,
            nregsubtypecode: (realRegSubTypeValue && realRegSubTypeValue.nregsubtypecode) || -1,
            ncoareporttypecode: (realReportTypeValue && realReportTypeValue.ncoareporttypecode) || -1,
            isneedsection: parseInt(realReportTypeValue && realReportTypeValue.isneedsection) || transactionStatus.NO,

            ntransactionstatus: realFilterStatusValue && ((realFilterStatusValue.ntransactionstatus !== undefined) || (realFilterStatusValue.ntransactionstatus !== '0')) ? String(realFilterStatusValue.ntransactionstatus) + ',' + String(transactionStatus.RELEASED) : "-1",
            napprovalconfigcode: realApprovalVersionValue ? realApprovalVersionValue.napprovalconfigcode || -1 : null,
            napprovalversioncode: realApprovalVersionValue && realApprovalVersionValue.napprovalconfigversioncode ? String(realApprovalVersionValue.napprovalconfigversioncode) : -1,
            // ntestcode: realTestValue && realTestValue.ntestcode ? realTestValue.ntestcode : -1,
            userinfo: this.props.Login.userInfo,
            ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
        }
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
            && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
            // && realFilterStatusValue.sfilterstatus !== null
            && inputData.ncoareporttypecode !== -1
        ) {
            let obj = convertDateValuetoString(realFromDate, realToDate, this.props.Login.userInfo)
            inputData['dfrom'] = obj.fromDate;
            inputData['dto'] = obj.toDate;
            let inputParam = {
                masterData,
                inputData,
            }
            this.props.getReleasedSample(inputParam, this.state.selectedRecord, this.props.Login.selectedRecord, this.props.Login)
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let isPatientDetails = this.props.Login.isPatientDetails;
        let selectedRecord = this.props.Login.selectedRecord;
        let hideSave = this.props.Login.hideSave;
        let isAddPopup = this.props.Login.isAddPopup;
        let isEditPopup = this.props.Login.isEditPopup;
        let isDeletePopup = this.props.Login.isDeletePopup;
        let isCorrectionNeed = this.props.Login.isCorrectionNeed;
        let ncontrolcode = this.props.Login.ncontrolcode;
        let modalShow = this.props.Login.modalShow;
        let screenName = this.props.Login.screenName;
        let isPatientReports = this.props.Login.isPatientReports;
        let openModalTitle = this.props.Login.openModalTitle;
        let isReleaseTestAttachment = this.props.Login.isReleaseTestAttachment;
        let isReleaseTestComment = this.props.Login.isReleaseTestComment;
        let isAddReleaseTestAttachment = this.props.Login.isAddReleaseTestAttachment;
        let isAddReleaseTestComment = this.props.Login.isAddReleaseTestComment;
        let isInitialRender = this.props.Login.isInitialRender;
        let loadEsignStateHandle = this.props.Login.loadEsignStateHandle;
        let FilterQueryBuilder = this.props.Login.FilterQueryBuilder;
        let slideOutClose = this.props.Login.slideOutClose; // ALPD-4208 (22-05-2024) Changes done for expand function in add sample popup
        let expandFlag = this.props.Login.expandFlag;   //  ALPD-5570   Added expandFlag by Vishakh to handle pagination
        let isClear = this.props.Login.isClear; // ALPD-5603    Added isClear by Vishakh to handle selection in add sample popup (06-04-2025)
        const editResultId = this.state.controlMap.has("EditResult") && this.state.controlMap.get("EditResult").ncontrolcode;
        const editReportTemplateId = this.state.controlMap.has("EditReportTemplate") && this.state.controlMap.get("EditReportTemplate").ncontrolcode;
        //let projectMasterList =[];
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                // openModal = false;
                isPatientDetails = false;
                hideSave = false;
                isAddPopup = false;
                isEditPopup = false;
                isDeletePopup = true;  //Modified by sonia on 7th Aug 2024 for JIRA ID:ALPD-4576
                isCorrectionNeed = false;
                isPatientReports = false;
                isReleaseTestAttachment = false;
                isReleaseTestComment = false;
                // screenName = undefined;
                selectedRecord = {};
                FilterQueryBuilder = false;
            }
            else {
                slideOutClose = false;
                expandFlag = false; //  ALPD-5570   Added expandFlag by Vishakh to handle pagination
                if (ncontrolcode && (ncontrolcode === editResultId || ncontrolcode === editReportTemplateId)) {
                    modalShow = true;
                    if (ncontrolcode === editReportTemplateId) {
                        openModal = false;
                    }
                }
                if (this.props.Login.screenName !== undefined && this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_CORRECTION" })
                    // || this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_CORRECTIONCOMMENTS" }) 
                    || this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_REGENERATEFILE" }) ||
                    this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_GENERATEFILE" }) ||
                    this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_PREVIEWREPORT" }) ||
                    this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_PRELIMINARYREPORT" }) ||
                    this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_RELEASEHISTORY" })) {
                    openModal = false;
                    //  screenName = undefined;
                }
                loadEsign = false;
                // selectedRecord["agree"] = 4;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""
                FilterQueryBuilder = false;
            }
        }
        // When using EsignStateHandle component
        else if (this.props.Login.loadEsignStateHandle) {
            loadEsignStateHandle = false;
        } else if (this.props.Login.FilterQueryBuilder) {

            FilterQueryBuilder = false;
            screenName = this.props.Login.screenNameCopy;

        }
        else {
            openModal = (isAddReleaseTestAttachment === true || isAddReleaseTestComment === true) ? true : false;
            isPatientDetails = false;
            hideSave = false;
            isAddPopup = false;
            isEditPopup = false;
            isDeletePopup = false;
            isCorrectionNeed = false;
            isPatientReports = false;
            isReleaseTestAttachment = isAddReleaseTestAttachment === true ? true : false;
            isReleaseTestComment = isAddReleaseTestComment === true ? true : false;
            //screenName = undefined;
            selectedRecord = {};
            openModalTitle = undefined;
            isAddReleaseTestAttachment = false;
            isAddReleaseTestComment = false;
            isInitialRender = false;
            FilterQueryBuilder = false;
            slideOutClose = true;
            expandFlag = false; //  ALPD-5570   Added expandFlag by Vishakh to handle pagination
            isClear = true;	// ALPD-5603    Added isClear by Vishakh to handle selection in add sample popup (06-04-2025)
        }
        // ALPD-4208 (22-05-2024) Changes done for expand function in add sample popup
        // if((this.props.Login.loadEsign && this.props.Login.loadEsign===false) && (this.props.Login.isAddPopup && this.props.Login.isAddPopup === true || this.props.Login.isDeletePopup && this.props.Login.isDeletePopup === true ||
        //     this.props.Login.isEditPopup && this.props.Login.isEditPopup === true)){
        //     slideOutClose = true;
        // }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal, modalShow, loadEsign, screenName, selectedRecord, selectedId: null, isPatientDetails, hideSave, isAddPopup, isEditPopup, isDeletePopup,
                isCorrectionNeed, isPatientReports, openModalTitle, isReleaseTestAttachment, isReleaseTestComment, isAddReleaseTestAttachment, isAddReleaseTestComment, isInitialRender, loadEsignStateHandle,
                FilterQueryBuilder, slideOutClose, expandFlag, isClear
            }
        }
        this.props.updateStore(updateInfo);
    }

    // closeModalShow = () => {
    //     let loadEsign = this.props.Login.loadEsign;

    //     let modalShow = this.props.Login.modalShow;
    //     let selectedRecord = this.props.Login.selectedRecord;
    //     let ReportmodalShow = this.props.Login.ReportmodalShow;
    //     // const editResultId =this.state.controlMap.has("EditResult") && this.state.controlMap.get("EditResult").ncontrolcode;
    //     if (this.props.Login.loadEsign) {
    //         loadEsign = false;
    //     } else {
    //         modalShow = false;
    //         ReportmodalShow = false;
    //         selectedRecord = {};
    //     }

    //     const updateInfo = {
    //         typeName: DEFAULT_RETURN,
    //         data: { modalShow, selectedRecord, selectedId: null, loadEsign, ReportmodalShow },
    //     };
    //     this.props.updateStore(updateInfo);
    // };

    closeDocModal = () => {
        let openModal = false;
        let showReport = false;
        let selectedRecord = {};
        this.setState({ showReport, openModal, selectedRecord });
    }

    onInputOnChange = (event) => {
        let selectedRecord = { ...this.state.selectedRecord } || {};
        if (event.target.type === "checkbox") {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    onChangeAwesomeQueryBuilder = (immutableTree, config) => {
        //let selectedRecord = this.state.selectedRecord || {};
        const filterquery = QbUtils.sqlFormat(immutableTree, config);
        const filterQueryTreeStr = QbUtils.getTree(immutableTree);

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                awesomeTree: immutableTree, awesomeConfig: config, filterquery, filterQueryTreeStr
            }
        }
        this.props.updateStore(updateInfo)
        // this.setState({ awesomeTree: immutableTree, awesomeConfig: config, selectedRecord: selectedRecord });
    };

    onComboChangeAwesomeQueryBuilder = (immutableTree, config, event) => {
        //     let isMandatory=false;
        //    if(event.type==='REMOVE_RULE'){
        //     this.state.DynamicReportFilterTypeItem.map(x=>{
        //         if(x[designProperties.VALUE]===config.fields[event.affectedField]['label'] && x['ismandatory']){
        //             isMandatory=true;
        //         }
        //     })
        //    }
        //    if(!isMandatory){
        const filterquery = QbUtils.sqlFormat(immutableTree, config);
        const filterQueryTreeStr = QbUtils.getTree(immutableTree);
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                awesomeTree: immutableTree, awesomeConfig: config,
                filterquery, filterQueryTreeStr//,immutableTreeCopy:immutableTree,configCopy:config
            }
        }
        this.props.updateStore(updateInfo)
        // }else{
        //     const filterquery =this.props.Login.filterquery;
        //     const filterQueryTreeStr =this.props.Login.filterQueryTreeStr;
        //     const updateInfo = {
        //         typeName: DEFAULT_RETURN,
        //         data: {
        //             awesomeTree: this.props.Login.immutableTreeCopy, awesomeConfig: this.props.Login.configCopy, 
        //             filterquery, filterQueryTreeStr
        //         }
        //     }
        //     this.props.updateStore(updateInfo)
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLINFILTER" }));
        // }
    };

    handleExecuteClick = (event) => {
        //const selectedRecord = this.state.selectedRecord
        const filterquery = this.props.Login.filterquery
        if (filterquery !== "" && filterquery !== undefined && !filterquery.includes('Invalid date')) {
            const inputparam = {
                component: this.props.Login.seletedFilterComponent,
                userinfo: this.props.Login.userInfo,
                filterquery: filterquery,
                // selectedRecord:this.state.selectedRecord
            }
            this.props.getPatientFilterExecuteData(inputparam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLINFILTER" }));
        }
    }

    handleKendoRowClick = (event) => {
        let patientinfo = event.dataItem;
        const component = this.props.Login.seletedFilterComponent;
        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const inputparam = {
            realFromDate: obj.fromDate,
            realToDate: obj.toDate,
            realSampleTypeValue: this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue,
            realRegTypeValue: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue,
            realRegSubTypeValue: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue,
            realFilterStatusValue: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue,
            realApprovalVersionValue: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue,
            realDesignTemplateMappingValue: this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode,
            masterData: { ...this.props.Login.masterData },
            realReportTypeValue: this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue,
            Login: this.props.Login,
            selectedRecord: this.props.Login.selectedRecord && this.props.Login.selectedRecord || [],
            'dfrom': obj.fromDate,
            'dto': obj.toDate,
            'npreregno': "0",
            'nsampletypecode': (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode) || -1,
            'nregtypecode': parseInt(this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
            'nregsubtypecode': parseInt(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
            'ntransactionstatus': this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus ? String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) + ',' + String(transactionStatus.PARTIAL) : "-1",
            "napprovalconfigcode": this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
            "napprovalversioncode": this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) : null,
            'nneedsubsample': (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
            'userinfo': this.props.Login.userInfo,
            // ALPD-4091 (16-05-2024) Changed ndesigntemplatemappingcode to realDesignTemplateMappingValue
            'ndesigntemplatemappingcode': (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
            'isAddPopup': true,
            'isPopup': true,
            'ncoareporttypecode': parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.ncoareporttypecode) || -1,
            screenName: this.props.intl.formatMessage({ id: "IDS_ADDSAMPLE" }),
            isneedsection: parseInt(this.props.Login.masterData.realReportTypeValue && this.props.Login.masterData.realReportTypeValue.isneedsection) || transactionStatus.NO,
            userinfo: this.props.Login.userInfo,
            patientinfo: event.dataItem,
            spatientid: event.dataItem.spatientid
            // selectedRecord:this.state.selectedRecord
        }
        // if (component["childFields"]) {
        //     const index = this.props.Login.masterIndex;
        //     let selectedRecord = this.state.selectedMaster || {};

        //     component["childFields"].map(item => {
        //         let data = item1[item.columnname];
        //         if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
        //             //combocontrol
        //             data = { label: item1[item.sdisplaymember], value: item1[item.svaluemember] };
        //         }
        //         else if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
        //             //Date picker control
        //             data = rearrangeDateFormatforKendoDataTool(this.props.Login.userInfo, data);
        //         }
        //         selectedRecord[index][item.columnname] = data;
        //     })


        //     const updateInfo = {
        //         typeName: DEFAULT_RETURN,
        //         data: { selectedMaster: selectedRecord, loadCustomSearchFilter: false, }
        //     }
        //     this.props.updateStore(updateInfo);
        // }
        // else {
        //     const newdata = {
        //         label: item1[component['displaymember']],
        //         value: item1[component['valuemember']], item: { jsondata: { ...item1, jsondata: { ...item1 } } }
        //     };

        //     this.onComboChange(newdata, component, component['label']);
        // }
        this.props.getPatientWiseSample(inputparam)
    };

    onInputChange = (event) => {
        let selectedComment = this.props.Login.masterData.selectedComment || {};
        selectedComment[event.target.name] = event.target.value;
        const coaFileInfo = {
            typeName: DEFAULT_RETURN,
            data: { selectedComment },
        };
        this.props.updateStore(coaFileInfo);
    }

    validateEsign = () => {
        let ncontrolcode = this.props.Login.ncontrolcode;
        const editResultId = this.state.controlMap.has("EditResult") && this.state.controlMap.get("EditResult").ncontrolcode;
        let modalName = "";
        if (ncontrolcode && ncontrolcode === editResultId) {
            modalName = "modalShow";
        }
        else {
            modalName = "openModal";
        }
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,

                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignforRelease(inputParam, modalName);
    }

    selectionChange = (event, nflag, checkedflag) => {
        const checked = event.syntheticEvent.target.checked;
        if (nflag === undefined) {
            this.state.dataResult.data.map(item => {
                if (item.npreregno === event.dataItem.npreregno) {
                    item.selected = checked;
                }

            })
            let preregno = event.dataItem.npreregno
            let ncoahistorycode = event.dataItem.ncoahistorycode
            let ssystemfilename = event.dataItem.ssystemfilename
            const coaFileInfo = {
                typeName: DEFAULT_RETURN,
                data: { ncoahistorycode, ssystemfilename },
            };
            this.props.updateStore(coaFileInfo);
            this.childHeaderSelectionChange(event, preregno, checkedflag)
        }
        else {
            let data = []
            event.dataItems.map(item => {
                data.push({ "npreregno": item.npreregno })
            })
            this.childHeaderSelectionChange(event, data, checkedflag)
        }
    }

    childHeaderSelectionChange = (event, preregno, checkedflag) => {
        const checked = event.syntheticEvent.target.checked;
        let subsamplecode = [];
        let npreregno = preregno === undefined ? event.dataItems[0].npreregno : preregno
        if (npreregno.length === 0 || npreregno.length === undefined) {
            this.props.Login.masterData.ReleaseSubSample[npreregno].map(item => {

                item.selected = checked
                if (!subsamplecode.includes(item.ntransactionsamplecode)) {
                    subsamplecode.push({ "ntransactionsamplecode": item.ntransactionsamplecode })
                }

            })
            this.props.Login.masterData.ReleaseSample.map(data => {
                if (data.npreregno === npreregno) {
                    data.selected = checked
                }
            })

            this.subChildHeaderSelectionChange(event, subsamplecode, checkedflag)
        }
        else {
            npreregno.map(value => {
                this.props.Login.masterData.ReleaseSubSample[value.npreregno].map(item => {
                    item.selected = checked
                    if (!subsamplecode.includes(item.ntransactionsamplecode)) {
                        subsamplecode.push({ "ntransactionsamplecode": item.ntransactionsamplecode })
                    }
                })

            })
            this.subChildHeaderSelectionChange(event, subsamplecode, checkedflag)
        }
    }

    subChildHeaderSelectionChange = (event, subsamplecode, checkedflag) => {
        const checked = event.syntheticEvent.target.checked;
        let transactionsamplecode = subsamplecode;
        if (subsamplecode !== undefined) {
            //  transactionsamplecode = subsamplecode
            let recievedPreRegNo = undefined;
            let recievedTransactionSampleCode = undefined;
            let recievedTransactionTestCode = undefined;
            transactionsamplecode.map(value => {
                this.props.Login.masterData.ReleaseTest[value.ntransactionsamplecode].map(item => {
                    item.selected = checked;
                    let nPreRegNo = recievedPreRegNo !== undefined ? recievedPreRegNo : this.state.npreregno;
                    let nTransactionSampleCode = recievedTransactionSampleCode !== undefined ? recievedTransactionSampleCode : this.state.ntransactionsamplecode;
                    let nTransactionTestCode = recievedTransactionTestCode !== undefined ? recievedTransactionTestCode : this.state.ntransactiontestcode;
                    let sendData = {
                        npreregno: nPreRegNo,
                        ntransactionsamplecode: nTransactionSampleCode,
                        ntransactiontestcode: nTransactionTestCode
                    }
                    // this.collectData(item, checkedflag)
                    // ALPD-4209 (22-05-2024) Modified CollectData function for selection issue
                    let sentData = this.collectData(item, sendData);
                    recievedPreRegNo = sentData.npreregno;
                    recievedTransactionSampleCode = sentData.ntransactionsamplecode;
                    recievedTransactionTestCode = sentData.ntransactiontestcode;
                    return item;
                })
            })
            this.setState({
                npreregno: checkedflag === false ? [] : recievedPreRegNo,
                ntransactionsamplecode: checkedflag === false ? [] : recievedTransactionSampleCode,
                ntransactiontestcode: checkedflag === false ? [] : recievedTransactionTestCode
            });
        }
        else {
            let recievedPreRegNo = undefined;
            let recievedTransactionSampleCode = undefined;
            let recievedTransactionTestCode = undefined;
            event.dataItems.map(value =>
                this.props.Login.masterData.ReleaseTest[value.ntransactionsamplecode].map(item => {
                    item.selected = checked;
                    let nPreRegNo = recievedPreRegNo !== undefined ? recievedPreRegNo : this.state.npreregno;
                    let nTransactionSampleCode = recievedTransactionSampleCode !== undefined ? recievedTransactionSampleCode : this.state.ntransactionsamplecode;
                    let nTransactionTestCode = recievedTransactionTestCode !== undefined ? recievedTransactionTestCode : this.state.ntransactiontestcode;
                    let sendData = {
                        npreregno: nPreRegNo,
                        ntransactionsamplecode: nTransactionSampleCode,
                        ntransactiontestcode: nTransactionTestCode
                    }
                    // this.collectData(item, checkedflag)
                    // ALPD-4209 (22-05-2024) Modified CollectData function for selection issue
                    let sentData = this.collectData(item, sendData);
                    recievedPreRegNo = sentData.npreregno;
                    recievedTransactionSampleCode = sentData.ntransactionsamplecode;
                    recievedTransactionTestCode = sentData.ntransactiontestcode;
                    return item;
                })
            )
            this.props.Login.masterData.ReleaseSubSample[event.dataItems[0].npreregno].map(item => {
                if (event.dataItems[0].ntransactionsamplecode === item.ntransactionsamplecode) {
                    item.selected = checked;
                }
            })
            let data = this.props.Login.masterData.ReleaseSubSample[event.dataItems[0].npreregno].every(item => {
                return item.selected === true;
            })
            if (data === true) {
                this.props.Login.masterData.ReleaseSample.map(item => {
                    if (event.dataItems[0].npreregno === item.npreregno) {
                        item.selected = checked;
                    }
                })
            }
            else {
                this.props.Login.masterData.ReleaseSample.map(item => {
                    if (event.dataItems[0].npreregno === item.npreregno) {
                        item.selected = false;
                    }
                })
            }
            this.setState({
                npreregno: checkedflag === false ? [] : recievedPreRegNo,
                ntransactionsamplecode: checkedflag === false ? [] : recievedTransactionSampleCode,
                ntransactiontestcode: checkedflag === false ? [] : recievedTransactionTestCode
            });
        }
    }

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        if (event.dataItems.length !== 0) {
            this.state.dataResult.data.map(item => {
                item.selected = checked;
                return item;
            });
            this.selectionChange(event, 1, checked);
        }
        else {
            this.setState({ npreregno: [], ntransactionsamplecode: [], ntransactiontestcode: [] })
        }
    }

    childSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno].map(item => {
            if (item.npreregno === event.dataItem.npreregno && item.ntransactionsamplecode === event.dataItem.ntransactionsamplecode) {
                item.selected = checked;
            }
        })
        let data = this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno].every(item => {
            return item.slected === true
        })
        if (data === true) {
            this.props.Login.masterData.ReleaseSample.map(item => {
                if (event.dataItem.npreregno === item.npreregno) {
                    item.selected = checked;
                }
            })

            let recievedPreRegNo = undefined;
            let recievedTransactionSampleCode = undefined;
            let recievedTransactionTestCode = undefined;

            this.props.Login.masterData.ReleaseTest[event.dataItem.ntransactionsamplecode].map(item => {
                if (event.dataItem.ntransactionsamplecode === item.ntransactionsamplecode) {
                    item.selected = checked;
                    let nPreRegNo = recievedPreRegNo !== undefined ? recievedPreRegNo : this.state.npreregno;
                    let nTransactionSampleCode = recievedTransactionSampleCode !== undefined ? recievedTransactionSampleCode : this.state.ntransactionsamplecode;
                    let nTransactionTestCode = recievedTransactionTestCode !== undefined ? recievedTransactionTestCode : this.state.ntransactiontestcode;
                    let sendData = {
                        npreregno: nPreRegNo,
                        ntransactionsamplecode: nTransactionSampleCode,
                        ntransactiontestcode: nTransactionTestCode
                    }
                    // this.collectData(item)
                    // ALPD-4209 (22-05-2024) Modified CollectData function for selection issue
                    let sentData = this.collectData(item, sendData);
                    recievedPreRegNo = sentData.npreregno;
                    recievedTransactionSampleCode = sentData.ntransactionsamplecode;
                    recievedTransactionTestCode = sentData.ntransactiontestcode;
                }
            })
            this.setState({
                npreregno: recievedPreRegNo,
                ntransactionsamplecode: recievedTransactionSampleCode,
                ntransactiontestcode: recievedTransactionTestCode
            });
        }
        else {
            let recievedPreRegNo = undefined;
            let recievedTransactionSampleCode = undefined;
            let recievedTransactionTestCode = undefined;
            this.props.Login.masterData.ReleaseTest[event.dataItem.ntransactionsamplecode].map(item => {
                if (event.dataItem.ntransactionsamplecode === item.ntransactionsamplecode) {
                    item.selected = checked;
                    let nPreRegNo = recievedPreRegNo !== undefined ? recievedPreRegNo : this.state.npreregno;
                    let nTransactionSampleCode = recievedTransactionSampleCode !== undefined ? recievedTransactionSampleCode : this.state.ntransactionsamplecode;
                    let nTransactionTestCode = recievedTransactionTestCode !== undefined ? recievedTransactionTestCode : this.state.ntransactiontestcode;
                    let sendData = {
                        npreregno: nPreRegNo,
                        ntransactionsamplecode: nTransactionSampleCode,
                        ntransactiontestcode: nTransactionTestCode
                    }
                    // this.collectData(item)
                    // ALPD-4209 (22-05-2024) Modified CollectData function for selection issue
                    let sentData = this.collectData(item, sendData);
                    recievedPreRegNo = sentData.npreregno;
                    recievedTransactionSampleCode = sentData.ntransactionsamplecode;
                    recievedTransactionTestCode = sentData.ntransactiontestcode;
                }
            })
            let data = this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno].every(item => {
                return item.selected === true
            })
            if (data === true) {
                this.props.Login.masterData.ReleaseSample.map(item => {
                    if (event.dataItem.npreregno === item.npreregno) {
                        item.selected = checked;
                    }
                })
            }
            else {
                this.props.Login.masterData.ReleaseSample.map(item => {
                    if (event.dataItem.npreregno === item.npreregno) {
                        item.selected = false;
                    }
                })
            }
            this.setState({
                npreregno: recievedPreRegNo,
                ntransactionsamplecode: recievedTransactionSampleCode,
                ntransactiontestcode: recievedTransactionTestCode
            });
        }
    }

    subChildSelectionChange = (event) => {
        let x = []
        const checked = event.syntheticEvent.target.checked;
        let recievedPreRegNo = undefined;
        let recievedTransactionSampleCode = undefined;
        let recievedTransactionTestCode = undefined;
        this.props.Login.masterData.ReleaseTest[event.dataItem.ntransactionsamplecode].map(item => {
            if (item.ntransactiontestcode === event.dataItem.ntransactiontestcode) {
                item.selected = checked;
                let nPreRegNo = recievedPreRegNo !== undefined ? recievedPreRegNo : this.state.npreregno;
                let nTransactionSampleCode = recievedTransactionSampleCode !== undefined ? recievedTransactionSampleCode : this.state.ntransactionsamplecode;
                let nTransactionTestCode = recievedTransactionTestCode !== undefined ? recievedTransactionTestCode : this.state.ntransactiontestcode;
                let sendData = {
                    npreregno: nPreRegNo,
                    ntransactionsamplecode: nTransactionSampleCode,
                    ntransactiontestcode: nTransactionTestCode
                }
                // this.collectData(item)
                // ALPD-4209 (22-05-2024) Modified CollectData function for selection issue
                let sentData = this.collectData(item, sendData);
                recievedPreRegNo = sentData.npreregno;
                recievedTransactionSampleCode = sentData.ntransactionsamplecode;
                recievedTransactionTestCode = sentData.ntransactiontestcode;
            }
        })
        this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno].map(item => {

            if (item.ntransactionsamplecode === event.dataItem.ntransactionsamplecode) {
                if (this.props.Login.masterData.ReleaseTest[item.ntransactionsamplecode]) {
                    x = this.props.Login.masterData.ReleaseTest[item.ntransactionsamplecode]
                }
            }

        })
        let y = x.filter(t => t.selected === true);
        if (x.length === y.length) {
            this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno].map((t, i) => {
                if (t.ntransactionsamplecode === y[0].ntransactionsamplecode) {
                    this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno][i].selected = true
                }
            })

        }
        else {
            this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno].map((t, i) => {
                if (t.ntransactionsamplecode === event.dataItem.ntransactionsamplecode) {
                    this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno][i].selected = false
                }
            })
        }
        this.state.dataResult.data.map(item => {
            if (item.npreregno === event.dataItem.npreregno) {
                if (this.props.Login.masterData.ReleaseSubSample[item.npreregno]) {
                    x = this.props.Login.masterData.ReleaseSubSample[item.npreregno]
                }
            }

        })
        let y1 = x.filter(t => t.selected === true);
        if (x.length === y1.length) {
            this.state.dataResult.data.map((t, i) => {
                if (t.npreregno === y1[0].npreregno) {
                    this.state.dataResult.data[i].selected = true
                }
            })
        }
        else {
            this.state.dataResult.data.map((t, i) => {
                if (t.npreregno === event.dataItem.npreregno) {
                    this.state.dataResult.data[i].selected = false
                }
            })
        }
        this.setState({
            npreregno: recievedPreRegNo,
            ntransactionsamplecode: recievedTransactionSampleCode,
            ntransactiontestcode: recievedTransactionTestCode
        });
    }

    // ALPD-4209 (22-05-2024) Modified CollectData function for selection issue
    collectData = (item, recievedData) => {
        //     let npreregno = this.state.npreregno || []
        //     let ntransactionsamplecode = this.state.ntransactionsamplecode || []
        //     let ntransactiontestcode = this.state.ntransactiontestcode || []
        let npreregno = recievedData.npreregno || []
        let ntransactionsamplecode = recievedData.ntransactionsamplecode || []
        let ntransactiontestcode = recievedData.ntransactiontestcode || []
        if (item.selected === true) {
            if (!npreregno.includes(item.npreregno)) {
                npreregno.push(item.npreregno)
            }
            if (!ntransactionsamplecode.includes(item.ntransactionsamplecode)) {
                ntransactionsamplecode.push(item.ntransactionsamplecode)
            }
            if (!ntransactiontestcode.includes(item.ntransactiontestcode)) {
                ntransactiontestcode.push(item.ntransactiontestcode)
            }
        }
        else {
            const preregno = npreregno.filter(data => data !== item.npreregno);
            npreregno = preregno;
            const transactionsamplecode = ntransactionsamplecode.filter(data => data !== item.ntransactionsamplecode);
            ntransactionsamplecode = transactionsamplecode;
            const transactiontestcode = ntransactiontestcode.filter(data => data !== item.ntransactiontestcode);
            ntransactiontestcode = transactiontestcode;
        }
        //     this.setState({
        //         npreregno: checkedflag === false ? [] : npreregno,
        //         ntransactionsamplecode: checkedflag === false ? [] : ntransactionsamplecode, ntransactiontestcode: checkedflag === false ? [] : ntransactiontestcode
        //     })
        let returnData = {
            npreregno, ntransactionsamplecode, ntransactiontestcode
        }
        return returnData;
    }

    viewSelectedReport = (filedata) => {
        delete (filedata.inputData.userinfo);
        const inputParam = {
            inputData: {
                releasedcoareport: filedata.inputData,
                userinfo: this.props.Login.userInfo,
                ncontrolCode: filedata.ncontrolCode
            },
            classUrl: "release",
            operation: "view",
            methodUrl: "ReleasedCOAReport",
        }
        this.props.viewAttachment(inputParam);
    }

    childDataChange = (selectedRecord) => {
        let isInitialRender = false;
        this.setState({
            selectedRecord: {
                ...selectedRecord
            },
            isInitialRender
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.Login.openModal && (this.props.Login.isAddReleaseTestAttachment || this.props.Login.isAddReleaseTestComment || this.props.Login.loadEsignStateHandle) && nextState.isInitialRender === false &&
            (nextState.selectedRecord !== this.state.selectedRecord)) {
            return false;
        } else {
            return true;
        }
    }

    onMandatoryCheck = () => {
        const mandatoryFields = this.props.Login.loadEsignStateHandle ?
            [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_REASON", "dataField": "esignreason", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                // { "idsName": "IDS_CHECKAGREE","dataField": "agree",  "mandatoryLabel": "IDS_SELECT", "controlType": "checkbox" },

            ]
            :
            this.props.Login.isAddReleaseTestAttachment ? [
                { "idsName": "IDS_FILE", "dataField": "sfilename", "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                { "idsName": "IDS_ARNUMBER", "dataField": "sarno", "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                { "idsName": "IDS_TESTSYNONYM", "dataField": "stestsynonym", "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                //  { "idsName": "IDS_HEADER", "dataField": "sheader", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
            ] : this.props.Login.isAddReleaseTestComment ?
                this.state.selectedRecord && this.state.selectedRecord["ncommentsubtypecode"] && this.state.selectedRecord["ncommentsubtypecode"].value === 3 ?
                    [
                        { "idsName": "IDS_COMMENTNAME", "dataField": "scommentsubtype", "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" },
                        { "idsName": "IDS_ABBREVIATIONNAME", "dataField": "spredefinedname", "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" },
                        { "idsName": "IDS_COMMENTS", "dataField": "scomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                        { "idsName": "IDS_ARNUMBER", "dataField": "sarno", "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" },
                        { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" },
                        { "idsName": "IDS_TESTSYNONYM", "dataField": "stestsynonym", "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" }
                    ]
                    :
                    [
                        { "idsName": "IDS_COMMENTNAME", "dataField": "scommentsubtype", "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" },
                        { "idsName": "IDS_COMMENTS", "dataField": "scomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                        { "idsName": "IDS_ARNUMBER", "dataField": "sarno", "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" },
                        { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" },
                        { "idsName": "IDS_TESTSYNONYM", "dataField": "stestsynonym", "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" }
                    ] : (this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_ADDSAMPLE" }) && this.props.Login.masterData
                        && this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE
                        && this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue.isneedsection !== transactionStatus.YES) ?
                    [
                        { "mandatory": true, "idsName": "IDS_REPORTTEMPLATE", "dataField": "nreporttemplatecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    ] : (this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_ADDSAMPLE" }) && this.props.Login.masterData
                        && this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE
                        && this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue.isneedsection === transactionStatus.YES)
                        ? [{ "mandatory": true, "idsName": "IDS_SECTION", "dataField": "nsectioncode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },

                        { "mandatory": true, "idsName": "IDS_REPORTTEMPLATE", "dataField": "nreporttemplatecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },

                        ] : [];
        {
            (this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_ADDSAMPLE" }) && this.props.Login.masterData
                && this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE)
            && this.props.Login.masterData.ReportTypeValue && this.props.Login.masterData.ReportTypeValue.isneedsection !== transactionStatus.YES
            && this.props.Login.masterData && this.props.Login.masterData.reportTemplateList && this.props.Login.masterData.reportTemplateList.length === 0
            ?
            toast.warn(this.props.intl.formatMessage({ id: "IDS_REPORTTEMPLATEISNOTFOUND" })) :
            onSaveMandatoryValidation(this.state.selectedRecord, mandatoryFields,
                this.props.Login.loadEsignStateHandle ? this.validateEsign : this.props.Login.isAddReleaseTestAttachment ? this.onSaveTestAttachment
                    : this.props.Login.isAddReleaseTestComment ? this.onSaveTestComment : this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_ADDSAMPLE" }) ?
                        this.onSaveModalClick : "",
                (this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_ADDSAMPLE" }) ? this.props.Login.loadEsign : this.props.Login.loadEsignStateHandle));
        }
    }

    onSaveTestAttachment = (saveType, formRef) => {
        const formData = new FormData();
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.sfilename;
        const userInfo = this.props.Login.userInfo;
        let isFileEdited = transactionStatus.NO;
        let fileArray = [];
        if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
            if (this.state.operation === 'create') {
                acceptedFiles.forEach((file, index) => {
                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                    const fileName = selectedRecord.ssystemfilename && selectedRecord.ssystemfilename !== "" ?
                        selectedRecord.ssystemfilename.split('.')[0] : create_UUID();
                    const uniquefilename = fileName + '.' + fileExtension;
                    const tempData = {};
                    tempData["nformcode"] = userInfo.nformcode;
                    tempData["npreregno"] = selectedRecord.npreregno.value;
                    tempData["ntransactionsamplecode"] = selectedRecord.ntransactionsamplecode.value;
                    tempData["ntransactiontestcode"] = selectedRecord.ntransactiontestcode.value;
                    tempData["ncoaparentcode"] = this.props.Login.masterData.ncoaparentcode;
                    tempData["nusercode"] = userInfo.nusercode;
                    tempData["nuserrolecode"] = userInfo.nuserrole;
                    tempData["jsondata"] = {
                        stestsynonym: Lims_JSON_stringify(selectedRecord.ntransactiontestcode.label.trim(), false),
                        susername: Lims_JSON_stringify(userInfo.susername.trim(), false),
                        suserrolename: Lims_JSON_stringify(userInfo.suserrolename.trim(), false),
                        nfilesize: file.size,
                        ssystemfilename: uniquefilename,
                        sfilename: Lims_JSON_stringify(file.name.replaceAll('\\', '\\\\\\\\').replaceAll('\n', '\\\\n').replaceAll('"', '\\"').trim(), false),
                        slinkname: "",
                        sdescription: Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.replaceAll('\\', '\\\\\\\\').replaceAll('\n', '\\\\n').replaceAll('"', '\\"').trim() : "", false),
                        nneedreport: selectedRecord.nneedreport ? selectedRecord.nneedreport : transactionStatus.NO,
                        sheader: Lims_JSON_stringify(selectedRecord.sheader ? selectedRecord.sheader.replaceAll('\\', '\\\\\\\\').replaceAll('\n', '\\\\n').replaceAll('"', '\\"').trim() : "", false),
                        nsortorder: selectedRecord.nsortorder != "" ? selectedRecord.nsortorder : 0
                    }
                    formData.append("uploadedFile" + index, file);
                    formData.append("uniquefilename" + index, uniquefilename);
                    fileArray.push(tempData);
                });
                formData.append("filecount", acceptedFiles.length);
                isFileEdited = transactionStatus.YES;
            } else {
                acceptedFiles.forEach((file, index) => {
                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                    const fileName = selectedRecord.ssystemfilename && selectedRecord.ssystemfilename !== "" ?
                        selectedRecord.ssystemfilename.split('.')[0] : create_UUID();
                    const uniquefilename = fileName + '.' + fileExtension;
                    const tempData = {};
                    tempData["nreleasetestattachmentcode"] = selectedRecord.selectedReleaseTestAttachment && selectedRecord.selectedReleaseTestAttachment.nreleasetestattachmentcode;
                    tempData["nformcode"] = userInfo.nformcode;
                    tempData["npreregno"] = selectedRecord.npreregno.value;
                    tempData["ntransactionsamplecode"] = selectedRecord.ntransactionsamplecode.value;
                    tempData["ntransactiontestcode"] = selectedRecord.ntransactiontestcode.value;
                    tempData["ncoaparentcode"] = this.props.Login.masterData.ncoaparentcode;
                    tempData["nusercode"] = userInfo.nusercode;
                    tempData["nuserrolecode"] = userInfo.nuserrole;
                    tempData["jsondata"] = {
                        stestsynonym: Lims_JSON_stringify(selectedRecord.ntransactiontestcode.label.trim(), false),
                        susername: Lims_JSON_stringify(userInfo.susername.trim(), false),
                        suserrolename: Lims_JSON_stringify(userInfo.suserrolename.trim(), false),
                        nfilesize: file.size,
                        ssystemfilename: uniquefilename,
                        sfilename: Lims_JSON_stringify(file.name.replaceAll('\\', '\\\\\\\\').replaceAll('\n', '\\\\n').replaceAll('"', '\\"').trim(), false),
                        slinkname: "",
                        sdescription: Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.replaceAll('\\', '\\\\\\\\').replaceAll('\n', '\\\\n').replaceAll('"', '\\"').trim() : "", false),
                        nneedreport: selectedRecord.nneedreport ? selectedRecord.nneedreport : transactionStatus.NO,
                        sheader: Lims_JSON_stringify(selectedRecord.sheader ? selectedRecord.sheader.replaceAll('\\', '\\\\\\\\').replaceAll('\n', '\\\\n').replaceAll('"', '\\"').trim() : "", false),
                        nsortorder: selectedRecord.nsortorder != "" ? selectedRecord.nsortorder : 0
                    }
                    formData.append("uploadedFile" + index, file);
                    formData.append("uniquefilename" + index, uniquefilename);
                    formData.append("filecount", acceptedFiles.length);
                    isFileEdited = transactionStatus.YES;

                    fileArray.push(tempData);
                });
            }
        } else {
            let tempData = {};
            tempData["nreleasetestattachmentcode"] = selectedRecord.selectedReleaseTestAttachment && selectedRecord.selectedReleaseTestAttachment.nreleasetestattachmentcode;
            tempData["nformcode"] = userInfo.nformcode;
            tempData["npreregno"] = selectedRecord.npreregno.value;
            tempData["ntransactionsamplecode"] = selectedRecord.ntransactionsamplecode.value;
            tempData["ntransactiontestcode"] = selectedRecord.ntransactiontestcode.value;
            tempData["ncoaparentcode"] = this.props.Login.masterData.ncoaparentcode;
            tempData["nusercode"] = userInfo.nusercode;
            tempData["nuserrolecode"] = userInfo.nuserrole;
            tempData["jsondata"] = {
                stestsynonym: Lims_JSON_stringify(selectedRecord.ntransactiontestcode.label.trim(), false),
                susername: Lims_JSON_stringify(userInfo.susername.trim(), false),
                suserrolename: Lims_JSON_stringify(userInfo.suserrolename.trim(), false),
                nfilesize: selectedRecord.size,
                ssystemfilename: selectedRecord.ssystemfilename,
                sfilename: Lims_JSON_stringify(acceptedFiles.replaceAll('\\', '\\\\\\\\').replaceAll('\n', '\\\\n').replaceAll('"', '\\"').trim(), false),
                slinkname: "",
                sdescription: Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.replaceAll('\\', '\\\\\\\\').replaceAll('\n', '\\\\n').replaceAll('"', '\\"').trim() : "", false),
                nneedreport: selectedRecord.nneedreport ? selectedRecord.nneedreport : transactionStatus.NO,
                sheader: Lims_JSON_stringify(selectedRecord.sheader ? selectedRecord.sheader.replaceAll('\\', '\\\\\\\\').replaceAll('\n', '\\\\n').replaceAll('"', '\\"').trim() : "", false),
                nsortorder: selectedRecord.nsortorder != "" ? selectedRecord.nsortorder : 0
            }
            fileArray.push(tempData);
        }
        formData.append("isFileEdited", isFileEdited);
        formData.append("releasetestattachment", JSON.stringify(fileArray));
        formData.append("nattachmenttypecode", attachmentType.FTP);
        formData.append("ncoaparentcode", this.props.Login.masterData.ncoaparentcode);
        formData.append("ncontrolcode", this.props.Login.ncontrolCode);
        formData.append("userinfo", JSON.stringify({
            ...userInfo,
            sformname: Lims_JSON_stringify(userInfo.sformname),
            smodulename: Lims_JSON_stringify(userInfo.smodulename),
            slanguagename: Lims_JSON_stringify(userInfo.slanguagename)
        }));

        const inputParam = {
            inputData: {
                "userinfo": {
                    ...userInfo,
                    sformname: Lims_JSON_stringify(userInfo.sformname),
                    smodulename: Lims_JSON_stringify(userInfo.smodulename),
                    slanguagename: Lims_JSON_stringify(userInfo.slanguagename)
                },
                doAction: "editReleaseTestAttachment",
                formData: formData,
                isFileupload: true,
                operation: this.props.Login.operation,
                classUrl: "release",
                saveType: saveType,
                formRef: formRef,
                methodUrl: "ReleaseTestAttachment",
                selectedRecord: this.state.selectedRecord,
                screenName: this.props.Login.screenName,
                masterData: this.props.Login.masterData
            }
        };

        if (showEsign(this.props.Login.userRoleControlRights, userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    screenData: { inputParam },
                    loadEsignStateHandle: true,
                    ncontrolcode: this.props.Login.ncontrolCode
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.onSaveReleaseTestAttachment(inputParam);
        }
    }

    deleteReleaseTestAttachment = (deleteParam) => {
        const url = "release/deleteReleaseTestAttachment";
        if (this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus !== transactionStatus.RELEASED &&
            this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus !== transactionStatus.PRELIMINARYRELEASE) {
            let releasetestattachment = {
                "ncoaparentcode": deleteParam.selectedRecord.ncoaparentcode,
                "npreregno": deleteParam.selectedRecord.npreregno,
                "ntransactionsamplecode": deleteParam.selectedRecord.ntransactionsamplecode,
                "ntransactiontestcode": deleteParam.selectedRecord.ntransactiontestcode,
                "nreleasetestattachmentcode": deleteParam.selectedRecord.nreleasetestattachmentcode
            }
            let inputParam = {
                inputData: {
                    releasetestattachment,
                    url,
                    userinfo: this.props.Login.userInfo,
                    screenName: this.props.Login.screenName,
                    masterData: this.props.Login.masterData,
                    doAction: "deleteReleaseTestAttachment",
                    selectedRecord: this.state.selectedRecord
                }
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        screenData: { inputParam },
                        loadEsignStateHandle: true,
                        ncontrolcode: deleteParam.ncontrolCode
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.onDeleteReleaseTestAttachment(inputParam);
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTCORRECTEDRECORD" }));
        }
    }

    onSaveTestComment = (saveType, formRef) => {
        const formData = new FormData();
        const selectedRecord = this.state.selectedRecord;
        const userInfo = this.props.Login.userInfo;
        const inputData = {};
        let commentArray = [];
        let comment = {};
        comment["nreleasetestcommentcode"] = selectedRecord.selectedReleaseTestComment && selectedRecord.selectedReleaseTestComment.nreleasetestcommentcode
        comment["nformcode"] = userInfo.nformcode;
        comment["npreregno"] = selectedRecord.npreregno.value;
        comment["ntransactionsamplecode"] = selectedRecord.ntransactionsamplecode.value;
        comment["ntransactiontestcode"] = selectedRecord.ntransactiontestcode.value;
        comment["ncoaparentcode"] = this.props.Login.masterData.ncoaparentcode;
        comment["nusercode"] = userInfo.nusercode;
        comment["nuserrolecode"] = userInfo.nuserrole;
        comment["ncommentsubtypecode"] = selectedRecord.ncommentsubtypecode && selectedRecord.ncommentsubtypecode.value;
        comment["nsampletestcommentscode"] = selectedRecord.nsampletestcommentscode && selectedRecord.nsampletestcommentscode.value !== "" ? selectedRecord.nsampletestcommentscode.value : '-1';
        comment["jsondata"] = {
            scomments: selectedRecord.scomments ? selectedRecord.scomments : "",
            nneedreport: selectedRecord.nneedreport ? selectedRecord.nneedreport : transactionStatus.NO,
            stestsynonym: selectedRecord.stestsynonym,
            scommentsubtype: selectedRecord.ncommentsubtypecode && selectedRecord.ncommentsubtypecode.label,
            spredefinedname: selectedRecord.nsampletestcommentscode && selectedRecord.nsampletestcommentscode.label !== "" ? selectedRecord.nsampletestcommentscode.label : '-',
            ncommentsubtypecode: selectedRecord.ncommentsubtypecode && selectedRecord.ncommentsubtypecode,
            nsampletestcommentscode: selectedRecord.nsampletestcommentscode ? selectedRecord.nsampletestcommentscode : '-'
        }
        comment["nsamplecommentscode"] = selectedRecord.nsamplecommentscode ? selectedRecord.nsamplecommentscode.value : -1;
        commentArray.push(comment);
        inputData["testcomment"] = commentArray;
        // }
        formData.append("userinfo", JSON.stringify({
            ...userInfo,
            sformname: Lims_JSON_stringify(userInfo.sformname),
            smodulename: Lims_JSON_stringify(userInfo.smodulename),
            slanguagename: Lims_JSON_stringify(userInfo.slanguagename)
        }));
        formData.append("releasetestcomment", JSON.stringify(commentArray));
        formData.append("ncoaparentcode", this.props.Login.masterData.ncoaparentcode);
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...userInfo,
                    sformname: Lims_JSON_stringify(userInfo.sformname),
                    smodulename: Lims_JSON_stringify(userInfo.smodulename),
                    slanguagename: Lims_JSON_stringify(userInfo.slanguagename)
                },
                doAction: "editReleaseTestComment",
                formData: formData,
                operation: this.props.Login.operation,
                classUrl: "release",
                saveType: saveType,
                formRef: formRef,
                methodUrl: "ReleaseTestComment",
                selectedRecord: this.state.selectedRecord,
                screenName: this.props.Login.screenName,
                masterData: this.props.Login.masterData
            }
        };
        if (showEsign(this.props.Login.userRoleControlRights, userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsignStateHandle: true,
                    screenData: { inputParam },
                    ncontrolcode: this.props.Login.ncontrolCode
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.onSaveReleaseTestComment(inputParam);
        }
    }
    ReleaseComments = (inputParam) => {
        const ncoaParentCode = this.props.Login.masterData.ncoaparentcode.split(",");
        //let selectedReleaseHistory = [];
        // this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && 
        //this.props.Login.masterData.selectedReleaseHistory.map(item => ncoaParentCode.includes(item.ncoaparentcode.toString()) && selectedReleaseHistory.push(item));
        let masterData = this.props.Login.masterData;
        masterData["selectedReleaseHistory"] = [];
        masterData["selectedReleaseHistory"].push(inputParam["createReleaseComment"])
        //const resultArray = selectedReleaseHistory.length > 0 ? [...new Set(selectedReleaseHistory.map(item => item["ntransactionstatus"]))] : [] ;
        //  if(resultArray[0] !== transactionStatus.RELEASED){
        let inputParamData = {
            inputData: {
                ncoaparentcode: inputParam.createReleaseComment.ncoaparentcode,
                userinfo: this.props.Login.userInfo
            },
            masterData: { ...this.props.Login.masterData },
            selectedRecord: this.state.selectedRecord,
            screenName: this.props.intl.formatMessage({ id: "IDS_RELEASECOMMENTS" })
        }
        this.props.openReleaseComments(inputParamData);
        // }
        // else{
        //  toast.warn(this.props.intl.formatMessage({ id: "IDS_RELEASEDRECORDNOTALLOWEDTOADDCOMMENT" }));
        // }
    }
    onSaveReleaseComments = (saveType, data) => {
        let masterData = this.props.Login.masterData;
        let controlId = this.state.controlMap.has("ReportComment") && this.state.controlMap.get("ReportComment").ncontrolcode;
        let inputParam = {
            inputData: {
                ncoaparentcode: this.props.Login.masterData && this.props.Login.masterData.selectedReleaseHistory && this.props.Login.masterData.selectedReleaseHistory.length > 0 ?
                    this.props.Login.masterData.selectedReleaseHistory[0].ncoaparentcode : -1,
                //nreleasetestcommentcode: this.state.selectedRecord && this.state.selectedRecord.nreleasetestcommentcode || -1,
                sreleasecomments: this.state.selectedRecord && this.state.selectedRecord.sreleasecomments || "",
                userinfo: this.props.Login.userInfo,
                doAction: "createReleaseComment"
            },
            masterData: masterData,
            selectedRecord: this.state.selectedRecord
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, controlId)) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    modalShow: false,
                    openModal: true,
                    ncontrolcode: controlId,
                    screenData: { inputParam, masterData },
                    saveType
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.SaveReleaseComment(inputParam)
        }
    }
    deleteReleaseTestComment = (deleteParam) => {
        const url = "release/deleteReleaseTestComment";
        if (this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus !== transactionStatus.RELEASED &&
            this.props.Login.masterData.selectedReleaseHistory[0].ntransactionstatus !== transactionStatus.PRELIMINARYRELEASE) {
            let releasetestcomment = {
                "ncoaparentcode": deleteParam.selectedRecord.ncoaparentcode,
                "npreregno": deleteParam.selectedRecord.npreregno,
                "ntransactionsamplecode": deleteParam.selectedRecord.ntransactionsamplecode,
                "ntransactiontestcode": deleteParam.selectedRecord.ntransactiontestcode,
                "nreleasetestcommentcode": deleteParam.selectedRecord.nreleasetestcommentcode
            }
            let inputParam = {
                inputData: {
                    releasetestcomment,
                    url,
                    userinfo: this.props.Login.userInfo,
                    screenName: this.props.Login.screenName,
                    masterData: this.props.Login.masterData,
                    doAction: "deleteReleaseTestComment",
                    selectedRecord: this.state.selectedRecord
                }
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsignStateHandle: true,
                        screenData: { inputParam },
                        ncontrolcode: deleteParam.ncontrolCode
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.onDeleteReleaseTestComment(inputParam);
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTCORRECTEDRECORD" }));
        }
    }
}

export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignCredential, filterColumnData,
    getApprovedRecordsAsDraft, getReleasedRegistrationType, getReleasedRegistrationSubType,
    getReleasedFilterStatus, getReleasedApprovalVersion, getReleasedFilterBasedTest, getReleasedSample,
    getApprovedSample,
    //, generateReleasedReport, getReleasedDataDetails, getApprovedProjectByProjectType, getApprovedProjectType, getReportForPortal,
    previewAndFinalReport, getRemoveApprovedSample, getDeleteApprovedSample, UpdateApprovedSample, getEditApprovedSample, getSectionForSectionWise, getreportcomments,
    fetchReportInfoReleaseById, UpdateReportComments
    , generateReleasedReport, getReleasedDataDetails, getApprovedProjectByProjectType, getApprovedProjectType, getReportForPortal, getResultCorrectionData,
    //previewAndFinalReport, getRemoveApprovedSample, getDeleteApprovedSample, UpdateApprovedSample, getEditApprovedSample,
    getSectionForSectionWise, fetchParameterById, updateCorrectionStatus, validateEsignforRelease, viewReportHistory, viewAttachment, versionHistory,
    downloadVersionReport, viewReleaseTestAttachment, downloadHistory, getPatientFilterExecuteData, rearrangeDateFormatforKendoDataTool,
    getPatientWiseSample, preliminaryReport, releaseReportHistory, onSaveReleaseTestAttachment, onDeleteReleaseTestAttachment, onSaveReleaseTestComment,
    onDeleteReleaseTestComment, generatereport, editReportTemplate, SaveReportTemplate, deleteSamples, filterTransactionList, validationforAppendSamples,
    getReleaseFilter, SaveReleaseComment, openReleaseComments
})(injectIntl(Release));