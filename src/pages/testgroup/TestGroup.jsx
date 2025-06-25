import React, { Component} from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import rsapi from '../../rsapi';
import { toast } from 'react-toastify';
import { Row, Col, Card, Button, Nav } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import 'react-perfect-scrollbar/dist/css/styles.css';
import SplitterLayout from 'react-splitter-layout';
import { faEye, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
import OrgTree from 'react-org-tree';

import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import {
    callService, crudMaster, filterTestGroup, createTree, editTree, getTestGroupDetails, sampleTypeOnChange,
    validateEsignCredential, updateStore, addSpecification, getSpecification, addComponent, changeTestCategory,
    addTestGroupTest, editTestGroupTest, getTestGroupParameter, editTestGroupParameter, addTestFile,
    editSpecFile, getSpecificationDetails, addTestGroupCodedResult, getComponentBySpecId, filterColumnData,
    viewAttachment, viewTestGroupCheckList, getTestGroupComponentDetails, filterTransactionList, reportSpecification, retireSpecification, getDataForTestMaterial,
    getMaterialCategoryBasedMaterialType, getMaterialBasedMaterialCategory, getTestGroupMaterial, getDataForEditTestMaterial, addTestGroupNumericTab, getTestGroupRulesEngineAdd,
    getEditTestGroupRulesEngine, getSelectedTestGroupRulesEngine, getParameterforEnforce, getParameterRulesEngine, getParameterResultValue, subCodedResultView, saveExecutionOrder, getPredefinedDataRulesEngine,getCopyValues,
    generateControlBasedReport,getSpecDetailsForCopy,getSpecificationComboServices,getComponentComboServices,getRulesTestComboServices,getProductComboServices,getProfileRootComboServices
} from '../../actions'
import { constructOptionList, formatInputDate, create_UUID, deleteAttachmentDropZone, filterRecordBasedOnTwoArrays, getControlMap, onDropAttachFileList, showEsign, sortData, Lims_JSON_stringify,replaceBackSlash } from '../../components/CommonScript';
import TestGroupTestTab from './TestGroupTestTab';
import AddTestGroupSpecification from './AddTestGroupSpecification';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { transactionStatus, REPORTTYPE, attachmentType, formCode, designProperties,
   // parameterType,SampleType, grade } from '../../components/Enumeration';
   // parameterType,SampleType } from '../../components/Enumeration';
    parameterType,SampleType,MaterialType , ResultEntry} from '../../components/Enumeration';
import AddTestGroupTest from './AddTestGroupTest';
import AddProfileTree from './AddProfileTree';
import SampleFilter from './SampleFilter';
import AddFile from '../testmanagement/AddFile';
import AdvFilter from '../../components/AdvFilter';
import SpecificationHistory from './SpecificationHistory';
import TestGroupSpecFile from './TestGroupSpecFile';
import SpecificationInfo from './SpecificationInfo';
import CustomTab from '../../components/custom-tabs/custom-tabs.component';
import TransationListMaster from '../../components/TransactionListMaster';

import FormTreeMenu from '../../components/form-tree-menu/form-tree-menu.component';
// import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import FormInput from '../../components/form-input/form-input.component';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';

import {
    testMoreFields, testSubFields, searchFieldList, specificationColumnList,
    addTestColumnList, editTestColumnList, specificationCopyColumnList
} from './TestGroupFields';

import EditTestGroupTest from './EditTestGroupTest';
import { ContentPanel, SearchAdd } from '../../components/App.styles';
import '../../pages/registration/registration.css';
import { ListWrapper } from '../../components/client-group.styles';
import { ProductList } from '../product/product.styled';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
// import ReactTooltip from 'react-tooltip';
import PortalModalSlideout from '../../components/portal-modal/portal-modal-slideout';
import AddTestGroupRule from './AddTestGroupRule';
import ViewSubCodedResult from './ViewSubCodedResult';
import { numberConversion, numericGrade } from '../ResultEntryBySample/ResultEntryValidation';
import ResultEntryPredefinedComments from '../ResultEntryBySample/ResultEntryPredefinedComments';
import ModalShow from '../../components/ModalShow';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';


class TestGroup extends Component {

    constructor(props) {
        super(props);
        const componentDataState = { skip: 0, take: 10 };
        const historyDataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
        const clinicalspecDataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'sgendername' }] };

        this.state = {

            selectedRecord: {},
            filterData: {},
            error: "",
            userRoleControlRights: [],
            controlMap: new Map(),
            componentDataState,
            historyDataState,
            clinicalspecDataState,
            tempFilterData: {},
            showTest: true,
            testskip: 0,
            testtake: this.props.Login.settings ? this.props.Login.settings[12] : 5,
            skipRulesEngine: 0,
            takeRulesEngine: this.props.Login.settings ? this.props.Login.settings[12] : 5,
            fixefScrollHeight: window.outerHeight - 400,
            initialVerticalWidth: "20vh",
            testView: true,
            //paneHeight:'calc(100vh - ' +window.outerHeight-847 + 'px)'
            paneHeight: 'calc(100vh -183px)',
            // isCopySpecRender: true
        }
        this.componentColumnList = [{
            "idsName":this.props.Login.genericLabel&& this.props.Login.genericLabel["Component"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode],
            "dataField": "ncomponentcode",
            "mandatoryLabel": "IDS_SELECT",
            "mandatory": true
        },
        {
            "idsName": "IDS_TEST",
            "dataField": "ntestcode",
            "mandatoryLabel": "IDS_SELECT",
            "mandatory": true
        }
    ];
        this.componentBreadcrumbs = [];
        this.breadCrumbData = [];
        this.searchRef = React.createRef();
        this.specSubField = [{ [designProperties.VALUE]: "stransdisplaystatus" },
        { [designProperties.VALUE]: "sapprovalstatus", [designProperties.COLOUR]: true }];
        this.myRef = React.createRef();

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
        return null;
    }
    

    reloadData = () => {
	//ALPD-5529--Vignesh R(06-03-2025)-->Test group screen -> Profile showing wrongly in specific scenario.
        //const filterData = this.props.Login.masterData.filterData || this.state.filterData;
        //ALPD-5547 Test Group-->Refreshing the screen causes the records to disappear from view.
        const filterData = this.state.filterData || this.props.Login.masterData.filterData;
        if (filterData.nsampletypecode === undefined) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SAMPLETYPENOTAVAILABLE" }));
        }
        else if (filterData.nproductcatcode === "") {
            if (filterData.nsampletypecode.item.nformcode === formCode.PRODUCTCATEGORY) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PRODUCTCATEGORYNOTAVAILABLE" }));
            } else if (filterData.nsampletypecode.item.nformcode === formCode.INSTRUMENTCATEGORY) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORYNOTAVAILABLE" }));
            } else if (filterData.nsampletypecode.item.nformcode === formCode.MATERIALCATEGORY) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_MATERIALCATEGORYNOTAVAILABLE" }));
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_CATEGORYNOTAVAILABLE" }));
            }
        }
        else if (filterData.nproductcode === "" && (filterData.nproductcatcode.item.ncategorybasedflow === transactionStatus.NO)) {
            if (filterData.nsampletypecode.item.nformcode === formCode.PRODUCTCATEGORY && filterData.nsampletypecode.item.ncategorybasedflowrequired === transactionStatus.NO ) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PRODUCTNOTAVAILABLE" }));
            } else if (filterData.nsampletypecode.item.nformcode === formCode.INSTRUMENTCATEGORY) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_INSTRUMENTNOTAVAILABLE" }));
            } else if (filterData.nsampletypecode.item.nformcode === formCode.MATERIALCATEGORY) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_MATERIALNOTAVAILABLE" }));
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PRODUCTNOTAVAILABLE" }));
            }
        } else if (filterData.ntreeversiontempcode === "") {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_STUDYPLANTEMPLATEISNOTAVAILABLE" }));
        }
        else {
            const inputParam = {
                inputData: {
                    userinfo: this.props.Login.userInfo,
                    nsampletypecode: filterData.nsampletypecode.item["nsampletypecode"],
                    nproductcatcode: filterData.nproductcatcode.item["nproductcatcode"],
                 //   nproductcode: filterData.nproductcode.item["nproductcode"],
                    nproductcode: filterData.nsampletypecode.item.ncategorybasedflowrequired === transactionStatus.YES ? -1 :
                    filterData.nproductcatcode.item.ncategorybasedflow === transactionStatus.YES ? -1 : filterData.nproductcode ? filterData.nproductcode.value : -1,
                    ntreeversiontempcode: filterData.ntreeversiontempcode.item["ntreeversiontempcode"],
                    nprojectmastercode: filterData.nprojectmastercode !== undefined ? filterData.nprojectmastercode.item["nprojectmastercode"]:-1,
                    filterData,//: { ...this.props.Login.masterData.filterData }
                },
                historyDataState: this.state.historyDataState

            }
            this.props.filterTestGroup(inputParam, this.props.Login.masterData, this.searchRef);
        }
    }

    componentDidMount() {
        if (this.parentHeight) {
            const height = this.parentHeight.clientHeight;
            this.setState({
                parentHeight: height - 50
            });
        }
    }
    
    // shouldComponentUpdate (nextProps,nextState) {  
    //     if(this.props.Login.operation==="copy" && nextProps.Login.openModal === false && this.state.isCopySpecRender === false){
    //         this.setState({ isCopySpecRender: true});
    //         return true;
    //     }
    //     if (this.props.Login.screenName === 'IDS_SPECIFICATION'
    //         &&nextState.isCopySpecRender===false
    //         // &&(nextState.selectedRecord.selectedCopyNodeManipulationCode !==this.state.selectedRecord.selectedCopyNodeManipulationCode)
    //         ) {
    //         return false;
    //       }
    //       else{
    //         return true;
    //       }
    // }
    render() {
        
        console.log("Screen Name need",this.props.Login.screenName);
        const { TestGroupSpecification, SelectedSpecification, SelectedTest, OpenNodes, selectedNode, FocusKey,
            ActiveKey, SelectedComponent, TestGroupTest, TestGroupSpecSampleType, searchedData,
            TestGroupTestParameter, CopyOpenNodes } = this.props.Login.masterData;
        // const CopyOpenNodes = this.props.Login.masterData.OpenNodes;
        // const deleteTree = {
        //     methodUrl: "Tree", operation: "delete", inputParam: this.props.Login.inputParam,
        //     userInfo: this.props.Login.userInfo, screenName: "IDS_TREE"
        // };
        if (this.props.Login.masterData && this.props.Login.masterData.AgaramTree && this.props.Login.masterData.AgaramTree.length > 0) {
         this.props.Login.masterData.AgaramTree[0]["label"] = this.props.Login.masterData.AgaramTree[0]["label"] === 'root' ? 
         this.props.intl.formatMessage({ id: "IDS_ROOT" }) : this.props.Login.masterData.AgaramTree[0]["label"];
        }
        //ALPD-5173 French Lang : Test Group screen -> While select the sample type, root name is changed into English lang.
       if (this.props.Login.masterData && this.props.Login.masterData.selectedRecordCopy !==undefined && this.props.Login.masterData.selectedRecordCopy &&
          this.props.Login.masterData.selectedRecordCopy.AgaramTree !==undefined && this.props.Login.masterData.selectedRecordCopy.AgaramTree.length > 0) {
          this.props.Login.masterData.selectedRecordCopy.AgaramTree[0]["label"] = this.props.Login.masterData.selectedRecordCopy.AgaramTree[0]["label"] === 'root' ? 
          this.props.intl.formatMessage({ id: "IDS_ROOT" }) : this.props.Login.masterData.selectedRecordCopy.AgaramTree[0]["label"];
        }
      //  const testGroupTestData = searchedData || TestGroupTest || []

        if (TestGroupTestParameter) {
            sortData(TestGroupTestParameter, "ascending", "nsorter");
        }
        // ALPD-3242 Commented sortData as tests are sorted unnecessarily everytime while clicking on the test in the tab
        // if (testGroupTestData) {
        //     sortData(testGroupTestData, "descending", "nsorter");
        // }

        const getComponent = {
            screenName:this.props.Login.genericLabel && this.props.Login.genericLabel["Component"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], operation: "get", inputParam: this.props.Login.inputParam,
            userInfo: this.props.Login.userInfo, methodUrl: "TestGroupComponent", keyName: "testgroupspecification"
        };
        const addSpecParam = { testgroupspecification: SelectedSpecification, selectedRecord: this.state.filterData, userInfo: this.props.Login.userInfo, selectedNode };
        const editSpecParam = { selectedRecord: this.state.filterData, userinfo: this.props.Login.userInfo, selectedNode };
        const specDeleteParam = { operation: "delete", methodUrl: "Specification", screenName: "IDS_SPECIFICATION", keyName: "testgroupspecification", filterData: this.state.filterData };
        const addSpecId = this.state.controlMap.has("AddSpecification") && this.state.controlMap.get("AddSpecification").ncontrolcode;
        const addTreeId = this.state.controlMap.has("AddTree") && this.state.controlMap.get("AddTree").ncontrolcode;
        const editTreeId = this.state.controlMap.has("EditTree") && this.state.controlMap.get("EditTree").ncontrolcode;
        const deleteTreeId = this.state.controlMap.has("DeleteTree") && this.state.controlMap.get("DeleteTree").ncontrolcode;
        const editSpecId = this.state.controlMap.has("EditSpecification") && this.state.controlMap.get("EditSpecification").ncontrolcode;
        const deleteSpecId = this.state.controlMap.has("DeleteSpecification") && this.state.controlMap.get("DeleteSpecification").ncontrolcode;
        const addComponentId = this.state.controlMap.has("AddComponent") && this.state.controlMap.get("AddComponent").ncontrolcode;
        const deleteComponentId = this.state.controlMap.has("DeleteComponent") && this.state.controlMap.get("DeleteComponent").ncontrolcode;
        const addTestId = this.state.controlMap.has("AddTest") && this.state.controlMap.get("AddTest").ncontrolcode;
        const deleteTestId = this.state.controlMap.has("DeleteTest") && this.state.controlMap.get("DeleteTest").ncontrolcode;
        const editTestId = this.state.controlMap.has("EditTest") && this.state.controlMap.get("EditTest").ncontrolcode;
        const viewFileId = this.state.controlMap.has("ViewTestFile") && this.state.controlMap.get("ViewTestFile").ncontrolcode;
        const confirmMessage = new ConfirmMessage();

        const deleteTree = {
            methodUrl: "Tree", operation: "delete", inputParam: this.props.Login.inputParam,
            userInfo: this.props.Login.userInfo, screenName: "IDS_TREE", ncontrolCode: deleteTreeId, filterData: this.state.filterData
        };

        const getTest = {
            screenName: "IDS_TEST", operation: "get", masterData: this.props.Login.masterData,
            userInfo: this.props.Login.userInfo, methodUrl: "TestGroupTest", keyName: "ntestgrouptestcode"
        };
        const filterParam = {
            testskip: 0, testtake: this.props.Login.settings ? this.props.Login.settings[12] : 5,
            inputListName: "TestGroupTest", selectedObject: "SelectedTest", primaryKeyField: "ntestgrouptestcode",
            fetchUrl: "testgroup/getTestGroupTest", fecthInputObject: { userinfo: this.props.Login.userInfo }, masterData: this.props.Login.masterData,
            searchFieldList, changeList: ["TestGroupTestFormula", "TestGroupTestNumericParameter",
                "TestGroupTestPredefinedParameter", "TestGroupTestCharParameter", "TestGroupTestParameter"], isSingleSelect: true
        };
        const filterParamRulesEngine = {
            skipRulesEngine: 0, takeRulesEngine: this.props.Login.settings ? this.props.Login.settings[12] : 5,
            inputListName: "RulesEngine", selectedObject: "SelectedRulesEngine", primaryKeyField: "ntestgrouprulesenginecode",
            fetchUrl: "testgrouprulesengine/getSelectedTestGroupRulesEngine", fecthInputObject: { userinfo: this.props.Login.userInfo
                ,ntestgrouptestcode:this.props.Login.masterData.SelectedTest&&this.props.Login.masterData.SelectedTest.ntestgrouptestcode }, masterData: this.props.Login.masterData,
            'searchFieldList':["srulename","stransdisplaystatus" 
        ], changeList: [],  isSingleSelect: true
        };
        const specMandatoryFields = [];
        //ALPD-4962 Test group screen -> while copy the spec and in spec name field without giving anything & save it blank page occurs.
        const specCopyMandatoryFields = [];
        const compMandatoryFields = [];
        const editTestMandatoryFields = [];
        const addTestMandatoryFields = [];
        specificationColumnList.forEach(item => item.mandatory === true ?
            specMandatoryFields.push(item) : ""
        );
        //ALPD-4944, Added specCopyMandatoryFields to check mandatory fields for copy spec
        //ALPD-4962 Test group screen -> while copy the spec and in spec name field without giving anything & save it blank page occurs.
        specificationCopyColumnList.forEach(item => item.mandatory === true ? 
            specCopyMandatoryFields.push(item) : ""
        );
        this.componentColumnList.forEach(item => item.mandatory === true ?
            compMandatoryFields.push(item) : ""
        );
        editTestColumnList.forEach(item => item.mandatory === true ?
            editTestMandatoryFields.push(item) : ""
        );
        addTestColumnList.forEach(item => item.mandatory === true ?
            addTestMandatoryFields.push(item) : ""
        );

        if (this.props.Login.masterData && Object.values(this.props.Login.masterData).length > 0) {
            if (selectedNode && selectedNode.sleveldescription) {
                const splitNode = this.props.Login.masterData.ActiveKey.split('/');
                let treeNodeNames = [];
                splitNode.forEach(nodeItem => {
                    this.props.Login.masterData.TreeTemplateManipulation.forEach(treeItem => {
                        if (treeItem.ntemplatemanipulationcode === parseInt(nodeItem))
                            treeNodeNames.push(treeItem.sleveldescription);
                    })
                })
                this.componentBreadcrumbs = treeNodeNames;
                if (SelectedSpecification && SelectedSpecification !== null && SelectedSpecification.sspecname) {
                    this.componentBreadcrumbs.push(SelectedSpecification.sspecname);
                    if (SelectedComponent && SelectedComponent !== null && SelectedComponent.ncomponentcode !== -1) {
                        // this.componentBreadcrumbs[2] = this.props.intl.formatMessage({ id: "IDS_COMPONENT" }) + ": " + SelectedComponent.scomponentname;
                        this.componentBreadcrumbs.push(SelectedComponent.scomponentname);
                    } else {
                        // delete this.componentBreadcrumbs[2];
                    }
                } else {
                    // delete this.componentBreadcrumbs[1];
                }
            } else {
                this.componentBreadcrumbs = [];
                // delete this.componentBreadcrumbs[0];
            }
        }

        this.confirmMessage = new ConfirmMessage();



        //New Design
        const specDesign =
            <>
                {this.componentBreadcrumbs && this.componentBreadcrumbs.length > 0 &&
                    <div className="component_breadcrumbs">
                        <ul>
                            {this.componentBreadcrumbs.map((item) => {
                                return <li>{item}</li>
                            })}
                        </ul>
                    </div>
                }

                <ContentPanel hidden={this.state.showTest} className='mr-2'>
                    <div className='card_group'>
                        <Card>
                            <Card.Header>
                                <span style={{ display: "inline-block", marginTop: "1%" }} >
                                    <h4>{this.props.intl.formatMessage({ id: "IDS_SPECIFICATIONINFO" })}</h4>
                                </span>
                                {/* <button className="btn btn-primary" style={{ float: "right" }}
                                    onClick={() => this.showSpecAndTestInfo()}>
                                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>{"  "}
                                    {this.props.intl.formatMessage({ id: "IDS_TEST" })}
                                </button> */}
                                <button className="btn btn-primary" style={{ float: "right", marginRight: "1rem" }}
                                    onClick={() => this.showSpecAndTestInfo1()}>
                                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>{"  "}
                                    {this.props.intl.formatMessage({ id: "IDS_TEST" })}
                                </button>
                            </Card.Header>
                            <Card.Body>
                                <SpecificationInfo
                                    genericLabel={this.props.Login.genericLabel}                             
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    selectedSpecification={this.props.Login.masterData.SelectedSpecification}
                                    userInfo={this.props.Login.userInfo}
                                    selectedNode={this.props.Login.masterData.selectedNode}
                                    selectedRecord={this.state.filterData}
                                    approvalRoleActionDetail={this.props.Login.masterData.ApprovalRoleActionDetail}
                                    screenName="IDS_SPECIFICATIONINFO"
                                    deleteRecord={this.deleteRecord}
                                    addSpecification={this.props.addSpecification}
                                    filterData={this.state.filterData}
                                    //completeSpecification={this.completeSpecification}
                                    completeSpecification={this.validateTestGroupComplete}
                                    approveSpecification={this.approveSpecification}
                                    specificationReport={this.onDownloadClick}
                                    retireSpec={this.retireSpec}
                                    masterData={this.props.Login.masterData}

                                />
                            </Card.Body>
                        </Card>
                    </div>

                        <div>
                            <CustomTab tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                        </div>
                </ContentPanel>
            </>


        const testDesign = <Card>
            <Card.Header className='sm-header'>
                <h4 className='spec-info-title' data-tip={ this.props.intl.formatMessage({ id: "IDS_TEST" }) }>{this.props.intl.formatMessage({ id: "IDS_TEST" })}</h4>
                <button className="btn btn-primary" style={{ position: "absolute", right: "7px", top: "7px" }}
                    onClick={() => this.showSpecAndTestInfo()}>
                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>{"  "}
                    {this.props.intl.formatMessage({ id: "IDS_SPECINFO" })}
                </button>
            </Card.Header>
            <Card.Body className={this.state.testView ? 'p-0' : 'no-pad-t'}>
                <TransactionListMasterJsonView
                    cardHead={167}
                    componentBreadcrumbs={this.breadCrumbData ? this.breadCrumbData.length > 0 ? true : false : false}
                    // notSearchable={false}
                    masterList={searchedData || TestGroupTest || []}
                    //selectedMaster={[SelectedTest]}
                    clickIconGroup={true}
                    selectedMaster={SelectedTest !== undefined ? [SelectedTest] : undefined}
                    primaryKeyField="ntestgrouptestcode"
                    getMasterDetail={this.props.getTestGroupDetails}
                    inputParam={getTest}
                    additionalParam={[]}
                    mainField="stestname"
                    selectedListName="SelectedTest"
                    objectName="testgrouptest"
                    listName="IDS_TEST"
                    showStatusLink={true}
                    statusFieldName="stransdisplaystatus"
                    statusField="ntransactionstatus"
                    subFields={testSubFields}
                   // moreField={testMoreFields}
                   moreField={this.TestGroupMorefields(testMoreFields)}
                    needValidation={false}
                    needFilter={false}
                    filterColumnData={this.props.filterTransactionList}
                    searchListName="searchedData"
                    searchRef={this.searchRef}
                    hidePaging={false}
                    filterParam={filterParam}
                    handlePageChange={this.handlePageChange}
                    skip={this.state.testskip}
                    take={this.state.testtake}
                    pageSize={this.props.Login.settings && this.props.Login.settings[13].split(",").map(setting => parseInt(setting))}
                    actionIcons={
                        [
                            {
                                title: this.props.intl.formatMessage({ id: "IDS_VIEW" }),
                                controlname: "faCloudDownloadAlt",
                                objectName: "selectedTest",
                                hidden: this.state.userRoleControlRights.indexOf(viewFileId) === -1,
                                inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo },
                                onClick: (props) => this.viewTestFile(props),
                                needConditionalIcon: true,
                                conditionalIconFunction: this.fileViewIcon
                            },
                            {
                                title: this.props.intl.formatMessage({ id: "IDS_VIEW" }),
                                controlname: "faExternalLinkAlt",
                                objectName: "selectedTest",
                                hidden: this.state.userRoleControlRights.indexOf(viewFileId) === -1,
                                inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo },
                                onClick: (props) => this.viewTestFile(props),
                                needConditionalIcon: true,
                                conditionalIconFunction: this.linkViewIcon
                            },
                            {
                                title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                controlname: "faPencilAlt",
                                objectName: "testgroupspecification",
                                hidden: this.state.userRoleControlRights.indexOf(editTestId) === -1,
                                inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo },
                                onClick: (props) => this.props.editTestGroupTest("update", props.SelectedTest[0], this.props.Login.userInfo, editTestId, SelectedSpecification, this.state.filterData, props.masterData)
                            },
                            {
                                title: this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                controlname: "faTrashAlt",
                                objectName: "testgrouptest",
                                hidden: this.state.userRoleControlRights.indexOf(deleteTestId) === -1,
                                inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo },
                                onClick: (props) => confirmMessage.confirm(
                                    "deleteMessage",
                                    this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                    this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
                                    this.props.intl.formatMessage({ id: "IDS_OK" }),
                                    this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                                    () => this.deleteTest({ props, ncontrolCode: deleteTestId, filterData: this.state.filterData })
                                )
                            }
                        ]
                    }
                    commonActions={
                        <>

                            <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                hidden={this.state.userRoleControlRights.indexOf(addTestId) === -1}
                                data-tip={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                // data-for="tooltip-list-wrap"
                                onClick={() => this.props.addTestGroupTest(SelectedComponent, this.props.Login.userInfo, addTestId, SelectedSpecification, this.state.filterData, this.props.Login.masterData)}>
                                <FontAwesomeIcon icon={faPlus} title={this.props.intl.formatMessage({ id: "IDS_ADD" })} />
                            </Button>
                        </>
                    }
                />
            </Card.Body>
        </Card>

        const paramDesign =
            <>
                <ContentPanel hidden={!this.state.showTest} className="grouped-param">
                    <Card>
                        {/* <Card.Header className='sm-header'>
                            <span style={{ display: "inline-block" }} >
                                <h4>{this.props.intl.formatMessage({ id: "IDS_ADDPARAMETER" })}</h4>
                            </span>
                        </Card.Header> */}
                        {/* {TestGroupTestParameter && TestGroupTestParameter.length > 0 && */}
                        {/* <PerfectScrollbar> */}
                       
                        <TestGroupTestTab
                            paneHeight={this.state.paneHeight}
                            testView={this.state.testView}
                            isrulesenginerequired={this.props.Login.masterData.isrulesenginerequired&&
                                this.props.Login.masterData.isrulesenginerequired===transactionStatus.YES?true:false}
                            masterData={this.props.Login.masterData}
                            inputParam={this.props.Login.inputParam}
                            userInfo={this.props.Login.userInfo}
                            userRoleControlRights={this.state.userRoleControlRights}
                            esignRights={this.props.Login.userRoleControlRights}
                            screenName={this.props.Login.screenName}
                            openChildModal={this.props.Login.openChildModal}
                            operation={this.props.Login.operation}
                            loadEsign={this.props.Login.loadEsign}
                            testGroupInputData={this.props.Login.testGroupInputData}
                            parameterData={this.props.Login.parameterData}  
                            selectedRecord={this.state.selectedRecord}
                            selectedsubcodedresult={this.state.selectedsubcodedresult || []}
                            selectsubcodedelete={this.state.selectsubcodedelete}
                            screenData={this.props.Login.screenData}
                            ncontrolCode={this.props.Login.ncontrolCode}
                            controlMap={this.state.controlMap}
                            testGroupCheckList={this.props.Login.testGroupCheckList}
                            openTemplateModal={this.props.Login.openTemplateModal}
                            editTestGroupTest={this.props.editTestGroupTest}
                            updateStore={this.props.updateStore}
                            crudMaster={this.props.crudMaster}
                            getTestGroupParameter={this.props.getTestGroupParameter}
                            editTestGroupParameter={this.props.editTestGroupParameter}
                            filterData={this.state.filterData}
                            addTestGroupCodedResult={this.props.addTestGroupCodedResult}
                            subCodedResultView={this.props.subCodedResultView}
                            addTestGroupNumericTab={this.props.addTestGroupNumericTab}
                            validateEsignCredential={this.props.validateEsignCredential}
                            filterColumnData={this.props.filterColumnData}
                            viewTestGroupCheckList={this.props.viewTestGroupCheckList}
                            getDataForTestMaterial={this.props.getDataForTestMaterial}
                            materialType={this.props.Login.materialType}
                            getMaterialCategoryBasedMaterialType={this.props.getMaterialCategoryBasedMaterialType}
                            materialCategoryList={this.props.Login.materialCategoryList}
                            materialList={this.props.Login.materialList}
                            getMaterialBasedMaterialCategory={this.props.getMaterialBasedMaterialCategory}
                            getTestGroupMaterial={this.props.getTestGroupMaterial}
                            getDataForEditTestMaterial={this.props.getDataForEditTestMaterial}
                            dataState={this.state.clinicalspecDataState}
                            dataStateChange={this.specDataStateChange}
                            getTestGroupRulesEngineAdd={this.getTestGroupRulesEngineAdd}
                            settings={this.props.Login.settings}
                            skip={this.state.testskip}
                            take={this.state.testtake}
                            getEditTestGroupRulesEngine={this.props.getEditTestGroupRulesEngine}
                            getSelectedTestGroupRulesEngine={this.props.getSelectedTestGroupRulesEngine}
                            ConfirmDeleteRule={this.ConfirmDeleteRule}
                            approveVersion={(masterdata, nflag) => this.approveVersion(masterdata, nflag)}
                            openflowview={(props)=>this.openflowview(props)}
                            handlePageChangeRuleEngine={(event) => this.handlePageChangeRuleEngine(event)}
                            skipRulesEngine={this.state.skipRulesEngine}
                            takeRulesEngine={this.state.takeRulesEngine}
                            viewOutcome={ (props)=>this.viewOutcome(props)}
                            filterParamRulesEngine={ filterParamRulesEngine}
                            filterTransactionList={this.props.filterTransactionList} 
                            saveExecutionOrder={(props)=>this.props.saveExecutionOrder(props,this.props.Login.masterData,this.props.Login.userInfo)} 
                            //ALPD-4984--Added by Vignesh R(10-04-2025)-->Test group: Copy Rules engine
							copyVersion={(masterData,ncontrolCode) => this.props.getCopyValues(masterData,ncontrolCode,this.props.Login.userInfo,this.state.filterData)} 
                            getProductCategory={this.props.Login.getProductCategory||[]}
                            getSpecificationList={this.props.Login.getSpecificationList ||[]}
                            getComponentList={this.props.Login.getComponentList||[]}
                            getProductList={this.props.Login.getProductList||[]}
                            getProfileRoot={this.props.Login.getProfileRoot||[]}
                            getComponentComboServices={(methodparam)=>this.props.getComponentComboServices(methodparam)}
                            getSpecificationComboServices={(methodparam)=>this.props.getSpecificationComboServices(methodparam)}
                            getRulesTestComboServices={(methodparam)=>this.props.getRulesTestComboServices(methodparam)}
                            getProductComboServices={(methodparam)=>this.props.getProductComboServices(methodparam)}
                            getProfileRootComboServices={(methodparam)=>this.props.getProfileRootComboServices(methodparam)}
                            getRulesList={this.props.Login.getRulesList||[]}
                           
                        />
                        {/* </PerfectScrollbar>
                     } */}
                    </Card>
                </ContentPanel>
            </>

        const mainDesign =
            <SplitterLayout
                customClassName={this.state.testView ? "detailed-inner" : "detailed-inner no-height "}
                vertical={this.state.testView ? false : true}
                borderColor="#999"
                primaryIndex={1}
                percentage={true}
                //secondaryInitialSize={this.state.testView ? 600 : this.state.fixefScrollHeight}
                secondaryInitialSize={37}
                primaryMinSize={30}
                secondaryMinSize={37}
            >
                {testDesign}{paramDesign}
            </SplitterLayout >


        // const testDesign = this.state.testView ?
        //     <SplitterLayout
        //         customClassName="detailed-inner"
        //         borderColor="#999"
        //         primaryIndex={1}>
        //         {tempDesign}{paramDesign}
        //     </SplitterLayout>
        //     :
        //     <SplitterLayout
        //         customClassName="detailed-inner no-height"
        //         vertical
        //         borderColor="#999"
        //         primaryIndex={1}
        //         // onSecondaryPaneSizeChange={this.verticalPaneSizeChange}
        //         secondaryInitialSize={this.state.fixefScrollHeight}
        //     >
        //         <ContentPanel>
        //             {tempDesign}
        //         </ContentPanel>

        //         {paramDesign}
        //     </SplitterLayout>

        return (
            <>
                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip-list-wrap" /> */}
                {/* screen-height-window active_seperator */}
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    {this.breadCrumbData && this.breadCrumbData.length > 0 &&
                        <BreadcrumbComponent
                            breadCrumbItem={this.breadCrumbData}
                        />}
                    <Row noGutters>
                        <Col md={12} className="parent-port-height sticky_head_parent" ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            <SplitterLayout
                                borderColor="#999"
                                primaryIndex={1}
                                percentage={true}
                                secondaryInitialSize={30}
                            //customClassName="fixed_list_height"
                            >
                                <div className={`${this.state.showModalBg ? 'show_modal_bg fixed_list_height' : 'fixed_list_height'}`}>
                                    <div className="sticky_head">
                                        <SearchAdd className="border fixed_ico_list title_grp_custom">
                                            <h4>{this.props.intl.formatMessage({ id: "IDS_PROFILETREE" })}</h4>
                                            <div className="icon_group_right_aligned">
                                                <AdvFilter
                                                    filterComponent={[{
                                                        "IDS_SAMPLEFILTER":
                                                            <SampleFilter
                                                                genericLabel={this.props.Login.genericLabel}
                                                                userInfo={this.props.Login.userInfo} 
                                                                sampleType={this.state.sampleType}
                                                                treeVersionTemplate={this.state.treeVersionTemplate}
                                                                productCategory={this.state.productCategory}
                                                                product={this.state.product}
                                                                projectType={this.state.projectType}
                                                                project={this.state.project}
                                                                onFilterComboChange={this.onFilterComboChange}
                                                                tempFilterData={this.state.tempFilterData}
                                                            >
                                                            </SampleFilter>,
                                                        needActionStrip: false
                                                    }]}
                                                    onFilterSubmit={this.onFilterSumbit}
                                                    showModalBg={(e) => this.setState({ showModalBg: e })}
                                                />

                                                <ProductList className="d-flex product-category float-right icon-group-wrap">
                                                    {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                    <Button className="btn btn-icon-rounded btn-circle solid-blue mr-1" role="button"
                                                        hidden={this.state.userRoleControlRights.indexOf(addTreeId) === -1}
                                                        onClick={() => this.props.createTree(this.state.filterData, this.props.Login.userInfo, this.props.Login.masterData, addTreeId)}
                                                        data-tip={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                    //  data-for="tooltip-list-wrap"
                                                    >
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </Button>

                                                    <Nav.Link className="btn btn-circle outline-grey mr0 mr-1" name="edittestname"
                                                        hidden={this.state.userRoleControlRights.indexOf(editTreeId) === -1}
                                                        data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                        //  data-for="tooltip-list-wrap"
                                                        onClick={() => this.props.editTree("update", selectedNode, this.props.Login.userInfo, editTreeId, this.state.filterData,
                                                            this.props.Login.masterData)}>
                                                        <FontAwesomeIcon icon={faPencilAlt} />
                                                    </Nav.Link>
                                                    <Nav.Link name="deleteLink"
                                                        hidden={this.state.userRoleControlRights.indexOf(deleteTreeId) === -1}
                                                        data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                        // data-for="tooltip-list-wrap"
                                                        className="btn btn-circle outline-grey "
                                                        onClick={() => this.ConfirmDelete({ ...deleteTree })}>
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                        {/* <ConfirmDialog
                                                            name="deleteMessage"
                                                            message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                            doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                            doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                            icon={faTrashAlt}
                                                            title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            hidden={this.state.userRoleControlRights.indexOf(deleteTreeId) === -1}
                                                            handleClickDelete={() => this.deleteRecord({ ...deleteTree })}
                                                        /> */}
                                                    </Nav.Link>
                                                    <Button className="btn btn-circle outline-grey ml-1 p-0" variant="link"
                                                        onClick={() => this.reloadData()}
                                                        // data-for="tooltip-list-wrap"
                                                        data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                            <RefreshIcon className='custom_icons'/>
                                                    </Button>
                                                    {/* </Tooltip> */}
                                                </ProductList>

                                            </div>
                                        </SearchAdd>
                                    </div>
                                    <div className="sticky_head_scroll_body" style={{ "height": this.state.parentHeight }}>
                                        <PerfectScrollbar>
                                            <FormTreeMenu
                                                data={this.props.Login.masterData.AgaramTree}
                                                hasSearch={false}
                                                handleTreeClick={this.onTreeClick}
                                                initialOpenNodes={OpenNodes}
                                                focusKey={FocusKey || ""}
                                                activeKey={ActiveKey || ""}
                                            />
                                            <TransationListMaster
                                                notSearchable={true}
                                                titleHead={this.props.intl.formatMessage({ id: "IDS_SPECIFICATION" })}
                                                titleClasses="title_grp_custom fixed_ico_list"
                                                masterList={TestGroupSpecification || []}
                                                selectedMaster={[SelectedSpecification]}
                                                needMultiSelect={false}
                                                primaryKeyField="nallottedspeccode"
                                                getMasterDetail={(spec) => this.props.getComponentBySpecId({ ...getComponent, selectedRecord: spec, historyDataState: this.state.historyDataState }, this.props.Login.masterData, this.searchRef)}
                                                mainField="sspecname"
                                                selectedListName="testgroupspecification"
                                                objectName="testgroupspecification"
                                                listName="IDS_SPECIFICATION"
                                                onFilterSumbit={this.onFilterSumbit}
                                                subFields={this.specSubField}
                                                actionIcons={
                                                    [
                                                        {
                                                            title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                                            controlname: "faPencilAlt",
                                                            objectName: "testgroupspecification",
                                                            hidden: this.state.userRoleControlRights.indexOf(editSpecId) === -1,
                                                            inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo },
                                                            onClick: (props) => this.props.addSpecification("update", { ...editSpecParam, ...props }, editSpecId)
                                                        },
                                                        {
                                                            title: this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                            controlname: "faTrashAlt",
                                                            objectName: "testgroupspecification",
                                                            hidden: this.state.userRoleControlRights.indexOf(deleteSpecId) === -1,
                                                            inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo },
                                                            onClick: (props) => confirmMessage.confirm(
                                                                "deleteMessage",
                                                                this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                                this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
                                                                this.props.intl.formatMessage({ id: "IDS_OK" }),
                                                                this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                                                                () => this.deleteSpecRecord({ props, ...specDeleteParam, selectedRecord: SelectedSpecification, ncontrolCode: deleteSpecId })
                                                            )
                                                        }
                                                    ]
                                                }
                                                needFilter={false}
                                                commonActions={
                                                    <>
                                                        {/* <ReactTooltip place="bottom" /> */}
                                                        <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                            hidden={this.state.userRoleControlRights.indexOf(addSpecId) === -1}
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                            //  data-for="tooltip-list-wrap"
                                                            onClick={() => this.props.addSpecification("create", { ...addSpecParam }, addSpecId, this.props.Login.masterData)}>
                                                            <FontAwesomeIcon icon={faPlus}
                                                            // title={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                            />
                                                        </Button>
                                                    </>
                                                }
                                                hideSearch={false}
                                                hidePaging={true}
                                            />
										{/*//ALPD-5529--Vignesh R(06-03-2025)-->Test group screen -> Profile showing wrongly in specific scenario.*/}
                                        { this.props.Login.masterData.filterData && this.props.Login.masterData.filterData.nproductcatcode.item.nmaterialtypecode === MaterialType.IQCSTANDARDMATERIALTYPE ? "" :
                                            //{
                                            SelectedSpecification && SelectedSpecification.ncomponentrequired === transactionStatus.YES &&
                                              
                                                <TransationListMaster
                                                    notSearchable={true}
                                                    titleHead={this.props.Login.genericLabel && this.props.Login.genericLabel["Component"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode]}
                                                    titleClasses="title_grp_custom fixed_ico_list"
                                                    masterList={TestGroupSpecSampleType || []}
                                                    selectedMaster={[SelectedComponent]}
                                                    needMultiSelect={false}
                                                    primaryKeyField="nspecsampletypecode"
                                                    getMasterDetail={(event) => this.componentRowClick(event)}
                                                    mainField="scomponentname"
                                                    selectedListName="testgroupspecsampletype"
                                                    objectName="testgroupspecsampletype"
                                                    listName={this.props.Login.genericLabel && this.props.Login.genericLabel["Component"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] }
                                                    actionIcons={
                                                        [
                                                            {
                                                                title: this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                                // data-tip={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                                controlname: "faTrashAlt",
                                                                objectName: "testgroupspecsampletype",
                                                                hidden: this.state.userRoleControlRights.indexOf(deleteComponentId) === -1,
                                                                inputData: { masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo },
                                                                onClick: (props) => confirmMessage.confirm(
                                                                    "deleteMessage",
                                                                    this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                                    this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
                                                                    this.props.intl.formatMessage({ id: "IDS_OK" }),
                                                                    this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                                                                    () => this.deleteMultipleRecord({ props, ncontrolCode: deleteComponentId })
                                                                )
                                                            }
                                                        ]
                                                    }
                                                    commonActions={
                                                        <>
                                                            {/* <ReactTooltip place="bottom" /> */}
                                                            <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                                hidden={this.state.userRoleControlRights.indexOf(addComponentId) === -1}
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                                //  data-for="tooltip-list-wrap"
                                                                // title={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                                onClick={() => this.props.addComponent(SelectedSpecification, this.props.Login.userInfo, addComponentId, {...this.props.Login.masterData,nsampletypecode:this.state.filterData.nsampletypecode},this.props.Login.genericLabel)}>
                                                                <FontAwesomeIcon icon={faPlus}
                                                                // title={this.props.intl.formatMessage({ id: "IDS_ADD" })} 
                                                                />
                                                            </Button>

                                                        </>
                                                    }
                                                    hidePaging={true}
                                                />
                                                //}
                                            }
                                        </PerfectScrollbar>
                                    </div>
                                </div>
                                <>
                                    {this.state.testView ?
                                        <>
                                            {specDesign}
                                            {this.state.showTest ?
                                                <div>
                                                    {mainDesign}
                                                </div>
                                                : ""}
                                        </>
                                        :
                                        <PerfectScrollbar>
                                            {specDesign}
                                            {this.state.showTest ?
                                                <div>
                                                    {mainDesign}
                                                </div>
                                                : ""}
                                        </PerfectScrollbar>
                                    }


                                </>
                            </SplitterLayout>
                        </Col>
                    </Row>
                </ListWrapper>



                <ModalShow
                    modalShow={this.props.Login.showAlertGrid 
                    }
                    modalTitle={  this.props.Login.showParameterGrid ? "IDS_VIEWPARAMETER":
                        this.props.Login.showAlertForPredefined||
                        this.props.Login.additionalInfoView?this.props.intl.formatMessage({ id: "IDS_ADDITIONALINFOREQURIED" }) 
                     :''}  
                    closeModal={this.closeModalShowPredefAlert}
                    onSaveClick ={this.onModalSavePredefAlert}
                    removeCancel={this.props.Login.showParameterGrid?false:this.props.Login.showAlertForPredefined||this.props.Login.additionalInfoView?true:false}
                    needSubmit={this.props.Login.showParameterGrid?false:this.props.Login.showAlertForPredefined||this.props.Login.additionalInfoView?true:false}
                    needSave={this.props.Login.showParameterGrid?true:
                        this.props.Login.showAlertForPredefined||this.props.Login.additionalInfoView?"":true}
                    selectedRecord={this.state.selectedRecord || {}}  
                    size={ this.props.Login.showParameterGrid?"lg":
                        this.props.Login.showAlertForPredefined||this.props.Login.additionalInfoView?"":'lg'}
                    showAlertMsg={this.props.Login.showAlertForPredefined?true:false}
                    modalBody={ 
                              this.props.Login.showParameterGrid?
                               <DataGrid
                                       key="testsectionkey"
                                       primaryKeyField="ntestgrouptestparametercode" 
                                       dataResult={this.props.Login.masterData.ParameterRulesEngine && process(
                                               sortData(this.props.Login.masterData.ParameterRulesEngine,
                                                "descending", "ntestgrouptestparametercode")
                                               || [],
                                               this.state.dataStateChangeViewParameter
                                                   ? this.state.dataStateChangeViewParameter : { skip: 0, take: 10 })} 
                                       dataState={this.state.dataStateChangeViewParameter
                                           ? this.state.dataStateChangeViewParameter : { skip: 0, take: 10 }} 
                                       dataStateChange={this.dataStateChangeViewParameter} 
                                       extractedColumnList={[
                                           { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametersynonym", "width": "200px" } ,
                                            { "idsName": "IDS_RESULT", "dataField": "sfinal", "width": "200px" } ,
                                           // { "idsName": "IDS_RESULTFLAG", "dataField": "sgradename", "width": "200px" } 
                                       ]}
                                       controlMap={this.state.controlMap}
                                       userRoleControlRights={this.state.userRoleControlRights}
                                       pageable={true} 
                                       scrollable={'scrollable'}
                                       hideColumnFilter={true}
                                       selectedId={0}  
                                       activeTabName={"IDS_Test"}
                                       gridHeight = {'400px'}
                                   >
                                   </DataGrid>  :
                        this.props.Login.additionalInfoView?
                        this.state.selectedRecord['additionalResultData'] :
                         this.props.Login.showAlertForPredefined? 
                       <ResultEntryPredefinedComments 
                       onlyAlertMsgAvailable={this.props.Login.onlyAlertMsgAvailable}
                       salertmessage={this.props.Login.masterData['salertmessage']}
                       showMultiSelectCombo={this.props.Login.showMultiSelectCombo}
                       testgrouptestpredefsubresultOptions={this.props.Login.masterData.testgrouptestpredefsubresultOptions||[]}
                       selectedRecord={this.state.selectedRecord || {}} 
                       onInputChange = {this.onInputChange}
                       onComboChange={this.onComboChange} 
                       />  :''
                    }
                />


                {
                    this.props.Login.openModal && this.props.Login.screenName &&
                    <SlideOutModal
                        show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        className={this.props.Login.screenName === "IDS_VIEWRULE"  ? "wide-popup" : ""}
                        operation={this.props.Login.screenName === "IDS_VIEWRULE"||this.props.Login.screenName === "IDS_VIEWOUTCOME" ? "" : this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={ this.props.Login.screenName === "IDS_VIEWRULE"||this.props.Login.screenName === "IDS_VIEWOUTCOME" ?this.props.intl.formatMessage({id: this.props.Login.screenName})
                        +" - "+this.props.Login.masterData.SelectedTest.stestsynonym:this.props.Login.screenName}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        //ALPD-5444 Test Group - Copy the spec in test group and do save continue loading issue occurs.
                        //ATE234 janakumar ALPD-5546All Master screen -> Copy & File remove the save&continue
                        showSaveContinue={this.props.Login.operation==="copy"?false:this.props.Login.screenName === "IDS_SPECIFICATION" || this.props.Login.screenName === "IDS_SPECFILE"?this.props.Login.loadEsign ? false :true:false}
                        onSaveClick={this.onSaveClick}
                        hideSave={this.props.Login.screenName === "IDS_VIEWRULE"||this.props.Login.screenName === "IDS_VIEWOUTCOME" ||this.props.Login.screenName === "IDS_SUBCODERESULT"  ? true : false}
                        size={this.props.Login.screenName === "IDS_VIEWRULE" ||this.props.Login.screenName === "IDS_VIEWOUTCOME"  ? 'xl' : "lg"}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={
                            this.props.Login.screenName === "IDS_SPECFILE" ? this.findMandatoryFields(this.props.Login.screenName, this.state.selectedRecord)
                                : this.props.Login.screenName === "IDS_SPECIFICATION" ? this.props.Login.operation === "copy" ? specCopyMandatoryFields : specMandatoryFields   //ALPD-4944, Added condition to read which mandatory records
                                    : this.props.Login.screenName ===this.props.Login.genericLabel["Component"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] ? compMandatoryFields
                                        : this.props.Login.screenName === "IDS_EDITTESTGROUPTEST" ? editTestMandatoryFields
                                            : this.props.Login.screenName === "IDS_TEST" ? addTestMandatoryFields
                                                : this.props.Login.screenName === "IDS_PROFILETREE" || this.props.Login.screenName === "IDS_EDITTREE"
                                                    ? this.props.Login.treeMandatoryFields : []}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                onInputOnChange={this.onEsignInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> :
                            this.props.Login.screenName === "IDS_SPECIFICATION" ?
                                <AddTestGroupSpecification
                                   genericLabel={this.props.Login.genericLabel}
                                     userInfo={this.props.Login.userInfo}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    timeZoneList={this.props.Login.timeZoneList}
                                    onInputOnChange={this.onInputOnChange}
                                    handleDateChange={this.handleDateChange}
                                    onComboChange={this.onComboChange}
                                    screenName={this.props.Login.screenName}
                                    operation={this.props.Login.operation}
                                    nsampletypecode={this.props.Login.masterData.selectedNode.nsampletypecode}
                                    settings={this.props.Login.settings}
                                    tempFilterData = {this.state.tempFilterData}
									//ALPD-5529--Vignesh R(06-03-2025)-->Test group screen -> Profile showing wrongly in specific scenario.
                                    filterData ={this.props.Login.masterData.filterData}
                                    //For copy action --ALPD-4099 ,work done by Dhanushya R I
                                    focusKey={
                                        // this.props.Login.masterData && this.props.Login.masterData.selectedRecordCopy ? this.props.Login.masterData.selectedRecordCopy.CopyFocusKey :
                                            this.state.selectedRecord.CopyFocusKey || ""}
                                    activeKey={
                                        // this.props.Login.masterData && this.props.Login.masterData.selectedRecordCopy ? this.props.Login.masterData.selectedRecordCopy.CopyActiveKey :
                                        this.state.selectedRecord.CopyActiveKey || ""}
                                    copyProfileName = {this.state.selectedRecord.selectedCopyProfileName}
                                    onCopyTreeClick={this.onCopyTreeClick}
                                    initialOpenNodes = {CopyOpenNodes || OpenNodes}
                                    data={this.props.Login.masterData.AgaramTree}
                                    //For copy action --ALPD-4099 ,work done by Dhanushya R I
                                    Copydata={this.props.Login.masterData.selectedRecordCopy&&this.props.Login.masterData.selectedRecordCopy.AgaramTree}
                                    masterData={this.props.Login.masterData}
                                    productCategory={this.state.productCategory}
                                    product={this.state.product}
                                    changeProductOrProductCategory={this.props.getSpecDetailsForCopy}
                                    initialProfile={this.props.Login.masterData&&this.props.Login.masterData.selectedNode&&this.props.Login.masterData.selectedNode.sleveldescription}
                                /> :
                                this.props.Login.screenName ===this.props.Login.genericLabel["Component"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] ?
                                    <AddTestGroupTest
                                         genericLabel={this.props.Login.genericLabel}
                                        userInfo={this.props.Login.userInfo}
                                        selectedRecord={this.state.selectedRecord || {}}
                                        testGroupInputData={this.props.Login.testGroupInputData}
                                        screenName={this.props.Login.screenName}
                                        onComboChange={this.onComboChange}
                                        onFilterComboChange={this.onFilterComboChange}
                                    /> :


                                    this.props.Login.screenName === "IDS_SUBCODERESULT" ?
                                    <ViewSubCodedResult
                                        selectedRecord={this.state.selectedsubcoderesult || {}}
                                        selectedsubcoderesult={this.props.Login.selectedsubcoderesult||[]}
                                        screenName={this.props.Login.screenName}
                                        onComboChange={this.onComboChange}
                                        onFilterComboChange={this.onFilterComboChange}
                                    /> :

                                    this.props.Login.screenName === "IDS_PROFILETREE" ?
                                        <AddProfileTree
                                            selectedRecord={this.state.selectedRecord || {}}
                                            onInputOnChange={this.onInputOnChange}
                                            treetempTranstestGroup={this.props.Login.TreetempTranstestGroup}
                                        /> :
                                        this.props.Login.screenName === "IDS_SPECFILE" ?
                                            <AddFile
                                                selectedRecord={this.state.selectedRecord || {}}
                                                onInputOnChange={this.onInputOnChange}
                                                actionType={this.state.actionType}
                                                onDrop={this.onDropSpecFile}
                                                deleteAttachment={this.deleteAttachment}
                                                linkMaster={this.props.Login.linkMaster}
                                                editFiles={this.props.Login.editFiles}
                                                maxSize={20}
                                                maxFiles={this.props.Login.operation === "update" ? 1 : 1}
                                                multiple={this.props.Login.operation === "update" ? false : true}
                                                label={this.props.intl.formatMessage({ id: "IDS_SPECFILE" })}
                                                hideDefaultToggle={true}
                                                name="specfilename"
                                            /> :
                                            this.props.Login.screenName === "IDS_EDITTREE" ?
                                                <Row>
                                                    <Col md={12}>
                                                        <FormInput
                                                            name={"sleveldescription"}
                                                            label={this.state.selectedRecord.slabelname}
                                                            type="text"
                                                            onChange={(event) => this.onInputOnChange(event, 1)}
                                                            placeholder={this.state.selectedRecord.slabelname}
                                                            value={this.state.selectedRecord ? this.state.selectedRecord["sleveldescription"] : ""}
                                                            isMandatory="*"
                                                            required={true}
                                                            maxLength={100}
                                                        />
                                                    </Col>
                                                </Row> :
                                                this.props.Login.screenName === "IDS_TEST" ?
                                                    <AddTestGroupTest
                                                    genericLabel={this.props.Login.genericLabel}
                                                    userInfo={this.props.Login.userInfo}
                                                        selectedRecord={this.state.selectedRecord || {}}
                                                        testGroupInputData={this.props.Login.testGroupInputData}
                                                        screenName={this.props.Login.screenName}
                                                        onComboChange={this.onComboChange}
                                                        onFilterComboChange={this.onFilterComboChange}
                                                    /> : this.props.Login.screenName === "IDS_EDITTESTGROUPTEST" ?
                                                        <EditTestGroupTest
                                                             hideQualisForms={this.props.Login.hideQualisForms}
                                                            selectedRecord={this.state.selectedRecord || {}}
                                                            testGroupInputData={this.props.Login.testGroupInputData}
                                                            onComboChange={this.onComboChange}
                                                            onInputOnChange={this.onInputOnChange}
                                                            onNumericInputChange={this.onNumericInputChange}
                                                        /> : this.props.Login.screenName === "IDS_VIEWRULE" ?
                                                            <Row>
                                                                <Col md={12}>
                                                                    <OrgTree
                                                                        data={this.ruleflowobject()}
                                                                        horizontal={true}
                                                                        collapsable={true}
                                                                        expandAll={true}
                                                                        labelClassName={"ruletree"}
                                                                    /> 
                                                                </Col>
                                                            </Row>
                                                               
                                                            :  this.props.Login.screenName === "IDS_VIEWOUTCOME" ?
                                                            <Row>
                                                                <Col md={12}> 
                                                                    {this.props.Login.masterData.SelectedRulesEngine &&
                                                                <CustomTab tabDetail={this.tabDetailRulesEngine()} onTabChange={this.onTabChangeRulesEngine} /> }
                                                                </Col>
                                                            </Row> 
                                                            :""
                        }
                    />
                }
                {
                    this.props.Login.openPortalModal &&
                    <PortalModalSlideout
                        show={this.props.Login.openPortalModal}
                        closeModal={this.closePortalModal}
                        screenName={this.props.intl.formatMessage({ id:this.props.Login.screenName})+" - "+this.props.Login.masterData.SelectedTest.stestsynonym}
                        handleSaveClick={this.save}
                        addComponent={
                            (this.props.Login.operation === 'update' ? this.state.selectedRecord['groupList'] : true) &&
                            <AddTestGroupRule
                                productCategoryList={this.state.ProductCategoryList || []}
                                selectedRecord={this.state.selectedRecord || {}}
                                databaseTableList={this.props.Login.databaseTableList}
                                tableColumnList={this.state.tableColumnList}
                                specificationOptions={this.state.TestGroupSpecificationList || []}
                                componentOptions={this.state.ComponentList || []}
                                foreignTableList={this.state.foreignTableList || []}
                                foreignTableColumnList={this.props.Login.foreignTableColumnList || []}
                                count={this.state.count}
                                foreignTableCount={this.state.foreignTableCount}
                                sqlQuery={this.state.sqlQuery}
                                userInfo={this.props.Login.userInfo}
                                onInputChange={this.onInputChange}
                                deleteRule={this.deleteRule}
                                clearRule={this.clearRule}
                                resetRule={this.resetRule}
                                onSymbolChange={this.onSymbolChange}
                                onRuleChange={this.onRuleChange}
                                addRule={this.addRule}
                                addTest={this.addTest}
                                onConditionClick={this.onConditionClick}
                                onMasterDataChange={this.onMasterDataChange}
                                databaseviewList={this.props.Login.databaseviewList}
                                addRuleList={this.props.Login.addRuleList || []}
                                rulesOption={this.props.Login.masterData.rulesOption&&this.props.Login.masterData.rulesOption.filter(this.outComeTestsRemoveFromRules)}
                                masterdata={this.props.Login.masterdata}
                                switchRecord={this.state.switchRecord}
                                data={this.state.data}
                                dataResult={this.state.dataResult || []}
                                dataState={this.state.dataState}
                                dataStateChange={this.dataStateChange}
                                userRoleControlRights={this.state.userRoleControlRights}
                                gridColumnList={this.props.Login.gridColumnList || []}
                                queryType={this.state.queryType}
                                addAggregateList={this.props.Login.addAggregateList || []}
                                addOrderbyList={this.props.Login.addOrderbyList || []}
                                addGroup={this.addGroup}
                                addGroupList={this.props.Login.addGroupList || []}
                                onFilterComboChange={this.onFilterComboChange}
                                selectFields={this.props.Login.selectFields || []}
                                SelectedProductCategory={this.props.Login.masterData.SelectedProductCategory}
                                DiagnosticCaseList={this.props.Login.masterData.DiagnosticCaseList}
                                GradeList={this.props.Login.masterData.GradeList}
                                PredefinedParameterOptions={this.props.Login.masterData.PredefinedParameterOptions} 
                                siteList={this.props.Login.masterData.siteList}
                                resultTypeList={this.props.Login.masterData.resultTypeList}
                                isResultorOrderType={this.state.isResultorOrderType}
                                optionsByRule={this.state.optionsByRule || this.props.Login.masterData.DiagnosticCaseList}
                                changePropertyView={this.changePropertyView}
                                splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                activeTabIndex={this.props.Login.activeTabIndex}
                                enablePropertyPopup={this.state.enablePropertyPopup}
                                propertyPopupWidth={this.state.propertyPopupWidth}
                                controlMap={this.state.controlMap}
                                sectionDataState={this.state.sectionDataState}
                                masterData={this.props.Login.masterData}
                                intl={this.props.intl}
                                addOutcomeList={this.props.Login.addOutcomeList && this.props.Login.addOutcomeList || []}
                                deleteOutcome={this.deleteOutcome}
                                onmodalComboChange={this.onmodalComboChange}
                                openModalPopup={this.props.Login.openModalPopup}
                                closeModalShow={this.closeModalShow}
                                modalsaveClick={this.modalsaveClick}
                                getOutcomeDetails={this.getOutcomeDetails}
                                addModalSite={this.addModalSite}
                                action={this.props.Login.action}
                                deletModalSite={this.deletModalSite}
                                deleteModalTest={this.deleteModalTest}
                                activeTestTab={this.props.Login.activeTestTab}
                                testcomments={this.props.Login.testcomments}
                                reportcomments={this.props.Login.reportcomments}
                                addComments={this.addComments}
                                CommentType={this.props.Login.CommentType}
                                CommentSubType={this.props.Login.CommentSubType}
                                isneedsgeneralcomments={this.state.isneedsgeneralcomments}
                                predefcomments={this.props.Login.predefcomments}
                                needoutsource={this.state.selectedRecord['needoutsource'] && this.state.selectedRecord['needoutsource'] === 3 ? true : false}
                                openmodalsavePopup={this.props.Login.openmodalsavePopup}
                                save={this.save}
                                dataStateObject={this.state.dataStateObject}
                                paneSizeChange={this.paneSizeChange}
                                testInitiateTestCombo={this.props.Login.testInitiateTestCombo && this.viewColumnListByRule(this.props.Login.testInitiateTestCombo)}
                                testCommentsTestCombo={this.props.Login.testCommentsTestCombo && this.viewColumnListByRule(this.props.Login.testCommentsTestCombo)}
                                testRepeatTestCombo={this.props.Login.testRepeatTestCombo && this.viewColumnListByRule(this.props.Login.testRepeatTestCombo)}
                                testenforceTestCombo={this.props.Login.testenforceTestCombo &&this.props.Login.testenforceTestCombo}
                                dataStateChangetestRepeat={this.dataStateChangetestRepeat}
                                dataStateChangetestEnforce={this.dataStateChangetestEnforce}
                                dataStatetestEnforce={this.state.dataStatetestEnforce}
                                dataStatetestRepeat={this.state.dataStatetestRepeat}
                                testGroupTestParameterRulesEngine={this.props.Login.masterData.testGroupTestParameterRulesEngine||[]}
                                ParameterRulesEngine={this.props.Login.masterData.ParameterRulesEngine||[]}
                                onRuleInputChange={this.onRuleInputChange}
                                onRuleNumericInputOnChange={this.onRuleNumericInputOnChange} 
                                onResultInputChange={this.onResultInputChange}
                                PredefinedValues={this.props.Login.masterData.PredefinedValues||{}}
                                onGradeEvent={this.onGradeEvent}
                                deletetestparameter={this.deletetestparameter}
                                gradeValues={this.props.Login.masterData.GradeValues || []}
                                modalParameterPopup={this.props.Login.modalParameterPopup||false}
                                addParameter={this.addParameter} 
                                onInputSwitchOnChange={this.onInputSwitchOnChange}
                                onInputSwitchChange={this.onInputSwitchChange}
                            />
                        }
                    />
                }
            </>
        );
    }

    ConfirmDelete = (obj) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord(obj));
    }

    handlePageChange = (event) => {
        this.setState({
            testskip: event.skip,
            testtake: event.take
        });
    }

    findMandatoryFields(screenName, selectedRecord) {
        let mandyFields = [];
        if (screenName === "IDS_SPECFILE") {
            if (selectedRecord && selectedRecord.nattachmenttypecode === attachmentType.LINK) {
                mandyFields = [
                    { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                    { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                ];
            } else {
                //if (this.props.Login.operation === 'update') {
                mandyFields = [
                    { "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                ];
                // }
            }
        } else {
            return [];
        }
        let finalMandyFields = [];
        mandyFields.forEach(item => item.mandatory === true && finalMandyFields.push(item));
        return finalMandyFields;
    }

    viewTestFile = (props) => {
        const viewParam = {
            operation: "view",
            methodUrl: "TestGroupTestFile",
            classUrl: "testgroup",
            inputData: {
                ntestgroupfilecode: props.selectedTest ? props.selectedTest.ntestgroupfilecode : 0,
                userinfo: this.props.Login.userInfo,
                testgroupspecification: this.props.Login.masterData.SelectedSpecification,
                ntestgrouptestcode: props.selectedTest ? props.selectedTest.ntestgrouptestcode : 0
            }
        }
        this.props.viewAttachment(viewParam)
    }

    fileViewIcon = (master) => {
        if (master.ntestgroupfilecode > 0 && master.nlinkcode === transactionStatus.NA) {
            return true;
        } else {
            return false;
        }
    }

    linkViewIcon = (master) => {
        if (master.ntestgroupfilecode > 0 && master.nlinkcode !== transactionStatus.NA) {
            return true;
        } else {
            return false;
        }
    }

    showSpecAndTestInfo() {
        this.setState({ showTest: !this.state.showTest, testView: false })
        this.updateSpiltterLayout()

    }
    showSpecAndTestInfo1() {
        this.setState({ showTest: !this.state.showTest, testView: true })
        //this.updateSpiltterLayout()

    }

    onFilterSumbit = () => {
        const tempFilterData = this.state.tempFilterData;
        if (tempFilterData.nsampletypecode === undefined) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SAMPLETYPENOTAVAILABLE" }));
        } else if (tempFilterData.nproductcatcode === "") {
            if (tempFilterData.nsampletypecode.item.nformcode === formCode.PRODUCTCATEGORY) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PRODUCTCATEGORYNOTAVAILABLE" }));
            } else if (tempFilterData.nsampletypecode.item.nformcode === formCode.INSTRUMENTCATEGORY) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORYNOTAVAILABLE" }));
            } else if (tempFilterData.nsampletypecode.item.nformcode === formCode.MATERIALCATEGORY) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_MATERIALCATEGORYNOTAVAILABLE" }));
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_CATEGORYNOTAVAILABLE" }));
            }
        }
        // else if(tempFilterData.nproductcatcode.item.ncategorybasedflow === transactionStatus.NO){
        else if ((tempFilterData.nproductcatcode.item.ncategorybasedflow === transactionStatus.NO && tempFilterData.nproductcode === "" && 
        tempFilterData.nsampletypecode.item.ncategorybasedflowrequired === transactionStatus.NO) ||
            (tempFilterData.nproductcatcode.item.ncategorybasedflow === transactionStatus.NO && tempFilterData.nproductcode === undefined  && 
                tempFilterData.nsampletypecode.item.ncategorybasedflowrequired === transactionStatus.NO) ) {
            
                if (tempFilterData.nsampletypecode.item.nformcode === formCode.PRODUCTCATEGORY && tempFilterData.nsampletypecode.item.ncategorybasedflowrequired === transactionStatus.NO ) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PRODUCTNOTAVAILABLE" }));
            } else if (tempFilterData.nsampletypecode.item.nformcode === formCode.INSTRUMENTCATEGORY) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_INSTRUMENTNOTAVAILABLE" }));
            } else if (tempFilterData.nsampletypecode.item.nformcode === formCode.MATERIALCATEGORY) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_MATERIALNOTAVAILABLE" }));
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PRODUCTNOTAVAILABLE" }));
            }
        }
        // }
        else if (tempFilterData.ntreeversiontempcode === "") {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_STUDYPLANTEMPLATEISNOTAVAILABLE" }));
        } else {
            const inputParam = {
                inputData: {
                    userinfo: this.props.Login.userInfo,
                    nsampletypecode: tempFilterData.nsampletypecode.value,
                    nproductcatcode: tempFilterData.nproductcatcode.value,
                    nproductcode: tempFilterData.nsampletypecode.item.ncategorybasedflowrequired === transactionStatus.YES ? -1 : 
                    
                    tempFilterData.nproductcatcode.item.ncategorybasedflow === transactionStatus.YES ? -1 : tempFilterData.nproductcode ? tempFilterData.nproductcode.value : -1,
                    ntreeversiontempcode: tempFilterData.ntreeversiontempcode.value,
                    nprojectmastercode: tempFilterData.nsampletypecode.value === SampleType.PROJECTSAMPLETYPE ?  tempFilterData.nsampletypecode.item.nprojectspecrequired=== transactionStatus.YES ? tempFilterData.nprojectmastercode.value :-1 : -1,
                    filterData: { ...tempFilterData },
                },
                historyDataState: this.state.historyDataState
            }
            this.props.filterTestGroup(inputParam, this.props.Login.masterData, this.searchRef);
        }
    }
    onCopyTreeClick = (selectedCopyNodeManipulationCode, selectedCopyProfileName, CopyFocusKey, CopyActiveKey) =>{
        let selectedRecord= {...this.state.selectedRecord} || {};
       
        selectedRecord['selectedCopyNodeManipulationCode'] = selectedCopyNodeManipulationCode
        selectedRecord['selectedCopyProfileName'] = selectedCopyProfileName;
        selectedRecord['CopyFocusKey'] = CopyFocusKey;
        selectedRecord['CopyActiveKey'] = CopyActiveKey;
        selectedRecord['scopyspecname'] = selectedCopyProfileName;
            this.setState({ 
                            selectedRecord : {...selectedRecord},
                            // isCopySpecRender: false
                         });
    }
    onTreeClick = (event) => {
        const inputParam = {
            methodUrl: "TestGroupSpecification",
            screenName: "IDS_SPECIFICATION",
            operation: "get",
            keyName: "treetemplatemanipulation",
            userinfo: this.props.Login.userInfo,
            selectedRecord: event.item,
            activeKey: event.key,
            focusKey: event.key,
            primaryKey: event.primaryKey,
            historyDataState: this.state.historyDataState
        };
        this.props.getSpecification(inputParam, this.props.Login.masterData, this.searchRef);
    }

    tabDetail = () => {
        const tabMap = new Map();
        tabMap.set("IDS_FILE",
            <TestGroupSpecFile
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                userInfo={this.props.Login.userInfo}
                inputParam={this.props.Login.inputParam}
                deleteRecord={this.deleteRecord}
                testGroupSpecFile={this.props.Login.masterData.TestGroupSpecFile || []}
                selectedSpecification={this.props.Login.masterData.SelectedSpecification}
                addTestFile={this.addFile}
                editSpecFile={this.props.editSpecFile}
                filterData={this.state.filterData}
                viewTestFile={this.viewTestFile}
                defaultRecord={this.defaultRecord}
                screenName="IDS_FILE"
                viewAttachment={this.props.viewAttachment}
                settings={this.props.Login.settings}
                masterData={this.props.Login.masterData}
            />);
        tabMap.set("IDS_SPECIFICATIONHISTORY",
            <SpecificationHistory
                data={this.props.Login.masterData.TestGroupSpecificationHistory}
                dataResult={process(this.props.Login.masterData.TestGroupSpecificationHistory || [], this.state.historyDataState)}
                dataState={this.state.historyDataState}
                dataStateChange={this.historyDataStateChange}

                // testGroupSpecificationHistory={this.props.Login.masterData.TestGroupSpecificationHistory}
                // dataState={this.props.Login.screenName === "IDS_SPECIFICATIONHISTORY" ? this.state.historyDataState : { skip: 0, take: 10 }}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                userInfo={this.props.Login.userInfo}
                inputParam={this.props.Login.inputParam}
                screenName="IDS_SPECIFICATIONHISTORY"
            />);
        return tabMap;
    }

    historyDataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.Login.masterData.TestGroupSpecificationHistory || [], event.dataState),
            historyDataState: event.dataState
        });
    }
    specDataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.Login.masterData.TestGroupTestClinicalSpec || [], event.dataState),
            clinicalspecDataState: event.dataState
        });
    }
    addFile = (userInfo, operation, ncontrolCode, screenName, modalName, nflag) => {
        // const testgroupspecification = this.props.Login.masterData.SelectedSpecification;
        // if (testgroupspecification.napprovalstatus === transactionStatus.DRAFT
        //     || testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {
        //     this.props.addTestFile(userInfo, operation, ncontrolCode, screenName, modalName, nflag);
        // } else {
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION" }));
        // }

        const masterData = this.props.Login.masterData;
        if(masterData.selectedNode){
            const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
                x => x["ntreeversiontempcode"] === masterData.selectedNode["ntreeversiontempcode"]);
    
            const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
            if (templateVersionStatus === transactionStatus.RETIRED) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
            }
            else {
                const testgroupspecification = this.props.Login.masterData.SelectedSpecification;
                if (testgroupspecification.napprovalstatus === transactionStatus.DRAFT
                    || testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {
                    this.props.addTestFile(userInfo, operation, ncontrolCode, screenName, modalName);
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION" }));
                }
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }));
        }
    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }

    componentRowClick = (event) => {
        let masterData = this.props.Login.masterData;
        masterData["SelectedComponent"] = event.testgroupspecsampletype[0];
        const inputParam = {
            testgroupspecsampletype: event.testgroupspecsampletype[0],
            userInfo: this.props.Login.userInfo
        };
        this.props.getTestGroupComponentDetails(inputParam, masterData, this.searchRef);
    }

    deleteTest = (deleteParam) => {
        const masterData = this.props.Login.masterData;
        const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
            x => x["ntreeversiontempcode"] === masterData.selectedNode["ntreeversiontempcode"]);

        const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
        if (templateVersionStatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
        }
        else {
            const testgroupspecification = masterData.SelectedSpecification;
            if (testgroupspecification.napprovalstatus === transactionStatus.DRAFT
                || testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {
                const testgrouptest = deleteParam.props.testgrouptest;
                const inputParam = {
                    inputData: {
                        testgrouptest,
                        userinfo: this.props.Login.userInfo,
                        testgroupspecification,
                        ntreeversiontempcode: deleteParam.filterData.ntreeversiontempcode.value,
                        nprojectmastercode:masterData.selectedNode.nprojectmastercode?masterData.selectedNode.nprojectmastercode:-1
                    },
                    classUrl: "testgroup",
                    operation: "delete",
                    methodUrl: "Test",
                    screenName: "IDS_TEST",
                    postParam: {
                        inputListName: "TestGroupTest", selectedObject: "SelectedTest", primaryKeyField: "ntestgrouptestcode",
                        primaryKeyValue: testgrouptest.ntestgrouptestcode,
                        fetchUrl: "testgroup/getTestGroupTest", fecthInputObject: { userinfo: this.props.Login.userInfo },
                        masterData, searchFieldList, unchangeList: ["TestGroupSpecification", "SelectedSpecification",
                            "SampleType", "TreeVersionTemplate", "ProductCategory", "SelectedTest", "Product",
                            "AgaramTree", "OpenNodes", "selectedNode", "FocusKey", "ActiveKey", "SelectedComponent", "TestGroupSpecSampleType"]//, isSingleSelect: true
                    }
                }

                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData },
                            openModal: true, screenName: "IDS_TEST", operation: "delete", selectedRecord: {}
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.props.crudMaster(inputParam, masterData, "openModal", {});
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION" }));
            }
        }
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let masterData = this.props.Login.masterData;
        if (loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "Default"
                || this.props.Login.operation === 'approve' || this.props.Login.operation === 'complete') {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
                delete masterData.selectedRecordCopy;      
                 } else {
                loadEsign = false;
                // selectedRecord["agree"] = 4;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""

            }
        } else {
            openModal = false;
            selectedRecord = {};
            delete masterData.selectedRecordCopy;
            delete masterData.CopyOpenNodes;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord,masterData }
        }
        this.props.updateStore(updateInfo);
    }

    onInputOnChange = (event, caseNo, optional) => {
        const selectedRecord = this.state.selectedRecord || {};
        switch (caseNo) {
            case 1:
                if (event.target.type === 'checkbox') {
                    selectedRecord[event.target.name] = event.target.checked === true ? optional[0] : optional[1];
                } else if (event.target.type === 'radio') {
                    selectedRecord[event.target.name] = optional;
                    // selectedRecord["sfilename"] = "";
                } else {
                    selectedRecord[event.target.name] = event.target.value;
                }
                this.setState({ selectedRecord });
                break;

            case 2:
                selectedRecord[event.target.name] = event.target.value;

                const indexKey = Object.keys(optional)[0];
                const value = Object.values(optional)[0];
                const treeData = {
                    ntreeversiontempcode: value.ntreeversiontempcode,
                    npositioncode: value.nlevelno - 1,
                    sleveldescription: event.target.value,
                    ntemptranstestgroupcode: value.ntemptranstestgroupcode,
                    nformcode: 62,
                    schildnode: "",
                    nnextchildcode: value.schildnode !== null ? value.schildnode : -1,
                    ntemplatemanipulationcode: value.ntemplatemanipulationcode,
                    isreadonly: value.ntemplatemanipulationcode > 0 ? true : false,
                    slevelformat: value.slevelformat
                }
                let treetemplatemanipulation = selectedRecord.treetemplatemanipulation || [];
                treetemplatemanipulation[indexKey] = treeData;
                selectedRecord["treetemplatemanipulation"] = treetemplatemanipulation;
                this.setState({ selectedRecord });
                break;

            default:
                break;
        }
    }

    onEsignInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }
    //Rules Engine Functions Start
    ruleflowobject() {
        let object = {};
        //const labelColor = ['#e63109', '#2fb47d', '#eaa203', '#6554c0'];
        //const labelBGColor = ['#fcd7cd', '#e5f8f1', '#fcf3dd', '#e7e6f5'];
       // const borderColor = ['#e6310', '#c6f6e4', '#fde2a4', '#cbc5f7'];
        let groupList = this.props.Login.masterData.SelectedRulesEngine['jsondata'];
        let groupListJoins = this.props.Login.masterData.SelectedRulesEngine['jsonuidata'] &&
            this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['groupListJoins'];
        let children = [];
        let parent = [];
        let grandparent = [];
        groupList.map((groupobject, index) => {
            if (groupobject.hasOwnProperty('button_or')) {
                children = [];
                let rulesList = groupobject['button_or'];
                rulesList.map((rule, index) => {
                    children.push(
                        {
                            id: index, label: <>{(rule['stestname'].label) //+ " -> " + (this.props.intl.formatMessage({ id: "IDS_WITH" })) 
                            + " -> " +
                                (rule['orderresulttype'].label) + " -> " +
                                (rule['ssymbolname'].label) + " -> " + ( 
                                    (rule['ndiagnosticcasecode']&& rule['ndiagnosticcasecode'].label) 
                                    || (rule['ngradecode'] && rule['ngradecode'].label ) 
                                    || (rule['ntestgrouptestnumericcode'] && rule['ntestgrouptestnumericcode'])
                                    || (rule['ntestgrouptestcharcode'] && rule['ntestgrouptestcharcode'] )
                                    || (rule['ntestgrouptestpredefcode'] && rule['ntestgrouptestpredefcode'].label))

                            }</>
                        }
                    )
                })
                if(groupList.length===1?rulesList.length>1:true){
                 parent.push({ id: index, label: <div className="btn btn-primary" >{this.props.intl.formatMessage({ id: "IDS_OR" })}</div>, children: children }) 
                }
            }
            if (groupobject.hasOwnProperty('button_and')) {
                children = [];
                let rulesList = groupobject['button_and'];
                rulesList.map((rule, index) => {
                    children.push(
                        {
                            id: index, label: <>{

                                (rule['stestname'].label) //+ " -> " + (this.props.intl.formatMessage({ id: "IDS_WITH" })) 
                                + " -> " +
                                (rule['orderresulttype'].label) + " -> " +
                                (rule['ssymbolname'].label) + " -> " +  
                                ( (rule['ndiagnosticcasecode'] && rule['ndiagnosticcasecode'].label)
                                 || (rule['ngradecode'] && rule['ngradecode'].label)
                                 || (rule['ntestgrouptestnumericcode'] && rule['ntestgrouptestnumericcode'])
                                 || (rule['ntestgrouptestcharcode'] && rule['ntestgrouptestcharcode'])
                                 || (rule['ntestgrouptestpredefcode'] && rule['ntestgrouptestpredefcode'].label))
                            }</>
                        }
                    )
                })
                if(groupList.length===1?rulesList.length>1:true){
                parent.push({ id: index, label: <div className="btn btn-primary" >{this.props.intl.formatMessage({ id: "IDS_AND" })}</div>, children: children })
                }
            }
            if (groupobject.hasOwnProperty('button_not_button_and')) {
                children = [];
                let rulesList = groupobject['button_not_button_and'];
                rulesList.map((rule, index) => {
                    children.push(
                        {
                            id: index, label: <>{(rule['stestname'].label) //+ " -> " + (this.props.intl.formatMessage({ id: "IDS_WITH" })) 
                            + " -> " +
                                (rule['orderresulttype'].label) + " -> " +
                                (rule['ssymbolname'].label) + " -> " +  ( rule['ndiagnosticcasecode']&& rule['ndiagnosticcasecode'].label ||
                                rule['ngradecode']&&rule['ngradecode'].label||  rule['ntestgrouptestnumericcode']&&rule['ntestgrouptestnumericcode']||
                                rule['ntestgrouptestcharcode']&&rule['ntestgrouptestcharcode']|| rule['ntestgrouptestpredefcode']&&rule['ntestgrouptestpredefcode'].label)

                            }</>
                        }
                    )
                })
                let notarray = [{ id: index, label: <div className="btn btn-primary" >{this.props.intl.formatMessage({ id: "IDS_AND" })}</div>, children: children }]
                if(groupList.length===1?rulesList.length>1:true){
                parent.push({ id: index, label: <div className="btn btn-primary" >{this.props.intl.formatMessage({ id: "IDS_NOT" })}</div>, children: notarray })
                }
            }
            if (groupobject.hasOwnProperty('button_not_button_or')) {
                children = []
                let rulesList = groupobject['button_not_button_or']
                rulesList.map((rule, index) => {
                    children.push(
                        {
                            id: index, label: <>{(rule['stestname'].label)// + " -> " + (this.props.intl.formatMessage({ id: "IDS_WITH" })) 
                            + " -> " +
                                (rule['orderresulttype'].label) + " -> " +
                                (rule['ssymbolname'].label) + " -> " +  ( rule['ndiagnosticcasecode']&& rule['ndiagnosticcasecode'].label ||
                                rule['ngradecode']&&rule['ngradecode'].label||  rule['ntestgrouptestnumericcode']&&rule['ntestgrouptestnumericcode']||
                                rule['ntestgrouptestcharcode']&&rule['ntestgrouptestcharcode']|| rule['ntestgrouptestpredefcode']&&rule['ntestgrouptestpredefcode'].label)

                            }</>
                        }
                    )
                })
                let notarray = [{ id: index, label: <div className="btn btn-primary" >{this.props.intl.formatMessage({ id: "IDS_OR" })}</div>, children: children }]
                if(groupList.length===1?rulesList.length>1:true){
                parent.push({ id: index, label: <div className="btn btn-primary" >{this.props.intl.formatMessage({ id: "IDS_NOT" })}</div>, children: notarray })
                }
            }
        })

        if (groupListJoins !== undefined) {
            groupListJoins.map((join, index) => {
                let parentjoins = []
                if (join.hasOwnProperty('button_or') && join['button_or'] === true) {
                    let notarray = []
                    parentjoins.push(parent[index])
                    parentjoins.push(parent[index + 1])
                    if (join.hasOwnProperty('button_not') && join['button_not'] === true) {
                        notarray = [{
                            id: index, label: <div className="btn btn-primary" >
                                {this.props.intl.formatMessage({ id: "IDS_OR" })} </div>// 'button_or'
                            , children: parentjoins
                        }]
                        grandparent.push({
                            id: index, label: <div className="btn btn-primary" >
                                {this.props.intl.formatMessage({ id: "IDS_NOT" })} </div>// 'button_or'
                            , children: notarray
                        })
                    }
                    else {
                        grandparent.push({
                            id: index, label: <div className="btn btn-primary" >
                                {this.props.intl.formatMessage({ id: "IDS_OR" })} </div>// 'button_or'
                            , children: parentjoins
                        })
                    }
                }
                if (join.hasOwnProperty('button_and') && join['button_and'] === true) {
                    let notarray = []
                    parentjoins.push(parent[index])
                    parentjoins.push(parent[index + 1])
                    if (join.hasOwnProperty('button_not') && join['button_not'] === true) {
                        notarray = [{
                            id: index, label: <div className="btn btn-primary" >
                                {this.props.intl.formatMessage({ id: "IDS_AND" })} </div>// 'button_or'
                            , children: parentjoins
                        }]
                        grandparent.push({
                            id: index, label: <div className="btn btn-primary" >
                                {this.props.intl.formatMessage({ id: "IDS_NOT" })} </div>// 'button_or'
                            , children: notarray
                        })
                    }
                    else {
                        grandparent.push({
                            id: index, label: <div className="btn btn-primary" >{this.props.intl.formatMessage({ id: "IDS_AND" })}</div>// 'button_and'
                            , children: parentjoins
                        })
                    }
                }
            })
        }

        object = grandparent.length > 0 ?
            {
                id: 0,
                label: <div className="btn btn-primary" >{this.props.Login.masterData.SelectedRulesEngine.srulename} </div>,
                children: grandparent
            }
            : {
                id: 0,
                label: <div className="btn btn-primary" >{this.props.Login.masterData.SelectedRulesEngine.srulename} </div>,
                children: parent.length!==0?parent:children
            }
        return object
    }
    onTabChangeRulesEngine = (tabProps) => {
        let masterData = this.props.Login.masterData && this.props.Login.masterData
        masterData['activeTabName'] = tabProps.activeTabName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { masterData }
        }
        this.props.updateStore(updateInfo);
    }
    tabDetailRulesEngine = () => {
        let masterData = this.props.Login.masterData || {};
        let jsonuidata = this.props.Login.masterData.SelectedRulesEngine && this.props.Login.masterData.SelectedRulesEngine['jsonuidata'] 
        const tabMap = new Map();
        {
            tabMap.set("IDS_Test",
                <DataGrid
                    key="testsectionkey"
                    primaryKeyField="nresultusedmaterialcode"
                    expandField="expanded"
                    handleExpandChange={this.handleExpandChange} 
                    dataResult={this.props.Login.masterData.SelectedRulesEngine &&
                        this.props.Login.masterData.SelectedRulesEngine && process(
                            sortData(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testInitiateTests'], "descending", "npkAtestparametercode")
                            || [],
                            this.state.dataStatetestinitiate
                                ? this.state.dataStatetestinitiate : { skip: 0, take: 10 })} 
                    dataState={this.state.dataStatetestinitiate
                        ? this.state.dataStatetestinitiate : { skip: 0, take: 10 }} 
                    dataStateChange={this.dataStateChangetestinitiateTab}

                    extractedColumnList={[
                        { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "200px" } 
                    ]}
                    controlMap={this.state.controlMap}
                    userRoleControlRights={this.state.userRoleControlRights}
                    pageable={true} 
                    scrollable={'scrollable'}
                    hideColumnFilter={false}
                    selectedId={0} 
                    deleteParam={{ operation: "delete" }} 
                    hasChild={true}
                    childMappingField={'npkAtestparametercode'}
                    childColumnList={[
                        { "idsName": "IDS_TOSITE", "dataField": "stositename", "width": "200px" },
                        { "idsName": "IDS_FROMSITE", "dataField": "sfromsitename", "width": "200px" }
                        
                    ]}
                    childList={this.state.childListMap}
                    activeTabName={"IDS_Test"}
                    //gridHeight = {'400px'}
                    isActionRequired={true}
                    actionIcons={[{
                        title: this.props.intl.formatMessage({ id: "IDS_VIEWPARAMETER" }),
                        controlname: "faEye",
                        hidden: false,
                        objectName: "view",
                        onClick: this.viewParameter

                    }]}
                >
                </DataGrid>); 
            tabMap.set("IDS_COMMENTS",
            <DataGrid
                key="testsectionkey"
                primaryKeyField="nresultusedmaterialcode" 
                handleExpandChange={this.handleExpandChange} 
                dataResult={this.props.Login.masterData.SelectedRulesEngine && process(
                    sortData(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testCommentsTestsTab'], "descending", "nslno")
                    || [],
                    this.state.dataState
                        ? this.state.dataState : { skip: 0, take: 10 })} 
                dataState={this.state.dataState
                    ? this.state.dataState : { skip: 0, take: 10 }} 
                dataStateChange={this.dataStateChange} 
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                pageable={true} 
                scrollable={'scrollable'}
                hideColumnFilter={false}
                selectedId={0} 
                deleteParam={{ operation: "delete" }} 
                childMappingField={'npkBtestparametercode'} 
                extractedColumnList={[
                    { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px" },
                    { "idsName": "IDS_RESULTS", "dataField": "spredefinedname", "width": "200px" },
                    { "idsName": "IDS_COMMENTSUBTYPE", "dataField": "scommentsubtype", "width": "200px" }, 
                    { "idsName": "IDS_COMMENTTYPE", "dataField": "scommenttype", "width": "200px" } ,
                    { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "200px" }   
                ]}
                childList={this.state.childListMap2 && this.state.childListMap2}
                activeTabName={"IDS_COMMENTS"}
                //gridHeight = {'400px'}
                >
            </DataGrid>
        ); 
        tabMap.set("IDS_REPEAT",
        <DataGrid
            key="testsectionkey"
            primaryKeyField="nresultusedmaterialcode"  
            dataResult={this.props.Login.masterData.SelectedRulesEngine && process(
                sortData(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testRepeatTestsTab'], "descending", "npkCtestparametercode")
                || [],
                this.state.dataStaterepeatTab
                    ? this.state.dataStaterepeatTab : { skip: 0, take: 10 })} 
            dataState={this.state.dataStaterepeatTab
                ? this.state.dataStaterepeatTab : { skip: 0, take: 10 }} 
            dataStateChange={this.dataStateChangeRepeatTab} 
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            pageable={true} 
            scrollable={'scrollable'}
            hideColumnFilter={false}
            selectedId={0} 
            deleteParam={{ operation: "delete" }}  
            extractedColumnList={[ 
                { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "200px" },
                { "idsName": "IDS_REPEATCOUNT", "dataField": "nrepeatcountno", "width": "200px" }  

            ]} 
            activeTabName={"IDS_COMMENTS"}
            //gridHeight = {'400px'}
            >
        </DataGrid>
    ); 
    tabMap.set("IDS_ENFORCERESULT",
    <DataGrid
        key="testsectionkey"
        primaryKeyField="nresultusedmaterialcode"  
        dataResult={this.props.Login.masterData.SelectedRulesEngine && process(
            sortData(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testenforceTestsTab'], "descending", "npkDtestparametercode")
            || [],
            this.state.dataStateChangenforceTab
                ? this.state.dataStateChangenforceTab : { skip: 0, take: 10 })} 
        dataState={this.state.dataStateChangenforceTab
            ? this.state.dataStateChangenforceTab : { skip: 0, take: 10 }} 
        dataStateChange={this.dataStateChangenforceTab} 
        controlMap={this.state.controlMap}
        userRoleControlRights={this.state.userRoleControlRights}
        pageable={true} 
        scrollable={'scrollable'}
        hideColumnFilter={false}
        selectedId={0} 
        deleteParam={{ operation: "delete" }}  
        extractedColumnList={[ 
            { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "200px" }, 
            { "idsName": "IDS_PARAMETERS", "dataField": "sparametersynonym", "width": "200px" },
            { "idsName": "IDS_RESULTFLAG", "dataField": "sgradename", "width": "200px" },
            { "idsName": "IDS_RESULTS", "dataField": "senforceresult", "width": "200px" }
        ]} 
        activeTabName={"IDS_COMMENTS"}
        //gridHeight = {'400px'}
        >
    </DataGrid>
); 
        }
        return tabMap;
    }
    dataStateChange = (event, ntestgrouptestparametercode) => {
        let dataStateObject = this.state.dataStateObject || {}
        if (ntestgrouptestparametercode) {
            dataStateObject = {
                ...dataStateObject,
                [ntestgrouptestparametercode]: event.dataState
            }
            this.setState({
                dataStateObject
            });
        }
        else {
            this.setState({
                dataState: event.dataState
            });
        }

    }
    dataStateChangetestRepeat = (event) => {
        this.setState({
            //  dataResult: process(this.props.Login.queryData, event.dataState),
            dataStatetestRepeat: event.dataState
        });
    }
    dataStateChangetestEnforce = (event) => {
        this.setState({
            //  dataResult: process(this.props.Login.queryData, event.dataState),
            dataStatetestEnforce: event.dataState
        });
    }
    dataStateChangetestinitiateTab = (event) => {
        this.setState({
            //  dataResult: process(this.props.Login.queryData, event.dataState),
            dataStatetestinitiate: event.dataState
        });
    }
    dataStateChangeViewParameter = (event) => {
        this.setState({ 
            dataStateChangeViewParameter: event.dataState
        });
    }
    dataStateChangeRepeatTab = (event) => {
        this.setState({
            //  dataResult: process(this.props.Login.queryData, event.dataState),
            dataStaterepeatTab: event.dataState
        });
    } 
    dataStateChangenforceTab = (event) => {
        this.setState({
            //  dataResult: process(this.props.Login.queryData, event.dataState),
            dataStateChangenforceTab: event.dataState
        });
    } 
    dataStateChangeMain = (event) => {
        this.setState({
            dataResultMain: process(this.props.Login.queryDataMain, event.dataStateMain),
            dataStateMain: event.dataStateMain
        });
    }
    ConfirmDeleteRule = (deleteId) => {
        if(this.props.Login.masterData['RulesEngine']&&this.props.Login.masterData['RulesEngine'].length>0){ 
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.handleClickDelete(this.props.Login.masterData, deleteId, "openModal"));
        }
        else{
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRULETODELETE" })); 
        }
    }
    handleClickDelete(masterData, ncontrolcode//, modalName
    ) {
        const fieldArray = [];
        const inputParam = {
            methodUrl: "TestGroupRulesEngine",
            classUrl: "testgrouprulesengine",
            inputData: {
                "ntestgrouptestcode": this.props.Login.masterData.SelectedTest.ntestgrouptestcode,
                "ntestgrouprulesenginecode": this.props.Login.masterData.SelectedRulesEngine.ntestgrouprulesenginecode,
                "userinfo": this.props.Login.userInfo,
                "selectedValueForAudit":{
            sproductcatname:this.state.filterData.nproductcatcode && this.state.filterData.nproductcatcode.label||'NA',
            sproductname:this.state.filterData.nproductcode && this.state.filterData.nproductcode.label||'NA',
            sspecname:this.props.Login.masterData.SelectedSpecification.sspecname||'NA',
            scomponentname:this.props.Login.masterData.SelectedComponent.scomponentname||'NA',
            stestsynonym:this.props.Login.masterData.SelectedTest.stestsynonym||'NA',
            sleveldescription:this.props.Login.masterData.selectedNode.sleveldescription||'NA',
            srulename:this.props.Login.masterData.SelectedRulesEngine.srulename
        }
            },
            operation: "delete", //postParam,
            displayName: "RulesEngine",
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },// [modalName]: true,
                    operation: 'delete', screenName: "IDS_RULESENGINE", id: "RulesEngine"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, undefined
            );
        }

    }

    approveVersion(masterData, nflag, ncontrolcode//, modalName
    ) {
        if (masterData['RulesEngine']&&masterData['RulesEngine'].length > 0) {
            const fieldArray = [];
            const inputParam = {
                methodUrl: "TestGroupRulesEngine",
                classUrl: "testgrouprulesengine",
                inputData: {
                    "ntestgrouptestcode": this.props.Login.masterData.SelectedTest.ntestgrouptestcode,
                    "ntestgrouprulesenginecode": this.props.Login.masterData.SelectedRulesEngine.ntestgrouprulesenginecode,
                    "userinfo": this.props.Login.userInfo, nflag: nflag,
                    "selectedValueForAudit":{
                        sproductcatname:this.state.filterData.nproductcatcode && this.state.filterData.nproductcatcode.label||'NA',
                        sproductname:this.state.filterData.nproductcode && this.state.filterData.nproductcode.label||'NA',
                        sspecname:this.props.Login.masterData.SelectedSpecification.sspecname||'NA',
                        scomponentname:this.props.Login.masterData.SelectedComponent.scomponentname||'NA',
                        stestsynonym:this.props.Login.masterData.SelectedTest.stestsynonym||'NA',
                        sleveldescription:this.props.Login.masterData.selectedNode.sleveldescription||'NA',
                        srulename:this.props.Login.masterData.SelectedRulesEngine.srulename
                    }
                },
                operation: "approve", //postParam,
                displayName: "RulesEngine",
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },// [modalName]: true,
                        operation: 'approve', screenName: "IDS_RULESENGINE", id: "RulesEngine"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, undefined
                );
            }
        }
        else {
            if(nflag==1)
            { 
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRULETOAPPROVE" }));  
            }
            else
            { 
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRULETORETIRE" }));  
            }
        }
    }


    closeModalShow = () => {
        let openModalPopup = this.props.Login.openModalPopup;
        let modalParameterPopup = this.props.Login.modalParameterPopup
        let selectedRecord = this.props.Login.selectedRecord || {};
        selectedRecord['srulename'] = ""
        if( selectedRecord['ParameterRulesEngine']){
            selectedRecord['ParameterRulesEngine']=[]
        }
        openModalPopup = false;
        modalParameterPopup = false;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModalPopup, selectedRecord,modalParameterPopup }
        }
        this.props.updateStore(updateInfo);
    }

    onModalSavePredefAlert =()=>{
        const selectedRecord = this.state.selectedRecord || [];
        let currentAlertResultCode=this.state.currentAlertResultCode||0; 
        let currentntestgrouptestpredefcode=this.state.currentntestgrouptestpredefcode||0; 
        let bool=this.state.selectedRecord.ParameterRulesEngine.some(x=>x['ntestgrouptestparametercode']===currentAlertResultCode) 
        if(bool){
          this.state.selectedRecord.ParameterRulesEngine.map(Parameter=>
              {
                  if(Parameter['ntestgrouptestparametercode']===currentAlertResultCode){ 
                      Parameter['additionalInfoUidata']={ntestgrouptestpredefsubcode: selectedRecord['ntestgrouptestpredefsubcode']}
                      if(selectedRecord['ntestgrouptestpredefsubcode']){
                          if(typeof selectedRecord['ntestgrouptestpredefsubcode']==='string'){
                              Parameter['additionalInfo']=selectedRecord['ntestgrouptestpredefsubcode']
                          }else{
                              Parameter['additionalInfo']="" 
                              Parameter['additionalInfo']=selectedRecord['ntestgrouptestpredefsubcode'].map(x=>x.label+",").join('\n')
                                Parameter['additionalInfo']=Parameter['additionalInfo'].substring(0,
                                   Parameter['additionalInfo'].length-1) 
                          } 
                      } else{
                          Parameter['additionalInfo']=""
                          Parameter['additionalInfoUidata'] && delete Parameter['additionalInfoUidata']
                      }
                      Parameter['ntestgrouptestpredefcode']=currentntestgrouptestpredefcode
                  }
              }
              );  
        } 
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: { selectedRecord: selectedRecord,showAlertGrid:false}
      }
      this.props.updateStore(updateInfo);
      }
  

    closeModalShowPredefAlert = () => {
        let showAlertGrid = this.props.Login.showAlertGrid;
        let  selectedRecord=this.props.Login.selectedRecord; 
        let masterData = this.props.Login.masterData && this.props.Login.masterData
        // masterData['RESelectedTest'].forEach(object => {
        //     object['expanded']&&delete object['expanded'];
        //   });
          selectedRecord['ntestgrouptestpredefsubcode'] &&delete selectedRecord['ntestgrouptestpredefsubcode'] 
        showAlertGrid = false; 
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showAlertGrid   ,masterData,selectedRecord}
        }
        this.props.updateStore(updateInfo);
    }
    onsavevalidation = (selectedRecord) => {
        let grouplist = selectedRecord["groupList"]
        let hasAll = true;
        for (var i = 0; i < grouplist.length; i++) {
            let rules = grouplist[i]
            for (var j = 0; j < rules.length; j++) {
                let props = []
                if (rules[j]["orderresulttype"] && rules[j]["orderresulttype"].value === 1) {
                    props = ["stestname", "ssymbolname", "orderresulttype", "ndiagnosticcasecode"];
                }
                else if (rules[j]["orderresulttype"] && rules[j]["orderresulttype"].value === 3) {
                    if(rules[j]["stestname"] && rules[j]["stestname"]['item']['nparametertypecode'] === parameterType.PREDEFINED)
                    {
                        props = ["stestname", "ssymbolname", "orderresulttype", "ntestgrouptestpredefcode"]; 

                    }
                    else if(rules[j]["stestname"] && rules[j]["stestname"]['item']['nparametertypecode'] === parameterType.CHARACTER)
                    {
                        props = ["stestname", "ssymbolname", "orderresulttype", "ntestgrouptestcharcode"]; 

                    }
                    else if (rules[j]["stestname"] && rules[j]["stestname"]['item']['nparametertypecode'] === parameterType.NUMERIC)
                    {
                        props = ["stestname", "ssymbolname", "orderresulttype", "ntestgrouptestnumericcode"]; 

                    } 
                    else
                    {
                        if (rules[j]["orderresulttype"] && rules[j]["orderresulttype"].value === 1) {
                            props = ["stestname", "ssymbolname", "orderresulttype", "ndiagnosticcasecode"];
                        }
                        else {
                            props = ["stestname", "ssymbolname", "orderresulttype", "ngradecode"];
                        }
                    }
                }
                else {
                    props = ["stestname", "ssymbolname", "orderresulttype", "ngradecode"];
                }
                hasAll = props.every(prop => rules[j].hasOwnProperty(prop));
                if (hasAll === false) {
                    break;
                }
            }
            if (hasAll === false) {
                break;
            }
        }
        return hasAll
    }
    save = () => {
        let inputData = [];
        let siteObject = this.props.Login.siteObject || {};
        let testCommentObject = this.props.Login.testCommentObject || {};
        let reportCommentObject = this.props.Login.reportCommentObject || {};
        let PredefinedParameterOptions= this.props.Login.masterData.PredefinedParameterOptions||[]  

        let testInitiateTests = this.props.Login.testInitiateTests || [];
        let testCommentsTests = this.props.Login.testCommentsTests || [];
        let reportCommentsTests = this.props.Login.reportCommentsTests || [];
 
        let testRepeatTests = this.props.Login.testRepeatTests || [];
        let testenforceTests = this.props.Login.testenforceTests || [];
        let testsInvolvedInRules=[]
        let testsNameInvolvedInRules=[]

        const { selectedRecord } = this.state;
        let rules = []
        //  if (selectedRecord["nproductcatcode"]) {
            if(testInitiateTests.length > 0||testCommentsTests.length > 0||testRepeatTests.length > 0||testenforceTests.length > 0){
        if (selectedRecord["groupList"].length > 0) {
            if (this.onsavevalidation(selectedRecord)) {
                if (selectedRecord["srulename"] && selectedRecord["srulename"] !== "" && this.props.Login.action !== 'update'
                    && this.props.Login.action !== 'IDS_ADDTESTCOMMENTS' && this.props.Login.action !== 'IDS_ADDREPORTCOMMENTS'
                    && this.props.Login.action !== 'IDS_ADDTEST' && this.props.Login.action !== 'IDS_ADDSITE'
                    && this.props.Login.action !== 'IDS_ADDPARAMETER'
                ) {

                    if (selectedRecord["groupList"]) {
                        let groupList = [];
                        let outcomeList = {};
                        groupList = selectedRecord["groupList"];

                        outcomeList['groupList'] = groupList
                        outcomeList['addGroupList'] = this.props.Login.addGroupList
                        outcomeList['testInitiateTests'] = this.props.Login.testInitiateTests && this.props.Login.testInitiateTests
                        outcomeList['testCommentsTests'] = this.props.Login.testCommentsTests && this.props.Login.testCommentsTests
                        outcomeList['testRepeatTests'] = this.props.Login.testRepeatTests && this.props.Login.testRepeatTests
                        outcomeList['testenforceTests'] = this.props.Login.testenforceTests && this.props.Login.testenforceTests

                        outcomeList['reportCommentsTests'] = this.props.Login.reportCommentsTests && this.props.Login.reportCommentsTests
                        outcomeList['siteObject'] = this.props.Login.siteObject && this.props.Login.siteObject
                        outcomeList['testCommentObject'] = this.props.Login.testCommentObject && this.props.Login.testCommentObject
                        outcomeList['reportCommentObject'] = this.props.Login.reportCommentObject && this.props.Login.reportCommentObject
                        outcomeList['testInitiateSiteTab'] = this.props.Login.masterData.testInitiateSiteTab && this.props.Login.masterData.testInitiateSiteTab
                        outcomeList['testCommentsTestsTab'] = this.props.Login.masterData.testCommentsTestsTab && this.props.Login.masterData.testCommentsTestsTab
                        outcomeList['reportCommentsTestsTab'] = this.props.Login.reportCommentsTestsTab && this.props.Login.reportCommentsTestsTab
                        outcomeList['testRepeatTestsTab'] =  this.props.Login.masterData['testRepeatTestsTab']&& this.props.Login.masterData['testRepeatTestsTab']
                        outcomeList['testenforceTestsTab'] =  this.props.Login.masterData['testenforceTestsTab']&& this.props.Login.masterData['testenforceTestsTab']
                        outcomeList['PredefinedParameterOptions']=PredefinedParameterOptions
                        // outcomeList['nproductcatcode'] = selectedRecord['nproductcatcode']
                        outcomeList['ntestgrouptestcode'] = this.props.Login.masterData.SelectedTest.ntestgrouptestcode
                        // outcomeList['nallottedspeccode'] = selectedRecord['nallottedspeccode']
                        // outcomeList['ncomponentcode'] = selectedRecord['ncomponentcode'] 
                        outcomeList['groupListJoins'] = selectedRecord['groupListJoins']?selectedRecord['groupListJoins']:[]

                        let ruleEngineLayout = []
                        let ruleEngineLayoutObject = []
                        let groupRuleObject = {}

                        groupList.map((List) => 
                        List.map(x=>{
                            testsInvolvedInRules.push(x.stestname.item.ntestgrouptestcode);
                            testsNameInvolvedInRules.push(x.stestname.item);
                        }) 
                        )
                        outcomeList['testsNameInvolvedInRules'] = testsNameInvolvedInRules
                        outcomeList['testsInvolvedInRules'] = testsInvolvedInRules
                        groupList.map((List) => {
                            if (List.hasOwnProperty('button_or') && List['button_or'] === true) {
                                if (List.hasOwnProperty('button_not') && List['button_not'] === true) {
                                    groupRuleObject['button_not_button_or'] = List
                                }
                                else {
                                    groupRuleObject['button_or'] = List
                                }
                                // groupRuleObject['button_or'] = List
                                ruleEngineLayout.push(groupRuleObject)
                                groupRuleObject = {}
                            }
                            if (List.hasOwnProperty('button_and') && List['button_and'] === true) {
                                if (List.hasOwnProperty('button_not') && List['button_not'] === true) {
                                    groupRuleObject['button_not_button_and'] = List
                                }
                                else {
                                    groupRuleObject['button_and'] = List
                                }
                                //  groupRuleObject['button_and'] = List
                                ruleEngineLayout.push(groupRuleObject)
                                groupRuleObject = {}
                            }
                        })
                        ruleEngineLayoutObject = groupList.hasOwnProperty('button_or') && groupList['button_or'] === true ?
                            {
                                'button_or': ruleEngineLayout
                            } : {
                                'button_and': ruleEngineLayout
                            }
                       // console.log('savelist--->', JSON.stringify(ruleEngineLayoutObject))
                        //  inputData['nproductcatcode'] = this.props.Login.masterData.SelectedProductCategory.nproductcatcode
                        //  inputData['nproductcatcode'] = selectedRecord['nproductcatcode'].value
                        inputData['ntestgrouptestcode'] = this.props.Login.masterData.SelectedTest.ntestgrouptestcode
                        // inputData['nallottedspeccode'] = selectedRecord['nallottedspeccode'].value
                        // inputData['ncomponentcode'] = selectedRecord['ncomponentcode'].value
                        inputData['srulename'] = selectedRecord['srulename']
                     //   inputData['nruleexecorder'] = parseInt(selectedRecord['nruleexecorder'])
                        inputData['outcomeList'] = JSON.stringify(outcomeList)
                        inputData['jsondata'] = JSON.stringify(ruleEngineLayout)
                        inputData['userinfo'] = this.props.Login.userInfo
                        inputData['selectedValueForAudit']={
                            sproductcatname:this.state.filterData.nproductcatcode && this.state.filterData.nproductcatcode.label||'NA',
                            sproductname:this.state.filterData.nproductcode && this.state.filterData.nproductcode.label||'NA',
                            sspecname:this.props.Login.masterData.SelectedSpecification.sspecname||'NA',
                            scomponentname:this.props.Login.masterData.SelectedComponent.scomponentname||'NA',
                            stestsynonym:this.props.Login.masterData.SelectedTest.stestsynonym||'NA',
                            sleveldescription:this.props.Login.masterData.selectedNode.sleveldescription||'NA',
                            srulename:selectedRecord['srulename']
                        }
                        if (this.props.Login.operation === 'update') {
                            inputData['ntestgrouprulesenginecode'] = this.props.Login.masterData.SelectedRulesEngine['ntestgrouprulesenginecode']
                        }
                        const inputParam = {
                            classUrl: "testgrouprulesengine",
                            methodUrl: "TestGroupRulesEngine",
                            displayName: this.props.Login.inputParam.displayName,
                            inputData: inputData,
                            operation: this.props.Login.operation === 'create' ? 'create' : 'update'
                        }
                        this.props.crudMaster(inputParam, this.props.Login.masterData, "openPortalModal");
                    }
                    else {
                        toast.info(this.props.intl.formatMessage({ id: "IDS_PLEASEADDRULE" }));
                    }

                }
                else {
                    selectedRecord['srulename'] = selectedRecord['srulenamecopy'] || ""
                  //  selectedRecord['nruleexecorder'] = selectedRecord['nruleexecordercopy'] || ""
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { openModalPopup: true, selectedRecord, action: "IDS_SAVERULEMODAL", openmodalsavePopup: true }
                    }
                    this.props.updateStore(updateInfo);
                    //   toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERRULESENGINENAME" }));

                }
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_COMPLETETHERULETOSAVE" }));
            }
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ATLEASTADDONERULE" }));
        } 
    }
    else{
        toast.info(this.props.intl.formatMessage({ id: "IDS_ATLEASTADDONEOUTCOME" })); 
    }
    } 
    onOutcomeChange = (comboData, index) => {
        const { selectedRecord } = this.state;
        selectedRecord["outComeList"] = []
        selectedRecord["outComeList"][index] = []
        selectedRecord["outComeList"][index] = comboData;
        if (selectedRecord["outComeList"][index]) {
            this.setState({
                selectedRecord
            });
        }
    }
    writtenRules = (data) => {
        let selectedRecord = this.state.selectedRecord || {}
        let grouplist = selectedRecord["groupList"]
        let activeTabIndex = this.props.Login.activeTabIndex || 0;
        if (activeTabIndex === 1) {
            let boolean = grouplist.every(x => x.every(y => y['stestname']['item'].ntestgrouptestcode !== data['item'].ntestgrouptestcode)
            )
            if (boolean) {
                return data;
            }
        }
        else {
            let boolean = grouplist.some(x => x.some(y => y['stestname']['item'].ntestgrouptestcode === data['item'].ntestgrouptestcode)
            )
            if (boolean) {
                return data;
            }
        } 
    } 
    selectedTestRemove = (data) => {
        let activeTabIndex = this.props.Login.activeTabIndex || 0;
        if (activeTabIndex === 1) {
            if (this.props.Login.masterData.SelectedTest.ntestgrouptestcode !== data['item'].ntestgrouptestcode) {
                return data;
            }
        }
        else {
            if (this.props.Login.masterData.SelectedTest.ntestgrouptestcode === data['item'].ntestgrouptestcode) {
                return data;
            }
        } 
    }
    outComeTestsRemoveFromRules = (data) => { 
        let testInitiateTests=this.props.Login.testInitiateTests;
        let boolean = testInitiateTests.every(x => x['ntestgrouptestcode']!== data['item'].ntestgrouptestcode)
            if (boolean) {
                return data;
            } 
    }
  

    addTest = (tabName) => {
        let openModalPopup = this.props.Login.openModalPopup;
        let action = this.props.Login.action;
        let selectedRecord = this.props.Login.selectedRecord || {}

        let rulesOption = this.props.Login.masterData.rulesOption || [];
        let testInitiateTestCombo = this.props.Login.masterData.testInitiateTestCombo || [];
        let testCommentsTestCombo = this.props.Login.masterData.testCommentsTestCombo || [];
        let testRepeatTestCombo = this.props.Login.masterData.testRepeatTestCombo || [];
        let testenforceTestCombo = this.props.Login.masterData.testenforceTestCombo || [];

        if (tabName == 'IDS_Test') {
            testInitiateTestCombo = testInitiateTestCombo.filter(this.selectedTestRemove);
            testInitiateTestCombo = testInitiateTestCombo.filter(this.writtenRules);
            selectedRecord['ParameterRulesEngine']&& delete selectedRecord['ParameterRulesEngine'] 
        }
        else if (tabName == 'IDS_COMMENTS') {
            let selectedTestTempArray = []
            selectedTestTempArray = testCommentsTestCombo.filter(this.selectedTestRemove);
            testCommentsTestCombo = testCommentsTestCombo.filter(this.writtenRules);
            let duplicatePresent = selectedTestTempArray.some(x => testCommentsTestCombo.some(y => y['item'].ntestgrouptestcode === x['item'].ntestgrouptestcode))
            if (duplicatePresent) {
                testCommentsTestCombo = testCommentsTestCombo
            } else {
                testCommentsTestCombo = [...testCommentsTestCombo, ...selectedTestTempArray];
            }
        }
        else if (tabName == 'IDS_REPEAT') {
            let selectedTestTempArray = []
            selectedTestTempArray = testRepeatTestCombo.filter(this.selectedTestRemove);
            testRepeatTestCombo = testRepeatTestCombo.filter(this.writtenRules);
            let duplicatePresent = selectedTestTempArray.some(x => testRepeatTestCombo.some(y => y['item'].ntestgrouptestcode === x['item'].ntestgrouptestcode))
            if (duplicatePresent) {
                testRepeatTestCombo = testRepeatTestCombo
            } else {
                testRepeatTestCombo = [...testRepeatTestCombo, ...selectedTestTempArray];
            }
        }
        else if (tabName == 'IDS_ENFORCERESULT') {
            let selectedTestTempArray = []
            selectedTestTempArray = testenforceTestCombo.filter(this.selectedTestRemove);
            testenforceTestCombo = testenforceTestCombo.filter(this.writtenRules);
            let duplicatePresent = selectedTestTempArray.some(x => testenforceTestCombo.some(y => y['item'].ntestgrouptestcode === x['item'].ntestgrouptestcode))
            if (duplicatePresent) {
                testenforceTestCombo = testenforceTestCombo
            } else {
                testenforceTestCombo = [...testenforceTestCombo, ...selectedTestTempArray];
            }
        }
        else {

        }
        selectedRecord['ntestgrouptestcode']&& delete selectedRecord['ntestgrouptestcode']
        selectedRecord['nsampletestcommentscode']&&delete selectedRecord['nsampletestcommentscode']
        selectedRecord['ncommentsubtypecode']&&delete selectedRecord['ncommentsubtypecode']
        selectedRecord['ncommenttypecode']&&delete selectedRecord['ncommenttypecode']
        selectedRecord['sgeneralcomments']&&delete selectedRecord['sgeneralcomments']
        selectedRecord['needoutsource']&&delete selectedRecord['needoutsource']
        selectedRecord['sdescription']&&delete selectedRecord['sdescription']
        selectedRecord['ntestgrouptestparametercode']&&delete selectedRecord['ntestgrouptestparametercode']
        selectedRecord['senforceresult']&&delete selectedRecord['senforceresult']
        selectedRecord['ngradecode']&&delete selectedRecord['ngradecode']
        selectedRecord['nfromsitecode']&&delete selectedRecord['nfromsitecode']
        selectedRecord['ntositecode']&&delete selectedRecord['ntositecode']
        selectedRecord['nrepeatcountno']&&delete selectedRecord['nrepeatcountno']

        if (this.props.Login.addGroupList.length > 0) {
            action = "IDS_ADDTEST"
            openModalPopup = true;
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openModalPopup,
                    modalParameterPopup: false,
                    action,
                    selectedRecord,
                    openmodalsavePopup: false,
                    testInitiateTestCombo,
                    testCommentsTestCombo,
                    testRepeatTestCombo,
                    testenforceTestCombo
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEADDRULETOADDOUTCOME" }));
        }

    }
    onRuleChange = (comboData, fieldName, groupIndex, index) => {
        let PredefinedParameterOptions= this.props.Login.masterData.PredefinedParameterOptions||[] 
        const { selectedRecord } = this.state;
        this.clearSelectedRule(selectedRecord, index); 
        if(selectedRecord["groupList"][groupIndex][index][fieldName]&&
            selectedRecord["groupList"][groupIndex][index][fieldName].value!==comboData.value)
        {
            selectedRecord["groupList"][groupIndex][index]['ndiagnosticcasecode']&& delete selectedRecord["groupList"][groupIndex][index]['ndiagnosticcasecode']
            selectedRecord["groupList"][groupIndex][index]['ngradecode']&&delete selectedRecord["groupList"][groupIndex][index]['ngradecode'] 
            selectedRecord["groupList"][groupIndex][index]['ntestgrouptestpredefcode']&&delete selectedRecord["groupList"][groupIndex][index]['ntestgrouptestpredefcode'] 
            selectedRecord["groupList"][groupIndex][index]['ntestgrouptestcharcode']&&delete selectedRecord["groupList"][groupIndex][index]['ntestgrouptestcharcode'] 
            selectedRecord["groupList"][groupIndex][index]['ntestgrouptestnumericcode']&&delete selectedRecord["groupList"][groupIndex][index]['ntestgrouptestnumericcode']  
            selectedRecord["groupList"][groupIndex][index]['ssymbolname']&&delete selectedRecord["groupList"][groupIndex][index]['ssymbolname']   
        } 
        selectedRecord["groupList"][groupIndex][index][fieldName] = comboData;  
        selectedRecord["groupList"][groupIndex][index][fieldName]['nparenttestgrouptestcode'] = this.props.Login.masterData.SelectedTest.ntestgrouptestcode;  
        selectedRecord["groupList"][groupIndex][index][fieldName]['nparentstestname'] = this.props.Login.masterData.SelectedTest.stestname;  
        if(selectedRecord["groupList"][groupIndex][index]['orderresulttype'])
        {
            if(selectedRecord["groupList"][groupIndex][index]['orderresulttype'].value === 3)
            {
                let nparametertypecode=selectedRecord["groupList"][groupIndex][index][fieldName]['item']['nparametertypecode'] 
                 if(nparametertypecode===parameterType.PREDEFINED)
                {
                    this.props.getParameterResultValue(selectedRecord["groupList"][groupIndex][index],groupIndex,index,PredefinedParameterOptions,selectedRecord, this.props.Login.masterData, this.props.Login.userInfo) 
                }
                else{
                    if (selectedRecord["groupList"][groupIndex][index][fieldName]) {
                        this.setState({
                            selectedRecord,
                            groupIndex,
                            index
                        });
                    }
                }    
            }      else{
                if (selectedRecord["groupList"][groupIndex][index][fieldName]) {
                    this.setState({
                        selectedRecord,
                        groupIndex,
                        index
                    });
                }
            }  
        }
        else{
            if (selectedRecord["groupList"][groupIndex][index][fieldName]) {
                this.setState({
                    selectedRecord,
                    groupIndex,
                    index
                });
            }
        }  
    }
    onRuleInputChange = (event, fieldName, groupIndex, index) => {
        const { selectedRecord } = this.state;
        selectedRecord["groupList"][groupIndex][index][fieldName] = event.target.value;
        selectedRecord["groupList"][groupIndex][index]['sfinal'] = event.target.value; 
        this.setState({ selectedRecord });
    }
    onRuleNumericInputOnChange = (event, fieldName, groupIndex, index) => {
        const { selectedRecord } = this.state;
        if(groupIndex===undefined&&index===undefined)
        {
            selectedRecord[fieldName] =  event;
            this.setState({ selectedRecord }); 
        } 
        else
        {
            if(event!==0){ 
                selectedRecord["groupList"][groupIndex][index][fieldName] =  event;
                selectedRecord["groupList"][groupIndex][index]['sfinal']=  event;
                this.setState({ selectedRecord });
            } 
        } 
    }
    onMasterDataChange = (comboData, fieldName, groupIndex, index) => {
        const { selectedRecord } = this.state;
        let PredefinedParameterOptions= this.props.Login.masterData.PredefinedParameterOptions||[]  
        let isResultorOrderType = [];
        let optionsByRule = [];
        if (this.state.optionsByRule && this.state.optionsByRule.length > 0) {
            optionsByRule = this.state.optionsByRule
        }
        else {
            optionsByRule[groupIndex] = [];
            optionsByRule[groupIndex][index] = [];
        }
        if (this.state.isResultorOrderType && this.state.isResultorOrderType.length > 0) {
            isResultorOrderType = this.state.isResultorOrderType
        }
        else {
            isResultorOrderType[groupIndex] = [];
            isResultorOrderType[groupIndex][index] = [];
        }
        if (fieldName !== 'ndiagnosticcasecode' && fieldName !== 'ngradecode'&&
        fieldName !== 'ntestgrouptestpredefcode' && fieldName !== 'ntestgrouptestcharcode' && fieldName !== 'ntestgrouptestnumericcode') {
            if(selectedRecord["groupList"][groupIndex][index][fieldName]&&
            selectedRecord["groupList"][groupIndex][index][fieldName].value!==comboData.value)
        {
            selectedRecord["groupList"][groupIndex][index]['ndiagnosticcasecode']&& delete selectedRecord["groupList"][groupIndex][index]['ndiagnosticcasecode']
            selectedRecord["groupList"][groupIndex][index]['ngradecode']&&delete selectedRecord["groupList"][groupIndex][index]['ngradecode'] 
            selectedRecord["groupList"][groupIndex][index]['ntestgrouptestpredefcode']&&delete selectedRecord["groupList"][groupIndex][index]['ntestgrouptestpredefcode'] 
            selectedRecord["groupList"][groupIndex][index]['ntestgrouptestcharcode']&&delete selectedRecord["groupList"][groupIndex][index]['ntestgrouptestcharcode'] 
            selectedRecord["groupList"][groupIndex][index]['ntestgrouptestnumericcode']&&delete selectedRecord["groupList"][groupIndex][index]['ntestgrouptestnumericcode']  
            selectedRecord["groupList"][groupIndex][index]['ssymbolname']&&delete selectedRecord["groupList"][groupIndex][index]['ssymbolname']   
        } 
        selectedRecord["groupList"][groupIndex][index][fieldName] = comboData; 
            if (isResultorOrderType[groupIndex] === undefined) {
                isResultorOrderType[groupIndex] = [];
                isResultorOrderType[groupIndex][index] = [];
            }
            isResultorOrderType[groupIndex][index] = comboData.value
            if (optionsByRule[groupIndex] === undefined) {
                optionsByRule[groupIndex] = [];
                optionsByRule[groupIndex][index] = [];
            }
            if (isResultorOrderType[groupIndex][index] === 1) { 
                optionsByRule[groupIndex][index] = this.props.Login.masterData.DiagnosticCaseList
            }
            else if (isResultorOrderType[groupIndex][index] === 3) { 
                let nparametertypecode=selectedRecord["groupList"][groupIndex][index]['stestname']['item']['nparametertypecode'] 
                 if(nparametertypecode===parameterType.PREDEFINED)
                {
                    this.props.getParameterResultValue(selectedRecord["groupList"][groupIndex][index],groupIndex,index,PredefinedParameterOptions,selectedRecord, this.props.Login.masterData, this.props.Login.userInfo) 
                } 
                else
                {
                    optionsByRule[groupIndex][index] = this.props.Login.masterData.GradeList 
                }
            }
            else { 
                optionsByRule[groupIndex][index] = this.props.Login.masterData.GradeList
            }
            this.setState({ selectedRecord, isResultorOrderType, optionsByRule });
        } 
        else {
            selectedRecord["groupList"][groupIndex][index][fieldName] = comboData; 
            selectedRecord["groupList"][groupIndex][index]['sfinal'] = comboData.label; 
            this.setState({ selectedRecord });
        }
    }
    addRule = (type, groupIndex) => {
        const { selectedRecord } = this.state;
        let viewColumnListByRule = this.props.Login.viewColumnListByRule || [];
        const addGroupList = this.props.Login.addGroupList || [];
        const arrayLength = addGroupList[groupIndex];
        addGroupList[groupIndex] = arrayLength + 1;
        selectedRecord["groupList"][groupIndex][arrayLength] = {};
        viewColumnListByRule = this.props.Login.viewColumnList || this.props.Login.databaseviewList;;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                addGroupList,
                viewColumnListByRule,
                activeTabIndex:0
            }
        }
        this.props.updateStore(updateInfo);
    }
    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
    }

    addComments = () => {
        let openModalPopup = this.props.Login.openModalPopup;
        let action = this.props.Login.action;
        let selectedParameterRulesEngine = this.props.Login.masterData.selectedParameterRulesEngine || [];
        let testparameter = this.props.Login.masterData.testCommentsTestCombo || [];
        let selectedRecord = this.props.Login.selectedRecord || {}
        selectedRecord['ntestgrouptestcode'] = {}
        selectedRecord['ntestgrouptestcode'] = testparameter.filter(x => { return x.value === selectedParameterRulesEngine.ntestgrouptestcode })[0]

        delete selectedRecord['nsampletestcommentscode']
        delete selectedRecord['ncommentsubtypecode']
        delete selectedRecord['ncommenttypecode']
        delete selectedRecord['sgeneralcomments']
        delete selectedRecord['sdescription']


        if (this.props.Login.addGroupList.length > 0) {
            if (this.props.Login.activeTabIndex === 2) {
                action = "IDS_ADDTESTCOMMENTS"
            }
            else {
                action = "IDS_ADDREPORTCOMMENTS"
            }
            openModalPopup = true;
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openModalPopup,
                    action,
                    selectedRecord,
                    openmodalsavePopup: false
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEADDRULETOADDOUTCOME" }));
        }

    }
    addModalSite = () => {
        let openModalPopup = this.props.Login.openModalPopup;

        let selectedParameterRulesEngine = this.props.Login.masterData.selectedParameterRulesEngine || [];
        let testparameter = this.props.Login.masterData.testInitiateTestCombo || [];
        let selectedRecord = this.props.Login.selectedRecord || {}
        selectedRecord['ntestgrouptestcode'] = {}
        selectedRecord['ntestgrouptestcode'] = testparameter.filter(x => { return x.value === selectedParameterRulesEngine.ntestgrouptestcode })[0]
        selectedRecord['nfromsitecode']&&delete selectedRecord['nfromsitecode']
        selectedRecord['ntositecode']&&delete selectedRecord['ntositecode']

        openModalPopup = true;
        let action = this.props.Login.action;
        action = "IDS_ADDSITE"
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord,
                openModalPopup,
                action,
                openmodalsavePopup: false
            }
        }
        this.props.updateStore(updateInfo);
    }

    onGradeEvent = (parameterResults, index, parameter) => {
        if (parameterResults.length > 0 && parameterResults[index] !== undefined && parameterResults[index].sresult !== null) {
            let selectedRecord = this.state.selectedRecord || [];
            let selectedResultGrade = this.state.selectedRecord.selectedResultGrade || [];
            if (parameter.nparametertypecode === parameterType.NUMERIC) {
                selectedResultGrade[index] = {
                    ngradecode: parameterResults[index].sresult !== "" ?
                        numericGrade(parameter, numberConversion(parseFloat(parameterResults[index].sresult), parseInt(parameter.nroundingdigits))) : -1
                };
            }
            if (parameter.nparametertypecode === parameterType.PREDEFINED) {
                if (parameterResults[index].sresult !== null) {
                    selectedResultGrade[index] = { ngradecode: parameterResults[index].ngradecode };
                }
                else {
                    selectedResultGrade[index] = { ngradecode: 0 };
                }
            }
            if (parameter.nparametertypecode === parameterType.CHARACTER) {
                if (parameterResults[index].sresult !== null && parameterResults[index].sresult.trim() !== "") { 
                    selectedResultGrade[index] = { ngradecode: 4 };
                }
                else {
                    selectedResultGrade[index] = { ngradecode: -1 };
                }
            } 
            selectedRecord.selectedResultGrade = selectedResultGrade;

            this.setState({
                selectedRecord
            }); 
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
    addParameter= () => {
        let openModalPopup = this.props.Login.openModalPopup;  
        let isServiceNeed=this.props.Login.isServiceNeed===undefined||this.props.Login.isServiceNeed===true?true:false ;
        let selectedParameterRulesEngine = this.props.Login.masterData.selectedParameterRulesEngine || [];
        let testparameter = this.props.Login.masterData.testInitiateTestCombo || [];
        let selectedRecord = this.props.Login.selectedRecord || {}
        selectedRecord['ntestgrouptestpredefsubcode'] &&delete selectedRecord['ntestgrouptestpredefsubcode'] 
        selectedRecord['ntestgrouptestcode'] = {}
        selectedRecord['ntestgrouptestcode'] = testparameter.filter(x => 
            { return x.value === selectedParameterRulesEngine.ntestgrouptestcode })[0]
        selectedRecord['ntestgrouprulesenginecode']=this.props.Login.masterData.SelectedRulesEngine['ntestgrouprulesenginecode']?
        this.props.Login.masterData.SelectedRulesEngine['ntestgrouprulesenginecode']:0;
        selectedRecord['ParameterRulesEngine']&& delete selectedRecord['ParameterRulesEngine'] 
    //    if(isServiceNeed){
            this.props.getParameterRulesEngine(selectedRecord, this.props.Login.masterData, this.props.Login.userInfo,
                this.state.activeTabIndex,"IDS_ADDPARAMETER")
        // }else{
        //     const updateInfo = {
        //         typeName: DEFAULT_RETURN,
        //         data: {
        //             openModalPopup: true,
        //                 modalParameterPopup:true,
        //                 // masterData: {
        //                 //     ...masterData,
        //                 //     ...response.data,
        //                 //     paremterResultcode

        //                 // },
        //                 // selectedRecord: {
        //                 //     ...selectedRecord,
        //                 //     additionalInfo: additionalInfo.length > 0 ? additionalInfo : [],
        //                 //     selectedResultGrade: selectedResultGrade,
        //                 //     ParameterRulesEngine: response.data.TestGroupTestParameterRulesEngine
        //                 // },
        //               ///  loading: false,
        //                 action:"IDS_ADDPARAMETER",
        //                 openmodalsavePopup:false
        //         }
        //     }
        //     this.props.updateStore(updateInfo);
        // }
        
     
        // openModalPopup = true;
        // let action = this.props.Login.action;
        // action = "IDS_ADDPARAMETER"
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: {
        //         selectedRecord,
        //         openModalPopup,
        //         action,
        //         modalParameterPopup :true,
        //         openmodalsavePopup: false
        //     }
        // }
        // this.props.updateStore(updateInfo);
    }
    deletetestparameter = (deleteparameter) => { 
        let masterData = this.props.Login.masterData || {};  
        masterData['testParameter'].map(test=>{
            if(test['ParameterRulesEngine']){
                let parameters=test['ParameterRulesEngine'];
                let tempparameters=[...test['ParameterRulesEngine']]
                tempparameters.map((param,index)=>{
                    if(param['ntestgrouptestparametercode']===deleteparameter['ntestgrouptestparametercode']){
                        //delete parameters[index];
                        let removeIndex=parameters.findIndex(x=>x['ntestgrouptestparametercode']===param['ntestgrouptestparametercode'])
    
                        parameters.splice(removeIndex,1);
                        sortData(test['ParameterRulesEngine'],'ascending','slNo').map((param,index)=>{
                            param['slNo']=index+1;
                        })
                    }
                })
            
            } 
        }); 
        
        this.setState({masterData});
    }
    modalsaveClick = () => {
        let needoutsource = this.props.Login.needoutsource || {};
        let selectedRecord = this.state.selectedRecord || {};
        let masterData = this.props.Login.masterData || {};
        let testInitiateTests = this.props.Login.testInitiateTests || [];
        let testCommentsTests = this.props.Login.testCommentsTests || [];
        let testRepeatTests = this.props.Login.testRepeatTests || [];
        let testenforceTests = this.props.Login.testenforceTests || [];


        let reportCommentsTests = this.props.Login.reportCommentsTests || [];

        let siteObject = this.props.Login.siteObject || {};
        let testCommentObject = this.props.Login.testCommentObject || {};
        let reportCommentObject = this.props.Login.reportCommentObject || {};


        let testInitiateTestsTemp = [];
        let testCommentsTestsTemp = [];
        let reportCommentsTestsTemp = [];
        let testInitiateSiteTemp = [];

        let testCommentsTestsTab = this.props.Login.masterData.testCommentsTestsTab || []; 


        let reportCommentsTestsTab = this.props.Login.reportCommentsTestsTab || [];
        let testInitiateSiteTab = this.props.Login.masterData.testInitiateSiteTab || [];

        let testInitiateTestOptions = this.props.Login.testInitiateTestOptions || [];
        let testCommentsTestOptions = this.props.Login.testCommentsTestOptions || [];
        let reportCommentsTestOptions = this.props.Login.reportCommentsTestOptions || [];


        let testInitiateTestdeletedOptions = this.props.Login.testInitiateTestdeletedOptions || [];
        let testCommentsTestdeletedOptions = this.props.Login.testCommentsTestdeletedOptions || [];
        let reportCommentsTestdeletedOptions = this.props.Login.reportCommentsTestdeletedOptions || [];

        let updateInfo = {}
        if (this.props.Login.action === 'IDS_ADDTEST') {
            let npkAtestparametercode = 0;
            let npkBtestparametercode = 0;
            let npkCtestparametercode = 0;
            let npkDtestparametercode = 0;
            if (this.props.Login.activeTabIndex === 1) {
                let isduplicate = {}
                isduplicate = testInitiateTests.filter(x => x.ntestgrouptestcode ===
                    selectedRecord['ntestgrouptestcode'].item['ntestgrouptestcode'])
                if (isduplicate.length === 0) {
                    masterData['testParameter'] = {}
                    npkAtestparametercode = testInitiateTests.length>0?Math.max(...testInitiateTests.map(x => x.npkAtestparametercode)) : 0;
                    npkAtestparametercode++;
                    selectedRecord['ntestgrouptestcode'].item['npkAtestparametercode'] = npkAtestparametercode 
                    // selectedRecord['ParameterRulesEngine']=selectedRecord['ParameterRulesEngine'].filter(param=>param['sresult']&&param['sresult']!=="");
                    //  let slNo=1;
                    // selectedRecord['ParameterRulesEngine']
                    //      .map((resultData) => {
                    //         if (resultData.nparametertypecode===1) { 
                    //             resultData["ngradecode"] = resultData.sresult !== "" ?
                    //             numericGrade(resultData, resultData["sfinal"]) : -1;
                    //          }
                    //         else if (resultData.nparametertypecode===2)
                    //          {
                    //             resultData["ngradecode"] = resultData.ngradecode; 
                    //             resultData["salertmessage"] = resultData.salertmessage&&resultData.salertmessage;
                    //             resultData["additionalInfo"] = resultData['additionalInfo'];
                    //             resultData["additionalInfoUidata"] = resultData['additionalInfoUidata']===undefined?"":
                    //             resultData['additionalInfoUidata']; 
                    //             resultData["ntestgrouptestpredefcode"]=resultData['ntestgrouptestpredefcode']
                    //             resultData["sresultcomment"]=resultData['sresultcomment']  
                    //          } 
                    //          else if (resultData.nparametertypecode===3)
                    //          {
                    //             resultData["ngradecode"] = resultData.sresult&&resultData.sresult.trim() === "" ? -1 : grade.FIO; 
                    //          }
                    //          else if (resultData.nparametertypecode===4)
                    //          {
                    //             resultData["ngradecode"] = resultData.sresult&&resultData.sresult.trim() === "" ? -1 : grade.FIO; 
                    //          }   
                    //          resultData["slNo"]=slNo;
                    //          slNo++;
                    //     });
                    // selectedRecord['ntestgrouptestcode'].item['ParameterRulesEngine']=sortData(selectedRecord['ParameterRulesEngine'],'descending','slNo')
                    if( selectedRecord['ntestgrouptestcode'].item['nrepeatcountno']){
                        selectedRecord['ntestgrouptestcode'].item['nrepeatcountno']=0;
                    } 
                    selectedRecord['ntestgrouptestcode'].item['ParameterRulesEngine']&&
                    delete selectedRecord['ntestgrouptestcode'].item['ParameterRulesEngine']
                    testInitiateTests.push({...selectedRecord['ntestgrouptestcode'].item,
                    "nneedsample":selectedRecord['nneedsample']===3?3:4});
                    //  ALPD-5797   Added spread operator for test group rules engine outcome delete issue by Vishakh
                    let testParamValues = [...testInitiateTests];
                    masterData['testParameter'] = sortData(testParamValues, 'descending', 'npkAtestparametercode')
                    masterData['selectedParameterRulesEngine'] = {...selectedRecord['ntestgrouptestcode'].item,"nneedsample":selectedRecord['nneedsample']?3:4}
                    delete selectedRecord['ntestgrouptestcode'];
                    delete selectedRecord['nneedsample'];

                }
                else {
                    return toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYEXISTS" }));
                }

            }
            if (this.props.Login.activeTabIndex === 2) {
                let isduplicate = {}
                isduplicate = testCommentsTests.filter(x => x.ntestgrouptestcode ===
                    selectedRecord['ntestgrouptestcode'].item['ntestgrouptestcode'])
                if (isduplicate.length === 0) {
                    masterData['testParameterComments'] = {}
                    npkBtestparametercode = testCommentsTests.length>0?Math.max(...testCommentsTests.map(x => x.npkBtestparametercode)) : 0;
                    npkBtestparametercode++;
                    selectedRecord['ntestgrouptestcode'].item['npkBtestparametercode'] = npkBtestparametercode
                    selectedRecord['ntestgrouptestcode'].item['sdescription'] = selectedRecord['sdescription'] ? selectedRecord['sdescription'] : '-'
                    testCommentsTests.push(selectedRecord['ntestgrouptestcode'].item);
                    masterData['testParameterComments'] = sortData(testCommentsTests, 'descending', 'npkBtestparametercode')
                    masterData['selectedParameterRulesEngine'] = selectedRecord['ntestgrouptestcode'].item
                    //delete selectedRecord['ntestgrouptestcode']
                }
                else {
                    return toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYEXISTS" }));
                }
            }
            if (this.props.Login.activeTabIndex === 3) {
                let isduplicate = {}
                isduplicate = testRepeatTests.filter(x => x.ntestgrouptestcode ===
                    selectedRecord['ntestgrouptestcode'].item['ntestgrouptestcode'])
                if (isduplicate.length === 0) {
                    masterData['testRepeat'] = {}
                    npkCtestparametercode = testRepeatTests.length>0? Math.max(...testRepeatTests.map(x => x.npkCtestparametercode)) : 0;
                    npkCtestparametercode++;
                    selectedRecord['ntestgrouptestcode'].item['npkCtestparametercode'] = npkCtestparametercode
                    selectedRecord['ntestgrouptestcode'].item['nrepeatcountno'] = selectedRecord['nrepeatcountno']?selectedRecord['nrepeatcountno']:1
                    testRepeatTests.push({...selectedRecord['ntestgrouptestcode'].item,
                    "nneedsample":4});
                    masterData['testRepeatTestsTab'] = sortData(testRepeatTests, 'descending', 'npkCtestparametercode')
                    masterData['testRepeat'] = sortData(testRepeatTests, 'descending', 'npkCtestparametercode')
                    masterData['selectedParameterRulesEngine'] = selectedRecord['ntestgrouptestcode'].item
                    delete selectedRecord['ntestgrouptestcode']
                }
                else {
                    return toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYEXISTS" }));
                }
            }
            if (this.props.Login.activeTabIndex === 4) {
                let isduplicate = {}
                // isduplicate = testenforceTests.filter(x => x.ntestgrouptestcode ===
                //     selectedRecord['ntestgrouptestcode'].item['ntestgrouptestcode'])
                    isduplicate=testenforceTests.some(x=>selectedRecord['ntestgrouptestcode'].value===x.ntestgrouptestcode&&selectedRecord['ntestgrouptestparametercode'].value===x.ntestgrouptestparametercode)

                if (!isduplicate) { 
                    masterData['testenforceTests'] = {}
                    npkDtestparametercode = testenforceTests.length>0? Math.max(...testenforceTests.map(x => x.npkDtestparametercode)) : 0;
                    npkDtestparametercode++;
                    // selectedRecord['ntestgrouptestcode'].item['sparametersynonym'] = selectedRecord['ntestgrouptestparametercode'] && selectedRecord['ntestgrouptestparametercode'].label
                    // selectedRecord['ntestgrouptestcode'].item['ngradecode'] = selectedRecord['ngradecode'] && selectedRecord['ngradecode'].value
                    // selectedRecord['ntestgrouptestcode'].item['sgradename'] = selectedRecord['ngradecode'] && selectedRecord['ngradecode'].label
                    // selectedRecord['ntestgrouptestcode'].item['ntestgrouptestparametercode'] = selectedRecord['ntestgrouptestparametercode'] && selectedRecord['ntestgrouptestparametercode'].value
                    // selectedRecord['ntestgrouptestcode'].item['senforceresult'] = selectedRecord['senforceresult'] && selectedRecord['senforceresult']
                    let object={...selectedRecord['ntestgrouptestcode'].item,
                    'sparametersynonym':selectedRecord['ntestgrouptestparametercode'] && selectedRecord['ntestgrouptestparametercode'].label,
                    'ngradecode':selectedRecord['ngradecode'] && selectedRecord['ngradecode'].value,
                    'sgradename': selectedRecord['ngradecode'] && selectedRecord['ngradecode'].label,
                    'ntestgrouptestparametercode':selectedRecord['ntestgrouptestparametercode'] && selectedRecord['ntestgrouptestparametercode'].value,
                    'senforceresult':selectedRecord['senforceresult'] && selectedRecord['senforceresult'],
                'npkDtestparametercode':npkDtestparametercode}
                   // selectedRecord['ntestgrouptestcode'].item['npkDtestparametercode'] = npkDtestparametercode
                    testenforceTests.push(object);
                    masterData['testenforceTestsTab'] = sortData(testenforceTests, 'descending', 'npkDtestparametercode') 
                    masterData['testenforceTests'] = sortData(testenforceTests, 'descending', 'npkDtestparametercode')
                    //  masterData['selectedParameterRulesEngine'] = selectedRecord['ntestgrouptestcode'].item
                    delete selectedRecord['ntestgrouptestcode']
                }
                else {
                    return toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYEXISTS" }));
                }
            }
            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openModalPopup: false,
                   
                    masterData,
                    testInitiateTests,
                    testCommentsTests,
                    reportCommentsTests,
                    npkAtestparametercode,
                    npkBtestparametercode,
                    npkCtestparametercode,
                    testInitiateTestOptions,
                    testInitiateTestdeletedOptions,
                    selectedRecord,
                    testRepeatTests,
                    testenforceTests
                }
            }
        }
        if(this.props.Login.action === 'IDS_ADDPARAMETER'){
            let selectedntestgrouptestcode=masterData.selectedParameterRulesEngine.ntestgrouptestcode;
            let selectedParameterRulesEngine=masterData.selectedParameterRulesEngine.ParameterRulesEngine; 
            selectedRecord['ParameterRulesEngine']=selectedRecord['ParameterRulesEngine'].filter(param=>param['sresult']&&param['sresult']!=="");
          let slNo=selectedParameterRulesEngine===undefined||(selectedParameterRulesEngine&&selectedParameterRulesEngine.length===0)?1:selectedParameterRulesEngine.length+1;
            selectedRecord['ParameterRulesEngine']
                         .map((resultData) => {
                            if (resultData.nparametertypecode===1) { 
                                resultData["ngradecode"] = resultData.sresult !== "" ?
                                numericGrade(resultData, resultData["sresult"]) : -1;


                                resultData["sresult"] = resultData.sresult;
                                resultData["sfinal"] = resultData.sresult !== "" ?
                                        numberConversion(parseFloat(resultData.sresult), parseInt(resultData.nroundingdigits)) : "";
                                resultData["ngradecode"] = resultData.sresult !== "" ?
                                        numericGrade(resultData, resultData["sfinal"]) : -1;

                             }
                            else if (resultData.nparametertypecode===2)
                             {
                                resultData["ngradecode"] = resultData.ngradecode; 
                                resultData["salertmessage"] = resultData.salertmessage&&resultData.salertmessage;
                                resultData["additionalInfo"] = resultData['additionalInfo'];
                                resultData["additionalInfoUidata"] = resultData['additionalInfoUidata']===undefined?"":
                                resultData['additionalInfoUidata']; 
                                resultData["ntestgrouptestpredefcode"]=resultData['ntestgrouptestpredefcode']
                                resultData["sresultcomment"]=resultData['sresultcomment']  
                                resultData["sresultpredefinedname"]=resultData['sresultpredefinedname']  
                                resultData["sfinal"]=resultData['sfinal']   

                             } 
                             else if (resultData.nparametertypecode===3)
                             {
                                resultData["sresult"] = resultData.sresult;
                                resultData["sfinal"] = resultData.sresult; 
                                resultData["ngradecode"] = resultData.sresult&&resultData.sresult.trim() === "" ? -1 : ResultEntry.RESULTSTATUS_FIO; 

                             }
                             else if (resultData.nparametertypecode===4)
                             {
                                resultData["ngradecode"] = resultData.sresult&&resultData.sresult.trim() === "" ? -1 : ResultEntry.RESULTSTATUS_FIO; 
                             }   
                             resultData['sgradename']=this.props.Login.masterData.GradeValues[resultData["ngradecode"]][0]['sgradename'] 
                            resultData["slNo"]=slNo;
                         slNo++;
                        });   
                        masterData['testParameter'].map((param) => { 
                                if (param['ntestgrouptestcode'] ===selectedntestgrouptestcode) {
                                    if(param['ParameterRulesEngine']){ 
                                        param['ParameterRulesEngine']= param['ParameterRulesEngine'].concat(sortData(selectedRecord['ParameterRulesEngine'],'descending','slNo'));

                                    }else{
                                        param['ParameterRulesEngine']= sortData(selectedRecord['ParameterRulesEngine'],'descending','slNo');

                                    }
                                }
                            }); 
                            //  ALPD-5797   Added spread operator for test group rules engine outcome delete issue by Vishakh
                            let testParamValues = [...masterData['testParameter']];
                            testInitiateTests=testParamValues;
                            updateInfo = {
                                typeName: DEFAULT_RETURN,
                                data: {
                                    openModalPopup: false,
                                    masterData,
                                    testInitiateTests,
                                    modalParameterPopup:false ,
                                    isServiceNeed:false
                                }
                            }
        }
        if (selectedRecord['nsampletestcommentscode'] || selectedRecord['sgeneralcomments']
        ) {
            masterData['testComments'] = {}
            let npKAsampletestcommentscode = 0;
            let nslno = 0;

            let object = {
                ncommentsubtypecode: selectedRecord['ncommentsubtypecode'],
                scommentsubtype: selectedRecord['ncommentsubtypecode']['label'],
                stestsynonym: selectedRecord['ntestgrouptestcode']['label'], 
                ncommenttypecode: selectedRecord['ncommenttypecode']['value'],
                scommenttype: selectedRecord['ncommenttypecode']['label'],
                nsampletestcommentscode: selectedRecord['nsampletestcommentscode'] ? selectedRecord['nsampletestcommentscode'] : -1,
                // spredefinedname: selectedRecord['nsampletestcommentscode'] ? selectedRecord['nsampletestcommentscode'].label : "-",
                // sgeneralcomments: selectedRecord['sgeneralcomments'] ? selectedRecord['sgeneralcomments'] : "-",
                spredefinedname:selectedRecord['nsampletestcommentscode']? selectedRecord['nsampletestcommentscode'].label:
                selectedRecord['sgeneralcomments'] ? selectedRecord['sgeneralcomments'] : "-",
                scomments: selectedRecord['sdescription'] ? selectedRecord['sdescription'] : '-',
                sdescription: selectedRecord['sdescription'] ? selectedRecord['sdescription'] : '-'  
                , stestparametersynonym: masterData.selectedParameterRulesEngine.stestparametersynonym,
                ntestgrouptestcode: masterData.selectedParameterRulesEngine.ntestgrouptestcode,
                npkBtestparametercode:masterData.selectedParameterRulesEngine.npkBtestparametercode
            }
            nslno= testCommentsTestsTab.length>0? Math.max(...testCommentsTestsTab.map(x => x.nslno)):0; 
            nslno++;
            if (testCommentObject.hasOwnProperty(masterData.selectedParameterRulesEngine.npkBtestparametercode)) {
                npKAsampletestcommentscode = Math.max(...testCommentObject[masterData.selectedParameterRulesEngine.npkBtestparametercode].map(x => x.npKAsampletestcommentscode));
                npKAsampletestcommentscode++;
                object = { ...object, npKAsampletestcommentscode: npKAsampletestcommentscode,nslno:nslno }
                testCommentsTestsTemp = testCommentObject[masterData.selectedParameterRulesEngine.npkBtestparametercode]
                testCommentsTestsTemp.push(object);
                testCommentsTestsTab.push(object);
                let commentsArrayIndex=testCommentsTests.findIndex(x=>x.npkBtestparametercode===masterData.selectedParameterRulesEngine.npkBtestparametercode)
                testCommentsTests[commentsArrayIndex]['commentsArray']=[];
                testCommentsTests[commentsArrayIndex]['commentsArray']=sortData(testCommentsTestsTemp, 'ascending', 'npKAsampletestcommentscode')
                testCommentObject[masterData.selectedParameterRulesEngine.npkBtestparametercode] = sortData(testCommentsTestsTemp, 'descending', 'npKAsampletestcommentscode')
                delete selectedRecord['nsampletestcommentscode']
                delete selectedRecord['ncommentsubtypecode']
                delete selectedRecord['ncommenttypecode']
                delete selectedRecord['sgeneralcomments']
            }
            else {
                npKAsampletestcommentscode++;
                object = { ...object, npKAsampletestcommentscode: npKAsampletestcommentscode,nslno:nslno }
                testCommentsTestsTemp.push(object);
                testCommentsTestsTab.push(object);
                let commentsArrayIndex=testCommentsTests.findIndex(x=>x.npkBtestparametercode===masterData.selectedParameterRulesEngine.npkBtestparametercode)
                testCommentsTests[commentsArrayIndex]['commentsArray']=[];
                testCommentsTests[commentsArrayIndex]['commentsArray']=sortData(testCommentsTestsTemp, 'ascending', 'npKAsampletestcommentscode')
                testCommentObject[masterData.selectedParameterRulesEngine.npkBtestparametercode] = sortData(testCommentsTestsTemp, 'descending', 'npKAsampletestcommentscode')
                delete selectedRecord['nsampletestcommentscode']
                delete selectedRecord['ncommentsubtypecode']
                delete selectedRecord['ncommenttypecode']
                delete selectedRecord['sgeneralcomments']
            }
            masterData['testComments'] = testCommentObject
            masterData['testCommentsTestsTab'] = testCommentsTestsTab 
            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openModalPopup: false,
                    masterData,
                    testCommentObject, 
                    npKAsampletestcommentscode,
                    selectedRecord
                }
            }
        }
        if (selectedRecord['nfromsitecode'] && selectedRecord['ntositecode']) {
          
            if(selectedRecord['nfromsitecode'].value!==selectedRecord['ntositecode'].value){
           
            let siteseqnumber = 0;
            if (siteObject.hasOwnProperty(masterData.selectedParameterRulesEngine.npkAtestparametercode)) {
                let isalreadyExist=siteObject[masterData.selectedParameterRulesEngine.npkAtestparametercode].some(x=>selectedRecord['nfromsitecode'].value===x.nfromsitecode&&selectedRecord['ntositecode'].value===x.ntositecode)
                if(!isalreadyExist){
                    masterData['testSite'] = {}
                siteseqnumber = Math.max(...siteObject[masterData.selectedParameterRulesEngine.npkAtestparametercode].map(x => x.npksitecode));
                siteseqnumber++;
                let object = {
                    npksitecode: siteseqnumber, sfromsitename: selectedRecord['nfromsitecode'].label, stositename: selectedRecord['ntositecode'].label,
                    nfromsitecode: selectedRecord['nfromsitecode'].value, ntositecode: selectedRecord['ntositecode'].value
                    , stestparametersynonym: masterData.selectedParameterRulesEngine.stestparametersynonym, npkAtestparametercode: masterData.selectedParameterRulesEngine.ntestgrouptestcode
                }
                testInitiateSiteTemp = siteObject[masterData.selectedParameterRulesEngine.npkAtestparametercode]
                testInitiateSiteTemp.push(object);
                testInitiateSiteTab.push(object);
                siteObject[masterData.selectedParameterRulesEngine.npkAtestparametercode] = sortData(testInitiateSiteTemp, 'descending', 'npksitecode')
                delete selectedRecord['ntestgrouptestcode']
                delete selectedRecord['nfromsitecode'];
                delete selectedRecord['ntositecode'];
            }
            else
            {
                return toast.warn(this.props.intl.formatMessage({ id: "IDS_FROMANDTOSITEALREADYEXIST" }));  
            }

            }
            else {
                masterData['testSite'] = {}
                siteseqnumber++;
                let object = {
                    npksitecode: siteseqnumber, sfromsitename: selectedRecord['nfromsitecode'].label, stositename: selectedRecord['ntositecode'].label,
                    nfromsitecode: selectedRecord['nfromsitecode'].value, ntositecode: selectedRecord['ntositecode'].value
                    , stestparametersynonym: masterData.selectedParameterRulesEngine.stestparametersynonym, npkAtestparametercode: masterData.selectedParameterRulesEngine.npkAtestparametercode
                }
                testInitiateSiteTemp.push(object);
                testInitiateSiteTab.push(object);
                siteObject[masterData.selectedParameterRulesEngine.npkAtestparametercode] = sortData(testInitiateSiteTemp, 'descending', 'npksitecode')
                delete selectedRecord['ntestgrouptestcode']
                delete selectedRecord['nfromsitecode'];
                delete selectedRecord['ntositecode'];
            }
            masterData['testSite'] = siteObject
            masterData['testInitiateSiteTab'] = testInitiateSiteTab 
            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openModalPopup: false,
                    masterData,
                    siteObject,
                    siteseqnumber,
                    
                }
            }
        }
        else
        {
           toast.warn(this.props.intl.formatMessage({ id: "IDS_FROMANDTOSITECANNOTBESAME" })); 
        }
   
        }
        if (Object.keys(updateInfo).length > 0) {
            this.props.updateStore(updateInfo);
        }
    }
    deletModalSite = (inputparam, action, row) => {
        let temparray = [];
        let index = 0;

        let testInitiateSiteTab = this.props.Login.masterData.testInitiateSiteTab
        let testCommentsTestsTab = this.props.Login.masterData.testCommentsTestsTab
        let reportCommentsTestsTab = this.props.Login.reportCommentsTestsTab


        let siteObject = this.props.Login.siteObject || {};
        let testCommentObject = this.props.Login.testCommentObject || {};
        let reportCommentObject = this.props.Login.reportCommentObject || {};
        let masterData = this.props.Login.masterData || {};



        if (this.props.Login.activeTabIndex === 1) {
            temparray = siteObject[masterData.selectedParameterRulesEngine.npkAtestparametercode]
            temparray.splice(row['dataIndex'], 1);
            testInitiateSiteTab.splice(row['dataIndex'], 1);
            siteObject[masterData.selectedParameterRulesEngine.npkAtestparametercode] = temparray

        }
        if (this.props.Login.activeTabIndex === 2) {
            temparray = testCommentObject[masterData.selectedParameterRulesEngine.npkBtestparametercode]
            index = temparray.findIndex(x => x.npKAsampletestcommentscode === row['dataItem'].npKAsampletestcommentscode)
            // temparray.splice(row['dataIndex'], 1);
            temparray.splice(index, 1);
            index = testCommentsTestsTab.findIndex(x => x.nslno === row['dataItem'].nslno)
            //   testCommentsTestsTab.splice(row['dataIndex'], 1);
            testCommentsTestsTab.splice(index, 1);
            testCommentObject[masterData.selectedParameterRulesEngine.npkBtestparametercode] = temparray
        }
        if (this.props.Login.activeTabIndex === 3) {
            temparray = masterData.testRepeat
            temparray.splice(row['dataIndex'], 1);
            reportCommentsTestsTab.splice(row['dataIndex'], 1);
            reportCommentObject[masterData.selectedParameterRulesEngine.ntestgrouptestcode] = temparray
        }
        let updateInfo = {}
        updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                siteObject,
                testCommentObject,
                reportCommentObject,
                testInitiateSiteTab,
                reportCommentsTestsTab,
                testCommentsTestsTab
            }
        }
        this.props.updateStore(updateInfo);
    }
    deleteModalTest = (inputparam, action, row) => {
        //  ALPD-5797   Added spread operator for test group rules engine outcome delete issue by Vishakh
        let testInitiateTests = [...this.props.Login.testInitiateTests] || [];
        let testCommentsTests = this.props.Login.testCommentsTests || [];
        let testRepeatTests = this.props.Login.testRepeatTests || [];
        let testenforceTests = this.props.Login.testenforceTests || [];
        let reportCommentsTests = this.props.Login.reportCommentsTests || [];
        let testInitiateSiteTab = this.props.Login.masterData.testInitiateSiteTab 
        let testCommentsTestsTab = this.props.Login.masterData.testCommentsTestsTab
        let testRepeatTestsTab = this.props.Login.masterData.testRepeatTestsTab
        let testenforceTestsTab = this.props.Login.masterData.testenforceTestsTab

        let siteObject = this.props.Login.siteObject || {};
        let testCommentObject = this.props.Login.testCommentObject || {};
        let reportCommentObject = this.props.Login.reportCommentObject || {};


        let testInitiateTestOptions = this.props.Login.testInitiateTestOptions || [];
        let testCommentsTestOptions = this.props.Login.testCommentsTestOptions || [];
        let reportCommentsTestOptions = this.props.Login.reportCommentsTestOptions || [];
        let viewColumnListByRule = this.props.Login.viewColumnListByRule || [];


        let testInitiateTestdeletedOptions = this.props.Login.testInitiateTestdeletedOptions || [];
        let testCommentsTestdeletedOptions = this.props.Login.testCommentsTestdeletedOptions || [];
        let reportCommentsTestdeletedOptions = this.props.Login.reportCommentsTestdeletedOptions || [];

        let masterData = this.props.Login.masterData || {};
        let index = 0;
        if (this.props.Login.activeTabIndex === 1) {
           // index = this.props.Login.testInitiateTests.findIndex(x => x.ntestgrouptestcode === masterData.selectedParameterRulesEngine.ntestgrouptestcode)
            index = this.props.Login.testInitiateTests.findIndex(x => x.npkAtestparametercode === inputparam.testParameter.npkAtestparametercode)
            testInitiateTests.splice(index, 1);
            // ALPD-5797    Uncommented by Vishakh for deleted test is not removing in ui
            index =  masterData['testParameter'].findIndex(x => x.ntestgrouptestcode === inputparam.testParameter.ntestgrouptestcode)
            masterData['testParameter'].splice(index, 1); 
           
            testInitiateSiteTab=testInitiateSiteTab.filter(function( obj ) {
                return obj.npkAtestparametercode !== inputparam.testParameter.npkAtestparametercode;
            }) 
            delete siteObject[inputparam.testParameter.npkAtestparametercode]
        }
        if (this.props.Login.activeTabIndex === 2) {
            index = this.props.Login.testCommentsTests.findIndex(x => x.npkBtestparametercode === inputparam.testParameterComments.npkBtestparametercode)
            testCommentsTests.splice(index, 1); 
            // index =  testCommentsTestsTab.findIndex(x => x.ntestgrouptestcode === inputparam.testParameterComments.ntestgrouptestcode) 
            // testCommentsTestsTab.splice(index, 1);
            testCommentsTestsTab=testCommentsTestsTab.filter(function( obj ) {
                return obj.npkBtestparametercode !== inputparam.testParameterComments.npkBtestparametercode;
            }) 
            delete testCommentObject[inputparam.testParameterComments.npkBtestparametercode]
        }
        if (this.props.Login.activeTabIndex === 3) {
          //  index = this.props.Login.testRepeatTests.findIndex(x => x.ntestgrouptestcode === masterData.selectedParameterRulesEngine.ntestgrouptestcode) 
            index=row['dataIndex'] 
            testRepeatTests.splice(index, 1);
            testRepeatTestsTab.splice(index, 1); 
        }
        if (this.props.Login.activeTabIndex === 4) {
        //    index = this.props.Login.testenforceTests.findIndex(x => x.ntestgrouptestcode === masterData.selectedParameterRulesEngine.ntestgrouptestcode)  
            index=row['dataIndex']
            testenforceTests.splice(index, 1);
            testenforceTestsTab.splice(index, 1); 
        }
        let updateInfo = {}
        updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                testInitiateTests,
                siteObject,
                testCommentObject,
                testCommentsTests,
                reportCommentsTests,
                reportCommentObject,
                masterData:{...masterData,   testCommentsTestsTab,testInitiateSiteTab,
                    testRepeatTestsTab,
                    testenforceTestsTab},
                testRepeatTests,
                testenforceTests,
             
            }
        }
        this.props.updateStore(updateInfo);
    }
    onmodalComboChange = (comboData, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        let isneedsgeneralcomments = this.state.isneedsgeneralcomments || {} 
        let action=this.props.Login.action;
        if (fieldName === 'ncommentsubtypecode') {
            if (comboData.value === 6) {
                isneedsgeneralcomments = true
                delete selectedRecord['nsampletestcommentscode']
            }
            else {
                isneedsgeneralcomments = false
                delete selectedRecord['sgeneralcomments']

            }
        }
        else if (fieldName === 'nproductcatcode') {
            selectedRecord[fieldName] = comboData;
            this.props.getSpecificationTestGroupRulesEngine(selectedRecord, this.props.Login.selectedRecord, true, this.props.Login.masterData, this.props.Login.userInfo)
        }
        else if (fieldName === 'ntestgrouptestcode' && (this.state.activeTabIndex === 4//||this.state.activeTabIndex === 1
            ) ) {

            if (selectedRecord['ntestgrouptestparametercode']) {
                if (selectedRecord[fieldName].value !== comboData.value) {
                    delete selectedRecord['ntestgrouptestparametercode']
                }
            }
            selectedRecord[fieldName] = comboData;
            selectedRecord['ntestgrouprulesenginecode']=this.props.Login.masterData.SelectedRulesEngine['ntestgrouprulesenginecode']?
        this.props.Login.masterData.SelectedRulesEngine['ntestgrouprulesenginecode']:0;
            this.props.getParameterforEnforce(selectedRecord, this.props.Login.masterData, this.props.Login.userInfo
                ,this.state.activeTabIndex,action)

        }
        //This is to Get Parameter Results from the User
        else if (fieldName === 'ntestgrouptestparametercode' && (this.state.activeTabIndex === 1) ) { 
            let updateInfo = {}
            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    screenName:'IDS_TESTGROUPRESULTENTRY', 
                    openModal:true
                }
            }
            this.props.updateStore(updateInfo);

        }
        else if (fieldName === 'nallottedspeccode') {
            selectedRecord[fieldName] = comboData;
            this.props.getComponentTestGroupRulesEngine(selectedRecord, this.props.Login.selectedRecord, true, this.props.Login.masterData, this.props.Login.userInfo)
        }
        if (fieldName === 'nsampletestcommentscode') {
            selectedRecord['sdescription'] = comboData.item.sdescription;
        }
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord, isneedsgeneralcomments });
    }

  onResultInputChange = (event, index, parameter)=> {
        let selectedRecord = this.state.selectedRecord || [];
        let ParameterRulesEngine = this.state.selectedRecord.ParameterRulesEngine ? this.state.selectedRecord.ParameterRulesEngine : [];
        let sresult = "";
        let sfinal = "";
        let sresultpredefinedname = "";
        let salertmessage = "";
        let sresultcomment = "";
        let sgradename="";
        let value = -1;
        let acceptedFile = [];
        let ncalculatedresult;
        let currentAlertResultCode = 0;
        let currentntestgrouptestpredefcode = 0;
        let inputData = {} 
        if (parameter.nparametertypecode === parameterType.NUMERIC) {
            if (/^-?\d*?\.?\d*?$/.test(event.target.value) || event.target.value === "") {
                sresult = event.target.value;
                ncalculatedresult = 4
            } else {
                sresult = ParameterRulesEngine[index]['sresult'] === null ? "" : ParameterRulesEngine[index]['sresult'];
                ncalculatedresult = ParameterRulesEngine[index]['ncalculatedresult'];
            } 
        }
        if (parameter.nparametertypecode === parameterType.PREDEFINED) {
            currentAlertResultCode = event.item.ntestgrouptestparametercode;
            currentntestgrouptestpredefcode = event.item.ntestgrouptestpredefcode;
            if (event != null) {
                sresult = event.item.spredefinedname;
                sresultpredefinedname = event.item.sresultpredefinedname;
                sfinal = event.item.spredefinedsynonym
                value = event.item.ngradecode;
                salertmessage = event.item.salertmessage ? event.item.salertmessage : "";
                sresultcomment = event.item.spredefinedcomments ? event.item.spredefinedcomments : "";
                ncalculatedresult = 4;
            
            }
            else {
                sresult = "";
                sfinal = "";
                sresultpredefinedname = "";
                value = -1;
                ncalculatedresult = 4
            }
            inputData = {
                'ntestgrouptestpredefcode': event.item.ntestgrouptestpredefcode,
                'salertmessage': salertmessage,
                'nneedresultentryalert': event.item.nneedresultentryalert,
                'nneedsubcodedresult': event.item.nneedsubcodedresult
            }
            if (event.item.nneedresultentryalert === transactionStatus.NO &&
                event.item.nneedsubcodedresult === transactionStatus.NO) {
                if (ParameterRulesEngine[index]['additionalInfo']) {
                    ParameterRulesEngine[index]['additionalInfo'] = ""
                }
                if (ParameterRulesEngine[index]['additionalInfoUidata']) {
                    ParameterRulesEngine[index]['additionalInfoUidata'] = ""
                }
            } 
        }
        if (parameter.nparametertypecode === parameterType.CHARACTER) {
            sresult = event.target.value;
            if (event.target.value.trim() === ""){
                ncalculatedresult = -1;
            }
            else{
                ncalculatedresult = 4;
            }  
        }
        if (parameter.nparametertypecode === parameterType.ATTACHMENT) {
            sresult = event[0].name;
            acceptedFile = event;
            ncalculatedresult = 4 
        }
        ParameterRulesEngine[index]['sresult'] = sresult
        ParameterRulesEngine[index]['sfinal'] = sfinal
        ParameterRulesEngine[index]['sresultpredefinedname'] = sresultpredefinedname
        ParameterRulesEngine[index]['sresultcomment'] = sresultcomment
        ParameterRulesEngine[index]['salertmessage'] = salertmessage
        ParameterRulesEngine[index]['acceptedFile'] = acceptedFile
        ParameterRulesEngine[index]['editable'] = true
        ParameterRulesEngine[index]['ngradecode'] = value
        ParameterRulesEngine[index]['ncalculatedresult'] = ncalculatedresult

        selectedRecord.ParameterRulesEngine = ParameterRulesEngine
        if (parameter.nparametertypecode === parameterType.PREDEFINED) {
            this.props.getPredefinedDataRulesEngine(inputData, selectedRecord, currentAlertResultCode, this.props.Login.masterData)
        }
        this.setState({
            selectedRecord: selectedRecord,
            currentAlertResultCode,
            currentntestgrouptestpredefcode 
        });

    }



    getOutcomeDetails = (inputParam) => {
        let masterData = this.props.Login.masterData || {};
        const testParameter = this.state.activeTabIndex === 1 ? inputParam.testParameter : this.state.activeTabIndex === 2 ?
            inputParam.testParameterComments : inputParam.testParameterreportComments;
        masterData['selectedParameterRulesEngine'] = {}
        masterData['selectedParameterRulesEngine'] = testParameter;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData
            }
        }
        this.props.updateStore(updateInfo);
    }
    viewParameter=(param)=>{
        let masterData = this.props.Login.masterData || {};
        masterData['ParameterRulesEngine']=param['ParameterRulesEngine']
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                showAlertGrid:true,
                masterData,
                showParameterGrid:true
            }
        }
        this.props.updateStore(updateInfo); 
    }
    handleExpandChange = () => {
        let childListMap1 =  new Map();
        let childListMap2 =   new Map();
        let childListMap3 =  new Map();
        let childListMap =  new Map(); 
        if (this.props.Login.masterData.activeTabName === 'IDS_Test') { 
            let keylst = this.props.Login.masterData.activeTabName === 'IDS_Test' ?
                Object.keys(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['siteObject']) :
                this.props.Login.masterData.activeTabName === 'IDS_COMMENTS' ?
                    Object.keys(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testCommentObject']) :
                    Object.keys(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['reportCommentObject'])
            keylst.map(key => {
                childListMap.set(parseInt(key),
                    Object.values(this.props.Login.masterData.activeTabName === 'IDS_Test' ?
                        this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['siteObject'][key] :
                        this.props.Login.masterData.activeTabName === 'IDS_COMMENTS' ?
                            this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testCommentObject'][key] :
                            this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['reportCommentObject'][key]));
            })
            this.setState({ childListMap })
        }
        if (this.props.Login.masterData.activeTabName === 'IDS_COMMENTS') {
            let keylst = Object.keys(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testCommentObject'])
            keylst.map(key => {
                childListMap2.set(parseInt(key),
                    Object.values(
                        this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testCommentObject'][key]));
            })
            this.setState({ childListMap2 })
        }
        if (this.props.Login.masterData.activeTabName === 'IDS_REPORTCOMMENTS') {
            let keylst =
                Object.keys(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['reportCommentObject']);
            keylst.map(key => {
                childListMap3.set(parseInt(key),
                    Object.values(
                        this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['reportCommentObject'][key]));
            })
            this.setState({ childListMap3 })
        }
    }
    viewOutcome = (props) => {
        if(this.props.Login.masterData['RulesEngine']&&this.props.Login.masterData['RulesEngine'].length>0){ 
            let  masterData= this.props.Login.masterData
            masterData['SelectedRulesEngine']=props['SelectedRulesEngine'][0]
            if(masterData['SelectedRulesEngine']['jsonuidata']&&masterData['SelectedRulesEngine']['jsonuidata']['testInitiateTests'])
            {
                 masterData['SelectedRulesEngine']['jsonuidata']['testInitiateTests'].forEach(object => {
                    object['expanded']&&delete object['expanded'];
                  });
            } 
            masterData['activeTabName']='IDS_Test'
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                screenName: "IDS_VIEWOUTCOME",
                operation: "IDS_VIEW",
                openModal: true,
                masterData
            }
        }
        this.props.updateStore(updateInfo);
    }
    else{
        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRULETOVIEWOUTCOME" })); 
    }
    }
    openflowview = (props) => {
        if(this.props.Login.masterData['RulesEngine']&&this.props.Login.masterData['RulesEngine'].length>0){
           let  masterData= this.props.Login.masterData 
        masterData['SelectedRulesEngine']=props['SelectedRulesEngine'][0]
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                screenName: "IDS_VIEWRULE",
                operation: "IDS_VIEW",
                openModal: true,
                masterData
            }
        }
        this.props.updateStore(updateInfo);
    }
    else{
        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRULETOVIEWRULE" })); 
    }
    } 
    handlePageChangeRuleEngine = (event) => {
        this.setState({
            skipRulesEngine: event.skip,
            takeRulesEngine: event.take
        });
    }
    addGroup = () => {

        const { selectedRecord } = this.state;
        let viewColumnListByRule = this.props.Login.viewColumnListByRule || [];
        const addGroupList = this.props.Login.addGroupList || [];
        const arrayLength = addGroupList.length;
        addGroupList[arrayLength] = 1;

        viewColumnListByRule = this.props.Login.databaseviewList;
        if (arrayLength === 0) {
            selectedRecord["groupList"] = [];
            selectedRecord["filtercolumns"] = this.props.Login.selectFields;
        }
        if (selectedRecord["groupListJoins"] === undefined) {
            selectedRecord["groupListJoins"] = []
        }
        if (selectedRecord["groupListJoins"][arrayLength - 1] === undefined) {
            selectedRecord["groupListJoins"][arrayLength - 1] = {}
        }
        selectedRecord["groupListJoins"][arrayLength - 1]["button_and"] = true;

        selectedRecord["groupList"][arrayLength] = [];
        selectedRecord["groupList"][arrayLength]["button_and"] = true;
        selectedRecord["groupList"][arrayLength][0] = {};

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                addGroupList,
                viewColumnListByRule,
                selectedRecord,
                activeTabIndex:0
            }
        }
        this.props.updateStore(updateInfo);
    }
    getTestGroupRulesEngineAdd = () => {
        //   if (this.state.selectedcombo['nproductcatcode']) {
        //    const sqlQuery = false;
        //this.setState({ selectedRecord: {} });
        let selectedRecord = this.state.selectedRecord || {}
        this.props.getTestGroupRulesEngineAdd(this.props.Login.userInfo, false, {
            addRuleList: [], addGroupList: [],
            addAggregateList: [], addOrderbyList: []
        }, this.props.Login.masterData);
        //  } else {
        //       toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTPRODUCTCATEGORY" }));

        //   }


    }
    closePortalModal = () => {
        let masterData = this.props.Login.masterData || {};
        masterData['testParameter'] = {}
        masterData['testParameterComments'] = {}
        masterData['testParameterreportComments'] = {}
        masterData['testComments'] = {}
        masterData['reportComments'] = {}
        masterData['testSite'] = {}
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: this.props.Login.operation !== 'update' ? {
                activeTabIndex: 0,
                openPortalModal: false, selectedRecord: {}, addRuleList: [], count: 0,
                masterData, testInitiateTests: [], reportCommentsTests: [],
                testCommentsTests: [], siteObject: {}, testCommentObject: {}, reportCommentObject: {},
                npkAtestparametercode: 0,
                npkBtestparametercode: 0,
                npkCtestparametercode: 0,
                testInitiateSiteTab: [],
                testCommentsTestsTab: [],
                reportCommentsTestsTab: []
            } : {
                activeTabIndex: 0,
                openPortalModal: false, selectedRecord: {}, addRuleList: [], count: 0,
                masterData,
                //  testInitiateTests: [], reportCommentsTests: [],
                // testCommentsTests: [], siteObject: {}, testCommentObject: {}, reportCommentObject: {},
                npkAtestparametercode: 0,
                npkBtestparametercode: 0,
                npkCtestparametercode: 0
                // ,
                // testInitiateSiteTab: [],
                // testCommentsTestsTab: [],
                // reportCommentsTestsTab: []
            }
        }
        this.props.updateStore(updateInfo);
    }
    changePropertyView = (index, event, status) => {

        let id = false;
        let activeTabIndex
        let activeTabId
        let masterData = this.props.Login.masterData || {};
        let activeTestTab = this.props.Login.activeTestTab || ""
        const { selectedRecord } = this.state;
        if (selectedRecord["groupList"].length > 0) {
            if (this.onsavevalidation(selectedRecord)) {
                if (window.innerWidth > 992 && event && this.state.enableAutoClick || !event) {
                    activeTabIndex = this.state.activeTabIndex !== index ? index : id ? index : false;
                }
                if (window.innerWidth > 992 && event && this.state.enableAutoClick || !event) {
                    if (index === 1) {
                        activeTestTab = 'IDS_Test'
                        masterData['selectedParameterRulesEngine'] = this.props.Login.testInitiateTests && this.props.Login.testInitiateTests[0]
                    }
                    if (index === 2) {
                        activeTestTab = 'IDS_COMMENTS'
                        masterData['selectedParameterRulesEngine'] = this.props.Login.testCommentsTests && this.props.Login.testCommentsTests[0]
                    }
                    if (index === 3) {
                        activeTestTab = 'IDS_REPEAT'
                        masterData['selectedParameterRulesEngine'] = this.props.Login.testRepeatTests && this.props.Login.testRepeatTests[0]
                    }
                    if (index === 4) {
                        activeTestTab = 'IDS_ENFORCERESULT'
                        masterData['selectedParameterRulesEngine'] = this.props.Login.testEnforceTests && this.props.Login.testEnforceTests[0]
                    }
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            activeTabIndex: index === 0 ? 0 : this.state.activeTabIndex !== index ? index : id ? index : false,
                            activeTabId: id,
                            activeTestTab,
                            masterData
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_FILLTHERULETOADDOUTCOME" }));
            }
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ATLEASTADDONERULETOADDOUTCOME" }));
        }
    }


    deleteRule = (groupIndex, index) => {
        let addGroupList = this.props.Login.addGroupList || [];
        const selectedRecord = this.state.selectedRecord;
        addGroupList[groupIndex] = addGroupList[groupIndex] - 1;

        if (addGroupList[groupIndex] === 0) {
            addGroupList.splice(groupIndex, 1);
            selectedRecord["groupList"].splice(groupIndex, 1);
            if (selectedRecord["groupListJoins"]) {
                selectedRecord["groupListJoins"].splice(groupIndex - 1, 1);
            }
        } else {
            selectedRecord["groupList"][groupIndex].splice(index, 1);
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { addGroupList, selectedRecord,
                activeTabIndex:0 }
        }
        this.props.updateStore(updateInfo);
    }
    deleteOutcome = (index) => {
        let addOutcomeList = this.props.Login.addOutcomeList;
        addOutcomeList.splice(index, 1);
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { addOutcomeList }
        }
        this.props.updateStore(updateInfo);
    }
    clearSelectedRule(selectedRecord, index) {
        selectedRecord["sinputname_" + index] && delete selectedRecord["sinputname_" + index];
        selectedRecord["ssymbolname_" + index] && delete selectedRecord["ssymbolname_" + index];
        selectedRecord["snumericinput_" + index] && delete selectedRecord["snumericinput_" + index];
        selectedRecord["columnname_" + index] && delete selectedRecord["columnname_" + index];
        selectedRecord["snumericinputtwo_" + index] && delete selectedRecord["snumericinputtwo_" + index];
        selectedRecord["dateinput_" + index] && delete selectedRecord["dateinput_" + index];
        selectedRecord["dateinputtwo_" + index] && delete selectedRecord["dateinputtwo_" + index];
    }

    clearRule = () => {
        const sviewname = this.state.selectedRecord.sviewname || "";
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { addRuleList: [], selectedRecord: { sviewname }, sqlQuery: false }
        }
        this.props.updateStore(updateInfo);
    }

    resetRule = () => {
        let masterData = this.props.Login.masterData || {};
        let selectedRecord = this.state.selectedRecord || {}
        masterData['testParameter'] = {}
        masterData['testParameterComments'] = {}
        masterData['testParameterreportComments'] = {}
        masterData['testComments'] = {}
        masterData['reportComments'] = {}
        masterData['testRepeat'] = []
        masterData['testenforceTests'] = []
        masterData['testSite'] = {}
        if (selectedRecord["groupList"]) {
            selectedRecord["groupList"] = []

        }
        if (selectedRecord["groupListJoins"]) {
            selectedRecord["groupListJoins"] = []

        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                addRuleList: [], addGroupList: [], masterData,
                addAggregateList: [], addOrderbyList: [], testInitiateTests: [], reportCommentsTests: [],
                testCommentsTests: [], siteObject: {}, testCommentObject: {}, reportCommentObject: {}, selectedRecord, testRepeatTests: [],
                testenforceTests: [],
                activeTabIndex:0
            }
        }
        this.props.updateStore(updateInfo);

    }

    onSymbolChange = (comboData, fieldName, groupIndex, index) => {
        const { selectedRecord } = this.state;
        const oldSelectedRecord = selectedRecord["groupList"][groupIndex][index][fieldName] || {};
        selectedRecord["groupList"][groupIndex][index][fieldName] = comboData;
        this.setState({ selectedRecord, groupIndex, index });
    }
	//ALPD-3418
      TestGroupMorefields( testMoreFields){
        testMoreFields=this.props.Login.hideQualisForms && this.props.Login.hideQualisForms.findIndex(item=>item.nformcode === formCode.TESTPACKAGE) === -1?testMoreFields : testMoreFields=testMoreFields && testMoreFields.filter(item=>{ return item[1]!=='IDS_TESTPACKAGE'})
        return testMoreFields;

    }
        
    

    onInputChange = (event, type, groupIndex, index) => {
        const selectedRecord = this.state.selectedRecord || {};
        let needoutsource = this.state.needoutsource || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === 'needoutsource' && event.target.checked === true) {
                needoutsource = true
            }
            else {
                needoutsource = false
                delete selectedRecord['nfromsitecode'];
                delete selectedRecord['ntositecode'];
            }
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord, needoutsource });
    }
    onInputSwitchChange=(event)=>{
        const selectedRecord = this.state.selectedRecord || {};
        let testInitiateTests=[];
        let selectedParameterRulesEngine={};
        let testParameter = this.props.Login.masterData.testParameter;
        if (event.target.type === 'checkbox') {
            let testcode=this.props.Login.masterData.selectedParameterRulesEngine.ntestgrouptestcode;
            let activeValue=this.props.Login.testInitiateTests;
            activeValue.map(item=>{
                if(item.ntestgrouptestcode===testcode){
                    testInitiateTests.push({...item,'nneedsample':event.target.checked === true ? 3 : 4})
                    selectedParameterRulesEngine={...item,'nneedsample':event.target.checked === true ? 3 : 4}
                }else{
                    testInitiateTests.push({...item})
                }
            })
            // ALPD-5797    Added testParameter by Vishakh for toggle change not updating in ui
            testParameter.map(item => {
                if(item.ntestgrouptestcode === testcode){
                    item["nneedsample"] = event.target.checked === true ? 3 : 4
                }
            })
        }
        //selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        //this.setState({ selectedRecord });
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData:{...this.props.Login.masterData,"selectedParameterRulesEngine":selectedParameterRulesEngine, "testParameter": testParameter},
                testInitiateTests:testInitiateTests
            }
        }
        this.props.updateStore(updateInfo);

    }



    viewColumnListByRule = (list) => {
        let activeTabIndex = this.props.Login.activeTabIndex

        if (activeTabIndex !== 0) {
            let selectedRecord = this.props.Login.selectedRecord && this.props.Login.selectedRecord
            let dynamicList = activeTabIndex === 1 ? this.props.Login.testInitiateTests : activeTabIndex === 2 ? this.props.Login.testCommentsTests
                : activeTabIndex === 3 ? this.props.Login.testRepeatTests : activeTabIndex === 4 ? this.props.Login.testenforceTests : ""
            if (dynamicList !== undefined && dynamicList)
                list = list.filter(({ value }) => !dynamicList.some(x => x.ntestgrouptestcode == value))
        }
        return list
    }
    onConditionClick = (fieldName, index, isgroup) => {
        let { selectedRecord } = this.state;
        selectedRecord["groupListJoins"] = selectedRecord["groupListJoins"] || []
        if (index !== undefined && isgroup === false) {
            if (fieldName === `button_and`) {
                selectedRecord["groupList"][index][fieldName] = selectedRecord["groupList"][index][fieldName] === true ? true : true;
                selectedRecord["groupList"][index][`button_or`] = false;
            } else if (fieldName === `button_or`) {
                selectedRecord["groupList"][index][fieldName] = selectedRecord["groupList"][index][fieldName] === true ? true : true;
                selectedRecord["groupList"][index][`button_and`] = false;
            } else if (fieldName === `button_not`) {
                selectedRecord["groupList"][index][fieldName] = selectedRecord["groupList"][index][fieldName] === true ? false : true;
            }
            else {

            }
            this.setState({ selectedRecord });
        }
        else {
            if (fieldName === `button_and`) {
                if (selectedRecord["groupListJoins"][index] === undefined) {
                    selectedRecord["groupListJoins"][index] = {}
                }
                selectedRecord["groupListJoins"][index][fieldName] = selectedRecord["groupListJoins"][index][fieldName] === true ? true : true;
                selectedRecord["groupListJoins"][index][`button_or`] = false;
            }
            if (fieldName === `button_or`) {
                if (selectedRecord["groupListJoins"][index] === undefined) {
                    selectedRecord["groupListJoins"][index] = {}
                }
                selectedRecord["groupListJoins"][index][fieldName] = selectedRecord["groupListJoins"][index][fieldName] === true ? true : true;
                selectedRecord["groupListJoins"][index][`button_and`] = false;
            }
            if (fieldName === `button_not`) {
                if (selectedRecord["groupListJoins"][index] === undefined) {
                    selectedRecord["groupListJoins"][index] = {}
                }
                selectedRecord["groupListJoins"][index][fieldName] = selectedRecord["groupListJoins"][index][fieldName] === true ? false : true;
            }
            this.setState({ selectedRecord });
        }

    }


    //Rules Engine Functions End
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
    onFilterComboChange = (comboData, fieldName, caseNo) => {
        let tempFilterData = this.state.tempFilterData || {};
        let inputParam = {};
        switch (caseNo) {
            case 1:
                tempFilterData[fieldName] = comboData;
                inputParam = {
                    inputData: {
                        userinfo: this.props.Login.userInfo,
                        sampletype: comboData.item,
                        tempFilterData
                    },
                    methodUrl: "/getProductCategory"
                }
                this.props.sampleTypeOnChange(inputParam, this.props.Login.masterData);
                break;

            case 2:
                tempFilterData[fieldName] = comboData;
                inputParam = {
                    inputData: {
                        userinfo: this.props.Login.userInfo,
                        sampletype: tempFilterData.nsampletypecode.item,
                        productcategory: comboData.item,
                        tempFilterData
                    },
                    methodUrl: "/getProduct"
                }
                this.props.sampleTypeOnChange(inputParam, this.props.Login.masterData);
                break;

            case 3:
                tempFilterData[fieldName] = comboData;
                inputParam = {
                    inputData: {
                        userinfo: this.props.Login.userInfo,
                        sampletype: tempFilterData.nsampletypecode.item,
                        productcategory: tempFilterData.nproductcatcode.item,
                        product: comboData.item,
                        project:comboData.item,
                        tempFilterData
                    },
                    methodUrl: "/getTreeVersionTemplate"
                }
                this.props.sampleTypeOnChange(inputParam, this.props.Login.masterData);
                break;

            case 4:
                tempFilterData[fieldName] = comboData;
                this.setState({ tempFilterData });
                break;

            case 5:
                const selectedRecord = this.state.selectedRecord;
                selectedRecord[fieldName] = comboData;
                const TestGroupSpecSampleType = this.props.Login.testGroupInputData.TestGroupSpecSampleType || {};
                let testGroupSpecSampleType = {};
                if (this.props.Login.screenName === (this.props.Login.genericLabel && this.props.Login.genericLabel["Component"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode])) {
                    testGroupSpecSampleType = selectedRecord["ncomponentcode"] ? selectedRecord["ncomponentcode"].item : TestGroupSpecSampleType[0].item;
                } else {
                    testGroupSpecSampleType = this.props.Login.masterData.SelectedComponent;
                }
                inputParam = {
                    userinfo: this.props.Login.userInfo,
                    testcategory: comboData.item,
                    testgroupspecsampletype: testGroupSpecSampleType,
                    nallottedspeccode: this.props.Login.masterData.SelectedSpecification["nallottedspeccode"],
                    selectedRecord
                }
                this.props.changeTestCategory(inputParam, this.props.Login.testGroupInputData);
                break;
            case 6:
                tempFilterData[fieldName] = comboData;
                inputParam = {
                    inputData: {
                        userinfo: this.props.Login.userInfo,
                        nprojecttypecode:tempFilterData.nprojecttypecode.value,
                        projecttype:tempFilterData.nprojecttypecode.item,
                       // sampletype: tempFilterData.nsampletypecode.item,
                       // productcategory: comboData.item,
                        tempFilterData
                    },
                    classUrl:"/projectmaster",
                    methodUrl: "/getApprovedProjectByProjectType"
                }
                this.props.sampleTypeOnChange(inputParam, this.props.Login.masterData);
                break;
           
            default:
                break;
        }
    }

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        if (dateValue === null) {
            dateValue = new Date();
        }
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    onNumericInputChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }

    onSaveClick = (saveType, formRef) => {
        let inputParam = {};
        let masterData=this.props.Login.masterData;
        let clearSelectedRecordField = [];
        if (this.props.Login.screenName === "IDS_PROFILETREE"
            || this.props.Login.screenName === "IDS_EDITTREE") {
            inputParam = this.onSaveTree(saveType, formRef);
            // clearSelectedRecordField = [
            //     { "controlType": "textarea", "idsName": "IDS_CODEDRESULT", "dataField": "sleveldescription", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
            //     { "controlType": "textarea", "idsName": "IDS_CODEDRESULTSYNONYM", "dataField": "spredefinedsynonym", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
            //     { "controlType": "textarea", "idsName": "IDS_RESULTPARAMETERCOMMENTS", "dataField": "spredefinedcomments", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
            //     { "controlType": "checkbox", "idsName": "IDS_AlERTFORRESULTENTRY", "dataField": "nneedresultentryalert", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
            //     { "controlType": "checkbox", "idsName": "IDS_SUBCODERESULTNEED", "dataField": "nneedsubcodedresult", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
            //     { "controlType": "textarea", "idsName": "IDS_ALERTMESSAGE", "dataField": "salertmessage", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
            // ]
        } else if (this.props.Login.screenName === "IDS_SPECIFICATION") {
            inputParam = this.onSaveSpecification(saveType, formRef);
            // ALPD-4757, Commented because, it is not required to make isCopy as false when save.
            // if (masterData && masterData.selectedRecordCopy) {
            //     masterData.selectedRecordCopy.isCopy = false;
            // }
            delete masterData.CopyOpenNodes;
//ALPD-5279 Test Group - while adding a spec in test group with save & continue, the sample category name is not visible insted a numeric value is displayed.
            clearSelectedRecordField = [
                //{ "controlType": "textarea", "idsName": "IDS_SELECTEDPROFILE", "dataField": "sselectedprofilename", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                //{ "controlType": "textarea", "idsName": "IDS_SPECNAME", "dataField": "scopyspecname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                //{ "controlType": "textarea", "idsName": "IDS_PRODUCTNAME", "dataField": "sproductname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                //{ "controlType": "textarea", "idsName": "IDS_PRODUCTCATNAME", "dataField": "sproductcatname", "width": "150px","controlName": "sproductcatname", "mandatoryLabel": "IDS_ENTER","isClearField":true},
                //{ "controlType": "checkbox", "idsName": "IDS_PRODUCTCATNAME", "dataField": "nneedsubcodedresult", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                { "controlType": "textarea", "idsName": "IDS_SPECNAME", "dataField": "sspecname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "checkbox", "idsName": "IDS_ACTIVE", "dataField": "ntransactionstatus", "width": "150px","controlName": "ntransactionstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":1 },
                { "controlType": "checkbox", "idsName": "IDS_COMPONENTREQUIRED", "dataField": "ncomponentrequired", "width": "150px","controlName": "ncomponentrequired", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                { "controlType": "textarea", "idsName": "IDS_SELECTEDPROFILE", "dataField": "sselectedprofilename", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_SPECNAME", "dataField": "scopyspecname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                
                // { "controlType": "textarea", "idsName": "IDS_SPECNAME", "dataField": "sspecname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
            ]

        } else if (this.props.Login.screenName ===this.props.Login.genericLabel["Component"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode]) {
            inputParam = this.onSaveComponent(saveType, formRef);
        } else if (this.props.Login.screenName === "IDS_COPYSPECIFICATION") {
            inputParam = this.onSaveCopySpecification(saveType, formRef);

            clearSelectedRecordField = [
                { "controlType": "textarea", "idsName": "IDS_SELECTEDPROFILE", "dataField": "sselectedprofilename", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_SPECNAME", "dataField": "scopyspecname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                // { "controlType": "textarea", "idsName": "IDS_PRODUCTNAME", "dataField": "sproductname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                // { "controlType": "checkbox", "idsName": "IDS_AlERTFORRESULTENTRY", "dataField": "sproductcatname", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                // { "controlType": "checkbox", "idsName": "IDS_PRODUCTCATNAME", "dataField": "nneedsubcodedresult", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                 { "controlType": "textarea", "idsName": "IDS_SPECNAME", "dataField": "sspecname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                //{ "controlType": "checkbox", "idsName": "IDS_ACTIVE", "dataField": "ntransactionstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":1 },
                //{ "controlType": "checkbox", "idsName": "IDS_COMPONENTREQUIRED", "dataField": "ncomponentrequired", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
            ]

        } else if (this.props.Login.screenName === "IDS_TEST"
            || this.props.Login.screenName === "IDS_EDITTESTGROUPTEST") {
            inputParam = this.onSaveTest(saveType, formRef);
        } else if (this.props.Login.screenName === "IDS_SPECFILE") {
            inputParam = this.onSaveSpecFile(saveType, formRef);

            clearSelectedRecordField = [
                
                { "controlType": "textarea", "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "slinkdescription", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "NA", "idsName": "IDS_FILE", "dataField": "sfilename", "width": "200px", "mandatoryLabel": "IDS_SELECT","isClearField":true }, // ALPD-5522 - Test Group -> when adding a spec file using "Save & Continue," the file field is not displayed, and the link dropdown is cleared.
                { "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "ndefaultstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                { "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "nlinkdefaultstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
            ]

        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            //ALPD-5444 Test Group - Copy the spec in test group and do save continue loading issue occurs.
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, openModal: true, operation: this.props.Login.operation,
                    screenData: { inputParam, masterData,clearSelectedRecordField },
                    saveType
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            if(this.props.Login.screenName === "IDS_SPECIFICATION" || this.props.Login.screenName === "IDS_COPYSPECIFICATION" || 
               this.props.Login.screenName === "IDS_SPECFILE"
            )
            {
                this.props.crudMaster(inputParam, masterData, "openModal", {},"",clearSelectedRecordField);
            }
            else
            {
            this.props.crudMaster(inputParam, masterData, "openModal", {});
        }
    }
    }

    onSaveTest = (saveType, formRef) => {
        const operation = this.props.Login.operation;
        const masterData = this.props.Login.masterData;
        const selectedRecord = this.state.selectedRecord;
        let inputData = {};
        const userinfo = this.props.Login.userInfo;
        let postParam = undefined;
        if (operation === "create") {
            const testArray = selectedRecord.ntestcode.map(test => 
                { return {...test.item,nisvisible:transactionStatus.YES,nisadhoctest:transactionStatus.NO} });
            inputData = {
                testgroupspecification: masterData.SelectedSpecification,
                testgroupspecsampletype: [masterData.SelectedComponent],
                testgrouptest: testArray, userinfo
            }
        } else {
            postParam = {
                inputListName: "TestGroupTest", selectedObject: "SelectedTest", primaryKeyField: "ntestgrouptestcode",
                primaryKeyValue: masterData.SelectedTest ? masterData.SelectedTest.ntestgrouptestcode : 0,
                fetchUrl: "testgroup/getTestGroupTest", fecthInputObject: { userinfo: this.props.Login.userInfo },
                masterData: this.props.Login.masterData, searchFieldList, changeList: ["TestGroupTestFormula", "TestGroupTestNumericParameter",
                    "TestGroupTestPredefinedParameter", "TestGroupTestCharParameter", "TestGroupTestParameter"], isSingleSelect: true
            }
            let testgrouptestfile = null;
            let testGroupFile = selectedRecord.ntestfilecode;
            if (testGroupFile) {
                testGroupFile = testGroupFile.item;
                testgrouptestfile = {
                    nlinkcode: testGroupFile.nlinkcode,
                    nattachmenttypecode: testGroupFile.nattachmenttypecode,
                    sdescription: testGroupFile.sdescription,
                    ssystemfilename: testGroupFile.ssystemfilename,
                    dcreateddate: testGroupFile.dcreateddate,
                    nfilesize: testGroupFile.nfilesize,
                    ntestgroupfilecode: selectedRecord.ntestgroupfilecode,
                    ntestgrouptestcode: selectedRecord.ntestgrouptestcode,
                    sfilename: testGroupFile.sfilename,
                    nstatus: transactionStatus.ACTIVE
                };
            }
            inputData = {
                testgroupspecification: masterData.SelectedSpecification,
                testgrouptest: {
                    ntestgrouptestcode: selectedRecord.ntestgrouptestcode,
                    nsectioncode: selectedRecord.nsectioncode.value,
                    //nsourcecode: selectedRecord.nsourcecode.value,
                    nmethodcode: selectedRecord.nmethodcode ? selectedRecord.nmethodcode.value : transactionStatus.NA,
                    ninstrumentcatcode: selectedRecord.ninstrumentcatcode ? selectedRecord.ninstrumentcatcode.value : transactionStatus.NA,
                    ncontainertypecode: selectedRecord.ncontainertypecode ? selectedRecord.ncontainertypecode.value : transactionStatus.NA,
                    stestsynonym: selectedRecord.stestsynonym,
                    ncost: selectedRecord.ncost,
                    nsorter: selectedRecord.nsorter,
                    nspecsampletypecode: selectedRecord.nspecsampletypecode,
                    nrepeatcountno: selectedRecord.nrepeatcountno,
                    ntestpackagecode: selectedRecord.ntestpackagecode ? selectedRecord.ntestpackagecode.value : transactionStatus.NA,
                    nisvisible:transactionStatus.YES,nisadhoctest:transactionStatus.NO

                },
                testgrouptestfile, userinfo
            }
        }
        const inputParam = {
            inputData,
            classUrl: "testgroup",
            operation: operation,
            methodUrl: "Test",
            saveType, formRef, searchRef: this.searchRef,
            postParam
        }
        return inputParam;
    }

    onSaveTree = (saveType, formRef) => {
        const operation = this.props.Login.operation;
        const selectedRecord = this.state.selectedRecord;
        let inputData = {
            userinfo: this.props.Login.userInfo
        };
        if (operation === "update") {
            const selectedNode = this.props.Login.masterData.selectedNode;
            inputData["treetemplatemanipulation"] = {
                ntemplatemanipulationcode: selectedRecord.ntemplatemanipulationcode,
                sleveldescription: selectedRecord.sleveldescription,
                nsampletypecode: selectedNode.nsampletypecode,
                ntreeversiontempcode: selectedNode.ntreeversiontempcode,
                nproductcatcode: selectedNode.nproductcatcode,
                nproductcode: selectedNode.nproductcode,
                nprojectmastercode: selectedNode.nprojectmastercode,
            }
            inputData["selectednode"] = this.props.Login.masterData.ActiveKey;
        } else {
            const TreetempTranstestGroup = this.props.Login.TreetempTranstestGroup;
            const filterData = this.state.filterData;
            const selectedRecord = this.state.selectedRecord;
            let treetemplatemanipulation = [];
            let tempArray = filterRecordBasedOnTwoArrays(TreetempTranstestGroup, selectedRecord.treetemplatemanipulation, "ntemptranstestgroupcode");

            tempArray.map(item => {
                const treeData = {
                    ntreeversiontempcode: item.ntreeversiontempcode,
                    npositioncode: item.nlevelno - 1,
                    sleveldescription: item.sleveldescription,
                    ntemptranstestgroupcode: item.ntemptranstestgroupcode,
                    nformcode: 62,
                    schildnode: "",
                    nnextchildcode: item.schildnode,
                    ntemplatemanipulationcode: item.ntemplatemanipulationcode,
                    isreadonly: item.ntemplatemanipulationcode > 0 ? true : false,
                    slevelformat: item.slevelformat
                }
                return treetemplatemanipulation.push(treeData);
            });


            selectedRecord.treetemplatemanipulation.map(item => {
                const treeTemplateManip = TreetempTranstestGroup.filter(temp => temp.ntemptranstestgroupcode === item.ntemptranstestgroupcode);
                if (treeTemplateManip.length > 0) {
                    item["ntemplatemanipulationcode"] = treeTemplateManip["ntemplatemanipulationcode"];
                } else {
                    item["ntemplatemanipulationcode"] = 0;
                }
                return treetemplatemanipulation.push(item);
            });

            inputData["treetemplatemanipulation"] = treetemplatemanipulation;
            inputData["sampletype"] = filterData.nsampletypecode.item;
            inputData["ncategorycode"] = filterData.nproductcatcode.value;
            inputData["nproductcode"] = filterData.nsampletypecode.item.ncategorybasedflowrequired === transactionStatus.YES ? -1 : filterData.nproductcatcode.item.ncategorybasedflow == transactionStatus.YES ? -1 :
                filterData.nproductcode.value ? filterData.nproductcode.value : -1;
            inputData["ntreeversiontempcode"] = filterData.ntreeversiontempcode.value;
          //  inputData["nprojectmastercode"] = filterData.nprojectmastercode ? filterData.nprojectmastercode.value:-1;
            inputData["nprojectmastercode"] = filterData.nprojectmastercode ? filterData.nsampletypecode.item.nprojectspecrequired === transactionStatus.YES ? filterData.nprojectmastercode.value :-1:-1;
        }
        const inputParam = {
            inputData,
            classUrl: "testgroup",
            operation: operation,
            methodUrl: "Tree",
            saveType, formRef
            
        }
        return inputParam;
    }

    onSaveSpecification = (saveType, formRef) => {
        const operation = this.props.Login.operation;
        const selectedRecord = this.state.selectedRecord;
        let selectedCopyNodeManipulationCode = this.state.selectedRecord.selectedCopyNodeManipulationCode || -1;

        let testGroupSpec = {
            napproveconfversioncode: -1,
            sversion: '',
            napprovalstatus: transactionStatus.DRAFT,
            nstatus: transactionStatus.ACTIVE,
            ntransactionstatus: selectedRecord["ntransactionstatus"],
            ncomponentrequired: selectedRecord["ncomponentrequired"],
            //   nclinicalspec: selectedRecord["nclinicalspec"],
           // nprojectcode: selectedRecord["nprojectcode"] ? selectedRecord["nprojectcode"] : -1,
            nprojectmastercode: this.state.filterData.nprojectmastercode ? this.state.filterData.nsampletypecode.item.nprojectspecrequired === transactionStatus.YES ? this.state.filterData.nprojectmastercode.value :-1 : -1,
            sspecname: operation==="copy"?selectedRecord["scopyspecname"]:selectedRecord["sspecname"],
            dexpirydate: selectedRecord["dexpirydate"],
            nallottedspeccode: selectedRecord["nallottedspeccode"] ? selectedRecord["nallottedspeccode"] : 0,
            ntzexpirydate: selectedRecord["ntzexpirydate"].value,
            stzexpirydate: selectedRecord["ntzexpirydate"].label
        };

        const dexpirydate = testGroupSpec["dexpirydate"];
        //need this conversion when the datatype of the field is 'Instant'
        testGroupSpec["dexpirydate"] = formatInputDate(dexpirydate, false);

        if (operation === "create") {
            testGroupSpec["ntemplatemanipulationcode"] = this.props.Login.masterData.selectedNode.ntemplatemanipulationcode
        }
        let ntreeversiontempcode = this.state.filterData.ntreeversiontempcode.value;
        
        const inputData = {
            userinfo: this.props.Login.userInfo,
            testgroupspecification: testGroupSpec,
            treetemplatemanipulation: this.props.Login.masterData.selectedNode,
            selectedspecification: this.props.Login.masterData.SelectedSpecification,
            ntreeversiontempcode: ntreeversiontempcode,
            selectedCopyNodeManipulationCode : selectedCopyNodeManipulationCode
        }
        

        const inputParam = {
            inputData,
            classUrl: "testgroup",
            operation: operation,
            methodUrl: "Specification",
            saveType, formRef,
            selectedRecord: {...this.state.selectedRecord}
        }
        return inputParam;
    }

    onSaveComponent = (saveType, formRef) => {
        const masterData = this.props.Login.masterData;
        const selectedRecord = this.state.selectedRecord;
        const testArray = selectedRecord.ntestcode.map(test => { return {...test.item,nisvisible:transactionStatus.YES,nisadhoctest:transactionStatus.NO}});
        const inputData = {
            testgroupspecification: masterData.SelectedSpecification,
            testgroupspecsampletype: [selectedRecord.ncomponentcode.item],
            testgrouptest: testArray,
            userinfo: this.props.Login.userInfo,
            genericlabel:this.props.Login.genericLabel
        }
        const inputParam = {
            inputData,
            classUrl: "testgroup",
            operation: this.props.Login.operation,
            methodUrl: "Component",
            saveType, formRef
        }
        return inputParam;
    }

    onSaveSpecFile = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.sfilename;
        const nattachmenttypecode = selectedRecord.nattachmenttypecode;
        let isFileEdited = transactionStatus.NO;
        let specFileArray = [];
        const selectedSpecification = this.props.Login.masterData.SelectedSpecification;
        let specFile = {
            nallottedspeccode: selectedSpecification.nallottedspeccode,
            nspecfilecode: selectedRecord.nspecfilecode ? selectedRecord.nspecfilecode : 0,
            nstatus: transactionStatus.ACTIVE,
            nattachmenttypecode
        };
        const formData = new FormData();
        if (nattachmenttypecode === attachmentType.FTP) {
            if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                acceptedFiles.forEach((file, index) => {
                    const tempData = Object.assign({}, specFile);
                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                    const uniquefilename = nattachmenttypecode === attachmentType.FTP ? create_UUID() + '.' + fileExtension : "";
                    tempData["sfilename"] =Lims_JSON_stringify(file.name,false);
                    tempData["sdescription"] =Lims_JSON_stringify(replaceBackSlash( selectedRecord.sdescription ? selectedRecord.sdescription.trim() : ""),false);
                    tempData["nlinkcode"] = transactionStatus.NA;
                    tempData["ssystemfilename"] = uniquefilename;
                    tempData["nfilesize"] = file.size;
                    formData.append("uploadedFile" + index, file);
                    formData.append("uniquefilename" + index, uniquefilename);
                    specFileArray.push(tempData);
                });
                formData.append("filecount", acceptedFiles.length);
                isFileEdited = transactionStatus.YES;
            } else {
                specFile["sfilename"] =Lims_JSON_stringify(selectedRecord.sfilename,false);
                specFile["sdescription"] =Lims_JSON_stringify(replaceBackSlash(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : ""),false) ;
                specFile["nlinkcode"] = transactionStatus.NA;
                specFile["ssystemfilename"] = selectedRecord.ssystemfilename;
                specFile["nfilesize"] = selectedRecord.nfilesize;
                specFileArray.push(specFile);
            }
        } else {
            specFile["sfilename"] =Lims_JSON_stringify( replaceBackSlash(selectedRecord.slinkfilename.trim()),false) ;
            specFile["sdescription"] =Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.trim() : ""),false);
            specFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
            specFile["ssystemfilename"] = "";
            specFile["nfilesize"] = 0;
            specFileArray.push(specFile);
        }
        formData.append("isFileEdited", isFileEdited);
        formData.append("testgroupspecification", JSON.stringify(selectedSpecification));
        formData.append("testgroupspecfile", JSON.stringify(specFileArray));
        const inputParam = {
           // inputData: { userinfo: this.props.Login.userInfo },
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                    //ALPD-1628(while saving the file and link,audit trail is not captured the respective language)
                    slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
                }
            },
            formData: formData,
            isFileupload: true,
            operation: this.props.Login.operation,
            classUrl: "testgroup",
            saveType, formRef, methodUrl: "SpecificationFile",
            selectedRecord: {...this.state.selectedRecord}
        }
        return inputParam;
    }

    deleteSpecRecord = (deleteParam) => {
        const selectedRecord = deleteParam.selectedRecord;

        const masterData = this.props.Login.masterData;
        const ntreeversiontempcode = masterData["TreeTemplateManipulation"][0].ntreeversiontempcode;
        const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
            x => x["ntreeversiontempcode"] === ntreeversiontempcode);

        const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
        if (templateVersionStatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
        }
        else {
            if (selectedRecord.napprovalstatus === transactionStatus.DRAFT
                || selectedRecord.napprovalstatus === transactionStatus.CORRECTION) {
                this.deleteRecord(deleteParam);
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION" }));
            }
        }
    }

    deleteRecord = (deleteParam) => {
        if (this.props.Login.masterData.selectedNode !== undefined && this.props.Login.masterData.selectedNode !== null) {
            const masterData = this.props.Login.masterData;
            const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
                x => x["ntreeversiontempcode"] === masterData.selectedNode["ntreeversiontempcode"]);

            const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
            if (templateVersionStatus === transactionStatus.RETIRED) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
            }
            else {
                if (this.props.Login.masterData.selectedNode) {
                    const methodUrl = deleteParam.methodUrl;
                    let dataState = this.state.componentDataState;
                    const screenName = deleteParam.screenName;
                    const inputParam = {
                        inputData: {
                            [deleteParam.keyName]: deleteParam.selectedRecord,
                            userinfo: this.props.Login.userInfo,
                            genericlabel: this.props.Login.genericLabel,
                            testgroupspecification: this.props.Login.masterData.SelectedSpecification,
                            treetemplatemanipulation: this.props.Login.masterData.selectedNode,
                            ntreeversiontempcode: deleteParam.filterData.ntreeversiontempcode.value
                        },
                        classUrl: "testgroup",
                        operation: deleteParam.operation,
                        methodUrl: methodUrl,
                        screenName, dataState
                    }
                    const masterData = this.props.Login.masterData;
                    //if (showEsign(this.state.controlMap, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                loadEsign: true, screenData: { inputParam, masterData },
                                openModal: true, screenName: screenName, operation: deleteParam.operation, selectedRecord: {}
                            }
                        }
                        this.props.updateStore(updateInfo);
                    } else {
                        this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal", {});
                    }
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPROFILENODE" }));
                }
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPROFILENODE" }));
        }
    }

    deleteMultipleRecord = (deleteParam) => {
        //console.log("delete component:", deleteParam, this.props.Login.masterData);
        const masterData = this.props.Login.masterData;
        const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
            x => x["ntreeversiontempcode"] === masterData.selectedNode["ntreeversiontempcode"]);

        const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
        if (templateVersionStatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
        }
        else {
            const testgroupspecification = this.props.Login.masterData.SelectedSpecification;
            if (testgroupspecification.napprovalstatus === transactionStatus.DRAFT
                || testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {
                const inputParam = {
                    inputData: {
                        testgroupspecsampletype: deleteParam.props.testgroupspecsampletype,
                        userinfo: this.props.Login.userInfo,
                        genericlabel:this.props.Login.genericLabel,
                        testgroupspecification,
                        treetemplatemanipulation: this.props.Login.masterData.selectedNode
                    },
                    classUrl: "testgroup",
                    operation: "delete",
                    methodUrl: "TestGroupComponent",
                    screenName:this.props.Login.genericLabel && this.props.Login.genericLabel["Component"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] 
                }
                const masterData = this.props.Login.masterData;
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData },
                            openModal: true, screenName:this.props.Login.genericLabel && this.props.Login.genericLabel["Component"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] , operation: "delete", selectedRecord: {}
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal", {});
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION" }));
            }
        }
    }

    onDropSpecFile = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }

    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

        this.setState({
            selectedRecord, actionType: "delete" //fileToDelete:file.name 
        });
    }

    validateTestGroupComplete = (operation, inputValue, ncontrolCode) => {
        if (this.props.Login.masterData.selectedNode !== undefined && this.props.Login.masterData.selectedNode !== null) {
            const masterData = this.props.Login.masterData;
            const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
                x => x["ntreeversiontempcode"] === masterData.selectedNode["ntreeversiontempcode"]);

            const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
            if (templateVersionStatus === transactionStatus.RETIRED) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
            }
            else {
                if (inputValue.testgroupspecification) {
                    if (inputValue.testgroupspecification.napprovalstatus === transactionStatus.DRAFT
                        || inputValue.testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {
                        return rsapi.post("testgroup/validateTestGroupComplete", {
                            nallottedspeccode: inputValue.testgroupspecification.nallottedspeccode,
                            "userinfo": this.props.Login.userInfo
                        })
                            .then(response => {
                                if (response.data && response.data.length > 0) {
                                    const inactiveTestArray = [];
                                    response.data.map(item => inactiveTestArray.indexOf(item.stestname) === -1 ? inactiveTestArray.push(item.stestname) : "");
                                    const data = " [" + inactiveTestArray + "] " + this.props.intl.formatMessage({ id: "IDS_INACTIVETESTSATCOMPLETE" })
                                    this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                                        this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                                        data,
                                        this.props.intl.formatMessage({ id: "IDS_OK" }),
                                        this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                                        () => this.completeSpecification(operation, inputValue, ncontrolCode),
                                        false,
                                        undefined);
                                }
                                else {
                                    this.completeSpecification(operation, inputValue, ncontrolCode);
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
                    else {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION" }));
                    }
                }
                else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }));
                }
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }));
        }
    }

    retireSpec = (operation, selectedSpecification, approvalRoleActionDetail, retireSpecId) => {
        if (selectedSpecification.testgroupspecification.napprovalstatus !== transactionStatus.RETIRED) {
            if (approvalRoleActionDetail.length > 0 && approvalRoleActionDetail[0].nlevelno === transactionStatus.ACTIVE) {
                if (selectedSpecification.testgroupspecification["napprovalstatus"] === approvalRoleActionDetail[0].ntransactionstatus) {
                    const inputParam = {
                        inputData: {
                            nallottedspeccode: selectedSpecification.testgroupspecification,
                            treetemplatemanipulation: selectedSpecification.treetemplatemanipulation,
                            approvalRoleActionDetail: approvalRoleActionDetail[0],
                            userinfo: this.props.Login.userInfo,
                            operation: operation
                        },
                        classUrl: "testgroup",
                        operation: operation,
                        methodUrl: "Spec",
                        screenName: "IDS_STUDYPLAN"
                    }


                    let masterData = this.props.Login.masterData
                    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, retireSpecId)) {
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                loadEsign: true, screenData: { inputParam, masterData },
                                openModal: true, screenName: "IDS_STUDYPLAN", operation: operation, selectedRecord: {}
                            }
                        }
                        this.props.updateStore(updateInfo);
                    } else {
                        this.props.retireSpecification(inputParam.inputData, masterData);
                    }
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_RETIRECANBECONEAFTERFINAL" }));
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_FINALLEVELAPPROVE" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYRETIRED" }));
        }

    }

    onDownloadClick = (reportSpecId) => {
        if (this.props.Login.masterData.SelectedComponent && this.props.Login.masterData.SelectedTest) {
        const inputParam = {
    
            Vnallottedspeccode:this.props.Login.masterData['SelectedSpecification'].nallottedspeccode,  
            ntransactionstatus:this.props.Login.masterData.SelectedSpecification.napprovalstatus,

        }
        //this.props.reportSpecification(inputParam['inputData']);
        this.props.generateControlBasedReport(reportSpecId,inputParam,this.props.Login,"Vnallottedspeccode",this.props.Login.masterData.SelectedComponent.nallottedspeccode);
    } else {
        toast.warn(this.props.intl.formatMessage({ id: "IDS_REPORTCANNOTGENERATEFORCOMPWITHOUTTEST" }));
    }
    
    }


    specificationReport = (operation, ncontrolCode) => {
        if (this.props.Login.masterData.SelectedComponent && this.props.Login.masterData.SelectedTest) {
            const inputParam = {
                inputData: {
                    sprimarykeyname: 'nallottedspeccode',
                    userinfo: this.props.Login.userInfo,
                    ncontrolcode: ncontrolCode,
                    nregtypecode: transactionStatus.NA,
                    nregsubtypecode: transactionStatus.NA,
                    nreportmodulecode: transactionStatus.NA,
                    nreporttypecode: REPORTTYPE.CONTROLBASED,
                    nreportdecisiontypecode: transactionStatus.NA,
                    certificatetypecode: transactionStatus.NA,
                    nsectioncode: transactionStatus.NA,
                    operation: operation,
                    nallottedspeccode: this.props.Login.masterData['SelectedSpecification']['nallottedspeccode'],
                    selectedComponent: this.props.Login.masterData["SelectedComponent"],
                    selectedTest: this.props.Login.masterData["SelectedTest"],
                    filterData: this.state.filterData

                },
            }
            this.props.reportSpecification(inputParam['inputData']);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_REPORTCANNOTGENERATEFORCOMPWITHOUTTEST" }));
        }
    }

    completeSpecification = (operation, inputValue, ncontrolCode) => {
        if (inputValue.testgroupspecification) {
            if (inputValue.testgroupspecification.napprovalstatus === transactionStatus.DRAFT
                || inputValue.testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {

                const inputParam = {
                    inputData: {
                        userinfo: this.props.Login.userInfo,
                        ntreeversiontempcode: this.state.filterData.ntreeversiontempcode.value,
                        testGroupTest: this.props.Login.masterData.TestGroupTest,
                        // ALPD-5329 - Gowtham R - In test group specification record getting Auto Approved when configuration for test group approval not done
                        isQualisLite:(this.props.Login.settings && parseInt(this.props.Login.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO,
                        ...inputValue
                    },
                    classUrl: "testgroup",
                    operation: operation,
                    methodUrl: "Specification",
                    screenName: "IDS_SPECIFICATION"
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                            openModal: true, screenName: "IDS_SPECIFICATION", operation: operation, selectedRecord: {}
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal", {});
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }));
        }
    }

    approveSpecification = (status, needEsign) => {
        const masterData = this.props.Login.masterData;
        const inputParam = {
            inputData: {
                userinfo: this.props.Login.userInfo,
                treetemplatemanipulation: masterData.selectedNode,
                ntreeversiontempcode: this.state.filterData.ntreeversiontempcode.value,
                testgroupspecification: {
                    ...masterData.SelectedSpecification,
                    napprovalstatus: status
                }
            },
            classUrl: "testgroup",
            operation: "approve",
            methodUrl: "Specification",
            screenName: "IDS_SPECIFICATION"
        }
        if (needEsign === transactionStatus.YES) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "IDS_SPECIFICATION", operation: "approve", selectedRecord: {}
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.crudMaster(inputParam, masterData, "openModal", {});
        }
    }

    onComboChange = (comboData, fieldName, caseNo, optional) => {
        let selectedRecord = this.state.selectedRecord || {};
        switch (caseNo) {
            case 1:
                if (fieldName === "ntestcode") {
                    selectedRecord[fieldName] = comboData;
                    this.setState({ selectedRecord });
                } else {
                    selectedRecord[fieldName] = comboData;
                    this.setState({ selectedRecord });
                }
                break;

            case 2:
                selectedRecord["parameterTypeCode"] = comboData.value;
                selectedRecord[fieldName] = comboData;
                this.setState({ selectedRecord });
                break;

            case 3:
                selectedRecord["schecklistversionname"] = comboData.item.schecklistversionname;
                selectedRecord[fieldName] = comboData;
                this.setState({ selectedRecord });
                break;

            default:
                break;
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
        this.props.validateEsignCredential(inputParam, "openModal");
    }

    generateBreadCrumData(filterData) {
        if (filterData && Object.values(filterData).length > 0 && filterData.nsampletypecode && filterData.nsampletypecode.item) {
            // if (filterData.nsampletypecode && filterData.nproductcatcode 
            //     && filterData.nproductcatcode.item.ncategorybasedflow === transactionStatus.YES 
            //     && filterData.nsampletypecode.item.ncategorybasedflowrequired == transactionStatus.NO) 
            if (filterData.nsampletypecode && filterData.nsampletypecode.item.ncategorybasedflowrequired == transactionStatus.YES ? true : filterData.nproductcatcode 
                && filterData.nproductcatcode.item.ncategorybasedflow === transactionStatus.YES ? true:false) 
                {
                this.breadCrumbData = [
                    {
                        "label": "IDS_SAMPLETYPE",
                        "value": filterData.nsampletypecode ? filterData.nsampletypecode.label : ""
                    },
                    {
                        "label": filterData.nsampletypecode.item.nformcode === formCode.PRODUCTCATEGORY ?this.props.Login.genericLabel && this.props.Login.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode]  :
                            filterData.nsampletypecode.item.nformcode === formCode.INSTRUMENTCATEGORY ? "IDS_INSTRUMENTCATEGORY" :
                                filterData.nsampletypecode.item.nformcode === formCode.MATERIALCATEGORY ? "IDS_MATERIALCATEGORY" : "",
                        "value": filterData.nproductcatcode ? filterData.nproductcatcode.label : ""
                    },
                    {
                        "label": "IDS_TREETEMPLATEVERSION",
                        "value": filterData.ntreeversiontempcode ? filterData.ntreeversiontempcode.label : ""
                    }
                ]
                if (filterData.nsampletypecode.value === SampleType.PROJECTSAMPLETYPE)
                {
                 if ( filterData.nsampletypecode.item.nprojectspecrequired === transactionStatus.YES) {
                    this.breadCrumbData.push(  {
                        "label": "IDS_PROJECTTYPE",
                        "value": filterData.nprojecttypecode ? filterData.nprojecttypecode.label : ""
                    },
                    {
                        "label": "IDS_PROJECT",
                        "value": filterData.nprojectmastercode ? filterData.nprojectmastercode.label : ""
                    })
                }
                }
            } else {
                this.breadCrumbData = [
                    {
                        "label": "IDS_SAMPLETYPE",
                        "value": filterData.nsampletypecode ? filterData.nsampletypecode.label : ""
                    },
                    {
                        "label": filterData.nsampletypecode.item.nformcode === formCode.PRODUCTCATEGORY ?this.props.Login.genericLabel && this.props.Login.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] :
                            filterData.nsampletypecode.item.nformcode === formCode.INSTRUMENTCATEGORY ? "IDS_INSTRUMENTCATEGORY" :
                                filterData.nsampletypecode.item.nformcode === formCode.MATERIALCATEGORY ? "IDS_MATERIALCATEGORY" : "",
                        "value": filterData.nproductcatcode ? filterData.nproductcatcode.label : ""
                    },

                    {
                        "label": filterData.nsampletypecode.item.nformcode === formCode.PRODUCTCATEGORY ? this.props.Login.genericLabel && this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode]  :
                            filterData.nsampletypecode.item.nformcode === formCode.INSTRUMENTCATEGORY ? "IDS_INSTRUMENT" :
                                filterData.nsampletypecode.item.nformcode === formCode.MATERIALCATEGORY ? "IDS_MATERIAL" : "",
                        "value": filterData.nproductcode ? filterData.nproductcode.label : ""
                    },
                    {
                        "label": "IDS_TREETEMPLATEVERSION",
                        "value": filterData.ntreeversiontempcode ? filterData.ntreeversiontempcode.label : ""
                    }
                ];
                if (filterData.nsampletypecode.value === SampleType.PROJECTSAMPLETYPE)
                {
                    if ( filterData.nsampletypecode.item.nprojectspecrequired === transactionStatus.YES) {
                    this.breadCrumbData.push(  {
                        "label": "IDS_PROJECTTYPE",
                        "value": filterData.nprojecttypecode ? filterData.nprojecttypecode.label : ""
                    },
                    {
                        "label": "IDS_PROJECT",
                        "value": filterData.nprojectmastercode ? filterData.nprojectmastercode.label : ""
                    })
                }
                }
            }

        }else{
            this.breadCrumbData = [
                {
                    "label": "IDS_SAMPLETYPE",
                    "value":filterData && filterData.nsampletypecode ? filterData.nsampletypecode.label : ""
                },
            ]
        }
    }

    updateSpiltterLayout() {
        if (this.myRef && this.myRef.current && this.myRef.current.clientHeight + 20 !== this.state.fixefScrollHeight) {

            this.setState({
                fixefScrollHeight: this.myRef.current.clientHeight + 20,
                disableSplit: true
            })
            //console.log(this.myRef.current.clientHeight)
            setTimeout(() => {
                this.setState({
                    disableSplit: false
                })
            })
        }

    }
    componentDidUpdate(previousProps, previousState) {
        let selectedRecord = this.state.selectedRecord;
        let selectedsubcodedresult = this.state.selectedsubcodedresult;
        let selectsubcodedelete = this.state.selectsubcodedelete;
        let filterData = this.state.filterData || {};
        let isStateChanged = false;
        let activeTabIndex = this.props.Login.activeTabIndex || 0;
        let activeTabId = this.props.Login.activeTabId || false;
        let selectedRecordCopy = this.props.Login.masterData.selectedRecordCopy;
        //let CopyActiveKey = this.state.selectedRecord && this.state.selectedRecord.CopyActiveKey ? this.state.selectedRecord.CopyActiveKey:"";
        //let CopyFocusKey =  this.state.selectedRecord && this.state.selectedRecord.CopyFocusKey ? this.state.selectedRecord.CopyFocusKey:"";
        this.updateSpiltterLayout()
        let tempFilterData = this.state.tempFilterData || {};
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            selectedRecord = this.props.Login.selectedRecord;
            // if(CopyActiveKey!=="")
            // {
            // selectedRecord.CopyActiveKey=CopyActiveKey;
            // selectedRecord.CopyFocusKey=CopyFocusKey;
            // }
            isStateChanged = true;
        }
        if (this.props.Login.selectedsubcodedresult !== previousProps.Login.selectedsubcodedresult) {
           selectedsubcodedresult = this.props.Login.selectedsubcodedresult;
            //selectedsubcodedresult = this.state.selectedsubcodedresult;
            isStateChanged = true;
        }
        if (this.props.Login.selectsubcodedelete !== previousProps.Login.selectsubcodedelete) {
            selectsubcodedelete = this.props.Login.selectsubcodedelete;
             //selectedsubcodedresult = this.state.selectedsubcodedresult;
             isStateChanged = true;
         }
        if (this.props.Login.activeTabIndex !== previousProps.Login.activeTabIndex || this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.activeTabIndex !== previousProps.Login.activeTabIndex) {
                activeTabIndex = this.props.Login.activeTabIndex;
                activeTabId = this.props.Login.activeTabId;
                isStateChanged = true;
                // this.setState({
                //     activeTabIndex,
                //     activeTabId
                // });
            }
        }
        if (this.props.Login.tempFilterData !== previousProps.Login.tempFilterData) {
            tempFilterData = this.props.Login.tempFilterData || {};
            isStateChanged = true;
        }
        let sampleType = this.state.sampleType || [];
        if (this.props.Login.masterData.SampleType !== previousProps.Login.masterData.SampleType) {
            const sampleTypeMap = constructOptionList(this.props.Login.masterData.SampleType || [], "nsampletypecode", "ssampletypename", "nsorter", "ascending", false);
            sampleType = sampleTypeMap.get("OptionList");
            tempFilterData["nsampletypecode"] = sampleType.length ? sampleType[0] : "";
            isStateChanged = true;
        }
        let productCategory = this.state.productCategory || [];
        if (this.props.Login.masterData.ProductCategory !== previousProps.Login.masterData.ProductCategory) {
            const productCatMap = constructOptionList(this.props.Login.masterData.ProductCategory || [], "nproductcatcode", "sproductcatname", "nproductcatcode", "ascending", false);
            productCategory = productCatMap.get("OptionList");
            tempFilterData["nproductcatcode"] = productCategory.length > 0 ? productCategory[0] : "";
            isStateChanged = true;
        }
        let product = this.state.product || [];
        if (this.props.Login.masterData.Product !== previousProps.Login.masterData.Product) {
            const productMap = constructOptionList(this.props.Login.masterData.Product || [], "nproductcode", "sproductname", "nproductcode", "ascending", false);
            product = productMap.get("OptionList");
            tempFilterData["nproductcode"] = product.length > 0 ? product[0] : undefined;
            isStateChanged = true;
        }
        let projectType = this.state.projectType || [];
        if (this.props.Login.masterData.ProjectTypeList !== previousProps.Login.masterData.ProjectTypeList) {
            const projectTypeMap = constructOptionList(this.props.Login.masterData.ProjectTypeList || [], "nprojecttypecode", 
                        "sprojecttypename", "nprojecttypecode", "ascending", false);
            projectType = projectTypeMap.get("OptionList");
            tempFilterData["nprojecttypecode"] = projectType.length > 0 ? projectType[0] : undefined;
            isStateChanged = true;
        }
        let project = this.state.project || [];
        if (this.props.Login.masterData.ProjectMasterList !== previousProps.Login.masterData.ProjectMasterList) {
            const projectMasterMap = constructOptionList(this.props.Login.masterData.ProjectMasterList || [], "nprojectmastercode", 
                        "sprojectcode", "nprojectmastercode", "ascending", false);
            project = projectMasterMap.get("OptionList");
            tempFilterData["nprojectmastercode"] = project.length > 0 ? project[0] : undefined;
            isStateChanged = true;
        }
        let treeVersionTemplate = this.state.treeVersionTemplate || [];
        if (this.props.Login.masterData.TreeVersionTemplate !== previousProps.Login.masterData.TreeVersionTemplate) {
            const templateMap = constructOptionList(this.props.Login.masterData.TreeVersionTemplate || [], "ntreeversiontempcode", "sversiondescription", "ntreeversiontempcode", "ascending", false);
            treeVersionTemplate = templateMap.get("OptionList");
            tempFilterData["ntreeversiontempcode"] = treeVersionTemplate.length > 0 ? treeVersionTemplate[treeVersionTemplate.length - 1] : "";
            isStateChanged = true;
        }

        // if (this.props.Login.masterData.TestGroupTestParameter && this.props.Login.masterData.TestGroupTestParameter !== previousProps.Login.masterData.TestGroupTestParameter) {
        //     sortData(this.props.Login.masterData.TestGroupTestParameter, "ascending", "nsorter");
        // }

        // if (this.props.Login.masterData.TestGroupTesT && this.props.Login.masterData.TestGroupTesT !== previousProps.Login.masterData.TestGroupTesT) {
        //     sortData(this.props.Login.masterData.TestGroupTesTest, "ascending", "nsorter");
        // }

        let userRoleControlRights = this.state.userRoleControlRights || [];
        let controlMap = this.state.controlMap || [];
        if (this.props.Login.userInfo && this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const nformCode = this.props.Login.userInfo.nformcode;
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[nformCode] && Object.values(this.props.Login.userRoleControlRights[nformCode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode));
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, nformCode);
            filterData = { ...tempFilterData };
            this.generateBreadCrumData(filterData);
        }
	//ALPD-5529--Vignesh R(06-03-2025)-->Test group screen -> Profile showing wrongly in specific scenario.
        if (this.props.Login.masterData.filterData !== previousProps.Login.masterData.filterData) {
            filterData = { ...this.props.Login.masterData.filterData };
            this.generateBreadCrumData(filterData);
            isStateChanged = true;
        }
        else{
             this.generateBreadCrumData(filterData);
        }
        // else if (filterData !== previousState.filterData) {
        //     filterData = { ...tempFilterData };
        //     this.generateBreadCrumData(filterData);
        // }

        let historyDataState = this.state.historyDataState;
        if (this.props.Login.historyDataState && this.props.Login.historyDataState !== previousProps.Login.historyDataState) {
            historyDataState = this.props.Login.historyDataState;
            isStateChanged = true;
        }

        let { testskip, testtake } = this.state;
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            testskip = this.props.Login.testskip === undefined ? testskip : this.props.Login.testskip
            testtake = testtake ? testtake : this.props.Login.testtake
            isStateChanged = true;
        } 
        let { skipRulesEngine, takeRulesEngine } = this.state;
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            skipRulesEngine = this.props.Login.skipRulesEngine === undefined ? skipRulesEngine : this.props.Login.skipRulesEngine
            takeRulesEngine = takeRulesEngine ? takeRulesEngine : this.props.Login.takeRulesEngine
            isStateChanged = true;
        }
        if (isStateChanged) {
            this.setState({
                selectedRecord,selectedRecordCopy, tempFilterData, filterData, userRoleControlRights, controlMap,
                sampleType, productCategory, product, treeVersionTemplate, historyDataState,
                testskip, testtake, projectType, project,activeTabIndex, activeTabId, skipRulesEngine, takeRulesEngine,selectedsubcodedresult,selectsubcodedelete
            });
        }
    }

}


const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

export default connect(mapStateToProps, {
    callService, crudMaster, filterTestGroup, createTree, editTree, sampleTypeOnChange,
    getTestGroupDetails, validateEsignCredential, updateStore, addSpecification, getSpecification, addComponent,
    changeTestCategory, addTestGroupTest, editTestGroupTest, getTestGroupParameter, editTestGroupParameter,
    addTestFile, editSpecFile, getSpecificationDetails, addTestGroupCodedResult, getComponentBySpecId, filterColumnData,
    viewAttachment, viewTestGroupCheckList, getTestGroupComponentDetails, filterTransactionList, reportSpecification, retireSpecification, getDataForTestMaterial, getEditTestGroupRulesEngine,
    getMaterialCategoryBasedMaterialType, getMaterialBasedMaterialCategory, getTestGroupMaterial, getDataForEditTestMaterial, addTestGroupNumericTab, getTestGroupRulesEngineAdd,
    getSelectedTestGroupRulesEngine, getParameterforEnforce, getParameterRulesEngine, getParameterResultValue, subCodedResultView, saveExecutionOrder, getPredefinedDataRulesEngine,getCopyValues,
    generateControlBasedReport,getSpecDetailsForCopy,getSpecificationComboServices,getComponentComboServices,getRulesTestComboServices,getProductComboServices,getProfileRootComboServices
})(injectIntl(TestGroup));