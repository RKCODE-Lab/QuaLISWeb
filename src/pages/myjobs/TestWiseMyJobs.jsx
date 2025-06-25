import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { faBolt, faLink, faComments, faChevronRight, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Col, Row, Nav } from 'react-bootstrap';
import { ListWrapper } from '../../components/client-group.styles';
import { ProductList } from '../testmanagement/testmaster-styled';
import SplitterLayout from "react-splitter-layout";
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {
    getMyJobsubSampleDetailTestWise, getMyJobTestDetailTestWise, getMJTestChildTabDetailTestWise, performAction, updateStore, updateDecision,
    getRegTypeTestWise, getRegSubTypeTestWise, getTestStatusTestWise, getSectionTestWise, getFilterStatusTestWise, getDesignTemplateTestWise, getMyJobsSampleTestWise, getStatusCombo, validateEsignCredential,
    crudMaster, validateEsignforAccept, getAppConfigVersionTestWise, getAcceptTestTestWise, filterTransactionList, checkListRecord, generateCOAReport,
    getMJSampleChildTabDetailTestWise, getAttachmentCombo, viewAttachment, deleteAttachment, getCommentsCombo, previewSampleReport,
    getEnforceCommentsHistory, reportGenerate, getFilterStatusSectionTestWise,getmyjobsFilterDetails
} from '../../actions'
import { getControlMap, showEsign, sortData, constructOptionList, getSameRecordFromTwoArrays, convertDateValuetoString, rearrangeDateFormat } from '../../components/CommonScript';
import { toast } from 'react-toastify';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import TestWiseMyJobsFilter from './TestWiseMyJobsFilter'
import { designProperties, transactionStatus, SideBarSeqno } from '../../components/Enumeration';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import Attachments from '../attachmentscomments/attachments/Attachments';
import { onSaveTestAttachment } from '../attachmentscomments/attachments/AttachmentFunctions';
import Comments from '../attachmentscomments/comments/Comments';
import { onSaveTestComments } from '../attachmentscomments/comments/CommentFunctions';
import ScrollBar from 'react-perfect-scrollbar';
import CustomPopOver from '../../components/customPopover';
import { ContentPanel } from '../../components/App.styles';
import TestWiseMyJobsSampleInfoGrid from './TestWiseMyJobsSampleInfoGrid';
import TestWiseMyJobsSampleInfoView from './TestWiseMyJobsSampleInfoView';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import fullviewExpand from '../../assets/image/fullview-expand.svg';
import fullviewCollapse from '../../assets/image/fullview-collapse.svg';
import { checkBoxOperation } from '../../components/Enumeration';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import { ReactComponent as SaveIcon } from '../../assets/image/save_icon.svg';
import CustomPopover from '../../components/customPopover';
import ModalShow from '../../components/ModalShow';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class TestWiseMyJobs extends React.Component {
    constructor(props) {
        super(props)
        this.searchTestRef = React.createRef();
        this.formRef = React.createRef();
        this.state = {
            sampleGridDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            testAttachmentDataState: {},
            testCommentDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            dataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
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
            DynamicDesignMappingList: [],
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],
            testskip: 0,
            testtake: this.props.Login.settings && this.props.Login.settings[3],
            splitChangeWidthPercentage: 22,
            subSampleSkip: 0,
            subSampleTake: 5,
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


    sideNavDetail = (screenName) => {
        let { testskip, testtake } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : this.props.Login.masterData.MJ_TEST || [];
        const editTestCommentsId = this.state.controlMap.has("EditTestComment") && this.state.controlMap.get("EditTestComment").ncontrolcode;
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.MJSelectedTest, "ntransactiontestcode");
        let ntransactiontestcode = this.props.Login.masterData.MJSelectedTest ? this.props.Login.masterData.MJSelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";

        return (
            screenName === "IDS_TESTATTACHMENTS" ?
                <Attachments
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
                    nsubsampleneed={this.props.Login.masterData["RegSubTypeValue"]}
                    subFields={[{ [designProperties.VALUE]: "stestsynonym" }, { [designProperties.VALUE]: "dcreateddate" }]}
                    masterData={this.props.Login.masterData}
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
                />
                :
                screenName === "IDS_TESTCOMMENTS" ?
                    <Comments
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
                    />
                    : ""
        )
    }


    changePropertyViewClose = (id) => {

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                activeTabIndex: undefined,
                activeTestTab: undefined,
            }
        }
        this.props.updateStore(updateInfo);
    }

    changePropertyView = (index, screenName, event, status) => {

        let id = false;
        if (event && event.ntransactiontestcode) {
            id = event.ntransactiontestcode
        } else if (event && event.ntransactionsamplecode) {
            id = event.ntransactionsamplecode
        } else if (event && event.npreregno) {
            id = event.npreregno
        }

        let activeTabIndex
        if (window.innerWidth > 992 && event && this.state.enableAutoClick || !event) {
            activeTabIndex = this.state.activeTabIndex !== index ? index : id ? index : false;
        }
        if (status !== "click") {
            if (index) {
                const tabProps = {
                    tabSequence: SideBarSeqno.TEST,
                    screenName: screenName === "IDS_COMMENTS" ? "IDS_TESTCOMMENTS" : screenName === "IDS_ATTACHMENTS" ? "IDS_TESTATTACHMENTS" : screenName,
                    activeTabIndex
                }
                this.onTabChange(tabProps);
            }
        }
    }


    onTabChange = (tabProps) => {
        const activeTestTab = tabProps.screenName;
        const tabseqno = tabProps.tabSequence;

        if (tabseqno === SideBarSeqno.TEST) {
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
                    activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex,
                    testAttachmentDataState: this.state.testAttachmentDataState,
                    testCommentDataState: this.state.testCommentDataState,
                }
                this.props.getMJTestChildTabDetailTestWise(inputData, true)
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))
            }
        }
    }
    onInputSwitchOnChange = (event) => {
        if (event.target.name === "PopupNav") {
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

    render() {
        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)

        const filterTestParam = {
            inputListName: "MJ_TEST",
            selectedObject: "MJSelectedTest",
            primaryKeyField: "ntransactiontestcode",
            fetchUrl: this.getActiveTestURL(),
            testskip: 0,
            testtake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,

            fecthInputObject: {
                ntransactiontestcode: this.props.Login.masterData.MJSelectedTest ? this.props.Login.masterData.MJSelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
                userinfo: this.props.Login.userInfo,
                //  checkBoxOperation: 3,
                checkBoxOperation: checkBoxOperation.SINGLESELECT,
                ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1
            },
            isSingleSelect: false,
            masterData: this.props.Login.masterData,
            searchFieldList: ["sarno", "ssamplearno", "stestsynonym", "dtransactiondate", "smethodname", "ssectionname", "ssourcename", "stransdisplaystatus", "sinstrumentcatname", "stestname"],
            changeList: ["RegistrationTestAttachment", "RegistrationTestComment", "MJSelectedTest"]
        };
        let AP_TestList = this.props.Login.masterData.MJ_TEST ? sortData(this.props.Login.masterData.MJ_TEST, 'descending', 'ntransactiontestcode') : [];
        let actionStatus = this.props.Login.masterData.actionStatus ? sortData(this.props.Login.masterData.actionStatus, 'ascending', 'ncontrolcode') : [];

        let testGetParam = {
            masterData: this.props.Login.masterData,
            ntransactionstatus: String(this.props.Login.masterData.realFilterStatusValue ? this.props.Login.masterData.realFilterStatusValue.ntransactionstatus : this.props.Login.masterData.FilterStatusValue ? this.props.Login.masterData.FilterStatusValue.ntransactionstatus : -1),
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            npreregno: this.props.Login.masterData.MJSelectedSample && this.props.Login.masterData.MJSelectedSample.map(sample => sample.npreregno).join(","),
            napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode : -1,
            nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.realUserSectionValue.nsectioncode) : null,
            ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode : -1,
            ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode || -1,
            dfrom: obj.fromDate,
            dto: obj.toDate,
            activeTestTab: this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS",
            // activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEINFO",
            screenName: this.props.Login.screenName,
            searchTestRef: this.searchTestRef,
            postParamList: this.postParamList,
            // ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1
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
            activeTestTab: this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS",
            screenName: this.props.Login.screenName,
            postParamList: this.postParamList,
            testskip: this.state.testskip,
            testtake: this.state.testtake,
            testAttachmentDataState: this.state.testAttachmentDataState,
            testCommentDataState: this.state.testCommentDataState,
            ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1,
            // activeTabIndex: this.state.enableAutoClick ? 1 : this.state.activeTabIndex ? this.state.activeTabIndex : undefined
            activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex === undefined ? 1 : this.state.enableAutoClick && this.state.activeTabIndex === 0 ? 1 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
        };
        let breadCrumbData = [];
        //if(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow){
        breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": obj.breadCrumbFrom
            },
            {
                "label": "IDS_TO",
                "value": obj.breadCrumbto
            },
            // {
            //     "label": "IDS_SAMPLETYPE",
            //     "value": this.props.Login.masterData.realSampleTypeValue ? this.props.Login.masterData.realSampleTypeValue.ssampletypename || "NA" :
            //         this.props.Login.masterData.SampleTypeValue ? this.props.Login.masterData.SampleTypeValue.ssampletypename || "NA" : "NA"
            // },
            {
                "label": "IDS_REGTYPE",
                "value": this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.sregtypename || "NA" :
                    this.props.Login.masterData.RegTypeValue ? this.props.Login.masterData.RegTypeValue.sregtypename || "NA" : "NA"
            },
            {
                "label": "IDS_REGSUBTYPE",
                "value": this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.sregsubtypename || "NA" :
                    this.props.Login.masterData.RegSubTypeValue ?
                        this.props.Login.masterData.RegSubTypeValue.sregsubtypename : "NA"
            },
            {
                "label": "IDS_TESTSTATUS",
                "value": this.props.Login.masterData.realFilterStatusValue ?
                    this.props.Login.masterData.realFilterStatusValue.stransdisplaystatus || "NA" :
                    this.props.Login.masterData.FilterStatusValue ?
                        this.props.Login.masterData.FilterStatusValue.stransdisplaystatus || "NA" : "NA"
            },
            // {
            //     "label": "IDS_DESIGNTEMPLATE",
            //     "value": this.props.Login.masterData.realDesignTemplateMappingValue ? this.props.Login.masterData.realDesignTemplateMappingValue.sregtemplatename || "NA" :
            //              this.props.Login.masterData.realDesignTemplateMappingValue ?
            //              this.props.Login.masterData.DesignTemplateMappingValue.sregtemplatename : "NA"

            // },
            //  {
            //     "label": "IDS_CONFIGVERSION",
            //     "value": this.props.Login.masterData.realApprovalVersionValue ?
            //         this.props.Login.masterData.realApprovalVersionValue.sversionname || "NA" :
            //         this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.sversionname || "NA" : "NA"
            // },
            {
                "label": "IDS_SECTION",
                "value": this.props.Login.masterData.realUserSectionValue ?
                    this.props.Login.masterData.realUserSectionValue.ssectionname || "NA" :
                    this.props.Login.masterData.UserSectionValue ?
                        this.props.Login.masterData.UserSectionValue.ssectionname || "NA" : "NA"
            },
            {
                "label": "IDS_TEST",
                "value": this.props.Login.masterData.realTestValue ?
                    this.props.Login.masterData.realTestValue.stestsynonym || "NA" :
                    this.props.Login.masterData.TestValue ?
                        this.props.Login.masterData.TestValue.stestsynonym || "NA" : "NA"
            },

        ];
        //}else{
        //  breadCrumbData = [
        //     { 
        //         "label": "IDS_FROM",
        //         "value": obj.breadCrumbFrom
        //     }, {
        //         "label": "IDS_TO",
        //         "value": obj.breadCrumbto
        //     },
        //     {
        //         "label": "IDS_SAMPLETYPE",
        //         "value": this.props.Login.masterData.realSampleTypeValue ? this.props.Login.masterData.realSampleTypeValue.ssampletypename || "NA" :
        //             this.props.Login.masterData.SampleTypeValue ? this.props.Login.masterData.SampleTypeValue.ssampletypename || "NA" : "NA"
        //     }, {
        //         "label": "IDS_REGTYPE",
        //         "value": this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.sregtypename || "NA" :
        //             this.props.Login.masterData.RegTypeValue ? this.props.Login.masterData.RegTypeValue.sregtypename || "NA" : "NA"
        //     }, {
        //         "label": "IDS_REGSUBTYPE",
        //         "value": this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.sregsubtypename || "NA" :
        //             this.props.Login.masterData.RegSubTypeValue ?
        //                 this.props.Login.masterData.RegSubTypeValue.sregsubtypename : "NA"
        //     },
        //     {
        //         "label": "IDS_CONFIGVERSION",
        //         "value": this.props.Login.masterData.realApprovalVersionValue ?
        //             this.props.Login.masterData.realApprovalVersionValue.sversionname || "NA" :
        //             this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.sversionname || "NA" : "NA"
        //     },
        //     {
        //         "label": "IDS_SECTION",
        //         "value": this.props.Login.masterData.realUserSectionValue ?
        //             this.props.Login.masterData.realUserSectionValue.ssectionname || "NA" :
        //             this.props.Login.masterData.UserSectionValue ?
        //                 this.props.Login.masterData.UserSectionValue.ssectionname || "NA" : "NA"
        //     },
        //     {
        //         "label": "IDS_TEST",
        //         "value": this.props.Login.masterData.realTestValue ?
        //             this.props.Login.masterData.realTestValue.stestsynonym || "NA" :
        //             this.props.Login.masterData.TestValue ?
        //                 this.props.Login.masterData.TestValue.stestsynonym || "NA" : "NA"
        //     },
        //     {
        //         "label": "IDS_FILTERSTATUS",
        //         "value": this.props.Login.masterData.realFilterStatusValue ?
        //             this.props.Login.masterData.realFilterStatusValue.stransdisplaystatus || "NA" :
        //             this.props.Login.masterData.FilterStatusValue ?
        //             this.props.Login.masterData.FilterStatusValue.stransdisplaystatus || "NA" : "NA"
        //     }
        // ];
        //}



        //const TestAcceptActionId = this.state.controlMap.has("Accept") && this.state.controlMap.get("Accept").ncontrolcode;
        const TestMyJobActionId = this.state.controlMap.has("TestMyJobAction") && this.state.controlMap.get("TestMyJobAction").ncontrolcode;
        const filterNameId = this.state.controlMap.has("FilterName") ? this.state.controlMap.get("FilterName").ncontrolcode : -1;
        const filterDetailId = this.state.controlMap.has("FilterDetail") ? this.state.controlMap.get("FilterDetail").ncontrolcode : -1;

        const mandatoryFieldsFilter = [{ "mandatory": true, "idsName": "IDS_FILTERNAME", "dataField": "sfiltername", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]


        this.postParamList = [
            {

                filteredListName: "searchedTest",
                clearFilter: "no",
                searchRef: this.searchTestRef,
                primaryKeyField: "ntransactiontestcode",
                fetchUrl: this.getActiveTestURL(),
                fecthInputObject: testChildGetParam,
                selectedObject: "MJSelectedTest",
                inputListName: "MJ_TEST",
                updatedListname: "MJSelectedTest",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus",
                    "SampletypeList", "RegistrationTypeList", "RegistrationSubTypeList", "FilterStatusList", "UserSectionList", "TestList"]
            }]


        return (
            <>
                <ListWrapper className="client-listing-wrap new-breadcrumb toolbar-top-wrap mtop-4 screen-height-window">
                    <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                    <div className='fixed-buttons'>
                        <Nav.Link className="btn btn-circle outline-grey mr-2"
                            hidden={this.state.userRoleControlRights.indexOf(filterNameId) === -1}
                            data-tip={this.props.intl.formatMessage({ id: "IDS_SAVEFILTER" })}
                            //onClick={() => this.props.onWorklistApproveClick(this.props.Login.masterData, this.props.Login.userInfo, this.confirmMessage, approvalId)}
                            onClick={() => this.openFilterName(filterNameId)}
                        >   <SaveIcon width='20px' height='20px' className='custom_icons' /></Nav.Link>

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
                    <Row noGutters={"true"}>
                        <Col md={12} className='parent-port-height sticky_head_parent' ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            <ListWrapper className={`vertical-tab-top ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                <div className={` tab-left-area ${this.state.activeTabIndex ? 'active' : ""} ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                    <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={this.state.splitChangeWidthPercentage} onSecondaryPaneSizeChange={this.paneSizeChange} primaryMinSize={40} secondaryMinSize={20}>
                                        <TransactionListMasterJsonView
                                            splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                            needMultiSelect={true}
                                            masterList={this.props.Login.masterData.searchedTest || AP_TestList}
                                            selectedMaster={this.props.Login.masterData.MJSelectedTest}
                                            primaryKeyField="ntransactiontestcode"
                                            //getMasterDetail={this.props.getMJTestChildTabDetailTestWise}
                                            getMasterDetail={(event, status) => { this.props.getMJTestChildTabDetailTestWise(event, status); this.state.enableAutoClick && this.changePropertyView(1, "IDS_ATTACHMENTS", event, "click") }}
                                            inputParam={testChildGetParam}
                                            subFieldsLabel={true}
                                            additionalParam={['']}
                                            mainField={'stestsynonym'}
                                            selectionList={this.props.Login.masterData.realFilterStatusValue
                                                && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                                            selectionField="ntransactionstatus"
                                            selectionFieldName="stransdisplaystatus"
                                            selectionColorField="scolorhexcode"
                                            selectedListName="MJSelectedTest"
                                            objectName="test"
                                            listName="IDS_TEST"
                                            filterColumnData={this.props.filterTransactionList}
                                            searchListName="searchedTest"
                                            needValidation={true}
                                            validationKey="napprovalversioncode"
                                            validationFailMsg="IDS_SELECTSAMPLESOFSAMPLEAPPROVALVERSION"
                                            showFilter={this.props.Login.showFilter}
                                            openFilter={this.openFilter}
                                            closeFilter={this.closeFilter}
                                            onFilterSubmit={this.onFilterSubmit}
                                            subFields={this.state.testListColumns}
                                            //  moreField={this.state.testMoreField}
                                            jsonDesignFields={true}
                                            jsonField={'jsondata'}
                                            showStatusLink={true}
                                            statusFieldName="stransdisplaystatus"
                                            statusField="ntransactionstatus"
                                            // statusColor="stranscolor"
                                            showStatusIcon={false}
                                            showStatusName={true}
                                            needFilter={true}
                                            searchRef={this.searchTestRef}
                                            filterParam={filterTestParam}
                                            skip={this.state.testskip}
                                            take={this.state.testtake}
                                            handlePageChange={this.handleTestPageChange}
                                            showStatusBlink={true}
                                            callCloseFunction={true}
                                            splitModeClass={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50 ? 'split-mode' : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}
                                            childTabsKey={["RegistrationTestAttachment", "RegistrationTestComment"]}
                                            commonActions={
                                                <>
                                                    <ProductList className="d-flex product-category float-right">
                                                        {/* <Nav.Link 
                                                        data-for="tooltip-common-wrap" 
                                                        data-tip={this.props.intl.formatMessage({ id: "IDS_ACCEPT" })} 
                                                        hidden={this.state.userRoleControlRights.indexOf(TestAcceptActionId) === -1} 
                                                        className="btn btn-icon-rounded btn-circle solid-blue ml-2" role="button"
                                                        onClick={() => this.props.getAcceptTestTestWise({testGetParam, MJSelectedTest: this.props.Login.masterData.MJSelectedTest,userInfo: this.props.Login.userInfo, ncontrolcode:TestAcceptActionId})}>
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </Nav.Link> */}


                                                        {this.props.Login.masterData.actionStatus &&
                                                            this.state.userRoleControlRights.indexOf(TestMyJobActionId) !== -1 &&
                                                            actionStatus.length > 0 ?
                                                            <CustomPopOver
                                                                icon={faBolt}
                                                                nav={true}
                                                                data={actionStatus}
                                                                btnClasses="btn-circle btn_grey ml-2 spacesremovefromaction"
                                                                //dynamicButton={(value) => this.props.getAcceptTestTestWise(value,testGetParam,this.props.Login.masterData.MJSelectedTest,this.props.Login.userInfo)}
                                                                dynamicButton={(value) => this.onAcceptTestWise(value, testGetParam, this.props.Login.masterData.MJSelectedTest, this.props.Login.userInfo)}
                                                                textKey="scontrolids"
                                                                iconKey="ncontrolcode"
                                                            >
                                                            </CustomPopOver>
                                                            : ""}

                                                        <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                            onClick={() => this.onReload()}
                                                            // data-for="tooltip-common-wrap"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                            <RefreshIcon className='custom_icons' />
                                                        </Button>
                                                    </ProductList>
                                                </>
                                            }
                                            filterComponent={[
                                                {
                                                    "Sample Filter": <TestWiseMyJobsFilter
                                                        SampleType={this.state.SampletypeList || []}
                                                        SampleTypeValue={this.props.Login.masterData.defaultSampleTypeValue || []}
                                                        RegType={this.state.RegistrationTypeList || []}
                                                        RegTypeValue={this.props.Login.masterData.defaultRegTypeValue || []}
                                                        RegSubType={this.state.RegistrationSubTypeList || []}
                                                        RegSubTypeValue={this.props.Login.masterData.defaultRegSubTypeValue || []}
                                                        ApprovalVersion={this.state.ConfigVersionList || []}
                                                        ApprovalVersionValue={this.props.Login.masterData.defaultApprovalVersionValue || []}
                                                        DynamicDesignMapping={this.state.DynamicDesignMappingList || []}
                                                        DesignTemplateMappingValue={this.props.Login.masterData.defaultDesignTemplateMappingValue || []}
                                                        UserSection={this.state.UserSectionList || []}
                                                        UserSectionValue={this.props.Login.masterData.defaultUserSectionValue || []}
                                                        JobStatus={this.props.Login.masterData.JobStatus || []}
                                                        Test={this.state.TestList || []}
                                                        TestValue={this.props.Login.masterData.defaultTestValue || []}
                                                        FilterStatus={this.state.FilterStatusList || []}
                                                        FilterStatusValue={this.props.Login.masterData.defaultFilterStatusValue || []}
                                                        fromDate={this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()}
                                                        toDate={this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()}
                                                        onFilterComboChange={this.onFilterComboChange}
                                                        handleDateChange={this.handleDateChange}
                                                        userInfo={this.props.Login.userInfo}

                                                    />
                                                }
                                            ]}

                                        />
                                        {/* <ScrollBar> */}
                                        {/* <SplitterLayout
                                    customClassName="detailed-inner no-height"
                                    vertical
                                    borderColor="#999"
                                    primaryIndex={1}
                                   // onSecondaryPaneSizeChange={this.verticalPaneSizeChange}
                                    secondaryInitialSize={window.outerHeight - 260}

                                    // secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                    // onSecondaryPaneSizeChange={this.paneSizeChange}
                                    // primaryMinSize={40}
                                    // secondaryMinSize={30}
                                > */}
                                        {/* <div> */}
                                        <ContentPanel cardHead={94}>
                                            <Card className="border-0">
                                                <Card.Body className='p-0'>
                                                    <Row>
                                                        <Col md={12}>
                                                            <Card className='p-0'>
                                                                <Card.Header style={{ borderBottom: "0px" }}>
                                                                    <span style={{ display: "inline-block", marginTop: "1%" }} >
                                                                        <h4 >{this.props.intl.formatMessage({ id: "IDS_SAMPLEINFO" })}</h4>
                                                                    </span>
                                                                </Card.Header>
                                                                <Card.Body>
                                                                    <ScrollBar>
                                                                        <div style={{ height: this.state.initialVerticalWidth }} className='myjobs-sample-info'>
                                                                            {this.props.Login.masterData.MJSelectedTest && this.myFunc(this.props.Login.masterData.MJSelectedTest) ?
                                                                                //&& this.props.Login.masterData.MJSelectedTest.length === 1 ?



                                                                                <TestWiseMyJobsSampleInfoView
                                                                                    data={(this.props.Login.masterData.MJSelectedTest && this.props.Login.masterData.MJSelectedTest.length > 0) ?
                                                                                        this.props.Login.masterData.MJSelectedTest[this.props.Login.masterData.MJSelectedTest.length - 1] : {}}
                                                                                    SingleItem={this.props.Login.masterData.MJSelectedTest && this.props.Login.masterData.MJSelectedTest ?
                                                                                        this.state.SingleItem : []}
                                                                                    screenName="IDS_SAMPLEINFO"
                                                                                    userInfo={this.props.Login.userInfo}
                                                                                />
                                                                                :
                                                                                <TestWiseMyJobsSampleInfoGrid
                                                                                    selectedSample={this.props.Login.masterData.MJSelectedTest}
                                                                                    userInfo={this.props.Login.userInfo || {}}
                                                                                    masterData={this.props.Login.masterData}
                                                                                    inputParam={this.props.Login.inputParam}
                                                                                    dataState={this.state.sampleGridDataState}
                                                                                    dataStateChange={this.sampleInfoDataStateChange}
                                                                                    extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem) || []}
                                                                                    detailedFieldList={this.gridfillingColumn(this.state.DynamicGridMoreField) || []}
                                                                                    primaryKeyField={"npreregno"}
                                                                                    expandField="expanded"
                                                                                    screenName="IDS_SAMPLEINFO"
                                                                                // jsonField={"jsondata"}
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
                                        {/* </div> */}
                                        {/* <div>
                                    <ScrollBar>
                                    <div style={{ height: "calc(110vh - " + (+this.state.initialVerticalWidth + 100) + "px)" }}>
                                        {this.state.showTest ?
                                            <Card>
                                                <CustomTabs paneHeight={this.state.tabPane} activeKey={this.props.Login.activeTestTab || "IDS_RESULTS"}
                                                            tabDetail={this.testTabDetail()} onTabChange={this.onTestTabChange} />
                                            </Card>
                                        : ""}
                                        </div>
                                    </ScrollBar>
                                    </div> */}
                                        {/* </SplitterLayout>
                             </ScrollBar>  */}
                                    </SplitterLayout>
                                </div>
                                <div className={`${this.state.enablePropertyPopup ? 'active-popup' : ""} vertical-tab ${this.state.activeTabIndex ? 'active' : ""}`} >
                                    <div className={`${this.state.enablePropertyPopup ? 'active-popup' : ""} vertical-tab-content pager_wrap wrap-class ${this.state.activeTabIndex ? 'active' : ""}`} style={{ width: this.state.enablePropertyPopup ? this.state.propertyPopupWidth + '%' : "" }}>
                                        <span className={` vertical-tab-close ${this.state.activeTabIndex ? 'active' : ""}`} onClick={() => this.changePropertyViewClose(false)}><FontAwesomeIcon icon={faChevronRight} /> </span>

                                        <div className={` vertical-tab-content-attachment position-relative  ${this.state.activeTabIndex && this.state.activeTabIndex === 1 ? 'active' : ""}`}><Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                            {!this.state.enablePropertyPopup ?
                                                <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                            }
                                        </Nav.Link>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_TESTATTACHMENTS" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 1 ? this.sideNavDetail("IDS_TESTATTACHMENTS") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-comments position-relative ${this.state.activeTabIndex && this.state.activeTabIndex === 2 ? 'active' : ""}`}><Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                            {!this.state.enablePropertyPopup ?
                                                <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                            }
                                        </Nav.Link>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_TESTCOMMENTS" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 2 ? this.sideNavDetail("IDS_TESTCOMMENTS") : ""}
                                        </div>

                                    </div>
                                    <div className='tab-head'>

                                        <ul>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 1 ? 'active' : ""}`} onClick={() => this.changePropertyView(1, "IDS_ATTACHMENTS")}>
                                                <FontAwesomeIcon icon={faLink} className={"fa-beat"} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_ATTACHMENTS" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 2 ? 'active' : ""}`} onClick={() => this.changePropertyView(2, "IDS_COMMENTS")}>
                                                <FontAwesomeIcon icon={faComments} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                                                </span>
                                            </li>
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

                {this.state.showConfirmAlert ? this.confirmAlert() : ""}

                {this.props.Login.modalShow ? ( //ALPD-4912-To show the add popup to get input of filter name,done by Dhanushya RI
                    <ModalShow
                        modalShow={this.props.Login.modalShow}
                        closeModal={this.closeModal}
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
    componentWillUnmount() {
        //let activeTabIndex=this.props.Login.activeTabIndex
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                activeTabIndex: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }

    closeFilter = () => {
        //let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
        let inputValues = {
            fromDate: this.props.Login.masterData.realFromDate || new Date(),
            toDate: this.props.Login.masterData.realToDate || new Date(),
            RegTypeValue: this.props.Login.masterData.realRegTypeValue || {},
            RegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue || {},
            FilterStatusValue: this.props.Login.masterData.realFilterStatusValue || {},
            ApprovalConfigVersionValue: this.props.Login.masterData.realApprovalVersionValue || {},
            DesignTemplateMappingValue: this.props.Login.masterData.realDesignTemplateMappingValue || {},
            FromDate: this.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.fromDate) : new Date(),
            ToDate: this.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.toDate) : new Date(),
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
            FilterStatus: this.props.Login.masterData.realFilterStatusList || [],
            UserSection: this.props.Login.masterData.realUserSectionList || [],
            Test: this.props.Login.masterData.realTestList || [],
            DynamicDesignMapping: this.props.Login.masterData.realDynamicDesignMappingList || [],

            SampleTypeValue: this.props.Login.masterData.realSampleTypeValue || {},
            ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,

        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false, masterData: { ...this.props.Login.masterData, ...inputValues } }
        }
        this.props.updateStore(updateInfo);
    }
    componentDidUpdate(previousProps) {
        let { userRoleControlRights, controlMap,
            testListColumns, SingleItem,
            testListMainField,
            SampleGridItem, SampleGridExpandableItem, testMoreField,
            testAttachmentDataState, testCommentDataState,
            selectedRecord, SampletypeList, RegistrationTypeList,
            RegistrationSubTypeList, FilterStatusList,
            ConfigVersionList, UserSectionList, TestList, DynamicDesignMappingList, testskip, testtake, selectedFilter,
            DynamicTestColumns, DynamicGridItem,
            DynamicGridMoreField, activeTabIndex } = this.state;
        let bool = false;

        if (this.props.Login.activeTabIndex !== previousProps.Login.activeTabIndex) {
            activeTabIndex = this.props.Login.activeTabIndex;
            bool = true;
        }

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

                bool = true;
            }
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {

            selectedRecord = this.props.Login.selectedRecord
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
            testskip = this.props.Login.testskip === undefined ? testskip : this.props.Login.testskip
            testtake = this.state.testtake
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

        }

        if (this.props.Login.masterData.DynamicDesign && this.props.Login.masterData.DynamicDesign !== previousProps.Login.masterData.DynamicDesign) {
            const dynamicColumn = JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata.value)

            DynamicTestColumns = dynamicColumn.testlistitem ? dynamicColumn.testlistitem : [];

            DynamicGridItem = dynamicColumn.samplegriditem ? dynamicColumn.samplegriditem : [];
            DynamicGridMoreField = dynamicColumn.samplegridmoreitem ? dynamicColumn.samplegridmoreitem : [];

            SingleItem = dynamicColumn.sampledisplayfields ? dynamicColumn.sampledisplayfields : [];
            testMoreField = dynamicColumn.testListFields.testlistmoreitems ? dynamicColumn.testListFields.testlistmoreitems : [];
            testListColumns = dynamicColumn.testListFields.testlistitem ? dynamicColumn.testListFields.testlistitem : [];
            bool = true;

            let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
            selectedRecord['fromDate'] = obj.fromDate;
            selectedRecord['toDate'] = obj.toDate;

            bool = true;
        }
        if (bool) {
            bool = false;
            this.setState({
                userRoleControlRights, controlMap,
                testListColumns, SingleItem,
                testListMainField,
                SampleGridItem, SampleGridExpandableItem, testMoreField,
                testAttachmentDataState, testCommentDataState,
                selectedRecord, SampletypeList, RegistrationTypeList,
                RegistrationSubTypeList, FilterStatusList,
                ConfigVersionList, UserSectionList, TestList, DynamicDesignMappingList,
                testskip, testtake, selectedFilter,
                DynamicTestColumns, DynamicGridItem,
                DynamicGridMoreField, activeTabIndex
            });
        }
    }


    handleTestPageChange = e => {
        this.setState({
            testskip: e.skip,
            testtake: e.take
        });
    };

    gridfillingColumn(data) {
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

    myFunc(selectedmaster) {
        if (selectedmaster.length > 0) {
            var x = selectedmaster[0]["npreregno"];
            return selectedmaster.every(function (item) {
                return item["npreregno"] === x;
            });
        }
    }

    clickFilterDetail = (value) => {
        //  if(this.props.Login.nfilternamecode!==value.nfilternamecode){
        //this.searchRef.current.value = "";
        this.props.Login.change = false
        let masterData = this.props.Login.masterData
        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
    
        let inputData = {
          userinfo: this.props.Login.userInfo,
          FromDate: obj.fromDate,
          ToDate: obj.toDate,
          nfilternamecode: value && value.nfilternamecode ? value.nfilternamecode : -1,
          npreregno: "0",
          sampletypecode: (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode) || -1,
          regtypecode: parseInt(this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
          regsubtypecode: parseInt(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
          approvalconfigurationcode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
          napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) : -1,
          userinfo: this.props.Login.userInfo,
          ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
          ntranscode: this.props.Login.masterData.realFilterStatusValue
          && (this.props.Login.masterData.realFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.realFilterStatusValue.ntransactionstatus : this.props.Login.masterData.realFilterStatusValue.ntransactionstatus),
        }
        const inputParam = {
          masterData, inputData
    
        }
        this.props.getmyjobsFilterDetails(inputParam);
        // }
        // else{
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDFILTERALREADYLOADED" }));  
        // }
      }
    
      //ALPD-4878 To open the save popup of filtername,done by Dhanushya RI
      openFilterName = () => {
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: { modalShow: true, operation: "create", isFilterDetail: true, modalTitle: this.props.intl.formatMessage({ id: "IDS_SAVEFILTER" }) }
        }
        this.props.updateStore(updateInfo);
      }
    
      onSaveModalFilterName = () => {
        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
    
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
          npreregno: "0",
          nsampletypecode: (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode) || -1,
          nregtypecode: parseInt(this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
          nregsubtypecode: parseInt(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
          ntranscode: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,          napprovalconfigcode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
          napproveconfversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode : -1,
          userinfo: this.props.Login.userInfo,
          ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
          //needExtraKeys: true,
        }
    
        let inputParam = {
          classUrl: this.props.Login.inputParam.classUrl,
          methodUrl: "FilterName",
          inputData: inputData,
          operation: this.props.Login.operation,
        };
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
          && inputData.ntranscode !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napproveconfversioncode !== "-1"
          ) {
    
          this.props.crudMaster(inputParam, masterData, "modalShow");
    
    
        } else {
          toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }
      }
    



    testTabDetail = () => {
        const testTabMap = new Map();
        let { testskip, testtake } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : this.props.Login.masterData.MJ_TEST || [];
        const editTestCommentsId = this.state.controlMap.has("EditTestComment") && this.state.controlMap.get("EditTestComment").ncontrolcode;
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.MJSelectedTest, "ntransactiontestcode");
        let ntransactiontestcode = this.props.Login.masterData.MJSelectedTest ? this.props.Login.masterData.MJSelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        if (this.state.showTest) {



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
                nsubsampleneed={this.props.Login.masterData["RegSubTypeValue"]}
                subFields={[{ [designProperties.VALUE]: "stestsynonym" }, { [designProperties.VALUE]: "dcreateddate" }]}
                masterData={this.props.Login.masterData}
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







        }

        return testTabMap;
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
                    testAttachmentDataState: this.state.testAttachmentDataState,
                    testCommentDataState: this.state.testCommentDataState,
                }
                this.props.getMJTestChildTabDetailTestWise(inputData, true)
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))
            }
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
                    this.props.getRegTypeTestWise(inputParamData)
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
                    this.props.getRegSubTypeTestWise(inputParamData)
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
                    this.props.getAppConfigVersionTestWise(inputParamData)
                }
            }

            else if (fieldName === 'napprovalconfigversioncode') {
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
                        //nsectioncode: this.props.Login.masterData.defaultUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") : this.props.Login.masterData.defaultUserSectionValue.nsectioncode,
                    }

                    //this.props.getFilterStatusSectionTestWise(inputParamData)
                    this.props.getDesignTemplateTestWise(inputParamData)

                }
            }
            else if (fieldName === 'nsectioncode') {
                if (comboData.value !== this.props.Login.masterData.defaultUserSectionValue.nsectioncode) {
                    inputParamData = {
                        nflag: 6,
                        fromdate: obj.fromDate,
                        todate: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.defaultRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.defaultRegSubTypeValue.nregsubtypecode,
                        napprovalconfigversioncode: this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode,
                        nsectioncode: comboData.value === 0 ? this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") : comboData.value.toString(),
                        userinfo: this.props.Login.userInfo,
                        masterData: { ...this.props.Login.masterData, defaultUserSectionValue: comboData.item },
                        ndesigntemplatemappingcode: this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode,

                        RegSubTypeValue: this.props.Login.masterData.defaultRegSubTypeValue,
                        //ntransactionstatus: JSON.stringify(this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus),
                        ntransactionstatus: this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus.toString(),
                    }

                    this.props.getSectionTestWise(inputParamData);
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
                        //nsectioncode:this.props.Login.masterData.realUserSectionValue.nsectioncode,
                        userinfo: this.props.Login.userInfo,
                        masterData: { ...this.props.Login.masterData, defaultFilterStatusValue: comboData.item },
                        RegSubTypeValue: this.props.Login.masterData.defaultRegSubTypeValue,
                        ntransactionstatus: comboData.value === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : comboData.value.toString()

                    }

                    this.props.getFilterStatusTestWise(inputParamData);
                }
            }
            else if (fieldName === 'ntestcode') {
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
            }
            else {
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

                    this.props.getTestStatusTestWise(inputParamData);
                }
            }
        }
    }


    handleDateChange = (dateName, dateValue) => {
        if (dateValue === null) {
            dateValue = new Date();
        }
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
                nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                nneedtemplatebasedflow: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow,
                fromdate: String(fromdate),
                todate: String(todate),
                userinfo: this.props.Login.userInfo,
                realDesignTemplateMappingValue: this.props.Login.masterData.realDesignTemplateMappingValue,
                realDynamicDesignMappingList: this.props.Login.masterData.realDynamicDesignMappingList
            },
            masterData: this.props.Login.masterData

        }
        this.props.getAppConfigVersionTestWise(inputParam)
    }

    onReload = () => {
        let defaultSampleTypeValue = this.props.Login.masterData.realSampleTypeValue;
        let defaultRegTypeValue = this.props.Login.masterData.realRegTypeValue;
        let defaultRegSubTypeValue = this.props.Login.masterData.realRegSubTypeValue;
        let defaultFilterStatusValue = this.props.Login.masterData.realFilterStatusValue;
        let defaultApprovalVersionValue = this.props.Login.masterData.realApprovalVersionValue;
        let defaultUserSectionValue = this.props.Login.masterData.realUserSectionValue;
        let defaultTestValue = this.props.Login.masterData.realTestValue;
        let defaultDesignTemplateMappingValue = this.props.Login.masterData.realDesignTemplateMappingValue;

        let { realFromDate, realToDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue,
            realFilterStatusValue, realApprovalVersionValue, realUserSectionValue, realTestValue, realDesignTemplateMappingValue } = this.props.Login.masterData
        let masterData = {
            ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue, realUserSectionValue, realTestValue, realDesignTemplateMappingValue,
            defaultSampleTypeValue, defaultRegTypeValue, defaultRegSubTypeValue, defaultFilterStatusValue, defaultApprovalVersionValue, defaultUserSectionValue, defaultTestValue, defaultDesignTemplateMappingValue
        }
        let inputData = {
            nneedsubsample: (realRegSubTypeValue && realRegSubTypeValue.nneedsubsample) || false,
            nneedtemplatebasedflow: (realRegSubTypeValue && realRegSubTypeValue.nneedtemplatebasedflow) || false,
            nsampletypecode: (realSampleTypeValue && realSampleTypeValue.nsampletypecode) || -1,
            nregtypecode: (realRegTypeValue && realRegTypeValue.nregtypecode) || -1,
            nregsubtypecode: (realRegSubTypeValue && realRegSubTypeValue.nregsubtypecode) || -1,
            ntransactionstatus: String(realFilterStatusValue ? realFilterStatusValue.ntransactionstatus : -1),
            napprovalconfigcode: (realApprovalVersionValue && realApprovalVersionValue.napprovalconfigcode) || -1,
            napprovalversioncode: String(realApprovalVersionValue ? realApprovalVersionValue.napprovalconfigversioncode : 1),
            nsectioncode: realUserSectionValue ? realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(realUserSectionValue.nsectioncode) : null,
            ntestcode: realTestValue && realTestValue.ntestcode ? realTestValue.ntestcode : -1,
            ndesigntemplatemappingcode: (realDesignTemplateMappingValue && realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
            userinfo: this.props.Login.userInfo,
            showTest: true,
            activeTestTab: this.props.Login.activeTestTab || "",
            //checkBoxOperation:3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            ntype: 2
        }
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
            && inputData.ntransactionstatus !== -1 && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== -1
            && realUserSectionValue && realUserSectionValue.nsectioncode !== null && realTestValue && realTestValue.ntestcode !== -1) {

            let obj = convertDateValuetoString(realFromDate, realToDate, this.props.Login.userInfo)
            inputData['fromdate'] = obj.fromDate;
            inputData['todate'] = obj.toDate;
            let inputParam = {
                masterData,
                inputData,
                searchTestRef: this.searchTestRef,
                testskip: this.state.testskip,
                testtake: this.state.testtake,
                testAttachmentDataState: this.state.testAttachmentDataState,
                testCommentDataState: this.state.testCommentDataState,

            }
            this.props.getMyJobsSampleTestWise(inputParam)
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
        let realFilterStatusList = this.props.Login.masterData.FilterStatus
        let realUserSectionList = this.props.Login.masterData.UserSection
        let realTestList = this.props.Login.masterData.Test
        let realDynamicDesignMappingList = this.props.Login.masterData.DynamicDesignMapping
        let masterData = {
            ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue,
            realRegTypeValue, realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue, realUserSectionValue,
            realTestValue, realDesignTemplateMappingValue, realSampleTypeList, realDynamicDesignMappingList, realTestList, realUserSectionList,
            realFilterStatusList, realApprovalConfigVersionList, realRegistrationSubTypeList, realRegistrationTypeList
        }
        let inputData = {
            npreregno: "0",
            nsampletypecode: (this.props.Login.masterData.defaultSampleTypeValue && this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode) || -1,
            nregtypecode: parseInt(this.props.Login.masterData.defaultRegTypeValue && this.props.Login.masterData.defaultRegTypeValue.nregtypecode) || -1,
            nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue.nregsubtypecode) || -1,
            ntransactionstatus: ((this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus !== undefined) || this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus !== '0') ? String(this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus) : "-1",
            napprovalconfigcode: this.props.Login.masterData.defaultApprovalVersionValue ? this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigcode || -1 : null,
            napprovalversioncode: this.props.Login.masterData.defaultApprovalVersionValue && this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode) : null,
            nsectioncode: this.props.Login.masterData.defaultUserSectionValue ? this.props.Login.masterData.defaultUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.defaultUserSectionValue.nsectioncode) : null,
            ntestcode: this.props.Login.masterData.defaultTestValue ? this.props.Login.masterData.defaultTestValue.ntestcode : -1,
            nneedsubsample: (this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue.nneedsubsample) || -1,
            nneedtemplatebasedflow: (this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue.nneedtemplatebasedflow) || false,
            ndesigntemplatemappingcode: (this.props.Login.masterData.defaultDesignTemplateMappingValue && this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
            userinfo: this.props.Login.userInfo,
            activeTestTab: this.props.Login.activeTestTab,
            // checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            ntype: 2,
            saveFilterSubmit:true,
            sampleTypeValue:this.props.Login.masterData.defaultSampleTypeValue && this.props.Login.masterData.defaultSampleTypeValue,
            regTypeValue:this.props.Login.masterData.defaultRegTypeValue && this.props.Login.masterData.defaultRegTypeValue,
            regSubTypeValue:this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue,
            filterStatusValue:this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultFilterStatusValue,
            //ALPD-5521--Vignesh(19-03-2025)--My Jobs-->At first, alloted records are shown, however the filter test status is displaying for accepted
            //start
            approvalConfigValue:  this.props.Login.masterData && this.props.Login.masterData.defaultApprovalVersionValue,
            //end
            designTemplateMappingValue:(this.props.Login.masterData.defaultDesignTemplateMappingValue && this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
      
      
        }
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
            && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
            && realFilterStatusValue.stransdisplaystatus !== null && inputData.nsectioncode !== "undefined" && inputData.ntestcode !== undefined) {

            inputData['fromdate'] = obj.fromDate;
            inputData['todate'] = obj.toDate;
            let inputParam = {
                masterData,
                inputData,
                searchTestRef: this.searchTestRef,
                skip: this.state.skip,
                take: this.state.take,
                testskip: this.state.testskip,
                testtake: this.state.testtake,
                testAttachmentDataState: this.state.testAttachmentDataState,
                testCommentDataState: this.state.testCommentDataState

            }
            this.props.getMyJobsSampleTestWise(inputParam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }

    }

    onAcceptTestWise = (action, inputParam, MJSelectedTest, userInfo) => {
        // let inputData = {};
        let Map = {
            nflag: 3,
            ncheck: 1,
            nsampletypecode: inputParam.nsampletypecode,
            nregtypecode: inputParam.nregtypecode,
            nregsubtypecode: inputParam.nregsubtypecode,
            ntransactionstatus: inputParam.ntransactionstatus,
            napprovalversioncode: inputParam.napprovalversioncode,
            nsectioncode: inputParam.nsectioncode,
            ntestcode: inputParam.ntestcode,
            fromdate: inputParam.dfrom,
            todate: inputParam.dto,
            npreregno: MJSelectedTest ? MJSelectedTest.map(sample => sample.npreregno).join(",") : "",
            ntransactionsamplecode: MJSelectedTest ? MJSelectedTest.map(subsample => subsample.ntransactionsamplecode).join(",") : "",
            transactiontestcode: MJSelectedTest ? MJSelectedTest.map(test => test.ntransactiontestcode).join(",") : "",
            ntransactiontestcode: 0,
            //ndesigntemplatemappingcode:(this.props.Login.masterData.defaultDesignTemplateMappingValue && this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode)||-1,

            ncontrolcode: action.ncontrolcode,
            nneedsubsample: inputParam.masterData.nneedsubsample,
            nneedtemplatebasedflow: inputParam.masterData.nneedtemplatebasedflow,
            ndesigntemplatemappingcode: inputParam.ndesigntemplatemappingcode,
            // checkBoxOperation:3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            scontrolname: action.scontrolname,
            userinfo: userInfo,
            masterData: inputParam.masterData
        }
        inputParam = {
            inputData: Map,
            postParamList: this.postParamList,
            masterData: inputParam.masterData,
        }
        if (inputParam.inputData.transactiontestcode && inputParam.inputData.transactiontestcode.length > 0) {
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, action.ncontrolcode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true,
                        parentPopUpSize: 'lg',
                        screenName: this.props.Login.screenName,
                        operation: 'accept'
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.getAcceptTestTestWise(inputParam);
            }

        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))

        }


    }

    testDataStateChange = (event) => {

        switch (this.props.Login.activeTestTab) {
            case "IDS_TESTATTACHMENTS":
                this.setState({
                    testAttachmentDataState: event.dataState
                });
                break;
            case "IDS_TESTCOMMENTS":
                this.setState({
                    testCommentDataState: event.dataState
                });
                break;

            default:
                this.setState({
                    testAttachmentDataState: event.dataState
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
            default:
                this.setState({
                    sampleGridDataState: event.dataState
                });
                break;
        }
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        // let isOpen = this.props.Login.isOpen;
        let modalShow=this.props.Login.modalShow;

        let showReport = this.props.Login.showReport;
        if (this.props.Login.loadEsign) {
            loadEsign = false;
            openModal = false;
            modalShow=false;
            //isOpen = false;
            selectedRecord['esignpassword'] = "";
            selectedRecord['esigncomments'] = "";
            selectedRecord['esignreason'] = "";
        } else {
            selectedRecord = {};
            showReport = false;
            modalShow=false;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, showReport,modalShow }
        }
        this.props.updateStore(updateInfo);
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
            if (operation === "accept") {
                loadEsign = false;
                openModal = false;
                openChildModal = false;
                selectedRecord = {};
                templateData = {};
                operation = undefined;
                selectedRecord['esignpassword'] = "";
                selectedRecord['esigncomments'] = "";
                selectedRecord['esignreason'] = "";

            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = "";
                selectedRecord['esigncomments'] = "";
                selectedRecord['esignreason'] = "";
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
            screenData: this.props.Login.screenData,
            operation: this.props.Login.operation
        }
        if (this.props.Login.operation === 'accept') {
            this.props.validateEsignforAccept(inputParam, "openChildModal");
        } else {
            this.props.validateEsignCredential(inputParam, "openChildModal");
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

    onCommentsSaveClick = (saveType, formRef, selectedRecord) => {
        const masterData = this.props.Login.masterData;
        let inputData = {}
        let inputParam = {}
        inputData["userinfo"] = this.props.Login.userInfo;
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
    onAttachmentSaveClick = (saveType, formRef, selectedRecord) => {
        const masterData = this.props.Login.masterData;
        let inputData = {}
        let inputParam = {}
        let { testskip, testtake } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : [...this.props.Login.masterData.MJ_TEST];
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.MJSelectedTest, "ntransactiontestcode");
        inputData["userinfo"] = this.props.Login.userInfo;
        let ok = true;
        if (this.props.Login.screenName === "IDS_TESTATTACHMENTS") {
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

}

export default connect(mapStateToProps, {
    getMyJobsubSampleDetailTestWise, getMyJobTestDetailTestWise, getMJTestChildTabDetailTestWise, performAction, updateStore, viewAttachment, checkListRecord,
    updateDecision, getRegTypeTestWise, getRegSubTypeTestWise, getTestStatusTestWise, getSectionTestWise, getFilterStatusTestWise, getDesignTemplateTestWise, getMyJobsSampleTestWise, getStatusCombo,
    validateEsignCredential, crudMaster, validateEsignforAccept, getAppConfigVersionTestWise, getAcceptTestTestWise, filterTransactionList,
    getMJSampleChildTabDetailTestWise, getAttachmentCombo, deleteAttachment, getCommentsCombo, previewSampleReport,
    generateCOAReport, getEnforceCommentsHistory, reportGenerate, getFilterStatusSectionTestWise,getmyjobsFilterDetails
})(injectIntl(TestWiseMyJobs))