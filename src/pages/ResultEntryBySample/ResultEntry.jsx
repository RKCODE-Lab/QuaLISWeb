import React, { Component } from 'react';
import { faPlay, faAddressBook, faCheckCircle, faEye, faPencilRuler, faFileImport, faSync, faBorderAll, faLink, faComment, faComments, faPaperclip, faCommentDots, faChevronRight, faMicroscope, faFlask, faHistory, faBookMedical, faNotesMedical, faCalculator, faFileExcel, faBolt, } from '@fortawesome/free-solid-svg-icons';
import { Card, Col, Row, Nav, Button, Modal } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Axios from "axios";
import { ListWrapper } from '../../components/client-group.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import SplitterLayout from "react-splitter-layout";
import { ContentPanel } from '../../components/App.styles';
import PortalModal from '../../PortalModal';
import Iframe from 'react-iframe';
import ReactTooltip from 'react-tooltip';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import { ReactComponent as SaveIcon } from '../../assets/image/save_icon.svg';
//ALPD-4156--Vignesh R(15-05-2024)-->Result Entry - Option to change section for the test(s)	
import { ReactComponent as SectionChange } from '../../assets/image/section-change.svg';
import ScheduleSection from '../joballocation/ScheduleSection';

import {
    crudMaster, updateStore, getsubSampleREDetail, getTestREDetail, getTestChildTabREDetail, resultGetModule, fetchMaterialRecord,
    completeTest, testMethodSourceEdit, addREInstrument, addREMaterial, deleteInstrumentRecord, fetchInstrumentRecord, deleteTaskRecord,
    fetchTaskRecord, parameterRecord, checkListRecord, onSaveCheckList, defaultTest, getFormula, getRERegistrationType, getRERegistrationSubType,
    getREApprovalConfigVersion, getResultEntryDetails, calculateFormula, getREFilterStatus, getREFilterTestData, getREJobStatus,
    viewAttachment, validateEsignCredentialComplete, getAttachmentCombo, deleteAttachment, getCommentsCombo, updateTestMethodSource, resultImportFile,
    filterTransactionList, validateEsignCredential, getSampleChildTabREDetail, updateParameterComments, getREMaterialCategoryByType, getREMaterialByCategory, getREMaterialInvertoryByMaterial,
    previewSampleReport, getMeanCalculationTestParameter, getAvailableMaterialQuantity, testStart, getSubSampleChildTabDetail, getSampleChildTabDetail,
    getREFilterTemplate, getAverageResult, getREMaterialComboGet, getPredefinedData
    , getELNTestValidation,getResultEntryFilter
    //,deleteResultUsedMaterial

    , getConfigurationFilter, getTestBasedBatchWorklist,
    addREAdhocParamter, createAdhocParamter, addREAdhocTestParamter, createAdhocTestParamter
    // ,getPredefinedData,getConfigurationFilter,getTestBasedBatchWorklist//,deleteResultUsedMaterial
    , enforceResult//,deleteResultUsedMaterial
    , ResultEntryViewPatientDetails, resultEntryGetParameter, resultEntryGetSpec, resultEntryGetComponent, CompletePopupAction, exportAction, getSectionChange, updateSectionTest
    , filterObject, toTimestamp, rearrangeDateFormatforKendoDataTool
} from '../../actions';
//import { sortData, create_UUID, getControlMap, listDataFromDynamicArray, formatInputDate, validateTwoDigitDate, showEsign, constructOptionList, deleteAttachmentDropZone,CF_encryptionData } from '../../components/CommonScript';
import {
    sortData, create_UUID, getControlMap, listDataFromDynamicArray, formatInputDate,
    validateTwoDigitDate, showEsign, constructOptionList, deleteAttachmentDropZone,
    Lims_JSON_stringify, CF_encryptionData, onSaveMandatoryValidation, replaceBackSlash, sortDataForDate,
    convertDateTimetoStringDBFormat
} from '../../components/CommonScript';
import rsapi from '../../rsapi';
import { toast } from 'react-toastify';
import { SampleType, parameterType, ResultEntry as ResultEntryGrade, transactionStatus, RegistrationType, RegistrationSubType, FORMULAFIELDTYPE, designProperties, SideBarSeqno, SideBarTabIndex, checkBoxOperation } from '../../components/Enumeration';
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
import ResultEntryParameterForm from './ResultEntryParameterForm';
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
import SampleApprovalHistory from '../approval/SampleApprovalHistory';
import ResultChangeHistoryTab from '../approval/ResultChangeHistoryTab';
import Attachments from '../attachmentscomments/attachments/Attachments';
import Comments from '../attachmentscomments/comments/Comments';
import { onSaveSampleAttachment, onSaveTestAttachment, onSaveSubSampleAttachment } from '../attachmentscomments/attachments/AttachmentFunctions';
import { onSaveSampleComments, onSaveTestComments, onSaveSubSampleComments } from '../attachmentscomments/comments/CommentFunctions';
import ResultEntryImport from './ResultEntryImport';
import { getSameRecordFromTwoArrays, convertDateValuetoString, rearrangeDateFormat } from '../../components/CommonScript'
// import ReactTooltip from 'react-tooltip';
import ResultEntryMean from './ResultEntryMean';
import ScrollBar from 'react-perfect-scrollbar';
import ResultEntryMaterialForm from './ResultEntryMaterialForm';
import AddAdhocParameter from './AddAdhocParameter';
import ResultUsedMaterial from './UsedMaterial';
import { FontIconWrap } from '../../components/data-grid/data-grid.styles';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import ModalShow from '../../components/ModalShow';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';
import ResultEntryPredefinedComments from './ResultEntryPredefinedComments';
import ResultEntryEnforceResult from './ResultEntryEnforceResult';
import SpecificationInfo from '../testgroup/SpecificationInfo';
import fullviewExpand from '../../assets/image/fullview-expand.svg';
import fullviewCollapse from '../../assets/image/fullview-collapse.svg';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { ReactComponent as Resultentry } from '../../assets/image/Result entry.svg';
import ResultEntryAdhocParameter from './ResultEntryAdhocParameter'
import ResultEntryCompleteForm from './ResultEntryCompleteForm';
import KendoDatatoolFilter from '../contactmaster/KendoDatatoolFilter';
import { intl } from '../../components/App';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomPopover from '../../components/customPopover';

class ResultEntry extends Component {
    constructor(props) {
        super(props)
        this.searchSampleRef = React.createRef();
        this.searchSubSampleRef = React.createRef();
        this.searchTestRef = React.createRef();
        this.childRef = React.createRef();
        this.state = {

            subSampleCommentDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'groupingField' }] 
            },
            subSampleAttachmentDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'groupingField' }] 
            },
            sampleGridDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            resultDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'sarno' }] 
            },
            instrumentDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'sarno' }] 
            },
            materialDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'sarno' }] 
            },
            taskDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'sarno' }] 
            },
            documentDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'sarno' }]
            },
            resultChangeDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'sarno' }]
            },
            testCommentDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'sarno' }] 
            },
            historyDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'stestsynonym' }] 
            },
            sampleHistoryDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'sarno' }] 
            },
            userRoleControlRights: [],
            controlMap: new Map(),
            masterStatus: "",
            error: "",
            operation: "",
            showSample: false,
            showSubSample: false,
            showTest: true,
            tabPane: 0,
            subsampleskip: 0,
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
            selectedRecordMaterialForm: {},
            selectedRecordInstrumentForm: {},
            selectedRecordCompleteForm: {},
            selectedRecordTaskForm: {},
            validateFormulaMandyFields: [],
            splitChangeWidthPercentage: 22,
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],
            subSampleSkip: 0,
            subSampleTake: this.props.Login.settings && this.props.Login.settings[12],
            // subsampletake: this.props.Login.settings
            // && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
            testskip: 0,
            testtake: this.props.Login.settings && this.props.Login.settings[12],
            initialVerticalWidth: "57vh",
            enablePin: false,
            openELNSheet: false,
            enlLink: "",
            sampleSearchField: [],
            subsampleSearchField: [],
            testSearchField: [],
            selectedRecordAdhocParameter: {},
            filterSampleList: [],
        }
        //openELNSheet: false
        this.formRef = React.createRef();
        //this.onSecondaryPaneSizeChange = this.onSecondaryPaneSizeChange.bind(this);
    }

    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
    }
    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.props.Login.masterData.selectedImportFile
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { masterData: { ...this.props.Login.masterData, selectedImportFile: selectedRecord } }
        }
        this.props.updateStore(updateInfo);

    }

    deleteAttachmentParameterFile = (event, file, fieldName, index) => {
        let selectedRecordParameter = this.state.selectedRecord.ResultParameter[index];

        selectedRecordParameter[fieldName] = deleteAttachmentDropZone(selectedRecordParameter[fieldName],
            file)
        let selectedRecord = this.state.selectedRecord
        selectedRecord['ResultParameter'][index]['editable'] = true;
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: { masterData: { ...this.props.Login.masterData, ResultParameter.editable
        //         //selectedImportFile: selectedRecord 
        //     } }
        // }
        // this.props.updateStore(updateInfo);
        this.setState({
            selectedRecord: selectedRecord//fileToDelete:file.name 
        });

    }
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

    closeModalShow = () => {
        let showAlertGrid = this.props.Login.showAlertGrid;
        let selectedRecord = this.props.Login.selectedRecord;
        let masterData = this.props.Login.masterData && this.props.Login.masterData
        masterData['RESelectedTest'].forEach(object => {
            object['expanded'] && delete object['expanded'];
        });
        selectedRecord['ntestgrouptestpredefsubcode'] && delete selectedRecord['ntestgrouptestpredefsubcode']
        showAlertGrid = false;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showAlertGrid, masterData, selectedRecord }
        }
        this.props.updateStore(updateInfo);
    }
    onTabChangeRulesEngine = (tabProps) => {
        let masterData = this.props.Login.masterData && this.props.Login.masterData
        masterData['RESelectedTest'].forEach(object => {
            object['expanded'] && delete object['expanded'];
        });
        masterData['activeTabName'] = tabProps.activeTabName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { masterData }
        }
        this.props.updateStore(updateInfo);
    }
    handleExpandChange = (mapobject) => {
        let childListMap = new Map();
        let keylst = Object.keys(mapobject);
        keylst.map((key) => {
            childListMap.set(parseInt(key),
                Object.values(mapobject[key]));
        })
        this.setState({ childListMap })
    }
    availableTestFilter = (data) => {
        let lstntransactionsamplecode = [];
        if (this.props.Login.RegistrationTestAlert) {
            let keylst = Object.keys(this.props.Login.RegistrationTestAlert);
            // keylst.map(x=>{ 
            //    this.props.Login.RegistrationTestAlert[x].map(y=> lstntransactionsamplecode.push(y['ntransactionsamplecode'])) 
            // }); 
            // let boolean1 = keylst.includes(data.ntestgrouptestcode.toString())
            let boolean1 = keylst.includes(data.ntransactiontestcode.toString())
            //  let boolean2 = lstntransactionsamplecode.includes(data.ntransactionsamplecode)
            if (boolean1//&&boolean2
            ) {
                return data;
            }
        }
    }
    unavailableTestFilter = (data) => {
        let lstntransactionsamplecode = [];
        if (this.props.Login.NewTestGroupTestAlert) {
            let keylst = Object.keys(this.props.Login.NewTestGroupTestAlert);
            // keylst.map(x=>{ 
            //     this.props.Login.NewTestGroupTestAlert[x].map(y=> lstntransactionsamplecode.push(y['ntransactionsamplecode'])) 
            // });
            // let boolean1 = keylst.includes(data.ntestgrouptestcode.toString())
            let boolean1 = keylst.includes(data.ntransactiontestcode.toString())
            //  let boolean2 = lstntransactionsamplecode.includes(data.ntransactionsamplecode)
            if (boolean1//&&boolean2
            ) {
                return data;
            }
        }
    }
    dataStateAvailabletestAlert = (event) => {
        this.setState({
            dataStateavailabletest: event.dataState
        });
    }
    dataStateUnAvailabletestAlert = (event) => {
        this.setState({
            dataStateunavailabletest: event.dataState
        });
    }
    tabAlertRulesEngine = () => {
        const tabMap = new Map();
        {
            this.props.Login.RegistrationTestAlert && this.props.Login.masterData.RESelectedTest && this.props.Login.masterData.RESelectedTest.filter(this.availableTestFilter).length > 0 &&//this.props.Login.RegistrationTestAlert.length>0 &&
                tabMap.set("IDS_AVAILABLETESTUNDERSAMPLE",
                    <DataGrid
                        primaryKeyField="ntransactiontestcode"
                        dataResult={process(sortData(this.props.Login.masterData.RESelectedTest.filter(this.availableTestFilter), 'descending', 'ntransactiontestcode') || [],
                            this.state.dataStateavailabletest ? this.state.dataStateavailabletest : { skip: 0, take: 10 })}
                        dataState={this.state.dataStateavailabletest ? this.state.dataStateavailabletest : { skip: 0, take: 10 }}
                        dataStateChange={this.dataStateAvailabletestAlert}
                        extractedColumnList={[
                            { "idsName": "IDS_RULEAPPLIEDTESTNAME", "dataField": "stestsynonym", "width": "200px" }
                        ]}
                        controlMap={this.state.controlMap}
                        userRoleControlRights={this.state.userRoleControlRights}
                        pageable={true}
                        scrollable={'scrollable'}
                        hideColumnFilter={true}
                        selectedId={0}
                        gridHeight={'350px'}
                        gridWidth={'700px'}
                        expandField="expanded"
                        handleExpandChange={() => { this.handleExpandChange(this.props.Login.RegistrationTestAlert) }}
                        hasChild={true}
                        childMappingField={'ntransactiontestcode'}
                        childColumnList={
                            this.props.Login.masterData.realRegSubTypeValue.nneedsubsample ?
                                [
                                    { "idsName": "IDS_RULEDEPENDENTTESTNAME", "dataField": "stestsynonym", "width": "200px" },
                                    { "idsName": "IDS_SAMPLEARNO", "dataField": "samplearno", "width": "200px" },
                                    { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "200px" }
                                ] : [
                                    { "idsName": "IDS_RULEDEPENDENTTESTNAME", "dataField": "stestsynonym", "width": "200px" },
                                    { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "200px" }
                                ]}
                        childList={this.state.childListMap}
                        activeTabName={"IDS_AVAILABLETESTUNDERSAMPLE"}
                    >
                    </DataGrid>)
            this.props.Login.NewTestGroupTestAlert && this.props.Login.masterData.RESelectedTest && this.props.Login.masterData.RESelectedTest.filter(this.unavailableTestFilter).length > 0 &&//this.props.Login.NewTestGroupTestAlert.length>0  &&
                tabMap.set("IDS_TESTSNOTAVAILABLEUNDERSAMPLE",
                    <DataGrid
                        primaryKeyField="ntransactiontestcode"
                        dataResult={process(sortData(this.props.Login.masterData.RESelectedTest.filter(this.unavailableTestFilter), 'descending', 'ntransactiontestcode') || [],
                            this.state.dataStateunavailabletest ? this.state.dataStateunavailabletest : { skip: 0, take: 10 })}
                        dataState={this.state.dataStateunavailabletest ? this.state.dataStateunavailabletest : { skip: 0, take: 10 }}
                        dataStateChange={this.dataStateUnAvailabletestAlert}
                        extractedColumnList={[
                            { "idsName": "IDS_RULEAPPLIEDTESTNAME", "dataField": "stestsynonym", "width": "200px" }
                        ]}
                        controlMap={this.state.controlMap}
                        userRoleControlRights={this.state.userRoleControlRights}
                        pageable={true}
                        scrollable={'scrollable'}
                        hideColumnFilter={true}
                        selectedId={0}
                        expandField="expanded"
                        handleExpandChange={() => { this.handleExpandChange(this.props.Login.NewTestGroupTestAlert) }}
                        gridHeight={'350px'}
                        gridWidth={'700px'}
                        hasChild={true}
                        childMappingField={'ntransactiontestcode'}
                        childColumnList={[
                            { "idsName": "IDS_RULEDEPENDENTTESTNAME", "dataField": "stestsynonym", "width": "200px" }
                        ]}
                        childList={this.state.childListMap}
                        activeTabName={"IDS_TESTSNOTAVAILABLEUNDERSAMPLE"}
                    >
                    </DataGrid>
                )
        }
        return tabMap;
    }
    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecordAdhocParameter = this.state.selectedRecordAdhocParameter || {}
        let openTemplateModal = this.props.Login.openTemplateModal;
        let selectedRecord = this.props.Login.selectedRecord;
        //let additionInfo=this.props.Login.additionInfo ||{};
        let screenName = this.props.Login.screenName;
        let operation = this.props.Login.operation;
        let loadFile = this.props.Login.loadFile;
        let selectedId = this.props.Login.selectedId;
        let multiFilterLoad = this.props.Login.multiFilterLoad;
        let updateInfo = {};
        //additionInfo={...selectedRecord};
        if (screenName === "IDS_RESULTFORMULA") {
            screenName = "IDS_RESULTENTRY";
            operation = "update";
            let showValidate = !this.props.Login.showValidate;
            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { screenName, operation, showValidate, validateFormulaMandyFields: [] }
            }
        }
        else {
            if (this.props.Login.loadEsign) {
                if (this.props.Login.operation === "delete"
                    || this.props.Login.operation === "complete"
                    || this.props.Login.operation === "default"
                    || this.props.Login.operation === "deleteTask"
                    || this.props.Login.operation === "deleteInstrument" || this.props.Login.operation === "deleteMaterial") {
                    loadEsign = false;
                    openModal = false;
                    selectedRecord = {};
                }
                else if (this.props.Login.operation === "updatechecklist") {
                    loadEsign = false;
                    openModal = false;
                }
                else {
                    loadEsign = false;
                    selectedRecord['esignpassword'] = "";
                    selectedRecord['esigncomments'] = "";
                    selectedRecord['esignreason'] = "";
                }
            } else {
                openModal = false;
                openTemplateModal = false;
                selectedRecord = {};
                selectedRecordAdhocParameter = {}
                loadFile = false;
                selectedId = null;
                multiFilterLoad = false;
            }
            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { openModal, loadEsign, openTemplateModal, screenName, selectedRecord, loadFile, selectedId, selectedRecordAdhocParameter, multiFilterLoad, }
            }
        }
        this.props.updateStore(updateInfo);
    }
    
    // Start of ALPD-4132 on Save Additional Filter handler ATE-241
    onSaveMultiFilterClick = () => {
        
        const startDate = (this.props.Login.masterData.realFromDate || this.props.Login.masterData.fromDate || new Date());
        const endDate = (this.props.Login.masterData.realToDate || this.props.Login.masterData.toDate || new Date());

        let obj = convertDateValuetoString(startDate, endDate, this.props.Login.userInfo);

        const fromDate = obj.fromDate;
        const toDate = obj.toDate;
        const searchedSample = this.state.filterSampleList ? sortDataForDate(this.state.filterSampleList, 'dtransactiondate', 'npreregno') : [];
        const kendoFilterList = this.state.kendoFilterList || [];
        const emptyFilterList = [];
        if (kendoFilterList.filters && kendoFilterList.filters.length > 0) {
            kendoFilterList.filters.map(item => {
                if (item.value === "") {
                    emptyFilterList.push(item);
                }
            })
        }
        if (emptyFilterList.length > 0) {
            toast.warn(intl.formatMessage({ id: "IDS_PROVIDEVALUESFORINPUTS" }));
        } else {
            const selectedSample = [];
            const masterData = this.props.Login.masterData;

            if (searchedSample.length === 0) {
                let searchSampleRef = this.searchSampleRef;
                searchSampleRef.current.value = "";
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData: {
                            ...masterData,
                            selectedSample: [],
                            selectedSubSample: [],
                            selectedTest: [],
                            searchedSample: [],
                            searchedSubSample: undefined,
                            searchedTest: undefined,
                            RegistrationAttachment: [],
                            RE_SUBSAMPLE: [],
                            RE_TEST: [],
                            RegistrationTestComment: [],
                            RegistrationParameter: [],
                            RegistrationTestAttachment: [],
                            RegistrationComment: [],
                            RegistrationSampleAttachment: [],
                            RegistrationSampleComment: [],

                        },
                        multiFilterLoad: false,
                        openModal: false,
                        searchSampleRef,
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                selectedSample.push(searchedSample[0]);
                let inputData = {
                    userinfo: this.props.Login.userInfo,
                    nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                    napprovalversioncode: this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode,
                    ntestcode: this.props.Login.masterData.realTestcodeValue && this.props.Login.masterData.realTestcodeValue.ntestcode,
                    fromdate: fromDate,
                    todate: toDate,
                    activeTestKey: this.props.Login.activeTestTab || 'IDS_RESULTS',
                    activeSampleKey: this.props.Login.activeTestTab || 'IDS_IDS_SAMPLEINFO',
                    testskip: 0,
                    testtake: this.state.testtake,
                    subSampleSkip: 0,
                    subSampleTake: this.state.subSampleTake,
                    skip:0,
                    resultDataState: this.state.resultDataState,
                    instrumentDataState: this.state.instrumentDataState,
                    materialDataState: this.state.materialDataState,
                    taskDataState: this.state.taskDataState,
                    documentDataState: this.state.documentDataState,
                    resultChangeDataState: this.state.resultChangeDataState,
                    testCommentDataState: this.state.testCommentDataState,
                    sampleChangeDataState: this.state.sampleChangeDataState,
                    ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode,
                    searchSubSampleRef: this.searchSubSampleRef,
                    searchTestRef: this.searchTestRef,
                    nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                    checkBoxOperation: checkBoxOperation.SINGLESELECT,
                    nworlistcode: (this.props.Login.masterData.realWorklistCodeValue && this.props.Login.masterData.realWorklistCodeValue.nworklistcode) || -1,
                    nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1,
                    activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 8 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 8 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
                    nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43']),
                    activeSampleTab: masterData.activeSampleTab,
                    activeSubSampleTab: masterData.activeSubSampleTab,
                    activeTestTab: masterData.activeTestTab,
                    childTabsKey: ["RegistrationAttachment", "RE_SUBSAMPLE", "RE_TEST", "SampleApprovalHistory", "RegistrationComment", "RegistrationSampleComment", "RegistrationSampleAttachment"],
                    nneedsubsample: masterData.nneedsubsample,
                    npreregno: selectedSample[0].npreregno && selectedSample[0].npreregno.toString(),
                    ntransactionstatus: String(this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus),
                    removeElementFromArray: masterData.selectedSample,
                    sample: selectedSample,
                    RESelectedSample: selectedSample,
                    searchSampleRef: this.searchSampleRef,
                    masterData: { ...masterData, searchedSample, selectedSample, kendoFilterList: kendoFilterList },
                    openModal: false,
                    multiFilterLoad: false,
                };
                this.props.getsubSampleREDetail(inputData, true);
            }
        }
    }
//  End of ALPD-4132 -ATE-241

    onFilterComboChange = (event, fieldname) => {
        if (event !== null) {
            let inputData = [];

            if (fieldname === "fromDate") {
                let dateObj = convertDateValuetoString(event, this.props.Login.masterData.toDate, this.props.Login.userInfo)
                inputData = {
                    realDesignTemplateMapping: this.props.Login.masterData.realDesignTemplateMapping,
                    realApproveConfigVersion: this.props.Login.masterData.realApproveConfigVersion,
                    realApprovalConfigVersionList: this.props.Login.masterData.realApprovalConfigVersionList,
                    realDesignTemplateMappingList: this.props.Login.masterData.realDesignTemplateMappingList,
                    realFilterStatusList: this.props.Login.masterData.realFilterStatusList,
                    realRegistrationSubTypeList: this.props.Login.masterData.realRegistrationSubTypeList,
                    realRegistrationTypeList: this.props.Login.masterData.realRegistrationTypeList,
                    realTestvaluesList: this.props.Login.masterData.realTestvaluesList,
                    nflag: 2,
                    fromdate: dateObj.fromDate,//this.OnDateConverstion(event, fieldname),
                    todate: dateObj.toDate,//this.props.Login.masterData.toDate,
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                    nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode),
                    //ntranscode: String(this.props.Login.masterData.defaultFilterStatus.ntransactionstatus),
                    transcode: this.props.Login.masterData.defaultFilterStatus.ntransactionstatus === 0 ?
                        this.props.Login.masterData.REFilterStatus.map(item => item.ntransactionstatus).join(",") : String(this.props.Login.masterData.defaultFilterStatus.ntransactionstatus),
                    defaultRegistrationSubType: this.props.Login.masterData.defaultRegistrationSubType,
                    userinfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43']),
                    nneedjoballocation: this.props.Login.masterData.defaultRegistrationSubType.nneedjoballocation,
                    nneedmyjob: this.props.Login.masterData.defaultRegistrationSubType.nneedmyjob
                }
                this.props.getREApprovalConfigVersion(inputData)
            }
            if (fieldname === "toDate") {

                let dateObj = convertDateValuetoString(this.props.Login.masterData.fromDate, event, this.props.Login.userInfo)

                inputData = {
                    realDesignTemplateMapping: this.props.Login.masterData.realDesignTemplateMapping,
                    realApproveConfigVersion: this.props.Login.masterData.realApproveConfigVersion,
                    realApprovalConfigVersionList: this.props.Login.masterData.realApprovalConfigVersionList,
                    realDesignTemplateMappingList: this.props.Login.masterData.realDesignTemplateMappingList,
                    realFilterStatusList: this.props.Login.masterData.realFilterStatusList,
                    realRegistrationSubTypeList: this.props.Login.masterData.realRegistrationSubTypeList,
                    realRegistrationTypeList: this.props.Login.masterData.realRegistrationTypeList,
                    realTestvaluesList: this.props.Login.masterData.realTestvaluesList,
                    nflag: 2,
                    fromdate: dateObj.fromDate,//this.props.Login.masterData.fromDate,
                    todate: dateObj.toDate,//this.OnDateConverstion(event, fieldname),
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                    nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode),
                    //ntranscode: String(this.props.Login.masterData.defaultFilterStatus.ntransactionstatus),
                    transcode: this.props.Login.masterData.defaultFilterStatus.ntransactionstatus === 0 ?
                        this.props.Login.masterData.REFilterStatus.map(item => item.ntransactionstatus).join(",") : String(this.props.Login.masterData.defaultFilterStatus.ntransactionstatus),
                    defaultRegistrationSubType: this.props.Login.masterData.defaultRegistrationSubType,
                    userinfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43']),
                    nneedjoballocation: this.props.Login.masterData.defaultRegistrationSubType.nneedjoballocation,
                    nneedmyjob: this.props.Login.masterData.defaultRegistrationSubType.nneedmyjob
                }
                this.props.getREApprovalConfigVersion(inputData)
            }

            // let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, 
            //                  this.props.Login.masterData.toDate, this.props.Login.userInfo); 

            if (fieldname === "nsampletypecode") {

                let obj = convertDateValuetoString((this.state.selectedRecord && this.state.selectedRecord["fromDate"]) || this.props.Login.masterData.fromDate,
                    (this.state.selectedRecord && this.state.selectedRecord["toDate"]) || this.props.Login.masterData.toDate, this.props.Login.userInfo);

                inputData = {
                    realDesignTemplateMapping: this.props.Login.masterData.realDesignTemplateMapping,
                    realApproveConfigVersion: this.props.Login.masterData.realApproveConfigVersion,
                    realApprovalConfigVersionList: this.props.Login.masterData.realApprovalConfigVersionList,
                    realDesignTemplateMappingList: this.props.Login.masterData.realDesignTemplateMappingList,
                    realFilterStatusList: this.props.Login.masterData.realFilterStatusList,
                    realRegistrationSubTypeList: this.props.Login.masterData.realRegistrationSubTypeList,
                    realRegistrationTypeList: this.props.Login.masterData.realRegistrationTypeList,
                    realTestvaluesList: this.props.Login.masterData.realTestvaluesList,
                    nflag: 2,
                    nsampletypecode: parseInt(event.value),
                    fromdate: obj.fromDate,//(this.state.selectedRecord && this.state.selectedRecord["fromDate"]) || this.props.Login.masterData.fromDate,
                    todate: obj.toDate,//(this.state.selectedRecord && this.state.selectedRecord["toDate"]) || this.props.Login.masterData.toDate,
                    userinfo: this.props.Login.userInfo,
                    defaultSampleType: event.item,
                    masterData: this.props.Login.masterData,
                    nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43']),

                }
                this.props.getRERegistrationType(inputData)
            }
            else if (fieldname === "nregtypecode") {

                let obj = convertDateValuetoString((this.state.selectedRecord && this.state.selectedRecord["fromDate"]) || this.props.Login.masterData.fromDate,
                    (this.state.selectedRecord && this.state.selectedRecord["toDate"]) || this.props.Login.masterData.toDate, this.props.Login.userInfo);


                inputData = {
                    realRegistrationSubTypeList: this.props.Login.masterData.realRegistrationSubTypeList,
                    realDesignTemplateMapping: this.props.Login.masterData.realDesignTemplateMapping,
                    realApproveConfigVersion: this.props.Login.masterData.realApproveConfigVersion,
                    realApprovalConfigVersionList: this.props.Login.masterData.realApprovalConfigVersionList,
                    realDesignTemplateMappingList: this.props.Login.masterData.realDesignTemplateMappingList,
                    realFilterStatusList: this.props.Login.masterData.realFilterStatusList,
                    realRegistrationTypeList: this.props.Login.masterData.realRegistrationTypeList,
                    realTestvaluesList: this.props.Login.masterData.realTestvaluesList,
                    nflag: 3,
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    fromdate: obj.fromDate,//(this.state.selectedRecord && this.state.selectedRecord["fromDate"]) || this.props.Login.masterData.fromDate,
                    todate: obj.toDate,//(this.state.selectedRecord && this.state.selectedRecord["toDate"]) || this.props.Login.masterData.toDate,
                    nregtypecode: parseInt(event.value),
                    userinfo: this.props.Login.userInfo,
                    defaultRegistrationType: event.item,
                    masterData: this.props.Login.masterData,
                    nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43'])
                }
                this.props.getRERegistrationSubType(inputData)
            }
            else if (fieldname === "nregsubtypecode") {

                let obj = convertDateValuetoString(this.props.Login.masterData.fromDate,
                    this.props.Login.masterData.toDate, this.props.Login.userInfo);

                inputData = {
                    realRegistrationSubTypeList: this.props.Login.masterData.realRegistrationSubTypeList,
                    realDesignTemplateMapping: this.props.Login.masterData.realDesignTemplateMapping,
                    realApproveConfigVersion: this.props.Login.masterData.realApproveConfigVersion,
                    realApprovalConfigVersionList: this.props.Login.masterData.realApprovalConfigVersionList,
                    realDesignTemplateMappingList: this.props.Login.masterData.realDesignTemplateMappingList,
                    realFilterStatusList: this.props.Login.masterData.realFilterStatusList,
                    realRegistrationTypeList: this.props.Login.masterData.realRegistrationTypeList,
                    realTestvaluesList: this.props.Login.masterData.realTestvaluesList,
                    nflag: 4,
                    fromdate: obj.fromDate,//this.props.Login.masterData.fromDate,
                    todate: obj.toDate,//this.props.Login.masterData.toDate,
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                    nregsubtypecode: event.value,
                    userinfo: this.props.Login.userInfo,
                    defaultRegistrationSubType: event.item,
                    masterData: this.props.Login.masterData,
                    nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43']),
                    nneedjoballocation: this.props.Login.masterData.defaultRegistrationSubType.nneedjoballocation,
                    nneedmyjob: this.props.Login.masterData.defaultRegistrationSubType.nneedmyjob
                }
                this.props.getREApprovalConfigVersion(inputData)
            }

            else if (fieldname === 'ndesigntemplatemappingcode') {
                let obj = convertDateValuetoString(this.props.Login.masterData.fromDate,
                    this.props.Login.masterData.toDate, this.props.Login.userInfo);

                const inputParamData = {
                    nflag: 3,
                    fromdate: obj.fromDate,//this.props.Login.masterData.fromDate,
                    todate: obj.toDate,
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                    nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode),
                    napprovalversioncode: this.props.Login.masterData.ApprovalConfigVersion[0].napprovalconfigversioncode,
                    userinfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    //defaultFilterStatus: event.item,
                    defaultRegistrationSubType: this.props.Login.masterData.defaultRegistrationSubType,
                    //ntranscode: String(this.props.Login.masterData.defaultFilterStatus.ntransactionstatus),
                    ntranscode: this.props.Login.masterData.defaultFilterStatus.ntransactionstatus === 0 ?
                        this.props.Login.masterData.REFilterStatus.map(item => item.ntransactionstatus).join(",") : String(this.props.Login.masterData.defaultFilterStatus.ntransactionstatus),
                    nneedsubsample: this.props.Login.masterData.realRegSubTypeValue.nneedsubsample || false,
                    // stransactionstatus: this.props.Login.masterData.defaultFilterStatus.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.defaultFilterStatus.ntransactionstatus,
                    //nsectioncode: this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") : this.props.Login.masterData.UserSectionValue.nsectioncode,
                    ndesigntemplatemappingcode: event.value,
                    DesignTemplateMappingValue: event.item,
                    defaultRegistrationSubType: this.props.Login.masterData.defaultRegistrationSubType,
                    nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43']),
                    nneedjoballocation: this.props.Login.masterData.defaultRegistrationSubType.nneedjoballocation,
                    nneedmyjob: this.props.Login.masterData.defaultRegistrationSubType.nneedmyjob
                }
                //this.props.getREFilterTestData(inputParamData)
                this.props.getREFilterTemplate(inputParamData)

            }

            else if (fieldname === "version") {

                let obj = convertDateValuetoString(this.props.Login.masterData.fromDate,
                    this.props.Login.masterData.toDate, this.props.Login.userInfo);

                inputData = {
                    nflag: 4,
                    fromdate: obj.fromDate,//this.props.Login.masterData.fromDate,
                    todate: obj.toDate,//this.props.Login.masterData.toDate,
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                    nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode),
                    napprovalversioncode: event.value,
                    userinfo: this.props.Login.userInfo,
                    defaultApprovalConfigVersion: event.item,
                    masterData: this.props.Login.masterData,
                    //ntranscode: String(this.props.Login.masterData.defaultFilterStatus.ntransactionstatus),
                    ntranscode: this.props.Login.masterData.defaultFilterStatus.ntransactionstatus === 0 ?
                        this.props.Login.masterData.REFilterStatus.map(item => item.ntransactionstatus).join(",") : String(this.props.Login.masterData.defaultFilterStatus.ntransactionstatus),
                    ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode ? this.props.Login.masterData.ndesigntemplatemappingcode : -1,
                    defaultRegistrationSubType: this.props.Login.masterData.defaultRegistrationSubType,
                    nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43']),
                    nneedjoballocation: this.props.Login.masterData.defaultRegistrationSubType.nneedjoballocation,
                    nneedmyjob: this.props.Login.masterData.defaultRegistrationSubType.nneedmyjob
                }
                this.props.getREJobStatus(inputData)
            }
            else if (fieldname === "jobstatus") {

                let obj = convertDateValuetoString(this.props.Login.masterData.fromDate,
                    this.props.Login.masterData.toDate, this.props.Login.userInfo);

                inputData = {
                    nflag: 5,
                    fromdate: obj.fromDate,//this.props.Login.masterData.fromDate,
                    todate: obj.toDate,//this.props.Login.masterData.toDate,
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                    nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode),
                    napprovalversioncode: parseInt(this.props.Login.masterData.defaultApprovalConfigVersion.napprovalconfigversioncode),
                    njobstatuscode: event.value,
                    userinfo: this.props.Login.userInfo,
                    defaultjobstatus: event.item,
                    masterData: this.props.Login.masterData,
                    nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43']),
                    nneedjoballocation: this.props.Login.masterData.defaultRegistrationSubType.nneedjoballocation,
                    nneedmyjob: this.props.Login.masterData.defaultRegistrationSubType.nneedmyjob
                }
                this.props.getREFilterStatus(inputData)
            }
            else if (fieldname === "filter") {

                let obj = convertDateValuetoString(this.props.Login.masterData.fromDate,
                    this.props.Login.masterData.toDate, this.props.Login.userInfo);

                inputData = {
                    nflag: 5,
                    fromdate: obj.fromDate,//this.props.Login.masterData.fromDate,
                    todate: obj.toDate,//this.props.Login.masterData.toDate,
                    nsampletypecode: parseInt(this.props.Login.masterData.defaultSampleType.nsampletypecode),
                    nregtypecode: parseInt(this.props.Login.masterData.defaultRegistrationType.nregtypecode),
                    nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode),
                    napprovalversioncode: parseInt(this.props.Login.masterData.defaultApprovalConfigVersion.napprovalconfigversioncode),
                    njobstatuscode: 1,// parseInt(this.props.Login.masterData.defaultjobstatus.njobstatuscode),
                    ntranscode: event.value === 0 ? this.props.Login.masterData.REFilterStatus.map(item => item.ntransactionstatus).join(",") : String(event.value),
                    userinfo: this.props.Login.userInfo,
                    defaultFilterStatus: event.item,
                    masterData: this.props.Login.masterData,
                    DesignTemplateMappingValue: this.props.Login.masterData.DesignTemplateMappingValue,
                    ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode ? this.props.Login.masterData.ndesigntemplatemappingcode : -1,
                    defaultRegistrationSubType: this.props.Login.masterData.defaultRegistrationSubType && this.props.Login.masterData.defaultRegistrationSubType,
                    nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43']),
                    nneedjoballocation: this.props.Login.masterData.defaultRegistrationSubType.nneedjoballocation,
                    nneedmyjob: this.props.Login.masterData.defaultRegistrationSubType.nneedmyjob
                }
                this.props.getREFilterTestData(inputData)
            }
            else if (fieldname === "test") {

                let defaultTestvalues = event.item;
                this.props.Login.masterData.defaultTestvalues = defaultTestvalues;
                // const updateInfo = {
                //     typeName: DEFAULT_RETURN,
                //     data: { masterData: { ...this.props.Login.masterData } }
                // }
                // this.props.updateStore(updateInfo);
                inputData = {
                    defaultTestvalues,
                    ntestcode: this.props.Login.masterData.defaultTestvalues.ntestcode,
                    masterData: this.props.Login.masterData,
                    defaultRegistrationSubType: this.props.Login.masterData.defaultRegistrationSubType,
                    ntranscode: String(this.props.Login.masterData.defaultFilterStatus.ntransactionstatus === 0 ?
                        this.props.Login.masterData.REFilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.defaultFilterStatus.ntransactionstatus),
                    userinfo: this.props.Login.userInfo,
                    napprovalversioncode: parseInt(this.props.Login.masterData.defaultApprovalConfigVersion.napprovalconfigversioncode),
                    nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43']),
                    nneedjoballocation: this.props.Login.masterData.defaultRegistrationSubType.nneedjoballocation,
                    nneedmyjob: this.props.Login.masterData.defaultRegistrationSubType.nneedmyjob

                }
                this.props.getConfigurationFilter(inputData)
            }
            else if (fieldname === "nconfigfiltercode") {

                let defaultConfigurationFilterValue = event.item;
                this.props.Login.masterData.defaultConfigurationFilterValue = defaultConfigurationFilterValue;
                this.props.Login.masterData.realdefaultConfigurationFilterValue = defaultConfigurationFilterValue;
                inputData = {
                    defaultConfigurationFilterValue,
                    nconfigfiltercode: parseInt(this.props.Login.masterData.defaultConfigurationFilterValue.nconfigfiltercode),
                    ntestcode: this.props.Login.masterData.defaultTestvalues.ntestcode,
                    masterData: this.props.Login.masterData,
                    defaultRegistrationSubType: this.props.Login.masterData.defaultRegistrationSubType,
                    //ntranscode: this.props.Login.masterData.defaultFilterStatus.ntransactionstatus,
                    ntranscode: String(this.props.Login.masterData.defaultFilterStatus.ntransactionstatus === 0 ?
                        this.props.Login.masterData.REFilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.defaultFilterStatus.ntransactionstatus),
                    napprovalversioncode: parseInt(this.props.Login.masterData.defaultApprovalConfigVersion.napprovalconfigversioncode),
                    nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43']),
                    nneedjoballocation: this.props.Login.masterData.defaultRegistrationSubType.nneedjoballocation,
                    nneedmyjob: this.props.Login.masterData.defaultRegistrationSubType.nneedmyjob,
                    userinfo: this.props.Login.userInfo,
                }
                this.props.getTestBasedBatchWorklist(inputData)
            }
            else if (fieldname === "nworklistcode") {

                let defaultWorklistvalue = event.item;
                this.props.Login.masterData.defaultWorklistvalue = defaultWorklistvalue;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { masterData: { ...this.props.Login.masterData } }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                if (fieldname === "nbatchmastercode") {
                    let defaultBatchvalue = event.item;
                    this.props.Login.masterData.defaultBatchvalue = defaultBatchvalue;
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData: { ...this.props.Login.masterData } }
                    }
                    this.props.updateStore(updateInfo);
                }
            }
        }
        else {
            if (fieldname === "nconfigfiltercode") {
                this.props.Login.masterData.defaultConfigurationFilterValue = [];
                this.props.Login.masterData.defaultWorklistvalue = [];
                this.props.Login.masterData.defaultBatchvalue = [];

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { masterData: { ...this.props.Login.masterData } }
                }
                this.props.updateStore(updateInfo);
            }
        }
    }
    OnDateConverstion = (date, fieldname) => {
        const month = validateTwoDigitDate(String(date.getMonth() + 1));
        const day = validateTwoDigitDate(String(date.getDate()));
        if (fieldname === "fromDate") {
            date = date.getFullYear() + '-' + month + '-' + day + "T00:00:00";
        }
        else {
            date = date.getFullYear() + '-' + month + '-' + day + "T23:59:00";
        }
        return date;
    }
    onReload = () => {
        let { realFromDate, realToDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue, realApproveConfigVersion,
            realFilterStatusValue, realTestcodeValue, realWorklistCodeValue,realDesignTemplateMapping } = this.props.Login.masterData
        //let obj = this.covertDatetoString(realFromDate, realToDate)
        let obj = convertDateValuetoString(realFromDate, realToDate, this.props.Login.userInfo);
        let masterData = { ...this.props.Login.masterData, realFromDate: obj.fromDate, realToDate: obj.toDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue, realFilterStatusValue, realApproveConfigVersion, realTestcodeValue }
        let inputData = {
            nsampletypecode: (realSampleTypeValue && realSampleTypeValue.nsampletypecode) || -1,
            nregtypecode: (realRegTypeValue && realRegTypeValue.nregtypecode) || -1,
            nregsubtypecode: (realRegSubTypeValue && realRegSubTypeValue.nregsubtypecode) || -1,
            napprovalversioncode: (realApproveConfigVersion && realApproveConfigVersion.napprovalconfigversioncode) || -1,
            ntranscode: String(realFilterStatusValue ? realFilterStatusValue.ntransactionstatus : -1),
            //ntestcode: realTestcodeValue && realTestcodeValue.ntestcode || -1,
            ntestcode:  (realTestcodeValue && realTestcodeValue.ntestcode !== undefined && realTestcodeValue.ntestcode !== null) ? realTestcodeValue.ntestcode : -1,
            ndesigntemplatemappingcode:(realDesignTemplateMapping && realDesignTemplateMapping.ndesigntemplatemappingcode)|| -1,
            nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1,    //  ALPD-5587   Added nbatchmastercode by Vishakh to handle reload with selected batch
            ntransactiontestcode: 0,
            njobstatuscode: (this.props.Login.masterData.defaultjobstatus && this.props.Login.masterData.defaultjobstatus.njobstatuscode) || 1,
            fromdate: obj.fromDate,
            todate: obj.toDate,
            userinfo: this.props.Login.userInfo,
            activeTestKey: this.props.Login.activeTestKey || "IDS_RESULTS",
            showTest: true,
            showSample: false,
            //checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            //ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode,
            nworlistcode: (realWorklistCodeValue && realWorklistCodeValue.nworklistcode) || -1,
            nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43'])
        }
        
        const inpuParamData = {
            inputData,
            masterData,
            refs: { searchSampleRef: this.searchSampleRef, searchSubSampleRef: this.searchSubSampleRef, searchTestRef: this.searchTestRef },
            resultDataState: this.state.resultDataState,
            instrumentDataState: this.state.instrumentDataState,
            materialDataState: this.state.materialDataState,
            taskDataState: this.state.taskDataState,
            documentDataState: this.state.documentDataState,
            resultChangeDataState: this.state.resultChangeDataState,
            testCommentDataState: this.state.testCommentDataState,
            historyDataState: this.state.historyDataState,
        }
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1 && inputData.napprovalversioncode !== -1
            && inputData.ntranscode !== -1 && inputData.njobstatuscode !== -1 && inputData.ntestcode !== -1) {
                // ALPD-4132 to clear Addition Filter Config upon refresh and clear all data - ATE-241
                inpuParamData.masterData["kendoFilterList"] = undefined;
            this.props.getResultEntryDetails(inpuParamData)
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
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

    //ALPD-4870 To open the save popup of filtername,done by Dhanushya RI
    openFilterName = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {  modalShow: true,operation:"create",modalTitle:this.props.intl.formatMessage({ id: "IDS_SAVEFILTER" })}
        }
        this.props.updateStore(updateInfo);
    }

   //ALPD-4870 to insert the filter name in filtername table,done by Dhanushya RI

    onSaveModalFilterName = () => {
        
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate,
            this.props.Login.masterData.realToDate, this.props.Login.userInfo)
        let inputData = {
            userinfo:this.props.Login.userInfo,
            fromdate : obj.fromDate,
            todate : obj.toDate,
            sfiltername:this.state.selectedRecord && this.state.selectedRecord.sfiltername !== null
            ? this.state.selectedRecord.sfiltername: "",
            needExtraKeys:true,
            sampleTypeValue: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue,
            regTypeValue: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue,
            regSubTypeValue: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue,
            approvalConfigValue: this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion,
            filterStatusValue: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue,
            testValue: this.props.Login.masterData.realTestcodeValue && this.props.Login.masterData.realTestcodeValue,
            designTemplateMappingValue: this.props.Login.masterData.realDesignTemplateMapping && this.props.Login.masterData.realDesignTemplateMapping,
            worklistValue: this.props.Login.masterData.realWorklistvalue && this.props.Login.masterData.realWorklistvalue,
            batchValue: this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            napproveconfversioncode: this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode,
            ntranscode: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
            ntestcode: this.props.Login.masterData.realTestcodeValue && this.props.Login.masterData.realTestcodeValue.ntestcode,
            ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMapping && this.props.Login.masterData.realDesignTemplateMapping.ndesigntemplatemappingcode,
            nworklistcode: this.props.Login.masterData.realWorklistvalue && this.props.Login.masterData.realWorklistvalue.nworklistcode,
            nbatchcode: this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchcode,


        }

       
        let inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "FilterName",
            inputData: inputData,
            operation: this.props.Login.operation,
          };
   
        const masterData = this.props.Login.masterData;
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1 && inputData.napprovalversioncode !== -1
            && inputData.ntranscode !== -1 && inputData.njobstatuscode !== -1 && inputData.ntestcode !== undefined) {
        
        // if (showEsign(this.props.Login.userRoleControlRights,this.props.Login.userInfo.nformcode,this.props.Login.ncontrolCode)) {
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
    }
    else {
        toast.warn(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
    }
    }
     //ALPD-4870-To get previously saved filter details when click the filter name,,done by Dhanushya RI
    clickFilterDetail = (value) => {
       // if(this.props.Login.nfilternamecode!==value.nfilternamecode){
        let realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate);
        let realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate);
        let realSampleTypeValue = this.props.Login.masterData.defaultSampleType && this.props.Login.masterData.defaultSampleType
        let realRegTypeValue = this.props.Login.masterData.defaultRegistrationType && this.props.Login.masterData.defaultRegistrationType
        let realRegSubTypeValue = this.props.Login.masterData.defaultRegistrationSubType && this.props.Login.masterData.defaultRegistrationSubType
        let realApproveConfigVersion = this.props.Login.masterData.defaultApprovalConfigVersion && this.props.Login.masterData.defaultApprovalConfigVersion
        let realFilterStatusValue = this.props.Login.masterData.defaultFilterStatus && this.props.Login.masterData.defaultFilterStatus
        let realTestcodeValue = this.props.Login.masterData.defaultTestvalues && this.props.Login.masterData.defaultTestvalues
        let realWorklistCodeValue = this.props.Login.masterData.defaultWorklistvalue && this.props.Login.masterData.defaultWorklistvalue
        let realBatchCodeValue = this.props.Login.masterData.defaultBatchvalue && this.props.Login.masterData.defaultBatchvalue
        let realDesignTemplateMapping = this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue
        let realDesignTemplateMappingList = this.props.Login.masterData.DesignTemplateMapping && this.props.Login.masterData.DesignTemplateMapping
        let realApprovalConfigVersionList = this.props.Login.masterData.ApprovalConfigVersion && this.props.Login.masterData.ApprovalConfigVersion
        let realFilterStatusList = this.props.Login.masterData.REFilterStatus && this.props.Login.masterData.REFilterStatus
        let realRegistrationTypeList = this.props.Login.masterData.RegistrationType && this.props.Login.masterData.RegistrationType
        let realRegistrationSubTypeList = this.props.Login.masterData.RegistrationSubType && this.props.Login.masterData.RegistrationSubType
        // let realBatchvaluesList=this.props.Login.masterData.RegistrationType
        // let  RealWorklistvaluesList=this.props.Login.masterData.RegistrationType
        let realConfigurationFilterValuesList = this.props.Login.masterData.ConfigurationFilterValues && this.props.Login.masterData.ConfigurationFilterValues



        //let obj = this.covertDatetoString(realFromDate, realToDate)
   
        let obj = convertDateValuetoString(realFromDate, realToDate, this.props.Login.userInfo);
        let masterData = {
            ...this.props.Login.masterData, realFromDate: obj.fromDate,
            realToDate: obj.toDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue, realFilterStatusValue,
            realApproveConfigVersion, realTestcodeValue, realWorklistCodeValue, realBatchCodeValue
            , realDesignTemplateMapping, realDesignTemplateMappingList, realApprovalConfigVersionList, realFilterStatusList, realRegistrationTypeList, realRegistrationSubTypeList,
            realConfigurationFilterValuesList
        }
        let inputData = {
            npreregno:"0",
            nfilternamecode:value && value.nfilternamecode? value.nfilternamecode:-1,
            nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43']),
            userinfo: this.props.Login.userInfo,
            activeTestKey: this.props.Login.activeTestKey || "IDS_RESULTS",
            showTest: true,
            showSample: false,
            nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
            //checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            napproveconfversioncode: this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode,
            ntranscode: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
            ntestcode: parseInt(this.props.Login.masterData.realTestcodeValue && this.props.Login.masterData.realTestcodeValue.ntestcode),
            ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMapping && this.props.Login.masterData.realDesignTemplateMapping.ndesigntemplatemappingcode,
            nworklistcode: this.props.Login.masterData.realWorklistvalue && this.props.Login.masterData.realWorklistvalue.nworklistcode,
            nbatchcode: this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchcode,
            FromDate : obj.fromDate,
            ToDate : obj.toDate,
        }
       
        const inpuParamData = {
            inputData,
            masterData,
            refs: { searchSampleRef: this.searchSampleRef, searchSubSampleRef: this.searchSubSampleRef, searchTestRef: this.searchTestRef },
            resultDataState: this.state.resultDataState,
            instrumentDataState: this.state.instrumentDataState,
            materialDataState: this.state.materialDataState,
            taskDataState: this.state.taskDataState,
            documentDataState: this.state.documentDataState,
            resultChangeDataState: this.state.resultChangeDataState,
            testCommentDataState: this.state.testCommentDataState,
            historyDataState: this.state.historyDataState
        }
                // ALPD-4132 to Clear Additional Filter Config
                inpuParamData.masterData['kendoFilterList'] = undefined;
            this.props.getResultEntryFilter(inpuParamData)
        
    // }
    // else{
    //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDFILTERALREADYLOADED" }));  
    // }
    }

    onREFilterSubmit = (event) => {
        // let realFromDate = new Date(this.props.Login.masterData.fromDate)
        // let realToDate = new Date(this.props.Login.masterData.toDate)
        let realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate);
        let realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate);
        let realSampleTypeValue = this.props.Login.masterData.defaultSampleType && this.props.Login.masterData.defaultSampleType
        let realRegTypeValue = this.props.Login.masterData.defaultRegistrationType && this.props.Login.masterData.defaultRegistrationType
        let realRegSubTypeValue = this.props.Login.masterData.defaultRegistrationSubType && this.props.Login.masterData.defaultRegistrationSubType
        let realApproveConfigVersion = this.props.Login.masterData.defaultApprovalConfigVersion && this.props.Login.masterData.defaultApprovalConfigVersion
        let realFilterStatusValue = this.props.Login.masterData.defaultFilterStatus && this.props.Login.masterData.defaultFilterStatus
        let realTestcodeValue = this.props.Login.masterData.defaultTestvalues && this.props.Login.masterData.defaultTestvalues
        let realWorklistCodeValue = this.props.Login.masterData.defaultWorklistvalue && this.props.Login.masterData.defaultWorklistvalue
        let realBatchCodeValue = this.props.Login.masterData.defaultBatchvalue && this.props.Login.masterData.defaultBatchvalue
        let realDesignTemplateMapping = this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue
        let realDesignTemplateMappingList = this.props.Login.masterData.DesignTemplateMapping && this.props.Login.masterData.DesignTemplateMapping
        let realApprovalConfigVersionList = this.props.Login.masterData.ApprovalConfigVersion && this.props.Login.masterData.ApprovalConfigVersion
        let realFilterStatusList = this.props.Login.masterData.REFilterStatus && this.props.Login.masterData.REFilterStatus
        let realRegistrationTypeList = this.props.Login.masterData.RegistrationType && this.props.Login.masterData.RegistrationType
        let realRegistrationSubTypeList = this.props.Login.masterData.RegistrationSubType && this.props.Login.masterData.RegistrationSubType
        // let realBatchvaluesList=this.props.Login.masterData.RegistrationType
        // let  RealWorklistvaluesList=this.props.Login.masterData.RegistrationType
        let realConfigurationFilterValuesList = this.props.Login.masterData.ConfigurationFilterValues && this.props.Login.masterData.ConfigurationFilterValues



        //let obj = this.covertDatetoString(realFromDate, realToDate)
        let obj = convertDateValuetoString(realFromDate, realToDate, this.props.Login.userInfo);
        let masterData = {
            ...this.props.Login.masterData, realFromDate: obj.fromDate,
            realToDate: obj.toDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue, realFilterStatusValue,
            realApproveConfigVersion, realTestcodeValue, realWorklistCodeValue, realBatchCodeValue
            , realDesignTemplateMapping, realDesignTemplateMappingList, realApprovalConfigVersionList, realFilterStatusList, realRegistrationTypeList, realRegistrationSubTypeList,
            realConfigurationFilterValuesList
        }
        let inputData = {
            needExtraKeys:true,
            saveFilterSubmit:true, //ALPD-4870 to insert the filter data's in filterdetail table when submit the filter,done by Dhanushya RI
            sampleTypeValue: this.props.Login.masterData && this.props.Login.masterData.defaultSampleType,
            regTypeValue: this.props.Login.masterData && this.props.Login.masterData.defaultRegistrationType,
            regSubTypeValue: this.props.Login.masterData && this.props.Login.masterData.defaultRegistrationSubType,
            filterStatusValue: this.props.Login.masterData && this.props.Login.masterData.defaultFilterStatus,
            approvalConfigValue: this.props.Login.masterData && this.props.Login.masterData.defaultApprovalConfigVersion,
            designTemplateMappingValue: this.props.Login.masterData && this.props.Login.masterData.DesignTemplateMappingValue,
            testValue:this.props.Login.masterData && this.props.Login.masterData.defaultTestvalues,
            worklistValue:this.props.Login.masterData &this.props.Login.masterData.defaultWorklistvalue,
            batchValue:this.props.Login.masterData && this.props.Login.masterData.defaultBatchvalue,
            nsampletypecode: (this.props.Login.masterData.defaultSampleType && this.props.Login.masterData.defaultSampleType.nsampletypecode) || -1,
            nregtypecode: (this.props.Login.masterData.defaultRegistrationType && this.props.Login.masterData.defaultRegistrationType.nregtypecode) || -1,
            nregsubtypecode: (this.props.Login.masterData.defaultRegistrationSubType && this.props.Login.masterData.defaultRegistrationSubType.nregsubtypecode) || -1,
            napprovalversioncode: (this.props.Login.masterData.defaultApprovalConfigVersion && this.props.Login.masterData.defaultApprovalConfigVersion.napprovalconfigversioncode) || -1,
            ntranscode: this.props.Login.masterData.defaultFilterStatus && this.props.Login.masterData.defaultFilterStatus.ntransactionstatus === 0 ?
                this.props.Login.masterData.REFilterStatus.map(item => item.ntransactionstatus).join(",") : String(this.props.Login.masterData.defaultFilterStatus.ntransactionstatus),
            //ntranscode: String(this.props.Login.masterData.defaultFilterStatus ? this.props.Login.masterData.defaultFilterStatus.ntransactionstatus : -1),
            ntestcode: this.props.Login.masterData.defaultTestvalues ? this.props.Login.masterData.defaultTestvalues.ntestcode : -1,
            ntransactiontestcode: 0,
            njobstatuscode: (this.props.Login.masterData.defaultjobstatus && this.props.Login.masterData.defaultjobstatus.njobstatuscode) || 1,
            fromdate: obj.fromDate,
            todate: obj.toDate,
            userinfo: this.props.Login.userInfo,
            activeTestKey: this.props.Login.activeTestKey || "IDS_RESULTS",
            showTest: true,
            showSample: false,
            nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
            //checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            ndesigntemplatemappingcode: (this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
            nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
            nworlistcode: (this.props.Login.masterData.defaultWorklistvalue && this.props.Login.masterData.defaultWorklistvalue.nworklistcode) || -1,
            nbatchmastercode: (this.props.Login.masterData.defaultBatchvalue && this.props.Login.masterData.defaultBatchvalue.nbatchmastercode) || -1,
            nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43'])
        }
       
        const inpuParamData = {
            inputData,
            masterData,
            refs: { searchSampleRef: this.searchSampleRef, searchSubSampleRef: this.searchSubSampleRef, searchTestRef: this.searchTestRef },
            resultDataState: this.state.resultDataState,
            instrumentDataState: this.state.instrumentDataState,
            materialDataState: this.state.materialDataState,
            taskDataState: this.state.taskDataState,
            documentDataState: this.state.documentDataState,
            resultChangeDataState: this.state.resultChangeDataState,
            testCommentDataState: this.state.testCommentDataState,
            historyDataState: this.state.historyDataState
        }

        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1 && inputData.napprovalversioncode !== -1
            && inputData.ntranscode !== -1 && inputData.njobstatuscode !== -1 && inputData.ntestcode !== undefined) {
                // ALPD-4132 to Clear Additional Filter Config
                inpuParamData.masterData['kendoFilterList'] = undefined;
            this.props.getResultEntryDetails(inpuParamData)
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
        }
    }

    // Start of ALPD-4132 on Additional Filter Click handler ATE-241
    onMultiFilterClick = () => {
        const filterFields = this.state.sampledisplayfields || [];
        const samplefilteritem = this.state.samplefilteritem || [];
        const languageTypeCode = this.props.Login.userInfo.slanguagetypecode;
        const datefileds = [];
        
        let updFilterFields = [];
        filterFields.length > 0 && filterFields.map(item => {
            let obj = {};
            obj["filterinputtype"] = item[3];
            obj["displayname"] = item[1];
            obj["columnname"] = item[2];
            updFilterFields.push(obj)
        });
        const fields = [];
        const kendoFilterList = this.props.Login.masterData?.kendoFilterList || [];
        if (kendoFilterList.length === 0 || (kendoFilterList.filters && kendoFilterList.filters.length === 0)) {
            kendoFilterList["logic"] = "and";
            kendoFilterList["filters"] = [];
            samplefilteritem.length > 0 && samplefilteritem.map(item => {
                let obj = {};
                obj["field"] = item[2];
                obj["value"] = "";
                if (item[3] === "date" || item[3] === "numeric") {
                    obj["operator"] = "eq";
                } else {
                    obj["operator"] = "contains";
                }
                kendoFilterList["filters"].push(obj);
            });
        }
        updFilterFields.length > 0 && updFilterFields.map(item => {
            fields.push(filterObject(item, languageTypeCode, null, null, true));
            if (item.filterinputtype === "date") {
                datefileds.push(item.columnname)
            }
        });
        const sampleList = this.props.Login.masterData.RE_SAMPLE || [];
        const kendoOptionList = sampleList.length > 0 ? sampleList.map(item => {

            datefileds.map(x => {
                item[x + "timestamp"] = toTimestamp(rearrangeDateFormatforKendoDataTool(this.props.Login.userInfo, item[x]))
            })

            return item;
        }) : [];

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal: true,
                masterData: {
                    ...this.props.Login.masterData, fields,
                    kendoFilterList, kendoOptionList
                },
                multiFilterLoad: true,
                screenName: "IDS_ADDITIONALFILTER",
             //ALPD-4225-Vignesh R(24-05-2024)--The operation has been removed to concatenate with the screen.
                operation:"",
                skip:undefined
            }
        };
        this.props.updateStore(updateInfo);

    }

    // ALPD-4132 Additional Filter parent call Back function ATE241
    parentCallBack = (data, filter) => {
        this.setState({
            filterSampleList: data,
            kendoFilterList: filter
        });
    }

    // ALPD-4132 Additional Filter change event hadler ATE-241
    handleFilterChange = (event) => {

        let masterData = this.props.Login.masterData || {};
        masterData['kendoFilterList'] = event.filter;

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData,
            }
        };
        this.props.updateStore(updateInfo);
    };

//  End of ALPD-4132 ATE241

    // covertDatetoString(startDateValue, endDateValue) {
    //     const startDate = new Date(startDateValue);
    //     const endDate = new Date(endDateValue);

    //     const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
    //     const currentMonth = validateTwoDigitDate(String(endDate.getMonth() + 1));
    //     const prevDay = validateTwoDigitDate(String(startDate.getDate()));
    //     const currentDay = validateTwoDigitDate(String(endDate.getDate()));

    //     const fromDateOnly = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay;
    //     const toDateOnly = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

    //     const fromDate = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay + "T00:00:00";
    //     const toDate = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay + "T23:59:59";
    //     return ({ fromDate, toDate, breadCrumbFrom: fromDateOnly, breadCrumbto: toDateOnly })
    // }
    onSecondaryPaneSizeChange = (e, val) => {

        // let hGrand = this.state.grandparentheight
        // let check = e - 400;
        // if (check > 1) {
        //     hGrand = this.state.parentHeight + check
        // }
        // this.setState({
        //     paneHeight: e - val,
        //     secondPaneHeight: hGrand - e - 70,
        //     grandparentheight: hGrand
        // })
        // this.setState({
        //     paneHeight: e - val,
        //     secondPaneHeight: this.state.parentHeight - e - 70
        // })
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
                    ncalibrationRequired: event.item.ncalibrationreq
                }
            }
            rsapi.post(uRL, inputData)
                .then(response => {
                    const TagInstrument = constructOptionList(response.data.Instrument || [], "ninstrumentcode",
                        "sinstrumentid", undefined, undefined, undefined);
                    const TagListInstrument = TagInstrument.get("OptionList")

                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            masterData: { ...this.props.Login.masterData, Instrument: TagListInstrument },
                            selectedRecord: {
                                ...this.props.Login.selectedRecord,
                                [fieldname]: event,
                                ninstrumentcode: TagInstrument.get("DefaultValue") ? TagInstrument.get("DefaultValue") : [],

                            }
                        }
                    }
                    this.props.updateStore(updateInfo);

                    // const selectedRecord = this.state.selectedRecord || {};
                    // selectedRecord[fieldname] = event;
                    // this.setState({ selectedRecord });

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
        this.setState({ showTest: true, showSample: false, showSubSample: false })
    }

    // getMeanTestParameter =(meanParam)=>{
    //     const inputData = {npreregno:meanParam.selectedRecord.npreregno,
    //                        userinfo:this.props.Login.userInfo}
    //     return rsapi.post("resultentrybysample/getMeanCalculationTestParameter", inputData)
    //         .then(response => {
    //            const list =  response.data || [];
    //            const optionList = [];
    //            list.map(item=>{optionList.push({item:item, label:item.stestsynonym+"-"+item.sparametername+"-"+item.sresult, value:item.ntransactiontestresultcode})})
    //            this.setState({meanTestParameterList:optionList});                
    //         })
    //         .catch(error => {
    //             if (error.response.status === 500) {
    //                 toast.error(error.message);
    //             } else {
    //                 toast.warn(error.response.data);
    //             }
    //         })
    // }

    showRESubSampleinfo() {
        this.setState({ showSample: false, showTest: true, showSubSample: !this.state.showSubSample })
    }
    testRETabDetail = () => {
        const testTabMap = new Map();
        //let npreregno = this.props.Login.masterData.RESelectedSample ? this.props.Login.masterData.RESelectedSample.map(sample => sample.npreregno).join(",") : "-1";
        let ntransactiontestcode = this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        let { testskip, testtake } = this.state
        let testList = this.props.Login.masterData.RE_TEST || [];
        testList = testList.slice(testskip, testskip + testtake);

        const meanControlId = this.state.controlMap.has("CalculateMean") && this.state.controlMap.get("CalculateMean").ncontrolcode

        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.RESelectedTest, "ntransactiontestcode");
        testTabMap.set("IDS_RESULTS", <ResultEntryResultsTab
            userInfo={this.props.Login.userInfo}
            genericLabel={this.props.Login.genericLabel}
            masterData={this.props.Login.masterData}
            inputParam={this.props.Login.inputParam}
            dataState={this.state.resultDataState}
            dataStateChange={this.dataStateChange}
            fetchRecord={this.props.parameterRecord}
            editpredefinedcomments={this.editpredefinedcomments}
            enforceResult={this.enforceResult}
            formulaCalculation={this.formulaCalculation}
            controlMap={this.state.controlMap}
            parameterParam={{ primaryKeyField: "ntransactionresultcode", masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43']) }}
            checkListRecord={this.checkListRecord}
            checklistParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43'])  }}
            selectedId={this.props.Login.selectedId || null}
            viewFile={this.props.viewAttachment}
            userRoleControlRights={this.state.userRoleControlRights}
            screenName="IDS_RESULTS"
            getMeanTestParameter={this.props.getMeanCalculationTestParameter}
            meanParam={{ "userInfo": this.props.Login.userInfo, ncontrolCode: meanControlId }}
        />)
        testTabMap.set("IDS_INSTRUMENT", <ApprovalInstrumentTab
            userInfo={this.props.Login.userInfo}
            genericLabel={this.props.Login.genericLabel}
            masterData={this.props.Login.masterData}
            inputParam={this.props.Login.inputParam}
            methodUrl={"ResultUsedInstrument"}
            controlMap={this.state.controlMap}
            deleteParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
            editParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
            dataState={this.state.instrumentDataState}
            selectedId={this.props.Login.selectedId || null}
            isActionRequired={true}
            dataStateChange={this.dataStateChange}
            deleteRecord={this.deleteInstrumentRecord}
            fetchRecord={this.fetchInstrumentRecord}
            userRoleControlRights={this.state.userRoleControlRights}
            screenName="IDS_INSTRUMENT"
        />)
        testTabMap.set("IDS_MATERIAL", <ResultUsedMaterial
            userInfo={this.props.Login.userInfo}
            genericLabel={this.props.Login.genericLabel}
            masterData={this.props.Login.masterData}
            inputParam={this.props.Login.inputParam}
            methodUrl={"ResultUsedMaterial"}
            controlMap={this.state.controlMap}
            deleteParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
            editParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
            dataState={this.state.materialDataState}
            selectedId={this.props.Login.selectedId || null}
            isActionRequired={true}
            dataStateChange={this.dataStateChange}
            deleteRecord={this.deleteMaterialRecord}
            fetchRecord={this.props.fetchMaterialRecord}
            userRoleControlRights={this.state.userRoleControlRights}
            screenName="IDS_MATERIAL"
        />)
        testTabMap.set("IDS_TASK", <ResultEntryTaskTab
            userInfo={this.props.Login.userInfo}
            genericLabel={this.props.Login.genericLabel}
            masterData={this.props.Login.masterData}
            inputParam={this.props.Login.inputParam}
            methodUrl={"ResultUsedTask"}
            addResultEntryTask={this.addResultEntryTask}
            controlMap={this.state.controlMap}
            deleteParam={{
                masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
                ncontrolcode: this.state.controlMap.has("DeleteResultUsedTask") && this.state.controlMap.get("DeleteResultUsedTask").ncontrolcode
            }}
            editParam={{
                masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
                ncontrolcode: this.state.controlMap.has("EditResultUsedTask") && this.state.controlMap.get("EditResultUsedTask").ncontrolcode
            }}
            dataState={this.state.taskDataState}
            selectedId={this.props.Login.selectedId || null}
            isActionRequired={true}
            dataStateChange={this.dataStateChange}
            deleteRecord={this.deleteTaskRecord}
            fetchRecord={this.fetchTaskRecord}
            //fetchRecord={this.fetchInstrumentRecord}
            userRoleControlRights={this.state.userRoleControlRights}
            screenName="IDS_TASK" />)
        testTabMap.set("IDS_TESTATTACHMENTS", <Attachments
            screenName="IDS_TESTATTACHMENTS"
            selectedMaster="RESelectedTest"
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
            nsubsampleneed={this.props.Login.masterData.realRegSubTypeValue.nneedsubsample}
            subFields={[{ [designProperties.VALUE]: "stestsynonym" }, { [designProperties.VALUE]: "dcreateddate" }]}
            userInfo={this.props.Login.userInfo}
            isneedReport={false}
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
                masterList: selectedTestList//this.props.Login.masterData.RESelectedTest
            }}
            selectedListName="IDS_TESTS"
            displayName="stestsynonym"
        />)
        testTabMap.set("IDS_TESTCOMMENTS", <Comments
            screenName="IDS_TESTCOMMENTS"
            isSampleTestComment={true}
            selectedMaster="RESelectedTest"
            onSaveClick={this.onCommentsSaveClick}
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            Comments={this.props.Login.masterData.RegistrationTestComment || []}
            fetchRecord={this.props.getCommentsCombo}
            addName={"AddTestComment"}
            editName={"EditTestComment"}
            deleteName={"DeleteTestComment"}
            methodUrl={"TestComment"}
            masterList={selectedTestList}
            masterAlertStatus={"IDS_SELECTTESTTOADDCOMMENTS"}
            primaryKeyField={"ntestcommentcode"}
            dataState={this.state.testCommentDataState}
            dataStateChange={this.dataStateChange}
            masterData={this.props.Login.masterData}
            isTestComment={true}

            deleteParam={
                {
                    methodUrl: "TestComment",
                    ntransactiontestcode,
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    esignRights: this.props.Login.userRoleControlRights,
                    screenName: "IDS_TESTCOMMENTS",
                    masterList: this.props.Login.masterData.RESelectedTest,
                    ncontrolCode: this.state.controlMap.has("DeleteTestComment") && this.state.controlMap.get("DeleteTestComment").ncontrolcode

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
                masterList: this.props.Login.masterData.RESelectedTest,
                ncontrolCode: this.state.controlMap.has("EditTestComment") && this.state.controlMap.get("EditTestComment").ncontrolcode

            }}
            selectedListName="IDS_TESTS"
            displayName="stestsynonym"
            selectedId={this.props.Login.selectedId || null}
        />)
        testTabMap.set("IDS_RESULTCHANGEHISTORY", <ResultChangeHistoryTab
            userInfo={this.props.Login.userInfo}
            genericLabel={this.props.Login.genericLabel}
            ApprovalResultChangeHistory={this.props.Login.masterData.ResultChangeHistory || []}
            inputParam={this.props.Login.inputParam}
            dataState={this.state.resultChangeDataState}
            dataStateChange={this.dataStateChange}
            screenName="IDS_RESULTCHANGEHISTORY"
            controlMap={this.state.controlMap}
            masterData={this.props.Login.masterData}
            userRoleControlRights={this.state.userRoleControlRights}
            selectedId={null}

        />)

        return testTabMap;
    }

    sampleDataStateChange = (event) => {
        switch (this.props.Login.activeSampleKey) {
            case "IDS_APPROVALHISTORY":
                this.setState({
                    sampleHistoryDataState: event.dataState
                })
                break;
            default:
                this.setState({
                    sampleGridDataState: event.dataState
                });
                break;
        }
    }

    sampleGridDataStateChange = (event) => {
        this.setState({ sampleGridDataState: event.dataState })
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
            case "IDS_SAMPLECOMMENTS":
                this.setState({
                    sampleChangeDataState: event.dataState
                });
                break;
            default:
                this.setState({
                    resultDataState: event.dataState
                });
                break;
        }
    }


    dataResultStateChange = (event) => {
        this.setState({ dataState: event.dataState })
    }

    // sampleTabDetail = () => {
    //     const tabMap = new Map();

    //     {
    //         this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.length === 1 ?
    //             tabMap.set("IDS_SAMPLEINFO", <SampleInfoView
    //                 data={this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.length > 0 ? this.props.Login.masterData.RESelectedSample[this.props.Login.masterData.RESelectedSample.length - 1] : {}}
    //                 SingleItem={this.state.SingleItem}
    //                 screenName="IDS_SAMPLEINFO"
    //             />) :
    //             tabMap.set("IDS_SAMPLEGRID", <SampleInfoGrid
    //                 selectedSample={this.props.Login.masterData.RESelectedSample}
    //                 dataState={this.state.dataState}
    //                 dataStateChange={this.dataStateChange}
    //                 detailedFieldList={this.state.SampleGridExpandableItem}
    //                 extractedColumnList={this.state.SampleGridItem}
    //                 userInfo={this.props.Login.userInfo}
    //                 inputParam={this.props.Login.inputParam}
    //                 screenName="IDS_SAMPLEGRID"
    //             />)
    //         // tabMap.set("IDS_SAMPLEATTACHMENTS", <></>)
    //         // tabMap.set("IDS_SAMPLECOMMENTS", <></>)
    //         // tabMap.set("IDS_SUBSAMPLEATTACHMENTS", <></>)
    //         // tabMap.set("IDS_SUBSAMPLECOMMENTS", <></>)
    //         return tabMap;
    //     }
    // }



    sampleTabDetail() {
        const tabMap = new Map();
        let npreregno = this.props.Login.masterData.RESelectedSample ? this.props.Login.masterData.RESelectedSample.map(sample => sample.npreregno).join(",") : "-1";
        tabMap.set("IDS_SAMPLEATTACHMENTS",
            <Attachments
                screenName="IDS_SAMPLEATTACHMENTS"
                selectedMaster={this.props.Login.masterData.RESelectedSample}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                attachments={this.props.Login.masterData.RegistrationAttachment || []}
                deleteRecord={this.props.deleteAttachment}
                onSaveClick={this.onAttachmentSaveClick}
                masterList={this.props.Login.masterData.RESelectedSample}
                masterAlertStatus={"IDS_SELECTSAMPLETOADDATTACHEMENT"}
                fetchRecord={this.props.getAttachmentCombo}
                addName={"AddSampleAttachment"}
                editName={"EditSampleAttachment"}
                deleteName={"DeleteSampleAttachment"}
                viewName={"ViewSampleAttachment"}
                methodUrl={"SampleAttachment"}
                nsubsampleneed={this.props.Login.masterData.realRegSubTypeValue.nneedsubsample}
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
                    masterList: this.props.Login.masterData.RESelectedSample

                }}
                selectedListName="IDS_ARNUMBER"
                displayName="sarno"
                isneedHeader={true}
            />)
        tabMap.set("IDS_SAMPLECOMMENTS", <Comments
            screenName="IDS_SAMPLECOMMENTS"
            onSaveClick={this.onCommentsSaveClick}
            selectedMaster="RESelectedSample"
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
            masterList={this.props.Login.masterData.RESelectedSample}
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
                masterList: this.props.Login.masterData.RESelectedSample || [],
                ncontrolCode: this.state.controlMap.has("EditSampleComment") && this.state.controlMap.get("EditSampleComment").ncontrolcode
            }}
            selectedListName="IDS_ARNUMBER"
            displayName="sarno"
            selectedId={this.props.Login.selectedId || null}
        />)

        tabMap.set("IDS_SAMPLEAPPROVALHISTORY",
            <SampleApprovalHistory
                userInfo={this.props.Login.userInfo}
                ApprovalHistory={this.props.Login.masterData.SampleApprovalHistory}
                inputParam={this.props.Login.inputParam}
                dataState={this.state.sampleHistoryDataState}
                dataStateChange={this.sampleDataStateChange}
                masterData={this.props.Login.masterData}
                screenName="IDS_SAMPLEAPPROVALHISTORY"
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                selectedId={null}
            />)


        return tabMap;
    }



    subsampleTabDetail = () => {
        let ntransactionsamplecode = this.props.Login.masterData.RESelectedSubSample ?
            this.props.Login.masterData.RESelectedSubSample.map(sample => sample.ntransactionsamplecode).join(",") : "-1";
        const tabMap = new Map();
        let subsampleList = this.props.Login.masterData.RE_SUBSAMPLE || [];
        let { subsampleskip, subsampletake } = this.state
        subsampleList = subsampleList.slice(subsampleskip, subsampleskip + subsampletake);
        let selectedSubSampleList = getSameRecordFromTwoArrays(subsampleList, this.props.Login.masterData.RESelectedSubSample, "ntransactionsamplecode");

        tabMap.set("IDS_SUBSAMPLEATTACHMENTS", <Attachments
            screenName="IDS_SUBSAMPLEATTACHMENTS"
            onSaveClick={this.onAttachmentSaveClick}
            selectedMaster="selectedSubSample"
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            attachments={this.props.Login.masterData.RegistrationSampleAttachment || []}
            deleteRecord={this.props.deleteAttachment}
            masterList={this.props.Login.masterData.RESelectedSubSample}
            masterAlertStatus={"IDS_SELECTSUBSAMPLETOADDATTACHMENT"}
            fetchRecord={this.props.getAttachmentCombo}
            viewFile={this.props.viewAttachment}
            addName={"AddSubSampleAttachment"}
            editName={"EditSubSampleAttachment"}
            deleteName={"DeleteSubSampleAttachment"}
            viewName={"ViewSubSampleAttachment"}
            methodUrl={"SubSampleAttachment"}
            nsubsampleneed={this.props.Login.masterData.realRegSubTypeValue.nneedsubsample}
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
                masterList: this.props.Login.masterData.RE_SUBSAMPLE || []

            }}
            selectedListName="IDS_SAMPLEARNO"
            displayName="ssamplearno"
            isneedHeader={true}
        />)
        tabMap.set("IDS_SUBSAMPLECOMMENTS", <Comments
            screenName="IDS_SUBSAMPLECOMMENTS"
            onSaveClick={this.onCommentsSaveClick}
            selectedMaster="RESelectedSubSample"
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
            masterList={this.props.Login.masterData.RESelectedSubSample}
            masterAlertStatus="IDS_SELECTSUBSAMPLETOADDCOMMENTS"
            primaryKeyField={"nsamplecommentcode"}
            dataState={this.state.subSampleCommentDataState}
            dataStateChange={this.subSampledataStateChange}
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
                masterList: this.props.Login.masterData.RE_SUBSAMPLE || [],
                ncontrolCode: this.state.controlMap.has("EditSubSampleComment") && this.state.controlMap.get("EditSubSampleComment").ncontrolcode
            }}
            selectedListName="IDS_SAMPLEARNO"
            displayName="ssamplearno"
            selectedId={this.props.Login.selectedId || null}
        />)

        return tabMap;
    }

    onSampleTabChange = (tabProps) => {
        const activeSampleTab = tabProps.screenName;
        if (activeSampleTab !== this.props.Login.activeSampleTab) {
            let inputData = {
                masterData: this.props.Login.masterData,
                RESelectedSample: this.props.Login.masterData.RESelectedSample,
                npreregno: this.props.Login.masterData.RESelectedSample ? this.props.Login.masterData.RESelectedSample.map(item => item.npreregno).join(",") : "-1",
                userinfo: this.props.Login.userInfo,
                screenName: activeSampleTab,
                activeSampleTab,
                activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex
            }
            this.props.getSampleChildTabDetail(inputData)
        }
    }

    onTestTabChange = (tabProps) => {
        const activeTestKey = tabProps.screenName;
        if (activeTestKey !== this.props.Login.activeTestKey) {
            if (this.props.Login.masterData.RESelectedTest && this.props.Login.masterData.RESelectedTest.length > 0) {
                let inputData = {
                    masterData: this.props.Login.masterData,
                    ntransactiontestcode: this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
                    npreregno: this.props.Login.masterData.RESelectedSample ? this.props.Login.masterData.RESelectedSample.map(preregno => preregno.npreregno).join(",").toString() : "",
                    RESelectedTest: this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest : "",
                    // ntransactiontestcode: this.props.Login.masterData.RESelectedTest ?
                    //     this.props.Login.masterData.selectedTestCode : this.props.Login.masterData.RESelectedTest ?
                    //         String(this.props.Login.masterData.RESelectedTest.ntransactiontestcode) : "-1",
                    userinfo: this.props.Login.userInfo,
                    activeTestKey: activeTestKey,
                    screenName: activeTestKey,
                    resultDataState: this.state.resultDataState,
                    instrumentDataState: this.state.instrumentDataState,
                    materialDataState: this.state.materialDataState,
                    taskDataState: this.state.taskDataState,
                    documentDataState: this.state.documentDataState,
                    resultChangeDataState: this.state.resultChangeDataState,
                    testCommentDataState: this.state.testCommentDataState,
                    sampleChangeDataState: this.state.sampleChangeDataState
                }
                this.props.getTestChildTabREDetail(inputData, true);
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }));
            }
        }
    }

    openClosePortal = (test) => {
        if (this.props.Login.openELNSheet === undefined || !this.props.Login.openELNSheet) {
            this.props.Login.masterData.enlLink = "";
            // if(test.RESelectedTest.length === 1)
            // {           
            this.props.getELNTestValidation(test, this.props.Login.integrationSettings);
            // }
            // else{
            //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTONLYONETEST" }));
            // }
        }
        else {
            //this.props.Login.masterData.enlLink=undefined;

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openELNSheet: false,
                    masterData: {
                        openELNSheet: false,
                        ...this.props.Login.masterData,
                        enlLink: ""
                    }

                }
            }
            this.props.updateStore(updateInfo);
        }

        /*openClosePortal = (test) => {
            if(this.state.openELNSheet === false )
            {
                this.props.Login.masterData.enlLink="";
            // if(test.RESelectedTest.length === 1)
            // {           
                    this.props.getELNTestValidation(test,this.props.Login.integrationSettings);            
            // }
            // else{
            //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTONLYONETEST" }));
            // }
        }
            else{
               //this.props.Login.masterData.enlLink=undefined;
    
                // const updateInfo = {
                //    typeName: DEFAULT_RETURN,
                //     data: {
                //         openELNSheet: false,
                //         masterData: {
                //             openELNSheet: false,
                //             ...this.props.Login.masterData,  
                //             enlLink:""
                //         },
                //         enlLink:""                 
                //     }
                    
                // }
                //this.props.updateStore(updateInfo);
                this.setState({ openELNSheet: false,  enlLink:"" })
            }
            // if (this.state.openELNSheet === false) {
                // if (test.test.selensheetname !== null) {
                    /*let enlLink = "";
                       const elnuser= {
                         usercode: test.elnUserInfo.nelncode,
                         username: test.elnUserInfo.selnusername,
                         userfullname: test.elnUserInfo.selnusername,
                        lsusergroup: {
                         usergroupcode: test.elnUserInfo.nelnusergroupcode,
                         usergroupname: test.elnUserInfo.nelnusergroupcode,
                         },
                        //  lssitemaster:{ sitecode:sitecode }
                        }
    
                        const user = CF_encryptionData(elnuser).EncryptData;
                    const enlcredential = {
                        ElnUser: CF_encryptionData(this.props.Login.settings[20]).EncryptData,
                        Elntenant: CF_encryptionData("-1").EncryptData,
                        Elnloginfrom: CF_encryptionData("-1").EncryptData,
                        //Elntoken: CF_encryptionData("").EncryptData,
                        Elnpassword: CF_encryptionData(this.props.Login.settings[21]).EncryptData,
                        Elnsitecode: CF_encryptionData(this.props.Login.settings[22]).EncryptData,
                        Elnsitename: CF_encryptionData(this.props.Login.settings[23]).EncryptData,
                        Elnusergroupname: CF_encryptionData(this.props.Login.settings[24]).EncryptData,
                        Elnusergroupcode: CF_encryptionData(this.props.Login.settings[25]).EncryptData,
                    }
    
                    //Axios.post("http://5.189.171.17:8095/ELN-0.0.1-SNAPSHOT/authenticate",inputou)
                    //Axios.post(this.props.Login.settings[27], inputou)
                    // Axios.post("https://logilabelntesting.azurewebsites.net/", user)
                    //     .then(response => {
                            const testname = test.test.stestname.substring(0, test.test.stestname.indexOf("[")).trim();
    
                            //const batchId = test.test.sarno+'-'+test.test.stestname;
                            const batchId = test.test.sarno + '-' + testname;
                            const ntransactiontestcode = CF_encryptionData(batchId//test.RESelectedTest[0].ntransactiontestcode
                            ).EncryptData;
                            // const Elntoken = CF_encryptionData("Bearer " + response.data.token).EncryptData;
    
    
                            // const link =
                            //     //window.location.href.toString() 
                            //     "" +
                            //     '#{"orderid":"' +
                            //     ntransactiontestcode +
                            //     '","u":"' +
                            //     enlcredential.ElnUser +
                            //     '","t":"' +
                            //     enlcredential.Elntenant +
                            //     '","l":"' +
                            //     enlcredential.Elnloginfrom +
                            //     '","k":"' +
                            //     Elntoken +
                            //     //response.data.token+
                            //     '","uc":"' +
                            //     enlcredential.Elnusergroupcode +
                            //     '","ug":"' +
                            //     enlcredential.Elnusergroupname +
                            //     '","sc":"' +
                            //     enlcredential.Elnsitecode +
                            //     '","sn":"' +
                            //     enlcredential.Elnsitename +
                            //     '","LO":"' +
                            //     ntransactiontestcode +
                            //     '"}';
    
                            const link =
                                //window.location.href.toString() 
                                "" +
                                '#{"orderid":"' +
                                ntransactiontestcode +
                                '","user":"' +
                                user +
                                '","batchid":"' +
                                ntransactiontestcode +
                                '"}';
                            
                            //enlLink = "https://logilabelntest.azurewebsites.net/vieworder".concat(link);
                            enlLink="https://logilabelntesting.azurewebsites.net/";
                            console.log("eln link:", enlLink);
                            //}
                            // this.setState({ openELNSheet: !this.state.openELNSheet, nflag: 1, enlLink })
                            this.setState({ openELNSheet: true, nflag: 1, enlLink })
                            //this.props.encryptionData(test);
                        // })
                        //this.getActiveTestURL() 
                        // .catch(response => { })
                // }
                // else {
                //     toast.warn(this.props.intl.formatMessage({ id: "IDS_NOSHEETFORTHISTEST" }));
    
                // }
    /*}
    else {
                this.setState({ openELNSheet: !this.state.openELNSheet, nflag: 1 })
    
                let testChildGetREParam = {
                    masterData: this.props.Login.masterData,
                    userinfo: this.props.Login.userInfo,
                    nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                    napprovalversioncode: this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode,
                    ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
                    ntestcode: this.props.Login.masterData.realTestcodeValue && this.props.Login.masterData.realTestcodeValue.ntestcode,
                    npreregno: this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.map(sample => sample.npreregno).join(","),
                    ntransactionsamplecode: this.props.Login.masterData.RESelectedSubSample && this.props.Login.masterData.RESelectedSubSample.map(sample => sample.ntransactionsamplecode).join(","),
                    activeTestKey: 'IDS_RESULTS',
                    testskip: this.state.testskip,
                    testtake: this.state.testtake,
                    resultDataState: this.state.resultDataState,
                    instrumentDataState: this.state.instrumentDataState,
                    materialDataState: this.state.materialDataState,
                    taskDataState: this.state.taskDataState,
                    documentDataState: this.state.documentDataState,
                    resultChangeDataState: this.state.resultChangeDataState,
                    testCommentDataState: this.state.testCommentDataState,
                    RESelectedTest: this.props.Login.masterData.RESelectedTest
                }
    
                this.props.getTestChildTabREDetail(testChildGetREParam, true)
    
    
    
                //this.filterTestParam
            }*/

    }

    onSubSampleTabChange = (tabProps) => {
        const activeSubSampleTab = tabProps.screenName;
        if (activeSubSampleTab !== this.props.Login.activeSubSampleTab) {
            let inputData = {
                masterData: this.props.Login.masterData,
                selectedSubSample: this.props.Login.masterData.RESelectedSubSample,
                ntransactionsamplecode: this.props.Login.masterData.RESelectedSubSample ? this.props.Login.masterData.RESelectedSubSample.map(item => item.ntransactionsamplecode).join(",") : "-1",
                userinfo: this.props.Login.userInfo,
                screenName: activeSubSampleTab,
                activeSubSampleTab,
                subSampleCommentDataState: this.state.subSampleCommentDataState,
                subSampleAttachmentDataState: this.state.subSampleAttachmentDataState,
                activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex
            }
            this.props.getSubSampleChildTabDetail(inputData)
        }
    }


    viewSample = (viewdetails) => {
        this.props.ResultEntryViewPatientDetails(this.props.Login.masterData, "IDS_PREVIOUSRESULTVIEW", this.props.Login.userInfo, viewdetails);
    };

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

    testMethodSourceEdit = (test) => {
        this.props.testMethodSourceEdit(test)
    }

    addREInstrument = (test) => {
        this.props.addREInstrument(test)
    }
    adhocParameter = (test) => {
        const inputData = {
            ntestcode: test.test.ntestcode,
            ntestgrouptestcode: test.test.ntestgrouptestcode,
            ntransactiontestcode: test.test.ntransactiontestcode,
            npreregno: test.test.npreregno,
            masterData: this.props.Login.masterData,
            userinfo: test.userInfo,
            adhocId: test.adhocId
        }
        if (this.props.Login.masterData.realSampleTypeValue.nclinicaltyperequired === transactionStatus.YES) {
            this.props.addREAdhocParamter(inputData)
        } else {
            this.props.addREAdhocTestParamter(inputData)
        }
    }
    // adhocTestParameter=(test)=>{
    //     const inputData = {
    //         ntestcode: test.test.ntestcode,
    //         ntestgrouptestcode: test.test.ntestgrouptestcode,
    //         ntransactiontestcode: test.test.ntransactiontestcode,
    //         npreregno:test.test.npreregno,
    //         masterData: this.props.Login.masterData,
    //         userinfo: test.userInfo,
    //         adhocId:test.adhocId
    //     }
    //         this.props.addREAdhocTestParamter(inputData)
    // }

    deleteInstrumentRecord = (test) => {
        const ndesigntemplatemappingcode = parseInt(this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode);
        test = { ...test, 'ndesigntemplatemappingcode': ndesigntemplatemappingcode }
        let inputParam = {
            inputData: { ...test, 'ndesigntemplatemappingcode': ndesigntemplatemappingcode, 'userinfo': this.props.Login.userInfo },
            // formData: formData,
            // isFileupload: true,
            operation: "deleteInstrument",
            screenName: "deleteInstrumentAction",
            displayName: this.props.Login.inputParam.displayName,//, postParam,
            //test: test
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, test.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true,
                    screenName: "deleteInstrumentAction",
                    operation: "deleteInstrument"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.deleteInstrumentRecord(test)
        }


    }
    fetchInstrumentRecord = (test) => {
        this.props.fetchInstrumentRecord(test)
    }
    fetchMaterialRecord = (test) => {
        this.props.fetchMaterialRecord(test)
    }

    //Aravindh
    deleteMaterialRecord = (test) => {
        const nregtypecode = parseInt(this.props.Login.masterData.realRegTypeValue.nregtypecode);
        const nregsubtypecode = parseInt(this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode);
        const ndesigntemplatemappingcode = parseInt(this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode);

        test = { ...test, nregtypecode: nregtypecode, nregsubtypecode: nregsubtypecode, ndesigntemplatemappingcode: ndesigntemplatemappingcode }
        let inputParam = {
            inputData: {
                ...test.selectedRecord,
                nregtypecode: nregtypecode, nregsubtypecode: nregsubtypecode, ndesigntemplatemappingcode: ndesigntemplatemappingcode,
                ntransactiontestcode: test.masterData.RESelectedTest ?
                    test.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
                userinfo: this.props.Login.userInfo
            },
            // formData: formData,
            // isFileupload: true,

            classUrl: 'resultentrybysample',
            methodUrl: "ResultUsedMaterial",
            operation: "delete",
            //screenName: "deleteMaterialAction",
            displayName: this.props.Login.inputParam.displayName,//, postParam,
            //test: test
            nresultusedmaterialcode: test.selectedRecord.nresultusedmaterialcode,
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, test.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true,
                    screenName: "deleteMaterialAction",
                    operation: "deleteMaterial"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
            //this.props.deleteResultUsedMaterial(test)
        }


    }

    deleteTaskRecord = (test) => {
        const ndesigntemplatemappingcode = parseInt(this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode);

        test = { ...test, ndesigntemplatemappingcode: ndesigntemplatemappingcode }
        let inputParam = {
            inputData: { ...test, 'userinfo': this.props.Login.userInfo },
            // formData: formData,
            // isFileupload: true,
            operation: "deleteTask",
            displayName: this.props.Login.inputParam.displayName,//, postParam,
            //test: test
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, test.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true,
                    screenName: "deleteTaskaction",
                    operation: "deleteTask"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.deleteTaskRecord(test)
        }

    }
    fetchTaskRecord = (test) => {
        this.props.fetchTaskRecord(test)
    }
    addResultEntryTask = (inputData) => {
        let selectedRecord = {}
        let selectedRecordTaskForm = {}
        selectedRecord = {
            npreregno: inputData.npreregno,
            ntransactiontestcode: inputData.ntransactiontestcode,
            stestsynonym: inputData.stestsynonym
        }
        selectedRecordTaskForm = {
            npreregno: inputData.npreregno,
            ntransactiontestcode: inputData.ntransactiontestcode,
            stestsynonym: inputData.stestsynonym
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord: selectedRecord,
                selectedRecordTaskForm: selectedRecordTaskForm,
                operation: "create",
                screenName: "IDS_TASK",
                openModal: true,
                activeTestKey: "IDS_TASK",
                isTaskInitialRender: true,
                ncontrolcode: inputData.addResultUsedTaskId,
                selectedId: null
            }
        }
        this.props.updateStore(updateInfo);

    }

    checkListRecord = (parameterData) => {
        this.props.checkListRecord(parameterData, this.props.Login.userInfo)
    }
    getFormula = (parameterData, userInfo, masterData, index, event) => {
        this.setState({
            modalEvent: event.currentTarget
        })
        this.props.getFormula(parameterData, userInfo, masterData, index, this.state.selectedRecord)
    }

    getAverageResult = (event, parameterData, index, selectedForumulaInput, masterData, selectedRecord) => {

        if (!selectedRecord.selectedForumulaInput[index].senableAverage) {
            this.props.getAverageResult(parameterData, index, selectedForumulaInput, this.props.Login.userInfo, masterData, selectedRecord);
        }
        else {
            selectedForumulaInput[index].senableAverage = !selectedRecord.selectedForumulaInput[index].senableAverage;
            selectedForumulaInput[index].svalues = selectedForumulaInput[index].soldvalue;

            this.setState({
                selectedRecord: {
                    ...selectedRecord,
                    selectedForumulaInput
                }
            })
        }


    }
    calculateFormula = () => {
        const selectedRecord = this.state.selectedRecord || []
        const selectedForumulaInput = selectedRecord.selectedForumulaInput || []
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
                selectedResultGrade: this.state.selectedRecord.selectedResultGrade,
                ResultParameter: this.state.selectedRecord.ResultParameter || {}
            }
            this.props.calculateFormula(inputData)
        }
    }

    componentDidMount() {
        if (this.parentHeight) {
            const height = this.parentHeight.clientHeight;
            this.setState({
                firstPane: height - 80,
                parentHeight: height
            });
        }
    }
    getActiveTestURL() {
        let url = "resultentrybysample/getTestbasedParameter"
        switch (this.props.Login.activeTestKey) {
            case "IDS_RESULTS":
                url = "resultentrybysample/getTestbasedParameter"
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
            case "IDS_DOCUMENTS":
                url = "attachment/getSampleAttachment"
                break;
            case "IDS_RESULTCHANGEHISTORY":
                url = "resultentrybysample/getResultChangeHistory"
                break;
            case "IDS_APPROVALHISTORY":
                url = "resultentrybysample/getSampleApprovalHistory"
                break;
            case "IDS_SAMPLEATTACHMENTS":
                url = "attachment/getSampleAttachment"
                break;
            default:
                url = "resultentrybysample/getTestbasedParameter"
                break;
        }
        return url;
    }
    //Added by sonia for ALPD-4084 on May 2 2024 Export action
    // exportExcelHeader = (testChildGetREParam,RESelectedTest,userInfo, exportId, testskip,testtake) => {

    //     let TestList = [...this.props.Login.masterData.RE_TEST];
    //     TestList = TestList.splice(testskip, testskip + testtake);
    //     let exportTestList = getSameRecordFromTwoArrays(TestList, RESelectedTest, "ntransactiontestcode");
    //     if (exportTestList && exportTestList.length > 0) {
    //         let inputParam ={};      
    //             let Map = {
    //                 nregtypecode : testChildGetREParam.nregtypecode,
    //                 nregsubtypecode : testChildGetREParam.nregsubtypecode,
    //                 ncontrolcode: exportId,
    //                 transactiontestcode: exportTestList ? exportTestList.map(test => test.ntransactiontestcode).join(",") : "",
    //                 RESelectedTest: exportTestList,
    //                 skip: this.state.skip,
    //                 take: this.state.take,
    //                 testskip: this.state.testskip,
    //                 testtake: this.state.testtake,
    //                 subSampleSkip: this.state.subSampleSkip,
    //                 subSampleTake: this.state.subSampleTake,
    //                 userinfo: userInfo,
    //                 operation: 'exportAction',
    //             }  
    //             inputParam = {
    //                 inputData: Map,
    //             }            
    //             this.props.exportAction(inputParam);            
            
          
    //     }
    //     else {
    //         toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }));
    //     }




    // }

//Added by sonia for ALPD-4084 on May  17 2024 Export action
    exportExcelHeader = (SampleList,userInfo, exportId) => {       
        if (SampleList && SampleList.length > 0) {
            let inputParam ={};      
                let Map = {
                    nregtypecode :this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                    nregsubtypecode :this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                    ntestcode : this.props.Login.masterData.realTestcodeValue && this.props.Login.masterData.realTestcodeValue.ntestcode,
                    ntransactionstatus : this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
                    ncontrolcode: exportId,
                    npreregno: SampleList ? SampleList.map(sample => sample.npreregno).join(",") : "",                   
                    userinfo: userInfo,
                    operation: 'exportAction',
                }  
                inputParam = {
                    inputData: Map,
                }            
                this.props.exportAction(inputParam); 
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }));
        }
    }

    //Added by sonia for ALPD-4084 on May 2 2024 Import action
    resultImport= (importId) => {
        this.props.Login.masterData.selectedImportFile = []
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                screenName: "IDS_RESULTIMPORTFILE",
                openModal: true,
                loadFile: true,
                activeTestKey: "IDS_RESULTS",
                masterData: this.props.Login.masterData,
                importId: importId
            }
        }
        this.props.updateStore(updateInfo);
    }

    closeFilter = () => {
        let inputValues = {
            SampleType: this.props.Login.masterData.realSampleTypeList || [],
            SampleTypeValue: this.props.Login.masterData.realSampleTypeValue || {},
            RegistrationType: this.props.Login.masterData.realRegistrationTypeList || [],
            RegTypeValue: this.props.Login.masterData.realRegTypeValue || {},
            RegistrationSubType: this.props.Login.masterData.realRegistrationSubTypeList || [],
            RegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue || {},
            DesignTemplateMappingValue: this.props.Login.masterData.realDesignTemplateMapping || {},
            DesignTemplateMapping: this.props.Login.masterData.realDesignTemplateMappingList || [],
            REFilterStatus: this.props.Login.masterData.realFilterStatusList || [],
            FilterStatusValue: this.props.Login.masterData.realFilterStatusValue || {},
            ApprovalConfigVersion: this.props.Login.masterData.realApprovalConfigVersionList || [],
            ApprovalVersionValue: this.props.Login.masterData.realApproveConfigVersion || {},
            // REJobStatus:this.state.REJobStatus || [],
            JobStatusValue: this.props.Login.masterData.defaultjobstatus || {},
            Testvalues: this.props.Login.masterData.realTestvaluesList || [],
            Batchvalues: this.props.Login.masterData.realBatchvaluesList || [],
            BatchValue: this.props.Login.masterData.realBatchvalue || {},
            Worklistvalues: this.props.Login.masterData.RealWorklistvaluesList || [],
            WorklistValue: this.props.Login.masterData.realWorklistvalue || {},
            TestValue: this.props.Login.masterData.realTestcodeValue || {},
            ConfigurationFilterValues: this.props.Login.masterData.realConfigurationFilterValuesList || [],
            ConfigurationFilterValue: this.props.Login.masterData.realdefaultConfigurationFilterValue || {},
            defaultSampleType: this.props.Login.masterData.realSampleTypeValue || {},
            defaultRegistrationType: this.props.Login.masterData.realRegTypeValue || {},
            defaultRegistrationSubType: this.props.Login.masterData.realRegSubTypeValue || {},
            defaultFilterStatus: this.props.Login.masterData.realFilterStatusValue || {},
            defaultApprovalConfigVersion: this.props.Login.masterData.realApproveConfigVersion || {},
            defaultBatchvalue: this.props.Login.masterData.realBatchvalue || {},
            defaultWorklistvalue: this.props.Login.masterData.realWorklistvalue || {},
            defaultTestvalues: this.props.Login.masterData.realTestcodeValue || {},
            defaultConfigurationFilterValue: this.props.Login.masterData.realdefaultConfigurationFilterValue || {},
            fromDate: this.props.Login.masterData.realFromDate || new Date(),
            toDate: this.props.Login.masterData.realToDate || new Date()
            // DynamicDesignMapping:this.state.stateDynamicDesign || []
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false, masterData: { ...this.props.Login.masterData, ...inputValues } }
        }
        this.props.updateStore(updateInfo);
    }

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
        //setTimeout(() => { this._scrollBarRef.updateScroll() })
    }
    handleSubSamplePageChange = e => {
        this.setState({
            subSampleSkip: e.skip,
            subSampleTake: e.take
        });
        //setTimeout(() => { this._scrollBarRef.updateScroll() })
    }
    handleTestPageChange = e => {
        this.setState({
            testskip: e.skip,
            testtake: e.take,
            sampletakeDataState: e.take
        });
    };
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


    sideNavDetail = (screenName) => {
        let { testskip, testtake } = this.state
        let testList = this.props.Login.masterData.searchedTest ? [...this.props.Login.masterData.searchedTest] : this.props.Login.masterData.RE_TEST || [];
        const editTestCommentsId = this.state.controlMap.has("EditTestComment") && this.state.controlMap.get("EditTestComment").ncontrolcode;
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.RESelectedTest, "ntransactiontestcode");
        // let npreregno = this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",") : "-1";
        let ntransactiontestcode = this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";

        return (
            screenName == "IDS_RESULTS" ?
                <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_RESULTS"} tabDetail={this.resultTabDetail()} onTabChange={this.onTabChange} />
                : screenName == "IDS_ATTACHMENTS" ?
                    <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS"} tabDetail={this.attachmentTabDetail()} destroyInactiveTabPane={true} onTabChange={this.onTabChange} />
                    : screenName == "IDS_COMMENTS" ?
                        <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_TESTCOMMENTS"} tabDetail={this.commentTabDetail()} destroyInactiveTabPane={true} onTabChange={this.onTabChange} />
                        :
                        screenName == "IDS_INSTRUMENT" ?
                            <ApprovalInstrumentTab
                                userInfo={this.props.Login.userInfo}
                                genericLabel={this.props.Login.genericLabel}
                                masterData={this.props.Login.masterData}
                                inputParam={this.props.Login.inputParam}
                                methodUrl={"ResultUsedInstrument"}
                                controlMap={this.state.controlMap}
                                deleteParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
                                editParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
                                dataState={this.state.instrumentDataState}
                                selectedId={this.props.Login.selectedId || null}
                                isActionRequired={true}
                                dataStateChange={this.dataStateChange}
                                deleteRecord={this.deleteInstrumentRecord}
                                fetchRecord={this.fetchInstrumentRecord}
                                userRoleControlRights={this.state.userRoleControlRights}
                                screenName="IDS_INSTRUMENT"
                            />
                            :
                            screenName == "IDS_MATERIAL" ?
                                <ResultUsedMaterial
                                    userInfo={this.props.Login.userInfo}
                                    genericLabel={this.props.Login.genericLabel}
                                    masterData={this.props.Login.masterData}
                                    inputParam={this.props.Login.inputParam}
                                    methodUrl={"ResultUsedMaterial"}
                                    controlMap={this.state.controlMap}
                                    deleteParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
                                    editParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
                                    dataState={this.state.materialDataState}
                                    selectedId={this.props.Login.selectedId || null}
                                    isActionRequired={true}
                                    dataStateChange={this.dataStateChange}
                                    deleteRecord={this.deleteMaterialRecord}
                                    fetchRecord={this.props.fetchMaterialRecord}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    screenName="IDS_MATERIAL"
                                />
                                :
                                screenName == "IDS_TASK" ?
                                    <ResultEntryTaskTab
                                        userInfo={this.props.Login.userInfo}
                                        genericLabel={this.props.Login.genericLabel}
                                        masterData={this.props.Login.masterData}
                                        inputParam={this.props.Login.inputParam}
                                        methodUrl={"ResultUsedTask"}
                                        addResultEntryTask={this.addResultEntryTask}
                                        controlMap={this.state.controlMap}
                                        deleteParam={{
                                            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
                                            ncontrolcode: this.state.controlMap.has("DeleteResultUsedTask") && this.state.controlMap.get("DeleteResultUsedTask").ncontrolcode
                                        }}
                                        editParam={{
                                            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
                                            ncontrolcode: this.state.controlMap.has("EditResultUsedTask") && this.state.controlMap.get("EditResultUsedTask").ncontrolcode
                                        }}
                                        dataState={this.state.taskDataState}
                                        selectedId={this.props.Login.selectedId || null}
                                        isActionRequired={true}
                                        dataStateChange={this.dataStateChange}
                                        deleteRecord={this.deleteTaskRecord}
                                        fetchRecord={this.fetchTaskRecord}
                                        //fetchRecord={this.fetchInstrumentRecord}
                                        userRoleControlRights={this.state.userRoleControlRights}
                                        screenName="IDS_TASK" />
                                    :
                                    screenName == "IDS_SAMPLEDETAILS" ?
                                        this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.length === 1 ?
                                            <SampleInfoView
                                                data={this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.length > 0
                                                    ? this.props.Login.masterData.RESelectedSample[this.props.Login.masterData.RESelectedSample.length - 1] : {}}
                                                SingleItem={this.state.SingleItem}

                                                screenName="IDS_SAMPLEINFO"
                                                userInfo={this.props.Login.userInfo}
                                            /> :
                                            <SampleInfoGrid
                                                selectedSample={this.props.Login.masterData.RESelectedSample}
                                                dataState={this.state.sampleGridDataState}
                                                dataStateChange={this.sampleGridDataStateChange}
                                                extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem) || []}
                                                detailedFieldList={this.gridfillingColumn(this.state.DynamicGridMoreField) || []}
                                                userInfo={this.props.Login.userInfo}
                                                inputParam={this.props.Login.inputParam}
                                                screenName="IDS_SAMPLEGRID"
                                                jsonField={"jsondata"}
                                                expandField="expanded"
                                            />

                                        : ""
        )
    }


    resultTabDetail = () => {
        const resultTabMap = new Map();
        //let ntransactiontestcode = this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        // let { testskip, testtake } = this.state
        // let testList = this.props.Login.masterData.RE_TEST || [];
        // testList = testList.slice(testskip, testskip + testtake);
        const meanControlId = this.state.controlMap.has("CalculateMean") && this.state.controlMap.get("CalculateMean").ncontrolcode
        //let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.RESelectedTest, "ntransactiontestcode");


        resultTabMap.set("IDS_RESULTS", <ResultEntryResultsTab
            tabSequence={SideBarSeqno.TEST}
            userInfo={this.props.Login.userInfo}
            genericLabel={this.props.Login.genericLabel}
            masterData={this.props.Login.masterData}
            inputParam={this.props.Login.inputParam}
            dataState={this.state.resultDataState}
            dataStateChange={this.dataStateChange}
            fetchRecord={this.props.parameterRecord}
            controlMap={this.state.controlMap}
            parameterParam={{ primaryKeyField: "ntransactionresultcode", masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43']) }}
            checkListRecord={this.checkListRecord}
            editpredefinedcomments={this.editpredefinedcomments}
            enforceResult={this.enforceResult}
            formulaCalculation={this.formulaCalculation}
            checklistParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43'])  }}
            selectedId={this.props.Login.selectedId || null}
            viewFile={this.props.viewAttachment}
            userRoleControlRights={this.state.userRoleControlRights}
            screenName="IDS_RESULTS"
            getMeanTestParameter={this.props.getMeanCalculationTestParameter}
            meanParam={{ "userInfo": this.props.Login.userInfo, ncontrolCode: meanControlId }}
        />)

        resultTabMap.set("IDS_RESULTCHANGEHISTORY",
            <ResultChangeHistoryTab
                tabSequence={SideBarSeqno.TEST}
                userInfo={this.props.Login.userInfo}
                genericLabel={this.props.Login.genericLabel}
                ApprovalResultChangeHistory={this.props.Login.masterData.ResultChangeHistory || []}
                inputParam={this.props.Login.inputParam}
                dataState={this.state.resultChangeDataState}
                dataStateChange={this.dataStateChange}
                screenName="IDS_RESULTCHANGEHISTORY"
                controlMap={this.state.controlMap}
                masterData={this.props.Login.masterData}
                userRoleControlRights={this.state.userRoleControlRights}
                selectedId={null}

            />)

        return resultTabMap;
    }

    attachmentTabDetail = () => {
        const attachmentTabMap = new Map();
        let ntransactiontestcode = this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        let { skip, take, testskip, testtake, subSampleSkip, subSampleTake } = this.state
        let testList = this.props.Login.masterData.RE_TEST || [];
        testList = testList.slice(testskip, testskip + testtake);
        const meanControlId = this.state.controlMap.has("CalculateMean") && this.state.controlMap.get("CalculateMean").ncontrolcode
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.RESelectedTest, "ntransactiontestcode");
        let npreregno = this.props.Login.masterData.RESelectedSample ? this.props.Login.masterData.RESelectedSample.map(sample => sample.npreregno).join(",") : "-1";
        let ntransactionsamplecode = this.props.Login.masterData.RESelectedSubSample ?
            this.props.Login.masterData.RESelectedSubSample.map(sample => sample.ntransactionsamplecode).join(",") : "-1";
        let subsampleList = this.props.Login.masterData.RE_SUBSAMPLE || [];
        subsampleList = subsampleList.slice(subSampleSkip, subSampleSkip + subSampleTake);
        let selectedSubSampleList = getSameRecordFromTwoArrays(subsampleList, this.props.Login.masterData.RESelectedSubSample, "ntransactionsamplecode");
        //ALPD-3732  
        let sampleList = this.props.Login.masterData.RE_SAMPLE || [];
        sampleList = sampleList.slice(skip, skip + take);
        let selectedSampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.RESelectedSample, "npreregno");


        attachmentTabMap.set("IDS_TESTATTACHMENTS", <Attachments
            tabSequence={SideBarSeqno.TEST}
            screenName="IDS_TESTATTACHMENTS"
            selectedMaster="RESelectedTest"
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
            nsubsampleneed={this.props.Login.masterData.realRegSubTypeValue.nneedsubsample}
            subFields={[{ [designProperties.VALUE]: "stestsynonym" }, { [designProperties.VALUE]: "screateddate" }]}
            userInfo={this.props.Login.userInfo}
            isneedReport={false}
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
                masterList: selectedTestList//this.props.Login.masterData.RESelectedTest
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
                selectedMaster="selectedSubSample"
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
                nsubsampleneed={this.props.Login.masterData.realRegSubTypeValue.nneedsubsample}
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
                    masterList: this.props.Login.masterData.RE_SUBSAMPLE || []

                }}
                selectedListName="IDS_SAMPLEARNO"
                displayName="ssamplearno"
                isneedHeader={true}
            />)
        attachmentTabMap.set("IDS_SAMPLEATTACHMENTS",
            <Attachments
                screenName="IDS_SAMPLEATTACHMENTS"
                tabSequence={SideBarSeqno.SAMPLE}
                selectedMaster={this.props.Login.masterData.RESelectedSample}
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
                nsubsampleneed={this.props.Login.masterData.realRegSubTypeValue.nneedsubsample}
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
                    masterList: this.props.Login.masterData.RESelectedSample

                }}
                selectedListName="IDS_ARNUMBER"
                displayName="sarno"
                isneedHeader={true}
            />)
        return attachmentTabMap;
    }
    testDataStateChange = (event) => {
        switch (this.props.Login.activeTestTab) {
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
    commentTabDetail = () => {
        const commentTabMap = new Map();
        let { skip, take, testskip, testtake, subSampleSkip, subSampleTake } = this.state
        let testList = this.props.Login.masterData.searchedTest ? [...this.props.Login.masterData.searchedTest] : this.props.Login.masterData.RE_TEST || [];
        const editTestCommentsId = this.state.controlMap.has("EditTestComment") && this.state.controlMap.get("EditTestComment").ncontrolcode;
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.RESelectedTest, "ntransactiontestcode");
        let ntransactiontestcode = this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        let npreregno = this.props.Login.masterData.RESelectedSample ? this.props.Login.masterData.RESelectedSample.map(sample => sample.npreregno).join(",") : "-1";
        const ntransactionsamplecode = this.props.Login.masterData.RESelectedSubSample ? this.props.Login.masterData.RESelectedSubSample.map(sample => sample.ntransactionsamplecode).join(",") : "-1";
        let subsampleList = this.props.Login.masterData.RE_SUBSAMPLE || [];
        subsampleList = subsampleList.slice(subSampleSkip, subSampleSkip + subSampleTake);
        let selectedSubSampleList = getSameRecordFromTwoArrays(subsampleList, this.props.Login.masterData.RESelectedSubSample, "ntransactionsamplecode");
        //ALPD-3732
        let sampleList = this.props.Login.masterData.RE_SAMPLE || [];
        sampleList = sampleList.slice(skip, skip + take);
        let selectedSampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.RESelectedSample, "npreregno");


        commentTabMap.set("IDS_TESTCOMMENTS", <Comments
            screenName="IDS_TESTCOMMENTS"
            isSampleTestComment={true}
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
            isneedReport={false}
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
                selectedMaster="selectedSubSample"
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
                dataState={this.state.subSampleCommentDataState}
                dataStateChange={this.subSampledataStateChange}
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
                    masterList: this.props.Login.masterData.RE_SUBSAMPLE || [],
                    ncontrolCode: this.state.controlMap.has("EditSubSampleComment") && this.state.controlMap.get("EditSubSampleComment").ncontrolcode
                }}
                selectedListName="IDS_SAMPLEARNO"
                displayName="ssamplearno"
                selectedId={this.props.Login.selectedId || null}
            />)
        commentTabMap.set("IDS_SAMPLECOMMENTS", <Comments
            screenName="IDS_SAMPLECOMMENTS"
            tabSequence={SideBarSeqno.SAMPLE}
            onSaveClick={this.onCommentsSaveClick}
            selectedMaster="RESelectedSample"
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
            dataStateChange={this.dataStateChange}
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
                masterList: this.props.Login.masterData.RESelectedSample || [],
                ncontrolCode: this.state.controlMap.has("EditSampleComment") && this.state.controlMap.get("EditSampleComment").ncontrolcode
            }}
            selectedListName="IDS_ARNUMBER"
            displayName="sarno"
            selectedId={this.props.Login.selectedId || null}
        />)

        return commentTabMap;
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


    changePropertyView = (index, screenName, event, status) => {

        let id = false;
        if (event && event.ntransactiontestcode) {
            id = event.ntransactiontestcode
        } else if (event && event.ntransactionsamplecode) {
            id = event.ntransactionsamplecode
        } else if (event && event.npreregno) {
            id = event.npreregno
        }
        //console.log(this.state.activeTabId, id , "=======>")
        let activeTabIndex
        let activeTabId
        if (window.innerWidth > 992 && event && this.state.enableAutoClick || !event) {
            activeTabIndex = this.state.activeTabIndex !== index ? index : id ? index : false;
            //activeTabId = this.state.activeTabIndex !== index ? true:false;
        }
        if (status != "click") {
            if (index) {
                const tabProps = {
                    tabSequence: SideBarSeqno.TEST,
                    screenName: screenName == "IDS_COMMENTS" ? "IDS_TESTCOMMENTS" : screenName === "IDS_ATTACHMENTS" ? "IDS_TESTATTACHMENTS" : screenName,
                    activeTabIndex,
                    //activeTabId
                }
                this.onTabChange(tabProps);
            }
            // if (index == SideBarTabIndex.RESULT) {
            //     const tabProps = {
            //         tabSequence: SideBarSeqno.TEST,
            //         screenName: "IDS_RESULTS",
            //         activeTabIndex,
            //         //activeTabId
            //     }
            //     this.onTabChange(tabProps);
            // }

            // else if (index == SideBarTabIndex.ATTACHMENTS) {
            //     const tabProps = {
            //         tabSequence: SideBarSeqno.TEST,
            //         screenName: "IDS_TESTATTACHMENTS",
            //         activeTabIndex,
            //        // activeTabId
            //     }
            //     this.onTabChange(tabProps);
            // }
            // else if (index == SideBarTabIndex.COMMENTS) {
            //     const tabProps = {
            //         tabSequence: SideBarSeqno.TEST,
            //         screenName: "IDS_TESTCOMMENTS",
            //         activeTabIndex,
            //         //activeTabId
            //     }
            //     this.onTabChange(tabProps);
            // }
            // else {
            //     if (window.innerWidth > 992 && event && this.state.enableAutoClick || !event) {

            //         const updateInfo = {
            //             typeName: DEFAULT_RETURN,
            //             data: {
            //                 activeTabIndex: this.state.activeTabIndex !== index ? index : id ? index : false,
            //                 activeTabId: id
            //             }
            //         }
            //         this.props.updateStore(updateInfo);
            //     }
            // }
        }
    }


    onTabChange = (tabProps) => {
        const activeTestTab = tabProps.screenName;
        const tabseqno = tabProps.tabSequence;
        // if (activeTestTab !== this.props.Login.activeTestTab) {
        if (tabseqno == SideBarSeqno.TEST) {
            if (this.props.Login.masterData.RESelectedTest && this.props.Login.masterData.RESelectedTest.length > 0) {
                let inputData = {
                    masterData: this.props.Login.masterData,
                    ntransactiontestcode: this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
                    npreregno: this.props.Login.masterData.RESelectedSample ? this.props.Login.masterData.RESelectedSample.map(preregno => preregno.npreregno).join(",").toString() : "",
                    RESelectedTest: this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest : "",
                    userinfo: this.props.Login.userInfo,
                    activeTestKey: activeTestTab,
                    screenName: activeTestTab,
                    //activeTestTab,
                    resultDataState: this.state.resultDataState,
                    instrumentDataState: this.state.instrumentDataState,
                    materialDataState: this.state.materialDataState,
                    taskDataState: this.state.taskDataState,
                    documentDataState: this.state.documentDataState,
                    resultChangeDataState: this.state.resultChangeDataState,
                    testCommentDataState: this.state.testCommentDataState,
                    activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex,
                    activeTabId: tabProps.activeTabId ? tabProps.activeTabId : this.state.activeTabId
                }
                this.props.getTestChildTabREDetail(inputData, true);
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }));
            }
        }
        else if (tabseqno == SideBarSeqno.SUBSAMPLE) {
            if (activeTestTab !== this.props.Login.activeTestTab) {
                let inputData = {
                    masterData: this.props.Login.masterData,
                    selectedSubSample: this.props.Login.masterData.RESelectedSubSample,
                    ntransactionsamplecode: this.props.Login.masterData.RESelectedSubSample ? this.props.Login.masterData.RESelectedSubSample.map(item => item.ntransactionsamplecode).join(",") : "-1",
                    userinfo: this.props.Login.userInfo,
                    screenName: activeTestTab,
                    activeTestTab,
                    activeSubSampleTab: activeTestTab,
                    subSampleCommentDataState: this.state.subSampleCommentDataState,
                    subSampleAttachmentDataState: this.state.subSampleAttachmentDataState,
                    activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex
                }
                this.props.getSubSampleChildTabDetail(inputData)
            }
            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLE" }))
            }
        }
        else {

            if (activeTestTab !== this.props.Login.activeTestTab) {
                let inputData = {
                    masterData: this.props.Login.masterData,
                    RESelectedSample: this.props.Login.masterData.RESelectedSample,
                    npreregno: this.props.Login.masterData.RESelectedSample ? this.props.Login.masterData.RESelectedSample.map(item => item.npreregno).join(",") : "-1",
                    userinfo: this.props.Login.userInfo,
                    screenName: activeTestTab,
                    activeSampleTab: activeTestTab,
                    activeTestTab,
                    sampleChangeDataState: this.state.sampleChangeDataState,
                    activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex
                }
                this.props.getSampleChildTabDetail(inputData)
            }
        }

        //}
    }
    mandatoryFieldsForAdditionalInfo = () => {
        let mandatoryFieldsAdditionalInfo = []
        if (this.props.Login.showMultiSelectCombo) {
            mandatoryFieldsAdditionalInfo.push({
                "idsName": this.props.Login.masterData['salertmessage'], "dataField": "ntestgrouptestpredefsubcode", "mandatory": true,
                "mandatoryLabel": "IDS_SELECT", "controlType": "file"
            })
        } else {
            mandatoryFieldsAdditionalInfo.push({
                "idsName": this.props.Login.masterData['salertmessage'], "dataField": "ntestgrouptestpredefsubcode", "mandatory": true,
                "mandatoryLabel": "IDS_ENTER", "controlType": "file"
            })
        }
        return mandatoryFieldsAdditionalInfo;
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.Login.openModal &&
            this.props.Login.screenName === 'IDS_MATERIAL' && nextState.isMaterialInitialRender === false &&
            (nextState.selectedRecordMaterialForm !== this.state.selectedRecordMaterialForm)) {
            return false;
        }
        else if (this.props.Login.openModal &&
            this.props.Login.screenName === 'IDS_INSTRUMENT' && nextState.isInstrumentInitialRender === false &&
            (nextState.selectedRecordInstrumentForm !== this.state.selectedRecordInstrumentForm)) {
            return false;
        }
        else if (this.props.Login.openModal &&
            this.props.Login.screenName === 'IDS_RESULTENTRYCOMPLETE' && nextState.isCompleteInitialRender === false &&
            (nextState.selectedRecordCompleteForm !== this.state.selectedRecordCompleteForm)) {
            return false;
        }
        else if (this.props.Login.openModal &&
            this.props.Login.screenName === 'IDS_RESULTENTRY' && nextState.isParameterInitialRender === false &&
            (nextState.parameterResults !== this.state.parameterResults)) {
            return false;
        }
        else if (this.props.Login.openModal &&
            this.props.Login.screenName === 'IDS_RESULTENTRYPARAMETER' && nextState.isaddSampleRender === false &&
            (nextState.parameterResults1 !== this.state.parameterResults1)) {
            return false;

        }

        else if (
            this.props.Login.openModal &&
            this.props.Login.screenName === 'IDS_TASK' && nextState.isTaskInitialRender === false &&
            (nextState.selectedRecordTaskForm !== this.state.selectedRecordTaskForm)) {
            return false;
        } else if (
            this.props.Login.openModal &&
            this.props.Login.screenName === 'IDS_ADHOCPARAMETER' && nextState.isAdhocParameterInitialRender === false &&
            (nextState.selectedRecordAdhocParameter !== this.state.selectedRecordAdhocParameter)) {
            return false;
        } else {
            return true;
        }
    }
    render() {
        // const auditInfoFields = [{ "fieldName": "sarno", "label": "IDS_ARNO" }, 
        // { "fieldName": "spatientid", "label": "IDS_PATIENTID" },   
        // { "fieldName": "sfirstname", "label": "IDS_PATIENTNAME" },
        // { "fieldName": "sage", "label": "IDS_AGE" },
        // { "fieldName": "sgendername", "label": "IDS_GENDER" },
        // { "fieldName": "stestsynonym", "label": "IDS_TEST" },
        // { "fieldName": "sregdate", "label": "IDS_REGISTRATIONDATE" },
        // { "fieldName": "scompletedate", "label": "IDS_COMPLETEDDATEANDTIME" }

        // ];

        const auditInfoFields = [
            { "label": this.props.Login.genericLabel && this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], "fieldName": "sarno", },
            { "fieldName": "stestsynonym", "label": "IDS_TEST" },
            { "fieldName": "sfirstname", "label": "IDS_PATIENTNAME" },
            { "fieldName": "sgendername", "label": "IDS_GENDER" },


        ];
        // this.feildsForGrid =
        // [
        //   // { "idsName": "IDS_TEST", "dataField": "stestsynonym", "width": "200px" }, 
        //   { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "100px" },
        //   { "idsName": "IDS_SUBSAMPLE", "dataField": "ssamplearno", "width": "100px" },      
        //   { "idsName": "IDS_PARAMETER", "dataField": "sparametersynonym", "width": "100px" },
        //   { "idsName": "IDS_RESULT", "dataField": "sfinal", "width": "100px" },
        //   { "idsName": "IDS_GRADE", "dataField": "sgradename", "width": "200px" },
        // ];
        this.feildsForGrid =
            [
                // { "idsName": "IDS_TEST", "dataField": "stestsynonym", "width": "200px" },
                { "idsName": "IDS_REPORTREFNO", "dataField": "sreportno", "width": "200px" },
                { "idsName": this.props.Login.genericLabel && this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], "dataField": "sarno", "width": "200px" },
                { "idsName": this.props.Login.genericLabel && this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], "dataField": "ssamplearno", "width": "200px" },
                { "idsName": "IDS_PARAMETER", "dataField": "sparametersynonym", "width": "200px" },
                { "idsName": "IDS_RESULT", "dataField": "sfinal", "width": "200px" },
                { "idsName": "IDS_GRADE", "dataField": "sgradename", "width": "200px" },
                { "idsName": "IDS_REGISTRATIONDATE", "dataField": "sregdate", "width": "200px" },



            ];
        // console.log(this.state.enlLink);
        // console.log(this.state.enlLink);
        let sampleListRE = this.props.Login.masterData.RE_SAMPLE ? sortData(this.props.Login.masterData.RE_SAMPLE, "descending", "npreregno") : [];
        //let subSampleListRE = this.props.Login.masterData.RE_SUBSAMPLE ? sortData(this.props.Login.masterData.RE_SUBSAMPLE, 'descending', 'ntransactionsamplecode') : [];
        //let testListRE = this.props.Login.masterData.RE_TEST ? sortData(this.props.Login.masterData.RE_TEST,'descending','ntransactiontestcode') : [] //? sortData(this.props.Login.masterData.RE_TEST, 'descending', 'ntransactiontestcode') : [];
        //let subSampleListRE = this.props.Login.masterData.RE_SUBSAMPLE ?  this.props.Login.masterData.RE_SUBSAMPLE : []
        //let subSampleListRE = this.props.Login.masterData.RE_SUBSAMPLE ? sortData(this.props.Login.masterData.RE_SUBSAMPLE, 'descending', 'ntransactionsamplecode') : [];
        //let testListRE = this.props.Login.masterData.RE_TEST ? sortData(this.props.Login.masterData.RE_TEST,'descending','ntransactiontestcode') : [] //? sortData(this.props.Login.masterData.RE_TEST, 'descending', 'ntransactiontestcode') : [];
        let subSampleListRE = this.props.Login.masterData.RE_SUBSAMPLE ? this.props.Login.masterData.RE_SUBSAMPLE : []

        //let testListRE = this.props.Login.masterData.RE_TEST ? this.props.Login.masterData.RE_TEST : []
        let testListRE = this.props.Login.masterData.RE_TEST ? this.props.Login.masterData.RE_TEST : []
        const startDate = (this.props.Login.masterData.realFromDate || this.props.Login.masterData.fromDate || new Date());
        const endDate = (this.props.Login.masterData.realToDate || this.props.Login.masterData.toDate || new Date());

        // let obj = this.covertDatetoString(startDate, endDate)
        let obj = convertDateValuetoString(startDate, endDate, this.props.Login.userInfo);

        const fromDate = obj.fromDate;
        const toDate = obj.toDate;


        let subSampleGetREParam = {
            masterData: this.props.Login.masterData,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            napprovalversioncode: this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode,
            ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
            ntestcode: this.props.Login.masterData.realTestcodeValue && this.props.Login.masterData.realTestcodeValue.ntestcode,
            npreregno: this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.map(sample => sample && sample.npreregno).join(","),
            fromdate: fromDate,
            todate: toDate,
            activeTestKey: this.props.Login.activeTestTab || 'IDS_RESULTS',
            activeSampleKey: this.props.Login.activeTestTab || 'IDS_IDS_SAMPLEINFO',
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
            sampleChangeDataState: this.state.sampleChangeDataState,
            // ALPD-5901    changed ndesigntemplatemappingcode from masterdata to breadcrumb code by Vishakh
            ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMapping && this.props.Login.masterData.realDesignTemplateMapping.ndesigntemplatemappingcode) || -1,
            searchSubSampleRef: this.searchSubSampleRef,
            searchTestRef: this.searchTestRef,
            nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
            //Aravindh
            //  checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            nworlistcode: (this.props.Login.masterData.realWorklistCodeValue && this.props.Login.masterData.realWorklistCodeValue.nworklistcode) || -1,
            nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1,
            activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 8 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 8 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
            nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43'])
        }
        let testGetREParam = {
            masterData: this.props.Login.masterData,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            napprovalversioncode: this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode,
            ntranscode: String(this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus && (this.props.Login.masterData.realFilterStatusValue.ntransactionstatus).toString()),
            ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
            ntestcode: this.props.Login.masterData.realTestcodeValue && this.props.Login.masterData.realTestcodeValue.ntestcode,
            npreregno: this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.map(sample => sample && sample.npreregno).join(","),
            activeTestKey: this.props.Login.activeTestTab || 'IDS_RESULTS',
            activeSampleKey: this.props.Login.activeTestTab || 'IDS_IDS_SAMPLEINFO',
            activeSubSampleTab: this.props.Login.activeTestTab || "IDS_SUBSAMPLEATTACHMENTS",
            resultDataState: this.state.resultDataState,
            instrumentDataState: this.state.instrumentDataState,
            materialDataState: this.state.materialDataState,
            taskDataState: this.state.taskDataState,
            documentDataState: this.state.documentDataState,
            resultChangeDataState: this.state.resultChangeDataState,
            testCommentDataState: this.state.testCommentDataState,
            // ALPD-5901    changed ndesigntemplatemappingcode from masterdata to breadcrumb code by Vishakh
            ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMapping && this.props.Login.masterData.realDesignTemplateMapping.ndesigntemplatemappingcode) || -1,
            nneedsubsample: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
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
            // activeTabIndex: this.state.enableAutoClick ? 1 : this.state.activeTabIndex ? this.state.activeTabIndex : 0,
            activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 1 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 1 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
            nworlistcode: (this.props.Login.masterData.realWorklistCodeValue && this.props.Login.masterData.realWorklistCodeValue.nworklistcode) || -1,
            nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1,
            nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43']),
            searchTestRef: this.searchTestRef
       
        }
        let testChildGetREParam = {
            masterData: this.props.Login.masterData,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            napprovalversioncode: this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode,
            ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
            ntestcode: this.props.Login.masterData.realTestcodeValue && this.props.Login.masterData.realTestcodeValue.ntestcode,
            npreregno: this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.map(sample => sample && sample.npreregno).join(","),
            ntransactionsamplecode: this.props.Login.masterData.RESelectedSubSample && this.props.Login.masterData.RESelectedSubSample.map(sample => sample && sample.ntransactionsamplecode).join(","),
            activeTestKey: this.props.Login.activeTestTab || 'IDS_RESULTS',
            fromdate: fromDate,
            todate: toDate,
            testskip: this.state.testskip,
            testtake: this.state.testtake,
            resultDataState: this.state.resultDataState,
            instrumentDataState: this.state.instrumentDataState,
            materialDataState: this.state.materialDataState,
            taskDataState: this.state.taskDataState,
            documentDataState: this.state.documentDataState,
            resultChangeDataState: this.state.resultChangeDataState,
            testCommentDataState: this.state.testCommentDataState,
            ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode,
            activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 1 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 1 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
            //activeTabIndex: this.state.enableAutoClick ? this.state.activeTabIndex : this.state.activeTabIndex ? this.state.activeTabIndex : 1,
            nworlistcode: (this.props.Login.masterData.realWorklistCodeValue && this.props.Login.masterData.realWorklistCodeValue.nworklistcode) || -1,
            nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1,
            nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43'])

        }


        const filterSampleParam = {
            inputListName: "RE_SAMPLE",
            selectedObject: "RESelectedSample",
            primaryKeyField: "npreregno",
            fetchUrl: "resultentrybysample/getResultEntryDetails",
            skip: 0,
            take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
            childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" }, { ref: this.searchTestRef, childFilteredListName: "searchedTest" }],
            fecthInputObject: {
                ntype: 2,
                nflag: 2,
                ntransactiontestcode: 0,
                masterData: this.props.Login.masterData,
                userinfo: this.props.Login.userInfo,
                nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                napprovalversioncode: this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode,
                ntranscode: String(this.props.Login.masterData.realFilterStatusValue ? this.props.Login.masterData.realFilterStatusValue.ntransactionstatus ? this.props.Login.masterData.realFilterStatusValue.ntransactionstatus.toString() : 0 : 0),
                ntestcode: this.props.Login.masterData.realTestcodeValue && this.props.Login.masterData.realTestcodeValue.ntestcode,
                //npreregno: this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.map(sample => sample.npreregno).join(","),
                fromdate: fromDate,
                todate: toDate,
                activeTestKey: this.props.Login.activeTestTab || 'IDS_RESULTS',
                //nneedsubsample: this.props.Login.masterData.nneedsubsample || 4,
                nneedsubsample: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample ? true : false,
                ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode,
                // checkBoxOperation: 3,
                checkBoxOperation: checkBoxOperation.SINGLESELECT,
                ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1,
                nworlistcode: (this.props.Login.masterData.realWorklistCodeValue && this.props.Login.masterData.realWorklistCodeValue.nworklistcode) || -1,
                nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1,
                nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43'])
            },
            masterData: this.props.Login.masterData,
            // searchFieldList: ["sarno", "ssampletypestatus"],
            searchFieldList: this.state.sampleSearchField,
            changeList: ["RE_SUBSAMPLE", "RE_TEST", "TestParameters",
                "ResultChangeHistory", "ApprovalHistory", "ResultUsedInstrument",
                "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment",
                "RegistrationAttachment", "RESelectedSample", "RESelectedSubSample", "RESelectedTest"]
        };

        const filterSubSampleParam = {
            inputListName: "RE_SUBSAMPLE",
            selectedObject: "RESelectedSubSample",
            primaryKeyField: "ntransactionsamplecode",
            fetchUrl: "resultentrybysample/getResultEntrySubSampleDetails",
            childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedTest" }],
            fecthInputObject: {
                ntype: 3,
                nflag: 3,
                ntransactiontestcode: 0,
                masterData: this.props.Login.masterData,
                userinfo: this.props.Login.userInfo,
                nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                napprovalversioncode: this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode,
                ntranscode: String(this.props.Login.masterData.realFilterStatusValue ? this.props.Login.masterData.realFilterStatusValue.ntransactionstatus ? this.props.Login.masterData.realFilterStatusValue.ntransactionstatus.toString() : 0 : 0),
                ntestcode: this.props.Login.masterData.realTestcodeValue && this.props.Login.masterData.realTestcodeValue.ntestcode,
                //npreregno: this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.map(sample => sample.npreregno).join(","),
                fromdate: fromDate,
                todate: toDate,
                activeTestKey: this.props.Login.activeTestTab || 'IDS_RESULTS',
                nneedsubsample: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample ? true : false,
                ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode,
                // checkBoxOperation: 3,
                checkBoxOperation: checkBoxOperation.SINGLESELECT,
                nworlistcode: (this.props.Login.masterData.realWorklistCodeValue && this.props.Login.masterData.realWorklistCodeValue.nworklistcode) || -1,
                nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1,
                nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43'])
            },
            masterData: this.props.Login.masterData,
            // searchFieldList: ["sarno", "ssampletypestatus"],
            searchFieldList: this.state.subsampleSearchField,
            changeList: ["RE_TEST", "TestParameters",
                "ResultChangeHistory", "ApprovalHistory", "ResultUsedInstrument",
                "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment",
                "RegistrationAttachment", "RESelectedSubSample", "RESelectedTest"]
        };
        let filterTestParam = {
            inputListName: "RE_TEST",
            selectedObject: "RESelectedTest",
            primaryKeyField: "ntransactiontestcode",
            fetchUrl: this.getActiveTestURL(),
            fecthInputObject: {
                ntransactiontestcode: this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
                userinfo: this.props.Login.userInfo,
                ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1,
                nworlistcode: (this.props.Login.masterData.realWorklistCodeValue && this.props.Login.masterData.realWorklistCodeValue.nworklistcode) || -1,
                nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1
            },
            masterData: this.props.Login.masterData,
            searchFieldList: this.state.testSearchField,
            changeList: ["TestParameters",
                "ResultChangeHistory", "ApprovalHistory", "ResultUsedInstrument",
                "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment",
                "RegistrationAttachment", "RESelectedTest"],
            ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode,
            nneedsubsample: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample ? true : false,
            // checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            //nworlistcode : (this.props.Login.masterData.defaultWorklistvalue && this.props.Login.masterData.defaultWorklistvalue.nworklistcode) || -1
            nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43'])
        }

        this.postParamList = [
            {
                filteredListName: "searchedSample",
                clearFilter: "no",
                searchRef: this.searchSampleRef,
                primaryKeyField: "npreregno",
                fetchUrl: "resultentrybysample/getResultEntryDetails",
                fecthInputObject: filterSampleParam,
                selectedObject: "RESelectedSample",
                inputListName: "RE_SAMPLE",
                updatedListname: "",
                childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" }, { ref: this.searchTestRef, childFilteredListName: "searchedTest" }],
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            }, {
                filteredListName: "searchedSubSample",
                updatedListname: "updatedSubSample",
                clearFilter: "no",
                searchRef: this.searchSubSampleRef,
                primaryKeyField: "ntransactionsamplecode",
                fetchUrl: "resultentrybysample/getResultEntryDetails",
                fecthInputObject: testGetREParam,
                selectedObject: "RESelectedSubSample",
                childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedTest" }],
                inputListName: "RE_SUBSAMPLE",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            }, {
                filteredListName: "searchedTest",
                clearFilter: "no",
                searchRef: this.searchTestRef,
                primaryKeyField: "ntransactiontestcode",
                fetchUrl: this.getActiveTestURL(),
                childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" }, { ref: this.searchSampleRef, childFilteredListName: "" }],
                fecthInputObject: testChildGetREParam,
                selectedObject: "RESelectedTest",
                inputListName: "RE_TEST",
                updatedListname: "RE_TEST",//"updatedTest",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            }];


        this.breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": obj.breadCrumbFrom
            }, {
                "label": "IDS_TO",
                "value": obj.breadCrumbto
            },
            // {
            //     "label": "IDS_SAMPLETYPE",
            //     "value": this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.ssampletypename ? this.props.Login.masterData.realSampleTypeValue.ssampletypename : "Product"
            // }, 
            {
                "label": "IDS_REGISTRATIONTYPE",
                "value": this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.sregtypename ? this.props.Login.masterData.realRegTypeValue.sregtypename : "NA"
                // "value": this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.sregtypename || "NA" :
                // this.props.Login.masterData.defaultRegistrationType ? this.props.Login.masterData.defaultRegistrationType.sregtypename || "NA" : "NA"
            }, {
                "label": "IDS_REGISTRATIONSUBTYPE",
                "value": this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.sregsubtypename ? this.props.Login.masterData.realRegSubTypeValue.sregsubtypename : "NA"
            },
            // {
            //     "label": "IDS_CONFIGVERSION",
            //     "value": this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.sversionname ? this.props.Login.masterData.realApproveConfigVersion.sversionname : "NA"
            // },
            {
                "label": "IDS_TEST",
                "value": this.props.Login.masterData.realTestcodeValue && this.props.Login.masterData.realTestcodeValue.stestsynonym ? this.props.Login.masterData.realTestcodeValue.stestsynonym : "NA"
            },
            {
                "label": "IDS_TESTSTATUS",
                "value": this.props.Login.masterData.realFilterStatusValue ? this.props.Login.masterData.realFilterStatusValue.sfilterstatus : "NA"
            }
        ]

        if (this.props.Login.masterData.realWorklistCodeValue && this.props.Login.masterData.realWorklistCodeValue.nworklistcode) {
            this.breadCrumbData.push({
                "label": "IDS_WORKLIST",
                "value": this.props.Login.masterData.realWorklistCodeValue ? this.props.Login.masterData.realWorklistCodeValue.sworklistno : "NA"
            });
        }
        if (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) {
            this.breadCrumbData.push({
                "label": "IDS_BATCH",
                "value": this.props.Login.masterData.realBatchCodeValue ? this.props.Login.masterData.realBatchCodeValue.sbatcharno : "NA"
            });
        }

        const testStartId = this.state.controlMap.has("TestStart") && this.state.controlMap.get("TestStart").ncontrolcode
        const resultEnterId = this.state.controlMap.has("ResultEnter") && this.state.controlMap.get("ResultEnter").ncontrolcode
        const completeResultId = this.state.controlMap.has("CompleteResult") && this.state.controlMap.get("CompleteResult").ncontrolcode
        const exportId = this.state.controlMap.has("ExportResult") && this.state.controlMap.get("ExportResult").ncontrolcode
        const importId = this.state.controlMap.has("ImportResult") && this.state.controlMap.get("ImportResult").ncontrolcode
        const setDefaultId = this.state.controlMap.has("SetDefaultResult") && this.state.controlMap.get("SetDefaultResult").ncontrolcode

        const editSourceMethodId = this.state.controlMap.has("EditSourceMethod") && this.state.controlMap.get("EditSourceMethod").ncontrolcode
        const addResultUsedInstrumentId = this.state.controlMap.has("AddResultUsedInstrument") && this.state.controlMap.get("AddResultUsedInstrument").ncontrolcode
        const addResultUsedMaterailId = this.state.controlMap.has("AddResultUsedMaterial") && this.state.controlMap.get("AddResultUsedMaterial").ncontrolcode
        const adhocId = this.state.controlMap.has("AdhocParameter") && this.state.controlMap.get("AdhocParameter").ncontrolcode
        const openELNSheet = this.state.controlMap.has("OpenELNSheet") && this.state.controlMap.get("OpenELNSheet").ncontrolcode
        const patientPreviousResultView = this.state.controlMap.has("PatientPreviousResultView") && this.state.controlMap.get("PatientPreviousResultView").ncontrolcode
        const identicalResultEnterId = this.state.controlMap.has("IdenticalResultEnter") && this.state.controlMap.get("IdenticalResultEnter").ncontrolcode
        const testSectionChangeID = this.state.controlMap.has("ChangeTestSection") ? this.state.controlMap.get("ChangeTestSection").ncontrolcode : -1;
        const filterNameId = this.state.controlMap.has("FilterName") ? this.state.controlMap.get("FilterName").ncontrolcode : -1;
        const filterDetailId = this.state.controlMap.has("FilterDetail") ? this.state.controlMap.get("FilterDetail").ncontrolcode : -1;


        const mandatoryFieldsInstrument = [{ "mandatory": true, "idsName": "IDS_INSTRUMENTCATEGORY", "dataField": "ninstrumentcatcode" },
        { "mandatory": true, "idsName": "IDS_INSTRUMENTNAME", "dataField": "ninstrumentnamecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "mandatory": true, "idsName": "IDS_INSTRUMENTID", "dataField": "ninstrumentcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "mandatory": true, "idsName": "IDS_FORMDATE", "dataField": "dfromdate", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "mandatory": true, "idsName": "IDS_TODATE", "dataField": "dtodate", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "mandatory": true, "idsName": "IDS_TIMEZONE", "dataField": "ntzfromdate", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "mandatory": true, "idsName": "IDS_TIMEZONE", "dataField": "ntztodate", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }]

        const mandatoryFieldsMaterial = [{ "mandatory": true, "idsName": "IDS_MATERIALTYPE", "dataField": "nmaterialtypecode" },
        { "mandatory": true, "idsName": "IDS_MATERIALCATEGORY", "dataField": "nmaterialcatcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "mandatory": true, "idsName": "IDS_MATERIAL", "dataField": "nmaterialcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "mandatory": true, "idsName": "IDS_MATERIALINVENTORY", "dataField": "nmaterialinventorycode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "mandatory": true, "idsName": "IDS_AVAILABLEQUANTITY", "dataField": "savailablequantity", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "mandatory": true, "idsName": "IDS_USEDQTY", "dataField": "susedquantity", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "mandatory": true, "idsName": "IDS_UNIT", "dataField": "sunitname", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },

        ]
        const mandatoryFieldsTask = [{ "mandatory": true, "idsName": "IDS_PREANALYSISTIME", "dataField": "spreanalysistime", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "mandatory": true, "idsName": "IDS_PREPARATIONTIME", "dataField": "spreparationtime", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "mandatory": true, "idsName": "IDS_ANALYSISTIME", "dataField": "sanalysistime", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "mandatory": true, "idsName": "IDS_MISCTIME", "dataField": "smisctime", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        ]

        const mandatoryFieldsTestMethodSource = [{ "mandatory": true, "idsName": "IDS_SOURCE", "dataField": "nsourcecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "mandatory": true, "idsName": "IDS_METHOD", "dataField": "nmethodcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }]


        const mandatoryEnforceResult = [
            { "mandatory": true, "idsName": "IDS_RESULTS", "dataField": "senforceresult", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "mandatory": true, "idsName": "IDS_COMMENTS", "dataField": "senforceresultcomment", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
            // { "mandatory": true, "idsName": "IDS_PASSFLAG", "dataField": "ngradecode", "mandatoryLabel": "IDS_SELECT", "controlType": "textbox" },
        ]


        const mandatoryFieldsParameter = [{ "mandatory": true, "idsName": "IDS_PARAMETERCOMMENTS", "dataField": "sresultcomment", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]

        const mandatoryFieldsComplete = [{ "mandatory": true, "idsName": "IDS_USER", "dataField": "nusercode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }]
        const mandatoryFieldsSection = [{ "mandatory": true, "idsName": "IDS_SECTION", "dataField": "nsectioncode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }]
        const mandatoryFieldsFilter = [{ "mandatory": true, "idsName": "IDS_FILTERNAME", "dataField": "sfiltername", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]


        const validateFormulaMandyFields = this.state.validateFormulaMandyFields;

        const reportPreviewId = this.state.controlMap.has("SamplePreviewReport") && this.state.controlMap.get("SamplePreviewReport").ncontrolcode
        const testDesign = <ContentPanel>
            <Card>
                <Card.Header style={{ borderBottom: "0px" }}>
                    <span style={{ display: "inline-block" }}>
                        <h4 className="card-title">{this.props.intl.formatMessage({ id: "IDS_TEST" })}</h4>
                    </span>
                </Card.Header>
                <Card.Body className='p-0 sm-pager'>
                    <TransactionListMasterJsonView
                        progressTimerStart={this.props.Login.progressTimerStart || false}
                        clickIconGroup={true}
                        cardHead={94}
                        //paneHeight={this.state.initialVerticalWidth}
                        // paneHeight={`${testListRE && testListRE !== null && testListRE.length > 0 ? testListRE.length * 13 : 5}vh`}
                        masterList={this.props.Login.masterData.searchedTest || testListRE}
                        selectedMaster={this.props.Login.masterData.RESelectedTest}
                        primaryKeyField="ntransactiontestcode"
                        //getMasterDetail={this.props.getTestChildTabREDetail}
                        getMasterDetail={(event, status) => { this.props.getTestChildTabREDetail(event, status); this.changePropertyView(1, "IDS_RESULTS", event, "click") }}
                        inputParam={testChildGetREParam}
                        subFieldsLabel={true}
                        additionalParam={[]}
                        mainField="stestsynonym"
                        selectedListName="RESelectedTest"
                        objectName="test"
                        listName="IDS_TEST"
                        pageSize={this.props.Login.settings && this.props.Login.settings[13].split(",").map(setting => parseInt(setting))}
                        showStatusLink={true}
                        statusFieldName="stransdisplaystatus"
                        statusField="ntransactionstatus"
                        needMultiSelect={true}
                        subFields={this.state.testListColumns || []}
                        moreField={this.state.testMoreField}
                        needValidation={false}
                        needFilter={false}
                        filterColumnData={this.props.filterTransactionList}
                        searchListName="searchedTest"
                        searchRef={this.searchTestRef}
                        filterParam={filterTestParam}
                        selectionField="ntransactionstatus"
                        showStatusName={true}
                        selectionFieldName="sfilterstatus"
                        childTabsKey={["TestParameters", "ResultUsedInstrument", "ResultUsedTasks", "RegistrationTestAttachment",
                            "ResultChangeHistory", "RegistrationTestComment", "ResultChangeHistory"
                            // , "RegistrationComment"
                        ]}
                        // selectionList={this.props.Login.masterData.REFilterStatus && this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.REFilterStatus : []}
                        selectionList={this.state.selectedFilter}
                        skip={this.state.testskip}
                        take={this.state.testtake}
                        handlePageChange={this.handleTestPageChange}
                        selectionColorField="scolorhexcode"
                        showMoreResetList={true}
                        showMoreResetListName="RE_SAMPLE"
                        buttonCount={5}
                        jsonField={'jsondata'}
                        jsonDesignFields={true}
                        actionIcons={
                            [
                                { title: this.props.intl.formatMessage({ id: "IDS_OPENELNSHEET" }), controlname: "elnimage", 
                                //ALPD-5594--Added by Vignesh R(21-03-2025)-->Icon hide when the batchmaster selected
                                hidden:(this.props.Login.masterData.realBatchCodeValue &&this.props.Login.masterData.realBatchCodeValue.nbatchmastercode&&
                                    this.props.Login.masterData.realBatchCodeValue.nbatchmastercode !==-1 ?
                                    true   : this.state.userRoleControlRights.indexOf(openELNSheet) === -1
                                     ), onClick: this.openClosePortal, objectName: "test", inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo, elnUserInfo: this.props.Login.elnUserInfo, elnSite: this.props.Login.elnSite } },
                                { title: this.props.intl.formatMessage({ id: "IDS_PREVIOUSRESULTVIEW" }), controlname: "faEye", dataplace: "left", hidden: this.state.userRoleControlRights.indexOf(patientPreviousResultView) === -1, onClick: this.viewSample, objectName: "test", inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo } },
                                { title: this.props.intl.formatMessage({ id: "IDS_EDITMETHODSSOURCE" }), controlname: "faPencilAlt", dataplace: "left", hidden: this.state.userRoleControlRights.indexOf(editSourceMethodId) === -1, onClick: this.testMethodSourceEdit, objectName: "test", inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo, editSourceMethodId } },
                                //commend for nfc bug issues
                                //--start
                                // { title: this.props.intl.formatMessage({ id: "IDS_ADHOCPARAMETER" }), controlname: "faAdhocParameter", dataplace: "left",
                                //  hidden: this.state.userRoleControlRights.indexOf(adhocId) === -1,
                                //  onClick: this.adhocParameter, objectName: "test",
                                //       inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo, adhocId } },
                                //end
                                // { title: this.props.intl.formatMessage({ id: "IDS_ADHOCPARAMETER" }), controlname: "faAdhocParameter", dataplace: "left", 
                                //       hidden: this.state.userRoleControlRights.indexOf(adhocId) === -1,
                                //       onClick: this.adhocTestParameter, objectName: "test",
                                //           inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo, adhocId } },
                                //{ title: this.props.intl.formatMessage({ id: "IDS_EDITMETHODSSOURCE" }), controlname: "faPencilAlt", dataplace: "left", hidden: this.state.userRoleControlRights.indexOf(editSourceMethodId) === -1, onClick: this.testMethodSourceEdit, objectName: "test", inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo, editSourceMethodId } },
                                { title: this.props.intl.formatMessage({ id: "IDS_ADDINSTRUMENT" }), controlname: "faMicroscope", hidden: false, onClick: this.addREInstrument, objectName: "test", inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo, addResultUsedInstrumentId } },
                                { title: this.props.intl.formatMessage({ id: "IDS_ADDMATERIAL" }), controlname: "faFlask", hidden: false, onClick: this.props.addREMaterial, objectName: "test", inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo, addResultUsedMaterailId } }
                                // { title: "Add Task", controlname: "faTasks", hidden: this.state.userRoleControlRights.indexOf(addResultUsedTaskId) === -1, onClick: this.addResultEntryTask, objectName: "test", inputData: { addResultUsedTaskId } }
                            ]
                        }
                        commonActions={
                            // <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}>
                            <ProductList className="d-flex justify-content-end icon-group-wrap">
                                {testListRE.length > 0 ?
                                    <>
                                        {/* <ReactTooltip place="bottom" /> */}
                                        {/* <Nav.Link data-for="tooltip-common-wrap" data-tip={this.props.intl.formatMessage({ id: "IDS_TESTSTART" })} hidden={this.state.userRoleControlRights.indexOf(testStartId) === -1} className="btn btn-circle outline-grey ml-2" role="button" onClick={() => this.testStartActions(testChildGetREParam, this.props.Login.masterData.RESelectedTest, this.props.Login.userInfo, testStartId, this.state.testskip, this.state.testtake)}>
                                                                                                <FontAwesomeIcon icon={faPlay} />
                                                                                            </Nav.Link> */}
                                        {/*ALPD-4156--Vignesh R(15-05-2024)-->Result Entry - Option to change section for the test(s)*/}
                                        <Nav.Link
                                            // data-for="tooltip-common-wrap"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_CHANGESECTION" })} hidden={this.state.userRoleControlRights.indexOf(testSectionChangeID) === -1} className="btn btn-circle outline-grey ml-2" role="button"
                                            onClick={() => this.getSectionChange(testSectionChangeID, this.state.testskip, this.state.testtake, 'updateSection')} >
                                            <SectionChange className="custom_icons" width="20" height="30" />
                                        </Nav.Link>

                                        {this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtestinitiate ?

                                            <FontIconWrap
                                                //  data-for="tooltip-common-wrap" 
                                                data-tip={this.props.intl.formatMessage({ id: "IDS_TESTSTART" })} hidden={this.state.userRoleControlRights.indexOf(testStartId) === -1}
                                                className="btn btn-circle outline-grey ml-2" role="button"
                                                onClick={() => this.testStartActions(testChildGetREParam, this.props.Login.masterData.RESelectedTest,
                                                    this.props.Login.userInfo, testStartId, this.state.testskip, this.state.testtake)} >
                                                <FontAwesomeIcon icon={faPlay} />

                                            </FontIconWrap> : ""}



                                        <Nav.Link
                                            // data-for="tooltip-common-wrap"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_ENTERRESULT" })} hidden={this.state.userRoleControlRights.indexOf(resultEnterId) === -1} className="btn btn-circle outline-grey ml-2" role="button" onClick={() => this.props.resultGetModule(this.props.Login.masterData, parseInt(this.props.Login.settings && this.props.Login.settings['43']), this.props.Login.userInfo, resultEnterId, this.state.testskip, this.state.testtake)} >
                                            <FontAwesomeIcon icon={faAddressBook} />
                                        </Nav.Link>
                                        <Nav.Link
                                            // data-for="tooltip-common-wrap" 
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_FILLDEFAULTRESULT" })} hidden={this.state.userRoleControlRights.indexOf(setDefaultId) === -1} className="btn btn-circle outline-grey ml-2" role="button" onClick={() => this.defaultActions(testChildGetREParam, this.props.Login.masterData.RESelectedTest, this.props.Login.masterData.RESelectedSample, setDefaultId, this.state.testskip, this.state.testtake)}>
                                            <FontAwesomeIcon icon={faPencilRuler} />
                                        </Nav.Link>
                                        <Nav.Link
                                            // data-for="tooltip-common-wrap"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_COMPLETE" })} hidden={this.state.userRoleControlRights.indexOf(completeResultId) === -1} className="btn btn-circle outline-grey ml-2" role="button"
                                            onClick={() => this.props.Login.settings && parseInt(this.props.Login.settings[45]) === transactionStatus.YES ? this.completePopup(testChildGetREParam, this.props.Login.userInfo, completeResultId, this.state.testskip, this.state.testtake, 3) :
                                                this.completeActions(testChildGetREParam, this.props.Login.masterData.RESelectedTest, this.props.Login.userInfo, completeResultId, this.state.testskip, this.state.testtake, 3)}>
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                        </Nav.Link>                                       
                                    </>
                                    : ""}
                            </ProductList>

                            // </Tooltip>
                        }
                    />
                </Card.Body>
            </Card>
        </ContentPanel>

        let mainDesign = "";
        if (this.props.Login.masterData.realRegSubTypeValue &&
            this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) {
            mainDesign = <SplitterLayout borderColor="#999"
                primaryIndex={1} percentage={true}
                secondaryInitialSize={this.state.splitChangeWidthPercentage}
                onSecondaryPaneSizeChange={this.paneSizeChange}
                primaryMinSize={40}
                secondaryMinSize={30}
            >
                <Card>
                    <Card.Header style={{ borderBottom: "0px" }}>
                        <span style={{ display: "inline-block", marginTop: "1%" }}>
                            <h4 className="card-title">{this.props.intl.formatMessage({ id: "IDS_SUBSAMPLE" })}</h4>
                        </span>
                    </Card.Header>
                    <Card.Body className='p-0 sm-pager'>
                        <TransactionListMasterJsonView
                            cardHead={94}
                            //paneHeight={this.state.initialVerticalWidth}
                            masterList={this.props.Login.masterData.searchedSubSample || subSampleListRE}
                            selectedMaster={this.props.Login.masterData.RESelectedSubSample}
                            primaryKeyField="ntransactionsamplecode"
                            getMasterDetail={this.props.getTestREDetail}
                            inputParam={testGetREParam}
                            additionalParam={[]}
                            mainField="ssamplearno"
                            selectedListName="RESelectedSubSample"
                            objectName="subSample"
                            listName="IDS_SUBSAMPLE"
                            jsonField={'jsondata'}
                            jsonDesignFields={true}
                            subFields={this.state.DynamicSubSampleColumns}
                            moreField={this.state.subSampleMoreField}
                            needValidation={false}
                            needMultiSelect={true}
                            needFilter={false}
                            skip={this.state.subSampleSkip}
                            take={this.state.subSampleTake}
                            pageSize={this.props.Login.settings && this.props.Login.settings[13].split(",").map(setting => parseInt(setting))}
                            handlePageChange={this.handleSubSamplePageChange}
                            showStatusLink={true}
                            showStatusName={false}
                            selectionList={this.state.selectedFilter}
                            statusFieldName="stransdisplaystatus"
                            statusField="ntransactionstatus"
                            selectionFieldName="sfilterstatus"
                            selectionField="ntransactionstatus"
                            childTabsKey={["RE_TEST", "Registration", "RegistrationSampleComment", "RegistrationSampleAttachment"]}
                            filterColumnData={this.props.filterTransactionList}
                            searchListName="searchedSubSample"
                            searchRef={this.searchSubSampleRef}
                            filterParam={filterSubSampleParam}
                            subFieldsFile={true}
                        />
                    </Card.Body>
                </Card>
                {testDesign}
            </SplitterLayout>
        }
        else {
            mainDesign = testDesign
        }

        return (
            <>
                {/* <PerfectScrollbar> */}
                <ListWrapper className="client-listing-wrap new-breadcrumb toolbar-top-wrap mtop-4 screen-height-window">
                    <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} />
                    <div className='fixed-buttons'>
                        <Nav.Link //ALPD-4870 Add filter name and filter details button,done by Dhanushya RI
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
                    <Row noGutters={true} bsPrefix="toolbar-top">
                        {/* sticky_head_parent ref={(parentHeight) => { this.parentHeight = parentHeight }} secondaryInitialSize={40}*/}
                        <Col md={12} className="parent-port-height">
                            <ListWrapper className={`vertical-tab-top ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                <div className={`tab-left-area ${this.state.activeTabIndex ? 'active' : ""} ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                    <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1}
                                        secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                        //onSecondaryPaneSizeChange={this.paneSizeChange} 
                                        primaryMinSize={40} secondaryMinSize={20}>
                                        <div className='toolbar-top-inner'>
                                            <TransactionListMasterJsonView
                                                clickIconGroup={true}
                                                // paneHeight={this.state.parentHeight}
                                                splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                                masterList={this.props.Login.masterData.searchedSample || sampleListRE}
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
                                                subFields={this.state.DynamicSampleColumns || []}
                                                moreField={this.state.sampleMoreField}
                                                needFilter={true}
                                                needMultiSelect={true}
                                                showFilter={this.props.Login.showFilter}
                                                closeFilter={this.closeFilter}
                                                onFilterSubmit={this.onREFilterSubmit}
                                                filterColumnData={this.props.filterTransactionList}
                                                searchListName="searchedSample"
                                                searchRef={this.searchSampleRef}
                                                handlePageChange={this.handlePageChange}
                                                filterParam={filterSampleParam}
                                                skip={this.state.skip}
                                                take={this.state.take}
                                                hidePaging={false}
                                                showStatusLink={true}
                                                showStatusName={true}
                                                needMultiValueFilter={true}
                                                clearAllFilter={this.onReload}
                                                onMultiFilterClick={this.onMultiFilterClick}
                                                statusFieldName="stransdisplaystatus"
                                                statusField="ntransactionstatus"
                                                //splitModeClass={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50 ? 'split-mode' : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}
                                                childTabsKey={["RegistrationAttachment", "RE_SUBSAMPLE", "RE_TEST", "SampleApprovalHistory", "RegistrationComment", "RegistrationSampleComment", "RegistrationSampleAttachment"]}
                                                selectionList={this.state.selectedFilter}
                                                selectionColorField="scolorhexcode"
                                                selectionFieldName="stransdisplaystatus"
                                                selectionField="ntransactionstatus"
                                                jsonField={'jsondata'}
                                                jsonDesignFields={true}
                                                callCloseFunction={true}
                                                viewSampleStatus={true}
                                                filterComponent={[
                                                    {
                                                        "Sample Filter": <ResultEntryFilter
                                                            fromDate={this.props.Login.masterData.fromDate ? //new Date(this.props.Login.masterData.fromDate) 
                                                                rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate)
                                                                : new Date()}
                                                            toDate={this.props.Login.masterData.toDate ? //new Date(this.props.Login.masterData.toDate) 
                                                                rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate)
                                                                : new Date()}
                                                            SampleType={this.state.SampleType || []}
                                                            SampleTypeValue={this.props.Login.masterData.defaultSampleType || []}
                                                            RegType={this.state.RegistrationType || []}
                                                            RegTypeValue={this.props.Login.masterData.defaultRegistrationType || []}
                                                            RegSubType={this.state.RegistrationSubType || []}
                                                            RegSubTypeValue={this.props.Login.masterData.defaultRegistrationSubType || []}
                                                            DesignTemplateMappingValue={this.props.Login.masterData.DesignTemplateMappingValue || []}
                                                            FilterStatus={this.state.REFilterStatus || []}
                                                            FilterStatusValue={this.props.Login.masterData.defaultFilterStatus || []}
                                                            ApprovalVersion={this.state.ApprovalConfigVersion || []}
                                                            ApprovalVersionValue={this.props.Login.masterData.defaultApprovalConfigVersion || []}
                                                            REJobStatus={this.state.REJobStatus || []}
                                                            JobStatusValue={this.props.Login.masterData.defaultjobstatus || []}
                                                            Test={this.state.Testvalues || []}
                                                            Batch={this.state.Batchvalues || []}
                                                            BatchValue={this.props.Login.masterData.defaultBatchvalue || []}
                                                            Worklist={this.state.Worklistvalues || []}
                                                            WorklistValue={this.props.Login.masterData.defaultWorklistvalue || []}
                                                            TestValue={this.props.Login.masterData.defaultTestvalues || []}
                                                            ConfigurationFilter={this.state.ConfigurationFilterValues || []}
                                                            ConfigurationFilterValue={this.props.Login.masterData.defaultConfigurationFilterValue || []}
                                                            onFilterComboChange={this.onFilterComboChange}
                                                            handleDateChange={this.handleDateChange}
                                                            userInfo={this.props.Login.userInfo}
                                                            onDesignTemplateChange={this.onDesignTemplateChange}
                                                            DynamicDesignMapping={this.state.stateDynamicDesign || []}
                                                        />
                                                    }
                                                ]}
                                                //ATE234  janakumar ALPD-5442 Result Entry-->While select the report HTML Error occurs
                                                // actionIcons={
                                                //     [this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL ?
                                                //         {
                                                //             title: "Report",
                                                //             controlname: "reports",
                                                //             objectName: "sample",
                                                //             hidden: this.state.userRoleControlRights.indexOf(reportPreviewId) === -1,
                                                //             onClick: this.props.previewSampleReport,
                                                //             inputData: {
                                                //                 userinfo: this.props.Login.userInfo,
                                                //                 ncontrolcode: reportPreviewId
                                                //             },
                                                //         } : {}
                                                //     ]
                                                // }
                                                commonActions={
                                                    <>

                                                        <ProductList className="d-flex product-category float-right icon-group-wrap">
                                                            {this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE ?
                                                                <Nav.Link
                                                                    // data-for="tooltip-common-wrap"
                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_ENTERIDENTICALRESULT" })} hidden={this.state.userRoleControlRights.indexOf(identicalResultEnterId) === -1} className="btn btn-circle outline-grey ml-2" role="button" onClick={() => this.props.resultEntryGetSpec(this.props.Login.masterData, this.props.Login.userInfo, resultEnterId, this.state.testskip, this.state.testtake)}   >
                                                                    {/* <FontAwesomeIcon icon={faAddressBook} /> */}
                                                                    <Resultentry />
                                                                </Nav.Link>
                                                                : ""}
                                                            <Nav.Link 
                                                                //data-for="tooltip-common-wrap" 
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_EXPORTSAMPLES" })} 
                                                                hidden={this.state.userRoleControlRights.indexOf(exportId) === -1}
                                                                className="btn btn-circle outline-grey ml-2" role="button" 
                                                                // onClick={() => this.exportExcelHeader(testChildGetREParam, this.props.Login.masterData.RESelectedTest, this.props.Login.userInfo, exportId, this.state.testskip, this.state.testtake)}>
                                                                onClick={() => this.exportExcelHeader( this.props.Login.masterData.RE_SAMPLE, this.props.Login.userInfo, exportId)}>
                                                                <FontAwesomeIcon icon={faFileExcel} />                                         
                                                            </Nav.Link>
                                                            <Nav.Link
                                                                //data-for="tooltip-common-wrap" 
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_IMPORTRESULT" })}
                                                                hidden={this.state.userRoleControlRights.indexOf(importId) === -1}
                                                                className="btn btn-circle outline-grey ml-2" role="button"
                                                                onClick={() => this.resultImport(importId)}>
                                                                <FontAwesomeIcon icon={faFileImport} />
                                                            </Nav.Link>

                                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                                onClick={() => this.onReload()}
                                                                data-for="tooltip-common-wrap"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                                <RefreshIcon className='custom_icons' />
                                                            </Button>
                                                        </ProductList>
                                                    </>
                                                }
                                            />
                                        </div>
                                        <div>
                                            <div style={this.state.showTest === true ? { display: "block" } : { display: "none" }} >
                                                {mainDesign}
                                            </div>

                                        </div>
                                    </SplitterLayout>
                                </div>

                                <div className={`${this.state.enablePropertyPopup ? 'active-popup' : ""} vertical-tab ${this.state.activeTabIndex ? 'active' : ""}`} >
                                    <div className={`${this.state.enablePropertyPopup ? 'active-popup' : ""} vertical-tab-content pager_wrap wrap-class ${this.state.activeTabIndex ? 'active' : ""}`} style={{ width: this.state.enablePropertyPopup ? this.state.propertyPopupWidth + '%' : "" }}>
                                        <span className={` vertical-tab-close ${this.state.activeTabIndex ? 'active' : ""}`} onClick={() => this.changePropertyViewClose(false)}><FontAwesomeIcon icon={faChevronRight} /> </span>
                                        <div className={` vertical-tab-content-common sm-view-v-t position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 1 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            {this.state.activeTabIndex && this.state.activeTabIndex == 1 ? this.sideNavDetail("IDS_RESULTS") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-grid position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 2 ? 'active' : ""}`}>
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
                                        <div className={` vertical-tab-content-grid position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 4 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_INSTRUMENT" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex == 4 ? this.sideNavDetail("IDS_INSTRUMENT") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-comments vertical-tab-content-common position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 5 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_MATERIAL" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex == 5 ? this.sideNavDetail("IDS_MATERIAL") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-comments vertical-tab-content-common position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 6 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_TASK" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex == 6 ? this.sideNavDetail("IDS_TASK") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-comments vertical-tab-content-common position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 7 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_TESTAPPROVALHISTORY" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex == 7 ? this.sideNavDetail("IDS_TESTAPPROVALHISTORY") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-comments vertical-tab-content-common position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 8 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_SAMPLEDETAILS" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex == 8 ? this.sideNavDetail("IDS_SAMPLEDETAILS") : ""}
                                        </div>
                                    </div>
                                    <div className='tab-head'>
                                        <ul>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex == 1 ? 'active' : ""}`} onClick={() => this.changePropertyView(1, "IDS_RESULTS")}>
                                                <FontAwesomeIcon icon={faFileInvoice}
                                                    data-for="tooltip-common-wrap"
                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_RESULT" })} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_RESULT" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex == 2 ? 'active' : ""}`} onClick={() => this.changePropertyView(2, "IDS_ATTACHMENTS")}>
                                                <FontAwesomeIcon icon={faLink} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_ATTACHMENTS" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex == 3 ? 'active' : ""}`} onClick={() => this.changePropertyView(3, "IDS_COMMENTS")}>
                                                <FontAwesomeIcon icon={faComments} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex == 4 ? 'active' : ""}`} onClick={() => this.changePropertyView(4, "IDS_INSTRUMENT")}>
                                                <FontAwesomeIcon icon={faMicroscope} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_INSTRUMENT" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex == 5 ? 'active' : ""}`} onClick={() => this.changePropertyView(5, "IDS_MATERIAL")}>
                                                <FontAwesomeIcon icon={faFlask} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_MATERIAL" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex == 6 ? 'active' : ""}`} onClick={() => this.changePropertyView(6, "IDS_TASK")}>
                                                <FontAwesomeIcon icon={faCommentDots} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_TASK" })}
                                                </span>
                                            </li>
                                            {/* <li className={`${this.state.activeTabIndex && this.state.activeTabIndex == 7 ? 'active' : ""}`} onClick={() => this.changePropertyView(7)}>
                                                <FontAwesomeIcon icon={faHistory} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_TESTAPPROVALHISTORY" })}
                                                </span>
                                            </li> */}
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex == 8 ? 'active' : ""}`} onClick={() => this.changePropertyView(8, "IDS_SAMPLEDETAILS")}>
                                                <FontAwesomeIcon icon={faEye} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_SAMPLEDETAILS" })}
                                                </span>
                                            </li>
                                        </ul>
                                        <span className='tab-click-toggle-btn'>
                                            <CustomSwitch
                                                // label={"Auto Show"}
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
                                                // label={"Popup Nav"}
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
                            </ListWrapper >
                            {/* </PerfectScrollbar> */}
                        </Col >
                    </Row >
                </ListWrapper >
                {/* </PerfectScrollbar> */}

                <PortalModal>
                    <div>
                        <Modal
                            centered
                            scrollable
                            bsPrefix="model model_zindex"
                            show={this.props.Login.openELNSheet}
                            // show={this.state.openELNSheet}
                            onHide={this.openClosePortal}
                            dialogClassName={`${this.props.nflag && this.props.nflag === 2 ? 'alert-popup' : ''} modal-fullscreen`}
                            backdrop="static"
                            keyboard={false}
                            enforceFocus={false}
                            aria-labelledby="example-custom-modal-styling-title"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title style={{ "line-height": "1.0" }} id="example-custom-modal-styling-title">
                                    {this.props.intl.formatMessage({ id: "IDS_ELNSHEET" })}
                                </Modal.Title>
                                <ReactTooltip globalEventOff="true" />

                            </Modal.Header>
                            <Modal.Body>
                                <div className="modal-inner-content">
                                    {/* <Iframe url={this.state.enlLink} */}
                                    <Iframe
                                        url={this.props.Login.masterData.enlLink}
                                        width="98%"
                                        height="1000px"
                                        id="reportviewID"
                                        className="reportview"
                                    //display="initial"
                                    /// position="relative" 
                                    />
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>
                </PortalModal>
                <PortalModal>
                    <ModalShow
                        modalShow={this.props.Login.showAlertGrid}
                        modalTitle={this.props.Login.showAlertForPredefined || this.props.Login.additionalInfoView ? this.props.intl.formatMessage({ id: "IDS_ADDITIONALINFOREQURIED" })//this.props.Login.onlyAlertMsgAvailable?"Alert":this.props.Login.masterData['salertmessage']
                            // :this.props.intl.formatMessage({ id: "IDS_COMPLETETHEFOLLOWINGTESTS" })} 
                            : this.props.intl.formatMessage({ id: "IDS_RULECOMPLETEVALIDATION" })}
                        //  needCloseButton={this.props.Login.showAlertForPredefined||this.props.Login.additionalInfoView?true:false}
                        closeModal={this.closeModalShow}
                        rulesenginealret={true}
                        onSaveClick={this.props.Login.showAlertGrid == true ? this.onskiprule : this.onModalSave}
                        removeCancel={this.props.Login.showAlertForPredefined || this.props.Login.additionalInfoView ? true : false}
                        // needSubmit={this.props.Login.showAlertForPredefined||this.props.Login.additionalInfoView?true:false}
                        needSubmit={true}
                        needSave={this.props.Login.showAlertForPredefined || this.props.Login.additionalInfoView ? "" : true}
                        selectedRecord={this.state.selectedRecord || {}}
                        // mandatoryFields={this.props.Login.showAlertForPredefined||this.props.Login.additionalInfoView?
                        //     this.mandatoryFieldsForAdditionalInfo():""}
                        size={this.props.Login.showAlertForPredefined || this.props.Login.additionalInfoView ? "" : 'lg'}
                        showAlertMsg={this.props.Login.showAlertForPredefined ? true : false}
                        modalBody={this.props.Login.additionalInfoView ?
                            this.state.selectedRecord['additionalResultData'] :
                            this.props.Login.showAlertForPredefined ?
                                <ResultEntryPredefinedComments
                                    onlyAlertMsgAvailable={this.props.Login.onlyAlertMsgAvailable}
                                    salertmessage={this.props.Login.masterData['salertmessage']}
                                    showMultiSelectCombo={this.props.Login.showMultiSelectCombo}
                                    testgrouptestpredefsubresultOptions={this.props.Login.masterData.testgrouptestpredefsubresultOptions || []}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputChange={this.onInputChange}
                                    onComboChange={this.onComboChange}
                                /> :
                                <CustomTabs tabDetail={this.tabAlertRulesEngine()} onTabChange={this.onTabChangeRulesEngine} destroyInactiveTabPane={true} />
                        }
                    />
                </PortalModal>
                {this.props.Login.openModal ?
                    <SlideOutModal
                        show={this.props.Login.openModal}
                        size={this.props.Login.screenName === 'IDS_MEANPARAMETER' || this.props.Login.screenName === "IDS_PREVIOUSRESULTVIEW" || this.props.Login.screenName === "IDS_RESULTENTRY" ? "xl" : "lg"}

                        closeModal={this.closeModal}
                        showCalculate={this.props.Login.screenName === 'IDS_RESULTFORMULA' ? true : false}
                        operation={// this.props.Login.screenName === 'IDS_RESULTPARAMETERCOMMENTS'?"":
                            this.props.Login.screenName === 'IDS_RESULTENTRY' || this.props.Login.screenName === 'IDS_ENFORCERESULT' || this.props.Login.screenName === 'IDS_RESULTENTRYPARAMETER' ? ""
                                : this.props.Login.operation
                        }
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName === "IDS_RESULTENTRYPARAMETER" ? this.props.Login.masterData.realTestcodeValue.stestsynonym : this.props.Login.screenName}
                        selectedRecord={
                            this.props.Login.screenName === "IDS_RESULTENTRYCOMPLETE" && !!this.props.Login.loadEsign ?
                                this.state.selectedRecordCompleteForm :
                                this.props.Login.screenName === 'IDS_INSTRUMENT' && !this.props.Login.loadEsign ?
                                    this.state.selectedRecordInstrumentForm :
                                    this.props.Login.screenName === 'IDS_MATERIAL' && !this.props.Login.loadEsign ?
                                        this.state.selectedRecordMaterialForm :
                                        this.props.Login.screenName === 'IDS_TASK' && !this.props.Login.loadEsign ?
                                            this.state.selectedRecordTaskForm :
                                            this.props.Login.screenName === 'IDS_RESULTFORMULA' ?
                                                this.state.selectedRecord.selectedMandatory : this.state.selectedRecord || {}
                        }
                        mandatoryFields={
                            //  this.props.Login.screenName === 'IDS_INSTRUMENT' ? mandatoryFieldsInstrument :
                            //  this.props.Login.screenName === 'IDS_TASK' ? mandatoryFieldsTask :
                            this.props.Login.screenName === 'IDS_TESTMETHODSOURCE' ? mandatoryFieldsTestMethodSource :
                                this.props.Login.screenName === 'IDS_PARAMETERCOMMENTS' ? mandatoryFieldsParameter :
                                    this.props.Login.screenName === 'IDS_RESULTFORMULA' ? validateFormulaMandyFields :
                                        this.props.Login.screenName === 'IDS_ENFORCERESULT' ? mandatoryEnforceResult : this.props.Login.screenName === 'IDS_SECTION' ? mandatoryFieldsSection : []
                        }
                        esign={this.props.Login.loadEsign}
                        innerPopup={this.props.Login.screenName}
                        validateEsign={this.validateEsign}

                        onSaveClick={
                            this.props.Login.screenName === "IDS_RESULTENTRYCOMPLETE" ? (e) =>
                                onSaveMandatoryValidation(this.state.selectedRecordCompleteForm, mandatoryFieldsComplete, this.onSaveClick) :
                                this.props.Login.multiFilterLoad ? this.onSaveMultiFilterClick :

                                    this.props.Login.screenName === 'IDS_INSTRUMENT' ?
                                        (e) =>
                                            onSaveMandatoryValidation(this.state.selectedRecordInstrumentForm, mandatoryFieldsInstrument,
                                                this.onSaveClick) :
                                        this.props.Login.screenName === 'IDS_MATERIAL' ?
                                            (e) =>
                                                onSaveMandatoryValidation(this.state.selectedRecordMaterialForm, mandatoryFieldsMaterial,
                                                    this.onSaveClick) :
                                            this.props.Login.showValidate ? this.calculateFormula
                                                : this.props.Login.screenName === 'IDS_RESULTIMPORTFILE' ? this.onSaveFileClick
                                                    : this.props.Login.screenName === 'IDS_ADHOCPARAMETER' ? this.props.Login.masterData.realSampleTypeValue.nclinicaltyperequired === transactionStatus.YES ? this.onSaveClickAdhocParam : this.onsaveClickAdhocparameter
                                                        : this.onSaveClick



                        }
                        showValidate={this.props.Login.screenName === 'IDS_RESULTFORMULA' ? false : this.props.Login.showValidate}
                        modalEvent={this.state.modalEvent}
                        hideSave={this.props.Login.screenName === "IDS_PREVIOUSRESULTVIEW" ? true : false}
                        addComponent={
                            this.props.Login.loadEsign ?
                                <Esign
                                    operation={this.props.Login.operation}
                                    onInputOnChange={this.onEsignInputOnChange}
                                    inputParam={this.props.Login.inputParam}
                                    selectedRecord={this.state.selectedRecord || {}}
                                /> :
                                this.props.Login.screenName === 'IDS_RESULTENTRY' ?
                                    this.state.selectedRecord.ResultParameter &&
                                    this.state.selectedRecord.ResultParameter.map((parameterResult, index) => {
                                        return <ResultEntryForm
                                            index={index}
                                            //  wrappedComponentRef={ref => this.resultEntryFormRef = ref}
                                            //   ref={this.resultEntryFormRef}
                                            //  getPredefinedData={this.props.getPredefinedData}
                                            ResultParameter={[...this.state.selectedRecord.ResultParameter]}
                                            predefinedValues={this.props.Login.masterData.PredefinedValues}
                                            defaultPredefinedValues={this.props.Login.masterData.PredefinedValues}
                                            gradeValues={this.props.Login.masterData.GradeValues || []}
                                            selectedNumericData={this.props.Login.masterData.selectedNumericData}
                                            selectedResultGrade={this.state.selectedRecord.selectedResultGrade || []}
                                            paremterResultcode={this.props.Login.masterData.paremterResultcode || []}
                                            parameterResults={parameterResult //this.state.selectedRecord.ResultParameter
                                                || []}
                                            Login={this.props.Login}
                                            handleClose={this.handleClose}
                                            onSaveClick={this.onSaveClick}
                                            onResultInputChange={this.onResultInputChange}
                                            //onGradeEvent={this.onGradeEvent}
                                            getFormula={this.getFormula}
                                            onDropTestFile={this.onDropTestFile}
                                            onKeyPress={this.onKeyPress}
                                            deleteAttachmentParamFile={this.deleteAttachmentParameterFile}
                                            viewAdditionalInfo={this.viewAdditionalInfo}
                                            needSubSample={this.props.Login.masterData.realRegSubTypeValue.nneedsubsample}
                                            intl={this.props.intl}
                                            ResultAccuracy={this.props.Login.ResultAccuracy}
                                            Unit={this.props.Login.Unit}
                                            selectedRecord={this.state.selectedRecord || {}}
                                            onComboChange={this.onComboChange}
                                            formFields={this.props.Login.formFields||[]}



                                        />
                                    })
                                    :
                                    //ALPD-4156--Vignesh R(15-05-2024)-->Result Entry - Option to change section for the test(s)	
                                    this.props.Login.screenName === "IDS_SECTION" ?
                                        <ScheduleSection
                                            selectedRecord={this.state.selectedRecord || {}}
                                            onComboChange={this.onComboChange}
                                            section={this.props.Login.section}
                                            operation={this.props.Login.operation}
                                            userInfo={this.props.Login.userInfo}

                                        />
                                        :

                                        this.props.Login.screenName === "IDS_RESULTENTRYCOMPLETE" ?
                                            <ResultEntryCompleteForm
                                                onComboChange={this.onComboChange}
                                                Users={this.props.Login.Users}
                                                selecteRecord={this.state.selectedRecord || {}}
                                                selectedRecordCompleteForm={this.props.Login.selectedRecordCompleteForm || {}}
                                                userInfo={this.props.Login.userInfo}
                                                onChildDataChange={this.onChildDataChange}
                                            />

                                            :

                                            this.props.Login.screenName === 'IDS_RESULTENTRYPARAMETER' ?
                                                <>
                                                    <Row>
                                                        {this.state.selectedRecord.selectedSpecification &&
                                                            <FormSelectSearch
                                                                formLabel={this.props.intl.formatMessage({ id: "IDS_PROFILETREE" }) + ' / ' + this.props.intl.formatMessage({ id: this.props.Login.genericLabel && this.props.Login.genericLabel["Specification"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] })}
                                                                isSearchable={true}
                                                                name={"nallottedspeccode"}
                                                                isDisabled={false}
                                                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                isClearable={false}
                                                                options={this.state.selectedRecord.selectedSpecification || []}
                                                                value={this.state.selectedRecord.nallottedspeccode && this.state.selectedRecord.nallottedspeccode || ""}
                                                                defaultValue={this.state.selectedRecord.selectedSpecification && this.state.selectedRecord.selectedSpecification["nallottedspeccode"] || ""}
                                                                onChange={(event) => this.onChange(event, "nallottedspeccode", 1)}
                                                                closeMenuOnSelect={true}
                                                            >
                                                            </FormSelectSearch>}


                                                        {this.state.selectedRecord.selectedComponent &&
                                                            <FormSelectSearch
                                                                formLabel={this.props.intl.formatMessage({ id: this.props.Login.genericLabel && this.props.Login.genericLabel["Component"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] })}
                                                                isSearchable={true}
                                                                name={"ncomponentcode"}
                                                                isDisabled={false}
                                                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                isClearable={false}
                                                                options={this.state.selectedRecord.selectedComponent || []}
                                                                value={this.state.selectedRecord.ncomponentcode && this.state.selectedRecord.ncomponentcode || ""}
                                                                defaultValue={this.state.selectedRecord.selectedComponent && this.state.selectedRecord.selectedComponent["ncomponentcode"] || ""}
                                                                onChange={(event) => this.onChange(event, "ncomponentcode", 2)}
                                                                closeMenuOnSelect={true}
                                                            >
                                                            </FormSelectSearch>


                                                        }
                                                    </Row>
                                                    {this.state.selectedRecord.ResultParameter &&
                                                        this.state.selectedRecord.ResultParameter.map((parameterResult, index) => {
                                                            return <ResultEntryParameterForm
                                                                index={index}
                                                                //  wrappedComponentRef={ref => this.resultEntryFormRef = ref}
                                                                //   ref={this.resultEntryFormRef}
                                                                //  getPredefinedData={this.props.getPredefinedData}
                                                                ResultParameter={[...this.state.selectedRecord.ResultParameter]}
                                                                predefinedValues={this.props.Login.masterData.PredefinedValues}
                                                                defaultPredefinedValues={this.props.Login.masterData.PredefinedValues}
                                                                gradeValues={this.props.Login.masterData.GradeValues || []}
                                                                selectedNumericData={this.props.Login.masterData.selectedNumericData}
                                                                selectedResultGrade={this.state.selectedRecord.selectedResultGrade || []}
                                                                paremterResultcode={this.props.Login.masterData.paremterResultcode || []}
                                                                parameterResults={parameterResult //this.state.selectedRecord.ResultParameter
                                                                    || []}
                                                                Login={this.props.Login}
                                                                handleClose={this.handleClose}
                                                                onSaveClick={this.onSaveClick}
                                                                onResultInputChange={this.onResultInputChange}
                                                                onSampleAdd={this.onSampleAdd}
                                                                //onGradeEvent={this.onGradeEvent}
                                                                getFormula={this.getFormula}
                                                                onDropTestFile={this.onDropTestFile}
                                                                onKeyPress={this.onKeyPress}
                                                                deleteAttachmentParamFile={this.deleteAttachmentParameterFile}
                                                                viewAdditionalInfo={this.viewAdditionalInfo}
                                                                needSubSample={this.props.Login.masterData.realRegSubTypeValue.nneedsubsample}
                                                                intl={this.props.intl}
                                                                controlMap={this.state.controlMap}
                                                                userRoleControlRights={this.state.userRoleControlRights}
                                                            />
                                                        })}

                                                </>
                                                :
                                                this.props.Login.screenName === 'IDS_TESTMETHODSOURCE' ?
                                                    <TestEditForm
                                                        methodValues={this.props.Login.masterData.MethodData}
                                                        sourceValues={this.props.Login.masterData.SourceData}
                                                        selecteRecord={this.state.selectedRecord || {}}
                                                        onComboChange={this.onComboChange}
                                                        handleClose={this.handleClose}
                                                        onSaveClick={this.onSaveClick}
                                                    /> :
                                                    this.props.Login.screenName === 'IDS_INSTRUMENT' ?
                                                        <ResultEntryInstrumentForm
                                                            selectedRecordInstrumentForm={this.props.Login.selectedRecordInstrumentForm}
                                                            instrumentcatValue={this.props.Login.masterData.InstrumentCategory}
                                                            instrumentNameValue={this.props.Login.masterData.InstrumentName}
                                                            instrumentIdValue={this.props.Login.masterData.InstrumentId}
                                                            selecteRecord={this.state.selectedRecord || {}}
                                                            timeZoneListData={this.props.Login.timeZoneList || []}
                                                            onComboChange={this.onComboChange}
                                                            onComboCategoryChange={this.onComboCategoryChange}
                                                            onComboNameChange={this.onComboNameChange}
                                                            onDateChange={this.onDateChange}
                                                            handleClose={this.handleClose}
                                                            onSaveClick={this.onSaveClick}
                                                            onChildDataChange={this.onChildDataChange}
                                                            userInfo={this.props.Login.userInfo}
                                                            needSubSample={this.props.Login.masterData.realRegSubTypeValue.nneedsubsample}
                                                        /> :
                                                        this.props.Login.screenName === 'IDS_MATERIAL' ?
                                                            <ResultEntryMaterialForm
                                                                Login={this.props.Login}
                                                                materialType={this.props.Login.materialType}
                                                                materialCategory={this.props.Login.materialCat}
                                                                material={this.props.Login.material}
                                                                materialInventory={this.props.Login.materialInventory}
                                                                selectedRecord={this.state.selectedRecord || {}}
                                                                selectedRecordMaterialForm={this.state.selectedRecordMaterialForm || {}}
                                                                onMaterialComboChange={this.onMaterialComboChange}
                                                                onInputOnChange={this.onInputOnChange}
                                                                onChildDataChange={this.onChildDataChange}
                                                                onDateChange={this.onDateChange}
                                                                handleClose={this.handleClose}
                                                                onSaveClick={this.onSaveClick}
                                                                userInfo={this.props.Login.userInfo}
                                                                needSubSample={this.props.Login.masterData.realRegSubTypeValue.nneedsubsample}
                                                            /> :
                                                            this.props.Login.screenName === 'IDS_TASK' ?
                                                                <ResultEntryTaskForm
                                                                    selectedRecordTaskForm={this.state.selectedRecordTaskForm || {}}
                                                                    selectedRecord={this.state.selectedRecord || {}}
                                                                    onNumericChange={this.ontaskNumericChange}
                                                                    onInputChange={this.ontaskInputChange}
                                                                    handleClose={this.handleClose}
                                                                    onSaveClick={this.onSaveClick}
                                                                /> :
                                                                this.props.Login.screenName === 'IDS_PARAMETERCOMMENTS' ?
                                                                    <ResultEntryParamCommetsForm
                                                                        selecteRecord={this.state.selectedRecord || {}}
                                                                        onInputChange={this.onInputChange}
                                                                        handleClose={this.handleClose}
                                                                        onSaveClick={this.onSaveClick}
                                                                    /> : this.props.Login.screenName === 'IDS_RESULTFORMULA' ?
                                                                        <ResultEntryFormulaForm
                                                                            DynamicFields={this.props.Login.masterData.DynamicFormulaFields}
                                                                            // formRef={this.formRef}
                                                                            masterData={this.props.Login.masterData}
                                                                            handleClose={this.handleClose}
                                                                            screenName={this.props.Login.screenName}
                                                                            selectedForumulaInput={this.state.selectedForumulaInput || []}
                                                                            onFormulaInputChange={this.onFormulaInputChange}
                                                                            getAverageResult={this.getAverageResult}
                                                                            Login={this.props.Login}
                                                                            showValidate={this.props.Login.showValidate}
                                                                            selectedRecord={this.state.selectedRecord || {}}
                                                                        />
                                                                        : this.props.Login.screenName === 'IDS_RESULTIMPORTFILE' ?
                                                                            <ResultEntryImport
                                                                                handleClose={this.handleClose}
                                                                                screenName={this.props.Login.screenName}
                                                                                onDropFile={this.onDropFile}
                                                                                selectedImportFile={this.props.Login.masterData.selectedImportFile || {}}
                                                                                deleteAttachment={this.deleteAttachment}
                                                                            /> :
                                                                            this.props.Login.screenName === 'IDS_MEANPARAMETER' ?
                                                                                <ResultEntryMean
                                                                                    // onInputOnChange={this.onMeanInputOnChange}
                                                                                    // onComboChange={this.onMeanComboChange}
                                                                                    screenName={this.props.Login.screenName}
                                                                                    headerSelectionChange={this.headerSelectionChange}
                                                                                    selectionChange={this.selectionChange}
                                                                                    selectAll={this.state.selectAll}
                                                                                    testMean={this.state.testMean}
                                                                                    userInfo={this.props.Login.userInfo}
                                                                                    meanTestParameterList={this.state.meanTestParameterList || []}
                                                                                    selectedTestParam={this.state.selectedTestParam}
                                                                                /> :
                                                                                this.props.Login.screenName === 'IDS_RESULTPARAMETERCOMMENTS' ?
                                                                                    <ResultEntryPredefinedComments
                                                                                        selectedRecord={this.state.selectedRecord || {}}
                                                                                        onInputChange={this.onInputChange}
                                                                                        onComboChange={this.onComboChange}
                                                                                    /> :
                                                                                    this.props.Login.screenName === 'IDS_ENFORCERESULT' ?
                                                                                        <ResultEntryEnforceResult
                                                                                            selectedRecord={this.state.selectedRecord || {}}
                                                                                            GradeList={this.props.Login.masterData.GradeList &&
                                                                                                this.props.Login.masterData.GradeList}
                                                                                            onInputChange={this.onInputChange}
                                                                                            onComboChange={this.onComboChange}
                                                                                        /> :

                                                                                        this.props.Login.screenName === 'IDS_PREVIOUSRESULTVIEW' ?
                                                                                            (
                                                                                                <>

                                                                                                    <Card className='one' >
                                                                                                        <Card.Body>
                                                                                                            <SpecificationInfo
                                                                                                                controlMap={this.state.controlMap}
                                                                                                                auditInfoFields={auditInfoFields}
                                                                                                                userRoleControlRights={this.state.userRoleControlRights}
                                                                                                                selectedSpecification={this.props.Login.masterData.viewdetails}
                                                                                                                userInfo={this.props.Login.userInfo}
                                                                                                                selectedNode={this.props.Login.masterData.selectedNode}
                                                                                                                selectedRecord={this.state.filterData}
                                                                                                                approvalRoleActionDetail={this.props.Login.masterData.ApprovalRoleActionDetail}
                                                                                                                screenName="IDS_PREVIOUSRESULTVIEW"

                                                                                                            />
                                                                                                        </Card.Body>
                                                                                                    </Card>
                                                                                                    <br></br>

                                                                                                    <DataGrid
                                                                                                        primaryKeyField={"ntransactiontestcode"}
                                                                                                        //data={this.props.Login.addComponentDataList || []}
                                                                                                        data={this.props.Login.masterData.AuditModifiedComments || []}
                                                                                                        detailedFieldList={this.feildsForGrid}
                                                                                                        extractedColumnList={this.feildsForGrid}
                                                                                                        //dataResult={this.props.Login.masterData.AuditModifiedComments && this.props.Login.masterData.AuditModifiedComments.length > 0
                                                                                                        // && process(this.props.Login.masterData.AuditModifiedComments, { skip: 0, take: 10 })}
                                                                                                        // dataState={{ skip: 0, take: 10 }}
                                                                                                        dataResult={this.props.Login.masterData.AuditModifiedComments && this.props.Login.masterData.AuditModifiedComments.length > 0
                                                                                                            && process(this.props.Login.masterData.AuditModifiedComments, this.state.dataState ? this.state.dataState : { skip: 0, take: 10 })}
                                                                                                        //dataState={{ skip: 0, take: 10 }}
                                                                                                        dataState={this.state.dataState
                                                                                                            ? this.state.dataState : { skip: 0, take: 10 }}
                                                                                                        pageable={true}
                                                                                                        scrollable={'scrollable'}
                                                                                                        dataStateChange={this.dataResultStateChange}


                                                                                                    />
                                                                                                </>
                                                                                            )
                                                                                            :
                                                                                            this.props.Login.screenName === 'IDS_ADHOCPARAMETER' ?
                                                                                                this.props.Login.masterData.realSampleTypeValue.nclinicaltyperequired === transactionStatus.YES ?
                                                                                                    <AddAdhocParameter
                                                                                                        selectedRecord={this.state.selectedRecord || {}}
                                                                                                        onInputOnChange={this.onInputOnChange}
                                                                                                        onComboChange={this.onComboChange}
                                                                                                        adhocParamter={this.props.Login.masterData.AdhocParamter || {}}
                                                                                                    //operation={this.props.operation}
                                                                                                    /> : <ResultEntryAdhocParameter
                                                                                                        selectedRecordAdhocParameter={this.props.Login.selectedRecordAdhocParameter || {}}
                                                                                                        adhocParamter={this.props.Login.masterData.AdhocParamter || {}}
                                                                                                        onSaveClick={this.onSaveClick}
                                                                                                        onAdhocParameterInputChange={this.onAdhocParameterInputChange}
                                                                                                        onAdhocParameterComboChange={this.onAdhocParameterComboChange}
                                                                                                    />
                                                                                                //  Start of ALPD-4132 Additional Filter Render Component ATE-241
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

                                                                                                    //  End of ALPD-4132 Additional Filter render Component

                        }
                    />
                    : ""}
                {
                    this.props.Login.masterData.ChecklistData && this.props.Login.screenName === 'IDS_CHECKLISTRESULT' ?
                        <TemplateForm
                            templateData={this.props.Login.masterData.ChecklistData}
                            nregtypecode={parseInt(this.props.Login.masterData.realRegTypeValue.nregtypecode)}
                            nregsubtypecode={parseInt(this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode)}
                            needSaveButton={this.props.Login.needSaveButton}
                            formRef={this.formRef}
                            onTemplateInputChange={this.onTemplateInputChange}
                            handleClose={this.closeModal}
                            onTemplateComboChange={this.onTemplateComboChange}
                            screenName={this.props.Login.screenName}
                            onSaveClick={this.onSaveCheckList}
                            Login={this.props.Login}
                            viewScreen={this.props.Login.openTemplateModal}
                            selectedRecord={this.state.selectedRecord || []}
                            onTemplateDateChange={this.onTemplateDateChange}
                            needValidation={true}
                        /> : ""
                }
                    {this.props.Login.modalShow ? (//ALPD-4870-To show the add popup to get input of filter name,done by Dhanushya RI
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
        );
    }


    defaultActions = (testChildGetREParam, RESelectedTest, RESelectedSample, setDefaultId, testskip, testtake) => {
        const nregtypecode = this.props.Login.masterData.realRegTypeValue.nregtypecode;
        const nregsubtypecode = this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode;
        const ndesigntemplatemappingcode = parseInt(this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode);


        let TestList = [...this.props.Login.masterData.RE_TEST];
        TestList = TestList.splice(testskip, testskip + testtake);
        let acceptTestList = getSameRecordFromTwoArrays(TestList, this.props.Login.masterData.RESelectedTest, "ntransactiontestcode");
        if (acceptTestList && acceptTestList.length > 0) {
            let inputParam = {
                classUrl: 'resultentrybysample',
                methodUrl: "completeTest",
                inputData: {
                    'userinfo': this.props.Login.userInfo, 'nregtypecode': nregtypecode, 'nregsubtypecode': nregsubtypecode, 'ncontrolcode': setDefaultId,
                    "nneedReceivedInLab": parseInt(this.props.Login.settings && this.props.Login.settings['43'])
                },
                // formData: formData,
                // isFileupload: true,
                operation: "default",
                displayName: this.props.Login.inputParam.displayName,//, postParam,
                testChildGetREParam: { ...testChildGetREParam, ncontrolcode: setDefaultId },
                RESelectedTest: acceptTestList,
                RESelectedSample: RESelectedSample,
                ndesigntemplatemappingcode: parseInt(this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode)

            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, setDefaultId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true,
                        screenName: "defaultaction",
                        operation: "default"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.defaultTest(inputParam.testChildGetREParam, acceptTestList, RESelectedSample, nregtypecode, nregsubtypecode, ndesigntemplatemappingcode)
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLSSELECTTEST" }));
        }

    }
    formulaCalculation = (dataItem) => {

        let selectedSpec = getSameRecordFromTwoArrays(this.props.Login.masterData.RESelectedSample, this.props.Login.masterData.RegistrationParameter, "npreregno");
        let stransactiontestcode = "";
        let transactiontestcodeforvalidation = "";
        this.props.Login.masterData.RESelectedTest.map(x => {
            stransactiontestcode += x['ntransactiontestcode'] + ","
        }
        )
        let inputData = {
            "ntransactiontestcode": stransactiontestcode.substring(0, stransactiontestcode.length - 1),
            "ntransactionresultcode": dataItem.ntransactionresultcode,
            "ntestgrouptestparametercode": dataItem.ntestgrouptestparametercode,
            "nispredefinedformula": dataItem.nispredefinedformula,
            "nroundingdigits": dataItem.nroundingdigits,
            "npredefinedformulacode": dataItem.npredefinedformulacode,
            "npreregno": dataItem.npreregno,
            "nallottedspeccode": selectedSpec[0].nallottedspeccode,
            'userinfo': this.props.Login.userInfo,
            'transactiontestcodeforvalidation': dataItem['ntransactiontestcode'],
            'ncontrolcode': dataItem['ncontrolcode']
        }
        let inputParam = {
            classUrl: 'resultentrybysample',
            methodUrl: "FormulaCalculation",
            inputData: inputData,
            operation: "update",
            screenName: "formulacalculation",
            displayName: this.props.Login.inputParam.displayName//postParam

        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }


    completePopup = (testChildGetREParam, userInfo, completeResultId, testskip, testtake, validation) => {


        let TestList = [...this.props.Login.masterData.RE_TEST];
        TestList = TestList.splice(testskip, testskip + testtake);
        let acceptTestList = getSameRecordFromTwoArrays(TestList, this.props.Login.masterData.RESelectedTest, "ntransactiontestcode");



        if (acceptTestList && acceptTestList.length > 0) {
            let inputParam = {};
            let array = [];
            // let sectionflag = true; 
            // let tempsection = 0;
            // let sectionvalue = 0;
            // acceptTestList.forEach((item) => {
            //     sectionvalue = item.nsectioncode;
            //     if (sectionvalue !== tempsection && tempsection !== 0) {
            //         sectionflag = false;
            //     } else {
            //         tempsection = sectionvalue;
            //         if(!array.includes(tempsection)){
            //             array.push(tempsection);
            //         }

            acceptTestList && acceptTestList.map((item) => {
                if (!array.includes(item.nsectioncode)) {
                    array.push(item.nsectioncode)
                }
            })


            //if(sectionflag){
            let Map = {
                nregtypecode: testChildGetREParam.nregtypecode,
                nregsubtypecode: testChildGetREParam.nregsubtypecode,
                ncontrolcode: completeResultId,
                nsectioncode: array.map(nsectioncode => nsectioncode).join(","),
                transactiontestcode: acceptTestList ? acceptTestList.map(test => test.ntransactiontestcode).join(",") : "",
                RESelectedTest: acceptTestList,
                skip: this.state.skip,
                take: this.state.take,
                testskip: this.state.testskip,
                testtake: this.state.testtake,
                subSampleSkip: this.state.subSampleSkip,
                subSampleTake: this.state.subSampleTake,
                basedrulesengine: validation,
                userinfo: userInfo,
                // operation: 'CompletePopup',
                "nneedReceivedInLab": parseInt(this.props.Login.settings && this.props.Login.settings['43']),
                // ALPD-5596 - added by Gowtham R on 25/03/2025 - Result Entry -> cannot complete the result entry record.
                napprovalconfigversioncode: this.props.Login.masterData.defaultApprovalConfigVersion && this.props.Login.masterData.defaultApprovalConfigVersion.napproveconfversioncode

            }
            inputParam = {
                inputData: Map,
            }
            this.props.CompletePopupAction(inputParam);
            // }else {
            //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMESECTIONTEST" }));
            // }

        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTESTTOCOMPLETE" }));
        }

    }


    completeActions = (testChildGetREParam, RESelectedTest, userInfo, completeResultId, testskip, testtake, validation) => {


        let TestList = [...this.props.Login.masterData.RE_TEST];
        TestList = TestList.splice(testskip, testskip + testtake);
        let acceptTestList = getSameRecordFromTwoArrays(TestList, this.props.Login.masterData.RESelectedTest, "ntransactiontestcode");

        if (acceptTestList && acceptTestList.length > 0) {
            let inputParam = {
                classUrl: 'resultentrybysample',
                methodUrl: "completeTest",
                inputData: { 'userinfo': this.props.Login.userInfo, 'ncontrolcode': completeResultId ,'nportalrequired':this.props.Login.masterData.realSampleTypeValue.nportalrequired,
                "nneedReceivedInLab":parseInt(this.props.Login.settings && this.props.Login.settings['43']),
                "ninsertMaterialInventoryTrans":parseInt(this.props.Login.settings && this.props.Login.settings['53']),
                 //ALPD-5679--Added by Vignesh R(10-04-2025)-->ETICA Test group --> Test is not generating when using rules engine. Check description.
                 "nneedtestinitiate": this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtestinitiate
            },
                // formData: formData,
                // isFileupload: true,
                operation: "complete",
                postParamList: this.postParamList,
                displayName: this.props.Login.inputParam.displayName,//, postParam,
                testChildGetREParam: testChildGetREParam,
                RESelectedTest: acceptTestList,
                skip: this.state.skip,
                take: this.state.take,
                testskip: this.state.testskip,
                testtake: this.state.testtake,
                subSampleSkip: this.state.subSampleSkip,
                subSampleTake: this.state.subSampleTake,
                basedrulesengine: validation,
                searchSampleRef: this.searchSampleRef,
                searchSubSampleRef: this.searchSubSampleRef,
                searchTestRef: this.searchTestRef,
                // ALPD-5596 - commented and added by Gowtham R on 25/03/2025 - Store the Analyzer Name in registrationtest table wheather setting[45] is 3 or 4
                // nsettingcode: this.props.Login.settings && parseInt(this.props.Login.settings[45]) === transactionStatus.YES ? transactionStatus.YES : transactionStatus.NO,
                // nusercode: this.props.Login.settings && parseInt(this.props.Login.settings[45]) === transactionStatus.YES ? this.state.selectedRecordCompleteForm.nusercode.value : "",
                // susername: this.props.Login.settings && parseInt(this.props.Login.settings[45]) === transactionStatus.YES ? this.state.selectedRecordCompleteForm.nusercode.label : -1
                nusercode: this.props.Login.settings && parseInt(this.props.Login.settings[45]) === transactionStatus.YES ? 
                                        this.state.selectedRecordCompleteForm.nusercode.value 
                                        : this.props.Login.userInfo.nusercode,
                susername: this.props.Login.settings && parseInt(this.props.Login.settings[45]) === transactionStatus.YES ? 
                                        this.state.selectedRecordCompleteForm.nusercode.label 
                                        : this.props.Login.userInfo.susername


            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, completeResultId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true,
                        screenName: "complete",
                        operation: "complete"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.completeTest(inputParam, acceptTestList, userInfo, completeResultId, false, { basedrulesengine: validation })


            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTESTTOCOMPLETE" }));
        }
    }



    testStartActions = (testChildGetREParam, RESelectedTest, userInfo, completeResultId, testskip, testtake) => {

        let TestList = [...this.props.Login.masterData.RE_TEST];
        TestList = TestList.splice(testskip, testskip + testtake);
        let acceptTestList = getSameRecordFromTwoArrays(TestList, this.props.Login.masterData.RESelectedTest, "ntransactiontestcode");

        if (acceptTestList && acceptTestList.length > 0) {
            let inputParam = {
                classUrl: 'resultentrybysample',
                methodUrl: "testInitiated",
                inputData: {
                    'userinfo': this.props.Login.userInfo, 'ncontrolcode': completeResultId, 'subSampleNeeded': this.props.Login.masterData.defaultRegistrationSubType.nneedsubsample, 'nneedmyjob': this.props.Login.masterData.defaultRegistrationSubType.nneedmyjob, 'nneedjoballocation': this.props.Login.masterData.defaultRegistrationSubType.nneedjoballocation, 'NeedJobAllocationAndMyjob': parseInt(this.props.Login.settings[41]),
                    "nneedReceivedInLab": parseInt(this.props.Login.settings && this.props.Login.settings['43']),
                    "nneedtestinitiate": this.props.Login.masterData.defaultRegistrationSubType.nneedtestinitiate
                },
                // formData: formData,
                // isFileupload: true,
                operation: "testinitiate",
                postParamList: this.postParamList,
                displayName: this.props.Login.inputParam.displayName,//, postParam,
                testChildGetREParam: testChildGetREParam,
                RESelectedTest: acceptTestList,
                skip: this.state.skip,
                take: this.state.take,
                testskip: this.state.testskip,
                progressTimerStart: true,
                testtake: this.state.testtake,
            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, completeResultId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true,
                        screenName: "complete",
                        operation: "complete"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.testStart(inputParam, acceptTestList, userInfo, completeResultId)
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTESTTOINITIATE" }));
        }
    }

    //ALPD-4156--Vignesh R(15-05-2024)-->Result Entry - Option to change section for the test(s)	
    getSectionChange(controlcode, testskip, testtake, operation) {
        if (this.props.Login.masterData.RESelectedTest.length > 0) {
            let testList = [];
            if (this.props.Login.masterData.searchedTest !== undefined) {
                testList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.searchedTest.slice(testskip, testskip + testtake), "ntransactiontestcode");

            } else {
                testList = this.props.Login.masterData.RE_TEST && this.props.Login.masterData.RE_TEST.slice(testskip, testskip + testtake);

            }
            let selectedTestList = getSameRecordFromTwoArrays(testList || [], this.props.Login.masterData.RESelectedTest, "ntransactiontestcode");

            let array = [];
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
            selectedTestList && selectedTestList.map((item) => {
                if (!array.includes(item.nsectioncode)) {
                    array.push(item.nsectioncode)
                }
            })

            if (sectionflag) {
                let inputParam = {};
                let Map = {
                    nsampletypecode: this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.realRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                    ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMapping.ndesigntemplatemappingcode,
                    napprovalversioncode: this.props.Login.masterData.realApproveConfigVersion.napprovalversioncode,
                    nsectioncode: array.map(nsectioncode => nsectioncode).join(","),
                    npreregno: selectedTestList ? selectedTestList.map(sample => sample.npreregno).join(",") : "",
                    ntransactionsamplecode: selectedTestList ? selectedTestList.map(subsample => subsample.ntransactionsamplecode).join(",") : "",
                    ntransactiontestcode: selectedTestList ? selectedTestList.map(test => test.ntransactiontestcode).join(",") : "",
                    nselectedtestcode: selectedTestList ? selectedTestList.map(sample => sample.ntestcode).join(",") : "",
                    ncontrolcode: controlcode,
                    nneedsubsample: this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
                    userinfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    operation: operation,
                    screenName: "IDS_SECTION",
                };
                inputParam = {
                    inputData: Map, selectedRecord: this.state.selectedRecord
                }
                this.props.getSectionChange(inputParam);
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMESECTIONTEST" }));

            }
        }

        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }));

        }
    }

    onSaveCheckList = (selectedRecord, userInfo, nregtypecode, nregsubtypecode) => {
        const ndesigntemplatemappingcode = parseInt(this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode);
        const nneedReceivedInLab= parseInt(this.props.Login.settings && this.props.Login.settings['43']);
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            let inputParam = {
                "inputData": { userinfo: userInfo
                }
            }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: {
                        selectedRecord, userInfo, nregtypecode, nregsubtypecode, ndesigntemplatemappingcode,nneedReceivedInLab,
                        operation: "updatechecklist", inputParam,
                    },
                    openModal: true,
                    operation: "updatechecklist"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.onSaveCheckList(selectedRecord, userInfo, nregtypecode, nregsubtypecode, ndesigntemplatemappingcode,nneedReceivedInLab)
        }

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
            screenData: this.props.Login.screenData
        }
        if (this.props.Login.operation === 'testinitiate' || this.props.Login.operation === 'complete' || this.props.Login.operation === 'default' || this.props.Login.operation === "updatechecklist" ||
            this.props.Login.operation === 'deleteInstrument' || this.props.Login.operation === 'createMethod' || this.props.Login.operation === 'deleteTask' || this.props.Login.operation === 'updateParameterComments' ||
            this.props.Login.operation === 'import' || this.props.Login.operation === 'updateSection') {
            this.props.validateEsignCredentialComplete(inputParam, "openModal");
        }

        else {
            this.props.validateEsignCredential(inputParam, "openModal");
        }
    }

    onEsignInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });

    }
    onChildDataChange = (childData) => {
        if (this.props.Login.screenName === 'IDS_MATERIAL') {
            this.setState({ selectedRecordMaterialForm: { ...childData }, isMaterialInitialRender: false })
        } else if (this.props.Login.screenName === 'IDS_RESULTENTRYCOMPLETE') {
            this.setState({ selectedRecordCompleteForm: { ...childData }, isCompleteInitialRender: false })
        } else if (this.props.Login.screenName === 'IDS_INSTRUMENT') {
            this.setState({ selectedRecordInstrumentForm: { ...childData }, isInstrumentInitialRender: false })
        }
    }
    onInputOnChange = (event, name) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        switch (name) {
            case 'ntestgroupmaterial':
                const ntestgrouptestcode = selectedRecord.ntestgroupmaterial == transactionStatus.YES ? this.props.Login.masterData.RESelectedTest[0].ntestgrouptestcode : -1
                this.props.getREMaterialComboGet({ ntestgroupmaterial: selectedRecord.ntestgroupmaterial, ntestgrouptestcode, RESelectedTest: this.props.Login.masterData.RESelectedTest, test: this.props.Login.masterData.RESelectedTest[0], userInfo: this.props.Login.userInfo })
                break;
            default:
                this.setState({ selectedRecord });
        }
    }

    onSaveFileClick = (saveType, formRef) => {
        const selectedImportFile = this.props.Login.masterData.selectedImportFile;
        const acceptedFile = selectedImportFile ? selectedImportFile.sfilename : [];
        const formData = new FormData();

        if (acceptedFile && acceptedFile.length > 0) {
            acceptedFile.forEach((file, index) => {
                formData.append("uploadedFile", file);
            });
            formData.append("filecount", acceptedFile.length);
        } else {
            return toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYONEFILETOSUBMIT" }))
        }

        formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
        formData.append("nregtypecode", this.props.Login.masterData.realRegTypeValue.nregtypecode);
        formData.append("nregsubtypecode", this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode);
        formData.append("ndesigntemplatemappingcode", this.props.Login.masterData && this.props.Login.masterData.ndesigntemplatemappingcode);
        formData.append("ncontrolcode", this.props.Login.importId);
        formData.append("ntransactiontestcode", this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest.map(x => x.ntransactiontestcode).join(",") : -1);
        formData.append("nneedReceivedInLab", parseInt(this.props.Login.settings && this.props.Login.settings['43']));
        //formData.append("ntestgrouptestcode", this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest.map(x => x.ntestgrouptestcode).join(",") : -1);  //Commented by sonia on 05th jan 2025 for jira id:ALPD-5174


        const inputParam = {
            inputData: { userinfo: this.props.Login.userInfo },
            formData: formData,
            isFileupload: true,
            screenName: "IDS_RESULTIMPORTFILE",

        }

        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData, },
                    openModal: true, screenName: "IDS_RESULTIMPORTFILE"
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.resultImportFile(inputParam, this.props.Login.masterData);
        }

    }

    onSaveClickAdhocParam = (saveType) => {
        if (Object.keys(this.state.selectedRecord).length > 0) {

            let Map = {};
            let testParameter = [];
            this.state.selectedRecord && this.state.selectedRecord.nparamtercode.forEach((data, index) =>
                testParameter.push(data.item));

            Map["ntestparametercode"] = testParameter.map(ntestgroupparamtercode => ntestgroupparamtercode.item.ntestparametercode).join(",");
            Map["ntestgrouptestcode"] = testParameter.map(ntestgrouptestcode => ntestgrouptestcode.item.ntestgrouptestcode).join(",");
            Map["ntestcode"] = testParameter.map(ntestgrouptestcode => ntestgrouptestcode.item.ntestcode).join(",");
            Map["userinfo"] = this.props.Login.userInfo;
            Map["npreregno"] = this.props.Login.adhocpreregno;
            Map["ntransactiontestcode"] = this.props.Login.adhoctransactiontestcode;
            Map["masterData"] = this.props.Login.masterData;
            Map["multiselecttransactiontestcode"] = this.props.Login.masterData.RESelectedTest.map(x => x.ntransactiontestcode).join(",");
            Map["nregtypecode"] = this.props.Login.masterData.realRegTypeValue.nregtypecode;
            Map["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode;
            Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode;
            Map["nneedsubsample"] = this.props.Login.masterData.nneedsubsample;
            let inputParam = {
                inputData: Map,
                action: 'createAdhocParameter',
                operation: "create",
                methodUrl: "AdhocParamter",
                classUrl: "resultentrybysample"

            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.adhocId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true,
                        screenName: "IDS_ADHOCPARAMETER",
                        operation: "adhocTestParameter"
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.createAdhocParamter(inputParam);
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" }))
        }
    }
    onsaveClickAdhocparameter = (saveType) => {
        if (this.state.selectedRecordAdhocParameter && this.state.selectedRecordAdhocParameter.nparamtercode && this.state.selectedRecordAdhocParameter.nparamtercode.length > 0) {
            let Map = {};
            let testParameter = [];
            this.state.selectedRecordAdhocParameter && this.state.selectedRecordAdhocParameter.nparamtercode.forEach((data, index) =>
                testParameter.push(data.item));

            Map["ntestparametercode"] = testParameter.map(ntestgroupparamtercode => ntestgroupparamtercode.item.ntestparametercode).join(",");
            Map["ntestgrouptestcode"] = this.props.Login.masterData.RESelectedTest[0].ntestgrouptestcode
            //testParameter.map(ntestgrouptestcode => ntestgrouptestcode.item.ntestgrouptestcode).join(",");
            Map["ntestcode"] = testParameter.map(ntestgrouptestcode => ntestgrouptestcode.item.ntestcode).join(",");
            Map["userinfo"] = this.props.Login.userInfo;
            Map["npreregno"] = this.props.Login.adhocpreregno;
            Map["ntransactiontestcode"] = this.props.Login.adhoctransactiontestcode;
            Map["masterData"] = this.props.Login.masterData;
            Map["multiselecttransactiontestcode"] = this.props.Login.masterData.RESelectedTest.map(x => x.ntransactiontestcode).join(",");
            Map["nregtypecode"] = this.props.Login.masterData.realRegTypeValue.nregtypecode;
            Map["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode;
            Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode;
            Map["nneedsubsample"] = this.props.Login.masterData.nneedsubsample;
            Map["nisvisible"] = this.state.selectedRecordAdhocParameter && this.state.selectedRecordAdhocParameter.nvisibleadhocparameter === transactionStatus.YES ? transactionStatus.YES : transactionStatus.NO;
            Map["nclinicaltyperequired"] = this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nclinicaltyperequired
            let inputParam = {
                inputData: Map,
                action: 'createAdhocTestParamter',
                operation: "create",
                methodUrl: "AdhocTestParamter",
                classUrl: "resultentrybysample",
                selectedRecord: { ...this.state.selectedRecordAdhocParameter || {} }
            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.adhocId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true,
                        screenName: "IDS_ADHOCPARAMETER",
                        operation: "adhocTestParameter"
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.createAdhocTestParamter(inputParam);
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" }))
        }
    }
    onDropFile = (acceptedFile) => {
        this.props.Login.masterData.selectedImportFile['sfilename'] = acceptedFile

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { masterData: this.props.Login.masterData }
        }
        this.props.updateStore(updateInfo);
    }

    onFormulaInputChange = (event, index, fields) => {
        let selectedRecord = this.state.selectedRecord
        let selectedForumulaInput = this.state.selectedRecord.selectedForumulaInput || [];
        let selectedMandatory = this.state.selectedRecord.selectedMandatory || [];
        let dynamicformulafields = {};

        if (event) {
            if (fields.ndynamicformulafieldcode === FORMULAFIELDTYPE.INTEGER) {
                const value = event.target.value.replace(/[^-^0-9]/g, '');
                if (/^-?\d*?$/.test(value) || value === "") {
                    if (this.state.selectedRecord.formulainput) {
                        dynamicformulafields.svalues = value;
                        dynamicformulafields.sparameter = fields.sdescription;
                        selectedForumulaInput[index] = dynamicformulafields;
                        selectedMandatory[index] = event.target.value;
                    }
                }
                selectedRecord["selectedForumulaInput"] = selectedForumulaInput;
                selectedRecord["selectedMandatory"] = selectedMandatory;

                this.setState({ selectedRecord: selectedRecord });
            } else {
                const value = event.target.value.replace(/[^-^0-9.]/g, '');
                if (/^-?\d*?\.?\d*?$/.test(value) || value === "") {
                    if (this.state.selectedRecord.formulainput) {
                        dynamicformulafields.svalues = value;
                        dynamicformulafields.sparameter = fields.sdescription;
                        selectedForumulaInput[index] = dynamicformulafields;
                        selectedMandatory[index] = event.target.value;
                    }
                }
                selectedRecord["selectedForumulaInput"] = selectedForumulaInput;
                selectedRecord["selectedMandatory"] = selectedMandatory;

                this.setState({ selectedRecord: selectedRecord });
            }
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
    viewAdditionalInfo = (currentAlertResultCode) => {
        const selectedRecord = this.state.selectedRecord || [];
        let additionalInfo = selectedRecord['additionalInfo'];
        let showAlertGrid = this.props.Login.showAlertGrid;
        let additionalInfoView = this.props.Login.additionalInfoView
        if (additionalInfo[currentAlertResultCode]) {
            showAlertGrid = true;
            additionalInfoView = true;
            selectedRecord['additionalResultData'] = additionalInfo[currentAlertResultCode]
        }
        // this.setState({selectedRecord,additionalInfoView});
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { selectedRecord: selectedRecord, showAlertGrid, additionalInfoView }
        }
        this.props.updateStore(updateInfo);
    }
    onModalSave = () => {
        const selectedRecord = this.state.selectedRecord || [];
        let currentAlertResultCode = this.state.currentAlertResultCode || 0;
        let currentntestgrouptestpredefcode = this.state.currentntestgrouptestpredefcode || 0;
        let bool = this.state.selectedRecord.ResultParameter.some(x => x['ntransactionresultcode'] === currentAlertResultCode)
        if (bool) {
            this.state.selectedRecord.ResultParameter.map(Parameter => {
                if (Parameter['ntransactionresultcode'] === currentAlertResultCode) {
                    Parameter['additionalInfoUidata'] = { ntestgrouptestpredefsubcode: selectedRecord['ntestgrouptestpredefsubcode'] }
                    if (selectedRecord['ntestgrouptestpredefsubcode']) {
                        if (typeof selectedRecord['ntestgrouptestpredefsubcode'] === 'string') {
                            Parameter['additionalInfo'] = selectedRecord['ntestgrouptestpredefsubcode']
                        } else {
                            Parameter['additionalInfo'] = ""
                            // selectedRecord['ntestgrouptestpredefsubcode'].map(x=>{ 
                            //     Parameter['additionalInfo']+= x.label+","  
                            // }).join('\n')
                            Parameter['additionalInfo'] = selectedRecord['ntestgrouptestpredefsubcode'].map(x => x.label + ",").join('\n')
                            Parameter['additionalInfo'] = Parameter['additionalInfo'].substring(0,
                                Parameter['additionalInfo'].length - 1)
                        }
                    } else {
                        Parameter['additionalInfo'] = ""
                        Parameter['additionalInfoUidata'] && delete Parameter['additionalInfoUidata']
                    }
                    Parameter['ntestgrouptestpredefcode'] = currentntestgrouptestpredefcode
                }
            }
            );
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { selectedRecord: selectedRecord, showAlertGrid: false }
        }
        this.props.updateStore(updateInfo);
    }


    onskiprule = () => {
        const startDate = (this.props.Login.masterData.realFromDate || this.props.Login.masterData.fromDate || new Date());
        const endDate = (this.props.Login.masterData.realToDate || this.props.Login.masterData.toDate || new Date());

        // let obj = this.covertDatetoString(startDate, endDate)
        let obj = convertDateValuetoString(startDate, endDate, this.props.Login.userInfo);

        const fromDate = obj.fromDate;
        const toDate = obj.toDate;
        const completeResultId = this.state.controlMap.has("CompleteResult") && this.state.controlMap.get("CompleteResult").ncontrolcode;
        let testChildGetREParam = {
            masterData: this.props.Login.masterData,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            napprovalversioncode: this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode,
            ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
            ntestcode: this.props.Login.masterData.realTestcodeValue && this.props.Login.masterData.realTestcodeValue.ntestcode,
            npreregno: this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.map(sample => sample && sample.npreregno).join(","),
            ntransactionsamplecode: this.props.Login.masterData.RESelectedSubSample && this.props.Login.masterData.RESelectedSubSample.map(sample => sample && sample.ntransactionsamplecode).join(","),
            activeTestKey: this.props.Login.activeTestTab || 'IDS_RESULTS',
            fromdate: fromDate,
            todate: toDate,
            testskip: this.state.testskip,
            testtake: this.state.testtake,
            resultDataState: this.state.resultDataState,
            instrumentDataState: this.state.instrumentDataState,
            materialDataState: this.state.materialDataState,
            taskDataState: this.state.taskDataState,
            documentDataState: this.state.documentDataState,
            resultChangeDataState: this.state.resultChangeDataState,
            testCommentDataState: this.state.testCommentDataState,
            ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode,
            activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 1 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 1 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
            //activeTabIndex: this.state.enableAutoClick ? this.state.activeTabIndex : this.state.activeTabIndex ? this.state.activeTabIndex : 1,
            nworlistcode: (this.props.Login.masterData.realWorklistCodeValue && this.props.Login.masterData.realWorklistCodeValue.nworklistcode) || -1,
            nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1
        }

        this.completeActions(testChildGetREParam, this.props.Login.masterData.RESelectedTest, this.props.Login.userInfo, completeResultId, this.state.testskip, this.state.testtake, 4)
    }

    ontaskInputChange = (Data, name) => {
        const selectedRecordTaskForm = this.state.selectedRecordTaskForm || [];
        selectedRecordTaskForm[name] = Data.target.value;
        this.setState({ selectedRecordTaskForm: { ...selectedRecordTaskForm }, isTaskInitialRender: false });
    }
    ontaskNumericChange = (numericData, numericName) => {
        const selectedRecordTaskForm = this.state.selectedRecordTaskForm || [];
        if (numericData) {
            if (numericName !== "scomments") {
                selectedRecordTaskForm[numericName] = numericData;
            } else {
                selectedRecordTaskForm[numericName] = numericData.target.value;
            }
        }
        else {
            selectedRecordTaskForm[numericName] = "";
        }
        this.setState({ selectedRecordTaskForm: { ...selectedRecordTaskForm }, isTaskInitialRender: false });
    }
    onAdhocParameterInputChange = (Data, name) => {
        const selectedRecordAdhocParameter = { ...this.state.selectedRecordAdhocParameter } || [];
        selectedRecordAdhocParameter[name] = Data.target.checked === true ? transactionStatus.YES : transactionStatus.NO;;
        this.setState({ selectedRecordAdhocParameter: { ...selectedRecordAdhocParameter }, isAdhocParameterInitialRender: false });

    }
    onAdhocParameterComboChange = (comboData, comboName) => {
        const selectedRecordAdhocParameter = { ...this.state.selectedRecordAdhocParameter } || [];
        if (comboData) {
            selectedRecordAdhocParameter[comboName] = comboData;
        } else {
            selectedRecordAdhocParameter[comboName] = []
        }
        this.setState({ selectedRecordAdhocParameter: { ...selectedRecordAdhocParameter }, isAdhocParameterInitialRender: false });
    }



    onInputChange = (Data, name) => {
        const selectedRecord = this.state.selectedRecord || [];
        let currentAlertResultCode = this.state.currentAlertResultCode || 0;
        if (Data) {
            if (name === 'ntestgrouptestpredefsubcode') {
                // if(!selectedRecord['additionalInfo']){
                //     selectedRecord['additionalInfo']=[] 
                // } 
                // if(selectedRecord['additionalInfo']){
                //     selectedRecord['additionalInfo'][currentAlertResultCode]= Data.target.value
                // } 
                // let bool=this.state.selectedRecord.ResultParameter.some(x=>x['ntransactionresultcode']===currentAlertResultCode) 
                // if(bool){
                //   this.state.selectedRecord.ResultParameter.map(Parameter=>
                //       {
                //           if(Parameter['ntransactionresultcode']===currentAlertResultCode){
                //               Parameter["jsondata"]={};
                //               Parameter['additionalInfo']=selectedRecord['additionalInfo'][currentAlertResultCode]
                //             //   Parameter["jsondata"] = { 
                //             //       ...Parameter["jsondata"],
                //             //       additionalInfo:selectedRecord['additionalInfo'][currentAlertResultCode]
                //             //   }
                //           }
                //       }
                //       );  
                // }
                //  selectedRecord[name] = Data.target.value;
            }
            //else{
            selectedRecord[name] = Data.target.value;
            //  } 
        }
        else {
            selectedRecord[name] = [];
        }
        this.setState({ selectedRecord });
    }

    onNumericChange = (numericData, numericName) => {
        const selectedRecord = this.state.selectedRecord || [];
        if (numericData) {
            if (numericName !== "scomments") {
                selectedRecord[numericName] = numericData;
            } else {
                selectedRecord[numericName] = numericData.target.value;
            }
        }
        else {
            selectedRecord[numericName] = "";
        }
        this.setState({ selectedRecord });
    }

    onDateChange = (dateName, dateValue) => {
        const selectedRecord = this.state.selectedRecord || [];
        selectedRecord[dateName] = dateValue;
        if (dateName === "dfromdate" || dateName === "dtodate") {
            this.setState({ selectedRecord });
        }

    }

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        let meanTestParameterList = this.state.meanTestParameterList || [];
        let selectedMeanTestParam = this.state.selectedMeanTestParam || new Map();
        if (checked) {
            const data = meanTestParameterList.map(item => {
                item.selected = checked;
                selectedMeanTestParam.set(item.ntransactionresultcode, item.sresult);
                return item;
            });

            let selectedTestParam = "";
            let selectedTestParamMean = 0;
            let size = 0;
            if (selectedMeanTestParam.size > 0) {
                [...selectedMeanTestParam.values()].forEach(item => (
                    item !== null && item !== "" ?
                        (selectedTestParam = selectedTestParam === "" ? item : selectedTestParam + "+" + item,
                            size = size + 1,
                            selectedTestParamMean = parseInt(selectedTestParamMean) + parseInt(item)) : ""
                ));
                selectedTestParamMean = selectedTestParamMean / size;
            }

            this.setState({
                meanTestParameterList: data, selectedMeanTestParam, selectedTestParam,
                testMean: selectedTestParamMean,
                selectAll: checked
            });
        }
        else {
            const data = meanTestParameterList.map(item => {
                item.selected = checked;
                return item;
            });

            this.setState({
                meanTestParameterList: data, selectedMeanTestParam: new Map(),
                selectedTestParam: "",
                testMean: "",
                selectAll: checked
            });
        }
    }

    selectionChange = (event) => {
        let meanTestParameterList = this.state.meanTestParameterList || [];
        let selectedMeanTestParam = this.state.selectedMeanTestParam || new Map();
        meanTestParameterList.map(item => {
            if (item.ntransactionresultcode === event.dataItem.ntransactionresultcode) {
                item.selected = !event.dataItem.selected;
            }
            return item;
        });
        if (event.dataItem.selected) {
            selectedMeanTestParam.set(event.dataItem.ntransactionresultcode, event.dataItem.sresult);
        }
        else {
            if (selectedMeanTestParam.has(event.dataItem.ntransactionresultcode)) {
                selectedMeanTestParam.delete(event.dataItem.ntransactionresultcode)
            }
        }
        let selectedTestParam = "";
        let selectedTestParamMean = 0;
        let size = 0;
        if (selectedMeanTestParam.size > 0) {
            [...selectedMeanTestParam.values()].forEach(item => (
                item !== null && item !== "" ?
                    (selectedTestParam = selectedTestParam === "" ? item : selectedTestParam + "+" + item,
                        size = size + 1,
                        selectedTestParamMean = parseInt(selectedTestParamMean) + parseInt(item)) : ""
            ));
            selectedTestParamMean = selectedTestParamMean / size;
        }
        this.setState({
            meanTestParameterList, selectedMeanTestParam, selectedTestParam, testMean: selectedTestParamMean,
            selectAll: this.valiateCheckAll(meanTestParameterList)
        });
    }

    valiateCheckAll(data) {
        let selectAll = true;
        if (data && data.length > 0) {
            data.forEach(dataItem => {
                if (dataItem.selected) {
                    if (dataItem.selected === false) {
                        selectAll = false;
                    }
                }
                else {
                    selectAll = false;
                }
            })
        }
        else {
            selectAll = false;
        }
        return selectAll;
    }

    onMeanComboChange = (comboData, comboName) => {
        const selectedMeanTestParam = this.state.selectedMeanTestParam || [];
        selectedMeanTestParam[comboName] = comboData[0];
        let data = "";
        if (selectedMeanTestParam["parametervalue"] === undefined) {
            data = comboData[0].value;
        }
        else {
            data = selectedMeanTestParam["parametervalue"] + "+" + comboData[0].value;
        }
        selectedMeanTestParam["parametervalue"] = data;
        this.setState({ selectedMeanTestParam });
    }

    onMaterialComboChange = (comboData, comboName) => {
        const selectedRecord = this.state.selectedRecord || [];
        const ntestgrouptestcode = selectedRecord.ntestgroupmaterial == transactionStatus.YES ? this.props.Login.masterData.RESelectedTest[0].ntestgrouptestcode : -1;
        if (comboData) {
            selectedRecord[comboName] = comboData;
            //this.setState({ selectedRecord });
        } else {
            selectedRecord[comboName] = []
            //this.setState({ selectedRecord });
        }
        switch (comboName) {
            case 'nmaterialtypecode':
                this.props.getREMaterialCategoryByType({ ntestgrouptestcode, selectedRecord, userInfo: this.props.Login.userInfo })
                break;
            case 'nmaterialcatcode':
                selectedRecord['nsectioncode'] = selectedRecord.nmaterialcatcode.item.needSectionwise == transactionStatus.YES ?
                    this.props.Login.masterData.RESelectedTest[0].nsectioncode : -1;
                this.props.getREMaterialByCategory({ ntestgrouptestcode, selectedRecord, userInfo: this.props.Login.userInfo })
                break;
            case 'nmaterialcode':
                this.props.getREMaterialInvertoryByMaterial({ ntestgrouptestcode, selectedRecord, userInfo: this.props.Login.userInfo })
                break;
            default:
                this.props.getAvailableMaterialQuantity({ ntestgrouptestcode, selectedRecord, userInfo: this.props.Login.userInfo })
                break;
        }
    }

    onComboChange = (comboData, comboName) => {
        const selectedRecord = this.state.selectedRecord || [];
        let currentAlertResultCode = this.state.currentAlertResultCode || 0;
        if (comboData) {
            // if(comboName==='ntestgrouptestpredefsubcode'){

            //     if(!selectedRecord['additionalInfo']){
            //         selectedRecord['additionalInfo']=[] 
            //     }  
            //         selectedRecord['additionalInfo'][currentAlertResultCode]=""
            //         comboData.map(x=>{ 
            //             selectedRecord['additionalInfo'][currentAlertResultCode]+= x.label+","//+<br/> 
            //         })
            //         selectedRecord['additionalInfo'][currentAlertResultCode]=selectedRecord['additionalInfo'][currentAlertResultCode].substring(0,
            //             selectedRecord['additionalInfo'][currentAlertResultCode].length-1) 
            // } 
            selectedRecord[comboName] = comboData;
        } else {
            selectedRecord[comboName] = []
        }
        this.setState({ selectedRecord });

        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: { selectedRecord: selectedRecord }
        // }
        // this.props.updateStore(updateInfo);
    }



    onChange = (comboData, fieldName, caseNo) => {
        const selectedRecord = this.state.selectedRecord || {};
        const selectedsubcode = [];
        if (comboData !== null) {
            switch (caseNo) {

                case 1:
                    selectedRecord[fieldName] = comboData;
                    delete selectedRecord["ResultParameter"];

                    this.setState({ selectedsubcode })
                    this.props.resultEntryGetComponent(selectedRecord, this.props.Login.masterData, this.props.Login.userInfo, this.props.Login.ncontrolcode, this.state.testskip, this.state.testtake)
                    break;
                case 2:
                    selectedRecord[fieldName] = comboData;
                    delete selectedRecord["ResultParameter"];
                    this.setState({ selectedsubcode })
                    this.props.resultEntryGetParameter(selectedRecord, this.props.Login.masterData, this.props.Login.userInfo, this.props.Login.ncontrolcode, this.state.testskip, this.state.testtake)
                    break;
                default:
                    break;
            }
        }
        // else {
        //   if (selectedRecord["nsectioncode"]) {
        //     delete selectedRecord["nsectioncode"];
        //     delete selectedRecord["nusercode"];

        //   }
        //   const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: { selectedRecord,selectedsubcode:undefined }
        //   }
        //   this.props.updateStore(updateInfo);
        // }
    };

    onGradeEvent = (ResultParameter, index, parameter) => {
        if (ResultParameter.length > 0 && ResultParameter[index] !== undefined && ResultParameter[index].sresult !== null) {
            let selectedRecord = this.state.selectedRecord || [];
            let selectedResultGrade = this.state.selectedRecord.selectedResultGrade || [];
            if (parameter.nparametertypecode === parameterType.NUMERIC) {
                selectedResultGrade[index] = {
                    ngradecode: ResultParameter[index].sresult !== "" ?
                        numericGrade(parameter, numberConversion(parseFloat(ResultParameter[index].sresult), parseInt(parameter.nroundingdigits))) : -1
                };
            }
            if (parameter.nparametertypecode === parameterType.PREDEFINED) {
                if (ResultParameter[index].sresult !== null) {
                    selectedResultGrade[index] = { ngradecode: ResultParameter[index].ngradecode };
                }
                else {
                    selectedResultGrade[index] = { ngradecode: 0 };
                }
            }
            if (parameter.nparametertypecode === parameterType.CHARACTER) {
                if (ResultParameter[index].sresult !== null && ResultParameter[index].sresult.trim() !== "") {
                    //selectedResultGrade[index] = { ngradecode: ResultParameter[index].ngradecode };
                    selectedResultGrade[index] = { ngradecode: 4 };
                }
                else {
                    selectedResultGrade[index] = { ngradecode: -1 };
                }
            }
            //this.props.Login.masterData["selectedResultGrade"] = selectedResultGrade;
            selectedRecord.selectedResultGrade = selectedResultGrade;

            this.setState({
                selectedRecord
            });

            // const updateInfo = {
            //     typeName: DEFAULT_RETURN,
            //     data: { masterData: this.props.Login.masterData }
            // }
            // this.props.updateStore(updateInfo);
        }
    }

    onCommentsSaveClick = (saveType, formRef, selectedRecord) => {
        const masterData = this.props.Login.masterData;
        let inputData = {}
        let inputParam = {}
        inputData["userinfo"] = this.props.Login.userInfo;
        let { testskip, testtake } = this.state
        let testList = [...this.props.Login.masterData.RE_TEST];
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.RESelectedTest, "ntransactiontestcode");
        if (this.props.Login.screenName === "IDS_TESTCOMMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                isTestComment: this.props.isTestComment,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                ntransactiontestcode: this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest.map(x => x.ntransactiontestcode).join(",") : "-1"
            }
            inputParam = onSaveTestComments(saveParam, selectedTestList);
        }
        if (this.props.Login.screenName === "IDS_SUBSAMPLECOMMENTS") {
            let sampleList = [];
            if (this.props.Login.masterData.searchedSubSample !== undefined) {
                sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSubSample, this.props.Login.masterData.RE_SUBSAMPLE.slice(this.state.subSampleSkip, this.state.subSampleSkip + this.state.subSampleTake), "npreregno");
            } else {
                sampleList = this.props.Login.masterData.RE_SUBSAMPLE.slice(this.state.subSampleSkip, this.state.subSampleSkip + this.state.subSampleTake);
            }
            let acceptList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.RESelectedSubSample, "ntransactionsamplecode");
            // let acceptList=getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.RegistrationGetTest.slice(this.state.testskip, this.state.testskip + this.state.testtake), "npreregno");

            let saveParam = {
                userInfo: this.props.Login.userInfo,
                isTestComment: this.props.isTestComment,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                ntransactionsamplecode: this.props.Login.masterData.RESelectedSubSample ? this.props.Login.masterData.RESelectedSubSample.map(x => x.ntransactionsamplecode).join(",") : "-1"
            }
            inputParam = onSaveSubSampleComments(saveParam, acceptList);
        }

        if (this.props.Login.screenName === "IDS_SAMPLECOMMENTS") {
            let sampleList = [];
            if (this.props.Login.masterData.searchedSample !== undefined) {
                sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RE_SAMPLE.slice(this.state.skip, this.state.skip + this.state.take), "npreregno");
            } else {
                sampleList = this.props.Login.masterData.RE_SAMPLE.slice(this.state.skip, this.state.skip + this.state.take);
            }
            let acceptList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.RESelectedSample, "npreregno");
            // let acceptList=getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.RegistrationGetTest.slice(this.state.testskip, this.state.testskip + this.state.testtake), "npreregno");

            let saveParam = {
                userInfo: this.props.Login.userInfo,
                isTestComment: this.props.isTestComment,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                npreregno: this.props.Login.masterData.RESelectedSample ? this.props.Login.masterData.RESelectedSample.map(x => x.npreregno).join(",") : "-1"
            }
            inputParam = onSaveSampleComments(saveParam, acceptList);
        }



        if (this.props.Login.screenName === "IDS_SUBSAMPLECOMMENTS") {
            let sampleList = [];
            if (this.props.Login.masterData.searchedSubSample !== undefined) {
                sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSubSample, this.props.Login.masterData.RESelectedSubSample.slice(this.state.subsampleskip, this.state.subsampleskip + this.state.subsampletake), "npreregno");
            } else {
                sampleList = this.props.Login.masterData.RESelectedSubSample.slice(this.state.subsampleskip, this.state.subsampleskip + this.state.subSampleTake);
            }
            let acceptList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.RESelectedSubSample, "ntransactionsamplecode");
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                isTestComment: this.props.isTestComment,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                ntransactionsamplecode: this.props.Login.masterData.RESelectedSubSample ? this.props.Login.masterData.RESelectedSubSample.map(x => x.ntransactionsamplecode).join(",") : "-1"
            }
            inputParam = onSaveSubSampleComments(saveParam, acceptList);
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
        let { testskip, testtake, skip, take } = this.state
        let testList = [...this.props.Login.masterData.RE_TEST];
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.RESelectedTest, "ntransactiontestcode");
        let sampleList = [...this.props.Login.masterData.RE_SAMPLE];
        sampleList = sampleList.slice(skip, skip + take);
        let selectedSampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.RESelectedSample, "npreregno");
        if (this.props.Login.screenName === "IDS_SAMPLEATTACHMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                selectedMaster: this.props.selectedMaster,
                npreregno: this.props.Login.masterData.RESelectedSample ? this.props.Login.masterData.RESelectedSample.map(x => x.npreregno).join(",") : "-1"
            }
            inputParam = onSaveSampleAttachment(saveParam, selectedSampleList);
        } else if (this.props.Login.screenName === "IDS_TESTATTACHMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                ntransactiontestcode: this.props.Login.masterData.RESelectedTest ? this.props.Login.masterData.RESelectedTest.map(x => x.ntransactiontestcode).join(",") : "-1"
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
                ntransactionsamplecode: this.props.Login.masterData.RESelectedSubSample ? this.props.Login.masterData.RESelectedSubSample.map(x => x.ntransactionsamplecode).join(",") : "-1"
            }
            inputParam = onSaveSubSampleAttachment(saveParam, this.props.Login.masterData.RESelectedSubSample);
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

    onSampleAdd = (selectedsubcode) => {
        this.setState({
            selectedsubcode: [...selectedsubcode],
            isaddSampleRender: false
            // currentAlertResultCode,
            //  currentntestgrouptestpredefcode
        });
    }

    // onResultInputChange = (event, index, parameter) => {
    //     //let ResultParameter = this.props.Login.masterData.ResultParameter ? this.props.Login.masterData.ResultParameter : [];
    //     let selectedRecord = this.state.selectedRecord || [];
    //     let ResultParameter = this.state.selectedRecord.ResultParameter ? this.state.selectedRecord.ResultParameter : [];
    //     let sresult = "";
    //     let sfinal = "";
    //     let sresultpredefinedname= "";
    //     let salertmessage = "";
    //     let sresultcomment = "";
    //     let value = -1;
    //     let acceptedFile = [];
    //     let ncalculatedresult; 
    //     let currentAlertResultCode=0;
    //     let currentntestgrouptestpredefcode=0;
    //     let inputData={}
    //     if (parameter.nparametertypecode === parameterType.NUMERIC) {
    //         if (/^-?\d*?\.?\d*?$/.test(event.target.value) || event.target.value === "") {
    //             sresult = event.target.value;
    //             ncalculatedresult = 4
    //         } else {
    //             sresult = ResultParameter[index]['sresult'] === null ? "" : ResultParameter[index]['sresult'];
    //             ncalculatedresult = ResultParameter[index]['ncalculatedresult'];
    //         }
    //     }
    //     if (parameter.nparametertypecode === parameterType.PREDEFINED) {
    //          currentAlertResultCode= event.item.ntransactionresultcode ;
    //          currentntestgrouptestpredefcode= event.item.ntestgrouptestpredefcode ;
    //         if (event != null) {
    //             sresult = event.item.spredefinedname;
    //             sresultpredefinedname = event.item.sresultpredefinedname;
    //             sfinal=event.item.spredefinedsynonym
    //             value = event.item.ngradecode;
    //             salertmessage=event.item.salertmessage?event.item.salertmessage:"";
    //             sresultcomment= event.item.spredefinedcomments?event.item.spredefinedcomments:"";
    //             ncalculatedresult = 4; 
    //         }
    //         else {
    //             sresult = "";
    //             sfinal = "";
    //             sresultpredefinedname= "";
    //             value = -1;
    //             ncalculatedresult = 4
    //         }
    //         inputData={
    //             'ntestgrouptestpredefcode':event.item.ntestgrouptestpredefcode,
    //             'salertmessage':salertmessage,
    //             'nneedresultentryalert':event.item.nneedresultentryalert,
    //             'nneedsubcodedresult':event.item.nneedsubcodedresult
    //         }
    //         // ResultParameter[index]['additionalInfo']&& delete ResultParameter[index]['additionalInfo'] 
    //         // ResultParameter[index]['additionalInfo']&& delete ResultParameter[index]['additionalInfoUidata']  
    //         if(event.item.nneedresultentryalert===transactionStatus.NO&&
    //             event.item.nneedsubcodedresult===transactionStatus.NO){
    //                 if(ResultParameter[index]['additionalInfo']){ 
    //                     ResultParameter[index]['additionalInfo']="" 
    //                 } 
    //                 if(ResultParameter[index]['additionalInfoUidata']){  
    //                     ResultParameter[index]['additionalInfoUidata']="" 
    //                 } 
    //             }

    //     }
    //     if (parameter.nparametertypecode === parameterType.CHARACTER) {
    //         sresult = event.target.value;
    //         if (event.target.value.trim() === "")
    //             ncalculatedresult = -1;
    //         else
    //             ncalculatedresult = 4;
    //     }
    //     if (parameter.nparametertypecode === parameterType.ATTACHMENT) {
    //         sresult = event[0] && event[0].name;
    //         sfinal= event;
    //         ncalculatedresult = 4
    //     }
    //     ResultParameter[index]['sresult'] = sresult
    //     ResultParameter[index]['sfinal'] = sfinal
    //     ResultParameter[index]['sresultpredefinedname'] = sresultpredefinedname
    //     ResultParameter[index]['sresultcomment'] = sresultcomment
    //     ResultParameter[index]['salertmessage'] = salertmessage
    //     ResultParameter[index]['acceptedFile'] = acceptedFile
    //     ResultParameter[index]['editable'] = true
    //     ResultParameter[index]['ngradecode'] = value
    //     ResultParameter[index]['ncalculatedresult'] = ncalculatedresult 

    //     // this.props.Login.masterData.ResultParameter = ResultParameter;
    //     selectedRecord.ResultParameter = ResultParameter
    //     if (parameter.nparametertypecode === parameterType.PREDEFINED) {
    //         this.props.getPredefinedData(inputData,selectedRecord,currentAlertResultCode,this.props.Login.masterData) 
    //     }
    //     this.setState({
    //         selectedRecord: selectedRecord,
    //         currentAlertResultCode,
    //         currentntestgrouptestpredefcode
    //     });

    //     // const updateInfo = {
    //     //     typeName: DEFAULT_RETURN,
    //     //     data: { masterData: this.props.Login.masterData }
    //     // }
    //     // this.props.updateStore(updateInfo);
    // }

    updateTestMethodSource(inputData, masterData, ncontrolcode) {
        let inputParam = {

            inputData: { ...inputData, 'userinfo': this.props.Login.userInfo, ncontrolcode },
            // formData: formData,
            // isFileupload: true,
            operation: "createMethod",
            screenName: "IDS_TESTMETHODSOURCE",
            displayName: this.props.Login.inputParam.displayName,//, postParam,
            //inputData1: inputData,
            masterData: masterData
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true,
                    //screenName: "completeaction",
                    operation: "createMethod"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.updateTestMethodSource(inputData, masterData)
        }
    }



    updateParameterComments(inputData, masterData, ncontrolcode) {
        // let inputData1 = { ...inputData, ncontrolcode }
        const ndesigntemplatemappingcode = parseInt(this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode);
        inputData = { ...inputData, ndesigntemplatemappingcode: ndesigntemplatemappingcode }
        let inputParam = {
            inputData: { ...inputData, ncontrolcode, 'userinfo': this.props.Login.userInfo },
            operation: this.props.Login.operation,
            screenName: "IDS_RESULT",
            displayName: this.props.Login.inputParam.displayName,//, postParam,
            //inputData: inputData1,
            masterData: masterData
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true,
                    //screenName: "completeaction",
                    operation: "updateParameterComments"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.updateParameterComments(inputData, masterData)
        }
    }

    onSaveMean = (saveType) => {
        const nregtypecode = parseInt(this.props.Login.masterData.realRegTypeValue.nregtypecode);
        const nregsubtypecode = parseInt(this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode);

        let resultParameter = this.props.Login.selectedTestParameterMean || {};
        //let resultParameter = { };

        resultParameter["ncalculatedresult"] = 4;
        resultParameter["sresult"] = this.state.testMean;
        resultParameter["sfinal"] = numberConversion(parseFloat(this.state.testMean), parseInt(resultParameter.nroundingdigit));

        resultParameter["ngradecode"] = numericGrade(resultParameter, parseInt(this.state.testMean));
        resultParameter['nenteredrole'] = this.props.Login.userInfo.nuserrole;
        resultParameter['nenteredby'] = this.props.Login.userInfo.nusercode;
        // resultParameter['ntransactionresultcode'] = meanParameter.ntransactionresultcode;
        // resultParameter['ntransactiontestcode'] = meanParameter.ntransactiontestcode;
        // resultParameter['nparametertypecode'] = meanParameter.nparametertypecode;
        //console.log("result:", resultParameter);

        const formData = new FormData();
        formData.append("filecount", 0);
        formData.append("nregtypecode", nregtypecode);
        formData.append("nregsubtypecode", nregsubtypecode);
        formData.append("ncontrolcode", this.props.Login.ncontrolcode);
        formData.append("transactiontestcode", resultParameter.ntransactiontestcode);
        //formData.append("resultData", JSON.stringify([resultParameter]));
        formData.append("resultData", resultParameter);

        const inputParam = {
            classUrl: "resultentrybysample",
            methodUrl: "TestParameterResult",
            inputData: { userinfo: this.props.Login.userInfo },
            formData: formData,
            isFileupload: true,
            operation: "update",
            displayName: this.props.Login.inputParam.displayName, saveType
        }

        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }
    editpredefinedcomments = (dataItem) => {

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                screenName: "IDS_RESULTPARAMETERCOMMENTS",
                openModal: true,
                selectedRecord: { 'sresultcomment': dataItem['sresultcomment'], 'selectedPredefinedComments': dataItem },
                operation: "update"
            }
        }
        this.props.updateStore(updateInfo);
    }
    enforceResult = (dataItem) => {
        let inputParam = {}
        inputParam = {
            dataItem: dataItem,
            masterData: this.props.Login.masterData,
            screenName: "IDS_ENFORCERESULT",
            openModal: true,
            operation: "update",
            ncontrolcode: dataItem['ncontrolcode'],
            nneedReceivedInLab:parseInt(this.props.Login.settings && this.props.Login.settings['43'])

        }
        this.props.enforceResult(inputParam, this.props.Login.userInfo);
    }
    onSavePredefinedComments = (saveType) => {
        let inputParam = {}
        let stransactiontestcode = "";
        this.props.Login.masterData.RESelectedTest.map(x => {
            stransactiontestcode += x['ntransactiontestcode'] + ","
        }
        )
        let inputData = {
            'selectedPredefinedComments': this.state.selectedRecord['selectedPredefinedComments'],
            'ntransactionresultcode': this.state.selectedRecord['selectedPredefinedComments']['ntransactionresultcode']
            ,
            'sresultcomment': this.state.selectedRecord['sresultcomment'],
            'ntransactiontestcode': stransactiontestcode.substring(0, stransactiontestcode.length - 1),//this.state.selectedRecord['selectedPredefinedComments']['ntransactiontestcode'],
            'userinfo': this.props.Login.userInfo
        }
        inputParam = {
            classUrl: 'resultentrybysample',
            methodUrl: "PredefinedComments",
            inputData: inputData,
            //    isFileupload: false,
            //  activeTestKey: "IDS_INSTRUMENT",
            operation: this.props.Login.operation,
            displayName: this.props.Login.inputParam.displayName, saveType//postParam
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    //ALPD-4156--Vignesh R(15-05-2024)-->Result Entry - Option to change section for the test(s)	
    onSaveSection(saveType) {
        let inputParam = {};
        let resultEntryData = {};
        let testList = [];

        let { testskip, testtake, sampleskip, sampletake } = this.state
        if (this.props.Login.masterData.searchedTest !== undefined) {
            testList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.searchedTest.slice(testskip, testskip + testtake), "ntransactiontestcode");
        } else {
            testList = this.props.Login.masterData.RE_TEST
                && this.props.Login.masterData.RE_TEST.slice(testskip, testskip + testtake);
        }
        let subSampleList = [];
        if (this.props.Login.masterData.searchedSubSample !== undefined) {
            subSampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSubSample, this.props.Login.masterData.searchedSubSample.slice(testskip, testskip + testtake), "ntransactionsamplecode");
        } else {
            subSampleList = this.props.Login.masterData.RE_SUBSAMPLE
                && this.props.Login.masterData.RE_SUBSAMPLE.slice(testskip, testskip + testtake);
        }
        let sampleList = [];
        if (this.props.Login.masterData.searchedSample !== undefined) {
            sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.searchedSample.slice(sampleskip, sampleskip + sampletake), "npreregno");
        } else {
            sampleList = this.props.Login.masterData.RE_SAMPLE
                && this.props.Login.masterData.RE_SAMPLE.slice(sampleskip, sampleskip + sampletake);
        }
        //
        let sectionList = getSameRecordFromTwoArrays(testList || [], this.props.Login.masterData.RESelectedTest, "ntransactiontestcode");
        let sampleListCount = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.RESelectedSample, "npreregno");

        resultEntryData["npreregno"] = sectionList ? sectionList.map(sample => sample.npreregno).join(",") : "";
        resultEntryData["ntransactionsamplecode"] = sectionList ? sectionList.map(sample => sample.ntransactionsamplecode).join(",") : "";
        resultEntryData["ntransactiontestcode"] = sectionList ? sectionList.map(sample => sample.ntransactiontestcode).join(",") : "";
        resultEntryData["nneedsubsample"] = (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false;

        resultEntryData["nsectioncode"] = this.state.selectedRecord && this.state.selectedRecord["nsectioncode"].value;
        resultEntryData["nneedsubsample"] = (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false;
        if (!(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample)) {
            resultEntryData["ntansactionSubSamplecode"] = subSampleList ? subSampleList.map(sample => sample.ntransactionsamplecode).join(",") : "";
        }


        resultEntryData["userinfo"] = this.props.Login.userInfo;
        resultEntryData["ndesigntemplatemappingcode"] = this.props.Login.masterData.realDesignTemplateMapping.ndesigntemplatemappingcode;
        resultEntryData["nregtypecode"] = this.props.Login.masterData.realRegTypeValue.nregtypecode;
        resultEntryData["nregsubtypecode"] = this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode;
        resultEntryData["ntestcode"] = this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode === 0 ? this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.realTestValue.ntestcode) : null;
        resultEntryData["masterData"] = this.props.Login.masterData;
        resultEntryData["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
        resultEntryData["activeTestTab"] = this.props.Login.activeTestTab || 'IDS_TESTATTACHMENTS';
        resultEntryData["nsampletypecode"] = this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode;
        resultEntryData["napprovalversioncode"] = this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode;

        // joballocationData["sfilterSection"] = this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode.toString() : "-1";
        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        resultEntryData["fromdate"] = obj.fromDate;
        resultEntryData["todate"] = obj.toDate;
        resultEntryData["activeSampleTab"] = this.props.Login.activeTestTab || "IDS_SAMPLEATTACHMENTS";
        resultEntryData["nregistrationsectioncode"] = this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.map(item1 => item1.nregistrationsectioncode).join(",");
        resultEntryData["ncontrolcode"] = this.props.Login.ncontrolcode;
        resultEntryData["nbatchmastercode"] = (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1;
        resultEntryData["nworlistcode"] = (this.props.Login.masterData.realWorklistCodeValue && this.props.Login.masterData.realWorklistCodeValue.nworklistcode) || -1;
        resultEntryData["nneedjoballocation"] = this.props.Login.masterData.realRegSubTypeValue.nneedjoballocation;
        resultEntryData["nneedReceivedInLab"] = parseInt(this.props.Login.settings && this.props.Login.settings['43'])
        inputParam = {
            classUrl: "resultentrybysample",
            methodUrl: "Test",
            displayName: this.props.Login.inputParam.displayName,
            inputData: resultEntryData,
            //selectedId: this.state.selectedRecord["njoballocationcode"],
            operation: "updateSection",
            saveType,
            searchRef: this.searchRef,
            postParamList: this.postParamList,
            action: "updateSection",
            selectedRecord: this.state.selectedRecord,
            RESelectedTest: this.props.Login.masterData.RESelectedTest

        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: "IDS_SECTION",
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.updateSectionTest(inputParam);

        }
    }

    onSaveEnforceResult = (saveType) => {
        let inputParam = {}
        let stransactiontestcode = "";
        const nregtypecode = parseInt(this.props.Login.masterData.realRegTypeValue.nregtypecode);
        const nregsubtypecode = parseInt(this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode);
        const ndesigntemplatemappingcode = parseInt(this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode);

        // this.props.Login.masterData.RESelectedTest.map(x=>{ 
        //     stransactiontestcode+=x['ntransactiontestcode']+","
        // }
        //   )
        let inputData = {
            'ResultParameter': {
                //  ngradecode:this.state.selectedRecord['ngradecode'].value,
                nparametertypecode: parameterType.CHARACTER,
                sfinal: this.state.selectedRecord['senforceresult'],
                senforceresultcomment: this.state.selectedRecord['senforceresultcomment'],
                ntransactiontestcode: this.state.selectedRecord['ntransactiontestcode'],
                ntransactionresultcode: this.state.selectedRecord['ntransactionresultcode']
            },
            'ntransactionresultcode': this.state.selectedRecord['ntransactionresultcode'],
            "nregtypecode": nregtypecode,
            "nregsubtypecode": nregsubtypecode,
            "ndesigntemplatemappingcode": ndesigntemplatemappingcode,
            'userinfo': this.props.Login.userInfo,
            'nneedReceivedInLab': parseInt(this.props.Login.settings && this.props.Login.settings['43'])
        }
        inputParam = {
            classUrl: 'resultentrybysample',
            methodUrl: "EnforceResult",
            inputData: inputData,
            operation: this.props.Login.operation,
            displayName: this.props.Login.inputParam.displayName, saveType//postParam
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }
    // callbackToParent=(childData)=>{
    //     console.log('childData',childData)
    //     this.setState({childData})
    // }
    onSaveClick = (saveType, data) => {
        if (this.props.Login.screenName === "IDS_MEANPARAMETER") {
            this.onSaveMean(saveType);
        } else if (this.props.Login.screenName === "IDS_RESULTPARAMETERCOMMENTS") {
            this.onSavePredefinedComments(saveType);
        }
        else if (this.props.Login.screenName === "IDS_ENFORCERESULT") {
            this.onSaveEnforceResult(saveType);
        } else if (this.props.Login.screenName === "IDS_RESULTENTRYCOMPLETE") {

            const startDate = (this.props.Login.masterData.realFromDate || this.props.Login.masterData.fromDate || new Date());
            const endDate = (this.props.Login.masterData.realToDate || this.props.Login.masterData.toDate || new Date());

            let obj = convertDateValuetoString(startDate, endDate, this.props.Login.userInfo);

            const fromDate = obj.fromDate;
            const toDate = obj.toDate;
            const completeResultId = this.state.controlMap.has("CompleteResult") && this.state.controlMap.get("CompleteResult").ncontrolcode;
            let testChildGetREParam = {
                masterData: this.props.Login.masterData,
                userinfo: this.props.Login.userInfo,
                nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                napprovalversioncode: this.props.Login.masterData.realApproveConfigVersion && this.props.Login.masterData.realApproveConfigVersion.napprovalconfigversioncode,
                ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
                ntestcode: this.props.Login.masterData.realTestcodeValue && this.props.Login.masterData.realTestcodeValue.ntestcode,
                npreregno: this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.map(sample => sample && sample.npreregno).join(","),
                ntransactionsamplecode: this.props.Login.masterData.RESelectedSubSample && this.props.Login.masterData.RESelectedSubSample.map(sample => sample && sample.ntransactionsamplecode).join(","),
                activeTestKey: this.props.Login.activeTestTab || 'IDS_RESULTS',
                fromdate: fromDate,
                todate: toDate,
                testskip: this.state.testskip,
                testtake: this.state.testtake,
                resultDataState: this.state.resultDataState,
                instrumentDataState: this.state.instrumentDataState,
                materialDataState: this.state.materialDataState,
                taskDataState: this.state.taskDataState,
                documentDataState: this.state.documentDataState,
                resultChangeDataState: this.state.resultChangeDataState,
                testCommentDataState: this.state.testCommentDataState,
                ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode,
                activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 1 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 1 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
                nworlistcode: (this.props.Login.masterData.realWorklistCodeValue && this.props.Login.masterData.realWorklistCodeValue.nworklistcode) || -1,
                nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1
            }

            this.completeActions(testChildGetREParam, this.props.Login.masterData.RESelectedTest, this.props.Login.userInfo, completeResultId, this.state.testskip, this.state.testtake, 3)
        }
        else if (this.props.Login.screenName === "IDS_SECTION") {
            this.onSaveSection(saveType)


        }
        else {
            let ResultParameter = this.state.parameterResults//this.props.Login.parameterResults

            //let ResultParameter = this.state.selectedRecord.ResultParameter || [];
            //    let ResultParameter = this.props.Login.parameterResults || [];
            // let ResultParameter = saveType.parameterResults || [];
            let selectedRecord = this.state.selectedRecord || {};
            let selectedRecordMaterialForm = this.state.selectedRecordMaterialForm || {};
            let selectedRecordInstrumentForm = this.state.selectedRecordInstrumentForm || {};
            let selectedRecordTaskForm = this.state.selectedRecordTaskForm || {};
            let selectedId = this.props.Login.selectedId || null;
            let additionalInfo = this.state.selectedRecord.additionalInfo || [];
            const nregtypecode = parseInt(this.props.Login.masterData.realRegTypeValue.nregtypecode);
            const nregsubtypecode = parseInt(this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode);
            const ndesigntemplatemappingcode = parseInt(this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode);
            const nneedReceivedInLab = parseInt(this.props.Login.settings && this.props.Login.settings['43']);
            const nneedSubSample = this.props.Login.masterData.nneedsubsample && this.props.Login.masterData.nneedsubsample;
            const classUrl = "resultentrybysample";
            const formData = new FormData();
            let neditable = 0;
            let resultParameters = [];
            let inputParam = {};
            let inputData = [];
            let i = 0;
            let j = 0;
            //const postParam = {inputListName: "RESelectedTest", selectedObject: "RESelectedTest", primaryKeyField: "ntransactionstestcode" };
            if (this.props.Login.screenName === "IDS_RESULTENTRY") {
                if (ResultParameter.length > 0 && ResultParameter !== undefined) {
                    //  ALPD-5781   Added stopExecution and alertValue by Vishakh
                    let stopExecution = false;
                    let alertValue = "";        
                    ResultParameter.map((resultData, index) => {
                        let results = {};
                        if (resultData.editable === true) {
                            neditable = 1;
                            switch (resultData.nparametertypecode) {
                                case 1:
                                    results["jsondata"] = {
                                        ncalculatedresult: resultData["ncalculatedresult"],
                                        sresult: resultData.sresult,
                                        sfinal: resultData.sresult !== "" ? resultData.sresult.includes('e') ? resultData.sresult : numberConversion(parseFloat(resultData.sresult), parseInt(resultData.nroundingdigits)) :"",
                                        ngradecode: resultData.sresult !== "" ? numericGrade(resultData, results["sfinal"]) : -1,
                                        nresultaccuracycode: resultData.resultaccuracycode ? resultData.resultaccuracycode.value : -1,
                                        sresultaccuracyname: resultData.resultaccuracycode ? resultData.resultaccuracycode.label : "",
                                        nunitcode: resultData.unitcode.value,
                                        sunitname: resultData.unitcode.label
                                    }
                                    results["jsonstring"] = JSON.stringify(results["jsondata"]);
                                    results["ncalculatedresult"] = resultData["ncalculatedresult"];
                                    results["sresult"] = resultData.sresult;
                                    results["sfinal"]  = resultData.sresult !== "" ? resultData.sresult.includes('e') ? resultData.sresult : numberConversion(parseFloat(resultData.sresult), parseInt(resultData.nroundingdigits)) :"";
                                    //  ALPD-5781   Added validation by Vishakh
                                    if(results["sfinal"] === "NaN" && stopExecution === false){
                                        alertValue = this.props.intl.formatMessage({ id: "IDS_WRONGVALUEENTEREDFOR"})+ " "
                                            + (nneedSubSample ? resultData.ssamplearno : resultData.sarno) + " / "+ resultData.stestsynonym+ " / "+ resultData.sparametersynonym;
                                        stopExecution = true;
                                        return;
                                    } 
                                    results["ngradecode"] = resultData.sresult !== "" ?
                                        numericGrade(resultData, results["sfinal"]) : -1;
                                    results["nunitcode"] = resultData.unitcode.value;
                                    results['nenteredrole'] = this.props.Login.userInfo.nuserrole;
                                    results['nenteredby'] = this.props.Login.userInfo.nusercode;
                                    results['ntransactionresultcode'] = resultData.ntransactionresultcode;
                                    results['ntransactiontestcode'] = resultData.ntransactiontestcode;
                                    results['nparametertypecode'] = resultData.nparametertypecode;
                                    break;
                                case 2:
                                    if (resultData['additionalInfoUidata'] !== undefined && resultData['additionalInfoUidata'] !== null
                                        && resultData['additionalInfoUidata'].hasOwnProperty('ntestgrouptestpredefsubcode')) {
                                        if (typeof resultData['additionalInfoUidata']['ntestgrouptestpredefsubcode'] === 'string') {
                                            resultData['additionalInfoUidata']['ntestgrouptestpredefsubcode'] = Lims_JSON_stringify(resultData['additionalInfoUidata']['ntestgrouptestpredefsubcode'], false);
                                        } else {
                                            resultData['additionalInfoUidata']['ntestgrouptestpredefsubcode'].length > 0 &&
                                                resultData['additionalInfoUidata']['ntestgrouptestpredefsubcode'].map(item => {
                                                    item['label'] = Lims_JSON_stringify(item['label'], false);
                                                    item['item']['ssubcodedresult'] = Lims_JSON_stringify(item['item']['ssubcodedresult'], false);
                                                })
                                        }
                                    }
                                    results["jsondata"] = {
                                        ncalculatedresult: 4,
                                        sresult: Lims_JSON_stringify(replaceBackSlash(resultData.sresult)),
                                        sfinal: Lims_JSON_stringify(replaceBackSlash(resultData.sfinal)),
                                        sresultcomment: resultData.sresultcomment === 'null' ? "-" : Lims_JSON_stringify(resultData.sresultcomment),
                                        salertmessage: Lims_JSON_stringify(resultData.salertmessage, false),
                                        additionalInfo: resultData['additionalInfo'] !== null ? Lims_JSON_stringify(resultData['additionalInfo'], false) : resultData['additionalInfo'],
                                        additionalInfoUidata: resultData['additionalInfoUidata'] === undefined ? "" : resultData['additionalInfoUidata'],
                                        ntestgrouptestpredefcode: resultData.ntestgrouptestpredefcode
                                    }
                                    results["jsonstring"] = JSON.stringify(results["jsondata"]);


                                    results["sresult"] = resultData.sresult;

                                    results["ncalculatedresult"] = 4;
                                    results["sfinal"] = resultData.sresult;
                                    results["ngradecode"] = resultData.ngradecode;
                                    results["nunitcode"] = -1;
                                    results['nenteredrole'] = this.props.Login.userInfo.nuserrole;
                                    results['nenteredby'] = this.props.Login.userInfo.nusercode;
                                    results['ntransactionresultcode'] = resultData.ntransactionresultcode;
                                    results['ntransactiontestcode'] = resultData.ntransactiontestcode;
                                    results['nparametertypecode'] = resultData.nparametertypecode;
                                    break;
                                case 3:
                                    results["jsondata"] = {
                                        ncalculatedresult: 4,
                                        sresult: Lims_JSON_stringify(replaceBackSlash(resultData.sresult)),
                                        sfinal: Lims_JSON_stringify(replaceBackSlash(resultData.sresult))
                                    }
                                    results["jsonstring"] = JSON.stringify(results["jsondata"]);
                                    results["sresult"] = resultData.sresult;
                                    results["ncalculatedresult"] = 4;
                                    results["sfinal"] = resultData.sresult;
                                    results["ngradecode"] = resultData.sresult.trim() === "" ? -1 : ResultEntryGrade.RESULTSTATUS_FIO;
                                    results["nunitcode"] = -1;
                                    results['nenteredrole'] = this.props.Login.userInfo.nuserrole;
                                    results['nenteredby'] = this.props.Login.userInfo.nusercode;
                                    results['ntransactionresultcode'] = resultData.ntransactionresultcode;
                                    results['ntransactiontestcode'] = resultData.ntransactiontestcode;
                                    results['nparametertypecode'] = resultData.nparametertypecode;
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
                                        results["ngradecode"] = resultData.sresult.trim() === "" ? -1 : ResultEntryGrade.RESULTSTATUS_FIO;
                                        results["nunitcode"] = -1;
                                        results["nenteredrole"] = this.props.Login.userInfo.nuserrole;
                                        results["nenteredby"] = this.props.Login.userInfo.nusercode;
                                        results["ntransactionresultcode"] = resultData.ntransactionresultcode;
                                        results["ntransactiontestcode"] = resultData.ntransactiontestcode;
                                        results['nparametertypecode'] = resultData.nparametertypecode;
                                        results["ssystemfilename"] = uniquefilename;
                                        results["nfilesize"] = resultData.sfinal[0] && resultData.sfinal[0].size;
                                        formData.append("uploadedFile" + j, resultData.sfinal[0] && resultData.sfinal[0]);
                                        formData.append("uniquefilename" + j, uniquefilename);
                                        formData.append("ntransactiontestcode", resultData.ntransactiontestcode);
                                        i++;
                                        j++;
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
                                        results["nunitcode"] = -1;  // ALPD-5443    Added nunitcode by Vishakh for Result entry attachment issue
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
                                resultParameters.push(results);
                            }                            
                        }
                        return null;
                    }
                );
                //  ALPD-5781   Added toast alert by Vishakh
                if(stopExecution){
                    return toast.warn(alertValue);
                }

                    if (neditable === 0) {
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: { loading: false, openModal: false, parameterResults: [], selectedRecord: {} }
                        }
                        return this.props.updateStore(updateInfo);
                    }

                    formData.append("filecount", i);
                    formData.append("nregtypecode", nregtypecode);
                    formData.append("nregsubtypecode", nregsubtypecode);
                    formData.append("ncontrolcode", this.props.Login.ncontrolcode);
                    formData.append("ndesigntemplatemappingcode", ndesigntemplatemappingcode);
                    formData.append("nneedReceivedInLab",nneedReceivedInLab);

                    formData.append("resultData", JSON.stringify(resultParameters));
                    const tests = this.props.Login.masterData.RESelectedTest ?
                        this.props.Login.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : ""
                    formData.append("transactiontestcode", tests);
                    //let postParam = {inputListName: "RE_TEST", selectedObject: "", primaryKeyField: "ntransactionresultcode" };
                    inputParam = {
                        classUrl: classUrl,
                        methodUrl: "TestParameterResult",
                        inputData: { userinfo: this.props.Login.userInfo },
                        formData: formData,
                        isFileupload: true,
                        operation: "update",
                        displayName: this.props.Login.inputParam.displayName, saveType//, postParam
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




            if (this.props.Login.screenName === "IDS_RESULTENTRYPARAMETER") {
                if (this.state.selectedsubcode && this.state.selectedsubcode.length > 0 && this.state.selectedsubcode !== undefined) {
                    if (ResultParameter.length > 0 && ResultParameter !== undefined) {
                        //  ALPD-5781   Added stopExecution and alertValue by Vishakh
                        let stopExecution = false;
                        let alertValue = "";            
                        ResultParameter.map((resultData, index) => {
                            let results = {};
                            if (resultData.editable === true) {
                                neditable = 1;
                                switch (resultData.nparametertypecode) {
                                    case 1:
                                        results["jsondata"] = {
                                            ncalculatedresult: resultData["ncalculatedresult"],
                                            sresult: resultData.sresult,
                                            sfinal: resultData.sresult !== "" ? numberConversion(parseFloat(resultData.sresult), parseInt(resultData.nroundingdigits)) : ""
                                        }
                                        results["jsonstring"] = JSON.stringify(results["jsondata"]);
                                        results["ncalculatedresult"] = resultData["ncalculatedresult"];
                                        results["sresult"] = resultData.sresult;
                                        results["sfinal"] = resultData.sresult !== "" ?
                                            numberConversion(parseFloat(resultData.sresult), parseInt(resultData.nroundingdigits)) : "";
                                        //  ALPD-5781   Added validation by Vishakh
                                        if(results["sfinal"] === "NaN" && stopExecution === false){
                                            alertValue = this.props.intl.formatMessage({ id: "IDS_WRONGVALUEENTEREDFOR"})+ " "
                                                + (nneedSubSample ? resultData.ssamplearno : resultData.sarno)+ " / "+ resultData.stestsynonym+ " / "+ resultData.sparametersynonym;
                                            stopExecution = true;
                                            return;
                                        }
                                        results["ngradecode"] = resultData.sresult !== "" ?
                                            numericGrade(resultData, results["sfinal"]) : -1;
                                        results['nenteredrole'] = this.props.Login.userInfo.nuserrole;
                                        results['nenteredby'] = this.props.Login.userInfo.nusercode;
                                        //results['ntransactionresultcode'] = resultData.ntransactionresultcode;
                                        //results['ntransactiontestcode'] = resultData.ntransactiontestcode;
                                        results['nparametertypecode'] = resultData.nparametertypecode;
                                        results['ntestgrouptestparametercode'] = resultData.ntestgrouptestparametercode;
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
                                        //results['ntransactionresultcode'] = resultData.ntransactionresultcode;
                                        //results['ntransactiontestcode'] = resultData.ntransactiontestcode;
                                        results['nparametertypecode'] = resultData.nparametertypecode;
                                        results['ntestgrouptestparametercode'] = resultData.ntestgrouptestparametercode;
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
                                        results["ngradecode"] = resultData.sresult.trim() === "" ? -1 : ResultEntryGrade.RESULTSTATUS_FIO;
                                        results['nenteredrole'] = this.props.Login.userInfo.nuserrole;
                                        results['nenteredby'] = this.props.Login.userInfo.nusercode;
                                        //results['ntransactionresultcode'] = resultData.ntransactionresultcode;
                                        //results['ntransactiontestcode'] = resultData.ntransactiontestcode;
                                        results['nparametertypecode'] = resultData.nparametertypecode;
                                        results['ntestgrouptestparametercode'] = resultData.ntestgrouptestparametercode;
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
                                            results["ngradecode"] = resultData.sresult.trim() === "" ? -1 : ResultEntryGrade.RESULTSTATUS_FIO;
                                            results["nenteredrole"] = this.props.Login.userInfo.nuserrole;
                                            results["nenteredby"] = this.props.Login.userInfo.nusercode;
                                            //results["ntransactionresultcode"] = resultData.ntransactionresultcode;
                                            //results["ntransactiontestcode"] = resultData.ntransactiontestcode;
                                            results['ntestgrouptestparametercode'] = resultData.ntestgrouptestparametercode;
                                            results['nparametertypecode'] = resultData.nparametertypecode;
                                            results["ssystemfilename"] = uniquefilename;
                                            results["nfilesize"] = resultData.sfinal[0] && resultData.sfinal[0].size;
                                            formData.append("uploadedFile" + index, resultData.sfinal[0] && resultData.sfinal[0]);
                                            formData.append("uniquefilename" + index, uniquefilename);
                                            //formData.append("ntransactiontestcode", resultData.ntransactiontestcode);
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
                                            //results["ntransactionresultcode"] = resultData.ntransactionresultcode;
                                            //results["ntransactiontestcode"] = resultData.ntransactiontestcode;
                                            results['nparametertypecode'] = resultData.nparametertypecode;
                                            results['ntestgrouptestparametercode'] = resultData.ntestgrouptestparametercode;
                                            results["ssystemfilename"] = "";
                                            results["nfilesize"] = "";
                                            formData.append("uploadedFile" + index, "");
                                            formData.append("uniquefilename" + index, "");
                                            //formData.append("ntransactiontestcode", "");
                                        }
                                        break;
                                    default:
                                        break;
                                }
                                if (Object.values(results).length > 0) {
                                    resultParameters.push(results);
                                }
                            }
                            return null;
                        });
                        //  ALPD-5781   Added toast alert by Vishakh
                        if(stopExecution){
                            return toast.warn(alertValue);
                        }
                        if (neditable === 0) {
                            const updateInfo = {
                                typeName: DEFAULT_RETURN,
                                data: { loading: false, openModal: false, parameterResults: [], selectedRecord: {} }
                            }
                            return this.props.updateStore(updateInfo);
                        }

                        formData.append("filecount", i);
                        formData.append("nregtypecode", nregtypecode);
                        formData.append("nregsubtypecode", nregsubtypecode);
                        formData.append("ncontrolcode", this.props.Login.ncontrolcode);
                        formData.append("ndesigntemplatemappingcode", ndesigntemplatemappingcode);
                        formData.append("nneedReceivedInLab", nneedReceivedInLab);  // ALPD-5683    Added nneedReceivedInLab to avoid error in backend by Vishakh (09-04-2025)

                        formData.append("resultData", JSON.stringify(resultParameters));
                        const tests = this.props.Login.masterData.RESelectedTest ?
                            this.props.Login.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : ""
                        const sampleid = this.state.selectedsubcode ?
                            this.state.selectedsubcode.map(test => test.ssampleid).join("','") : ""

                        formData.append("transactiontestcode", tests);
                        formData.append("sampleid", sampleid);
                        formData.append("ntestcode", this.props.Login.masterData.realTestcodeValue && this.props.Login.masterData.realTestcodeValue.ntestcode)
                        formData.append("nallottedspeccode", this.state.selectedRecord.nallottedspeccode.value);
                        formData.append("nspecsampletypecode", this.state.selectedRecord.ncomponentcode.value);
                        //let postParam = {inputListName: "RE_TEST", selectedObject: "", primaryKeyField: "ntransactionresultcode" };
                        inputParam = {
                            classUrl: classUrl,
                            methodUrl: "MultiSampleTestParameterResult",
                            inputData: { userinfo: this.props.Login.userInfo },
                            formData: formData,
                            isFileupload: true,
                            operation: "update",
                            displayName: this.props.Login.inputParam.displayName, saveType//, postParam
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
                else {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { loading: false }
                    }

                    toast.warn(this.props.intl.formatMessage({ id: "IDS_ADDSAMPLE" }));
                    return this.props.updateStore(updateInfo);
                }
            }


            if (this.props.Login.screenName === "IDS_TESTMETHODSOURCE") {
                inputData = {
                    ntype: 3,
                    nflag: 3,
                    nsampletypecode: this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.realRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                    ntranscode: this.props.Login.masterData.realFilterStatusValue.ntransactionstatus.toString(),
                    ntestcode: this.props.Login.masterData.realTestcodeValue.ntestcode,
                    npreregno: this.props.Login.masterData.RESelectedSample && this.props.Login.masterData.RESelectedSample.map(sample => sample.npreregno).join(","),
                    ntransactionsamplecode: this.props.Login.masterData.RESelectedSubSample && this.props.Login.masterData.RESelectedSubSample.map(sample => sample.ntransactionsamplecode).join(","),
                    nmethodcode: selectedRecord.nmethodcode.value,
                    nsourcecode: selectedRecord.nsourcecode.value,
                    ntransactiontestcode: selectedRecord.ntransactiontestcode,
                    userinfo: this.props.Login.userInfo,
                    activeTestKey: "IDS_RESULTS",
                    ncontrolcode: this.props.Login.ncontrolcode
                }
                // inputParam = {
                //     classUrl: classUrl,
                //     methodUrl: "TestMethodSource",
                //     inputData: inputData,
                //     isFileupload: false,
                //     operation: "update",
                //     displayName: this.props.Login.inputParam.displayName, saveType//postParam
                // }

                this.updateTestMethodSource(inputData, this.props.Login.masterData, this.props.Login.ncontrolcode);
                return;
            }
            if (this.props.Login.screenName === "IDS_INSTRUMENT") {
                
//ALPD-5032 added by Dhanushya RI,To insert and jsonObject when add or edit instrument    
            let inputData = {};
            inputData["InstrumentJson"]={};
            if(selectedRecordInstrumentForm){
               inputData["InstrumentJson"]={ "InstrumentCategory":{
                    label: selectedRecordInstrumentForm.ninstrumentcatcode.label,
                    value: selectedRecordInstrumentForm.ninstrumentcatcode.value
                },
                "InstrumentName": {
                    label: selectedRecordInstrumentForm.ninstrumentnamecode && selectedRecordInstrumentForm.ninstrumentnamecode.label || 'NA',
                    value: selectedRecordInstrumentForm.ninstrumentnamecode && selectedRecordInstrumentForm.ninstrumentnamecode.value || -1
                },
                "InstrumentId": {
                    label: selectedRecordInstrumentForm.ninstrumentcode && selectedRecordInstrumentForm.ninstrumentcode.label || 'NA',
                    value: selectedRecordInstrumentForm.ninstrumentcode && selectedRecordInstrumentForm.ninstrumentcode.value || -1
                },            
                "InstrumentStartDate": selectedRecordInstrumentForm.dfromdate ? convertDateTimetoStringDBFormat(selectedRecordInstrumentForm.dfromdate, this.props.Login.userInfo) : "",
                "InstrumentEndDate": selectedRecordInstrumentForm.dtodate ? convertDateTimetoStringDBFormat(selectedRecordInstrumentForm.dtodate, this.props.Login.userInfo) : "",
 
            } 
        }           
                if (this.props.Login.operation === "update") {
                    inputData = {
                        ResultUsedInstrument: {
                            nresultusedinstrumentcode: selectedRecordInstrumentForm.nresultusedinstrumentcode,
                            npreregno: selectedRecordInstrumentForm.npreregno,
                            ninstrumentcatcode: selectedRecordInstrumentForm.ninstrumentcatcode.value,
                            ninstrumentnamecode: selectedRecordInstrumentForm.ninstrumentnamecode.value,
                            ninstrumentcode: selectedRecordInstrumentForm.ninstrumentcode.value,
                            dfromdate: formatInputDate(selectedRecordInstrumentForm.dfromdate, false),
                            dtodate: formatInputDate(selectedRecordInstrumentForm.dtodate, false),
                            stzfromdate: selectedRecordInstrumentForm.ntzfromdate.label,
                            stztodate: selectedRecordInstrumentForm.ntztodate.label,
                            ntzfromdate: selectedRecordInstrumentForm.ntzfromdate.value,
                            ntztodate: selectedRecordInstrumentForm.ntztodate.value,
                            ntransactiontestcode: selectedRecordInstrumentForm.ntransactiontestcode
                        },
                        userinfo: this.props.Login.userInfo,
                        nregtypecode: nregtypecode,
                        nregsubtypecode: nregsubtypecode,
                        ndesigntemplatemappingcode: ndesigntemplatemappingcode,
                        ntransactiontestcode: this.props.Login.masterData.RESelectedTest ?
                            this.props.Login.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
                        jsondata: JSON.stringify(inputData["InstrumentJson"]) //ALPD-5032

                        }
                }
                else {
                    inputData = {
                        ResultUsedInstrument: {
                            ntransactiontestcode: selectedRecordInstrumentForm.ntransactiontestcode,
                            npreregno: selectedRecordInstrumentForm.npreregno,
                            ninstrumentcatcode: selectedRecordInstrumentForm.ninstrumentcatcode.value,
                            ninstrumentnamecode: selectedRecordInstrumentForm.ninstrumentnamecode.value,
                            ninstrumentcode: selectedRecordInstrumentForm.ninstrumentcode.value,
                            dfromdate: formatInputDate(selectedRecordInstrumentForm.dfromdate, false),
                            dtodate: formatInputDate(selectedRecordInstrumentForm.dtodate, false),
                            stzfromdate: selectedRecordInstrumentForm.ntzfromdate.label,
                            stztodate: selectedRecordInstrumentForm.ntztodate.label,
                            ntzfromdate: selectedRecordInstrumentForm.ntzfromdate.value,
                            ntztodate: selectedRecordInstrumentForm.ntztodate.value
                    
                        },
                        userinfo: this.props.Login.userInfo,
                        nregtypecode: nregtypecode,
                        nregsubtypecode: nregsubtypecode,
                        jsondata: JSON.stringify(inputData["InstrumentJson"]),
                        ndesigntemplatemappingcode: ndesigntemplatemappingcode,
                        transactiontestcode: this.props.Login.masterData.RESelectedTest ?
                            this.props.Login.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
                    }
                }
                inputParam = {
                    classUrl: classUrl,
                    methodUrl: "ResultUsedInstrument",

                    inputData: inputData, selectedId,
                    isFileupload: false,
                    activeTestKey: "IDS_INSTRUMENT",
                    operation: this.props.Login.operation,
                    displayName: this.props.Login.inputParam.displayName, saveType//postParam
                }
            }
            if (this.props.Login.screenName === "IDS_MATERIAL") {
                let inputData = [];
                if (this.state.selectedRecordMaterialForm.nmaterialcode != "") {
                    if (this.state.selectedRecordMaterialForm.nmaterialinventorycode != "") {
                        if (parseFloat(this.state.selectedRecordMaterialForm.susedquantity) <= parseFloat(this.state.selectedRecordMaterialForm.savailablequantity)) {
                            if (this.props.Login.operation === "update") {
                                inputData = {
                                    ResultUsedMaterial: {
                                        nresultusedmaterialcode: selectedRecordMaterialForm.nresultusedmaterialcode,
                                        ntransactiontestcode: selectedRecordMaterialForm.ntransactiontestcode,
                                        npreregno: selectedRecordMaterialForm.npreregno,
                                        nmaterialtypecode: selectedRecordMaterialForm.nmaterialtypecode.value,
                                        nmaterialcategorycode: selectedRecordMaterialForm.nmaterialcategorycode.value,
                                        nmaterialcode: selectedRecordMaterialForm.nmaterialcode.value,
                                        ninventorycode: selectedRecordMaterialForm.nmaterialinventorycode.value,
                                        nsectioncode: selectedRecordMaterialForm.nsectioncode,
                                        jsondata: {
                                            sarno: selectedRecordMaterialForm.sarno,
                                            ssamplearno: selectedRecordMaterialForm.ssamplearno,
                                            stestsynonym: selectedRecordMaterialForm.stestsynonym,
                                            smaterialcatname: selectedRecordMaterialForm.nmaterialcatcode.label,
                                            smaterialname: selectedRecordMaterialForm.nmaterialcode.label,
                                            sinventoryid: selectedRecordMaterialForm.nmaterialinventorycode.label,
                                            nqtyused: selectedRecordMaterialForm.susedquantity,
                                            scarriergas: selectedRecordMaterialForm.scarriergas,
                                            smobilephase: selectedRecordMaterialForm.smobilephase,
                                            sremarks: selectedRecordMaterialForm.sremarks,
                                            susername: this.props.Login.userInfo.susername,
                                            nsectioncode: selectedRecordMaterialForm.nsectioncode,
                                            ssectionname: selectedRecordMaterialForm.ssectionname,
                                            ntestgroupmaterial: selectedRecordMaterialForm.ntestgroupmaterial,
                                            ntestgrouptestcode: selectedRecordMaterialForm.ntestgroupmaterial == transactionStatus.YES ?
                                                this.props.Login.masterData.RESelectedTest[0].ntestgrouptestcode : -1
                                        }
                                    },
                                    MaterialInventoryTrans: {
                                        nmaterialinventorycode: selectedRecordMaterialForm.nmaterialinventorycode.value,
                                        nsectioncode: selectedRecordMaterialForm.nsectioncode,
                                        jsondata: {
                                            IDS_INVENTORYID: selectedRecordMaterialForm.nmaterialinventorycode.label,
                                            nqtyused: selectedRecordMaterialForm.susedquantity,
                                        }
                                    },
                                    userinfo: this.props.Login.userInfo,
                                    nregtypecode: nregtypecode,
                                    nregsubtypecode: nregsubtypecode,
                                    ndesigntemplatemappingcode: ndesigntemplatemappingcode,
                                    nresultusedmaterialcode: selectedRecordMaterialForm.nresultusedmaterialcode,
                                    ntransactiontestcode: this.props.Login.masterData.RESelectedTest ?
                                        this.props.Login.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
                                }
                            }
                            else {
                                inputData = {
                                    ResultUsedMaterial: {
                                        ntransactiontestcode: selectedRecordMaterialForm.ntransactiontestcode,
                                        npreregno: selectedRecordMaterialForm.npreregno,
                                        nmaterialtypecode: selectedRecordMaterialForm.nmaterialtypecode.value,
                                        nmaterialcategorycode: selectedRecordMaterialForm.nmaterialcatcode.value,
                                        nmaterialcode: selectedRecordMaterialForm.nmaterialcode.value,
                                        ninventorycode: selectedRecordMaterialForm.nmaterialinventorycode.value,
                                        nsectioncode: selectedRecordMaterialForm.nsectioncode,
                                        jsondata: {
                                            sarno: selectedRecordMaterialForm.sarno,
                                            ssamplearno: selectedRecordMaterialForm.ssamplearno,
                                            stestsynonym: selectedRecordMaterialForm.stestsynonym,
                                            smaterialcatname: selectedRecordMaterialForm.nmaterialcatcode.label,
                                            smaterialname: selectedRecordMaterialForm.nmaterialcode.label,
                                            sinventoryid: selectedRecordMaterialForm.nmaterialinventorycode.label,
                                            nqtyused: selectedRecordMaterialForm.susedquantity,
                                            scarriergas: selectedRecordMaterialForm.scarriergas,
                                            smobilephase: selectedRecordMaterialForm.smobilephase,
                                            sremarks: selectedRecordMaterialForm.sremarks,
                                            smaterialtypename: selectedRecordMaterialForm.nmaterialtypecode.label,
                                            nsectioncode: selectedRecordMaterialForm.nsectioncode,
                                            ntestgroupmaterial: selectedRecordMaterialForm.ntestgroupmaterial,
                                            ssectionname: selectedRecordMaterialForm.ssectionname,
                                            ntestgrouptestcode: selectedRecordMaterialForm.ntestgroupmaterial == transactionStatus.YES ?
                                                this.props.Login.masterData.RESelectedTest[0].ntestgrouptestcode : -1
                                        }
                                    },
                                    MaterialInventoryTrans: {
                                        nmaterialinventorycode: selectedRecordMaterialForm.nmaterialinventorycode.value,
                                        nsectioncode: selectedRecordMaterialForm.nsectioncode,
                                        jsondata: {
                                            nqtyused: selectedRecordMaterialForm.susedquantity,
                                            IDS_INVENTORYID: selectedRecordMaterialForm.nmaterialinventorycode.label
                                        }
                                    },
                                    userinfo: this.props.Login.userInfo,
                                    nregtypecode: nregtypecode,
                                    nregsubtypecode: nregsubtypecode,
                                    ndesigntemplatemappingcode: ndesigntemplatemappingcode,
                                    transactiontestcode: this.props.Login.masterData.RESelectedTest ?
                                        this.props.Login.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
                                }
                            }
                            inputParam = {
                                classUrl: classUrl,
                                methodUrl: "ResultUsedMaterial",
                                inputData: inputData, selectedId,
                                isFileupload: false,
                                activeTestKey: "IDS_MATERIAL",
                                operation: this.props.Login.operation,
                                displayName: this.props.Login.inputParam.displayName, saveType//postParam
                            }
                        } else {
                            toast.warn(this.props.intl.formatMessage({ id: "Quantity Not available" }))
                            return null;
                        }


                    } else {
                        toast.warn(this.props.intl.formatMessage({ id: "Select Material Inventory" }))
                        return null;
                    }
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "Select Material" }))
                    return null;
                }
            }
            if (this.props.Login.screenName === "IDS_TASK") {
                // if ((selectedRecord.sanalysistime && selectedRecord.sanalysistime !== "")
                //     || (selectedRecord.smisctime && selectedRecord.smisctime !== "")
                //     || (selectedRecord.spreanalysistime && selectedRecord.spreanalysistime !== "")
                //     || (selectedRecord.spreparationtime && selectedRecord.spreparationtime !== "")
                //     || (selectedRecord.scomments && selectedRecord.scomments !== "")) {
                //     if (this.props.Login.operation === "update") {
                if ((selectedRecordTaskForm.sanalysistime && selectedRecordTaskForm.sanalysistime !== "")
                    || (selectedRecordTaskForm.smisctime && selectedRecordTaskForm.smisctime !== "")
                    || (selectedRecordTaskForm.spreanalysistime && selectedRecordTaskForm.spreanalysistime !== "")
                    || (selectedRecordTaskForm.spreparationtime && selectedRecordTaskForm.spreparationtime !== "")
                    || (selectedRecordTaskForm.scomments && selectedRecordTaskForm.scomments !== "")) {
                    if (this.props.Login.operation === "update") {
                        inputData = {
                            ResultUsedTasks: {
                                nresultusedtaskcode: selectedRecordTaskForm.nresultusedtaskcode,
                                jsondata: {
                                    //ntransactiontestcode: parseInt(selectedRecord.ntransactiontestcode),
                                    sarno: this.props.Login.masterData.RESelectedTest[0].sarno,
                                    ssamplearno: this.props.Login.masterData.RESelectedTest[0].ssamplearno,
                                    stestsynonym: selectedRecordTaskForm.stestsynonym,
                                    sanalysistime: selectedRecordTaskForm.sanalysistime ? selectedRecordTaskForm.sanalysistime : "",
                                    sanalyst: this.props.Login.userInfo.susername,
                                    smisctime: selectedRecordTaskForm.smisctime ? selectedRecordTaskForm.smisctime : "",
                                    spreanalysistime: selectedRecordTaskForm.spreanalysistime ? selectedRecordTaskForm.spreanalysistime : "",
                                    spreparationtime: selectedRecordTaskForm.spreparationtime ? selectedRecordTaskForm.spreparationtime : "",
                                    staskprocedure: selectedRecordTaskForm.staskprocedure ? selectedRecordTaskForm.staskprocedure : "",
                                    scomments: selectedRecordTaskForm.scomments ? selectedRecordTaskForm.scomments : ""
                                }
                            },
                            userinfo: this.props.Login.userInfo,
                            ntransactiontestcode: this.props.Login.masterData.RESelectedTest && this.props.Login.masterData.RESelectedTest.map(sample => sample.ntransactiontestcode).join(","),
                            nregtypecode: nregtypecode,
                            nregsubtypecode: nregsubtypecode,
                            ndesigntemplatemappingcode: ndesigntemplatemappingcode,
                        }
                    }
                    else {
                        let taskArry = [];
                        this.props.Login.masterData.RESelectedTest &&
                            this.props.Login.masterData.RESelectedTest.map(test =>

                                taskArry.push({
                                    //ntransactiontestcode: parseInt(selectedRecord.ntransactiontestcode),
                                    ntransactiontestcode: parseInt(test.ntransactiontestcode),
                                    npreregno: parseInt(test.npreregno),
                                    // sanalysistime: selectedRecord.sanalysistime ? selectedRecord.sanalysistime : "",
                                    // sanalyst: this.props.Login.userInfo.susername,
                                    // smisctime: selectedRecord.smisctime ? selectedRecord.smisctime : "",
                                    // spreanalysistime: selectedRecord.spreanalysistime ? selectedRecord.spreanalysistime : "",
                                    // spreparationtime: selectedRecord.spreparationtime ? selectedRecord.spreparationtime : "",
                                    // scomments: selectedRecord.scomments ? selectedRecord.scomments : "",
                                    // npreregno: this.props.Login.masterData.RESelectedSample ? this.props.Login.masterData.RESelectedSample.map(preregno => preregno.npreregno).join(",").toString() : "",
                                    jsondata: {
                                        //ntransactiontestcode: parseInt(selectedRecord.ntransactiontestcode),
                                        sarno: test.sarno,
                                        ssamplearno: test.ssamplearno,
                                        stestsynonym: test.stestsynonym,
                                        sanalysistime: selectedRecordTaskForm.sanalysistime ? selectedRecordTaskForm.sanalysistime : "",
                                        sanalyst: this.props.Login.userInfo.susername,
                                        smisctime: selectedRecordTaskForm.smisctime ? selectedRecordTaskForm.smisctime : "",
                                        spreanalysistime: selectedRecordTaskForm.spreanalysistime ? selectedRecordTaskForm.spreanalysistime : "",
                                        spreparationtime: selectedRecordTaskForm.spreparationtime ? selectedRecordTaskForm.spreparationtime : "",
                                        staskprocedure: selectedRecordTaskForm.staskprocedure ? selectedRecordTaskForm.staskprocedure : "",
                                        scomments: selectedRecordTaskForm.scomments ? selectedRecordTaskForm.scomments : ""
                                    }
                                })
                            )
                        inputData = {
                            ResultUsedTasks: taskArry,
                            userinfo: this.props.Login.userInfo,
                            ntransactiontestcode: this.props.Login.masterData.RESelectedTest && this.props.Login.masterData.RESelectedTest.map(sample => sample.ntransactiontestcode).join(","),
                            nregtypecode: nregtypecode,
                            nregsubtypecode: nregsubtypecode,
                            ndesigntemplatemappingcode: ndesigntemplatemappingcode
                        }
                    }
                    inputParam = {
                        classUrl: classUrl,
                        methodUrl: "ResultUsedTasks",
                        inputData: inputData, selectedId,
                        activeTestKey: "IDS_TASK",
                        isFileupload: false,
                        operation: this.props.Login.operation,
                        displayName: this.props.Login.inputParam.displayName, saveType//postParam
                    }
                } else {
                    toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERTASKTIME" }));
                    return;
                }
            }
            if (this.props.Login.screenName === "IDS_PARAMETERCOMMENTS") {
                inputData = {
                    ntransactiontestcode: selectedRecord.ntransactiontestcode,
                    ntransactionresultcode: selectedRecord.ntransactionresultcode,
                    sresultcomment: selectedRecord.sresultcomment,
                    transactiontestcode: selectedRecord.transactiontestcode,
                    userinfo: this.props.Login.userInfo,
                    nregtypecode: nregtypecode,
                    nregsubtypecode: nregsubtypecode,
                    ncontrolcode: this.props.Login.ncontrolcode,
                    nneedReceivedInLab: parseInt(this.props.Login.settings && this.props.Login.settings['43'])

                }
                // inputParam = {
                //     classUrl: classUrl,
                //     methodUrl: "ParameterComments",
                //     inputData: inputData, selectedId,
                //     isFileupload: false,
                //     operation: this.props.Login.operation,
                //     displayName: this.props.Login.inputParam.displayName, saveType//postParam
                // }
                this.updateParameterComments(inputData, this.props.Login.masterData, selectedRecord.ncontrolcode);
                return;
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
                        userinfo: this.props.Login.userInfo,
                        nregtypecode: nregtypecode,
                        nregsubtypecode: nregsubtypecode
                    }
                    inputParam = {
                        classUrl: classUrl,
                        methodUrl: "ResultEntryChecklist",
                        inputData: inputData, selectedId,
                        isFileupload: false,
                        operation: this.props.Login.operation,
                        displayName: this.props.Login.inputParam.displayName, saveType//postParam
                    }
                }
            }
            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {

                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            }
        }
    }
    gridfillingColumn(data) {
        //  const tempArray = [];
        const temparray = data && data.map((option) => {
            return { "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode], "dataField": option[designProperties.VALUE], "width": "200px", "columnSize": "3", "dataType": [option[designProperties.LISTITEM]] };
        });
        return temparray;
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

    componentDidUpdate(previousProps) {
        let { showTest, showSample, userRoleControlRights, controlMap, resultDataState, instrumentDataState,
            materialDataState, taskDataState, documentDataState, resultChangeDataState, testCommentDataState,
            historyDataState, sampleListColumns, subSampleListColumns, testListColumns,
            SingleItem, sampleListMainField, subSampleListMainField, testListMainField,
            SampleGridItem, SampleGridExpandableItem, sampleMoreField, subSampleMoreField,
            testMoreField, selectedRecord, SampleType, RegistrationType, RegistrationSubType,
            REFilterStatus, REJobStatus, Testvalues, ApprovalConfigVersion, DynamicSampleColumns,
            DynamicSubSampleColumns, DynamicTestColumns, DynamicGridItem, DynamicGridMoreField,
            validateFormulaMandyFields, skip, take, testskip, testtake, selectedFilter, stateDynamicDesign,
            activeTabIndex, activeTabId, sampleChangeDataState, testSearchField, AdhocParamter,
            Batchvalues, Worklistvalues, ConfigurationFilterValues, enlLink, openELNSheet, parameterResults, isParameterInitialRender, isaddSampleRender
            , selectedRecordTaskForm, isTaskInitialRender, selectedRecordMaterialForm, isMaterialInitialRender
            , selectedRecordInstrumentForm, isInstrumentInitialRender, selectedRecordCompleteForm, isCompleteInitialRender
            , subSampleSkip, subSampleTake, sampleSearchField, subsampleSearchField, selectedRecordAdhocParameter,
            samplefilteritem, sampledisplayfields
        } = this.state;
        //,currentAlertResultCode,currentntestgrouptestpredefcode

        let bool = false;

        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                bool = true;
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
        }
        if (this.props.Login.masterData.DynamicDesign && this.props.Login.masterData.DynamicDesign !== previousProps.Login.masterData.DynamicDesign) {
            const dynamicColumn = JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata.value)
            DynamicSampleColumns = dynamicColumn.samplelistitem ? dynamicColumn.samplelistitem : [];
            DynamicSubSampleColumns = dynamicColumn.subsamplelistitem ? dynamicColumn.subsamplelistitem : [];
            DynamicTestColumns = dynamicColumn.testlistitem ? dynamicColumn.testlistitem : []

            DynamicGridItem = dynamicColumn.samplegriditem ? dynamicColumn.samplegriditem : [];
            DynamicGridMoreField = dynamicColumn.samplegridmoreitem ? dynamicColumn.samplegridmoreitem : [];

            SingleItem = dynamicColumn.sampledisplayfields ? dynamicColumn.sampledisplayfields : [];
            // testMoreField = dynamicColumn.testlistmoreitems ? dynamicColumn.testlistmoreitems : [];
            // testListColumns = dynamicColumn.testlistitem ? dynamicColumn.testlistitem : []

            testMoreField = dynamicColumn.testListFields.testlistmoreitems ? dynamicColumn.testListFields.testlistmoreitems : [];
            testListColumns = dynamicColumn.testListFields.testlistitem ? dynamicColumn.testListFields.testlistitem : [];
            testSearchField = dynamicColumn.testListFields.testsearchfields ? dynamicColumn.testListFields.testsearchfields : [];

            sampleSearchField = dynamicColumn.samplesearchfields ? dynamicColumn.samplesearchfields : [];
            subsampleSearchField = dynamicColumn.subsamplesearchfields ? dynamicColumn.subsamplesearchfields : [];

            samplefilteritem = dynamicColumn.samplefilteritem || [];
            sampledisplayfields = dynamicColumn.sampledisplayfields || [];

            this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample &&
                DynamicSubSampleColumns.push({
                    1: { 'en-US': 'Specimen', 'ru-RU': 'Образец', 'tg-TG': 'Намуна' },
                    2: "scomponentname"
                });

            bool = true;
        }
        if (this.props.Login.masterData.RegistrationSubType &&
            this.props.Login.masterData.RegistrationSubType !== previousProps.Login.masterData.RegistrationSubType) {
            let dataState = {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5
                //, group: [{ field: `${this.props.Login.masterData.nneedsubsample ? 'ssamplearno' : 'sarno'}` }] 
            }
            bool = true;
            resultDataState = dataState;
            instrumentDataState = dataState;
            materialDataState = dataState;
            taskDataState = dataState;
            documentDataState = dataState;
            resultChangeDataState = dataState;
            historyDataState = dataState;
            testCommentDataState = dataState;
            sampleChangeDataState = dataState;
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            bool = true;
            selectedRecord = this.props.Login.selectedRecord;
        }
        if (this.props.Login.selectedRecordAdhocParameter !== previousProps.Login.selectedRecordAdhocParameter) {
            bool = true;
            selectedRecordAdhocParameter = this.props.Login.selectedRecordAdhocParameter;
        }
        if (this.props.Login.selectedRecordTaskForm !== previousProps.Login.selectedRecordTaskForm) {
            bool = true;
            selectedRecordTaskForm = this.props.Login.selectedRecordTaskForm;
        }
        if (this.props.Login.selectedRecordMaterialForm !== previousProps.Login.selectedRecordMaterialForm) {
            bool = true;
            selectedRecordMaterialForm = this.props.Login.selectedRecordMaterialForm;
        }

        if (this.props.Login.selectedRecordInstrumentForm !== previousProps.Login.selectedRecordInstrumentForm) {
            bool = true;
            selectedRecordInstrumentForm = this.props.Login.selectedRecordInstrumentForm;
        }
        if (this.props.Login.selectedRecordCompleteForm !== previousProps.Login.selectedRecordCompleteForm) {
            bool = true;
            selectedRecordCompleteForm = this.props.Login.selectedRecordCompleteForm;
        }
        if (this.props.Login.parameterResults !== previousProps.Login.parameterResults) {
            bool = true;
            parameterResults = this.props.Login.parameterResults;
        }
        if (this.props.Login.isTaskInitialRender !== previousProps.Login.isTaskInitialRender) {
            bool = true;
            isTaskInitialRender = this.props.Login.isTaskInitialRender;
        }
        if (this.props.Login.isParameterInitialRender !== previousProps.Login.isParameterInitialRender) {
            bool = true;
            isParameterInitialRender = this.props.Login.isParameterInitialRender;
        }
        if (this.props.Login.isaddSampleRender !== previousProps.Login.isaddSampleRender) {
            bool = true;
            isaddSampleRender = this.props.Login.isaddSampleRender;
        }


        // if (this.props.Login.currentAlertResultCode !== previousProps.Login.currentAlertResultCode) {
        //     bool = true;
        //     currentAlertResultCode = this.props.Login.currentAlertResultCode;
        // }
        // if (this.props.Login.currentntestgrouptestpredefcode !== previousProps.Login.currentntestgrouptestpredefcode) {
        //     bool = true;
        //     currentntestgrouptestpredefcode = this.props.Login.currentntestgrouptestpredefcode;
        // }
        if (this.props.Login.validateFormulaMandyFields !== previousProps.Login.validateFormulaMandyFields) {
            bool = true;
            validateFormulaMandyFields = this.props.Login.validateFormulaMandyFields;
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            bool = true;
            SampleType = constructOptionList(this.props.Login.masterData.SampleType || [], "nsampletypecode", "ssampletypename", 'nsampletypecode', 'ascending', 'nsampletypecode', false);
            RegistrationType = constructOptionList(this.props.Login.masterData.RegistrationType || [], "nregtypecode", "sregtypename", "nsorter", 'ascending', 'nregtypecode', false);
            RegistrationSubType = constructOptionList(this.props.Login.masterData.RegistrationSubType || [], "nregsubtypecode", "sregsubtypename", "nsorter", 'ascending', 'nregsubtypecode', false);
            REFilterStatus = constructOptionList(this.props.Login.masterData.REFilterStatus || [], "ntransactionstatus", "sfilterstatus", "nsorter", 'ascending', "ntransactionstatus", false);
            REJobStatus = constructOptionList(this.props.Login.masterData.REJobStatus || [], 'njobstatuscode', 'sidsjobstatusname', 'ascending', 'njobstatuscode', false);
            Testvalues = constructOptionList(this.props.Login.masterData.Testvalues || [], 'ntestcode', 'stestsynonym', 'ascending', 'ntestcode', false);
            Batchvalues = constructOptionList(this.props.Login.masterData.Batchvalues || [], 'nbatchmastercode', 'sbatcharno', 'ascending', 'nbatchmastercode', false);
            Worklistvalues = constructOptionList(this.props.Login.masterData.Worklistvalues || [], 'nworklistcode', 'sworklistno', 'ascending', 'nworklistcode', false);
            ConfigurationFilterValues = constructOptionList(this.props.Login.masterData.ConfigurationFilterValues || [], 'nconfigfiltercode', 'sfiltername', 'ascending', 'nconfigfiltercode', false);
            ApprovalConfigVersion = constructOptionList(this.props.Login.masterData.ApprovalConfigVersion || [], 'napprovalconfigversioncode', 'sversionname',
                'ascending', 'napprovalconfigversioncode', false);
            // AdhocParamter = constructOptionList(this.props.Login.masterData.AdhocParamter || [], 'ntestparametercode', 'sparametersynonym',
            //     'ascending', 'ntestparametercode', false);
            skip = this.props.Login.skip === undefined ? skip : this.props.Login.skip
            take = this.props.Login.take || take
            testskip = this.props.Login.testskip === undefined ? testskip : this.props.Login.testskip
            testtake = this.props.Login.testtake || testtake
            subSampleSkip = this.props.Login.subSampleSkip === undefined ? subSampleSkip : this.props.Login.subSampleSkip
            subSampleTake = this.props.Login.subSampleTake || subSampleTake
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
            if (this.props.Login.sampleChangeDataState && this.props.Login.sampleChangeDataState !== previousProps.Login.sampleChangeDataState) {
                sampleChangeDataState = this.props.Login.sampleChangeDataState;
            }



            // if (this.props.Login.enlLink !== previousProps.Login.enlLink) {

            //     bool = true;

            //     enlLink = this.props.Login.enlLink;
            //     openELNSheet=true;


            //     }


            let selectFilterStatus = { ntransactionstatus: transactionStatus.PARTIAL, sfilterstatus: this.props.intl.formatMessage({ id: "IDS_PARTIAL" }), scolorhexcode: "#800000" }
            const selectedFilters = this.props.Login.masterData.REFilterStatus || [];

            const selectedFiltersNew = JSON.parse(JSON.stringify(selectedFilters));

            const index = selectedFiltersNew.findIndex(item => item.ntransactionstatus === transactionStatus.PARTIAL)
            if (selectedFiltersNew.length > 0 && index === -1) {
                selectedFiltersNew.push(selectFilterStatus)
            }
            selectedFilter = selectedFiltersNew;
            // const updateInfo = {
            //     typeName: DEFAULT_RETURN,
            //     data: {masterData: this.props.Login.masterData,showTest,showSample }
            // }
            // this.props.updateStore(updateInfo);
            SampleType = SampleType.get("OptionList")
            RegistrationType = RegistrationType.get("OptionList")
            RegistrationSubType = RegistrationSubType.get("OptionList")
            REFilterStatus = REFilterStatus.get("OptionList")
            REJobStatus = REJobStatus.get("OptionList")
            Testvalues = Testvalues.get("OptionList")
            Batchvalues = Batchvalues.get("OptionList")
            Worklistvalues = Worklistvalues.get("OptionList")
            ConfigurationFilterValues = ConfigurationFilterValues.get("OptionList")
            ApprovalConfigVersion = ApprovalConfigVersion.get("OptionList")
            // AdhocParamter=AdhocParamter.get("OptionList")
        }

        if (this.props.Login.activeTabIndex !== previousProps.Login.activeTabIndex) {
            activeTabIndex = this.props.Login.activeTabIndex;
            activeTabId = this.props.Login.activeTabId;
            bool = true;
        }

        if (this.props.Login.masterData.DesignTemplateMapping !== previousProps.Login.masterData.DesignTemplateMapping) {

            const DesignTemplateMappingMap = constructOptionList(this.props.Login.masterData.DesignTemplateMapping || [], "ndesigntemplatemappingcode",
                "sregtemplatename", undefined, undefined, false);

            stateDynamicDesign = DesignTemplateMappingMap.get("OptionList")
        }

        if (bool) {
            this.setState({
                showTest, showSample, userRoleControlRights, controlMap, resultDataState, instrumentDataState,
                materialDataState, taskDataState, documentDataState, resultChangeDataState, testCommentDataState,
                historyDataState, sampleListColumns, subSampleListColumns, testListColumns,
                SingleItem, sampleListMainField, subSampleListMainField, testListMainField,
                SampleGridItem, SampleGridExpandableItem, sampleMoreField, subSampleMoreField,
                testMoreField, selectedRecord,
                SampleType,
                RegistrationType,
                RegistrationSubType,
                REFilterStatus,
                REJobStatus,
                Testvalues,
                Batchvalues,
                Worklistvalues,
                ConfigurationFilterValues,
                ApprovalConfigVersion,
                validateFormulaMandyFields,
                skip, take, testskip, testtake,
                selectedFilter,
                DynamicSampleColumns, DynamicSubSampleColumns, DynamicTestColumns,
                DynamicGridItem, DynamicGridMoreField, stateDynamicDesign,
                activeTabIndex, activeTabId, sampleChangeDataState, testSearchField, AdhocParamter
                , parameterResults, isParameterInitialRender, isaddSampleRender, selectedRecordTaskForm, isTaskInitialRender,
                selectedRecordMaterialForm, isMaterialInitialRender,
                selectedRecordInstrumentForm, isInstrumentInitialRender, selectedRecordCompleteForm, isCompleteInitialRender
                //,currentAlertResultCode,currentntestgrouptestpredefcode
                , subSampleSkip, subSampleTake, sampleSearchField, subsampleSearchField, selectedRecordAdhocParameter, samplefilteritem, sampledisplayfields,
            })
        }

        if (this.props.Login.meanTestParameterList !== previousProps.Login.meanTestParameterList) {
            this.setState({ meanTestParameterList: this.props.Login.meanTestParameterList });
        }
    }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, activeTabIndex: undefined
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
        // if (props.Login.selectedRecord !== state.selectedRecord) {
        //     return ({ selectedRecord: { ...state.selectedRecord, ...props.Login.selectedRecord } });
        // }
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
    completeTest, testMethodSourceEdit, addREInstrument, addREMaterial, deleteInstrumentRecord, fetchInstrumentRecord, deleteTaskRecord, fetchTaskRecord,
    parameterRecord, checkListRecord, onSaveCheckList, defaultTest, getFormula, getRERegistrationType, getRERegistrationSubType, fetchMaterialRecord,
    getREApprovalConfigVersion, getResultEntryDetails, calculateFormula, getREFilterStatus, getREFilterTestData, getREJobStatus, getSampleChildTabREDetail,
    viewAttachment, getAttachmentCombo, deleteAttachment, resultImportFile, validateEsignCredentialComplete, getCommentsCombo, updateTestMethodSource,
    filterTransactionList, validateEsignCredential, updateParameterComments, previewSampleReport, getMeanCalculationTestParameter,
    getREMaterialCategoryByType, getREMaterialByCategory, getREMaterialInvertoryByMaterial, getAvailableMaterialQuantity, testStart,
    getSubSampleChildTabDetail, getSampleChildTabDetail, getREFilterTemplate, getAverageResult, getREMaterialComboGet//,deleteResultUsedMaterial
    , getPredefinedData
    , getELNTestValidation
    , getConfigurationFilter, getTestBasedBatchWorklist, addREAdhocParamter, createAdhocParamter, enforceResult, ResultEntryViewPatientDetails, resultEntryGetParameter, resultEntryGetSpec, resultEntryGetComponent, addREAdhocTestParamter, createAdhocTestParamter,
    CompletePopupAction, exportAction, getSectionChange, updateSectionTest,getResultEntryFilter

})(injectIntl(ResultEntry));