import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { faFileInvoice, faBolt, faChevronRight, faCommentDots, faComments, faEye, faFlask, faHistory, faLink, faPencilAlt, faPalette } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Col, Nav, Row, } from 'react-bootstrap';
import { ContentPanel } from '../../components/App.styles';
import { ListWrapper } from '../../components/client-group.styles';
import { ProductList } from '../testmanagement/testmaster-styled';
import { process } from "@progress/kendo-data-query";
//import SplitPane from "react-splitter-layout";
import SplitterLayout from "react-splitter-layout";
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import {
    getsubSampleDetail, getTestDetail, getTestChildTabDetail, performAction, updateStore, updateDecision,
    getRegistrationType, getRegistrationSubType, getFilterStatus, getApprovalSample, getStatusCombo, validateEsignCredential,
    crudMaster, validateEsignforApproval, getApprovalVersion, getParameterEdit, filterTransactionList, checkListRecord, generateCOAReport,
    getSampleChildTabDetail, getAttachmentCombo, viewAttachment, deleteAttachment, getCommentsCombo, previewSampleReport, getFilterBasedTest,
    getEnforceCommentsHistory, reportGenerate, getSubSampleChildTabDetail, ViewPatientDetails,
    getTestBasedCompletedBatch, updateEnforceStatus, checkReleaseRecord, getTestResultCorrection, fetchParameterDetails,
    filterObject, toTimestamp, rearrangeDateFormatforKendoDataTool,getTestApprovalFilterDetails
} from '../../actions'
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import ApprovalResultsTab from './ApprovalResultsTab';
import { getControlMap, showEsign, sortData, constructOptionList, getSameRecordFromTwoArrays, convertDateValuetoString, rearrangeDateFormat, Lims_JSON_stringify, create_UUID } from '../../components/CommonScript';
import { toast } from 'react-toastify';
//import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import ApprovalFilter from './ApprovalFilter'
import { designProperties, transactionStatus, RegistrationType, RegistrationSubType, SideBarSeqno, ResultEntry } from '../../components/Enumeration';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import SampleInfoGrid from './SampleInfoGrid';
import SampleInfoView from './SampleInfoView';
import ApprovalInstrumentTab from './ApprovalInstrumentTab'
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import Esign from '../audittrail/Esign';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import EditApprovalParameter from './EditApprovalParameter';
//import ApprovalHistoryTab from './ApprovalHistoryTab';
import SampleApprovalHistory from './SampleApprovalHistory';
import ResultChangeHistoryTab from './ResultChangeHistoryTab';
import ApprovalTask from './ApprovalTask';
import { templateChangeHandler } from '../checklist/checklist/checklistMethods';
import TemplateForm from '../checklist/checklist/TemplateForm';
import Attachments from '../attachmentscomments/attachments/Attachments';
import { onSaveSampleAttachment, onSaveSubSampleAttachment, onSaveTestAttachment } from '../attachmentscomments/attachments/AttachmentFunctions';
import Comments from '../attachmentscomments/comments/Comments';
import { onSaveSampleComments, onSaveSubSampleComments, onSaveTestComments } from '../attachmentscomments/comments/CommentFunctions';
//import { Tooltip } from '@progress/kendo-react-tooltip';
import CustomPopOver from '../../components/customPopover';
//import ScrollBar from 'react-perfect-scrollbar';
//import ApprovalPrintHistoryTab from './ApprovalPrintHistoryTab';
import ApprovalHistoryTab from './ApprovalHistoryTab';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import DataGrid from '../../components/data-grid/data-grid.component';
//import ReportHistoryTab from './ReportHistoryTab';
// import ReactTooltip from 'react-tooltip';
import ApprovalUsedMaterial from './ApprovalUsedMaterial';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import SpecificationInfo from '../testgroup/SpecificationInfo';
import fullviewExpand from '../../assets/image/fullview-expand.svg';
import fullviewCollapse from '../../assets/image/fullview-collapse.svg';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
// import ReactTooltip from 'react-tooltip';
import CustomTab from '../../components/custom-tabs/custom-tabs.component';
import ResultEntryForm from '../ResultEntryBySample/ResultEntryForm';
import ModalShow from '../../components/ModalShow';
import { numberConversion, numericGrade } from '../ResultEntryBySample/ResultEntryValidation';
import { ReactComponent as ResultCorrection } from '../../assets/image/resultcorrection.svg'
import { checkBoxOperation } from '../../components/Enumeration';
import { sortDataForDate } from '../../components/CommonScript';
import KendoDatatoolFilter from '../contactmaster/KendoDatatoolFilter';
import { intl } from '../../components/App';
import { ReactComponent as SaveIcon } from '../../assets/image/save_icon.svg';
import CustomPopover from '../../components/customPopover';

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
        this.confirmMessage = new ConfirmMessage();

        this.state = {
            resultCorrectionDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            sampleGridDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            resultDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, //group: [{ field: 'ssamplearno' }]
            },
            instrumentDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, //group: [{ field: 'ssamplearno' }] 
            },
            materialDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, //group: [{ field: 'sarno' }] 
            },
            taskDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,// group: [{ field: 'sarno' }] 
            },
            testCommentDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, //group: [{ field: 'ssamplearno' }] 
            },
            documentDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, //group: [{ field: 'ssamplearno' }] 
            },
            resultChangeDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, //group: [{ field: 'ssamplearno' }] 
            },
            sampleHistoryDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, //group: [{ field: 'sarno' }] 
            },
            reportHistoryDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            historyDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, //group: [{ field: 'sarno' }] 
            },
            dataState: { skip: 0, take: 10 },
            samplePrintHistoryDataState: {
                skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, //group: [{ field: 'sarno' }]
            },
            subSampleCommentDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'groupingField' }] 
            },
            subSampleAttachmentDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'groupingField' }] 
            },
            sampleCommentDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'groupingField' }] 
            },
            registrationTestHistoryDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: 'groupingField' }] 
            },
            currentResultState: { skip: 0, take: 10 },
            userRoleControlRights: [],
            controlMap: new Map(),
            masterStatus: "",
            error: "",
            oldComboData: {},
            selectedRecord: {},
            operation: "",
            screenName: undefined,
            showSample: false,
            showSubSample: false,
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
            stateDynamicDesign: [],
            sampleSearchField: [],
            subsampleSearchField: [],
            testSearchField: [],
            TestList: [],
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],
            testskip: 0,
            testtake: this.props.Login.settings && this.props.Login.settings[12],
            splitChangeWidthPercentage: 22,
            subSampleSkip: 0,
            subSampleTake: this.props.Login.settings && this.props.Login.settings[12],
            initialVerticalWidth: "57vh",
            enablePin: false,
            filterSampleList: [],
        }
        //this.onSecondaryPaneSizeChange = this.onSecondaryPaneSizeChange.bind(this);
    }

    onResultInputChange = (parameterResults) => {
        this.setState({
            parameterResults: [...parameterResults],
            isParameterInitialRender: false
            // currentAlertResultCode,
            //  currentntestgrouptestpredefcode
        });
    }

    closeModalShow = () => {
        let loadEsign = this.props.Login.loadEsign;
        let closeModal = true;
        let modalShow = this.props.Login.modalShow;
        let ReportmodalShow = this.props.Login.ReportmodalShow;
        let selectedRecord = this.props.Login.selectedRecord;
		//ALPD-5601-->Added by Vignesh R(01-04-2025)--false set to isFilterDetail while close the modal
        let isFilterDetail=this.props.Login.isFilterDetail;
        let selectedComment = this.props.Login.masterData.selectedComment;
        if (this.props.Login.loadEsign) {
            loadEsign = false;
        } else {
            modalShow = false;
            ReportmodalShow = false;
			//ALPD-5601-->Added by Vignesh R(01-04-2025)--false set to isFilterDetail while close the modal
            isFilterDetail=false;
            selectedRecord = {};
            selectedComment = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { modalShow, isFilterDetail,selectedRecord, selectedId: null, loadEsign, closeModal, selectedComment, ReportmodalShow },
        };
        this.props.updateStore(updateInfo);
    };


    onSaveModalResultClick = (saveType, data) => {

        // ALPD-4026 (18-05-2024) Removed state parameterResults value due to sent latest record. State value have old record
        let ReleaseParameter = this.props.Login.parameterResults && this.props.Login.parameterResults;
        // let selectedRecord = this.state.selectedRecord || {};
        // let selectedId = this.props.Login.selectedId || null;
        // let additionalInfo = this.state.selectedRecord.additionalInfo || [];
        const nregtypecode = parseInt(this.props.Login.masterData.realRegTypeValue.nregtypecode);
        const nregsubtypecode = parseInt(this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode);
        const ndesigntemplatemappingcode = parseInt(this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode);
        const editResultId = this.state.controlMap.has("EditResult") && this.state.controlMap.get("EditResult").ncontrolcode;
        let transactiontestcode = this.props.Login.masterData.APSelectedTest && this.props.Login.masterData.APSelectedTest.map(item => item.ntransactiontestcode).join(",");
        const classUrl = "approval";
        const formData = new FormData();
        let neditable = 0;
        let releaseParameters = [];
        let inputParam = {};
        // let inputData = [];
        let i = 0;
        if (ReleaseParameter !== undefined && ReleaseParameter.length > 0 && ReleaseParameter[0].sresult !== "") {
            ReleaseParameter.map((resultData, index) => {
                let results = {};
                if (resultData.editable === true) {
                    neditable = 1;
                    switch (resultData.nparametertypecode) {
                        case 1:
                            results["jsondata"] = {
                                ncalculatedresult: resultData["ncalculatedresult"],
                                sresult: resultData.sresult,
                                sfinal: resultData.sresult !== "" ? numberConversion(parseFloat(resultData.sresult), parseInt(resultData.nroundingdigits)) : "",
                                sunitname: resultData.unitcode.label,
                                sresultaccuracyname: resultData.resultaccuracycode.label,
                                nresultaccuracycode: resultData.resultaccuracycode.value,
                            }
                            results["jsonstring"] = JSON.stringify(results["jsondata"]);
                            results["ncalculatedresult"] = resultData["ncalculatedresult"];
                            results["sresult"] = resultData.sresult;
                            results["sfinal"] = resultData.sresult !== "" ?
                                numberConversion(parseFloat(resultData.sresult), parseInt(resultData.nroundingdigits)) : "";
                            results["ngradecode"] = resultData.sresult !== "" ?
                                numericGrade(resultData, results["sfinal"]) : -1;
                            results['nenteredrole'] = this.props.Login.userInfo.nuserrole;
                            results['nenteredby'] = this.props.Login.userInfo.nusercode;
                            results['ntransactionresultcode'] = resultData.ntransactionresultcode;
                            results['ntransactiontestcode'] = resultData.ntransactiontestcode;
                            results['nparametertypecode'] = resultData.nparametertypecode;
                            results['nunitcode'] = resultData.unitcode.value;


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
                            results['ntransactionresultcode'] = resultData.ntransactionresultcode;
                            results['ntransactiontestcode'] = resultData.ntransactiontestcode;
                            results['nparametertypecode'] = resultData.nparametertypecode;
                            results['nunitcode'] = resultData.nunitcode;

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
                            results["ngradecode"] = resultData.sresult.trim() === "" ? -1 : ResultEntry.RESULTSTATUS_FIO;
                            results['nenteredrole'] = this.props.Login.userInfo.nuserrole;
                            results['nenteredby'] = this.props.Login.userInfo.nusercode;
                            results['ntransactionresultcode'] = resultData.ntransactionresultcode;
                            results['ntransactiontestcode'] = resultData.ntransactiontestcode;
                            results['nparametertypecode'] = resultData.nparametertypecode;
                            results['nunitcode'] = resultData.nunitcode;
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
                                results["ngradecode"] = resultData.sresult.trim() === "" ? -1 : ResultEntry.RESULTSTATUS_FIO;
                                results["nenteredrole"] = this.props.Login.userInfo.nuserrole;
                                results["nenteredby"] = this.props.Login.userInfo.nusercode;
                                results["ntransactionresultcode"] = resultData.ntransactionresultcode;
                                results["ntransactiontestcode"] = resultData.ntransactiontestcode;
                                results['nparametertypecode'] = resultData.nparametertypecode;
                                results["ssystemfilename"] = uniquefilename;
                                results["nfilesize"] = resultData.sfinal[0] && resultData.sfinal[0].size;
                                results['nunitcode'] = resultData.nunitcode;
                                formData.append("uploadedFile" + index, resultData.sfinal[0] && resultData.sfinal[0]);
                                formData.append("uniquefilename" + index, uniquefilename);
                                formData.append("ntransactiontestcode", resultData.ntransactiontestcode);
                                i++;
                            }
                            else {
                                const splittedFileName = resultData.sfinal ? resultData.sfinal[0] && resultData.sfinal[0].name.split('.') : "";
                                //const fileExtension = resultData.sfinal ? resultData.sfinal[0] && resultData.sfinal[0].name.split('.')[splittedFileName.length - 1] : "";
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
                        releaseParameters.push(results);
                    }
                }
                return null;
            });

            if (neditable === 0) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    // ALPD-4026 (18-05-2024) Added modalShow as false
                    data: { loading: false, openModal: false, modalShow: false, parameterResults: [], selectedRecord: {} }
                }
                return this.props.updateStore(updateInfo);
            }

            formData.append("filecount", i);
            formData.append("nregtypecode", nregtypecode);
            formData.append("nregsubtypecode", nregsubtypecode);
            formData.append("ndesigntemplatemappingcode", ndesigntemplatemappingcode);
            formData.append("transactiontestcode", transactiontestcode);
            formData.append("resultData", JSON.stringify(releaseParameters));
            inputParam = {
                classUrl: classUrl,
                methodUrl: "ReleaseParameter",
                inputData: { userinfo: this.props.Login.userInfo, doAction: "editresult" },
                formData: formData,
                isFileupload: true,
                operation: "update",
                displayName: this.props.Login.inputParam.displayName, saveType//, postParam
            }



            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, editResultId)) {

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        modalShow: false,
                        openModal: true,
                        ncontrolcode: editResultId,
                        screenData: { inputParam, masterData }, saveType
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {

                this.props.crudMaster(inputParam, this.props.Login.masterData, "modalShow");
            }
        }
        // else {
        //     const updateInfo = {
        //         typeName: DEFAULT_RETURN,
        //         data: { loading: false, openModal: false }
        //     }
        //     return this.props.updateStore(updateInfo);
        // }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERRESULT" }));
        }





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

    handleTestPageChange = e => {
        this.setState({
            testskip: e.skip,
            testtake: e.take
        });
    };

    handleSubSamplePageChange = e => {
        this.setState({
            subSampleSkip: e.skip,
            subSampleTake: e.take
        });
    };

    // handleSubSamplePageChange = e => {
    //     this.setState({ subSampleSkip: e.skip, subSampleTake: e.take });

    //     setTimeout(() => { this._scrollBarRef.updateScroll() })
    // }

    showAPSampleinfo = () => {

        this.setState({ showSample: true, showTest: false })
    }

    showAPTestList() {

        this.setState({ showTest: true, showSample: false, showSubSample: false })
    }
    showAPSubSampleinfo() {
        this.setState({ showSample: false, showTest: true, showSubSample: !this.state.showSubSample })
    }
    gridfillingColumn(data) {
        //  const tempArray = [];
        const temparray = data && data.map((option) => {
            return { "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode], "dataField": option[designProperties.VALUE], "width": "200px", "columnSize": "3", "dataType": [option[designProperties.LISTITEM]] };
        });
        return temparray;
    }

    sampleInfoDataStateChange = (event) => {
        this.setState({
            sampleGridDataState: event.dataState
        });
    }
    resultCorrectionDataStateChange = (event) => {
        this.setState({
            resultCorrectionDataState: event.dataState
        });
    }
    currentResultStateChange = (event) => {
        this.setState({
            currentResultState: event.dataState
        });
    }

    tabDetailResultView = () => {
        const tabMap = new Map();

        tabMap.set("IDS_PREVIOUSRESULT",
            <DataGrid
                primaryKeyField={"ntransactiontestcode"}
                data={this.props.Login.masterData.AuditModifiedComments || []}
                detailedFieldList={this.feildsForGrid}
                extractedColumnList={this.feildsForGrid}
                dataResult={this.props.Login.masterData.AuditModifiedComments && this.props.Login.masterData.AuditModifiedComments.length > 0
                    && process(this.props.Login.masterData.AuditModifiedComments, this.state.dataState ? this.state.dataState : { skip: 0, take: 10 })}
                dataState={this.state.dataState
                    ? this.state.dataState : { skip: 0, take: 10 }}
                pageable={true}
                pageSizes={this.props.Login.settings && this.props.Login.settings[4].split(",").map(setting => parseInt(setting))}

                scrollable={'scrollable'}
                dataStateChange={this.dataStateChange}
                activeTabName={"IDS_PREVIOUSRESULT"}
                gridHeight={'500px'}
            >
            </DataGrid>
        );
        tabMap.set("IDS_CURRENTRESULT",
            <DataGrid
                primaryKeyField={"ntransactiontestcode"}
                data={this.props.Login.masterData.CurrentResult || []}
                detailedFieldList={this.feildsForGrid}
                extractedColumnList={this.feildsForGrid}
                dataResult={this.props.Login.masterData.CurrentResult && this.props.Login.masterData.CurrentResult.length > 0
                    && process(this.props.Login.masterData.CurrentResult, this.state.currentResultState ? this.state.currentResultState : { skip: 0, take: 10 })}
                dataState={this.state.currentResultState
                    ? this.state.currentResultState : { skip: 0, take: 10 }}
                pageable={true}
                scrollable={'scrollable'}
                dataStateChange={this.currentResultStateChange}
                activeTabName={"IDS_CURRENTRESULT"}
                pageSizes={this.props.Login.settings && this.props.Login.settings[4].split(",").map(setting => parseInt(setting))}
                gridHeight={'500px'}
            >
            </DataGrid>);

        return tabMap;
    }
    onTabChangeResultView = (tabProps) => {
        let masterData = this.props.Login.masterData && this.props.Login.masterData
        masterData['activeTabName'] = tabProps.activeTabName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { masterData }
        }
        this.props.updateStore(updateInfo);
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



    sideNavDetail = (screenName) => {
        let { testskip, testtake } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : this.props.Login.masterData.AP_TEST || [];
        //const editTestCommentsId = this.state.controlMap.has("EditTestComment") && this.state.controlMap.get("EditTestComment").ncontrolcode;
        testList = testList.slice(testskip, testskip + testtake);
        // let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.APSelectedTest, "ntransactiontestcode");
        // let npreregno = this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",") : "-1";
        // let ntransactiontestcode = this.props.Login.masterData.APSelectedTest ? this.props.Login.masterData.APSelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";

        return (
            screenName == "IDS_RESULTS" ?
                <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_RESULTS"} tabDetail={this.resultTabDetail()} onTabChange={this.onTabChange} />
                : screenName === "IDS_ATTACHMENTS" ?
                    <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_TESTATTACHMENTS"} tabDetail={this.attachmentTabDetail()} destroyInactiveTabPane={true} onTabChange={this.onTabChange} />
                    : screenName === "IDS_COMMENTS" ?
                        <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_TESTCOMMENTS"} tabDetail={this.commentTabDetail()} destroyInactiveTabPane={true} onTabChange={this.onTabChange} />
                        : screenName === "IDS_HISTORY" ?
                            <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_TESTHISTORY"} tabDetail={this.historyTabDetail()} destroyInactiveTabPane={true} onTabChange={this.onTabChange} />
                            :
                            screenName === "IDS_INSTRUMENT" ?
                                <ApprovalInstrumentTab
                                    userInfo={this.props.Login.userInfo}
                                    genericLabel={this.props.Login.genericLabel}
                                    masterData={this.props.Login.masterData}
                                    inputParam={this.props.Login.inputParam}
                                    dataState={this.state.instrumentDataState}
                                    dataStateChange={this.testDataStateChange}
                                    screenName="IDS_INSTRUMENT"
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    selectedId={null}
                                />
                                :
                                screenName === "IDS_MATERIAL" ?
                                    <ApprovalUsedMaterial
                                        userInfo={this.props.Login.userInfo}
                                        genericLabel={this.props.Login.genericLabel}
                                        masterData={this.props.Login.masterData}
                                        inputParam={this.props.Login.inputParam}
                                        methodUrl={"ResultUsedMaterial"}
                                        controlMap={this.state.controlMap}
                                        // deleteParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
                                        //editParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
                                        dataState={this.state.materialDataState}
                                        // selectedId={this.props.Login.selectedId || null}
                                        isActionRequired={false}
                                        dataStateChange={this.testDataStateChange}
                                        //deleteRecord={this.deleteMaterialRecord}
                                        fetchRecord={this.props.fetchMaterialRecord}
                                        userRoleControlRights={this.state.userRoleControlRights}
                                        screenName="IDS_MATERIAL"
                                        selectedId={null}
                                    />
                                    :
                                    screenName === "IDS_TASK" ?
                                        <ApprovalTask
                                            userInfo={this.props.Login.userInfo}
                                            genericLabel={this.props.Login.genericLabel}
                                            ResultUsedTasks={this.props.Login.masterData.ResultUsedTasks}
                                            inputParam={this.props.Login.inputParam}
                                            dataState={this.state.taskDataState}
                                            masterData={this.props.Login.masterData}
                                            dataStateChange={this.testDataStateChange}
                                            screenName="IDS_TASK"
                                            controlMap={this.state.controlMap}
                                            userRoleControlRights={this.state.userRoleControlRights}
                                            selectedId={null}
                                        />
                                        :
                                        screenName === "IDS_TESTAPPROVALHISTORY" ?
                                            <ApprovalHistoryTab
                                                userInfo={this.props.Login.userInfo}
                                                genericLabel={this.props.Login.genericLabel}
                                                ApprovalHistory={this.props.Login.masterData.ApprovalHistory}
                                                inputParam={this.props.Login.inputParam}
                                                dataState={this.state.historyDataState}
                                                masterData={this.props.Login.masterData}
                                                dataStateChange={this.testDataStateChange}
                                                screenName="IDS_TESTAPPROVALHISTORY"
                                                controlMap={this.state.controlMap}
                                                userRoleControlRights={this.state.userRoleControlRights}
                                                selectedId={null}
                                            />

                                            :
                                            screenName === "IDS_SAMPLEDETAILS" ?
                                                this.props.Login.masterData.APSelectedSample && this.props.Login.masterData.APSelectedSample.length === 1 ?
                                                    <SampleInfoView
                                                        data={(this.props.Login.masterData.APSelectedSample && this.props.Login.masterData.APSelectedSample.length > 0) ?
                                                            this.props.Login.masterData.APSelectedSample[this.props.Login.masterData.APSelectedSample.length - 1] : {}}
                                                        SingleItem={this.props.Login.masterData.APSelectedSample && this.props.Login.masterData.APSelectedSample ?
                                                            this.state.SingleItem : []}
                                                        screenName="IDS_SAMPLEINFO"
                                                        userInfo={this.props.Login.userInfo}

                                                    />

                                                    :
                                                    <SampleInfoGrid
                                                        selectedSample={this.props.Login.masterData.APSelectedSample}
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
                                                        jsonField={"jsondata"}
                                                    />

                                                : ""
        )
    }


    changePropertyViewClose = (id) => {
        // this.setState({
        //             activeTabIndex :undefined,
        //             activeTestTab:undefined,
        //             activeTabId :  id
        //         })

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
        let activeTabIndex;
        //let activeTabId
        if (window.innerWidth > 992 && event && this.state.enableAutoClick || !event) {
            activeTabIndex = this.state.activeTabIndex !== index ? index : id ? index : false;
            //activeTabId = this.state.activeTabIndex !== index ? true:false;
        }
        if (status !== "click") {
            if (index) {
                const tabProps = {
                    tabSequence: SideBarSeqno.TEST,
                    screenName: screenName === "IDS_COMMENTS" ? "IDS_TESTCOMMENTS" : screenName === "IDS_ATTACHMENTS" ? "IDS_TESTATTACHMENTS" : screenName === "IDS_HISTORY" ? "IDS_TESTHISTORY" : screenName,
                    activeTabIndex,
                    //activeTabId
                }
                this.onTabChange(tabProps);
            }

            //     if (index == SideBarTabIndex.RESULT) {
            //         const tabProps = {
            //             tabSequence: SideBarSeqno.TEST,
            //             screenName: "IDS_RESULTS",
            //             activeTabIndex,
            //             activeTabId
            //         }
            //         this.onTabChange(tabProps);
            //     }
            //     else if (index == SideBarTabIndex.INSTRUMENT) {
            //         const tabProps = {
            //             tabSequence: SideBarSeqno.TEST,
            //             screenName: "IDS_INSTRUMENT",
            //             activeTabIndex,
            //             activeTabId
            //         }
            //         this.onTabChange(tabProps);
            //     }
            //     else if (index == SideBarTabIndex.MATERIAL) {
            //         const tabProps = {
            //             tabSequence: SideBarSeqno.TEST,
            //             screenName: "IDS_MATERIAL",
            //             activeTabIndex,
            //             activeTabId
            //         }
            //         this.onTabChange(tabProps);
            //     }
            //     else if (index == SideBarTabIndex.TASK) {
            //         const tabProps = {
            //             tabSequence: SideBarSeqno.TEST,
            //             screenName: "IDS_TASK",
            //             activeTabIndex,
            //             activeTabId
            //         }
            //         this.onTabChange(tabProps);
            //     }
            //    else if (index == SideBarTabIndex.TESTAPPROVALHISTORY) {
            //         const tabProps = {
            //             tabSequence: SideBarSeqno.TEST,
            //             screenName: "IDS_TESTAPPROVALHISTORY",
            //             activeTabIndex,
            //             activeTabId
            //         }
            //         this.onTabChange(tabProps);
            //     }
            //     else if (index == SideBarTabIndex.ATTACHMENTS) {
            //         const tabProps = {
            //             tabSequence: SideBarSeqno.TEST,
            //             screenName: "IDS_TESTATTACHMENTS",
            //             activeTabIndex,
            //             activeTabId
            //         }
            //         this.onTabChange(tabProps);
            //     }
            //     else if (index == SideBarTabIndex.COMMENTS) {
            //         const tabProps = {
            //             tabSequence: SideBarSeqno.TEST,
            //             screenName: "IDS_TESTCOMMENTS",
            //             activeTabIndex,
            //             activeTabId
            //         }
            //         this.onTabChange(tabProps);
            //     }
            //     else {
            //         if (window.innerWidth > 992 && event && this.state.enableAutoClick || !event) {

            //             const updateInfo = {
            //                 typeName: DEFAULT_RETURN,
            //                 data: {
            //                     activeTabIndex: this.state.activeTabIndex !== index ? index : id ? index : false,
            //                     activeTabId: id
            //                 }
            //             }
            //             this.props.updateStore(updateInfo);

            //         }
            //     }
        }

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

    onTabChange = (tabProps) => {
        const activeTestTab = tabProps.screenName;
        const tabseqno = tabProps.tabSequence;
        // if (activeTestTab !== this.props.Login.activeTestTab) {
        if (tabseqno === SideBarSeqno.TEST) {
            if (this.props.Login.masterData.APSelectedTest && this.props.Login.masterData.APSelectedTest.length > 0) {
                let inputData = {
                    masterData: this.props.Login.masterData,
                    APSelectedTest: this.props.Login.masterData.APSelectedTest,
                    ntransactiontestcode: this.props.Login.masterData.APSelectedTest ?
                        String(this.props.Login.masterData.APSelectedTest.map(item => item.ntransactiontestcode).join(",")) : "-1",
                    npreregno: this.props.Login.masterData.APSelectedSample ?
                        this.props.Login.masterData.APSelectedSample.map(item => item.npreregno).join(",") : "-1",
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
                    registrationTestHistoryDataState: this.state.registrationTestHistoryDataState,
                    activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex,
                }
                this.props.getTestChildTabDetail(inputData, true)
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))
            }
        }
        else if (tabseqno === SideBarSeqno.SUBSAMPLE) {
            if (activeTestTab !== this.props.Login.activeTestTab) {
                let inputData = {
                    masterData: this.props.Login.masterData,
                    selectedSubSample: this.props.Login.masterData.APSelectedSubSample,
                    ntransactionsamplecode: this.props.Login.masterData.APSelectedSubSample ? this.props.Login.masterData.APSelectedSubSample.map(item => item.ntransactionsamplecode).join(",") : "-1",
                    userinfo: this.props.Login.userInfo,
                    screenName: activeTestTab,
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
                    selectedSample: this.props.Login.masterData.APSelectedSample,
                    npreregno: this.props.Login.masterData.APSelectedSample ? this.props.Login.masterData.APSelectedSample.map(item => item.npreregno).join(",") : "-1",
                    userinfo: this.props.Login.userInfo,
                    screenName: activeTestTab,
                    activeSampleTab: activeTestTab,
                    activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex
                }
                this.props.getSampleChildTabDetail(inputData)
            }
        }

        //}
    }

    render() {
        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
        const auditInfoFields = [
            // { "fieldName": "sarno", "label": "IDS_ARNO" }, 
            { "label": this.props.Login.genericLabel && this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], "fieldName": "sarno", },
            //{ "fieldName": "stestsynonym", "label": "IDS_TEST" },
            //{ "fieldName": "spatientid", "label": "IDS_PATIENTID" },   
            { "fieldName": "sfirstname", "label": "IDS_PATIENTNAME" },
            //{ "fieldName": "sage", "label": "IDS_AGE" },
            { "fieldName": "sgendername", "label": "IDS_GENDER" },

            //{ "fieldName": "sregdate", "label": "IDS_REGISTRATIONDATE" },
            //{ "fieldName": "scompletedate", "label": "IDS_COMPLETEDDATEANDTIME" }

        ];

        this.feildsForGrid =
            [
                // { "idsName": "IDS_TEST", "dataField": "stestsynonym", "width": "200px" },
                { "idsName": this.props.Login.genericLabel && this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], "dataField": "ssamplearno", "width": "200px" },

                //{ "idsName": "IDS_ARNO", "dataField": "sarno", "width": "200px" },
                //{ "idsName": "IDS_SUBSAMPLE", "dataField": "ssamplearno", "width": "200px" }, 
                { "idsName": "IDS_TEST", "dataField": "stestsynonym", "width": "200px" },
                { "idsName": "IDS_PARAMETER", "dataField": "sparametersynonym", "width": "200px" },
                { "idsName": "IDS_FINALRESULT", "dataField": "sfinal", "width": "200px" },
                { "idsName": "IDS_RESULTFLAG", "dataField": "sgradename", "width": "200px" },
                { "idsName": "IDS_REGISTRATIONDATE", "dataField": "sregdate", "width": "200px" },
                { "idsName": "IDS_REPORTREFNO", "dataField": "sreportno", "width": "200px" },
                { "idsName": this.props.Login.genericLabel && this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], "dataField": "sarno", "width": "200px" },

                // { "idsName": "IDS_COMPLETEDDATEANDTIME", "dataField": "scompletedate", "width": "200px" },


            ];
        let resultCorrectionColumnList = [{ "idsName": "IDS_ARNO", "dataField": "sarno", "width": "150px" }];

        this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample &&
            resultCorrectionColumnList.push(
                { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "150px" }
            )

        resultCorrectionColumnList.push(
            { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "150px" },
            { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametersynonym", "width": "150px" },
            { "idsName": "IDS_FINALRESULT", "dataField": "sfinal", "width": "150px" },
            { "idsName": "IDS_RESULTFLAG", "dataField": "sgradename", "width": "150px", "fieldType": "gradeColumn" },
            //Commented  by sonia ALPD-4275 for Unit Name NA Showing
            // { "idsName": "IDS_UNIT", "dataField": "sunitname", "width": "150px" },
            { "idsName": "IDS_RESULTACCURACY", "dataField": "sresultaccuracyname", "width": "150px" },
            { "idsName": "IDS_LOWA", "dataField": "smina", "width": "150px" },
            { "idsName": "IDS_LOWB", "dataField": "sminb", "width": "150px" },
            { "idsName": "IDS_HIGHA", "dataField": "smaxa", "width": "150px" },
            { "idsName": "IDS_HIGHB", "dataField": "smaxb", "width": "150px" },
            /* { "idsName": "IDS_MINLOD", "dataField": "sminlod", "width": "150px" },
             { "idsName": "IDS_MAXLOD", "dataField": "smaxlod", "width": "150px" },
             { "idsName": "IDS_MINLOQ", "dataField": "sminloq", "width": "150px" },
             { "idsName": "IDS_MAXLOQ", "dataField": "smaxloq", "width": "150px" }*/
        )
        let mandatoryValidation = [];

        if (this.props.Login.operation === 'enforce') {
            mandatoryValidation.push({ "idsName": "IDS_COMMENTS", "dataField": "senforcestatuscomment", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" })
        }

        if (this.props.Login.operation === 'dynamic') {
            mandatoryValidation.push({ "idsName": "IDS_RETESTCOUNT", "dataField": "retestcount", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" })
        }



        const filterSampleParam = {
            inputListName: "AP_SAMPLE",
            skip: 0,
            take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
            selectedObject: "APSelectedSample",
            primaryKeyField: "npreregno",
            fetchUrl: "approval/getApprovalSubSample",
            isSortable: true,
            sortValue: 'npreregno',
            sortList: ['AP_TEST'],
            childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" }, { ref: this.searchTestRef, childFilteredListName: "searchedTests" }],
            fecthInputObject: {
                ntype: 2,
                nflag: 2,
                nsampletypecode: (this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode) || -1,
                nregtypecode: (this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
                nregsubtypecode: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
                nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                ntransactionstatus: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus !== undefined ? String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) : "-1",
                napprovalconfigcode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
                napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) : null,
                nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection && this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.realUserSectionValue.nsectioncode) : null,
                ntestcode: this.props.Login.masterData.TestValue && this.props.Login.masterData.TestValue.ntestcode,
                activeTestTab: this.props.Login.activeTestTab || "IDS_RESULTS",
                activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                dfrom: obj.fromDate,
                dto: obj.toDate,
                userinfo: this.props.Login.userInfo,
                // checkBoxOperation: 3,
                checkBoxOperation: checkBoxOperation.SINGLESELECT,
                ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1,
                activeTestTab: this.props.Login.activeTestTab || "IDS_RESULTS",
                activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS"
            },
            masterData: this.props.Login.masterData,
            // searchFieldList: ["sarno", "dregdate", "sdecisionstatus", "ssampletypestatus", "smanuflotno", "smanufname", "smanufsitename", "sproductcatname", "sproductname", "sspecname"],
            searchFieldList: this.state.sampleSearchField || [],
            changeList: ["AP_SUBSAMPLE", "AP_TEST", "ApprovalParameter",
                "ApprovalResultChangeHistory", "ApprovalHistory", "SampleApprovalHistory", "ResultUsedInstrument",
                "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment",
                "RegistrationAttachment", "APSelectedSample", "APSelectedSubSample", "APSelectedTest", "PrintHistory", "COAHistory"]
        };
        const filterSubSampleParam = {
            inputListName: "AP_SUBSAMPLE",
            selectedObject: "APSelectedSubSample",
            primaryKeyField: "ntransactionsamplecode",
            fetchUrl: "approval/getApprovalTest",
            isSortable: true,
            sortValue: 'npreregno',
            sortList: ['AP_TEST'],
            childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedTests" }],
            fecthInputObject: {
                ntype: 2,
                nflag: 2,
                npreregno: this.props.Login.masterData.APSelectedSample ? this.props.Login.masterData.APSelectedSample.map(sample => sample.npreregno).join(",") : "-1",
                nsampletypecode: (this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue.nsampletypecode) || -1,
                nregtypecode: (this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode) || -1,
                nregsubtypecode: (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) || -1,
                nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                ntransactionstatus: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== undefined ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) : "-1",
                napprovalconfigcode: this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigcode || -1 : null,
                napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode : null,
                nsectioncode: this.props.Login.masterData.UserSectionValue ? this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.UserSectionValue.nsectioncode) : null,
                dfrom: obj.fromDate,
                dto: obj.toDate,
                userinfo: this.props.Login.userInfo,
                //  checkBoxOperation: 3,
                checkBoxOperation: checkBoxOperation.SINGLESELECT,
                ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1,
                activeTestTab: this.props.Login.activeTestTab || "IDS_RESULTS",
                activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1
            },
            masterData: this.props.Login.masterData,
            searchFieldList: this.state.subsampleSearchField || [],
            changeList: ["AP_TEST", "ApprovalParameter",
                "ApprovalResultChangeHistory", "ApprovalHistory", "ResultUsedInstrument",
                "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment",
                "RegistrationAttachment", "APSelectedSubSample", "APSelectedTest", "RegistrationSampleComment", "RegistrationSampleAttachment"]
        };

        const filterTestParam = {
            inputListName: "AP_TEST",
            selectedObject: "APSelectedTest",
            primaryKeyField: "ntransactiontestcode",
            fetchUrl: this.getActiveTestURL(),
            fecthInputObject: {
                ntransactiontestcode: this.props.Login.masterData.APSelectedTest ? this.props.Login.masterData.APSelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
                userinfo: this.props.Login.userInfo,
                // checkBoxOperation: 3,
                checkBoxOperation: checkBoxOperation.SINGLESELECT,
                ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1,
                activeTestTab: this.props.Login.activeTestTab || "IDS_RESULTS",
                activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1
            },
            isSingleSelect: false,
            masterData: this.props.Login.masterData,
            searchFieldList: this.state.testSearchField || [],
            changeList: ["ApprovalParameter",
                "ApprovalResultChangeHistory", "ApprovalHistory", "SampleApprovalHistory", "ResultUsedInstrument",
                "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment",
                "RegistrationAttachment", "APSelectedTest"]
        };

        let AP_SampleList = this.props.Login.masterData.AP_SAMPLE ? sortData(this.props.Login.masterData.AP_SAMPLE, 'descending', 'npreregno') : [];
        let AP_SubSampleList = this.props.Login.masterData.AP_SUBSAMPLE ? this.props.Login.masterData.AP_SUBSAMPLE : [];
        let AP_TestList = this.props.Login.masterData.AP_TEST ? this.props.Login.masterData.AP_TEST : [];
        let decisionStatus = this.props.Login.masterData.decisionStatus ? sortData(this.props.Login.masterData.decisionStatus, 'ascending', 'ntransactionstatus') : [];
        let actionStatus = this.props.Login.masterData.actionStatus ? sortData(this.props.Login.masterData.actionStatus, 'descending', 'ntransactionstatus') : [];
        let subSampleGetParam = {
            masterData: this.props.Login.masterData,
            ntransactionstatus: String(this.props.Login.masterData.realFilterStatusValue ? this.props.Login.masterData.realFilterStatusValue.ntransactionstatus : this.props.Login.masterData.FilterStatusValue ? this.props.Login.masterData.FilterStatusValue.ntransactionstatus : -1),
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            nsectioncode: this.props.Login.masterData.UserSectionValue ? this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.UserSectionValue.nsectioncode) : null,
            ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode : -1,
            napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode : -1,
            nneedsubsample: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
            nneedtemplatebasedflow: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow,
            activeTestTab: this.props.Login.activeTestTab || "IDS_RESULTS",
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
            activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
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
            ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1,
            nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1,
            activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 8 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 8 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
        };
        let testGetParam = {
            masterData: this.props.Login.masterData,
            ntransactionstatus: String(this.props.Login.masterData.realFilterStatusValue ? this.props.Login.masterData.realFilterStatusValue.ntransactionstatus : this.props.Login.masterData.FilterStatusValue ? this.props.Login.masterData.FilterStatusValue.ntransactionstatus : -1),
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            npreregno: this.props.Login.masterData.APSelectedSample && this.props.Login.masterData.APSelectedSample.map(sample => sample.npreregno).join(","),
            napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode : -1,
            nsectioncode: this.props.Login.masterData.UserSectionValue ? this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.UserSectionValue.nsectioncode) : null,
            ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode : -1,
            activeTestTab: this.props.Login.activeTestTab || "IDS_RESULTS",
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEINFO",
            activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
            screenName: this.props.Login.screenName,
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
            subSampleCommentDataState: this.state.subSampleCommentDataState,
            subSampleAttachmentDataState: this.state.subSampleAttachmentDataState,
            ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1,
            nneedsubsample: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
            nneedtemplatebasedflow: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow,
            // activeTabIndex: this.state.enableAutoClick ? 1 : "",
            activeTabIndex: this.state.enableAutoClick ? 1 : this.state.activeTabIndex ? this.state.activeTabIndex : undefined,
            nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1
        };
        let testChildGetParam = {
            masterData: this.props.Login.masterData,
            ntransactionstatus: String(this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus),
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
            npreregno: this.props.Login.masterData.APSelectedSample && this.props.Login.masterData.APSelectedSample.map(sample => sample.npreregno).join(","),
            ntransactionsamplecode: this.props.Login.masterData.APSelectedSubSample && this.props.Login.masterData.APSelectedSubSample.map(sample => sample.ntransactionsamplecode).join(","),
            activeTestTab: this.props.Login.activeTestTab || "IDS_RESULTS",
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEINFO",
            activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
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
            registrationTestHistoryDataState: this.state.registrationTestHistoryDataState,
            ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1,
            // activeTabIndex: this.state.enableAutoClick ? 1 : this.state.activeTabIndex ? this.state.activeTabIndex : undefined,
            activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 1 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 1 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
            nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1

        };
        let breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": obj.breadCrumbFrom
            }, {
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
            }, {
                "label": "IDS_REGSUBTYPE",
                "value": this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.sregsubtypename || "NA" :
                    this.props.Login.masterData.RegSubTypeValue ?
                        this.props.Login.masterData.RegSubTypeValue.sregsubtypename : "NA"
            },
            // {
            //     "label": "IDS_DESIGNTEMPLATE",
            //     "value": this.props.Login.masterData.realDesignTemplateMappingValue ?
            //         this.props.Login.masterData.realDesignTemplateMappingValue.sregtemplatename || "NA" :
            //         this.props.Login.masterData.realDesignTemplateMappingValue ? this.props.Login.masterData.realDesignTemplateMappingValue.sregtemplatename || "NA" : "NA"
            // },
            // {
            //     "label": "IDS_CONFIGVERSION",
            //     "value": this.props.Login.masterData.realApprovalVersionValue ?
            //         this.props.Login.masterData.realApprovalVersionValue.sversionname || "NA" :
            //         this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.sversionname || "NA" : "NA"
            // // },
            // {
            //     "label": "IDS_SECTION",
            //     "value": this.props.Login.masterData.realUserSectionValue ?
            //         this.props.Login.masterData.realUserSectionValue.ssectionname || "NA" :
            //         this.props.Login.masterData.UserSectionValue ?
            //             this.props.Login.masterData.UserSectionValue.ssectionname || "NA" : "NA"
            // },
            {
                "label": "IDS_Test",
                "value": this.props.Login.masterData.realTestValue ?
                    this.props.Login.masterData.realTestValue.stestsynonym || "NA" :
                    this.props.Login.masterData.TestValue ?
                        this.props.Login.masterData.TestValue.stestsynonym || "NA" : "NA"
            },
            {
                "label": "IDS_TESTSTATUS",
                "value": this.props.Login.masterData.realFilterStatusValue ?
                    this.props.Login.masterData.realFilterStatusValue.sfilterstatus || "NA" :
                    this.props.Login.masterData.FilterStatusValue ?
                        this.props.Login.masterData.FilterStatusValue.sfilterstatus || "NA" : "NA"
            }

        ];


        const editResultId =
            this.state.controlMap.has("EditResult") &&
            this.state.controlMap.get("EditResult").ncontrolcode;
        const PatientPreviousResultViewId = this.state.controlMap.has("PatientPreviousResultView") && this.state.controlMap.get("PatientPreviousResultView").ncontrolcode;
        const reportPreviewId = this.state.controlMap.has("SamplePreviewReport") && this.state.controlMap.get("SamplePreviewReport").ncontrolcode;
        const editParamId = this.state.controlMap.has("EditReportMandatory") && this.state.controlMap.get("EditReportMandatory").ncontrolcode;
        const ResultCorrectionId = this.state.controlMap.has("ResultCorrection") && this.state.controlMap.get("ResultCorrection").ncontrolcode;
        const TestDecisionActionId = this.state.controlMap.has("TestDecisionAction") && this.state.controlMap.get("TestDecisionAction").ncontrolcode;
        const TestApprovalActionId = this.state.controlMap.has("TestApprovalAction") && this.state.controlMap.get("TestApprovalAction").ncontrolcode;
        const reportGenerateId = this.state.controlMap.has("GenerateCOA") && this.state.controlMap.get("GenerateCOA").ncontrolcode;
        const coaReportId = this.state.controlMap.has("COAReport") && this.state.controlMap.get("COAReport").ncontrolcode;

        let { testskip, testtake } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : this.props.Login.masterData.AP_TEST || [];
        //const editTestCommentsId = this.state.controlMap.has("EditTestComment") && this.state.controlMap.get("EditTestComment").ncontrolcode;
        testList = testList.slice(testskip, testskip + testtake);
        //let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.APSelectedTest, "ntransactiontestcode");
        // let npreregno = this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",") : "-1";
        //let ntransactiontestcode = this.props.Login.masterData.APSelectedTest ? this.props.Login.masterData.APSelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
       // Ate234 Janakumar ALPD-5123 Test Approval -> To get previously saved filter details when click the filter name
        const filterNameId = this.state.controlMap.has("FilterName") ? this.state.controlMap.get("FilterName").ncontrolcode : -1;
        const filterDetailId = this.state.controlMap.has("FilterDetail") ? this.state.controlMap.get("FilterDetail").ncontrolcode : -1;
        const mandatoryFieldsFilter = [{ "mandatory": true, "idsName": "IDS_FILTERNAME", "dataField": "sfiltername", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]


        this.postParamList = [
            {
                filteredListName: "searchedSample",
                clearFilter: "no",
                searchRef: this.searchSampleRef,
                primaryKeyField: "npreregno",
                fetchUrl: "approval/getApprovalSubSample",
                fecthInputObject: subSampleGetParam,
                selectedObject: "APSelectedSample",
                inputListName: "AP_SAMPLE",
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
                fetchUrl: "approval/getApprovalTest",
                fecthInputObject: testGetParam,
                selectedObject: "APSelectedSubSample",
                childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedTests" }],
                inputListName: "AP_SUBSAMPLE",
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
                selectedObject: "APSelectedTest",
                inputListName: "AP_TEST",
                updatedListname: "updatedTest",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus",
                    "SampletypeList", "RegistrationTypeList", "RegistrationSubTypeList", "FilterStatusList", "UserSectionList", "TestList"]
            }]


        const testDesign = <ContentPanel>
            <Card>
                <Card.Header style={{ borderBottom: "0px" }}>
                    <span style={{ display: "inline-block" }}>
                        <h4 className="card-title">{this.props.intl.formatMessage({ id: "IDS_TEST" })}</h4>
                    </span>
                </Card.Header>
                <Card.Body className='p-0 sm-pager'>
                    <TransactionListMasterJsonView
                        cardHead={94}
                        clickIconGroup={true}
                        // paneHeight={this.state.initialVerticalWidth}
                        needMultiSelect={true}
                        masterList={this.props.Login.masterData.searchedTests || AP_TestList}
                        selectedMaster={this.props.Login.masterData.APSelectedTest || []}
                        primaryKeyField="ntransactiontestcode"
                        //getMasterDetail={this.props.getTestChildTabDetail}
                        getMasterDetail={(event, status) => { this.props.getTestChildTabDetail(event, status); this.state.enableAutoClick && this.changePropertyView(1, "IDS_RESULTS", event, "click") }}
                        inputParam={testChildGetParam}
                        additionalParam={[]}
                        mainField={'stestsynonym'}
                        selectedListName="APSelectedTest"
                        objectName="test"
                        listName="IDS_TEST"
                        pageSize={this.props.Login.settings && this.props.Login.settings[13].split(",").map(setting => parseInt(setting))}
                        showStatusLink={true}
                        statusFieldName="stransdisplaystatus"
                        statusField="ntransactionstatus"
                        showStatusIcon={false}
                        showStatusName={true}
                        subFieldsLabel={true}
                        // jsonField={'jsondata'}
                        //jsonDesignFields={false}
                        selectionField="ntransactionstatus"
                        selectionFieldName="sfilterstatus"
                        selectionColorField="scolorhexcode"
                        selectionList={this.props.Login.masterData.FilterStatus || []}
                        needSubFieldlabel={true}
                        subFields={this.state.testListColumns}
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
                        showMoreResetListName="AP_SAMPLE"
                        handlePageChange={this.handleTestPageChange}
                        buttonCount={5}
                        childTabsKey={
                            [
                                "ApprovalParameter", "ApprovalResultChangeHistory", "ResultUsedInstrument",
                                "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment", "ApprovalHistory", "ResultUsedMaterial",
                                "RegistrationTestHistory"
                            ]
                        }
                        commonActions={

                            <ProductList className="d-flex justify-content-end icon-group-wrap">

                                <Nav.Link
                                    hidden={this.state.userRoleControlRights.indexOf(ResultCorrectionId) === -1}
                                    data-tip={this.props.intl.formatMessage({ id: "IDS_RESULTCORRECTION" })}
                                    //  data-for="tooltip-common-wrap"
                                    data-place="left"
                                    className="btn btn-circle outline-grey"
                                    onClick={() => this.props.getTestResultCorrection({ APSelectedTest: this.props.Login.masterData.APSelectedTest, userInfo: this.props.Login.userInfo, masterData: this.props.Login.masterData })}
                                >
                                    {/* <FontAwesomeIcon icon={faPencilAlt} /> */}
                                    <ResultCorrection className="custom_icons" width="20" height="20" />
                                </Nav.Link>
                                <Nav.Link
                                    hidden={this.state.userRoleControlRights.indexOf(editParamId) === -1}
                                    data-tip={this.props.intl.formatMessage({ id: "IDS_EDITREPORTMANDATORY" })}
                                    //  data-for="tooltip-common-wrap"
                                    data-place="left"
                                    className="btn btn-circle outline-grey"
                                    onClick={() => this.props.getParameterEdit({ APSelectedTest: this.props.Login.masterData.APSelectedTest, userInfo: this.props.Login.userInfo, masterData: this.props.Login.masterData })}
                                >
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </Nav.Link>

                                {this.props.Login.masterData.actionStatus &&
                                    this.state.userRoleControlRights.indexOf(TestApprovalActionId) !== -1 &&
                                    actionStatus.length > 0 ?
                                    <CustomPopOver
                                        icon={faPalette}
                                        nav={true}
                                        data={actionStatus}
                                        btnClasses="btn-circle btn_grey ml-2"
                                        dynamicButton={(value) => this.checkRetestAction(value, TestApprovalActionId)}
                                        textKey="stransdisplaystatus"
                                        iconKey="ntransactionstatus"
                                    >
                                    </CustomPopOver>
                                    : ""}
                            </ProductList>
                        }


                    // actionIcons={
                    //     [
                    //        { title: this.props.intl.formatMessage({ id: "IDS_PREVIOUSRESULTVIEW" }),  controlname: "faEye", hidden:this.state.userRoleControlRights.indexOf(PatientPreviousResultViewId) === -1, onClick: this.viewSample, objectName: "test", inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,elnUserInfo: this.props.Login.elnUserInfo,elnSite: this.props.Login.elnSite} },
                    //     ]}
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
                // onSecondaryPaneSizeChange={this.paneSizeChange}
                primaryMinSize={40}
                secondaryMinSize={30}
            >
                <Card>
                    <Card.Header style={{ borderBottom: "0px" }}>
                        <span style={{ display: "inline-block", marginTop: "1%" }}>
                            <h4 className="card-title">{this.props.intl.formatMessage({ id: "IDS_SUBSAMPLE" })}</h4>
                        </span>
                    </Card.Header>
                    <Card.Body className='p-0  sm-pager'>
                        <TransactionListMasterJsonView
                            //clickIconGroup={true}
                            cardHead={94}
                            //paneHeight={this.state.initialVerticalWidth}
                            masterList={this.props.Login.masterData.searchedSubSample || AP_SubSampleList}
                            selectedMaster={this.props.Login.masterData.APSelectedSubSample}
                            primaryKeyField="ntransactionsamplecode"
                            getMasterDetail={this.props.getTestDetail}
                            inputParam={testGetParam}
                            additionalParam={[]}
                            mainField="ssamplearno"
                            selectedListName="APSelectedSubSample"
                            objectName="subSample"
                            listName="IDS_SUBSAMPLE"
                            showStatusLink={true}
                            showStatusName={false}
                            statusFieldName="stransdisplaystatus"
                            statusField="ntransactionstatus"
                            selectionList={this.state.selectedFilter}
                            selectionField="ntransactionstatus"
                            selectionFieldName="sfilterstatus"
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
                            pageSize={this.props.Login.settings && this.props.Login.settings[13].split(",").map(setting => parseInt(setting))}
                            childTabsKey={["RegistrationTestAttachment", "RegistrationTestComment", "AP_TEST", "ApprovalParameter", "Registration", "RegistrationSampleComment", "RegistrationSampleAttachment", "ResultUsedMaterial"]}
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
                       {/* // Ate234 Janakumar ALPD-5123 Test Approval -> To get previously saved filter details when click the filter name */}
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

                    <Row noGutters={"true"} bsPrefix="toolbar-top">
                        {/* sticky_head_parent' ref={(parentHeight) => { this.parentHeight = parentHeight }} */}
                        <Col md={12} className='parent-port-height' >
                            <ListWrapper className={`vertical-tab-top ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                <div className={` tab-left-area ${this.state.activeTabIndex ? 'active' : ""} ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                    <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1}
                                        secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                        //onSecondaryPaneSizeChange={this.paneSizeChange} 
                                        primaryMinSize={40} secondaryMinSize={20}>
                                        <div className='toolbar-top-inner'>
                                            <TransactionListMasterJsonView
                                                clickIconGroup={true}
                                                splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                                needMultiSelect={true}
                                                masterList={this.props.Login.masterData.searchedSample || AP_SampleList}
                                                selectedMaster={this.props.Login.masterData.APSelectedSample}
                                                primaryKeyField="npreregno"
                                                getMasterDetail={this.props.getsubSampleDetail}
                                                inputParam={subSampleGetParam}
                                                additionalParam={['napprovalversioncode']}
                                                mainField={'sarno'}
                                                selectionList={this.state.selectedFilter}
                                                selectionField="ntransactionstatus"
                                                selectionFieldName="sfilterstatus"
                                                selectionColorField="stranscolor"
                                                selectedListName="APSelectedSample"
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
                                                //ALPD-5316 Test Approval -> Decision Status there have based on sample type. by rukshana
                                                //statusColor="stranscolor"
                                                // decisionFieldName="sdecisionstatus"
                                                // decisionField="ndecisionstatus"
                                                //secondaryField="sdecisionstatus"
                                                secondaryField={this.props.Login.masterData.decisionStatus && this.props.Login.masterData.decisionStatus.length > 0  ? "sdecisionstatus":undefined}
                                                secondaryFieldname="ndecisionstatus"
                                                showStatusIcon={false}
                                                showStatusName={true}
                                                needFilter={true}
                                                needMultiValueFilter={true}
                                                clearAllFilter={this.onReload}
                                                onMultiFilterClick={this.onMultiFilterClick}
                                                searchRef={this.searchSampleRef}
                                                filterParam={filterSampleParam}
                                                skip={this.state.skip}
                                                take={this.state.take}
                                                handlePageChange={this.handlePageChange}
                                                showStatusBlink={true}
                                                callCloseFunction={true}
                                                listMasterShowIcon={0}
                                                //splitModeClass={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50 ? 'split-mode' : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}
                                                childTabsKey={["AP_SUBSAMPLE", "AP_TEST", "ApprovalParameter", "SampleApprovalHistory", "RegistrationAttachment", "PrintHistory", "COAHistory", "RegistrationComment", "ResultUsedTasks", "ResultUsedMaterial",
                                                    "RegistrationSampleComment", "RegistrationSampleAttachment", "RegistrationTestAttachment", "RegistrationTestComment"]}
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

                                                                }, { title: this.props.intl.formatMessage({ id: "IDS_PREVIOUSRESULTVIEW" }), controlname: "faEye", hidden: this.state.userRoleControlRights.indexOf(PatientPreviousResultViewId) === -1, onClick: this.viewSample, objectName: "test", inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo, elnUserInfo: this.props.Login.elnUserInfo, elnSite: this.props.Login.elnSite } },

                                                    ]
                                                }

                                                commonActions={
                                                    <>
                                                        <ProductList className="d-flex product-category float-right">
                                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                                onClick={() => this.onReload()}
                                                                // data-for="tooltip-common-wrap"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                                <RefreshIcon className='custom_icons' />
                                                            </Button>
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
                                                        "Sample Filter": <ApprovalFilter
                                                            SampleType={this.state.SampletypeList || []}
                                                            SampleTypeValue={this.props.Login.masterData.SampleTypeValue || []}
                                                            RegType={this.state.RegistrationTypeList || []}
                                                            RegTypeValue={this.props.Login.masterData.RegTypeValue || []}
                                                            RegSubType={this.state.RegistrationSubTypeList || []}
                                                            RegSubTypeValue={this.props.Login.masterData.RegSubTypeValue || []}
                                                            ApprovalVersion={this.state.ConfigVersionList || []}
                                                            ApprovalVersionValue={this.props.Login.masterData.ApprovalVersionValue || []}
                                                            UserSection={this.state.UserSectionList || []}
                                                            UserSectionValue={this.props.Login.masterData.UserSectionValue || []}
                                                            JobStatus={this.props.Login.masterData.JobStatus || []}
                                                            Test={this.state.TestList || []}
                                                            TestValue={this.props.Login.masterData.TestValue || []}
                                                            Batch={this.state.Batchvalues || []}
                                                            BatchValue={this.props.Login.masterData.defaultBatchvalue || []}
                                                            FilterStatus={this.state.FilterStatusList || []}
                                                            FilterStatusValue={this.props.Login.masterData.FilterStatusValue || []}
                                                            fromDate={this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()}
                                                            toDate={this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()}
                                                            onFilterComboChange={this.onFilterComboChange}
                                                            handleDateChange={this.handleDateChange}
                                                            onDesignTemplateChange={this.onDesignTemplateChange}
                                                            DynamicDesignMapping={this.state.stateDynamicDesign || []}
                                                            DesignTemplateMapping={this.props.Login.masterData.DesignTemplateMapping}
                                                            DesignTemplateMappingValue={this.props.Login.masterData.DesignTemplateMappingValue || {}}
                                                            userInfo={this.props.Login.userInfo}

                                                        />
                                                    }
                                                ]}

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
                                        <div className={` vertical-tab-content-results position-relative sm-view-v-t  ${this.state.activeTabIndex && this.state.activeTabIndex == 1 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 1 ? this.sideNavDetail("IDS_RESULTS") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-attachment position-relative ${this.state.activeTabIndex && this.state.activeTabIndex == 2 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 2 ? this.sideNavDetail("IDS_ATTACHMENTS") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-comments position-relative vertical-tab-content-common ${this.state.activeTabIndex && this.state.activeTabIndex == 3 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 3 ? this.sideNavDetail("IDS_COMMENTS") : ""}
                                        </div>
                                        {/* <div className={` vertical-tab-content-comments  ${this.state.activeTabIndex && this.state.activeTabIndex == 4 ? 'active' : ""}`}>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_INSTRUMENT" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex == 4 ? this.sideNavDetail("IDS_INSTRUMENT") : ""}
                                        </div> */}
                                        <div className={` vertical-tab-content-comments position-relative vertical-tab-content-common ${this.state.activeTabIndex && this.state.activeTabIndex == 5 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_MATERIAL" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 5 ? this.sideNavDetail("IDS_MATERIAL") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-comments position-relative vertical-tab-content-common ${this.state.activeTabIndex && this.state.activeTabIndex == 6 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_TASK" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 6 ? this.sideNavDetail("IDS_TASK") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-comments position-relative vertical-tab-content-common ${this.state.activeTabIndex && this.state.activeTabIndex == 7 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_TESTAPPROVALHISTORY" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 7 ? this.sideNavDetail("IDS_TESTAPPROVALHISTORY") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-comments position-relative vertical-tab-content-common ${this.state.activeTabIndex && this.state.activeTabIndex == 8 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            <h4 className='inner_h4'>
                                                {this.props.intl.formatMessage({ id: "IDS_SAMPLEDETAILS" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 8 ? this.sideNavDetail("IDS_SAMPLEDETAILS") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-comments position-relative vertical-tab-content-common ${this.state.activeTabIndex && this.state.activeTabIndex == 9 ? 'active' : ""}`}>
                                            <Nav.Link className='tab-expand-collapse-btn p-0' onClick={() => this.setState({ enablePropertyPopup: !this.state.enablePropertyPopup })}>
                                                {!this.state.enablePropertyPopup ?
                                                    <img src={fullviewExpand} alt="Fullview" width="20" height="20" /> :
                                                    <img src={fullviewCollapse} alt="Collapse" width="24" height="24" />
                                                }
                                            </Nav.Link>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 9 ? this.sideNavDetail("IDS_HISTORY") : ""}
                                        </div>
                                    </div>
                                    <div className='tab-head'>

                                        <ul>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 1 ? 'active' : ""}`} onClick={() => this.changePropertyView(1, "IDS_RESULTS")}>
                                                <FontAwesomeIcon icon={faFileInvoice}
                                                    //  data-for="tooltip-common-wrap"
                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_RESULTS" })} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_RESULTS" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 2 ? 'active' : ""}`} onClick={() => this.changePropertyView(2, "IDS_ATTACHMENTS")}>
                                                <FontAwesomeIcon icon={faLink} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_ATTACHMENTS" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 3 ? 'active' : ""}`} onClick={() => this.changePropertyView(3, "IDS_COMMENTS")}>
                                                <FontAwesomeIcon icon={faComments} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                                                </span>
                                            </li>
                                            {/* <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 4 ? 'active' : ""}`} onClick={() => this.changePropertyView(4,"IDS_INSTRUMENT")}>
                                                <FontAwesomeIcon icon={faMicroscope} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_INSTRUMENT" })}
                                                </span>
                                            </li> */}
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 5 ? 'active' : ""}`} onClick={() => this.changePropertyView(5, "IDS_MATERIAL")}>
                                                <FontAwesomeIcon icon={faFlask} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_MATERIAL" })}
                                                </span>
                                            </li>

                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 6 ? 'active' : ""}`} onClick={() => this.changePropertyView(6, "IDS_TASK")}>
                                                <FontAwesomeIcon icon={faCommentDots} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_TASK" })}
                                                </span>
                                            </li>
                                            {/* <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 7 ? 'active' : ""}`} onClick={() => this.changePropertyView(7)}>
                                                <FontAwesomeIcon icon={faHistory} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_TESTAPPROVALHISTORY" })}
                                                </span>
                                            </li> */}
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 8 ? 'active' : ""}`} onClick={() => this.changePropertyView(8, "IDS_SAMPLEDETAILS")}>
                                                <FontAwesomeIcon icon={faEye} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_SAMPLEDETAILS" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 9 ? 'active' : ""}`} onClick={() => this.changePropertyView(9, "IDS_HISTORY")}>
                                                <FontAwesomeIcon icon={faHistory} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_HISTORY" })}
                                                </span>
                                            </li>
                                        </ul>
                                        <span className='tab-click-toggle-btn'>
                                            <CustomSwitch
                                                //label={"IDS_AUTOSHOW"}
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
                                                //label={"IDS_POPUPNAV"}
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
                        </Col>
                    </Row>
                </ListWrapper>
                {this.props.Login.openChildModal ?
                    <SlideOutModal
                        onSaveClick={this.props.Login.operation === 'dynamic' ? () => this.performTestActions(this.props.Login.action, TestApprovalActionId) : this.props.Login.multiFilterLoad ? this.onSaveMultiFilterClick : this.onSaveClick}
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
                        //mandatoryFields={this.props.Login.operation === 'enforce' 
                        //  ? [{ "idsName": "IDS_COMMENTS", "dataField": "senforcestatuscomment", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }] : []}
                        mandatoryFields={mandatoryValidation}
                        loginoperation={this.props.Login.operation === 'view' ? true : false}
                        //graphView={this.props.Login.operation !=='enforce' ? this.props.Login.operation:undefined}
                        noSave={this.props.Login.operation === 'view' ? true : false}
                        hideSave={this.props.Login.screenName === "IDS_PREVIOUSRESULTVIEW" || this.props.Login.screenName === "IDS_RESULTCORRECTION" ? true : false}
                        size={this.props.Login.screenName === "IDS_PREVIOUSRESULTVIEW" || this.props.Login.screenName === "IDS_RESULTCORRECTION" ? "xl" : "lg"}
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
                                                <Row>
                                                    <Col md={12}>

                                                        {<CustomTab tabDetail={this.tabDetailResultView()} onTabChange={this.onTabChangeResultView} />}
                                                    </Col>
                                                </Row>
                                                {/* <DataGrid
                                            primaryKeyField={"ntransactiontestcode"}
                                            data={this.props.Login.masterData.AuditModifiedComments || []}
                                            //data={this.props.Login.addComponentDataList || []}
                                            detailedFieldList={this.feildsForGrid}
                                            extractedColumnList={this.feildsForGrid}
                                            // dataResult={this.props.Login.masterData.AuditModifiedComments && this.props.Login.masterData.AuditModifiedComments.length > 0
                                            //   && process(this.props.Login.masterData.AuditModifiedComments, { skip: 0, take: 10 })}
                                            // dataState={{ skip: 0, take: 10 }}
                                            dataResult={this.props.Login.masterData.AuditModifiedComments && this.props.Login.masterData.AuditModifiedComments.length > 0
                                                && process(this.props.Login.masterData.AuditModifiedComments, this.state.dataState ? this.state.dataState : { skip: 0, take: 10 })}
                                              //dataState={{ skip: 0, take: 10 }}
                                              dataState={this.state.dataState
                                                ? this.state.dataState : { skip: 0, take: 10 }}
                                            pageable={true}
                                            scrollable={'scrollable'}
                                            dataStateChange={this.dataStateChange}
                  
                                          /> */}
                                            </>
                                        )
                                        :


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
                                                                { "idsName": this.props.Login.idsName, "dataField": this.props.Login.dataField, "width": "450px" }
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

                                            : this.props.Login.screenName === 'IDS_RESULTCORRECTION' ?

                                                <DataGrid
                                                    primaryKeyField={"ntransactionresultcode"}
                                                    selectedId={this.props.Login.selectedId}
                                                    data={this.props.Login.masterData.ResultCorrection}
                                                    dataResult={process(this.props.Login.masterData.ResultCorrection && this.props.Login.masterData.ResultCorrection || [], this.state.resultCorrectionDataState)}
                                                    dataState={this.state.resultCorrectionDataState}
                                                    dataStateChange={this.resultCorrectionDataStateChange}
                                                    extractedColumnList={resultCorrectionColumnList}
                                                    controlMap={this.state.controlMap}
                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                    inputParam={this.props.Login.inputParam}
                                                    methodUrl={"Result"}
                                                    userInfo={this.props.Login.userInfo}
                                                    fetchRecord={this.props.fetchParameterDetails}
                                                    deleteRecord={this.deleteRecord}
                                                    //  reloadData={this.reloadData}
                                                    //  addRecord={() => this.props.openProductCategoryModal("IDS_PRODUCTCATEGORY", addId,this.props.Login.settings)}
                                                    editParam={
                                                        {
                                                            screenName: this.props.Login.screenName, primaryKeyField: "ntransactionresultcode", operation: "update",
                                                            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editResultId, masterData: this.props.Login.masterData
                                                        }}
                                                    //  deleteParam={deleteParam}
                                                    scrollable={'scrollable'}
                                                    gridHeight={'600px'}
                                                    isActionRequired={true}
                                                    //  isToolBarRequired={true}
                                                    pageable={true}
                                                />
                                                // ALPD-4133 Start  of Addition Filter Component Render - ATE-241
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
                                                    />
                                                    //  End of Additional filter component render ALPD-4133 ATE-241

                                                    :
                                                    <EditApprovalParameter
                                                        ApprovalParamEdit={this.props.Login.ApprovalParamEdit || []}
                                                        changeMandatory={this.changeMandatory}
                                                        selectedRecord={this.state.selectedRecord.approvalParameterEdit || {}}
                                                        nsubsampleneed={this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nsubsampleneed}
                                                    />


                        }


                    />
                    : ""}

                {this.props.Login.modalShow ? (
                    <ModalShow
                        modalShow={this.props.Login.modalShow}
                        closeModal={this.closeModalShow}
                        onSaveClick={this.onSaveModalResultClickSeparate}
                        //onSaveClick={this.onSaveModalFilterName}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        //ATE234 Janakumar ALPD-5589Test approval---> When using the save filter button, 500 occurs in Specific scenario
                        mandatoryFields={this.props.Login && this.props.Login.isFilterDetail ?mandatoryFieldsFilter:""}
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
                                /> : this.props.Login && this.props.Login.isFilterDetail ?
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
                                    </Col> :
                                    this.state.selectedRecord.ReleaseParameter &&
                                    this.state.selectedRecord.ReleaseParameter.map((parameterResult, index) => {
                                        return <ResultEntryForm
                                            index={index}

                                            ResultParameter={[...this.state.selectedRecord.ReleaseParameter]}
                                            predefinedValues={this.props.Login.masterData.PredefinedValues}
                                            defaultPredefinedValues={this.props.Login.masterData.PredefinedValues}
                                            gradeValues={this.props.Login.masterData.GradeValues || []}
                                            selectedNumericData={this.props.Login.masterData.selectedNumericData}
                                            selectedResultGrade={this.state.selectedRecord.selectedResultGrade || []}
                                            paremterResultcode={this.props.Login.masterData.paremterResultcode || []}
                                            parameterResults={parameterResult
                                                || []}
                                            Login={this.props.Login}
                                            handleClose={this.handleClose}
                                            onSaveClick={this.onSaveClick}
                                            onResultInputChange={this.onResultInputChange}
                                            //onGradeEvent={this.onGradeEvent}
                                            getFormula={this.getFormula}
                                            onDropTestFile={this.onDropTestFile}
                                            onKeyPress={this.onKeyPress}
                                            //deleteAttachmentParamFile={this.deleteAttachmentParameterFile}
                                            viewAdditionalInfo={this.viewAdditionalInfo}
                                            needSubSample={this.props.Login.masterData.realRegSubTypeValue.nneedsubsample}
                                            needdelete={true}
                                            needmandatory={true}
                                            ResultAccuracy={this.props.Login.masterData.ResultAccuracy || []}
                                            Unit={this.props.Login.masterData.Unit || []}
                                            formFields={this.props.Login.masterData.formFields || []}
                                        //intl={this.props.intl}
                                        />
                                    })
                        }
                    />
                ) : (
                    ""
                )}
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
    closeFilter = () => {
        let inputValues = {
            SampleTypeValue: this.props.Login.masterData.realSampleTypeValue || {},
            RegTypeValue: this.props.Login.masterData.realRegTypeValue || {},
            RegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue || {},
            ApprovalVersionValue: this.props.Login.masterData.realApprovalVersionValue || {},
            UserSectionValue: this.props.Login.masterData.realUserSectionValue || {},
            TestValue: this.props.Login.masterData.realTestValue || {},
            BatchValue: this.props.Login.masterData.realBatchvalue || {},
            defaultBatchvalue: this.props.Login.masterData.realBatchvalue || {},
            FilterStatusValue: this.props.Login.masterData.realFilterStatusValue || {},
            fromDate: this.props.Login.masterData.realFromDate || new Date(), //this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date(),
            toDate: this.props.Login.masterData.realToDate || new Date(),//this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date(),
            DesignTemplateMappingValue: this.props.Login.masterData.realDesignTemplateMappingValue || {},
            SampleType: this.props.Login.masterData.realSampleTypeList || [],
            RegType: this.props.Login.masterData.realRegTypeList || [],
            RegSubType: this.props.Login.masterData.realRegSubTypeList || [],
            FilterStatus: this.props.Login.masterData.realFilterStatusList || [],
            ApprovalVersion: this.props.Login.masterData.realApprovalVersionList || [],
            UserSection: this.props.Login.masterData.realUserSectionList || [],
            Test: this.props.Login.masterData.realTestList || [],
            Batchvalues: this.props.Login.masterData.realBatchvaluesList || [],
            DesignTemplateMapping: this.props.Login.masterData.realDesignTemplateMappingList || [],

        }
        // JobStatus={this.props.Login.masterData.JobStatus || []}
        // DynamicDesignMapping={this.state.stateDynamicDesign || []}
        // DesignTemplateMapping={this.props.Login.masterData.DesignTemplateMapping}
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false, masterData: { ...this.props.Login.masterData, ...inputValues } }
        }
        this.props.updateStore(updateInfo);

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
    componentDidUpdate(previousProps) {
        let { userRoleControlRights, controlMap,
            sampleListColumns, subSampleListColumns, testListColumns, SingleItem,
            sampleListMainField, subSampleListMainField, testListMainField,
            SampleGridItem, SampleGridExpandableItem, testMoreField,
            resultDataState, instrumentDataState,
            materialDataState, taskDataState,
            documentDataState, resultChangeDataState,
            historyDataState, testCommentDataState,
            samplePrintHistoryDataState, sampleHistoryDataState, registrationTestHistoryDataState,
            selectedRecord, SampletypeList, RegistrationTypeList,
            RegistrationSubTypeList, FilterStatusList,
            ConfigVersionList, UserSectionList, TestList, skip, take, testskip, testtake, selectedFilter,
            DynamicSampleColumns, DynamicSubSampleColumns, DynamicTestColumns, DynamicGridItem,
            DynamicGridMoreField, stateDynamicDesign, sampleSearchField, subsampleSearchField, testSearchField,
            activeTabIndex, activeTabId, Batchvalues, subSampleSkip, subSampleTake, samplefilteritem, sampledisplayfields } = this.state;

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
                let dataState = {
                    skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: `${this.props.Login.masterData.RegSubTypeValue.nsubsampleneed ? 'ssamplearno' : 'sarno'}` }] 
                }
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
            const RegistrationTypeListMap = constructOptionList(this.props.Login.masterData.RegType || [], "nregtypecode", "sregtypename", "nsorter", 'ascending', 'nregtypecode', false);
            const RegistrationSubTypeListMap = constructOptionList(this.props.Login.masterData.RegSubType || [], "nregsubtypecode", "sregsubtypename", "nsorter", 'ascending', 'nregsubtypecode', false);
            const FilterStatusListMap = constructOptionList(this.props.Login.masterData.FilterStatus || [], "ntransactionstatus", "sfilterstatus", undefined, undefined, true);
            const ConfigVersionListMap = constructOptionList(this.props.Login.masterData.ApprovalVersion || [], "napprovalconfigversioncode", "sversionname", 'descending', 'ntransactionstatus', false);
            const UserSectionListMap = constructOptionList(this.props.Login.masterData.UserSection || [], "nsectioncode", "ssectionname", undefined, undefined, true);
            const TestListMap = constructOptionList(this.props.Login.masterData.Test || [], "ntestcode", "stestsynonym", undefined, undefined, true);
            Batchvalues = constructOptionList(this.props.Login.masterData.Batchvalues || [], 'nbatchmastercode', 'sbatcharno', 'ascending', 'nbatchmastercode', false);
            SampletypeList = SampletypeListMap.get("OptionList");
            RegistrationTypeList = RegistrationTypeListMap.get("OptionList");
            RegistrationSubTypeList = RegistrationSubTypeListMap.get("OptionList");
            FilterStatusList = FilterStatusListMap.get("OptionList");
            ConfigVersionList = ConfigVersionListMap.get("OptionList");
            UserSectionList = UserSectionListMap.get("OptionList");
            TestList = TestListMap.get("OptionList");
            Batchvalues = Batchvalues.get("OptionList");
            bool = true;
            skip = this.props.Login.skip === undefined ? skip : this.props.Login.skip
            take = this.props.Login.take || take
            testskip = this.props.Login.testskip === undefined ? testskip : this.props.Login.testskip
            testtake = this.props.Login.testtake || testtake
            subSampleSkip = this.props.Login.subSampleSkip === undefined ? subSampleSkip : this.props.Login.subSampleSkip
            subSampleTake = this.props.Login.subSampleTake || subSampleTake
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
            if (this.props.Login.sampleHistoryDataState && this.props.Login.sampleHistoryDataState !== previousProps.Login.sampleHistoryDataState) {
                sampleHistoryDataState = this.props.Login.sampleHistoryDataState;
            }
            if (this.props.Login.registrationTestHistoryDataState && this.props.Login.registrationTestHistoryDataState !== previousProps.Login.registrationTestHistoryDataState) {
                registrationTestHistoryDataState = this.props.Login.registrationTestHistoryDataState;
            }
        }

        if (this.props.Login.activeTabIndex !== previousProps.Login.activeTabIndex) {
            activeTabIndex = this.props.Login.activeTabIndex;
            activeTabId = this.props.Login.activeTabId;
            bool = true;
        }

        if (this.props.Login.availableReleaseRecord === true) {
            this.confirmMessage.confirm("deleteMessage",
                this.props.intl.formatMessage({ id: "IDS_TESTADDEDINRELEASE" }),
                this.props.intl.formatMessage({ id: "IDS_AREUSURETORETESTORCALC" }),
                this.props.intl.formatMessage({ id: "IDS_OK" }),
                this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                () => this.checkRetestAction(this.props.Login.action,
                    this.props.Login.ncontrolCode),
                undefined, () => this.closeAlert());
        }
        if (this.props.Login.availableReleaseRecord === false) {
            this.checkRetestAction(this.props.Login.action,
                this.props.Login.ncontrolCode)
        }
        if (this.props.Login.masterData.DynamicDesign && this.props.Login.masterData.DynamicDesign !== previousProps.Login.masterData.DynamicDesign) {
            const dynamicColumn = JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata.value)
            DynamicSampleColumns = dynamicColumn.samplelistitem ? dynamicColumn.samplelistitem : [];
            DynamicSubSampleColumns = dynamicColumn.subsamplelistitem ? dynamicColumn.subsamplelistitem : [];
            DynamicTestColumns = dynamicColumn.testlistitem ? dynamicColumn.testlistitem : []

            DynamicGridItem = dynamicColumn.samplegriditem ? dynamicColumn.samplegriditem : [];
            DynamicGridMoreField = dynamicColumn.samplegridmoreitem ? dynamicColumn.samplegridmoreitem : [];
            sampleSearchField = dynamicColumn.samplesearchfields ? dynamicColumn.samplesearchfields : [];
            subsampleSearchField = dynamicColumn.subsamplesearchfields ? dynamicColumn.subsamplesearchfields : [];
            SingleItem = dynamicColumn.sampledisplayfields ? dynamicColumn.sampledisplayfields : [];
            testMoreField = dynamicColumn.testListFields.testlistmoreitems ? dynamicColumn.testListFields.testlistmoreitems : [];
            testListColumns = dynamicColumn.testListFields.testlistitem ? dynamicColumn.testListFields.testlistitem : [];
            testSearchField = dynamicColumn.testListFields.testsearchfields ? dynamicColumn.testListFields.testsearchfields : [];
            samplefilteritem = dynamicColumn.samplefilteritem || [];
            sampledisplayfields = dynamicColumn.sampledisplayfields || [];

            this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample &&
                DynamicSubSampleColumns.push({
                    1: { 'en-US': 'Specimen', 'ru-RU': 'Образец', 'tg-TG': 'Намуна' },
                    2: "scomponentname"
                });

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
        if (this.props.Login.masterData.DesignTemplateMapping !== previousProps.Login.masterData.DesignTemplateMapping) {

            const DesignTemplateMappingMap = constructOptionList(this.props.Login.masterData.DesignTemplateMapping || [], "ndesigntemplatemappingcode",
                "sregtemplatename", undefined, undefined, false);

            stateDynamicDesign = DesignTemplateMappingMap.get("OptionList")
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
                samplePrintHistoryDataState, sampleHistoryDataState, registrationTestHistoryDataState,
                selectedRecord, SampletypeList, RegistrationTypeList,
                RegistrationSubTypeList, FilterStatusList,
                ConfigVersionList, UserSectionList, TestList,
                skip, take, testskip, testtake, selectedFilter,
                DynamicSampleColumns, DynamicSubSampleColumns,
                DynamicTestColumns, DynamicGridItem,
                DynamicGridMoreField, stateDynamicDesign,
                sampleSearchField, subsampleSearchField, testSearchField,
                activeTabIndex, activeTabId, Batchvalues, subSampleSkip, subSampleTake, samplefilteritem, sampledisplayfields,
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
        let npreregno = this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",") : "-1";
        tabMap.set("IDS_SAMPLEATTACHMENTS",
            <Attachments
                screenName="IDS_SAMPLEATTACHMENTS"
                selectedMaster={this.props.Login.masterData.APSelectedSample}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                attachments={this.props.Login.masterData.RegistrationAttachment || []}
                deleteRecord={this.props.deleteAttachment}
                onSaveClick={this.onAttachmentSaveClick}
                masterList={this.props.Login.masterData.APSelectedSample}
                masterAlertStatus={"IDS_SELECTSAMPLETOADDATTACHEMENT"}
                nsubsampleneed={this.props.Login.masterData.nneedsubsample}
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
                    masterList: this.props.Login.masterData.APSelectedSample

                }}
                selectedListName="IDS_ARNUMBER"
                displayName="sarno"
                isneedHeader={true}
            />)
        tabMap.set("IDS_SAMPLECOMMENTS", <Comments
            screenName="IDS_SAMPLECOMMENTS"
            onSaveClick={this.onCommentsSaveClick}
            selectedMaster="APSelectedSample"
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            Comments={this.props.Login.masterData.RegistrationComment || []}
            fetchRecord={this.props.getCommentsCombo}
            addName={"AddSampleComment"}
            editName={"EditSampleComment"}
            deleteName={"DeleteSampleComment"}
            methodUrl={"SampleComment"}
            isTestComment={false}
            masterData={this.props.Login.masterData}
            masterList={this.props.Login.masterData.APSelectedSample}
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
                masterList: this.props.Login.masterData.APSelectedSample || [],
                ncontrolCode: this.state.controlMap.has("EditSampleComment") && this.state.controlMap.get("EditSampleComment").ncontrolcode
            }}
            selectedListName="IDS_ARNUMBER"
            displayName="sarno"
            selectedId={this.props.Login.selectedId || null}
        />)

        tabMap.set("IDS_SAMPLEAPPROVALHISTORY",
            <SampleApprovalHistory
                userInfo={this.props.Login.userInfo}
                genericLabel={this.props.Login.genericLabel}
                ApprovalHistory={this.props.Login.masterData.SampleApprovalHistory}
                inputParam={this.props.Login.inputParam}
                dataState={this.state.sampleHistoryDataState}
                dataStateChange={this.sampleDataStateChange}
                screenName="IDS_SAMPLEAPPROVALHISTORY"
                controlMap={this.state.controlMap}
                masterData={this.props.Login.masterData}
                userRoleControlRights={this.state.userRoleControlRights}
                selectedId={null}
            />)

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
        // if (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode === RegistrationSubType.ROUTINE) {
        //     tabMap.set("IDS_REPORTHISTORY",
        //         <ReportHistoryTab
        //             userInfo={this.props.Login.userInfo}
        //             COAHistory={this.props.Login.masterData.COAHistory}
        //             inputParam={this.props.Login.inputParam}
        //             dataState={this.state.reportHistoryDataState}
        //             dataStateChange={this.sampleDataStateChange}
        //             screenName="IDS_REPORTHISTORY"
        //             controlMap={this.state.controlMap}
        //             userRoleControlRights={this.state.userRoleControlRights}
        //             selectedId={null}
        //             viewDownloadFile={this.downloadReport}
        //         />);
        // }
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

    subsampleTabDetail = () => {
        let ntransactionsamplecode = this.props.Login.masterData.APSelectedSubSample ?
            this.props.Login.masterData.APSelectedSubSample.map(sample => sample.ntransactionsamplecode).join(",") : "-1";
        const tabMap = new Map();
        let subsampleList = this.props.Login.masterData.AP_SUBSAMPLE || [];
        let { subSampleSkip, subSampleTake } = this.state
        subsampleList = subsampleList.slice(subSampleSkip, subSampleSkip + subSampleTake);
        //let selectedSubSampleList = getSameRecordFromTwoArrays(subsampleList, this.props.Login.masterData.APSelectedSubSample, "ntransactionsamplecode");

        tabMap.set("IDS_SUBSAMPLEATTACHMENTS", <Attachments
            screenName="IDS_SUBSAMPLEATTACHMENTS"
            onSaveClick={this.onAttachmentSaveClick}
            selectedMaster="APSelectedSubSample"
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            attachments={this.props.Login.masterData.RegistrationSampleAttachment || []}
            deleteRecord={this.props.deleteAttachment}
            masterList={this.props.Login.masterData.APSelectedSubSample}
            masterAlertStatus={"IDS_SELECTSUBSAMPLETOADDATTACHMENT"}
            fetchRecord={this.props.getAttachmentCombo}
            viewFile={this.props.viewAttachment}
            addName={"AddSubSampleAttachment"}
            editName={"EditSubSampleAttachment"}
            deleteName={"DeleteSubSampleAttachment"}
            viewName={"ViewSubSampleAttachment"}
            methodUrl={"SubSampleAttachment"}
            nsubsampleneed={this.props.Login.masterData.nneedsubsample}
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
                masterList: this.props.Login.masterData.AP_SUBSAMPLE || []

            }}
            selectedListName="IDS_SAMPLEARNO"
            displayName="ssamplearno"
        />)
        tabMap.set("IDS_SUBSAMPLECOMMENTS", <Comments
            screenName="IDS_SUBSAMPLECOMMENTS"
            onSaveClick={this.onCommentsSaveClick}
            selectedMaster="APSelectedSubSample"
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            Comments={this.props.Login.masterData.RegistrationSampleComment || []}
            fetchRecord={this.props.getCommentsCombo}
            addName={"AddSubSampleComment"}
            editName={"EditSubSampleComment"}
            deleteName={"DeleteSubSampleComment"}
            methodUrl={"SubSampleComment"}
            isTestComment={false}
            masterList={this.props.Login.masterData.APSelectedSubSample}
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
                masterList: this.props.Login.masterData.AP_SUBSAMPLE || [],
                ncontrolCode: this.state.controlMap.has("EditSubSampleComment") && this.state.controlMap.get("EditSubSampleComment").ncontrolcode
            }}
            selectedListName="IDS_SAMPLEARNO"
            displayName="ssamplearno"
            selectedId={this.props.Login.selectedId || null}
        />)

        return tabMap;
    }

    resultTabDetail = () => {
        const resultTabMap = new Map();
        let { testskip, testtake } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : this.props.Login.masterData.AP_TEST || [];
        // const editTestCommentsId = this.state.controlMap.has("EditTestComment") && this.state.controlMap.get("EditTestComment").ncontrolcode;
        testList = testList.slice(testskip, testskip + testtake);
        // let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.APSelectedTest, "ntransactiontestcode");
        // let ntransactiontestcode = this.props.Login.masterData.APSelectedTest ? this.props.Login.masterData.APSelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";

        resultTabMap.set("IDS_RESULTS", <ApprovalResultsTab
            userInfo={this.props.Login.userInfo}
            genericLabel={this.props.Login.genericLabel}
            tabSequence={SideBarSeqno.TEST}
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
            getEnforceCommentsHistory={this.props.getEnforceCommentsHistory}
        />)

        resultTabMap.set("IDS_RESULTCHANGEHISTORY",
            <ResultChangeHistoryTab
                tabSequence={SideBarSeqno.TEST}
                genericLabel={this.props.Login.genericLabel}
                userInfo={this.props.Login.userInfo}
                ApprovalResultChangeHistory={this.props.Login.masterData.ApprovalResultChangeHistory}
                inputParam={this.props.Login.inputParam}
                dataState={this.state.resultChangeDataState}
                dataStateChange={this.testDataStateChange}
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
        let { testskip, testtake, subSampleSkip, subSampleTake, skip, take } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : this.props.Login.masterData.AP_TEST || [];
        const editTestCommentsId = this.state.controlMap.has("EditTestComment") && this.state.controlMap.get("EditTestComment").ncontrolcode;
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.APSelectedTest, "ntransactiontestcode");
        let ntransactiontestcode = this.props.Login.masterData.APSelectedTest ? this.props.Login.masterData.APSelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        let npreregno = this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",") : "-1";
        const ntransactionsamplecode = this.props.Login.masterData.APSelectedSubSample ? this.props.Login.masterData.APSelectedSubSample.map(sample => sample.ntransactionsamplecode).join(",") : "-1";
        let subsampleList = this.props.Login.masterData.AP_SUBSAMPLE || [];
        subsampleList = subsampleList.slice(subSampleSkip, subSampleSkip + subSampleTake);
        subsampleList = subsampleList.slice(subSampleSkip, subSampleSkip + subSampleTake);
        let selectedSubSampleList = getSameRecordFromTwoArrays(subsampleList, this.props.Login.masterData.APSelectedSubSample, "ntransactionsamplecode");
        let sampleList = this.props.Login.masterData.AP_SAMPLE || [];
        sampleList = sampleList.slice(skip, skip + take);
        let selectedSampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.APSelectedSample, "npreregno");


        attachmentTabMap.set("IDS_TESTATTACHMENTS", <Attachments
            screenName="IDS_TESTATTACHMENTS"
            tabSequence={SideBarSeqno.TEST}
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
            nsubsampleneed={this.props.Login.masterData.nneedsubsample}
            subFields={[{ [designProperties.VALUE]: "stestsynonym" }, { [designProperties.VALUE]: "screateddate" }]}
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
                masterList: selectedTestList

            }}
            selectedListName="IDS_TESTS"
            displayName="stestsynonym"
            isneedHeader={true}
        />)
        this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample &&
            attachmentTabMap.set("IDS_SUBSAMPLEATTACHMENTS", <Attachments
                screenName="IDS_SUBSAMPLEATTACHMENTS"
                tabSequence={SideBarSeqno.SUBSAMPLE}
                onSaveClick={this.onAttachmentSaveClick}
                selectedMaster="APSelectedSubSample"
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                attachments={this.props.Login.masterData.RegistrationSampleAttachment || []}
                deleteRecord={this.props.deleteAttachment}
                //  masterList={this.props.Login.masterData.APSelectedSubSample}
                masterList={selectedSubSampleList}
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
                    masterList: this.props.Login.masterData.AP_SUBSAMPLE || []

                }}
                selectedListName="IDS_SAMPLEARNO"
                displayName="ssamplearno"
                isneedHeader={true}
            />)
        attachmentTabMap.set("IDS_SAMPLEATTACHMENTS",
            <Attachments
                screenName="IDS_SAMPLEATTACHMENTS"
                tabSequence={SideBarSeqno.SAMPLE}
                selectedMaster={this.props.Login.masterData.APSelectedSample}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                attachments={this.props.Login.masterData.RegistrationAttachment || []}
                deleteRecord={this.props.deleteAttachment}
                onSaveClick={this.onAttachmentSaveClick}
                // masterList={this.props.Login.masterData.APSelectedSample}
                masterList={selectedSampleList}
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
                    masterList: this.props.Login.masterData.APSelectedSample

                }}
                selectedListName="IDS_ARNUMBER"
                displayName="sarno"
                isneedHeader={true}
            />)
        return attachmentTabMap;
    }

    commentTabDetail = () => {
        const commentTabMap = new Map();
        let { testskip, testtake, subSampleSkip, subSampleTake, skip, take } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : this.props.Login.masterData.AP_TEST || [];
        const editTestCommentsId = this.state.controlMap.has("EditTestComment") && this.state.controlMap.get("EditTestComment").ncontrolcode;
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.APSelectedTest, "ntransactiontestcode");
        let ntransactiontestcode = this.props.Login.masterData.APSelectedTest ? this.props.Login.masterData.APSelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        let npreregno = this.props.Login.masterData.selectedSample ? this.props.Login.masterData.selectedSample.map(sample => sample.npreregno).join(",") : "-1";
        const ntransactionsamplecode = this.props.Login.masterData.APSelectedSubSample ? this.props.Login.masterData.APSelectedSubSample.map(sample => sample.ntransactionsamplecode).join(",") : "-1";
        let subsampleList = this.props.Login.masterData.AP_SUBSAMPLE || [];
        subsampleList = subsampleList.slice(subSampleSkip, subSampleSkip + subSampleTake);
        let selectedSubSampleList = getSameRecordFromTwoArrays(subsampleList, this.props.Login.masterData.APSelectedSubSample, "ntransactionsamplecode");
        let sampleList = this.props.Login.masterData.AP_SAMPLE || [];
        sampleList = sampleList.slice(skip, skip + take);
        let selectedSampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.APSelectedSample, "npreregno");


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
                selectedMaster="APSelectedSubSample"
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                Comments={this.props.Login.masterData.RegistrationSampleComment || []}
                fetchRecord={this.props.getCommentsCombo}
                addName={"AddSubSampleComment"}
                editName={"EditSubSampleComment"}
                deleteName={"DeleteSubSampleComment"}
                methodUrl={"SubSampleComment"}
                isTestComment={false}
                //  masterList={this.props.Login.masterData.APSelectedSubSample}
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
                    masterList: this.props.Login.masterData.AP_SUBSAMPLE || [],
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
            selectedMaster="APSelectedSample"
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
            //masterList={this.props.Login.masterData.APSelectedSample}
            masterList={selectedSampleList}
            masterAlertStatus="IDS_SELECTSAMPLETOADDCOMMENTS"
            primaryKeyField={"nregcommentcode"}
            dataState={this.state.sampleCommentDataState}
            dataStateChange={this.sampleDataStateChange}
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
                masterList: this.props.Login.masterData.APSelectedSample || [],
                ncontrolCode: this.state.controlMap.has("EditSampleComment") && this.state.controlMap.get("EditSampleComment").ncontrolcode
            }}
            selectedListName="IDS_ARNUMBER"
            displayName="sarno"
            selectedId={this.props.Login.selectedId || null}
        />)

        return commentTabMap;
    }

    historyTabDetail = () => {
        const historyTabMap = new Map();
        let historyExtractedColumnList = [];
        // if(this.props.Login.screenName === "IDS_TESTHISTORY"){
        historyExtractedColumnList.push({ "idsName": "IDS_ARNO", "dataField": "sarno", "width": "150px" });

        this.props.Login.masterData && this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample &&
            historyExtractedColumnList.push({ "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "200px" });

        historyExtractedColumnList.push({ "idsName": "IDS_TESTSYNONYM", "dataField": "stestsynonym", "width": "200px" },
            { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "200px" },
            { "idsName": "IDS_TRANSACTIONDATE", "dataField": "stransactiondate", "width": "200px" },
            { "idsName": "IDS_USER", "dataField": "susername", "width": "200px" },
            { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" }
        );
        // } 
        // else if(this.props.Login.screenName === "IDS_SUBSAMPLEHISTORY"){
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
            dataStateChange={this.RegistrationHistoryDataStateChange}
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


    // onSampleTabChange = (tabProps) => {
    //     const activeSampleTab = tabProps.screenName;
    //     if (activeSampleTab !== this.props.Login.activeSampleTab) {
    //         let inputData = {
    //             masterData: this.props.Login.masterData,
    //             selectedSample: this.props.Login.masterData.APSelectedSample,
    //             npreregno: this.props.Login.masterData.APSelectedSample ? this.props.Login.masterData.APSelectedSample.map(item => item.npreregno).join(",") : "-1",
    //             userinfo: this.props.Login.userInfo,
    //             screenName: activeSampleTab,
    //             activeSampleTab
    //         }
    //         this.props.getSampleChildTabDetail(inputData)
    //     }
    // }

    // onSubSampleTabChange = (tabProps) => {
    //     const activeSubSampleTab = tabProps.screenName;
    //     if (activeSubSampleTab !== this.props.Login.activeSubSampleTab) {
    //         let inputData = {
    //             masterData: this.props.Login.masterData,
    //             selectedSubSample: this.props.Login.masterData.APSelectedSubSample,
    //             ntransactionsamplecode: this.props.Login.masterData.APSelectedSubSample ? this.props.Login.masterData.APSelectedSubSample.map(item => item.ntransactionsamplecode).join(",") : "-1",
    //             userinfo: this.props.Login.userInfo,
    //             screenName: activeSubSampleTab,
    //             activeSubSampleTab,
    //             subSampleCommentDataState: this.state.subSampleCommentDataState,
    //             subSampleAttachmentDataState: this.state.subSampleAttachmentDataState,
    //         }
    //         this.props.getSubSampleChildTabDetail(inputData)
    //     }
    // }

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
        //setTimeout(() => { this._scrollBarRef.updateScroll() })
    };
    handleTestPageChange = e => {
        this.setState({
            testskip: e.skip,
            testtake: e.take
        });
    };

    closeAlert = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { availableReleaseRecord: undefined, loading: false }
        }
        this.props.updateStore(updateInfo);
    }

    checkRetestAction = (action, ncontrolCode) => {
        let { testskip, testtake } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : [...this.props.Login.masterData.AP_TEST];
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.APSelectedTest, "ntransactiontestcode");
        if (selectedTestList.length > 0) {
            if (action.ntransactionstatus === transactionStatus.RETEST && this.props.Login.availableReleaseRecord == undefined) {
                //|| action.ntransactionstatus === transactionStatus.RECALC) 
                if (this.props.Login.masterData.retestcount && this.props.Login.masterData.retestcount > 1) {
                    if (selectedTestList.length > 1) {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTONETESTONLY" }));
                    } else {
                        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
                        let ntransCode = this.props.Login.masterData.FilterStatusValue.ntransactionstatus
                        if (ntransCode === transactionStatus.ALL) {
                            ntransCode = this.props.Login.masterData.FilterStatus.map(status => status.ntransactionstatus).join(",");
                        } else {
                            ntransCode = ntransCode + "," + action.ntransactionstatus
                        }
                        let { testskip, testtake } = this.state
                        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : [...this.props.Login.masterData.AP_TEST];
                        testList = testList.slice(testskip, testskip + testtake);
                        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.APSelectedTest, "ntransactiontestcode");
                        const inputParam = {
                            inputData: {
                                'performaction': {
                                    npreregno: selectedTestList.map(sample => sample.npreregno).join(","),
                                    ntransactionsamplecode: selectedTestList.map(sample => sample.ntransactionsamplecode).join(","),
                                    ntransactiontestcode: selectedTestList.map(test => test.ntransactiontestcode).join(","),
                                    nsectioncode: this.props.Login.masterData.UserSectionValue ?
                                        this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ?
                                            this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') :
                                            String(this.props.Login.masterData.UserSectionValue.nsectioncode) :
                                        null,
                                    ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode,
                                    nTransStatus: action.ntransactionstatus,
                                    stransdisplaystatus: action.stransdisplaystatus,
                                    ntransactionstatus: String(-1),
                                    nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                                    nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                                    nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                                    napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                                    nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                                    nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                                    nneedjoballocation: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedjoballocation) || false,
                                    dfrom: obj.fromDate,
                                    dto: obj.toDate,
                                    nflag: 2,
                                    ntype: 1,
                                    userinfo: this.props.Login.userInfo,
                                    APSelectedSample: this.props.Login.masterData.APSelectedSample,
                                    APSelectedSubSample: this.props.Login.masterData.APSelectedSubSample,
                                    APSelectedTest: this.props.Login.masterData.APSelectedTest,
                                    retestcount: action.ntransactionstatus === transactionStatus.RETEST ? this.state.selectedRecord ? this.state.selectedRecord.retestcount || 1 : 1 : undefined,
                                    ncontrolCode,
                                    //  checkBoxOperation: 3,
                                    checkBoxOperation: checkBoxOperation.SINGLESELECT,
                                    ndesigntemplatemappingcode: (this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode) || -1,
                                    nbatchmastercode: (this.props.Login.masterData.defaultBatchvalue && this.props.Login.masterData.defaultBatchvalue.nbatchmastercode) || -1,
                                    activeTestTab: this.props.Login.masterData.activeTestTab || "",
                                    activeSampleTab: this.props.Login.masterData.activeSampleTab || "",
                                    activeSubSampleTab: this.props.Login.masterData.activeSubSampleTab || "",
                                    nneedmyjob: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedmyjob) || false,
                                },
                                userinfo: this.props.Login.userInfo
                            },
                            userinfo: this.props.Login.userInfo,
                            masterData: this.props.Login.masterData,
                            methodUrl: "checkReleaseRecord",
                            postParamList: this.postParamList,
                            action: action,
                            availableReleaseRecord: undefined
                        }
                        this.props.checkReleaseRecord(inputParam)
                    }
                }
            } else if (action.ntransactionstatus === transactionStatus.RETEST) {
                //&& this.props.Login.availableReleaseRecord === false) {

                if (this.props.Login.masterData.retestcount && this.props.Login.masterData.retestcount > 1) {
                    if (selectedTestList.length > 1) {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTONETESTONLY" }));
                    } else {

                        if (this.props.Login.masterData.APSelectedTest[0].nisiqcmaterial === 3) {
                            toast.warn(this.props.intl.formatMessage({ id: "IDS_IQCSAMPLECAN'TRETEST" }));
                        }
                        else {

                            const updateInfo = {
                                typeName: DEFAULT_RETURN,
                                data: {
                                    action,
                                    masterData: this.props.Login.masterData,
                                    openChildModal: true,
                                    screenName: "IDS_RETESTCOUNT",
                                    operation: "dynamic",
                                    availableReleaseRecord: undefined
                                }
                            }
                            this.props.updateStore(updateInfo);
                        }
                    }
                }
                else {
                    this.performTestActions(action, ncontrolCode);
                }

            } else if (action.ntransactionstatus === transactionStatus.RECALC && this.props.Login.availableReleaseRecord == undefined) {
                const inputParam = {
                    inputData: {
                        'performaction': {
                            npreregno: selectedTestList.map(sample => sample.npreregno).join(","),
                            //Commented by sonia on 18th Feb 2025 for jira id:ALPD-5432
                           // ntransactionsamplecode: this.props.Login.masterData.APSelectedSubSample.map(sample => sample.ntransactionsamplecode).join(","),
                           //Added by sonia on 18th Feb 2025 for jira id:ALPD-5432
                           ntransactionsamplecode: selectedTestList.map(sample => sample.ntransactionsamplecode).join(","),

                            ntransactiontestcode: selectedTestList.map(test => test.ntransactiontestcode).join(","),
                            nsectioncode: this.props.Login.masterData.UserSectionValue ?
                                this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ?
                                    this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') :
                                    String(this.props.Login.masterData.UserSectionValue.nsectioncode) :
                                null,
                            ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode,
                            nTransStatus: action.ntransactionstatus,
                            stransdisplaystatus: action.stransdisplaystatus,
                            ntransactionstatus: String(-1),
                            nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                            nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                            napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                            nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                            nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                            nneedjoballocation: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedjoballocation) || false,
                            // dfrom: obj.fromDate,
                            // dto: obj.toDate,
                            nflag: 2,
                            ntype: 1,
                            userinfo: this.props.Login.userInfo,
                            APSelectedSample: this.props.Login.masterData.APSelectedSample,
                            APSelectedSubSample: this.props.Login.masterData.APSelectedSubSample,
                            APSelectedTest: this.props.Login.masterData.APSelectedTest,
                            retestcount: action.ntransactionstatus === transactionStatus.RETEST ? this.state.selectedRecord ? this.state.selectedRecord.retestcount || 1 : 1 : undefined,
                            ncontrolCode,
                            // checkBoxOperation: 3,
                            checkBoxOperation: checkBoxOperation.SINGLESELECT,
                            ndesigntemplatemappingcode: (this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode) || -1,
                            nbatchmastercode: (this.props.Login.masterData.defaultBatchvalue && this.props.Login.masterData.defaultBatchvalue.nbatchmastercode) || -1,
                            activeTestTab: this.props.Login.masterData.activeTestTab || "",
                            activeSampleTab: this.props.Login.masterData.activeSampleTab || "",
                            activeSubSampleTab: this.props.Login.masterData.activeSubSampleTab || ""
                        },
                        userinfo: this.props.Login.userInfo
                    },
                    userinfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    methodUrl: "checkReleaseRecord",
                    postParamList: this.postParamList,
                    action: action,
                    availableReleaseRecord: undefined
                }
                this.props.checkReleaseRecord(inputParam)
            } else if (action.ntransactionstatus === transactionStatus.RECALC) {
                // && this.props.Login.availableReleaseRecord === false)
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        action,
                        masterData: this.props.Login.masterData,
                        //openChildModal: true,
                        //screenName: "IDS_RETESTCOUNT",
                        operation: "dynamic",
                        availableReleaseRecord: undefined
                    }
                }
                this.props.updateStore(updateInfo);
                this.performTestActions(action, ncontrolCode);
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
            let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : [...this.props.Login.masterData.AP_TEST];
            testList = testList.slice(testskip, testskip + testtake);
            let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.APSelectedTest, "ntransactiontestcode");
            const inputParam = {
                inputData: {
                    'performaction': {
                        npreregno: selectedTestList.map(sample => sample.npreregno).join(","),
                        //ntransactionsamplecode: this.props.Login.masterData.APSelectedSubSample.map(sample => sample.ntransactionsamplecode).join(","),
                        ntransactionsamplecode: selectedTestList.map(sample => sample.ntransactionsamplecode).join(","),
                        ntransactiontestcode: selectedTestList.map(test => test.ntransactiontestcode).join(","),
                        nsectioncode: this.props.Login.masterData.UserSectionValue ?
                            this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ?
                                this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') :
                                String(this.props.Login.masterData.UserSectionValue.nsectioncode) :
                            null,
                        ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode,
                        nTransStatus: action.ntransactionstatus,
                        stransdisplaystatus: action.stransdisplaystatus,
                        ntransactionstatus: String(-1),
                        nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                        napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode,
                        nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                        nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                        nneedjoballocation: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedjoballocation) || false,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nflag: 2,
                        ntype: 1,
                        userinfo: this.props.Login.userInfo,
                        APSelectedSample: this.props.Login.masterData.APSelectedSample,
                        APSelectedSubSample: this.props.Login.masterData.APSelectedSubSample,
                        APSelectedTest: this.props.Login.masterData.APSelectedTest,
                        retestcount: action.ntransactionstatus === transactionStatus.RETEST ? this.state.selectedRecord ? this.state.selectedRecord.retestcount || 1 : 1 : undefined,
                        ncontrolCode,
                        //  checkBoxOperation: 3,
                        checkBoxOperation: checkBoxOperation.SINGLESELECT,
                        ndesigntemplatemappingcode: (this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode) || -1,
                        nbatchmastercode: (this.props.Login.masterData.defaultBatchvalue && this.props.Login.masterData.defaultBatchvalue.nbatchmastercode) || -1,
                        activeTestTab: this.props.Login.masterData.activeTestTab || "",
                        activeSampleTab: this.props.Login.masterData.activeSampleTab || "",
                        activeSubSampleTab: this.props.Login.masterData.activeSubSampleTab || "",
                        nneedmyjob: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedmyjob) || false,
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
        //ATE234 janakumar ALPD-5316 Test Approval -> Decision Status there have based on sample type.
        let ntransCode = this.props.Login.masterData.realFilterStatusValue.ntransactionstatus
        if (ntransCode === transactionStatus.ALL) {
            ntransCode = this.props.Login.masterData.FilterStatus.map(status => status.ntransactionstatus).join(",");
        }
        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
        let { skip, take, testskip, testtake, subSampleSkip, subSampleTake } = this.state
        let sampleList = [...this.props.Login.masterData.AP_SAMPLE];
        sampleList = sampleList.splice(skip, skip + take);
        let selectedsampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.APSelectedSample, "npreregno");
        // ALPD-5676    Added subsamplelist and testlist by Vishakh to pass this list primarykey to backend (08-04-2025)
        let subSampleList = this.props.Login.masterData && this.props.Login.masterData.AP_SUBSAMPLE 
            ? this.props.Login.masterData.AP_SUBSAMPLE : [];
        let testList = this.props.Login.masterData && this.props.Login.masterData.AP_TEST 
            ? this.props.Login.masterData.AP_TEST : [];

        //let selectedsampleList =this.props.Login.masterData.APSelectedSample;
        if (selectedsampleList.length > 0) { //selectedsampleList !==undefined
            const inputData = {
                'updatedecision': {
                    npreregno: selectedsampleList.map(sample => sample.npreregno).join(","),
                    // ALPD-5676    Added ntransactionsamplecode and ntransactiontestcode by Vishakh to pass this value to backend (08-04-2025)
                    ntransactionsamplecode: subSampleList.map(subsample => subsample.ntransactionsamplecode).join(","),
                    ntransactiontestcode: testList.map(test => test.ntransactiontestcode).join(","),
                    //npreregno:this.props.Login.masterData.selectedPreregno,
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
                    //ntestcode: this.props.Login.masterData.TestValue ? this.props.Login.masterData.TestValue.ntestcode : 0,
                    ntestcode:0,// for all the test 
                    nflag: 1,
                    ntype:1,    // ALPD-5676    Changed ntype from 2 to 1 by Vishakh to get selected records data instead of initial overall get (08-04-2025)
                    userinfo: this.props.Login.userInfo,
                    napprovalversioncode: String(selectedsampleList.napprovalversioncode),
                    napprovalconfigcode: selectedsampleList.napprovalconfigcode,
                    ndesigntemplatemappingcode: (this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode) || -1,
                    nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                    nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                    nneedjoballocation: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedjoballocation) || false,
                    selectedSample: this.props.Login.masterData.realSampleTypeValue,
                    checkBoxOperation: checkBoxOperation.SINGLESELECT,
                    selectedSampleValue:this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                    activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                }, userinfo: this.props.Login.userInfo

            }
            let inputParam = { 
                postParamList: this.postParamList, 
                inputData, 
                masterData: this.props.Login.masterData,
                // ALPD-5676    Added skip and take for test and subsample by Vishakh (08-04-2025)
                testskip, 
                testtake, 
                subSampleSkip, 
                subSampleTake
             }
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
        }else{
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLE" }))
        }

    
    }
    // ATE234 janakumar ALPD-5316 Reused this below method above as per my requeriment for updating decision status for demo
    // updateDecision = (action) => {
    //     let ntransCode = this.props.Login.masterData.realFilterStatusValue.ntransactionstatus
    //     if (ntransCode === transactionStatus.ALL) {
    //         ntransCode = this.props.Login.masterData.FilterStatus.map(status => status.ntransactionstatus).join(",");
    //     }
    //     let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
    //     let { skip, take } = this.state
    //     let sampleList = [...this.props.Login.masterData.AP_SAMPLE];
    //     sampleList = sampleList.splice(skip, skip + take);
    //     let selectedsampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.selectedSample, "npreregno");
    //     if (selectedsampleList.length > 0) {
    //         const inputData = {
    //             'updatedecision': {
    //                 npreregno: selectedsampleList.map(sample => sample.npreregno).join(","),
    //                 nTransStatus: action.ntransactionstatus,
    //                 ntransactionstatus: String(ntransCode),
    //                 dfrom: obj.fromDate,
    //                 dto: obj.toDate,
    //                 nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
    //                 nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
    //                 nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
    //                 nsectioncode: this.props.Login.masterData.UserSectionValue ?
    //                     this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ?
    //                         this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') :
    //                         String(this.props.Login.masterData.UserSectionValue.nsectioncode) :
    //                     null,
    //                 ntestcode: this.props.Login.masterData.TestValue ? this.props.Login.masterData.TestValue.ntestcode : 0,
    //                 nflag: 1,
    //                 userinfo: this.props.Login.userInfo,
    //                 napprovalversioncode: String(selectedsampleList[0].napprovalversioncode),
    //                 napprovalconfigcode: selectedsampleList[0].napprovalconfigcode,
    //                 selectedSample: this.props.Login.masterData.selectedSample,
    //             }, userinfo: this.props.Login.userInfo

    //         }
    //         let inputParam = { postParamList: this.postParamList, inputData, masterData: this.props.Login.masterData }
    //         if (action.nesignneed === transactionStatus.YES) {
    //             const updateInfo = {
    //                 typeName: DEFAULT_RETURN,
    //                 data: {
    //                     loadEsign: true,
    //                     screenData: { inputParam, masterData: this.props.Login.masterData },
    //                     openChildModal: true,
    //                     screenName: "updatedecision",
    //                     operation: "decision"
    //                 }
    //             }
    //             this.props.updateStore(updateInfo);
    //         } else {
    //             this.props.updateDecision(inputParam)
    //         }
    //     } else {
    //         toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLE" }))
    //     }

    // }
    onFilterComboChange = (comboData, fieldName) => {

        if (comboData) {
            let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
            let inputParamData = {};
            if (fieldName === 'nsampletypecode') {
                if (comboData.value !== this.props.Login.masterData.SampleTypeValue.nsampletypecode) {
                    inputParamData = {
                        nflag: 2,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        SampleTypeValue: comboData.item,
                        realApprovalVersionList: this.props.Login.masterData.realApprovalVersionList,
                        realDesignTemplateMappingList: this.props.Login.masterData.realDesignTemplateMappingList,
                        realRegTypeList: this.props.Login.masterData.realRegTypeList,
                        realRegSubTypeList: this.props.Login.masterData.realRegSubTypeList,
                        realFilterStatusList: this.props.Login.masterData.realFilterStatusList

                    };
                    this.props.getRegistrationType(inputParamData)
                }
            } else if (fieldName === 'nregtypecode') {
                if (comboData.value !== this.props.Login.masterData.RegTypeValue.nregtypecode) {
                    inputParamData = {
                        nflag: 3,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                        nregtypecode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        RegTypeValue: comboData.item,
                        realApprovalVersionList: this.props.Login.masterData.realApprovalVersionList,
                        realDesignTemplateMappingList: this.props.Login.masterData.realDesignTemplateMappingList,
                        realRegTypeList: this.props.Login.masterData.realRegTypeList,
                        realRegSubTypeList: this.props.Login.masterData.realRegSubTypeList,
                        realFilterStatusList: this.props.Login.masterData.realFilterStatusList

                    }
                    this.props.getRegistrationSubType(inputParamData)
                }
            } else if (fieldName === 'nregsubtypecode') {

                if (comboData.value !== this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) {
                    let inputData = {
                        nflag: 4,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
                        nregsubtypecode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        stransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.FilterStatusValue.ntransactionstatus,

                        //nsectioncode: this.props.Login.masterData.UserSection && this.props.Login.masterData.UserSection.length > 0 ? this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") : this.props.Login.masterData.UserSectionValue.nsectioncode : null,
                        realApprovalVersionList: this.props.Login.masterData.realApprovalVersionList,
                        realDesignTemplateMappingList: this.props.Login.masterData.realDesignTemplateMappingList,
                        realRegTypeList: this.props.Login.masterData.realRegTypeList,
                        realRegSubTypeList: this.props.Login.masterData.realRegSubTypeList,
                        realFilterStatusList: this.props.Login.masterData.realFilterStatusList

                    }
                    inputParamData = {
                        inputData,
                        masterData: {
                            ...this.props.Login.masterData,
                            RegSubTypeValue: comboData.item
                        }
                    }
                    this.props.getApprovalVersion(inputParamData)
                }
            }
            else if (fieldName === 'ndesigntemplatemappingcode') {
                const inputParamData = {
                    dfrom: obj.fromDate,
                    dto: obj.toDate,
                    nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
                    napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
                    userinfo: this.props.Login.userInfo,
                    masterData: { ...this.props.Login.masterData },
                    RegSubTypeValue: this.props.Login.masterData.RegSubTypeValue,
                    ntransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
                    stransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
                    //  nsectioncode: this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") : this.props.Login.masterData.UserSectionValue.nsectioncode,
                    ndesigntemplatemappingcode: comboData.value,
                    DesignTemplateMappingValue: comboData.item
                }
                this.props.getFilterBasedTest(inputParamData)
            }
            else if (fieldName === 'napproveconfversioncode') {
                if (comboData.value !== this.props.Login.masterData.ApprovalVersionValue.napproveconfversioncode) {
                    let ApprovalVersionValue = comboData.item
                    ApprovalVersionValue['napproveconfversioncode'] = comboData.value
                    inputParamData = {
                        nflag: 4,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
                        napprovalversioncode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        ntransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
                        stransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.FilterStatusValue.ntransactionstatus,

                        masterData: { ...this.props.Login.masterData, ApprovalVersionValue },
                        RegSubTypeValue: this.props.Login.masterData.RegSubTypeValue,
                        napproveconfversioncode: comboData.value,
                        ApprovalVersionValue: comboData.item,
                        //   nsectioncode: this.props.Login.masterData.UserSectionValue!== null&&
                        //    this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") : this.props.Login.masterData.UserSectionValue.nsectioncode,
                        ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode &&
                            this.props.Login.masterData.ndesigntemplatemappingcode ? this.props.Login.masterData.ndesigntemplatemappingcode : -1
                    }
                    this.props.getFilterStatus(inputParamData)
                }
            }
            else if (fieldName === 'nsectioncode') {
                if (comboData.value !== this.props.Login.masterData.UserSectionValue.nsectioncode) {
                    // let masterData = { ...this.props.Login.masterData, UserSectionValue: comboData.item }
                    inputParamData = {
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
                        napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
                        userinfo: this.props.Login.userInfo,
                        masterData: { ...this.props.Login.masterData, UserSectionValue: comboData.item },
                        RegSubTypeValue: this.props.Login.masterData.RegSubTypeValue,
                        ntransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
                        nsectioncode: comboData.value === -1 ?
                            this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",")
                            : comboData.value,
                        stransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
                        ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode ? this.props.Login.masterData.ndesigntemplatemappingcode : -1,
                        DesignTemplateMappingValue: this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue
                    }

                    this.props.getFilterBasedTest(inputParamData);
                }
            } else if (fieldName === 'njobstatuscode') {
                if (comboData.value !== this.props.Login.masterData.JobStatusValue.njobstatuscode) {
                    let masterData = { ...this.props.Login.masterData, JobStatusValue: comboData.item }
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData }
                    }
                    this.props.updateStore(updateInfo);
                }
            }
            else if (fieldName === 'ntestcode') {
                if (comboData.value !== this.props.Login.masterData.TestValue.ntestcode) {
                    let masterData = { ...this.props.Login.masterData, TestValue: comboData.item }
                    let inputData = {
                        masterData: masterData,
                        ntestcode: comboData.item.ntestcode,
                        defaultRegistrationSubType: this.props.Login.masterData.defaultRegistrationSubType,
                        //ntranscode: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
                        ntranscode: this.props.Login.masterData.FilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.FilterStatusValue.ntransactionstatus.toString(),
                        userinfo: this.props.Login.userInfo,
                        napprovalversioncode: parseInt(this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode)

                    }
                    this.props.getTestBasedCompletedBatch(inputData)
                    // const updateInfo = {
                    //     typeName: DEFAULT_RETURN,
                    //     data: { masterData }
                    // }
                    // this.props.updateStore(updateInfo);
                }
            }
            else if (fieldName === 'nbatchmastercode') {
                if (comboData.value !== this.props.Login.masterData.TestValue.ntestcode) {
                    let defaultBatchvalue = comboData.item;
                    this.props.Login.masterData.defaultBatchvalue = defaultBatchvalue;
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData: { ...this.props.Login.masterData } }
                    }
                    this.props.updateStore(updateInfo);
                }
            }
            else {
                if (comboData.value !== this.props.Login.masterData.FilterStatusValue.ntransactionstatus) {
                    //  let masterData = { ...this.props.Login.masterData, FilterStatusValue: comboData.item }
                    //  const updateInfo = {
                    //     typeName: DEFAULT_RETURN,
                    //    data: { masterData }
                    // }

                    inputParamData = {
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
                        napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
                        userinfo: this.props.Login.userInfo,
                        masterData: { ...this.props.Login.masterData, FilterStatusValue: comboData.item },
                        RegSubTypeValue: this.props.Login.masterData.RegSubTypeValue,
                        ntransactionstatus: comboData.value,
                        stransactionstatus: comboData.value === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : comboData.value,
                        nsectioncode: null,//this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? 

                        DesignTemplateMappingValue: this.props.Login.masterData.DesignTemplateMappingValue,
                        ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode ? this.props.Login.masterData.ndesigntemplatemappingcode : -1    //this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") 
                        //: this.props.Login.masterData.UserSectionValue.nsectioncode, 


                    }

                    this.props.getFilterBasedTest(inputParamData);
                }
            }
        }
        else {
            if (fieldName === 'nbatchmastercode') {

                this.props.Login.masterData.defaultBatchvalue = [];

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { masterData: { ...this.props.Login.masterData } }
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
                userinfo: this.props.Login.userInfo,
                realApprovalVersionList: this.props.Login.masterData.realApprovalVersionList,
                realDesignTemplateMappingList: this.props.Login.masterData.realDesignTemplateMappingList,
                realRegTypeList: this.props.Login.masterData.realRegTypeList,
                realRegSubTypeList: this.props.Login.masterData.realRegSubTypeList,
                realFilterStatusList: this.props.Login.masterData.realFilterStatusList
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
    onReload = () => {
        let { realFromDate, realToDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue,
            realFilterStatusValue, realApprovalVersionValue, realUserSectionValue, realTestValue, realBatchvalue } = this.props.Login.masterData
        let masterData = { ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue, realUserSectionValue, realTestValue }
        let inputData = {
            npreregno: "0",
            nneedsubsample: (realRegSubTypeValue && realRegSubTypeValue.nneedsubsample) || false,
            nneedtemplatebasedflow: (realRegSubTypeValue && realRegSubTypeValue.nneedtemplatebasedflow) || false,
            nsampletypecode: (realSampleTypeValue && realSampleTypeValue.nsampletypecode) || -1,
            nregtypecode: (realRegTypeValue && realRegTypeValue.nregtypecode) || -1,
            nregsubtypecode: (realRegSubTypeValue && realRegSubTypeValue.nregsubtypecode) || -1,
            // ntransactionstatus: ((realFilterStatusValue && realFilterStatusValue.ntransactionstatus !== undefined) || realFilterStatusValue.ntransactionstatus !== '0') ? String(realFilterStatusValue.ntransactionstatus) : "-1",
            ntransactionstatus: this.props.Login.masterData.FilterStatusValue
                ? (this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== undefined
                    || this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== '0')
                    ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) : "-1" : "-1",

            napprovalconfigcode: realApprovalVersionValue ? realApprovalVersionValue.napprovalconfigcode || -1 : null,
            napprovalversioncode: realApprovalVersionValue && realApprovalVersionValue.napprovalconfigversioncode ? String(realApprovalVersionValue.napprovalconfigversioncode) : null,
            nsectioncode: realUserSectionValue ? realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(realUserSectionValue.nsectioncode) : null,
            ntestcode: realTestValue && realTestValue.ntestcode ? realTestValue.ntestcode : -1,
            userinfo: this.props.Login.userInfo,
            activeTestTab: this.props.Login.activeTestTab || "",
            activeSampleTab: this.props.Login.activeSampleTab || "",
            activeSubSampleTab: this.props.Login.activeSubSampleTab || "",
            //checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            ntype: 2,
            ndesigntemplatemappingcode: (this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode) || -1,
            nbatchmastercode: (realBatchvalue && realBatchvalue.nbatchmastercode) || -1
        }
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
            && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
            && realFilterStatusValue.sfilterstatus !== null) {

            //  ALPD-4133 to Clear Additional Filter Config Data upon Refresh and clear filter ATE-241
            masterData["kendoFilterList"] = undefined;

            let obj = convertDateValuetoString(realFromDate, realToDate, this.props.Login.userInfo)
            inputData['dfrom'] = obj.fromDate;
            inputData['dto'] = obj.toDate;
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
                //ALPD-5193--Added by Neeraj Test Approval screen -> Records are disappeared in Sub-sample column in specific scenario. ( Both Product & French )
                //start
                subSampleTake: this.state.subSampleTake,
                subSampleSkip: this.state.subSampleSkip,
                //end
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
            this.props.getApprovalSample(inputParam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }
    }
//Ate234 Janakumar ALPD-5123 Test Approval -> To get previously saved filter details when click the filter name
    onSaveModalResultClickSeparate=()=>{

        if(this.props.Login.isFilterDetail===true){
            this.onSaveModalFilterName();
        }else{
            this.onSaveModalResultClick();
        }

    }

    //ALPD-4878 To open the save popup of filtername,done by Dhanushya RI
    openFilterName = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { modalShow: true, operation: "create", isFilterDetail: true, modalTitle: this.props.intl.formatMessage({ id: "IDS_SAVEFILTER" }) }
        }
        this.props.updateStore(updateInfo);
    }
    //Ate234 Janakumar ALPD-5123 Test Approval -> To get previously saved filter details when click the filter name
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
          ntranscode: this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,      
          napprovalconfigcode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
          napproveconfversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode : -1,
          userinfo: this.props.Login.userInfo,
          ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
          nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.realUserSectionValue.nsectioncode) : null,
          ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode ? this.props.Login.masterData.realTestValue.ntestcode : -1,
          nfiltertransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus === 0 ?`${this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",")}`:`${this.props.Login.masterData.FilterStatusValue.ntransactionstatus}`,
          needExtraKeys: true,
        }

        // this.props.Login["isFilterDetail"]=false;
        // this.props.Login["modalShow"]=false;
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
      //Ate234 Janakumar ALPD-5123 Test Approval -> To get previously saved filter details when click the filter name
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
        this.props.getTestApprovalFilterDetails(inputParam);
        // }
        // else{
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDFILTERALREADYLOADED" }));  
        // }
      }

      //Ate234 Janakumar ALPD-5123 Test Approval -> To get previously saved filter details when click the filter name
    onFilterSubmit = () => {
        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
        let realFromDate = obj.fromDate;
        let realToDate = obj.toDate
        let realSampleTypeValue = this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue
        let realRegTypeValue = this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue
        let realRegSubTypeValue = this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue
        let realFilterStatusValue = this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue
        let realApprovalVersionValue = this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue
        let realUserSectionValue = this.props.Login.masterData.UserSectionValue && this.props.Login.masterData.UserSectionValue
        let realTestValue = this.props.Login.masterData.TestValue && this.props.Login.masterData.TestValue
        let realDesignTemplateMappingValue = this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue
        let realBatchCodeValue = this.props.Login.masterData.defaultBatchvalue && this.props.Login.masterData.defaultBatchvalue
        let realSampleTypeList = this.props.Login.masterData.SampleType && this.props.Login.masterData.SampleType
        let realRegTypeList = this.props.Login.masterData.RegType && this.props.Login.masterData.RegType
        let realRegSubTypeList = this.props.Login.masterData.RegSubType && this.props.Login.masterData.RegSubType
        let realFilterStatusList = this.props.Login.masterData.FilterStatus && this.props.Login.masterData.FilterStatus
        let realApprovalVersionList = this.props.Login.masterData.ApprovalVersion && this.props.Login.masterData.ApprovalVersion
        let realUserSectionList = this.props.Login.masterData.UserSection && this.props.Login.masterData.UserSection
        let realTestList = this.props.Login.masterData.Test && this.props.Login.masterData.Test
        let realDesignTemplateMappingList = this.props.Login.masterData.DesignTemplateMapping && this.props.Login.masterData.DesignTemplateMapping
        let realBatchvalue = this.props.Login.masterData.defaultBatchvalue && this.props.Login.masterData.defaultBatchvalue
        let realBatchvaluesList = this.props.Login.masterData.Batchvalues && this.props.Login.masterData.Batchvalues
        // Batchvalues:this.props.Login.masterData.realBatchvaluesList || {},

        let masterData = {
            ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue, realRegTypeValue,
            realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue, realUserSectionValue, realTestValue,
            realDesignTemplateMappingValue, realBatchCodeValue, realDesignTemplateMappingList, realTestList, realUserSectionList,
            realApprovalVersionList, realFilterStatusList, realRegSubTypeList, realRegTypeList, realSampleTypeList,
            realBatchvalue, realBatchvaluesList
        }
        let inputData = {
            npreregno: "0",
            nsampletypecode: (this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue.nsampletypecode) || -1,
            nregtypecode: parseInt(this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode) || -1,
            nregsubtypecode: parseInt(this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) || -1,
            ntransactionstatus: this.props.Login.masterData.FilterStatusValue
                ? (this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== undefined
                    || this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== '0')
                    ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) : "-1" : "-1",
            napprovalconfigcode: this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigcode || -1 : null,
            napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode) : null,
            nsectioncode: this.props.Login.masterData.UserSectionValue ? this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.UserSectionValue.nsectioncode) : null,
            ntestcode: this.props.Login.masterData.TestValue ? this.props.Login.masterData.TestValue.ntestcode : -1,
            nneedsubsample: (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample) || false,
            nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
            userinfo: this.props.Login.userInfo,
            activeTestTab: this.props.Login.activeTestTab,
            activeSampleTab: this.props.Login.activeSampleTab,
            activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
            //  checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            ntype: 2,
            ndesigntemplatemappingcode: (this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
            nbatchmastercode: (this.props.Login.masterData.defaultBatchvalue && this.props.Login.masterData.defaultBatchvalue.nbatchmastercode) || -1,
            needExtraKeys: true,
            saveFilterSubmit:true,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            sampleTypeValue:this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue,
            regTypeValue:this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue,
            regSubTypeValue:this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue,
            filterStatusValue:this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue,
            approvalConfigValue: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue,
            designTemplateMappingValue:  (this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
            napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode) : null,
      
        }
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
            && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
            && realFilterStatusValue.sfilterstatus !== null && inputData.ntestcode !== undefined) {
            // ALPD-4133 to Clear Additional Filter info on filter Submit ATE-241
            masterData["kendoFilterList"] = undefined;
            // let obj = this.covertDatetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate)
            inputData['dfrom'] = obj.fromDate;
            inputData['dto'] = obj.toDate;
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
            this.props.getApprovalSample(inputParam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }

    }

    // ALPD-4133 Start of On Click Additional Filter handler - ATE-241
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
        const sampleList = this.props.Login.masterData.AP_SAMPLE || [];
        const kendoOptionList = sampleList.length > 0 ? sampleList.map(item => {
            datefileds.map(x => {
                item[x + "timestamp"] = toTimestamp(rearrangeDateFormatforKendoDataTool(this.props.Login.userInfo, item[x]))
            })
            return item;
        }) : [];

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openChildModal: true,
                masterData: {
                    ...this.props.Login.masterData, fields,
                    kendoFilterList, kendoOptionList
                },
                //ALPD-4231-Vignesh R(24-05-2024)-retest popup showing, when click the additional filter in test approval

                operation: "",
                multiFilterLoad: true,
                screenName: "IDS_ADDITIONALFILTER",
                skip: undefined
            }
        };
        this.props.updateStore(updateInfo);

    }

    // ALPD-4133 parentCallBack for Additional Filter ATE-241
    parentCallBack = (data, filter) => {
        this.setState({
            filterSampleList: data,
            kendoFilterList: filter
        });
    }

    //  ALPD-4133 Additional Filter Change handler ATE-241
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
    //  End of ALPD-4133 -ATE-241




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
            case "IDS_TESTHISTORY":
                this.setState({
                    registrationTestHistoryDataState: event.dataState
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

    dataStateChange = (event) => {
        this.setState({ dataState: event.dataState })
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
            case "IDS_SAMPLECOMMENTS":
                this.setState({
                    sampleCommentDataState: event.dataState
                })
                break;
            default:
                this.setState({
                    sampleGridDataState: event.dataState
                });
                break;
        }
    }

    RegistrationHistoryDataStateChange = (event) => {
        switch (this.props.Login.screenName) {
            case "IDS_TESTHISTORY":
                this.setState({
                    registrationTestHistoryDataState: event.dataState
                });
                break;
            case "IDS_SUBSAMPLEHISTORY":
                this.setState({
                    registrationSubSampleHistoryDataState: event.dataState
                })
                break;
            case "IDS_SAMPLEHISTORY":
                this.setState({
                    registrationSampleHistoryDataState: event.dataState
                })
                break;
        }
    }

    onSaveClick = (saveType, formRef) => {
        const masterData = this.props.Login.masterData;
        let { realFromDate, realToDate, realApprovalVersionValue, realUserSectionValue, realTestValue } = this.props.Login.masterData
        let obj = convertDateValuetoString(realFromDate, realToDate, this.props.Login.userInfo)
        let inputData = {}
        let inputParam = {}
        let ok = true;
        inputData["userinfo"] = this.props.Login.userInfo;
        if (this.props.Login.operation === 'enforce') {
            inputData["enforcestatus"] = {
                nregtypecode: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
                ndesigntemplatemappingcode: (this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode) || -1,
                ngradecode: this.props.Login.masterData.GradeValue.value || -1,
                ntransactionstatus: this.props.Login.masterData.FilterStatusValue
                    ? (this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== undefined
                        || this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== '0')
                        ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) : "-1" : "-1",
                nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                ntransactiontestcode: this.state.selectedRecord.ntransactiontestcode,
                ntransactionresultcode: this.state.selectedRecord.ntransactionresultcode,
                senforcestatuscomment: this.state.selectedRecord.senforcestatuscomment || "",
                selectedTestCode: this.props.Login.masterData.APSelectedTest.map(test => test.ntransactiontestcode).join(","),

                // ALPD-1413
                // ntransactionstatus: this.props.Login.masterData.FilterStatusValue 
                // ? (this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== undefined
                // || this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== '0') 
                // ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) : "-1":"-1",
                napprovalversioncode: realApprovalVersionValue && realApprovalVersionValue.napprovalconfigversioncode ? String(realApprovalVersionValue.napprovalconfigversioncode) : null,
                npreregno: "0",
                preregno: this.props.Login.masterData.APSelectedSample[0].npreregno,
                // ntransactionsamplecode: this.props.Login.masterData.APSelectedSubSample[0].ntransactionsamplecode,
                nsectioncode: realUserSectionValue ? realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(realUserSectionValue.nsectioncode) : null,
                ntestcode: realTestValue && realTestValue.ntestcode ? realTestValue.ntestcode : -1,
                dfrom: obj.fromDate,
                dto: obj.toDate,
                ntype: 2,
                //  checkBoxOperation: 3,
                checkBoxOperation: checkBoxOperation.SINGLESELECT,
                activeTestTab: this.props.Login.activeTestTab || "",
                activeSampleTab: this.props.Login.activeSampleTab || "",
                activeSubSampleTab: this.props.Login.activeSubSampleTab || "",
                enforcestatus: true,
                masterData: this.props.Login.masterData
            }
            inputParam = {
                methodUrl: "EnforceStatus",
                classUrl: 'approval',
                inputData: inputData,
                masterData: this.props.Login.masterData,
                postParam: { selectedObject: "APSelectedTest", primaryKeyField: "ntransactiontestcode" },
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
                    postParam: { selectedObject: "APSelectedTest", primaryKeyField: "ntransactiontestcode" },
                    operation: "update"
                }
            } else {
                ok = false;
                this.handleClose()
            }
        }
        if (ok) {
            if (this.props.Login.operation === 'enforce') {

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
                    this.props.updateEnforceStatus(inputParam, masterData, "openChildModal");
                }
            } else {


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
    handleClose = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal
        let selectedRecord = this.props.Login.selectedRecord;
        let templateData = this.props.Login.templateData;
        let operation = this.props.Login.operation;
        let multiFilterLoad = this.props.Login.multiFilterLoad;
        let openTemplateModal = this.props.Login.openTemplateModal;
        let availableReleaseRecord = this.props.Login.availableReleaseRecord;
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
            selectedRecord['esignpassword'] = ""
            selectedRecord['esigncomments'] = ""
            selectedRecord['esignreason'] = ""
            availableReleaseRecord = undefined;
        }
        else {
            openTemplateModal = false;
            openModal = false;
            openChildModal = false;
            selectedRecord = {};
            templateData = {};
            availableReleaseRecord = undefined;
            multiFilterLoad = false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal, openChildModal, loadEsign, selectedRecord, templateData,
                selectedParamId: null, operation, openTemplateModal, availableReleaseRecord, multiFilterLoad
            }
        }
        this.props.updateStore(updateInfo);
    }

    //  ALPD-4133 Start of On Save handler of Additional Filter -ATE-241
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
            });
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
                            AP_SUBSAMPLE: [],
                            AP_TEST: [],
                            RegistrationTestComment: [],
                            RegistrationParameter: [],
                            RegistrationTestAttachment: [],
                            RegistrationComment: [],
                            RegistrationSampleAttachment: [],
                            RegistrationSampleComment: [],

                        },
                        multiFilterLoad: false,
                        openChildModal: false,
                        searchSampleRef,
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                selectedSample.push(searchedSample[0]);
                let inputData = {
                    //masterData: this.props.Login.masterData,
                    ntransactionstatus: String(this.props.Login.masterData.realFilterStatusValue ? this.props.Login.masterData.realFilterStatusValue.ntransactionstatus : this.props.Login.masterData.FilterStatusValue ? this.props.Login.masterData.FilterStatusValue.ntransactionstatus : -1),
                    userinfo: this.props.Login.userInfo,
                    nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                    nsectioncode: this.props.Login.masterData.UserSectionValue ? this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.UserSectionValue.nsectioncode) : null,
                    ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode : -1,
                    napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode : -1,
                    nneedsubsample: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
                    nneedtemplatebasedflow: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow,
                    activeTestTab: this.props.Login.activeTestTab || "IDS_RESULTS",
                    activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                    activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                    screenName: this.props.Login.screenName,
                    searchSubSampleRef: this.searchSubSampleRef,
                    searchTestRef: this.searchTestRef,
                    instrumentDataState: this.state.instrumentDataState,
                    materialDataState: this.state.materialDataState,
                    taskDataState: this.state.taskDataState,
                    documentDataState: this.state.documentDataState,
                    resultChangeDataState: this.state.resultChangeDataState,
                    testCommentDataState: this.state.testCommentDataState,
                    historyDataState: this.state.historyDataState,
                    samplePrintHistoryDataState: this.state.samplePrintHistoryDataState,
                    sampleHistoryDataState: this.state.sampleHistoryDataState,
                    ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1,
                    nbatchmastercode: (this.props.Login.masterData.realBatchCodeValue && this.props.Login.masterData.realBatchCodeValue.nbatchmastercode) || -1,
                    activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 8 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 8 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
                    fromdate: fromDate,
                    todate: toDate,
                    testskip: 0,
                    testtake: this.state.testtake,
                    subSampleSkip: 0,
                    subSampleTake: this.state.subSampleTake,
                    skip: 0,
                    resultDataState: this.state.resultDataState,
                    sampleChangeDataState: this.state.sampleChangeDataState,
                    checkBoxOperation: checkBoxOperation.SINGLESELECT,
                    childTabsKey: ["AP_SUBSAMPLE", "AP_TEST", "ApprovalParameter", "SampleApprovalHistory", "RegistrationAttachment", "PrintHistory", "COAHistory", "RegistrationComment", "ResultUsedTasks", "ResultUsedMaterial",
                        "RegistrationSampleComment", "RegistrationSampleAttachment", "RegistrationTestAttachment", "RegistrationTestComment"],
                    npreregno: selectedSample[0].npreregno && selectedSample[0].npreregno.toString(),
                    removeElementFromArray: masterData.selectedSample,
                    sample: selectedSample,
                    APSelectedSample: selectedSample,
                    searchSampleRef: this.searchSampleRef,
                    masterData: { ...masterData, searchedSample, selectedSample, kendoFilterList: kendoFilterList },
                    openChildModal: false,
                    multiFilterLoad: false,
                };
                // const updateInfo = {
                //     typeName: DEFAULT_RETURN,
                //     data: {
                //         masterData:{...this.props.Login.masterData, searchedSample, selectedSample},
                //         openModal: false, 
                //         multiFilterLoad : false,
                //     }
                // }
                // this.props.updateStore(updateInfo);
                this.props.getsubSampleDetail(inputData, true);
            }
        }
    }
    //  End of on Save handler of Additional Filter ALPD-4132 ATE-241



    viewSample = (viewdetails) => {
        this.props.ViewPatientDetails(this.props.Login.masterData, "IDS_PREVIOUSRESULTVIEW", this.props.Login.userInfo, viewdetails);
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
            screenData: this.props.Login.screenData,
            operation: this.props.Login.operation
        }
        if (this.props.Login.operation === 'dynamic' || this.props.Login.operation === 'reportgeneration' || this.props.Login.operation === 'decision' || this.props.Login.operation === 'enforce') {
            this.props.validateEsignforApproval(inputParam, "openChildModal");
        }
        else {
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
        let { testskip, testtake } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : [...this.props.Login.masterData.AP_TEST];
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.APSelectedTest, "ntransactiontestcode");
        if (selectedTestList.length > 0) {

            if (this.props.Login.screenName === "IDS_TESTCOMMENTS") {
                let saveParam = {
                    userInfo: this.props.Login.userInfo,
                    isTestComment: this.props.isTestComment,
                    selectedRecord,
                    masterData: this.props.Login.masterData,
                    saveType, formRef,
                    operation: this.props.Login.operation,
                    ntransactiontestcode: this.props.Login.masterData.APSelectedTest ? this.props.Login.masterData.APSelectedTest.map(x => x.ntransactiontestcode).join(",") : "-1"
                }
                inputParam = onSaveTestComments(saveParam, selectedTestList);
            }
            if (this.props.Login.screenName === "IDS_SAMPLECOMMENTS") {
                let sampleList = [];
                if (this.props.Login.masterData.searchedSample !== undefined) {
                    sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.AP_SAMPLE.slice(this.state.skip, this.state.skip + this.state.take), "npreregno");
                } else {
                    sampleList = this.props.Login.masterData.AP_SAMPLE.slice(this.state.skip, this.state.skip + this.state.take);
                }
                let acceptList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.APSelectedSample, "npreregno");

                let saveParam = {
                    userInfo: this.props.Login.userInfo,
                    isTestComment: this.props.isTestComment,
                    selectedRecord,
                    masterData: this.props.Login.masterData,
                    saveType, formRef,
                    operation: this.props.Login.operation,
                    npreregno: this.props.Login.masterData.APSelectedSample ? this.props.Login.masterData.APSelectedSample.map(x => x.npreregno).join(",") : "-1"
                }
                inputParam = onSaveSampleComments(saveParam, acceptList);
            }
            if (this.props.Login.screenName === "IDS_SUBSAMPLECOMMENTS") {
                let sampleList = [];
                if (this.props.Login.masterData.searchedSubSample !== undefined) {
                    sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSubSample, this.props.Login.masterData.AP_SUBSAMPLE.slice(this.state.subSampleSkip, this.state.subSampleSkip + this.state.subSampleTake), "npreregno");
                } else {
                    sampleList = this.props.Login.masterData.AP_SUBSAMPLE.slice(this.state.subSampleSkip, this.state.subSampleSkip + this.state.subSampleTake);
                }
                let acceptList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.APSelectedSubSample, "ntransactionsamplecode");
                // let acceptList=getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.RegistrationGetTest.slice(this.state.testskip, this.state.testskip + this.state.testtake), "npreregno");

                let saveParam = {
                    userInfo: this.props.Login.userInfo,
                    isTestComment: this.props.isTestComment,
                    selectedRecord,
                    masterData: this.props.Login.masterData,
                    saveType, formRef,
                    operation: this.props.Login.operation,
                    ntransactionsamplecode: this.props.Login.masterData.APSelectedSubSample ? this.props.Login.masterData.APSelectedSubSample.map(x => x.ntransactionsamplecode).join(",") : "-1"
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

        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))
        }
    }
    onAttachmentSaveClick = (saveType, formRef, selectedRecord) => {
        const masterData = this.props.Login.masterData;
        let inputData = {}
        let inputParam = {}
        let { testskip, testtake, skip, take } = this.state
        let testList = this.props.Login.masterData.searchedTests ? [...this.props.Login.masterData.searchedTests] : [...this.props.Login.masterData.AP_TEST];
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.APSelectedTest, "ntransactiontestcode");
        let sampleList = this.props.Login.masterData.searchedSample ? [...this.props.Login.masterData.searchedSample] : [...this.props.Login.masterData.AP_SAMPLE];
        sampleList = sampleList.slice(skip, skip + take);
        let selectedSampleList = getSameRecordFromTwoArrays(sampleList, this.props.Login.masterData.APSelectedSample, "npreregno");
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
                npreregno: this.props.Login.masterData.APSelectedSample ? this.props.Login.masterData.APSelectedSample.map(x => x.npreregno).join(",") : "-1"
            }
            if (selectedSampleList.length > 0) {
                inputParam = onSaveSampleAttachment(saveParam, selectedSampleList);
            }
            else {
                ok = false
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLE" }))
            }
        }
        else if (this.props.Login.screenName === "IDS_SUBSAMPLEATTACHMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                selectedMaster: this.props.selectedMaster,
                ntransactionsamplecode: this.props.Login.masterData.APSelectedSubSample ? this.props.Login.masterData.APSelectedSubSample.map(x => x.ntransactionsamplecode).join(",") : "-1"
            }
            inputParam = onSaveSubSampleAttachment(saveParam, this.props.Login.masterData.APSelectedSubSample);
        }
        else if (this.props.Login.screenName === "IDS_TESTATTACHMENTS") {
            let saveParam = {
                userInfo: this.props.Login.userInfo,
                selectedRecord,
                masterData: this.props.Login.masterData,
                saveType, formRef,
                operation: this.props.Login.operation,
                selectedMaster: this.props.selectedMaster,
                ntransactiontestcode: this.props.Login.masterData.APSelectedTest ? this.props.Login.masterData.APSelectedTest.map(x => x.ntransactiontestcode).join(",") : "-1"
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
    getsubSampleDetail, getTestDetail, getTestChildTabDetail, performAction, updateStore, viewAttachment, checkListRecord,
    updateDecision, getRegistrationType, getRegistrationSubType, getFilterStatus, getApprovalSample, getStatusCombo,
    validateEsignCredential, crudMaster, validateEsignforApproval, getApprovalVersion, getParameterEdit, filterTransactionList,
    getSampleChildTabDetail, getAttachmentCombo, deleteAttachment, getCommentsCombo, previewSampleReport, getFilterBasedTest,
    ViewPatientDetails,getTestApprovalFilterDetails,
    generateCOAReport, getEnforceCommentsHistory, reportGenerate, getSubSampleChildTabDetail, getTestBasedCompletedBatch, updateEnforceStatus, checkReleaseRecord, getTestResultCorrection, fetchParameterDetails
})(injectIntl(Approval))