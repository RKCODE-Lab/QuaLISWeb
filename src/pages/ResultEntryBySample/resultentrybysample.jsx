import React, { Component } from 'react';
import { faPlay, faAddressBook, faCheckCircle, faEye, faPencilRuler } from '@fortawesome/free-solid-svg-icons';
import { Card, Col, Row, Button, Nav } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ListWrapper } from '../../components/client-group.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SplitPane from "react-splitter-layout";
import { ContentPanel } from '../../components/App.styles';
import {
    crudMaster, updateStore, getsubSampleREDetail, getTestREDetail, getTestChildTabREDetail, resultGetModule,
    completeTest, testMethodSourceEdit, addREInstrument, deleteInstrumentRecord, fetchInstrumentRecord, deleteTaskRecord,
    fetchTaskRecord, parameterRecord, checkListRecord, onSaveCheckList, defaultTest, getFormula, getRERegistrationType, getRERegistrationSubType,
    getREApprovalConfigVersion, getResultEntryDetails, calculateFormula
} from '../../actions';
import { sortData, create_UUID, getControlMap, listDataFromDynamicArray, formatInputDate, validateTwoDigitDate, getStartOfDay } from '../../components/CommonScript';
import rsapi from '../../rsapi';
import { toast } from 'react-toastify';
import { parameterType, grade, transactionStatus } from '../../components/Enumeration';
import TransactionListMaster from '../../components/TransactionListMaster';
import { ProductList } from '../product/product.styled';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import ResultEntryResultsTab from './ResultEntryResultsTab';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import ResultEntryFilter from './ResultEntryFilter';
import ResultEntryInstrumentForm from './ResultEntryInstrumentForm';
import ResultEntryForm from './ResultEntryForm';
import TestEditForm from './TestEditForm';
import SampleInfoView from '../approval/SampleInfoView';
import SampleInfoGrid from '../approval/SampleInfoGrid';
import ApprovalInstrumentTab from '../approval/ApprovalInstrumentTab';
import ResultEntryTaskTab from './ResultEntryTaskTab';
import ResultEntryTaskForm from './ResultEntryTaskForm';
import ResultEntryParamCommetsForm from './ResultEntryParamCommetsForm';
import TemplateForm from '../checklist/checklist/TemplateForm';
import { templateChangeHandler } from '../checklist/checklist/checklistMethods';
import { numberConversion, numericGrade } from './ResultEntryValidation';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ResultEntryFormulaForm from './ResultEntryFormulaForm';
import ValidateFormula from '../testmanagement/ValidateFormula';
import ApprovalHistoryTab from '../approval/ApprovalHistoryTab';

class resultentrybysample extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataState: { skip: 0, take: 10 },
            resultDataState: { skip: 0, take: 10, group: [{ field: 'ssamplearno' }] },
            instrumentDataState: { skip: 0, take: 10, group: [{ field: 'ssamplearno' }] },
            materialDataState: { skip: 0, take: 10, group: [{ field: 'ssamplearno' }] },
            taskDataState: { skip: 0, take: 10, group: [{ field: 'ssamplearno' }] },
            documentDataState: { skip: 0, take: 10, group: [{ field: 'ssamplearno' }] },
            resultChangeDataState: { skip: 0, take: 10, group: [{ field: 'ssamplearno' }] },
            historyDataState: { skip: 0, take: 10, group: [{ field: 'ssamplearno' }, { field: 'stestsynonym' }] },
            userRoleControlRights: [],
            masterStatus: "",
            error: "",
            operation: "",
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
            selectedRecord: {},
        }
        this.formRef = React.createRef();
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openTemplateModal = this.props.Login.openTemplateModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let screenName = this.props.Login.screenName;
        let operation = this.props.Login.operation;
        let updateInfo = {};
        if (screenName === "IDS_RESULTFORMULA") {
            screenName = "IDS_RESULTENTRY";
            operation = "update";
            let showValidate = !this.props.Login.showValidate;
            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { screenName, operation, showValidate }
            }
        }
        else {
            if (this.props.Login.loadEsign) {
                if (this.props.Login.operation === "delete") {
                    loadEsign = false;
                    openModal = false;
                    selectedRecord = [];
                } else {
                    loadEsign = false;
                }
            } else {
                openModal = false;
                openTemplateModal = false;
                selectedRecord = [];
            }
            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { openModal, loadEsign, selectedRecord, openTemplateModal }
            }
        }
        this.props.updateStore(updateInfo);
    }

    onFilterComboChange = (event, fieldname) => {
        if (event !== null) {
            let uRL = "";
            let inputData = [];

            if (fieldname === "fromDate") {
                inputData = {
                    nflag: 2,
                    fromdate: this.OnDateConverstion(event, fieldname),
                    todate: this.props.Login.masterData.toDate,
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                    nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode),
                    ntranscode: String(this.props.Login.masterData.defaultFilterStatus.ntransactionstatus),
                    defaultRegistrationSubType: this.props.Login.masterData.defaultRegistrationSubType,
                    userinfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                }
                this.props.getREApprovalConfigVersion(inputData)
            }
            if (fieldname === "toDate") {
                inputData = {
                    nflag: 2,
                    fromdate: this.props.Login.masterData.fromDate,
                    todate: this.OnDateConverstion(event, fieldname),
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                    nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode),
                    ntranscode: String(this.props.Login.masterData.defaultFilterStatus.ntransactionstatus),
                    defaultRegistrationSubType: this.props.Login.masterData.defaultRegistrationSubType,
                    userinfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                }
                this.props.getREApprovalConfigVersion(inputData)
            }


            if (fieldname === "nsampletypecode") {
                inputData = {
                    nflag: 2,
                    nsampletypecode: parseInt(event.value),
                    userinfo: this.props.Login.userInfo,
                    defaultSampleType: event.item,
                    masterData: this.props.Login.masterData,
                }
                this.props.getRERegistrationType(inputData)
            }
            else if (fieldname === "nregtypecode") {
                inputData = {
                    nflag: 3,
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    fromdate: this.state.selectedRecord["fromDate"] || new Date(this.props.Login.masterData.fromDate),
                    todate: this.state.selectedRecord["toDate"] || new Date(this.props.Login.masterData.toDate),
                    nregtypecode: parseInt(event.value),
                    userinfo: this.props.Login.userInfo,
                    defaultRegistrationType: event.item,
                    masterData: this.props.Login.masterData,
                }
                this.props.getRERegistrationSubType(inputData)
            }
            else if (fieldname === "nregsubtypecode") {
                inputData = {
                    nflag: 4,
                    fromdate: new Date(this.props.Login.masterData.fromDate),
                    todate: new Date(this.props.Login.masterData.toDate),
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                    nregsubtypecode: event.value,
                    userinfo: this.props.Login.userInfo,
                    defaultRegistrationSubType: event.item,
                    masterData: this.props.Login.masterData,
                }
                this.props.getREApprovalConfigVersion(inputData)
            }
            else if (fieldname === "version") {
                inputData = {
                    nflag: 4,
                    fromdate: new Date(this.props.Login.masterData.fromDate),
                    todate: new Date(this.props.Login.masterData.toDate),
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                    nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode),
                    napprovalconfigversioncode: event.value,
                    userinfo: this.props.Login.userInfo,
                    defaultApprovalConfigVersion: event.item,
                    masterData: this.props.Login.masterData,
                }
                this.props.getREApprovalConfigVersion(inputData)
            }
            else if (fieldname === "filter") {

                let defaultFilterStatus = event.item;
                this.props.Login.masterData.defaultFilterStatus = defaultFilterStatus;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { masterData: { ...this.props.Login.masterData } }
                }
                this.props.updateStore(updateInfo);
                //this.props.getREFilterData(inputData)
            }
            else if (fieldname === "test") {

                let defaultTestvalues = event.item;
                this.props.Login.masterData.defaultTestvalues = defaultTestvalues;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { masterData: { ...this.props.Login.masterData } }
                }
                this.props.updateStore(updateInfo);
                //this.props.getRETestData(inputData)
            }
            else {

            }
        }
    }

    OnDateConverstion = (date, fieldname) => {

        const month = validateTwoDigitDate(String(date.getMonth() + 1));
        const day = validateTwoDigitDate(String(date.getDate()));
        if (fieldname === "fromDate") {
            date = date.getFullYear() + '-' + month + '-' + day + " 00:00:00";
        }
        else {
            date = date.getFullYear() + '-' + month + '-' + day + " 23:59:00";
        }
        return date;
    }

    onREFilterSubmit = (event) => {
        let realFromDate = new Date(this.props.Login.masterData.fromDate)
        let realToDate = new Date(this.props.Login.masterData.toDate)
        let realSampleTypeValue = this.props.Login.masterData.defaultSampleType && this.props.Login.masterData.defaultSampleType
        let realRegTypeValue = this.props.Login.masterData.defaultRegistrationType && this.props.Login.masterData.defaultRegistrationType
        let realRegSubTypeValue = this.props.Login.masterData.defaultRegistrationSubType && this.props.Login.masterData.defaultRegistrationSubType
        let realFilterStatusValue = this.props.Login.masterData.defaultFilterStatus && this.props.Login.masterData.defaultFilterStatus
        let realTestcodeValue = this.props.Login.masterData.defaultTestvalues && this.props.Login.masterData.defaultTestvalues

        let masterData = { ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue, realFilterStatusValue, realTestcodeValue }
        let inputData = {
            nsampletypecode: this.props.Login.masterData.defaultSampleType && this.props.Login.masterData.defaultSampleType.nsampletypecode,
            nregtypecode: this.props.Login.masterData.defaultRegistrationType && this.props.Login.masterData.defaultRegistrationType.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.defaultRegistrationSubType && this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode,
            napprovalversioncode: this.props.Login.masterData.defaultApprovalConfigVersion && this.props.Login.masterData.defaultApprovalConfigVersion.napprovalconfigversioncode,
            ntranscode: String(this.props.Login.masterData.defaultFilterStatus && this.props.Login.masterData.defaultFilterStatus.ntransactionstatus),
            ntestcode: this.props.Login.masterData.defaultTestvalues && this.props.Login.masterData.defaultTestvalues.ntestcode,
            activeTestKey: this.props.Login.activeTestKey || "IDS_RESULTS",
            masterData,
            userinfo: this.props.Login.userInfo
        }
        const startDate = this.state.selectedRecord["fromDate"] || new Date(this.props.Login.masterData.fromDate);
        const endDate = this.state.selectedRecord["toDate"] || new Date(this.props.Login.masterData.toDate);

        const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
        const currentMonth = validateTwoDigitDate(String(endDate.getMonth() + 1));
        const prevDay = validateTwoDigitDate(String(startDate.getDate()));
        const currentDay = validateTwoDigitDate(String(endDate.getDate()));

        const fromDate = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay + " 00:00:00";
        const toDate = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay + " 23:59:00";
        inputData['fromdate'] = fromDate;
        inputData['todate'] = toDate;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.props.getResultEntryDetails(inputData)
    }

    onComboCategoryChange = (event, fieldname) => {
        if (event !== null) {
            let uRL = "";
            let inputData = [];
            uRL = 'resultentrybysample/getResultUsedInstrumentCombo';
            if (fieldname === "ninstrumentcatcode") {
                inputData = {
                    userinfo: this.props.Login.userInfo,
                    nflag: 2,
                    ninstrumentcatcode: event.value,
                    ncalibrationRequired: event.ncalibrationreq
                }
            }
            rsapi.post(uRL, inputData)
                .then(response => {
                    this.props.Login.selectedRecord.ninstrumentcode = response.data.InstrumentData;

                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData: { ...this.props.Login.masterData, ...response.data }, selectedRecord: { ...this.props.Login.selectedRecord } }
                    }
                    this.props.updateStore(updateInfo);
                    const selectedRecord = this.state.selectedRecord || [];
                    selectedRecord[fieldname] = event;
                    this.setState({ selectedRecord });

                })
                .catch(error => {
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        }
    }

    showRESampleInfo() {
        this.setState({ showSample: true, showTest: false })
    }

    showRETestList() {
        this.setState({ showTest: true, showSample: false })
    }

    testRETabDetail = () => {
        const testTabMap = new Map();
        testTabMap.set("IDS_RESULTS", <ResultEntryResultsTab
            userInfo={this.props.Login.userInfo}
            masterData={this.props.Login.masterData}
            inputParam={this.props.Login.inputParam}
            dataState={this.state.resultDataState}
            parameterRecord={this.parameterRecord}
            parameterParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
            checkListRecord={this.checkListRecord}
            ChecklistParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
            selectedId={this.props.Login.selectedId || null}
            screenName="IDS_RESULTS"
        />)
        testTabMap.set("IDS_INSTRUMENT", <ApprovalInstrumentTab
            userInfo={this.props.Login.userInfo}
            masterData={this.props.Login.masterData}
            inputParam={this.props.Login.inputParam}
            deleteParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
            editParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
            dataState={this.state.instrumentDataState}
            selectedId={this.props.Login.selectedId || null}
            isActionRequired={true}
            deleteRecord={this.deleteInstrumentRecord}
            fetchRecord={this.fetchInstrumentRecord}
            screenName="IDS_INSTRUMENT" />)
        testTabMap.set("IDS_MATERIAL", <></>)
        testTabMap.set("IDS_TASK", <ResultEntryTaskTab
            userInfo={this.props.Login.userInfo}
            masterData={this.props.Login.masterData}
            inputParam={this.props.Login.inputParam}
            deleteParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
            editParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
            dataState={this.state.taskDataState}
            selectedId={this.props.Login.selectedId || null}
            isActionRequired={true}
            deleteRecord={this.deleteTaskRecord}
            fetchRecord={this.fetchTaskRecord}
            screenName="IDS_TASK" />)
        testTabMap.set("IDS_TESTATTACHMENTS", <></>)
        testTabMap.set("IDS_TESTCOMMENTS", <></>)
        testTabMap.set("IDS_DOCUMENTS", <></>)
        testTabMap.set("IDS_RESULTCHANGEHISTORY", <></>)
        testTabMap.set("IDS_APPROVALHISTORY", <ApprovalHistoryTab
            userInfo={this.props.Login.userInfo}
            ApprovalHistory={this.props.Login.masterData.ApprovalHistory}
            inputParam={this.props.Login.inputParam}
            dataState={this.state.historyDataState}
            dataStateChange={this.dataStateChange}
            screenName="IDS_APPROVALHISTORY"
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            selectedId={null}
        />)
        return testTabMap;
    }

    dataStateChange = (event) => {
        switch (this.props.Login.activeTestKey) {
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

    sampleTabDetail = () => {
        const tabMap = new Map();
        tabMap.set("IDS_SAMPLEINFO", <SampleInfoView
            data={this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.length > 0 ? this.props.Login.masterData.RESelectedSample[this.props.Login.masterData.RESelectedSample.length - 1] : {}}
            SingleItem={this.state.SingleItem}
            screenName="IDS_SAMPLEINFO"
        />)
        tabMap.set("IDS_SAMPLEGRID", <SampleInfoGrid
            selectedSample={this.props.Login.masterData.RESelectedSample}
            dataState={this.state.dataState}
            dataStateChange={this.dataStateChange}
            detailedFieldList={this.state.SampleGridExpandableItem}
            extractedColumnList={this.state.SampleGridItem}
            userInfo={this.props.Login.userInfo}
            inputParam={this.props.Login.inputParam}
            screenName="IDS_SAMPLEGRID"
        />)
        tabMap.set("IDS_SAMPLEATTACHMENTS", <></>)
        tabMap.set("IDS_SAMPLECOMMENTS", <></>)
        tabMap.set("IDS_SUBSAMPLEATTACHMENTS", <></>)
        tabMap.set("IDS_SUBSAMPLECOMMENTS", <></>)
        return tabMap;
    }

    onSampleTabChange = (tabProps) => {
        const activeSampleTab = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { activeSampleTab }
        }
        this.props.updateStore(updateInfo);
    }

    onTestTabChange = (tabProps) => {
        const activeTestKey = tabProps.screenName;
        if (activeTestKey !== this.props.Login.activeTestKey) {
            let inputData = {
                masterData: this.props.Login.masterData,
                ntransactiontestcode: this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
                RESelectedTest: this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest : "",
                // ntransactiontestcode: this.props.Login.masterData.RESelectedTest ?
                //     this.props.Login.masterData.selectedTestCode : this.props.Login.masterData.RESelectedTest ?
                //         String(this.props.Login.masterData.RESelectedTest.ntransactiontestcode) : "-1",
                userinfo: this.props.Login.userInfo,
                activeTestKey: activeTestKey
            }
            this.props.getTestChildTabREDetail(inputData)
        }
    }

    testMethodSourceEdit = (test) => {
        this.props.testMethodSourceEdit(test)
    }

    addREInstrument = (test) => {
        this.props.addREInstrument(test)
    }
    deleteInstrumentRecord = (test) => {
        this.props.deleteInstrumentRecord(test)
    }
    fetchInstrumentRecord = (test) => {
        this.props.fetchInstrumentRecord(test)
    }

    deleteTaskRecord = (test) => {
        this.props.deleteTaskRecord(test)
    }
    fetchTaskRecord = (test) => {
        this.props.fetchTaskRecord(test)
    }
    addResultEntryTask = (inputData) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord: { ntransactiontestcode: inputData.test.ntransactiontestcode, stestsynonym: inputData.test.stestsynonym },
                operation: "create",
                screenName: "IDS_TASK",
                openModal: true,
                activeTestKey: "IDS_TASK"
            }
        }
        this.props.updateStore(updateInfo);
    }

    parameterRecord = (parameterData) => {
        this.props.parameterRecord(parameterData)
    }
    checkListRecord = (parameterData) => {
        this.props.checkListRecord(parameterData)
    }
    getFormula = (parameterData, userInfo, masterData, index) => {
        this.props.getFormula(parameterData, userInfo, masterData, index)
    }
    calculateFormula = () => {
        const selectedRecord = this.state.selectedRecord || []
        const selectedForumulaInput = this.state.selectedForumulaInput || []
        const selectedResultData = this.props.Login.masterData.selectedResultData || []
        let lstDynamicFields = [];

        if (selectedForumulaInput) {
            selectedForumulaInput.map(dynamicfields =>
                lstDynamicFields.push(dynamicfields)
            );
            const inputData = {
                masterData: this.props.Login.masterData,
                lstDynamicFields: lstDynamicFields,
                userInfo: this.props.Login.userInfo,
                selectedRecord: selectedRecord,
                selectedResultData: selectedResultData,
                selectedResultGrade: this.props.Login.masterData.selectedResultGrade
            }
            this.props.calculateFormula(inputData)
            //this.onGradeEvent(this.props.Login.selectedResultData, selectedRecord.resultindex, selectedRecord.parameterData);
        }
    }

    render() {
        let sampleListRE = this.props.Login.masterData.RE_SAMPLE || [];
        let subSampleListRE = this.props.Login.masterData.RE_SUBSAMPLE || [];
        let testListRE = this.props.Login.masterData.RE_TEST || [];

        const startDate = (this.props.Login.masterData.fromDate ? new Date(this.props.Login.masterData.fromDate) : new Date())
        const endDate = (this.props.Login.masterData.toDate ? new Date(this.props.Login.masterData.toDate) : new Date())

        const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
        const currentMonth = validateTwoDigitDate(String(endDate.getMonth() + 1));
        const prevDay = validateTwoDigitDate(String(startDate.getDate()));
        const currentDay = validateTwoDigitDate(String(endDate.getDate()));

        const fromDate = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay + " 00:00:00";
        const toDate = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay + " 23:59:00";


        let subSampleGetREParam = {
            masterData: this.props.Login.masterData,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.defaultSampleType && this.props.Login.masterData.defaultSampleType.nsampletypecode,
            nregtypecode: this.props.Login.masterData.defaultRegistrationType && this.props.Login.masterData.defaultRegistrationType.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.defaultRegistrationSubType && this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode,
            napprovalversioncode: this.props.Login.masterData.defaultApprovalConfigVersion && this.props.Login.masterData.defaultApprovalConfigVersion.napprovalconfigversioncode,
            ntransactionstatus: this.props.Login.masterData.defaultFilterStatus && this.props.Login.masterData.defaultFilterStatus.ntransactionstatus,
            ntestcode: this.props.Login.masterData.defaultTestvalues && this.props.Login.masterData.defaultTestvalues.ntestcode,
            npreregno: this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.map(sample => sample.npreregno).join(","),
            fromdate: fromDate,
            todate: toDate,
            activeTestKey: this.props.Login.activeTestKey || 'IDS_RESULTS'
        }
        let testGetREParam = {
            masterData: this.props.Login.masterData,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.defaultSampleType && this.props.Login.masterData.defaultSampleType.nsampletypecode,
            nregtypecode: this.props.Login.masterData.defaultRegistrationType && this.props.Login.masterData.defaultRegistrationType.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.defaultRegistrationSubType && this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode,
            napprovalversioncode: this.props.Login.masterData.defaultApprovalConfigVersion && this.props.Login.masterData.defaultApprovalConfigVersion.napprovalconfigversioncode,
            ntransactionstatus: this.props.Login.masterData.defaultFilterStatus && this.props.Login.masterData.defaultFilterStatus.ntransactionstatus,
            ntestcode: this.props.Login.masterData.defaultTestvalues && this.props.Login.masterData.defaultTestvalues.ntestcode,
            npreregno: this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.map(sample => sample.npreregno).join(","),
            activeTestKey: this.props.Login.activeTestKey || 'IDS_RESULTS'
        }
        let testChildGetREParam = {
            masterData: this.props.Login.masterData,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.defaultSampleType && this.props.Login.masterData.defaultSampleType.nsampletypecode,
            nregtypecode: this.props.Login.masterData.defaultRegistrationType && this.props.Login.masterData.defaultRegistrationType.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.defaultRegistrationSubType && this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode,
            napprovalversioncode: this.props.Login.masterData.defaultApprovalConfigVersion && this.props.Login.masterData.defaultApprovalConfigVersion.napprovalconfigversioncode,
            ntransactionstatus: this.props.Login.masterData.defaultFilterStatus && this.props.Login.masterData.defaultFilterStatus.ntransactionstatus,
            ntestcode: this.props.Login.masterData.defaultTestvalues && this.props.Login.masterData.defaultTestvalues.ntestcode,
            npreregno: this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.map(sample => sample.npreregno).join(","),
            ntransactionsamplecode: this.props.Login.masterData.RESelectedSubSample && this.props.Login.masterData.RESelectedSubSample.map(sample => sample.ntransactionsamplecode).join(","),
            activeTestKey: this.props.Login.activeTestKey || 'IDS_RESULTS'
        }
        this.breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": fromDate
            }, {
                "label": "IDS_TO",
                "value": toDate
            },
            // {
            //     "label": "IDS_SAMPLETYPE",
            //     "value": this.props.intl.formatMessage({ id: this.props.Login.masterData.defaultSampleType && this.props.Login.masterData.defaultSampleType.ssampletypename ? this.props.Login.masterData.defaultSampleType.ssampletypename : "NA" })
            // },
             {
                "label": "IDS_REGISTRATIONTYPE",
                "value": this.props.intl.formatMessage({ id: this.props.Login.masterData.defaultRegistrationType && this.props.Login.masterData.defaultRegistrationType.sregtypename ? this.props.Login.masterData.defaultRegistrationType.sregtypename : "NA" })
            }, {
                "label": "IDS_REGISTRATIONSUBTYPE",
                "value": this.props.intl.formatMessage({ id: this.props.Login.masterData.defaultRegistrationSubType && this.props.Login.masterData.defaultRegistrationSubType.sregsubtypename ? this.props.Login.masterData.defaultRegistrationSubType.sregsubtypename : "NA" })
            }, 
            // {
            //     "label": "IDS_VERSION",
            //     "value": this.props.intl.formatMessage({ id: this.props.Login.masterData.defaultApprovalConfigVersion && this.props.Login.masterData.defaultApprovalConfigVersion.sversionname ? this.props.Login.masterData.defaultApprovalConfigVersion.sversionname : "NA" })
            // }, 
            {
                "label": "IDS_TESTSTATUS",
                "value": this.props.intl.formatMessage({ id: this.props.Login.masterData.defaultFilterStatus && this.props.Login.masterData.defaultFilterStatus.sfilterstatus ? this.props.Login.masterData.defaultFilterStatus.sfilterstatus : "NA" })
            }, {
                "label": "IDS_TEST",
                "value": this.props.intl.formatMessage({ id: this.props.Login.masterData.defaultTestvalues && this.props.Login.masterData.defaultTestvalues.stestsynonym ? this.props.Login.masterData.defaultTestvalues.stestsynonym : "NA" })
            }
        ]

        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    <BreadcrumbComponent
                        breadCrumbItem={this.breadCrumbData}
                    />
                    <Row noGutters={true}>
                        <Col md={12} className="parent-port-height">
                            <PerfectScrollbar>
                                <SplitPane vertical borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={45} >
                                    <ListWrapper>
                                        <SplitPane borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={25} >
                                            <PerfectScrollbar>
                                                <TransactionListMaster
                                                    masterList={sampleListRE}
                                                    selectedMaster={this.props.Login.masterData.RESelectedSample}
                                                    primaryKeyField="npreregno"
                                                    getMasterDetail={this.props.getsubSampleREDetail}
                                                    inputParam={subSampleGetREParam}
                                                    additionalParam={['napprovalversioncode']}
                                                    mainField="sarno"
                                                    selectedListName="RESelectedSample"
                                                    objectName="sample"
                                                    listName="IDS_SAMPLE"
                                                    needValidation={false}
                                                    validationKey="napprovalversioncode"
                                                    validationFailMsg="IDS_SELECTSAMPLESOFSAMPLEAPPROVALVERSION"
                                                    subFields={this.state.sampleListColumns || []}
                                                    moreField={this.state.sampleMoreField}
                                                    needFilter={true}
                                                    needMultiSelect={true}
                                                    showFilter={this.props.Login.showFilter}
                                                    openFilter={this.openFilter}
                                                    closeFilter={this.closeFilter}
                                                    onFilterSubmit={this.onREFilterSubmit}
                                                    filterComponent={[
                                                        {
                                                            "Sample Filter": <ResultEntryFilter
                                                                fromDate={this.props.Login.masterData.fromDate ? new Date(this.props.Login.masterData.fromDate) : new Date()}
                                                                toDate={this.props.Login.masterData.toDate ? new Date(this.props.Login.masterData.toDate) : new Date()}
                                                                SampleType={this.props.Login.masterData.SampleType || []}
                                                                SampleTypeValue={this.props.Login.masterData.defaultSampleType || []}
                                                                RegType={this.props.Login.masterData.RegistrationType || []}
                                                                RegTypeValue={this.props.Login.masterData.defaultRegistrationType || []}
                                                                RegSubType={this.props.Login.masterData.RegistrationSubType || []}
                                                                RegSubTypeValue={this.props.Login.masterData.defaultRegistrationSubType || []}
                                                                FilterStatus={this.props.Login.masterData.FilterStatus || []}
                                                                FilterStatusValue={this.props.Login.masterData.defaultFilterStatus || []}
                                                                ApprovalVersion={this.props.Login.masterData.ApprovalConfigVersion || []}
                                                                ApprovalVersionValue={this.props.Login.masterData.defaultApprovalConfigVersion || []}
                                                                Test={this.props.Login.masterData.Testvalues || []}
                                                                TestValue={this.props.Login.masterData.defaultTestvalues || []}
                                                                onFilterComboChange={this.onFilterComboChange}
                                                                handleDateChange={this.handleDateChange}
                                                                userInfo={this.props.Login.userInfo}
                                                            />
                                                        }
                                                    ]}
                                                />
                                            </PerfectScrollbar>
                                            <div>
                                                <SplitPane borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={25} >
                                                    {this.props.Login.masterData.RegistrationSubType && this.props.Login.masterData.RegistrationSubType.nsubsampleneed === 3 &&
                                                        <PerfectScrollbar>
                                                            <TransactionListMaster
                                                                masterList={subSampleListRE}
                                                                selectedMaster={this.props.Login.masterData.RESelectedSubSample}
                                                                primaryKeyField="ntransactionsamplecode"
                                                                getMasterDetail={this.props.getTestREDetail}
                                                                inputParam={testGetREParam}
                                                                additionalParam={[]}
                                                                mainField="ssamplearno"
                                                                selectedListName="RESelectedSubSample"
                                                                objectName="subSample"
                                                                listName="IDS_SUBSAMPLE"
                                                                subFields={this.state.subSampleListColumns || []}
                                                                moreField={this.state.subSampleMoreField}
                                                                needValidation={false}
                                                                needMultiSelect={true}
                                                                needFilter={false}
                                                            />
                                                        </PerfectScrollbar>
                                                    }
                                                    <div>
                                                        <SplitPane borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={25} >
                                                            <PerfectScrollbar>
                                                                <div>
                                                                    <ContentPanel className="panel-main-content" style={this.state.showTest === true ? { display: "block" } : { display: "none" }}>
                                                                        <Card className="border-0">
                                                                            <Card.Body className='p-0'>
                                                                                <Row className='no-gutters'>
                                                                                    <Col md={12}>
                                                                                        <Card>
                                                                                            <Card.Header style={{ borderBottom: "0px" }}>
                                                                                                <span style={{ display: "inline-block", marginTop: "1%" }} >
                                                                                                    <h4 >{this.props.intl.formatMessage({ id: "IDS_TEST" })}</h4>
                                                                                                </span>
                                                                                                <button className="btn btn-primary" style={{ float: "right" }}
                                                                                                    onClick={() => this.showRESampleInfo()}>
                                                                                                    {this.props.intl.formatMessage({ id: "IDS_SAMPLE" })}{ }
                                                                                                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                                                                                </button>
                                                                                            </Card.Header>
                                                                                            <Card.Body className='p-0'>
                                                                                                <PerfectScrollbar>
                                                                                                    <TransactionListMaster
                                                                                                        masterList={testListRE}
                                                                                                        selectedMaster={this.props.Login.masterData.RESelectedTest}
                                                                                                        primaryKeyField="ntransactiontestcode"
                                                                                                        getMasterDetail={this.props.getTestChildTabREDetail}
                                                                                                        inputParam={testChildGetREParam}
                                                                                                        additionalParam={[]}
                                                                                                        mainField="stestsynonym"
                                                                                                        selectedListName="RESelectedTest"
                                                                                                        objectName="test"
                                                                                                        listName="IDS_TEST"
                                                                                                        showStatusLink={true}
                                                                                                        statusFieldName="stransdisplaystatus"
                                                                                                        statusField="ntransactionstatus"
                                                                                                        needMultiSelect={true}
                                                                                                        subFields={this.state.testListColumns || []}
                                                                                                        moreField={this.state.testMoreField}
                                                                                                        needValidation={false}
                                                                                                        needFilter={false}
                                                                                                        selectionField="ntransactionstatus"
                                                                                                        selectionFieldName="sfilterstatus"
                                                                                                        selectionList={this.props.Login.masterData.FilterStatus && this.props.Login.masterData.defaultFilterStatus.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                                                                                                        actionIcons={
                                                                                                            [{ title: "EditTest", controlname: "faPencilAlt", hidden: false, onClick: this.testMethodSourceEdit, objectName: "test", inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo } },
                                                                                                            { title: "Add Intrument", controlname: "faMicroscope", hidden: false, onClick: this.addREInstrument, objectName: "test", inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo } },
                                                                                                            { title: "Add Material", controlname: "faFlask", hidden: false },
                                                                                                            { title: "Add Task", controlname: "faTasks", hidden: false, onClick: this.addResultEntryTask, objectName: "test" }]
                                                                                                        }
                                                                                                        commonActions={
                                                                                                            <ProductList className="d-flex product-category justify-content-end icon-group-wrap">
                                                                                                                <Nav.Link title="Test Start" className="btn btn-circle outline-grey ml-2" role="button">
                                                                                                                    <FontAwesomeIcon title="Test Start" icon={faPlay} />
                                                                                                                </Nav.Link>
                                                                                                                <Nav.Link title="Enter Result" className="btn btn-circle outline-grey ml-2" role="button" onClick={() => this.props.resultGetModule(this.props.Login.masterData, this.props.Login.userInfo)} >
                                                                                                                    <FontAwesomeIcon title="Enter Result" icon={faAddressBook} />
                                                                                                                </Nav.Link>
                                                                                                                <Nav.Link title="Complete" className="btn btn-circle outline-grey ml-2" role="button" onClick={() => this.props.completeTest(testChildGetREParam, this.props.Login.masterData.RESelectedTest, this.props.Login.userInfo)}>
                                                                                                                    <FontAwesomeIcon title="Complete" icon={faCheckCircle} />
                                                                                                                </Nav.Link>
                                                                                                                <Nav.Link title="Default Value" className="btn btn-circle outline-grey ml-2" role="button" onClick={() => this.props.defaultTest(testChildGetREParam, this.props.Login.masterData.RESelectedTest, this.props.Login.masterData.RESelectedSample)}>
                                                                                                                    <FontAwesomeIcon title="Default Value" icon={faPencilRuler} />
                                                                                                                </Nav.Link>
                                                                                                            </ProductList>
                                                                                                        }
                                                                                                    />
                                                                                                </PerfectScrollbar>
                                                                                            </Card.Body>
                                                                                        </Card>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </ContentPanel>
                                                                    <ContentPanel className="panel-main-content" style={this.state.showSample === true ? { display: "block" } : { display: "none" }}>
                                                                        <Card className="border-0">
                                                                            <Card.Body className='p-0'>
                                                                                <Row className='no-gutters'>
                                                                                    <Col md={12}>
                                                                                        <Row className='no-gutters'>
                                                                                            <Col md={12}>
                                                                                                <Card className='p-0'>
                                                                                                    <Card.Header style={{ borderBottom: "0px" }}>
                                                                                                        <span style={{ display: "inline-block", marginTop: "1%" }} >
                                                                                                            <h4 >{this.props.intl.formatMessage({ id: "IDS_SAMPLE" })}</h4>
                                                                                                        </span>
                                                                                                        <button className="btn btn-primary" style={{ float: "right" }}
                                                                                                            onClick={() => this.showRETestList()}>
                                                                                                            {this.props.intl.formatMessage({ id: "IDS_TEST" })}{ }
                                                                                                            <FontAwesomeIcon icon={faEye}></FontAwesomeIcon></button>
                                                                                                    </Card.Header>
                                                                                                    <Card.Body>
                                                                                                        <CustomTabs tabDetail={this.sampleTabDetail()} onTabChange={this.onSampleTabChange} />
                                                                                                    </Card.Body>
                                                                                                </Card>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </ContentPanel>
                                                                </div>
                                                            </PerfectScrollbar>
                                                        </SplitPane>
                                                    </div>
                                                </SplitPane>
                                            </div >
                                        </SplitPane >
                                    </ListWrapper >
                                    <SplitPane
                                        vertical
                                        borderColor="#999"
                                        percentage={true}
                                        primaryIndex={0}
                                        secondaryInitialSize={0}>
                                        <SplitPane
                                            vertical
                                            borderColor="#999"
                                            percentage={true}
                                            primaryIndex={0}
                                            secondaryInitialSize={20}>
                                            <ListWrapper>
                                                <ContentPanel className="panel-main-content">
                                                    <Card className="border-0">
                                                        <Card.Body className='p-0'>
                                                            <Row className='no-gutters'>
                                                                <Col md={12}>
                                                                    <CustomTabs activeKey={this.props.Login.activeTestKey || "IDS_RESULTS"} tabDetail={this.testRETabDetail()} onTabChange={this.onTestTabChange} />
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </ContentPanel>
                                            </ListWrapper>
                                        </SplitPane>
                                    </SplitPane>
                                </SplitPane >
                            </PerfectScrollbar>
                        </Col >
                    </Row >
                </ListWrapper >
                <SlideOutModal
                    show={this.props.Login.openModal}
                    closeModal={this.closeModal}
                    operation={this.props.Login.operation}
                    inputParam={this.props.Login.inputParam}
                    screenName={this.props.Login.screenName}
                    esign={this.props.Login.loadEsign}
                    validateEsign={this.validateEsign}
                    onSaveClick={this.props.Login.showValidate === true ? this.calculateFormula : this.onSaveClick}
                    showValidate={this.props.Login.showValidate}
                    addComponent={this.props.Login.loadEsign ?
                        <Esign
                            operation={this.props.operation}
                            onInputOnChange={this.onEsignInputOnChange}
                            inputParam={this.props.inputParam}
                            selectedRecord={this.state.selectedRecord || []}
                        /> :
                        this.props.Login.screenName === 'IDS_RESULTENTRY' ?
                            <ResultEntryForm
                                predefinedValues={this.props.Login.masterData.PredefinedValues}
                                defaultPredefinedValues={this.props.Login.masterData.PredefinedValues}
                                selectedResultData={this.props.Login.masterData.selectedResultData || []}
                                selectedNumericData={this.props.Login.masterData.selectedNumericData}
                                selectedResultGrade={this.props.Login.masterData.selectedResultGrade || []}
                                parameterResults={this.props.Login.masterData.ResultParameter}
                                Login={this.props.Login}
                                handleClose={this.handleClose}
                                onSaveClick={this.onSaveClick}
                                onResultInputChange={this.onResultInputChange}
                                onGradeEvent={this.onGradeEvent}
                                getFormula={this.getFormula}
                                onDropTestFile={this.onDropTestFile} /> :
                            this.props.Login.screenName === 'IDS_TESTMETHODSOURCE' ?
                                <TestEditForm
                                    methodValues={this.props.Login.masterData.MethodData}
                                    sourceValues={this.props.Login.masterData.SourceData}
                                    selecteRecord={this.state.selectedRecord || []}
                                    onComboChange={this.onComboChange}
                                    handleClose={this.handleClose}
                                    onSaveClick={this.onSaveClick}
                                /> :
                                this.props.Login.screenName === 'IDS_INSTRUMENT' ?
                                    <ResultEntryInstrumentForm
                                        instrumentcatValue={this.props.Login.masterData.InstrumentCategory}
                                        instrumentValue={this.props.Login.masterData.Instrument}
                                        selecteRecord={this.state.selectedRecord || []}
                                        timeZoneListData={this.props.Login.timeZoneList || []}
                                        onComboChange={this.onComboChange}
                                        onComboCategoryChange={this.onComboCategoryChange}
                                        onDateChange={this.onDateChange}
                                        handleClose={this.handleClose}
                                        onSaveClick={this.onSaveClick}
                                        userInfo ={this.props.Login.userInfo}
                                    /> :
                                    this.props.Login.screenName === 'IDS_TASK' ?
                                        <ResultEntryTaskForm
                                            selecteRecord={this.state.selectedRecord || []}
                                            onNumericChange={this.onNumericChange}
                                            onInputChange={this.onInputChange}
                                            handleClose={this.handleClose}
                                            onSaveClick={this.onSaveClick}
                                        /> :
                                        this.props.Login.screenName === 'IDS_PARAMETERCOMMENTS' ?
                                            <ResultEntryParamCommetsForm
                                                selecteRecord={this.state.selectedRecord || []}
                                                onInputChange={this.onInputChange}
                                                handleClose={this.handleClose}
                                                onSaveClick={this.onSaveClick}
                                            /> : this.props.Login.screenName === 'IDS_RESULTFORMULA' ?
                                                <ResultEntryFormulaForm
                                                    DynamicFields={this.props.Login.masterData.DynamicFormulaFields}
                                                    // formRef={this.formRef}
                                                    handleClose={this.handleClose}
                                                    screenName={this.props.Login.screenName}
                                                    onFormulaInputChange={this.onFormulaInputChange}
                                                    Login={this.props.Login}
                                                    showValidate={this.props.Login.showValidate}
                                                    selectedRecord={this.state.selectedRecord || []}
                                                />
                                                : ""
                    }
                />
                {this.props.Login.masterData.ChecklistData && this.props.Login.screenName === 'IDS_CHECKLISTRESULT' ?
                    <TemplateForm
                        templateData={this.props.Login.masterData.ChecklistData}
                        //screenName={this.props.screenName}
                        needSaveButton={true}
                        formRef={this.formRef}
                        onTemplateInputChange={this.onTemplateInputChange}
                        handleClose={this.closeModal}
                        onTemplateComboChange={this.onTemplateComboChange}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.props.onSaveCheckList}
                        Login={this.props.Login}
                        viewScreen={this.props.Login.openTemplateModal}
                        selectedRecord={this.state.selectedRecord || []}
                        onTemplateDateChange={this.onTemplateDateChange}
                    /> : ""}
            </>
        );
    }
    // handCloseformulaModal = () => {
    //     let showValidate = this.props.Login.showValidate
    //     if (showValidate) {
    //         showValidate = false;
    //     }
    //     const updateInfo = {
    //         typeName: DEFAULT_RETURN,
    //         data: { showValidate }
    //     }
    //     this.props.updateStore(updateInfo);
    // }
    onFormulaInputChange = (event, index, fields) => {
        let selectedForumulaInput = this.state.selectedForumulaInput || [];
        let dynamicformulafields = {};
        if (event) {
            dynamicformulafields.svalues = event.target.value;
            dynamicformulafields.sparameter = fields.sdescription;
            selectedForumulaInput[index] = dynamicformulafields;
            this.setState({ selectedForumulaInput });
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

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        if (dateValue === null) {
            dateValue = new Date();
        }
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    onInputChange = (Data, name) => {
        const selectedRecord = this.state.selectedRecord || [];
        if (Data) {
            selectedRecord[name] = Data.target.value;
            this.setState({ selectedRecord });
        }
        else {
            selectedRecord[name] = [];
            this.setState({ selectedRecord });
        }
    }

    onNumericChange = (numericData, numericName) => {
        const selectedRecord = this.state.selectedRecord || [];
        if (numericData) {
            if (numericName !== "scomments") {
                selectedRecord[numericName] = numericData;
                this.setState({ selectedRecord });
            } else {
                selectedRecord[numericName] = numericData.target.value;
                this.setState({ selectedRecord });
            }
        }
        else {
            selectedRecord[numericName] = [];
            this.setState({ selectedRecord });
        }
    }

    onDateChange = (dateName, dateValue) => {
        const selectedRecord = this.state.selectedRecord || [];
        selectedRecord[dateName] = dateValue;
        if (dateName === "dfromdate" || dateName === "dtodate") {
            this.setState({ selectedRecord });
        }
    }

    onComboChange = (comboData, comboName) => {
        const selectedRecord = this.state.selectedRecord || [];
        if (comboData) {
            selectedRecord[comboName] = comboData;
            this.setState({ selectedRecord });
        } else {
            selectedRecord[comboName] = []
            this.setState({ selectedRecord });
        }
    }

    onGradeEvent = (selectedResultData, index, parameter) => {
        if (selectedResultData.length > 0 && selectedResultData[index] !== undefined) {
            let selectedResultGrade = this.props.Login.masterData.selectedResultGrade || [];
            if (parameter.nparametertypecode === parameterType.NUMERIC) {
                selectedResultGrade[index] = {
                    ngradecode: selectedResultData[index].sresult !== "" ?
                        numericGrade(parameter, parseInt(selectedResultData[index].sresult)) : 0
                };
            }
            if (parameter.nparametertypecode === parameterType.PREDEFINED) {
                if (selectedResultData[index].sresult !== null) {
                    selectedResultGrade[index] = { ngradecode: selectedResultData[index].value };
                }
                else {
                    selectedResultGrade[index] = { ngradecode: 0 };
                }
            }
            this.props.Login.masterData["selectedResultGrade"] = selectedResultGrade;

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { masterData: this.props.Login.masterData }
            }
            this.props.updateStore(updateInfo);
        }
    }


    onResultInputChange = (event, index, parameter) => {
        let selectedResultData = this.props.Login.masterData.selectedResultData ? this.props.Login.masterData.selectedResultData : [];
        // let selectedNumericData = this.props.Login.masterData.selectedNumericData || [];
        let sresult = "";
        let value = -1;
        let acceptedFile = [];
        let nroundingdigit = 0;
        if (parameter.nparametertypecode === parameterType.NUMERIC) {
            nroundingdigit = parameter.nroundingdigit;
            if (/^-?\d*?\.?\d*?$/.test(event.target.value) || event.target.value === "") {
                sresult = event.target.value;
            }
            else {
                return
            }
        }
        if (parameter.nparametertypecode === parameterType.PREDEFINED) {
            if (event != null) {
                sresult = event.item.spredefinedname;
                value = event.item.ngradecode;
            }
            else {
                sresult = null;
                value = null;
            }
        }
        if (parameter.nparametertypecode === parameterType.CHARACTER) {
            sresult = event.target.value;
        }
        if (parameter.nparametertypecode === parameterType.ATTACHMENT) {
            sresult = event[0].name;
            acceptedFile = event;
        }
        selectedResultData[index] =
        {
            ntransactionresultcode: parameter.ntransactionresultcode,
            ntransactiontestcode: parameter.ntransactiontestcode,
            nparametertypecode: parameter.nparametertypecode,
            sresult: sresult,
            nroundingdigit: nroundingdigit,
            value: value,
            parameter: parameter,
            acceptedFile: acceptedFile
        }
        this.props.Login.masterData["selectedResultData"] = selectedResultData;
        //this.props.Login.masterData["selectedNumericData"] = selectedNumericData;

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { masterData: this.props.Login.masterData }
        }
        this.props.updateStore(updateInfo);
    }

    onSaveClick = (saveType, formRef) => {
        let selectedResultData = this.props.Login.masterData.selectedResultData || [];
        let selectedRecord = this.state.selectedRecord || []
        let selectedId = this.props.Login.selectedId || null
        const formData = new FormData();
        let resultParameters = [];
        let inputParam = {};
        let inputData = [];
        let i = 0;
        const postParam = { inputListName: "RESelectedTest", selectedObject: "RESelectedTest", primaryKeyField: "ntransactionstestcode" };
        if (this.props.Login.screenName === "IDS_RESULTENTRY") {
            if (selectedResultData.length > 0 && selectedResultData !== undefined) {
                selectedResultData.map((resultData, index) => {
                    let results = {};
                    switch (resultData.nparametertypecode) {
                        case 1:
                            results["sresult"] = resultData.sresult;
                            results["sfinal"] = numberConversion(parseFloat(resultData.sresult), parseInt(resultData.nroundingdigit));
                            results["ngradecode"] = numericGrade(resultData.parameter ? resultData.parameter : resultData, resultData.sresult);
                            results['nenteredrole'] = this.props.Login.userInfo.nuserrole;
                            results['nenteredby'] = this.props.Login.userInfo.nusercode;
                            results['ntransactionresultcode'] = resultData.ntransactionresultcode;
                            results['ntransactiontestcode'] = resultData.ntransactiontestcode;
                            break;
                        case 2:
                            results["sresult"] = resultData.sresult;
                            results["sfinal"] = resultData.sresult;
                            results["ngradecode"] = resultData.value;
                            results['nenteredrole'] = this.props.Login.userInfo.nuserrole;
                            results['nenteredby'] = this.props.Login.userInfo.nusercode;
                            results['ntransactionresultcode'] = resultData.ntransactionresultcode;
                            results['ntransactiontestcode'] = resultData.ntransactiontestcode;
                            break;
                        case 3:
                            results["sresult"] = resultData.sresult;
                            results["sfinal"] = resultData.sresult;
                            results["ngradecode"] = grade.FIO;
                            results['nenteredrole'] = this.props.Login.userInfo.nuserrole;
                            results['nenteredby'] = this.props.Login.userInfo.nusercode;
                            results['ntransactionresultcode'] = resultData.ntransactionresultcode;
                            results['ntransactiontestcode'] = resultData.ntransactiontestcode;
                            break;
                        case 4:
                            if (resultData.acceptedFile !== undefined) {
                                const splittedFileName = resultData.acceptedFile ? resultData.acceptedFile[0].name.split('.') : "";
                                const fileExtension = resultData.acceptedFile ? resultData.acceptedFile[0].name.split('.')[splittedFileName.length - 1] : "";
                                const uniquefilename = create_UUID() + '.' + fileExtension;
                                results["sresult"] = resultData.sresult;
                                results["sfinal"] = resultData.sresult;
                                results["ngradecode"] = grade.FIO;
                                results["nenteredrole"] = this.props.Login.userInfo.nuserrole;
                                results["nenteredby"] = this.props.Login.userInfo.nusercode;
                                results["ntransactionresultcode"] = resultData.ntransactionresultcode;
                                results["ntransactiontestcode"] = resultData.ntransactiontestcode;
                                results["ssystemfilename"] = uniquefilename;
                                results["nfilesize"] = resultData.acceptedFile[0].size;
                                formData.append("uploadedFile" + index, resultData.acceptedFile[0]);
                                formData.append("uniquefilename" + index, uniquefilename);
                                formData.append("ntransactiontestcode", resultData.ntransactiontestcode);
                                i++;
                            }
                            break;
                        default:
                            break;
                    }
                    if (Object.values(results).length > 0) {
                        resultParameters.push(results);
                    }
                });
                formData.append("filecount", i);
                formData.append("resultData", JSON.stringify(resultParameters));
                let postParam = { inputListName: "RE_TEST", selectedObject: "", primaryKeyField: "ntransactionresultcode" };
                inputParam = {
                    classUrl: this.props.Login.inputParam.classUrl,
                    methodUrl: "TestParameterResult",
                    inputData: { userinfo: this.props.Login.userInfo },
                    formData: formData,
                    isFileupload: true,
                    operation: "update",
                    displayName: this.props.Login.inputParam.displayName, saveType, postParam
                }
            }
            else {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { loading: false, openModal: false }
                }
                return this.props.updateStore(updateInfo);
            }
        }

        if (this.props.Login.screenName === "IDS_TESTMETHODSOURCE") {
            inputData = {
                ntype: "3",
                nflag: 3,
                nsampletypecode: this.props.Login.masterData.defaultSampleType.value,
                nregtypecode: this.props.Login.masterData.defaultRegistrationType.value,
                nregsubtypecode: this.props.Login.masterData.defaultRegistrationSubType.value,
                ntranscode: this.props.Login.masterData.defaultFilterStatus.value.toString(),
                ntestcode: this.props.Login.masterData.defaultTestvalues.value,
                npreregno: this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.map(sample => sample.npreregno).join(","),
                ntransactionsamplecode: this.props.Login.masterData.RESelectedSubSample && this.props.Login.masterData.RESelectedSubSample.map(sample => sample.ntransactionsamplecode).join(","),
                nmethodcode: selectedRecord.nmethodcode.value,
                nsourcecode: selectedRecord.nsourcecode.value,
                ntransactiontestcode: selectedRecord.ntransactiontestcode,
                userinfo: this.props.Login.userInfo
            }
            inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "TestMethodSource",
                inputData: inputData,
                isFileupload: false,
                operation: "update",
                displayName: this.props.Login.inputParam.displayName, saveType//postParam
            }
        }
        if (this.props.Login.screenName === "IDS_INSTRUMENT") {
            let inputData = [];
            if (this.props.Login.operation === "update") {
                inputData = {
                    ResultUsedInstrument: {
                        nresultusedinstrumentcode: selectedRecord.nresultusedinstrumentcode,
                        ninstrumentcatcode: selectedRecord.ninstrumentcatcode.value,
                        ninstrumentcode: selectedRecord.ninstrumentcode.value,
                        dfromdate: formatInputDate(selectedRecord.dfromdate, false),
                        dtodate: formatInputDate(selectedRecord.dtodate, false),
                        stzfromdate: selectedRecord.ntzfromdate.label,
                        stztodate: selectedRecord.ntztodate.label,
                        ntzfromdate: selectedRecord.ntzfromdate.value,
                        ntztodate: selectedRecord.ntztodate.value,
                        ntransactiontestcode: selectedRecord.ntransactiontestcode,
                    },
                    userinfo: this.props.Login.userInfo,
                }
            }
            else {
                inputData = {
                    ResultUsedInstrument: {
                        ntransactiontestcode: selectedRecord.ntransactiontestcode,
                        npreregno: selectedRecord.npreregno,
                        ninstrumentcatcode: selectedRecord.ninstrumentcatcode.value,
                        ninstrumentcode: selectedRecord.ninstrumentcode.value,
                        dfromdate: formatInputDate(selectedRecord.dfromdate, false),
                        dtodate: formatInputDate(selectedRecord.dtodate, false),
                        stzfromdate: selectedRecord.ntzfromdate.label,
                        stztodate: selectedRecord.ntztodate.label,
                        ntzfromdate: selectedRecord.ntzfromdate.value,
                        ntztodate: selectedRecord.ntztodate.value
                    },
                    userinfo: this.props.Login.userInfo,
                    transactiontestcode: selectedRecord.transactiontestcode,
                }
            }
            inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "ResultUsedInstrument",
                inputData: inputData, selectedId,
                isFileupload: false,
                operation: this.props.Login.operation,
                displayName: this.props.Login.inputParam.displayName, saveType//postParam
            }
        }
        if (this.props.Login.screenName === "IDS_TASK") {
            if (this.props.Login.operation === "update") {
                inputData = {
                    ResultUsedTasks: {
                        nresultusedtaskcode: selectedRecord.nresultusedtaskcode,
                        sanalysistime: selectedRecord.sanalysistime,
                        sanalyst: this.props.Login.userInfo.suserrolename,
                        smisctime: selectedRecord.smisctime,
                        spreanalysistime: selectedRecord.spreanalysistime,
                        spreparationtime: selectedRecord.spreparationtime,
                        scomments: selectedRecord.scomments
                    },
                    userinfo: this.props.Login.userInfo,
                    ntransactiontestcode: this.props.Login.masterData.RESelectedTest && this.props.Login.masterData.RESelectedTest.map(sample => sample.ntransactiontestcode).join(",")
                }
            }
            else {
                inputData = {
                    ResultUsedTasks: {
                        ntransactiontestcode: selectedRecord.ntransactiontestcode,
                        sanalysistime: selectedRecord.sanalysistime,
                        sanalyst: this.props.Login.userInfo.suserrolename,
                        smisctime: selectedRecord.smisctime,
                        spreanalysistime: selectedRecord.spreanalysistime,
                        spreparationtime: selectedRecord.spreparationtime,
                        scomments: selectedRecord.scomments
                    },
                    userinfo: this.props.Login.userInfo,
                    transactiontestcode: this.props.Login.masterData.RESelectedTest && this.props.Login.masterData.RESelectedTest.map(sample => sample.ntransactiontestcode).join(",")
                }
            }
            inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "ResultUsedTasks",
                inputData: inputData, selectedId,
                isFileupload: false,
                operation: this.props.Login.operation,
                displayName: this.props.Login.inputParam.displayName, saveType//postParam
            }
        }
        if (this.props.Login.screenName === "IDS_PARAMETERCOMMENTS") {
            inputData = {
                ntransactiontestcode: selectedRecord.ntransactiontestcode,
                ntransactionresultcode: selectedRecord.ntransactionresultcode,
                nresultparametercommentcode: selectedRecord.nresultparametercommentcode,
                sresultcomment: selectedRecord.sresultcomment,
                transactiontestcode: selectedRecord.transactiontestcode,
                userinfo: this.props.Login.userInfo
            }
            inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "ParameterComments",
                inputData: inputData, selectedId,
                isFileupload: false,
                operation: this.props.Login.operation,
                displayName: this.props.Login.inputParam.displayName, saveType//postParam
            }
        }
        if (this.props.Login.screenName === "IDS_CHECKLISTRESULT") {
            let lstResultCheckList = [];
            if (selectedRecord && selectedRecord.editedQB) {
                selectedRecord.editedQB.map(qbcode =>
                    lstResultCheckList.push(selectedRecord[qbcode]));
                inputData = {
                    ntransactiontestcode: selectedRecord.ntransactiontestcode.toString(),
                    ntransactionresultcode: selectedRecord.ntransactionresultcode,
                    transactiontestcode: selectedRecord.transactiontestcode,
                    ResultCheckList: lstResultCheckList,
                    userinfo: this.props.Login.userInfo
                }
                inputParam = {
                    classUrl: this.props.Login.inputParam.classUrl,
                    methodUrl: "ResultEntryChecklist",
                    inputData: inputData, selectedId,
                    isFileupload: false,
                    operation: this.props.Login.operation,
                    displayName: this.props.Login.inputParam.displayName, saveType//postParam
                }
            }
        }
        this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            this.setState({ userRoleControlRights, controlMap });
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {

            if (this.props.Login.masterData.SampleType) {
                sortData(this.props.Login.masterData.SampleType, "descending", "")
            }
            if (this.props.Login.masterData.RegistrationType) {
                sortData(this.props.Login.masterData.RegistrationType, "descending", "")
            }
            if (this.props.Login.masterData.RegistrationSubType) {
                sortData(this.props.Login.masterData.RegistrationSubType, "descending", "")
            }
            if (this.props.Login.masterData.FilterStatus) {
                sortData(this.props.Login.masterData.FilterStatus, "ascending", "")
            }
            if (this.props.Login.masterData.Testvalues) {
                sortData(this.props.Login.masterData.Testvalues, "ascending", "ntestcode")
            }
            if (this.props.Login.masterData.RE_SAMPLE) {
                sortData(this.props.Login.masterData.RE_SAMPLE, "descending", "npreregno")
            }
            if (this.props.Login.masterData.RE_SUBSAMPLE) {
                sortData(this.props.Login.masterData.RE_SUBSAMPLE, "descending", "")
            }
            if (this.props.Login.masterData.RE_TEST) {
                sortData(this.props.Login.masterData.RE_TEST, "descending", "ntransactiontestcode")
            }

            if (this.props.Login.masterData.DynamicColumns && this.props.Login.masterData.DynamicColumns !== previousProps.Login.masterData.DynamicColumns) {
                let sampleListColumns = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], 3);
                let subSampleListColumns = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[2], 3);
                let testListColumns = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[3], 3);
                let sampleListMainField = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], 8);
                let subSampleListMainField = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[2], 8);
                let testListMainField = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[3], 8);
                let SingleItem = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], 4)
                let SampleGridItem = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], 5)
                let SampleGridExpandableItem = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], 6)
                let sampleMoreField = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[1], 7)
                let subSampleMoreField = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[2], 7)
                let testMoreField = listDataFromDynamicArray(this.props.Login.masterData.DynamicColumns[3], 7)
                this.setState({
                    sampleListColumns, subSampleListColumns, testListColumns, SingleItem,
                    sampleListMainField, subSampleListMainField, testListMainField,
                    SampleGridItem, SampleGridExpandableItem, sampleMoreField, subSampleMoreField, testMoreField
                })
            }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { masterData: this.props.Login.masterData }
            }
            this.props.updateStore(updateInfo);
        }
    }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.Login.masterStatus !== "") {
            if (props.Login.errorCode === 417 || props.Login.errorCode === 409) {
                toast.warn(props.Login.masterStatus);
                props.Login.masterStatus = "";
            }
        }
        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        if (props.Login.selectedRecord !== state.selectedRecord) {
            return ({ selectedRecord: { ...state.selectedRecord, ...props.Login.selectedRecord } });
        }
        return null;
    }
}



const mapStatetoProps = (state) => {
    return {
        Login: state.Login
    }
}

export default connect(mapStatetoProps, {
    crudMaster, updateStore, getsubSampleREDetail, getTestREDetail, getTestChildTabREDetail, resultGetModule,
    completeTest, testMethodSourceEdit, addREInstrument, deleteInstrumentRecord, fetchInstrumentRecord, deleteTaskRecord, fetchTaskRecord,
    parameterRecord, checkListRecord, onSaveCheckList, defaultTest, getFormula, getRERegistrationType, getRERegistrationSubType,
    getREApprovalConfigVersion, getResultEntryDetails, calculateFormula
})(injectIntl(resultentrybysample));