import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
    showUnderDevelopment,
    callService, crudMaster, updateStore, getSampleTypeChange, getRegTypeChange,
    getRegSubTypeChange, getAttachmentCombo, viewAttachment, getCommentsCombo,
    filterTransactionList, validateEsignCredential, ReloadData, getSampleChildTabDetail,
    getTestChildTabDetailRegistration, getPreviewTemplate, getChildValues,
    getRegistrationSample, getRegistrationsubSampleDetail, getRegistrationTestDetail,
    acceptRegistration, addMoreTest, createRegistrationTest, getEditRegistrationComboService,
    cancelTestAction, cancelSampleAction, addsubSampleRegistration, saveSubSample,
    getEditSubSampleComboService, onUpdateSubSampleRegistration, cancelSubSampleAction,
    preregRecordToQuarantine, componentTest, getSubSampleChildTabDetail,validateEsignforRegistration
} from '../../actions'
import { Button, Card, Col, Nav, Row, FormLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import {
    getControlMap, showEsign, sortData, constructOptionList,
    onDropAttachFileList, deleteAttachmentDropZone, convertDateTimetoString, comboChild
} from '../../components/CommonScript';
import RegistrationFilter from './RegistrationFilter';
import Esign from '../audittrail/Esign';
import { injectIntl } from 'react-intl';
import { MediaHeader, ProductList } from '../product/product.styled';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import SplitterLayout from "react-splitter-layout";
import AddTest from './AddTest';
import { designProperties, RegistrationType, transactionStatus } from '../../components/Enumeration';
// import BreadcrumbComponentToolbar from '../../components/ToolbarBreadcrumb.Component';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import ScrollBar from 'react-perfect-scrollbar';
import { ListWrapper } from '../../components/client-group.styles';
import TransactionListMasterJson from '../../components/TransactionListMasterJson';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
import { ContentPanel, ReadOnlyText } from '../../components/App.styles';
import SampleInfoView from '../approval/SampleInfoView';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import AddPrinter from './AddPrinter';
import SampleGridTab from './SampleGridTab';
import AddFile from './AddFile';
import Attachments from '../attachmentscomments/attachments/Attachments';
import Comments from '../attachmentscomments/comments/Comments';
import { onSaveSampleComments, onSaveSubSampleComments, onSaveTestComments } from '../attachmentscomments/comments/CommentFunctions';
import { onSaveSampleAttachment, onSaveSubSampleAttachment, onSaveTestAttachment } from '../attachmentscomments/attachments/AttachmentFunctions';
import { ReactComponent as Quarantine } from '../../assets/image/Quarantine.svg'
import { ReactComponent as Register } from '../../assets/image/register.svg'
import { ReactComponent as Reject } from '../../assets/image/reject.svg'
import { getSameRecordFromTwoArrays, convertDateValuetoString, rearrangeDateFormat } from '../../components/CommonScript'
import RegistrationResultTab from './RegistrationResultTab';
import PortalModal from '../../PortalModal';
import PreRegisterSlideOutModal from './PreRegisterSlideOutModal';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { checkTestPresent, getRegistrationSubSample } from './RegistrationValidation';
import AddSubSample from './AddSubSample';
import QRCode from 'react-qr-code';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';

class Registration extends Component {

    constructor(props) {
        super(props);
        this.searchSampleRef = React.createRef();
        this.searchSubSampleRef = React.createRef();
        this.searchTestRef = React.createRef();
        this.PrevoiusLoginData = undefined;
        this.breadCrumbData = [];
        //  this.sampleeditable=this.props.Login.masterData.DynamicDesign&& JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata.value)
        this.state = {
            layout: 1,
            openModal: false,
            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",
            screenName: "Product",
            userRoleControlRights: [],
            controlMap: new Map(),
            showAccordian: true,
            showSaveContinue: false,
            filterCollection: [],
            selectedFilter: {},
            breadCrumb: [],
            showTest: true,
            showSample: false,
            showSubSample: false,
            sampleSearchFied: [],
            subsampleSearchFied: [],
            testSearchFied: [],
            showConfirmAlert: false,
            dataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            DynamicSampleColumns: [],
            sampleGridDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            testDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'npreregno' }] 
            },
            testCommentDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'groupingField' }] 
            },
            subSampleCommentDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'groupingField' }] 
            },
            subSampleAttachmentDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'groupingField' }] 
            },
            testAttachmentDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'groupingField' }] 
            },
            sampleCommentsDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'groupingField' }]
            },
            resultDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'sarno' }] 
            },
            historyDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5
                //, group: [{ field: 'sarno' }, { field: 'stestsynonym' }] 
            },
            selectedPrinterData: {},
            grandparentheight: '150vh',
            transactionValidation: [],
            skip: 0,
            take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
            testskip: 0,
            splitChangeWidthPercentage: 28.6,
            testtake: this.props.Login.settings
                && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
            subsampleskip: 0,
            subsampletake: this.props.Login.settings
                && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
            comboComponents: [],
            withoutCombocomponent: [],
            childColumnList: [],
            columnList: [],
            regSubSamplecomboComponents: [],
            regSubSamplewithoutCombocomponent: [],
            regparentSubSampleColumnList: [],
            DynamicSubSampleColumns: [],
            DynamicTestColumns: [],
            DynamicGridItem: [],
            DynamicGridMoreField: [],
            sampleCombinationUnique:[],subsampleCombinationUnique:[],
            SingleItem: [],
            testMoreField: [],
            testListColumns: [],
            SubSampleDynamicGridItem: [],
            SubSampleDynamicGridMoreField: [],
            SubSampleSingleItem: [],
            cancelId: -1,
            preRegisterId: -1,
            registerId: -1,
            editSampleId: -1,
            quarantineId: -1,
            addTestId: -1,
            printBarcodeId: -1,
            cancelSampleId: -1,
            addSubSampleId: -1,
            editSubSampleId: -1,
            cancelSubSampleId: -1,
            stateSampleType: [],
            stateRegistrationType: [],
            stateRegistrationSubType: [],
            stateFilterStatus: [],
            stateDynamicDesign: [],
            testGetParam: {},
            testChildGetParam: {},
            subSampleGetParam: {},
            filterSampleParam: {},
            filterTestParam: {},
            editRegParam: {},
            editSubSampleRegParam: {},
            addTestParam: {},
            sampleSearchField: [],
            subsampleSearchField: [],
            testSearchField: [],
            filterSubSampleParam: {},
            initialVerticalWidth: "57vh",
            enablePin: false,
            fixefScrollHeight:window.outerHeight - 300,
            showQRCode: false,
            // specBasedComponent: this.props.Login.settings
            //     && this.props.Login.settings[18] ? this.props.Login.settings[18] === "true" ? true : false : false,

        };
        // this.onSecondaryPaneSizeChange = this.onSecondaryPaneSizeChange.bind(this);
        this.myRef = React.createRef();
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
        if (props.Login.showConfirmAlert !== state.showConfirmAlert) {
            return {
                showConfirmAlert: props.Login.showConfirmAlert
            }
        }
        return null;
    }

    onReload = () => {

        // let RealFromDate = new Date(this.props.Login.masterData.RealFromDate)
        // let RealToDate = new Date(this.props.Login.masterData.RealToDate)
        const obj = convertDateValuetoString(this.props.Login.masterData.RealFromDate, this.props.Login.masterData.RealToDate, this.props.Login.userInfo);
        const RealFromDate = obj.fromDate;
        const RealToDate = obj.toDate;
        let RealSampleTypeValue = this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue
        let RealRegTypeValue = this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue
        let RealRegSubTypeValue = this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue
        let RealFilterStatusValue = this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue
        let RealDesignTemplateMappingValue = this.props.Login.masterData.RealDesignTemplateMappingValue && this.props.Login.masterData.RealDesignTemplateMappingValue
        let activeSampleTab = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
        let activeSubSampleTab = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
        let activeTestTab = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";

        let SampleTypeValue = RealSampleTypeValue
        let RegTypeValue = RealRegTypeValue
        let RegSubTypeValue = RealRegSubTypeValue
        let FilterStatusValue = RealFilterStatusValue
        let DesignTemplateMappingValue = RealDesignTemplateMappingValue
        // let FromDate = this.props.Login.masterData.FromDate
        // let ToDate = this.props.Login.masterData.ToDate
        const FromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
        const ToDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
        let masterData = {
            ...this.props.Login.masterData, RealSampleTypeValue, RealRegTypeValue, RealRegSubTypeValue, FromDate, ToDate,
            RealFilterStatusValue, RealFromDate, RealToDate, SampleTypeValue, RegTypeValue, RegSubTypeValue, FilterStatusValue, DesignTemplateMappingValue, RealDesignTemplateMappingValue
        }
        let inputData = {
            npreregno: "",
            nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
            nfilterstatus: this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus,
            userinfo: this.props.Login.userInfo, activeSampleTab, activeTestTab, activeSubSampleTab,
            flag: 1,
            nneedtemplatebasedflow: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedtemplatebasedflow,
            ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
            nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
            checkBoxOperation: 3
        }
        if (inputData.nsampletypecode) {
            // let obj = this.covertDatetoString(this.props.Login.masterData.RealFromDate, this.props.Login.masterData.RealToDate)
            inputData['FromDate'] = obj.fromDate;
            inputData['ToDate'] = obj.toDate;

            let inputParam = { masterData, inputData, searchSubSampleRef: this.searchSubSampleRef, searchSampleRef: this.searchSampleRef, searchTestRef: this.searchTestRef, selectedFilter: this.state.selectedFilter }
            this.props.ReloadData(inputParam);
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
        }
    }

    onFilterSubmit = () => {
        const RealFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.fromdate || this.props.Login.masterData.FromDate);
        const RealToDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.todate || this.props.Login.masterData.ToDate)
        let RealSampleTypeValue = this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue
        let RealRegTypeValue = this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue
        let RealRegSubTypeValue = this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue
        let RealFilterStatusValue = this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue
        let RealDesignTemplateMappingValue = this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue

        let activeSampleTab = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
        let activeSubSampleTab = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";

        let activeTestTab = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
        let masterData = {
            ...this.props.Login.masterData, RealSampleTypeValue, RealRegTypeValue, RealRegSubTypeValue,
            RealFilterStatusValue, RealFromDate, RealToDate, RealDesignTemplateMappingValue
        }
        let inputData = {
            npreregno: "",
            nsampletypecode: this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
            nfilterstatus: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
            userinfo: this.props.Login.userInfo, activeSampleTab, activeTestTab, activeSubSampleTab,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            ndesigntemplatemappingcode: this.props.Login.masterData.DesignTemplateMappingValue
                && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
            checkBoxOperation: 3
        }

        if (inputData.nsampletypecode) {
            if (inputData.ndesigntemplatemappingcode) {
                const obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.FromDate,
                    this.state.selectedFilter.todate || this.props.Login.masterData.ToDate, this.props.Login.userInfo)
                inputData['FromDate'] = obj.fromDate;
                inputData['ToDate'] = obj.toDate;
                const selectedFilter = {};
                selectedFilter["fromdate"] = RealFromDate;
                selectedFilter["todate"] = RealToDate;
                const inputParam = {
                    masterData, inputData, searchSubSampleRef: this.searchSubSampleRef,
                    searchSampleRef: this.searchSampleRef,
                    searchTestRef: this.searchTestRef, selectedFilter
                }
                this.props.getRegistrationSample(inputParam);
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PLSSCONFIGREGISTRATIONTEMPLATE" }));
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
        }
    }

    getActiveTestURL() {

        let url = "resultentrybysample/getTestbasedParameter"
        switch (this.props.Login.activeTestKey) {

            case "IDS_PARAMETERRESULTS":
                //url = "resultentrybysample/getTestbasedParameter";
                url = "registration/getregistrationparameter";
                break;
            case "IDS_TESTCOMMENTS":
                url = "comments/getTestComment";
                break;
            default:
                url = "registration/getregistrationparameter";
                // url = "resultentrybysample/getTestbasedParameter";
                break;
        }
        return url;
    }


    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
    }
    // gridViewChange(layout) {
    //     this.setState({
    //         layout: layout
    //     })
    // }
    verticalPaneSizeChange = (val) => {
        if (this.state.enableAutoHeight) {
            this.setState({
                initialVerticalWidth: val - 150
            })
        }
    }
    changeSplitterOption = () => {
        this.setState({
            enableAutoHeight: !this.state.enableAutoHeight,
            initialVerticalWidth: "57vh"

        })
    }

   

    render() {


        this.fromDate = this.state.selectedFilter["fromdate"] !== "" && this.state.selectedFilter["fromdate"] !== undefined ? this.state.selectedFilter["fromdate"] : this.props.Login.masterData.FromDate;
        this.toDate = this.state.selectedFilter["todate"] !== "" && this.state.selectedFilter["todate"] !== undefined ? this.state.selectedFilter["todate"] : this.props.Login.masterData.ToDate;
        let sampleList = this.props.Login.masterData.RegistrationGetSample ? sortData(this.props.Login.masterData.RegistrationGetSample, 'desc', 'npreregno') : [];
        let subSampleList = this.props.Login.masterData.RegistrationGetSubSample ? this.props.Login.masterData.RegistrationGetSubSample : [];
        let testList = this.props.Login.masterData.RegistrationGetTest ? this.props.Login.masterData.RegistrationGetTest : []; //




        const testDesign = <ContentPanel>
            <Card>
                <Card.Header style={{ borderBottom: "0px" }}>
                    <span style={{ display: "inline-block" }}>
                        <h4 className="card-title">{this.props.intl.formatMessage({ id: "IDS_TEST" })}</h4>
                    </span>
                    <button className="btn btn-primary btn-padd-custom" style={{ float: "right" }}
                        onClick={() => this.showSample()}
                    >
                        <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>{"  "}
                        {this.props.intl.formatMessage({ id: "IDS_SAMPLE" })}
                    </button>
                    {/* <button className="btn btn-primary btn-padd-custom" style={{ "float": "right", "margin-right": "6px" }}
                    onClick={() => this.showSubSample()}
                >
                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>{"  "}
                    {this.props.intl.formatMessage({ id: "IDS_SUBSAMPLE" })}
                </button> */}

                    {/* </div> */}
                </Card.Header>
                <Card.Body className='p-0'>
                    <TransactionListMasterJsonView
                        paneHeight={this.state.initialVerticalWidth}
                        masterList={this.props.Login.masterData.searchedTest || testList}
                        selectedMaster={this.props.Login.masterData.selectedTest}
                        primaryKeyField="ntransactiontestcode"
                        getMasterDetail={this.props.getTestChildTabDetailRegistration}
                        inputParam={{
                            ...this.state.testChildGetParam, resultDataState: this.state.resultDataState,
                            testCommentDataState: this.state.testCommentDataState,
                            testAttachmentDataState: this.state.testAttachmentDataState,
                        }}
                        additionalParam={[]}
                        mainField="stestsynonym"
                        selectedListName="selectedTest"
                        objectName="test"
                        listName="IDS_TEST"
                        // jsonField={'jsondata'}
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
                        // childTabsKey={["RegistrationTestComment"]}
                        childTabsKey={["RegistrationParameter", "RegistrationTestComment", "RegistrationTestAttachment"]}
                        handlePageChange={this.handleTestPageChange}
                        buttonCount={5}
                        skip={this.state.testskip}
                        take={this.state.testtake}
                        showMoreResetList={true}
                        showMoreResetListName="RegistrationGetSample"
                        selectionList={this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                        selectionColorField="scolorhexcode"
                        // selectionList=
                        // actionIcons={
                        //     [{ title: "EditTest", controlname: "faPencilAlt", hidden: this.state.userRoleControlRights.indexOf(editSourceMethodId) === -1, onClick: this.testMethodSourceEdit, objectName: "test", inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo, editSourceMethodId } },
                        //     { title: "Add Intrument", controlname: "faMicroscope", hidden: this.state.userRoleControlRights.indexOf(addResultUsedInstrumentId) === -1, onClick: this.addREInstrument, objectName: "test", inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo, addResultUsedInstrumentId } },
                        //     { title: "Add Material", controlname: "faFlask", hidden: this.state.userRoleControlRights.indexOf(addResultUsedMaterailId) === -1 },
                        //     { title: "Add Task", controlname: "faTasks", hidden: this.state.userRoleControlRights.indexOf(addResultUsedTaskId) === -1, onClick: this.addResultEntryTask, objectName: "test", inputData: { addResultUsedTaskId } }]
                        // }
                        commonActions={
                            <>
                                {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                <ProductList className="d-flex justify-content-end icon-group-wrap">
                                    {/* <ReactTooltip place="bottom" /> */}
                                    <Nav.Link name="adddeputy" className="btn btn-circle outline-grey ml-2"
                                        //title={"Add Test"}
                                        // data-for="tooltip-common-wrap"
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_ADDTEST" })}
                                        hidden={this.state.userRoleControlRights.indexOf(this.state.addTestId) === -1}
                                        onClick={() => this.props.addMoreTest({
                                            ...this.state.addTestParam,
                                            skip: this.state.skip, take: (this.state.skip + this.state.take)
                                        }, this.state.addTestId)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Nav.Link>

                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        //title={"Cancel/Reject Test"}
                                        // data-for="tooltip-common-wrap"
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_CANCELREJECTTEST" })}
                                        hidden={this.state.userRoleControlRights.indexOf(this.state.cancelId) === -1}
                                        onClick={() => this.cancelRecord(this.state.cancelId, this.state.testskip, this.state.testtake)}>
                                        <Reject className="custom_icons" width="15" height="15" />
                                    </Nav.Link>
                                </ProductList>
                                {/* </Tooltip> */}
                            </>
                        }
                    />
                </Card.Body>
            </Card>
        </ContentPanel>


        let mainDesign = ""

        if (this.props.Login.masterData.RealRegSubTypeValue &&
            this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample) {

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
                    <Card.Body className='p-0'>
                        <TransactionListMasterJson
                            paneHeight={this.state.initialVerticalWidth}
                            masterList={this.props.Login.masterData.searchedSubSample || subSampleList}
                            selectedMaster={this.props.Login.masterData.selectedSubSample}
                            primaryKeyField="ntransactionsamplecode"
                            getMasterDetail={this.props.getRegistrationTestDetail}
                            inputParam={{
                                ...this.state.testGetParam,
                                searchTestRef: this.searchTestRef,
                                searchSubSampleRef: this.searchSubSampleRef,
                                testskip: this.state.testskip,
                                subsampleskip: this.state.subsampleskip,
                                resultDataState: this.state.resultDataState
                            }}
                            filterColumnData={this.props.filterTransactionList}
                            searchListName="searchedSubSample"
                            searchRef={this.searchSubSampleRef}
                            filterParam={{
                                ...this.state.filterSubSampleParam,
                                childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedTest" }]
                            }}
                            additionalParam={['napprovalversioncode']}
                            showStatusLink={true}
                            showStatusName={true}
                            statusFieldName="stransdisplaystatus"
                            statusField="ntransactionstatus"
                            mainField="ssamplearno"
                            selectedListName="selectedSubSample"
                            objectName="subsample"
                            listName="IDS_SUBSAMPLE"
                            needValidation={true}
                            validationKey="napprovalversioncode"
                            validationFailMsg="IDS_SELECTSAMPLESOFSAMPLEAPPROVALVERSION"
                            subFields={this.state.DynamicSubSampleColumns}
                            skip={this.state.subsampleskip}
                            take={this.state.subsampletake}
                            selectionField="ntransactionstatus"
                            selectionFieldName="stransdisplaystatus"
                            needMultiSelect={true}
                            selectionColorField="scolorhexcode"
                            subFieldsLabel={false}
                            handlePageChange={this.handleSubSamplePageChange}
                            selectionList={this.props.Login.masterData.RealFilterStatusValue
                                && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                            childTabsKey={["RegistrationAttachment",
                                "RegistrationGetTest","RegistrationSampleComment","RegistrationSampleAttachment"]}
                            actionIcons={
                                [
                                    {
                                        title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                        controlname: "faPencilAlt",
                                        objectName: "mastertoedit",
                                        hidden: this.state.userRoleControlRights.indexOf(this.state.editSubSampleId) === -1,
                                        onClick: this.editSubSampleRegistration,
                                        inputData: {
                                            primaryKeyName: "ntransactionsamplecode",
                                            operation: "update",
                                            masterData: this.props.Login.masterData,
                                            userInfo: this.props.Login.userInfo,
                                            editSubSampleRegParam: { ...this.state.editSubSampleRegParam, ncontrolCode: this.state.editSubSampleId }
                                        },
                                    }


                                ]
                            }
                            needFilter={false}
                            commonActions={
                                <>
                                    {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                    <ProductList className="d-flex justify-content-end icon-group-wrap">
                                        {/* <ReactTooltip place="bottom" /> */}
                                        <Nav.Link name="adddeputy" className="btn btn-circle outline-grey ml-2"
                                            //title={"Add Test"}
                                            // data-for="tooltip-common-wrap"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_ADDSUBSAMPLE" })}
                                            hidden={this.state.userRoleControlRights.indexOf(this.state.addSubSampleId) === -1}
                                            onClick={() => this.addSubSample(this.state.addSubSampleId, this.state.subsampleskip, this.state.subsampletake)}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </Nav.Link>
                                        <Nav.Link
                                            className="btn btn-circle outline-grey ml-2"
                                            //title={"Cancel/Reject Test"}
                                            // data-for="tooltip-common-wrap"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                            hidden={this.state.userRoleControlRights.indexOf(this.state.cancelSubSampleId) === -1}
                                            onClick={() => this.cancelSubSampleRecord(this.state.cancelSubSampleId, this.state.subsampleskip, this.state.subsampletake)}>
                                            <Reject className="custom_icons" width="15" height="15" />
                                        </Nav.Link>
                                    </ProductList>
                                    {/* </Tooltip> */}
                                </>
                            }
                        />
                    </Card.Body>
                </Card>
                {testDesign}
            </SplitterLayout>

        } else {
            mainDesign = testDesign
        }


        // let testGetParam = {
        //     masterData: this.props.Login.masterData,
        //     userinfo: this.props.Login.userInfo,
        //     ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
        //     nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
        //     nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
        //     nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
        //     activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
        //     activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
        //     npreregno: this.props.Login.masterData.selectedSample &&
        //         this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(","),
        //     sfromdate: this.props.Login.masterData.RealFromDate,
        //     stodate: this.props.Login.masterData.RealToDate,
        //     searchTestRef: this.searchTestRef,
        //     testskip: this.state.testskip,
        //     subsampleskip: this.state.subsampleskip,
        //     resultDataState: this.state.resultDataState,
        //     ndesigntemplatemappingcode: this.props.Login.masterData.registrationTemplate && this.props.Login.masterData.registrationTemplate.ndesigntemplatemappingcode,
        // }
        // let testChildGetParam = {
        //     masterData: this.props.Login.masterData,
        //     userinfo: this.props.Login.userInfo,
        //     ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
        //     nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
        //     nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
        //     nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
        //     activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
        //     activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
        //     npreregno: this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(","),
        //     ntransactionsamplecode: this.props.Login.masterData.selectedSubSample &&
        //         this.props.Login.masterData.selectedSubSample.map(sample => sample.ntransactionsamplecode).join(","),
        //     sfromdate: this.props.Login.masterData.RealFromDate,
        //     stodate: this.props.Login.masterData.RealToDate,
        //     resultDataState: this.state.resultDataState,
        //     testCommentDataState: this.state.testCommentDataState,
        //     ndesigntemplatemappingcode: this.props.Login.masterData.registrationTemplate && this.props.Login.masterData.registrationTemplate.ndesigntemplatemappingcode,
        // }

        this.confirmMessage = new ConfirmMessage();

        // let subSampleGetParam = {
        //     masterData: this.props.Login.masterData,
        //     ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
        //     userinfo: this.props.Login.userInfo,
        //     nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
        //     nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
        //     nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
        //     activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
        //     activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
        //     testskip: this.state.testskip,
        //     subsampleskip: this.state.subsampleskip,
        //     searchTestRef: this.searchTestRef,
        //     resultDataState: this.state.resultDataState,
        //     testCommentDataState: this.state.testCommentDataState,
        //     sampleGridDataState: this.state.sampleGridDataState,
        //     ndesigntemplatemappingcode: this.props.Login.masterData.registrationTemplate
        //         && this.props.Login.masterData.registrationTemplate.ndesigntemplatemappingcode,
        //     nneedsubsample: this.props.Login.masterData
        //         && this.props.Login.masterData.nneedsubsample
        // }
        // let sampleSearchField = ["sarno", "sproductname", "sproductcatname", "seprotocolname", "stransdisplaystatus"
        //     , "sstorageconditionname", "sdecisionstatus", "scomponentname", "splasmafilenumber", "sversion", "sbulkvolume", "sregsubtypename", "smanuflotno"
        //     , "sregtypename", "sspecname", "saddress1", "sclientname", "smanufsitename", "sproductcertificatename", "smanufname", "sstoragelocationname"];


        // const filterSampleParam = {
        //     inputListName: "RegistrationGetSample",
        //     selectedObject: "selectedSample",
        //     primaryKeyField: "npreregno",
        //     fetchUrl: "registration/getRegistrationSubSample",
        //     childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedSubSample" }],
        //     fecthInputObject: {
        //         nflag: 2,
        //         ntype: 2,
        //         masterData: this.props.Login.masterData,
        //         ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
        //         userinfo: this.props.Login.userInfo,
        //         nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
        //         nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
        //         nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
        //         activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
        //         activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
        //     },
        //     masterData: this.props.Login.masterData,
        //     searchFieldList: sampleSearchField,
        //     changeList: [
        //         "RegistrationGetSubSample", "RegistrationGetTest", "RegistrationTestAttachment",
        //         "RegistrationTestComment", "RegistrationAttachment", "selectedSample", "selectedSubSample",
        //         "selectedTest", "RegistrationParameter"
        //     ]
        // };

        // let filterTestParam = {
        //     inputListName: "RegistrationGetTest",
        //     selectedObject: "selectedTest",
        //     primaryKeyField: "ntransactiontestcode",
        //     fetchUrl: this.getActiveTestURL(),
        //     fecthInputObject: {
        //         ntransactiontestcode: this.props.Login.masterData && this.props.Login.masterData.selectedTest && this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
        //         userinfo: this.props.Login.userInfo
        //     },
        //     masterData: this.props.Login.masterData,
        //     searchFieldList: ["sarno", "stestsynonym", "ssectionname", "ssamplearno",
        //         "sinstrumentcatname", "stransdisplaystatus", "smethodname", "ssourcename", "scomponentname", "stestname"],
        //     changeList: ["RegistrationTestComment", "RegistrationParameter"]

        // }

        this.postParamList = [
            {
                filteredListName: "searchedSample",
                clearFilter: "no",
                searchRef: this.searchSampleRef,
                primaryKeyField: "npreregno",
                fetchUrl: "registration/getRegistrationSubSample",
                fecthInputObject: {
                    ...this.state.subSampleGetParam, testskip: this.state.testskip,
                    subsampleskip: this.state.subsampleskip,
                    searchSubSampleRef: this.searchSubSampleRef,
                    searchTestRef: this.searchTestRef,
                    resultDataState: this.state.resultDataState,
                    testCommentDataState: this.state.testCommentDataState,
                    testAttachmentDataState: this.state.testAttachmentDataState,
                    sampleGridDataState: this.state.sampleGridDataState
                },
                childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" },
                { ref: this.searchTestRef, childFilteredListName: "searchedTest" }],
                selectedObject: "selectedSample",
                inputListName: "AP_SAMPLE",
                updatedListname: "selectedSample",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            },
            {
                filteredListName: "searchedSubSample",
                clearFilter: "no",
                searchRef: this.searchSubSampleRef,
                primaryKeyField: "ntransactionsamplecode",
                fetchUrl: "registration/getRegistrationTestSample",
                fecthInputObject: {
                    ...this.state.testGetParam, testskip: this.state.testskip,
                    subsampleskip: this.state.subsampleskip,
                    searchSubSampleRef: this.searchSubSampleRef,
                    searchTestRef: this.searchTestRef,
                    resultDataState: this.state.resultDataState,
                    testCommentDataState: this.state.testCommentDataState,
                    testAttachmentDataState: this.state.testAttachmentDataState,
                    sampleGridDataState: this.state.sampleGridDataState
                },
                childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedTest" }],
                selectedObject: "selectedSubSample",
                inputListName: "AP_SUBSAMPLE",
                updatedListname: "selectedSubSample",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            },
            {
                filteredListName: "searchedTest",
                updatedListname: "selectedTest",
                clearFilter: "no",
                searchRef: this.searchTestRef,
                primaryKeyField: "ntransactiontestcode",
                fetchUrl: "approval/getApprovalTest",
                fecthInputObject: {
                    ...this.state.testGetParam,
                    searchTestRef: this.searchTestRef,
                    testskip: this.state.testskip,
                    subsampleskip: this.state.subsampleskip,
                    resultDataState: this.state.resultDataState
                },
                selectedObject: "selectedTest",
                inputListName: "RegistrationGetTest",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            }
        ];


        // let editRegParam = {
        //     nfilterstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
        //     userinfo: this.props.Login.userInfo,
        //     nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
        //     nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
        //     nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
        //     sfromdate: this.props.Login.masterData.RealFromDate,
        //     stodate: this.props.Login.masterData.RealToDate,
        //     ncontrolCode: this.state.editSampleId,
        //     ndesigntemplatemappingcode: this.props.Login.masterData.registrationTemplate
        //         && this.props.Login.masterData.registrationTemplate.ndesigntemplatemappingcode,
        //     nneedsubsample: this.props.Login.masterData
        //         && this.props.Login.masterData.nneedsubsample
        // }

        // let editSubSampleRegParam = {
        //     nfilterstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
        //     userinfo: this.props.Login.userInfo,
        //     nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
        //     nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
        //     nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
        //     sfromdate: this.props.Login.masterData.RealFromDate,
        //     stodate: this.props.Login.masterData.RealToDate,
        //     ncontrolCode: this.state.editSampleId,
        //     ndesigntemplatemappingcode: this.props.Login.masterData.registrationTemplate
        //         && this.props.Login.masterData.registrationTemplate.ndesigntemplatemappingcode,
        //     nneedsubsample: this.props.Login.masterData
        //         && this.props.Login.masterData.nneedsubsample
        // }

        // const addTestParam = {
        //     selectedsample: this.props.Login.masterData.selectedSample,
        //     selectedsubsample: this.props.Login.masterData.selectedSubSample,
        //     skip: this.state.skip, take: (this.state.skip + this.state.take),
        //     userinfo: this.props.Login.userInfo,
        //     sampleList: this.props.Login.masterData.RegistrationGetSample,
        //     snspecsampletypecode: this.props.Login.masterData.selectedSubSample &&
        //         [...new Set(this.props.Login.masterData.selectedSubSample.map(x => x.nspecsampletypecode))].join(",")
        // };

        console.log("this.state:", this.state);
        return (
            <>
                <ListWrapper className="client-listing-wrap toolbar-top-wrap mtop-4 screen-height-window">
                <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} />
                    {/* <BreadcrumbComponentToolbar
                        filterComponent={[
                            {
                                "Sample Filter": <RegistrationFilter
                                    SampleType={this.state.stateSampleType || []}
                                    RegistrationType={this.state.stateRegistrationType || []}
                                    RegistrationSubType={this.state.stateRegistrationSubType || []}
                                    userInfo={this.props.Login.userInfo || {}}
                                    SampleTypeValue={this.props.Login.masterData.SampleTypeValue || {}}
                                    RegTypeValue={this.props.Login.masterData.RegTypeValue || {}}
                                    RegSubTypeValue={this.props.Login.masterData.RegSubTypeValue || {}}
                                    FilterStatusValue={this.props.Login.masterData.FilterStatusValue || {}}
                                    DesignTemplateMapping={this.props.Login.masterData.DesignTemplateMapping}
                                    DesignTemplateMappingValue={this.props.Login.masterData.DesignTemplateMappingValue || {}}
                                    FilterStatus={this.state.stateFilterStatus || []}
                                    FromDate={this.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.fromDate) : new Date()}
                                    ToDate={this.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.toDate) : new Date()}
                                    onSampleTypeChange={this.onSampleTypeChange}
                                    onRegTypeChange={this.onRegTypeChange}
                                    onRegSubTypeChange={this.onRegSubTypeChange}
                                    onDesignTemplateChange={this.onDesignTemplateChange}
                                    DynamicDesignMapping={this.state.stateDynamicDesign || []}
                                    handleFilterDateChange={this.handleFilterDateChange}
                                    onFilterChange={this.onFilterChange}
                                />
                            }
                        ]}
                        showFilter={this.props.Login.showFilter}
                        openFilter={this.openFilter}
                        closeFilter={this.closeFilter}
                        onFilterSubmit={this.onFilterSubmit}
                        searchRef={this.searchSampleRef}
                        filterParam={{
                            ...this.state.filterSampleParam,
                            childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" },
                            { ref: this.searchTestRef, childFilteredListName: "searchedTest" }],
                        }}
                        searchListName="searchedSample"
                        filterColumnData={this.props.filterTransactionList}
                        breadCrumbItem={this.breadCrumbData} /> */}
                    {/* <div className='btn-list'>
                        <button className={`btn-primary-head ${this.state.layout === 1 ? 'active' : ''} `} onClick={() => this.gridViewChange(1)}>Sample</button>
                        <button className={`btn-primary-head ${this.state.layout === 2 ? 'active' : ''} `} onClick={() => this.gridViewChange(2)}>Sub Sample</button>
                        <button className={`btn-primary-head ${this.state.layout === 3 ? 'active' : ''} `} onClick={() => this.gridViewChange(3)}>Test</button>
                    </div> */}
                    <Row noGutters={true}  className="toolbar-top">
                        <Col md={12} className="parent-port-height">
                            <ListWrapper >
                                {/* className={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 60 ? 'split-mode' : ''} */}

                                <SplitterLayout borderColor="#999"
                                    primaryIndex={1} percentage={true}
                                    secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                    //onSecondaryPaneSizeChange={this.paneSizeChange}
                                    primaryMinSize={40}
                                    secondaryMinSize={20}
                                >
                                    <div className='toolbar-top-inner'>                                    
                                    <TransactionListMasterJson
                                        listMasterShowIcon={1}
                                        // paneHeight={this.state.firstPane}
                                        clickIconGroup={true}
                                        splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                        masterList={this.props.Login.masterData.searchedSample || sampleList}
                                        selectedMaster={this.props.Login.masterData.selectedSample}
                                        primaryKeyField="npreregno"
                                        filterColumnData={this.props.filterTransactionList}
                                        getMasterDetail={this.props.getRegistrationsubSampleDetail}
                                        inputParam={{
                                            ...this.state.subSampleGetParam,
                                            searchTestRef: this.searchTestRef,
                                            searchSubSampleRef: this.searchSubSampleRef,
                                            testskip: this.state.testskip,
                                            subsampleskip: this.state.subsampleskip,
                                            resultDataState: this.state.resultDataState
                                        }}
                                        selectionList={this.props.Login.masterData.RealFilterStatusValue
                                            && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                                        selectionColorField="scolorhexcode"
                                        mainField={"sarno"}
                                        showStatusLink={true}
                                        showStatusName={true}
                                        statusFieldName="stransdisplaystatus"
                                        statusField="ntransactionstatus"
                                        selectedListName="selectedSample"
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
                                        // jsonField={'jsondata'}
                                        //jsonDesignFields={true}
                                        needMultiSelect={true}
                                        showStatusBlink={true}
                                        filterParam={{
                                            ...this.state.filterSampleParam,
                                            childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" },
                                            { ref: this.searchTestRef, childFilteredListName: "searchedTest" }],
                                        }}
                                        subFieldsLabel={false}
                                        handlePageChange={this.handlePageChange}
                                        skip={this.state.skip}
                                        take={this.state.take}
                                        // splitModeClass={this.state.splitChangeWidthPercentage
                                        //     && this.state.splitChangeWidthPercentage > 50 ? 'split-mode'
                                        //     : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}
                                        childTabsKey={["RegistrationAttachment","RegistrationComment", "RegistrationGetSubSample",
                                            "RegistrationGetTest","RegistrationSampleAttachment", "RegistrationSampleComment", "selectedSubSample", "selectedTest"]} //, "RegistrationParameter""RegistrationTestComment"
                                        actionIcons={
                                            [
                                                {
                                                    title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                                    controlname: "faPencilAlt",
                                                    objectName: "mastertoedit",
                                                    hidden: this.state.userRoleControlRights.indexOf(this.state.editSampleId) === -1,
                                                    onClick: this.editRegistration,
                                                    inputData: {
                                                        primaryKeyName: "npreregno",
                                                        operation: "update",
                                                        masterData: this.props.Login.masterData,
                                                        userInfo: this.props.Login.userInfo,
                                                        editRegParam: {
                                                            ...this.state.editRegParam,
                                                            ncontrolCode: this.state.editSampleId
                                                        }
                                                    },
                                                },
                                                {
                                                    title: this.props.intl.formatMessage({ id: "IDS_PRINTBARCODE" }),
                                                    controlname: "faPrint",
                                                    objectName: "sample",
                                                    hidden: this.state.userRoleControlRights.indexOf(this.state.printBarcodeId) === -1,
                                                    onClick: this.printBarcode,
                                                   
                                                    inputData: {
                                                        primaryKeyName: "npreregno",
                                                        operation: "print",
                                                        ncontrolcode: this.state.printBarcodeId,
                                                        masterData: this.props.Login.masterData,
                                                        userInfo: this.props.Login.userInfo,
                                                        editRegParam: {
                                                            ...this.state.editRegParam,
                                                            ncontrolCode: this.state.printBarcodeId
                                                        }
                                                    },
                                                },

                                            ]
                                        }
                                        needFilter={true}
                                        commonActions={

                                            <ProductList className="d-flex product-category float-right icon-group-wrap">
                                                {/* <ReactTooltip place="bottom" /> */}
                                                <Button className="btn btn-icon-rounded btn-circle solid-blue ml-2" role="button"
                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_PREREGISTER" })}
                                                    // data-for="tooltip-common-wrap"
                                                    hidden={this.state.userRoleControlRights.indexOf(this.state.preRegisterId) === -1}
                                                    onClick={() => this.getRegistrationComboService("Registration", "create", "npreregno",
                                                        this.props.Login.masterData, this.props.Login.userInfo, this.state.preRegisterId)}>
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </Button>
                                                <Nav.Link
                                                    className="btn btn-circle outline-grey ml-2"
                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_REGISTER" })}
                                                    // data-for="tooltip-common-wrap"
                                                    hidden={this.state.userRoleControlRights.indexOf(this.state.registerId) === -1}
                                                    onClick={() => this.acceptRegistration(this.state.registerId, this.state.skip, this.state.take)} >
                                                    <Register className="custom_icons" width="15" height="15" />
                                                </Nav.Link>
                                                <Nav.Link
                                                    className="btn btn-circle outline-grey ml-2"
                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_QUARANTINE" })}
                                                    // data-for="tooltip-common-wrap"
                                                    hidden={this.state.userRoleControlRights.indexOf(this.state.quarantineId) === -1}
                                                    onClick={() => this.selectQuarantine(this.state.quarantineId, this.state.skip, this.state.take)} >
                                                    <Quarantine className="custom_icons" width="15" height="15" />
                                                </Nav.Link>
                                                <Nav.Link
                                                    className="btn btn-circle outline-grey ml-2"
                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_CANCELREJECTSAMPLE" })}
                                                    // data-for="tooltip-common-wrap"
                                                    hidden={this.state.userRoleControlRights.indexOf(this.state.cancelSampleId) === -1}
                                                    onClick={() => this.cancelSampleRecords(this.state.cancelSampleId, this.state.skip, this.state.take)}>
                                                    <Reject className="custom_icons" width="20" height="20" />
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
                                                "Sample Filter": <RegistrationFilter
                                                    SampleType={this.state.stateSampleType || []}
                                                    RegistrationType={this.state.stateRegistrationType || []}
                                                    RegistrationSubType={this.state.stateRegistrationSubType || []}
                                                    userInfo={this.props.Login.userInfo || {}}
                                                    SampleTypeValue={this.props.Login.masterData.SampleTypeValue || {}}
                                                    RegTypeValue={this.props.Login.masterData.RegTypeValue || {}}
                                                    RegSubTypeValue={this.props.Login.masterData.RegSubTypeValue || {}}
                                                    FilterStatusValue={this.props.Login.masterData.FilterStatusValue || {}}
                                                    DesignTemplateMapping={this.props.Login.masterData.DesignTemplateMapping}
                                                    DesignTemplateMappingValue={this.props.Login.masterData.DesignTemplateMappingValue || {}}
                                                    FilterStatus={this.state.stateFilterStatus || []}
                                                    FromDate={this.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.fromDate) : new Date()}
                                                    ToDate={this.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.toDate) : new Date()}
                                                    onSampleTypeChange={this.onSampleTypeChange}
                                                    onRegTypeChange={this.onRegTypeChange}
                                                    onRegSubTypeChange={this.onRegSubTypeChange}
                                                    onDesignTemplateChange={this.onDesignTemplateChange}
                                                    DynamicDesignMapping={this.state.stateDynamicDesign || []}
                                                    handleFilterDateChange={this.handleFilterDateChange}
                                                    onFilterChange={this.onFilterChange}
                                                />
                                            }
                                        ]}

                                    />
                                        </div>

                                    <PerfectScrollbar>
                                        <SplitterLayout
                                            customClassName="detailed-inner no-height pin-scroller"
                                            vertical
                                            borderColor="#999"
                                            primaryIndex={1}
                                            //onSecondaryPaneSizeChange={this.verticalPaneSizeChange}
                                            //secondaryInitialSize={window.outerHeight - 260}
                                             secondaryInitialSize={this.state.fixefScrollHeight}
                                            
                                        >
                                            <div>
                                                <div style={this.state.showTest === true || this.state.showSubSample === true ?
                                                    { display: "block", background: "#FFFF" } : { display: "none", background: "#FFFF" }} >
                                                    {mainDesign}
                                                </div>
                                                <ContentPanel ref={this.myRef} style={this.state.showSample === true ? { display: "block" } : { display: "none" }}>
                                                    <Card ref={this.myRef} className="border-0">
                                                        <Card.Body className='p-0'>
                                                            <Row>
                                                                <Col md={12}>
                                                                    <Card className='p-0'>
                                                                        <Card.Header style={{ borderBottom: "0px" }}>
                                                                            <span style={{ display: "inline-block", marginTop: "1%" }} >
                                                                                <h4 >{this.props.intl.formatMessage({ id: "IDS_SAMPLE" })}</h4>
                                                                            </span>
                                                                            {/* <button className="btn btn-primary btn-padd-custom" style={{ float: "right" }}
                                                                                    onClick={() => this.showSubSample()}
                                                                                >
                                                                                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon> { }
                                                                                    {this.props.intl.formatMessage({ id: "IDS_SUBSAMPLE" })}
                                                                                </button> */}
                                                                            <button className="btn btn-primary btn-padd-custom" style={{ "float": "right", "margin-right": "6px" }}
                                                                                onClick={() => this.showTest()}
                                                                            >
                                                                                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon> { }
                                                                                {this.props.intl.formatMessage({ id: "IDS_TEST" })}
                                                                            </button>
                                                                        </Card.Header>
                                                                        <Card.Body>
                                                                            <PerfectScrollbar>
                                                                                <div ref={this.myRef} style={{ height: this.state.initialVerticalWidth + 30 }}>
                                                                                    {this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.length === 1 ?
                                                                                        <SampleInfoView
                                                                                            data={(this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.length > 0) ?
                                                                                                this.props.Login.masterData.selectedSample[this.props.Login.masterData.selectedSample.length - 1] : {}}
                                                                                            SingleItem={this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample ?
                                                                                                this.state.SingleItem : []}
                                                                                            screenName="IDS_SAMPLEINFO"
                                                                                            userInfo={this.props.Login.userInfo}

                                                                                        />

                                                                                        :
                                                                                        <SampleGridTab
                                                                                            userInfo={this.props.Login.masterData.userInfo || {}}
                                                                                            GridData={this.props.Login.masterData.selectedSample || []}
                                                                                            masterData={this.props.Login.masterData}
                                                                                            inputParam={this.props.Login.inputParam}
                                                                                            dataState={this.state.sampleGridDataState}
                                                                                            dataStateChange={this.sampleInfoDataStateChange}
                                                                                            extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem) || []}
                                                                                            detailedFieldList={this.gridfillingColumn(this.state.DynamicGridMoreField) || []}
                                                                                            primaryKeyField={"npreregno"}
                                                                                            expandField="expanded"
                                                                                            screenName="IDS_SAMPLEINFO"
                                                                                        //jsonField={"jsondata"}
                                                                                        />
                                                                                    }
                                                                                </div>
                                                                            </PerfectScrollbar>
                                                                        </Card.Body>
                                                                    </Card>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </ContentPanel>
                                               
                                            </div>
                                            <div>
                                                {this.state.enablePin ? <span className={`pin-icon ${this.state.enableAutoHeight ? "active" : ""}`} 
                                                onClick={this.changeSplitterOption}
                                                ></span>
                                                    : ""}
                                                {/* <SearchAdd className="d-flex justify-content-between"> */}
                                                <Card className='p-0'>
                                                    <Card.Body className='p-0'>
                                                        <Card.Header style={{ borderBottom: "0px" }}>

                                                            <span style={{ display: "inline-block", marginTop: "1%" }} >
                                                                <h4 >{this.props.intl.formatMessage({
                                                                    id: this.state.showSample ? "IDS_SAMPLEATTACHMENTSCOMMENTS" :
                                                                        this.state.showSubSample ? "IDS_SUBSAMPLEATTACHMENTSCOMMENTS" : "IDS_PARAMETERRESULTS"
                                                                })}</h4>
                                                            </span>

                                                            {this.state.showSample ? <>
                                                                {/* <button className="btn btn-primary btn-padd-custom" style={{ "float": "right", "margin-right": "6px" }}
                                                                        onClick={() => this.showSubSample()}
                                                                    >
                                                                        <FontAwesomeIcon icon={faEye}></FontAwesomeIcon> { }
                                                                        {this.props.intl.formatMessage({ id: "IDS_SUBSAMPLE" })}
                                                                    </button>
                                                                    <button className="btn btn-primary btn-padd-custom" style={{ "float": "right", "margin-right": "6px" }}
                                                                        onClick={() => this.showTest()}
                                                                    >
                                                                        <FontAwesomeIcon icon={faEye}></FontAwesomeIcon> { }
                                                                        {this.props.intl.formatMessage({ id: "IDS_TEST" })}
                                                                    </button> */}
                                                            </> :
                                                                this.state.showSubSample ?
                                                                    <>
                                                                       
                                                                        <button className="btn btn-primary btn-padd-custom" style={{ "float": "right", "margin-right": "6px" }}
                                                                            onClick={() => this.showTest()}
                                                                        >
                                                                            <FontAwesomeIcon icon={faEye}></FontAwesomeIcon> { }
                                                                            {this.props.intl.formatMessage({ id: "IDS_TEST" })}
                                                                        </button></> :
                                                                    <>
                                                                       
                                                                        {this.props.Login.masterData.RealRegSubTypeValue &&
                                                                            this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample ?
                                                                            <button className="btn btn-primary btn-padd-custom" style={{ "float": "right", "margin-right": "6px" }}
                                                                                onClick={() => this.showSubSample()}
                                                                            >
                                                                                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon> { }
                                                                                {this.props.intl.formatMessage({ id: "IDS_SUBSAMPLE" })}
                                                                            </button> : ""
                                                                        }</>
                                                            }
                                                        </Card.Header>
                                                    </Card.Body>
                                                </Card>
                                                {/* </SearchAdd> */}
                                                {/* <PerfectScrollbar> */}
                                                <div>
                                                    {/* xaaaaa-{this._scrollBarRef} */}
                                                    {this.state.showSample ?

                                                        <CustomTabs activeKey={this.props.Login.activeSampleTab ? this.props.Login.activeSampleTab === 'IDS_SAMPLEATTACHMENTS' ? 'IDS_ATTACHMENTS' : this.props.Login.activeSampleTab : 'IDS_ATTACHMENTS'}
                                                            tabDetail={this.sampleTabDetail()} onTabChange={this.onSampleTabChange} /> :
                                                        this.state.showSubSample ?
                                                            <CustomTabs activeKey={this.props.Login.activeSubSampleTab ? this.props.Login.activeSubSampleTab === 'IDS_SUBSAMPLEATTACHMENTS' ? 'IDS_SUBSAMPLEATTACHMENTS' : this.props.Login.activeSubSampleTab : 'IDS_SUBSAMPLEATTACHMENTS'}
                                                                tabDetail={this.subsampleTabDetail()} onTabChange={this.onSubSampleTabChange} />
                                                            : this.state.showTest ?
                                                                <CustomTabs activeKey={this.props.Login.activeTestTab ? this.props.Login.activeTestTab === 'IDS_TESTCOMMENTS' ? 'IDS_TESTCOMMENTS' : this.props.Login.activeTestTab : 'IDS_PARAMETERRESULTS'}
                                                                    tabDetail={this.testTabDetail()}
                                                                    onTabChange={this.ontestTabChange} />
                                                                // <Card>
                                                                /* <Card.Header style={{ "borderBottom": "0px", "padding-top": "1px" }}>
                                                                    <span style={{ display: "inline-block", marginTop: "1%" }}>
                                                                        <h4 className="card-title">Parameter Results</h4>
                                                                    </span>
                                                                </Card.Header> */

                                                                // </Card>
                                                                // : this.state.showSubSample ?
                                                                //     <CustomTabs activeKey={this.props.Login.activeSampleTab ? this.props.Login.activeSampleTab === 'IDS_SAMPLEATTACHMENTS' ? 'IDS_ATTACHMENTS' : this.props.Login.activeSampleTab : 'IDS_ATTACHMENTS'}
                                                                //         tabDetail={this.subsampleTabDetail()}
                                                                //         onTabChange={this.onSubSampleTabChange} />

                                                                //     : ""}
                                                                : ""}
                                                </div>
                                                {/* </PerfectScrollbar> */}
                                            </div>
                                        </SplitterLayout>
                                    </PerfectScrollbar>
                                </SplitterLayout>
                            </ListWrapper>
                        </Col>
                    </Row>
                </ListWrapper >
                {
                    this.props.Login.openPortal ?
                        <PortalModal>
                            <PreRegisterSlideOutModal
                                postParamList={this.postParamList}
                                PrevoiusLoginData={this.PrevoiusLoginData}
                                closeModal={this.closeModal}
                                operation={"create"}
                                screenName={"IDS_REGISTRATION"}
                                onSaveClick={this.onSaveClick}
                                validateEsign={this.validateEsign}
                                updateStore={this.props.updateStore}
                                comboComponents={this.state.comboComponents}
                                withoutCombocomponent={this.state.withoutCombocomponent}
                                userRoleControlRights={this.state.userRoleControlRights}
                                fromDate={this.fromDate}
                                toDate={this.toDate}
                                samplecombinationunique={this.state.sampleCombinationUnique}
                                subsamplecombinationunique={this.state.subsampleCombinationUnique}
                                mandatoryFields={[
                                    { "idsName": "IDS_PRODUCTCATEGORY", "dataField": "nproductcatcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                                    { "idsName": "IDS_PRODUCTNAME", "dataField": "sproductname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]}
                            />
                        </PortalModal>
                        : ""
                }
                {
                   (this.props.Login.openModal || this.state.showQRCode)  &&
                    <SlideOutModal show={this.props.Login.openModal || this.state.showQRCode}
                        //|| this.props.Login.loadEsign}
                                           
                        closeModal={this.state.showQRCode ? () => this.setState({ showQRCode: false, openModal: false }) :
                            this.props.Login.loadRegSubSample ||
                            this.props.Login.loadFile ||
                            this.props.Login.loadChildTest ? this.closeChildModal : this.closeModal}
                        size={this.props.Login.parentPopUpSize}
                        loginoperation={this.props.Login.loadPrinter ? true : false}
                        buttonLabel={this.state.showQRCode || this.props.Login.loadPrinter ? "print" : undefined}
                        operation={this.state.showQRCode ? "Preview" : this.props.Login.loadComponent || this.props.Login.loadTest || this.props.Login.loadSource || this.props.Login.loadFile ? this.props.Login.childoperation : this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.state.showQRCode ? "QR Code" : this.props.Login.loadTest || this.props.Login.loadFile ?
                            this.props.Login.ChildscreenName : this.props.Login.screenName}
                        esign={this.props.Login.loadEsign}
                        innerPopup={this.props.Login.loadComponent}
                        onSaveClick={this.state.showQRCode ? () => this.setState({ showQRCode: false, openModal: false }): this.props.Login.loadRegSubSample ? this.onSaveSubSampleClick : this.props.Login.loadFile ? this.onSaveFileClick :
                            this.props.Login.loadPrinter ? this.onSavePrinterClick :
                                this.props.Login.loadChildTest ? this.onSaveChildTestClick : this.onSaveClick}
                        validateEsign={this.validateEsign}
                        showSaveContinue={this.props.Login.showSaveContinue}
                        selectedRecord={!this.props.Login.loadEsign ? this.props.Login.loadComponent ? this.state.selectComponent : this.props.Login.loadPrinter ? this.state.selectedPrinterData
                            : this.props.Login.loadTest ? this.state.selectedTestData : this.props.Login.loadFile ? this.state.selectedFile
                                : this.props.Login.loadPoolSource ? this.state.selectedSourceData : this.state.selectedRecord : this.state.selectedRecord}
                        mandatoryFields={this.mandatoryList(this.props.Login.loadPreregister,
                            this.props.Login.loadPrinter, this.props.Login.loadFile,
                            this.props.Login.loadChildTest, this.props.Login.loadRegSubSample)}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.state.showQRCode ?
                                <Row>
                                    <Col md={6}>
                                        <QRCode value={this.state.selectedRecord.barcodevalue} />
                                    </Col>

                                    <Col md={6}>
                                        <Row>
                                            <Col md={12}>
                                                <FormLabel>{this.props.intl.formatMessage({ id: "IDS_ARNO" })}:</FormLabel>
                                                <ReadOnlyText>{this.state.selectedRecord.barcodeData.sarno || '-'}</ReadOnlyText>
                                            </Col>
                                            <Col md={12}>
                                                <FormLabel>{this.props.intl.formatMessage({ id: "IDS_PRODUCT" })}:</FormLabel>
                                                <ReadOnlyText>{this.state.selectedRecord.barcodeData.Product || '-'}</ReadOnlyText>
                                            </Col>
                                            {/* <Col md={12}>
                                                <FormLabel>{this.props.intl.formatMessage({ id: "IDS_COLLECTIONDATE" })}:</FormLabel>
                                                <ReadOnlyText>{this.state.selectedRecord.barcodeData.scollectiondate || '-'}</ReadOnlyText>
                                            </Col>
                                            <Col md={12}>
                                                <FormLabel>{this.props.intl.formatMessage({ id: "IDS_SUBMITTER" })}:</FormLabel>
                                                <ReadOnlyText>{this.state.selectedRecord.barcodeData.submitter || '-'}</ReadOnlyText>
                                            </Col> */}
                                        </Row>
                                    </Col>
                                </Row>
                            : this.props.Login.loadRegSubSample ?
                                <AddSubSample
                                    editfield={this.props.Login.masterData.DynamicDesign && JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata.value)}
                                    Component={this.props.Login.lstComponent || []}
                                    selectComponent={this.state.selectedRecord}
                                    templateData={this.props.Login.masterData.SubSampleTemplate &&
                                        this.props.Login.masterData.SubSampleTemplate.jsondata}
                                    userInfo={this.props.Login.userInfo}
                                    timeZoneList={this.props.Login.timeZoneList}
                                    defaultTimeZone={this.props.Login.defaultTimeZone}
                                    handleDateChange={this.handleDateSubSampleChange}
                                    onInputOnChange={this.onInputOnSubSampleChange}
                                    onNumericInputChange={this.onNumericInputSubSampleChange}
                                    onNumericBlur={this.onNumericBlurSubSample}
                                    comboData={this.props.Login.regSubSamplecomboData}
                                    onComboChange={this.onComboSubSampleChange}
                                    onComponentChange={this.onComponentChange}
                                    TestCombined={this.props.Login.TestCombined || []}
                                    TestChange={this.onComboChange}
                                    selectedTestData={this.state.selectedRecord}
                                    childoperation={this.props.Login.operation}
                                    specBasedComponent={this.props.Login.specBasedComponent}

                                />
                                : this.props.Login.loadFile ? <AddFile
                                    selectedFile={this.state.selectedFile || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onDrop={this.onDropComponentFile}
                                    deleteAttachment={this.deleteAttachment}
                                    actionType={this.state.actionType}
                                    maxSize={20}
                                    maxFiles={1}
                                /> :
                                    this.props.Login.loadPrinter ?
                                        <AddPrinter
                                            printer={this.props.Login.printer}
                                            selectedPrinterData={this.state.selectedPrinterData}
                                            PrinterChange={this.PrinterChange}
                                        /> : this.props.Login.loadChildTest ? <AddTest
                                            TestCombined={this.props.Login.availableTest}
                                            selectedTestData={this.state.selectedRecord}
                                            TestChange={this.onComboChange}
                                        /> : ""
                        }
                    />
                }
                {this.state.showConfirmAlert ? this.confirmAlert() : ""}
            </>
        );
    }

    printBarcode =(inputParam)=>{
        
        this.setState({ selectedRecord: { barcodevalue: inputParam.sample.sarno, 
                                          barcodeData: inputParam.sample }, 
                        showQRCode: true, openModal: true })
    }


    handleDateSubSampleChange = (dateValue, dateName) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }
    onComponentChange = (comboData, fieldName, nneedsubsample) => {
        if (comboData !== null) {
            //  if (!nneedsubsample) {
            const selectedRecord = this.state.selectedRecord || {};
            if (fieldName === 'ntzdreceivedate') {
                selectedRecord["ntzdreceivedate"] = comboData;
                this.setState({ selectedRecord })
            } else {
                // const oldspecsampletypecode = selectComponent.nspecsampletypecode
                // if (oldspecsampletypecode !== comboData.item.nspecsampletypecode) {
                //     //selectComponent["nneedservice"] = true;
                // }
                selectedRecord[fieldName] = comboData;
                selectedRecord["Sample Name"] = comboData.label;
                selectedRecord["nspecsampletypecode"] = comboData.item.nspecsampletypecode;
                selectedRecord["ntestgrouptestcode"] = [];

                this.props.componentTest(selectedRecord, true, this.props.Login.specBasedComponent,
                    this.props.Login.Conponent)
            }

            // const updateInfo = {
            //     typeName: DEFAULT_RETURN,
            //     data: {
            //         selectComponent
            //     }
            // }
            // this.props.updateStore(updateInfo);
            // } else {
            //     const selectComponent = this.state.selectComponent || {};
            //     selectComponent[fieldName] = comboData;
            //     // selectComponent["nspecsampletypecode"] = comboData.item.nspecsampletypecode ?  comboData.item.nspecsampletypecode : -1;
            //     this.setState({ selectComponent })
            // }
        }

    }
    onInputOnSubSampleChange = (event, radiotext) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === 'timeonly') {
                selectedRecord['dateonly'] = false;
            }
            if (event.target.name === 'dateonly') {
                selectedRecord['timeonly'] = false;
            }
            //selectedRecord[event.target.name] = event.target.checked;
            const value = selectedRecord[event.target.name];
            if (value !== '' && value !== undefined) {
                if (value.includes(radiotext)) {
                    const index = value.indexOf(radiotext);
                    if (index !== -1) {
                        if (index === 0) {
                            const indexcomma = value.indexOf(",")
                            if (indexcomma !== -1) {
                                selectedRecord[event.target.name] = value.slice(indexcomma + 1)

                            } else {
                                selectedRecord[event.target.name] = ""
                            }
                        } else {
                            //  const  indexcomma= value.indexOf(",")
                            if (value.slice(index).indexOf(",") !== -1) {
                                selectedRecord[event.target.name] = value.slice(0, index) + value.slice(index + value.slice(index).indexOf(",") + 1)
                            } else {
                                selectedRecord[event.target.name] = value.slice(0, index - 1)
                            }

                        }
                    }

                } else {
                    selectedRecord[event.target.name] = value + ',' + radiotext;
                }

            } else {
                selectedRecord[event.target.name] = radiotext;
            }
        }
        else if (event.target.type === 'radio') {
            selectedRecord[event.target.name] = radiotext;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        //console.log("selected record:", selectedRecord);
        this.setState({ selectedRecord });
    }


    onComboSubSampleChange = (comboData, control, customName) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (comboData) {
            let parentList = []
            let childComboList = []
            let childColumnList = {}

            let comboName = customName || control.label;

            const inputParem = {
                child: control.child,
                source: control.source,
                primarykeyField: control.valuemember,
                value: comboData ? comboData.value : -1,
               // item: comboData ? comboData.item : "",
                item: comboData ? {...comboData.item, pkey:control.valuemember, nquerybuildertablecode:control.nquerybuildertablecode,"source": control.source} : "",
                label: comboName,
                nameofdefaultcomp: control.name
            }
            comboData["item"] = {...comboData["item"], pkey:control.valuemember,
                                 nquerybuildertablecode:control.nquerybuildertablecode,"source": control.source };
            if (comboData) {
                selectedRecord[comboName] = comboData;
            } else {
                selectedRecord[comboName] = []
            }
            if (control.child && control.child.length > 0) {
                childComboList = getSameRecordFromTwoArrays(this.state.regSubSamplecomboComponents,
                    control.child, "label")
                childColumnList = {};
                childColumnList = childComboList.map(columnList => {
                    const val = comboChild(this.state.regSubSamplecomboComponents,
                        columnList, childColumnList, false);
                    //  childColumnList = val.childColumnList
                    return val.childColumnList;
                })

                parentList = getSameRecordFromTwoArrays(this.state.regSubSamplewithoutCombocomponent,
                    control.child, "label")

                this.props.getChildValues(inputParem,
                    this.props.Login.userInfo, selectedRecord, this.props.Login.regSubSamplecomboData,
                    childComboList, childColumnList, this.state.regSubSamplewithoutCombocomponent,
                    [...childComboList, ...parentList])
            } else {
                this.setState({ selectedRecord })
                // const updateInfo = {
                //     typeName: DEFAULT_RETURN,
                //     data: { selectedRecord }
                // }
                // this.props.updateStore(updateInfo);
            }
        } else {
            const regSubSamplecomboData = this.props.Login.regSubSamplecomboData
            selectedRecord[control.label] = "";
            if (control.child && control.child.length > 0) {
                control.child.map(temp => {
                    selectedRecord[temp.label] = ""
                    delete regSubSamplecomboData[temp.label]
                    const components = [...this.state.regSubSamplecomboComponents, ...this.state.regSubSamplewithoutCombocomponent]
                    components.map(component => {
                        if (component.label === temp.label) {
                            if (component.child && component.child.length > 0) {
                                component.child.map(temp1 => {
                                    selectedRecord[temp1.label] = ""
                                    delete regSubSamplecomboData[temp.label]
                                })
                            }
                        }
                    })
                })
            }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedRecord, regSubSamplecomboData }
            }
            this.props.updateStore(updateInfo);
        }
    }



    onNumericInputSubSampleChange = (value, name) => {
        let selectedRecord = this.state.selectedRecord
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }


    onNumericBlurSubSample=(value,control)=>{
        let selectedRecord = this.state.selectedRecord
        if(selectedRecord[control.label]){
            if(control.max){
                if(!(selectedRecord[control.label]<parseFloat(control.max))){
                    selectedRecord[control.label]=control.precision?parseFloat(control.max):parseInt(control.max)
                }
            }
            if(control.min){
                if(!(selectedRecord[control.label]>parseFloat(control.min))){
                    selectedRecord[control.label]=control.precision?parseFloat(control.min):parseInt(control.min)
                }
            }
            

        }
        this.setState({ selectedRecord });
    }
    onSaveSubSampleClick = (saveType, formRef) => {
        const operation = this.props.Login.operation;
        if (operation === 'create') {
            let objSubSample = this.state.selectedRecord;
            const defaulttimezone = this.props.Login.defaulttimezone;
            const userInfo = this.props.Login.userInfo;

            let saveSubSample = {};
            let sampleList = [];
            if (this.props.Login.masterData.searchedSample !== undefined) {
                sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(this.state.skip, this.state.skip + this.state.take), "npreregno");
            } else {
                sampleList = this.props.Login.masterData.RegistrationGetSample && this.props.Login.masterData.RegistrationGetSample.slice(this.state.skip, this.state.skip + this.state.take);
            }
            sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.selectedSample, sampleList, 'npreregno')

            const findSampleAlloSpec = [...new Set(sampleList.map(item => item.nallottedspeccode))];
            if (this.props.Login.specBasedComponent) {
                saveSubSample["nspecsampletypecode"] = objSubSample["nspecsampletypecode"] ? objSubSample["nspecsampletypecode"] : -1
                saveSubSample["ncomponentcode"] = objSubSample["ncomponentcode"] ? objSubSample["ncomponentcode"].value : -1
            } else {
                const findSampleSpec = [...new Set(sampleList.map(item => item.nspecsampletypecode))];
                saveSubSample["nspecsampletypecode"] = findSampleSpec[0] ? findSampleSpec[0] : -1;
                saveSubSample["ncomponentcode"] =-1;
            }

            saveSubSample["jsondata"] = {}
            saveSubSample["jsonuidata"] = {}
            const dateList = []
            this.props.Login.masterData.SubSampleTemplate &&
                this.props.Login.masterData.SubSampleTemplate.jsondata.map(row => {
                    row.children.map(column => {
                        column.children.map(component => {
                            if (component.hasOwnProperty("children")) {
                                //let componentrowlabel = ''
                                // let componentrowvalue = ''
                                component.children.map(componentrow => {
                                    if (componentrow.inputtype === "combo") {
                                        saveSubSample["jsondata"][componentrow.label] = objSubSample[componentrow.label] ?
                                            { value: objSubSample[componentrow.label].value, label: objSubSample[componentrow.label].label } : -1

                                        saveSubSample["jsonuidata"][componentrow.label] = objSubSample[componentrow.label] ? objSubSample[componentrow.label].label : ""

                                        // if (componentrow.mandatory || objSubSample[componentrow.label]) {
                                        //     componentrowlabel = componentrowlabel + '&' + componentrow.label
                                        //     componentrowvalue = componentrowvalue + ' ' + objSubSample[componentrow.label].label
                                        // }
                                    }
                                    else if (componentrow.inputtype === "date") {
                                        if (componentrow.mandatory) {
                                            saveSubSample["jsondata"][componentrow.label] = convertDateTimetoString(objSubSample[componentrow.label] ?
                                                objSubSample[componentrow.label] : new Date(), userInfo);

                                            saveSubSample["jsonuidata"][componentrow.label] = saveSubSample["jsondata"][componentrow.label]
                                        } else {
                                            saveSubSample["jsondata"][componentrow.label] = componentrow.loadcurrentdate ?
                                                convertDateTimetoString(objSubSample[componentrow.label] ?
                                                    objSubSample[componentrow.label] : new Date(), userInfo) :
                                                objSubSample[componentrow.label] ? convertDateTimetoString(objSubSample[componentrow.label] ?
                                                    objSubSample[componentrow.label] : new Date(), userInfo) : "";

                                            saveSubSample["jsonuidata"][componentrow.label] = saveSubSample["jsondata"][componentrow.label]
                                        }
                                        if (componentrow.timezone) {
                                            saveSubSample["jsondata"][`tz${componentrow.label}`] = objSubSample[`tz${componentrow.label}`] ?
                                                { value: objSubSample[`tz${componentrow.label}`].value, label: objSubSample[`tz${componentrow.label}`].label } :
                                                defaulttimezone ? defaulttimezone : -1

                                            saveSubSample["jsonuidata"][`tz${componentrow.label}`] = saveSubSample["jsondata"][`tz${componentrow.label}`]
                                        }
                                        dateList.push(componentrow.label)
                                    }

                                    else {
                                        saveSubSample["jsondata"][componentrow.label] = objSubSample[componentrow.label] ?
                                            objSubSample[componentrow.label] : ""

                                        saveSubSample["jsonuidata"][componentrow.label] = saveSubSample["jsondata"][componentrow.label]

                                        // if (objSubSample[componentrow.label]) {
                                        //     componentrowlabel = componentrowlabel + '&' + objSubSample.label
                                        //     componentrowvalue = componentrowvalue + ' ' + objSubSample[componentrow.label]
                                        // }
                                    }
                                    return saveSubSample;
                                })
                                //saveSubSample["jsondata"][componentrowlabel.substring(1)] = componentrowvalue
                            }
                            else {
                                if (component.inputtype === "combo") {
                                    saveSubSample["jsondata"][component.label] = objSubSample[component.label] ?
                                        { value: objSubSample[component.label].value, label: objSubSample[component.label].label } : -1

                                    saveSubSample["jsonuidata"][component.label] = objSubSample[component.label] ? objSubSample[component.label].label : ""
                                }
                                else if (component.inputtype === "date") {
                                    if (component.mandatory) {
                                        saveSubSample["jsondata"][component.label] = convertDateTimetoString(objSubSample[component.label] ?
                                            objSubSample[component.label] : new Date(), userInfo);

                                        saveSubSample["jsonuidata"][component.label] = saveSubSample["jsondata"][component.label]
                                    } else {
                                        saveSubSample["jsondata"][component.label] = component.loadcurrentdate ?
                                            convertDateTimetoString(objSubSample[component.label] ?
                                                objSubSample[component.label] : new Date(), userInfo) :
                                            objSubSample[component.label] ? convertDateTimetoString(objSubSample[component.label] ?
                                                objSubSample[component.label] : new Date(), userInfo) : "";
                                        saveSubSample["jsonuidata"][component.label] = saveSubSample["jsondata"][component.label]
                                    }
                                    if (component.timezone) {
                                        saveSubSample["jsondata"][`tz${component.label}`] = objSubSample[`tz${component.label}`] ?
                                            { value: objSubSample[`tz${component.label}`].value, label: objSubSample[`tz${component.label}`].label } :
                                            defaulttimezone ? defaulttimezone : -1

                                        saveSubSample["jsonuidata"][`tz${component.label}`] = saveSubSample["jsondata"][`tz${component.label}`]
                                    }
                                    dateList.push(component.label)
                                }
                                else {
                                    saveSubSample["jsondata"][component.label] = objSubSample[component.label] ?
                                        objSubSample[component.label] : ""

                                    saveSubSample["jsonuidata"][component.label] = saveSubSample["jsondata"][component.label]
                                }
                            }
                            return saveSubSample;
                        }
                        )
                        return saveSubSample;
                    })
                    return saveSubSample;
                })

            saveSubSample["nallottedspeccode"] = findSampleAlloSpec[0] ? findSampleAlloSpec[0] : -1;
            // Component.unshift(saveSubSample);

            let selectedTestData = objSubSample["ntestgrouptestcode"];
            const selectedTestArray = [];
            selectedTestData && selectedTestData.map((item) => {
                return selectedTestArray.push(item.item);
            });

            // const Test = this.props.Login.Test || [];
            // const ArrayTest = Test[saveComponent.slno] ? Test[saveComponent.slno] : [];
            //Test[saveComponent.slno] = [...ArrayTest, ...selectedTestArray]
            const map = {}
            map['RegistrationSample'] = saveSubSample
            map['subsampleDateList'] = dateList
            map['subsampledateconstraints'] = this.state.subsampledateconstraints;
            map['testgrouptest'] = selectedTestArray
            map['npreregno'] = sampleList.map(item => item.npreregno).join(",")
            map['userinfo'] = userInfo
            map['checkBoxOperation'] = 3
            map['ntype'] = 3
            map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
            map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
            map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
            map["checkBoxOperation"] = 3
            map["masterData"] = this.props.Login.masterData
            map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS"
            map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS"
            map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";

            const inputParam = {
                inputData: map,
                postParamList: this.postParamList,
            }

            this.props.saveSubSample(inputParam);
        } else {
            this.onUpdateSubSampleRegistration(saveType, formRef, operation);
        }
    }



    mandatoryList = (prereg, printer, file, childtest, regSubSample) => {
        let mandatory = [];
        if (file) {
            mandatory = [
                { "mandatory": true, "idsName": "IDS_IMPORTFILE", "dataField": "sfilename", "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }
            ];
        }
        else if (printer) {
            mandatory = [
                { "mandatory": true, "idsName": "IDS_PRINTER", "dataField": "sprintername", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
            ]
        } else if (regSubSample) {

            this.props.Login.masterData.SubSampleTemplate &&
                this.props.Login.masterData.SubSampleTemplate.jsondata.map(row => {
                    return row.children.map(column => {
                        return column.children.map(component => {
                            return component.hasOwnProperty("children") ?
                                component.children.map(componentrow => {
                                    if (componentrow.mandatory === true) {
                                        mandatory.push({ "mandatory": true, "idsName": componentrow.label, "dataField": componentrow.label, "mandatoryLabel": componentrow.inputtype === "combo" ? "IDS_SELECT" : "IDS_ENTER", "controlType": componentrow.inputtype === "combo" ? "selectbox" : "textbox" })

                                    }
                                    return mandatory;
                                })
                                : component.mandatory === true ?
                                    mandatory.push({ "mandatory": true, "idsName": component.label, "dataField": component.label, "mandatoryLabel": component.inputtype === "combo" ? "IDS_SELECT" : "IDS_ENTER", "controlType": component.inputtype === "combo" ? "selectbox" : "textbox" }) : ""

                        })
                    })
                })
        }

        else if (childtest) {
            mandatory = [
                { "mandatory": true, "idsName": "IDS_TESTNAME", "dataField": "ntestgrouptestcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
            ];
        }
        return mandatory;
    }

    deleteAttachment = (event, file, fieldName) => {
        let selectedFile = this.state.selectedFile || {};
        selectedFile[fieldName] = deleteAttachmentDropZone(selectedFile[fieldName], file)
        this.setState({
            selectedFile, actionType: "delete" //fileToDelete:file.name 
        });
    }

    onSaveChildTestClick = (saveType, formRef) => {
        const masterData = this.props.Login.masterData;

        const selectedSubsample = getSameRecordFromTwoArrays(masterData.selectedSubSample, masterData.RegistrationGetSample.slice(this.state.skip, (this.state.skip + this.state.take)), "npreregno");
        const selectedSample = getSameRecordFromTwoArrays(masterData.selectedSample, masterData.RegistrationGetSample.slice(this.state.skip, (this.state.skip + this.state.take)), "npreregno");
        //  selectedSubsample =masterData.selectedSubSample.slice(this.state.skip, (this.state.skip + this.state.take));
        const ntransactionsamplecode = selectedSubsample.map(x => x.ntransactionsamplecode).join(",");
        let obj = convertDateValuetoString(this.props.Login.masterData.RealFromDate,
            this.props.Login.masterData.RealToDate, this.props.Login.userInfo)
        const inputData = {
            TestGroupTest: this.state.selectedRecord.ntestgrouptestcode.map(value => value.item),
            RegistrationSample: selectedSubsample.map(x => x.ntransactionsamplecode),
            ntransactionsamplecode: ntransactionsamplecode,
            userinfo: this.props.Login.userInfo,
            nregtypecode: masterData.RealRegTypeValue.nregtypecode,
            nregsubtypecode: masterData.RealRegSubTypeValue.nregsubtypecode,
            nsampletypecode: masterData.RealSampleTypeValue.nsampletypecode,
            ntype: 3,
            nfilterstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
            npreregno: selectedSample &&
                selectedSample.map(sample => sample.npreregno).join(","),
            // ntransactionsamplecode: selectedSubsample &&
            // selectedSubsample.map(sample => sample.ntransactionsamplecode).join(","),
            FromDate: obj.fromDate,
            ToDate: obj.toDate,
            ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
            activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS"
        }


        const inputParam = {
            inputData,
            classUrl: "registration",
            operation: this.props.Login.operation,
            methodUrl: "Test",
            responseKeyList: [
                { "responseKey": "selectedSample", "masterDataKey": "RegistrationGetSample", "primaryKey": "npreregno", "dataAction": "update" },
                { "responseKey": "selectedSubSample", "masterDataKey": "RegistrationGetSubSample", "primaryKey": "ntransactionsamplecode", "dataAction": "update" },
                { "responseKey": "selectedTest", "masterDataKey": "RegistrationGetTest", "primaryKey": "ntransactiontestcode", "dataAction": "add" }],
            saveType, formRef,
            postParamList: this.postParamList,

        }
        if (showEsign(this.state.controlMap, this.props.Login.userInfo.nformcode, this.props.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.createRegistrationTest(inputParam, masterData, "openModal");
        }
    }

    getRegistrationComboService = (ScreenName, operation,
        primaryKeyField, masterData, userInfo, editId) => {
        const ndesigntemplatemappingcodefilter = this.props.Login.masterData.DesignTemplateMappingValue &&
            this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode
        if (ndesigntemplatemappingcodefilter === this.props.Login.masterData.ndesigntemplatemappingcode) {
            let data = [];
            const withoutCombocomponent = []
            const Layout = this.props.Login.masterData.registrationTemplate
                && this.props.Login.masterData.registrationTemplate.jsondata
            if (Layout !== undefined) {
                Layout.map(row => {
                    return row.children.map(column => {
                        return column.children.map(component => {
                            return component.hasOwnProperty("children") ?
                                component.children.map(componentrow => {
                                    if (componentrow.inputtype === "combo") {
                                        data.push(componentrow)
                                    } else {
                                        withoutCombocomponent.push(componentrow)
                                    }
                                    return null;
                                })
                                : component.inputtype === "combo" ?
                                    data.push(component) : withoutCombocomponent.push(component)
                        })
                    })

                })
                const comboComponents = data
                let childColumnList = {};
                data.map(columnList => {
                    const val = comboChild(data, columnList, childColumnList, true);
                    data = val.data;
                    childColumnList = val.childColumnList
                    return null;
                })
                const mapOfFilterRegData = {
                    nsampletypecode: parseInt(this.props.Login.masterData.RealSampleTypeValue.nsampletypecode)
                }
                this.props.getPreviewTemplate(masterData, userInfo, editId,
                    data, this.state.selectedRecord, childColumnList,
                    comboComponents, withoutCombocomponent, true, false,
                    mapOfFilterRegData, false, "create", this.props.Login.masterData.RealRegSubTypeValue.sregsubtypename)
            } else {
                toast.info("Configure the preregister template for this registrationtype")
            }
        } else {
            toast.info("select the approved design template")
        }
    }
    comboChild = (data, columnList, childColumnList, slice) => {
        let retunObj = {}
        // if (data.findIndex(x => x.label === columnList.label) !== -1) {
        if (!childColumnList.hasOwnProperty(columnList.label)) {
            if (childColumnList[columnList.label] === undefined) {
                if (columnList.hasOwnProperty("child")) {
                    let childList = []
                    columnList.child.map(childData => {
                        const index = data.findIndex(x => x.label === childData.label)
                        if (index !== -1) {
                            childList.push(data[index])
                            if (slice) {
                                data = [...data.slice(0, index), ...data.slice(index + 1)]
                            }
                        }
                        return data;
                    })
                    childColumnList[columnList.label] = childList;
                    if (childList.length > 0) {
                        childList.map(y => {
                            if (y.hasOwnProperty("child")) {
                                const val = comboChild(data, y, childColumnList, slice)
                                retunObj["data"] = val.data;
                                retunObj["childColumnList"] = val.childColumnList;
                            } else {
                                retunObj["data"] = data;
                                retunObj["childColumnList"] = childColumnList;
                            }
                            return null;
                        })
                    } else {
                        retunObj["data"] = data;
                        retunObj["childColumnList"] = childColumnList;
                    }
                } else {
                    retunObj["data"] = data;
                    retunObj["childColumnList"] = childColumnList;
                }
            } else {
                retunObj["data"] = data;
                retunObj["childColumnList"] = childColumnList;

            }
        } else {
            retunObj["data"] = data;
            retunObj["childColumnList"] = childColumnList;

        }
        return retunObj;
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

    handleSubSamplePageChange = e => {
        this.setState({
            subsampleskip: e.skip,
            subsampletake: e.take
        });
    };

    openFilter = () => {
        let showFilter = !this.props.Login.showFilter
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter }
        }
        this.props.updateStore(updateInfo);
    }

    onFilterChange = (event, labelname) => {
        let masterData = this.props.Login.masterData;
        masterData = {
            ...masterData,
            [labelname]: { ...event.item }
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { masterData }
        }
        this.props.updateStore(updateInfo);
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

    onSubSampleTabChange = (tabProps) => {
        const activeSubSampleTab = tabProps.screenName;
        if (activeSubSampleTab !== this.props.Login.activeSubSampleTab) {
            let inputData = {
                masterData: this.props.Login.masterData,
                selectedSubSample: this.props.Login.masterData.selectedSubSample,
                ntransactionsamplecode: this.props.Login.masterData.selectedSubSample ? this.props.Login.masterData.selectedSubSample.map(item => item.ntransactionsamplecode).join(",") : "-1",
                userinfo: this.props.Login.userInfo,
                screenName: activeSubSampleTab,
                activeSubSampleTab,
                subSampleCommentDataState: this.state.subSampleCommentDataState,
                subSampleAttachmentDataState: this.state.subSampleAttachmentDataState,
            }
            this.props.getSubSampleChildTabDetail(inputData)
        }
    }

    ontestTabChange = (tabProps) => {
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
                    screenName: activeTestTab,
                    resultDataState: this.state.resultDataState,
                    testCommentDataState: this.state.testCommentDataState,
                    testAttachmentDataState: this.state.testAttachmentDataState,
                }
                this.props.getTestChildTabDetailRegistration(inputData, true)
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))
            }
        }
    }

    onDropComponentFile = (attachedFiles, fieldName, maxSize) => {
        let selectedFile = this.state.selectedFile || {};
        selectedFile[fieldName] = onDropAttachFileList(selectedFile[fieldName], attachedFiles, maxSize)
        this.setState({ selectedFile, actionType: "new" });
    }

    handleFilterDateChange = (dateName, dateValue) => {
        const { selectedFilter } = this.state;
        if (dateValue === null) {
            dateValue = new Date();
        }
        selectedFilter[dateName] = dateValue;
        this.setState({ selectedFilter });
    }


    onUpdateRegistrationConfirm = () => {
        this.showAlert();
        this.onUpdateRegistration(this.props.Login.regEditParam.saveType,
            this.props.Login.regEditParam.formRef,
            this.props.Login.regEditParam.operation, 2)
    }

    confirmAlert = () => {
        if (this.state.showConfirmAlert) {
            if (this.props.Login.regDateEditConfirmMessage) {
                this.confirmMessage.confirm("Warning", "Warning",
                    this.props.Login.regDateEditConfirmMessage,
                    this.props.intl.formatMessage({ id: "IDS_OK" }),
                    this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                    () => this.onUpdateRegistrationConfirm(),
                    undefined,
                    () => this.showAlert());
            }
            else {
                this.confirmMessage.confirm("Warning", "Warning",
                    this.props.Login.booleanFlag, "ok", "Cancel",
                    () => this.insertRegistration(false), undefined, () => this.showAlert());
            }
        }
    }

    closeFilter = () => {

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false }
        }
        this.props.updateStore(updateInfo);
    }

    showAlert = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showConfirmAlert: false }
        }
        this.props.updateStore(updateInfo);
    }

    showSampleInfo() {
        this.setState({ showSample: true, showTest: false })
    }
    showSample() {
        let fixefScrollHeight = this.state.fixefScrollHeight
        let disableSplit  = false;
        if (this.myRef && this.myRef.current && this.myRef.current.clientHeight+20 !== this.state.fixefScrollHeight) {

           
               let fixefScrollHeight = this.myRef.current.clientHeight+20;
               let disableSplit  = true;
        }
        this.setState({
            showSample: true, showSubSample: false,
            showTest: false,
            fixefScrollHeight:fixefScrollHeight,
            disableSplit:disableSplit
        })
    }

    showTest() {
        let fixefScrollHeight = this.state.fixefScrollHeight
        let disableSplit  = false;
        if (this.myRef && this.myRef.current && this.myRef.current.clientHeight+20 !== this.state.fixefScrollHeight) {

           
               let fixefScrollHeight = this.myRef.current.clientHeight+20;
               let disableSplit  = true;
        }

        this.setState({
            showSample: false, showSubSample: false,
            showTest: true,
            fixefScrollHeight:fixefScrollHeight,
            disableSplit:disableSplit
        })

        // setTimeout(()=>{
        //     this.setState({
        //         disableSplit :false
        //     })  
        // },100)
    }

    showSubSample() {
        this.setState({
            showSample: false, showTest: false,
            showSubSample: !this.state.showSubSample
        })
    }

    showTestDetails() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showSample: !this.state.showSample, showTest: !this.state.showTest }
        }
        this.props.updateStore(updateInfo);
    }

    AddFile = () => {
        let selectedRecord = this.state.selectedRecord;
        let RealRegTypeValue = this.props.Login.masterData.RealRegTypeValue;
        let booleanmanuf = true;
        if (RealRegTypeValue === RegistrationType.PLASMA_POOL) {
            booleanmanuf = selectedRecord["nmanufcode"] > 0 && selectedRecord["nmanufcode"] !== undefined ? true : false
        }
        if (booleanmanuf) {
            if (this.state.selectedRecord.nallottedspeccode !== undefined) {

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadFile: true,
                        ChildscreenName: "File", childoperation: "Import",
                        parentPopUpSize: "lg", selectedFile: undefined
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTMANUFACTURER" }));
        }
    }

    onNumericInputChange = (value, name) => {
        const selectComponent = this.state.selectComponent || {};
        if ((name !== "nnoofcontainer") && (value === 0 || value === 0.0)) {
            selectComponent[name] = '';
            this.setState({ selectComponent });
        } else {
            selectComponent[name] = value;
            this.setState({ selectComponent });
        }
    }



    onSampleTypeChange = (event, fieldName, labelname) => {
        if (event !== null) {
            let Map = {};
            Map["nsampletypecode"] = parseInt(event.value);
            Map['userinfo'] = this.props.Login.userInfo;
            this.props.getSampleTypeChange(Map, this.props.Login.masterData, event, labelname);
        }
    }



    ConfirmComponent = (props) => {
        this.confirmMessage.confirm("confirmation", "Confirmation!", "Do You Want to Override the Existing Components ?",
            "ok", "cancel", () => this.getComponentfromJava(props));
    }

    onRegTypeChange = (event, fieldName, labelname) => {
        if (event !== null) {
            let Map = {};
            Map["nregtypecode"] = parseInt(event.value);
            Map['userinfo'] = this.props.Login.userInfo;
            this.props.getRegTypeChange(Map, this.props.Login.masterData, event, labelname);
        }
    }

    acceptRegistration = (registerId, skip, take) => {
        let sampleList = [];
        if (this.props.Login.masterData.searchedSample !== undefined) {
            sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
        } else {
            sampleList = this.props.Login.masterData.RegistrationGetSample
                && this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take);
        }

        // let sampleList = this.props.Login.masterData.searchedSample || [...this.props.Login.masterData.RegistrationGetSample].splice(skip, skip + take);
        let acceptList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedSample, "npreregno");
        if (acceptList && acceptList.length > 0) {
            if (acceptList.every(this.checkPreregisterAndQuarentine)) {
                if (this.props.Login.masterData.selectedTest.length > 0) {
                    if (checkTestPresent(this.props.Login.masterData.RegistrationGetTest, acceptList)) {
                        let Map = {};
                        Map["fromdate"] = "";
                        Map["todate"] = "";
                        Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
                        Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                        Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
                        Map["nfilterstatus"] = -1;
                        Map["npreregno"] = acceptList &&
                            acceptList.map(sample => sample.npreregno).join(",");
                        // Map["npreregno"] = this.props.Login.masterData.selectedSample &&
                        //     this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",");
                        Map["registrationsample"] = this.props.Login.masterData.selectedSubSample;
                        Map["registrationtest"] = this.props.Login.masterData.selectedTest;
                        Map["ntransactionsamplecode"] = this.props.Login.masterData.selectedSubSample.map(x => x.ntransactionsamplecode).join(",");
                        Map["ntransactiontestcode"] = this.props.Login.masterData.selectedTest.map(x => x.ntransactiontestcode).join(",");;
                        Map["userinfo"] = this.props.Login.userInfo;
                        Map["nflag"] = 2;
                        Map["ntype"] = 3;
                        Map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
                        Map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
                        Map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
                        Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                            && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
                        Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                            && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
                        Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                            && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
                        Map["checkBoxOperation"] = 3
                        Map["stransactiontestcode"] = this.props.Login.masterData.selectedTest.map(sample => sample.ntransactiontestcode).join(",");
                        Map["selectedSample"] = sortData(this.props.Login.masterData.selectedSample,"ascending","npreregno") 
                        Map["RegistrationGetSubSample"] = sortData(this.props.Login.masterData.RegistrationGetSubSample,"ascending","ntransactionsamplecode") 
                       // Map["RegistrationGetTestNew"] = sortData(this.props.Login.masterData.RegistrationGetTestNew,"ascending","ntransactiontestcode") 
                        Map["url"] = this.props.Login.settings[24];

                        let inputParam = {
                            inputData: Map,
                            postParamList: this.postParamList,
                            action: 'accept'
                        }
                        this.confirmMessage.confirm(
                            this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                            this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                            this.props.intl.formatMessage({ id: "IDS_ACCEPTREGISTRATION" }),
                            this.props.intl.formatMessage({ id: "IDS_OK" }),
                            this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                            () => this.acceptRegistrationConfirm(inputParam, registerId));
                    } else {
                        let Map = {};
                        Map["fromdate"] = "";
                        Map["todate"] = "";
                        Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
                        Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                        Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
                        Map["nfilterstatus"] = -1;
                        Map["npreregno"] = acceptList &&
                            acceptList.map(sample => sample.npreregno).join(",");
                        // Map["npreregno"] = this.props.Login.masterData.selectedSample &&
                        //     this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",");
                        Map["registrationsample"] = this.props.Login.masterData.selectedSubSample;
                        Map["registrationtest"] = this.props.Login.masterData.selectedTest;
                        Map["userinfo"] = this.props.Login.userInfo;
                        Map["nflag"] = 2;
                        Map["ntype"] = 1;
                        Map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
                        Map["activeSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
                        Map["activeSubSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
                        Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                            && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
                        Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                            && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
                        Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                            && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
                        Map["checkBoxOperation"] = 3
                        Map["stransactiontestcode"] = this.props.Login.masterData.selectedTest.map(sample => sample.ntransactiontestcode).join(",");
                        Map["selectedSample"] = sortData(this.props.Login.masterData.selectedSample,"ascending","npreregno") 
                        Map["RegistrationGetSubSample"] = sortData(this.props.Login.masterData.RegistrationGetSubSample,"ascending","ntransactionsamplecode") 
                      //  Map["RegistrationGetTestNew"] = sortData(this.props.Login.masterData.RegistrationGetTestNew,"ascending","ntransactiontestcode") 
                      Map["url"] = this.props.Login.settings[24];

                        let inputParam = {
                            inputData: Map,
                            postParamList: this.postParamList,
                            action: 'accept'
                        }
                        this.confirmMessage.confirm("Confirmation", "Confirmation!", "Samples With atleast One Preregister Test Will Only Accept.Do You Want Accept?",
                            "OK", "Cancel", () => this.acceptRegistrationConfirm(inputParam, registerId));
                    }
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_ADDTESTTOREGISTERSAMPLES" }));
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPREREGQUARANTINESAMPLES" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPREREGQUARANTINESAMPLES" }));
        }
    }

    acceptRegistrationConfirm = (inputParam, registerId) => {
        if (showEsign(this.props.Login.userRoleControlRights,
            this.props.Login.userInfo.nformcode, registerId)) {
                const selectedRecord = this.state.selectedRecord || {};
                selectedRecord["esignpassword"] = "";
                selectedRecord["esigncomments"] =  "";
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
            this.props.acceptRegistration(inputParam, this.props.Login.masterData)
        }

    }

    selectQuarantine = (quarantineId, skip, take) => {
        let sampleList = this.props.Login.masterData.searchedSample || (this.props.Login.masterData.RegistrationGetSample ? [...this.props.Login.masterData.RegistrationGetSample].splice(skip, skip + take) : []);
        let quarentineList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.selectedSample, "npreregno");

        if (quarentineList && quarentineList.length > 0) {
            if (quarentineList.every(this.checkPreregisterRecordQuarantine)) {

                // let ntransactionstatus = this.props.Login.masterData.selectedSample &&
                //     this.props.Login.masterData.selectedSample.map(transactionStatus => transactionStatus.ntransactionstatus).join(",");
                //if (ntransactionstatus === transactionStatus.PREREGISTER) {
                let Map = {};
                Map["fromdate"] = "";
                Map["todate"] = "";
                Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
                Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
                Map["nfilterstatus"] = -1;
                Map["npreregno"] = quarentineList && quarentineList.map(sample => sample.npreregno).join(",");
                Map["registrationsample"] = this.props.Login.masterData.selectedSubSample;
                Map["registrationtest"] = this.props.Login.masterData.selectedTest;
                Map["userinfo"] = this.props.Login.userInfo;
                Map["nflag"] = 2;
                Map["ntype"] = 1;
                Map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
                Map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
                Map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
                Map["withoutgetparameter"] = 3;
                Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                    && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
                Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
                Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
                Map["checkBoxOperation"] = 3
                Map["checkBoxOperation"] = 3
                Map["stransactiontestcode"] = this.props.Login.masterData.selectedTest.map(sample => sample.ntransactiontestcode).join(",");
                Map["ntransactionstatus"] = quarentineList &&
                    quarentineList.map(transactionStatus => transactionStatus.ntransactionstatus).join(",");
                    Map["selectedSample"] = sortData(this.props.Login.masterData.selectedSample,"ascending","npreregno") ;
                Map["RegistrationGetSubSample"] = sortData(this.props.Login.masterData.RegistrationGetSubSample,"ascending","ntransactionsamplecode") ;
                //Map["ninsertpreregno"] = quarantineSample.quarantineSample.npreregno;
                let inputParam = {
                    inputData: Map,
                    postParamList: this.postParamList,
                    action: 'quarantine'
                }
                //console.log("inputParam, quarantine:", inputParam);
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, quarantineId)) {
                    const selectedRecord = this.state.selectedRecord || {};
                    selectedRecord["esignpassword"] = "";
                    selectedRecord["esigncomments"] =  "";
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true,
                            screenData: { inputParam, masterData: this.props.Login.masterData },
                            openModal: true,
                            parentPopUpSize: 'lg',
                            screenName: this.props.Login.screenName,
                            operation: 'quarantine'
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.props.preregRecordToQuarantine(inputParam, this.props.Login.masterData)
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPREREGISTERSAMPLES" }))
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPREREGISTERSAMPLES" }))
        }

    }

    checkPreregisterAndQuarentine(sample) {
        return (sample.ntransactionstatus === transactionStatus.PREREGISTER || sample.ntransactionstatus === transactionStatus.QUARANTINE)
    }

    checkPreregisterRecordQuarantine(sample) {
        return (sample.ntransactionstatus === transactionStatus.PREREGISTER)
    }

    onRegSubTypeChange = (event, fieldName, labelname) => {
        if (event !== null) {
            let Map = {};
            Map['nregtypecode'] = this.props.Login.masterData.RegTypeValue.nregtypecode;
            Map["nregsubtypecode"] = parseInt(event.value);
            Map["nneedtemplatebasedflow"] = event.item.nneedtemplatebasedflow;
            Map['userinfo'] = this.props.Login.userInfo;
            this.props.getRegSubTypeChange(Map, this.props.Login.masterData, event, labelname);
        }
    }



    onDesignTemplateChange = (event, fieldName, labelname) => {
        let masterData = this.props.Login.masterData;
        masterData = {
            ...masterData,
            [labelname]: { ...event.item }
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { masterData }
        }
        this.props.updateStore(updateInfo);
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName) => {
        // if (comboData !== null) {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
        // }
    }

    PrinterChange = (comboData, fieldName) => {
        const selectedPrinterData = this.state.selectedPrinterData || {};
        selectedPrinterData[fieldName] = comboData;
        this.setState({ selectedPrinterData });
    }



    closeChildModal = () => {
        let loadRegSubSample = this.props.Login.loadRegSubSample;
        let loadFile = this.props.Login.loadFile;
        let showSaveContinue = this.props.Login.showSaveContinue;
        let screenName = this.props.Login.screenName;
        let loadChildTest = this.props.Login.loadChildTest;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.state.selectedRecord;
        if (this.props.Login.loadFile) {
            loadFile = false;
            screenName = this.props.Login.PopUpLabel
        } else if (this.props.Login.loadChildTest) {
            loadChildTest = false;
            openModal = false;
            selectedRecord = {}
        }
        else if (this.props.Login.loadRegSubSample) {
            loadRegSubSample = false;
            openModal = false;
            selectedRecord = {}
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadRegSubSample, screenName, showSaveContinue,
                loadFile, loadChildTest,
                openModal,
                parentPopUpSize: "xl", selectedRecord
            }
        }
        this.props.updateStore(updateInfo);
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let loadPreregister = this.props.Login.loadPreregister;
        let openChildModal = this.props.Login.openChildModal;
        let parentPopUpSize = this.props.Login.pare
        let screenName = this.props.Login.screenName;
        let loadPrinter = this.props.Login.loadPrinter;
        let openPortal = this.props.Login.openPortal;
        let Component = this.props.Login.Component;
        let subSampleDataGridList = this.props.Login.subSampleDataGridList;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "accept" || this.props.Login.operation === "cancel" || this.props.Login.operation === "quarantine") {
                loadEsign = false;
                openModal = false;
                openChildModal = false
                loadPreregister = false;
                selectedRecord["esigncomments"] = "";
                selectedRecord["esignpassword"] = "";
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { loadEsign, openModal, openChildModal, loadPreregister }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                loadEsign = false;
                if (loadPreregister) {
                    selectedRecord["esigncomments"] = "";
                    selectedRecord["esignpassword"] = "";
                    parentPopUpSize = 'xl'
                }
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { loadEsign, parentPopUpSize }
                }
                this.props.updateStore(updateInfo);
            }
        }
        else {
            openModal = false;
            loadPrinter = false;
            loadPreregister = false;
            selectedRecord = {};
            openPortal = false;
            subSampleDataGridList = []

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openModal, loadPreregister, selectedRecord,
                    screenName, insertSourcePreregno: undefined,
                    loadPrinter, openPortal,
                    Component, subSampleDataGridList
                }
            }
            this.props.updateStore(updateInfo);
        }



    }

    onSaveClick = (saveType, formRef) => {
        let operation = this.props.Login.operation;
        if (operation === "update") {
            this.onUpdateRegistration(saveType, formRef, operation);
        }
    }


    onSavePrinterClick = () => {
        let insertlist = [];
        //this.state.selectedPrinterData.sprintername && this.state.selectedPrinterData.sprintername.map(source=>insertlist.push({npreregno:this.props.Login.insertSourcePreregno,sprintername:source.value}))
        const inputParam = {
            classUrl: 'barcode',
            methodUrl: 'Barcode',
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                npreregno: this.props.Login.insertPrinterPreregno,
                sprintername: this.state.selectedPrinterData.sprintername ? this.state.selectedPrinterData.sprintername.value : '',
                insertlist,
                npreregno1: this.props.Login.masterData.selectedSample.map(x => x.npreregno).join(","),
                userinfo: this.props.Login.userInfo,
                ncontrolcode: this.props.Login.ncontrolcode
            },
            operation: 'printer',
            // dataState:this.state.sourceDataState,
            // activeSampleTab:"IDS_SOURCE",
            action: 'printer'
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: 'printer'
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    onSaveFileClick = (saveType, formRef) => {
        const selectedFile = this.state.selectedFile;
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedFile.sfilename;
        const formData = new FormData();
        // if(nattachmenttypecode === attachmentType.FTP) {
        if (acceptedFiles && acceptedFiles.length > 0) {
            acceptedFiles.forEach((file, index) => {
                formData.append("uploadedFile" + index, file);
            });
            formData.append("filecount", acceptedFiles.length);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYONEFILETOSUBMIT" }));
        }

        formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
        formData.append("nstudyplan", JSON.stringify(selectedRecord.nallottedspeccode.value));
        formData.append("testrequired", JSON.stringify(selectedRecord.ntransactionstatus === 3 ? true : false));
        formData.append("ntemplatemanipulationcode", JSON.stringify(selectedRecord.ntemplatemanipulationcode));
        formData.append("nregtypecode", JSON.stringify(this.props.Login.masterData.RealRegTypeValue.nregtypecode));
        formData.append("nregsubtypecode", JSON.stringify(this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode));
        this.props.ImportFile(formData, this.confirmMessage, this.props.Login);
    }


    sampleInfoDataStateChange = (event) => {
        this.setState({
            sampleGridDataState: event.dataState
        });
    }

    dataStateChange = (event) => {
        switch (this.props.Login.activeSampleTab) {
            case "IDS_SOURCE":
                this.setState({
                    sourceDataState: event.dataState
                });
                break;
            default:
                this.setState({
                    sourceDataState: event.dataState
                });
                break;
        }
    }

    subSampledataStateChange = (event) => {
        switch (this.props.Login.activeSubSampleTab) {
            case "IDS_SUBSAMPLECOMMENTS":
                this.setState({
                    subSampleCommentDataState: event.dataState
                });
                break;
            case "IDS_SUBSAMPLEATTACHMENTS":
                this.setState({
                    subSampleAttachmentDataState: event.dataState
                });
                break;
            default:
                this.setState({
                    popUptestDataState: event.dataState
                });
                break;
        }

    }


    testdataStateChange = (event) => {
        switch (this.props.Login.activeSampleTab) {
            case "IDS_TEST":
                this.setState({
                    popUptestDataState: event.dataState
                });
                break;
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
            default:
                this.setState({
                    popUptestDataState: event.dataState
                });
                break;
        }

    }




    testStateChange = (event) => {
        this.setState({
            testDataState: event.dataState
        });
    }



    sampleTabDetail = () => {
        let npreregno = this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",") : "-1";
        const tabMap = new Map();


        let sampleList = this.props.Login.masterData.RegistrationGetSample || [];
        let { skip, take } = this.state
        sampleList = sampleList.slice(skip, skip + take);
        let selectedSampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.selectedSample, "npreregno");

        tabMap.set("IDS_ATTACHMENTS", <Attachments
            screenName="IDS_SAMPLEATTACHMENTS"
            onSaveClick={this.onAttachmentSaveClick}
            selectedMaster="selectedSample"
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            attachments={this.props.Login.masterData.RegistrationAttachment || []}
            deleteRecord={this.props.deleteAttachment}
            masterList={this.props.Login.masterData.selectedSample}
            masterAlertStatus={"IDS_SELECTSAMPLETOADDATTACHMENT"}
            fetchRecord={this.props.getAttachmentCombo}
            viewFile={this.props.viewAttachment}
            addName={"AddSampleAttachment"}
            editName={"EditSampleAttachment"}
            deleteName={"DeleteSampleAttachment"}
            viewName={"ViewSampleAttachment"}
            methodUrl={"SampleAttachment"}
            userInfo={this.props.Login.userInfo}
            nsubsampleneed={this.props.Login.masterData["RegSubTypeValue"]}
            skip={this.props.Login.inputParam ? this.props.Login.inputParam.attachmentskip || 0 : 0}
            take={this.props.Login.inputParam ? this.props.Login.inputParam.attachmenttake || 10 : this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5}
            deleteParam={
                {
                    methodUrl: "SampleAttachment",
                    npreregno,
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    esignRights: this.props.Login.userRoleControlRights
                }
            }
            editParam={{
                methodUrl: "SampleAttachment",
                npreregno,
                userInfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData,
                esignRights: this.props.Login.userRoleControlRights,
                masterList: this.props.Login.masterData.RegistrationGetSample || []

            }}
            selectedListName="IDS_SAMPLE"
            displayName="sarno"
        />)
        tabMap.set("IDS_SAMPLECOMMENTS", <Comments
            screenName="IDS_SAMPLECOMMENTS"
            onSaveClick={this.onCommentsSaveClick}
            selectedMaster="selectedSample"
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
                masterList: this.props.Login.masterData.RegistrationGetSample || [],
                ncontrolCode: this.state.controlMap.has("EditSampleComment") && this.state.controlMap.get("EditSampleComment").ncontrolcode
            }}
            selectedListName="IDS_SAMPLES"
            displayName="sarno"
        />)

        return tabMap;
    }

    subsampleTabDetail = () => {
        let ntransactionsamplecode = this.props.Login.masterData.selectedSubSample ?
            this.props.Login.masterData.selectedSubSample.map(sample => sample.ntransactionsamplecode).join(",") : "-1";
        const tabMap = new Map();
        let subsampleList = this.props.Login.masterData.RegistrationGetSubSample || [];
        let { subsampleskip, subsampletake } = this.state
        subsampleList = subsampleList.slice(subsampleskip, subsampleskip + subsampletake);
        let selectedSubSampleList = getSameRecordFromTwoArrays(subsampleList, this.props.Login.masterData.selectedSubSample, "ntransactionsamplecode");

        tabMap.set("IDS_SUBSAMPLEATTACHMENTS", <Attachments
            screenName="IDS_SUBSAMPLEATTACHMENTS"
            onSaveClick={this.onAttachmentSaveClick}
            selectedMaster="selectedSubSample"
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            attachments={this.props.Login.masterData.RegistrationSampleAttachment || []}
            deleteRecord={this.props.deleteAttachment}
            masterList={this.props.Login.masterData.selectedSubSample}
            masterAlertStatus={"IDS_SELECTSUBSAMPLETOADDATTACHMENT"}
            fetchRecord={this.props.getAttachmentCombo}
            viewFile={this.props.viewAttachment}
            addName={"AddSubSampleAttachment"}
            editName={"EditSubSampleAttachment"}
            deleteName={"DeleteSubSampleAttachment"}
            viewName={"ViewSubSampleAttachment"}
            methodUrl={"SubSampleAttachment"}
            userInfo={this.props.Login.userInfo}
            nsubsampleneed={this.props.Login.masterData["RegSubTypeValue"]}
            skip={this.props.Login.inputParam ? this.props.Login.inputParam.attachmentskip || 0 : 0}
            take={this.props.Login.inputParam ? this.props.Login.inputParam.attachmenttake || 10 : this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5}
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
                masterList: this.props.Login.masterData.RegistrationGetSubSample || []

            }}
            selectedListName="IDS_SUBSAMPLE"
            displayName="ssamplearno"
        />)
        tabMap.set("IDS_SUBSAMPLECOMMENTS", <Comments
            screenName="IDS_SUBSAMPLECOMMENTS"
            onSaveClick={this.onCommentsSaveClick}
            selectedMaster="selectedSubSample"
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            Comments={this.props.Login.masterData.RegistrationSampleComment || []}
            fetchRecord={this.props.getCommentsCombo}
            addName={"AddSubSampleComment"}
            editName={"EditSubSampleComment"}
            deleteName={"DeleteSubSampleComment"}
            methodUrl={"SubSampleComment"}
            isTestComment={false}
            masterList={selectedSubSampleList}
            masterAlertStatus="IDS_SELECTSUBSAMPLETOADDCOMMENTS"
            primaryKeyField={"nsamplecommentcode"}
            dataState={this.state.subSampleCommentDataState}
            dataStateChange={this.subSampledataStateChange}
            masterData={this.props.Login.masterData}
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
                masterList: this.props.Login.masterData.RegistrationGetSubSample || [],
                ncontrolCode: this.state.controlMap.has("EditSubSampleComment") && this.state.controlMap.get("EditSubSampleComment").ncontrolcode
            }}
            selectedListName="IDS_SUBSAMPLES"
            displayName="ssamplearno"
        />)

        return tabMap;
    }

    testTabDetail = () => {

        const testTabMap = new Map();
        let testList = this.props.Login.masterData.RegistrationGetTest || [];
        let { testskip, testtake } = this.state
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.selectedTest, "ntransactiontestcode");
        // const cancelId = this.state.controlMap.has("CancelTest") && this.state.controlMap.get("CancelTest").ncontrolcode;
        let ntransactiontestcode = this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        let subsampleneed =this.props.Login.masterData["RegSubTypeValue"];
        testTabMap.set("IDS_PARAMETERRESULTS", <RegistrationResultTab
            userInfo={this.props.Login.userInfo}
            masterData={this.props.Login.masterData}
            inputParam={this.props.Login.inputParam}
            dataState={this.state.resultDataState}
            dataStateChange={this.testDataStateChange}
            screenName="IDS_PARAMETERRESULTS"
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
        />)
        testTabMap.set("IDS_TESTATTACHMENTS", <Attachments
            screenName="IDS_TESTATTACHMENTS"
            selectedMaster="selectedTest"
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
            dataState={this.state.testAttachmentDataState}
            dataStateChange={this.testDataStateChange}
            nsubsampleneed={this.props.Login.masterData["RegSubTypeValue"]}
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
                masterList: this.props.Login.masterData.selectedTest
            }}
            selectedListName="IDS_TESTS"
            displayName="stestsynonym"
        />)
        testTabMap.set("IDS_TESTCOMMENTS", <Comments
            screenName="IDS_TESTCOMMENTS"
            onSaveClick={this.onCommentsSaveClick}
            selectedMaster="selectedTest"
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            Comments={this.props.Login.masterData.RegistrationTestComment || []}
            fetchRecord={this.props.getCommentsCombo}
            addName={"AddTestComment"}
            editName={"EditTestComment"}
            deleteName={"DeleteTestComment"}
            methodUrl={"TestComment"}
            isTestComment={false}
            masterList={selectedTestList}
            masterAlertStatus="IDS_SELECTTESTTOADDCOMMENTS"
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
                masterList: this.props.Login.masterData.RegistrationGetSample || [],
                ncontrolCode: this.state.controlMap.has("EditTestComment") && this.state.controlMap.get("EditTestComment").ncontrolcode
            }}
            selectedListName="IDS_TESTS"
            displayName="stestsynonym"
        />)
        return testTabMap;
    }

    getCommentsCombo = (event) => {

        if (this.props.Login.selectedTest && this.props.Login.selectedTest.length > 0) {
            this.props.getCommentsCombo(...event);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTESTTOADDCOMMENTS" }))
        }
    }

    testDataStateChange = (event) => {
        switch (this.props.Login.activeTestTab) {
            case "IDS_PARAMETERRESULTS":
                this.setState({
                    resultDataState: event.dataState
                });
                break;
            case "IDS_TEST":
                this.setState({
                    testDataState: event.dataState
                });
                break;
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
            default:
                this.setState({
                    resultDataState: event.dataState
                });
                break;
        }

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
                sampleList = this.props.Login.masterData.RegistrationGetSample.slice(this.state.skip, this.state.skip + this.state.take);
            }
            let acceptList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.selectedSample, "npreregno");
            // let acceptList=getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.RegistrationGetTest.slice(this.state.testskip, this.state.testskip + this.state.testtake), "npreregno");

            let saveParam = {
                userInfo: this.props.Login.userInfo,
                isTestComment: this.props.isTestComment,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                npreregno: this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(x => x.npreregno).join(",") : "-1"
            }
            inputParam = onSaveSampleComments(saveParam, acceptList);
        }

        if (this.props.Login.screenName === "IDS_SUBSAMPLECOMMENTS") {
            let sampleList = [];
            if (this.props.Login.masterData.searchedSubSample !== undefined) {
                sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSubSample, this.props.Login.masterData.RegistrationGetSubSample.slice(this.state.subsampleskip, this.state.subsampleskip + this.state.subsampletake), "npreregno");
            } else {
                sampleList = this.props.Login.masterData.RegistrationGetSubSample.slice(this.state.subsampleskip, this.state.subsampleskip + this.state.subsampletake);
            }
            let acceptList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.selectedSubSample, "ntransactionsamplecode");
            // let acceptList=getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.RegistrationGetTest.slice(this.state.testskip, this.state.testskip + this.state.testtake), "npreregno");

            let saveParam = {
                userInfo: this.props.Login.userInfo,
                isTestComment: this.props.isTestComment,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                ntransactionsamplecode: this.props.Login.masterData.selectedSubSample ? this.props.Login.masterData.selectedSubSample.map(x => x.ntransactionsamplecode).join(",") : "-1"
            }
            inputParam = onSaveSubSampleComments(saveParam, acceptList);
        }
        if (this.props.Login.screenName === "IDS_TESTCOMMENTS") {
            let testList = [];
            if (this.props.Login.masterData.searchedTest !== undefined) {
                testList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.RegistrationGetTest.slice(this.state.testskip, this.state.testskip + this.state.testtake), "npreregno");
            } else {
                testList = this.props.Login.masterData.RegistrationGetTest.slice(this.state.testskip, this.state.testskip + this.state.testtake);
            }
            let acceptList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.selectedTest, "ntransactiontestcode");
            // let acceptList=getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.RegistrationGetTest.slice(this.state.testskip, this.state.testskip + this.state.testtake), "npreregno");

            let saveParam = {
                userInfo: this.props.Login.userInfo,
                isTestComment: this.props.isTestComment,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                ntransactiontestcode: this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(x => x.ntransactiontestcode).join(",") : "-1"
            }
            inputParam = onSaveTestComments(saveParam, acceptList);
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
        let acceptList = []
        inputData["userinfo"] = this.props.Login.userInfo;
        let sampleList = [];
        if (this.props.Login.masterData.searchedTest !== undefined) {
            //sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(this.state.skip, this.state.skip + this.state.take), "npreregno");
            sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.RegistrationGetSample.slice(this.state.skip, this.state.skip + this.state.take), "npreregno");

        } else {
            sampleList = this.props.Login.masterData.RegistrationGetSample.slice(this.state.skip, this.state.skip + this.state.take);
        }
        if (this.props.Login.operation === "update") {
            acceptList.push(selectedRecord);
        }
        else {
            acceptList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.selectedSample, "npreregno");
        }


        if (this.props.Login.screenName === "IDS_SAMPLEATTACHMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                selectedMaster: this.props.selectedMaster,
                npreregno: this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(x => x.npreregno).join(",") : "-1"
            }
            inputParam = onSaveSampleAttachment(saveParam, acceptList);
        } else if (this.props.Login.screenName === "IDS_TESTATTACHMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                selectedMaster: this.props.selectedMaster,
                ntransactiontestcode: this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(x => x.ntransactiontestcode).join(",") : "-1"
            }
            inputParam = onSaveTestAttachment(saveParam, this.props.Login.masterData.selectedTest);
        }
        else if (this.props.Login.screenName === "IDS_SUBSAMPLEATTACHMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                selectedMaster: this.props.selectedMaster,
                ntransactionsamplecode: this.props.Login.masterData.selectedSubSample ? this.props.Login.masterData.selectedSubSample.map(x => x.ntransactionsamplecode).join(",") : "-1"
            }
            inputParam = onSaveSubSampleAttachment(saveParam, this.props.Login.masterData.selectedSubSample);
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

    gridfillingColumn(data) {
        //  const tempArray = [];
        const temparray = data && data.map((option) => {
            return { "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode] || "-", "dataField": option[designProperties.VALUE], "width": "200px", "columnSize": "3" };
        });
        return temparray;
    }


    cancelSubSampleRecord = (controlcode, skip, take) => {
        let testList = this.props.Login.masterData.searchedSubSample ||
            (this.props.Login.masterData.RegistrationGetSubSample ?
                [...this.props.Login.masterData.RegistrationGetSubSample].splice(skip, skip + take) : []);
        let acceptList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.selectedSubSample, "ntransactionsamplecode");

        if (acceptList && acceptList.length > 0) {
            // console.log("Success:", dataitem);
            if (this.transValidation(this.props.Login.transactionValidation, controlcode, acceptList)) {
                let Map = {};
                Map['npreregno'] = acceptList.map(x => x.npreregno).join(",");
                Map['ntransactiontestcode'] = this.props.Login.masterData.selectedTest.map(x => x.ntransactiontestcode).join(",");
                // Map['ntransactionstatus'] = dataitem.ntransactionstatus;
                // Map["ntransactionsamplecode"] = acceptList.map(x => x.ntransactionsamplecode).join(",");
                //  Map["ninserttransactionsamplecode"] = dataitem.ntransactionsamplecode
                Map["userinfo"] = this.props.Login.userInfo;
                Map["ncontrolcode"] = controlcode;
                Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
                Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
                Map["nflag"] = 2;
                Map["ntype"] = 3;
                // Map["withoutgetparameter"] = 3;
                Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
                Map["nfilterstatus"] = this.props.Login.masterData.FilterStatusValue.ntransactionstatus;
                Map["npreregno"] = acceptList &&
                    acceptList.map(sample => sample.npreregno).join(",");
                Map["ntransactionsamplecode"] = acceptList &&
                    acceptList.map(sample => sample.ntransactionsamplecode).join(",");
                Map["registrationsample"] = this.props.Login.masterData.selectedSample;
                Map["registrationSubSample"] = this.props.Login.masterData.selectedSubSample;
                Map["registrationTest"] = this.props.Login.masterData.selectedTest;
                Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                    && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
                Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
                Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
                Map["checkBoxOperation"] = 3
                Map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
                Map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
                Map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
                Map["selectedSample"] = sortData(this.props.Login.masterData.selectedSample,"ascending","npreregno") ;
                Map["RegistrationGetSubSample"] = sortData(this.props.Login.masterData.RegistrationGetSubSample,"ascending","ntransactionsamplecode") ;
                let inputParam = {
                    inputData: Map,
                    postParamList: this.postParamList,
                    action: 'cancelSample'
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, controlcode)) {
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
                    this.props.cancelSubSampleAction(inputParam, this.props.Login.masterData)
                }
            } else {


                let nregsubtypecode=this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode
                let valuenew = this.props.Login.transactionValidation[controlcode].filter(function(subtypefilter) {
                    return subtypefilter.nregsubtypecode == nregsubtypecode; });

               
                
                let value = valuenew.map(sample =>
                        this.props.intl.formatMessage({ id: sample.stransdisplaystatus })).join("/")

                // let value = this.props.Login.transactionValidation[controlcode] &&
                //     this.props.Login.transactionValidation[controlcode].map(sample =>
                //         this.props.intl.formatMessage({ id: sample.stransdisplaystatus })).join("/")

                //toast.warn("Select" + " " + value + " to Cancel/Reject Test");
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECT" }) + value + this.props.intl.formatMessage({ id: "IDS_TOCANCELREJECTTEST" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTESTTOCANCELREJECT" }));
        }
    }

    cancelRecord = (controlcode, skip, take) => {
        let testList = this.props.Login.masterData.searchedTest ||
            (this.props.Login.masterData.RegistrationGetTest ?
                [...this.props.Login.masterData.RegistrationGetTest].splice(skip, skip + take) : []);
        let acceptList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.selectedTest, "ntransactiontestcode");

        if (acceptList && acceptList.length > 0) {
            // console.log("Success:", dataitem);
            if (this.transValidation(this.props.Login.transactionValidation, controlcode, acceptList)) {
                let Map = {};
                Map['ninsertpreregno'] = acceptList.map(x => x.npreregno).join(",");
                // Map['ntransactionstatus'] = dataitem.ntransactionstatus;
                Map["ntransactiontestcode"] = acceptList.map(x => x.ntransactiontestcode).join(",");
                //  Map["ninserttransactionsamplecode"] = dataitem.ntransactionsamplecode
                Map["userinfo"] = this.props.Login.userInfo;
                Map["ncontrolcode"] = controlcode;
                Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
                Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
                Map["nflag"] = 2;
                Map["ntype"] = 3;
                Map["withoutgetparameter"] = 3;
                Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
                Map["nfilterstatus"] = this.props.Login.masterData.FilterStatusValue.ntransactionstatus;
                Map["npreregno"] = acceptList &&
                    acceptList.map(sample => sample.npreregno).join(",");
                Map["ntransactionsamplecode"] = acceptList &&
                    acceptList.map(sample => sample.ntransactionsamplecode).join(",");
                Map["registrationsample"] = this.props.Login.masterData.selectedSample;
                Map["registrationSubSample"] = this.props.Login.masterData.selectedSubSample;
                Map["registrationTest"] = this.props.Login.masterData.selectedTest;
                Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                    && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
                Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
                Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedsubsample; 
                let inputParam = {
                    inputData: Map,
                    postParamList: this.postParamList,
                    action: 'cancelTest'
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, controlcode)) {
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
                    this.props.cancelTestAction(inputParam, this.props.Login.masterData)
                }
            } else {


                let nregsubtypecode=this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode
                let valuenew = this.props.Login.transactionValidation[controlcode].filter(function(subtypefilter) {
                    return subtypefilter.nregsubtypecode == nregsubtypecode; });

               
                
                let value = valuenew.map(sample =>
                        this.props.intl.formatMessage({ id: sample.stransdisplaystatus })).join("/")
                // let value = this.props.Login.transactionValidation[controlcode] &&
                //     this.props.Login.transactionValidation[controlcode].map(sample =>
                //         this.props.intl.formatMessage({ id: sample.stransdisplaystatus })).join("/")

                //toast.warn("Select" + " " + value + " to Cancel/Reject Test");
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECT" }) + value + this.props.intl.formatMessage({ id: "IDS_TOCANCELREJECTTEST" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTESTTOCANCELREJECT" }));
        }
    }



    addSubSample = (controlcode, skip, take) => {
        let Map = {};
        let sampleList = [];
        if (this.props.Login.masterData.searchedSample !== undefined) {
            sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
        } else {
            sampleList = this.props.Login.masterData.RegistrationGetSample && this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take);
        }

        let addSubSampleList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedSample, "npreregno");

        if (addSubSampleList && addSubSampleList.length > 0) {
            const findTransactionStatus = [...new Set(addSubSampleList.map(item => item.ntransactionstatus))];

            if (findTransactionStatus.length === 1) {
                if (findTransactionStatus[0] === transactionStatus.PREREGISTER) {
                    //   const findApprovalVersion = [...new Set(addSubSampleList.map(item => item.napprovalversioncode))];
                    //   if (findApprovalVersion.length === 1) {
                    const findSampleSpec = [...new Set(addSubSampleList.map(item => item.nallottedspeccode))];
                    const findComponentReqSpec = [...new Set(addSubSampleList.map(item => item.ncomponentrequired))];
                    const findSampleSpectemplate = [...new Set(addSubSampleList.map(item => item.ntemplatemanipulationcode))];
                    //const findComponent = [...new Set(selectsubsample.map(item => item.ncomponentcode))];
                    if (findSampleSpec.length === 1)//&& findComponent.length === 1 
                    {
                        let data = []
                        const regSubSamplewithoutCombocomponent = []
                        const Layout = this.props.Login.masterData.SubSampleTemplate
                            && this.props.Login.masterData.SubSampleTemplate.jsondata
                        if (Layout !== undefined) {
                            Layout.map(row => {
                                return row.children.map(column => {
                                    return column.children.map(component => {
                                        return component.hasOwnProperty("children") ?
                                            component.children.map(componentrow => {
                                                if (componentrow.inputtype === "combo") {
                                                    data.push(componentrow)
                                                } else {
                                                    regSubSamplewithoutCombocomponent.push(componentrow)
                                                }
                                                return null;
                                            })
                                            : component.inputtype === "combo" ? data.push(component) :
                                                regSubSamplewithoutCombocomponent.push(component)
                                    })
                                })

                            })
                            const regSubSamplecomboComponents = data
                            let regchildColumnList = {};
                            data.map(columnList => {
                                const val = comboChild(data, columnList, regchildColumnList, true);
                                data = val.data;
                                regchildColumnList = val.childColumnList
                                return null;
                            })
                            //const Map={}
                            // const findSamplentemplatemanipulationcode = [...new Set(addSubSampleList.map(item => item.ntemplatemanipulationcode))];
                            // Map["ntemplatemanipulationcode"] = findSamplentemplatemanipulationcode[0];
                            Map["nallottedspeccode"] = findSampleSpec[0];
                            Map["ntemplatemanipulationcode"] = findSampleSpectemplate[0];
                            Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                            Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
                            Map["npreregno"] = addSubSampleList &&
                                addSubSampleList.map(sample => sample.npreregno).join(",");
                            Map["registrationsample"] = addSubSampleList;

                            this.props.addsubSampleRegistration(this.props.Login.masterData,
                                this.props.Login.userInfo, data, this.state.selectedRecord,
                                regchildColumnList, regSubSamplecomboComponents,
                                regSubSamplewithoutCombocomponent,
                                Map, controlcode, findComponentReqSpec[0] === 3 ? true : false)
                        } else {
                            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASECONFIGURETHESUBSAMPLETEMPLATE" }));
                        }

                    } else {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMESPECANDCOMPONENT" }));
                    }
                    // } else {
                    //    toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMEAPPROVALCONFIG" }));
                    // }
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPREREGISTERSAMPLETOADDSUBSAMPLE" }));
                }
            }

            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMESTATUS" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLETOSUBSAMPLE" }));
        }
    }


    componentDidUpdate(previousProps) {

        if (this.props.Login.columnList !== previousProps.Login.columnList) {

            this.setState({
                columnList: this.props.Login.columnList,
                childColumnList: this.props.Login.childColumnList,
                withoutCombocomponent: this.props.Login.withoutCombocomponent,
                comboComponents: this.props.Login.comboComponents
            });

        }

        if (this.props.Login.regparentSubSampleColumnList !== previousProps.Login.regparentSubSampleColumnList) {
            this.setState({
                regparentSubSampleColumnList: this.props.Login.regparentSubSampleColumnList,
                regSubSamplecomboComponents: this.props.Login.regSubSamplecomboComponents,
                regSubSamplewithoutCombocomponent: this.props.Login.regSubSamplewithoutCombocomponent
            });

        }


        if (this.props.Login.showSaveContinue !== previousProps.Login.showSaveContinue) {
            this.setState({ showSaveContinue: this.props.Login.showSaveContinue });

        }
        if (this.props.Login !== previousProps.Login) {
            this.PrevoiusLoginData = previousProps
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        else if (this.props.Login.selectedPrinterData !== previousProps.Login.selectedPrinterData) {
            this.setState({ selectedPrinterData: this.props.Login.selectedPrinterData });
        }
        else if (this.props.Login.loadFile !== previousProps.Login.loadFile && (this.props.Login.loadFile === false)) {
            this.setState({ selectedFile: undefined })
        }
        else if (this.props.Login.selectedFilter !== previousProps.Login.selectedFilter) {
            this.setState({ selectedFilter: this.props.Login.selectedFilter });
        }
        if (this.props.Login.popUptestDataState && this.props.Login.popUptestDataState !== previousProps.Login.popUptestDataState) {
            this.setState({ popUptestDataState: this.props.Login.popUptestDataState });
        }

        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

            const cancelId = controlMap.has("CancelTest") ? controlMap.get("CancelTest").ncontrolcode : -1;
            const preRegisterId = controlMap.has("AddPreregister") ? controlMap.get("AddPreregister").ncontrolcode : -1;
            const registerId = controlMap.has("RegisterAccept") ? controlMap.get("RegisterAccept").ncontrolcode : -1;
            const editSampleId = controlMap.has("EditSample") ? controlMap.get("EditSample").ncontrolcode : -1;
            const quarantineId = controlMap.has("RegisterQuarantine") ? controlMap.get("RegisterQuarantine").ncontrolcode : -1;
            const addTestId = controlMap.has("AddNewTest") ? controlMap.get("AddNewTest").ncontrolcode : -1;
            const printBarcodeId = controlMap.has("PrintBarcode") ? controlMap.get("PrintBarcode").ncontrolcode : -1;
            const cancelSampleId = controlMap.has("CancelReject") ? controlMap.get("CancelReject").ncontrolcode : -1;
            const addSubSampleId = controlMap.has("AddSubSample") ? controlMap.get("AddSubSample").ncontrolcode : -1;
            const editSubSampleId = controlMap.has("EditSubSample") ? controlMap.get("EditSubSample").ncontrolcode : -1;
            const cancelSubSampleId = controlMap.has("CancelSubSample") ? controlMap.get("CancelSubSample").ncontrolcode : -1;

            this.setState({
                userRoleControlRights, controlMap, cancelId,
                preRegisterId, registerId, editSampleId, quarantineId, addTestId, printBarcodeId,
                cancelSampleId, addSubSampleId, editSubSampleId, cancelSubSampleId
            });

        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {


            let { skip, take, testskip, testtake, subsampleskip, subsampletake, testCommentDataState,
                resultDataState, sampleGridDataState, popUptestDataState, DynamicSampleColumns, DynamicSubSampleColumns,
                DynamicTestColumns, DynamicGridItem, DynamicGridMoreField, SingleItem, testMoreField, testListColumns,
                SubSampleDynamicGridItem, SubSampleDynamicGridMoreField, SubSampleSingleItem, sampleSearchField, subsampleSearchField,
                testSearchField, testAttachmentDataState, sampleCommentDataState, sampledateconstraints, subsampledateconstraints,sampleCombinationUnique,subsampleCombinationUnique } = this.state
            if (this.props.Login.masterData.DynamicDesign && this.props.Login.masterData.DynamicDesign !== previousProps.Login.masterData.DynamicDesign) {
                const dynamicColumn = JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata.value)
                DynamicSampleColumns = dynamicColumn.samplelistitem ? dynamicColumn.samplelistitem : [];
                DynamicSubSampleColumns = dynamicColumn.subsamplelistitem ? dynamicColumn.subsamplelistitem : [];
                DynamicTestColumns = dynamicColumn.testlistitem ? dynamicColumn.testlistitem : []

                DynamicGridItem = dynamicColumn.samplegriditem ? dynamicColumn.samplegriditem : [];
                DynamicGridMoreField = dynamicColumn.samplegridmoreitem ? dynamicColumn.samplegridmoreitem : [];
                SingleItem = dynamicColumn.sampledisplayfields ? dynamicColumn.sampledisplayfields : [];

                SubSampleDynamicGridItem = dynamicColumn.subsamplegriditem ? dynamicColumn.subsamplegriditem : [];
                SubSampleDynamicGridMoreField = dynamicColumn.subsamplegridmoreitem ? dynamicColumn.subsamplegridmoreitem : [];
                SubSampleSingleItem = dynamicColumn.subsampledisplayfields ? dynamicColumn.subsampledisplayfields : [];
                //console.log("Subsample",SubSampleSingleItem)
                testMoreField = dynamicColumn.testlistmoreitems ? dynamicColumn.testlistmoreitems : [];
                testListColumns = dynamicColumn.testlistitem ? dynamicColumn.testlistitem : [];

                sampleSearchField = dynamicColumn.samplesearchfields ? dynamicColumn.samplesearchfields : [];
                subsampleSearchField = dynamicColumn.subsamplesearchfields ? dynamicColumn.subsamplesearchfields : [];
                testSearchField = dynamicColumn.testsearchfields ? dynamicColumn.testsearchfields : [];

                sampledateconstraints = dynamicColumn.sampledateconstraints || [];
                subsampledateconstraints = dynamicColumn.subsampledateconstraints || [];

                sampleCombinationUnique=dynamicColumn.samplecombinationunique || [];
                subsampleCombinationUnique=dynamicColumn.subsamplecombinationunique || [];


                // specBasedComponent = true;
            }
            let showSample = this.props.Login.showSample === this.state.showTest || this.state.showSample
            let showTest = showSample ? false : true
            let stateSampleType = this.state.stateSampleType
            let stateRegistrationType = this.state.stateRegistrationType
            let stateRegistrationSubType = this.state.stateRegistrationSubType
            let stateFilterStatus = this.state.stateFilterStatus
            let stateDynamicDesign = this.state.stateDynamicDesign
            if (this.props.Login.masterData.SampleType !== previousProps.Login.masterData.SampleType) {

                const sampleTypeMap = constructOptionList(this.props.Login.masterData.SampleType || [], "nsampletypecode",
                    "ssampletypename", "nsorter", "ascending", false);
                stateSampleType = sampleTypeMap.get("OptionList")

            }

            if (this.props.Login.masterData.RegistrationType !== previousProps.Login.masterData.RegistrationType) {

                const registrationTypeMap = constructOptionList(this.props.Login.masterData.RegistrationType || [], "nregtypecode",
                    "sregtypename", "nsorter", "ascending", false);

                stateRegistrationType = registrationTypeMap.get("OptionList")
            }

            if (this.props.Login.masterData.RegistrationSubType !== previousProps.Login.masterData.RegistrationSubType) {
                const registrationSubTypeMap = constructOptionList(this.props.Login.masterData.RegistrationSubType || [], "nregsubtypecode",
                    "sregsubtypename", "nsorter", "ascending", false);

                stateRegistrationSubType = registrationSubTypeMap.get("OptionList")

            }

            if (this.props.Login.masterData.FilterStatus !== previousProps.Login.masterData.FilterStatus) {


                const filterStatusMap = constructOptionList(this.props.Login.masterData.FilterStatus || [], "ntransactionstatus",
                    "stransdisplaystatus", "nsorter", "ascending", false);

                stateFilterStatus = filterStatusMap.get("OptionList")
            }

            if (this.props.Login.masterData.DesignTemplateMapping !== previousProps.Login.masterData.DesignTemplateMapping) {


                const DesignTemplateMappingMap = constructOptionList(this.props.Login.masterData.DesignTemplateMapping || [], "ndesigntemplatemappingcode",
                    "sregtemplatename", undefined, undefined, false);

                stateDynamicDesign = DesignTemplateMappingMap.get("OptionList")
            }


            // const stateSampleType = sampleTypeMap.get("OptionList");
            skip = this.props.Login.skip === undefined ? skip : this.props.Login.skip
            take = this.props.Login.take || take
            testskip = this.props.Login.testskip === undefined ? testskip : this.props.Login.testskip
            testtake = this.props.Login.testtake || testtake
            subsampleskip = this.props.Login.subsampleskip === undefined ? subsampleskip : this.props.Login.subsampleskip
            subsampletake = this.props.Login.subsampletake || subsampletake

            if (this.props.Login.resultDataState && this.props.Login.resultDataState !== previousProps.Login.resultDataState) {
                resultDataState = this.props.Login.resultDataState;
            }
            if (this.props.Login.testCommentDataState && this.props.Login.testCommentDataState !== previousProps.Login.testCommentDataState) {
                testCommentDataState = this.props.Login.testCommentDataState;
            }
            if (this.props.Login.testAttachmentDataState && this.props.Login.testAttachmentDataState !== previousProps.Login.testAttachmentDataState) {
                testAttachmentDataState = this.props.Login.testAttachmentDataState;
            }
            if (this.props.Login.sampleGridDataState && this.props.Login.sampleGridDataState !== previousProps.Login.sampleGridDataState) {
                sampleGridDataState = this.props.Login.sampleGridDataState;
            }
            if (this.props.Login.popUptestDataState && this.props.Login.popUptestDataState !== previousProps.Login.popUptestDataState) {
                popUptestDataState = this.props.Login.popUptestDataState;
            }

            const testGetParam = {
                masterData: this.props.Login.masterData,
                userinfo: this.props.Login.userInfo,
                ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
                activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                npreregno: this.props.Login.masterData.selectedSample &&
                    this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(","),
                sfromdate: this.props.Login.masterData.RealFromDate,
                stodate: this.props.Login.masterData.RealToDate,
                //searchTestRef: this.searchTestRef,
                // testskip: testskip,
                //subsampleskip: subsampleskip,
                // resultDataState: resultDataState,
                ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                    && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                    nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
            }

            const testChildGetParam = {
                masterData: this.props.Login.masterData,
                userinfo: this.props.Login.userInfo,
                ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
                activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                npreregno: this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(","),
                ntransactionsamplecode: this.props.Login.masterData.selectedSubSample &&
                    this.props.Login.masterData.selectedSubSample.map(sample => sample.ntransactionsamplecode).join(","),
                sfromdate: this.props.Login.masterData.RealFromDate,
                stodate: this.props.Login.masterData.RealToDate,
                // resultDataState: resultDataState,
                // testCommentDataState: testCommentDataState,
                ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            }

            const subSampleGetParam = {
                masterData: this.props.Login.masterData,
                ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                userinfo: this.props.Login.userInfo,
                nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
                activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                // testskip: testskip,
                // subsampleskip: subsampleskip,
                // searchTestRef: this.searchTestRef,
                //resultDataState: resultDataState,
                // testCommentDataState: testCommentDataState,
                //sampleGridDataState: sampleGridDataState,
                ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                    && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedsubsample
            }


            const filterSampleParam = {
                inputListName: "RegistrationGetSample",
                selectedObject: "selectedSample",
                primaryKeyField: "npreregno",
                fetchUrl: "registration/getRegistrationSubSample",
                //childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedSubSample" }],
                fecthInputObject: {
                    //nflag: 2,
                    // ntype: 2,
                    masterData: this.props.Login.masterData,
                    ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                    userinfo: this.props.Login.userInfo,
                    nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                    activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
                    activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                    activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                    ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                        && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                    nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                    nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
                    checkBoxOperation: 3,

                },
                masterData: this.props.Login.masterData,
                searchFieldList: sampleSearchField,
                changeList: [
                    "RegistrationGetSubSample", "RegistrationGetTest", "RegistrationTestAttachment",
                    "RegistrationTestComment", "RegistrationAttachment", "selectedSample", "selectedSubSample",
                    "selectedTest", "RegistrationParameter"
                ]
            };

            const filterSubSampleParam = {
                inputListName: "RegistrationGetSubSample",
                selectedObject: "selectedSubSample",
                primaryKeyField: "ntransactionsamplecode",
                fetchUrl: "registration/getRegistrationTest",
                //childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedSubSample" }],
                fecthInputObject: {
                    //nflag: 2,
                    // ntype: 2,
                    masterData: this.props.Login.masterData,
                    //  ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                    userinfo: this.props.Login.userInfo,
                    nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                    activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
                    activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                    activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                    ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                        && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                    nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                    nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
                    checkBoxOperation: 3,
                    npreregno: this.props.Login.masterData.selectedSample &&
                        this.props.Login.masterData.selectedSample.map(x => x.npreregno).join(",")

                },
                masterData: this.props.Login.masterData,
                searchFieldList: subsampleSearchField,
                changeList: [
                    "RegistrationGetTest", "RegistrationTestAttachment",
                    "RegistrationTestComment", "RegistrationAttachment",
                    "selectedSubSample", "selectedTest", "RegistrationParameter"
                ]
            };

            const filterTestParam = {
                inputListName: "RegistrationGetTest",
                selectedObject: "selectedTest",
                primaryKeyField: "ntransactiontestcode",
                fetchUrl: this.getActiveTestURL(),
                fecthInputObject: {
                    ntransactiontestcode: this.props.Login.masterData && this.props.Login.masterData.selectedTest && this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
                    userinfo: this.props.Login.userInfo,
                    ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                        && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                    nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                    nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
                    checkBoxOperation: 3,
                    activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
                    activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                    activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                },
                masterData: this.props.Login.masterData,
                searchFieldList: testSearchField,
                changeList: ["RegistrationTestComment", "RegistrationParameter"]

            }

            // let postParamList = [
            //     {
            //         filteredListName: "searchedSample",
            //         clearFilter: "no",
            //         searchRef: this.searchSampleRef,
            //         primaryKeyField: "npreregno",
            //         fetchUrl: "registration/getRegistrationSubSample",
            //         fecthInputObject: subSampleGetParam,
            //        // childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedSubSample" }],
            //         selectedObject: "selectedSample",
            //         inputListName: "AP_SAMPLE",
            //         updatedListname: "selectedSample",
            //         unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
            //             "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
            //             "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            //     }
            //     , {
            //         filteredListName: "searchedTest",
            //         updatedListname: "selectedTest",
            //         clearFilter: "no",
            //         searchRef: this.searchTestRef,
            //         primaryKeyField: "ntransactiontestcode",
            //         fetchUrl: "approval/getApprovalTest",
            //         fecthInputObject: testGetParam,
            //         selectedObject: "selectedTest",
            //         inputListName: "RegistrationGetTest",
            //         unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
            //             "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
            //             "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            //     }
            // ];


            const editRegParam = {
                nfilterstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                userinfo: this.props.Login.userInfo,
                nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                sfromdate: this.props.Login.masterData.RealFromDate,
                stodate: this.props.Login.masterData.RealToDate,
                // ncontrolCode: this.state.editSampleId,
                ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                    && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
                activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
                activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                checkBoxOperation:3
            }

            const editSubSampleRegParam = {
                nfilterstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                userinfo: this.props.Login.userInfo,
                nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                sfromdate: this.props.Login.masterData.RealFromDate,
                stodate: this.props.Login.masterData.RealToDate,
                //ncontrolCode: this.state.editSampleId,
                ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                    && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,

                activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
                activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
               

                // npreregno: inputData.npreregno,
                // ntransactionsamplecode: inputData.ntransactionsamplecode,
                // ntransactionstatus: inputData.ntransactionstatus,
                // napprovalconfigcode: inputData.napprovalconfigcode,
                
                // checkBoxOperation: inputData.checkBoxOperation,
            }

            const addTestParam = {
                selectedSample: this.props.Login.masterData.selectedSample,
                selectedSubSample: this.props.Login.masterData.selectedSubSample,
                // skip: skip, take: (skip + take),
                userinfo: this.props.Login.userInfo,
                sampleList: this.props.Login.masterData.RegistrationGetSample,
                snspecsampletypecode: this.props.Login.masterData.selectedSubSample &&
                    [...new Set(this.props.Login.masterData.selectedSubSample.map(x => x.nspecsampletypecode))].join(",")
            };

            const breadCrumbobj = convertDateValuetoString(this.props.Login.masterData.RealFromDate, this.props.Login.masterData.RealToDate, this.props.Login.userInfo)
            if (this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedtemplatebasedflow) {
                this.breadCrumbData = [
                    {
                        "label": "IDS_FROM",
                        "value": breadCrumbobj.breadCrumbFrom
                    }, {
                        "label": "IDS_TO",
                        "value": breadCrumbobj.breadCrumbto
                    }, {
                        "label": "IDS_SAMPLETYPE",
                        "value": this.props.Login.masterData.RealSampleTypeValue ? this.props.Login.masterData.RealSampleTypeValue.ssampletypename : "NA"
                    }, {
                        "label": "IDS_REGTYPE",
                        "value": this.props.Login.masterData.RealRegTypeValue ? this.props.Login.masterData.RealRegTypeValue.sregtypename :"NA"
                    }, {
                        "label": "IDS_REGSUBTYPE",
                        "value": this.props.Login.masterData.RealRegSubTypeValue ? this.props.Login.masterData.RealRegSubTypeValue.sregsubtypename :"NA"
                    },
                    {
                        "label": "IDS_DESIGNTEMPLATE",
                        "value": this.props.Login.masterData.RealDesignTemplateMappingValue ? this.props.Login.masterData.RealDesignTemplateMappingValue.sregtemplatename :"NA"
                    },
                    {
                        "label": "IDS_FILTERSTATUS",
                        "value": this.props.Login.masterData.RealFilterStatusValue ? this.props.Login.masterData.RealFilterStatusValue.stransdisplaystatus:"NA"
                    }
                ]
            } else {
                this.breadCrumbData = [
                    {
                        "label": "IDS_FROM",
                        "value": breadCrumbobj.breadCrumbFrom
                    }, {
                        "label": "IDS_TO",
                        "value": breadCrumbobj.breadCrumbto
                    }, {
                        "label": "IDS_SAMPLETYPE",
                        "value": this.props.Login.masterData.RealSampleTypeValue ? this.props.Login.masterData.RealSampleTypeValue.ssampletypename:"NA"
                    }, {
                        "label": "IDS_REGTYPE",
                        "value": this.props.Login.masterData.RealRegTypeValue ? this.props.Login.masterData.RealRegTypeValue.sregtypename:"NA"
                    }, {
                        "label": "IDS_REGSUBTYPE",
                        "value": this.props.Login.masterData.RealRegSubTypeValue ? this.props.Login.masterData.RealRegSubTypeValue.sregsubtypename:"NA"
                    },
                    {
                        "label": "IDS_FILTERSTATUS",
                        "value": this.props.Login.masterData.RealFilterStatusValue ? this.props.Login.masterData.RealFilterStatusValue.stransdisplaystatus:"NA"
                    }
                ]
            }

            this.setState({
                DynamicSampleColumns, DynamicSubSampleColumns, DynamicTestColumns,
                SingleItem, testMoreField,
                DynamicGridItem, DynamicGridMoreField,
                testListColumns, stateSampleType,
                stateRegistrationType,
                stateRegistrationSubType,
                stateFilterStatus,
                stateDynamicDesign,
                popUptestDataState,
                showSample, showTest, skip, take, testskip,
                subsampleskip, subsampletake,
                testtake, testCommentDataState, testAttachmentDataState,
                resultDataState, sampleGridDataState,
                SubSampleDynamicGridItem, SubSampleDynamicGridMoreField,
                SubSampleSingleItem,
                testGetParam, testChildGetParam, subSampleGetParam,
                filterSampleParam, filterTestParam,
                editRegParam, editSubSampleRegParam,
                addTestParam, sampleSearchField, subsampleSearchField,
                testSearchField, filterSubSampleParam, sampledateconstraints, subsampledateconstraints,sampleCombinationUnique,subsampleCombinationUnique

            })
        }
    }

    handleEditDateChange = (dateName, dateValue) => {
        const selectComponent = this.state.selectedRecord;
        if (dateValue === null) {
            dateValue = new Date();
        }
        selectComponent[dateName] = dateValue;
        this.setState({ selectedRecord: selectComponent });
    }

    onNumericInputEditChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        if ((name !== "nnoofcontainer") && (value === 0 || value === 0.0)) {
            selectedRecord[name] = '';
            this.setState({ selectedRecord });
        } else {
            selectedRecord[name] = value;
            this.setState({ selectedRecord });
        }
    }



    cancelSampleRecords = (controlcode, skip, take) => {
        let Map = {};
        let sampleList = [];
        if (this.props.Login.masterData.searchedSample !== undefined) {
            sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
        } else {
            sampleList = this.props.Login.masterData.RegistrationGetSample && this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take);
        }
        // let sampleList = this.props.Login.masterData.searchedSample || [...this.props.Login.masterData.RegistrationGetSample].splice(skip, skip + take);
        // sampleList = sampleList.splice(skip, skip + take);
        let cancelRejectSamplesList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedSample, "npreregno");

        if (cancelRejectSamplesList && cancelRejectSamplesList.length > 0) {
            if (this.transValidation(this.props.Login.transactionValidation, controlcode, cancelRejectSamplesList)) {
                //Map['ninsertpreregno']=dataitem.cancelSample.npreregno;
                Map['ntransactionstatus'] = cancelRejectSamplesList &&
                    cancelRejectSamplesList.map(transactionstatus => transactionstatus.ntransactionstatus).join(",");
                //Map["ntransactiontestcode"]=dataitem.ntransactiontestcode;
                //Map["ninserttransactionsamplecode"]=dataitem.ntransactionsamplecode
                Map["userinfo"] = this.props.Login.userInfo;
                Map["ncontrolcode"] = controlcode;
                Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
                Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
                Map["nportalrequired"]=this.props.Login.masterData.RealSampleTypeValue.nportalrequired;
                Map["nflag"] = 2;
                Map["ntype"] = 3;
                Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                    && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
                Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
                Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
                Map["checkBoxOperation"] = 3;
                Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
                Map["nfilterstatus"] = -1;
                Map["npreregno"] = cancelRejectSamplesList &&
                    cancelRejectSamplesList.map(sample => sample.npreregno).join(",");
                Map["ntransactionsamplecode"] = this.props.Login.masterData.selectedSubSample &&
                    this.props.Login.masterData.selectedSubSample.map(sample => sample.ntransactionsamplecode).join(",");
                Map["ntransactiontestcode"] = this.props.Login.masterData.selectedTest &&
                    this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",");
                Map["registrationsample"] = cancelRejectSamplesList;
                Map["registrationtest"] = this.props.Login.masterData.selectedSubSample;
                Map["transactionValidation"] = this.props.Login.transactionValidation;
                Map["withoutgetparameter"] = 3
                Map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
                Map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
                Map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
                Map["selectedSample"] = sortData(this.props.Login.masterData.selectedSample,"ascending","npreregno") 
                Map["RegistrationGetSubSample"] = sortData(this.props.Login.masterData.RegistrationGetSubSample,"ascending","ntransactionsamplecode") 

                let inputParam = {
                    inputData: Map,
                    postParamList: this.postParamList,
                    action: 'cancelSample'
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, controlcode)) {
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
                    this.props.cancelSampleAction(inputParam, this.props.Login.masterData)
                }
            } else {
                let nregsubtypecode=this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode
                let valuenew = this.props.Login.transactionValidation[controlcode].filter(function(subtypefilter) {
                    return subtypefilter.nregsubtypecode == nregsubtypecode; });

                // let value = this.props.Login.transactionValidation[controlcode] &&
                //     this.props.Login.transactionValidation[controlcode].map(sample =>
                //         this.props.intl.formatMessage({ id: sample.stransdisplaystatus })).join("/")
                
                let value = valuenew.map(sample =>
                        this.props.intl.formatMessage({ id: sample.stransdisplaystatus })).join("/")

                   
                    
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECT" }) + value + this.props.intl.formatMessage({ id: "IDS_TOCANCELREJECTSAMPLE" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLETOCANCELREJECT" }));
        }

    }

    transValidation = (transactionValidation, ncontrolcode, selectedSample) => {
        //  const transList=transactionValidation?Object.keys(transactionValidation):[];
        //  const index=transList.findIndex(x=>x.ncontrolcode===ncontrolcode);
        //let check=true;
        //  let validate=false;
        let ntransstatus = [];

        let translist = transactionValidation[ncontrolcode];
        if (translist) {
            transactionValidation[ncontrolcode] && transactionValidation[ncontrolcode].map(sam => {
                return ntransstatus.push(sam.ntransactionstatus)
            });
            const selectdata = selectedSample ? selectedSample : [];
            let check = selectdata.map(sam1 => {
                return ntransstatus.includes(sam1.ntransactionstatus)
            })
            if (check.includes(false)) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    onUpdateSubSampleRegistration(saveType, formRef, operation, flag) {
        const inputData = { userinfo: this.props.Login.userInfo };

        let initialParam = {
            nfilterstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.RealRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
            fromdate: "",
            todate: "",
            nflag: 2,
            ntype: 5,
            npreregno: String(this.state.selectedRecord.npreregno),
            ntransactionsamplecode: String(this.state.selectedRecord.ntransactionsamplecode),
            ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
            checkBoxOperation: 3,
            activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
            activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS"
        }

        inputData["initialparam"] = initialParam;
        // inputData["samplebeforeedit"] = JSON.parse(JSON.stringify(this.props.Login.regRecordToEdit));
        //inputData["registration"] = JSON.parse(JSON.stringify(this.state.selectedRecord));

       // console.log(" this.state.selectedRecord,this.props.Login.masterData.SubSampleTemplate.jsondata:",
      //  this.state.selectedRecord,
      //  this.props.Login.masterData.SubSampleTemplate.jsondata);
        const param = getRegistrationSubSample(
            this.state.selectedRecord,
            this.props.Login.masterData.SubSampleTemplate.jsondata,
            this.props.Login.userInfo, this.props.Login.defaulttimezone);

        const uiData = {...this.state.selectedRecord, ...param.sampleRegistration["jsonuidata"]};
        inputData["registrationsample"] = param.sampleRegistration;
        inputData["registrationsample"]["jsonuidata"] = uiData;

        inputData["SubSampleDateList"] = param.dateList
        inputData['subsampledateconstraints'] = this.state.subsampledateconstraints;
        inputData["flag"] = flag === undefined ? 1 : flag;
        inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
            && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
        inputData["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
            && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
        inputData["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
            && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
        inputData["checkBoxOperation"] = 3;
        inputData["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
        inputData["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
        inputData["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS"
        inputData["selectedSubSample"] = this.props.Login.masterData.selectedSubSample
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "SubSampleRegistration",
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: operation, saveType, formRef,
            action: 'editSubSample',
            showConfirmAlert: false,
            resultDataState: this.state.resultDataState,
            testCommentDataState: this.state.testCommentDataState,
            testAttachmentDataState: this.state.testAttachmentDataState,
            // dataState:undefined, selectedId
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    saveType, parentPopUpSize: "lg",
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            //this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            this.props.onUpdateSubSampleRegistration(inputParam,
                this.props.Login.masterData, "openModal");
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

        this.props.validateEsignforRegistration(inputParam, "openModal");

    }


    editRegistration = (inputParam) => {
        let data = [];
        const withoutCombocomponent = []
        const Layout = this.props.Login.masterData.registrationTemplate
            && this.props.Login.masterData.registrationTemplate.jsondata
        if (Layout !== undefined) {
            Layout.map(row => {
                return row.children.map(column => {
                    return column.children.map(component => {
                        return component.hasOwnProperty("children") ?
                            component.children.map(componentrow => {
                                if (componentrow.inputtype === "combo") {
                                    data.push(componentrow)
                                } else {
                                    withoutCombocomponent.push(componentrow)
                                }

                                return null;
                            })
                            : component.inputtype === "combo" ?
                                data.push(component) : withoutCombocomponent.push(component)
                    })
                })
            })
            const comboComponents = data
            let childColumnList = {};
            data.map(columnList => {
                const val = comboChild(data, columnList, childColumnList, true);
                data = val.data;
                childColumnList = val.childColumnList
                return null;
            })

            this.props.getEditRegistrationComboService(inputParam,
                data, this.state.selectedRecord, childColumnList,
                comboComponents, withoutCombocomponent)
        } else {
            toast.info("Configure the preregister template for this registrationtype")
        }

    }


    editSubSampleRegistration = (inputParam) => {
        let data = [];
        const regSubSamplewithoutCombocomponent = []
        const Layout = this.props.Login.masterData.SubSampleTemplate
            && this.props.Login.masterData.SubSampleTemplate.jsondata
        if (Layout !== undefined) {
            Layout.map(row => {
                return row.children.map(column => {
                    return column.children.map(component => {
                        return component.hasOwnProperty("children") ?
                            component.children.map(componentrow => {
                                if (componentrow.inputtype === "combo") {
                                    data.push(componentrow)
                                } else {
                                    regSubSamplewithoutCombocomponent.push(componentrow)
                                }
                                return null;
                            })
                            : component.inputtype === "combo" ?
                                data.push(component) : regSubSamplewithoutCombocomponent.push(component)
                    })
                })
            })
            const regSubSamplecomboComponents = data
            let regSubSamplechildColumnList = {};
            data.map(columnList => {
                const val = comboChild(data, columnList, regSubSamplechildColumnList, true);
                data = val.data;
                regSubSamplechildColumnList = val.childColumnList
                return null;
            })


            //const sampleList = getSameRecordFromTwoArrays(inputParam.masterData.selectedSample, [inputParam.mastertoedit], "npreregno")

            const sampleList = inputParam.masterData.selectedSample.filter(item=>item.sarno === inputParam.mastertoedit["sarno"]);


            this.props.getEditSubSampleComboService(inputParam,
                data, this.state.selectedRecord, regSubSamplechildColumnList,
                regSubSamplecomboComponents, regSubSamplewithoutCombocomponent,
                sampleList[0].ncomponentrequired === 3 ? true : false)
        } else {
            toast.info("Configure the sub sample template for this registrationtype")
        }

    }


}




const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

export default connect(mapStateToProps, {
    callService, crudMaster, updateStore,
    getSampleTypeChange, getRegTypeChange, getRegSubTypeChange,
    getAttachmentCombo, viewAttachment, getCommentsCombo,
    filterTransactionList, validateEsignCredential,
    getSampleChildTabDetail, getTestChildTabDetailRegistration,
    ReloadData, showUnderDevelopment, getPreviewTemplate,
    getChildValues, getRegistrationSample,
    getRegistrationsubSampleDetail, getRegistrationTestDetail,
    acceptRegistration, addMoreTest, createRegistrationTest,
    getEditRegistrationComboService, cancelTestAction,
    cancelSampleAction, addsubSampleRegistration, saveSubSample,
    getEditSubSampleComboService, onUpdateSubSampleRegistration,
    cancelSubSampleAction, preregRecordToQuarantine, componentTest, getSubSampleChildTabDetail,validateEsignforRegistration
})(injectIntl(Registration));