import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { toast } from 'react-toastify';
import { convertDateValuetoString, rearrangeDateFormat, constructOptionList, getControlMap, sortData, getSameRecordFromTwoArrays, showEsign, convertDateTimetoStringDBFormat, validatePhoneNumber } from '../../components/CommonScript';
import { ListWrapper } from '../../components/client-group.styles';
import { Button, Col, Row, Card, Nav } from 'react-bootstrap';
import {
    updateStore, callService, crudMaster, validateEsignforJobAllocation, ReceiveinLabStatusWise, getRegTypeJobAllocation, getRegSubTypeJobAllocation,
    getAppConfigVersionJobAllocation, getFilterStatusJobAllocation, getSectionJobAllocation, getTestStatusJobAllocation, getFilterStatusSectionJobAllocation, getDesignTemplateJobAllocation,
    getJobAllcationFilterSubmit, getJobAllocationSubSampleDetail, getJobAllocationTestDetail, getTestChildTabDetailJobAllocation, getAllottedTestWise, getAllotAnotherUserTestWise, getInstrumentName, getInstrumentId, getUsers,
    ViewAnalystCalendar, CancelTestWise, AllotJobAction, AllotAnotherUserAction,
    RescheduleJobAction, getSubSampleChildTabDetail, getSampleChildTabDetail, getCommentsCombo,
    getAttachmentCombo, filterTransactionList, AllotJobActionCalendar,getSectionTest,
    updateSectionJobAllocation,getUsersSection,getJobAllcationFilterDetail
} from '../../actions';
import JobAllocationFilter from './JobAllocationFilter';
import SplitterLayout from "react-splitter-layout";
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import { transactionStatus, SideBarSeqno, SideBarTabIndex, designProperties } from '../../components/Enumeration';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { ProductList } from '../testmanagement/testmaster-styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faEye, faLink, faChevronRight, faComments, faClock, faCalendar, faBolt } from '@fortawesome/free-solid-svg-icons';
import { ContentPanel } from '../../components/App.styles';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { ReactComponent as ReceivedInLab } from '../../assets/image/receivedlab.svg';
import { ReactComponent as Allotted } from '../../assets/image/allotted.svg';
import { ReactComponent as AnotherUser } from '../../assets/image/allotanotheruser.svg';
import { ReactComponent as Reject } from '../../assets/image/reject.svg';
import { ReactComponent as SectionChange } from '../../assets/image/section-change.svg';
import { ReactComponent as AllotJob } from '../../assets/image/allotjob.svg';

import fullviewExpand from '../../assets/image/fullview-expand.svg';
import fullviewCollapse from '../../assets/image/fullview-collapse.svg';
// import { ReactComponent as Analystcalendar } from '../../assets/image/Analystcalendar.svg';
// import { ReactComponent as Instrumentcalendar } from '../../assets/image/instrumentcalendar.svg';
import SlideOutModal from "../../components/slide-out-modal/SlideOutModal";
import Esign from "../audittrail/Esign";
import AddJobAllocation from './AddJobAllocation';
import AllotAnotherUser from './AllotAnotherUser';
import ScheduleSection  from './ScheduleSection';
import SampleInfoView from '../approval/SampleInfoView';
import SampleInfoGrid from '../approval/SampleInfoGrid';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import Attachments from '../attachmentscomments/attachments/Attachments';
import Comments from '../attachmentscomments/comments/Comments';
import { onSaveSampleAttachment, onSaveTestAttachment, onSaveSubSampleAttachment } from '../attachmentscomments/attachments/AttachmentFunctions';
import { onSaveSampleComments, onSaveTestComments, onSaveSubSampleComments } from '../attachmentscomments/comments/CommentFunctions';
// import AnalystCalenderBasedOnUser from './AnalystCalenderBasedOnUser'
import NewJobAlloct from '../joballocation/calender/NewJobAlloct';
import { checkBoxOperation } from '../../components/Enumeration';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import { ReactComponent as SaveIcon } from '../../assets/image/save_icon.svg';
import ModalShow from '../../components/ModalShow';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomPopover from '../../components/customPopover';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class JobAllocation extends React.Component {
    constructor(props) {
        super(props)
        this.searchSampleRef = React.createRef();
        this.searchSubSampleRef = React.createRef();
        this.searchTestRef = React.createRef();
        this.formRef = React.createRef();
        this.state = {
            sampleGridDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            testGridDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            sampleAttachmentDataState: {},
            sampleCommentDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            subsampleAttachmentDataState: {},
            subsampleCommentDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            testAttachmentDataState: {},
            testCommentDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            testViewDataState: {},
            dataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            userRoleControlRights: [],
            controlMap: new Map(),
            masterStatus: "",
            error: "",
            oldComboData: {},
            selectedRecord: {},
            filterSampleParam: {},
            filterSubSampleParam: {},
            filterTestParam: {},
            operation: "",
            showTest: true,
            showSample: false,
            showSubSample: false,
            sampleListColumns: [],
            subSampleListColumns: [],
            testListColumns: [],
            TableExpandableItem: [],
            SingleItem: [],
            testItem: [],
            SampleGridItem: [],
            SampleGridExpandableItem: [],
            sampleListMainField: [],
            subSampleListMainField: [],
            testListMainField: [],
            testMoreField: [],
            firstPane: 0,
            paneHeight: 0,
            secondPaneHeight: 0,
            tabPane: 0,
            SampletypeList: [],
            RegistrationTypeList: [],
            RegistrationSubTypeList: [],
            FilterStatusList: [],
            ConfigVersionList: [],
            UserSectionList: [],
            TestList: [],
            DynamicDesignMappingList: [],
            sampleskip: 0,
            sampletake: this.props.Login.settings && this.props.Login.settings[3],
            subsampleskip: 0,
            subsampletake: this.props.Login.settings && this.props.Login.settings[12],
            testskip: 0,
            testtake: this.props.Login.settings && this.props.Login.settings[12],
            splitChangeWidthPercentage: 28.6,
            sampleSearchField: [],
            subsampleSearchField: [],
            testSearchField: [],
            DynamicSampleColumns: [],
            DynamicSubSampleColumns: [],
            DynamicTestColumns: [],
            enableAutoClick: false,
            enablePropertyPopup: false,
            propertyPopupWidth: "60",
            data: [],
            subSampleGetParam: {},
            openAnalystCalendar: false,
            data: []
        }
    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "") {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.multilingualMsg !== undefined && props.Login.multilingualMsg !== "") {
            toast.warn(props.intl.formatMessage({ id: props.Login.multilingualMsg }));
            props.Login.multilingualMsg = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }

        return null;
    }

    componentDidMount() {
        if (this.parentHeight) {
            const height = this.parentHeight.clientHeight;
            this.setState({
                firstPane: height - 80,
                parentHeight: height - 50
            });
        }
    }

    parentScheduleState = (data) => {
        this.setState({ data: data })
        // this.state.
    }


    parentSelectRecord = (data, analyst) => {
        this.setState({ calenderSelectedRecord: data, data: analyst })
    }


    shouldComponentUpdate(nextProps, nextState) {
        // Rendering the component only if 
        // passed props value is changed
        if (nextState.data !== this.state.data) {
            return false;
        } else if (nextState.calenderSelectedRecord !== this.state.calenderSelectedRecord) {
            return false;
        }
        else {
            return true;
        }
    }


    // openAnalystCalendar = () => {
    //     this.setState({ openAnalystCalendar: true })
    // }



    render() {
        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        let JA_SampleList = this.props.Login.masterData.JA_SAMPLE ? sortData(this.props.Login.masterData.JA_SAMPLE, 'descending', 'nregistrationsectioncode') : [];
        let JA_SubSampleList = this.props.Login.masterData.JA_SUBSAMPLE ? this.props.Login.masterData.JA_SUBSAMPLE : [];
        let JA_TestList = this.props.Login.masterData.JA_TEST ? sortData(this.props.Login.masterData.JA_TEST, 'descending', 'ntransactiontestcode') : [];

        const receiveId = this.state.controlMap.has("ReceiveinLab") ? this.state.controlMap.get("ReceiveinLab").ncontrolcode : -1;
        const allotId = this.state.controlMap.has("Allotted") ? this.state.controlMap.get("Allotted").ncontrolcode : -1;
        const anotherUserId = this.state.controlMap.has("AllotAnotherUser") ? this.state.controlMap.get("AllotAnotherUser").ncontrolcode : -1;
        const rescheduleId = this.state.controlMap.has("Reschedule") ? this.state.controlMap.get("Reschedule").ncontrolcode : -1;
        const cancelId = this.state.controlMap.has("Cancel") ? this.state.controlMap.get("Cancel").ncontrolcode : -1;
        const allotCalenderId = this.state.controlMap.has("AllotCalender") ? this.state.controlMap.get("AllotCalender").ncontrolcode : -1;
        const testSectionChangeID = this.state.controlMap.has("ChangeTestSection") ? this.state.controlMap.get("ChangeTestSection").ncontrolcode : -1;
        const filterNameId = this.state.controlMap.has("FilterName") ? this.state.controlMap.get("FilterName").ncontrolcode : -1;
        const filterDetailId = this.state.controlMap.has("FilterDetail") ? this.state.controlMap.get("FilterDetail").ncontrolcode : -1;

        let subSampleGetJAParam = {
            masterData: this.props.Login.masterData,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
            ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
            // ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode,
            ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode === 0 ? this.props.Login.masterData.Test && this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.realTestValue.ntestcode) : null,
            fromdate: obj.fromDate,
            todate: obj.toDate,
            activeTestTab: this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS",
            activeSampleTab: this.props.Login.activeTestTab || "IDS_SAMPLEATTACHMENTS",
            activeSubSampleTab: this.props.Login.activeTestTab || "IDS_SUBSAMPLEATTACHMENTS",
            sampleskip: this.state.sampleskip,
            sampletake: this.state.sampletake,
            testskip: this.state.testskip,
            testtake: this.state.testtake,
            subsampleskip: this.state.subsampleskip,
            subsampletake: this.state.subsampleskip,
            testCommentDataState: this.state.testCommentDataState,
            ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode,
            searchSubSampleRef: this.searchSubSampleRef,
            searchTestRef: this.searchTestRef,
            nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
            nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
            //checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 4 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 4 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
        }

        let testGetJAParam = {
            masterData: this.props.Login.masterData,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
            ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
            //ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode,
            ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode === 0 ? this.props.Login.masterData.Test && this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.realTestValue.ntestcode) : null,
            npreregno: this.props.Login.masterData.JASelectedSample && this.props.Login.masterData.JASelectedSample.map(sample => sample.npreregno).join(","),
            nsectioncode: this.props.Login.masterData.JASelectedSubSample && this.props.Login.masterData.JASelectedSubSample.map(sample => sample.nsectioncode).join(","),
            activeTestTab: this.props.Login.activeTestTab || 'IDS_TESTATTACHMENTS',
            activeSampleTab: this.props.Login.activeTestTab || 'IDS_SAMPLEINFO',
            activeSubSampleTab: this.props.Login.activeTestTab || "IDS_SUBSAMPLEATTACHMENTS",
            testCommentDataState: this.state.testCommentDataState,
            ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode,
            nneedsubsample: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
            testskip: this.state.testskip,
            testtake: this.state.testtake,
            testCommentDataState: this.state.testCommentDataState,
            // activeTabIndex: this.state.enableAutoClick ? 4 : this.state.activeTabIndex ? this.state.activeTabIndex : undefined
            activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 4 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 4 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,

        }

        let testChildGetJAParam = {
            masterData: this.props.Login.masterData,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
            ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
            ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode === 0 ? this.props.Login.masterData.Test && this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.realTestValue.ntestcode) : null,
            npreregno: this.props.Login.masterData.JASelectedSample && this.props.Login.masterData.JASelectedSample.map(sample => sample.npreregno).join(","),
            ntransactionsamplecode: this.props.Login.masterData.JASelectedSubSample && this.props.Login.masterData.JASelectedSubSample.map(sample => sample.ntransactionsamplecode).join(","),
            activeTestTab: this.props.Login.activeTestTab || 'IDS_TESTATTACHMENTS',
            fromdate: obj.fromDate,
            todate: obj.toDate,
            testskip: this.state.testskip,
            testtake: this.state.testtake,
            testCommentDataState: this.state.testCommentDataState,
            ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode,
            // activeTabIndex: this.state.enableAutoClick ? 4 : this.state.activeTabIndex ? this.state.activeTabIndex : undefined
            activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 4 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 4 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
        }

        this.postParamList = [
            {
                filteredListName: "searchedSample",
                clearFilter: "no",
                searchRef: this.searchSampleRef,
                primaryKeyField: "nregistrationsectioncode",
                fetchUrl: "joballocation/getJobAllocationSubSampleDetails",
                fecthInputObject: {
                    ...this.state.subSampleGetParam,
                    testskip: this.state.testskip,
                    subsampleskip: this.state.subsampleskip,
                    searchSubSampleRef: this.searchSubSampleRef,
                    searchTestRef: this.searchTestRef,
                    testCommentDataState: this.state.testCommentDataState,
                    testAttachmentDataState: this.state.testAttachmentDataState,
                    sampleGridDataState: this.state.sampleGridDataState,
                    testGridDataState: this.state.testGridDataState
                },
                childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" },
                { ref: this.searchTestRef, childFilteredListName: "searchedTest" }],
                selectedObject: "JASelectedSample",
                inputListName: "JA_SAMPLE",
                updatedListname: "JASelectedSample",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "SampleType", "realRegTypeValue", "RegTypeValue", "RegType", "realRegSubTypeValue", "RegSubTypeValue", "RegSubType",
                    "realDesignTemplateMappingValue", "DesignTemplateMappingValue", "DynamicDesignMapping", "realFilterStatusValue", "FilterStatusValue", "FilterStatus",
                    "realApprovalVersionValue", "ApprovalVersionValue", "ApprovalVersion", "realUserSectionValue", "UserSectionValue", "UserSection",
                    "realTestValue", "TestValue", "Test", "fromDate", "toDate"]
            },
            {
                filteredListName: "searchedSubSample",
                clearFilter: "no",
                searchRef: this.searchSubSampleRef,
                primaryKeyField: "ntransactionsamplecode",
                fetchUrl: "joballocation/",
                fecthInputObject: {
                    ...this.state.testGetJAParam,
                    testskip: this.state.testskip,
                    subsampleskip: this.state.subsampleskip,
                    searchSubSampleRef: this.searchSubSampleRef,
                    searchTestRef: this.searchTestRef,
                    testCommentDataState: this.state.testCommentDataState,
                    testAttachmentDataState: this.state.testAttachmentDataState,
                    sampleGridDataState: this.state.sampleGridDataState,
                    testGridDataState: this.state.testGridDataState

                },
                childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedTest" }],
                selectedObject: "JASelectedSubSample",
                inputListName: "JA_SUBSAMPLE",
                updatedListname: "JASelectedSubSample",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "SampleType", "realRegTypeValue", "RegTypeValue", "RegType", "realRegSubTypeValue", "RegSubTypeValue", "RegSubType",
                    "realDesignTemplateMappingValue", "DesignTemplateMappingValue", "DynamicDesignMapping", "realFilterStatusValue", "FilterStatusValue", "FilterStatus",
                    "realApprovalVersionValue", "ApprovalVersionValue", "ApprovalVersion", "realUserSectionValue", "UserSectionValue", "UserSection",
                    "realTestValue", "TestValue", "Test", "fromDate", "toDate"]
            },
            {
                filteredListName: "searchedTest",
                updatedListname: "JA_TEST",
                clearFilter: "no",
                searchRef: this.searchTestRef,
                primaryKeyField: "ntransactiontestcode",
                fetchUrl: "approval/getApprovalTest",
                fecthInputObject: {
                    ...this.state.testGetJAParam,
                    searchTestRef: this.searchTestRef,
                    testskip: this.state.testskip,
                    subsampleskip: this.state.subsampleskip,
                    testGridDataState: this.state.testGridDataState
                },
                selectedObject: "JASelectedTest",
                inputListName: "JASelectedTest",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "SampleType", "realRegTypeValue", "RegTypeValue", "RegType", "realRegSubTypeValue", "RegSubTypeValue", "RegSubType",
                    "realDesignTemplateMappingValue", "DesignTemplateMappingValue", "DynamicDesignMapping", "realFilterStatusValue", "FilterStatusValue", "FilterStatus",
                    "realApprovalVersionValue", "ApprovalVersionValue", "ApprovalVersion", "realUserSectionValue", "UserSectionValue", "UserSection",
                    "realTestValue", "TestValue", "Test", "fromDate", "toDate"]


            }
        ];



        if (this.props.Login.operation === "AllotJob" || this.props.Login.operation === "Reschedule") {
            
               
            if (this.state.selectedRecord.ninstrumentcatcode && this.state.selectedRecord.ninstrumentcatcode.value === transactionStatus.NA) {
                
                this.validationColumnList = [

                    this.props.Login.operation === "Reschedule"?{ "idsName": "IDS_SECTION", "dataField": "nsectioncode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                  :"",


                    { "idsName": "IDS_USERS", "dataField": "nusercode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_STARTDATETIME", "dataField": "duserblockfromdatetime", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                    { "idsName": "IDS_HOLDDURATION", "dataField": "suserholdduration", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                    { "idsName": "IDS_PERIOD", "dataField": "nuserperiodcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },

                ]
              
            } else {
                this.validationColumnList = [
                    this.props.Login.operation === "Reschedule"?{ "idsName": "IDS_SECTION", "dataField": "nsectioncode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                    :"",

                    { "idsName": "IDS_USERS", "dataField": "nusercode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_STARTDATETIME", "dataField": "duserblockfromdatetime", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                    { "idsName": "IDS_HOLDDURATION", "dataField": "suserholdduration", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                    { "idsName": "IDS_PERIOD", "dataField": "nuserperiodcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    this.state.selectedRecord && this.state.selectedRecord["ninstrumentcatcode"] && this.state.selectedRecord["ninstrumentcatcode"].value > 0 
                        ? { "idsName": "IDS_INSTRUMENTCATEGORY", "dataField": "ninstrumentcatcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" } : "",
                    { "idsName": "IDS_INSTRUMENTNAME", "dataField": "ninstrumentnamecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_STARTDATETIME", "dataField": "dinstblockfromdatetime", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                    { "idsName": "IDS_HOLDDURATION", "dataField": "sinstrumentholdduration", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                    { "idsName": "IDS_PERIOD", "dataField": "ninstrumentperiodcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },

                ]
            
            }
        } else if (this.props.Login.operation === "AllotJobCalendar") {
            this.validationColumnList = [
                { "idsName": "IDS_USERS", "dataField": "nusercode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            ]
        }

        else if (this.props.Login.operation === "AllotAnotherUser") {
            this.validationColumnList = [
                { "idsName": "IDS_USERS", "dataField": "nusercode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_STARTDATETIME", "dataField": "duserblockfromdatetime", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                { "idsName": "IDS_HOLDDURATION", "dataField": "suserholdduration", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_PERIOD", "dataField": "nuserperiodcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },

            ]
        }else if(this.props.Login.operation === "updateSection"){
            this.validationColumnList = [
                { "idsName": "IDS_SECTION", "dataField": "nsectioncode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },

            ]  
        }

        const mandatoryFields = [];
        if (this.validationColumnList && this.validationColumnList.length > 0) {
            this.validationColumnList.forEach(item => item.mandatory === true ?
                mandatoryFields.push(item) : ""
            );
        }
        const mandatoryFieldsFilter = [{ "mandatory": true, "idsName": "IDS_FILTERNAME", "dataField": "sfiltername", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]

        let breadCrumbData = [];
        breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": obj.breadCrumbFrom
            },
            {
                "label": "IDS_TO",
                "value": obj.breadCrumbto
            },
            {
                "label": "IDS_REGTYPE",
                "value": this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.sregtypename || "NA" :
                    this.props.Login.masterData.RegTypeValue ? this.props.Login.masterData.RegTypeValue.sregtypename || "NA" : "NA"
            },
            {
                "label": "IDS_REGSUBTYPE",
                "value": this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.sregsubtypename || "NA" :
                    this.props.Login.masterData.RegSubTypeValue ? this.props.Login.masterData.RegSubTypeValue.sregsubtypename : "NA"
            },
            {
                "label": "IDS_TESTSTATUS",
                "value": this.props.Login.masterData.realFilterStatusValue ? this.props.Login.masterData.realFilterStatusValue.stransdisplaystatus || "NA" :
                    this.props.Login.masterData.FilterStatusValue ? this.props.Login.masterData.FilterStatusValue.stransdisplaystatus || "NA" : "NA"
            },
            {
                "label": "IDS_SECTION",
                "value": this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.ssectionname || "NA" :
                    this.props.Login.masterData.UserSectionValue ? this.props.Login.masterData.UserSectionValue.ssectionname || "NA" : "NA"
            },
            {
                "label": "IDS_TEST",
                "value": this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.stestsynonym || "NA" :
                    this.props.Login.masterData.TestValue ? this.props.Login.masterData.TestValue.stestsynonym || "NA" : "NA"
            }

        ];


        const testDesign = <ContentPanel>
            <Card>
                <Card.Header style={{ borderBottom: "0px" }}>
                    <span style={{ display: "inline-block" }}>
                        <h4 className="card-title">{this.props.intl.formatMessage({ id: "IDS_TEST" })}</h4>
                    </span>


                </Card.Header>
                <Card.Body className='p-0 sm-pager' >
                    <TransactionListMasterJsonView
                        cardHead={94}
                        masterList={this.props.Login.masterData.searchedTest || JA_TestList}
                        selectedMaster={this.props.Login.masterData.JASelectedTest}
                        primaryKeyField="ntransactiontestcode"
                        getMasterDetail={(event, status) => { this.props.getTestChildTabDetailJobAllocation(event, status); this.changePropertyView(2, event, "click") }}
                        inputParam={testChildGetJAParam}
                        additionalParam={[]}
                        mainField="stestsynonym"
                        selectedListName="JASelectedTest"
                        objectName="test"
                        listName="IDS_TEST"
                        pageSize={this.props.Login.settings && this.props.Login.settings[13].split(",").map(setting => parseInt(setting))}
                        showStatusLink={true}
                        subFieldsLabel={true}
                        statusFieldName="stransdisplaystatus"
                        statusField="ntransactionstatus"
                        needMultiSelect={true}
                        subFields={this.state.testListColumns || []}
                        moreField={this.state.testMoreField}
                        needValidation={false}
                        showStatusName={true}
                        needFilter={false}
                        filterColumnData={this.props.filterTransactionList}
                        searchListName="searchedTest"
                        searchRef={this.searchTestRef}
                        filterParam={this.state.filterTestParam}
                        selectionField="ntransactionstatus"
                        selectionFieldName="stransdisplaystatus"
                        childTabsKey={["TestView", "RegistrationTestComment", "RegistrationTestAttachment"]}
                        handlePageChange={this.handleTestPageChange}
                        buttonCount={5}
                        skip={this.state.testskip}
                        take={this.state.testtake}
                        showMoreResetList={true}
                        showMoreResetListName="JA_SAMPLE"
                        selectionList={this.props.Login.masterData.realFilterStatusValue
                            && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus
                            === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                        selectionColorField="scolorhexcode"
                        commonActions={
                            <>
                                <ProductList className="d-flex product-category float-right">
                                <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_CHANGESECTION" })}
                                        hidden={this.state.userRoleControlRights.indexOf(testSectionChangeID) === -1}
                                        onClick={() => this.updateSection(testSectionChangeID, this.state.testskip, this.state.testtake,'updateSection')} >
                                         <SectionChange className="custom_icons" width="20" height="30" />

                                    </Nav.Link>

                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_ALLOTJOB" })}
                                        hidden={this.state.userRoleControlRights.indexOf(allotId) === -1}
                                        onClick={() => this.AllotJobStatus(allotId,this.state.testskip, this.state.testtake,'AllotJob', 1)} >  
                                        {/* <Allotted className="custom_icons" width="20" height="30" /> */}
                                        <AllotJob className="custom_icons" width="20" height="20" />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_ALLOTJOBINCALENDER" })}
                                        hidden={this.state.userRoleControlRights.indexOf(allotCalenderId) === -1}
                                        onClick={() => this.AllotJobStatus(allotCalenderId,this.state.testskip, this.state.testtake,'AllotJobCalendar', 2)} >
                                        <FontAwesomeIcon icon={faCalendar} />
                                    </Nav.Link>

                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_ALLOTANOTHERUSER" })}
                                        hidden={this.state.userRoleControlRights.indexOf(anotherUserId) === -1}
                                        onClick={() => this.AllotAnotherUserStatus(anotherUserId, this.state.testskip, this.state.testtake)} >
                                        <AnotherUser className="custom_icons" width="20" height="30" />
                                    </Nav.Link>

                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_RESCHEDULE" })}
                                        hidden={this.state.userRoleControlRights.indexOf(rescheduleId) === -1}
                                        onClick={() => this.AllotJobStatus(rescheduleId,this.state.testskip, this.state.testtake,'Reschedule',1)} >
                                        <FontAwesomeIcon icon={faClock} />
                                    </Nav.Link>



                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                        hidden={this.state.userRoleControlRights.indexOf(cancelId) === -1}
                                        onClick={() => this.CancelStatus(cancelId, this.state.testskip, this.state.testtake)} >
                                        <Reject className="custom_icons" width="15" height="15" />
                                    </Nav.Link>

                                 
                                </ProductList>

                            </>
                        }
                    />
                </Card.Body>
            </Card>
        </ContentPanel>

        let mainDesign = "";
        if (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) {
            mainDesign = <SplitterLayout borderColor="#999"
                primaryIndex={1} percentage={true}
                secondaryInitialSize={this.state.splitChangeWidthPercentage}
                primaryMinSize={40}
                secondaryMinSize={30}
            >
                <Card >
                    <Card.Header style={{ borderBottom: "0px" }}>
                        <span style={{ display: "inline-block", marginTop: "1%" }}>
                            <h4 className="card-title">{this.props.intl.formatMessage({ id: "IDS_SUBSAMPLE" })}</h4>
                        </span>
                    </Card.Header>
                    <Card.Body className='p-0 sm-pager'>
                        <TransactionListMasterJsonView
                            cardHead={94}
                            masterList={this.props.Login.masterData.searchedSubSample || JA_SubSampleList}
                            selectedMaster={this.props.Login.masterData.JASelectedSubSample}
                            primaryKeyField="ntransactionsamplecode"
                            //secondaryKeyField = "nsectioncode"
                            getMasterDetail={(event, status) => { this.props.getJobAllocationTestDetail(event, status); this.state.enableAutoClick && this.changePropertyView(2, event, "click") }}
                            inputParam={testGetJAParam}
                            filterColumnData={this.props.filterTransactionList}
                            searchListName="searchedSubSample"
                            secondarySelection={this.props.Login.secondarySelection || ""}
                            searchRef={this.searchSubSampleRef}
                            filterParam={{
                                ...this.state.filterSubSampleParam,
                                childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedTest" }]
                            }}
                            additionalParam={['napprovalversioncode']}
                            showStatusLink={true}
                            showStatusName={false}
                            statusFieldName="stransdisplaystatus"
                            statusField="ntransactionstatus"
                            mainField="ssamplearno"
                            selectedListName="JASelectedSubSample"
                            objectName="subsample"
                            listName="IDS_SUBSAMPLE"
                            needValidation={true}
                            validationKey="napprovalversioncode"
                            validationFailMsg="IDS_SELECTSAMPLESOFSAMPLEAPPROVALVERSION"
                            subFields={this.state.DynamicSubSampleColumns}
                            skip={this.state.subsampleskip}
                            take={this.state.subsampletake}
                            pageSize={this.props.Login.settings && this.props.Login.settings[13].split(",").map(setting => parseInt(setting))}
                            //selectionField="ntransactionstatus"
                            //selectionFieldName="stransdisplaystatus"
                            needMultiSelect={true}
                            //selectionColorField="scolorhexcode"
                            subFieldsLabel={false}
                            subFieldsFile={true}
                            handlePageChange={this.handleSubSamplePageChange}
                            selectionList={this.props.Login.masterData.realFilterStatusValue
                                && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                            childTabsKey={[
                                // "RegistrationAttachment", 
                                "JA_TEST", "RegistrationSampleComment", "RegistrationSampleAttachment"]}
                            needFilter={false}
                        />
                    </Card.Body>
                </Card>
                {testDesign}
            </SplitterLayout>
        } else {
            mainDesign = testDesign
        }
        return (
            <>
                <ListWrapper className="client-listing-wrap new-breadcrumb toolbar-top-wrap mtop-4 screen-height-window">
                    <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                    <div className='fixed-buttons'>
                        <Nav.Link //ALPD-4755 Add filter name and filter details button,done by Dhanushya RI
                     className="btn btn-circle outline-grey ml-2"
                      data-tip={this.props.intl.formatMessage({ id: "IDS_SAVEFILTER" })}
                                                            // data-for="tooltip-common-wrap"
                       hidden={this.state.userRoleControlRights.indexOf(filterNameId) === -1}
                        onClick={() => this.openFilterName(filterNameId)}>
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
                    <Row noGutters={true} className="toolbar-top">
                        <Col md={12} className="parent-port-height">
                            <ListWrapper className={`vertical-tab-top ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                <div className={`tab-left-area ${this.state.activeTabIndex ? 'active' : ""}`}>

                                    <SplitterLayout borderColor="#999"
                                        primaryIndex={1} percentage={true}
                                        secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                        primaryMinSize={30}
                                        secondaryMinSize={20}
                                    >
                                        <div className='toolbar-top-inner'>
                                            <TransactionListMasterJsonView
                                                listMasterShowIcon={1}
                                                clickIconGroup={true}
                                                splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                                masterList={this.props.Login.masterData.searchedSample || JA_SampleList}
                                                selectedMaster={this.props.Login.masterData.JASelectedSample}
                                                primaryKeyField="nregistrationsectioncode"
                                                filterColumnData={this.props.filterTransactionList}
                                                getMasterDetail={(event, status) => { this.props.getJobAllocationSubSampleDetail(event, status); this.state.enableAutoClick && this.changePropertyView(4, event, "click") }}
                                                inputParam={subSampleGetJAParam}
                                                selectionList={this.props.Login.masterData.realFilterStatusValue
                                                    && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                                                selectionColorField="scolorhexcode"
                                                mainField={"sarno"}
                                                showStatusLink={true}
                                                showStatusName={true}
                                                statusFieldName="stransdisplaystatus"
                                                statusField="ntransactionstatus"
                                                selectedListName="JASelectedSample"
                                                searchListName="searchedSample"
                                                searchRef={this.searchSampleRef}
                                                objectName="sample"
                                                listName="IDS_SAMPLE"
                                                selectionField="ntransactionstatus"
                                                selectionFieldName="stransdisplaystatus"
                                                showFilter={this.props.Login.showFilter}
                                                openFilter={this.openFilter}
                                                closeFilter={this.closeFilter}
                                                onFilterSubmit={this.onFilterSubmit}
                                                subFields={this.state.DynamicSampleColumns}
                                                needMultiSelect={true}
                                                showStatusBlink={true}
                                                callCloseFunction={true}
                                                filterParam={{
                                                    ...this.state.filterSampleParam,
                                                    childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" },
                                                    { ref: this.searchTestRef, childFilteredListName: "searchedTest" }],
                                                }}
                                                subFieldsLabel={false}
                                                handlePageChange={this.handleSamplePageChange}
                                                skip={this.state.sampleskip}
                                                take={this.state.sampletake}
                                                childTabsKey={["RegistrationAttachment", "RegistrationComment", "JA_SUBSAMPLE",
                                                    "JA_TEST", "RegistrationSampleAttachment", "RegistrationSampleComment", "JASelectedSubSample", "JASelectedTest"]}
                                                needFilter={true}
                                                commonActions={
                                                    <ProductList className="d-flex product-category float-right icon-group-wrap">
                                                        <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_RECEIVEINLAB" })}
                                                            hidden={this.state.userRoleControlRights.indexOf(receiveId) === -1}
                                                            onClick={() => this.ReceiveinLabStatus(receiveId, this.state.sampleskip, this.state.sampletake)} >
                                                            <ReceivedInLab className="custom_icons" width="25" height="30" />
                                                        </Nav.Link>

                                                        <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                                            // data-for="tooltip-common-wrap"
                                                            onClick={() => this.onReload()} >
                                                           <RefreshIcon className='custom_icons'/>
                                                        </Button>
                                                    </ProductList>
                                                }
                                                filterComponent={[
                                                    {
                                                        "Sample Filter": <JobAllocationFilter
                                                            SampleType={this.state.SampletypeList || []}
                                                            SampleTypeValue={this.props.Login.masterData.defaultSampleTypeValue || {}}
                                                            RegType={this.state.RegistrationTypeList || []}
                                                            RegTypeValue={this.props.Login.masterData.defaultRegTypeValue || {}}
                                                            RegSubType={this.state.RegistrationSubTypeList || []}
                                                            RegSubTypeValue={this.props.Login.masterData.defaultRegSubTypeValue || {}}
                                                            ApprovalVersion={this.state.ConfigVersionList || []}
                                                            ApprovalVersionValue={this.props.Login.masterData.defaultApprovalVersionValue || []}
                                                            UserSection={this.state.UserSectionList || []}
                                                            UserSectionValue={this.props.Login.masterData.defaultUserSectionValue || []}
                                                            JobStatus={this.props.Login.masterData.JobStatus || []}
                                                            Test={this.state.TestList || []}
                                                            TestValue={this.props.Login.masterData.defaultTestValue || []}
                                                            FilterStatus={this.state.FilterStatusList || []}
                                                            FilterStatusValue={this.props.Login.masterData.defaultFilterStatusValue || []}
                                                            DynamicDesignMapping={this.state.DynamicDesignMappingList || []}
                                                            DesignTemplateMappingValue={this.props.Login.masterData.defaultDesignTemplateMappingValue || []}
                                                            fromDate={this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()}
                                                            toDate={this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()}
                                                            onFilterComboChange={this.onFilterComboChange}
                                                            handleFilterDateChange={this.handleFilterDateChange}
                                                            userInfo={this.props.Login.userInfo}

                                                        />
                                                    }
                                                ]}

                                            />
                                        </div>
                                        <div>
                                            <div style={this.state.showTest === true || this.state.showSubSample === true ?
                                                { display: "block" } : { display: "none"}} >
                                                {mainDesign}
                                            </div>
                                        </div>
                                    </SplitterLayout>
                                </div>
                                <div className={`${this.state.enablePropertyPopup ? 'active-popup' : ""} vertical-tab ${this.state.activeTabIndex ? 'active' : ""}`} >
                                    <div className={`${this.state.enablePropertyPopup ? 'active-popup' : ""} vertical-tab-content pager_wrap wrap-class ${this.state.activeTabIndex ? 'active' : ""}`} style={{ width: this.state.enablePropertyPopup ? this.state.propertyPopupWidth + '%' : "" }}>
                                        <span className={` vertical-tab-close ${this.state.activeTabIndex ? 'active' : ""}`} onClick={() => this.changePropertyViewClose(false)}><FontAwesomeIcon icon={faChevronRight} /> </span>
                                        <div className={` vertical-tab-content-common position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 4 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_SAMPLEDETAILS" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex == 4 ? this.sideNavDetail("IDS_SAMPLEDETAILS") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-common position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 8 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_ALLOTTEDTEST" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex == 8 ? this.sideNavDetail("IDS_ALLOTTEDTEST") : ""}
                                        </div>

                                        <div className={` vertical-tab-content-attachment position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 2 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            {this.state.activeTabIndex && this.state.activeTabIndex == 2 ? this.sideNavDetail("IDS_ATTACHMENTS") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-grid-tab position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 3 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            {this.state.activeTabIndex && this.state.activeTabIndex == 3 ? this.sideNavDetail("IDS_COMMENTS") : ""}
                                        </div>
                                        {/* <div className={` vertical-tab-content-grid-tab  ${this.state.activeTabIndex && this.state.activeTabIndex == 9 ? 'active' : ""}`}>
                                            {this.state.activeTabIndex && this.state.activeTabIndex == 9 ? this.sideNavDetail("IDS_ANALYSTCALENDAR") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-grid-tab  ${this.state.activeTabIndex && this.state.activeTabIndex == 10 ? 'active' : ""}`}>
                                            {this.state.activeTabIndex && this.state.activeTabIndex == 10 ? this.sideNavDetail("IDS_INSTRUMENTCALENDAR") : ""}
                                        </div> */}

                                    </div>
                                    <div className='tab-head'>
                                        <ul>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex == 4 ? 'active' : ""}`} onClick={() => this.changePropertyView(4)}>
                                                <FontAwesomeIcon icon={faEye} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_SAMPLEDETAILS" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex == 8 ? 'active' : ""}`} onClick={() => this.changePropertyView(8)}>
                                                <FontAwesomeIcon icon={faEye} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_ALLOTTEDTEST" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex == 2 ? 'active' : ""}`} onClick={() => this.changePropertyView(2)}>
                                                <FontAwesomeIcon icon={faLink} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_ATTACHMENTS" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex == 3 ? 'active' : ""}`} onClick={() => this.changePropertyView(3)}>
                                                <FontAwesomeIcon icon={faComments} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                                                </span>
                                            </li>
                                            {/* <li className={`${this.state.activeTabIndex && this.state.activeTabIndex == 9 ? 'active' : ""}`} onClick={() => this.changePropertyView(9)}>
                                                <Analystcalendar className="custom_icons" width="20" height="30" />

                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_ANALYSTCALENDAR" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex == 10 ? 'active' : ""}`} onClick={() => this.changePropertyView(10)}>
                                                <Instrumentcalendar className="custom_icons" width="20" height="30" />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_INSTRUMENTCALENDAR" })}
                                                </span>
                                            </li> */}

                                        </ul>
                                        <span className='tab-click-toggle-btn'>
                                            <CustomSwitch
                                                label={this.props.intl.formatMessage({ id: "IDS_AUTOSHOW" })}
                                                type="switch"
                                                name={"Auto Click"}
                                                onChange={(event) => this.onInputSwitchOnChange(event)}
                                                defaultValue={this.state.enableAutoClick}
                                                isMandatory={false}
                                                required={true}
                                                checked={this.state.enableAutoClick}
                                            />
                                        </span>
                                        {/* <span className='tab-click-toggle-btn'>
                                            <CustomSwitch
                                                label={this.props.intl.formatMessage({ id: "IDS_POPUPNAV" })}
                                                type="switch"
                                                name={"PopupNav"}
                                                onChange={(event) => this.onInputSwitchOnChange(event)}
                                                defaultValue={this.state.enablePropertyPopup}
                                                isMandatory={false}
                                                required={true}
                                                checked={this.state.enablePropertyPopup}
                                            />
                                        </span> */}

                                    </div>
                                </div>
                            </ListWrapper>
                        </Col>
                    </Row>
                </ListWrapper>
                {console.log(this.props.Login.operation)}
                {this.props.Login.openModal ?
                    <SlideOutModal
                        show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        esign={this.props.Login.loadEsign}
                        // hideSave={this.props.Login.operation === "AllotJobCalendar" ? true : false}
                        onSaveClick={this.onSaveClick}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        mandatoryFields={mandatoryFields}
                        updateStore={this.props.updateStore}
                        size={this.props.Login.operation === "AllotJobCalendar" ? "xl" : "lg"}
                        selectedRecord={(this.props.Login.operation === "AllotJobCalendar" && this.props.Login.loadEsign !== true) ? this.state.calenderSelectedRecord||{} : this.state.selectedRecord || {}}   // ALPD-5260    Added condition by Vishakh to pass selectedRecord correctly when enable esign
                        showSaveContinue={this.state.showSaveContinue}
                        addComponent={
                            this.props.Login.loadEsign ? (
                                <Esign
                                    operation={this.props.Login.operation}
                                    onInputOnChange={this.onInputOnChange}
                                    inputParam={this.props.Login.inputParam}
                                    selectedRecord={this.state.selectedRecord || {}}
                                />
                            ) :
                                //  this.state.openAnalystCalendar ?
                                //     <AnalystCalenderBasedOnUser userData={this.props.Login.masterData.analystCalenderData} /> :
                                this.props.Login.operation === "AllotJobCalendar" ? (
                                    <NewJobAlloct
                                        selectedRecord={this.state.selectedRecord || {}}
                                       // onComboChange={this.onComboChange}
                                        //handleDateChange={this.handleDateChange}
                                        Technique={this.props.Login.Technique}
                                        Users={this.props.Login.Users}
                                        //userData={this.props.Login.masterData.analystCalenderData}
                                        InstrumentCategory={this.props.Login.InstrumentCategory}
                                        Instrument={this.props.Login.Instrument}
                                        currentTime={this.props.Login.currentTime || []}
                                        operation={this.props.Login.operation}
                                        inputParam={this.props.inputParam}
                                        userInfo={this.props.Login.userInfo}
                                        selectedTest={this.props.Login.masterData.JASelectedTest}
                                        parentScheduleState={this.parentScheduleState}
                                        //updateCalender={this.props.updateCalender}
                                        masterData={this.props.Login.masterData}
                                        parentSelectRecord={this.parentSelectRecord}
                                        calenderProperties={this.props.Login.calenderProperties}
                                        calenderColor={this.props.Login.calenderColor}
                                        calenderPublicHolidays={this.props.Login.calenderPublicHolidays}
                                        personalLeaveRestrict={this.props.Login.personalLeaveRestrict}
                                        updateStore={this.props.updateStore}
                                        calenderCommonHolidays1={this.props.Login.calenderCommonHolidays1}
                                        calenderUserHolidays={ this.props.Login.calenderUserHolidays}
                                        holidaydateRestrict={this.props.Login.holidaydateRestrict}
                                        commonHolidaydateRestrict={this.props.Login.commonHolidaydateRestrict}
                                    />

                                ) : this.props.Login.operation === "AllotJob" || this.props.Login.operation === "Reschedule" ?
                                    <AddJobAllocation
                                        onNumericInputOnChange={this.onNumericInputOnChange}
                                        selectedRecord={this.state.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        onComboChange={this.onComboChange}
                                        handleDateChange={this.handleDateChange}
                                        Technique={this.props.Login.Technique}
                                        Users={this.props.Login.Users}
                                        UsersPeriod={this.props.Login.UsersPeriod}
                                        InstrumentCategory={this.props.Login.InstrumentCategory}
                                        InstrumentName={this.props.Login.InstrumentName}
                                        InstrumentId={this.props.Login.InstrumentId}
                                        InstrumentPeriod={this.props.Login.InstrumentPeriod}
                                        currentTime={this.props.Login.currentTime || []}
                                        operation={this.props.Login.operation}
                                        inputParam={this.props.inputParam}
                                        userInfo={this.props.Login.userInfo}
                                        openAnalystCalendar={this.openAnalystCalendar}
                                        RescheduleSection={this.props.Login.RescheduleSection}
										//ALPD-4511--Vignesh R(06-08-2024)
                                        hiddenSectionChange={this.state.userRoleControlRights.indexOf(testSectionChangeID) === -1}
                                    /> : this.props.Login.operation === "AllotAnotherUser" ? (
                                        <AllotAnotherUser
                                            onNumericInputOnChange={this.onNumericInputOnChange}
                                            selectedRecord={this.state.selectedRecord || {}}
                                            onInputOnChange={this.onInputOnChange}
                                            onComboChange={this.onComboChange}
                                            handleDateChange={this.handleDateChange}
                                            Technique={this.props.Login.Technique}
                                            TechniqueCode ={this.props.Login.TechniqueCode}
                                            Users={this.props.Login.Users}
                                            UsersPeriod={this.props.Login.UsersPeriod}
                                            currentTime={this.props.Login.currentTime || []}
                                            operation={this.props.Login.operation}
                                            inputParam={this.props.inputParam}
                                            userInfo={this.props.Login.userInfo}

                                        />
                                        //    ) : this.props.Login.operation ==="ViewAnalystCalendar" ? (
                                        //         <>
                                        //             <Row>
                                        //                 <Col md={12}>
                                        //                 <FormSelectSearch
                                        //                     formLabel={this.props.intl.formatMessage({ id: "IDS_USERS" })}
                                        //                     isSearchable={true}
                                        //                     name={"nusercode"}
                                        //                     isDisabled={false}
                                        //                     placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        //                     isMandatory={true}
                                        //                     isClearable={false}
                                        //                     options={this.props.Login.Users}
                                        //                     value = {this.state.selectedRecord["nusercode"] || "" }
                                        //                     defaultValue={this.state.selectedRecord["nusercode"]}
                                        //                     onChange={(event)=>this.onComboChange(event, "nusercode")}
                                        //                     closeMenuOnSelect={true}
                                        //                 />
                                        //                 </Col>
                                        //             </Row>

                                        //             <Scheduler data={this.state.data}  defaultDate={new Date()}>
                                        //                 <DayView numberOfDays={3} style={{zorder:25000}}/>
                                        //                 <WeekView />
                                        //                 <MonthView />

                                        //             </Scheduler>

                                        //             {/* <AnalystCalendar
                                        //                 UserData={this.props.Login.masterData.UserData}
                                        //                 operation={this.props.Login.operation}
                                        //                 inputParam={this.props.inputParam}
                                        //                 userInfo={this.props.Login.userInfo}

                                        //             /> */}
                                        //         </>                             
                                        //    ): (
                                    ) : 
                                    this.props.Login.operation === "updateSection" ? (
                                        <ScheduleSection
                                            selectedRecord={this.state.selectedRecord || {}}
                                            onComboChange={this.onComboChange}
                                            section={this.props.Login.Section}
                                            SectionUsers={this.props.Login.SectionUsers}
                                            nneduserfilter={this.props.Login.nneduserfilter}
                                            operation={this.props.Login.operation}
                                            userInfo={this.props.Login.userInfo}

                                        />
                                    )
                                        :
                                    
                                    (
                                        ""
                                    )
                        }
                    /> : ""}
                    {this.props.Login.modalShow ? (//ALPD-4755-To show the add popup to get input of filter name,done by Dhanushya RI
                    <ModalShow
                        modalShow={this.props.Login.modalShow}
                        closeModal={this.closeModalShowForFilter}
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

            </>
        )
    }

    closeFilter = () => {
        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
        let inputValues = {
            fromDate: this.props.Login.masterData.realFromDate || new Date(),// ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date(),
            toDate: this.props.Login.masterData.realToDate || new Date(), //? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date(),
            RegTypeValue: this.props.Login.masterData.realRegTypeValue || {},
            RegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue || {},
            FilterStatusValue: this.props.Login.masterData.realFilterStatusValue || {},
            ApprovalConfigVersionValue: this.props.Login.masterData.realApprovalVersionValue || {},
            DesignTemplateMappingValue: this.props.Login.masterData.realDesignTemplateMappingValue || {},
            //FromDate:this.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.fromDate) : new Date(),
            // ToDate:this.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.toDate) : new Date(),
            UserSectionValue: this.props.Login.masterData.realUserSectionValue || {},
            JobStatus: this.props.Login.masterData.JobStatus || {},
            TestValue: this.props.Login.masterData.realTestValue || {},
            defaultRegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue || {},
            defaultRegTypeValue: this.props.Login.masterData.realRegTypeValue || {},
            defaultApprovalVersionValue: this.props.Login.masterData.realApprovalVersionValue || {},
            defaultDesignTemplateMappingValue: this.props.Login.masterData.realDesignTemplateMappingValue || {},
            defaultFilterStatusValue: this.props.Login.masterData.realFilterStatusValue || {},
            defaultSampleTypeValue: this.props.Login.masterData.realSampleTypeValue || {},
            defaultTestValue: this.props.Login.masterData.realTestValue || {},
            defaultUserSectionValue: this.props.Login.masterData.realUserSectionValue || {},
            napprovalconfigcode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
            napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) : null,
            nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.realUserSectionValue.nsectioncode) : null,
            ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode === 0 ? this.props.Login.masterData.Test && this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.realTestValue.ntestcode) : null,
            SampleType: this.props.Login.masterData.realSampleTypeList || [],
            RegistrationType: this.props.Login.masterData.realRegistrationTypeList || [],
            RegistrationSubType: this.props.Login.masterData.realRegistrationSubTypeList || [],
            ApprovalConfigVersion: this.props.Login.masterData.realApprovalConfigVersionList || [],
            FilterStatus: this.props.Login.masterData.realFilterStatusList1 || [],
            UserSection: this.props.Login.masterData.realUserSectionList || [],
            Test: this.props.Login.masterData.realTestList || [],
            DynamicDesignMapping: this.props.Login.masterData.realDynamicDesignMappingList || [],
            defaultSampleTypeValue: this.props.Login.masterData.realSampleTypeValue || {},
            SampleTypeValue: this.props.Login.masterData.realSampleTypeValue || {},
            ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,

        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false, masterData: { ...this.props.Login.masterData, ...inputValues } }
        }
        this.props.updateStore(updateInfo);
    }

    ReceiveinLabStatus(receiveId, sampleskip, sampletake) {
        let sampleList = [];
        if (this.props.Login.masterData.searchedSample !== undefined) {
            // sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.JA_SAMPLE.slice(sampleskip, sampleskip + sampletake), "nregistrationsectioncode");
            sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.searchedSample.slice(sampleskip, sampleskip + sampletake), "nregistrationsectioncode");
        } else {
            sampleList = this.props.Login.masterData.JA_SAMPLE && this.props.Login.masterData.JA_SAMPLE.slice(sampleskip, sampleskip + sampletake);
        }
        let receiveList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.JASelectedSample, "nregistrationsectioncode");
        if (receiveList && receiveList.length > 0) {
            // START ALPD-3570 VISHAKH
            // let tempsection = 0;
            // let sectionvalue = 0;
            // let bflag = true;
            // let sampleList = this.props.Login.masterData.JASelectedSample;
            // sampleList.forEach((item) => {
            //     sectionvalue = item.nsectioncode;
            //     if (tempsection !== sectionvalue && tempsection !== 0) {
            //         bflag = false;
            //     } else {
            //         tempsection = sectionvalue
            //     }
            // });

            // if (bflag) {
                // END ALPD-3570 VISHAKH
                let JASelectedSample = this.props.Login.masterData.JASelectedSample;
                if (this.props.Login.masterData.JASelectedSubSample.length !== 0) {
                    let JASelectedSubSample = this.props.Login.masterData.JASelectedSubSample;
                    let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
                    // START ALPD-3570 VISHAKH
                    // let arr = [];
                    // JASelectedSample && JASelectedSample.map((item) => {
                    //     if (!arr.includes(item.nsectioncode)) {
                    //         arr.push(item.nsectioncode)
                    //     }
                    // }
                    // )
                    // END ALPD-3570 VISHAKH
                    let inputParam = {};
                    let Map = {
                        nflag: 3,
                        ncheck: 1,
                        fromdate: obj.fromDate,
                        todate: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.realRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                        napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                        ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode,
                        ntransactionstatus: "0",
                        ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode === 0 ? this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.realTestValue.ntestcode) : null,
                        // npreregno: JASelectedSample ? JASelectedSample.map(sample => sample.npreregno).join(",") : "",
                        npreregno: receiveList ? receiveList.map(sample => sample.npreregno).join(",") : "",
                        ntransactionsamplecode: JASelectedSubSample ? JASelectedSubSample.map(sample => sample.ntransactionsamplecode).join(",") : "",
                        // nsectioncode: arr.map(nsectioncode => nsectioncode).join(","),
                        nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode.toString() : "-1",
                        ncontrolcode: receiveId,
                        nneedsubsample: this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
                        nneedtemplatebasedflow: this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow,
                        //checkBoxOperation: 3,
                        checkBoxOperation: checkBoxOperation.SINGLESELECT,
                        ntype: 2,
                        userinfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        screenName: this.props.Login.screenName,
                        // activeSampleTab: "IDS_SAMPLEATTACHMENTS",
                        // activeSubSampleTab: "IDS_SUBSAMPLEATTACHMENTS",
                        // activeTestTab: "IDS_TESTATTACHMENTS",
                        activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                        activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                        activeTestTab: this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS",
                        nneedmyjob:this.props.Login.masterData && this.props.Login.masterData.nneedmyjob
                    }
                    inputParam = {
                        inputData: Map,
                        postParamList: this.postParamList,
                        classUrl: "joballocation",
                        operation: 'Create',
                        methodUrl: "ReceiveinLab",
                        action: "receiveinlab",

                    }
                    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, receiveId)) {
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                loadEsign: true,
                                screenData: { inputParam, masterData: this.props.Login.masterData },
                                openModal: true,
                                parentPopUpSize: 'lg',
                                screenName: this.props.Login.screenName,
                                operation: 'Create'
                            }
                        }
                        this.props.updateStore(updateInfo);
                    } else {
                        this.props.ReceiveinLabStatusWise(inputParam);
                    }

                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSUBSAMPLESTORECEIVE" }));
                }
            // START ALPD-3570 VISHAKH
            // } else {
            //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMESECTIONSAMPLES" }));
            // }
            // END ALPD-3570 VISHAKH
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLES" }));
        }
    }

    checkRegisterSamples(sample) {
        return (sample.ntransactionstatus === transactionStatus.REGISTER)
    }

    componentDidUpdate(previousProps) {

        console.log("enter render")
        let { userRoleControlRights, controlMap,
            testListColumns, testSearchField, subsampleSearchField, sampleSearchField,
            SingleItem, testItem, testListMainField,
            SampleGridItem, SampleGridExpandableItem, testMoreField,
            testAttachmentDataState, testCommentDataState, testViewDataState, activeTabIndex, activeTabId,
            selectedRecord, SampletypeList, RegistrationTypeList,
            RegistrationSubTypeList, FilterStatusList,
            ConfigVersionList, UserSectionList, TestList, DynamicDesignMappingList, sampleskip, sampletake, subsampleskip, subsampletake, testskip, testtake, selectedFilter,
            DynamicGridItem, DynamicTestGridItem, DynamicTestGridMoreField, DynamicSampleColumns, DynamicSubSampleColumns, DynamicTestColumns,
            DynamicGridMoreField, data } = this.state;
        let bool = false;
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

            bool = true;
        }
        if (this.props.Login.masterData.RegSubTypeValue !== previousProps.Login.masterData.RegSubTypeValue) {
            if (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nsubsampleneed === transactionStatus.NO) {
                let dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'sarno' }] }

                testAttachmentDataState = dataState
                testCommentDataState = dataState
                testViewDataState = dataState

                bool = true;
            }
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {

            selectedRecord = this.props.Login.selectedRecord
            bool = true;
        }

        if (this.props.Login.activeTabIndex !== previousProps.Login.activeTabIndex) {
            activeTabIndex = this.props.Login.activeTabIndex;
            activeTabId = this.props.Login.activeTabId;
            bool = true;
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const SampletypeListMap = constructOptionList(this.props.Login.masterData.SampleType || [], "nsampletypecode", "ssampletypename", 'ascending', 'nsampletypecode', false);
            const RegistrationTypeListMap = constructOptionList(this.props.Login.masterData.RegistrationType || [], "nregtypecode", "sregtypename", "nsorter", 'ascending', 'nregtypecode', false);
            const RegistrationSubTypeListMap = constructOptionList(this.props.Login.masterData.RegistrationSubType || [], "nregsubtypecode", "sregsubtypename", "nsorter", 'ascending', 'nregsubtypecode', false);
            const FilterStatusListMap = constructOptionList(this.props.Login.masterData.FilterStatus || [], "ntransactionstatus", "stransdisplaystatus", undefined, undefined, false);
            const ConfigVersionListMap = constructOptionList(this.props.Login.masterData.ApprovalConfigVersion || [], "napprovalconfigversioncode", "sversionname", 'descending', 'ntransactionstatus', false);
            const UserSectionListMap = constructOptionList(this.props.Login.masterData.UserSection || [], "nsectioncode", "ssectionname", undefined, undefined, false);
            const TestListMap = constructOptionList(this.props.Login.masterData.Test || [], "ntestcode", "stestsynonym", undefined, undefined, false);
            const DynamicDesignMappingListMap = constructOptionList(this.props.Login.masterData.DynamicDesignMapping || [], "ndesigntemplatemappingcode", "sregtemplatename", "nsorter", 'ascending', 'ndesigntemplatemappingcode', false);

            SampletypeList = SampletypeListMap.get("OptionList");
            RegistrationTypeList = RegistrationTypeListMap.get("OptionList");
            RegistrationSubTypeList = RegistrationSubTypeListMap.get("OptionList");
            FilterStatusList = FilterStatusListMap.get("OptionList");
            ConfigVersionList = ConfigVersionListMap.get("OptionList");
            UserSectionList = UserSectionListMap.get("OptionList");
            TestList = TestListMap.get("OptionList");
            DynamicDesignMappingList = DynamicDesignMappingListMap.get("OptionList");

            bool = true;
            sampleskip = this.props.Login.sampleskip === undefined ? sampleskip : this.props.Login.sampleskip
            sampletake = this.props.Login.sampletake || sampletake

            subsampleskip = this.props.Login.subsampleskip === undefined ? subsampleskip : this.props.Login.subsampleskip
            subsampletake = this.props.Login.subsampletake || subsampletake

            testskip = this.props.Login.testskip === undefined ? testskip : this.props.Login.testskip
            testtake = this.props.Login.testtake || testtake
            let selectFilterStatus = { ntransactionstatus: transactionStatus.PARTIAL, stransdisplaystatus: this.props.intl.formatMessage({ id: "IDS_PARTIAL" }), scolorhexcode: "#800000" }

            const selectedFilters = this.props.Login.masterData.FilterStatus || [];

            const selectedFiltersNew = JSON.parse(JSON.stringify(selectedFilters));

            const index = selectedFiltersNew.findIndex(item => item.ntransactionstatus === transactionStatus.PARTIAL)
            if (selectedFiltersNew.length > 0 && index === -1) {
                selectedFiltersNew.push(selectFilterStatus)
            }
            selectedFilter = selectedFiltersNew;

            if (this.props.Login.testAttachmentDataState && this.props.Login.testAttachmentDataState !== previousProps.Login.testAttachmentDataState) {
                testAttachmentDataState = this.props.Login.testAttachmentDataState;
            }
            if (this.props.Login.testCommentDataState && this.props.Login.testCommentDataState !== previousProps.Login.testCommentDataState) {
                testCommentDataState = this.props.Login.testCommentDataState;
            }
            if (this.props.Login.testViewDataState && this.props.Login.testViewDataState !== previousProps.Login.testViewDataState) {
                testViewDataState = this.props.Login.testViewDataState;
            }

        }

       

        if (this.props.Login.masterData.DynamicDesign && this.props.Login.masterData.DynamicDesign !== previousProps.Login.masterData.DynamicDesign) {
            const dynamicColumn = JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata.value)
            DynamicSampleColumns = dynamicColumn.samplelistitem ? dynamicColumn.samplelistitem : [];
            DynamicSubSampleColumns = dynamicColumn.subsamplelistitem ? dynamicColumn.subsamplelistitem : [];
            DynamicTestColumns = dynamicColumn.testlistitem ? dynamicColumn.testlistitem : [];

            sampleSearchField = dynamicColumn.samplesearchfields ? dynamicColumn.samplesearchfields : [];
            subsampleSearchField = dynamicColumn.subsamplesearchfields ? dynamicColumn.subsamplesearchfields : [];
            testSearchField = dynamicColumn.testListFields.testsearchfields ? dynamicColumn.testListFields.testsearchfields : [];

            DynamicGridItem = dynamicColumn.samplegriditem ? dynamicColumn.samplegriditem : [];
            DynamicGridMoreField = dynamicColumn.samplegridmoreitem ? dynamicColumn.samplegridmoreitem : [];
            DynamicTestGridItem = dynamicColumn.testgriditem ? dynamicColumn.testgriditem : [];
            DynamicTestGridMoreField = dynamicColumn.testgridmoreitem ? dynamicColumn.testgridmoreitem : [];
            SingleItem = dynamicColumn.sampledisplayfields ? dynamicColumn.sampledisplayfields : [];
            testItem = dynamicColumn.testdisplayfields ? dynamicColumn.testdisplayfields : [];
            testMoreField = dynamicColumn.testListFields.testlistmoreitems ? dynamicColumn.testListFields.testlistmoreitems : [];
            testListColumns = dynamicColumn.testListFields.testlistitem ? dynamicColumn.testListFields.testlistitem : [];
            bool = true;
           
            let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
            selectedRecord['fromDate'] = obj.fromDate;
            selectedRecord['toDate'] = obj.toDate;

            bool = true;
        }
        if (this.props.Login.masterData.UserData !== undefined) {
            if (this.props.Login.masterData.UserData !== previousProps.Login.masterData.UserData) {
                for (let i = 0; i < this.props.Login.masterData.UserData.length; i++) {
                    data.push(this.props.Login.masterData.UserData[i].jsonuidata);
                }
                data = data.map(dataItem => ({
                    start: parseAdjust(dataItem.UserStartDate),
                    end: parseAdjust(dataItem.UserEndDate),
                    title: dataItem.Comments

                }))
                bool = true;
                //this.setState({data:data});
            }
        }

        const filterSampleParam = {
            inputListName: "JA_SAMPLE",
            selectedObject: "JASelectedSample",
            primaryKeyField: "nregistrationsectioncode",
            fetchUrl: "joballocation/getJobAllocationSubSampleDetails",
            isMultiSort: true,
            multiSortData: [{ pkey: 'ntransactionsamplecode', list: 'JA_SUBSAMPLE' }, { pkey: 'ntransactiontestcode', list: 'JA_TEST' }],
            sampleskip: 0,
            subsampleskip: 0,
            testskip: 0,
            skip:0,
            take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
            sampletake: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
            subsampletake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
            testtake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
            fecthInputObject: {
                masterData: this.props.Login.masterData,
                ntransactionstatus: String(this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus),
                userinfo: this.props.Login.userInfo,
                nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode,
                nneedtemplatebasedflow: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow,
                nneedsubsample: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
                //nsectioncode: this.props.Login.masterData.JASelectedSample && this.props.Login.masterData.JASelectedSample.map(x => x.nsectioncode).join(","),
                //npreregno: this.props.Login.masterData.JASelectedSample && this.props.Login.masterData.JASelectedSample.map(x => x.npreregno).join(","),
                samplesearch: 1,
                //checkBoxOperation: 3,
				// ALPD-5609    Added by Vishakh for Test not showing issue
                nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode ? this.props.Login.masterData.realUserSectionValue.nsectioncode.toString() : "-1": "-1",
                checkBoxOperation: checkBoxOperation.SINGLESELECT,
                activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                activeTestTab: this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS",

            },
            masterData: this.props.Login.masterData,
            searchFieldList: sampleSearchField,
            changeList: [
                "JA_SUBSAMPLE", "JA_TEST", "RegistrationTestAttachment", "RegistrationTestComment", "RegistrationAttachment",
                "JASelectedSample", "JASelectedSubSample", "JASelectedTest"]
        };

        const filterSubSampleParam = {
            inputListName: "JA_SUBSAMPLE",
            selectedObject: "JASelectedSubSample",
            primaryKeyField: "ntransactionsamplecode",
            fetchUrl: "joballocation/getJobAllocationTestDetails",
            isMultiSort: true,
            multiSortData: [{ pkey: 'ntransactiontestcode', list: 'JA_TEST' }],
            sampleskip: this.state.sampleskip,
            //sampleskip: 0,
            subsampleskip: 0,
            testskip: 0,
            sampletake: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
            subsampletake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
            testtake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
            fecthInputObject: {
                masterData: this.props.Login.masterData,
                userinfo: this.props.Login.userInfo,
                nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode,
                nneedtemplatebasedflow: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow,
                nneedsubsample: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
                //checkBoxOperation: 3,
                checkBoxOperation: checkBoxOperation.SINGLESELECT,
                npreregno: this.props.Login.masterData.JASelectedSample && this.props.Login.masterData.JASelectedSample.map(x => x.npreregno).join(","),
                //nsectioncode: this.props.Login.masterData.JASelectedSubSample && this.props.Login.masterData.JASelectedSubSample.map(x => x.nsectioncode).join(","),
                //ALPD-3190 fix
                nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue && this.props.Login.masterData.realUserSectionValue.nsectioncode === 0 ? this.props.Login.masterData.UserSection && this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.realUserSectionValue.nsectioncode) : null,
                //ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode,
                //ALPD-2549 fix
                ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode === 0 ? this.props.Login.masterData.Test && this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.realTestValue.ntestcode) : null,

                activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                activeTestTab: this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS"

            },
            masterData: this.props.Login.masterData,
            searchFieldList: subsampleSearchField,
            changeList: ["JA_TEST", "RegistrationTestAttachment", "RegistrationTestComment", "RegistrationAttachment",
                "JASelectedSubSample", "JASelectedTest"]
        };

        const filterTestParam = {
            inputListName: "JA_TEST",
            selectedObject: "JASelectedTest",
            primaryKeyField: "ntransactiontestcode",
            fetchUrl: this.getActiveTestURL(),
            sampleskip: this.state.sampleskip,
            //sampleskip: 0,
            subsampleskip: this.state.subsampleskip,
            testskip: 0,
            sampletake: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
            subsampletake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
            testtake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
            fecthInputObject: {
                ntransactiontestcode: this.props.Login.masterData && this.props.Login.masterData.JASelectedTest && this.props.Login.masterData.JASelectedTest ? this.props.Login.masterData.JASelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
                userinfo: this.props.Login.userInfo,
                ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMappingValue
                    && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode,
                nneedtemplatebasedflow: this.props.Login.masterData.realRegSubTypeValue
                    && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow,
                nneedsubsample: this.props.Login.masterData.realRegSubTypeValue
                    && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
                //checkBoxOperation: 3,
                checkBoxOperation: checkBoxOperation.SINGLESELECT,
                activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                activeTestTab: this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS",

            },
            masterData: this.props.Login.masterData,
            searchFieldList: testSearchField,
            changeList: ["RegistrationTestAttachment", "RegistrationTestComment"]

        }


        if (bool) {
            bool = false;
            this.setState({
                userRoleControlRights, controlMap,
                testListColumns, testSearchField, subsampleSearchField, sampleSearchField,
                SingleItem, testItem, testListMainField,
                SampleGridItem, SampleGridExpandableItem, testMoreField,
                testAttachmentDataState, testCommentDataState, testViewDataState, activeTabIndex, activeTabId,
                selectedRecord, SampletypeList, RegistrationTypeList,
                RegistrationSubTypeList, FilterStatusList,
                ConfigVersionList, UserSectionList, TestList, DynamicDesignMappingList,
                sampleskip, sampletake, subsampleskip, subsampletake, testskip, testtake, selectedFilter,
                DynamicGridItem, DynamicTestGridItem, DynamicTestGridMoreField, DynamicSampleColumns, DynamicSubSampleColumns, DynamicTestColumns,
                DynamicGridMoreField, data, filterTestParam, filterSubSampleParam, filterSampleParam
            });
        }
    }

    handleSamplePageChange = e => {
        this.setState({
            sampleskip: e.skip,
            sampletake: e.take
        });
    };

    handleSubSamplePageChange = e => {
        this.setState({
            subsampleskip: e.skip,
            subsampletake: e.take
        });
    }

    handleTestPageChange = e => {
        this.setState({
            testskip: e.skip,
            testtake: e.take
        });
    };

    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
    }

    onTabChange = (tabProps) => {
        const activeTestTab = tabProps.screenName;
        const tabseqno = tabProps.tabSequence;
        if (tabseqno == SideBarSeqno.TEST) {
            if (this.props.Login.masterData.JASelectedTest && this.props.Login.masterData.JASelectedTest.length > 0) {
                let JASelectedTest = this.props.Login.masterData.JASelectedTest;


                if (activeTestTab === "IDS_TESTVIEW") {
                    let arr = [];
                    JASelectedTest && JASelectedTest.map((item) => {
                        if (!arr.includes(item.ntransactionstatus)) {
                            arr.push(item.ntransactionstatus)
                        }
                    });
                    let transstatus = arr.map(nsectioncode => nsectioncode).join(",");
                    if (transstatus.includes("20")) {
                        let inputData = {
                            masterData: this.props.Login.masterData,
                            JASelectedTest: JASelectedTest,
                            ntransactiontestcode: this.props.Login.masterData.JASelectedTest ?
                                String(this.props.Login.masterData.JASelectedTest.map(item => item.ntransactiontestcode).join(",")) : "-1",
                            npreregno: this.props.Login.masterData.JASelectedSample ?
                                this.props.Login.masterData.JASelectedSample.map(item => item.npreregno).join(",") : "-1",
                            userinfo: this.props.Login.userInfo,
                            activeTestTab: activeTestTab,
                            screenName: activeTestTab,
                            testCommentDataState: this.state.testCommentDataState,
                            testAttachmentDataState: this.state.testAttachmentDataState,
                            testViewDataState: this.state.testViewDataState,
                            activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex,
                            activeTabId: tabProps.activeTabId ? tabProps.activeTabId : this.state.activeTabId
                        }
                        this.props.getTestChildTabDetailJobAllocation(inputData, true)
                    } else {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLOTTEST" }))
                    }
                } else {
                    let inputData = {
                        masterData: this.props.Login.masterData,
                        JASelectedTest: JASelectedTest,
                        ntransactiontestcode: this.props.Login.masterData.JASelectedTest ?
                            String(this.props.Login.masterData.JASelectedTest.map(item => item.ntransactiontestcode).join(",")) : "-1",
                        npreregno: this.props.Login.masterData.JASelectedSample ?
                            this.props.Login.masterData.JASelectedSample.map(item => item.npreregno).join(",") : "-1",
                        userinfo: this.props.Login.userInfo,
                        activeTestTab: activeTestTab,
                        screenName: activeTestTab,
                        testCommentDataState: this.state.testCommentDataState,
                        testAttachmentDataState: this.state.testAttachmentDataState,
                        testViewDataState: this.state.testViewDataState,
                        activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex,
                        activeTabId: tabProps.activeTabId ? tabProps.activeTabId : this.state.activeTabId
                    }
                    this.props.getTestChildTabDetailJobAllocation(inputData, true)
                }





            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))
            }
        }
        else if (tabseqno == SideBarSeqno.SUBSAMPLE) {
            if (activeTestTab !== this.props.Login.activeTestTab) {
                let inputData = {
                    masterData: this.props.Login.masterData,
                    selectedSubSample: this.props.Login.masterData.JASelectedSubSample,
                    ntransactionsamplecode: this.props.Login.masterData.JASelectedSubSample ? this.props.Login.masterData.JASelectedSubSample.map(item => item.ntransactionsamplecode).join(",") : "-1",
                    userinfo: this.props.Login.userInfo,
                    screenName: activeTestTab,
                    activeSubSampleTab: activeTestTab,
                    subsampleCommentDataState: this.state.subsampleCommentDataState,
                    subsampleAttachmentDataState: this.state.subsampleAttachmentDataState,
                    activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex
                }
                this.props.getSubSampleChildTabDetail(inputData)
            }
        }
        else {

            if (activeTestTab !== this.props.Login.activeTestTab) {
                let inputData = {
                    masterData: this.props.Login.masterData,
                    selectedSample: this.props.Login.masterData.JASelectedSample,
                    npreregno: this.props.Login.masterData.JASelectedSample ? this.props.Login.masterData.JASelectedSample.map(item => item.npreregno).join(",") : "-1",
                    userinfo: this.props.Login.userInfo,
                    screenName: activeTestTab,
                    activeSampleTab: activeTestTab,
                    activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex
                }
                this.props.getSampleChildTabDetail(inputData)
            }
        }
    }

    changePropertyViewClose = (id) => {

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                activeTabIndex: undefined,
                activeTestTab: undefined,
                activeTabId: id
            }
        }
        this.props.updateStore(updateInfo);
    }

    changePropertyView = (index, event, status) => {

        let id = false;
        if (event && event.ntransactiontestcode) {
            id = event.ntransactiontestcode
        } else if (event && event.ntransactionsamplecode) {
            id = event.ntransactionsamplecode
        } else if (event && event.npreregno) {
            id = event.npreregno
        }

        let activeTabIndex
        let activeTabId
        if (window.innerWidth > 992 && event && this.state.enableAutoClick || !event) {
            activeTabIndex = this.state.activeTabIndex !== index ? index : id ? index : false;
        }
        if (status != "click") {
            if (index === SideBarTabIndex.ATTACHMENTS) {
                const tabProps = {
                    tabSequence: SideBarSeqno.TEST,
                    screenName: "IDS_TESTATTACHMENTS",
                    activeTabIndex,
                    activeTabId
                }
                this.onTabChange(tabProps);
            }
            else if (index === SideBarTabIndex.COMMENTS) {
                const tabProps = {
                    tabSequence: SideBarSeqno.TEST,
                    screenName: "IDS_TESTCOMMENTS",
                    activeTabIndex,
                    activeTabId
                }
                this.onTabChange(tabProps);
            }
            else if (index === SideBarTabIndex.TESTVIEW) {
                const tabProps = {
                    tabSequence: SideBarSeqno.TEST,
                    screenName: "IDS_TESTVIEW",
                    activeTabIndex,
                    activeTabId
                }
                this.onTabChange(tabProps);
            } else if (index === SideBarTabIndex.ANALYSTCALENDAR) {
                const tabProps = {
                    tabSequence: SideBarSeqno.TEST,
                    screenName: "IDS_ANALYSTCALENDAR",
                    activeTabIndex,
                    activeTabId
                }
                this.onTabChange(tabProps);
            }
            else {
                if (window.innerWidth > 992 && event && this.state.enableAutoClick || !event) {

                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            activeTabIndex: this.state.activeTabIndex !== index ? index : id ? index : false,
                            activeTabId: id
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
            }
        }

    }



    sideNavDetail = (screenName) => {
        let { testskip, testtake } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : this.props.Login.masterData.JA_TEST || [];
        const editTestCommentsId = this.state.controlMap.has("EditTestComment") && this.state.controlMap.get("EditTestComment").ncontrolcode;
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.JASelectedTest, "ntransactiontestcode");
        let ntransactiontestcode = this.props.Login.masterData.JASelectedTest ? this.props.Login.masterData.JASelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";

        return (
            screenName === "IDS_ATTACHMENTS" ?
                <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS"} tabDetail={this.attachmentTabDetail()} destroyInactiveTabPane={true} onTabChange={this.onTabChange} />
                : screenName === "IDS_COMMENTS" ?
                    <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_TESTCOMMENTS"} tabDetail={this.commentTabDetail()} destroyInactiveTabPane={true} onTabChange={this.onTabChange} />
                    : screenName === "IDS_SAMPLEDETAILS" ?
                        this.props.Login.masterData.JASelectedSample && this.props.Login.masterData.JASelectedSample.length === 1 ?
                            <SampleInfoView
                                data={this.props.Login.masterData.JASelectedSample && this.props.Login.masterData.JASelectedSample.length > 0
                                    ? this.props.Login.masterData.JASelectedSample[this.props.Login.masterData.JASelectedSample.length - 1] : {}}
                                SingleItem={this.state.SingleItem}
                                screenName="IDS_SAMPLEINFO"
                                userInfo={this.props.Login.userInfo}
                            /> :
                            <SampleInfoGrid
                                selectedSample={this.props.Login.masterData.JASelectedSample}
                                dataState={this.state.sampleGridDataState}
                                dataStateChange={this.sampleGridDataStateChange}
                                extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem) || []}
                                detailedFieldList={this.gridfillingColumn(this.state.DynamicGridMoreField) || []}
                                userInfo={this.props.Login.userInfo}
                                inputParam={this.props.Login.inputParam}
                                screenName="IDS_SAMPLEGRID"
                                expandField="expanded"
                                jsonField={"jsondata"}
                            />
                        : screenName === "IDS_ALLOTTEDTEST" ?

                            this.props.Login.masterData.TestView && this.props.Login.masterData.TestView.length === 1 ?
                                <SampleInfoView
                                    data={this.props.Login.masterData.TestView && this.props.Login.masterData.TestView.length > 0
                                        ? this.props.Login.masterData.TestView[this.props.Login.masterData.TestView.length - 1] : {}}
                                    SingleItem={this.state.testItem}
                                    screenName="IDS_TESTVIEW"
                                    userInfo={this.props.Login.userInfo}
                                /> :
                                <SampleInfoGrid
                                    primaryKeyField={"ntransactiontestcode"}
                                    selectedSample={this.props.Login.masterData.TestView}
                                    dataState={this.state.testGridDataState}
                                    dataStateChange={this.testGridDataStateChange}
                                    extractedColumnList={this.gridfillingColumn(this.state.DynamicTestGridItem) || []}
                                    detailedFieldList={this.gridfillingColumn(this.state.DynamicTestGridMoreField) || []}
                                    userInfo={this.props.Login.userInfo}
                                    inputParam={this.props.Login.inputParam}
                                    screenName="IDS_TESTGRID"
                                    expandField="expanded"
                                    jsonField={"jsondata"}
                                />
                            // : screenName === "IDS_ANALYSTCALENDAR" ?
                            //     <Scheduler data={this.state.data}  defaultDate={new Date()}>
                            //         <DayView numberOfDays={3} />
                            //         <WeekView />
                            //         <MonthView />   
                            //     </Scheduler>        
                            : ""
        )
    }

    attachmentTabDetail = () => {
        const attachmentTabMap = new Map();
        let ntransactiontestcode = this.props.Login.masterData.JASelectedTest ? this.props.Login.masterData.JASelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        let { testskip, testtake, subsampleskip, subsampletake, skip, take } = this.state
        let testList = this.props.Login.masterData.JA_TEST || [];
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.JASelectedTest, "ntransactiontestcode");
        let npreregno = this.props.Login.masterData.JASelectedSample ? this.props.Login.masterData.JASelectedSample.map(sample => sample.npreregno).join(",") : "-1";
        let ntransactionsamplecode = this.props.Login.masterData.JASelectedSubSample ?
            this.props.Login.masterData.JASelectedSubSample.map(sample => sample.ntransactionsamplecode).join(",") : "-1";
        let subsampleList = this.props.Login.masterData.JA_SUBSAMPLE || [];
        subsampleList = subsampleList.slice(subsampleskip, subsampleskip + subsampletake);
        let selectedSubSampleList = getSameRecordFromTwoArrays(subsampleList, this.props.Login.masterData.JASelectedSubSample, "ntransactionsamplecode");
        //let sampleList = this.props.Login.masterData.JA_SAMPLE || [];
        let sampleskip=this.state.sampleskip;
        let sampletake=this.state.sampletake
        let sampleList = this.props.Login.masterData.JA_SAMPLE && this.props.Login.masterData.JA_SAMPLE.slice(sampleskip, sampleskip + sampletake);
        //sampleList = sampleList.slice(skip, skip + take);
        let selectedSampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.JASelectedSample, "nregistrationsectioncode");


        attachmentTabMap.set("IDS_TESTATTACHMENTS", <Attachments
            tabSequence={SideBarSeqno.TEST}
            screenName="IDS_TESTATTACHMENTS"
            selectedMaster="JASelectedTest"
            onSaveClick={this.onAttachmentSaveClick}
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            masterList={selectedTestList}
            masterAlertStatus={"IDS_SELECTTESTTOADDATTACHEMENT"}
            attachments={this.props.Login.masterData.RegistrationTestAttachment || []}
            deleteRecord={this.props.deleteAttachment}
            fetchRecord={this.props.getAttachmentCombo}
            addName={"AddTestAttachment"}
            editName={"EditTestAttachment"}
            deleteName={"DeleteTestAttachment"}
            viewName={"ViewTestAttachment"}
            methodUrl={"TestAttachment"}
            nsubsampleneed={this.props.Login.masterData.nneedsubsample}
            subFields={[{ [designProperties.VALUE]: "stestsynonym" }, { [designProperties.VALUE]: "dcreateddate" }]}
            userInfo={this.props.Login.userInfo}
            deleteParam={
                {
                    methodUrl: "TestAttachment",
                    ntransactiontestcode,
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    esignRights: this.props.Login.userRoleControlRights,
                    screenName: "IDS_TESTATTACHMENTS"

                }
            }
            editParam={{
                methodUrl: "TestAttachment",
                ntransactiontestcode,
                userInfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData,
                esignRights: this.props.Login.userRoleControlRights,
                screenName: "IDS_TESTATTACHMENTS",
                masterList: selectedTestList
            }}
            selectedListName="IDS_TESTS"
            displayName="stestsynonym"
            isneedHeader={true}
        />)

        this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample &&
            attachmentTabMap.set("IDS_SUBSAMPLEATTACHMENTS", <Attachments
                tabSequence={SideBarSeqno.SUBSAMPLE}
                screenName="IDS_SUBSAMPLEATTACHMENTS"
                onSaveClick={this.onAttachmentSaveClick}
                selectedMaster="JASelectedSubSample"
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                attachments={this.props.Login.masterData.RegistrationSampleAttachment || []}
                deleteRecord={this.props.deleteAttachment}
                masterList={selectedSubSampleList}
                masterAlertStatus={"IDS_SELECTSUBSAMPLETOADDATTACHMENT"}
                fetchRecord={this.props.getAttachmentCombo}
                viewFile={this.props.viewAttachment}
                addName={"AddSubSampleAttachment"}
                editName={"EditSubSampleAttachment"}
                deleteName={"DeleteSubSampleAttachment"}
                viewName={"ViewSubSampleAttachment"}
                methodUrl={"SubSampleAttachment"}
                nsubsampleneed={this.props.Login.masterData.nneedsubsample}
                skip={this.props.Login.inputParam ? this.props.Login.inputParam.attachmentskip || 0 : 0}
                take={this.props.Login.inputParam ? this.props.Login.inputParam.attachmenttake || 10 : this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5}
                userInfo={this.props.Login.userInfo}
                deleteParam={
                    {
                        methodUrl: "SubSampleAttachment",
                        ntransactionsamplecode,
                        userInfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        esignRights: this.props.Login.userRoleControlRights
                    }
                }
                editParam={{
                    methodUrl: "SubSampleAttachment",
                    ntransactionsamplecode,
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    esignRights: this.props.Login.userRoleControlRights,
                    masterList: this.props.Login.masterData.JA_SUBSAMPLE || []

                }}
                selectedListName="IDS_SUBSAMPLE"
                displayName="ssamplearno"
                isneedHeader={true}
            />)
        attachmentTabMap.set("IDS_SAMPLEATTACHMENTS",
            <Attachments
                screenName="IDS_SAMPLEATTACHMENTS"
                tabSequence={SideBarSeqno.SAMPLE}
                selectedMaster="JASelectedSample"
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                attachments={this.props.Login.masterData.RegistrationAttachment || []}
                deleteRecord={this.props.deleteAttachment}
                onSaveClick={this.onAttachmentSaveClick}
                masterList={selectedSampleList}
                masterAlertStatus={"IDS_SELECTSAMPLETOADDATTACHEMENT"}
                fetchRecord={this.props.getAttachmentCombo}
                addName={"AddSampleAttachment"}
                editName={"EditSampleAttachment"}
                deleteName={"DeleteSampleAttachment"}
                viewName={"ViewSampleAttachment"}
                methodUrl={"SampleAttachment"}
                nsubsampleneed={this.props.Login.masterData.nneedsubsample}
                userInfo={this.props.Login.userInfo}
                deleteParam={
                    {
                        methodUrl: "SampleAttachment",
                        npreregno,
                        userInfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        esignRights: this.props.Login.userRoleControlRights,
                        screenName: this.props.Login.screenName

                    }
                }
                editParam={{
                    methodUrl: "SampleAttachment",
                    npreregno,
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    esignRights: this.props.Login.userRoleControlRights,
                    masterList: this.props.Login.masterData.JASelectedSample

                }}
                selectedListName="IDS_SAMPLE"
                displayName="sarno"
                isneedHeader={true}
            />)
        return attachmentTabMap;
    }


    commentTabDetail = () => {
        const commentTabMap = new Map();
        let { testskip, testtake, subsampleskip, subsampletake, sampleskip, sampletake } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : this.props.Login.masterData.JA_TEST || [];
        const editTestCommentsId = this.state.controlMap.has("EditTestComment") && this.state.controlMap.get("EditTestComment").ncontrolcode;
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.JASelectedTest, "ntransactiontestcode");
        let ntransactiontestcode = this.props.Login.masterData.JASelectedTest ? this.props.Login.masterData.JASelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        let npreregno = this.props.Login.masterData.JASelectedSample ? this.props.Login.masterData.JASelectedSample.map(sample => sample.npreregno).join(",") : "-1";
        const ntransactionsamplecode = this.props.Login.masterData.JASelectedSubSample ? this.props.Login.masterData.JASelectedSubSample.map(sample => sample.ntransactionsamplecode).join(",") : "-1";
        let subsampleList = this.props.Login.masterData.JA_SUBSAMPLE || [];
        subsampleList = subsampleList.slice(subsampleskip, subsampleskip + subsampletake);
        let selectedSubSampleList = getSameRecordFromTwoArrays(subsampleList, this.props.Login.masterData.JASelectedSubSample, "ntransactionsamplecode");
        let sampleList = this.props.Login.masterData.JA_SAMPLE || [];
        sampleList = sampleList.slice(sampleskip, sampleskip + sampletake);
        let selectedSampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.JASelectedSample, "nregistrationsectioncode");

        commentTabMap.set("IDS_TESTCOMMENTS", <Comments
            screenName="IDS_TESTCOMMENTS"
            tabSequence={SideBarSeqno.TEST}
            selectedMaster={selectedTestList}
            onSaveClick={this.onCommentsSaveClick}
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            Comments={this.props.Login.masterData.RegistrationTestComment || []}
            fetchRecord={this.props.getCommentsCombo}
            masterList={selectedTestList}
            masterAlertStatus={"IDS_SELECTTESTTOADDCOMMENTS"}
            addName={"AddTestComment"}
            editName={"EditTestComment"}
            deleteName={"DeleteTestComment"}
            methodUrl={"TestComment"}
            isTestComment={false}
            primaryKeyField={"ntestcommentcode"}
            dataState={this.state.testCommentDataState}
            dataStateChange={this.testDataStateChange}
            masterData={this.props.Login.masterData}
            deleteParam={
                {
                    methodUrl: "TestComment",
                    ntransactiontestcode,
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    esignRights: this.props.Login.userRoleControlRights,
                    screenName: "IDS_TESTCOMMENTS"

                }
            }
            editParam={{
                methodUrl: "TestComment",
                ntransactiontestcode,
                userInfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData,
                esignRights: this.props.Login.userRoleControlRights,
                screenName: "IDS_TESTCOMMENTS",
                operation: "update",
                masterList: selectedTestList,
                ncontrolCode: editTestCommentsId
            }}
            selectedListName="IDS_TESTS"
            displayName="stestsynonym"
            selectedId={this.props.Login.selectedId || null}
        />)
        this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample &&
            commentTabMap.set("IDS_SUBSAMPLECOMMENTS", <Comments
                screenName="IDS_SUBSAMPLECOMMENTS"
                tabSequence={SideBarSeqno.SUBSAMPLE}
                onSaveClick={this.onCommentsSaveClick}
                selectedMaster="JASelectedSubSample"
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                Comments={this.props.Login.masterData.RegistrationSampleComment || []}
                fetchRecord={this.props.getCommentsCombo}
                addName={"AddSubSampleComment"}
                editName={"EditSubSampleComment"}
                deleteName={"DeleteSubSampleComment"}
                methodUrl={"SubSampleComment"}
                masterData={this.props.Login.masterData}
                isTestComment={false}
                masterList={selectedSubSampleList}
                masterAlertStatus="IDS_SELECTSUBSAMPLETOADDCOMMENTS"
                primaryKeyField={"nsamplecommentcode"}
                dataState={this.state.subsampleCommentDataState}
                dataStateChange={this.subsampleDataStateChange}
                deleteParam={
                    {
                        methodUrl: "SubSampleComment",
                        ntransactionsamplecode,
                        userInfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        esignRights: this.props.Login.userRoleControlRights,
                        screenName: "IDS_SUBSAMPLECOMMENTS"

                    }
                }
                editParam={{
                    methodUrl: "SubSampleComment",
                    ntransactionsamplecode,
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    esignRights: this.props.Login.userRoleControlRights,
                    screenName: "IDS_SUBSAMPLECOMMENTS",
                    operation: "update",
                    masterList: this.props.Login.masterData.JA_SUBSAMPLE || [],
                    ncontrolCode: this.state.controlMap.has("EditSubSampleComment") && this.state.controlMap.get("EditSubSampleComment").ncontrolcode
                }}
                selectedListName="IDS_SUBSAMPLE"
                displayName="ssamplearno"
                selectedId={this.props.Login.selectedId || null}
            />)
        commentTabMap.set("IDS_SAMPLECOMMENTS", <Comments
            screenName="IDS_SAMPLECOMMENTS"
            tabSequence={SideBarSeqno.SAMPLE}
            onSaveClick={this.onCommentsSaveClick}
            selectedMaster="JASelectedSample"
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            Comments={this.props.Login.masterData.RegistrationComment || []}
            fetchRecord={this.props.getCommentsCombo}
            masterData={this.props.Login.masterData}
            addName={"AddSampleComment"}
            editName={"EditSampleComment"}
            deleteName={"DeleteSampleComment"}
            methodUrl={"SampleComment"}
            isTestComment={false}
            masterList={selectedSampleList}
            masterAlertStatus="IDS_SELECTSAMPLETOADDCOMMENTS"
            primaryKeyField={"nregcommentcode"}
            dataState={this.state.sampleCommentDataState}
            dataStateChange={this.sampleDataStateChange}
            deleteParam={
                {
                    methodUrl: "SampleComment",
                    npreregno,
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    esignRights: this.props.Login.userRoleControlRights,
                    screenName: "IDS_SAMPLECOMMENTS"

                }
            }
            editParam={{
                methodUrl: "SampleComment",
                npreregno,
                userInfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData,
                esignRights: this.props.Login.userRoleControlRights,
                screenName: "IDS_SAMPLECOMMENTS",
                operation: "update",
                masterList: this.props.Login.masterData.JASelectedSample || [],
                ncontrolCode: this.state.controlMap.has("EditSampleComment") && this.state.controlMap.get("EditSampleComment").ncontrolcode
            }}
            selectedListName="IDS_SAMPLE"
            displayName="sarno"
            selectedId={this.props.Login.selectedId || null}
        />)

        return commentTabMap;
    }

    testDataStateChange = (event) => {
        switch (this.props.Login.activeTestTab) {

            case "IDS_TESTCOMMENTS":
                this.setState({
                    testCommentDataState: event.dataState
                });
                break;
            case "IDS_TESTATTACHMENTS":
                this.setState({
                    testAttachmentDataState: event.dataState
                });
                break;
            case "IDS_TESTVIEW":
                this.setState({
                    testViewDataState: event.testViewDataState
                });
                break;
            default:
                this.setState({
                    testAttachmentDataState: event.dataState
                });
                break;
        }

    }

    subsampleDataStateChange = (event) => {
        switch (this.props.Login.activeSubSampleTab) {

            case "IDS_SUBSAMPLECOMMENTS":
                this.setState({
                    subsampleCommentDataState: event.dataState
                });
                break;
            case "IDS_SUBSAMPLEATTACHMENTS":
                this.setState({
                    subsampleAttachmentDataState: event.dataState
                });
                break;
            default:
                this.setState({
                    subsampleAttachmentDataState: event.dataState
                });
                break;
        }

    }

    sampleDataStateChange = (event) => {
        switch (this.props.Login.activeSampleTab) {

            case "IDS_SAMPLECOMMENTS":
                this.setState({
                    sampleCommentDataState: event.dataState
                });
                break;
            case "IDS_SAMPLEATTACHMENTS":
                this.setState({
                    sampleAttachmentDataState: event.dataState
                });
                break;
            default:
                this.setState({
                    sampleAttachmentDataState: event.dataState
                });
                break;
        }

    }

    sampleGridDataStateChange = (event) => {
        this.setState({
            sampleGridDataState: event.dataState
        });
    }

    testGridDataStateChange = (event) => {
        this.setState({
            testGridDataState: event.dataState
        });
    }

    onInputSwitchOnChange = (event) => {
        if (event.target.name == "PopupNav") {
            this.setState({
                enablePropertyPopup: !this.state.enablePropertyPopup
            })
        }
        else {
            this.setState({
                enableAutoClick: !this.state.enableAutoClick
            })
        }
    }

    gridfillingColumn(data) {
        const temparray = data && data.map((option) => {
            return { "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode] || "-", "dataField": option[designProperties.VALUE], "width": "200px", "columnSize": "3", "dataType": [option[designProperties.LISTITEM]] };
        });
        return temparray;
    }

    onSampleTabChange = (tabProps) => {
        const activeSampleTab = tabProps.screenName;
        if (activeSampleTab !== this.props.Login.activeSampleTab) {
            let inputData = {
                masterData: this.props.Login.masterData,
                JASelectedSample: this.props.Login.masterData.JASelectedSample,
                npreregno: this.props.Login.masterData.JASelectedSample ? this.props.Login.masterData.JASelectedSample.map(item => item.npreregno).join(",") : "-1",
                userinfo: this.props.Login.userInfo,
                screenName: activeSampleTab,
                activeSampleTab,
                activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex,
            }
            this.props.getSampleChildTabDetail(inputData)
        }
    }

    onSubSampleTabChange = (tabProps) => {
        const activeSubSampleTab = tabProps.screenName;
        if (activeSubSampleTab !== this.props.Login.activeSubSampleTab) {
            let inputData = {
                masterData: this.props.Login.masterData,
                JASelectedSubSample: this.props.Login.masterData.JASelectedSubSample,
                ntransactionsamplecode: this.props.Login.masterData.JASelectedSubSample ? this.props.Login.masterData.JASelectedSubSample.map(item => item.ntransactionsamplecode).join(",") : "-1",
                userinfo: this.props.Login.userInfo,
                screenName: activeSubSampleTab,
                activeSubSampleTab,
                subsampleAttachmentDataState: this.state.subsampleAttachmentDataState,
                subSampleCommentDataState: this.state.subsampleCommentDataState,
                activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex
            }
            this.props.getSubSampleChildTabDetail(inputData)
        }
    }

    onTestTabChange = (tabProps) => {
        const activeTestTab = tabProps.screenName;
        if (activeTestTab !== this.props.Login.activeTestTab) {
            if (this.props.Login.masterData.JASelectedTest && this.props.Login.masterData.JASelectedTest.length > 0) {
                let inputData = {
                    masterData: this.props.Login.masterData,
                    ntransactiontestcode: this.props.Login.masterData.JASelectedTest ? this.props.Login.masterData.JASelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
                    npreregno: this.props.Login.masterData.JASelectedSample ? this.props.Login.masterData.JASelectedSample.map(preregno => preregno.npreregno).join(",").toString() : "",
                    JASelectedTest: this.props.Login.masterData.JASelectedTest ? this.props.Login.masterData.JASelectedTest : "",
                    userinfo: this.props.Login.userInfo,
                    activeTestTab: activeTestTab,
                    screenName: activeTestTab,
                    testCommentDataState: this.state.testCommentDataState,
                }
                this.props.getTestChildTabDetailJobAllocation(inputData, true);
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }));
            }
        }
    }

    onAttachmentSaveClick = (saveType, formRef, selectedRecord) => {
        const masterData = this.props.Login.masterData;
        let inputData = {}
        let inputParam = {}
        inputData["userinfo"] = this.props.Login.userInfo;
        let { testskip, testtake, sampleskip, sampletake } = this.state
        let testList = [...this.props.Login.masterData.JA_TEST];
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.JASelectedTest, "ntransactiontestcode");
        let sampleList = [...this.props.Login.masterData.JA_SAMPLE];
        sampleList = sampleList.slice(sampleskip, sampleskip + sampletake);
        let selectedSampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.JASelectedSample, "nregistrationsectioncode");
        if (this.props.Login.screenName === "IDS_SAMPLEATTACHMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                selectedMaster: this.props.selectedMaster,
                npreregno: this.props.Login.masterData.JASelectedSample ? this.props.Login.masterData.JASelectedSample.map(x => x.npreregno).join(",") : "-1"
            }
            inputParam = onSaveSampleAttachment(saveParam, selectedSampleList);
        } else if (this.props.Login.screenName === "IDS_TESTATTACHMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                ntransactiontestcode: this.props.Login.masterData.JASelectedTest ? this.props.Login.masterData.JASelectedTest.map(x => x.ntransactiontestcode).join(",") : "-1"
            }
            inputParam = onSaveTestAttachment(saveParam, selectedTestList);
        }

        else if (this.props.Login.screenName === "IDS_SUBSAMPLEATTACHMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                selectedMaster: this.props.selectedMaster,
                ntransactionsamplecode: this.props.Login.masterData.JASelectedSubSample ? this.props.Login.masterData.JASelectedSubSample.map(x => x.ntransactionsamplecode).join(",") : "-1"
            }
            inputParam = onSaveSubSampleAttachment(saveParam, this.props.Login.masterData.JASelectedSubSample);
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData },
                    operation: this.props.Login.operation,
                    screenName: this.props.Login.screenName,
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openAttachmentModal");
        }
    }

    onCommentsSaveClick = (saveType, formRef, selectedRecord) => {
        const masterData = this.props.Login.masterData;
        let inputData = {}
        let inputParam = {}
        inputData["userinfo"] = this.props.Login.userInfo;
        let { testskip, testtake } = this.state
        let testList = [...this.props.Login.masterData.JA_TEST];
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.JASelectedTest, "ntransactiontestcode");
        if (this.props.Login.screenName === "IDS_TESTCOMMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                isTestComment: this.props.isTestComment,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                ntransactiontestcode: this.props.Login.masterData.JASelectedTest ? this.props.Login.masterData.JASelectedTest.map(x => x.ntransactiontestcode).join(",") : "-1"
            }
            inputParam = onSaveTestComments(saveParam, selectedTestList);
        }
        if (this.props.Login.screenName === "IDS_SUBSAMPLECOMMENTS") {
            let sampleList = [];
            if (this.props.Login.masterData.searchedSubSample !== undefined) {
                sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSubSample, this.props.Login.masterData.JA_SUBSAMPLE.slice(this.state.subsampleskip, this.state.subsampleskip + this.state.subsampletake), "npreregno");
            } else {
                sampleList = this.props.Login.masterData.JA_SUBSAMPLE.slice(this.state.subsampleskip, this.state.subsampleskip + this.state.subsampletake);
            }
            let acceptList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.JASelectedSubSample, "ntransactionsamplecode");
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                isTestComment: this.props.isTestComment,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                ntransactionsamplecode: this.props.Login.masterData.JASelectedSubSample ? this.props.Login.masterData.JASelectedSubSample.map(x => x.ntransactionsamplecode).join(",") : "-1"
            }
            inputParam = onSaveSubSampleComments(saveParam, acceptList);
        }

        if (this.props.Login.screenName === "IDS_SAMPLECOMMENTS") {
            let sampleList = [];
            if (this.props.Login.masterData.searchedSample !== undefined) {
                sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.JA_SAMPLE.slice(this.state.sampleskip, this.state.sampleskip + this.state.sampletake), "npreregno");
            } else {
                sampleList = this.props.Login.masterData.JA_SAMPLE.slice(this.state.sampleskip, this.state.sampleskip + this.state.sampletake);
            }
            let acceptList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.JASelectedSample, "nregistrationsectioncode");

            let saveParam = {
                userInfo: this.props.Login.userInfo,
                isTestComment: this.props.isTestComment,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                npreregno: this.props.Login.masterData.JASelectedSample ? this.props.Login.masterData.JASelectedSample.map(x => x.npreregno).join(",") : "-1"
            }
            inputParam = onSaveSampleComments(saveParam, acceptList);
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData },
                    operation: this.props.Login.operation,
                    screenName: this.props.Login.screenName,
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openCommentModal");
        }
    }



    onFilterComboChange = (comboData, fieldName) => {
        if (comboData) {
            let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
            let inputParamData = {};
            if (fieldName === 'nsampletypecode') {
                if (comboData.value !== this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode) {
                    inputParamData = {
                        nflag: 2,
                        fromdate: obj.fromDate,
                        todate: obj.toDate,
                        nsampletypecode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        defaultSampleTypeValue: comboData.item,
                        realDesignTemplateMappingValue: this.props.Login.masterData.realDesignTemplateMappingValue,
                        realDynamicDesignMappingList: this.props.Login.masterData.realDynamicDesignMappingList
                    };
                    this.props.getRegTypeJobAllocation(inputParamData)
                }
            } else if (fieldName === 'nregtypecode') {
                if (comboData.value !== this.props.Login.masterData.defaultRegTypeValue.nregtypecode) {
                    inputParamData = {
                        nflag: 3,
                        fromdate: obj.fromDate,
                        todate: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode,
                        nregtypecode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        defaultRegTypeValue: comboData.item,
                        realDesignTemplateMappingValue: this.props.Login.masterData.realDesignTemplateMappingValue,
                        realDynamicDesignMappingList: this.props.Login.masterData.realDynamicDesignMappingList

                    }
                    this.props.getRegSubTypeJobAllocation(inputParamData)
                }
            } else if (fieldName === 'nregsubtypecode') {

                if (comboData.value !== this.props.Login.masterData.defaultRegSubTypeValue.nregsubtypecode) {
                    let inputData = {
                        nflag: 4,
                        fromdate: obj.fromDate,
                        todate: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.defaultRegTypeValue.nregtypecode,
                        nneedtemplatebasedflow: comboData.item.nneedtemplatebasedflow,
                        nregsubtypecode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        realDesignTemplateMappingValue: this.props.Login.masterData.realDesignTemplateMappingValue,
                        realDynamicDesignMappingList: this.props.Login.masterData.realDynamicDesignMappingList
                    }
                    inputParamData = {
                        inputData,
                        masterData: {
                            ...this.props.Login.masterData,
                            defaultRegSubTypeValue: comboData.item
                        }
                    }
                    this.props.getAppConfigVersionJobAllocation(inputParamData)
                }
            } else if (fieldName === 'napprovalconfigversioncode') {
                if (comboData.value !== this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode) {

                    inputParamData = {
                        nflag: 5,
                        fromdate: obj.fromDate,
                        todate: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.defaultRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.defaultRegSubTypeValue.nregsubtypecode,
                        napprovalconfigversioncode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: { ...this.props.Login.masterData, defaultApprovalVersionValue: comboData.item },
                        RegSubTypeValue: this.props.Login.masterData.defaultRegSubTypeValue,
                        ntransactionstatus: this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus.toString(),
                        realDesignTemplateMappingValue: this.props.Login.masterData.realDesignTemplateMappingValue,
                        realDynamicDesignMappingList: this.props.Login.masterData.realDynamicDesignMappingList
                    }
                    this.props.getDesignTemplateJobAllocation(inputParamData)

                }
            } else if (fieldName === 'nsectioncode') {
                if (comboData.value !== this.props.Login.masterData.defaultUserSectionValue.nsectioncode) {
                    inputParamData = {
                        nflag: 6,
                        fromdate: obj.fromDate,
                        todate: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.defaultRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.defaultRegSubTypeValue.nregsubtypecode,
                        napprovalconfigversioncode: this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode,
                        ndesigntemplatemappingcode: this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode,
                        nsectioncode: comboData.value === 0 ? this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") : comboData.value.toString(),
                        userinfo: this.props.Login.userInfo,
                        masterData: { ...this.props.Login.masterData, defaultUserSectionValue: comboData.item },
                        RegSubTypeValue: this.props.Login.masterData.defaultRegSubTypeValue,
                        ntransactionstatus: this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus.toString(),
                    }

                    this.props.getSectionJobAllocation(inputParamData);
                }
            } else if (fieldName === 'ntransactionstatus') {
                if (comboData.value !== this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus) {

                    inputParamData = {
                        nflag: 7,
                        fromdate: obj.fromDate,
                        todate: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.defaultRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.defaultRegSubTypeValue.nregsubtypecode,
                        napprovalconfigversioncode: this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode,
                        ndesigntemplatemappingcode: this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode,
                        userinfo: this.props.Login.userInfo,
                        masterData: { ...this.props.Login.masterData, defaultFilterStatusValue: comboData.item },
                        RegSubTypeValue: this.props.Login.masterData.defaultRegSubTypeValue,
                        ntransactionstatus: comboData.value === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : comboData.value.toString()

                    }

                    this.props.getFilterStatusJobAllocation(inputParamData);
                }
            } else if (fieldName === 'ntestcode') {
                if (comboData.value !== this.props.Login.masterData.defaultTestValue.ntestcode) {
                    let masterData = { ...this.props.Login.masterData, defaultTestValue: comboData.item }
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData }
                    }
                    this.props.updateStore(updateInfo);
                }
            } else if (fieldName === 'ndesigntemplatemappingcode') {
                if (comboData.value !== this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode) {
                    let masterData = { ...this.props.Login.masterData, defaultDesignTemplateMappingValue: comboData.item }
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData }
                    }
                    this.props.updateStore(updateInfo);
                }
            } else {
                if (comboData.value !== this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus) {
                    inputParamData = {
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.defaultRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.defaultRegSubTypeValue.nregsubtypecode,
                        napprovalversioncode: this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode,
                        userinfo: this.props.Login.userInfo,
                        masterData: { ...this.props.Login.masterData, FilterStatusValue: comboData.item },
                        RegSubTypeValue: this.props.Login.masterData.defaultRegSubTypeValue,
                        ntransactionstatus: comboData.value,
                        stransactionstatus: comboData.value === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : comboData.value,
                        nsectioncode: this.props.Login.masterData.defaultUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") : this.props.Login.masterData.defaultUserSectionValue.nsectioncode,
                    }

                    this.props.getTestStatusJobAllocation(inputParamData);
                }
            }
        }

    }

    handleFilterDateChange = (dateName, dateValue) => {


        let fromdate = this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()
        let todate = this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()
        let obj = {}
        if (dateName === 'fromDate') {
            obj = convertDateValuetoString(dateValue, todate, this.props.Login.userInfo)
            fromdate = obj.fromDate
            todate = obj.toDate
        } else {
            obj = convertDateValuetoString(fromdate, dateValue, this.props.Login.userInfo)
            fromdate = obj.fromDate
            todate = obj.toDate

        }
        let inputParam = {
            inputData: {
                nflag: 2,
                nregtypecode: this.props.Login.masterData.defaultRegTypeValue && this.props.Login.masterData.defaultRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue.nregsubtypecode,
                nneedtemplatebasedflow: this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue.nneedtemplatebasedflow,
                fromdate: String(fromdate),
                todate: String(todate),
                userinfo: this.props.Login.userInfo,
                realDesignTemplateMappingValue: this.props.Login.masterData.realDesignTemplateMappingValue,
                realDynamicDesignMappingList: this.props.Login.masterData.realDynamicDesignMappingList
            },
            masterData: this.props.Login.masterData

        }
        this.props.getAppConfigVersionJobAllocation(inputParam)
    }

    onReload = () => {
        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)

        let realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate);
        let realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate);

        let defaultSampleTypeValue = this.props.Login.masterData.realSampleTypeValue
        let defaultRegTypeValue = this.props.Login.masterData.realRegTypeValue
        let defaultRegSubTypeValue = this.props.Login.masterData.realRegSubTypeValue
        let defaultFilterStatusValue = this.props.Login.masterData.realFilterStatusValue
        let defaultApprovalVersionValue = this.props.Login.masterData.realApprovalVersionValue
        let defaultUserSectionValue = this.props.Login.masterData.realUserSectionValue
        let defaultTestValue = this.props.Login.masterData.realTestValue
        let defaultDesignTemplateMappingValue = this.props.Login.masterData.realDesignTemplateMappingValue
        let masterData = { ...this.props.Login.masterData, realFromDate, realToDate, defaultSampleTypeValue, defaultRegTypeValue, defaultRegSubTypeValue, defaultFilterStatusValue, defaultApprovalVersionValue, defaultUserSectionValue, defaultTestValue, defaultDesignTemplateMappingValue }
        let inputData = {
            nsampletypecode: (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode) || -1,
            nregtypecode: parseInt(this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
            nregsubtypecode: parseInt(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
            ntransactionstatus: this.props.Login.masterData.realFilterStatusValue!==undefined? this.props.Login.masterData.realFilterStatusValue.ntransactionstatus !== undefined? this.props.Login.masterData.realFilterStatusValue.ntransactionstatus !== '0' ? String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) : "-1":"-1":"-1",
            napprovalconfigcode: this.props.Login.masterData.realApprovalVersionValue!==undefined ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode  : -1 : null,
            napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue !=undefined? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) :-1 :null,
            nsectioncode: this.props.Login.masterData.realUserSectionValue!==undefined ? this.props.Login.masterData.realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.realUserSectionValue.nsectioncode) : null,
			//ALPD-4953--Added by Vignesh R(28-03-2025)--> When click the refresh button 500 error occuring while there is no record.
            //start--ALPD-4953
			ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode!==undefined ? this.props.Login.masterData.realTestValue.ntestcode === 0 ? this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.realTestValue.ntestcode) :null: null,
            //end--ALPD-4953
			nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
            nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
            ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
            userinfo: this.props.Login.userInfo,
            activeTestTab: this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS",
            activeSampleTab: this.props.Login.activeTestTab || "IDS_SAMPLEATTACHMENTS",
            activeSubSampleTab: this.props.Login.activeTestTab || "IDS_SUBSAMPLEATTACHMENTS",
            //checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            
            //ntype: 2
        }
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
            && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
            && defaultFilterStatusValue.stransdisplaystatus !== null && inputData.nsectioncode !== "undefined") {

            inputData['fromdate'] = obj.fromDate;
            inputData['todate'] = obj.toDate;
            let inputParam = {
                masterData,
                inputData,
                searchSampleRef: this.searchSampleRef,
                searchSubSampleRef: this.searchSubSampleRef,
                searchTestRef: this.searchTestRef,
                sampleskip: this.state.sampleskip,
                sampletake: this.state.sampletake,
                testskip: this.state.testskip,
                testtake: this.state.testtake,
                testAttachmentDataState: this.state.testAttachmentDataState,
                testCommentDataState: this.state.testCommentDataState,
                testViewDataState: this.state.testViewDataState

            }
            this.props.getJobAllcationFilterSubmit(inputParam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }

    }

    onFilterSubmit = () => {
        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)

        let realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate);
        let realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate);

        let realSampleTypeValue = this.props.Login.masterData.defaultSampleTypeValue
        let realRegTypeValue = this.props.Login.masterData.defaultRegTypeValue
        let realRegSubTypeValue = this.props.Login.masterData.defaultRegSubTypeValue
        let realFilterStatusValue = this.props.Login.masterData.defaultFilterStatusValue
        let realApprovalVersionValue = this.props.Login.masterData.defaultApprovalVersionValue
        let realUserSectionValue = this.props.Login.masterData.defaultUserSectionValue
        let realTestValue = this.props.Login.masterData.defaultTestValue
        let realDesignTemplateMappingValue = this.props.Login.masterData.defaultDesignTemplateMappingValue
        let realSampleTypeList = this.props.Login.masterData.SampleType
        let realRegistrationTypeList = this.props.Login.masterData.RegistrationType
        let realRegistrationSubTypeList = this.props.Login.masterData.RegistrationSubType
        let realApprovalConfigVersionList = this.props.Login.masterData.ApprovalConfigVersion
        let realFilterStatusList1 = this.props.Login.masterData.FilterStatus
        let realUserSectionList = this.props.Login.masterData.UserSection
        let realTestList = this.props.Login.masterData.Test
        let realDynamicDesignMappingList = this.props.Login.masterData.DynamicDesignMapping
        let masterData = {
            ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue,
            realRegTypeValue, realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue,
            realUserSectionValue, realTestValue, realDesignTemplateMappingValue, realSampleTypeList,
            realRegistrationTypeList, realRegistrationSubTypeList, realApprovalConfigVersionList, realFilterStatusList1,
            realUserSectionList, realTestList, realDynamicDesignMappingList
        }
        //ALPD-4755 to insert the filter data's in filterdetail table when submit the filter,done by Dhanushya RI
        let inputData = {
            saveFilterSubmit:true,
            sampleTypeValue: this.props.Login.masterData.defaultSampleTypeValue && this.props.Login.masterData.defaultSampleTypeValue,
            regTypeValue: this.props.Login.masterData.defaultRegTypeValue && this.props.Login.masterData.defaultRegTypeValue,
            regSubTypeValue: this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue,
            approvalConfigValue: this.props.Login.masterData.defaultApprovalVersionValue && this.props.Login.masterData.defaultApprovalVersionValue,
            filterStatusValue: this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue,
            testValue: this.props.Login.masterData.defaultTestValue && this.props.Login.masterData.defaultTestValue,
            sectionValue: this.props.Login.masterData.defaultUserSectionValue && this.props.Login.masterData.defaultUserSectionValue,
            designTemplateMappingValue: this.props.Login.masterData.defaultDesignTemplateMappingValue && this.props.Login.masterData.defaultDesignTemplateMappingValue,
            nsampletypecode: (this.props.Login.masterData.defaultSampleTypeValue && this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode) || -1,
            nregtypecode: parseInt(this.props.Login.masterData.defaultRegTypeValue && this.props.Login.masterData.defaultRegTypeValue.nregtypecode) || -1,
            nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue.nregsubtypecode) || -1,
            ntransactionstatus: ((this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus !== undefined) || this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus !== '0') ? String(this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus) : "-1",
            napprovalconfigcode: this.props.Login.masterData.defaultApprovalVersionValue ? this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigcode || -1 : null,
            napprovalversioncode: this.props.Login.masterData.defaultApprovalVersionValue && this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode) : null,
            nsectioncode: this.props.Login.masterData.defaultUserSectionValue ? this.props.Login.masterData.defaultUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.defaultUserSectionValue.nsectioncode) : null,
            ntestcode: this.props.Login.masterData.defaultTestValue ? this.props.Login.masterData.defaultTestValue.ntestcode === 0 ? this.props.Login.masterData.Test && this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.defaultTestValue.ntestcode) : null,
            //ntestcode: this.props.Login.masterData.defaultTestValue ? this.props.Login.masterData.defaultTestValue.ntestcode : -1,
            nneedsubsample: (this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue.nneedsubsample) || false,
            nneedtemplatebasedflow: (this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue.nneedtemplatebasedflow) || false,
            ndesigntemplatemappingcode: (this.props.Login.masterData.defaultDesignTemplateMappingValue && this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
            userinfo: this.props.Login.userInfo,
            activeTestTab: this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS",
            activeSampleTab: this.props.Login.activeTestTab || "IDS_SAMPLEATTACHMENTS",
            activeSubSampleTab: this.props.Login.activeTestTab || "IDS_SUBSAMPLEATTACHMENTS",
            //checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            //ntype: 2
        }
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
            && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
            && realFilterStatusValue.stransdisplaystatus !== null && inputData.nsectioncode !== "undefined" && inputData.ntestcode !== "undefined") {

            inputData['fromdate'] = obj.fromDate;
            inputData['todate'] = obj.toDate;
            let inputParam = {
                masterData,
                inputData,
                searchSubSampleRef: this.searchSubSampleRef,
                searchSampleRef: this.searchSampleRef,
                searchTestRef: this.searchTestRef,
                skip: this.state.skip,
                take: this.state.take,
                testskip: this.state.testskip,
                testtake: this.state.testtake,
                testAttachmentDataState: this.state.testAttachmentDataState,
                testCommentDataState: this.state.testCommentDataState,
                testViewDataState: this.state.testViewDataState

            }
            this.props.getJobAllcationFilterSubmit(inputParam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }

    }
    //ALPD-3781
    updateSection(controlcode,testskip,testtake,operation){
        if(this.props.Login.masterData.JASelectedTest.length>0){
            let testList=[];
            if(this.props.Login.masterData.searchedTest!==undefined){
                testList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.searchedTest.slice(testskip, testskip + testtake), "ntransactiontestcode");

            }else{
                testList = this.props.Login.masterData.JA_TEST && this.props.Login.masterData.JA_TEST.slice(testskip, testskip + testtake);

            }
            let selectedTestList = getSameRecordFromTwoArrays(testList || [], this.props.Login.masterData.JASelectedTest, "ntransactiontestcode");
        
       
            let tempsection = 0;
            let sectionvalue = 0;
            let sectionflag = true;               
            selectedTestList.forEach((item) => {
                sectionvalue = item.nsectioncode;
                if (sectionvalue !== tempsection && tempsection !== 0) {
                    sectionflag = false;
                } else {
                    tempsection = sectionvalue;
                }
            });
    
         if(sectionflag){
            let inputParam = {};
            let Map={
                nsampletypecode: this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.realRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode,
                napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue.napprovalversioncode,
                nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode.toString() : "-1",
                npreregno: selectedTestList ? selectedTestList.map(sample => sample.npreregno).join(",") : "",
                ntransactionsamplecode: selectedTestList ? selectedTestList.map(subsample => subsample.ntransactionsamplecode).join(",") : "",
                ntransactiontestcode: selectedTestList ? selectedTestList.map(test => test.ntransactiontestcode).join(",") : "",
                nselectedtestcode: selectedTestList ? selectedTestList.map(sample => sample.ntestcode).join(",") : "",
                ncontrolcode: controlcode,
                nneedsubsample: this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
                userinfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData,
                operation: operation,
                screenName: this.props.intl.formatMessage({ id: "IDS_SECTION" }),
        };
        inputParam={
            inputData:Map,selectedRecord:this.state.selectedRecord
        }
        this.props.getSectionTest(inputParam); 
    }else{
        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMESECTIONTEST" }));

    }                                       
    }
    
    else{
        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }));

    }
}

    AllotJobStatus (controlcode,testskip, testtake,operation,type) {
//ALPD-3758
       // if(this.props.Login.settings&&parseInt(this.props.Login.settings[43])===transactionStatus.NO){
        let testList = [];
        if (this.props.Login.masterData.searchedTest !== undefined) {
            testList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.searchedTest.slice(testskip, testskip + testtake), "ntransactiontestcode");
        } else {
            testList = this.props.Login.masterData.JA_TEST && this.props.Login.masterData.JA_TEST.slice(testskip, testskip + testtake);
        }
        let allotList = getSameRecordFromTwoArrays(testList || [], this.props.Login.masterData.JASelectedTest, "ntransactiontestcode");
        if(type !==1 && allotList && allotList.length !==1){
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTONETEST" }));
        }else {
            if (allotList && allotList.length > 0) {
                let testList = this.props.Login.masterData.JASelectedTest;
                let tempsection = 0;
                let sectionvalue = 0;
                let sectionflag = true;               
                allotList.forEach((item) => {
                    sectionvalue = item.nsectioncode;
                    if (sectionvalue !== tempsection && tempsection !== 0) {
                        sectionflag = false;
                    } else {
                        tempsection = sectionvalue;
                    }
                });

                let tempinstrument = 0;
                let instrumentvalue = 0;
                let instrumentcategoryflag = true;                
                allotList.forEach((item) => {
                    instrumentvalue = item.ninstrumentcatcode;
                    if (instrumentvalue !== tempinstrument && tempinstrument !== 0) {
                        instrumentcategoryflag = false;
                    } else {
                        tempinstrument = instrumentvalue;
                    }
                });

                if (sectionflag) {
                    if (instrumentcategoryflag) {
                        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
                                    
                        let inputParam = {};
                        let Map = {
                            fromdate: obj.fromDate,
                            todate: obj.toDate,
                            nsampletypecode: this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                            nregtypecode: this.props.Login.masterData.realRegTypeValue.nregtypecode,
                            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                            ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode,
                            ntransactionstatus: this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
                            napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue.napprovalversioncode,
                            nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode.toString() : "-1",
                            ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode === 0 ? this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.realTestValue.ntestcode) : null,
                            npreregno: allotList ? allotList.map(sample => sample.npreregno).join(",") : "",
                            ntransactionsamplecode: allotList ? allotList.map(subsample => subsample.ntransactionsamplecode).join(",") : "",
                            transactiontestcode: allotList ? allotList.map(test => test.ntransactiontestcode).join(",") : "",
                            ntransactiontestcode: 0,
                            ncontrolcode: controlcode,
                            nneedsubsample: this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
                            nneedtemplatebasedflow: this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow,
                            checkBoxOperation: checkBoxOperation.SINGLESELECT,
                            userinfo: this.props.Login.userInfo,
                            masterData: this.props.Login.masterData,
                            operation: operation,
                            nselecttype : operation ==="Reschedule" && allotList && allotList.length ===1 ? 1 :2,
                            nselectedtestcode:allotList ? allotList.map(ntestcodeList => ntestcodeList.ntestcode).join(",") : "",
                    
                        }
                        inputParam = {
                            inputData: Map,
                        }          
                        this.props.getAllottedTestWise(inputParam,type);                                        
                    } else {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMEINSTRUMENTCATEGORYTEST" }));
                    }
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMESECTIONTEST" }));
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }));
            } 
        }
   // }else{
     //   toast.warn(this.props.intl.formatMessage({ id: "IDS_SCHEDULENOTVAILABLE" }));

   // }
    }

    AllotAnotherUserStatus(anotherUserId, testskip, testtake) {
//ALPD-3758
        //if(this.props.Login.settings&&parseInt(this.props.Login.settings[43])===transactionStatus.NO){

        let testList = [];
        if (this.props.Login.masterData.searchedTest !== undefined) {
            // testList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.JA_TEST.slice(testskip, testskip + testtake), "ntransactiontestcode");
            testList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.searchedTest.slice(testskip, testskip + testtake), "ntransactiontestcode");
        } else {
            testList = this.props.Login.masterData.JA_TEST
                && this.props.Login.masterData.JA_TEST.slice(testskip, testskip + testtake);
        }
        let anotherUserList = getSameRecordFromTwoArrays(testList || [], this.props.Login.masterData.JASelectedTest, "ntransactiontestcode");
        if (anotherUserList && anotherUserList.length === 1) {

            let tempsection = 0;
            let sectionvalue = 0;
            let bflag = true;

            let testList = this.props.Login.masterData.JASelectedTest;
            testList.forEach((item) => {
                sectionvalue = item.nsectioncode;

                if (sectionvalue !== tempsection && tempsection !== 0) {
                    bflag = false;
                } else {
                    tempsection = sectionvalue;
                }
            });



            if (bflag) {
                let JASelectedTest = this.props.Login.masterData.JASelectedTest;
                let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
                // START ALPD-3570 VISHAKH
                // let arr = [];
                // JASelectedTest && JASelectedTest.map((item) => {
                //     if (!arr.includes(item.nsectioncode)) {
                //         arr.push(item.nsectioncode)
                //     }
                // }
                // )
                // END ALPD-3570 VISHAKH
                let inputParam = {};
                let Map = {
                    fromdate: obj.fromDate,
                    todate: obj.toDate,
                    nsampletypecode: this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.realRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                    ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode,
                    ntransactionstatus: this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
                    napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue.napprovalversioncode,
                    //nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.realUserSectionValue.nsectioncode) : null,
                    // nsectioncode: arr.map(nsectioncode => nsectioncode).join(","),
                    nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode.toString() : "-1",
                    ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode === 0 ? this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.realTestValue.ntestcode) : null,
                    npreregno: JASelectedTest ? JASelectedTest.map(sample => sample.npreregno).join(",") : "",
                    ntransactionsamplecode: JASelectedTest ? JASelectedTest.map(subsample => subsample.ntransactionsamplecode).join(",") : "",
                    transactiontestcode: JASelectedTest ? JASelectedTest.map(test => test.ntransactiontestcode).join(",") : "",
                    ntransactiontestcode: 0,
                    ncontrolcode: anotherUserId,
                    nneedsubsample: this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
                    nneedtemplatebasedflow: this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow,
                    //checkBoxOperation: 3,
                    checkBoxOperation: checkBoxOperation.SINGLESELECT,
                    userinfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    operation: 'AllotAnotherUser'
                }
                inputParam = {
                    inputData: Map,
                }
                this.props.getAllotAnotherUserTestWise(inputParam);


            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMESECTIONTEST" }));
            }
        } else if (anotherUserList && anotherUserList.length > 1) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSINGLETEST" }));
        } else if (anotherUserList && anotherUserList.length === 0) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }));
        }
   // }
   // else{
     //   toast.warn(this.props.intl.formatMessage({ id: "IDS_SCHEDULENOTVAILABLE" }));

   // }
    }

    CancelStatus = (cancelId) => {

        let { testskip, testtake } = this.state;

        //Added by sonia on 1st Aug 2024 for  JIRA ID:ALPD-4551
        let testList = [];
        if (this.props.Login.masterData.searchedTest !== undefined) {
            testList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.searchedTest.slice(testskip, testskip + testtake), "ntransactiontestcode");
        } else {
            testList = this.props.Login.masterData.JA_TEST && this.props.Login.masterData.JA_TEST.slice(testskip, testskip + testtake);
        }
        let cancelList = getSameRecordFromTwoArrays(testList || [], this.props.Login.masterData.JASelectedTest, "ntransactiontestcode");

        if (cancelList && cancelList.length > 0) {
            let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);

            let inputParam = {};
            let arr = [];
            // START ALPD-3570 VISHAKH
            // JASelectedTest && JASelectedTest.map((item) => {
            //     if (!arr.includes(item.nsectioncode)) {
            //         arr.push(item.nsectioncode)
            //     }
            // }
            // )
            // END ALPD-3570 VISHAKH
            let Map = {
                fromdate: obj.fromDate,
                todate: obj.toDate,
                nsampletypecode: this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.realRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode,
                // ntransactionstatus: this.props.Login.masterData.realFilterStatusValue.ntransactionstatus.toString(),
                ntransactionstatus: "0",
                // nsectioncode: arr ? arr.map(nsectioncode => nsectioncode).join(",") : "",
                nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode.toString() : "-1",
                ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode === 0 ? this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.realTestValue.ntestcode) : null,
                // npreregno: JASelectedTest ? JASelectedTest.map(sample => sample.npreregno).join(",") : "",
                // ntransactionsamplecode: JASelectedTest ? JASelectedTest.map(sample => sample.ntransactionsamplecode).join(",") : "",
                // ntransactiontestcode: JASelectedTest ? JASelectedTest.map(sample => sample.ntransactiontestcode).join(",") : "",
                npreregno: cancelList ? cancelList.map(sample => sample.npreregno).join(",") : "",
                ntransactionsamplecode: cancelList ? cancelList.map(sample => sample.ntransactionsamplecode).join(",") : "",
                ntransactiontestcode: cancelList ? cancelList.map(sample => sample.ntransactiontestcode).join(",") : "",
                ncontrolcode: cancelId,
                nneedsubsample: this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
                nneedtemplatebasedflow: this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow,
                //checkBoxOperation: 3,
                checkBoxOperation: checkBoxOperation.SINGLESELECT,
                ntype: 1,
                userinfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData,
                screenName: this.props.Login.screenName,
                activeTestTab: this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS",
                activeSampleTab: this.props.Login.activeTestTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeTestTab || "IDS_SUBSAMPLEATTACHMENTS",

            }
            inputParam = {
                inputData: Map,
                postParamList: this.postParamList,
                classUrl: "joballocation",
                operation: 'cancel',
                methodUrl: "Test",
                action: "canceltest",
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, cancelId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true,
                        parentPopUpSize: 'lg',
                        screenName: this.props.Login.screenName,
                        operation: 'cancel'
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.CancelTestWise(inputParam);
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))
        }


    }


    onJobAllocationTestWise = (action) => {
        if (action.scontrolname === "Analyst Calendar") {
            let JASelectedTest = this.props.Login.masterData.JASelectedTest;
            let inputParam = {};
            let Map = {
                nregtypecode: this.props.Login.masterData.realRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                nsectioncode: this.props.Login.masterData.realUserSectionValue.nsectioncode,
                ntestcode: this.props.Login.masterData.realTestValue.ntestcode,
                transactiontestcode: JASelectedTest ? JASelectedTest.map(test => test.ntransactiontestcode).join(",") : "",
                ncontrolcode: action.ncontrolcode,
                userinfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData,
                screenName: this.props.Login.screenName,
                operation: "ViewAnalystCalendar",
                openModal: true,

            }
            inputParam = {
                inputData: Map,
            }
            this.props.ViewAnalystCalendar(inputParam);

        } else if (action.scontrolname === "Instrument Calendar") {

        }


    }

    onSaveClick = (saveType, formRef) => {

        if (this.props.Login.operation === "AllotJob") {
            //inputParam = this.onSaveAllotJobInSchedule(saveType, formRef);
            this.onSaveAllotJob(saveType, formRef);
        } else if (this.props.Login.operation === "AllotAnotherUser") {
            this.onSaveAllotAnotherUser(saveType, formRef);
        } else if (this.props.Login.operation === "Reschedule") {
            this.onSaveReschedule(saveType, formRef);
        }else if (this.props.Login.operation === "AllotJobCalendar") {
            this.onSaveAllotJobInSchedule(saveType)
        }
        else if(this.props.Login.operation === "updateSection"){
            this.onSaveSection(saveType, formRef)

        }

    }

    onSaveAllotJobInSchedule = (saveType) => {
        let inputParam = {};
        let JobAllocationData = {};
        let allotjob = this.state.calenderSelectedRecord;
      //  if (allotjob['ntechniquecode']) {
        if (allotjob['nusercode']) {
            const data = this.state.data.filter(x => x.insertRecord)

            if (data.length > 0) {
                const josnArray = [];

                let JASelectedTest = this.props.Login.masterData.JASelectedTest;
                // START ALPD-3570 VISHAKH
                // let arr = [];
                // this.props.Login.masterData.JASelectedSample &&
                //     this.props.Login.masterData.JASelectedSample.map((item) => {
                //         if (!arr.includes(item.nsectioncode)) {
                //             arr.push(item.nsectioncode)
                //         }
                //     }
                //     )
                // END ALPD-3570 VISHAKH
                JASelectedTest && JASelectedTest.map((item) => {
                    const sleectedData = data.filter(x => x.ntransactiontestcode === item.ntransactiontestcode)
                    if (sleectedData.length > 0) {
                        const val = {
                            "Technique": {
                                label: allotjob.ntechniquecode && allotjob.ntechniquecode.label || 'NA',
                                value: allotjob.ntechniquecode && allotjob.ntechniquecode.value || -1
                            },
                            "Users": {
                                label: allotjob.nusercode.label,
                                value: allotjob.nusercode.value
                            },
                            "UserStartDate": convertDateTimetoStringDBFormat(sleectedData[0].start, this.props.Login.userInfo),
                            "UserEndDate": convertDateTimetoStringDBFormat(sleectedData[0].end, this.props.Login.userInfo),

                            "UserHoldDuration": -1,
                            "UserPeriod": {
                                label: "Hour(s)",
                                value: -1,
                            },
                            "InstrumentCategory": {
                                label: "",
                                value: sleectedData[0].InstrumentCategory || -1
                            },
                            "InstrumentName": {
                                label: "",
                                value: sleectedData[0].InstrumentName || -1
                            },
                            "Instrument": {
                                label: "",
                                value: sleectedData[0].Instrument || -1
                            },
                            "InstrumentStartDate": sleectedData[0].InstrumentCategory && sleectedData[0].InstrumentCategory !== -1 ? convertDateTimetoStringDBFormat(sleectedData[0].start, this.props.Login.userInfo) : "",
                            "InstrumentEndDate": sleectedData[0].InstrumentCategory && sleectedData[0].InstrumentCategory !== -1 ? convertDateTimetoStringDBFormat(sleectedData[0].end, this.props.Login.userInfo) : "",
                            "InstrumentHoldDuration": -1,
                            "InstrumentPeriod": {
                                label: 'Hour(s)',
                                value: -1
                            },
                            "Comments": sleectedData[0].description || ""
                        }

                        const valJsonUi = {
                            "Technique": allotjob.ntechniquecode && allotjob.ntechniquecode.label || 'NA',
                            "Users": allotjob.nusercode.label,
                            "UserStartDate": val.UserStartDate,
                            "UserEndDate": val.UserEndDate,
                            "InstrumentStartDate": val.InstrumentStartDate || "",
                            "InstrumentEndDate": val.InstrumentEndDate || "",
                            "Comments": val.description || ""
                        }
                        const objJobAllocation = {}
                        objJobAllocation['jsondata'] = JSON.stringify(val)
                        objJobAllocation['jsonuidata'] = JSON.stringify(valJsonUi)
                        objJobAllocation["ninstrumentcatcode"] = val.InstrumentCategory.value || -1
                        objJobAllocation["ninstrumentcode"] = val.Instrument.value || -1
                        objJobAllocation["ninstrumentnamecode"] = val.InstrumentName.value || -1
                        josnArray.push(objJobAllocation)
                    }
                }
                )
                JobAllocationData["npreregno"] = JASelectedTest ? JASelectedTest.map(sample => sample.npreregno).join(",") : "";
                JobAllocationData["ntransactionsamplecode"] = JASelectedTest ? JASelectedTest.map(sample => sample.ntransactionsamplecode).join(",") : "";
                JobAllocationData["ntransactiontestcode"] = JASelectedTest ? JASelectedTest.map(sample => sample.ntransactiontestcode).join(",") : "";
                // JobAllocationData["nsectioncode"] = arr ? arr.map(nsectioncode => nsectioncode).join(",") : "";
                JobAllocationData["nsectioncode"] = this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode.toString() : "-1";
                JobAllocationData["ntechniquecode"] = allotjob.ntechniquecode && allotjob.ntechniquecode.value || -1;
                JobAllocationData["nusercode"] = allotjob.nusercode.value;

                JobAllocationData = { ...JobAllocationData, ...josnArray[0] }

                JobAllocationData["nuserperiodcode"] = -1;
                JobAllocationData["ninstrumentperiodcode"] = -1;

                JobAllocationData["ncontrolcode"] = this.props.Login.ncontrolCode;
                JobAllocationData["userinfo"] = this.props.Login.userInfo;
                JobAllocationData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue.nregtypecode;
                JobAllocationData["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode;
                JobAllocationData["ndesigntemplatemappingcode"] = this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode;
                JobAllocationData["masterData"] = this.props.Login.masterData;
                JobAllocationData["activeSampleTab"] = "IDS_SAMPLEATTACHMENTS";
                JobAllocationData["activeSubSampleTab"] = "IDS_SUBSAMPLEATTACHMENTS";
                JobAllocationData["activeTestTab"] = "IDS_TESTATTACHMENTS";

                inputParam = {
                    classUrl: "joballocation",
                    methodUrl: "Create",
                    displayName: this.props.Login.inputParam.displayName,
                    inputData: JobAllocationData,
                    selectedId: this.state.selectedRecord["njoballocationcode"],
                    operation: this.props.Login.operation,
                    saveType,
                    searchRef: this.searchRef,
                    postParamList: this.postParamList,
                    action: "AllotJobCalendar"
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                            openModal: true, screenName: this.props.intl.formatMessage({ id: "Job Allocation" }),
                            operation: this.props.Login.operation
                        }
                    }
                    this.props.updateStore(updateInfo);
                    this.setState({ data: [], calenderSelectedRecord: {} })
                } else {
                    this.props.AllotJobActionCalendar(inputParam);
                    this.setState({ data: [], calenderSelectedRecord: {} })
                }

            }
        
            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_ADDANYONETESTTOADD" }))
            }
        }
        else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTUSER" }))
            }

        //} else {
         //   toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTECHNIQUE" }))
       // }


    }


    onSaveAllotJob = (saveType, formRef) => {
        let inputParam = {};
        let JobAllocationData = {};
        let obj = {};
        let allotjob = this.state.selectedRecord;

        obj["allotjobdata"] = {
            "Technique": {
                label: allotjob.ntechniquecode && allotjob.ntechniquecode.label || 'NA',
                value: allotjob.ntechniquecode && allotjob.ntechniquecode.value || -1
            },
            "Users": {
                label: allotjob.nusercode.label,
                value: allotjob.nusercode.value
            },
            "UserStartDate": convertDateTimetoStringDBFormat(allotjob.duserblockfromdatetime, this.props.Login.userInfo),
            "UserEndDate": "",
            "UserHoldDuration": allotjob.suserholdduration,
            "UserPeriod": {
                label: allotjob.nuserperiodcode.label,
                value: allotjob.nuserperiodcode.value
            },
            "InstrumentCategory": {
                label: allotjob.ninstrumentcatcode.label,
                value: allotjob.ninstrumentcatcode.value
            },
            "InstrumentName": {
                label: allotjob.ninstrumentnamecode && allotjob.ninstrumentnamecode.label || 'NA',
                value: allotjob.ninstrumentnamecode && allotjob.ninstrumentnamecode.value || -1
            },
            "InstrumentId": {
                label: allotjob.ninstrumentcode && allotjob.ninstrumentcode.label || 'NA',
                value: allotjob.ninstrumentcode && allotjob.ninstrumentcode.value || -1
            },            
            "InstrumentStartDate": allotjob.dinstblockfromdatetime ? convertDateTimetoStringDBFormat(allotjob.dinstblockfromdatetime, this.props.Login.userInfo) : "",
            "InstrumentEndDate": "",
            "InstrumentHoldDuration": allotjob.sinstrumentholdduration || -1,
            "InstrumentPeriod": {
                label: allotjob.ninstrumentperiodcode && allotjob.ninstrumentperiodcode.label || 'NA',
                value: allotjob.ninstrumentperiodcode && allotjob.ninstrumentperiodcode.value || -1
            },

            "Comments": allotjob.scomments


        }

        obj["allotjobuidata"] = {
            "Technique": allotjob.ntechniquecode && allotjob.ntechniquecode.label || 'NA',
            "Users": allotjob.nusercode.label,
            "UserStartDate": convertDateTimetoStringDBFormat(allotjob.duserblockfromdatetime, this.props.Login.userInfo),
            "UserEndDate": "",
            "UserHoldDuration": allotjob.suserholdduration,
            "UserPeriod": allotjob.nuserperiodcode.label,
            "InstrumentCategory": allotjob.ninstrumentcatcode.label,
            "InstrumentName": allotjob.ninstrumentnamecode && allotjob.ninstrumentnamecode.label || 'NA',
            "InstrumentId": allotjob.ninstrumentcode && allotjob.ninstrumentcode.label || 'NA',
            "InstrumentStartDate": allotjob.dinstblockfromdatetime ? convertDateTimetoStringDBFormat(allotjob.dinstblockfromdatetime, this.props.Login.userInfo) : "",
            "InstrumentEndDate": "",
            "InstrumentHoldDuration": allotjob.sinstrumentholdduration || -1,
            "InstrumentPeriod": allotjob.ninstrumentperiodcode && allotjob.ninstrumentperiodcode.label || 'NA',
            "Comments": allotjob.scomments
        }

        let JASelectedTest = this.props.Login.masterData.JASelectedTest;
        // START ALPD-3570 VISHAKH
        // let arr = [];
        // JASelectedTest && JASelectedTest.map((item) => {
        //     if (!arr.includes(item.nsectioncode)) {
        //         arr.push(item.nsectioncode)
        //     }
        // }
        // )
        // END ALPD-3570 VISHAKH
        let testList = [];
        let { testskip, testtake } = this.state
        if (this.props.Login.masterData.searchedTest !== undefined) {
            // testList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.JA_TEST.slice(testskip, testskip + testtake), "ntransactiontestcode");
            testList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.searchedTest.slice(testskip, testskip + testtake), "ntransactiontestcode");
        } else {
            testList = this.props.Login.masterData.JA_TEST
                && this.props.Login.masterData.JA_TEST.slice(testskip, testskip + testtake);
        }
        let allotList = getSameRecordFromTwoArrays(testList || [], this.props.Login.masterData.JASelectedTest, "ntransactiontestcode");

        JobAllocationData["jsondata"] = JSON.stringify(obj["allotjobdata"]);
        JobAllocationData["jsonuidata"] = JSON.stringify(obj["allotjobuidata"]);
        // JobAllocationData["npreregno"] = JASelectedTest ? JASelectedTest.map(sample => sample.npreregno).join(",") : "";
        // JobAllocationData["ntransactionsamplecode"] = JASelectedTest ? JASelectedTest.map(sample => sample.ntransactionsamplecode).join(",") : "";
        // JobAllocationData["ntransactiontestcode"] = JASelectedTest ? JASelectedTest.map(sample => sample.ntransactiontestcode).join(",") : "";
        JobAllocationData["npreregno"] = allotList ? allotList.map(sample => sample.npreregno).join(",") : "";
        JobAllocationData["ntransactionsamplecode"] = allotList ? allotList.map(sample => sample.ntransactionsamplecode).join(",") : "";
        JobAllocationData["ntransactiontestcode"] = allotList ? allotList.map(sample => sample.ntransactiontestcode).join(",") : "";
        // JobAllocationData["nsectioncode"] = arr ? arr.map(nsectioncode => nsectioncode).join(",") : "";
        JobAllocationData["nsectioncode"] = this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode.toString() : "-1";

        JobAllocationData["ntechniquecode"] = allotjob.ntechniquecode && allotjob.ntechniquecode.value || -1;
        JobAllocationData["nusercode"] = allotjob.nusercode.value;
        JobAllocationData["nuserperiodcode"] = allotjob.nuserperiodcode.value;
        JobAllocationData["ninstrumentcatcode"] = allotjob.ninstrumentcatcode.value;
        JobAllocationData["ninstrumentnamecode"] = allotjob.ninstrumentnamecode &&  allotjob.ninstrumentnamecode.value || -1;
        JobAllocationData["ninstrumentcode"] = allotjob.ninstrumentcode && allotjob.ninstrumentcode.value || -1;
        JobAllocationData["ninstrumentperiodcode"] = allotjob.ninstrumentperiodcode && allotjob.ninstrumentperiodcode.value || -1;
        JobAllocationData["ncontrolcode"] = this.props.Login.ncontrolCode;
        JobAllocationData["ntype"] = 1;
        JobAllocationData["userinfo"] = this.props.Login.userInfo;
        JobAllocationData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue.nregtypecode;
        JobAllocationData["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode;
        JobAllocationData["ndesigntemplatemappingcode"] = this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode;
        JobAllocationData["masterData"] = this.props.Login.masterData;
        JobAllocationData["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
        JobAllocationData["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
        JobAllocationData["activeTestTab"] = this.props.Login.activeTestTab || 'IDS_TESTATTACHMENTS';



        inputParam = {
            classUrl: "joballocation",
            methodUrl: "Create",
            displayName: this.props.Login.inputParam.displayName,
            inputData: JobAllocationData,
            selectedId: this.state.selectedRecord["njoballocationcode"],
            operation: this.props.Login.operation,
            saveType, formRef,
            searchRef: this.searchRef,
            postParamList: this.postParamList,
            action: "allotjob"

        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: "Job Allocation" }),
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.AllotJobAction(inputParam);
        }




    }


    onSaveAllotAnotherUser = (saveType, formRef) => {
        let inputParam = {};
        let JobAllocationData = {};
        let obj = {};
        let allotjob = this.state.selectedRecord;

        obj["anotheruserdata"] = {
            "Technique" : {
                label:this.props.Login.Technique,
                value:this.props.Login.TechniqueCode
            },
            "Users": {
                label: allotjob.nusercode.label,
                value: allotjob.nusercode.value
            },
            "UserStartDate": convertDateTimetoStringDBFormat(allotjob.duserblockfromdatetime, this.props.Login.userInfo),
            "UserEndDate": "",
            "UserHoldDuration": allotjob.suserholdduration,
            "UserPeriod": {
                label: allotjob.nuserperiodcode.label,
                value: allotjob.nuserperiodcode.value
            },
            "Comments": allotjob.scomments
        }

        obj["anotheruseruidata"] = {
            "Technique":this.props.Login.Technique,
            "Users": allotjob.nusercode.label,
            "UserStartDate": convertDateTimetoStringDBFormat(allotjob.duserblockfromdatetime, this.props.Login.userInfo),
            "UserEndDate": "",
            "UserHoldDuration": allotjob.suserholdduration,
            "UserPeriod": allotjob.nuserperiodcode.label,
            "Comments": allotjob.scomments
        }

        // let arr = [];
        let JASelectedTest = this.props.Login.masterData.JASelectedTest;
        // START ALPD-3570 VISHAKH
        // JASelectedTest && JASelectedTest.map((item) => {
        //     if (!arr.includes(item.nsectioncode)) {
        //         arr.push(item.nsectioncode)
        //     }
        // }
        // )
        // END ALPD-3570 VISHAKH
        JobAllocationData["jsondata"] = JSON.stringify(obj["anotheruserdata"]);
        JobAllocationData["jsonuidata"] = JSON.stringify(obj["anotheruseruidata"]);
        JobAllocationData["npreregno"] = JASelectedTest ? JASelectedTest.map(sample => sample.npreregno).join(",") : "";
        JobAllocationData["ntransactionsamplecode"] = JASelectedTest ? JASelectedTest.map(sample => sample.ntransactionsamplecode).join(",") : "";
        JobAllocationData["ntransactiontestcode"] = JASelectedTest ? JASelectedTest.map(sample => sample.ntransactiontestcode).join(",") : "";
        JobAllocationData["ntransstatus"] = JASelectedTest ? JASelectedTest.map(sample => sample.ntransactionstatus).join(",") : "";

        //JobAllocationData["nsectioncode"] = this.props.Login.masterData.realUserSectionValue.nsectioncode;
        // JobAllocationData["nsectioncode"] = arr ? arr.map(nsectioncode => nsectioncode).join(",") : "";
        JobAllocationData["nsectioncode"] = this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode.toString() : "-1";
        JobAllocationData["ntechniquecode"] = this.props.Login.TechniqueCode;
        JobAllocationData["nusercode"] = allotjob.nusercode.value;
        JobAllocationData["nuserperiodcode"] = allotjob.nuserperiodcode.value;
        JobAllocationData["ninstrumentcatcode"] = -1;
        JobAllocationData["ninstrumentnamecode"] = -1;
        JobAllocationData["ninstrumentcode"] = -1;
        JobAllocationData["ninstrumentperiodcode"] = -1;
        JobAllocationData["ncontrolcode"] = this.props.Login.ncontrolCode;
        JobAllocationData["ntype"] = 1;
        JobAllocationData["userinfo"] = this.props.Login.userInfo;
        JobAllocationData["masterData"] = this.props.Login.masterData;
        JobAllocationData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue.nregtypecode;
        JobAllocationData["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode;
        JobAllocationData["ndesigntemplatemappingcode"] = this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode;
        JobAllocationData["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
        JobAllocationData["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
        JobAllocationData["activeTestTab"] = this.props.Login.activeTestTab || 'IDS_TESTATTACHMENTS';

        inputParam = {
            classUrl: "joballocation",
            methodUrl: "Create",
            displayName: this.props.Login.inputParam.displayName,
            inputData: JobAllocationData,
            selectedId: this.state.selectedRecord["njoballocationcode"],
            operation: this.props.Login.operation, saveType, formRef,
            searchRef: this.searchRef,
            postParamList: this.postParamList,
            action: "allotanotheruser"

        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: "Job Allocation" }),
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.AllotAnotherUserAction(inputParam);

        }




    }

    onSaveReschedule = (saveType, formRef) => {
        let inputParam = {};
        let JobAllocationData = {};
        let obj = {};
        let allotjob = this.state.selectedRecord;

        obj["rescheduledata"] = {
            "Technique": {
                label: allotjob.ntechniquecode && allotjob.ntechniquecode.label || 'NA',
                value: allotjob.ntechniquecode && allotjob.ntechniquecode.value || -1
            },
            "Users": {
                label: allotjob.nusercode.label,
                value: allotjob.nusercode.value
            },
            "UserStartDate": convertDateTimetoStringDBFormat(allotjob.duserblockfromdatetime, this.props.Login.userInfo),
            "UserEndDate": "",
            "UserHoldDuration": allotjob.suserholdduration,
            "UserPeriod": {
                label: allotjob.nuserperiodcode.label,
                value: allotjob.nuserperiodcode.value
            },

            "InstrumentCategory": {
                label: allotjob.ninstrumentcatcode.label,
                value: allotjob.ninstrumentcatcode.value
            },
            "InstrumentName": {
                label: allotjob.ninstrumentnamecode && allotjob.ninstrumentnamecode.label || 'NA',
                value: allotjob.ninstrumentnamecode && allotjob.ninstrumentnamecode.value || -1
            },
            "InstrumentId": {
                label: allotjob.ninstrumentcode && allotjob.ninstrumentcode.label || 'NA',
                value: allotjob.ninstrumentcode && allotjob.ninstrumentcode.value || -1
            },            
            "InstrumentStartDate": allotjob.dinstblockfromdatetime ? convertDateTimetoStringDBFormat(allotjob.dinstblockfromdatetime, this.props.Login.userInfo) : "",
            "InstrumentEndDate": "",
            "InstrumentHoldDuration": allotjob.sinstrumentholdduration || -1,
            "InstrumentPeriod": {
                label: allotjob.ninstrumentperiodcode && allotjob.ninstrumentperiodcode.label || 'NA',
                value: allotjob.ninstrumentperiodcode && allotjob.ninstrumentperiodcode.value || -1
            },

            "Comments": allotjob.scomments,
            "Section": {    
                label: allotjob.nsectioncode && allotjob.nsectioncode.label || 'NA',
                value: allotjob.nsectioncode && allotjob.nsectioncode.value || -1
            }



        }
        obj["reschdeuleuidata"] = {
            "Technique": allotjob.ntechniquecode && allotjob.ntechniquecode.label || 'NA',
            "Users": allotjob.nusercode.label,
            "UserStartDate": convertDateTimetoStringDBFormat(allotjob.duserblockfromdatetime, this.props.Login.userInfo),
            "UserEndDate": "",
            "UserHoldDuration": allotjob.suserholdduration,
            "UserPeriod": allotjob.nuserperiodcode.label,
            "InstrumentCategory": allotjob.ninstrumentcatcode.label,
            "InstrumentName": allotjob.ninstrumentnamecode && allotjob.ninstrumentnamecode.label || 'NA',
            "InstrumentId": allotjob.ninstrumentcode && allotjob.ninstrumentcode.label || "NA",
            "InstrumentStartDate": allotjob.dinstblockfromdatetime ? convertDateTimetoStringDBFormat(allotjob.dinstblockfromdatetime, this.props.Login.userInfo) : "",
            "InstrumentEndDate": "",
            "InstrumentHoldDuration": allotjob.sinstrumentholdduration || -1,
            "InstrumentPeriod": allotjob.ninstrumentperiodcode && allotjob.ninstrumentperiodcode.label || 'NA',
            "Comments": allotjob.scomments,
            "Section": allotjob.nsectioncode.label


        }
        // START ALPD-3570 VISHAKH
        // let JASelectedTest = this.props.Login.masterData.JASelectedTest;
        // let arr = [];
        // JASelectedTest && JASelectedTest.map((item) => {
        //     if (!arr.includes(item.nsectioncode)) {
        //         arr.push(item.nsectioncode)
        //     }
        // }
        // )

        let testList = [];
        let { testskip, testtake } = this.state
        if (this.props.Login.masterData.searchedTest !== undefined) {
            // testList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.JA_TEST.slice(testskip, testskip + testtake), "ntransactiontestcode");
            testList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.searchedTest.slice(testskip, testskip + testtake), "ntransactiontestcode");
        } else {
            testList = this.props.Login.masterData.JA_TEST
                && this.props.Login.masterData.JA_TEST.slice(testskip, testskip + testtake);
        }
        let rescheduleList = getSameRecordFromTwoArrays(testList || [], this.props.Login.masterData.JASelectedTest, "ntransactiontestcode");
        // END ALPD-3570 VISHAKH
        JobAllocationData["jsondata"] = JSON.stringify(obj["rescheduledata"]);
        JobAllocationData["jsonuidata"] = JSON.stringify(obj["reschdeuleuidata"]);
        JobAllocationData["npreregno"] = rescheduleList ? rescheduleList.map(sample => sample.npreregno).join(",") : "";
        JobAllocationData["ntransactionsamplecode"] = rescheduleList ? rescheduleList.map(sample => sample.ntransactionsamplecode).join(",") : "";
        JobAllocationData["ntransactiontestcode"] = rescheduleList ? rescheduleList.map(sample => sample.ntransactiontestcode).join(",") : "";
        JobAllocationData["ntransstatus"] = rescheduleList ? rescheduleList.map(sample => sample.ntransactionstatus).join(",") : "";

        // JobAllocationData["npreregno"] = JASelectedTest ? JASelectedTest.map(sample => sample.npreregno).join(",") : "";
        // JobAllocationData["ntransactionsamplecode"] = JASelectedTest ? JASelectedTest.map(sample => sample.ntransactionsamplecode).join(",") : "";
        // JobAllocationData["ntransactiontestcode"] = JASelectedTest ? JASelectedTest.map(sample => sample.ntransactiontestcode).join(",") : "";
        //JobAllocationData["nsectioncode"] = this.props.Login.masterData.realUserSectionValue.nsectioncode;
        // JobAllocationData["nsectioncode"] = arr ? arr.map(nsectioncode => nsectioncode).join(",") : "";
        JobAllocationData["nsectioncode"] = allotjob.nsectioncode&&allotjob.nsectioncode.value.toString() || -1;
        JobAllocationData["nfiltersectioncode"] = this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode.toString() : "-1";
        JobAllocationData["nselectedtestcode"]= rescheduleList ? rescheduleList.map(sample => sample.ntestcode).join(",") : "";

        JobAllocationData["ntechniquecode"] = allotjob.ntechniquecode && allotjob.ntechniquecode.value || -1;
        JobAllocationData["nusercode"] = allotjob.nusercode.value;
        JobAllocationData["nuserperiodcode"] = allotjob.nuserperiodcode.value;
        JobAllocationData["ninstrumentcatcode"] = allotjob.ninstrumentcatcode.value;
        JobAllocationData["ninstrumentnamecode"] = allotjob.ninstrumentnamecode && allotjob.ninstrumentnamecode.value || -1;
        JobAllocationData["ninstrumentcode"] = allotjob.ninstrumentcode && allotjob.ninstrumentcode.value || -1;
        JobAllocationData["ninstrumentperiodcode"] = allotjob.ninstrumentperiodcode && allotjob.ninstrumentperiodcode.value || -1;
        JobAllocationData["ncontrolcode"] = this.props.Login.ncontrolCode;
        JobAllocationData["ntype"] = allotjob.nsectioncode&&allotjob.nsectioncode.value===this.props.Login.masterData.realUserSectionValue.nsectioncode ?  1:2;
        JobAllocationData["userinfo"] = this.props.Login.userInfo;
        JobAllocationData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue.nregtypecode;
        JobAllocationData["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode;
        JobAllocationData["ndesigntemplatemappingcode"] = this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode;
        JobAllocationData["masterData"] = this.props.Login.masterData;
        JobAllocationData["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
        JobAllocationData["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
        JobAllocationData["activeTestTab"] = this.props.Login.activeTestTab || 'IDS_TESTATTACHMENTS';
        JobAllocationData["napprovalversioncode"]  =this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode;

        inputParam = {
            classUrl: "joballocation",
            methodUrl: "Create",
            displayName: this.props.Login.inputParam.displayName,
            inputData: JobAllocationData,
            selectedId: this.state.selectedRecord["njoballocationcode"],
            operation: this.props.Login.operation, saveType, formRef,
            searchRef: this.searchRef,
            postParamList: this.postParamList,
            action: "reschedule"

        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: "Job Allocation" }),
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.RescheduleJobAction(inputParam);

        }

    }

    getActiveTestURL() {
        let url = "attachment/getTestAttachment"
        switch (this.props.Login.activeTestTab) {
            case "IDS_TESTATTACHMENTS":
                url = "attachment/getTestAttachment"
                break;
            case "IDS_TESTCOMMENTS":
                url = "comments/getTestComment"
                break;
            default:
                url = "comments/getTestComment"
                break;
        }
        return url;
    }


    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let isOpen = this.props.Login.isOpen;
        let selectedRecord = this.props.Login.selectedRecord;
        let screenName = this.props.Login.screenName;
        let InstrumentCategory = this.props.Login.InstrumentCategory;
        let InstrumentName = this.props.Login.InstrumentName;
        let InstrumentId = this.props.Login.InstrumentId;


        // if (this.state.openAnalystCalendar) {
        //     this.setState({ openAnalystCalendar: false })
        // }
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "AllotJob" || this.props.Login.operation === "AllotAnotherUser" || this.props.Login.operation === "Reschedule" || this.props.Login.operation==="updateSection")  {
                loadEsign = false;
                openModal = true;
                isOpen = false;
                //selectedRecord["agree"] = 4;
                selectedRecord['esignpassword'] = "";
                selectedRecord['esigncomments'] = "";
                selectedRecord['esignreason'] = "";
                if(!this.props.Login.operation==="updateSection")
                screenName="";
            }
            else {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
                selectedRecord['esignreason'] = "";
                InstrumentName = [];
                InstrumentId = [];
                InstrumentCategory = [];
            }
        } else {
            openModal = false;
            selectedRecord = {};
            InstrumentName = [];
            InstrumentId = [];
            InstrumentCategory = [];
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal, loadEsign, selectedRecord, selectedId: null, isOpen,screenName,
                InstrumentCategory, InstrumentName,InstrumentId, masterData: { ...this.props.Login.masterData, analystCalenderData: [] }
            },
        };
        this.props.updateStore(updateInfo);
    };

    validateEsign = () => {
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
        this.props.validateEsignforJobAllocation(inputParam, "openModal");
    }

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    };
    closeModalShowForFilter = () => {
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
//ALPD-4755 To open the save popup of filtername,done by Dhanushya RI
openFilterName = () => {
    const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {  modalShow: true,operation:"create",modalTitle:this.props.intl.formatMessage({ id: "IDS_SAVEFILTER" })}
    }
    this.props.updateStore(updateInfo);
}
//ALPD-4755 to insert the filter name in filtername table,done by Dhanushya RI
onSaveModalFilterName = () => {
    let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)

    let realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate);
    let realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate);

    let realSampleTypeValue = this.props.Login.masterData.defaultSampleTypeValue
    let realRegTypeValue = this.props.Login.masterData.defaultRegTypeValue
    let realRegSubTypeValue = this.props.Login.masterData.defaultRegSubTypeValue
    let realFilterStatusValue = this.props.Login.masterData.defaultFilterStatusValue
    let realApprovalVersionValue = this.props.Login.masterData.defaultApprovalVersionValue
    let realUserSectionValue = this.props.Login.masterData.defaultUserSectionValue
    let realTestValue = this.props.Login.masterData.defaultTestValue
    let realDesignTemplateMappingValue = this.props.Login.masterData.defaultDesignTemplateMappingValue
    let realSampleTypeList = this.props.Login.masterData.SampleType
    let realRegistrationTypeList = this.props.Login.masterData.RegistrationType
    let realRegistrationSubTypeList = this.props.Login.masterData.RegistrationSubType
    let realApprovalConfigVersionList = this.props.Login.masterData.ApprovalConfigVersion
    let realFilterStatusList1 = this.props.Login.masterData.FilterStatus
    let realUserSectionList = this.props.Login.masterData.UserSection
    let realTestList = this.props.Login.masterData.Test
    let realDynamicDesignMappingList = this.props.Login.masterData.DynamicDesignMapping
    let masterData = {
        ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue,
        realRegTypeValue, realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue,
        realUserSectionValue, realTestValue, realDesignTemplateMappingValue, realSampleTypeList,
        realRegistrationTypeList, realRegistrationSubTypeList, realApprovalConfigVersionList, realFilterStatusList1,
        realUserSectionList, realTestList, realDynamicDesignMappingList
    }
    let inputData = {
        sfiltername:this.state.selectedRecord && this.state.selectedRecord.sfiltername !== null
        ? this.state.selectedRecord.sfiltername: "",
        needExtraKeys:true,
        sampleTypeValue: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue,
        regTypeValue: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue,
        regSubTypeValue: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue,
        approvalConfigValue: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue,
        filterStatusValue: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue,
        testValue: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue,
        sectionValue: this.props.Login.masterData.realUserSectionValue && this.props.Login.masterData.realUserSectionValue,
        designTemplateMappingValue: this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue,
        nsampletypecode: (this.props.Login.masterData.defaultSampleTypeValue && this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode) || -1,
        nregtypecode: parseInt(this.props.Login.masterData.defaultRegTypeValue && this.props.Login.masterData.defaultRegTypeValue.nregtypecode) || -1,
        nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue.nregsubtypecode) || -1,
        ntranscode: ((this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus !== undefined) || this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus !== '0') ? String(this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus) : "-1",
        napprovalconfigcode: this.props.Login.masterData.defaultApprovalVersionValue ? this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigcode || -1 : null,
        napprovalversioncode: this.props.Login.masterData.defaultApprovalVersionValue && this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode) : null,
        nsectioncode: this.props.Login.masterData.defaultUserSectionValue ? this.props.Login.masterData.defaultUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.defaultUserSectionValue.nsectioncode) : null,
        ntestcode: this.props.Login.masterData.defaultTestValue ? this.props.Login.masterData.defaultTestValue.ntestcode === 0 ? this.props.Login.masterData.Test && this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.defaultTestValue.ntestcode) : null,
        nneedsubsample: (this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue.nneedsubsample) || false,
        nneedtemplatebasedflow: (this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue.nneedtemplatebasedflow) || false,
        ndesigntemplatemappingcode: (this.props.Login.masterData.defaultDesignTemplateMappingValue && this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
        userinfo: this.props.Login.userInfo,
        activeTestTab: this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS",
        activeSampleTab: this.props.Login.activeTestTab || "IDS_SAMPLEATTACHMENTS",
        activeSubSampleTab: this.props.Login.activeTestTab || "IDS_SUBSAMPLEATTACHMENTS",
        checkBoxOperation: checkBoxOperation.SINGLESELECT,

    }
    if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
        && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
        && realFilterStatusValue.stransdisplaystatus !== null && inputData.nsectioncode !== "undefined" && inputData.ntestcode !== "undefined") {

        inputData['fromdate'] = obj.fromDate;
        inputData['todate'] = obj.toDate;
        let inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "FilterName",
            masterData,
            inputData,
            operation:"create"
        }
        this.props.crudMaster(inputParam, masterData, "modalShow");
    } else {
        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
    }

}  
     //ALPD-4755-To get previously saved filter details when click the filter name,,done by Dhanushya RI
    clickFilterDetail = (value) => {
        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo) 
      
    let realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate);
    let realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate);

    let realSampleTypeValue = this.props.Login.masterData.defaultSampleTypeValue
    let realRegTypeValue = this.props.Login.masterData.defaultRegTypeValue
    let realRegSubTypeValue = this.props.Login.masterData.defaultRegSubTypeValue
    let realFilterStatusValue = this.props.Login.masterData.defaultFilterStatusValue
    let realApprovalVersionValue = this.props.Login.masterData.defaultApprovalVersionValue
    let realUserSectionValue = this.props.Login.masterData.defaultUserSectionValue
    let realTestValue = this.props.Login.masterData.defaultTestValue
    let realDesignTemplateMappingValue = this.props.Login.masterData.defaultDesignTemplateMappingValue
    let realSampleTypeList = this.props.Login.masterData.SampleType
    let realRegistrationTypeList = this.props.Login.masterData.RegistrationType
    let realRegistrationSubTypeList = this.props.Login.masterData.RegistrationSubType
    let realApprovalConfigVersionList = this.props.Login.masterData.ApprovalConfigVersion
    let realFilterStatusList1 = this.props.Login.masterData.FilterStatus
    let realUserSectionList = this.props.Login.masterData.UserSection
    let realTestList = this.props.Login.masterData.Test
    let realDynamicDesignMappingList = this.props.Login.masterData.DynamicDesignMapping
    let masterData = {
        ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue,
        realRegTypeValue, realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue,
        realUserSectionValue, realTestValue, realDesignTemplateMappingValue, realSampleTypeList,
        realRegistrationTypeList, realRegistrationSubTypeList, realApprovalConfigVersionList, realFilterStatusList1,
        realUserSectionList, realTestList, realDynamicDesignMappingList
    }
        let inputData = {
        nfilternamecode:value && value.nfilternamecode? value.nfilternamecode:-1,
        userinfo: this.props.Login.userInfo,
        nsampletypecode: (this.props.Login.masterData.defaultSampleTypeValue && this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode) || -1,
        nregtypecode: parseInt(this.props.Login.masterData.defaultRegTypeValue && this.props.Login.masterData.defaultRegTypeValue.nregtypecode) || -1,
        nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue.nregsubtypecode) || -1,
        ntranscode: ((this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus !== undefined) || this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus !== '0') ? String(this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus) : "-1",
        napprovalconfigcode: this.props.Login.masterData.defaultApprovalVersionValue ? this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigcode || -1 : null,
        napprovalversioncode: this.props.Login.masterData.defaultApprovalVersionValue && this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode) : null,
        nsectioncode: this.props.Login.masterData.defaultUserSectionValue ? this.props.Login.masterData.defaultUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.defaultUserSectionValue.nsectioncode) : null,
        //ALPD-4953--Added by Vignesh R(28-03-2025)--> When click the refresh button 500 error occuring while there is no record.
        //start--ALPD-4953
		ntestcode: this.props.Login.masterData.defaultTestValue ? this.props.Login.masterData.defaultTestValue.ntestcode!==undefined?this.props.Login.masterData.defaultTestValue.ntestcode === 0 ? this.props.Login.masterData.Test && this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.defaultTestValue.ntestcode) : null:null,
        //end--ALPD-4953
		nneedsubsample: (this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue.nneedsubsample) || false,
        nneedtemplatebasedflow: (this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue.nneedtemplatebasedflow) || false,
        ndesigntemplatemappingcode: (this.props.Login.masterData.defaultDesignTemplateMappingValue && this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
        nneedsubsample: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
        userinfo: this.props.Login.userInfo,
        checkBoxOperation: checkBoxOperation.SINGLESELECT,
        fromdate : obj.fromDate,
        todate : obj.toDate,
        }
       
        const inpuParamData = {
            inputData,
            masterData,
        }
        // ALPD-4132 to Clear Additional Filter Config
        inpuParamData.masterData['kendoFilterList'] = undefined;
        this.props.getJobAllcationFilterDetail(inpuParamData)
    
    }
    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (fieldName === "ntechniquecode") {
            selectedRecord["ntechniquecode"] = comboData;
            if (comboData != null) {
                this.props.getUsers(this.state.selectedRecord.ntechniquecode.value,
                    this.props.Login.masterData, this.props.Login.userInfo, selectedRecord, this.props.Login.screenName, this.props.Login.masterData);
            } else {
                
              if(this.props.Login.operation==="Reschedule" || this.props.Login.operation==="AllotJob"){
                    let inputParam={
                       
                            nsectioncode:this.state.selectedRecord?this.state.selectedRecord["nsectioncode"]&& this.state.selectedRecord["nsectioncode"].value ||this.props.Login.masterData.realUserSectionValue.nsectioncode :-1,                            userInfo:this.props.Login.userInfo,
                            selectedRecord:this.state.selectedRecord,
                            nregtypecode:this.props.Login.masterData.realRegTypeValue.nregtypecode,
                            nregsubtypecode:this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                            masterData:this.props.Login.masterData
                        
                    }
                    this.props.getUsersSection(inputParam);

                }
                else{
                    delete selectedRecord["ntechniquecode"];
                    delete selectedRecord["nusercode"];
                    this.setState({ selectedRecord });

                }
            }
        } else if (fieldName === "nusercode") {
            selectedRecord["nusercode"] = comboData;
         //   this.props.getAnalystCalenderBasedOnUser(comboData.value, this.props.Login.masterData, this.props.Login.userInfo, selectedRecord)
            this.setState({ selectedRecord });     
        } else if (fieldName === "ninstrumentcatcode") {
            selectedRecord["ninstrumentcatcode"] = comboData;
            this.props.getInstrumentName(this.state.selectedRecord.ninstrumentcatcode.value, selectedRecord.ninstrumentcatcode.item.ncalibrationreq, this.props.Login.userInfo, selectedRecord, this.props.Login.screenName);
        } else if (fieldName === "ninstrumentnamecode") {
            selectedRecord["ninstrumentnamecode"] = comboData;
            this.props.getInstrumentId(this.state.selectedRecord.ninstrumentcatcode.value,this.state.selectedRecord.ninstrumentnamecode.value, comboData.item.ncalibrationreq, this.props.Login.userInfo, selectedRecord, this.props.Login.screenName);
        } else if (fieldName === "ninstrumentcode") {
            selectedRecord["ninstrumentcode"] = comboData;
            this.setState({ selectedRecord });
        } else if (fieldName === "nuserperiodcode") {
            selectedRecord["nuserperiodcode"] = comboData;
            this.setState({ selectedRecord });
        } else if (fieldName === "ninstrumentperiodcode") {
            selectedRecord["ninstrumentperiodcode"] = comboData;
            this.setState({ selectedRecord });
        }
        else if(fieldName==="nsectionuser"){
            selectedRecord["nsectioncode"] = comboData;
            let inputParam={
                nsectioncode:comboData.value,
                userInfo:this.props.Login.userInfo,
                selectedRecord:this.state.selectedRecord,
                nregtypecode:this.props.Login.masterData.realRegTypeValue.nregtypecode,
                nregsubtypecode:this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                masterData:this.props.Login.masterData
            }
          this.props.getUsersSection(inputParam);
        }
        else if(fieldName==="nsectioncode"){
            selectedRecord["nsectioncode"] = comboData;
            
            this.setState({ selectedRecord });

        }
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.name === "suserholdduration" || event.target.name === "sinstrumentholdduration") {
            if (event.target.value !== "") {
                event.target.value = validatePhoneNumber(event.target.value);
                selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];

            } else {
                selectedRecord[event.target.name] = event.target.value;

            }
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    };


    onNumericInputOnChange = (event, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        let constantsValue = event.target.value.replace(/[^0-9]/g, '');
        //if (!isNaN(constantsValue.substring(constantsValue.length, constantsValue.length - 1))) {
            //if (!isNaN(constantsValue)) {
            selectedRecord[name] = constantsValue;
            this.setState({ selectedRecord });
       // }
    };


    getCommentsCombo = (event) => {

        if (this.props.Login.JASelectedTest && this.props.Login.JASelectedTest.length > 0) {
            this.props.getCommentsCombo(...event);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTESTTOADDCOMMENTS" }))
        }
    }

    handleDataChange = ({ created, updated, deleteted }) => {
        let scheduleData = {};
        let postParam = undefined;
        let formRef = {};
        if (created.length > 0) {

            const aa = created.concat(created.map(item => Object.assign({}, item, {})));
            scheduleData["allotjob"] = { "jsondata": aa[0] };
            formRef = { "current": "form" };

            let saveType = 1;
            const inputParam = {
                classUrl: "joballocation",
                methodUrl: "AssignJob",
                inputData: { userinfo: this.props.Login.userInfo },
                operation: "create",
                saveType, formRef, postParam, searchRef: this.searchRef,
                isClearSearch: this.props.Login.isClearSearch
            }
            const masterData = this.props.Login.masterData;
            this.props.crudMaster(inputParam, masterData, "openModal");



        } else if (updated.length > 0) {

        } else if (deleteted.length > 0) {

        }

    }
//ALPD-3781
    onSaveSection(saveType, formRef){
        let inputParam = {};
        let joballocationData = {};
        let testList = [];
       
        let { testskip, testtake,sampleskip, sampletake} = this.state
        if (this.props.Login.masterData.searchedTest !== undefined) {
            testList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.searchedTest.slice(testskip, testskip + testtake), "ntransactiontestcode");
        } else {
            testList = this.props.Login.masterData.JA_TEST
                && this.props.Login.masterData.JA_TEST.slice(testskip, testskip + testtake);
        }
        let subSampleList=[];
        if (this.props.Login.masterData.searchedSubSample !== undefined) {
            subSampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSubSample, this.props.Login.masterData.searchedSubSample.slice(testskip, testskip + testtake), "ntransactionsamplecode");
        } else {
            subSampleList = this.props.Login.masterData.JA_SUBSAMPLE
                && this.props.Login.masterData.JA_SUBSAMPLE.slice(testskip, testskip + testtake);
        }
        let sampleList=[];
        if (this.props.Login.masterData.searchedSample !== undefined) {
            sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.searchedSample.slice(sampleskip, sampleskip + sampletake), "npreregno");
        } else {
            sampleList = this.props.Login.masterData.JA_SAMPLE
                && this.props.Login.masterData.JA_SAMPLE.slice(sampleskip, sampleskip + sampletake);
        }
        //
        let sectionList = getSameRecordFromTwoArrays(testList || [], this.props.Login.masterData.JASelectedTest, "ntransactiontestcode");
        let sampleListCount = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.JASelectedSample, "npreregno");

        joballocationData["npreregno"] = sampleListCount ? sampleListCount.map(sample => sample.npreregno).join(",") : "";
        joballocationData["ntransactionsamplecode"] = sectionList ? sectionList.map(sample => sample.ntransactionsamplecode).join(",") : "";
        joballocationData["ntransactiontestcode"] = sectionList ? sectionList.map(sample => sample.ntransactiontestcode).join(",") : "";
       
        joballocationData["nsectioncode"] = this.state.selectedRecord&&this.state.selectedRecord["nsectioncode"].value;
        joballocationData["nneedsubsample"] = (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false;
    if(!(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample)){
        joballocationData["ntansactionSubSamplecode"]=subSampleList?subSampleList.map(sample => sample.ntransactionsamplecode).join(",") : "";
    }
        joballocationData["userinfo"] = this.props.Login.userInfo;
        joballocationData["ndesigntemplatemappingcode"] = this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode;
        joballocationData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue.nregtypecode;
        joballocationData["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode;
        joballocationData["ntestcode"]=this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode === 0 ? this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.realTestValue.ntestcode) : null;
        joballocationData["masterData"] = this.props.Login.masterData;
        joballocationData["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
        joballocationData["activeTestTab"] = this.props.Login.activeTestTab || 'IDS_TESTATTACHMENTS';
        joballocationData["nsampletypecode"] = this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode;
        joballocationData["napprovalversioncode"]  =this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode;

        joballocationData["sfilterSection"] = this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode.toString() : "-1";
        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        joballocationData["fromdate"] = obj.fromDate;
        joballocationData["todate"] = obj.toDate;
        joballocationData["activeSampleTab"] = this.props.Login.activeTestTab || "IDS_SAMPLEATTACHMENTS";
        joballocationData["nregistrationsectioncode"]= this.props.Login.masterData.JASelectedSample && this.props.Login.masterData.JASelectedSample.map(item1=>item1.nregistrationsectioncode).join(",");
        joballocationData["ncontrolcode"] = this.props.Login.ncontrolcode;
        
        inputParam = {
            classUrl: "joballocation",
            methodUrl: "JobAllocation",
            displayName: this.props.Login.inputParam.displayName,
            inputData: joballocationData,
            selectedId: this.state.selectedRecord["njoballocationcode"],
            operation: "updateSection",
            saveType, formRef,
            searchRef: this.searchRef,
            postParamList: this.postParamList,
            action: "updateSection",
            selectedRecord:this.state.selectedRecord

        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_SECTION" }),
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }else{
            this.props.updateSectionJobAllocation(inputParam);

        }
    }

}



export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignforJobAllocation, ReceiveinLabStatusWise, getRegTypeJobAllocation, getRegSubTypeJobAllocation,
    getAppConfigVersionJobAllocation, getFilterStatusJobAllocation, getSectionJobAllocation, getTestStatusJobAllocation, getFilterStatusSectionJobAllocation, getDesignTemplateJobAllocation,
    getJobAllcationFilterSubmit, getJobAllocationSubSampleDetail, getJobAllocationTestDetail, getTestChildTabDetailJobAllocation, getAllottedTestWise, getAllotAnotherUserTestWise,getInstrumentName, getInstrumentId, getUsers,
    ViewAnalystCalendar, CancelTestWise, AllotJobAction, AllotAnotherUserAction, RescheduleJobAction,
    getSubSampleChildTabDetail, getSampleChildTabDetail, getCommentsCombo, getAttachmentCombo,
    filterTransactionList, AllotJobActionCalendar,getSectionTest,
    updateSectionJobAllocation,getUsersSection,getJobAllcationFilterDetail
})(injectIntl(JobAllocation))

export const currentYear = new Date().getFullYear();

export const parseAdjust = eventDate => {
    const date = new Date(eventDate);
    date.setFullYear(currentYear);
    return date;
};