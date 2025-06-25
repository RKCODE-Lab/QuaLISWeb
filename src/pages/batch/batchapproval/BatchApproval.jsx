import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { injectIntl, FormattedMessage } from 'react-intl';
import SplitterLayout from "react-splitter-layout";
import ScrollBar from 'react-perfect-scrollbar';
import { Row, Col, Card, FormGroup, FormLabel, Button } from 'react-bootstrap';
// import DocViewer from '../../../components/doc-viewer/doc-viewer.component'
import {
    callService, crudMaster, validateEsignCredential, updateStore, getBatchCreation, getRoleChecklist,
    onSaveBatchChecklist, validateBatchTest, performBatchAction, getBAChildTabDetail, getTestParameter,
    getBASampleApprovalHistory, BA_viewCheckList, validateEsignforBatchApproval, filterTransactionList,
    getBAFilterStatus, getSpecComponentView, onClickReport
} from '../../../actions';
//import samplePdf from '../../../assets/pdf/BatchStudyReport_202100008.pdf';
import rsapi from '../../../rsapi';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { formatInputDate, getControlMap, sortData, constructOptionList, convertDateValuetoString, rearrangeDateFormat } from '../../../components/CommonScript';
import { ReadOnlyText, ContentPanel, OutlineTransactionStatus } from '../../../components/App.styles';
import { ListWrapper } from '../../../components/client-group.styles';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
import TransactionListMaster from '../../../components/TransactionListMaster';
import BatchApprovalFilter from './BatchApprovalFilter';
import { designProperties, reportCOAType, reportTypeEnum, transactionStatus } from '../../../components/Enumeration';
import CustomTabs from '../../../components/custom-tabs/custom-tabs.component';
import { ProductList } from '../../product/product.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Nav } from 'react-bootstrap';
import { getStatusIcon } from '../../../components/StatusIcon';
import { faBolt, faEye, faSync } from '@fortawesome/free-solid-svg-icons';
import { faListAlt } from '@fortawesome/free-regular-svg-icons';
import TemplateForm from '../../checklist/checklist/TemplateForm';
import { templateChangeHandler } from '../../checklist/checklist/checklistMethods';
import CerGenTabs from '../certificategeneration/CerGenTabs';
import Comments from '../../attachmentscomments/comments/Comments';
import Attachments from '../../attachmentscomments/attachments/Attachments';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import { process } from '@progress/kendo-data-query';
import BatchApprovalHistory from './BatchApprovalHistory';
import ResultGrid from '../../resultgrid/ResultGrid';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import Esign from '../../audittrail/Esign';
//import { ReactComponent as Reports } from '../../../assets/image/reports.svg'
import CustomPopOver from '../../../components/customPopover';
import SpecView from '../batchcreation/SpecView';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import CustomPopover from '../../../components/customPopover';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
// import ReactTooltip from 'react-tooltip';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class BatchApproval extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            masterStatus: "",
            error: "",
            selectedRecord: {},
            filterRecord: {},
            userRoleControlRights: [],
            controlMap: new Map(),
            filterStatusList: [],
            approvalVersionList: [],
            parameterMap: new Map(), testComments: [], historyMap: new Map(), batchApprovalHistory: [], batchDecisionHistory: [],
            batchClockHistory: [], checklistHistory: [], batchAttachments: [],
            componentDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            sampleapprovalDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            parameterDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            testCommentDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'sarno' }] },
            sampleHistoryDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            batchApprovalDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            decisionDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            batchClockDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            checklistDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            batchAttachmentDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],

        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.searchFieldList = ["nreleasebatchcode", "sbatchregdate", "sproductname", "smanufname", "sspecname", "sbatchfillinglotno",
            "spackinglotno", "smahname", "nnoofcontainer", "sfinalbulkno", "sbatchspecvarinfo",
            "smanuforderno", "snibsccomments", "stransactionstatus", "sdecision"];

    }
    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }
        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }

    reportMethod = (value) => {
        if (value.method === 1) {
            this.onClickReport(this.props.Login.masterData.BA_SelectedBatchCreation[0], 2, value.controlId)
        }
        else {
            this.onClickReport(this.props.Login.masterData.BA_SelectedBatchCreation[0], 1, value.controlId)
        }
    }

    render() {


        // let fromDate = "";
        // let toDate = "";

        // if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
        //     fromDate = this.state.filterRecord.fromDate ? getStartOfDay(this.state.filterRecord.fromDate) :
        //         new Date(this.props.Login.masterData.BA_fromDate);
        //     toDate = this.state.filterRecord.toDate ? getEndOfDay(this.state.filterRecord.toDate) :
        //         new Date(this.props.Login.masterData.BA_toDate);
        // }
        //let obj = this.covertDatetoString(this.props.Login.masterData.BA_fromDate || new Date(), this.props.Login.masterData.BA_toDate || new Date())
        let obj = convertDateValuetoString(this.props.Login.masterData.BA_fromDate,this.props.Login.masterData.BA_toDate, this.props.Login.userInfo); 
        
        const filterParam = {
            inputListName: "BA_BatchCreation",
            selectedObject: "BA_SelectedBatchCreation",
            primaryKeyField: "nreleasebatchcode",
            fetchUrl: "batchapproval/getBAChildTab",
            fecthInputObject: { userinfo: this.props.Login.userInfo, activeBATab: this.props.Login.activeBATab || "IDS_COMPONENTS", masterData: this.props.Login.masterData || "" },
            masterData: this.props.Login.masterData,
            isSingleSelect: true,
            unchangeList: ["BA_fromDate", "BA_toDate", "BA_FilterStatus", "BA_FilterStatusValue", "BA_ApprovalVersion", "BA_ApprovalVersionValue"],
            changeList: ["Parameter", "BA_SampleApprovalHistory", "BA_BatchComponent", "BA_TestComments", "BA_BatchApprovalHistory", "BA_BatchDecisionHistory",
                "BA_BatchClockHistory", "BA_BatchChecklistHistory"],
            searchFieldList: this.searchFieldList
        }
        const singleGetParam = {
            dfrom: obj.fromDate,
            dto: obj.toDate,
            napprovalversioncode: this.props.Login.masterData.BA_ApprovalVersionValue && this.props.Login.masterData.BA_ApprovalVersionValue.napprovalconfigversioncode,
            ntransactionstatus: this.props.Login.masterData.BA_FilterStatusValue && this.props.Login.masterData.BA_FilterStatusValue.ntransactionstatus,
            activeBATab: this.props.Login.activeBATab || "",
            userinfo: this.props.Login.userInfo,
            masterData: this.props.Login.masterData,
            componentDataState: this.state.componentDataState,
            parameterDataState: this.state.parameterDataState,
            testCommentDataState: this.state.testCommentDataState,
            sampleHistoryDataState: this.state.sampleHistoryDataState,
            batchApprovalDataState: this.state.batchApprovalDataState,
            decisionDataState: this.state.decisionDataState,
            batchClockDataState: this.state.batchClockDataState,
            checklistDataState: this.state.checklistDataState,
            batchAttachmentDataState: this.state.batchAttachmentDataState,
            nflag:1,

        }
        this.postParamList = [
            {
                filteredListName: "searchedData",
                clearFilter: "no",
                searchRef: this.searchRef,
                primaryKeyField: "nreleasebatchcode",
                fetchUrl: "batchapproval/getBAChildTab",
                fecthInputObject: singleGetParam,
                selectedObject: "BA_SelectedBatchCreation",
                inputListName: "BA_BatchCreation",
                updatedListname: "updatedBatchCreation",
                childRefs: [],
                unchangeList: ["BA_fromDate", "BA_toDate", "BA_FilterStatus", "BA_ApprovalVersion", "BA_FilterStatusValue", "BA_ApprovalVersionValue"]
            }
        ];
        const mandatoryFields = [];

        const breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": obj.breadCrumbFrom
            }, {
                "label": "IDS_TO",
                "value": obj.breadCrumbto
            },
            {
                "label": "IDS_CONFIGVERSION",
                "value": this.props.Login.masterData.BA_ApprovalVersionValue ?
                    this.props.intl.formatMessage({ id: this.props.Login.masterData.BA_ApprovalVersionValue.sversionname || "NA" }) : "NA"
            },
            {
                "label": "IDS_FILTERSTATUS",
                "value": this.props.Login.masterData.BA_FilterStatusValue ?
                    this.props.intl.formatMessage({ id: this.props.Login.masterData.BA_FilterStatusValue.sfilterstatus || "NA" }) : "NA"
            }
        ];
        let decisionStatus = this.props.Login.masterData.decisionStatus ? sortData(this.props.Login.masterData.decisionStatus, 'ascending', 'ntransactionstatus') : [];
        let actionStatus = this.props.Login.masterData.actionStatus ? sortData(this.props.Login.masterData.actionStatus, 'descending', 'ntransactionstatus') : [];
        let specViewParam = {}
        // let decisionIcon = ""
        // let decisionClass = "outline-secondary"
        if (this.props.Login.masterData.BA_SelectedBatchCreation && this.props.Login.masterData.BA_SelectedBatchCreation.length > 0) {
            specViewParam = {
                sspecname: this.props.Login.masterData.BA_SelectedBatchCreation[0].sspecname,
                sproductname: this.props.Login.masterData.BA_SelectedBatchCreation[0].sproductname,
                nallottedspeccode: this.props.Login.masterData.BA_SelectedBatchCreation[0].nallottedspeccode,
                userInfo: this.props.Login.userInfo, modalName: "openChildModal"
            }
            // decisionClass = this.props.Login.masterData.BA_SelectedBatchCreation[0].ndecision === transactionStatus.PASS ? "outline-success" :
            //     this.props.Login.masterData.BA_SelectedBatchCreation[0].ndecision === transactionStatus.FAIL ? "outline-danger" : "outline-secondary";
            // decisionIcon = this.props.Login.masterData.BA_SelectedBatchCreation[0].ndecision === transactionStatus.PASS ?"fa fa-thumbs-up":
            //     this.props.Login.masterData.BA_SelectedBatchCreation[0].ndecision === transactionStatus.FAIL ? "fa fa-thumbs-down":
            //     this.props.Login.masterData.BA_SelectedBatchCreation[0].ndecision === transactionStatus.WITHDRAWN ? "fa fa-minus" : ""
        }
        // const reportParam = {
        //     classUrl: "certificategeneration",
        //     methodUrl: "reportGeneration",
        //     screenName: "CertificateGeneration", operation: "update", primaryKeyField: "nreleasebatchcode",
        //     inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
        //     ncontrolCode: -1, 
        //     fromDate:obj.fromDate, 
        //     toDate:obj.toDate,
        //     inputData:{
        //         nprimarykey: 'nreleasebatchcode', 
        //         nreleasebatchcode: this.props.Login.masterData.BA_SelectedBatchCreation[0].nreleasebatchcode, 
        //         ncertificatetypecode:this.props.Login.masterData.BA_SelectedBatchCreation[0].ncertificatetypecode,
        //         ndecisionStatus: this.props.Login.masterData.BA_SelectedBatchCreation[0].ndecision
        //     }
        // };

        const studyReportId = this.state.controlMap.has("BatchStudyReport") && this.state.controlMap.get("BatchStudyReport").ncontrolcode
        const reportId = this.state.controlMap.has("BatchReport") && this.state.controlMap.get("BatchReport").ncontrolcode

        const decisionActionId = this.state.controlMap.has("BatchDecisionAction") && this.state.controlMap.get("BatchDecisionAction").ncontrolcode
        const approvalActionId = this.state.controlMap.has("BatchApprovalAction") && this.state.controlMap.get("BatchApprovalAction").ncontrolcode
        const checkListActionId = this.state.controlMap.has("BatchCheckList") && this.state.controlMap.get("BatchCheckList").ncontrolcode
        const studyviewActionId = this.state.controlMap.has("BatchStudyPlanView") && this.state.controlMap.get("BatchStudyPlanView").ncontrolcode
        const reportActionList = [{ "method": 1, "value": this.props.intl.formatMessage({ id: "IDS_BATCHREPORT" }), "controlId": studyReportId },
        { "method": 2, "value": this.props.intl.formatMessage({ id: "IDS_REPORT" }), "controlId": reportId }]
        const ListCheck=[];
        reportActionList.map((action)=>{
          const val=this.state.userRoleControlRights ? 
          this.state.userRoleControlRights.indexOf(action.controlId) === -1 : false
          if(!val){
        ListCheck.push(val);
          }
        return null;
        })
    
        
        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                    <Row noGutters={"true"}>
                        <Col md={12} className="parent-port-height sticky_head_parent" ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            {/* <div className="parent-port-height sticky_head_parent" ref={(parentHeight) => { this.parentHeight = parentHeight }}> */}
                            <div>
                                <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={30}>
                                    <TransactionListMaster
                                        masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.BA_BatchCreation || []}
                                        selectedMaster={this.props.Login.masterData.BA_SelectedBatchCreation}
                                        primaryKeyField="nreleasebatchcode"
                                        getMasterDetail={this.props.getBAChildTabDetail}
                                        inputParam={singleGetParam}
                                        mainField="nreleasebatchcode"
                                        selectedListName="BA_SelectedBatchCreation"
                                        objectName="objBatchCreation"
                                        listName="IDS_BATCH"
                                        needValidation={false}
                                        subFields={
                                            [
                                                { [designProperties.VALUE]: "sproductname" },
                                                { [designProperties.VALUE]: "smanufname" },
                                                { [designProperties.VALUE]: "smahname" },
                                                { [designProperties.VALUE]: "stransactionstatus", [designProperties.COLOUR]: "approvalcolor" }
                                            ]
                                        }
                                        needFilter={true}
                                        needMultiSelect={false}
                                        subFieldsLabel={true}
                                        openFilter={this.openFilter}
                                        closeFilter={this.closeFilter}
                                        onFilterSubmit={this.onFilterSubmit}
                                        filterColumnData={this.props.filterTransactionList}
                                        searchListName="searchedData"
                                        searchRef={this.searchRef}
                                        filterParam={filterParam}
                                        showStatusLink={true}
                                        statusFieldName="sdecision"
                                        statusField="ndecision"
                                        statusColor="decisioncolor"
                                        showStatusIcon={true}
                                        showStatusName={false}
                                        skip={this.state.skip}
                                        take={this.state.take}
                                        handlePageChange={this.handlePageChange}
                                        childTabsKey={["AP_SUBSAMPLE", "AP_TEST", "SampleApprovalHistory", "RegistrationAttachment"]}
                                        commonActions={
                                            <ProductList className="d-flex product-category justify-content-end">
                                                {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                    onClick={() => this.onReload()}
                                                    // title={this.props.intl.formatMessage({id:"IDS_REFRESH"})}>
                                                  //  data-for="tooltip-common-wrap"
                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                        <RefreshIcon className='custom_icons'/>
                                                </Button>
                                                {/* </Tooltip> */}
                                                {this.props.Login.masterData.BA_SelectedBatchCreation && this.props.Login.masterData.BA_SelectedBatchCreation.length > 0 &&
                                                    this.props.Login.masterData.decisionStatus &&
                                                    this.props.Login.masterData.decisionStatus.length > 0 &&
                                                    this.state.userRoleControlRights.indexOf(decisionActionId) !== -1 ?
                                                    <CustomPopOver
                                                        icon={faBolt}
                                                        nav={true}
                                                        data={decisionStatus}
                                                        btnClasses="btn-circle btn_grey ml-2"
                                                        textKey="sdecisionstatus"
                                                        iconKey="ntransactionstatus"
                                                        dynamicButton={(value) => this.validateBatchTest(value, 1)}
                                                    />
                                                    : ""}
                                            </ProductList>
                                        }
                                        filterComponent={[
                                            {
                                                "IDS_FILTER":
                                                    <BatchApprovalFilter
                                                        filterRecord={this.state.filterRecord || {}}
                                                        handleDateChange={this.handleDateChange}
                                                        onFilterComboChange={this.onFilterComboChange}
                                                        onApprovalVersionChange={this.onApprovalVersionChange}
                                                        fromDate={this.props.Login.masterData.BA_fromDate?rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.BA_fromDate):new Date()}
                                                        toDate={this.props.Login.masterData.BA_toDate?rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.BA_toDate):new Date()}
                                                        filterStatus={this.state.filterStatusList}
                                                        filterStatusValue={this.props.Login.masterData.BA_FilterStatusValue}
                                                        approvalVersion={this.state.approvalVersionList}
                                                        approvalVersionValue={this.props.Login.masterData.BA_ApprovalVersionValue}
                                                        userInfo={this.props.Login.userInfo}
                                                    />
                                            }
                                        ]}


                                    />
                                    <ScrollBar ref={(ref) => { this._scrollBarRef = ref; }}>
                                        <div className="fixed_list_height">
                                            <>
                                                <div className="card_group">
                                                    <ContentPanel className="panel-main-content">
                                                        {this.props.Login.masterData.BA_SelectedBatchCreation && this.props.Login.masterData.BA_SelectedBatchCreation.length > 0 ?
                                                            <>
                                                                <Card>
                                                                    <Card.Header>
                                                                        <Card.Title>
                                                                            <p className="product-title-main">
                                                                                {this.props.Login.masterData.BA_SelectedBatchCreation[0].nreleasebatchcode}
                                                                            </p>
                                                                        </Card.Title>
                                                                        <Card.Subtitle>

                                                                            {/* <ProductList className="d-flex product-category d-inline justify-content-end">
                                                                    {this.props.Login.masterData.actionStatus &&
                                                                        this.props.Login.masterData.actionStatus.length > 0 ?
                                                                        <Dropdown>
                                                                            <Dropdown.Toggle className="btn-circle solid-blue ml-4">
                                                                                <FontAwesomeIcon icon={faBolt}></FontAwesomeIcon>
                                                                            </Dropdown.Toggle>
                                                                            <Dropdown.Menu className="dropdownborder" >
                                                                                {this.props.Login.masterData.actionStatus &&
                                                                                    actionStatus.map(action =>
                                                                                        <Dropdown.Item onClick={() => this.updateDecision(action)}>
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
                                                                </ProductList> */}
                                                                            <div className="d-flex product-category justify-content-between">
                                                                                <h2 className="product-title-sub flex-grow-1">

                                                                                    <OutlineTransactionStatus transcolor={this.props.Login.masterData.BA_SelectedBatchCreation[0].approvalcolor}>
                                                                                        {this.props.Login.masterData.BA_SelectedBatchCreation[0].stransactionstatus}
                                                                                    </OutlineTransactionStatus>

                                                                                    {/* {this.props.Login.masterData.BA_SelectedBatchCreation[0].ndecision !== transactionStatus.DRAFT ?
                                                                                        <DecisionStatus decisioncolor={this.props.Login.masterData.BA_SelectedBatchCreation[0].decisioncolor}>
                                                                                        {this.props.Login.masterData.BA_SelectedBatchCreation[0].sdecision}
                                                                                        </DecisionStatus>
                                                                                    :""} */}

                                                                                    {/* <span className={`btn btn-outlined ${decisionClass}  btn-sm`}>
                                                                                        {decisionIcon !== "" ? <i class={`${decisionIcon} mr-2`}></i> : ""}
                                                                                        {this.props.Login.masterData.BA_SelectedBatchCreation[0].sdecision}
                                                                                    </span>
                                                                                    <span className={`btn btn-outlined btn-sm ml-3`} style={{ color: this.props.Login.masterData.BA_SelectedBatchCreation[0].approvalcolor }}>
                                                                                        {this.props.Login.masterData.BA_SelectedBatchCreation[0].stransactionstatus}
                                                                                    </span> */}
                                                                                </h2>
                                                                                {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                                                {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                                                <Nav.Link name={"specview"}
                                                                                    className="btn btn-circle outline-grey mr-2"
                                                                                    //title={this.props.intl.formatMessage({ id: "IDS_SPECVIEW" })}
                                                                                    hidden={this.state.userRoleControlRights.indexOf(studyviewActionId) === -1}
                                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_SPECVIEW" })}
                                                                                  //  data-for="tooltip-common-wrap"
                                                                                    onClick={() => this.props.getSpecComponentView(specViewParam)}
                                                                                >
                                                                                    <FontAwesomeIcon icon={faEye}
                                                                                        onClick={() => this.props.getSpecComponentView(specViewParam)} />
                                                                                </Nav.Link>
                                                                                {/* <Nav.Link name={"batchReport"}
                                                                                    hidden={this.state.userRoleControlRights.indexOf(studyReportId) === -1}
                                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                    title={this.props.intl.formatMessage({ id: "IDS_BATCHREPORT" })}
                                                                                    onClick={() => this.onClickReport(this.props.Login.masterData.BA_SelectedBatchCreation[0],2,studyReportId)}
                                                                                >
                                                                                   <FontAwesomeIcon icon={faListAlt}  />
                                                                                </Nav.Link> */}
                                                                                  {ListCheck.length>0?

                                                                                <CustomPopover
                                                                                    // icon={faBolt}
                                                                                    nav={true}
                                                                                    data={reportActionList}
                                                                                    Button={true}
                                                                                    hideIcon={true}
                                                                                    btnClasses="btn-circle btn_grey ml-2"
                                                                                    textKey="value"
                                                                                    // iconKey="ntransactionstatus"
                                                                                    dynamicButton={(value) => this.reportMethod(value)}
                                                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                                                />:""}
                                                                                {/* <Nav.Link name={"batchReport"}
                                                                                    //hidden={this.state.userRoleControlRights.indexOf(reportId) === -1}
                                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                    title={this.props.intl.formatMessage({ id: "IDS_BATCHREPORT" })}
                                                                                   // onClick={() => this.onClickReport(this.props.Login.masterData.BA_SelectedBatchCreation[0],1,reportId)}
                                                                                >
                                                                                    <DocViewer file={samplePdf} type={"pdf"} className="p-0"></DocViewer>
                                                                                </Nav.Link> */}
                                                                                {/* <Nav.Link name={"Report"}
                                                                                    hidden={this.state.userRoleControlRights.indexOf(reportId) === -1}
                                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                    title={this.props.intl.formatMessage({ id: "IDS_REPORT" })}
                                                                                    onClick={() => this.onClickReport(this.props.Login.masterData.BA_SelectedBatchCreation[0],1,reportId)}
                                                                                >
                                                                                    <FontAwesomeIcon icon={faListAlt}  />
                                                                                </Nav.Link> */}
                                                                                {this.props.Login.masterData.roleChecklist && this.props.Login.masterData.roleChecklist.nchecklistversioncode!==-1 ?

                                                                                    <Nav.Link name={"checklist"}
                                                                                        className="btn btn-circle outline-grey mr-2"
                                                                                        // title={this.props.intl.formatMessage({ id: "IDS_CHECKLIST" })}
                                                                                        hidden={this.state.userRoleControlRights.indexOf(checkListActionId) === -1}
                                                                                        data-tip={this.props.intl.formatMessage({ id: "IDS_CHECKLIST" })}
                                                                                        //data-for="tooltip-common-wrap"
                                                                                        onClick={() => this.props.getRoleChecklist(
                                                                                            this.props.Login.masterData.roleChecklist.nchecklistversioncode,
                                                                                            this.props.Login.masterData.BA_SelectedBatchCreation[0].nreleasebatchcode,
                                                                                            this.props.Login.userInfo)}
                                                                                    >
                                                                                        <FontAwesomeIcon icon={faListAlt}
                                                                                        // title={this.props.intl.formatMessage({ id: "IDS_CHECKLIST" })}
                                                                                        />
                                                                                    </Nav.Link>
                                                                                    : ""}
                                                                                {this.props.Login.masterData.actionStatus &&
                                                                                    this.state.userRoleControlRights.indexOf(approvalActionId) !== -1 &&
                                                                                    actionStatus.map(action =>
                                                                                        <Nav.Link name={action.stransdisplaystatus}
                                                                                            className="btn btn-circle outline-grey mr-2"
                                                                                            // title={action.stransdisplaystatus}
                                                                                            data-tip={action.stransdisplaystatus}
                                                                                           // data-for="tooltip-common-wrap"
                                                                                            onClick={() => this.validateBatchTest(action, 2,approvalActionId)}
                                                                                        >
                                                                                            {getStatusIcon(action.ntransactionstatus)}
                                                                                        </Nav.Link>
                                                                                    )
                                                                                }
                                                                                {/* </Tooltip> */}
                                                                            </div>
                                                                        </Card.Subtitle>
                                                                    </Card.Header >
                                                                    <Card.Body p-0 className="form-static-wrap">
                                                                        <Card.Text>
                                                                            <Row>
                                                                                <Col md={4}>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_BATCHREGISTRATIONDATE" message="Batch Reg Date" /></FormLabel>
                                                                                        <ReadOnlyText>{this.props.Login.masterData.BA_SelectedBatchCreation[0].sbatchregdate}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col md={4}>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_PRODUCT" message="Product" /></FormLabel>
                                                                                        <ReadOnlyText>{this.props.Login.masterData.BA_SelectedBatchCreation[0].sproductname}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                                <Col md={4}>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_MANUFACTURER" message="Manufacturer" /></FormLabel>
                                                                                        <ReadOnlyText>
                                                                                            {this.props.Login.masterData.BA_SelectedBatchCreation[0].smanufname}
                                                                                        </ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                                <Col md={4}>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_STUDYPLAN" message="Study Plan" /></FormLabel>
                                                                                        <ReadOnlyText>
                                                                                            {this.props.Login.masterData.BA_SelectedBatchCreation[0].sspecname}
                                                                                        </ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                                <Col md={4}>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_BATCHFILINGNUMBER" message="Batch Filing Lot No." /></FormLabel>
                                                                                        <ReadOnlyText>{this.props.Login.masterData.BA_SelectedBatchCreation[0].sbatchfillinglotno} </ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                                <Col md={4}>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_PACKINGLOTNUMBER" message="Packing Lot No." /></FormLabel>
                                                                                        <ReadOnlyText>
                                                                                            {this.props.Login.masterData.BA_SelectedBatchCreation[0].spackinglotno === null || this.props.Login.masterData.BA_SelectedBatchCreation[0].spackinglotno.length === 0 ? '-' :
                                                                                            this.props.Login.masterData.BA_SelectedBatchCreation[0].spackinglotno}
                                                                                        </ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                                <Col md={4}>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_MAHOLDERNAME" message="MA Holder" /></FormLabel>
                                                                                        <ReadOnlyText>{this.props.Login.masterData.BA_SelectedBatchCreation[0].smahname}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                                <Col md={4}>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_NOOFCONTAINER" message="No. of Container" /></FormLabel>
                                                                                        <ReadOnlyText>{this.props.Login.masterData.BA_SelectedBatchCreation[0].nnoofcontainer} </ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                                <Col md={4}>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_FINALBULKNUMBER" message="Final Bulk No." /></FormLabel>
                                                                                        <ReadOnlyText>
                                                                                            {this.props.Login.masterData.BA_SelectedBatchCreation[0].sfinalbulkno === null || this.props.Login.masterData.BA_SelectedBatchCreation[0].sfinalbulkno.length === 0 ? '-' :
                                                                                            this.props.Login.masterData.BA_SelectedBatchCreation[0].sfinalbulkno}
                                                                                        </ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                                <Col md={4}>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_BATCHSPECIFICINFO" message="Batch Spec Var Info" /></FormLabel>
                                                                                        <ReadOnlyText>
                                                                                            {this.props.Login.masterData.BA_SelectedBatchCreation[0].sbatchspecvarinfo === null || this.props.Login.masterData.BA_SelectedBatchCreation[0].sbatchspecvarinfo.length === 0 ? '-' :
                                                                                            this.props.Login.masterData.BA_SelectedBatchCreation[0].sbatchspecvarinfo}
                                                                                        </ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                                <Col md={4}>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_MANUFORDERNO" message="IDS_MANUFORDERNO" /></FormLabel>
                                                                                        <ReadOnlyText>
                                                                                            {this.props.Login.masterData.BA_SelectedBatchCreation[0].smanuforderno === null || this.props.Login.masterData.BA_SelectedBatchCreation[0].smanuforderno.length === 0 ? '-' :
                                                                                            this.props.Login.masterData.BA_SelectedBatchCreation[0].smanuforderno}
                                                                                        </ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                                <Col md={4}>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_VALIDITYSTARTDATE" message="Validity Start Date" /></FormLabel>
                                                                                        <ReadOnlyText>{this.props.Login.masterData.BA_SelectedBatchCreation[0].svaliditystartdate}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                                <Col md={4}>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_EXPIRYDATE" message="Expiry Date" /></FormLabel>
                                                                                        <ReadOnlyText>{this.props.Login.masterData.BA_SelectedBatchCreation[0].sexpirydate}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                                <Col md={6}>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_NIBSCCOMMENTS" message="IDS_NIBSCCOMMENTS" /></FormLabel>
                                                                                        <ReadOnlyText>{this.props.Login.masterData.BA_SelectedBatchCreation[0].snibsccomments}</ReadOnlyText>
                                                                                        <ReadOnlyText>
                                                                                            {this.props.Login.masterData.BA_SelectedBatchCreation[0].snibsccomments === null || this.props.Login.masterData.BA_SelectedBatchCreation[0].snibsccomments.length === 0 ? '-' :
                                                                                            this.props.Login.masterData.BA_SelectedBatchCreation[0].snibsccomments}
                                                                                        </ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                            </Row>

                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                                <Row>
                                                                    <Col md={12}>
                                                                        <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                                                                    </Col>
                                                                </Row>
                                                            </>
                                                            : ""
                                                        }
                                                    </ContentPanel>
                                                </div>
                                            </>
                                        </div>
                                    </ScrollBar>
                                </SplitterLayout>
                            </div>
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
                        mandatoryFields={mandatoryFields}
                        noSave={this.props.Login.noSave}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            <SpecView
                                selectedRecord={this.state.selectedRecord}
                                SpecComponents={this.props.Login.SpecComponents}
                                userInfo={this.props.Login.userInfo}
                            />
                        }
                    />
                    : ""
                }
                {this.props.Login.templateData && this.props.Login.templateData.length > 0 ?
                    <TemplateForm
                        templateData={this.props.Login.templateData}
                        needSaveButton={this.props.Login.needSaveButton}
                        formRef={this.formRef}
                        viewScreen={true}
                        onSaveClick={this.props.onSaveBatchChecklist}
                        Login={this.props.Login}
                        selectedRecord={this.state.selectedRecord}
                        handleClose={this.handleClose}
                        onTemplateInputChange={this.onTemplateInputChange}
                        onTemplateComboChange={this.onTemplateComboChange}
                        onTemplateDateChange={this.onTemplateDateChange}
                        needValidation={true}

                    /> : ""
                }
                {
                    this.props.Login.showConfirmAlert ?
                        this.confirmAlert()
                        : ""
                }
            </>
        );
    }
    componentDidUpdate(previousProps) {
        let { userRoleControlRights, controlMap, selectedRecord, filterRecord, filterStatusList, approvalVersionList,
             parameterMap, testComments, historyMap, batchApprovalHistory, batchDecisionHistory,
            batchClockHistory, checklistHistory, batchAttachments,
            componentDataState,parameterDataState,testCommentDataState,sampleHistoryDataState,
            batchApprovalDataState,decisionDataState,batchClockDataState,checklistDataState,
            batchAttachmentDataState,sampleapprovalDataState } = this.state;
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
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {

            selectedRecord = this.props.Login.selectedRecord
            bool = true;
        }
        if (this.props.Login.filterRecord !== previousProps.Login.filterRecord) {

            filterRecord = this.props.Login.filterRecord
            bool = true;
        }
        if(this.props.Login.updateDataState !== previousProps.Login.updateDataState){

            if(this.props.Login.updateDataState){
                this.props.Login.updateDataState = false;
                componentDataState = this.props.Login.componentDataState || componentDataState
                sampleapprovalDataState=this.props.Login.sampleapprovalDataState || sampleapprovalDataState
                parameterDataState = this.props.Login.parameterDataState || parameterDataState
                testCommentDataState = this.props.Login.testCommentDataState || testCommentDataState
                sampleHistoryDataState = this.props.Login.sampleHistoryDataState || sampleHistoryDataState
                batchApprovalDataState = this.props.Login.batchApprovalDataState || batchApprovalDataState
                decisionDataState = this.props.Login.decisionDataState || decisionDataState
                batchClockDataState = this.props.Login.batchClockDataState || batchClockDataState
                checklistDataState = this.props.Login.checklistDataState || checklistDataState
                batchAttachmentDataState = this.props.Login.batchAttachmentDataState || batchAttachmentDataState
            }

        }
        if (this.props.Login.masterData.BA_FilterStatus !== previousProps.Login.masterData.BA_FilterStatus ||
            this.props.Login.masterData.BA_ApprovalVersion !== previousProps.Login.masterData.BA_ApprovalVersion) {

            const FilterStatusListMap = constructOptionList(this.props.Login.masterData.BA_FilterStatus || [], "ntransactionstatus", "sfilterstatus", undefined, undefined, true);
            const ConfigVersionListMap = constructOptionList(this.props.Login.masterData.BA_ApprovalVersion || [], "napprovalconfigversioncode", "sversionname", 'descending', 'ntransactionstatus', false);
            filterStatusList = FilterStatusListMap.get("OptionList");
            approvalVersionList = ConfigVersionListMap.get("OptionList");
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            bool = true;
            let paramMap = parameterMap || new Map();
            let histMap = historyMap || new Map();
            this.props.Login.masterData.Parameter && paramMap.set(parseInt(Object.keys(this.props.Login.masterData.Parameter)[0]), Object.values(this.props.Login.masterData.Parameter)[0]);
            this.props.Login.masterData.BA_SampleApprovalHistory && histMap.set(parseInt(Object.keys(this.props.Login.masterData.BA_SampleApprovalHistory)[0]), Object.values(this.props.Login.masterData.BA_SampleApprovalHistory)[0]);
           // componentList = process(this.props.Login.masterData.BA_BatchComponent || [], this.state.componentDataState)          
           // sampleapprovalList = process(this.props.Login.masterData.BA_BatchComponent || [], this.state.sampleapprovalDataState)  
            parameterMap = paramMap
            testComments = this.props.Login.masterData.BA_TestComments || []
            historyMap = histMap
            batchApprovalHistory = process(this.props.Login.masterData.BA_BatchApprovalHistory || [], this.state.batchApprovalDataState).data
            batchDecisionHistory = process(this.props.Login.masterData.BA_BatchDecisionHistory || [], this.state.decisionDataState).data
            batchClockHistory = process(this.props.Login.masterData.BA_BatchClockHistory || [], this.state.batchClockDataState).data
            checklistHistory = process(this.props.Login.masterData.BA_BatchChecklistHistory || [], this.state.checklistDataState).data
            //batchAttachments=process(this.props.Login.masterData.BA_BatchComponent,this.state.componentDataState)

        }
        if (bool) {
            bool = false;
            this.setState({
                userRoleControlRights, controlMap, filterStatusList, approvalVersionList, filterRecord, selectedRecord,
                 parameterMap, testComments, historyMap, batchApprovalHistory, batchDecisionHistory,
                batchClockHistory, checklistHistory, batchAttachments,
                componentDataState,parameterDataState,testCommentDataState,sampleHistoryDataState,
                batchApprovalDataState,decisionDataState,batchClockDataState,checklistDataState,
                batchAttachmentDataState,sampleapprovalDataState
            });
        }
    }
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
                ndecisionstatus: selectedRecord.ndecision,
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
    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }
    handleDateChange = (dateName, dateValue) => {
        const { filterRecord } = this.state;
        filterRecord[dateName] = dateValue;
        this.setState({ filterRecord });
    }
    onApprovalVersionChange = (comboData, fieldName) => {
        const filterRecord = this.state.filterRecord || {};
        filterRecord[fieldName] = comboData;
        this.props.getBAFilterStatus(filterRecord, this.props.Login.masterData, this.props.Login.userInfo);
    }
    onFilterComboChange = (comboData, fieldName) => {
        const filterRecord = this.state.filterRecord || {};
        filterRecord[fieldName] = comboData;
        this.setState({ filterRecord });
    }
    onReload = () => {
        let { BA_fromDate, BA_toDate, BA_FilterStatusValue, BA_ApprovalVersionValue } = this.props.Login.masterData
        let masterData = { ...this.props.Login.masterData, BA_fromDate, BA_toDate, BA_FilterStatusValue, BA_ApprovalVersionValue }
        let inputData = {
            nreleasebatchcode: 0,
            ntransactionstatus: BA_FilterStatusValue ? BA_FilterStatusValue.ntransactionstatus : -2,
            napprovalversioncode: BA_ApprovalVersionValue ? BA_ApprovalVersionValue.napprovalconfigversioncode : -1,
            userinfo: this.props.Login.userInfo,
            activeBATab: this.props.Login.activeBATab || "",
        }
        if (BA_FilterStatusValue && BA_ApprovalVersionValue) {

            //let obj = this.covertDatetoString(BA_fromDate, BA_toDate)
            let obj = convertDateValuetoString(BA_fromDate,BA_toDate, this.props.Login.userInfo); 

            inputData['dfrom'] = obj.fromDate;
            inputData['dto'] = obj.toDate;
            let inputParam = {
                masterData,
                inputData,
                searchRef: this.searchRef,
                componentDataState: this.state.componentDataState,
                parameterDataState: this.state.parameterDataState,
                testCommentDataState: this.state.testCommentDataState,
                sampleHistoryDataState: this.state.sampleHistoryDataState,
                batchApprovalDataState: this.state.batchApprovalDataState,
                decisionDataState: this.state.decisionDataState,
                batchClockDataState: this.state.batchClockDataState,
                checklistDataState: this.state.checklistDataState,
                batchAttachmentDataState: this.state.batchAttachmentDataState,
                sampleapprovalDataState:this.state.sampleapprovalDataState,
            }
            this.props.getBatchCreation(inputParam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }
    }
    onFilterSubmit = () => {
        let { filterRecord } = this.state;
        let BA_fromDate = filterRecord.fromDate || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.BA_fromDate); //new Date(this.props.Login.masterData.BA_fromDate)
        let BA_toDate = filterRecord.toDate || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.BA_toDate); //new Date(this.props.Login.masterData.BA_toDate)
        let BA_FilterStatusValue = (filterRecord.ntransactionstatus && filterRecord.ntransactionstatus.item) || this.props.Login.masterData.BA_FilterStatusValue
        let BA_ApprovalVersionValue = (filterRecord.napproveconfversioncode && filterRecord.napproveconfversioncode.item) || this.props.Login.masterData.BA_ApprovalVersionValue
        let masterData = { ...this.props.Login.masterData, BA_fromDate, BA_toDate, BA_FilterStatusValue, BA_ApprovalVersionValue }
        let inputData = {
            nreleasebatchcode: 0,
            ntransactionstatus: BA_FilterStatusValue ? BA_FilterStatusValue.ntransactionstatus : -2,
            napprovalversioncode: BA_ApprovalVersionValue ? BA_ApprovalVersionValue.napprovalconfigversioncode : -1,
            userinfo: this.props.Login.userInfo,
            activeBATab: this.props.Login.activeBATab || "",
        }
        if (BA_FilterStatusValue && BA_ApprovalVersionValue) {

            //let obj = this.covertDatetoString(BA_fromDate, BA_toDate)
            let obj = convertDateValuetoString(BA_fromDate,BA_toDate, this.props.Login.userInfo); 

            inputData['dfrom'] = obj.fromDate;
            inputData['dto'] = obj.toDate;
            let inputParam = {
                masterData,
                inputData,
                searchRef: this.searchRef,
                componentDataState: this.state.componentDataState,
                parameterDataState: this.state.parameterDataState,
                testCommentDataState: this.state.testCommentDataState,
                sampleHistoryDataState: this.state.sampleHistoryDataState,
                batchApprovalDataState: this.state.batchApprovalDataState,
                decisionDataState: this.state.decisionDataState,
                batchClockDataState: this.state.batchClockDataState,
                checklistDataState: this.state.checklistDataState,
                batchAttachmentDataState: this.state.batchAttachmentDataState,
            }
            this.props.getBatchCreation(inputParam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }
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
    tabDetail = () => {
        let ntransactiontestcode = this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";

        const tabMap = new Map();
        tabMap.set("IDS_COMPONENTS",
            <CerGenTabs
                userInfo={this.props.Login.userInfo}
                masterData={this.props.Login.masterData}
                inputParam={this.props.Login.inputParam}
              //  dataResult={this.state.componentList}
                dataResult={ process(this.props.Login.masterData.BA_BatchComponent, this.state.componentDataState)}
                dataState={this.state.componentDataState}
                dataStateChange={this.dataStateChange}
                screenName="IDS_COMPONENTS"
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                getStatusCombo={this.props.getStatusCombo}
                viewFile={this.props.viewAttachment}
                checkListRecord={this.props.BA_viewCheckList}
                primaryKeyField=""
                primaryList=""
                columnList={
                    [
                        { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "300px" },
                        { "idsName": "IDS_COMPONENTNAME", "dataField": "scomponentname", "width": "300px" },
                        { "idsName": "IDS_MANUFACTUREBATCHLOTNO", "dataField": "smanuflotno", "width": "250px" },
                        { "idsName": "IDS_DATERECEIVED", "dataField": "sreceiveddate", "width": "300px" },
                    ]
                }
                methodUrl={"CertificateGeneration"}
                selectedId={0}
                expandField="expanded"
                handleExpandChange={this.getTestParameter}
                hasChild={true}
                childColumnList={
                    [
                        { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "270px" },
                        { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametersynonym", "width": "270px" },
                        { "idsName": "IDS_RESULTS", "dataField": "sresult", "width": "170px" },
                        { "idsName": "IDS_RESULTFLAG", "dataField": "sgradename", "width": "100px" },
                        { "idsName": "IDS_RESULTDATE", "dataField": "sentereddate", "width": "170px" },
                        { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "100px" },
                    ]
                }
                childList={this.props.Login.testMap || new Map()}
            />
        )
        tabMap.set("IDS_TESTCOMMENTS",
            <Comments
                screenName="IDS_TESTCOMMENTS"
                selectedMaster={this.props.Login.masterData.BA_SelectedBatchCreation}
                onSaveClick={this.onCommentsSaveClick}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                Comments={this.state.testComments}
                fetchRecord={this.props.getCommentsCombo}
                masterList={this.props.Login.masterData.BA_SelectedBatchCreation}
                masterAlertStatus={"IDS_SELECTTESTTOADDCOMMENTS"}
                addName={"AddTestComment"}
                editName={"EditTestComment"}
                deleteName={"DeleteTestComment"}
                methodUrl={"TestComment"}
                isTestComment={false}
                primaryKeyField={"ntestcommentcode"}
                dataState={this.state.testCommentDataState}
                dataStateChange={this.dataStateChange}
                isActionRequired={false}
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
            />
        )
        tabMap.set("IDS_SAMPLEAPPROVALHISTORY",
            <CerGenTabs
                userInfo={this.props.Login.userInfo}
                masterData={this.props.Login.masterData}
                inputParam={this.props.Login.inputParam}
                //dataResult={this.state.sampleapprovalList||[]}
                dataResult={process(this.props.Login.masterData.BA_BatchComponent, this.state.sampleapprovalDataState)}
                dataState={this.state.sampleapprovalDataState}
                dataStateChange={this.dataStateChange}
                screenName="IDS_SAMPLEAPPROVALHISTORY"
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                primaryKeyField=""
                primaryList=""
                columnList={[
                    { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "300px" },
                    { "idsName": "IDS_COMPONENTNAME", "dataField": "scomponentname", "width": "300px" },
                    { "idsName": "IDS_MANUFACTUREBATCHLOTNO", "dataField": "smanuflotno", "width": "250px" },
                    { "idsName": "IDS_DATERECEIVED", "dataField": "sreceiveddate", "width": "300px" },
                ]}
                methodUrl={"CertificateGeneration"}
                selectedId={0}
                expandField="expanded"
                handleExpandChange={this.getSampleApprovalHistory}
                hasChild={true}
                childColumnList={
                    [
                        { "idsName": "IDS_ARNUMBER", "dataField": "sarno", "width": "200px" },
                        { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "200px" },
                        { "idsName": "IDS_USERNAME", "dataField": "username", "width": "200px" },
                        { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" },
                        { "idsName": "IDS_TRANSDATE", "dataField": "stransactiondate", "width": "450px" }
                    ]
                }
                childList={this.state.historyMap || new Map()}
            />
        )
        tabMap.set("IDS_BATCHAPPROVALHISTORY",
            <BatchApprovalHistory
                screenName="IDS_BATCHAPPROVALHISTORY"
                primaryKeyField='nbatchapprovalhistorycode'
                ApprovalHistory={this.props.Login.masterData.BA_BatchApprovalHistory || []}
                dataState={this.state.batchApprovalDataState}
                dataStateChange={this.dataStateChange}
                userInfo={this.props.Login.userInfo}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                inputParam={this.props.Login.inputParam}
            />
        )
        tabMap.set("IDS_BATCHDECISIONHISTORY",
            <BatchApprovalHistory
                screenName="IDS_BATCHDECISIONHISTORY"
                primaryKeyField='ndecisionhistorycode'
                ApprovalHistory={this.props.Login.masterData.BA_BatchDecisionHistory || []}
                dataState={this.state.decisionDataState}
                dataStateChange={this.dataStateChange}
                userInfo={this.props.Login.userInfo}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                inputParam={this.props.Login.inputParam}
            />
        )
        tabMap.set("IDS_BATCHCLOCKHISTORY",
            <BatchApprovalHistory
                primaryKeyField='nclockhistorycode'
                ApprovalHistory={this.props.Login.masterData.BA_BatchClockHistory || []}
                dataState={this.state.batchClockDataState}
                dataStateChange={this.dataStateChange}
                userInfo={this.props.Login.userInfo}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                inputParam={this.props.Login.inputParam}
                needActionType={true}
                screenName="IDS_BATCHCLOCKHISTORY"
            />
        )
        tabMap.set("IDS_CHECKLIST",
            <ResultGrid
                screenName="IDS_CHECKLIST"
                primaryKeyField={"ntransactionresultcode"}
               // data={this.state.checklistHistory}
                //dataResult={this.state.checklistHistory}
                dataResult={process(this.props.Login.masterData.BA_BatchChecklistHistory||[], this.state.checklistDataState)}
                dataState={this.state.checklistDataState}
                dataStateChange={this.dataStateChange}
                extractedColumnList={[
                    { "idsName": "IDS_BATCHRELEASENUMBER", "dataField": "nreleasebatchcode", "width": "250px" },
                    { "idsName": "IDS_CHECKLIST", "dataField": "schecklistname", "width": "250px", "fieldType": "checklistview", "checklistKey": "nchecklistversioncode" },
                    { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "250px" },
                ]}
                userInfo={this.props.Login.userInfo}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                inputParam={this.props.inputParam}
                pageable={true}
                isComponent={true}
                isActionRequired={false}
                isToolBarRequired={false}
                scrollable={"scrollable"}
                methodUrl={"Status"}
                fetchRecord={this.props.getStatusCombo}
                editParam={{}}
                selectedId={null}
                viewFile={this.props.viewFile}
                checkListRecord={this.props.BA_viewCheckList}
                actionColWidth="250px"
                attachmentParam={{}}
                checklistParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
            />
        )
        tabMap.set("IDS_ATTACHMENTS",
            <Attachments
                screenName="IDS_ATTACHMENTS"
                selectedMaster={this.props.Login.masterData.BA_SelectedBatchCreation}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                attachments={this.props.Login.masterData.BatchCreationFile || []}
                deleteRecord={this.props.deleteAttachment}
                fetchRecord={this.props.getAttachmentCombo}
                onSaveClick={this.onAttachmentSaveClick}
                masterList={this.props.Login.masterData.BA_SelectedBatchCreation}
                masterAlertStatus={"IDS_SELECTBatchTOADDATTACHEMENT"}
                addName={""}
                editName={""}
                deleteName={""}
                viewName={"ViewBatchAttachment"}
                methodUrl={"BatchCreationFile"}
                userInfo={this.props.Login.userInfo}
                subFields={[{ [designProperties.VALUE]: "screateddate" }]}
                moreField={[
                    { [designProperties.LABEL]: "IDS_DESCRIPTION", [designProperties.VALUE]: "sdescription" }
                ]}
            />
        )

        return tabMap;
    }
    onTabChange = (tabProps) => {
        const activeBATab = tabProps.screenName;
        if (activeBATab !== this.props.Login.activeBATab) {
            if (this.props.Login.masterData.BA_SelectedBatchCreation && this.props.Login.masterData.BA_SelectedBatchCreation.length > 0) {
                let inputData = {
                    masterData: this.props.Login.masterData,
                    nreleasebatchcode: this.props.Login.masterData.BA_SelectedBatchCreation ?
                        this.props.Login.masterData.BA_SelectedBatchCreation[0].nreleasebatchcode : "-1",
                    userinfo: this.props.Login.userInfo,
                    activeBATab,
                    BA_SelectedBatchCreation: this.props.Login.masterData.BA_SelectedBatchCreation,
                    screenName: activeBATab,
                    updateDataState : false,
                }
                this.props.getBAChildTabDetail(inputData)
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))
            }
        }
    }
    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
        setTimeout(() => { this._scrollBarRef.updateScroll() })
    };
    handleClose = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal
        let selectedRecord = this.props.Login.selectedRecord;
        let templateData = this.props.Login.templateData;
        let operation = this.props.Login.operation
        let showConfirmAlert = false;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "dynamic") {
                loadEsign = false;
                openModal = false;
                openChildModal = false;
                selectedRecord = {};
                templateData = {};
                operation = undefined
            }
            else {
                loadEsign = false;
            }
        }
        else {
            openModal = false;
            openChildModal = false;
            selectedRecord = {};
            templateData = {}
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, openChildModal, loadEsign, selectedRecord, templateData, selectedId: null, operation, showConfirmAlert }
        }
        this.props.updateStore(updateInfo);
    }
    validateBatchTest = (action, type,approvalActionId) => {
        let validAction = true;
        // let selectedRecord = this.props.Login.masterData.BA_SelectedBatchCreation[0]
        // if (action.ntransactionstatus === selectedRecord.ntransactionstatus) {
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_BATCHALREADY" }) + " " + selectedRecord.stransactionstatus);
        //     validAction = false;
        // } else {
        // let validationStatus = this.props.Login.masterData.BA_ValidationStatus || []

        // validationStatus.forEach(element => {
        //     if (element.ntransactionstatus !== selectedRecord.ntransactionstatus) {
        //         validAction = false;
        //     }
        // });
        //     let validStatus = validationStatus.map(x => x.svalidationstatus).join("/")
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECT" }) + " [" + validStatus + "] " + this.props.intl.formatMessage({ id: "IDS_BATCHONLY" }))
        // }

        //  }
        if (validAction) {

            let inputData = {
                nreleasebatchcode: this.props.Login.masterData.BA_SelectedBatchCreation[0].nreleasebatchcode,
                nactionstatus: action.ntransactionstatus,
                napprovalversioncode: this.state.filterRecord && this.state.filterRecord.napproveconfversioncode ? this.state.filterRecord.napproveconfversioncode.value || this.state.filterRecord.napproveconfversioncode.value : this.props.Login.masterData.BA_ApprovalVersionValue.napprovalconfigversioncode,
                isdecisionaction: type === 1 ? true : false,
                ntransactionstatus: this.props.Login.masterData.BA_FilterStatusValue.ntransactionstatus,
                selectedBatch: this.props.Login.masterData.BA_SelectedBatchCreation,
                userinfo: this.props.Login.userInfo,
                activeBATab: this.props.Login.activeBATab || "",
                ncontrolcode:approvalActionId
            };

            //let obj = this.covertDatetoString(this.props.Login.masterData.BA_fromDate, this.props.Login.masterData.BA_toDate)
            let obj = convertDateValuetoString(this.props.Login.masterData.BA_fromDate,this.props.Login.masterData.BA_toDate, 
                this.props.Login.userInfo); 

            inputData['dfrom'] = obj.fromDate;
            inputData['dto'] = obj.toDate;
            let inputParam = { action, type, inputData, masterData: this.props.Login.masterData, postParamList: this.postParamList }

            this.props.validateBatchTest(inputParam);

        }
    }
    confirmAlert = () => {
        this.props.Login.showConfirmAlert &&
            this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                this.props.intl.formatMessage({ id: "IDS_ADDEDTESTRESULTISNOTCOMPLETEDORAPPROVEDDOYOUWANTTOCONTINUE" }),
                this.props.intl.formatMessage({ id: "IDS_OK" }),
                this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                // () => this.performBatchAction(), 
                () => this.validateClockStatus(),
                undefined,
                () => this.closeAlert()
            );
    }

    validateRecalcTestAndOos = () => {
        return rsapi.post("batchapproval/validateRecalcTestAndOos", {
            nreleasebatchcode: this.props.Login.masterData.BA_SelectedBatchCreation[0].nreleasebatchcode,
            userinfo: this.props.Login.userInfo
        })
            .then(response => {
                if (response.data.isValidClockStatus === true) {
                    this.performBatchAction();
                }
                else {
                    this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                        this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                        response.data.rtnString,
                        this.props.intl.formatMessage({ id: "IDS_OK" }),
                        this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                        () => this.performBatchAction(),
                        false,
                        () => this.closeAlert());
                }

            })
            .catch(error => {
                if (error.response.status === 500) {
                    toast.error(this.props.intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(this.props.intl.formatMessage({ id: error.response }));
                }
            })
    }


    validateClockStatus = () => {
        return rsapi.post("batchapproval/validateClockStatus", {
            nreleasebatchcode: this.props.Login.masterData.BA_SelectedBatchCreation[0].nreleasebatchcode,
            userinfo: this.props.Login.userInfo
        })
            .then(response => {
                if (response.data === true) {
                    this.validateRecalcTestAndOos();
                }
                else {
                    this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                        this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                        this.props.intl.formatMessage({ id: "IDS_BATCHAPPROVALCLOCKSTATUS" }),
                        this.props.intl.formatMessage({ id: "IDS_OK" }),
                        this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                        () => this.validateRecalcTestAndOos(),
                        false,
                        () => this.closeAlert());
                }

            })
            .catch(error => {
                if (error.response.status === 500) {
                    toast.error(this.props.intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(this.props.intl.formatMessage({ id: error.response }));
                }
            })
    }

    performBatchAction = () => {
        this.closeAlert();

        if (this.props.Login.inputParam.action.nesignneed === transactionStatus.YES) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    showConfirmAlert: false,
                    loadEsign: true,
                    screenData: { inputParam: this.props.Login.inputParam, masterData: this.props.Login.inputParam.masterData },
                    openChildModal: true,
                    screenName: "performaction",
                    operation: "dynamic"
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.performBatchAction(this.props.Login.inputParam)
        }

    }
    closeAlert = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showConfirmAlert: false }
        }
        this.props.updateStore(updateInfo);
    }
    getTestParameter = (row, dataState) => {
        const viewParam = {
            userInfo: this.props.Login.userInfo, primaryKeyField: "npreregno",
            masterData: this.props.Login.masterData
        };

        this.props.getTestParameter({
            ...viewParam, dataState,
            primaryKeyValue: row["dataItem"][viewParam.primaryKeyField], viewRow: row["dataItem"]
        });

    }
    getSampleApprovalHistory = (row, dataState) => {
        const inputData = {
            userinfo: this.props.Login.userInfo,
            "npreregno": row["dataItem"]['npreregno']
        };

        this.props.getBASampleApprovalHistory({
            inputData,
            primaryKeyValue: row["dataItem"]['npreregno'],
            viewRow: row["dataItem"],
            masterData: this.props.Login.masterData,
            historyMap: this.state.historyMap
        });

    }
    reloadData = () => {
        this.searchRef.current.value = "";
        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;
        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo, fromDate, toDate,
                currentdate: formatInputDate(new Date(), true)
            },
            classUrl: "batchapproval",
            methodUrl: "BatchApproval",
            displayName: "IDS_BATCHAPPROVAL",
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
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
            this.props.validateEsignforBatchApproval(inputParam, "openChildModal");
        } else {
            this.props.validateEsignCredential(inputParam, "openChildModal");
        }
    }
    dataStateChange = (event) => {

        switch (this.props.Login.activeBATab) {
            case "IDS_COMPONENTS":
                const componentDataState=event.dataState;
                this.setState({
                    componentDataState: componentDataState,
                   // componentList: process(this.props.Login.masterData.BA_BatchComponent, event.dataState).data
                });
                break;
            case "IDS_SAMPLEAPPROVALHISTORY":
                this.setState({
                    sampleapprovalDataState: event.dataState,
                    //sampleapprovalList: process(this.props.Login.masterData.BA_BatchComponent, event.dataState).data
                });
                break;
            case "IDS_BATCHAPPROVALHISTORY":
                this.setState({
                    batchApprovalDataState: event.dataState,
                    batchApprovalHistory: process(this.props.Login.masterData.BA_BatchApprovalHistory, event.dataState).data
                });
                break;
            case "IDS_BATCHDECISIONHISTORY":
                this.setState({
                    decisionDataState: event.dataState,
                    batchDecisionHistory: process(this.props.Login.masterData.BA_BatchDecisionHistory, event.dataState).data
                });
                break;
            case "IDS_BATCHCLOCKHISTORY":
                this.setState({
                    batchClockDataState: event.dataState,
                    batchDecisionHistory: process(this.props.Login.masterData.BA_BatchClockHistory, event.dataState).data
                });
                break;
            case "IDS_TESTCOMMENTS":
                this.setState({
                    testCommentDataState: event.dataState,
                });
                break;
            case "IDS_CHECKLIST":
                this.setState({
                    checklistDataState: event.dataState,
                   // checklistHistory: process(this.props.Login.masterData.BA_BatchChecklistHistory, event.dataState).data
                });
                break;
            default:
                this.setState({
                    componentDataState: event.dataState,
                  //  componentList: process(this.props.Login.masterData.BA_BatchComponent, event.dataState).data
                });
                break;
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
}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential, getTestParameter, getBASampleApprovalHistory, BA_viewCheckList,
    validateEsignforBatchApproval, updateStore, getBatchCreation, getRoleChecklist, onSaveBatchChecklist, validateBatchTest,
    performBatchAction, getBAChildTabDetail, filterTransactionList, getBAFilterStatus, getSpecComponentView, onClickReport
})(injectIntl(BatchApproval));