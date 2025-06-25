import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { injectIntl, FormattedMessage } from 'react-intl';
import SplitterLayout from "react-splitter-layout";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Row, Col, Card, Nav, FormGroup, FormLabel, Button, } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faListAlt } from '@fortawesome/free-regular-svg-icons';
import { faPencilAlt, faTrashAlt, faCheckCircle, faCopy, faEye, faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
//import { Tooltip } from '@progress/kendo-react-tooltip';
// import ReactTooltip from 'react-tooltip';
//import { ReactComponent as Reports } from '../../../assets/image/generate-report.svg';
// import { ReactComponent as Reports } from '../../../assets/image/report-Icon.svg'
import {
    callService, crudMaster, validateEsignCredential, updateStore, getBatchCreationComboService,
    getBatchProductCategoryComboChange, getBatchProductComboChange, getBatchManufacturerComboChange,
    getBatchComponentComboService, getDataForAddBatchComponent, getAttachmentCombo, viewAttachment,
    deleteAttachment, getTestParameter, getCopyBatchCreationComboService, getBatchCreationDetail,
    validateBatchComplete, getBatchSampleApprovalHistory, getBatchCreationChildTabDetail, getSpecComponentView,
    getProductByCategory, filterColumnData, reloadBatchCreation, onClickReport
} from '../../../actions';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { showEsign, getControlMap, getStartOfDay, getEndOfDay, formatInputDate, constructOptionList, rearrangeDateFormat, convertDateValuetoString } from '../../../components/CommonScript';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import { transactionStatus, reportTypeEnum, reportCOAType, designProperties } from '../../../components/Enumeration';

import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { ReadOnlyText, ContentPanel, OutlineTransactionStatus, DecisionStatus } from '../../../components/App.styles';
import { ListWrapper } from '../../../components/client-group.styles';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';

import AddBatchCreation from './AddBatchCreation';
import Esign from '../../audittrail/Esign';
import BatchCreationTabs from './BatchCreationTabs';
import CopyBatchCreation from './CopyBatchCreation';
import SpecView from '../batchcreation/SpecView';
import TransactionListMaster from '../../../components/TransactionListMaster';
import BatchFilter from '../../../components/BatchFilter';
import { ProductList } from '../../testmanagement/testmaster-styled';
import CustomPopover from '../../../components/customPopover';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class BatchCreation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            masterStatus: "",
            multiLingualAlert: "",
            error: "",
            selectedRecord: {},
            operation: "",
            selectedBatchCreation: undefined,
            screenName: undefined,
            userRoleControlRights: [],
            controlMap: new Map(),
            showSaveContinue: true,
            showConfirmAlert: false,
            firstPane: 0,
            paneHeight: 0,
            secondPaneHeight: 0,
            tabPane: 0,
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],
            splitChangeWidthPercentage: 22,

            sahDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            bahDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            chDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            testCommentDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'sarno' }] },
            dataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },

        };
        this.searchRef = React.createRef();

        this.searchFieldList = ["nreleasebatchcode", "sbatchregdate", "sproductname", "smanufname", "sspecname", "sbatchfillinglotno",
                                "spackinglotno", "smahname", "nnoofcontainer", "sfinalbulkno", "sbatchspecvarinfo",
                                "smanuforderno", "snibsccomments", "stransactionstatus", "sdecision"];

        this.mandatoryFields = [{ "idsName": "IDS_PRODUCTCATEGORY", "dataField": "nproductcatcode", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                                { "idsName": "IDS_PRODUCT", "dataField": "nproductcode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                                { "idsName": "IDS_STUDYPLAN", "dataField": "nallottedspeccode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                                { "idsName": "IDS_MANUFACTURERNAME", "dataField": "nproductmanufcode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                                { "idsName": "IDS_MAHOLDERNAME", "dataField": "nproductmahcode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                                { "idsName": "IDS_NOOFCONTAINER", "dataField": "nnoofcontainer" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                                { "idsName": "IDS_BATCHFILINGNUMBER", "dataField": "sbatchfillinglotno", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
                                { "idsName": "IDS_FINALBULKNUMBER", "dataField": "sfinalbulkno" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                                { "idsName": "IDS_VALIDITYSTARTDATE", "dataField": "dvaliditystartdate", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
                                { "idsName": "IDS_VALIDITYSTARTTIMEZONE", "dataField": "ntzvaliditystartdate" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                                { "idsName": "IDS_EXPIRYDATE", "dataField": "dexpirydate" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                                { "idsName": "IDS_EXPIRYTIMEZONE", "dataField": "ntzexpirydate" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"}];


        this.copyMandatoryFields = [
            { "idsName": "IDS_BATCHFILINGNUMBER", "dataField": "sbatchfillinglotno" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_VALIDITYSTARTDATE", "dataField": "dvaliditystartdate", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
            { "idsName": "IDS_VALIDITYSTARTTIMEZONE", "dataField": "ntzvaliditystartdate", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_EXPIRYDATE", "dataField": "dexpirydate", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_EXPIRYTIMEZONE", "dataField": "ntzexpirydate", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" }];


        this.confirmMessage = new ConfirmMessage();
    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }
        if (props.Login.multiLingualAlert && props.Login.multiLingualAlert !== "" && props.Login.multiLingualAlert !== state.multiLingualAlert) {
            toast.warn(props.intl.formatMessage({ id: `${props.Login.multiLingualAlert}` }));
            props.Login.multiLingualAlert = undefined;
        }
        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        if (props.Login.selectedRecord === undefined) {
            return { selectedRecord: {} }
        }
        if (props.Login.showConfirmAlert !== state.showConfirmAlert) {
            return {
                showConfirmAlert: props.Login.showConfirmAlert
            }
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

    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
    }

    render() {

        const addId = this.state.controlMap.has("AddBatchCreation") && this.state.controlMap.get("AddBatchCreation").ncontrolcode;
        const editId = this.state.controlMap.has("EditBatchCreation") && this.state.controlMap.get("EditBatchCreation").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteBatchCreation") && this.state.controlMap.get("DeleteBatchCreation").ncontrolcode
        const copyId = this.state.controlMap.has("CopyBatchCreation") && this.state.controlMap.get("CopyBatchCreation").ncontrolcode
        const completeId = this.state.controlMap.has("CompleteBatchCreation") && this.state.controlMap.get("CompleteBatchCreation").ncontrolcode

        const studyReportId = this.state.controlMap.has("BatchStudyReport") && this.state.controlMap.get("BatchStudyReport").ncontrolcode
        const reportId = this.state.controlMap.has("BatchReport") && this.state.controlMap.get("BatchReport").ncontrolcode
        const reportActionList = []
        if(this.state.userRoleControlRights.indexOf(studyReportId) !== -1){
            reportActionList.push({
                "method": 1, "value": this.props.intl.formatMessage({ id: "IDS_BATCHREPORT" }), "controlId": studyReportId 
            })
        }
        if(this.state.userRoleControlRights.indexOf(reportId) !== -1){
            reportActionList.push({ "method": 2, "value": this.props.intl.formatMessage({ id: "IDS_REPORT" }), "controlId": reportId })
        }

        const addParam = {
            screenName: "IDS_BATCHCREATION", primaryeyField: "nreleasebatchcode",
            primaryKeyValue: undefined, operation: "create", inputParam: this.props.Login.inputParam,
            userInfo: this.props.Login.userInfo, ncontrolCode: addId
        };

        const editParam = {
            screenName: "IDS_BATCHCREATION", operation: "update", primaryKeyField: "nreleasebatchcode",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
            ncontrolCode: editId, masterData: this.props.Login.masterData
        };

        const copyParam = {
            screenName: "IDS_BATCHCREATION", operation: "copy", primaryKeyField: "nreleasebatchcode",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
            ncontrolCode: copyId
        };

        let fromDate = "";
        let toDate = "";

        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
            fromDate = (this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"])) 
                        || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
                            //new Date(this.props.Login.masterData.FromDate);
            toDate = (this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"])) 
                        || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
                         //new Date(this.props.Login.masterData.ToDate);
        }

        let stransactionstatuscode = this.props.Login.masterData.SelectedFilterStatus ? String(this.props.Login.masterData.SelectedFilterStatus.ntransactionstatus) : null;

        if (this.state.selectedRecord && this.state.selectedRecord["nfiltertransstatus"] !== undefined) {
            stransactionstatuscode = this.state.selectedRecord["nfiltertransstatus"].value === String(0) ? null : String(this.state.selectedRecord["nfiltertransstatus"].value);
        }

        const filterParam = {
            inputListName: "BatchCreationList", selectedObject: "SelectedBatchCreation", primaryKeyField: "nreleasebatchcode",
            fetchUrl: "batchcreation/getBatchCreation",
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                fromDate, toDate, stransactionstatuscode,
                activeBCTab: this.props.Login.activeBCTab || "IDS_COMPONENT"
            },
            masterData: this.props.Login.masterData, unchangeList: ["FromDate", "ToDate", "SelectedFilterStatus"],
            searchFieldList: this.searchFieldList
        }

        let specViewParam = {};

        if (this.props.Login.masterData.SelectedBatchCreation) {
            specViewParam = {
                sspecname: this.props.Login.masterData.SelectedBatchCreation.sspecname,
                sproductname: this.props.Login.masterData.SelectedBatchCreation.sproductname,
                nallottedspeccode: this.props.Login.masterData.SelectedBatchCreation.nallottedspeccode,
                userInfo: this.props.Login.userInfo, modalName: "openModal"
            }
        }

        const breadCrumbData = this.state.filterData || [];
        return (<>
            {/* Start of get display*/}
            <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                {breadCrumbData.length > 0 ?
                    <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                    : ""}
                <Row noGutters={true}>
                    <Col md={12} className="parent-port-height sticky_head_parent" ref={(parentHeight) => { this.parentHeight = parentHeight }}>

                        {/* <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={25}> */}
                        <SplitterLayout borderColor="#999" percentage={true} secondaryInitialSize={this.state.splitChangeWidthPercentage}
                            onSecondaryPaneSizeChange={this.paneSizeChange} primaryIndex={1} primaryMinSize={40} secondaryMinSize={20}>
                            <TransactionListMaster
                                masterList={this.props.Login.masterData.searchedData || (this.props.Login.masterData.BatchCreationList || [])}
                                selectedMaster={[this.props.Login.masterData.SelectedBatchCreation]}
                                primaryKeyField="nreleasebatchcode"
                                getMasterDetail={this.props.getBatchCreationDetail}
                                inputParam={
                                    {
                                        userInfo: this.props.Login.userInfo, masterData: this.props.Login.masterData,
                                        activeBCTab: this.props.Login.activeBCTab || "IDS_COMPONENT",
                                       
                                        dataState:this.state.dataState,
                                        sahDataState:this.state.sahDataState,
                                        bahDataState:this.state.bahDataState,
                                        chDataState:this.state.chDataState,
                                        testCommentDataState: this.state.testCommentDataState,
                                    }
                                }
                                mainField="nreleasebatchcode"
                                selectedListName="SelectedBatchCreation"
                                objectName="BatchCreation"
                                listName="IDS_BATCHCREATION"
                                needValidation={false}
                                subFields={
                                    [
                                        { [designProperties.VALUE]: "sproductname" },
                                        { [designProperties.VALUE]: "smanufname" },
                                        { [designProperties.VALUE]: "smahname" },
                                        { [designProperties.VALUE]: "stransactionstatus", [designProperties.COLOUR]: "transstatuscolor" }
                                    ]
                                }
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
                                skip={this.state.skip}
                                take={this.state.take}
                                handlePageChange={this.handlePageChange}
                                commonActions={
                                    // <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}>
                                    <ProductList className="d-flex product-category float-right">
                                        {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                        <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                            data-for="tooltip-common-wrap"
                                            hidden={this.state.userRoleControlRights.indexOf(addId) === -1}
                                            onClick={() => this.props.getBatchCreationComboService(addParam)}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </Button>
                                        <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                            data-for="tooltip-common-wrap"
                                            onClick={() => this.reloadData(false)} >
                                            <RefreshIcon className='custom_icons'/>
                                        </Button>

                                    </ProductList>
                                    // </Tooltip>
                                }
                                filterComponent={[
                                    {
                                        "IDS_FILTER":
                                            <BatchFilter
                                                selectedRecord={this.state.selectedRecord || {}}
                                                handleDateChange={this.handleDateChange}
                                                onFilterComboChange={this.onComboChange}
                                                fromDate={fromDate}
                                                toDate={toDate}
                                                userInfo={this.props.Login.userInfo}
                                                statusList={this.state.filterStatusList}
                                                selectedFilterStatus={this.props.Login.masterData.SelectedFilterStatus}
                                            />
                                    }
                                ]}


                            />
                            <PerfectScrollbar>
                                <SplitterLayout vertical borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={400}
                                    customClassName="fixed_list_height">
                                    <PerfectScrollbar>
                                        <ContentPanel className="panel-main-content">
                                            <Card className="border-0">
                                                {this.props.Login.masterData.BatchCreationList && this.props.Login.masterData.BatchCreationList.length > 0
                                                    && this.props.Login.masterData.SelectedBatchCreation ?
                                                    <>
                                                        <Card.Header>
                                                            <Card.Title className="product-title-main">
                                                                {this.props.Login.masterData.SelectedBatchCreation.nreleasebatchcode}
                                                            </Card.Title>
                                                            <Card.Subtitle>
                                                                <div className="d-flex product-category">
                                                                    <h2 className="product-title-sub flex-grow-1">
                                                                        <OutlineTransactionStatus transcolor={this.props.Login.masterData.SelectedBatchCreation.transstatuscolor}>
                                                                            {this.props.Login.masterData.SelectedBatchCreation.stransactionstatus}
                                                                        </OutlineTransactionStatus>

                                                                        {/* {this.props.Login.masterData.SelectedBatchCreation.ndecision !== transactionStatus.DRAFT ?
                                                                        <DecisionStatus decisioncolor={this.props.Login.masterData.SelectedBatchCreation.decisioncolor}>
                                                                           {this.props.Login.masterData.SelectedBatchCreation.sdecision}
                                                                        </DecisionStatus>
                                                                    :""} */}

                                                                        {/* {this.props.Login.masterData.SelectedBatchCreation.ndecision!==transactionStatus.DRAFT?
                                                                    <span className={`btn btn-outlined btn-sm ml-3`} style={{color:decisionClass}} >
                                                                        {this.props.Login.masterData.SelectedBatchCreation.sdecision}
                                                                    </span>:""
                                                                    } */}
                                                                    </h2>
                                                                    {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                                    <div className="d-inline">

                                                                        <Nav.Link name={"specview"}
                                                                            className="btn btn-circle outline-grey mr-2"
                                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_SPECVIEW" })}
                                                                            data-for="tooltip-common-wrap"
                                                                            onClick={() => this.props.getSpecComponentView(specViewParam)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faEye} />
                                                                        </Nav.Link>

                                                                        <Nav.Link name="editBatchCreation"
                                                                            hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                            className="btn btn-circle outline-grey mr-2"
                                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                            data-for="tooltip-common-wrap"
                                                                            onClick={() => this.props.getBatchCreationComboService({ ...editParam, primaryKeyValue: this.props.Login.masterData.SelectedBatchCreation.nreleasebatchcode })}
                                                                        >
                                                                            <FontAwesomeIcon icon={faPencilAlt}
                                                                            //  title={this.props.intl.formatMessage({ id: "IDS_EDITBATCH" })}
                                                                            />
                                                                        </Nav.Link>

                                                                        <Nav.Link name="copyBatchCreation"
                                                                            hidden={this.state.userRoleControlRights.indexOf(copyId) === -1}
                                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                                                            data-for="tooltip-common-wrap"
                                                                            className="btn btn-circle outline-grey mr-2"
                                                                            onClick={() => this.props.getCopyBatchCreationComboService({ ...copyParam, primaryKeyValue: this.props.Login.masterData.SelectedBatchCreation.nreleasebatchcode })}
                                                                        >
                                                                            <FontAwesomeIcon icon={faCopy}
                                                                            // title={this.props.intl.formatMessage({ id: "IDS_COPYBATCH" })}
                                                                            />
                                                                        </Nav.Link>

                                                                        <Nav.Link name="completeBatchCreation"
                                                                            hidden={this.state.userRoleControlRights.indexOf(completeId) === -1}
                                                                            className="btn btn-circle outline-grey mr-2"
                                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_COMPLETE" })}
                                                                            data-for="tooltip-common-wrap"
                                                                            onClick={() => this.props.validateBatchComplete({
                                                                                masterData: this.props.Login.masterData,
                                                                                userInfo: this.props.Login.userInfo,
                                                                                userRoleControlRights: this.props.Login.userRoleControlRights,
                                                                                ncontrolCode: completeId,
                                                                                nreleasebatchcode: this.props.Login.masterData.SelectedBatchCreation.nreleasebatchcode
                                                                            })}
                                                                        >
                                                                            <FontAwesomeIcon icon={faCheckCircle}
                                                                            // title={this.props.intl.formatMessage({ id: "IDS_COMPLETEBATCH" })}
                                                                            />
                                                                        </Nav.Link>

                                                                        <Nav.Link name="deleteBatchCreation" className="btn btn-circle outline-grey mr-2"
                                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DELETEORCANCEL" })}
                                                                            data-for="tooltip-common-wrap"
                                                                            onClick={() => this.ConfirmDelete("BatchCreation", this.props.Login.masterData.SelectedBatchCreation,
                                                                                "delete", deleteId, fromDate, toDate)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faTrashAlt} />

                                                                            {/* <ConfirmDialog
                                                                            name="deleteMessage"
                                                                            message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                            doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                            doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                            icon={faTrashAlt}
                                                                            // title={this.props.intl.formatMessage({ id: "IDS_DELETEBATCH" })}
                                                                            handleClickDelete={() => this.deleteBatchCreation("BatchCreation", this.props.Login.masterData.SelectedBatchCreation,
                                                                                "delete", deleteId, fromDate, toDate)}
                                                                        /> */}
                                                                        </Nav.Link>

                                                                        {/* <Nav.Link name={"bc_batchReport"}
                                                                        hidden={this.state.userRoleControlRights.indexOf(studyReportId) === -1}
                                                                        className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                        title={this.props.intl.formatMessage({ id: "IDS_BATCHREPORT" })}
                                                                        onClick={() => this.onClickReport(this.props.Login.masterData.SelectedBatchCreation,2,studyReportId)}
                                                                    >
                                                                        <Reports className="custom_icons" width="20" height="20" />
                                                                    </Nav.Link>
                                                                    <Nav.Link name={"bc _report"}
                                                                        hidden={this.state.userRoleControlRights.indexOf(reportId) === -1}
                                                                        className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                        title={this.props.intl.formatMessage({ id: "IDS_REPORT" })}
                                                                        onClick={() => this.onClickReport(this.props.Login.masterData.SelectedBatchCreation,1,reportId)}
                                                                    >
                                                                        <Reports className="custom_icons" width="20" height="20" />
                                                                    </Nav.Link> */}

                                                                        {reportActionList.length>0?
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
                                                        <Card.Body className="form-static-wrap">
                                                            <Card.Text>
                                                                <Row>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_PRODUCTCATEGORY" message="Product Category" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedBatchCreation.sproductcatname}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_PRODUCT" message="Product" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedBatchCreation.sproductname}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_CHARGEBAND" message="Charge Band" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedBatchCreation.schargebandname}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_DEPARTMENT" message="Division" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedBatchCreation.sdeptname}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_STUDYPLAN" message="Study Plan" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedBatchCreation.sspecname}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_MANUFACTURER" message="Manufacturer" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedBatchCreation.smanufname}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_MANUFACTURERSITENAME" message="Manufacturer Site Name" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedBatchCreation.smanufsitename}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_EPROTOCOL" message="e-Protocol" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedBatchCreation.seprotocolname}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_MAHOLDERNAME" message="MA Holder" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedBatchCreation.smahname}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_LICENSENUMBER" message="License Number" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedBatchCreation.slicencenumber}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_CERTIFICATETYPE" message="Certificate Type" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedBatchCreation.scertificatetype}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_CONTAINERTYPE" message="Container Type" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedBatchCreation.scontainertype}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_MAHOLDERADDRESS" message="MA Holder Address" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedBatchCreation.saddress1}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_NOOFCONTAINER" message="No. of Container" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedBatchCreation.nnoofcontainer} </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_BATCHFILINGNUMBER" message="Batch Filing Lot No." /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedBatchCreation.sbatchfillinglotno} </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_PACKINGLOTNUMBER" message="Packing Lot No." /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedBatchCreation.spackinglotno === null || this.props.Login.masterData.SelectedBatchCreation.spackinglotno.length === 0 ? '-' :
                                                                                    this.props.Login.masterData.SelectedBatchCreation.spackinglotno}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_FINALBULKNUMBER" message="Final Bulk No." /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedBatchCreation.sfinalbulkno} </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_BATCHSPECVARINFO" message="Batch Spec Var Info" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedBatchCreation.sbatchspecvarinfo === null || this.props.Login.masterData.SelectedBatchCreation.sbatchspecvarinfo.length === 0 ? '-' :
                                                                                    this.props.Login.masterData.SelectedBatchCreation.sbatchspecvarinfo}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_MANUFORDERNO" message="Manufacture Order No" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedBatchCreation.smanuforderno === null || this.props.Login.masterData.SelectedBatchCreation.smanuforderno.length === 0 ? '-' :
                                                                                    this.props.Login.masterData.SelectedBatchCreation.smanuforderno}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_VALIDITYSTARTDATE" message="Validity Start Date" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedBatchCreation.svaliditystartdate}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_EXPIRYDATE" message="Expiry Date" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedBatchCreation.sexpirydate}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_BATCHREGISTRATIONDATE" message="Batch Registration Date" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedBatchCreation.sbatchregdate}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        {this.props.Login.masterData.SelectedBatchCreation.ndecision !== transactionStatus.DRAFT ?
                                                                            <FormGroup>
                                                                                <FormLabel><FormattedMessage id="IDS_DECISIONSTATUS" message="Desicion Status" /></FormLabel>
                                                                                <DecisionStatus style={{ marginLeft: "0rem" }}
                                                                                    decisioncolor={this.props.Login.masterData.SelectedBatchCreation.decisioncolor}>
                                                                                    {this.props.Login.masterData.SelectedBatchCreation.sdecision}
                                                                                </DecisionStatus>
                                                                            </FormGroup>
                                                                            : ""}

                                                                    </Col>

                                                                    <Col md={8}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_NIBSCCOMMENTS" message="NIBSC Comments" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedBatchCreation.snibsccomments === null || this.props.Login.masterData.SelectedBatchCreation.snibsccomments.length === 0 ? '-' :
                                                                                this.props.Login.masterData.SelectedBatchCreation.snibsccomments}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                            </Card.Text>
                                                            <BatchCreationTabs
                                                                operation={this.props.Login.operation}
                                                                inputParam={this.props.Login.inputParam}
                                                                screenName={this.props.Login.screenName}
                                                                userInfo={this.props.Login.userInfo}
                                                                masterData={this.props.Login.masterData}
                                                                crudMaster={this.props.crudMaster}
                                                                masterStatus={this.props.Login.masterStatus}
                                                                openChildModal={this.props.Login.openChildModal}
                                                                updateStore={this.props.updateStore}
                                                                selectedRecord={this.props.Login.selectedRecord}
                                                                getBatchComponentComboService={this.props.getBatchComponentComboService}
                                                                ncontrolCode={this.props.Login.ncontrolCode}
                                                                userRoleControlRights={this.state.userRoleControlRights}
                                                                esignRights={this.props.Login.userRoleControlRights}
                                                                screenData={this.props.Login.screenData}
                                                                validateEsignCredential={this.props.validateEsignCredential}
                                                                loadEsign={this.props.Login.loadEsign}
                                                                controlMap={this.state.controlMap}
                                                                selectedId={this.props.Login.selectedId}
                                                                //dataState={this.props.Login.dataState}
                                                                productCategoryList={this.props.Login.componentProductCatList}
                                                                productList={this.props.Login.componentProductList}
                                                                componentList={this.props.Login.componentList}
                                                                getDataForAddBatchComponent={this.props.getDataForAddBatchComponent}
                                                                addComponentDataList={this.props.Login.addComponentDataList}
                                                                selectedComponentList={this.props.Login.selectedComponentList}
                                                                addedComponentList={this.state.addedComponentList}
                                                                getProductByCategory={this.props.getProductByCategory}
                                                                getTestParameter={this.props.getTestParameter}
                                                                testParameterMap={this.props.Login.testMap || new Map()}

                                                                getAttachmentCombo={this.props.getAttachmentCombo}
                                                                viewAttachment={this.props.viewAttachment}
                                                                deleteAttachment={this.props.deleteAttachment}

                                                                getBatchSampleApprovalHistory={this.props.getBatchSampleApprovalHistory}
                                                                sampleApprovalMap={this.props.Login.sampleApprovalMap || new Map()}
                                                                clearComponentInput={this.clearComponentInput}
                                                                activeBCTab={this.props.Login.activeBCTab}
                                                                getBatchCreationChildTabDetail={this.props.getBatchCreationChildTabDetail}

                                                                batchComponentDeleteList={this.props.Login.batchComponentDeleteList}
                                                                
                                                                dataState={this.state.dataState}
                                                                sahDataState={this.state.sahDataState}
                                                                bahDataState={this.state.bahDataState}
                                                                chDataState={this.state.chDataState}
                                                                testCommentDataState={this.state.testCommentDataState}

                                                                dataStateChange ={this.dataStateChange}
                                                                sahDataStateChange ={this.sahDataStateChange}
                                                                bahDataStateChange ={this.bahDataStateChange}
                                                                chDataStateChange ={this.chDataStateChange}
                                                                testCommentDataStateChange ={this.testCommentDataStateChange}
                                                            />
                                                        </Card.Body>
                                                    </>
                                                    : ""
                                                }
                                            </Card>
                                        </ContentPanel>
                                    </PerfectScrollbar>
                                </SplitterLayout>
                            </PerfectScrollbar>
                        </SplitterLayout >
                    </Col>
                </Row>

            </ListWrapper>

            {/* End of get display*/}

            {/* Start of Modal Sideout for User Creation */}
            {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
            {
                this.props.Login.openModal ?
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.operation === "copy" ? this.copyMandatoryFields : this.mandatoryFields}
                        showSaveContinue={this.state.showSaveContinue}
                        noSave={this.props.Login.operation === "view" ? this.props.Login.noSave : false}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.operation === "view" ?
                                <SpecView
                                    selectedRecord={this.state.selectedRecord}
                                    SpecComponents={this.props.Login.SpecComponents}
                                    userInfo={this.props.Login.userInfo}
                                />

                                : this.props.Login.operation === "create" || this.props.Login.operation === "update" ?
                                    <AddBatchCreation
                                        selectedRecord={this.state.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        onComboChange={this.onComboChange}
                                        onNumericInputOnChange={this.onNumericInputOnChange}
                                        handleDateChange={this.handleDateChange}
                                        productCategoryList={this.props.Login.productCategoryList || []}
                                        productList={this.props.Login.productList || []}
                                        studyPlanList={this.props.Login.studyPlanList || []}
                                        manufacturerList={this.props.Login.productManufacturerList || []}
                                        maHolderList={this.props.Login.maHolderList || []}
                                        timeZoneList={this.props.Login.timeZoneList || []}
                                        selectedBacthCreation={this.props.Login.masterData.SelectedBatchCreation || {}}
                                        operation={this.props.Login.operation}
                                        inputParam={this.props.Login.inputParam}
                                        userInfo={this.props.Login.userInfo}
                                        onMultiColumnValue={this.onMultiColumnValue}
                                        onMultiColumnMAHChange={this.onMultiColumnMAHChange}
                                        batchCreationEditStatusList={this.props.Login.batchCreationEditStatusList}


                                    />
                                    : this.props.Login.operation === "copy" ?
                                        <CopyBatchCreation
                                            selectedRecord={this.state.selectedRecord || {}}
                                            onInputOnChange={this.onInputOnChange}
                                            handleDateChange={this.handleDateChange}
                                            timeZoneList={this.props.Login.timeZoneList || []}
                                            selectedBacthCreation={this.props.Login.masterData.SelectedBatchCreation || {}}
                                            operation={this.props.Login.operation}
                                            inputParam={this.props.Login.inputParam}
                                            userInfo={this.props.Login.userInfo}
                                        /> : ""
                        }
                    /> : ""
            }
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

    onCompleteBatch = () => {
        this.closeAlert();
        this.completeBatchCreation();
    }

    ConfirmDelete = (methodUrl, selectedBatch, operation, ncontrolCode) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETEORCANCEL" }),
            this.props.intl.formatMessage({ id: "IDS_DOYOUWANTTODELETEORCANCELBATCH" }) + ": " + selectedBatch.nreleasebatchcode + " ?",
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteBatchCreation(methodUrl, selectedBatch, operation, ncontrolCode));
    };

    completeBatchCreation = () => {
        const postParam = {
            inputListName: "BatchCreationList", selectedObject: "SelectedBatchCreation",
            primaryKeyField: "nreleasebatchcode",
            primaryKeyValue: this.props.Login.masterData.SelectedBatchCreation.nreleasebatchcode,
            fetchUrl: "batchcreation/getBatchCreation",
            fecthInputObject: this.props.Login.userInfo,
        }
        const inputParam = {
            classUrl: "batchcreation",
            methodUrl: "BatchCreation", postParam,
            inputData: {
                ncontrolcode: this.props.Login.ncontrolCode,
                "userinfo": this.props.Login.userInfo,
                nreleasebatchcode: this.props.Login.masterData.SelectedBatchCreation.nreleasebatchcode
            },
            operation: "complete", showConfirmAlert: false
        }
        //this.props.updateStore({ typeName: DEFAULT_RETURN, data: { showConfirmAlert: false } });  

        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);

        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: "IDS_BATCHCREATION",
                    operation: this.props.Login.operation,
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {

            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal", {});
        }

    }

    confirmAlert = () => {
        this.props.Login.showConfirmAlert &&
            this.confirmMessage.confirm(
                this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                this.props.intl.formatMessage({ id: "IDS_ADDEDTESTRESULTISNOTCOMPLETEDORAPPROVEDDOYOUWANTTOCONTINUE" }),
                this.props.intl.formatMessage({ id: "IDS_OK" }),
                this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                () => this.onCompleteBatch(),
                undefined,
                () => this.closeAlert());
    }

    closeAlert = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showConfirmAlert: false, loading: false }
        }
        this.props.updateStore(updateInfo);
    }

    dataStateChange = (event) => { this.setState({dataState: event.dataState});}

    sahDataStateChange = (event) => { this.setState({sahDataState: event.dataState});}

    bahDataStateChange = (event) => { this.setState({bahDataState: event.dataState});}

    chDataStateChange = (event) => { this.setState({chDataState: event.dataState});}

    testCommentDataStateChange = (event) => { this.setState({testCommentDataState: event.dataState});}

    componentDidUpdate(previousProps) {

        let { userRoleControlRights, controlMap, selectedRecord,  filterData, addedComponentList,
            filterStatusList, dataState, sahDataState, bahDataState, chDataState,testCommentDataState } = this.state;
        let isStateChanged = false;
       
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            isStateChanged = true;
            selectedRecord = this.props.Login.selectedRecord;
            //this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
           // this.setState({ userRoleControlRights, controlMap });
           isStateChanged = true;
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            filterData = this.generateBreadCrumData();
            addedComponentList = this.props.Login.masterData.BatchComponentCreation;

            const filterStatusListMap = constructOptionList(this.props.Login.masterData.BatchCreationFilterStatus || [], "ntransactionstatus", "stransdisplaystatus", undefined, undefined, true);
            filterStatusList = filterStatusListMap.get("OptionList");
            // this.setState({
            //     filterData, addedComponentList,
            //     filterStatusList
            // });
            isStateChanged = true;
        }
        if (this.props.Login.selectedComponentList !== previousProps.Login.selectedComponentList) {
            addedComponentList = this.props.Login.selectedComponentList;
            isStateChanged = true;
           // this.setState({ addedComponentList });
        }

        if (this.props.Login.dataState && this.props.Login.dataState !== previousProps.Login.dataState) {
            dataState = this.props.Login.dataState;
            isStateChanged = true;
        }

        if (this.props.Login.sahDataState && this.props.Login.sahDataState !== previousProps.Login.sahDataState) {
            sahDataState = this.props.Login.sahDataState;
            isStateChanged = true;
        }

        if (this.props.Login.bahDataState && this.props.Login.bahDataState !== previousProps.Login.bahDataState) {
            bahDataState = this.props.Login.bahDataState;
            isStateChanged = true;
        }

        if (this.props.Login.chDataState && this.props.Login.chDataState !== previousProps.Login.chDataState) {
            chDataState = this.props.Login.chDataState;
            isStateChanged = true;
        }
        
        if (this.props.Login.testCommentDataState && this.props.Login.testCommentDataState !== previousProps.Login.testCommentDataState) {
            testCommentDataState = this.props.Login.testCommentDataState;
            isStateChanged = true;
        }

        if (isStateChanged)
        {
            this.setState({userRoleControlRights, controlMap, selectedRecord,  filterData, addedComponentList,
                filterStatusList, dataState, sahDataState, bahDataState, chDataState,
                testCommentDataState });
        }
    }

    generateBreadCrumData() {
        const breadCrumbData = [];
        //let selectedRecord = this.state.selectedRecord;
        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) 
        {
           // let obj = this.convertDatetoString((selectedRecord && selectedRecord["fromdate"]) || this.props.Login.masterData.FromDate, (selectedRecord && selectedRecord["todate"]) || this.props.Login.masterData.ToDate);
            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
            breadCrumbData.push(
                {
                    "label": "IDS_FROM",
                    "value": obj.breadCrumbFrom
                },
                {
                    "label": "IDS_TO",
                    "value": obj.breadCrumbto
                },
                {
                    "label": "IDS_FILTERSTATUS",
                    "value": this.props.Login.masterData.SelectedFilterStatus ?
                        this.props.Login.masterData.SelectedFilterStatus.stransdisplaystatus
                        : this.props.intl.formatMessage({ id: "IDS_ALL" })
                    ///this.props.intl.formatMessage({ id: this.props.Login.masterData.SelectedFilterStatus.stransdisplaystatus || "IDS_ALL" }) : "IDS_ALL"
                }
            );
        }
        return breadCrumbData;
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;

        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "complete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null }
        }
        this.props.updateStore(updateInfo);

    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        if (fieldName === "nproductcatcode") {
            this.props.getBatchProductCategoryComboChange(selectedRecord);
        }
        else if (fieldName === "nproductcode") {
            this.props.getBatchProductComboChange(selectedRecord);
        }
        else {
            this.setState({ selectedRecord });
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

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    onDropImage = (attachedFiles, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = attachedFiles;
        this.setState({ selectedRecord, actionType: "new" });
    }

    onSaveClick = (saveType, formRef) => {

        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;

        let postParam = undefined;

        if (this.props.Login.operation === "copy") {
            // copy
            postParam = {
                inputListName: "BatchCreationList", selectedObject: "SelectedBatchCreation",
                primaryKeyField: "nreleasebatchcode", unchangeList: ["FromDate", "ToDate"], isSingleGet: true
            };

            inputData["batchcreation"] = JSON.parse(JSON.stringify(this.props.Login.masterData.SelectedBatchCreation));
            inputData["copybatchcreation"] = JSON.parse(JSON.stringify(this.props.Login.masterData.SelectedBatchCreation));
            inputData["copybatchcreation"]["sbatchfillinglotno"] = this.state.selectedRecord["sbatchfillinglotno"] || "";
            inputData["copybatchcreation"]["dvaliditystartdate"] = this.state.selectedRecord["dvaliditystartdate"];
            inputData["copybatchcreation"]["dexpirydate"] = this.state.selectedRecord["dexpirydate"];
            inputData["copybatchcreation"]["ntzvaliditystartdate"] = this.state.selectedRecord["ntzexpirydate"] ? this.state.selectedRecord["ntzexpirydate"].value : 1;
            inputData["copybatchcreation"]["stzvaliditystartdate"] = this.state.selectedRecord["stzvaliditystartdate"] || "";
            inputData["copybatchcreation"]["ntzexpirydate"] = this.state.selectedRecord["ntzexpirydate"] ? this.state.selectedRecord["ntzexpirydate"].value : 1;
            inputData["copybatchcreation"]["stzexpirydate"] = this.state.selectedRecord["stzexpirydate"] || "";
            inputData["copybatchcreation"]["nreleasebatchcode"] = -1;

            const validityStartDate = inputData["copybatchcreation"]["dvaliditystartdate"];

            //need this conversion when the datatype of the field is 'Instant'
            inputData["copybatchcreation"]["dvaliditystartdate"] = formatInputDate(validityStartDate, false);

            const expiryDate = inputData["copybatchcreation"]["dexpirydate"];

            //need this conversion when the datatype of the field is 'Instant'
            inputData["copybatchcreation"]["dexpirydate"] = formatInputDate(expiryDate, false);
        }
        else {
            if (this.props.Login.operation === "update") {
                // edit
                postParam = {
                    inputListName: "BatchCreationList", selectedObject: "SelectedBatchCreation",
                    primaryKeyField: "nreleasebatchcode", unchangeList: ["FromDate", "ToDate"]
                };
                inputData["batchcreation"] = {}
                inputData["batchcreation"]["nreleasebatchcode"] = this.props.Login.masterData.SelectedBatchCreation.nreleasebatchcode;
            }
            else {
                //add  
                postParam = { inputListName: "BatchCreationList", selectedObject: "SelectedBatchCreation", isSingleGet: true }
                inputData["batchcreation"] = {};
                inputData["activeBCTab"] = this.props.Login.activeBCTab;
            }

            inputData["batchcreation"]["nproductcatcode"] = this.state.selectedRecord["nproductcatcode"] ? this.state.selectedRecord["nproductcatcode"].value : transactionStatus.NA;
            inputData["batchcreation"]["nproductcode"] = this.state.selectedRecord["nproductcode"] ? this.state.selectedRecord["nproductcode"].value : transactionStatus.NA;
            inputData["batchcreation"]["nproductmanufcode"] = this.state.selectedRecord["nproductmanufcode"] ? this.state.selectedRecord["nproductmanufcode"] : transactionStatus.NA;
            inputData["batchcreation"]["nallottedspeccode"] = this.state.selectedRecord["nallottedspeccode"] ? this.state.selectedRecord["nallottedspeccode"].value : transactionStatus.NA;
            inputData["batchcreation"]["nproductmahcode"] = this.state.selectedRecord["nproductmahcode"] || "";
            inputData["batchcreation"]["nnoofcontainer"] = this.state.selectedRecord["nnoofcontainer"];
            inputData["batchcreation"]["sbatchfillinglotno"] = this.state.selectedRecord["sbatchfillinglotno"] || "";
            inputData["batchcreation"]["spackinglotno"] = this.state.selectedRecord["spackinglotno"] || "";
            inputData["batchcreation"]["sfinalbulkno"] = this.state.selectedRecord["sfinalbulkno"] || "";
            inputData["batchcreation"]["sbatchspecvarinfo"] = this.state.selectedRecord["sbatchspecvarinfo"] || "";
            inputData["batchcreation"]["snibsccomments"] = this.state.selectedRecord["snibsccomments"] || "";
            inputData["batchcreation"]["smanuforderno"] = this.state.selectedRecord["smanuforderno"] || "";
            inputData["batchcreation"]["dvaliditystartdate"] = this.state.selectedRecord["dvaliditystartdate"];
            inputData["batchcreation"]["dexpirydate"] = this.state.selectedRecord["dexpirydate"];
            inputData["batchcreation"]["ntzvaliditystartdate"] = this.state.selectedRecord["ntzexpirydate"] ? this.state.selectedRecord["ntzexpirydate"].value : 1;
            inputData["batchcreation"]["stzvaliditystartdate"] = this.state.selectedRecord["stzvaliditystartdate"] || "";
            inputData["batchcreation"]["ntzexpirydate"] = this.state.selectedRecord["ntzexpirydate"] ? this.state.selectedRecord["ntzexpirydate"].value : 1;
            inputData["batchcreation"]["stzexpirydate"] = this.state.selectedRecord["stzexpirydate"] || "";
            const validityStartDate = inputData["batchcreation"]["dvaliditystartdate"];

            //need this conversion when the datatype of the field is 'Instant'
            inputData["batchcreation"]["dvaliditystartdate"] = formatInputDate(validityStartDate, false);

            const expiryDate = inputData["batchcreation"]["dexpirydate"];

            //need this conversion when the datatype of the field is 'Instant'
            inputData["batchcreation"]["dexpirydate"] = formatInputDate(expiryDate, false);
        }

        const inputParam = {
            classUrl: "batchcreation",
            methodUrl: "BatchCreation",
            displayName: "IDS_BATCHCREATION",
            inputData: inputData, postParam, searchRef: this.searchRef,
            operation: this.props.Login.operation, saveType, formRef
        }

        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: "IDS_BATCHCREATION",
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            
            const selectedRecord = { ...this.state.selectedRecord, sbatchfillinglotno: "" }
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal", selectedRecord);
        }
    }

    deleteBatchCreation = (methodUrl, selectedBatch, operation, ncontrolCode) => {
        if (selectedBatch.ntransactionstatus === transactionStatus.CANCELLED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_BATCHALREADYCANCELLED" }));
        }
        else {

            const masterData = this.props.Login.masterData;
            const nextGetId = masterData["BatchCreationList"][0].nreleasebatchcode;

            const postParam = {
                inputListName: "BatchCreationList", selectedObject: "SelectedBatchCreation",
                primaryKeyField: "nreleasebatchcode",
                primaryKeyValue: selectedBatch.nreleasebatchcode,
                fetchUrl: "batchcreation/getBatchCreation", isSingleGet: true,
                task: selectedBatch.ntransactionstatus === transactionStatus.DRAFT ? "delete" : "cancel",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }
            let obj = convertDateValuetoString(this.state.selectedRecord["fromdate"] || this.props.Login.masterData.FromDate, this.state.selectedRecord["todate"] || this.props.Login.masterData.ToDate, this.props.Login.userInfo)
            let fromDate = obj.fromDate;
            let toDate = obj.toDate;

            // if (this.state.selectedRecord["fromdate"] !== undefined) {
            //     fromDate = getStartOfDay(this.state.selectedRecord["fromdate"]);
            // }
            // if (this.state.selectedRecord["todate"] !== undefined) {
            //     toDate = getEndOfDay(this.state.selectedRecord["todate"]);
            // }

            const inputParam = {
                classUrl: "batchcreation",
                methodUrl, postParam,
                inputData: {
                    "userinfo": this.props.Login.userInfo,
                    "batchcreation": selectedBatch,
                    nextgetid: nextGetId,
                    fromDate,
                    toDate,
                    ncontrolcode: ncontrolCode
                },
                operation
            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
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
        this.props.validateEsignCredential(inputParam, "openModal");
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

    onFilterSubmit = () => {
        this.reloadData(true);
    }

    reloadData = (isFilterSubmit) => {
        this.searchRef.current.value = "";
        // let obj = this.convertDatetoString((selectedRecord && selectedRecord["fromdate"]) || this.props.Login.masterData.FromDate, (selectedRecord && selectedRecord["todate"]) || this.props.Login.masterData.ToDate)

        let stransactionstatuscode = this.props.Login.masterData.SelectedFilterStatus ? String(this.props.Login.masterData.SelectedFilterStatus.ntransactionstatus) : null;

        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;
        if (isFilterSubmit) {
            const selectedRecord = this.state.selectedRecord || {};
            if (selectedRecord && selectedRecord["nfiltertransstatus"] !== undefined) {
                stransactionstatuscode = selectedRecord["nfiltertransstatus"].value === String(0) ? null : String(selectedRecord["nfiltertransstatus"].value);
            }
            if (selectedRecord && selectedRecord["fromdate"] !== undefined) {
                fromDate = selectedRecord["fromdate"];
            }
            if (selectedRecord && selectedRecord["todate"] !== undefined) {
                toDate = selectedRecord["todate"];
            }
        }
        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
        const inputParam = {
            inputData: {
                userinfo: this.props.Login.userInfo,
                fromDate: obj.fromDate,
                toDate: obj.toDate,
                stransactionstatuscode, activeBCTab: this.props.Login.activeBCTab || "IDS_COMPONENT",
                //currentdate: isFilterSubmit === true ? null : formatInputDate(new Date(), true)
                currentdate:null
            },
            classUrl: "batchcreation",
            methodUrl: "BatchCreation",
            displayName: "IDS_BATCHCREATION",
            userInfo: this.props.Login.userInfo,
            dataState:this.state.dataState,
            sahDataState:this.state.sahDataState,
            bahDataState:this.state.bahDataState,
            chDataState:this.state.chDataState,
            testCommentDataState: this.state.testCommentDataState,
        };

        // this.props.callService(inputParam);
        this.props.reloadBatchCreation(inputParam);
    }

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
    callService, crudMaster, validateEsignCredential,
    updateStore, getBatchCreationComboService, getBatchProductCategoryComboChange,
    getBatchProductComboChange, getBatchManufacturerComboChange,
    getBatchComponentComboService, getDataForAddBatchComponent,
    getAttachmentCombo, viewAttachment, deleteAttachment, getBatchSampleApprovalHistory,
    getTestParameter, getCopyBatchCreationComboService, getBatchCreationDetail, getBatchCreationChildTabDetail,
    //completeBatchCreation, 
    getProductByCategory,
    getSpecComponentView, validateBatchComplete,
    filterColumnData, reloadBatchCreation, onClickReport
})(injectIntl(BatchCreation));

