import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { faBolt, faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Col, Dropdown, Nav, Row, } from 'react-bootstrap';
import { ContentPanel } from '../../components/App.styles';
import { ListWrapper } from '../../components/client-group.styles';
import { ProductList } from '../testmanagement/testmaster-styled';
import SplitPane from "react-splitter-layout";
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {
    getsubSampleDetail, getTestDetail, getTestChildTabDetail, performAction, updateStore, updateDecision,
    getRegistrationType, getRegistrationSubType, getFilterStatus, getApprovalSample, getStatusCombo, validateEsignCredential,
    crudMaster, validateEsignforApproval, getApprovalVersion, getParameterEdit, filterTransactionList, checkListRecord,
    getSampleChildTabDetail, getAttachmentCombo, viewAttachment, deleteAttachment, getCommentsCombo
} from '../../actions'
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import ApprovalResultsTab from './ApprovalResultsTab';
import { getControlMap, validateTwoDigitDate, listDataFromDynamicArray, showEsign, filterStatusBasedOnTwoArrays, sortData } from '../../components/CommonScript';
import { toast } from 'react-toastify';
import TransactionListMaster from '../../components/TransactionListMaster';
import ApprovalFilter from './ApprovalFilter'
import { designProperties, transactionStatus } from '../../components/Enumeration';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import SampleInfoGrid from './SampleInfoGrid';
import SampleInfoView from './SampleInfoView';
import { getStatusIcon } from '../../components/StatusIcon';
import ApprovalInstrumentTab from './ApprovalInstrumentTab'
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import Esign from '../audittrail/Esign';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import EditApprovalParameter from './EditApprovalParameter';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ApprovalHistoryTab from './ApprovalHistoryTab';
import SampleApprovalHistory from './SampleApprovalHistory';
import ResultChangeHistoryTab from './ResultChangeHistoryTab';
import ApprovalTask from './ApprovalTask';
import { templateChangeHandler } from '../checklist/checklist/checklistMethods';
import TemplateForm from '../checklist/checklist/TemplateForm';
import Attachments from '../attachmentscomments/attachments/Attachments';
import { onSaveSampleAttachment, onSaveTestAttachment } from '../attachmentscomments/attachments/AttachmentFunctions';
import Comments from '../attachmentscomments/comments/Comments';
import { onSaveTestComments } from '../attachmentscomments/comments/CommentFunctions';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class Approval extends React.Component {
    constructor(props) {
        super(props)
        this.searchSampleRef = React.createRef();
        this.searchSubSampleRef = React.createRef();
        this.searchTestRef = React.createRef();
        this.formRef = React.createRef();
        this.state = {
            sampleGridDataState: { skip: 0, take: 5 },
            resultDataState: { skip: 0, take: 5, group: [{ field: 'ssamplearno' }] },
            instrumentDataState: { skip: 0, take: 5, group: [{ field: 'ssamplearno' }] },
            materialDataState: { skip: 0, take: 5, group: [{ field: 'ssamplearno' }] },
            taskDataState: { skip: 0, take: 5, group: [{ field: 'ssamplearno' }] },
            testCommentDataState: { skip: 0, take: 5, group: [{ field: 'ssamplearno' }] },
            documentDataState: { skip: 0, take: 5, group: [{ field: 'ssamplearno' }] },
            resultChangeDataState: { skip: 0, take: 5, group: [{ field: 'ssamplearno' }] },
            sampleHistoryDataState:{skip: 0, take: 5, group: [{ field: 'sarno' }]},
            historyDataState: { skip: 0, take: 5, group: [{ field: 'ssamplearno' }, { field: 'stestsynonym' }] },
            dataState: { skip: 0, take: 5 },
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
            testMoreField: []

        }
    }
    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "") {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }

        return null;
    }
    render() {
        let obj = this.covertDatetoString(this.props.Login.masterData.realFromDate || this.props.Login.masterData.fromDate || new Date(), this.props.Login.masterData.realToDate || this.props.Login.masterData.toDate || new Date())
        const filterSampleParam = {
            inputListName: "AP_SAMPLE",
            selectedObject: "selectedSample",
            primaryKeyField: "npreregno",
            fetchUrl: "approval/getApprovalSubSample",
            childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" }, { ref: this.searchTestRef, childFilteredListName: "searchedTests" }],
            fecthInputObject: {
                ntype: 2,
                nflag: 2,
                nsampletypecode: (this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue.nsampletypecode) || -1,
                nregtypecode: (this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode) || -1,
                nregsubtypecode: (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) || -1,
                ntransactionstatus: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== undefined ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) : "-1",
                napprovalconfigcode: this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigcode || -1 : null,
                napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode : null,
                nsectioncode: this.props.Login.masterData.UserSectionValue ? this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.UserSectionValue.nsectioncode) : null,
                dfrom: obj.fromDate,
                dto: obj.toDate,
                userinfo: this.props.Login.userInfo
            },
            masterData: this.props.Login.masterData,
            searchFieldList: ["sarno"],
            changeList: ["AP_SUBSAMPLE", "AP_TEST", "ApprovalParameter",
                "ApprovalResultChangeHistory", "ApprovalHistory", "ResultUsedInstrument",
                "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment",
                "RegistrationAttachment", "selectedSample", "selectedSubSample", "selectedTest"]
        };
        const filterSubSampleParam = {
            inputListName: "AP_SUBSAMPLE",
            selectedObject: "selectedSubSample",
            primaryKeyField: "ntransactionsamplecode",
            fetchUrl: "approval/getApprovalTest",
            childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedTests" }],
            fecthInputObject: {
                ntype: 3,
                nflag: 2,
                npreregno: this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join("',") : "-1",
                nsampletypecode: (this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue.nsampletypecode) || -1,
                nregtypecode: (this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode) || -1,
                nregsubtypecode: (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) || -1,
                ntransactionstatus: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== undefined ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) : "-1",
                napprovalconfigcode: this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigcode || -1 : null,
                napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode : null,
                nsectioncode: this.props.Login.masterData.UserSectionValue ? this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.UserSectionValue.nsectioncode) : null,
                dfrom: obj.fromDate,
                dto: obj.toDate,
                userinfo: this.props.Login.userInfo
            },
            masterData: this.props.Login.masterData,
            searchFieldList: ["sarno", "ssamplearno"],
            changeList: ["AP_TEST", "ApprovalParameter",
                "ApprovalResultChangeHistory", "ApprovalHistory", "ResultUsedInstrument",
                "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment",
                "RegistrationAttachment", "selectedSubSample", "selectedTest"]
        };

        const filterTestParam = {
            inputListName: "AP_TEST",
            selectedObject: "selectedTest",
            primaryKeyField: "ntransactiontestcode",
            fetchUrl: this.getActiveTestURL(),
            fecthInputObject: {
                ntransactiontestcode: this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
                userinfo: this.props.Login.userInfo
            },
            masterData: this.props.Login.masterData,
            searchFieldList: ["sarno", "ssamplearno", "stestsynonym"],
            changeList: ["ApprovalParameter",
                "ApprovalResultChangeHistory", "ApprovalHistory", "ResultUsedInstrument",
                "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment",
                "RegistrationAttachment", "selectedTest"]

        };
        let AP_SampleList = this.props.Login.masterData.AP_SAMPLE ? sortData(this.props.Login.masterData.AP_SAMPLE, 'descending', 'npreregno') : [];
        let AP_SubSampleList = this.props.Login.masterData.AP_SUBSAMPLE ? sortData(this.props.Login.masterData.AP_SUBSAMPLE, 'descending', 'ntransactionsamplecode') : [];
        let AP_TestList = this.props.Login.masterData.AP_TEST ? sortData(this.props.Login.masterData.AP_TEST, 'descending', 'ntransactiontestcode') : [];
        let subSampleGetParam = {
            masterData: this.props.Login.masterData,
            ntransactionstatus: String(this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus),
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            nsectioncode: this.props.Login.masterData.UserSectionValue ? this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.UserSectionValue.nsectioncode) : null,
            activeTestTab: this.props.Login.activeTestTab || "IDS_RESULTS",
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEINFO",
            screenName: this.props.Login.screenName,
            searchSubSampleRef: this.searchSubSampleRef,
            searchTestRef: this.searchTestRef
        };
        let testGetParam = {
            masterData: this.props.Login.masterData,
            ntransactionstatus: String(this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus),
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            npreregno: this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(","),
            nsectioncode: this.props.Login.masterData.UserSectionValue ? this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.UserSectionValue.nsectioncode) : null,
            activeTestTab: this.props.Login.activeTestTab || "IDS_RESULTS",
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEINFO",
            screenName: this.props.Login.screenName,
            searchTestRef: this.searchTestRef
        };
        let testChildGetParam = {
            masterData: this.props.Login.masterData,
            ntransactionstatus: String(this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus),
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            npreregno: this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(","),
            ntransactionsamplecode: this.props.Login.masterData.selectedSubSample && this.props.Login.masterData.selectedSubSample.map(sample => sample.ntransactionsamplecode).join(","),
            activeTestTab: this.props.Login.activeTestTab || "IDS_RESULTS",
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEINFO",
            screenName: this.props.Login.screenName,
            postParamList: this.postParamList
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
                "value": this.props.Login.masterData.realSampleTypeValue ?
                    this.props.intl.formatMessage({ id: this.props.Login.masterData.realSampleTypeValue.ssampletypename || "NA" }) :
                    this.props.Login.masterData.SampleTypeValue ?
                        this.props.intl.formatMessage({ id: this.props.Login.masterData.SampleTypeValue.ssampletypename || "NA" }) : "NA"
            }, {
                "label": "IDS_REGTYPE",
                "value": this.props.Login.masterData.realRegTypeValue ?
                    this.props.intl.formatMessage({ id: this.props.Login.masterData.realRegTypeValue.sregtypename || "NA" }) :
                    this.props.Login.masterData.RegTypeValue ?
                        this.props.intl.formatMessage({ id: this.props.Login.masterData.RegTypeValue.sregtypename || "NA" }) : "NA"
            }, {
                "label": "IDS_REGSUBTYPE",
                "value": this.props.Login.masterData.realRegSubTypeValue ?
                    this.props.intl.formatMessage({ id: this.props.Login.masterData.realRegSubTypeValue.sregsubtypename || "NA" }) :
                    this.props.Login.masterData.RegSubTypeValue ?
                        this.props.intl.formatMessage({ id: this.props.Login.masterData.RegSubTypeValue.sregsubtypename }) : "NA"
            }, {
                "label": "IDS_APPROVALCONFIGVERSION",
                "value": this.props.Login.masterData.realApprovalVersionValue ?
                    this.props.intl.formatMessage({ id: this.props.Login.masterData.realApprovalVersionValue.sversionname || "NA" }) :
                    this.props.Login.masterData.ApprovalVersionValue ?
                        this.props.intl.formatMessage({ id: this.props.Login.masterData.ApprovalVersionValue.sversionname || "NA" }) : "NA"
            },
            {
                "label": "IDS_FILTERSTATUS",
                "value": this.props.Login.masterData.realFilterStatusValue ?
                    this.props.intl.formatMessage({ id: this.props.Login.masterData.realFilterStatusValue.sfilterstatus || "NA" }) :
                    this.props.Login.masterData.FilterStatusValue ?
                        this.props.intl.formatMessage({ id: this.props.Login.masterData.FilterStatusValue.sfilterstatus || "NA" }) : "NA"
            }
        ];
        const editParamId = this.state.controlMap.has("EditReportMandatory") && this.state.controlMap.get("EditReportMandatory").ncontrolcode
        this.postParamList = [
            {
                filteredListName: "searchedSample",
                clearFilter: "no",
                searchRef: this.searchSampleRef,
                primaryKeyField: "npreregno",
                fetchUrl: "approval/getApprovalSubSample",
                fecthInputObject: subSampleGetParam,
                selectedObject: "selectedSample",
                inputListName: "AP_SAMPLE",
                updatedListname: "updatedSample",
                childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" }, { ref: this.searchTestRef, childFilteredListName: "searchedTests" }],
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            }, {
                filteredListName: "searchedSubSample",
                updatedListname: "updatedSubSample",
                clearFilter: "no",
                searchRef: this.searchSubSampleRef,
                primaryKeyField: "ntransactionsamplecode",
                fetchUrl: "approval/getApprovalTest",
                fecthInputObject: testGetParam,
                selectedObject: "selectedSubSample",
                childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedTests" }],
                inputListName: "AP_SUBSAMPLE",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            }, {
                filteredListName: "searchedTests",
                clearFilter: "no",
                searchRef: this.searchTestRef,
                primaryKeyField: "ntransactiontestcode",
                fetchUrl: this.getActiveTestURL(),
                fecthInputObject: testChildGetParam,
                selectedObject: "selectedTest",
                inputListName: "AP_TEST",
                updatedListname: "updatedTest",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            }]
        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                    <Row noGutters={true}>
                        <Col md={12} className="parent-port-height">
                            {/* <PerfectScrollbar> */}
                            <SplitPane className="1" vertical borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={45} >
                                <div>
                                    <SplitPane borderColor="#999" className="border-right" percentage={true} primaryIndex={1} secondaryInitialSize={25} >
                                        <PerfectScrollbar>
                                            <TransactionListMaster
                                                needMultiSelect={true}
                                                masterList={this.props.Login.masterData.searchedSample || AP_SampleList}
                                                selectedMaster={this.props.Login.masterData.selectedSample}
                                                primaryKeyField="npreregno"
                                                getMasterDetail={this.props.getsubSampleDetail}
                                                inputParam={subSampleGetParam}
                                                additionalParam={['napprovalversioncode']}
                                                mainField={this.state.sampleListMainField.length > 0 && this.state.sampleListMainField[0]['2']}
                                                selectedListName="selectedSample"
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
                                                subFields={this.state.sampleListColumns}
                                                showStatusLink={true}
                                                statusFieldName="sdecisionstatus"
                                                statusField="ndecisionstatus"
                                                needFilter={true}
                                                searchRef={this.searchSampleRef}
                                                filterParam={filterSampleParam}
                                                actionIcons={
                                                    [
                                                        {
                                                            title: "Report",
                                                            controlname: "reports",
                                                            objectName: "sample",
                                                            hidden: true,
                                                            inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }
                                                        }
                                                    ]
                                                }
                                                commonActions={
                                                    <ProductList className="d-flex product-category float-right">
                                                        {this.props.Login.masterData.decisionStatus &&
                                                            this.props.Login.masterData.decisionStatus.length > 0 ?
                                                            <Dropdown>
                                                                <Dropdown.Toggle className="btn-circle solid-blue ml-4">
                                                                    <FontAwesomeIcon icon={faBolt}></FontAwesomeIcon>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu className="dropdownborder" >
                                                                    {this.props.Login.masterData.decisionStatus &&
                                                                        this.props.Login.masterData.decisionStatus.map(action =>
                                                                            <Dropdown.Item onClick={() => this.updateDecision(action)}>
                                                                                <Nav.Link className='add-txt-btn blue-text ml-1' style={{ display: 'inline' }}>
                                                                                    {getStatusIcon(action.ntransactionstatus)}
                                                                                    <span className='ml-1 text-nowrap'>{action.sdecisionstatus}</span>
                                                                                </Nav.Link>
                                                                            </Dropdown.Item>
                                                                        )
                                                                    }
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                            : ""}
                                                    </ProductList>
                                                }
                                                filterComponent={[
                                                    {
                                                        "Sample Filter": <ApprovalFilter
                                                            SampleType={this.props.Login.masterData.SampleType || []}
                                                            SampleTypeValue={this.props.Login.masterData.SampleTypeValue || []}
                                                            RegType={this.props.Login.masterData.RegType || []}
                                                            RegTypeValue={this.props.Login.masterData.RegTypeValue || []}
                                                            RegSubType={this.props.Login.masterData.RegSubType || []}
                                                            RegSubTypeValue={this.props.Login.masterData.RegSubTypeValue || []}
                                                            ApprovalVersion={this.props.Login.masterData.ApprovalVersion || []}
                                                            ApprovalVersionValue={this.props.Login.masterData.ApprovalVersionValue || []}
                                                            UserSection={this.props.Login.masterData.UserSection || []}
                                                            UserSectionValue={this.props.Login.masterData.UserSectionValue || []}
                                                            JobStatus={this.props.Login.masterData.JobStatus || []}
                                                            JobStatusValue={this.props.Login.masterData.JobStatusValue || []}
                                                            FilterStatus={this.props.Login.masterData.FilterStatus || []}
                                                            FilterStatusValue={this.props.Login.masterData.FilterStatusValue || []}
                                                            fromDate={this.props.Login.masterData.fromDate ? new Date(this.props.Login.masterData.fromDate) : new Date()}
                                                            toDate={this.props.Login.masterData.toDate ? new Date(this.props.Login.masterData.toDate) : new Date()}
                                                            onFilterComboChange={this.onFilterComboChange}
                                                            handleDateChange={this.handleDateChange}
                                                            userInfo={this.props.Login.userInfo}
                                                        />
                                                    }
                                                ]}

                                            />
                                        </PerfectScrollbar>
                                        <div>
                                            <SplitPane className="3" borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={25} >
                                                {this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nsubsampleneed === transactionStatus.YES &&
                                                    <PerfectScrollbar>
                                                        <TransactionListMaster
                                                            masterList={this.props.Login.masterData.searchedSubSample || AP_SubSampleList}
                                                            needMultiSelect={true}
                                                            selectedMaster={this.props.Login.masterData.selectedSubSample}
                                                            primaryKeyField="ntransactionsamplecode"
                                                            getMasterDetail={this.props.getTestDetail}
                                                            inputParam={testGetParam}
                                                            additionalParam={[]}
                                                            mainField={this.state.subSampleListMainField.length > 0 && this.state.subSampleListMainField[0]['2']}
                                                            selectedListName="selectedSubSample"
                                                            objectName="subSample"
                                                            listName="IDS_SUBSAMPLE"
                                                            subFields={this.state.subSampleListColumns}
                                                            needValidation={false}
                                                            needFilter={false}
                                                            moreField={[]}
                                                            filterColumnData={this.props.filterTransactionList}
                                                            searchListName="searchedSubSample"
                                                            searchRef={this.searchSubSampleRef}
                                                            filterParam={filterSubSampleParam}
                                                        />
                                                    </PerfectScrollbar>
                                                }
                                                <div>
                                                    <SplitPane className="4" borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={25}>
                                                        <div>
                                                            <ContentPanel className={`panel-main-content front ${this.state.showTest === true ? 'show' : 'hide'} `}>
                                                                <PerfectScrollbar>
                                                                    <Card className="border-0">
                                                                        <Card.Body className='p-0'>
                                                                            {/* <Row className='no-gutters'>
                                                                                <Col md={12}> */}
                                                                            <Card>
                                                                                <Card.Header className="d-flex justify-content-between" style={{ borderBottom: "0px" }}>
                                                                                    <span>
                                                                                        <h4 >{this.props.intl.formatMessage({ id: "IDS_TEST" })}</h4>
                                                                                    </span>
                                                                                    <Button className="btn btn-primary"
                                                                                        onClick={() => this.showSampleInfo()}>
                                                                                        <FontAwesomeIcon icon={faEye} />{"  "}
                                                                                        {this.props.intl.formatMessage({ id: "IDS_SAMPLE" })}

                                                                                    </Button>
                                                                                </Card.Header>
                                                                                <Card.Body className="p-0">
                                                                                    {this.state.showTest ?
                                                                                        // <Row>
                                                                                        //     <Col md={12} >
                                                                                        <PerfectScrollbar>
                                                                                            <TransactionListMaster
                                                                                                needMultiSelect={true}
                                                                                                masterList={this.props.Login.masterData.searchedTests || AP_TestList}
                                                                                                selectedMaster={this.props.Login.masterData.selectedTest}
                                                                                                primaryKeyField="ntransactiontestcode"
                                                                                                getMasterDetail={this.props.getTestChildTabDetail}
                                                                                                inputParam={testChildGetParam}
                                                                                                additionalParam={[]}
                                                                                                mainField={this.state.testListMainField.length > 0 && this.state.testListMainField[0]['2']}
                                                                                                selectedListName="selectedTest"
                                                                                                objectName="test"
                                                                                                listName="IDS_TEST"
                                                                                                showStatusLink={true}
                                                                                                statusFieldName="stransdisplaystatus"
                                                                                                statusField="ntransactionstatus"
                                                                                                selectionField="ntransactionstatus"
                                                                                                selectionFieldName="sfilterstatus"
                                                                                                selectionList={this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus === transactionStatus.ALL ? filterStatusBasedOnTwoArrays(this.props.Login.masterData.FilterStatus, AP_TestList, "ntransactionstatus") : []}
                                                                                                needSubFieldlabel={true}
                                                                                                subFields={this.state.testListColumns}
                                                                                                moreField={this.state.testMoreField}
                                                                                                needValidation={false}
                                                                                                needFilter={false}
                                                                                                filterColumnData={this.props.filterTransactionList}
                                                                                                searchListName="searchedTests"
                                                                                                searchRef={this.searchTestRef}
                                                                                                filterParam={filterTestParam}
                                                                                                commonActions={
                                                                                                    <ProductList className="d-flex product-category float-right">
                                                                                                        <Nav.Link
                                                                                                            hidden={this.state.userRoleControlRights.indexOf(editParamId) === -1}
                                                                                                            className="btn btn-circle outline-grey"
                                                                                                            onClick={() => this.props.getParameterEdit({ selectedTest: this.props.Login.masterData.selectedTest, userInfo: this.props.Login.userInfo, masterData: this.props.Login.masterData })}
                                                                                                        >
                                                                                                            <FontAwesomeIcon icon={faPencilAlt} />
                                                                                                        </Nav.Link>
                                                                                                        {this.props.Login.masterData.actionStatus &&
                                                                                                            this.props.Login.masterData.actionStatus.length > 0 ?
                                                                                                            <Dropdown className="mr-2">
                                                                                                                <Dropdown.Toggle className="btn-circle solid-blue ml-4">
                                                                                                                    <FontAwesomeIcon icon={faBolt}></FontAwesomeIcon>
                                                                                                                </Dropdown.Toggle>
                                                                                                                <Dropdown.Menu className="dropdownborder" >
                                                                                                                    {this.props.Login.masterData.actionStatus &&
                                                                                                                        this.props.Login.masterData.actionStatus.map(action =>
                                                                                                                            <Dropdown.Item onClick={() => this.performTestActions(action)}>
                                                                                                                                <Nav.Link className='add-txt-btn blue-text ml-1' style={{ display: 'inline' }}>
                                                                                                                                    {getStatusIcon(action.ntransactionstatus)}
                                                                                                                                    <span className='ml-1 text-nowrap'>{action.stransdisplaystatus}</span>
                                                                                                                                </Nav.Link>
                                                                                                                            </Dropdown.Item>
                                                                                                                        )
                                                                                                                    }
                                                                                                                </Dropdown.Menu>
                                                                                                            </Dropdown>
                                                                                                            : ""}
                                                                                                    </ProductList>
                                                                                                }
                                                                                            />
                                                                                        </PerfectScrollbar>
                                                                                        //     </Col>
                                                                                        // </Row> 
                                                                                        : ""}
                                                                                </Card.Body>
                                                                            </Card>
                                                                            {/* </Col>
                                                                            </Row> */}
                                                                        </Card.Body>
                                                                    </Card>
                                                                </PerfectScrollbar>
                                                            </ContentPanel>
                                                            <div className="card-panel-animation">
                                                                <ContentPanel className={`panel-main-content front ${this.state.showSample === true ? 'show' : 'hide'} `}>
                                                                    <PerfectScrollbar>
                                                                        <Card className="border-0">
                                                                            <Card.Body className='p-0'>
                                                                                <Row noGutters={true}>
                                                                                    <Col md={12}>
                                                                                        <Card className='p-0'>
                                                                                            <Card.Header className="d-flex justify-content-between" style={{ borderBottom: "0px" }}>
                                                                                                <span>
                                                                                                    <h4 >{this.props.intl.formatMessage({ id: "IDS_SAMPLE" })}</h4>
                                                                                                </span>
                                                                                                <Button className="btn btn-primary"
                                                                                                    onClick={() => this.showTestList()}>
                                                                                                    <FontAwesomeIcon icon={faEye} />{"  "}
                                                                                                    {this.props.intl.formatMessage({ id: "IDS_TEST" })}
                                                                                                </Button>
                                                                                            </Card.Header>
                                                                                            <Card.Body className="p-0">
                                                                                                {this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.length === 1 ?
                                                                                                    < SampleInfoView
                                                                                                        data={this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.length > 0 ? this.props.Login.masterData.selectedSample[this.props.Login.masterData.selectedSample.length - 1] : {}}
                                                                                                        SingleItem={this.state.SingleItem}
                                                                                                        screenName="IDS_SAMPLEINFO"

                                                                                                    /> :
                                                                                                    this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.length > 1 ?
                                                                                                        <SampleInfoGrid
                                                                                                            selectedSample={this.props.Login.masterData.selectedSample}
                                                                                                            dataState={this.state.sampleGridDataState}
                                                                                                            dataStateChange={this.sampleDataStateChange}
                                                                                                            detailedFieldList={this.state.SampleGridExpandableItem}
                                                                                                            extractedColumnList={this.state.SampleGridItem}
                                                                                                            userInfo={this.props.Login.userInfo}
                                                                                                            inputParam={this.props.Login.inputParam}
                                                                                                            screenName="IDS_SAMPLEINFO"
                                                                                                        /> : ""
                                                                                                }
                                                                                                {/* <CustomTabs activeKey={this.props.Login.activeSampleTab || "IDS_SAMPLEINFO"} tabDetail={this.sampleTabDetail()} onTabChange={this.onSampleTabChange} /> */}
                                                                                            </Card.Body>
                                                                                        </Card>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </PerfectScrollbar>
                                                                </ContentPanel>
                                                            </div>
                                                        </div>
                                                    </SplitPane>
                                                </div>
                                            </SplitPane>
                                        </div>
                                    </SplitPane>
                                </div>
                                <SplitPane className="5" vertical borderColor="#999" percentage={true} primaryIndex={0} secondaryInitialSize={0}>
                                    <PerfectScrollbar>
                                        <SplitPane className="6" vertical borderColor="#999" percentage={true} primaryIndex={0} secondaryInitialSize={20}>
                                            <ListWrapper style={{ height: "475px" }}>
                                                <PerfectScrollbar>
                                                    <ContentPanel className="panel-main-content">
                                                        <Card className="border-0">
                                                            <Card.Body className='p-0'>
                                                                <Row noGutters={true}>
                                                                    <Col md={12}>
                                                                        {this.state.showTest ?
                                                                            <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_RESULTS"} tabDetail={this.testTabDetail()} onTabChange={this.onTestTabChange} /> :
                                                                            this.state.showSample ?
                                                                                <CustomTabs activeKey={this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS"} tabDetail={this.sampleTabDetail()} onTabChange={this.onSampleTabChange} /> :
                                                                                ""}
                                                                    </Col>
                                                                </Row>
                                                            </Card.Body>
                                                        </Card>
                                                    </ContentPanel>
                                                </PerfectScrollbar>
                                            </ListWrapper>
                                        </SplitPane>
                                    </PerfectScrollbar>
                                </SplitPane>
                            </SplitPane>
                            {/* </PerfectScrollbar> */}
                        </Col>
                    </Row>
                </ListWrapper>
                {this.props.Login.openChildModal ?
                    <SlideOutModal
                        onSaveClick={this.onSaveClick}
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
                        mandatoryFields={this.props.Login.operation === 'enforce' ? [{ "idsName": "IDS_COMMENTS", "dataField": "senforcestatuscomment" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"}] : []}
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
                                // :this.props.Login.modalType==='attachment'?
                                //     <AddAttachment
                                //         selectedRecord={this.state.selectedRecord}
                                //         onDrop={this.onDropFiles}
                                //         linkMaster={this.props.Login.linkMaster}
                                //         onInputOnChange={this.onAttachmentInputChange}
                                //         editFiles={this.props.Login.editFiles}
                                //         maxSize={20}
                                //         maxFiles={3}
                                //     />
                                // :this.props.Login.modalType==='comments'?"":
                                <EditApprovalParameter
                                    ApprovalParamEdit={this.props.Login.ApprovalParamEdit || []}
                                    changeMandatory={this.changeMandatory}
                                    selectedRecord={this.state.selectedRecord.approvalParameterEdit || {}}
                                    nsubsampleneed={this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nsubsampleneed}
                                />
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
                    /> : ""}
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
            selectedRecord } = this.state;
        let bool = false;
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            bool = true;
            // this.setState({ userRoleControlRights, controlMap });
        }
        if (this.props.Login.masterData.RegSubTypeValue !== previousProps.Login.masterData.RegSubTypeValue) {
            if (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nsubsampleneed === transactionStatus.NO) {
                let dataState = { skip: 0, take: 5, group: [{ field: 'sarno' }] }
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
            // this.setState({ selectedRecord: this.props.Login.selectedRecord });
            bool = true;
        }
        if (this.props.Login.masterData.DynamicColumns && this.props.Login.masterData.DynamicColumns !== previousProps.Login.masterData.DynamicColumns) {
            sampleListColumns = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], designProperties.LISTITEM);
            subSampleListColumns = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[2], designProperties.LISTITEM);
            testListColumns = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[3], designProperties.LISTITEM);
            sampleListMainField = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], designProperties.LISTMAINFIELD);
            subSampleListMainField = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[2], designProperties.LISTMAINFIELD);
            testListMainField = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[3], designProperties.LISTMAINFIELD);
            SingleItem = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], designProperties.SINGLEITEMDATA)
            SampleGridItem = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], designProperties.GRIDITEM)
            SampleGridExpandableItem = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], designProperties.GRIDEXPANDABLEITEM)
            testMoreField = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[3], designProperties.LISTMOREITEM)
            // let {selectedRecord}=this.state
            let obj = this.covertDatetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate)
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
                selectedRecord
            });
        }
    }
    sampleTabDetail() {
        const tabMap = new Map();
        let npreregno = this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",") : "-1";
        tabMap.set("IDS_SAMPLEATTACHMENTS",
            <Attachments
                screenName="IDS_SAMPLEATTACHMENTS"
                selectedMaster={this.props.Login.masterData.selectedSample}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                attachments={this.props.Login.masterData.RegistrationAttachment || []}
                deleteRecord={this.props.deleteAttachment}
                onSaveClick={this.onAttachmentSaveClick}
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
                    esignRights: this.props.Login.userRoleControlRights

                }}
            />)
        tabMap.set("IDS_APPROVALHISTORY",
            <SampleApprovalHistory
                userInfo={this.props.Login.userInfo}
                ApprovalHistory={this.props.Login.masterData.SampleApprovalHistory}
                inputParam={this.props.Login.inputParam}
                dataState={this.state.sampleHistoryDataState}
                dataStateChange={this.sampleDataStateChange}
                screenName="IDS_APPROVALHISTORY"
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                selectedId={null}
            />)
        return tabMap;
    }
    testTabDetail = () => {
        const testTabMap = new Map();
       // let npreregno = this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",") : "-1";
        let ntransactiontestcode = this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        if (this.state.showTest) {
            testTabMap.set("IDS_RESULTS", <ApprovalResultsTab
                userInfo={this.props.Login.userInfo}
                masterData={this.props.Login.masterData}
                inputParam={this.props.Login.inputParam}
                dataState={this.state.resultDataState}
                dataStateChange={this.testDataStateChange}
                screenName="IDS_RESULTS"
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                getStatusCombo={this.props.getStatusCombo}
                selectedId={this.props.Login.masterData.selectedParamId}
                viewFile={this.props.viewAttachment}
                checkListRecord={this.props.checkListRecord}
            />)
            testTabMap.set("IDS_INSTRUMENT", <ApprovalInstrumentTab
                userInfo={this.props.Login.userInfo}
                masterData={this.props.Login.masterData}
                inputParam={this.props.Login.inputParam}
                dataState={this.state.instrumentDataState}
                dataStateChange={this.testDataStateChange}
                screenName="IDS_INSTRUMENT"
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                selectedId={null}
            />)
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
            testTabMap.set("IDS_TASK", <ApprovalTask
                userInfo={this.props.Login.userInfo}
                ResultUsedTasks={this.props.Login.masterData.ResultUsedTasks}
                inputParam={this.props.Login.inputParam}
                dataState={this.state.taskDataState}
                dataStateChange={this.testDataStateChange}
                screenName="IDS_TASK"
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                selectedId={null}
            />)
            testTabMap.set("IDS_TESTATTACHMENTS", <Attachments
                screenName="IDS_TESTATTACHMENTS"
                selectedMaster={this.props.Login.masterData.selectedTest}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                attachments={this.props.Login.masterData.RegistrationTestAttachment || []}
                deleteRecord={this.props.deleteAttachment}
                fetchRecord={this.props.getAttachmentCombo}
                onSaveClick={this.onAttachmentSaveClick}
                addName={"AddTestAttachment"}
                editName={"EditTestAttachment"}
                deleteName={"DeleteTestAttachment"}
                viewName={"ViewTestAttachment"}
                methodUrl={"TestAttachment"}
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
                    screenName: "IDS_TESTATTACHMENTS"

                }}
            />)
            testTabMap.set("IDS_TESTCOMMENTS", <Comments
                screenName="IDS_TESTCOMMENTS"
                selectedMaster={this.props.Login.masterData.selectedTest}
                onSaveClick={this.onCommentsSaveClick}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                Comments={this.props.Login.masterData.RegistrationTestComment || []}
                fetchRecord={this.props.getCommentsCombo}
                addName={"AddTestComment"}
                editName={"EditTestComment"}
                deleteName={"DeleteTestComment"}
                methodUrl={"TestComment"}
                isTestComment={false}
                primaryKeyField={"ntestcommentcode"}
                dataState={this.state.testCommentDataState}
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
                    operation: "update"

                }}
            />)

            testTabMap.set("IDS_RESULTCHANGEHISTORY", <ResultChangeHistoryTab
                userInfo={this.props.Login.userInfo}
                ApprovalResultChangeHistory={this.props.Login.masterData.ApprovalResultChangeHistory}
                inputParam={this.props.Login.inputParam}
                dataState={this.state.resultChangeDataState}
                dataStateChange={this.testDataStateChange}
                screenName="IDS_RESULTCHANGEHISTORY"
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                selectedId={null}

            />)
            testTabMap.set("IDS_APPROVALHISTORY",
                <ApprovalHistoryTab
                    userInfo={this.props.Login.userInfo}
                    ApprovalHistory={this.props.Login.masterData.ApprovalHistory}
                    inputParam={this.props.Login.inputParam}
                    dataState={this.state.historyDataState}
                    dataStateChange={this.testDataStateChange}
                    screenName="IDS_APPROVALHISTORY"
                    controlMap={this.state.controlMap}
                    userRoleControlRights={this.state.userRoleControlRights}
                    selectedId={null}
                />)
        }

        return testTabMap;
    }
    onTestTabChange = (tabProps) => {

        const activeTestTab = tabProps.screenName;
        if (activeTestTab !== this.props.Login.activeTestTab) {
            if (this.props.Login.masterData.selectedTest && this.props.Login.masterData.selectedTest.length > 0) {
                let inputData = {
                    masterData: this.props.Login.masterData,
                    selectedTest: this.props.Login.masterData.selectedTest,
                    ntransactiontestcode: this.props.Login.masterData.selectedTest ?
                        String(this.props.Login.masterData.selectedTest.map(item => item.ntransactiontestcode).join(",")) : "-1",
                    npreregno: this.props.Login.masterData.selectedSample ?
                        this.props.Login.masterData.selectedSample.map(item => item.npreregno).join(",") : "-1",
                    userinfo: this.props.Login.userInfo,
                    activeTestTab,
                    screenName: activeTestTab
                }
                this.props.getTestChildTabDetail(inputData)
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
                selectedSample: this.props.Login.masterData.selectedSample,
                npreregno: this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(item => item.npreregno).join(",") : "-1",
                userinfo: this.props.Login.userInfo,
                screenName: activeSampleTab,
                activeSampleTab
            }
            this.props.getSampleChildTabDetail(inputData)
        }
    }
    showSampleInfo() {
        this.setState({ showSample: true, showTest: false })
    }
    showTestList() {
        this.setState({ showTest: true, showSample: false })
    }
    performTestActions = (action) => {
        let ntransCode = this.props.Login.masterData.FilterStatusValue.ntransactionstatus
        if (ntransCode === transactionStatus.ALL) {
            ntransCode = this.props.Login.masterData.FilterStatus.map(status => status.ntransactionstatus).join(",");
        } else {
            ntransCode = ntransCode + "," + action.ntransactionstatus
        }
        const inputParam = {
            inputData: {
                'performaction': {
                    npreregno: this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(","),
                    TransactionSampleTests: this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(","),
                    nsectioncode: this.props.Login.masterData.UserSectionValue ?
                        this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ?
                            this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') :
                            String(this.props.Login.masterData.UserSectionValue.nsectioncode) :
                        null,
                    nTransStatus: action.ntransactionstatus,
                    ntransactionstatus: String(-1),
                    ntransactionsamplecode: this.props.Login.masterData.selectedSubSample.map(sample => sample.ntransactionsamplecode).join(","),
                    nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                    dfrom: this.props.Login.masterData.fromDate,
                    dto: this.props.Login.masterData.toDate,
                    nflag: 2,
                    ntype: 1,
                    userinfo: this.props.Login.userInfo,
                    selectedSample: this.props.Login.masterData.selectedSample,
                    selectedTest: this.props.Login.masterData.selectedTest
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
    updateDecision = (action) => {
        let ntransCode = this.props.Login.masterData.realFilterStatusValue.ntransactionstatus
        if (ntransCode === transactionStatus.ALL) {
            ntransCode = this.props.Login.masterData.FilterStatus.map(status => status.ntransactionstatus).join(",");
        }
        const inputData = {
            'updatedecision': {
                npreregno: this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(","),
                nTransStatus: action.ntransactionstatus,
                ntransactionstatus: String(ntransCode),
                dfrom: this.props.Login.masterData.fromDate,
                dto: this.props.Login.masterData.toDate,
                nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                nsectioncode: this.props.Login.masterData.UserSectionValue ?
                    this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ?
                        this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') :
                        String(this.props.Login.masterData.UserSectionValue.nsectioncode) :
                    null,
                nflag: 1,
                userinfo: this.props.Login.userInfo,
                napprovalversioncode: String(this.props.Login.masterData.selectedSample[0].napprovalversioncode),
                napprovalconfigcode: this.props.Login.masterData.selectedSample[0].napprovalconfigcode,
                selectedSample: this.props.Login.masterData.selectedSample,
            }, userinfo: this.props.Login.userInfo

        }
        let inputParam = { postParamList: this.postParamList, inputData, masterData: this.props.Login.masterData }
        this.props.updateDecision(inputParam)
    }
    onFilterComboChange = (comboData, fieldName) => {

        if (comboData) {

            let inputParamData = {};
            if (fieldName === 'nsampletypecode') {

                inputParamData = {
                    nflag: 2,
                    dfrom: this.props.Login.masterData.fromDate,
                    dto: this.props.Login.masterData.toDate,
                    nsampletypecode: comboData.value,
                    userinfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    SampleTypeValue: comboData.item
                };
                this.props.getRegistrationType(inputParamData)
            } else if (fieldName === 'nregtypecode') {
                inputParamData = {
                    nflag: 3,
                    dfrom: this.props.Login.masterData.fromDate,
                    dto: this.props.Login.masterData.toDate,
                    nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                    nregtypecode: comboData.value,
                    userinfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    RegTypeValue: comboData.item
                }
                this.props.getRegistrationSubType(inputParamData)
            } else if (fieldName === 'nregsubtypecode') {


                inputParamData = {
                    nflag: 4,
                    dfrom: this.props.Login.masterData.fromDate,
                    dto: this.props.Login.masterData.toDate,
                    nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
                    nregsubtypecode: comboData.value,
                    userinfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    RegSubTypeValue: comboData.item
                }
                this.props.getFilterStatus(inputParamData)
            } else if (fieldName === 'napproveconfversioncode') {

                let masterData = { ...this.props.Login.masterData, ApprovalVersionValue: comboData.item }
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { masterData }
                }
                this.props.updateStore(updateInfo);
            }
            else if (fieldName === 'nsectioncode') {

                let masterData = { ...this.props.Login.masterData, UserSectionValue: comboData.item }
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { masterData }
                }
                this.props.updateStore(updateInfo);
            } else if (fieldName === 'njobstatuscode') {

                let masterData = { ...this.props.Login.masterData, JobStatusValue: comboData.item }
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { masterData }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                let masterData = { ...this.props.Login.masterData, FilterStatusValue: comboData.item }
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { masterData }
                }
                this.props.updateStore(updateInfo);
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
        selectedRecord[event.target.name] = event.target.value;
        this.setState({ selectedRecord });
    }
    handleDateChange = (dateName, dateValue) => {
        if (dateValue === null) {
            dateValue = new Date();
        }
        let dfrom = this.props.Login.masterData.fromDate || new Date()
        let dto = this.props.Login.masterData.toDate || new Date()
        let obj = {}
        if (dateName === 'fromDate') {
            obj = this.covertDatetoString(dateValue, dto)
            dfrom = obj.fromDate
            dto = obj.toDate
        } else {
            obj = this.covertDatetoString(dfrom, dateValue)
            dfrom = obj.fromDate
            dto = obj.toDate

        }
        let inputParam = {
            inputData: {
                nregtypecode: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
                dfrom: String(dfrom),
                dto: String(dto),
                userinfo: this.props.Login.userInfo
            },
            masterData: this.props.Login.masterData

        }
        this.props.getApprovalVersion(inputParam)
    }
    changeMandatory = (event, dataItem) => {
        let selectedRecord = this.state.selectedRecord || {};
        let value = event.currentTarget.checked ? transactionStatus.YES : transactionStatus.NO
        selectedRecord["approvalParameterEdit"] = { ...selectedRecord["approvalParameterEdit"], [dataItem.ntransactionresultcode]: value }
        this.setState({ selectedRecord });
    }
    onFilterSubmit = () => {
        let realFromDate = new Date(this.props.Login.masterData.fromDate)
        let realToDate = new Date(this.props.Login.masterData.toDate)
        let realSampleTypeValue = this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue
        let realRegTypeValue = this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue
        let realRegSubTypeValue = this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue
        let realFilterStatusValue = this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue
        let masterData = { ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue, realFilterStatusValue }
        let inputData = {
            npreregno: "0",
            nsampletypecode: (this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue.nsampletypecode) || -1,
            nregtypecode: (this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode) || -1,
            nregsubtypecode: (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) || -1,
            ntransactionstatus: ((this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== undefined) || this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== '0') ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) : "-1",
            napprovalconfigcode: this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigcode || -1 : null,
            napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode) : null,
            nsectioncode: this.props.Login.masterData.UserSectionValue ? this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.UserSectionValue.nsectioncode) : null,
            userinfo: this.props.Login.userInfo,
            activeTestTab: this.props.Login.activeTestTab,
            activeSampleTab: this.props.Login.activeSampleTab,
        }
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
            && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1") {

            let obj = this.covertDatetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate)
            inputData['dfrom'] = obj.fromDate;
            inputData['dto'] = obj.toDate;
            let inputParam = {
                masterData,
                inputData,
                searchSampleRef: this.searchSampleRef,
                searchSubSampleRef: this.searchSubSampleRef,
                searchTestRef: this.searchTestRef
            }
            this.props.getApprovalSample(inputParam)
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
                    instrumentDataState: event.dataState
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
            case "IDS_APPROVALHISTORY":
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
    sampleDataStateChange = (event) => {
        switch (this.props.Login.activeSampleTab) {
            case "IDS_SAMPLEINFO":
                this.setState({
                    sampleGridDataState: event.dataState
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
                case "IDS_APPROVALHISTORY":
                    this.setState({
                        sampleHistoryDataState:event.dataState
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
        inputData["userinfo"] = this.props.Login.userInfo;
        if (this.props.Login.operation === 'enforce') {
            inputData["enforcestatus"] = {
                ngradecode: this.props.Login.masterData.GradeValue.value || -1,
                ntransactiontestcode: this.state.selectedRecord.ntransactiontestcode,
                ntransactionresultcode: this.state.selectedRecord.ntransactionresultcode,
                senforcestatuscomment: this.state.selectedRecord.senforcestatuscomment || "",
                selectedTestCode: this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",")
            }
            inputParam = {
                methodUrl: "EnforceStatus",
                classUrl: 'approval',
                inputData: inputData,
                postParam: { selectedObject: "selectedTest", primaryKeyField: "ntransactiontestcode" },
                operation: "update"
            }
        } else if (this.props.Login.screenName === "IDS_SAMPLEATTACHMENTS") {
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
                postParam: { selectedObject: "selectedTest", primaryKeyField: "ntransactiontestcode" },
                operation: "update"
            }
        }
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
    handleClose = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal
        let selectedRecord = this.props.Login.selectedRecord;
        let templateData = this.props.Login.templateData;
        let operation = this.props.Login.operation;
        let openTemplateModal = this.props.Login.openTemplateModal;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "dynamic") {
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
            screenData: this.props.Login.screenData
        }
        if (this.props.Login.operation === 'dynamic') {
            this.props.validateEsignforApproval(inputParam, "openChildModal");
        } else {
            this.props.validateEsignCredential(inputParam, "openChildModal");
        }
    }
    covertDatetoString(startDateValue, endDateValue) {
        const startDate = new Date(startDateValue);
        const endDate = new Date(endDateValue);

        const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
        const currentMonth = validateTwoDigitDate(String(endDate.getMonth() + 1));
        const prevDay = validateTwoDigitDate(String(startDate.getDate()));
        const currentDay = validateTwoDigitDate(String(endDate.getDate()));

        const fromDateOnly = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay
        const toDateOnly = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay
        const fromDate = fromDateOnly + " 00:00:00";
        const toDate = toDateOnly + " 23:59:00";


        return ({ fromDate, toDate, breadCrumbFrom: fromDateOnly, breadCrumbto: toDateOnly })
    }
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
                url = "approval/getapprovalparameter"
                break;
            case "IDS_TESTCOMMENTS":
                url = "approval/getapprovalparameter"
                break;
            case "IDS_DOCUMENTS":
                url = "approval/getapprovalparameter"
                break;
            case "IDS_RESULTCHANGEHISTORY":
                url = "approval/getApprovalResultChangeHistory"
                break;
            case "IDS_APPROVALHISTORY":
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
        if (this.props.Login.screenName === "IDS_TESTCOMMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                isTestComment: this.props.isTestComment,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation
            }
            inputParam = onSaveTestComments(saveParam, this.props.Login.masterData.selectedTest);
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
        inputData["userinfo"] = this.props.Login.userInfo;
        if (this.props.Login.screenName === "IDS_SAMPLEATTACHMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                selectedMaster: this.props.selectedMaster
            }
            inputParam = onSaveSampleAttachment(saveParam, this.props.Login.masterData.selectedSample);
        } else if (this.props.Login.screenName === "IDS_TESTATTACHMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                selectedMaster: this.props.selectedMaster
            }
            inputParam = onSaveTestAttachment(saveParam, this.props.Login.masterData.selectedTest);
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

}

export default connect(mapStateToProps, {
    getsubSampleDetail, getTestDetail, getTestChildTabDetail, performAction, updateStore, viewAttachment, checkListRecord,
    updateDecision, getRegistrationType, getRegistrationSubType, getFilterStatus, getApprovalSample, getStatusCombo,
    validateEsignCredential, crudMaster, validateEsignforApproval, getApprovalVersion, getParameterEdit, filterTransactionList,
    getSampleChildTabDetail, getAttachmentCombo, deleteAttachment, getCommentsCombo
})(injectIntl(Approval))