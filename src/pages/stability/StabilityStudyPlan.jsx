import { faBolt, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Button, Card, Col, FormLabel, Nav, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import QRCode from 'react-qr-code';
import { connect } from 'react-redux';
import SplitterLayout from "react-splitter-layout";
import { toast } from 'react-toastify';
import PortalModal from '../../PortalModal';
import { getPreviewTemplate, testSectionTest, updateStore, filterTransactionList } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {
    addMoreTests, addSubTimePoint,
    approveStbStudyPlan,
    cancelSampleAction,
    cancelStbTimePointAction,
    componentTest, createRegTest,
    deleteTestAction, getEditStbTimePointDetails,
    getStabilityStudyPlanByFilterSubmit,
    getTimePointDetail, getTimePointTestDetail,
    ReloadData,
    saveTimePoint,
    updateStbTimePoint, getRegTypeChange, getRegSubTypeChange, onApprovalConfigVersionChange, getSampleTypeChange,getTestDetailFromRegistration
} from '../../actions/StabilityStudyPlanAction';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import { ReactComponent as Reject } from '../../assets/image/reject.svg';
import { ReactComponent as SaveIcon } from '../../assets/image/save_icon.svg';
import { ContentPanel, ReadOnlyText } from '../../components/App.styles';
import BarcodeGeneratorComponent from '../../components/BarcodeGeneratorComponent';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { childComboClear, comboChild, constructOptionList, convertDateValuetoString, formatInputDate, getControlMap, getSameRecordFromTwoArrays, Lims_JSON_stringify, rearrangeDateFormat, removeIndex, showEsign, sortData, sortDataForDate } from '../../components/CommonScript';
import { checkBoxOperation, formCode, SampleType, SideBarSeqno, SideBarTabIndex, transactionStatus } from '../../components/Enumeration';
import ModalShow from '../../components/ModalShow';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import { ListWrapper } from '../../components/client-group.styles';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import CustomPopover from '../../components/customPopover';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormInput from '../../components/form-input/form-input.component';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import AddBarcode from '../../pages/BarcodeTemplate/AddBarcode';
import Esign from '../audittrail/Esign';
import MoveSampleOrContainers from '../basemaster/MoveSampleOrContainers';
import KendoDatatoolFilter from '../contactmaster/KendoDatatoolFilter';
import AddMasterRecords from '../dynamicpreregdesign/AddMasterRecords';
import AddFile from '../goodsin/AddFile';
import GoodsInFilter from '../goodsin/GoodsInFilter';
import { ProductList } from '../product/product.styled';
import AddSubSample from '../registration/AddSubSample';
import AddTest from '../registration/AddTest';
import MappingFields from '../registration/MappingFields';
import { getRegistrationSubSample } from '../registration/RegistrationValidation';
import StbPreRegSlideOutModal from './StbPreRegSlideOutModal';
import RegistrationFilter from '../registration/RegistrationFilter';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as FullviewExpand } from '../../assets/image/fullview-expand.svg';
import { ReactComponent as FullviewCollapse } from '../../assets/image/fullview-collapse.svg';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import RegistrationResultTab from '../registration/RegistrationResultTab';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import SampleInfoView from '../approval/SampleInfoView';
import SampleGridTab from '../registration/SampleGridTab';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faStop } from '@fortawesome/free-solid-svg-icons';


class StabilityStudyPlan extends Component {

    constructor(props) {
        super(props);
        this.searchSampleRef = React.createRef();
        this.searchSubSampleRef = React.createRef();
        this.searchTestRef = React.createRef();
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
                    parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'nstbstudyplancode' }] 
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
            sampleCommentDataState: {
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
            },
            registrationTestHistoryDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'groupingField' }] 
            },
            externalOrderAttachmentDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5
            },
            outsourceDetailsDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5
            }
            ,
            selectedPrinterData: {},
            grandparentheight: '150vh',
            transactionValidation: [],
            skip: 0,
            take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
            testskip: 0,
            splitChangeWidthPercentage: 28.6,
            testtake: this.props.Login.settings && this.props.Login.settings[12],
            subsampleskip: 0,
            subsampletake: this.props.Login.settings && this.props.Login.settings[12],
            comboComponents: [],
            withoutCombocomponent: [],
            childColumnList: [],
            columnList: [],
            regSubSamplecomboComponents: [],
            regSubSamplewithoutCombocomponent: [],
            regparentSubSampleColumnList: [],
            regchildSubSampleColumnList: [],
            DynamicSubSampleColumns: [],
            DynamicTestColumns: [],
            DynamicGridItem: [],
            DynamicGridMoreField: [],
            SingleItem: [],
            testMoreField: [],
            testListColumns: [],
            SubSampleDynamicGridItem: [],
            SubSampleDynamicGridMoreField: [],
            SubSampleSingleItem: [],
            sampleCombinationUnique: [], subsampleCombinationUnique: [],
            cancelId: -1,
            studyPlanId: -1,
            sampleBarcodeId: -1,
            subSampleBarcodeId: -1,
            editstudyPlanId: -1,
            quarantineId: -1,
            addTestId: -1,
            adhocTestId: -1,
            generateBarcodeId: -1,
            printBarcodeId: -1,
            cancelSampleId: -1,
            addSubSampleId: -1,
            editSubSampleId: -1,
            cancelSubSampleId: -1,
            CancelExternalOrderSampleId: -1,
            exportTemplateId: -1,
            importTemplateId: -1,
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
            fixefScrollHeight: window.outerHeight - 300,
            enablePropertyPopup: false,
            enableAutoClick: false,
            propertyPopupWidth: "60",
            showQRCode: false,
            showBarcode: false,
            treeData: [],
            toggleAction: false,
            selectedMaster: [],
            outsourceId: -1,
            copySampleId: -1,
            filterSampleList: [],
        };
    }

    mandatoryList = (prereg, printer, file, childtest, regSubSample, operation, outsourcetest, adhocTest) => {
        let mandatory = [];
        if (file) {
            mandatory = [
                { "mandatory": true, "idsName": "IDS_IMPORTFILE", "dataField": "sfilename", "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }
            ];
        }
        else if (printer) {
            mandatory = [
                { "mandatory": true, "idsName": "IDS_PRINTER", "dataField": "sprintername", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "mandatory": true, "idsName": "IDS_BARCODENAME", "dataField": "sbarcodename", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
            ]
        }
        else if (regSubSample) {

            let sampleList = [];
            const skip = this.state.skip
            const take = this.state.take
            if (this.props.Login.masterData.searchedSample !== undefined) {
                const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                    : this.props.Login.masterData.StabilityStudyPlanGet;

                sampleList = list ? list.slice(skip, skip + take) : [];
            } else {
                sampleList = this.props.Login.masterData.StabilityStudyPlanGet && this.props.Login.masterData.StabilityStudyPlanGet.slice(skip, skip + take);
            }
            let addSubSampleList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedStabilityStudyPlan, "nstbstudyplancode");
            const findComponentReqSpec = [...new Set(addSubSampleList.map(item => item.ncomponentrequired))];
            if (findComponentReqSpec[0] === 3) {
                mandatory = [{ "idsName": "IDS_COMPONENT", "dataField": "ncomponentcode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" }]
            }
            this.props.Login.masterData.SubSampleTemplate &&
                this.props.Login.masterData.SubSampleTemplate.jsondata.map(row => {
                    return row.children.map(column => {
                        return column.children.map(component => {
                            return component.hasOwnProperty("children") ?
                                component.children.map(componentrow => {
                                    if (componentrow.mandatory === true) {
                                        mandatory.push({ "mandatory": true, "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode], "dataField": componentrow.label, "mandatoryLabel": componentrow.inputtype === "combo" ? "IDS_SELECT" : "IDS_ENTER", "controlType": componentrow.inputtype === "combo" ? "selectbox" : "textbox" })

                                    }
                                    return mandatory;
                                })
                                : component.mandatory === true ?
                                    mandatory.push({ "mandatory": true, "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode], "dataField": component.label, "mandatoryLabel": component.inputtype === "combo" ? "IDS_SELECT" : "IDS_ENTER", "controlType": component.inputtype === "combo" ? "selectbox" : "textbox" }) : ""

                        })
                    })
                })
            if (operation !== 'update') {
                mandatory.push({ "mandatory": true, "idsName": "IDS_TESTNAME", "dataField": "ntestgrouptestcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" })
            }
        }
        else if (childtest) {
            mandatory = [
                { "mandatory": true, "idsName": "IDS_TESTNAME", "dataField": "ntestgrouptestcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
            ];
        }
        else if (outsourcetest) {
            mandatory = [{ "idsName": "IDS_SITE", "dataField": "outsourcesite", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" }
                , { "idsName": "IDS_TEST", "dataField": "outSourceTestList", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" }
                , { "idsName": "IDS_SAMPLEID", "dataField": "ssampleid", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
                , { "idsName": "IDS_OUTSOURCEDATE", "dataField": "doutsourcedate", "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox", }
            ]
        }
        else if (adhocTest) {
            mandatory = [
                { "mandatory": true, "idsName": "IDS_TESTNAME", "dataField": "ntestcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
            ];
        }
        return mandatory;
    }
    handleFilterDateChange = (dateName, dateValue) => {
        let masterData = this.props.Login.masterData;
        masterData[dateName] = dateValue;
        this.setState({ masterData });
    }

    render() {
        this.fromDate = this.state.selectedFilter["fromdate"] !== "" && this.state.selectedFilter["fromdate"] !== undefined ? this.state.selectedFilter["fromdate"] : this.props.Login.masterData.FromDate;
        this.toDate = this.state.selectedFilter["todate"] !== "" && this.state.selectedFilter["todate"] !== undefined ? this.state.selectedFilter["todate"] : this.props.Login.masterData.ToDate;
        let sampleList = this.props.Login.masterData.StabilityStudyPlanGet ? sortData(this.props.Login.masterData.StabilityStudyPlanGet, 'desc', 'nstbstudyplancode') : [];
        let subSampleList = this.props.Login.masterData.StbTimePointGet ? this.props.Login.masterData.StbTimePointGet : [];
        let testList = this.props.Login.masterData.StbTimePointTestGet ? this.props.Login.masterData.StbTimePointTestGet : []; //

        const mandatoryFieldsFilter = [{ "mandatory": true, "idsName": "IDS_FILTERNAME", "dataField": "sfiltername", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]

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
                        clickIconGroup={true}
                        // paneHeight={this.state.initialVerticalWidth}
                        masterList={this.props.Login.masterData.searchedTest || testList}
                        selectedMaster={this.props.Login.masterData.selectedStbTimePointTest}
                        primaryKeyField="nstbtimepointtestcode"
                        getMasterDetail={(event, status) => this.getTestChildTabDetailRegistration(event, status)}
                        inputParam={{
                            ...this.state.testChildGetParam
                        }}
                        additionalParam={[]}
                        mainField="stestsynonym"
                        selectedListName="selectedStbTimePointTest"
                        objectName="test"
                        listName="IDS_TEST"
                        // jsonField={'jsondata'}
                        pageSize={this.props.Login.settings && this.props.Login.settings[13].split(",").map(setting => parseInt(setting))}
                        // showStatusLink={true}
                        subFieldsLabel={true}
                        // statusFieldName="stransdisplaystatus"
                        // statusField="ntransactionstatus"
                        needMultiSelect={false}
                        subFields={this.state.testListColumns || []}
                        moreField={this.state.testMoreField}
                        needValidation={false}
                        //showStatusName={true}
                        needFilter={false}
                        // needMultiValueFilter={true}
                        filterColumnData={this.props.filterTransactionList}
                        searchListName="searchedTest"
                        searchRef={this.searchTestRef}
                        filterParam={this.state.filterTestParam}
                        selectionField="ntransactionstatus"
                        selectionFieldName="stransdisplaystatus"
                        // childTabsKey={["RegistrationTestComment"]}
                        //childTabsKey={["RegistrationParameter", "RegistrationTestComment", "RegistrationTestAttachment", "ApprovalParameter", "RegistrationTestHistory"]}
                        handlePageChange={this.handleTestPageChange}
                        buttonCount={5}
                        skip={this.state.testskip}
                        take={this.state.testtake}
                        showMoreResetList={true}
                        showMoreResetListName="StabilityStudyPlanGet"
                        //selectionList={this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                        //selectionColorField="scolorhexcode"
                        commonActions={
                            <>
                                {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                <ProductList className="d-flex justify-content-end icon-group-wrap">
                                    {/* <ReactTooltip place="bottom" /> */}
                                    <Nav.Link name="addtest" className="btn btn-circle outline-grey ml-2"
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_ADDTEST" })}
                                        hidden={this.state.userRoleControlRights.indexOf(this.state.addTestId) === -1}
                                        onClick={() => this.addMoreTest({
                                            ...this.state.addTestParam,
                                            skip: this.state.skip,
                                            take: (this.state.skip + this.state.take)
                                        },
                                            this.state.addTestId)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_DELETETEST" })}
                                        hidden={this.state.userRoleControlRights.indexOf(this.state.deleteTestId) === -1}
                                        onClick={() => this.cancelRecord('Test', this.state.deleteTestId,
                                            this.state.testskip, this.state.testtake, 'delete')}>
                                        <FontAwesomeIcon icon={faTrashAlt} />
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



        mainDesign = <SplitterLayout borderColor="#999"
            primaryIndex={1} percentage={true}
            secondaryInitialSize={this.state.splitChangeWidthPercentage}
            onSecondaryPaneSizeChange={this.paneSizeChange}
            primaryMinSize={40}
            secondaryMinSize={30}
        >

            <Card >
                <Card.Header style={{ borderBottom: "0px" }}>
                    <span style={{ display: "inline-block", marginTop: "1%" }}>
                        <h4 className="card-title">{this.props.intl.formatMessage({ id: "IDS_TIMEPOINT" })}</h4>
                    </span>
                </Card.Header>
                <Card.Body className='p-0 sm-pager'>
                    <TransactionListMasterJsonView
                        cardHead={94}
                        // paneHeight={this.state.initialVerticalWidth}
                        // splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}

                        clickIconGroup={true}
                        masterList={this.props.Login.masterData.searchedSubSample || subSampleList}
                        selectedMaster={this.props.Login.masterData.selectedStbTimePoint}
                        primaryKeyField="nstbtimepointcode"
                        getMasterDetail={(event, status) => {
                            this.props.getTimePointTestDetail(event, status);
                            //  this.changePropertyView(6, event, status) 
                        }}
                        inputParam={{
                            ...this.state.testGetParam,
                            searchTestRef: this.searchTestRef,
                            searchSubSampleRef: this.searchSubSampleRef,
                            testskip: this.state.testskip,
                            subsampleskip: this.state.subsampleskip,
                            testtake: this.state.testtake,
                            subsampletake: this.state.subsampletake,
                            resultDataState: this.state.resultDataState,
                            // activeTabIndex: this.state.enableAutoClick ? 1 : this.state.activeTabIndex ? this.state.activeTabIndex : undefined,
                            // activeTabIndex : this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 1 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 1 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
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
                        mainField="nstbtimepointcode"
                        selectedListName="selectedStbTimePoint"
                        objectName="subsample"
                        listName="IDS_TIMEPOINT"
                        jsonField={'jsondata'}
                        jsonDesignFields={true}
                        needValidation={true}
                        validationKey="napprovalversioncode"
                        validationFailMsg="IDS_SELECTSAMPLESOFSAMPLEAPPROVALVERSION"
                        subFields={this.state.DynamicSubSampleColumns}
                        skip={this.state.subsampleskip}
                        take={this.state.subsampletake}
                        pageSize={this.props.Login.settings && this.props.Login.settings[13].split(",").map(setting => parseInt(setting))}
                        selectionField="ntransactionstatus"
                        selectionFieldName="stransdisplaystatus"
                        needMultiSelect={false}
                        // selectionColorField="scolorhexcode"
                        subFieldsLabel={false}
                        subFieldsFile={true}
                        handlePageChange={this.handleSubSamplePageChange}
                        // viewFile={this.viewFile}
                        // selectionList={this.props.Login.masterData.RealFilterStatusValue
                        //     && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                        childTabsKey={[
                            // "RegistrationAttachment",
                            "StbTimePointTestGet", "RegistrationSampleComment", "RegistrationSampleAttachment", "OutsourceDetailsList", "RegistrationParameter", "RegistrationTestAttachment", "RegistrationTestComment"]}
                        actionIcons={
                            [
                                {
                                    title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                    controlname: "faPencilAlt",
                                    objectName: "mastertoedit",
                                    hidden: this.state.userRoleControlRights.indexOf(this.state.editTimePointId) === -1,
                                    onClick: this.editSubSampleRegistration,
                                    inputData: {
                                        primaryKeyName: "nstbtimepointcode",
                                        operation: "update",
                                        masterData: this.props.Login.masterData,
                                        userInfo: this.props.Login.userInfo,
                                        searchTestRef: this.searchTestRef,
                                        editSubSampleRegParam: { ...this.state.editSubSampleRegParam, ncontrolCode: this.state.editTimePointId }
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
                                        //  data-for="tooltip-common-wrap"
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_ADDTIMEPOINT" })}
                                        hidden={this.state.userRoleControlRights.indexOf(this.state.addTimePointId) === -1}
                                        onClick={() => this.addTimePoint(this.state.addTimePointId, this.state.skip, this.state.take)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        //title={"Cancel/Reject Test"}
                                        //data-for="tooltip-common-wrap"
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_DELETETIMEPOINT" })}
                                        hidden={this.state.userRoleControlRights.indexOf(this.state.deleteTimePointId) === -1}
                                        onClick={() => this.cancelSubSampleRecord('StbTimePoint', this.state.deleteTimePointId, this.state.subsampleskip, this.state.subsampletake, 'delete')}>
                                        <FontAwesomeIcon icon={faTrashAlt} />
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






        this.confirmMessage = new ConfirmMessage();

        this.postParamList = [
            {
                filteredListName: "searchedSample",
                clearFilter: "no",
                searchRef: this.searchSampleRef,
                primaryKeyField: "nstbstudyplancode",
                fetchUrl: "stabilitystudyplan/getRegistrationSubSample",
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
                selectedObject: "selectedStabilityStudyPlan",
                inputListName: "AP_SAMPLE",
                updatedListname: "selectedStabilityStudyPlan",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            },
            {
                filteredListName: "searchedSubSample",
                clearFilter: "no",
                searchRef: this.searchSubSampleRef,
                primaryKeyField: "nstbtimepointcode",
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
                selectedObject: "selectedStbTimePoint",
                inputListName: "selectedStbTimePoint",
                updatedListname: "StbTimePointGet",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            },
            {
                filteredListName: "searchedTest",
                updatedListname: "StbTimePointTestGet",
                clearFilter: "no",
                searchRef: this.searchTestRef,
                primaryKeyField: "nstbtimepointtestcode",
                fetchUrl: "approval/getApprovalTest",
                fecthInputObject: {
                    ...this.state.testGetParam,
                    searchTestRef: this.searchTestRef,
                    testskip: this.state.testskip,
                    subsampleskip: this.state.subsampleskip,
                    resultDataState: this.state.resultDataState
                },
                selectedObject: "selectedStbTimePointTest",
                inputListName: "selectedStbTimePointTest",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            }
        ];




        return (
            <>
                {/* Add by thenmozhi jira point UUDA-223 06082024 */}
                <ListWrapper className="client-listing-wrap new-breadcrumb toolbar-top-wrap mtop-4 screen-height-window">
                    <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} />
                    <div className='fixed-buttons'>
                        <Nav.Link
                            className="btn btn-circle outline-grey ml-2"
                            data-tip={this.props.intl.formatMessage({ id: "IDS_SAVEFILTER" })}
                            // data-for="tooltip-common-wrap"
                            hidden={this.state.userRoleControlRights.indexOf(this.state.filterNameId) === -1}
                            onClick={() => this.openFilterName(this.state.filterNameId)}>
                            {/* <DownloadReportbutton width='20px' height='20px' className='custom_icons' /> */}
                            <SaveIcon width='20px' height='20px' className='custom_icons' />
                        </Nav.Link>
                        {
                            this.state.userRoleControlRights.indexOf(this.state.filterDetailId) !== -1 &&
                                this.props.Login.masterData && this.props.Login.masterData.FilterName &&  this.props.Login.masterData.FilterName.length > 0 ?
                                <CustomPopover
                                    icon={faBolt}
                                    nav={true}
                                    data={this.props.Login.masterData.FilterName}
                                    btnClasses="btn-circle btn_grey ml-2 spacesremovefromaction"
                                    //dynamicButton={(value) => this.props.getAcceptTestTestWise(value,testGetParam,this.props.Login.masterData.MJselectedStbTimePointTest,this.props.Login.userInfo)}
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
                                {/* className={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 60 ? 'split-mode' : ''} */}
                                <div className={`tab-left-area ${this.state.activeTabIndex ? 'active' : ""}`}>
                                    <SplitterLayout borderColor="#999"
                                        primaryIndex={1} percentage={true}
                                        secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                        onSecondaryPaneSizeChange={this.paneSizeChange}
                                        primaryMinSize={30}
                                        secondaryMinSize={20}
                                    >
                                        <div className='toolbar-top-inner'>
                                            <TransactionListMasterJsonView
                                                listMasterShowIcon={1}
                                                // paneHeight={this.state.firstPane}
                                                clickIconGroup={true}
                                                splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                                masterList={this.props.Login.masterData.searchedSample || sampleList}
                                                selectedMaster={this.props.Login.masterData.selectedStabilityStudyPlan}
                                                primaryKeyField="nstbstudyplancode"
                                                filterColumnData={this.props.filterTransactionList}
                                                getMasterDetail={this.props.getTimePointDetail}
                                                inputParam={{
                                                    ...this.state.subSampleGetParam,
                                                    searchTestRef: this.searchTestRef,
                                                    searchSubSampleRef: this.searchSubSampleRef,
                                                    testskip: this.state.testskip,
                                                    subsampleskip: this.state.subsampleskip,
                                                    resultDataState: this.state.resultDataState,
                                                    activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 4 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 4 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
                                                }}
                                                // selectionList={this.props.Login.masterData.RealFilterStatusValue
                                                //     && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                                                selectionColorField="scolorhexcode"
                                                mainField={"nstbstudyplancode"}
                                                showStatusLink={true}
                                                showStatusName={true}
                                                statusFieldName="stransdisplaystatus"
                                                statusField="ntransactionstatus"
                                                selectedListName="selectedStabilityStudyPlan"
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
                                                needMultiValueFilter={false}
                                                clearAllFilter={this.onReload}
                                                onMultiFilterClick={this.onMultiFilterClick}
                                                jsonField={'jsondata'}
                                                jsonDesignFields={true}
                                                needMultiSelect={false}
                                                // showStatusBlink={true}
                                                callCloseFunction={true}
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
                                                childTabsKey={["RegistrationAttachment", "StbTimePointGet",
                                                    "StbTimePointTestGet", "RegistrationSampleComment", "RegistrationSampleAttachment", "selectedStbTimePoint", "selectedStbTimePointTest",
                                                    "RegistrationComment", "ExternalOrderAttachmentList", "OutsourceDetailsList", "RegistrationParameter", "RegistrationTestAttachment",
                                                    "RegistrationTestComment"]} //, "RegistrationParameter""RegistrationTestComment"
                                                // actionIcons={
                                                //     [
                                                //         {
                                                //             title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                                //             controlname: "faPencilAlt",
                                                //             objectName: "mastertoedit",
                                                //             hidden: this.state.userRoleControlRights.indexOf(this.state.editstudyPlanId) === -1,
                                                //             onClick: this.editRegistration,
                                                //             inputData: {
                                                //                 primaryKeyName: "nstbstudyplancode",
                                                //                 operation: "update",
                                                //                 masterData: this.props.Login.masterData,
                                                //                 userInfo: this.props.Login.userInfo,
                                                //                 editRegParam: {
                                                //                     ...this.state.editRegParam,
                                                //                     ncontrolCode: this.state.editstudyPlanId
                                                //                 }
                                                //             },
                                                //         }
                                                //     ]
                                                // }
                                                needFilter={true}
                                                commonActions={

                                                    <ProductList className="d-flex product-category float-right icon-group-wrap">
                                                        {/* <ReactTooltip place="bottom" /> */}

                                                        <Button className="btn btn-icon-rounded btn-circle solid-blue ml-2" role="button"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_ADDSTABILITYSTUDYPLAN" })}
                                                            //  data-for="tooltip-common-wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.studyPlanId) === -1}
                                                            onClick={() => this.getStabilityStudyPlanComboService("IDS_STABILITYSTUDYPLAN", "create", "nstbstudyplancode",
                                                                this.props.Login.masterData, this.props.Login.userInfo, this.state.studyPlanId, false, true, true)}>
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </Button>
                                                        <ProductList className="d-flex product-category float-right"></ProductList>
                                                        <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_APPRROVESTUDYPLAN" })}
                                                            // data-for="tooltip-common-wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.approevStudyPlanId) === -1}
                                                            onClick={() => this.approveRegistration(this.state.approevStudyPlanId, this.state.skip, this.state.take)} >
                                                            <FontAwesomeIcon icon={faThumbsUp} />
                                                        </Nav.Link>
                                                        <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_START" })}
                                                           //data-for="tooltip-common-wrap"
                                                           // hidden={this.state.userRoleControlRights.indexOf(this.state.deleteStudyPlanId) === -1}
                                                           // onClick={() => this.cancelSampleRecords(this.state.deleteStudyPlanId,
                                                           //    this.state.skip, this.state.take, 'delete')}
                                                                >
                                                            <FontAwesomeIcon icon={faPlay} />
                                                        </Nav.Link>
                                                        <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_STOP" })}
                                                           //data-for="tooltip-common-wrap"
                                                           // hidden={this.state.userRoleControlRights.indexOf(this.state.deleteStudyPlanId) === -1}
                                                           // onClick={() => this.cancelSampleRecords(this.state.deleteStudyPlanId,
                                                           //    this.state.skip, this.state.take, 'delete')}
                                                                >
                                                            <FontAwesomeIcon icon={faStop} />
                                                        </Nav.Link>


                                                        <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DELETESTUDYPLAN" })}
                                                            // data-for="tooltip-common-wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.deleteStudyPlanId) === -1}
                                                            onClick={() => this.cancelSampleRecords(this.state.deleteStudyPlanId,
                                                                this.state.skip, this.state.take, 'delete')}>
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                        </Nav.Link>

                                                        <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_CANCELTERMINATESTUDYPLAN" })}
                                                        // data-for="tooltip-common-wrap"
                                                        // hidden={this.state.userRoleControlRights.indexOf(this.state.cancelSampleId) === -1}
                                                        // onClick={() => this.cancelSampleRecords(this.state.cancelSampleId, this.state.skip, this.state.take)}
                                                        >
                                                            <Reject className="custom_icons" width="20" height="20" />
                                                        </Nav.Link>

                                                        <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                                            //   data-for="tooltip-common-wrap"
                                                            onClick={() => this.onReload()} >
                                                            <RefreshIcon className='custom_icons' />
                                                        </Button>
                                                    </ProductList>
                                                }
                                                filterComponent={[
                                                    // {
                                                    //     "IDS_STABILITYSTUDYPLAN":
                                                    //         <GoodsInFilter
                                                    //             fromDate={fromDate}
                                                    //             toDate={toDate}
                                                    //             handleFilterDateChange={this.handleFilterDateChange}
                                                    //             userInfo={this.props.Login.userInfo}

                                                    //         />
                                                    // }
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
                                                            ApprovalConfigVersionValue={this.props.Login.masterData.ApprovalConfigVersionValue || {}}
                                                            ApprovalConfigVersion={this.state.stateApprovalConfigVersion || {}}
                                                            DesignTemplateMapping={this.props.Login.masterData.DesignTemplateMapping}
                                                            DesignTemplateMappingValue={this.props.Login.masterData.DesignTemplateMappingValue || {}}
                                                            FilterStatus={this.state.stateFilterStatus || []}
                                                            FromDate={this.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.fromDate) : new Date()}
                                                            ToDate={this.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.toDate) : new Date()}
                                                            onSampleTypeChange={this.onSampleTypeChange}
                                                            onRegTypeChange={this.onRegTypeChange}
                                                            onRegSubTypeChange={this.onRegSubTypeChange}
                                                            onDesignTemplateChange={this.onDesignTemplateChange}
                                                            onApprovalConfigVersionChange={this.onApprovalConfigVersionChange}
                                                            DynamicDesignMapping={this.state.stateDynamicDesign || []}
                                                            handleFilterDateChange={this.handleFilterDateChange}
                                                            onFilterChange={this.onFilterChange}
                                                        />
                                                    }
                                                ]}

                                            />
                                        </div>

                                        <div>
                                            <div style={this.state.showTest === true || this.state.showSubSample === true ?
                                                { display: "block" } : { display: "none" }} >
                                                {mainDesign}
                                            </div>
                                        </div>
                                    </SplitterLayout>
                                </div>
                                <div className={`${this.state.enablePropertyPopup ? 'active-popup' : ""} vertical-tab ${this.state.activeTabIndex ? 'active' : ""}`} >
                                 <span className={` vertical-tab-close ${this.state.activeTabIndex ? 'active' : ""}`} onClick={() => this.changePropertyViewClose(false)}><FontAwesomeIcon icon={faChevronRight} /> </span>
                                    <div className={`${this.state.enablePropertyPopup ? 'active-popup' : ""} vertical-tab-content pager_wrap wrap-class ${this.state.activeTabIndex ? 'active' : ""}`} style={{ width: this.state.enablePropertyPopup ? this.state.propertyPopupWidth + '%' : "" }}>
                                        
                                        <div className={` vertical-tab-content-common position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 4 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <FullviewExpand width="20" height="20" className="custom_icons" /> :
                                                    <FullviewCollapse width="24" height="24" className="custom_icons" />
                                                }
                                            </Nav.Link>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_STABILITYDETAILS" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 4 ? this.sideNavDetail("IDS_STABILITYDETAILS", 0) : ""}
                                        </div>
                                        {/* {this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE && */}
                                        <div className={` vertical-tab-content-grid sm-view-v-t position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 1 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <FullviewExpand width="20" height="20" className="custom_icons" /> :
                                                    <FullviewCollapse width="24" height="24" className="custom_icons" />
                                                }
                                            </Nav.Link>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_TIMEPOINTRESULTS" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 1 ? this.sideNavDetail("IDS_TIMEPOINTRESULTS") : ""}
                                        </div>
                                        {/* } */}
                                        <div className={` vertical-tab-content-attachment position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 2 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <FullviewExpand width="20" height="20" className="custom_icons" /> :
                                                    <FullviewCollapse width="24" height="24" className="custom_icons" />
                                                }
                                            </Nav.Link>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 2 ? this.sideNavDetail("IDS_ATTACHMENTS") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-grid-tab position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 3 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <FullviewExpand width="20" height="20" className="custom_icons" /> :
                                                    <FullviewCollapse width="24" height="24" className="custom_icons" />
                                                }
                                            </Nav.Link>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 3 ? this.sideNavDetail("IDS_COMMENTS") : ""}
                                        </div>
                                        {this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.noutsourcerequired === transactionStatus.YES &&
                                            <div className={` vertical-tab-content-common position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 9 ? 'active' : ""}`}>
                                                <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                    {!this.state.enablePropertyPopup ?
                                                        <FullviewExpand width="20" height="20" className="custom_icons" /> :
                                                        <FullviewCollapse width="24" height="24" className="custom_icons" />
                                                    }
                                                </Nav.Link>
                                                {/* <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_OUTSOURCEDETAILS" })}
                                            </h4> */}
                                                {this.state.activeTabIndex && this.state.activeTabIndex === 9 ? this.sideNavDetail("IDS_OUTSOURCEDETAILS") : ""}
                                            </div>
                                        }
                                        <div className={` vertical-tab-content-grid-tab position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 10 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <FullviewExpand width="20" height="20" className="custom_icons" /> :
                                                    <FullviewCollapse width="24" height="24" className="custom_icons" />
                                                }
                                            </Nav.Link>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 10 ? this.sideNavDetail("IDS_HISTORY") : ""}
                                        </div>
                                    </div>
                                    <div className='tab-head'>
                                        <ul>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 4 ? 'active' : ""}`} onClick={() => this.changePropertyView(4)}>
                                                <FontAwesomeIcon icon={faEye} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_STABILITYDETAILS" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 1 ? 'active' : ""}`} onClick={() => this.changePropertyView(1)}>
                                                <FontAwesomeIcon icon={faFileInvoice}
                                                    //   data-for="tooltip-common-wrap"
                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_RESULT" })} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_RESULT" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 10 ? 'active' : ""}`} onClick={() => this.changePropertyView(10)}>
                                                <FontAwesomeIcon icon={faHistory} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_HISTORY" })}
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
                </ListWrapper >
                {
                    this.props.Login.openPortal ?
                        <PortalModal>
                            <StbPreRegSlideOutModal
                                postParamList={this.postParamList}
                                PrevoiusLoginData={this.PrevoiusLoginData}
                                closeModal={this.closeModal}
                                operation={"create"}
                                screenName={"IDS_STABILITYSTUDYPLAN"}
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
                                exportTemplateId={this.state.exportTemplateId}
                                importTemplateId={this.state.importTemplateId}
                                sampleexportfields={this.state.sampleexportfields}
                                subsampleexportfields={this.state.subsampleexportfields}
                                //  specBasedComponent={this.state.specBasedComponent}
                                mandatoryFields={[
                                    { "idsName": "IDS_PRODUCTCATEGORY", "dataField": "nproductcatcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                                    { "idsName": "IDS_PRODUCTNAME", "dataField": "sproductname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]}
                            />
                        </PortalModal>
                        : ""
                }
                {
                    (this.props.Login.openModal || this.state.showQRCode || this.state.showBarcode) &&
                    <SlideOutModal show={this.props.Login.openModal || this.state.showQRCode || this.state.showBarcode}
                        //|| this.props.Login.loadEsign}
                        closeModal={this.state.showQRCode ? () => this.setState({ showQRCode: false, openModal: false })
                            : this.state.showBarcode ? () => this.setState({ showBarcode: false, openModal: false })
                                : this.props.Login.loadRegSubSample || this.props.Login.loadFile
                                    || this.props.Login.loadChildTest || this.props.Login.loadAdhocTest ? this.closeChildModal
                                    : this.closeModal}
                        hideSave={this.state.showBarcode ? true : false}
                        size={this.props.Login.parentPopUpSize}
                        loginoperation={this.props.Login.loadPrinter ? true : false}
                        buttonLabel={this.state.showQRCode || this.props.Login.loadPrinter ? "print" : undefined}
                        operation={this.props.Login.addMaster ? this.props.Login.masterOperation[this.props.Login.masterIndex] : this.state.showQRCode ? "Preview" :
                            this.props.Login.loadComponent ||
                                this.props.Login.loadTest || this.props.Login.loadSource ||
                                this.props.Login.loadFile ? this.props.Login.childoperation : this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.state.showQRCode ? "QR Code"
                            : this.state.showBarcode ? "Barcode"
                                : this.props.Login.loadTest || this.props.Login.loadFile ?
                                    this.props.Login.ChildscreenName : this.props.Login.screenName}
                        esign={this.props.Login.loadEsign}
                        innerPopup={this.props.Login.loadComponent}
                        onSaveClick={this.props.Login.operation === 'barcode' ?
                            () => this.props.barcodeGeneration(this.props.Login.barcodeSelectedRecord,
                                this.props.Login.ncontrolcode, this.props.Login.userInfo, this.state.selectedRecord)
                            : this.state.showQRCode ?
                                () => this.setState({ showQRCode: false, openModal: false })
                                // : this.state.showBarcode ? 
                                //     () => this.setState({ showBarcode: false, openModal: false })
                                : this.props.Login.addMaster ? this.onSaveMasterRecord
                                    : this.props.Login.loadRegSubSample ? this.onSaveTimePointClick
                                        : this.props.Login.loadFile ? this.onSaveFileClick
                                            : this.props.Login.loadPrinter ? this.onSavePrinterClick
                                                : this.props.Login.loadChildTest ? this.onSaveChildTestClick
                                                    : this.props.Login.loadAdhocTest ? this.onSaveAdhocTestClick
                                                        //: this.props.Login.outsourcetest ? this.onSaveOutSourceTest
                                                        : this.props.Login.outsourcetest ? this.onSaveOutSourceSample
                                                            : this.props.Login.screenName === "External Sample" ? this.onSaveCancelOrder
                                                                : this.props.Login.multiFilterLoad ? this.onSaveMultiFilterClick
                                                                    : this.onSaveClick}
                        validateEsign={this.validateEsign}
                        showSaveContinue={this.props.Login.showSaveContinue}
                        selectedRecord={!this.props.Login.loadEsign ? this.props.Login.addMaster ? this.state.selectedMaster[this.props.Login.masterIndex] :
                            this.props.Login.loadComponent ? this.state.selectComponent : this.props.Login.loadPrinter ? this.state.selectedPrinterData
                                : this.props.Login.loadTest ? this.state.selectedStbTimePointTestData : this.props.Login.loadFile ? this.state.selectedFile
                                    : this.props.Login.loadPoolSource ? this.state.selectedSourceData : this.state.selectedRecord : this.state.selectedRecord}
                        mandatoryFields={this.props.Login.screenName == "External Sample" ? this.onSaveCancelOrderMandatoryFields : this.props.Login.addMaster ?
                            this.props.Login.masterextractedColumnList[this.props.Login.masterIndex].filter(x => x.mandatory === true)
                            : this.mandatoryList(this.props.Login.loadPreregister,
                                this.props.Login.loadPrinter, this.props.Login.loadFile,
                                this.props.Login.loadChildTest, this.props.Login.loadRegSubSample,
                                this.props.Login.operation, this.props.Login.outsourcetest, this.props.Login.loadAdhocTest)}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.operation === "barcode" ?
                                <AddBarcode
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onNumericInputChange={this.onNumericInputChange}
                                    onComboChange={this.onComboChange}
                                    BarcodeList={this.props.Login.BarcodeList}
                                    Printer={this.props.Login.Printer}
                                    nbarcodeprint={this.props.Login.nbarcodeprint}
                                // selectedPrinterData={this.state.selectedPrinterData}

                                >
                                </AddBarcode> : this.state.showQRCode ?
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
                                                    <FormLabel>{this.props.intl.formatMessage({ id: "IDS_SAMPLETYPE" })}:</FormLabel>
                                                    <ReadOnlyText>{this.state.selectedRecord.barcodeData.Product || '-'}</ReadOnlyText>
                                                </Col>

                                            </Row>
                                        </Col>
                                    </Row>
                                    : this.state.showBarcode ?
                                        <BarcodeGeneratorComponent
                                            barcodeData={this.state.selectedRecord.generateBarcodeValue}
                                            additionalDesignsToPrint={this.state.selectedRecord.additionDesignToPrint}
                                            background="#ffffff"
                                            textAlign="center"
                                            fontSize={38}
                                            fontOption="bold"
                                            textPosition="bottom"
                                            lineColor="#000000"
                                            width={3}
                                            height={100}
                                            format="CODE128"
                                            margin={10}
                                            marginTop={50}
                                            marginBottom={undefined}
                                            marginLeft={20}
                                            marginRight={undefined}
                                            flat={true}
                                            printBarcode={true}
                                            displayValue={true}
                                        />
                                        : this.props.Login.addMaster ?
                                            <AddMasterRecords
                                                selectedControl={this.props.Login.selectedControl[this.props.Login.masterIndex]}
                                                fieldList={this.props.Login.masterfieldList && this.props.Login.masterfieldList[this.props.Login.masterIndex]}
                                                extractedColumnList={this.props.Login.masterextractedColumnList[this.props.Login.masterIndex]}
                                                selectedRecord={this.state.selectedMaster[this.props.Login.masterIndex] || {}}
                                                onInputOnChange={this.onInputOnChangeMaster}
                                                onComboChange={this.onComboChangeMaster}
                                                handleDateChange={this.handleDateChangeMaster}
                                                dataList={this.props.Login.masterdataList && this.props.Login.masterdataList[this.props.Login.masterIndex]}
                                                onNumericInputOnChange={this.onNumericInputOnChangeMaster}
                                                masterDesign={this.props.Login.masterDesign && this.props.Login.masterDesign[this.props.Login.masterIndex]}
                                                mastertimeZoneList={this.props.Login.mastertimeZoneList}
                                                masterdefaultTimeZone={this.props.Login.masterdefaultTimeZone}
                                                onComboChangeMasterDyanmic={this.onComboChangeMasterDyanmic}
                                                handleDateChangeMasterDynamic={this.handleDateChangeMasterDynamic}
                                                onInputOnChangeMasterDynamic={this.onInputOnChangeMasterDynamic}
                                                onNumericInputChangeMasterDynamic={this.onNumericInputChangeMasterDynamic}
                                                onNumericBlurMasterDynamic={this.onNumericBlurMasterDynamic}
                                                userInfo={this.props.Login.userInfo}
                                                Login={this.props.Login}
                                                addMasterRecord={this.addMasterRecord}
                                                editMasterRecord={this.editMasterRecord}
                                                userRoleControlRights={this.props.Login.userRoleControlRights}
                                                masterIndex={this.props.Login.masterIndex} />
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
                                                    selectedTestPackageData={this.state.selectedStbTimePointTestPackageData}
                                                    childoperation={this.props.Login.operation}
                                                    specBasedComponent={this.props.Login.specBasedComponent}
                                                    userRoleControlRights={this.props.Login.userRoleControlRights}
                                                    selectPackage={this.state.selectedRecord}
                                                    TestPackage={this.props.Login.TestPackage || []}
                                                    onTestPackageChange={this.onTestPackageChange}
                                                    operation={this.props.Login.operation}
                                                    hideQualisForms={this.props.Login.hideQualisForms}
                                                    addMasterRecord={this.addMasterRecord}
                                                    editMasterRecord={this.editMasterRecord}
                                                    hasTest={true}
                                                    onDropFile={this.onDropFileSubSample}
                                                    deleteAttachment={this.deleteAttachmentSubSample}
                                                    onTestSectionChange={this.onTestSectionChange}
                                                    TestSection={this.props.Login.TestSection || []}
                                                    selectSection={this.state.selectedRecord}

                                                />
                                                : this.props.Login.loadFile ?
                                                    <AddFile
                                                        selectedFile={this.state.selectedFile || {}}
                                                        onInputOnChange={this.onInputOnChange}
                                                        onDrop={this.onDropComponentFile}
                                                        deleteAttachment={this.deleteAttachment}
                                                        actionType={this.state.actionType}
                                                        maxSize={20}
                                                        maxFiles={1}
                                                    /> :
                                                    this.props.Login.loadChildTest ?
                                                        <AddTest
                                                            TestCombined={this.props.Login.TestCombined}
                                                            selectedTestData={this.state.selectedRecord}
                                                            TestChange={this.onComboChange}
                                                            TestPackageChange={this.onComboTestPackageChange}
                                                            userRoleControlRights={this.props.Login.userRoleControlRights}
                                                            selectPackage={this.state.selectedRecord}
                                                            selectSection={this.state.selectedRecord}
                                                            TestPackage={this.props.Login.TestPackage || []}
                                                            TestSection={this.props.Login.TestSection || []}
                                                            onTestPackageChange={this.onTestPackageChange}
                                                            onTestSectionChange={this.onTestSectionChange}
                                                            hideQualisForms={this.props.Login.hideQualisForms}

                                                        /> :
                                                        this.props.Login.loadChildTest ?
                                                            <AddTest
                                                                TestCombined={this.props.Login.availableTest}
                                                                selectedStbTimePointTestData={this.state.selectedRecord}
                                                                TestChange={this.onComboChange}
                                                                TestPackageChange={this.onComboTestPackageChange}
                                                                userRoleControlRights={this.props.Login.userRoleControlRights}
                                                                selectPackage={this.state.selectedRecord}
                                                                TestPackage={this.props.Login.TestPackage || []}
                                                                onTestPackageChange={this.onTestPackageChange}
                                                                hideQualisForms={this.props.Login.hideQualisForms}
                                                            />
                                                            : this.props.Login.outsourcetest ?
                                                                <Row>
                                                                    <Col>
                                                                        <FormSelectSearch
                                                                            name={"outsourcesite"}
                                                                            formLabel={this.props.intl.formatMessage({ id: "IDS_SITE" })}
                                                                            placeholder="Please Select..."
                                                                            options={this.props.Login.outSourceSiteList || []}
                                                                            value={this.props.Login.selectedRecord ? this.props.Login.selectedRecord["outsourcesite"] : ""}
                                                                            isMandatory={true}
                                                                            required={true}
                                                                            isMulti={false}
                                                                            isClearable={true}
                                                                            isSearchable={true}
                                                                            isDisabled={false}
                                                                            closeMenuOnSelect={true}
                                                                            alphabeticalSort={true}
                                                                            onChange={(event) => this.onComboChange(event, "outsourcesite")}

                                                                        />

                                                                        <FormMultiSelect
                                                                            name={"outsourcetestlist"}
                                                                            label={this.props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                                                                            options={this.props.Login.outSourceTestList || []}
                                                                            optionId={"nstbtimepointtestcode"}
                                                                            optionValue="stestsynonym"
                                                                            value={this.props.Login.selectedRecord && this.props.Login.selectedRecord["outSourceTestList"] ? this.props.Login.selectedRecord["outSourceTestList"] : []}
                                                                            isMandatory={true}
                                                                            isClearable={true}
                                                                            disableSearch={false}
                                                                            disabled={false}
                                                                            closeMenuOnSelect={false}
                                                                            alphabeticalSort={true}
                                                                            onChange={(event) => this.onComboChange(event, "outSourceTestList")}

                                                                        />

                                                                        <DateTimePicker
                                                                            name={"doutsourcedate"}
                                                                            label={this.props.intl.formatMessage({ id: "IDS_OUTSOURCEDATE" })}
                                                                            className='form-control'
                                                                            placeholderText={this.props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                                                                            selected={this.props.Login.selectedRecord["doutsourcedate"] ? this.props.Login.selectedRecord["doutsourcedate"] : new Date()}
                                                                            dateFormat={this.props.Login.userInfo.ssitedate}
                                                                            timeInputLabel={this.props.intl.formatMessage({ id: "IDS_TIME" })}
                                                                            showTimeInput={false}
                                                                            isClearable={true}
                                                                            isMandatory={true}
                                                                            required={true}
                                                                            onChange={date => this.handleDateChange("doutsourcedate", date)}
                                                                            value={this.props.Login.selectedRecord ? this.props.Login.selectedRecord["doutsourcedate"] : ""}
                                                                        />
                                                                        <FormInput
                                                                            label={this.props.intl.formatMessage({ id: "IDS_SAMPLEID" })}
                                                                            name="ssampleid"
                                                                            type="text"
                                                                            onChange={(event) => this.onInputOnChange(event)}
                                                                            placeholder={this.props.intl.formatMessage({ id: "IDS_SAMPLEID" })}
                                                                            value={this.props.Login.selectedRecord ? this.props.Login.selectedRecord["ssampleid"] : ""}
                                                                            isMandatory={true}
                                                                            required={true}
                                                                            maxLength={100}
                                                                        />

                                                                        <FormTextarea
                                                                            name={"sremarks"}
                                                                            label={this.props.intl.formatMessage({ id: "IDS_REMARKS" })}
                                                                            onChange={(event) => this.onInputOnChange(event)}
                                                                            placeholder={this.props.intl.formatMessage({ id: "IDS_REMARKS" })}
                                                                            value={this.props.Login.selectedRecord ? this.props.Login.selectedRecord["sremarks"] : ""}
                                                                            rows="2"
                                                                            required={false}
                                                                            maxLength={255}
                                                                        >
                                                                        </FormTextarea>

                                                                        <FormTextarea
                                                                            name={"sshipmenttracking"}
                                                                            label={this.props.intl.formatMessage({ id: "IDS_SHIPMENTTRACKING" })}
                                                                            onChange={(event) => this.onInputOnChange(event)}
                                                                            placeholder={this.props.intl.formatMessage({ id: "IDS_SHIPMENTTRACKING" })}
                                                                            value={this.props.Login.selectedRecord ? this.props.Login.selectedRecord["sshipmenttracking"] : ""}
                                                                            rows="2"
                                                                            required={false}
                                                                            maxLength={255}
                                                                        >
                                                                        </FormTextarea>
                                                                    </Col>
                                                                </Row>
                                                                : this.props.Login.multiFilterLoad ?
                                                                    <KendoDatatoolFilter
                                                                        filter={this.props.Login.masterData['kendoFilterList'] || {
                                                                            logic: "and",
                                                                            filters: []
                                                                        }}
                                                                        handleFilterChange={this.handleFilterChange}
                                                                        filterData={this.props.Login.masterData.kendoOptionList || []}
                                                                        fields={this.props.Login.masterData["fields"] || []}
                                                                        userInfo={this.props.Login.userInfo}
                                                                        static={true}
                                                                        parentCallBack={this.parentCallBack}
                                                                        needParentCallBack={true}
                                                                    /> : ""
                        }
                    />
                }

                {this.props.Login.openChildModal &&
                    <SlideOutModal show={this.props.Login.openChildModal}
                        closeModal={this.closeSendToStoreChildModal}
                        operation={this.props.Login.MappingFields ? "" : "Store"}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.MappingFields ? this.props.intl.formatMessage({ id: "IDS_ORDERMAPPING" }) : this.props.intl.formatMessage({ id: "IDS_SAMPLE" })}
                        onSaveClick={this.props.Login.MappingFields ? this.onSaveModalClick : this.onSendToStoreSample}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.MappingFields && this.mandatoryMappingList()}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.MappingFields ?
                                <MappingFields
                                    selectedRecord={this.state.selectedRecord}
                                    selectedDetailField={this.state.selectedDetailField}
                                    orderTypeList={this.props.Login.orderTypeList}
                                    orderList={this.props.Login.orderList}

                                    onComboChange={this.onComboChange}
                                /> :
                                <MoveSampleOrContainers
                                    treeData={this.state.treeData}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    itemRender={this.itemRender}
                                    onExpandChange={this.onExpandChange}
                                    onItemClick={this.onItemClick}
                                    onComboChange={this.onComboChangeTree}
                                    onNumericInputChange={this.onNumericInputChangeSample}
                                    storageCategory={this.props.Login.masterData.storageCategory || []}
                                    unitMaster={this.props.Login.masterData.unitMaster || []}
                                    approvedLocation={this.props.Login.masterData.approvedLocation || []}
                                    isSendToStore={true}
                                />
                        }
                    />
                }

                {this.state.showConfirmAlert ? this.confirmAlert() : ""}

                {this.props.Login.modalShow ? ( //ALPD-4912-To show the add popup to get input of filter name,done by Dhanushya RI
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
            </>
        );
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
        if (event && event.nstbtimepointtestcode) {
            id = event.nstbtimepointtestcode
        } else if (event && event.nstbtimepointcode) {
            id = event.nstbtimepointcode
        } else if (event && event.nstbstudyplancode) {
            id = event.nstbstudyplancode
        }

        let activeTabIndex
        let activeTabId
        if (window.innerWidth > 992 && event && this.state.enableAutoClick || !event) {
            activeTabIndex = this.state.activeTabIndex !== index ? index : id ? index : false;
        }
        if (status !== "click") {
            if (index === SideBarTabIndex.RESULT) {
                const tabProps = {
                    tabSequence: SideBarSeqno.TEST,
                    screenName: "IDS_TIMEPOINTRESULTS",
                    activeTabIndex,
                    activeTabId
                }
                this.onTabChange(tabProps);
            }
            else if (index === SideBarTabIndex.ATTACHMENTS) {
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
            else if (index === SideBarTabIndex.HISTORY) {
                const tabProps = {
                    tabSequence: SideBarSeqno.TEST,
                    screenName: "IDS_TIMEPOINTHISTORY",
                    activeTabIndex,
                    activeTabId
                }
                this.onTabChange(tabProps);
            }
            else if (index === SideBarTabIndex.OUTSOURCE) {
                const tabProps = {
                    tabSequence: SideBarSeqno.SUBSAMPLE,
                    screenName: "IDS_OUTSOURCEDETAILS",
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
        else {
            // if (window.innerWidth > 992 && event && this.state.enableAutoClick || !event) {

            //     const updateInfo = {
            //         typeName: DEFAULT_RETURN,
            //         data: {
            //             activeTabIndex :activeTabIndex
            //            // activeTabId :  id
            //         }
            //     }
            //     this.props.updateStore(updateInfo);

            //     }
        }
    }
    onRegTypeChange = (event, fieldName, labelname) => {
        if (event !== null) {
            let Map = {};
            Map["nregtypecode"] = parseInt(event.value);
            Map['userinfo'] = this.props.Login.userInfo;
            this.props.getRegTypeChange(Map, this.props.Login.masterData, event, labelname);
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

    onApprovalConfigVersionChange = (event, fieldName, labelname) => {
        if (event !== null) {
            let Map = {};
            Map['nregtypecode'] = this.props.Login.masterData.RegTypeValue.nregtypecode;
            Map["nregsubtypecode"] = this.props.Login.masterData.RegSubTypeValue.nregsubtypecode;
            //  Map["nneedtemplatebasedflow"] = event.item.nneedtemplatebasedflow;
            Map["napproveconfversioncode"] = event.value;
            Map['userinfo'] = this.props.Login.userInfo;
            this.props.onApprovalConfigVersionChange(Map, this.props.Login.masterData, event, labelname);
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

    cancelSampleRecords = (controlcode, skip, take) => {
        let Map = {};
        let sampleList = [];
        if((this.props.Login.masterData.searchedSample && this.props.Login.masterData.searchedSample[0].ntransactionstatus===transactionStatus.APPROVED)
        ||(this.props.Login.masterData.selectedStabilityStudyPlan && this.props.Login.masterData.selectedStabilityStudyPlan[0].ntransactionstatus===transactionStatus.APPROVED)){
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTODELETE" }));
        }else{
        if (this.props.Login.masterData.searchedSample !== undefined) {
            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.StabilityStudyPlanGet;
            sampleList = list ? list.slice(skip, skip + take) : [];
        } else {
            sampleList = this.props.Login.masterData.StabilityStudyPlanGet && sortDataForDate(this.props.Login.masterData.StabilityStudyPlanGet, 'dtransactiondate', 'nstbstudyplancode').slice(skip, skip + take);
        }
        if (sampleList && sampleList.length > 0) {
            const obj = convertDateValuetoString(this.props.Login.masterData.RealFromDate, this.props.Login.masterData.RealToDate, this.props.Login.userInfo);
            Map['FromDate'] = obj.fromDate;
            Map['ToDate'] = obj.toDate;
            Map["userinfo"] = this.props.Login.userInfo;
            Map["ncontrolcode"] = controlcode;
            Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
            Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
            Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
            Map["nfilterstatus"] = this.props.Login.masterData.FilterStatusValue.ntransactionstatus;
            Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
            Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
            Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;

            Map["nstbstudyplancode"] = this.props.Login.masterData.selectedStabilityStudyPlan &&
                this.props.Login.masterData.selectedStabilityStudyPlan.map(sample => sample.nstbstudyplancode).join(",");
            Map["nstbtimepointcode"] = this.props.Login.masterData.selectedStbTimePoint &&
                this.props.Login.masterData.selectedStbTimePoint.length > 0 ?
                this.props.Login.masterData.selectedStbTimePoint.map(sample => sample.nstbtimepointcode).join(",") : "-1";
            Map["nstbtimepointtestcode"] = this.props.Login.masterData.selectedStbTimePointTest &&
                this.props.Login.masterData.selectedStbTimePointTest.length > 0 ?
                this.props.Login.masterData.selectedStbTimePointTest.map(test => test.nstbtimepointtestcode).join(",") : "-1";
            Map["napproveconfversioncode"] = this.props.Login.masterData.napproveconfversioncode;
            let inputParam = {
                inputData: Map,
                postParamList: this.postParamList,
                action: 'delete'
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
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLETOCANCELREJECT" }));
        }
    }

    }

    cancelSubSampleRecord = (controlcode, skip, take) => {

        if((this.props.Login.masterData.searchedSample && this.props.Login.masterData.searchedSample[0].ntransactionstatus===transactionStatus.APPROVED)
            ||(this.props.Login.masterData.selectedStabilityStudyPlan && this.props.Login.masterData.selectedStabilityStudyPlan[0].ntransactionstatus===transactionStatus.APPROVED)){
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTODELETE" }));
            }else{
        let testList = [];
        if (this.props.Login.masterData.searchedSubSample !== undefined) {
            const list = this.props.Login.masterData.searchedSubSample ? this.props.Login.masterData.searchedSubSample
                : this.props.Login.masterData.StbTimePointGet;

            testList = list ? list.slice(this.state.subsampleskip, this.state.subsampleskip + this.state.subsampletake) : [];
        } else {
            testList = this.props.Login.masterData.StbTimePointGet.slice(this.state.subsampleskip, this.state.subsampleskip + this.state.subsampletake);
        }

        if (this.props.Login.masterData && this.props.Login.masterData.selectedStbTimePoint.length > 0) {
            let Map = {};
            Map['nstbstudyplancode'] = this.props.Login.masterData.selectedStabilityStudyPlan && this.props.Login.masterData.selectedStabilityStudyPlan.length > 0 ?
                this.props.Login.masterData.selectedStabilityStudyPlan.map(x => x.nstbstudyplancode).join(",") : "-1";
            Map['nstbtimepointtestcode'] = this.props.Login.masterData.selectedStbTimePointTest && this.props.Login.masterData.selectedStbTimePointTest.length > 0 ?
                this.props.Login.masterData.selectedStbTimePointTest.map(x => x.nstbtimepointtestcode).join(",") : "-1";
            Map["userinfo"] = this.props.Login.userInfo;
            Map["ncontrolcode"] = controlcode;
            Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
            Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
            Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;

            Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
            Map["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue
                && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode;
            Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
            Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
            Map["nfilterstatus"] = -1;

            Map["nstbtimepointcode"] = this.props.Login.masterData.selectedStbTimePointTest && this.props.Login.masterData.selectedStbTimePointTest.length > 0 ?
                this.props.Login.masterData.selectedStbTimePointTest.map(sample => sample.nstbtimepointcode).join(",") : "-1";

            Map["FromDate"] = rearrangeDateFormat(this.props.Login.masterData.FromDate);
            Map["ToDate"] = rearrangeDateFormat(this.props.Login.masterData.ToDate);

            let inputParam = {
                inputData: Map,
                postParamList: this.postParamList,
                action: 'StbTimePoint'
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
                        operation: 'delete'
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.cancelStbTimePointAction(inputParam, this.props.Login.masterData)
            }

        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLETOCANCELREJECT" }));
        }
     }
    }

    getTestChildTabDetailRegistration = (inputData, isServiceRequired) => {
        if (this.props.Login.masterData.selectedStbTimePointTest[0].nstbtimepointtestcode !==
            parseInt(inputData.nstbtimepointtestcode)
        ) {
            let masterData = this.props.Login.masterData;
            masterData['selectedStbTimePointTest'] = inputData.selectedStbTimePointTest;
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: false,
                    screenData: { masterData },
                    openModal: false,
                    screenName: this.props.Login.screenName,
                    activeTabIndex:  false,
                }
            }
            this.props.updateStore(updateInfo);
        }
    }

    cancelRecord = (controlcode, skip, take) => {
        if((this.props.Login.masterData.searchedSample && this.props.Login.masterData.searchedSample[0].ntransactionstatus===transactionStatus.APPROVED)
            ||(this.props.Login.masterData.selectedStabilityStudyPlan && this.props.Login.masterData.selectedStabilityStudyPlan[0].ntransactionstatus===transactionStatus.APPROVED)){
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTODELETE" }));
            }else{
        if (this.props.Login.masterData && this.props.Login.masterData.selectedStbTimePointTest.length > 0) {
            let Map = {};
            Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
            Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
            Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
            Map["nfilterstatus"] = this.props.Login.masterData.FilterStatusValue.ntransactionstatus;
            Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
            Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
            Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;

            Map["nstbtimepointtestcode"] = this.props.Login.masterData.selectedStbTimePointTest.length > 0 ? this.props.Login.masterData.selectedStbTimePointTest.map(x => x.nstbtimepointtestcode).join(",") : "-1";
            Map["nstbtimepointcode"] = this.props.Login.masterData.selectedStbTimePoint.length > 0 ? this.props.Login.masterData.selectedStbTimePoint.map(x => x.nstbtimepointcode).join(",") : "-1";
            Map["nstbstudyplancode"] = this.props.Login.masterData.selectedStabilityStudyPlan.length > 0 ? this.props.Login.masterData.selectedStabilityStudyPlan.map(x => x.nstbstudyplancode).join(",") : "-1";
            Map["userinfo"] = this.props.Login.userInfo;
            Map["napproveconfversioncode"] = this.props.Login.masterData.ApprovalConfigVersion
                && this.props.Login.masterData.ApprovalConfigVersionValue.napproveconfversioncode;
            Map["ncontrolcode"] = controlcode;
            let inputParam = {
                inputData: Map,
                postParamList: this.postParamList,
                action: 'delete'
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
                        operation: 'delete'
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.deleteTestAction(inputParam, this.props.Login.masterData)
            }

        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTTESTTOCANCELREJECT" }));
        }
    }
    }

    openFilter = () => {
        let showFilter = !this.props.Login.showFilter
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter }
        }
        this.props.updateStore(updateInfo);
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
            const sampleList = getSameRecordFromTwoArrays(inputParam.masterData.selectedStabilityStudyPlan, [inputParam.mastertoedit], "nstbstudyplancode")
            this.props.getEditStbTimePointDetails(inputParam,
                data, this.state.selectedRecord, regSubSamplechildColumnList,
                regSubSamplecomboComponents, regSubSamplewithoutCombocomponent,
                sampleList[0].ncomponentrequired === 3 ? true : false)
        } else {
            toast.info("Configure the sub sample template for this registrationtype")
        }
    }

    closeFilter = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false }
        }
        this.props.updateStore(updateInfo);
    }

    onFilterSubmit = () => {

        const RealFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.fromdate || this.props.Login.masterData.FromDate);
        const RealToDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.todate || this.props.Login.masterData.ToDate)
        let RealSampleTypeValue = this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue
        let RealRegTypeValue = this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue
        let RealRegSubTypeValue = this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue
        let RealFilterStatusValue = this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue
        let RealDesignTemplateMappingValue = this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue
        //let RealApprovalConfigVersionValue = this.props.Login.masterData.RealApprovalConfigVersionValue && this.props.Login.masterData.RealApprovalConfigVersionValue
        //ALPD-1166
        let RealApprovalConfigVersionValue = this.props.Login.masterData.ApprovalConfigVersionValue && this.props.Login.masterData.ApprovalConfigVersionValue
        let RealSampleTypeList = this.props.Login.masterData.SampleType || []
        let RealRegTypeList = this.props.Login.masterData.RegistrationType || []
        let RealRegSubTypeList = this.props.Login.masterData.RegistrationSubType || []
        let RealFilterStatuslist = this.props.Login.masterData.FilterStatus || []
        let RealDesignTemplateMappingList = this.props.Login.masterData.DesignTemplateMapping || []
        let RealApprovalConfigVersionList = this.props.Login.masterData.ApprovalConfigVersion || []

        let activeSampleTab = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
        let activeSubSampleTab = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";

        let activeTestTab = this.props.Login.activeTestTab || "IDS_TIMEPOINTRESULTS";
        let masterData = {
            ...this.props.Login.masterData, RealSampleTypeValue, RealRegTypeValue, RealRegSubTypeValue,
            RealFilterStatusValue, RealFromDate, RealToDate, RealDesignTemplateMappingValue, RealApprovalConfigVersionValue,
            RealSampleTypeList, RealRegTypeList, RealRegSubTypeList, RealDesignTemplateMappingList, RealApprovalConfigVersionList,
            RealFilterStatuslist
        }
        let inputData = {
            nstbstudyplancode: "",
            saveFilterSubmit: true, //ALPD-4912 to insert the filter data's in filterdetail table when submit the filter,done by Dhanushya RI
            sampleTypeValue: this.props.Login.masterData && this.props.Login.masterData.SampleTypeValue,
            regTypeValue: this.props.Login.masterData && this.props.Login.masterData.RegTypeValue,
            regSubTypeValue: this.props.Login.masterData && this.props.Login.masterData.RegSubTypeValue,
            filterStatusValue: this.props.Login.masterData && this.props.Login.masterData.FilterStatusValue,
            approvalConfigValue: this.props.Login.masterData && this.props.Login.masterData.ApprovalConfigVersionValue,
            designTemplateMappingValue: this.props.Login.masterData && this.props.Login.masterData.DesignTemplateMappingValue,
            nsampletypecode: this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
            nfilterstatus: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
            userinfo: this.props.Login.userInfo,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            napproveconfversioncode: this.props.Login.masterData.ApprovalConfigVersion
                && this.props.Login.masterData.ApprovalConfigVersionValue.napproveconfversioncode,
            ndesigntemplatemappingcode: this.props.Login.masterData.DesignTemplateMappingValue
                && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
        }
        if (inputData.nsampletypecode) {
            if (inputData.ndesigntemplatemappingcode) {
                const obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.FromDate,
                    this.state.selectedFilter.todate || this.props.Login.masterData.ToDate, this.props.Login.userInfo)
                inputData['FromDate'] = obj.fromDate;
                inputData['ToDate'] = obj.toDate;
                // ALPD-4130 to clear Additinal Filter config upon Filter Submit- ATE-241
                masterData['kendoFilterList'] = undefined;
                const selectedFilter = {};
                selectedFilter["fromdate"] = RealFromDate;
                selectedFilter["todate"] = RealToDate;
                const inputParam = {
                    masterData, inputData, searchSubSampleRef: this.searchSubSampleRef,
                    searchSampleRef: this.searchSampleRef,
                    searchTestRef: this.searchTestRef
                    //, selectedFilter
                }
                this.props.getStabilityStudyPlanByFilterSubmit(inputParam);
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_PLSSCONFIGREGISTRATIONTEMPLATE" }));
            }
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
        }
    }

    onReload = () => {
        const obj = convertDateValuetoString(this.props.Login.masterData.RealFromDate, this.props.Login.masterData.RealToDate, this.props.Login.userInfo);
        const RealFromDate = obj.fromDate;
        const RealToDate = obj.toDate;
        let RealSampleTypeValue = this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue
        let RealRegTypeValue = this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue
        let RealRegSubTypeValue = this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue
        let RealFilterStatusValue = this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue
        let RealDesignTemplateMappingValue = this.props.Login.masterData.RealDesignTemplateMappingValue && this.props.Login.masterData.RealDesignTemplateMappingValue
        let RealApprovalConfigVersionValue = this.props.Login.masterData.RealApprovalConfigVersionValue && this.props.Login.masterData.RealApprovalConfigVersionValue
        let activeSampleTab = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
        let activeSubSampleTab = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
        let activeTestTab = this.props.Login.activeTestTab || "IDS_TIMEPOINTRESULTS";

        let SampleTypeValue = RealSampleTypeValue
        let RegTypeValue = RealRegTypeValue
        let RegSubTypeValue = RealRegSubTypeValue
        let FilterStatusValue = RealFilterStatusValue
        let DesignTemplateMappingValue = RealDesignTemplateMappingValue
        let ApprovalConfigVersionValue = RealApprovalConfigVersionValue
        // let FromDate = this.props.Login.masterData.FromDate
        // let ToDate = this.props.Login.masterData.ToDate
        const FromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
        const ToDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
        let masterData = {
            ...this.props.Login.masterData, RealSampleTypeValue, RealRegTypeValue, RealRegSubTypeValue, FromDate, ToDate,
            RealFilterStatusValue, RealFromDate, RealToDate, SampleTypeValue, RegTypeValue,
            RegSubTypeValue, FilterStatusValue, DesignTemplateMappingValue, RealDesignTemplateMappingValue, RealApprovalConfigVersionValue
        }
        let inputData = {
            nstbstudyplancode: "",
            nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
            nfilterstatus: this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus,
            userinfo: this.props.Login.userInfo, activeSubSampleTab,
            flag: 1,
            nneedtemplatebasedflow: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedtemplatebasedflow,
            ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
            napproveconfversioncode: this.props.Login.masterData.RealApprovalConfigVersionValue
                && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode,
            nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
        }
        if (inputData.nsampletypecode) {
            inputData['FromDate'] = obj.fromDate;
            inputData['ToDate'] = obj.toDate;

            let inputParam = { masterData, inputData, searchSubSampleRef: this.searchSubSampleRef, searchSampleRef: this.searchSampleRef, searchTestRef: this.searchTestRef, selectedFilter: this.state.selectedFilter }

            this.props.ReloadData(inputParam);
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
        }
    }

    addTimePoint = (controlcode, skip, take) => {
        let Map = {};
        let sampleList = [];
        if (this.props.Login.masterData.searchedSample !== undefined) {
            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.StabilityStudyPlanGet;

            sampleList = list ? list.slice(skip, skip + take) : [];

        } else {
            sampleList = this.props.Login.masterData.StabilityStudyPlanGet && sortDataForDate(this.props.Login.masterData.StabilityStudyPlanGet, 'dtransactiondate', 'nstbstudyplancode').slice(skip, skip + take);
        }

        let addSubSampleList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedStabilityStudyPlan, "nstbstudyplancode");

        const nsampletypecode = 9;
        let check = true;
        if (nsampletypecode === SampleType.CLINICALTYPE && addSubSampleList.length > 1) {
            check = false
        }
        if (addSubSampleList && addSubSampleList.length > 0 && check) {
            const findTransactionStatus = [...new Set(addSubSampleList.map(item => item.ntransactionstatus))];

            if (findTransactionStatus.length === 1) {
                if (findTransactionStatus.indexOf(transactionStatus.REJECT) === -1
                    && findTransactionStatus.indexOf(transactionStatus.CANCELLED) === -1
                    && findTransactionStatus.indexOf(transactionStatus.RELEASED) === -1) {
                    // if (findTransactionStatus[0] === transactionStatus.PREREGISTER) {
                    //   const findApprovalVersion = [...new Set(addSubSampleList.map(item => item.napprovalversioncode))];
                    //   if (findApprovalVersion.length === 1) {
                    const findSampleSpec = [...new Set(addSubSampleList.map(item => item.nallottedspeccode))];
                    //const findComponentReqSpec = [...new Set(addSubSampleList.map(item => item.ncomponentrequired))];
                    const findSampleSpectemplate = [...new Set(addSubSampleList.map(item => item.ntemplatemanipulationcode))];
                    //const findComponent = [...new Set(selectsubsample.map(item => item.ncomponentcode))];
                    if (findSampleSpec.length === 1)//&& findComponent.length === 1 
                    {
                        const findComponentReqSpec = addSubSampleList[0].ncomponentrequired;
                        let data = [];
                        const regSubSamplewithoutCombocomponent = [];
                        const Layout = this.props.Login.masterData.SubSampleTemplate
                            && this.props.Login.masterData.SubSampleTemplate.jsondata
                        if (Layout !== undefined) {
                            Layout.map(row => {
                                return row.children.map(column => {
                                    return column.children.map(component => {
                                        return component.hasOwnProperty("children") ?
                                            component.children.map(componentrow => {
                                                if (componentrow.inputtype === "combo" || componentrow.inputtype === "backendsearchfilter"
                                                    || componentrow.inputtype === "frontendsearchfilter") {
                                                    data.push(componentrow)
                                                } else {
                                                    regSubSamplewithoutCombocomponent.push(componentrow)
                                                }
                                                return null;
                                            })
                                            : component.inputtype === "combo" || component.inputtype === "backendsearchfilter"
                                                || component.inputtype === "frontendsearchfilter" ? data.push(component) :
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
                            Map["nallottedspeccode"] = findSampleSpec[0];
                            Map["ntemplatemanipulationcode"] = findSampleSpectemplate[0];
                            Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode || -1;
                            Map["nneedsubsample"] = true;
                            Map["nstbstudyplancode"] = addSubSampleList &&
                                addSubSampleList.map(sample => sample.nstbstudyplancode).join(",");
                            Map["stbTimePoint"] = addSubSampleList;
                            this.props.addSubTimePoint(this.props.Login.masterData,
                                this.props.Login.userInfo, data, this.state.selectedRecord,
                                regchildColumnList, regSubSamplecomboComponents,
                                regSubSamplewithoutCombocomponent,
                                Map, controlcode, findComponentReqSpec === 3 ? true : false, this.state.specBasedTestPackage)
                        } else {
                            toast.info(this.props.intl.formatMessage({ id: "IDS_PLEASECONFIGURETHESUBSAMPLETEMPLATE" }));
                        }

                    } else {
                        toast.info(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMESPECANDCOMPONENT" }));
                    }
                }
                else {
                    toast.info(this.props.intl.formatMessage({ id: "IDS_CANNOTADDSUBSAMPLEASSAMPLEREJECTEDORCANCELLEDORRELEASED" }));
                }
            }
            else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMESTATUS" }));
            }
        } else {
            toast.info(this.props.intl.formatMessage({ id: check ? "IDS_SELECTSAMPLETOSUBSAMPLE" : "IDS_SELECTONESAMPLE" }));
        }
    }

    getStabilityStudyPlanComboService = (ScreenName, operation,
        primaryKeyField, masterData, userInfo, editId, importData) => {

        const ndesigntemplatemappingcodefilter = this.props.Login.masterData.DesignTemplateMapping &&
            this.props.Login.masterData.DesignTemplateMapping[0].ndesigntemplatemappingcode;
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
                                    if (componentrow.inputtype === "combo" || componentrow.inputtype === "backendsearchfilter"
                                        || componentrow.inputtype === "frontendsearchfilter") {
                                        data.push(componentrow)
                                    } else {
                                        withoutCombocomponent.push(componentrow)
                                    }
                                    return null;
                                })
                                : component.inputtype === "combo" || component.inputtype === "backendsearchfilter"
                                    || component.inputtype === "frontendsearchfilter" ?
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
                    nsampletypecode: SampleType.STABILITY,
                    sampletypecategorybasedflow: transactionStatus.NO,
                    nneedsubsample: transactionStatus.YES,
                    ntestgroupspecrequired: transactionStatus.YES

                }
                this.props.getPreviewTemplate(masterData, userInfo, editId,
                    data, this.state.selectedRecord, childColumnList,
                    comboComponents, withoutCombocomponent, true, false,
                    mapOfFilterRegData, false, "create", ScreenName || "", importData)
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_CONFIGURETEMPLATE" }));
            }
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVEDDESIGNTEMPLATE" }));
        }
    }

    onTestSectionChange = (comboData, fieldName, nneedsubsample, specBasedComponent1, caseNo) => {
        const selectedRecord = this.state.selectedRecord || {};
        const selectSection = this.state.selectSection || {};
        const selectPackage = [];
        selectPackage['ntestpackagecode'] = this.state.selectedRecord.ntestpackagecode;
        if (comboData !== null) {
            selectSection[fieldName] = comboData;
            selectSection["ssectionname"] = comboData.label;
            selectSection["nspecsampletypecode"] = parseInt(this.state.selectedRecord.nspecsampletypecode);
            selectedRecord["nallottedspeccode"] = this.props.Login.masterData.selectedStabilityStudyPlan && this.props.Login.masterData.selectedStabilityStudyPlan[0].nallottedspeccode;

            selectedRecord[fieldName] = comboData;
            selectedRecord["ssectionname"] = comboData.label;
            const specBasedComponent = specBasedComponent1;
            selectedRecord["nspecsampletypecode"] = this.state.selectedRecord.nspecsampletypecode && this.state.selectedRecord.nspecsampletypecode !== undefined ? this.state.selectedRecord.nspecsampletypecode :
                parseInt(this.props.Login.masterData.selectedStbTimePoint &&
                    [...new Set(this.props.Login.masterData.selectedStbTimePoint.map(x => x.nspecsampletypecode))].join(","));
            // selectedRecord["nspecsampletypecode"] = parseInt(this.props.Login.masterData.selectedStbTimePoint &&
            //     [...new Set(this.props.Login.masterData.selectedStbTimePoint.map(x => x.nspecsampletypecode))].join(","));

            this.props.testSectionTest(selectedRecord, true, this.props.Login.specBasedComponent === undefined ? specBasedComponent : this.props.Login.specBasedComponent,
                this.props.Login.Conponent, this.props.Login.selectedComponent, this.props.Login.selectedComponent,
                this.props.Login, selectPackage, selectSection, true, selectedRecord.nspecsampletypecode,
                this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample
            );
        }
        else {
            let availableTestData = [];
            if (selectedRecord["nsectioncode"]) {
                delete selectedRecord["nsectioncode"];
                delete selectedRecord["ntestgrouptestcode"];

                availableTestData = selectPackage['ntestpackagecode'] ? this.props.Login.TestPakageTest || [] : this.props.Login.AllTest || []
            }

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedRecord, availableTest: this.props.Login.AllTest, TestCombined: availableTestData, TestSection: this.props.Login.TestSection || [] }
            }
            this.props.updateStore(updateInfo);
        }


    }

    onComponentChange = (comboData, fieldName, nneedsubsample) => {
        if (comboData !== null) {
            //  if (!nneedsubsample) {
            const selectedRecord = this.state.selectedRecord || {};
            if (fieldName === 'ntzdreceivedate') {
                selectedRecord["ntzdreceivedate"] = comboData;
                this.setState({ selectedRecord })
            } else {
                selectedRecord[fieldName] = comboData;
                selectedRecord["Sample Name"] = comboData.label;
                selectedRecord["nspecsampletypecode"] = comboData.item.nspecsampletypecode;
                selectedRecord["ntestgrouptestcode"] = [];
                //selectedRecord["nneedsubsample"] = nneedsubsample;
                selectedRecord["nneedsubsample"] = true;
                this.props.componentTest(selectedRecord, true, this.props.Login.specBasedComponent,
                    this.props.Login.Conponent, this.state.specBasedTestPackage, this.props.Login.specBasedTestPackage ? true : false,
                {userinfo:this.props.Login.userInfo})
            }
        }

    }

    onInputOnSubSampleChange = (event, control, radiotext) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === 'timeonly') {
                selectedRecord['dateonly'] = false;
            }
            if (event.target.name === 'dateonly') {
                selectedRecord['timeonly'] = false;
            }
            selectedRecord[event.target.name] = event.target.checked;
        }
        else {
            if (control.isnumeric === true
                && control.label === radiotext) {
                selectedRecord[event.target.name] = event.target.value.replace(/[^0-9]/g, '');
            } else {
                selectedRecord[event.target.name] = event.target.value;
            }
            // selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    onComboSubSampleChange = (comboData, control, customName) => {
        let selectedRecord = this.state.selectedRecord || {};
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
                item: comboData ? { ...comboData.item, pkey: control.valuemember, nquerybuildertablecode: control.nquerybuildertablecode, "source": control.source } : "",
                label: comboName,
                nameofdefaultcomp: control.name
            }
            comboData["item"] = {
                ...comboData["item"], pkey: control.valuemember,
                nquerybuildertablecode: control.nquerybuildertablecode, "source": control.source
            };
            if (comboData) {
                selectedRecord[comboName] = comboData;
            } else {
                selectedRecord[comboName] = []
            }
            if (control.child && control.child.length > 0) {
                childComboList = getSameRecordFromTwoArrays(this.state.regSubSamplecomboComponents,
                    control.child, "label")
                childColumnList = {};
                childComboList.map(columnList => {
                    const val = comboChild(this.state.regSubSamplecomboComponents,
                        columnList, childColumnList, false);
                    childColumnList = val.childColumnList
                    return null;
                })

                parentList = getSameRecordFromTwoArrays(this.state.regSubSamplewithoutCombocomponent,
                    control.child, "label")

                this.props.getChildValues(inputParem,
                    this.props.Login.userInfo, selectedRecord, this.props.Login.regSubSamplecomboData,
                    childComboList, childColumnList, this.state.regSubSamplewithoutCombocomponent,
                    [...childComboList, ...parentList])
            } else {
                this.setState({ selectedRecord })
            }
        } else {
            let regSubSamplecomboData = this.props.Login.regSubSamplecomboData
            selectedRecord[control.label] = "";

            const inputParam = {
                control, comboComponents: this.state.regSubSamplecomboData,
                withoutCombocomponent: this.state.regSubSamplewithoutCombocomponent, selectedRecord: selectedRecord, comboData: regSubSamplecomboData
            }
            const childParam = childComboClear(inputParam)
            selectedRecord = childParam.selectedRecord
            regSubSamplecomboData = childParam.comboData

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedRecord, regSubSamplecomboData }
            }
            this.props.updateStore(updateInfo);
        }
    }

    onNumericInputSubSampleChange = (value, name) => {
        let selectedRecord = this.state.selectedRecord
        if (value === 0) {
            selectedRecord[name] = undefined;
        } else {
            selectedRecord[name] = value;
        }
        this.setState({ selectedRecord });
    }

    onNumericBlurSubSample = (value, control) => {
        let selectedRecord = this.state.selectedRecord
        if (selectedRecord[control.label]) {
            if (control.max) {
                if (!(selectedRecord[control.label] < parseFloat(control.max))) {
                    selectedRecord[control.label] = control.precision ? parseFloat(control.max) : parseInt(control.max)
                }
            }
            if (control.min) {
                if (!(selectedRecord[control.label] > parseFloat(control.min))) {
                    selectedRecord[control.label] = control.precision ? parseFloat(control.min) : parseInt(control.min)
                }
            }


        }
        this.setState({ selectedRecord });
    }

    handleDateSubSampleChange = (dateValue, dateName) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }
    //ALPD-3404
    onTestSectionChange = (comboData, fieldName, nneedsubsample, specBasedComponent1, caseNo) => {
        const selectedRecord = this.state.selectedRecord || {};
        const selectSection = this.state.selectSection || {};
        const selectPackage = [];
        selectPackage['ntestpackagecode'] = this.state.selectedRecord.ntestpackagecode;
        if (comboData !== null) {
            selectSection[fieldName] = comboData;
            selectSection["ssectionname"] = comboData.label;
            selectSection["nspecsampletypecode"] = parseInt(this.state.selectedRecord.nspecsampletypecode);
            selectedRecord["nallottedspeccode"] = this.props.Login.masterData.selectedStabilityStudyPlan && this.props.Login.masterData.selectedStabilityStudyPlan[0].nallottedspeccode;
            selectedRecord[fieldName] = comboData;
            selectedRecord["ssectionname"] = comboData.label;
            const specBasedComponent = specBasedComponent1;
            selectedRecord["nspecsampletypecode"] = this.state.selectedRecord.nspecsampletypecode && this.state.selectedRecord.nspecsampletypecode !== undefined ? this.state.selectedRecord.nspecsampletypecode :
                parseInt(this.props.Login.masterData.selectedStbTimePoint &&
                    [...new Set(this.props.Login.masterData.selectedStbTimePoint.map(x => x.nspecsampletypecode))].join(","));
            this.props.testSectionTest(selectedRecord, true, this.props.Login.specBasedComponent === undefined ? specBasedComponent : this.props.Login.specBasedComponent,
                this.props.Login.Conponent, this.props.Login.selectedComponent, this.props.Login.selectedComponent,
                this.props.Login, selectPackage, selectSection, true, selectedRecord.nspecsampletypecode,
                true
            );
        }
        else {
            let availableTestData = [];
            if (selectedRecord["nsectioncode"]) {
                delete selectedRecord["nsectioncode"];
                delete selectedRecord["ntestgrouptestcode"];

                availableTestData = selectPackage['ntestpackagecode'] ? this.props.Login.TestPakageTest || [] : this.props.Login.AllTest || []
            }

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedRecord, availableTest: this.props.Login.AllTest, TestCombined: availableTestData, TestSection: this.props.Login.TestSection || [] }
            }
            this.props.updateStore(updateInfo);
        }
    }

    onComboChange = (comboData, fieldName) => {
        let selectedDetailField = {};
        const selectedRecord = this.state.selectedRecord || {};
        if (fieldName === 'nexternalordercode') {
            selectedDetailField = comboData && comboData.item
        }
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord, selectedDetailField });
    }


    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
        //setTimeout(() => { this._scrollBarRef.updateScroll() })
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

    addMoreTest = (inputParam, ncontrolCode) => {
        let sampleList = [];
        const skip = this.state.skip;
        const take = this.state.take;
        if (this.props.Login.masterData.searchedSample !== undefined) {

            ///sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.StabilityStudyPlanGet.slice(skip, skip + take), "nstbstudyplancode");
            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.StabilityStudyPlanGet;

            sampleList = list ? list.slice(skip, skip + take) : [];
        } else {
            sampleList = this.props.Login.masterData.StabilityStudyPlanGet && sortDataForDate(this.props.Login.masterData.StabilityStudyPlanGet, 'dtransactiondate', 'nstbstudyplancode').slice(skip, skip + take);
        }
        let addSubSampleList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedStabilityStudyPlan, "nstbstudyplancode");

        if (addSubSampleList && addSubSampleList.length > 0) {

            inputParam["sampleList"] = sampleList;
            this.props.addMoreTests(inputParam, ncontrolCode);
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLETOADDTEST" }));
        }
    }

    sideNavDetail = (screenName//, sampleGridSkip
    ) => {
        let testList = this.props.Login.masterData.StbTimePointTestGet || [];
        let { testskip, testtake } = this.state
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.selectedStbTimePointTest, "nstbtimepointtestcode");
        let nstbtimepointtestcode = this.props.Login.masterData.selectedStbTimePointTest ? this.props.Login.masterData.selectedStbTimePointTest.map(test => test.nstbtimepointtestcode).join(",") : "-1";
        return (
            screenName == "IDS_TIMEPOINTRESULTS"
                //&& this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE 
                ? <RegistrationResultTab
                    userInfo={this.props.Login.userInfo}
                    genericLabel={this.props.Login.genericLabel}
                    masterData={this.props.Login.masterData}
                    inputParam={this.props.Login.inputParam}
                    dataState={this.state.resultDataState}
                    dataStateChange={this.testDataStateChange}
                    screenName="IDS_TIMEPOINTRESULTS"
                    controlMap={this.state.controlMap}
                    userRoleControlRights={this.state.userRoleControlRights}
                />
                :
                screenName == "IDS_ATTACHMENTS" ?
                    <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS"} tabDetail={this.attachmentTabDetail()} destroyInactiveTabPane={true} onTabChange={this.onTabChange} />
                    : screenName == "IDS_COMMENTS" ?
                        <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_TESTCOMMENTS"} tabDetail={this.commentTabDetail()} destroyInactiveTabPane={true} onTabChange={this.onTabChange} />
                        : screenName == "IDS_HISTORY" ?
                            <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_TIMEPOINTHISTORY"} tabDetail={this.historyTabDetail()} destroyInactiveTabPane={true} onTabChange={this.onTabChange} />
                            : screenName == "IDS_STABILITYDETAILS" ?
                                this.props.Login.masterData.selectedStabilityStudyPlan && this.props.Login.masterData.selectedStabilityStudyPlan.length === 1 ?
                                    <SampleInfoView
                                        data={(this.props.Login.masterData.selectedStabilityStudyPlan && this.props.Login.masterData.selectedStabilityStudyPlan.length > 0) ?
                                            this.props.Login.masterData.selectedStabilityStudyPlan[this.props.Login.masterData.selectedStabilityStudyPlan.length - 1] : {}}
                                        SingleItem={this.props.Login.masterData.selectedStabilityStudyPlan && this.props.Login.masterData.selectedStabilityStudyPlan ?
                                            this.state.SingleItem : []}
                                        screenName="IDS_SAMPLEINFO"
                                        userInfo={this.props.Login.userInfo}
                                        viewFile={this.viewFile}

                                    />
                                    :
                                    <SampleGridTab
                                        userInfo={this.props.Login.masterData.userInfo || {}}
                                        GridData={this.props.Login.masterData.selectedStabilityStudyPlan || []}
                                        masterData={this.props.Login.masterData}
                                        inputParam={this.props.Login.inputParam}
                                        //dataState={sampleGridSkip === 0 ? {...this.state.sampleGridDataState, skip:0} : this.state.sampleGridDataState}
                                        dataState={this.state.sampleGridDataState}
                                        dataStateChange={this.sampleInfoDataStateChange}
                                        extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem) || []}
                                        detailedFieldList={this.gridfillingColumn(this.state.DynamicGridMoreField) || []}
                                        primaryKeyField={"nstbstudyplancode"}
                                        expandField="expanded"
                                        screenName="IDS_SAMPLEINFO"
                                        viewFile={this.viewFile}
                                    //jsonField={"jsondata"}
                                    />
                                :
                                screenName == "IDS_OUTSOURCEDETAILS" ?
                                    <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_OUTSOURCE"} tabDetail={this.outSourceTabDetail()} destroyInactiveTabPane={true} onTabChange={this.onTabChange} />
                                    : ""
        )
    }

    historyTabDetail = () => {
        const historyTabMap = new Map();
        let historyExtractedColumnList = [];
        historyExtractedColumnList.push({ "idsName": "IDS_ARNO", "dataField": "sarno", "width": "150px" });
        historyExtractedColumnList.push(
            { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "200px" },
            { "idsName": "IDS_TRANSACTIONDATE", "dataField": "stransactiondate", "width": "200px" },
            { "idsName": "IDS_USER", "dataField": "susername", "width": "200px" },
            { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" }
        );
        historyTabMap.set("IDS_TIMEPOINTHISTORY",
         <DataGrid
            primaryKeyField={"nreghistorycode"}
            data={this.props.Login.masterData.RegistrationSampleHistory}
            dataResult={process(this.props.Login.masterData.RegistrationSampleHistory || [], this.state.registrationTestHistoryDataState)}
            dataState={this.state.registrationTestHistoryDataState}
            dataStateChange={this.testDataStateChange}
            extractedColumnList={historyExtractedColumnList}
            inputParam={this.props.Login.inputParam}
            userInfo={this.props.Login.userInfo}
            isRefreshRequired={false}
            pageable={true}
            scrollable={'scrollable'}
            gridHeight={'600px'}
            isActionRequired={false}
            isToolBarRequired={false}
            selectedId={false}
        />
        )
        return historyTabMap;
    }

    testDataStateChange = (event) => {
        switch (this.props.Login.activeTestTab) {
            case "IDS_TIMEPOINTRESULTS":
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
            case "IDS_TIMEPOINTHISTORY":
                this.setState({
                    registrationTestHistoryDataState: event.dataState
                });
                break;
            default:
                this.setState({
                    resultDataState: event.dataState
                });
                break;
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
        let TestCombined = this.props.Login.TestCombined;
        let selectedPrinterData = this.props.Login.selectedPrinterData;
        let multiFilterLoad = this.props.Login.multiFilterLoad;

        let outsourcetest = this.props.Login.outsourcetest;

        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "accept" || this.props.Login.operation === "cancel" || this.props.Login.operation === "quarantine") {
                loadEsign = false;
                openModal = false;
                openChildModal = false
                loadPreregister = false;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { loadEsign, openModal, openChildModal, loadPreregister }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                loadEsign = false;
                selectedRecord["esigncomments"] = "";
                selectedRecord["esignpassword"] = "";
                selectedRecord['esignreason'] = '';

                if (loadPreregister) {
                    parentPopUpSize = 'xl';
                    openPortal = true;
                    openModal = false;
                }
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign, parentPopUpSize, openPortal, openModal, selectedRecord,
                        outsourcetest
                    }
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
            subSampleDataGridList = [];
            selectedPrinterData = {};
            multiFilterLoad = false;

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openModal, loadPreregister, selectedRecord,
                    screenName, insertSourcePreregno: undefined, multiFilterLoad,
                    loadPrinter, openPortal,
                    Component, subSampleDataGridList, selectedPrinterData, outsourcetest
                }
            }
            this.props.updateStore(updateInfo);
        }
    }

    closeChildModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let loadRegSubSample = this.props.Login.loadRegSubSample;
        let loadFile = this.props.Login.loadFile;
        let showSaveContinue = this.props.Login.showSaveContinue;
        let screenName = this.props.Login.screenName;
        let loadChildTest = this.props.Login.loadChildTest;
        let loadAdhocTest = this.props.Login.loadAdhocTest;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.state.selectedRecord;
        let TestCombined = [];
        let TestPackage = [];
        let availableTest = [];
        let Test = this.props.Login.Test || [];
        let selectedMaster = this.props.Login.selectedMaster;
        let selectedControl = this.props.Login.selectedControl;
        let masterextractedColumnList = this.props.Login.masterextractedColumnList;
        let masterfieldList = this.props.Login.masterfieldList;
        let masterdataList = this.props.Login.masterfieldList;
        let mastercomboComponents = this.props.Login.masterfieldList;
        let masterwithoutCombocomponent = this.props.Login.masterfieldList;
        let masterComboColumnFiled = this.props.Login.masterComboColumnFiled;
        let masterOperation = this.props.Login.masterOperation
        let masterEditObject = this.props.Login.masterEditObject
        let masterDesign = this.props.Login.masterDesign;
        let addMaster = this.props.Login.addMaster
        let masterIndex = this.props.Login.masterIndex
        let availableAdhocTest = [];

        if (this.props.Login.loadEsign) {
            loadEsign = false;
            selectedRecord["esigncomments"] = "";
            selectedRecord["esignpassword"] = "";
            selectedRecord['esignreason'] = '';
        }

        if (addMaster) {
            if (masterIndex !== 0) {
                screenName = selectedControl[masterIndex - 1].displayname[this.props.Login.userInfo.slanguagetypecode]
                selectedMaster = removeIndex(selectedMaster, masterIndex)
                selectedControl = removeIndex(selectedControl, masterIndex)
                masterextractedColumnList = masterextractedColumnList && removeIndex(masterextractedColumnList, masterIndex)
                masterfieldList = masterfieldList && removeIndex(masterfieldList, masterIndex)
                masterdataList = masterdataList && removeIndex(masterdataList, masterIndex)
                mastercomboComponents = mastercomboComponents && removeIndex(mastercomboComponents, masterIndex)
                masterComboColumnFiled = masterComboColumnFiled && removeIndex(masterComboColumnFiled, masterIndex)
                masterwithoutCombocomponent = masterwithoutCombocomponent && removeIndex(masterwithoutCombocomponent, masterIndex)
                masterDesign = masterDesign && removeIndex(masterDesign, masterIndex)
                masterOperation = masterOperation && removeIndex(masterOperation, masterIndex)
                masterEditObject = masterEditObject && removeIndex(masterEditObject, masterIndex)
                masterIndex = masterIndex - 1;
            } else {
                selectedMaster = []
                selectedControl = []
                masterextractedColumnList = []
                masterfieldList = []
                addMaster = false
                masterdataList = []
                mastercomboComponents = []
                masterwithoutCombocomponent = []
                masterComboColumnFiled = []
                masterDesign = []
                masterOperation = []
                masterEditObject = []
                masterIndex = undefined
                screenName = this.props.Login.inputParam.displayName
            }
        }
        else if (this.props.Login.loadFile) {
            loadFile = false;
            screenName = this.props.Login.PopUpLabel
        } else if (this.props.Login.loadChildTest) {
            loadChildTest = false;
            openModal = false;
            selectedRecord = {};
            TestCombined = [];
            TestPackage = [];
            availableTest = [];
            Test = [];

        }
        else if (this.props.Login.loadRegSubSample) {
            loadRegSubSample = false;
            openModal = false;
            selectedRecord = {}
            TestCombined = [];
            TestPackage = [];
            availableTest = [];
            Test = [];



        }
        else if (this.props.Login.loadAdhocTest) {
            if (this.props.Login.loadEsign) {
                loadEsign = false;
            }
            else {

                loadAdhocTest = false;
                openModal = false;
                selectedRecord = {};
                availableAdhocTest = [];
            }

        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadRegSubSample, screenName, showSaveContinue,
                loadFile, loadChildTest, loadAdhocTest,
                openModal,
                selectedRecord, TestCombined,
                TestPackage, availableTest, Test,
                selectedMaster, selectedControl,
                masterextractedColumnList, masterfieldList
                , addMaster, masterIndex, masterdataList,
                mastercomboComponents,
                masterwithoutCombocomponent, masterOperation,
                masterEditObject,
                masterComboColumnFiled, masterDesign, loadEsign
            }
        }
        this.props.updateStore(updateInfo);
    }

        onTabChange = (tabProps) => {
            const activeTestTab = tabProps.screenName;
            const tabseqno = tabProps.tabSequence;
            if (tabseqno === SideBarSeqno.TEST) {
                let inputData = {
                    masterData: this.props.Login.masterData,
                    selectedStbTimePointTest: this.props.Login.masterData.selectedStbTimePointTest,
                   nstbtimepointcode: this.props.Login.masterData.selectedStbTimePoint ?
                   String(this.props.Login.masterData.selectedStbTimePoint.map(item => item.nstbtimepointcode).join(",")) : "-1",
                    nstbstudyplancode: this.props.Login.masterData.selectedStabilityStudyPlan ?
                        this.props.Login.masterData.selectedStabilityStudyPlan.map(item => item.nstbstudyplancode).join(",") : "-1",
                    userinfo: this.props.Login.userInfo,
                    activeTestTab,
                    screenName: activeTestTab,
                    resultDataState: this.state.resultDataState,
                    testCommentDataState: this.state.testCommentDataState,
                    testAttachmentDataState: this.state.testAttachmentDataState,
                    activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex,
                    activeTabId: tabProps.activeTabId ? tabProps.activeTabId : this.state.activeTabId,
                    registrationTestHistoryDataState: this.state.registrationTestHistoryDataState
                }
                this.props.getTestDetailFromRegistration(inputData, true)
                // } 
                // else {
                //     toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))
                // }
            }
            else if (tabseqno === SideBarSeqno.SUBSAMPLE) {
                if (activeTestTab !== this.props.Login.activeTestTab) {
                    let inputData = {
                        masterData: this.props.Login.masterData,
                        selectedStbTimePoint: this.props.Login.masterData.selectedStbTimePoint,
                        nstbtimepointcode: this.props.Login.masterData.selectedStbTimePoint ? this.props.Login.masterData.selectedStbTimePoint.map(item => item.nstbtimepointcode).join(",") : "-1",
                        userinfo: this.props.Login.userInfo,
                        screenName: activeTestTab,
                        activeSubSampleTab: activeTestTab,
                        subSampleCommentDataState: this.state.subSampleCommentDataState,
                        subSampleAttachmentDataState: this.state.subSampleAttachmentDataState,
                        nstbstudyplancode: this.props.Login.masterData.selectedStabilityStudyPlan &&
                            this.props.Login.masterData.selectedStabilityStudyPlan.map(item => item.nstbstudyplancode).join(","),
                        activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex,
                    }
                    this.props.getSubSampleChildTabDetail(inputData)
                }
            }
            else {
    
                if (activeTestTab !== this.props.Login.activeTestTab) {
                    let inputData = {
                        masterData: this.props.Login.masterData,
                        selectedStabilityStudyPlan: this.props.Login.masterData.selectedStabilityStudyPlan,
                        nstbstudyplancode: this.props.Login.masterData.selectedStabilityStudyPlan ? this.props.Login.masterData.selectedStabilityStudyPlan.map(item => item.nstbstudyplancode).join(",") : "-1",
                        userinfo: this.props.Login.userInfo,
                        screenName: activeTestTab,
                        activeSampleTab: activeTestTab,
                        OrderCodeData: this.props.Login.masterData.selectedStabilityStudyPlan &&
                            this.props.Login.masterData.selectedStabilityStudyPlan.map(item => item.hasOwnProperty("OrderCodeData") ? item.OrderCodeData : -1).join(","),
                        activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex,
                    }
                    this.props.getSampleChildTabDetail(inputData)
                }
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
                regchildSubSampleColumnList: this.props.Login.regchildSubSampleColumnList,
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
        if (this.props.Login.selectedDetailField !== previousProps.Login.selectedDetailField) {
            this.setState({ selectedDetailField: this.props.Login.selectedDetailField });
        }
        if (this.props.Login.selectedMaster !== previousProps.Login.selectedMaster) {
            this.setState({ selectedMaster: this.props.Login.selectedMaster });
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
        if (this.props.Login.transactionValidation !== this.props.Login.masterData.TransactionValidation) {
            this.props.Login.transactionValidation = this.props.Login.masterData.TransactionValidation
        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            const specBasedTestPackage = this.props.Login.userRoleControlRights &&
                this.props.Login.userRoleControlRights[formCode.TESTPACKAGE] !== undefined ? true : false

            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

            const deleteTestId = controlMap.has("DeleteTest") ? controlMap.get("DeleteTest").ncontrolcode : -1;
            const studyPlanId = controlMap.has("AddStabilityStudyPlan") ? controlMap.get("AddStabilityStudyPlan").ncontrolcode : -1;
            const editstudyPlanId = controlMap.has("EditStabilityStudyPlan") ? controlMap.get("EditStabilityStudyPlan").ncontrolcode : -1;
            const deleteStudyPlanId = controlMap.has("DeleteStabilityStudyPlan") ? controlMap.get("DeleteStabilityStudyPlan").ncontrolcode : -1;
            const addTestId = controlMap.has("AddTest") ? controlMap.get("AddTest").ncontrolcode : -1;

            const approevStudyPlanId = controlMap.has("ApproveStabilityStudyPlan") ? controlMap.get("ApproveStabilityStudyPlan").ncontrolcode : -1;

            const addTimePointId = controlMap.has("AddTimePoint") ? controlMap.get("AddTimePoint").ncontrolcode : -1;
            const editTimePointId = controlMap.has("EditTimePoint") ? controlMap.get("EditTimePoint").ncontrolcode : -1;
            const deleteTimePointId = controlMap.has("DeleteTimePoint") ? controlMap.get("DeleteTimePoint").ncontrolcode : -1;


            const exportTemplateId = controlMap.has("Export Template") ? controlMap.get("Export Template").ncontrolcode : -1;
            const importTemplateId = controlMap.has("Import Template") ? controlMap.get("Import Template").ncontrolcode : -1;


            this.setState({
                userRoleControlRights, controlMap, deleteTestId, approevStudyPlanId,
                studyPlanId, editstudyPlanId, deleteStudyPlanId, addTestId, addTimePointId, editTimePointId, deleteTimePointId, specBasedTestPackage
                , exportTemplateId, importTemplateId
            });

        }
        let activeTabIndex = this.state.activeTabIndex || undefined;
        let activeTabId = this.state.activeTabId || undefined;



        if (this.props.Login.activeTabIndex !== previousProps.Login.activeTabIndex || this.props.Login.masterData !== previousProps.Login.masterData) {


            let { skip, take, testskip, testtake, subsampleskip, subsampletake, testCommentDataState,
                resultDataState, sampleGridDataState, popUptestDataState, DynamicSampleColumns, DynamicSubSampleColumns,
                DynamicTestColumns, DynamicGridItem, DynamicGridMoreField, SingleItem, testMoreField, testListColumns,
                SubSampleDynamicGridItem, SubSampleDynamicGridMoreField, SubSampleSingleItem, sampleSearchField, subsampleSearchField,
                testSearchField, testAttachmentDataState, registrationTestHistoryDataState, sampleCommentDataState,
                sampledateconstraints, subsampledateconstraints, activeTabIndex,
                activeTabId, sampleCombinationUnique, subsampleCombinationUnique,
                addedOrderSampleList, sampleexportfields, subsampleexportfields, samplefilteritem, sampledisplayfields } = this.state

            addedOrderSampleList = [];

            if (this.props.Login.activeTabIndex !== previousProps.Login.activeTabIndex) {
                activeTabIndex = this.props.Login.activeTabIndex;
                activeTabId = this.props.Login.activeTabId;
            }

            if (this.props.Login.masterData.DynamicDesign && this.props.Login.masterData.DynamicDesign !== previousProps.Login.masterData.DynamicDesign) {
                const dynamicColumn = JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata.value)
                DynamicSampleColumns = dynamicColumn.samplelistitem ? dynamicColumn.samplelistitem : [];
                DynamicSubSampleColumns = dynamicColumn.subsamplelistitem ? dynamicColumn.subsamplelistitem : [];
                DynamicTestColumns = dynamicColumn.testlistitem ? dynamicColumn.testlistitem : []

                DynamicGridItem = dynamicColumn.samplegriditem ? dynamicColumn.samplegriditem.filter(x => x[2] !== 'sarno') : [];

                DynamicGridMoreField = dynamicColumn.samplegridmoreitem ? dynamicColumn.samplegridmoreitem : [];

                SingleItem = dynamicColumn.sampledisplayfields ? dynamicColumn.sampledisplayfields.filter(x => !['sarno', 'dregdate'].includes(x[2]))  : [];

                SubSampleDynamicGridItem = dynamicColumn.subsamplegriditem ? dynamicColumn.subsamplegriditem : [];
                SubSampleDynamicGridMoreField = dynamicColumn.subsamplegridmoreitem ? dynamicColumn.subsamplegridmoreitem : [];
                SubSampleSingleItem = dynamicColumn.subsampledisplayfields ? dynamicColumn.subsampledisplayfields : [];
                testMoreField = dynamicColumn.testListFields && dynamicColumn.testListFields.testlistmoreitems ? dynamicColumn.testListFields.testlistmoreitems : [];

                testListColumns = dynamicColumn.testListFields && dynamicColumn.testListFields.testlistitem 
                ? dynamicColumn.testListFields.testlistitem.filter(x => !['sarno', 'AnalyserName','ssamplearno'].includes(x[2]))  : [];
                sampleSearchField = dynamicColumn.samplesearchfields ? dynamicColumn.samplesearchfields.filter(x => !['dregdate','sarno','sspecname'].includes(x))   : [];

                subsampleSearchField = dynamicColumn.subsamplesearchfields ? dynamicColumn.subsamplesearchfields.filter(x => !['sarno','ssamplearno'].includes(x)) : [];
                testSearchField = dynamicColumn.testListFields && dynamicColumn.testListFields.testsearchfields ? dynamicColumn.testListFields.testsearchfields : [];
                sampledateconstraints = dynamicColumn.sampledateconstraints || [];
                subsampledateconstraints = dynamicColumn.subsampledateconstraints || [];
                sampleCombinationUnique = dynamicColumn.samplecombinationunique || [];
                subsampleCombinationUnique = dynamicColumn.subsamplecombinationunique || [];
                sampleexportfields = dynamicColumn.sampleExportFields || [];
                subsampleexportfields = dynamicColumn.subSampleExportFields || [];
                samplefilteritem = dynamicColumn.samplefilteritem || [];
                sampledisplayfields =dynamicColumn.sampledisplayfields ? dynamicColumn.sampledisplayfields.filter(x => !['dregdate','sarno'].includes(x[2]))  : [];

                // specBasedComponent = true;

                this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample &&
                    this.props.Login.masterData.StabilityStudyPlanGet.length > 0 &&
                    (this.props.Login.masterData.StabilityStudyPlanGet[0].ncomponentrequired === transactionStatus.YES) &&
                    DynamicSubSampleColumns.push({
                        1: { 'en-US': 'Specimen', 'ru-RU': 'Образец', 'tg-TG': 'Намуна' },
                        2: "scomponentname"
                    }

                    );
                if (this.props.Login.masterData.RealSampleTypeValue &&
                    this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
                    DynamicSubSampleColumns.push(
                        {
                            1: { 'en-US': 'Order Type', 'ru-RU': 'Тип заказа', 'tg-TG': 'Навъи фармоиш' },
                            2: "sordertypename"
                        }
                    );
                }
            }

            let showSample = this.props.Login.showSample === this.state.showTest || this.state.showSample
            let showTest = showSample ? false : true
            let stateSampleType = this.state.stateSampleType
            let stateRegistrationType = this.state.stateRegistrationType
            let stateRegistrationSubType = this.state.stateRegistrationSubType
            let stateFilterStatus = this.state.stateFilterStatus
            let stateDynamicDesign = this.state.stateDynamicDesign
            let stateApprovalConfigVersion = this.state.stateApprovalConfigVersion

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
            if (this.props.Login.masterData.ApprovalConfigVersion !== previousProps.Login.masterData.ApprovalConfigVersion) {
                const DesignTemplateMappingMap = constructOptionList(this.props.Login.masterData.ApprovalConfigVersion || [], "napproveconfversioncode",
                    "sversionname", undefined, undefined, false);

                stateApprovalConfigVersion = DesignTemplateMappingMap.get("OptionList")
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
            if (this.props.Login.registrationTestHistoryDataState && this.props.Login.registrationTestHistoryDataState !== previousProps.Login.registrationTestHistoryDataState) {
                registrationTestHistoryDataState = this.props.Login.registrationTestHistoryDataState;
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
                nregtypecode: this.props.Login.masterData.RealRegTypeValue &&
                    this.props.Login.masterData.RealRegTypeValue.nregtypecode || -1,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue &&
                    this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode || -1,
                nstbstudyplancode: this.props.Login.masterData.selectedStabilityStudyPlan &&
                    this.props.Login.masterData.selectedStabilityStudyPlan.map(sample => sample.nstbstudyplancode).join(","),
                sfromdate: this.props.Login.masterData.RealFromDate,
                stodate: this.props.Login.masterData.RealToDate,
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
                nstbstudyplancode: this.props.Login.masterData.selectedStabilityStudyPlan && this.props.Login.masterData.selectedStabilityStudyPlan.map(sample => sample.nstbstudyplancode).join(","),
                nstbtimepointcode: this.props.Login.masterData.selectedStbTimePoint &&
                    this.props.Login.masterData.selectedStbTimePoint.map(sample => sample.nstbtimepointcode).join(","),
                sfromdate: this.props.Login.masterData.RealFromDate,
                stodate: this.props.Login.masterData.RealToDate,
                // resultDataState: resultDataState,
                // testCommentDataState: testCommentDataState,
                ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                activeTabIndex: this.state.enableAutoClick ? 1 : this.state.activeTabIndex ? this.state.activeTabIndex : undefined,

            }
            const subSampleGetParam = {
                masterData: this.props.Login.masterData,
                ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                userinfo: this.props.Login.userInfo,
                nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,

                ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                    && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedsubsample
            }
            const filterSampleParam = {
                inputListName: "StabilityStudyPlanGet",
                selectedObject: "selectedStabilityStudyPlan",
                primaryKeyField: "nstbstudyplancode",
                fetchUrl: "stabilitystudyplan/getRegistrationSubSample",
                isMultiSort: true,
                multiSortData: [{ pkey: 'nstbtimepointcode', list: 'StbTimePointGet' },
                { pkey: 'nstbtimepointtestcode', list: 'StbTimePointTestGet' }],
                skip: 0,
                take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
                subsampleskip: 0,
                subsampletake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
                testskip: 0,
                testtake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
                fecthInputObject: {
                    masterData: this.props.Login.masterData,
                    userinfo: this.props.Login.userInfo,
                    ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                    nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                    ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                        && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                    nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                    nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
                },
                masterData: this.props.Login.masterData,
                searchFieldList: sampleSearchField,
                changeList: [
                    "StbTimePointGet", "StbTimePointTestGet",
                    "selectedStabilityStudyPlan", "selectedStbTimePoint",
                    "selectedStbTimePointTest"
                ]
            };

            const filterSubSampleParam = {
                inputListName: "StbTimePointGet",
                selectedObject: "selectedStbTimePoint",
                primaryKeyField: "nstbtimepointcode",
                fetchUrl: "stabilitystudyplan/getRegistrationTest",
                skip: this.state.skip,
                take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
                subsampleskip: 0,
                subsampletake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
                testskip: 0,
                testtake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
                isMultiSort: true,
                multiSortData: [{ pkey: 'nstbtimepointtestcode', list: 'StbTimePointTestGet' }],
                fecthInputObject: {
                    masterData: this.props.Login.masterData,
                    userinfo: this.props.Login.userInfo,
                    nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                    nstbstudyplancode: this.props.Login.masterData.selectedStabilityStudyPlan &&
                        this.props.Login.masterData.selectedStabilityStudyPlan.length > 0 ?
                        this.props.Login.masterData.selectedStabilityStudyPlan.map(x => x.nstbstudyplancode).join(",") : "-1",
                    ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                        && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                    nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                    nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
                },
                masterData: this.props.Login.masterData,
                searchFieldList: subsampleSearchField,
                changeList: [
                    "StbTimePointTestGet", "selectedStbTimePoint", "selectedStbTimePointTest"
                ]
            };

            const filterTestParam = {
                inputListName: "StbTimePointTestGet",
                selectedObject: "selectedStbTimePointTest",
                primaryKeyField: "nstbtimepointtestcode",
                //fetchUrl: this.getActiveTestURL(),
                skip: this.state.skip,
                take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
                subsampleskip: this.state.subsampleskip,
                subsampletake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
                testskip: 0,
                testtake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,

                fecthInputObject: {
                    nstbtimepointtestcode: this.props.Login.masterData && this.props.Login.masterData.selectedStbTimePointTest && this.props.Login.masterData.selectedStbTimePointTest ? this.props.Login.masterData.selectedStbTimePointTest.map(test => test.nstbtimepointtestcode).join(",") : "-1",
                    userinfo: this.props.Login.userInfo,
                    ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                        && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                    nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                    nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
                },
                masterData: this.props.Login.masterData,
                searchFieldList: ['sarno', 'ssectionname', 'stestsynonym', 'stransdisplaystatus'],
                isService: true
            }
            const editRegParam = {
                nfilterstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                userinfo: this.props.Login.userInfo,
                nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                sfromdate: this.props.Login.masterData.RealFromDate,
                stodate: this.props.Login.masterData.RealToDate,
                ndesigntemplatemappingcode: this.props.Login.masterData
                    && this.props.Login.masterData.ndesigntemplatemappingcode,
                nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                nneedsubsample: this.props.Login.masterData.RegSubTypeValue &&
                    this.props.Login.masterData.RegSubTypeValue.nneedsubsample, //=== true
                //? transactionStatus.YES:transactionStatus.NO :transactionStatus.NO,
                activeTestTab: this.props.Login.activeTestTab || "IDS_TIMEPOINTRESULTS",
                activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                // checkBoxOperation: 3
                checkBoxOperation: checkBoxOperation.SINGLESELECT

            }

            const editSubSampleRegParam = {
                nfilterstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                userinfo: this.props.Login.userInfo,
                nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                sfromdate: this.props.Login.masterData.RealFromDate,
                stodate: this.props.Login.masterData.RealToDate,
                ndesigntemplatemappingcode: this.props.Login.masterData
                    && this.props.Login.masterData.ndesigntemplatemappingcode,
                nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,

                activeTestTab: this.props.Login.activeTestTab || "IDS_TIMEPOINTRESULTS",
                activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
            }

            const addTestParam = {
                selectedStabilityStudyPlan: this.props.Login.masterData.selectedStabilityStudyPlan,
                selectedStbTimePoint: this.props.Login.masterData.selectedStbTimePoint,
                // skip: skip, take: (skip + take),
                userinfo: this.props.Login.userInfo,
                sampleList: this.props.Login.masterData.StabilityStudyPlanGet,
                subsampleList: this.props.Login.masterData.StbTimePointGet,
                snspecsampletypecode: this.props.Login.masterData.selectedStbTimePoint &&
                    [...new Set(this.props.Login.masterData.selectedStbTimePoint.map(x => x.nspecsampletypecode))].join(",")
            };

            const breadCrumbobj = convertDateValuetoString(this.props.Login.masterData.RealFromDate, this.props.Login.masterData.RealToDate, this.props.Login.userInfo)
            this.breadCrumbData = [
                {
                    "label": "IDS_FROM",
                    "value": breadCrumbobj.breadCrumbFrom
                }, {
                    "label": "IDS_TO",
                    "value": breadCrumbobj.breadCrumbto
                },
                {
                    "label": "IDS_REGTYPE",
                    "value": this.props.Login.masterData.RealRegTypeValue
                        && this.props.Login.masterData.RealRegTypeValue.sregtypename
                }, {
                    "label": "IDS_REGSUBTYPE",
                    "value": this.props.Login.masterData.RealRegSubTypeValue
                        && this.props.Login.masterData.RealRegSubTypeValue.sregsubtypename
                },
                {
                    "label": "IDS_SAMPLESTATUS",
                    "value": this.props.Login.masterData.RealFilterStatusValue
                        && this.props.Login.masterData.RealFilterStatusValue.stransdisplaystatus
                }
            ]


            if (this.props.Login.masterData.approvedTreeData !== previousProps.Login.masterData.approvedTreeData) {
                if (this.props.Login.masterData.approvedTreeData && this.props.Login.masterData.approvedTreeData !== undefined) {
                    this.setState({
                        treeData: this.props.Login.masterData.approvedTreeData
                    });
                }
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
                stateApprovalConfigVersion,
                popUptestDataState,
                showSample, showTest, skip, take, testskip,
                subsampleskip, subsampletake,
                testtake, testCommentDataState, testAttachmentDataState, registrationTestHistoryDataState,
                resultDataState, sampleGridDataState,
                SubSampleDynamicGridItem, SubSampleDynamicGridMoreField,
                SubSampleSingleItem,
                testGetParam, testChildGetParam, subSampleGetParam,
                filterSampleParam, filterTestParam,
                editRegParam, editSubSampleRegParam,
                addTestParam, sampleSearchField, subsampleSearchField,
                testSearchField, filterSubSampleParam, sampledateconstraints, subsampledateconstraints,
                activeTabIndex, activeTabId, sampleCombinationUnique, subsampleCombinationUnique, addedOrderSampleList,
                sampleexportfields, subsampleexportfields, samplefilteritem, sampledisplayfields

            })
        }
    }

    onSaveChildTestClick = (saveType, formRef) => {
        const masterData = this.props.Login.masterData;

        //console.log("test1:", this.props.Login.masterData);

        let sampleList = [];
        const skip = this.state.skip;
        const take = this.state.take;
        if (this.props.Login.masterData.searchedSample !== undefined) {
            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.StabilityStudyPlanGet;

            sampleList = list ? list.slice(skip, skip + take) : [];
        } else {
            sampleList = this.props.Login.masterData.StabilityStudyPlanGet && sortDataForDate(this.props.Login.masterData.StabilityStudyPlanGet, 'dtransactiondate', 'nstbstudyplancode').slice(skip, skip + take);
        }
        const selectedStabilityStudyPlan = getSameRecordFromTwoArrays(masterData.selectedStabilityStudyPlan, sampleList, "nstbstudyplancode");


        let subsampleList = [];
        const subsampleskip = this.state.subsampleskip;
        const subsampletake = this.state.subsampletake;
        if (this.props.Login.masterData.searchedSubSample !== undefined) {
            const list = this.props.Login.masterData.searchedSubSample ? this.props.Login.masterData.searchedSubSample
                : this.props.Login.masterData.StbTimePointGet;

            subsampleList = list ? list.slice(subsampleskip, subsampleskip + subsampletake) : [];
        } else {
            subsampleList = this.props.Login.masterData.StbTimePointGet && this.props.Login.masterData.StbTimePointGet.slice(subsampleskip, subsampleskip + subsampletake);
        }
        const selectedStbTimePoint = getSameRecordFromTwoArrays(masterData.selectedStbTimePoint, subsampleList, "nstbstudyplancode");


        //const selectedStbTimePoint = getSameRecordFromTwoArrays(masterData.selectedStbTimePoint, masterData.StbTimePointGet.slice(this.state.subsampleskip, (this.state.subsampleskip + this.state.subsampletake)), "nstbstudyplancode");
        //const selectedStabilityStudyPlan = getSameRecordFromTwoArrays(masterData.selectedStabilityStudyPlan, masterData.StabilityStudyPlanGet.slice(this.state.skip, (this.state.skip + this.state.take)), "nstbstudyplancode");
        ////  selectedStbTimePoint =masterData.selectedStbTimePoint.slice(this.state.skip, (this.state.skip + this.state.take));


        const nstbtimepointcode = selectedStbTimePoint.map(x => x.nstbtimepointcode).join(",");
        let data = [];

        let obj = convertDateValuetoString(this.props.Login.masterData.RealFromDate,
            this.props.Login.masterData.RealToDate, this.props.Login.userInfo);

        // if (this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {

        //     const Layout = this.props.Login.masterData.registrationTemplate.jsondata;
        //     const cTWithoutComboData = []
        //     let cTData = [];


        //     Layout.map(row => {
        //         return row.children.map(column => {
        //             return column.children.map(component => {
        //                 return component.hasOwnProperty("children") ?
        //                     component.children.map(componentrow => {
        //                         if (componentrow.inputtype === "combo") {
        //                             cTData.push(componentrow)
        //                         } else {
        //                             cTWithoutComboData.push(componentrow)
        //                         }
        //                         return null;
        //                     })
        //                     : component.inputtype === "combo" ?
        //                         cTData.push(component) : cTWithoutComboData.push(component)
        //             })
        //         })

        //     })
        //     selectedStabilityStudyPlan.map(item => {
        //         let dob = cTWithoutComboData.filter(x => x.name === "Date Of Birth")
        //         let gender = cTData.filter(x => x.name === "Gender")
        //         const ageCal = parseInt(ageCalculate(item[dob[0].label], true));
        //         data.push({ "nstbstudyplancode": parseInt(item.nstbstudyplancode), "nage": ageCal, "ngendercode": item.ngendercode })
        //     }
        //     )

        // }
        const inputData = {
            //nneedjoballocation: masterData.RealRegSubTypeValue.nneedjoballocation ? masterData.RealRegSubTypeValue.nneedjoballocation : false,
            //nneedmyjob: masterData.RealRegSubTypeValue.nneedmyjob ? masterData.RealRegSubTypeValue.nneedmyjob : false,
            TestGroupTest: this.state.selectedRecord.ntestgrouptestcode.map(value => value.item),
            StbTimePoint: selectedStbTimePoint.map(x => x.nstbtimepointcode),
            nstbtimepointcode: nstbtimepointcode,
            userinfo: this.props.Login.userInfo,
            nregtypecode: masterData.RealRegTypeValue && masterData.RealRegTypeValue.nregtypecode || -1,
            nregsubtypecode: masterData.RealRegSubTypeValue && masterData.RealRegSubTypeValue.nregsubtypecode || -1,
            nsampletypecode: masterData.RealSampleTypeValue && masterData.RealSampleTypeValue.nsampletypecode || -1,
            ntype: 3,
            nfilterstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
            nstbstudyplancode: selectedStabilityStudyPlan &&
                selectedStabilityStudyPlan.map(sample => sample.nstbstudyplancode).join(","),
            // nstbtimepointcode: selectedStbTimePoint &&
            // selectedStbTimePoint.map(sample => sample.nstbtimepointcode).join(","),
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            ndesigntemplatemappingcode: this.props.Login.masterData
                && this.props.Login.masterData.ndesigntemplatemappingcode,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow || -1,
            nneedsubsample: true,
            //  checkBoxOperation: 3,
            //checkBoxOperation: checkBoxOperation.SINGLESELECT,
            napproveconfversioncode: this.props.Login.masterData.RealApprovalConfigVersionValue
                && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode || -1,
            // activeTestTab: this.props.Login.activeTestTab || "IDS_TIMEPOINTRESULTS",
            // activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
            // activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
            ageData: data,
            nsampletypecode: 9,
            ntestpackagecode: this.state.selectedRecord['ntestpackagecode'] && this.state.selectedRecord['ntestpackagecode'],
            skipmethodvalidity: false,
            loadAdhocTest: false
        }


        const inputParam = {
            inputData,
            classUrl: "stabilitystudyplan",
            operation: this.props.Login.operation,
            methodUrl: "Test",
            responseKeyList: [
                { "responseKey": "selectedStabilityStudyPlan", "masterDataKey": "StabilityStudyPlanGet", "primaryKey": "nstbstudyplancode", "dataAction": "update" },
                { "responseKey": "selectedStbTimePoint", "masterDataKey": "StbTimePointGet", "primaryKey": "nstbtimepointcode", "dataAction": "update" },
                { "responseKey": "selectedStbTimePointTest", "masterDataKey": "StbTimePointTestGet", "primaryKey": "nstbtimepointtestcode", "dataAction": "add" }],
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
            this.props.createRegTest(inputParam, masterData, "openModal");
        }
    }

    onSaveTimePointClick = (saveType, formRef) => {
        const operation = this.props.Login.operation;
        if (operation === 'create') {
            let objSubSample = this.state.selectedRecord;
            const userInfo = this.props.Login.userInfo;
            let sampleList = [];
            if (this.props.Login.masterData.searchedSample !== undefined) {
                const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                    : sortDataForDate(this.props.Login.masterData.StabilityStudyPlanGet, 'dtransactiondate', 'nstbstudyplancode');

                sampleList = list ? list.slice(this.state.skip, this.state.skip + this.state.take) : [];
            } else {
                sampleList = this.props.Login.masterData.StabilityStudyPlanGet && sortDataForDate(this.props.Login.masterData.StabilityStudyPlanGet, 'dtransactiondate', 'nstbstudyplancode').slice(this.state.skip, this.state.skip + this.state.take);
            }
            sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.selectedStabilityStudyPlan, sampleList, 'nstbstudyplancode')

            const findSampleAlloSpec = [...new Set(sampleList.map(item => item.nallottedspeccode))];

            let selectedStbTimePointTestData = objSubSample["ntestgrouptestcode"];
            const selectedStbTimePointTestArray = [];
            selectedStbTimePointTestData && selectedStbTimePointTestData.map((item) => {
                return selectedStbTimePointTestArray.push(item.item);
            });
            const map = {}
            const param = getRegistrationSubSample(
                objSubSample,
                this.props.Login.masterData.SubSampleTemplate.jsondata,
                this.props.Login.userInfo, this.props.Login.defaulttimezone, false,
                this.props.Login.specBasedComponent, operation);

            map["StbTimePoint"] = param.sampleRegistration

            map["subsampleDateList"] = param.dateList
            map["StbTimePoint"]["nallottedspeccode"] = findSampleAlloSpec[0] ? findSampleAlloSpec[0] : -1;
            map["subsamplecombinationunique"] = this.state.subsampleCombinationUnique;
            map['subsampledateconstraints'] = this.state.subsampledateconstraints;
            map['testgrouptest'] = selectedStbTimePointTestArray
            map['nstbstudyplancode'] = sampleList.map(item => item.nstbstudyplancode).join(",")
            map['userinfo'] = userInfo;
            //map['checkBoxOperation'] = checkBoxOperation.SINGLESELECT;
            map['ntype'] = 3;
            map["ndesigntemplatemappingcode"] = this.props.Login.masterData
                && this.props.Login.masterData.ndesigntemplatemappingcode;
            map["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue
                && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode || -1;
            map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow || -1;
            map["nneedsubsample"] = true;
            // map["nneedjoballocation"] = this.props.Login.masterData.RegSubTypeValue
            //     && this.props.Login.masterData.RegSubTypeValue.nneedjoballocation;
            map["masterData"] = this.props.Login.masterData;
            // map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_TIMEPOINTRESULTS";
            // map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
            // map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
            map["specBasedComponent"] = this.props.Login.specBasedComponent;
            map["nsampletypecode"] = 9;
            map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode || -1;
            map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode || -1;
            map["skipmethodvalidity"] = false;
            const obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.FromDate,
                this.state.selectedFilter.todate || this.props.Login.masterData.ToDate, this.props.Login.userInfo)
            map["fromDate"] = "";
            map["toDate"] = "";
            map["nfilterstatus"] = this.props.Login.masterData.FilterStatusValue.ntransactionstatus;
            // map["loadAdhocTest"] = false;
            //map["nneedmyjob"] = this.props.Login.masterData.RealRegSubTypeValue.nneedmyjob ? this.props.Login.masterData.RealRegSubTypeValue.nneedmyjob : false;
            let isFileupload = false;
            const formData = new FormData();
            this.props.Login.regSubSamplewithoutCombocomponent.map((item) => {
                if (item.inputtype === 'files') {
                    if (typeof objSubSample[item && item.label] === "object") {
                        objSubSample[item && item.label] && objSubSample[item && item.label].forEach((item1, index) => {
                            formData.append("uploadedFile" + index, item1);
                            formData.append("uniquefilename" + index, map["StbTimePoint"].uniquefilename);
                            formData.append("filecount", objSubSample[item && item.label].length);
                            formData.append("isFileEdited", transactionStatus.YES);
                            formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                            delete (map["StbTimePoint"].uniquefilename);
                            delete (map["StbTimePoint"][item && item.label]);
                            formData.append('Map', Lims_JSON_stringify(JSON.stringify(map)));
                            isFileupload = true;
                        })
                    }
                }
            })

            const inputParam = {
                inputData: map,
                postParamList: this.postParamList,
                formData: formData, isFileupload
            }

            this.props.saveTimePoint(inputParam);
        } else {
            this.updateStbTimePoints(saveType, formRef, operation);
        }
    }

    updateStbTimePoints(saveType, formRef, operation, flag) {
        const inputData = { userinfo: this.props.Login.userInfo };

        let initialParam = {
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.RealRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
            nfilterstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
            ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,

            fromdate: "",
            todate: "",
            nstbstudyplancode: String(this.state.selectedRecord.nstbstudyplancode),
            nstbtimepointcode: String(this.state.selectedRecord.nstbtimepointcode),

        }

        inputData["initialparam"] = initialParam;
        const param = getRegistrationSubSample(
            this.state.selectedRecord,
            this.props.Login.masterData.SubSampleTemplate.jsondata,
            this.props.Login.userInfo, this.props.Login.defaulttimezone, false, this.props.Login.specBasedComponent,
            undefined, operation);

        inputData["StbTimePoint"] = param.sampleRegistration

        if (this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
            inputData["StbTimePoint"]['jsondata'] = { ...inputData["StbTimePoint"]['jsondata'], externalorderid: this.state.selectedRecord && this.state.selectedRecord.externalorderid }
            inputData["StbTimePoint"]['jsonuidata'] = { ...inputData["StbTimePoint"]['jsonuidata'], externalorderid: this.state.selectedRecord && this.state.selectedRecord.externalorderid }
        }
        inputData["SubSampleDateList"] = param.dateList
        inputData['subsampledateconstraints'] = this.state.subsampledateconstraints;
        inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
            && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
        inputData["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue
            && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode;
        inputData["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
            && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
        inputData["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
            && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
        inputData["subsamplecombinationunique"] = this.state.subsampleCombinationUnique;

        let isFileupload = false;
        const formData = new FormData();
        this.props.Login.withoutCombocomponent.map((item) => {
            if (item.inputtype === 'files') {
                if (typeof this.state.selectedRecord[item && item.label] === "object") {
                    this.state.selectedRecord[item && item.label] && this.state.selectedRecord[item && item.label].forEach((item1, index) => {
                        formData.append("uploadedFile" + index, item1);
                        formData.append("uniquefilename" + index, inputData["StbTimePoint"].uniquefilename);
                        formData.append("filecount", this.state.selectedRecord[item && item.label].length);
                        formData.append("isFileEdited", transactionStatus.YES);
                        formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                        // formDataValue={...map["StbTimePoint"].formData,formData};
                        delete (inputData["StbTimePoint"].uniquefilename);
                        delete (inputData["StbTimePoint"][item && item.label]);
                        formData.append('Map', Lims_JSON_stringify(JSON.stringify(inputData)));
                        isFileupload = true;
                    })
                }
            }
        })

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: operation, saveType, formRef,
            action: 'update',
            showConfirmAlert: false,
            resultDataState: this.state.resultDataState,
            testCommentDataState: this.state.testCommentDataState,
            testAttachmentDataState: this.state.testAttachmentDataState, formData: formData, isFileupload
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
            this.props.updateStbTimePoint(inputParam,
                this.props.Login.masterData, "openModal");
        }
    }

    approveRegistration = (registerId, skip, take) => {
        let sampleList = [];
        if (this.props.Login.masterData && this.props.Login.masterData.selectedStabilityStudyPlan.length > 0) {
            if (this.props.Login.masterData.selectedStbTimePoint
                !== undefined && this.props.Login.masterData.selectedStbTimePoint.length > 0) {
                if (this.props.Login.masterData.selectedStbTimePointTest
                    !== undefined && this.props.Login.masterData.selectedStbTimePointTest.length > 0) {
                    let Map = {};
                    Map["fromdate"] = "";
                    Map["todate"] = "";
                    Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
                    Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                    Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
                    Map["nportalrequired"] = this.props.Login.masterData.RealSampleTypeValue.nportalrequired;
                    Map["nfilterstatus"] = -1;
                    Map["nstbstudyplancode"] = this.props.Login.masterData &&
                        this.props.Login.masterData.selectedStabilityStudyPlan.map(sample => sample.nstbstudyplancode).join(",");
                    Map["userinfo"] = this.props.Login.userInfo;
                    Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                        && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;

                    Map["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue
                        && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode;
                    Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
                    Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
                    Map["nstbtimepointcode"] = this.props.Login.masterData.selectedStbTimePoint.map(x => x.nstbtimepointcode).join(",");
                    Map["nstbtimepointtestcode"] = this.props.Login.masterData.selectedStbTimePointTest.map(x => x.nstbtimepointtestcode).join(",");;
                    Map["url"] = this.props.Login.settings[24];
                    let inputParam = {
                        inputData: Map,
                        postParamList: this.postParamList,
                        action: 'accept'
                    }
                    this.confirmMessage.confirm(
                        this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                        this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                        this.props.intl.formatMessage({ id: "IDS_APPROVESTBSTUDYPLAN" }),
                        this.props.intl.formatMessage({ id: "IDS_OK" }),
                        this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                        () => this.approveStbConfirm(inputParam, registerId));

                } else {
                    toast.info(this.props.intl.formatMessage({ id: "IDS_ADDTESTTOREGISTERSAMPLES" }));
                }
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTPREREGQUARANTINESAMPLES" }));
            }
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTPREREGQUARANTINESAMPLES" }));
        }
    }

    approveStbConfirm = (inputParam, registerId) => {
        if (showEsign(this.props.Login.userRoleControlRights,
            this.props.Login.userInfo.nformcode, registerId)) {
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
            this.props.approveStbStudyPlan(inputParam, this.props.Login.masterData)
        }
    }
}
const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
export default connect(mapStateToProps, {
    getPreviewTemplate, updateStore,
    addMoreTests, addSubTimePoint, saveTimePoint, componentTest, createRegTest, ReloadData, getTimePointDetail
    , getTimePointTestDetail, getStabilityStudyPlanByFilterSubmit, cancelSampleAction, testSectionTest, approveStbStudyPlan, getEditStbTimePointDetails,
    deleteTestAction, updateStbTimePoint, cancelStbTimePointAction, filterTransactionList, getRegTypeChange, getRegSubTypeChange, 
    onApprovalConfigVersionChange, getSampleTypeChange,getTestDetailFromRegistration
})(injectIntl(StabilityStudyPlan));