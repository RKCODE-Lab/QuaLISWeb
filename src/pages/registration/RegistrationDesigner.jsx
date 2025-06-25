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
    cancelTestAction, cancelSampleAction, addsubSampleRegistration, saveSubSample, onApprovalConfigVersionChange,
    getEditSubSampleComboService, onUpdateSubSampleRegistration, cancelSubSampleAction,//componentTestPackage,
    preregRecordToQuarantine, componentTest, getSubSampleChildTabDetail, validateEsignforRegistration, testPackageTest,
    getStorageCategoryForSendToStore, loadApprovedLocationOnCombo,
    loadApprovedLocationOnTreeData, sendToStoreSampleStorageMaster,
    addMasterRecord, getAddMasterCombo, getDynamicMasterTempalte,
    getOutSourceSiteAndTest, outsourceSampleTest,
    getChildComboMaster, getChildValuesForAddMaster, insertRegistration, getBarcodeAndPrinterService
    , getEditMaster, getOrderDetails, onUpdateCancelExternalOrder, outsourceTest, getOutSourceSite, getExternalOrderForMapping, orderMapping, getExternalOrderTypeForMapping,
    orderRecords, testSectionTest, openBarcodeModal, barcodeGeneration, getAdhocTest, createAdhocTest, copySampleService, filterObject, toTimestamp, rearrangeDateFormatforKendoDataTool
    , generateControlBasedReport,getRegistrationFilter,insertRegSample,getTestMethod,onUpdateTestMethod
} from '../../actions'
import { Button, Card, Col, Nav, Row, FormLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import {
    getControlMap, showEsign, sortData, constructOptionList, sortDataForDate, Lims_JSON_stringify,
    onDropAttachFileList, deleteAttachmentDropZone, comboChild, childComboClear, ageCalculate, extractFieldHeader, formatDate, formatInputDate, removeIndex
} from '../../components/CommonScript';
import RegistrationFilter from './RegistrationFilter';
import Esign from '../audittrail/Esign';
import { injectIntl } from 'react-intl';
import { ProductList } from '../product/product.styled';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import SplitterLayout from "react-splitter-layout";
import AddTest from './AddTest';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import { ReactComponent as SaveIcon } from '../../assets/image/save_icon.svg';
import { designProperties, RegistrationType, transactionStatus, SideBarSeqno, SideBarTabIndex, SampleType, formCode, designComponents, checkBoxOperation } from '../../components/Enumeration';
// import BreadcrumbComponentToolbar from '../../components/ToolbarBreadcrumb.Component';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { ListWrapper } from '../../components/client-group.styles';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileInvoice, faEye, faPlus, faSync, faBorderAll, faLink, faCommentDots, faChevronRight, faComments, faComment, faPaperclip,
    faFlask, faMicroscope, faHistory, faArrowRight, faBoxOpen, faBox, faLocationArrow, faFolderOpen, faFolder, faPrint, faFileImport, faCopy,
    faBolt

} from '@fortawesome/free-solid-svg-icons';
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
import { ReactComponent as Order } from '../../assets/image/orders-icon.svg';

import { getSameRecordFromTwoArrays, convertDateValuetoString, rearrangeDateFormat } from '../../components/CommonScript'
import RegistrationResultTab from './RegistrationResultTab';
import PortalModal from '../../PortalModal';
import PreRegisterSlideOutModal from './PreRegisterSlideOutModal';
import { getRegistrationSubSample } from './RegistrationValidation';
import AddSubSample from './AddSubSample';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import QRCode from 'react-qr-code';
import MoveSampleOrContainers from '../basemaster/MoveSampleOrContainers';
import { mapTree } from "@progress/kendo-react-treelist";
import { getFieldSpecification } from '../../components/type2component/Type2FieldSpecificationList';
import { getFieldSpecification as getFieldSpecification1 } from '../../components/type1component/Type1FieldSpecificationList';
import { getFieldSpecification as getFieldSpecification3 } from '../../components/type3component/Type3FieldSpecificationList';
import AddMasterRecords from '../dynamicpreregdesign/AddMasterRecords'
import ExternalOrder from './ExternalOrder';
import { ReactComponent as FullviewExpand } from '../../assets/image/fullview-expand.svg';
import { ReactComponent as FullviewCollapse } from '../../assets/image/fullview-collapse.svg';
import fullviewExpand from '../../assets/image/fullview-expand.svg';
import fullviewCollapse from '../../assets/image/fullview-collapse.svg';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import FormInput from '../../components/form-input/form-input.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';
import { getActionIcon } from '../../components/HoverIcons';
import MappingFields from '../registration/MappingFields';
import AddBarcode from '../../pages/BarcodeTemplate/AddBarcode';
import AddAdhocTest from './AddAdhocTest';
import BarcodeGeneratorComponent from '../../components/BarcodeGeneratorComponent';
import KendoDatatoolFilter from '../contactmaster/KendoDatatoolFilter';
import { replaceChildFromChildren } from '../../components/droparea/helpers';
import { intl } from '../../components/App';
import { ReactComponent as DownloadReportbutton } from '../../assets/image/downloadreportbutton.svg'
import ModalShow from '../../components/ModalShow';
import CustomPopover from '../../components/customPopover';
import AddTestMethod from '../registration/AddTestMethod';


class RegistrationDesigner extends Component {

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
                //, group: [{ field: 'sarno' }, { field: 'stestsynonym' }] 
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
            preRegisterId: -1,
            sampleBarcodeId: -1,
            subSampleBarcodeId: -1,
            registerId: -1,
            editSampleId: -1,
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
            //mention the property width in percentage based on window size
            propertyPopupWidth: "60",
            showQRCode: false,
            showBarcode: false,
            // specBasedComponent: this.props.Login.settings
            //     && this.props.Login.settings[18] ? this.props.Login.settings[18] === "true" ? true : false : false,
            treeData: [],
            toggleAction: false,
            selectedMaster: [],
            outsourceId: -1,
            copySampleId: -1,
            filterSampleList: [],

        };
        // this.onSecondaryPaneSizeChange = this.onSecondaryPaneSizeChange.bind(this);
        this.myRef = React.createRef();
    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "") {
            if (props.Login.errorCode === 409) {
                toast.warn(props.Login.masterStatus);
                props.Login.masterStatus = "";
            }
        }
        else if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.info(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }
        else if (props.Login.error !== state.error) {
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
        let RealApprovalConfigVersionValue = this.props.Login.masterData.RealApprovalConfigVersionValue && this.props.Login.masterData.RealApprovalConfigVersionValue
        let activeSampleTab = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
        let activeSubSampleTab = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
        let activeTestTab = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";

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
        // ALPD-4130 to clear additional filter config upon refresh and clear all filter - ATE241
        masterData["kendoFilterList"] = undefined;
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
            napproveconfversioncode: this.props.Login.masterData.RealApprovalConfigVersionValue
                && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode,
            nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
            //checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            noutsourcerequired: RealSampleTypeValue && RealSampleTypeValue.noutsourcerequired
        }
        if (inputData.nsampletypecode) {
            // let obj = this.covertDatetoString(this.props.Login.masterData.RealFromDate, this.props.Login.masterData.RealToDate)
            inputData['FromDate'] = obj.fromDate;
            inputData['ToDate'] = obj.toDate;

            let inputParam = { masterData, inputData, searchSubSampleRef: this.searchSubSampleRef, searchSampleRef: this.searchSampleRef, searchTestRef: this.searchTestRef, selectedFilter: this.state.selectedFilter }
            this.props.ReloadData(inputParam);
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
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

        let activeTestTab = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
        let masterData = {
            ...this.props.Login.masterData, RealSampleTypeValue, RealRegTypeValue, RealRegSubTypeValue,
            RealFilterStatusValue, RealFromDate, RealToDate, RealDesignTemplateMappingValue, RealApprovalConfigVersionValue,
            RealSampleTypeList, RealRegTypeList, RealRegSubTypeList, RealDesignTemplateMappingList, RealApprovalConfigVersionList,
            RealFilterStatuslist
        }
        let inputData = {
            npreregno: "",
            saveFilterSubmit:true, //ALPD-4912 to insert the filter data's in filterdetail table when submit the filter,done by Dhanushya RI
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
            userinfo: this.props.Login.userInfo, activeSampleTab, activeTestTab, activeSubSampleTab,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            napproveconfversioncode: this.props.Login.masterData.ApprovalConfigVersion
                && this.props.Login.masterData.ApprovalConfigVersionValue.napproveconfversioncode,
            ndesigntemplatemappingcode: this.props.Login.masterData.DesignTemplateMappingValue
                && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
            // checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            noutsourcerequired: RealSampleTypeValue && RealSampleTypeValue.noutsourcerequired
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
                this.props.getRegistrationSample(inputParam);
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_PLSSCONFIGREGISTRATIONTEMPLATE" }));
            }
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
        }
    }
	//ALPD-4914-To get previously saved filter details when click the filter name,,done by Dhanushya RI
    clickFilterDetail = (value) => {
        //if(this.props.Login.nfilternamecode!==value.nfilternamecode){
        let activeSampleTab = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
        let activeSubSampleTab = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";

        let activeTestTab = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
        let masterData = this.props.Login.masterData
        const obj = convertDateValuetoString(this.props.Login.masterData.RealFromDate,
            this.props.Login.masterData.RealToDate, this.props.Login.userInfo)
        let inputData = {
            userinfo: this.props.Login.userInfo, 
            activeSampleTab,
            activeTestTab,
            activeSubSampleTab,
            nfilternamecode:value && value.nfilternamecode? value.nfilternamecode:-1,
            nsampletypecode: this.props.Login.masterData && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
            ntranscode: this.props.Login.masterData && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus,
            napproveconfversioncode: this.props.Login.masterData
                && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode,
            ndesigntemplatemappingcode: this.props.Login.masterData
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
            FromDate : obj.fromDate,
            ToDate : obj.toDate,
            }
                masterData['kendoFilterList'] = undefined;
                const inputParam = {
                    masterData, inputData, searchSubSampleRef: this.searchSubSampleRef,
                    searchSampleRef: this.searchSampleRef,
                    searchTestRef: this.searchTestRef
                    //, selectedFilter
                }
                this.props.getRegistrationFilter(inputParam);
        // }
        // else{
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDFILTERALREADYLOADED" }));  
        // }
    }
    // Start of ALDP-4130 Additional filter on Click Event Handler - ATE-241
    onMultiFilterClick = () => {
        const filterFields = this.state.sampledisplayfields || [];
        const samplefilteritem = this.state.samplefilteritem || [];
        const languageTypeCode = this.props.Login.userInfo.slanguagetypecode;
        const datefileds = [];
        // const gridColumns = [];
        let updFilterFields = [];
        filterFields.map(item => {
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
            samplefilteritem.map(item => {
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
        updFilterFields.map(item => {
            fields.push(filterObject(item, languageTypeCode, null, null, true));
            if (item.filterinputtype === "date") {
                datefileds.push(item.columnname)
            }
        });
        const sampleList = this.props.Login.masterData.RegistrationGetSample || [];
        const kendoOptionList = sampleList.map(item => {

            datefileds.map(x => {
                item[x + "timestamp"] = toTimestamp(rearrangeDateFormatforKendoDataTool(this.props.Login.userInfo, item[x]))
            })

            return item;
        });

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                operation: "",
                openModal: true,
                masterData: {
                    ...this.props.Login.masterData, fields,
                    // gridColumns, 
                    kendoFilterList, kendoOptionList
                },
                multiFilterLoad: true,
                screenName: "IDS_ADDITIONALFILTER",
                skip: undefined
            }
        };
        this.props.updateStore(updateInfo);

    }
    // ALPD-4130 parent Call back function -ATE-241
    parentCallBack = (data, filter) => {
        this.setState({
            filterSampleList: data,
            kendoFilterList: filter
        });
    }

    //  AlPD-4130 Additional filter change handler  -ATE-241
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

    //  End of ALPD-4130 of Additional filter events handler

    openFilterName = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {  modalShow: true,operation:"create",modalTitle:this.props.intl.formatMessage({ id: "IDS_SAVEFILTER" })}
        }
        this.props.updateStore(updateInfo);
    }
   
    getActiveTestURL() {

        let url = "resultentrybysample/getTestbasedParameter"
        switch (this.props.Login.activeTestTab) {

            case "IDS_PARAMETERRESULTS":
                //url = "resultentrybysample/getTestbasedParameter";
                url = "registration/getregistrationparameter";
                break;
            case "IDS_TESTCOMMENTS":
                url = "comments/getTestComment";
                break;
            case "IDS_TESTATTACHMENTS":
                url = "attachment/getTestAttachment"
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
            // splitChangeWidthPercentage: d
        })
    }

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

    sideNavDetail = (screenName//, sampleGridSkip
    ) => {
        let testList = this.props.Login.masterData.RegistrationGetTest || [];
        let { testskip, testtake } = this.state
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.selectedTest, "ntransactiontestcode");
        let ntransactiontestcode = this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        return (
            screenName == "IDS_PARAMETERRESULTS"
                //&& this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE 
                ? <RegistrationResultTab
                    userInfo={this.props.Login.userInfo}
                    genericLabel={this.props.Login.genericLabel}
                    masterData={this.props.Login.masterData}
                    inputParam={this.props.Login.inputParam}
                    dataState={this.state.resultDataState}
                    dataStateChange={this.testDataStateChange}
                    screenName="IDS_PARAMETERRESULTS"
                    controlMap={this.state.controlMap}
                    userRoleControlRights={this.state.userRoleControlRights}
                />
                :
                screenName == "IDS_ATTACHMENTS" ?
                    <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS"} tabDetail={this.attachmentTabDetail()} destroyInactiveTabPane={true} onTabChange={this.onTabChange} />
                    : screenName == "IDS_COMMENTS" ?
                        <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_TESTCOMMENTS"} tabDetail={this.commentTabDetail()} destroyInactiveTabPane={true} onTabChange={this.onTabChange} />
                        : screenName == "IDS_HISTORY" ?
                            <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_TESTHISTORY"} tabDetail={this.historyTabDetail()} destroyInactiveTabPane={true} onTabChange={this.onTabChange} />
                            : screenName == "IDS_SAMPLEDETAILS" ?
                                this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.length === 1 ?
                                    <SampleInfoView
                                        data={(this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.length > 0) ?
                                            this.props.Login.masterData.selectedSample[this.props.Login.masterData.selectedSample.length - 1] : {}}
                                        SingleItem={this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample ?
                                            this.state.SingleItem : []}
                                        screenName="IDS_SAMPLEINFO"
                                        userInfo={this.props.Login.userInfo}
                                        viewFile={this.viewFile}

                                    />
                                    :
                                    <SampleGridTab
                                        userInfo={this.props.Login.masterData.userInfo || {}}
                                        GridData={this.props.Login.masterData.selectedSample || []}
                                        masterData={this.props.Login.masterData}
                                        inputParam={this.props.Login.inputParam}
                                        //dataState={sampleGridSkip === 0 ? {...this.state.sampleGridDataState, skip:0} : this.state.sampleGridDataState}
                                        dataState={this.state.sampleGridDataState}
                                        dataStateChange={this.sampleInfoDataStateChange}
                                        extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem) || []}
                                        detailedFieldList={this.gridfillingColumn(this.state.DynamicGridMoreField) || []}
                                        primaryKeyField={"npreregno"}
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

    requiredExternalOrderAttachment = [
        { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "200px" },
        { "idsName": "IDS_RELEASENO", "dataField": "sreleaseno", "width": "200px" },
        { "idsName": "IDS_VERSIONNO", "dataField": "nversionno", "width": "200px" },
        { "idsName": "IDS_EXTERNALORDERID", "dataField": "sexternalorderid", "width": "200px" },
        { "idsName": "IDS_REPORTEDSITE", "dataField": "ssitename", "width": "200px" },
        { "idsName": "IDS_REPORTEDDATE", "dataField": "sreleasedate", "width": "200px" },
        { "idsName": "IDS_REPORTEDUSER", "dataField": "susername", "width": "200px" }
    ];

    requiredOutsourceDetails = [
        { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "200px" },
        { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "200px" },
        { "idsName": "IDS_SAMPLEID", "dataField": "ssampleid", "width": "200px" },
        { "idsName": "IDS_TOSITE", "dataField": "ssourcesitename", "width": "200px" },
        { "idsName": "IDS_TESTSYNONYM", "dataField": "stestsynonym", "width": "200px" },
        { "idsName": "IDS_OUTSOURCEDATE", "dataField": "soutsourcedate", "width": "200px" },
        { "idsName": "IDS_REMARKS", "dataField": "sremarks", "width": "200px" },
        { "idsName": "IDS_SHIPMENTTRACKING", "dataField": "sshipmenttracking", "width": "200px" }
    ];

    attachmentTabDetail = () => {
        const attachmentTabMap = new Map();
        let testList = this.props.Login.masterData.RegistrationGetTest || [];
        let { testskip, testtake, subsampleskip, subsampletake, skip, take } = this.state
        testList = testList.slice(testskip, testskip + testtake);
        let subsampleList = this.props.Login.masterData.RegistrationGetSubSample || [];
        subsampleList = subsampleList.slice(subsampleskip, subsampleskip + subsampletake);
        let sampleList = this.props.Login.masterData.RegistrationGetSample || [];
        sampleList = sampleList.slice(skip, skip + take);

        attachmentTabMap.set("IDS_TESTATTACHMENTS", <Attachments
            screenName="IDS_TESTATTACHMENTS"
            tabSequence={SideBarSeqno.TEST}
            selectedMaster="selectedTest"
            onSaveClick={this.onAttachmentSaveClick}
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            masterList={getSameRecordFromTwoArrays(testList || [], this.props.Login.masterData.selectedTest, "ntransactiontestcode")}
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
            //added by neeraj for ALPD-1311
            nsubsampleneed={this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample}
            userInfo={this.props.Login.userInfo}
            deleteParam={
                {
                    methodUrl: "TestAttachment",
                    ntransactiontestcode: this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    esignRights: this.props.Login.userRoleControlRights,
                    screenName: "IDS_TESTATTACHMENTS"

                }
            }
            editParam={{
                methodUrl: "TestAttachment",
                ntransactiontestcode: this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
                userInfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData,
                esignRights: this.props.Login.userRoleControlRights,
                screenName: "IDS_TESTATTACHMENTS",
                masterList: this.props.Login.masterData.selectedTest
            }}
            selectedListName="IDS_TESTS"
            displayName="stestsynonym"
            isneedHeader={true}
        />)
        this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample &&
            attachmentTabMap.set("IDS_SUBSAMPLEATTACHMENTS", <Attachments
                screenName="IDS_SUBSAMPLEATTACHMENTS"
                tabSequence={SideBarSeqno.SUBSAMPLE}
                onSaveClick={this.onAttachmentSaveClick}
                selectedMaster="selectedSubSample"
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                attachments={this.props.Login.masterData.RegistrationSampleAttachment || []}
                deleteRecord={this.props.deleteAttachment}
                masterList={getSameRecordFromTwoArrays(subsampleList || [], this.props.Login.masterData.selectedSubSample, "ntransactionsamplecode")}
                masterAlertStatus={"IDS_SELECTSUBSAMPLETOADDATTACHMENT"}
                fetchRecord={this.props.getAttachmentCombo}
                viewFile={this.props.viewAttachment}
                addName={"AddSubSampleAttachment"}
                editName={"EditSubSampleAttachment"}
                deleteName={"DeleteSubSampleAttachment"}
                viewName={"ViewSubSampleAttachment"}
                methodUrl={"SubSampleAttachment"}
                skip={this.props.Login.inputParam ? this.props.Login.inputParam.attachmentskip || 0 : 0}
                take={this.props.Login.inputParam ? this.props.Login.inputParam.attachmenttake || 10 : this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5}
                userInfo={this.props.Login.userInfo}
                deleteParam={
                    {
                        methodUrl: "SubSampleAttachment",
                        ntransactionsamplecode:
                            this.props.Login.masterData.selectedSubSample ? this.props.Login.masterData.selectedSubSample.map(sample => sample.ntransactionsamplecode).join(",") : '-1',
                        userInfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        esignRights: this.props.Login.userRoleControlRights
                    }
                }
                editParam={{
                    methodUrl: "SubSampleAttachment",
                    ntransactionsamplecode: this.props.Login.masterData.selectedSubSample ? this.props.Login.masterData.selectedSubSample.map(sample => sample.ntransactionsamplecode).join(",") : '-1',
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    esignRights: this.props.Login.userRoleControlRights,
                    masterList: this.props.Login.masterData.RegistrationGetSubSample || []

                }}
                selectedListName="IDS_SUBSAMPLE"
                displayName="ssamplearno"
                isneedHeader={true}
            />)
        attachmentTabMap.set("IDS_SAMPLEATTACHMENTS",
            <Attachments
                screenName="IDS_SAMPLEATTACHMENTS"
                tabSequence={SideBarSeqno.SAMPLE}
                onSaveClick={this.onAttachmentSaveClick}
                selectedMaster="selectedSample"
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                attachments={this.props.Login.masterData.RegistrationAttachment || []}
                deleteRecord={this.props.deleteAttachment}
                masterList={getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedSample, "npreregno")}
                masterAlertStatus={"IDS_SELECTSAMPLETOADDATTACHMENT"}
                fetchRecord={this.props.getAttachmentCombo}
                viewFile={this.props.viewAttachment}
                addName={"AddSampleAttachment"}
                editName={"EditSampleAttachment"}
                deleteName={"DeleteSampleAttachment"}
                viewName={"ViewSampleAttachment"}
                methodUrl={"SampleAttachment"}
                userInfo={this.props.Login.userInfo}
                skip={this.props.Login.inputParam ? this.props.Login.inputParam.attachmentskip || 0 : 0}
                take={this.props.Login.inputParam ? this.props.Login.inputParam.attachmenttake || 10 : this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5}
                deleteParam={
                    {
                        methodUrl: "SampleAttachment",
                        npreregno: this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",") : "-1",
                        userInfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        esignRights: this.props.Login.userRoleControlRights
                    }
                }
                editParam={{
                    methodUrl: "SampleAttachment",
                    npreregno: this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",") : "-1",
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    esignRights: this.props.Login.userRoleControlRights,
                    masterList: this.props.Login.masterData.RegistrationGetSample || []

                }}
                selectedListName="IDS_SAMPLE"
                displayName="sarno"
                isneedHeader={true}
            />)
        return attachmentTabMap;
    }

    commentTabDetail = () => {
        const commentTabMap = new Map();
        let testList = this.props.Login.masterData.RegistrationGetTest || [];
        let { testskip, testtake } = this.state
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.selectedTest, "ntransactiontestcode");
        let ntransactiontestcode = this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        let sampleList = this.props.Login.masterData.RegistrationGetSample || [];
        let npreregno = this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",") : "-1";
        let { skip, take } = this.state
        sampleList = sampleList.slice(skip, skip + take);
        let selectedSampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.selectedSample, "npreregno");
        let ntransactionsamplecode = this.props.Login.masterData.selectedSubSample ?
            this.props.Login.masterData.selectedSubSample.map(sample => sample.ntransactionsamplecode).join(",") : "-1";
        let subsampleList = this.props.Login.masterData.RegistrationGetSubSample || [];
        let { subsampleskip, subsampletake } = this.state
        subsampleList = subsampleList.slice(subsampleskip, subsampleskip + subsampletake);
        let selectedSubSampleList = getSameRecordFromTwoArrays(subsampleList, this.props.Login.masterData.selectedSubSample, "ntransactionsamplecode");


        commentTabMap.set("IDS_TESTCOMMENTS", <Comments
            screenName="IDS_TESTCOMMENTS"
            masterData={this.props.Login.masterData}
            tabSequence={SideBarSeqno.TEST}
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
            masterList={getSameRecordFromTwoArrays(testList, this.props.Login.masterData.selectedTest, "ntransactiontestcode")}
            masterAlertStatus="IDS_SELECTTESTTOADDCOMMENTS"
            primaryKeyField={"ntestcommentcode"}
            dataState={this.state.testCommentDataState}
            dataStateChange={this.testDataStateChange}
            deleteParam={
                {
                    methodUrl: "TestComment",
                    ntransactiontestcode: this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    esignRights: this.props.Login.userRoleControlRights,
                    screenName: "IDS_TESTCOMMENTS"

                }
            }
            editParam={{
                methodUrl: "TestComment",
                ntransactiontestcode: this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
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
            selectedId={this.props.Login.selectedId || null}
        />)
        this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample &&
            commentTabMap.set("IDS_SUBSAMPLECOMMENTS", <Comments
                screenName="IDS_SUBSAMPLECOMMENTS"
                masterData={this.props.Login.masterData}
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
                    masterList: this.props.Login.masterData.RegistrationGetSubSample || [],
                    ncontrolCode: this.state.controlMap.has("EditSubSampleComment") && this.state.controlMap.get("EditSubSampleComment").ncontrolcode
                }}
                selectedListName="IDS_SUBSAMPLES"
                displayName="ssamplearno"
                selectedId={this.props.Login.selectedId || null}
            />)
        commentTabMap.set("IDS_SAMPLECOMMENTS", <Comments
            screenName="IDS_SAMPLECOMMENTS"
            masterData={this.props.Login.masterData}
            tabSequence={SideBarSeqno.SAMPLE}
            onSaveClick={this.onCommentsSaveClick}
            selectedMaster="selectedSample"
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            Comments={this.props.Login.masterData.RegistrationComment || []}
            fetchRecord={this.props.getCommentsCombo}
            addName={"AddSampleComment"}
            editName={"EditSampleComment"}
            deleteName={"DeleteSampleComment"}
            methodUrl={"SampleComment"}
            isTestComment={false}
            masterList={selectedSampleList}
            masterAlertStatus="IDS_SELECTSAMPLETOADDCOMMENTS"
            primaryKeyField={"nregcommentcode"}
            dataState={this.state.sampleCommentDataState}
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
                masterList: this.props.Login.masterData.RegistrationGetSample || [],
                ncontrolCode: this.state.controlMap.has("EditSampleComment") && this.state.controlMap.get("EditSampleComment").ncontrolcode
            }}
            selectedListName="IDS_SAMPLES"
            displayName="sarno"
            selectedId={this.props.Login.selectedId || null}
        />)

        return commentTabMap;
    }

    historyTabDetail = () => {
        const historyTabMap = new Map();
        let historyExtractedColumnList = [];

        // if(this.props.Login.screenName === "IDS_TESTHISTORY"){
        // historyExtractedColumnList.push(
        //     { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "150px" },
        //     { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "200px" },
        //     { "idsName": "IDS_TESTSYNONYM", "dataField": "stestsynonym", "width": "200px" }
        // );

        historyExtractedColumnList.push({ "idsName": "IDS_ARNO", "dataField": "sarno", "width": "150px" });

        this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample &&
            historyExtractedColumnList.push({ "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "200px" });

        historyExtractedColumnList.push({ "idsName": "IDS_TESTSYNONYM", "dataField": "stestsynonym", "width": "200px" },
            { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "200px" },
            { "idsName": "IDS_TRANSACTIONDATE", "dataField": "stransactiondate", "width": "200px" },
            { "idsName": "IDS_USER", "dataField": "susername", "width": "200px" },
            { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" }
        );
        // } else if(this.props.Login.screenName === "IDS_SUBSAMPLEHISTORY"){
        //     historyExtractedColumnList.push(
        //         { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "150px" },
        //         { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "200px" }
        //     );
        // } else if(this.props.Login.screenName === "IDS_SAMPLEHISTORY"){
        //     historyExtractedColumnList.push(
        //         { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "150px" }
        //     );
        // }

        historyTabMap.set("IDS_TESTHISTORY", <DataGrid
            primaryKeyField={"ntesthistorycode"}
            data={this.props.Login.masterData.RegistrationTestHistory}
            dataResult={process(this.props.Login.masterData.RegistrationTestHistory || [], this.state.registrationTestHistoryDataState)}
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
        />
        )
        return historyTabMap;
    }

    outSourceTabDetail = () => {
        const outSourceTabMap = new Map();
        outSourceTabMap.set("IDS_OUTSOURCEDETAILS", <DataGrid
            primaryKeyField="noutsourcedetailcode"
            screenName="IDS_OUTSOURCEDETAILS"
            tabSequence={SideBarSeqno.SUBSAMPLE}
            data={this.props.Login.masterData.OutsourceDetailsList || []}
            dataResult={process(this.props.Login.masterData.OutsourceDetailsList && this.props.Login.masterData.OutsourceDetailsList || [], this.state.outsourceDetailsDataState)}
            dataState={this.state.outsourceDetailsDataState}
            isExportExcelRequired={false}
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            extractedColumnList={this.requiredOutsourceDetails}
            pageable={true}
            dataStateChange={this.outsourceDataStateChange}
            scrollable={'scrollable'}
            gridHeight={'350px'}
            isActionRequired={false}
            selectedId={null}
        />
        )
        outSourceTabMap.set("IDS_EXTERNALORDERREPORTS", <DataGrid
            primaryKeyField="nreleaseoutsourceattachcode"
            screenName="IDS_EXTERNALORDERREPORTS"
            tabSequence={SideBarSeqno.SAMPLE}
            data={this.props.Login.masterData.ExternalOrderAttachmentList || []}
            dataResult={process(this.props.Login.masterData.ExternalOrderAttachmentList && this.props.Login.masterData.ExternalOrderAttachmentList || [], this.state.externalOrderAttachmentDataState)}
            dataState={this.state.externalOrderAttachmentDataState}
            isExportExcelRequired={false}
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            extractedColumnList={this.requiredExternalOrderAttachment}
            selectedId={null}
            pageable={true}
            dataStateChange={this.outsourceDataStateChange}
            scrollable={'scrollable'}
            gridHeight={'350px'}
            isActionRequired={true}
            methodUrl={'ExternalOrderAttachment'}
            viewDownloadFile={this.viewExternalOrderAttachmentFile}
        />)
        return outSourceTabMap;
    }

    onTabChange = (tabProps) => {
        const activeTestTab = tabProps.screenName;
        const tabseqno = tabProps.tabSequence;
        if (tabseqno === SideBarSeqno.TEST) {
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
                activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex,
                activeTabId: tabProps.activeTabId ? tabProps.activeTabId : this.state.activeTabId,
                registrationTestHistoryDataState: this.state.registrationTestHistoryDataState
            }
            this.props.getTestChildTabDetailRegistration(inputData, true)
            // } 
            // else {
            //     toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))
            // }
        }
        else if (tabseqno === SideBarSeqno.SUBSAMPLE) {
            if (activeTestTab !== this.props.Login.activeTestTab) {
                let inputData = {
                    masterData: this.props.Login.masterData,
                    selectedSubSample: this.props.Login.masterData.selectedSubSample,
                    ntransactionsamplecode: this.props.Login.masterData.selectedSubSample ? this.props.Login.masterData.selectedSubSample.map(item => item.ntransactionsamplecode).join(",") : "-1",
                    userinfo: this.props.Login.userInfo,
                    screenName: activeTestTab,
                    activeSubSampleTab: activeTestTab,
                    subSampleCommentDataState: this.state.subSampleCommentDataState,
                    subSampleAttachmentDataState: this.state.subSampleAttachmentDataState,
                    npreregno: this.props.Login.masterData.selectedSample &&
                        this.props.Login.masterData.selectedSample.map(item => item.npreregno).join(","),
                    activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex,
                }
                this.props.getSubSampleChildTabDetail(inputData)
            }
        }
        else {

            if (activeTestTab !== this.props.Login.activeTestTab) {
                let inputData = {
                    masterData: this.props.Login.masterData,
                    selectedSample: this.props.Login.masterData.selectedSample,
                    npreregno: this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(item => item.npreregno).join(",") : "-1",
                    userinfo: this.props.Login.userInfo,
                    screenName: activeTestTab,
                    activeSampleTab: activeTestTab,
                    OrderCodeData: this.props.Login.masterData.selectedSample &&
                        this.props.Login.masterData.selectedSample.map(item => item.hasOwnProperty("OrderCodeData") ? item.OrderCodeData : -1).join(","),
                    activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex,
                }
                this.props.getSampleChildTabDetail(inputData)
            }
        }
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
        if (status !== "click") {
            if (index === SideBarTabIndex.RESULT) {
                const tabProps = {
                    tabSequence: SideBarSeqno.TEST,
                    screenName: "IDS_PARAMETERRESULTS",
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
                    screenName: "IDS_TESTHISTORY",
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

    onOrderSearch = (orderValue) => {
        let selectedRecord = this.state.selectedRecord;
        if (selectedRecord.nexternalordertypecode) {
            const inputData = {
                sexternalorderid: orderValue,
                userinfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData,
                selectedRecord: selectedRecord
            }
            this.props.getOrderDetails(inputData);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEXTERNALORDERTYPE" }));
        }
    }

    headerSelectionChange = (event) => {

        const checked = event.syntheticEvent.target.checked;
        let orderList = this.state.sectedRecord.orders || [];
        let selectedRecord = this.state.sectedRecord
        let addedOrderSampleList = [];

        if (checked) {

            const data = event.target.props.data.map(item => {
                if (orderList.findIndex(x => x.nexternalordersamplecode === item.nexternalordersamplecode) === -1) {
                    orderList.push({ ...item, selected: false });
                    item.selected = checked;
                    let newItem = JSON.parse(JSON.stringify(item));
                    delete newItem['selected']
                    // newItem["jsondata"]={};
                    // newItem["jsonuidata"]={};
                    // newItem["jsondata"]['orderList'] = item
                    // newItem["jsonuidata"]['orderList'] = item    
                    addedOrderSampleList.push(newItem);
                    return item;
                } else {
                    let olditem = JSON.parse(JSON.stringify(orderList[orderList.findIndex(x => x.nexternalordersamplecode === item.nexternalordersamplecode)]))
                    olditem.selected = checked;
                    let newItem = JSON.parse(JSON.stringify(olditem));
                    newItem.selected = false;
                    // newItem["jsondata"]={};
                    // newItem["jsonuidata"]={};
                    // newItem["jsondata"]['orderList'] = olditem
                    // newItem["jsonuidata"]['orderList'] = olditem
                    addedOrderSampleList.push(newItem);
                    return olditem;

                }

            });
            selectedRecord['orders'] = data
            this.setState({
                selectedRecord,
                addedOrderSampleList: addedOrderSampleList,
                orderList,
                addSelectAll: checked,
                deleteSelectAll: false
            });

        }
        else {

            let orderListData = this.state.orders || [];
            let deletedListdData = this.state.orders || [];

            const data = this.state.orders.map(item => {
                orderListData = orderListData.filter(item1 => item1.nexternalordersamplecode !== item.nexternalordersamplecode);
                deletedListdData = deletedListdData.filter(item1 => item1.nexternalordersamplecode !== item.nexternalordersamplecode);
                item.selected = checked;
                return item;
            });


            this.setState({
                samples: data,
                addedOrderSampleList: orderListData,
                deletedList: deletedListdData,
                addSelectAll: checked,
                deleteSelectAll: false
            });
        }
    }

    selectionChange = (event) => {
        let addedOrderSampleList = this.state.addedOrderSampleList || [];
        let orders = this.state.selectedRecord.orders || [];
        let selectedRecord = { ...this.state.selectedRecord }

        const orderList = this.state.selectedRecord.orders.map(item => {
            if (item.nexternalordersamplecode === event.dataItem.nexternalordersamplecode) {
                item.selected = !event.dataItem.selected;
                if (item.selected) {
                    const newItem = JSON.parse(JSON.stringify(item));
                    //newItem.selected = false;
                    delete newItem['selected']
                    // newItem["jsondata"]={};
                    // newItem["jsonuidata"]={};
                    // newItem["jsondata"]['orderList'] = item
                    // newItem["jsonuidata"]['orderList'] = item
                    addedOrderSampleList.push(newItem);
                }
                else {
                    addedOrderSampleList = addedOrderSampleList.filter(item1 => item1.nexternalordersamplecode !== item.nexternalordersamplecode)
                }
            }
            return item;
        });

        selectedRecord['orders'] = orders;

        this.setState({
            orderList,
            addedOrderSampleList,
            selectedRecord,
            initialList: addedOrderSampleList,
            addSelectAll: this.valiateCheckAll(orderList),
            deleteSelectAll: this.valiateCheckAll(orderList)
        });
    }


    valiateCheckAll(data) {
        let selectAll = true;
        // let checkRepeatComponent;
        //  let addedComponentList = this.state.addedComponentList || [];
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

    render() {
        //console.log("Registration:", this.props.Login);
        this.fromDate = this.state.selectedFilter["fromdate"] !== "" && this.state.selectedFilter["fromdate"] !== undefined ? this.state.selectedFilter["fromdate"] : this.props.Login.masterData.FromDate;
        this.toDate = this.state.selectedFilter["todate"] !== "" && this.state.selectedFilter["todate"] !== undefined ? this.state.selectedFilter["todate"] : this.props.Login.masterData.ToDate;
        let sampleList = this.props.Login.masterData.RegistrationGetSample ? this.props.Login.regSampleExisted ? sortDataForDate(this.props.Login.masterData.RegistrationGetSample, 'dtransactiondate', 'npreregno') :
            sortDataForDate(this.props.Login.masterData.RegistrationGetSample, 'dtransactiondate', 'npreregno') : [];
        let subSampleList = this.props.Login.masterData.RegistrationGetSubSample ? this.props.Login.masterData.RegistrationGetSubSample : [];
        let testList = this.props.Login.masterData.RegistrationGetTest ? this.props.Login.masterData.RegistrationGetTest : []; //

        const sendToStore = this.state.controlMap.has("Sample SendToStore") && this.state.controlMap.get("Sample SendToStore").ncontrolcode;
        const mandatoryFieldsFilter = [{ "mandatory": true, "idsName": "IDS_FILTERNAME", "dataField": "sfiltername", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]

        const testDesign = <ContentPanel>
            <Card>
                <Card.Header style={{ borderBottom: "0px" }}>
                    <span style={{ display: "inline-block" }}>
                        <h4 className="card-title">{this.props.intl.formatMessage({ id: "IDS_TEST" })}</h4>
                    </span>
                    {/* <button className="btn btn-primary btn-padd-custom" style={{ float: "right" }}
                        onClick={() => this.showSample()}
                    >
                        <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>{"  "}
                        {this.props.intl.formatMessage({ id: "IDS_SAMPLE" })}
                    </button> */}

                </Card.Header>
                <Card.Body className='p-0 sm-pager' >
                    <TransactionListMasterJsonView
                        cardHead={94}
                        clickIconGroup={true}
                        // paneHeight={this.state.initialVerticalWidth}
                        masterList={this.props.Login.masterData.searchedTest || testList}
                        selectedMaster={this.props.Login.masterData.selectedTest}
                        primaryKeyField="ntransactiontestcode"
                        getMasterDetail={(event, status) => { this.props.getTestChildTabDetailRegistration(event, status); this.changePropertyView(1, event, "click") }}
                        inputParam={{
                            ...this.state.testChildGetParam, resultDataState: this.state.resultDataState,
                            testCommentDataState: this.state.testCommentDataState,
                            testAttachmentDataState: this.state.testAttachmentDataState,
                            registrationTestHistoryDataState: this.state.registrationTestHistoryDataState,
                            // activeTabIndex: this.state.enableAutoClick ? 1 : this.state.activeTabIndex ? this.state.activeTabIndex : undefined,
                            // activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ?
                            //     this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE ? 1 : 0 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ?
                            //         this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE ? 1 : 0 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
                            activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 0 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 0 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
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
                        // needMultiValueFilter={true}
                        filterColumnData={this.props.filterTransactionList}
                        searchListName="searchedTest"
                        searchRef={this.searchTestRef}
                        filterParam={this.state.filterTestParam}
                        selectionField="ntransactionstatus"
                        selectionFieldName="stransdisplaystatus"
                        // childTabsKey={["RegistrationTestComment"]}
                        childTabsKey={["RegistrationParameter", "RegistrationTestComment", "RegistrationTestAttachment", "ApprovalParameter", "RegistrationTestHistory"]}
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
                        // actionIcons={
                        //     [
                        //         {
                        //             title: this.props.intl.formatMessage({ id: "IDS_OUTSOURCE" }),
                        //             controlname: "faOutsource",
                        //             hidden: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.noutsourcerequired === transactionStatus.YES ? false : true,
                        //             // hidden:this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE? false :true,
                        //             // hidden: this.state.userRoleControlRights.indexOf(openELNSheet) === -1, 
                        //             onClick: this.outsourceTest, objectName: "test",
                        //             inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }
                        //         },
                        //     ]}
						actionIcons={[
                            {
                                title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                controlname: "faPencilAlt",
                                objectName: "mastertoedit",
                                hidden: this.state.userRoleControlRights.indexOf(this.state.editTestMethodId) === -1,
                                onClick: this.editTestMethod,
                                inputData: {
                                    primaryKeyName: "ntransactiontestcode",
                                    operation: "update",
                                    masterData: this.props.Login.masterData,
                                    userInfo: this.props.Login.userInfo,
                                    ncontrolCode: this.state.editTestMethodId
                                    
                                },
                            }]
                        }
                        commonActions={
                            <>
                                {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                <ProductList className="d-flex justify-content-end icon-group-wrap">
                                    {/* <ReactTooltip place="bottom" /> */}
                                    <Nav.Link name="addtest" className="btn btn-circle outline-grey ml-2"
                                        //title={"Add Test"}
                                        //data-for="tooltip-common-wrap"
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
                onSecondaryPaneSizeChange={this.paneSizeChange}
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
                            // paneHeight={this.state.initialVerticalWidth}
                            // splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}

                            clickIconGroup={true}
                            masterList={this.props.Login.masterData.searchedSubSample || subSampleList}
                            selectedMaster={this.props.Login.masterData.selectedSubSample}
                            primaryKeyField="ntransactionsamplecode"
                            getMasterDetail={(event, status) => {
                                this.props.getRegistrationTestDetail(event, status);
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
                            mainField="ssamplearno"
                            selectedListName="selectedSubSample"
                            objectName="subsample"
                            listName="IDS_SUBSAMPLE"
                            // jsonField={'jsondata'}
                            //jsonDesignFields={true}
                            needValidation={true}
                            validationKey="napprovalversioncode"
                            validationFailMsg="IDS_SELECTSAMPLESOFSAMPLEAPPROVALVERSION"
                            subFields={this.state.DynamicSubSampleColumns}
                            skip={this.state.subsampleskip}
                            take={this.state.subsampletake}
                            pageSize={this.props.Login.settings && this.props.Login.settings[13].split(",").map(setting => parseInt(setting))}                           
                            selectionField="ntransactionstatus"
                            selectionFieldName="stransdisplaystatus"
                            needMultiSelect={true}
                            selectionColorField="scolorhexcode"
                            subFieldsLabel={false}
                            subFieldsFile={true}
                            handlePageChange={this.handleSubSamplePageChange}
                            // viewFile={this.viewFile}
                            selectionList={this.props.Login.masterData.RealFilterStatusValue
                                && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                            childTabsKey={[
                                // "RegistrationAttachment",
                                "RegistrationGetTest", "RegistrationSampleComment", "RegistrationSampleAttachment", "OutsourceDetailsList", "RegistrationParameter", "RegistrationTestAttachment", "RegistrationTestComment"]}
                            actionIcons={
                                this.props.Login.masterData && this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample === true ?
                                    [
                                        {
                                            title: this.props.intl.formatMessage({ id: "IDS_SENDTOSTORE" }),
                                            controlname: "faArrowRight",
                                            objectName: "mastersendtostore",
                                            hidden: this.state.userRoleControlRights.indexOf(sendToStore) === -1,
                                            onClick: this.sendToStore,
                                            inputData: {
                                                masterData: this.props.Login.masterData,
                                                userInfo: this.props.Login.userInfo,
                                                ncontrolCode: sendToStore,
                                                subSampleRegParam: { ...this.state.editSubSampleRegParam }
                                            },
                                        },
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
                                                searchTestRef:this.searchTestRef,
                                                editSubSampleRegParam: { ...this.state.editSubSampleRegParam, ncontrolCode: this.state.editSubSampleId }
                                            },
                                        },
                                        {
                                            //ALPD-3615
                                            title: this.props.intl.formatMessage({ id: "IDS_ADHOCTEST" }),
                                            controlname: "adhoctest",
                                            objectName: "sampleadhoctest",
                                            hidden: this.state.userRoleControlRights.indexOf(this.state.adhocTestId) === -1,
                                            //onClick: this.props.getPrinterComboService,
                                            onClick: this.addAdhocTest,
                                            inputData: ({
                                                ...this.state.addTestParam,
                                                primaryKeyName: "ntransactionsamplecode",
                                                ncontrolcode: this.state.adhocTestId,
                                                masterData: this.props.Login.masterData,
                                                userInfo: this.props.Login.userInfo,
                                                editRegParam: {
                                                    ...this.state.editSubSampleRegParam,
                                                    ncontrolCode: this.state.adhocTestId
                                                }
                                            }),
                                        },
                                        {
                                            title: this.props.intl.formatMessage({ id: "IDS_OUTSOURCE" }),
                                            controlname: "faOutsource",
                                            hidden: ((this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.noutsourcerequired === transactionStatus.NO ? false : true) && (this.state.userRoleControlRights.indexOf(this.state.outsourceId) === -1)),
                                            // hidden:this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE? false :true,
                                            // hidden: this.state.userRoleControlRights.indexOf(openELNSheet) === -1, 
                                            onClick: this.outsourceSample, objectName: "test",
                                            inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }
                                        },

                                        {
                                            title: this.props.intl.formatMessage({ id: "IDS_ORDERMAPPING" }),
                                            controlname: "mapping",
                                            objectName: "subSample",
                                            hidden: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE ? true : false,//this.state.userRoleControlRights.indexOf(this.state.printBarcodeId) === -1,
                                            //onClick: this.props.getPrinterComboService,
                                            onClick: this.orderMapping,
                                            inputData: {
                                                primaryKeyName: "ntransactionsamplecode",
                                                operation: "prints",
                                                // ncontrolcode: this.state.printBarcodeId,
                                                masterData: this.props.Login.masterData,
                                                userInfo: this.props.Login.userInfo,
                                                // editRegParam: {
                                                //     ...this.state.editRegParam,
                                                //     ncontrolCode: this.state.printBarcodeId
                                                // }
                                            },
                                        },
                                        {
                                            // Control will be shown for all type of sites 
                                            title: this.props.intl.formatMessage({ id: "IDS_GENERATEBARCODE" }),
                                            controlname: "faBarcode",
                                            hidden:
                                                (this.props.Login.masterData.RealSampleTypeValue &&
                                                    this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE ?
                                                    // (this.props.Login.userInfo.nisstandaloneserver === transactionStatus.NO && 
                                                    // this.props.Login.userInfo.nissyncserver === transactionStatus.NO)
                                                    // ? 
                                                    this.state.userRoleControlRights.indexOf(this.state.generateBarcodeId) === -1 : true
                                                    // : true
                                                ),
                                            onClick: this.generateBarcode,
                                            objectName: "test",
                                            inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }
                                        }


                                    ]
                                    :
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
                                                searchTestRef:this.searchTestRef,
                                                editSubSampleRegParam: { ...this.state.editSubSampleRegParam, ncontrolCode: this.state.editSubSampleId }
                                            },
                                        },
                                        {
                                            title: this.props.intl.formatMessage({ id: "IDS_ORDERMAPPING" }),
                                            controlname: "mapping",
                                            objectName: "subSample",
                                            hidden: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE ? true : false,//this.state.userRoleControlRights.indexOf(this.state.printBarcodeId) === -1,
                                            //onClick: this.props.getPrinterComboService,
                                            onClick: this.orderMapping,
                                            inputData: {
                                                primaryKeyName: "ntransactionsamplecode",
                                                operation: "prints",
                                                // ncontrolcode: this.state.printBarcodeId,
                                                masterData: this.props.Login.masterData,
                                                userInfo: this.props.Login.userInfo,
                                                // editRegParam: {
                                                //     ...this.state.editRegParam,
                                                //     ncontrolCode: this.state.printBarcodeId
                                                // }
                                            },
                                        },


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
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_ADDSUBSAMPLE" })}
                                            hidden={this.state.userRoleControlRights.indexOf(this.state.addSubSampleId) === -1}
                                            // onClick={() => this.addSubSample(this.state.addSubSampleId, this.state.subsampleskip, this.state.subsampletake)}
                                            onClick={() => this.addSubSample(this.state.addSubSampleId, this.state.skip, this.state.take)}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </Nav.Link>
                                        <Nav.Link
                                            className="btn btn-circle outline-grey ml-2"
                                            //title={"Cancel/Reject Test"}
                                            //data-for="tooltip-common-wrap"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_CANCELREJECTSUBSAMPLE" })}
                                            hidden={this.state.userRoleControlRights.indexOf(this.state.cancelSubSampleId) === -1}
                                            onClick={() => this.cancelSubSampleRecord(this.state.cancelSubSampleId, this.state.subsampleskip, this.state.subsampletake)}>
                                            <Reject className="custom_icons" width="15" height="15" />
                                        </Nav.Link>

                                        <Button className="btn btn-circle outline-grey ml-2" variant="link"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_PRINTBARCODE" })}
                                            //  data-for="tooltip-common-wrap"
                                            hidden={this.state.userRoleControlRights.indexOf(this.state.subSampleBarcodeId) === -1}
                                            // onClick={() => this.getGoodsInPrinterComboService("Registration", "create", "npreregno",
                                            //     this.props.Login.masterData, this.props.Login.userInfo, this.state.preRegisterId)}>
                                            onClick={() => this.props.getBarcodeAndPrinterService({
                                                masterData: this.props.Login.masterData,
                                                ncontrolcode: this.state.subSampleBarcodeId,
                                                userInfo: this.props.Login.userInfo,
                                                control: "subSampleBarcode"
                                            })}>

                                            {/* onClick={() => this.props.openBarcodeModal(
                                                this.props.Login.masterData.selectedSubSample,
                                                this.state.subSampleBarcodeId,
                                                this.props.Login.userInfo, true,
                                                "subSampleBarcode"
                                            )} */}
                                            <FontAwesomeIcon icon={faPrint} />
                                        </Button>
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



        this.confirmMessage = new ConfirmMessage();

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
                inputListName: "selectedSubSample",
                updatedListname: "RegistrationGetSubSample",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            },
            {
                filteredListName: "searchedTest",
                updatedListname: "RegistrationGetTest",
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
                inputListName: "selectedTest",
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
                                                selectedMaster={this.props.Login.masterData.selectedSample}
                                                primaryKeyField="npreregno"
                                                filterColumnData={this.props.filterTransactionList}
                                                // getMasterDetail={(event, status) => { this.props.getRegistrationsubSampleDetail(event, status); this.changePropertyView(4, event, status) }}
                                                getMasterDetail={this.props.getRegistrationsubSampleDetail}
                                                inputParam={{
                                                    ...this.state.subSampleGetParam,
                                                    searchTestRef: this.searchTestRef,
                                                    searchSubSampleRef: this.searchSubSampleRef,
                                                    testskip: this.state.testskip,
                                                    subsampleskip: this.state.subsampleskip,
                                                    resultDataState: this.state.resultDataState,
                                                    activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 4 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 4 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
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
                                                needMultiValueFilter={true}
                                                clearAllFilter={this.onReload}
                                                onMultiFilterClick={this.onMultiFilterClick}
                                                // jsonField={'jsondata'}
                                                //jsonDesignFields={true}
                                                needMultiSelect={true}
                                                showStatusBlink={true}
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
                                                childTabsKey={["RegistrationAttachment", "RegistrationGetSubSample",
                                                    "RegistrationGetTest", "RegistrationSampleComment", "RegistrationSampleAttachment", "selectedSubSample", "selectedTest",
                                                    "RegistrationComment", "ExternalOrderAttachmentList", "OutsourceDetailsList", "RegistrationParameter", "RegistrationTestAttachment",
                                                    "RegistrationTestComment"]} //, "RegistrationParameter""RegistrationTestComment"
                                                actionIcons={
                                                    this.props.Login.masterData && this.props.Login.masterData.RegSubTypeValue
                                                        && this.props.Login.masterData.RegSubTypeValue.nneedsubsample === false ?
                                                        [
                                                            {
                                                                title: this.props.intl.formatMessage({ id: "IDS_SENDTOSTORE" }),
                                                                controlname: "faArrowRight",
                                                                objectName: "mastersendtostore",
                                                                hidden: this.state.userRoleControlRights.indexOf(sendToStore) === -1,
                                                                onClick: this.sendToStore,
                                                                inputData: {
                                                                    masterData: this.props.Login.masterData,
                                                                    userInfo: this.props.Login.userInfo,
                                                                    ncontrolCode: sendToStore,
                                                                    mainSampleRegParam: { ...this.state.editRegParam }
                                                                },
                                                            },
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
                                                                        ncontrolCode: this.state.editSampleId,
                                                                        nneedsubsample: this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample //=== true ? transactionStatus.YES:transactionStatus.NO
                                                                    }
                                                                },
                                                            },
                                                            {
                                                                //ALPD-3615
                                                                title: this.props.intl.formatMessage({ id: "IDS_ADHOCTEST" }),
                                                                controlname: "adhoctest",
                                                                objectName: "sampleadhoctest",
                                                                hidden: this.state.userRoleControlRights.indexOf(this.state.adhocTestId) === -1,
                                                                //onClick: this.props.getPrinterComboService,
                                                                onClick: this.addAdhocTest,
                                                                inputData: ({
                                                                    ...this.state.addTestParam,
                                                                    primaryKeyName: "npreregno",
                                                                    ncontrolcode: this.state.adhocTestId,
                                                                    masterData: this.props.Login.masterData,
                                                                    userInfo: this.props.Login.userInfo,
                                                                    editRegParam: {
                                                                        ...this.state.editRegParam,
                                                                        ncontrolCode: this.state.adhocTestId,
                                                                        nneedsubsample: this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample //=== true ? transactionStatus.YES:transactionStatus.NO
                                                                    }
                                                                }),
                                                            },
                                                            {
                                                                title: this.props.intl.formatMessage({ id: "IDS_PRINTBARCODE" }),
                                                                controlname: "faPrint",
                                                                objectName: "sample",
                                                                hidden: this.state.userRoleControlRights.indexOf(this.state.printBarcodeId) === -1,
                                                                //onClick: this.props.getPrinterComboService,
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
                                                        :
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
                                                            //     {    title: this.props.intl.formatMessage({ id: "IDS_OUTSOURCE" }), 
                                                            //     controlname: "faOutsource", 
                                                            //     hidden: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.noutsourcerequired === transactionStatus.YES? false :true,
                                                            //    // hidden:this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE? false :true,
                                                            //    // hidden: this.state.userRoleControlRights.indexOf(openELNSheet) === -1, 
                                                            //     onClick: this.outsourceSample, objectName: "test",
                                                            //     inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo} 
                                                            // },

                                                            {
                                                                title: this.props.intl.formatMessage({ id: "IDS_PRINTBARCODE" }),
                                                                controlname: "faPrint",
                                                                objectName: "sample",
                                                                hidden: this.state.userRoleControlRights.indexOf(this.state.printBarcodeId) === -1,
                                                                //onClick: this.props.getPrinterComboService,
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
                                                            //  data-for="tooltip-common-wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.preRegisterId) === -1}
                                                            onClick={() => this.getRegistrationComboService("Registration", "create", "npreregno",
                                                                this.props.Login.masterData, this.props.Login.userInfo, this.state.preRegisterId, false, true, true)}>
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
                                                        <ProductList className="d-flex product-category float-right"></ProductList>
                     
                                                        <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_QUARANTINE" })}
                                                            //  data-for="tooltip-common-wrap"
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

                                                        <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_REPORT" })}
                                                            // data-for="tooltip-common-wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.reportId) === -1}
                                                            onClick={() => this.sampleReceivingReport(this.state.reportId)}>
                                                            <DownloadReportbutton width='20px' height='20px' className='custom_icons' />
                                                        </Nav.Link>



                                                        {this.props.Login.masterData && this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample === false ?
                                                            <Button className="btn btn-circle outline-grey ml-2" variant="link"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_PRINTBARCODE" })}
                                                                //  data-for="tooltip-common-wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(this.state.sampleBarcodeId) === -1}
                                                                onClick={() => this.props.getBarcodeAndPrinterService({
                                                                    masterData: this.props.Login.masterData,
                                                                    ncontrolcode: this.state.sampleBarcodeId,
                                                                    userInfo: this.props.Login.userInfo,
                                                                    control: "sampleBarcode"
                                                                })}
                                                            >

                                                                {/* onClick={() => this.props.openBarcodeModal(
                                                                this.props.Login.masterData.selectedSample,
                                                                this.state.sampleBarcodeId,
                                                                this.props.Login.userInfo, true,
                                                                "sampleBarcode"
                                                            )} > */}
                                                                <FontAwesomeIcon icon={faPrint} />
                                                            </Button>
                                                            : ""}

                                                        {this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nportalrequired === transactionStatus.YES &&
                                                            <Nav.Link
                                                                className="btn btn-circle outline-grey ml-2"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_CANCELEXTERNALSAMPLEORDER" })}
                                                                // data-for="tooltip-common-wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(this.state.CancelExternalOrderSampleId) === -1}
                                                                // onClick={() => this.orderRecords(this.state.CancelExternalOrderSampleId, this.state.skip, this.state.take)}
                                                                onClick={() => this.orderRecords(this.state.CancelExternalOrderSampleId, this.props.Login.userInfo)}
                                                            >
                                                                <Order className="custom_icons" width="20" height="20" />
                                                            </Nav.Link>}
                                                        <Nav.Link className="btn btn-circle outline-grey" variant="link"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_SAMPLEIMPORT" })}
                                                            // data-for="tooltip-grid-wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.SampleImportId) === -1}
                                                            onClick={() => this.getRegistrationComboService("Registration", "create", "npreregno",
                                                                this.props.Login.masterData, this.props.Login.userInfo, this.state.preRegisterId, true, false)}>
                                                            <FontAwesomeIcon icon={faFileImport} />
                                                        </Nav.Link>
                                                        <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                                            //   data-for="tooltip-common-wrap"
                                                            onClick={() => this.onReload()} >
                                                            <RefreshIcon className='custom_icons' />
                                                        </Button>
                                                        <Button className="btn btn-icon-rounded btn-circle solid-blue ml-2" role="button"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_COPYSAMPLE" })}
                                                            //  data-for="tooltip-common-wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.copySampleId) === -1}
                                                            onClick={() => this.copySampleService(this.state.copySampleId,
                                                                this.props.Login.masterData, this.props.Login.userInfo, "copy")}>
                                                            <FontAwesomeIcon icon={faCopy} />
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
                                            {/* <ContentPanel ref={this.myRef} style={this.state.showSample === true ? { display: "block" } : { display: "none" }}>
                                                <Card ref={this.myRef} className="border-0">
                                                    <Card.Body className='p-0'>
                                                        <Row>
                                                            <Col md={12}>
                                                                <Card className='p-0'>
                                                                    <Card.Header style={{ borderBottom: "0px" }}>
                                                                        <span style={{ display: "inline-block", marginTop: "1%" }} >
                                                                            <h4 >{this.props.intl.formatMessage({ id: "IDS_SAMPLE" })}</h4>
                                                                        </span>
                                                                      
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
                                            </ContentPanel> */}
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
                                                {this.props.intl.formatMessage({ id: "IDS_SAMPLEDETAILS" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 4 ? this.sideNavDetail("IDS_SAMPLEDETAILS", 0) : ""}
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
                                                {this.props.intl.formatMessage({ id: "IDS_RESULT" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 1 ? this.sideNavDetail("IDS_PARAMETERRESULTS") : ""}
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
                                                    {this.props.intl.formatMessage({ id: "IDS_SAMPLEDETAILS" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 2 ? 'active' : ""}`} onClick={() => this.changePropertyView(2)}>
                                                <FontAwesomeIcon icon={faLink} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_ATTACHMENTS" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 3 ? 'active' : ""}`} onClick={() => this.changePropertyView(3)}>
                                                <FontAwesomeIcon icon={faComments} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                                                </span>
                                            </li>
                                            {/* {this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE && */}
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 1 ? 'active' : ""}`} onClick={() => this.changePropertyView(1)}>
                                                <FontAwesomeIcon icon={faFileInvoice}
                                                    //   data-for="tooltip-common-wrap"
                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_RESULT" })} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_RESULT" })}
                                                </span>
                                            </li>
                                            {/* } */}
                                            {this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.noutsourcerequired === transactionStatus.YES &&
                                                <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 9 ? 'active' : ""}`} onClick={() => this.changePropertyView(9)}>
                                                    {/* <FontAwesomeIcon icon= */}
                                                    {getActionIcon("faOutsource")}
                                                    {/* /> */}
                                                    <span>
                                                        {this.props.intl.formatMessage({ id: "IDS_OUTSOURCE" })}
                                                    </span>
                                                </li>
                                            }
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
                        onSaveClick={this.props.Login.needMethod && this.props.Login.needMethod ===true?
                            this.onSaveTestMethod:this.props.Login.operation === 'barcode' ?
                            () => this.props.barcodeGeneration(this.props.Login.barcodeSelectedRecord,
                                this.props.Login.ncontrolcode, this.props.Login.userInfo, this.state.selectedRecord)
                            : this.state.showQRCode ?
                                () => this.setState({ showQRCode: false, openModal: false })
                                // : this.state.showBarcode ? 
                                //     () => this.setState({ showBarcode: false, openModal: false })
                                : this.props.Login.addMaster ? this.onSaveMasterRecord
                                    : this.props.Login.loadRegSubSample ? this.onSaveSubSampleClick
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
                                : this.props.Login.loadTest ? this.state.selectedTestData : this.props.Login.loadFile ? this.state.selectedFile
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
							: this.props.Login.needMethod && this.props.Login.needMethod ===true?
                            <AddTestMethod
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onComboChange={this.onComboChange}
                                    testMethodList={this.props.Login.testMethodList}

                                >
                                </AddTestMethod>
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
                                                // primaryKeyField={this.props.Login.masterprimaryKeyField}
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
                                                    selectedTestPackageData={this.state.selectedTestPackageData}
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
                                                    this.props.Login.loadPrinter ?
                                                        <AddPrinter
                                                            printer={this.props.Login.printer}
                                                            barcode={this.props.Login.barcode}
                                                            selectedPrinterData={this.state.selectedPrinterData}
                                                            PrinterChange={this.PrinterChange}
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
                                                                    selectedTestData={this.state.selectedRecord}
                                                                    TestChange={this.onComboChange}
                                                                    TestPackageChange={this.onComboTestPackageChange}
                                                                    userRoleControlRights={this.props.Login.userRoleControlRights}
                                                                    selectPackage={this.state.selectedRecord}
                                                                    TestPackage={this.props.Login.TestPackage || []}
                                                                    onTestPackageChange={this.onTestPackageChange}
                                                                    hideQualisForms={this.props.Login.hideQualisForms}
                                                                /> : this.props.Login.loadAdhocTest ?
                                                                    //ALPD-3615
                                                                    <AddAdhocTest
                                                                        availableAdhocTest={this.props.Login.availableAdhocTest}
                                                                        selectedAdhocTestData={this.state.selectedRecord}
                                                                        TestChange={this.onComboChange}
                                                                        userRoleControlRights={this.props.Login.userRoleControlRights}
                                                                        onInputOnChange={this.onInputOnChange}

                                                                    /> :
                                                                    this.props.Login.screenName == "External Sample" ?
                                                                        <ExternalOrder
                                                                            orders={this.state.selectedRecord.orders || []}
                                                                            //headerSelectionChange={this.headerSelectionChange}
                                                                            selectionChange={this.selectionChange}
                                                                            //addSelectAll={this.state.addSelectAll}
                                                                            onInputOnChange={this.onInputOnChange}
                                                                            selectedRecord={this.state.selectedRecord || {}}
                                                                            onOrderSearch={this.onOrderSearch}
                                                                            userInfo={this.props.Login.userInfo}
                                                                            externalOrderTypeList={this.props.Login.externalOrderTypeList}
                                                                            selectedExternalOrderType={this.props.Login.selectedExternalOrderType}
                                                                            onComboChange={this.onComboChange}
                                                                        />
                                                                        : this.props.Login.outsourcetest ?
                                                                            <Row>
                                                                                <Col>
                                                                                    <FormSelectSearch
                                                                                        name={"outsourcesite"}
                                                                                        formLabel={this.props.intl.formatMessage({ id: "IDS_SITE" })}
                                                                                        placeholder="Please Select..."
                                                                                        options={this.props.Login.outSourceSiteList || []}
                                                                                        //optionId={props.extractedColumnList[1].optionId}
                                                                                        //optionValue={props.extractedColumnList[1].optionValue}
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
                                                                                    //isInvalid={props.failedControls.indexOf(props.extractedColumnList[1].dataField) !==-1}

                                                                                    />

                                                                                    <FormMultiSelect
                                                                                        name={"outsourcetestlist"}
                                                                                        label={this.props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                                                                                        options={this.props.Login.outSourceTestList || []}
                                                                                        optionId={"ntransactiontestcode"}
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
                                                                                        //maxDate={props.currentTime}
                                                                                        //maxTime={this.props.Login.currentTime}
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
                                                                            //  Start of ALPD-4130 Additional Filter Component -ATE241
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
                            //  End of ALPD-4130 Additional Filter Component -ATE-241
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

    onNumericInputChangeSample = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};

        selectedRecord[name] = value;
        //  }

        this.setState({ selectedRecord });
    }

    onComboChangeMaster = (comboData, fieldName, item) => {
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}
        if (comboData !== null) {
            if (this.props.Login.selectedControl[masterIndex].table.item.nformcode === 137) {
                selectedMaster[masterIndex][item.tableDataField] = comboData.value;
            }
            else if (item.foreignDataField) {
                selectedMaster[masterIndex][item.foreignDataField] = comboData.value;
            }
        }
        selectedMaster[masterIndex][fieldName] = comboData;
        if (item.childIndex !== undefined) {
            this.props.getChildComboMaster(selectedMaster, fieldName, item,
                this.props.Login.selectedControl,
                this.props.Login.masterfieldList,
                this.props.Login.masterdataList, this.props.Login.userInfo, masterIndex)
        } else {
            this.setState({ selectedMaster });
        }

    }
	//ALPD-4912-To insert data when filter name input submit,done by Dhanushya RI
    onSaveModalFilterName = () => {
        
        const obj = convertDateValuetoString(this.props.Login.masterData.RealFromDate,
            this.props.Login.masterData.RealToDate, this.props.Login.userInfo)
        let inputData = {
            userinfo:this.props.Login.userInfo,
            FromDate : obj.fromDate,
            ToDate : obj.toDate,
            sfiltername:this.state.selectedRecord && this.state.selectedRecord.sfiltername !== null
            ? this.state.selectedRecord.sfiltername: "",
            sampleTypeValue: this.props.Login.masterData && this.props.Login.masterData.RealSampleTypeValue,
            regTypeValue: this.props.Login.masterData && this.props.Login.masterData.RealRegTypeValue,
            regSubTypeValue: this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue,
            filterStatusValue: this.props.Login.masterData && this.props.Login.masterData.RealFilterStatusValue,
            approvalConfigValue: this.props.Login.masterData && this.props.Login.masterData.RealApprovalConfigVersionValue,
            designTemplateMappingValue: this.props.Login.masterData && this.props.Login.masterData.RealDesignTemplateMappingValue,
            nsampletypecode: this.props.Login.masterData && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
            ntranscode: this.props.Login.masterData && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus,
            napproveconfversioncode: this.props.Login.masterData
                && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode,
            ndesigntemplatemappingcode: this.props.Login.masterData
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
            nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,

            }

        //ALPD-5430 Sample Registration-->When saving the filter in sample registration, an HTML error occurs.
        let inputParam = {
            classUrl: "registration",
            methodUrl: "FilterName",
            inputData: inputData,
            operation: this.props.Login.operation,
          };
   
        const masterData = this.props.Login.masterData;
    if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1 && inputData.napproveconfversioncode !== -1
            && inputData.ntranscode !== -1 && inputData.ndesigntemplatemappingcode !== -1 ) {
        // if (showEsign(this.props.Login.userRoleControlRights,this.props.Login.userInfo.nformcode,this.state.filterNameId)) {
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
        toast.info(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
    }
    }
   
    onSaveModalClick = () => {
        const selectedRecord = this.state.selectedRecord || {};
        let Map = {};
        Map["npreregno"] = this.props.Login.orderDetails && parseInt(this.props.Login.orderDetails.subSample.npreregno) || -1;
        Map["ntransactionsamplecode"] = this.props.Login.orderDetails && parseInt(this.props.Login.orderDetails.subSample.ntransactionsamplecode) || -1;
        Map["nexternalordersamplecode"] = selectedRecord.nexternalordercode && selectedRecord.nexternalordercode.value || -1;
        Map["nexternalordercode"] = selectedRecord.nexternalordercode && selectedRecord.nexternalordercode.item.nexternalordercode || -1;
        Map["sexternalOrderID"] = selectedRecord.nexternalordercode && selectedRecord.nexternalordercode.item.sexternalorderid;
        Map["sexternalSampleID"] = selectedRecord.nexternalordercode && selectedRecord.nexternalordercode.label;
        Map["manualOrderData"] = this.props.Login.orderDetails && parseInt(this.props.Login.orderDetails.selectedSample.OrderCodeData);
        Map["userinfo"] = this.props.Login.userInfo;
        Map["FromDate"] = this.props.Login.masterData.FromDate;
        Map["ToDate"] = this.props.Login.masterData.ToDate;
        Map["nsampletypecode"] = this.props.Login.masterData.nsampletypecode;
        Map["nregtypecode"] = this.props.Login.masterData.RegTypeValue.nregtypecode;
        Map["nregsubtypecode"] = this.props.Login.masterData.RegSubTypeValue.nregsubtypecode;
        Map["nfilterstatus"] = this.props.Login.masterData.nfilterstatus;
        Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode;
        Map["napproveconfversioncode"] = this.props.Login.masterData.napproveconfversioncode;
        Map["nneedsubsample"] = this.props.Login.masterData.nneedsubsample;
        Map["activeSampleTab"] = this.props.Login.masterData.activeSampleTab;
        Map["checkBoxOperation"] = this.props.Login.masterData.checkBoxOperation;
        Map["activeSubSampleTab"] = this.props.Login.masterData.activeSubSampleTab;
        Map["activeTestTab"] = this.props.Login.masterData.activeTestTab;
        Map["ntype"] = 5;
        Map["url"] = this.props.Login.settings[24];
        const inputParam = {
            inputData: Map,
            searchRef: this.searchRef,
            isClearSearch: this.props.Login.isClearSearch, masterData: this.props.Login.masterData
        };
        this.props.orderMapping(inputParam);
    }

    outsourceTest = (test) => {
        // console.log("test:", test);
        if (this.props.Login.masterData.RealSampleTypeValue
            && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE
            && this.props.Login.masterData.RealSampleTypeValue.nportalrequired === transactionStatus.YES) {
            if (test.test.ntransactionstatus === transactionStatus.REGISTER) {
                const inputData = {
                    "registrationtest": {
                        npreregno: test.test.npreregno,
                        ntransactionsamplecode: test.test.ntransactionsamplecode,
                        ntestcode: test.test.ntestcode,
                        ntransactiontestcode: test.test.ntransactiontestcode
                    },
                    userinfo: this.props.Login.userInfo,
                    ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                        && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                    // destinationsitecode:2
                }
                const inputParam = { inputData, screenName: "IDS_OUTSOURCETEST" };
                this.props.getOutSourceSite(inputParam);
                // this.props.outsourceTest(inputData);
            }
            else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTREGISTEREDTEST" }));
            }
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_OUTSOURCEOPTIONNOTAVAIL" }));
        }
    }
    onSaveOutSourceSample = () => {

        if (Date.parse(this.props.Login.regDate) <= Date.parse(this.state.selectedRecord["doutsourcedate"].toDateString())) {
            const selectedRecord = this.state.selectedRecord || {};
            const outSourceSiteData = this.props.Login.outSourceSiteData;
            const destinationsitecode = selectedRecord["outsourcesite"].value;
            //const selectedTest = selectedRecord["outSourceTestList"].item;
            const selectedTest = selectedRecord["outSourceTestList"].map(item => item.item);




            const otherdetails = {
                doutsourcedate: selectedRecord["doutsourcedate"],
                sremarks: selectedRecord["sremarks"],
                ssampleid: selectedRecord["ssampleid"],
                sshipmenttracking: selectedRecord["sshipmenttracking"]
            };
            // const doutsourcedate=selectedRecord["doutsourcedate"];
            // const sremarks=selectedRecord["sremarks"];
            // const ssampleid=selectedRecord["ssampleid"];
            // const sshipmenttracking=selectedRecord["sshipmenttracking"];
            this.props.outsourceSampleTest({ ...outSourceSiteData, destinationsitecode, selectedTest, otherdetails }, this.props.Login.masterData);
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_OUTSOURCEDATEGRATERTHANREGDATE" }));
        }
    }

    outsourceSample = (test) => {
        // console.log("test:", test);
        if (this.props.Login.masterData.RealSampleTypeValue
            && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE
            && this.props.Login.masterData.RealSampleTypeValue.nportalrequired === transactionStatus.YES) {
            // if(test.test.ntransactionstatus === transactionStatus.REGISTER || test.test.ntransactionstatus ===transactionStatus.PARTIAL)
            if (test.test.ntransactionstatus !== transactionStatus.PREREGISTER
                && test.test.ntransactionstatus !== transactionStatus.REJECT
                && test.test.ntransactionstatus !== transactionStatus.CANCELLED
                && test.test.ntransactionstatus !== transactionStatus.RELEASED) {
                const inputData = {
                    "registrationtest": {
                        npreregno: test.test.npreregno,
                        ntransactionsamplecode: test.test.ntransactionsamplecode,
                        ssamplearno: test.test.ssamplearno
                    },
                    userinfo: this.props.Login.userInfo,
                    ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                        && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                    "outSourceSampleData": {
                        nsampletypecode: this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                        napprovalversioncode: this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode,
                        npreregno: test.test.npreregno

                    }
                }

                const inputParam = { inputData, screenName: "IDS_OUTSOURCETEST" };
                this.props.getOutSourceSiteAndTest(inputParam);
                // this.props.outsourceTest(inputData);
            }
            else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTREGISTEREDTEST" }));
            }
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_OUTSOURCEOPTIONNOTAVAIL" }));
        }
    }


    handleDateChangeMaster = (dateName, dateValue, item) => {
        //   const { selectedMaster } = this.state;
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        selectedMaster[masterIndex][dateName] = dateValue;
        const age = ageCalculate(dateValue);
        selectedMaster[masterIndex]["sage"] = age;
        this.setState({ selectedMaster });

    }

    onNumericInputOnChangeMaster = (value, name, item) => {
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        selectedMaster[masterIndex][name] = value;
        this.setState({ selectedMaster });
    }

    onInputOnChangeMaster = (event) => {
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        if (event.target.type === 'checkbox') {
            selectedMaster[masterIndex][event.target.name] = event.target.checked === true ? 3 : 4;
            if (this.props.Login.selectedControl[masterIndex].table.item.nformcode === 137) {
                if (selectedMaster[masterIndex].nneedcurrentaddress === 3) {
                    selectedMaster[masterIndex].sflatnotemp = selectedMaster[masterIndex].sflatno;
                    selectedMaster[masterIndex].shousenotemp = selectedMaster[masterIndex].shouseno;
                    selectedMaster[masterIndex].spostalcodetemp = selectedMaster[masterIndex].spostalcode;
                    selectedMaster[masterIndex].sstreettemp = selectedMaster[masterIndex].sstreet;
                    selectedMaster[masterIndex].scitynametemp = selectedMaster[masterIndex].scityname;
                    selectedMaster[masterIndex].sdistrictnametemp = selectedMaster[masterIndex].sdistrictname;
                    selectedMaster[masterIndex].sregionnametemp = selectedMaster[masterIndex].sregionname;
                }
                else {
                    selectedMaster[masterIndex].sflatnotemp = "";
                    selectedMaster[masterIndex].shousenotemp = "";
                    selectedMaster[masterIndex].spostalcodetemp = "";
                    selectedMaster[masterIndex].sstreettemp = "";
                    selectedMaster[masterIndex].scitynametemp = "";
                    selectedMaster[masterIndex].sdistrictnametemp = "";
                    selectedMaster[masterIndex].sregionnametemp = "";
                }
            }
        }
        else {
            selectedMaster[masterIndex][event.target.name] = event.target.value;
        }
        this.setState({ selectedMaster });
    }

    onSaveMasterRecord = (saveType, formRef) => {
        //add / edit            
        const masterIndex = this.props.Login.masterIndex;
        let inputData = [];
        const selectedControl = this.props.Login.selectedControl
        const masterDesign = this.props.Login.masterDesign
        inputData["userinfo"] = { ...this.props.Login.userInfo, nformcode: selectedControl[masterIndex].table.item.nformcode };
        inputData[selectedControl[masterIndex].table.item.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

        const methodUrl = selectedControl[masterIndex].table.item.methodUrl.toLowerCase()
        if (this.props.Login.masterOperation[masterIndex] === 'update') {
            if (selectedControl[masterIndex].table.item.component === 'Dynamic') {
                inputData[methodUrl]["ndynamicmastercode"] = this.props.Login.masterEditObject[masterIndex].item ?
                    this.props.Login.masterEditObject[masterIndex].item.jsondata.ndynamicmastercode : this.props.Login.masterEditObject[masterIndex].ndynamicmastercode
            }
            else {
                inputData[methodUrl][selectedControl[masterIndex]["valuemember"]] = this.props.Login.masterEditObject[masterIndex].value
            }

        }


        if (selectedControl[masterIndex].table.item.component === 'Dynamic') {
            const selectedMaster = this.state.selectedMaster;
            inputData["userinfo"] = { ...this.props.Login.userInfo, nformcode: selectedControl[masterIndex].table.item.nformcode };
            inputData["masterdateconstraints"] = masterDesign[masterIndex].screendesign.masterdateconstraints;
            inputData["masterdatefields"] = masterDesign[masterIndex].screendesign.masterdatefields;
            inputData["mastercombinationunique"] = masterDesign[masterIndex].screendesign.mastercombinationunique;
            //add                          
            inputData["dynamicmaster"] = {
                ...inputData[methodUrl],
                nformcode: selectedControl[masterIndex].table.item.nformcode,
                ndesigntemplatemappingcode: masterDesign[masterIndex].ndesigntemplatemappingcode,
                jsondata: {}, jsonuidata: {}
            };

            const dateList = [];
            const defaulttimezone = this.props.Login.defaulttimezone;

            masterDesign[masterIndex] &&
                masterDesign[masterIndex].slideoutdesign.map(row => {
                    row.children.map(column => {
                        column.children.map(component => {
                            if (component.hasOwnProperty("children")) {

                                component.children.map(componentrow => {
                                    if (componentrow.inputtype === "combo") {
                                        inputData["dynamicmaster"]["jsondata"][componentrow.label] = selectedMaster[componentrow.label] ?
                                            {
                                                value: selectedMaster[masterIndex][componentrow.label].value,
                                                label: selectedMaster[masterIndex][componentrow.label].label,
                                                pkey: componentrow.valuemember,
                                                nquerybuildertablecode: componentrow.nquerybuildertablecode,
                                                source: componentrow.source,
                                                [componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]: this.props.Login.masterOperation[masterIndex] === 'update' ?
                                                    selectedMaster[masterIndex][componentrow.label].item ? selectedMaster[masterIndex][componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                                        selectedMaster[masterIndex][componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                                    :
                                                    selectedMaster[masterIndex][componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                            } : -1

                                        inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = selectedMaster[masterIndex][componentrow.label] ? selectedMaster[masterIndex][componentrow.label].label : ""

                                    }
                                    else if (componentrow.inputtype === "date") {
                                        if (componentrow.mandatory) {
                                            inputData["dynamicmaster"]["jsondata"][componentrow.label] = formatDate(selectedMaster[masterIndex][componentrow.label], false)

                                            inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = inputData["dynamicmaster"]["jsondata"][componentrow.label]
                                            //inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = convertDateTimetoString(selectedRecord[componentrow.label], userInfo);
                                        }
                                        else {
                                            inputData["dynamicmaster"]["jsondata"][componentrow.label] = componentrow.loadcurrentdate ?
                                                formatDate(selectedMaster[masterIndex][componentrow.label] || new Date(), false) :
                                                selectedMaster[masterIndex][componentrow.label] ? formatDate(selectedMaster[masterIndex][componentrow.label], false)
                                                    : "";

                                            inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = inputData["dynamicmaster"]["jsondata"][componentrow.label];
                                            //convertDateTimetoString(selectedRecord[componentrow.label], userInfo);
                                        }
                                        if (componentrow.timezone) {
                                            inputData["dynamicmaster"]["jsondata"][`tz${componentrow.label}`] = selectedMaster[masterIndex][`tz${componentrow.label}`] ?
                                                { value: selectedMaster[masterIndex][`tz${componentrow.label}`].value, label: selectedMaster[masterIndex][`tz${componentrow.label}`].label } :
                                                defaulttimezone ? defaulttimezone : -1

                                            inputData["dynamicmaster"]["jsonuidata"][`tz${componentrow.label}`] = inputData["dynamicmaster"]["jsondata"][`tz${componentrow.label}`]
                                        }
                                        dateList.push(componentrow.label)
                                    }

                                    else {
                                        inputData["dynamicmaster"]["jsondata"][componentrow.label] = selectedMaster[masterIndex][componentrow.label] ?
                                            selectedMaster[masterIndex][componentrow.label] : ""

                                        inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = inputData["dynamicmaster"]["jsondata"][componentrow.label]
                                        // inputData["dynamicmaster"]["jsondata"][componentrow.label]

                                    }
                                    return inputData["dynamicmaster"];
                                })
                            }
                            else {
                                if (component.inputtype === "combo") {
                                    inputData["dynamicmaster"]["jsondata"][component.label] = selectedMaster[masterIndex][component.label] ?
                                        {
                                            value: selectedMaster[masterIndex][component.label].value,
                                            label: selectedMaster[masterIndex][component.label].label,
                                            pkey: component.valuemember,
                                            nquerybuildertablecode: component.nquerybuildertablecode,
                                            source: component.source,
                                            [component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]: this.props.Login.masterOperation[masterIndex] === 'update' ?
                                                selectedMaster[masterIndex][component.label].item ? selectedMaster[masterIndex][component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] : selectedMaster[masterIndex][component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                                :
                                                selectedMaster[masterIndex][component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                        } : -1

                                    inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label].label;
                                    //selectedRecord[component.label] ? selectedRecord[component.label].label : ""
                                }
                                else if (component.inputtype === "date") {
                                    if (component.mandatory) {
                                        inputData["dynamicmaster"]["jsondata"][component.label] = formatDate(selectedMaster[masterIndex][component.label], false);
                                        // convertDateTimetoString(selectedRecord[component.label] ?
                                        // selectedRecord[component.label] : new Date(), userInfo);

                                        inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label]
                                        //convertDateTimetoString(selectedRecord[component.label], userInfo);

                                    } else {
                                        inputData["dynamicmaster"]["jsondata"][component.label] = component.loadcurrentdate ?
                                            //convertDateTimetoString(selectedRecord[component.label] ?                                      
                                            //    selectedRecord[component.label] : new Date(), userInfo) :
                                            formatDate(selectedMaster[masterIndex][component.label] || new Date(), false) :
                                            selectedMaster[masterIndex][component.label] ?
                                                // convertDateTimetoString(selectedRecord[component.label] ?
                                                //   selectedRecord[component.label] : new Date(), userInfo) : "";
                                                formatDate(selectedMaster[masterIndex][component.label], false) : "";
                                        inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label]
                                        //convertDateTimetoString(selectedRecord[component.label], userInfo)

                                    }
                                    if (component.timezone) {
                                        inputData["dynamicmaster"]["jsondata"][`tz${component.label}`] = selectedMaster[masterIndex][`tz${component.label}`] ?
                                            { value: selectedMaster[masterIndex][`tz${component.label}`].value, label: selectedMaster[masterIndex][`tz${component.label}`].label } :
                                            defaulttimezone ? defaulttimezone : -1

                                        inputData["dynamicmaster"]["jsonuidata"][`tz${component.label}`] = inputData["dynamicmaster"]["jsondata"][`tz${component.label}`]
                                    }
                                    dateList.push(component.label)
                                }
                                else {
                                    inputData["dynamicmaster"]["jsondata"][component.label] = selectedMaster[masterIndex][component.label] ?
                                        selectedMaster[masterIndex][component.label] : ""

                                    inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label]
                                }
                            }
                            return inputData["dynamicmaster"];
                        }
                        )
                        return inputData["dynamicmaster"];
                    })
                    return inputData["dynamicmaster"];
                })


            inputData["dynamicmaster"]["jsonstring"] = JSON.stringify(inputData["dynamicmaster"]["jsondata"]);
            inputData["dynamicmaster"]["jsonuistring"] = JSON.stringify(inputData["dynamicmaster"]["jsonuidata"]);
            inputData["masterdatelist"] = dateList;


        }
        else if (selectedControl[masterIndex].table.item.component === 'Type3Component'
            && selectedControl[masterIndex].table.item.nformcode === formCode.PATIENTMASTER) {
            //ALPD-3347    
            inputData["noneedfilter"] = 1; //will dislplay all db records
            if (selectedControl[masterIndex].inputtype === 'backendsearchfilter' || selectedControl[masterIndex].inputtype === 'frontendsearchfilter') {
                inputData["noneedfilter"] = 2; //will display will added record
            }
            this.props.Login.masterextractedColumnList[masterIndex].map(item => {
                let fieldName = item.dataField;
                if (item.isJsonField === true) {
                    return inputData[methodUrl][item.jsonObjectName] = { ...inputData[methodUrl][item.jsonObjectName], [fieldName]: this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "" }
                }
                else {
                    if (item.controlType === "selectbox") {
                        // inputData[methodUrl][fieldName] = this.state.selectedMaster[fieldName] ? this.state.selectedMaster[fieldName].label ? this.state.selectedMaster[fieldName].label : "" : -1;
                        inputData[methodUrl][item.tableDataField] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].value ? this.state.selectedMaster[masterIndex][fieldName].value : "" : -1;
                        return inputData;
                    }
                    else if (item.controlType === "datepicker") {
                        inputData[methodUrl][item.dateField] = formatInputDate(this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "", false);
                    }
                    else if (item.controlType === "checkbox") {
                        inputData[methodUrl][item.controlName] = this.state.selectedMaster[masterIndex][item.controlName] ? this.state.selectedMaster[masterIndex][item.controlName] : transactionStatus.NO;
                    }
                    else {
                        inputData[methodUrl][fieldName] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "";
                    }
                    // inputData[methodUrl][selectedRecordPrimarykey] = this.props.Login.selectedId;
                    return inputData;
                }
            })
        }
        else {

            this.props.Login.masterextractedColumnList[masterIndex].map(item => {
                let fieldName = item.dataField;
                if (item.isJsonField === true) {
                    return inputData[methodUrl][item.jsonObjectName] = { ...inputData[methodUrl][item.jsonObjectName], [fieldName]: this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "" }
                }
                else {
                    if (item.controlType === "selectbox") {
                        inputData[methodUrl][fieldName] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].label ? this.state.selectedMaster[masterIndex][fieldName].label : "" : -1;
                        inputData[methodUrl][item.foreignDataField] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].value ? this.state.selectedMaster[masterIndex][fieldName].value : "" : -1;
                        return inputData;
                    }
                    else if (item.controlType === "datepicker") {
                        inputData[methodUrl][item.dateField] = formatInputDate(this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "", false);
                    }
                    else if (item.controlType === "checkbox") {
                        inputData[methodUrl][item.controlName] = this.state.selectedMaster[masterIndex][item.controlName] ? this.state.selectedMaster[masterIndex][item.controlName] : transactionStatus.NO;
                    }
                    else {
                        inputData[methodUrl][fieldName] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "";
                    }
                    // inputData[methodUrl][selectedRecordPrimarykey] = this.props.Login.selectedId;
                    return inputData;
                }
            })
        }
        // }

        const inputParam = {
            withoutCombocomponent:
                this.state.regSubSamplewithoutCombocomponent,
            comboComponents: this.state.regSubSamplecomboComponents,
            selectedRecord: this.state.selectedRecord,
            selectedRecordName: 'selectedRecord',
            loadSubSample: false,
            selectedControl: this.props.Login.selectedControl,
            comboData: this.props.Login.regSubSamplecomboData,
            comboName: 'regSubSamplecomboData',
            classUrl: selectedControl[masterIndex].table.item.classUrl,
            methodUrl: selectedControl[masterIndex].table.item.methodUrl,
            // displayName: this.props.Login.selectedControl.table.item.sdisplayname,
            inputData: inputData,
            operation: this.props.Login.masterOperation[masterIndex],
            masterEditObject: this.props.Login.masterEditObject,
            masterOperation: this.props.Login.masterOperation,
            saveType, formRef,
            screenName: "IDS_SUBSAMPLE",
            masterIndex,
            selectedMaster: this.state.selectedMaster,
            mastercomboComponents: this.props.Login.mastercomboComponents,
            masterwithoutCombocomponent: this.props.Login.masterwithoutCombocomponent,
            masterComboColumnFiled: this.props.Login.masterComboColumnFiled,
            masterextractedColumnList: this.props.Login.masterextractedColumnList,
            masterdataList: this.props.Login.masterdataList,
            masterDesign: this.props.Login.masterDesign,
            masterfieldList: this.props.Login.masterfieldList,
            userinfo: this.props.Login.userInfo
        }

        this.props.addMasterRecord(inputParam, this.props.Login.masterData)

    }

    addMasterRecord = (control) => {
        let masterIndex = this.props.Login.masterIndex
        if (masterIndex !== undefined) {
            masterIndex = masterIndex + 1;
        } else {
            masterIndex = 0
        }
        let selectedControl = this.props.Login.selectedControl || []
        let selectedMaster = this.state.selectedMaster || []
        selectedMaster[masterIndex] = {}
        selectedControl[masterIndex] = control

        let fieldList = this.props.Login.masterfieldList || []
        fieldList[masterIndex] = []

        let masterComboColumnFiled = this.props.Login.masterComboColumnFiled || []
        masterComboColumnFiled[masterIndex] = []

        let extractedColumnList = this.props.Login.masterextractedColumnList || []
        extractedColumnList[masterIndex] = []

        let masterdataList = this.props.Login.masterdataList || []
        let masterDesign = this.props.Login.masterDesign || []
        let masterwithoutCombocomponent = this.props.Login.masterwithoutCombocomponent || []
        let mastercomboComponents = this.props.Login.mastercomboComponents || []
        let masterOperation = this.props.Login.masterOperation || []

        masterdataList[masterIndex] = []
        masterDesign[masterIndex] = []
        masterwithoutCombocomponent[masterIndex] = []
        mastercomboComponents[masterIndex] = []
        masterOperation[masterIndex] = 'create'

        if (control.table.item.component === 'Type2Component' || control.table.item.component === 'Type1Component') {
            if (control.table.item.component === 'Type2Component') {
                fieldList[masterIndex] = getFieldSpecification().get(control.table.item.methodUrl) || [];
            } else {
                fieldList[masterIndex] = getFieldSpecification1().get(control.table.item.methodUrl) || [];
            }


            extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));

            const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    selectedControl,
                    addMaster: true,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterprimaryKeyField: primaryKeyField,
                    masterComboColumnFiled: masterComboColumnFiled,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    selectedMaster,
                    masterOperation,
                    screenName: selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode]
                }
            }
            this.props.updateStore(updateInfo)
        }
        else if (control.table.item.component === 'Type3Component') {
            fieldList[masterIndex] = getFieldSpecification3().get(control.table.item.methodUrl) || [];
            extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));
            masterComboColumnFiled[masterIndex] = extractedColumnList[masterIndex].filter(item =>
                item.ndesigncomponentcode === designComponents.COMBOBOX)
            const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";
            const inputParam = {
                userinfo: this.props.Login.userInfo,
                selectedControl,
                masterfieldList: fieldList,
                masterextractedColumnList: extractedColumnList,
                masterprimaryKeyField: primaryKeyField,
                masterComboColumnFiled: masterComboColumnFiled,
                masterIndex,
                masterdataList,
                masterDesign,
                masterwithoutCombocomponent,
                mastercomboComponents,
                selectedMaster,
                masterOperation,
                screenName: selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode]
            }

            this.props.getAddMasterCombo(inputParam);

        }
        else if (control.table.item.component === 'Dynamic') {
            const inputParam = {
                userinfo: this.props.Login.userInfo,
                selectedControl,
                masterIndex,
                masterdataList,
                masterDesign,
                masterComboColumnFiled,
                masterwithoutCombocomponent,
                mastercomboComponents,
                masterfieldList: fieldList,
                masterextractedColumnList: extractedColumnList,
                masterOperation,
                selectedMaster
            }
            this.props.getDynamicMasterTempalte(inputParam);
        }

        // this.props.getMasterRecord(control);
    }


    editMasterRecord = (control, editObject) => {
        if (editObject) {
            let masterIndex = this.props.Login.masterIndex
            if (masterIndex !== undefined) {
                masterIndex = masterIndex + 1;
            } else {
                masterIndex = 0
            }
            let selectedControl = this.props.Login.selectedControl || []
            let selectedMaster = this.state.selectedMaster || []
            selectedMaster[masterIndex] = {}
            selectedControl[masterIndex] = control

            let fieldList = this.props.Login.masterfieldList || []
            fieldList[masterIndex] = []

            let masterComboColumnFiled = this.props.Login.masterComboColumnFiled || []
            masterComboColumnFiled[masterIndex] = []

            let extractedColumnList = this.props.Login.masterextractedColumnList || []
            extractedColumnList[masterIndex] = []

            let masterdataList = this.props.Login.masterdataList || []
            let masterDesign = this.props.Login.masterDesign || []
            let masterwithoutCombocomponent = this.props.Login.masterwithoutCombocomponent || []
            let mastercomboComponents = this.props.Login.mastercomboComponents || []
            let masterOperation = this.props.Login.masterOperation || []
            let masterEditObject = this.props.Login.masterEditObject || []

            masterdataList[masterIndex] = []
            masterDesign[masterIndex] = []
            masterwithoutCombocomponent[masterIndex] = []
            mastercomboComponents[masterIndex] = []
            masterOperation[masterIndex] = 'update'
            masterEditObject[masterIndex] = editObject

            if (control.table.item.component === 'Type2Component' || control.table.item.component === 'Type1Component') {
                if (control.table.item.component === 'Type2Component') {
                    fieldList[masterIndex] = getFieldSpecification().get(control.table.item.methodUrl) || [];
                } else {
                    fieldList[masterIndex] = getFieldSpecification1().get(control.table.item.methodUrl) || [];
                }
                extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));

                const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";

                const updateInfo = {
                    userinfo: this.props.Login.userInfo,
                    selectedControl,
                    addMaster: true,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterprimaryKeyField: primaryKeyField,
                    masterComboColumnFiled: masterComboColumnFiled,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    selectedMaster,
                    masterEditObject,
                    masterOperation
                    // editObject
                    //   screenName:selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode]

                }
                this.props.getEditMaster(updateInfo)
            }
            else if (control.table.item.component === 'Type3Component') {
                fieldList[masterIndex] = getFieldSpecification3().get(control.table.item.methodUrl) || [];
                extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));
                masterComboColumnFiled[masterIndex] = extractedColumnList[masterIndex].filter(item =>
                    item.ndesigncomponentcode === designComponents.COMBOBOX)
                const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";
                const inputParam = {
                    userinfo: this.props.Login.userInfo,
                    selectedControl,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterprimaryKeyField: primaryKeyField,
                    masterComboColumnFiled: masterComboColumnFiled,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    masterEditObject,
                    masterOperation,
                    selectedMaster,
                    screenName: selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode],
                    // editObject
                }

                this.props.getEditMaster(inputParam);

            }
            else if (control.table.item.component === 'Dynamic') {
                const inputParam = {
                    userinfo: this.props.Login.userInfo,
                    selectedControl,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterComboColumnFiled,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterComboColumnFiled,
                    masterEditObject,
                    masterOperation,
                    selectedMaster,
                    //  editObject
                }
                this.props.getEditMaster(inputParam);
            }

        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTHERECORD" }))
        }

    }

    onComboChangeMasterDyanmic = (comboData, control, customName) => {

        let comboName = customName || control.label;
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}
        //if (comboData) {
        comboData["item"] = {
            ...comboData["item"], "pkey": control.valuemember, "nquerybuildertablecode": control.nquerybuildertablecode,
            "source": control.source
        };
        selectedMaster[masterIndex][comboName] = comboData;

        // console.log("selected:", selectedMaster, comboData, control, customName);
        if (control.child && control.child.length > 0) {
            const childComboList = getSameRecordFromTwoArrays(this.props.Login.mastercomboComponents[masterIndex], control.child, "label")
            let childColumnList = {};
            childComboList.map(columnList => {
                const val = this.comboChild(this.props.Login.mastercomboComponents[masterIndex], columnList, childColumnList, false);
                childColumnList = val.childColumnList
            })

            const parentList = getSameRecordFromTwoArrays(this.props.Login.masterwithoutCombocomponent[masterIndex], control.child, "label")

            if (comboData) {
                const inputParem = {
                    child: control.child,
                    source: control.source,
                    primarykeyField: control.valuemember,
                    value: comboData.value,
                    item: comboData.item
                }
                this.props.getChildValuesForAddMaster(inputParem,
                    this.props.Login.userInfo, selectedMaster, this.props.Login.masterdataList,
                    childComboList, childColumnList,
                    this.props.Login.masterwithoutCombocomponent,
                    [...childComboList, ...parentList], masterIndex)
            } else {
                let comboData = this.props.Login.masterdataList
                const withoutCombocomponent = this.props.Login.masterwithoutCombocomponent || []
                const inputParam = { control, comboComponents: this.props.Login.mastercomboComponents[masterIndex], withoutCombocomponent: withoutCombocomponent[masterIndex], selectedMaster: selectedMaster[masterIndex], comboData: comboData[masterIndex] }
                const childParam = childComboClear(inputParam)
                selectedMaster[masterIndex] = childParam.selectedRecord
                comboData[masterIndex] = childParam.comboData
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { selectedMaster, mastedataList: comboData }
                }
                this.props.updateStore(updateInfo);
            }
        } else {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedMaster }
            }
            this.props.updateStore(updateInfo);
        }
    }

    onInputOnChangeMasterDynamic = (event, radiotext) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        if (event.target.type === 'toggle') {
            selectedMaster[masterIndex][event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        } else if (event.target.type === 'numeric') {
            if (/\D/.test(event.target.value))
                selectedMaster[masterIndex][event.target.name] = event.target.value;
        } else if (event.target.type === 'checkbox') {
            const value = selectedMaster[masterIndex][event.target.name];
            if (value !== '' && value !== undefined) {
                if (value.includes(radiotext)) {
                    const index = value.indexOf(radiotext);
                    if (index !== -1) {
                        if (index === 0) {
                            const indexcomma = value.indexOf(",")
                            if (indexcomma !== -1) {
                                selectedMaster[masterIndex][event.target.name] = value.slice(indexcomma + 1)
                            } else {
                                selectedMaster[masterIndex][event.target.name] = ""
                            }
                        } else {
                            if (value.slice(index).indexOf(",") !== -1) {
                                selectedMaster[masterIndex][event.target.name] = value.slice(0, index) + value.slice(index + value.slice(index).indexOf(",") + 1)
                            } else {
                                selectedMaster[masterIndex][event.target.name] = value.slice(0, index - 1)
                            }
                        }
                    }

                } else {
                    selectedMaster[masterIndex][event.target.name] = value + ',' + radiotext;
                }

            } else {
                selectedMaster[masterIndex][event.target.name] = radiotext;
            }
        } else if (event.target.type === 'radio') {
            selectedMaster[masterIndex][event.target.name] = radiotext
        } else {
            selectedMaster[masterIndex][event.target.name] = event.target.value;
        }
        this.setState({ selectedMaster });
    }

    handleDateChangeMasterDynamic = (dateValue, dateName) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        selectedMaster[masterIndex][dateName] = dateValue;

        this.setState({ selectedMaster });
    }

    onNumericInputChangeMasterDynamic = (value, name) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        selectedMaster[masterIndex][name] = value;
        this.setState({ selectedMaster });
    }

    onNumericBlurMasterDynamic = (value, control) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        if (selectedMaster[masterIndex][control.label]) {
            if (control.max) {
                if (!(selectedMaster[masterIndex][control.label] < parseFloat(control.max))) {
                    selectedMaster[masterIndex][control.label] = control.precision ? parseFloat(control.max) : parseInt(control.max)
                }
            }
            if (control.min) {
                if (!(selectedMaster[masterIndex][control.label] > parseFloat(control.min))) {
                    selectedMaster[masterIndex][control.label] = control.precision ? parseFloat(control.min) : parseInt(control.min)
                }
            }


        }
        this.setState({ selectedMaster });
    }

    printBarcode = (inputParam) => {

        this.setState({
            selectedRecord: {
                barcodevalue: inputParam.sample.sarno,
                barcodeData: inputParam.sample
            },
            showQRCode: true, openModal: true
        })
    }

    generateBarcode = (inputParam) => {
        let patientName = "";
        let patientDOB = "";
        let orderIdData = "";
        if (this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
            if (inputParam.test.ntransactionstatus !== transactionStatus.PREREGISTER && inputParam.test.ntransactionstatus !== transactionStatus.QUARANTINE
                && inputParam.test.ntransactionstatus !== transactionStatus.REJECT && inputParam.test.ntransactionstatus !== transactionStatus.CANCELLED) {
                inputParam.masterData.selectedSample.map(sample => {
                    if (sample.npreregno === inputParam.test.npreregno) {
                        patientName = sample["Patient First Name"] + " " + sample["Patient Last Name"];
                        patientDOB = sample["Date of birth"].replaceAll("/", "-");
                        orderIdData = sample["OrderIdData"];
                    }
                })
                let generateBarcodeValue = inputParam.test.ssamplearno;
                let additionDesignToPrint = patientName + "<br>" + patientDOB + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + orderIdData;
                this.setState({
                    selectedRecord: {
                        generateBarcodeValue,
                        additionDesignToPrint
                    },
                    showBarcode: true, openModal: true
                })
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTREGISTERSUBSAMPLETOGENERATEBARCODE" }));
            }
        }
    }

    orderMapping = (inputParam) => {
        const inputParem = {
            userinfo: this.props.Login.userInfo,
            inputParam, npreregno: inputParam.subSample.npreregno,
            sampleorderid: inputParam.subSample.sampleorderid
            , masterData: this.props.Login.masterData
        }
        this.props.getExternalOrderTypeForMapping(inputParem)
    }

    handleDateSubSampleChange = (dateValue, dateName) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    onTestPackageChange = (comboData, fieldName, nneedsubsample, specBasedComponent1, caseNo) => {
        const selectedRecord = this.state.selectedRecord || {};
        const selectSection = [];
        selectSection['nsectioncode'] = this.state.selectedRecord.nsectioncode;
        if (comboData !== null) {
            const selectPackage = this.state.selectPackage || {};

            selectPackage[fieldName] = comboData;
            selectPackage["stestpackagename"] = comboData.label;
            selectPackage["nspecsampletypecode"] = parseInt(this.state.selectedRecord.nspecsampletypecode);

            selectedRecord["nallottedspeccode"] = this.props.Login.masterData.RegistrationGetSample && this.props.Login.masterData.RegistrationGetSample[0].nallottedspeccode;

            selectedRecord[fieldName] = comboData;
            selectedRecord["stestpackagename"] = comboData.label;
            const specBasedComponent = specBasedComponent1;
            selectedRecord["nspecsampletypecode"] = this.state.selectedRecord.nspecsampletypecode && this.state.selectedRecord.nspecsampletypecode !== undefined ? this.state.selectedRecord.nspecsampletypecode :
                parseInt(this.props.Login.masterData.selectedSubSample &&
                    [...new Set(this.props.Login.masterData.selectedSubSample.map(x => x.nspecsampletypecode))].join(","));
            // selectedRecord["nspecsampletypecode"] = parseInt(this.props.Login.masterData.selectedSubSample &&
            //     [...new Set(this.props.Login.masterData.selectedSubSample.map(x => x.nspecsampletypecode))].join(","));

            this.props.testPackageTest(selectedRecord, true, this.props.Login.specBasedComponent === undefined ? specBasedComponent : this.props.Login.specBasedComponent,
                this.props.Login.Conponent, this.props.Login.selectedComponent, this.props.Login.selectedComponent,
                this.props.Login, selectPackage, selectSection, true, selectedRecord.nspecsampletypecode,
                this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample
            );
            // selectedRecord["nspecsampletypecode"] = this.state.selectedRecord.selectedSubSample!==undefined?this.state.selectedRecord.selectedSubSample &&
            // [...new Set(this.state.selectedRecord.selectedSubSample.map(x => x.nspecsampletypecode))].join(","):this.state.selectedRecord.nspecsampletypecode;
            //     this.props.testPackageTest(selectedRecord, true, this.props.Login.specBasedComponent===undefined?specBasedComponent:this.props.Login.specBasedComponent,
            //         this.props.Login.Conponent, this.props.Login.specBasedTestPackage, this.props.Login.specBasedTestPackage ? true : false, this.props.Login.Conponent,
            //         this.props.Login.selectedComponent, this.props.Login,selectPackage,true,undefined,this.state.selectedRecord.selectedSample[0],this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample
            //         );
            // selectedRecord["nspecsampletypecode"] = this.state.selectedRecord.selectedSubSample !== undefined
            //             ? this.state.selectedRecord.selectedSubSample && [...new Set(this.state.selectedRecord.selectedSubSample.map(x => x.nspecsampletypecode))].join(",")
            //             : this.state.selectedRecord.nspecsampletypecode;

            // this.props.testPackageTest(Object.keys(this.props.Login.selectedComponent).length!==0?this.props.Login.selectedComponent:this.state.selectedSpec.nallottedspeccode.item, false, this.state.specBasedComponent,
            // this.props.Login.Component, this.state.specBasedTestPackage, this.state.specBasedTestPackage ? true : false, this.state.selectComponent,
            // this.props.Login.selectedComponent, this.props.Login,selectPackage,false,this.state.selectedSpec.nallottedspeccode,this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample
            // );
            // console.log("log RD:",selectedRecord, specBasedComponent, this.props.Login.specBasedComponent,
            //                             this.props.Login.Conponent, this.props.Login.specBasedTestPackage, 
            //                             this.props.Login.Conponent,
            //                             this.props.Login.selectedComponent, this.props.Login,selectPackage,
            //                             this.state.selectedRecord.selectedSample[0],
            //                             this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample);

            // this.props.testPackageTest(selectedRecord, true, 
            //                             this.props.Login.specBasedComponent === undefined ?  specBasedComponent :this.props.Login.specBasedComponent,
            //                             this.props.Login.Component,
            //                             // this.props.Login.specBasedTestPackage, 
            //                             //this.props.Login.specBasedTestPackage ? true : false, 
            //                             this.props.Login.Component, this.props.Login.selectedComponent,this.props.Login,
            //                             selectPackage,true,undefined,
            //                             this.state.selectedRecord.selectedSample[0],
            //                             this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample
            //                             );
        }
        else {
            //ALPD-3404
            let availableTestSection = [];
            if (selectedRecord["ntestpackagecode"]) {
                delete selectedRecord["ntestpackagecode"];
                delete selectedRecord["nsectioncode"];
                delete selectedRecord["ntestgrouptestcode"];
                availableTestSection = this.props.Login.AllSection || [];
            }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedRecord, availableTest: this.props.Login.AllTest, TestCombined: this.props.Login.AllTest, TestSection: availableTestSection }
            }
            this.props.updateStore(updateInfo);
        }


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
            //commented by sonia on 5th August 2024 for JIRA ID: ALPD-4543
            //selectedRecord["nallottedspeccode"] = this.props.Login.masterData.RegistrationGetSample && this.props.Login.masterData.RegistrationGetSample[0].nallottedspeccode;
            //Added by sonia on 5th August 2024 for JIRA ID: ALPD-4543
            selectedRecord["nallottedspeccode"] = this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample[0].nallottedspeccode;

            selectedRecord[fieldName] = comboData;
            selectedRecord["ssectionname"] = comboData.label;
            const specBasedComponent = specBasedComponent1;
            selectedRecord["nspecsampletypecode"] = this.state.selectedRecord.nspecsampletypecode && this.state.selectedRecord.nspecsampletypecode !== undefined ? this.state.selectedRecord.nspecsampletypecode :
                parseInt(this.props.Login.masterData.selectedSubSample &&
                    [...new Set(this.props.Login.masterData.selectedSubSample.map(x => x.nspecsampletypecode))].join(","));
            // selectedRecord["nspecsampletypecode"] = parseInt(this.props.Login.masterData.selectedSubSample &&
            //     [...new Set(this.props.Login.masterData.selectedSubSample.map(x => x.nspecsampletypecode))].join(","));

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
                // const oldspecsampletypecode = selectComponent.nspecsampletypecode
                // if (oldspecsampletypecode !== comboData.item.nspecsampletypecode) {
                //     //selectComponent["nneedservice"] = true;
                // }
                selectedRecord[fieldName] = comboData;
                selectedRecord["Sample Name"] = comboData.label;
                selectedRecord["nspecsampletypecode"] = comboData.item.nspecsampletypecode;
                selectedRecord["ntestgrouptestcode"] = [];
                //selectedRecord["nneedsubsample"] = nneedsubsample;
                selectedRecord["nneedsubsample"] = this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample;
                this.props.componentTest(selectedRecord, true, this.props.Login.specBasedComponent,
                    this.props.Login.Conponent, this.state.specBasedTestPackage, this.props.Login.specBasedTestPackage ? true : false,
                {userinfo:this.props.Login.userInfo})
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

    onSaveSubSampleClick = (saveType, formRef) => {
        const operation = this.props.Login.operation;
        if (operation === 'create') {
            let objSubSample = this.state.selectedRecord;
            const userInfo = this.props.Login.userInfo;

            //   let saveSubSample = {};
            let sampleList = [];
            if (this.props.Login.masterData.searchedSample !== undefined) {
                //sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(this.state.skip, this.state.skip + this.state.take), "npreregno");
                const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                    : sortDataForDate(this.props.Login.masterData.RegistrationGetSample, 'dtransactiondate', 'npreregno');

                sampleList = list ? list.slice(this.state.skip, this.state.skip + this.state.take) : [];
            } else {
                sampleList = this.props.Login.masterData.RegistrationGetSample && sortDataForDate(this.props.Login.masterData.RegistrationGetSample, 'dtransactiondate', 'npreregno').slice(this.state.skip, this.state.skip + this.state.take);
            }
            sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.selectedSample, sampleList, 'npreregno')

            const findSampleAlloSpec = [...new Set(sampleList.map(item => item.nallottedspeccode))];
            // if (this.props.Login.specBasedComponent) {
            //     saveSubSample["nspecsampletypecode"] = objSubSample["nspecsampletypecode"] ? objSubSample["nspecsampletypecode"] : -1
            //     saveSubSample["ncomponentcode"] = objSubSample["ncomponentcode"] ? objSubSample["ncomponentcode"].value : -1
            // } else {
            //     const findSampleSpec = [...new Set(sampleList.map(item => item.nspecsampletypecode))];
            //     saveSubSample["nspecsampletypecode"] = findSampleSpec[0] ? findSampleSpec[0] : -1;
            //     saveSubSample["ncomponentcode"] = -1
            // }

            // saveSubSample["jsondata"] = {}
            // saveSubSample["jsonuidata"] = {}
            // const dateList = []
            // this.props.Login.masterData.SubSampleTemplate &&
            //     this.props.Login.masterData.SubSampleTemplate.jsondata.map(row => {
            //         row.children.map(column => {
            //             column.children.map(component => {
            //                 if (component.hasOwnProperty("children")) {
            //                     //let componentrowlabel = ''
            //                     // let componentrowvalue = ''
            //                     component.children.map(componentrow => {
            //                         if (componentrow.inputtype === "combo") {
            //                             saveSubSample["jsondata"][componentrow.label] = objSubSample[componentrow.label] ?
            //                                 { value: objSubSample[componentrow.label].value, label: objSubSample[componentrow.label].label } : -1

            //                             saveSubSample["jsonuidata"][componentrow.label] = objSubSample[componentrow.label] ? objSubSample[componentrow.label].label : ""

            //                             // if (componentrow.mandatory || objSubSample[componentrow.label]) {
            //                             //     componentrowlabel = componentrowlabel + '&' + componentrow.label
            //                             //     componentrowvalue = componentrowvalue + ' ' + objSubSample[componentrow.label].label
            //                             // }
            //                         }
            //                         else if (componentrow.inputtype === "date") {
            //                             if (componentrow.mandatory) {
            //                                 saveSubSample["jsondata"][componentrow.label] = convertDateTimetoStringDBFormat(objSubSample[componentrow.label] ?
            //                                     objSubSample[componentrow.label] : new Date(), userInfo);

            //                                 saveSubSample["jsonuidata"][componentrow.label] = saveSubSample["jsondata"][componentrow.label]
            //                             } else {
            //                                 saveSubSample["jsondata"][componentrow.label] = componentrow.loadcurrentdate ?
            //                                 convertDateTimetoStringDBFormat(objSubSample[componentrow.label] ?
            //                                         objSubSample[componentrow.label] : new Date(), userInfo) :
            //                                     objSubSample[componentrow.label] ? convertDateTimetoStringDBFormat(objSubSample[componentrow.label] ?
            //                                         objSubSample[componentrow.label] : new Date(), userInfo) : "";

            //                                 saveSubSample["jsonuidata"][componentrow.label] = saveSubSample["jsondata"][componentrow.label]
            //                             }
            //                             if (componentrow.timezone) {
            //                                 saveSubSample["jsondata"][`tz${componentrow.label}`] = objSubSample[`tz${componentrow.label}`] ?
            //                                     { value: objSubSample[`tz${componentrow.label}`].value, label: objSubSample[`tz${componentrow.label}`].label } :
            //                                     defaulttimezone ? defaulttimezone : -1

            //                                 saveSubSample["jsonuidata"][`tz${componentrow.label}`] = saveSubSample["jsondata"][`tz${componentrow.label}`]
            //                             }
            //                             dateList.push(componentrow.label)
            //                         }

            //                         else {
            //                             saveSubSample["jsondata"][componentrow.label] = objSubSample[componentrow.label] ?
            //                                 objSubSample[componentrow.label] : ""

            //                             saveSubSample["jsonuidata"][componentrow.label] = saveSubSample["jsondata"][componentrow.label]

            //                             // if (objSubSample[componentrow.label]) {
            //                             //     componentrowlabel = componentrowlabel + '&' + objSubSample.label
            //                             //     componentrowvalue = componentrowvalue + ' ' + objSubSample[componentrow.label]
            //                             // }
            //                         }
            //                         return saveSubSample;
            //                     })
            //                     //saveSubSample["jsondata"][componentrowlabel.substring(1)] = componentrowvalue
            //                 }
            //                 else {
            //                     if (component.inputtype === "combo") {
            //                         saveSubSample["jsondata"][component.label] = objSubSample[component.label] ?
            //                             { value: objSubSample[component.label].value, label: objSubSample[component.label].label } : -1

            //                         saveSubSample["jsonuidata"][component.label] = objSubSample[component.label] ? objSubSample[component.label].label : ""
            //                     }
            //                     else if (component.inputtype === "date") {
            //                         if (component.mandatory) {
            //                             saveSubSample["jsondata"][component.label] = convertDateTimetoStringDBFormat(objSubSample[component.label] ?
            //                                 objSubSample[component.label] : new Date(), userInfo);

            //                             saveSubSample["jsonuidata"][component.label] = saveSubSample["jsondata"][component.label]
            //                         } else {
            //                             saveSubSample["jsondata"][component.label] = component.loadcurrentdate ?
            //                             convertDateTimetoStringDBFormat(objSubSample[component.label] ?
            //                                     objSubSample[component.label] : new Date(), userInfo) :
            //                                 objSubSample[component.label] ? convertDateTimetoStringDBFormat(objSubSample[component.label] ?
            //                                     objSubSample[component.label] : new Date(), userInfo) : "";
            //                             saveSubSample["jsonuidata"][component.label] = saveSubSample["jsondata"][component.label]
            //                         }
            //                         if (component.timezone) {
            //                             saveSubSample["jsondata"][`tz${component.label}`] = objSubSample[`tz${component.label}`] ?
            //                                 { value: objSubSample[`tz${component.label}`].value, label: objSubSample[`tz${component.label}`].label } :
            //                                 defaulttimezone ? defaulttimezone : -1

            //                             saveSubSample["jsonuidata"][`tz${component.label}`] = saveSubSample["jsondata"][`tz${component.label}`]
            //                         }
            //                         dateList.push(component.label)
            //                     }
            //                     else {
            //                         saveSubSample["jsondata"][component.label] = objSubSample[component.label] ?
            //                             objSubSample[component.label] : ""

            //                         saveSubSample["jsonuidata"][component.label] = saveSubSample["jsondata"][component.label]
            //                     }
            //                 }
            //                 return saveSubSample;
            //             }
            //             )
            //             return saveSubSample;
            //         })
            //         return saveSubSample;
            //     })




            //  saveSubSample["nallottedspeccode"] = findSampleAlloSpec[0] ? findSampleAlloSpec[0] : -1;
            // Component.unshift(saveSubSample);
            let selectedTestData = objSubSample["ntestgrouptestcode"];
            const selectedTestArray = [];
            selectedTestData && selectedTestData.map((item) => {
                return selectedTestArray.push(item.item);
            });

            // const Test = this.props.Login.Test || [];
            // const ArrayTest = Test[saveComponent.slno] ? Test[saveComponent.slno] : [];
            //Test[saveComponent.slno] = [...ArrayTest, ...selectedTestArray]

            //  const saveSubSample = this.state.selectedRecord||{}

            // if (this.props.Login.specBasedComponent) {
            //   saveSubSample["nspecsampletypecode"] = objSubSample["nspecsampletypecode"] ? objSubSample["nspecsampletypecode"] : -1
            // saveSubSample["ncomponentcode"] = objSubSample["ncomponentcode"] ? objSubSample["ncomponentcode"].value : -1
            //  } 
            //   if(!this.props.Login.specBasedComponent) {
            //  const findSampleSpec = [...new Set(sampleList.map(item => item.nspecsampletypecode))];
            // objSubSample["nspecsampletypecode"] = selectedTestData&&selectedTestData.length>0?selectedTestData[0]['item']['nspecsampletypecode']:-1;
            // objSubSample["ncomponentcode"] = -1
            //  }

            const map = {}
            const param = getRegistrationSubSample(
                objSubSample,
                this.props.Login.masterData.SubSampleTemplate.jsondata,
                this.props.Login.userInfo, this.props.Login.defaulttimezone, false,
                this.props.Login.specBasedComponent, operation);

            map["RegistrationSample"] = param.sampleRegistration
            if (this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
                map["RegistrationSample"]['jsondata'] = { ...map["RegistrationSample"]['jsondata'], externalorderid: sampleList[0]['Order'] }
                map["RegistrationSample"]['jsonuidata'] = { ...map["RegistrationSample"]['jsonuidata'], externalorderid: sampleList[0]['Order'] }
            }
            map["subsampleDateList"] = param.dateList
            map["RegistrationSample"]["nallottedspeccode"] = findSampleAlloSpec[0] ? findSampleAlloSpec[0] : -1;
            // map['RegistrationSample'] = saveSubSample
            //   map['subsampleDateList'] = dateList
            map["subsamplecombinationunique"] = this.state.subsampleCombinationUnique;
            map['subsampledateconstraints'] = this.state.subsampledateconstraints;
            map['testgrouptest'] = selectedTestArray
            map['npreregno'] = sampleList.map(item => item.npreregno).join(",")
            map['userinfo'] = userInfo;
            // map['checkBoxOperation'] = 3;
            map['checkBoxOperation'] = checkBoxOperation.SINGLESELECT;
            map['ntype'] = 3;
            map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
            map["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue
                && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode;
            map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
            map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
            map["nneedjoballocation"] = this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedjoballocation;

            map["masterData"] = this.props.Login.masterData;
            map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
            map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
            map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
            map["specBasedComponent"] = this.props.Login.specBasedComponent;
            map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
            map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
            map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
            map["skipmethodvalidity"] = false;
            const obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.FromDate,
                this.state.selectedFilter.todate || this.props.Login.masterData.ToDate, this.props.Login.userInfo)
            map["FromDate"] = obj.fromDate;
            map["ToDate"] = obj.toDate;
            map["nfilterstatus"] = this.props.Login.masterData.FilterStatusValue.ntransactionstatus;
            map["loadAdhocTest"] = false;
            map["nneedmyjob"] = this.props.Login.masterData.RealRegSubTypeValue.nneedmyjob ? this.props.Login.masterData.RealRegSubTypeValue.nneedmyjob : false;


            if (this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
                map["order"] = sampleList[0]["OrderIdData"]
                const Layout = this.props.Login.masterData.registrationTemplate.jsondata;
                const cTWithoutComboData = []
                let cTData = [];


                Layout.map(row => {
                    return row.children.map(column => {
                        return column.children.map(component => {
                            return component.hasOwnProperty("children") ?
                                component.children.map(componentrow => {
                                    if (componentrow.inputtype === "combo") {
                                        cTData.push(componentrow)
                                    } else {
                                        cTWithoutComboData.push(componentrow)
                                    }
                                    return null;
                                })
                                : component.inputtype === "combo" ?
                                    cTData.push(component) : cTWithoutComboData.push(component)
                        })
                    })

                })
                let data = []
                sampleList.map(item => {
                    let dob = cTWithoutComboData.filter(x => x.name === "Date Of Birth");
                    let gender = cTData.filter(x => x.name === "Gender");
                    const age = parseInt(ageCalculate(rearrangeDateFormat(this.props.Login.userInfo, item[dob[0].label]), true));
                    data.push({ "npreregno": parseInt(item.npreregno), "nage": age, "ngendercode": item.ngendercode, 
                        "sdob": item["Date of birth"] });   // ALPD-5681	Added sdob by Vishakh to handle null issue in backend query (09-04-2025)
                    map["ageData"] = data;
                }
                )

                map["skipmethodvalidity"] = false;


            }
            let isFileupload = false;
            const formData = new FormData();
            this.props.Login.regSubSamplewithoutCombocomponent.map((item) => {
                if (item.inputtype === 'files') {
                    if (typeof objSubSample[item && item.label] === "object") {
                        objSubSample[item && item.label] && objSubSample[item && item.label].forEach((item1, index) => {
                            formData.append("uploadedFile" + index, item1);
                            formData.append("uniquefilename" + index, map["RegistrationSample"].uniquefilename);
                            formData.append("filecount", objSubSample[item && item.label].length);
                            formData.append("isFileEdited", transactionStatus.YES);
                            formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                            delete (map["RegistrationSample"].uniquefilename);
                            delete (map["RegistrationSample"][item && item.label]);
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

            this.props.saveSubSample(inputParam);
        } else {
            this.onUpdateSubSampleRegistration(saveType, formRef, operation);
        }
    }

    onSaveCancelOrderMandatoryFields = [{ "mandatory": true, "idsName": "IDS_EXTERNALORDERTYPE", "dataField": "nexternalordertypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
    { "mandatory": true, "idsName": "IDS_ORDERSAMPLEID", "dataField": "sexternalorderid", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }];

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
                //sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
                const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                    : this.props.Login.masterData.RegistrationGetSample;

                sampleList = list ? list.slice(skip, skip + take) : [];
            } else {
                sampleList = this.props.Login.masterData.RegistrationGetSample && this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take);
            }

            let addSubSampleList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedSample, "npreregno");
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
    mandatoryMappingList = () => {
        let mandatory = [];
        mandatory = [
            , { "idsName": "IDS_ORDER", "dataField": "nexternalordercode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" }

        ]


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

        //console.log("test1:", this.props.Login.masterData);

        let sampleList = [];
        const skip = this.state.skip;
        const take = this.state.take;
        if (this.props.Login.masterData.searchedSample !== undefined) {
            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.RegistrationGetSample;

            sampleList = list ? list.slice(skip, skip + take) : [];
        } else {
            sampleList = this.props.Login.masterData.RegistrationGetSample && sortDataForDate(this.props.Login.masterData.RegistrationGetSample, 'dtransactiondate', 'npreregno').slice(skip, skip + take);
        }
        const selectedSample = getSameRecordFromTwoArrays(masterData.selectedSample, sampleList, "npreregno");


        let subsampleList = [];
        const subsampleskip = this.state.subsampleskip;
        const subsampletake = this.state.subsampletake;
        if (this.props.Login.masterData.searchedSubSample !== undefined) {
            const list = this.props.Login.masterData.searchedSubSample ? this.props.Login.masterData.searchedSubSample
                : this.props.Login.masterData.RegistrationGetSubSample;

            subsampleList = list ? list.slice(subsampleskip, subsampleskip + subsampletake) : [];
        } else {
            subsampleList = this.props.Login.masterData.RegistrationGetSubSample && this.props.Login.masterData.RegistrationGetSubSample.slice(subsampleskip, subsampleskip + subsampletake);
        }
        const selectedSubsample = getSameRecordFromTwoArrays(masterData.selectedSubSample, subsampleList, "npreregno");


        //const selectedSubsample = getSameRecordFromTwoArrays(masterData.selectedSubSample, masterData.RegistrationGetSubSample.slice(this.state.subsampleskip, (this.state.subsampleskip + this.state.subsampletake)), "npreregno");
        //const selectedSample = getSameRecordFromTwoArrays(masterData.selectedSample, masterData.RegistrationGetSample.slice(this.state.skip, (this.state.skip + this.state.take)), "npreregno");
        ////  selectedSubsample =masterData.selectedSubSample.slice(this.state.skip, (this.state.skip + this.state.take));


        const ntransactionsamplecode = selectedSubsample.map(x => x.ntransactionsamplecode).join(",");
        let data = [];

        let obj = convertDateValuetoString(this.props.Login.masterData.RealFromDate,
            this.props.Login.masterData.RealToDate, this.props.Login.userInfo);

        if (this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {

            const Layout = this.props.Login.masterData.registrationTemplate.jsondata;
            const cTWithoutComboData = []
            let cTData = [];


            Layout.map(row => {
                return row.children.map(column => {
                    return column.children.map(component => {
                        return component.hasOwnProperty("children") ?
                            component.children.map(componentrow => {
                                if (componentrow.inputtype === "combo") {
                                    cTData.push(componentrow)
                                } else {
                                    cTWithoutComboData.push(componentrow)
                                }
                                return null;
                            })
                            : component.inputtype === "combo" ?
                                cTData.push(component) : cTWithoutComboData.push(component)
                    })
                })

            })
            selectedSample.map(item => {
                let dob = cTWithoutComboData.filter(x => x.name === "Date Of Birth")
                let gender = cTData.filter(x => x.name === "Gender")
                const ageCal = parseInt(ageCalculate(item[dob[0].label], true));
                data.push({ "npreregno": parseInt(item.npreregno), "nage": ageCal, "ngendercode": item.ngendercode, 
                    "sdob": item["Date of birth"] });    // ALPD-5680	Added sdob by Vishakh to handle null issue in backend query (09-04-2025)
            }
            )

        }
        const inputData = {
            nneedjoballocation: masterData.RealRegSubTypeValue.nneedjoballocation ? masterData.RealRegSubTypeValue.nneedjoballocation : false,
            nneedmyjob: masterData.RealRegSubTypeValue.nneedmyjob ? masterData.RealRegSubTypeValue.nneedmyjob : false,
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
            nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
            //  checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            napproveconfversioncode: this.props.Login.masterData.RealApprovalConfigVersionValue
                && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode || -1,
            activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
            activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
            ageData: data,
            nsampletypecode: this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
            ntestpackagecode: this.state.selectedRecord['ntestpackagecode'] && this.state.selectedRecord['ntestpackagecode'],
            skipmethodvalidity: false,
            loadAdhocTest: false
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
    //ALPD-3615--Start
    onSaveAdhocTestClick = (saveType, formRef) => {
        const masterData = this.props.Login.masterData;

        //console.log("test1:", this.props.Login.masterData);

        let sampleList = [];
        const skip = this.state.skip;
        const take = this.state.take;
        if (this.props.Login.masterData.searchedSample !== undefined) {
            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.RegistrationGetSample;

            sampleList = list ? list.slice(skip, skip + take) : [];
        } else {
            sampleList = this.props.Login.masterData.RegistrationGetSample && sortDataForDate(this.props.Login.masterData.RegistrationGetSample, 'dtransactiondate', 'npreregno').slice(skip, skip + take);
        }
        const selectedSample = getSameRecordFromTwoArrays(masterData.selectedSample, sampleList, "npreregno");


        let subsampleList = [];
        const subsampleskip = this.state.subsampleskip;
        const subsampletake = this.state.subsampletake;
        if (this.props.Login.masterData.searchedSubSample !== undefined) {
            const list = this.props.Login.masterData.searchedSubSample ? this.props.Login.masterData.searchedSubSample
                : this.props.Login.masterData.RegistrationGetSubSample;

            subsampleList = list ? list.slice(subsampleskip, subsampleskip + subsampletake) : [];
        } else {
            subsampleList = this.props.Login.masterData.RegistrationGetSubSample && this.props.Login.masterData.RegistrationGetSubSample.slice(subsampleskip, subsampleskip + subsampletake);
        }
        const selectedSubsample = getSameRecordFromTwoArrays(masterData.selectedSubSample, subsampleList, "npreregno");
        const selectedSampleSpecType = getSameRecordFromTwoArrays(masterData.selectedSubSample, masterData.selectedSample, "npreregno");

        const ntransactionsamplecode = selectedSubsample.map(x => x.ntransactionsamplecode).join(",");
        let data = [];

        let obj = convertDateValuetoString(this.props.Login.masterData.RealFromDate,
            this.props.Login.masterData.RealToDate, this.props.Login.userInfo);

        if (this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {

            const Layout = this.props.Login.masterData.registrationTemplate.jsondata;
            const cTWithoutComboData = []
            let cTData = [];


            Layout.map(row => {
                return row.children.map(column => {
                    return column.children.map(component => {
                        return component.hasOwnProperty("children") ?
                            component.children.map(componentrow => {
                                if (componentrow.inputtype === "combo") {
                                    cTData.push(componentrow)
                                } else {
                                    cTWithoutComboData.push(componentrow)
                                }
                                return null;
                            })
                            : component.inputtype === "combo" ?
                                cTData.push(component) : cTWithoutComboData.push(component)
                    })
                })

            })
            selectedSample.map(item => {
                let dob = cTWithoutComboData.filter(x => x.name === "Date Of Birth")
                let gender = cTData.filter(x => x.name === "Gender")
                const ageCal = parseInt(ageCalculate(item[dob[0].label], true));
				//ALPD-5684--Added by Vignesh R(10-04-2025)-->Adhoc Test---> When try to add the test, 500 occurs
                data.push({ "npreregno": parseInt(item.npreregno), "nage": ageCal, "ngendercode": item.ngendercode,"sdob": item["Date of birth"] })
            }
            )

        }
        this.state.selectedRecord.ntestcode.item['nisvisible'] = this.state.selectedRecord.visibleadhoctest;
        this.state.selectedRecord.ntestcode.item['nisadhoctest'] = transactionStatus.YES;
        const inputData = {
            nneedjoballocation: masterData.RealRegSubTypeValue.nneedjoballocation ? masterData.RealRegSubTypeValue.nneedjoballocation : false,
            nneedmyjob: masterData.RealRegSubTypeValue.nneedmyjob ? masterData.RealRegSubTypeValue.nneedmyjob : false, //ALPD-4046
            TestGroupTest: this.state.selectedRecord.ntestcode.item,
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
            nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
            checkBoxOperation: 3,
            napproveconfversioncode: this.props.Login.masterData.RealApprovalConfigVersionValue
                && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode || -1,
            activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
            activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
            ageData: data,
            nsampletypecode: this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
            ntestpackagecode: this.state.selectedRecord['ntestpackagecode'] && this.state.selectedRecord['ntestpackagecode'],
            skipmethodvalidity: false,
            loadAdhocTest: this.props.Login.loadAdhocTest,
            nspecsampletypecode: selectedSampleSpecType.map(item => ({ "nspecsampletypecode": item["nspecsampletypecode"] })),
            ncontrolCode: this.state.adhocTestId
        }

        const inputParam = {
            inputData,
            classUrl: "registration",
            operation: this.props.Login.operation,
            methodUrl: "AdhocTest",
            responseKeyList: [
                { "responseKey": "selectedSample", "masterDataKey": "RegistrationGetSample", "primaryKey": "npreregno", "dataAction": "update" },
                { "responseKey": "selectedSubSample", "masterDataKey": "RegistrationGetSubSample", "primaryKey": "ntransactionsamplecode", "dataAction": "update" },
                { "responseKey": "selectedTest", "masterDataKey": "RegistrationGetTest", "primaryKey": "ntransactiontestcode", "dataAction": "add" }],
            saveType, formRef,
            postParamList: this.postParamList,
            action: 'adhocTest'

        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.createAdhocTest(inputParam, masterData, "openModal");
        }
    }
    //ALPD-3615--End
    getRegistrationComboService = (ScreenName, operation,
        primaryKeyField, masterData, userInfo, editId, importData) => {

        const ndesigntemplatemappingcodefilter = this.props.Login.masterData.DesignTemplateMappingValue &&
            this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode;
        if (ndesigntemplatemappingcodefilter === this.props.Login.masterData.ndesigntemplatemappingcode) {


            let data = [];
            const withoutCombocomponent = []
            const Layout = this.props.Login.masterData.registrationTemplate
                && this.props.Login.masterData.registrationTemplate.jsondata
            if (Layout !== undefined) {
				
				//ALPD-5530--Vignesh R(06-03-2025)--record allowing the pre-register when the approval config retired
                if(this.props.Login.masterData.RealApprovalConfigVersionValue && this.props.Login.masterData.RealApprovalConfigVersionValue.ntransactionstatus===transactionStatus.APPROVED){

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
                    nsampletypecode: parseInt(this.props.Login.masterData.RealSampleTypeValue.nsampletypecode),
                    sampletypecategorybasedflow: parseInt(this.props.Login.masterData.RealSampleTypeValue.ncategorybasedflowrequired),
                    nneedsubsample: this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample === true ? transactionStatus.YES : transactionStatus.NO,
                    ntestgroupspecrequired: this.props.Login.masterData.RealRegSubTypeValue.ntestgroupspecrequired === true ? transactionStatus.YES : transactionStatus.NO , //ALPD-4834, Vishakh, Added key to send ntestgroupspecrequired to backend
                    
                    //ALPD-5530--Vignesh R(06-03-2025)--record allowing the pre-register when the approval config retired
                    napproveconfversioncode:this.props.Login.masterData.RealApprovalConfigVersionValue && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode
                }
                this.props.getPreviewTemplate(masterData, userInfo, editId,
                    data, this.state.selectedRecord, childColumnList,
                    comboComponents, withoutCombocomponent, true, false,
                    mapOfFilterRegData, false, "create", this.props.Login.masterData.RealRegSubTypeValue.sregsubtypename, importData)
          } 
          else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVEDCONFIGVERSION" }));

        } 
        } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_CONFIGURETEMPLATE" }));
            //}
        }
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVEDDESIGNTEMPLATE" }));
        }
    }
    getBarcodeAndPrinter = (ScreenName, operation,
        primaryKeyField, masterData, userInfo, editId) => {
        toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVEDDESIGNTEMPLATE" }));
    }


    printBarcode = (inputParam) => {

        this.setState({
            selectedRecord: {
                barcodevalue: inputParam.sample.sarno,
                barcodeData: inputParam.sample
            },
            showQRCode: true, openModal: true
        })
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
                selectedSubSample: this.props.Login.masterData.selectedSubSample,
                ntransactionsamplecode: this.props.Login.masterData.selectedSubSample ? this.props.Login.masterData.selectedSubSample.map(item => item.ntransactionsamplecode).join(",") : "-1",
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
                    registrationTestHistoryDataState: this.state.registrationTestHistoryDataState
                }
                this.props.getTestChildTabDetailRegistration(inputData, true)
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))
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

    onCreateTestConfirm = () => {
        this.showAlert();
        const inputData = {
            ...this.props.Login.createTestConfirmParam.inputParam.inputData,
            skipmethodvalidity: true
        }
        if (this.props.Login.loadAdhocTest) {
            this.props.createAdhocTest({ ...this.props.Login.createTestConfirmParam.inputParam, inputData },
                this.props.Login.createTestConfirmParam.masterData,
                this.props.Login.createTestConfirmParam.modalName)
        } else {
            this.props.createRegistrationTest({ ...this.props.Login.createTestConfirmParam.inputParam, inputData },
                this.props.Login.createTestConfirmParam.masterData,
                this.props.Login.createTestConfirmParam.modalName)
        }
    }
//ALPD-5315->Added by Dhanushya RI, To apply the logic of method validity when import data
    onPreregConfirm = () => {
        this.showAlert();
        const inputData = {
            ...this.props.Login.preregConfirmParam.inputParam.inputData,
            skipmethodvalidity: true
        }
        if(this.props.Login.preregConfirmParam.inputParam.inputData.hasOwnProperty("importTest")){
            const mapData = this.props.Login.preregConfirmParam.inputParam.formData.get("Map");    
            let parsedData = JSON.parse(mapData);   
            parsedData.skipmethodvalidity = true;    
            const updatedMapData = JSON.stringify(parsedData);
            this.props.Login.preregConfirmParam.inputParam.formData.set("Map", updatedMapData);
            
            this.props.insertRegSample({ ...this.props.Login.preregConfirmParam.inputParam, inputData },
                this.props.Login.preregConfirmParam.masterData);
           
       }  
       else if(this.props.Login.preregConfirmParam.inputParam.isFileupload){
            const mapData = this.props.Login.preregConfirmParam.inputParam.formData.get("Map");    
            let parsedData = JSON.parse(mapData);   
            parsedData.skipmethodvalidity = true;    
            const updatedMapData = JSON.stringify(parsedData);
            this.props.Login.preregConfirmParam.inputParam.formData.set("Map", updatedMapData);
            
            this.props.insertRegistration({ ...this.props.Login.preregConfirmParam.inputParam, inputData },
                this.props.Login.preregConfirmParam.masterData);
       
        }  
       else{
        this.props.insertRegistration({ ...this.props.Login.preregConfirmParam.inputParam, inputData },
            this.props.Login.preregConfirmParam.masterData);
        }
    }

    onCreateSubSampleConfirm = () => {
        this.showAlert();
        const inputData = {
            ...this.props.Login.subSampleConfirmParam.inputParam.inputData,
            skipmethodvalidity: true,

        }
        this.props.saveSubSample({ ...this.props.Login.subSampleConfirmParam.inputParam, inputData });
    }

    onAcceptConfirm = () => {
        this.showAlert();

        let inputData = { ...this.props.Login.acceptConfirmParam.inputParam.inputData }
        inputData['url'] = this.props.Login.settings[24];
        inputData = {
            ...inputData,
            skipmethodvalidity: true
        }
        this.props.acceptRegistration({ ...this.props.Login.acceptConfirmParam.inputParam, inputData },
            this.props.Login.acceptConfirmParam.masterData);
    }

    confirmAlert = () => {
        if (this.state.showConfirmAlert) {
            if (this.props.Login.regDateEditConfirmMessage) {
                this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_WARNING" }),
                    this.props.intl.formatMessage({ id: "IDS_WARNING" }),
                    this.props.Login.regDateEditConfirmMessage,
                    this.props.intl.formatMessage({ id: "IDS_OK" }),
                    this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                    () => this.onUpdateRegistrationConfirm(),
                    undefined,
                    () => this.showAlert());
            }
            if (this.props.Login.createTestConfirmMessage) {
                this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_WARNING" }),
                    this.props.intl.formatMessage({ id: "IDS_WARNING" }),
                    this.props.Login.createTestConfirmMessage,
                    this.props.intl.formatMessage({ id: "IDS_OK" }),
                    this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                    () => this.onCreateTestConfirm(),
                    undefined,
                    () => this.showAlert());
            }
            else if (this.props.Login.preregConfirmMessage) {
                this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_WARNING" }),
                    this.props.intl.formatMessage({ id: "IDS_WARNING" }),
                    this.props.Login.preregConfirmMessage,
                    this.props.intl.formatMessage({ id: "IDS_OK" }),
                    this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                    () => this.onPreregConfirm(),
                    undefined,
                    () => this.showAlert());
            }
            else if (this.props.Login.subSampleConfirmMessage) {
                this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_WARNING" }),
                    this.props.intl.formatMessage({ id: "IDS_WARNING" }),
                    this.props.Login.subSampleConfirmMessage,
                    this.props.intl.formatMessage({ id: "IDS_OK" }),
                    this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                    () => this.onCreateSubSampleConfirm(),
                    undefined,
                    () => this.showAlert());
            }
            else if (this.props.Login.acceptConfirmMessage) {
                this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_WARNING" }),
                    this.props.intl.formatMessage({ id: "IDS_WARNING" }),
                    this.props.Login.acceptConfirmMessage,
                    this.props.intl.formatMessage({ id: "IDS_OK" }),
                    this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                    () => this.onAcceptConfirm(),
                    undefined,
                    () => this.showAlert());
            }
            else {
                this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_WARNING" }),
                    this.props.intl.formatMessage({ id: "IDS_WARNING" }),
                    this.props.Login.booleanFlag, "ok", "Cancel",
                    () => this.insertRegistration(false), undefined, () => this.showAlert());
            }
        }
    }

    closeFilter = () => {
        let Map = {};
        //  selectedFilter["fromdate"]
        const obj = convertDateValuetoString(this.props.Login.masterData.RealFromDate, this.props.Login.masterData.RealToDate, this.props.Login.userInfo);
        Map['inputValues'] = {
            FromDate: this.props.Login.masterData.RealFromDate || new Date(),
            ToDate: this.props.Login.masterData.RealToDate || new Date(),
            fromdate: rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.RealFromDate) || new Date(),
            todate: rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.RealToDate) || new Date(),
            SampleType: this.props.Login.masterData.RealSampleTypeList || [],
            SampleTypeValue: this.props.Login.masterData.RealSampleTypeValue || {},
            RegistrationType: this.props.Login.masterData.RealRegTypeList || [],
            RegistrationSubType: this.props.Login.masterData.RealRegSubTypeList || [],
            FilterStatus: this.props.Login.masterData.RealFilterStatuslist || [],
            DesignTemplateMapping: this.props.Login.masterData.RealDesignTemplateMappingList || [],
            ApprovalConfigVersion: this.props.Login.masterData.RealApprovalConfigVersionList || [],
            RegTypeValue: this.props.Login.masterData.RealRegTypeValue || {},
            RegSubTypeValue: this.props.Login.masterData.RealRegSubTypeValue || {},
            FilterStatusValue: this.props.Login.masterData.RealFilterStatusValue || {},
            ApprovalConfigVersionValue: this.props.Login.masterData.RealApprovalConfigVersionValue || {},
            DesignTemplateMappingValue: this.props.Login.masterData.RealDesignTemplateMappingValue || {},
            ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode || -1,
            napproveconfversioncode: this.props.Login.masterData.RealApprovalConfigVersionValue
                && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode || -1
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false, masterData: { ...this.props.Login.masterData, ...Map.inputValues }, selectedFilter: { todate: Map.inputValues.todate, fromdate: Map.inputValues.fromdate } }
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
        let disableSplit = false;
        if (this.myRef && this.myRef.current && this.myRef.current.clientHeight + 20 !== this.state.fixefScrollHeight) {


            fixefScrollHeight = this.myRef.current.clientHeight + 20;
            let disableSplit = true;
        }
        this.setState({
            showSample: true, showSubSample: false,
            showTest: false,
            fixefScrollHeight: fixefScrollHeight,
            disableSplit: disableSplit
        })
    }

    showTest() {
        let fixefScrollHeight = this.state.fixefScrollHeight
        let disableSplit = false;
        if (this.myRef && this.myRef.current && this.myRef.current.clientHeight + 20 !== this.state.fixefScrollHeight) {


            fixefScrollHeight = this.myRef.current.clientHeight + 20;
            let disableSplit = true;
        }

        this.setState({
            showSample: false, showSubSample: false,
            showTest: true,
            fixefScrollHeight: fixefScrollHeight,
            disableSplit: disableSplit
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
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }));
            }
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTMANUFACTURER" }));
        }
    }

    onNumericInputChange = (value, name) => {
        const selectComponent = this.state.selectComponent || {};
        if ((name !== "nnoofcontainer") && (value === 0 || value === 0.0)) {
            selectComponent[name] = '';
            this.setState({ selectComponent });
        }
        else if (name === 'nbarcodeprintcount') {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[name] = value;
            this.setState({ selectedRecord });
        }

        else {
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
   editTestMethod = (inputParam) => {
        const inputData = {
            userinfo: this.props.Login.userInfo,
            ntransactiontestcode: inputParam.masterData.selectedTestCode,
            masterData: this.props.Login.masterData,
            ncontrolCode: inputParam.ncontrolCode,
            mastertoedit:inputParam.mastertoedit,
            nneedjoballocation: inputParam.masterData && inputParam.masterData.RealRegSubTypeValue.nneedjoballocation,
            nneedmyjob : inputParam.masterData && inputParam.masterData.RealRegSubTypeValue.nneedmyjob,
            testskip:this.state.testskip ,
            testtake: this.state.testtake,
            subsampleskip:this.state.subsampleskip,
            subsampletake: this.state.subsampletake,
            primaryKeyName:inputParam.primaryKeyName
        };
        this.props.getTestMethod(inputData,this.props.Login.activeTestTab);
    }
	 onSaveTestMethod = (saveType, formRef)=>{
        const masterData = this.props.Login.masterData;
        const inputData = {
            userinfo: this.props.Login.userInfo, 
            nmethodcode: this.state.selectedRecord && this.state.selectedRecord.nmethodcode && this.state.selectedRecord.nmethodcode.value || -1,
            ntransactiontestcode: String(this.props.Login.masterData && this.props.Login.masterData.selectedTest[0].ntransactiontestcode),
            nneedjoballocation: masterData && masterData.RealRegSubTypeValue.nneedjoballocation,
            nneedmyjob : masterData && masterData.RealRegSubTypeValue.nneedmyjob,
            ntype: checkBoxOperation.SINGLESELECT,
            npreregno :this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.length > 0 ?
            String(this.props.Login.masterData.selectedSample.map(x => x.npreregno).join(",")):"-1",
            ndesigntemplatemappingcode : this.props.Login.masterData && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
            ntransactionsamplecode : this.props.Login.masterData.selectedSubSample && this.props.Login.masterData.selectedSubSample.length > 0 ?
            String(this.props.Login.masterData.selectedSubSample.map(sample => sample.ntransactionsamplecode).join(",")) : "-1",
            activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS"

        }

        let inputParam = {
            classUrl: "registration",
            methodUrl: "TestMethod",
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef,
			//ALPD-5511--Added by Vignesh R(Esign for method edit)
            action: 'editTestMethod'

        };

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
            this.props.onUpdateTestMethod(inputParam, masterData);
        }
    }
    
	
    acceptRegistration = (registerId, skip, take) => {
        let sampleList = [];
        if (this.props.Login.masterData.searchedSample !== undefined) {
            // sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.RegistrationGetSample;

            sampleList = list ? list.slice(skip, skip + take) : [];
        } else {
            sampleList = this.props.Login.masterData.RegistrationGetSample
                && sortDataForDate(this.props.Login.masterData.RegistrationGetSample, 'dtransactiondate', 'npreregno').slice(skip, skip + take);
        }

        // let sampleList = this.props.Login.masterData.searchedSample || [...this.props.Login.masterData.RegistrationGetSample].splice(skip, skip + take);
        let acceptList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedSample, "npreregno");
        if (acceptList && acceptList.length > 0) {
            if (acceptList.every(this.checkPreregisterAndQuarentine)) {
                if (this.props.Login.masterData.selectedTest !== undefined && this.props.Login.masterData.selectedTest.length > 0) {
                    // if (checkTestPresent(this.props.Login.masterData.RegistrationGetTest, acceptList)) {
                    let Map = {};
                    Map["fromdate"] = "";
                    Map["todate"] = "";
                    Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
                    Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                    Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
                    Map["nportalrequired"] = this.props.Login.masterData.RealSampleTypeValue.nportalrequired;
                    Map["nneedjoballocation"] = this.props.Login.masterData.RealRegSubTypeValue.nneedjoballocation ?
                        this.props.Login.masterData.RealRegSubTypeValue.nneedjoballocation : false;
                    Map["nfilterstatus"] = -1;
                    Map["ninsertMaterialInventoryTrans"] = parseInt(this.props.Login.settings && this.props.Login.settings['53']);
                    Map["npreregno"] = acceptList &&
                        acceptList.map(sample => sample.npreregno).join(",");
                    // Map["npreregno"] = this.props.Login.masterData.selectedSample &&
                    //     this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",");
                    Map["registrationsample"] = this.props.Login.masterData.RegistrationGetSubSample;

                    let sampleCode = '';
                    this.props.Login.masterData.RegistrationGetSubSample && (this.props.Login.masterData.RegistrationGetSubSample.map(sample => {
                        if (sample.ntransactionstatus != transactionStatus.CANCELLED && sample.ntransactionstatus != transactionStatus.REJECT) {
                            sampleCode += sample.ntransactionsamplecode + ','
                        }
                    }))
                    Map["ssamplecode"] = sampleCode.substring(0, sampleCode.length - 1);
                    // Map["ssamplecode"] =  this.props.Login.masterData.RegistrationGetSubSample && (this.props.Login.masterData.RegistrationGetSubSample.map(x => x.ntransactionstatus != transactionStatus.CANCELLED &&  x.ntransactionstatus != transactionStatus.REJECT ? x.ntransactionsamplecode :"").join(",")).replace(/^,/, '');
                    Map["registration"] = acceptList;//this.props.Login.masterData.selectedSample;
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

                    Map["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue
                        && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode;
                    Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
                    Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
                    // Map["checkBoxOperation"] = 3
                    Map["checkBoxOperation"] = checkBoxOperation.SINGLESELECT;

                    Map["stransactiontestcode"] = this.props.Login.masterData.selectedTest.map(sample => sample.ntransactiontestcode).join(",");
                    Map["url"] = this.props.Login.settings[24];
                    Map["skipmethodvalidity"] = false;
                    Map["OrderCodeData"] = acceptList &&
                        acceptList.map(sample => sample.hasOwnProperty("OrderCodeData") ? sample.OrderCodeData : -1).join(",");
                    Map["noutsourcerequired"] = this.props.Login.masterData.RealSampleTypeValue.noutsourcerequired;
                    Map["nneedmyjob"] = this.props.Login.masterData.RealRegSubTypeValue.nneedmyjob ?
                    this.props.Login.masterData.RealRegSubTypeValue.nneedmyjob : false;
                    Map["nneedtestinitiate"] = this.props.Login.masterData.RealRegSubTypeValue.nneedtestinitiate ?
                    this.props.Login.masterData.RealRegSubTypeValue.nneedtestinitiate : false;
                    Map["integrationsettings"] = this.props.Login.integrationSettings;
                    Map["ncontrolcode"] = registerId;
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
                    // } 
                    // else {
                    //     let Map = {};
                    //     Map["fromdate"] = "";
                    //     Map["todate"] = "";
                    //     Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
                    //     Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                    //     Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
                    //     Map["nfilterstatus"] = -1;
                    //     Map["npreregno"] = acceptList &&
                    //         acceptList.map(sample => sample.npreregno).join(",");
                    //     // Map["npreregno"] = this.props.Login.masterData.selectedSample &&
                    //     //     this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",");
                    //     Map["registrationsample"] = this.props.Login.masterData.selectedSubSample;
                    //     Map["registrationtest"] = this.props.Login.masterData.selectedTest;
                    //     Map["userinfo"] = this.props.Login.userInfo;
                    //     Map["nflag"] = 2;
                    //     Map["ntype"] = 1;
                    //     Map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
                    //     Map["activeSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
                    //     Map["activeSubSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
                    //     Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                    //         && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;

                    //         Map["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue
                    //         && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode;
                    //         Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                    //         && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
                    //     Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                    //         && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
                    //     Map["checkBoxOperation"] = 3
                    //     Map["stransactiontestcode"] = this.props.Login.masterData.selectedTest.map(sample => sample.ntransactiontestcode).join(",");
                    //     let inputParam = {
                    //         inputData: Map,
                    //         postParamList: this.postParamList,
                    //         action: 'accept'
                    //     }
                    //     this.confirmMessage.confirm("Confirmation", "Confirmation!", "IDS_REGISTERACTIONNEEDVALIDSTATUSTEST",
                    //         "OK", "Cancel", () => this.acceptRegistrationConfirm(inputParam, registerId));
                    // }
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

    acceptRegistrationConfirm = (inputParam, registerId) => {
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
            this.props.acceptRegistration(inputParam, this.props.Login.masterData)
        }

    }

    selectQuarantine = (quarantineId, skip, take) => {
        // let sampleList = this.props.Login.masterData.searchedSample || (this.props.Login.masterData.RegistrationGetSample ? [...this.props.Login.masterData.RegistrationGetSample].splice(skip, skip + take) : []);

        let sampleList = [];
        const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
            : sortDataForDate(this.props.Login.masterData.RegistrationGetSample, 'dtransactiondate', 'npreregno');

        sampleList = list ? list.slice(skip, skip + take) : [];
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
                Map["selectedSample"] = quarentineList;//this.props.Login.masterData.selectedSample;
                Map["userinfo"] = this.props.Login.userInfo;
                Map["nflag"] = 2;
                Map["ntype"] = 1;
                Map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
                Map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
                Map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
                Map["withoutgetparameter"] = 3;
                Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                    && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;

                Map["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue
                    && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode;
                Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
                Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
                //Map["checkBoxOperation"] = 3
                // Map["checkBoxOperation"] = 3
                Map["checkBoxOperation"] = checkBoxOperation.SINGLESELECT;

                Map["stransactiontestcode"] = this.props.Login.masterData.selectedTest && this.props.Login.masterData.selectedTest === undefined ? '-1' : this.props.Login.masterData.selectedTest.map(sample => sample.ntransactiontestcode).join(",");
                Map["ntransactionstatus"] = quarentineList &&
                    quarentineList.map(transactionStatus => transactionStatus.ntransactionstatus).join(",");
                //Map["ninsertpreregno"] = quarantineSample.quarantineSample.npreregno;
                let inputParam = {
                    inputData: Map,
                    postParamList: this.postParamList,
                    action: 'quarantine'
                }
                //console.log("inputParam, quarantine:", inputParam);
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, quarantineId)) {
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
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTPREREGISTERSAMPLES" }))
            }
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTPREREGISTERSAMPLES" }))
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

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        const selectedPrinterData = this.state.selectedPrinterData || {};

        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            if (event.target.name === 'nclientprinter' && event.target.checked === true) {

                //const printers =   window.navigator.printer.getPrinters();
                /////const names = printers.map(printer => printer.name);

                //selectedPrinterDatas {printername: { = names;
                // this.setState({ selectedPrinterData });

            }
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName) => {
        // if (comboData !== null) {
        let selectedDetailField = {};
        const selectedRecord = this.state.selectedRecord || {};
        if (fieldName === 'nexternalordercode') {
            // selectedRecord[fieldName] = comboData;
            selectedDetailField = comboData && comboData.item
            //   this.setState({ selectedRecord, selectedDetailField });
        }
        //  else if (fieldName === "nexternalordertypecode") {
        //     selectedRecord[fieldName] = comboData;
        //     const inputParem = {
        //         userinfo: this.props.Login.userInfo,
        //         selectedRecord,
        //         externalordertypecode: selectedRecord["nexternalordertypecode"].value,
        //         npreregno: this.props.Login.orderDetails && this.props.Login.orderDetails.subSample.npreregno,
        //         sampleorderid: this.props.Login.orderDetails && this.props.Login.orderDetails.subSample.sampleorderid
        //         , masterData: this.props.Login.masterData
        //     }
        //     this.props.getExternalOrderForMapping(inputParem)
        // } 
        // else {
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord, selectedDetailField });
        // }

        // }
    }
    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    };

    onComboTestPackageChange = (comboData, fieldName) => {
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
        //ALPD-3615
        else if (this.props.Login.loadAdhocTest) {
            if (this.props.Login.loadEsign) {
                loadEsign = false;
                // openModal = false;
                // selectedRecord = {};
                // availableAdhocTest = [];
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
		let needMethod = this.props.Login.needMethod;

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
			needMethod = false;

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openModal, loadPreregister, selectedRecord,
                    screenName, insertSourcePreregno: undefined, multiFilterLoad,
                    loadPrinter, openPortal,
                    Component, subSampleDataGridList, selectedPrinterData, outsourcetest,needMethod
                }
            }
            this.props.updateStore(updateInfo);
        }
    }

    onSaveCancelOrder = () => {
        if (this.state.addedOrderSampleList.length > 0) {
            let sexternalordersamplecode = this.state.addedOrderSampleList && (this.state.addedOrderSampleList.map(x => x.nexternalordersamplecode).join(",")).replace(/,\s*$/, "");
            // let sexternalordercode = this.state.addedOrderSampleList && (this.state.addedOrderSampleList.map(x=>x.nexternalordercode).join(",")).replace(/,\s*$/, "");
            const unique = [...new Map(this.state.addedOrderSampleList.map((m) => [m.nexternalordercode, m])).values()];
            let sexternalordercode = unique.map(x => x.nexternalordercode).join(",").replace(/,\s*$/, "");

            const inputData = {
                sexternalordersamplecode: sexternalordersamplecode,
                sexternalordercode: sexternalordercode,
                userinfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData,
                url: this.props.Login.settings[24]
            }

            const inputParam = { inputData }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true,
                        screenName: "ExternalOrderSample",
                        operation: "cancel"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.onUpdateCancelExternalOrder(inputParam);
            }

        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTEXTERNALSAMPLEID" }));
        }
    }

    onSaveClick = (saveType, formRef) => {
        let operation = this.props.Login.operation;
        if (operation === "update") {
            this.onUpdateRegistration(saveType, formRef, operation);
        }
    }
    //Start of ALPD-4130 , on Save handler of Additional Filter Slide out - ATE-241
    onSaveMultiFilterClick = () => {

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
                            RegistrationGetSubSample: [],
                            RegistrationGetTest: [],
                            RegistrationTestComment: [],
                            RegistrationParameter: [],
                            RegistrationTestAttachment: [],
                            RegistrationComment: [],
                            RegistrationSampleAttachment: [],
                            RegistrationSampleComment: [],
                            ExternalOrderAttachmentList: [],
                            OutsourceDetailsList: [],
                        },
                        multiFilterLoad: false,
                        openModal: false,
                        searchSampleRef,
                    }
                };
                this.props.updateStore(updateInfo);
            }
            else {
                selectedSample.push(searchedSample[0]);
                const inputData = {
                    activeSampleTab: masterData.activeSampleTab,
                    activeSubSampleTab: masterData.activeSubSampleTab,
                    activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 4 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 4 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
                    activeTestTab: masterData.activeTestTab,
                    checkBoxOperation: masterData.checkBoxOperation,
                    childTabsKey: ["RegistrationAttachment", "RegistrationGetSubSample",
                        "RegistrationGetTest", "RegistrationSampleComment", "RegistrationSampleAttachment", "selectedSubSample", "selectedTest",
                        "RegistrationComment", "ExternalOrderAttachmentList", "OutsourceDetailsList", "RegistrationParameter", "RegistrationTestAttachment",
                        "RegistrationTestComment"],
                    ndesigntemplatemappingcode: masterData.ndesigntemplatemappingcode,
                    nneedsubsample: masterData.nneedsubsample,
                    // nneedtemplatebasedflow:"",
                    npreregno: selectedSample[0].npreregno && selectedSample[0].npreregno.toString(),
                    nregsubtypecode: masterData.nregsubtypecode,
                    nregtypecode: masterData.nregtypecode,
                    nsampletypecode: masterData.nsampletypecode,
                    ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                    removeElementFromArray: masterData.selectedSample,
                    resultDataState: this.state.resultDataState,
                    sample: selectedSample,
                    searchSubSampleRef: this.searchSubSampleRef,
                    searchTestRef: this.searchTestRef,
                    // secondarySelection:"",
                    selectedSample: selectedSample,
                    subsampleskip: 0,
                    searchSampleRef: this.searchSampleRef,
                    testskip: 0,
                    skip: 0,
                    userinfo: this.props.Login.userInfo,
                    masterData: { ...masterData, searchedSample, selectedSample, kendoFilterList: kendoFilterList },
                    openModal: false,
                    multiFilterLoad: false,
                };

                this.props.getRegistrationsubSampleDetail(inputData, true);
            }
        }
    }
    //  End of ALPD-4130 , on Save End

    onSavePrinterClick = () => {
        let insertlist = [];
        //this.state.selectedPrinterData.sprintername && this.state.selectedPrinterData.sprintername.map(source=>insertlist.push({npreregno:this.props.Login.insertSourcePreregno,sprintername:source.value}))
        const inputParam = {
            classUrl: 'barcode',
            methodUrl: 'Barcode',
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                npreregno: this.props.Login.insertPrinterPreregno,
                sbarcodename: this.state.selectedPrinterData.sbarcodename ? this.state.selectedPrinterData.sbarcodename.value : '',
                sprintername: this.state.selectedPrinterData.sprintername ? this.state.selectedPrinterData.sprintername.value : '',
                insertlist,
                npreregno: this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(x => x.npreregno).join(",") : "-1",
                ntransactionsamplecode: this.props.Login.masterData.selectedSubSample ? this.props.Login.masterData.selectedSubSample.map(x => x.ntransactionsamplecode).join(",") : "-1",
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
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTANYONEFILETOSUBMIT" }));
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
        //ALPD-657
        //this.changePropertyView(1)
    }

    dataStateChange = (event) => {
        switch (this.props.Login.activeSampleTab) {
            case "IDS_SOURCE":
                this.setState({
                    sourceDataState: event.dataState
                });
                break;
            case "IDS_SAMPLECOMMENTS":
                this.setState({
                    sampleCommentDataState: event.dataState
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

    outsourceDataStateChange = (event) => {
        switch (this.props.Login.activeSampleTab) {
            case "IDS_EXTERNALORDERREPORTS":
                this.setState({
                    externalOrderAttachmentDataState: event.dataState
                });
                break;
            default:
                this.setState({
                    outsourceDetailsDataState: event.dataState
                });
                break;
        }
    }

    viewExternalOrderAttachmentFile = (filedata) => {
        delete (filedata.inputData.userinfo);
        const inputParam = {
            inputData: {
                externalorderattachment: filedata.inputData,
                userinfo: this.props.Login.userInfo,
                ncontrolcode: filedata.ncontrolCode
            },
            classUrl: "registration",
            operation: "view",
            methodUrl: "ExternalOrderAttachment",
        }
        this.props.viewAttachment(inputParam);
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
            isneedHeader={true}
        />)
        tabMap.set("IDS_SAMPLECOMMENTS", <Comments
            screenName="IDS_SAMPLECOMMENTS"
            onSaveClick={this.onCommentsSaveClick}
            selectedMaster="selectedSample"
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            Comments={this.props.Login.masterData.RegistrationComment || []}
            fetchRecord={this.props.getCommentsCombo}
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
            selectedId={this.props.Login.selectedId || null}
        />)

        return tabMap;
    }

    sampleComments = () => {
        let npreregno = this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",") : "-1";
        const tabMap = new Map();


        let sampleList = this.props.Login.masterData.RegistrationGetSample || [];
        let { skip, take } = this.state
        sampleList = sampleList.slice(skip, skip + take);
        let selectedSampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.selectedSample, "npreregno");

        return <Comments
            screenName="IDS_SAMPLECOMMENTS"
            onSaveClick={this.onCommentsSaveClick}
            selectedMaster="selectedSample"
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            Comments={this.props.Login.masterData.RegistrationComment || []}
            fetchRecord={this.props.getCommentsCombo}
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
            selectedId={this.props.Login.selectedId || null}
        />
    }

    subsampleTabDetail = () => {
        const ntransactionsamplecode = this.props.Login.masterData.selectedSubSample &&
            this.props.Login.masterData.selectedSubSample.map(sample => sample.ntransactionsamplecode).join(",");
        //console.log("ntransactionsamplecode", ntransactionsamplecode)
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
            isneedHeader={true}
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
            selectedId={this.props.Login.selectedId || null}
        />)

        return tabMap;
    }

    subsampleComments = () => {
        const ntransactionsamplecode = this.props.Login.masterData.selectedSubSample &&
            this.props.Login.masterData.selectedSubSample.map(sample => sample.ntransactionsamplecode).join(",");
        const tabMap = new Map();
        let subsampleList = this.props.Login.masterData.RegistrationGetSubSample || [];
        let { subsampleskip, subsampletake } = this.state
        subsampleList = subsampleList.slice(subsampleskip, subsampleskip + subsampletake);
        let selectedSubSampleList = getSameRecordFromTwoArrays(subsampleList, this.props.Login.masterData.selectedSubSample, "ntransactionsamplecode");
        return <Comments
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
            selectedId={this.props.Login.selectedId || null}
        />
    }

    testTabDetail = () => {

        const testTabMap = new Map();
        let testList = this.props.Login.masterData.RegistrationGetTest || [];
        let { testskip, testtake } = this.state
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.selectedTest, "ntransactiontestcode");
        // const cancelId = this.state.controlMap.has("CancelTest") && this.state.controlMap.get("CancelTest").ncontrolcode;
        let ntransactiontestcode = this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        testTabMap.set("IDS_PARAMETERRESULTS", <RegistrationResultTab
            userInfo={this.props.Login.userInfo}
            genericLabel={this.props.Login.genericLabel}
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
            isneedHeader={true}
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
            selectedId={this.props.Login.selectedId || null}
        />)
        return testTabMap;
    }

    getCommentsCombo = (event) => {

        if (this.props.Login.selectedTest && this.props.Login.selectedTest.length > 0) {
            this.props.getCommentsCombo(...event);
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTTESTTOADDCOMMENTS" }))
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
            case "IDS_TESTHISTORY":
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

    onCommentsSaveClick = (saveType, formRef, selectedRecord) => {

        const masterData = this.props.Login.masterData;
        let inputData = {}
        let inputParam = {}
        inputData["userinfo"] = this.props.Login.userInfo;
        if (this.props.Login.screenName === "IDS_SAMPLECOMMENTS") {
            let sampleList = [];
            if (this.props.Login.masterData.searchedSample !== undefined) {
                //sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(this.state.skip, this.state.skip + this.state.take), "npreregno");

                const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                    : this.props.Login.masterData.RegistrationGetSample;

                sampleList = list ? list.slice(this.state.skip, this.state.skip + this.state.take) : [];
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

                //sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSubSample, this.props.Login.masterData.RegistrationGetSubSample.slice(this.state.subsampleskip, this.state.subsampleskip + this.state.subsampletake), "npreregno");
                const list = this.props.Login.masterData.searchedSubSample ? this.props.Login.masterData.searchedSubSample
                    : this.props.Login.masterData.RegistrationGetSubSample;

                sampleList = list ? list.slice(this.state.subsampleskip, this.state.subsampleskip + this.state.subsampletake) : [];
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
        if (this.props.Login.masterData.searchedSample !== undefined) {
            sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample || [], sortDataForDate(this.props.Login.masterData.RegistrationGetSample, 'dtransactiondate', 'npreregno').slice(this.state.skip, this.state.skip + this.state.take), "npreregno");
        } else {
            sampleList = sortDataForDate(this.props.Login.masterData.RegistrationGetSample, 'dtransactiondate', 'npreregno').slice(this.state.skip, this.state.skip + this.state.take);
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
            return { "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode] || "-", "dataField": option[designProperties.VALUE], "width": "200px", "columnSize": "3", "dataType": [option[designProperties.LISTITEM]] };
        });
        return temparray;
    }

    cancelSubSampleRecord = (controlcode, skip, take) => {

        let testList = [];
        if (this.props.Login.masterData.searchedSubSample !== undefined) {

            //sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSubSample, this.props.Login.masterData.RegistrationGetSubSample.slice(this.state.subsampleskip, this.state.subsampleskip + this.state.subsampletake), "npreregno");
            const list = this.props.Login.masterData.searchedSubSample ? this.props.Login.masterData.searchedSubSample
                : this.props.Login.masterData.RegistrationGetSubSample;

            testList = list ? list.slice(this.state.subsampleskip, this.state.subsampleskip + this.state.subsampletake) : [];
        } else {
            testList = this.props.Login.masterData.RegistrationGetSubSample.slice(this.state.subsampleskip, this.state.subsampleskip + this.state.subsampletake);
        }

        // let testList = this.props.Login.masterData.searchedSubSample ||
        //     (this.props.Login.masterData.RegistrationGetSubSample ?
        //         [...this.props.Login.masterData.RegistrationGetSubSample].splice(skip, skip + take) : []);

        let acceptList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.selectedSubSample, "ntransactionsamplecode");
        if (acceptList && acceptList.length > 0) {
            // console.log("Success:", dataitem);
            if (this.transValidation(this.props.Login.transactionValidation, controlcode, acceptList)) {
                let Map = {};
                Map['npreregno'] = acceptList.map(x => x.npreregno).join(",");
                Map['ntransactiontestcode'] = this.props.Login.masterData.selectedTest && this.props.Login.masterData.selectedTest.length > 0 ?
                    this.props.Login.masterData.selectedTest.map(x => x.ntransactiontestcode).join(",") : "-1";
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
                Map["selectedTest"] = this.props.Login.masterData.RegistrationGetTest;
                Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                    && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
                Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
                Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
                // Map["checkBoxOperation"] = 3
                Map["checkBoxOperation"] = checkBoxOperation.SINGLESELECT;
                Map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
                Map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
                Map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
                Map["FromDate"] = rearrangeDateFormat(this.props.Login.masterData.FromDate);
                Map["napproveconfversioncode"] = this.props.Login.masterData.napproveconfversioncode;
                Map["ToDate"] = rearrangeDateFormat(this.props.Login.masterData.ToDate);

                let inputParam = {
                    inputData: Map,
                    postParamList: this.postParamList,
                    action: 'cancelSubSample'
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
                let value = []
                this.props.Login.transactionValidation[controlcode] &&
                    this.props.Login.transactionValidation[controlcode].map(sample => {
                        if (sample.nregsubtypecode === this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode) {
                            value.push(this.props.intl.formatMessage({ id: sample.stransdisplaystatus }))
                        }
                    })
                value = value.map(sample => sample).join("/")

                //toast.info("Select" + " " + value + " to Cancel/Reject Test");
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECT" }) + value + this.props.intl.formatMessage({ id: "IDS_TOCANCELREJECTSUBSAMPLE" }));
            }
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLETOCANCELREJECT" }));
        }
    }



    printbarcode = (controlcode) => {

        if (this.transValidation(this.props.Login.transactionValidation, controlcode)) {
            this.props.getBarcodeAndPrinterService({
                masterData: this.props.Login.masterData,
                ncontrolcode: this.state.subSampleBarcodeId,
                userInfo: this.props.Login.userInfo,
                control: "subSampleBarcode"
            })
        } else {
            let value = []
            this.props.Login.transactionValidation[controlcode] &&
                this.props.Login.transactionValidation[controlcode].map(sample => {
                    if (sample.nregsubtypecode === this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode) {
                        value.push(this.props.intl.formatMessage({ id: sample.stransdisplaystatus }))
                    }
                })
            value = value.map(sample => sample).join("/")

            //toast.info("Select" + " " + value + " to Cancel/Reject Test");
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECT" }) + value + this.props.intl.formatMessage({ id: "IDS_TOCANCELREJECTSUBSAMPLE" }));
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
                let value = []
                this.props.Login.transactionValidation[controlcode] &&
                    this.props.Login.transactionValidation[controlcode].map(sample => {
                        if (sample.nregsubtypecode === this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode) {
                            value.push(this.props.intl.formatMessage({ id: sample.stransdisplaystatus }))
                        }
                    })
                value = value.map(item => item).join("/")

                //toast.info("Select" + " " + value + " to Cancel/Reject Test");
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECT" }) + value + this.props.intl.formatMessage({ id: "IDS_TOCANCELREJECTTEST" }));
            }
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTTESTTOCANCELREJECT" }));
        }
    }

    addMoreTest = (inputParam, ncontrolCode) => {
        let sampleList = [];
        const skip = this.state.skip;
        const take = this.state.take;
        if (this.props.Login.masterData.searchedSample !== undefined) {

            ///sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.RegistrationGetSample;

            sampleList = list ? list.slice(skip, skip + take) : [];
        } else {
            sampleList = this.props.Login.masterData.RegistrationGetSample && sortDataForDate(this.props.Login.masterData.RegistrationGetSample, 'dtransactiondate', 'npreregno').slice(skip, skip + take);
        }
        let addSubSampleList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedSample, "npreregno");

        if (addSubSampleList && addSubSampleList.length > 0) {

            inputParam["sampleList"] = sampleList;
            this.props.addMoreTest(inputParam, ncontrolCode);
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLETOADDTEST" }));
        }
    }
    //ALPD-3615--Start
    addAdhocTest = (inputParam) => {
        let sampleList = [];
        const skip = this.state.skip;
        const take = this.state.take;
        if (this.props.Login.masterData.searchedSample !== undefined) {

            ///sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.RegistrationGetSample;

            sampleList = list ? list.slice(skip, skip + take) : [];
        } else {
            sampleList = this.props.Login.masterData.RegistrationGetSample && sortDataForDate(this.props.Login.masterData.RegistrationGetSample, 'dtransactiondate', 'npreregno').slice(skip, skip + take);
        }
        let addSubSampleList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedSample, "npreregno");

        if (addSubSampleList && addSubSampleList.length > 0) {

            inputParam["sampleList"] = sampleList;
            this.props.getAdhocTest(inputParam, this.props.Login.masterData, this.state.adhocTestId);
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLETOADDTEST" }));
        }
    }
    //ALPD-3615--End
    addSubSample = (controlcode, skip, take) => {
        let Map = {};
        let sampleList = [];
        if (this.props.Login.masterData.searchedSample !== undefined) {
            // sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.RegistrationGetSample;

            sampleList = list ? list.slice(skip, skip + take) : [];

        } else {
            sampleList = this.props.Login.masterData.RegistrationGetSample && sortDataForDate(this.props.Login.masterData.RegistrationGetSample, 'dtransactiondate', 'npreregno').slice(skip, skip + take);
        }

        let addSubSampleList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedSample, "npreregno");

        const nsampletypecode = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
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
                            // console.log("spec jsx main:", findComponentReqSpec,findSampleSpec[0] );
                            this.props.addsubSampleRegistration(this.props.Login.masterData,
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
                    // } else {
                    //    toast.info(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMEAPPROVALCONFIG" }));
                    // }
                    // } else {
                    //     toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTPREREGISTERSAMPLETOADDSUBSAMPLE" }));
                    // }
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

    componentWillUnmount() {
        let activeTabIndex = this.props.Login.activeTabIndex
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                activeTabIndex: undefined
            }
        }
        this.props.updateStore(updateInfo);
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
        // if (this.props.Login.transactionValidation && this.props.Login.transactionValidation !== previousProps.Login.popUptestDataState) {
        //     this.setState({ popUptestDataState: this.props.Login.popUptestDataState });
        // }
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
            const sampleBarcodeId = controlMap.has("SamplePrintBarcode") ? controlMap.get("SamplePrintBarcode").ncontrolcode : -1;
            const subSampleBarcodeId = controlMap.has("SubSamplePrintBarcode") ? controlMap.get("SubSamplePrintBarcode").ncontrolcode : -1;
            const CancelExternalOrderSampleId = controlMap.has("CancelExternalOrderSample") ? controlMap.get("CancelExternalOrderSample").ncontrolcode : -1;
            const SampleImportId = controlMap.has("ImportSample") ? controlMap.get("ImportSample").ncontrolcode : -1;
            const SampleCountId = controlMap.has("SampleCount") ? controlMap.get("SampleCount").ncontrolcode : -1;
            const outsourceId = controlMap.has("Outsource") ? controlMap.get("Outsource").ncontrolcode : -1;

            const exportTemplateId = controlMap.has("Export Template") ? controlMap.get("Export Template").ncontrolcode : -1;
            const importTemplateId = controlMap.has("Import Template") ? controlMap.get("Import Template").ncontrolcode : -1;
            const adhocTestId = controlMap.has("AdhocTest") ? controlMap.get("AdhocTest").ncontrolcode : -1;
            const generateBarcodeId = controlMap.has("GenerateBarcode") ? controlMap.get("GenerateBarcode").ncontrolcode : -1;
            const copySampleId = controlMap.has("CopySample") ? controlMap.get("CopySample").ncontrolcode : -1;

            const reportId = controlMap.has("Report") ? controlMap.get("Report").ncontrolcode : -1;
            const filterNameId = controlMap.has("FilterName") ? controlMap.get("FilterName").ncontrolcode : -1;
            const filterDetailId = controlMap.has("FilterDetail") ? controlMap.get("FilterDetail").ncontrolcode : -1;
			const editTestMethodId = controlMap.has("EditMethod") ? controlMap.get("EditMethod").ncontrolcode : -1;

            this.setState({
                userRoleControlRights, controlMap, cancelId, reportId: reportId,filterNameId,filterDetailId,
                preRegisterId, registerId, editSampleId, quarantineId, addTestId, printBarcodeId,
                cancelSampleId, addSubSampleId, editSubSampleId, cancelSubSampleId, specBasedTestPackage, sampleBarcodeId, subSampleBarcodeId
                , CancelExternalOrderSampleId, SampleImportId, SampleCountId, exportTemplateId, importTemplateId, outsourceId, adhocTestId, generateBarcodeId, copySampleId,editTestMethodId
            });

        }
        let activeTabIndex = this.state.activeTabIndex || undefined;
        let activeTabId = this.state.activeTabId || undefined;


        // console.log("this.props.Login.masterData.selectedSample:", this.props.Login.masterData.selectedSample);

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
            // if(this.props.Login.masterData.orders !==  previousProps.Login.masterData.orders)
            // {
            //     orders = this.props.Login.masterData.orders;
            // }


            if (this.props.Login.activeTabIndex !== previousProps.Login.activeTabIndex) {
                activeTabIndex = this.props.Login.activeTabIndex;
                activeTabId = this.props.Login.activeTabId;
            }

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
                testMoreField = dynamicColumn.testListFields.testlistmoreitems ? dynamicColumn.testListFields.testlistmoreitems : [];
                testListColumns = dynamicColumn.testListFields.testlistitem ? dynamicColumn.testListFields.testlistitem : [];
                sampleSearchField = dynamicColumn.samplesearchfields ? dynamicColumn.samplesearchfields : [];
                subsampleSearchField = dynamicColumn.subsamplesearchfields ? dynamicColumn.subsamplesearchfields : [];
                testSearchField = dynamicColumn.testListFields.testsearchfields ? dynamicColumn.testListFields.testsearchfields : [];
                sampledateconstraints = dynamicColumn.sampledateconstraints || [];
                subsampledateconstraints = dynamicColumn.subsampledateconstraints || [];
                sampleCombinationUnique = dynamicColumn.samplecombinationunique || [];
                subsampleCombinationUnique = dynamicColumn.subsamplecombinationunique || [];
                sampleexportfields = dynamicColumn.sampleExportFields || [];
                subsampleexportfields = dynamicColumn.subSampleExportFields || [];
                samplefilteritem = dynamicColumn.samplefilteritem || [];
                sampledisplayfields = dynamicColumn.sampledisplayfields || [];

                // specBasedComponent = true;

                this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample &&
                    this.props.Login.masterData.RegistrationGetSample.length > 0 &&
                    (this.props.Login.masterData.RegistrationGetSample[0].ncomponentrequired === transactionStatus.YES) &&
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

            // DynamicSubSampleColumns.push({
            // "1":{`${this.props.Login.userInfo.slanguagetypecode}`}= this.props.intl.formatMessage({ id: "IDS_COMPONENT" }),
            // "2":"scomponentname"});
            // let objCompoent = {1:`${this.props.Login.userInfo.slanguagetypecode}`= this.props.intl.formatMessage({ id: "IDS_COMPONENT" }),
            //                     2:"scomponentname"



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
                nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
                activeSampleTab: this.props.Login.activeTestTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeTestTab || "IDS_SUBSAMPLEATTACHMENTS",
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
                //activeTabIndex: this.state.enableAutoClick ? 1 : this.state.activeTabIndex ? this.state.activeTabIndex : undefined
            }
            const testChildGetParam = {
                masterData: this.props.Login.masterData,
                userinfo: this.props.Login.userInfo,
                ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
                activeSampleTab: this.props.Login.activeTestTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeTestTab || "IDS_SUBSAMPLEATTACHMENTS",
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
                activeTabIndex: this.state.enableAutoClick ? 1 : this.state.activeTabIndex ? this.state.activeTabIndex : undefined,

            }

            const subSampleGetParam = {
                masterData: this.props.Login.masterData,
                ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                userinfo: this.props.Login.userInfo,
                nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
                activeSampleTab: this.props.Login.activeTestTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeTestTab || "IDS_SUBSAMPLEATTACHMENTS",
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

                // isSortable: true,
                // sortValue: 'ntransactionsamplecode',
                // sortList: ['RegistrationGetSubSample'],
                isMultiSort: true,
                multiSortData: [{ pkey: 'ntransactionsamplecode', list: 'RegistrationGetSubSample' },
                { pkey: 'ntransactiontestcode', list: 'RegistrationGetTest' }],

                //ALPD-1518
                skip: 0,
                take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
                subsampleskip: 0,
                subsampletake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
                testskip: 0,
                testtake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,

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
                    // checkBoxOperation: 3,
                    checkBoxOperation: checkBoxOperation.SINGLESELECT,


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

                skip: this.state.skip,
                take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
                subsampleskip: 0,
                subsampletake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
                testskip: 0,
                testtake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,

                isMultiSort: true,
                multiSortData: [{ pkey: 'ntransactiontestcode', list: 'RegistrationGetTest' }],
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
                    // checkBoxOperation: 3,
                    checkBoxOperation: checkBoxOperation.SINGLESELECT,
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
                skip: this.state.skip,
                take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
                subsampleskip: this.state.subsampleskip,
                subsampletake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,
                testskip: 0,
                testtake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 10,

                fecthInputObject: {
                    ntransactiontestcode: this.props.Login.masterData && this.props.Login.masterData.selectedTest && this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
                    userinfo: this.props.Login.userInfo,
                    ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                        && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                    nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                    nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
                    // checkBoxOperation: 3,
                    checkBoxOperation: checkBoxOperation.SINGLESELECT,
                    activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
                    activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                    activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                },
                masterData: this.props.Login.masterData,
                searchFieldList: testSearchField,
                changeList: ["RegistrationTestComment", "RegistrationParameter"],
                childTabsKey: ["RegistrationParameter", "RegistrationTestComment", "RegistrationTestAttachment", "ApprovalParameter"]

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
                nneedsubsample: this.props.Login.masterData.RegSubTypeValue &&
                    this.props.Login.masterData.RegSubTypeValue.nneedsubsample, //=== true
                //? transactionStatus.YES:transactionStatus.NO :transactionStatus.NO,


                activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
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
            }

            const addTestParam = {
                selectedSample: this.props.Login.masterData.selectedSample,
                selectedSubSample: this.props.Login.masterData.selectedSubSample,
                // skip: skip, take: (skip + take),
                userinfo: this.props.Login.userInfo,
                sampleList: this.props.Login.masterData.RegistrationGetSample,
                subsampleList: this.props.Login.masterData.RegistrationGetSubSample,
                //  ALPD-5808   Added nneedsubsample, nallottedspeccode, specBasedComponent keys to fix issue of unmapped tests loading by Vishakh
                nspecsampletypecode: this.props.Login.masterData && this.props.Login.masterData.selectedSubSample &&
                    parseInt([...new Set(this.props.Login.masterData.selectedSubSample.map(x => x.nspecsampletypecode))].join(",")) || -1,
                nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
                nallottedspeccode:this.props.Login.masterData && this.props.Login.masterData.selectedSample &&
                    this.props.Login.masterData.selectedSample.length > 0 && this.props.Login.masterData.selectedSample[0].nallottedspeccode,
                specBasedComponent: this.props.Login.specBasedComponent ? this.props.Login.specBasedComponent : false
            };

            const breadCrumbobj = convertDateValuetoString(this.props.Login.masterData.RealFromDate, this.props.Login.masterData.RealToDate, this.props.Login.userInfo)
            //  if (this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedtemplatebasedflow) {
            this.breadCrumbData = [
                {
                    "label": "IDS_FROM",
                    "value": breadCrumbobj.breadCrumbFrom
                }, {
                    "label": "IDS_TO",
                    "value": breadCrumbobj.breadCrumbto
                },
                // {
                //     "label": "IDS_SAMPLETYPE",
                //     "value": this.props.Login.masterData.RealSampleTypeValue 
                //     && this.props.Login.masterData.RealSampleTypeValue.ssampletypename
                // }, 
                {
                    "label": "IDS_REGTYPE",
                    "value": this.props.Login.masterData.RealRegTypeValue
                        && this.props.Login.masterData.RealRegTypeValue.sregtypename
                }, {
                    "label": "IDS_REGSUBTYPE",
                    "value": this.props.Login.masterData.RealRegSubTypeValue
                        && this.props.Login.masterData.RealRegSubTypeValue.sregsubtypename
                },
                // {
                //     "label": "IDS_APPROVALCONFIGVERSION",
                //     "value": this.props.Login.masterData.RealApprovalConfigVersionValue 
                //     && this.props.Login.masterData.RealApprovalConfigVersionValue.sversionname
                // },
                // {
                //     "label": "IDS_DESIGNTEMPLATE",
                //     "value": this.props.Login.masterData.RealDesignTemplateMappingValue 
                //     && this.props.Login.masterData.RealDesignTemplateMappingValue.sregtemplatename
                // }
                {
                    "label": "IDS_SAMPLESTATUS",
                    "value": this.props.Login.masterData.RealFilterStatusValue
                        && this.props.Login.masterData.RealFilterStatusValue.stransdisplaystatus
                },
            ]
            // } else {
            //     this.breadCrumbData = [
            //         {
            //             "label": "IDS_FROM",
            //             "value": breadCrumbobj.breadCrumbFrom
            //         }, {
            //             "label": "IDS_TO",
            //             "value": breadCrumbobj.breadCrumbto
            //         }, {
            //             "label": "IDS_SAMPLETYPE",
            //             "value": this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.ssampletypename
            //         }, {
            //             "label": "IDS_REGTYPE",
            //             "value": this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.sregtypename
            //         }, {
            //             "label": "IDS_REGSUBTYPE",
            //             "value": this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.sregsubtypename
            //         },
            //         {
            //             "label": "IDS_FILTERSTATUS",
            //             "value": this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.stransdisplaystatus
            //         }
            //     ]
            //  }

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

    // orderRecords = (CancelExternalOrderSampleId) => {

    //     const updateInfo = {
    //         typeName: DEFAULT_RETURN,
    //         data: {
    //             //screenData: { inputParam, masterData: this.props.Login.masterData },
    //             openModal: true,
    //             parentPopUpSize: 'xl',
    //             screenName: "External Sample",
    //             operation: 'Cancel',
    //             ncontrolcode: CancelExternalOrderSampleId,
    //             loadPrinter: false

    //         }
    //     }
    //     this.props.updateStore(updateInfo);
    // }

    orderRecords = (CancelExternalOrderSampleId) => {

        let inputData = {
            userinfo: this.props.Login.userInfo,
            ncontrolcode: CancelExternalOrderSampleId,
            operation: 'Cancel',
            loadPrinter: false,
            openModal: true,
            parentPopUpSize: 'xl',
            screenName: "External Sample",
            masterData: this.props.Login.masterData,
            selectedRecord: this.state.selectedRecord
        }
        this.props.orderRecords(inputData);
    }

    sampleReceivingReport = (controlcode) => {   
                //ALPD-4316    janakumar

        if (this.props.Login.masterData.selectedTest !== undefined && this.props.Login.masterData.selectedTest.length > 0) {


            const filterTestParam = {

                //masterData: this.props.Login.masterData,
                //userinfo: this.props.Login.userInfo,
                //npreregno: this.props.Login.masterData.selectedSample &&
                //this.props.Login.masterData.selectedSample.map(x => x.npreregno).join(","),
                
                nusercode: this.props.Login.userInfo.nusercode,
                nusercode_componentcode:8,
                nusercode_componentname:designComponents.USERINFO,
                // sheadertext: "Sample Registration",
                // sheadertext_componentcode:2,
                // sheadertext_componentname:designComponents.TEXTAREA,
                spreregno: this.props.Login.masterData.selectedSample &&
                this.props.Login.masterData.selectedSample.map(x => x.npreregno).join(","),
                spreregno_componentcode:2,
                spreregno_componentname:designComponents.TEXTAREA,


            }


            this.props.generateControlBasedReport(controlcode, filterTestParam, this.props.Login, "npreregno", this.props.Login.masterData.selectedSample.npreregno)

        } else {

            toast.info(this.props.intl.formatMessage({ id: "IDS_ADDTESTTOREGISTERSAMPLES" }));
        }
    }

    cancelSampleRecords = (controlcode, skip, take) => {
        let Map = {};
        let sampleList = [];
        if (this.props.Login.masterData.searchedSample !== undefined) {
            //sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.RegistrationGetSample;

            sampleList = list ? list.slice(skip, skip + take) : [];
        } else {
            sampleList = this.props.Login.masterData.RegistrationGetSample && sortDataForDate(this.props.Login.masterData.RegistrationGetSample, 'dtransactiondate', 'npreregno').slice(skip, skip + take);
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
                Map["nportalrequired"] = this.props.Login.masterData.RealSampleTypeValue.nportalrequired;
                Map["nflag"] = 2;
                Map["ntype"] = 3;
                Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                    && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
                Map["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue
                    && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode;
                Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
                Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
                // Map["checkBoxOperation"] = 3;
                Map["checkBoxOperation"] = checkBoxOperation.SINGLESELECT;

                Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
                Map["nportalrequired"] = this.props.Login.masterData.RealSampleTypeValue.nportalrequired;
                Map["nfilterstatus"] = -1;
                Map["npreregno"] = cancelRejectSamplesList &&
                    cancelRejectSamplesList.map(sample => sample.npreregno).join(",");
                Map["ntransactionsamplecode"] = this.props.Login.masterData.selectedSubSample && this.props.Login.masterData.selectedSubSample.length > 0 ?
                    this.props.Login.masterData.selectedSubSample.map(sample => sample.ntransactionsamplecode).join(",") : "-1";
                Map["ntransactiontestcode"] = this.props.Login.masterData.selectedTest && this.props.Login.masterData.selectedTest.length > 0 ?
                    this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
                Map["registrationsample"] = cancelRejectSamplesList;
                let sampleCode = '';
                this.props.Login.masterData.RegistrationGetSubSample && (this.props.Login.masterData.RegistrationGetSubSample.map(sample => {
                    // if (sample.ntransactionstatus != transactionStatus.CANCELLED && sample.ntransactionstatus != transactionStatus.REJECT) {
                    sampleCode += sample.ntransactionsamplecode + ','
                    //}
                }))
                Map["ssamplecode"] = sampleCode.substring(0, sampleCode.length - 1);
                // ? return sample.ntransactionsamplecode : "").join(",")).replace(/^,/, '');;
                Map["registrationtest"] = this.props.Login.masterData.selectedSubSample;
                Map["transactionValidation"] = this.props.Login.transactionValidation;
                Map["withoutgetparameter"] = 3
                Map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
                Map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
                Map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
                Map["url"] = this.props.Login.settings[24];
                // Map["selectedSample"] = sortData(this.props.Login.masterData.selectedSample, "ascending", "npreregno")
                // Map["RegistrationGetSubSample"] = sortData(this.props.Login.masterData.RegistrationGetSubSample, "ascending", "ntransactionsamplecode")
                Map["selectedSample"] = cancelRejectSamplesList;//this.props.Login.masterData.selectedSample
                Map["RegistrationGetSubSample"] = this.props.Login.masterData.RegistrationGetSubSample


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
                let value = [];
                // let value1 =[];
                // let value2 = [];
                this.props.Login.transactionValidation[controlcode] &&
                    this.props.Login.transactionValidation[controlcode].map(sample => {
                        if (sample.nregsubtypecode === this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode) {
                            value.push(this.props.intl.formatMessage({ id: sample.stransdisplaystatus }))
                        }
                    })

                value = value.map(sample => sample).join("/")
                // if(value.length>4){
                //     value1 = value.slice.splice(0,4);
                //     value2 = value.slice.splice(5);
                //     toast.info(this.props.intl.formatMessage({ id: "IDS_SELECT" }) + value1 +"\n" +value2 + this.props.intl.formatMessage({ id: "IDS_TOCANCELREJECTSAMPLE" }));

                // }
                // else{
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECT" }) + value + this.props.intl.formatMessage({ id: "IDS_TOCANCELREJECTSAMPLE" }));


                //toast.info("Select" + " " + value + " to Cancel/Reject Sample");
            }
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLETOCANCELREJECT" }));
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
                if (sam.nregsubtypecode === this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode) {
                    return ntransstatus.push(sam.ntransactionstatus)
                }
                //return ntransstatus.push(sam.ntransactionstatus)
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
            // checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
            activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS"
        }

        inputData["initialparam"] = initialParam;
        // inputData["samplebeforeedit"] = JSON.parse(JSON.stringify(this.props.Login.regRecordToEdit));
        //inputData["registration"] = JSON.parse(JSON.stringify(this.state.selectedRecord));
        const param = getRegistrationSubSample(
            this.state.selectedRecord,
            this.props.Login.masterData.SubSampleTemplate.jsondata,
            this.props.Login.userInfo, this.props.Login.defaulttimezone, false, this.props.Login.specBasedComponent,
            undefined, operation);

        inputData["registrationsample"] = param.sampleRegistration

        if (this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
            inputData["registrationsample"]['jsondata'] = { ...inputData["registrationsample"]['jsondata'], externalorderid: this.state.selectedRecord && this.state.selectedRecord.externalorderid }
            inputData["registrationsample"]['jsonuidata'] = { ...inputData["registrationsample"]['jsonuidata'], externalorderid: this.state.selectedRecord && this.state.selectedRecord.externalorderid }
        }
        inputData["SubSampleDateList"] = param.dateList
        inputData['subsampledateconstraints'] = this.state.subsampledateconstraints;
        inputData["flag"] = flag === undefined ? 1 : flag;
        inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
            && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
        inputData["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue
            && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode;
        inputData["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
            && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
        inputData["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
            && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
        // inputData["checkBoxOperation"] = 3;
        inputData["checkBoxOperation"] = checkBoxOperation.SINGLESELECT;
        inputData["subsamplecombinationunique"] = this.state.subsampleCombinationUnique;
        inputData["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
        inputData["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
        inputData["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS"

        let isFileupload = false;
        const formData = new FormData();
        this.props.Login.withoutCombocomponent.map((item) => {
            if (item.inputtype === 'files') {
                if (typeof this.state.selectedRecord[item && item.label] === "object") {
                    this.state.selectedRecord[item && item.label] && this.state.selectedRecord[item && item.label].forEach((item1, index) => {
                        formData.append("uploadedFile" + index, item1);
                        formData.append("uniquefilename" + index, inputData["registrationsample"].uniquefilename);
                        formData.append("filecount", this.state.selectedRecord[item && item.label].length);
                        formData.append("isFileEdited", transactionStatus.YES);
                        formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                        // formDataValue={...map["RegistrationSample"].formData,formData};
                        delete (inputData["registrationsample"].uniquefilename);
                        delete (inputData["registrationsample"][item && item.label]);
                        formData.append('Map', Lims_JSON_stringify(JSON.stringify(inputData)));
                        isFileupload = true;
                    })
                }
            }
        })

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
            //this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            this.props.onUpdateSubSampleRegistration(inputParam,
                this.props.Login.masterData, "openModal");
        }
    }
    closeModalShow = () => {
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

        this.props.validateEsignforRegistration(inputParam, "openModal");

    }

    editRegistration = (inputParam) => {
        let data = [];
        let editablecombo = [];
        const withoutCombocomponent = []
        const Layout = this.props.Login.masterData.registrationTemplate
            && this.props.Login.masterData.registrationTemplate.jsondata
        if (Layout !== undefined) {
            Layout.map(row => {
                return row.children.map(column => {
                    return column.children.map(component => {
                        if (component.hasOwnProperty("children")) {
                            component.children.map(componentrow => {
                                if (componentrow.inputtype === "combo") {
                                    data.push(componentrow)
                                } else {
                                    withoutCombocomponent.push(componentrow)
                                }
                                if (componentrow.inputtype === "combo" && componentrow.iseditablereadonly && componentrow.iseditablereadonly === true) {
                                    editablecombo.push(componentrow)
                                }

                                return null;
                            })
                        } else {
                            if (component.inputtype === "combo" && component.iseditablereadonly && component.iseditablereadonly === true) {
                                editablecombo.push(component);
                            }
                            else if (component.inputtype === "combo") {
                                data.push(component);
                            } else {
                                withoutCombocomponent.push(component);
                            }
                        }
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
            // data.push(...comboComponents);

            this.props.getEditRegistrationComboService(inputParam,
                data, this.state.selectedRecord, childColumnList,
                comboComponents, withoutCombocomponent, editablecombo)
        } else {
            toast.info("Configure the preregister template for this registrationtype")
        }

    }

    editSubSampleRegistration = (inputParam) => {
        let data = [];
        const regSubSamplewithoutCombocomponent = []
        if ((inputParam.mastertoedit.ntransactionstatus === transactionStatus.REJECT) ||
            (inputParam.mastertoedit.ntransactionstatus === transactionStatus.CANCELLED) ||
            (inputParam.mastertoedit.ntransactionstatus === transactionStatus.RELEASED)) {
            toast.info(this.props.intl.formatMessage({ id: "IDS_CANNOTEDITCANCELLEDSUBSAMPLE" }));
        } else {
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


                const sampleList = getSameRecordFromTwoArrays(inputParam.masterData.selectedSample, [inputParam.mastertoedit], "npreregno")

                this.props.getEditSubSampleComboService(inputParam,
                    data, this.state.selectedRecord, regSubSamplechildColumnList,
                    regSubSamplecomboComponents, regSubSamplewithoutCombocomponent,
                    sampleList[0].ncomponentrequired === 3 ? true : false)
            } else {
                toast.info("Configure the sub sample template for this registrationtype")
            }
        }

    }

    closeSendToStoreChildModal = () => {

        let loadEsign = this.props.Login.loadEsign;
        let openChildModal = this.props.Login.openChildModal;
        let selectedId = this.props.Login.selectedId;
        let selectedRecord = this.state.selectedRecord; //this.props.Login.selectedRecord;
        let selectedDetailField = this.state.selectedDetailField;
        if (this.props.Login.loadEsign) {
            loadEsign = false;
        }
        else {
            openChildModal = false;
            selectedId = null;
            selectedRecord = {};
            selectedDetailField = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign, selectedRecord, selectedId, selectedDetailField }
        }
        this.props.updateStore(updateInfo);
    }

    sendToStore = (inputParam) => {
        let inputData = {
            needSubSample: this.props.Login.masterData.RegSubTypeValue.nneedsubsample === true ? true : false,
            npreregno: inputParam.mastersendtostore.npreregno,
            ntransactionsamplecode: inputParam.mastersendtostore.ntransactionsamplecode,
            sample: this.props.Login.masterData.RegSubTypeValue.nneedsubsample === true ? inputParam.mastersendtostore.ssamplearno :
                inputParam.mastersendtostore.sarno,
            userinfo: inputParam.userInfo
        }
        // this.props.getStorageCategoryForSendToStore(inputParam.userInfo, inputParam.masterData, inputParam.controlcode, this.state.selectedRecord, inputData);
        this.props.getStorageCategoryForSendToStore(inputParam, this.state.selectedRecord, inputData);
    }

    itemRender = (clickedItem) => {
        let item = clickedItem.item;
        if (!this.state.toggleAction) {
            return (
                <>
                    {clickedItem.item ? (
                        <span className={`normal-node
                         ${clickedItem.item.editable ? "active-node" : ""}
                         ${item.expanded ? "expand-node" : "collapse-node"}
                         `}>
                            {item.containerfirstnode ? <FontAwesomeIcon icon={faBoxOpen} /> :
                                item.locationlastnode ? <FontAwesomeIcon icon={faLocationArrow} /> :
                                    item.containerlastnode ? <FontAwesomeIcon icon={faBox} /> :
                                        item.expanded ? <FontAwesomeIcon icon={faFolderOpen} /> : <FontAwesomeIcon icon={faFolder} />}
                            {item.text}
                        </span>
                    ) : (
                        ""
                    )}
                </>
            );
        }
    };

    onItemClick = (event) => {

        let newData = mapTree(this.state.treeData, "items", (item) => {
            if (item.editable === true) {
                item.editable = false;
            } else if (item.id === event.item.id) {
                item.editable = true;
            }
            return item;
        });

        let result = newData;
        const indices = event.itemHierarchicalIndex.split('_').map(index => Number(index));
        let itemText = "";
        for (let i = 0; i < indices.length; i++) {
            if (i === 0) {
                result = result[0];
            } else {
                result = result.items[indices[i]];
            }
            itemText = i > 0 ? itemText + " > " + result.text : result.text;
        }

        this.setState({ treeData: newData, clickedItem: event.item, targetLocationHierarchy: itemText });
    };

    clearSelected(innerObj, selectedItem) {
        if (innerObj.id == selectedItem.id) {
            innerObj.selected = true;
        } else {
            innerObj.selected = false;
        }
        if (innerObj.items && innerObj.items.length > 0) {
            innerObj.items.map((childObj) => {
                this.clearSelected(childObj, selectedItem)
            })
        }
        return innerObj
    }

    onExpandChange = (event) => {
        event.item.expanded = !event.item.expanded;
        this.forceUpdate();
    };

    onComboChangeTree = (comboData, fieldName, caseNo) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (caseNo === 3) {

            let nfilterStorageCategory = this.state.nfilterStorageCategory || {}
            nfilterStorageCategory = comboData;
            this.searchRef.current.value = "";
            this.setState({ nfilterStorageCategory })

        } else if (caseNo === 4) {

            selectedRecord[fieldName] = comboData;
            this.props.loadApprovedLocationOnCombo(this.props.Login.userInfo, this.props.Login.masterData, selectedRecord);

        } else if (caseNo === 5) {

            selectedRecord[fieldName] = comboData;
            this.props.loadApprovedLocationOnTreeData(this.props.Login.userInfo, this.props.Login.masterData, selectedRecord);
        } else {

            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }
    }
    onDropFileSubSample = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }

    deleteAttachmentSubSample = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

        this.setState({
            selectedRecord, actionType: "delete" //fileToDelete:file.name 
        });
    }

    onSendToStoreSample = (saveType, formRef) => {
        let inputData = [];

        if (this.state.selectedRecord.nstoragecategorycode && this.state.selectedRecord.nstoragecategorycode.value !== undefined) {

            if (this.state.selectedRecord.nsamplestoragelocationcode && this.state.selectedRecord.nsamplestoragelocationcode.value !== undefined) {

                if (this.state.clickedItem && this.state.clickedItem.containerlastnode === true) {

                    inputData["userinfo"] = this.props.Login.userInfo;

                    let ssampleArNO = "";
                    if (this.props.Login.masterData.RegSubTypeValue.nneedsubsample === true) {

                        ssampleArNO = this.props.Login.masterData.selectedSubSample[0].ssamplearno;
                    } else {
                        ssampleArNO = this.props.Login.masterData.selectedSample[0].sarno;
                    }


                    inputData["sampleStorageMaster"] = {
                        "ssampletraycode": this.state.clickedItem ? this.state.clickedItem.id : "",
                        "ssamplearno": ssampleArNO,
                        "nsamplestoragelocationcode": this.state.selectedRecord.nsamplestoragelocationcode.value,
                        "slocationhierarchy": this.state.targetLocationHierarchy ? this.state.targetLocationHierarchy : "",
                        "nstoragecategorycode": this.state.selectedRecord.nstoragecategorycode.value,
                        "nsampleqty": this.state.selectedRecord.nsampleqty ? this.state.selectedRecord.nsampleqty : 0,
                        "nunitcode": this.state.selectedRecord.nunitcode ? this.state.selectedRecord.nunitcode.value : -1
                    }


                    const inputParam = {
                        methodUrl: this.props.Login.inputParam.methodUrl,
                        classUrl: this.props.Login.inputParam.classUrl,
                        displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
                        inputData: {
                            ...inputData, npreregno: this.props.Login.npreregno, ntransactionsamplecode: this.props.Login.ntransactionsamplecode,
                            needSubSample: this.props.Login.masterData.RegSubTypeValue.nneedsubsample === true ? true : false,
                            sample: ssampleArNO
                        },
                        operation: this.props.Login.operation,
                        saveType, formRef
                    }
                    const masterData = this.props.Login.masterData;
                    const selectedRecord = this.state.selectedRecord || {};

                    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                loadEsign: true, screenData: { inputParam, masterData, selectedRecord }, saveType, openModal: true
                            }
                        }
                        this.props.updateStore(updateInfo);
                    } else {
                        this.props.sendToStoreSampleStorageMaster(this.props.Login.userInfo, inputParam);
                    }
                } else {
                    toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSTORAGELOCATIONEND" }));
                }

            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSTORAGELOCATION" }));

            }

        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSTORAGECATEGORY" }));

        }
    }
    viewFile = (filedata) => {
        if (filedata.viewName === 'InfoView') {
            if (filedata && filedata[filedata.field[2] + ['_ssystemfilename_Sample']] !== undefined && filedata[filedata.field[2]] !== "") {
                const inputParam = {
                    inputData: {
                        viewFile: {
                            ssystemfilename: filedata[filedata.field[2] + ['_ssystemfilename_Sample']],
                            npreregno: filedata.npreregno,
                        },
                        userinfo: this.props.Login.userInfo
                    },
                    classUrl: "registration",
                    operation: "view",
                    methodUrl: "RegistrationFile",
                    //screenName: filedata.displayName
                }
                this.props.viewAttachment(inputParam);
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_FILENOTUPLOADED" }))
            }
        } else if (filedata.viewName === 'subSample') {
            if (filedata && filedata[filedata.field[2] + ['_ssystemfilename_subSample']] !== undefined && filedata[filedata.field[2]] !== "") {
                const inputParam = {
                    inputData: {
                        viewFile: {
                            ssystemfilename: filedata[filedata.field[2] + ['_ssystemfilename_subSample']],
                            npreregno: filedata.npreregno,
                            ntransactionsamplecode: filedata.ntransactionsamplecode
                        },
                        userinfo: this.props.Login.userInfo
                    },
                    classUrl: "registration",
                    operation: "view",
                    methodUrl: "RegistrationSubSampleFile",
                    //screenName: filedata.displayName
                }
                this.props.viewAttachment(inputParam);
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_FILENOTUPLOADED" }))
            }
        } else {
            if (filedata && filedata[filedata.dataField + ['_ssystemfilename_Sample']] !== undefined && filedata[filedata.dataField] !== "") {
                const inputParam = {
                    inputData: {
                        viewFile: {
                            ssystemfilename: filedata[filedata.dataField + ['_ssystemfilename_Sample']],
                            npreregno: filedata.npreregno,
                        },
                        userinfo: this.props.Login.userInfo
                    },
                    classUrl: "registration",
                    operation: "view",
                    methodUrl: "RegistrationFile",
                    //screenName: filedata.displayName
                }
                this.props.viewAttachment(inputParam);
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_FILENOTUPLOADED" }))
            }
        }
    }

    copySampleService = (controlId, masterData, userInfo, operation) => {
        const npreRegNo = masterData && masterData.selectedSample && masterData.selectedSample.length > 0
            ? masterData.selectedSample.map(item => item.npreregno).join(",") : "-1";
        let activeSampleTab = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
        let activeSubSampleTab = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
        let activeTestTab = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
        const inputData = {
            masterData: masterData,
            // selectedSample: this.props.Login.masterData.selectedSample,
            registrationCount: this.props.Login.masterData.selectedSample.length,
            npreregno: npreRegNo,
            userinfo: userInfo,
            operation: operation,
            controlId: controlId,
            FromDate: "",
            ToDate: "",
            nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
            nfilterstatus: this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus,
            activeSampleTab, activeTestTab, activeSubSampleTab,
            flag: 2,
            nneedtemplatebasedflow: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedtemplatebasedflow,
            ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
            napproveconfversioncode: this.props.Login.masterData.RealApprovalConfigVersionValue
                && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode,
            nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            multipleselectionFlag: this.props.Login.settings && parseInt(this.props.Login.settings[7]) === 3 ? true : false
            //postParamList:this.postParamList

        }
        //let inputParam={inputData:{...inputData}}
        this.props.copySampleService(inputData, masterData);
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
    getChildValues, getRegistrationSample, onApprovalConfigVersionChange,
    getRegistrationsubSampleDetail, getRegistrationTestDetail,
    acceptRegistration, addMoreTest, createRegistrationTest,
    getEditRegistrationComboService, cancelTestAction,
    cancelSampleAction, addsubSampleRegistration, saveSubSample,
    getEditSubSampleComboService, onUpdateSubSampleRegistration, validateEsignforRegistration,//componentTestPackage,
    cancelSubSampleAction, preregRecordToQuarantine, componentTest, getSubSampleChildTabDetail, testPackageTest,
    getStorageCategoryForSendToStore, loadApprovedLocationOnCombo,
    loadApprovedLocationOnTreeData, sendToStoreSampleStorageMaster,
    addMasterRecord, getAddMasterCombo, getDynamicMasterTempalte,
    getChildComboMaster, getChildValuesForAddMaster, insertRegistration, getBarcodeAndPrinterService,
    getEditMaster, outsourceTest, getOutSourceSite, getOutSourceSiteAndTest, outsourceSampleTest,
    getOrderDetails, onUpdateCancelExternalOrder, orderMapping, getExternalOrderForMapping, getExternalOrderTypeForMapping,
    orderRecords, testSectionTest, openBarcodeModal, barcodeGeneration, getAdhocTest, createAdhocTest, copySampleService,
     generateControlBasedReport,getRegistrationFilter,insertRegSample,getTestMethod,onUpdateTestMethod
})(injectIntl(RegistrationDesigner));