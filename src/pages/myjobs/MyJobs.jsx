import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { faBolt, faCheck, faEye,  faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Col, Nav, Row, } from 'react-bootstrap';
import { ContentPanel } from '../../components/App.styles';
import { ListWrapper } from '../../components/client-group.styles';
import { ProductList } from '../testmanagement/testmaster-styled';
//import SplitPane from "react-splitter-layout";
import SplitterLayout from "react-splitter-layout";
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {
    getMyJobsubSampleDetail, getMyJobTestDetail, getMJTestChildTabDetail, performAction, updateStore, updateDecision,
    getRegType, getRegSubType,getTestStatus,getSection,  getMyJobsSample, getStatusCombo, validateEsignCredential,
    crudMaster, validateEsignforApproval, getAppConfigVersion, getAcceptTest, filterTransactionList, checkListRecord, generateCOAReport,
    getMJSampleChildTabDetail, getAttachmentCombo, viewAttachment, deleteAttachment, getCommentsCombo, previewSampleReport,
    getEnforceCommentsHistory,reportGenerate
} from '../../actions'
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
//import ApprovalResultsTab from './ApprovalResultsTab';
import { getControlMap,  showEsign, sortData, constructOptionList, getSameRecordFromTwoArrays, convertDateValuetoString, rearrangeDateFormat } from '../../components/CommonScript';
import { toast } from 'react-toastify';
import TransactionListMasterJson from '../../components/TransactionListMasterJson';
import MyJobsFilter from './MyJobsFilter'
import { designProperties, transactionStatus, RegistrationType, RegistrationSubType } from '../../components/Enumeration';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import MyJobsSampleInfoGrid from './MyJobsSampleInfoGrid';
import MyJobsSampleInfoView from './MyJobsSampleInfoView';
//import ApprovalInstrumentTab from './ApprovalInstrumentTab'
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import Esign from '../audittrail/Esign';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
//mport EditApprovalParameter from './EditApprovalParameter';
//import ApprovalHistoryTab from './ApprovalHistoryTab';
//import SampleApprovalHistory from './SampleApprovalHistory';
//import ResultChangeHistoryTab from './ResultChangeHistoryTab';
//import ApprovalTask from './ApprovalTask';
import { templateChangeHandler } from '../checklist/checklist/checklistMethods';
import TemplateForm from '../checklist/checklist/TemplateForm';
import Attachments from '../attachmentscomments/attachments/Attachments';
import { onSaveSampleAttachment, onSaveTestAttachment } from '../attachmentscomments/attachments/AttachmentFunctions';
import Comments from '../attachmentscomments/comments/Comments';
import { onSaveSampleComments, onSaveTestComments } from '../attachmentscomments/comments/CommentFunctions';
//import { Tooltip } from '@progress/kendo-react-tooltip';
import CustomPopOver from '../../components/customPopover';
import ScrollBar from 'react-perfect-scrollbar';
//import ApprovalPrintHistoryTab from './ApprovalPrintHistoryTab';
//import ApprovalHistoryTab from './ApprovalHistoryTab';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import DataGrid from '../../components/data-grid/data-grid.component';
//import ReportHistoryTab from './ReportHistoryTab';
// import ReactTooltip from 'react-tooltip';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class MyJobs extends React.Component {
    constructor(props) {
        super(props)
        this.searchSampleRef = React.createRef();
        this.searchSubSampleRef = React.createRef();
        this.searchTestRef = React.createRef();
        this.formRef = React.createRef();
        this.state = {
            sampleGridDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            resultDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'sarno' }] },
            instrumentDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'ssamplearno' }] },
            materialDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'sarno' }] },
            taskDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'sarno' }] },
           // testCommentDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'ssamplearno' }] },
            testCommentDataState: { },

            documentDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'sarno' }] },
            resultChangeDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'sarno' }] },
            sampleHistoryDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'sarno' }] },
            reportHistoryDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            historyDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'sarno' }] },
            dataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            samplePrintHistoryDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'sarno' }] },
            userRoleControlRights: [],
            controlMap: new Map(),
            masterStatus: "",
            error: "",
            oldComboData: {},
            selectedRecord: {},
            operation: "",
            screenName: undefined,
            showSample: false,
            showTest: true,
            sampleListColumns: [],
            subSampleListColumns: [],
            testListColumns: [],
            TableExpandableItem: [],
            SingleItem: [],
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
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],
            testskip: 0,
            testtake: this.props.Login.settings && this.props.Login.settings[12],
            splitChangeWidthPercentage: 22,
            subSampleSkip: 0,
            subSampleTake :5,
        }
        //this.onSecondaryPaneSizeChange = this.onSecondaryPaneSizeChange.bind(this);
    }

    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
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
    // onSecondaryPaneSizeChange = (e, val) => {
    //     this.setState({
    //         firstPane: e - val,
    //         tabPane: e - 80,
    //         childPane: this.state.parentHeight - e - 80
    //     })
    // }
    componentDidMount() {
        if (this.parentHeight) {
            const height = this.parentHeight.clientHeight;
            this.setState({
                firstPane: height - 80,
                parentHeight: height - 50
            });
        }
    }

    constructDesign(list) {

        let newList = []
        if (list.length > 0) {
            list.map((i) => {
                newList.push({ [designProperties.LABEL]: i, [designProperties.VALUE]: i })
            })
        }
        return newList;
    }

    handleSubSamplePageChange = e => {
        this.setState({ subSampleSkip: e.skip,subSampleTake: e.take });

        setTimeout(() => { this._scrollBarRef.updateScroll() })
    }
    
    showAPSampleinfo = () => {

        this.setState({ showSample: true, showTest: false })
    }

    showAPTestList() {
      
        this.setState({ showTest: true, showSample: false })
    }

    gridfillingColumn(data) {
        //  const tempArray = [];
        const temparray = data && data.map((option) => {
            return { "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode], "dataField": option[designProperties.VALUE], "width": "200px", "columnSize": "3" };
        });
        return temparray;
    }

    sampleInfoDataStateChange = (event) => {
        this.setState({
            sampleGridDataState: event.dataState
        });
    }
    verticalPaneSizeChange = (val) => {
        console.log("val", val)
        this.setState({
            initialVerticalWidth: val - 150
        })
    }

    render() {
        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
        // let obj = this.covertDatetoString(this.props.Login.masterData.realFromDate || this.props.Login.masterData.fromDate || new Date(), this.props.Login.masterData.realToDate || this.props.Login.masterData.toDate || new Date())
        let sampleSearchField = ["sarno", "dregdate", "sdecisionstatus", "ssampletypestatus", "smanuflotno", "smanufname", "smanufsitename", "sproductcatname", "sproductname", "sspecname"];
        if (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode === RegistrationSubType.ROUTINE) {
            sampleSearchField = ["sarno", "sproductname", "sproductcatname", "sregsubtypename", "sregtypename", "sspecname", "smanufname", "sstorageconditionname",
                "sclientname", "scontainertype", "sdeadline", "sdecisionstatus", "sdeviationcomments", "sdispositionname", "slotno", "sbatchno", "sourfile", "speriodname",
                "spriorityname", "sreceiveddate", "sremarks", "sreportremarks", "ssamplecondition", "ssuppliername", "stotalqty", "stransdisplaystatus"
            ]
        }
        const filterSampleParam = {
            inputListName: "MJ_SAMPLE",
            selectedObject: "MJSelectedSample",
            primaryKeyField: "npreregno",
            fetchUrl: "myjobs/getMyJobsSubSampleDetails",
            childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" }, { ref: this.searchTestRef, childFilteredListName: "searchedTests" }],
            fecthInputObject: {
                ntype: 2,
                nflag: 2,
                nsampletypecode: (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode) || -1,
                nregtypecode: (this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
                nregsubtypecode: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
                nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus !== undefined ? String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) : "-1",
                napprovalconfigcode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
                napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) : null,
                nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.realUserSectionValue.nsectioncode) : null,
                ntestcode: this.props.Login.masterData.TestValue && this.props.Login.masterData.TestValue.ntestcode,
                dfrom: obj.fromDate,
                dto: obj.toDate,
                userinfo: this.props.Login.userInfo,
                checkBoxOperation:3,
                ndesigntemplatemappingcode:this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1
            },
            masterData: this.props.Login.masterData,
            // searchFieldList: ["sarno", "dregdate", "sdecisionstatus", "ssampletypestatus", "smanuflotno", "smanufname", "smanufsitename", "sproductcatname", "sproductname", "sspecname"],
            searchFieldList: sampleSearchField,
            changeList: ["MJ_SUBSAMPLE", "MJ_TEST", "ApprovalParameter",
                "ApprovalResultChangeHistory", "ApprovalHistory", "SampleApprovalHistory", "ResultUsedInstrument",
                "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment",
                "RegistrationAttachment", "MJSelectedSample", "MJSelectedSubSample", "MJSelectedTest", "PrintHistory", "COAHistory"]
        };
        const filterSubSampleParam = {
            inputListName: "MJ_SUBSAMPLE",
            selectedObject: "MJSelectedSubSample",
            primaryKeyField: "ntransactionsamplecode",
            fetchUrl: "approval/getApprovalTest",
            childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedTests" }],
            fecthInputObject: {
                ntype: 2,
                nflag: 2,
                npreregno: this.props.Login.masterData.MJSelectedSample ? this.props.Login.masterData.MJSelectedSample.map(sample => sample.npreregno).join(",") : "-1",
                nsampletypecode: (this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue.nsampletypecode) || -1,
                nregtypecode: (this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode) || -1,
                nregsubtypecode: (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) || -1,
                nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                ntransactionstatus: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== undefined ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) : "-1",
                napprovalconfigcode: this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigcode || -1 : null,
                napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode : null,
                nsectioncode: this.props.Login.masterData.UserSectionValue ? this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.UserSectionValue.nsectioncode) : null,
                dfrom: obj.fromDate,
                dto: obj.toDate,
                userinfo: this.props.Login.userInfo,
                checkBoxOperation:3,
                ndesigntemplatemappingcode:this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1
            },
            masterData: this.props.Login.masterData,
            searchFieldList: ["sarno", "ssamplearno"],
            changeList: ["MJ_TEST", "ApprovalParameter",
                "ApprovalResultChangeHistory", "ApprovalHistory", "ResultUsedInstrument",
                "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment",
                "RegistrationAttachment", "MJSelectedSubSample", "MJSelectedTest"]
        };

        const filterTestParam = {
            inputListName: "MJ_TEST",
            selectedObject: "MJSelectedTest",
            primaryKeyField: "ntransactiontestcode",
            fetchUrl: this.getActiveTestURL(),
            fecthInputObject: {
                ntransactiontestcode: this.props.Login.masterData.MJSelectedTest ? this.props.Login.masterData.MJSelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
                userinfo: this.props.Login.userInfo,
                checkBoxOperation:3,
                ndesigntemplatemappingcode:this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1
            },
            isSingleSelect: false,
            masterData: this.props.Login.masterData,
            searchFieldList: ["sarno", "ssamplearno", "stestsynonym", "dtransactiondate", "smethodname", "ssectionname", "ssourcename", "stransdisplaystatus", "sinstrumentcatname", "stestname"],
            changeList: ["ApprovalParameter",
                "ApprovalResultChangeHistory", "ApprovalHistory", "SampleApprovalHistory", "ResultUsedInstrument",
                "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment",
                "RegistrationAttachment", "MJSelectedTest"]
        };
        
        let AP_SampleList = this.props.Login.masterData.MJ_SAMPLE ? sortData(this.props.Login.masterData.MJ_SAMPLE, 'descending', 'npreregno') : [];
        let AP_SubSampleList = this.props.Login.masterData.MJ_SUBSAMPLE ? this.props.Login.masterData.MJ_SUBSAMPLE : [];
        let AP_TestList = this.props.Login.masterData.MJ_TEST ? this.props.Login.masterData.MJ_TEST : [];
        let decisionStatus = this.props.Login.masterData.decisionStatus ? sortData(this.props.Login.masterData.decisionStatus, 'ascending', 'ntransactionstatus') : [];
       // let actionStatus = this.props.Login.masterData.actionStatus ? sortData(this.props.Login.masterData.actionStatus, 'descending', 'ntransactionstatus') : [];
        let subSampleGetParam = {
            masterData: this.props.Login.masterData,
            ntransactionstatus: String(this.props.Login.masterData.realFilterStatusValue ? this.props.Login.masterData.realFilterStatusValue.ntransactionstatus : this.props.Login.masterData.FilterStatusValue ? this.props.Login.masterData.FilterStatusValue.ntransactionstatus : -1),
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.realUserSectionValue.nsectioncode) : null,
            ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode : -1,
            napprovalversioncode : this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode : -1,
            nneedsubsample:this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
            activeTestTab: this.props.Login.activeTestTab || "IDS_RESULTS",
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
            screenName: this.props.Login.screenName,
            searchSubSampleRef: this.searchSubSampleRef,
            searchTestRef: this.searchTestRef,
            testskip: this.state.testskip,
            testtake: this.state.testtake,
            subSampleSkip: this.state.subSampleSkip,
            subSampleTake: this.state.subSampleTake,
            resultDataState: this.state.resultDataState,
            instrumentDataState: this.state.instrumentDataState,
            materialDataState: this.state.materialDataState,
            taskDataState: this.state.taskDataState,
            documentDataState: this.state.documentDataState,
            resultChangeDataState: this.state.resultChangeDataState,
            testCommentDataState: this.state.testCommentDataState,
            historyDataState: this.state.historyDataState,
            samplePrintHistoryDataState: this.state.samplePrintHistoryDataState,
            sampleHistoryDataState: this.state.sampleHistoryDataState,
            ndesigntemplatemappingcode:this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1
        };
        let testGetParam = {
            masterData: this.props.Login.masterData,
            ntransactionstatus: String(this.props.Login.masterData.realFilterStatusValue ? this.props.Login.masterData.realFilterStatusValue.ntransactionstatus : this.props.Login.masterData.FilterStatusValue ? this.props.Login.masterData.FilterStatusValue.ntransactionstatus : -1),
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            npreregno: this.props.Login.masterData.MJSelectedSample && this.props.Login.masterData.MJSelectedSample.map(sample => sample.npreregno).join(","),
            napprovalversioncode : this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode : -1,
            nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.realUserSectionValue.nsectioncode) : null,
            ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode : -1,
            dfrom: obj.fromDate,
            dto: obj.toDate,
            activeTestTab: this.props.Login.activeTestTab || "IDS_RESULTS",
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEINFO",
            screenName: this.props.Login.screenName,
            searchTestRef: this.searchTestRef,
            ndesigntemplatemappingcode:this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1
        };
        let testChildGetParam = {
            masterData: this.props.Login.masterData,
            ntransactionstatus: String(this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus),
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            npreregno: this.props.Login.masterData.MJSelectedSample && this.props.Login.masterData.MJSelectedSample.map(sample => sample.npreregno).join(","),
            ntransactionsamplecode: this.props.Login.masterData.MJSelectedSubSample && this.props.Login.masterData.MJSelectedSubSample.map(sample => sample.ntransactionsamplecode).join(","),
            activeTestTab: this.props.Login.activeTestTab || "IDS_RESULTS",
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEINFO",
            screenName: this.props.Login.screenName,
            postParamList: this.postParamList,
            testskip: this.state.testskip,
            testtake: this.state.testtake,
            resultDataState: this.state.resultDataState,
            instrumentDataState: this.state.instrumentDataState,
            materialDataState: this.state.materialDataState,
            taskDataState: this.state.taskDataState,
            documentDataState: this.state.documentDataState,
            historyDataState: this.state.historyDataState,
            resultChangeDataState: this.state.resultChangeDataState,
            testCommentDataState: this.state.testCommentDataState,
            ndesigntemplatemappingcode:this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1

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
                "label": "IDS_SAMPLETYPE",
                "value": this.props.Login.masterData.realSampleTypeValue ? this.props.Login.masterData.realSampleTypeValue.ssampletypename || "NA" :
                    this.props.Login.masterData.SampleTypeValue ? this.props.Login.masterData.SampleTypeValue.ssampletypename || "NA" : "NA"
            }, {
                "label": "IDS_REGTYPE",
                "value": this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.sregtypename || "NA" :
                    this.props.Login.masterData.RegTypeValue ? this.props.Login.masterData.RegTypeValue.sregtypename || "NA" : "NA"
            }, {
                "label": "IDS_REGSUBTYPE",
                "value": this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.sregsubtypename || "NA" :
                    this.props.Login.masterData.RegSubTypeValue ?
                        this.props.Login.masterData.RegSubTypeValue.sregsubtypename : "NA"
            }, {
                "label": "IDS_CONFIGVERSION",
                "value": this.props.Login.masterData.realApprovalVersionValue ?
                    this.props.Login.masterData.realApprovalVersionValue.sversionname || "NA" :
                    this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.sversionname || "NA" : "NA"
            },
            {
                "label": "IDS_SECTION",
                "value": this.props.Login.masterData.realUserSectionValue ?
                    this.props.Login.masterData.realUserSectionValue.ssectionname || "NA" :
                    this.props.Login.masterData.UserSectionValue ?
                        this.props.Login.masterData.UserSectionValue.ssectionname || "NA" : "NA"
            },
            {
                "label": "IDS_Test",
                "value": this.props.Login.masterData.realTestValue ?
                    this.props.Login.masterData.realTestValue.stestsynonym || "NA" :
                    this.props.Login.masterData.TestValue ?
                        this.props.Login.masterData.TestValue.stestsynonym || "NA" : "NA"
            },
            {
                "label": "IDS_FILTERSTATUS",
                "value": this.props.Login.masterData.realFilterStatusValue ?
                    this.props.Login.masterData.realFilterStatusValue.sfilterstatus || "NA" :
                    this.props.Login.masterData.FilterStatusValue ?
                        this.props.Login.masterData.FilterStatusValue.sfilterstatus || "NA" : "NA"
            }
        ];
        
        const reportPreviewId = this.state.controlMap.has("SamplePreviewReport") && this.state.controlMap.get("SamplePreviewReport").ncontrolcode;
        const editParamId = this.state.controlMap.has("Accept") && this.state.controlMap.get("Accept").ncontrolcode;
        const TestDecisionActionId = this.state.controlMap.has("TestDecisionAction") && this.state.controlMap.get("TestDecisionAction").ncontrolcode;
        const TestApprovalActionId = this.state.controlMap.has("TestApprovalAction") && this.state.controlMap.get("TestApprovalAction").ncontrolcode;
        const reportGenerateId = this.state.controlMap.has("GenerateCOA") && this.state.controlMap.get("GenerateCOA").ncontrolcode;
        const coaReportId = this.state.controlMap.has("COAReport") && this.state.controlMap.get("COAReport").ncontrolcode;


        this.postParamList = [
            {
                filteredListName: "searchedSample",
                clearFilter: "no",
                searchRef: this.searchSampleRef,
                primaryKeyField: "npreregno",
                fetchUrl: "myjobs/getMyJobsSubSampleDetails",
                fecthInputObject: subSampleGetParam,
                selectedObject: "MJSelectedSample",
                inputListName: "MJ_SAMPLE",
                updatedListname: "updatedSample",
                childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" }, { ref: this.searchTestRef, childFilteredListName: "searchedTests" }],
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus",
                    "SampletypeList", "RegistrationTypeList", "RegistrationSubTypeList", "FilterStatusList", "UserSectionList"]
            }, {
                filteredListName: "searchedSubSample",
                updatedListname: "updatedSubSample",
                clearFilter: "no",
                searchRef: this.searchSubSampleRef,
                primaryKeyField: "ntransactionsamplecode",
                fetchUrl: "myjobs/getApprovalTest",
                fecthInputObject: testGetParam,
                selectedObject: "MJSelectedSubSample",
                childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedTests" }],
                inputListName: "MJ_SUBSAMPLE",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus",
                    "SampletypeList", "RegistrationTypeList", "RegistrationSubTypeList", "FilterStatusList", "UserSectionList"]
            }, {
                filteredListName: "searchedTests",
                clearFilter: "no",
                searchRef: this.searchTestRef,
                primaryKeyField: "ntransactiontestcode",
                fetchUrl: this.getActiveTestURL(),
                fecthInputObject: testChildGetParam,
                selectedObject: "MJSelectedTest",
                inputListName: "MJ_TEST",
                updatedListname: "updatedTest",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus",
                    "SampletypeList", "RegistrationTypeList", "RegistrationSubTypeList", "FilterStatusList", "UserSectionList", "TestList"]
            }]


        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                    <Row noGutters={"true"}>
                        <Col md={12} className='parent-port-height sticky_head_parent' ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            <ListWrapper>
                                <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={this.state.splitChangeWidthPercentage} onSecondaryPaneSizeChange={this.paneSizeChange} primaryMinSize={40} secondaryMinSize={20}>
                                    <TransactionListMasterJson
                                        splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                        needMultiSelect={true}
                                        masterList={this.props.Login.masterData.searchedSample || AP_SampleList}
                                        selectedMaster={this.props.Login.masterData.MJSelectedSample}
                                        primaryKeyField="npreregno"
                                        getMasterDetail={this.props.getMyJobsubSampleDetail}
                                        inputParam={subSampleGetParam}
                                        additionalParam={['napprovalversioncode']}
                                        mainField={'sarno'}
                                        selectionList={this.state.selectedFilter}
                                        selectionField="ntransactionstatus"
                                        selectionFieldName="sfilterstatus"
                                        selectionColorField="stranscolor"
                                        selectedListName="MJSelectedSample"
                                        objectName="sample"
                                        listName="IDS_SAMPLE"
                                        filterColumnData={this.props.filterTransactionList}
                                        searchListName="searchedSample"
                                        needValidation={true}
                                        validationKey="napprovalversioncode"
                                        validationFailMsg="IDS_SELECTSAMPLESOFSAMPLEAPPROVALVERSION"
                                        showFilter={this.props.Login.showFilter}
                                        openFilter={this.openFilter}
                                        closeFilter={this.closeFilter}
                                        onFilterSubmit={this.onFilterSubmit}
                                        subFields={this.state.DynamicSampleColumns}
                                        moreField={this.state.sampleMoreField}
                                        jsonDesignFields={true}
                                        jsonField={'jsondata'}
                                        showStatusLink={true}
                                        statusFieldName="stransdisplaystatus"
                                        statusField="ntransactionstatus"
                                        //statusColor="sdecisioncolor"
                                        statusColor="stranscolor"
                                        showStatusIcon={false}
                                        showStatusName={true}
                                        needFilter={true}
                                        searchRef={this.searchSampleRef}
                                        filterParam={filterSampleParam}
                                        skip={this.state.skip}
                                        take={this.state.take}
                                        handlePageChange={this.handlePageChange}
                                        showStatusBlink={true}
                                        splitModeClass={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50 ? 'split-mode' : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}
                                        childTabsKey={["MJ_SUBSAMPLE", "MJ_TEST",  "RegistrationAttachment", "RegistrationComment"]}
                                        actionIcons={
                                            [
                                                this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL ?
                                                    {
                                                        title: "Report",
                                                        controlname: "reports",
                                                        objectName: "sample",
                                                        hidden: this.state.userRoleControlRights.indexOf(reportPreviewId) === -1,
                                                        // onClick: ()=>this.previewSampleReport(reportPreviewId),
                                                        //inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }
                                                        onClick: this.props.previewSampleReport,
                                                        inputData: {
                                                            userinfo: this.props.Login.userInfo,
                                                            ncontrolcode: reportPreviewId
                                                        },
                                                    } :
                                                    this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode === RegistrationSubType.ROUTINE ?
                                                        {
                                                            title: "Report",
                                                            controlname: "reports",
                                                            objectName: "sample",
                                                            hidden: this.state.userRoleControlRights.indexOf(reportGenerateId) === -1,
                                                            // onClick: ()=>this.previewSampleReport(reportPreviewId),
                                                            //inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }
                                                            onClick: (obj) => this.generateCOAReport(obj, reportGenerateId),
                                                            inputData: {
                                                                userinfo: this.props.Login.userInfo,
                                                                ncontrolcode: reportPreviewId,
                                                                nregtypecode: this.props.Login.masterData.realRegTypeValue.nregtypecode,
                                                                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                                                            },
                                                        }
                                                        : {
                                                            title: "Report",
                                                            controlname: "reports",
                                                            objectName: "sample",
                                                            hidden: this.state.userRoleControlRights.indexOf(coaReportId) === -1,
                                                            onClick: (obj) => this.props.reportGenerate(obj, reportGenerateId),
                                                            inputData: {
                                                                userinfo: this.props.Login.userInfo,
                                                                ncontrolcode: coaReportId,
                                                               
                                                            },

                                                        }
                                            ]
                                        }

                                        commonActions={
                                            <>
                                                <ProductList className="d-flex product-category float-right">
                                                    {/* <ReactTooltip place="bottom" /> */}
                                                    {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                    <Button className="btn btn-circle outline-grey ml-2" variant="link"
                                                        onClick={() => this.onReload()}
                                                        // title={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                      //  data-for="tooltip-common-wrap"
                                                        data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                        <FontAwesomeIcon icon={faSync} style={{ "width": "0.6!important" }} />
                                                    </Button>
                                                    {/* </Tooltip> */}
                                                    {this.props.Login.masterData.decisionStatus &&
                                                        this.state.userRoleControlRights.indexOf(TestDecisionActionId) !== -1 &&
                                                        this.props.Login.masterData.decisionStatus.length > 0 ?
                                                        <CustomPopOver
                                                            icon={faBolt}
                                                            nav={true}
                                                            data={decisionStatus}
                                                            btnClasses="btn-circle btn_grey ml-2"
                                                            textKey="sdecisionstatus"
                                                            iconKey="ntransactionstatus"
                                                            dynamicButton={(value) => this.updateDecision(value)}
                                                        >
                                                        </CustomPopOver>

                                                        : ""}
                                                </ProductList>
                                            </>
                                        }
                                        filterComponent={[
                                            {
                                                "Sample Filter": <MyJobsFilter
                                                    SampleType={this.state.SampletypeList || []}
                                                    SampleTypeValue={this.props.Login.masterData.realSampleTypeValue || []}
                                                    RegType={this.state.RegistrationTypeList || []}
                                                    RegTypeValue={this.props.Login.masterData.realRegTypeValue || []}
                                                    RegSubType={this.state.RegistrationSubTypeList || []}
                                                    RegSubTypeValue={this.props.Login.masterData.realRegSubTypeValue || []}
                                                    ApprovalVersion={this.state.ConfigVersionList || []}
                                                    ApprovalVersionValue={this.props.Login.masterData.realApprovalVersionValue || []}
                                                    UserSection={this.state.UserSectionList || []}
                                                    UserSectionValue={this.props.Login.masterData.realUserSectionValue || []}
                                                    JobStatus={this.props.Login.masterData.JobStatus || []}
                                                    Test={this.state.TestList || []}
                                                    TestValue={this.props.Login.masterData.realTestValue || []}
                                                    FilterStatus={this.state.FilterStatusList || []}
                                                    FilterStatusValue={this.props.Login.masterData.realFilterStatusValue || []}
                                                    fromDate={this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()}
                                                    toDate={this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()}
                                                    onFilterComboChange={this.onFilterComboChange}
                                                    handleDateChange={this.handleDateChange}
                                                    userInfo={this.props.Login.userInfo}
                                                    
                                                />
                                            }
                                        ]}

                                    />
                                   {this.props.Login.masterData.nneedsubsample ?
                                    <ScrollBar ref={(ref) => { this._scrollBarRef = ref; }}>
                                    <SplitterLayout
                                        customClassName="detailed-inner"
                                        vertical
                                        borderColor="#999"
                                        primaryIndex={1}
                                        onSecondaryPaneSizeChange={this.verticalPaneSizeChange}
                                        secondaryInitialSize={400}
                                    >
                                        <div>
                                            <div style={this.state.showTest === true ? { display: "block", background: "#FFFF" } : { display: "none", background: "#FFFF" }} >
                                                <SplitterLayout borderColor="#999"
                                                    primaryIndex={1} percentage={true}
                                                    secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                                    onSecondaryPaneSizeChange={this.paneSizeChange}
                                                    primaryMinSize={40}
                                                    secondaryMinSize={30}
                                                >
                                                    <Card>
                                                        <Card.Header style={{ borderBottom: "0px" }}>
                                                            <span style={{ display: "inline-block", marginTop: "1%" }}>
                                                                <h4 className="card-title">Sub Sample</h4>
                                                            </span>
                                                        </Card.Header>
                                                        <Card.Body className='p-0'>
                                                            <TransactionListMasterJson
                                                                paneHeight={this.state.initialVerticalWidth}
                                                                masterList={this.props.Login.masterData.searchedSubSample || AP_SubSampleList}
                                                                selectedMaster={this.props.Login.masterData.MJSelectedSubSample}
                                                                primaryKeyField="ntransactionsamplecode"
                                                                getMasterDetail={this.props.getMyJobTestDetail}
                                                                inputParam={testGetParam}
                                                                additionalParam={[]}
                                                                mainField="ssamplearno"
                                                                selectedListName="MJSelectedSubSample"
                                                                objectName="subSample"
                                                                listName="IDS_SUBSAMPLE"
                                                                jsonField={'jsondata'}
                                                                jsonDesignFields={true}
                                                                showStatusLink={true}
                                                                showStatusName={true}
                                                                statusFieldName="stransdisplaystatus"
                                                                statusField="ntransactionstatus"
                                                                selectionField="ntransactionstatus"
                                                                selectionFieldName="stransdisplaystatus"
                                                                selectionColorField="stranscolor"
                                                                statusColor="stranscolor"
                                                                subFields={this.state.DynamicSubSampleColumns}
                                                                moreField={this.state.subSampleMoreField}
                                                                needValidation={false}
                                                                needMultiSelect={true}
                                                                needFilter={false}
                                                                searchRef={this.searchSubSampleRef}
                                                                filterParam={filterSubSampleParam}
                                                                filterColumnData={this.props.filterTransactionList}
                                                                searchListName="searchedSubSample"
                                                                skip={this.state.subSampleSkip}
                                                                take={this.state.subSampleTake}
                                                                handlePageChange={this.handleSubSamplePageChange}
                                                                childTabsKey={["RegistrationTestAttachment"]}
                                                            />
                                                        </Card.Body>
                                                    </Card>
                                                    <ContentPanel>
                                                        <Card>
                                                            <Card.Header style={{ borderBottom: "0px" }}>
                                                                <span style={{ display: "inline-block" }}>
                                                                    <h4 className="card-title">{this.props.intl.formatMessage({ id: "IDS_TEST" })}</h4>
                                                                </span>
                                                                <button className="btn btn-primary btn-padd-custom" style={{ float: "right" }}
                                                                    onClick={() => this.showAPSampleinfo()}
                                                                >
                                                                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>{"  "}
                                                                    {this.props.intl.formatMessage({ id: "IDS_SAMPLE" })}
                                                                </button>
                                                            </Card.Header>
                                                            <Card.Body className='p-0'>

                                                                <TransactionListMasterJson
                                                                    paneHeight={this.state.initialVerticalWidth}
                                                                    needMultiSelect={true}
                                                                    masterList={this.props.Login.masterData.searchedTests || AP_TestList}
                                                                    selectedMaster={this.props.Login.masterData.MJSelectedTest}
                                                                    primaryKeyField="ntransactiontestcode"
                                                                    getMasterDetail={this.props.getMJTestChildTabDetail}
                                                                    inputParam={testChildGetParam}
                                                                    additionalParam={[]}
                                                                    mainField={'stestsynonym'}
                                                                    selectedListName="MJSelectedTest"
                                                                    objectName="test"
                                                                    listName="IDS_TEST"
                                                                    pageSize={this.props.Login.settings && this.props.Login.settings[13].split(",").map(setting => parseInt(setting))}
                                                                    showStatusLink={true}
                                                                    statusFieldName="stransdisplaystatus"
                                                                    statusField="ntransactionstatus"
                                                                    showStatusIcon={false}
                                                                    showStatusName={true}
                                                                    subFieldsLabel={true}
                                                                    jsonField={'jsondata'}
                                                                    jsonDesignFields={false}
                                                                    selectionField="ntransactionstatus"
                                                                    selectionFieldName="sfilterstatus"
                                                                    selectionColorField="scolorhexcode"
                                                                    selectionList={this.props.Login.masterData.FilterStatus || []}
                                                                    needSubFieldlabel={true}
                                                                    subFields={this.state.DynamicTestColumns}
                                                                    moreField={this.state.testMoreField}
                                                                    needValidation={false}
                                                                    needFilter={false}
                                                                    filterColumnData={this.props.filterTransactionList}
                                                                    searchListName="searchedTests"
                                                                    searchRef={this.searchTestRef}
                                                                    filterParam={filterTestParam}
                                                                    skip={this.state.testskip}
                                                                    take={this.state.testtake}
                                                                    showMoreResetList={true}
                                                                    showMoreResetListName="MJ_SAMPLE"
                                                                    handlePageChange={this.handleTestPageChange}
                                                                    buttonCount={5}
                                                                    childTabsKey={
                                                                        [ "RegistrationTestAttachment", "RegistrationTestComment"
                                                                        ]
                                                                    }
                                                                    commonActions={

                                                                        <ProductList className="d-flex product-category justify-content-end icon-group-wrap">
                                                                          

                                                                            <Nav.Link 
                                                                               // data-for="tooltip-common-wrap" 
                                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_ACCEPT" })} 
                                                                                hidden={this.state.userRoleControlRights.indexOf(editParamId) === -1} 
                                                                                className="btn btn-circle outline-grey ml-2" role="button"
                                                                                onClick={() => this.props.getAcceptTest({testGetParam, MJSelectedTest: this.props.Login.masterData.MJSelectedTest,userInfo: this.props.Login.userInfo, ncontrolcode:editParamId})}>
                                                                                <FontAwesomeIcon icon={faCheck} />
                                                                            </Nav.Link>

                                                                            
                                                                        </ProductList>
                                                                    }
                                                                />
                                                            </Card.Body>
                                                        </Card>
                                                    </ContentPanel>
                                                </SplitterLayout>
                                            </div>
                                            <ContentPanel style={this.state.showSample === true ? { display: "block" } : { display: "none" }}>
                                                <Card className="border-0">
                                                    <Card.Body className='p-0'>
                                                        <Row>
                                                            <Col md={12}>
                                                                <Card className='p-0'>
                                                                    <Card.Header style={{ borderBottom: "0px" }}>
                                                                        <span style={{ display: "inline-block", marginTop: "1%" }} >
                                                                            <h4 >{this.props.intl.formatMessage({ id: "IDS_SAMPLE" })}</h4>
                                                                        </span>
                                                                        <button className="btn btn-primary btn-padd-custom" style={{ float: "right" }}
                                                                            onClick={() => this.showAPTestList()}
                                                                        >
                                                                            <FontAwesomeIcon icon={faEye}></FontAwesomeIcon> { }
                                                                            {this.props.intl.formatMessage({ id: "IDS_TEST" })}
                                                                        </button>
                                                                    </Card.Header>
                                                                    <Card.Body>
                                                                        <ScrollBar>
                                                                            <div style={{ height: this.state.initialVerticalWidth }}>
                                                                                {this.props.Login.masterData.MJSelectedSample && this.props.Login.masterData.MJSelectedSample.length === 1 ?
                                                                                    <MyJobsSampleInfoView
                                                                                        data={(this.props.Login.masterData.MJSelectedSample && this.props.Login.masterData.MJSelectedSample.length > 0) ?
                                                                                            this.props.Login.masterData.MJSelectedSample[this.props.Login.masterData.MJSelectedSample.length - 1] : {}}
                                                                                        SingleItem={this.props.Login.masterData.MJSelectedSample && this.props.Login.masterData.MJSelectedSample ?
                                                                                            this.state.SingleItem : []}
                                                                                        screenName="IDS_SAMPLEINFO"
                                                                                        userInfo = {this.props.Login.userInfo}

                                                                                    />

                                                                                    :
                                                                                    <MyJobsSampleInfoGrid
                                                                                        selectedSample={this.props.Login.masterData.MJSelectedSample}
                                                                                        userInfo={this.props.Login.userInfo || {}}
                                                                                        masterData={this.props.Login.masterData}
                                                                                        inputParam={this.props.Login.inputParam}
                                                                                        dataState={this.state.sampleGridDataState}
                                                                                        dataStateChange={this.sampleInfoDataStateChange}
                                                                                        extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem)||[]}
                                                                                        detailedFieldList={this.gridfillingColumn(this.state.DynamicGridMoreField)||[]}
                                                                                        primaryKeyField={"npreregno"}
                                                                                        expandField="expanded"
                                                                                        screenName="IDS_SAMPLEINFO"
                                                                                        jsonField={"jsondata"}
                                                                                    />
                                                                                }
                                                                            </div>
                                                                        </ScrollBar>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            </ContentPanel>
                                        </div>
                                        <div>
                                            <ScrollBar>
                                                <div style={{ height: "calc(110vh - " + (+this.state.initialVerticalWidth + 100) + "px)" }}>
                                                    {this.state.showSample ?
                                                      <Card>
                                                        <Card.Header style={{ borderBottom: "0px" }}>
                                                            <span style={{ display: "inline-block", marginTop: "1%" }}>
                                                                <h4 className="card-title">Sample</h4>
                                                            </span>
                                                        </Card.Header>
                                                        <CustomTabs paneHeight={this.state.tabPane} activeKey={this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS"}
                                                            tabDetail={this.sampleTabDetail()} onTabChange={this.onSampleTabChange} /> :

                                                      </Card>
                                                    :""}
                                                       
                                                     {this.state.showTest ?
                                                        <Card>
                                                           <Card.Header style={{ borderBottom: "0px" }}>
                                                                <span style={{ display: "inline-block", marginTop: "1%" }}>
                                                                    <h4 className="card-title">Test</h4>
                                                                </span>
                                                            </Card.Header>
                                                            <CustomTabs paneHeight={this.state.tabPane} activeKey={this.props.Login.activeTestTab || "IDS_RESULTS"}
                                                                    tabDetail={this.testTabDetail()} onTabChange={this.onTestTabChange} />
                                                        </Card>
                                                      : ""}
                                                </div>
                                            </ScrollBar>
                                        </div>
                                    </SplitterLayout>
                                 
                                </ScrollBar>
                                   :

                                    <ScrollBar ref={(ref) => { this._scrollBarRef = ref; }}>
                                        <SplitterLayout
                                            customClassName="detailed-inner"
                                            vertical
                                            borderColor="#999"
                                            primaryIndex={1}
                                            onSecondaryPaneSizeChange={this.verticalPaneSizeChange}
                                            secondaryInitialSize={400}
                                        >
                                            <div>
                                                <div style={this.state.showTest === true ? { display: "block", background: "#FFFF" } : { display: "none", background: "#FFFF" }} >
                                                    <SplitterLayout borderColor="#999"
                                                        primaryIndex={1} percentage={true}
                                                        secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                                        onSecondaryPaneSizeChange={this.paneSizeChange}
                                                        primaryMinSize={40}
                                                        secondaryMinSize={30}
                                                    >
                                                        
                                                        <ContentPanel>
                                                            <Card>
                                                                <Card.Header style={{ borderBottom: "0px" }}>
                                                                    <span style={{ display: "inline-block" }}>
                                                                        <h4 className="card-title">{this.props.intl.formatMessage({ id: "IDS_TEST" })}</h4>
                                                                    </span>
                                                                    <button className="btn btn-primary btn-padd-custom" style={{ float: "right" }}
                                                                        onClick={() => this.showAPSampleinfo()}
                                                                    >
                                                                        <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>{"  "}
                                                                        {this.props.intl.formatMessage({ id: "IDS_SAMPLE" })}
                                                                    </button>
                                                                </Card.Header>
                                                                <Card.Body className='p-0'>

                                                                    <TransactionListMasterJson
                                                                        paneHeight={this.state.initialVerticalWidth}
                                                                        needMultiSelect={true}
                                                                        masterList={this.props.Login.masterData.searchedTests || AP_TestList}
                                                                        selectedMaster={this.props.Login.masterData.MJSelectedTest}
                                                                        primaryKeyField="ntransactiontestcode"
                                                                        getMasterDetail={this.props.getMJTestChildTabDetail}
                                                                        inputParam={testChildGetParam}
                                                                        additionalParam={[]}
                                                                        mainField={'stestsynonym'}
                                                                        selectedListName="MJSelectedTest"
                                                                        objectName="test"
                                                                        listName="IDS_TEST"
                                                                        pageSize={this.props.Login.settings && this.props.Login.settings[13].split(",").map(setting => parseInt(setting))}
                                                                        showStatusLink={true}
                                                                        statusFieldName="stransdisplaystatus"
                                                                        statusField="ntransactionstatus"
                                                                        showStatusIcon={false}
                                                                        showStatusName={true}
                                                                        subFieldsLabel={true}
                                                                        jsonField={'jsondata'}
                                                                        jsonDesignFields={false}
                                                                        selectionField="ntransactionstatus"
                                                                        selectionFieldName="sfilterstatus"
                                                                        selectionColorField="scolorhexcode"
                                                                        selectionList={this.props.Login.masterData.FilterStatus || []}
                                                                        needSubFieldlabel={true}
                                                                        subFields={this.state.DynamicTestColumns}
                                                                        moreField={this.state.testMoreField}
                                                                        needValidation={false}
                                                                        needFilter={false}
                                                                        filterColumnData={this.props.filterTransactionList}
                                                                        searchListName="searchedTests"
                                                                        searchRef={this.searchTestRef}
                                                                        filterParam={filterTestParam}
                                                                        skip={this.state.testskip}
                                                                        take={this.state.testtake}
                                                                        showMoreResetList={true}
                                                                        showMoreResetListName="MJ_SAMPLE"
                                                                        handlePageChange={this.handleTestPageChange}
                                                                        buttonCount={5}
                                                                        childTabsKey={
                                                                            [ "RegistrationTestAttachment", "RegistrationTestComment"
                                                                            ]
                                                                        }
                                                                        commonActions={

                                                                            <ProductList className="d-flex product-category justify-content-end icon-group-wrap">
                                                                              

                                                                                <Nav.Link 
                                                                                 //   data-for="tooltip-common-wrap" 
                                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_ACCEPT" })} 
                                                                                    hidden={this.state.userRoleControlRights.indexOf(editParamId) === -1} 
                                                                                    className="btn btn-circle outline-grey ml-2" role="button"
                                                                                    onClick={() => this.props.getAcceptTest({testGetParam, MJSelectedTest: this.props.Login.masterData.MJSelectedTest,userInfo: this.props.Login.userInfo, ncontrolcode:editParamId})}>
                                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                                </Nav.Link>

                                                                                
                                                                            </ProductList>
                                                                        }
                                                                    />
                                                                </Card.Body>
                                                            </Card>
                                                        </ContentPanel>
                                                    </SplitterLayout>
                                                </div>
                                                <ContentPanel style={this.state.showSample === true ? { display: "block" } : { display: "none" }}>
                                                    <Card className="border-0">
                                                        <Card.Body className='p-0'>
                                                            <Row>
                                                                <Col md={12}>
                                                                    <Card className='p-0'>
                                                                        <Card.Header style={{ borderBottom: "0px" }}>
                                                                            <span style={{ display: "inline-block", marginTop: "1%" }} >
                                                                                <h4 >{this.props.intl.formatMessage({ id: "IDS_SAMPLE" })}</h4>
                                                                            </span>
                                                                            <button className="btn btn-primary btn-padd-custom" style={{ float: "right" }}
                                                                                onClick={() => this.showAPTestList()}
                                                                            >
                                                                                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon> { }
                                                                                {this.props.intl.formatMessage({ id: "IDS_TEST" })}
                                                                            </button>
                                                                        </Card.Header>
                                                                        <Card.Body>
                                                                            <ScrollBar>
                                                                                <div style={{ height: this.state.initialVerticalWidth }}>
                                                                                    {this.props.Login.masterData.MJSelectedSample && this.props.Login.masterData.MJSelectedSample.length === 1 ?
                                                                                        <MyJobsSampleInfoView
                                                                                            data={(this.props.Login.masterData.MJSelectedSample && this.props.Login.masterData.MJSelectedSample.length > 0) ?
                                                                                                this.props.Login.masterData.MJSelectedSample[this.props.Login.masterData.MJSelectedSample.length - 1] : {}}
                                                                                            SingleItem={this.props.Login.masterData.MJSelectedSample && this.props.Login.masterData.MJSelectedSample ?
                                                                                                this.state.SingleItem : []}
                                                                                            screenName="IDS_SAMPLEINFO"
                                                                                            userInfo = {this.props.Login.userInfo}

                                                                                        />

                                                                                        :
                                                                                        <MyJobsSampleInfoGrid
                                                                                            selectedSample={this.props.Login.masterData.MJSelectedSample}
                                                                                            userInfo={this.props.Login.userInfo || {}}
                                                                                            masterData={this.props.Login.masterData}
                                                                                            inputParam={this.props.Login.inputParam}
                                                                                            dataState={this.state.sampleGridDataState}
                                                                                            dataStateChange={this.sampleInfoDataStateChange}
                                                                                            extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem)||[]}
                                                                                            detailedFieldList={this.gridfillingColumn(this.state.DynamicGridMoreField)||[]}
                                                                                            primaryKeyField={"npreregno"}
                                                                                            expandField="expanded"
                                                                                            screenName="IDS_SAMPLEINFO"
                                                                                            jsonField={"jsondata"}
                                                                                        />
                                                                                    }
                                                                                </div>
                                                                            </ScrollBar>
                                                                        </Card.Body>
                                                                    </Card>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </ContentPanel>
                                            </div>
                                            <div>
                                                <ScrollBar>
                                                    <div style={{ height: "calc(110vh - " + (+this.state.initialVerticalWidth + 100) + "px)" }}>
                                                        {this.state.showSample ?
                                                            <Card>
                                                                <Card.Header>
                                                                <span style={{ display: "inline-block", marginTop: "1%" }}>
                                                                            <h4 className="card-title">Sample</h4>
                                                                        </span>
                                                                </Card.Header>
                                                                <CustomTabs paneHeight={this.state.tabPane} activeKey={this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS"}
                                                                tabDetail={this.sampleTabDetail()} onTabChange={this.onSampleTabChange} /> :

                                                            </Card>
                                                            : ""}
                                                            {this.state.showTest ?
                                                                <Card>
                                                                      <Card.Header style={{ borderBottom: "0px" }}>
                                                                        <span style={{ display: "inline-block", marginTop: "1%" }}>
                                                                            <h4 className="card-title">Test</h4>
                                                                        </span>
                                                                    </Card.Header>
                                                                    
                                                                    <CustomTabs paneHeight={this.state.tabPane} activeKey={this.props.Login.activeTestTab || "IDS_RESULTS"}
                                                                        tabDetail={this.testTabDetail()} onTabChange={this.onTestTabChange} />
                                                                </Card>
                                                                : ""}
                                                    </div>
                                                </ScrollBar>
                                            </div>
                                        </SplitterLayout>
                                     
                                    </ScrollBar>
                                   } 

                                </SplitterLayout>
                            </ListWrapper >
                        </Col>
                    </Row>
                </ListWrapper>
                {this.props.Login.openChildModal ?
                    <SlideOutModal
                        onSaveClick={this.props.Login.operation === 'dynamic' ? () => this.performTestActions(this.props.Login.action, TestApprovalActionId) : this.onSaveClick}
                        operation={this.props.Login.operation}
                        screenName={this.props.Login.screenName}
                        closeModal={this.handleClose}
                        show={this.props.Login.openChildModal}
                        inputParam={this.props.Login.inputParam}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.operation === 'enforce' ? [{ "idsName": "IDS_COMMENTS", "dataField": "senforcestatuscomment", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }] : []}
                        loginoperation={this.props.Login.operation === 'view' ? true : false}
                        //graphView={this.props.Login.operation !=='enforce' ? this.props.Login.operation:undefined}
                        noSave={this.props.Login.operation === 'view' ? true : false}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            this.props.Login.operation === 'enforce' ?
                                <Row>
                                    <Col md={12}>
                                        <FormSelectSearch
                                            name={"ngradecode"}
                                            formLabel={this.props.intl.formatMessage({ id: "IDS_STATUS" })}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_STATUS" })}
                                            value={this.props.Login.masterData.GradeValue || []}
                                            options={this.props.Login.masterData.Grade || []}
                                            optionId="ngradecode"
                                            optionValue="sgradename"
                                            isMandatory={true}
                                            isMulti={false}
                                            isDisabled={false}
                                            isSearchable={false}
                                            closeMenuOnSelect={true}
                                            isClearable={false}
                                            onChange={(event) => this.onComboChange(event, 'ngradecode')}
                                        />
                                        <FormTextarea
                                            name="senforcestatuscomment"
                                            label={this.props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                                            value={this.state.selectedRecord ? this.state.selectedRecord["senforcestatuscomment"] : ""}
                                            rows="2"
                                            isMandatory={true}
                                            required={false}
                                            maxLength={255}
                                            onChange={(event) => this.onInputOnChange(event)}
                                        />
                                    </Col>
                                </Row> :
                                this.props.Login.operation === 'dynamic' ?
                                    <Row>
                                        <Col md="12">
                                            {/* <FormNumericInput
                                            name={"retestcount"}
                                            label={this.props.intl.formatMessage({ id: "IDS_RETESTCOUNT" })}
                                            type="number"
                                            onChange={(event) => this.onInputOnChange(event)}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_FILENAME" })}
                                            value={this.state.selectedRecord?this.state.selectedRecord.retestcount:""}
                                            isMandatory="*" 
                                            required={true}
                                            min={1}
                                            max={10}
                                        /> */}
                                            <FormNumericInput
                                                name="retestcount"
                                                label={this.props.intl.formatMessage({ id: "IDS_RETESTCOUNT" })}
                                                placeholder={this.props.intl.formatMessage({ id: "IDS_MAX" }) + ": " + this.props.Login.masterData.retestcount}
                                                type="text"
                                                strict={true}
                                                className="form-control"
                                                value={this.state.selectedRecord ? this.state.selectedRecord.retestcount : ""}
                                                maxLength={6}
                                                onChange={(event) => this.onNumericInputOnChange(event, 'retestcount')}
                                                isMandatory="*"
                                                required={true}
                                                noStyle={true}
                                            // min={1}
                                            // max={this.props.Login.masterData.retestcount}
                                            />
                                        </Col>
                                    </Row> :
                                    this.props.Login.operation === 'view' ?
                                        <Row>
                                            <Col md={12}>
                                                <DataGrid
                                                    primaryKeyField={"nresultparamcommenthistorycode"}
                                                    data={this.props.Login.masterData.enforceCommentsHistory || []}
                                                    dataResult={this.props.Login.masterData.enforceCommentsHistory || []}
                                                    dataState={{ skip: 0, take: this.props.Login.masterData.enforceCommentsHistory ? this.props.Login.masterData.enforceCommentsHistory.length : 0 }}
                                                    // dataStateChange={this.dataStateChange}
                                                    extractedColumnList={
                                                        [
                                                            { "idsName": "IDS_ENFORCESTATUSCOMMENT", "dataField": "senforcestatuscomment", "width": "450px" }
                                                        ]
                                                    }
                                                    userInfo={this.props.Login.userInfo}
                                                    controlMap={this.state.controlMap}
                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                    inputParam={this.props.Login.inputParam}
                                                    pageable={false}
                                                    hideColumnFilter={true}
                                                    isActionRequired={false}
                                                    isToolBarRequired={false}
                                                    scrollable={"scrollable"}
                                                />
                                            </Col>
                                        </Row>
                                        : ""
                                        // <EditApprovalParameter
                                        //     ApprovalParamEdit={this.props.Login.ApprovalParamEdit || []}
                                        //     changeMandatory={this.changeMandatory}
                                        //     selectedRecord={this.state.selectedRecord.approvalParameterEdit || {}}
                                        //     nsubsampleneed={this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nsubsampleneed}
                                        // />
                        }
                    />
                    : ""}
                {this.props.Login.masterData.ChecklistData && this.props.Login.screenName === 'IDS_CHECKLISTRESULT' ?
                    <TemplateForm
                        templateData={this.props.Login.masterData.ChecklistData}
                        needSaveButton={false}
                        formRef={this.formRef}
                        onTemplateInputChange={this.onTemplateInputChange}
                        handleClose={this.handleClose}
                        onTemplateComboChange={this.onTemplateComboChange}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.props.onSaveCheckList}
                        Login={this.props.Login}
                        viewScreen={this.props.Login.openTemplateModal}
                        selectedRecord={this.state.selectedRecord || []}
                        onTemplateDateChange={this.onTemplateDateChange}
                    />
                    : ""}
            </>
        )
    }

    componentDidUpdate(previousProps) {
        let { userRoleControlRights, controlMap,
            sampleListColumns, subSampleListColumns, testListColumns, SingleItem,
            sampleListMainField, subSampleListMainField, testListMainField,
            SampleGridItem, SampleGridExpandableItem, testMoreField,
            resultDataState, instrumentDataState,
            materialDataState, taskDataState,
            documentDataState, resultChangeDataState,
            historyDataState, testCommentDataState,
            samplePrintHistoryDataState, sampleHistoryDataState,
            selectedRecord, SampletypeList, RegistrationTypeList,
            RegistrationSubTypeList, FilterStatusList,
            ConfigVersionList, UserSectionList, TestList, skip, take, testskip, testtake, selectedFilter,
            DynamicSampleColumns, DynamicSubSampleColumns, DynamicTestColumns, DynamicGridItem,
            DynamicGridMoreField } = this.state;
        let bool = false;
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            bool = true;
            // this.setState({userRoleControlRights, controlMap});
        }
        if (this.props.Login.masterData.RegSubTypeValue !== previousProps.Login.masterData.RegSubTypeValue) {
            if (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nsubsampleneed === transactionStatus.NO) {
                let dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'sarno' }] }
                resultDataState = dataState
                instrumentDataState = dataState
                materialDataState = dataState
                taskDataState = dataState
                documentDataState = dataState
                resultChangeDataState = dataState
                historyDataState = dataState
                testCommentDataState = dataState
                // this.setState({
                //     resultDataState: dataSate,instrumentDataState: dataSate,
                //     materialDataState: dataSate,taskDataState: dataSate,instrumentDataState: dataSate,
                //     instrumentDataState: dataSate,documentDataState: dataSate,resultChangeDataState: dataSate,
                //     historyDataState: dataSate,resultDataState: dataSate,testCommentDataState:dataSate,
                // });
                bool = true;
            }
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {

            selectedRecord = this.props.Login.selectedRecord
            // this.setState({selectedRecord: this.props.Login.selectedRecord });
            bool = true;
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const SampletypeListMap = constructOptionList(this.props.Login.masterData.SampleType || [], "nsampletypecode", "ssampletypename", 'ascending', 'nsampletypecode', false);
            const RegistrationTypeListMap = constructOptionList(this.props.Login.masterData.RegistrationType || [], "nregtypecode", "sregtypename", "nsorter", 'ascending', 'nregtypecode', false);
            const RegistrationSubTypeListMap = constructOptionList(this.props.Login.masterData.RegistrationSubType || [], "nregsubtypecode", "sregsubtypename", "nsorter", 'ascending', 'nregsubtypecode', false);
            const FilterStatusListMap = constructOptionList(this.props.Login.masterData.FilterStatus || [], "ntransactionstatus", "sfilterstatus", undefined, undefined, true);
            const ConfigVersionListMap = constructOptionList(this.props.Login.masterData.ApprovalVersion || [], "napprovalconfigversioncode", "sversionname", 'descending', 'ntransactionstatus', false);
            const UserSectionListMap = constructOptionList(this.props.Login.masterData.UserSection || [], "nsectioncode", "ssectionname", undefined, undefined, true);
            const TestListMap = constructOptionList(this.props.Login.masterData.Test || [], "ntestcode", "stestsynonym", undefined, undefined, true);
            SampletypeList = SampletypeListMap.get("OptionList");
            RegistrationTypeList = RegistrationTypeListMap.get("OptionList");
            RegistrationSubTypeList = RegistrationSubTypeListMap.get("OptionList");
            FilterStatusList = FilterStatusListMap.get("OptionList");
            ConfigVersionList = ConfigVersionListMap.get("OptionList");
            UserSectionList = UserSectionListMap.get("OptionList");
            TestList = TestListMap.get("OptionList");
            bool = true;
            skip = this.props.Login.skip === undefined ? skip : this.props.Login.skip
            take = this.props.Login.take || take
            testskip = this.props.Login.testskip === undefined ? testskip : this.props.Login.testskip
            testtake = this.props.Login.testtake || testtake
            let selectFilterStatus = { ntransactionstatus: transactionStatus.PARTIAL, sfilterstatus: this.props.intl.formatMessage({ id: "IDS_PARTIAL" }), scolorhexcode: "#800000" }

            // const selectedFilters = this.props.Login.masterData.FilterStatusValue && 
            //     this.props.Login.masterData.FilterStatusValue.ntransactionstatus === transactionStatus.ALL ? 
            //   JSON.stringify (JSON.parse(this.props.Login.masterData.FilterStatus)) : []

            // const selectedFilters = this.props.Login.masterData.FilterStatusValue &&
            //     this.props.Login.masterData.FilterStatusValue.ntransactionstatus === transactionStatus.ALL ?
            //     this.props.Login.masterData.FilterStatus : [];

            const selectedFilters = this.props.Login.masterData.FilterStatus || [];

            const selectedFiltersNew = JSON.parse(JSON.stringify(selectedFilters));

            const index = selectedFiltersNew.findIndex(item => item.ntransactionstatus === transactionStatus.PARTIAL)
            if (selectedFiltersNew.length > 0 && index === -1) {
                selectedFiltersNew.push(selectFilterStatus)
            }
            selectedFilter = selectedFiltersNew;
            if (this.props.Login.resultDataState && this.props.Login.resultDataState !== previousProps.Login.resultDataState) {
                resultDataState = this.props.Login.resultDataState;
            }
            if (this.props.Login.instrumentDataState && this.props.Login.instrumentDataState !== previousProps.Login.instrumentDataState) {
                instrumentDataState = this.props.Login.instrumentDataState;
            }
            if (this.props.Login.taskDataState && this.props.Login.taskDataState !== previousProps.Login.taskDataState) {
                taskDataState = this.props.Login.taskDataState;
            }
            if (this.props.Login.resultChangeDataState && this.props.Login.resultChangeDataState !== previousProps.Login.resultChangeDataState) {
                resultChangeDataState = this.props.Login.resultChangeDataState;
            }
            if (this.props.Login.historyDataState && this.props.Login.historyDataState !== previousProps.Login.historyDataState) {
                historyDataState = this.props.Login.historyDataState;
            }
            if (this.props.Login.testCommentDataState && this.props.Login.testCommentDataState !== previousProps.Login.testCommentDataState) {
                testCommentDataState = this.props.Login.testCommentDataState;
            }
            if (this.props.Login.samplePrintHistoryDataState && this.props.Login.samplePrintHistoryDataState !== previousProps.Login.samplePrintHistoryDataState) {
                samplePrintHistoryDataState = this.props.Login.samplePrintHistoryDataState;
            }
            if (this.props.Login.sampleHistoryDataState && this.props.Login.sampleHistoryDataState !== previousProps.Login.sampleHistoryDataState) {
                sampleHistoryDataState = this.props.Login.sampleHistoryDataState;
            }
        }

        if (this.props.Login.masterData.DynamicDesign && this.props.Login.masterData.DynamicDesign !== previousProps.Login.masterData.DynamicDesign) {
            const dynamicColumn = JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata.value)
            DynamicSampleColumns = dynamicColumn.samplelistitem ? dynamicColumn.samplelistitem : [];
            DynamicSubSampleColumns = dynamicColumn.subsamplelistitem ? dynamicColumn.subsamplelistitem : [];
            DynamicTestColumns = dynamicColumn.testlistitem ? dynamicColumn.testlistitem : []

            DynamicGridItem = dynamicColumn.samplegriditem ? dynamicColumn.samplegriditem : [];
            DynamicGridMoreField = dynamicColumn.samplegridmoreitems ? dynamicColumn.samplegridmoreitems : [];

            SingleItem = dynamicColumn.sampledisplayfields ? dynamicColumn.sampledisplayfields : [];
            testMoreField = dynamicColumn.testlistmoreitems ? dynamicColumn.testlistmoreitems : [];
            testListColumns = dynamicColumn.testlistitem ? dynamicColumn.testlistitem : [];
            bool = true;
            // sampleListColumns = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], designProperties.LISTITEM);
            // subSampleListColumns = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[2], designProperties.LISTITEM);
            // testListColumns = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[3], designProperties.LISTITEM);
            // sampleListMainField = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], designProperties.LISTMAINFIELD);
            // subSampleListMainField = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[2], designProperties.LISTMAINFIELD);
            // testListMainField = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[3], designProperties.LISTMAINFIELD);
            // SingleItem = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], designProperties.SINGLEITEMDATA)
            // SampleGridItem = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], designProperties.GRIDITEM)
            // SampleGridExpandableItem = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], designProperties.GRIDEXPANDABLEITEM)
            // testMoreField = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[3], designProperties.LISTMOREITEM)
            // let {selectedRecord}=this.state
            let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
            selectedRecord['fromDate'] = obj.fromDate;
            selectedRecord['toDate'] = obj.toDate;
            // this.setState({
            //     sampleListColumns, subSampleListColumns, testListColumns, SingleItem,
            //     sampleListMainField, subSampleListMainField, testListMainField,
            //     SampleGridItem, SampleGridExpandableItem, testMoreField,selectedRecord
            // })
            bool = true;
        }
        if (bool) {
            bool = false;
            this.setState({
                userRoleControlRights, controlMap,
                sampleListColumns, subSampleListColumns, testListColumns, SingleItem,
                sampleListMainField, subSampleListMainField, testListMainField,
                SampleGridItem, SampleGridExpandableItem, testMoreField,
                resultDataState, instrumentDataState,
                materialDataState, taskDataState,
                documentDataState, resultChangeDataState,
                historyDataState, testCommentDataState,
                samplePrintHistoryDataState, sampleHistoryDataState,
                selectedRecord, SampletypeList, RegistrationTypeList,
                RegistrationSubTypeList, FilterStatusList,
                ConfigVersionList, UserSectionList, TestList,
                skip, take, testskip, testtake, selectedFilter,
                DynamicSampleColumns, DynamicSubSampleColumns,
                DynamicTestColumns, DynamicGridItem,
                DynamicGridMoreField
            });
        }
    }

    // previewSampleReport = (ncontrolCode) => {

    //     console.log("report:", this.props.Login.masterData.selectedSample);
    //     const selectedSample = this.props.Login.masterData.selectedSample[0];

    //     const inputData = {ndecisionstatus:selectedSample.ndecisionstatus,
    //                         userinfo:this.props.Login.userInfo,
    //                         nprimarykey: selectedSample.npreregno,
    //                         ncoareporttypecode : reportCOAType.SAMPLECERTIFICATEPRIVIEW,
    //                         nreporttypecode :REPORTTYPE.SAMPLEREPORT,
    //                         sprimarykeyname :"npreregno",
    //                         ncontrolcode : ncontrolCode,
    //                         nregtypecode:selectedSample.nregtypecode,
    //                         nregsubtypecode: selectedSample.nregsubtypecode
    //                         }
    //     this.props.previewSampleReport(inputData);

    // }

    sampleTabDetail() {
        const tabMap = new Map();
        let npreregno = this.props.Login.masterData.MJSelectedSample ? this.props.Login.masterData.MJSelectedSample.map(sample => sample.npreregno).join(",") : "-1";
        tabMap.set("IDS_SAMPLEATTACHMENTS",
            <Attachments
                screenName="IDS_SAMPLEATTACHMENTS"
                selectedMaster={this.props.Login.masterData.MJSelectedSample}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                attachments={this.props.Login.masterData.RegistrationAttachment || []}
                deleteRecord={this.props.deleteAttachment}
                onSaveClick={this.onAttachmentSaveClick}
                masterList={this.props.Login.masterData.MJSelectedSample}
                masterAlertStatus={"IDS_SELECTSAMPLETOADDATTACHEMENT"}
                fetchRecord={this.props.getAttachmentCombo}
                addName={"AddSampleAttachment"}
                editName={"EditSampleAttachment"}
                deleteName={"DeleteSampleAttachment"}
                viewName={"ViewSampleAttachment"}
                methodUrl={"SampleAttachment"}
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
                    masterList: this.props.Login.masterData.MJSelectedSample

                }}
                selectedListName="IDS_SAMPLES"
                displayName="sarno"
            />)

            tabMap.set("IDS_SAMPLECOMMENTS", <Comments
                screenName="IDS_SAMPLECOMMENTS"
                selectedMaster={this.props.Login.masterData.MJSelectedSample}
                onSaveClick={this.onCommentsSaveClick}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                Comments={this.props.Login.masterData.RegistrationComment || []}
                fetchRecord={this.props.getCommentsCombo}
                masterList={this.props.Login.masterData.MJSelectedSample}
                masterAlertStatus={"IDS_SELECTTESTTOADDCOMMENTS"}
                addName={"AddSampleComment"}
                editName={"EditSampleComment"}
                deleteName={"DeleteSampleComment"}
                methodUrl={"SampleComment"}
                isTestComment={false}
                primaryKeyField={"nregcommentcode"}
                dataState={this.state.testCommentDataState}
                dataStateChange={this.testDataStateChange}
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
                    masterList: this.props.Login.masterData.MJ_SAMPLE,
                    ncontrolCode: this.state.controlMap.has("EditSampleComment") && this.state.controlMap.get("EditSampleComment").ncontrolcode

                }}
                selectedListName="IDS_SAMPLES"
                displayName="sarno"
            />)


            
        // tabMap.set("IDS_SAMPLEAPPROVALHISTORY",
        //     <SampleApprovalHistory
        //         userInfo={this.props.Login.userInfo}
        //         ApprovalHistory={this.props.Login.masterData.SampleApprovalHistory}
        //         inputParam={this.props.Login.inputParam}
        //         dataState={this.state.sampleHistoryDataState}
        //         dataStateChange={this.sampleDataStateChange}
        //         screenName="IDS_SAMPLEAPPROVALHISTORY"
        //         controlMap={this.state.controlMap}
        //         userRoleControlRights={this.state.userRoleControlRights}
        //         selectedId={null}
        //     />)

        // tabMap.set("IDS_PRINTHISTORY",
        //     <ApprovalPrintHistoryTab
        //         userInfo={this.props.Login.userInfo}
        //         ApprovalPrintHistory={this.props.Login.masterData.PrintHistory}
        //         inputParam={this.props.Login.inputParam}
        //         dataState={this.state.samplePrintHistoryDataState}
        //         dataStateChange={this.sampleDataStateChange}
        //         screenName="IDS_PRINTHISTORY"
        //         controlMap={this.state.controlMap}
        //         userRoleControlRights={this.state.userRoleControlRights}
        //         selectedId={null}
        //     />);
        if (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode === RegistrationSubType.ROUTINE) {
            // tabMap.set("IDS_REPORTHISTORY",
            //     <ReportHistoryTab
            //         userInfo={this.props.Login.userInfo}
            //         COAHistory={this.props.Login.masterData.COAHistory}
            //         inputParam={this.props.Login.inputParam}
            //         dataState={this.state.reportHistoryDataState}
            //         dataStateChange={this.sampleDataStateChange}
            //         screenName="IDS_REPORTHISTORY"
            //         controlMap={this.state.controlMap}
            //         userRoleControlRights={this.state.userRoleControlRights}
            //         selectedId={null}
            //         viewDownloadFile={this.downloadReport}
            //     />);
        }
        return tabMap;
    }
    downloadReport = (input) => {
        let inputParam = {
            inputData: { selectedRecord: { ...input.inputData }, userinfo: this.props.Login.userInfo },
            classUrl: "approval",
            operation: "view",
            methodUrl: "Report"
        }
        this.props.viewAttachment(inputParam)
    }
    testTabDetail = () => {
        const testTabMap = new Map();
        let { testskip, testtake } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : this.props.Login.masterData.MJ_TEST || [];
        const editTestCommentsId = this.state.controlMap.has("EditTestComment") && this.state.controlMap.get("EditTestComment").ncontrolcode;
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.MJSelectedTest, "ntransactiontestcode");
        // let npreregno = this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",") : "-1";
        let ntransactiontestcode = this.props.Login.masterData.MJSelectedTest ? this.props.Login.masterData.MJSelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        if (this.state.showTest) {
            // testTabMap.set("IDS_RESULTS", <ApprovalResultsTab
            //     userInfo={this.props.Login.userInfo}
            //     masterData={this.props.Login.masterData}
            //     inputParam={this.props.Login.inputParam}
            //     dataState={this.state.resultDataState}
            //     dataStateChange={this.testDataStateChange}
            //     screenName="IDS_RESULTS"
            //     controlMap={this.state.controlMap}
            //     userRoleControlRights={this.state.userRoleControlRights}
            //     getStatusCombo={this.props.getStatusCombo}
            //     selectedId={this.props.Login.masterData.selectedParamId}
            //     viewFile={this.props.viewAttachment}
            //     checkListRecord={this.props.checkListRecord}
            //     getEnforceCommentsHistory={this.props.getEnforceCommentsHistory}
            // />)
            // testTabMap.set("IDS_INSTRUMENT", <ApprovalInstrumentTab
            //     userInfo={this.props.Login.userInfo}
            //     masterData={this.props.Login.masterData}
            //     inputParam={this.props.Login.inputParam}
            //     dataState={this.state.instrumentDataState}
            //     dataStateChange={this.testDataStateChange}
            //     screenName="IDS_INSTRUMENT"
            //     controlMap={this.state.controlMap}
            //     userRoleControlRights={this.state.userRoleControlRights}
            //     selectedId={null}
            // />)
            // testTabMap.set("IDS_MATERIAL", <ApprovalResultsTab
            //     userInfo={this.props.Login.userInfo}
            //     masterData={this.props.Login.masterData}
            //     inputParam={this.props.Login.inputParam}
            //     dataState={this.state.dataState}
            //     dataStateChange={this.testDataStateChange}
            //     screenName="IDS_MATERIAL"
            //     controlMap={this.state.controlMap}
            //     userRoleControlRights={this.state.userRoleControlRights}
            //     selectedId={null}
            // />)
            // testTabMap.set("IDS_TASK", <ApprovalTask
            //     userInfo={this.props.Login.userInfo}
            //     ResultUsedTasks={this.props.Login.masterData.ResultUsedTasks}
            //     inputParam={this.props.Login.inputParam}
            //     dataState={this.state.taskDataState}
            //     dataStateChange={this.testDataStateChange}
            //     screenName="IDS_TASK"
            //     controlMap={this.state.controlMap}
            //     userRoleControlRights={this.state.userRoleControlRights}
            //     selectedId={null}
            // />)
            testTabMap.set("IDS_TESTATTACHMENTS", <Attachments
                screenName="IDS_TESTATTACHMENTS"
                selectedMaster={selectedTestList}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                attachments={this.props.Login.masterData.RegistrationTestAttachment || []}
                deleteRecord={this.props.deleteAttachment}
                fetchRecord={this.props.getAttachmentCombo}
                onSaveClick={this.onAttachmentSaveClick}
                masterList={selectedTestList}
                masterAlertStatus={"IDS_SELECTTESTTOADDATTACHEMENT"}
                addName={"AddTestAttachment"}
                editName={"EditTestAttachment"}
                deleteName={"DeleteTestAttachment"}
                viewName={"ViewTestAttachment"}
                methodUrl={"TestAttachment"}
                userInfo={this.props.Login.userInfo}
                nsubsampleneed={this.props.Login.masterData.nneedsubsample}
                subFields={[{ [designProperties.VALUE]: "stestsynonym" }, { [designProperties.VALUE]: "dcreateddate" }]}
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
            />)
            testTabMap.set("IDS_TESTCOMMENTS", <Comments
                screenName="IDS_TESTCOMMENTS"
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
            />)

            // testTabMap.set("IDS_RESULTCHANGEHISTORY", <ResultChangeHistoryTab
            //     userInfo={this.props.Login.userInfo}
            //     ApprovalResultChangeHistory={this.props.Login.masterData.ApprovalResultChangeHistory}
            //     inputParam={this.props.Login.inputParam}
            //     dataState={this.state.resultChangeDataState}
            //     dataStateChange={this.testDataStateChange}
            //     screenName="IDS_RESULTCHANGEHISTORY"
            //     controlMap={this.state.controlMap}
            //     userRoleControlRights={this.state.userRoleControlRights}
            //     selectedId={null}

            // />)




            // testTabMap.set("IDS_TESTAPPROVALHISTORY",
            //     <ApprovalHistoryTab
            //         userInfo={this.props.Login.userInfo}
            //         ApprovalHistory={this.props.Login.masterData.ApprovalHistory}
            //         inputParam={this.props.Login.inputParam}
            //         dataState={this.state.historyDataState}
            //         dataStateChange={this.testDataStateChange}
            //         screenName="IDS_TESTAPPROVALHISTORY"
            //         controlMap={this.state.controlMap}
            //         userRoleControlRights={this.state.userRoleControlRights}
            //         selectedId={null}
            //     />)
        }

        return testTabMap;
    }
    onNumericInputOnChange = (value, name) => {
        let selectedRecord = this.state.selectedRecord
        if (value === 0 || value === 0.0) {
            selectedRecord[name] = "";
            this.setState({ selectedRecord });
        } else {

            selectedRecord[name] = value;
            this.setState({ selectedRecord });

        }
    }
    onTestTabChange = (tabProps) => {

        const activeTestTab = tabProps.screenName;
        if (activeTestTab !== this.props.Login.activeTestTab) {
            if (this.props.Login.masterData.MJSelectedTest && this.props.Login.masterData.MJSelectedTest.length > 0) {
                let inputData = {
                    masterData: this.props.Login.masterData,
                    MJSelectedTest: this.props.Login.masterData.MJSelectedTest,
                    ntransactiontestcode: this.props.Login.masterData.MJSelectedTest ?
                        String(this.props.Login.masterData.MJSelectedTest.map(item => item.ntransactiontestcode).join(",")) : "-1",
                    npreregno: this.props.Login.masterData.selectedSample ?
                        this.props.Login.masterData.selectedSample.map(item => item.npreregno).join(",") : "-1",
                    userinfo: this.props.Login.userInfo,
                    activeTestTab,
                    screenName: activeTestTab,
                    resultDataState: this.state.resultDataState,
                    instrumentDataState: this.state.instrumentDataState,
                    materialDataState: this.state.materialDataState,
                    taskDataState: this.state.taskDataState,
                    documentDataState: this.state.documentDataState,
                    historyDataState: this.state.historyDataState,
                    resultChangeDataState: this.state.resultChangeDataState,
                    testCommentDataState: this.state.testCommentDataState,
                }
                this.props.getMJTestChildTabDetail(inputData, true)
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))
            }
        }
    }
    onSampleTabChange = (tabProps) => {
        const activeSampleTab = tabProps.screenName;
        if (activeSampleTab !== this.props.Login.activeSampleTab) {
            let inputData = {
                masterData: this.props.Login.masterData,
                selectedSample: this.props.Login.masterData.MJSelectedSample,
                npreregno: this.props.Login.masterData.MJSelectedSample ? this.props.Login.masterData.MJSelectedSample.map(item => item.npreregno).join(",") : "-1",
                userinfo: this.props.Login.userInfo,
                screenName: activeSampleTab,
                activeSampleTab
            }
            this.props.getMJSampleChildTabDetail(inputData)
        }
    }
    showSampleInfo() {
        this.setState({ showSample: true, showTest: false })
    }
    showTestList() {
        this.setState({ showTest: true, showSample: false })
    }
    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
        setTimeout(() => { this._scrollBarRef.updateScroll() })
    };
    handleTestPageChange = e => {
        this.setState({
            testskip: e.skip,
            testtake: e.take
        });
    };
    checkRetestAction = (action, ncontrolCode) => {
        let { testskip, testtake } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : [...this.props.Login.masterData.MJ_TEST];
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.MJSelectedTest, "ntransactiontestcode");
        if (selectedTestList.length > 0) {
            if (action.ntransactionstatus === transactionStatus.RETEST) {

                if (this.props.Login.masterData.retestcount && this.props.Login.masterData.retestcount > 1) {
                    if (selectedTestList.length > 1) {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTONETESTONLY" }));
                    } else {
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                action,
                                masterData: this.props.Login.masterData,
                                openChildModal: true,
                                screenName: "IDS_RETESTCOUNT",
                                operation: "dynamic"
                            }
                        }
                        this.props.updateStore(updateInfo);
                    }
                } else {
                    this.performTestActions(action, ncontrolCode);
                }

            } else {

                this.performTestActions(action, ncontrolCode);

            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))
        }
    }
    performTestActions = (action, ncontrolCode) => {
        if (action.ntransactionstatus === transactionStatus.RETEST && this.state.selectedRecord && this.state.selectedRecord.retestcount > this.props.Login.masterData.retestcount) {

            toast.info(this.props.intl.formatMessage({ id: "IDS_MAX" }) + ": " + this.props.Login.masterData.retestcount)

        } else {
            let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
            let ntransCode = this.props.Login.masterData.FilterStatusValue.ntransactionstatus
            if (ntransCode === transactionStatus.ALL) {
                ntransCode = this.props.Login.masterData.FilterStatus.map(status => status.ntransactionstatus).join(",");
            } else {
                ntransCode = ntransCode + "," + action.ntransactionstatus
            }
            let { testskip, testtake } = this.state
            let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : [...this.props.Login.masterData.MJ_TEST];
            testList = testList.slice(testskip, testskip + testtake);
            let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.MJSelectedTest, "ntransactiontestcode");
            const inputParam = {
                inputData: {
                    'performaction': {
                        npreregno: selectedTestList.map(sample => sample.npreregno).join(","),
                        ntransactionsamplecode: this.props.Login.masterData.MJSelectedSubSample.map(sample => sample.ntransactionsamplecode).join(","),
                        ntransactiontestcode: selectedTestList.map(test => test.ntransactiontestcode).join(","),
                        nsectioncode: this.props.Login.masterData.UserSectionValue ?
                            this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ?
                                this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') :
                                String(this.props.Login.masterData.UserSectionValue.nsectioncode) :
                            null,
                        ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode,
                        nTransStatus: action.ntransactionstatus,
                        ntransactionstatus: String(-1),
                        nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                        napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
                        nneedsubsample:(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nflag: 2,
                        ntype: 1,
                        userinfo: this.props.Login.userInfo,
                        MJSelectedSample: this.props.Login.masterData.MJSelectedSample,
                        MJSelectedSubSample: this.props.Login.masterData.MJSelectedSubSample,
                        MJSelectedTest: this.props.Login.masterData.MJSelectedTest,
                        retestcount: action.ntransactionstatus === transactionStatus.RETEST ? this.state.selectedRecord ? this.state.selectedRecord.retestcount || 1 : 1 : undefined,
                        ncontrolCode,
                        checkBoxOperation:3,
                        ndesigntemplatemappingcode:(this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode)||-1
                    },
                    userinfo: this.props.Login.userInfo
                },
                masterData: this.props.Login.masterData,
                methodUrl: "performaction",
                postParamList: this.postParamList
            }
            if (action.nesignneed === transactionStatus.YES) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: { inputParam, masterData: this.props.Login.masterData },
                        openChildModal: true,
                        screenName: "performaction",
                        operation: "dynamic"
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.performAction(inputParam)
            }
        }
    }
    updateDecision = (action) => {
        let ntransCode = this.props.Login.masterData.realFilterStatusValue.ntransactionstatus
        if (ntransCode === transactionStatus.ALL) {
            ntransCode = this.props.Login.masterData.FilterStatus.map(status => status.ntransactionstatus).join(",");
        }
        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
        let { skip, take } = this.state
        let sampleList = [...this.props.Login.masterData.MJ_SAMPLE];
        sampleList = sampleList.splice(skip, skip + take);
        let selectedsampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.selectedSample, "npreregno");
        if (selectedsampleList.length > 0) {
            const inputData = {
                'updatedecision': {
                    npreregno: selectedsampleList.map(sample => sample.npreregno).join(","),
                    nTransStatus: action.ntransactionstatus,
                    ntransactionstatus: String(ntransCode),
                    dfrom: obj.fromDate,
                    dto: obj.toDate,
                    nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                    nsectioncode: this.props.Login.masterData.UserSectionValue ?
                        this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ?
                            this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') :
                            String(this.props.Login.masterData.UserSectionValue.nsectioncode) :
                        null,
                    ntestcode: this.props.Login.masterData.TestValue ? this.props.Login.masterData.TestValue.ntestcode : 0,
                    nflag: 1,
                    userinfo: this.props.Login.userInfo,
                    napprovalversioncode: String(selectedsampleList[0].napprovalversioncode),
                    napprovalconfigcode: selectedsampleList[0].napprovalconfigcode,
                    selectedSample: this.props.Login.masterData.selectedSample,
                }, userinfo: this.props.Login.userInfo

            }
            let inputParam = { postParamList: this.postParamList, inputData, masterData: this.props.Login.masterData }
            if (action.nesignneed === transactionStatus.YES) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: { inputParam, masterData: this.props.Login.masterData },
                        openChildModal: true,
                        screenName: "updatedecision",
                        operation: "decision"
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.updateDecision(inputParam)
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLE" }))
        }

    }
    onFilterComboChange = (comboData, fieldName) => {

        if (comboData) {
            let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
            let inputParamData = {};
            if (fieldName === 'nsampletypecode') {
                if (comboData.value !== this.props.Login.masterData.realSampleTypeValue.nsampletypecode) {
                    inputParamData = {
                        nflag: 2,
                        fromdate: obj.fromDate,
                        todate: obj.toDate,
                        nsampletypecode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        realSampleTypeValue: comboData.item
                    };
                    this.props.getRegType(inputParamData)
                }
            } else if (fieldName === 'nregtypecode') {
                if (comboData.value !== this.props.Login.masterData.realRegTypeValue.nregtypecode) {
                    inputParamData = {
                        nflag: 3,
                        fromdate: obj.fromDate,
                        todate: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                        nregtypecode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        realRegTypeValue: comboData.item
                    }
                    this.props.getRegSubType(inputParamData)
                }
            } else if (fieldName === 'nregsubtypecode') {

                if (comboData.value !== this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) {
                    let inputData = {
                        nflag: 4,
                        fromdate: obj.fromDate,
                        todate: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.realRegTypeValue.nregtypecode,
                        nregsubtypecode: comboData.value,
                        userinfo: this.props.Login.userInfo
                    }
                    inputParamData = {
                        inputData,
                        masterData: {
                            ...this.props.Login.masterData,
                            realRegSubTypeValue: comboData.item
                        }
                    }
                    this.props.getAppConfigVersion(inputParamData)
                }
            }

            else if (fieldName === 'napproveconfversioncode') {
                if (comboData.value !== this.props.Login.masterData.realApprovalVersionValue.napproveconfversioncode) {
                   
                    inputParamData = {
                        nflag: 4,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.realRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                        napprovalversioncode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: { ...this.props.Login.masterData, realApprovalVersionValue: comboData.item },
                        RegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue,
                        nsectioncode: this.props.Login.masterData.realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") : this.props.Login.masterData.realUserSectionValue.nsectioncode,
                    }
                    this.props.getFilterStatus(inputParamData)
                }
            }
            else if (fieldName === 'nsectioncode') {
                if (comboData.value !== this.props.Login.masterData.realUserSectionValue.nsectioncode) {
                    inputParamData = {
                        nflag: 5,
                        fromdate: obj.fromDate,
                        todate: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.realRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                        napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                        nsectioncode: comboData.value === -1 ? this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") : comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: { ...this.props.Login.masterData, realUserSectionValue: comboData.item },
                        RegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue,
                        ntransactionstatus: JSON.stringify(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus),
                        stransactionstatus: this.props.Login.masterData.realFilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
                    }

                    this.props.getSection(inputParamData);
                }
            } else if (fieldName === 'ntransactionstatus') {
                if (comboData.value !== this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) {
                    let masterData = { ...this.props.Login.masterData, realFilterStatusValue: comboData.item }
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData }
                    }
                    this.props.updateStore(updateInfo);
                }
            }
            else if (fieldName === 'ntestcode') {
                if (comboData.value !== this.props.Login.masterData.realTestValue.ntestcode) {
                    let masterData = { ...this.props.Login.masterData, realTestValue: comboData.item }
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData }
                    }
                    this.props.updateStore(updateInfo);
                }
            }
            else {
                if (comboData.value !== this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) {
                    inputParamData = {
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.realRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                        napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                        userinfo: this.props.Login.userInfo,
                        masterData: { ...this.props.Login.masterData, FilterStatusValue: comboData.item },
                        RegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue,
                        ntransactionstatus: comboData.value,
                        stransactionstatus: comboData.value === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : comboData.value,
                        nsectioncode: this.props.Login.masterData.realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") : this.props.Login.masterData.realUserSectionValue.nsectioncode,
                    }

                    this.props.getTestStatus(inputParamData);
                }
            }
        }
    }
    onComboChange = (comboData) => {
        if (comboData) {
            let masterData = { ...this.props.Login.masterData, GradeValue: comboData }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { masterData }
            }
            this.props.updateStore(updateInfo);
        }
    }
    onInputOnChange = (event) => {
        let selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
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
                userinfo: this.props.Login.userInfo
            },
            masterData: this.props.Login.masterData

        }
        this.props.getAppConfigVersion(inputParam)
    }
    changeMandatory = (event, dataItem) => {
        let selectedRecord = this.state.selectedRecord || {};
        let value = event.currentTarget.checked ? transactionStatus.YES : transactionStatus.NO
        selectedRecord["approvalParameterEdit"] = { ...selectedRecord["approvalParameterEdit"], [dataItem.ntransactionresultcode]: value }
        this.setState({ selectedRecord });
    }
    onReload = () => {
        let { realFromDate, realToDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue,
            realFilterStatusValue, realApprovalVersionValue, realUserSectionValue, realTestValue } = this.props.Login.masterData
        let masterData = { ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue, realUserSectionValue, realTestValue }
        let inputData = {
            nneedsubsample: (realRegSubTypeValue && realRegSubTypeValue.nneedsubsample) || false,
            nsampletypecode: (realSampleTypeValue && realSampleTypeValue.nsampletypecode) || -1,
            nregtypecode: (realRegTypeValue && realRegTypeValue.nregtypecode) || -1,
            nregsubtypecode: (realRegSubTypeValue && realRegSubTypeValue.nregsubtypecode) || -1,
            ntransactionstatus:String(realFilterStatusValue ? realFilterStatusValue.ntransactionstatus : -1),
           // ntransactionstatus: ((realFilterStatusValue && realFilterStatusValue.ntransactionstatus !== undefined) || realFilterStatusValue.ntransactionstatus !== '0') ? String(realFilterStatusValue.ntransactionstatus) : "-1",
            napprovalconfigcode: realApprovalVersionValue ? realApprovalVersionValue.napprovalconfigcode || -1 : null,
            napprovalversioncode:String(realApprovalVersionValue ? realApprovalVersionValue.napprovalconfigversioncode :1),
           // napprovalversioncode: realApprovalVersionValue && realApprovalVersionValue.napprovalconfigversioncode ? String(realApprovalVersionValue.napprovalconfigversioncode) : null,
            nsectioncode: realUserSectionValue ? realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(realUserSectionValue.nsectioncode) : null,
            ntestcode: realTestValue && realTestValue.ntestcode ? realTestValue.ntestcode : -1,
            userinfo: this.props.Login.userInfo,
            activeTestTab: this.props.Login.activeTestTab || "",
            activeSampleTab: this.props.Login.activeSampleTab || "",
            checkBoxOperation:3,
            ntype:2,
            ndesigntemplatemappingcode:(this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode)||-1
        }
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
            && inputData.ntransactionstatus !== -1 && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== -1
            && realUserSectionValue.nsectioncode !== null && realTestValue.ntestcode!==-1) {

            let obj = convertDateValuetoString(realFromDate, realToDate, this.props.Login.userInfo)
            inputData['fromdate'] = obj.fromDate;
            inputData['todate'] = obj.toDate;
            let inputParam = {
                masterData,
                inputData,
                searchSampleRef: this.searchSampleRef,
                searchSubSampleRef: this.searchSubSampleRef,
                searchTestRef: this.searchTestRef,
                skip: this.state.skip,
                take: this.state.take,
                testskip: this.state.testskip,
                testtake: this.state.testtake,
                resultDataState: this.state.resultDataState,
                instrumentDataState: this.state.instrumentDataState,
                materialDataState: this.state.materialDataState,
                taskDataState: this.state.taskDataState,
                documentDataState: this.state.documentDataState,
                resultChangeDataState: this.state.resultChangeDataState,
                testCommentDataState: this.state.testCommentDataState,
                historyDataState: this.state.historyDataState,
                samplePrintHistoryDataState: this.state.samplePrintHistoryDataState,
                sampleHistoryDataState: this.state.sampleHistoryDataState
            }
            this.props.getMyJobsSample(inputParam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }
    }
    onFilterSubmit = () => {
        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
        //let realFromDate = obj.fromDate;
      //  let realToDate = obj.toDate;
        let realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate);
        let realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate);
        // let realFromDate = new Date(this.props.Login.masterData.fromDate)
        // let realToDate = new Date(this.props.Login.masterData.toDate)
        let realSampleTypeValue = this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue
        let realRegTypeValue = this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue
        let realRegSubTypeValue = this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue
        let realFilterStatusValue = this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue
        let realApprovalVersionValue = this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue
        let realUserSectionValue = this.props.Login.masterData.realUserSectionValue && this.props.Login.masterData.realUserSectionValue
        let realTestValue = this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue
        let masterData = { ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue, realUserSectionValue, realTestValue }
        let inputData = {
           // npreregno: "0",
            nsampletypecode: (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode) || -1,
            nregtypecode: parseInt(this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
            nregsubtypecode: parseInt(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
            ntransactionstatus: ((this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus !== undefined) || this.props.Login.masterData.realFilterStatusValue.ntransactionstatus !== '0') ? String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) : "-1",
            napprovalconfigcode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
            napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) : null,
            nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.realUserSectionValue.nsectioncode) : null,
            ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode : -1,
            nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
            userinfo: this.props.Login.userInfo,
            activeTestTab: this.props.Login.activeTestTab,
            activeSampleTab: this.props.Login.activeSampleTab,
            checkBoxOperation: 3,
            ntype:2,
            ndesigntemplatemappingcode:(this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode)||-1
        }
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
            && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
            && realFilterStatusValue.sfilterstatus !== null && inputData.ntestcode !== undefined) {

            // let obj = this.covertDatetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate)
            inputData['fromdate'] = obj.fromDate;
            inputData['todate'] = obj.toDate;
            let inputParam = {
                masterData,
                inputData,
                searchSampleRef: this.searchSampleRef,
                searchSubSampleRef: this.searchSubSampleRef,
                searchTestRef: this.searchTestRef,
                skip: this.state.skip,
                take: this.state.take,
                testskip: this.state.testskip,
                testtake: this.state.testtake,
                resultDataState: this.state.resultDataState,
                instrumentDataState: this.state.instrumentDataState,
                materialDataState: this.state.materialDataState,
                taskDataState: this.state.taskDataState,
                documentDataState: this.state.documentDataState,
                resultChangeDataState: this.state.resultChangeDataState,
                testCommentDataState: this.state.testCommentDataState,
                historyDataState: this.state.historyDataState,
                samplePrintHistoryDataState: this.state.samplePrintHistoryDataState,
                sampleHistoryDataState: this.state.sampleHistoryDataState
            }
            this.props.getMyJobsSample(inputParam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }

    }
    testDataStateChange = (event) => {

        switch (this.props.Login.activeTestTab) {
            case "IDS_RESULTS":
                this.setState({
                    resultDataState: event.dataState
                });
                break;
            case "IDS_INSTRUMENT":
                this.setState({
                    instrumentDataState: event.dataState
                });
                break;
            case "IDS_MATERIAL":
                this.setState({
                    materialDataState: event.dataState
                });
                break;
            case "IDS_TASK":
                this.setState({
                    taskDataState: event.dataState
                });
                break;
            case "IDS_TESTATTACHMENTS":
                this.setState({
                    instrumentDataState: event.dataState
                });
                break;
            case "IDS_TESTCOMMENTS":
                this.setState({
                    testCommentDataState: event.dataState
                });
                break;
            case "IDS_DOCUMENTS":
                this.setState({
                    documentDataState: event.dataState
                });
                break;
            case "IDS_RESULTCHANGEHISTORY":
                this.setState({
                    resultChangeDataState: event.dataState
                });
                break;
            case "IDS_TESTAPPROVALHISTORY":
                this.setState({
                    historyDataState: event.dataState
                });
                break;
            default:
                this.setState({
                    resultDataState: event.dataState
                });
                break;
        }

    }
    sampleGridDataStateChange = (event) => {
        this.setState({
            sampleGridDataState: event.dataState
        });
    }
    sampleDataStateChange = (event) => {
        switch (this.props.Login.activeSampleTab) {
            case "IDS_SAMPLEINFO":
                this.setState({
                    sampleGridDataState: event.dataState
                });
                break;
            case "IDS_SAMPLEAPPROVALHISTORY":
                this.setState({
                    sampleHistoryDataState: event.dataState
                })
                break;
            case "IDS_PRINTHISTORY":
                this.setState({
                    samplePrintHistoryDataState: event.dataState
                })
                break;
            case "IDS_REPORTHISTORY":
                this.setState({
                    reportHistoryDataState: event.dataState
                })
                break;
            default:
                this.setState({
                    sampleGridDataState: event.dataState
                });
                break;
        }
    }
    onSaveClick = (saveType, formRef) => {
        const masterData = this.props.Login.masterData;
        let inputData = {}
        let inputParam = {}
        let ok = true;
        inputData["userinfo"] = this.props.Login.userInfo;
        if (this.props.Login.operation === 'enforce') {
            inputData["enforcestatus"] = {
                ngradecode: this.props.Login.masterData.GradeValue.value || -1,
                ntransactiontestcode: this.state.selectedRecord.ntransactiontestcode,
                ntransactionresultcode: this.state.selectedRecord.ntransactionresultcode,
                senforcestatuscomment: this.state.selectedRecord.senforcestatuscomment || "",
                selectedTestCode: this.props.Login.masterData.MJSelectedTest.map(test => test.ntransactiontestcode).join(",")
            }
            inputParam = {
                methodUrl: "EnforceStatus",
                classUrl: 'approval',
                inputData: inputData,
                postParam: { selectedObject: "MJSelectedTest", primaryKeyField: "ntransactiontestcode" },
                operation: "update"
            }
        }
        else if (this.props.Login.screenName === "IDS_SAMPLEATTACHMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                selectedRecord: this.state.selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation
            }
            inputParam = onSaveSampleAttachment(saveParam);
        }
        else {
            let approvalparameter = []
            if (this.state.selectedRecord.approvalParameterEdit) {
                Object.keys(this.state.selectedRecord.approvalParameterEdit).map((key) =>
                    approvalparameter.push(
                        {
                            ntransactionresultcode: key,
                            nreportmandatory: this.state.selectedRecord.approvalParameterEdit[key]
                        }
                    )
                )
                inputData["approvalparameter"] = approvalparameter
                inputParam = {
                    methodUrl: "ApprovalParameter",
                    classUrl: 'approval',
                    inputData: inputData,
                    postParam: { selectedObject: "MJSelectedTest", primaryKeyField: "ntransactiontestcode" },
                    operation: "update"
                }
            } else {
                ok = false;
                this.handleClose()
            }
        }
        if (ok) {
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: { inputParam, masterData },
                        openChildModal: true,
                        operation: this.props.Login.operation,
                        screenName: "IDS_ENFORCESTATUS",
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openChildModal");
            }
        }
    }
    handleClose = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal
        let selectedRecord = this.props.Login.selectedRecord;
        let templateData = this.props.Login.templateData;
        let operation = this.props.Login.operation;
        let openTemplateModal = this.props.Login.openTemplateModal;
        if (this.props.Login.loadEsign) {
            if (operation === "delete" || operation === "dynamic" || operation === 'reportgeneration' || this.props.Login.operation === 'decision') {
                loadEsign = false;
                openModal = false;
                openChildModal = false;
                selectedRecord = {};
                templateData = {};
                operation = undefined;
            }
            else {
                loadEsign = false;
            }
        }
        else {
            openTemplateModal = false;
            openModal = false;
            openChildModal = false;
            selectedRecord = {};
            templateData = {}
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, openChildModal, loadEsign, selectedRecord, templateData, selectedParamId: null, operation, openTemplateModal }
        }
        this.props.updateStore(updateInfo);
    }
    validateEsign = () => {
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
            screenData: this.props.Login.screenData,
            operation: this.props.Login.operation
        }
        if (this.props.Login.operation === 'dynamic' || this.props.Login.operation === 'reportgeneration' || this.props.Login.operation === 'decision') {
            this.props.validateEsignforApproval(inputParam, "openChildModal");
        } else {
            this.props.validateEsignCredential(inputParam, "openChildModal");
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
    getActiveTestURL() {
        let url = "approval/getapprovalparameter"
        switch (this.props.Login.activeTestTab) {
            case "IDS_RESULTS":
                url = "approval/getapprovalparameter"
                break;
            case "IDS_INSTRUMENT":
                url = "resultentrybysample/getResultUsedInstrument"
                break;
            case "IDS_MATERIAL":
                url = "resultentrybysample/getResultUsedMaterial"
                break;
            case "IDS_TASK":
                url = "resultentrybysample/getResultUsedTask"
                break;
            case "IDS_TESTATTACHMENTS":
                url = "attachment/getTestAttachment"
                break;
            case "IDS_TESTCOMMENTS":
                url = "comments/getTestComment"
                break;
            case "IDS_RESULTCHANGEHISTORY":
                url = "approval/getApprovalResultChangeHistory"
                break;
            case "IDS_TESTAPPROVALHISTORY":
                url = "approval/getApprovalHistory"
                break;

            default:
                url = "approval/getapprovalparameter"
                break;
        }
        return url;
    }
    onTemplateInputChange = (event, control) => {
        let selectedRecord = templateChangeHandler(1, this.state.selectedRecord, event, control)
        this.setState({ selectedRecord });
    }
    onTemplateComboChange = (comboData, control) => {
        let selectedRecord = templateChangeHandler(2, this.state.selectedRecord, comboData, control)
        this.setState({ selectedRecord });
    }
    onTemplateDateChange = (dateData, control) => {
        let selectedRecord = templateChangeHandler(3, this.state.selectedRecord, dateData, control)
        this.setState({ selectedRecord });
    }
    onCommentsSaveClick = (saveType, formRef, selectedRecord) => {
        const masterData = this.props.Login.masterData;
        let inputData = {}
        let inputParam = {}
        inputData["userinfo"] = this.props.Login.userInfo;
       

        if (this.props.Login.screenName === "IDS_SAMPLECOMMENTS") {
            let sampleList = [];
            if (this.props.Login.masterData.searchedSample !== undefined) {
                sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(this.state.skip, this.state.skip + this.state.take), "npreregno");
            } else {
                sampleList = this.props.Login.masterData.MJ_SAMPLE.slice(this.state.skip, this.state.skip + this.state.take);
            }
            let acceptList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.MJSelectedSample, "npreregno");

            let saveParam = {
                userInfo: this.props.Login.userInfo,
                isTestComment: this.props.isTestComment,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                npreregno: this.props.Login.masterData.MJSelectedSample ? this.props.Login.masterData.MJSelectedSample.map(x => x.npreregno).join(",") : "-1"
            }
            inputParam = onSaveSampleComments(saveParam, acceptList);
        }

        if (this.props.Login.screenName === "IDS_TESTCOMMENTS") {
            let { testskip, testtake } = this.state
            let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : [...this.props.Login.masterData.MJ_TEST];
            testList = testList.slice(testskip, testskip + testtake);
            let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.MJSelectedTest, "ntransactiontestcode");
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                isTestComment: this.props.isTestComment,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                ntransactiontestcode: this.props.Login.masterData.MJSelectedTest ? this.props.Login.masterData.MJSelectedTest.map(x => x.ntransactiontestcode).join(",") : "-1"
            }
            inputParam = onSaveTestComments(saveParam, selectedTestList);
        }

       
       // if (selectedTestList.length > 0) {

            
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

        //} else {
           // toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))
       // }
    }
    onAttachmentSaveClick = (saveType, formRef, selectedRecord) => {
        const masterData = this.props.Login.masterData;
        let inputData = {}
        let inputParam = {}
        let { testskip, testtake, skip, take } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : [...this.props.Login.masterData.MJ_TEST];
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.MJSelectedTest, "ntransactiontestcode");
        let sampleList = this.props.Login.masterData.searchedSample ? [...this.props.Login.masterData.searchedSample] : [...this.props.Login.masterData.MJ_SAMPLE];
        sampleList = sampleList.slice(skip, skip + take);
        let selectedSampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.MJSelectedSample, "npreregno");
        inputData["userinfo"] = this.props.Login.userInfo;
        let ok = true;
        if (this.props.Login.screenName === "IDS_SAMPLEATTACHMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                selectedMaster: this.props.selectedMaster,
                npreregno: this.props.Login.masterData.MJSelectedSample ? this.props.Login.masterData.MJSelectedSample.map(x => x.npreregno).join(",") : "-1"
            }
            if (selectedSampleList.length > 0) {
                inputParam = onSaveSampleAttachment(saveParam, selectedSampleList);
            }
            else {
                ok = false
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLE" }))
            }
        } else if (this.props.Login.screenName === "IDS_TESTATTACHMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                selectedMaster: this.props.selectedMaster,
                ntransactiontestcode: this.props.Login.masterData.MJSelectedTest ? this.props.Login.masterData.MJSelectedTest.map(x => x.ntransactiontestcode).join(",") : "-1"
            }
            if (selectedTestList.length > 0) {
                inputParam = onSaveTestAttachment(saveParam, selectedTestList);
            }
            else {
                ok = false
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLE" }))
            }
        }
        if (ok) {
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
    }

    generateCOAReport = (inputData, ncontrolCode) => {

        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            let inputParam = { reporparam: inputData }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openChildModal: true,
                    loadEsign: true,
                    screenData: { inputParam, masterData },
                    operation: "reportgeneration",
                    screenName: this.props.Login.screenName,
                }
            }
            this.props.updateStore(updateInfo);

        } else {

            this.props.generateCOAReport(inputData);

        }

    }
}

export default connect(mapStateToProps, {
    getMyJobsubSampleDetail, getMyJobTestDetail, getMJTestChildTabDetail, performAction, updateStore, viewAttachment, checkListRecord,
    updateDecision, getRegType, getRegSubType, getTestStatus,getSection, getMyJobsSample, getStatusCombo,
    validateEsignCredential, crudMaster, validateEsignforApproval, getAppConfigVersion, getAcceptTest, filterTransactionList,
    getMJSampleChildTabDetail, getAttachmentCombo, deleteAttachment, getCommentsCombo, previewSampleReport, 
    generateCOAReport, getEnforceCommentsHistory,reportGenerate
})(injectIntl(MyJobs))